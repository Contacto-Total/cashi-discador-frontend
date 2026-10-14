import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Campo para filtrar una tabla por número de documento.
 */
@Component({
  selector: 'app-buscador-documento',
  standalone: true,
  template: `
    <div class="relative">
      <label [for]="inputId" class="sr-only">Buscar por documento</label>
      <input
        [id]="inputId"
        type="search"
        inputmode="numeric"
        autocomplete="off"
        placeholder="Buscar documento"
        [value]="valor"
        (input)="valorChange.emit($any($event.target).value)"
        class="w-48 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400"
      />
    </div>
  `
})
export class BuscadorDocumentoWidget {
  @Input({ required: true }) inputId = '';
  @Input() valor = '';
  @Output() valorChange = new EventEmitter<string>();
}
