import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { EstadoPeriodo, PeriodoComision, ReportePeriodo } from '../models/comision.model';
import { ESTADO_INFO, METRICA_INFO, mensajeError, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from '../components/cmx-icon.component';
import { CrearPeriodoPanelComponent } from '../components/crear-periodo-panel.component';
import { PeriodoDetalleComponent } from '../components/periodo-detalle.component';
import { BaseAjusteComponent } from '../components/base-ajuste.component';

type Seccion = 'periodos' | 'base-ajuste';

/**
 * Módulo de comisiones (solo administradores).
 * Un período por subcartera y mes: meta interna del reporte de producción, tramos, roles que
 * comisionan, cálculo sobre pagos conciliados, revisión y cierre.
 * Mes, período abierto y sección viven en la URL para poder enlazarlos.
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
    BaseAjusteComponent
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './comisiones.page.css',
  template: `
    <div class="cmx">
      <div class="cmx-wrap">
        <!-- ============ CABECERA ============ -->
        <header class="flex flex-wrap items-end gap-x-10 gap-y-6 mb-10">
          <div class="flex-1 min-w-[18rem] cmx-enter">
            <span class="cmx-eyebrow">Administración</span>
            <h1 class="cmx-title mt-4">Comisiones</h1>
            <p class="cmx-soft-text mt-3 max-w-[60ch] text-[0.95rem]">
              Metas del reporte de producción, pagos conciliados y la tabla de tramos de cada subcartera,
              con el sustento de cada monto.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 cmx-enter" style="--i:1">
            <div class="cmx-seg" role="tablist" aria-label="Sección">
              <button type="button" role="tab" [attr.aria-selected]="seccion() === 'periodos'" (click)="irSeccion('periodos')">Períodos</button>
              <button type="button" role="tab" [attr.aria-selected]="seccion() === 'base-ajuste'" (click)="irSeccion('base-ajuste')">Base de ajuste</button>
            </div>

            <div class="flex items-center gap-1 rounded-full pl-1 pr-1 py-1" style="background: var(--cmx-surface); box-shadow: inset 0 0 0 1px var(--cmx-line-strong)"
                 role="group" aria-label="Mes">
              <button type="button" class="cmx-icon-btn !w-9 !h-9" (click)="moverMes(-1)" aria-label="Mes anterior">
                <cmx-icon name="chevron-left" />
              </button>
              <span class="min-w-[9.5rem] text-center font-semibold text-[0.9rem] cmx-num" aria-live="polite">
                {{ nombreMes(mes()) }} {{ anio() }}
              </span>
              <button type="button" class="cmx-icon-btn !w-9 !h-9" (click)="moverMes(1)" aria-label="Mes siguiente">
                <cmx-icon name="chevron-right" />
              </button>
            </div>
            @if (!esMesActual()) {
              <button type="button" class="cmx-btn cmx-btn-link cmx-btn-sm" (click)="irMesActual()">Mes actual</button>
            }
          </div>
        </header>

        @if (seccion() === 'base-ajuste') {
          <cmx-base-ajuste [anio]="anio()" [mes]="mes()" />
        } @else if (idPeriodo() != null) {
          <cmx-periodo-detalle [idPeriodo]="idPeriodo()!" [reporteInicial]="reporteCreado()"
                               (volver)="cerrarPeriodo()" (cambiado)="alCambiarPeriodo($event)" />
        } @else {
          <!-- ============ PERÍODOS DEL MES ============ -->
          @if (!cargando() && periodos().length) {
            <p class="cmx-muted text-[0.84rem] mb-4 cmx-enter">
              {{ periodos().length }} {{ periodos().length === 1 ? 'período' : 'períodos' }} en {{ nombreMes(mes()).toLowerCase() }}
              @for (e of resumenEstados(); track e.estado) {
                · <span class="cmx-soft-text">{{ e.cantidad }} {{ estadoInfo[e.estado].etiqueta.toLowerCase() }}</span>
              }
            </p>
          }

          @if (cargando()) {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              @for (i of [1, 2, 3]; track i) { <div class="cmx-skeleton h-56 rounded-[1.5rem]"></div> }
            </div>
          } @else if (error()) {
            <div class="cmx-shell">
              <div class="cmx-core">
                <div class="cmx-empty">
                  <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="22" /></span>
                  <p class="font-semibold" style="color: var(--cmx-ink)">No se pudieron cargar los períodos</p>
                  <p class="text-[0.86rem] max-w-[46ch]">{{ error() }}</p>
                  <button type="button" class="cmx-btn cmx-btn-ghost" (click)="cargarPeriodos()">Reintentar</button>
                </div>
              </div>
            </div>
          } @else if (!periodos().length) {
            <div class="cmx-shell cmx-enter">
              <div class="cmx-core">
                <div class="cmx-empty py-16">
                  <span class="cmx-empty-mark"><cmx-icon name="calendar" [size]="22" /></span>
                  <p class="font-semibold text-[1.05rem]" style="color: var(--cmx-ink)">
                    Aún no hay comisiones de {{ nombreMes(mes()).toLowerCase() }} {{ anio() }}
                  </p>
                  <p class="text-[0.88rem] max-w-[52ch]">
                    Abre un período por subcartera. La meta se toma del reporte de producción y, si la subcartera ya tuvo
                    un período, se copian sus tramos y roles.
                  </p>
                  <button type="button" class="cmx-btn cmx-btn-primary mt-2" (click)="creando.set(true)">
                    Abrir el primer período
                    <span class="cmx-orb"><cmx-icon name="plus" [size]="15" /></span>
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              @for (p of periodos(); track p.id; let i = $index) {
                <button type="button" class="cmx-period-card cmx-enter" [style.--i]="i" (click)="abrirPeriodo(p.id)"
                        [attr.aria-label]="'Abrir comisiones de ' + p.nombreSubcartera + ', ' + estadoInfo[p.estado].etiqueta">
                  <span class="cmx-shell block h-full">
                    <span class="cmx-core flex flex-col h-full p-5">
                      <span class="flex items-center justify-between gap-3">
                        <span class="cmx-tag" [class.cmx-tag-brand]="p.estado === 'EN_CURSO'"
                              [class.cmx-tag-amber]="p.estado === 'REVISADO'" [class.cmx-tag-ink]="p.estado === 'CERRADO'">
                          @if (p.estado === 'CERRADO') { <cmx-icon name="lock" [size]="11" [stroke]="2" /> } @else { <span class="cmx-dot"></span> }
                          {{ estadoInfo[p.estado].etiqueta }}
                        </span>
                        <span class="cmx-muted text-[0.74rem]">{{ metricaInfo[p.tipoMetrica].etiqueta }}</span>
                      </span>

                      <span class="block text-[1.3rem] font-bold tracking-tight leading-tight mt-5">{{ p.nombreSubcartera }}</span>

                      <span class="block mt-4">
                        <span class="cmx-label block">Meta del mes</span>
                        <span class="block cmx-num font-bold text-[1.35rem] tracking-tight">
                          <span class="text-[0.8rem] cmx-muted mr-1">S/</span>{{ p.metaGrupal | appNumber:'1.2-2' }}
                        </span>
                      </span>

                      <span class="flex items-end justify-between gap-3 mt-auto pt-5 border-t border-dashed" style="border-color: var(--cmx-line-strong)">
                        <span class="text-[0.76rem] cmx-muted leading-snug">
                          @if (p.cerradoPorNombre) {
                            Cerrado por {{ p.cerradoPorNombre }}
                          } @else if (p.revisadoPorNombre) {
                            Revisado por {{ p.revisadoPorNombre }}
                          } @else if (p.fechaCalculo) {
                            Calculado {{ p.fechaCalculo | appDateTime }}
                          } @else {
                            <span style="color: var(--cmx-amber)">Sin cálculo vigente</span>
                          }
                          <span class="block">{{ p.roles.length }} {{ p.roles.length === 1 ? 'rol' : 'roles' }} · {{ p.escalas.length }} tramos</span>
                        </span>
                        <span class="cmx-orb !w-9 !h-9" style="background: var(--cmx-sunken); color: var(--cmx-ink)">
                          <cmx-icon name="arrow-up-right" [size]="16" />
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              }

              <button type="button" class="cmx-new-card cmx-enter" [style.--i]="periodos().length" (click)="creando.set(true)">
                <span class="cmx-empty-mark"><cmx-icon name="plus" [size]="22" /></span>
                <span>
                  <span class="block font-bold text-[1.05rem]" style="color: var(--cmx-ink)">Nuevo período</span>
                  <span class="block text-[0.82rem] mt-1 max-w-[30ch]">Otra subcartera para {{ nombreMes(mes()).toLowerCase() }}.</span>
                </span>
              </button>
            </div>
          }
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
  readonly seccion = signal<Seccion>('periodos');
  readonly idPeriodo = signal<number | null>(null);

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

  readonly resumenEstados = computed(() => {
    const orden: EstadoPeriodo[] = ['EN_CURSO', 'REVISADO', 'CERRADO'];
    return orden
      .map(estado => ({ estado, cantidad: this.periodos().filter(p => p.estado === estado).length }))
      .filter(e => e.cantidad > 0);
  });

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
    if (q.get('seccion') === 'base-ajuste') {
      this.seccion.set('base-ajuste');
    }
    if (periodo > 0) {
      this.idPeriodo.set(periodo);
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

  irSeccion(seccion: Seccion): void {
    this.seccion.set(seccion);
    this.sincronizarUrl();
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
        seccion: this.seccion() === 'base-ajuste' ? 'base-ajuste' : null
      }
    });
  }
}
