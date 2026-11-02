import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AdjuntoResumenConciliacion } from '../models/bcp-archivo.model';
import { fechaCorta } from '../models/categoria-pago';
import { BcpPagosService } from '../services/bcp-pagos.service';

export interface VoucherAbierto {
  adjuntos: AdjuntoResumenConciliacion[];
  cuota: number;
  subidoPor: string | null;
  /** Monto ya formateado con su moneda. */
  monto: string;
  verificado: boolean;
}

export interface ContextoVoucher {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

/**
 * Voucher en la columna derecha: junto a la lista solo va la imagen y lo que la lista no dice.
 * Al ampliarlo no queda nada al lado, así que muestra también sus datos.
 */
@Component({
  selector: 'app-voucher-lado',
  standalone: true,
  imports: [NgTemplateOutlet, LucideAngularModule, BotonDirective, TarjetaDirective],
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    <ng-template #acciones>
      <div class="flex flex-none items-center gap-1.5">
        @if (voucher.adjuntos.length > 1) {
          <span class="text-[.75rem] text-muted-foreground">{{ indice() + 1 }} de {{ voucher.adjuntos.length }}</span>
          <button type="button" appBoton="secundario" appBotonAlto="icono" aria-label="Voucher anterior" [disabled]="indice() === 0" (click)="mover(-1)"><lucide-angular name="chevron-left" [size]="16"></lucide-angular></button>
          <button type="button" appBoton="secundario" appBotonAlto="icono" aria-label="Voucher siguiente" [disabled]="indice() >= voucher.adjuntos.length - 1" (click)="mover(1)"><lucide-angular name="chevron-right" [size]="16"></lucide-angular></button>
        }
        <button type="button" appBoton="secundario" appBotonAlto="icono" [attr.aria-label]="ampliado() ? 'Reducir voucher' : 'Ampliar voucher'" [title]="ampliado() ? 'Reducir voucher' : 'Ampliar voucher'" (click)="ampliado.set(!ampliado())">
          <lucide-angular [name]="ampliado() ? 'minimize-2' : 'maximize-2'" [size]="16"></lucide-angular>
        </button>
        @if (url(); as enlace) {
          <a appBoton="secundario" appBotonAlto="icono" aria-label="Descargar voucher" title="Descargar voucher" [href]="enlace" [attr.download]="actual()?.nombreArchivo || 'voucher'"><lucide-angular name="download" [size]="16"></lucide-angular></a>
        }
        <button type="button" appBoton="secundario" appBotonAlto="icono" aria-label="Cerrar voucher" title="Cerrar voucher" (click)="cerrado.emit()"><lucide-angular name="x" [size]="16"></lucide-angular></button>
      </div>
    </ng-template>

    <ng-template #imagen>
      @if (cargando()) {
        <p class="m-0 text-[.875rem] text-muted-foreground">Cargando voucher…</p>
      } @else if (error(); as e) {
        <p role="alert" class="m-0 text-center text-[.875rem] font-medium text-(--ro)">{{ e }}</p>
      } @else if (url(); as enlace) {
        @if (esImagen()) {
          <img [src]="enlace" [alt]="'Voucher de la cuota ' + voucher.cuota" class="block size-full object-contain">
        } @else {
          <a appBoton="secundario" [href]="enlace" target="_blank" rel="noopener">Abrir archivo</a>
        }
      }
    </ng-template>

    @if (ampliado()) {
      <section aria-label="Voucher" class="font-cashi fixed inset-0 z-[1200] flex items-center justify-center gap-[clamp(1.5rem,4vw,3rem)] bg-background p-6 text-[.875rem] text-foreground">
        <div class="flex h-full min-w-0 flex-[0_1_46rem] items-center justify-center overflow-hidden rounded-[.625rem] bg-muted p-5">
          <ng-container [ngTemplateOutlet]="imagen"></ng-container>
        </div>
        <div class="flex min-w-0 flex-[0_1_21rem] flex-col gap-3">
          <div class="flex items-center gap-2">
            <h2 class="m-0 mr-auto text-[.9375rem] font-bold">Voucher</h2>
            <ng-container [ngTemplateOutlet]="acciones"></ng-container>
          </div>
          <dl class="m-0 flex flex-col">
            @for (d of datos(); track d.rotulo) {
              <div class="flex items-baseline justify-between gap-4 border-t border-border py-2.5">
                <dt class="text-muted-foreground">{{ d.rotulo }}</dt>
                <dd class="m-0 min-w-0 text-right font-semibold wrap-anywhere">{{ d.valor }}</dd>
              </div>
            }
          </dl>
        </div>
      </section>
    } @else {
      <section appTarjeta aria-label="Voucher" class="font-cashi flex min-h-0 flex-1 flex-col gap-3 px-4 pt-[clamp(.75rem,1.8vh,1rem)] pb-4 text-[.875rem] text-foreground">
        <div class="flex flex-none items-center gap-2">
          <h2 class="m-0 mr-auto text-[.9375rem] font-bold">Voucher</h2>
          <ng-container [ngTemplateOutlet]="acciones"></ng-container>
        </div>
        <div class="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[.625rem] bg-muted p-3.5">
          <ng-container [ngTemplateOutlet]="imagen"></ng-container>
        </div>
        <p class="m-0 flex-none text-center text-[.75rem] leading-[1.4] text-muted-foreground">
          <span class="block font-medium text-foreground">Cuota {{ voucher.cuota }}{{ voucher.subidoPor ? ', subido por ' + voucher.subidoPor : '' }}</span>
          <span class="block wrap-anywhere">{{ fecha(actual()?.fechaCreacion) }}, {{ actual()?.nombreArchivo }}</span>
        </p>
      </section>
    }
  `
})
export class VoucherLadoWidget implements OnChanges, OnDestroy {
  @Input({ required: true }) voucher!: VoucherAbierto;
  @Input({ required: true }) contexto!: ContextoVoucher;
  @Output() cerrado = new EventEmitter<void>();

  private readonly bcp = inject(BcpPagosService);
  private readonly saneador = inject(DomSanitizer);

  indice = signal(0);
  ampliado = signal(false);
  cargando = signal(false);
  error = signal<string | null>(null);
  url = signal<SafeUrl | null>(null);
  private pedido?: Subscription;
  private objeto: string | null = null;
  private recibido = signal<VoucherAbierto | null>(null);

  actual = computed(() => this.recibido()?.adjuntos[this.indice()] ?? null);
  esImagen = computed(() => String(this.actual()?.tipoArchivo || '').toLowerCase().startsWith('image/'));
  datos = computed(() => [
    { rotulo: 'Cuota', valor: `Cuota ${this.recibido()?.cuota}` },
    { rotulo: 'Monto registrado', valor: this.recibido()?.monto || '—' },
    { rotulo: 'Subido por', valor: this.recibido()?.subidoPor || '—' },
    { rotulo: 'Fecha', valor: this.fecha(this.actual()?.fechaCreacion) },
    { rotulo: 'Banco', valor: this.recibido()?.verificado ? 'Verificado' : 'Sin verificar' },
    { rotulo: 'Archivo', valor: this.actual()?.nombreArchivo || '—' }
  ]);

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['voucher']) return;
    this.recibido.set(this.voucher);
    this.cargar(0);
  }

  ngOnDestroy(): void {
    this.liberar();
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.ampliado()) this.ampliado.set(false);
    else this.cerrado.emit();
  }

  mover(delta: number): void {
    this.cargar(this.indice() + delta);
  }

  fecha(valor: string | null | undefined): string {
    return valor ? `${fechaCorta(valor)} ${String(valor).slice(11, 16)}`.trim() : '—';
  }

  private cargar(indice: number): void {
    const adjunto = this.voucher.adjuntos[indice];
    if (!adjunto) return;
    this.liberar();
    this.indice.set(indice);
    this.error.set(null);
    this.cargando.set(true);
    this.pedido = this.bcp.obtenerArchivoComprobante(adjunto.uuid, this.contexto).subscribe({
      next: archivo => {
        this.objeto = URL.createObjectURL(archivo);
        this.url.set(this.saneador.bypassSecurityTrustUrl(this.objeto));
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err?.status === 404 ? 'El voucher no está disponible.' : 'No se pudo cargar el voucher.');
        this.cargando.set(false);
      }
    });
  }

  private liberar(): void {
    this.pedido?.unsubscribe();
    if (this.objeto) URL.revokeObjectURL(this.objeto);
    this.objeto = null;
    this.url.set(null);
  }
}
