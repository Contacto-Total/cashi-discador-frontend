import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { CambioHistorial, ETIQUETAS_TIPO_CAMBIO, HistorialCambios } from '../models/ajuste-conciliacion.model';
import { AjusteConciliacionService } from '../services/ajuste-conciliacion.service';
import { CorreccionClienteDialogWidget, CorreccionClienteSolicitud } from './correccion-cliente-dialog.widget';

/**
 * Historial de cambios: todas las correcciones de conciliación (quién, qué, cuándo) de las carteras del usuario.
 * Proveedor, cartera, subcartera, usuario, tipo y documento son filtros opcionales.
 */
@Component({
  selector: 'app-historial-cambios',
  standalone: true,
  imports: [FormsModule, CorreccionClienteDialogWidget],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800" aria-labelledby="hc-titulo">
      <div class="border-b border-slate-200 p-4 dark:border-slate-700">
        <h2 id="hc-titulo" class="text-base font-semibold text-slate-900 dark:text-white">Historial de cambios</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400">Todas las correcciones de pagos y conciliaciones, con el usuario que las hizo.</p>

        <form class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 xl:items-end" (submit)="buscar($event)">
          <div>
            <label for="hc-desde" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Desde</label>
            <input id="hc-desde" name="desde" type="date" required [(ngModel)]="desde" [class]="claseCampo" />
          </div>
          <div>
            <label for="hc-hasta" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Hasta</label>
            <input id="hc-hasta" name="hasta" type="date" required [(ngModel)]="hasta" [class]="claseCampo" />
          </div>
          <div>
            <label for="hc-proveedor" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Proveedor</label>
            <select id="hc-proveedor" name="proveedor" [(ngModel)]="tenantId" (ngModelChange)="onTenantChange($event)" [class]="claseCampo">
              <option [ngValue]="0">Todos</option>
              @for (tenant of tenants(); track tenant.id) {
                <option [ngValue]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
              }
            </select>
          </div>
          <div>
            <label for="hc-cartera" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Cartera</label>
            <select id="hc-cartera" name="cartera" [(ngModel)]="carteraId" (ngModelChange)="onPortfolioChange($event)" [disabled]="!tenantId" [class]="claseCampo">
              <option [ngValue]="0">Todas</option>
              @for (portfolio of portfolios(); track portfolio.id) {
                <option [ngValue]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
              }
            </select>
          </div>
          <div>
            <label for="hc-subcartera" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Subcartera</label>
            <select id="hc-subcartera" name="subcartera" [(ngModel)]="subcarteraId" [disabled]="!carteraId" [class]="claseCampo">
              <option [ngValue]="0">Todas</option>
              @for (sub of subPortfolios(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.subPortfolioCode }} - {{ sub.subPortfolioName }}</option>
              }
            </select>
          </div>
          <div>
            <label for="hc-usuario" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Usuario</label>
            <select id="hc-usuario" name="usuario" [(ngModel)]="usuarioId" [class]="claseCampo">
              <option [ngValue]="null">Todos</option>
              @for (u of usuarios(); track u.id) {
                <option [ngValue]="u.id">{{ u.nombre }} ({{ u.cambios }})</option>
              }
            </select>
          </div>
          <div>
            <label for="hc-tipo" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Tipo de cambio</label>
            <select id="hc-tipo" name="tipo" [(ngModel)]="tipoCambio" [class]="claseCampo">
              <option [ngValue]="''">Todos</option>
              @for (tipo of tipos; track tipo.valor) {
                <option [ngValue]="tipo.valor">{{ tipo.label }}</option>
              }
            </select>
          </div>
          <div>
            <label for="hc-documento" class="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Documento</label>
            <input id="hc-documento" name="documento" type="search" inputmode="numeric" autocomplete="off" placeholder="Opcional" [(ngModel)]="documento" [class]="claseCampo" />
          </div>
          <div class="sm:col-span-2 lg:col-span-4 xl:col-span-8">
            <button type="submit" [disabled]="cargando()" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800">
              {{ cargando() ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>
        </form>
      </div>

      @if (error(); as texto) {
        <p role="alert" class="m-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">{{ texto }}</p>
      }

      @if (resultado(); as r) {
        <p role="status" class="border-b border-slate-200 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
          {{ r.total }} {{ r.total === 1 ? 'cambio' : 'cambios' }}
          @if (r.total > 0) {
            · mostrando {{ r.pagina * r.tamano + 1 }}–{{ r.pagina * r.tamano + r.contenido.length }}
          }
        </p>
        @if (r.contenido.length === 0) {
          <p class="p-6 text-center text-sm text-slate-600 dark:text-slate-400">No hay cambios con esos filtros.</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <caption class="sr-only">Cambios de conciliación con su usuario, fecha y motivo</caption>
              <thead class="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                <tr>
                  <th scope="col" class="px-3 py-2">Fecha</th>
                  <th scope="col" class="px-3 py-2">Usuario</th>
                  <th scope="col" class="px-3 py-2">Cambio</th>
                  <th scope="col" class="px-3 py-2">Cliente</th>
                  <th scope="col" class="px-3 py-2">Cartera</th>
                  <th scope="col" class="px-3 py-2">Motivo y detalle</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @for (c of r.contenido; track c.id) {
                  <tr class="align-top">
                    <td class="whitespace-nowrap px-3 py-2 text-slate-700 dark:text-slate-300">{{ fechaHora(c.fecha) }}</td>
                    <td class="px-3 py-2 font-semibold text-slate-900 dark:text-white">{{ c.usuario || 'Sistema' }}</td>
                    <td class="px-3 py-2 text-slate-800 dark:text-slate-100">{{ tipo(c.tipoCambio) }}</td>
                    <td class="whitespace-nowrap px-3 py-2">
                      @if (c.documento) {
                        <button type="button" (click)="abrirCliente(c)" [attr.aria-label]="'Abrir la corrección de pagos del cliente ' + c.documento" class="rounded font-mono font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 dark:hover:text-blue-200">{{ c.documento }}</button>
                      } @else {
                        <span class="text-slate-400">—</span>
                      }
                    </td>
                    <td class="px-3 py-2 text-xs text-slate-600 dark:text-slate-400">{{ c.subcartera || ('Subcartera ' + c.subcarteraId) }}<span class="block">{{ c.cartera }}</span></td>
                    <td class="px-3 py-2 text-slate-700 dark:text-slate-200">
                      @if (c.observacion) {
                        <p>{{ c.observacion }}</p>
                      }
                      @if (referencias(c); as refs) {
                        <p class="text-xs text-slate-500 dark:text-slate-400">{{ refs }}</p>
                      }
                      @if (c.detalleAnterior || c.detalleNuevo) {
                        <details class="mt-1">
                          <summary class="cursor-pointer text-xs font-semibold text-blue-700 dark:text-blue-300">Ver detalle</summary>
                          @if (c.detalleAnterior) {
                            <p class="mt-1 text-xs text-slate-600 dark:text-slate-300"><span class="font-semibold">Antes:</span> {{ c.detalleAnterior }}</p>
                          }
                          @if (c.detalleNuevo) {
                            <p class="mt-1 text-xs text-slate-600 dark:text-slate-300"><span class="font-semibold">Después:</span> {{ c.detalleNuevo }}</p>
                          }
                        </details>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-2 dark:border-slate-700">
            <button type="button" (click)="irAPagina(r.pagina - 1)" [disabled]="r.pagina === 0 || cargando()" class="rounded-lg border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Anterior</button>
            <span class="text-sm text-slate-600 dark:text-slate-400">Página {{ r.pagina + 1 }} de {{ totalPaginas(r) }}</span>
            <button type="button" (click)="irAPagina(r.pagina + 1)" [disabled]="r.pagina + 1 >= totalPaginas(r) || cargando()" class="rounded-lg border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Siguiente</button>
          </div>
        }
      }
    </section>

    <app-correccion-cliente-dialog [solicitud]="correccion()" (cerrado)="onCorreccionCerrada($event)"></app-correccion-cliente-dialog>
  `
})
export class HistorialCambiosWidget implements OnInit {
  private ajusteService = inject(AjusteConciliacionService);
  private tenantService = inject(TenantService);
  private portfolioService = inject(PortfolioService);

  readonly claseCampo = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-800';
  readonly tipos = Object.entries(ETIQUETAS_TIPO_CAMBIO)
    .map(([valor, label]) => ({ valor, label }))
    .sort((a, b) => a.label.localeCompare(b.label));
  private static readonly TAMANO = 50;

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  usuarios = signal<{ id: number; nombre: string; cambios: number }[]>([]);
  resultado = signal<HistorialCambios | null>(null);
  cargando = signal(false);
  error = signal<string | null>(null);
  correccion = signal<CorreccionClienteSolicitud | null>(null);

  desde = this.isoDiasAtras(7);
  hasta = this.isoDiasAtras(0);
  tenantId = 0;
  carteraId = 0;
  subcarteraId = 0;
  usuarioId: number | null = null;
  tipoCambio = '';
  documento = '';

  ngOnInit(): void {
    this.tenantService.getAllTenants().subscribe({
      next: tenants => this.tenants.set(tenants),
      error: () => this.error.set('No se pudieron cargar los proveedores.')
    });
    this.cargar(0);
  }

  onTenantChange(tenantId: number): void {
    this.tenantId = Number(tenantId) || 0;
    this.carteraId = 0;
    this.subcarteraId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    if (this.tenantId) {
      this.portfolioService.getPortfoliosByTenant(this.tenantId).subscribe({ next: p => this.portfolios.set(p) });
    }
  }

  onPortfolioChange(carteraId: number): void {
    this.carteraId = Number(carteraId) || 0;
    this.subcarteraId = 0;
    this.subPortfolios.set([]);
    if (this.carteraId) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.carteraId).subscribe({ next: s => this.subPortfolios.set(s) });
    }
  }

  buscar(evento: Event): void {
    evento.preventDefault();
    this.cargar(0);
  }

  irAPagina(pagina: number): void {
    this.cargar(pagina);
  }

  private cargar(pagina: number): void {
    if (!this.desde || !this.hasta) return;
    this.cargando.set(true);
    this.error.set(null);
    this.ajusteService.historicoCambios({
      desde: this.desde,
      hasta: this.hasta,
      tenantId: this.tenantId || null,
      carteraId: this.carteraId || null,
      subcarteraId: this.subcarteraId || null,
      usuarioId: this.usuarioId,
      tipoCambio: this.tipoCambio || null,
      documento: this.documento.trim() || null,
      pagina,
      tamano: HistorialCambiosWidget.TAMANO
    }).subscribe({
      next: resultado => {
        this.cargando.set(false);
        this.resultado.set(resultado);
        this.usuarios.set(resultado.usuarios || []);
      },
      error: err => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudo cargar el historial de cambios.');
      }
    });
  }

  abrirCliente(cambio: CambioHistorial): void {
    if (!cambio.documento) return;
    this.correccion.set({
      documento: cambio.documento,
      contexto: { tenantId: cambio.tenantId, carteraId: cambio.carteraId, subcarteraId: cambio.subcarteraId },
      pb: cambio.bcpPagoDetalleId
    });
  }

  onCorreccionCerrada(evento: { documento: string; huboCambios: boolean }): void {
    this.correccion.set(null);
    if (evento.huboCambios) this.cargar(this.resultado()?.pagina ?? 0);
  }

  totalPaginas(r: HistorialCambios): number {
    return Math.max(1, Math.ceil(r.total / r.tamano));
  }

  tipo(tipo: string | null): string {
    return (tipo && ETIQUETAS_TIPO_CAMBIO[tipo]) || tipo || 'Corrección';
  }

  referencias(c: CambioHistorial): string {
    const partes: string[] = [];
    if (c.bcpPagoDetalleId) partes.push(`Pb ${c.bcpPagoDetalleId}`);
    if (c.gestionPromesaId) partes.push(`gestión ${c.gestionPromesaId}`);
    if (c.cuotaId) partes.push(`cuota ${c.cuotaId}`);
    if (c.pagoCuotaId) partes.push(`pago cuota ${c.pagoCuotaId}`);
    return partes.join(' · ');
  }

  fechaHora(valor: string | null): string {
    if (!valor) return '-';
    const match = String(valor).match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
    return match ? `${match[3]}/${match[2]}/${match[1]} ${match[4]}:${match[5]}` : String(valor);
  }

  private isoDiasAtras(dias: number): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - dias);
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
  }
}
