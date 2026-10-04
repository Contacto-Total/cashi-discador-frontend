import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Cabecera de pantalla: título y qué hace la vista. A la derecha va lo que la pantalla proyecte (una
 * insignia, una acción); si no cabe al lado del título, baja a la línea siguiente.
 *
 * No es una banda propia ni se queda fija: abre la primera tarjeta de la pantalla, con una raya debajo,
 * y al desplazar se va con ella.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'font-cashi mb-[clamp(.75rem,2vh,1.25rem)] block border-b border-border pb-[clamp(.75rem,2vh,1.25rem)] text-foreground antialiased' },
  template: `
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
      <div class="min-w-0">
        <p role="heading" aria-level="1" class="m-0 text-[24px] leading-[1.25] font-bold">{{ titulo }}</p>
        <p class="m-0 mt-[.125rem] overflow-hidden text-[14px] leading-[1.3] text-ellipsis whitespace-nowrap text-muted-foreground">{{ subtitulo }}</p>
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) titulo!: string;
  @Input() subtitulo = '';
}
