import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ContextoAjuste, PagoBancoCliente } from '../models/ajuste-conciliacion.model';
import { CuotaResumenConciliacion, PagoBancoPorResolver, PromesaResumenConciliacion, ResumenConciliacionCliente } from '../models/bcp-archivo.model';
import { BcpPagosService } from '../services/bcp-pagos.service';
import { ClienteResumenConciliacionDrawerWidget } from './cliente-resumen-conciliacion-drawer.widget';
import { HistoricoCorreccionesClienteWidget } from './historico-correcciones-cliente.widget';
import { CorreccionClienteContexto, PagoPendienteControlesDialogWidget } from './pago-pendiente-controles-dialog.widget';
import { PagosBancoClienteWidget } from './pagos-banco-cliente.widget';

type Pestana = 'banco' | 'asesor' | 'historico';

/**
 * Todo lo que se corrige de un cliente, en un solo lugar: sus pagos del banco (con el menú de acciones), sus promesas
 * y pagos del asesor, y el histórico de correcciones. Lo usan la página de Corrección de pagos y el diálogo que la
 * abre desde otras pantallas.
 */
@Component({
  selector: 'app-correccion-cliente',
  standalone: true,
  imports: [ClienteResumenConciliacionDrawerWidget, PagoPendienteControlesDialogWidget, PagosBancoClienteWidget, HistoricoCorreccionesClienteWidget],
  template: `
    @if (resumenCliente(); as cliente) {
      <div class="mb-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <p class="text-sm text-slate-800 dark:text-slate-100">
          <span class="font-mono font-bold">{{ cliente.documento }}</span>
          · {{ cliente.nombreCliente || 'Cliente sin nombre' }}
          · Carta de no adeudo: <span class="font-semibold">{{ cliente.pagoCumplido ? 'disponible' : 'no disponible' }}</span>
        </p>
        @if (avisos().length > 0) {
          <ul class="mt-2 flex flex-wrap gap-2" aria-label="Pendientes del cliente">
            @for (aviso of avisos(); track aviso.texto) {
              <li>
                <button type="button" (click)="pestana.set(aviso.pestana)" class="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40">
                  <span aria-hidden="true">⚠</span> {{ aviso.texto }}
                </button>
              </li>
            }
          </ul>
        }
      </div>
    }

    @if (documentoCliente()) {
      <div role="tablist" aria-label="Datos del cliente" class="mb-3 flex flex-wrap gap-1 border-b border-slate-200 dark:border-slate-700">
        @for (tab of pestanas; track tab.id) {
          <button
            type="button"
            role="tab"
            [id]="'cc-tab-' + tab.id"
            [attr.aria-selected]="pestana() === tab.id"
            [attr.aria-controls]="'cc-panel-' + tab.id"
            (click)="pestana.set(tab.id)"
            class="-mb-px rounded-t-lg border-b-2 px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            [class]="pestana() === tab.id ? 'border-emerald-600 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'"
          >
            {{ tab.label }}{{ tab.id === 'banco' && pagosBanco().length > 0 ? ' (' + pagosBanco().length + ')' : '' }}
          </button>
        }
      </div>

      <div
        id="cc-panel-banco"
        role="tabpanel"
        aria-labelledby="cc-tab-banco"
        [class.hidden]="pestana() !== 'banco'"
        class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <app-pagos-banco-cliente
          [documento]="documentoCliente()"
          [contexto]="contexto"
          [refresco]="refresco()"
          [esAdmin]="esAdmin"
          [abrirFichaDe]="pbAbrir"
          (resolver)="pagoResolver.set($event)"
          (cambio)="onCambio($event, false)"
          (cargados)="pagosBanco.set($event)"
        ></app-pagos-banco-cliente>
      </div>

      @if (pestana() === 'historico') {
        <div id="cc-panel-historico" role="tabpanel" aria-labelledby="cc-tab-historico" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <app-historico-correcciones-cliente
            [documento]="documentoCliente()"
            [contexto]="contexto"
            [refresco]="refresco()"
          ></app-historico-correcciones-cliente>
        </div>
      }
    }

    <!-- El resumen del asesor queda siempre en el DOM: el diálogo de corrección usa su visor de vouchers. -->
    <div id="cc-panel-asesor" [attr.role]="documentoCliente() ? 'tabpanel' : null" [attr.aria-labelledby]="documentoCliente() ? 'cc-tab-asesor' : null" [class.hidden]="!!documentoCliente() && pestana() !== 'asesor'">
      @if (resumenCliente()) {
        <div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p class="text-xs text-slate-600 dark:text-slate-300">
            Para un pago que no corresponde a ninguna cuota, como un pago voluntario, usa las acciones del cliente.
          </p>
          <button
            type="button"
            (click)="abrirCorreccionCliente()"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800"
          >
            Acciones del cliente
          </button>
        </div>
      }

      <app-cliente-resumen-conciliacion-drawer
        #panelResumen
        [open]="resumenVisible()"
        mode="inline"
        [permiteCorregir]="true"
        [loading]="isLoadingResumenCliente()"
        [error]="resumenClienteError()"
        [documento]="documentoCliente()"
        [resumen]="resumenCliente()"
        [tenantId]="contexto?.tenantId ?? null"
        [carteraId]="contexto?.carteraId ?? null"
        [subcarteraId]="contexto?.subcarteraId ?? null"
        (corregirCuota)="abrirCorreccionCuota($event)"
        (ajustado)="onCambio($event, true)"
      ></app-cliente-resumen-conciliacion-drawer>
    </div>

    <app-pago-pendiente-controles-dialog
      [cliente]="correccion()"
      [tenantId]="contexto?.tenantId ?? 0"
      [carteraId]="contexto?.carteraId ?? 0"
      [subcarteraId]="contexto?.subcarteraId ?? 0"
      [cerrarConEscape]="!panelResumen.visorVoucherCuota"
      (verVouchers)="panelResumen.abrirVisorVoucher($event.promesa, $event.cuota)"
      (cerrado)="onCorreccionCerrada($event)"
    ></app-pago-pendiente-controles-dialog>

    <!-- Resolver un pago del banco pendiente desde la pestaña Pagos del banco -->
    <app-pago-pendiente-controles-dialog
      [pago]="pagoResolver()"
      [tenantId]="contexto?.tenantId ?? 0"
      [carteraId]="contexto?.carteraId ?? 0"
      [subcarteraId]="contexto?.subcarteraId ?? 0"
      (cerrado)="onResolverCerrado($event)"
    ></app-pago-pendiente-controles-dialog>
  `
})
export class CorreccionClienteWidget implements OnChanges {
  private readonly bcpPagosService = inject(BcpPagosService);

