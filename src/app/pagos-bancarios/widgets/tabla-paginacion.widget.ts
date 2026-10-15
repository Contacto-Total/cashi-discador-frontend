import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TAMANO_PAGINA, acotarPagina, totalPaginas } from '../models/paginacion';

/**
 * Pie de tabla con el rango mostrado y los botones para moverse entre páginas.
 */
@Component({
  selector: 'app-tabla-paginacion',
  standalone: true,
  template: `
    <nav
      class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-700"
      [attr.aria-label]="'Paginación de ' + etiqueta"
    >
      <p class="text-xs text-slate-600 dark:text-slate-300" aria-live="polite">
        @if (total === 0) {
          Sin resultados
        } @else {
          Mostrando {{ desde() }}–{{ hasta() }} de {{ total }}
        }
      </p>
      @if (paginas() > 1) {
        <div class="flex items-center gap-1">
          <button type="button" [class]="boton" [disabled]="actual() <= 1" (click)="ir(1)" aria-label="Primera página">«</button>
          <button type="button" [class]="boton" [disabled]="actual() <= 1" (click)="ir(actual() - 1)">Anterior</button>
          <span class="px-2 text-xs font-semibold text-slate-700 dark:text-slate-200">Página {{ actual() }} de {{ paginas() }}</span>
          <button type="button" [class]="boton" [disabled]="actual() >= paginas()" (click)="ir(actual() + 1)">Siguiente</button>
          <button type="button" [class]="boton" [disabled]="actual() >= paginas()" (click)="ir(paginas())" aria-label="Última página">»</button>
        </div>
      }
    </nav>
  `
})
export class TablaPaginacionWidget {
  @Input() total = 0;
  @Input() pagina = 1;
  @Input() tamano = TAMANO_PAGINA;
  /** Nombre de la tabla, para el lector de pantalla. */
  @Input() etiqueta = 'la tabla';
  @Output() paginaChange = new EventEmitter<number>();

  readonly boton = 'rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:focus-visible:ring-offset-slate-800';

  paginas(): number {
    return totalPaginas(this.total, this.tamano);
  }

  actual(): number {
    return acotarPagina(this.pagina, this.total, this.tamano);
  }

  desde(): number {
    return (this.actual() - 1) * this.tamano + 1;
  }

  hasta(): number {
    return Math.min(this.actual() * this.tamano, this.total);
  }

  ir(pagina: number): void {
    this.paginaChange.emit(acotarPagina(pagina, this.total, this.tamano));
  }
}
