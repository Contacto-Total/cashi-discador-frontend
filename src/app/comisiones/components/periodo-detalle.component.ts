import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterRenderEffect,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { EstadoPeriodo, ParticipanteComision, ReportePeriodo, RolComision } from '../models/comision.model';
import { ESTADOS, ESTADO_INFO, METRICA_INFO, descargar, mensajeError, nombreArchivo, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';
import { RolVistaComponent } from './rol-vista.component';
import { ConfiguracionRolComponent } from './configuracion-rol.component';
import { DetalleTabComponent } from './detalle-tab.component';
import { SustentoTabComponent } from './sustento-tab.component';
import { HistorialTabComponent } from './historial-tab.component';
import { SustentoParticipantePanelComponent } from './sustento-participante-panel.component';

type Vista = 'asesores' | 'supervisor' | 'detalle' | 'sustento' | 'historial';
type Confirmacion = 'aprobar' | 'eliminar' | null;
type Accion = 'actualizar' | 'estado' | 'excel' | 'eliminar' | null;

/** Cada cuánto se mira si el período en curso se recalculó solo (ms) */
const REFRESCO_MS = 60_000;

/**
 * Un período de comisiones con el marco de la maqueta: barra de contexto con estado y acciones,
 * franja del ciclo de vida, vistas por pestaña y configuración por rol.
 */
@Component({
  selector: 'cmx-periodo-detalle',
  standalone: true,
  imports: [
    AppDateTimePipe,
    AppNumberPipe,
    CmxIconComponent,
    RolVistaComponent,
    ConfiguracionRolComponent,
    DetalleTabComponent,
    SustentoTabComponent,
    HistorialTabComponent,
    SustentoParticipantePanelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-app">
      @if (reporte(); as r) {
        <!-- ============ CONTEXTO ============ -->
        <div class="cmx-ctx">
          <span class="cmx-mark" aria-hidden="true"></span>
          <h1 class="cmx-crumb">
            <button type="button" (click)="volver.emit()">Comisiones</button>
            <span class="cmx-sep">/</span>
            @if (config(); as rol) {
              <button type="button" (click)="cerrarConfig()">{{ r.periodo.nombreSubcartera }}</button>
              <span class="cmx-sep">/</span>Configurar {{ rol === 'ASESOR' ? 'asesor' : 'supervisor' }}
            } @else {
              {{ r.periodo.nombreSubcartera }}
            }
          </h1>
          <span class="cmx-chip"><i>Período</i>{{ nombreMes(r.periodo.mes) }} {{ r.periodo.anio }}</span>
          <span class="cmx-chip"><i>Se mide por</i>{{ metrica().etiqueta }}</span>
          @if (!config()) {
            <span [class]="'cmx-state ' + estadoInfo[r.periodo.estado].clase">{{ estadoInfo[r.periodo.estado].etiqueta }}</span>
          }

          <span class="cmx-right">
            @if (config()) {
              <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="cfg()?.guardando()" (click)="cerrarConfig()">Cancelar</button>
              <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!cfg()?.puedeGuardar()" (click)="cfg()?.guardar()">
                @if (cfg()?.guardando()) { <cmx-icon name="refresh" [size]="15" class="cmx-spin" /> Guardando… }
                @else { <cmx-icon name="check" [size]="15" /> Guardar }
              </button>
            } @else {
              @if (r.periodo.estado === 'EN_CURSO') {
                <button type="button" class="cmx-icon-btn" [disabled]="!!accion()" (click)="confirmacion.set('eliminar')"
                        aria-label="Eliminar período" title="Eliminar período">
                  <cmx-icon name="trash" [size]="17" />
                </button>
              }
              <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="!calculado() || accion() === 'excel'" (click)="descargarExcel()">
                <cmx-icon name="download" [size]="15" /> {{ accion() === 'excel' ? 'Generando…' : 'Excel' }}
              </button>
              @switch (r.periodo.estado) {
                @case ('EN_CURSO') {
                  <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!!accion()" (click)="cambiarEstado('EN_REVISION')">
                    <cmx-icon name="check" [size]="15" /> {{ accion() === 'estado' ? 'Enviando…' : 'Enviar a revisión' }}
                  </button>
                }
                @case ('EN_REVISION') {
                  <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="!!accion()" (click)="cambiarEstado('EN_CURSO')">Volver a en curso</button>
                  <button type="button" class="cmx-btn cmx-btn-brand" [disabled]="!!accion()" (click)="actualizar()">
                    <cmx-icon name="refresh" [size]="15" [class.cmx-spin]="accion() === 'actualizar'" /> Actualizar
                  </button>
                  <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!!accion() || !calculado()" (click)="cambiarEstado('REVISADO')">
                    <cmx-icon name="check" [size]="15" /> Marcar como revisado
                  </button>
                }
                @case ('REVISADO') {
                  <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="!!accion()" (click)="cambiarEstado('EN_REVISION')">Devolver a revisión</button>
                  <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!!accion()" (click)="confirmacion.set('aprobar')">
                    <cmx-icon name="lock" [size]="15" /> Aprobar
                  </button>
                }
              }
            }
          </span>
        </div>

        <!-- ============ AVISOS ============ -->
        @if (confirmacion(); as c) {
          <div class="cmx-banner cmx-enter" [class.is-danger]="c === 'eliminar'" role="alertdialog" aria-labelledby="cmx-confirmar">
            <span class="cmx-banner-ic" aria-hidden="true">!</span>
            <span id="cmx-confirmar" style="flex:1">
              @if (c === 'aprobar') {
                <b>¿Aprobar las comisiones de {{ nombreMes(r.periodo.mes).toLowerCase() }}?</b>
                Es la luz verde para pagar: resultados y sustento quedan congelados y ya no se podrán modificar.
              } @else {
                <b>¿Eliminar el período?</b> Se borran su configuración, resultados, detalle, sustento e historial.
              }
            </span>
            <span class="cmx-banner-actions">
              <button type="button" class="cmx-btn cmx-btn-sec" (click)="confirmacion.set(null)">Cancelar</button>
              @if (c === 'aprobar') {
                <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!!accion()" (click)="cambiarEstado('APROBADO')">Aprobar</button>
              } @else {
                <button type="button" class="cmx-btn cmx-btn-danger" [disabled]="!!accion()" (click)="eliminar()">Eliminar</button>
              }
            </span>
          </div>
        } @else if (config()) {
          <div class="cmx-banner is-info cmx-enter">
            <span class="cmx-banner-ic" aria-hidden="true">i</span>
            <span>Al guardar, los resultados del período <b>se recalculan solos</b> con la nueva configuración.
              Quitar o devolver a alguien se aplica al instante.</span>
          </div>
        } @else if (sinCalculo()) {
          <div class="cmx-banner cmx-enter" role="status">
            <span class="cmx-banner-ic" aria-hidden="true">!</span>
            <span style="flex:1">
              @if (!r.participantes.length) {
                <b>El período no tiene participantes.</b> Elige qué roles de Cashi cuentan como asesor y como supervisor.
              } @else {
                <b>El período no tiene cálculo.</b> Revisa que exista la meta interna del mes y que haya un solo supervisor;
                el historial dice por qué no se pudo calcular.
              }
            </span>
            @if (r.periodo.estado === 'EN_CURSO') {
              <span class="cmx-banner-actions">
                <button type="button" class="cmx-btn cmx-btn-sec" (click)="abrirConfig('ASESOR')">Configurar</button>
              </span>
            }
          </div>
        }
        @if (advertencias().length && !config()) {
          <div class="cmx-banner cmx-enter" role="status">
            <span class="cmx-banner-ic" aria-hidden="true">!</span>
            <div style="flex:1">
              <b>El cálculo dejó {{ advertencias().length }} {{ advertencias().length === 1 ? 'aviso' : 'avisos' }}:</b>
              <ul>
                @for (a of advertenciasVisibles(); track $index) { <li>{{ a }}</li> }
              </ul>
              @if (advertencias().length > advertenciasVisibles().length) {
                <button type="button" class="cmx-btn cmx-btn-link" (click)="verTodasAdvertencias.set(true)">Ver los {{ advertencias().length }}</button>
              }
            </div>
            <button type="button" class="cmx-icon-btn" (click)="advertencias.set([])" aria-label="Ocultar avisos">
              <cmx-icon name="x" [size]="15" />
            </button>
          </div>
        }

        @if (!config()) {
          <!-- ============ FRANJA DE ESTADO ============ -->
          <div class="cmx-strip">
            <ol class="cmx-steps" aria-label="Estado del período">
              @for (e of estados; track e; let k = $index) {
                @if (k) { <li class="cmx-step-ln" aria-hidden="true"></li> }
                <li class="cmx-step" [class.is-done]="k < indiceEstado()" [class.is-now]="k === indiceEstado()"
                    [attr.aria-current]="k === indiceEstado() ? 'step' : null">
                  <span class="cmx-step-dot">@if (k < indiceEstado()) { <cmx-icon name="check" [size]="10" [stroke]="2.4" /> }</span>
                  {{ estadoInfo[e].etiqueta }}
                </li>
              }
            </ol>
            @switch (r.periodo.estado) {
              @case ('EN_CURSO') {
                @if (calculado()) {
                  <span><span class="cmx-live" aria-hidden="true"></span>Se actualiza solo · último cálculo <b>{{ r.periodo.fechaCalculo | appDateTime }}</b></span>
                } @else {
                  <span style="color: var(--cmx-amber)">Sin cálculo todavía</span>
                }
              }
              @case ('EN_REVISION') {
                <span><cmx-icon name="lock" [size]="13" /> Ya no se actualiza solo · última actualización <b>{{ r.periodo.fechaCalculo | appDateTime }}</b></span>
              }
              @case ('REVISADO') {
                <span><cmx-icon name="lock" [size]="13" /> Revisado · espera la aprobación de la jefatura de administración</span>
              }
              @case ('APROBADO') {
                <span><cmx-icon name="lock" [size]="13" /> Aprobado · congelado, es lo que se paga</span>
              }
            }
            @if (r.periodo.enviadoRevisionPorNombre) {
              <span>En revisión por <b>{{ r.periodo.enviadoRevisionPorNombre }}</b></span>
            }
            @if (r.periodo.revisadoPorNombre) {
              <span>Revisado por <b>{{ r.periodo.revisadoPorNombre }}</b> · {{ r.periodo.fechaRevision | appDateTime }}</span>
            }
            @if (r.periodo.aprobadoPorNombre) {
              <span>Aprobado por <b>{{ r.periodo.aprobadoPorNombre }}</b> · {{ r.periodo.fechaAprobacion | appDateTime }}</span>
            }
            <span class="cmx-strip-meta">Meta interna del reporte de producción · <b class="cmx-num">S/ {{ r.periodo.metaGrupal | appNumber:'1.2-2' }}</b></span>
          </div>

          <!-- ============ VISTAS ============ -->
          <div class="cmx-views" role="tablist" aria-label="Vistas del período" #vistas>
            @for (t of pestanas(); track t.id; let k = $index) {
              @if (t.id === 'sustento') { <span class="cmx-views-gap"></span> }
              <button type="button" role="tab" [attr.aria-selected]="vista() === t.id" [attr.data-vista]="t.id"
                      (click)="vista.set(t.id)">
                {{ t.etiqueta }}@if (t.cuenta != null) {<span class="cmx-count">{{ t.cuenta }}</span>}
              </button>
            }
            <span class="cmx-views-ink" aria-hidden="true" #ink></span>
          </div>
        }

        <!-- ============ PANTALLA ============ -->
        @if (config(); as rol) {
          <cmx-configuracion-rol [reporte]="r" [rol]="rol" (rolCambiado)="config.set($event)"
                                 (actualizado)="aplicar($event, false)" (guardado)="alGuardarConfig($event)" />
        } @else {
          @switch (vista()) {
            @case ('asesores') {
              <cmx-rol-vista [reporte]="r" [rol]="'ASESOR'" (verSustento)="seleccionado.set($event)" (editar)="abrirConfig($event)" />
            }
            @case ('supervisor') {
              <cmx-rol-vista [reporte]="r" [rol]="'SUPERVISOR'" (verSustento)="seleccionado.set($event)" (editar)="abrirConfig($event)" />
            }
            @case ('detalle') { <cmx-detalle-tab [reporte]="r" /> }
            @case ('sustento') { <cmx-sustento-tab [reporte]="r" /> }
            @case ('historial') { <cmx-historial-tab [reporte]="r" /> }
          }
        }
      } @else if (errorCarga()) {
        <div class="cmx-ctx">
          <span class="cmx-mark" aria-hidden="true"></span>
          <span class="cmx-crumb"><button type="button" (click)="volver.emit()">Comisiones</button></span>
        </div>
        <div class="cmx-empty">
          <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
          <b>No se pudo abrir el período</b>
          <p style="max-width:46ch">{{ errorCarga() }}</p>
          <button type="button" class="cmx-btn cmx-btn-sec" (click)="cargar()">Reintentar</button>
        </div>
      } @else {
        <div class="cmx-ctx"><div class="cmx-skel" style="height:24px;width:260px"></div></div>
        <div class="cmx-strip"><div class="cmx-skel" style="height:16px;width:420px"></div></div>
        <div style="padding:18px;display:grid;gap:10px">
          @for (i of [1, 2, 3, 4, 5]; track i) { <div class="cmx-skel" style="height:44px"></div> }
        </div>
      }
    </div>

    @if (seleccionado(); as p) {
      @if (reporte(); as r) {
        <cmx-sustento-participante-panel [periodo]="r.periodo" [participante]="p" [participantes]="r.participantes"
                                         (cerrar)="seleccionado.set(null)" (descargar)="descargarSustento($event)" />
      }
    }
  `
})
export class PeriodoDetalleComponent {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly idPeriodo = input.required<number>();
  /** Reporte ya cargado (al crear el período) para no pedirlo otra vez */
  readonly reporteInicial = input<ReportePeriodo | null>(null);

  readonly volver = output<void>();
  /** El período cambió (estado, cálculo) o se eliminó: la lista debe refrescarse */
  readonly cambiado = output<{ eliminado: boolean }>();

  readonly estados = ESTADOS;
  readonly estadoInfo = ESTADO_INFO;
  readonly nombreMes = nombreMes;

  readonly reporte = signal<ReportePeriodo | null>(null);
  readonly errorCarga = signal<string | null>(null);
  readonly accion = signal<Accion>(null);
  readonly confirmacion = signal<Confirmacion>(null);
  readonly vista = signal<Vista>('asesores');
  readonly config = signal<RolComision | null>(null);
  readonly advertencias = signal<string[]>([]);
  readonly verTodasAdvertencias = signal(false);
  readonly seleccionado = signal<ParticipanteComision | null>(null);

  readonly cfg = viewChild(ConfiguracionRolComponent);
  private readonly vistas = viewChild<ElementRef<HTMLElement>>('vistas');
  private readonly ink = viewChild<ElementRef<HTMLElement>>('ink');
  private inkListo = false;

  readonly metrica = computed(() => METRICA_INFO[this.reporte()?.periodo.tipoMetrica ?? 'RECAUDO']);
  readonly calculado = computed(() => !!this.reporte()?.periodo.fechaCalculo);
  readonly sinCalculo = computed(() => {
    const r = this.reporte();
    return !!r && !r.periodo.fechaCalculo;
  });
  readonly indiceEstado = computed(() => ESTADOS.indexOf(this.reporte()?.periodo.estado ?? 'EN_CURSO'));
  readonly advertenciasVisibles = computed(() =>
    this.verTodasAdvertencias() ? this.advertencias() : this.advertencias().slice(0, 4)
  );

  readonly pestanas = computed<{ id: Vista; etiqueta: string; cuenta: number | null }[]>(() => {
    const participantes = this.reporte()?.participantes ?? [];
    const activos = (rol: RolComision) => participantes.filter(p => p.rol === rol && !p.quitado).length;
    return [
      { id: 'asesores', etiqueta: 'Asesores', cuenta: activos('ASESOR') },
      { id: 'supervisor', etiqueta: 'Supervisor', cuenta: activos('SUPERVISOR') },
      { id: 'detalle', etiqueta: 'Por día', cuenta: null },
      { id: 'sustento', etiqueta: 'Sustento', cuenta: null },
      { id: 'historial', etiqueta: 'Historial', cuenta: null }
    ];
  });

  constructor() {
    effect(() => {
      const id = this.idPeriodo();
      const inicial = this.reporteInicial();
      untracked(() => {
        this.vista.set('asesores');
        this.config.set(null);
        this.advertencias.set([]);
        this.seleccionado.set(null);
        this.confirmacion.set(null);
        this.inkListo = false;
        if (inicial && inicial.periodo.id === id) {
          this.reporte.set(inicial);
          this.advertencias.set(inicial.advertencias ?? []);
          // Recién creado y sin participantes: lo primero es configurarlo
          if (!inicial.participantes.length) {
            this.config.set('ASESOR');
          }
        } else {
          this.reporte.set(null);
          this.cargar();
        }
      });
    });

    // Subrayado de la pestaña activa: se desliza al cambiar de vista
    afterRenderEffect(() => {
      this.vista();
      this.config();
      this.reporte();
      this.moverInk();
    });

    // En curso se recalcula solo en el servidor: se refresca en silencio mientras la pestaña está a la vista
    const intervalo = setInterval(() => this.refrescarSiEnCurso(), REFRESCO_MS);
    const alResize = () => {
      this.inkListo = false;
      this.moverInk();
    };
    window.addEventListener('resize', alResize);
    this.destroyRef.onDestroy(() => {
      clearInterval(intervalo);
      window.removeEventListener('resize', alResize);
    });
  }

  cargar(): void {
    this.errorCarga.set(null);
    this.service.obtenerPeriodo(this.idPeriodo()).subscribe({
      next: r => this.reporte.set(r),
      error: e => this.errorCarga.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'))
    });
  }

  private refrescarSiEnCurso(): void {
    const r = this.reporte();
    if (!r || r.periodo.estado !== 'EN_CURSO' || this.config() || this.accion() || document.visibilityState !== 'visible') {
      return;
    }
    this.service.obtenerPeriodo(r.periodo.id).subscribe({
      next: nuevo => {
        const actual = this.reporte();
        if (actual && actual.periodo.id === nuevo.periodo.id && !this.config()
            && (nuevo.periodo.fechaCalculo !== actual.periodo.fechaCalculo || nuevo.periodo.estado !== actual.periodo.estado)) {
          this.reporte.set(nuevo);
          this.cambiado.emit({ eliminado: false });
        }
      }
    });
  }

  private moverInk(): void {
    const barra = this.vistas()?.nativeElement;
    const ink = this.ink()?.nativeElement;
    if (!barra || !ink) {
      return;
    }
    const boton = barra.querySelector<HTMLElement>(`[data-vista="${this.vista()}"]`);
    if (!boton) {
      return;
    }
    if (!this.inkListo) {
      ink.style.transition = 'none';
    }
    ink.style.transform = `translateX(${boton.offsetLeft}px) scaleX(${boton.offsetWidth})`;
    if (!this.inkListo) {
      void ink.offsetWidth;
      ink.style.transition = '';
      this.inkListo = true;
    }
  }

  /** Reporte devuelto por una acción */
  aplicar(r: ReportePeriodo, conAvisos = true): void {
    this.reporte.set(r);
    if (conAvisos) {
      this.advertencias.set(r.advertencias ?? []);
      this.verTodasAdvertencias.set(false);
    }
    this.cambiado.emit({ eliminado: false });
  }

  abrirConfig(rol: RolComision): void {
    this.confirmacion.set(null);
    this.config.set(rol);
  }

  cerrarConfig(): void {
    const rol = this.config();
    this.config.set(null);
    this.inkListo = false;
    if (rol) {
      this.vista.set(rol === 'ASESOR' ? 'asesores' : 'supervisor');
    }
  }

  alGuardarConfig(r: ReportePeriodo): void {
    this.aplicar(r);
    this.cerrarConfig();
    if (r.advertencias?.length) {
      this.toast.warning('Configuración guardada, pero el cálculo dejó avisos.', 5000);
    } else {
      this.toast.success('Configuración guardada. Los resultados ya están actualizados.');
    }
  }

  actualizar(): void {
    const r = this.reporte();
    if (!r || this.accion()) {
      return;
    }
    this.accion.set('actualizar');
    this.service.actualizar(r.periodo.id).subscribe({
      next: nuevo => {
        this.accion.set(null);
        this.aplicar(nuevo);
        this.toast.success('Recalculado con los pagos de este momento.');
      },
      error: e => {
        this.accion.set(null);
        this.toast.error(mensajeError(e, 'No se pudo actualizar el período.'), 6000);
      }
    });
  }

  cambiarEstado(estado: EstadoPeriodo): void {
    const r = this.reporte();
    if (!r || this.accion()) {
      return;
    }
    const anterior = r.periodo.estado;
    this.accion.set('estado');
    this.service.cambiarEstado(r.periodo.id, estado).subscribe({
      next: nuevo => {
        this.accion.set(null);
        this.confirmacion.set(null);
        this.aplicar(nuevo);
        this.toast.success(this.mensajeEstado(anterior, estado));
      },
      error: e => {
        this.accion.set(null);
        this.toast.error(mensajeError(e, 'No se pudo cambiar el estado.'), 6000);
      }
    });
  }

  private mensajeEstado(anterior: EstadoPeriodo, nuevo: EstadoPeriodo): string {
    switch (nuevo) {
      case 'EN_REVISION':
        return anterior === 'REVISADO'
          ? 'Devuelto a revisión.'
          : 'Período en revisión. Se actualizó una última vez y ya no cambia solo.';
      case 'EN_CURSO':
        return 'Período en curso otra vez: vuelve a actualizarse solo.';
      case 'REVISADO':
        return 'Período revisado. Queda a la espera de la aprobación.';
      case 'APROBADO':
        return 'Comisiones aprobadas. Quedaron congeladas.';
    }
  }

  eliminar(): void {
    const r = this.reporte();
    if (!r || this.accion()) {
      return;
    }
    this.accion.set('eliminar');
    this.service.eliminarPeriodo(r.periodo.id).subscribe({
      next: () => {
        this.accion.set(null);
        this.toast.success(`Período de ${r.periodo.nombreSubcartera} eliminado.`);
        this.cambiado.emit({ eliminado: true });
      },
      error: e => {
        this.accion.set(null);
        this.confirmacion.set(null);
        this.toast.error(mensajeError(e, 'No se pudo eliminar el período.'), 6000);
      }
    });
  }

  descargarExcel(): void {
    const r = this.reporte();
    if (!r) {
      return;
    }
    this.accion.set('excel');
    this.service.exportarExcelPeriodo(r.periodo.id).subscribe({
      next: blob => {
        this.accion.set(null);
        descargar(blob, nombreArchivo('Comisiones', r.periodo.nombreSubcartera, r.periodo.anio, String(r.periodo.mes).padStart(2, '0')));
      },
      error: e => {
        this.accion.set(null);
        this.toast.error(mensajeError(e, 'No se pudo generar el Excel.'));
      }
    });
  }

  descargarSustento(p: ParticipanteComision): void {
    const r = this.reporte();
    if (!r) {
      return;
    }
    this.service.exportarExcelParticipante(r.periodo.id, p.idResultado).subscribe({
      next: blob => descargar(blob, nombreArchivo('Sustento', p.nombre, r.periodo.nombreSubcartera, r.periodo.anio, String(r.periodo.mes).padStart(2, '0'))),
      error: e => this.toast.error(mensajeError(e, 'No se pudo generar el sustento.'))
    });
  }
}
