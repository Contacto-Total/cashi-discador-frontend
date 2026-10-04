import { Directive } from '@angular/core';
import { CIERRE_TARJETA } from './caja-tarjetas.directive';

/**
 * Tarjeta: la superficie del menú, con su borde y su redondeo. El relleno por defecto se cambia con
 * utilidades `px-*` / `py-*` en el propio elemento.
 */
@Directive({
  selector: '[appTarjeta]',
  standalone: true,
  host: {
    'data-tarjeta': '',
    class: 'relative min-w-0 rounded-xl border border-border bg-card p-4 shadow-[0_1px_2px_rgb(15_23_42/.04)] ' + CIERRE_TARJETA
  }
})
export class TarjetaDirective {}
