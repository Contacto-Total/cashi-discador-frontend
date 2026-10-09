import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModoReloj } from './reloj-estado';

/**
 * Escala del tiempo de un estado: tramo verde, ámbar y rojo, con una marca en el tiempo actual.
 * Los tres límites van en segundos. La pista no recorta: el redondeo va en los tramos de los extremos.
 * La marca va en el mismo color que su tramo y con sombra neutra: con un resplandor de su color, en el
 * tema oscuro se veía como un neón.
 */
@Component({
  selector: 'app-escala-tiempo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <p class="m-0 mb-[.625rem] text-[.75rem] font-medium text-muted-foreground">Escala de este estado</p>
    <div class="relative">
      <div class="flex h-2.5 gap-[2px] rounded-full bg-muted">
        <span class="h-full rounded-l-full bg-(--trazo-verde)" [style.width.%]="parte(verde)"></span>
        <span class="h-full bg-(--trazo-ambar)" [style.width.%]="parte(ambar - verde)"></span>
        <span class="h-full rounded-r-full bg-(--trazo-rojo)" [style.width.%]="parte(tope - ambar)"></span>
      </div>
      <span class="absolute top-1/2 size-[1.0625rem] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_1px_3px_rgb(0_0_0/.3)]"
            [class]="modo === 'fuera' ? 'opacity-0 transition-opacity duration-[140ms] ease-in' : modo === 'oculta' ? 'opacity-0 transition-none' : modo === 'quieta' ? 'transition-none' : '[transition:left_1s_linear,background-color_1s,opacity_.22s_ease-out]'"
            [style.left.%]="parte(segundos)" [style.background]="color"></span>
    </div>
    <div class="mt-[.5rem] flex justify-between text-[.75rem] text-muted-foreground tabular-nums">
      <span>Verde · {{ minutos(verde) }} min</span><span>Ámbar · {{ minutos(ambar) }} min</span><span>Rojo · {{ minutos(tope) }} min</span>
    </div>
  `
})
export class EscalaTiempoComponent {
  @Input({ required: true }) verde!: number;
  @Input({ required: true }) ambar!: number;
  @Input({ required: true }) tope!: number;
  @Input() segundos = 0;
  @Input() color = 'var(--trazo-verde)';
  @Input() modo: ModoReloj = 'quieta';

  parte(valor: number): number {
    return this.tope ? Math.min(Math.max(valor, 0) / this.tope * 100, 100) : 0;
  }

  minutos(segundos: number): string {
    const m = segundos / 60;
    return Number.isInteger(m) ? String(m) : m.toFixed(1).replace('.', ',');
  }
}
