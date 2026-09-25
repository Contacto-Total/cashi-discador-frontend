import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { concatMap, from, toArray } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { AsistenciaService } from './asistencia.service';
import {
  AsistenciaDia,
  AsistenciaReporte,
  EstadoAsistencia,
  Justificacion,
  MiPlan,
  TipoDia
} from './asistencia.models';
import {
  RECUPERACION, TIPOS_DE_CALENDARIO, abrirArchivo, avisoAnticipacion, avisoDeCierre, detalleRecuperacion,
  errorDeRecuperacion, hoy as hoyLocal, lunesDe as lunesLocal, primerDiaPermitido, sumarDias as sumarDiasLocal
} from './asistencia.estilos';

const DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
/** Los meses escritos, en minúscula: el navegador en es-PE da «Setiembre» con mayúscula. */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const minutosDe = (h: string | null | undefined): number => (h ? Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5)) : 0);
const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/** Los mismos nombres y colores que ve la supervisora: una sola leyenda. */
const ESTADOS: Record<EstadoAsistencia, { texto: string; clase: string }> = {
  PUNTUAL: { texto: 'Puntual', clase: 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' },
  TARDE: { texto: 'Tarde', clase: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300' },
  FALTA: { texto: 'Falta', clase: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300' },
  INCOMPLETO: { texto: 'Incompleto', clase: 'bg-[#fdeee0] text-[#c2410c] dark:bg-orange-950/50 dark:text-orange-300' },
  JUSTIFICADO: { texto: 'Justificado', clase: 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300' },
  NO_LABORABLE: { texto: 'No laborable', clase: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' }
};

const ESTADO_SOLICITUD: Record<string, { texto: string; clase: string }> = {
  PENDIENTE: { texto: 'Por revisar', clase: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300' },
  REVISADA: { texto: 'En RR.HH.', clase: 'bg-[#eef2ff] text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300' },
  APROBADA: { texto: 'Aprobada', clase: 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300' },
  RECHAZADA: { texto: 'Rechazada', clase: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300' }
};

const ESTILOS = {
  etiqueta: 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:!text-[#757575] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonSecundario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonPrimario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg border border-[#0f172a] bg-[#0f172a] px-3.5 text-[13px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white dark:bg-white dark:!text-[#0f172a] dark:hover:bg-slate-200',
  botonIcono: 'inline-flex h-[32px] min-w-[32px] items-center justify-center rounded-[7px] border border-[#e6e9ee] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200',
  th: 'whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  td: 'whitespace-nowrap px-3 py-2 text-[12.5px] tabular-nums',
  tarjeta: 'flex flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  rotulo: 'text-[11.5px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  cifra: 'text-2xl font-extrabold leading-[1.3] tracking-[-0.02em] tabular-nums',
  unidad: 'ml-1 text-xs font-semibold text-[#5f6c80] dark:text-slate-400',
  pie: 'mt-auto pt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400',
  icono: 'flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f1f3f6] text-[#0f172a] dark:bg-slate-800 dark:text-slate-100',
  titulo: '!mb-3 !mt-0 text-[15px] font-extrabold'
} as const;

/**
 * Mi Asistencia: lo que cada persona ve de sí misma.
 *
 * Las mismas horas y el mismo cálculo que ve RR.HH., que es lo que evita la
 * discusión de «a mí me sale otra cosa». Lo que NO ve es el juicio: aquí no
 * aparece si pierde el bono ni la comparación con nadie.
 *
 * Desde aquí se pide una justificación, con su certificado. La revisa la
 * supervisora y la aprueba RR.HH.; por eso el estado se dice en dos pasos y no
 * como un simple «pendiente».
 */
@Component({
  selector: 'app-mi-asistencia',
  standalone: true,
  // Engancha las tablas al estilo del módulo (styles.css, «MÓDULO DE ASISTENCIA - tablas»).
  host: { class: 'cashi-asistencia' },
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    /* La marca escrita a mano: el amarillo de la hoja, dicho con un punto. */
    .manual { position: relative; padding-right: 14px }
    .manual::after {
      content: ""; position: absolute; right: 0; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 999px; background: #d97706;
    }
    /* El sitio donde se suelta el certificado. */
    .zona-archivo {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 20px; border: 1.5px dashed #8491a3; border-radius: 10px;
      color: #5f6c80; font-size: 12.5px; text-align: center; cursor: pointer;
    }
    :host-context(.dark) .zona-archivo { border-color: #475569; color: #94a3b8 }

    /* Tarjetas de arriba: cada una con su dibujo en una banda del mismo alto. */
    .tarjeta { padding: 16px 18px; background: #fff; border: 1px solid #e6e9ee; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04) }
    .kpi { display: flex; flex-direction: column; container-type: inline-size }
    /* El tema claro de Cashi fuerza con !important el color de los títulos
       (styles.css, «All headings»): el rótulo lleva el suyo con !important. */
    .kpi h3 { margin: 0 0 2px; display: flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80 !important }
    .kpi h3 svg { flex: none; color: #8491a3 }
    .vacio-kpi svg { flex: none }
    .nota-panel { margin: 0; padding: 10px 12px; border-radius: 8px; background: #f4f6f9; font-size: 12px; line-height: 1.55; color: #5f6c80 }
    .pastilla { display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; white-space: nowrap }
    .p-ok { background: #e8f5ec; color: #166534 }
    .p-tarde { background: #fef6e0; color: #92400e }
    .p-falta { background: #fdecec; color: #b91c1c }
    .p-neutro { background: #f1f3f6; color: #5f6c80 }
    /* La casilla del navegador, no la verde global de Cashi: así es en la maqueta. */
    .casilla-dia { accent-color: auto; width: 13px; height: 13px; margin: 3px 3px 3px 4px; cursor: pointer }
    .casilla-dia:disabled { cursor: default }
    .kpi .cifra { font-size: 26px; font-weight: 800; letter-spacing: -.02em; font-variant-numeric: tabular-nums; line-height: 34px }
    .kpi .pie { margin: auto 0 0; font-size: 11.5px; color: #5f6c80 }
    .banda { display: flex; flex-direction: column; justify-content: center; height: 32px; margin: 8px 0 6px }
    .jornada { position: relative; height: 10px; border-radius: 999px; background: color-mix(in srgb, #0f172a 22%, #fff) }
    .jornada i { position: absolute; top: 0; height: 100%; min-width: 4px }
    .jornada .almuerzo { background: #10b981 }
    .jornada .break { background: #8b5cf6 }
    .rotulos { position: relative; height: 13px; margin-top: 5px; font-size: 10.5px; line-height: 13px }
    .rotulos span { position: absolute; transform: translateX(-50%); white-space: nowrap; font-weight: 600 }
    .rotulos .almuerzo { color: color-mix(in srgb, #10b981 70%, #0f172a) }
    .rotulos .break { color: color-mix(in srgb, #8b5cf6 70%, #0f172a) }
    @container (max-width: 230px) { .rotulos small { display: none } }
    .rotulos small { font-size: inherit }
    .tira-horas { display: flex; gap: 3px; --color: #f59e0b }
    .tira-horas.verde { --color: #16a34a }
    .tira-horas i { flex: 1; height: 12px; border-radius: 3px; background: #f1f3f6 }
    .tira-horas i.lleno { background: var(--color) }
    .tira-horas i.medio { background: color-mix(in srgb, var(--color) 45%, #f1f3f6) }
    .dias-kpi { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px }
    .dias-kpi span { display: flex; align-items: center; justify-content: center; height: 28px; border-radius: 6px; font-size: 11px; font-weight: 700; background: #f1f3f6; color: #5f6c80 }
    .dias-kpi .ok { background: #e8f5ec; color: #166534 }
    .dias-kpi .incomp { background: #fef6e0; color: #92400e; box-shadow: inset 0 0 0 1px #f59e0b }
    .dias-kpi .falta { background: #fdecec; color: #b91c1c }
    .pasos { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) }
    .pasos li { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; font-size: 10.5px; line-height: 13px; color: #5f6c80 !important }
    .pasos li::before { content: ""; position: absolute; top: 5px; right: 50%; width: 100%; height: 2px; background: #e6e9ee }
    .pasos li:first-child::before { display: none }
    .pasos i { position: relative; z-index: 1; width: 12px; height: 12px; border-radius: 999px; background: #fff; box-shadow: inset 0 0 0 2px #8491a3 }
    .pasos .hecho::before, .pasos .actual::before { background: #16a34a }
    .pasos .hecho i { background: #16a34a; box-shadow: none }
    .pasos .actual i { background: #f59e0b; box-shadow: 0 0 0 3px color-mix(in srgb, #f59e0b 25%, transparent) }
    .pasos .actual { color: #92400e !important; font-weight: 700 }
    .vacio-kpi { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 12.5px; font-weight: 600; color: #166534 }
    .lista-limpia { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column }
    .lista-limpia li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 0; border-bottom: 1px solid #f1f3f6 }
    .lista-limpia li:last-child { border-bottom: 0 }
    .lista-limpia li.hueco { visibility: hidden }
    .lista-recupera li { display: grid; grid-template-columns: 140px 1fr auto; gap: 10px; font-size: 13px }
    .marca-celda { display: flex; flex-direction: column; line-height: 1.3 }
    .marca-celda small { font-size: 10.5px; color: #8491a3 }
    :host-context(.dark) .tarjeta { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .nota-panel { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .p-ok { background: #052e16; color: #86efac }
    :host-context(.dark) .p-tarde { background: #451a03; color: #fcd34d }
    :host-context(.dark) .p-falta { background: #450a0a; color: #fca5a5 }
    :host-context(.dark) .p-neutro { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .kpi .pie { color: #94a3b8 }
    :host-context(.dark) .kpi h3, :host-context(.dark) .pasos li { color: #94a3b8 !important }
    :host-context(.dark) .jornada { background: color-mix(in srgb, #f1f5f9 22%, #0f172a) }
    :host-context(.dark) .tira-horas i, :host-context(.dark) .dias-kpi span { background: #1e293b }
    :host-context(.dark) .dias-kpi .ok { background: #052e16; color: #86efac }
    :host-context(.dark) .dias-kpi .incomp { background: #451a03; color: #fcd34d }
    :host-context(.dark) .dias-kpi .falta { background: #450a0a; color: #fca5a5 }
    :host-context(.dark) .pasos i { background: #0f172a }
    :host-context(.dark) .pasos .actual { color: #fcd34d !important }
    :host-context(.dark) .lista-limpia li { border-color: #1e293b }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <div class="border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Mi Asistencia</h1>
            @if (nombre()) {
              <span class="inline-flex h-7 items-center rounded-full border border-[#e6e9ee] bg-[#f4f6f9] px-3 text-[13.5px] font-semibold text-[#334155] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {{ nombre() }}
              </span>
            }
          </div>
          <button type="button" [class]="estilos.botonPrimario" (click)="abrirSolicitud()">
            <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
            Registrar solicitud
          </button>
        </div>
      </div>

      <!-- La semana que se está viendo -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e9ee] bg-white px-7 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-2">
          <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(-1)" aria-label="Semana anterior">
            <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
          </button>
          <strong class="min-w-[180px] text-center text-[13.5px]">{{ rangoTexto() }}</strong>
          <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(1)"
                  [disabled]="esSemanaActual()" aria-label="Semana siguiente">
            <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
          </button>
          <button type="button" class="inline-flex h-[32px] items-center rounded-lg border border-[#8491a3] bg-white px-3.5 text-[12.5px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200"
                  (click)="irAEstaSemana()">Esta semana</button>
        </div>
        <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ actualizado() }}</p>
      </div>

      <div class="px-7 pb-12 pt-5">
        <!-- El plazo del cierre: a la vista, no escondido en el formulario -->
        <div class="mb-4 flex items-start gap-2.5 rounded-xl border border-[#fbd391] bg-[#fef6e0] px-4 py-3 text-[12.5px] leading-normal text-[#92400e] dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
             role="note">
          <svg class="mt-px shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
          <p class="!m-0"><strong class="font-extrabold">{{ aviso.titulo }}:</strong> {{ aviso.texto }}@if (aviso.fecha) {<strong class="font-extrabold">{{ aviso.fecha }}</strong>}{{ aviso.resto }}</p>
        </div>
        @if (cargando()) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando tus horas…</p>
        } @else {
          <div class="aparecer">

            <div class="mb-4 grid gap-4 min-[980px]:grid-cols-4">
              <!-- Mi horario: la jornada, con el almuerzo y el break en su sitio. -->
              <div class="tarjeta kpi">
                <h3><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>Mi horario</h3>
                <div class="cifra !text-[19px]">{{ horarioTexto() }}</div>
                <div class="banda">
                  @if (jornada(); as j) {
                    <div class="jornada" role="img" [attr.aria-label]="'Jornada de ' + horarioTexto()">
                      @for (p of j.pausas; track p.clase) {
                        <i [class]="p.clase" [style.left.%]="p.izquierda" [style.width.%]="p.ancho" [title]="p.titulo"></i>
                      }
                    </div>
                    <div class="rotulos" aria-hidden="true">
                      @for (p of j.pausas; track p.clase) {
                        <span [class]="p.clase" [style.left.%]="p.centro">{{ p.nombre }}<small> {{ p.hora }}</small></span>
                      }
                    </div>
                  }
                </div>
                <p class="pie">{{ horarioNota() }}</p>
              </div>

              <!-- Horas de la semana: diez tramos, cada uno un 10 % de lo previsto. -->
              <div class="tarjeta kpi">
                <h3><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><rect x="5" y="11" width="3.5" height="6" rx="1"/><rect x="10.2" y="7" width="3.5" height="10" rx="1"/><rect x="15.4" y="4" width="3.5" height="13" rx="1"/></svg>Horas de la semana</h3>
                <div class="cifra">{{ enHoras(minutosTrabajados()) }}</div>
                <div class="banda">
                  <div class="tira-horas" [class.verde]="avance() >= 100" role="img"
                       [attr.aria-label]="enHoras(minutosTrabajados()) + ' de ' + enHoras(minutosJornada())"
                       [title]="piso(avance()) + ' % de ' + enHoras(minutosJornada())">
                    @for (i of DIEZ; track i) {
                      <i [class.lleno]="avance() >= (i + 1) * 10" [class.medio]="avance() < (i + 1) * 10 && avance() > i * 10"></i>
                    }
                  </div>
                </div>
                <p class="pie">De {{ enHoras(minutosJornada()) }} previstas</p>
              </div>

              <!-- Días registrados: de lunes a sábado, en verde los completos. -->
              <div class="tarjeta kpi">
                <h3><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/><path d="m9 14.5 2 2 4-4"/></svg>Días registrados</h3>
                <div class="cifra">{{ diasCompletos() }} de {{ diasCompletos() + diasIncompletos().length }}</div>
                <div class="banda">
                  <div class="dias-kpi" [style.grid-template-columns]="'repeat(' + celdasSemana().length + ', minmax(0, 1fr))'"
                       role="img" aria-label="Días de la semana; en verde los que tienen todas sus marcaciones">
                    @for (c of celdasSemana(); track c.fecha) {
                      <span [class]="c.clase" [title]="c.titulo">{{ c.letra }}</span>
                    }
                  </div>
                </div>
                <p class="pie">
                  {{ diasIncompletos().length ? diasIncompletos().length + (diasIncompletos().length === 1 ? ' día' : ' días') + ' con marcaciones pendientes' : 'Sin marcaciones pendientes' }}
                </p>
              </div>

              <!-- Solicitudes abiertas: en qué paso va la primera. -->
              <div class="tarjeta kpi">
                <h3><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>Solicitudes abiertas</h3>
                <div class="cifra">{{ abiertas().length }}</div>
                <div class="banda">
                  @if (abiertas()[0]; as primera) {
                    <ol class="pasos" [attr.aria-label]="primera.tipo + ' del ' + corta(primera.fechaDesde) + ': ' + (primera.estado === 'REVISADA' ? 'la aprueba RR.HH.' : 'la revisa tu supervisora')">
                      @for (paso of PASOS; track paso; let i = $index) {
                        <li [class.hecho]="i < pasoActual()" [class.actual]="i === pasoActual()"><i></i>{{ paso }}</li>
                      }
                    </ol>
                  } @else {
                    <p class="vacio-kpi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg><span>Nada por resolver</span></p>
                  }
                </div>
                <p class="pie">{{ textoAbiertas() }}</p>
              </div>
            </div>

            <!-- Tus recuperaciones: lo que RR.HH. confirmó, día por día. -->
            @if (misBloques().length) {
              <div class="tarjeta mb-4">
                <h2 class="!mb-1 !mt-0 text-[15px] font-extrabold">Tus recuperaciones</h2>
                <p class="!mb-2.5 !mt-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ textoRecuperaciones() }}</p>
                <ul class="lista-limpia lista-recupera">
                  @for (b of misBloques(); track b.fecha) {
                    <li>
                      <span>{{ diaLargo(b.fecha) }}</span>
                      <strong>Sales a las {{ enHoras(minutosDe(b.salida) + b.minutos) }}</strong>
                      <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">+{{ duracion(b.minutos) }}</span>
                    </li>
                  }
                </ul>
              </div>
            }

            <div class="grid gap-4 sm:grid-cols-[1fr_1fr]">

              <div class="flex flex-col">
                <h2 [class]="estilos.titulo">Mis marcaciones</h2>
                <div class="flex flex-1 flex-col overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                  <table class="h-full w-full flex-1 border-collapse">
                    <caption class="sr-only">Mis marcaciones de la semana</caption>
                    <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                      <tr>
                        <th scope="col" [class]="estilos.th">Fecha</th>
                        <th scope="col" [class]="estilos.th">Entrada</th>
                        <th scope="col" [class]="estilos.th">Almuerzo</th>
                        <th scope="col" [class]="estilos.th">Break</th>
                        <th scope="col" [class]="estilos.th">Salida</th>
                        <th scope="col" [class]="estilos.th">Horas trabajadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (dia of diasTabla(); track dia.fecha) {
                        <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800">
                          <td [class]="estilos.td">
                            <strong>{{ dia.nombreDia.slice(0, 3) }}</strong>
                            <span class="ml-[5px] text-[#8491a3] dark:text-slate-500">{{ corta(dia.fecha) }}</span>
                          </td>
                          <td [class]="estilos.td">
                            @if (dia.entrada) {
                              <div class="marca-celda"><span>{{ hhmm(dia.entrada) }}</span><small>previsto {{ dia.horaEntradaHorario ? hhmm(dia.horaEntradaHorario) : '—' }}</small></div>
                            } @else { <span class="text-[#8491a3]">—</span> }
                          </td>
                          <td [class]="estilos.td">
                            @if (dia.almuerzoInicio) {
                              <div class="marca-celda"><span>{{ hhmm(dia.almuerzoInicio) }}</span><small>{{ duracionPausa(dia.almuerzoInicio, dia.almuerzoFin) }}</small></div>
                            } @else { <span class="text-[#8491a3]">—</span> }
                          </td>
                          <td [class]="estilos.td">
                            @if (dia.breakInicio) {
                              <div class="marca-celda"><span>{{ hhmm(dia.breakInicio) }}</span><small>{{ duracionPausa(dia.breakInicio, dia.breakFin) }}</small></div>
                            } @else { <span class="text-[#8491a3]">—</span> }
                          </td>
                          <td [class]="estilos.td">
                            @if (dia.salida) {
                              <div class="marca-celda"><span>{{ hhmm(dia.salida) }}</span><small>previsto {{ dia.horaSalidaHorario ? hhmm(dia.horaSalidaHorario) : '—' }}</small></div>
                            } @else { <span class="text-[#8491a3]">—</span> }
                          </td>
                          <td [class]="estilos.td + ' font-bold'">
                            @if (dia.horasTrabajadas) { {{ dia.horasTrabajadas }} } @else { <span class="text-[#8491a3]">—</span> }
                          </td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="6" class="secundario !px-3 !py-10 text-center !text-[12.5px]">
                            Sin marcaciones en esta semana
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="flex flex-col">
                <h2 [class]="estilos.titulo">Mis solicitudes</h2>
                <div class="tarjeta flex flex-1 flex-col">
                  <ul class="lista-limpia flex-1">
                    @for (s of paginaSolicitudes(); track s.id) {
                      <li>
                        <span class="min-w-0 text-[13px]">
                          {{ s.tipo }} · {{ diasTexto(s) }}<br>
                          <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ pieSolicitud(s) }}</span>
                        </span>
                        <span class="shrink-0 rounded-full px-[9px] py-0.5 text-[11.5px] font-bold" [class]="estadoDe(s).clase">
                          {{ estadoDe(s).texto }}
                        </span>
                      </li>
                    } @empty {
                      <li class="!justify-center text-[13px] !text-[#5f6c80] dark:!text-slate-400">Todavía no has pedido ninguna</li>
                    }
                    @for (h of huecos(); track $index) {
                      <li class="hueco" aria-hidden="true"><span class="text-[13px]">&nbsp;<br><span class="text-[11.5px]">&nbsp;</span></span></li>
                    }
                  </ul>
                  @if (solicitudes().length > porPagina) {
                    <div class="mt-1 flex items-center justify-between gap-3 border-t border-[#f1f3f6] px-0.5 pt-3 dark:border-slate-800">
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
          </div>
        }
      </div>

      <!-- Registrar solicitud -->
      @if (formulario()) {
        <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarSolicitud()"></div>
        <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="pointer-events-auto flex max-h-[min(88vh,760px)] w-[min(100%,520px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
               role="dialog" aria-modal="true" aria-labelledby="titulo-solicitud">
            <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
              <div>
                <h2 id="titulo-solicitud" class="!m-0 text-[15px] font-extrabold">Registrar solicitud</h2>
                <p class="!mb-0 !mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  La revisa tu supervisora y la aprueba RR.HH.
                </p>
              </div>
              <button type="button" [class]="estilos.botonIcono" (click)="cerrarSolicitud()" aria-label="Cerrar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </header>

            <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="j-tipo">Tipo</label>
                <select id="j-tipo" [class]="estilos.campo"
                        [ngModel]="nuevo.idTipoDia" (ngModelChange)="elegirTipo($event)">
                  @for (t of tipos(); track t.id) {
                    <option [ngValue]="t.id">{{ t.nombre }}</option>
                  }
                </select>
              </div>

              <div class="flex gap-3">
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="j-desde">{{ esRecuperacion() ? 'Recupera desde' : 'Desde' }}</label>
                  <input id="j-desde" type="date" [class]="estilos.campo" [attr.min]="primerDia()"
                         [ngModel]="nuevo.fechaDesde" (ngModelChange)="nuevo.fechaDesde = $event; cargarRango()">
                </div>
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="j-hasta">Hasta</label>
                  <input id="j-hasta" type="date" [class]="estilos.campo"
                         [ngModel]="nuevo.fechaHasta" (ngModelChange)="nuevo.fechaHasta = $event; cargarRango()">
                </div>
              </div>

              @if (esRecuperacion()) {
                <div>
                  <div class="flex gap-3">
                    <div class="flex flex-1 flex-col gap-1.5">
                      <label [class]="estilos.etiqueta" for="j-origen">Recupera lo del</label>
                      <input id="j-origen" type="date" [class]="estilos.campo" [max]="hoy()"
                             [(ngModel)]="nuevo.fechaOrigen">
                    </div>
                    <div class="flex flex-1 flex-col gap-1.5">
                      <label [class]="estilos.etiqueta" for="j-minutos">Minutos extra por día</label>
                      <input id="j-minutos" type="number" min="5" max="60" step="5" [class]="estilos.campo"
                             [(ngModel)]="nuevo.minutosExtra">
                    </div>
                  </div>
                  <p class="!mb-0 !mt-2 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                    Esos días sales más tarde, sin pasar de las 20:00. La tardanza igual cuenta para el límite.
                  </p>
                </div>
              }

              <p class="nota-panel">Sirve para días pasados y para días futuros.</p>

              <!-- Los días del rango con lo que hoy figura: el trabajado se ve pero no se marca. -->
              <div class="flex flex-col gap-1.5">
                <span class="text-[13px]">Días que cubre</span>
                <div class="tarjeta !px-3.5 !py-2.5">
                  <ul class="lista-limpia">
                    @if (diasQueCubre(); as filas) {
                      @for (f of filas; track f.fecha) {
                        <li>
                          <label class="flex items-center gap-[9px] text-[13px]" [style.opacity]="f.marcable ? null : .55">
                            <input type="checkbox" class="casilla-dia" [disabled]="!f.marcable"
                                   [checked]="f.marcable && !desmarcados().has(f.fecha)" (change)="alternarDia(f.fecha)">
                            <span>{{ f.etiqueta }}</span>
                          </label>
                          <span [class]="'pastilla ' + f.clase">{{ f.texto }}</span>
                        </li>
                      } @empty {
                        <li class="!justify-center text-[13px] !text-[#5f6c80] dark:!text-slate-400">Ese rango no tiene días laborables</li>
                      }
                    } @else {
                      <li class="!justify-center text-[13px] !text-[#b91c1c] dark:!text-red-300">La fecha de fin no puede ser anterior a la de inicio</li>
                    }
                  </ul>
                </div>
              </div>

              @if (!esRecuperacion()) {
                <div class="flex flex-col gap-1.5">
                  <span class="text-[13px]">Certificado</span>
                  <label class="zona-archivo" for="j-archivo">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    <strong class="text-[13px] !text-[#0f172a] dark:!text-slate-100">{{ archivo()?.name ?? 'Adjuntar certificado' }}</strong>
                    <span>Foto o PDF, hasta 10 MB. {{ textoCertificado() }}</span>
                  </label>
                  <input id="j-archivo" type="file" class="sr-only"
                         accept="image/jpeg,image/png,image/webp,application/pdf"
                         (change)="elegirArchivo($event)">
                </div>
              }

              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="j-comentario">Comentario</label>
                <textarea id="j-comentario" maxlength="500"
                          class="min-h-[74px] w-full resize-y rounded-lg border !border-[#8491a3] !bg-white px-[11px] py-[9px] text-[13px] !text-[#0f172a] placeholder:!text-[#757575] focus:!border-[#2563eb] focus:outline-none dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100"
                          placeholder="Qué pasó, en una línea" aria-describedby="error-j"
                          [(ngModel)]="nuevo.comentario" (ngModelChange)="errorComentario.set(false)"></textarea>
                @if (errorComentario()) {
                  <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300" id="error-j">Escribe el motivo: es lo que va a leer tu supervisora</p>
                }
              </div>

              @if (error()) {
                <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
              }
            </div>

            <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrarSolicitud()">Cancelar</button>
              <button type="button" [class]="estilos.botonPrimario" (click)="enviar()" [disabled]="enviando()">
                {{ enviando() ? 'Enviando…' : 'Enviar a revisión' }}
              </button>
            </footer>
          </div>
        </div>
      }
    </div>
  `
})
export class MiAsistenciaComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADOS = ESTADOS;
  protected readonly ESTADO_SOLICITUD = ESTADO_SOLICITUD;
  /** Como lo ve el asesor: pendiente mientras espera a alguien; aprobada o rechazada al final. */
  protected readonly ESTADO_ASESOR: Record<string, { texto: string; clase: string }> = {
    PENDIENTE: { texto: 'Pendiente', clase: ESTADO_SOLICITUD['PENDIENTE'].clase },
    REVISADA: { texto: 'Por aprobar', clase: 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
    APROBADA: ESTADO_SOLICITUD['APROBADA'],
    RECHAZADA: ESTADO_SOLICITUD['RECHAZADA']
  };
  protected readonly porPagina = 4;
  protected readonly PASOS = ['Enviada', 'Supervisora', 'RR.HH.'];
  protected readonly DIEZ = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  protected readonly enHoras = enHoras;
  protected readonly minutosDe = minutosDe;

  readonly cargando = signal(false);
  readonly reporte = signal<AsistenciaReporte | null>(null);
  /** Cuándo se trajeron estas horas: sin esto no se sabe si están al día. */
  readonly cargadoEn = signal<Date | null>(null);
  readonly solicitudes = signal<Justificacion[]>([]);
  /** Su plan de recuperación de hoy en adelante y las pausas de su horario. */
  readonly miPlan = signal<MiPlan | null>(null);
  readonly tipos = signal<TipoDia[]>([]);
  readonly pagina = signal(0);

  readonly formulario = signal(false);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly archivo = signal<File | null>(null);
  readonly errorComentario = signal(false);

  /** El rango que se está pidiendo y lo que figura en cada día ya pasado (los futuros no están). */
  readonly rango = signal({ desde: '', hasta: '' });
  readonly diasConocidos = signal(new Map<string, AsistenciaDia>());
  /** Los días que la persona desmarcó: la solicitud no los cubre. */
  readonly desmarcados = signal(new Set<string>());

  /** El lunes de la semana que se está viendo. */
  readonly lunes = signal(this.lunesDe(new Date()));

  nuevo = {
    idTipoDia: null as number | null,
    fechaDesde: this.hoy(),
    fechaHasta: this.hoy(),
    comentario: '',
    fechaOrigen: this.hoy(),
    minutosExtra: null as number | null
  };

  protected readonly detalleRecuperacion = detalleRecuperacion;
  protected readonly aviso = avisoDeCierre('asesor');

  /** El nombre que ya trae la sesión: no hace falta pedirlo otra vez. */
  readonly nombre = computed(() => {
    const usuario = this.auth.getCurrentUser();
    if (!usuario) {
      return '';
    }
    return [usuario.firstName, usuario.lastName].filter(Boolean).join(' ') || usuario.username;
  });

  readonly dias = computed<AsistenciaDia[]>(() => this.reporte()?.dias ?? []);

  /** Lunes a viernes, y el sábado solo si trabajó: es opcional y sin marcas no dice nada. */
  readonly diasTabla = computed(() => this.dias().filter(d =>
    !([0, 6].includes(new Date(d.fecha + 'T00:00:00').getDay()) && !d.entrada)));

  readonly semana = computed(() => (this.reporte()?.semanas ?? [])[0] ?? null);

  readonly diasLaborables = computed(() =>
    this.dias().filter(d => d.estado !== 'NO_LABORABLE').length);

  /**
   * Días trabajados a los que les falta alguna marca. La falta no entra: no es
   * una marca pendiente, es un día sin trabajar (y trae sus marcas faltantes).
   */
  readonly diasIncompletos = computed(() => this.dias().filter(d => d.estado === 'INCOMPLETO'
    || ((d.estado === 'PUNTUAL' || d.estado === 'TARDE') && (d.marcasFaltantes ?? []).length > 0)));

  /** Días trabajados con todas sus marcas. */
  readonly diasCompletos = computed(() => this.dias().filter(d =>
    (d.estado === 'PUNTUAL' || d.estado === 'TARDE') && !(d.marcasFaltantes ?? []).length).length);

  /** Los días de lunes a viernes del rango, cada uno con lo que hoy figura; NULL si el rango está al revés. */
  readonly diasQueCubre = computed(() => {
    const { desde, hasta } = this.rango();
    if (!desde || !hasta || hasta < desde) {
      return null;
    }
    const conocidos = this.diasConocidos();
    const hoy = this.hoy();
    const filas: { fecha: string; etiqueta: string; texto: string; clase: string; marcable: boolean }[] = [];
    for (let f = desde; f <= hasta && filas.length < 31; f = this.sumarDias(f, 1)) {
      const diaSemana = new Date(f + 'T00:00:00').getDay();
      if (diaSemana === 0 || diaSemana === 6) {
        continue;  // sábado y domingo: no se espera a nadie, no hay nada que cubrir
      }
      const d = conocidos.get(f);
      // La tardanza sí se cubre: una cita médica a primera hora hace llegar tarde.
      const [texto, clase, marcable]: [string, string, boolean] = f > hoy ? ['Aún no llega', 'p-neutro', true]
        : !d || d.estado === 'FALTA' ? ['No trabajado', 'p-falta', true]
        : d.estado === 'TARDE' ? ['Llegó tarde', 'p-tarde', true]
        : d.estado === 'NO_LABORABLE' ? ['No laborable', 'p-neutro', false]
        : d.estado === 'JUSTIFICADO' ? [d.tipoDia ?? 'Justificado', 'p-neutro', false]
        : ['Trabajado', 'p-ok', false];
      filas.push({ fecha: f, etiqueta: `${DIAS_LARGOS[diaSemana]} ${this.corta(f)}`, texto, clase, marcable });
    }
    return filas;
  });

  readonly minutosTrabajados = computed(() => this.semana()?.minutosTrabajados ?? 0);
  readonly minutosJornada = computed(() => this.semana()?.minutosJornada ?? 0);

  /** Las que siguen su camino. Una que la semana cerró sin revisar ya no se mueve. */
  readonly abiertas = computed(() =>
    this.solicitudes().filter(s => (s.estado === 'PENDIENTE' && !s.semanaCerrada) || s.estado === 'REVISADA'));

  readonly paginaSolicitudes = computed(() =>
    this.solicitudes().slice(this.pagina() * this.porPagina, (this.pagina() + 1) * this.porPagina));

  readonly hayMas = computed(() =>
    (this.pagina() + 1) * this.porPagina < this.solicitudes().length);

  /** Método y no computed: `nuevo` es un objeto del formulario, no una signal, y el computed no se enteraba del cambio. */
  tipoElegido(): TipoDia | null {
    return this.tipos().find(t => t.id === this.nuevo.idTipoDia) ?? null;
  }

  primerDia(): string | null {
    return primerDiaPermitido(this.tipoElegido());
  }

  esRecuperacion(): boolean {
    return this.tipoElegido()?.codigo === RECUPERACION;
  }

  /** «7 – 11 de septiembre» o «31 de agosto – 4 de septiembre»: de lunes a viernes. */
  readonly rangoTexto = computed(() => {
    const inicio = new Date(this.lunes() + 'T00:00:00');
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 4);
    const mes = (f: Date) => MESES[f.getMonth()];
    return inicio.getMonth() === fin.getMonth()
      ? `${inicio.getDate()} – ${fin.getDate()} de ${mes(fin)}`
      : `${inicio.getDate()} de ${mes(inicio)} – ${fin.getDate()} de ${mes(fin)}`;
  });

  readonly esSemanaActual = computed(() => this.lunes() === this.lunesDe(new Date()));

  readonly actualizado = computed(() => {
    const cuando = this.cargadoEn();
    return cuando
      ? `Actualizado a las ${cuando.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`
      : '';
  });

  /** El horario que más se repite en la semana: es el que la persona reconoce como «el suyo». */
  private readonly horarioComun = computed(() => {
    const cuenta = new Map<string, number>();
    for (const d of this.dias()) {
      if (d.horaEntradaHorario && d.horaSalidaHorario) {
        const clave = `${this.hhmm(d.horaEntradaHorario)}|${this.hhmm(d.horaSalidaHorario)}`;
        cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1);
      }
    }
    const [clave] = [...cuenta.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
    if (!clave) {
      return null;
    }
    const [entrada, salida] = clave.split('|');
    return { entrada, salida };
  });

  readonly horarioTexto = computed(() => {
    const h = this.horarioComun();
    return h ? `${h.entrada} – ${h.salida}` : '—';
  });

  /** La jornada común con el almuerzo y el break en su sitio, para la barra de «Mi horario». */
  readonly jornada = computed(() => {
    const h = this.horarioComun();
    const p = this.miPlan();
    if (!h) {
      return null;
    }
    const ini = minutosDe(h.entrada);
    const fin = minutosDe(h.salida);
    const pos = (m: number) => ((m - ini) / (fin - ini)) * 100;
    const pausas = [] as { clase: string; nombre: string; hora: string; izquierda: number; ancho: number; centro: number; titulo: string }[];
    for (const [clase, nombre, hora, minutos] of [
      ['almuerzo', 'Almuerzo', p?.horaAlmuerzo, p?.minutosAlmuerzo],
      ['break', 'Break', p?.horaBreak, p?.minutosBreak]
    ] as [string, string, string | null | undefined, number | null | undefined][]) {
      if (!hora || !minutos) {
        continue;
      }
      const a = minutosDe(hora);
      if (a < ini || a + minutos > fin) {
        continue;
      }
      pausas.push({ clase, nombre, hora: this.hhmm(hora), izquierda: pos(a), ancho: pos(a + minutos) - pos(a),
                    centro: (pos(a) + pos(a + minutos)) / 2, titulo: `${nombre} de ${this.hhmm(hora)} a ${enHoras(a + minutos)}` });
    }
    return { pausas };
  });

  /** Cuánto de lo previsto lleva, en porcentaje: diez tramos de 10 %. */
  readonly avance = computed(() => {
    const previsto = this.minutosJornada();
    return previsto ? (this.minutosTrabajados() / previsto) * 100 : 0;
  });

  protected readonly piso = Math.floor;

  /**
   * De lunes a viernes: verde completo, ámbar con marcaciones pendientes, rojo
   * falta, gris sin trabajo. El sábado solo si lo trabajó, lo tenía en su
   * horario o le toca recuperar ese día; el domingo nunca.
   */
  private readonly conSabado = computed(() => {
    const sabado = this.sumarDias(this.lunes(), 5);
    const d = this.dias().find(x => x.fecha === sabado);
    return !!d?.entrada || (!!d && d.estado !== 'NO_LABORABLE')
      || (this.miPlan()?.bloques ?? []).some(b => b.fecha === sabado);
  });
  readonly celdasSemana = computed(() => (this.conSabado() ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4]).map(i => {
    const fecha = this.sumarDias(this.lunes(), i);
    const d = this.dias().find(x => x.fecha === fecha);
    const nombre = DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()];
    const [clase, estado] = !d || d.estado === 'NO_LABORABLE' ? ['', i === 5 ? 'sin trabajo, es opcional' : 'sin trabajo']
      : d.estado === 'FALTA' ? ['falta', 'falta']
      : (d.marcasFaltantes ?? []).length ? ['incomp', 'marcaciones pendientes']
      : d.estado === 'JUSTIFICADO' ? ['', d.tipoDia ?? 'justificado'] : ['ok', 'completo'];
    return { fecha, letra: nombre[0], clase, titulo: `${nombre.slice(0, 3)} ${this.corta(fecha)}: ${estado}` };
  }));

  /** En qué paso va la primera solicitud abierta: revisa la supervisora (1) o aprueba RR.HH. (2). */
  readonly pasoActual = computed(() => (this.abiertas()[0]?.estado === 'REVISADA' ? 2 : 1));

  /** Sus recuperaciones confirmadas de hoy en adelante. */
  readonly misBloques = computed(() => (this.miPlan()?.bloques ?? []).filter(b => b.confirmado)
    .sort((a, b) => a.fecha.localeCompare(b.fecha)));

  /** «2 h del permiso del 15/09 · confirmadas por RR.HH.». */
  readonly textoRecuperaciones = computed(() => {
    const total = this.misBloques().reduce((t, b) => t + b.minutos, 0);
    const origen = this.miPlan()?.origen;
    return `${this.duracion(total)}${origen ? ' del ' + origen.charAt(0).toLowerCase() + origen.slice(1) : ''} · confirmadas por RR.HH.`;
  });

  /**
   * Huecos invisibles: la lista siempre ocupa lo de cuatro solicitudes, así la
   * tarjeta no encoge ni arrastra a la tabla de al lado.
   */
  readonly huecos = computed(() => {
    const n = this.paginaSolicitudes().length;
    return Array.from({ length: n ? this.porPagina - n : this.porPagina - 1 });
  });

  /** El día que se sale de lo común, dicho: «Lunes hasta las 19:00». */
  readonly horarioNota = computed(() => {
    const h = this.horarioComun();
    const raro = this.dias().find(d => h && d.horaSalidaHorario && this.hhmm(d.horaSalidaHorario) !== h.salida);
    return raro ? `${raro.nombreDia} hasta las ${this.hhmm(raro.horaSalidaHorario!)}` : 'Según tu subcartera';
  });

  ngOnInit(): void {
    this.servicio.tiposDeDia().subscribe({
      next: t => {
        const deAusencia = t.filter(x => !TIPOS_DE_CALENDARIO.includes(x.codigo));
        this.tipos.set(deAusencia);
        this.nuevo.idTipoDia = deAusencia[0]?.id ?? null;
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de solicitud')
    });
    this.cargar();
    this.cargarSolicitudes();
    this.cargarRecuperaciones();

  }

  /** Su plan de recuperación y las pausas de su horario. */
  private cargarRecuperaciones(): void {
    this.servicio.miPlan().subscribe({
      next: p => this.miPlan.set(p),
      error: () => { /* si falla, la pantalla sigue sirviendo sin la barra ni las recuperaciones */ }
    });
  }

  cargar(): void {
    this.cargando.set(true);
    const fin = this.sumarDias(this.lunes(), 5);
    this.servicio.reporteMio(this.lunes(), fin).subscribe({
      next: r => {
        this.reporte.set(r);
        this.cargadoEn.set(new Date());
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudieron cargar tus horas');
        this.cargando.set(false);
      }
    });
  }

  private cargarSolicitudes(): void {
    this.servicio.misJustificaciones().subscribe({
      next: s => this.solicitudes.set(s),
      error: () => this.toast.error('No se pudieron cargar tus solicitudes')
    });
  }

  moverSemana(paso: number): void {
    this.lunes.set(this.sumarDias(this.lunes(), paso * 7));
    this.cargar();
  }

  irAEstaSemana(): void {
    this.lunes.set(this.lunesDe(new Date()));
    this.cargar();
  }

  // ==================== SOLICITUD ====================

  abrirSolicitud(): void {
    this.formulario.set(true);
    this.error.set('');
    this.errorComentario.set(false);
    this.archivo.set(null);
    this.nuevo = {
      idTipoDia: this.tipos()[0]?.id ?? null,
      fechaDesde: this.hoy(),
      fechaHasta: this.hoy(),
      comentario: '',
      fechaOrigen: this.hoy(),
      minutosExtra: null
    };
    // Lo de la semana a la vista ya está: se usa mientras llega lo del rango.
    this.diasConocidos.set(new Map(this.dias().map(d => [d.fecha, d])));
    this.cargarRango();
  }

  /**
   * Trae lo que figura en los días ya pasados del rango. Lo que se trae se
   * guarda: al mover las fechas no se vuelve a pedir lo mismo.
   */
  cargarRango(): void {
    const { fechaDesde: desde, fechaHasta: hasta } = this.nuevo;
    this.rango.set({ desde, hasta });
    this.desmarcados.set(new Set());
    if (!desde || !hasta || hasta < desde) {
      return;
    }
    // Hasta hoy (lo futuro no tiene nada) y a lo sumo seis semanas: la lista enseña 31 días.
    const tope = [hasta, this.hoy(), this.sumarDias(desde, 45)].sort()[0];
    if (desde > tope) {
      return;
    }
    this.servicio.reporteMio(desde, tope).subscribe({
      next: r => this.diasConocidos.update(m => new Map([...m, ...(r.dias ?? []).map(d => [d.fecha, d] as const)])),
      error: () => { /* sin lo del rango, la lista enseña los días con lo que ya se sabía */ }
    });
  }

  alternarDia(fecha: string): void {
    this.desmarcados.update(s => {
      const copia = new Set(s);
      copia.has(fecha) ? copia.delete(fecha) : copia.add(fecha);
      return copia;
    });
    this.error.set('');
  }

  /**
   * Los tramos seguidos de días marcados. Uno desmarcado en medio parte la
   * solicitud en dos; lo trabajado o no laborable no corta, porque en esos
   * días la solicitud no cambia nada.
   */
  private tramos(): { desde: string; hasta: string }[] {
    const tramos: { desde: string; hasta: string }[] = [];
    let actual: { desde: string; hasta: string } | null = null;
    for (const f of this.diasQueCubre() ?? []) {
      if (!f.marcable) {
        continue;
      }
      if (this.desmarcados().has(f.fecha)) {
        actual = null;
      } else if (actual) {
        actual.hasta = f.fecha;
      } else {
        actual = { desde: f.fecha, hasta: f.fecha };
        tramos.push(actual);
      }
    }
    return tramos;
  }

  /** «Obligatorio en descanso médico.»: los tipos que piden certificado, dichos por su nombre. */
  textoCertificado(): string {
    const nombres = this.tipos().filter(t => t.exigeCertificado).map(t => t.nombre.toLowerCase());
    if (!nombres.length) {
      return 'Opcional.';
    }
    const lista = nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
    return `Obligatorio en ${lista}.`;
  }

  cerrarSolicitud(): void {
    this.formulario.set(false);
  }

  elegirTipo(id: number): void {
    this.nuevo.idTipoDia = id;
    this.error.set('');
  }

  elegirArchivo(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    this.archivo.set(entrada.files?.[0] ?? null);
    this.error.set('');
  }

  enviar(): void {
    if (!this.nuevo.idTipoDia) {
      this.error.set('Elige el tipo');
      return;
    }
    if (this.nuevo.fechaHasta < this.nuevo.fechaDesde) {
      this.error.set('La fecha final no puede ser anterior a la inicial');
      return;
    }
    const tramos = this.tramos();
    if (!tramos.length) {
      this.error.set('Marca al menos un día');
      return;
    }
    const primerDia = this.primerDia();
    if (primerDia && tramos[0].desde < primerDia) {
      this.error.set(avisoAnticipacion(this.tipoElegido()!));
      return;
    }
    const recupera = this.esRecuperacion();
    const errorRecuperacion = recupera ? errorDeRecuperacion({ ...this.nuevo, fechaDesde: tramos[0].desde }) : null;
    if (errorRecuperacion) {
      this.error.set(errorRecuperacion);
      return;
    }
    if (this.tipoElegido()?.exigeCertificado && !this.archivo()) {
      this.error.set(`${this.tipoElegido()!.nombre} necesita certificado adjunto`);
      return;
    }
    if (!this.nuevo.comentario.trim()) {
      this.errorComentario.set(true);
      document.getElementById('j-comentario')?.focus();
      return;
    }

    this.error.set('');
    this.enviando.set(true);
    const idTipoDia = this.nuevo.idTipoDia;
    from(tramos).pipe(
      concatMap(tramo => this.servicio.crearJustificacion({
        idTipoDia,
        fechaDesde: tramo.desde,
        fechaHasta: tramo.hasta,
        comentario: this.nuevo.comentario.trim(),
        archivo: recupera ? null : this.archivo(),
        minutosExtra: recupera ? Number(this.nuevo.minutosExtra) : null,
        fechaOrigen: recupera ? this.nuevo.fechaOrigen : null
      })),
      toArray()
    ).subscribe({
      next: hechas => {
        this.enviando.set(false);
        this.cerrarSolicitud();
        this.toast.success(hechas.length === 1
          ? 'Solicitud enviada. La revisará tu supervisora'
          : `${hechas.length} solicitudes enviadas. Las revisará tu supervisora`);
        this.cargarSolicitudes();
      },
      error: respuesta => {
        this.enviando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo enviar la solicitud');
        // Si alguna llegó a guardarse, que se vea en la lista.
        this.cargarSolicitudes();
      }
    });
  }

  /** Abre el certificado en otra pestaña; no se descarga sin pedirlo. */
  verCertificado(s: Justificacion): void {
    abrirArchivo(this.servicio.certificado(s.id, s.archivoNombre), s.archivoNombre,
      () => this.toast.error('No se pudo abrir el certificado'));
  }

  // ==================== PRESENTACIÓN ====================

  /** «14 min»: lo que duró una pausa; «sin cerrar» si falta la vuelta. */
  duracionPausa(inicio: string | null, fin: string | null): string {
    if (!inicio || !fin) {
      return 'sin cerrar';
    }
    return `${minutosDe(fin) - minutosDe(inicio)} min`;
  }

  textoAbiertas(): string {
    const abiertas = this.abiertas();
    if (!abiertas.length) {
      return 'Todas resueltas';
    }
    const primera = abiertas[0];
    return `${primera.tipo} del ${this.corta(primera.fechaDesde)}${abiertas.length > 1 ? ` y ${abiertas.length - 1} más` : ''}`;
  }

  /** «18/09» o «12/08 al 14/08». */
  diasTexto(s: Justificacion): string {
    return s.fechaHasta && s.fechaHasta !== s.fechaDesde
      ? `${this.corta(s.fechaDesde)} al ${this.corta(s.fechaHasta)}` : this.corta(s.fechaDesde);
  }

  /**
   * La pastilla de cada solicitud. Una que la supervisora no revisó antes del
   * cierre de su semana sale «Sin revisar», en gris: ya no va a cambiar.
   */
  estadoDe(s: Justificacion): { texto: string; clase: string } {
    return s.estado === 'PENDIENTE' && s.semanaCerrada
      ? { texto: 'Sin revisar', clase: this.ESTADO_ASESOR['REVISADA'].clase }
      : this.ESTADO_ASESOR[s.estado];
  }

  /** Lo que dice cada solicitud debajo: dónde está o cómo terminó. */
  pieSolicitud(s: Justificacion): string {
    const enviada = s.solicitadaEn ? this.corta(s.solicitadaEn.slice(0, 10)) : '—';
    if (s.estado === 'PENDIENTE' && s.semanaCerrada) {
      return `Enviada el ${enviada}; la semana se cerró sin revisarla`;
    }
    switch (s.estado) {
      case 'PENDIENTE': return `Enviada el ${enviada}, esperando revisión`;
      case 'REVISADA': return `Revisada el ${s.revisadaEn ? this.corta(s.revisadaEn.slice(0, 10)) : '—'}, esperando a RR.HH.`;
      case 'APROBADA': return `Aprobada el ${s.resueltaEn ? this.corta(s.resueltaEn.slice(0, 10)) : '—'}`;
      default: return s.motivoResolucion ? `Rechazada: ${s.motivoResolucion}` : 'Rechazada';
    }
  }

  /** «Lunes 28/09». */
  diaLargo(fecha: string): string {
    return `${DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()]} ${this.corta(fecha)}`;
  }

  /** «1 h 05», «30 min». */
  duracion(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h && m ? `${h} h ${String(m).padStart(2, '0')}` : h ? `${h} h` : `${m} min`;
  }

  textoPagina(): string {
    const desde = this.pagina() * this.porPagina + 1;
    const hasta = Math.min(desde + this.porPagina - 1, this.solicitudes().length);
    return `${desde}–${hasta} de ${this.solicitudes().length}`;
  }

  duracionCorta(minutos: number): string {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h && m ? `${h} h ${m}` : h ? `${h} h` : `${m}`;
  }

  unidadDe(minutos: number): string {
    return minutos >= 60 && minutos % 60 === 0 ? '' : 'min';
  }

  // ==================== APOYO ====================

  protected hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  protected corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  /** Fechas locales: con toISOString, en Lima, desde las 19:00 ya es el día siguiente. */
  protected hoy(): string {
    return hoyLocal();
  }

  private lunesDe(fecha: Date): string {
    return lunesLocal(fecha);
  }

  private sumarDias(fecha: string, dias: number): string {
    return sumarDiasLocal(fecha, dias);
  }
}
