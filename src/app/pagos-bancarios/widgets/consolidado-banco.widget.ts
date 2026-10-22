import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsolidadoBancoService } from '../services/consolidado-banco.service';
import { BcpPagosService } from '../services/bcp-pagos.service';
import {
  ConsolidadoCargaResultado,
  ConsolidadoContexto,
  ConsolidadoCuadre
} from '../models/consolidado-banco.model';
import { ResumenConciliacionCliente } from '../models/bcp-archivo.model';
import { fechaCorta, montoSoles } from '../models/categoria-pago';
import { ReportePagosBancariosFiltrosWidget } from './reporte-pagos-bancarios-filtros.widget';
import { ArchivoDropzoneWidget } from './archivo-dropzone.widget';
import { ConsolidadoCuadreWidget } from './consolidado-cuadre.widget';
import { ClienteResumenConciliacionDrawerWidget } from './cliente-resumen-conciliacion-drawer.widget';

/**
 * Consolidado mensual del banco: se carga el total pagado por cliente en el mes y se cuadra contra
 * los pagos bancarios del sistema. Los faltantes se regularizan cliente por cliente.
 */
@Component({
  selector: 'app-consolidado-banco',
  standalone: true,
  imports: [
    CommonModule,
    ReportePagosBancariosFiltrosWidget,
    ArchivoDropzoneWidget,
    ConsolidadoCuadreWidget,
    ClienteResumenConciliacionDrawerWidget
  ],
  template: `
    <div class="space-y-4">
      <div>
        <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Consolidado mensual del banco</h2>
        <p class="text-xs text-slate-600 dark:text-slate-400">Cuadra el total pagado por cliente que reporta el banco contra los pagos del sistema.</p>
      </div>

      <app-reporte-pagos-bancarios-filtros [loading]="cargandoCuadre()" (consulta)="consultar($event)"></app-reporte-pagos-bancarios-filtros>

      <div role="status" aria-live="polite">
        @if (mensaje(); as texto) {
          <p class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200">{{ texto }}</p>
        }
      </div>
      @if (error(); as texto) {
        <p role="alert" class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">{{ texto }}</p>
      }

      @if (contexto(); as ctx) {
        @if (mostrarCarga()) {
          <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800" aria-labelledby="carga-titulo">
            <div class="mb-3 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 id="carga-titulo" class="text-lg font-semibold text-slate-800 dark:text-white">{{ cuadre()?.carga ? 'Reemplazar consolidado' : 'Cargar consolidado' }} del periodo {{ ctx.periodo }}</h3>
                <p class="text-xs text-slate-600 dark:text-slate-400">Excel del banco con una fila por cliente y la columna PAGOS. Si trae varios rangos de mora, sepáralo antes y carga cada parte en su subcartera.</p>
              </div>
              @if (cuadre()?.carga) {
                <button type="button" (click)="cancelarReemplazo()" class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Cancelar</button>
              }
            </div>
            <app-archivo-dropzone
              inputId="consolidado-archivo"
              [extensiones]="['.xlsx', '.xls']"
              descripcion="Archivos Excel (.xlsx, .xls)"
              [file]="archivo()"
              tono="blue"
              [disabled]="cargandoArchivo()"
              (fileSelected)="seleccionarArchivo($event)"
              (rejected)="error.set($event)"
            ></app-archivo-dropzone>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                (click)="cargarArchivo(false)"
                [disabled]="!archivo() || cargandoArchivo()"
                class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800"
              >
                {{ cargandoArchivo() ? 'Cargando...' : 'Cargar consolidado' }}
              </button>
            </div>

            @if (resultadoCarga(); as r) {
              @if (r.yaExiste) {
                <div role="alert" class="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200">
                  <p>{{ r.mensaje }}</p>
                  <p class="mt-1 text-xs">Los pagos ya regularizados se conservan; el cuadre se recalcula con el archivo nuevo.</p>
                  <button
                    type="button"
                    (click)="cargarArchivo(true)"
                    [disabled]="cargandoArchivo()"
                    class="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 dark:focus-visible:ring-offset-slate-800"
                  >
                    Reemplazar consolidado
                  </button>
                </div>
              }
              @if (r.errores?.length) {
                <div role="alert" class="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
                  <p class="font-semibold">{{ r.mensaje }}</p>
                  <ul class="mt-1 list-disc space-y-0.5 pl-5">
                    @for (e of r.errores; track $index) { <li>{{ e }}</li> }
                  </ul>
                </div>
              }
              @if (r.advertencias?.length) {
                <ul class="mt-3 list-disc space-y-0.5 rounded-lg border border-amber-200 bg-amber-50 py-2 pl-9 pr-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                  @for (a of r.advertencias; track $index) { <li>{{ a }}</li> }
                </ul>
              }
            }
          </section>
        }

        @if (cuadre(); as datos) {
          @if (datos.carga && datos.resumen) {
            <section class="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800" aria-labelledby="resumen-titulo">
              <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 dark:border-slate-700">
                <div class="min-w-0">
                  <h3 id="resumen-titulo" class="text-sm font-semibold text-slate-800 dark:text-white">Resumen del periodo {{ ctx.periodo }}</h3>
                  <p class="truncate text-xs text-slate-600 dark:text-slate-400" [title]="datos.carga.nombreArchivo">
                    {{ datos.carga.nombreArchivo }} · {{ fecha(datos.carga.fechaCarga) }} · {{ datos.carga.usuarioCargaNombre || '-' }}
                    · {{ datos.carga.totalClientes }} clientes, {{ datos.carga.clientesConPago }} con pago
                  </p>
                </div>
                @if (!mostrarCarga()) {
                  <button type="button" (click)="reemplazar()" class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">Reemplazar consolidado</button>
                }
              </div>
              <dl class="grid grid-cols-2 divide-slate-200 tabular-nums md:grid-cols-4 md:divide-x dark:divide-slate-700">
                <div class="px-4 py-2">
                  <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Banco</dt>
                  <dd class="text-base font-bold text-slate-900 dark:text-white">{{ monto(datos.resumen.montoConsolidado) }}</dd>
                </div>
                <div class="px-4 py-2">
                  <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Recibido</dt>
                  <dd class="text-base font-bold text-slate-900 dark:text-white">{{ monto(datos.resumen.montoRecibido) }}</dd>
                  @if (datos.resumen.montoRegularizado > 0) {
                    <dd class="text-[11px] text-slate-600 dark:text-slate-400">Regularizado {{ monto(datos.resumen.montoRegularizado) }}</dd>
                  }
                </div>
                <div class="px-4 py-2">
                  <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Conciliado</dt>
                  <dd class="text-base font-bold text-slate-900 dark:text-white">{{ monto(datos.resumen.montoConciliado) }}</dd>
                </div>
                <div class="px-4 py-2">
                  <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Banco − recibido</dt>
                  <dd class="text-base font-bold" [class]="Math.abs(datos.resumen.diferencia) >= 0.5 ? 'text-red-800 dark:text-red-300' : 'text-emerald-800 dark:text-emerald-300'">{{ monto(datos.resumen.diferencia) }}</dd>
                </div>
              </dl>
              @if (avisoArchivosDiarios(); as aviso) {
                <p class="border-t border-amber-200 bg-amber-50 px-4 py-1.5 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">{{ aviso }}</p>
              }
            </section>

            <app-consolidado-cuadre
              [filas]="datos.filas"
              [contexto]="ctx"
              (documentoClick)="abrirResumen($event)"
              (regularizado)="onRegularizado($event)"
            ></app-consolidado-cuadre>
          }
        }
      } @else if (!cargandoCuadre()) {
        <div class="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">Selecciona el periodo y la subcartera, y consulta el consolidado.</div>
      }
    </div>

    <app-cliente-resumen-conciliacion-drawer
      [open]="resumenAbierto()"
      [loading]="cargandoResumen()"
      [error]="errorResumen()"
      [documento]="documentoResumen()"
      [resumen]="resumen()"
      [tenantId]="contexto()?.tenantId ?? null"
      [carteraId]="contexto()?.carteraId ?? null"
      [subcarteraId]="contexto()?.subcarteraId ?? null"
      (close)="resumenAbierto.set(false)"
    ></app-cliente-resumen-conciliacion-drawer>
  `
})
export class ConsolidadoBancoWidget {
  protected readonly Math = Math;

