import { AfterViewInit, Directive, ElementRef, NgZone, OnDestroy, inject } from '@angular/core';

/**
 * Cierre de una tarjeta cortada: una franja con el borde y las esquinas de la tarjeta, colocada donde
 * la corta la caja con desplazamiento, y por fuera el color del lienzo para tapar las esquinas rectas
 * que quedan detrás. Solo se ve cuando `appCajaTarjetas` marca la tarjeta como cortada.
 *
 * La usan las directivas de tarjeta, que además deben ser `relative` y llevar `data-tarjeta`.
 */
export const CIERRE_TARJETA =
  "after:pointer-events-none after:absolute after:-inset-x-px after:bottom-[calc(var(--corte-abajo,0px)_-_1px)] after:z-[3] after:hidden "
  + "after:h-[min(1rem,calc(100%_-_var(--corte-abajo,0px)_+_1px))] after:rounded-b-xl after:border after:border-t-0 after:border-inherit "
  + "after:bg-card after:shadow-[0_6px_0_6px_var(--lienzo)] after:content-[''] data-[cortada-abajo]:after:block "
  + "before:pointer-events-none before:absolute before:-inset-x-px before:top-[calc(var(--corte-arriba,0px)_-_1px)] before:z-[3] before:hidden "
  + "before:h-[min(1rem,calc(100%_-_var(--corte-arriba,0px)_+_1px))] before:rounded-t-xl before:border before:border-b-0 before:border-inherit "
  + "before:bg-card before:shadow-[0_-6px_0_6px_var(--lienzo)] before:content-[''] data-[cortada-arriba]:before:block";

/**
 * Caja con desplazamiento que contiene tarjetas (`[data-tarjeta]`). Si el contenido no cabe, la tarjeta
 * que queda cortada por arriba o por abajo no termina en un corte recto: se cierra ahí mismo con su
 * borde curvo, igual que termina el menú lateral.
 *
 * Aquí solo se mide cuánto sobresale cada tarjeta y se deja en `--corte-arriba` / `--corte-abajo`; el
 * cierre lo dibuja `CIERRE_TARJETA`. Se recalcula al desplazar y cuando cambia el contenido o su tamaño.
 */
@Directive({
  selector: '[appCajaTarjetas]',
  standalone: true
})
export class CajaTarjetasDirective implements AfterViewInit, OnDestroy {
  private readonly caja = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly zona = inject(NgZone);
  private tamanos?: ResizeObserver;
  private cambios?: MutationObserver;
  private pendiente = 0;

  ngAfterViewInit(): void {
    // Fuera de la zona de Angular: medir no cambia nada que la aplicación deba volver a comprobar.
    this.zona.runOutsideAngular(() => {
      this.caja.addEventListener('scroll', this.pedir, { passive: true });
      this.tamanos = new ResizeObserver(this.pedir);
      this.cambios = new MutationObserver(() => { this.observar(); this.pedir(); });
      this.cambios.observe(this.caja, { childList: true, subtree: true });
      this.observar();
    });
  }

  ngOnDestroy(): void {
    this.caja.removeEventListener('scroll', this.pedir);
    this.tamanos?.disconnect();
    this.cambios?.disconnect();
    cancelAnimationFrame(this.pendiente);
  }

  private tarjetas(): HTMLElement[] {
    return Array.from(this.caja.querySelectorAll<HTMLElement>('[data-tarjeta]'));
  }

  /** Vigila el tamaño de la caja y de cada tarjeta: una tarjeta puede crecer sin que cambie el DOM. */
  private observar(): void {
    this.tamanos?.disconnect();
    this.tamanos?.observe(this.caja);
    this.tarjetas().forEach(t => this.tamanos?.observe(t));
  }

  private readonly pedir = (): void => {
    if (!this.pendiente) {
      this.pendiente = requestAnimationFrame(() => { this.pendiente = 0; this.medir(); });
    }
  };

  private medir(): void {
    const c = this.caja.getBoundingClientRect();
    for (const t of this.tarjetas()) {
      const r = t.getBoundingClientRect();
      const cuenta = r.height > 0 && r.bottom > c.top && r.top < c.bottom;
      const abajo = cuenta ? Math.max(r.bottom - c.bottom, 0) : 0;
      const arriba = cuenta ? Math.max(c.top - r.top, 0) : 0;
      t.toggleAttribute('data-cortada-abajo', abajo > .5);
      t.toggleAttribute('data-cortada-arriba', arriba > .5);
      t.style.setProperty('--corte-abajo', `${abajo}px`);
      t.style.setProperty('--corte-arriba', `${arriba}px`);
    }
  }
}
