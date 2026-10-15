import { ChangeDetectionStrategy, Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Una opción del buscador. `ayuda` es el texto secundario a la derecha; `grupo`, el título bajo el que va.
 * `sugerida` marca la copia de una opción que se repite en un grupo de arriba: solo se ve sin búsqueda.
 */
export interface OpcionCombobox {
  valor: string;
  etiqueta: string;
  ayuda?: string;
  grupo?: string;
  deshabilitada?: boolean;
  sugerida?: boolean;
}

const normalizar = (s: string | undefined) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Selector con búsqueda para listas largas, en lugar de un `<select>`: botón que abre una lista filtrable,
 * agrupada y con texto secundario (el combobox de frontend-v2). Con `permiteCrear`, si lo buscado no coincide
 * con ninguna opción ofrece «Crear "…"» al final y emite el texto en `crear`.
 *
 * La lista se abre en un overlay de CDK, fuera de la tarjeta, para que no la recorte un contenedor con
 * desplazamiento. Lleva `cashi-pantalla` y `font-cashi` en su raíz porque se pinta fuera de la pantalla.
 * No tiene telón, así que la lista se reposiciona sola si la lista de la pantalla se desplaza.
 */
@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [NgClass, CdkOverlayOrigin, CdkConnectedOverlay, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
  template: `
    <button #boton type="button" cdkOverlayOrigin #origen="cdkOverlayOrigin" role="combobox" aria-haspopup="listbox"
            [attr.aria-expanded]="abierto()" [attr.aria-label]="etiquetaAria() || null" [disabled]="deshabilitado()"
            [title]="seleccionada()?.etiqueta ?? marcador()" (click)="alternar()"
            [class]="claseBoton()" [ngClass]="abierto() ? 'border-ring! shadow-[0_0_0_3px_rgb(16_185_129/.3)]' : ''">
      <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" [ngClass]="seleccionada() ? '' : 'text-muted-foreground'">{{ seleccionada()?.etiqueta ?? marcador() }}</span>
      <lucide-angular name="chevrons-up-down" [size]="14" class="flex flex-none opacity-50"></lucide-angular>
    </button>

    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="origen" [cdkConnectedOverlayOpen]="abierto()"
                 [cdkConnectedOverlayPositions]="POSICIONES" [cdkConnectedOverlayWidth]="ancho()"
                 (overlayOutsideClick)="clicFuera($event)" (detach)="cerrar()" (attach)="alAbrir()">
      <div role="dialog" [attr.aria-label]="etiquetaAria() || marcador()" (keydown)="tecla($event)"
           class="font-cashi cashi-pantalla flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-popover text-foreground antialiased shadow-[0_10px_28px_rgb(0_0_0/.18)]">
        <div class="flex h-10 flex-none items-center gap-2 border-b border-border px-3">
          <lucide-angular name="search" [size]="16" class="flex flex-none opacity-50"></lucide-angular>
          <input #busqueda type="text" autocomplete="off" [placeholder]="marcadorBusqueda()" [value]="consulta()"
                 [attr.aria-label]="marcadorBusqueda()" (input)="buscar($any($event.target).value)"
                 class="font-cashi m-0! h-full min-w-0 flex-1 border-0! bg-transparent! p-0! text-[.875rem] text-foreground shadow-none! outline-none!" />
        </div>
        <div #lista role="listbox" class="max-h-[18.75rem] overflow-x-hidden overflow-y-auto p-1">
          @for (g of grupos(); track g.nombre) {
            @if (g.nombre) {
              <div class="px-2 pt-1.5 pb-1 text-[.75rem] font-medium text-muted-foreground">{{ g.nombre }}</div>
            }
            @for (o of g.opciones; track o.valor) {
              <button type="button" role="option" [attr.aria-selected]="o.valor === (valor() ?? '')" [disabled]="o.deshabilitada"
                      [attr.data-indice]="indiceDe(o)" (click)="elegir(o)" (mousemove)="foco.set(indiceDe(o))"
                      class="font-cashi m-0! flex w-full cursor-pointer items-center gap-2 rounded-[.25rem] border-0! px-2! py-1.5! text-left text-[.875rem] text-foreground! disabled:cursor-default disabled:opacity-50"
                      [ngClass]="indiceDe(o) === foco() ? 'bg-muted!' : 'bg-transparent!'">
                <lucide-angular name="check" [size]="16" class="flex flex-none" [ngClass]="o.valor === (valor() ?? '') ? 'opacity-100' : 'opacity-0'"></lucide-angular>
                <span class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{ o.etiqueta }}</span>
                @if (o.ayuda) {
                  <span class="max-w-[45%] flex-none overflow-hidden text-[.75rem] text-ellipsis whitespace-nowrap text-muted-foreground tabular-nums">{{ o.ayuda }}</span>
                }
              </button>
            }
          }
          @if (!navegables().length) {
            <div class="px-2 py-5 text-center text-[.875rem] text-muted-foreground">{{ vacio() }}</div>
          }
        </div>
        @if (puedeCrear()) {
          <div class="flex-none border-t border-border p-1">
            <button type="button" (click)="crearDesdeBusqueda()" (mousemove)="foco.set(navegables().length)"
                    class="font-cashi m-0! flex w-full cursor-pointer items-center gap-2 rounded-[.25rem] border-0! px-2! py-1.5! text-left text-[.875rem] font-medium text-(--ok)!"
                    [ngClass]="foco() === navegables().length ? 'bg-muted!' : 'bg-transparent!'">
              <lucide-angular name="plus" [size]="16" class="flex flex-none"></lucide-angular>
              <span class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">Crear «{{ consulta().trim() }}»</span>
            </button>
          </div>
        }
      </div>
    </ng-template>
  `
})
export class ComboboxComponent {
  readonly opciones = input.required<OpcionCombobox[]>();
  readonly valor = input<string | null>(null);
  readonly marcador = input('Seleccionar…');
  readonly marcadorBusqueda = input('Buscar…');
  readonly vacio = input('Sin resultados.');
  readonly etiquetaAria = input('');
  readonly deshabilitado = input(false);
  /** Ofrece «Crear "…"» al final cuando lo buscado no coincide exactamente con ninguna opción. */
  readonly permiteCrear = input(false);
  /** Ancho mínimo de la lista, en px; si el botón es más ancho, la lista toma su ancho. */
  readonly anchoMinimo = input(336);
  /** `fila`: compacto, para una fila de tabla. `campo`: mismo alto que los campos de un formulario (2.5rem). */
  readonly alto = input<'fila' | 'campo'>('fila');

