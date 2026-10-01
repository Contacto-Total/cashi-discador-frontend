import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal, untracked } from '@angular/core';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { DetalleComision, EscalaComision, LineaDesglose, ReportePeriodo, VistaPeriodo } from '../models/comision.model';
import { DiaDetalle, METRICA_INFO, agruparPorDia, diaMes, mensajeError, siguienteTramo, tramosDe } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface Persona {
  clave: number | 'sup';
  nombre: string;
  esSupervisor: boolean;
  meta: number | null;
  metaPropia: boolean;
  /** Ingresó a mitad de mes: "Ingresó el 15/09: 12 de 22 días hábiles" */
  ingreso: string | null;
  logrado: number;
  porcentaje: number | null;
  nivel: number | null;
  comision: number;
  bonos: number;
  desglose: LineaDesglose[];
  tramos: EscalaComision[];
  filas: DetalleComision[];
}

const W = 780;
const H = 270;
const L = 44;
const R = 118;
const T = 16;
const B = 28;

/**
 * Sustento del período: por asesor (contra su meta individual) o por el supervisor (el total de los
 * asesores contra la meta del mes). Gráfico del acumulado por fecha banco, día a día y, en cada día,
 * los pagos con hora, cliente y monto. En contención cada pago muestra lo pagado y el capital asignado
 * que suma (solo en el primer pago del cliente).
 */
