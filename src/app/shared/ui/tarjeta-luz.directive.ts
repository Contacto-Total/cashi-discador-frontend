import { Directive, HostBinding, Input } from '@angular/core';
import { CIERRE_TARJETA } from './caja-tarjetas.directive';

/**
 * Tarjeta iluminada: un foco cenital del color `--tono-luz` (lo fija quien la contiene con la clase
 * `cashi-luz-estado`; en el Panel del asesor es el color del estado actual). `principal` sube la
 * intensidad y el aire.
 *
 * No recorta su contenido: los botones deshabilitados de dentro usan `opacity`, y dentro de una caja
 * recortada hay navegadores que dejan de dibujarlos.
 */
@Directive({
  selector: '[appTarjetaLuz]',
  standalone: true,
  host: { 'data-tarjeta': '' }
})
export class TarjetaLuzDirective {
  @Input() principal = false;

  private readonly BASE = 'relative flex flex-col rounded-xl border border-border shadow-[0_1px_2px_rgb(0_0_0/.05)] '
    + '[background:radial-gradient(125%_85%_at_50%_-18%,color-mix(in_oklab,var(--tono-luz)_var(--luz),transparent)_0%,transparent_var(--luz-fin)),var(--card)] '
    + CIERRE_TARJETA;

  @HostBinding('class')
  get clases(): string {
    return this.BASE + (this.principal
      ? ' [--luz:19%] px-8 py-[clamp(1rem,2.6vh,2rem)]'
      : ' [--luz:11%] px-5 py-[clamp(.875rem,2vh,1.25rem)]');
  }
}
