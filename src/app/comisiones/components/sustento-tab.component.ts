import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, model, signal, untracked } from '@angular/core';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { Observable, Subscription, catchError, forkJoin, of } from 'rxjs';
import { ClienteContenido, DetalleComision, EscalaComision, LineaDesglose, PagoSustento, ReportePeriodo, VistaSustento } from '../models/comision.model';
import { CUADRE_INFO, DiaDetalle, GRUPO_INFO, METRICA_INFO, MOTIVO_INFO, PARCIAL_EN_ESPERA, agruparContenidosPorDia, agruparPagosPorDia, agruparPorDia, diaMes, mensajeError, siguienteTramo, tramosDe } from '../comisiones.util';
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
 * Sustento del período por persona. En CONTENCION, el supervisor ve todos los clientes contenidos del mes
 * por fecha de contención; los asesores conservan el detalle de sus pagos por fecha de banco.
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
      @if (personas().length > 1) {
        <div class="cmx-who" role="group" aria-label="Persona">
          @for (p of personas(); track p.clave) {
            @if (p.esSupervisor) { <span class="cmx-who-sep" aria-hidden="true"></span> }
            <button type="button" [class.is-sup]="p.esSupervisor" [attr.aria-pressed]="p.clave === seleccion()"
                    (click)="elegir(p.clave)">{{ p.nombre }}{{ p.esSupervisor ? ' · supervisor' : '' }}</button>
          }
        </div>
      }

      @if (persona(); as p) {
        <section class="cmx-block cmx-enter" aria-labelledby="cmx-sus-nombre">
          <div class="cmx-block-head">
            <h3 id="cmx-sus-nombre" class="cmx-block-title">{{ p.nombre }}</h3>
            <span class="cmx-block-desc">
              @if (p.esSupervisor) {
                @if (porCapital()) {
                  Suma el saldo capital asignado de todos los clientes CONTENIDO del mes, gestionados o no por su equipo.
                  Meta del mes: S/ {{ p.meta | appNumber:'1.2-2' }}.
                } @else {
                  @if (cartera(); as c) {
                    Suma todos los pagos conciliados del mes de los clientes de {{ c }} (según su periodo de compra), los gestione quien sea, incluidos los pagos voluntarios y los no asignados, contra la meta del mes (S/ {{ p.meta | appNumber:'1.2-2' }}). No suma los de clientes de la otra cartera.
                  } @else {
                    Suma todos los pagos conciliados del mes de la subcartera, incluidos los pagos voluntarios, los no asignados y los de gestiones de quien no participa, contra la meta del mes (S/ {{ p.meta | appNumber:'1.2-2' }})
                  }
                }
              } @else {
                {{ metrica().logrado }} acumulado contra su meta individual (S/ {{ p.meta | appNumber:'1.2-2' }}{{ p.metaPropia ? ', meta propia' : '' }}{{ p.ingreso ? ', ' + p.ingreso : '' }})
              }
            </span>
          </div>
          <div class="cmx-legend"><span><i></i>{{ metrica().logrado }} acumulado por {{ p.esSupervisor && porCapital() ? 'fecha de contención' : 'fecha banco' }}</span></div>
          <div style="padding:6px 14px 8px">
            @if (grafico(); as g) {
              <svg class="cmx-chart" [attr.viewBox]="'0 0 ' + g.w + ' ' + g.h" role="img"
                   [attr.aria-label]="'Avance de ' + p.nombre + ' sobre su meta por ' + (p.esSupervisor && porCapital() ? 'fecha de contención' : 'fecha banco')">
                <defs>
                  <pattern id="cmx-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <rect width="6" height="6" fill="#F8FAFC" /><line x1="0" y1="0" x2="0" y2="6" stroke="#E2E8F0" stroke-width="3" />
                  </pattern>
                </defs>
                @if (g.pendiente; as pe) {
                  <rect [attr.x]="pe.x" [attr.y]="g.t" [attr.width]="pe.w" [attr.height]="g.alto" fill="url(#cmx-hatch)" />
                  <text class="cmx-ch-axis" [attr.x]="pe.x + pe.w / 2" [attr.y]="g.base - 8" text-anchor="middle">{{ p.esSupervisor && porCapital() ? 'sin nuevos contenidos' : 'aún sin pagos' }}</text>
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
                @if (p.esSupervisor && porCapital()) {
                  sustento de {{ contenidos().length }} clientes contenidos
                } @else if (vista().pagos.ultimaFechaBanco; as u) { con los pagos conciliados hasta el {{ diaMes(u) }} } @else { sin pagos conciliados }
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
            <span class="cmx-block-desc">
              @if (p.esSupervisor && porCapital()) {
                Por fecha de contención. Los que ya venían contenidos se muestran en el día 1 del mes.
              } @else {
                Por fecha banco (FEC_ULT_PAGO en Financiera OH, fecha de pago en BCP)@if (porCapital()) {. Cada cliente contenido suma su capital asignado el día de su primer pago del mes }
              }
            </span>
          </div>
          <div class="cmx-tw">
            <table class="cmx-table">
              <thead>
                <tr>
                  <th scope="col">{{ p.esSupervisor && porCapital() ? 'Fecha de contención' : 'Fecha banco' }}</th>
                  <th scope="col" class="n">{{ porCapital() ? 'Capital del día' : 'Monto del día' }}</th>
                  <th scope="col" class="n">Acumulado</th>
                  <th scope="col" class="n">% de la meta</th>
                  <th scope="col">Nivel</th>
                  <th scope="col"><span class="sr-only">{{ p.esSupervisor && porCapital() ? 'Clientes' : 'Pagos' }}</span></th>
                </tr>
              </thead>
              <tbody>
                @for (d of dias(); track d.fecha) {
                  <tr [class.is-open]="abiertos().has(d.fecha)">
                    <td class="n" style="text-align:left">{{ diaMes(d.fecha) }}@if (d.etiqueta) { <span class="cmx-tag">{{ d.etiqueta }}</span> }</td>
                    <td class="n">{{ d.monto | appNumber:'1.2-2' }}</td>
                    <td class="n">{{ d.acumulado | appNumber:'1.2-2' }}</td>
                    <td class="n">{{ d.porcentaje ?? 0 | appNumber:'1.1-1' }} %</td>
                    <td [class.is-good]="d.sube">
                      @if (d.nivel && d.nivel.montoComision) { {{ d.sube ? '▲ ' : '' }}{{ d.nivel.porcentajeDesde }} % · S/ {{ d.nivel.montoComision | appNumber:'1.0-0' }} } @else { — }
                    </td>
                    <td style="text-align:right">
                      <button type="button" class="cmx-dbtn" [attr.aria-expanded]="abiertos().has(d.fecha)" (click)="alternarDia(d.fecha)">
                        {{ abiertos().has(d.fecha) ? 'Ocultar' : d.clientes ? 'Ver clientes (' + d.clientes.length + ')' : 'Ver pagos (' + (d.pagosSustento ?? d.pagos).length + ')' }}
                        <span class="cmx-chev" [class.is-open]="abiertos().has(d.fecha)"><cmx-icon name="chevron-down" [size]="13" /></span>
                      </button>
                    </td>
                  </tr>
                  @if (abiertos().has(d.fecha)) {
                    <tr class="cmx-det">
                      <td colspan="6">
                        <div class="cmx-det-in">
                          @if (d.clientes; as clientes) {
                            <div class="cmx-tw">
                              <table class="cmx-table">
                                <thead><tr><th scope="col">Documento</th><th scope="col">Cliente</th><th scope="col" class="n">Capital</th></tr></thead>
                                <tbody>
                                  @for (cliente of clientes; track cliente.documentoCliente) {
                                    <tr>
                                      <td>{{ cliente.documentoCliente }}</td>
                                      <td>{{ cliente.nombreCliente || '—' }}</td>
                                      <td class="n">{{ cliente.capitalAsignado ?? 0 | appNumber:'1.2-2' }}</td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            </div>
                          } @else if (d.pagosSustento; as pagosDia) {
                            <div class="cmx-tw">
                              <table class="cmx-table">
                                <thead>
                                  <tr>
                                    <th scope="col">Origen</th>
                                    <th scope="col">Asesor</th>
                                    <th scope="col">Cliente</th>
                                    <th scope="col">DNI</th>
                                    <th scope="col" class="n">Gestión</th>
                                    <th scope="col" class="n">Monto</th>
                                    <th scope="col">Al asesor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  @for (pg of pagosDia; track pg.conciliacionId) {
                                    <tr>
                                      <td><span class="cmx-src">{{ origen(pg) }}</span></td>
                                      <td>{{ pg.nombreAgenteGestion || '—' }}</td>
                                      <td>{{ pg.nombreCliente || '—' }}</td>
                                      <td class="n" style="text-align:left">{{ pg.documentoCliente || '—' }}</td>
                                      <td class="n">{{ pg.idGestion }}</td>
                                      <td class="n">{{ pg.montoAplicado | appNumber:'1.2-2' }}</td>
                                      <td [class.na]="pg.motivoExclusion" [attr.title]="detalleCuadre(pg)">
                                        {{ pg.motivoExclusion ? 'No suma: ' + motivo(pg) : 'Suma' }}
                                        @if (esParcial(pg)) { <span class="cmx-src is-warn" [title]="TITULO_PARCIAL">parcial en espera</span> }
                                      </td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            </div>
                          } @else {
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
                                    <th scope="col">PDP</th>
                                    <th scope="col" class="n">Monto origen</th>
                                    <th scope="col" class="n">Monto PDP</th>
                                    <th scope="col">Contuvo</th>
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
                                    <td>
                                      {{ pg.nombreCliente || '—' }}
                                      @if (esParcial(pg)) { <span class="cmx-src is-warn" [title]="TITULO_PARCIAL">parcial en espera</span> }
                                    </td>
                                    <td class="n" style="text-align:left">{{ pg.documentoCliente || '—' }}</td>
                                    <td class="n">{{ pg.idGestion }}</td>
                                    <td class="n">{{ pg.numeroCuota }}</td>
                                    @if (porCapital()) {
                                      @let suma = d.sumas.get(pg.conciliacionId) ?? 0;
                                      @let montoLibre = !pg.origenPdp && pg.montoBase == null;
                                      <td [attr.title]="montoLibre ? 'El asesor registró la PDP como excepción con monto libre (sin campo base)' : null">{{ montoLibre ? 'Excepción monto libre' : pg.origenPdp || '—' }}</td>
                                      <td class="n">{{ montoLibre ? 'No aplica' : pg.montoBase != null ? (pg.montoBase | appNumber:'1.2-2') : '—' }}</td>
                                      <td class="n" [attr.title]="pg.baja30 != null ? 'Baja 30: S/ ' + (pg.baja30 | appNumber:'1.2-2') + ' (' + pg.baja30Fuente + ')' : null">{{ pg.montoPromesa != null ? (pg.montoPromesa | appNumber:'1.2-2') : '—' }}</td>
                                      <td class="n" style="text-align:left">{{ pg.fechaContencion ? diaMes(pg.fechaContencion) : '—' }}</td>
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
                          }
                        </div>
                      </td>
                    </tr>
                  }
                } @empty {
                  <tr><td colspan="6" class="empty">{{ p.esSupervisor && porCapital() ? 'No hay clientes contenidos en la tabla de este periodo.' : p.esSupervisor ? 'Todavía no hay pagos conciliados en este periodo.' : 'Todavía no hay pagos que sumen en este periodo.' }}</td></tr>
                }
              </tbody>
            </table>
          </div>
        </section>

        @if (p.esSupervisor && porCapital()) {
          <section class="cmx-block cmx-enter" style="--i:2" aria-labelledby="cmx-sus-contenidos">
            <div class="cmx-block-head">
              <h3 id="cmx-sus-contenidos" class="cmx-block-title">Clientes contenidos del mes ({{ contenidos().length }})</h3>
              <span class="cmx-block-desc">Total S/ {{ totalContenidos() | appNumber:'1.2-2' }}</span>
            </div>
            @if (contenidosDesactualizados()) {
              <p class="cmx-block-desc" role="status" style="padding:0 14px">
                La tabla del mes cambió después del último recálculo: recalcula el período para actualizar el logrado.
              </p>
            }
            <div class="cmx-tw">
              <table class="cmx-table">
                <thead>
                  <tr><th scope="col">Documento</th><th scope="col">Cliente</th><th scope="col">Fecha de contención</th><th scope="col" class="n">Capital</th></tr>
                </thead>
                <tbody>
                  @for (cliente of contenidos(); track cliente.documentoCliente) {
                    <tr>
                      <td>{{ cliente.documentoCliente }}</td>
                      <td>{{ cliente.nombreCliente || '—' }}</td>
                      <td>{{ cliente.fechaContencion ? diaMes(cliente.fechaContencion) : 'Ya venía contenido' }}</td>
                      <td class="n">{{ cliente.capitalAsignado ?? 0 | appNumber:'1.2-2' }}</td>
                    </tr>
                  } @empty {
                    <tr><td colspan="4" class="empty">No hay clientes contenidos en la tabla de este periodo.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }

        @if (noSuman().length) {
          <section class="cmx-block cmx-enter" style="--i:3" aria-labelledby="cmx-sus-nosuman">
            <div class="cmx-block-head">
              <h3 id="cmx-sus-nosuman" class="cmx-block-title">Pagos que no suman{{ p.esSupervisor && !porCapital() && !cartera() ? ' a los asesores' : '' }} ({{ noSuman().length }})</h3>
              <span class="cmx-block-desc">
                @if (p.esSupervisor && porCapital()) {
                  Conciliados en el mes, pero no suman capital a los asesores. Los motivos de contención siguen contando para su meta de pagos.
                } @else if (p.esSupervisor && cartera()) {
                  Conciliados en el mes, pero el cliente no es de {{ cartera() }} (es de la otra cartera o no tiene un periodo de compra único): no suman a tu logrado como supervisor.
                } @else if (p.esSupervisor) {
                  Conciliados en el mes, pero no suman al recaudo de los asesores. Estos pagos sí suman a tu logrado como supervisor.
                } @else {
                  Conciliados en el mes, pero no suman {{ porCapital() ? 'capital' : 'al recaudo' }}@if (porCapital()) {. Los de clientes que no contuvo siguen contando para la meta de pagos }
                }
              </span>
            </div>
            <div class="cmx-tw">
              <table class="cmx-table">
                <thead>
                  <tr>
                    <th scope="col">Fecha banco</th>
                    @if (p.esSupervisor) { <th scope="col">Asesor</th> }
                    <th scope="col">Cliente</th>
                    <th scope="col">DNI</th>
                    <th scope="col" class="n">Gestión</th>
                    <th scope="col">Fecha PDP</th>
                    <th scope="col" class="n">Monto</th>
                    @if (porCapital()) {
                      <th scope="col" class="n">Monto PDP</th>
                      <th scope="col" class="n">Baja 30</th>
                      <th scope="col">Contuvo</th>
                    }
                    <th scope="col">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  @for (pg of noSuman(); track pg.conciliacionId) {
                    <tr>
                      <td class="n" style="text-align:left">{{ diaMes(pg.fechaBanco) }}</td>
                      @if (p.esSupervisor) { <td>{{ pg.nombreAgenteGestion || '—' }}</td> }
                      <td>{{ pg.nombreCliente || '—' }}</td>
                      <td class="n" style="text-align:left">{{ pg.documentoCliente || '—' }}</td>
                      <td class="n">{{ pg.idGestion }}</td>
                      <td class="n" style="text-align:left">{{ pg.fechaGestion ? diaMes(pg.fechaGestion.slice(0, 10)) : '—' }}</td>
                      <td class="n">{{ pg.montoAplicado | appNumber:'1.2-2' }}</td>
                      @if (porCapital()) {
                        <td class="n">{{ pg.montoPromesa != null ? (pg.montoPromesa | appNumber:'1.2-2') : '—' }}</td>
                        <td class="n" [attr.title]="pg.baja30Fuente">{{ pg.baja30 != null ? (pg.baja30 | appNumber:'1.2-2') : '—' }}</td>
                        <td class="n" style="text-align:left">{{ pg.fechaContencion ? diaMes(pg.fechaContencion) : '—' }}</td>
                      }
                      <td [attr.title]="detalleCuadre(pg)">{{ motivo(pg) }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>
        }
      }
    }

  `
})
export class SustentoTabComponent {
  private readonly service = inject(ComisionesService);
  private carga: Subscription | null = null;

  readonly reporte = input.required<ReportePeriodo>();
  readonly vista = input.required<VistaSustento>();
  /** De dónde sale el detalle pago a pago; por defecto, el del período completo (módulo de comisiones) */
  readonly fuenteDetalle = input<(idPeriodo: number) => Observable<DetalleComision[]>>();
  /** De dónde salen los pagos que no suman; por defecto, todos los del período (módulo de comisiones) */
  readonly fuentePagos = input<(idPeriodo: number) => Observable<PagoSustento[]>>();
  /** Persona elegida: id de usuario del asesor o 'sup' */
  readonly seleccion = model<number | 'sup' | null>(null);

  readonly diaMes = diaMes;

  readonly filas = signal<DetalleComision[]>([]);
  readonly pagos = signal<PagoSustento[]>([]);
  readonly contenidos = signal<ClienteContenido[]>([]);
  private readonly contenidosDisponibles = signal(false);
  readonly totalContenidos = computed(() => this.contenidos().reduce((total, c) => total + (c.capitalAsignado ?? 0), 0));
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly abiertos = signal<Set<string>>(new Set());

  readonly metrica = computed(() => METRICA_INFO[this.reporte().periodo.tipoMetrica]);
  /** Contención: suma el capital asignado del cliente, no lo pagado */
  readonly porCapital = computed(() => this.reporte().periodo.tipoMetrica === 'CONTENCION');
  /** Cartera de Tramo Propio (CP Antigua o CP Nueva): el supervisor solo suma los pagos de los clientes de su cartera */
  readonly cartera = computed(() => {
    const grupo = this.reporte().periodo.grupo;
    return grupo !== 'GENERAL' ? GRUPO_INFO[grupo] : null;
  });

  /** Tramo Propio: el cliente del pago es de la cartera del periodo (por su periodo de compra) */
  private deLaCartera(pg: PagoSustento): boolean {
    return pg.cartera === this.reporte().periodo.grupo;
  }

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

  /** Equipo del supervisor en RECAUDO (en Mis comisiones se cuenta en el detalle) */
  readonly totalAsesores = computed(() => {
    const n = this.reporte().participantes.filter(p => p.rol === 'ASESOR').length;
    return n || new Set(this.filas().map(f => f.idUsuario)).size;
  });

  readonly persona = computed(() => {
    const lista = this.personas();
    return lista.find(p => p.clave === this.seleccion()) ?? lista[0] ?? null;
  });

  /** El sustento es una consulta actual; el logrado corresponde al último recálculo */
  readonly contenidosDesactualizados = computed(() => {
    const p = this.persona();
    return !!p?.esSupervisor && this.porCapital() && this.contenidosDisponibles()
      && Math.round(this.totalContenidos() * 100) !== Math.round(p.logrado * 100);
  });

  /** Pagos que no suman: los de las gestiones del asesor o, para el supervisor, todos; en Tramo Propio, los de clientes fuera de su cartera */
  readonly noSuman = computed<PagoSustento[]>(() => {
    const p = this.persona();
    if (!p) {
      return [];
    }
    if (p.esSupervisor && !this.porCapital() && this.cartera()) {
      return this.pagos().filter(pg => !this.deLaCartera(pg));
    }
    return this.pagos().filter(pg => pg.motivoExclusion != null && (p.esSupervisor || pg.idAgenteGestion === p.clave));
  });

  readonly dias = computed<DiaDetalle[]>(() => {
    const p = this.persona();
    if (!p) {
      return [];
    }
    if (p.esSupervisor && this.porCapital()) {
      const periodo = this.reporte().periodo;
      const primerDiaMes = `${periodo.anio}-${String(periodo.mes).padStart(2, '0')}-01`;
      return agruparContenidosPorDia(this.contenidos(), primerDiaMes, p.meta, p.tramos);
    }
    if (p.esSupervisor) {
      // RECAUDO: al supervisor le suman todos los pagos conciliados; en Tramo Propio, solo los de los clientes de su cartera
      const pagos = this.cartera() ? this.pagos().filter(pg => this.deLaCartera(pg)) : this.pagos();
      return agruparPagosPorDia(pagos, p.meta, p.tramos);
    }
    return agruparPorDia(p.filas, p.meta, p.tramos);
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
    const dias = this.dias();
    const ultimaFecha = p.esSupervisor && this.porCapital() ? dias.at(-1)?.fecha : v.pagos.ultimaFechaBanco;
    const ultimo = ultimaFecha ? Number(ultimaFecha.slice(8, 10)) : 0;
    const niveles = p.tramos.filter(t => t.porcentajeDesde > 0);
    const porcentajeContenidos = p.esSupervisor && this.porCapital() ? dias.at(-1)?.porcentaje ?? 0 : 0;
    const maxP = Math.max(p.porcentaje ?? 0, porcentajeContenidos, 110, niveles.length ? niveles[niveles.length - 1].porcentajeDesde + 10 : 0) * 1.06;
    const x = (d: number) => L + (d - 1) / (diasMes - 1) * (W - L - R);
    const y = (pct: number) => T + (1 - pct / maxP) * (H - T - B);
    const base = y(0);

    const lineas = niveles.map(t => ({ desde: t.porcentajeDesde, monto: t.montoComision, y: y(t.porcentajeDesde), yEtiqueta: y(t.porcentajeDesde), hit: (p.porcentaje ?? 0) >= t.porcentajeDesde }));
    for (let i = 1; i < lineas.length; i++) {
      if (lineas[i - 1].yEtiqueta - lineas[i].yEtiqueta < 11) {
        lineas[i].yEtiqueta = lineas[i - 1].yEtiqueta - 11;
      }
    }

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
    inject(DestroyRef).onDestroy(() => this.carga?.unsubscribe());
    // Cada cálculo nuevo del período trae otro detalle
    effect(() => {
      const r = this.reporte();
      r.periodo.id;
      r.periodo.fechaCalculo;
      untracked(() => this.cargar());
    });
  }

  cargar(): void {
    this.carga?.unsubscribe();
    this.cargando.set(true);
    this.error.set(null);
    this.filas.set([]);
    this.pagos.set([]);
    this.contenidos.set([]);
    this.contenidosDisponibles.set(false);
    this.abiertos.set(new Set());
    const fuente = this.fuenteDetalle() ?? ((id: number) => this.service.obtenerDetalle(id));
    const fuentePagos = this.fuentePagos() ?? ((id: number) => this.service.obtenerPagos(id));
    const id = this.reporte().periodo.id;
    // Los pagos excluidos y los contenidos son complementos: si fallan, el sustento se ve igual.
    this.carga = forkJoin({
      filas: fuente(id),
      pagos: fuentePagos(id).pipe(catchError(() => of<PagoSustento[]>([]))),
      contenidos: this.porCapital() && this.reporte().participantes.some(p => p.rol === 'SUPERVISOR')
        ? this.service.obtenerContenidos(id).pipe(catchError(() => of(null))) : of<ClienteContenido[]>([])
    }).subscribe({
      next: ({ filas, pagos, contenidos }) => {
        this.filas.set(filas);
        this.pagos.set(pagos);
        this.contenidos.set(contenidos ?? []);
        this.contenidosDisponibles.set(contenidos != null);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'));
      }
    });
  }

  motivo(pg: PagoSustento): string {
    return pg.motivoExclusion ? MOTIVO_INFO[pg.motivoExclusion] ?? pg.motivoExclusion : '';
  }

  readonly TITULO_PARCIAL = 'Llegó menos de lo registrado; su grupo sigue abierto. Suma, pero hay que revisarlo';

  /** Por qué el cliente no cuadra con el consolidado (título de la celda); null si cuadra o no se revisó */
  detalleCuadre(pg: PagoSustento): string | null {
    return pg.resultadoCuadre && pg.resultadoCuadre !== 'CUADRA' ? CUADRE_INFO[pg.resultadoCuadre] ?? pg.resultadoCuadre : null;
  }

  /** Pago que llegó incompleto y espera el resto: suma, con observación */
  esParcial(pg: { categoriaPago?: string | null }): boolean {
    return pg.categoriaPago === PARCIAL_EN_ESPERA;
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

  /** El cliente ya tuvo antes un pago que suma en lo que se está viendo: su capital sumó ahí */
  yaSumo(d: DetalleComision): boolean {
    return (this.persona()?.filas ?? []).some(f => f.documentoCliente === d.documentoCliente
      && (f.fechaBanco < d.fechaBanco || (f.fechaBanco === d.fechaBanco && f.conciliacionId < d.conciliacionId)));
  }

  /** bcp_pago_detalle.banco: FINANCIERA_OH para los archivos de FOH; el banco (BCP…) para los CREP */
  origen(d: { banco: string | null }): string {
    const banco = (d.banco || '').toUpperCase();
    return banco === 'FINANCIERA_OH' ? 'FOH' : banco || '—';
  }

}
