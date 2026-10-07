import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TipDirective } from './tip.directive';

/** Lo que la fila muestra del estado del asesor. Los colores llegan ya resueltos para el tema. */
export interface EstadoMenu {
  nombre: string;
  icono: string;
  /** Color del estado, para el fondo. */
  tono: string;
  /** El mismo color en su versión legible, para el icono. */
  tinta: string;
  segundos: number;
  /** Lo que dice el semáforo: «Máximo 15:00», «Acercándose al tope», «Al límite», «Tiempo excedido». */
  leyenda: string;
  excedido: boolean;
}

/**
 * Estado del asesor en el pie del menú: en qué estado está y cuánto lleva, para las pantallas que no
 * son el Panel. Lleva al Panel, donde se cambia de estado.
 *
 * La fila es siempre del color de su estado, que es lo que lo identifica; el semáforo se lee en la
 * leyenda. Pasa a rojo solo con el tiempo excedido: el icono es el triángulo de alerta y un destello
 * recorre la fila; es lo único que se mueve.
 * Con el menú plegado es un icono más: sin fondo, salvo al pasar el cursor o con el tiempo excedido,
 * y entonces el fondo es un cuadrado de 2rem centrado en el icono, del tamaño del avatar y del botón
 * de salida que tiene debajo (el icono queda 0,4 px a la izquierda del centro de la fila: de ahí los
 * dos márgenes distintos).
 *
 * Al pasar el cursor se enciende la luz del estado, que nace en el icono y se abre por la fila, y
 * asoma una flecha junto al nombre.
 *
 * El fondo va en `::before` para poder encogerlo al plegar. Nada usa `opacity` en reposo: la luz y el
 * destello son colores con transparencia.
 */
