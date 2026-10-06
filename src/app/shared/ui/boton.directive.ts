import { Directive, HostBinding, Input } from '@angular/core';

/**
 * Botón del sistema. `primario` es el verde de marca con el brillo que cruza al pasar el cursor;
 * `secundario`, el de borde sobre la tarjeta.
 */
@Directive({
  selector: 'button[appBoton], a[appBoton]',
  standalone: true
})
export class BotonDirective {
  @Input('appBoton') variante: 'primario' | 'secundario' | '' = 'primario';
  @Input() appBotonAlto: 'normal' | 'grande' = 'normal';

  private readonly BASE = 'font-cashi relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-md border-0 px-3 text-[14px] font-semibold whitespace-nowrap bg-no-repeat '
    + '[background-size:200%_100%,100%_100%] [background-position:130%_0,0_0] hover:[background-position:-30%_0,0_0] '
    + 'transition-[background-position,scale,box-shadow,background-color,border-color,color] duration-700 ease-out active:scale-[.97] active:duration-[120ms] '
    + 'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgb(16_185_129/.5)] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none';
  private readonly PRIMARIO = 'text-white! [background-image:linear-gradient(110deg,transparent_38%,rgb(255_255_255/.34)_50%,transparent_62%),linear-gradient(135deg,#06825E_0%,#047857_100%)] '
    + 'hover:[background-image:linear-gradient(110deg,transparent_38%,rgb(255_255_255/.34)_50%,transparent_62%),linear-gradient(135deg,#078763_0%,#06825E_100%)] '
    + 'active:[background-image:linear-gradient(110deg,transparent_38%,rgb(255_255_255/.34)_50%,transparent_62%),linear-gradient(135deg,#047857_0%,#065F46_100%)] '
    + 'shadow-[0_1px_2px_rgb(6_78_59/.2)] hover:shadow-[0_1px_2px_rgb(6_78_59/.2),0_8px_18px_-10px_rgb(6_78_59/.45)]';
  private readonly SECUNDARIO = 'border! border-border! bg-card text-foreground! shadow-[0_1px_2px_rgb(0_0_0/.05)] hover:bg-muted';

  @HostBinding('class')
  get clases(): string {
    return `${this.BASE} ${this.appBotonAlto === 'grande' ? 'h-10' : 'h-9'} ${this.variante === 'secundario' ? this.SECUNDARIO : this.PRIMARIO}`;
  }
}
