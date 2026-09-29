import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { ReportePeriodo, UsuarioCashi } from '../models/comision.model';
import { mensajeError } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

type Modo = 'MANTENER' | 'AUMENTAR';

/**
 * Agregar a alguien que entró con el mes en curso. Administración decide cómo entra:
 * - mantener la meta del mes y darle una meta individual propia (excepción), o
 * - subir la meta del mes (solo para comisiones) y repartirla entre todos, incluido el nuevo.
 * Antes de confirmar se ve cómo quedan las metas de cada uno.
 */
@Component({
  selector: 'cmx-agregar-participante-modal',
  standalone: true,
  imports: [AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-scrim cmx-modal-scrim" (click)="cerrar.emit()">
      <div class="cmx-modal" role="dialog" aria-modal="true" aria-labelledby="cmx-ag-titulo" (click)="$event.stopPropagation()">
        <div class="cmx-modal-h">
          <div>
            <div class="cmx-eyebrow">{{ reporte().periodo.nombreSubcartera }} · {{ codigo() }}</div>
            <b id="cmx-ag-titulo">Agregar participante</b>
          </div>
          <button type="button" class="cmx-icon-btn" (click)="cerrar.emit()" aria-label="Cerrar"><cmx-icon name="x" [size]="16" /></button>
        </div>

        <div class="cmx-modal-b">
          <div class="cmx-field">
            <label for="cmx-ag-usuario">Asesor con rol {{ reporte().periodo.rolAsesor?.nombreRol || '—' }}</label>
            <select id="cmx-ag-usuario" (change)="idUsuario.set($any($event.target).value ? +$any($event.target).value : null)">
              <option value="" [selected]="idUsuario() == null">{{ cargando() ? 'Cargando…' : 'Elige a quién agregar' }}</option>
              @for (u of libres(); track u.idUsuario) {
                <option [value]="u.idUsuario" [selected]="u.idUsuario === idUsuario()">{{ u.nombre || 'Usuario ' + u.idUsuario }}</option>
              }
            </select>
            @if (!cargando() && !libres().length) {
              <span class="cmx-muted-txt">Todos los usuarios con el rol ya participan.</span>
            }
          </div>

          <fieldset class="cmx-fieldset">
            <legend class="cmx-field-l">¿Cómo entra a la meta?</legend>
            <label class="cmx-opt" for="cmx-ag-mantener">
              <input type="radio" name="cmx-ag-modo" id="cmx-ag-mantener" [checked]="modo() === 'MANTENER'" (change)="modo.set('MANTENER')" />
              <span>
                <b>Mantener la meta del mes (S/ {{ reporte().periodo.metaDelMes | appNumber:'1.2-2' }})</b>
                <span>Le das una meta individual propia, como excepción. Los demás siguen con S/ {{ metaBaseActual() | appNumber:'1.2-2' }}.</span>
                @if (modo() === 'MANTENER') {
                  <span class="cmx-money" style="margin-top:8px">
                    <span>S/</span>
                    <input type="number" min="0" step="100" placeholder="Meta individual" aria-label="Meta individual"
                           [value]="metaIndividual() ?? ''" (input)="metaIndividual.set(num($any($event.target).value))" />
                  </span>
                }
              </span>
            </label>
            <label class="cmx-opt" for="cmx-ag-aumentar">
              <input type="radio" name="cmx-ag-modo" id="cmx-ag-aumentar" [checked]="modo() === 'AUMENTAR'" (change)="modo.set('AUMENTAR')" />
              <span>
                <b>Aumentar la meta del mes</b>
                <span>Solo para comisiones: el reporte de producción no cambia. La nueva meta se reparte por igual entre los
                  {{ divisorActual() + 1 }} asesores sin meta propia, incluida la persona que agregas.</span>
                @if (modo() === 'AUMENTAR') {
                  <span class="cmx-money" style="margin-top:8px">
                    <span>S/</span>
                    <input type="number" min="0" step="1000" aria-label="Nueva meta del mes" [placeholder]="reporte().periodo.metaDelMes"
                           [value]="metaMes() ?? ''" (input)="metaMes.set(num($any($event.target).value))" />
                  </span>
                }
              </span>
            </label>
          </fieldset>

          @if (impacto(); as filas) {
            <div class="cmx-impact">
              <div class="cmx-impact-h">Cómo quedan las metas</div>
              @for (f of filas; track f.nombre) {
                <div class="cmx-impact-r" [class.is-new]="f.nuevo" [class.is-tot]="f.total">
                  <span>{{ f.nombre }}{{ f.nuevo ? ' · nueva' : '' }}{{ f.propia ? ' · meta propia' : '' }}</span>
                  <span class="cmx-impact-o">{{ f.antes != null && f.antes !== f.despues ? 'S/ ' + (f.antes | appNumber:'1.2-2') : '' }}</span>
                  <span class="cmx-impact-n">S/ {{ f.despues | appNumber:'1.2-2' }}</span>
                </div>
              }
            </div>
          }
        </div>

        <div class="cmx-modal-f">
          <button type="button" class="cmx-btn cmx-btn-sec" (click)="cerrar.emit()">Cancelar</button>
          <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!listo() || guardando()" (click)="confirmar()">
            <cmx-icon name="user-plus" [size]="15" /> {{ guardando() ? 'Agregando…' : 'Agregar participante' }}
          </button>
        </div>
      </div>
    </div>
  `,
  host: { '(document:keydown.escape)': 'cerrar.emit()' }
})
export class AgregarParticipanteModalComponent implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly reporte = input.required<ReportePeriodo>();
  readonly codigo = input.required<string>();

  readonly cerrar = output<void>();
  readonly agregado = output<ReportePeriodo>();

  readonly candidatos = signal<UsuarioCashi[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly idUsuario = signal<number | null>(null);
  readonly modo = signal<Modo>('MANTENER');
  readonly metaIndividual = signal<number | null>(null);
  readonly metaMes = signal<number | null>(null);

  readonly asesores = computed(() => this.reporte().participantes.filter(p => p.rol === 'ASESOR'));
  readonly libres = computed(() => {
    const dentro = new Set(this.reporte().participantes.map(p => p.idUsuario));
    return this.candidatos().filter(u => !dentro.has(u.idUsuario));
  });
  readonly divisorActual = computed(() => this.asesores().filter(a => a.metaManual == null).length);
  readonly metaBaseActual = computed(() => this.reporte().periodo.metaDelMes / Math.max(this.divisorActual(), 1));

  readonly listo = computed(() => this.idUsuario() != null
    && (this.modo() === 'MANTENER' ? (this.metaIndividual() ?? 0) > 0 : (this.metaMes() ?? 0) > 0));

  /** Metas antes y después con la opción elegida */
  readonly impacto = computed(() => {
    const id = this.idUsuario();
    if (id == null || !this.listo()) {
      return null;
    }
    const nombre = this.libres().find(u => u.idUsuario === id)?.nombre || 'Usuario ' + id;
    const metaMesAntes = this.reporte().periodo.metaDelMes;
    const aumentar = this.modo() === 'AUMENTAR';
    const metaMesDespues = aumentar ? this.metaMes()! : metaMesAntes;
    const divisorDespues = Math.max(this.divisorActual() + (aumentar ? 1 : 0), 1);
    const baseDespues = metaMesDespues / divisorDespues;

    const filas = this.asesores().map(a => ({
      nombre: a.nombre,
      antes: a.metaIndividual,
      despues: a.metaManual != null ? a.metaManual : baseDespues,
      propia: a.metaManual != null,
      nuevo: false,
      total: false
    }));
    filas.push({ nombre, antes: null, despues: aumentar ? baseDespues : this.metaIndividual()!, propia: !aumentar, nuevo: true, total: false });
    filas.push({ nombre: 'Meta del mes', antes: metaMesAntes, despues: metaMesDespues, propia: false, nuevo: false, total: true });
    return filas;
  });

  ngOnInit(): void {
    const rol = this.reporte().periodo.rolAsesor;
    if (!rol) {
      this.cargando.set(false);
      return;
    }
    this.service.listarUsuariosRol(rol.idRol).subscribe({
      next: u => {
        this.candidatos.set(u);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron cargar los asesores del rol.'));
      }
    });
  }

  num(valor: string): number | null {
    const n = Number(valor);
    return valor === '' || !Number.isFinite(n) ? null : n;
  }

  confirmar(): void {
    const id = this.idUsuario();
    if (id == null || !this.listo()) {
      return;
    }
    const mantener = this.modo() === 'MANTENER';
    this.guardando.set(true);
    this.service.agregarParticipante(this.reporte().periodo.id, {
      idUsuario: id,
      metaManual: mantener ? this.metaIndividual() : null,
      metaAjustada: mantener ? null : this.metaMes()
    }).subscribe({
      next: reporte => {
        this.guardando.set(false);
        const nombre = reporte.participantes.find(p => p.idUsuario === id)?.nombre ?? 'Participante';
        this.toast.success(`${nombre} agregado · ${this.codigo()} recalculado`);
        this.agregado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo agregar al participante.'));
      }
    });
  }
}
