import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { CambioAsistencia, TipoCambio } from './asistencia.models';
import { ESTILOS } from './asistencia.estilos';

/** Filas por página: las que caben sin tener que bajar. */
const POR_PAGINA = 10;

/** El nombre de cada tipo y el color de su pastilla, como en la maqueta. */
const TIPOS: Record<TipoCambio, { texto: string; clase: string }> = {
  MARCACION: { texto: 'Marcación', clase: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
  RECUPERACION: { texto: 'Recuperación', clase: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300' },
  SOLICITUD: { texto: 'Solicitud', clase: 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300' },
  REGLA: { texto: 'Regla', clase: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
  FERIADO: { texto: 'Feriado', clase: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300' },
  CIERRE: { texto: 'Cierre', clase: 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' }
};

/**
 * Auditoría: el único historial del módulo. Toda marca corregida, recuperación,
 * solicitud, regla, feriado y cierre, con su valor anterior, el nuevo, el
 * motivo y quién lo hizo.
 *
 * Respeta el ámbito y el agente de arriba: los cambios de una persona salen si
 * es del ámbito; los de un ámbito (una regla de CASTIGO, un feriado de toda la
 * empresa) salen si tocan al elegido.
 */
@Component({
  selector: 'app-asistencia-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    /* Lo escrito a mano: el punto ámbar a la derecha, como en la maqueta. */
    .manual { position: relative; padding-right: 16px }
    .manual::after {
      content: ""; position: absolute; top: 50%; right: 4px; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 999px; background: #d97706;
    }
    :host-context(.dark) .manual::after { background: #fbbf24 }
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Auditoría</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Registro de cambios del módulo de asistencia
          </p>
        </div>
        <button type="button" [class]="estilos.botonPrimario" (click)="descargar()"
                [disabled]="!filtradas().length">
          <lucide-angular name="download" [size]="15" class="block"></lucide-angular>
          Descargar
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-tipo">Tipo</label>
          <select id="aud-tipo" [class]="estilos.campo + ' !w-[210px]'"
                  [ngModel]="tipo()" (ngModelChange)="tipo.set($event); pagina.set(1)">
            <option value="">Todos</option>
            @for (t of LISTA_TIPOS; track t.clave) { <option [value]="t.clave">{{ t.texto }}</option> }
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-desde">Desde</label>
          <input id="aud-desde" type="date" [class]="estilos.campo"
                 [ngModel]="desdeAud()" (ngModelChange)="cambiarRango($event, hastaAud())">
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-hasta">Hasta</label>
          <input id="aud-hasta" type="date" [class]="estilos.campo"
                 [ngModel]="hastaAud()" (ngModelChange)="cambiarRango(desdeAud(), $event)">
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="aud-usuario">Usuario</label>
          <select id="aud-usuario" [class]="estilos.campo + ' !w-[210px]'"
                  [ngModel]="usuario()" (ngModelChange)="usuario.set($event); pagina.set(1)">
            <option value="">Todos</option>
            @for (u of usuarios(); track u) { <option [value]="u">{{ u }}</option> }
          </select>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
    <div class="aparecer">

      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
      } @else {
        <div [class]="estilos.panel">
          <table class="w-full border-collapse">
            <caption class="sr-only">Todos los cambios, del más reciente al más antiguo</caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Fecha</th>
                <th scope="col" [class]="estilos.th">Tipo</th>
                <th scope="col" [class]="estilos.th">Asesor</th>
                <th scope="col" [class]="estilos.th">Detalle</th>
                <th scope="col" [class]="estilos.th">Valor anterior</th>
                <th scope="col" [class]="estilos.th">Valor nuevo</th>
                <th scope="col" [class]="estilos.th">Motivo</th>
                <th scope="col" [class]="estilos.th">Usuario</th>
              </tr>
            </thead>
            <tbody>
              @for (c of visibles(); track c.id) {
                <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#f4f6f9] dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td [class]="estilos.td + ' secundario'">{{ c.fecha | date: 'dd/MM HH:mm' }}</td>
                  <td [class]="estilos.td">
                    <span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold"
                          [class]="TIPOS[c.tipo].clase">{{ TIPOS[c.tipo].texto }}</span>
                  </td>
                  <td [class]="estilos.td + ' max-w-[180px] truncate font-semibold'">
                    @if (c.asesor) { {{ c.asesor }} } @else { <span class="text-[#8491a3] dark:text-slate-500">—</span> }
                  </td>
                  <td [class]="estilos.td">{{ c.ambito ? c.ambito + ' · ' + c.detalle : c.detalle }}</td>
                  <td [class]="estilos.td">
                    @if (c.valorAnterior) {
                      {{ c.valorAnterior }}
                    } @else if (c.tipo === 'MARCACION') {
                      <span class="inline-flex items-center rounded-full bg-[#fdecec] px-[9px] py-0.5 text-[11.5px] font-bold text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300">
                        Sin marcación
                      </span>
                    } @else {
                      <span class="text-[#8491a3] dark:text-slate-500">—</span>
                    }
                  </td>
                  <!-- El punto ámbar es lo escrito a mano, como en el reporte. -->
                  <td [class]="estilos.td + ' font-bold'">
                    <span class="manual">{{ c.valorNuevo ?? '—' }}</span>
                  </td>
                  <td [class]="estilos.td + ' max-w-[240px] !whitespace-normal'">{{ c.motivo || '—' }}</td>
                  <td [class]="estilos.td + ' secundario'">{{ c.usuario }}</td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="8" class="!px-3 !py-14 text-center">
                    <lucide-angular name="inbox" [size]="26" class="mx-auto mb-1 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
                    <strong class="block text-[13.5px]">Sin cambios para estos filtros</strong>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (paginas() > 1) {
            <div class="flex items-center justify-between gap-3 border-t border-[#f1f3f6] px-3 py-2.5 dark:border-slate-800">
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ primera() }}–{{ primera() + visibles().length - 1 }} de {{ filtradas().length }}
              </span>
              <div class="flex gap-1.5">
                <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() - 1)"
                        [disabled]="pagina() === 1" aria-label="Página anterior">
                  <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                </button>
                <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() + 1)"
                        [disabled]="pagina() === paginas()" aria-label="Página siguiente">
                  <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
    </div>
  `
})
export class AsistenciaAuditoriaComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly TIPOS = TIPOS;
  protected readonly LISTA_TIPOS = (Object.keys(TIPOS) as TipoCambio[]).map(clave => ({ clave, texto: TIPOS[clave].texto }));

  /** El rango del módulo: la auditoría abre en el mes de ese rango. */
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();
  /** El ámbito y el agente de arriba. */
  readonly idSubcartera = input<number | null>(null);
  readonly agente = input('');

  /** El rango propio de la pantalla, que se puede mover sin tocar el del módulo. */
  readonly desdeAud = signal('');
  readonly hastaAud = signal('');

  readonly cambios = signal<CambioAsistencia[]>([]);
  readonly cargando = signal(false);
  readonly tipo = signal<TipoCambio | ''>('');
  readonly usuario = signal('');
  readonly pagina = signal(1);

  /** Quién ha cambiado algo en el rango: no un catálogo, los reales. «Automático» al final. */
  readonly usuarios = computed(() => {
    const nombres = [...new Set(this.cambios().map(c => c.usuario))];
    return [...nombres.filter(n => n !== 'Automático').sort(), ...nombres.filter(n => n === 'Automático')];
  });

  readonly filtradas = computed(() => {
    const tipo = this.tipo();
    const usuario = this.usuario();
    const texto = this.agente().trim().toLowerCase();
    return this.cambios().filter(c => (!tipo || c.tipo === tipo)
      && (!usuario || c.usuario === usuario)
      // Buscar a alguien deja sus cambios y los del ámbito, que también le tocan.
      && (!texto || !c.asesor || c.asesor.toLowerCase().includes(texto)));
  });

  readonly paginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / POR_PAGINA)));
  readonly primera = computed(() => (Math.min(this.pagina(), this.paginas()) - 1) * POR_PAGINA + 1);
  readonly visibles = computed(() =>
    this.filtradas().slice(this.primera() - 1, this.primera() - 1 + POR_PAGINA));

  constructor() {
    // Al cambiar el rango del módulo, la auditoría se va a su mes entero.
    effect(() => {
      const [anio, mes] = this.desde().split('-').map(Number);
      const ultimo = new Date(anio, mes, 0).getDate();
      const mm = String(mes).padStart(2, '0');
      untracked(() => this.cambiarRango(`${anio}-${mm}-01`, `${anio}-${mm}-${ultimo}`));
    });
    // Otro ámbito u otro agente: se vuelve a la primera página; el ámbito, además, se vuelve a pedir.
    effect(() => {
      const sub = this.idSubcartera();
      untracked(() => {
        this.pagina.set(1);
        if (this.desdeAud() && this.hastaAud()) {
          this.cargar(this.desdeAud(), this.hastaAud(), sub);
        }
      });
    });
    effect(() => {
      this.agente();
      untracked(() => this.pagina.set(1));
    });
  }

  cambiarRango(desde: string, hasta: string): void {
    this.desdeAud.set(desde);
    this.hastaAud.set(hasta);
    this.pagina.set(1);
    if (desde && hasta && desde <= hasta) {
      this.cargar(desde, hasta, this.idSubcartera());
    }
  }

  /**
   * Lo filtrado, en CSV: todas las páginas, no solo la que se ve. Se arma en el
   * navegador porque es exactamente lo que hay en pantalla.
   */
  descargar(): void {
    const cabecera = ['Fecha', 'Tipo', 'Asesor', 'Detalle', 'Valor anterior', 'Valor nuevo', 'Motivo', 'Usuario'];
    const filas = this.filtradas().map(c => [
      c.fecha.replace('T', ' ').slice(0, 16), TIPOS[c.tipo].texto, c.asesor ?? '',
      c.ambito ? `${c.ambito} · ${c.detalle}` : c.detalle,
      c.valorAnterior ?? (c.tipo === 'MARCACION' ? 'Sin marcación' : ''), c.valorNuevo ?? '', c.motivo ?? '', c.usuario
    ]);
    const csv = [cabecera, ...filas]
      .map(f => f.map(v => `"${String(v).replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `Auditoria_${this.desdeAud()}_al_${this.hastaAud()}.csv`;
    enlace.click();
    URL.revokeObjectURL(url);
    this.toast.success(`Auditoría descargada: ${filas.length} ${filas.length === 1 ? 'cambio' : 'cambios'}`);
  }

  private cargar(desde: string, hasta: string, idSubcartera: number | null): void {
    this.cargando.set(true);
    this.servicio.auditoria(desde, hasta, idSubcartera).subscribe({
      next: c => {
        this.cambios.set(c);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar la auditoría');
        this.cargando.set(false);
      }
    });
  }
}
