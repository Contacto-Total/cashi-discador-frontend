import { Component, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ESTILOS, descargarArchivo } from './asistencia.estilos';

/** Lo que se está viendo: el archivo ya traído, con su nombre y su tamaño. */
export interface ArchivoVisto {
  blob: Blob;
  url: string;
  nombre: string;
  /** «Imagen · 116 KB», «PDF · 240 KB». */
  detalle: string;
}

/**
 * El visor de un certificado dentro del sistema: la foto o el PDF en grande,
 * con su nombre, «Descargar» y la X. Abrirlo en otra pestaña del navegador
 * sacaba de la revisión y, sin el tipo del archivo, lo bajaba con un nombre al
 * azar. Se cierra con la X, con Esc o tocando fuera. Va por encima del menú
 * lateral de Cashi (z-index 1000-1100) y por debajo de los avisos (9999).
 */
@Component({
  selector: 'app-visor-archivo',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-[1500] flex flex-col bg-[rgba(2,6,23,0.82)]" role="dialog" aria-modal="true"
         aria-labelledby="nombre-visor" (click)="cerrar.emit()">
      <div class="flex items-center gap-2.5 px-4 py-3" (click)="$event.stopPropagation()">
        <div class="flex min-w-0 flex-1 flex-col">
          <strong id="nombre-visor" class="truncate text-[13.5px] !text-white" [title]="archivo().nombre">{{ archivo().nombre }}</strong>
          <span class="text-[11.5px] !text-[#cbd5e1]">{{ archivo().detalle }}</span>
        </div>
        <button type="button" [class]="estilos.botonChico" (click)="bajar()">
          <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
          Descargar
        </button>
        <button type="button" [class]="estilos.botonIcono" (click)="cerrar.emit()" aria-label="Cerrar"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
        @if (esPdf()) {
          <iframe [src]="urlSegura()" [title]="archivo().nombre" (click)="$event.stopPropagation()"
                  class="h-full w-[min(100%,900px)] rounded-lg border-0 bg-white"></iframe>
        } @else {
          <img [src]="archivo().url" [alt]="archivo().nombre" (click)="$event.stopPropagation()"
               class="max-h-full max-w-full rounded-lg bg-white object-contain shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        }
      </div>
    </div>
  `
})
export class VisorArchivoComponent {
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly estilos = ESTILOS;

  readonly archivo = input.required<ArchivoVisto>();
  readonly cerrar = output<void>();

  protected readonly esPdf = computed(() => this.archivo().blob.type === 'application/pdf');
  /** La URL es de un blob que armó el propio front con la respuesta del backend. */
  protected readonly urlSegura = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.archivo().url));

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.cerrar.emit();
  }

  bajar(): void {
    descargarArchivo(this.archivo().blob, this.archivo().nombre);
  }
}

/**
 * Lo que abre y cierra el visor desde una pantalla: trae el archivo (o usa el
 * que ya se trajo), arma su URL y la suelta al cerrar.
 */
export class Visor {
  readonly abierto = signal<ArchivoVisto | null>(null);
  readonly cargando = signal(false);

  /** Con el archivo ya en la mano (la vista previa de la ventana ya lo trajo). */
  mostrar(blob: Blob, nombre: string | null | undefined): void {
    this.cerrar();
    const peso = `${Math.max(1, Math.round(blob.size / 1024))} KB`;
    const clase = blob.type === 'application/pdf' ? 'PDF' : blob.type.startsWith('image/') ? 'Imagen' : 'Archivo';
    this.abierto.set({ blob, url: URL.createObjectURL(blob), nombre: nombre || 'certificado', detalle: `${clase} · ${peso}` });
  }

  /** Lo trae y lo enseña; si no llega, avisa. */
  abrir(archivo$: Observable<Blob>, nombre: string | null | undefined, alFallar: () => void): void {
    this.cargando.set(true);
    archivo$.subscribe({
      next: blob => {
        this.cargando.set(false);
        this.mostrar(blob, nombre);
      },
      error: () => {
        this.cargando.set(false);
        alFallar();
      }
    });
  }

  cerrar(): void {
    const actual = this.abierto();
    if (actual) {
      URL.revokeObjectURL(actual.url);
    }
    this.abierto.set(null);
  }
}
