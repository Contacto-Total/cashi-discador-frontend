import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { BcpPagosService } from '../../services/bcp-pagos.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import {
  ReporteConciliacionFila,
  ReporteConciliacionPagina,
  ReporteConciliacionRequest,
  TipoCasoConciliacion
} from '../../models/reporte-conciliacion.model';

type Periodo = 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth' | 'custom';

const TAMANO_PAGINA = 50;

const TIPOS: Record<TipoCasoConciliacion, { l: string; c: string }> = {
  MATCH_COMPLETO: { l: 'Conciliado', c: 'bg-[#e7f6ef] text-[#0f7a55] dark:bg-emerald-500/15 dark:text-emerald-300' },
  PAGO_REGISTRADO: { l: 'Sin pago del banco', c: 'bg-[#e8effd] text-[#1d4ed8] dark:bg-blue-500/15 dark:text-blue-300' },
  PROMESA_PENDIENTE: { l: 'Promesa pendiente', c: 'bg-[#eef1f5] text-[#334155] dark:bg-slate-800 dark:text-slate-300' },
  PAGO_POR_FUERA: { l: 'Pago sin promesa', c: 'bg-[#fdf1e7] text-[#b45309] dark:bg-amber-500/15 dark:text-amber-300' },
  PENDIENTE_CONCILIAR: { l: 'Banco pendiente', c: 'bg-[#fef7e0] text-[#92400e] dark:bg-yellow-500/15 dark:text-yellow-300' },
  RETENIDO: { l: 'Retenido', c: 'bg-[#fdf0ee] text-[#b91c1c] dark:bg-red-500/15 dark:text-red-300' },
  NO_CORRESPONDE: { l: 'No corresponde', c: 'bg-[#eef1f5] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' },
  SIN_PROMESA: { l: 'Gestión sin cuota', c: 'bg-[#f4f6f9] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400' }
};

const VALIDACIONES: Record<string, string> = {
  MONTO_OK: 'Monto OK',
  MONTO_DIFERENTE: 'Monto diferente',
  PARCIAL_EN_ESPERA: 'Parcial en espera',
  SIN_PAGO_AGENTE: 'Sin pago del asesor',
  PENDIENTE_VERIFICAR: 'Sin pago del banco',
  PAGO_SIN_GESTION: 'Sin gestión',
  SIN_PAGO: 'Sin pago'
};