@Component({
  selector: 'app-estado-menu',
  standalone: true,
  imports: [NgClass, RouterModule, LucideAngularModule, TipDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <div class="grid transition-[grid-template-rows] duration-200 ease-out" [ngClass]="estado ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
      <div class="min-h-0 overflow-hidden transition-[visibility] duration-0" [ngClass]="estado ? 'visible delay-0' : 'invisible delay-200'" [attr.inert]="estado ? null : ''">
        @if (visto; as e) {
          <a routerLink="/agent-dashboard" [class]="FILA" [style.--f]="e.excedido ? 'var(--nivel-rojo)' : e.tono" [style.--c]="e.excedido ? 'var(--nivel-rojo)' : e.tinta"
             [attr.data-plegado]="plegado ? '' : null" [attr.data-excedido]="e.excedido ? '' : null"
             [attr.aria-label]="'Estado: ' + e.nombre + ', ' + tiempo(e) + ', ' + e.leyenda + '. Ir al Panel del asesor'"
             [appTip]="e.nombre + ' · ' + tiempo(e) + ' · ' + e.leyenda" [appTipActivo]="plegado" (click)="navegar.emit()">
            <lucide-angular [name]="e.excedido ? 'triangle-alert' : e.icono" [size]="19.2" [ngClass]="ICONO"></lucide-angular>
            <span [class]="TEXTO">
              <span class="block text-[.875rem] leading-[1.35] font-semibold">{{ e.nombre }}<lucide-angular name="arrow-right" [size]="14" [strokeWidth]="2.5" [ngClass]="FLECHA"></lucide-angular></span>
              <span [class]="LEYENDA">{{ e.leyenda }}</span>
            </span>
            <span [class]="RELOJ">{{ tiempo(e) }}</span>
          </a>
        }
      </div>
    </div>
  `
})
export class EstadoMenuComponent {
  /** `null` pliega la fila; se sigue pintando el último estado mientras se cierra. */
  @Input() set estado(valor: EstadoMenu | null) {
    this.actual = valor;
    if (valor) {
      this.visto = valor;
    }
  }
  get estado(): EstadoMenu | null {
    return this.actual;
  }
  @Input() plegado = false;
  @Output() navegar = new EventEmitter<void>();

  visto: EstadoMenu | null = null;
  private actual: EstadoMenu | null = null;

  /**
   * Los colores mezclados se calculan en la fila (`--fondo`, `--luz-color`, `--brillo`, `--aro`) y el `::before`
   * solo los usa: una mezcla con variables escrita en una utilidad `before:` se compila sin selector
   * y no llega a aplicarse.
   */
  readonly FILA = "nav-item group/est relative isolate mb-[.5rem] flex w-[15.6875rem] cursor-pointer items-center gap-3 rounded-lg px-3.5 py-[.4375rem] text-left text-[.875rem] whitespace-nowrap text-sidebar-foreground! no-underline! "
    + '[transition:width_.28s_cubic-bezier(.4,0,.2,1),scale_.12s] active:scale-[.98] [--tinte:10%] [--luz-x:1.475rem] data-[plegado]:w-12 data-[plegado]:[--tinte:0%] data-[plegado]:[--luz-x:50%] '
    + '[--fondo:color-mix(in_oklab,var(--f)_var(--tinte),transparent)] [--luz-color:color-mix(in_oklab,var(--f)_26%,transparent)] '
    + 'data-[excedido]:[--fondo:color-mix(in_oklab,var(--nivel-rojo)_13%,transparent)] data-[excedido]:[--brillo:color-mix(in_oklab,var(--nivel-rojo)_26%,transparent)] data-[excedido]:[--aro:color-mix(in_oklab,var(--nivel-rojo)_42%,transparent)] '
    + "before:absolute before:inset-0 before:-z-1 before:rounded-lg before:bg-(--fondo) before:bg-no-repeat before:content-[''] "
    + 'before:[background-image:radial-gradient(circle_at_var(--luz-x)_50%,var(--luz-color)_0,transparent_var(--luz-estado))] '
    + 'before:[transition:inset_.28s_cubic-bezier(.4,0,.2,1),background-color_.3s,--luz-estado_.55s_cubic-bezier(.16,1,.3,1)] '
    + 'hover:before:[--luz-estado:15rem] data-[plegado]:before:inset-[calc(50%-1rem)_.525rem_calc(50%-1rem)_.475rem] '
    + 'data-[excedido]:before:shadow-[inset_0_0_0_1px_var(--aro)] data-[excedido]:before:[background-image:linear-gradient(110deg,transparent_36%,var(--brillo)_50%,transparent_64%)] '
    + 'data-[excedido]:before:[background-size:200%_100%] data-[excedido]:before:[background-position:130%_0] data-[excedido]:before:animate-[cashi-destello_2.6s_ease-in-out_infinite] '
    + 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';
  /**
   * Las clases de un <lucide-angular> van por [ngClass]: las del atributo `class` se copian al <svg>.
   * El icono no cambia al pasar el cursor, como ningún otro icono del menú: responde el fondo, y el
   * trazo más grueso ya significa «pantalla activa». El triángulo de alerta va un píxel más arriba
   * que su caja: su peso está en la base y, centrado a regla, se ve caído.
   */
  readonly ICONO = 'flex-none text-(--c) group-data-[excedido]/est:-translate-y-[.0625rem]';
  readonly FLECHA = 'ml-[.375rem] inline-flex -translate-x-2 align-[-.125rem] text-(--c) opacity-0 [transition:opacity_.15s,translate_.25s_cubic-bezier(.16,1,.3,1)] group-hover/est:translate-x-0 group-hover/est:opacity-100';
  readonly TEXTO = 'min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-[180ms] group-data-[plegado]/est:opacity-0';
  readonly LEYENDA = 'block text-[.75rem] leading-[1.35] font-medium text-muted-foreground tabular-nums transition-colors duration-300 group-data-[excedido]/est:text-(--c)';
  readonly RELOJ = 'flex-none text-[.875rem] font-semibold tabular-nums transition-[opacity,color] duration-[180ms] group-data-[plegado]/est:opacity-0 group-data-[excedido]/est:text-(--c)';

  tiempo(e: EstadoMenu): string {
    const h = Math.floor(e.segundos / 3600), m = Math.floor(e.segundos % 3600 / 60), s = e.segundos % 60;
    const dd = (n: number) => String(n).padStart(2, '0');
    return h ? `${h}:${dd(m)}:${dd(s)}` : `${dd(m)}:${dd(s)}`;
  }
}
