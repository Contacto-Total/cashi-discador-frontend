import { Component, HostListener, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import {
  AgenteCerrado, AsistenciaDia, AsistenciaReporte, CierreSemana, Justificacion, SemanaAgente, TipoMarcacion
} from './asistencia.models';
import { ESTILOS, hoy, lunesDe, sumarDias, textoLimite } from './asistencia.estilos';
import { PaginadorComponent, pagina } from './paginador.component';

/** Cuántas semanas cerradas caben en una página: una fila de tarjetas. */
const CIERRES_POR_PAGINA = 4;
const CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
/** El nombre corto de cada marca en la pastilla de faltantes: «Almuerzo y break». */
const NOMBRE_CORTO: Record<TipoMarcacion, string> = {
  ENTRADA: 'entrada', ALMUERZO_INICIO: 'almuerzo', ALMUERZO_FIN: 'almuerzo',
  BREAK_INICIO: 'break', BREAK_FIN: 'break', SALIDA: 'salida'
};

/** Una fila del resumen: lo mismo para la semana abierta que para una cerrada. */
interface FilaResumen {
  idUsuario: number;
  nombre: string;
  diasTrabajados: number;
  faltas: number;
  justificados: number;
  tardanza: string;
  conTardanza: boolean;
  horas: string;
  jornada: string;
  fuera: boolean;
  motivo: string;
  recuperado: number;
  /** Lo que tenía que recuperar esa semana; 0 en una semana ya cerrada (solo se guardó lo hecho). */
  pedido: number;
}

/**
 * Cierre semanal: congelar las cifras con las que se paga.
 *
 * Mientras la semana está abierta, el reporte se recalcula en cada consulta.
 * Una vez cerrada, no: lo guardado es lo que se pagó y ya no cambia (marcas,
 * solicitudes, reglas y calendario lo rechazan).
 *
 * Arriba, cuatro indicadores con su dibujo: la semana, las marcas faltantes,
 * las solicitudes y quién quedó fuera del límite de tardanza. Lo que impide
 * cerrar se dice con un atajo a donde se resuelve. Debajo, el resumen que se
 * congela y las semanas ya cerradas, en tarjetas.
 *
 * Bloquea lo que le toca a RR.HH. (las solicitudes por aprobar). Lo que la
 * supervisora no revisó no bloquea: es responsabilidad suya, queda «Por
 * revisar» y el cierre lo anota en la Auditoría (decisión del 24/09/2026).
 */
@Component({
  selector: 'app-asistencia-cierre',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, PaginadorComponent],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    .titulo-seccion { margin: 0 !important; font-size: 15px; font-weight: 800 }
    .fila-seccion { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; min-height: 38px; margin: 28px 0 12px }

    /* Los cuatro indicadores: el mismo alto, el dibujo debajo de la cifra y el pie al fondo. */
    .kpis { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)) }
    @media (max-width: 980px) { .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)) } }
    @media (max-width: 640px) { .kpis { grid-template-columns: minmax(0, 1fr) } }
    .kpi { display: flex; flex-direction: column; padding: 14px 16px; background: #fff; border: 1px solid #e6e9ee; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04) }
    .cabeza-kpi { display: flex; align-items: center; gap: 9px; margin-bottom: 8px }
    .cabeza-kpi h3 { margin: 0; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80 !important }
    :host-context(.dark) .cabeza-kpi h3 { color: #94a3b8 !important }
    .icono-kpi { width: 28px; height: 28px; border-radius: 8px; flex: none; display: flex; align-items: center; justify-content: center; background: #f1f3f6; color: #0f172a }
    .cifra { font-size: 24px; font-weight: 800; line-height: 1.3; letter-spacing: -.02em; font-variant-numeric: tabular-nums }
    .cifra small { margin-left: 6px; font-size: 12px; font-weight: 600; letter-spacing: normal; color: #5f6c80 }
    .pie-cifra { margin: auto 0 0; padding-top: 10px; font-size: 11.5px; color: #5f6c80 }
    .vacio-kpi { display: flex; align-items: center; gap: 8px; margin: 10px 0 0; font-size: 12.5px; font-weight: 600; color: #5f6c80 }
    .vacio-kpi.ok { color: #166534 }

    /* La semana como seis días; en ámbar los que tienen marcas a medias. */
    .tira-semana { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; margin: 10px 0 2px }
    /* Los días centrados en el espacio libre de la tarjeta, no pegados a la fecha. */
    .kpi .tira-semana { margin: auto 0 }
    .kpi .tira-semana + .pie-cifra { margin-top: 0 }
    .dia-cierre { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 4px 0; border-radius: 6px; background: #f1f3f6; color: #5f6c80; font-size: 10.5px; line-height: 1.2 }
    .dia-cierre b { font-weight: 700 }
    .dia-cierre.ok { background: #e8f5ec; color: #166534 }
    .dia-cierre.falta { background: #fef6e0; color: #92400e; box-shadow: inset 0 0 0 1px #f59e0b }

    /* Cada fila: el nombre y debajo el dato; el motivo en una pastilla. */
    .lista { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 12.5px }
    .lista li { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0 }
    .lista .quien { display: flex; flex-direction: column; gap: 1px; min-width: 0 }
    .lista .quien strong { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .lista .quien span { font-size: 11.5px; color: #5f6c80; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    /* Más de dos: los dos primeros y cuántos quedan. */
    .lista li.mas { display: block; color: #5f6c80 !important }
    :host-context(.dark) .lista li.mas { color: #94a3b8 !important }
    .pastilla { display: inline-flex; flex: none; align-items: center; padding: 2px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700 }
    .p-tarde { background: #fef6e0; color: #92400e }
    .p-falta { background: #fdecec; color: #b91c1c }
    .p-ok { background: #e8f5ec; color: #166534 }

    /* Solicitudes: el anillo con lo resuelto en verde y lo que falta en ámbar. */
    .kpi-con-anillo { display: flex; align-items: center; justify-content: space-between; gap: 10px }
    .leyenda-anillo { list-style: none; margin: 8px 0 0; padding: 0; display: flex; gap: 14px; font-size: 12px; color: #5f6c80 !important }
    .leyenda-anillo li { display: inline-flex; align-items: center; gap: 6px }
    .leyenda-anillo strong { color: #0f172a !important }
    .leyenda-anillo i { width: 8px; height: 8px; border-radius: 999px }

    /* Lo que no bloquea el cierre pero queda dicho: gris, sin alarma. */
    .nota-cierre {
      display: flex; align-items: flex-start; gap: 10px; margin: 10px 0 0; padding: 10px 14px; border-radius: 10px;
      border: 1px solid #e6e9ee; background: #fff; color: #5f6c80; font-size: 12.5px;
    }
    .nota-cierre svg { flex: none; margin-top: 1px }
    .nota-cierre strong { color: #0f172a !important; font-weight: 700 }
    :host-context(.dark) .nota-cierre { border-color: #1e293b; background: #0f172a; color: #94a3b8 }
    :host-context(.dark) .nota-cierre strong { color: #f1f5f9 !important }

    /* Lo que pasa al cerrar, dicho antes de confirmar. */
    .consecuencias { list-style: none; margin: 0; padding: 0 }
    .consecuencias li {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 11px 0; border-bottom: 1px solid #f1f3f6; font-size: 13px; color: inherit !important;
    }
    .consecuencias li:last-child { border-bottom: 0 }
    .consecuencias li svg { flex: none; margin-top: 2px; color: #5f6c80 }
    :host-context(.dark) .consecuencias li { border-color: #1e293b }
    :host-context(.dark) .consecuencias li svg { color: #94a3b8 }

    /* Lo que impide cerrar, con el atajo a donde se resuelve. */
    .motivo-bloqueo { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 14px 0 0; padding: 10px 14px; border-radius: 10px; border: 1px solid color-mix(in srgb, #f59e0b 40%, #fff); background: #fef6e0; color: #92400e; font-size: 12.5px }
    .motivo-bloqueo .acciones { display: flex; gap: 12px; margin-left: auto }

    .con-tardanza { color: #b91c1c; font-weight: 600 }

    /* Semanas cerradas: una tarjeta por semana, de cuatro en cuatro. */
    .semanas-cerradas { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px }
    @media (max-width: 1180px) { .semanas-cerradas { grid-template-columns: repeat(2, minmax(0, 1fr)) } }
    @media (max-width: 640px) { .semanas-cerradas { grid-template-columns: minmax(0, 1fr) } }
    .semana-cerrada { display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #fff; border: 1px solid #e6e9ee; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04) }
    .semana-cab { display: flex; align-items: center; gap: 10px }
    .semana-cab strong { display: block; font-size: 14px }
    .semana-cab span.secundario { font-size: 12px; color: #5f6c80 }
    .rotulo-barra { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80; margin-bottom: -6px }
    .barra-equipo { display: flex; gap: 3px; height: 8px }
    .barra-equipo i { flex: 1; border-radius: 999px; background: #16a34a }
    .barra-equipo i.mal { background: #dc2626 }
    .leyenda-equipo { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: #5f6c80 }
    .leyenda-equipo strong { color: #0f172a !important }
    .leyenda-equipo .mal, .leyenda-equipo .mal strong { color: #b91c1c !important }
    .mini-cifras { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 0; padding-top: 12px; border-top: 1px solid #f1f3f6 }
    .mini-cifras dt { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80 }
    .mini-cifras dd { margin: 3px 0 0; font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums }
    .semana-acciones { display: flex; justify-content: flex-end; gap: 8px }

    /* El detalle de una semana cerrada: cuatro cifras y la tabla. */
    .cifras-cierre { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-bottom: 14px }
    @media (max-width: 640px) { .cifras-cierre { grid-template-columns: repeat(2, minmax(0, 1fr)) } }
    .cifras-cierre > div { padding: 12px 14px; border: 1px solid #e6e9ee; border-radius: 12px }
    .cifras-cierre h3 { margin: 0 0 4px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80 !important }
    .cifras-cierre .cifra { font-size: 22px; line-height: 1.5 }
    .cifras-cierre .cifra.mal { color: #b91c1c }

    :host-context(.dark) .kpi, :host-context(.dark) .semana-cerrada { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .icono-kpi { background: #1e293b; color: #f1f5f9 }
    :host-context(.dark) .cabeza-kpi h3, :host-context(.dark) .cifra small, :host-context(.dark) .pie-cifra,
    :host-context(.dark) .lista .quien span, :host-context(.dark) .leyenda-anillo, :host-context(.dark) .leyenda-equipo,
    :host-context(.dark) .rotulo-barra, :host-context(.dark) .mini-cifras dt, :host-context(.dark) .semana-cab span.secundario,
    :host-context(.dark) .cifras-cierre h3, :host-context(.dark) .vacio-kpi { color: #94a3b8 !important }
    :host-context(.dark) .leyenda-anillo strong, :host-context(.dark) .leyenda-equipo strong { color: #f1f5f9 !important }
    :host-context(.dark) .dia-cierre { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .dia-cierre.ok { background: #052e16; color: #86efac }
    :host-context(.dark) .dia-cierre.falta { background: #451a03; color: #fcd34d }
    :host-context(.dark) .p-tarde { background: #451a03; color: #fcd34d }
    :host-context(.dark) .p-falta { background: #450a0a; color: #fca5a5 }
    :host-context(.dark) .p-ok { background: #052e16; color: #86efac }
    :host-context(.dark) .vacio-kpi.ok { color: #86efac }
    :host-context(.dark) .motivo-bloqueo { border-color: #92400e; background: #451a03; color: #fcd34d }
    :host-context(.dark) .mini-cifras { border-color: #1e293b }
    :host-context(.dark) .cifras-cierre > div { border-color: #1e293b }
    :host-context(.dark) .con-tardanza, :host-context(.dark) .cifras-cierre .cifra.mal { color: #fca5a5 }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Cierre semanal</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Semana del {{ corta(lunes()) }} al {{ corta(sabado()) }}{{ cerrada() ? ' · cerrada' : '' }}
          </p>
        </div>
        <button type="button" [class]="estilos.botonPrimario" (click)="confirmando.set(true)"
                [disabled]="guardando() || !!bloqueo()" [title]="bloqueo() ?? ''">
          <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
          {{ guardando() ? 'Cerrando…' : 'Cerrar la semana' }}
        </button>
      </div>
    </div>

    <div class="px-7 pb-12 pt-5">
    <div class="aparecer">

      <div class="kpis">
        <!-- La semana: seis días, en ámbar los que tienen marcas a medias. -->
        <div class="kpi">
          <div class="cabeza-kpi">
            <span class="icono-kpi"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg></span>
            <h3>{{ cerrada() ? 'Semana cerrada' : 'Semana por cerrar' }}</h3>
          </div>
          <div class="cifra" style="font-size:20px">{{ corta(lunes()) }} – {{ corta(sabado()) }}</div>
          <div class="tira-semana" [style.grid-template-columns]="'repeat(' + tira().length + ', minmax(0, 1fr))'"
               role="img" aria-label="Días de la semana; en ámbar los que tienen marcas faltantes">
            @for (d of tira(); track d.fecha) {
              <span class="dia-cierre" [class.falta]="d.faltan > 0" [class.ok]="!d.faltan && d.trabajados > 0" [title]="d.titulo">
                <b>{{ d.letra }}</b><small>{{ d.numero }}</small>
              </span>
            }
          </div>
          <p class="pie-cifra">{{ pieSemana() }}</p>
        </div>

        <!-- Marcas faltantes: quién y qué día. -->
        <div class="kpi">
          <div class="cabeza-kpi">
            <span class="icono-kpi"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg></span>
            <h3>Marcas faltantes</h3>
          </div>
          @if (sinGente()) {
            <p class="vacio-kpi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Sin asesores asignados</p>
          } @else {
            <div class="cifra">{{ aMedias().length }}<small>{{ aMedias().length === 1 ? 'día' : 'días' }}</small></div>
            @if (aMedias().length) {
              <ul class="lista">
                @for (d of aMedias().slice(0, 2); track d.idUsuario + d.fecha) {
                  <li [title]="d.nombreAgente">
                    <span class="quien"><strong>{{ nombreCorto(d.nombreAgente) }}</strong><span>{{ diaCorto(d) }}</span></span>
                    <span class="pastilla p-tarde">{{ faltantesTexto(d) }}</span>
                  </li>
                }
                @if (aMedias().length > 2) {
                  <li class="mas">y {{ aMedias().length - 2 }} más</li>
                }
              </ul>
            } @else {
              <p class="vacio-kpi ok"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>Todas las marcas completas</p>
            }
            <p class="pie-cifra">{{ aMedias().length ? 'Bloquean el cierre' : 'Nada que completar' }}</p>
          }
        </div>

        <!-- Solicitudes: el anillo con lo resuelto y lo que falta. -->
        <div class="kpi">
          <div class="cabeza-kpi">
            <span class="icono-kpi"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg></span>
            <h3>Solicitudes</h3>
          </div>
          @if (sinGente()) {
            <p class="vacio-kpi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Sin asesores asignados</p>
          } @else if (!deLaSemana().length) {
            <p class="vacio-kpi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>Sin solicitudes esta semana</p>
          } @else {
            <div class="kpi-con-anillo">
              <div class="cifra">{{ pendientes().length }}<small>de {{ deLaSemana().length }} por resolver</small></div>
              <!-- Lo resuelto en verde, lo que falta en ámbar y lo que la supervisora no revisó en gris. -->
              <svg class="flex-none" viewBox="0 0 36 36" width="54" height="54" role="img"
                   [attr.aria-label]="resueltas() + ' resueltas, ' + pendientes().length + ' por resolver y ' + sinRevisar().length + ' sin revisar'">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f3f6" stroke-width="4"></circle>
                @for (a of anillo(); track a.color) {
                  <circle cx="18" cy="18" r="15.915" fill="none" [attr.stroke]="a.color" stroke-width="4"
                          [attr.stroke-dasharray]="a.valor + ' ' + (100 - a.valor)" [attr.stroke-dashoffset]="25 - a.desde"></circle>
                }
              </svg>
            </div>
            <ul class="leyenda-anillo">
              <li><i class="bg-[#16a34a]"></i><strong>{{ resueltas() }}</strong> {{ resueltas() === 1 ? 'resuelta' : 'resueltas' }}</li>
              <li><i class="bg-[#f59e0b]"></i><strong>{{ pendientes().length }}</strong> por resolver</li>
            </ul>
            <p class="pie-cifra">{{ pendientes().length ? 'Por resolver antes de cerrar' : 'Todas resueltas' }}{{ sinRevisar().length ? ' · ' + sinRevisar().length + ' sin revisar' : '' }}</p>
          }
        </div>

        <!-- Límite de tardanza: quién quedó fuera y qué límite pasó. -->
        <div class="kpi">
          <div class="cabeza-kpi">
            <span class="icono-kpi"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8.5a6 6 0 1 0-12 0c0 6-2.5 8-2.5 8h17S18 14.5 18 8.5"/><path d="M13.6 20a2 2 0 0 1-3.2 0"/></svg></span>
            <h3>Límite de tardanza</h3>
          </div>
          @if (sinGente()) {
            <p class="vacio-kpi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>Sin asesores asignados</p>
          } @else {
            <div class="cifra">{{ fuera().length }}<small>de {{ semanas().length }} fuera</small></div>
            @if (fuera().length) {
              <ul class="lista">
                @for (s of fuera().slice(0, 2); track s.idUsuario) {
                  <li [title]="s.nombreAgente + ': ' + textoLimite(s).toLowerCase()">
                    <span class="quien"><strong>{{ nombreCorto(s.nombreAgente) }}</strong><span>{{ duracion(s.minutosTardanza) }} de tardanza</span></span>
                    <span class="pastilla p-falta">{{ limiteCorto(s) }}</span>
                  </li>
                }
                @if (fuera().length > 2) {
                  <li class="mas">y {{ fuera().length - 2 }} más</li>
                }
              </ul>
            } @else {
              <p class="vacio-kpi ok"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>Todos dentro del límite</p>
            }
            <p class="pie-cifra">{{ cerrada() ? 'Congelado al cerrar' : 'Se congela al cerrar' }}</p>
          }
        </div>
      </div>

      <!-- Lo que falta para poder cerrar, con el atajo a donde se resuelve. -->
      @if (partesBloqueo().length && !cerrada()) {
        <div class="motivo-bloqueo" role="note">
          <span><strong>Todavía no se puede cerrar:</strong> {{ partesBloqueo().join(' y ') }}.</span>
          <span class="acciones">
            @if (aMedias().length) {
              <button type="button" [class]="estilos.botonSecundario" (click)="irA.emit('edicion')">Completar marcas</button>
            }
            @if (pendientes().length) {
              <button type="button" [class]="estilos.botonSecundario" (click)="irA.emit('justificaciones')">Ver solicitudes</button>
            }
          </span>
        </div>
      }

      <!-- Lo que la supervisora no revisó: se dice, pero no impide cerrar. -->
      @if (sinRevisar().length && !cerrada()) {
        <div class="nota-cierre" role="note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
          <span><strong>{{ sinRevisar().length }} {{ sinRevisar().length === 1 ? 'solicitud sin revisar' : 'solicitudes sin revisar' }} por la supervisora</strong>
            ({{ textoSinRevisar(sinRevisar(), true) }}). No {{ sinRevisar().length === 1 ? 'bloquea' : 'bloquean' }} el cierre:
            {{ sinRevisar().length === 1 ? 'queda' : 'quedan' }} «Por revisar» y se anota en Auditoría.</span>
        </div>
      }

      @if (error()) {
        <p class="mt-3.5 rounded-lg border border-[#f5c2c2] bg-[#fdecec] px-3.5 py-2.5 text-[12.5px] text-[#b91c1c] dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {{ error() }}
        </p>
      }

      <!-- Lo que se congela: las mismas cifras que después se ven en el cierre. -->
      <div class="fila-seccion">
        <h2 class="titulo-seccion">Resumen de la semana</h2>
        <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ subResumen() }}</span>
      </div>
      <ng-container [ngTemplateOutlet]="tablaResumen" [ngTemplateOutletContext]="{ filas: resumenDeLaPagina(), vacio: sinGente(), paginado: true }"></ng-container>

      <!-- Las semanas ya cerradas, en tarjetas: quién la cerró, cómo quedó el equipo y sus cifras. -->
      <div class="fila-seccion">
        <h2 class="titulo-seccion">Semanas cerradas</h2>
        <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
          {{ cierresDelAmbito().length }} {{ cierresDelAmbito().length === 1 ? 'semana' : 'semanas' }}
        </span>
      </div>
      @if (cierresDelAmbito().length) {
        <div class="semanas-cerradas">
          @for (c of paginaCierres(); track c.id) {
            <article class="semana-cerrada">
              <div class="semana-cab">
                <span class="icono-kpi"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg></span>
                <div>
                  <strong>{{ corta(c.lunes) }} – {{ corta(c.ultimoDia) }}</strong>
                  <span class="secundario">{{ c.cerradoPor ?? 'RR.HH.' }} · {{ c.cerradoEn | date: 'dd/MM HH:mm' }}</span>
                </div>
              </div>
              <span class="rotulo-barra">Límite de tardanza</span>
              <div class="barra-equipo" role="img"
                   [attr.aria-label]="(c.personas - c.sinBono) + ' dentro del límite de tardanza y ' + c.sinBono + ' fuera'">
                @for (a of c.agentes ?? []; track a.idUsuario) {
                  <i [class.mal]="a.pierdeBono" [title]="(a.nombreAgente ?? '') + ': ' + (a.pierdeBono ? (a.motivoBono ?? 'fuera del límite') : 'dentro del límite')"></i>
                }
              </div>
              <div class="leyenda-equipo">
                <span><strong>{{ c.personas - c.sinBono }}</strong> dentro</span>
                <span [class.mal]="c.sinBono > 0"><strong>{{ c.sinBono }}</strong> fuera</span>
              </div>
              <dl class="mini-cifras">
                <div><dt>Faltas</dt><dd>{{ totales(c).faltas }}</dd></div>
                <div><dt>Tardanza</dt><dd>{{ duracion(totales(c).tardanza) }}</dd></div>
                <div><dt>Recuperado</dt><dd>@if (totales(c).recuperado) { {{ duracion(totales(c).recuperado) }} } @else { <span class="text-[#8491a3] dark:text-slate-500">—</span> }</dd></div>
              </dl>
              <div class="semana-acciones">
                <button type="button" [class]="estilos.botonSecundario" (click)="descargarSemana(c)">
                  <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                  Excel
                </button>
                <button type="button" [class]="estilos.botonSecundario" (click)="detalle.set(c)"
                        [attr.aria-label]="'Ver la semana del ' + corta(c.lunes)">
                  <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                  Ver
                </button>
              </div>
            </article>
          }
        </div>
        @if (paginasCierres() > 1) {
          <div class="flex items-center justify-between gap-3 px-0.5 pt-3.5">
            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
              {{ primeraCierre() }}–{{ primeraCierre() + paginaCierres().length - 1 }} de {{ cierresDelAmbito().length }}
            </span>
            <div class="flex gap-1.5">
              <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() - 1)"
                      [disabled]="pagina() === 1" aria-label="Página anterior">
                <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
              </button>
              <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() + 1)"
                      [disabled]="pagina() === paginasCierres()" aria-label="Página siguiente">
                <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
              </button>
            </div>
          </div>
        }
      } @else {
        <div [class]="estilos.vacio">
          <lucide-angular name="calendar-days" [size]="26" class="mx-auto mb-1 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
          <strong class="block text-[13.5px]">Ninguna semana cerrada todavía</strong>
        </div>
      }
    </div>
    </div>

    <!-- Antes de cerrar se dice qué va a pasar: es lo último que se hace con esa semana. -->
    @if (confirmando()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="confirmando.set(false)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,480px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-cerrar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-cerrar" class="!m-0 text-[15px] font-extrabold">Cerrar la semana</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">Semana del {{ corta(lunes()) }} al {{ corta(sabado()) }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="confirmando.set(false)" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-5 py-4">
            <ul class="consecuencias">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><rect x="5" y="11" width="3.5" height="6" rx="1"/><rect x="10.2" y="7" width="3.5" height="10" rx="1"/><rect x="15.4" y="4" width="3.5" height="13" rx="1"/></svg>
                <span>Se congelan las cifras de {{ semanas().length }} {{ semanas().length === 1 ? 'persona' : 'personas' }}: las del «Resumen de la semana».</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>
                <span>{{ recuperadoDeLaSemana() ? 'Se descuenta de las deudas lo recuperado esa semana: ' + duracion(recuperadoDeLaSemana()) + '.' : 'Esa semana nadie recuperó horas.' }}</span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg>
                <span>La semana queda bloqueada: ya no entran marcas ni solicitudes de esos días, y no se reabre.</span>
              </li>
              @if (sinRevisar().length; as n) {
                <li>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/></svg>
                  <span>{{ n }} {{ n === 1 ? 'solicitud' : 'solicitudes' }} sin revisar por la supervisora: {{ n === 1 ? 'queda' : 'quedan' }} «Por revisar» y se anota en Auditoría que no se revisó.</span>
                </li>
              }
            </ul>
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="confirmando.set(false)">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="cerrarSemana()" [disabled]="guardando()">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
              {{ guardando() ? 'Cerrando…' : 'Cerrar la semana' }}
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Una semana cerrada: sus cifras y las de cada persona, como quedaron. -->
    @if (detalle(); as c) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="detalle.set(null)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,780px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-cierre">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-cierre" class="!m-0 text-[15px] font-extrabold">Semana del {{ corta(c.lunes) }} al {{ corta(c.ultimoDia) }}</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Cerrada por {{ c.cerradoPor ?? 'RR.HH.' }} el {{ c.cerradoEn | date: 'dd/MM' }} a las {{ c.cerradoEn | date: 'HH:mm' }} · ya no cambia
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="detalle.set(null)" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex-1 overflow-auto px-5 py-4">
            <div class="cifras-cierre">
              <div><h3>Personas</h3><div class="cifra">{{ c.personas }}</div></div>
              <div><h3>Fuera del límite de tardanza</h3><div class="cifra" [class.mal]="c.sinBono > 0">{{ c.sinBono }}</div></div>
              <div><h3>Faltas</h3><div class="cifra">{{ totales(c).faltas }}</div></div>
              <div><h3>Tardanza</h3><div class="cifra">{{ duracion(totales(c).tardanza) }}</div></div>
            </div>
            @if (sinRevisarDelDetalle().length) {
              <p class="nota-cierre !mb-3.5 !mt-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
                <span><strong>{{ sinRevisarDelDetalle().length }} {{ sinRevisarDelDetalle().length === 1 ? 'solicitud quedó' : 'solicitudes quedaron' }}
                  sin revisar por la supervisora</strong>: {{ textoSinRevisar(sinRevisarDelDetalle(), false) }}.</span>
              </p>
            }
            <ng-container [ngTemplateOutlet]="tablaResumen" [ngTemplateOutletContext]="{ filas: filasDe(c), vacio: false }"></ng-container>
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonPrimario" (click)="descargarSemana(c)">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
              Descargar Excel
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- La tabla del resumen: la misma en la semana abierta y en el detalle de una cerrada. -->
    <ng-template #tablaResumen let-filas="filas" let-vacio="vacio" let-paginado="paginado">
      <div [class]="estilos.panel">
        <table class="w-full border-collapse">
          <caption class="sr-only">Cifras de cada asesor en la semana</caption>
          <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
            <tr>
              <th scope="col" [class]="estilos.th">Asesor</th>
              <th scope="col" [class]="estilos.th">Días trabajados</th>
              <th scope="col" [class]="estilos.th">Tardanza</th>
              <th scope="col" [class]="estilos.th">Horas trabajadas</th>
              <th scope="col" [class]="estilos.th">Límite de tardanza</th>
              <th scope="col" [class]="estilos.th">Horas recuperadas</th>
            </tr>
          </thead>
          <tbody>
            @for (f of filas; track f.idUsuario) {
              <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800">
                <td [class]="estilos.td + ' max-w-[200px] truncate font-semibold'">{{ f.nombre }}</td>
                <td [class]="estilos.td">
                  {{ f.diasTrabajados }}
                  @if (f.faltas) { <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">· {{ f.faltas }} {{ f.faltas === 1 ? 'falta' : 'faltas' }}</span> }
                  @if (f.justificados) { <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">· {{ f.justificados }} {{ f.justificados === 1 ? 'justificado' : 'justificados' }}</span> }
                </td>
                <td [class]="estilos.td" [class.con-tardanza]="f.conTardanza">{{ f.tardanza }}</td>
                <td [class]="estilos.td">{{ f.horas }} <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">de {{ f.jornada }}</span></td>
                <td [class]="estilos.td"><span class="pastilla" [class]="f.fuera ? 'p-falta' : 'p-ok'">{{ f.motivo }}</span></td>
                <td [class]="estilos.td">
                  @if (f.pedido && f.recuperado < f.pedido) {
                    {{ f.recuperado }} de {{ f.pedido }} min
                  } @else if (f.recuperado) {
                    {{ duracion(f.recuperado) }}
                  } @else if (f.pedido) {
                    0 de {{ f.pedido }} min
                  } @else {
                    <span class="text-[#8491a3] dark:text-slate-500">—</span>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="!px-3 !py-14 text-center">
                  <lucide-angular [name]="vacio ? 'users' : 'inbox'" [size]="26" class="mx-auto mb-1 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
                  <strong class="block text-[13.5px]">{{ vacio ? 'Sin asesores asignados' : 'Sin cifras para esta semana' }}</strong>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (paginado) {
          <app-paginador [total]="resumen().length" [pagina]="paginaResumen()" (cambiar)="paginaResumen.set($event)" />
        }
      </div>
    </ng-template>
  `
})
export class AsistenciaCierreComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly textoLimite = textoLimite;

  readonly idSubcartera = input<number | null>(null);
  /** El rango del módulo: la semana que se mira y la que se cierra. */
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();
  /** Los atajos del aviso: completar marcas o ver solicitudes. */
  readonly irA = output<string>();

  readonly cierres = signal<CierreSemana[]>([]);
  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly solicitudes = signal<Justificacion[]>([]);
  readonly recuperado = signal<Record<number, { recuperado: number; pedido: number }>>({});
  readonly detalle = signal<CierreSemana | null>(null);
  /** Las solicitudes que quedaron sin revisar en la semana cerrada que se está viendo. */
  readonly sinRevisarDelDetalle = signal<Justificacion[]>([]);
  /** El aviso de lo que pasa al cerrar, antes de hacerlo. */
  readonly confirmando = signal(false);
  readonly pagina = signal(1);
  readonly guardando = signal(false);
  readonly error = signal('');

  /** Lunes y sábado de la semana del rango. */
  readonly lunes = computed(() => lunesDe(new Date(this.desde() + 'T00:00:00')));
  readonly sabado = computed(() => sumarDias(this.lunes(), 5));

  /** La gente del ámbito, sin días de más: solo los de esa semana. */
  private readonly gente = computed(() => new Set((this.reporte()?.agentes ?? []).map(a => a.idUsuario)));
  readonly sinGente = computed(() => !this.idSubcartera() || !(this.reporte()?.agentes ?? []).length);
  private readonly dias = computed(() => (this.reporte()?.dias ?? [])
    .filter(d => d.fecha >= this.lunes() && d.fecha <= this.sabado()));
  readonly semanas = computed<SemanaAgente[]>(() => (this.reporte()?.semanas ?? [])
    .filter(s => s.lunes === this.lunes()));

  private readonly conSabado = computed(() => this.dias().some(d =>
    d.fecha === this.sabado() && (!!d.entrada || d.estado !== 'NO_LABORABLE')));

  /** Un día a medias: se trabajó y le falta alguna marca. Una falta no tiene marcas que falten. */
  readonly aMedias = computed(() => this.dias().filter(d => d.estado !== 'FALTA' && d.marcasFaltantes?.length));

  /** De lunes a viernes; el sábado solo si alguien lo trabajó o lo tenía en su horario. El domingo nunca. */
  readonly tira = computed(() => (this.conSabado() ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4]).map(i => {
    const fecha = sumarDias(this.lunes(), i);
    const delDia = this.dias().filter(d => d.fecha === fecha);
    const faltan = delDia.filter(d => d.estado !== 'FALTA' && d.marcasFaltantes?.length).length;
    const trabajados = delDia.filter(d => d.entrada).length;
    return {
      fecha, letra: CORTOS[i][0], numero: Number(fecha.slice(8, 10)), faltan, trabajados,
      titulo: `${CORTOS[i]} ${this.corta(fecha)}: ${faltan ? `${faltan} con marcas faltantes` : trabajados ? 'marcas completas' : 'nadie trabajó'}`
    };
  }));

  /** Las solicitudes de la semana de su gente; las de recuperar horas no son ausencias. */
  readonly deLaSemana = computed(() => this.solicitudes().filter(j => this.gente().has(j.idUsuario) && j.minutosExtra == null));
  /** Bloquean el cierre: las que ya revisó la supervisora y esperan a RR.HH. */
  readonly pendientes = computed(() => this.deLaSemana().filter(j => j.estado === 'REVISADA'));
  /** Las que la supervisora no revisó: no bloquean y el cierre las anota en la Auditoría. */
  readonly sinRevisar = computed(() => this.deLaSemana().filter(j => j.estado === 'PENDIENTE'));
  readonly resueltas = computed(() => this.deLaSemana().length - this.pendientes().length - this.sinRevisar().length);
  /** Los arcos del anillo: resueltas en verde, por resolver en ámbar y sin revisar en gris. */
  readonly anillo = computed(() => {
    const total = this.deLaSemana().length;
    const ok = total ? (this.resueltas() / total) * 100 : 0;
    const pend = total ? (this.pendientes().length / total) * 100 : 0;
    const sin = total ? 100 - ok - pend : 0;
    return [
      { valor: ok, desde: 0, color: '#16a34a' },
      { valor: pend, desde: ok, color: '#f59e0b' },
      { valor: sin, desde: ok + pend, color: '#8491a3' }
    ].filter(a => a.valor > 0);
  });
  /** Lo que devolvió el equipo esa semana: se descuenta de sus deudas al cerrar. */
  readonly recuperadoDeLaSemana = computed(() =>
    Object.values(this.recuperado()).reduce((t, r) => t + (r?.recuperado ?? 0), 0));

  /** Quién quedó fuera del límite, con más tardanza primero. */
  readonly fuera = computed(() => this.semanas().filter(s => s.pierdeBono)
    .sort((a, b) => b.minutosTardanza - a.minutosTardanza));

  /** El cierre de la semana del rango, si ya se hizo. */
  private readonly cierreDeLaSemana = computed(() =>
    this.cierres().find(c => c.lunes === this.lunes()
      && (c.idSubcartera ?? null) === (this.idSubcartera() ?? null)) ?? null);
  readonly cerrada = computed(() => !!this.cierreDeLaSemana());

  /** Se cierra desde el lunes siguiente: hasta entonces entran solicitudes y correcciones. */
  private readonly terminada = computed(() => hoy() >= sumarDias(this.lunes(), 7));

  readonly pieSemana = computed(() => {
    const c = this.cierreDeLaSemana();
    if (c) {
      const cuando = c.cerradoEn ? ` el ${this.corta(c.cerradoEn.slice(0, 10))}` : '';
      return `Cerrada por ${c.cerradoPor ?? 'RR.HH.'}${cuando}`;
    }
    return `Se cierra desde el lunes ${this.corta(sumarDias(this.lunes(), 7))}`;
  });

  /** Lo que falta para cerrar, dicho como en la maqueta: «1 día con marcas faltantes y 2 solicitudes por resolver (…)». */
  readonly partesBloqueo = computed(() => {
    const partes: string[] = [];
    const n = this.aMedias().length;
    if (n) {
      partes.push(`${n} ${n === 1 ? 'día' : 'días'} con marcas faltantes`);
    }
    const p = this.pendientes();
    if (p.length) {
      partes.push(`${p.length} ${p.length === 1 ? 'solicitud' : 'solicitudes'} por resolver (`
        + p.map(j => `${(j.tipo ?? 'solicitud').toLowerCase()} de ${(j.nombreAgente ?? '').split(' ')[0]}`).join(', ') + ')');
    }
    return partes;
  });

  /** Por qué no se puede cerrar todavía; null si se puede. */
  readonly bloqueo = computed(() => {
    if (this.cerrada()) {
      return 'Esta semana ya está cerrada';
    }
    if (!this.idSubcartera()) {
      return 'Elige una subcartera';
    }
    if (!this.terminada()) {
      return `Esta semana se cierra desde el lunes ${this.corta(sumarDias(this.lunes(), 7))}`;
    }
    return this.partesBloqueo().length ? 'Faltan marcas por completar o solicitudes por resolver' : null;
  });

  readonly subResumen = computed(() => {
    const c = this.cierreDeLaSemana();
    return c
      ? `Cerrada el ${c.cerradoEn ? this.corta(c.cerradoEn.slice(0, 10)) : ''} por ${c.cerradoPor ?? 'RR.HH.'}: ya no cambia`
      : 'Estas cifras quedan fijas al cerrar';
  });

  /** El resumen de la semana abierta: lo que se va a congelar. */
  /** De 10 en 10, como la Auditoría. */
  readonly paginaResumen = signal(1);
  readonly resumenDeLaPagina = computed(() => pagina(this.resumen(), this.paginaResumen(), 10));

  readonly resumen = computed<FilaResumen[]>(() => this.semanas().map(s => ({
    idUsuario: s.idUsuario,
    nombre: s.nombreAgente,
    diasTrabajados: s.diasTrabajados,
    faltas: s.diasFalta,
    justificados: this.dias().filter(d => d.idUsuario === s.idUsuario && d.estado === 'JUSTIFICADO').length,
    tardanza: s.tardanza,
    conTardanza: s.minutosTardanza > 0,
    horas: s.horasTrabajadas,
    jornada: s.jornada,
    fuera: s.pierdeBono,
    motivo: textoLimite(s),
    recuperado: this.recuperado()[s.idUsuario]?.recuperado ?? 0,
    pedido: this.recuperado()[s.idUsuario]?.pedido ?? 0
  })));

  /** Las semanas cerradas del ámbito elegido; sin ámbito, todas. */
  readonly cierresDelAmbito = computed(() => {
    const ambito = this.idSubcartera();
    return ambito ? this.cierres().filter(c => c.idSubcartera === ambito || c.idSubcartera === null) : this.cierres();
  });
  readonly paginasCierres = computed(() => Math.max(1, Math.ceil(this.cierresDelAmbito().length / CIERRES_POR_PAGINA)));
  readonly primeraCierre = computed(() => (Math.min(this.pagina(), this.paginasCierres()) - 1) * CIERRES_POR_PAGINA + 1);
  readonly paginaCierres = computed(() =>
    this.cierresDelAmbito().slice(this.primeraCierre() - 1, this.primeraCierre() - 1 + CIERRES_POR_PAGINA));

  constructor() {
    this.cargarCierres();
    effect(() => {
      const ambito = this.idSubcartera();
      const lunes = this.lunes();
      const sabado = this.sabado();
      this.pagina.set(1);
      this.paginaResumen.set(1);
      if (!ambito) {
        this.reporte.set(null);
        this.solicitudes.set([]);
        this.recuperado.set({});
        return;
      }
      this.servicio.reporte(lunes, sabado, ambito).subscribe({
        next: r => this.reporte.set(r),
        error: () => this.toast.error('No se pudo cargar la semana')
      });
      this.servicio.justificaciones(lunes, sabado).subscribe({
        next: j => this.solicitudes.set(j),
        error: () => this.solicitudes.set([])
      });
      this.servicio.recuperadoEnSemana(lunes, ambito).subscribe({
        next: r => this.recuperado.set(r),
        error: () => this.recuperado.set({})
      });
    });
  }

  /**
   * Al abrir una semana cerrada: lo que quedó «Por revisar». Con la semana
   * cerrada ya no se revisa ni se registra nada, así que es lo mismo que quedó
   * sin revisar al cerrar.
   */
  private readonly alAbrirDetalle = effect(() => {
    const c = this.detalle();
    this.sinRevisarDelDetalle.set([]);
    if (!c) {
      return;
    }
    const suyos = new Set((c.agentes ?? []).map(a => a.idUsuario));
    this.servicio.justificaciones(c.lunes, c.ultimoDia, ['PENDIENTE']).subscribe({
      next: j => this.sinRevisarDelDetalle.set(j.filter(x => suyos.has(x.idUsuario) && x.minutosExtra == null)),
      error: () => this.sinRevisarDelDetalle.set([])
    });
  });

  /** Escape cierra el aviso de cierre o el detalle de una semana, el que esté abierto. */
  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.guardando()) {
      return;
    }
    this.confirmando.set(false);
    this.detalle.set(null);
  }

  private cargarCierres(): void {
    this.servicio.cierres().subscribe({
      next: c => this.cierres.set(c),
      error: () => this.toast.error('No se pudieron cargar las semanas cerradas')
    });
  }

  cerrarSemana(): void {
    this.error.set('');
    this.guardando.set(true);
    this.servicio.cerrarSemana(this.lunes(), this.idSubcartera()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.confirmando.set(false);
        this.toast.success(`Semana del ${this.corta(this.lunes())} al ${this.corta(this.sabado())} cerrada`);
        this.cargarCierres();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.confirmando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo cerrar la semana');
      }
    });
  }

  /** Las cifras de una semana cerrada: faltas, tardanza y lo recuperado, sumados. */
  totales(c: CierreSemana): { faltas: number; tardanza: number; recuperado: number } {
    const agentes = c.agentes ?? [];
    return {
      faltas: agentes.reduce((t, a) => t + a.diasFalta, 0),
      tardanza: agentes.reduce((t, a) => t + a.minutosTardanza, 0),
      recuperado: agentes.reduce((t, a) => t + (a.minutosRecuperados ?? 0), 0)
    };
  }

  /** Las filas del detalle de una semana cerrada, con la misma forma que el resumen. */
  filasDe(c: CierreSemana): FilaResumen[] {
    return (c.agentes ?? []).map((a: AgenteCerrado) => ({
      idUsuario: a.idUsuario,
      nombre: a.nombreAgente ?? '',
      diasTrabajados: a.diasTrabajados,
      faltas: a.diasFalta,
      justificados: 0,
      tardanza: a.tardanza,
      conTardanza: a.minutosTardanza > 0,
      horas: a.horasTrabajadas,
      jornada: a.jornada,
      fuera: a.pierdeBono,
      motivo: a.pierdeBono ? (a.motivoBono ?? 'Fuera del límite') : 'Dentro del límite',
      recuperado: a.minutosRecuperados ?? 0,
      pedido: 0
    }));
  }

  /**
   * El Excel de una semana cerrada. Lo arma el backend con el mismo formato de
   * la hoja que RR.HH. ya lee; aquí solo se pide con las fechas del cierre.
   */
  descargarSemana(c: CierreSemana): void {
    this.servicio.excel(c.lunes, c.ultimoDia, c.idSubcartera).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `Cierre_${this.corta(c.lunes).replace('/', '-')}_al_${this.corta(c.ultimoDia).replace('/', '-')}.xlsx`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se pudo generar el Excel')
    });
  }

  /**
   * «cita médica de Jorge, 17/09; permiso de Karina, 29/09» en el aviso de la
   * semana abierta; con el nombre completo y los días entre paréntesis en el
   * detalle de una cerrada.
   */
  textoSinRevisar(lista: Justificacion[], corto: boolean): string {
    return lista.map(j => {
      const tipo = (j.tipo ?? 'solicitud').toLowerCase();
      const dias = this.corta(j.fechaDesde) + (j.fechaHasta && j.fechaHasta !== j.fechaDesde ? ` – ${this.corta(j.fechaHasta)}` : '');
      return corto
        ? `${tipo} de ${(j.nombreAgente ?? '').split(' ')[0]}, ${dias}`
        : `${tipo} de ${j.nombreAgente ?? ''} (${dias})`;
    }).join('; ');
  }

  /** «Diario y semanal» en la pastilla; el texto completo va en el título. */
  limiteCorto(s: SemanaAgente): string {
    if (s.superoToleranciaDiaria && s.superoToleranciaSemanal) {
      return 'Diario y semanal';
    }
    return s.superoToleranciaDiaria ? 'Límite diario' : 'Límite semanal';
  }

  /** «Almuerzo y break»: las marcas que faltan en el día, dichas en palabras. */
  faltantesTexto(d: AsistenciaDia): string {
    const nombres = [...new Set((d.marcasFaltantes ?? []).map(t => NOMBRE_CORTO[t]))];
    const texto = nombres.length < 2 ? nombres.join('') : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  diaCorto(d: AsistenciaDia): string {
    return `${d.nombreDia.slice(0, 3)} ${this.corta(d.fecha)}`;
  }

  /** «Karina R.»: el nombre y la inicial del apellido. */
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

  corta(fecha: string): string {
    const [, mes, dia] = fecha.slice(0, 10).split('-');
    return `${dia}/${mes}`;
  }
}
