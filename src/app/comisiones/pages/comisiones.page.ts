import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { PeriodoComision, ReportePeriodo } from '../models/comision.model';
import { ESTADOS, ESTADO_INFO, METRICA_INFO, mensajeError, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from '../components/cmx-icon.component';
import { CrearPeriodoPanelComponent } from '../components/crear-periodo-panel.component';
import { PeriodoDetalleComponent } from '../components/periodo-detalle.component';
import { SubcarteraConfigComponent } from '../components/subcartera-config.component';

type Seccion = 'periodos' | 'subcartera';

/**
 * Módulo de comisiones (solo administradores).
 * Un período por subcartera y mes: meta interna del reporte de producción, tramos, roles que
 * comisionan, cálculo automático sobre pagos conciliados, revisión y aprobación.
 * Mes, período abierto y sección (períodos o configuración de subcartera) viven en la URL.
 */
@Component({
  selector: 'app-comisiones',
  standalone: true,
  imports: [
    AppNumberPipe,
    AppDateTimePipe,
    CmxIconComponent,
    CrearPeriodoPanelComponent,
    PeriodoDetalleComponent,
    SubcarteraConfigComponent
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './comisiones.page.css',
  template: `
    <div class="cmx cmx-root">
      <div class="cmx-wrap">
        @if (seccion() === 'subcartera') {
          <cmx-subcartera-config [idSubcarteraInicial]="subcarteraConfig()"
                                 (volver)="irSeccion('periodos')" (guardado)="alGuardarSubcartera()" />
        } @else if (idPeriodo() != null) {
          <cmx-periodo-detalle [idPeriodo]="idPeriodo()!" [reporteInicial]="reporteCreado()"
                               (volver)="cerrarPeriodo()" (cambiado)="alCambiarPeriodo($event)" />
        } @else {
          <div class="cmx-app">
            <!-- ============ CONTEXTO ============ -->
            <div class="cmx-ctx">
              <span class="cmx-mark" aria-hidden="true"></span>
              <h1 class="cmx-crumb">Comisiones</h1>
              <span class="cmx-chip" role="group" aria-label="Mes">
                <button type="button" class="cmx-chip-nav" (click)="moverMes(-1)" aria-label="Mes anterior">
                  <cmx-icon name="chevron-left" [size]="14" />
                </button>
                <i>Período</i><span aria-live="polite">{{ nombreMes(mes()) }} {{ anio() }}</span>
                <button type="button" class="cmx-chip-nav" (click)="moverMes(1)" aria-label="Mes siguiente">
                  <cmx-icon name="chevron-right" [size]="14" />
                </button>
              </span>
              @if (!esMesActual()) {
                <button type="button" class="cmx-btn cmx-btn-link" (click)="irMesActual()">Mes actual</button>
              }
              <span class="cmx-right">
                <button type="button" class="cmx-btn cmx-btn-sec" (click)="configurarSubcartera(null)">
                  <cmx-icon name="sliders" [size]="15" /> Configurar subcartera
                </button>
                <button type="button" class="cmx-btn cmx-btn-act" (click)="creando.set(true)">
                  <cmx-icon name="plus" [size]="15" /> Nuevo período
                </button>
              </span>
            </div>

            <!-- ============ PERÍODOS DEL MES ============ -->
            <div class="cmx-body">
              <div class="cmx-side" role="complementary" aria-label="Resumen del mes">
                <h2 class="cmx-side-h">{{ nombreMes(mes()) }} {{ anio() }}</h2>
                <div class="cmx-rule cmx-enter">
                  <div class="cmx-rule-head"><span class="cmx-rule-title">Períodos del mes</span></div>
                  <div class="cmx-rule-value">{{ cargando() ? '…' : periodos().length }}</div>
                  <div class="cmx-rule-desc">{{ resumenEstados() || 'Ninguno todavía' }}</div>
                </div>
                <div class="cmx-rule cmx-enter" style="--i:1">
                  <div class="cmx-rule-head"><span class="cmx-rule-title">Comisiones calculadas</span></div>
                  <div class="cmx-rule-value">S/ {{ totalMes() | appNumber:'1.2-2' }}</div>
                  <div class="cmx-rule-desc">
                    Los períodos en curso se actualizan solos con cada pago conciliado o corregido.
                    @if (sinCalculo()) { <b>{{ sinCalculo() }} sin cálculo.</b> }
                  </div>
                </div>
                <div class="cmx-rule is-info cmx-enter" style="--i:2">
                  <div class="cmx-rule-head">
                    <span class="cmx-rule-title">Cómo se arma un período</span>
                    <button type="button" class="cmx-rule-action" (click)="configurarSubcartera(null)">Configurar</button>
                  </div>
                  <div class="cmx-rule-desc">
                    La meta sale de la meta interna del reporte de producción. Lo demás se copia de la configuración de la
                    subcartera o, si no tiene, del período anterior.
                  </div>
                </div>
              </div>

              <div class="cmx-main">
                <section class="cmx-block cmx-enter" style="--i:1" aria-labelledby="cmx-lista-titulo">
                  <div class="cmx-block-head">
                    <h2 id="cmx-lista-titulo" class="cmx-block-title">Períodos de {{ nombreMes(mes()).toLowerCase() }} {{ anio() }}</h2>
                    <span class="cmx-block-desc">uno por subcartera · haz clic en una fila para abrirlo</span>
                  </div>

                  @if (cargando()) {
                    <div class="cmx-block-body" style="display:grid;gap:10px">
                      @for (i of [1, 2, 3, 4]; track i) { <div class="cmx-skel" style="height:44px"></div> }
                    </div>
                  } @else if (error()) {
                    <div class="cmx-empty">
                      <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
                      <b>No se pudieron cargar los períodos</b>
                      <p style="max-width:46ch">{{ error() }}</p>
                      <button type="button" class="cmx-btn cmx-btn-sec" (click)="cargarPeriodos()">Reintentar</button>
                    </div>
                  } @else if (!periodos().length) {
                    <div class="cmx-empty">
                      <span class="cmx-empty-mark"><cmx-icon name="calendar" [size]="20" /></span>
                      <b>Aún no hay comisiones de {{ nombreMes(mes()).toLowerCase() }} {{ anio() }}</b>
                      <p style="max-width:52ch">
                        Abre un período por subcartera. La meta se toma del reporte de producción y, si la subcartera ya tuvo
                        un período, se copian sus tramos y roles.
                      </p>
                      <button type="button" class="cmx-btn cmx-btn-act" (click)="creando.set(true)">
                        <cmx-icon name="plus" [size]="15" /> Abrir el primer período
                      </button>
                    </div>
                  } @else {
                    <div class="cmx-tw">
                      <table class="cmx-table">
                        <thead>
                          <tr>
                            <th scope="col">Subcartera</th>
                            <th scope="col">Se mide por</th>
                            <th scope="col" class="n">Meta</th>
                            <th scope="col">Estado</th>
                            <th scope="col" class="n">Comisiones</th>
                            <th scope="col">Último movimiento</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (p of periodos(); track p.id; let i = $index) {
                            <tr class="is-click cmx-enter" [style.--i]="i + 2" tabindex="0"
                                (click)="abrirPeriodo(p.id)" (keydown.enter)="abrirPeriodo(p.id)"
                                [attr.aria-label]="'Abrir comisiones de ' + p.nombreSubcartera">
                              <td class="who">{{ p.nombreSubcartera }}</td>
                              <td>{{ metricaInfo[p.tipoMetrica].etiqueta }}</td>
                              <td class="n">{{ p.metaGrupal | appNumber:'1.2-2' }}</td>
                              <td><span class="cmx-state" [class]="'cmx-state ' + estadoInfo[p.estado].clase">{{ estadoInfo[p.estado].etiqueta }}</span></td>
                              <td class="n" [class.tot]="!!p.fechaCalculo" [class.na]="!p.fechaCalculo">
                                {{ p.fechaCalculo ? (p.totalComisiones | appNumber:'1.2-2') : '—' }}
                              </td>
                              <td class="is-soft" [class.is-warn]="!p.fechaCalculo && p.estado === 'EN_CURSO'">
                                @switch (p.estado) {
                                  @case ('APROBADO') { Aprobado por {{ p.aprobadoPorNombre }} · {{ p.fechaAprobacion | appDateTime }} }
                                  @case ('REVISADO') { Revisado por {{ p.revisadoPorNombre }} · espera aprobación }
                                  @case ('EN_REVISION') { En revisión desde {{ p.fechaEnvioRevision | appDateTime }} }
                                  @default {
                                    @if (p.fechaCalculo) { Actualizado {{ p.fechaCalculo | appDateTime }} }
                                    @else if (!p.roles.length) { Falta elegir los roles }
                                    @else { Sin cálculo: revisa meta y participantes }
                                  }
                                }
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </section>
              </div>
            </div>
          </div>
        }
      </div>

      @if (creando()) {
        <cmx-crear-periodo-panel [anioInicial]="anio()" [mesInicial]="mes()" [subcarterasConPeriodo]="subcarterasConPeriodo()"
                                 (cerrar)="creando.set(false)" (creado)="alCrear($event)" />
      }
    </div>
  `
})
export class ComisionesPage implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly estadoInfo = ESTADO_INFO;
  readonly metricaInfo = METRICA_INFO;
  readonly nombreMes = nombreMes;

  private readonly hoy = new Date();
  readonly anio = signal(this.hoy.getFullYear());
  readonly mes = signal(this.hoy.getMonth() + 1);
  readonly idPeriodo = signal<number | null>(null);
  readonly seccion = signal<Seccion>('periodos');
  /** Subcartera con la que se abre la configuración */
  readonly subcarteraConfig = signal<number | null>(null);

  readonly periodos = signal<PeriodoComision[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  readonly creando = signal(false);
  /** Reporte recién creado, para abrir el detalle sin volver a pedirlo */
  readonly reporteCreado = signal<ReportePeriodo | null>(null);

  readonly esMesActual = computed(() =>
    this.anio() === this.hoy.getFullYear() && this.mes() === this.hoy.getMonth() + 1
  );

  readonly subcarterasConPeriodo = computed(() => this.periodos().map(p => p.idSubcartera));

  readonly resumenEstados = computed(() => ESTADOS
    .map(estado => ({ estado, cantidad: this.periodos().filter(p => p.estado === estado).length }))
    .filter(e => e.cantidad > 0)
    .map(e => `${e.cantidad} ${ESTADO_INFO[e.estado].etiqueta.toLowerCase()}`)
    .join(' · '));

  readonly totalMes = computed(() => this.periodos().reduce((s, p) => s + (p.fechaCalculo ? p.totalComisiones ?? 0 : 0), 0));
  readonly sinCalculo = computed(() => this.periodos().filter(p => !p.fechaCalculo).length);

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    const anio = Number(q.get('anio'));
    const mes = Number(q.get('mes'));
    const periodo = Number(q.get('periodo'));
    if (anio >= 2020 && anio <= 2100) {
      this.anio.set(anio);
    }
    if (mes >= 1 && mes <= 12) {
      this.mes.set(mes);
    }
    if (periodo > 0) {
      this.idPeriodo.set(periodo);
    }
    if (q.get('seccion') === 'subcartera') {
      const sub = Number(q.get('subcartera'));
      this.subcarteraConfig.set(sub > 0 ? sub : null);
      this.seccion.set('subcartera');
    }
    this.cargarPeriodos();
  }

  cargarPeriodos(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.service.listarPeriodos(this.anio(), this.mes()).subscribe({
      next: data => {
        this.periodos.set(data);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'));
      }
    });
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
    this.cambiarMes(anio, mes);
  }

  irMesActual(): void {
    this.cambiarMes(this.hoy.getFullYear(), this.hoy.getMonth() + 1);
  }

  private cambiarMes(anio: number, mes: number): void {
    this.anio.set(anio);
    this.mes.set(mes);
    this.idPeriodo.set(null);
    this.reporteCreado.set(null);
    this.sincronizarUrl();
    this.cargarPeriodos();
  }

  configurarSubcartera(idSubcartera: number | null): void {
    this.subcarteraConfig.set(idSubcartera);
    this.seccion.set('subcartera');
    this.sincronizarUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  irSeccion(seccion: Seccion): void {
    this.seccion.set(seccion);
    this.sincronizarUrl();
  }

  alGuardarSubcartera(): void {
    this.irSeccion('periodos');
    this.cargarPeriodos();
  }

  abrirPeriodo(id: number): void {
    this.reporteCreado.set(null);
    this.idPeriodo.set(id);
    this.sincronizarUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cerrarPeriodo(): void {
    this.idPeriodo.set(null);
    this.reporteCreado.set(null);
    this.sincronizarUrl();
  }

  alCrear(reporte: ReportePeriodo): void {
    this.creando.set(false);
    const p = reporte.periodo;
    if (p.anio !== this.anio() || p.mes !== this.mes()) {
      this.anio.set(p.anio);
      this.mes.set(p.mes);
    }
    this.cargarPeriodos();
    this.reporteCreado.set(reporte);
    this.idPeriodo.set(p.id);
    this.sincronizarUrl();
  }

  alCambiarPeriodo(evento: { eliminado: boolean }): void {
    if (evento.eliminado) {
      this.cerrarPeriodo();
    }
    this.cargarPeriodos();
  }

  private sincronizarUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      replaceUrl: true,
      queryParams: {
        anio: this.anio(),
        mes: this.mes(),
        periodo: this.seccion() === 'periodos' ? this.idPeriodo() : null,
        seccion: this.seccion() === 'subcartera' ? 'subcartera' : null,
        subcartera: this.seccion() === 'subcartera' ? this.subcarteraConfig() : null
      }
    });
  }
}
