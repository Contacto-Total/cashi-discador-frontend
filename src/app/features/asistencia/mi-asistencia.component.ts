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
  SolicitudPrevista,
  TipoDia
} from './asistencia.models';
import {
  RECUPERACION, TIPOS_DE_CALENDARIO, abrirArchivo, avisoAnticipacion, avisoDeCierre, detalleRecuperacion,
  hoy as hoyLocal, inicioDiasSinCompletar, lunesDe as lunesLocal, primerDiaPermitido, sumarDias as sumarDiasLocal
} from './asistencia.estilos';

const DIAS_LARGOS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const DESCANSO_MEDICO = 'DESCANSO_MEDICO';
const CITA_MEDICA = 'CITA_MEDICA';
/** Por debajo de esto, lo que faltó no es algo que pedir: es lo normal de entrar y salir a su hora. */
const MINIMO_FALTANTE = 10;

/** Un día sin completar que el permiso puede cubrir. */
interface DiaSinCompletar {
  fecha: string;
  etiqueta: string;
  /** Qué pasó ese día: «Trabajaste 06:00 de 09:30». */
  detalle: string;
  /** Lo que faltó; null si todavía no se puede calcular. */
  falto: number | null;
  pastilla: string;
  clase: string;
}

/** El recuadro del total: lo que la persona acepta deber al enviar. */
interface TotalSolicitud {
  titulo: string;
  detalle: string;
  mal: boolean;
  /** Sin definir en lo que no se recupera; null mientras no hay cifra. */
  minutos?: number | null;
  /** La solicitud que ya cubre ese día, para ofrecer modificarla. */
  repetida: Justificacion | null;
}