  @Input() documento: string | null = null;
  @Input() contexto: ContextoAjuste | null = null;
  /** Pago bancario cuya ficha se abre al cargar (búsqueda por Pb o enlace desde otra pantalla). */
  @Input() pbAbrir: number | null = null;
  /** Se suma desde afuera para volver a cargar el mismo cliente (botón Buscar). */
  @Input() recarga = 0;
  /** Algo cambió en el cliente: quien lo abrió puede refrescar lo suyo. */
  @Output() cambio = new EventEmitter<string>();

  /** Ajustes finos (ficha, desconciliar): solo administradores. */
  readonly esAdmin = inject(AuthService).hasAnyRole('ADMIN');

  readonly pestanas: { id: Pestana; label: string }[] = [
    { id: 'banco', label: 'Pagos del banco' },
    { id: 'asesor', label: 'Promesas y pagos del asesor' },
    { id: 'historico', label: 'Histórico' }
  ];
  readonly pestana = signal<Pestana>('banco');
  readonly documentoCliente = signal<string | null>(null);
  /** Se suma para que las pestañas vuelvan a cargar. */
  readonly refresco = signal(0);
  readonly pagosBanco = signal<PagoBancoCliente[]>([]);
  readonly pagoResolver = signal<PagoBancoPorResolver | null>(null);
  /** Cuota o cliente en corrección. El diálogo está abierto mientras tenga valor. */
  readonly correccion = signal<CorreccionClienteContexto | null>(null);

  readonly isLoadingResumenCliente = signal(false);
  readonly resumenClienteError = signal<string | null>(null);
  readonly resumenCliente = signal<ResumenConciliacionCliente | null>(null);

