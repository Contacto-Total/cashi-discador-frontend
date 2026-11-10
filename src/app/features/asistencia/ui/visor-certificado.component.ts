import { ChangeDetectionStrategy, Component, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import { descargarArchivo } from '../asistencia.estilos';
import { ArchivoVisto } from '../visor-archivo.component';
import { MINI_ICONO } from './ficha-clases';

/**
 * El certificado de una solicitud en la columna lateral, junto a la lista que se revisa: la foto o el PDF
 * con su nombre, ampliar, descargar y cerrar. Ampliado ocupa la pantalla; se reduce con su botón o con Esc.
 */
@Component({
  selector: 'app-visor-certificado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective],
  template: `
    <section appTarjeta class="flex min-h-0 flex-1 flex-col gap-[.75rem] px-5! py-[1.125rem]!" aria-label="Certificado">
      <div class="flex items-center gap-[.375rem]">
        <p class="m-0 mr-auto text-[.9375rem] leading-[1.5] font-bold text-foreground">Certificado</p>
        <button type="button" [class]="MINI_ICONO" (click)="ampliado.set(true)" [disabled]="!archivo()" aria-label="Ampliar certificado" title="Ampliar">
          <lucide-angular name="maximize-2" [size]="16" class="flex"></lucide-angular>
        </button>
        <button type="button" [class]="MINI_ICONO" (click)="bajar()" [disabled]="!archivo()" aria-label="Descargar certificado" title="Descargar">
          <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>
        </button>
        <button type="button" [class]="MINI_ICONO" (click)="cerrar.emit()" aria-label="Cerrar certificado" title="Cerrar">
          <lucide-angular name="x" [size]="16" class="flex"></lucide-angular>
        </button>
      </div>
      <div class="grid min-h-0 flex-[1_1_auto] place-items-center overflow-hidden rounded-[.75rem] bg-muted p-4">
        <ng-container *ngTemplateOutlet="vista" />
      </div>
      <p class="m-0 text-center text-[.75rem] leading-[1.5] [overflow-wrap:anywhere] text-muted-foreground">{{ nombre() }}</p>
    </section>

    @if (ampliado() && archivo()) {
      <section class="fixed inset-0 z-[1500] flex flex-col items-center justify-center gap-[.75rem] bg-background p-6" role="dialog" aria-label="Certificado ampliado">
        <div class="flex w-[min(100%,calc((100vh-6.5rem)*210/270))] items-center gap-[.375rem]">
          <span class="mr-auto truncate text-[.875rem] font-medium text-foreground">{{ nombre() }}</span>
          <button type="button" [class]="MINI_ICONO" (click)="bajar()" aria-label="Descargar certificado" title="Descargar">
            <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>
          </button>
          <button type="button" [class]="MINI_ICONO" (click)="ampliado.set(false)" aria-label="Reducir certificado" title="Reducir">
            <lucide-angular name="minimize-2" [size]="16" class="flex"></lucide-angular>
          </button>
        </div>
        <div class="grid aspect-[210/270] h-[calc(100vh-6.5rem)] max-w-full place-items-center overflow-hidden rounded-[.75rem] bg-muted p-4">
          <ng-container *ngTemplateOutlet="vista" />
        </div>
      </section>
    }

    <ng-template #vista>
      @if (cargando()) {
        <span class="text-[.875rem] text-muted-foreground">Cargando…</span>
      } @else if (archivo(); as a) {
        @if (esPdf()) {
          <iframe [src]="urlSegura()" [title]="a.nombre" class="h-full w-full rounded-[.5rem] border-0 bg-white"></iframe>
        } @else {
          <img [src]="a.url" [alt]="a.nombre" class="max-h-full max-w-full rounded-[.5rem] bg-white object-contain">
        }
      } @else {
        <span class="text-[.875rem] text-muted-foreground">No se pudo abrir el archivo</span>
      }
    </ng-template>
  `
})
export class VisorCertificadoComponent {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly MINI_ICONO = MINI_ICONO;

  readonly archivo = input<ArchivoVisto | null>(null);
  readonly cargando = input(false);
  /** El nombre del archivo, aunque todavía no haya llegado. */
  readonly nombre = input<string>('');
  readonly cerrar = output<void>();

  readonly ampliado = signal(false);
  protected readonly esPdf = computed(() => this.archivo()?.blob.type === 'application/pdf');
  /** La URL es de un blob que armó el propio front con la respuesta del backend. */
  protected readonly urlSegura = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.archivo()?.url ?? ''));

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.ampliado.set(false);
  }

  bajar(): void {
    const a = this.archivo();
    if (a) {
      descargarArchivo(a.blob, a.nombre);
    }
  }
}