/** Un día del rango de la solicitud, con lo que hoy figura en él. */
interface DiaQueCubre {
  fecha: string;
  etiqueta: string;
  texto: string;
  clase: string;
  marcable: boolean;
  /** Tiene entrada y marcarlo lo deja como no trabajado: sale sin marcar. */
  sinMarcar: boolean;
}
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
  titulo: '!mb-3 !mt-0 text-[15px] font-extrabold',
  botonChico: 'inline-flex h-7 items-center rounded-lg border border-[#8491a3] bg-white px-2.5 text-[12px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  opcion: 'flex flex-col items-start gap-0.5 rounded-[10px] border border-[#8491a3] bg-white px-3 py-2.5 text-left !text-[#0f172a] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-100 dark:hover:bg-slate-700',
  opcionElegida: '!border-[#0f172a] !bg-[#f4f6f9] shadow-[inset_0_0_0_1px_#0f172a] dark:!border-white dark:!bg-slate-700 dark:shadow-[inset_0_0_0_1px_#ffffff]',
  segmento: 'h-8 whitespace-nowrap rounded-[7px] px-1.5 text-[12.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 max-[440px]:px-0.5 max-[440px]:text-[11.5px]',
  segmentoLibre: '!text-[#5f6c80] hover:!text-[#0f172a] dark:!text-slate-400 dark:hover:!text-slate-100',
  segmentoElegido: 'bg-[#0f172a] !text-white dark:bg-white dark:!text-[#0f172a]',
  calculo: 'flex flex-wrap items-center justify-between gap-x-3.5 gap-y-1 rounded-[10px] border border-[#e6e9ee] bg-[#f4f6f9] px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800'
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
    .p-incomp { background: #fdeee0; color: #c2410c }
    .p-justif { background: #eef2ff; color: #3730a3 }
    /* Las horas del día y, debajo, qué pasa con él: lo que debe o la solicitud que lo cubre. */
    .horas-dia { display: flex; flex-direction: column; align-items: flex-start; gap: 3px }
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
    .marca-celda small.tarde { color: #b91c1c; font-weight: 600 }
    :host-context(.dark) .tarjeta { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .nota-panel { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .p-ok { background: #052e16; color: #86efac }
    :host-context(.dark) .p-tarde { background: #451a03; color: #fcd34d }
    :host-context(.dark) .p-falta { background: #450a0a; color: #fca5a5 }
    :host-context(.dark) .p-neutro { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .p-incomp { background: #431407; color: #fdba74 }
    :host-context(.dark) .p-justif { background: #1e1b4b; color: #a5b4fc }
    :host-context(.dark) .marca-celda small.tarde { color: #fca5a5 }
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
              <div class="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <h2 class="!m-0 text-[15px] font-extrabold">Tus recuperaciones</h2>
                <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ textoRecuperaciones() }}</span>
              </div>
              <div class="tarjeta mb-4 !py-1">
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
                              <div class="marca-celda"><span>{{ hhmm(dia.entrada) }}</span>
                                @if (dia.estado === 'TARDE' && dia.tardanza) {
                                  <small class="tarde">tarde {{ dia.tardanza }}</small>
                                } @else if (dia.entradaAutorizada) {
                                  <small>autorizado {{ hhmm(dia.entradaAutorizada) }}</small>
                                } @else {
                                  <small>previsto {{ dia.horaEntradaHorario ? hhmm(dia.horaEntradaHorario) : '—' }}</small>
                                }
                              </div>
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
                            @if (notaDe(dia); as nota) {
                              <div class="horas-dia">
                                @if (dia.horasTrabajadas) { <span>{{ dia.horasTrabajadas }}</span> }
                                <span [class]="'pastilla ' + nota.clase">{{ nota.texto }}</span>
                              </div>
                            } @else if (dia.horasTrabajadas) { {{ dia.horasTrabajadas }} } @else { <span class="text-[#8491a3]">—</span> }
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
                        <span class="flex shrink-0 items-center gap-2">
                          @if (s.modificable || yaPlanificada(s)) {
                            <button type="button" [class]="estilos.botonChico" [disabled]="!s.modificable"
                                    [title]="s.modificable ? '' : (s.motivoNoModificable ?? '')" (click)="abrirSolicitud(s)">Modificar</button>
                          }
                          <span class="rounded-full px-[9px] py-0.5 text-[11.5px] font-bold" [class]="estadoDe(s).clase">
                            {{ estadoDe(s).texto }}
                          </span>
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
                <h2 id="titulo-solicitud" class="!m-0 text-[15px] font-extrabold">{{ editando() ? 'Modificar solicitud' : 'Registrar solicitud' }}</h2>
                <p class="!mb-0 !mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  La revisa tu supervisora y la aprueba RR.HH.
                </p>
              </div>
              <button type="button" [class]="estilos.botonIcono" (click)="cerrarSolicitud()" aria-label="Cerrar">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </header>

            <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
              @if (editando() && editando()!.estado !== 'PENDIENTE') {
                <p class="!m-0 rounded-lg border border-[#fbd391] bg-[#fef6e0] px-3 py-2.5 text-[12px] leading-normal text-[#92400e] dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  Al guardar vuelve a «Por revisar»: tu supervisora y RR.HH. la aprueban de nuevo.
                </p>
              }
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="j-tipo">Tipo</label>
                <select id="j-tipo" [class]="estilos.campo"
                        [ngModel]="nuevo.idTipoDia" (ngModelChange)="elegirTipo($event)">
                  @for (t of tipos(); track t.id) {
                    <option [ngValue]="t.id">{{ t.nombre }}</option>
                  }
                </select>
              </div>

              <!-- Permiso: primero para cuándo es. Cada caso trae solo lo que le toca. -->
              @if (modo() === 'permiso') {
                <div class="flex flex-col gap-1.5">
                  <span [class]="estilos.etiqueta" id="rotulo-cuando">Para cuándo</span>
                  <div class="grid grid-cols-2 gap-2 max-[440px]:grid-cols-1" role="radiogroup" aria-labelledby="rotulo-cuando">
                    @for (o of CUANDO; track o.valor) {
                      <button type="button" role="radio" [attr.aria-checked]="cuando() === o.valor"
                              [class]="estilos.opcion + (cuando() === o.valor ? ' ' + estilos.opcionElegida : '')"
                              (click)="elegirCuando(o.valor)">
                        <strong class="text-[13px] font-bold">{{ o.titulo }}</strong>
                        <small class="text-[11.5px] leading-[1.35] text-[#5f6c80] dark:text-slate-400">{{ o.pie }}</small>
                      </button>
                    }
                  </div>
                </div>
              }

              @if (verPasado()) {
                <div class="flex flex-col gap-1.5">
                  <span [class]="estilos.etiqueta">Tus días sin completar</span>
                  <div class="tarjeta max-h-64 overflow-y-auto !px-3.5 !py-0.5">
                    <ul class="lista-limpia">
                      @for (f of sinCompletar(); track f.fecha) {
                        <li>
                          <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-[13px]">
                            <input type="checkbox" class="casilla-dia" [checked]="marcados().has(f.fecha)"
                                   (change)="alternarSinCompletar(f.fecha)">
                            <span class="flex min-w-0 flex-col leading-[1.35]">
                              <span>{{ f.etiqueta }}</span>
                              <small class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ f.detalle }}</small>
                            </span>
                          </label>
                          <span [class]="'pastilla ' + f.clase">{{ f.pastilla }}</span>
                        </li>
                      } @empty {
                        <li class="!justify-center text-[13px] !text-[#5f6c80] dark:!text-slate-400">{{ cargandoRecientes() ? 'Buscando tus días…' : 'No tienes días sin completar' }}</li>
                      }
                    </ul>
                  </div>
                  <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">Solo de semanas sin cerrar. El permiso cubre las horas; la tardanza se mantiene.</p>
                </div>
              }

              <!-- Un día que viene: lo usan el permiso y la cita médica. -->
              @if (verFuturo()) {
                <div class="flex flex-col gap-1.5">
                  <span [class]="estilos.etiqueta" id="rotulo-que">Qué necesitas</span>
                  <div class="grid grid-cols-3 gap-0.5 rounded-[10px] border border-[#e6e9ee] p-[3px] dark:border-slate-700"
                       role="radiogroup" aria-labelledby="rotulo-que">
                    @for (o of QUE; track o.valor) {
                      <button type="button" role="radio" [attr.aria-checked]="que() === o.valor"
                              [class]="estilos.segmento + ' ' + (que() === o.valor ? estilos.segmentoElegido : estilos.segmentoLibre)"
                              (click)="elegirQue(o.valor)">{{ o.texto }}</button>
                    }
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                    <label [class]="estilos.etiqueta" for="j-dia">{{ que() === 'todo' ? 'Desde' : 'Día' }}</label>
                    <input id="j-dia" type="date" [class]="estilos.campo" [attr.min]="primerDiaFuturo()"
                           [ngModel]="diaFuturo()" (ngModelChange)="cambiarDia($event)">
                  </div>
                  @if (que() === 'todo') {
                    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                      <label [class]="estilos.etiqueta" for="j-dia-hasta">Hasta</label>
                      <input id="j-dia-hasta" type="date" [class]="estilos.campo" [attr.min]="diaFuturo()"
                             [ngModel]="hastaFuturo()" (ngModelChange)="hastaFuturo.set($event); prever()">
                    </div>
                  } @else {
                    <div class="flex min-w-0 flex-1 flex-col gap-1.5">
                      <label [class]="estilos.etiqueta" for="j-hora">{{ que() === 'entrar' ? 'Entro a las' : 'Salgo a las' }}</label>
                      <input id="j-hora" type="time" step="300" [class]="estilos.campo"
                             [ngModel]="horaElegida()" (ngModelChange)="cambiarHora($event)">
                    </div>
                  }
                </div>
              }

              <!-- El total, siempre a la vista: es lo que la persona acepta deber al enviar. -->
              @if (modo() !== 'rango') {
                <div [class]="estilos.calculo" aria-live="polite">
                  <span class="flex min-w-0 flex-col leading-[1.4]">
                    <strong class="text-[12.5px] font-bold">{{ total().titulo }}</strong>
                    <small [class]="'text-[11.5px] ' + (total().mal ? 'text-[#b91c1c] dark:text-red-300' : 'text-[#5f6c80] dark:text-slate-400')">{{ total().detalle }}</small>
                  </span>
                  @if (total().repetida; as otra) {
                    <button type="button" [class]="estilos.botonChico" [disabled]="!otra.modificable"
                            [title]="otra.modificable ? '' : (otra.motivoNoModificable ?? '')" (click)="abrirSolicitud(otra)">Modificarla</button>
                  } @else if (total().minutos !== undefined) {
                    <span class="text-[22px] font-extrabold tracking-[-0.02em] tabular-nums">{{ total().minutos === null ? '—' : enHoras(total().minutos!) }}</span>
                  }
                </div>
              }

              <!-- Los demás tipos: el rango de fechas y los días que cubre. Con descanso médico, los del certificado. -->
              @if (modo() === 'rango') {
              <div class="flex gap-3">
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="j-desde">Desde</label>
                  <input id="j-desde" type="date" [class]="estilos.campo" [attr.min]="primerDia()"
                         [ngModel]="nuevo.fechaDesde" (ngModelChange)="nuevo.fechaDesde = $event; cargarRango()">
                </div>
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="j-hasta">Hasta</label>
                  <input id="j-hasta" type="date" [class]="estilos.campo"
                         [ngModel]="nuevo.fechaHasta" (ngModelChange)="nuevo.fechaHasta = $event; cargarRango()">
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <span [class]="estilos.etiqueta">{{ esDescanso() ? 'Días del certificado' : 'Días que cubre' }}</span>
                <div class="tarjeta !px-3.5 !py-0.5">
                  <ul class="lista-limpia">
                    @if (diasQueCubre(); as filas) {
                      @for (f of filas; track f.fecha) {
                        <li>
                          <label class="flex items-center gap-[9px] text-[13px]" [style.opacity]="f.marcable ? null : .55">
                            <input type="checkbox" class="casilla-dia" [disabled]="!f.marcable"
                                   [checked]="marcado(f)" (change)="alternarDia(f)">
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
                <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ esDescanso()
                  ? 'Son días completos: no cuentan como trabajados, incompletos ni con tardanza.'
                  : 'Sirve para días pasados y para días futuros.' }}</p>
              </div>
              }

              @if (pideCertificado()) {
              <div class="flex flex-col gap-1.5">
                <span [class]="estilos.etiqueta">{{ modo() === 'cita' ? 'Constancia de la cita' : 'Certificado' }}</span>
                <label class="zona-archivo" for="j-archivo">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <strong class="text-[13px] !text-[#0f172a] dark:!text-slate-100">{{ archivo()?.name ?? textoAdjunto() }}</strong>
                  <span>{{ conservaAdjunto() ? 'Foto o PDF, hasta 10 MB. Si no adjuntas otro, queda el que ya tiene.' : 'Foto o PDF, hasta 10 MB. Obligatorio.' }}</span>
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
                {{ enviando() ? (editando() ? 'Guardando…' : 'Enviando…') : (editando() ? 'Guardar cambios' : 'Enviar a revisión') }}
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
  protected readonly CUANDO = [
    { valor: 'pasado' as const, titulo: 'Un día que ya pasó', pie: 'No completé mi jornada o no vine' },
    { valor: 'futuro' as const, titulo: 'Hoy o un día que viene', pie: 'Voy a salir antes, entrar tarde o faltar' }
  ];
  protected readonly QUE = [
    { valor: 'salir' as const, texto: 'Salir antes' },
    { valor: 'entrar' as const, texto: 'Entrar más tarde' },
    { valor: 'todo' as const, texto: 'Todo el día' }
  ];

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
  /** Los días con entrada que la persona marcó: salen sin marcar y solo el descanso médico los cubre. */
  readonly conEntradaMarcados = signal(new Set<string>());
  /** El tipo elegido, como signal: de él depende que un día con entrada se pueda marcar. */
  readonly idTipoNuevo = signal<number | null>(null);
  private readonly tipoNuevo = computed(() => this.tipos().find(t => t.id === this.idTipoNuevo()) ?? null);
  /** El certificado solo se pide en los tipos que lo exigen. */
  readonly pideCertificado = computed(() => !!this.tipoNuevo()?.exigeCertificado);
  /** Un permiso que se recupera: cubre lo que faltó ese día y abre esa deuda. */
  readonly seRecupera = computed(() => !!this.tipoNuevo()?.recuperable);
  readonly esDescanso = computed(() => this.tipoNuevo()?.codigo === DESCANSO_MEDICO);
  /**
   * Cómo se pide cada tipo. El que se recupera, por «para cuándo»; la cita
   * médica, solo para un día que viene; los demás, por rango de fechas.
   */
  readonly modo = computed<'permiso' | 'cita' | 'rango'>(() =>
    this.seRecupera() ? 'permiso' : this.tipoNuevo()?.codigo === CITA_MEDICA ? 'cita' : 'rango');
  readonly cuando = signal<'pasado' | 'futuro'>('pasado');
  readonly verPasado = computed(() => this.modo() === 'permiso' && this.cuando() === 'pasado');
  readonly verFuturo = computed(() => this.modo() === 'cita' || (this.modo() === 'permiso' && this.cuando() === 'futuro'));

  /** La solicitud que se está modificando; null al registrar una nueva. */
  readonly editando = signal<Justificacion | null>(null);

  /** Un día que ya pasó: los días del mes (al menos desde la semana pasada) y los que la persona marcó. */
  readonly diasRecientes = signal<AsistenciaDia[]>([]);
  readonly cargandoRecientes = signal(false);
  readonly marcados = signal(new Set<string>());
  /** Quiso enviar sin marcar ningún día. */
  readonly faltaMarcar = signal(false);
  /** Mientras no elija, «para cuándo» se acomoda a si tiene días sin completar. */
  private cuandoElegido = false;

  /** Un día que viene: qué necesita, qué día y a qué hora. */
  readonly que = signal<'salir' | 'entrar' | 'todo'>('salir');
  readonly diaFuturo = signal('');
  readonly hastaFuturo = signal('');
  readonly horaSalir = signal('15:00');
  readonly horaEntrar = signal('10:00');
  readonly horaElegida = computed(() => (this.que() === 'entrar' ? this.horaEntrar() : this.horaSalir()));
  /** Lo que respondió el backend sobre ese día: cuánto deberá, o por qué no se puede. */
  readonly prevista = signal<SolicitudPrevista | null>(null);
  readonly errorPrevista = signal<{ texto: string; idSolicitud: number | null } | null>(null);
  private turnoPrevista = 0;

  /**
   * Los días sin completar de las semanas abiertas: sin entrada, con menos
   * horas que su jornada o con marcas a medias. El que ya tiene una solicitud
   * no vuelve a salir, salvo que sea la que se está modificando.
   */
  readonly sinCompletar = computed<DiaSinCompletar[]>(() => {
    const hoy = this.hoy();
    const propia = this.editando()?.id ?? null;
    const filas: DiaSinCompletar[] = [];
    for (const d of this.diasRecientes()) {
      const suya = !!d.idSolicitud && d.idSolicitud === propia;
      if (d.fecha >= hoy || d.semanaCerrada || d.estado === 'NO_LABORABLE' || (d.idSolicitud && !suya)
          || (d.estado === 'JUSTIFICADO' && !suya)) {
        continue;
      }
      const jornada = d.minutosJornada ?? 0;
      const etiqueta = this.diaLargo(d.fecha);
      if (!d.entrada) {
        if (jornada > 0) {
          filas.push({ fecha: d.fecha, etiqueta, detalle: 'No trabajado', falto: jornada,
            pastilla: `Faltó ${enHoras(jornada)}`, clase: 'p-falta' });
        }
      } else if (d.minutosTrabajados == null) {
        // Sin todas sus marcas no hay horas: se puede pedir, y se calcula cuando RR.HH. las complete.
        filas.push({ fecha: d.fecha, etiqueta, detalle: 'Faltan marcas', falto: null, pastilla: 'Sin calcular', clase: 'p-neutro' });
      } else if ((d.minutosFaltantes ?? jornada - d.minutosTrabajados) > MINIMO_FALTANTE) {
        const falto = d.minutosFaltantes ?? jornada - d.minutosTrabajados;
        const horas = `${enHoras(d.minutosTrabajados)} de ${enHoras(jornada)}`;
        filas.push({ fecha: d.fecha, etiqueta, falto, pastilla: `Faltó ${enHoras(falto)}`, clase: 'p-incomp',
          detalle: d.estado === 'TARDE' && d.tardanza ? `Llegaste tarde ${d.tardanza} · trabajaste ${horas}` : `Trabajaste ${horas}` });
      }
    }
    return filas;
  });

  /** El recuadro del total: lo que quedará por recuperar, o por qué no se puede pedir. */
  readonly total = computed<TotalSolicitud>(() => {
    const cita = this.modo() === 'cita';
    if (this.verPasado()) {
      const elegidos = this.sinCompletar().filter(f => this.marcados().has(f.fecha));
      if (!elegidos.length) {
        return { titulo: 'Horas por recuperar', mal: this.faltaMarcar(), minutos: null, repetida: null,
          detalle: this.faltaMarcar() ? 'Marca al menos un día' : 'Marca el día que cubre el permiso' };
      }
      const sinCalcular = elegidos.filter(f => f.falto === null).length;
      return { titulo: 'Horas por recuperar', mal: false, repetida: null,
        minutos: elegidos.reduce((t, f) => t + (f.falto ?? 0), 0),
        detalle: (elegidos.length === 1 ? elegidos[0].etiqueta
            : `${elegidos.length} días · ${elegidos.map(f => this.corta(f.fecha)).join(', ')}`)
          + (sinCalcular ? ` · ${sinCalcular} sin calcular` : '') };
    }

    const titulo = cita ? 'No se recupera' : 'Horas por recuperar';
    const error = this.errorPrevista();
    if (error) {
      return { titulo: cita ? 'Cita médica' : titulo, detalle: error.texto, mal: true, minutos: cita ? undefined : null,
        repetida: error.idSolicitud ? this.solicitudes().find(x => x.id === error.idSolicitud) ?? null : null };
    }
    const p = this.prevista();
    if (!p) {
      return { titulo, detalle: 'Calculando…', mal: false, minutos: cita ? undefined : null, repetida: null };
    }
    const dia = this.diaLargo(this.diaFuturo());
    const detalle = p.trabajaDesde && p.trabajaHasta
      ? `${dia} · trabajas de ${this.hhmm(p.trabajaDesde)} a ${this.hhmm(p.trabajaHasta)}`
      : p.dias > 1 ? `${p.dias} días · del ${this.corta(this.diaFuturo())} al ${this.corta(this.hastaFuturo())}`
      : `${dia} · todo el día`;
    return { titulo, detalle, mal: false, minutos: cita ? undefined : p.minutos, repetida: null };
  });

  /** Al modificar una que ya trae su adjunto y no cambia de tipo, no hace falta subirlo otra vez. */
  readonly conservaAdjunto = computed(() => {
    const e = this.editando();
    return !!e?.tieneArchivo && e.idTipoDia === this.idTipoNuevo();
  });

  /** El lunes de la semana que se está viendo. */
  readonly lunes = signal(this.lunesDe(new Date()));

  nuevo = {
    idTipoDia: null as number | null,
    fechaDesde: this.hoy(),
    fechaHasta: this.hoy(),
    comentario: ''
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

  /**
   * Los días de lunes a viernes del rango, cada uno con lo que hoy figura; NULL
   * si el rango está al revés. El de una semana cerrada o con otra solicitud no
   * se puede marcar.
   */
  readonly diasQueCubre = computed(() => {
    const { desde, hasta } = this.rango();
    if (!desde || !hasta || hasta < desde) {
      return null;
    }
    const conocidos = this.diasConocidos();
    const hoy = this.hoy();
    const propia = this.editando()?.id ?? null;
    // El descanso médico manda sobre las marcas: también cubre el día en que se entró y hubo que salir.
    const esDescansoMedico = this.esDescanso();
    const filas: DiaQueCubre[] = [];
    for (let f = desde; f <= hasta && filas.length < 31; f = this.sumarDias(f, 1)) {
      const diaSemana = new Date(f + 'T00:00:00').getDay();
      if (diaSemana === 0 || diaSemana === 6) {
        continue;  // sábado y domingo: no se espera a nadie, no hay nada que cubrir
      }
      const d = conocidos.get(f);
      const conEntrada = f <= hoy && !!d && (d.estado === 'PUNTUAL' || d.estado === 'TARDE' || d.estado === 'INCOMPLETO');
      // La tardanza sí se cubre: una cita médica a primera hora hace llegar tarde.
      const [texto, clase, marcable]: [string, string, boolean] = d?.idSolicitud && d.idSolicitud !== propia
          ? [`Ya tiene ${(d.solicitud ?? 'solicitud').toLowerCase()}`, 'p-neutro', false]
        : d?.semanaCerrada ? ['Semana cerrada', 'p-neutro', false]
        : f > hoy ? ['Aún no llega', 'p-neutro', true]
        : f === hoy && !!d?.entrada && !d.salida ? ['En curso', 'p-neutro', true]
        : !d || d.estado === 'FALTA' ? ['No trabajado', 'p-falta', true]
        : d.estado === 'TARDE' ? ['Llegó tarde', 'p-tarde', true]
        : d.estado === 'NO_LABORABLE' ? [d.tipoDia ?? 'No laborable', 'p-neutro', false]
        : d.estado === 'JUSTIFICADO' ? [d.tipoDia ?? 'Justificado', 'p-neutro', d.idSolicitud === propia && !!propia]
        : ['Trabajado', 'p-ok', esDescansoMedico];
      filas.push({ fecha: f, etiqueta: `${DIAS_LARGOS[diaSemana]} ${this.corta(f)}`, texto, clase, marcable,
        sinMarcar: esDescansoMedico && conEntrada });
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
    const [clase, estado] = !d || d.estado === 'NO_LABORABLE' ? ['', d?.tipoDia ? d.tipoDia.toLowerCase() : i === 5 ? 'sin trabajo, es opcional' : 'sin trabajo']
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
        // La recuperación no se pide: la planifica RR.HH.
        const deAusencia = t.filter(x => !TIPOS_DE_CALENDARIO.includes(x.codigo) && x.codigo !== RECUPERACION);
        this.tipos.set(deAusencia);
        this.nuevo.idTipoDia = deAusencia[0]?.id ?? null;
        this.idTipoNuevo.set(this.nuevo.idTipoDia);
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

  /**
   * Abre el formulario vacío, o con una solicitud ya enviada para modificarla.
   * Modificar la que ya se revisó o aprobó la devuelve al principio.
   */
  abrirSolicitud(sol: Justificacion | null = null): void {
    this.formulario.set(true);
    this.editando.set(sol);
    this.error.set('');
    this.errorComentario.set(false);
    this.faltaMarcar.set(false);
    this.archivo.set(null);
    const tipo = (sol ? this.tipos().find(t => t.id === sol.idTipoDia) : null) ?? this.tipos()[0] ?? null;
    this.nuevo = {
      idTipoDia: tipo?.id ?? null,
      fechaDesde: sol?.fechaDesde ?? this.hoy(),
      fechaHasta: sol?.fechaHasta ?? this.hoy(),
      comentario: sol?.comentario ?? ''
    };
    this.idTipoNuevo.set(this.nuevo.idTipoDia);

    const proximo = this.diaHabilDespuesDe(this.hoy());
    this.marcados.set(new Set());
    this.cuandoElegido = !!sol;
    this.cuando.set('pasado');
    this.que.set('salir');
    this.horaSalir.set('15:00');
    this.horaEntrar.set('10:00');
    this.diaFuturo.set(proximo);
    this.hastaFuturo.set(proximo);
    if (sol && this.modo() !== 'rango') {
      this.ponerLoDe(sol);
    }

    // Lo de la semana a la vista ya está: se usa mientras llega lo demás.
    this.diasConocidos.set(new Map(this.dias().map(d => [d.fecha, d])));
    this.cargarRango();
    this.cargarRecientes();
    this.prever();
  }

  /** Deja el formulario como quedó la solicitud que se va a modificar. */
  private ponerLoDe(sol: Justificacion): void {
    const queViene = !!sol.trabajaDesde || sol.fechaDesde >= this.hoy() || this.modo() === 'cita';
    if (!queViene) {
      const dias = new Set<string>();
      for (let f = sol.fechaDesde; f <= sol.fechaHasta; f = this.sumarDias(f, 1)) {
        dias.add(f);
      }
      this.marcados.set(dias);
      return;
    }
    this.cuando.set('futuro');
    this.diaFuturo.set(sol.fechaDesde);
    this.hastaFuturo.set(sol.fechaHasta);
    if (!sol.trabajaDesde || !sol.trabajaHasta) {
      this.que.set('todo');
      return;
    }
    // Si salía antes o entraba más tarde se sabe al ver su horario de ese día.
    this.horaSalir.set(this.hhmm(sol.trabajaHasta));
    this.servicio.solicitudPrevista({ idTipoDia: sol.idTipoDia, fechaDesde: sol.fechaDesde, fechaHasta: sol.fechaDesde,
                                      idSolicitud: sol.id }).subscribe({
      next: p => {
        if (this.editando()?.id === sol.id && p.horaEntrada && this.hhmm(p.horaEntrada) !== this.hhmm(sol.trabajaDesde!)) {
          this.que.set('entrar');
          this.horaEntrar.set(this.hhmm(sol.trabajaDesde!));
          this.prever();
        }
      },
      error: () => { /* sin su horario se queda como «salir antes» */ }
    });
  }

  /** Los días del mes: de ahí salen los que quedaron sin completar. */
  private cargarRecientes(): void {
    this.cargandoRecientes.set(true);
    this.servicio.reporteMio(inicioDiasSinCompletar(), this.hoy()).subscribe({
      next: r => {
        this.diasRecientes.set(r.dias ?? []);
        this.cargandoRecientes.set(false);
        this.acomodarCuando();
      },
      error: () => this.cargandoRecientes.set(false)
    });
  }

  /** Sin días que cubrir, el permiso se abre en «un día que viene». */
  private acomodarCuando(): void {
    if (!this.cuandoElegido && this.modo() === 'permiso' && !this.cargandoRecientes()
        && !this.sinCompletar().length && this.cuando() === 'pasado') {
      this.cuando.set('futuro');
      this.prever();
    }
  }

  elegirCuando(valor: 'pasado' | 'futuro'): void {
    this.cuandoElegido = true;
    this.cuando.set(valor);
    this.error.set('');
    this.prever();
  }

  elegirQue(valor: 'salir' | 'entrar' | 'todo'): void {
    this.que.set(valor);
    this.prever();
  }

  cambiarDia(dia: string): void {
    this.diaFuturo.set(dia);
    // El rango de «Todo el día» nunca termina antes de empezar.
    if (!this.hastaFuturo() || this.hastaFuturo() < dia) {
      this.hastaFuturo.set(dia);
    }
    this.prever();
  }

  cambiarHora(hora: string): void {
    (this.que() === 'entrar' ? this.horaEntrar : this.horaSalir).set(hora);
    this.prever();
  }

  alternarSinCompletar(fecha: string): void {
    this.marcados.update(s => {
      const copia = new Set(s);
      copia.has(fecha) ? copia.delete(fecha) : copia.add(fecha);
      return copia;
    });
    this.faltaMarcar.set(false);
    this.error.set('');
  }

  /** El permiso se puede pedir para hoy; lo que lleva anticipación, desde el día que toca. */
  primerDiaFuturo(): string {
    return this.primerDia() ?? this.hoy();
  }

  /**
   * Pregunta al backend qué resultaría del día que viene tal como está puesto:
   * él conoce el horario de ese día, los feriados y si ya hay otra solicitud.
   */
  prever(): void {
    const turno = ++this.turnoPrevista;
    this.prevista.set(null);
    this.errorPrevista.set(null);
    const idTipoDia = this.nuevo.idTipoDia;
    if (!this.verFuturo() || !idTipoDia) {
      return;
    }
    const dia = this.diaFuturo();
    const que = this.que();
    const hora = this.horaElegida();
    const hasta = que === 'todo' ? (this.hastaFuturo() || dia) : dia;
    const falta = !dia ? 'Elige el día' : que !== 'todo' && !hora ? 'Indica la hora'
      : hasta < dia ? 'La fecha de fin no puede ser anterior a la de inicio' : '';
    if (falta) {
      this.errorPrevista.set({ texto: falta, idSolicitud: null });
      return;
    }
    this.servicio.solicitudPrevista({
      idTipoDia, fechaDesde: dia, fechaHasta: hasta,
      saleALas: que === 'salir' ? hora : null,
      entraALas: que === 'entrar' ? hora : null,
      idSolicitud: this.editando()?.id ?? null
    }).subscribe({
      next: p => {
        if (turno === this.turnoPrevista) {
          this.prevista.set(p);
        }
      },
      error: respuesta => {
        if (turno === this.turnoPrevista) {
          this.errorPrevista.set({ texto: respuesta?.error?.error ?? 'No se pudo calcular',
                                   idSolicitud: respuesta?.error?.idSolicitud ?? null });
        }
      }
    });
  }

  /**
   * Trae lo que figura en los días ya pasados del rango. Lo que se trae se
   * guarda: al mover las fechas no se vuelve a pedir lo mismo.
   */
  cargarRango(): void {
    const { fechaDesde: desde, fechaHasta: hasta } = this.nuevo;
    this.rango.set({ desde, hasta });
    this.desmarcados.set(new Set());
    this.conEntradaMarcados.set(new Set());
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

  /** Si la solicitud cubre ese día. */
  marcado(f: DiaQueCubre): boolean {
    return f.marcable && (f.sinMarcar ? this.conEntradaMarcados().has(f.fecha) : !this.desmarcados().has(f.fecha));
  }

  alternarDia(f: DiaQueCubre): void {
    (f.sinMarcar ? this.conEntradaMarcados : this.desmarcados).update(s => {
      const copia = new Set(s);
      copia.has(f.fecha) ? copia.delete(f.fecha) : copia.add(f.fecha);
      return copia;
    });
    this.error.set('');
  }

  /**
   * Los tramos seguidos de días marcados. Uno desmarcado en medio parte la
   * solicitud en dos; lo trabajado o no laborable no corta, porque en esos
   * días la solicitud no cambia nada. Con descanso médico, el día con entrada
   * sin marcar sí corta: dentro del tramo contaría como no trabajado.
   */
  private tramos(): { desde: string; hasta: string }[] {
    const tramos: { desde: string; hasta: string }[] = [];
    let actual: { desde: string; hasta: string } | null = null;
    for (const f of this.diasQueCubre() ?? []) {
      if (!f.marcable) {
        continue;
      }
      if (!this.marcado(f)) {
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

  cerrarSolicitud(): void {
    this.formulario.set(false);
  }

  elegirTipo(id: number): void {
    this.nuevo.idTipoDia = id;
    this.idTipoNuevo.set(id);
    this.conEntradaMarcados.set(new Set());
    this.error.set('');
    this.faltaMarcar.set(false);
    if (!this.pideCertificado()) {
      this.archivo.set(null);
    }
    // Lo que lleva anticipación no se pide para hoy.
    const primero = this.primerDiaFuturo();
    if (this.diaFuturo() < primero) {
      this.diaFuturo.set(this.diaHabilDespuesDe(this.sumarDias(primero, -1)));
      this.hastaFuturo.set(this.diaFuturo());
    }
    this.acomodarCuando();
    this.prever();
  }

  elegirArchivo(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    this.archivo.set(entrada.files?.[0] ?? null);
    this.error.set('');
  }

  enviar(): void {
    const idTipoDia = this.nuevo.idTipoDia;
    if (!idTipoDia) {
      this.error.set('Elige el tipo');
      return;
    }

    // Cada pedido es una solicitud: un tramo de días seguidos, o un día con sus horas.
    let pedidos: { desde: string; hasta: string; trabajaDesde?: string | null; trabajaHasta?: string | null }[];
    if (this.verPasado()) {
      const fechas = this.sinCompletar().filter(f => this.marcados().has(f.fecha)).map(f => f.fecha);
      if (!fechas.length) {
        this.faltaMarcar.set(true);
        return;
      }
      pedidos = this.seguidos(fechas);
    } else if (this.verFuturo()) {
      const p = this.prevista();
      if (!p) {
        return;  // el recuadro ya dice por qué no se puede, o todavía calcula
      }
      const porHoras = this.que() !== 'todo';
      pedidos = [{
        desde: this.diaFuturo(),
        hasta: porHoras ? this.diaFuturo() : (this.hastaFuturo() || this.diaFuturo()),
        trabajaDesde: porHoras ? p.trabajaDesde : null,
        trabajaHasta: porHoras ? p.trabajaHasta : null
      }];
    } else {
      if (this.nuevo.fechaHasta < this.nuevo.fechaDesde) {
        this.error.set('La fecha final no puede ser anterior a la inicial');
        return;
      }
      pedidos = this.tramos();
      if (!pedidos.length) {
        this.error.set('Marca al menos un día');
        return;
      }
      const primerDia = this.primerDia();
      if (primerDia && pedidos[0].desde < primerDia) {
        this.error.set(avisoAnticipacion(this.tipoElegido()!));
        return;
      }
    }

    if (this.tipoElegido()?.exigeCertificado && !this.archivo() && !this.conservaAdjunto()) {
      this.error.set(`${this.tipoElegido()!.nombre} necesita ${this.modo() === 'cita' ? 'la constancia adjunta' : 'certificado adjunto'}`);
      return;
    }
    if (!this.nuevo.comentario.trim()) {
      this.errorComentario.set(true);
      document.getElementById('j-comentario')?.focus();
      return;
    }

    this.error.set('');
    this.enviando.set(true);
    const editando = this.editando();
    const comentario = this.nuevo.comentario.trim();
    const archivo = this.pideCertificado() ? this.archivo() : null;
    // Al modificar, el primer tramo es la misma solicitud; si marcó días sueltos, los demás son nuevas.
    from(pedidos).pipe(
      concatMap((pedido, i) => {
        const datos = { idTipoDia, fechaDesde: pedido.desde, fechaHasta: pedido.hasta, comentario, archivo,
                        trabajaDesde: pedido.trabajaDesde ?? null, trabajaHasta: pedido.trabajaHasta ?? null };
        return editando && i === 0
          ? this.servicio.modificarJustificacion(editando.id, datos)
          : this.servicio.crearJustificacion(datos);
      }),
      toArray()
    ).subscribe({
      next: hechas => {
        this.enviando.set(false);
        this.cerrarSolicitud();
        this.toast.success(editando
          ? (editando.estado === 'PENDIENTE' ? 'Solicitud modificada' : 'Solicitud modificada. Vuelve a revisión')
          : hechas.length === 1
            ? 'Solicitud enviada. La revisará tu supervisora'
            : `${hechas.length} solicitudes enviadas. Las revisará tu supervisora`);
        this.cargarSolicitudes();
        this.cargar();
      },
      error: respuesta => {
        this.enviando.set(false);
        this.error.set(respuesta?.error?.error ?? (editando ? 'No se pudo guardar la solicitud' : 'No se pudo enviar la solicitud'));
        // Si alguna llegó a guardarse, que se vea en la lista.
        this.cargarSolicitudes();
      }
    });
  }

  /** Agrupa fechas en tramos de días seguidos: cada tramo es una solicitud. */
  private seguidos(fechas: string[]): { desde: string; hasta: string }[] {
    const tramos: { desde: string; hasta: string }[] = [];
    for (const f of [...fechas].sort()) {
      const ultimo = tramos[tramos.length - 1];
      if (ultimo && this.sumarDias(ultimo.hasta, 1) === f) {
        ultimo.hasta = f;
      } else {
        tramos.push({ desde: f, hasta: f });
      }
    }
    return tramos;
  }

  /** El siguiente día de lunes a viernes. */
  private diaHabilDespuesDe(fecha: string): string {
    let f = this.sumarDias(fecha, 1);
    while ([0, 6].includes(new Date(f + 'T00:00:00').getDay())) {
      f = this.sumarDias(f, 1);
    }
    return f;
  }

  /** La aprobada que ya no se modifica porque su recuperación está en marcha: se enseña, deshabilitada. */
  yaPlanificada(s: Justificacion): boolean {
    return s.estado === 'APROBADA' && s.modificable === false && (s.motivoNoModificable ?? '').startsWith('RR.HH.');
  }

  protected textoAdjunto(): string {
    return this.modo() === 'cita' ? 'Adjuntar constancia' : 'Adjuntar certificado';
  }

  /**
   * Qué pasa con las horas del día, que la tabla no dice: la solicitud que lo
   * cubre y lo que queda por recuperar, o lo que debe si no pidió nada. Lo que
   * faltó por llegar tarde ya lo dice la tardanza.
   */
  notaDe(d: AsistenciaDia): { texto: string; clase: string } | null {
    if (d.solicitud && d.estadoSolicitud === 'APROBADA') {
      return { texto: d.minutosDeuda ? `${d.solicitud} · debe ${enHoras(d.minutosDeuda)}` : d.solicitud, clase: 'p-justif' };
    }
    if (d.solicitud && d.estadoSolicitud) {
      return { texto: `${d.solicitud} en revisión`, clase: 'p-neutro' };
    }
    if (d.estado === 'NO_LABORABLE' || d.estado === 'JUSTIFICADO') {
      return null;
    }
    if (d.minutosDebe) {
      return { texto: `Debe ${enHoras(d.minutosDebe)}`, clase: 'p-incomp' };
    }
    if (d.fecha === this.hoy()) {
      return d.entrada && !d.salida ? { texto: 'En curso', clase: 'p-neutro' } : null;
    }
    return d.estado === 'FALTA' ? { texto: 'No trabajado', clase: 'p-falta' } : null;
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
    const dias = s.fechaHasta && s.fechaHasta !== s.fechaDesde
      ? `${this.corta(s.fechaDesde)} al ${this.corta(s.fechaHasta)}` : this.corta(s.fechaDesde);
    return s.trabajaDesde && s.trabajaHasta
      ? `${dias} · trabaja de ${s.trabajaDesde.slice(0, 5)} a ${s.trabajaHasta.slice(0, 5)}` : dias;
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
