import { Component, ElementRef, HostListener, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { BloqueEquipoPlan, BloquePlan, DeudaEquipoPlan, DeudaPlan, DiaPlan, EstadoSemanaPlan, PlanEquipoPedido, PlanSemana,
         PropuestaEquipoPlan } from './asistencia.models';
import { ESTILOS, hoy, lunesDe, sumarDias } from './asistencia.estilos';

/** El calendario va de 08:00 a 20:00: nadie entra antes ni sale después. */
const CAL = { desde: 8 * 60, hasta: 20 * 60, alto: 28 };
const MARGEN_ARRIBA = 14;
const MARGEN_ABAJO = 36;
/** Cada cuadro deja un espacio con el siguiente; es visual, no representa tiempo. */
const HUECO = 3;
/** Una pausa corta se dibuja con un alto mínimo para que se lean su nombre y su hora. */
const MIN_PAUSA = 20;
const CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

const ESTADO: Record<EstadoSemanaPlan, { texto: string; clase: string }> = {
  CERRADA: { texto: 'Cerrada', clase: 'p-neutro' },
  POR_CERRAR: { texto: 'Por cerrar', clase: 'p-tarde' },
  EN_CURSO: { texto: 'En curso', clase: 'p-ok' },
  PROXIMA: { texto: 'Próxima', clase: 'p-neutro' },
  PLANIFICADA: { texto: 'Planificada', clase: 'p-neutro' }
};

/**
 * Un bloque tal como se ve y se edita: el del servidor o el que se movió aquí.
 * Cada persona tiene a lo más uno por día; lo del equipo es uno por asesor y se
 * dibuja en un solo cuadro.
 */
interface Bloque {
  /** `idUsuario-fecha`; en el cuadro del equipo, `plan|fecha`. */
  clave: string;
  /** De qué plan es: `p:idUsuario` (el de la persona) o `e:mes` (el del equipo por días sin asignación). */
  plan: string;
  idUsuario: number;
  nombre: string;
  fecha: string;
  minutos: number;
  /** Salida fija de ese día, en minutos. */
  salida: number;
  confirmado: boolean;
  hecho: number | null;
  /** El mes de la deuda del equipo que paga; null si es del plan de la persona. */
  deuda: string | null;
  /** Del plan del equipo: el mismo para todos. */
  equipo: boolean;
  /** En el cuadro del equipo: el bloque de cada asesor. */
  gente?: Bloque[];
}

const planPersona = (idUsuario: number): string => `p:${idUsuario}`;
const planEquipo = (mes: string): string => `e:${mes}`;

/** El gesto en curso sobre un bloque: moverlo de día o estirarlo. */
interface Gesto {
  bloque: Bloque;
  modo: 'mover' | 'estirar';
  x0: number;
  y0: number;
  movido: boolean;
  minutos: number;
  destino: string | null;
  dx: number;
}

const aMin = (h: string | null | undefined): number => (h ? Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5)) : 0);
const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const dm = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
const indiceDia = (iso: string): number => (new Date(iso + 'T00:00:00').getDay() + 6) % 7;

/**
 * Horario: la semana de una subcartera como calendario, con las recuperaciones
 * encima del horario fijo.
 *
 * El horario fijo no se edita: es la base de las 48 horas. Lo que cambia el
 * horario de alguien son sus recuperaciones, que aquí se proponen, se mueven de
 * día, se estiran, se confirman o se descartan. Lo propuesto no se guarda hasta
 * «Confirmar»; entonces el asesor lo ve en Mi Asistencia.
 *
 * Una semana cerrada o por cerrar se ve pero no se toca. Los días que ya
 * pasaron quedan apagados.
 */
