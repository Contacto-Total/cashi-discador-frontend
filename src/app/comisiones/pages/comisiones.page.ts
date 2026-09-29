import {
  ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, afterRenderEffect, computed, inject, signal, viewChild, ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppNumberPipe, AppDateTimePipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { Cartera, Inquilino, ReportePeriodo, Subcartera, VistaPeriodo } from '../models/comision.model';
import {
  ESTADO_VISTA_INFO, EstadoVista, METRICA_INFO, codigoPeriodo, descargar, diaMes, estadoDeVista, mensajeError, nombreArchivo, nombreMes,
  nombreRol
} from '../comisiones.util';
import { CmxIconComponent } from '../components/cmx-icon.component';
import { PeriodoPickerComponent } from '../components/periodo-picker.component';
import { ResultadosTabComponent } from '../components/resultados-tab.component';
import { SustentoTabComponent } from '../components/sustento-tab.component';
import { ConfiguracionTabComponent } from '../components/configuracion-tab.component';
import { HistorialTabComponent } from '../components/historial-tab.component';
import { BonosTabComponent } from '../components/bonos-tab.component';
import { AgregarParticipanteModalComponent } from '../components/agregar-participante-modal.component';

type Vista = 'resultados' | 'sustento' | 'config' | 'bonos' | 'historial';

const VISTAS: { id: Vista; etiqueta: string }[] = [
  { id: 'resultados', etiqueta: 'Resultados' },
  { id: 'sustento', etiqueta: 'Sustento' },
  { id: 'config', etiqueta: 'Comisiones' },
  { id: 'bonos', etiqueta: 'Bonos' },
  { id: 'historial', etiqueta: 'Historial' }
];

const CLAVE_SUBCARTERA = 'cmx.subcartera';
const REFRESCO_MS = 60_000;

/**
 * Módulo de comisiones.
 * Se elige el periodo (mes) y la subcartera (Proveedor → Cartera → Subcartera). Cada mes se configura por
 * su cuenta (pestañas Comisiones y Bonos): al guardar nace el período. El cálculo es manual: el botón
 * Recalcular hace el select de los pagos conciliados y guarda el resultado. Cerrar congela el último
 * recálculo (se puede reabrir).
 * Subcartera, periodo y pestaña viven en la URL.
 */
@Component({
  selector: 'app-comisiones',
  standalone: true,
  imports: [
    AppNumberPipe,
    AppDateTimePipe,
    CmxIconComponent,
    PeriodoPickerComponent,
    ResultadosTabComponent,
    SustentoTabComponent,
    ConfiguracionTabComponent,
    HistorialTabComponent,
    BonosTabComponent,
    AgregarParticipanteModalComponent
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './comisiones.page.css',
  template: `
    <div class="cmx cmx-root">
      <div class="cmx-wrap">
        <div class="cmx-app">
          <!-- ============ CONTEXTO ============ -->
          <div class="cmx-ctx">
            <span class="cmx-mark" aria-hidden="true"></span>
            <h1 class="cmx-crumb">Comisiones</h1>
            <div class="cmx-pnav">
              <button type="button" class="cmx-arr" (click)="moverMes(-1)" aria-label="Periodo anterior" [attr.title]="codigoVecino(-1)">
                <cmx-icon name="chevron-left" [size]="16" />
              </button>
              <cmx-periodo-picker [idSubcartera]="idSubcartera()" [anio]="anio()" [mes]="mes()" [estadoActual]="estado()"
                                  (cambiar)="irA($event.anio, $event.mes)" />
              <button type="button" class="cmx-arr" (click)="moverMes(1)" [disabled]="siguienteEsFuturo()" aria-label="Periodo siguiente"
                      [attr.title]="siguienteEsFuturo() ? codigoVecino(1) + ' se habilita el 01/' + codigoVecino(1).slice(5) : codigoVecino(1)">
                <cmx-icon name="chevron-right" [size]="16" />
              </button>
            </div>
            <span class="cmx-right">
              @if (reporte(); as r) {
                @if (r.periodo.fechaCalculo) {
                  <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="descargando()" (click)="descargarExcel(r)">
                    <cmx-icon name="download" [size]="15" /> {{ descargando() ? 'Generando…' : 'Excel' }}
                  </button>
                }
                @if (r.periodo.estado === 'EN_CURSO') {
                  <button type="button" class="cmx-btn cmx-btn-act" [disabled]="procesando()" (click)="recalcular(r)">
                    <cmx-icon name="refresh" [size]="15" /> {{ recalculando() ? 'Recalculando…' : 'Recalcular' }}
                  </button>
                  @if (r.periodo.fechaCalculo) {
                    <button type="button" class="cmx-btn cmx-btn-dark" [disabled]="procesando()" (click)="confirmandoCierre.set(true)">
                      <cmx-icon name="lock" [size]="15" /> Cerrar periodo
                    </button>
                  }
                } @else {
                  <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="procesando()" (click)="reabrir(r)">
                    <cmx-icon name="unlock" [size]="15" /> {{ procesando() ? 'Reabriendo…' : 'Reabrir' }}
                  </button>
                }
              }
            </span>
          </div>

          <!-- ============ PROVEEDOR / CARTERA / SUBCARTERA ============ -->
          <div class="cmx-filters">
            <div class="cmx-field">
              <label for="cmx-f-prov">Proveedor</label>
              <select id="cmx-f-prov" (change)="cambiarInquilino($any($event.target).value)">
                @if (!inquilinos().length) { <option value="">Cargando…</option> }
                @for (i of inquilinos(); track i.id) {
                  <option [value]="i.id" [selected]="i.id === idInquilino()">{{ i.nombreInquilino }}</option>
                }
              </select>
            </div>
            <div class="cmx-field">
              <label for="cmx-f-cart">Cartera</label>
              <select id="cmx-f-cart" (change)="cambiarCartera($any($event.target).value)" [disabled]="!carteras().length">
                @if (!carteras().length) { <option value="">—</option> }
                @for (c of carteras(); track c.id) {
                  <option [value]="c.id" [selected]="c.id === idCartera()">{{ c.nombreCartera }}</option>
                }
              </select>
            </div>
            <div class="cmx-field">
              <label for="cmx-f-sub">Subcartera</label>
              <select id="cmx-f-sub" (change)="cambiarSubcartera($any($event.target).value)" [disabled]="!subcarteras().length">
                @if (!subcarteras().length) { <option value="">—</option> }
                @for (s of subcarteras(); track s.id) {
                  <option [value]="s.id" [selected]="s.id === idSubcartera()">{{ s.nombreSubcartera }}</option>
                }
              </select>
            </div>
            @if (vista(); as v) {
              <div class="cmx-fsum">
                <span class="cmx-state" [class]="'cmx-state ' + estadoInfo().clase">{{ estadoInfo().etiqueta }}</span>
                @if (reporte(); as r) {
                  @if (!r.periodo.fechaCalculo) { <span class="cmx-fsum-m">Falta recalcular</span> } @else {
                  <span><b class="cmx-num">S/ {{ r.totalComisiones | appNumber:'1.2-2' }}</b> en comisiones@if (r.totalBonos) { · <b class="cmx-num">S/ {{ r.totalBonos | appNumber:'1.2-2' }}</b> en bonos }</span>
                  }
                  <span class="cmx-fsum-m">{{ nombreRol(r.periodo.rolAsesor?.nombreRol) || 'Sin rol' }} · {{ metricaInfo[r.periodo.tipoMetrica].etiqueta.toLowerCase() }}</span>
                } @else if (estado() === 'SIN_CONFIG') {
                  <span class="cmx-fsum-m">Falta configurar</span>
                } @else {
                  <span class="cmx-fsum-m">Sin conciliaciones en {{ codigo() }}</span>
                }
              </div>
            }
          </div>

          <!-- ============ AVISOS ============ -->
          @if (confirmandoCierre() && reporte(); as r) {
            <div class="cmx-banner cmx-enter" role="alertdialog" aria-labelledby="cmx-cierre-t">
              <span class="cmx-banner-ic">!</span>
              <span class="cmx-banner-tx">
                <b id="cmx-cierre-t">¿Cerrar {{ codigo() }} de {{ nombreSubcartera() }}?</b>
                Se congela el recálculo del <b>{{ r.periodo.fechaCalculo | appDateTime }}</b>.
                @if (pendientes()) { Hay {{ pendientes() }} que ese recálculo no incluye. }
                @if (faltanDias(); as f) {
                  Todavía faltan los pagos del <b>{{ f.desde }} al {{ f.hasta }}</b>: el archivo de Financiera OH llega con 2 días de
                  retraso. Si cierras ahora, esos pagos no se sumarán a este periodo.
                } @else {
                  Ya hay pagos del banco hasta el último día del mes.
                }
              </span>
              <span class="cmx-banner-actions">
                <button type="button" class="cmx-btn cmx-btn-sec" (click)="confirmandoCierre.set(false)">Cancelar</button>
                @if (pendientes()) {
                  <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="procesando()" (click)="cerrar(r, false)">Cerrar sin recalcular</button>
                  <button type="button" class="cmx-btn cmx-btn-dark" [disabled]="procesando()" (click)="cerrar(r, true)">
                    <cmx-icon name="refresh" [size]="15" /> {{ procesando() ? 'Cerrando…' : 'Recalcular y cerrar' }}
                  </button>
                } @else {
                  <button type="button" class="cmx-btn cmx-btn-dark" [disabled]="procesando()" (click)="cerrar(r, false)">
                    {{ procesando() ? 'Cerrando…' : faltanDias() ? 'Cerrar de todas formas' : 'Cerrar periodo' }}
                  </button>
                }
              </span>
            </div>
          } @else if (estado() === 'CERRADO' && reporte()) {
            <div class="cmx-banner is-dark cmx-enter">
              <span class="cmx-banner-ic"><cmx-icon name="lock" [size]="14" /></span>
              <span class="cmx-banner-tx">Cerrado por <b>{{ reporte()!.periodo.cerradoPorNombre }}</b> el {{ reporte()!.periodo.fechaCierre | appDateTime }}.
                Resultados congelados: para cambiar algo hay que reabrirlo.</span>
            </div>
          } @else if (vistaActual() === 'config' || (vistaActual() === 'bonos' && reporte())) {
            <div class="cmx-banner is-info cmx-enter">
              <span class="cmx-banner-ic">i</span>
              <span class="cmx-banner-tx">Esta configuración es <b>solo de {{ codigo() }}</b>. Guardar no recalcula: los resultados cambian
                cuando pulses Recalcular. Los demás periodos no cambian.</span>
            </div>
          } @else if (estado() === 'ABIERTO' && reporte() && !reporte()!.periodo.fechaCalculo) {
            <div class="cmx-banner is-info cmx-enter">
              <span class="cmx-banner-ic">i</span>
              <span class="cmx-banner-tx"><b>{{ codigo() }} está configurado pero todavía no se recalcula.</b>
                Pulsa Recalcular para tomar los pagos conciliados del mes y calcular las comisiones.</span>
              <span class="cmx-banner-actions">
                <button type="button" class="cmx-btn cmx-btn-act" [disabled]="procesando()" (click)="recalcular(reporte()!)"><cmx-icon name="refresh" [size]="15" /> Recalcular</button>
              </span>
            </div>
          } @else if (estado() === 'ABIERTO' && pendientes()) {
            <div class="cmx-banner cmx-enter">
              <span class="cmx-banner-ic">!</span>
              <span class="cmx-banner-tx">Hay <b>{{ pendientes() }}</b> desde el último recálculo
                ({{ reporte()!.periodo.fechaCalculo | appDateTime }}). Los resultados todavía no los incluyen.</span>
              <span class="cmx-banner-actions">
                <button type="button" class="cmx-btn cmx-btn-act" [disabled]="procesando()" (click)="recalcular(reporte()!)"><cmx-icon name="refresh" [size]="15" /> Recalcular</button>
              </span>
            </div>
          } @else if (estado() === 'ABIERTO' && !esMesActual()) {
            <div class="cmx-banner is-info cmx-enter">
              <span class="cmx-banner-ic">i</span>
              <span class="cmx-banner-tx"><b>{{ codigo() }} sigue abierto.</b>
                @if (vista()?.pagos?.ultimaFechaBanco; as u) { Hay pagos del banco hasta el {{ diaMes(u) }}. }
                Mientras siga abierto, un pago de ese mes que se apruebe tarde entra en el siguiente recálculo.</span>
            </div>
          }
          @for (a of advertencias(); track $index) {
            <div class="cmx-banner cmx-enter"><span class="cmx-banner-ic">!</span><span class="cmx-banner-tx">{{ a }}</span></div>
          }

          <!-- ============ FRANJA DE ESTADO ============ -->
          @if (vista(); as v) {
            <div class="cmx-strip">
              <ol class="cmx-steps" aria-label="Estado del periodo">
                <li class="cmx-step" [class.is-now]="estado() === 'ABIERTO'" [class.is-done]="estado() === 'CERRADO'">
                  <span class="cmx-step-dot">{{ estado() === 'CERRADO' ? '✓' : '' }}</span>Abierto
                </li>
                <li class="cmx-step-ln" aria-hidden="true"></li>
                <li class="cmx-step" [class.is-now]="estado() === 'CERRADO'"><span class="cmx-step-dot"></span>Cerrado</li>
              </ol>
              <span>
                @switch (estado()) {
                  @case ('ABIERTO') {
                    @if (reporte()?.periodo; as pe) {
                      @if (pe.fechaCalculo) {
                        Último recálculo <b>{{ pe.fechaCalculo | appDateTime }}</b>@if (pe.recalculadoPorNombre) { · {{ pe.recalculadoPorNombre }} }
                        @if (pe.pagosHasta) { · con pagos hasta el {{ diaMes(pe.pagosHasta) }} }
                      } @else { Configurado · falta el primer recálculo }
                    }
                  }
                  @case ('CERRADO') {
                    @if (reporte()?.periodo?.fechaCalculo; as f) { Congelado con el recálculo del <b>{{ f | appDateTime }}</b> } @else { Cerrado }
                  }
                  @default { Sin configurar: los pagos llegan, pero todavía no se calcula nada }
                }
              </span>
              <span class="cmx-cov">
                <span class="cmx-cov-cells" aria-hidden="true">
                  @for (c of cobertura(); track $index) { <span class="cmx-cov-c" [class]="'cmx-cov-c ' + c.clase" [attr.title]="c.titulo"></span> }
                </span>
                <span>{{ textoCobertura() }}</span>
              </span>
              @if (metaDelMes() != null) {
                <span class="cmx-strip-meta">Meta del mes · <b class="cmx-num">S/ {{ metaDelMes() | appNumber:'1.2-2' }}</b></span>
              }
            </div>
          }

          <!-- ============ VISTAS ============ -->
          <div class="cmx-views" role="tablist" aria-label="Vistas del periodo" #tabs>
            @for (t of vistas; track t.id; let i = $index) {
              @if (i === 2) { <span class="cmx-views-gap"></span> }
              <button type="button" role="tab" [attr.aria-selected]="vistaActual() === t.id" (click)="irVista(t.id)" [attr.data-vista]="t.id">
                {{ t.etiqueta }}
                @if (t.id === 'resultados' && reporte()) { <span class="cmx-count">{{ reporte()!.participantes.length }}</span> }
                @if (t.id === 'bonos' && reporte()?.periodo?.bonos?.length) { <span class="cmx-count">{{ reporte()!.periodo.bonos.length }}</span> }
              </button>
            }
            <span class="cmx-views-ink" aria-hidden="true" #ink></span>
          </div>

          <!-- ============ CONTENIDO ============ -->
          <div class="cmx-main">
            @if (error()) {
              <div class="cmx-empty">
                <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
                <b>No se pudo cargar el periodo</b>
                <p style="max-width:52ch">{{ error() }}</p>
                <button type="button" class="cmx-btn cmx-btn-sec" (click)="cargarVista()">Reintentar</button>
              </div>
            } @else if (!vista()) {
              <div style="display:grid;gap:12px">
                <div class="cmx-skel" style="height:70px"></div>
                <div class="cmx-skel" style="height:220px"></div>
              </div>
            } @else if (vista(); as v) {
              @switch (vistaActual()) {
                @case ('bonos') {
                  @if (reporte(); as r) {
                    <cmx-bonos-tab [reporte]="r" [soloLectura]="estado() === 'CERRADO'" (guardado)="alGuardarBonos($event)" />
                  } @else {
                    <div class="cmx-empty cmx-enter">
                      <span class="cmx-empty-mark"><cmx-icon name="gift" [size]="20" /></span>
                      <b>Primero configura {{ codigo() }}</b>
                      <p>Los bonos se agregan a un periodo ya configurado: elige la métrica, los participantes y la escala, y luego vuelve aquí.</p>
                      <button type="button" class="cmx-btn cmx-btn-act" (click)="irVista('config')"><cmx-icon name="sliders" [size]="15" /> Configurar {{ codigo() }}</button>
                    </div>
                  }
                }
                @case ('config') {
                  <cmx-configuracion-tab [vista]="v" [soloLectura]="estado() === 'CERRADO'" (guardado)="alGuardar($event)" />
                }
                @default {
                  @if (reporte(); as r) {
                    @switch (vistaActual()) {
                      @case ('sustento') {
                        <cmx-sustento-tab [reporte]="r" [vista]="v" [(seleccion)]="seleccionSustento" />
                      }
                      @case ('historial') {
                        <cmx-historial-tab [reporte]="r" />
                      }
                      @default {
                        <cmx-resultados-tab [reporte]="r" [puedeAgregar]="estado() === 'ABIERTO'"
                                            (agregar)="agregando.set(true)" (verSustento)="verSustento($event)" />
                      }
                    }
                  } @else {
                    <div class="cmx-emptycfg cmx-enter">
                      <div>
                        <h2>{{ codigo() }} de {{ nombreSubcartera() }} todavía no está configurado</h2>
                        <p>
                          @if (v.pagos.cantidad) {
                            Ya hay <b>{{ v.pagos.cantidad | appNumber:'1.0-0' }} pagos conciliados</b> en el mes.
                          } @else {
                            Todavía no hay pagos conciliados en {{ codigo() }}.
                          }
                          El periodo empieza en blanco: eliges la métrica, quiénes participan y la escala de comisión. Después pulsas
                          Recalcular y recién ahí se toman los pagos conciliados y se calculan las comisiones.
                        </p>
                        <div class="cmx-emptycfg-acts">
                          <button type="button" class="cmx-btn cmx-btn-act" (click)="irVista('config')">
                            <cmx-icon name="sliders" [size]="15" /> Configurar {{ codigo() }}
                          </button>
                        </div>
                      </div>
                      <div class="cmx-emptycfg-side">
                        <div><span>Meta interna</span><b class="cmx-num">{{ v.metaInterna != null ? 'S/ ' + (v.metaInterna | appNumber:'1.2-2') : 'Sin registrar' }}</b></div>
                        <div><span>Conciliado a la fecha</span><b class="cmx-num">S/ {{ v.pagos.total | appNumber:'1.2-2' }}</b></div>
                        <div><span>Rol sugerido</span><b>{{ nombreRol(v.rolSugerido?.nombreRol) || '—' }}</b></div>
                        <div><span>Pagos hasta</span><b class="cmx-num">{{ v.pagos.ultimaFechaBanco ? diaMes(v.pagos.ultimaFechaBanco) : '—' }}</b></div>
                      </div>
                    </div>
                  }
                }
              }
            }
          </div>
        </div>
      </div>

      @if (agregando() && reporte(); as r) {
        <cmx-agregar-participante-modal [reporte]="r" [codigo]="codigo()" [feriados]="vista()?.feriados ?? []"
                                        (cerrar)="agregando.set(false)" (agregado)="alAgregar($event)" />
      }
    </div>
  `
})
export class ComisionesPage implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly vistas = VISTAS;
  readonly metricaInfo = METRICA_INFO;
  readonly nombreMes = nombreMes;
  readonly diaMes = diaMes;
  readonly nombreRol = nombreRol;

  private readonly hoy = new Date();
  readonly anio = signal(this.hoy.getFullYear());
  readonly mes = signal(this.hoy.getMonth() + 1);

  readonly inquilinos = signal<Inquilino[]>([]);
  readonly carteras = signal<Cartera[]>([]);
  readonly subcarteras = signal<Subcartera[]>([]);
  readonly idInquilino = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);

  readonly vista = signal<VistaPeriodo | null>(null);
  readonly error = signal<string | null>(null);
  readonly vistaActual = signal<Vista>('resultados');
  readonly seleccionSustento = signal<number | 'sup' | null>(null);
  readonly advertencias = signal<string[]>([]);

  readonly confirmandoCierre = signal(false);
  readonly procesando = signal(false);
  readonly recalculando = signal(false);
  readonly descargando = signal(false);
  readonly agregando = signal(false);

  private readonly tabs = viewChild<ElementRef<HTMLElement>>('tabs');
  private readonly ink = viewChild<ElementRef<HTMLElement>>('ink');
  private tabsAnimadas = false;
  private pedido = 0;

  readonly reporte = computed<ReportePeriodo | null>(() => this.vista()?.reporte ?? null);
  readonly estado = computed<EstadoVista>(() => {
    const v = this.vista();
    return v ? estadoDeVista(v) : 'SIN_PAGOS';
  });
  readonly estadoInfo = computed(() => ESTADO_VISTA_INFO[this.estado()]);
  readonly codigo = computed(() => codigoPeriodo(this.anio(), this.mes()));
  readonly nombreSubcartera = computed(() =>
    this.vista()?.nombreSubcartera ?? this.subcarteras().find(s => s.id === this.idSubcartera())?.nombreSubcartera ?? 'la subcartera');
  readonly esMesActual = computed(() => this.anio() === this.hoy.getFullYear() && this.mes() === this.hoy.getMonth() + 1);
  readonly siguienteEsFuturo = computed(() => this.anio() * 12 + this.mes() >= this.hoy.getFullYear() * 12 + this.hoy.getMonth() + 1);
  readonly metaDelMes = computed(() => this.reporte()?.periodo.metaDelMes ?? this.vista()?.metaInterna ?? null);

  /** Lo que el último recálculo no incluye: "3 pagos conciliados nuevos y cambios de configuración" */
  readonly pendientes = computed(() => {
    const p = this.reporte()?.periodo;
    if (!p || !p.fechaCalculo) {
      return '';
    }
    const partes: string[] = [];
    if (p.pagosNuevos) {
      partes.push(`${p.pagosNuevos} ${p.pagosNuevos === 1 ? 'pago conciliado nuevo' : 'pagos conciliados nuevos'}`);
    }
    if (p.cambiosPendientes) {
      partes.push('cambios de configuración');
    }
    return partes.join(' y ');
  });

  readonly diasDelMes = computed(() => new Date(this.anio(), this.mes(), 0).getDate());
  readonly ultimoDia = computed(() => {
    const u = this.vista()?.pagos.ultimaFechaBanco;
    return u ? Number(u.slice(8, 10)) : 0;
  });

  /** Qué días del mes ya tienen pagos del banco aprobados */
  readonly cobertura = computed(() => {
    const dias = this.diasDelMes();
    const ultimo = this.ultimoDia();
    const primera = this.vista()?.pagos.primeraFechaBanco;
    const desde = primera ? Number(primera.slice(8, 10)) : 1;
    return Array.from({ length: 31 }, (_, i) => {
      const d = i + 1;
      const clase = d > dias ? 'is-x' : ultimo === 0 ? 'is-p' : d < desde ? 'is-pre' : d <= ultimo ? '' : 'is-p';
      return { clase, titulo: d <= dias ? `${String(d).padStart(2, '0')}/${String(this.mes()).padStart(2, '0')}` : '' };
    });
  });

  readonly textoCobertura = computed(() => {
    const dias = this.diasDelMes();
    const ultimo = this.ultimoDia();
    const mm = String(this.mes()).padStart(2, '0');
    if (!ultimo) {
      return 'Todavía no hay pagos del banco en el mes';
    }
    if (ultimo >= dias) {
      return `Pagos del banco completos: 01–${dias}/${mm}`;
    }
    return `Pagos del banco hasta el ${String(ultimo).padStart(2, '0')}/${mm} · faltan ${ultimo + 1}–${dias}/${mm}`;
  });

  /** Días del mes que todavía no tienen pagos del banco (para avisar al cerrar) */
  readonly faltanDias = computed(() => {
    const dias = this.diasDelMes();
    const ultimo = this.ultimoDia();
    const mm = String(this.mes()).padStart(2, '0');
    return ultimo < dias ? { desde: `${String(ultimo + 1).padStart(2, '0')}/${mm}`, hasta: `${dias}/${mm}` } : null;
  });

  constructor() {
    // Subrayado de la pestaña activa
    afterRenderEffect(() => {
      this.vistaActual();
      this.vista();
      const barra = this.tabs()?.nativeElement;
      const ink = this.ink()?.nativeElement;
      const activa = barra?.querySelector<HTMLElement>(`[data-vista="${this.vistaActual()}"]`);
      if (!barra || !ink || !activa) {
        return;
      }
      if (!this.tabsAnimadas) {
        ink.style.transition = 'none';
      }
      ink.style.transform = `translateX(${activa.offsetLeft}px) scaleX(${activa.offsetWidth})`;
      if (!this.tabsAnimadas) {
        void ink.offsetWidth;
        ink.style.transition = '';
        this.tabsAnimadas = true;
      }
    });

    // Mientras el período está abierto, se refresca solo (lo recalcula el backend con cada archivo aprobado)
    const reloj = setInterval(() => {
      if (this.estado() === 'ABIERTO' && this.vistaActual() !== 'config' && this.vistaActual() !== 'bonos' && !this.agregando()
          && !this.procesando() && document.visibilityState === 'visible') {
        this.cargarVista(true);
      }
    }, REFRESCO_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(reloj));
  }

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    const anio = Number(q.get('anio'));
    const mes = Number(q.get('mes'));
    if (anio >= 2020 && anio <= 2100 && mes >= 1 && mes <= 12 && anio * 12 + mes <= this.hoy.getFullYear() * 12 + this.hoy.getMonth() + 1) {
      this.anio.set(anio);
      this.mes.set(mes);
    }
    const vista = q.get('vista') as Vista | null;
    if (vista && VISTAS.some(v => v.id === vista)) {
      this.vistaActual.set(vista);
    }

    // Subcartera de la URL o la última usada; si no hay, la primera del primer proveedor
    const idSub = Number(q.get('subcartera')) || this.subcarteraGuardada();
    this.service.obtenerInquilinos().subscribe({
      next: lista => {
        this.inquilinos.set(lista);
        if (idSub > 0) {
          this.service.obtenerJerarquiaSubcartera(idSub).subscribe({
            next: j => {
              this.idInquilino.set(j.idInquilino);
              this.cargarCarteras(j.idInquilino, j.idCartera, idSub);
            },
            error: () => this.elegirPrimeraSubcartera()
          });
        } else {
          this.elegirPrimeraSubcartera();
        }
      },
      error: e => this.error.set(mensajeError(e, 'No se pudieron cargar los proveedores.'))
    });
  }

  // ==================== SELECCIÓN ====================

  cambiarInquilino(valor: string): void {
    const id = Number(valor);
    if (!id || id === this.idInquilino()) {
      return;
    }
    this.idInquilino.set(id);
    this.cargarCarteras(id, null, null);
  }

  cambiarCartera(valor: string): void {
    const id = Number(valor);
    if (!id || id === this.idCartera()) {
      return;
    }
    this.cargarSubcarteras(id, null);
  }

  cambiarSubcartera(valor: string): void {
    const id = Number(valor);
    if (!id || id === this.idSubcartera()) {
      return;
    }
    this.fijarSubcartera(id);
  }

  moverMes(delta: number): void {
    let mes = this.mes() + delta;
    let anio = this.anio();
    if (mes < 1) {
      mes = 12;
      anio--;
    } else if (mes > 12) {
      mes = 1;
      anio++;
    }
    this.irA(anio, mes);
  }

  codigoVecino(delta: number): string {
    const clave = this.anio() * 12 + (this.mes() - 1) + delta;
    return codigoPeriodo(Math.floor(clave / 12), (clave % 12) + 1);
  }

  irA(anio: number, mes: number): void {
    if (anio * 12 + mes > this.hoy.getFullYear() * 12 + this.hoy.getMonth() + 1) {
      return;
    }
    this.anio.set(anio);
    this.mes.set(mes);
    this.sincronizarUrl();
    this.cargarVista();
  }

  irVista(vista: Vista): void {
    this.vistaActual.set(vista);
    this.sincronizarUrl();
  }

  verSustento(clave: number | 'sup'): void {
    this.seleccionSustento.set(clave);
    this.irVista('sustento');
  }

  // ==================== ACCIONES ====================

  /** Select de los pagos conciliados del mes y cálculo (el cálculo es manual) */
  recalcular(r: ReportePeriodo): void {
    this.procesando.set(true);
    this.recalculando.set(true);
    this.service.recalcular(r.periodo.id).subscribe({
      next: reporte => {
        this.procesando.set(false);
        this.recalculando.set(false);
        this.aplicarReporte(reporte);
        this.toast.success(`${this.codigo()} recalculado`);
        (reporte.advertencias ?? []).slice(0, 3).forEach(a => this.toast.warning(a));
      },
      error: e => {
        this.procesando.set(false);
        this.recalculando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo recalcular el periodo.'));
      }
    });
  }

  cerrar(r: ReportePeriodo, recalcularAntes: boolean): void {
    this.procesando.set(true);
    this.service.cerrar(r.periodo.id, recalcularAntes).subscribe({
      next: reporte => {
        this.procesando.set(false);
        this.confirmandoCierre.set(false);
        this.aplicarReporte(reporte);
        this.toast.success(`${this.codigo()} de ${this.nombreSubcartera()} ${recalcularAntes ? 'recalculado y cerrado' : 'cerrado'}`);
      },
      error: e => {
        this.procesando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo cerrar el periodo.'));
      }
    });
  }

  reabrir(r: ReportePeriodo): void {
    this.procesando.set(true);
    this.service.reabrir(r.periodo.id).subscribe({
      next: reporte => {
        this.procesando.set(false);
        this.aplicarReporte(reporte);
        this.toast.success('Reabierto · recalcula cuando lo necesites');
      },
      error: e => {
        this.procesando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo reabrir el periodo.'));
      }
    });
  }

  descargarExcel(r: ReportePeriodo): void {
    this.descargando.set(true);
    this.service.exportarExcelPeriodo(r.periodo.id).subscribe({
      next: blob => {
        this.descargando.set(false);
        descargar(blob, nombreArchivo('Comisiones', r.periodo.nombreSubcartera, this.codigo()));
      },
      error: e => {
        this.descargando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo generar el Excel.'));
      }
    });
  }

  alGuardar(reporte: ReportePeriodo): void {
    this.aplicarReporte(reporte);
    this.irVista('resultados');
  }

  alGuardarBonos(reporte: ReportePeriodo): void {
    this.aplicarReporte(reporte);
  }

  alAgregar(reporte: ReportePeriodo): void {
    this.agregando.set(false);
    this.aplicarReporte(reporte);
  }

  // ==================== CARGA ====================

  cargarVista(silencioso = false): void {
    const id = this.idSubcartera();
    if (id == null) {
      return;
    }
    const pedido = ++this.pedido;
    if (!silencioso) {
      this.vista.set(null);
      this.error.set(null);
      this.advertencias.set([]);
      this.confirmandoCierre.set(false);
    }
    this.service.obtenerVista(id, this.anio(), this.mes()).subscribe({
      next: v => {
        if (pedido === this.pedido) {
          this.vista.set(v);
          this.error.set(null);
        }
      },
      error: e => {
        if (pedido === this.pedido && !silencioso) {
          this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'));
        }
      }
    });
  }

  private aplicarReporte(reporte: ReportePeriodo): void {
    const v = this.vista();
    if (v) {
      this.vista.set({ ...v, reporte });
    }
    this.advertencias.set((reporte.advertencias ?? []).filter(a => a.startsWith('No se pudo calcular')));
    // Pagos del mes y meta pueden haber cambiado mientras tanto
    this.cargarVista(true);
  }

  private elegirPrimeraSubcartera(): void {
    const primero = this.inquilinos()[0];
    if (!primero) {
      this.error.set('No hay proveedores registrados.');
      return;
    }
    this.idInquilino.set(primero.id);
    this.cargarCarteras(primero.id, null, null);
  }

  private cargarCarteras(idInquilino: number, idCartera: number | null, idSubcartera: number | null): void {
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.service.obtenerCarteras(idInquilino).subscribe({
      next: lista => {
        this.carteras.set(lista);
        const cartera = lista.find(c => c.id === idCartera) ?? lista[0];
        if (!cartera) {
          this.idCartera.set(null);
          this.idSubcartera.set(null);
          this.vista.set(null);
          this.error.set('El proveedor no tiene carteras.');
          return;
        }
        this.cargarSubcarteras(cartera.id, idSubcartera);
      },
      error: e => this.error.set(mensajeError(e, 'No se pudieron cargar las carteras.'))
    });
  }

  private cargarSubcarteras(idCartera: number, idSubcartera: number | null): void {
    this.idCartera.set(idCartera);
    this.subcarteras.set([]);
    this.service.obtenerSubcarteras(idCartera).subscribe({
      next: lista => {
        this.subcarteras.set(lista);
        const sub = lista.find(s => s.id === idSubcartera) ?? lista[0];
        if (!sub) {
          this.idSubcartera.set(null);
          this.vista.set(null);
          this.error.set('La cartera no tiene subcarteras.');
          return;
        }
        this.fijarSubcartera(sub.id);
      },
      error: e => this.error.set(mensajeError(e, 'No se pudieron cargar las subcarteras.'))
    });
  }

  private fijarSubcartera(id: number): void {
    this.idSubcartera.set(id);
    this.seleccionSustento.set(null);
    try {
      localStorage.setItem(CLAVE_SUBCARTERA, String(id));
    } catch {
      // Sin almacenamiento local: se queda solo en la URL
    }
    this.sincronizarUrl();
    this.cargarVista();
  }

  private subcarteraGuardada(): number {
    try {
      return Number(localStorage.getItem(CLAVE_SUBCARTERA)) || 0;
    } catch {
      return 0;
    }
  }

  private sincronizarUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        subcartera: this.idSubcartera(),
        anio: this.anio(),
        mes: this.mes(),
        vista: this.vistaActual() === 'resultados' ? null : this.vistaActual()
      }
    });
  }
}