@Component({
  selector: 'app-conciliacion-report',
  standalone: true,
  imports: [FormsModule, LucideAngularModule, AppNumberPipe],
  template: `
    <div class="min-h-full bg-[#f6f7f9] p-4 font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]
                text-[#0f172a] md:p-5 dark:bg-slate-950 dark:text-slate-100">

      <!-- ============ Cabecera ============ -->
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.015em]">Reporte de Conciliación</h1>
          <p class="mt-1 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button type="button" (click)="descargarExcel()" [disabled]="!consulta() || descargando() || cargando()"
            class="inline-flex h-9 items-center gap-2 rounded-lg border border-[#c5ccd6] bg-white px-4 text-[12.5px] font-bold
                   text-[#0f172a] transition duration-150 hover:bg-[#f4f6f9] active:scale-[0.98]
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            [attr.title]="consulta() ? 'Descarga lo que se está mostrando (sin el filtro de tipo)' : 'Primero busca para ver el reporte'">
            @if (descargando()) {
              <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
              Generando
            } @else {
              <lucide-angular name="download" [size]="15"></lucide-angular>
              Descargar Excel
            }
          </button>
          <button type="button" (click)="buscar()" [disabled]="!puedeBuscar() || cargando()"
            class="inline-flex h-9 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[12.5px] font-bold text-white
                   transition duration-150 hover:bg-[#1e293b] active:scale-[0.98]
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            @if (cargando()) {
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
      <form class="mb-3 flex flex-wrap items-end gap-2.5" (ngSubmit)="buscar()">
        <div class="flex flex-col gap-1.5">
          <label for="rc-periodo" [class]="claseLabel">Periodo</label>
          <select id="rc-periodo" name="periodo" [(ngModel)]="periodo" (ngModelChange)="onPeriodoChange()" [class]="claseInput">
            <option value="today">Hoy</option>
            <option value="yesterday">Ayer</option>
            <option value="week">Últimos 7 días</option>
            <option value="month">Este mes</option>
            <option value="lastMonth">Mes anterior</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        @if (periodo === 'custom') {
          <div class="flex flex-col gap-1.5">
            <label for="rc-desde" [class]="claseLabel">Desde</label>
            <input id="rc-desde" name="desde" type="date" [(ngModel)]="fechaInicio" [max]="fechaFin || hoy" [class]="claseInput"/>
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="rc-hasta" [class]="claseLabel">Hasta</label>
            <input id="rc-hasta" name="hasta" type="date" [(ngModel)]="fechaFin" [min]="fechaInicio" [max]="hoy" [class]="claseInput"/>
          </div>
        }

        <div class="flex flex-col gap-1.5">
          <label for="rc-proveedor" [class]="claseLabel">Proveedor</label>
          <select id="rc-proveedor" name="proveedor" [(ngModel)]="tenantId" (ngModelChange)="onTenantChange()" [class]="claseInput">
            <option [ngValue]="0">Seleccione</option>
            @for (tenant of tenants(); track tenant.id) {
              <option [ngValue]="tenant.id">{{ tenant.tenantName }}</option>
            }
          </select>
        </div>

        <span class="pb-2.5 text-[#c5ccd6]" aria-hidden="true">&rsaquo;</span>

        <div class="flex flex-col gap-1.5">
          <label for="rc-cartera" [class]="claseLabel">Cartera</label>
          <select id="rc-cartera" name="cartera" [(ngModel)]="carteraId" (ngModelChange)="onCarteraChange()"
                  [disabled]="!tenantId" [class]="claseInput">
            <option [ngValue]="0">Seleccione</option>
            @for (portfolio of portfolios(); track portfolio.id) {
              <option [ngValue]="portfolio.id">{{ portfolio.portfolioName }}</option>
            }
          </select>
        </div>

        <span class="pb-2.5 text-[#c5ccd6]" aria-hidden="true">&rsaquo;</span>

        <div class="flex flex-col gap-1.5">
          <label for="rc-subcartera" [class]="claseLabel">Subcartera</label>
          <select id="rc-subcartera" name="subcartera" [(ngModel)]="subcarteraId" [disabled]="!carteraId" [class]="claseInput">
            <option [ngValue]="0">Seleccione</option>
            @for (sub of subPortfolios(); track sub.id) {
              <option [ngValue]="sub.id">{{ sub.subPortfolioName }}</option>
            }
          </select>
        </div>

        <label class="flex h-[38px] min-w-[190px] flex-1 items-center gap-2.5 rounded-lg border border-[#d5dbe3]
                      bg-white px-3 transition-colors focus-within:border-[#2563eb]
                      dark:border-slate-700 dark:bg-slate-900">
          <lucide-angular name="search" [size]="14" class="shrink-0 text-[#8491a3]"></lucide-angular>
          <input type="text" name="documento" [(ngModel)]="documento" inputmode="numeric" autocomplete="off"
            placeholder="Buscar por documento (opcional)" aria-label="Buscar por documento"
            class="min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] outline-none
                   placeholder:text-[#5f6c80] dark:text-slate-100"/>
        </label>
        <!-- Enter en cualquier campo busca -->
        <button type="submit" class="sr-only">Buscar</button>
      </form>

      @if (error()) {
        <div role="alert" class="rc-fade mb-3 flex items-center gap-2.5 rounded-[10px] border border-[#f3c9c5] bg-[#fdf0ee]
                                 px-3.5 py-3 text-[12.5px] font-semibold text-[#b91c1c]
                                 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <lucide-angular name="alert-circle" [size]="16" class="shrink-0"></lucide-angular>
          <span>{{ error() }}</span>
        </div>
      }

      @if (resultado(); as r) {
        <div [class]="'rc-fade transition-opacity duration-200 ' + (cargando() ? 'opacity-60' : '')" [attr.aria-busy]="cargando()">

          <!-- Indicadores -->
          <div class="mb-2.5 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
            <div [class]="claseKpi">
              <span [class]="claseLabel">Conciliado</span>
              <span [class]="claseKpiV + ' text-[#0f7a55] dark:text-emerald-400'">S/ {{ r.resumen.montoMatchCompleto | appNumber:'1.2-2' }}</span>
              <span [class]="claseKpiS">{{ r.resumen.matchCompleto | appNumber }} filas con pago del banco</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseLabel">Pago sin promesa</span>
              <span [class]="claseKpiV">S/ {{ r.resumen.montoPagosPorFuera | appNumber:'1.2-2' }}</span>
              <span [class]="claseKpiS">{{ r.resumen.pagosPorFuera | appNumber }} pagos del banco conciliados sin cuota</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseLabel">Banco sin conciliar</span>
              <span [class]="claseKpiV + ' text-[#b45309] dark:text-amber-400'">S/ {{ r.resumen.montoPendienteConciliar | appNumber:'1.2-2' }}</span>
              <span [class]="claseKpiS">{{ r.resumen.pendientesConciliar | appNumber }} pagos · {{ r.resumen.retenidos | appNumber }} retenidos</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseLabel">No corresponde</span>
              <span [class]="claseKpiV">S/ {{ r.resumen.montoNoCorresponde | appNumber:'1.2-2' }}</span>
              <span [class]="claseKpiS">{{ r.resumen.noCorresponden | appNumber }} pagos marcados por un supervisor</span>
            </div>
            <div [class]="claseKpi">
              <span [class]="claseLabel">Pendiente del asesor</span>
              <span [class]="claseKpiV">{{ r.resumen.pendientesProcesar | appNumber }}</span>
              <span [class]="claseKpiS">Cuotas sin pago o pagos sin banco</span>
            </div>
          </div>

          <!-- Tipo de fila -->
          <div class="mb-2.5 flex flex-wrap items-center gap-x-5 gap-y-2.5">
            <div class="flex min-w-0 flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tipo de fila">
              <span [class]="claseLabel">Tipo</span>
              <div [class]="claseCaja">
                <button type="button" (click)="elegirTipo(null)" [disabled]="cargando()"
                        [attr.aria-pressed]="tipoCaso() === null" [class]="claseSeg(tipoCaso() === null)">Todos</button>
                @for (t of tipos; track t.k) {
                  <button type="button" (click)="elegirTipo(t.k)" [disabled]="cargando()"
                          [attr.aria-pressed]="tipoCaso() === t.k" [class]="claseSeg(tipoCaso() === t.k)">{{ t.l }}</button>
                }
              </div>
            </div>
            <span class="ml-auto text-[12px] text-[#5f6c80] dark:text-slate-400">
              <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ r.total | appNumber }}</b>
              @if (tipoCaso()) { de {{ r.resumen.totalRegistros | appNumber }} }
              filas
            </span>
          </div>

          <!-- Tabla -->
          <div class="overflow-hidden rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900">
            <div class="overflow-x-auto">
              <table class="w-full border-separate border-spacing-0 text-[12px] tabular-nums">
                <thead>
                  <tr>
                    <th [class]="claseThIzq">Tipo</th>
                    <th [class]="claseThIzq">Cliente</th>
                    <th [class]="claseThIzq + claseSep">Gestión</th>
                    <th [class]="claseThIzq">Cuota</th>
                    <th [class]="claseTh + claseSep">Pago asesor</th>
                    <th [class]="claseTh + claseSep">Pago banco</th>
                    <th [class]="claseTh">Aplicado</th>
                    <th [class]="claseThIzq + claseSep">Validación</th>
                  </tr>
                </thead>
                <tbody>
                  @for (f of r.filas; track $index) {
                    <tr class="bg-white transition-colors duration-150 hover:bg-[#f4f6f9] dark:bg-slate-900 dark:hover:bg-slate-800/60">
                      <td [class]="claseTdIzq">
                        <span [class]="'inline-flex h-[22px] items-center rounded-[6px] px-1.5 text-[11px] font-bold ' + tipo(f).c">{{ tipo(f).l }}</span>
                      </td>
                      <td [class]="claseTdIzq">
                        <button type="button" (click)="buscarDocumento(f.documentoCliente)" [disabled]="!f.documentoCliente || cargando()"
                                class="block font-bold text-[#0f172a] hover:text-[#2563eb] hover:underline disabled:no-underline dark:text-slate-100"
                                title="Ver solo este cliente">{{ f.documentoCliente || '—' }}</button>
                        <span [class]="claseSub + ' max-w-[200px] truncate'">{{ f.nombreCliente || '' }}</span>
                      </td>
                      <td [class]="claseTdIzq + claseSep">
                        @if (f.idGestion) {
                          <b class="block font-semibold">{{ fecha(f.fechaGestion) }}</b>
                          <span [class]="claseSub + ' max-w-[170px] truncate'" [attr.title]="f.nombreAgente">{{ f.nombreAgente }}</span>
                        } @else { <span class="text-[#8491a3]">—</span> }
                      </td>
                      <td [class]="claseTdIzq">
                        @if (f.idCuota) {
                          <b class="block font-semibold">#{{ f.numeroCuota }} · S/ {{ f.montoPromesa | appNumber:'1.2-2' }}</b>
                          <span [class]="claseSub">{{ fecha(f.fechaPromesa) }} · {{ f.estadoCuota }}</span>
                        } @else { <span class="text-[#8491a3]">—</span> }
                      </td>
                      <td [class]="claseTd + claseSep">
                        @if (f.idPagoSistema) {
                          <b class="block font-semibold">S/ {{ f.montoPagoRegistrado | appNumber:'1.2-2' }}</b>
                          <span [class]="claseSub">{{ fecha(f.fechaPagoRegistrada) }}{{ f.operacionRegistrada ? ' · Op ' + f.operacionRegistrada : '' }}</span>
                        } @else { <span class="text-[#8491a3]">—</span> }
                      </td>
                      <td [class]="claseTd + claseSep">
                        @if (f.idPagoBanco) {
                          <b class="block font-semibold">S/ {{ f.montoBancoReal | appNumber:'1.2-2' }}</b>
                          <span [class]="claseSub">{{ fecha(f.fechaBancoReal) }}{{ f.operacionBanco ? ' · Op ' + f.operacionBanco : '' }}{{ f.entidadBancaria ? ' · ' + f.entidadBancaria : '' }}</span>
                        } @else { <span class="text-[#8491a3]">—</span> }
                      </td>
                      <td [class]="claseTd + ' font-extrabold text-[#0f172a] dark:text-slate-100'">
                        {{ f.montoAplicado !== null ? 'S/ ' + (f.montoAplicado | appNumber:'1.2-2') : '—' }}
                      </td>
                      <td [class]="claseTdIzq + claseSep">
                        <b [class]="'block font-semibold ' + claseValidacion(f.validacionMonto)">{{ validacion(f.validacionMonto) }}</b>
                        @if (f.diferenciaMonto !== null && f.validacionMonto === 'MONTO_DIFERENTE') {
                          <span [class]="claseSub">Dif. S/ {{ f.diferenciaMonto | appNumber:'1.2-2' }}</span>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="8" class="px-4 py-10 text-center text-[#5f6c80] dark:text-slate-400">
                        <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
                        <p class="text-[13px]">No hay filas para los filtros elegidos</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <!-- Paginación -->
            @if (r.total > 0) {
              <nav class="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6e9ee] px-3 py-2.5 dark:border-slate-800"
                   aria-label="Paginación del reporte">
                <p class="text-[12px] text-[#5f6c80] dark:text-slate-400" aria-live="polite">
                  Mostrando <b class="tabular-nums text-[#0f172a] dark:text-slate-100">{{ desde(r) | appNumber }}–{{ hasta(r) | appNumber }}</b>
                  de {{ r.total | appNumber }}
                </p>
                @if (paginas(r) > 1) {
                  <div class="flex items-center gap-1">
                    <button type="button" [class]="claseBotonPagina" [disabled]="r.page === 0 || cargando()" (click)="irPagina(0)" aria-label="Primera página">«</button>
                    <button type="button" [class]="claseBotonPagina" [disabled]="r.page === 0 || cargando()" (click)="irPagina(r.page - 1)">Anterior</button>
                    <span class="px-2 text-[12px] font-bold">Página {{ r.page + 1 }} de {{ paginas(r) }}</span>
                    <button type="button" [class]="claseBotonPagina" [disabled]="r.page + 1 >= paginas(r) || cargando()" (click)="irPagina(r.page + 1)">Siguiente</button>
                    <button type="button" [class]="claseBotonPagina" [disabled]="r.page + 1 >= paginas(r) || cargando()" (click)="irPagina(paginas(r) - 1)" aria-label="Última página">»</button>
                  </div>
                }
              </nav>
            }
          </div>
        </div>
      } @else if (cargando()) {
        <div class="animate-pulse motion-reduce:animate-none" role="status">
          <span class="sr-only">Cargando reporte…</span>
          <div class="mb-2.5 grid gap-2.5 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
            @for (n of esqueletoKpi; track n) {
              <div class="flex h-[92px] flex-col gap-2.5 rounded-xl border border-[#e6e9ee] bg-white px-3.5 py-3.5 dark:border-slate-800 dark:bg-slate-900">
                <span class="h-2.5 w-24 rounded bg-[#e2e8f0] dark:bg-slate-800"></span>
                <span class="h-6 w-28 rounded bg-[#e2e8f0] dark:bg-slate-800"></span>
                <span class="h-2 w-32 rounded bg-[#eef1f5] dark:bg-slate-800"></span>
              </div>
            }
          </div>
          <div class="overflow-hidden rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900">
            <div class="h-[36px] border-b border-[#e6e9ee] bg-[#f8fafc] dark:border-slate-800 dark:bg-slate-800"></div>
            @for (n of esqueletoFilas; track n) {
              <div class="flex items-center gap-4 border-b border-[#e6e9ee] px-3 py-3.5 last:border-b-0 dark:border-slate-800">
                <span class="h-3 w-44 shrink-0 rounded bg-[#e2e8f0] dark:bg-slate-800"></span>
                <span class="h-3 flex-1 rounded bg-[#eef1f5] dark:bg-slate-800"></span>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="rc-fade rounded-xl border border-dashed border-[#c5ccd6] bg-white px-6 py-12 text-center
                    dark:border-slate-700 dark:bg-slate-900">
          <lucide-angular name="inbox" [size]="40" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
          <p class="text-[13px] text-[#5f6c80] dark:text-slate-400">
            Elige el periodo, proveedor, cartera y subcartera y presiona Buscar. Luego podrás descargar el Excel.
          </p>
        </div>
      }
    </div>
  `,
  styles: [`
    .rc-fade { animation: rc-fade 180ms ease-out backwards; }
    @keyframes rc-fade { from { opacity: 0; } }
    @media (prefers-reduced-motion: reduce) { .rc-fade { animation: none; } }
  `]
})
export class ConciliacionReportComponent implements OnInit {
  private readonly bcpService = inject(BcpPagosService);
  private readonly tenantService = inject(TenantService);
  private readonly portfolioService = inject(PortfolioService);

