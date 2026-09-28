import { ChangeDetectionStrategy, Component, ElementRef, OnInit, afterNextRender, computed, inject, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComisionesService } from '../services/comisiones.service';
import { Cartera, Inquilino, ReportePeriodo, Subcartera, TipoMetrica } from '../models/comision.model';
import { MESES, METRICA_INFO, mensajeError, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Panel lateral para crear un período de comisiones.
 * La meta no se escribe: sale de la meta INTERNA del reporte de producción.
 * Lo demás se copia de la configuración de la subcartera o, si no tiene, de su período anterior.
 */
@Component({
  selector: 'cmx-crear-periodo-panel',
  standalone: true,
  imports: [FormsModule, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'salir()' },
  template: `
    <div class="cmx-scrim" [class.is-closing]="cerrando()" (click)="salir()"></div>
    <section class="cmx-drawer" [class.is-closing]="cerrando()" role="dialog" aria-modal="true" aria-labelledby="cmx-crear-nm">
      <div class="cmx-dh">
        <div>
          <div class="cmx-eyebrow">Nuevo período</div>
          <div id="cmx-crear-nm" class="cmx-nm">Abrir comisiones de una subcartera</div>
          <div class="cmx-mt">
            La meta sale de la meta interna del reporte de producción. Lo demás se copia de la configuración de la
            subcartera o, si no tiene, de su período anterior.
          </div>
        </div>
        <button type="button" class="cmx-icon-btn" (click)="salir()" aria-label="Cerrar" #cerrarBtn>
          <cmx-icon name="x" [size]="17" />
        </button>
      </div>

      <form class="cmx-db" style="display:grid;gap:16px;align-content:start" (ngSubmit)="crear()" id="cmx-form-crear">
        <div class="cmx-grid2 cmx-enter">
          <div class="cmx-field">
            <label for="cmx-n-mes">Mes</label>
            <select id="cmx-n-mes" name="mes" [ngModel]="mes()" (ngModelChange)="mes.set($event)">
              @for (m of meses; track $index) { <option [ngValue]="$index + 1">{{ m }}</option> }
            </select>
          </div>
          <div class="cmx-field">
            <label for="cmx-n-anio">Año</label>
            <input id="cmx-n-anio" class="cmx-num" type="number" name="anio" min="2024" max="2100"
                   [ngModel]="anio()" (ngModelChange)="anio.set(+$event)" />
          </div>
        </div>

        <div class="cmx-field cmx-enter" style="--i:1">
          <label for="cmx-n-prov">Proveedor</label>
          <select id="cmx-n-prov" name="inquilino" [ngModel]="idInquilino()" (ngModelChange)="elegirInquilino($event)">
            <option [ngValue]="null">Elige un proveedor</option>
            @for (i of inquilinos(); track i.id) { <option [ngValue]="i.id">{{ i.nombreInquilino }}</option> }
          </select>
        </div>

        <div class="cmx-grid2 cmx-enter" style="--i:2">
          <div class="cmx-field">
            <label for="cmx-n-car">Cartera</label>
            <select id="cmx-n-car" name="cartera" [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)" [disabled]="!carteras().length">
              <option [ngValue]="null">{{ idInquilino() ? 'Elige una cartera' : 'Primero el proveedor' }}</option>
              @for (c of carteras(); track c.id) { <option [ngValue]="c.id">{{ c.nombreCartera }}</option> }
            </select>
          </div>
          <div class="cmx-field">
            <label for="cmx-n-sub">Subcartera</label>
            <select id="cmx-n-sub" name="subcartera" [ngModel]="idSubcartera()" (ngModelChange)="elegirSubcartera($event)" [disabled]="!subcarteras().length">
              <option [ngValue]="null">{{ idCartera() ? 'Elige una subcartera' : 'Primero la cartera' }}</option>
              @for (s of subcarteras(); track s.id) {
                <option [ngValue]="s.id" [disabled]="yaExiste(s.id)">{{ s.nombreSubcartera }}{{ yaExiste(s.id) ? ' · ya tiene período' : '' }}</option>
              }
            </select>
          </div>
        </div>

        <div class="cmx-enter" style="--i:3">
          <div class="cmx-field"><span class="cmx-field-l" id="cmx-n-met">Se mide por</span></div>
          <div class="cmx-grid2" style="margin-top:6px" role="radiogroup" aria-labelledby="cmx-n-met">
            @for (t of metricas; track t) {
              <button type="button" class="cmx-metric" role="radio" [attr.aria-checked]="tipo() === t" (click)="tipo.set(t)">
                <b>{{ metricaInfo[t].etiqueta }}</b>
                <span>{{ metricaInfo[t].descripcion }}</span>
              </button>
            }
          </div>
          <p class="cmx-mt" style="margin-top:6px">T3 se mide por contención; Castigo, Propia y T5 por recaudo.</p>
        </div>

        @if (origen(); as o) {
          <div class="cmx-rule is-info cmx-enter" style="margin:0">
            <div class="cmx-rule-head"><span class="cmx-rule-title">{{ o.titulo }}</span></div>
            <div class="cmx-rule-desc">{{ o.detalle }}</div>
          </div>
        }

        @if (error()) {
          <div class="cmx-warnbox" role="alert" style="margin:0">{{ error() }}</div>
        }
      </form>

      <div class="cmx-df">
        <button type="button" class="cmx-btn cmx-btn-sec" (click)="salir()">Cancelar</button>
        <button type="submit" form="cmx-form-crear" class="cmx-btn cmx-btn-act" [disabled]="!valido() || guardando()">
          @if (guardando()) { <cmx-icon name="refresh" [size]="15" class="cmx-spin" /> Creando… }
          @else { <cmx-icon name="plus" [size]="15" /> Crear período de {{ nombreMes(mes()).toLowerCase() }} }
        </button>
      </div>
    </section>
  `
})
export class CrearPeriodoPanelComponent implements OnInit {
  private readonly service = inject(ComisionesService);

  /** Mes y año con que se abre el panel (el que se está viendo) */
  readonly anioInicial = input.required<number>();
  readonly mesInicial = input.required<number>();
  /** Subcarteras que ya tienen período en el mes visto */
  readonly subcarterasConPeriodo = input<number[]>([]);

  readonly cerrar = output<void>();
  readonly creado = output<ReportePeriodo>();

  readonly meses = MESES;
  readonly metricas: TipoMetrica[] = ['RECAUDO', 'CONTENCION'];
  readonly metricaInfo = METRICA_INFO;
  readonly nombreMes = nombreMes;

  readonly anio = signal(new Date().getFullYear());
  readonly mes = signal(new Date().getMonth() + 1);
  readonly inquilinos = signal<Inquilino[]>([]);
  readonly carteras = signal<Cartera[]>([]);
  readonly subcarteras = signal<Subcartera[]>([]);
  readonly idInquilino = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly tipo = signal<TipoMetrica>('RECAUDO');
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);
  readonly cerrando = signal(false);
  /** De dónde se copiará la configuración del período nuevo */
  readonly origen = signal<{ titulo: string; detalle: string } | null>(null);

  private readonly cerrarBtn = viewChild<ElementRef<HTMLButtonElement>>('cerrarBtn');

  readonly valido = computed(() =>
    this.idSubcartera() != null && this.mes() >= 1 && this.mes() <= 12 && this.anio() >= 2024
  );

  constructor() {
    afterNextRender(() => this.cerrarBtn()?.nativeElement.focus());
  }

  ngOnInit(): void {
    this.anio.set(this.anioInicial());
    this.mes.set(this.mesInicial());
    this.service.obtenerInquilinos().subscribe({
      next: data => this.inquilinos.set(data),
      error: e => this.error.set(mensajeError(e, 'No se pudieron cargar los proveedores.'))
    });
  }

  yaExiste(idSubcartera: number): boolean {
    return this.anio() === this.anioInicial() && this.mes() === this.mesInicial()
      && this.subcarterasConPeriodo().includes(idSubcartera);
  }

  elegirInquilino(id: number | null): void {
    this.idInquilino.set(id);
    this.idCartera.set(null);
    this.elegirSubcartera(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    if (id != null) {
      this.service.obtenerCarteras(id).subscribe({
        next: data => this.carteras.set(data),
        error: e => this.error.set(mensajeError(e, 'No se pudieron cargar las carteras.'))
      });
    }
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.elegirSubcartera(null);
    this.subcarteras.set([]);
    if (id != null) {
      this.service.obtenerSubcarteras(id).subscribe({
        next: data => this.subcarteras.set(data),
        error: e => this.error.set(mensajeError(e, 'No se pudieron cargar las subcarteras.'))
      });
    }
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.origen.set(null);
    if (id == null) {
      return;
    }
    this.service.obtenerPlantilla(id).subscribe({
      next: pl => {
        if (this.idSubcartera() !== id) {
          return;
        }
        this.tipo.set(pl.tipoMetrica);
        if (pl.existe) {
          this.origen.set({
            titulo: 'Tiene configuración de subcartera',
            detalle: 'Se copian su métrica, roles, tramos, división de la meta y usuarios excluidos.'
          });
        } else if (pl.periodos.length) {
          const ultimo = pl.periodos[0];
          this.origen.set({
            titulo: 'Sin configuración de subcartera',
            detalle: `Se copia lo de ${nombreMes(ultimo.mes).toLowerCase()} ${ultimo.anio}, su último período.`
          });
        } else {
          this.origen.set({
            titulo: 'Primer período de la subcartera',
            detalle: 'No hay nada que copiar: después elige roles y tramos, o arma antes la configuración de la subcartera.'
          });
        }
      }
    });
  }

  crear(): void {
    const idSubcartera = this.idSubcartera();
    if (!this.valido() || idSubcartera == null || this.guardando()) {
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    this.service.crearPeriodo({
      idSubcartera,
      anio: this.anio(),
      mes: this.mes(),
      tipoMetrica: this.tipo()
    }).subscribe({
      next: reporte => {
        this.guardando.set(false);
        this.creado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.error.set(mensajeError(e, 'No se pudo crear el período.'));
      }
    });
  }

  /** Sale con la animación del panel y luego avisa */
  salir(): void {
    if (this.cerrando() || this.guardando()) {
      return;
    }
    this.cerrando.set(true);
    setTimeout(() => this.cerrar.emit(), 340);
  }
}
