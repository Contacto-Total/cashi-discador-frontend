import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NotificacionSistema } from '../../core/services/notificaciones-sistema.service';
import { FormatService } from '../services/format.service';
import { AppTimePipe } from '../pipes/format.pipes';
import { TipDirective } from './tip.directive';

/** Notificaciones de un mismo día, con su rótulo: «Hoy», «Ayer» o la fecha. */
interface GrupoDia {
  dia: string;
  notificaciones: NotificacionSistema[];
}

/**
 * Notificaciones del sistema, dentro del pie del menú: se despliegan sobre la cuenta, como sus
 * opciones, sin abrir ninguna caja aparte. Van agrupadas por día y la lista se desplaza por dentro
 * al llegar a su tope, para no dejar sin sitio a la lista de pantallas.
 *
 * Solo presenta: la lista llega por entrada y lo que se pide (cerrar, marcar como leída) sale por
 * eventos. Se cierra con su botón, con Escape o al pulsar en cualquier otra parte.
 *
 * La clase cashi-pantalla trae los colores de estado, que solo existen dentro de ella.
 */
@Component({
  selector: 'app-notificaciones-panel',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, AppTimePipe, TipDirective],
  host: { class: 'block' },
  template: `
    <section aria-label="Notificaciones"
             class="cashi-pantalla font-cashi mb-2.5 flex max-h-[min(21rem,40vh)] w-[16.0625rem] animate-[cashi-panel-notis_.2s_ease-out] flex-col border-b border-sidebar-border pb-1.5 text-[.875rem] leading-[1.5] text-sidebar-foreground antialiased motion-reduce:animate-none">
      <header class="flex flex-none items-center gap-1 pb-2 pl-1.5">
        <p role="heading" aria-level="2" class="m-0 flex-1 text-[.875rem] leading-[1.25] font-bold">Notificaciones</p>
        <button *ngIf="sinLeer" type="button" [class]="BOTON_ICONO" aria-label="Marcar todas como leídas"
                appTip="Marcar todas como leídas" appTipLado="arriba" (click)="leerTodas.emit()">
          <lucide-angular name="check-check" [size]="16"></lucide-angular>
        </button>
        <button type="button" [class]="BOTON_ICONO" aria-label="Cerrar notificaciones" (click)="cerrar.emit()">
          <lucide-angular name="x" [size]="16"></lucide-angular>
        </button>
      </header>

      <!-- Sin ninguna notificación no hay nada que filtrar. -->
      <div *ngIf="notificaciones.length" class="flex-none pb-1">
        <div class="grid grid-cols-2 gap-[.1875rem] rounded-lg bg-muted p-[.1875rem]">
          <button type="button" [class]="PESTANA" [ngClass]="filtro === 'sin' ? PESTANA_ACTIVA : PESTANA_REPOSO"
                  [attr.aria-pressed]="filtro === 'sin'" (click)="filtro = 'sin'">Sin leer<ng-container *ngIf="sinLeer"> ({{ sinLeer }})</ng-container></button>
          <button type="button" [class]="PESTANA" [ngClass]="filtro === 'todas' ? PESTANA_ACTIVA : PESTANA_REPOSO"
                  [attr.aria-pressed]="filtro === 'todas'" (click)="filtro = 'todas'">Todas</button>
        </div>
      </div>

      <div class="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto pt-0.5 pb-1">
        <ng-container *ngFor="let grupo of grupos; let primero = first; trackBy: porDia">
          <p class="m-0 mx-1.5 mb-0.5 flex-none text-[.75rem] font-semibold text-muted-foreground" [ngClass]="primero ? 'mt-1' : 'mt-2'">{{ grupo.dia }}</p>
          <!-- Icono suelto, título y hora en la primera línea; el mensaje debajo. El icono solo lleva color si no se leyó. -->
          <button *ngFor="let n of grupo.notificaciones; trackBy: porId" type="button"
                  class="grid w-full flex-none cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2.5 gap-y-px rounded-lg border-0 bg-transparent px-1.5 py-2 text-left text-sidebar-foreground transition-colors duration-150 hover:bg-sidebar-accent/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                  [attr.aria-label]="n.titulo + '. ' + n.mensaje + (n.leida ? '' : ' Sin leer.')" (click)="leer.emit(n)">
            <span class="grid h-[1.3125rem] w-[1.125rem] place-items-center" [ngClass]="n.leida ? 'text-muted-foreground' : color(n.tipo)">
              <lucide-angular [name]="icono(n.tipo)" [size]="16"></lucide-angular>
            </span>
            <span class="text-[.875rem] leading-[1.35]" [ngClass]="n.leida ? 'font-medium text-sidebar-foreground/75' : 'font-semibold'">{{ n.titulo }}</span>
            <time class="mt-px text-[.75rem] font-medium text-muted-foreground tabular-nums">{{ n.fechaCreacion | appTime: false }}</time>
            <span class="col-span-2 col-start-2 text-[.75rem] leading-[1.45] text-muted-foreground">{{ n.mensaje }}</span>
          </button>
        </ng-container>

        <div *ngIf="!grupos.length" class="m-auto flex flex-col items-center gap-1 px-2 pt-2 pb-4 text-center text-muted-foreground">
          <span class="mb-2 grid size-10 place-items-center rounded-full bg-muted">
            <lucide-angular name="bell-off" [size]="18"></lucide-angular>
          </span>
          <span class="text-[.875rem] font-semibold text-sidebar-foreground">{{ notificaciones.length ? 'No hay notificaciones sin leer' : 'Sin notificaciones' }}</span>
          <span class="text-[.75rem]">{{ notificaciones.length ? 'Están en la pestaña Todas.' : 'Las notificaciones nuevas aparecerán aquí.' }}</span>
        </div>
      </div>
    </section>
  `
})
export class NotificacionesPanelComponent {
  @Input() notificaciones: NotificacionSistema[] = [];

