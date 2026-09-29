import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import { ReportePeriodo, UsuarioCashi } from '../models/comision.model';
import { TIPOS_META, diaMes, diasHabilesDesde, mensajeError, nombreRol } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

/**
 * Agregar a alguien que ingresa con el mes en curso. Se elige su fecha de ingreso y su meta
 * individual sale sola: meta de un asesor de mes completo × días hábiles que trabaja (desde el
 * ingreso, inclusive) ÷ días hábiles del mes. La meta del mes y la de los demás no cambian.
 * No recalcula: entra en el próximo recálculo.
 */
@Component({
  selector: 'cmx-agregar-participante-modal',
  standalone: true,
  imports: [AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let p = reporte().periodo;
    <div class="cmx-scrim cmx-modal-scrim" (click)="cerrar.emit()">
      <div class="cmx-modal" role="dialog" aria-modal="true" aria-labelledby="cmx-ag-titulo" (click)="$event.stopPropagation()">
        <div class="cmx-modal-h">
          <div>
            <div class="cmx-eyebrow">{{ p.nombreSubcartera }} · {{ codigo() }}</div>
            <b id="cmx-ag-titulo">Agregar participante</b>
          </div>
          <button type="button" class="cmx-icon-btn" (click)="cerrar.emit()" aria-label="Cerrar"><cmx-icon name="x" [size]="16" /></button>
        </div>

        <div class="cmx-modal-b">
          <div class="cmx-field">
            <label for="cmx-ag-usuario">Asesor con rol {{ rol() }}</label>
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

          <div class="cmx-field">
            <label for="cmx-ag-fecha">Fecha de ingreso</label>
            <input id="cmx-ag-fecha" type="date" class="cmx-fdate" [min]="primerDia()" [max]="ultimoDia()" [value]="fecha()"
                   (change)="fecha.set($any($event.target).value)" />
            <span class="cmx-muted-txt">Se cuentan los días hábiles desde esa fecha hasta fin de mes; el día de ingreso cuenta.</span>
          </div>

          @if (calculo(); as c) {
            <div class="cmx-calcbox">
              <div class="cr"><span>Días hábiles que trabajará</span><b>{{ c.dias }} de {{ c.diasMes }}</b></div>
              <div class="cx">Del {{ diaMes(fecha()) }} al {{ diaMes(ultimoDia()) }}: lunes a viernes, sin feriados</div>
              <div class="cr"><span>Meta individual</span><b>S/ {{ c.meta | appNumber:'1.2-2' }}</b></div>
              <div class="cx">Meta de un asesor de mes completo S/ {{ c.metaBase | appNumber:'1.2-2' }} × {{ c.dias }} / {{ c.diasMes }} días hábiles</div>
              @for (m of c.metas; track m.nombre) {
                <div class="cr"><span>{{ m.nombre }}</span><b>{{ m.llegar | appNumber:'1.0-0' }}</b></div>
                <div class="cx">{{ m.dia }} por día × {{ c.dias }} días hábiles</div>
              }
              <p class="cmx-pn">La meta del mes (S/ {{ p.metaDelMes | appNumber:'1.2-2' }}) y la de los demás no cambian. Entra en el próximo recálculo.</p>
            </div>
          } @else if (idUsuario() != null && error()) {
            <p class="cmx-err-txt">{{ error() }}</p>
          }
        </div>

        <div class="cmx-modal-f">
          <button type="button" class="cmx-btn cmx-btn-sec" (click)="cerrar.emit()">Cancelar</button>
          <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!calculo() || idUsuario() == null || guardando()" (click)="confirmar()">
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
  /** Feriados del mes (yyyy-mm-dd) que caen de lunes a viernes */
  readonly feriados = input<string[]>([]);

  readonly cerrar = output<void>();
  readonly agregado = output<ReportePeriodo>();

  readonly diaMes = diaMes;

  readonly candidatos = signal<UsuarioCashi[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly idUsuario = signal<number | null>(null);
  readonly fecha = signal('');

  readonly rol = computed(() => nombreRol(this.reporte().periodo.rolAsesor?.nombreRol) || '—');
  readonly primerDia = computed(() => `${this.reporte().periodo.anio}-${String(this.reporte().periodo.mes).padStart(2, '0')}-01`);
  readonly ultimoDia = computed(() => {
    const { anio, mes } = this.reporte().periodo;
    return `${anio}-${String(mes).padStart(2, '0')}-${new Date(anio, mes, 0).getDate()}`;
  });
  readonly libres = computed(() => {
    const dentro = new Set(this.reporte().participantes.map(p => p.idUsuario));
    return this.candidatos().filter(u => !dentro.has(u.idUsuario));
  });

  readonly error = computed(() => {
    const f = this.fecha();
    if (!f || f < this.primerDia() || f > this.ultimoDia()) {
      return `Elige su fecha de ingreso dentro de ${this.codigo()}.`;
    }
    return this.dias() > 0 ? null : 'Desde esa fecha ya no quedan días hábiles en el mes.';
  });

  private readonly dias = computed(() => {
    const f = this.fecha();
    const { anio, mes } = this.reporte().periodo;
    return f ? diasHabilesDesde(anio, mes, Number(f.slice(8, 10)), this.feriados()) : 0;
  });

  /** Meta y metas de cantidad de quien ingresa, como las calcula el backend */
  readonly calculo = computed(() => {
    if (this.error()) {
      return null;
    }
    const p = this.reporte().periodo;
    const diasMes = p.diasHabiles;
    const mesCompleto = this.reporte().participantes
      .filter(x => x.rol === 'ASESOR' && x.metaManual == null && x.fechaIngreso == null).length;
    const metaBase = p.metaDelMes / Math.max(mesCompleto, 1);
    const dias = this.dias();
    const metas = p.tipoMetrica === 'CONTENCION'
      ? (p.metasCantidad ?? []).filter(m => m.tipo !== 'META' && m.cantidadDia != null).map(m => ({
          nombre: TIPOS_META.find(t => t.tipo === m.tipo)!.nombre,
          dia: m.cantidadDia!,
          llegar: m.cantidadDia! * dias
        }))
      : [];
    return { dias, diasMes, metaBase, meta: diasMes ? metaBase * dias / diasMes : 0, metas };
  });

  ngOnInit(): void {
    // Por defecto: hoy si es del mes; si no, el primero
    const hoy = new Date();
    const iso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    this.fecha.set(iso >= this.primerDia() && iso <= this.ultimoDia() ? iso : this.primerDia());

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

  confirmar(): void {
    const id = this.idUsuario();
    if (id == null || !this.calculo()) {
      return;
    }
    this.guardando.set(true);
    this.service.agregarParticipante(this.reporte().periodo.id, { idUsuario: id, fechaIngreso: this.fecha() }).subscribe({
      next: reporte => {
        this.guardando.set(false);
        const nombre = reporte.participantes.find(p => p.idUsuario === id)?.nombre ?? 'Participante';
        this.toast.success(`${nombre} agregado · entra al recalcular`);
        this.agregado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo agregar al participante.'));
      }
    });
  }
}
