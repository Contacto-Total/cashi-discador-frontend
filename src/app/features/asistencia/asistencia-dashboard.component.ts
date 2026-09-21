import {
  AfterViewInit, Component, ElementRef, OnDestroy, computed, effect,
  inject, input, output, signal, untracked, viewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Chart, registerables } from 'chart.js';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { DashboardAsistencia, EstadoAsistencia, Justificacion } from './asistencia.models';
import { ESTADOS, ESTILOS, duracionCorta, enDuracion, semanaPorDefecto, unidadDe } from './asistencia.estilos';

Chart.register(...registerables);

/** Los mismos colores plenos que usan las cintas del reporte. */
const COLOR: Record<string, string> = {
  PUNTUAL: '#16a34a',
  TARDE: '#f59e0b',
  FALTA: '#dc2626',
  INCOMPLETO: '#8491a3',
  JUSTIFICADO: '#6366f1',
  NO_LABORABLE: '#e6e9ee'
};

/**
 * La tardanza por día va en celeste y no en el ámbar de «Tarde»: el ámbar ya
 * está en la dona, el mapa y las barras, y aquí es una sola serie. Es el tono
 * de sky que pasa las comprobaciones de la skill de gráficos sobre la
 * superficie clara y la oscura; el celeste más claro se queda corto de
 * contraste sobre blanco.
 */
const CELESTE = '#0284c7';

const DIAS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * El pulso de la cartera: lo que se mira antes de entrar al detalle.
 *
 * Seis piezas que responden seis preguntas distintas: cómo vamos, cuánta
 * tardanza hay, quién pierde el bono, qué falta por completar, cómo fue cada
 * día y quién se queda corto de horas.
 *
 * Sin ámbito elegido no se dibuja nada: con la empresa entera el mapa tiene
 * cientos de filas y no responde a ninguna pregunta.
 */