  /** Lo que conviene revisar del cliente, arriba de las pestañas. */
  readonly avisos = computed<{ texto: string; pestana: Pestana }[]>(() => {
    const avisos: { texto: string; pestana: Pestana }[] = [];
    const pagos = this.pagosBanco();
    const pendientes = pagos.filter(p => p.categoria === 'REQUIERE_REVISION').length;
    if (pendientes > 0) {
      avisos.push({ texto: `${pendientes} ${pendientes === 1 ? 'pago del banco pendiente' : 'pagos del banco pendientes'}`, pestana: 'banco' });
    }
    const parciales = pagos.filter(p => p.categoria === 'PARCIAL_EN_ESPERA').length;
    if (parciales > 0) {
      avisos.push({ texto: `${parciales} ${parciales === 1 ? 'pago parcial en espera' : 'pagos parciales en espera'}`, pestana: 'banco' });
    }
    const voluntariosSinBanco = (this.resumenCliente()?.promesas || []).filter(promesa => {
      if (!String(promesa.rutaTipificacion || '').toUpperCase().includes('PAGO VOLUNTARIO')) return false;
      const pagosCuota = (promesa.cuotas || []).flatMap(cuota => cuota.pagos || []);
      return pagosCuota.length === 1 && !pagosCuota[0].verificadoBanco && !pagosCuota[0].pagoBancarioId;
    }).length;
    if (voluntariosSinBanco > 0) {
      avisos.push({ texto: `${voluntariosSinBanco} ${voluntariosSinBanco === 1 ? 'pago voluntario sin banco' : 'pagos voluntarios sin banco'}`, pestana: 'asesor' });
    }
    return avisos;
  });

  private claveCargada = '';

  ngOnChanges(changes: SimpleChanges): void {
    const documento = this.documento?.trim() || null;
    const clave = documento && this.contexto
      ? `${documento}|${this.contexto.tenantId}|${this.contexto.carteraId}|${this.contexto.subcarteraId}`
      : '';
    if (!clave) {
      this.claveCargada = '';
      this.limpiar();
      return;
    }
    if (clave !== this.claveCargada) {
      this.claveCargada = clave;
      this.limpiar();
      this.cargarResumen(documento!, true);
    } else if (changes['recarga'] && !changes['recarga'].firstChange) {
      this.cargarResumen(documento!, true);
    }
  }

  resumenVisible(): boolean {
    return this.isLoadingResumenCliente() || !!this.resumenClienteError() || !!this.resumenCliente();
  }

  /** Carga el resumen del asesor; con refrescarPestanas también vuelve a leer los pagos del banco y el histórico. */
  private cargarResumen(documento: string, refrescarPestanas: boolean): void {
    if (!this.contexto) return;
    this.documentoCliente.set(documento);
    if (refrescarPestanas) this.refresco.update(valor => valor + 1);

    this.isLoadingResumenCliente.set(true);
    this.resumenClienteError.set(null);
    this.bcpPagosService.obtenerResumenConciliacionCliente(documento, this.contexto).subscribe({
      next: resumen => {
        this.resumenCliente.set(resumen);
        this.isLoadingResumenCliente.set(false);
      },
      error: error => {
        this.resumenClienteError.set(error.error?.mensaje || error.error?.message || error.message || 'No se pudo cargar el resumen del cliente.');
        this.isLoadingResumenCliente.set(false);
      }
    });
  }

  /** Un cambio desde una pestaña: se recarga el resto y se avisa a quien abrió la corrección. */
  onCambio(documento: string, refrescarPestanas: boolean): void {
    this.cargarResumen(documento, refrescarPestanas);
    this.cambio.emit(documento);
  }

  abrirCorreccionCuota(evento: { promesa: PromesaResumenConciliacion; cuota: CuotaResumenConciliacion }): void {
    const documento = this.documentoCliente();
    if (!documento) return;
    this.correccion.set({ documento, promesa: evento.promesa, cuota: evento.cuota });
  }

  abrirCorreccionCliente(): void {
    const documento = this.documentoCliente();
    if (!documento) return;
    this.correccion.set({ documento });
  }

  onCorreccionCerrada(evento: { documento: string; huboCambios: boolean }): void {
    this.correccion.set(null);
    this.despuesDeCorregir(evento);
  }

  onResolverCerrado(evento: { documento: string; huboCambios: boolean }): void {
    this.pagoResolver.set(null);
    this.despuesDeCorregir(evento);
  }

  /** La corrección puede hacer que un pago bancario pendiente ya calce: se reevalúa antes de refrescar. */
  private despuesDeCorregir(evento: { documento: string; huboCambios: boolean }): void {
    if (!evento.huboCambios || !this.contexto) return;
    const refrescar = () => this.onCambio(evento.documento, true);
    this.bcpPagosService.reevaluarPendientesCliente(evento.documento, this.contexto).subscribe({ next: refrescar, error: refrescar });
  }

  private limpiar(): void {
    this.documentoCliente.set(null);
    this.resumenCliente.set(null);
    this.resumenClienteError.set(null);
    this.pagosBanco.set([]);
    this.pestana.set('banco');
    this.correccion.set(null);
    this.pagoResolver.set(null);
  }
}