  contexto = signal<ConsolidadoContexto | null>(null);
  cuadre = signal<ConsolidadoCuadre | null>(null);
  cargandoCuadre = signal(false);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  archivo = signal<File | null>(null);
  cargandoArchivo = signal(false);
  resultadoCarga = signal<ConsolidadoCargaResultado | null>(null);
  /** Con consolidado cargado, el panel de carga solo se muestra al pedir el reemplazo. */
  private reemplazando = signal(false);

  resumenAbierto = signal(false);
  cargandoResumen = signal(false);
  errorResumen = signal<string | null>(null);
  documentoResumen = signal<string | null>(null);
  resumen = signal<ResumenConciliacionCliente | null>(null);

  readonly mostrarCarga = computed(() => !this.cargandoCuadre() && (!this.cuadre()?.carga || this.reemplazando()));

  /** Si el último pago diario es anterior al fin de mes, aún pueden faltar archivos diarios por cargar. */
  readonly avisoArchivosDiarios = computed(() => {
    const ctx = this.contexto();
    const ultimo = this.cuadre()?.resumen?.ultimoPagoDiario;
    if (!ctx) return null;
    const [anio, mes] = ctx.periodo.split('-').map(Number);
    const finMes = `${ctx.periodo}-${String(new Date(anio, mes, 0).getDate()).padStart(2, '0')}`;
    if (!ultimo) {
      return 'No hay pagos de archivos diarios en este periodo. Carga los archivos diarios antes de regularizar.';
    }
    if (ultimo < finMes) {
      return `El último pago llegado en los archivos diarios es del ${fechaCorta(ultimo)}. Si faltan archivos del fin de mes, cárgalos antes de regularizar.`;
    }
    return null;
  });

