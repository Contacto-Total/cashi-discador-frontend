import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { LogoClienteComponent } from './logo-cliente.component';
import { NombrePropioPipe } from './nombre-propio.pipe';
import { TarjetaDirective } from './tarjeta.directive';

/** Una subcartera del panel. Si llega `asesores`, se muestra junto a la cartera. */
export interface SubcarteraPanel {
  id: number;
  cliente: string;
  cartera: string;
  subcartera: string;
  asesores?: number;
}

/** Etiqueta de la fila: `ok` informa un estado (relleno verde); `neutra` va solo con borde. */
export interface EtiquetaSubcartera {
  texto: string;
  tono: 'ok' | 'neutra';
}

/**
 * Tarjeta lateral con las subcarteras agrupadas por cliente: cada cliente es un recuadro con su logo,
 * su nombre y cuántas subcarteras tiene, y debajo sus subcarteras. Solo pinta y avisa cuál se eligió
 * (`elegir`, con 0 para «General»); qué significa elegirla lo decide la pantalla.
 *
 * `conGeneral` agrega arriba la fila «General» (todas las subcarteras). `etiquetas` pone, por id, la
 * etiqueta de cada fila. La pantalla la oculta con una clase en el propio elemento cuando no hay ancho.
 */
@Component({
  selector: 'app-panel-subcarteras',
  standalone: true,
  imports: [NgClass, LogoClienteComponent, NombrePropioPipe],
  hostDirectives: [TarjetaDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'region', 'aria-label': 'Subcarteras', class: 'font-cashi flex min-h-0 flex-col self-stretch overflow-hidden px-5 pt-[clamp(1rem,2.6vh,2rem)] pb-5 text-foreground antialiased' },
  template: `
    <p role="heading" aria-level="2" class="m-0 mb-[.75rem] flex-none text-[1rem] font-bold">Subcarteras</p>
    <div class="-mx-1.5 -mb-5 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pb-5">
      @if (conGeneral()) {
        <div class="flex flex-none flex-col gap-0.5 rounded-xl border border-border p-[.25rem]">
          <button type="button" class="font-cashi grid w-full flex-none cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.5 rounded-lg border-0! px-2.5! py-2! text-left text-foreground! transition-colors duration-150" [ngClass]="!seleccion() ? 'bg-sidebar-accent' : 'bg-transparent hover:bg-muted'" [attr.aria-current]="!seleccion()" (click)="elegir.emit(0)">
            <span class="overflow-hidden text-[.875rem] font-semibold text-ellipsis whitespace-nowrap">General</span>
            <span class="col-[1/-1] overflow-hidden text-[.75rem] text-ellipsis whitespace-nowrap text-muted-foreground">Todas las subcarteras</span>
          </button>
        </div>
      }
      @for (c of porCliente(); track c.nombre; let primero = $first) {
        <div role="group" [attr.aria-label]="c.nombre | nombrePropio" class="flex flex-none flex-col gap-0.5 rounded-xl border border-border p-[.25rem]"
             [ngClass]="primero && !conGeneral() ? 'mt-0' : 'mt-[.625rem]'">
          <div class="mx-[.375rem] mb-[.25rem] flex items-center gap-[.625rem] border-b border-border px-[.25rem] pt-[.5rem] pb-[.625rem]">
            <app-logo-cliente [cliente]="c.nombre" />
            <span class="min-w-0 flex-1 overflow-hidden text-[.875rem] font-bold text-ellipsis whitespace-nowrap">{{ c.nombre | nombrePropio }}</span>
            <span class="flex-none text-[.75rem] font-medium whitespace-nowrap text-muted-foreground">{{ c.subs.length }} {{ c.subs.length === 1 ? 'subcartera' : 'subcarteras' }}</span>
          </div>
          @for (s of c.subs; track s.id) {
            <button type="button" class="font-cashi grid w-full flex-none cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-0.5 rounded-lg border-0! px-2.5! py-2! text-left text-foreground! transition-colors duration-150" [ngClass]="s.id === seleccion() ? 'bg-sidebar-accent' : 'bg-transparent hover:bg-muted'" [attr.aria-current]="s.id === seleccion()" (click)="elegir.emit(s.id)">
              <span class="overflow-hidden text-[.875rem] font-semibold text-ellipsis whitespace-nowrap">{{ s.subcartera | nombrePropio }}</span>
              @if (etiquetas()[s.id]; as e) {
                <span class="col-[2] row-[1] justify-self-end rounded-full px-[.5625rem] py-[.1875rem] text-[.75rem] font-semibold whitespace-nowrap"
                      [ngClass]="e.tono === 'ok' ? 'bg-(--ok-bg) text-(--ok) shadow-[inset_0_0_0_1px_var(--ok-ln)]'
                        : s.id === seleccion() ? 'bg-card text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]'
                        : 'bg-transparent text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]'">{{ e.texto }}</span>
              }
              <span class="col-[1/-1] overflow-hidden text-[.75rem] text-ellipsis whitespace-nowrap text-muted-foreground">Cartera {{ s.cartera | nombrePropio }}{{ s.asesores == null ? '' : ' · ' + s.asesores + (s.asesores === 1 ? ' asesor' : ' asesores') }}</span>
            </button>
          }
        </div>
      }
    </div>
  `
})
export class PanelSubcarterasComponent {
  readonly subcarteras = input.required<SubcarteraPanel[]>();
  /** Subcartera elegida; 0 es «General». */
  readonly seleccion = input<number | null>(0);
  readonly conGeneral = input(false);
  readonly etiquetas = input<Record<number, EtiquetaSubcartera>>({});
  readonly elegir = output<number>();


  readonly porCliente = computed(() => {
    const grupos = new Map<string, SubcarteraPanel[]>();
    for (const s of this.subcarteras()) grupos.set(s.cliente, [...(grupos.get(s.cliente) ?? []), s]);
    return [...grupos].map(([nombre, subs]) => ({ nombre, subs }));
  });
}
