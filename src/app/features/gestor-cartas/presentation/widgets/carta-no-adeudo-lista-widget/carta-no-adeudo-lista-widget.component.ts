import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { CartaNoAdeudoClienteCorreo } from '../../../models/carta-no-adeudo.model';

@Component({
  selector: 'app-carta-no-adeudo-lista-widget',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section class="grid gap-4 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.6fr)]">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Clientes con pago cumplido</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Selecciona un cliente para revisar su carta.</p>
          <div class="mt-2 flex w-full max-w-64 gap-1.5">
            <input
              #documento
              id="documento"
              type="search"
              placeholder="Buscar por documento"
              class="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              (input)="filtroDocumento = documento.value.trim()"
              (keyup.enter)="buscar.emit(filtroDocumento)" />
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md bg-blue-600 px-2 text-white transition-colors hover:bg-blue-700"
              (click)="buscar.emit(filtroDocumento)"
              aria-label="Buscar por documento">
              <lucide-angular name="search" [size]="15"></lucide-angular>
            </button>
          </div>
        </div>

        <div class="max-h-[34rem] divide-y divide-slate-100 overflow-y-auto dark:divide-slate-700">
          @for (cliente of clientesFiltrados; track cliente.idCliente) {
            <button
              type="button"
              class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/40"
              [class.bg-blue-50]="clientePreview?.idCliente === cliente.idCliente"
              (click)="verCarta(cliente)">
              <input
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                [checked]="estaSeleccionado(cliente)"
                (click)="$event.stopPropagation()"
                (change)="alternarSeleccion(cliente)" />
              <span class="grid min-w-0 flex-1 grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-x-3 text-xs">
                <span class="row-span-2 max-h-8 self-center overflow-hidden break-words text-xs font-medium leading-4 text-slate-800 dark:text-white">
                  {{ cliente.nombreCliente }}
                </span>
                <span
                  class="cursor-copy truncate text-right text-slate-600 transition-colors hover:text-blue-600 hover:underline dark:text-slate-300 dark:hover:text-blue-400"
                  title="Copiar correo"
                  (click)="$event.stopPropagation(); copiarCorreo(cliente.correo)">
                  {{ cliente.correo || 'Sin correo registrado' }}
                </span>
                <span class="mt-0.5 text-right text-slate-500 dark:text-slate-400">{{ cliente.documento }}</span>
              </span>
            </button>
          } @empty {
            <div class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No hay clientes para mostrar.
            </div>
          }
        </div>

        @if (totalPages > 1) {
          <div class="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
            <span>Página {{ page + 1 }} de {{ totalPages }} ({{ totalElements }} clientes)</span>
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-md border border-slate-300 px-3 py-1.5 font-medium transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
                [disabled]="page === 0"
                (click)="cambiarPagina.emit(page - 1)">
                Anterior
              </button>
              <button
                type="button"
                class="rounded-md border border-slate-300 px-3 py-1.5 font-medium transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-700"
                [disabled]="page >= totalPages - 1"
                (click)="cambiarPagina.emit(page + 1)">
                Siguiente
              </button>
            </div>
          </div>
        }
      </div>

      <article class="min-h-[34rem] rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        @if (cargandoVistaPrevia) {
          <div class="flex h-full min-h-[28rem] flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
            <div class="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p class="mt-3 text-sm font-medium">Generando vista previa...</p>
          </div>
        } @else if (vistaPreviaUrl) {
          <iframe
            [src]="vistaPreviaUrl"
            title="Vista previa de carta de no adeudo"
            class="h-[34rem] w-full rounded border-0 bg-white">
          </iframe>
        } @else {
          <div class="flex h-full min-h-[28rem] flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400">
            <lucide-angular name="file-text" [size]="36" class="mb-3 text-slate-400"></lucide-angular>
            <p class="text-sm font-medium">Selecciona un cliente</p>
            <p class="mt-1 text-xs">La vista previa de la carta se mostrará aquí.</p>
          </div>
        }
      </article>
    </section>

    <footer class="mt-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
      <p class="text-sm text-slate-600 dark:text-slate-300">
        {{ seleccionados.size }} cliente{{ seleccionados.size === 1 ? '' : 's' }} seleccionado{{ seleccionados.size === 1 ? '' : 's' }}
      </p>
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        [disabled]="seleccionados.size === 0"
        (click)="enviarValidacionPagos.emit(clientesSeleccionados)">
        <lucide-angular name="send" [size]="18"></lucide-angular>
        Enviar a validación de pagos
      </button>
    </footer>
  `
})
export class CartaNoAdeudoListaWidgetComponent {
  @Input() clientes: CartaNoAdeudoClienteCorreo[] = [];
  @Input() page = 0;
  @Input() totalPages = 0;
  @Input() totalElements = 0;
  @Input() vistaPreviaUrl: SafeResourceUrl | null = null;
  @Input() cargandoVistaPrevia = false;
  @Output() readonly buscar = new EventEmitter<string>();
  @Output() readonly cambiarPagina = new EventEmitter<number>();
  @Output() readonly verVistaPrevia = new EventEmitter<CartaNoAdeudoClienteCorreo>();
  @Output() readonly enviarValidacionPagos = new EventEmitter<CartaNoAdeudoClienteCorreo[]>();

  filtroDocumento = '';
  clientePreview: CartaNoAdeudoClienteCorreo | null = null;
  seleccionados = new Set<number>();

  get clientesFiltrados(): CartaNoAdeudoClienteCorreo[] {
    if (!this.filtroDocumento) {
      return this.clientes;
    }
    return this.clientes.filter(cliente => cliente.documento.includes(this.filtroDocumento));
  }

  get clientesSeleccionados(): CartaNoAdeudoClienteCorreo[] {
    return this.clientes.filter(cliente => this.seleccionados.has(cliente.idCliente));
  }

  verCarta(cliente: CartaNoAdeudoClienteCorreo): void {
    this.clientePreview = cliente;
    this.verVistaPrevia.emit(cliente);
  }

  copiarCorreo(correo: string | null): void {
    if (correo) {
      navigator.clipboard.writeText(correo);
    }
  }

  estaSeleccionado(cliente: CartaNoAdeudoClienteCorreo): boolean {
    return this.seleccionados.has(cliente.idCliente);
  }

  alternarSeleccion(cliente: CartaNoAdeudoClienteCorreo): void {
    if (this.seleccionados.has(cliente.idCliente)) {
      this.seleccionados.delete(cliente.idCliente);
    } else {
      this.seleccionados.add(cliente.idCliente);
    }
    this.seleccionados = new Set(this.seleccionados);
  }
}
