import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { SmsTenoresService, guardarArchivo, mensajeDeError, miles, nombreArchivoTenor } from './sms-tenores.service';
import { GrupoTenores, Tenor } from './sms-tenores.models';

/** Variables que muestra la tarjeta antes de "+N más". */
const VARIABLES_VISIBLES = 2;

/**
 * Lista de tenores agrupados por subcartera.
 *
 * El número de clientes de cada tarjeta es el conteo guardado en el tenor: se
 * recalcula una vez al día después de la carga y bajo demanda, nunca al abrir la
 * pantalla, que así no lanza consultas sobre la cartera.
 *
 * Estilos: el CSS global del tema claro sobrescribe enlaces, inputs, encabezados
 * y algunas utilidades (`p-3`, `mt-2`, `bg-slate-900`...), y como no está en una
 * capa gana a Tailwind. Por eso los colores van en hexadecimal, los enlaces con
 * aspecto de botón llevan `btn` y los controles usan utilidades con `!`. Los
 * iconos de lucide copian su `class` al svg: lo que los posiciona va en un span.
 */
@Component({
  selector: 'app-tenores-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">
      <div class="flex flex-wrap items-center justify-between gap-6 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-[3px]">
          <h1 class="!m-0 text-xl font-bold tracking-[-0.01em]">Gestión de Tenores</h1>
          <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Agrupados por subcartera{{ ultimoConteo() ? ' · conteo del ' + (ultimoConteo() | date: 'dd/MM HH:mm') : '' }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <label class="relative block">
            <span class="sr-only">Buscar tenor</span>
            <span class="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-[#5f6c80] dark:text-slate-400">
              <lucide-angular name="search" [size]="15" class="block"></lucide-angular>
            </span>
            <input type="search" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)"
                   placeholder="Buscar tenor o texto del mensaje"
                   class="h-[38px] w-[280px] rounded-lg border !border-[#8491a3] !bg-white pl-[35px] pr-3 text-[13.5px] !text-[#0f172a] placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-400" />
          </label>
          <a routerLink="/sms/tenores/nuevo"
             class="btn inline-flex h-[38px] items-center gap-[7px] rounded-lg bg-[#0f172a] px-4 text-[13.5px] font-semibold text-white hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
            Nuevo tenor
          </a>
        </div>
      </div>

      <main class="flex flex-col gap-5 px-7 py-[22px]">
        @if (cargando()) {
          <p class="flex items-center gap-2 text-[13px] text-[#5f6c80] dark:text-slate-400">
            <span class="inline-flex animate-spin"><lucide-angular name="loader-2" [size]="16" class="block"></lucide-angular></span>
            Cargando tenores…
          </p>
        } @else if (!visibles().length && !archivados().length) {
          <div class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#8491a3] bg-white px-6 py-10 text-center dark:border-slate-600 dark:bg-slate-900">
            <p class="text-[14.5px] font-bold">{{ busqueda() ? 'Ningún tenor coincide con la búsqueda.' : 'Todavía no hay tenores.' }}</p>
            @if (!busqueda()) {
              <a routerLink="/sms/tenores/nuevo" class="btn text-[13px] font-semibold text-[#2563eb] hover:underline dark:text-blue-400">Crear el primero</a>
            }
          </div>
        }

        @for (grupo of visibles(); track grupo.idSubcartera) {
          <section class="flex flex-col gap-3">
            @if (plegado(grupo.idSubcartera)) {
              <button type="button" (click)="alternar(grupo.idSubcartera)" aria-expanded="false"
                      class="flex w-full items-center gap-3 rounded-xl border border-[#e6e9ee] bg-white px-4 py-[13px] text-left hover:border-[#8491a3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600">
                <span class="flex text-[#5f6c80] dark:text-slate-400"><lucide-angular name="chevron-right" [size]="16" class="block"></lucide-angular></span>
                <span class="text-[14.5px] font-bold">{{ grupo.nombreSubcartera }}</span>
                @if (mostrarCartera(grupo)) {
                  <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ grupo.nombreCartera }}</span>
                }
                <span class="rounded-full bg-[#eef2f7] px-2.5 py-[3px] text-xs font-semibold tabular-nums text-[#475569] dark:bg-slate-800 dark:text-slate-300">{{ cuantosTenores(grupo.tenores.length) }}</span>
                <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ miles(grupo.clientesEnCartera) }} clientes en la cartera</span>
              </button>
            } @else {
              <button type="button" (click)="alternar(grupo.idSubcartera)" aria-expanded="true"
                      class="flex w-full items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]">
                <span class="flex"><lucide-angular name="chevron-down" [size]="16" class="block"></lucide-angular></span>
                <span class="text-[15px] font-bold">{{ grupo.nombreSubcartera }}</span>
                @if (mostrarCartera(grupo)) {
                  <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ grupo.nombreCartera }}</span>
                }
                <span class="rounded-full bg-[#eef2f7] px-2.5 py-[3px] text-xs font-semibold tabular-nums text-[#475569] dark:bg-slate-800 dark:text-slate-300">{{ cuantosTenores(grupo.tenores.length) }}</span>
                <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ miles(grupo.clientesEnCartera) }} clientes en la cartera</span>
                <span class="h-px flex-1 bg-[#e6e9ee] dark:bg-slate-800"></span>
              </button>

              <div class="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
                @for (t of grupo.tenores; track t.id) {
                  <article class="flex flex-col gap-3 rounded-xl border p-4"
                           [ngClass]="alerta(t) ? 'border-[#f3dcb4] bg-[#fffdf7] dark:border-amber-900 dark:bg-amber-950/20' : 'border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900'">
                    <div class="flex items-start justify-between gap-3">
                      <h2 class="!m-0 text-[14.5px] font-bold leading-snug">{{ t.nombre }}</h2>
                      <div class="flex shrink-0 gap-1.5">
                        <button type="button" (click)="descargar(t)" [disabled]="alerta(t) || ocupado() === t.id"
                                class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:border-[#f0e2c8] disabled:bg-[#fdf8ee] disabled:text-[#c9b48c] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:disabled:border-slate-700 dark:disabled:bg-slate-900 dark:disabled:text-slate-500">
                          <span class="inline-flex" [class.animate-spin]="ocupado() === t.id">
                            <lucide-angular [name]="ocupado() === t.id ? 'loader-2' : 'download'" [size]="14" class="block"></lucide-angular>
                          </span>
                          Descargar
                        </button>
                        <a [routerLink]="['/sms/tenores', t.id]"
                           class="btn inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-semibold !text-[#334155] hover:bg-[#f4f6f9] hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700">
                          <lucide-angular name="pencil" [size]="14" class="block"></lucide-angular>
                          Editar
                        </a>
                      </div>
                    </div>

                    <p class="rounded-[10px] rounded-bl-[3px] px-[13px] py-[11px] text-[13px] leading-[1.55] text-[#334155] dark:text-slate-200"
                       [ngClass]="alerta(t) ? 'bg-[#fdf6ea] dark:bg-amber-950/30' : 'bg-[#f4f6f9] dark:bg-slate-800'">{{ t.plantilla }}</p>

                    <div class="flex items-center justify-between gap-3">
                      @if (t.conteoError) {
                        <span class="flex items-start gap-1.5 text-xs font-semibold text-[#b45309] dark:text-amber-300">
                          <span class="mt-px flex shrink-0"><lucide-angular name="alert-triangle" [size]="13" class="block"></lucide-angular></span>
                          {{ t.conteoError }}
                        </span>
                      } @else if (t.clientesHoy === 0) {
                        <span class="flex items-center gap-1.5 text-xs font-semibold text-[#b45309] dark:text-amber-300">
                          <span class="flex shrink-0"><lucide-angular name="alert-triangle" [size]="13" class="block"></lucide-angular></span>
                          Sin clientes con la carga vigente · descarga bloqueada
                        </span>
                      } @else {
                        <div class="flex flex-wrap gap-[5px]">
                          @for (variable of variablesVisibles(t); track variable) {
                            <span class="rounded-[5px] bg-[#eff5ff] px-2 py-[3px] text-xs font-semibold text-[#1d4ed8] dark:bg-blue-950 dark:text-blue-300">{{ variable }}</span>
                          }
                          @if (t.variables.length > limiteVariables) {
                            <button type="button" (click)="alternarVariables(t.id)" [attr.aria-expanded]="expandido(t.id)"
                                    class="inline-flex items-center gap-[3px] rounded-[5px] border border-[#8491a3] bg-white px-[7px] py-[2px] text-xs font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                              {{ expandido(t.id) ? 'Ver menos' : '+' + (t.variables.length - limiteVariables) + ' más' }}
                              <span class="flex" [class.rotate-180]="expandido(t.id)"><lucide-angular name="chevron-down" [size]="11" class="block"></lucide-angular></span>
                            </button>
                          }
                        </div>
                      }
                      @if (!t.conteoError) {
                        <p class="flex shrink-0 items-baseline gap-1.5">
                          <span class="text-xl font-bold tabular-nums" [ngClass]="t.clientesHoy === 0 ? 'text-[#b45309] dark:text-amber-300' : ''">{{ miles(t.clientesHoy ?? 0) }}</span>
                          <span class="text-xs" [ngClass]="t.clientesHoy === 0 ? 'text-[#b45309] dark:text-amber-300' : 'text-[#5f6c80] dark:text-slate-400'">clientes</span>
                        </p>
                      }
                    </div>

                    <div class="flex items-center justify-between gap-3 border-t pt-2.5"
                         [ngClass]="alerta(t) ? 'border-[#f3e6cc] dark:border-amber-900/60' : 'border-[#eef1f5] dark:border-slate-800'">
                      <span class="text-xs tabular-nums text-[#5f6c80] dark:text-slate-400">
                        {{ t.conteoCalculadoAt ? 'Conteo del ' + (t.conteoCalculadoAt | date: 'dd/MM HH:mm') : 'Sin conteo todavía' }}
                      </span>
                      <div class="flex items-center gap-1">
                        <button type="button" (click)="recalcular(t)" [disabled]="ocupado() === t.id"
                                class="inline-flex h-7 items-center gap-1.5 rounded-[7px] px-2 text-xs font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                          <lucide-angular name="refresh-cw" [size]="12" class="block"></lucide-angular>
                          Recalcular
                        </button>
                        <button type="button" (click)="archivar(t)" [disabled]="ocupado() === t.id"
                                class="inline-flex h-7 items-center gap-1.5 rounded-[7px] px-2 text-xs font-semibold text-[#334155] hover:bg-[#fef2f2] hover:text-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400">
                          <lucide-angular name="archive" [size]="12" class="block"></lucide-angular>
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
          <section class="flex flex-col gap-2.5">
            <button type="button" (click)="archivadosAbiertos.set(!archivadosAbiertos())" [attr.aria-expanded]="archivadosAbiertos()"
                    class="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#8491a3] bg-[#fbfcfd] px-4 py-[13px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-900">
              <span class="flex text-[#5f6c80] dark:text-slate-400">
                <lucide-angular [name]="archivadosAbiertos() ? 'chevron-down' : 'chevron-right'" [size]="16" class="block"></lucide-angular>
              </span>
              <span class="text-[14.5px] font-bold text-[#5f6c80] dark:text-slate-300">Archivados</span>
              <span class="rounded-full bg-[#f1f5f9] px-2.5 py-[3px] text-xs font-semibold tabular-nums text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400">{{ cuantosTenores(archivados().length) }}</span>
              <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">se conservan como referencia, no generan archivo</span>
            </button>
            @if (archivadosAbiertos()) {
              <div role="list" class="divide-y divide-[#eef1f5] overflow-hidden rounded-xl border border-[#e6e9ee] bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                @for (t of archivados(); track t.id) {
                  <div role="listitem" class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span class="text-[13.5px] font-semibold">{{ t.nombre }}</span>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ t.nombreSubcartera }} · {{ t.origen === 'FOH' ? 'traído de la base anterior' : 'archivado' }}</span>
                  </div>
                }
              </div>
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

  readonly miles = miles;
  readonly limiteVariables = VARIABLES_VISIBLES;
  readonly grupos = signal<GrupoTenores[]>([]);
  readonly cargando = signal(true);
  readonly busqueda = signal('');
  readonly ocupado = signal<number | null>(null);
  readonly archivadosAbiertos = signal(false);
  private readonly plegados = signal<ReadonlySet<number>>(new Set<number>());
  private readonly expandidos = signal<ReadonlySet<number>>(new Set<number>());

  /** Grupos con sus tenores activos que coinciden con la búsqueda. */
  readonly visibles = computed<GrupoTenores[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.grupos()
      .map(grupo => ({ ...grupo, tenores: grupo.tenores.filter(t => t.estado === 'ACTIVO' && coincide(t, consulta)) }))
      .filter(grupo => grupo.tenores.length > 0);
  });

  readonly archivados = computed<Tenor[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.grupos()
      .flatMap(grupo => grupo.tenores)
      .filter(t => t.estado === 'ARCHIVADO' && coincide(t, consulta));
  });

  /** Conteo más reciente entre los tenores activos. */
  readonly ultimoConteo = computed<string | null>(() =>
    this.grupos()
      .flatMap(grupo => grupo.tenores)
      .filter(t => t.estado === 'ACTIVO' && !!t.conteoCalculadoAt)
      .map(t => t.conteoCalculadoAt as string)
      .reduce<string | null>((mayor, actual) => (mayor === null || actual > mayor ? actual : mayor), null)
  );

  ngOnInit(): void {
    this.cargar();
  }

  plegado(idSubcartera: number): boolean {
    return this.plegados().has(idSubcartera);
  }

  alternar(idSubcartera: number): void {
    this.plegados.update(actual => alternarEn(actual, idSubcartera));
  }

  expandido(idTenor: number): boolean {
    return this.expandidos().has(idTenor);
  }

  alternarVariables(idTenor: number): void {
    this.expandidos.update(actual => alternarEn(actual, idTenor));
  }

  variablesVisibles(t: Tenor): string[] {
    return this.expandido(t.id) ? t.variables : t.variables.slice(0, VARIABLES_VISIBLES);
  }

  /** El nombre de la cartera solo se muestra si no repite el de la subcartera. */
  mostrarCartera(grupo: GrupoTenores): boolean {
    return !!grupo.nombreCartera && normalizar(grupo.nombreCartera) !== normalizar(grupo.nombreSubcartera ?? '');
  }

  cuantosTenores(cantidad: number): string {
    return cantidad === 1 ? '1 tenor' : `${cantidad} tenores`;
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

function alternarEn(actual: ReadonlySet<number>, id: number): ReadonlySet<number> {
  const siguiente = new Set(actual);
  if (siguiente.has(id)) {
    siguiente.delete(id);
  } else {
    siguiente.add(id);
  }
  return siguiente;
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function coincide(t: Tenor, consulta: string): boolean {
  return !consulta || normalizar(t.nombre).includes(consulta) || normalizar(t.plantilla).includes(consulta);
}