@Component({
  selector: 'cmx-sustento-tab',
  standalone: true,
  imports: [AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cargando() && !filas().length) {
      <div style="display:grid;gap:12px">
        <div class="cmx-skel" style="height:34px;max-width:520px"></div>
        <div class="cmx-skel" style="height:260px"></div>
      </div>
    } @else if (error()) {
      <div class="cmx-empty">
        <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
        <b>No se pudo cargar el sustento</b>
        <p>{{ error() }}</p>
        <button type="button" class="cmx-btn cmx-btn-sec" (click)="cargar()">Reintentar</button>
      </div>
    } @else if (!personas().length) {
      <div class="cmx-empty">
        <span class="cmx-empty-mark"><cmx-icon name="users" [size]="20" /></span>
        <b>Nadie participa en este periodo</b>
        <p>Elige a los asesores en la pestaña Comisiones.</p>
      </div>
    } @else {
      <div class="cmx-who" role="group" aria-label="Persona">
        @for (p of personas(); track p.clave) {
          @if (p.esSupervisor) { <span class="cmx-who-sep" aria-hidden="true"></span> }
          <button type="button" [class.is-sup]="p.esSupervisor" [attr.aria-pressed]="p.clave === seleccion()"
                  (click)="elegir(p.clave)">{{ p.nombre }}{{ p.esSupervisor ? ' · supervisor' : '' }}</button>
        }
      </div>

      @if (persona(); as p) {
        <section class="cmx-block cmx-enter" aria-labelledby="cmx-sus-nombre">
          <div class="cmx-block-head">
            <h3 id="cmx-sus-nombre" class="cmx-block-title">{{ p.nombre }}</h3>
            <span class="cmx-block-desc">
              @if (p.esSupervisor) {
                {{ metrica().logrado }} total de los {{ personas().length - 1 }} asesores contra la meta del mes (S/ {{ p.meta | appNumber:'1.2-2' }})
              } @else {
                {{ metrica().logrado }} acumulado contra su meta individual (S/ {{ p.meta | appNumber:'1.2-2' }}{{ p.metaPropia ? ', meta propia' : '' }}{{ p.ingreso ? ', ' + p.ingreso : '' }})
              }
            </span>
          </div>
          <div class="cmx-legend"><span><i></i>{{ metrica().logrado }} acumulado por fecha banco</span></div>
          <div style="padding:6px 14px 8px">
            @if (grafico(); as g) {
              <svg class="cmx-chart" [attr.viewBox]="'0 0 ' + g.w + ' ' + g.h" role="img"
                   [attr.aria-label]="'Avance de ' + p.nombre + ' sobre su meta por fecha banco'">
                <defs>
                  <pattern id="cmx-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="6" height="6" fill="#F8FAFC" /><line x1="0" y1="0" x2="0" y2="6" stroke="#E2E8F0" stroke-width="3" />
                  </pattern>
                </defs>
                @if (g.pendiente; as pe) {
                  <rect [attr.x]="pe.x" [attr.y]="g.t" [attr.width]="pe.w" [attr.height]="g.alto" fill="url(#cmx-hatch)" />
                  <text class="cmx-ch-axis" [attr.x]="pe.x + pe.w / 2" [attr.y]="g.base - 8" text-anchor="middle">aún sin pagos</text>
                }
                @for (l of g.lineas; track l.desde) {
                  <line class="cmx-ch-tramo" [class.is-hit]="l.hit" [attr.x1]="g.l" [attr.x2]="g.xFin" [attr.y1]="l.y" [attr.y2]="l.y" />
                  <text class="cmx-ch-label" [class.is-hit]="l.hit" [attr.x]="g.xFin + 6" [attr.y]="l.yEtiqueta + 3.5">{{ l.desde }} % · S/ {{ l.monto | appNumber:'1.0-0' }}</text>
                }
                @for (e of g.ejeY; track e.v) {
                  <text class="cmx-ch-axis" [attr.x]="g.l - 6" [attr.y]="e.y + 3" text-anchor="end">{{ e.v }} %</text>
                }
                @for (e of g.ejeX; track e.d) {
                  <text class="cmx-ch-axis" [attr.x]="e.x" [attr.y]="g.h - 9" text-anchor="middle">{{ e.t }}</text>
                }
                <line class="cmx-ch-grid" [attr.x1]="g.l" [attr.x2]="g.xFin" [attr.y1]="g.base" [attr.y2]="g.base" />
                @if (g.linea) {
                  <path class="cmx-ch-area" [attr.d]="g.area" />
                  <path class="cmx-ch-line" [attr.d]="g.linea" />
                  <circle class="cmx-ch-dot" [attr.cx]="g.fin.x" [attr.cy]="g.fin.y" r="4" />
                }
              </svg>
            }
          </div>
          <div class="cmx-reads">
            <div>
              <div class="cmx-reads-l">Lleva</div>
              <div class="cmx-reads-v">{{ p.porcentaje ?? 0 | appNumber:'1.1-1' }} %</div>
              <div class="cmx-reads-d">S/ {{ p.logrado | appNumber:'1.2-2' }} de S/ {{ p.meta | appNumber:'1.2-2' }}</div>
            </div>
            <div>
              <div class="cmx-reads-l">Nivel de comisión</div>
              <div class="cmx-reads-v">{{ p.nivel != null && p.comision ? p.nivel + ' %' : '—' }}</div>
              <div class="cmx-reads-d">
                @if (siguiente(); as s) { Faltan S/ {{ s.falta | appNumber:'1.2-2' }} para {{ s.desde }} % } @else { Nivel máximo }
              </div>
            </div>
            <div>
              <div class="cmx-reads-l">A pagar</div>
              <div class="cmx-reads-v">S/ {{ p.comision + p.bonos | appNumber:'1.2-2' }}</div>
              <div class="cmx-reads-d">
                Comisión S/ {{ p.comision | appNumber:'1.2-2' }}@if (p.bonos) { + bonos S/ {{ p.bonos | appNumber:'1.2-2' }} } ·
                @if (vista().pagos.ultimaFechaBanco; as u) { con los pagos conciliados hasta el {{ diaMes(u) }} } @else { sin pagos conciliados }
              </div>
            </div>
          </div>
          @if (p.desglose.length) {
            <div class="cmx-brk">
              <div class="cmx-block-head" style="border-bottom:1px solid var(--cmx-line)">
                <span class="cmx-block-title">Cómo se arma lo que cobra</span>
                <span class="cmx-block-desc">{{ tituloDesglose(p) }}</span>
              </div>
              @for (l of p.desglose; track $index) {
                <div class="cmx-brk-r" [class.ok]="l.cumple">
                  <span class="ic" aria-hidden="true">{{ l.cumple ? '✓' : '·' }}</span>
                  <span class="k">
                    <b>{{ l.nombre }}@if (l.tipo === 'BONO') { <span class="cmx-tag cmx-tag-b">bono</span> }</b>
                    <span>{{ l.detalle }}</span>
                  </span>
                  <span class="a">{{ l.cumple ? 'S/ ' + (l.monto | appNumber:'1.2-2') : '—' }}</span>
                </div>
              }
              <div class="cmx-brk-r tot ok">
                <span class="ic"></span>
                <span class="k"><b>Total a pagar</b><span>Comisión S/ {{ p.comision | appNumber:'1.2-2' }} + bonos S/ {{ p.bonos | appNumber:'1.2-2' }}</span></span>
                <span class="a">S/ {{ p.comision + p.bonos | appNumber:'1.2-2' }}</span>
              </div>
            </div>
          }
        </section>

        <section class="cmx-block cmx-enter" style="--i:1" aria-labelledby="cmx-sus-dias">
          <div class="cmx-block-head">
            <h3 id="cmx-sus-dias" class="cmx-block-title">Día a día</h3>
            <span class="cmx-block-desc">Por fecha banco (FEC_ULT_PAGO en Financiera OH, fecha de pago en BCP)@if (porCapital()) {. Cada cliente CONTENIDO suma su capital asignado el día de su primer pago del mes }</span>
          </div>
          <div class="cmx-tw">
            <table class="cmx-table">
              <thead>
                <tr>
                  <th scope="col">Fecha banco</th>
                  <th scope="col" class="n">{{ porCapital() ? 'Capital del día' : 'Monto del día' }}</th>
                  <th scope="col" class="n">Acumulado</th>
                  <th scope="col" class="n">% de la meta</th>
                  <th scope="col">Nivel</th>
                  <th scope="col"><span class="sr-only">Pagos</span></th>
                </tr>
              </thead>
              <tbody>
                @for (d of dias(); track d.fecha) {
                  <tr [class.is-open]="abiertos().has(d.fecha)">
                    <td class="n" style="text-align:left">{{ diaMes(d.fecha) }}</td>
                    <td class="n">{{ d.monto | appNumber:'1.2-2' }}</td>
                    <td class="n">{{ d.acumulado | appNumber:'1.2-2' }}</td>
                    <td class="n">{{ d.porcentaje ?? 0 | appNumber:'1.1-1' }} %</td>
                    <td [class.is-good]="d.sube">
                      @if (d.nivel && d.nivel.montoComision) { {{ d.sube ? '▲ ' : '' }}{{ d.nivel.porcentajeDesde }} % · S/ {{ d.nivel.montoComision | appNumber:'1.0-0' }} } @else { — }
                    </td>
                    <td style="text-align:right">
                      <button type="button" class="cmx-dbtn" [attr.aria-expanded]="abiertos().has(d.fecha)" (click)="alternarDia(d.fecha)">
                        {{ abiertos().has(d.fecha) ? 'Ocultar' : 'Ver pagos (' + d.pagos.length + ')' }}
                        <span class="cmx-chev" [class.is-open]="abiertos().has(d.fecha)"><cmx-icon name="chevron-down" [size]="13" /></span>
                      </button>
                    </td>
                  </tr>
                  @if (abiertos().has(d.fecha)) {
                    <tr class="cmx-det">
                      <td colspan="6">
                        <div class="cmx-det-in">
                          <div class="cmx-tw">
                            <table class="cmx-table">
                              <thead>
                                <tr>
                                  <th scope="col">Hora</th>
                                  <th scope="col">Origen</th>
                                  @if (p.esSupervisor) { <th scope="col">Asesor</th> }
                                  <th scope="col">Cliente</th>
                                  <th scope="col">DNI</th>
                                  <th scope="col" class="n">Gestión</th>
                                  <th scope="col" class="n">Cuota</th>
                                  @if (porCapital()) {
                                    <th scope="col" class="n">Pagado</th>
                                    <th scope="col" class="n">SLD capital asig.</th>
                                  } @else {
                                    <th scope="col" class="n">Monto</th>
                                  }
                                </tr>
                              </thead>
                              <tbody>
                                @for (pg of pagosOrdenados(d); track pg.conciliacionId) {
                                  <tr>
                                    <td class="n" style="text-align:left" [class.na]="!pg.horaBanco">
                                      @if (pg.horaBanco) { {{ pg.horaBanco }} } @else { <span title="El archivo de Financiera OH no trae hora">—</span> }
                                    </td>
                                    <td><span class="cmx-src">{{ origen(pg) }}</span></td>
                                    @if (p.esSupervisor) { <td>{{ pg.nombreAsesor }}</td> }
                                    <td>{{ pg.nombreCliente || '—' }}</td>
                                    <td class="n" style="text-align:left">{{ pg.documentoCliente || '—' }}</td>
                                    <td class="n">{{ pg.idGestion }}</td>
                                    <td class="n">{{ pg.numeroCuota }}</td>
                                    @if (porCapital()) {
                                      @let suma = d.sumas.get(pg.conciliacionId) ?? 0;
                                      <td class="n" style="color:var(--cmx-ink-3)">{{ pg.recaudo ?? 0 | appNumber:'1.2-2' }}</td>
                                      <td class="n" [class.na]="suma <= 0">
                                        @if (suma > 0) { {{ suma | appNumber:'1.2-2' }} }
                                        @else if (yaSumo(pg)) { <span title="Su capital ya sumó con su primer pago del mes">ya sumó</span> }
                                        @else { <span title="El cliente no tiene SLD_CAPITAL_ASIG en la tabla dinámica">sin capital</span> }
                                      </td>
                                    } @else {
                                      <td class="n">{{ pg.recaudo ?? 0 | appNumber:'1.2-2' }}</td>
                                    }
                                  </tr>
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                } @empty {
                  <tr><td colspan="6" class="empty">Todavía no hay pagos que sumen en este periodo.</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    }

  `
})
export class SustentoTabComponent {
  private readonly service = inject(ComisionesService);

  readonly reporte = input.required<ReportePeriodo>();
  readonly vista = input.required<VistaPeriodo>();
  /** Persona elegida: id de usuario del asesor o 'sup' */
  readonly seleccion = model<number | 'sup' | null>(null);

  readonly diaMes = diaMes;

  readonly filas = signal<DetalleComision[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly abiertos = signal<Set<string>>(new Set());

  readonly metrica = computed(() => METRICA_INFO[this.reporte().periodo.tipoMetrica]);
  /** Contención: suma el capital asignado del cliente, no lo pagado */
  readonly porCapital = computed(() => this.reporte().periodo.tipoMetrica === 'CONTENCION');

  readonly personas = computed<Persona[]>(() => {
    const r = this.reporte();
    const escalas = r.periodo.escalas;
    const filas = this.filas();
    const asesores = r.participantes
      .filter(p => p.rol === 'ASESOR')
      .sort((a, b) => b.logrado - a.logrado)
      .map<Persona>(a => ({
        clave: a.idUsuario,
        nombre: a.nombre,
        esSupervisor: false,
        meta: a.metaIndividual,
        metaPropia: a.metaManual != null,
        ingreso: a.fechaIngreso && a.metaManual == null
          ? `ingresó el ${diaMes(a.fechaIngreso)}: ${a.diasHabiles} de ${r.periodo.diasHabiles} días hábiles` : null,
        logrado: a.logrado,
        porcentaje: a.porcentajeCumplimiento,
        nivel: a.porcentajeTramo,
        comision: a.montoComision,
        bonos: a.montoBonos ?? 0,
        desglose: a.desglose ?? [],
        tramos: tramosDe(escalas, 'ASESOR'),
        filas: filas.filter(f => f.idUsuario === a.idUsuario)
      }));
    const sup = r.participantes.find(p => p.rol === 'SUPERVISOR');
    return sup
      ? [...asesores, {
          clave: 'sup' as const,
          nombre: sup.nombre,
          esSupervisor: true,
          meta: sup.metaIndividual ?? r.periodo.metaDelMes,
          metaPropia: false,
          ingreso: null,
          logrado: sup.logrado,
          porcentaje: sup.porcentajeCumplimiento,
          nivel: sup.porcentajeTramo,
          comision: sup.montoComision,
          bonos: sup.montoBonos ?? 0,
          desglose: sup.desglose ?? [],
          tramos: tramosDe(escalas, 'SUPERVISOR'),
          filas
        }]
      : asesores;
  });

  tituloDesglose(p: Persona): string {
    const lineas = p.desglose;
    const partes = [lineas.some(l => l.tipo === 'LOGRO') ? 'por logros' : p.esSupervisor ? 'comisión por la escala' : 'nivel alcanzado'];
    if (lineas.some(l => l.tipo === 'META')) {
      partes.push('metas de cantidad');
    }
    if (lineas.some(l => l.tipo === 'BONO')) {
      partes.push('bonos');
    }
    return partes.join(' + ');
  }

  readonly persona = computed(() => {
    const lista = this.personas();
    return lista.find(p => p.clave === this.seleccion()) ?? lista[0] ?? null;
  });

  readonly dias = computed<DiaDetalle[]>(() => {
    const p = this.persona();
    return p ? agruparPorDia(p.filas, p.meta, p.tramos, p.esSupervisor && this.porCapital()) : [];
  });

  readonly siguiente = computed(() => {
    const p = this.persona();
    return p ? siguienteTramo(p.tramos, p.nivel, p.logrado, p.meta) : null;
  });

  /** Geometría del gráfico: eje X en días del mes, eje Y en % de la meta de la persona */
  readonly grafico = computed(() => {
    const p = this.persona();
    const v = this.vista();
    if (!p) {
      return null;
    }
    const diasMes = new Date(v.anio, v.mes, 0).getDate();
    const ultimo = v.pagos.ultimaFechaBanco ? Number(v.pagos.ultimaFechaBanco.slice(8, 10)) : 0;
    const niveles = p.tramos.filter(t => t.porcentajeDesde > 0);
    const maxP = Math.max(p.porcentaje ?? 0, 110, niveles.length ? niveles[niveles.length - 1].porcentajeDesde + 10 : 0) * 1.06;
    const x = (d: number) => L + (d - 1) / (diasMes - 1) * (W - L - R);
    const y = (pct: number) => T + (1 - pct / maxP) * (H - T - B);
    const base = y(0);

    const lineas = niveles.map(t => ({ desde: t.porcentajeDesde, monto: t.montoComision, y: y(t.porcentajeDesde), yEtiqueta: y(t.porcentajeDesde), hit: (p.porcentaje ?? 0) >= t.porcentajeDesde }));
    for (let i = 1; i < lineas.length; i++) {
      if (lineas[i - 1].yEtiqueta - lineas[i].yEtiqueta < 11) {
        lineas[i].yEtiqueta = lineas[i - 1].yEtiqueta - 11;
      }
    }

    const dias = this.dias();
    const puntos: [number, number][] = [];
    if (dias.length && p.meta) {
      puntos.push([x(Number(dias[0].fecha.slice(8, 10))), base]);
      for (const d of dias) {
        puntos.push([x(Number(d.fecha.slice(8, 10))), y(d.acumulado / p.meta * 100)]);
      }
    }
    const linea = puntos.map((q, j) => (j ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
    const fin = puntos.length ? { x: puntos[puntos.length - 1][0], y: puntos[puntos.length - 1][1] } : { x: 0, y: 0 };

    const mesActual = ultimo > 0 && ultimo < diasMes;
    return {
      w: W, h: H, l: L, t: T, base, alto: H - T - B, xFin: W - R,
      lineas,
      ejeY: [0, 50, 100].map(val => ({ v: val, y: y(val) })),
      ejeX: [1, 8, 15, 22, diasMes].map(d => ({ d, x: x(d), t: String(d).padStart(2, '0') + '/' + String(v.mes).padStart(2, '0') })),
      pendiente: mesActual ? { x: x(ultimo + 0.5), w: x(diasMes) - x(ultimo + 0.5) } : null,
      linea: puntos.length ? linea : '',
      area: puntos.length ? linea + ' L' + fin.x.toFixed(1) + ' ' + base.toFixed(1) + ' Z' : '',
      fin
    };
  });

  constructor() {
    // Cada cálculo nuevo del período trae otro detalle
    effect(() => {
      const r = this.reporte();
      r.periodo.id;
      r.periodo.fechaCalculo;
      untracked(() => this.cargar());
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.service.obtenerDetalle(this.reporte().periodo.id).subscribe({
      next: filas => {
        this.filas.set(filas);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'));
      }
    });
  }

  elegir(clave: number | 'sup'): void {
    this.seleccion.set(clave);
    this.abiertos.set(new Set());
  }

  alternarDia(fecha: string): void {
    this.abiertos.update(s => {
      const n = new Set(s);
      if (n.has(fecha)) {
        n.delete(fecha);
      } else {
        n.add(fecha);
      }
      return n;
    });
  }

  pagosOrdenados(d: DiaDetalle): DetalleComision[] {
    return [...d.pagos].sort((a, b) => (a.horaBanco ?? '99').localeCompare(b.horaBanco ?? '99') || a.conciliacionId - b.conciliacionId);
  }

  /** El cliente ya tuvo un pago antes en lo que se está viendo: su capital sumó ahí */
  yaSumo(d: DetalleComision): boolean {
    return (this.persona()?.filas ?? []).some(f => f.documentoCliente === d.documentoCliente
      && (f.fechaBanco < d.fechaBanco || (f.fechaBanco === d.fechaBanco && f.conciliacionId < d.conciliacionId)));
  }

  /** bcp_pago_detalle.banco: FINANCIERA_OH para los archivos de FOH; el banco (BCP…) para los CREP */
  origen(d: DetalleComision): string {
    const banco = (d.banco || '').toUpperCase();
    return banco === 'FINANCIERA_OH' ? 'FOH' : banco || '—';
  }

}
