import { Directive, ElementRef, HostListener, Input, OnDestroy, inject } from '@angular/core';

/**
 * Nombre flotante de un control al pasar el cursor o al enfocarlo. Sale a la derecha
 * (iconos del menú plegado) o arriba (botones de icono). No usa `title`: el del navegador
 * tarda en salir y no sigue el tema.
 */
@Directive({
  selector: '[appTip]',
  standalone: true
})
export class TipDirective implements OnDestroy {
  @Input('appTip') texto: string | null = '';
  @Input() appTipLado: 'derecha' | 'arriba' = 'derecha';
  /** Con `false` no se muestra: permite tenerlo solo con el menú plegado. */
  @Input() appTipActivo = true;

  private readonly anfitrion = inject<ElementRef<HTMLElement>>(ElementRef);
  private caja: HTMLElement | null = null;

  @HostListener('mouseenter')
  @HostListener('focusin')
  mostrar(): void {
    if (!this.appTipActivo || !this.texto) {
      return;
    }
    const r = this.anfitrion.nativeElement.getBoundingClientRect();
    const arriba = this.appTipLado === 'arriba';
    const caja = this.caja ?? document.createElement('div');
    caja.setAttribute('role', 'tooltip');
    caja.className = 'font-cashi pointer-events-none fixed z-[1200] rounded-md bg-tooltip px-2.5 py-[7px] text-[12px] font-medium leading-none whitespace-nowrap text-tooltip-foreground antialiased '
      + (arriba ? '-translate-x-1/2 -translate-y-full' : '-translate-y-1/2');
    caja.textContent = this.texto;
    caja.style.left = arriba ? `${r.left + r.width / 2}px` : `${r.right + 10}px`;
    caja.style.top = arriba ? `${r.top - 8}px` : `${r.top + r.height / 2}px`;
    if (!this.caja) {
      document.body.appendChild(caja);
      this.caja = caja;
    }
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  @HostListener('click')
  ocultar(): void {
    this.caja?.remove();
    this.caja = null;
  }

  ngOnDestroy(): void {
    this.ocultar();
  }
}
