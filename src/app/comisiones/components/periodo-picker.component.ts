import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core';
import { ComisionesService } from '../services/comisiones.service';
import { GrupoComision, MesPeriodo } from '../models/comision.model';
import { ESTADO_VISTA_INFO, EstadoVista, codigoPeriodo, estadoVista, mensajeError, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Selector de período: el bloque "Periodo 2026-09" abre una grilla con los 12 meses del año
 * (como un calendario, pero por meses) y el estado de cada uno en la subcartera elegida.
 * Los meses que todavía no empiezan no se pueden elegir.
 */
@Component({
  selector: 'cmx-periodo-picker',
  standalone: true,
  imports: [CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-ppick">
      <button type="button" class="cmx-pbtn" (click)="alternar()" aria-haspopup="dialog" [attr.aria-expanded]="abierto()"
              [attr.aria-label]="'Periodo ' + codigo() + ', ' + nombreMes(mes()) + ' ' + anio() + '. Cambiar'">
        <span class="cmx-pbtn-l">Periodo</span>
        <span class="cmx-pbtn-v"><span class="cmx-mdot" [class]="'cmx-mdot ' + puntoActual()" aria-hidden="true"></span>{{ codigo() }}</span>
        <span class="cmx-pbtn-cv"><cmx-icon name="chevron-down" [size]="16" /></span>
      </button>

      @if (abierto()) {
        <div class="cmx-pop" role="dialog" aria-label="Elegir periodo">
          <div class="cmx-pop-yh">
            <button type="button" (click)="moverAnio(-1)" aria-label="Año anterior"><cmx-icon name="chevron-left" [size]="15" /></button>
            <b>{{ anioVista() }}</b>
            <button type="button" (click)="moverAnio(1)" [disabled]="anioVista() >= anioHoy" aria-label="Año siguiente">
              <cmx-icon name="chevron-right" [size]="15" />
            </button>
          </div>
          @if (error()) {
            <p class="cmx-pop-err">{{ error() }}</p>
          }
          <div class="cmx-pgrid">
            @for (m of celdas(); track m.mes) {
              <button type="button" [disabled]="m.futuro" [attr.aria-current]="m.actual"
                      [attr.title]="nombreMes(m.mes) + ' ' + m.anio" (click)="elegir(m.anio, m.mes)">
                <span class="cmx-pgrid-c">{{ m.codigo }}</span>
                <span class="cmx-pgrid-s">
                  @if (m.futuro) {
                    Aún no
                  } @else if (cargando()) {
                    …
                  } @else {
                    <span [class]="'cmx-mdot ' + m.punto" aria-hidden="true"></span>{{ m.etiqueta }}
                  }
                </span>
              </button>
            }
          </div>
          <div class="cmx-pop-f">
            <span><span class="cmx-mdot is-ab"></span>Abierto</span>
            <span><span class="cmx-mdot is-ce"></span>Cerrado</span>
            <span><span class="cmx-mdot is-no"></span>Sin configurar</span>
          </div>
        </div>
      }
    </div>
  `
})
export class PeriodoPickerComponent {
  private readonly service = inject(ComisionesService);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly idSubcartera = input<number | null>(null);
  /** Cartera de Tramo Propio; null en las demás subcarteras */
  readonly grupo = input<GrupoComision | null>(null);
  readonly anio = input.required<number>();
  readonly mes = input.required<number>();
  readonly estadoActual = input<EstadoVista>('SIN_PAGOS');

  readonly cambiar = output<{ anio: number; mes: number }>();

  readonly nombreMes = nombreMes;
  readonly anioHoy = new Date().getFullYear();

  readonly abierto = signal(false);
  readonly anioVista = signal(this.anioHoy);
  readonly meses = signal<MesPeriodo[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  readonly codigo = computed(() => codigoPeriodo(this.anio(), this.mes()));
  readonly puntoActual = computed(() => ESTADO_VISTA_INFO[this.estadoActual()].punto);

  readonly celdas = computed(() => {
    const hoy = new Date();
    const claveHoy = hoy.getFullYear() * 12 + hoy.getMonth() + 1;
    const anio = this.anioVista();
    const porMes = new Map(this.meses().filter(m => m.anio === anio).map(m => [m.mes, m]));
    return Array.from({ length: 12 }, (_, i) => {
      const mes = i + 1;
      const m = porMes.get(mes);
      const ev = estadoVista(m?.estado ?? null, m?.pagos ?? 0);
      return {
        anio,
        mes,
        codigo: codigoPeriodo(anio, mes),
        futuro: anio * 12 + mes > claveHoy,
        actual: anio === this.anio() && mes === this.mes(),
        etiqueta: ESTADO_VISTA_INFO[ev].etiqueta,
        punto: ESTADO_VISTA_INFO[ev].punto
      };
    });
  });

  @HostListener('document:click', ['$event'])
  alHacerClic(evento: MouseEvent): void {
    if (this.abierto() && !this.host.nativeElement.contains(evento.target as Node)) {
      this.abierto.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    this.abierto.set(false);
  }

  alternar(): void {
    if (this.abierto()) {
      this.abierto.set(false);
      return;
    }
    this.anioVista.set(this.anio());
    this.abierto.set(true);
    this.cargar();
  }

  moverAnio(delta: number): void {
    this.anioVista.update(a => a + delta);
    this.cargar();
  }

  elegir(anio: number, mes: number): void {
    this.abierto.set(false);
    if (anio !== this.anio() || mes !== this.mes()) {
      this.cambiar.emit({ anio, mes });
    }
  }

  private cargar(): void {
    const id = this.idSubcartera();
    if (id == null) {
      this.meses.set([]);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.service.listarMeses(id, this.anioVista(), this.grupo()).subscribe({
      next: meses => {
        this.meses.set(meses);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'No se pudo cargar el estado de los meses.'));
      }
    });
  }
}