  // Mismo sistema visual que /admin/agent-productivity
  readonly claseLabel = 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400';
  readonly claseInput =
    'h-[38px] rounded-lg border border-[#d5dbe3] bg-white px-3 text-[13px] font-semibold text-[#0f172a] ' +
    'outline-none transition-colors focus:border-[#2563eb] disabled:opacity-50 ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100';
  readonly claseKpi =
    'rc-fade flex flex-col gap-0.5 rounded-xl border border-[#e6e9ee] bg-white px-3.5 py-3 dark:border-slate-800 dark:bg-slate-900';
  readonly claseKpiV = 'text-[22px] font-extrabold leading-tight tracking-[-0.025em] tabular-nums';
  readonly claseKpiS = 'mt-auto text-[11px] font-medium text-[#5f6c80] dark:text-slate-400';
  readonly claseCaja =
    'flex h-8 max-w-full items-center gap-0.5 overflow-x-auto rounded-lg border border-[#d5dbe3] bg-white p-0.5 ' +
    'dark:border-slate-700 dark:bg-slate-900';
  readonly claseSep = 'border-l border-l-[#e6e9ee] dark:border-l-slate-800 ';
  private readonly thBase =
    'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] py-2 align-middle text-[11.5px] font-bold leading-[1.3] ' +
    'text-[#334155] dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 ';
  readonly claseTh = this.thBase + 'px-2.5 text-right ';
  readonly claseThIzq = this.thBase + 'px-2.5 text-left ';
  private readonly tdBase = 'whitespace-nowrap border-b border-[#e6e9ee] bg-inherit py-2 align-middle dark:border-slate-800 ';
  readonly claseTd = this.tdBase + 'px-2.5 text-right font-medium text-[#334155] dark:text-slate-300 ';
  readonly claseTdIzq = this.tdBase + 'px-2.5 text-left font-medium text-[#334155] dark:text-slate-300 ';
  readonly claseSub = 'block text-[10.5px] font-semibold leading-[1.3] text-[#5f6c80] dark:text-slate-400';
  readonly claseBotonPagina =
    'h-[28px] rounded-[6px] border border-[#d5dbe3] bg-white px-2.5 text-[12px] font-bold text-[#334155] ' +
    'transition-colors hover:bg-[#f4f6f9] disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800';

