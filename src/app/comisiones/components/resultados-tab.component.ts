import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormatService } from '@/shared/services/format.service';
import { AppDateTimePipe, AppNumberPipe } from '@/shared/pipes/format.pipes';
import { EscalaComision, ParticipanteComision, ReportePeriodo, RolComision } from '../models/comision.model';
import {
  Barra,
  METRICA_INFO,
  SiguienteTramo,
  asesoresActivos,
  construirBarra,
  metaPorAsesor,
  siguienteTramo,
  tramosDe
} from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface FilaResultado {
  p: ParticipanteComision;
  barra: Barra;
  siguiente: SiguienteTramo | null;
  maximo: boolean;
}

/**
 * Resultado del período: reglas a la izquierda, a quién le toca cuánto a la derecha.
 * Comisión de asesores y del supervisor en bloques separados (se miden distinto).
 */
@Component({
  selector: 'cmx-resultados-tab',
  standalone: true,
  imports: [AppNumberPipe, AppDateTimePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-[19rem_minmax(0,1fr)] gap-6">
      <!-- ============ REGLAS DEL PERÍODO ============ -->
      <aside class="flex flex-col gap-4" aria-label="Reglas del período">
        <div class="cmx-shell cmx-enter" style="--i:0">
          <div class="cmx-core cmx-card-body">
            <div class="flex items-center justify-between gap-2">
              <span class="cmx-label">Meta del mes</span>
              <span class="cmx-tag cmx-tag-outline">Reporte de producción</span>
            </div>
            <div class="cmx-kpi-value mt-2"><small>S/</small>{{ periodo().metaGrupal | appNumber:'1.2-2' }}</div>
            <p class="cmx-muted text-[0.78rem] mt-1">
              Meta interna · se mide por <b class="cmx-soft-text">{{ metrica().etiqueta.toLowerCase() }}</b>
            </p>
            <div class="mt-4 pt-4 border-t border-dashed" style="border-color: var(--cmx-line-strong)">
              <span class="cmx-label">Meta por asesor</span>
              @if (metaAsesor() != null) {
                <div class="cmx-num font-bold text-[1.05rem] mt-1">S/ {{ metaAsesor() | appNumber:'1.2-2' }}</div>
                <p class="cmx-muted text-[0.76rem] mt-0.5">
                  S/ {{ periodo().metaGrupal | appNumber:'1.0-2' }} ÷ {{ n() }} {{ n() === 1 ? 'asesor' : 'asesores' }}
                  · igual para todos
                </p>
              } @else {
                <p class="cmx-muted text-[0.78rem] mt-1">Sin asesores: elige los roles en Configuración.</p>
              }
            </div>
          </div>
        </div>

        @for (bloque of bloquesTramos(); track bloque.rol; let i = $index) {
          <div class="cmx-shell cmx-enter" [style.--i]="i + 1">
            <div class="cmx-core cmx-card-body">
              <span class="cmx-label">Tramos del {{ bloque.rol === 'ASESOR' ? 'asesor' : 'supervisor' }}</span>
              @if (bloque.tramos.length) {
                <div class="mt-2">
                  @if (bloque.tramos[0].porcentajeDesde > 0) {
                    <div class="cmx-tier"><span class="cmx-num">0 – {{ bloque.tramos[0].porcentajeDesde }} %</span><b class="cmx-num">S/ 0</b></div>
                  }
                  @for (t of bloque.tramos; track t.porcentajeDesde; let last = $last; let j = $index) {
                    <div class="cmx-tier">
                      <span class="cmx-num">
                        {{ t.porcentajeDesde }}{{ last ? ' % a más' : ' – ' + bloque.tramos[j + 1].porcentajeDesde + ' %' }}
                      </span>
                      <b class="cmx-num">S/ {{ t.montoComision | appNumber:'1.0-2' }}</b>
                    </div>
                  }
                </div>
              } @else {
                <p class="cmx-muted text-[0.8rem] mt-2">Sin tramos. Configúralos en la pestaña Configuración.</p>
              }
            </div>
          </div>
        }
      </aside>

      <!-- ============ RESULTADOS ============ -->
      <div class="flex flex-col gap-6 min-w-0">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          @for (k of kpis(); track k.etiqueta; let i = $index) {
            <div class="cmx-shell cmx-enter" [style.--i]="i">
              <div class="cmx-core cmx-kpi h-full">
                <span class="cmx-label">{{ k.etiqueta }}</span>
                <div class="cmx-kpi-value mt-1.5">
                  @if (k.moneda) { <small>S/</small> }{{ k.valor }}
                </div>
                <p class="cmx-muted text-[0.74rem] mt-0.5">{{ k.nota }}</p>
              </div>
            </div>
          }
        </div>

        @if (!calculado()) {
          <div class="cmx-shell cmx-enter" style="--i:2">
            <div class="cmx-core">
              <div class="cmx-empty">
                <span class="cmx-empty-mark"><cmx-icon name="calculator" [size]="22" /></span>
                <p class="font-semibold" style="color: var(--cmx-ink)">Sin cálculo vigente</p>
                <p class="max-w-[46ch] text-[0.86rem]">
                  El período se creó o su configuración cambió. Revisa roles y tramos y pulsa «Calcular»:
                  se leen los pagos conciliados del mes y la meta interna del día.
                </p>
              </div>
            </div>
          </div>
        }

        @for (bloque of bloquesResultado(); track bloque.rol; let i = $index) {
          <section class="cmx-shell cmx-enter" [style.--i]="i + 2" [attr.aria-label]="bloque.titulo">
            <div class="cmx-core">
              <header class="cmx-card-head">
                <div>
                  <h3 class="font-bold text-[0.92rem]">{{ bloque.titulo }}</h3>
                  <p class="cmx-muted text-[0.76rem]">{{ bloque.descripcion }}</p>
                </div>
                <span class="ml-auto cmx-num font-bold text-[0.95rem]">S/ {{ bloque.total | appNumber:'1.2-2' }}</span>
              </header>

              @if (bloque.filas.length) {
                <div class="cmx-table-wrap">
                  <table class="cmx-table">
                    <thead>
                      <tr>
                        <th scope="col">{{ bloque.rol === 'ASESOR' ? 'Asesor' : 'Supervisor' }}</th>
                        <th scope="col" class="n">Meta</th>
                        <th scope="col" class="n">{{ metrica().logrado }}</th>
                        <th scope="col">Posición en los tramos</th>
                        <th scope="col" class="n">Comisión</th>
                        <th scope="col"><span class="sr-only">Acciones</span></th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (f of bloque.filas; track f.p.idResultado) {
                        <tr class="is-clickable" [class.is-muted]="f.p.quitado" (click)="verSustento.emit(f.p)"
                            tabindex="0" (keydown.enter)="verSustento.emit(f.p)">
                          <td>
                            <span class="font-semibold">{{ f.p.nombre }}</span>
                            @if (f.p.quitado) {
                              <span class="cmx-tag cmx-tag-amber ml-2">Quitado</span>
                            }
                          </td>
                          <td class="n">{{ f.p.metaIndividual != null ? (f.p.metaIndividual | appNumber:'1.2-2') : '—' }}</td>
                          <td class="n font-semibold">{{ f.p.logrado | appNumber:'1.2-2' }}</td>
                          <td>
                            @if (f.p.quitado) {
                              <span class="cmx-muted text-[0.8rem]">No divide la meta ni comisiona</span>
                            } @else if (!calculado()) {
                              <span class="cmx-muted text-[0.8rem]">Pendiente de calcular</span>
                            } @else {
                              <div class="cmx-bar" [attr.aria-label]="'Cumplimiento ' + (f.p.porcentajeCumplimiento ?? 0) + ' %'">
                                <div class="cmx-bar-track">
                                  @for (s of f.barra.segmentos; track $index) {
                                    <span class="cmx-bar-seg" [class]="'cmx-bar-seg lv' + s.nivel" [class.is-reached]="s.alcanzado"
                                          [style.width.%]="s.ancho" [attr.title]="s.titulo"></span>
                                  }
                                  <span class="cmx-bar-marker" [style.left.%]="f.barra.marcador"></span>
                                </div>
                                <div class="cmx-bar-caption">
                                  <b class="cmx-num" style="color: var(--cmx-ink)">{{ f.p.porcentajeCumplimiento | appNumber:'1.1-2' }} %</b>
                                  @if (f.maximo) {
                                    <span style="color: var(--cmx-brand)">tramo máximo</span>
                                  } @else if (f.siguiente) {
                                    <span class="cmx-num" style="color: var(--cmx-amber)">
                                      faltan S/ {{ f.siguiente.falta | appNumber:'1.0-0' }} → S/ {{ f.siguiente.monto | appNumber:'1.0-0' }}
                                    </span>
                                  }
                                </div>
                              </div>
                            }
                          </td>
                          <td class="n font-bold">{{ f.p.montoComision | appNumber:'1.2-2' }}</td>
                          <td class="text-right whitespace-nowrap">
                            <button type="button" class="cmx-icon-btn" (click)="$event.stopPropagation(); verSustento.emit(f.p)"
                                    [attr.aria-label]="'Ver sustento de ' + f.p.nombre">
                              <cmx-icon name="eye" />
                            </button>
                            <button type="button" class="cmx-icon-btn" [disabled]="!calculado()"
                                    (click)="$event.stopPropagation(); descargar.emit(f.p)"
                                    [attr.aria-label]="'Descargar sustento en Excel de ' + f.p.nombre">
                              <cmx-icon name="download" />
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              } @else {
                <div class="cmx-empty">
                  <span class="cmx-empty-mark"><cmx-icon name="users" [size]="22" /></span>
                  <p class="text-[0.86rem] max-w-[42ch]">{{ bloque.vacio }}</p>
                </div>
              }
            </div>
          </section>
        }

        @if (calculado()) {
          <p class="cmx-muted text-[0.76rem]">
            Calculado el {{ periodo().fechaCalculo | appDateTime }}. Haz clic en una fila para ver su sustento.
          </p>
        }
      </div>
    </div>
  `
})
export class ResultadosTabComponent {
  private readonly fmt = inject(FormatService);

  readonly reporte = input.required<ReportePeriodo>();

  readonly verSustento = output<ParticipanteComision>();
  readonly descargar = output<ParticipanteComision>();

  readonly periodo = computed(() => this.reporte().periodo);
  readonly metrica = computed(() => METRICA_INFO[this.periodo().tipoMetrica]);
  readonly calculado = computed(() => !!this.periodo().fechaCalculo);
  readonly n = computed(() => asesoresActivos(this.reporte().participantes));
  readonly metaAsesor = computed(() => metaPorAsesor(this.periodo(), this.reporte().participantes));

  readonly bloquesTramos = computed(() => (['ASESOR', 'SUPERVISOR'] as RolComision[]).map(rol => ({
    rol,
    tramos: tramosDe(this.periodo().escalas, rol)
  })));

  private readonly supervisor = computed(() =>
    this.reporte().participantes.find(p => p.rol === 'SUPERVISOR' && !p.quitado) ?? null
  );

  /** Logrado de la subcartera: el del supervisor, o la suma de asesores si no hay supervisor */
  readonly logradoSubcartera = computed(() => {
    const sup = this.supervisor();
    if (sup) {
      return sup.logrado;
    }
    return this.reporte().participantes
      .filter(p => p.rol === 'ASESOR' && !p.quitado)
      .reduce((s, p) => s + p.logrado, 0);
  });

  readonly kpis = computed(() => {
    const participantes = this.reporte().participantes;
    const quitados = participantes.filter(p => p.quitado).length;
    const meta = this.periodo().metaGrupal;
    const logrado = this.logradoSubcartera();
    const calculado = this.calculado();
    return [
      {
        etiqueta: 'Comisiones del mes',
        valor: this.formatear(this.reporte().totalComisiones),
        moneda: true,
        nota: calculado ? 'Asesores y supervisor' : 'Pendiente de calcular'
      },
      {
        etiqueta: `${this.metrica().logrado} de la subcartera`,
        valor: this.formatear(logrado),
        moneda: true,
        nota: this.supervisor() ? 'Lo que suman sus asesores' : 'Suma de asesores'
      },
      {
        etiqueta: 'Cumplimiento',
        valor: calculado && meta > 0 ? this.fmt.number(logrado / meta * 100, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' %' : '—',
        moneda: false,
        nota: 'Contra la meta del mes'
      },
      {
        etiqueta: 'Participantes',
        valor: String(participantes.length - quitados),
        moneda: false,
        nota: quitados ? `${quitados} quitado${quitados === 1 ? '' : 's'}` : `${this.n()} asesores`
      }
    ];
  });

  readonly bloquesResultado = computed(() => {
    const participantes = this.reporte().participantes;
    const metaAsesor = this.metaAsesor();
    return (['ASESOR', 'SUPERVISOR'] as RolComision[]).map(rol => {
      const tramos = tramosDe(this.periodo().escalas, rol);
      const filas = participantes
        .filter(p => p.rol === rol)
        .map(p => this.fila(p, tramos, rol === 'ASESOR' ? metaAsesor : this.periodo().metaGrupal));
      return {
        rol,
        titulo: rol === 'ASESOR' ? 'Comisión de asesores' : 'Comisión del supervisor',
        descripcion: rol === 'ASESOR'
          ? 'Cada asesor contra la meta por asesor, con la tabla del asesor'
          : 'Contra la meta completa de la subcartera, con su propia tabla',
        vacio: rol === 'ASESOR'
          ? 'No hay asesores en el período. Elige los roles de asesor en Configuración.'
          : 'No hay supervisor en el período. Elige el rol de supervisor en Configuración.',
        total: filas.filter(f => !f.p.quitado).reduce((s, f) => s + f.p.montoComision, 0),
        filas
      };
    });
  });

  private fila(p: ParticipanteComision, tramos: EscalaComision[], base: number | null): FilaResultado {
    const ultimo = tramos.length ? tramos[tramos.length - 1].porcentajeDesde : null;
    return {
      p,
      barra: construirBarra(tramos, p.porcentajeCumplimiento),
      siguiente: siguienteTramo(tramos, p.porcentajeTramo, p.logrado, base),
      maximo: ultimo != null && p.porcentajeTramo === ultimo
    };
  }

  private formatear(valor: number): string {
    return this.fmt.number(valor ?? 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
