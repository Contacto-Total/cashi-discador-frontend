import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface OpcionSegmentado {
  clave: string;
  texto: string;
  /** Cuántos hay; se muestra en gris al lado del texto. */
  n?: number | null;
  /** Opción que todavía no está; lleva la píldora «Pronto». */
  pronto?: boolean;
}

/**
 * Segmentado de la pantalla: las opciones en una cápsula gris y la elegida en blanco. Si la tarjeta se
 * angosta, las opciones se compactan para seguir en una línea y la píldora «Pronto» se oculta.
 */
@Component({
  selector: 'app-segmentado',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid flex-none grid-flow-col gap-[.1875rem] rounded-[.5rem] bg-muted p-[.1875rem]', role: 'group' },
  template: `
    @for (o of opciones; track o.clave) {
      <button type="button" [attr.aria-pressed]="o.clave === valor" [disabled]="o.pronto" (click)="cambiar.emit(o.clave)"
              class="inline-flex cursor-pointer items-center gap-2 rounded-[.375rem] border-0! bg-transparent px-[.875rem] py-[.4375rem] [font-family:inherit] text-[.875rem] leading-[1.5] font-medium whitespace-nowrap text-[color-mix(in_srgb,var(--foreground)_62%,transparent)]
                     aria-pressed:bg-(--seg-activo)! aria-pressed:text-foreground aria-pressed:shadow-[0_1px_2px_rgb(0_0_0/.08)]
                     disabled:cursor-default disabled:text-muted-foreground
                     @max-[50.001rem]/tarjeta:px-[.5625rem] @max-[50.001rem]/tarjeta:py-[.375rem] @max-[50.001rem]/tarjeta:text-[.8125rem]">
        {{ o.texto }}
        @if (o.n != null) { <span class="ml-[.375rem] font-medium text-muted-foreground">{{ o.n }}</span> }
        @if (o.pronto) {
          <span class="ml-[.375rem] inline-flex items-center gap-[.375rem] rounded-full border border-border px-2 py-[.0625rem] text-[.75rem] font-semibold text-muted-foreground before:size-[.4375rem] before:rounded-full before:bg-current before:content-[''] @max-[50.001rem]/tarjeta:hidden">Pronto</span>
        }
      </button>
    }
  `
})
export class SegmentadoComponent {
  @Input({ required: true }) opciones: OpcionSegmentado[] = [];
  @Input({ required: true }) valor = '';
  @Output() cambiar = new EventEmitter<string>();
}
