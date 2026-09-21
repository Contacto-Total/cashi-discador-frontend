import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { DiaCalendario, Horario, PoliticaAsistencia, ResumenAgente, TipoDia } from './asistencia.models';
import { ESTILOS, finDeSemanaDe, hoy, lunesDe } from './asistencia.estilos';

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
const CABECERAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
               'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

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
    /* El mes: una rejilla con los bordes compartidos, no celdas sueltas. */
    .mes {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px;
      background: #e6e9ee; border: 1px solid #e6e9ee;
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 1px 2px rgba(15,23,42,.04);
    }
    .mes .cab-dia {
      background: #fff; padding: 7px 8px; text-align: center;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; color: #5f6c80;
    }
    .dia-cal {
      background: #fff; min-height: 76px; padding: 6px 7px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
      border: 0; font: inherit; text-align: left; color: inherit; cursor: pointer;
    }
    .dia-cal:hover { background: #f4f6f9 }
    .dia-cal:focus-visible { outline: 2px solid #2563eb; outline-offset: -2px }
    .dia-cal .num { font-size: 12.5px; font-weight: 700; font-variant-numeric: tabular-nums }
    .dia-cal.fuera { background: #f6f7f9; cursor: default }
    .dia-cal.fuera .num { color: #8491a3; font-weight: 600 }
    /* El fin de semana según el HORARIO del ámbito: en CASTIGO el sábado se
       trabaja y no puede salir en gris. */
    .dia-cal.finde { background: #f1f3f6 }
    .dia-cal.finde .num { color: #8491a3 }
    .dia-cal.hoy .num {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px;
      background: #0f172a; color: #fff;
    }
    .etq-dia {
      max-width: 100%; padding: 1px 6px; border-radius: 5px; line-height: 1.5;
      font-size: 10.5px; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .etq-feriado { background: #fdecec; color: #b91c1c }
    .etq-sinasig { background: #fdeee0; color: #c2410c }
    :host-context(.dark) .mes { background: #1e293b; border-color: #1e293b }
    :host-context(.dark) .mes .cab-dia { background: #0f172a }
    :host-context(.dark) .dia-cal { background: #0f172a }
    :host-context(.dark) .dia-cal:hover { background: #1e293b }
    :host-context(.dark) .dia-cal.fuera { background: #020617 }
    :host-context(.dark) .dia-cal.finde { background: #0b1220 }
    :host-context(.dark) .dia-cal.hoy .num { background: #fff; color: #0f172a }
    :host-context(.dark) .etq-feriado { background: rgba(69,10,10,.6); color: #fca5a5 }
    :host-context(.dark) .etq-sinasig { background: rgba(67,20,7,.6); color: #fdba74 }
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
        <!-- El horario que se ve es el de la subcartera, salvo que se pida el
             de alguien en concreto: hay asesores con excepción. -->
        <div class="mb-4 flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="persona-h">Excepción por persona</label>
            <select id="persona-h" [class]="estilos.campo + ' w-[240px]'"
                    [ngModel]="idPersona()" (ngModelChange)="elegirPersona($event)">
              <option [ngValue]="null">Ninguna (horario de la subcartera)</option>
              @for (p of personas(); track p.idUsuario) {
                <option [ngValue]="p.idUsuario">{{ p.nombreAgente }}</option>
              }
            </select>
          </div>
          @if (idPersona()) {
            <p class="!m-0 pb-[11px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              Lo que se guarde aquí vale solo para esta persona.
            </p>
          }
        </div>

        <div class="grid gap-4 lg:grid-cols-[1fr_1fr]">

          <!-- El horario de la semana, dibujado -->
          <div>
            <div class="mb-2.5 flex items-center justify-between gap-3">
              <h2 [class]="estilos.titulo + ' !mb-0'">Horario vigente</h2>
              <button type="button" [class]="estilos.botonSecundario" (click)="abrirHorario()">
                <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
                Nuevo horario
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
        <!-- La barra del mes, con lo que se hace desde aquí -->
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button type="button" [class]="estilos.botonIcono" (click)="moverMes(-1)" aria-label="Mes anterior">
              <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
            </button>
            <strong class="min-w-[138px] text-center text-[14.5px] capitalize">{{ tituloMes() }}</strong>
            <button type="button" [class]="estilos.botonIcono" (click)="moverMes(1)" aria-label="Mes siguiente">
              <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
            </button>
            <button type="button"
                    class="ml-1 inline-flex h-[30px] items-center gap-[5px] rounded-lg border border-[#8491a3] bg-white px-[11px] text-[12px] font-semibold !text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200"
                    (click)="irAHoy()">Hoy</button>
          </div>

          <div class="flex flex-wrap gap-2">
            <button type="button" [class]="estilos.botonSecundario" (click)="importarFeriados()"
                    [disabled]="guardando()">
              <lucide-angular name="upload" [size]="15" class="block"></lucide-angular>
              Importar feriados del año
            </button>
            <button type="button" [class]="estilos.botonPrimario" (click)="abrirDia(hoyISO(), null)">
              <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
              Agregar día
            </button>
          </div>
        </div>

        <div class="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div>
            <!-- Qué significa cada fondo, antes de la rejilla -->
            <div class="mb-3 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
              @for (l of LEYENDA; track l.texto) {
                <span class="inline-flex items-center gap-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  <i class="h-[11px] w-[11px] rounded-[3px] border" [style.background]="l.fondo"
                     [style.border-color]="l.borde"></i>{{ l.texto }}
                </span>
              }
            </div>

            <div class="mes">
              @for (c of CABECERAS; track c) { <div class="cab-dia">{{ c }}</div> }
              @for (d of celdas(); track d.fecha) {
                <button type="button" class="dia-cal"
                        [class.fuera]="!d.delMes" [class.finde]="d.finde" [class.hoy]="d.esHoy"
                        [disabled]="!d.delMes"
                        (click)="abrirDia(d.fecha, d.marca)"
                        [attr.aria-label]="'Marcar el ' + d.fecha">
                  <span class="num">{{ d.dia }}</span>
                  @if (d.marca) {
                    <span class="etq-dia"
                          [class]="d.marca.tipoCodigo === 'FERIADO' ? 'etq-feriado' : 'etq-sinasig'"
                          [title]="(d.marca.nombre ?? d.marca.tipo) + ' · ' + d.marca.motivo">
                      {{ d.marca.nombre ?? d.marca.tipo }}
                    </span>
                  }
                </button>
              }
            </div>
          </div>

          <div>
            <div class="mb-2.5 flex items-baseline justify-between gap-3">
              <h2 [class]="estilos.titulo + ' !mb-0'">Días registrados</h2>
              <span class="text-[11.5px] lowercase text-[#5f6c80] dark:text-slate-400">{{ tituloMes() }}</span>
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
                    Ningún día registrado en este mes
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
            @if (!aplicarSemana) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="h-dia">Día</label>
                <select id="h-dia" [class]="estilos.campo" [(ngModel)]="nuevoHorario.diaSemana">
                  @for (d of DIAS; track $index) {
                    <option [ngValue]="$index + 1">{{ d }}</option>
                  }
                </select>
              </div>
            }
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
            <!-- Casi siempre el cambio es para toda la semana laboral: hacerlo
                 día a día son cinco formularios iguales. -->
            <label class="flex cursor-pointer items-center gap-2.5 text-[13px]" for="h-semana">
              <input id="h-semana" type="checkbox" class="h-4 w-4 accent-[#0f172a]"
                     [(ngModel)]="aplicarSemana">
              Aplicar el mismo horario de lunes a viernes
            </label>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-desde">Rige desde</label>
              <input id="h-desde" type="date" [class]="estilos.campo" [(ngModel)]="nuevoHorario.vigenteDesde">
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-motivo">Motivo del cambio</label>
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
  protected readonly CABECERAS = CABECERAS;

  /** Qué dice cada fondo de la rejilla. */
  protected readonly LEYENDA = [
    { texto: 'Laborable', fondo: '#ffffff', borde: '#e6e9ee' },
    { texto: 'Fin de semana', fondo: '#f1f3f6', borde: '#e6e9ee' },
    { texto: 'Feriado', fondo: '#fdecec', borde: '#dc2626' },
    { texto: 'Sin asignación', fondo: '#fdeee0', borde: '#ea580c' }
  ];
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

  /** La persona con excepción, si se está mirando una. */
  readonly idPersona = signal<number | null>(null);
  readonly personas = signal<ResumenAgente[]>([]);
  /** Casi siempre el cambio es para toda la semana laboral. */
  aplicarSemana = true;

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

  readonly tituloMes = computed(() =>
    `${MESES[this.mes().getMonth()]} ${this.mes().getFullYear()}`);

  /**
   * Las celdas del mes. Arranca el lunes de la semana del día 1 y ocupa solo
   * las semanas que hagan falta: reservar siempre seis filas deja una fila
   * entera vacía en la mitad de los meses.
   *
   * Lo que es «fin de semana» sale del HORARIO del ámbito, no del día de la
   * semana: en CASTIGO el sábado se trabaja y no puede salir en gris.
   */
  readonly celdas = computed(() => {
    const base = this.mes();
    const anio = base.getFullYear();
    const mes = base.getMonth();

    const laborables = new Set(this.horarios().map(h => h.diaSemana));
    const desplazamiento = (new Date(anio, mes, 1).getDay() + 6) % 7;
    const diasDelMes = new Date(anio, mes + 1, 0).getDate();
    const cuantas = Math.ceil((desplazamiento + diasDelMes) / 7) * 7;

    const marcados = new Map(this.dias().map(d => [d.fecha, d]));
    const hoyTexto = hoy();

    return Array.from({ length: cuantas }, (_, i) => {
      const dia = new Date(anio, mes, 1 - desplazamiento + i);
      const fecha = this.aISO(dia);
      const iso = ((dia.getDay() + 6) % 7) + 1;
      return {
        fecha,
        dia: dia.getDate(),
        delMes: dia.getMonth() === mes,
        finde: !laborables.has(iso),
        esHoy: fecha === hoyTexto,
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

    // El selector de excepción solo lista a quien está en el ámbito elegido.
    effect(() => {
      const ambito = this.idSubcartera();
      if (!ambito) {
        this.personas.set([]);
        this.idPersona.set(null);
        return;
      }
      const lunes = lunesDe(new Date());
      this.servicio.reporte(lunes, finDeSemanaDe(new Date()), ambito).subscribe({
        next: r => this.personas.set(r.agentes),
        error: () => this.personas.set([])
      });
    });

    this.servicio.tiposDeDia().subscribe({
      next: t => {
        this.tipos.set(t);
        this.nuevoDia.idTipoDia = this.tiposDeCalendario()[0]?.id ?? 0;
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de día')
    });
  }

  /** Cambiar de persona recarga el horario: el suyo puede no ser el de todos. */
  elegirPersona(id: number | null): void {
    this.idPersona.set(id);
    this.cargarHorarios(this.idSubcartera());
  }

  private cargarHorarios(idSubcartera: number | null): void {
    this.servicio.horarios(idSubcartera, this.idPersona()).subscribe({
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
    const desde = this.aISO(new Date(base.getFullYear(), base.getMonth(), 1));
    const hasta = this.aISO(new Date(base.getFullYear(), base.getMonth() + 1, 0));
    this.servicio.calendario(desde, hasta, idSubcartera).subscribe({
      next: d => this.dias.set(d),
      error: () => this.toast.error('No se pudo cargar el calendario')
    });
  }

  moverMes(paso: number): void {
    const base = this.mes();
    this.mes.set(new Date(base.getFullYear(), base.getMonth() + paso, 1));
  }

  irAHoy(): void {
    const ahora = new Date();
    this.mes.set(new Date(ahora.getFullYear(), ahora.getMonth(), 1));
  }

  hoyISO(): string {
    return hoy();
  }

  /**
   * Fecha local a texto. `toISOString()` pasa por UTC y en Lima devuelve el día
   * anterior para todo lo que caiga antes de las 19:00.
   */
  private aISO(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  /**
   * Trae los feriados nacionales del año que se está viendo. Se pulsa una vez
   * al empezar el año: escribirlos a mano son veinte formularios.
   */
  importarFeriados(): void {
    const anio = this.mes().getFullYear();
    this.guardando.set(true);
    this.servicio.importarFeriados(anio).subscribe({
      next: r => {
        this.guardando.set(false);
        this.toast.success(r.importados
          ? `${r.importados} feriados de ${anio} añadidos`
          : `Los feriados de ${anio} ya estaban`);
        this.cargarCalendario(this.idSubcartera(), this.mes());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudieron importar los feriados');
      }
    });
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

    // Una fila por día: el horario es por día de la semana, así que aplicarlo
    // de lunes a viernes son cinco cambios, cada uno con su propio motivo.
    const dias = this.aplicarSemana ? [1, 2, 3, 4, 5] : [this.nuevoHorario.diaSemana];

    this.guardando.set(true);
    let pendientes = dias.length;
    let fallo: string | null = null;

    for (const dia of dias) {
      this.servicio.guardarHorario({
        ...this.nuevoHorario,
        diaSemana: dia,
        idSubcartera: this.idSubcartera(),
        idUsuario: this.idPersona()
      }).subscribe({
        next: () => this.alGuardarHorario(--pendientes, fallo),
        error: respuesta => {
          fallo = respuesta?.error?.error ?? respuesta?.error ?? 'No se pudo guardar';
          this.alGuardarHorario(--pendientes, fallo);
        }
      });
    }
  }

  private alGuardarHorario(pendientes: number, fallo: string | null): void {
    if (pendientes > 0) {
      return;
    }
    this.guardando.set(false);
    if (fallo) {
      this.error.set(fallo);
      return;
    }
    this.cerrarHorario();
    this.toast.success(this.aplicarSemana ? 'Horario de la semana cambiado' : 'Horario cambiado');
    this.cargarHorarios(this.idSubcartera());
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
