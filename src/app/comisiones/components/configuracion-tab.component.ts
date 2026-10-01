import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import {
  BonoPeriodo,
  CandidatoAsesor,
  ConfiguracionPeriodo,
  EscalaComision,
  MetaCantidad,
  ReportePeriodo,
  RolComision,
  SupervisorCashi,
  TipoMetaCantidad,
  TipoMetrica,
  VistaPeriodo
} from '../models/comision.model';
import {
  GRUPO_INFO, METRICA_INFO, TIPOS_META, codigoPeriodo, diaMes, diasHabilesDesde, mensajeError, metasParaEditar
} from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface Nivel {
  clave: number;
  desde: number | null;
  monto: number | null;
}

interface MetaEditable {
  tipo: TipoMetaCantidad;
  activa: boolean;
  cantidadDia: number | null;
  monto: number | null;
}

let secuencia = 0;

/**
 * Configuración del mes: métrica, asesores que participan (el personal con la subcartera asignada en el
 * mes, con meta propia si es excepción), supervisor y escala. Con contención (TR3) además: escala por
 * nivel alcanzado o por logros y metas de cantidad del asesor. En Tramo Propio cada cartera (CP Antigua,
 * CP Nueva) escribe su meta a mano y un asesor va en una sola de las dos.
 * Cada mes es independiente; "Copiar configuración" trae la métrica, la escala, las metas de cantidad y
 * los bonos del mes anterior, sin participantes. Guardar no calcula: los resultados cambian al recalcular.
 * Las metas de cantidad se escriben por día hábil.
 */
