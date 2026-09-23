import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { CartaNoAdeudoClienteCorreo, CartaNoAdeudoRechazo, MetodoContactoCorreo } from '../../../models/carta-no-adeudo.model';
import { CartaNoAdeudoService } from '../../../services/carta-no-adeudo.service';
import { CartaNoAdeudoListaWidgetComponent } from '../../widgets/carta-no-adeudo-lista-widget/carta-no-adeudo-lista-widget.component';
import { CorreccionPagosService } from '../../../../../pagos-bancarios/services/correccion-pagos.service';
import { CuotaValidaTipificar, PagoPendienteConciliacion } from '../../../../../pagos-bancarios/models/correccion-pagos.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-carta-no-adeudo-email-page',
  standalone: true,
  imports: [LucideAngularModule, CartaNoAdeudoListaWidgetComponent],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div class="mx-auto max-w-7xl">
        <div class="mb-5">
          <h1 class="text-xl font-bold text-slate-800 dark:text-white">Emisión de cartas por correo</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400">Gestiona la validación y envío de cartas de no adeudo.</p>
        </div>

        <nav class="mb-5 flex gap-1 border-b border-slate-200 dark:border-slate-700" aria-label="Etapas de emisión">
          <button
            type="button"
            class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
            [class.border-blue-600]="activeTab() === 'correo'"
            [class.text-blue-600]="activeTab() === 'correo'"
            [class.border-transparent]="activeTab() !== 'correo'"
            [class.text-slate-500]="activeTab() !== 'correo'"
            (click)="activeTab.set('correo')">
            <lucide-angular name="mail" [size]="16"></lucide-angular>
            Validación de usuarios por correo
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
            [class.border-blue-600]="activeTab() === 'pagos'"
            [class.text-blue-600]="activeTab() === 'pagos'"
            [class.border-transparent]="activeTab() !== 'pagos'"
            [class.text-slate-500]="activeTab() !== 'pagos'"
            (click)="activeTab.set('pagos')">
            <lucide-angular name="badge-check" [size]="16"></lucide-angular>
            Validación de pagos
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors"
            [class.border-blue-600]="activeTab() === 'historial'"
            [class.text-blue-600]="activeTab() === 'historial'"
            [class.border-transparent]="activeTab() !== 'historial'"
            [class.text-slate-500]="activeTab() !== 'historial'"
            (click)="activeTab.set('historial')">
            <lucide-angular name="history" [size]="16"></lucide-angular>
            Historial
          </button>
        </nav>

        @if (activeTab() === 'correo') {
          <app-carta-no-adeudo-lista-widget
            [clientes]="clientes()"
            [page]="pagina()"
            [totalPages]="totalPaginas()"
            [totalElements]="totalCandidatos()"
            [vistaPreviaUrl]="vistaPreviaUrl()"
            [cargandoVistaPrevia]="cargandoVistaPrevia()"
            (buscar)="cargarCandidatos($event)"
            (cambiarPagina)="cambiarPagina($event)"
            (verVistaPrevia)="generarVistaPrevia($event)"
            (enviarValidacionPagos)="enviarAValidacionPagos($event)">
          </app-carta-no-adeudo-lista-widget>
          @if (clienteCorreo(); as cliente) {
            <section class="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Correo para {{ cliente.documento }}</h2>
              <div class="mt-3 flex flex-wrap gap-2">@for (correo of correos(); track correo.id) { <button type="button" (click)="seleccionarCorreo(cliente, correo)" class="rounded-full border px-3 py-1.5 text-xs" [class.border-blue-600]="cliente.correo === correo.valor" [class.text-blue-600]="cliente.correo === correo.valor">{{ correo.valor }}</button> }</div>
              <div class="mt-3 flex max-w-md gap-2"><input #nuevoCorreo type="email" placeholder="nuevo@correo.com" class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" (input)="correoNuevo.set(nuevoCorreo.value.trim())" /><button type="button" [disabled]="!correoValido()" (click)="agregarCorreo(cliente)" class="rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white disabled:opacity-40">Agregar</button></div>
            </section>
          }
          <section class="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div class="flex items-center justify-between"><h2 class="text-sm font-semibold">Retornados a validación de correo</h2><span class="text-xs text-slate-500">{{ totalRechazos() }}</span></div>
            <div class="mt-3 divide-y divide-slate-100 dark:divide-slate-700">
              @for (rechazo of rechazos(); track rechazo.id) { <div class="py-3"><p class="text-xs font-medium">Solicitud #{{ rechazo.idSolicitud }}</p><p class="mt-1 text-sm text-slate-700 dark:text-slate-300">{{ rechazo.justificacion }}</p><p class="mt-1 text-xs text-slate-500">{{ rechazo.fechaRechazo }}</p></div> } @empty { <p class="py-4 text-sm text-slate-500">No hay clientes retornados.</p> }
            </div>
            @if (totalPaginasRechazos() > 1) { <div class="mt-3 flex justify-end gap-2"><button [disabled]="paginaRechazos() === 0" (click)="cargarRechazos(paginaRechazos() - 1)" class="rounded px-2 py-1 text-xs disabled:opacity-40">Anterior</button><button [disabled]="paginaRechazos() >= totalPaginasRechazos() - 1" (click)="cargarRechazos(paginaRechazos() + 1)" class="rounded px-2 py-1 text-xs disabled:opacity-40">Siguiente</button></div> }
          </section>
        }
        @if (activeTab() === 'pagos') {
          <app-carta-no-adeudo-lista-widget
            [clientes]="clientesEnPagos()"
            [mostrarAccion]="false"
            titulo="Clientes en validación de pagos"
            descripcion="Selecciona un cliente para revisar pagos y gestiones."
            (verVistaPrevia)="cargarPagosCliente($event)"
            (seleccionadosCambiaron)="seleccionadosPagos.set($event)">
          </app-carta-no-adeudo-lista-widget>
          @if (clientePagos(); as cliente) {
            <section class="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div class="mb-4 flex gap-2 border-b border-slate-100 pb-3 dark:border-slate-700">
                <textarea #justificacion rows="2" placeholder="Justificación del rechazo" class="min-w-0 flex-1 resize-none rounded-lg border border-slate-200 p-2 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700" (input)="justificacionRechazo.set(justificacion.value.trim())"></textarea>
                <button type="button" [disabled]="!cliente.idSolicitud || !justificacionRechazo()" (click)="rechazarCliente(cliente)" class="rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white disabled:opacity-40">Rechazar</button>
              </div>
              <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Pagos y gestiones: {{ cliente.documento }}</h2>
              <div class="mt-3 grid gap-4 md:grid-cols-2">
                <div>
                  <h3 class="mb-2 text-xs font-semibold uppercase text-slate-500">Cuotas</h3>
                  @for (cuota of cuotas(); track cuota.cuotaId) { <p class="text-xs text-slate-700 dark:text-slate-300">Cuota {{ cuota.numeroCuota }} · {{ cuota.estadoCuota }} · {{ cuota.montoPromesa }}</p> } @empty { <p class="text-xs text-slate-500">Sin cuotas registradas.</p> }
                </div>
                <div>
                  <h3 class="mb-2 text-xs font-semibold uppercase text-slate-500">Pagos</h3>
                  @for (pago of pagos(); track pago.pagoCuotaId) { <p class="text-xs text-slate-700 dark:text-slate-300">{{ pago.fechaPago }} · {{ pago.montoPago }} · {{ pago.estadoPagoGestion }}</p> } @empty { <p class="text-xs text-slate-500">Sin pagos pendientes.</p> }
                </div>
              </div>
            </section>
          }
          <footer class="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <input #correoPrueba type="email" placeholder="Correo para prueba" class="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none" (input)="correoPruebaEnvio.set(correoPrueba.value.trim())" />
            <button type="button" [disabled]="!correoPruebaEnvio()" class="rounded-lg bg-slate-700 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Enviar prueba</button>
            <button type="button" (click)="dialogEnvio.set(true)" class="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">Enviar</button>
          </footer>
          @if (dialogEnvio()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
              <div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-slate-800">
                <h2 class="text-base font-semibold">Confirmar envío</h2>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Se enviarán {{ seleccionadosPagos().length }} correos.</p>
                <div class="mt-5 flex justify-end gap-2"><button class="rounded-lg px-3 py-2 text-sm">Cancelar</button><button class="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white">Aceptar</button></div>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class CartaNoAdeudoEmailPageComponent implements OnInit, OnDestroy {
  private readonly cartaNoAdeudoService = inject(CartaNoAdeudoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly correccionPagosService = inject(CorreccionPagosService);

  readonly activeTab = signal<'correo' | 'pagos' | 'historial'>('correo');
  readonly clientes = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly pagina = signal(0);
  readonly totalPaginas = signal(0);
  readonly totalCandidatos = signal(0);
  readonly vistaPreviaUrl = signal<SafeResourceUrl | null>(null);
  readonly cargandoVistaPrevia = signal(false);
  readonly clientesEnPagos = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly clientePagos = signal<CartaNoAdeudoClienteCorreo | null>(null);
  readonly cuotas = signal<CuotaValidaTipificar[]>([]);
  readonly pagos = signal<PagoPendienteConciliacion[]>([]);
  readonly seleccionadosPagos = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly correoPruebaEnvio = signal('');
  readonly dialogEnvio = signal(false);
  readonly rechazos = signal<CartaNoAdeudoRechazo[]>([]);
  readonly paginaRechazos = signal(0);
  readonly totalPaginasRechazos = signal(0);
  readonly totalRechazos = signal(0);
  readonly justificacionRechazo = signal('');
  readonly clienteCorreo = signal<CartaNoAdeudoClienteCorreo | null>(null);
  readonly correos = signal<MetodoContactoCorreo[]>([]);
  readonly correoNuevo = signal('');
  private documentoBusqueda?: string;
  private objectUrl?: string;
  private solicitudVistaPrevia = 0;

  ngOnInit(): void {
    this.cargarCandidatos();
    this.cargarRechazos();
  }

  cargarCandidatos(documento?: string, page = 0): void {
    this.documentoBusqueda = documento?.trim() || undefined;
    this.cartaNoAdeudoService.listarCandidatos(this.documentoBusqueda, page, 20).subscribe({
      next: response => {
        this.clientes.set(response.content.slice(0, 20));
        this.pagina.set(response.page);
        this.totalPaginas.set(response.totalPages);
        this.totalCandidatos.set(response.totalElements);
      },
      error: error => console.error('No se pudieron cargar candidatos para carta de no adeudo', error)
    });
  }

  cambiarPagina(page: number): void {
    this.cargarCandidatos(this.documentoBusqueda, page);
  }

  enviarAValidacionPagos(clientes: CartaNoAdeudoClienteCorreo[]): void {
    const solicitudes = clientes.map(cliente => ({
      idCliente: cliente.idCliente,
      idGestion: cliente.idGestion,
      idTenant: cliente.idTenant,
      idCartera: cliente.idCartera,
      idSubcartera: cliente.idSubcartera,
      tipoSolicitud: 'ORIGINAL' as const,
      idMetodoContactoDestino: cliente.idMetodoContacto ?? undefined,
      correoDestino: cliente.correo ?? ''
    }));
    this.cartaNoAdeudoService.enviarAValidacionPagos(solicitudes).subscribe({
      next: solicitudesCreadas => {
        this.clientesEnPagos.set(clientes.map((cliente, indice) => ({
          ...cliente,
          idSolicitud: solicitudesCreadas[indice]?.id
        })));
        this.cargarCandidatos(this.documentoBusqueda, this.pagina());
        this.activeTab.set('pagos');
      },
      error: error => console.error('No se pudieron enviar las cartas a validación de pagos', error)
    });
  }

  cargarPagosCliente(cliente: CartaNoAdeudoClienteCorreo): void {
    this.clientePagos.set(cliente);
    const contexto = { documento: cliente.documento, tenantId: cliente.idTenant, carteraId: cliente.idCartera, subcarteraId: cliente.idSubcartera };
    forkJoin({
      cuotas: this.correccionPagosService.buscarCuotasValidasTipificar(contexto),
      pagos: this.correccionPagosService.buscarPendientesConciliacion(contexto)
    }).subscribe({
      next: resultado => { this.cuotas.set(resultado.cuotas); this.pagos.set(resultado.pagos); },
      error: error => console.error('No se pudieron cargar pagos del cliente', error)
    });
  }

  rechazarCliente(cliente: CartaNoAdeudoClienteCorreo): void {
    if (!cliente.idSolicitud || !this.justificacionRechazo()) return;
    this.cartaNoAdeudoService.rechazarSolicitud(cliente.idSolicitud, this.justificacionRechazo()).subscribe({
      next: () => {
        this.clientesEnPagos.update(clientes => clientes.filter(item => item.idSolicitud !== cliente.idSolicitud));
        this.clientePagos.set(null);
        this.justificacionRechazo.set('');
        this.cargarRechazos();
      },
      error: error => console.error('No se pudo rechazar la solicitud', error)
    });
  }

  cargarRechazos(page = 0): void {
    this.cartaNoAdeudoService.listarRechazos(page, 20).subscribe({
      next: response => { this.rechazos.set(response.content); this.paginaRechazos.set(response.page); this.totalPaginasRechazos.set(response.totalPages); this.totalRechazos.set(response.totalElements); },
      error: error => console.error('No se pudieron cargar rechazos', error)
    });
  }

  generarVistaPrevia(cliente: CartaNoAdeudoClienteCorreo): void {
    this.clienteCorreo.set(cliente);
    this.cargarCorreos(cliente);
    const solicitudActual = ++this.solicitudVistaPrevia;
    this.cargandoVistaPrevia.set(true);
    this.limpiarVistaPrevia();
    this.vistaPreviaUrl.set(null);
    this.cartaNoAdeudoService.generarVistaPrevia(cliente).subscribe({
      next: pdf => {
        if (solicitudActual !== this.solicitudVistaPrevia) {
          return;
        }
        this.objectUrl = URL.createObjectURL(pdf);
        this.vistaPreviaUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
        this.cargandoVistaPrevia.set(false);
      },
      error: error => {
        if (solicitudActual !== this.solicitudVistaPrevia) {
          return;
        }
        this.cargandoVistaPrevia.set(false);
        console.error('No se pudo generar la vista previa de la carta', error);
      }
    });
  }

  correoValido(): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoNuevo()); }
  cargarCorreos(cliente: CartaNoAdeudoClienteCorreo): void { this.cartaNoAdeudoService.listarCorreos(cliente).subscribe({ next: pagina => this.correos.set(pagina.content), error: error => console.error('No se pudieron cargar correos', error) }); }
  seleccionarCorreo(cliente: CartaNoAdeudoClienteCorreo, correo: MetodoContactoCorreo): void { const actualizado = { ...cliente, correo: correo.valor, idMetodoContacto: correo.id }; this.clienteCorreo.set(actualizado); this.clientes.update(clientes => clientes.map(item => item.idCliente === cliente.idCliente ? actualizado : item)); }
  agregarCorreo(cliente: CartaNoAdeudoClienteCorreo): void { if (!this.correoValido()) return; this.cartaNoAdeudoService.agregarCorreo(cliente, this.correoNuevo()).subscribe({ next: correo => { this.seleccionarCorreo(cliente, correo); this.correoNuevo.set(''); this.cargarCorreos(cliente); }, error: error => console.error('No se pudo agregar correo', error) }); }

  ngOnDestroy(): void {
    this.solicitudVistaPrevia++;
    this.limpiarVistaPrevia();
  }

  private limpiarVistaPrevia(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
