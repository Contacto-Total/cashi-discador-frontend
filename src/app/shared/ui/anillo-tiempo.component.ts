import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModoReloj, reloj } from './reloj-estado';

const RADIO = 66;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

/**
 * Anillo con el tiempo transcurrido. El arco avanza hasta `tope`; sin tope no hay arco.
 * `segundosArco` y `colorArco` son lo que se dibuja; pueden ir un paso por detrás de `segundos`
 * mientras el arco se apaga al cambiar de estado. El tamaño lo da `--anillo`.
 */
@Component({
  selector: 'app-anillo-tiempo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'relative grid size-(--anillo) place-items-center' },
  template: `
    <svg viewBox="0 0 160 160" class="size-(--anillo) -rotate-90" aria-hidden="true">
      <circle cx="80" cy="80" r="66" fill="none" stroke-width="10" opacity=".15" class="transition-[stroke] duration-500" [attr.stroke]="color"></circle>
      <circle cx="80" cy="80" r="66" fill="none" stroke-width="10" stroke-linecap="round"
              [class]="modo === 'fuera' ? 'opacity-0! transition-opacity duration-[140ms] ease-in' : modo === 'oculta' ? 'opacity-0! transition-none' : modo === 'quieta' ? 'transition-none' : '[transition:stroke-dashoffset_.7s_ease-out,stroke_.5s,opacity_.22s_ease-out]'"
              [attr.stroke]="colorArco" [attr.stroke-dasharray]="circunferencia" [attr.stroke-dashoffset]="desfase" [style.opacity]="tope ? 1 : 0"></circle>
    </svg>
    <div class="absolute grid place-items-center text-center">
      <span class="text-[clamp(1.625rem,3.8vh,2.25rem)] leading-none font-bold tabular-nums transition-colors duration-500" [style.color]="tinta">{{ hora }}</span>
      <span class="mt-[.25rem] text-[.75rem] text-muted-foreground tabular-nums">{{ tope ? 'de ' + horaTope : 'sin límite' }}</span>
    </div>
  `
})
export class AnilloTiempoComponent {
  @Input() segundos = 0;
  @Input() tope: number | null = null;
  /** Color del fondo del anillo y, por defecto, del arco. */
  @Input() color = 'var(--muted-foreground)';
  @Input() tinta = 'var(--muted-foreground)';
  @Input() segundosArco = 0;
  @Input() colorArco = 'var(--muted-foreground)';
  @Input() modo: ModoReloj = 'quieta';

  readonly circunferencia = CIRCUNFERENCIA;

  get hora(): string {
    return reloj(this.segundos);
  }

  get horaTope(): string {
    return reloj(this.tope ?? 0);
  }

  /** El arco nunca baja de 10 unidades una vez empezado: con menos, el extremo redondeado no se ve. */
  get desfase(): number {
    const parte = this.tope ? Math.min(this.segundosArco / this.tope, 1) : 0;
    return CIRCUNFERENCIA * (1 - (parte > 0 ? Math.max(parte, 10 / CIRCUNFERENCIA) : 0));
  }
}