@Component({
  selector: 'cmx-configuracion-tab',
  standalone: true,
  imports: [AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-cfg">
      <div>
        @if (copiadoDe()) {
          <div class="cmx-note is-info cmx-enter">
            Se copió la métrica, la escala, las metas de cantidad y los bonos de {{ copiadoDe() }}; puedes editarlos.
            Los participantes, el supervisor{{ grupo() ? ' y la meta' : '' }} no se copian: elígelos para {{ codigo() }}.
          </div>
        } @else if (esNuevo() && !soloLectura()) {
          <div class="cmx-note cmx-enter">
            <span style="flex:1;min-width:220px">Empiezas en blanco. Si quieres, trae la métrica, la escala, las metas y los bonos de {{ codigoAnterior() }} (sin participantes).</span>
            <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="copiando()" (click)="copiarAnterior()">
              <cmx-icon name="copy" [size]="15" /> {{ copiando() ? 'Copiando…' : 'Copiar configuración de ' + codigoAnterior() }}
            </button>
          </div>
        }

        <!-- Meta -->
        @if (grupo(); as g) {
        <section class="cmx-card cmx-enter">
          <div class="cmx-card-h">Meta del mes de {{ grupoInfo[g] }}<em>Se escribe a mano: Tramo Propio tiene dos carteras con metas distintas</em></div>
          <div class="cmx-card-b">
            <div class="cmx-field">
              <label for="cmx-meta-grupo">Meta mensual de {{ grupoInfo[g] }} en {{ codigo() }}</label>
              <span class="cmx-money" style="max-width:240px">
                <span>S/</span>
                <input id="cmx-meta-grupo" type="number" min="0" step="100" [value]="metaAjustada()" [disabled]="soloLectura()"
                       placeholder="Ej. 40200" (input)="cambiarMetaGrupo($any($event.target).value)" />
              </span>
              <span class="cmx-muted-txt">
                El reporte de producción tiene una sola meta para toda la subcartera
                ({{ vista().metaInterna != null ? 'S/ ' + (vista().metaInterna! | appNumber:'1.2-2') : 'sin registrar' }}); aquí va solo la de
                {{ grupoInfo[g] }}. Sin meta no se puede recalcular.
              </span>
            </div>
          </div>
        </section>
        } @else {
        <section class="cmx-card cmx-enter">
          <div class="cmx-card-h">Meta del mes<em>Meta INTERNA del reporte de producción</em></div>
          <div class="cmx-card-b cmx-metabox">
            <span class="cmx-metabox-v">S/ {{ metaDelMes() ?? 0 | appNumber:'1.2-2' }}</span>
            <span class="cmx-metabox-d">
              @if (metaAjustada() != null) {
                Ajustada solo para comisiones · reporte de producción: S/ {{ vista().metaInterna ?? 0 | appNumber:'1.2-2' }}
                @if (!soloLectura()) { · <button type="button" class="cmx-btn cmx-btn-link" (click)="metaAjustada.set(null)">Volver a la del reporte</button> }
              } @else if (vista().metaInterna == null) {
                <span class="cmx-warn-txt">No hay meta INTERNA de {{ codigo() }} en el reporte de producción: regístrala para poder calcular.</span>
              } @else {
                {{ vista().nombreSubcartera }} · {{ codigo() }}
              }
            </span>
          </div>
        </section>
        }

        <!-- Métrica -->
        <section class="cmx-card cmx-enter" style="--i:1">
          <div class="cmx-card-h">Qué se mide<em>Define qué pagos suman a la meta este periodo</em></div>
          <div class="cmx-card-b">
            <div class="cmx-grid2">
              @for (m of metricas; track m) {
                <label class="cmx-opt" [for]="'cmx-met-' + m">
                  <input type="radio" name="cmx-met" [id]="'cmx-met-' + m" [checked]="tipoMetrica() === m" [disabled]="soloLectura()"
                         (change)="tipoMetrica.set(m)" />
                  <span><b>{{ metricaInfo[m].etiqueta }}</b><span>{{ metricaInfo[m].descripcion }}</span></span>
                </label>
              }
            </div>
            <p class="cmx-formula">
              @if (tipoMetrica() == null) {
                Elige cómo se mide este periodo. No hay una opción marcada por defecto.
              } @else if (tipoMetrica() === 'CONTENCION') {
                Por cada cliente con al menos una conciliación ACTIVA del mes y contención = <code>CONTENIDO</code> se suma su
                <code>SLD_CAPITAL_ASIG</code> de la asignación, <b>una sola vez</b> aunque pague varias cuotas. Lo pagado no suma.
                Cuenta el día de su primer pago del mes (columnas según la configuración de cabeceras de la subcartera).
              } @else {
                Se suma el <code>monto_aplicado</code> de cada conciliación ACTIVA con fecha banco en {{ codigo() }}, sin mirar la contención.
              }
            </p>
          </div>
        </section>

        <!-- Asesores -->
        <section class="cmx-card cmx-enter" style="--i:2">
          <div class="cmx-card-h">
            Asesores que participan<em>{{ asesores().size }} de {{ disponibles() }}</em>
            @if (!soloLectura() && disponibles()) {
              <button type="button" class="cmx-btn cmx-btn-link" style="margin-left:auto" (click)="marcarTodos()">Marcar todos</button>
            }
          </div>
          <div class="cmx-card-b">
            <p class="cmx-hint" style="margin:0 0 10px">
              Salen de <b>Personal</b>: quienes tienen asignada {{ vista().nombreSubcartera }} en algún día de {{ codigo() }} y no cesaron antes del mes.
              @if (grupo()) { Cada persona va en <b>una sola</b> cartera: quien ya está en la otra aparece bloqueado. }
            </p>

            @if (cargandoCandidatos()) {
              <div style="display:grid;gap:8px">@for (i of [1, 2, 3]; track i) { <div class="cmx-skel" style="height:34px"></div> }</div>
            } @else if (!candidatos().length) {
              <p class="cmx-muted-txt">Nadie tiene {{ vista().nombreSubcartera }} asignada en Personal en {{ codigo() }}.</p>
            } @else {
              @for (u of candidatos(); track u.idUsuario) {
                @let dentro = asesores().has(u.idUsuario);
                @let propia = asesores().get(u.idUsuario);
                @let ingreso = ingresos().get(u.idUsuario);
                <div class="cmx-prow" [class.is-out]="!dentro">
                  <label class="cmx-prow-nm" [for]="'cmx-ase-' + u.idUsuario">
                    <input type="checkbox" [id]="'cmx-ase-' + u.idUsuario" [checked]="dentro" [disabled]="soloLectura() || (!!u.participaEn && !dentro)"
                           (change)="alternarAsesor(u.idUsuario)" />
                    <span>{{ u.nombre || 'Usuario ' + u.idUsuario }}</span>
                  </label>
                  @if (u.participaEn && !dentro) {
                    <span class="cmx-prow-st">Participa en {{ u.participaEn }}</span>
                  } @else if (dentro) {
                    @if (ingreso && propia == null) {
                      <span class="cmx-tag cmx-tag-v">Ingresó {{ diaMes(ingreso) }}</span>
                      <span class="cmx-prow-st">S/ {{ metaIngreso(ingreso) | appNumber:'1.2-2' }} · {{ diasDe(ingreso) }} de {{ vista().diasHabiles }} días hábiles</span>
                    } @else if (propia != null) {
                      <span class="cmx-tag cmx-tag-v">Meta propia</span>
                      <span class="cmx-money">
                        <span>S/</span>
                        <input type="number" min="0" step="100" [value]="propia" [disabled]="soloLectura()"
                               [attr.aria-label]="'Meta propia de ' + u.nombre" (input)="cambiarMetaPropia(u.idUsuario, $any($event.target).value)" />
                      </span>
                      @if (!soloLectura()) {
                        <button type="button" class="cmx-icon-btn" (click)="quitarMetaPropia(u.idUsuario)" aria-label="Quitar la meta propia">
                          <cmx-icon name="x" [size]="14" />
                        </button>
                      }
                    } @else {
                      <span class="cmx-prow-st">S/ {{ metaPorAsesor() | appNumber:'1.2-2' }} · meta ÷ {{ divisor() }}</span>
                      @if (!soloLectura()) {
                        <button type="button" class="cmx-btn cmx-btn-link" (click)="ponerMetaPropia(u.idUsuario)">Meta propia</button>
                      }
                    }
                  } @else {
                    <span class="cmx-prow-st">No participa</span>
                  }
                </div>
              }
            }
            <p class="cmx-hint">
              La meta del mes se divide entre los <b>{{ divisor() }}</b> asesores de mes completo: <b>S/ {{ metaPorAsesor() | appNumber:'1.2-2' }}</b>
              cada uno. Quien ingresa a mitad de mes («Agregar participante» en Resultados) o tiene meta propia no mueve esa división.
            </p>
          </div>
        </section>

        <!-- Supervisor -->
        <section class="cmx-card cmx-enter" style="--i:3">
          <div class="cmx-card-h">Supervisor<em>Comisiona sobre el {{ tipoMetrica() ? metricaInfo[tipoMetrica()!].etiqueta.toLowerCase() : 'recaudo o contención' }} total de los asesores contra la meta del mes</em></div>
          <div class="cmx-card-b">
            <div class="cmx-field">
              <label for="cmx-supervisor">Supervisor de {{ codigo() }}</label>
              <select id="cmx-supervisor" [disabled]="soloLectura()" (change)="cambiarSupervisor($any($event.target).value)">
                <option value="" [selected]="idSupervisor() == null">Sin supervisor</option>
                @for (g of gruposSupervisores(); track g.rol) {
                  <optgroup [label]="g.rol">
                    @for (s of g.usuarios; track s.idUsuario) {
                      <option [value]="s.idUsuario" [selected]="s.idUsuario === idSupervisor()">{{ s.nombre || 'Usuario ' + s.idUsuario }}</option>
                    }
                  </optgroup>
                }
              </select>
            </div>
          </div>
        </section>

        <!-- Escala -->
        <section class="cmx-card cmx-enter" style="--i:4">
          <div class="cmx-card-h">Escala de comisión<em>Cada nivel: % de cumplimiento → monto fijo en soles</em></div>
          <div class="cmx-card-b cmx-tcols">
            @for (lado of lados; track lado.rol) {
              <div>
                <h4 class="cmx-tcols-h">{{ lado.titulo }}</h4>
                @if (lado.rol === 'ASESOR' && conLogros()) {
                  <div class="cmx-pagomodo" role="radiogroup" aria-labelledby="cmx-acu-t">
                    <span id="cmx-acu-t" class="cmx-field-l">¿Cómo paga la escala del asesor?</span>
                    <label class="cmx-opt" for="cmx-acu-no">
                      <input type="radio" name="cmx-acumula" id="cmx-acu-no" [checked]="!escalaAcumulativa()" [disabled]="soloLectura()"
                             (change)="escalaAcumulativa.set(false)" />
                      <span><b>Nivel alcanzado</b><span>Cobra solo el nivel más alto al que llegó. Con 85 % cobra S/ 250.</span></span>
                    </label>
                    <label class="cmx-opt" for="cmx-acu-si">
                      <input type="radio" name="cmx-acumula" id="cmx-acu-si" [checked]="escalaAcumulativa()" [disabled]="soloLectura()"
                             (change)="escalaAcumulativa.set(true)" />
                      <span><b>Por logros</b><span>Cada nivel alcanzado se suma. Con 85 % cobra 200 + 250 = S/ 450.</span></span>
                    </label>
                  </div>
                }
                @for (n of niveles(lado.rol); track n.clave; let i = $index, last = $last) {
                  <div class="cmx-trow">
                    desde
                    <input type="number" min="0" max="999" [value]="n.desde" [disabled]="soloLectura()" [attr.aria-label]="'Nivel ' + (i + 1) + ': porcentaje desde'"
                           (input)="cambiarNivel(lado.rol, n.clave, 'desde', $any($event.target).value)" />%
                    <span class="cmx-trow-hasta">{{ last ? 'a más' : 'hasta ' + (niveles(lado.rol)[i + 1].desde ?? '…') + ' %' }}</span>
                    S/
                    <input type="number" min="0" step="50" [value]="n.monto" [disabled]="soloLectura()" [attr.aria-label]="'Nivel ' + (i + 1) + ': monto'"
                           (input)="cambiarNivel(lado.rol, n.clave, 'monto', $any($event.target).value)" />
                    @if (!soloLectura()) {
                      <button type="button" class="cmx-trow-del" (click)="quitarNivel(lado.rol, n.clave)" aria-label="Quitar nivel"><cmx-icon name="x" [size]="14" /></button>
                    }
                  </div>
                } @empty {
                  <div class="cmx-trow cmx-muted-txt">Sin niveles: nadie comisiona de este lado.</div>
                }
                @if (!soloLectura()) {
                  <button type="button" class="cmx-btn cmx-btn-link" style="margin-top:6px" (click)="agregarNivel(lado.rol)">
                    <cmx-icon name="plus" [size]="14" /> Agregar nivel
                  </button>
                }
              </div>
            }
          </div>
        </section>

        <!-- Metas de cantidad (TR3: solo cuando se mide contención) -->
        @if (conLogros()) {
        <section class="cmx-card cmx-enter" style="--i:5">
          <div class="cmx-card-h">Metas de cantidad del asesor<em>Opcionales. Cada meta cumplida suma su monto a la comisión</em></div>
          <div class="cmx-card-b">
            <div class="cmx-dhab">
              <b class="cmx-num">{{ vista().diasHabiles }}</b> días hábiles en {{ codigo() }}
              <span>lunes a viernes{{ vista().feriados.length ? ', sin ' + vista().feriados.length + (vista().feriados.length > 1 ? ' feriados' : ' feriado') : ', sin feriados' }}</span>
            </div>
            <div class="cmx-mcrow is-hd" aria-hidden="true"><span>Meta</span><span>Días hábiles</span><span>Por día</span><span>Llegar a</span><span>Paga</span></div>
            @for (m of metas(); track m.tipo; let i = $index) {
              @let t = tipoMeta(m.tipo);
              <div class="cmx-mcrow" [class.is-off]="!m.activa">
                <label [for]="'cmx-mc-' + m.tipo">
                  <input type="checkbox" [id]="'cmx-mc-' + m.tipo" [checked]="m.activa" [disabled]="soloLectura()" (change)="alternarMeta(i)" />
                  <span><b>{{ nombreMeta(t.nombre) }}</b><span>{{ t.descripcion }}</span></span>
                </label>
                @if (m.tipo === 'META') {
                  <span class="cmx-mc-fixed is-span3">100 % de su meta individual</span>
                } @else {
                  <span class="cmx-mc-dnum">{{ vista().diasHabiles }}</span>
                  <span class="cmx-money">
                    <input type="number" min="0" step="1" [value]="m.cantidadDia" [disabled]="soloLectura() || !m.activa" placeholder="Por día"
                           [attr.aria-label]="t.nombre + ' por día'" (input)="cambiarMeta(i, 'cantidadDia', $any($event.target).value)" />
                    <span class="is-suffix">/ día</span>
                  </span>
                  <span class="cmx-mc-llegar">
                    @if (m.cantidadDia != null) { {{ m.cantidadDia * vista().diasHabiles | appNumber:'1.0-0' }} <small>{{ t.unidad }}</small> } @else { — }
                  </span>
                }
                <span class="cmx-money">
                  <span>S/</span>
                  <input type="number" min="0" step="10" [value]="m.monto" [disabled]="soloLectura() || !m.activa" placeholder="Monto"
                         [attr.aria-label]="'Monto de ' + t.nombre" (input)="cambiarMeta(i, 'monto', $any($event.target).value)" />
                </span>
              </div>
            }
          </div>
        </section>
        }
      </div>

      <!-- Resumen y acciones (sin cálculo: los montos salen al recalcular) -->
      <div>
        <div class="cmx-prev cmx-enter" style="--i:2;position:sticky;top:12px">
          <div class="cmx-prev-t">{{ soloLectura() ? 'Configuración congelada' : 'Lo que vas a guardar' }}</div>
          <div class="cmx-prev-r"><span>Métrica</span><b class="is-txt">{{ tipoMetrica() ? metricaInfo[tipoMetrica()!].etiqueta : '—' }}</b></div>
          @if (grupo(); as g) { <div class="cmx-prev-r"><span>Cartera</span><b class="is-txt">{{ grupoInfo[g] }}</b></div> }
          <div class="cmx-prev-r"><span>Asesores</span><b>{{ asesores().size }}@if (conMetaPropiaOIngreso()) { <small class="is-txt"> ({{ conMetaPropiaOIngreso() }} con meta propia o ingreso)</small> }</b></div>
          <div class="cmx-prev-r"><span>Supervisor</span><b class="is-txt">{{ nombreSupervisor() }}</b></div>
          <div class="cmx-prev-r"><span>Meta del mes</span><b>S/ {{ metaDelMes() ?? 0 | appNumber:'1.2-2' }}</b></div>
          <div class="cmx-prev-r"><span>Niveles asesor / supervisor</span><b>{{ nivelesAsesor().length }} / {{ nivelesSupervisor().length }}</b></div>
          @if (conLogros()) {
            <div class="cmx-prev-r"><span>Escala del asesor</span><b class="is-txt">{{ escalaAcumulativa() ? 'Por logros' : 'Nivel alcanzado' }}</b></div>
            <div class="cmx-prev-r"><span>Metas de cantidad</span><b>{{ metasActivas() }}</b></div>
          }
          @if (!soloLectura()) {
            <p class="cmx-prev-n">Guardar no calcula nada. Las comisiones salen cuando pulses <b>Recalcular</b>.</p>
          }
        </div>

        @for (f of faltantes(); track f) { <div class="cmx-warnbox">{{ f }}</div> }

        @if (!soloLectura()) {
          <div class="cmx-cfg-actions">
            <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="guardando() || !sucio()" (click)="descartar()">Descartar</button>
            <button type="button" class="cmx-btn cmx-btn-act" [disabled]="guardando() || faltantes().length > 0 || !sucio()" (click)="guardar()">
              <cmx-icon name="check" [size]="15" /> {{ guardando() ? 'Guardando…' : esNuevo() ? 'Configurar ' + codigo() : 'Guardar configuración' }}
            </button>
          </div>
        }
      </div>
    </div>
  `
})
export class ConfiguracionTabComponent {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly vista = input.required<VistaPeriodo>();
  readonly soloLectura = input(false);

  readonly guardado = output<ReportePeriodo>();

  readonly metricaInfo = METRICA_INFO;
  readonly grupoInfo = GRUPO_INFO;
  readonly diaMes = diaMes;
  readonly metricas: TipoMetrica[] = ['RECAUDO', 'CONTENCION'];
  readonly lados: { rol: RolComision; titulo: string }[] = [
    { rol: 'ASESOR', titulo: 'Asesor · sobre su meta individual' },
    { rol: 'SUPERVISOR', titulo: 'Supervisor · sobre la meta del mes' }
  ];

  // Borrador
  /** null = todavía no se eligió (mes nuevo sin copiar) */
  readonly tipoMetrica = signal<TipoMetrica | null>(null);
  /** idUsuario → meta propia (null = divide la meta del mes) */
  readonly asesores = signal<Map<number, number | null>>(new Map());
  /** idUsuario → fecha de ingreso (yyyy-mm-dd) de quien entró a mitad de mes; se agrega desde Resultados */
  readonly ingresos = signal<Map<number, string>>(new Map());
  readonly idSupervisor = signal<number | null>(null);
  /** En Tramo Propio, la meta de la cartera escrita a mano */
  readonly metaAjustada = signal<number | null>(null);
  readonly nivelesAsesor = signal<Nivel[]>([]);
  readonly nivelesSupervisor = signal<Nivel[]>([]);
  readonly escalaAcumulativa = signal(false);
  readonly metas = signal<MetaEditable[]>(metasParaEditar([]));
  /** Bonos traídos con "Copiar configuración"; null = no se tocan los del período */
  readonly bonosCopiados = signal<BonoPeriodo[] | null>(null);
  readonly copiadoDe = signal<string | null>(null);
  /** Firma del borrador al cargarlo: para saber si hay cambios sin guardar */
  private readonly inicialFirma = signal('');

  // Catálogos
  readonly candidatos = signal<CandidatoAsesor[]>([]);
  readonly supervisores = signal<SupervisorCashi[]>([]);
  readonly cargandoCandidatos = signal(false);

  readonly guardando = signal(false);
  readonly copiando = signal(false);

  readonly codigo = computed(() => codigoPeriodo(this.vista().anio, this.vista().mes));
  readonly codigoAnterior = computed(() => {
    const v = this.vista();
    return v.mes === 1 ? codigoPeriodo(v.anio - 1, 12) : codigoPeriodo(v.anio, v.mes - 1);
  });
  readonly esNuevo = computed(() => !this.vista().reporte);
  /** Cartera de Tramo Propio; null en las demás subcarteras */
  readonly grupo = computed(() => this.vista().grupo !== 'GENERAL' ? this.vista().grupo : null);
  readonly metaDelMes = computed(() => this.grupo() ? this.metaAjustada() : this.metaAjustada() ?? this.vista().metaInterna);
  /** Candidatos que se pueden elegir (sin los que ya están en la otra cartera) */
  readonly disponibles = computed(() => this.candidatos().filter(u => !u.participaEn || this.asesores().has(u.idUsuario)).length);
  /** Dividen la meta del mes los asesores de mes completo (sin meta propia ni ingreso a mitad de mes) */
  readonly divisor = computed(() => Math.max(
    [...this.asesores().entries()].filter(([id, m]) => m == null && !this.ingresos().has(id)).length, 1));
  readonly metaPorAsesor = computed(() => (this.metaDelMes() ?? 0) / this.divisor());
  readonly conMetaPropiaOIngreso = computed(() =>
    [...this.asesores().entries()].filter(([id, m]) => m != null || this.ingresos().has(id)).length);
  readonly nombreSupervisor = computed(() => {
    const id = this.idSupervisor();
    return id == null ? 'Sin supervisor' : this.supervisores().find(s => s.idUsuario === id)?.nombre || 'Usuario ' + id;
  });
  readonly metasActivas = computed(() => this.metas().filter(m => m.activa).length);

  readonly gruposSupervisores = computed(() => {
    const grupos = new Map<string, SupervisorCashi[]>();
    for (const s of this.supervisores()) {
      grupos.set(s.nombreRol, [...(grupos.get(s.nombreRol) ?? []), s]);
    }
    return [...grupos.entries()].map(([rol, usuarios]) => ({ rol, usuarios }));
  });

  readonly configuracion = computed<ConfiguracionPeriodo | null>(() => {
    const tipoMetrica = this.tipoMetrica();
    if (tipoMetrica == null) {
      return null;
    }
    const v = this.vista();
    return {
      idSubcartera: v.idSubcartera,
      anio: v.anio,
      mes: v.mes,
      grupo: v.grupo,
      tipoMetrica,
      asesores: [...this.asesores().entries()].map(([idUsuario, metaManual]) => ({
        idUsuario,
        metaManual,
        fechaIngreso: this.ingresos().get(idUsuario) ?? null
      })),
      idSupervisor: this.idSupervisor(),
      metaAjustada: this.metaAjustada(),
      escalas: [
        ...this.aEscala('ASESOR', this.nivelesAsesor()),
        ...this.aEscala('SUPERVISOR', this.nivelesSupervisor())
      ],
      // Logros y metas de cantidad solo cuando se mide contención (TR3)
      escalaAcumulativa: tipoMetrica === 'CONTENCION' && this.escalaAcumulativa(),
      metasCantidad: this.metas()
        .filter(m => tipoMetrica === 'CONTENCION' && m.activa && m.monto != null)
        .map<MetaCantidad>(m => ({ tipo: m.tipo, cantidadDia: m.tipo === 'META' ? null : m.cantidadDia, monto: m.monto! })),
      bonos: this.bonosCopiados()
    };
  });

  readonly sucio = computed(() => this.firma(this.configuracion()) !== this.inicialFirma());

  readonly faltantes = computed(() => {
    const f: string[] = [];
    if (this.tipoMetrica() == null) {
      f.push('Elige qué se mide: recaudo o contención.');
    }
    if (!this.asesores().size) {
      f.push('Todavía no hay asesores participando: márcalos en «Asesores que participan».');
    }
    if ([...this.asesores().values()].some(m => m != null && !(m > 0))) {
      f.push('Cada meta propia debe ser mayor a 0.');
    }
    if (!this.nivelesAsesor().length) {
      f.push('La escala del asesor está vacía: nadie comisiona. Agrega al menos un nivel.');
    }
    if ([...this.nivelesAsesor(), ...this.nivelesSupervisor()].some(n => n.desde == null || n.monto == null || n.desde < 0 || n.monto < 0)) {
      f.push('Completa el porcentaje y el monto de cada nivel.');
    }
    if (this.repetidos()) {
      f.push('Hay dos niveles con el mismo porcentaje en un lado de la escala.');
    }
    const grupo = this.grupo();
    if (grupo && !((this.metaAjustada() ?? 0) > 0)) {
      f.push(`Escribe la meta del mes de ${GRUPO_INFO[grupo]}.`);
    } else if (this.metaDelMes() == null) {
      f.push('Falta la meta INTERNA del mes en el reporte de producción.');
    }
    if (this.conLogros() && this.metas().some(m => m.activa && (!(m.monto! > 0) || (m.tipo !== 'META' && !(m.cantidadDia! > 0))))) {
      f.push('Completa la cantidad por día y el monto de cada meta de cantidad marcada.');
    }
    return f;
  });

  constructor() {
    this.service.listarSupervisores().subscribe({
      next: s => this.supervisores.set(s),
      error: e => this.toast.error(mensajeError(e, 'No se pudieron cargar los supervisores.'))
    });

    // Cada vista (otra subcartera, otro mes, o el período recién guardado) reinicia el borrador
    effect(() => {
      const v = this.vista();
      untracked(() => this.cargarBorrador(v));
    });
  }

  /** Logros y metas de cantidad son de TR3, la única que se mide por contención */
  readonly conLogros = computed(() => this.tipoMetrica() === 'CONTENCION');

  readonly etiquetaMetrica = computed(() => {
    const t = this.tipoMetrica();
    return t ? METRICA_INFO[t].etiqueta.toLowerCase() : 'la métrica';
  });

  tipoMeta(tipo: TipoMetaCantidad) {
    return TIPOS_META.find(t => t.tipo === tipo)!;
  }

  nombreMeta(nombre: string): string {
    return nombre.replace('%MET%', this.etiquetaMetrica());
  }

  alternarMeta(i: number): void {
    this.metas.update(l => l.map((m, j) => j === i ? { ...m, activa: !m.activa } : m));
  }

  cambiarMeta(i: number, campo: 'cantidadDia' | 'monto', valor: string): void {
    const n = valor === '' ? null : Number(valor);
    this.metas.update(l => l.map((m, j) => j === i ? { ...m, [campo]: n != null && Number.isFinite(n) ? n : null } : m));
  }

  niveles(rol: RolComision): Nivel[] {
    return rol === 'ASESOR' ? this.nivelesAsesor() : this.nivelesSupervisor();
  }

  /** Días hábiles que trabaja quien ingresó en esa fecha (inclusive) */
  diasDe(fecha: string): number {
    const v = this.vista();
    return diasHabilesDesde(v.anio, v.mes, Number(fecha.slice(8, 10)), v.feriados);
  }

  /** Meta de quien ingresó: meta de un asesor de mes completo × sus días ÷ días hábiles del mes */
  metaIngreso(fecha: string): number {
    const diasMes = this.vista().diasHabiles;
    return diasMes ? this.metaPorAsesor() * this.diasDe(fecha) / diasMes : 0;
  }

  // ==================== EDICIÓN ====================

  cambiarMetaGrupo(valor: string): void {
    const n = valor === '' ? null : Number(valor);
    this.metaAjustada.set(n != null && Number.isFinite(n) ? n : null);
  }

  alternarAsesor(idUsuario: number): void {
    this.asesores.update(m => {
      const n = new Map(m);
      if (n.has(idUsuario)) {
        n.delete(idUsuario);
        this.ingresos.update(i => { const c = new Map(i); c.delete(idUsuario); return c; });
      } else {
        n.set(idUsuario, null);
      }
      return n;
    });
  }

  marcarTodos(): void {
    this.asesores.update(m => {
      const n = new Map(m);
      this.candidatos().forEach(u => { if (!n.has(u.idUsuario) && !u.participaEn) { n.set(u.idUsuario, null); } });
      return n;
    });
  }

  ponerMetaPropia(idUsuario: number): void {
    this.asesores.update(m => new Map(m).set(idUsuario, Math.round(this.metaPorAsesor())));
  }

  cambiarMetaPropia(idUsuario: number, valor: string): void {
    const n = valor === '' ? 0 : Number(valor);
    this.asesores.update(m => new Map(m).set(idUsuario, Number.isFinite(n) ? n : 0));
  }

  quitarMetaPropia(idUsuario: number): void {
    this.asesores.update(m => new Map(m).set(idUsuario, null));
  }

  cambiarSupervisor(valor: string): void {
    this.idSupervisor.set(valor ? Number(valor) : null);
  }

  cambiarNivel(rol: RolComision, clave: number, campo: 'desde' | 'monto', valor: string): void {
    const n = valor === '' ? null : Number(valor);
    this.lista(rol).update(l => l.map(x => x.clave === clave ? { ...x, [campo]: n != null && Number.isFinite(n) ? n : null } : x));
  }

  agregarNivel(rol: RolComision): void {
    this.lista(rol).update(l => {
      const tope = l.reduce((m, x) => Math.max(m, x.desde ?? 0), -10);
      const monto = l.reduce((m, x) => Math.max(m, x.monto ?? 0), 0);
      return [...l, { clave: ++secuencia, desde: tope + 10, monto: monto + 100 }];
    });
  }

  quitarNivel(rol: RolComision, clave: number): void {
    this.lista(rol).update(l => l.filter(x => x.clave !== clave));
  }

  copiarAnterior(): void {
    const v = this.vista();
    const anio = v.mes === 1 ? v.anio - 1 : v.anio;
    const mes = v.mes === 1 ? 12 : v.mes - 1;
    this.copiando.set(true);
    this.service.obtenerVista(v.idSubcartera, anio, mes, v.grupo).subscribe({
      next: anterior => {
        this.copiando.set(false);
        const p = anterior.reporte?.periodo;
        if (!p) {
          this.toast.warning(`${codigoPeriodo(anio, mes)} no tiene configuración para copiar.`);
          return;
        }
        this.tipoMetrica.set(p.tipoMetrica);
        this.nivelesAsesor.set(this.aNiveles(p.escalas, 'ASESOR'));
        this.nivelesSupervisor.set(this.aNiveles(p.escalas, 'SUPERVISOR'));
        this.escalaAcumulativa.set(!!p.escalaAcumulativa);
        this.metas.set(metasParaEditar(p.metasCantidad));
        this.bonosCopiados.set((p.bonos ?? []).map(b => ({ ...b, id: null })));
        this.copiadoDe.set(codigoPeriodo(anio, mes));
      },
      error: e => {
        this.copiando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo copiar la configuración.'));
      }
    });
  }

  descartar(): void {
    this.cargarBorrador(this.vista());
  }

  guardar(): void {
    const config = this.configuracion();
    if (!config || this.faltantes().length) {
      return;
    }
    this.guardando.set(true);
    this.service.guardarConfiguracion(config).subscribe({
      next: reporte => {
        this.guardando.set(false);
        const aviso = reporte.advertencias?.find(a => a.startsWith('No se pudo calcular'));
        if (aviso) {
          this.toast.warning(aviso);
        } else {
          this.toast.success(this.esNuevo() ? `${this.codigo()} configurado · pulsa Recalcular para calcular` : 'Guardado · se aplica al recalcular');
        }
        this.guardado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo guardar la configuración.'));
      }
    });
  }

  // ==================== INTERNOS ====================

  private cargarBorrador(v: VistaPeriodo): void {
    const p = v.reporte?.periodo ?? null;
    const participantes = v.reporte?.participantes ?? [];

    this.copiadoDe.set(null);
    // Mes nuevo: sin métrica elegida; la trae "Copiar configuración" o la elige quien configura
    this.tipoMetrica.set(p?.tipoMetrica ?? null);
    this.asesores.set(new Map(participantes.filter(x => x.rol === 'ASESOR').map(x => [x.idUsuario, x.metaManual])));
    this.ingresos.set(new Map(participantes
      .filter(x => x.rol === 'ASESOR' && x.fechaIngreso)
      .map(x => [x.idUsuario, x.fechaIngreso!.slice(0, 10)])));
    this.idSupervisor.set(participantes.find(x => x.rol === 'SUPERVISOR')?.idUsuario ?? null);
    this.metaAjustada.set(p?.metaAjustada ?? null);
    this.nivelesAsesor.set(this.aNiveles(p?.escalas ?? [], 'ASESOR'));
    this.nivelesSupervisor.set(this.aNiveles(p?.escalas ?? [], 'SUPERVISOR'));
    this.escalaAcumulativa.set(!!p?.escalaAcumulativa);
    this.metas.set(metasParaEditar(p?.metasCantidad));
    this.bonosCopiados.set(null);
    this.inicialFirma.set(this.firma(this.configuracion()));

    this.cargarCandidatos(v);
  }

  /** El personal con la subcartera en el mes (el backend agrega a quien ya participa aunque hoy no esté) */
  private cargarCandidatos(v: VistaPeriodo): void {
    this.cargandoCandidatos.set(true);
    this.candidatos.set([]);
    this.service.listarAsesores(v.idSubcartera, v.anio, v.mes, v.grupo).subscribe({
      next: candidatos => {
        if (v === this.vista()) {
          this.candidatos.set(candidatos);
        }
        this.cargandoCandidatos.set(false);
      },
      error: e => {
        this.cargandoCandidatos.set(false);
        this.toast.error(mensajeError(e, 'No se pudo cargar el personal de la subcartera.'));
      }
    });
  }

  private lista(rol: RolComision) {
    return rol === 'ASESOR' ? this.nivelesAsesor : this.nivelesSupervisor;
  }

  private aNiveles(escalas: EscalaComision[], rol: RolComision): Nivel[] {
    return escalas
      .filter(e => e.rol === rol)
      .sort((a, b) => a.porcentajeDesde - b.porcentajeDesde)
      .map(e => ({ clave: ++secuencia, desde: e.porcentajeDesde, monto: e.montoComision }));
  }

  private aEscala(rol: RolComision, niveles: Nivel[]): EscalaComision[] {
    return niveles
      .filter(n => n.desde != null && n.monto != null)
      .map(n => ({ rol, porcentajeDesde: n.desde!, montoComision: n.monto! }))
      .sort((a, b) => a.porcentajeDesde - b.porcentajeDesde);
  }

  private repetidos(): boolean {
    return (['ASESOR', 'SUPERVISOR'] as RolComision[]).some(rol => {
      const desdes = this.niveles(rol).map(n => n.desde).filter(d => d != null);
      return new Set(desdes).size !== desdes.length;
    });
  }

  private firma(config: ConfiguracionPeriodo | null): string {
    if (!config) {
      return '';
    }
    return JSON.stringify({ ...config, asesores: [...config.asesores].sort((a, b) => a.idUsuario - b.idUsuario) });
  }
}
