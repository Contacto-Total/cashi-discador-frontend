import { Component, computed, input, output } from '@angular/core';
import { ESTILOS } from './asistencia.estilos';

/**
 * El pie de una tabla que crece: «1–10 de 23» y las flechas. Solo aparece con
 * más de una página. Es el mismo de la Auditoría, para que todas las tablas del
 * módulo se lean igual.
 *
 * La página la guarda quien lo usa (una signal), y también es quien corta la
 * lista con `desde()`/`porPagina()`: así puede volver a la primera al cambiar
 * un filtro.
 */
@Component({
  selector: 'app-paginador',
  standalone: true,
  template: `
    @if (paginas() > 1) {
      <div class="flex items-center justify-between gap-3 border-t border-[#f1f3f6] px-3 py-2.5 dark:border-slate-800">
        <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ primera() }}–{{ ultima() }} de {{ total() }}</span>
        <div class="flex gap-1.5">
          <button type="button" [class]="estilos.botonIcono" (click)="cambiar.emit(actual() - 1)"
                  [disabled]="actual() === 1" aria-label="Página anterior">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button type="button" [class]="estilos.botonIcono" (click)="cambiar.emit(actual() + 1)"
                  [disabled]="actual() === paginas()" aria-label="Página siguiente">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    }
  `
})
export class PaginadorComponent {
  protected readonly estilos = ESTILOS;

  readonly total = input.required<number>();
  readonly pagina = input.required<number>();
  readonly porPagina = input(10);
  readonly cambiar = output<number>();

  protected readonly paginas = computed(() => Math.max(1, Math.ceil(this.total() / this.porPagina())));
  /** Si la lista se achicó (un filtro), la página no puede quedar más allá de la última. */
  protected readonly actual = computed(() => Math.min(Math.max(1, this.pagina()), this.paginas()));
  protected readonly primera = computed(() => (this.actual() - 1) * this.porPagina() + 1);
  protected readonly ultima = computed(() => Math.min(this.total(), this.actual() * this.porPagina()));
}

/** Las filas de una página: la misma cuenta que hace el paginador. */
export function pagina<T>(lista: T[], numero: number, porPagina: number): T[] {
  const paginas = Math.max(1, Math.ceil(lista.length / porPagina));
  const actual = Math.min(Math.max(1, numero), paginas);
  return lista.slice((actual - 1) * porPagina, actual * porPagina);
}
