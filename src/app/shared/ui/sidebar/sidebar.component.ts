import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MenuItem } from '../../../core/services/menu-permission.service';
import { CashiMascotaComponent } from '../cashi-mascota.component';
import { EstadoMenu, EstadoMenuComponent } from '../estado-menu.component';
import { TipDirective } from '../tip.directive';
import { iconoDeMenu } from '../menu-iconos';
import { SeccionMenu, seccionesDeMenu } from '../menu-secciones';

/** Lo que el pie del menú muestra de la sesión. */
export interface CuentaSidebar {
  usuario: string;
  rol: string;
  anexo: string | null;
  iniciales: string;
}

/**
 * Menú lateral flotante, con las pantallas agrupadas por secciones. Solo presenta: el menú, la cuenta
 * y el estado plegado llegan por entradas, y lo que el usuario pide (plegar, salir, tema,
 * notificaciones) sale por eventos.
 *
 * Al plegar nada cambia de sitio: los iconos se quedan en su columna, el texto se desvanece y el
 * ancho lo recorta. Por eso las filas del pie miden siempre lo mismo.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LucideAngularModule, CashiMascotaComponent, EstadoMenuComponent, TipDirective],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() menu: MenuItem[] = [];
  @Input() cuenta: CuentaSidebar | null = null;
  /** Ve notificaciones, tema, modo mantenimiento y las opciones de la cuenta. */
  @Input() esAdmin = false;
  /** Buscador de pantallas: ADMIN y supervisores. */
  @Input() conBuscador = false;
  @Input() plegado = false;
  @Input() movilAbierto = false;
  @Input() notificaciones = 0;
  @Input() temaOscuro = false;
  /** Estado del asesor, sobre la cuenta. `null` cuando no toca mostrarlo (no es asesor, o ya está en el Panel). */
  @Input() estado: EstadoMenu | null = null;
  /** El asesor ve el interruptor de las alertas de voz. */
  @Input() conVoz = false;
  @Input() vozActiva = false;

  @Output() plegadoChange = new EventEmitter<boolean>();
  @Output() navegar = new EventEmitter<void>();
  @Output() notificacionesAbrir = new EventEmitter<void>();
  @Output() temaCambiar = new EventEmitter<void>();
  @Output() vozCambiar = new EventEmitter<void>();
  @Output() salir = new EventEmitter<void>();

  @ViewChild('campoBuscar') private campoBuscar?: ElementRef<HTMLInputElement>;

  filtro = '';
  secciones: SeccionMenu[] = [];
  cuentaAbierta = false;
  url = '';
  private readonly abiertos = new Set<string>();
  private readonly router = inject(Router);
  private readonly raiz = inject<ElementRef<HTMLElement>>(ElementRef);
  private rutas?: Subscription;
  private rutaAbierta = '';

  /** Fila: la misma para enlaces, grupos y opciones de la cuenta. Las del menú van más bajas. */
  readonly FILA = 'nav-item group/fila relative flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 px-3.5 py-2.5 text-left text-[.875rem] font-medium whitespace-nowrap no-underline! transition-colors duration-150';
  readonly FILA_MENU = 'py-[.4375rem]!';
  readonly FILA_HIJA = 'px-2.5! gap-2.5! py-[.375rem]!';
  readonly FILA_REPOSO = 'bg-transparent text-sidebar-foreground/65! hover:bg-sidebar-accent/60 hover:text-sidebar-foreground!';
  readonly FILA_ACTIVA = "bg-sidebar-accent text-sidebar-foreground! font-semibold! before:absolute before:top-1/2 before:left-0 before:h-5 before:w-[.1875rem] before:-translate-y-1/2 before:rounded-full before:bg-brand before:content-['']";
  /**
   * Las clases de un <lucide-angular> van siempre por [ngClass]: las del atributo `class` la librería
   * las copia también al <svg> de dentro, y posición, giro o color terminan aplicados dos veces.
   *
   * El tono suave del icono va en el color y no en `opacity`: con `opacity` el icono pasa a una capa
   * propia y, dentro de un grupo desplegado (recorte con overflow), hay navegadores que no la dibujan.
   */
  readonly ICONO_REPOSO = 'text-[color-mix(in_srgb,currentColor_80%,transparent)] group-hover/fila:text-current';
  readonly ICONO_ACTIVO = 'text-brand';
  readonly TEXTO = 'min-w-0 flex-1 overflow-hidden whitespace-nowrap transition-opacity duration-[180ms] group-data-[plegado]/sb:opacity-0';
  /** Rótulo de sección. Plegado se vuelve una raya del ancho de una fila. */
  readonly SECCION = "relative m-0 mt-[1.125rem] mb-[.375rem] flex h-4 items-center px-3.5 text-[.75rem] font-semibold whitespace-nowrap text-muted-foreground first:mt-[.125rem] "
    + "after:absolute after:inset-x-0 after:top-1/2 after:border-t after:border-transparent after:transition-[border-color] after:duration-[180ms] after:content-[''] group-data-[plegado]/sb:after:border-sidebar-border";
  /** Con buscador, la raya de la primera sección la pone el buscador, fija bajo la lupa. */
  readonly SECCION_BAJO_LUPA = 'group-data-[plegado]/sb:first:mt-0 group-data-[plegado]/sb:first:h-2 group-data-[plegado]/sb:first:overflow-hidden group-data-[plegado]/sb:first:after:hidden';
  readonly BOTON_ICONO = 'relative grid size-7 flex-none cursor-pointer place-items-center rounded-lg border-0 bg-transparent transition-colors duration-150';
  readonly BOTON_ICONO_NEUTRO = 'text-muted-foreground hover:bg-muted hover:text-foreground';
  readonly BOTON_ICONO_SALIR = 'text-danger hover:bg-danger/12 hover:text-danger-strong';

  ngOnInit(): void {
    this.url = this.router.url;
    this.abrirGrupoDeLaRuta();
    this.rutas = this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.url = this.router.url;
      this.abrirGrupoDeLaRuta();
    });
  }

  /** El estado del asesor cambia cada segundo: las secciones solo se rehacen si cambió el menú. */
  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios['menu']) {
      this.secciones = seccionesDeMenu(this.menu);
      this.abrirGrupoDeLaRuta();
    }
    if (!this.esAdmin) {
      this.cuentaAbierta = false;
    }
  }

  ngOnDestroy(): void {
    this.rutas?.unsubscribe();
  }

  icono(item: MenuItem): string {
    return iconoDeMenu(item.codigo, item.icono);
  }

  esGrupo(item: MenuItem): boolean {
    return item.tipo === 'DROPDOWN' && item.children?.length > 0;
  }

  activa(ruta: string | null | undefined): boolean {
    return !!ruta && this.url.startsWith(ruta);
  }

  /** El grupo contiene la pantalla actual. */
  dentro(item: MenuItem): boolean {
    return (item.children ?? []).some(h => this.activa(h.ruta));
  }

  abierto(item: MenuItem): boolean {
    return this.abiertos.has(item.codigo);
  }

  alternarGrupo(item: MenuItem): void {
    if (this.plegado) {
      this.plegadoChange.emit(false);
      this.abiertos.add(item.codigo);
      return;
    }
    if (!this.abiertos.delete(item.codigo)) {
      this.abiertos.add(item.codigo);
    }
  }

  /** Al escribir, los grupos se aplanan y se ve el resultado directo. */
  get resultados(): MenuItem[] | null {
    const q = this.filtro.trim().toLowerCase();
    if (!q) {
      return null;
    }
    const planos: MenuItem[] = [];
    const recorrer = (lista: MenuItem[]) => lista.forEach(i => {
      if (!this.esGrupo(i) && i.ruta && i.etiqueta.toLowerCase().includes(q)) {
        planos.push(i);
      }
      recorrer(i.children ?? []);
    });
    recorrer(this.menu);
    return planos;
  }

  alternarPlegado(): void {
    this.cuentaAbierta = false;
    this.plegadoChange.emit(!this.plegado);
  }

  /** Plegado, el buscador es una lupa: abre el menú y deja el cursor en el campo. */
  abrirBuscador(): void {
    this.plegadoChange.emit(false);
    setTimeout(() => this.campoBuscar?.nativeElement.focus(), 300);
  }

  /** Ctrl K (o ⌘ K) lleva al buscador desde cualquier pantalla. */
  @HostListener('document:keydown', ['$event'])
  alAtajo(ev: KeyboardEvent): void {
    if (!this.conBuscador || !(ev.ctrlKey || ev.metaKey) || ev.key.toLowerCase() !== 'k') {
      return;
    }
    ev.preventDefault();
    if (this.plegado) {
      this.abrirBuscador();
    } else {
      this.campoBuscar?.nativeElement.focus();
    }
  }

  alternarCuenta(): void {
    if (this.esAdmin) {
      this.cuentaAbierta = !this.cuentaAbierta;
    }
  }

  alNavegar(): void {
    this.cuentaAbierta = false;
    this.filtro = '';
    this.navegar.emit();
  }

  @HostListener('document:click', ['$event'])
  alPulsarFuera(ev: Event): void {
    if (this.cuentaAbierta && !this.raiz.nativeElement.querySelector('[data-cuenta]')?.contains(ev.target as Node)) {
      this.cuentaAbierta = false;
    }
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.cuentaAbierta = false;
  }

  /** Abre el grupo de la pantalla actual, una vez por ruta: si el usuario lo cierra, se queda cerrado. */
  private abrirGrupoDeLaRuta(): void {
    const marca = `${this.url}|${this.menu.length}`;
    if (marca === this.rutaAbierta) {
      return;
    }
    this.rutaAbierta = marca;
    this.menu.filter(i => this.esGrupo(i) && this.dentro(i)).forEach(i => this.abiertos.add(i.codigo));
  }
}
