import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  EstadoAgentesReportService,
  ResumenEstadoAgentes,
  ResumenPorAgente,
  RegistroEstadoDTO,
  RegistroAsistenciaDTO,
  ResumenAsistencia,
  AgenteOption
} from './estado-agentes-report.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';

/** Vistas de columnas. La tabla completa son 30 columnas: solo "todo" las abre. */
type Vista = 'resumen' | 'cola' | 'fuera' | 'pausas' | 'todo';
type Grupo = 'jornada' | 'cola' | 'fuera' | 'otras' | 'reunion' | 'pausa' | 'ind';

interface Col {
  k: string;
  l: string;
  g: Grupo;
  tipo: 'hora' | 'min' | 'pct' | 'ind' | 'comp';
  /** Subtotal del grupo: va en negrita. */
  fuerte?: boolean;
  /** Primera columna del grupo: lleva separador. */
  sep?: boolean;
  v: Vista[];
}

interface TramoTL {
  left: number;
  width: number;
  /** Color plano, o el rayado de los tramos sin actividad. */
  color: string;
  label: string;
  claro: boolean;
  titulo: string;
  /** Tiempo fuera del sistema: registrado como DESCONECTADO o sin fila en el historial. */
  hueco: boolean;
  duracion: string;
}

const TODAS: Vista[] = ['resumen', 'cola', 'fuera', 'pausas', 'todo'];

