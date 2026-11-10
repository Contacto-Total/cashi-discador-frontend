import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

/** Tono del indicador que filtra: el borde, el fondo y la cifra al pasar el cursor o al elegirlo. */
export type TonoIndicador = 'ok' | 'am' | 'ro' | 'info' | 'neu';

const TONOS: Record<TonoIndicador, { t: string; bg: string }> = {
  ok: { t: 'var(--ok)', bg: 'var(--ok-bg)' },
  am: { t: 'var(--am)', bg: 'var(--am-bg)' },
  ro: { t: 'var(--ro)', bg: 'var(--ro-bg)' },
  info: { t: 'var(--info)', bg: 'var(--info-bg)' },
  neu: { t: 'var(--ink2)', bg: 'var(--muted)' }
};

/**
 * Indicador: cifra, su rótulo y una línea de detalle debajo. Si filtra, es un botón; la cifra va en
 * negro y solo toma el color de su tono al pasar el cursor o al quedar elegido. El detalle se pasa como
 * texto o, si lleva una pieza (una píldora), proyectado.
 */
@Component({
  selector: 'app-indicador',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-w-0' },
  template: `
    <ng-template #cuerpo>
      <span class="block text-[1.5rem] leading-[1.15] font-bold [font-variant-numeric:proportional-nums_lining-nums]"
            [class]="filtra ? 'text-foreground group-hover:text-(--t) group-aria-pressed:text-(--t)' : 'text-foreground'">{{ valor }}@if (unidad) {<small class="ml-[.3125rem] text-[.75rem] leading-[1.15] font-medium text-muted-foreground">{{ unidad }}</small>}</span>
      <span class="block text-[.75rem] leading-[1.5]" [class]="filtra ? 'text-muted-foreground group-aria-pressed:text-foreground' : 'text-muted-foreground'">{{ rotulo }}</span>
      @if (conDetalle) {
        <div class="flex min-h-[2.5rem] min-w-0 flex-1 flex-col justify-center pt-[.625rem]">
          @if (detalle) {
            <span class="mt-[.375rem] block text-[.75rem] leading-[1.5] text-(--ink2)">{{ detalle }}</span>
          }
          <ng-content />
        </div>
      }
    </ng-template>

    @if (filtra) {
      <button type="button" [attr.aria-pressed]="activo" (click)="elegir.emit()"
              [style.--t]="tonos[tono].t" [style.--t-bg]="tonos[tono].bg"
              class="group flex w-full min-w-0 cursor-pointer flex-col gap-[2px] rounded-xl border border-border bg-card px-[.875rem] py-[.75rem] text-left [font-family:inherit] text-foreground shadow-[0_1px_2px_rgb(15_23_42/.04)] transition-[background-color,border-color] duration-150
                     hover:border-[color-mix(in_oklab,var(--t)_40%,var(--border))] hover:bg-[color-mix(in_oklab,var(--t)_6%,transparent)]
                     aria-pressed:border-(--t)! aria-pressed:bg-(--t-bg)! aria-pressed:shadow-[0_0_0_1px_var(--t)]">
        <ng-container *ngTemplateOutlet="cuerpo" />
      </button>
    } @else {
      <div class="flex w-full min-w-0 flex-col gap-[2px] rounded-xl border border-border bg-card px-[.875rem] py-[.75rem] shadow-[0_1px_2px_rgb(15_23_42/.04)]">
        <ng-container *ngTemplateOutlet="cuerpo" />
      </div>
    }
  `,
  imports: [NgTemplateOutlet]
})
export class IndicadorComponent {
  @Input({ required: true }) valor!: string | number;
  @Input() unidad = '';
  @Input({ required: true }) rotulo!: string;
  @Input() detalle = '';
  /** Sin línea de detalle: solo la cifra y su rótulo. */
  @Input() conDetalle = true;
  /** Si es un botón que filtra la lista. */
  @Input() filtra = false;
  @Input() activo = false;
  @Input() tono: TonoIndicador = 'neu';
  @Output() elegir = new EventEmitter<void>();

  protected readonly tonos = TONOS;
}