  claseSeg(activo: boolean): string {
    return 'h-[26px] shrink-0 whitespace-nowrap rounded-[6px] px-2.5 text-[12px] font-bold transition-colors duration-150 ' +
      'disabled:cursor-not-allowed ' +
      (activo ? 'bg-[#e8effd] text-[#1d4ed8] dark:bg-blue-500/20 dark:text-blue-300'
              : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
  }

  readonly tipos = (Object.keys(TIPOS) as TipoCasoConciliacion[]).map(k => ({ k, l: TIPOS[k].l }));
  readonly esqueletoKpi = [0, 1, 2, 3, 4];
  readonly esqueletoFilas = [0, 1, 2, 3, 4, 5, 6, 7];
  readonly hoy = this.iso(new Date());

  // Filtros del formulario
  periodo: Periodo = 'today';
  fechaInicio = this.hoy;
  fechaFin = this.hoy;
  tenantId = 0;
  carteraId = 0;
  subcarteraId = 0;
  documento = '';

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);

  /** Filtros de la última búsqueda: la paginación, el tipo y el Excel usan estos, no los del formulario. */
  consulta = signal<Omit<ReporteConciliacionRequest, 'page' | 'size' | 'tipoCaso'> | null>(null);
  tipoCaso = signal<TipoCasoConciliacion | null>(null);
  resultado = signal<ReporteConciliacionPagina | null>(null);
  cargando = signal(false);
  descargando = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe({
      next: tenants => this.tenants.set(tenants),
      error: () => this.error.set('No se pudieron cargar los proveedores. Recargue la página.')
    });
  }

  subtitulo(): string {
    const c = this.consulta();
    if (!c) return 'Pagos del banco frente a lo registrado por los asesores';
    const rango = c.fechaInicio === c.fechaFin
      ? this.fecha(c.fechaInicio)
      : `${this.fecha(c.fechaInicio)} al ${this.fecha(c.fechaFin ?? c.fechaInicio)}`;
    return c.documento ? `${rango} · documento ${c.documento}` : rango;
  }

  puedeBuscar(): boolean {
    return !!this.fechaInicio && !!this.fechaFin && this.fechaInicio <= this.fechaFin
      && this.tenantId > 0 && this.carteraId > 0 && this.subcarteraId > 0;
  }

  onPeriodoChange(): void {
    const hoy = new Date();
    const y = hoy.getFullYear();
    const m = hoy.getMonth();
    switch (this.periodo) {
      case 'today':
        this.fechaInicio = this.fechaFin = this.hoy;
        break;
      case 'yesterday': {
        const ayer = new Date(y, m, hoy.getDate() - 1);
        this.fechaInicio = this.fechaFin = this.iso(ayer);
        break;
      }
      case 'week':
        this.fechaInicio = this.iso(new Date(y, m, hoy.getDate() - 6));
        this.fechaFin = this.hoy;
        break;
      case 'month':
        this.fechaInicio = this.iso(new Date(y, m, 1));
        this.fechaFin = this.hoy;
        break;
      case 'lastMonth':
        this.fechaInicio = this.iso(new Date(y, m - 1, 1));
        this.fechaFin = this.iso(new Date(y, m, 0));
        break;
      case 'custom':
        break;
    }
  }

  onTenantChange(): void {
    this.carteraId = 0;
    this.subcarteraId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    if (this.tenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.tenantId).subscribe({
        next: portfolios => this.portfolios.set(portfolios),
        error: () => this.error.set('No se pudieron cargar las carteras del proveedor.')
      });
    }
  }

  onCarteraChange(): void {
    this.subcarteraId = 0;
    this.subPortfolios.set([]);
    if (this.carteraId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.carteraId).subscribe({
        next: subs => this.subPortfolios.set(subs),
        error: () => this.error.set('No se pudieron cargar las subcarteras de la cartera.')
      });
    }
  }

  buscar(): void {
    if (!this.puedeBuscar() || this.cargando()) return;
    this.consulta.set({
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      tenantId: this.tenantId,
      carteraId: this.carteraId,
      subcarteraId: this.subcarteraId,
      documento: this.documento.trim() || undefined
    });
    this.tipoCaso.set(null);
    // Solo Buscar vuelve a ejecutar el procedure; tipo y páginas reutilizan esta consulta
    this.cargar(0, true);
  }

  /** Clic en un documento de la tabla: muestra solo ese cliente con los mismos filtros. */
  buscarDocumento(documento: string | null): void {
    if (!documento) return;
    this.documento = documento;
    this.buscar();
  }

  elegirTipo(tipo: TipoCasoConciliacion | null): void {
    this.tipoCaso.set(tipo);
    this.cargar(0);
  }

  irPagina(page: number): void {
    this.cargar(page);
  }

  descargarExcel(): void {
    const c = this.consulta();
    if (!c || this.descargando()) return;
    this.descargando.set(true);
    this.error.set(null);
    this.bcpService.descargarReporteConciliacionPorFecha(
      c.fechaInicio, c.tenantId, c.carteraId, c.subcarteraId, c.fechaFin, c.documento
    ).subscribe({
      next: response => {
        const rango = c.fechaInicio === c.fechaFin ? c.fechaInicio : `${c.fechaInicio}-a-${c.fechaFin}`;
        const nombre = `reporte-conciliacion-${rango}${c.documento ? '-' + c.documento : ''}.xlsx`;
        this.bcpService.procesarDescargaArchivo(response, nombre);
        this.descargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo descargar el Excel. Intente nuevamente.');
        this.descargando.set(false);
      }
    });
  }

  tipo(f: ReporteConciliacionFila): { l: string; c: string } {
    return TIPOS[f.tipoCaso] ?? { l: f.tipoCaso, c: TIPOS.SIN_PROMESA.c };
  }

  validacion(valor: string | null): string {
    return valor ? (VALIDACIONES[valor] ?? valor) : '—';
  }

  claseValidacion(valor: string | null): string {
    switch (valor) {
      case 'MONTO_OK': return 'text-[#0f7a55] dark:text-emerald-400';
      case 'MONTO_DIFERENTE': return 'text-[#b91c1c] dark:text-red-400';
      case 'PARCIAL_EN_ESPERA':
      case 'PENDIENTE_VERIFICAR': return 'text-[#b45309] dark:text-amber-400';
      default: return 'text-[#334155] dark:text-slate-300';
    }
  }

  /** yyyy-MM-dd (o con hora) a dd/MM/yyyy sin pasar por Date, para no correr el día por la zona horaria. */
  fecha(valor: string | null | undefined): string {
    if (!valor) return '—';
    const [y, m, d] = String(valor).slice(0, 10).split('-');
    return d ? `${d}/${m}/${y}` : String(valor);
  }

  paginas(r: ReporteConciliacionPagina): number {
    return Math.max(1, Math.ceil(r.total / r.size));
  }

  desde(r: ReporteConciliacionPagina): number {
    return r.page * r.size + 1;
  }

  hasta(r: ReporteConciliacionPagina): number {
    return Math.min((r.page + 1) * r.size, r.total);
  }

  private cargar(page: number, refrescar = false): void {
    const c = this.consulta();
    if (!c) return;
    this.cargando.set(true);
    this.error.set(null);
    this.bcpService.consultarReporteConciliacion({
      ...c, tipoCaso: this.tipoCaso(), page, size: TAMANO_PAGINA, refrescar
    }).subscribe({
      next: r => {
        this.resultado.set(r);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err?.status === 400
          ? 'Revise el periodo, proveedor, cartera y subcartera.'
          : 'No se pudo cargar el reporte. Intente nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  private iso(date: Date): string {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
  }
}