@Component({
  selector: 'app-asistencia-horario',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    .pastilla { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700 }
    .p-ok { background: #e8f5ec; color: #166534 }
    .p-tarde { background: #fef6e0; color: #92400e }
    .p-neutro { background: #f1f3f6; color: #5f6c80 }

    .cal-layout { display: grid; grid-template-columns: minmax(0, 1fr) 290px; gap: 16px; align-items: start }
    @media (max-width: 1100px) { .cal-layout { grid-template-columns: minmax(0, 1fr) } }
    .cal-marco { background: #fff; border: 1px solid #e6e9ee; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04); overflow-x: auto }
    .cal { min-width: 700px; display: grid; grid-template-columns: 58px repeat(var(--dias), minmax(0, 1fr)) }
    .cal-esquina, .cal-cab { border-bottom: 1px solid #e6e9ee }
    .cal-cab { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 6px 9px; font-size: 12px; font-weight: 600; color: #5f6c80 }
    .cal-cab .num { display: inline-grid; place-items: center; min-width: 24px; height: 24px; padding: 0 5px; border-radius: 7px; font-size: 12.5px; font-weight: 800; color: #0f172a; font-variant-numeric: tabular-nums }
    .cal-cab.hoy .num { background: #e5484d; color: #fff }
    .cal-cab.pasado, .cal-cab.pasado .num { color: #8491a3 }
    .cal-todo { grid-column: 2 / -1; display: grid; grid-template-columns: repeat(var(--dias), minmax(0, 1fr)); grid-auto-flow: row dense; align-content: start; gap: 4px 0; padding: 6px 0 0 }
    .chip-dia { display: flex; flex-direction: column; gap: 1px; margin: 0 4px; padding: 6px 9px; border-radius: 8px; min-width: 0; font-size: 11.5px; line-height: 1.3; background: #e0f2fe; color: #075985; border-left: 3px solid #0284c7 }
    .chip-dia strong, .chip-dia span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .chip-dia strong { font-weight: 700 }
    .chip-dia span { font-weight: 500 }
    .chip-dia.por-aprobar { background: transparent; border: 1.5px dashed #0284c7 }
    .chip-dia.feriado { background: #fdecec; color: #b91c1c; border-left-color: #dc2626 }
    .cal-horas { position: relative }
    .cal-hora { position: absolute; right: 8px; transform: translateY(-50%); font-size: 10.5px; color: #8491a3; font-variant-numeric: tabular-nums }
    .cal-ahora-etq { position: absolute; right: 3px; transform: translateY(-50%); z-index: 2; padding: 1px 5px; border-radius: 5px; background: #e5484d; color: #fff; font-size: 10px; font-weight: 700; font-variant-numeric: tabular-nums }
    .cal-col { position: relative }
    .cal-col::before { content: ""; position: absolute; left: 0; right: 0; pointer-events: none; top: 14px; bottom: 35px; background-image: linear-gradient(#f1f3f6 1px, transparent 1px); background-size: 100% 56px }
    .cal-col.pasado .etq, .cal-col.pasado .bloque > * { opacity: .55 }
    .cal-col.destino-ok { background-color: color-mix(in srgb, #2563eb 9%, #fff) }
    .cal-col.destino-no { background-color: color-mix(in srgb, #dc2626 9%, #fff) }
    .cal-base, .cal-pausa { position: absolute; left: 4px; right: 4px; border-radius: 8px }
    .cal-base { background: color-mix(in srgb, #64748b 8%, #fff); border: 1px solid color-mix(in srgb, #64748b 26%, #fff) }
    .cal-pausa.almuerzo { background: color-mix(in srgb, #10b981 15%, #fff); border: 1px solid color-mix(in srgb, #10b981 45%, #fff) }
    .cal-pausa.break { background: color-mix(in srgb, #8b5cf6 15%, #fff); border: 1px solid color-mix(in srgb, #8b5cf6 45%, #fff) }
    .etq { position: absolute; top: 6px; left: 10px; right: 8px; font-size: 11px; font-weight: 600; color: #5f6c80; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .cal-pausa.almuerzo .etq { color: color-mix(in srgb, #059669 70%, #0f172a) }
    .cal-pausa.break .etq { color: color-mix(in srgb, #7c3aed 70%, #0f172a) }
    .cal-pausa .etq strong { font-weight: 700 }
    .cal-pausa .etq span { display: block; font-weight: 500 }
    .cal-pausa.fina .etq { top: 50%; transform: translateY(-50%); font-weight: 500 }
    .cal-pausa.fina .etq span { display: inline }
    .cal-ahora { position: absolute; left: 0; right: 0; border-top: 2px solid #e5484d; z-index: 4; pointer-events: none }
    .cal-ahora::before { content: ""; position: absolute; left: -5px; top: -6px; width: 10px; height: 10px; border-radius: 999px; background: #e5484d }
    .bloque { position: absolute; z-index: 3; overflow: hidden; padding: 6px 9px 10px; border-radius: 8px; border-left: 3px solid #f59e0b; background: #fef6e0; color: #92400e; font-size: 11px; line-height: 1.35; cursor: grab; user-select: none; touch-action: none; box-shadow: 0 1px 2px rgba(15,23,42,.1) }
    .bloque strong { display: block; margin-bottom: 1px; font-size: 11.5px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .bloque.compacto { display: flex; align-items: center; gap: 6px; padding: 0 9px; white-space: nowrap }
    .bloque.compacto strong, .bloque.compacto .rango, .bloque.compacto .real { display: inline; margin: 0; min-width: 0 }
    .bloque.compacto strong { flex: 0 1 auto; overflow: hidden; text-overflow: ellipsis }
    .bloque.compacto .asa::after { display: none }
    .bloque .rango { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums }
    .bloque .real { display: block; font-style: normal; font-weight: 700 }
    .bloque .real.ok { color: #166534 }
    .bloque .real.mal { color: #b91c1c }
    .bloque.propuesto { background: color-mix(in srgb, #fef6e0 50%, #fff); border: 1.5px dashed #f59e0b }
    .bloque.solo-lectura { cursor: default; box-shadow: none }
    .bloque:focus-visible { outline: 2px solid #2563eb; outline-offset: 1px }
    .bloque .asa { position: absolute; left: 0; right: 0; bottom: 0; height: 9px; cursor: ns-resize }
    .bloque .asa::after { content: ""; position: absolute; left: 50%; bottom: 3px; width: 18px; height: 3px; margin-left: -9px; border-radius: 2px; background: currentColor; opacity: .4 }
    .bloque.arrastrando { z-index: 6; opacity: .92; cursor: grabbing; box-shadow: 0 10px 24px rgba(15,23,42,.2) }

    .cal-lado { display: flex; flex-direction: column; gap: 20px; min-width: 0 }
    .leyenda { display: flex; flex-direction: column; gap: 9px; padding: 4px 2px 0 }
    .leyenda span { display: flex; align-items: center; gap: 9px; font-size: 12.5px; color: #334155 }
    .leyenda i { flex: none; width: 14px; height: 14px; border-radius: 4px; border: 1.5px solid #e6e9ee }
    .leyenda i.base { background: color-mix(in srgb, #64748b 8%, #fff); border-color: color-mix(in srgb, #64748b 45%, #fff) }
    .leyenda i.alm { background: color-mix(in srgb, #10b981 15%, #fff); border-color: color-mix(in srgb, #10b981 45%, #fff) }
    .leyenda i.brk { background: color-mix(in srgb, #8b5cf6 15%, #fff); border-color: color-mix(in srgb, #8b5cf6 45%, #fff) }
    .leyenda i.rec { background: #fef6e0; border-color: #f59e0b }
    .leyenda i.rec-sin { background: transparent; border: 1.5px dashed #f59e0b }
    .leyenda i.sol { background: #e0f2fe; border-color: #0284c7 }
    .leyenda i.sol-sin { background: transparent; border: 1.5px dashed #0284c7 }
    .leyenda i.fer { background: #fdecec; border-color: #dc2626 }

    .deuda { display: flex; flex-direction: column; gap: 16px; padding: 18px 14px; background: #fff; border: 1px solid #e6e9ee; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04) }
    .deuda-titulo { display: flex; flex-direction: column; gap: 5px }
    .deuda-cab { display: flex; align-items: center; justify-content: space-between; gap: 8px }
    .deuda-cab strong { font-size: 13.5px }
    .deuda .secundario { font-size: 11.5px; color: #5f6c80 }
    .barra { display: flex; height: 7px; border-radius: 999px; background: #f1f3f6; overflow: hidden }
    .barra i { display: block; height: 100% }
    .barra i.rec { background: #16a34a }
    .barra i.conf { background: #f59e0b }
    .barra i.sin { background: repeating-linear-gradient(135deg, #f59e0b 0 3px, color-mix(in srgb, #f59e0b 35%, #fff) 3px 6px) }
    .bloques-deuda { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 11px }
    .bloque-deuda { display: grid; grid-template-columns: 9px auto 1fr auto; align-items: center; gap: 8px; font-size: 12px; color: #334155 !important; font-variant-numeric: tabular-nums }
    .bloque-deuda .marca { width: 9px; height: 9px; border-radius: 3px; background: #f59e0b }
    .bloque-deuda.sin-confirmar .marca { background: transparent; border: 1.5px dashed #f59e0b }
    .bloque-deuda strong { font-weight: 700; color: #0f172a !important }
    .bloque-deuda .estado { font-size: 11px; font-weight: 600; color: #92400e }
    .nota-deuda { margin: 0; font-size: 11.5px; line-height: 1.45; color: #b91c1c }
    .deuda-botones { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px }
    .bloque.equipo strong svg { display: inline-block; vertical-align: -1px; margin-right: 4px }
    .aparte { display: flex; flex-direction: column; gap: 10px; padding-top: 14px; border-top: 1px solid #f1f3f6 }
    .bloque-deuda .marca.pendiente { background: transparent; border: 1.5px solid #f59e0b; border-radius: 999px }
    .bloque-deuda .boton-fila { height: 26px; padding: 0 10px; font-size: 11.5px }
    .nota-deuda.info { color: #5f6c80 }

    :host-context(.dark) .cal-marco, :host-context(.dark) .deuda { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .cal-esquina, :host-context(.dark) .cal-cab { border-color: #1e293b }
    :host-context(.dark) .cal-cab .num, :host-context(.dark) .bloque-deuda strong { color: #f1f5f9 !important }
    :host-context(.dark) .cal-col::before { background-image: linear-gradient(#1e293b 1px, transparent 1px) }
    :host-context(.dark) .cal-base { background: color-mix(in srgb, #64748b 12%, #0f172a); border-color: color-mix(in srgb, #64748b 35%, #0f172a) }
    :host-context(.dark) .cal-pausa.almuerzo { background: color-mix(in srgb, #10b981 15%, #0f172a); border-color: color-mix(in srgb, #10b981 45%, #0f172a) }
    :host-context(.dark) .cal-pausa.break { background: color-mix(in srgb, #8b5cf6 15%, #0f172a); border-color: color-mix(in srgb, #8b5cf6 45%, #0f172a) }
    :host-context(.dark) .etq, :host-context(.dark) .deuda .secundario, :host-context(.dark) .leyenda span, :host-context(.dark) .bloque-deuda { color: #94a3b8 !important }
    :host-context(.dark) .bloque { background: #451a03; color: #fcd34d }
    :host-context(.dark) .bloque.propuesto { background: color-mix(in srgb, #451a03 50%, #0f172a) }
    :host-context(.dark) .chip-dia { background: #082f49; color: #7dd3fc }
    :host-context(.dark) .chip-dia.feriado { background: #450a0a; color: #fca5a5 }
    :host-context(.dark) .p-ok { background: #052e16; color: #86efac }
    :host-context(.dark) .p-tarde { background: #451a03; color: #fcd34d }
    :host-context(.dark) .p-neutro { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .barra { background: #1e293b }
    :host-context(.dark) .aparte { border-color: #1e293b }
    :host-context(.dark) .nota-deuda.info { color: #94a3b8 }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Horario</h1>
        <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
      </div>
    </div>

    <div class="px-7 pb-12 pt-5">
    <div class="aparecer">
      @if (!idSubcartera()) {
        <div [class]="estilos.vacio">
          <lucide-angular name="calendar-days" [size]="26" class="mx-auto mb-1 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
          <strong class="block text-[13.5px]">Elige una subcartera</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">El horario de la semana es el de los asesores de una subcartera.</span>
        </div>
      } @else {
        <!-- La semana que se mira y en qué punto está. -->
        <div class="mb-3 flex flex-wrap items-center gap-x-3.5 gap-y-2.5">
          <div class="flex items-center gap-2">
            <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(-7)" aria-label="Semana anterior">
              <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
            </button>
            <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(7)" aria-label="Semana siguiente">
              <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
            </button>
            <strong class="text-[14.5px]">{{ tituloMes() }}</strong>
            <button type="button" [class]="estilos.botonChico" (click)="lunes.set(lunesHoy)">Hoy</button>
          </div>
          @if (plan(); as p) {
            <span class="pastilla" [class]="ESTADO[p.estadoSemana].clase">{{ ESTADO[p.estadoSemana].texto }}</span>
            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              Semana del {{ dm(p.lunes) }} al {{ dm(finSemana()) }}{{ editable() ? '' : ' · solo lectura' }}
            </span>
          }
        </div>

        <div class="cal-layout">
          <div class="cal-marco" #marco
               (pointerdown)="empezar($event)" (pointermove)="mover($event)" (pointerup)="soltar()" (pointercancel)="cancelarGesto()"
               (keydown)="teclado($event)">
            @if (plan(); as p) {
              <div class="cal" [style.--dias]="columnas().length">
                <div class="cal-esquina"></div>
                @for (c of columnas(); track c.fecha) {
                  <div class="cal-cab" [class.hoy]="c.fecha === hoyIso" [class.pasado]="c.fecha < hoyIso">
                    {{ c.corto }}<span class="num">{{ c.numero }}</span>
                  </div>
                }
                @if (chips().length) {
                  <div class="cal-todo-etq"></div>
                  <div class="cal-todo">
                    @for (ch of chips(); track $index) {
                      <span class="chip-dia" [class.por-aprobar]="ch.porAprobar" [class.feriado]="ch.feriado"
                            [style.grid-column]="ch.columna" [title]="ch.titulo">
                        <strong>{{ ch.tipo }}</strong><span>{{ ch.quien }}</span>
                      </span>
                    }
                  </div>
                }
                <div class="cal-horas" [style.height.px]="altoTotal">
                  @for (h of horas; track h) {
                    <span class="cal-hora" [style.top.px]="y(h)">{{ enHoras(h) }}</span>
                  }
                  @if (hoyEnSemana()) {
                    <span class="cal-ahora-etq" [style.top.px]="y(ahora)">{{ enHoras(ahora) }}</span>
                  }
                </div>
                @for (c of columnas(); track c.fecha) {
                  <div class="cal-col" [class.pasado]="!editable() || c.fecha < hoyIso"
                       [class.destino-ok]="gesto()?.destino === c.fecha && destinoValido()"
                       [class.destino-no]="gesto()?.destino === c.fecha && !destinoValido()"
                       [attr.data-fecha]="c.fecha" [style.height.px]="altoTotal">
                    @for (cj of c.cajas; track $index) {
                      <div [class]="cj.clase" [style.top.px]="cj.arriba + HUECO / 2" [style.height.px]="cj.alto" [title]="cj.titulo">
                        @if (cj.alto >= 16) {
                          <span class="etq">
                            @if (cj.pausa) {
                              <strong>{{ cj.nombre }}</strong>@if (cj.holgada) {<span>{{ cj.etq }}</span>} @else {<span> {{ cj.etq }}</span>}
                            } @else { {{ cj.etq }} }
                          </span>
                        }
                      </div>
                    }
                    @for (b of bloquesDelDia(c.fecha); track b.clave; let i = $index; let n = $count) {
                      <div class="bloque" [class.equipo]="!!b.gente" [class.compacto]="b.minutos < 60" [class.propuesto]="!b.confirmado"
                           [class.solo-lectura]="soloLectura(b)" [class.arrastrando]="gesto()?.bloque?.clave === b.clave && gesto()?.movido"
                           [attr.data-bloque]="b.clave" [attr.tabindex]="soloLectura(b) ? null : 0"
                           [attr.role]="soloLectura(b) ? 'note' : 'button'"
                           [title]="quienDe(b) + ' · ' + rango(b) + ' · +' + duracion(b.minutos) + (b.confirmado ? '' : ' · por confirmar')"
                           [attr.aria-label]="'Recuperación ' + (b.gente ? 'del equipo (' + b.gente.length + (b.gente.length === 1 ? ' asesor)' : ' asesores)') : 'de ' + b.nombre) + ' el ' + dm(b.fecha) + ', de ' + rango(b) + (b.confirmado ? '' : ', por confirmar')"
                           [style.top.px]="y(b.salida) + HUECO / 2"
                           [style.height.px]="altoBloque(b) - HUECO"
                           [style.left]="'calc(' + (100 / n * i).toFixed(2) + '% + 3px)'"
                           [style.width]="'calc(' + (100 / n).toFixed(2) + '% - 6px)'"
                           [style.transform]="gesto()?.bloque?.clave === b.clave && gesto()?.modo === 'mover' ? 'translateX(' + gesto()!.dx + 'px)' : null">
                        @if (b.minutos < 60) {
                          <strong>@if (b.gente) {<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}{{ nombreCorto(b.nombre) }}</strong>
                          @if (b.hecho !== null) {
                            <em class="real" [class.ok]="b.hecho >= b.minutos" [class.mal]="b.hecho < b.minutos">{{ textoHecho(b) }}</em>
                          } @else {
                            <span class="rango">+{{ duracion(minutosVisibles(b)) }}</span>
                          }
                        } @else {
                          <strong>@if (b.gente) {<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>}{{ nombreCorto(b.nombre) }}</strong>
                          <span class="rango">{{ rango(b) }} · +{{ duracion(minutosVisibles(b)) }}</span>
                          @if (b.hecho !== null) {
                            <em class="real" [class.ok]="b.hecho >= b.minutos" [class.mal]="b.hecho < b.minutos">{{ textoHecho(b) }}</em>
                          }
                        }
                        @if (!soloLectura(b)) { <span class="asa" data-asa aria-hidden="true"></span> }
                      </div>
                    }
                    @if (c.fecha === hoyIso) { <div class="cal-ahora" [style.top.px]="y(ahora)"></div> }
                  </div>
                }
              </div>
            } @else if (cargando()) {
              <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
            }
          </div>

          <div class="cal-lado">
            <div class="leyenda" role="list" aria-label="Leyenda">
              <span role="listitem"><i class="base"></i>Horario base</span>
              <span role="listitem"><i class="alm"></i>Almuerzo</span>
              <span role="listitem"><i class="brk"></i>Break</span>
              <span role="listitem"><i class="rec"></i>Recuperación confirmada</span>
              <span role="listitem"><i class="rec-sin"></i>Recuperación por confirmar</span>
              <span role="listitem"><i class="sol"></i>Permiso, descanso o cita</span>
              <span role="listitem"><i class="sol-sin"></i>Solicitud por aprobar</span>
              <span role="listitem"><i class="fer"></i>Feriado</span>
            </div>

            <aside class="flex flex-col gap-3 !bg-transparent" aria-label="Horas por recuperar">
              <h2 class="!m-0 text-[15px] font-extrabold">Horas por recuperar</h2>
              <!-- Lo de los días sin asignación: una tarjeta por mes, con el plan del equipo y lo que alguien deba aparte. -->
              @for (e of equipos(); track e.deuda.clave) {
                <div class="deuda">
                  <div class="deuda-titulo">
                    <div class="deuda-cab">
                      <strong>{{ e.deuda.origen }}</strong>
                      <span class="pastilla" [class]="e.pastilla[0]">{{ e.pastilla[1] }}</span>
                    </div>
                    <div class="secundario">{{ subcartera() }} · {{ e.deuda.gente.length }} {{ e.deuda.gente.length === 1 ? 'asesor' : 'asesores' }} · debe {{ e.debe }} · <span class="whitespace-nowrap">vence el {{ dm(e.deuda.vence) }}</span></div>
                  </div>
                  <div class="barra" role="img"
                       [attr.aria-label]="'Del equipo: recuperado ' + e.pctRec.toFixed(0) + ' %, confirmado ' + e.pctConf.toFixed(0) + ' % y por confirmar ' + e.pctSin.toFixed(0) + ' %'">
                    <i class="rec" [style.width.%]="e.pctRec"></i>
                    <i class="conf" [style.width.%]="e.pctConf"></i>
                    <i class="sin" [style.width.%]="e.pctSin"></i>
                  </div>
                  @if (e.tramos.length) {
                    <ul class="bloques-deuda">
                      @for (t of e.tramos; track t.desde) {
                        <li class="bloque-deuda" [class.sin-confirmar]="!t.confirmado">
                          <i class="marca" aria-hidden="true"></i>
                          <strong>{{ t.cuando }}</strong>
                          <span>{{ t.cuanto }}</span>
                          <span class="estado">{{ t.confirmado ? '' : 'por confirmar' }}</span>
                        </li>
                      }
                    </ul>
                  }
                  @if (e.aparte.length) {
                    <div class="aparte">
                      <span [class]="estilos.etiqueta">Por persona</span>
                      <ul class="bloques-deuda">
                        @for (a of e.aparte; track a.idUsuario) {
                          <li class="bloque-deuda" [class.sin-confirmar]="a.sinConfirmar" [attr.title]="a.porque || null">
                            <i class="marca" [class.pendiente]="!a.conBloques" aria-hidden="true"></i>
                            <strong>{{ nombreCorto(a.nombre) }}</strong>
                            <span>{{ a.texto }}</span>
                            @if (a.extra > 0 && !a.sinConfirmar) {
                              <button type="button" [class]="estilos.botonChico + ' boton-fila'" (click)="proponerAparte(e.deuda, a.idUsuario, a.nombre)"
                                      [disabled]="guardando()">Proponer</button>
                            } @else {
                              <span class="estado">{{ a.sinConfirmar ? 'por confirmar' : '' }}</span>
                            }
                          </li>
                        }
                      </ul>
                    </div>
                  }
                  @if (e.nota) {
                    <p class="nota-deuda info">{{ e.nota }}</p>
                  }
                  @if (e.tarde) {
                    <p class="nota-deuda">{{ e.tarde }} {{ e.tarde === 1 ? 'día cae' : 'días caen' }} después del vencimiento.</p>
                  }
                  @if (e.sinConfirmar || e.comun) {
                    <div class="deuda-botones">
                      <button type="button" [class]="estilos.botonSecundario" (click)="descartarPlan(e.plan, 'del equipo')"
                              [disabled]="!e.sinConfirmar || guardando()" [title]="e.sinConfirmar ? '' : 'No hay nada sin confirmar'">
                        <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
                        Descartar
                      </button>
                      @if (e.sinConfirmar) {
                        <button type="button" [class]="estilos.botonPrimario" (click)="confirmarEquipo(e.deuda)" [disabled]="guardando()">
                          <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                          Confirmar
                        </button>
                      } @else {
                        <button type="button" [class]="estilos.botonPrimario" (click)="proponerEquipo(e.deuda)" [disabled]="guardando()">
                          <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18M12 13v5M9.5 15.5h5"/></svg>
                          Proponer {{ duracion(e.comun) }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
              @for (d of deudas(); track d.idUsuario) {
                <div class="deuda">
                  <div class="deuda-titulo">
                    <div class="deuda-cab">
                      <strong>{{ d.nombre }}</strong>
                      <span class="pastilla" [class]="d.falta ? 'p-tarde' : 'p-ok'">{{ d.falta ? 'Falta ' + duracion(d.falta) : 'Cubierto' }}</span>
                    </div>
                    <div class="secundario">{{ d.origen }} · debe {{ duracion(d.total) }} · <span class="whitespace-nowrap">vence el {{ dm(d.vence) }}</span></div>
                  </div>
                  <div class="barra" role="img"
                       [attr.aria-label]="'Recuperado ' + duracion(d.recuperado) + ', confirmado ' + duracion(d.confirmado) + ' y por confirmar ' + duracion(d.porConfirmar) + ' de ' + duracion(d.total)">
                    <i class="rec" [style.width.%]="pct(d.recuperado, d.total)"></i>
                    <i class="conf" [style.width.%]="pct(d.confirmadoVisible, d.total)"></i>
                    <i class="sin" [style.width.%]="pct(d.porConfirmarVisible, d.total)"></i>
                  </div>
                  @if (d.bloques.length) {
                    <ul class="bloques-deuda">
                      @for (b of d.bloques; track b.clave) {
                        <li class="bloque-deuda" [class.sin-confirmar]="!b.confirmado">
                          <i class="marca" aria-hidden="true"></i>
                          <strong>{{ corto(b.fecha) }} {{ dm(b.fecha) }}</strong>
                          <span>{{ enHoras(b.salida) }} – {{ enHoras(b.salida + b.minutos) }}</span>
                          <span class="estado">{{ b.confirmado ? '' : 'por confirmar' }}</span>
                        </li>
                      }
                    </ul>
                  }
                  @if (d.tarde) {
                    <p class="nota-deuda">{{ d.tarde }} {{ d.tarde === 1 ? 'bloque cae' : 'bloques caen' }} después del vencimiento.</p>
                  }
                  @if (d.sinConfirmar || d.falta) {
                    <div class="deuda-botones">
                      <button type="button" [class]="estilos.botonSecundario" (click)="descartarPlan(planPersona(d.idUsuario), 'de ' + nombreCorto(d.nombre))"
                              [disabled]="!d.sinConfirmar || guardando()" [title]="d.sinConfirmar ? '' : 'No hay nada sin confirmar'">
                        <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
                        Descartar
                      </button>
                      @if (d.sinConfirmar) {
                        <button type="button" [class]="estilos.botonPrimario" (click)="confirmar(d.idUsuario, d.nombre)" [disabled]="guardando()">
                          <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                          Confirmar
                        </button>
                      } @else {
                        <button type="button" [class]="estilos.botonPrimario" (click)="proponer(d.idUsuario, d.nombre)" [disabled]="guardando()">
                          <svg class="shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18M12 13v5M9.5 15.5h5"/></svg>
                          Proponer {{ duracion(d.falta) }}
                        </button>
                      }
                    </div>
                  }
                </div>
              }
              @if (!deudas().length && !equipos().length) {
                <div class="deuda">
                  <div class="deuda-titulo">
                    <strong class="text-[13.5px]">Nadie debe horas</strong>
                    <span class="secundario">En esta subcartera no hay recuperaciones pendientes.</span>
                  </div>
                </div>
              }
            </aside>
          </div>
        </div>
      }
    </div>
    </div>

    <!-- El bloque exacto, en horas y minutos. -->
    @if (editado(); as b) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarForm()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,420px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-bloque">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-bloque" class="!m-0 text-[15px] font-extrabold">{{ b.gente ? 'Editar recuperación del equipo' : 'Editar recuperación' }}</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ b.gente ? origenDe(b.deuda) : b.nombre }} · {{ dm(b.fecha) }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarForm()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="b-persona">Persona</label>
              <select id="b-persona" [class]="estilos.campo" disabled>
                <option>{{ b.gente ? 'Equipo · ' + grupoDe(b).length + (grupoDe(b).length === 1 ? ' asesor' : ' asesores') : b.nombre }}</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="b-fecha">Día</label>
              <input id="b-fecha" type="date" [class]="estilos.campo" [min]="hoyIso"
                     [ngModel]="formFecha()" (ngModelChange)="formFecha.set($event); revisarForm()">
            </div>
            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="b-horas">Horas</label>
                <input id="b-horas" type="number" min="0" max="11" step="1" [class]="estilos.campo"
                       [ngModel]="formHoras()" (ngModelChange)="formHoras.set(+$event || 0); revisarForm()">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="b-minutos">Minutos</label>
                <input id="b-minutos" type="number" min="0" max="55" step="5" [class]="estilos.campo"
                       [ngModel]="formMinutos()" (ngModelChange)="formMinutos.set(+$event || 0); revisarForm()">
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span [class]="estilos.etiqueta">Resultado</span>
              <p class="!m-0 text-[13px]">{{ resultadoForm() }}</p>
            </div>
            @if (errorForm()) {
              <p class="!m-0 text-[12px] text-[#b91c1c]">{{ errorForm() }}</p>
            }
          </div>
          <footer class="flex gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario + ' mr-auto'" (click)="quitar(b)" [disabled]="guardando()">
              <lucide-angular name="trash-2" [size]="14" class="block"></lucide-angular>
              Quitar
            </button>
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarForm()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarForm(b)" [disabled]="!!errorForm() || validando()">Guardar</button>
          </footer>
        </div>
      </div>
    }
  `
})
export class AsistenciaHorarioComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADO = ESTADO;
  protected readonly HUECO = HUECO;
  protected readonly enHoras = enHoras;
  protected readonly dm = dm;
  protected readonly planPersona = planPersona;

  readonly idSubcartera = input<number | null>(null);
  /** El nombre de la subcartera, para el subtítulo. */
  readonly subcartera = input<string | null>(null);
  /** El agente de arriba: si es una persona del ámbito, se ve solo lo suyo. */
  readonly agente = input('');

  private readonly marco = viewChild<ElementRef<HTMLElement>>('marco');

  readonly hoyIso = hoy();
  readonly lunesHoy = lunesDe(new Date());
  readonly ahora = new Date().getHours() * 60 + new Date().getMinutes();
  readonly lunes = signal(this.lunesHoy);
  readonly plan = signal<PlanSemana | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  /**
   * Lo movido o propuesto y aún sin confirmar, por plan (`p:idUsuario` o
   * `e:mes`): el plan entero de hoy en adelante.
   */
  readonly borrador = signal<Map<string, Bloque[]>>(new Map());
  private subcarteraAnterior: number | null = null;
  readonly gesto = signal<Gesto | null>(null);

  readonly horas = Array.from({ length: (CAL.hasta - CAL.desde) / 60 + 1 }, (_, i) => CAL.desde + i * 60);
  readonly altoTotal = MARGEN_ARRIBA + (CAL.hasta - CAL.desde) / 30 * CAL.alto + MARGEN_ABAJO;

  // ---------- Formulario ----------
  readonly editado = signal<Bloque | null>(null);
  readonly formFecha = signal('');
  readonly formHoras = signal(0);
  readonly formMinutos = signal(0);
  readonly resultadoForm = signal('—');
  readonly errorForm = signal('');
  readonly validando = signal(false);

  constructor() {
    effect(() => {
      const sub = this.idSubcartera();
      const lunes = this.lunes();
      // Lo propuesto es de hoy en adelante: se conserva al cambiar de semana, no de subcartera.
      if (sub !== this.subcarteraAnterior) {
        this.borrador.set(new Map());
        this.subcarteraAnterior = sub;
      }
      if (!sub) {
        this.plan.set(null);
        return;
      }
      this.cargar(lunes, sub);
    });
  }

  private cargar(lunes: string, sub: number): void {
    this.cargando.set(true);
    this.servicio.planSemana(lunes, sub).subscribe({
      next: p => {
        this.plan.set(p);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar el horario');
        this.cargando.set(false);
      }
    });
  }

  private recargar(): void {
    const sub = this.idSubcartera();
    if (sub) {
      this.cargar(this.lunes(), sub);
    }
  }

  moverSemana(dias: number): void {
    this.lunes.set(sumarDias(this.lunes(), dias));
  }

  // ---------- Lo que se ve ----------

  /** Una semana cerrada o por cerrar no se toca. */
  readonly editable = computed(() => {
    const e = this.plan()?.estadoSemana;
    return !!e && e !== 'CERRADA' && e !== 'POR_CERRAR';
  });

  /** La persona elegida en «Agente», si es una sola del ámbito. */
  readonly persona = computed<number | null>(() => {
    const texto = this.agente().trim().toLowerCase();
    const p = this.plan();
    if (!texto || !p) {
      return null;
    }
    const todos = new Map<number, string>();
    [...p.bloques, ...p.futuros].forEach(b => todos.set(b.idUsuario, b.nombre));
    p.deudas.forEach(d => todos.set(d.idUsuario, d.nombre));
    (p.equipos ?? []).forEach(e => e.gente.forEach(g => todos.set(g.idUsuario, g.nombre)));
    p.ausencias.forEach(a => todos.set(a.idUsuario, a.nombre));
    const hallados = [...todos.entries()].filter(([, n]) => (n ?? '').toLowerCase() === texto);
    return hallados.length === 1 ? hallados[0][0] : null;
  });

  readonly subtitulo = computed(() => {
    const p = this.plan();
    if (!this.idSubcartera() || !p) {
      return '';
    }
    const horas = `${this.duracion(p.minutosSemana)} por semana`;
    const sub = this.subcartera() ?? 'Esta subcartera';
    const id = this.persona();
    if (id) {
      const nombre = [...p.futuros, ...p.bloques].find(b => b.idUsuario === id)?.nombre
        ?? p.deudas.find(d => d.idUsuario === id)?.nombre ?? '';
      return `${nombre} · ${sub} · ${horas}`;
    }
    return `${sub} · ${p.asesores} ${p.asesores === 1 ? 'asesor' : 'asesores'} · ${horas}`;
  });

  readonly tituloMes = computed(() => {
    const l = this.lunes();
    const s = sumarDias(l, 5);
    const m1 = MESES[Number(l.slice(5, 7)) - 1];
    const m2 = MESES[Number(s.slice(5, 7)) - 1];
    // Cada mes con mayúscula, como la maqueta: «Septiembre – Octubre 2026».
    const mayuscula = (m: string) => m.charAt(0).toUpperCase() + m.slice(1);
    return `${m1 === m2 ? mayuscula(m1) : `${mayuscula(m1)} – ${mayuscula(m2)}`} ${s.slice(0, 4)}`;
  });

  readonly hoyEnSemana = computed(() => this.columnas().some(c => c.fecha === this.hoyIso));

  /** El sábado solo es de CASTIGO: en las demás subcarteras la semana es de lunes a viernes. */
  readonly conSabado = computed(() => (this.subcartera() ?? '').trim().toUpperCase() === 'CASTIGO');
  readonly finSemana = computed(() => {
    const p = this.plan();
    return p ? (this.conSabado() ? p.sabado : sumarDias(p.lunes, 4)) : '';
  });

  y(min: number): number {
    return MARGEN_ARRIBA + (min - CAL.desde) / 30 * CAL.alto;
  }

  /** Las columnas: cada día del equipo, con su turno partido en cuadros (trabajo, pausa, trabajo…). */
  readonly columnas = computed(() => {
    const p = this.plan();
    if (!p) {
      return [];
    }
    return p.dias.filter(d => this.conSabado() || indiceDia(d.fecha) < 5).map(d => ({
      fecha: d.fecha,
      corto: CORTOS[indiceDia(d.fecha)],
      numero: Number(d.fecha.slice(8, 10)),
      cajas: this.cajasDe(d)
    }));
  });

  private cajasDe(d: DiaPlan): { clase: string; arriba: number; alto: number; etq: string; nombre: string; pausa: boolean; holgada: boolean; titulo: string }[] {
    if (d.abierto || d.noLaborable) {
      return [];
    }
    const e = aMin(d.entrada);
    const s = aMin(d.salida);
    const pausas: [string, number, number][] = [];
    if (d.horaAlmuerzo && d.minutosAlmuerzo) {
      pausas.push(['Almuerzo', aMin(d.horaAlmuerzo), d.minutosAlmuerzo]);
    }
    if (d.horaBreak && d.minutosBreak) {
      pausas.push(['Break', aMin(d.horaBreak), d.minutosBreak]);
    }
    const cajas: { clase: string; arriba: number; alto: number; etq: string; nombre: string; pausa: boolean; holgada: boolean; titulo: string }[] = [];
    let desde = e;
    let cursor = this.y(e);
    const tramos: [number, number, string][] = [];
    for (const [nombre, h, min] of pausas.filter(([, h, min]) => h >= e && h + min <= s).sort((a, b) => a[1] - b[1])) {
      let arriba = this.y(h);
      let abajo = this.y(h + min);
      const falta = MIN_PAUSA + HUECO - (abajo - arriba);
      if (falta > 0) {
        arriba -= falta / 2;
        abajo += falta / 2;
      }
      if (arriba > cursor) {
        tramos.push([cursor, arriba, `${enHoras(desde)} – ${enHoras(h)}`]);
      }
      const hora = `${enHoras(h)} – ${enHoras(h + min)}`;
      const holgada = abajo - arriba - HUECO >= 40;
      cajas.push({ clase: `cal-pausa ${nombre === 'Almuerzo' ? 'almuerzo' : 'break'}${holgada ? '' : ' fina'}`,
                   arriba, alto: abajo - arriba - HUECO, etq: hora, nombre, pausa: true, holgada, titulo: `${nombre} ${hora}` });
      desde = h + min;
      cursor = abajo;
    }
    if (this.y(s) > cursor) {
      tramos.push([cursor, this.y(s), `${enHoras(desde)} – ${enHoras(s)}`]);
    }
    tramos.forEach(([arriba, abajo, etq]) =>
      cajas.push({ clase: 'cal-base', arriba, alto: abajo - arriba - HUECO, etq, nombre: '', pausa: false, holgada: true, titulo: etq }));
    return cajas;
  }

  /** Lo de todo el día: permisos, descansos y citas de cada quien, y los feriados del equipo. */
  readonly chips = computed(() => {
    const p = this.plan();
    if (!p) {
      return [];
    }
    const fechas = p.dias.map(d => d.fecha);
    const id = this.persona();
    const chips: { columna: string; tipo: string; quien: string; porAprobar: boolean; feriado: boolean; titulo: string }[] = [];
    for (const a of p.ausencias) {
      if (id && a.idUsuario !== id) {
        continue;
      }
      const k0 = fechas.findIndex(f => f >= a.desde);
      if (k0 < 0 || fechas[k0] > a.hasta) {
        continue;
      }
      let k1 = k0;
      while (k1 + 1 < fechas.length && fechas[k1 + 1] <= a.hasta) {
        k1++;
      }
      chips.push({ columna: `${k0 + 1} / span ${k1 - k0 + 1}`, tipo: a.tipo, quien: this.nombreCorto(a.nombre),
                   porAprobar: a.porAprobar, feriado: false, titulo: `${a.tipo} · ${a.nombre}${a.porAprobar ? ' · por aprobar' : ''}` });
    }
    p.dias.forEach((d, k) => {
      if (d.noLaborable) {
        chips.push({ columna: `${k + 1} / span 1`, tipo: d.noLaborable, quien: 'Todo el equipo', porAprobar: false, feriado: true, titulo: d.noLaborable });
      }
    });
    return chips;
  });

  /** Lo que se ve de un plan de hoy en adelante: lo movido aquí o, si no, lo del servidor. */
  private futurosDe(plan: string): Bloque[] {
    const propio = this.borrador().get(plan);
    if (propio) {
      return propio;
    }
    return (this.plan()?.futuros ?? []).map(b => this.aLocal(b)).filter(b => b.plan === plan);
  }

  private aLocal(b: BloquePlan): Bloque {
    return { clave: `${b.idUsuario}-${b.fecha}`, plan: b.clave ? planEquipo(b.clave) : planPersona(b.idUsuario),
             idUsuario: b.idUsuario, nombre: b.nombre, fecha: b.fecha, minutos: b.minutos, salida: aMin(b.salida),
             confirmado: b.confirmado, hecho: b.hecho, deuda: b.clave ?? null, equipo: !!b.equipo };
  }

  /** Los planes que se ven: los del servidor y los tocados aquí. */
  private planes(): string[] {
    return [...new Set<string>([...(this.plan()?.futuros ?? []).map(b => this.aLocal(b).plan), ...this.borrador().keys()])];
  }

  /** Los bloques de la semana, uno por persona: lo pasado tal como quedó y lo de hoy en adelante del plan que se ve. */
  readonly bloquesSemana = computed<Bloque[]>(() => {
    const p = this.plan();
    if (!p) {
      return [];
    }
    const id = this.persona();
    const pasados = p.bloques.filter(b => b.fecha < this.hoyIso).map(b => this.aLocal(b));
    const futuros = this.planes().flatMap(k => this.futurosDe(k)).filter(b => b.fecha >= p.lunes && b.fecha <= p.sabado);
    return [...pasados, ...futuros].filter(b => !id || b.idUsuario === id);
  });

  /**
   * Los cuadros de un día. Lo del equipo (un día sin asignación) va en uno
   * solo, porque todos se quedan lo mismo, y primero; después cada persona.
   */
  bloquesDelDia(fecha: string): Bloque[] {
    const cuadros: Bloque[] = [];
    for (const b of this.bloquesSemana().filter(x => x.fecha === fecha).sort((a, c) => a.nombre.localeCompare(c.nombre))) {
      const ya = b.equipo ? cuadros.find(c => c.gente && c.plan === b.plan) : undefined;
      if (ya) {
        ya.gente!.push(b);
      } else if (b.equipo) {
        cuadros.push({ ...b, clave: `${b.plan}|${fecha}`, nombre: 'Equipo', gente: [b] });
      } else {
        cuadros.push(b);
      }
    }
    return cuadros.sort((a, c) => Number(!!c.gente) - Number(!!a.gente)).map(c => (c.gente ? this.conHecho(c) : c));
  }

  /** Lo que hizo el equipo ese día: lo que le faltó a cada uno, sumado. */
  private conHecho(c: Bloque): Bloque {
    const con = c.gente!.filter(x => x.hecho !== null);
    if (!con.length) {
      return { ...c, hecho: null };
    }
    return { ...c, hecho: c.minutos - con.reduce((t, x) => t + Math.max(0, x.minutos - (x.hecho ?? 0)), 0) };
  }

  /** El cuadro que se ve con esa clave. */
  private cuadro(clave: string | undefined): Bloque | undefined {
    return this.columnas().flatMap(c => this.bloquesDelDia(c.fecha)).find(x => x.clave === clave);
  }

  /** Los bloques que se mueven juntos: los de todo el equipo ese día, o el de la persona. */
  private enGrupo(b: Bloque): (x: Bloque) => boolean {
    return b.gente ? x => x.equipo && x.fecha === b.fecha : x => x.clave === b.clave;
  }

  grupoDe(b: Bloque): Bloque[] {
    return this.futurosDe(b.plan).filter(this.enGrupo(b));
  }

  /** «Equipo: Ana G., Beto P. · Sin asignación del 01/10», o el nombre. */
  quienDe(b: Bloque): string {
    return b.gente ? `Equipo: ${this.grupoDe(b).map(x => this.nombreCorto(x.nombre)).join(', ')} · ${this.origenDe(b.deuda)}` : b.nombre;
  }

  origenDe(deuda: string | null): string {
    return this.plan()?.equipos?.find(e => e.clave === deuda)?.origen ?? 'Sin asignación';
  }

  soloLectura(b: Bloque): boolean {
    return !this.editable() || b.fecha < this.hoyIso;
  }

  minutosVisibles(b: Bloque): number {
    const g = this.gesto();
    return g && g.modo === 'estirar' && g.bloque.clave === b.clave ? g.minutos : b.minutos;
  }

  rango(b: Bloque): string {
    return `${enHoras(b.salida)} – ${enHoras(b.salida + this.minutosVisibles(b))}`;
  }

  altoBloque(b: Bloque): number {
    const min = this.minutosVisibles(b);
    const compacto = min < 60;
    return Math.max(this.y(b.salida + min) - this.y(b.salida), compacto ? CAL.alto : CAL.alto * (b.hecho !== null ? 2.3 : 1.75));
  }

  textoHecho(b: Bloque): string {
    return (b.hecho ?? 0) >= b.minutos ? 'Cumplida' : `Faltaron ${b.minutos - (b.hecho ?? 0)} min`;
  }

  /** El panel: lo que debe cada quien, con su plan de hoy en adelante. */
  readonly deudas = computed(() => {
    const p = this.plan();
    if (!p) {
      return [];
    }
    const id = this.persona();
    return p.deudas.filter(d => !id || d.idUsuario === id).map((d: DeudaPlan) => {
      const bloques = this.futurosDe(planPersona(d.idUsuario)).filter(b => b.fecha >= this.hoyIso).sort((a, b) => a.fecha.localeCompare(b.fecha));
      const prog = bloques.reduce((t, b) => t + b.minutos, 0);
      const confirmado = bloques.filter(b => b.confirmado).reduce((t, b) => t + b.minutos, 0);
      const pendiente = Math.max(0, d.total - d.recuperado);
      const confirmadoVisible = Math.min(confirmado, pendiente);
      return {
        ...d, bloques, confirmado, porConfirmar: prog - confirmado,
        confirmadoVisible, porConfirmarVisible: Math.min(prog - confirmado, pendiente - confirmadoVisible),
        falta: Math.max(0, d.total - d.recuperado - prog),
        sinConfirmar: bloques.filter(b => !b.confirmado).length,
        tarde: bloques.filter(b => b.fecha > d.vence).length
      };
    });
  });

  /**
   * Lo que debe el equipo por días sin asignación: una tarjeta por mes, con el
   * plan del equipo y lo que alguien deba aparte (salió antes un día).
   */
  readonly equipos = computed(() => {
    const p = this.plan();
    if (!p) {
      return [];
    }
    const id = this.persona();
    return (p.equipos ?? []).filter(T => !id || T.gente.some(g => g.idUsuario === id)).map((T: DeudaEquipoPlan) => {
      const plan = planEquipo(T.clave);
      const bloques = this.futurosDe(plan).filter(b => b.fecha >= this.hoyIso).sort((a, b) => a.fecha.localeCompare(b.fecha));
      const saldos = T.gente.map(g => {
        const suyos = bloques.filter(b => b.idUsuario === g.idUsuario);
        const programado = suyos.reduce((t, b) => t + b.minutos, 0);
        const confirmado = suyos.filter(b => b.confirmado).reduce((t, b) => t + b.minutos, 0);
        return { ...g, programado, confirmado, falta: Math.max(0, g.total - g.recuperado - programado) };
      });
      // Lo que el plan del equipo todavía no le cubre a nadie; lo demás es de cada uno.
      const comun = Math.min(...saldos.map(s => s.falta));
      const dias = [...new Map(bloques.filter(b => b.equipo).map(b => [b.fecha, b])).values()];
      const aparte = saldos.filter(s => s.falta > comun || bloques.some(b => !b.equipo && b.idUsuario === s.idUsuario)).map(s => {
        const suyos = bloques.filter(b => !b.equipo && b.idUsuario === s.idUsuario);
        const extra = s.falta - comun;
        const partes = [...this.tramos(suyos).map(t => `${t.cuando} ${t.cuanto}`), ...(extra > 0 ? [`falta ${this.duracion(extra)}`] : [])];
        const faltaron = s.faltaron.reduce((t, f) => t + f.minutos, 0);
        return {
          idUsuario: s.idUsuario, nombre: s.nombre, extra, texto: partes.join(' · '), conBloques: suyos.length > 0,
          sinConfirmar: suyos.some(b => !b.confirmado),
          porque: s.faltaron.length ? `El ${this.unirY(s.faltaron.map(f => dm(f.fecha)))} faltaron ${faltaron} min` : ''
        };
      });
      const total = saldos.reduce((t, s) => t + s.total, 0);
      const rec = saldos.reduce((t, s) => t + Math.min(s.recuperado, s.total), 0);
      const conf = saldos.reduce((t, s) => t + Math.min(s.confirmado, Math.max(0, s.total - s.recuperado)), 0);
      const sin = saldos.reduce((t, s) => t + Math.min(s.programado - s.confirmado, Math.max(0, s.total - s.recuperado - s.confirmado)), 0);
      const pendientes = saldos.filter(s => s.falta > 0).length;
      const totales = [...new Set(T.gente.map(g => g.total))];
      const desde = [sumarDias(this.hoyIso, 1), sumarDias(T.dias[0], 1)].sort().pop()!;
      return {
        deuda: T, plan, comun, aparte,
        tramos: this.tramos(dias),
        pastilla: comun ? ['p-tarde', `Falta ${this.duracion(comun)}`]
          : pendientes ? ['p-tarde', `${pendientes} ${pendientes === 1 ? 'pendiente' : 'pendientes'}`] : ['p-ok', 'Cubierto'],
        debe: totales.length === 1 ? `${this.duracion(totales[0])}${T.gente.length > 1 ? ' cada uno' : ''}`
          : `hasta ${this.duracion(Math.max(...totales))}`,
        pctRec: this.pct(rec, total), pctConf: this.pct(conf, total), pctSin: this.pct(sin, total),
        sinConfirmar: bloques.some(b => !b.confirmado),
        tarde: new Set(bloques.filter(b => b.fecha > T.vence).map(b => b.fecha)).size,
        nota: comun && !dias.length && T.dias[0] >= this.hoyIso ? `Se recupera desde el ${dm(desde)}.` : ''
      };
    });
  });

  /** Los días seguidos con lo mismo, en una línea: «23/09 – 28/09 · 30 min al día · 4 días». */
  private tramos(bloques: Bloque[]): { desde: string; cuando: string; cuanto: string; confirmado: boolean }[] {
    const grupos: { desde: string; hasta: string; minutos: number; salida: number; confirmado: boolean; dias: number }[] = [];
    for (const b of bloques) {
      const ultimo = grupos[grupos.length - 1];
      if (ultimo && ultimo.minutos === b.minutos && ultimo.confirmado === b.confirmado) {
        ultimo.hasta = b.fecha;
        ultimo.dias++;
      } else {
        grupos.push({ desde: b.fecha, hasta: b.fecha, minutos: b.minutos, salida: b.salida, confirmado: b.confirmado, dias: 1 });
      }
    }
    return grupos.map(g => ({
      desde: g.desde, confirmado: g.confirmado,
      cuando: g.dias === 1 ? `${this.corto(g.desde)} ${dm(g.desde)}` : `${dm(g.desde)} – ${dm(g.hasta)}`,
      cuanto: g.dias === 1 ? `${enHoras(g.salida)} – ${enHoras(g.salida + g.minutos)}` : `${this.duracion(g.minutos)} al día · ${g.dias} días`
    }));
  }

  private unirY(lista: string[]): string {
    return lista.length < 2 ? lista.join('') : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`;
  }

  pct(v: number, total: number): number {
    return total ? Math.min(100, (v / total) * 100) : 0;
  }

  // ---------- Reglas para mover dentro de la semana que se ve ----------

  /** Por qué no se puede recuperar ese día de la semana que se ve; null si se puede. */
  private motivoNoRecupera(idUsuario: number, fecha: string, minutos: number): string | null {
    const p = this.plan();
    if (!p || !this.editable()) {
      return 'Esa semana ya no se modifica';
    }
    if (fecha < this.hoyIso) {
      return 'Ese día ya pasó';
    }
    const d = p.dias.find(x => x.fecha === fecha);
    if (!d) {
      return 'Ese día no se trabaja';
    }
    if (d.noLaborable) {
      return 'Ese día no es laborable';
    }
    const ausencia = p.ausencias.find(a => a.idUsuario === idUsuario && a.desde <= fecha && a.hasta >= fecha);
    if (ausencia) {
      return `Ese día tiene ${ausencia.tipo.toLowerCase()}`;
    }
    const salida = d.abierto ? CAL.desde : aMin(d.salida);
    if (salida + minutos > CAL.hasta) {
      return d.abierto ? 'No puede pasar de las 20:00' : `No puede pasar de las 20:00: ese día sale a las ${enHoras(salida)}`;
    }
    return null;
  }

  private salidaDe(fecha: string): number {
    const d = this.plan()?.dias.find(x => x.fecha === fecha);
    return !d ? CAL.desde : d.abierto ? CAL.desde : aMin(d.salida);
  }

  /** Cambia un plan aquí, sin guardar: lo tocado queda por confirmar. */
  private cambiarPlan(plan: string, cambio: (lista: Bloque[]) => Bloque[]): void {
    const actual = this.futurosDe(plan).map(b => ({ ...b }));
    this.borrador.update(m => new Map(m).set(plan, cambio(actual)));
  }

  /**
   * Por qué ese bloque (el del equipo, con todos) no puede ir ese día; null si
   * puede. Lo de un día sin asignación se devuelve después de ese día, y nadie
   * tiene dos recuperaciones el mismo día.
   */
  private motivoGrupo(b: Bloque, destino: string, minutos: number): string | null {
    const T = b.deuda ? this.plan()?.equipos?.find(e => e.clave === b.deuda) : null;
    if (T && destino <= T.dias[0]) {
      return `Se recupera después del ${dm(T.dias[0])}`;
    }
    const gente = b.gente ? this.grupoDe(b) : [b];
    for (const x of gente) {
      const motivo = this.motivoNoRecupera(x.idUsuario, destino, minutos)
        ?? (this.otraRecuperacion(x, destino) ? 'Ese día ya tiene otra recuperación' : null);
      if (motivo) {
        return gente.length > 1 ? `${this.nombreCorto(x.nombre)}: ${motivo.charAt(0).toLowerCase()}${motivo.slice(1)}` : motivo;
      }
    }
    return null;
  }

  /** Si esa persona ya tiene ese día una recuperación de otra clase (de otro plan, o la del equipo y una aparte). */
  private otraRecuperacion(x: Bloque, fecha: string): boolean {
    return this.planes().some(k => this.futurosDe(k).some(y => y.idUsuario === x.idUsuario && y.fecha === fecha
      && !(y.plan === x.plan && y.equipo === x.equipo)));
  }

  /** Lleva un bloque (el del equipo, con todos) a otro día; si ya hay uno ese día, se suman. Si no cabe hasta las 20:00, se acorta. */
  private moverBloque(b: Bloque, destino: string): boolean {
    const motivo = this.motivoGrupo(b, destino, 30);
    if (motivo) {
      this.toast.error(motivo);
      return false;
    }
    const tope = CAL.hasta - this.salidaDe(destino);
    const delGrupo = this.enGrupo(b);
    let ajustado = false;
    this.cambiarPlan(b.plan, lista => {
      let salida = lista;
      for (const x of lista.filter(delGrupo)) {
        const ya = salida.find(y => y !== x && y.idUsuario === x.idUsuario && y.fecha === destino);
        if (ya) {
          ya.minutos = Math.min(ya.minutos + x.minutos, tope);
          ya.confirmado = false;
          salida = salida.filter(y => y !== x);
        } else {
          ajustado ||= x.minutos > tope;
          x.minutos = Math.min(x.minutos, tope);
          x.fecha = destino;
          x.salida = this.salidaDe(destino);
          x.clave = `${x.idUsuario}-${destino}`;
          x.confirmado = false;
        }
      }
      return salida;
    });
    if (ajustado) {
      this.toast.success(`Se ajustó a ${this.duracion(tope)}: ese día no se puede pasar de las 20:00`);
    }
    return true;
  }

  // ---------- Arrastrar, estirar y el teclado ----------

  empezar(ev: PointerEvent): void {
    const el = (ev.target as HTMLElement).closest('.bloque') as HTMLElement | null;
    if (!el || el.classList.contains('solo-lectura') || ev.button !== 0) {
      return;
    }
    const b = this.cuadro(el.dataset['bloque']);
    if (!b) {
      return;
    }
    this.gesto.set({
      bloque: b, modo: (ev.target as HTMLElement).closest('[data-asa]') ? 'estirar' : 'mover',
      x0: ev.clientX, y0: ev.clientY, movido: false, minutos: b.minutos, destino: null, dx: 0
    });
    el.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  }

  mover(ev: PointerEvent): void {
    const g = this.gesto();
    if (!g) {
      return;
    }
    const dx = ev.clientX - g.x0;
    const dy = ev.clientY - g.y0;
    if (!g.movido && Math.hypot(dx, dy) < 4) {
      return;
    }
    if (g.modo === 'estirar') {
      // De 30 en 30 minutos, sin pasar de las 20:00.
      const base = Math.max(30, Math.round(g.bloque.minutos / 30) * 30);
      const pedido = Math.max(30, base + Math.round(dy / CAL.alto) * 30);
      this.gesto.set({ ...g, movido: true, minutos: Math.min(pedido, CAL.hasta - g.bloque.salida) });
    } else {
      const columnas = Array.from(this.marco()?.nativeElement.querySelectorAll<HTMLElement>('.cal-col') ?? []);
      const col = columnas.find(c => {
        const r = c.getBoundingClientRect();
        return ev.clientX >= r.left && ev.clientX < r.right;
      });
      this.gesto.set({ ...g, movido: true, dx, destino: col?.dataset['fecha'] ?? null });
    }
  }

  /** Si el día bajo el bloque que se arrastra lo admite. */
  destinoValido(): boolean {
    const g = this.gesto();
    return !!g?.destino && g.destino !== g.bloque.fecha && !this.motivoGrupo(g.bloque, g.destino, 30);
  }

  soltar(): void {
    const g = this.gesto();
    if (!g) {
      return;
    }
    this.gesto.set(null);
    if (!g.movido) {
      this.abrirForm(g.bloque);
      return;
    }
    if (g.modo === 'estirar') {
      if (g.minutos !== g.bloque.minutos) {
        const delGrupo = this.enGrupo(g.bloque);
        this.cambiarPlan(g.bloque.plan, lista => lista.map(x => delGrupo(x) ? { ...x, minutos: g.minutos, confirmado: false } : x));
      }
    } else if (g.destino && g.destino !== g.bloque.fecha) {
      this.moverBloque(g.bloque, g.destino);
    }
  }

  cancelarGesto(): void {
    this.gesto.set(null);
  }

  /** Flechas izquierda y derecha cambian de día; arriba y abajo, 30 minutos menos o más; Enter abre el formulario. */
  teclado(ev: KeyboardEvent): void {
    const el = (ev.target as HTMLElement).closest('.bloque') as HTMLElement | null;
    if (!el || el.classList.contains('solo-lectura')) {
      return;
    }
    const b = this.cuadro(el.dataset['bloque']);
    if (!b) {
      return;
    }
    const fechas = this.columnas().map(c => c.fecha);
    const i = fechas.indexOf(b.fecha);
    if (ev.key === 'Enter') {
      this.abrirForm(b);
      return;
    }
    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
      const destino = fechas[i + (ev.key === 'ArrowLeft' ? -1 : 1)];
      if (destino && this.moverBloque(b, destino)) {
        this.enfocar(b.gente ? `${b.plan}|${destino}` : `${b.idUsuario}-${destino}`);
      }
      ev.preventDefault();
    }
    if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
      const tope = CAL.hasta - b.salida;
      const nuevo = b.minutos + (ev.key === 'ArrowUp' ? -30 : 30);
      if (nuevo >= 30 && nuevo <= tope) {
        const delGrupo = this.enGrupo(b);
        this.cambiarPlan(b.plan, lista => lista.map(x => delGrupo(x) ? { ...x, minutos: nuevo, confirmado: false } : x));
        this.enfocar(b.clave);
      }
      ev.preventDefault();
    }
  }

  private enfocar(clave: string): void {
    setTimeout(() => this.marco()?.nativeElement.querySelector<HTMLElement>(`[data-bloque="${clave}"]`)?.focus());
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.cerrarForm();
  }

  // ---------- Panel: proponer, confirmar, descartar ----------

  proponer(idUsuario: number, nombre: string): void {
    const actual = this.futurosDe(planPersona(idUsuario));
    this.guardando.set(true);
    this.servicio.proponerPlan(idUsuario, actual.map(b => ({ fecha: b.fecha, minutos: b.minutos }))).subscribe({
      next: r => {
        this.guardando.set(false);
        const antes = new Map(actual.map(b => [b.fecha, b]));
        const nuevo = r.bloques.map(b => {
          const ya = antes.get(b.fecha);
          const igual = !!ya && ya.minutos === b.minutos;
          return { ...this.aLocal(b), nombre, confirmado: igual ? ya!.confirmado : false };
        });
        this.borrador.update(m => new Map(m).set(planPersona(idUsuario), nuevo));
        const bien = r.falta <= 0 && nuevo.some(b => !b.confirmado);
        if (bien) {
          this.toast.success(`${r.mensaje} para ${this.nombreCorto(nombre)}`);
        } else {
          this.toast.error(r.mensaje);
        }
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo proponer');
      }
    });
  }

  confirmar(idUsuario: number, nombre: string): void {
    const plan = this.futurosDe(planPersona(idUsuario));
    this.guardando.set(true);
    this.servicio.guardarPlan(idUsuario, plan.map(b => ({ fecha: b.fecha, minutos: b.minutos }))).subscribe({
      next: () => {
        this.guardando.set(false);
        this.olvidar(planPersona(idUsuario));
        this.toast.success(`Plan de ${this.nombreCorto(nombre)} confirmado: ya lo ve en Mi Asistencia`);
        this.recargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo confirmar el plan');
      }
    });
  }

  /** Vuelve al plan guardado: «de Ana G.» o «del equipo». */
  descartarPlan(plan: string, de: string): void {
    this.olvidar(plan);
    this.toast.success(`Se descartaron los cambios ${de}`);
  }

  private olvidar(plan: string): void {
    this.borrador.update(m => {
      const copia = new Map(m);
      copia.delete(plan);
      return copia;
    });
  }

  // ---------- Plan del equipo (días sin asignación) ----------

  /** El plan del equipo como se manda: un bloque por día para todos y los de cada uno aparte. */
  private pedidoEquipo(lista: Bloque[]): PlanEquipoPedido {
    const equipo = new Map<string, number>();
    const aparte: Record<number, { fecha: string; minutos: number }[]> = {};
    for (const b of lista.filter(x => x.fecha >= this.hoyIso)) {
      if (b.equipo) {
        equipo.set(b.fecha, b.minutos);
      } else {
        (aparte[b.idUsuario] ??= []).push({ fecha: b.fecha, minutos: b.minutos });
      }
    }
    return { equipo: [...equipo].map(([fecha, minutos]) => ({ fecha, minutos })), aparte };
  }

  /** Lo propuesto, como bloques de cada asesor: lo que ya estaba igual conserva si estaba confirmado. */
  private desdePropuesta(T: DeudaEquipoPlan, actual: Bloque[], r: PropuestaEquipoPlan): Bloque[] {
    const plan = planEquipo(T.clave);
    const antes = new Map(actual.map(b => [`${b.equipo ? 'e' : b.idUsuario}|${b.fecha}`, b]));
    const bloque = (idUsuario: number, nombre: string, b: BloqueEquipoPlan, equipo: boolean): Bloque => {
      const ya = antes.get(`${equipo ? 'e' : idUsuario}|${b.fecha}`);
      return { clave: `${idUsuario}-${b.fecha}`, plan, idUsuario, nombre, fecha: b.fecha, minutos: b.minutos,
               salida: b.salida ? aMin(b.salida) : this.salidaDe(b.fecha),
               confirmado: !!ya && ya.minutos === b.minutos ? ya.confirmado : false, hecho: null, deuda: T.clave, equipo };
    };
    return [
      ...r.equipo.flatMap(b => T.gente.map(g => bloque(g.idUsuario, g.nombre, b, true))),
      ...Object.entries(r.aparte ?? {}).flatMap(([id, lista]) =>
        lista.map(b => bloque(Number(id), T.gente.find(g => g.idUsuario === Number(id))?.nombre ?? '', b, false)))
    ];
  }

  /** Propone lo que le falta a todo el equipo: los mismos bloques para todos. */
  proponerEquipo(T: DeudaEquipoPlan): void {
    const sub = this.idSubcartera();
    if (!sub) {
      return;
    }
    const plan = planEquipo(T.clave);
    const actual = this.futurosDe(plan);
    this.guardando.set(true);
    this.servicio.proponerEquipo(sub, T.clave, this.pedidoEquipo(actual)).subscribe({
      next: r => {
        this.guardando.set(false);
        this.borrador.update(m => new Map(m).set(plan, this.desdePropuesta(T, actual, r)));
        const nuevos = r.equipo.filter(b => !b.confirmado).map(b => b.fecha).sort();
        if (r.falta > 0 || !nuevos.length) {
          this.toast.error(r.mensaje);
          return;
        }
        this.toast.success(`${r.mensaje}, ${nuevos.length === 1 ? `el ${dm(nuevos[0])}` : `del ${dm(nuevos[0])} al ${dm(nuevos[nuevos.length - 1])}`}`);
        // Si lo propuesto empieza en otra semana, el calendario va a esa semana.
        if (!nuevos.some(f => f >= this.lunes() && f <= sumarDias(this.lunes(), 5))) {
          this.lunes.set(lunesDe(new Date(nuevos[0] + 'T00:00:00')));
        }
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo proponer');
      }
    });
  }

  /** Propone lo que una persona debe aparte del equipo, en los días en que no tiene la del equipo. */
  proponerAparte(T: DeudaEquipoPlan, idUsuario: number, nombre: string): void {
    const sub = this.idSubcartera();
    if (!sub) {
      return;
    }
    const plan = planEquipo(T.clave);
    const actual = this.futurosDe(plan);
    this.guardando.set(true);
    this.servicio.proponerAparte(sub, T.clave, idUsuario, this.pedidoEquipo(actual)).subscribe({
      next: r => {
        this.guardando.set(false);
        const nuevo = this.desdePropuesta(T, actual, r);
        this.borrador.update(m => new Map(m).set(plan, nuevo));
        const bien = r.falta <= 0 && nuevo.some(b => !b.equipo && b.idUsuario === idUsuario && !b.confirmado);
        if (bien) {
          this.toast.success(r.mensaje.replace(nombre, this.nombreCorto(nombre)));
        } else {
          this.toast.error(r.mensaje);
        }
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo proponer');
      }
    });
  }

  confirmarEquipo(T: DeudaEquipoPlan): void {
    const sub = this.idSubcartera();
    if (!sub) {
      return;
    }
    const plan = planEquipo(T.clave);
    this.guardando.set(true);
    this.servicio.guardarEquipo(sub, T.clave, this.pedidoEquipo(this.futurosDe(plan))).subscribe({
      next: () => {
        this.guardando.set(false);
        this.olvidar(plan);
        this.toast.success('Plan del equipo confirmado: cada asesor lo ve en Mi Asistencia');
        this.recargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo confirmar el plan');
      }
    });
  }

  // ---------- Formulario ----------

  abrirForm(b: Bloque): void {
    if (this.soloLectura(b)) {
      return;
    }
    this.editado.set(b);
    this.formFecha.set(b.fecha);
    this.formHoras.set(Math.floor(b.minutos / 60));
    this.formMinutos.set(b.minutos % 60);
    this.errorForm.set('');
    this.revisarForm();
  }

  cerrarForm(): void {
    this.editado.set(null);
  }

  private minutosForm(): number {
    return (this.formHoras() || 0) * 60 + (this.formMinutos() || 0);
  }

  /** «Ese día sale a las 19:30 en vez de las 18:30», o por qué no se puede. */
  revisarForm(): void {
    const b = this.editado();
    const fecha = this.formFecha();
    const min = this.minutosForm();
    if (!b) {
      return;
    }
    if (!fecha) {
      this.errorForm.set('Elige el día');
      this.resultadoForm.set('—');
      return;
    }
    if (min <= 0) {
      this.errorForm.set('Pon al menos unos minutos');
      this.resultadoForm.set('—');
      return;
    }
    this.validando.set(true);
    this.validar(b, fecha, min).subscribe({
      next: v => {
        this.validando.set(false);
        const salida = v.salida ? aMin(v.salida) : null;
        this.resultadoForm.set(salida !== null
          ? `Ese día ${b.gente ? 'salen' : 'sale'} a las ${enHoras(salida + min)} en vez de las ${enHoras(salida)}` : '—');
        this.errorForm.set(v.motivo ?? (fecha !== b.fecha ? this.conflictoForm(b, fecha) : '') ?? '');
      },
      error: () => {
        this.validando.set(false);
        this.errorForm.set('No se pudo revisar ese día');
      }
    });
  }

  guardarForm(b: Bloque): void {
    const fecha = this.formFecha();
    const min = this.minutosForm();
    if (this.errorForm() || !fecha || min <= 0) {
      return;
    }
    this.validando.set(true);
    this.validar(b, fecha, min).subscribe({
      next: v => {
        this.validando.set(false);
        const motivo = v.motivo ?? (fecha !== b.fecha ? this.conflictoForm(b, fecha) : '');
        if (motivo) {
          this.errorForm.set(motivo);
          return;
        }
        const salida = v.salida ? aMin(v.salida) : CAL.desde;
        const delGrupo = this.enGrupo(b);
        this.cambiarPlan(b.plan, lista => {
          const movidos = lista.filter(delGrupo);
          let salidaLista = lista.filter(x => !delGrupo(x));
          for (const x of movidos) {
            const ya = salidaLista.find(y => y.idUsuario === x.idUsuario && y.fecha === fecha);
            if (ya) {
              ya.minutos = Math.min(ya.minutos + min, CAL.hasta - salida);
              ya.confirmado = false;
            } else {
              salidaLista = [...salidaLista, { ...x, fecha, minutos: min, salida, clave: `${x.idUsuario}-${fecha}`, confirmado: false }];
            }
          }
          return salidaLista;
        });
        this.cerrarForm();
      },
      error: () => {
        this.validando.set(false);
        this.errorForm.set('No se pudo revisar ese día');
      }
    });
  }

  /** El del equipo se revisa para todos; el de una persona, para ella. */
  private validar(b: Bloque, fecha: string, minutos: number) {
    const sub = this.idSubcartera();
    return b.gente && b.deuda && sub
      ? this.servicio.validarEquipo(sub, b.deuda, fecha, minutos)
      : this.servicio.validarBloque(b.idUsuario, fecha, minutos);
  }

  /** Lo que el servidor no ve: lo que se está armando aquí ese otro día. */
  private conflictoForm(b: Bloque, fecha: string): string {
    const T = b.deuda ? this.plan()?.equipos?.find(e => e.clave === b.deuda) : null;
    if (T && fecha <= T.dias[0]) {
      return `Se recupera después del ${dm(T.dias[0])}`;
    }
    const x = (b.gente ? this.grupoDe(b) : [b]).find(y => this.otraRecuperacion(y, fecha));
    return x ? `${b.gente ? this.nombreCorto(x.nombre) + ': ese' : 'Ese'} día ya tiene otra recuperación` : '';
  }

  /**
   * Quitar un bloque confirmado, sin nada más a medias en ese plan, se guarda
   * ya (queda en la Auditoría). Con otros cambios sin confirmar, se quita del
   * plan que se está armando y se confirma junto con lo demás. El del equipo se
   * quita para todos.
   */
  quitar(b: Bloque): void {
    const idUsuario = b.idUsuario;
    const delGrupo = this.enGrupo(b);
    const restantes = this.futurosDe(b.plan).filter(x => !delGrupo(x));
    const aMedias = restantes.some(x => !x.confirmado) || this.borrador().has(b.plan);
    this.cerrarForm();
    if (!b.confirmado || aMedias) {
      this.borrador.update(m => new Map(m).set(b.plan, restantes));
      return;
    }
    const sub = this.idSubcartera();
    this.guardando.set(true);
    const guardar = b.deuda && sub
      ? this.servicio.guardarEquipo(sub, b.deuda, this.pedidoEquipo(restantes))
      : this.servicio.guardarPlan(idUsuario, restantes.map(x => ({ fecha: x.fecha, minutos: x.minutos })));
    guardar.subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success('Recuperación quitada');
        this.recargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo quitar');
      }
    });
  }

  // ---------- Formatos ----------

  corto(fecha: string): string {
    return CORTOS[indiceDia(fecha)];
  }

  nombreCorto(nombre: string | null): string {
    const [a, b] = (nombre ?? '').split(' ');
    return b ? `${a} ${b[0]}.` : a;
  }

  /** «1 h 05», «45 min». */
  duracion(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h && m ? `${h} h ${String(m).padStart(2, '0')}` : h ? `${h} h` : `${m} min`;
  }
}
