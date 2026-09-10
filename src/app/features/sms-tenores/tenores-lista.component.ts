import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { SmsTenoresService, guardarArchivo, mensajeDeError, nombreArchivoTenor } from './sms-tenores.service';
import { GrupoTenores, Tenor } from './sms-tenores.models';

interface ParteMensaje {
  texto: string;
  variable: boolean;
}

interface TenorVista extends Tenor {
  partes: ParteMensaje[];
}

interface GrupoVista extends Omit<GrupoTenores, 'tenores'> {
  tenores: TenorVista[];
}

/**
 * Lista de tenores agrupados por subcartera.
 *
 * El número de clientes de cada tarjeta es el conteo guardado en el tenor: se
 * recalcula una vez al día después de la carga y bajo demanda, nunca al abrir la
 * pantalla, que así no lanza consultas sobre la cartera.
 */
@Component({
  selector: 'app-tenores-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header class="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 class="text-xl font-bold tracking-tight">Gestión de Tenores</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400">Agrupados por subcartera · el conteo se actualiza con la carga diaria</p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <label class="relative block">
            <span class="sr-only">Buscar tenor</span>
            <lucide-angular name="search" [size]="15" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"></lucide-angular>
            <input type="search" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)"
                   placeholder="Buscar tenor o texto del mensaje"
                   class="h-10 w-72 rounded-lg border border-[#8491a3] bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100" />
          </label>
          <a routerLink="/sms/tenores/nuevo"
             class="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            <lucide-angular name="plus" [size]="16"></lucide-angular>
            Nuevo tenor
          </a>
        </div>
      </header>

      <main class="space-y-7 px-7 py-6">
        @if (cargando()) {
          <p class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
            Cargando tenores…
          </p>
        } @else if (!visibles().length && !archivados().length) {
          <div class="rounded-xl border border-dashed border-[#8491a3] bg-white px-6 py-10 text-center dark:bg-slate-900">
            <p class="font-semibold">{{ busqueda() ? 'Ningún tenor coincide con la búsqueda.' : 'Todavía no hay tenores.' }}</p>
            @if (!busqueda()) {
              <a routerLink="/sms/tenores/nuevo" class="mt-2 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400">Crear el primero</a>
            }
          </div>
        }

        @for (grupo of visibles(); track grupo.idSubcartera) {
          <section>
            <button type="button" (click)="alternar(grupo.idSubcartera)" [attr.aria-expanded]="!plegado(grupo.idSubcartera)"
                    class="flex w-full items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
              <lucide-angular [name]="plegado(grupo.idSubcartera) ? 'chevron-right' : 'chevron-down'" [size]="16"></lucide-angular>
              <span class="text-base font-bold">{{ grupo.nombreSubcartera }}</span>
              <span class="text-sm text-slate-600 dark:text-slate-400">{{ grupo.nombreCartera }}</span>
              <span class="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {{ grupo.tenores.length }} {{ grupo.tenores.length === 1 ? 'tenor' : 'tenores' }}
              </span>
              <span class="text-sm tabular-nums text-slate-600 dark:text-slate-400">{{ grupo.clientesEnCartera | number }} clientes en la cartera</span>
              <span class="h-px flex-1 bg-slate-200 dark:bg-slate-800"></span>
            </button>

            @if (!plegado(grupo.idSubcartera)) {
              <div class="mt-3 grid grid-cols-1 gap-3.5 xl:grid-cols-2">
                @for (t of grupo.tenores; track t.id) {
                  <article class="flex flex-col gap-3 rounded-xl border p-4"
                           [ngClass]="alerta(t) ? 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'">
                    <div class="flex items-start justify-between gap-3">
                      <h2 class="text-[15px] font-bold leading-snug">{{ t.nombre }}</h2>
                      <div class="flex shrink-0 items-center gap-1.5">
                        <a [routerLink]="['/sms/tenores', t.id]"
                           class="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#8491a3] bg-white px-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                          <lucide-angular name="pencil" [size]="13"></lucide-angular>
                          Editar
                        </a>
                        <button type="button" (click)="descargar(t)" [disabled]="alerta(t) || ocupado() === t.id"
                                class="inline-flex h-8 items-center gap-1.5 rounded-md bg-slate-900 px-2.5 text-xs font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 dark:bg-white dark:text-slate-900 dark:disabled:bg-slate-700 dark:disabled:text-slate-400">
                          <lucide-angular [name]="ocupado() === t.id ? 'loader-2' : 'download'" [size]="13" [class.animate-spin]="ocupado() === t.id"></lucide-angular>
                          Descargar
                        </button>
                      </div>
                    </div>

                    <p class="rounded-xl rounded-bl-sm bg-slate-100 px-3.5 py-3 text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                      @for (parte of t.partes; track $index) {
                        @if (parte.variable) {
                          <span class="font-semibold text-blue-700 dark:text-blue-400">{{ parte.texto }}</span>
                        } @else {
                          <span>{{ parte.texto }}</span>
                        }
                      }
                    </p>

                    <div class="flex flex-wrap items-end justify-between gap-3">
                      <div class="flex flex-wrap gap-1.5">
                        @for (variable of t.variables; track variable) {
                          <span class="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">{{ variable }}</span>
                        }
                      </div>
                      @if (t.conteoError) {
                        <p class="flex max-w-xs items-start gap-1.5 text-right text-xs font-semibold text-amber-800 dark:text-amber-300">
                          <lucide-angular name="alert-triangle" [size]="14" class="mt-px shrink-0"></lucide-angular>
                          {{ t.conteoError }}
                        </p>
                      } @else {
                        <p class="text-right">
                          <span class="text-xl font-bold tabular-nums" [class.text-amber-800]="t.clientesHoy === 0">{{ (t.clientesHoy ?? 0) | number }}</span>
                          <span class="ml-1 text-xs" [ngClass]="t.clientesHoy === 0 ? 'text-amber-800 dark:text-amber-300' : 'text-slate-600 dark:text-slate-400'">
                            {{ t.clientesHoy === 0 ? 'clientes · descarga bloqueada' : 'clientes' }}
                          </span>
                        </p>
                      }
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-2.5 dark:border-slate-800">
                      <span class="text-xs text-slate-600 dark:text-slate-400">
                        {{ t.conteoCalculadoAt ? 'Conteo del ' + (t.conteoCalculadoAt | date: 'dd/MM HH:mm') : 'Sin conteo todavía' }}
                      </span>
                      <div class="flex items-center gap-3">
                        <button type="button" (click)="recalcular(t)" [disabled]="ocupado() === t.id"
                                class="inline-flex items-center gap-1 rounded text-xs font-semibold text-slate-700 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 dark:text-slate-300 dark:hover:text-white">
                          <lucide-angular name="refresh-cw" [size]="12"></lucide-angular>
                          Recalcular
                        </button>
                        <button type="button" (click)="archivar(t)" [disabled]="ocupado() === t.id"
                                class="inline-flex items-center gap-1 rounded text-xs font-semibold text-slate-700 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 dark:text-slate-300 dark:hover:text-red-400">
                          <lucide-angular name="archive" [size]="12"></lucide-angular>
                          Archivar
                        </button>
                      </div>
                    </div>
                  </article>
                }
              </div>
            }
          </section>
        }

        @if (archivados().length) {
          <section>
            <button type="button" (click)="archivadosAbiertos.set(!archivadosAbiertos())" [attr.aria-expanded]="archivadosAbiertos()"
                    class="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#8491a3] bg-white px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-slate-900">
              <lucide-angular [name]="archivadosAbiertos() ? 'chevron-down' : 'chevron-right'" [size]="16"></lucide-angular>
              <span class="font-bold">Archivados</span>
              <span class="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{{ archivados().length }}</span>
              <span class="text-sm text-slate-600 dark:text-slate-400">Se conservan como referencia y no generan archivo</span>
            </button>
            @if (archivadosAbiertos()) {
              <ul class="mt-2 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                @for (t of archivados(); track t.id) {
                  <li class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span class="font-semibold">{{ t.nombre }}</span>
                    <span class="text-sm text-slate-600 dark:text-slate-400">{{ t.nombreSubcartera }} · {{ t.origen === 'FOH' ? 'traído de la base anterior' : 'archivado' }}</span>
                  </li>
                }
              </ul>
            }
          </section>
        }
      </main>
    </div>
  `
})
export class TenoresListaComponent implements OnInit {
  private readonly api = inject(SmsTenoresService);
  private readonly toast = inject(ToastService);

  readonly grupos = signal<GrupoTenores[]>([]);
  readonly cargando = signal(true);
  readonly busqueda = signal('');
  readonly ocupado = signal<number | null>(null);
  readonly archivadosAbiertos = signal(false);
  private readonly plegados = signal<ReadonlySet<number>>(new Set<number>());

  /** Grupos con sus tenores activos que coinciden con la búsqueda. */
  readonly visibles = computed<GrupoVista[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.grupos()
      .map(grupo => ({
        ...grupo,
        tenores: grupo.tenores.filter(t => t.estado === 'ACTIVO' && coincide(t, consulta)).map(vista)
      }))
      .filter(grupo => grupo.tenores.length > 0);
  });

  readonly archivados = computed<Tenor[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.grupos()
      .flatMap(grupo => grupo.tenores)
      .filter(t => t.estado === 'ARCHIVADO' && coincide(t, consulta));
  });

  ngOnInit(): void {
    this.cargar();
  }

  plegado(idSubcartera: number): boolean {
    return this.plegados().has(idSubcartera);
  }

  alternar(idSubcartera: number): void {
    this.plegados.update(actual => {
      const siguiente = new Set(actual);
      if (siguiente.has(idSubcartera)) {
        siguiente.delete(idSubcartera);
      } else {
        siguiente.add(idSubcartera);
      }
      return siguiente;
    });
  }

  /** Tarjeta en alerta: el tenor no se puede calcular o hoy no alcanza a ningún cliente. */
  alerta(t: Tenor): boolean {
    return !!t.conteoError || t.clientesHoy === 0;
  }

  descargar(t: Tenor): void {
    this.ocupado.set(t.id);
    this.api.exportable(t.id).subscribe({
      next: estado => {
        if (!estado.exportable) {
          this.toast.warning(estado.motivo ?? 'El archivo no se puede generar.');
          this.ocupado.set(null);
          return;
        }
        this.api.descargar(t.id).subscribe({
          next: blob => {
            guardarArchivo(blob, nombreArchivoTenor(t.id));
            this.ocupado.set(null);
          },
          error: () => {
            this.toast.error('No se pudo descargar el archivo.');
            this.ocupado.set(null);
          }
        });
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo comprobar el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  recalcular(t: Tenor): void {
    this.ocupado.set(t.id);
    this.api.recalcular(t.id).subscribe({
      next: actualizado => {
        this.reemplazar(actualizado);
        this.ocupado.set(null);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo recalcular el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  archivar(t: Tenor): void {
    if (!confirm(`¿Archivar "${t.nombre}"? Dejará de generar archivos y quedará como referencia.`)) {
      return;
    }
    this.ocupado.set(t.id);
    this.api.archivar(t.id).subscribe({
      next: archivado => {
        this.reemplazar(archivado);
        this.toast.success('Tenor archivado.');
        this.ocupado.set(null);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo archivar el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api.listar().subscribe({
      next: grupos => {
        this.grupos.set(grupos);
        this.cargando.set(false);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudieron cargar los tenores.'));
        this.cargando.set(false);
      }
    });
  }

  private reemplazar(tenor: Tenor): void {
    this.grupos.update(grupos =>
      grupos.map(grupo => ({ ...grupo, tenores: grupo.tenores.map(t => (t.id === tenor.id ? tenor : t)) }))
    );
  }
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function coincide(t: Tenor, consulta: string): boolean {
  return !consulta || normalizar(t.nombre).includes(consulta) || normalizar(t.plantilla).includes(consulta);
}

function vista(t: Tenor): TenorVista {
  return { ...t, partes: partesDelMensaje(t.plantilla) };
}

/** Separa la plantilla en texto y variables para resaltar estas últimas. */
function partesDelMensaje(plantilla: string): ParteMensaje[] {
  const partes: ParteMensaje[] = [];
  const variable = /\{[A-Z0-9_]+\}/g;
  let desde = 0;
  let m: RegExpExecArray | null;
  while ((m = variable.exec(plantilla)) !== null) {
    if (m.index > desde) {
      partes.push({ texto: plantilla.slice(desde, m.index), variable: false });
    }
    partes.push({ texto: m[0], variable: true });
    desde = m.index + m[0].length;
  }
  if (desde < plantilla.length) {
    partes.push({ texto: plantilla.slice(desde), variable: false });
  }
  return partes;
}
