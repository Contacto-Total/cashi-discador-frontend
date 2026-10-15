import { ChangeDetectionStrategy, Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { CdkConnectedOverlay, CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { LucideAngularModule } from 'lucide-angular';
import { BotonDirective } from './boton.directive';

/**
 * Una opción del buscador. `ayuda` es el texto secundario a la derecha; `grupo`, el título bajo el que va;
 * `icono`, un ícono de lucide a la izquierda (en lugar del check); `titulo`, el texto al pasar el mouse.
 * `sugerida` marca la copia de una opción que se repite en un grupo de arriba: solo se ve sin búsqueda.
 */
export interface OpcionCombobox {
  valor: string;
  etiqueta: string;
  ayuda?: string;
  grupo?: string;
  icono?: string;
  titulo?: string;
  deshabilitada?: boolean;
  sugerida?: boolean;
}

interface FilaLista {
  opcion: OpcionCombobox;
  indice: number;
  titulo: string | null;
}

const normalizar = (s: string | undefined) => (s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Selector con búsqueda para listas largas, en lugar de un `<select>`: abre una lista filtrable, agrupada y
 * paginada (`porPagina` opciones, 5 por defecto), con texto secundario. Con `permiteCrear`, si lo buscado no
 * coincide con ninguna opción ofrece «Crear "…"» al final y emite el texto en `crear`.
 *
 * Con `boton`, se abre desde un botón secundario con ese texto (por ejemplo «Agregar columna») y la elección
 * solo se emite en `cambio`: el botón no muestra lo elegido.
 *
 * La lista se abre en un overlay de CDK, fuera de la tarjeta, para que no la recorte un contenedor con
 * desplazamiento. Lleva `cashi-pantalla` y `font-cashi` en su raíz porque se pinta fuera de la pantalla.
 * No tiene telón: el clic fuera cierra la lista y además llega a lo que se pulsó.
 */
@Component({
  selector: 'app-combobox',
  standalone: true,
  imports: [NgClass, CdkOverlayOrigin, CdkConnectedOverlay, LucideAngularModule, BotonDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block min-w-0' },
  template: `
    @if (boton(); as texto) {
      <button #boton type="button" appBoton="secundario" appBotonAlto="chico" cdkOverlayOrigin #origen="cdkOverlayOrigin"
              aria-haspopup="listbox" [attr.aria-expanded]="abierto()" [attr.aria-label]="etiquetaAria() || texto" [disabled]="deshabilitado()"
              (click)="alternar()">
        <lucide-angular name="plus" [size]="16"></lucide-angular>{{ texto }}
      </button>
    } @else {
      <button #boton type="button" cdkOverlayOrigin #origen="cdkOverlayOrigin" role="combobox" aria-haspopup="listbox"
              [attr.aria-expanded]="abierto()" [attr.aria-label]="etiquetaAria() || null" [disabled]="deshabilitado()"
              [title]="seleccionada()?.etiqueta ?? marcador()" (click)="alternar()"
              [class]="claseBoton()" [ngClass]="abierto() ? 'border-ring! shadow-[0_0_0_3px_rgb(16_185_129/.3)]' : ''">
        <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap" [ngClass]="seleccionada() ? '' : 'text-muted-foreground'">{{ seleccionada()?.etiqueta ?? marcador() }}</span>
        <lucide-angular name="chevrons-up-down" [size]="14" class="flex flex-none opacity-50"></lucide-angular>
      </button>
    }

    <ng-template cdkConnectedOverlay [cdkConnectedOverlayOrigin]="origen()" [cdkConnectedOverlayOpen]="abierto()"
                 [cdkConnectedOverlayPositions]="boton() ? POSICIONES_BOTON : POSICIONES" [cdkConnectedOverlayWidth]="ancho()"
                 (overlayOutsideClick)="clicFuera($event)" (detach)="cerrar()" (attach)="alAbrir()">
      <div role="dialog" [attr.aria-label]="etiquetaAria() || boton() || marcador()" (keydown)="tecla($event)"
           class="font-cashi cashi-pantalla flex max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover text-foreground antialiased shadow-[0_16px_36px_-12px_rgb(0_0_0/.22),0_2px_6px_-2px_rgb(0_0_0/.06)]">
        <div class="flex h-11 flex-none items-center gap-2 border-b border-border px-3.5">
          <lucide-angular name="search" [size]="16" class="flex flex-none opacity-45"></lucide-angular>
          <input #busqueda type="text" autocomplete="off" [placeholder]="marcadorBusqueda()" [value]="consulta()"
                 [attr.aria-label]="marcadorBusqueda()" (input)="buscar($any($event.target).value)"
                 class="font-cashi m-0! h-full min-w-0 flex-1 border-0! bg-transparent! p-0! text-[.875rem] text-foreground shadow-none! outline-none! placeholder:text-muted-foreground" />
        </div>
        <div #lista role="listbox" class="flex flex-col gap-0.5 p-1.5">
          @for (f of pagina(); track f.indice) {
            @if (f.titulo) {
              <div class="px-2.5 pt-1.5 pb-1 text-[.75rem] font-medium text-muted-foreground">{{ f.titulo }}</div>
            }
            <button type="button" role="option" [attr.aria-selected]="f.opcion.valor === (valor() ?? '')" [disabled]="f.opcion.deshabilitada"
                    [attr.data-indice]="f.indice" [title]="f.opcion.titulo ?? ''" (click)="elegir(f.opcion)" (mousemove)="foco.set(f.indice)"
                    class="group font-cashi m-0! flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border-0! px-2.5! py-1.5! text-left text-[.875rem] text-foreground! transition-colors duration-100 disabled:cursor-default disabled:opacity-45"
                    [ngClass]="f.indice === foco() ? 'bg-muted!' : 'bg-transparent!'">
              @if (f.opcion.icono) {
                <span class="grid size-6 flex-none place-items-center rounded-md text-muted-foreground" [ngClass]="f.indice === foco() ? 'bg-card' : 'bg-muted'">
                  <lucide-angular [name]="f.opcion.icono" [size]="14" class="flex"></lucide-angular>
                </span>
              } @else {
                <lucide-angular name="check" [size]="16" class="flex flex-none text-(--ok)" [ngClass]="f.opcion.valor === (valor() ?? '') ? 'opacity-100' : 'opacity-0'"></lucide-angular>
              }
              <span class="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{{ f.opcion.etiqueta }}</span>
              @if (f.opcion.ayuda) {
                <span class="max-w-[45%] flex-none overflow-hidden text-[.75rem] text-ellipsis whitespace-nowrap text-muted-foreground tabular-nums">{{ f.opcion.ayuda }}</span>
              }
            </button>
          }
          @if (!navegables().length) {
            <div class="px-2 py-5 text-center text-[.875rem] text-muted-foreground">{{ vacio() }}</div>
          }
        </div>
        @if (paginas() > 1) {
          <div class="flex flex-none items-center gap-0.5 border-t border-border py-1 pr-1.5 pl-3.5 text-[.75rem] text-muted-foreground tabular-nums">
            <span class="mr-auto">{{ desde() + 1 }}–{{ hasta() }} de {{ navegables().length }}</span>
            <button type="button" class="grid size-7 cursor-pointer place-items-center rounded-md border-0! bg-transparent p-0! text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Anteriores" [disabled]="paginaActual() === 0" (click)="irAPagina(paginaActual() - 1)">
              <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
            </button>
            <button type="button" class="grid size-7 cursor-pointer place-items-center rounded-md border-0! bg-transparent p-0! text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Siguientes" [disabled]="paginaActual() === paginas() - 1" (click)="irAPagina(paginaActual() + 1)">
              <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
            </button>
          </div>
        }
        @if (puedeCrear()) {
          <div class="flex-none border-t border-border p-1.5">
            <button type="button" (click)="crearDesdeBusqueda()" (mousemove)="foco.set(navegables().length)"
                    class="font-cashi m-0! flex min-h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg border-0! px-2.5! py-1.5! text-left text-[.875rem] font-medium text-(--ok)!"
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
  /** Texto del botón que abre la lista, en lugar del campo con lo elegido. */
  readonly boton = input<string | null>(null);
  readonly porPagina = input(5);

  readonly cambio = output<string>();
  readonly crear = output<string>();

  readonly POSICIONES: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 6 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -6 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
  ];
  readonly POSICIONES_BOTON: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 6 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -6 },
  ];

  private readonly botonRef = viewChild.required('boton', { read: ElementRef<HTMLButtonElement> });
  readonly origen = viewChild.required('origen', { read: CdkOverlayOrigin });
  private readonly busqueda = viewChild<ElementRef<HTMLInputElement>>('busqueda');

  readonly abierto = signal(false);
  readonly consulta = signal('');
  readonly foco = signal(-1);
  readonly ancho = signal(336);
  private readonly paginaPedida = signal(0);

  readonly claseBoton = computed(() => 'font-cashi m-0! flex w-full min-w-0 cursor-pointer items-center justify-between gap-1.5 border! border-(--campo-ln)! '
    + 'bg-(--campo)! text-left text-[.875rem] leading-[1.5] text-foreground! outline-none focus-visible:border-ring! focus-visible:shadow-[0_0_0_3px_rgb(16_185_129/.3)] '
    + 'disabled:cursor-default disabled:opacity-50 '
    + (this.alto() === 'campo' ? 'h-10! rounded-[.625rem]! px-3! py-0!' : 'rounded-lg! px-2! py-[.3125rem]!'));
  readonly seleccionada = computed(() => this.opciones().find(o => o.valor === (this.valor() ?? '') && o.valor !== '') ?? null);
  private readonly filtradas = computed(() => {
    const q = normalizar(this.consulta().trim());
    return q ? this.opciones().filter(o => !o.sugerida && (normalizar(o.etiqueta).includes(q) || normalizar(o.ayuda).includes(q) || normalizar(o.titulo).includes(q))) : this.opciones();
  });
  /** Opciones en el orden en que se ven (agrupadas en el orden en que aparecen): lo que se pagina. */
  readonly navegables = computed(() => {
    const grupos = new Map<string, OpcionCombobox[]>();
    for (const o of this.filtradas()) grupos.set(o.grupo ?? '', [...(grupos.get(o.grupo ?? '') ?? []), o]);
    return [...grupos.values()].flat();
  });
  readonly paginas = computed(() => Math.max(1, Math.ceil(this.navegables().length / this.porPagina())));
  readonly paginaActual = computed(() => Math.min(Math.max(this.paginaPedida(), 0), this.paginas() - 1));
  readonly desde = computed(() => this.paginaActual() * this.porPagina());
  readonly hasta = computed(() => Math.min(this.desde() + this.porPagina(), this.navegables().length));
  /** Las opciones de la página, con el título del grupo donde empieza uno (y al inicio de la página). */
  readonly pagina = computed<FilaLista[]>(() => {
    const filas: FilaLista[] = [], todas = this.navegables();
    for (let i = this.desde(); i < this.hasta(); i++) {
      const o = todas[i], antes = i === this.desde() ? null : todas[i - 1];
      filas.push({ opcion: o, indice: i, titulo: o.grupo && (!antes || antes.grupo !== o.grupo) ? o.grupo : null });
    }
    return filas;
  });
  readonly puedeCrear = computed(() => {
    const q = normalizar(this.consulta().trim());
    return this.permiteCrear() && !!q && !this.opciones().some(o => normalizar(o.etiqueta) === q);
  });

  alternar(): void {
    if (this.abierto()) return this.cerrar();
    this.ancho.set(Math.max(this.botonRef().nativeElement.offsetWidth, this.anchoMinimo()));
    this.consulta.set('');
    this.foco.set(-1);
    // Abre en la página de la opción elegida.
    const elegida = this.navegables().findIndex(o => o.valor === (this.valor() ?? '') && o.valor !== '');
    this.paginaPedida.set(elegida < 0 ? 0 : Math.floor(elegida / this.porPagina()));
    this.abierto.set(true);
  }

  alAbrir(): void {
    setTimeout(() => this.busqueda()?.nativeElement.focus());
  }

  cerrar(volverAlBoton = false): void {
    if (!this.abierto()) return;
    this.abierto.set(false);
    if (volverAlBoton) this.botonRef().nativeElement.focus();
  }

  /** El clic fuera cierra la lista y llega a lo que se pulsó; el del propio botón ya alterna. */
  clicFuera(ev: MouseEvent): void {
    if (!this.botonRef().nativeElement.contains(ev.target as Node)) this.cerrar();
  }

  buscar(texto: string): void {
    this.consulta.set(texto);
    this.foco.set(-1);
    this.paginaPedida.set(0);
  }

  irAPagina(p: number): void {
    this.paginaPedida.set(Math.min(Math.max(p, 0), this.paginas() - 1));
    this.foco.set(-1);
    this.busqueda()?.nativeElement.focus();
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

  /** ↑↓ recorren las opciones y pasan de página en el borde; RePág/AvPág cambian de página; Enter elige. */
  tecla(ev: KeyboardEvent): void {
    if (ev.key === 'Escape') {
      ev.preventDefault();
      return this.cerrar(true);
    }
    if (ev.key === 'PageDown' || ev.key === 'PageUp') {
      ev.preventDefault();
      return this.irAPagina(this.paginaActual() + (ev.key === 'PageDown' ? 1 : -1));
    }
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(ev.key)) return;
    ev.preventDefault();
    const opciones = this.navegables(), crear = this.puedeCrear();
    if (ev.key === 'Enter') {
      const i = this.foco() < 0 ? this.desde() : this.foco();
      if (crear && (i === opciones.length || !opciones.length)) return this.crearDesdeBusqueda();
      if (opciones[i]) this.elegir(opciones[i]);
      return;
    }
    const total = opciones.length + (crear ? 1 : 0);
    if (!total) return;
    let i = this.foco() < 0 ? (ev.key === 'ArrowDown' ? this.desde() - 1 : this.hasta()) : this.foco();
    const inicio = i;
    do {
      i = (i + (ev.key === 'ArrowDown' ? 1 : -1) + total) % total;
    } while (i < opciones.length && opciones[i].deshabilitada && i !== inicio);
    this.foco.set(i);
    if (i < opciones.length) this.paginaPedida.set(Math.floor(i / this.porPagina()));
    setTimeout(() => document.querySelector(`.cdk-overlay-container [data-indice="${i}"]`)?.scrollIntoView({ block: 'nearest' }));
  }
}
