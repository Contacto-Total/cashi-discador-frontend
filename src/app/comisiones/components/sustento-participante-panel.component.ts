import { ChangeDetectionStrategy, Component, ElementRef, OnInit, afterNextRender, computed, inject, input, output, signal, viewChild } from '@angular/core';
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
  host: { '(document:keydown.escape)': 'salir()' },
  template: `
    <div class="cmx-scrim" [class.is-closing]="cerrando()" (click)="salir()"></div>
    <section class="cmx-drawer" [class.is-closing]="cerrando()" role="dialog" aria-modal="true" aria-labelledby="cmx-sust-nm">
      <div class="cmx-dh">
        <div style="min-width:0">
          <div class="cmx-eyebrow">Sustento · {{ rolInfo[participante().rol].toLowerCase() }}</div>
          <div id="cmx-sust-nm" class="cmx-nm">{{ participante().nombre }}</div>
          <div class="cmx-mt">
            {{ periodo().nombreSubcartera }} · {{ nombreMes(periodo().mes).toLowerCase() }} {{ periodo().anio }} ·
            @if (participante().rol === 'ASESOR') { meta por asesor } @else { meta completa }
            S/ {{ participante().metaIndividual ?? periodo().metaGrupal | appNumber:'1.2-2' }}
          </div>
        </div>
        <button type="button" class="cmx-icon-btn" (click)="salir()" aria-label="Cerrar sustento" #cerrarBtn>
          <cmx-icon name="x" [size]="17" />
        </button>
      </div>

      <div class="cmx-db">
        @if (participante().quitado) {
          <div class="cmx-hint" style="margin:0 0 14px">Fue quitado del período: no divide la meta ni comisiona. Sus pagos figuran abajo como «Asesor quitado».</div>
        }

        <div class="cmx-conceptos">
          <div class="cmx-cbox is-hi cmx-enter">
            <div class="cmx-cbox-l">Comisión</div>
            <div class="cmx-cbox-v">S/ {{ participante().montoComision | appNumber:'1.2-2' }}</div>
          </div>
          <div class="cmx-cbox cmx-enter" style="--i:1">
            <div class="cmx-cbox-l">Cumplimiento</div>
            <div class="cmx-cbox-v">{{ participante().porcentajeCumplimiento != null ? (participante().porcentajeCumplimiento | appNumber:'1.1-1') + ' %' : '—' }}</div>
          </div>
          <div class="cmx-cbox cmx-enter" style="--i:2">
            <div class="cmx-cbox-l">Tramo</div>
            <div class="cmx-cbox-v">{{ participante().porcentajeTramo != null ? 'desde ' + participante().porcentajeTramo + ' %' : 'ninguno' }}</div>
          </div>
        </div>

        @if (!participante().quitado) {
          <div class="cmx-brk cmx-enter" style="--i:3">
            <div class="cmx-brk-hdr">Comisión por cumplimiento de meta</div>
            <div class="cmx-brk-r">
              <span class="cmx-brk-k">{{ metrica().logrado }}</span>
              <span class="cmx-brk-d">{{ descripcionLogrado() }}</span>
              <span class="cmx-brk-a">S/ {{ participante().logrado | appNumber:'1.2-2' }}</span>
            </div>
            <div class="cmx-brk-r">
              <span class="cmx-brk-k">Meta</span>
              <span class="cmx-brk-d">
                @if (participante().rol === 'ASESOR') {
                  S/ {{ periodo().metaGrupal | appNumber:'1.0-2' }} ÷ {{ n() }} {{ n() === 1 ? 'asesor' : 'asesores' }}, igual para todos
                } @else {
                  Meta interna completa de la subcartera
                }
              </span>
              <span class="cmx-brk-a">S/ {{ participante().metaIndividual | appNumber:'1.2-2' }}</span>
            </div>
            <div class="cmx-brk-r">
              <span class="cmx-brk-k">Cumplimiento</span>
              <span class="cmx-brk-d cmx-num">{{ participante().logrado | appNumber:'1.0-2' }} ÷ {{ participante().metaIndividual | appNumber:'1.0-2' }}</span>
              <span class="cmx-brk-a">{{ participante().porcentajeCumplimiento | appNumber:'1.1-2' }} %</span>
            </div>
            <div class="cmx-brk-r is-sum">
              <span class="cmx-brk-k">Comisión</span>
              <span class="cmx-brk-d">
                {{ participante().porcentajeTramo != null
                  ? 'Tramo desde ' + participante().porcentajeTramo + ' % de la tabla del ' + rolInfo[participante().rol].toLowerCase()
                  : 'No llegó al primer tramo' }}
              </span>
              <span class="cmx-brk-a">S/ {{ participante().montoComision | appNumber:'1.2-2' }}</span>
            </div>
          </div>

          @if (siguiente(); as s) {
            <div class="cmx-say cmx-enter" style="--i:4">
              <b>Le faltaron S/ {{ s.falta | appNumber:'1.2-2' }} para llegar al {{ s.desde }} %.</b>
              Con eso su comisión habría pasado de S/ {{ participante().montoComision | appNumber:'1.0-2' }} a S/ {{ s.monto | appNumber:'1.0-2' }}.
            </div>
          } @else if (participante().porcentajeTramo != null) {
            <div class="cmx-say cmx-enter" style="--i:4">
              <b>Está en el tramo más alto de la tabla.</b> Lo que recaude de más no cambia la comisión.
            </div>
          }
        }

        <section class="cmx-block cmx-enter" style="--i:5;margin-top:16px" aria-labelledby="cmx-sust-pagos">
          <div class="cmx-block-head">
            <h3 id="cmx-sust-pagos" class="cmx-block-title">{{ participante().rol === 'SUPERVISOR' ? 'Pagos de la subcartera' : 'Pagos de sus gestiones' }}</h3>
            <span class="cmx-block-extra">{{ pagos().length }} pagos · {{ sumanCount() }} suman</span>
          </div>
          @if (excluidos().length) {
            <div class="cmx-block-body" style="display:flex;flex-wrap:wrap;gap:6px;padding:10px 14px">
              @for (e of excluidos(); track e.motivo) {
                <span class="cmx-tag cmx-tag-v" [attr.title]="motivos[e.motivo].descripcion">{{ e.cantidad }} · {{ motivos[e.motivo].etiqueta }}</span>
              }
            </div>
          }
          @if (cargando()) {
            <div class="cmx-block-body" style="display:grid;gap:8px">
              @for (i of [1, 2, 3, 4]; track i) { <div class="cmx-skel" style="height:36px"></div> }
            </div>
          } @else if (error()) {
            <div class="cmx-empty"><p>{{ error() }}</p></div>
          } @else {
            <div class="cmx-tw">
              <table class="cmx-table">
                <thead>
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Cliente</th>
                    @if (participante().rol === 'SUPERVISOR') { <th scope="col">Asesor</th> }
                    <th scope="col" class="n">Monto</th>
                    <th scope="col">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of pagos(); track p.conciliacionId) {
                    <tr [class.is-muted]="p.motivoExclusion">
                      <td class="cmx-num">{{ p.fechaBanco | appDate }}</td>
                      <td class="who">{{ p.nombreCliente || 'Sin nombre' }}<span class="cmx-role cmx-num">{{ p.documentoCliente }} · op. {{ p.numeroOperacion || '—' }}</span></td>
                      @if (participante().rol === 'SUPERVISOR') { <td>{{ p.nombreAgenteGestion || '—' }}</td> }
                      <td class="n">{{ p.montoAplicado | appNumber:'1.2-2' }}</td>
                      <td>
                        @if (p.motivoExclusion) {
                          <span class="cmx-tag cmx-tag-v" [attr.title]="motivos[p.motivoExclusion].descripcion">{{ motivos[p.motivoExclusion].etiqueta }}</span>
                        } @else {
                          <span class="cmx-tag cmx-tag-d">Suma</span>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="5" class="empty">No tiene pagos conciliados en el mes.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </section>
      </div>

      <div class="cmx-df">
        <button type="button" class="cmx-btn cmx-btn-sec" (click)="salir()">Cerrar</button>
        <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!periodo().fechaCalculo" (click)="descargar.emit(participante())">
          <cmx-icon name="download" [size]="15" /> Descargar sustento
        </button>
      </div>
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
  readonly cerrando = signal(false);
  private readonly cerrarBtn = viewChild<ElementRef<HTMLButtonElement>>('cerrarBtn');

  readonly metrica = computed(() => METRICA_INFO[this.periodo().tipoMetrica]);
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
    const mes = `${nombreMes(periodo.mes).toLowerCase()} ${periodo.anio}`;
    if (this.cargando()) {
      return 'Cargando pagos…';
    }
    const suman = this.sumanCount();
    if (periodo.tipoMetrica === 'CONTENCION') {
      return `${suman} ${suman === 1 ? 'pago' : 'pagos'} de clientes CONTENIDO con fecha de banco en ${mes}`;
    }
    return `${suman} ${suman === 1 ? 'pago conciliado' : 'pagos conciliados'} con fecha de banco en ${mes}`;
  });

  readonly siguiente = computed(() => {
    const p = this.participante();
    if (p.quitado || !this.periodo().fechaCalculo) {
      return null;
    }
    return siguienteTramo(tramosDe(this.periodo().escalas, p.rol), p.porcentajeTramo, p.logrado, p.metaIndividual);
  });

  constructor() {
    afterNextRender(() => this.cerrarBtn()?.nativeElement.focus());
  }

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

  /** Sale con la animación del panel y luego avisa */
  salir(): void {
    if (this.cerrando()) {
      return;
    }
    this.cerrando.set(true);
    setTimeout(() => this.cerrar.emit(), 340);
  }
}
