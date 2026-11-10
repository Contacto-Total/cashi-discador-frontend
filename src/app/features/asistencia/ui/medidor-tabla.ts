import { afterEveryRender, signal } from '@angular/core';

/** Lo que hace falta para medir: la zona que desliza, la caja de la tabla, cuántas filas hay y si puede ampliarse. */
export interface FuenteTabla {
  zona?: HTMLElement;
  caja?: HTMLElement;
  total: number;
  amplia: boolean;
  /** Qué lista es (pestaña, filtro, página…): al cambiar, el alto de referencia se vuelve a tomar. */
  clave: string;
}

/**
 * Las filas por página de una tabla paginada del molde: salen del alto que le queda a la tabla en su
 * tarjeta. Si entran todas y sobra alto, cada fila crece parejo (hasta 5.75rem) para mostrar el detalle.
 *
 * Se mide después de cada pintado de la aplicación y cuando la zona cambia de tamaño. Con `afterEveryRender`
 * y no con `ngAfterViewChecked`: cuando cambia una signal, Angular repinta solo ese componente y sus
 * ganchos de vista no corren, así que la tabla se quedaba con las filas de antes.
 *
 * Crearlo dentro del contexto de inyección (al declarar el campo del componente).
 */
export class MedidorTabla {
  readonly porPagina = signal(8);
  /** Alto de las filas ampliadas; 0 si van con su alto normal. */
  readonly altoFila = signal(0);

  private observador?: ResizeObserver;
  private observada?: HTMLElement;
  private cuadro = 0;

  constructor(private readonly fuente: () => FuenteTabla) {
    afterEveryRender({ read: () => this.revisar() });
  }

  private revisar(): void {
    const { zona, caja } = this.fuente();
    if (zona !== this.observada) {
      this.observador?.disconnect();
      this.observada = zona;
      if (zona) {
        this.observador = new ResizeObserver(() => this.medirLuego());
        this.observador.observe(zona);
      }
    }
    if (zona && caja) this.medirLuego();
  }

  cerrar(): void {
    this.observador?.disconnect();
    cancelAnimationFrame(this.cuadro);
  }

  private medirLuego(): void {
    cancelAnimationFrame(this.cuadro);
    this.cuadro = requestAnimationFrame(() => {
      const { zona, caja, total, amplia, clave } = this.fuente();
      if (clave !== this.claveNatural) {
        this.claveNatural = clave;
        this.ajustes = 0;
      }
      if (zona && caja) this.medir(zona, caja, total, amplia);
    });
  }

  /** El alto de la fila más alta sin ampliar; mientras están ampliadas se mide contra este. */
  private natural = 0;
  private claveNatural = '';
  /**
   * Cuántas veces se cambió la cuenta en esta lista. Como en el artifact, se reajusta a lo sumo tres veces:
   * con filas de distinto alto, una página de filas bajas pide más filas, la siguiente trae una alta y la
   * cuenta podría ir y volver sin parar.
   */
  private ajustes = 0;

  /**
   * Una sola cuenta con el alto disponible, que no depende del alto de las filas: así ampliar no cambia la
   * medida y no hay que volver a medir sin ampliar (eso hacía parpadear la tabla).
   */
  private medir(zona: HTMLElement, caja: HTMLElement, total: number, amplia: boolean): void {
    const tabla = caja.querySelector('table') as HTMLElement | null;
    const cuerpo = tabla?.querySelector('tbody') as HTMLElement | null;
    const todas = cuerpo ? Array.from(cuerpo.children) as HTMLElement[] : [];
    // El panel que se abre bajo una fila (anular, revocar) no es una fila: ni cuenta ni ocupa lugar de una.
    const paneles = todas.filter(f => f.hasAttribute('data-panel')), filas = todas.filter(f => !f.hasAttribute('data-panel'));
    if (!tabla || !cuerpo || !filas.length) return;
    if (!this.altoFila()) this.natural = Math.max(...filas.map(f => f.offsetHeight));
    if (!this.natural) return;
    // La fila más alta manda y el relleno de la caja cuenta como libre, como en las tablas del molde.
    const disp = cuerpo.offsetHeight - paneles.reduce((s, p) => s + p.offsetHeight, 0) + caja.clientHeight - tabla.offsetHeight
      - Math.max(0, zona.scrollHeight - zona.clientHeight - paneles.reduce((s, p) => s + p.offsetHeight, 0));
    const n = Math.max(3, Math.floor(disp / this.natural));
    if (n !== this.porPagina() && this.ajustes < 3) {
      this.ajustes++;
      this.porPagina.set(n);
      if (this.altoFila()) this.altoFila.set(0);
      return;
    }
    let h = 0;
    if (amplia && total && total <= n) {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const posible = Math.min(rem * 5.75, Math.floor((disp - 6) / total));
      if (posible > this.natural * 1.25) h = posible;
    }
    if (h !== this.altoFila()) this.altoFila.set(h);
  }
}
