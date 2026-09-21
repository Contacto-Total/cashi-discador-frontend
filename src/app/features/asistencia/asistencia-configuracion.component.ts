import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { DiaCalendario, Horario, PoliticaAsistencia, TipoDia } from './asistencia.models';
import { ESTILOS, hoy } from './asistencia.estilos';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/** Una regla de la política, tal como se enseña y se cambia: de una en una. */
interface Regla {
  clave: 'dia' | 'semana' | 'almuerzo' | 'break';
  nombre: string;
  icono: string;
  pie: string;
  cifra: string;
  unidad: string;
  minutos: number;
  hora: string | null;
  conHora: boolean;
}
const INICIALES = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/**
 * Configuración del módulo: el horario, las pausas y el calendario.
 *
 * Nada de esto se edita con un UPDATE. El reporte se consulta sobre el pasado;
 * si una fila se sobrescribiera, cambiar el horario en noviembre recalcularía
 * las tardanzas de octubre que ya se usaron para pagar. Cambiar cierra la fila
 * vigente y abre otra, y por eso el motivo es obligatorio.
 */
@Component({
  selector: 'app-asistencia-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    /* La pista de un día: la jornada sobre el reloj, con el break encima. */
    .pista {
      position: relative; height: 22px; border-radius: 6px;
      background: #f1f3f6; overflow: hidden;
    }
    .turno {
      position: absolute; top: 0; bottom: 0; background: #0f172a;
      border-radius: 0 6px 6px 0;
    }
    .pausa { position: absolute; top: 0; bottom: 0; background: #f59e0b }
    :host-context(.dark) .pista { background: #1e293b }
    :host-context(.dark) .turno { background: #e2e8f0 }
    /* La grilla del calendario: siete columnas, una por día de la semana. */
    .mes { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px }
    .celda {
      display: flex; flex-direction: column; gap: 2px; min-height: 58px;
      padding: 5px 6px; border: 1px solid #e6e9ee; border-radius: 8px;
      background: #fff; text-align: left; cursor: pointer;
      transition: border-color .15s, background-color .15s;
    }
    .celda:hover { border-color: #2563eb }
    .celda.fuera { opacity: .35; cursor: default }
    .celda.fuera:hover { border-color: #e6e9ee }
    .celda.finde { background: #f6f7f9 }
    .celda.marcado { border-color: #f3d9a4; background: #fef6e0 }
    :host-context(.dark) .celda { border-color: #1e293b; background: #0f172a }
    :host-context(.dark) .celda.finde { background: #020617 }
    :host-context(.dark) .celda.marcado { border-color: #78350f; background: rgba(120,53,15,.35) }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Configuración</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Horarios y calendario. Se toca de vez en cuando, no a diario
          </p>
        </div>
        <button type="button" [class]="estilos.botonSecundario" (click)="volver.emit()">
          <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
          Volver al reporte
        </button>
      </div>
    </div>

    <div class="flex min-h-[54px] items-center border-b border-[#e6e9ee] bg-white px-7 py-[11px] dark:border-slate-800 dark:bg-slate-900">
      <nav [class]="estilos.segmentos" role="tablist">
        @for (t of TABS; track t.clave) {
          <button type="button" role="tab" [attr.aria-selected]="tab() === t.clave"
                  [class]="estilos.tab + ' ' + (tab() === t.clave ? estilos.tabActiva : estilos.tabApagada)"
                  (click)="tab.set(t.clave)">
            {{ t.texto }}
            @if (t.clave === 'calendario' && dias().length) {
              <span aria-hidden="true"
                    [class]="estilos.cuenta + ' ' + (tab() === t.clave ? estilos.cuentaActiva : estilos.cuentaApagada)">
                {{ dias().length }}
              </span>
            }
          </button>
        }
      </nav>
    </div>

    <div class="px-7 py-5">
    <div class="aparecer">

      @if (tab() === 'horarios') {
        <div class="grid gap-4 lg:grid-cols-[1fr_1fr]">

          <!-- El horario de la semana, dibujado -->
          <div>
            <div class="mb-2.5 flex items-center justify-between gap-3">
              <h2 [class]="estilos.titulo + ' !mb-0'">Horario vigente</h2>
              <button type="button" [class]="estilos.botonSecundario" (click)="abrirHorario()">
                <lucide-angular name="pencil" [size]="15" class="block"></lucide-angular>
                Editar
              </button>
            </div>

            <div [class]="estilos.tarjeta">
              @for (d of semana(); track d.diaSemana) {
                <div class="flex items-center gap-3 border-b border-[#f1f3f6] py-2 last:border-0 dark:border-slate-800">
                  <span class="w-[74px] shrink-0 text-[12.5px] font-semibold">{{ DIAS[d.diaSemana - 1] }}</span>
                  @if (d.horaEntrada) {
                    <div class="pista flex-1" [title]="d.horaEntrada + ' – ' + d.horaSalida">
                      <span class="turno"
                            [style.left.%]="porcentaje(d.horaEntrada)"
                            [style.width.%]="porcentaje(d.horaSalida ?? d.horaEntrada) - porcentaje(d.horaEntrada)"></span>
                      @if (politica()?.horaBreak) {
                        <span class="pausa"
                              [style.left.%]="porcentaje(politica()!.horaBreak!)"
                              [style.width.%]="anchoBreak()"></span>
                      }
                    </div>
                    <span class="w-[104px] shrink-0 text-right text-[12px] tabular-nums text-[#5f6c80] dark:text-slate-400">
                      {{ hhmm(d.horaEntrada) }} – {{ hhmm(d.horaSalida!) }}
                    </span>
                  } @else {
                    <div class="pista flex-1"></div>
                    <span class="w-[104px] shrink-0 text-right text-[12px] text-[#8491a3] dark:text-slate-500">
                      No se trabaja
                    </span>
                  }
                </div>
              }

              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1f3f6] pt-2.5 text-[11.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-3 rounded-[2px] bg-[#0f172a] dark:bg-slate-200"></span>Jornada
                </span>
                @if (politica()?.horaBreak) {
                  <span class="inline-flex items-center gap-1.5">
                    <span class="h-2 w-3 rounded-[2px] bg-[#f59e0b]"></span>
                    Break {{ hhmm(politica()!.horaBreak!) }} · {{ politica()!.minutosBreak }} min
                  </span>
                }
                <span>De 00:00 a 24:00</span>
              </div>
            </div>

            <!-- Tolerancias y pausas: cada regla se cambia por separado,
                 que es como se piensan y como se explican. -->
            <h2 [class]="estilos.titulo + ' !mt-4'">Tolerancias y pausas</h2>
            @if (politica(); as p) {
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                @for (r of reglas(); track r.clave) {
                  <div [class]="estilos.tarjeta">
                    <div class="mb-2 flex items-center justify-between gap-2">
                      <span [class]="estilos.icono">
                        <lucide-angular [name]="r.icono" [size]="15" class="block"></lucide-angular>
                      </span>
                      <button type="button" [class]="estilos.botonIcono" (click)="abrirRegla(r)"
                              [attr.aria-label]="'Cambiar ' + r.nombre" title="Cambiar">
                        <lucide-angular name="pencil" [size]="13" class="block"></lucide-angular>
                      </button>
                    </div>
                    <h3 [class]="estilos.rotulo">{{ r.nombre }}</h3>
                    <div [class]="estilos.cifra + ' !text-xl'">
                      {{ r.cifra }}<small [class]="estilos.unidad">{{ r.unidad }}</small>
                    </div>
                    <p [class]="estilos.pie">{{ r.pie }}</p>
                  </div>
                }
              </div>
              @if (p.heredada) {
                <p class="mt-2 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  Estos valores vienen de la configuración de la empresa. Al cambiarlos se crea
                  una propia de esta subcartera.
                </p>
              }
            }
          </div>

          <!-- El registro de cambios -->
          <div>
            <h2 [class]="estilos.titulo">Cambios de horario</h2>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Historial de cambios de horario</caption>
                <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                  <tr>
                    <th scope="col" [class]="estilos.th">Día</th>
                    <th scope="col" [class]="estilos.th">Horario</th>
                    <th scope="col" [class]="estilos.th">Vigencia</th>
                    <th scope="col" [class]="estilos.th">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  @for (h of paginaHistorial(); track h.id) {
                    <tr class="cursor-pointer border-b border-[#f1f3f6] last:border-0 hover:bg-[#fafbfc] dark:border-slate-800 dark:hover:bg-slate-800/40"
                        [class.opacity-60]="h.vigenteHasta" (click)="cambio.set(h)"
                        [title]="'Ver el detalle del cambio'">
                      <td [class]="estilos.td">{{ h.nombreDia ?? DIAS[h.diaSemana - 1] }}</td>
                      <td [class]="estilos.td">{{ hhmm(h.horaEntrada) }} – {{ hhmm(h.horaSalida) }}</td>
                      <td [class]="estilos.td">
                        {{ h.vigenteDesde | date: 'dd/MM/yy' }}
                        @if (h.vigenteHasta) {
                          – {{ h.vigenteHasta | date: 'dd/MM/yy' }}
                        } @else {
                          <span class="ml-1 rounded-full bg-[#e8f5ec] px-1.5 py-0.5 text-[10.5px] font-bold text-[#166534] dark:bg-green-950/50 dark:text-green-300">
                            vigente
                          </span>
                        }
                      </td>
                      <td [class]="estilos.td + ' !whitespace-normal'">{{ h.motivo }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="px-3 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                        Todavía no se ha cambiado ningún horario
                      </td>
                    </tr>
                  }
                </tbody>
              </table>

              @if (historial().length > porPagina) {
                <div class="flex items-center justify-between gap-3 border-t border-[#e6e9ee] px-3 py-2.5 dark:border-slate-800">
                  <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ textoPagina() }}</span>
                  <div class="flex gap-1.5">
                    <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() - 1)"
                            [disabled]="pagina() === 0" aria-label="Anteriores">
                      <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                    </button>
                    <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() + 1)"
                            [disabled]="!hayMas()" aria-label="Siguientes">
                      <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (tab() === 'calendario') {
        <div class="grid gap-4 lg:grid-cols-[1.4fr_1fr]">

          <div>
            <div class="mb-2.5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button type="button" [class]="estilos.botonIcono" (click)="moverMes(-1)" aria-label="Mes anterior">
                  <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                </button>
                <strong class="min-w-[150px] text-center text-[13px]">{{ tituloMes() }}</strong>
                <button type="button" [class]="estilos.botonIcono" (click)="moverMes(1)" aria-label="Mes siguiente">
                  <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                </button>
              </div>
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Pulsa un día para marcarlo
              </span>
            </div>

            <div [class]="estilos.tarjeta">
              <div class="mes mb-1.5">
                @for (i of INICIALES; track $index) {
                  <span class="text-center text-[10.5px] font-bold uppercase text-[#5f6c80] dark:text-slate-400">{{ i }}</span>
                }
              </div>
              <div class="mes">
                @for (c of celdas(); track c.fecha) {
                  <button type="button" class="celda"
                          [class.fuera]="!c.delMes"
                          [class.finde]="c.finde"
                          [class.marcado]="!!c.marca"
                          [disabled]="!c.delMes"
                          (click)="abrirDia(c.fecha, c.marca)">
                    <span class="text-[12px] font-bold tabular-nums">{{ c.dia }}</span>
                    @if (c.marca) {
                      <span class="truncate text-[10px] font-semibold text-[#92400e] dark:text-amber-300">
                        {{ c.marca.nombre ?? c.marca.tipo }}
                      </span>
                    }
                  </button>
                }
              </div>
            </div>
          </div>

          <div>
            <div class="mb-2.5 flex items-baseline justify-between gap-3">
              <h2 [class]="estilos.titulo + ' !mb-0'">Días registrados</h2>
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ dias().length }} {{ dias().length === 1 ? 'día' : 'días' }} en {{ tituloMes() }}
              </span>
            </div>
            <div [class]="estilos.panel">
              <ul class="!m-0 list-none !p-0">
                @for (d of dias(); track d.id) {
                  <li class="flex items-center gap-3 border-b border-[#f1f3f6] px-4 py-2.5 last:border-0 dark:border-slate-800">
                    <span class="w-[46px] shrink-0 text-[12.5px] font-bold tabular-nums">
                      {{ d.fecha | date: 'dd/MM' }}
                    </span>
                    <div class="min-w-0 flex-1">
                      <strong class="block truncate text-[12.5px]">{{ d.nombre ?? d.tipo }}</strong>
                      <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                        {{ d.tipo }} · {{ d.heredado ? 'de la empresa' : 'de esta subcartera' }}
                      </span>
                    </div>
                    @if (!d.heredado) {
                      <button type="button" [class]="estilos.botonIcono" (click)="quitarDia(d)"
                              [attr.aria-label]="'Quitar el ' + d.fecha" title="Quitar">
                        <lucide-angular name="trash-2" [size]="13" class="block"></lucide-angular>
                      </button>
                    }
                  </li>
                } @empty {
                  <li class="px-4 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                    Ningún día marcado este mes
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      }
    </div>

    </div>

    <!-- Editar el horario de un día -->
    @if (formHorario()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarHorario()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,460px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-horario">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-horario" class="!m-0 text-[15px] font-extrabold">Cambiar horario</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                No se sobrescribe: se cierra el vigente y empieza uno nuevo
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarHorario()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-dia">Día</label>
              <select id="h-dia" [class]="estilos.campo" [(ngModel)]="nuevoHorario.diaSemana">
                @for (d of DIAS; track $index) {
                  <option [ngValue]="$index + 1">{{ d }}</option>
                }
              </select>
            </div>
            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="h-entrada">Entrada</label>
                <input id="h-entrada" type="time" [class]="estilos.campo" [(ngModel)]="nuevoHorario.horaEntrada">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="h-salida">Salida</label>
                <input id="h-salida" type="time" [class]="estilos.campo" [(ngModel)]="nuevoHorario.horaSalida">
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-desde">Rige desde</label>
              <input id="h-desde" type="date" [class]="estilos.campo" [(ngModel)]="nuevoHorario.vigenteDesde">
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-motivo">Motivo</label>
              <textarea id="h-motivo" rows="2" [class]="estilos.area"
                        placeholder="Por qué cambia, para poder explicarlo después"
                        [(ngModel)]="nuevoHorario.motivo"></textarea>
            </div>
            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarHorario()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarHorario()" [disabled]="guardando()">
              <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
              {{ guardando() ? 'Guardando…' : 'Guardar' }}
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Cambiar una regla. Una sola: es como se piensan y como se explican,
         y un formulario con las ocho a la vez invita a tocar de más. -->
    @if (regla(); as r) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarRegla()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,420px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-regla">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-regla" class="!m-0 text-[15px] font-extrabold">Cambiar regla</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ r.nombre }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarRegla()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1">
              <span [class]="estilos.etiqueta">Alcance</span>
              <p class="!m-0 text-[13px]">{{ alcance() }}</p>
            </div>

            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="r-minutos">Minutos</label>
                <input id="r-minutos" type="number" min="0" max="240" step="5"
                       [class]="estilos.campo" [(ngModel)]="reglaMinutos">
              </div>
              @if (r.conHora) {
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="r-hora">Hora</label>
                  <input id="r-hora" type="time" [class]="estilos.campo"
                         [(ngModel)]="reglaHora" [disabled]="!reglaMinutos">
                </div>
              }
            </div>

            @if (r.clave === 'break') {
              <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Cero minutos significa que esta subcartera no tiene break.
              </p>
            }

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="r-motivo">Motivo</label>
              <input id="r-motivo" type="text" [class]="estilos.campo"
                     placeholder="Un tope que cambia sin explicación es una discusión garantizada"
                     [(ngModel)]="reglaMotivo">
            </div>

            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarRegla()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarRegla()" [disabled]="guardando()">
              <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
              Guardar
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- El detalle de un cambio de horario del historial -->
    @if (cambio(); as c) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cambio.set(null)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,440px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-cambio">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-cambio" class="!m-0 text-[15px] font-extrabold">Cambio de horario</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ c.vigenteHasta ? 'Ya no rige' : 'Vigente' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cambio.set(null)" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>
          <dl class="!m-0 grid grid-cols-[110px_1fr] gap-x-4 gap-y-2.5 px-5 py-4 text-[13px]">
            <dt class="text-[#5f6c80] dark:text-slate-400">Alcance</dt>
            <dd class="!m-0">{{ alcance() }}</dd>
            <dt class="text-[#5f6c80] dark:text-slate-400">Día</dt>
            <dd class="!m-0">{{ c.nombreDia ?? DIAS[c.diaSemana - 1] }}</dd>
            <dt class="text-[#5f6c80] dark:text-slate-400">Horario</dt>
            <dd class="!m-0 tabular-nums">{{ hhmm(c.horaEntrada) }} – {{ hhmm(c.horaSalida) }}</dd>
            <dt class="text-[#5f6c80] dark:text-slate-400">Vigencia</dt>
            <dd class="!m-0 tabular-nums">
              {{ c.vigenteDesde }}{{ c.vigenteHasta ? ' – ' + c.vigenteHasta : ' — sin cerrar' }}
            </dd>
            <dt class="text-[#5f6c80] dark:text-slate-400">Motivo</dt>
            <dd class="!m-0">{{ c.motivo }}</dd>
          </dl>
          <footer class="flex justify-end border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonPrimario" (click)="cambio.set(null)">Listo</button>
          </footer>
        </div>
      </div>
    }

    <!-- Marcar un día del calendario -->
    @if (formDia()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarDia()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,440px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-dia">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-dia" class="!m-0 text-[15px] font-extrabold">
                {{ nuevoDia.fecha | date: 'EEEE d \\'de\\' MMMM' }}
              </h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Lo que se marque aquí manda sobre el horario de ese día
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarDia()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="d-tipo">Qué es</label>
              <select id="d-tipo" [class]="estilos.campo" [(ngModel)]="nuevoDia.idTipoDia">
                @for (t of tiposDeCalendario(); track t.id) {
                  <option [ngValue]="t.id">{{ t.nombre }}</option>
                }
              </select>
            </div>
            @if (esFeriado()) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="d-nombre">Nombre del feriado</label>
                <input id="d-nombre" type="text" [class]="estilos.campo"
                       placeholder="Ej.: Santa Rosa de Lima" [(ngModel)]="nuevoDia.nombre">
              </div>
            }
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="d-motivo">Motivo</label>
              <input id="d-motivo" type="text" [class]="estilos.campo"
                     placeholder="Por qué no se trabaja ese día" [(ngModel)]="nuevoDia.motivo">
            </div>
            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarDia()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarDia()" [disabled]="guardando()">
              <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
              {{ guardando() ? 'Guardando…' : 'Marcar día' }}
            </button>
          </footer>
        </div>
      </div>
    }
  `
})
export class AsistenciaConfiguracionComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly DIAS = DIAS;
  protected readonly INICIALES = INICIALES;
  protected readonly porPagina = 8;

  protected readonly TABS = [
    { clave: 'horarios', texto: 'Horarios' },
    { clave: 'calendario', texto: 'Calendario' }
  ] as const;

  /** Vuelve al reporte; la pantalla la manda el módulo. */
  readonly volver = output<void>();

  readonly idSubcartera = input<number | null>(null);

  readonly tab = signal<string>('horarios');
  readonly horarios = signal<Horario[]>([]);
  readonly historial = signal<Horario[]>([]);
  readonly politica = signal<PoliticaAsistencia | null>(null);
  readonly tipos = signal<TipoDia[]>([]);
  readonly dias = signal<DiaCalendario[]>([]);
  readonly pagina = signal(0);
  readonly mes = signal(new Date());

  readonly guardando = signal(false);
  readonly error = signal('');

  readonly formHorario = signal(false);
  readonly formDia = signal(false);

  /** La regla que se está cambiando, y el detalle de un cambio de horario. */
  readonly regla = signal<Regla | null>(null);
  readonly cambio = signal<Horario | null>(null);
  reglaMinutos = 0;
  reglaHora: string | null = null;
  reglaMotivo = '';

  nuevoHorario: Horario = {
    idSubcartera: null,
    idUsuario: null,
    diaSemana: 1,
    horaEntrada: '08:00',
    horaSalida: '18:30',
    vigenteDesde: hoy(),
    motivo: ''
  };

  nuevoDia: DiaCalendario = {
    fecha: hoy(),
    idSubcartera: null,
    idTipoDia: 0,
    nombre: null,
    motivo: ''
  };

  /** Los siete días, con hueco en los que no se trabaja. */
  readonly semana = computed(() => {
    const vigentes = this.horarios();
    return Array.from({ length: 7 }, (_, i) => {
      const fila = vigentes.find(h => h.diaSemana === i + 1);
      return {
        diaSemana: i + 1,
        horaEntrada: fila?.horaEntrada ?? null,
        horaSalida: fila?.horaSalida ?? null
      };
    });
  });

  /**
   * Las cuatro reglas de la política, cada una con lo suyo. Se enseñan y se
   * cambian por separado porque así es como se piensan: «el break es de 15
   * minutos a las cinco», no «la política tiene ocho campos».
   */
  readonly reglas = computed<Regla[]>(() => {
    const p = this.politica();
    if (!p) {
      return [];
    }
    return [
      {
        clave: 'dia', nombre: 'Tolerancia del día', icono: 'clock',
        pie: 'Pasado esto se pierde el bono',
        cifra: String(p.toleranciaDiaMin), unidad: 'min',
        minutos: p.toleranciaDiaMin, hora: null, conHora: false
      },
      {
        clave: 'semana', nombre: 'Tolerancia de la semana', icono: 'calendar-days',
        pie: 'Suma solo los días con retraso',
        cifra: String(p.toleranciaSemanaMin), unidad: 'min',
        minutos: p.toleranciaSemanaMin, hora: null, conHora: false
      },
      {
        clave: 'almuerzo', nombre: 'Almuerzo', icono: 'utensils',
        pie: 'No cuenta como trabajado',
        cifra: String(p.minutosAlmuerzo),
        unidad: p.horaAlmuerzo ? `min · ${this.hhmm(p.horaAlmuerzo)}` : 'min',
        minutos: p.minutosAlmuerzo, hora: p.horaAlmuerzo ? this.hhmm(p.horaAlmuerzo) : null,
        conHora: true
      },
      {
        clave: 'break', nombre: 'Break', icono: 'coffee',
        pie: 'Después del almuerzo',
        cifra: p.minutosBreak ? String(p.minutosBreak) : 'Sin break',
        unidad: p.minutosBreak ? (p.horaBreak ? `min · ${this.hhmm(p.horaBreak)}` : 'min') : '',
        minutos: p.minutosBreak, hora: p.horaBreak ? this.hhmm(p.horaBreak) : null,
        conHora: true
      }
    ];
  });

  /** A quién aplica lo que se está cambiando. */
  readonly alcance = computed(() =>
    this.idSubcartera() ? 'Solo esta subcartera' : 'Toda la empresa');

  readonly paginaHistorial = computed(() =>
    this.historial().slice(this.pagina() * this.porPagina, (this.pagina() + 1) * this.porPagina));

  readonly hayMas = computed(() =>
    (this.pagina() + 1) * this.porPagina < this.historial().length);

  /** Solo los tipos que tienen sentido en un calendario, no los de ausencia. */
  readonly tiposDeCalendario = computed(() =>
    this.tipos().filter(t => ['FERIADO', 'NO_LABORABLE', 'SIN_ASIGNACION'].includes(t.codigo)));

  readonly esFeriado = computed(() =>
    this.tipos().find(t => t.id === this.nuevoDia.idTipoDia)?.codigo === 'FERIADO');

  readonly tituloMes = computed(() => {
    const texto = this.mes().toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  });

  /** Seis semanas completas: así la grilla no cambia de alto al pasar de mes. */
  readonly celdas = computed(() => {
    const base = this.mes();
    const primero = new Date(base.getFullYear(), base.getMonth(), 1);
    const inicio = new Date(primero);
    inicio.setDate(inicio.getDate() - ((inicio.getDay() + 6) % 7));

    const marcados = new Map(this.dias().map(d => [d.fecha, d]));

    return Array.from({ length: 42 }, (_, i) => {
      const dia = new Date(inicio);
      dia.setDate(dia.getDate() + i);
      const fecha = dia.toISOString().slice(0, 10);
      return {
        fecha,
        dia: dia.getDate(),
        delMes: dia.getMonth() === base.getMonth(),
        finde: dia.getDay() === 0 || dia.getDay() === 6,
        marca: marcados.get(fecha) ?? null
      };
    });
  });

  /** El ancho del break en la pista de 24 horas. */
  readonly anchoBreak = computed(() => {
    const p = this.politica();
    return p?.minutosBreak ? (p.minutosBreak / (24 * 60)) * 100 : 0;
  });

  constructor() {
    effect(() => {
      const ambito = this.idSubcartera();
      this.cargarHorarios(ambito);
    });
    effect(() => {
      const ambito = this.idSubcartera();
      const base = this.mes();
      this.cargarCalendario(ambito, base);
    });

    this.servicio.tiposDeDia().subscribe({
      next: t => {
        this.tipos.set(t);
        this.nuevoDia.idTipoDia = this.tiposDeCalendario()[0]?.id ?? 0;
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de día')
    });
  }

  private cargarHorarios(idSubcartera: number | null): void {
    this.servicio.horarios(idSubcartera).subscribe({
      next: h => this.horarios.set(h),
      error: () => this.toast.error('No se pudo cargar el horario')
    });
    this.servicio.historialHorarios(idSubcartera).subscribe({
      next: h => {
        this.historial.set(h);
        this.pagina.set(0);
      },
      error: () => this.toast.error('No se pudo cargar el historial')
    });
    this.servicio.politica(idSubcartera).subscribe({
      next: p => this.politica.set(p),
      error: () => this.toast.error('No se pudieron cargar las tolerancias')
    });
  }

  private cargarCalendario(idSubcartera: number | null, base: Date): void {
    const desde = new Date(base.getFullYear(), base.getMonth(), 1).toISOString().slice(0, 10);
    const hasta = new Date(base.getFullYear(), base.getMonth() + 1, 0).toISOString().slice(0, 10);
    this.servicio.calendario(desde, hasta, idSubcartera).subscribe({
      next: d => this.dias.set(d),
      error: () => this.toast.error('No se pudo cargar el calendario')
    });
  }

  moverMes(paso: number): void {
    const base = this.mes();
    this.mes.set(new Date(base.getFullYear(), base.getMonth() + paso, 1));
  }

  // ==================== HORARIO ====================

  abrirHorario(): void {
    this.formHorario.set(true);
    this.error.set('');
    const primero = this.horarios()[0];
    this.nuevoHorario = {
      idSubcartera: this.idSubcartera(),
      idUsuario: null,
      diaSemana: primero?.diaSemana ?? 1,
      horaEntrada: this.hhmm(primero?.horaEntrada ?? '08:00'),
      horaSalida: this.hhmm(primero?.horaSalida ?? '18:30'),
      vigenteDesde: hoy(),
      motivo: ''
    };
  }

  cerrarHorario(): void {
    this.formHorario.set(false);
  }

  guardarHorario(): void {
    if (!this.nuevoHorario.motivo.trim()) {
      this.error.set('El cambio de horario exige un motivo');
      return;
    }
    if (this.nuevoHorario.horaSalida <= this.nuevoHorario.horaEntrada) {
      this.error.set('La salida no puede ser anterior a la entrada');
      return;
    }

    this.guardando.set(true);
    this.servicio.guardarHorario({ ...this.nuevoHorario, idSubcartera: this.idSubcartera() }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarHorario();
        this.toast.success('Horario cambiado');
        this.cargarHorarios(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? respuesta?.error ?? 'No se pudo guardar');
      }
    });
  }

  // ==================== UNA REGLA ====================

  abrirRegla(r: Regla): void {
    this.regla.set(r);
    this.reglaMinutos = r.minutos;
    this.reglaHora = r.hora;
    this.reglaMotivo = '';
    this.error.set('');
  }

  cerrarRegla(): void {
    this.regla.set(null);
  }

  /**
   * Guarda la política entera con esa regla cambiada: es versionada, así que
   * cada cambio cierra la vigente y abre otra con TODOS los valores. Mandar
   * solo el campo tocado dejaría los demás en su valor por defecto.
   */
  guardarRegla(): void {
    const r = this.regla();
    const actual = this.politica();
    if (!r || !actual) {
      return;
    }
    if (!this.reglaMotivo.trim()) {
      this.error.set('El motivo del cambio es obligatorio');
      return;
    }

    const nueva: PoliticaAsistencia = {
      idSubcartera: this.idSubcartera(),
      toleranciaDiaMin: r.clave === 'dia' ? this.reglaMinutos : actual.toleranciaDiaMin,
      toleranciaSemanaMin: r.clave === 'semana' ? this.reglaMinutos : actual.toleranciaSemanaMin,
      minutosAlmuerzo: r.clave === 'almuerzo' ? this.reglaMinutos : actual.minutosAlmuerzo,
      minutosBreak: r.clave === 'break' ? this.reglaMinutos : actual.minutosBreak,
      horaAlmuerzo: r.clave === 'almuerzo' ? this.reglaHora : actual.horaAlmuerzo,
      horaBreak: r.clave === 'break' ? this.reglaHora : actual.horaBreak,
      avisoPrevioMin: actual.avisoPrevioMin,
      vigenteDesde: hoy(),
      motivo: this.reglaMotivo.trim()
    };

    this.guardando.set(true);
    this.servicio.guardarPolitica(nueva).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarRegla();
        this.toast.success(`${r.nombre} actualizada`);
        this.cargarHorarios(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar');
      }
    });
  }

  // ==================== CALENDARIO ====================

  abrirDia(fecha: string, marca: DiaCalendario | null): void {
    // Un día que viene del calendario de la empresa no se edita desde aquí:
    // se quitaría para todo el mundo sin que nadie lo note.
    if (marca?.heredado) {
      this.toast.error('Ese día viene del calendario de la empresa');
      return;
    }

    this.formDia.set(true);
    this.error.set('');
    this.nuevoDia = {
      id: marca?.id,
      fecha,
      idSubcartera: this.idSubcartera(),
      idTipoDia: marca?.idTipoDia ?? this.tiposDeCalendario()[0]?.id ?? 0,
      nombre: marca?.nombre ?? null,
      motivo: marca?.motivo ?? ''
    };
  }

  cerrarDia(): void {
    this.formDia.set(false);
  }

  guardarDia(): void {
    if (!this.nuevoDia.motivo.trim()) {
      this.error.set('El motivo es obligatorio');
      return;
    }
    if (this.esFeriado() && !this.nuevoDia.nombre?.trim()) {
      this.error.set('Un feriado necesita nombre');
      return;
    }

    this.guardando.set(true);
    this.servicio.marcarDia({ ...this.nuevoDia, idSubcartera: this.idSubcartera() }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarDia();
        this.toast.success('Día marcado');
        this.cargarCalendario(this.idSubcartera(), this.mes());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo marcar el día');
      }
    });
  }

  quitarDia(d: DiaCalendario): void {
    if (!d.id) {
      return;
    }
    this.servicio.quitarDia(d.id, this.idSubcartera()).subscribe({
      next: () => {
        this.toast.success('Día quitado del calendario');
        this.cargarCalendario(this.idSubcartera(), this.mes());
      },
      error: respuesta => this.toast.error(respuesta?.error?.error ?? 'No se pudo quitar')
    });
  }

  // ==================== PRESENTACIÓN ====================

  /** Dónde cae una hora en una pista que va de 00:00 a 24:00. */
  porcentaje(hora: string): number {
    const [h, m] = this.hhmm(hora).split(':').map(Number);
    return ((h * 60 + m) / (24 * 60)) * 100;
  }

  hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  textoPagina(): string {
    const desde = this.pagina() * this.porPagina + 1;
    const hasta = Math.min(desde + this.porPagina - 1, this.historial().length);
    return `${desde}–${hasta} de ${this.historial().length}`;
  }
}
