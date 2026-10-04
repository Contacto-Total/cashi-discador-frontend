import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Tarjeta iluminada: un foco cenital del color `--tono` (lo fija quien la contiene; en el Panel
 * del asesor es el color del estado actual). `principal` sube la intensidad y el aire.
 */
@Directive({
  selector: '[appTarjetaLuz]',
  standalone: true
})
export class TarjetaLuzDirective {
  @Input() principal = false;

  private readonly BASE = 'relative flex flex-col overflow-hidden rounded-xl border border-border/70 transition-[box-shadow,border-color] duration-500 '
    + '[background:radial-gradient(125%_85%_at_50%_-18%,color-mix(in_oklab,var(--tono)_var(--luz),transparent)_0%,transparent_58%),var(--card)] '
    + 'shadow-[inset_0_1px_0_color-mix(in_oklab,var(--tono)_calc(var(--luz)*2),transparent),0_1px_2px_rgb(0_0_0/.05)]';

  @HostBinding('class')
  get clases(): string {
    return this.BASE + (this.principal
      ? ' [--luz:19%] px-8 py-[clamp(1rem,2.6vh,2rem)]'
      : ' [--luz:11%] px-5 py-[clamp(.875rem,2vh,1.25rem)]');
  }
}
