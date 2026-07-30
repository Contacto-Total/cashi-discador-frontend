import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-whatsapp-pdf-preview-widget',
  standalone: true,
  template: `
    @if (open) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Vista previa del PDF">
        <section class="flex h-[min(92vh,900px)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <header class="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-900">{{ fileName }}</p>
              <p class="text-xs text-slate-500">Vista previa del documento</p>
            </div>
            <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" (click)="closed.emit()">Cerrar</button>
          </header>
          <div class="min-h-0 flex-1 overflow-auto bg-slate-100 p-3 sm:p-6">
            <div class="mx-auto h-full min-h-[520px] w-full max-w-4xl overflow-hidden bg-white shadow-lg" [style.transform]="'scale(' + zoom() + ')'" [style.transform-origin]="'top center'">
              <iframe class="h-full min-h-[520px] w-full border-0" [src]="pdfPageUrl()" [title]="fileName"></iframe>
            </div>
          </div>
          <footer class="flex items-center justify-center gap-2 border-t border-slate-200 px-4 py-3">
            <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40" [disabled]="zoom() <= 0.7" (click)="zoomOut()">Alejar</button>
            <span class="min-w-16 text-center text-xs font-semibold text-slate-500">{{ Math.round(zoom() * 100) }}%</span>
            <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40" [disabled]="zoom() >= 1.5" (click)="zoomIn()">Acercar</button>
            <button type="button" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700" (click)="nextPage()">Siguiente</button>
          </footer>
        </section>
      </div>
    }
  `
})
export class PdfPreviewWidgetComponent {
  @Input() open = false;
  @Input() fileUrl: string | null = null;
  @Input() fileName = 'Documento PDF';
  @Output() readonly closed = new EventEmitter<void>();
  readonly zoom = signal(1);
  readonly page = signal(1);
  protected readonly Math = Math;

  pdfPageUrl(): string | null { return this.fileUrl ? `${this.fileUrl}#page=${this.page()}` : null; }

  zoomOut(): void { this.zoom.update(value => Math.max(0.7, value - 0.1)); }
  zoomIn(): void { this.zoom.update(value => Math.min(1.5, value + 0.1)); }
  nextPage(): void { this.page.update(value => value + 1); }
}
