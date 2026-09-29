import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { Subject, Subscription, debounceTime } from 'rxjs';
import { ComisionesService } from '../services/comisiones.service';
import {
  BonoPeriodo,
  ConfiguracionPeriodo,
  EscalaComision,
  MetaCantidad,
  ReportePeriodo,
  RolCashi,
  RolComision,
  SimulacionPeriodo,
  SupervisorCashi,
  TipoMetaCantidad,
  TipoMetrica,
  UsuarioCashi,
  VistaPeriodo
} from '../models/comision.model';
import { METRICA_INFO, TIPOS_META, codigoPeriodo, mensajeError, metasParaEditar } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface Nivel {
  clave: number;
  desde: number | null;
  monto: number | null;
}

interface MetaEditable {
  tipo: TipoMetaCantidad;
  activa: boolean;
  cantidad: number | null;
  monto: number | null;
}

let secuencia = 0;

/**
 * Configuración del mes: métrica, rol y asesores que participan (con meta propia si es excepción),
 * supervisor y escala. Con contención (TR3) además: escala por nivel alcanzado o por logros y metas
 * de cantidad del asesor.
 * Cada mes es independiente; "Copiar configuración" trae la métrica, el rol, la escala, las metas
 * de cantidad y los bonos del mes anterior, sin participantes. La vista previa se calcula en el
 * backend con los pagos de hoy.
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
            Se copió la métrica, el rol, la escala, las metas de cantidad y los bonos de {{ copiadoDe() }}; puedes editarlos.
            Los participantes y el supervisor no se copian: elígelos para {{ codigo() }}.
          </div>
        } @else if (esNuevo() && !soloLectura()) {
          <div class="cmx-note cmx-enter">
            <span style="flex:1;min-width:220px">Empiezas en blanco. Si quieres, trae la métrica, el rol, la escala, las metas y los bonos de {{ codigoAnterior() }} (sin participantes).</span>
            <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="copiando()" (click)="copiarAnterior()">
              <cmx-icon name="copy" [size]="15" /> {{ copiando() ? 'Copiando…' : 'Copiar configuración de ' + codigoAnterior() }}
            </button>
          </div>
        }

        <!-- Meta -->
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
                Se suma el <code>monto_aplicado</code> de cada conciliación ACTIVA del mes cuyo cliente tiene contención =
                <code>CONTENIDO</code> (columna según la configuración de cabeceras de la subcartera).
              } @else {
                Se suma el <code>monto_aplicado</code> de cada conciliación ACTIVA con fecha banco en {{ codigo() }}, sin mirar la contención.
              }
            </p>
          </div>
        </section>

        <!-- Asesores -->
        <section class="cmx-card cmx-enter" style="--i:2">
          <div class="cmx-card-h">
            Asesores que participan<em>{{ asesores().size }} de {{ candidatos().length }}{{ rolElegido() ? ' · rol ' + rolElegido()!.nombreRol : '' }}</em>
            @if (!soloLectura() && candidatos().length) {
              <button type="button" class="cmx-btn cmx-btn-link" style="margin-left:auto" (click)="marcarTodos()">Marcar todos</button>
            }
          </div>
          <div class="cmx-card-b">
            <div class="cmx-rolpick">
              <div class="cmx-field">
                <label for="cmx-rol-asesor">Rol de los asesores</label>
                <select id="cmx-rol-asesor" [disabled]="soloLectura()" (change)="cambiarRol($any($event.target).value)">
                  <option value="" disabled [selected]="idRol() == null">Elige el rol</option>
                  @for (r of roles(); track r.idRol) {
                    <option [value]="r.idRol" [selected]="r.idRol === idRol()">{{ r.nombreRol }}{{ r.asignadoASubcartera ? '' : ' (no asignado a la subcartera)' }}</option>
                  }
                </select>
              </div>
              <span class="cmx-rolpick-hint">
                @if (vista().rolSugerido; as s) {
                  {{ s.idRol === idRol() ? 'Sugerido para esta subcartera.' : 'El sugerido para esta subcartera es ' + s.nombreRol + '.' }}
                }
                Al cambiarlo se vacía la lista de participantes.
              </span>
            </div>

            @if (cargandoCandidatos()) {
              <div style="display:grid;gap:8px">@for (i of [1, 2, 3]; track i) { <div class="cmx-skel" style="height:34px"></div> }</div>
            } @else if (!idRol()) {
              <p class="cmx-muted-txt">Elige el rol para ver a los asesores.</p>
            } @else if (!candidatos().length) {
              <p class="cmx-muted-txt">Nadie tiene el rol {{ rolElegido()?.nombreRol }} en Cashi.</p>
            } @else {
              @for (u of candidatos(); track u.idUsuario) {
                @let dentro = asesores().has(u.idUsuario);
                @let propia = asesores().get(u.idUsuario);
                <div class="cmx-prow" [class.is-out]="!dentro">
                  <label class="cmx-prow-nm" [for]="'cmx-ase-' + u.idUsuario">
                    <input type="checkbox" [id]="'cmx-ase-' + u.idUsuario" [checked]="dentro" [disabled]="soloLectura()" (change)="alternarAsesor(u.idUsuario)" />
                    <span>{{ u.nombre || 'Usuario ' + u.idUsuario }}</span>
                  </label>
                  @if (dentro) {
                    @if (propia != null) {
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
                  <span class="cmx-prow-am">S/ {{ logradoDe(u.idUsuario) | appNumber:'1.2-2' }}</span>
                </div>
              }
            }
            <p class="cmx-hint">
              La meta del mes se divide entre los <b>{{ divisor() }}</b> asesores sin meta propia: <b>S/ {{ metaPorAsesor() | appNumber:'1.2-2' }}</b>
              cada uno. Quien tiene meta propia (por ejemplo, porque entró a mitad de mes) no mueve esa división.
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
            <div class="cmx-mcrow is-hd" aria-hidden="true"><span>Meta</span><span>Llegar a</span><span>Paga</span></div>
            @for (m of metas(); track m.tipo; let i = $index) {
              @let t = tipoMeta(m.tipo);
              <div class="cmx-mcrow" [class.is-off]="!m.activa">
                <label [for]="'cmx-mc-' + m.tipo">
                  <input type="checkbox" [id]="'cmx-mc-' + m.tipo" [checked]="m.activa" [disabled]="soloLectura()" (change)="alternarMeta(i)" />
                  <span><b>{{ nombreMeta(t.nombre) }}</b><span>{{ t.descripcion }}</span></span>
                </label>
                @if (m.tipo === 'META') {
                  <span class="cmx-mc-fixed">100 % de su meta individual</span>
                } @else {
                  <span class="cmx-money">
                    <input type="number" min="0" step="1" [value]="m.cantidad" [disabled]="soloLectura() || !m.activa" placeholder="Cantidad"
                           [attr.aria-label]="'Cantidad de ' + t.nombre" (input)="cambiarMeta(i, 'cantidad', $any($event.target).value)" />
                    <span class="is-suffix">{{ t.unidad }}</span>
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

      <!-- Vista previa y acciones -->
      <div>
        <div class="cmx-prev cmx-enter" style="--i:2;position:sticky;top:12px">
          <div class="cmx-prev-t">{{ soloLectura() ? 'Resultado congelado' : 'Así quedaría con lo pagado a la fecha' }}</div>
          @if (simulando() && !simulacion()) {
            <div class="cmx-skel" style="height:90px"></div>
          } @else if (errorSimulacion()) {
            <p class="cmx-err-txt">{{ errorSimulacion() }}</p>
          } @else if (simulacion(); as s) {
            @for (p of s.participantes; track p.idUsuario) {
              <div class="cmx-prev-r">
                <span>{{ p.nombre }}{{ p.rol === 'SUPERVISOR' ? ' (sup.)' : '' }} · {{ p.porcentajeCumplimiento ?? 0 | appNumber:'1.1-1' }} %</span>
                <b>S/ {{ p.montoComision | appNumber:'1.2-2' }}@if (p.montoBonos) { <small> + {{ p.montoBonos | appNumber:'1.0-0' }}</small> }</b>
              </div>
            } @empty {
              <p class="cmx-muted-txt">Marca a los asesores para ver cuánto cobraría cada uno.</p>
            }
            <div class="cmx-prev-r is-tot"><span><b style="font-family:inherit">Total</b></span><b>S/ {{ s.totalComisiones | appNumber:'1.2-2' }}</b></div>
            @if (s.totalBonos) {
              <div class="cmx-prev-r"><span>Bonos (aparte)</span><b>S/ {{ s.totalBonos | appNumber:'1.2-2' }}</b></div>
            }
            @if (totalGuardado() != null && !soloLectura()) {
              <p class="cmx-prev-n">
                Hoy: S/ {{ totalGuardado() | appNumber:'1.2-2' }}
                @if (diferencia(); as d) { · {{ d > 0 ? '+' : '−' }}S/ {{ (d > 0 ? d : -d) | appNumber:'1.2-2' }} con estos cambios } @else { · sin cambios }
              </p>
            }
            @for (a of s.advertencias; track $index) { <p class="cmx-prev-n">{{ a }}</p> }
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
          <p class="cmx-cfg-note">
            Esta configuración es solo de {{ codigo() }}. Al guardar se calcula en el momento con los pagos conciliados que ya hay;
            los demás meses no cambian.
          </p>
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
  readonly metricas: TipoMetrica[] = ['RECAUDO', 'CONTENCION'];
  readonly lados: { rol: RolComision; titulo: string }[] = [
    { rol: 'ASESOR', titulo: 'Asesor · sobre su meta individual' },
    { rol: 'SUPERVISOR', titulo: 'Supervisor · sobre la meta del mes' }
  ];

  // Borrador
  /** null = todavía no se eligió (mes nuevo sin copiar) */
  readonly tipoMetrica = signal<TipoMetrica | null>(null);
  readonly idRol = signal<number | null>(null);
  /** idUsuario → meta propia (null = divide la meta del mes) */
  readonly asesores = signal<Map<number, number | null>>(new Map());
  readonly idSupervisor = signal<number | null>(null);
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
  readonly roles = signal<RolCashi[]>([]);
  readonly candidatos = signal<UsuarioCashi[]>([]);
  readonly supervisores = signal<SupervisorCashi[]>([]);
  readonly cargandoCandidatos = signal(false);

  // Simulación y guardado
  readonly simulacion = signal<SimulacionPeriodo | null>(null);
  readonly simulando = signal(false);
  readonly errorSimulacion = signal<string | null>(null);
  readonly guardando = signal(false);
  readonly copiando = signal(false);
  private readonly simular$ = new Subject<ConfiguracionPeriodo>();
  private simulacionEnCurso: Subscription | null = null;

  readonly codigo = computed(() => codigoPeriodo(this.vista().anio, this.vista().mes));
  readonly codigoAnterior = computed(() => {
    const v = this.vista();
    return v.mes === 1 ? codigoPeriodo(v.anio - 1, 12) : codigoPeriodo(v.anio, v.mes - 1);
  });
  readonly esNuevo = computed(() => !this.vista().reporte);
  readonly rolElegido = computed(() => this.roles().find(r => r.idRol === this.idRol()) ?? null);
  readonly metaDelMes = computed(() => this.metaAjustada() ?? this.vista().metaInterna);
  readonly divisor = computed(() => Math.max([...this.asesores().values()].filter(m => m == null).length, 1));
  readonly metaPorAsesor = computed(() => (this.metaDelMes() ?? 0) / this.divisor());
  readonly totalGuardado = computed(() => this.vista().reporte?.totalComisiones ?? null);
  readonly diferencia = computed(() => {
    const s = this.simulacion();
    const g = this.totalGuardado();
    return s && g != null ? Math.round((s.totalComisiones - g) * 100) / 100 : 0;
  });

  readonly gruposSupervisores = computed(() => {
    const grupos = new Map<string, SupervisorCashi[]>();
    for (const s of this.supervisores()) {
      grupos.set(s.nombreRol, [...(grupos.get(s.nombreRol) ?? []), s]);
    }
    return [...grupos.entries()].map(([rol, usuarios]) => ({ rol, usuarios }));
  });

  readonly configuracion = computed<ConfiguracionPeriodo | null>(() => {
    const idRol = this.idRol();
    const tipoMetrica = this.tipoMetrica();
    if (idRol == null || tipoMetrica == null) {
      return null;
    }
    const v = this.vista();
    return {
      idSubcartera: v.idSubcartera,
      anio: v.anio,
      mes: v.mes,
      tipoMetrica,
      idRolAsesor: idRol,
      asesores: [...this.asesores().entries()].map(([idUsuario, metaManual]) => ({ idUsuario, metaManual })),
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
        .map<MetaCantidad>(m => ({ tipo: m.tipo, cantidad: m.tipo === 'META' ? null : m.cantidad, monto: m.monto! })),
      bonos: this.bonosCopiados()
    };
  });

  readonly sucio = computed(() => this.firma(this.configuracion()) !== this.inicialFirma());

  readonly faltantes = computed(() => {
    const f: string[] = [];
    if (this.tipoMetrica() == null) {
      f.push('Elige qué se mide: recaudo o contención.');
    }
    if (this.idRol() == null) {
      f.push('Elige el rol de los asesores.');
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
    if (this.metaDelMes() == null) {
      f.push('Falta la meta INTERNA del mes en el reporte de producción.');
    }
    if (this.conLogros() && this.metas().some(m => m.activa && (!(m.monto! > 0) || (m.tipo !== 'META' && !(m.cantidad! > 0))))) {
      f.push('Completa la cantidad y el monto de cada meta de cantidad marcada.');
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

    // La vista previa se pide al backend un momento después del último cambio
    const sub = this.simular$.pipe(debounceTime(350)).subscribe(config => this.pedirSimulacion(config));
    inject(DestroyRef).onDestroy(() => {
      sub.unsubscribe();
      this.simulacionEnCurso?.unsubscribe();
    });
    effect(() => {
      const config = this.configuracion();
      if (config && config.asesores.length + (config.idSupervisor ? 1 : 0) > 0) {
        untracked(() => this.simular$.next(config));
      } else {
        untracked(() => {
          this.simulacion.set(null);
          this.errorSimulacion.set(null);
        });
      }
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

  cambiarMeta(i: number, campo: 'cantidad' | 'monto', valor: string): void {
    const n = valor === '' ? null : Number(valor);
    this.metas.update(l => l.map((m, j) => j === i ? { ...m, [campo]: n != null && Number.isFinite(n) ? n : null } : m));
  }

  niveles(rol: RolComision): Nivel[] {
    return rol === 'ASESOR' ? this.nivelesAsesor() : this.nivelesSupervisor();
  }

  logradoDe(idUsuario: number): number {
    return this.simulacion()?.logradoPorUsuario?.[String(idUsuario)] ?? 0;
  }

  // ==================== EDICIÓN ====================

  cambiarRol(valor: string): void {
    const id = Number(valor);
    if (!id || id === this.idRol()) {
      return;
    }
    this.idRol.set(id);
    this.asesores.set(new Map());
    this.cargarCandidatos(id);
  }

  alternarAsesor(idUsuario: number): void {
    this.asesores.update(m => {
      const n = new Map(m);
      if (n.has(idUsuario)) {
        n.delete(idUsuario);
      } else {
        n.set(idUsuario, null);
      }
      return n;
    });
  }

  marcarTodos(): void {
    this.asesores.update(m => {
      const n = new Map(m);
      this.candidatos().forEach(u => { if (!n.has(u.idUsuario)) { n.set(u.idUsuario, null); } });
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
    this.service.obtenerVista(v.idSubcartera, anio, mes).subscribe({
      next: anterior => {
        this.copiando.set(false);
        const p = anterior.reporte?.periodo;
        if (!p) {
          this.toast.warning(`${codigoPeriodo(anio, mes)} no tiene configuración para copiar.`);
          return;
        }
        this.tipoMetrica.set(p.tipoMetrica);
        if (p.rolAsesor && p.rolAsesor.idRol !== this.idRol()) {
          this.idRol.set(p.rolAsesor.idRol);
          this.asesores.set(new Map());
          this.cargarCandidatos(p.rolAsesor.idRol);
        }
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
          this.toast.success(this.esNuevo() ? `${this.codigo()} configurado y calculado` : `Guardado · ${this.codigo()} recalculado`);
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
    const rol = p?.rolAsesor ?? v.rolSugerido;

    this.copiadoDe.set(null);
    // Mes nuevo: sin métrica elegida; la trae "Copiar configuración" o la elige quien configura
    this.tipoMetrica.set(p?.tipoMetrica ?? null);
    this.idRol.set(rol?.idRol ?? null);
    this.asesores.set(new Map(participantes.filter(x => x.rol === 'ASESOR').map(x => [x.idUsuario, x.metaManual])));
    this.idSupervisor.set(participantes.find(x => x.rol === 'SUPERVISOR')?.idUsuario ?? null);
    this.metaAjustada.set(p?.metaAjustada ?? null);
    this.nivelesAsesor.set(this.aNiveles(p?.escalas ?? [], 'ASESOR'));
    this.nivelesSupervisor.set(this.aNiveles(p?.escalas ?? [], 'SUPERVISOR'));
    this.escalaAcumulativa.set(!!p?.escalaAcumulativa);
    this.metas.set(metasParaEditar(p?.metasCantidad));
    this.bonosCopiados.set(null);
    this.inicialFirma.set(this.firma(this.configuracion()));

    this.service.listarRolesSubcartera(v.idSubcartera).subscribe({
      next: r => this.roles.set(r),
      error: e => this.toast.error(mensajeError(e, 'No se pudieron cargar los roles.'))
    });
    if (rol) {
      this.cargarCandidatos(rol.idRol);
    } else {
      this.candidatos.set([]);
    }
  }

  private cargarCandidatos(idRol: number): void {
    this.cargandoCandidatos.set(true);
    this.service.listarUsuariosRol(idRol).subscribe({
      next: usuarios => {
        // Quien ya participa sigue en la lista aunque hoy ya no tenga el rol
        const ids = new Set(usuarios.map(u => u.idUsuario));
        const extra = (this.vista().reporte?.participantes ?? [])
          .filter(p => p.rol === 'ASESOR' && !ids.has(p.idUsuario) && this.idRol() === this.vista().reporte?.periodo.rolAsesor?.idRol)
          .map(p => ({ idUsuario: p.idUsuario, nombre: p.nombre }));
        this.candidatos.set([...usuarios, ...extra]);
        this.cargandoCandidatos.set(false);
      },
      error: e => {
        this.cargandoCandidatos.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron cargar los asesores del rol.'));
      }
    });
  }

  private pedirSimulacion(config: ConfiguracionPeriodo): void {
    this.simulacionEnCurso?.unsubscribe();
    this.simulando.set(true);
    this.simulacionEnCurso = this.service.simular({ ...config, escalas: config.escalas.filter(e => e.porcentajeDesde >= 0 && e.montoComision >= 0) })
      .subscribe({
        next: s => {
          this.simulacion.set(s);
          this.errorSimulacion.set(null);
          this.simulando.set(false);
        },
        error: e => {
          this.simulando.set(false);
          this.errorSimulacion.set(mensajeError(e, 'No se pudo calcular la vista previa.'));
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
