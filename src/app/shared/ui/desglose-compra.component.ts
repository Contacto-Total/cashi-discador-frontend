import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { colorCompra } from '../../core/services/compras-cartera.service';

/** Una compra y su valor ya formateado. */
export interface ValorCompra {
  compra: string;
  valor: string;
}

/** Da formato al valor de una compra: cantidad, soles o porcentaje. */
export function formatoCompra(v: number | null | undefined, tipo: 'num' | 'soles' | 'pct'): string {
  const n = Number(v ?? 0);
  if (tipo === 'soles') return 'S/ ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (tipo === 'pct') return n.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  return n.toLocaleString('en-US');
}

/** Selector «Ver: Total | Por compra» de los reportes con Tramo Propio. */
@Component({
  selector: 'app-ver-compra',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="inline-flex items-center gap-2" role="group" aria-label="Ver el total o el desglose por compra">
      <span class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Ver</span>
      <span class="inline-flex h-8 items-center gap-0.5 rounded-lg border border-[#d5dbe3] bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
        <button type="button" [class]="clase(!porCompra())" [attr.aria-pressed]="!porCompra()" [disabled]="cargando()"
                (click)="porCompra.set(false)">Total</button>
        <button type="button" [class]="clase(porCompra())" [attr.aria-pressed]="porCompra()" [disabled]="cargando()"
                (click)="porCompra.set(true)">
          <span class="inline-flex items-center gap-1.5">
            @if (cargando() && porCompra()) {
              <span class="h-3 w-3 animate-spin rounded-full border-[1.5px] border-current border-t-transparent motion-reduce:animate-none" aria-hidden="true"></span>
            }
            Por compra
          </span>
        </button>
      </span>
    </div>
  `
})
export class VerCompraComponent {
  readonly porCompra = model(false);
  readonly cargando = input(false);

  clase(activo: boolean): string {
    return 'h-[26px] whitespace-nowrap rounded-[6px] px-3 text-[12px] font-bold transition-colors duration-150 disabled:cursor-progress ' +
      (activo ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
              : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
  }
}

/** Recuadro de una tarjeta con el valor de cada compra. */
@Component({
  selector: 'app-desglose-compra',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [attr.aria-busy]="cargando()" [class]="'mt-3 grid w-full min-w-0 gap-1 rounded-lg px-2.5 py-1.5 ' +
                   (sobreColor() ? 'bg-white/95 shadow-sm' : 'border border-[#e2e8f0] bg-[#f8fafc] dark:border-slate-700 dark:bg-slate-800')">
      @for (v of valores(); track v.compra; let i = $index) {
        <span class="flex min-w-0 flex-wrap items-center gap-x-1.5 text-[12px] leading-[1.35] text-[#0f172a]" [class.dark:text-slate-100]="!sobreColor()">
          <span class="h-[9px] w-[9px] shrink-0 rounded-full" [style.background]="color(i).texto"></span>
          <span class="max-w-[calc(100%-15px)] truncate text-[10.5px] font-bold tracking-[0.02em]" [style.color]="color(i).texto">{{ v.compra }}</span>
          @if (cargando()) {
            <span class="ml-auto h-2.5 w-12 shrink-0 animate-pulse rounded-full motion-reduce:animate-none"
                  [class]="sobreColor() ? 'bg-slate-200' : 'bg-slate-200 dark:bg-slate-700'" aria-hidden="true"></span>
          } @else {
            <span class="ml-auto shrink-0 pl-2 font-bold tabular-nums">{{ v.valor }}</span>
          }
        </span>
      }
    </span>
  `
})
export class DesgloseCompraComponent {
  readonly valores = input.required<ValorCompra[]>();
  readonly sobreColor = input(false);
  readonly cargando = input(false);
  readonly color = colorCompra;
}

/** Etiqueta de la compra de una fila. */
@Component({
  selector: 'app-etiqueta-compra',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (compra()) {
      <span class="inline-block whitespace-nowrap rounded-full border px-2 py-px text-[10.5px] font-bold"
            [style.color]="c().texto" [style.background]="c().fondo" [style.border-color]="c().borde">{{ compra() }}</span>
    } @else {
      <span class="text-[#94a3b8]">—</span>
    }
  `
})
export class EtiquetaCompraComponent {
  readonly compra = input<string | null | undefined>(null);
  readonly indice = input(0);
  c() { return colorCompra(this.indice()); }
}

/** Barra fina de progreso mientras se trae cada compra. El contenedor debe ser `relative`. */
@Component({
  selector: 'app-cargando-compras',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none absolute inset-x-0 -top-1.5 z-20 block', role: 'status', 'aria-live': 'polite' },
  styles: [`
    .barra { animation: avance 1.1s ease-in-out infinite; }
    @keyframes avance { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }
    @media (prefers-reduced-motion: reduce) { .barra { animation: none; width: 100%; opacity: .5; } }
  `],
  template: `
    <span class="block h-[3px] overflow-hidden rounded-full bg-violet-100 dark:bg-violet-950">
      <span class="barra block h-full w-2/5 rounded-full bg-[#6d28d9] dark:bg-violet-400"></span>
    </span>
    <span class="sr-only">Cargando desglose por compra: {{ compras().join(', ') }}</span>
  `
})
export class CargandoComprasComponent {
  readonly compras = input<string[]>([]);
}