@Component({
  selector: 'app-asistencia-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    /* Los lienzos llevan alto fijo: sin él, Chart.js crece sin parar. */
    .lienzo { position: relative; height: 190px }
    .lienzo-dona { height: 170px; flex: none; width: 170px }
    .lienzo-alto { height: 260px }

    /* La dona con su leyenda al lado, centradas en el hueco de la tarjeta. */
    .dona-con-leyenda { flex: 1; display: flex; align-items: center; justify-content: center; gap: 22px }
    @media (max-width: 560px) { .dona-con-leyenda { flex-direction: column } }
    .leyenda-lado {
      list-style: none; margin: 0; padding: 0; flex: none; min-width: 132px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .leyenda-lado li { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #5f6c80 }
    .leyenda-lado .cuadro { width: 10px; height: 10px; border-radius: 3px; flex: none }
    .leyenda-lado strong { margin-left: auto; color: #0f172a; font-variant-numeric: tabular-nums }
    :host-context(.dark) .leyenda-lado li { color: #94a3b8 }
    :host-context(.dark) .leyenda-lado strong { color: #f1f5f9 }

    /* Los tres pasos del cierre: un círculo con su icono y una línea entre pasos. */
    .avance { display: flex; align-items: center; gap: 6px; padding-bottom: 12px; border-bottom: 1px solid #f1f3f6 }
    .avance .union { flex: 1; min-width: 8px; height: 1px; background: #e6e9ee }
    .paso-cierre { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #5f6c80 }
    .paso-cierre .marca-paso {
      display: inline-flex; align-items: center; justify-content: center; flex: none;
      width: 24px; height: 24px; border-radius: 999px; background: #f1f3f6; color: #5f6c80;
    }
    .paso-cierre.hecho, .paso-cierre.falta { color: #0f172a }
    .paso-cierre.hecho .marca-paso { background: #e8f5ec; color: #166534 }
    .paso-cierre.falta .marca-paso { background: #fef6e0; color: #92400e }
    .paso-cierre.listo .marca-paso { background: #0f172a; color: #fff }
    :host-context(.dark) .avance { border-color: #1e293b }
    :host-context(.dark) .avance .union { background: #1e293b }
    :host-context(.dark) .paso-cierre { color: #94a3b8 }
    :host-context(.dark) .paso-cierre .marca-paso { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .paso-cierre.hecho, :host-context(.dark) .paso-cierre.falta { color: #f1f5f9 }
    :host-context(.dark) .paso-cierre.hecho .marca-paso { background: #052e16; color: #86efac }
    :host-context(.dark) .paso-cierre.falta .marca-paso { background: #451a03; color: #fcd34d }
    :host-context(.dark) .paso-cierre.listo .marca-paso { background: #fff; color: #0f172a }

    /* Cada pendiente, una banda del color de su caso. */
    .lista-pendientes {
      flex: 1; display: flex; flex-direction: column; justify-content: space-around; gap: 8px;
      list-style: none; margin: 12px 0 0; padding: 0;
    }
    .lista-pendientes li {
      display: flex; align-items: center; justify-content: space-between; gap: 11px;
      padding: 11px 13px; border-radius: 10px; background: var(--fila-fondo); color: var(--fila-texto);
    }
    .lista-pendientes .ir {
      flex: 1; min-width: 0; text-align: left; border: 0; background: none; padding: 0;
      color: inherit; font: inherit; font-size: 13px; border-radius: 6px;
    }
    .lista-pendientes .ir:hover { text-decoration: underline }
    .lista-pendientes .ir:focus-visible { outline: 2px solid #2563eb; outline-offset: 3px }
    .lista-pendientes .pie-fila {
      display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-size: 11.5px; opacity: .78;
    }
    .lista-pendientes .estado-fila { font-size: 11.5px; font-weight: 700; white-space: nowrap }
    .fila-falta { --fila-fondo: #fef6e0; --fila-texto: #92400e }
    .fila-ok { --fila-fondo: #e8f5ec; --fila-texto: #166534 }
    .fila-neutro { --fila-fondo: #f1f3f6; --fila-texto: #5f6c80 }
    :host-context(.dark) .fila-falta { --fila-fondo: #451a03; --fila-texto: #fcd34d }
    :host-context(.dark) .fila-ok { --fila-fondo: #052e16; --fila-texto: #86efac }
    :host-context(.dark) .fila-neutro { --fila-fondo: #1e293b; --fila-texto: #94a3b8 }

    /* Avisos: el total arriba, un bloque por pausa y un chip por persona. Las
       tres franjas se reparten el alto de la tarjeta. */
    .total-avisos {
      flex: 1; display: flex; flex-direction: column; justify-content: center;
      padding-bottom: 10px; border-bottom: 1px solid #f1f3f6;
    }
    .por-pausa { flex: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 12px }
    .bloque-pausa {
      display: flex; align-items: center; gap: 10px; padding: 12px 14px;
      border: 1px solid #e6e9ee; border-radius: 10px;
    }
    .chips-exceso { flex: 1; display: flex; flex-wrap: wrap; align-items: center; align-content: center; gap: 8px; margin-top: 12px }
    .chip-exceso {
      display: inline-flex; align-items: center; gap: 6px; padding: 4px 11px; border-radius: 999px;
      border: 1px solid #e6e9ee; background: #fff; font-size: 12px; color: #334155;
    }
    .chip-exceso strong { color: #0f172a; font-variant-numeric: tabular-nums }
    .chip-exceso.fuerte { border-color: #f59e0b; background: #fef6e0; color: #92400e }
    .chip-exceso.fuerte strong { color: #92400e }
    :host-context(.dark) .total-avisos { border-color: #1e293b }
    :host-context(.dark) .bloque-pausa { border-color: #1e293b }
    :host-context(.dark) .chip-exceso { border-color: #1e293b; background: #0f172a; color: #e2e8f0 }
    :host-context(.dark) .chip-exceso strong { color: #f1f5f9 }
    :host-context(.dark) .chip-exceso.fuerte { border-color: #f59e0b; background: #451a03; color: #fcd34d }
    :host-context(.dark) .chip-exceso.fuerte strong { color: #fcd34d }

    /* La tira de la puntualidad: diez segmentos, uno por cada 10 %. */
    .tira { display: flex; gap: 3px; width: 100% }
    .tira .seg { flex: 1; height: 12px; border-radius: 3px; background: #f1f3f6 }
    :host-context(.dark) .tira .seg { background: #1e293b }

    /* La barra con el tope del equipo al medio. */
    .barra-tope { position: relative; height: 12px; width: 100%; border-radius: 999px; background: #f1f3f6 }
    .barra-tope::after {
      content: ""; position: absolute; left: 0; top: 0; height: 100%; width: var(--valor);
      border-radius: 999px; background: var(--color);
    }
    .barra-tope::before {
      content: ""; position: absolute; top: -4px; bottom: -4px; left: 50%; width: 2px;
      background: #0f172a; z-index: 1;
    }
    :host-context(.dark) .barra-tope { background: #1e293b }
    :host-context(.dark) .barra-tope::before { background: #e2e8f0 }

    /* Una silueta por persona: las que pierden el bono, en rojo. */
    .fila-personas { display: flex; flex-wrap: wrap; gap: 3px; color: #8491a3 }
    .fila-personas .mal { color: #dc2626 }

    /* El mapa de la semana: una fila por persona, un cuadro por día. */
    .mapa { display: grid; gap: 4px; align-items: center }
    .mapa .cuadro-dia { height: 26px; border-radius: 6px }
    .mapa .nombre {
      font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      padding-right: 8px;
    }
  `],
  template: `
  <!-- Cada pantalla trae su cabecera bajo la del módulo: es donde vive lo que
       solo sirve aquí. -->
  <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Dashboard de Asistencia</h1>
        <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" [class]="estilos.botonSecundario" (click)="semanaAnterior.emit()">
          <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
          Semana anterior
        </button>
        <!-- Solo cuando se ha ido hacia atrás: en la semana por defecto no hay
             adónde volver y el botón sería ruido. -->
        @if (!esSemanaPorDefecto()) {
          <button type="button" [class]="estilos.botonSecundario" (click)="volverASemana.emit()">
            Volver a esta semana
            <lucide-angular name="arrow-right" [size]="15" class="block"></lucide-angular>
          </button>
        }
      </div>
    </div>
  </div>

  <div class="px-7 py-5">
    @if (!idSubcartera()) {
      <div [class]="estilos.vacio">
        <strong class="block text-[13.5px]">Elige un cliente, una cartera o una subcartera</strong>
        <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
          El dashboard resume el ámbito elegido; con toda la empresa de golpe no se lee.
        </span>
      </div>
    } @else if (cargando()) {
      <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
    } @else if (datos(); as d) {
      <div class="aparecer">

        <!-- Las cuatro cifras -->
        <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="calendar-days" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Puntualidad</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.porcentajePuntualidad }}<small [class]="estilos.unidad">%</small></div>
            <div [class]="estilos.banda">
              <div class="tira">
                @for (s of segmentos(); track $index) {
                  <span class="seg" [style.background]="s"></span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">{{ d.diasPuntuales }} de {{ d.diasTrabajados }} días trabajados</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="clock" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Tardanza acumulada</h3>
            </div>
            <div [class]="estilos.cifra">
              {{ duracionCorta(d.minutosTardanzaTotal) }}<small [class]="estilos.unidad">{{ unidadDe(d.minutosTardanzaTotal) }}</small>
            </div>
            <div [class]="estilos.banda + ' mb-4'">
              <div class="relative w-full">
                <div class="barra-tope" role="img"
                     [style.--valor]="porcentajeTardanza() + '%'"
                     [style.--color]="d.minutosTardanzaTotal > d.minutosTopeEquipo ? '#dc2626' : '#16a34a'"
                     [attr.aria-label]="'Tardanza ' + enDuracion(d.minutosTardanzaTotal)
                        + ' de un tope de ' + enDuracion(d.minutosTopeEquipo)"></div>
                <span class="absolute left-1/2 top-[18px] -translate-x-1/2 whitespace-nowrap text-[10px] leading-none text-[#5f6c80] dark:text-slate-400">
                  tope {{ enDuracion(d.minutosTopeEquipo) }}
                </span>
              </div>
            </div>
            <p [class]="estilos.pie">Solo los días con retraso</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="bell" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Pierden bono</h3>
            </div>
            <div [class]="estilos.cifra">
              {{ d.pierdenBono }}<small [class]="estilos.unidad">de {{ d.personas }}</small>
            </div>
            <div [class]="estilos.banda">
              <div class="fila-personas">
                @for (a of d.agentes; track a.idUsuario) {
                  <span [class.mal]="a.pierdeBono"
                        [title]="a.nombreAgente + ': ' + (a.pierdeBono ? 'pierde' : 'mantiene') + ' el bono'">
                    <lucide-angular name="user" [size]="16" class="block"></lucide-angular>
                  </span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">Por tardanza de ingreso</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="pencil" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Días por completar</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.diasIncompletos }}</div>
            <!-- Aquí el color marca lo que FALTA, no lo que está bien. -->
            <div [class]="estilos.banda">
              <div class="flex w-full gap-1.5">
                @for (c of diasPorCompletar(); track c.dia) {
                  <span class="flex h-[26px] flex-1 items-center justify-center rounded-md text-[11px] font-bold"
                        [class]="c.pendientes
                          ? 'bg-[#ea580c] text-white'
                          : 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400'"
                        [title]="c.dia + ': ' + (c.pendientes ? c.pendientes + ' sin completar' : 'completo')">
                    {{ c.dia.slice(0, 2) }}
                  </span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">Sin marcación de almuerzo o salida</p>
          </div>
        </div>

        <!-- La curva y el reparto -->
        <div class="mb-4 grid gap-4 lg:grid-cols-2">
          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Tardanza del equipo por día</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Minutos de retraso en el ingreso, sumados
            </p>
            <div class="lienzo"><canvas #linea></canvas></div>
          </div>

          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Cómo se repartieron los días</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Todos los días del rango del ámbito
            </p>
            <div class="dona-con-leyenda">
              <div class="lienzo lienzo-dona"><canvas #dona></canvas></div>
              <ul class="leyenda-lado">
                @for (l of repartoDias(); track l.texto) {
                  <li>
                    <span class="cuadro" [style.background]="l.color"></span>{{ l.texto }}
                    <strong>{{ l.valor }}</strong>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>

        <!-- El mapa y las horas -->
        <div class="mb-4 grid gap-4 lg:grid-cols-2">
          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">La semana, persona por día</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Cada cuadro es un día; el color, cómo terminó
            </p>

            <div class="overflow-x-auto">
              <div class="mapa" [style.grid-template-columns]="columnasMapa()">
                <span></span>
                @for (dia of diasDelRango(); track dia) {
                  <span class="text-center text-[11px] font-semibold text-[#5f6c80] dark:text-slate-400">{{ dia }}</span>
                }
                <span class="text-right text-[11px] font-semibold text-[#5f6c80] dark:text-slate-400">%</span>

                @for (a of d.agentes; track a.idUsuario) {
                  <span class="nombre" [title]="a.nombreAgente">{{ a.nombreCorto }}</span>
                  @for (c of a.semana; track c.fecha) {
                    <span class="cuadro-dia" [style.background]="COLOR[c.estado]"
                          [title]="a.nombreAgente + ' · ' + c.nombreDia + ': ' + ESTADOS[c.estado].texto.toLowerCase()"></span>
                  }
                  <strong class="text-right text-[12px] tabular-nums">{{ a.porcentajePuntualidad }}%</strong>
                }
              </div>
            </div>

            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1f3f6] pt-2.5 text-[11.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
              @for (l of leyendaMapa(); track l.texto) {
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-[3px]" [style.background]="l.color"></span>{{ l.texto }}
                </span>
              }
            </div>
          </div>

          <div [class]="estilos.tarjeta">
            <h2 [class]="estilos.titulo + ' !mb-0'">Horas trabajadas por persona</h2>
            <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Contra {{ jornadaTexto() }} del rango
            </p>
            <div class="lienzo lienzo-alto"><canvas #horas></canvas></div>
            <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1f3f6] pt-2.5 text-[11.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
              <span class="inline-flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-[3px] bg-[#16a34a]"></span>Cumple la jornada
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="h-2.5 w-2.5 rounded-[3px] bg-[#f59e0b]"></span>Le falta
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="h-2.5 w-[3px] border-l-2 border-dashed border-[#0f172a] dark:border-slate-300"></span>
                Jornada prevista
              </span>
            </div>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">

        <!-- Lo que bloquea el cierre de la semana -->
        <div [class]="estilos.tarjeta">
          <h2 [class]="estilos.titulo + ' !mb-0'">Pendientes de RR.HH.</h2>
          <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Lo que bloquea el cierre de la semana. Cada línea abre la pantalla donde se resuelve.
          </p>

          <!-- Los tres pasos. El aviso es un icono, no un número: un «1» dentro
               de un círculo no se lee como algo que resolver. -->
          <div class="avance">
            @for (p of pasos(); track p.etiqueta; let ultimo = $last) {
              <div [class]="'paso-cierre ' + p.estado"
                   [title]="p.etiqueta + (p.cuantos ? ': ' + p.cuantos + ' por resolver' : '')">
                <span class="marca-paso">
                  <lucide-angular [name]="ICONO_PASO[p.estado]" [size]="13" class="block"></lucide-angular>
                </span>
                <span>{{ p.etiqueta }}</span>
              </div>
              @if (!ultimo) {
                <span class="union"></span>
              }
            }
          </div>

          <ul class="lista-pendientes">
            @for (f of pendientes(); track f.ir) {
              <li [class]="'fila-' + f.tono">
                <lucide-angular [name]="f.icono" [size]="16" class="block shrink-0"></lucide-angular>
                <button type="button" class="ir" (click)="irA.emit(f.ir)" [title]="f.pie">
                  {{ f.titulo }}
                  <span class="pie-fila">{{ f.pie }}</span>
                </button>
                <span class="estado-fila">{{ f.estadoTexto }}</span>
              </li>
            }
          </ul>
        </div>

        <!-- Avisos de pausas -->
        <div [class]="estilos.tarjeta">
          <h2 [class]="estilos.titulo + ' !mb-0'">Avisos a la supervisora</h2>
          <p class="!mb-3 !mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Exceso de break y de almuerzo. No afectan al bono: se gestionan como llamada de atención.
          </p>

          <div class="total-avisos">
            <div [class]="estilos.cifra + ' !text-[22px]'">
              +{{ d.minutosExcesoAlmuerzo + d.minutosExcesoBreak }}<small [class]="estilos.unidad">min {{ enElRango() }}</small>
            </div>
            <div class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              {{ plural(d.avisos.length, 'persona', 'personas') }} · {{ plural(casosAlmuerzo() + casosBreak(), 'aviso', 'avisos') }}
            </div>
          </div>

          <div class="por-pausa">
            <div class="bloque-pausa">
              <span [class]="estilos.icono + ' shrink-0'">
                <lucide-angular name="utensils" [size]="15" class="block"></lucide-angular>
              </span>
              <div>
                <div [class]="estilos.cifra + ' !text-[19px]'">+{{ d.minutosExcesoAlmuerzo }}<small [class]="estilos.unidad">min</small></div>
                <div class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">Almuerzo · {{ plural(casosAlmuerzo(), 'caso', 'casos') }}</div>
              </div>
            </div>
            <div class="bloque-pausa">
              <span [class]="estilos.icono + ' shrink-0'">
                <lucide-angular name="coffee" [size]="15" class="block"></lucide-angular>
              </span>
              <div>
                <div [class]="estilos.cifra + ' !text-[19px]'">+{{ d.minutosExcesoBreak }}<small [class]="estilos.unidad">min</small></div>
                <div class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">Break · {{ plural(casosBreak(), 'caso', 'casos') }}</div>
              </div>
            </div>
          </div>

          <!-- Un chip por persona; el de quien más se pasa, en tono fuerte. -->
          <div class="chips-exceso">
            @for (a of d.avisos; track a.idUsuario) {
              <span class="chip-exceso" [class.fuerte]="a.totalMin >= topeAvisos() * 0.6"
                    [title]="a.nombreAgente + ': almuerzo +' + a.excesoAlmuerzoMin + ', break +' + a.excesoBreakMin">
                {{ a.nombreAgente }} <strong>+{{ a.totalMin }}</strong>
              </span>
            } @empty {
              <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Nadie se pasó de sus pausas en el rango
              </span>
            }
          </div>
        </div>
        </div>
      </div>
    }
  </div>
  `
})
export class AsistenciaDashboardComponent implements AfterViewInit, OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly COLOR = COLOR;
  protected readonly ESTADOS = ESTADOS;
  protected readonly duracionCorta = duracionCorta;
  protected readonly unidadDe = unidadDe;
  protected readonly enDuracion = enDuracion;

  /** El estado de cada paso, dicho con un icono y no con un número. */
  protected readonly ICONO_PASO: Record<string, string> = {
    hecho: 'check', falta: 'alert-triangle', espera: 'lock', listo: 'arrow-right'
  };
  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  /** El botón de la cabecera lo resuelve el módulo: el rango vive allí. */
  readonly semanaAnterior = output<void>();
  readonly volverASemana = output<void>();

  /** Si se está mirando la semana con la que abre la pantalla. */
  readonly esSemanaPorDefecto = computed(() =>
    this.desde() === semanaPorDefecto().desde && this.hasta() === semanaPorDefecto().hasta);
  /** Cada pendiente abre la pantalla donde se resuelve. */
  readonly irA = output<string>();

  readonly datos = signal<DashboardAsistencia | null>(null);
  readonly cargando = signal(false);
  /** Las justificaciones que esperan a alguien, de todo el rango. */
  private readonly sinResolver = signal<Justificacion[]>([]);

  readonly subtitulo = computed(() => {
    const d = this.datos();
    const rango = `${this.corta(this.desde())} – ${this.corta(this.hasta())}`;
    return d ? `${rango} · ${d.personas} personas` : rango;
  });

  private readonly lienzoLinea = viewChild<ElementRef<HTMLCanvasElement>>('linea');
  private readonly lienzoDona = viewChild<ElementRef<HTMLCanvasElement>>('dona');
  private readonly lienzoHoras = viewChild<ElementRef<HTMLCanvasElement>>('horas');

  private graficos: Chart[] = [];
  private listo = false;

  /** Verde con 80 % o más, ámbar desde 60, rojo por debajo. */
  readonly segmentos = computed(() => {
    const pct = this.datos()?.porcentajePuntualidad ?? 0;
    const color = pct >= 80 ? COLOR['PUNTUAL'] : pct >= 60 ? COLOR['TARDE'] : COLOR['FALTA'];
    const apagado = '#f1f3f6';
    return Array.from({ length: 10 }, (_, i) =>
      pct >= (i + 1) * 10 ? color : pct > i * 10 ? color + '73' : apagado);
  });

  /** La escala llega al doble del tope, así el tope cae justo a la mitad. */
  readonly porcentajeTardanza = computed(() => {
    const d = this.datos();
    if (!d || !d.minutosTopeEquipo) {
      return 0;
    }
    return Math.min(100, (d.minutosTardanzaTotal / (d.minutosTopeEquipo * 2)) * 100);
  });

  /** Lo que sale en la dona y en su leyenda: solo lo que tiene días. */
  readonly repartoDias = computed(() => {
    const d = this.datos();
    return [
      { texto: 'Puntual', valor: d?.totalPuntual ?? 0, color: COLOR['PUNTUAL'] },
      { texto: 'Tarde', valor: d?.totalTarde ?? 0, color: COLOR['TARDE'] },
      { texto: 'Falta', valor: d?.totalFalta ?? 0, color: COLOR['FALTA'] },
      { texto: 'Incompleto', valor: d?.totalIncompleto ?? 0, color: COLOR['INCOMPLETO'] }
    ].filter(r => r.valor > 0);
  });

  /**
   * Los cuatro de siempre y, detrás, los que aparezcan en el mapa: un cuadro
   * de un color que no está en la leyenda no se puede leer.
   */
  readonly leyendaMapa = computed(() => {
    const presentes = new Set((this.datos()?.agentes ?? []).flatMap(a => a.semana.map(c => c.estado)));
    const orden: EstadoAsistencia[] = ['PUNTUAL', 'TARDE', 'FALTA', 'INCOMPLETO', 'JUSTIFICADO', 'NO_LABORABLE'];
    return orden
      .filter((e, i) => i < 4 || presentes.has(e))
      .map(e => ({ texto: ESTADOS[e].texto, color: COLOR[e] }));
  });

  /** Los días que de verdad tiene el rango, no los siete de siempre. */
  readonly diasDelRango = computed(() =>
    (this.datos()?.agentes[0]?.semana ?? []).map(c => c.nombreDia.slice(0, 3)));

  readonly columnasMapa = computed(() =>
    `minmax(80px, 1fr) repeat(${this.diasDelRango().length}, minmax(28px, 1fr)) 42px`);

  /** Cuántos días de cada nombre quedaron sin completar. */
  readonly diasPorCompletar = computed(() => {
    const d = this.datos();
    if (!d) {
      return [];
    }
    return d.porDia.map(p => ({ dia: p.nombreDia.slice(0, 3), pendientes: p.incompletos }))
      .slice(0, DIAS.length);
  });

  /** Los días sin marcación completa, como «Karol 18/09». */
  private readonly diasIncompletos = computed(() =>
    (this.datos()?.agentes ?? []).flatMap(a => a.semana
      .filter(c => c.estado === 'INCOMPLETO')
      .map(c => `${this.primerNombre(a.nombreAgente)} ${this.corta(c.fecha)}`)));

  /** Las justificaciones de la gente del ámbito, separadas por quién las tiene. */
  private readonly justificacionesDelAmbito = computed(() => {
    const gente = new Set((this.datos()?.agentes ?? []).map(a => a.idUsuario));
    const suyas = this.sinResolver().filter(j => gente.has(j.idUsuario));
    return {
      // Lo que bloquea a RR.HH. es lo revisado: lo que aún no pasó por la
      // supervisora no le toca todavía.
      porAprobar: suyas.filter(j => j.estado === 'REVISADA'),
      porRevisar: suyas.filter(j => j.estado === 'PENDIENTE')
    };
  });

  /** Los tres pasos del cierre, en orden. */
  readonly pasos = computed(() => {
    const incompletos = this.datos()?.diasIncompletos ?? 0;
    const porAprobar = this.justificacionesDelAmbito().porAprobar.length;
    const listo = !incompletos && !porAprobar;
    return [
      { etiqueta: 'Marcaciones', estado: incompletos ? 'falta' : 'hecho', cuantos: incompletos },
      { etiqueta: 'Justificaciones', estado: porAprobar ? 'falta' : 'hecho', cuantos: porAprobar },
      { etiqueta: 'Cierre', estado: listo ? 'listo' : 'espera', cuantos: 0 }
    ];
  });

  /** La fila entera se tiñe según el caso; el aviso va en palabras al final. */
  readonly pendientes = computed(() => {
    // El número es el mismo de la tarjeta «Días por completar».
    const incompletos = this.datos()?.diasIncompletos ?? 0;
    const { porAprobar, porRevisar } = this.justificacionesDelAmbito();
    return [
      {
        ir: 'asistencia', icono: 'pencil', tono: incompletos ? 'falta' : 'ok',
        titulo: 'Días sin marcación por completar',
        pie: incompletos ? [...new Set(this.diasIncompletos())].join(', ') : 'Nada pendiente',
        estadoTexto: incompletos ? `${incompletos} por completar` : 'Al día'
      },
      {
        ir: 'justificaciones', icono: 'file-text', tono: porAprobar.length ? 'falta' : 'ok',
        titulo: 'Justificaciones por aprobar',
        pie: porAprobar.length
          ? porAprobar.map(j => `${(j.tipo ?? 'justificación').toLowerCase()} de ${this.primerNombre(j.nombreAgente)}`).join(', ')
          : porRevisar.length ? `${porRevisar.length} esperando a la supervisora` : 'Nada pendiente',
        estadoTexto: porAprobar.length ? `${porAprobar.length} por aprobar` : 'Al día'
      },
      {
        ir: 'cierre', icono: 'calendar', tono: 'neutro',
        titulo: 'Cerrar la semana',
        pie: 'Viernes a mediodía',
        estadoTexto: 'Abierta'
      }
    ];
  });

  /**
   * Los casos son días con exceso. Si el backend aún no los manda, cada
   * persona con minutos de más cuenta como un caso.
   */
  readonly casosAlmuerzo = computed(() => (this.datos()?.avisos ?? [])
    .reduce((t, a) => t + (a.casosAlmuerzo ?? (a.excesoAlmuerzoMin > 0 ? 1 : 0)), 0));
  readonly casosBreak = computed(() => (this.datos()?.avisos ?? [])
    .reduce((t, a) => t + (a.casosBreak ?? (a.excesoBreakMin > 0 ? 1 : 0)), 0));

  /** El chip de quien más se pasa va en tono fuerte. */
  readonly topeAvisos = computed(() =>
    Math.max(1, ...(this.datos()?.avisos ?? []).map(a => a.totalMin)));

  /** «en la semana» si el rango es una semana; si no, «en el rango». */
  readonly enElRango = computed(() => {
    const dias = (Date.parse(this.hasta()) - Date.parse(this.desde())) / 86_400_000 + 1;
    return dias <= 7 ? 'en la semana' : 'en el rango';
  });

  readonly jornadaTexto = computed(() => {
    const minutos = this.datos()?.agentes[0]?.minutosJornada ?? 0;
    return minutos ? `las ${duracionCorta(minutos)} ${unidadDe(minutos)}`.trim() : 'la jornada';
  });

  constructor() {
    effect(() => {
      const ambito = this.idSubcartera();
      const desde = this.desde();
      const hasta = this.hasta();
      if (!ambito) {
        this.datos.set(null);
        this.destruir();
        return;
      }
      this.cargar(desde, hasta, ambito);
    });
  }

  ngAfterViewInit(): void {
    this.listo = true;
  }

  ngOnDestroy(): void {
    this.destruir();
  }

  private readonly pintar = effect(() => {
    const d = this.datos();
    const linea = this.lienzoLinea();
    const dona = this.lienzoDona();
    const horas = this.lienzoHoras();
    if (!d || !linea || !dona || !horas) {
      return;
    }
    // Fuera del seguimiento: dibujar no debe volver a disparar el efecto.
    untracked(() => this.dibujar());
  });

  private cargar(desde: string, hasta: string, idSubcartera: number): void {
    this.cargando.set(true);
    this.servicio.dashboard(desde, hasta, idSubcartera).subscribe({
      next: d => {
        this.datos.set(d);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar el dashboard');
        this.cargando.set(false);
      }
    });
    // Lo que espera a la supervisora o a RR.HH.; se filtra luego por la gente
    // del ámbito, que es la que trae el dashboard.
    this.servicio.justificaciones(desde, hasta, ['PENDIENTE', 'REVISADA']).subscribe({
      next: j => this.sinResolver.set(j),
      error: () => this.sinResolver.set([])
    });
  }

  protected plural(n: number, uno: string, varios: string): string {
    return `${n} ${n === 1 ? uno : varios}`;
  }

  private primerNombre(nombre: string | null): string {
    return (nombre ?? '').trim().split(/\s+/)[0] ?? '';
  }

  private destruir(): void {
    this.graficos.forEach(g => g.destroy());
    this.graficos = [];
  }

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  private dibujar(): void {
    const d = this.datos();
    if (!d) {
      return;
    }
    this.destruir();

    const tinta = '#5f6c80';
    const rejilla = 'rgba(100,116,139,.18)';

    // La curva y la dona siguen al artifact: rejilla discontinua sin eje, la
    // letra del módulo y el tooltip con la superficie del tema, no el negro.
    const oscuro = document.documentElement.classList.contains('dark');
    const superficie = oscuro ? '#0f172a' : '#ffffff';
    const texto = oscuro ? '#f1f5f9' : '#0f172a';
    const rejillaSuave = oscuro ? '#1e293b' : '#e6e9ee';
    const fuente = { family: "'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif", size: 11 };
    const tooltip = {
      backgroundColor: superficie, titleColor: texto, bodyColor: texto,
      borderColor: rejillaSuave, borderWidth: 1, padding: 10, cornerRadius: 8,
      displayColors: false, titleFont: fuente, bodyFont: fuente
    };

    // ---- Tardanza por día: área suave, que es una tendencia, no una suma ----
    const linea = this.lienzoLinea()?.nativeElement;
    if (linea) {
      this.graficos.push(new Chart(linea, {
        type: 'line',
        data: {
          labels: d.porDia.map(p => p.nombreDia.slice(0, 3)),
          datasets: [{
            data: d.porDia.map(p => p.minutosTardanza),
            borderColor: CELESTE,
            backgroundColor: (ctx) => {
              const { ctx: c, chartArea: a } = ctx.chart;
              if (!a) {
                return 'transparent';
              }
              const grad = c.createLinearGradient(0, a.top, 0, a.bottom);
              grad.addColorStop(0, 'rgba(2,132,199,.45)');
              grad.addColorStop(1, 'rgba(2,132,199,.02)');
              return grad;
            },
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            // Con uno o dos días no hay curva que dibujar: sin el punto, la
            // tarjeta se ve vacía aunque tenga datos.
            pointRadius: d.porDia.length > 2 ? 0 : 4,
            pointHoverRadius: 5,
            pointBackgroundColor: CELESTE,
            pointHoverBackgroundColor: CELESTE
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: { ...tooltip, callbacks: { label: c => `${c.parsed.y} minutos de tardanza` } }
          },
          scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: tinta, font: fuente } },
            y: {
              beginAtZero: true,
              grid: { color: rejillaSuave },
              border: { display: false },
              ticks: { color: tinta, font: fuente, precision: 0, maxTicksLimit: 4, padding: 6 }
            }
          }
        }
      }));
    }

    // ---- Reparto de los días: dona con el total al centro ----
    const dona = this.lienzoDona()?.nativeElement;
    if (dona) {
      const reparto = this.repartoDias();
      const total = reparto.reduce((t, r) => t + r.valor, 0);
      this.graficos.push(new Chart(dona, {
        type: 'doughnut',
        data: {
          labels: reparto.map(r => r.texto),
          datasets: [{
            data: reparto.map(r => r.valor),
            backgroundColor: reparto.map(r => r.color),
            // El anillo de la superficie separa los tramos.
            borderColor: superficie,
            borderWidth: 3,
            hoverOffset: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltip, displayColors: true,
              callbacks: { label: c => ` ${c.parsed} días · ${Math.round(c.parsed / (total || 1) * 100)}%` }
            }
          }
        },
        plugins: [{
          // El total al centro: es la cifra que se busca al mirar una dona.
          id: 'totalAlCentro',
          afterDraw(chart) {
            const { ctx, chartArea } = chart;
            if (!chartArea) {
              return;
            }
            const x = (chartArea.left + chartArea.right) / 2;
            const y = (chartArea.top + chartArea.bottom) / 2;
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = texto;
            ctx.font = "800 22px 'Plus Jakarta Sans', sans-serif";
            ctx.fillText(String(total), x, y - 6);
            ctx.font = "600 11px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = tinta;
            ctx.fillText('días', x, y + 13);
            ctx.restore();
          }
        }]
      }));
    }

    // ---- Horas por persona: barras con la jornada prevista marcada ----
    const horas = this.lienzoHoras()?.nativeElement;
    if (horas) {
      const jornada = d.agentes[0]?.minutosJornada ?? 0;
      this.graficos.push(new Chart(horas, {
        type: 'bar',
        data: {
          labels: d.agentes.map(a => a.nombreCorto),
          datasets: [{
            data: d.agentes.map(a => a.minutosTrabajados),
            backgroundColor: d.agentes.map(a =>
              a.minutosJornada && a.minutosTrabajados >= a.minutosJornada
                ? COLOR['PUNTUAL'] : COLOR['TARDE']),
            borderRadius: 999,
            borderSkipped: 'start',
            barThickness: 14
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: c => {
                  const a = d.agentes[c.dataIndex];
                  return `${a.horasTrabajadas} de ${a.jornada ?? '—'}`;
                }
              }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: { color: rejilla },
              ticks: { color: tinta, callback: v => `${Math.round(Number(v) / 60)} h` }
            },
            y: { grid: { display: false }, ticks: { color: tinta } }
          }
        },
        plugins: [{
          // La jornada prevista, como raya: el objetivo se ve sin leer números.
          id: 'jornadaPrevista',
          afterDatasetsDraw(chart) {
            if (!jornada) {
              return;
            }
            const { ctx, chartArea, scales } = chart;
            const x = scales['x'].getPixelForValue(jornada);
            ctx.save();
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x, chartArea.top);
            ctx.lineTo(x, chartArea.bottom);
            ctx.stroke();
            ctx.restore();
          }
        }]
      }));
    }
  }
}
