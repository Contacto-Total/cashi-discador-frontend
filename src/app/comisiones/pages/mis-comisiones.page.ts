import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDateTimePipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { MiPeriodoComision, ReportePeriodo, VistaSustento } from '../models/comision.model';
import { codigoPeriodo, diaMes, mensajeError, nombreConGrupo } from '../comisiones.util';
import { CmxIconComponent } from '../components/cmx-icon.component';
import { PeriodoPickerComponent } from '../components/periodo-picker.component';
import { SustentoTabComponent } from '../components/sustento-tab.component';

/** Clave para comparar meses: 2026-09 → 24321 */
function claveMes(p: { anio: number; mes: number }): number {
  return p.anio * 12 + p.mes;
}

/**
 * Mis comisiones: cada usuario ve solo su sustento (el mismo de la pestaña Sustento del módulo de
 * comisiones), de los períodos en los que participa y que ya se recalcularon. Solo lectura.
 * El periodo se elige como en Comisiones (flechas y grilla del año); si un mes participa en más de una
 * subcartera, se elige cuál. El periodo vive en la URL (?periodo=id).
 */
@Component({
  selector: 'app-mis-comisiones',
  standalone: true,
  imports: [AppDateTimePipe, CmxIconComponent, PeriodoPickerComponent, SustentoTabComponent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './comisiones.page.css',
  template: `
    <div class="cmx cmx-root">
      <div class="cmx-wrap">
        <div class="cmx-app">
          <div class="cmx-ctx">
            <span class="cmx-mark" aria-hidden="true"></span>
            <h1 class="cmx-crumb">Mis comisiones</h1>
            @if (actual(); as a) {
              <div class="cmx-pnav">
                <button type="button" class="cmx-arr" (click)="irA(anterior())" [disabled]="!anterior()" aria-label="Periodo anterior"
                        [attr.title]="anterior() ? codigo(anterior()!) : null">
                  <cmx-icon name="chevron-left" [size]="16" />
                </button>
                <cmx-periodo-picker [anio]="a.anio" [mes]="a.mes" [estadoActual]="a.estado === 'CERRADO' ? 'CERRADO' : 'ABIERTO'"
                                    [propios]="periodos()" (cambiar)="irAMes($event.anio, $event.mes)" />
                <button type="button" class="cmx-arr" (click)="irA(siguiente())" [disabled]="!siguiente()" aria-label="Periodo siguiente"
                        [attr.title]="siguiente() ? codigo(siguiente()!) : null">
                  <cmx-icon name="chevron-right" [size]="16" />
                </button>
              </div>
              <span class="cmx-right">
                @if (delMes().length > 1) {
                  <span class="cmx-who" role="group" aria-label="Subcartera" style="margin:0">
                    @for (p of delMes(); track p.idPeriodo) {
                      <button type="button" [attr.aria-pressed]="p.idPeriodo === a.idPeriodo" (click)="irA(p)">{{ nombre(p) }}</button>
                    }
                  </span>
                } @else {
                  <span class="cmx-fsum-m">Subcartera <b>{{ nombre(a) }}</b></span>
                }
              </span>
            }
          </div>

          @if (actual() && reporte(); as r) {
            <div class="cmx-strip">
              <ol class="cmx-steps" aria-label="Estado del periodo">
                <li class="cmx-step" [class.is-now]="r.periodo.estado === 'EN_CURSO'" [class.is-done]="r.periodo.estado === 'CERRADO'">
                  <span class="cmx-step-dot">{{ r.periodo.estado === 'CERRADO' ? '✓' : '' }}</span>Abierto
                </li>
                <li class="cmx-step-ln" aria-hidden="true"></li>
                <li class="cmx-step" [class.is-now]="r.periodo.estado === 'CERRADO'"><span class="cmx-step-dot"></span>Cerrado</li>
              </ol>
              <span>
                @if (r.periodo.estado === 'CERRADO') {
                  <b>Cerrado{{ r.periodo.fechaCierre ? ' el ' + (r.periodo.fechaCierre | appDateTime) : '' }}.</b> Este es el monto final del periodo.
                } @else {
                  Recalculado el <b>{{ r.periodo.fechaCalculo | appDateTime }}</b>
                  @if (r.periodo.pagosHasta) { con los pagos conciliados hasta el <b>{{ diaMes(r.periodo.pagosHasta) }}</b> }.
                  Los montos pueden cambiar hasta que se cierre el periodo.
                }
              </span>
            </div>
          }

          <div class="cmx-main">
            @if (error()) {
              <div class="cmx-empty">
                <span class="cmx-empty-mark"><cmx-icon name="alert" [size]="20" /></span>
                <b>No se pudo cargar tus comisiones</b>
                <p style="max-width:52ch">{{ error() }}</p>
                <button type="button" class="cmx-btn cmx-btn-sec" (click)="reintentar()">Reintentar</button>
              </div>
            } @else if (periodos() === null || (actual() && !reporte())) {
              <div style="display:grid;gap:12px">
                <div class="cmx-skel" style="height:34px;max-width:520px"></div>
                <div class="cmx-skel" style="height:260px"></div>
              </div>
            } @else if (!actual()) {
              <div class="cmx-empty cmx-enter">
                <span class="cmx-empty-mark"><cmx-icon name="receipt" [size]="20" /></span>
                <b>Todavía no tienes comisiones para ver</b>
                <p style="max-width:52ch">Aquí verás cuánto llevas y cómo se arma lo que cobras cuando se configure y recalcule un periodo en el que participas.</p>
              </div>
            } @else if (reporte(); as r) {
              <cmx-sustento-tab [reporte]="r" [vista]="vistaSustento()!" [fuenteDetalle]="fuenteDetalle" />
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class MisComisionesPage implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly diaMes = diaMes;

  /** null = cargando; del más reciente al más antiguo */
  readonly periodos = signal<MiPeriodoComision[] | null>(null);
  readonly idPeriodo = signal<number | null>(null);
  readonly reporte = signal<ReportePeriodo | null>(null);
  readonly error = signal<string | null>(null);

  readonly fuenteDetalle = (id: number) => this.service.miDetalle(id);

  readonly actual = computed(() => this.periodos()?.find(p => p.idPeriodo === this.idPeriodo()) ?? null);

  /** Los períodos del mes elegido (más de uno si participa en varias subcarteras) */
  readonly delMes = computed(() => {
    const a = this.actual();
    return a ? (this.periodos() ?? []).filter(p => claveMes(p) === claveMes(a)) : [];
  });

  /** El mes anterior con comisión, saltando los vacíos */
  readonly anterior = computed(() => {
    const a = this.actual();
    return a ? (this.periodos() ?? []).find(p => claveMes(p) < claveMes(a)) ?? null : null;
  });

  /** El mes siguiente con comisión, saltando los vacíos */
  readonly siguiente = computed(() => {
    const a = this.actual();
    return a ? [...(this.periodos() ?? [])].reverse().find(p => claveMes(p) > claveMes(a)) ?? null : null;
  });

  /** El sustento muestra los pagos hasta el último recálculo, no los que llegaron después */
  readonly vistaSustento = computed<VistaSustento | null>(() => {
    const r = this.reporte();
    return r ? { anio: r.periodo.anio, mes: r.periodo.mes, pagos: { ultimaFechaBanco: r.periodo.pagosHasta ?? null } } : null;
  });

  ngOnInit(): void {
    this.cargarPeriodos(Number(this.route.snapshot.queryParamMap.get('periodo')) || null);
  }

  codigo(p: MiPeriodoComision): string {
    return codigoPeriodo(p.anio, p.mes);
  }

  nombre(p: MiPeriodoComision): string {
    return nombreConGrupo(p.nombreSubcartera, p.grupo);
  }

  irA(p: MiPeriodoComision | null): void {
    if (!p || p.idPeriodo === this.idPeriodo()) {
      return;
    }
    this.idPeriodo.set(p.idPeriodo);
    this.router.navigate([], { relativeTo: this.route, replaceUrl: true, queryParams: { periodo: p.idPeriodo } });
    this.cargarReporte();
  }

  irAMes(anio: number, mes: number): void {
    this.irA((this.periodos() ?? []).find(p => p.anio === anio && p.mes === mes) ?? null);
  }

  reintentar(): void {
    if (this.periodos() === null) {
      this.cargarPeriodos(this.idPeriodo());
    } else {
      this.cargarReporte();
    }
  }

  private cargarPeriodos(pedido: number | null): void {
    this.error.set(null);
    this.service.misPeriodos().subscribe({
      next: lista => {
        this.periodos.set(lista);
        const elegido = lista.find(p => p.idPeriodo === pedido) ?? lista[0] ?? null;
        this.idPeriodo.set(elegido?.idPeriodo ?? null);
        if (elegido) {
          this.cargarReporte();
        }
      },
      error: e => this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'))
    });
  }

  private cargarReporte(): void {
    const id = this.idPeriodo();
    if (id == null) {
      return;
    }
    this.reporte.set(null);
    this.error.set(null);
    this.service.miPeriodo(id).subscribe({
      next: r => {
        if (r.periodo.id === this.idPeriodo()) {
          this.reporte.set(r);
        }
      },
      error: e => this.error.set(mensajeError(e, 'Revisa tu conexión e intenta de nuevo.'))
    });
  }
}