  constructor(
    private readonly consolidadoService: ConsolidadoBancoService,
    private readonly bcpService: BcpPagosService
  ) {}

  consultar(filtros: ConsolidadoContexto): void {
    this.contexto.set({ ...filtros });
    this.archivo.set(null);
    this.resultadoCarga.set(null);
    this.reemplazando.set(false);
    this.mensaje.set(null);
    this.cargarCuadre();
  }

  seleccionarArchivo(file: File): void {
    this.archivo.set(file);
    this.resultadoCarga.set(null);
    this.error.set(null);
  }

  reemplazar(): void {
    this.reemplazando.set(true);
    this.archivo.set(null);
    this.resultadoCarga.set(null);
  }

  cancelarReemplazo(): void {
    this.reemplazando.set(false);
    this.archivo.set(null);
    this.resultadoCarga.set(null);
  }

  cargarArchivo(reemplazar: boolean): void {
    const ctx = this.contexto();
    const file = this.archivo();
    if (!ctx || !file) return;

    this.cargandoArchivo.set(true);
    this.error.set(null);
    this.mensaje.set(null);
    this.consolidadoService.cargar(file, ctx, reemplazar).subscribe({
      next: resultado => {
        this.cargandoArchivo.set(false);
        this.resultadoCarga.set(resultado);
        if (resultado.exitoso) {
          this.mensaje.set(`${resultado.mensaje}: ${resultado.totalClientes} clientes, ${resultado.clientesConPago} con pago, total ${montoSoles(resultado.montoTotalPagos)}.`);
          this.archivo.set(null);
          this.reemplazando.set(false);
          this.cargarCuadre();
        }
      },
      error: err => {
        this.cargandoArchivo.set(false);
        if (err?.error && typeof err.error === 'object' && 'exitoso' in err.error) {
          this.resultadoCarga.set(err.error as ConsolidadoCargaResultado);
        } else {
          this.error.set(err?.error?.mensaje || err?.message || 'No se pudo cargar el consolidado.');
        }
      }
    });
  }

  onRegularizado(texto: string): void {
    this.mensaje.set(texto);
    this.cargarCuadre();
  }

  abrirResumen(documento: string): void {
    const ctx = this.contexto();
    if (!ctx) return;
    this.resumenAbierto.set(true);
    this.cargandoResumen.set(true);
    this.errorResumen.set(null);
    this.documentoResumen.set(documento);
    this.resumen.set(null);
    this.bcpService.obtenerResumenConciliacionCliente(documento, ctx).subscribe({
      next: resumen => {
        this.resumen.set(resumen);
        this.cargandoResumen.set(false);
      },
      error: err => {
        this.errorResumen.set(err?.error?.mensaje || err?.error?.message || err?.message || 'No se pudo cargar el resumen del cliente.');
        this.cargandoResumen.set(false);
      }
    });
  }

  fecha(valor: unknown): string {
    return fechaCorta(valor);
  }

  monto(valor: number | string | null | undefined): string {
    return montoSoles(valor);
  }

  private cargarCuadre(): void {
    const ctx = this.contexto();
    if (!ctx) return;
    this.cargandoCuadre.set(true);
    this.error.set(null);
    this.consolidadoService.obtenerCuadre(ctx).subscribe({
      next: cuadre => {
        this.cuadre.set(cuadre);
        this.cargandoCuadre.set(false);
      },
      error: err => {
        this.cuadre.set(null);
        this.error.set(err?.error?.mensaje || err?.message || 'No se pudo consultar el consolidado.');
        this.cargandoCuadre.set(false);
      }
    });
  }
}
