import { ChangeDetectionStrategy, Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { AppDatePipe, AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { DetalleComision, EscalaComision, ReportePeriodo } from '../models/comision.model';
import { DiaDetalle, METRICA_INFO, agruparPorDia, mensajeError, montoDetalle, tramosDe } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/** Clave del selector: id de resultado de un asesor, o toda la subcartera */
type Quien = number | 'SUBCARTERA';

interface LineaTramo {
  y: number;
  etiqueta: string;
  alcanzado: boolean;
}

const ANCHO = 760;
const ALTO = 230;
const M = { izq: 64, der: 118, arr: 14, aba: 26 };

/**
 * Detalle pago a pago (comision_detalle) agrupado por día: cómo fue sumando cada asesor
 * (o la subcartera completa, que es lo que mide al supervisor) y en qué día pasó cada tramo.
 */
@Component({
  selector: 'cmx-detalle-tab',
  standalone: true,
  imports: [AppNumberPipe, AppDatePipe, AppDateTimePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-body">
      <div class="cmx-main is-full">
        @if (!periodo().fechaCalculo) {
          <div class="cmx-empty">
            <span class="cmx-empty-mark"><cmx-icon name="calendar" [size]="20" /></span>
            <b>El detalle aparece cuando el período tiene cálculo</b>
            <p style="max-width:48ch">Cada cálculo guarda los pagos que suman a cada asesor con lo que lleva acumulado.</p>
          </div>
        } @else if (cargando()) {
          <div style="display:grid;gap:10px">
            <div class="cmx-skel" style="height:34px;width:60%"></div>
            <div class="cmx-skel" style="height:230px"></div>
            <div class="cmx-skel" style="height:180px"></div>
          </div>
        } @else if (error()) {
          <div class="cmx-empty">
            <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
            <b>No se pudo cargar el detalle</b>
            <p>{{ error() }}</p>
            <button type="button" class="cmx-btn cmx-btn-sec" (click)="cargar()">Reintentar</button>
          </div>
        } @else {
          <div class="cmx-who cmx-enter" role="group" aria-label="De quién es el detalle">
            @for (o of opciones(); track o.clave) {
              <button type="button" [attr.aria-pressed]="quien() === o.clave" (click)="elegir(o.clave)">{{ o.etiqueta }}</button>
            }
          </div>

          <div class="cmx-kpis cmx-enter" style="--i:1">
            <div class="cmx-kpi">
              <div class="cmx-kpi-l">{{ metrica().logrado }} acumulado</div>
              <div class="cmx-kpi-v"><small>S/</small>{{ ultimo()?.acumulado ?? 0 | appNumber:'1.2-2' }}</div>
              <div class="cmx-kpi-d">{{ pagos() }} {{ pagos() === 1 ? 'pago' : 'pagos' }} en {{ dias().length }} {{ dias().length === 1 ? 'día' : 'días' }}</div>
            </div>
            <div class="cmx-kpi">
              <div class="cmx-kpi-l">Cumplimiento</div>
              <div class="cmx-kpi-v">{{ ultimo()?.porcentaje != null ? (ultimo()!.porcentaje | appNumber:'1.1-1') + ' %' : '—' }}</div>
              <div class="cmx-kpi-d">Contra {{ esSubcartera() ? 'la meta completa' : 'la meta por asesor' }}</div>
            </div>
            <div class="cmx-kpi">
              <div class="cmx-kpi-l">Comisión alcanzada</div>
              <div class="cmx-kpi-v"><small>S/</small>{{ ultimo()?.comision ?? 0 | appNumber:'1.2-2' }}</div>
              <div class="cmx-kpi-d">Tabla del {{ esSubcartera() ? 'supervisor' : 'asesor' }}</div>
            </div>
            <div class="cmx-kpi">
              <div class="cmx-kpi-l">{{ esSubcartera() ? 'Meta de la subcartera' : 'Meta por asesor' }}</div>
              <div class="cmx-kpi-v">@if (base() != null) { <small>S/</small>{{ base() | appNumber:'1.2-2' }} } @else { — }</div>
            </div>
          </div>

          @if (!dias().length) {
            <div class="cmx-block cmx-enter" style="--i:2">
              <div class="cmx-empty">
                <span class="cmx-empty-mark"><cmx-icon name="receipt" [size]="20" /></span>
                <b>Sin pagos que sumen todavía</b>
                <p style="max-width:48ch">
                  {{ periodo().tipoMetrica === 'CONTENCION' ? 'En T3 solo suman los pagos de clientes CONTENIDO.' : 'Aún no hay pagos conciliados de sus gestiones en el mes.' }}
                </p>
              </div>
            </div>
          } @else {
            <!-- Gráfico -->
            <section class="cmx-block cmx-enter" style="--i:2" aria-labelledby="cmx-det-graf">
              <div class="cmx-block-head">
                <h3 id="cmx-det-graf" class="cmx-block-title">Cómo fue sumando en el mes</h3>
                <span class="cmx-block-desc">las líneas punteadas son los tramos en soles; en verde los que ya alcanzó</span>
              </div>
              <div class="cmx-block-body">
                <svg class="cmx-chart" [attr.viewBox]="'0 0 ' + ancho + ' ' + alto" role="img"
                     [attr.aria-label]="'Acumulado por día: llega a S/ ' + (ultimo()?.acumulado ?? 0) + ' el ' + (ultimo()?.fecha ?? '')">
                  @for (g of grilla(); track g.y) {
                    <line class="cmx-ch-grid" [attr.x1]="m.izq" [attr.x2]="ancho - m.der" [attr.y1]="g.y" [attr.y2]="g.y" />
                    <text class="cmx-ch-axis" [attr.x]="m.izq - 8" [attr.y]="g.y + 3" text-anchor="end">{{ g.etiqueta }}</text>
                  }
                  @for (t of lineasTramo(); track t.y) {
                    <line class="cmx-ch-tramo" [class.is-hit]="t.alcanzado" [attr.x1]="m.izq" [attr.x2]="ancho - m.der" [attr.y1]="t.y" [attr.y2]="t.y" />
                    <text class="cmx-ch-label" [class.is-hit]="t.alcanzado" [attr.x]="ancho - m.der + 6" [attr.y]="t.y + 3">{{ t.etiqueta }}</text>
                  }
                  @for (d of ejeDias(); track d.x) {
                    <text class="cmx-ch-axis" [attr.x]="d.x" [attr.y]="alto - 8" text-anchor="middle">{{ d.dia }}</text>
                  }
                  <path class="cmx-ch-area" [attr.d]="trazo().area" />
                  <path class="cmx-ch-line" [attr.d]="trazo().linea" />
                  @for (p of trazo().puntos; track p.x) {
                    <circle class="cmx-ch-dot" [attr.cx]="p.x" [attr.cy]="p.y" r="3"><title>{{ p.titulo }}</title></circle>
                  }
                </svg>
              </div>
            </section>

            <!-- Tabla por día -->
            <section class="cmx-block cmx-enter" style="--i:3" aria-labelledby="cmx-det-tabla">
              <div class="cmx-block-head">
                <h3 id="cmx-det-tabla" class="cmx-block-title">Por día</h3>
                <span class="cmx-block-desc">haz clic en un día para ver sus pagos, la gestión y la cuota de donde vienen</span>
                <span class="cmx-block-extra">{{ dias().length }} {{ dias().length === 1 ? 'día' : 'días' }}</span>
              </div>
              <div class="cmx-tw">
                <table class="cmx-table">
                  <thead>
                    <tr>
                      <th scope="col"><span class="sr-only">Abrir</span></th>
                      <th scope="col">Fecha banco</th>
                      <th scope="col" class="n">Pagos</th>
                      <th scope="col" class="n">{{ metrica().logrado }} del día</th>
                      <th scope="col" class="n">Acumulado</th>
                      <th scope="col" class="n">% acumulado</th>
                      <th scope="col" class="n">Comisión alcanzada</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (d of dias(); track d.fecha) {
                      <tr class="is-click" [class.is-open]="abiertos().has(d.fecha)" tabindex="0"
                          [attr.aria-expanded]="abiertos().has(d.fecha)"
                          (click)="alternar(d.fecha)" (keydown.enter)="alternar(d.fecha)">
                        <td style="width:34px"><span class="cmx-chev" [class.is-open]="abiertos().has(d.fecha)"><cmx-icon name="chevron-right" [size]="15" /></span></td>
                        <td class="cmx-num">{{ d.fecha | appDate }}</td>
                        <td class="n">{{ d.pagos.length }}</td>
                        <td class="n">{{ d.recaudo | appNumber:'1.2-2' }}</td>
                        <td class="n">{{ d.acumulado | appNumber:'1.2-2' }}</td>
                        <td class="n">{{ d.porcentaje != null ? (d.porcentaje | appNumber:'1.2-2') + ' %' : '—' }}</td>
                        <td class="n tot" [class.is-good]="subio(d)">
                          {{ d.comision | appNumber:'1.2-2' }}
                          @if (subio(d)) { <span class="cmx-tag cmx-tag-d" style="margin-left:6px">sube</span> }
                        </td>
                      </tr>
                      @if (abiertos().has(d.fecha)) {
                        @for (p of d.pagos; track p.conciliacionId) {
                          <tr class="is-sub">
                            <td></td>
                            <td colspan="2">
                              @if (esSubcartera()) { <b>{{ p.nombreAsesor }}</b> · }
                              Gestión <span class="cmx-num">{{ p.idGestion }}</span> del {{ p.fechaGestion | appDateTime }}
                              <span class="cmx-role">Cuota {{ p.numeroCuota }} · vence {{ p.fechaVencimientoCuota | appDate }}</span>
                            </td>
                            <td class="n">{{ monto(p) | appNumber:'1.2-2' }}</td>
                            <td colspan="3" class="is-soft">
                              Conciliación aprobada el {{ p.fechaAprobacionConciliacion | appDateTime }}
                            </td>
                          </tr>
                        }
                      }
                    }
                  </tbody>
                </table>
              </div>
            </section>
          }
        }
      </div>
    </div>
  `
})
export class DetalleTabComponent {
  private readonly service = inject(ComisionesService);

  readonly reporte = input.required<ReportePeriodo>();

  readonly ancho = ANCHO;
  readonly alto = ALTO;
  readonly m = M;

  readonly filas = signal<DetalleComision[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly quien = signal<Quien | null>(null);
  readonly abiertos = signal(new Set<string>());

  readonly periodo = computed(() => this.reporte().periodo);
  readonly metrica = computed(() => METRICA_INFO[this.periodo().tipoMetrica]);
  readonly esSubcartera = computed(() => this.quien() === 'SUBCARTERA');

  readonly opciones = computed(() => {
    const asesores = this.reporte().participantes
      .filter(p => p.rol === 'ASESOR' && !p.quitado)
      .map(p => ({ clave: p.idResultado as Quien, etiqueta: p.nombre }));
    return [...asesores, { clave: 'SUBCARTERA' as Quien, etiqueta: 'Toda la subcartera (supervisor)' }];
  });

  private readonly tramos = computed<EscalaComision[]>(() =>
    tramosDe(this.periodo().escalas, this.esSubcartera() ? 'SUPERVISOR' : 'ASESOR'));

  /** Base del porcentaje: meta completa para la subcartera, meta por asesor para un asesor */
  readonly base = computed<number | null>(() => {
    if (this.esSubcartera()) {
      return this.periodo().metaGrupal;
    }
    const q = this.quien();
    const fila = this.filas().find(f => f.idResultado === q);
    if (fila?.metaAsesor != null) {
      return fila.metaAsesor;
    }
    const p = this.reporte().participantes.find(x => x.idResultado === q);
    return p?.metaIndividual ?? null;
  });

  readonly dias = computed<DiaDetalle[]>(() => {
    const q = this.quien();
    if (q == null) {
      return [];
    }
    if (q === 'SUBCARTERA') {
      return agruparPorDia(this.filas(), this.base(), this.tramos());
    }
    return agruparPorDia(this.filas().filter(f => f.idResultado === q), this.base(), null);
  });

  readonly ultimo = computed(() => {
    const d = this.dias();
    return d.length ? d[d.length - 1] : null;
  });
  readonly pagos = computed(() => this.dias().reduce((s, d) => s + d.pagos.length, 0));

  // ---------- Gráfico ----------
  private readonly diasMes = computed(() => new Date(this.periodo().anio, this.periodo().mes, 0).getDate());

  /** Tope del eje: lo acumulado o el siguiente tramo, lo que sea mayor, con aire arriba */
  private readonly maxY = computed(() => {
    const base = this.base() ?? 0;
    const acumulado = this.ultimo()?.acumulado ?? 0;
    const siguiente = this.tramos().find(t => t.porcentajeDesde / 100 * base > acumulado);
    const tope = Math.max(acumulado, siguiente ? siguiente.porcentajeDesde / 100 * base : 0, 1);
    return tope * 1.12;
  });

  private x(dia: number): number {
    const ancho = ANCHO - M.izq - M.der;
    return M.izq + (dia - 1) / Math.max(this.diasMes() - 1, 1) * ancho;
  }

  private y(valor: number): number {
    const alto = ALTO - M.arr - M.aba;
    return M.arr + alto - (valor / this.maxY()) * alto;
  }

  readonly grilla = computed(() => {
    const max = this.maxY();
    return [0, 0.25, 0.5, 0.75, 1].map(f => ({
      y: this.y(max * f / 1.12),
      etiqueta: this.corto(max * f / 1.12)
    }));
  });

  readonly lineasTramo = computed<LineaTramo[]>(() => {
    const base = this.base();
    if (base == null) {
      return [];
    }
    const acumulado = this.ultimo()?.acumulado ?? 0;
    return this.tramos()
      .filter(t => t.porcentajeDesde > 0 && t.porcentajeDesde / 100 * base <= this.maxY())
      .map(t => ({
        y: this.y(t.porcentajeDesde / 100 * base),
        etiqueta: `${t.porcentajeDesde} % · S/ ${t.montoComision}`,
        alcanzado: acumulado * 100 >= t.porcentajeDesde * base
      }));
  });

  readonly ejeDias = computed(() => {
    const n = this.diasMes();
    return [1, 5, 10, 15, 20, 25, n].filter((d, i, a) => d <= n && a.indexOf(d) === i).map(d => ({ dia: d, x: this.x(d) }));
  });

  readonly trazo = computed(() => {
    const puntos: { x: number; y: number; titulo: string }[] = [];
    let linea = `M ${this.x(1)} ${this.y(0)}`;
    let anterior = 0;
    for (const d of this.dias()) {
      const dia = Number(d.fecha.slice(8, 10));
      const x = this.x(dia);
      linea += ` L ${x} ${this.y(anterior)} L ${x} ${this.y(d.acumulado)}`;
      anterior = d.acumulado;
      puntos.push({ x, y: this.y(d.acumulado), titulo: `Día ${dia}: S/ ${d.acumulado.toFixed(2)}` });
    }
    const ultimoX = puntos.length ? puntos[puntos.length - 1].x : this.x(1);
    const area = `${linea} L ${ultimoX} ${this.y(0)} Z`;
    return { linea, area, puntos };
  });

  constructor() {
    // Recarga cuando cambia el período o su cálculo
    effect(() => {
      const periodo = this.periodo();
      const clave = `${periodo.id}|${periodo.fechaCalculo}`;
      untracked(() => {
        if (clave !== this.ultimaClave) {
          this.ultimaClave = clave;
          this.cargar();
        }
      });
    });
  }

  private ultimaClave = '';

  cargar(): void {
    const periodo = this.periodo();
    if (!periodo.fechaCalculo) {
      this.filas.set([]);
      return;
    }
    this.cargando.set(true);
    this.error.set(null);
    this.service.obtenerDetalle(periodo.id).subscribe({
      next: filas => {
        this.filas.set(filas);
        this.cargando.set(false);
        const q = this.quien();
        if (q == null || !this.opciones().some(o => o.clave === q)) {
          this.quien.set(this.opciones()[0]?.clave ?? null);
        }
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'));
      }
    });
  }

  elegir(q: Quien): void {
    this.quien.set(q);
    this.abiertos.set(new Set());
  }

  alternar(fecha: string): void {
    const s = new Set(this.abiertos());
    if (s.has(fecha)) {
      s.delete(fecha);
    } else {
      s.add(fecha);
    }
    this.abiertos.set(s);
  }

  /** La comisión alcanzada subió respecto del día anterior */
  subio(d: DiaDetalle): boolean {
    const dias = this.dias();
    const i = dias.indexOf(d);
    return i >= 0 && d.comision > (i > 0 ? dias[i - 1].comision : 0);
  }

  monto(p: DetalleComision): number {
    return montoDetalle(p);
  }

  private corto(valor: number): string {
    if (valor >= 1_000_000) {
      return `${(valor / 1_000_000).toFixed(1)} M`;
    }
    if (valor >= 1_000) {
      return `${Math.round(valor / 1_000)} mil`;
    }
    return `${Math.round(valor)}`;
  }
}
