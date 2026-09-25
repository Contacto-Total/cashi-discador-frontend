import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { AppDatePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ComisionesService } from '../services/comisiones.service';
import { MotivoExclusion, PagoSustento, ParticipanteComision, PeriodoComision } from '../models/comision.model';
import {
  METRICA_INFO,
  MOTIVO_INFO,
  ROL_INFO,
  asesoresActivos,
  mensajeError,
  nombreMes,
  siguienteTramo,
  tramosDe
} from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Sustento de un participante: la respuesta a "¿por qué me pagaron esto?".
 * Asesor: los pagos de sus gestiones (también los que no sumaron). Supervisor: todos los de la subcartera.
 */
@Component({
  selector: 'cmx-sustento-participante-panel',
  standalone: true,
  imports: [AppNumberPipe, AppDatePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-overlay" (click)="cerrar.emit()"></div>
    <section class="cmx-panel cmx-panel-wide" role="dialog" aria-modal="true" aria-labelledby="cmx-sust-titulo"
             (keydown.escape)="cerrar.emit()">
      <header class="cmx-panel-head">
        <div class="flex-1 min-w-0">
          <span class="cmx-eyebrow">Sustento · {{ rolInfo[participante().rol] }}</span>
          <h2 id="cmx-sust-titulo" class="text-[1.4rem] font-bold tracking-tight mt-3 leading-tight">{{ participante().nombre }}</h2>
          <p class="cmx-muted text-[0.82rem] mt-1">
            {{ periodo().nombreSubcartera }} · {{ nombreMes(periodo().mes) }} {{ periodo().anio }}
            · se mide por {{ metrica().etiqueta.toLowerCase() }}
          </p>
        </div>
        <button type="button" class="cmx-icon-btn" (click)="cerrar.emit()" aria-label="Cerrar sustento">
          <cmx-icon name="x" />
        </button>
      </header>

      <div class="cmx-panel-body">
        @if (participante().quitado) {
          <div class="cmx-banner mb-5" role="status">
            <cmx-icon name="user-minus" />
            <span>Fue quitado del período: no divide la meta ni comisiona. Sus pagos figuran abajo como «Asesor quitado».</span>
          </div>
        }

        <!-- Conceptos -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="rounded-2xl p-4" style="background: var(--cmx-brand-soft); color: var(--cmx-brand-ink)">
            <span class="text-[0.66rem] font-bold tracking-[0.14em] uppercase">Comisión</span>
            <div class="cmx-kpi-value mt-1" style="color: inherit"><small style="color: inherit; opacity: .7">S/</small>{{ participante().montoComision | appNumber:'1.2-2' }}</div>
          </div>
          <div class="rounded-2xl p-4" style="box-shadow: inset 0 0 0 1px var(--cmx-line-strong)">
            <span class="cmx-label">Cumplimiento</span>
            <div class="cmx-kpi-value mt-1">{{ participante().porcentajeCumplimiento != null ? (participante().porcentajeCumplimiento | appNumber:'1.1-2') + ' %' : '—' }}</div>
          </div>
          <div class="rounded-2xl p-4" style="box-shadow: inset 0 0 0 1px var(--cmx-line-strong)">
            <span class="cmx-label">Tramo alcanzado</span>
            <div class="cmx-kpi-value mt-1">{{ participante().porcentajeTramo != null ? 'desde ' + participante().porcentajeTramo + ' %' : 'ninguno' }}</div>
          </div>
        </div>

        <!-- Desglose -->
        @if (!participante().quitado) {
          <div class="cmx-breakdown mt-5">
            <div class="cmx-breakdown-row">
              <span class="k">{{ metrica().logrado }}</span>
              <span class="d">{{ descripcionLogrado() }}</span>
              <span class="a cmx-num">S/ {{ participante().logrado | appNumber:'1.2-2' }}</span>
            </div>
            <div class="cmx-breakdown-row">
              <span class="k">Meta</span>
              <span class="d">
                @if (participante().rol === 'ASESOR') {
                  S/ {{ periodo().metaGrupal | appNumber:'1.2-2' }} ÷ {{ n() }} {{ n() === 1 ? 'asesor' : 'asesores' }}, igual para todos
                } @else {
                  Meta completa de la subcartera (meta interna del reporte de producción)
                }
              </span>
              <span class="a cmx-num">S/ {{ participante().metaIndividual | appNumber:'1.2-2' }}</span>
            </div>
            <div class="cmx-breakdown-row">
              <span class="k">Cumplimiento</span>
              <span class="d cmx-num">
                {{ participante().logrado | appNumber:'1.0-2' }} ÷ {{ participante().metaIndividual | appNumber:'1.0-2' }}
              </span>
              <span class="a cmx-num">{{ participante().porcentajeCumplimiento | appNumber:'1.1-2' }} %</span>
            </div>
            <div class="cmx-breakdown-row is-total">
              <span class="k">Comisión</span>
              <span class="d">
                {{ participante().porcentajeTramo != null
                  ? 'Tramo desde ' + participante().porcentajeTramo + ' % de la tabla del ' + rolInfo[participante().rol].toLowerCase()
                  : 'No llegó al primer tramo de la tabla del ' + rolInfo[participante().rol].toLowerCase() }}
              </span>
              <span class="a cmx-num">S/ {{ participante().montoComision | appNumber:'1.2-2' }}</span>
            </div>
          </div>

          @if (siguiente(); as s) {
            <p class="mt-4 rounded-2xl p-4 text-[0.86rem] cmx-soft-text" style="background: var(--cmx-soft); box-shadow: inset 0 0 0 1px var(--cmx-line)">
              <b style="color: var(--cmx-ink)">Le faltaron S/ {{ s.falta | appNumber:'1.2-2' }} para llegar al {{ s.desde }} %.</b>
              Con eso su comisión habría pasado de S/ {{ participante().montoComision | appNumber:'1.0-2' }} a S/ {{ s.monto | appNumber:'1.0-2' }}.
            </p>
          } @else if (participante().porcentajeTramo != null) {
            <p class="mt-4 text-[0.84rem]" style="color: var(--cmx-brand)">Está en el tramo más alto de la tabla.</p>
          }
        }

        <!-- Pagos -->
        <section class="mt-7" aria-labelledby="cmx-sust-pagos">
          <div class="flex flex-wrap items-baseline gap-3 mb-3">
            <h3 id="cmx-sust-pagos" class="font-bold text-[0.92rem]">
              {{ participante().rol === 'SUPERVISOR' ? 'Pagos de la subcartera' : 'Pagos de sus gestiones' }}
            </h3>
            <span class="cmx-muted text-[0.78rem] cmx-num">{{ pagos().length }} pagos · {{ sumanCount() }} suman</span>
          </div>

          @if (excluidos().length) {
            <ul class="flex flex-col gap-2 mb-4">
              @for (e of excluidos(); track e.motivo) {
                <li class="cmx-banner cmx-banner-neutral !py-2.5">
                  <span class="cmx-tag cmx-tag-amber">{{ e.cantidad }}</span>
                  <span><b>{{ motivos[e.motivo].etiqueta }}:</b> {{ motivos[e.motivo].descripcion }}</span>
                </li>
              }
            </ul>
          }

          @if (cargando()) {
            <div class="flex flex-col gap-2">
              @for (i of [1, 2, 3, 4, 5]; track i) { <div class="cmx-skeleton h-11"></div> }
            </div>
          } @else if (error()) {
            <div class="cmx-banner" role="alert"><cmx-icon name="alert" /><span>{{ error() }}</span></div>
          } @else {
            <div class="cmx-table-wrap rounded-2xl" style="box-shadow: inset 0 0 0 1px var(--cmx-line)">
              <table class="cmx-table">
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Cliente</th>
                    @if (participante().rol === 'SUPERVISOR') { <th scope="col">Asesor</th> }
                    <th scope="col" class="n">Monto</th>
                    @if (conContencion()) { <th scope="col" class="n">Capital</th> }
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of pagos(); track p.conciliacionId) {
                    <tr [class.is-muted]="p.motivoExclusion">
                      <td class="cmx-num whitespace-nowrap">{{ p.fechaBanco | appDate }}</td>
                      <td>
                        <span class="font-semibold block">{{ p.nombreCliente || 'Sin nombre' }}</span>
                        <span class="cmx-muted cmx-num text-[0.76rem]">{{ p.documentoCliente }} · op. {{ p.numeroOperacion || '—' }}</span>
                      </td>
                      @if (participante().rol === 'SUPERVISOR') { <td>{{ p.nombreAgenteGestion || '—' }}</td> }
                      <td class="n font-semibold">{{ p.montoAplicado | appNumber:'1.2-2' }}</td>
                      @if (conContencion()) {
                        <td class="n">
                          @if (p.contencion) {
                            <span class="block">{{ p.capitalAsignado != null ? (p.capitalAsignado | appNumber:'1.2-2') : '—' }}</span>
                            <span class="cmx-muted text-[0.72rem]">{{ p.contencion }}</span>
                          } @else { <span class="cmx-muted">—</span> }
                        </td>
                      }
                      <td>
                        @if (p.motivoExclusion) {
                          <span class="cmx-tag cmx-tag-amber" [attr.title]="motivos[p.motivoExclusion].descripcion">{{ motivos[p.motivoExclusion].etiqueta }}</span>
                        } @else {
                          <span class="cmx-tag cmx-tag-brand"><span class="cmx-dot"></span>Suma</span>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="text-center cmx-muted py-10 text-[0.86rem]">No tiene pagos conciliados en el mes.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      </div>

      <footer class="cmx-panel-foot">
        <button type="button" class="cmx-btn cmx-btn-ghost" (click)="cerrar.emit()">Cerrar</button>
        <button type="button" class="cmx-btn cmx-btn-primary" [disabled]="!periodo().fechaCalculo" (click)="descargar.emit(participante())">
          Descargar sustento
          <span class="cmx-orb"><cmx-icon name="download" [size]="15" /></span>
        </button>
      </footer>
    </section>
  `
})
export class SustentoParticipantePanelComponent implements OnInit {
  private readonly service = inject(ComisionesService);

  readonly periodo = input.required<PeriodoComision>();
  readonly participante = input.required<ParticipanteComision>();
  readonly participantes = input.required<ParticipanteComision[]>();

  readonly cerrar = output<void>();
  readonly descargar = output<ParticipanteComision>();

  readonly rolInfo = ROL_INFO;
  readonly motivos = MOTIVO_INFO;
  readonly nombreMes = nombreMes;

  readonly pagos = signal<PagoSustento[]>([]);
  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);

  readonly metrica = computed(() => METRICA_INFO[this.periodo().tipoMetrica]);
  readonly conContencion = computed(() => this.periodo().tipoMetrica === 'CONTENCION');
  readonly n = computed(() => asesoresActivos(this.participantes()));
  readonly sumanCount = computed(() => this.pagos().filter(p => !p.motivoExclusion).length);

  readonly excluidos = computed(() => {
    const conteo = new Map<MotivoExclusion, number>();
    for (const p of this.pagos()) {
      if (p.motivoExclusion) {
        conteo.set(p.motivoExclusion, (conteo.get(p.motivoExclusion) ?? 0) + 1);
      }
    }
    return [...conteo.entries()].map(([motivo, cantidad]) => ({ motivo, cantidad }));
  });

  readonly descripcionLogrado = computed(() => {
    const periodo = this.periodo();
    const suman = this.pagos().filter(p => !p.motivoExclusion);
    const mes = `${nombreMes(periodo.mes).toLowerCase()} ${periodo.anio}`;
    if (this.cargando()) {
      return 'Cargando pagos…';
    }
    if (periodo.tipoMetrica === 'CONTENCION') {
      const clientes = new Set(
        suman.filter(p => (p.contencion ?? '').trim().toUpperCase() === 'CONTENIDO').map(p => (p.documentoCliente ?? '').trim())
      );
      return `${clientes.size} ${clientes.size === 1 ? 'cliente CONTENIDO' : 'clientes CONTENIDO'} con pago conciliado en ${mes}; su capital asignado cuenta una sola vez`;
    }
    return `${suman.length} ${suman.length === 1 ? 'pago conciliado' : 'pagos conciliados'} con fecha de banco en ${mes}`;
  });

  readonly siguiente = computed(() => {
    const p = this.participante();
    if (p.quitado || !this.periodo().fechaCalculo) {
      return null;
    }
    return siguienteTramo(tramosDe(this.periodo().escalas, p.rol), p.porcentajeTramo, p.logrado, p.metaIndividual);
  });

  ngOnInit(): void {
    this.service.obtenerSustento(this.periodo().id, this.participante().idResultado).subscribe({
      next: s => {
        this.pagos.set(s.pagos);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.error.set(mensajeError(e, 'No se pudieron cargar los pagos del sustento.'));
      }
    });
  }
}