  readonly cambio = output<string>();
  readonly crear = output<string>();

  readonly POSICIONES: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
  ];

  private readonly boton = viewChild.required<ElementRef<HTMLButtonElement>>('boton');
  private readonly busqueda = viewChild<ElementRef<HTMLInputElement>>('busqueda');
  private readonly lista = viewChild<ElementRef<HTMLElement>>('lista');

  readonly abierto = signal(false);
  readonly consulta = signal('');
  readonly foco = signal(-1);
  readonly ancho = signal(336);

  readonly claseBoton = computed(() => 'font-cashi m-0! flex w-full min-w-0 cursor-pointer items-center justify-between gap-1.5 border! border-(--campo-ln)! '
    + 'bg-(--campo)! text-left text-[.875rem] leading-[1.5] text-foreground! outline-none focus-visible:border-ring! focus-visible:shadow-[0_0_0_3px_rgb(16_185_129/.3)] '
    + 'disabled:cursor-default disabled:opacity-50 '
    + (this.alto() === 'campo' ? 'h-10! rounded-[.625rem]! px-3! py-0!' : 'rounded-lg! px-2! py-[.3125rem]!'));
  readonly seleccionada = computed(() => this.opciones().find(o => o.valor === (this.valor() ?? '') && o.valor !== '') ?? null);
  private readonly filtradas = computed(() => {
    const q = normalizar(this.consulta().trim());
    return q ? this.opciones().filter(o => !o.sugerida && (normalizar(o.etiqueta).includes(q) || normalizar(o.ayuda).includes(q))) : this.opciones();
  });
  /** Grupos en el orden en que aparecen. */
  readonly grupos = computed(() => {
    const mapa = new Map<string, OpcionCombobox[]>();
    for (const o of this.filtradas()) mapa.set(o.grupo ?? '', [...(mapa.get(o.grupo ?? '') ?? []), o]);
    return [...mapa].map(([nombre, opciones]) => ({ nombre, opciones }));
  });
  /** Opciones en el orden en que se ven, para moverse con las flechas. */
  readonly navegables = computed(() => this.grupos().flatMap(g => g.opciones));
  readonly puedeCrear = computed(() => {
    const q = normalizar(this.consulta().trim());
    return this.permiteCrear() && !!q && !this.opciones().some(o => normalizar(o.etiqueta) === q);
  });

  indiceDe(o: OpcionCombobox): number {
    return this.navegables().indexOf(o);
  }

  alternar(): void {
    if (this.abierto()) return this.cerrar();
    this.ancho.set(Math.max(this.boton().nativeElement.offsetWidth, this.anchoMinimo()));
    this.consulta.set('');
    this.foco.set(-1);
    this.abierto.set(true);
  }

  alAbrir(): void {
    setTimeout(() => this.busqueda()?.nativeElement.focus());
  }

  cerrar(volverAlBoton = false): void {
    if (!this.abierto()) return;
    this.abierto.set(false);
    if (volverAlBoton) this.boton().nativeElement.focus();
  }

  /**
   * Sin telón: el clic fuera cierra la lista y además llega a lo que se pulsó (otro control de la fila). El
   * propio botón se excluye porque su clic ya alterna.
   */
  clicFuera(ev: MouseEvent): void {
    if (!this.boton().nativeElement.contains(ev.target as Node)) this.cerrar();
  }

  buscar(texto: string): void {
    this.consulta.set(texto);
    this.foco.set(-1);
  }

  elegir(o: OpcionCombobox): void {
    if (o.deshabilitada) return;
    this.cambio.emit(o.valor);
    this.cerrar(true);
  }

  crearDesdeBusqueda(): void {
    const texto = this.consulta().trim();
    if (!texto) return;
    this.crear.emit(texto);
    this.cerrar(true);
  }

  tecla(ev: KeyboardEvent): void {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      return this.cerrar(true);
    }
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(ev.key)) return;
    ev.preventDefault();
    const opciones = this.navegables(), total = opciones.length + (this.puedeCrear() ? 1 : 0);
    if (!total) return;
    if (ev.key === 'Enter') {
      const i = this.foco() < 0 ? 0 : this.foco();
      if (i === opciones.length) return this.crearDesdeBusqueda();
      return this.elegir(opciones[i]);
    }
    let i = this.foco();
    do {
      i = (i + (ev.key === 'ArrowDown' ? 1 : -1) + total) % total;
    } while (i < opciones.length && opciones[i].deshabilitada && i !== this.foco());
    this.foco.set(i);
    this.lista()?.nativeElement.querySelector(`[data-indice="${i}"]`)?.scrollIntoView({ block: 'nearest' });
  }
}
