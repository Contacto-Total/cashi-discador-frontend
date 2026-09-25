import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppNumberPipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import {
  EscalaComision,
  ParticipanteComision,
  ReportePeriodo,
  RolCashi,
  RolComision,
  RolElegido
} from '../models/comision.model';
import { ROL_INFO, asesoresActivos, mensajeError, metaPorAsesor } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface TramoBorrador {
  clave: number;
  rol: RolComision;
  desde: number | null;
  monto: number | null;
}

interface Simulacion {
  rol: RolComision;
  personas: number;
  costoActual: number;
  costoNuevo: number;
  porTramo: { desde: number | null; monto: number; personas: number }[];
}

/**
 * Configuración del período (solo EN_CURSO): roles que comisionan, participantes y tramos.
 * Cada cambio guardado borra el cálculo anterior: el backend obliga a recalcular.
 */
@Component({
  selector: 'cmx-configuracion-tab',
  standalone: true,
  imports: [FormsModule, AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!editable()) {
      <div class="cmx-banner cmx-banner-neutral mb-6" role="status">
        <cmx-icon name="lock" />
        <span>
          El período está <b>{{ periodo().estado === 'CERRADO' ? 'cerrado' : 'revisado' }}</b>: la configuración es de solo lectura.
          @if (periodo().estado === 'REVISADO') { Para cambiarla, reábrelo desde la barra superior. }
        </span>
      </div>
    } @else if (calculado()) {
      <div class="cmx-banner mb-6" role="status">
        <cmx-icon name="info" />
        <span>Guardar cualquier cambio de esta pestaña borra el cálculo actual. Después vuelve a pulsar «Calcular».</span>
      </div>
    }

    <div class="grid grid-cols-1 2xl:grid-cols-2 gap-6">
      <!-- ============ ROLES ============ -->
      <section class="cmx-shell cmx-enter" style="--i:0" aria-labelledby="cmx-roles-titulo">
        <div class="cmx-core h-full flex flex-col">
          <header class="cmx-card-head">
            <div class="flex-1 min-w-[16rem]">
              <h3 id="cmx-roles-titulo" class="font-bold text-[0.92rem]">Roles que comisionan</h3>
              <p class="cmx-muted text-[0.76rem] max-w-[60ch]">
                Entran los usuarios activos con estos roles asignados a la subcartera, a su cartera o a su proveedor.
                Quien tenga rol de asesor y de supervisor entra solo como supervisor.
              </p>
            </div>
          </header>

          <div class="flex flex-wrap items-center gap-3 px-5 pt-4">
            <label class="relative flex-1 min-w-[12rem]">
              <span class="sr-only">Buscar rol</span>
              <span class="absolute left-3 top-1/2 -translate-y-1/2 cmx-muted"><cmx-icon name="search" [size]="16" /></span>
              <input class="cmx-input pl-9" type="search" placeholder="Buscar rol" [ngModel]="busquedaRol()"
                     (ngModelChange)="busquedaRol.set($event)" />
            </label>
            <label class="flex items-center gap-2 text-[0.8rem] cmx-soft-text cursor-pointer">
              <button type="button" class="cmx-switch" role="switch" [attr.aria-checked]="soloAsignados()"
                      (click)="soloAsignados.set(!soloAsignados())" aria-label="Solo roles asignados a la subcartera"></button>
              Solo asignados a la subcartera
            </label>
          </div>

          <div class="flex-1 px-5 py-4">
            @if (cargandoRoles()) {
              <div class="flex flex-col gap-2">
                @for (i of [1, 2, 3, 4]; track i) { <div class="cmx-skeleton h-12"></div> }
              </div>
            } @else if (!rolesVisibles().length) {
              <div class="cmx-empty py-8">
                <span class="cmx-empty-mark"><cmx-icon name="layers" [size]="22" /></span>
                <p class="text-[0.84rem] max-w-[40ch]">
                  {{ soloAsignados() ? 'Ningún rol está asignado a esta subcartera. Apaga el filtro para ver todos.' : 'No hay roles que coincidan con la búsqueda.' }}
                </p>
              </div>
            } @else {
              <ul class="flex flex-col">
                @for (r of rolesVisibles(); track r.idRol) {
                  <li class="flex flex-wrap items-center gap-3 py-2.5 border-b last:border-b-0" style="border-color: var(--cmx-line)">
                    <div class="flex-1 min-w-[10rem]">
                      <span class="font-semibold text-[0.86rem]">{{ r.nombreRol }}</span>
                      @if (r.asignadoASubcartera) {
                        <span class="cmx-tag cmx-tag-brand ml-2">Asignado</span>
                      }
                    </div>
                    <div class="cmx-seg" role="group" [attr.aria-label]="'Cómo comisiona ' + r.nombreRol">
                      <button type="button" [attr.aria-pressed]="!borradorRoles().has(r.idRol)"
                              [disabled]="!editable()" (click)="asignarRol(r.idRol, null)">No</button>
                      <button type="button" [attr.aria-pressed]="borradorRoles().get(r.idRol) === 'ASESOR'"
                              [disabled]="!editable()" (click)="asignarRol(r.idRol, 'ASESOR')">Asesor</button>
                      <button type="button" [attr.aria-pressed]="borradorRoles().get(r.idRol) === 'SUPERVISOR'"
                              [disabled]="!editable()" (click)="asignarRol(r.idRol, 'SUPERVISOR')">Supervisor</button>
                    </div>
                  </li>
                }
              </ul>
            }
          </div>

          <footer class="flex flex-wrap items-center gap-3 px-5 py-4 border-t" style="border-color: var(--cmx-line); background: var(--cmx-soft)">
            <span class="cmx-muted text-[0.78rem] flex-1">
              {{ resumenRoles() }}
              @if (rolesCambiados()) { · <b style="color: var(--cmx-amber)">sin guardar</b> }
            </span>
            @if (rolesCambiados()) {
              <button type="button" class="cmx-btn cmx-btn-link cmx-btn-sm" (click)="descartarRoles()">Descartar</button>
            }
            <button type="button" class="cmx-btn cmx-btn-primary cmx-btn-sm" [disabled]="!editable() || guardandoRoles()"
                    (click)="guardarRoles()">
              {{ guardandoRoles() ? 'Guardando…' : (rolesCambiados() ? 'Guardar roles' : 'Actualizar participantes') }}
              <span class="cmx-orb !w-6 !h-6"><cmx-icon name="refresh" [size]="13" [class.cmx-spin]="guardandoRoles()" /></span>
            </button>
          </footer>
        </div>
      </section>

      <!-- ============ PARTICIPANTES ============ -->
      <section class="cmx-shell cmx-enter" style="--i:1" aria-labelledby="cmx-part-titulo">
        <div class="cmx-core h-full flex flex-col">
          <header class="cmx-card-head">
            <div class="flex-1">
              <h3 id="cmx-part-titulo" class="font-bold text-[0.92rem]">Participantes</h3>
              <p class="cmx-muted text-[0.76rem] max-w-[60ch]">
                Quitar a alguien lo saca de la división de la meta y no comisiona. Queda en el historial quién lo hizo.
              </p>
            </div>
            <span class="cmx-tag">{{ n() }} {{ n() === 1 ? 'asesor divide' : 'asesores dividen' }} la meta</span>
          </header>

          @if (participantes().length) {
            <ul class="flex-1">
              @for (p of participantes(); track p.idResultado) {
                <li class="flex items-center gap-3 px-5 py-3 border-b last:border-b-0" style="border-color: var(--cmx-line)">
                  <span class="cmx-tag" [class.cmx-tag-ink]="p.rol === 'SUPERVISOR'">{{ rolInfo[p.rol] }}</span>
                  <span class="flex-1 font-semibold text-[0.86rem]" [class.cmx-muted]="p.quitado">
                    {{ p.nombre }}
                    @if (p.quitado) { <span class="cmx-tag cmx-tag-amber ml-2">Quitado</span> }
                  </span>
                  <span class="text-[0.76rem] cmx-muted hidden sm:inline">{{ p.quitado ? 'No cuenta' : 'Cuenta' }}</span>
                  <button type="button" class="cmx-switch" role="switch" [attr.aria-checked]="!p.quitado"
                          [disabled]="!editable() || cambiandoQuitado() === p.idResultado"
                          [attr.aria-label]="(p.quitado ? 'Devolver a ' : 'Quitar a ') + p.nombre"
                          (click)="cambiarQuitado(p)"></button>
                </li>
              }
            </ul>
          } @else {
            <div class="cmx-empty flex-1">
              <span class="cmx-empty-mark"><cmx-icon name="users" [size]="22" /></span>
              <p class="text-[0.84rem] max-w-[40ch]">Aún no hay participantes. Elige los roles y pulsa «Guardar roles».</p>
            </div>
          }
        </div>
      </section>
    </div>

    <!-- ============ TRAMOS ============ -->
    <section class="cmx-shell cmx-enter mt-6" style="--i:2" aria-labelledby="cmx-tramos-titulo">
      <div class="cmx-core">
        <header class="cmx-card-head">
          <div class="flex-1 min-w-[16rem]">
            <h3 id="cmx-tramos-titulo" class="font-bold text-[0.92rem]">Tabla de tramos</h3>
            <p class="cmx-muted text-[0.76rem] max-w-[64ch]">
              Se escribe el porcentaje y la comisión; el monto en soles se calcula con la meta. Un tramo aplica desde
              que el cumplimiento llega a su porcentaje, y el más alto alcanzado es el que se paga.
            </p>
          </div>
          <div class="cmx-seg" role="tablist" aria-label="Tabla que se edita">
            @for (rol of roles; track rol) {
              <button type="button" role="tab" [attr.aria-selected]="rolTramos() === rol" (click)="rolTramos.set(rol)">
                {{ rolInfo[rol] }} · {{ cuentaTramos(rol) }}
              </button>
            }
          </div>
        </header>

        <div class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div class="p-5 min-w-0">
            <div class="cmx-table-wrap rounded-2xl" style="box-shadow: inset 0 0 0 1px var(--cmx-line)">
              <table class="cmx-table">
                <thead>
                  <tr>
                    <th scope="col">Desde (%)</th>
                    <th scope="col" class="n">Desde en soles</th>
                    <th scope="col">Hasta</th>
                    <th scope="col" class="n">Comisión (S/)</th>
                    <th scope="col"><span class="sr-only">Quitar</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of tramosRolActual(); track t.clave; let i = $index) {
                    <tr>
                      <td class="w-40">
                        <input class="cmx-input cmx-input-num !min-h-9" type="number" min="0" max="999.99" step="0.01"
                               [class.is-invalid]="errorTramo(t)" [disabled]="!editable()"
                               [attr.aria-label]="'Desde (%) del tramo ' + (i + 1)"
                               [ngModel]="t.desde" (ngModelChange)="editarTramo(t.clave, 'desde', $event)" />
                      </td>
                      <td class="n cmx-muted">{{ desdeEnSoles(t.desde) != null ? (desdeEnSoles(t.desde) | appNumber:'1.2-2') : '—' }}</td>
                      <td class="cmx-muted cmx-num whitespace-nowrap">{{ hasta(t) }}</td>
                      <td class="w-40">
                        <input class="cmx-input cmx-input-num !min-h-9" type="number" min="0" step="1"
                               [class.is-invalid]="t.monto == null || t.monto < 0" [disabled]="!editable()"
                               [attr.aria-label]="'Comisión del tramo ' + (i + 1)"
                               [ngModel]="t.monto" (ngModelChange)="editarTramo(t.clave, 'monto', $event)" />
                      </td>
                      <td class="text-right">
                        <button type="button" class="cmx-icon-btn" [disabled]="!editable()" (click)="quitarTramo(t.clave)"
                                [attr.aria-label]="'Quitar tramo ' + (i + 1)">
                          <cmx-icon name="trash" [size]="17" />
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="cmx-muted text-center py-8 text-[0.84rem]">
                        Sin tramos para {{ rolInfo[rolTramos()].toLowerCase() }}. Agrega el primero.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            @if (erroresTramos().length) {
              <ul class="mt-3 flex flex-col gap-1 text-[0.8rem]" style="color: var(--cmx-danger)" role="alert">
                @for (e of erroresTramos(); track e) { <li>{{ e }}</li> }
              </ul>
            }

            <div class="flex flex-wrap items-center gap-3 mt-4">
              <button type="button" class="cmx-btn cmx-btn-ghost cmx-btn-sm" [disabled]="!editable()" (click)="agregarTramo()">
                <cmx-icon name="plus" [size]="15" /> Agregar tramo
              </button>
              <span class="flex-1"></span>
              @if (tramosCambiados()) {
                <span class="text-[0.78rem]" style="color: var(--cmx-amber)">Cambios sin guardar</span>
                <button type="button" class="cmx-btn cmx-btn-link cmx-btn-sm" (click)="descartarTramos()">Descartar</button>
              }
              <button type="button" class="cmx-btn cmx-btn-primary cmx-btn-sm"
                      [disabled]="!editable() || !tramosCambiados() || erroresTramos().length > 0 || guardandoTramos()"
                      (click)="guardarTramos()">
                {{ guardandoTramos() ? 'Guardando…' : 'Guardar tramos' }}
                <span class="cmx-orb !w-6 !h-6"><cmx-icon name="check" [size]="13" /></span>
              </button>
            </div>
          </div>

          <!-- Simulación -->
          <aside class="p-5 xl:border-l" style="border-color: var(--cmx-line)" aria-label="Simulación">
            <div class="rounded-2xl p-4" style="background: var(--cmx-brand-soft); color: var(--cmx-brand-ink)">
              <span class="text-[0.66rem] font-bold tracking-[0.14em] uppercase">Simulación</span>
              @if (simulacion(); as sim) {
                <p class="text-[0.78rem] mt-1 opacity-80">
                  La tabla que editas aplicada al {{ calculado() ? 'logrado del último cálculo' : 'logrado actual' }}.
                </p>
                <ul class="mt-3 flex flex-col gap-1.5 text-[0.8rem]">
                  @for (f of sim.porTramo; track f.desde) {
                    <li class="flex justify-between gap-3">
                      <span>{{ f.desde == null ? 'Sin tramo' : 'Desde ' + f.desde + ' %' }}</span>
                      <b class="cmx-num">{{ f.personas }} · S/ {{ f.monto * f.personas | appNumber:'1.0-0' }}</b>
                    </li>
                  }
                </ul>
                <div class="flex justify-between gap-3 mt-3 pt-3 border-t text-[0.84rem]" style="border-color: color-mix(in srgb, var(--cmx-brand-2) 35%, transparent)">
                  <span>Costo con esta tabla</span>
                  <b class="cmx-num">S/ {{ sim.costoNuevo | appNumber:'1.2-2' }}</b>
                </div>
                @if (sim.costoNuevo !== sim.costoActual) {
                  <p class="text-[0.76rem] mt-1 opacity-80 cmx-num">Hoy: S/ {{ sim.costoActual | appNumber:'1.2-2' }}</p>
                }
              } @else {
                <p class="text-[0.8rem] mt-2 opacity-85">
                  Calcula el período una vez para ver cuánto costaría esta tabla con lo que ya llevan
                  {{ rolTramos() === 'ASESOR' ? 'los asesores' : 'el supervisor' }}.
                </p>
              }
            </div>
            <p class="cmx-muted text-[0.76rem] mt-3">
              Base de «Desde en soles»:
              {{ rolTramos() === 'ASESOR' ? 'meta por asesor' : 'meta completa de la subcartera' }}
              @if (baseTramos() != null) { (S/ {{ baseTramos() | appNumber:'1.2-2' }}) }.
            </p>
          </aside>
        </div>
      </div>
    </section>
  `
})
export class ConfiguracionTabComponent implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly reporte = input.required<ReportePeriodo>();
  readonly actualizado = output<ReportePeriodo>();

  readonly roles: RolComision[] = ['ASESOR', 'SUPERVISOR'];
  readonly rolInfo = ROL_INFO;

  readonly periodo = computed(() => this.reporte().periodo);
  readonly participantes = computed(() => this.reporte().participantes);
  readonly editable = computed(() => this.periodo().estado === 'EN_CURSO');
  readonly calculado = computed(() => !!this.periodo().fechaCalculo);
  readonly n = computed(() => asesoresActivos(this.participantes()));

  // ---------- Roles ----------
  readonly rolesDisponibles = signal<RolCashi[]>([]);
  readonly cargandoRoles = signal(true);
  readonly guardandoRoles = signal(false);
  readonly busquedaRol = signal('');
  readonly soloAsignados = signal(true);
  readonly borradorRoles = signal(new Map<number, RolComision>());

  readonly rolesVisibles = computed(() => {
    const texto = this.busquedaRol().trim().toLowerCase();
    const elegidos = this.borradorRoles();
    return this.rolesDisponibles().filter(r =>
      (!this.soloAsignados() || r.asignadoASubcartera || elegidos.has(r.idRol))
      && (!texto || r.nombreRol.toLowerCase().includes(texto))
    );
  });

  readonly rolesCambiados = computed(() => {
    const guardados = this.periodo().roles;
    const borrador = this.borradorRoles();
    return guardados.length !== borrador.size
      || guardados.some(r => borrador.get(r.idRol) !== r.rolComision);
  });

  readonly resumenRoles = computed(() => {
    const valores = [...this.borradorRoles().values()];
    const asesores = valores.filter(v => v === 'ASESOR').length;
    const supervisores = valores.filter(v => v === 'SUPERVISOR').length;
    return `${asesores} ${asesores === 1 ? 'rol de asesor' : 'roles de asesor'} · ${supervisores} de supervisor`;
  });

  // ---------- Participantes ----------
  readonly cambiandoQuitado = signal<number | null>(null);

  // ---------- Tramos ----------
  private secuencia = 0;
  readonly rolTramos = signal<RolComision>('ASESOR');
  readonly borradorTramos = signal<TramoBorrador[]>([]);
  readonly guardandoTramos = signal(false);

  /** Sin reordenar mientras se escribe (reordenar movería la fila y se perdería el foco) */
  readonly tramosRolActual = computed(() => this.borradorTramos().filter(t => t.rol === this.rolTramos()));

  readonly baseTramos = computed(() => this.rolTramos() === 'ASESOR'
    ? metaPorAsesor(this.periodo(), this.participantes())
    : this.periodo().metaGrupal);

  readonly tramosCambiados = computed(() => {
    const guardados = this.firma(this.periodo().escalas.map(e => ({ rol: e.rol, desde: e.porcentajeDesde, monto: e.montoComision })));
    const borrador = this.firma(this.borradorTramos());
    return guardados !== borrador;
  });

  readonly erroresTramos = computed(() => {
    const errores: string[] = [];
    for (const rol of this.roles) {
      const vistos = new Set<number>();
      for (const t of this.borradorTramos().filter(x => x.rol === rol)) {
        if (t.desde == null || t.desde < 0 || t.desde > 999.99) {
          errores.push(`${ROL_INFO[rol]}: el porcentaje de cada tramo debe estar entre 0 y 999.99.`);
        } else if (vistos.has(t.desde)) {
          errores.push(`${ROL_INFO[rol]}: hay dos tramos desde ${t.desde} %.`);
        } else {
          vistos.add(t.desde);
        }
        if (t.monto == null || t.monto < 0) {
          errores.push(`${ROL_INFO[rol]}: la comisión de cada tramo debe ser 0 o más.`);
        }
      }
    }
    return [...new Set(errores)];
  });

  /** Cuánto costaría la tabla en edición con el logrado del último cálculo */
  readonly simulacion = computed<Simulacion | null>(() => {
    if (!this.calculado()) {
      return null;
    }
    const rol = this.rolTramos();
    const tramos = this.ordenar(this.tramosRolActual()).filter(t => t.desde != null && t.monto != null);
    const personas = this.participantes().filter(p => p.rol === rol && !p.quitado);
    if (!personas.length) {
      return null;
    }
    const divisor = rol === 'ASESOR' ? Math.max(this.n(), 1) : 1;
    const meta = this.periodo().metaGrupal;
    const conteo = new Map<number | null, { monto: number; personas: number }>();
    let costoNuevo = 0;
    for (const p of personas) {
      let alcanzado: TramoBorrador | null = null;
      for (const t of tramos) {
        if (p.logrado * 100 * divisor >= (t.desde as number) * meta) {
          alcanzado = t;
        }
      }
      const clave = alcanzado ? alcanzado.desde : null;
      const monto = alcanzado ? (alcanzado.monto as number) : 0;
      const actual = conteo.get(clave) ?? { monto, personas: 0 };
      conteo.set(clave, { monto, personas: actual.personas + 1 });
      costoNuevo += monto;
    }
    return {
      rol,
      personas: personas.length,
      costoActual: personas.reduce((s, p) => s + p.montoComision, 0),
      costoNuevo,
      porTramo: [...conteo.entries()]
        .map(([desde, v]) => ({ desde, monto: v.monto, personas: v.personas }))
        .sort((a, b) => (a.desde ?? -1) - (b.desde ?? -1))
    };
  });

  constructor() {
    // Cuando llega un reporte nuevo (guardado, recálculo) se reinician los borradores
    effect(() => {
      const periodo = this.periodo();
      untracked(() => {
        this.borradorRoles.set(new Map(periodo.roles.map(r => [r.idRol, r.rolComision])));
        this.borradorTramos.set(periodo.escalas.map(e => this.aBorrador(e)));
      });
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  // ==================== ROLES ====================

  private cargarRoles(): void {
    this.cargandoRoles.set(true);
    this.service.listarRolesDisponibles(this.periodo().id).subscribe({
      next: roles => {
        this.rolesDisponibles.set(roles);
        this.cargandoRoles.set(false);
      },
      error: e => {
        this.cargandoRoles.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron cargar los roles de Cashi.'));
      }
    });
  }

  asignarRol(idRol: number, rol: RolComision | null): void {
    const mapa = new Map(this.borradorRoles());
    if (rol == null) {
      mapa.delete(idRol);
    } else {
      mapa.set(idRol, rol);
    }
    this.borradorRoles.set(mapa);
  }

  descartarRoles(): void {
    this.borradorRoles.set(new Map(this.periodo().roles.map(r => [r.idRol, r.rolComision])));
  }

  guardarRoles(): void {
    if (!this.editable() || this.guardandoRoles()) {
      return;
    }
    const roles: RolElegido[] = [...this.borradorRoles().entries()].map(([idRol, rolComision]) => ({ idRol, rolComision }));
    this.guardandoRoles.set(true);
    this.service.guardarRoles(this.periodo().id, roles).subscribe({
      next: reporte => {
        this.guardandoRoles.set(false);
        this.toast.success(`Participantes actualizados: ${reporte.participantes.length}.`);
        this.actualizado.emit(reporte);
      },
      error: e => {
        this.guardandoRoles.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron guardar los roles.'));
      }
    });
  }

  // ==================== PARTICIPANTES ====================

  cambiarQuitado(p: ParticipanteComision): void {
    if (!this.editable() || this.cambiandoQuitado() != null) {
      return;
    }
    this.cambiandoQuitado.set(p.idResultado);
    this.service.cambiarQuitado(this.periodo().id, p.idResultado, !p.quitado).subscribe({
      next: reporte => {
        this.cambiandoQuitado.set(null);
        this.toast.success(p.quitado ? `${p.nombre} vuelve a contar.` : `${p.nombre} quedó fuera del período.`);
        this.actualizado.emit(reporte);
      },
      error: e => {
        this.cambiandoQuitado.set(null);
        this.toast.error(mensajeError(e, 'No se pudo actualizar el participante.'));
      }
    });
  }

  // ==================== TRAMOS ====================

  cuentaTramos(rol: RolComision): number {
    return this.borradorTramos().filter(t => t.rol === rol).length;
  }

  desdeEnSoles(desde: number | null): number | null {
    const base = this.baseTramos();
    return desde == null || base == null ? null : (desde / 100) * base;
  }

  /** El "hasta" es el menor "desde" mayor que el de este tramo */
  hasta(t: TramoBorrador): string {
    if (t.desde == null) {
      return '—';
    }
    const mayores = this.tramosRolActual()
      .map(x => x.desde)
      .filter((d): d is number => d != null && d > (t.desde as number));
    return mayores.length ? `hasta ${Math.min(...mayores)} %` : 'a más';
  }

  errorTramo(t: TramoBorrador): boolean {
    if (t.desde == null || t.desde < 0 || t.desde > 999.99) {
      return true;
    }
    return this.borradorTramos().filter(x => x.rol === t.rol && x.desde === t.desde).length > 1;
  }

  editarTramo(clave: number, campo: 'desde' | 'monto', valor: number | string | null): void {
    const numero = valor === '' || valor == null ? null : Number(valor);
    this.borradorTramos.update(lista => lista.map(t => t.clave === clave ? { ...t, [campo]: Number.isNaN(numero) ? null : numero } : t));
  }

  agregarTramo(): void {
    const rol = this.rolTramos();
    const actuales = this.ordenar(this.tramosRolActual());
    const ultimo = actuales.length ? actuales[actuales.length - 1] : null;
    const desde = ultimo?.desde != null ? Math.min(ultimo.desde + 10, 999) : 0;
    this.borradorTramos.update(lista => [...lista, { clave: ++this.secuencia, rol, desde, monto: ultimo?.monto ?? 0 }]);
  }

  quitarTramo(clave: number): void {
    this.borradorTramos.update(lista => lista.filter(t => t.clave !== clave));
  }

  descartarTramos(): void {
    this.borradorTramos.set(this.periodo().escalas.map(e => this.aBorrador(e)));
  }

  guardarTramos(): void {
    if (!this.editable() || this.erroresTramos().length || this.guardandoTramos()) {
      return;
    }
    const tramos: EscalaComision[] = this.borradorTramos().map(t => ({
      rol: t.rol,
      porcentajeDesde: t.desde as number,
      montoComision: t.monto as number
    }));
    this.guardandoTramos.set(true);
    this.service.guardarTramos(this.periodo().id, tramos).subscribe({
      next: reporte => {
        this.guardandoTramos.set(false);
        this.toast.success('Tramos guardados. Recalcula el período para ver el efecto.');
        this.actualizado.emit(reporte);
      },
      error: e => {
        this.guardandoTramos.set(false);
        this.toast.error(mensajeError(e, 'No se pudieron guardar los tramos.'));
      }
    });
  }

  private aBorrador(e: EscalaComision): TramoBorrador {
    return { clave: ++this.secuencia, rol: e.rol, desde: e.porcentajeDesde, monto: e.montoComision };
  }

  /** Orden por "desde"; los vacíos al final */
  private ordenar(lista: TramoBorrador[]): TramoBorrador[] {
    return [...lista].sort((a, b) => (a.desde ?? Number.MAX_VALUE) - (b.desde ?? Number.MAX_VALUE) || a.clave - b.clave);
  }

  private firma(lista: { rol: RolComision; desde: number | null; monto: number | null }[]): string {
    return lista
      .map(t => `${t.rol}|${t.desde}|${t.monto}`)
      .sort()
      .join(';');
  }
}
