import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormatService } from '@/shared/services/format.service';
import { AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { EscalaComision, ParticipanteComision, ReportePeriodo, RolComision } from '../models/comision.model';
import {
  Barra,
  METRICA_INFO,
  SiguienteTramo,
  construirBarra,
  divisorMeta,
  metaPorAsesor,
  siguienteTramo,
  tramosDe
} from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface FilaResultado {
  p: ParticipanteComision;
  barra: Barra;
  siguiente: SiguienteTramo | null;
  maximo: boolean;
}

/**
 * Vista de un solo lado del período (asesores o supervisor): sus reglas a la izquierda y
 * su resultado a la derecha. Nunca mezcla gente, roles ni tablas del otro lado.
 */
@Component({
  selector: 'cmx-rol-vista',
  standalone: true,
  imports: [AppNumberPipe, AppDateTimePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-body">
      <!-- ============ REGLAS ============ -->
      <div class="cmx-side" role="complementary" [attr.aria-label]="'Reglas del ' + nombreRol()">
        <h2 class="cmx-side-h">Reglas del {{ nombreRol() }}</h2>

        @if (esAsesor()) {
          <div class="cmx-rule cmx-enter">
            <div class="cmx-rule-head">
              <span class="cmx-rule-title">Meta mensual</span>
              <span class="cmx-rule-action is-ro">Reporte de producción</span>
            </div>
            <div class="cmx-rule-value">S/ {{ periodo().metaGrupal | appNumber:'1.2-2' }}</div>
            <div class="cmx-rule-desc">Se mide por <b>{{ metrica().logrado.toLowerCase() }}</b></div>
            <div class="cmx-rule-desc">
              @if (metaAsesor() != null) {
                Meta por asesor = S/ {{ periodo().metaGrupal | appNumber:'1.0-2' }} ÷ {{ n() }} =
                <b>S/ {{ metaAsesor() | appNumber:'1.2-2' }}</b>, igual para todos
              } @else {
                Sin asesores todavía: no hay meta por asesor.
              }
            </div>
            <div class="cmx-rule-desc">
              @if (periodo().divisionMeta === 'FIJO') {
                Divide entre <b>{{ periodo().asesoresFijos }} fijos</b> (configuración de la subcartera)
              } @else {
                Divide entre los asesores no quitados (automático)
              }
            </div>
          </div>
        } @else {
          <div class="cmx-rule cmx-enter">
            <div class="cmx-rule-head"><span class="cmx-rule-title">Se mide contra</span></div>
            <div class="cmx-rule-desc">
              La meta mensual completa de la subcartera (<b>S/ {{ periodo().metaGrupal | appNumber:'1.2-2' }}</b>) y lo que
              suman todos sus asesores. No tiene meta individual.
            </div>
          </div>
        }

        <div class="cmx-rule cmx-enter" style="--i:1">
          <div class="cmx-rule-head">
            <span class="cmx-rule-title">Tabla comisional</span>
            @if (editable()) {
              <button type="button" class="cmx-rule-action" (click)="editar.emit(rol())">Editar</button>
            } @else {
              <span class="cmx-rule-action is-ro">Solo lectura</span>
            }
          </div>
          @if (tramos().length) {
            <div style="margin-top:7px">
              @if (tramos()[0].porcentajeDesde > 0) {
                <div class="cmx-tier"><span>0 – {{ tramos()[0].porcentajeDesde }} %</span><b>S/ 0</b></div>
              }
              @for (t of tramos(); track t.porcentajeDesde; let last = $last; let j = $index) {
                <div class="cmx-tier">
                  <span>{{ t.porcentajeDesde }}{{ last ? ' % a más' : ' – ' + tramos()[j + 1].porcentajeDesde + ' %' }}</span>
                  <b>S/ {{ t.montoComision | appNumber:'1.0-2' }}</b>
                </div>
              }
            </div>
          } @else {
            <div class="cmx-rule-desc">Sin tramos: nadie de este lado comisiona.</div>
          }
        </div>

        <div class="cmx-rule cmx-enter" style="--i:2">
          <div class="cmx-rule-head">
            <span class="cmx-rule-title">Roles de Cashi que cuentan</span>
            @if (editable()) {
              <button type="button" class="cmx-rule-action" (click)="editar.emit(rol())">Editar</button>
            } @else {
              <span class="cmx-rule-action is-ro">Solo lectura</span>
            }
          </div>
          @if (roles().length) {
            <div class="cmx-rolchips">
              @for (r of roles(); track r.idRol) { <span class="cmx-tag cmx-tag-s">{{ r.nombreRol }}</span> }
            </div>
          } @else {
            <div class="cmx-rule-desc">Ningún rol elegido.</div>
          }
        </div>

        @if (periodo().excluidos.length) {
          <div class="cmx-rule cmx-enter" style="--i:3">
            <div class="cmx-rule-head"><span class="cmx-rule-title">Usuarios excluidos</span></div>
            <div class="cmx-rolchips">
              @for (u of periodo().excluidos; track u.idUsuario) { <span class="cmx-tag cmx-tag-off">{{ u.nombre }}</span> }
            </div>
          </div>
        }

        <div class="cmx-rule cmx-enter" style="--i:3">
          <div class="cmx-rule-head">
            <span class="cmx-rule-title">Participantes</span>
            @if (editable()) {
              <button type="button" class="cmx-rule-action" (click)="editar.emit(rol())">Editar</button>
            }
          </div>
          <div class="cmx-rule-desc">
            {{ activos() }} {{ esAsesor() ? (activos() === 1 ? 'asesor' : 'asesores') : (activos() === 1 ? 'supervisor' : 'supervisores') }}
            · @if (quitados()) { <b>{{ quitados() }} {{ quitados() === 1 ? 'quitado' : 'quitados' }}</b> } @else { ninguno quitado }
          </div>
        </div>
      </div>

      <!-- ============ RESULTADO ============ -->
      <div class="cmx-main">
        <div class="cmx-kpis cmx-enter">
          @for (k of kpis(); track k.l) {
            <div class="cmx-kpi">
              <div class="cmx-kpi-l">{{ k.l }}</div>
              <div class="cmx-kpi-v">@if (k.moneda) {<small>S/</small>}{{ k.v }}</div>
              @if (k.d) { <div class="cmx-kpi-d">{{ k.d }}</div> }
            </div>
          }
        </div>

        <section class="cmx-block cmx-enter" style="--i:1" [attr.aria-label]="'Comisión del ' + nombreRol()">
          <div class="cmx-block-head">
            <h3 class="cmx-block-title">Comisión por cumplimiento de meta</h3>
            <span class="cmx-block-desc">tabla comisional del {{ nombreRol() }} · haz clic en una fila para ver su sustento</span>
            <span class="cmx-block-extra">S/ {{ totalRol() | appNumber:'1.2-2' }}</span>
          </div>

          @if (filas().length) {
            <div class="cmx-tw">
              <table class="cmx-table">
                <thead>
                  <tr>
                    <th scope="col">{{ esAsesor() ? 'Asesor' : 'Supervisor' }}</th>
                    <th scope="col" class="n">Meta</th>
                    <th scope="col" class="n">{{ metrica().logrado }}</th>
                    <th scope="col">Posición en la tabla comisional</th>
                    <th scope="col" class="n">Comisión</th>
                  </tr>
                </thead>
                <tbody>
                  @for (f of filas(); track f.p.idResultado; let k = $index) {
                    @if (f.p.quitado) {
                      <tr class="is-muted is-click" tabindex="0" (click)="verSustento.emit(f.p)" (keydown.enter)="verSustento.emit(f.p)">
                        <td class="who">{{ f.p.nombre }}<span class="cmx-role">quitado del período</span></td>
                        <td class="n">—</td>
                        <td class="n">{{ f.p.logrado | appNumber:'1.2-2' }}</td>
                        <td class="na">No divide la meta ni comisiona</td>
                        <td class="n tot">0.00</td>
                      </tr>
                    } @else {
                      <tr class="is-click cmx-enter" [style.--i]="k + 1" tabindex="0"
                          (click)="verSustento.emit(f.p)" (keydown.enter)="verSustento.emit(f.p)"
                          [attr.aria-label]="'Ver sustento de ' + f.p.nombre">
                        <td class="who">{{ f.p.nombre }}</td>
                        <td class="n">{{ f.p.metaIndividual != null ? (f.p.metaIndividual | appNumber:'1.2-2') : '—' }}</td>
                        <td class="n">{{ f.p.logrado | appNumber:'1.2-2' }}</td>
                        <td>
                          @if (!calculado()) {
                            <span class="cmx-rule-desc">Sin cálculo</span>
                          } @else {
                            <div class="cmx-gauge" [attr.aria-label]="'Cumplimiento ' + (f.p.porcentajeCumplimiento ?? 0) + ' %'">
                              <div class="cmx-track">
                                @for (s of f.barra.segmentos; track $index) {
                                  <span [class]="'cmx-seg cmx-t' + s.nivel" [style.width.%]="s.ancho" [attr.title]="s.titulo"></span>
                                }
                                <span class="cmx-mk" [style.left.%]="f.barra.marcador" [style.--i]="k"></span>
                              </div>
                              <div class="cmx-cap">
                                <b>{{ f.p.porcentajeCumplimiento | appNumber:'1.1-1' }} %</b>
                                @if (f.maximo) {
                                  <span class="cmx-top-t">tramo máximo</span>
                                } @else if (f.siguiente) {
                                  <span class="cmx-gap-t">faltan S/ {{ f.siguiente.falta | appNumber:'1.0-0' }} → S/ {{ f.siguiente.monto | appNumber:'1.0-0' }}</span>
                                }
                              </div>
                            </div>
                          }
                        </td>
                        <td class="n tot">{{ f.p.montoComision | appNumber:'1.2-2' }}</td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <div class="cmx-empty">
              <span class="cmx-empty-mark"><cmx-icon name="users" [size]="20" /></span>
              <b>{{ esAsesor() ? 'No hay asesores en el período' : 'No hay supervisor en el período' }}</b>
              <p style="max-width:44ch">Salen de los roles de Cashi que se eligen en la configuración del {{ nombreRol() }}.</p>
              @if (editable()) {
                <button type="button" class="cmx-btn cmx-btn-sec" (click)="editar.emit(rol())">Elegir roles</button>
              }
            </div>
          }
          @if (calculado()) {
            <div class="cmx-block-foot">
              <span>Calculado el {{ periodo().fechaCalculo | appDateTime }}</span>
              <span>El tramo se decide con el monto exacto; el porcentaje es solo referencial.</span>
            </div>
          }
        </section>
      </div>
    </div>
  `
})
export class RolVistaComponent {
  private readonly fmt = inject(FormatService);

  readonly reporte = input.required<ReportePeriodo>();
  readonly rol = input.required<RolComision>();

  readonly verSustento = output<ParticipanteComision>();
  readonly editar = output<RolComision>();

  readonly periodo = computed(() => this.reporte().periodo);
  readonly esAsesor = computed(() => this.rol() === 'ASESOR');
  readonly nombreRol = computed(() => this.esAsesor() ? 'asesor' : 'supervisor');
  readonly metrica = computed(() => METRICA_INFO[this.periodo().tipoMetrica]);
  readonly editable = computed(() => this.periodo().estado === 'EN_CURSO');
  readonly calculado = computed(() => !!this.periodo().fechaCalculo);
  readonly n = computed(() => divisorMeta(this.periodo(), this.reporte().participantes));
  readonly metaAsesor = computed(() => metaPorAsesor(this.periodo(), this.reporte().participantes));
  readonly tramos = computed<EscalaComision[]>(() => tramosDe(this.periodo().escalas, this.rol()));
  readonly roles = computed(() => this.periodo().roles.filter(r => r.rolComision === this.rol()));

  private readonly gente = computed(() => this.reporte().participantes.filter(p => p.rol === this.rol()));
  readonly activos = computed(() => this.gente().filter(p => !p.quitado).length);
  readonly quitados = computed(() => this.gente().filter(p => p.quitado).length);
  readonly totalRol = computed(() => this.gente().filter(p => !p.quitado).reduce((s, p) => s + p.montoComision, 0));

  readonly filas = computed<FilaResultado[]>(() => {
    const base = this.esAsesor() ? this.metaAsesor() : this.periodo().metaGrupal;
    const tramos = this.tramos();
    const ultimo = tramos.length ? tramos[tramos.length - 1].porcentajeDesde : null;
    return this.gente().map(p => ({
      p,
      barra: construirBarra(tramos, p.porcentajeCumplimiento),
      siguiente: siguienteTramo(tramos, p.porcentajeTramo, p.logrado, base),
      maximo: ultimo != null && p.porcentajeTramo === ultimo
    }));
  });

  readonly kpis = computed(() => {
    const activos = this.gente().filter(p => !p.quitado);
    const logrado = activos.reduce((s, p) => s + p.logrado, 0);
    const meta = this.periodo().metaGrupal;
    const calculado = this.calculado();
    const pct = calculado && meta > 0 ? this.fmt2(this.equipoLogrado() / meta * 100, 1) + ' %' : '—';
    const etiquetaLogrado = this.metrica().logrado;
    if (this.esAsesor()) {
      return [
        { l: 'Comisiones asesores', v: this.fmt2(this.totalRol()), moneda: true, d: calculado ? '' : 'Sin cálculo' },
        { l: etiquetaLogrado + ' de asesores', v: this.fmt2(logrado), moneda: true, d: `${activos.length} ${activos.length === 1 ? 'asesor' : 'asesores'}` },
        { l: 'Cumplimiento del equipo', v: pct, moneda: false, d: 'Contra la meta completa' },
        { l: 'Meta por asesor', v: this.metaAsesor() != null ? this.fmt2(this.metaAsesor()!) : '—', moneda: this.metaAsesor() != null, d: '' }
      ];
    }
    return [
      { l: 'Comisión supervisor', v: this.fmt2(this.totalRol()), moneda: true, d: calculado ? '' : 'Sin cálculo' },
      { l: etiquetaLogrado + ' de la subcartera', v: this.fmt2(this.equipoLogrado()), moneda: true, d: 'Lo que suman sus asesores' },
      { l: 'Cumplimiento', v: pct, moneda: false, d: 'Contra la meta completa' },
      { l: 'Meta', v: this.fmt2(meta), moneda: true, d: '' }
    ];
  });

  /** Lo que suman los asesores no quitados (es el logrado del supervisor) */
  private equipoLogrado(): number {
    return this.reporte().participantes
      .filter(p => p.rol === 'ASESOR' && !p.quitado)
      .reduce((s, p) => s + p.logrado, 0);
  }

  private fmt2(valor: number, decimales = 2): string {
    return this.fmt.number(valor ?? 0, { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
  }
}
