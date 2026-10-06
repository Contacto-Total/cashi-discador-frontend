import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Botón para elegir un estado: icono en baldosa, nombre y qué pasa en ese estado. `tono` pinta
 * el borde, el fondo y la baldosa; `tinta` es el mismo color en su versión legible para el icono.
 */
@Component({
  selector: 'app-boton-estado',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <button type="button" [disabled]="bloqueado || actual" (click)="elegir.emit()" [style.--tono]="tono" [style.--tinta]="tinta || tono"
            class="font-cashi relative flex min-h-[4.25rem] min-w-0 items-center gap-2.5 overflow-hidden rounded-xl border! bg-transparent px-[.75rem] py-[.5rem] text-left text-foreground transition-[border-color,background-color,box-shadow,opacity] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed"
            [class]="actual
              ? 'border-[color:var(--tono)]! bg-[color-mix(in_oklab,var(--tono)_8%,transparent)] shadow-[0_1px_2px_rgb(0_0_0/.05)]'
              : bloqueado
                ? 'border-border! opacity-40'
                : 'cursor-pointer border-border! hover:border-[color-mix(in_oklab,var(--tono)_60%,transparent)]! hover:bg-[color-mix(in_oklab,var(--tono)_6%,transparent)]'">
      <span class="grid size-8 flex-none place-items-center rounded-lg bg-[color-mix(in_oklab,var(--tono)_12%,transparent)] text-[color:var(--tinta)]">
        <lucide-angular [name]="icono" [size]="17.6"></lucide-angular>
      </span>
      <span class="min-w-0 flex-1">
        <span class="block overflow-hidden text-[.875rem] font-semibold text-ellipsis whitespace-nowrap">{{ nombre }}</span>
        <span class="mt-[.125rem] block text-[.75rem] leading-[1.3] text-muted-foreground">{{ detalle }}</span>
      </span>
      @if (actual) {
        <span class="size-2 flex-none rounded-full bg-(--tono)"></span>
      }
    </button>
  `
})
export class BotonEstadoComponent {
  @Input({ required: true }) nombre!: string;
  @Input() detalle = '';
  @Input({ required: true }) icono!: string;
  @Input({ required: true }) tono!: string;
  @Input() tinta = '';
  /** Es el estado en el que ya está el asesor. */
  @Input() actual = false;
  /** No se puede elegir ahora (lo controla el sistema o hay un cambio en curso). */
  @Input() bloqueado = false;
  @Output() elegir = new EventEmitter<void>();
}
