import { ChangeDetectionStrategy, Component, effect, inject, input, signal, untracked } from '@angular/core';
import { AppDateTimePipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { AuditoriaComision, ReportePeriodo } from '../models/comision.model';
import { ACCION_INFO, mensajeError } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/** Nombre con que el backend anota los recálculos automáticos */
const AUTOMATICO = 'Recálculo automático';

/**
 * Historial del periodo: quién hizo qué y cuándo (comision_auditoria).
 * Los recálculos automáticos solo aparecen cuando cambiaron el resultado.
 */
@Component({
  selector: 'cmx-historial-tab',
  standalone: true,
  imports: [AppDateTimePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
        <section class="cmx-block cmx-enter" aria-labelledby="cmx-hist-titulo">
          <div class="cmx-block-head">
            <h3 id="cmx-hist-titulo" class="cmx-block-title">Historial del periodo</h3>
            <span class="cmx-block-desc">quién hizo qué y cuándo · los recálculos automáticos solo si cambió algo</span>
            <button type="button" class="cmx-icon-btn" style="margin-left:auto" (click)="cargar()" aria-label="Recargar historial">
              <cmx-icon name="refresh" [size]="16" />
            </button>
          </div>
          <div class="cmx-block-body">
            @if (cargando()) {
              <div style="display:grid;gap:12px">
                @for (i of [1, 2, 3]; track i) { <div class="cmx-skel" style="height:40px"></div> }
              </div>
            } @else if (error()) {
              <div class="cmx-empty">
                <b>No se pudo cargar el historial</b>
                <p>{{ error() }}</p>
              </div>
            } @else if (!items().length) {
              <div class="cmx-empty">
                <span class="cmx-empty-mark"><cmx-icon name="history" [size]="20" /></span>
                <p>Todavía no hay movimientos.</p>
              </div>
            } @else {
              <ol class="cmx-tl">
                @for (a of items(); track a.id; let i = $index) {
                  <li class="cmx-enter" [class.is-state]="a.accion === 'CAMBIAR_ESTADO'" [class.is-auto]="esAutomatico(a)"
                      [style.--i]="i < 12 ? i + 1 : 12">
                    <div class="cmx-tl-h">
                      <b>{{ titulo(a) }}</b>
                      <span>{{ esAutomatico(a) ? 'Sistema' : (a.nombreCompleto || 'Usuario ' + a.idUsuario) }} · {{ a.fecha | appDateTime }}</span>
                    </div>
                    @if (a.detalle) { <p>{{ a.detalle }}</p> }
                  </li>
                }
              </ol>
            }
          </div>
        </section>
  `
})
export class HistorialTabComponent {
  private readonly service = inject(ComisionesService);

  readonly reporte = input.required<ReportePeriodo>();

  readonly items = signal<AuditoriaComision[]>([]);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    // Cada reporte nuevo (guardado, cálculo, estado) puede agregar un movimiento: se recarga
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

  esAutomatico(a: AuditoriaComision): boolean {
    return a.accion === 'CALCULAR' && a.nombreCompleto === AUTOMATICO;
  }

  titulo(a: AuditoriaComision): string {
    if (a.accion === 'CALCULAR') {
      return this.esAutomatico(a) ? 'Se actualizó solo' : 'Actualizó los números';
    }
    if (a.accion === 'CAMBIAR_ESTADO') {
      return a.estadoNuevo === 'CERRADO' ? 'Cerró el periodo' : 'Reabrió el periodo';
    }
    return ACCION_INFO[a.accion];
  }
}
