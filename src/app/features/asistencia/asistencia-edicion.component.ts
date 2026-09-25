import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaDia, AsistenciaReporte, CierreSemana, ResumenAgente, TipoMarcacion } from './asistencia.models';
import { ESTADOS, ESTILOS } from './asistencia.estilos';

/** Las seis marcas, con el nombre que se lee en el aviso de accesibilidad. */
const MARCAS: Record<TipoMarcacion, { etiqueta: string; campo: keyof AsistenciaDia }> = {
  ENTRADA: { etiqueta: 'Entrada', campo: 'entrada' },
  ALMUERZO_INICIO: { etiqueta: 'Inicio del almuerzo', campo: 'almuerzoInicio' },
  ALMUERZO_FIN: { etiqueta: 'Fin del almuerzo', campo: 'almuerzoFin' },
  BREAK_INICIO: { etiqueta: 'Inicio del break', campo: 'breakInicio' },
  BREAK_FIN: { etiqueta: 'Fin del break', campo: 'breakFin' },
  SALIDA: { etiqueta: 'Salida', campo: 'salida' }
};

/** Un día que no se vino (falta, justificado o no laborable) no tiene marcas que falten. */
const SIN_MARCAS = ['FALTA', 'JUSTIFICADO', 'NO_LABORABLE'];
/** El nombre corto de cada marca en el aviso de faltantes: «falta almuerzo y break». */
const NOMBRE_CORTO: Record<TipoMarcacion, string> = {
  ENTRADA: 'entrada', ALMUERZO_INICIO: 'almuerzo', ALMUERZO_FIN: 'almuerzo',
  BREAK_INICIO: 'break', BREAK_FIN: 'break', SALIDA: 'salida'
};
const TODAS: TipoMarcacion[] = ['ENTRADA', 'ALMUERZO_INICIO', 'ALMUERZO_FIN', 'BREAK_INICIO', 'BREAK_FIN', 'SALIDA'];

/** Una hora cambiada, esperando su motivo. */
interface Cambio {
  fecha: string;
  tipo: TipoMarcacion;
  hora: string;
}

/**
 * Corregir marcaciones: la semana entera de un asesor de una vez.
 *
 * Existe aparte del reporte porque es otra tarea. En el reporte se mira y se
 * corrige un día suelto desde su fila; aquí se entra cuando hay que repasar
 * toda la semana de alguien, y hacerlo abriendo seis modales no es trabajo,
 * es castigo.
 *
 * El almuerzo y el break van en una sola columna con sus dos horas juntas:
 * son una pausa, no dos datos sueltos, y así la tabla cabe sin scroll.
 *
 * El motivo NO es una columna: es un chip que aparece en el día en cuanto se
 * le toca una hora. Una columna de texto por fila deja seis cajas vacías
 * pidiendo algo que casi nunca hace falta.
 *
 * Lo que falta se ve: arriba, un aviso con cada día incompleto y un atajo a su
 * celda; en la tabla, la celda vacía en ámbar. Una semana cerrada ya no se
 * corrige: se ve, pero no se toca.
 */
