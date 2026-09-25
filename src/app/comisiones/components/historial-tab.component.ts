import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { AppDateTimePipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { AuditoriaComision, ReportePeriodo } from '../models/comision.model';
import { ACCION_INFO, ESTADO_INFO, mensajeError } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Historial del período: quién hizo qué y cuándo (comision_auditoria).
 */
@Component({
  selector: 'cmx-historial-tab',
  standalone: true,
  imports: [AppDateTimePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="cmx-shell cmx-enter" aria-labelledby="cmx-hist-titulo">
      <div class="cmx-core">
        <header class="cmx-card-head">
          <div class="flex-1">
            <h3 id="cmx-hist-titulo" class="font-bold text-[0.92rem]">Historial del período</h3>
            <p class="cmx-muted text-[0.76rem]">Cada cambio de configuración, cálculo y cambio de estado, con quién lo hizo.</p>
          </div>
          <button type="button" class="cmx-icon-btn" (click)="cargar()" aria-label="Recargar historial">
            <cmx-icon name="refresh" />
          </button>
        </header>

        <div class="cmx-card-body">
          @if (cargando()) {
            <div class="flex flex-col gap-4">
              @for (i of [1, 2, 3]; track i) { <div class="cmx-skeleton h-14"></div> }
            </div>
          } @else if (error()) {
            <div class="cmx-banner" role="alert">
              <cmx-icon name="alert" />
              <span>{{ error() }}</span>
            </div>
          } @else if (!items().length) {
            <div class="cmx-empty">
              <span class="cmx-empty-mark"><cmx-icon name="history" [size]="22" /></span>
              <p class="text-[0.86rem]">Todavía no hay movimientos.</p>
            </div>
          } @else {
            <ol class="cmx-timeline">
              @for (a of items(); track a.id; let i = $index) {
                <li class="cmx-timeline-item cmx-enter" [class.is-state]="a.accion === 'CAMBIAR_ESTADO'" [style.--i]="i < 12 ? i : 12">
                  <div class="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span class="font-semibold text-[0.88rem]">{{ acciones[a.accion] }}</span>
                    @if (a.accion === 'CAMBIAR_ESTADO' && a.estadoNuevo) {
                      <span class="cmx-tag">
                        {{ a.estadoAnterior ? estados[a.estadoAnterior].etiqueta : '' }} → {{ estados[a.estadoNuevo].etiqueta }}
                      </span>
                    }
                    <span class="cmx-muted text-[0.78rem]">{{ a.nombreCompleto || 'Usuario ' + a.idUsuario }} · {{ a.fecha | appDateTime }}</span>
                  </div>
                  @if (a.detalle) {
                    <p class="cmx-soft-text text-[0.82rem] mt-1 max-w-[90ch] break-words">{{ a.detalle }}</p>
                  }
                </li>
              }
            </ol>
          }
        </div>
      </div>
    </section>
  `
})
export class HistorialTabComponent {
  private readonly service = inject(ComisionesService);

  readonly reporte = input.required<ReportePeriodo>();

  readonly acciones = ACCION_INFO;
  readonly estados = ESTADO_INFO;
  readonly items = signal<AuditoriaComision[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Cada reporte nuevo (guardado, cálculo, estado) agrega un movimiento: se recarga
    effect(() => {
      this.reporte();
      untracked(() => this.cargar());
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.service.historial(this.reporte().periodo.id).subscribe({
      next: items => {
        this.items.set(items);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'No se pudo cargar el historial.'));
      }
    });
  }
}
