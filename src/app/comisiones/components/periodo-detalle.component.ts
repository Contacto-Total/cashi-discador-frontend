import { ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { AppDateTimePipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { EstadoPeriodo, ParticipanteComision, ReportePeriodo } from '../models/comision.model';
import { ESTADO_INFO, METRICA_INFO, descargar, mensajeError, nombreArchivo, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';
import { ResultadosTabComponent } from './resultados-tab.component';
import { ConfiguracionTabComponent } from './configuracion-tab.component';
import { SustentoTabComponent } from './sustento-tab.component';
import { HistorialTabComponent } from './historial-tab.component';
import { SustentoParticipantePanelComponent } from './sustento-participante-panel.component';

type Pestana = 'resultados' | 'configuracion' | 'sustento' | 'historial';
type Confirmacion = 'cerrar' | 'eliminar' | null;

/**
 * Un período de comisiones: barra de contexto con estado y acciones, y cuatro pestañas.
 */
@Component({
  selector: 'cmx-periodo-detalle',
  standalone: true,
  imports: [
    AppDateTimePipe,
    CmxIconComponent,
    ResultadosTabComponent,
    ConfiguracionTabComponent,
    SustentoTabComponent,
    HistorialTabComponent,
    SustentoParticipantePanelComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="cmx-btn cmx-btn-link cmx-btn-sm -ml-2 mb-4" (click)="volver.emit()">
      <cmx-icon name="arrow-left" [size]="16" /> Todos los períodos
    </button>

    @if (cargando() && !reporte()) {
      <div class="flex flex-col gap-4">
        <div class="cmx-skeleton h-32"></div>
        <div class="cmx-skeleton h-12"></div>
        <div class="cmx-skeleton h-[28rem]"></div>
      </div>
    } @else if (errorCarga()) {
      <div class="cmx-shell">
        <div class="cmx-core">
          <div class="cmx-empty">
            <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="22" /></span>
            <p class="font-semibold" style="color: var(--cmx-ink)">No se pudo abrir el período</p>
            <p class="text-[0.86rem] max-w-[46ch]">{{ errorCarga() }}</p>
            <button type="button" class="cmx-btn cmx-btn-ghost" (click)="cargar()">Reintentar</button>
          </div>
        </div>
      </div>
    } @else if (reporte(); as r) {
      <!-- ============ CONTEXTO ============ -->
      <section class="cmx-shell cmx-enter" aria-labelledby="cmx-periodo-titulo">
        <div class="cmx-core">
          <div class="flex flex-wrap items-start gap-x-8 gap-y-5 p-5 md:p-6">
            <div class="flex-1 min-w-[16rem]">
              <div class="flex flex-wrap items-center gap-2">
                <span class="cmx-eyebrow"><cmx-icon name="calendar" [size]="12" [stroke]="2" /> {{ nombreMes(r.periodo.mes) }} {{ r.periodo.anio }}</span>
                <span class="cmx-tag cmx-tag-outline">{{ metrica().etiqueta }}</span>
              </div>
              <h2 id="cmx-periodo-titulo" class="cmx-title mt-3">{{ r.periodo.nombreSubcartera }}</h2>
              <p class="cmx-muted text-[0.84rem] mt-2 max-w-[62ch]">{{ estadoInfo[r.periodo.estado].descripcion }}</p>
            </div>

            <div class="flex flex-col items-start lg:items-end gap-3">
              <ol class="cmx-steps" aria-label="Estado del período">
                @for (e of estados; track e; let last = $last) {
                  <li class="cmx-step" [class.is-current]="r.periodo.estado === e" [class.is-done]="pasado(e)"
                      [attr.aria-current]="r.periodo.estado === e ? 'step' : null">
                    @if (pasado(e)) { <cmx-icon name="check" [size]="12" [stroke]="2" /> }
                    {{ estadoInfo[e].etiqueta }}
                  </li>
                  @if (!last) { <li class="cmx-step-line" aria-hidden="true"></li> }
                }
              </ol>
              @if (r.periodo.revisadoPorNombre || r.periodo.cerradoPorNombre) {
                <p class="cmx-muted text-[0.76rem] text-left lg:text-right">
                  @if (r.periodo.revisadoPorNombre) {
                    Revisado por <b class="cmx-soft-text">{{ r.periodo.revisadoPorNombre }}</b> · {{ r.periodo.fechaRevision | appDateTime }}
                  }
                  @if (r.periodo.cerradoPorNombre) {
                    <br />Cerrado por <b class="cmx-soft-text">{{ r.periodo.cerradoPorNombre }}</b> · {{ r.periodo.fechaCierre | appDateTime }}
                  }
                </p>
              }
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex flex-wrap items-center gap-2 px-5 md:px-6 pb-5">
            @switch (r.periodo.estado) {
              @case ('EN_CURSO') {
                <button type="button" class="cmx-btn cmx-btn-brand" [disabled]="!!accion()" (click)="calcular()">
                  {{ accion() === 'calcular' ? 'Calculando…' : (calculado() ? 'Recalcular' : 'Calcular') }}
                  <span class="cmx-orb"><cmx-icon name="calculator" [size]="15" [class.cmx-spin]="accion() === 'calcular'" /></span>
                </button>
                <button type="button" class="cmx-btn cmx-btn-ghost" [disabled]="!calculado() || !!accion()"
                        [attr.title]="calculado() ? null : 'Calcula el período antes de marcarlo como revisado'"
                        (click)="cambiarEstado('REVISADO')">
                  <cmx-icon name="check" [size]="16" /> Marcar como revisado
                </button>
              }
              @case ('REVISADO') {
                <button type="button" class="cmx-btn cmx-btn-primary" [disabled]="!!accion()" (click)="confirmacion.set('cerrar')">
                  Cerrar período
                  <span class="cmx-orb"><cmx-icon name="lock" [size]="15" /></span>
                </button>
                <button type="button" class="cmx-btn cmx-btn-ghost" [disabled]="!!accion()" (click)="cambiarEstado('EN_CURSO')">
                  <cmx-icon name="unlock" [size]="16" /> Reabrir
                </button>
              }
              @case ('CERRADO') {
                <span class="cmx-tag cmx-tag-ink"><cmx-icon name="lock" [size]="12" [stroke]="2" /> Congelado</span>
              }
            }
            <span class="flex-1"></span>
            <button type="button" class="cmx-btn cmx-btn-ghost" [disabled]="!calculado() || accion() === 'excel'" (click)="descargarExcel()">
              <cmx-icon name="download" [size]="16" /> {{ accion() === 'excel' ? 'Generando…' : 'Excel del período' }}
            </button>
            @if (r.periodo.estado === 'EN_CURSO') {
              <button type="button" class="cmx-icon-btn" [disabled]="!!accion()" (click)="confirmacion.set('eliminar')"
                      aria-label="Eliminar período" title="Eliminar período">
                <cmx-icon name="trash" />
              </button>
            }
          </div>

          @if (confirmacion(); as c) {
            <div class="mx-5 md:mx-6 mb-5 cmx-banner cmx-enter" [class.cmx-banner-neutral]="c === 'cerrar'" role="alertdialog"
                 aria-labelledby="cmx-confirmar-texto">
              <cmx-icon [name]="c === 'cerrar' ? 'lock' : 'trash'" />
              <span id="cmx-confirmar-texto" class="flex-1">
                @if (c === 'cerrar') {
                  <b>¿Cerrar el período?</b> Los resultados y el sustento quedan congelados y ya no se podrán recalcular ni editar.
                } @else {
                  <b>¿Eliminar el período?</b> Se borran su configuración, resultados, sustento e historial. Solo es posible mientras está en curso.
                }
              </span>
              <span class="flex gap-2">
                <button type="button" class="cmx-btn cmx-btn-ghost cmx-btn-sm" (click)="confirmacion.set(null)">Cancelar</button>
                @if (c === 'cerrar') {
                  <button type="button" class="cmx-btn cmx-btn-primary cmx-btn-sm" [disabled]="!!accion()" (click)="cambiarEstado('CERRADO')">Cerrar período</button>
                } @else {
                  <button type="button" class="cmx-btn cmx-btn-danger cmx-btn-sm" [disabled]="!!accion()" (click)="eliminar()">Eliminar</button>
                }
              </span>
            </div>
          }

          <!-- Pestañas -->
          <nav class="cmx-tabs" role="tablist" aria-label="Secciones del período">
            @for (t of pestanas; track t.id) {
              <button type="button" class="cmx-tab" role="tab" [attr.aria-selected]="pestana() === t.id"
                      [attr.aria-controls]="'cmx-panel-' + t.id" (click)="pestana.set(t.id)">
                <cmx-icon [name]="t.icono" [size]="16" /> {{ t.etiqueta }}
                @if (t.id === 'configuracion' && pendienteCalcular()) {
                  <span class="cmx-dot" style="color: var(--cmx-amber)" aria-label="Pendiente de calcular"></span>
                }
              </button>
            }
          </nav>
        </div>
      </section>

      <!-- Avisos -->
      @if (pendienteCalcular()) {
        <div class="cmx-banner mt-5 cmx-enter" role="status">
          <cmx-icon name="info" />
          <span class="flex-1">
            @if (r.participantes.length) {
              Aún no hay cálculo vigente con la configuración actual. Pulsa «Calcular» para leer los pagos conciliados del mes.
            } @else {
              El período no tiene participantes. En «Configuración», elige qué roles de Cashi comisionan como asesor y como supervisor.
            }
          </span>
          @if (!r.participantes.length && pestana() !== 'configuracion') {
            <button type="button" class="cmx-btn cmx-btn-ghost cmx-btn-sm" (click)="pestana.set('configuracion')">Ir a Configuración</button>
          }
        </div>
      }
      @if (advertencias().length) {
        <div class="cmx-banner mt-5 cmx-enter" role="status">
          <cmx-icon name="alert" />
          <div class="flex-1">
            <b>El último cálculo dejó {{ advertencias().length }} {{ advertencias().length === 1 ? 'aviso' : 'avisos' }}:</b>
            <ul class="mt-1 list-disc pl-5">
              @for (a of advertenciasVisibles(); track a) { <li>{{ a }}</li> }
            </ul>
            @if (advertencias().length > advertenciasVisibles().length) {
              <button type="button" class="underline mt-1 text-[0.8rem] cursor-pointer" (click)="verTodasAdvertencias.set(true)">
                Ver los {{ advertencias().length }}
              </button>
            }
          </div>
          <button type="button" class="cmx-icon-btn !w-8 !h-8" (click)="advertencias.set([])" aria-label="Ocultar avisos">
            <cmx-icon name="x" [size]="16" />
          </button>
        </div>
      }

      <!-- Contenido -->
      <div class="mt-6" [id]="'cmx-panel-' + pestana()" role="tabpanel">
        @switch (pestana()) {
          @case ('resultados') {
            <cmx-resultados-tab [reporte]="r" (verSustento)="seleccionado.set($event)" (descargar)="descargarSustento($event)" />
          }
          @case ('configuracion') {
            <cmx-configuracion-tab [reporte]="r" (actualizado)="aplicar($event)" />
          }
          @case ('sustento') {
            <cmx-sustento-tab [reporte]="r" />
          }
          @case ('historial') {
            <cmx-historial-tab [reporte]="r" />
          }
        }
      </div>

      @if (seleccionado(); as p) {
        <cmx-sustento-participante-panel [periodo]="r.periodo" [participante]="p" [participantes]="r.participantes"
                                         (cerrar)="seleccionado.set(null)" (descargar)="descargarSustento($event)" />
      }
    }
  `
})
export class PeriodoDetalleComponent {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly idPeriodo = input.required<number>();
  /** Reporte ya cargado (al crear el período) para no pedirlo otra vez */
  readonly reporteInicial = input<ReportePeriodo | null>(null);

  readonly volver = output<void>();
  /** El período cambió (estado, cálculo) o se eliminó: la lista debe refrescarse */
  readonly cambiado = output<{ eliminado: boolean }>();

  readonly estados: EstadoPeriodo[] = ['EN_CURSO', 'REVISADO', 'CERRADO'];
  readonly estadoInfo = ESTADO_INFO;
  readonly nombreMes = nombreMes;
  readonly pestanas: { id: Pestana; etiqueta: string; icono: string }[] = [
    { id: 'resultados', etiqueta: 'Resultados', icono: 'users' },
    { id: 'configuracion', etiqueta: 'Configuración', icono: 'sliders' },
    { id: 'sustento', etiqueta: 'Sustento', icono: 'receipt' },
    { id: 'historial', etiqueta: 'Historial', icono: 'history' }
  ];

  readonly reporte = signal<ReportePeriodo | null>(null);
  readonly cargando = signal(false);
  readonly errorCarga = signal<string | null>(null);
  readonly accion = signal<'calcular' | 'estado' | 'excel' | 'eliminar' | null>(null);
  readonly confirmacion = signal<Confirmacion>(null);
  readonly pestana = signal<Pestana>('resultados');
  readonly advertencias = signal<string[]>([]);
  readonly verTodasAdvertencias = signal(false);
  readonly seleccionado = signal<ParticipanteComision | null>(null);

  readonly metrica = computed(() => METRICA_INFO[this.reporte()?.periodo.tipoMetrica ?? 'RECAUDO']);
  readonly calculado = computed(() => !!this.reporte()?.periodo.fechaCalculo);
  readonly pendienteCalcular = computed(() => {
    const r = this.reporte();
    return !!r && r.periodo.estado === 'EN_CURSO' && !r.periodo.fechaCalculo;
  });
  readonly advertenciasVisibles = computed(() =>
    this.verTodasAdvertencias() ? this.advertencias() : this.advertencias().slice(0, 4)
  );

  constructor() {
    effect(() => {
      const id = this.idPeriodo();
      const inicial = this.reporteInicial();
      untracked(() => {
        this.pestana.set('resultados');
        this.advertencias.set([]);
        this.seleccionado.set(null);
        this.confirmacion.set(null);
        if (inicial && inicial.periodo.id === id) {
          this.reporte.set(inicial);
          // Recién creado y sin participantes: lo primero es configurarlo
          if (!inicial.participantes.length) {
            this.pestana.set('configuracion');
          }
        } else {
          this.cargar();
        }
      });
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.errorCarga.set(null);
    this.service.obtenerPeriodo(this.idPeriodo()).subscribe({
      next: r => {
        this.reporte.set(r);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.errorCarga.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'));
      }
    });
  }

  /** Reporte devuelto por una acción de configuración */
  aplicar(r: ReportePeriodo): void {
    this.reporte.set(r);
    this.advertencias.set([]);
    this.cambiado.emit({ eliminado: false });
  }

  pasado(e: EstadoPeriodo): boolean {
    const actual = this.reporte()?.periodo.estado;
    return !!actual && this.estados.indexOf(e) < this.estados.indexOf(actual);
  }

  calcular(): void {
    const r = this.reporte();
    if (!r || this.accion()) {
      return;
    }
    this.accion.set('calcular');
    this.service.calcular(r.periodo.id).subscribe({
      next: nuevo => {
        this.accion.set(null);
        this.reporte.set(nuevo);
        this.advertencias.set(nuevo.advertencias ?? []);
        this.verTodasAdvertencias.set(false);
        this.cambiado.emit({ eliminado: false });
        this.toast.success('Período calculado con los pagos conciliados del día.');
      },
      error: e => {
        this.accion.set(null);
        this.toast.error(mensajeError(e, 'No se pudo calcular el período.'), 6000);
      }
    });
  }

  cambiarEstado(estado: EstadoPeriodo): void {
    const r = this.reporte();
    if (!r || this.accion()) {
      return;
    }
    this.accion.set('estado');
    this.service.cambiarEstado(r.periodo.id, estado).subscribe({
      next: nuevo => {
        this.accion.set(null);
        this.confirmacion.set(null);
        this.reporte.set(nuevo);
        this.cambiado.emit({ eliminado: false });
        this.toast.success(
          estado === 'REVISADO' ? 'Período marcado como revisado.'
            : estado === 'CERRADO' ? 'Período cerrado. Los resultados quedaron congelados.'
              : 'Período reabierto.'
        );
      },
      error: e => {
        this.accion.set(null);
        this.toast.error(mensajeError(e, 'No se pudo cambiar el estado.'), 6000);
      }
    });
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
