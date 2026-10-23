import { Component, EventEmitter, Input, Output } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { ContextoAjuste } from '../models/ajuste-conciliacion.model';
import { CorreccionClienteWidget } from './correccion-cliente.widget';

/** Cliente a corregir desde otra pantalla. */
export interface CorreccionClienteSolicitud {
  documento: string;
  contexto: ContextoAjuste;
  /** Pago bancario cuya ficha se abre al cargar. */
  pb?: number | null;
}

/**
 * Corrección de pagos de un cliente abierta encima de otra pantalla (resumen, consolidado, historial), sin salir de
 * ella: así no se pierde, por ejemplo, la vista previa de una carga. Ocupa casi toda la pantalla pero se ve el fondo,
 * para que se note que es un diálogo. Se cierra con el botón: Escape lo usan los diálogos de dentro.
 */
@Component({
  selector: 'app-correccion-cliente-dialog',
  standalone: true,
  imports: [A11yModule, CorreccionClienteWidget],
  template: `
    @if (solicitud; as s) {
      <div class="fixed inset-0 z-[1105] flex items-stretch justify-center bg-slate-900/60 p-2 sm:p-5">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ccd-titulo"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          class="flex w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl border border-slate-300 bg-slate-50 shadow-2xl dark:border-slate-600 dark:bg-slate-900"
        >
          <header class="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-700 dark:bg-slate-800">
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Corrección de pagos</p>
              <h2 id="ccd-titulo" class="text-base font-semibold text-slate-900 dark:text-white">Cliente <span class="font-mono">{{ s.documento }}</span></h2>
            </div>
            <button
              type="button"
              (click)="cerrar()"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cerrar
            </button>
          </header>
          <div class="flex-1 overflow-y-auto p-4">
            <app-correccion-cliente
              [documento]="s.documento"
              [contexto]="s.contexto"
              [pbAbrir]="s.pb ?? null"
              (cambio)="huboCambios = true"
            ></app-correccion-cliente>
          </div>
        </div>
      </div>
    }
  `
})
export class CorreccionClienteDialogWidget {
  /** El diálogo está abierto mientras tenga valor. */
  @Input() solicitud: CorreccionClienteSolicitud | null = null;
  @Output() cerrado = new EventEmitter<{ documento: string; huboCambios: boolean }>();

  huboCambios = false;

  cerrar(): void {
    const documento = this.solicitud?.documento ?? '';
    const huboCambios = this.huboCambios;
    this.huboCambios = false;
    this.cerrado.emit({ documento, huboCambios });
  }
}
