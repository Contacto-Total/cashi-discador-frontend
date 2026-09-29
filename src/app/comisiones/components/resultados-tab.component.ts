import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ParticipanteComision, ReportePeriodo } from '../models/comision.model';
import {
  METRICA_INFO, bonoCorto, bonosGanados, chipsMetas, construirBarra, diaMes, nombreRol, partesComision, siguienteTramo, tramosDe
} from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Resultados del período: los asesores (vista principal), cada uno contra su meta individual,
 * y abajo el supervisor, que comisiona sobre el total de los asesores contra la meta del mes.
 */
@Component({
  selector: 'cmx-resultados-tab',
  standalone: true,
  imports: [AppNumberPipe, CmxIconComponent, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let p = reporte().periodo;
    <div class="cmx-kpis cmx-enter">
      <div class="cmx-kpi">
        <div class="cmx-kpi-l">Meta del mes</div>
        <div class="cmx-kpi-v"><small>S/</small>{{ p.metaDelMes | appNumber:'1.2-2' }}</div>
        <div class="cmx-kpi-d">
          @if (p.metaAjustada != null) { Ajustada solo para comisiones · reporte: S/ {{ p.metaGrupal | appNumber:'1.2-2' }} }
          @else { Reporte de producción · interna }
        </div>
      </div>
      <div class="cmx-kpi">
        <div class="cmx-kpi-l">{{ metrica().logrado }} total</div>
        <div class="cmx-kpi-v"><small>S/</small>{{ totalAsesores() | appNumber:'1.2-2' }}</div>
        <div class="cmx-kpi-d">{{ porcentajeTotal() | appNumber:'1.1-1' }} % de la meta · lo que mide el supervisor</div>
      </div>
      <div class="cmx-kpi">
        <div class="cmx-kpi-l">Meta por asesor</div>
        <div class="cmx-kpi-v"><small>S/</small>{{ metaPorAsesor() | appNumber:'1.2-2' }}</div>
        <div class="cmx-kpi-d">Meta ÷ {{ divisor() }}@if (conMetaPropia()) { · {{ conMetaPropia() }} con meta propia o ingreso }</div>
      </div>
      <div class="cmx-kpi">
        <div class="cmx-kpi-l">A pagar</div>
        <div class="cmx-kpi-v"><small>S/</small>{{ reporte().totalComisiones + reporte().totalBonos | appNumber:'1.2-2' }}</div>
        <div class="cmx-kpi-d">Comisiones S/ {{ reporte().totalComisiones | appNumber:'1.0-0' }} · bonos S/ {{ reporte().totalBonos | appNumber:'1.0-0' }}</div>
      </div>
    </div>

    <section class="cmx-block cmx-enter" style="--i:1" aria-labelledby="cmx-res-ases">
      <div class="cmx-block-head">
        <h3 id="cmx-res-ases" class="cmx-block-title">Asesores</h3>
        <span class="cmx-block-desc">Rol {{ nombreRol(p.rolAsesor?.nombreRol) || '—' }} · midiendo {{ metrica().etiqueta.toLowerCase() }}@if (p.escalaAcumulativa) { · por logros }</span>
        @if (puedeAgregar()) {
          <button type="button" class="cmx-btn cmx-btn-sec cmx-btn-sm" style="margin-left:auto" (click)="agregar.emit()">
            <cmx-icon name="user-plus" [size]="15" /> Agregar participante
          </button>
        }
        <span class="cmx-block-extra" [style.margin-left]="puedeAgregar() ? '0' : 'auto'">S/ {{ comisionAsesores() | appNumber:'1.2-2' }}</span>
      </div>
      <div class="cmx-tw">
        <table class="cmx-table">
          <thead>
            <tr>
              <th scope="col">Asesor</th>
              <th scope="col" class="n">Meta individual</th>
              <th scope="col" class="n">{{ metrica().logrado }}</th>
              <th scope="col">Avance sobre su meta</th>
              @if (conMetas()) { <th scope="col">Metas de cantidad</th> }
              <th scope="col" class="n">Comisión</th>
              <th scope="col" class="n">Bonos</th>
              <th scope="col" class="n">Total</th>
            </tr>
          </thead>
          <tbody>
            @for (a of asesores(); track a.idUsuario; let i = $index) {
              @let b = barra(a, 'ASESOR');
              <tr class="is-click" tabindex="0" (click)="verSustento.emit(a.idUsuario)" (keydown.enter)="verSustento.emit(a.idUsuario)"
                  [attr.aria-label]="'Ver el sustento de ' + a.nombre">
                <td class="who">
                  {{ a.nombre }}
                  <span class="cmx-role">{{ nombreRol(p.rolAsesor?.nombreRol) || 'Asesor' }}</span>
                  @if (a.metaManual != null) { <span class="cmx-tag cmx-tag-v" style="margin-top:3px">Meta propia · excepción</span> }
                  @else if (a.fechaIngreso) { <span class="cmx-tag cmx-tag-v" style="margin-top:3px">Ingresó {{ diaMes(a.fechaIngreso) }} · {{ a.diasHabiles }} de {{ p.diasHabiles }} días hábiles</span> }
                  @if (!a.calculado) { <span class="cmx-tag cmx-tag-off" style="margin-top:3px">Entra al recalcular</span> }
                </td>
                <td class="n">{{ a.metaIndividual | appNumber:'1.2-2' }}</td>
                <td class="n">{{ a.logrado | appNumber:'1.2-2' }}</td>
                <td>
                  <div class="cmx-gauge">
                    <div class="cmx-track">
                      @for (s of b.barra.segmentos; track $index) {
                        <span class="cmx-seg" [class]="'cmx-seg cmx-t' + s.nivel" [style.width.%]="s.ancho" [attr.title]="s.titulo"></span>
                      }
                      <span class="cmx-mk" [style.left.%]="b.barra.marcador" [style.--i]="i"></span>
                    </div>
                    <div class="cmx-cap">
                      <b>{{ a.porcentajeCumplimiento ?? 0 | appNumber:'1.1-1' }} %</b>
                      @if (b.siguiente; as s) {
                        <span class="cmx-gap-t">Faltan S/ {{ s.falta | appNumber:'1.0-0' }} para {{ s.desde }} %</span>
                      } @else {
                        <span class="cmx-top-t">{{ p.escalaAcumulativa ? 'Todos los logros' : 'Nivel máximo' }}</span>
                      }
                    </div>
                  </div>
                </td>
                @if (conMetas()) {
                  <td>
                    <div class="cmx-mchips">
                      @for (m of chips(a); track m.nombre) {
                        <span class="cmx-mchip" [class.ok]="m.cumple" [attr.title]="m.nombre + ' · S/ ' + m.monto">{{ m.nombre }} <b>{{ m.valor }}</b></span>
                      }
                    </div>
                  </td>
                }
                <td class="n tot" [class.na]="!a.montoComision">
                  {{ a.montoComision ? 'S/ ' + (a.montoComision | appNumber:'1.2-2') : '—' }}
                  @if (conMetas() || p.escalaAcumulativa) {
                    @let pc = partes(a);
                    <span class="cmx-subtot">{{ p.escalaAcumulativa ? 'Logros' : 'Escala' }} S/ {{ pc.escala | appNumber:'1.0-0' }}@if (conMetas()) { · metas S/ {{ pc.metas | appNumber:'1.0-0' }} }</span>
                  }
                </td>
                <ng-container *ngTemplateOutlet="celdasBono; context: { $implicit: a }" />
              </tr>
            } @empty {
              <tr><td [attr.colspan]="conMetas() ? 8 : 7" class="empty">Nadie participa todavía. Elige a los asesores en la pestaña Comisiones.</td></tr>
            }
          </tbody>
        </table>
      </div>
    </section>

    <section class="cmx-block cmx-enter" style="--i:2" aria-labelledby="cmx-res-sup">
      <div class="cmx-block-head">
        <h3 id="cmx-res-sup" class="cmx-block-title">Supervisor</h3>
        <span class="cmx-block-desc">Comisiona sobre el {{ metrica().etiqueta.toLowerCase() }} total de los asesores contra la meta del mes</span>
        @if (supervisor(); as s) { <span class="cmx-block-extra">S/ {{ s.montoComision | appNumber:'1.2-2' }}</span> }
      </div>
      @if (supervisor(); as s) {
        @let b = barra(s, 'SUPERVISOR');
        <div class="cmx-tw">
          <table class="cmx-table">
            <thead>
              <tr>
                <th scope="col">Supervisor</th>
                <th scope="col" class="n">Meta del mes</th>
                <th scope="col" class="n">{{ metrica().logrado }} total</th>
                <th scope="col">Avance</th>
                <th scope="col" class="n">Comisión</th>
                <th scope="col" class="n">Bonos</th>
                <th scope="col" class="n">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr class="is-click" tabindex="0" (click)="verSustento.emit('sup')" (keydown.enter)="verSustento.emit('sup')"
                  [attr.aria-label]="'Ver el sustento de ' + s.nombre">
                <td class="who">{{ s.nombre }}<span class="cmx-role">Supervisor</span></td>
                <td class="n">{{ s.metaIndividual | appNumber:'1.2-2' }}</td>
                <td class="n">{{ s.logrado | appNumber:'1.2-2' }}</td>
                <td>
                  <div class="cmx-gauge">
                    <div class="cmx-track">
                      @for (seg of b.barra.segmentos; track $index) {
                        <span class="cmx-seg" [class]="'cmx-seg cmx-t' + seg.nivel" [style.width.%]="seg.ancho" [attr.title]="seg.titulo"></span>
                      }
                      <span class="cmx-mk" [style.left.%]="b.barra.marcador"></span>
                    </div>
                    <div class="cmx-cap">
                      <b>{{ s.porcentajeCumplimiento ?? 0 | appNumber:'1.1-1' }} %</b>
                      @if (b.siguiente; as sig) {
                        <span class="cmx-gap-t">Faltan S/ {{ sig.falta | appNumber:'1.0-0' }} para {{ sig.desde }} %</span>
                      } @else {
                        <span class="cmx-top-t">Nivel máximo</span>
                      }
                    </div>
                  </div>
                </td>
                <td class="n tot" [class.na]="!s.montoComision">{{ s.montoComision ? 'S/ ' + (s.montoComision | appNumber:'1.2-2') : '—' }}</td>
                <ng-container *ngTemplateOutlet="celdasBono; context: { $implicit: s }" />
              </tr>
            </tbody>
          </table>
        </div>
      } @else {
        <div class="cmx-block-body cmx-muted-txt">Sin supervisor elegido para este periodo.</div>
      }
    </section>

    <ng-template #celdasBono let-x>
      <td class="n">
        @if (x.montoBonos) {
          <span class="cmx-bcell">S/ {{ x.montoBonos | appNumber:'1.2-2' }}
            <small>{{ resumenBonos(x) }}</small>
          </span>
        } @else {
          <span class="cmx-bcell na">—</span>
        }
      </td>
      <td class="n tot">S/ {{ x.montoComision + (x.montoBonos ?? 0) | appNumber:'1.2-2' }}</td>
    </ng-template>
  `
})
export class ResultadosTabComponent {
  readonly reporte = input.required<ReportePeriodo>();
  readonly puedeAgregar = input(false);

  readonly agregar = output<void>();
  readonly verSustento = output<number | 'sup'>();

  readonly metrica = computed(() => METRICA_INFO[this.reporte().periodo.tipoMetrica]);

  readonly asesores = computed(() => this.reporte().participantes
    .filter(p => p.rol === 'ASESOR')
    .sort((a, b) => Number(a.metaManual != null || !!a.fechaIngreso) - Number(b.metaManual != null || !!b.fechaIngreso)
      || b.logrado - a.logrado));

  readonly conMetas = computed(() => (this.reporte().periodo.metasCantidad ?? []).length > 0);

  readonly chips = chipsMetas;
  readonly partes = partesComision;

  /** "LTD S/ 60 · PKM S/ 15" */
  resumenBonos(p: ParticipanteComision): string {
    return bonosGanados(p).map(b => `${bonoCorto(b.nombre)} S/ ${Math.round(b.monto)}`).join(' · ');
  }

  readonly supervisor = computed(() => this.reporte().participantes.find(p => p.rol === 'SUPERVISOR') ?? null);

  readonly totalAsesores = computed(() => this.asesores().reduce((s, a) => s + a.logrado, 0));
  readonly comisionAsesores = computed(() => this.asesores().reduce((s, a) => s + a.montoComision, 0));
  readonly conMetaPropia = computed(() => this.asesores().filter(a => a.metaManual != null || !!a.fechaIngreso).length);
  readonly nombreRol = nombreRol;
  readonly diaMes = diaMes;
  readonly divisor = computed(() => Math.max(this.asesores().length - this.conMetaPropia(), 1));
  readonly metaPorAsesor = computed(() => this.reporte().periodo.metaDelMes / this.divisor());
  readonly porcentajeTotal = computed(() => {
    const meta = this.reporte().periodo.metaDelMes;
    return meta ? this.totalAsesores() / meta * 100 : 0;
  });

  barra(p: ParticipanteComision, rol: 'ASESOR' | 'SUPERVISOR') {
    const tramos = tramosDe(this.reporte().periodo.escalas, rol);
    return {
      barra: construirBarra(tramos, p.porcentajeCumplimiento),
      siguiente: siguienteTramo(tramos, p.porcentajeTramo, p.logrado, p.metaIndividual)
    };
  }
}
