import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { CartaNoAdeudoClienteCorreo } from '../../../models/carta-no-adeudo.model';
import { CartaNoAdeudoService } from '../../../services/carta-no-adeudo.service';
import { CartaNoAdeudoListaWidgetComponent } from '../../widgets/carta-no-adeudo-lista-widget/carta-no-adeudo-lista-widget.component';

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
        }
        @if (activeTab() === 'pagos') {
          <app-carta-no-adeudo-lista-widget
            [clientes]="clientesEnPagos()"
            [modoSoloLectura]="true"
            titulo="Clientes en validación de pagos"
            descripcion="Solicitudes enviadas a validación de pagos.">
          </app-carta-no-adeudo-lista-widget>
        }
      </div>
    </div>
  `
})
export class CartaNoAdeudoEmailPageComponent implements OnInit, OnDestroy {
  private readonly cartaNoAdeudoService = inject(CartaNoAdeudoService);
  private readonly sanitizer = inject(DomSanitizer);

  readonly activeTab = signal<'correo' | 'pagos' | 'historial'>('correo');
  readonly clientes = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly pagina = signal(0);
  readonly totalPaginas = signal(0);
  readonly totalCandidatos = signal(0);
  readonly vistaPreviaUrl = signal<SafeResourceUrl | null>(null);
  readonly cargandoVistaPrevia = signal(false);
  readonly clientesEnPagos = signal<CartaNoAdeudoClienteCorreo[]>([]);
  private documentoBusqueda?: string;
  private objectUrl?: string;
  private solicitudVistaPrevia = 0;

  ngOnInit(): void {
    this.cargarCandidatos();
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
      next: () => {
        this.clientesEnPagos.set(clientes);
        this.cargarCandidatos(this.documentoBusqueda, this.pagina());
        this.activeTab.set('pagos');
      },
      error: error => console.error('No se pudieron enviar las cartas a validación de pagos', error)
    });
  }

  generarVistaPrevia(cliente: CartaNoAdeudoClienteCorreo): void {
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
