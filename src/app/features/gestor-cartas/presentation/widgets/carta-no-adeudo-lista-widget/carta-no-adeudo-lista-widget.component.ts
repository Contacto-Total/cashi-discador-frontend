import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CartaNoAdeudoClienteCorreo } from '../../../models/carta-no-adeudo.model';

@Component({
  selector: 'app-carta-no-adeudo-lista-widget',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div class="w-full sm:max-w-sm">
          <label for="documento" class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Documento del cliente
          </label>
          <div class="flex gap-2">
            <input
              #documento
              id="documento"
              type="search"
              placeholder="Buscar por documento"
              class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              (input)="filtroDocumento = documento.value.trim()"
              (keyup.enter)="buscar.emit(filtroDocumento)" />
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 text-white transition-colors hover:bg-blue-700"
              (click)="buscar.emit(filtroDocumento)"
              aria-label="Buscar por documento">
              <lucide-angular name="search" [size]="18"></lucide-angular>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          (click)="crearSolicitud.emit()">
          <lucide-angular name="plus" [size]="18"></lucide-angular>
          Nueva solicitud
        </button>
      </div>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.6fr)]">
      <div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
          <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Clientes con pago cumplido</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">Selecciona un cliente para revisar su carta.</p>
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
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-slate-800 dark:text-white">{{ cliente.nombreCliente }}</span>
                <span class="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{{ cliente.documento }}</span>
                <span class="mt-1 block truncate text-xs text-slate-600 dark:text-slate-300">
                  <lucide-angular name="mail" [size]="13" class="mr-1 inline-block"></lucide-angular>
                  {{ cliente.correo || 'Sin correo registrado' }}
                </span>
              </span>
            </button>
          } @empty {
            <div class="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No hay clientes para mostrar.
            </div>
          }
        </div>
      </div>

      <article class="min-h-[34rem] rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        @if (clientePreview; as cliente) {
          <div class="mx-auto max-w-2xl text-sm leading-7 text-slate-700 dark:text-slate-200">
            <div class="mb-10 flex items-start justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Vista previa de carta</span>
              <span>{{ cliente.documento }}</span>
            </div>
            <p class="mb-8 text-right">Lima, {{ fechaActual }}</p>
            <h2 class="mb-8 text-center text-base font-bold tracking-wide">CARTA DE NO ADEUDO</h2>
            <p class="mb-6">Por medio de la presente se deja constancia que:</p>
            <div class="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
              <p class="font-semibold">{{ cliente.nombreCliente }}</p>
              <p>DNI: {{ cliente.documento }}</p>
            </div>
            <p>
              No mantiene deuda o saldo pendiente, conforme a los pagos registrados y validados en el sistema.
            </p>
            <p class="mt-10">Atentamente,</p>
          </div>
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
  @Output() readonly buscar = new EventEmitter<string>();
  @Output() readonly crearSolicitud = new EventEmitter<void>();
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

  get fechaActual(): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }

  verCarta(cliente: CartaNoAdeudoClienteCorreo): void {
    this.clientePreview = cliente;
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