@Component({
  selector: 'app-estado-agentes-report',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]
                text-[#0f172a] p-4 md:p-5 dark:bg-slate-950 dark:text-slate-100">

      <!-- ============ Cabecera ============ -->
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.015em]">Estados por Agente</h1>
          <p class="mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
        </div>
        <div class="flex gap-2">
          <button type="button" (click)="onExportar()"
            [disabled]="anyLoading() || !hayDatosParaExportar()"
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-[#d5dbe3] bg-white px-3.5
                   text-[12.5px] font-bold transition-colors hover:border-[#8491a3] hover:bg-[#f8fafc]
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800">
            <lucide-angular name="download" [size]="15"></lucide-angular>
            Excel
          </button>
          <button type="button" (click)="onBuscar()"
            [disabled]="anyLoading() || !filtrosCompletos()"
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[12.5px]
                   font-bold text-white transition-colors hover:bg-[#1e293b]
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            @if (anyLoading()) {
              <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
              Buscando
            } @else {
              <lucide-angular name="search" [size]="15"></lucide-angular>
              Buscar
            }
          </button>
        </div>
      </div>

      <!-- ============ Filtros ============ -->
      <div class="mb-3 flex flex-wrap items-end gap-2.5">
        @if (activeTab() === 'asistencia') {
          <div class="flex flex-col gap-1.5">
            <label for="f-desde" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Desde</label>
            <input id="f-desde" type="date" [(ngModel)]="filtrosAsistencia.fechaDesde" [class]="claseInput"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="f-hasta" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Hasta</label>
            <input id="f-hasta" type="date" [(ngModel)]="filtrosAsistencia.fechaHasta" [class]="claseInput"/>
          </div>
        } @else {
          <div class="flex flex-col gap-1.5">
            <label for="f-fecha" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Fecha</label>
            <input id="f-fecha" type="date" [(ngModel)]="filtros.fecha" [class]="claseInput"/>
          </div>
        }

        <div class="flex flex-col gap-1.5">
          <label for="f-cli" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Cliente</label>
          <select id="f-cli" [(ngModel)]="filtros.idProveedor" (ngModelChange)="onProveedorChange($event)" [class]="claseInput">
            <option [ngValue]="null">Todos</option>
            @for (p of proveedores(); track p.id) {
              <option [ngValue]="p.id">{{ p.nombreInquilino }}</option>
            }
          </select>
        </div>

        <span class="pb-2.5 text-[#c5ccd6]">&rsaquo;</span>

        <div class="flex flex-col gap-1.5">
          <label for="f-car" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Cartera</label>
          <select id="f-car" [(ngModel)]="filtros.idCartera" (ngModelChange)="onCarteraChange($event)"
                  [disabled]="carteras().length === 0" [class]="claseInput">
            <option [ngValue]="null">Todas</option>
            @for (c of carteras(); track c.id) {
              <option [ngValue]="c.id">{{ c.nombreCartera }}</option>
            }
          </select>
        </div>

        <span class="pb-2.5 text-[#c5ccd6]">&rsaquo;</span>

        <div class="flex flex-col gap-1.5">
          <label for="f-sub" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Subcartera</label>
          <select id="f-sub" [(ngModel)]="filtros.idSubcartera" (ngModelChange)="onSubcarteraChange($event)"
                  [disabled]="subcarteras().length === 0" [class]="claseInput">
            <option [ngValue]="null">Todas</option>
            @for (s of subcarteras(); track s.id) {
              <option [ngValue]="s.id">{{ s.nombreSubcartera }}</option>
            }
          </select>
        </div>

        <label class="flex h-[38px] min-w-[190px] flex-1 items-center gap-2.5 rounded-lg border border-[#d5dbe3]
                      bg-white px-3 dark:border-slate-700 dark:bg-slate-900">
          <lucide-angular name="search" [size]="14" class="shrink-0 text-[#8491a3]"></lucide-angular>
          <input type="text" [ngModel]="buscarAgente()" (ngModelChange)="buscarAgente.set($event)"
            [placeholder]="activeTab() === 'asistencia' ? 'Filtrar por agente o estado' : 'Buscar asesor por nombre'"
            aria-label="Buscar asesor"
            class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] outline-none
                   placeholder:text-[#8491a3] dark:text-slate-100"/>
        </label>
      </div>

      <!-- Filtros propios de Asistencia -->
      @if (activeTab() === 'asistencia') {
        <div class="mb-3 flex flex-wrap items-end gap-2.5 rounded-xl border border-[#e6e9ee] bg-white px-4 py-3
                    dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-col gap-1.5">
            <label for="f-hora" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Hora de entrada</label>
            <input id="f-hora" type="time" step="1" [(ngModel)]="filtrosAsistencia.horaEntrada" [class]="claseInput"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="f-tol" class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Tolerancia (min)</label>
            <input id="f-tol" type="number" min="0" max="120" [(ngModel)]="filtrosAsistencia.toleranciaMin"
                   [class]="claseInput + ' w-[120px]'"/>
          </div>

          <div class="relative flex flex-col gap-1.5">
            <label class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Agentes</label>
            <button type="button" (click)="showAgentePicker.set(!showAgentePicker())"
              [disabled]="agentesDisponibles().length === 0"
              class="flex h-[38px] min-w-[210px] items-center justify-between gap-2 rounded-lg border
                     border-[#d5dbe3] bg-white px-3 text-[13px] font-semibold disabled:opacity-50
                     dark:border-slate-700 dark:bg-slate-900">
              <span class="truncate">{{ etiquetaAgentes() }}</span>
              <lucide-angular name="chevron-down" [size]="15" class="shrink-0 text-[#8491a3]"></lucide-angular>
            </button>
            @if (showAgentePicker()) {
              <div class="absolute top-full z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border
                          border-[#e6e9ee] bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div class="sticky top-0 flex gap-3 border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-2
                            dark:border-slate-700 dark:bg-slate-800">
                  <button type="button" (click)="seleccionarTodosAgentes()"
                          class="text-[11.5px] font-bold text-[#2563eb] hover:underline">Todos</button>
                  <button type="button" (click)="limpiarAgentes()"
                          class="text-[11.5px] font-bold text-[#5f6c80] hover:underline">Ninguno</button>
                </div>
                @for (ag of agentesDisponibles(); track ag.id) {
                  <label class="flex cursor-pointer items-center gap-2 px-3 py-2 text-[13px] hover:bg-[#f8fafc]
                                dark:hover:bg-slate-800">
                    <input type="checkbox" [checked]="agentesSeleccionados().includes(ag.id)"
                           (change)="toggleAgente(ag.id)" class="rounded border-[#c5ccd6] text-[#2563eb]"/>
                    <span class="truncate">{{ ag.nombre }}</span>
                  </label>
                }
              </div>
            }
          </div>

          <label class="flex h-[38px] cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#334155]
                        dark:text-slate-300">
            <input type="checkbox" [(ngModel)]="filtrosAsistencia.incluirDomingos"
                   class="rounded border-[#c5ccd6] text-[#2563eb]"/>
            Incluir domingos
          </label>

          <p class="pb-2 text-[11.5px] text-[#8491a3]">
            {{ agentesDisponibles().length === 0
                ? 'Elegí una subcartera para acotar la lista de agentes'
                : 'Minutos de gracia antes de marcar TARDE' }}
          </p>
        </div>
      }

      @if (!filtrosCompletos()) {
        <p class="mb-3 rounded-[10px] border border-[#f3e2c0] bg-[#fdf6e7] px-3 py-2 text-[12.5px] font-semibold text-[#b45309]">
          {{ activeTab() === 'asistencia' ? 'El rango de fechas es obligatorio' : 'La fecha es obligatoria' }}
        </p>
      }

      <!-- ============ Pestañas ============ -->
      <div class="mb-4 flex h-[38px] w-fit rounded-lg border border-[#c5ccd6] bg-white p-[3px]
                  dark:border-slate-600 dark:bg-slate-800">
        <button type="button" (click)="cambiarTab('resumen')" [attr.aria-pressed]="activeTab() === 'resumen'"
                [class]="claseTab(activeTab() === 'resumen')">Resumen por Agente</button>
        <button type="button" (click)="cambiarTab('asistencia')" [attr.aria-pressed]="activeTab() === 'asistencia'"
                [class]="claseTab(activeTab() === 'asistencia')">Asistencia</button>
      </div>

      <!-- ============ TAB RESUMEN ============ -->
      @if (activeTab() === 'resumen') {
        @if (resumen()) {
          <!-- Indicadores del equipo -->
          @if (total(); as t) {
          <div class="mb-3 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
            <div [class]="claseKpi">
              <span [class]="claseKpiK">Asesores</span>
              <span [class]="claseKpiV">{{ agentesFiltrados().length }}</span>
              <span [class]="claseKpiS">conectados en la fecha</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">Conectado</span>
              <span [class]="claseKpiV">{{ formatSeg(t.totalSegundosConectado) }}</span>
              <span [class]="claseKpiS">suma de la jornada</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">% Ocupación</span>
              <span [class]="claseKpiV + ' ' + colorOcupacion(t.porcentajeOcupacion)">{{ t.porcentajeOcupacion }}%</span>
              <span [class]="claseKpiS">Productivo / (Conectado − Pausas)</span>
              <span [class]="claseMeter"><i [class]="fondoOcupacion(t.porcentajeOcupacion)"
                    [style.width.%]="min100(t.porcentajeOcupacion)"></i></span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">% En cola</span>
              <span [class]="claseKpiV">{{ t.porcentajeEnCola }}%</span>
              <span [class]="claseKpiS">En cola / Conectado</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">% Ocioso</span>
              <span [class]="claseKpiV + ' ' + colorOcioso(t.porcentajeOcioso)">{{ t.porcentajeOcioso }}%</span>
              <span [class]="claseKpiS">Ocioso / En cola</span>
              <span [class]="claseMeter"><i [class]="fondoOcioso(t.porcentajeOcioso)"
                    [style.width.%]="min100(t.porcentajeOcioso)"></i></span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">% Pausas</span>
              <span [class]="claseKpiV">{{ t.porcentajePausas }}%</span>
              <span [class]="claseKpiS">Pausas / Conectado</span>
            </div>
          </div>
          }

          <!-- Vistas + leyenda -->
          <div class="mb-2.5 flex flex-wrap items-center gap-3">
            <div class="flex h-[38px] max-w-full overflow-x-auto rounded-lg border border-[#c5ccd6] bg-white p-[3px]
                        dark:border-slate-600 dark:bg-slate-800" role="group" aria-label="Vista de columnas">
              @for (v of vistasDisponibles; track v.k) {
                <button type="button" (click)="vista.set(v.k)" [attr.aria-pressed]="vista() === v.k"
                        [class]="claseTab(vista() === v.k)">{{ v.l }}</button>
              }
            </div>
            <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">
              <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ columnas().length }}</b> de 30 columnas ·
              <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ agentesFiltrados().length }}</b> asesores
            </span>
            <div class="ml-auto flex flex-wrap items-center gap-x-4 gap-y-1.5">
              @for (g of leyenda; track g.k) {
                <span class="flex items-center gap-1.5 text-[11.5px] font-semibold text-[#334155] dark:text-slate-300">
                  <span class="h-2.5 w-2.5 shrink-0 rounded-[3px]" [style.background]="g.color"></span>{{ g.l }}
                </span>
              }
            </div>
          </div>

          <!-- Tabla -->
          <div class="max-h-[440px] overflow-auto rounded-xl border border-[#e6e9ee] bg-white
                      dark:border-slate-800 dark:bg-slate-900">
            <table class="w-full border-separate border-spacing-0 text-[12px] tabular-nums">
              <thead>
                <tr>
                  <th [class]="claseThAgente + ' sticky top-0 z-[4] h-[26px]'"></th>
                  @for (gr of gruposVisibles(); track gr.g) {
                    <th [colSpan]="gr.n"
                        [class]="'sticky top-0 z-[3] h-[26px] whitespace-nowrap border-b border-l border-[#e6e9ee] bg-[#f8fafc] px-2.5 text-[10px] font-extrabold uppercase tracking-[0.07em] dark:border-slate-800 dark:bg-slate-800 ' + colorGrupo(gr.g)">
                      {{ etiquetaGrupo(gr.g) }}
                    </th>
                  }
                </tr>
                <tr>
                  <th [class]="claseThAgente + ' sticky top-[26px] z-[4]'">Asesor</th>
                  @for (c of columnas(); track c.k) {
                    <th (click)="ordenarPor(c)" [attr.tabindex]="ordenable(c) ? 0 : null"
                        (keydown.enter)="ordenarPor(c)"
                        [class]="'sticky top-[26px] z-[3] whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] px-2.5 py-2 text-center text-[11.5px] font-bold text-[#334155] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 '
                                 + (c.sep ? 'border-l border-l-[#e6e9ee] dark:border-l-slate-800 ' : '')
                                 + (ordenable(c) ? 'cursor-pointer hover:text-[#2563eb]' : '')">
                      {{ c.l }}
                      @if (orden() === c.k) {
                        <span class="ml-1 text-[9px] text-[#2563eb]">{{ ordenAsc() ? '▲' : '▼' }}</span>
                      }
                    </th>
                  }
                </tr>
              </thead>

              <tbody>
                @if (loading()) {
                  <tr><td [attr.colspan]="columnas().length + 1" class="px-4 py-10 text-center text-[#5f6c80]">
                    <lucide-angular name="loader-2" [size]="28" class="mx-auto mb-2 animate-spin"></lucide-angular>
                    <p>Cargando reporte…</p>
                  </td></tr>
                } @else if (agentesFiltrados().length === 0) {
                  <tr><td [attr.colspan]="columnas().length + 1" class="px-4 py-10 text-center text-[#5f6c80]">
                    <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
                    <p>{{ (resumen()?.agentes?.length ?? 0) === 0
                          ? 'Elegí la fecha y presioná Buscar'
                          : 'Ningún asesor coincide con la búsqueda' }}</p>
                  </td></tr>
                } @else {
                  @for (a of agentesFiltrados(); track a.idUsuario) {
                    <tr (click)="seleccionar(a)" tabindex="0" (keydown.enter)="seleccionar(a)"
                        [class]="'cursor-pointer ' + (seleccionado()?.idUsuario === a.idUsuario
                                  ? 'bg-[#f5f9ff] dark:bg-slate-800'
                                  : 'bg-white hover:bg-[#f4f6f9] dark:bg-slate-900 dark:hover:bg-slate-800/60')">
                      <td [class]="claseTdAgente + (seleccionado()?.idUsuario === a.idUsuario
                                   ? ' shadow-[inset_3px_0_0_#2563eb]' : '')">
                        <span class="block text-[12.5px] font-bold tracking-[-0.01em]">{{ a.nombreAgente }}</span>
                        <span class="text-[10.5px] font-semibold text-[#8491a3]">{{ a.username }}</span>
                      </td>
                      @for (c of columnas(); track c.k) {
                        <td [class]="claseTd(c, a)">
                          @switch (c.tipo) {
                            @case ('comp') {
                              <span class="inline-flex h-2.5 w-[150px] gap-[2px] overflow-hidden rounded-full
                                           bg-[#e2e8f0] shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] dark:bg-slate-800"
                                    role="img" [attr.aria-label]="'Composición de la jornada de ' + a.nombreAgente">
                                @for (p of composicion(a); track p.k) {
                                  <i class="block h-full" [style.width.%]="p.pct" [style.background]="p.color"
                                     [title]="p.titulo"></i>
                                }
                              </span>
                            }
                            @case ('ind') {
                              <span class="inline-flex min-w-[56px] flex-col gap-1">
                                <b [class]="'text-[12px] font-extrabold ' + colorInd(c.k, num(a, c.k))">{{ num(a, c.k) }}%</b>
                                <span class="h-1 overflow-hidden rounded-full bg-[#e2e8f0] dark:bg-slate-800">
                                  <i class="block h-full rounded-full" [class]="fondoInd(c.k, num(a, c.k))"
                                     [style.width.%]="min100(num(a, c.k))"></i>
                                </span>
                              </span>
                            }
                            @default { {{ texto(a, c) }} }
                          }
                        </td>
                      }
                    </tr>
                  }
                }
              </tbody>

              @if (agentesFiltrados().length > 0) {
                <tfoot>
                  <tr class="bg-[#f4f6f9] dark:bg-slate-800">
                    <td [class]="claseTdAgente + ' sticky bottom-0 z-[3] border-t border-[#d5dbe3]'">
                      <span class="block text-[12.5px] font-extrabold">TOTAL</span>
                      <span class="text-[10.5px] font-semibold text-[#8491a3]">{{ agentesFiltrados().length }} asesores</span>
                    </td>
                    @for (c of columnas(); track c.k) {
                      <td [class]="'sticky bottom-0 z-[2] whitespace-nowrap border-t border-[#d5dbe3] bg-inherit px-2.5 py-2 text-center text-[12px] font-extrabold dark:border-slate-700 '
                                   + (c.sep ? 'border-l border-l-[#e6e9ee] dark:border-l-slate-800' : '')">
                        @if (c.tipo === 'ind' || c.tipo === 'pct') {
                          {{ num(total()!, c.k) }}%
                        } @else if (c.tipo === 'min') {
                          {{ formatSeg(num(total()!, c.k)) }}
                        }
                      </td>
                    }
                  </tr>
                </tfoot>
              }
            </table>
          </div>

          <!-- Detalle del asesor -->
          @if (seleccionado(); as a) {
            <section class="mt-3 flex flex-col gap-3 rounded-xl border border-[#e6e9ee] bg-white px-4 py-3.5
                            dark:border-slate-800 dark:bg-slate-900">
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h3 class="!m-0 text-[15px] font-extrabold tracking-[-0.01em]">{{ a.nombreAgente }}</h3>
                <span class="rounded-md bg-[#f4f6f9] px-2 py-0.5 text-[11.5px] font-semibold tabular-nums
                             text-[#334155] dark:bg-slate-800 dark:text-slate-300">
                  {{ a.username }} · entrada {{ a.horaEntrada || '—' }} · salida {{ a.horaSalida || '—' }}
                  · conectado {{ formatSeg(a.totalSegundosConectado) }}
                </span>
              </div>

              <!-- Línea de tiempo del día -->
              @if (tramosLoading()) {
                <div class="flex h-12 items-center justify-center rounded-[10px] border border-[#e6e9ee] bg-[#f8fafc]
                            text-[12px] text-[#5f6c80] dark:border-slate-800 dark:bg-slate-950">
                  <lucide-angular name="loader-2" [size]="16" class="mr-2 animate-spin"></lucide-angular>
                  Cargando la jornada…
                </div>
              } @else if (lineaTiempo().length > 0) {
                <div>
                  <!-- Zoom: en 1x entra el día completo; hasta 8x para mirar una hora puntual -->
                  <div class="mb-1.5 flex flex-wrap items-center gap-2">
                    <div class="flex h-8 items-center rounded-lg border border-[#d5dbe3] bg-white p-[3px]
                                dark:border-slate-700 dark:bg-slate-900">
                      <button type="button" (click)="cambiarZoom(-1, cajaTL)" [disabled]="zoom() === ZOOMS[0]"
                              aria-label="Alejar"
                              class="flex h-full w-7 items-center justify-center rounded-[5px] text-[#5f6c80]
                                     hover:bg-[#f4f6f9] disabled:opacity-40 dark:hover:bg-slate-800">
                        <lucide-angular name="minus" [size]="14"></lucide-angular>
                      </button>
                      <span class="w-9 text-center text-[11.5px] font-bold tabular-nums">{{ zoom() }}x</span>
                      <button type="button" (click)="cambiarZoom(1, cajaTL)"
                              [disabled]="zoom() === ZOOMS[ZOOMS.length - 1]" aria-label="Acercar"
                              class="flex h-full w-7 items-center justify-center rounded-[5px] text-[#5f6c80]
                                     hover:bg-[#f4f6f9] disabled:opacity-40 dark:hover:bg-slate-800">
                        <lucide-angular name="plus" [size]="14"></lucide-angular>
                      </button>
                    </div>
                    @if (zoom() > 1) {
                      <button type="button" (click)="ajustarZoom(cajaTL)"
                              class="h-8 rounded-lg border border-[#d5dbe3] bg-white px-3 text-[11.5px] font-bold
                                     text-[#5f6c80] hover:border-[#8491a3] dark:border-slate-700 dark:bg-slate-900">
                        Ver todo el día
                      </button>
                      <span class="text-[11.5px] text-[#8491a3]">Desplazá la barra para ir a la hora que quieras</span>
                    }
                    <span class="ml-auto flex items-center gap-1.5 text-[11.5px] font-semibold text-[#334155]
                                 dark:text-slate-300">
                      <span class="h-2.5 w-2.5 rounded-[3px] border border-[#d5dbe3]" [style.background]="RAYADO"></span>
                      Fuera del sistema
                    </span>
                  </div>

                  <div #cajaTL class="overflow-x-auto overflow-y-hidden rounded-[10px] border border-[#e6e9ee]
                                      bg-[#f8fafc] pb-1.5 dark:border-slate-800 dark:bg-slate-950">
                    <div [style.width.%]="zoom() * 100">
                      <div class="relative h-[72px] overflow-hidden">
                        @for (s of lineaTiempo(); track $index) {
                          <div class="absolute top-0 bottom-0 flex items-center justify-center overflow-hidden
                                      border-r-2 border-white dark:border-slate-900"
                               [style.left.%]="s.left" [style.width.%]="s.width" [style.background]="s.color"
                               [title]="s.titulo">
                            @if (cabeEtiqueta(s.width)) {
                              <span [class]="'whitespace-nowrap px-1 text-[10px] font-bold ' +
                                             (s.claro ? 'text-[#3b2a00]' : 'text-white [text-shadow:0_1px_1px_rgba(15,23,42,.25)]')">
                                {{ s.label }}@if (s.hueco) {<span class="font-semibold"> · {{ s.duracion }}</span>}
                              </span>
                            }
                          </div>
                        }
                      </div>
                      <div class="relative h-[18px]">
                        @for (h of horasEje(); track h.left) {
                          <i class="absolute top-0 block h-1.5 w-px bg-[#d5dbe3]" [style.left.%]="h.left"></i>
                          <span class="absolute top-[7px] -translate-x-1/2 text-[10px] font-semibold tabular-nums
                                       text-[#8491a3]" [style.left.%]="h.left">{{ h.l }}</span>
                        }
                      </div>
                    </div>
                  </div>

                  @if (tramosParciales()) {
                    <p class="mt-1 text-[11.5px] text-[#b45309]">
                      La jornada se dibuja con los primeros {{ tramosTotal() }} tramos del día: acotá por subcartera para verla completa.
                    </p>
                  }
                </div>
              } @else if (tramosError()) {
                <p class="text-[12px] text-[#8491a3]">No se pudo cargar el detalle de la jornada.</p>
              }

              <!-- Desglose -->
              <div class="grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(196px,1fr))]">
                @for (b of desglose(a); track b.g) {
                  <div class="flex flex-col gap-1.5 rounded-[10px] border border-[#e6e9ee] bg-[#f8fafc] px-3 py-2.5
                              dark:border-slate-800 dark:bg-slate-950">
                    <h4 class="!m-0 flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.06em]
                               text-[#5f6c80] dark:text-slate-400">
                      <span class="h-2.5 w-2.5 rounded-[3px]" [style.background]="b.color"></span>{{ b.l }}
                    </h4>
                    @for (f of b.filas; track f.l) {
                      <div class="flex justify-between gap-2.5 text-[12px] font-medium text-[#5f6c80] dark:text-slate-400">
                        <span>{{ f.l }}</span>
                        <b [class]="'tabular-nums font-bold ' + (f.v ? 'text-[#0f172a] dark:text-slate-100' : 'font-medium text-[#8491a3]')">
                          {{ f.v ? formatSeg(f.v) : '—' }}
                        </b>
                      </div>
                    }
                    <div class="mt-0.5 flex justify-between gap-2.5 border-t border-[#e6e9ee] pt-1.5 text-[12px]
                                font-medium text-[#334155] dark:border-slate-800 dark:text-slate-300">
                      <span>Total</span>
                      <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ formatSeg(b.total) }}</b>
                    </div>
                  </div>
                }
                <div class="flex flex-col gap-1.5 rounded-[10px] border border-[#e6e9ee] bg-[#f8fafc] px-3 py-2.5
                            dark:border-slate-800 dark:bg-slate-950">
                  <h4 class="!m-0 text-[10.5px] font-extrabold uppercase tracking-[0.06em] text-[#5f6c80] dark:text-slate-400">
                    Indicadores
                  </h4>
                  <div class="flex justify-between text-[12px] font-medium text-[#5f6c80] dark:text-slate-400">
                    <span>Productivo</span><b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ formatSeg(a.totalSegundosProductivo) }}</b>
                  </div>
                  <div class="flex justify-between text-[12px] font-medium text-[#5f6c80] dark:text-slate-400">
                    <span>% Ocupación</span><b [class]="'font-bold tabular-nums ' + colorOcupacion(a.porcentajeOcupacion)">{{ a.porcentajeOcupacion }}%</b>
                  </div>
                  <div class="flex justify-between text-[12px] font-medium text-[#5f6c80] dark:text-slate-400">
                    <span>% En cola</span><b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ a.porcentajeEnCola }}%</b>
                  </div>
                  <div class="flex justify-between text-[12px] font-medium text-[#5f6c80] dark:text-slate-400">
                    <span>% Ocioso</span><b [class]="'font-bold tabular-nums ' + colorOcioso(a.porcentajeOcioso)">{{ a.porcentajeOcioso }}%</b>
                  </div>
                  <div class="mt-0.5 flex justify-between border-t border-[#e6e9ee] pt-1.5 text-[12px] font-medium
                              text-[#334155] dark:border-slate-800 dark:text-slate-300">
                    <span>En línea</span><b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ formatSeg(a.totalSegundosEnLinea) }}</b>
                  </div>
                </div>
              </div>
            </section>
          }
        } @else if (!loading()) {
          <div class="rounded-xl border border-dashed border-[#c5ccd6] bg-white px-6 py-12 text-center
                      dark:border-slate-700 dark:bg-slate-900">
            <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
            <p class="text-[13px] text-[#5f6c80]">Elegí la fecha y presioná Buscar</p>
          </div>
        } @else {
          <div class="rounded-xl border border-[#e6e9ee] bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <lucide-angular name="loader-2" [size]="28" class="mx-auto mb-2 animate-spin text-[#8491a3]"></lucide-angular>
            <p class="text-[13px] text-[#5f6c80]">Cargando reporte…</p>
          </div>
        }
      }

      <!-- ============ TAB ASISTENCIA ============ -->
      @if (activeTab() === 'asistencia') {
        @if (asistenciaResumen(); as ra) {
          <div class="mb-3 grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <div [class]="claseKpi">
              <span [class]="claseKpiK">Puntualidad</span>
              <span [class]="claseKpiV + ' ' + colorPuntualidad(ra.porcentajePuntualidad)">{{ ra.porcentajePuntualidad }}%</span>
              <span [class]="claseKpiS">{{ ra.totalPuntual | number }} días puntuales</span>
              <span [class]="claseMeter"><i [class]="fondoPuntualidad(ra.porcentajePuntualidad)"
                    [style.width.%]="min100(ra.porcentajePuntualidad)"></i></span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">Tardanzas</span>
              <span [class]="claseKpiV + ' text-[#b45309]'">{{ ra.totalTarde | number }}</span>
              <span [class]="claseKpiS">días con ingreso tarde</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">Faltas</span>
              <span [class]="claseKpiV + ' text-[#b91c1c]'">{{ ra.totalFalta | number }}</span>
              <span [class]="claseKpiS">días sin conexión</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseKpiK">Minutos de tardanza</span>
              <span [class]="claseKpiV">{{ ra.totalMinutosTardanza | number }}</span>
              <span [class]="claseKpiS">acumulado {{ ra.tardanzaAcumulada }}</span>
            </div>
          </div>
        }

        <div class="mb-2.5 flex flex-wrap items-center gap-3">
          <div class="flex h-[38px] rounded-lg border border-[#c5ccd6] bg-white p-[3px] dark:border-slate-600 dark:bg-slate-800">
            <button type="button" (click)="asistenciaVista.set('diario')"
                    [class]="claseTab(asistenciaVista() === 'diario')">Detalle diario</button>
            <button type="button" (click)="asistenciaVista.set('agente')"
                    [class]="claseTab(asistenciaVista() === 'agente')">Resumen por agente</button>
          </div>
          @if (asistenciaRegistros().length > 0) {
            <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">
              <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ asistenciaResumen()?.totalAgentes }}</b> agentes ×
              <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ asistenciaResumen()?.totalDias }}</b> días laborables =
              <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ asistenciaRegistros().length | number }}</b> registros
            </span>
          }
        </div>

        <div class="overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900">
          @if (asistenciaVista() === 'diario') {
            <table class="w-full border-separate border-spacing-0 text-[12.5px] tabular-nums">
              <thead>
                <tr>
                  <th [class]="claseThA + ' text-left'">Fecha</th>
                  <th [class]="claseThA + ' text-left'">Agente</th>
                  <th [class]="claseThA">Ingreso</th>
                  <th [class]="claseThA">Salida</th>
                  <th [class]="claseThA">Estado</th>
                  <th [class]="claseThA">Tardanza</th>
                  <th [class]="claseThA + ' text-[#2563eb]'" title="Hora de la primera gestión tipificada del día">1ra gestión</th>
                  <th [class]="claseThA">Conectado</th>
                  <th [class]="claseThA">Jornada</th>
                </tr>
              </thead>
              <tbody>
                @if (asistenciaLoading()) {
                  <tr><td colspan="9" class="px-4 py-10 text-center text-[#5f6c80]">
                    <lucide-angular name="loader-2" [size]="28" class="mx-auto mb-2 animate-spin"></lucide-angular>
                    <p>Cargando asistencia…</p>
                  </td></tr>
                } @else if (filteredAsistencia().length === 0) {
                  <tr><td colspan="9" class="px-4 py-10 text-center text-[#5f6c80]">
                    <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
                    <p>{{ asistenciaRegistros().length === 0
                          ? 'Elegí el rango y presioná Buscar'
                          : 'Ningún registro coincide con el filtro' }}</p>
                  </td></tr>
                } @else {
                  @for (reg of filteredAsistencia(); track reg.fecha + '-' + reg.idUsuario) {
                    <tr class="hover:[&>td]:bg-[#f8fafc] dark:hover:[&>td]:bg-slate-800/60">
                      <td [class]="claseTdA + ' text-left font-semibold'">{{ reg.fecha }}</td>
                      <td [class]="claseTdA + ' text-left'">
                        <span class="block font-bold text-[#0f172a] dark:text-slate-100">{{ reg.nombreAgente }}</span>
                        <span class="text-[10.5px] font-semibold text-[#8491a3]">{{ reg.subcartera }}</span>
                      </td>
                      <td [class]="claseTdA">{{ reg.horaIngreso || '—' }}</td>
                      <td [class]="claseTdA">{{ reg.horaSalida || '—' }}</td>
                      <td [class]="claseTdA"><span [class]="getAsistenciaClass(reg.estadoAsistencia)">{{ reg.estadoAsistencia }}</span></td>
                      <td [class]="claseTdA + (reg.minutosTardanza > 0 ? ' font-bold text-[#b45309]' : ' text-[#8491a3]')">
                        {{ reg.minutosTardanza > 0 ? reg.minutosTardanza + ' min' : '—' }}
                      </td>
                      <td [class]="claseTdA + ' font-semibold text-[#2563eb]'">{{ reg.primeraGestionHora || '—' }}</td>
                      <td [class]="claseTdA">{{ reg.estadoAsistencia === 'FALTA' ? '—' : reg.tiempoConectado }}</td>
                      <td [class]="claseTdA">{{ reg.estadoAsistencia === 'FALTA' ? '—' : reg.jornada }}</td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          } @else {
            <table class="w-full border-separate border-spacing-0 text-[12.5px] tabular-nums">
              <thead>
                <tr>
                  <th [class]="claseThA + ' text-left'">Agente</th>
                  <th [class]="claseThA">Días trabajados</th>
                  <th [class]="claseThA + ' text-[#15803d]'">Puntual</th>
                  <th [class]="claseThA + ' text-[#b45309]'">Tarde</th>
                  <th [class]="claseThA + ' text-[#b91c1c]'">Falta</th>
                  <th [class]="claseThA">% Puntualidad</th>
                  <th [class]="claseThA">Min. tardanza</th>
                  <th [class]="claseThA">Prom. ingreso</th>
                </tr>
              </thead>
              <tbody>
                @if (filteredAsistenciaAgentes().length === 0) {
                  <tr><td colspan="8" class="px-4 py-10 text-center text-[#5f6c80]">
                    <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
                    <p>No hay datos para mostrar</p>
                  </td></tr>
                } @else {
                  @for (ag of filteredAsistenciaAgentes(); track ag.idUsuario) {
                    <tr class="hover:[&>td]:bg-[#f8fafc] dark:hover:[&>td]:bg-slate-800/60">
                      <td [class]="claseTdA + ' text-left'">
                        <span class="block font-bold text-[#0f172a] dark:text-slate-100">{{ ag.nombreAgente }}</span>
                        <span class="text-[10.5px] font-semibold text-[#8491a3]">{{ ag.username }}</span>
                      </td>
                      <td [class]="claseTdA + ' font-bold text-[#0f172a] dark:text-slate-100'">{{ ag.diasTrabajados }}</td>
                      <td [class]="claseTdA + ' font-bold text-[#15803d]'">{{ ag.diasPuntual }}</td>
                      <td [class]="claseTdA + ' font-bold text-[#b45309]'">{{ ag.diasTarde }}</td>
                      <td [class]="claseTdA + ' font-bold text-[#b91c1c]'">{{ ag.diasFalta }}</td>
                      <td [class]="claseTdA">
                        <span class="inline-flex min-w-[56px] flex-col gap-1">
                          <b [class]="'text-[12px] font-extrabold ' + colorPuntualidad(ag.porcentajePuntualidad)">{{ ag.porcentajePuntualidad }}%</b>
                          <span class="h-1 overflow-hidden rounded-full bg-[#e2e8f0] dark:bg-slate-800">
                            <i class="block h-full rounded-full" [class]="fondoPuntualidad(ag.porcentajePuntualidad)"
                               [style.width.%]="min100(ag.porcentajePuntualidad)"></i>
                          </span>
                        </span>
                      </td>
                      <td [class]="claseTdA">{{ ag.totalMinutosTardanza }}
                        <span class="text-[10.5px] text-[#8491a3]">({{ ag.tardanzaAcumulada }})</span>
                      </td>
                      <td [class]="claseTdA">{{ ag.promedioHoraIngreso || '—' }}</td>
                    </tr>
                  }
                }
              </tbody>
            </table>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class EstadoAgentesReportComponent implements OnInit {

  // ==================== SISTEMA VISUAL (tomado de /bot-voz) ====================
  readonly claseInput =
    'h-[38px] rounded-lg border border-[#d5dbe3] bg-white px-3 text-[13px] font-semibold text-[#0f172a] ' +
    'outline-none focus:border-[#2563eb] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
  readonly claseKpi =
    'flex flex-col gap-0.5 rounded-xl border border-[#e6e9ee] bg-white px-3.5 py-3 dark:border-slate-800 dark:bg-slate-900';
  readonly claseKpiK = 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400';
  readonly claseKpiV = 'text-[24px] font-extrabold leading-tight tracking-[-0.025em] tabular-nums';
  readonly claseKpiS = 'mt-auto text-[11px] font-medium text-[#8491a3]';
  readonly claseMeter =
    'mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[#e2e8f0] shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)] dark:bg-slate-800';
  readonly claseThAgente =
    'sticky left-0 min-w-[176px] whitespace-nowrap border-b border-r border-[#e6e9ee] bg-[#f8fafc] px-2.5 py-2 ' +
    'text-left text-[11.5px] font-bold text-[#334155] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300';
  /** El fondo lo hereda de la fila: asi la celda fija sigue al hover y a la seleccion. */
  readonly claseTdAgente =
    'sticky left-0 z-[1] min-w-[176px] whitespace-nowrap border-b border-r border-[#e6e9ee] bg-inherit px-2.5 py-2 ' +
    'text-left dark:border-slate-800';
  readonly claseThA =
    'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-2.5 text-center text-[11px] font-bold ' +
    'uppercase tracking-[0.05em] text-[#5f6c80] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400';
  readonly claseTdA =
    'whitespace-nowrap border-b border-[#e6e9ee] px-3 py-2 text-center font-medium text-[#334155] ' +
    'dark:border-slate-800 dark:text-slate-300';

  claseTab(activo: boolean): string {
    return 'shrink-0 rounded-[6px] px-3.5 text-[12.5px] font-bold transition-colors ' +
      (activo ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
              : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
  }

  // ==================== CATALOGO ====================
  /** Un color por grupo; dentro del grupo, un escalon por estado. */
  readonly GRUPOS: Record<string, { l: string; color: string }> = {
    cola:    { l: 'En cola',                color: '#2563eb' },
    otras:   { l: 'Otras tareas',           color: '#1baf7a' },
    reunion: { l: 'Reunión y capacitación', color: '#4a3aa7' },
    linea:   { l: 'En línea',               color: '#e87ba4' },
    pausa:   { l: 'Pausas',                 color: '#eda100' }
  };

  readonly ESTADOS: Record<string, { l: string; g: string; c: string; claro?: boolean }> = {
    EN_LLAMADA:       { l: 'Interactuando',       g: 'cola',    c: '#1746a2' },
    TIPIFICANDO:      { l: 'Tipificando',         g: 'cola',    c: '#2563eb' },
    DISPONIBLE:       { l: 'Ocioso',              g: 'cola',    c: '#86b6ef', claro: true },
    EN_MANUAL:        { l: 'Modo Manual',         g: 'cola',    c: '#475569' },
    GESTION_MANUAL:   { l: 'Ocupado',             g: 'otras',   c: '#0f7a55' },
    SEGUIMIENTO:      { l: 'Seguimiento',         g: 'otras',   c: '#1baf7a' },
    WHATSAPP:         { l: 'WhatsApp',            g: 'otras',   c: '#63c9a0', claro: true },
    CONSULTA_TIEMPOS: { l: 'Consulta de tiempos', g: 'otras',   c: '#a3e2c8', claro: true },
    EN_REUNION:       { l: 'Reunión',             g: 'reunion', c: '#4a3aa7' },
    CAPACITACION:     { l: 'Capacitación',        g: 'reunion', c: '#8b7fd1', claro: true },
    EN_LINEA:         { l: 'En línea',            g: 'linea',   c: '#e87ba4' },
    REFRIGERIO:       { l: 'BREAK',               g: 'pausa',   c: '#eda100', claro: true },
    COMIDA:           { l: 'Comida',              g: 'pausa',   c: '#b87a04' },
    SSHH:             { l: 'SSHH',                g: 'pausa',   c: '#f6cf74', claro: true },
    AUSENTE:          { l: 'Ausente',             g: 'pausa',   c: '#8a5c05' },
    SOPORTE:          { l: 'Soporte',             g: 'pausa',   c: '#fae4ae', claro: true },
    // No suma a Conectado y no tiene grupo en el reporte, pero en la linea de tiempo
    // tiene que verse: es el rato que el asesor estuvo fuera del sistema.
    DESCONECTADO:     { l: 'Desconectado',       g: 'desc',    c: '#d8dde3', claro: true }
  };

  /** Rayado para lo que no es actividad: desconexion registrada o tramo sin registro. */
  readonly RAYADO = 'repeating-linear-gradient(45deg,#d8dde3,#d8dde3 5px,#f1f3f6 5px,#f1f3f6 10px)';

  readonly leyenda = Object.entries(this.GRUPOS).map(([k, g]) => ({ k, l: g.l, color: g.color }));

  readonly vistasDisponibles: { k: Vista; l: string }[] = [
    { k: 'resumen', l: 'Resumen' },
    { k: 'cola',    l: 'En cola' },
    { k: 'fuera',   l: 'Fuera de la cola' },
    { k: 'pausas',  l: 'Pausas' },
    { k: 'todo',    l: 'Todo' }
  ];

  readonly COLS: Col[] = [
    { k: 'entrada', l: 'Entrada',   g: 'jornada', tipo: 'hora', v: ['resumen', 'todo'] },
    { k: 'salida',  l: 'Salida',    g: 'jornada', tipo: 'hora', v: ['resumen', 'todo'] },
    { k: 'con',     l: 'Conectado', g: 'jornada', tipo: 'min', fuerte: true, v: TODAS },
    { k: 'comp',    l: 'Composición de la jornada', g: 'jornada', tipo: 'comp', v: ['resumen', 'todo'] },

    { k: 'cola',  l: 'En cola',       g: 'cola', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'cola', 'todo'] },
    { k: 'inter', l: 'Interactuando', g: 'cola', tipo: 'min', v: ['cola', 'todo'] },
    { k: 'tipi',  l: 'Tipificando',   g: 'cola', tipo: 'min', v: ['cola', 'todo'] },
    { k: 'ocio',  l: 'Ocioso',        g: 'cola', tipo: 'min', v: ['resumen', 'cola', 'todo'] },

    { k: 'fuera', l: 'Fuera de la cola', g: 'fuera', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'fuera', 'todo'] },
    { k: 'linea', l: 'En línea',         g: 'fuera', tipo: 'min', v: ['resumen', 'fuera', 'todo'] },

    { k: 'otras', l: 'Otras tareas',        g: 'otras', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'fuera', 'todo'] },
    { k: 'ocup',  l: 'Ocupado',             g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },
    { k: 'seg',   l: 'Seguimiento',         g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },
    { k: 'wsp',   l: 'WhatsApp',            g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },
    { k: 'cons',  l: 'Consulta de tiempos', g: 'otras', tipo: 'min', v: ['fuera', 'todo'] },

    { k: 'reunion', l: 'Reunión y capacitación', g: 'reunion', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'fuera', 'todo'] },
    { k: 'reu',     l: 'Reunión',                g: 'reunion', tipo: 'min', v: ['fuera', 'todo'] },
    { k: 'capa',    l: 'Capacitación',           g: 'reunion', tipo: 'min', v: ['fuera', 'todo'] },

    { k: 'pausas', l: 'Pausas', g: 'pausa', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'pausas', 'todo'] },
    { k: 'brk',    l: 'BREAK',   g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
    { k: 'com',    l: 'Comida',  g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
    { k: 'ssh',    l: 'SSHH',    g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
    { k: 'aus',    l: 'Ausente', g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },
    { k: 'sop',    l: 'Soporte', g: 'pausa', tipo: 'min', v: ['pausas', 'todo'] },

    { k: 'prod',   l: 'Productivo',         g: 'ind', tipo: 'min', fuerte: true, sep: true, v: ['resumen', 'cola', 'todo'] },
    { k: 'pOcup',  l: '% Ocupación',        g: 'ind', tipo: 'ind', v: ['resumen', 'cola', 'todo'] },
    { k: 'pCola',  l: '% En cola',          g: 'ind', tipo: 'pct', v: ['cola', 'todo'] },
    { k: 'pFuera', l: '% Fuera de la cola', g: 'ind', tipo: 'pct', v: ['fuera', 'todo'] },
    { k: 'pOcio',  l: '% Ocioso',           g: 'ind', tipo: 'ind', v: ['resumen', 'cola', 'todo'] },
    { k: 'pPaus',  l: '% Pausas',           g: 'ind', tipo: 'pct', v: ['resumen', 'pausas', 'todo'] }
  ];

  // ==================== ESTADO ====================
  loading = signal(false);
  resumen = signal<ResumenEstadoAgentes | null>(null);
  activeTab = signal<'resumen' | 'asistencia'>('resumen');

  vista = signal<Vista>('resumen');
  orden = signal<string | null>(null);
  ordenAsc = signal(false);
  buscarAgente = signal('');
  seleccionado = signal<ResumenPorAgente | null>(null);

  /** Zoom de la linea de tiempo: 1x entra completa, 8x deja ver minuto a minuto. */
  zoom = signal(1);
  readonly ZOOMS = [1, 2, 4, 8];

  /** Tramos del dia para la linea de tiempo. Se piden recien al abrir un detalle. */
  tramos = signal<RegistroEstadoDTO[]>([]);
  tramosLoading = signal(false);
  tramosError = signal(false);
  tramosTotal = signal(0);
  tramosParciales = signal(false);

  // ==================== ASISTENCIA ====================
  asistenciaLoading = signal(false);
  asistenciaRegistros = signal<RegistroAsistenciaDTO[]>([]);
  asistenciaResumen = signal<ResumenAsistencia | null>(null);
  asistenciaVista = signal<'diario' | 'agente'>('diario');
  agentesDisponibles = signal<AgenteOption[]>([]);
  agentesSeleccionados = signal<number[]>([]);
  showAgentePicker = signal(false);

  filtrosAsistencia = {
    fechaDesde: '',
    fechaHasta: '',
    horaEntrada: '08:00:00',
    toleranciaMin: 0,
    incluirDomingos: false
  };

  filteredAsistencia = computed(() => {
    const filter = this.buscarAgente().toLowerCase().trim();
    const regs = this.asistenciaRegistros();
    if (!filter) return regs;
    return regs.filter(r =>
      r.nombreAgente?.toLowerCase().includes(filter) ||
      r.username?.toLowerCase().includes(filter) ||
      r.estadoAsistencia?.toLowerCase().includes(filter) ||
      r.fecha?.includes(filter)
    );
  });

  filteredAsistenciaAgentes = computed(() => {
    const filter = this.buscarAgente().toLowerCase().trim();
    const agentes = this.asistenciaResumen()?.agentes ?? [];
    if (!filter) return agentes;
    return agentes.filter(a =>
      a.nombreAgente?.toLowerCase().includes(filter) ||
      a.username?.toLowerCase().includes(filter)
    );
  });

  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);

  filtros = {
    fecha: '',
    idProveedor: null as number | null,
    idCartera: null as number | null,
    idSubcartera: null as number | null
  };

  constructor(
    private reporteService: EstadoAgentesReportService,
    private comisionesService: ComisionesService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    this.filtros.fecha = todayStr;

    // Asistencia arranca en el mes en curso: es un reporte de periodo, no de un dia
    this.filtrosAsistencia.fechaDesde = `${yyyy}-${mm}-01`;
    this.filtrosAsistencia.fechaHasta = todayStr;

    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (err) => console.error('Error cargando proveedores:', err)
    });
  }

  // ==================== COLUMNAS Y TABLA ====================
  columnas = computed(() => this.COLS.filter(c => c.v.includes(this.vista())));

  /** Los grupos de la cabecera salen de las columnas visibles, no de una lista aparte. */
  gruposVisibles = computed(() => {
    const out: { g: Grupo; n: number }[] = [];
    for (const c of this.columnas()) {
      const ultimo = out[out.length - 1];
      if (ultimo && ultimo.g === c.g) ultimo.n++;
      else out.push({ g: c.g, n: 1 });
    }
    return out;
  });

  etiquetaGrupo(g: Grupo): string {
    return {
      jornada: 'Jornada', cola: 'En cola', fuera: 'Fuera de la cola', otras: 'Otras tareas',
      reunion: 'Reunión y capacitación', pausa: 'Pausas', ind: 'Indicadores'
    }[g];
  }

  colorGrupo(g: Grupo): string {
    if (g === 'cola') return 'text-[#2563eb]';
    if (g === 'fuera' || g === 'otras' || g === 'reunion') return 'text-[#0e7a55]';
    if (g === 'pausa') return 'text-[#b45309]';
    return 'text-[#334155] dark:text-slate-300';
  }

  agentesFiltrados = computed(() => {
    const filtro = this.buscarAgente().toLowerCase().trim();
    const orden = this.orden();
    let lista = (this.resumen()?.agentes ?? []).slice();

    if (filtro) {
      lista = lista.filter(a =>
        a.nombreAgente?.toLowerCase().includes(filtro) || a.username?.toLowerCase().includes(filtro));
    }
    if (orden) {
      const asc = this.ordenAsc();
      lista.sort((x, y) => asc ? this.num(x, orden) - this.num(y, orden) : this.num(y, orden) - this.num(x, orden));
    }
    return lista;
  });

  /**
   * Fila TOTAL. Se suman los segundos y recien despues se divide: promediar los
   * porcentajes de cada agente pesa igual al que estuvo 8 horas que al de 20 minutos.
   */
  total = computed<ResumenPorAgente | null>(() => {
    const ags = this.agentesFiltrados();
    if (!ags.length) return null;

    const s = (f: (a: ResumenPorAgente) => number) => ags.reduce((t, a) => t + (f(a) || 0), 0);
    const estados: { [k: string]: number } = {};
    for (const a of ags) {
      for (const [k, v] of Object.entries(a.segundosPorEstado ?? {})) estados[k] = (estados[k] || 0) + (v || 0);
    }

    const conectado = s(a => a.totalSegundosConectado);
    const enCola = s(a => a.totalSegundosEnCola);
    const pausas = s(a => a.totalSegundosPausa);
    const productivo = s(a => a.totalSegundosProductivo);
    const ocioso = s(a => a.totalSegundosOcioso);
    const fuera = conectado - enCola;

    return {
      idUsuario: -1, nombreAgente: 'TOTAL', username: `${ags.length} asesores`,
      segundosPorEstado: estados,
      totalSegundosConectado: conectado,
      totalSegundosEnCola: enCola,
      totalSegundosFueraDeCola: fuera,
      totalSegundosProductivo: productivo,
      totalSegundosOcioso: ocioso,
      totalSegundosEnLinea: s(a => a.totalSegundosEnLinea),
      totalSegundosOtrasTareas: s(a => a.totalSegundosOtrasTareas),
      totalSegundosReunion: s(a => a.totalSegundosReunion),
      totalSegundosPausa: pausas,
      tiempoConectadoFormateado: '', tiempoEnColaFormateado: '', tiempoFueraDeColaFormateado: '',
      tiempoProductivoFormateado: '', tiempoOciosoFormateado: '', tiempoEnLineaFormateado: '',
      tiempoOtrasTareasFormateado: '', tiempoReunionFormateado: '', tiempoPausaFormateado: '',
      porcentajeOcupacion: this.pct(productivo, conectado - pausas),
      porcentajeEnCola: this.pct(enCola, conectado),
      porcentajeFueraDeCola: this.pct(fuera, conectado),
      porcentajeOcioso: this.pct(ocioso, enCola),
      porcentajePausas: this.pct(pausas, conectado),
      horaEntrada: null, horaSalida: null, cantidadSesiones: 0
    } as ResumenPorAgente;
  });

  /** Valor numerico de una columna. Los estados sueltos salen del mapa del backend. */
  num(a: ResumenPorAgente, k: string): number {
    const est = (clave: string) => a.segundosPorEstado?.[clave] || 0;
    switch (k) {
      case 'con':     return a.totalSegundosConectado;
      case 'cola':    return a.totalSegundosEnCola;
      case 'inter':   return est('EN_LLAMADA');
      case 'tipi':    return est('TIPIFICANDO');
      case 'ocio':    return a.totalSegundosOcioso;
      case 'fuera':   return a.totalSegundosFueraDeCola;
      case 'linea':   return a.totalSegundosEnLinea;
      case 'otras':   return a.totalSegundosOtrasTareas;
      case 'ocup':    return est('GESTION_MANUAL');
      case 'seg':     return est('SEGUIMIENTO');
      case 'wsp':     return est('WHATSAPP');
      case 'cons':    return est('CONSULTA_TIEMPOS');
      case 'reunion': return a.totalSegundosReunion;
      case 'reu':     return est('EN_REUNION');
      case 'capa':    return est('CAPACITACION');
      case 'pausas':  return a.totalSegundosPausa;
      case 'brk':     return est('REFRIGERIO');
      case 'com':     return est('COMIDA');
      case 'ssh':     return est('SSHH');
      case 'aus':     return est('AUSENTE');
      case 'sop':     return est('SOPORTE');
      case 'prod':    return a.totalSegundosProductivo;
      case 'pOcup':   return a.porcentajeOcupacion;
      case 'pCola':   return a.porcentajeEnCola;
      case 'pFuera':  return a.porcentajeFueraDeCola;
      case 'pOcio':   return a.porcentajeOcioso;
      case 'pPaus':   return a.porcentajePausas;
      default:        return 0;
    }
  }

  texto(a: ResumenPorAgente, c: Col): string {
    if (c.tipo === 'hora') return (c.k === 'entrada' ? a.horaEntrada : a.horaSalida) || '—';
    if (c.tipo === 'pct') return this.num(a, c.k) + '%';
    const seg = this.num(a, c.k);
    return seg ? this.formatSeg(seg) : '—';
  }

  claseTd(c: Col, a: ResumenPorAgente): string {
    const base = 'whitespace-nowrap border-b border-[#e6e9ee] bg-inherit px-2.5 py-2 text-center font-medium ' +
      'text-[#334155] dark:border-slate-800 dark:text-slate-300 ';
    return base
      + (c.sep ? 'border-l border-l-[#e6e9ee] dark:border-l-slate-800 ' : '')
      + (c.fuerte ? 'font-extrabold text-[#0f172a] dark:text-slate-100 ' : '')
      + (c.tipo === 'min' && !this.num(a, c.k) ? 'text-[#8491a3]' : '');
  }

  ordenable(c: Col): boolean {
    return c.tipo !== 'comp' && c.tipo !== 'hora';
  }

  ordenarPor(c: Col): void {
    if (!this.ordenable(c)) return;
    if (this.orden() === c.k) this.ordenAsc.set(!this.ordenAsc());
    else { this.orden.set(c.k); this.ordenAsc.set(false); }
  }

  /** Reparto del tiempo conectado entre los cinco grupos, para la barra de la fila. */
  composicion(a: ResumenPorAgente): { k: string; pct: number; color: string; titulo: string }[] {
    const con = a.totalSegundosConectado || 1;
    const partes = [
      { k: 'cola',    v: a.totalSegundosEnCola,      g: 'cola' },
      { k: 'otras',   v: a.totalSegundosOtrasTareas, g: 'otras' },
      { k: 'reunion', v: a.totalSegundosReunion,     g: 'reunion' },
      { k: 'linea',   v: a.totalSegundosEnLinea,     g: 'linea' },
      { k: 'pausa',   v: a.totalSegundosPausa,       g: 'pausa' }
    ];
    return partes.filter(p => p.v > 0).map(p => ({
      k: p.k,
      pct: p.v / con * 100,
      color: this.GRUPOS[p.g].color,
      titulo: `${this.GRUPOS[p.g].l}: ${this.formatSeg(p.v)} (${Math.round(p.v / con * 100)}%)`
    }));
  }

  desglose(a: ResumenPorAgente): { g: string; l: string; color: string; total: number; filas: { l: string; v: number }[] }[] {
    const est = (k: string) => a.segundosPorEstado?.[k] || 0;
    return [
      { g: 'cola', l: this.GRUPOS['cola'].l, color: this.GRUPOS['cola'].color, total: a.totalSegundosEnCola,
        filas: [{ l: 'Interactuando', v: est('EN_LLAMADA') }, { l: 'Tipificando', v: est('TIPIFICANDO') },
                { l: 'Ocioso', v: a.totalSegundosOcioso }] },
      { g: 'otras', l: this.GRUPOS['otras'].l, color: this.GRUPOS['otras'].color, total: a.totalSegundosOtrasTareas,
        filas: [{ l: 'Ocupado', v: est('GESTION_MANUAL') }, { l: 'Seguimiento', v: est('SEGUIMIENTO') },
                { l: 'WhatsApp', v: est('WHATSAPP') }, { l: 'Consulta de tiempos', v: est('CONSULTA_TIEMPOS') }] },
      { g: 'reunion', l: this.GRUPOS['reunion'].l, color: this.GRUPOS['reunion'].color, total: a.totalSegundosReunion,
        filas: [{ l: 'Reunión', v: est('EN_REUNION') }, { l: 'Capacitación', v: est('CAPACITACION') }] },
      { g: 'pausa', l: this.GRUPOS['pausa'].l, color: this.GRUPOS['pausa'].color, total: a.totalSegundosPausa,
        filas: [{ l: 'BREAK', v: est('REFRIGERIO') }, { l: 'Comida', v: est('COMIDA') }, { l: 'SSHH', v: est('SSHH') },
                { l: 'Ausente', v: est('AUSENTE') }, { l: 'Soporte', v: est('SOPORTE') }] }
    ];
  }

  // ==================== LINEA DE TIEMPO ====================
  seleccionar(a: ResumenPorAgente): void {
    this.seleccionado.set(a);
    this.zoom.set(1);
    if (this.tramos().length === 0 && !this.tramosLoading()) this.cargarTramos();
  }

  /**
   * Los tramos ya vienen en el endpoint del reporte; el resumen no los usaba. Se piden
   * una sola vez por busqueda, con un tope alto, y recien cuando se abre un detalle.
   */
  private cargarTramos(): void {
    this.tramosLoading.set(true);
    this.tramosError.set(false);

    this.reporteService.getReporte(
      this.filtros.fecha, this.filtros.fecha,
      this.filtros.idProveedor || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined,
      0, 3000
    ).subscribe({
      next: (res) => {
        this.tramos.set(res.registros ?? []);
        this.tramosTotal.set(res.total ?? 0);
        this.tramosParciales.set((res.total ?? 0) > (res.registros?.length ?? 0));
        this.tramosLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando los tramos del dia:', err);
        this.tramosError.set(true);
        this.tramosLoading.set(false);
      }
    });
  }

  /** "yyyy-MM-dd HH:mm:ss" -> minutos desde medianoche. Otro dia se recorta al borde. */
  private minutos(ts: string | null, dia: string): number | null {
    if (!ts || ts.length < 16) return null;
    const fecha = ts.slice(0, 10);
    if (fecha < dia) return 0;
    if (fecha > dia) return 24 * 60 - 1;
    return +ts.slice(11, 13) * 60 + +ts.slice(14, 16);
  }

  private tramosDelAgente = computed(() => {
    const a = this.seleccionado();
    if (!a) return [] as { ini: number; fin: number; estado: string }[];
    const dia = this.filtros.fecha;

    return this.tramos()
      .filter(r => r.idUsuario === a.idUsuario)
      .map(r => ({
        ini: this.minutos(r.timestampInicio, dia),
        fin: this.minutos(r.timestampFin, dia),
        estado: r.estadoNuevo
      }))
      .filter((r): r is { ini: number; fin: number; estado: string } =>
        r.ini !== null && r.fin !== null && r.fin > r.ini && !!this.ESTADOS[r.estado])
      .sort((x, y) => x.ini - y.ini);
  });

  /** Ventana del dibujo: de la hora en punto anterior a la entrada a la posterior a la salida. */
  private ventana = computed(() => {
    const t = this.tramosDelAgente();
    if (!t.length) return { desde: 0, hasta: 0 };
    const desde = Math.floor(t[0].ini / 60) * 60;
    const hasta = Math.ceil(Math.max(...t.map(x => x.fin)) / 60) * 60;
    return { desde, hasta: Math.max(hasta, desde + 60) };
  });

  /**
   * Dibujo de la jornada. Ademas de los tramos, marca lo que NO tiene actividad:
   *   - DESCONECTADO: el asesor salio y volvio, y el sistema lo registro con inicio y fin.
   *   - Sin registro: no hay fila en el historial. Pasa con el tramo que sigue abierto
   *     (no se escribe hasta que cambie de estado) o si el historial quedo incompleto.
   * Antes los dos quedaban en blanco y no se distinguian de un error de dibujo.
   */
  lineaTiempo = computed<TramoTL[]>(() => {
    const { desde, hasta } = this.ventana();
    const largo = hasta - desde;
    if (largo <= 0) return [];

    const pieza = (ini: number, fin: number, label: string, color: string,
                   claro: boolean, hueco: boolean, nota = ''): TramoTL => ({
      left: (ini - desde) / largo * 100,
      width: (fin - ini) / largo * 100,
      color, label, claro, hueco,
      duracion: this.formatSeg((fin - ini) * 60),
      titulo: `${label} · ${this.hhmm(ini)} – ${this.hhmm(fin)} · ${this.formatSeg((fin - ini) * 60)}${nota}`
    });

    const out: TramoTL[] = [];
    let cursor: number | null = null;

    for (const s of this.tramosDelAgente()) {
      if (cursor !== null && s.ini > cursor) {
        out.push(pieza(cursor, s.ini, 'Sin registro', this.RAYADO, true, true,
          ' · el historial no tiene ninguna fila en ese rango'));
      }
      const e = this.ESTADOS[s.estado];
      const esDesc = s.estado === 'DESCONECTADO';
      out.push(pieza(s.ini, s.fin, e.l, esDesc ? this.RAYADO : e.c, !!e.claro, esDesc));
      cursor = Math.max(cursor ?? 0, s.fin);
    }
    return out;
  });

  /** Con mas zoom caben mas marcas: de 2 horas a 10 minutos. */
  horasEje = computed(() => {
    const { desde, hasta } = this.ventana();
    const largo = hasta - desde;
    if (largo <= 0) return [] as { left: number; l: string }[];

    const base = largo > 600 ? 120 : 60;
    const paso = Math.max(10, Math.round(base / this.zoom()));
    const primero = Math.ceil(desde / paso) * paso;

    const out: { left: number; l: string }[] = [];
    for (let m = primero; m <= hasta; m += paso) out.push({ left: (m - desde) / largo * 100, l: this.hhmm(m) });
    return out;
  });

  /** La etiqueta entra si el tramo, ya estirado por el zoom, tiene ancho suficiente. */
  cabeEtiqueta(anchoPct: number): boolean {
    return anchoPct * this.zoom() > 5;
  }

  /** Al acercar o alejar se conserva el centro de lo que se esta mirando. */
  cambiarZoom(delta: number, caja: HTMLElement): void {
    const actual = this.zoom();
    const i = this.ZOOMS.indexOf(actual);
    const nuevo = this.ZOOMS[Math.max(0, Math.min(this.ZOOMS.length - 1, i + delta))];
    if (nuevo === actual) return;

    const centro = (caja.scrollLeft + caja.clientWidth / 2) / (caja.clientWidth * actual);
    this.zoom.set(nuevo);
    requestAnimationFrame(() => {
      caja.scrollLeft = centro * caja.clientWidth * nuevo - caja.clientWidth / 2;
    });
  }

  ajustarZoom(caja: HTMLElement): void {
    this.zoom.set(1);
    requestAnimationFrame(() => { caja.scrollLeft = 0; });
  }

  private hhmm(m: number): string {
    return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  }

  // ==================== FILTROS ====================
  subtitulo(): string {
    const partes: string[] = [];
    if (this.activeTab() === 'asistencia') {
      partes.push(`${this.filtrosAsistencia.fechaDesde} al ${this.filtrosAsistencia.fechaHasta}`);
    } else if (this.filtros.fecha) {
      partes.push(this.filtros.fecha);
    }
    const sub = this.subcarteras().find(s => s.id === this.filtros.idSubcartera);
    const car = this.carteras().find(c => c.id === this.filtros.idCartera);
    const pro = this.proveedores().find(p => p.id === this.filtros.idProveedor);
    [pro?.nombreInquilino, car?.nombreCartera, sub?.nombreSubcartera]
      .forEach(n => { if (n) partes.push(n); });
    return partes.join(' · ') || 'Elegí los filtros y presioná Buscar';
  }

  onProveedorChange(idProveedor: number | null): void {
    this.filtros.idCartera = null;
    this.filtros.idSubcartera = null;
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.resetAgentes();

    if (idProveedor) {
      this.comisionesService.obtenerCarteras(idProveedor).subscribe({
        next: (data) => this.carteras.set(data),
        error: (err) => console.error('Error cargando carteras:', err)
      });
    }
  }

  onCarteraChange(idCartera: number | null): void {
    this.filtros.idSubcartera = null;
    this.subcarteras.set([]);
    this.resetAgentes();

    if (idCartera) {
      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error('Error cargando subcarteras:', err)
      });
    }
  }

  /** Al elegir subcartera se precarga el roster para el multiselect de asistencia. */
  onSubcarteraChange(idSubcartera: number | null): void {
    this.resetAgentes();
    if (!idSubcartera) return;

    this.reporteService.getAgentesSubcartera(idSubcartera).subscribe({
      next: (data) => this.agentesDisponibles.set(data),
      error: (err) => console.error('Error cargando agentes de la subcartera:', err)
    });
  }

  private resetAgentes(): void {
    this.agentesDisponibles.set([]);
    this.agentesSeleccionados.set([]);
    this.showAgentePicker.set(false);
  }

  buscar(): void {
    if (!this.filtros.fecha) return;
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.seleccionado.set(null);
    this.tramos.set([]);
    this.tramosParciales.set(false);

    this.reporteService.getReporte(
      this.filtros.fecha,
      this.filtros.fecha,
      this.filtros.idProveedor || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined
    ).subscribe({
      next: (response) => {
        this.resumen.set(response.resumen);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando reporte:', err);
        this.loading.set(false);
        alert('Error al cargar el reporte de estados');
      }
    });
  }

  exportarExcel(): void {
    if (!this.filtros.fecha) return;

    this.loading.set(true);

    this.reporteService.exportarExcel(
      this.filtros.fecha,
      this.filtros.fecha,
      this.filtros.idProveedor || undefined,
      this.filtros.idCartera || undefined,
      this.filtros.idSubcartera || undefined
    ).subscribe({
      next: (blob) => {
        this.descargar(blob, `Reporte_Estados_Agentes_${this.filtros.fecha}.xlsx`);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error exportando Excel:', err);
        this.loading.set(false);
        alert('Error al exportar el reporte a Excel');
      }
    });
  }

  private descargar(blob: Blob, nombre: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // ==================== HELPERS ====================
  /** Denominador 0 o negativo devuelve 0, no infinito. Misma regla que el backend. */
  private pct(parte: number, total: number): number {
    if (total <= 0) return 0;
    return Math.round((parte / total) * 10000) / 100;
  }

  /** Misma regla que formatSegundos del backend, para que no convivan dos formatos. */
  formatSeg(seg: number | undefined): string {
    if (!seg) return '0s';
    const h = Math.floor(seg / 3600);
    const m = Math.floor((seg % 3600) / 60);
    const s = seg % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  min100(v: number): number {
    return Math.max(0, Math.min(100, v));
  }

  /**
   * Umbrales de ocupacion. Bajaron a 55/40 desde que Productivo dejo de incluir la
   * gestion manual: la banda realista de la operacion se corrio hacia abajo.
   */
  colorOcupacion(p: number): string {
    return p >= 55 ? 'text-[#15803d]' : p >= 40 ? 'text-[#b45309]' : 'text-[#b91c1c]';
  }
  fondoOcupacion(p: number): string {
    return 'block h-full rounded-full ' + (p >= 55 ? 'bg-[#16a34a]' : p >= 40 ? 'bg-[#d97706]' : 'bg-[#dc2626]');
  }

  /** Al reves que ocupacion: mucho ocioso es malo. Mide al discador, no al asesor. */
  colorOcioso(p: number): string {
    return p <= 25 ? 'text-[#15803d]' : p <= 40 ? 'text-[#b45309]' : 'text-[#b91c1c]';
  }
  fondoOcioso(p: number): string {
    return 'block h-full rounded-full ' + (p <= 25 ? 'bg-[#16a34a]' : p <= 40 ? 'bg-[#d97706]' : 'bg-[#dc2626]');
  }

  colorInd(k: string, v: number): string {
    return k === 'pOcup' ? this.colorOcupacion(v) : this.colorOcioso(v);
  }
  fondoInd(k: string, v: number): string {
    return k === 'pOcup' ? this.fondoOcupacion(v) : this.fondoOcioso(v);
  }

  colorPuntualidad(p: number): string {
    return p >= 90 ? 'text-[#15803d]' : p >= 70 ? 'text-[#b45309]' : 'text-[#b91c1c]';
  }
  fondoPuntualidad(p: number): string {
    return 'block h-full rounded-full ' + (p >= 90 ? 'bg-[#16a34a]' : p >= 70 ? 'bg-[#d97706]' : 'bg-[#dc2626]');
  }

  // ==================== ASISTENCIA ====================
  cambiarTab(tab: 'resumen' | 'asistencia'): void {
    this.activeTab.set(tab);
    this.showAgentePicker.set(false);
    this.buscarAgente.set('');
  }

  anyLoading(): boolean {
    return this.loading() || this.asistenciaLoading();
  }

  filtrosCompletos(): boolean {
    return this.activeTab() === 'asistencia'
      ? !!this.filtrosAsistencia.fechaDesde && !!this.filtrosAsistencia.fechaHasta
      : !!this.filtros.fecha;
  }

  hayDatosParaExportar(): boolean {
    return this.activeTab() === 'asistencia'
      ? this.asistenciaRegistros().length > 0
      : !!this.resumen();
  }

  onBuscar(): void {
    if (this.activeTab() === 'asistencia') this.buscarAsistencia();
    else this.buscar();
  }

  onExportar(): void {
    if (this.activeTab() === 'asistencia') this.exportarAsistenciaExcel();
    else this.exportarExcel();
  }

  etiquetaAgentes(): string {
    const total = this.agentesDisponibles().length;
    const sel = this.agentesSeleccionados().length;
    if (total === 0) return 'Todos';
    if (sel === 0 || sel === total) return `Todos (${total})`;
    return `${sel} de ${total} seleccionados`;
  }

  toggleAgente(id: number): void {
    const actuales = this.agentesSeleccionados();
    this.agentesSeleccionados.set(
      actuales.includes(id) ? actuales.filter(x => x !== id) : [...actuales, id]
    );
  }

  seleccionarTodosAgentes(): void {
    this.agentesSeleccionados.set(this.agentesDisponibles().map(a => a.id));
  }

  limpiarAgentes(): void {
    this.agentesSeleccionados.set([]);
  }

  buscarAsistencia(): void {
    if (!this.filtrosCompletos()) return;

    this.asistenciaLoading.set(true);
    this.showAgentePicker.set(false);

    this.reporteService.getAsistencia(this.construirFiltrosAsistencia()).subscribe({
      next: (response) => {
        this.asistenciaRegistros.set(response.registros);
        this.asistenciaResumen.set(response.resumen);
        this.asistenciaLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando asistencia:', err);
        this.asistenciaLoading.set(false);
        alert('Error al cargar el reporte de asistencia');
      }
    });
  }

  exportarAsistenciaExcel(): void {
    if (!this.filtrosCompletos()) return;

    this.asistenciaLoading.set(true);

    this.reporteService.exportarAsistenciaExcel(this.construirFiltrosAsistencia()).subscribe({
      next: (blob) => {
        this.descargar(blob,
          `Reporte_Asistencia_${this.filtrosAsistencia.fechaDesde}_${this.filtrosAsistencia.fechaHasta}.xlsx`);
        this.asistenciaLoading.set(false);
      },
      error: (err) => {
        console.error('Error exportando asistencia:', err);
        this.asistenciaLoading.set(false);
        alert('Error al exportar la asistencia a Excel');
      }
    });
  }

  /**
   * Seleccionar todos los agentes equivale a no mandar el filtro: el SP ya acota
   * por subcartera y asi la URL no se llena de ids.
   */
  private construirFiltrosAsistencia() {
    const sel = this.agentesSeleccionados();
    const todos = sel.length === 0 || sel.length === this.agentesDisponibles().length;

    return {
      fechaDesde: this.filtrosAsistencia.fechaDesde,
      fechaHasta: this.filtrosAsistencia.fechaHasta,
      tenantId: this.filtros.idProveedor || undefined,
      carteraId: this.filtros.idCartera || undefined,
      subcarteraId: this.filtros.idSubcartera || undefined,
      idsUsuarios: todos ? undefined : sel,
      horaEntrada: this.filtrosAsistencia.horaEntrada,
      toleranciaMin: this.filtrosAsistencia.toleranciaMin || 0,
      incluirDomingos: this.filtrosAsistencia.incluirDomingos
    };
  }

  getAsistenciaClass(estado: string): string {
    const base = 'inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.04em]';
    switch (estado) {
      case 'PUNTUAL': return `${base} bg-[#e4f2e9] text-[#15803d]`;
      case 'TARDE':   return `${base} bg-[#fdf6e7] text-[#b45309]`;
      case 'FALTA':   return `${base} bg-[#f9e6e4] text-[#b91c1c]`;
      default:        return `${base} bg-[#f4f6f9] text-[#334155]`;
    }
  }
}
