import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/** Pie de una tabla paginada: el rango que se ve y, si hay más de una página, las flechas. */
@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  host: { class: 'mt-[.5rem] flex min-h-[2.75rem] flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-(--line2) pt-3 text-[.75rem] leading-[1.5] text-muted-foreground' },
  template: `
    <span>Mostrando {{ desde }}–{{ hasta }} de {{ total }}</span>
    @if (paginas > 1) {
      <div class="flex items-center gap-2">
        <span class="mr-1">Página {{ pagina }} de {{ paginas }}</span>
        <button type="button" [class]="FLECHA" [disabled]="pagina <= 1" (click)="ir.emit(pagina - 1)" aria-label="Página anterior">
          <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
        </button>
        <button type="button" [class]="FLECHA" [disabled]="pagina >= paginas" (click)="ir.emit(pagina + 1)" aria-label="Página siguiente">
          <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
        </button>
      </div>
    }
  `
})
export class PiePaginaComponent {
  @Input({ required: true }) total = 0;
  @Input({ required: true }) pagina = 1;
  @Input({ required: true }) porPagina = 8;
  @Output() ir = new EventEmitter<number>();

  get paginas(): number { return Math.max(1, Math.ceil(this.total / this.porPagina)); }
  get desde(): number { return this.total ? (this.pagina - 1) * this.porPagina + 1 : 0; }
  get hasta(): number { return Math.min(this.pagina * this.porPagina, this.total); }

  /** Botón de icono secundario; deshabilitado queda gris, sin borde ni sombra. */
  protected readonly FLECHA = 'relative grid size-8 cursor-pointer place-items-center overflow-hidden rounded-[.375rem] border! border-border! bg-card p-0! text-foreground '
    + 'shadow-[0_1px_2px_rgb(0_0_0/.05)] transition-colors duration-150 hover:bg-muted '
    + 'disabled:cursor-not-allowed disabled:border-transparent! disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none';
}