  @Output() cerrar = new EventEmitter<void>();
  @Output() leer = new EventEmitter<NotificacionSistema>();
  @Output() leerTodas = new EventEmitter<void>();

  filtro: 'sin' | 'todas' = 'sin';

  readonly BOTON_ICONO = 'relative grid size-7 flex-none cursor-pointer place-items-center rounded-lg border-0 bg-transparent text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring';
  readonly PESTANA = 'font-cashi cursor-pointer rounded-md border-0 px-1.5 py-[.375rem] text-[.8125rem] font-medium transition-colors duration-150';
  readonly PESTANA_ACTIVA = 'bg-(--seg-activo) text-foreground shadow-[0_1px_2px_rgb(0_0_0/.08)]';
  readonly PESTANA_REPOSO = 'bg-transparent text-foreground/60';

  private readonly formato = inject(FormatService);
  private readonly raiz = inject<ElementRef<HTMLElement>>(ElementRef);

  get sinLeer(): number {
    return this.notificaciones.filter(n => !n.leida).length;
  }

  /**
   * Los grupos se arman de nuevo en cada repaso de la vista. Sin estas dos claves, la lista se
   * volvería a crear cada vez y un clic que cayera en medio (se pulsa sobre una fila y se suelta sobre
   * su reemplazo) no llegaría a ninguna.
   */
  readonly porDia = (_: number, grupo: GrupoDia) => grupo.dia;
  readonly porId = (_: number, n: NotificacionSistema) => n.id;

  /** Lo que se ve según la pestaña, agrupado por día y en el orden en que llega (lo más nuevo arriba). */
  get grupos(): GrupoDia[] {
    const visibles = this.filtro === 'sin' ? this.notificaciones.filter(n => !n.leida) : this.notificaciones;
    const grupos: GrupoDia[] = [];
    for (const n of visibles) {
      const dia = this.dia(n.fechaCreacion);
      const ultimo = grupos[grupos.length - 1];
      if (ultimo?.dia === dia) {
        ultimo.notificaciones.push(n);
      } else {
        grupos.push({ dia, notificaciones: [n] });
      }
    }
    return grupos;
  }

  icono(tipo: string): string {
    return tipo === 'ARCHIVADO_MENSUAL' ? 'archive' : tipo === 'ERROR' ? 'alert-circle' : 'bell';
  }

  /** Tinta del icono de una notificación sin leer, según el tipo. */
  color(tipo: string): string {
    return tipo === 'ARCHIVADO_MENSUAL' ? 'text-(--ok)' : tipo === 'ERROR' ? 'text-(--ro)' : 'text-(--info)';
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.cerrar.emit();
  }

  /**
   * Pulsar fuera cierra las notificaciones, y el clic sigue su camino: elegir una pantalla del menú
   * con ellas abiertas las cierra y abre la pantalla. La campana no llega aquí: corta su propio clic.
   */
  @HostListener('document:click', ['$event'])
  alPulsarFuera(ev: Event): void {
    if (!this.raiz.nativeElement.contains(ev.target as Node)) {
      this.cerrar.emit();
    }
  }

  private dia(fecha: string): string {
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) {
      return this.formato.date(fecha);
    }
    const medianoche = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const dias = Math.round((medianoche(new Date()) - medianoche(d)) / 86_400_000);
    return dias === 0 ? 'Hoy' : dias === 1 ? 'Ayer' : this.formato.date(fecha);
  }
}
