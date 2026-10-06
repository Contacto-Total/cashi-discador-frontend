import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Cabecera de pantalla: icono en baldosa, título y qué hace la vista. A la derecha va lo que la
 * pantalla proyecte (una insignia, una acción). Mide lo mismo que la marca del menú lateral, así
 * que su raya inferior empalma con la de la marca.
 */
@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // `contents`: la banda pegajosa tiene que ser hija directa de la pantalla para quedarse arriba.
  host: { class: 'contents' },
  template: `
    <div class="font-cashi sticky top-0 z-[5] bg-card/50 text-foreground antialiased backdrop-blur-xl">
      <div class="flex h-20 items-center justify-between gap-6 border-b border-border px-8 max-md:pr-4 max-md:pl-16">
        <div class="flex min-w-0 items-center gap-3.5">
          <span class="grid size-11 flex-none place-items-center rounded-xl bg-brand/12 text-brand">
            <lucide-angular [name]="icono" [size]="20" [strokeWidth]="2.2"></lucide-angular>
          </span>
          <div class="min-w-0">
            <p role="heading" aria-level="1" class="m-0 overflow-hidden text-[24px] leading-[1.25] font-bold text-ellipsis whitespace-nowrap">{{ titulo }}</p>
            <p class="m-0 mt-[.125rem] overflow-hidden text-[14px] leading-[1.3] text-ellipsis whitespace-nowrap text-muted-foreground">{{ subtitulo }}</p>
          </div>
        </div>
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) icono!: string;
  @Input({ required: true }) titulo!: string;
  @Input() subtitulo = '';
}