@Component({
  selector: 'app-asistencia-edicion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    /* Las dos horas de una pausa, juntas. */
    .par-edit { display: flex; gap: 4px }

    /* :host y !important: el tema claro fuerza con !important el borde, el
       fondo y el color de todo input (styles.css, «Inputs y selects»), y con
       una clase sola además la regla de input[type=time] estiraba la celda. */
    :host input.celda-edit {
      width: 116px; height: 32px; padding: 0 8px; border-radius: 6px;
      border: 1px solid #8491a3 !important; background: #fff !important; color: #0f172a !important;
      font: inherit; font-size: 12.5px; font-variant-numeric: tabular-nums;
    }
    :host input.celda-edit:focus-visible {
      outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,.2);
    }
    :host input.celda-edit.cambiada { border-color: #d97706 !important; background: color-mix(in srgb, #d97706 10%, #fff) !important }
    :host input.celda-edit.vacia { border-style: dashed; border-color: #f5a3a3 !important }
    :host input.celda-edit.falta { border-color: #f59e0b !important; background: #fef6e0 !important; box-shadow: inset 0 0 0 1px #f59e0b }
    :host-context(.dark) input.celda-edit { border-color: #475569 !important; background: #0f172a !important; color: #f1f5f9 !important }
    :host-context(.dark) input.celda-edit.cambiada { border-color: #b45309 !important; background: rgba(120,53,15,.35) !important }
    :host-context(.dark) input.celda-edit.falta { border-color: #f59e0b !important; background: rgba(69,26,3,.6) !important }
    input.celda-edit:disabled { opacity: .6; cursor: default }
    tr.con-faltas td:first-child { box-shadow: inset 3px 0 0 #f59e0b }
    .no-aplica { font-size: 12px; color: #8491a3 }

    /* Arriba de la tabla: qué falta completar, con atajos; o que ya está todo, o que está cerrada. */
    .aviso-huecos {
      display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; margin: 0 0 12px; padding: 10px 14px;
      border-radius: 10px; border: 1px solid color-mix(in srgb, #f59e0b 45%, #fff);
      background: #fef6e0; color: #92400e; font-size: 12.5px;
    }
    .aviso-huecos.cerrada { border-color: #e6e9ee; background: #f1f3f6; color: #334155 }
    .aviso-huecos.ok { border-color: color-mix(in srgb, #16a34a 40%, #fff); background: #e8f5ec; color: #166534 }
    :host-context(.dark) .aviso-huecos { border-color: #92400e; background: rgba(69,26,3,.6); color: #fcd34d }
    :host-context(.dark) .aviso-huecos.cerrada { border-color: #1e293b; background: #1e293b; color: #e2e8f0 }
    :host-context(.dark) .aviso-huecos.ok { border-color: #166534; background: rgba(5,46,22,.6); color: #86efac }
    .chip-hueco {
      border: 1px solid #f59e0b; background: #fff; color: #92400e; border-radius: 999px;
      padding: 3px 10px; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .chip-hueco:hover { background: #f4f6f9 }
    :host-context(.dark) .chip-hueco { background: #0f172a; color: #fcd34d }

    /* El motivo vive en la fila de su día y solo aparece cuando hay algo que
       explicar. */
    .chip-motivo {
      margin-left: 8px; height: 22px; padding: 0 9px; border-radius: 999px;
      border: 1px solid #f59e0b; background: #fef6e0; color: #92400e;
      font-size: 11px; font-weight: 700; cursor: pointer;
    }
    .chip-motivo.puesto { border-color: #16a34a; background: #e8f5ec; color: #166534 }

    .barra-edicion {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 10px 16px; padding: 12px 16px; margin-top: 14px;
      background: #fff; border: 1px solid #e6e9ee; border-radius: 12px;
      box-shadow: 0 1px 2px rgba(15,23,42,.04);
    }
    :host-context(.dark) .barra-edicion { background: #0f172a; border-color: #1e293b }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Corregir marcaciones</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Corrección de marcaciones por asesor
          </p>
        </div>
        <button type="button" [class]="estilos.botonSecundario" (click)="volver.emit()">
          <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
          Volver al reporte
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="agente-edicion">Agente</label>
          <select id="agente-edicion" [class]="estilos.campo + ' !w-[210px]'"
                  [ngModel]="idElegido()" (ngModelChange)="elegir($event)">
            @for (a of roster(); track a.idUsuario) {
              <option [ngValue]="a.idUsuario">{{ a.nombreAgente }}</option>
            }
          </select>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
      @if (!idSubcartera() || !roster().length) {
        <div [class]="estilos.vacio">
          <strong class="block text-[13.5px]">Elige un ámbito con personas</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            La edición trabaja sobre una persona del cliente y la cartera elegidos.
          </span>
        </div>
      } @else if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
      } @else if (persona(); as p) {
        <div class="aparecer">

          <div class="mb-3 flex flex-wrap items-center justify-between gap-3 px-0.5">
            <div>
              <h2 class="!m-0 flex flex-wrap items-center gap-[9px] text-[20px] font-extrabold tracking-[-0.01em]">
                {{ p.nombreAgente }}
                @if (p.rol) {
                  <span [class]="p.rol === 'Supervisor' ? estilos.rolSupervisor : estilos.rolAsesor">
                    {{ p.rol }}
                  </span>
                }
              </h2>
              <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ rangoTexto() }}</p>
            </div>
          </div>

          @if (semanaCerrada()) {
            <div class="aviso-huecos cerrada" role="note">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg>
              <strong>Semana cerrada: ya no se corrige</strong>
            </div>
          } @else if (conHuecos().length) {
            <div class="aviso-huecos" role="note">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              <strong>{{ conHuecos().length }} {{ conHuecos().length === 1 ? 'día con marcas faltantes' : 'días con marcas faltantes' }}</strong>
              @for (h of conHuecos(); track h.dia.fecha) {
                <button type="button" class="chip-hueco" (click)="irAlHueco(h.dia, h.primera)">
                  {{ h.dia.nombreDia.slice(0, 3) }} {{ h.dia.fecha | date: 'dd/MM' }} · falta {{ h.texto }}
                </button>
              }
            </div>
          } @else if (dias().length) {
            <div class="aviso-huecos ok" role="note">
              <span class="inline-flex font-extrabold leading-none" aria-hidden="true">✓</span>
              <strong>Marcas completas esta semana</strong>
            </div>
          }

          <div [class]="estilos.panel">
            <table class="w-full border-collapse">
              <caption class="sr-only">Horas de {{ p.nombreAgente }}</caption>
              <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                <tr>
                  <th scope="col" [class]="estilos.th">Fecha</th>
                  <th scope="col" [class]="estilos.th">Entrada</th>
                  <th scope="col" [class]="estilos.th">Almuerzo</th>
                  <th scope="col" [class]="estilos.th">Break</th>
                  <th scope="col" [class]="estilos.th">Salida</th>
                  <th scope="col" [class]="estilos.th">Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (dia of dias(); track dia.fecha) {
                  <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800"
                      [class.opacity-50]="dia.estado === 'NO_LABORABLE'"
                      [class.con-faltas]="faltantes(dia).length > 0">
                    <td [class]="estilos.td">
                      <strong>{{ dia.fecha | date: 'dd/MM' }}</strong>
                      <span class="ml-[5px] text-[#8491a3] dark:text-slate-500">{{ dia.nombreDia.slice(0, 3) }}</span>
                      @if (tieneCambios(dia.fecha)) {
                        <button type="button" class="chip-motivo"
                                [class.puesto]="!!(motivos()[dia.fecha] ?? '').trim()"
                                (click)="abrirMotivo(dia)"
                                [title]="(motivos()[dia.fecha] ?? '').trim() || 'Falta el motivo'">
                          {{ (motivos()[dia.fecha] ?? '').trim() ? '✓ Motivo' : 'Motivo' }}
                        </button>
                      }
                    </td>

                    <td [class]="estilos.td">
                      <ng-container [ngTemplateOutlet]="celda"
                        [ngTemplateOutletContext]="{ dia: dia, tipo: 'ENTRADA' }"></ng-container>
                    </td>
                    <td [class]="estilos.td">
                      @if (noAplica(dia, 'ALMUERZO_INICIO', 'ALMUERZO_FIN')) {
                        <span class="no-aplica">No aplica</span>
                      } @else {
                        <div class="par-edit">
                          <ng-container [ngTemplateOutlet]="celda"
                            [ngTemplateOutletContext]="{ dia: dia, tipo: 'ALMUERZO_INICIO' }"></ng-container>
                          <ng-container [ngTemplateOutlet]="celda"
                            [ngTemplateOutletContext]="{ dia: dia, tipo: 'ALMUERZO_FIN' }"></ng-container>
                        </div>
                      }
                    </td>
                    <td [class]="estilos.td">
                      @if (noAplica(dia, 'BREAK_INICIO', 'BREAK_FIN')) {
                        <span class="no-aplica">No aplica</span>
                      } @else {
                        <div class="par-edit">
                          <ng-container [ngTemplateOutlet]="celda"
                            [ngTemplateOutletContext]="{ dia: dia, tipo: 'BREAK_INICIO' }"></ng-container>
                          <ng-container [ngTemplateOutlet]="celda"
                            [ngTemplateOutletContext]="{ dia: dia, tipo: 'BREAK_FIN' }"></ng-container>
                        </div>
                      }
                    </td>
                    <td [class]="estilos.td">
                      <ng-container [ngTemplateOutlet]="celda"
                        [ngTemplateOutletContext]="{ dia: dia, tipo: 'SALIDA' }"></ng-container>
                    </td>

                    <td [class]="estilos.td">
                      <span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold"
                            [class]="ESTADOS[dia.estado].clase">
                        {{ dia.tipoDia ?? ESTADOS[dia.estado].texto }}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="!px-3 !py-14 text-center">
                      <strong class="block text-[13.5px]">Sin días en ese rango</strong>
                      <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                        Cambia las fechas desde el reporte.
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Solo con algo cambiado, como en la maqueta: sin cambios no hay nada que guardar. -->
          @if (!semanaCerrada() && cambios().length) {
          <div class="barra-edicion">
            <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              {{ diasCorregidos() }} día(s) corregido(s)@if (diasSinMotivo().length) { · <strong class="!text-[#b91c1c] dark:!text-red-300">{{ diasSinMotivo().length }} sin motivo</strong>} @else {, todos con su motivo}
            </p>
            <div class="flex gap-2">
              <button type="button" [class]="estilos.botonSecundario + ' !h-[34px] !gap-[5px] !px-[13px] !text-[12.5px]'"
                      (click)="descartar()">
                <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
                Descartar
              </button>
              <button type="button" [class]="estilos.botonPrimario + ' !h-[34px] !gap-[5px] !px-[13px] !text-[12.5px]'"
                      (click)="guardar()" [disabled]="diasSinMotivo().length > 0 || guardando()">
                <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/></svg>
                {{ guardando() ? 'Guardando…' : 'Guardar' }}
              </button>
            </div>
          </div>
          }

          @if (error()) {
            <p class="mt-2 text-[12px] text-[#b91c1c]">{{ error() }}</p>
          }
        </div>
      }
    </div>

    <!-- Motivo de un día. Uno por día y no uno para todo: cada día se corrige
         por una razón distinta, y es lo que se lee después en Auditoría. -->
    @if (motivoDe(); as dia) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarMotivo()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,460px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-motivo">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-motivo" class="!m-0 text-[15px] font-extrabold">Motivo de la corrección</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ dia.fecha | date: 'dd/MM/yyyy' }} · {{ cambiosDelDia(dia.fecha) }}
                {{ cambiosDelDia(dia.fecha) === 1 ? 'hora cambiada' : 'horas cambiadas' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarMotivo()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <div class="flex flex-col gap-1.5 px-5 py-4">
            <label [class]="estilos.etiqueta" for="texto-motivo">Qué pasó</label>
            <textarea id="texto-motivo" rows="2" maxlength="200" [class]="estilos.area"
                      placeholder="Ej.: olvidó marcar el regreso del almuerzo"
                      [ngModel]="borrador()" (ngModelChange)="borrador.set($event)"></textarea>
            @if (errorMotivo()) {
              <p class="!m-0 text-[12px] text-[#b91c1c]">{{ errorMotivo() }}</p>
            }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarMotivo()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="aceptarMotivo(dia)">Aceptar</button>
          </footer>
        </div>
      </div>
    }

    <!-- Una celda de hora: se nota si está tocada y se nota si está vacía. -->
    <ng-template #celda let-dia="dia" let-tipo="tipo">
      <input type="time" class="celda-edit" [id]="'celda-' + dia.fecha + '-' + tipo"
             [class.cambiada]="estaTocada(dia.fecha, tipo)"
             [class.falta]="falta(dia, tipo)"
             [class.vacia]="!valorDe(dia, tipo) && !estaTocada(dia.fecha, tipo) && !falta(dia, tipo)"
             [disabled]="dia.estado === 'NO_LABORABLE' || diaCerrado(dia.fecha)"
             [ngModel]="valorActual(dia, tipo)"
             (ngModelChange)="cambiar(dia, tipo, $event)"
             [title]="falta(dia, tipo) ? 'Falta esta marca' : ''"
             [attr.aria-label]="nombreDe(tipo) + ' del ' + dia.fecha + (falta(dia, tipo) ? ', falta' : '')">
    </ng-template>
  `
})
export class AsistenciaEdicionComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADOS = ESTADOS;
  protected readonly MARCAS = MARCAS;

  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** Vuelve al reporte; la pantalla la manda el módulo. */
  readonly volver = output<void>();

  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly idElegido = signal<number | null>(null);
  readonly cambios = signal<Cambio[]>([]);
  readonly motivos = signal<Record<string, string>>({});

  /** El día cuyo motivo se está escribiendo. */
  readonly motivoDe = signal<AsistenciaDia | null>(null);
  readonly borrador = signal('');
  readonly errorMotivo = signal('');

  readonly roster = computed<ResumenAgente[]>(() => this.reporte()?.agentes ?? []);

  readonly persona = computed<ResumenAgente | null>(() =>
    this.roster().find(a => a.idUsuario === this.idElegido()) ?? null);

  readonly dias = computed<AsistenciaDia[]>(() => {
    const id = this.idElegido();
    return id ? (this.reporte()?.dias ?? []).filter(d => d.idUsuario === id) : [];
  });

  readonly rangoTexto = computed(() => {
    const d = this.dias();
    return d.length ? `${this.corta(d[0].fecha)} – ${this.corta(d[d.length - 1].fecha)}` : '';
  });

  /** Las semanas cerradas: lo que cae en ellas ya no se corrige. */
  readonly cierres = signal<CierreSemana[]>([]);

  /** Si ese día es de una semana cerrada del ámbito o de toda la empresa. */
  diaCerrado(fecha: string): boolean {
    const sub = this.idSubcartera();
    return this.cierres().some(c => fecha >= c.lunes && fecha <= c.ultimoDia
      && (c.idSubcartera === null || c.idSubcartera === sub));
  }

  readonly semanaCerrada = computed(() => {
    const d = this.dias();
    return d.length > 0 && d.every(x => this.diaCerrado(x.fecha));
  });

  /** Las marcas que faltan en un día, contando lo que ya se tecleó. */
  faltantes(dia: AsistenciaDia): TipoMarcacion[] {
    return TODAS.filter(tipo => this.falta(dia, tipo));
  }

  /** Una marca falta si el día la pide, está vacía y nadie la ha escrito todavía. */
  falta(dia: AsistenciaDia, tipo: TipoMarcacion): boolean {
    if (SIN_MARCAS.includes(dia.estado)) {
      return false;
    }
    const sabado = dia.nombreDia.toLowerCase().startsWith('s');
    if (sabado && tipo !== 'ENTRADA' && tipo !== 'SALIDA') {
      return false;
    }
    return !this.valorActual(dia, tipo);
  }

  /** El sábado no lleva almuerzo ni break: si no hay marca, se dice en vez de dejar el hueco. */
  noAplica(dia: AsistenciaDia, a: TipoMarcacion, b: TipoMarcacion): boolean {
    return dia.nombreDia.toLowerCase().startsWith('s')
      && !this.valorActual(dia, a) && !this.valorActual(dia, b);
  }

  /** Los días con huecos, para el aviso de arriba: «Mié 16/09 · falta almuerzo y break». */
  readonly conHuecos = computed(() => {
    this.cambios();
    return this.dias()
      .map(dia => ({ dia, faltan: this.faltantes(dia) }))
      .filter(x => x.faltan.length)
      .map(x => {
        const nombres = [...new Set(x.faltan.map(t => NOMBRE_CORTO[t]))];
        const texto = nombres.length < 2 ? nombres.join('')
          : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
        return { dia: x.dia, primera: x.faltan[0], texto };
      });
  });

  /** El atajo del aviso: lleva a la primera celda que falta de ese día. */
  irAlHueco(dia: AsistenciaDia, tipo: TipoMarcacion): void {
    const celda = document.getElementById(`celda-${dia.fecha}-${tipo}`) as HTMLInputElement | null;
    celda?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    celda?.focus();
  }

  /** Los días con alguna hora cambiada: la barra los cuenta, como la maqueta. */
  readonly diasCorregidos = computed(() => new Set(this.cambios().map(c => c.fecha)).size);

  constructor() {
    this.servicio.cierres().subscribe({
      next: c => this.cierres.set(c),
      error: () => this.cierres.set([])
    });
    effect(() => {
      const ambito = this.idSubcartera();
      const desde = this.desde();
      const hasta = this.hasta();
      if (!ambito) {
        this.reporte.set(null);
        return;
      }
      this.cargar(desde, hasta, ambito);
    });
  }

  private cargar(desde: string, hasta: string, idSubcartera: number): void {
    this.cargando.set(true);
    this.servicio.reporte(desde, hasta, idSubcartera).subscribe({
      next: r => {
        this.reporte.set(r);
        this.idElegido.set(r.agentes[0]?.idUsuario ?? null);
        this.descartar();
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar la asistencia');
        this.cargando.set(false);
      }
    });
  }

  /** Cambiar de persona con cambios sin guardar los pierde: se avisa. */
  elegir(id: number): void {
    if (this.cambios().length
        && !confirm('Tienes horas cambiadas sin guardar. ¿Las descartas?')) {
      return;
    }
    this.idElegido.set(id);
    this.descartar();
  }

  // ==================== EDICIÓN ====================

  /** El nombre de una marca, para el lector de pantalla. */
  nombreDe(tipo: TipoMarcacion): string {
    return MARCAS[tipo].etiqueta;
  }

  valorDe(dia: AsistenciaDia, tipo: TipoMarcacion): string {
    return (dia[MARCAS[tipo].campo] as string | null) ?? '';
  }

  /** Lo tecleado si lo hay; si no, lo que vino del backend. */
  valorActual(dia: AsistenciaDia, tipo: TipoMarcacion): string {
    const tocada = this.cambios().find(c => c.fecha === dia.fecha && c.tipo === tipo);
    return tocada ? tocada.hora : this.valorDe(dia, tipo);
  }

  estaTocada(fecha: string, tipo: TipoMarcacion): boolean {
    return this.cambios().some(c => c.fecha === fecha && c.tipo === tipo);
  }

  tieneCambios(fecha: string): boolean {
    return this.cambios().some(c => c.fecha === fecha);
  }

  cambiosDelDia(fecha: string): number {
    return this.cambios().filter(c => c.fecha === fecha).length;
  }

  cambiar(dia: AsistenciaDia, tipo: TipoMarcacion, hora: string): void {
    const original = this.valorDe(dia, tipo);
    this.error.set('');
    this.cambios.update(lista => {
      const resto = lista.filter(c => !(c.fecha === dia.fecha && c.tipo === tipo));
      // Volver al valor original no es un cambio: se quita de la lista.
      return !hora || hora === original ? resto : [...resto, { fecha: dia.fecha, tipo, hora }];
    });
  }

  // ==================== MOTIVO ====================

  abrirMotivo(dia: AsistenciaDia): void {
    this.motivoDe.set(dia);
    this.borrador.set(this.motivos()[dia.fecha] ?? '');
    this.errorMotivo.set('');
  }

  cerrarMotivo(): void {
    this.motivoDe.set(null);
  }

  aceptarMotivo(dia: AsistenciaDia): void {
    if (!this.borrador().trim()) {
      this.errorMotivo.set('Hace falta: es lo que se lee después en Auditoría');
      return;
    }
    this.motivos.update(actual => ({ ...actual, [dia.fecha]: this.borrador().trim() }));
    this.cerrarMotivo();
    this.error.set('');
  }

  protected diasSinMotivo(): string[] {
    return [...new Set(this.cambios().map(c => c.fecha))]
      .filter(f => !(this.motivos()[f] ?? '').trim());
  }

  descartar(): void {
    this.cambios.set([]);
    this.motivos.set({});
    this.error.set('');
  }

  /**
   * Manda una corrección por cada hora cambiada. Van de una en una porque cada
   * marcación es una fila propia en el backend, con su origen y su motivo.
   */
  guardar(): void {
    const id = this.idElegido();
    if (!id) {
      return;
    }
    const sinMotivo = this.diasSinMotivo();
    if (sinMotivo.length) {
      this.error.set(sinMotivo.length === 1
        ? `Falta el motivo del ${this.corta(sinMotivo[0])}`
        : `Faltan los motivos de: ${sinMotivo.map(f => this.corta(f)).join(', ')}`);
      return;
    }

    this.guardando.set(true);
    let pendientes = this.cambios().length;
    let fallo = false;

    for (const c of this.cambios()) {
      this.servicio.completarMarcacion({
        idUsuario: id,
        fecha: c.fecha,
        tipo: c.tipo,
        hora: this.conSegundos(c.hora),
        motivo: this.motivos()[c.fecha].trim()
      }).subscribe({
        next: () => this.alTerminar(--pendientes, fallo),
        error: () => {
          fallo = true;
          this.alTerminar(--pendientes, fallo);
        }
      });
    }
  }

  private alTerminar(pendientes: number, fallo: boolean): void {
    if (pendientes > 0) {
      return;
    }
    this.guardando.set(false);
    if (fallo) {
      this.toast.error('Alguna corrección no se pudo guardar');
      return;
    }
    this.toast.success('Horas corregidas');
    const ambito = this.idSubcartera();
    if (ambito) {
      this.cargar(this.desde(), this.hasta(), ambito);
    }
  }

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  /** El input de tipo time devuelve HH:mm cuando los segundos son cero. */
  private conSegundos(hora: string): string {
    return hora.length === 5 ? `${hora}:00` : hora;
  }
}
