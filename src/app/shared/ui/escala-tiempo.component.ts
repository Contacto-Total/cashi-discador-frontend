import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ModoReloj } from './reloj-estado';

/**
 * Escala del tiempo de un estado: tramo verde, ámbar y rojo, con una marca en el tiempo actual.
 * Los tres límites van en segundos.
 */
@Component({
  selector: 'app-escala-tiempo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <p class="m-0 mb-[.625rem] text-[12px] font-medium text-muted-foreground">Escala de este estado</p>
    <div class="relative">
      <div class="flex h-2.5 gap-[2px] overflow-hidden rounded-full bg-muted">
        <span class="h-full bg-nivel-verde/85" [style.width.%]="parte(verde)"></span>
        <span class="h-full bg-nivel-ambar/85" [style.width.%]="parte(ambar - verde)"></span>
        <span class="h-full bg-nivel-rojo/85" [style.width.%]="parte(tope - ambar)"></span>
      </div>
      <span class="absolute top-1/2 size-[1.0625rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            [class]="modo === 'fuera' ? 'opacity-0 transition-opacity duration-[140ms] ease-in' : modo === 'oculta' ? 'opacity-0 transition-none' : modo === 'quieta' ? 'transition-none' : '[transition:left_1s_linear,background-color_1s,box-shadow_1s,opacity_.22s_ease-out]'"
            [style.left.%]="parte(segundos)" [style.background]="color"
            [style.box-shadow]="'0 2px 8px -1px color-mix(in oklab,' + color + ' 55%,transparent)'"></span>
    </div>
    <div class="mt-[.5rem] flex justify-between text-[12px] text-muted-foreground tabular-nums">
      <span>Verde · {{ minutos(verde) }} min</span><span>Ámbar · {{ minutos(ambar) }} min</span><span>Rojo · {{ minutos(tope) }} min</span>
    </div>
  `
})
export class EscalaTiempoComponent {
  @Input({ required: true }) verde!: number;
  @Input({ required: true }) ambar!: number;
  @Input({ required: true }) tope!: number;
  @Input() segundos = 0;
  @Input() color = 'var(--nivel-verde)';
  @Input() modo: ModoReloj = 'quieta';

  parte(valor: number): number {
    return this.tope ? Math.min(Math.max(valor, 0) / this.tope * 100, 100) : 0;
  }

  minutos(segundos: number): string {
    const m = segundos / 60;
    return Number.isInteger(m) ? String(m) : m.toFixed(1).replace('.', ',');
  }
}
