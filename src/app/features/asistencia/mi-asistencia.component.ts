import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { AsistenciaService } from './asistencia.service';
import {
  AsistenciaDia,
  AvisoAsistencia,
  AsistenciaReporte,
  EstadoAsistencia,
  Justificacion,
  Recuperacion,
  TipoDia
} from './asistencia.models';

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
  etiqueta: 'text-xs font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:text-[#8491a3] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonSecundario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonPrimario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg bg-[#0f172a] px-3.5 text-[13px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:!text-[#0f172a] dark:hover:bg-slate-200',
  botonIcono: 'inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-[7px] border border-[#e6e9ee] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200',
  th: 'whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  td: 'whitespace-nowrap px-3 py-2 text-[12.5px] tabular-nums',
  tarjeta: 'flex flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  rotulo: 'text-[11.5px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  cifra: 'text-2xl font-extrabold leading-[1.3] tracking-[-0.02em] tabular-nums',
  unidad: 'ml-1 text-xs font-semibold text-[#5f6c80] dark:text-slate-400',
  pie: 'mt-auto pt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400',
  icono: 'flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f1f3f6] text-[#0f172a] dark:bg-slate-800 dark:text-slate-100',
  titulo: 'mb-2.5 text-[13.5px] font-extrabold tracking-[-0.01em]'
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
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 18px; border: 1px dashed #8491a3; border-radius: 10px;
      cursor: pointer; text-align: center; transition: border-color .15s, background-color .15s;
    }
    .zona-archivo:hover { border-color: #2563eb; background: #f4f6f9 }
    :host-context(.dark) .zona-archivo { border-color: #475569 }
    :host-context(.dark) .zona-archivo:hover { background: #1e293b }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <div class="border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2.5">
            <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Mi Asistencia</h1>
            @if (nombre()) {
              <span class="rounded-full bg-[#f1f3f6] px-2.5 py-1 text-[12px] font-semibold text-[#334155] dark:bg-slate-800 dark:text-slate-200">
                {{ nombre() }}
              </span>
            }
          </div>
          <button type="button" [class]="estilos.botonPrimario" (click)="abrirSolicitud()">
            <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
            Solicitar justificación
          </button>
        </div>
      </div>

      <!-- La semana que se está viendo -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e9ee] bg-white px-7 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-2">
          <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(-1)" aria-label="Semana anterior">
            <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
          </button>
          <strong class="text-[13px]">{{ rangoTexto() }}</strong>
          <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(1)"
                  [disabled]="esSemanaActual()" aria-label="Semana siguiente">
            <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
          </button>
          @if (!esSemanaActual()) {
            <button type="button" class="ml-1 h-[32px] rounded-lg border border-[#8491a3] bg-white px-3 text-[12.5px] font-semibold !text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200"
                    (click)="irAEstaSemana()">Esta semana</button>
          }
        </div>
        <p class="!m-0 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ actualizado() }}</p>
      </div>

      <div class="px-7 py-5">
        @if (cargando()) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando tus horas…</p>
        } @else {
          <div class="aparecer">

            <!-- Avisos: lo que hay que hacer, no lo que se hizo mal -->
            @for (r of recuperaciones(); track r.id) {
              <div class="mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[12.5px]"
                   [class]="r.diasRestantes < 0
                     ? 'border-[#f5c2c2] bg-[#fdecec] text-[#b91c1c] dark:border-red-900 dark:bg-red-950/40 dark:text-red-200'
                     : 'border-[#c7d2fe] bg-[#eef2ff] text-[#3730a3] dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-200'">
                <lucide-angular name="clock" [size]="16" class="mt-[1px] block shrink-0"></lucide-angular>
                <div>
                  <strong class="font-bold">{{ r.pendientes }} por recuperar</strong>
                  del {{ r.fechaOrigen | date: 'dd/MM' }}.
                  @if (r.diasRestantes < 0) {
                    El plazo venció el {{ r.fechaLimite | date: 'dd/MM' }}.
                  } @else {
                    Hasta el {{ r.fechaLimite | date: 'dd/MM' }}:
                    unos {{ r.minutosPorSemana }} min más por semana durante
                    {{ r.semanasRestantes }} {{ r.semanasRestantes === 1 ? 'semana' : 'semanas' }}.
                  }
                </div>
              </div>
            }

            @if (diasIncompletos().length) {
              <div class="mb-4 flex items-start gap-2.5 rounded-xl border border-[#f3d9a4] bg-[#fef6e0] px-4 py-3 text-[12.5px] text-[#92400e] dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                <lucide-angular name="alert-triangle" [size]="16" class="mt-[1px] block shrink-0"></lucide-angular>
                <div>
                  <strong class="font-bold">Te faltan marcaciones.</strong>
                  {{ textoIncompletos() }} Avisa a tu supervisora para que las complete.
                </div>
              </div>
            }

            <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="clock" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Mi horario</h3>
                </div>
                <div [class]="estilos.cifra + ' !text-[19px]'">{{ horarioTexto() }}</div>
                <p [class]="estilos.pie">{{ horarioNota() }}</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="bar-chart-2" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Horas de la semana</h3>
                </div>
                <div [class]="estilos.cifra">
                  {{ duracionCorta(minutosTrabajados()) }}<small [class]="estilos.unidad">{{ unidadDe(minutosTrabajados()) }}</small>
                </div>
                <p [class]="estilos.pie">De {{ duracionCorta(minutosJornada()) }} {{ unidadDe(minutosJornada()) }} previstas</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="calendar-check" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Días registrados</h3>
                </div>
                <div [class]="estilos.cifra">{{ diasCompletos() }} de {{ diasLaborables() }}</div>
                <p [class]="estilos.pie">
                  {{ diasIncompletos().length ? diasIncompletos().length + ' con marcaciones pendientes' : 'Sin marcaciones pendientes' }}
                </p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="file-text" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Solicitudes abiertas</h3>
                </div>
                <div [class]="estilos.cifra">{{ abiertas().length }}</div>
                <p [class]="estilos.pie">{{ textoAbiertas() }}</p>
              </div>
            </div>

            <div class="grid gap-4 lg:grid-cols-[1.35fr_1fr]">

              <div>
                <h2 [class]="estilos.titulo">Mis marcaciones</h2>
                <div class="overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900">
                  <table class="w-full border-collapse">
                    <caption class="sr-only">Mis marcaciones de la semana</caption>
                    <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                      <tr>
                        <th scope="col" [class]="estilos.th">Día</th>
                        <th scope="col" [class]="estilos.th">Entrada</th>
                        <th scope="col" [class]="estilos.th">Almuerzo</th>
                        <th scope="col" [class]="estilos.th">Break</th>
                        <th scope="col" [class]="estilos.th">Salida</th>
                        <th scope="col" [class]="estilos.th">Horas</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (dia of dias(); track dia.fecha) {
                        <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800">
                          <td [class]="estilos.td">
                            <span class="font-semibold">{{ dia.fecha | date: 'dd/MM' }}</span>
                            <span class="ml-1.5 text-[#8491a3] dark:text-slate-500">{{ dia.nombreDia.slice(0, 3) }}</span>
                            @if (dia.estado !== 'PUNTUAL') {
                              <span class="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold"
                                    [class]="ESTADOS[dia.estado].clase">
                                {{ dia.tipoDia ?? ESTADOS[dia.estado].texto }}
                              </span>
                            }
                          </td>
                          <td [class]="estilos.td">
                            <span [class.manual]="esManual(dia, 'ENTRADA')">{{ dia.entrada ?? '—' }}</span>
                          </td>
                          <td [class]="estilos.td">{{ rango(dia.almuerzoInicio, dia.almuerzoFin) }}</td>
                          <td [class]="estilos.td">{{ rango(dia.breakInicio, dia.breakFin) }}</td>
                          <td [class]="estilos.td">
                            <span [class.manual]="esManual(dia, 'SALIDA')">{{ dia.salida ?? '—' }}</span>
                          </td>
                          <td [class]="estilos.td + ' font-bold'">{{ dia.horasTrabajadas ?? '—' }}</td>
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
                <p class="mt-2 flex items-center gap-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  <span class="inline-block h-[6px] w-[6px] rounded-full bg-[#d97706]"></span>
                  Marcación completada a mano por tu supervisora
                </p>
              </div>

              <div>
                <h2 [class]="estilos.titulo">Mis solicitudes</h2>
                <div [class]="estilos.tarjeta + ' !px-0 !py-0'">
                  <ul class="!m-0 list-none !p-0">
                    @for (s of paginaSolicitudes(); track s.id) {
                      <li class="border-b border-[#f1f3f6] px-4 py-3 last:border-0 dark:border-slate-800">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0">
                            <strong class="block text-[13px]">{{ s.tipo }}</strong>
                            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                              {{ s.fechaDesde | date: 'dd/MM' }}
                              @if (s.fechaHasta !== s.fechaDesde) { – {{ s.fechaHasta | date: 'dd/MM' }} }
                              · {{ s.dias }} {{ s.dias === 1 ? 'día' : 'días' }}
                            </span>
                          </div>
                          <span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold"
                                [class]="ESTADO_SOLICITUD[s.estado].clase">
                            {{ ESTADO_SOLICITUD[s.estado].texto }}
                          </span>
                        </div>
                        @if (s.motivoResolucion) {
                          <p class="!mb-0 !mt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                            {{ s.motivoResolucion }}
                          </p>
                        }
                        @if (s.tieneArchivo) {
                          <button type="button"
                                  class="mt-1.5 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#2563eb] hover:underline"
                                  (click)="verCertificado(s)">
                            <lucide-angular name="file-check" [size]="12" class="block"></lucide-angular>
                            {{ s.archivoNombre ?? 'Ver certificado' }}
                          </button>
                        }
                      </li>
                    } @empty {
                      <li class="px-4 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                        Todavía no has pedido ninguna
                      </li>
                    }
                  </ul>

                  @if (solicitudes().length > porPagina) {
                    <div class="flex items-center justify-between gap-3 border-t border-[#e6e9ee] px-4 py-2.5 dark:border-slate-800">
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

      <!-- Los avisos de la jornada. Salen aquí y no como un recuadro dentro de
           la página: el del almuerzo tiene que interrumpir. -->
      <div class="pointer-events-none fixed right-4 top-4 z-[60] flex w-[min(100%,360px)] flex-col gap-2">
        @for (a of avisos(); track a.titulo) {
          <div class="pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
               [class]="a.tipo === 'aviso'
                 ? 'border-[#f3d9a4] bg-[#fef6e0] text-[#92400e] dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200'
                 : 'border-[#bfe3c8] bg-[#e8f5ec] text-[#166534] dark:border-green-900 dark:bg-green-950 dark:text-green-200'"
               role="status">
            <lucide-angular [name]="a.tipo === 'aviso' ? 'alert-triangle' : 'check-circle'"
                            [size]="16" class="mt-[1px] block shrink-0"></lucide-angular>
            <div class="min-w-0 flex-1">
              <strong class="block text-[12.5px] font-bold">{{ a.titulo }}</strong>
              <span class="block text-[11.5px]">{{ a.texto }}</span>
            </div>
            <button type="button" class="shrink-0 opacity-60 hover:opacity-100"
                    (click)="descartar(a)" aria-label="Cerrar aviso">
              <lucide-angular name="x" [size]="14" class="block"></lucide-angular>
            </button>
          </div>
        }
      </div>

      <!-- Solicitar justificación -->
      @if (formulario()) {
        <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarSolicitud()"></div>
        <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,520px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
               role="dialog" aria-modal="true" aria-labelledby="titulo-solicitud">
            <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
              <div>
                <h2 id="titulo-solicitud" class="!m-0 text-[15px] font-extrabold">Solicitar justificación</h2>
                <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  La revisa tu supervisora y la aprueba RR.HH.
                </p>
              </div>
              <button type="button" [class]="estilos.botonIcono" (click)="cerrarSolicitud()" aria-label="Cerrar">
                <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
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
                  <label [class]="estilos.etiqueta" for="j-desde">Desde</label>
                  <input id="j-desde" type="date" [class]="estilos.campo" [(ngModel)]="nuevo.fechaDesde">
                </div>
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="j-hasta">Hasta</label>
                  <input id="j-hasta" type="date" [class]="estilos.campo" [(ngModel)]="nuevo.fechaHasta">
                </div>
              </div>
              <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Sirve para días pasados y para días futuros.
              </p>

              <div class="flex flex-col gap-1.5">
                <span [class]="estilos.etiqueta">Certificado</span>
                <label class="zona-archivo" for="j-archivo">
                  <lucide-angular name="upload" [size]="18" class="block text-[#8491a3]"></lucide-angular>
                  <strong class="text-[12.5px]">{{ archivo()?.name ?? 'Elige una foto o un PDF' }}</strong>
                  <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                    {{ tipoElegido()?.exigeCertificado ? 'Obligatorio para este tipo' : 'Opcional' }} · hasta 10 MB
                  </span>
                </label>
                <input id="j-archivo" type="file" class="sr-only"
                       accept="image/jpeg,image/png,image/webp,application/pdf"
                       (change)="elegirArchivo($event)">
              </div>

              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="j-comentario">Comentario</label>
                <textarea id="j-comentario" rows="2"
                          class="w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] py-2 text-[13px] !text-[#0f172a] focus:!border-[#2563eb] focus:outline-none dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100"
                          placeholder="Lo que quieras añadir para quien la revise"
                          [(ngModel)]="nuevo.comentario"></textarea>
              </div>

              @if (error()) {
                <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
              }
            </div>

            <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrarSolicitud()">Cancelar</button>
              <button type="button" [class]="estilos.botonPrimario" (click)="enviar()" [disabled]="enviando()">
                <lucide-angular name="send" [size]="15" class="block"></lucide-angular>
                {{ enviando() ? 'Enviando…' : 'Enviar a revisión' }}
              </button>
            </footer>
          </div>
        </div>
      }
    </div>
  `
})
export class MiAsistenciaComponent implements OnInit, OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly ESTADOS = ESTADOS;
  protected readonly ESTADO_SOLICITUD = ESTADO_SOLICITUD;
  protected readonly porPagina = 5;

  readonly cargando = signal(false);
  readonly reporte = signal<AsistenciaReporte | null>(null);
  /** Cuándo se trajeron estas horas: sin esto no se sabe si están al día. */
  readonly cargadoEn = signal<Date | null>(null);
  readonly solicitudes = signal<Justificacion[]>([]);
  readonly recuperaciones = signal<Recuperacion[]>([]);
  readonly avisos = signal<AvisoAsistencia[]>([]);
  /** Los que ya cerró: no vuelven a salir en el siguiente sondeo. */
  private readonly descartados = new Set<string>();
  private reloj?: ReturnType<typeof setInterval>;
  readonly tipos = signal<TipoDia[]>([]);
  readonly pagina = signal(0);

  readonly formulario = signal(false);
  readonly enviando = signal(false);
  readonly error = signal('');
  readonly archivo = signal<File | null>(null);

  /** El lunes de la semana que se está viendo. */
  readonly lunes = signal(this.lunesDe(new Date()));

  nuevo = {
    idTipoDia: null as number | null,
    fechaDesde: this.hoy(),
    fechaHasta: this.hoy(),
    comentario: ''
  };

  /** El nombre que ya trae la sesión: no hace falta pedirlo otra vez. */
  readonly nombre = computed(() => {
    const usuario = this.auth.getCurrentUser();
    if (!usuario) {
      return '';
    }
    return [usuario.firstName, usuario.lastName].filter(Boolean).join(' ') || usuario.username;
  });

  readonly dias = computed<AsistenciaDia[]>(() => this.reporte()?.dias ?? []);

  readonly semana = computed(() => (this.reporte()?.semanas ?? [])[0] ?? null);

  readonly diasLaborables = computed(() =>
    this.dias().filter(d => d.estado !== 'NO_LABORABLE').length);

  /** Un día está completo cuando no le falta ninguna marca necesaria. */
  readonly diasIncompletos = computed(() =>
    this.dias().filter(d => (d.marcasFaltantes ?? []).length > 0 && d.estado !== 'NO_LABORABLE'));

  readonly diasCompletos = computed(() =>
    this.dias().filter(d => d.estado === 'PUNTUAL' || d.estado === 'TARDE').length);

  readonly minutosTrabajados = computed(() => this.semana()?.minutosTrabajados ?? 0);
  readonly minutosJornada = computed(() => this.semana()?.minutosJornada ?? 0);

  readonly abiertas = computed(() =>
    this.solicitudes().filter(s => s.estado === 'PENDIENTE' || s.estado === 'REVISADA'));

  readonly paginaSolicitudes = computed(() =>
    this.solicitudes().slice(this.pagina() * this.porPagina, (this.pagina() + 1) * this.porPagina));

  readonly hayMas = computed(() =>
    (this.pagina() + 1) * this.porPagina < this.solicitudes().length);

  readonly tipoElegido = computed(() =>
    this.tipos().find(t => t.id === this.nuevo.idTipoDia) ?? null);

  readonly rangoTexto = computed(() => {
    const inicio = new Date(this.lunes() + 'T00:00:00');
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 5);
    const mes = fin.toLocaleDateString('es-PE', { month: 'long' });
    return `${inicio.getDate()} – ${fin.getDate()} de ${mes}`;
  });

  readonly esSemanaActual = computed(() => this.lunes() === this.lunesDe(new Date()));

  readonly actualizado = computed(() => {
    const cuando = this.cargadoEn();
    return cuando
      ? `Actualizado a las ${cuando.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`
      : '';
  });

  /** El horario del primer día laborable: es el que la persona reconoce como «el suyo». */
  readonly horarioTexto = computed(() => {
    const dia = this.dias().find(d => d.horaEntradaHorario && d.horaSalidaHorario);
    return dia ? `${this.hhmm(dia.horaEntradaHorario!)} – ${this.hhmm(dia.horaSalidaHorario!)}` : '—';
  });

  /** Si algún día se sale de lo normal, se dice; si no, no se llena de texto. */
  readonly horarioNota = computed(() => {
    const distintos = this.dias().filter(d => d.horaSalidaHorario);
    if (distintos.length < 2) {
      return 'Según tu subcartera';
    }
    const raro = distintos.find(d => d.horaSalidaHorario !== distintos[0].horaSalidaHorario);
    return raro
      ? `${raro.nombreDia} hasta las ${this.hhmm(raro.horaSalidaHorario!)}`
      : 'Según tu subcartera';
  });

  ngOnInit(): void {
    this.servicio.tiposDeDia().subscribe({
      next: t => {
        this.tipos.set(t);
        this.nuevo.idTipoDia = t[0]?.id ?? null;
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de justificación')
    });
    this.cargar();
    this.cargarSolicitudes();
    this.cargarRecuperaciones();

    // Cada minuto: es la resolución del aviso («empieza en 5 minutos») y no
    // hace falta más. Con un canal abierto habría una pieza más que mantener.
    this.cargarAvisos();
    this.reloj = setInterval(() => this.cargarAvisos(), 60_000);
  }

  ngOnDestroy(): void {
    clearInterval(this.reloj);
  }

  private cargarAvisos(): void {
    this.servicio.misAvisos().subscribe({
      next: a => this.avisos.set(a.filter(x => !this.descartados.has(x.titulo))),
      error: () => { /* un aviso que no llega no rompe la pantalla */ }
    });
  }

  /** Cerrar un aviso lo silencia hasta que cambie: no vuelve cada minuto. */
  descartar(aviso: AvisoAsistencia): void {
    this.descartados.add(aviso.titulo);
    this.avisos.update(lista => lista.filter(a => a !== aviso));
  }

  /** Lo que se debe por días recuperables. Se abre solo al aprobar la justificación. */
  private cargarRecuperaciones(): void {
    this.servicio.misRecuperaciones().subscribe({
      next: r => this.recuperaciones.set(r),
      error: () => { /* si falla, la pantalla sigue sirviendo sin el aviso */ }
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
    this.archivo.set(null);
    this.nuevo = {
      idTipoDia: this.tipos()[0]?.id ?? null,
      fechaDesde: this.hoy(),
      fechaHasta: this.hoy(),
      comentario: ''
    };
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
    if (this.tipoElegido()?.exigeCertificado && !this.archivo()) {
      this.error.set(`${this.tipoElegido()!.nombre} necesita certificado adjunto`);
      return;
    }

    this.enviando.set(true);
    this.servicio.crearJustificacion({
      idTipoDia: this.nuevo.idTipoDia,
      fechaDesde: this.nuevo.fechaDesde,
      fechaHasta: this.nuevo.fechaHasta,
      comentario: this.nuevo.comentario,
      archivo: this.archivo()
    }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.cerrarSolicitud();
        this.toast.success('Solicitud enviada. La revisará tu supervisora');
        this.cargarSolicitudes();
      },
      error: respuesta => {
        this.enviando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo enviar la solicitud');
      }
    });
  }

  /** Abre el certificado en otra pestaña; no se descarga sin pedirlo. */
  verCertificado(s: Justificacion): void {
    this.servicio.certificado(s.id).subscribe({
      next: blob => window.open(URL.createObjectURL(blob), '_blank'),
      error: () => this.toast.error('No se pudo abrir el certificado')
    });
  }

  // ==================== PRESENTACIÓN ====================

  rango(inicio: string | null, fin: string | null): string {
    if (!inicio && !fin) {
      return '—';
    }
    return `${inicio ?? '—'} – ${fin ?? '—'}`;
  }

  esManual(dia: AsistenciaDia, tipo: string): boolean {
    return (dia.marcasManuales ?? []).includes(tipo as never);
  }

  textoIncompletos(): string {
    const dias = this.diasIncompletos().map(d => d.nombreDia).join(', ');
    return this.diasIncompletos().length === 1
      ? `Falta una marca del ${dias}.`
      : `Faltan marcas de: ${dias}.`;
  }

  textoAbiertas(): string {
    const abiertas = this.abiertas();
    if (!abiertas.length) {
      return 'Nada pendiente';
    }
    const primera = abiertas[0];
    return `${primera.tipo} del ${this.corta(primera.fechaDesde)}`;
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

  private hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  private corta(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia}/${mes}`;
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private lunesDe(fecha: Date): string {
    const copia = new Date(fecha);
    copia.setDate(copia.getDate() - ((copia.getDay() + 6) % 7));
    return copia.toISOString().slice(0, 10);
  }

  private sumarDias(fecha: string, dias: number): string {
    const copia = new Date(fecha + 'T00:00:00');
    copia.setDate(copia.getDate() + dias);
    return copia.toISOString().slice(0, 10);
  }
}
