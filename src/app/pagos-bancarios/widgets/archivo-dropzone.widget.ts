import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Zona para elegir un archivo con clic, teclado o arrastrándolo.
 * El input sigue siendo el control real, por lo que funciona con teclado y lectores de pantalla.
 */
@Component({
  selector: 'app-archivo-dropzone',
  standalone: true,
  imports: [CommonModule],
  // relative: contiene el aviso sr-only para que no se salga del scroll de la página
  host: { class: 'relative block' },
  template: `
    <label
      [attr.for]="inputId"
      class="relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 text-center transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800"
      [class]="zonaClass()"
      (dragenter)="onDragEnter($event)"
      (dragover)="onDragOver($event)"
      (dragleave)="onDragLeave($event)"
      (drop)="onDrop($event)"
    >
      <input
        [id]="inputId"
        type="file"
        class="sr-only"
        [accept]="accept"
        [disabled]="disabled"
        [attr.aria-describedby]="inputId + '-ayuda'"
        (change)="onInputChange($event)"
      />

      <svg class="mb-2 h-8 w-8" [class]="iconoClass()" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
      </svg>

      @if (arrastrando) {
        <p class="text-sm font-semibold" [class]="textoActivoClass()">Suelta el archivo aquí</p>
      } @else if (file) {
        <p class="max-w-full truncate text-sm font-medium" [class]="textoActivoClass()">{{ file.name }}</p>
        <p class="text-xs text-slate-600 dark:text-slate-400">{{ formatSize(file.size) }} · Clic o arrastra otro archivo para reemplazarlo</p>
      } @else {
        <p class="text-sm text-slate-700 dark:text-slate-300">
          <span class="font-semibold">Clic para seleccionar</span> o arrastra el archivo aquí
        </p>
      }
      <p [id]="inputId + '-ayuda'" class="mt-1 text-xs text-slate-600 dark:text-slate-400">{{ descripcion }}</p>
    </label>

    <p class="sr-only" role="status" aria-live="polite">{{ anuncio }}</p>
  `
})
export class ArchivoDropzoneWidget {
  @Input({ required: true }) inputId!: string;
  /** Extensiones aceptadas, con punto y en minúsculas. Ej: ['.txt'] */
  @Input({ required: true }) extensiones: string[] = [];
  @Input() descripcion = '';
  @Input() file: File | null = null;
  @Input() tono: 'blue' | 'purple' = 'blue';
  @Input() disabled = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() rejected = new EventEmitter<string>();

  arrastrando = false;
  anuncio = '';
  // dragenter/dragleave se disparan también al pasar sobre los hijos de la zona.
  private profundidadArrastre = 0;

  get accept(): string {
    return this.extensiones.join(',');
  }

  onDragEnter(event: DragEvent): void {
    if (!this.traeArchivos(event)) return;
    event.preventDefault();
    this.profundidadArrastre++;
    this.arrastrando = !this.disabled;
  }

  onDragOver(event: DragEvent): void {
    if (!this.traeArchivos(event)) return;
    // Sin esto el navegador no dispara "drop" y abre el archivo en la pestaña.
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = this.disabled ? 'none' : 'copy';
    }
  }

  onDragLeave(event: DragEvent): void {
    if (!this.traeArchivos(event)) return;
    this.profundidadArrastre = Math.max(0, this.profundidadArrastre - 1);
    if (this.profundidadArrastre === 0) {
      this.arrastrando = false;
    }
  }

  onDrop(event: DragEvent): void {
    if (!this.traeArchivos(event)) return;
    event.preventDefault();
    this.profundidadArrastre = 0;
    this.arrastrando = false;
    if (this.disabled) return;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;
    if (files.length > 1) {
      this.rechazar('Suelta un solo archivo a la vez.');
      return;
    }
    this.procesar(files[0]);
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;
    if (file) {
      this.procesar(file);
    }
    // Permite volver a elegir el mismo archivo después de corregirlo.
    input.value = '';
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  zonaClass(): string {
    if (this.disabled) {
      return 'cursor-not-allowed border-slate-300 bg-slate-100 opacity-60 dark:border-slate-600 dark:bg-slate-800';
    }
    if (this.tono === 'purple') {
      return this.arrastrando
        ? 'border-purple-500 bg-purple-100 focus-within:ring-purple-500 dark:border-purple-400 dark:bg-purple-900/40'
        : 'border-purple-300 bg-purple-50 hover:border-purple-400 hover:bg-purple-100 focus-within:ring-purple-500 dark:border-purple-600 dark:bg-purple-900/20 dark:hover:border-purple-500 dark:hover:bg-purple-900/30';
    }
    return this.arrastrando
      ? 'border-blue-500 bg-blue-100 focus-within:ring-blue-500 dark:border-blue-400 dark:bg-blue-900/40'
      : 'border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-slate-100 focus-within:ring-blue-500 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-blue-500 dark:hover:bg-slate-700';
  }

  iconoClass(): string {
    return this.tono === 'purple' ? 'text-purple-400' : 'text-slate-400';
  }

  textoActivoClass(): string {
    return this.tono === 'purple' ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300';
  }

  private procesar(file: File): void {
    const nombre = file.name.toLowerCase();
    if (!this.extensiones.some(ext => nombre.endsWith(ext))) {
      this.rechazar(`El archivo debe ser ${this.extensiones.join(' o ')}.`);
      return;
    }
    this.anuncio = `Archivo seleccionado: ${file.name}`;
    this.fileSelected.emit(file);
  }

  private rechazar(mensaje: string): void {
    this.anuncio = mensaje;
    this.rejected.emit(mensaje);
  }

  private traeArchivos(event: DragEvent): boolean {
    return Array.from(event.dataTransfer?.types || []).includes('Files');
  }
}
