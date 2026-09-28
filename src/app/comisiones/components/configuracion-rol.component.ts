import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  afterRenderEffect,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, concatMap, of } from 'rxjs';
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
import { ROL_INFO, asesoresActivos, mensajeError, metaPorAsesor, tramoAlcanzado } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface TramoBorrador {
  clave: number;
  rol: RolComision;
  desde: number | null;
  monto: number | null;
}

/**
 * Configuración de un solo lado del período (solo EN_CURSO): roles de Cashi, participantes y
 * tabla comisional. Los roles que ya cuentan del otro lado no aparecen.
 * Los borradores de roles y tramos son de los dos lados: cambiar de lado no pierde lo editado y
 * «Guardar» (en la barra de contexto) guarda todo. Quitar o devolver a alguien se aplica al instante.
 */
@Component({
  selector: 'cmx-configuracion-rol',
  standalone: true,
  imports: [FormsModule, AppNumberPipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-cfg">
      <div>
        <div class="cmx-enter" style="margin-bottom:16px;display:flex;flex-wrap:wrap;align-items:center;gap:12px">
          <div class="cmx-segctl" role="group" aria-label="Qué se configura" #seg>
            <span class="cmx-segctl-pill" aria-hidden="true" #pill></span>
            @for (r of lados; track r) {
              <button type="button" [attr.aria-pressed]="rol() === r" [attr.data-lado]="r" (click)="cambiarLado(r)">{{ rolInfo[r] }}</button>
            }
          </div>
          <span style="font-size:.78rem;color:var(--cmx-ink-3)">Todo lo de abajo es solo del {{ nombreRol() }}.</span>
          @if (hayCambios()) {
            <span class="cmx-tag cmx-tag-v">Cambios sin guardar</span>
          }
        </div>

        <!-- ============ ROLES ============ -->
        <section class="cmx-card cmx-enter" style="--i:1" aria-labelledby="cmx-cfg-roles">
          <div class="cmx-card-h">
            <h3 id="cmx-cfg-roles" style="font-size:.85rem;font-weight:700">Roles de Cashi que cuentan como {{ nombreRol() }}</h3>
            @if (ocultos()) { <em>no aparecen los {{ ocultos() }} que ya cuentan como {{ nombreOtro() }}</em> }
          </div>
          <div class="cmx-card-b">
            <label class="cmx-search">
              <span class="sr-only">Buscar rol</span>
              <span class="cmx-search-ic"><cmx-icon name="search" [size]="15" /></span>
              <input type="search" placeholder="Buscar rol" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
            </label>
            @if (cargandoRoles()) {
              <div style="display:grid;gap:8px">
                @for (i of [1, 2, 3]; track i) { <div class="cmx-skel" style="height:30px"></div> }
              </div>
            } @else {
              @for (r of rolesVisibles(); track r.idRol) {
                <div class="cmx-rolrow">
                  <label>
                    <input type="checkbox" [checked]="borradorRoles().get(r.idRol) === rol()" (change)="marcarRol(r.idRol, $any($event.target).checked)" />
                    {{ r.nombreRol }}
                  </label>
                  @if (r.asignadoASubcartera) {
                    <span class="cmx-tag cmx-tag-d">asignado a {{ periodoNombre() }}</span>
                  } @else {
                    <span class="cmx-tag cmx-tag-s">otra subcartera</span>
                  }
                </div>
              } @empty {
                <p class="cmx-rule-desc" style="padding:8px 0">
                  {{ busqueda() ? 'Ningún rol coincide con la búsqueda.' : 'No hay roles asignados a esta subcartera.' }}
                </p>
              }
              @if (!verTodos() && !busqueda() && otrosSinAsignar()) {
                <button type="button" class="cmx-btn cmx-btn-link" style="margin-top:6px" (click)="verTodos.set(true)">
                  Mostrar los {{ otrosSinAsignar() }} roles de otras subcarteras
                </button>
              }
            }
          </div>
        </section>

        <!-- ============ PARTICIPANTES ============ -->
        <section class="cmx-card cmx-enter" style="--i:2" aria-labelledby="cmx-cfg-part">
          <div class="cmx-card-h">
            <h3 id="cmx-cfg-part" style="font-size:.85rem;font-weight:700">{{ esAsesor() ? 'Asesores' : 'Supervisor' }} del período</h3>
            <em>salen de los roles marcados</em>
          </div>
          <div class="cmx-card-b">
            @for (p of gente(); track p.idResultado) {
              <div class="cmx-prow" [class.is-out]="p.quitado">
                <span class="cmx-prow-nm">{{ p.nombre }}</span>
                <span class="cmx-prow-st">{{ p.quitado ? 'Quitado' : 'Cuenta' }}</span>
                <button type="button" class="cmx-switch" role="switch" [attr.aria-checked]="!p.quitado"
                        [disabled]="cambiandoQuitado() != null" (click)="cambiarQuitado(p)"
                        [attr.aria-label]="(p.quitado ? 'Devolver a ' : 'Quitar a ') + p.nombre"></button>
              </div>
            } @empty {
              <p class="cmx-rule-desc" style="padding:6px 0">Todavía no hay {{ esAsesor() ? 'asesores' : 'supervisor' }}: marca sus roles y guarda.</p>
            }
            @if (rolesCambiados()) {
              <div class="cmx-hint">Al guardar, la lista se vuelve a armar con los roles marcados. Quien sigue conserva si estaba quitado.</div>
            } @else {
              <div class="cmx-hint">Quitar a alguien lo saca de la división de la meta y no comisiona. Queda en el historial quién lo hizo.</div>
            }
          </div>
        </section>

        <!-- ============ TRAMOS ============ -->
        <section class="cmx-card cmx-enter" style="--i:3" aria-labelledby="cmx-cfg-tramos">
          <div class="cmx-card-h">
            <h3 id="cmx-cfg-tramos" style="font-size:.85rem;font-weight:700">Tabla comisional del {{ nombreRol() }}</h3>
            <em>los montos en soles se calculan solos</em>
          </div>
          <div class="cmx-card-b">
            @for (t of tramosLado(); track t.clave; let i = $index) {
              <div class="cmx-trow">
                <input type="number" min="0" max="999.99" step="0.01" [class.is-invalid]="errorTramo(t)"
                       [attr.aria-label]="'Desde, en porcentaje, tramo ' + (i + 1)"
                       [ngModel]="t.desde" (ngModelChange)="editarTramo(t.clave, 'desde', $event)" /> %
                <span class="cmx-trow-ro cmx-num">{{ desdeEnSoles(t.desde) != null ? (desdeEnSoles(t.desde) | appNumber:'1.2-2') : '—' }}</span>
                <span class="cmx-trow-hasta">{{ hasta(t) }}</span>→ S/
                <input type="number" min="0" step="1" [class.is-invalid]="t.monto == null || t.monto < 0"
                       [attr.aria-label]="'Comisión en soles, tramo ' + (i + 1)"
                       [ngModel]="t.monto" (ngModelChange)="editarTramo(t.clave, 'monto', $event)" />
                <button type="button" class="cmx-trow-del" (click)="quitarTramo(t.clave)" [attr.aria-label]="'Quitar tramo ' + (i + 1)">
                  <cmx-icon name="x" [size]="15" />
                </button>
              </div>
            } @empty {
              <p class="cmx-rule-desc" style="padding:6px 0">Sin tramos: nadie de este lado comisiona. Agrega el primero.</p>
            }
            @if (erroresLado().length) {
              <ul class="cmx-errors" role="alert">
                @for (e of erroresLado(); track e) { <li>{{ e }}</li> }
              </ul>
            }
            <div style="margin-top:12px">
              <button type="button" class="cmx-btn cmx-btn-sec" (click)="agregarTramo()">
                <cmx-icon name="plus" [size]="15" /> Agregar tramo
              </button>
            </div>
          </div>
        </section>
      </div>

      <!-- ============ SIMULACIÓN ============ -->
      <div>
        <div class="cmx-prev cmx-enter" style="--i:2" aria-live="polite">
          <div class="cmx-prev-t">Simulación con el {{ periodo().tipoMetrica === 'CONTENCION' ? 'recaudo contenido' : 'recaudo' }} del período</div>
          @if (simulacion(); as sim) {
            <div class="cmx-prev-r" style="display:block;font-size:.72rem;padding-bottom:6px;color:var(--cmx-ink-3)">
              La tabla que editas aplicada a lo que ya {{ esAsesor() ? 'llevan los asesores' : 'lleva la subcartera' }} este mes.
            </div>
            <div class="cmx-prev-r"><span>Sobre el 100 %</span><b>{{ sim.arriba }}</b></div>
            <div class="cmx-prev-r"><span>Entre 90 % y 100 %</span><b>{{ sim.medio }}</b></div>
            <div class="cmx-prev-r"><span>Por debajo del 90 %</span><b>{{ sim.abajo }}</b></div>
            <div class="cmx-prev-r is-tot"><span>Costo con esta tabla</span><b>S/ {{ sim.nuevo | appNumber:'1.2-2' }}</b></div>
            @if (sim.nuevo !== sim.actual) {
              <div class="cmx-prev-r"><span>Hoy</span><b>S/ {{ sim.actual | appNumber:'1.2-2' }}</b></div>
            }
          } @else {
            <div class="cmx-prev-r" style="display:block;font-size:.76rem">
              Aparece cuando el período tenga cálculo y {{ esAsesor() ? 'asesores' : 'supervisor' }}.
            </div>
          }
        </div>
        <div class="cmx-warnbox cmx-enter" style="--i:3">
          Base de los montos en soles:
          @if (esAsesor()) {
            meta por asesor, <b class="cmx-num">{{ base() != null ? 'S/ ' + (base() | appNumber:'1.2-2') : 'sin asesores' }}</b>.
          } @else {
            meta completa de la subcartera, <b class="cmx-num">S/ {{ base() | appNumber:'1.2-2' }}</b>.
          }
          Un tramo aplica desde que el cumplimiento llega a su porcentaje; se paga el más alto alcanzado.
        </div>
      </div>
    </div>
  `
})
export class ConfiguracionRolComponent implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  readonly reporte = input.required<ReportePeriodo>();
  readonly rol = input.required<RolComision>();

  readonly rolCambiado = output<RolComision>();
  /** Reporte tras quitar o devolver a alguien (se queda en la configuración) */
  readonly actualizado = output<ReportePeriodo>();
  /** Reporte final tras «Guardar» */
  readonly guardado = output<ReportePeriodo>();

  readonly lados: RolComision[] = ['ASESOR', 'SUPERVISOR'];
  readonly rolInfo = ROL_INFO;

  private readonly seg = viewChild<ElementRef<HTMLElement>>('seg');
  private readonly pill = viewChild<ElementRef<HTMLElement>>('pill');
  private pillListo = false;

  readonly periodo = computed(() => this.reporte().periodo);
  readonly periodoNombre = computed(() => this.periodo().nombreSubcartera);
  readonly esAsesor = computed(() => this.rol() === 'ASESOR');
  readonly otro = computed<RolComision>(() => this.esAsesor() ? 'SUPERVISOR' : 'ASESOR');
  readonly nombreRol = computed(() => this.esAsesor() ? 'asesor' : 'supervisor');
  readonly nombreOtro = computed(() => this.esAsesor() ? 'supervisor' : 'asesor');
  readonly gente = computed(() => this.reporte().participantes.filter(p => p.rol === this.rol()));

  // ---------- Roles ----------
  readonly rolesDisponibles = signal<RolCashi[]>([]);
  readonly cargandoRoles = signal(true);
  readonly busqueda = signal('');
  readonly verTodos = signal(false);
  readonly borradorRoles = signal(new Map<number, RolComision>());

  /** Roles de este lado o libres; los que cuentan del otro lado no aparecen */
  private readonly rolesDelLado = computed(() => {
    const elegidos = this.borradorRoles();
    return this.rolesDisponibles().filter(r => elegidos.get(r.idRol) !== this.otro());
  });

  readonly ocultos = computed(() => this.rolesDisponibles().length - this.rolesDelLado().length);

  readonly rolesVisibles = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const elegidos = this.borradorRoles();
    return this.rolesDelLado().filter(r =>
      texto
        ? r.nombreRol.toLowerCase().includes(texto)
        : this.verTodos() || r.asignadoASubcartera || elegidos.get(r.idRol) === this.rol()
    );
  });

  readonly otrosSinAsignar = computed(() => {
    const elegidos = this.borradorRoles();
    return this.rolesDelLado().filter(r => !r.asignadoASubcartera && elegidos.get(r.idRol) !== this.rol()).length;
  });

  readonly rolesCambiados = computed(() => {
    const guardados = this.periodo().roles;
    const borrador = this.borradorRoles();
    return guardados.length !== borrador.size || guardados.some(r => borrador.get(r.idRol) !== r.rolComision);
  });

  // ---------- Participantes ----------
  readonly cambiandoQuitado = signal<number | null>(null);

  // ---------- Tramos ----------
  private secuencia = 0;
  readonly borradorTramos = signal<TramoBorrador[]>([]);

  /** Sin reordenar mientras se escribe (reordenar movería la fila y se perdería el foco) */
  readonly tramosLado = computed(() => this.borradorTramos().filter(t => t.rol === this.rol()));

  readonly base = computed(() => this.esAsesor()
    ? metaPorAsesor(this.periodo(), this.reporte().participantes)
    : this.periodo().metaGrupal);

  readonly tramosCambiados = computed(() =>
    this.firma(this.periodo().escalas.map(e => ({ rol: e.rol, desde: e.porcentajeDesde, monto: e.montoComision })))
    !== this.firma(this.borradorTramos()));

  private readonly errores = computed(() => {
    const porRol = new Map<RolComision, string[]>([['ASESOR', []], ['SUPERVISOR', []]]);
    for (const rol of this.lados) {
      const lista = porRol.get(rol)!;
      const vistos = new Set<number>();
      for (const t of this.borradorTramos().filter(x => x.rol === rol)) {
        if (t.desde == null || t.desde < 0 || t.desde > 999.99) {
          lista.push('El porcentaje de cada tramo debe estar entre 0 y 999.99.');
        } else if (vistos.has(t.desde)) {
          lista.push(`Hay dos tramos desde ${t.desde} %.`);
        } else {
          vistos.add(t.desde);
        }
        if (t.monto == null || t.monto < 0) {
          lista.push('La comisión de cada tramo debe ser 0 o más.');
        }
      }
    }
    return porRol;
  });

  readonly erroresLado = computed(() => [...new Set(this.errores().get(this.rol()) ?? [])]);
  private readonly hayErrores = computed(() => [...this.errores().values()].some(l => l.length > 0));

  readonly hayCambios = computed(() => this.rolesCambiados() || this.tramosCambiados());
  readonly guardando = signal(false);
  readonly puedeGuardar = computed(() => this.hayCambios() && !this.hayErrores() && !this.guardando());

  /** Cuánto costaría la tabla en edición con el logrado del último cálculo */
  readonly simulacion = computed(() => {
    if (!this.periodo().fechaCalculo) {
      return null;
    }
    const personas = this.gente().filter(p => !p.quitado);
    const base = this.base();
    if (!personas.length || base == null || base <= 0) {
      return null;
    }
    const tramos: EscalaComision[] = this.tramosLado()
      .filter(t => t.desde != null && t.monto != null)
      .map(t => ({ rol: t.rol, porcentajeDesde: t.desde as number, montoComision: t.monto as number }))
      .sort((a, b) => a.porcentajeDesde - b.porcentajeDesde);
    let nuevo = 0;
    let arriba = 0;
    let medio = 0;
    let abajo = 0;
    for (const p of personas) {
      const t = tramoAlcanzado(tramos, p.logrado, base);
      nuevo += t ? t.montoComision : 0;
      const pct = p.logrado / base * 100;
      if (pct >= 100) {
        arriba++;
      } else if (pct >= 90) {
        medio++;
      } else {
        abajo++;
      }
    }
    return { nuevo, actual: personas.reduce((s, p) => s + p.montoComision, 0), arriba, medio, abajo };
  });

  constructor() {
    // Píldora del selector Asesor / Supervisor
    afterRenderEffect(() => {
      this.rol();
      const seg = this.seg()?.nativeElement;
      const pill = this.pill()?.nativeElement;
      const boton = seg?.querySelector<HTMLElement>(`[data-lado="${this.rol()}"]`);
      if (!pill || !boton) {
        return;
      }
      if (!this.pillListo) {
        pill.style.transition = 'none';
      }
      pill.style.transform = `translateX(${boton.offsetLeft}px) scaleX(${boton.offsetWidth})`;
      if (!this.pillListo) {
        void pill.offsetWidth;
        pill.style.transition = '';
        this.pillListo = true;
      }
    });
  }

  ngOnInit(): void {
    const periodo = this.periodo();
    this.borradorRoles.set(new Map(periodo.roles.map(r => [r.idRol, r.rolComision])));
    this.borradorTramos.set(periodo.escalas.map(e => ({ clave: ++this.secuencia, rol: e.rol, desde: e.porcentajeDesde, monto: e.montoComision })));
    this.service.listarRolesDisponibles(periodo.id).subscribe({
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

  cambiarLado(rol: RolComision): void {
    if (rol !== this.rol()) {
      this.busqueda.set('');
      this.verTodos.set(false);
      this.rolCambiado.emit(rol);
    }
  }

  // ==================== ROLES ====================

  marcarRol(idRol: number, marcado: boolean): void {
    const mapa = new Map(this.borradorRoles());
    if (marcado) {
      mapa.set(idRol, this.rol());
    } else {
      mapa.delete(idRol);
    }
    this.borradorRoles.set(mapa);
  }

  // ==================== PARTICIPANTES ====================

  cambiarQuitado(p: ParticipanteComision): void {
    if (this.cambiandoQuitado() != null) {
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

  desdeEnSoles(desde: number | null): number | null {
    const base = this.base();
    return desde == null || base == null ? null : (desde / 100) * base;
  }

  /** El "hasta" es el menor "desde" mayor que el de este tramo */
  hasta(t: TramoBorrador): string {
    if (t.desde == null) {
      return '—';
    }
    const mayores = this.tramosLado()
      .map(x => x.desde)
      .filter((d): d is number => d != null && d > (t.desde as number));
    return mayores.length ? `hasta ${Math.min(...mayores)} %` : 'a más';
  }

  errorTramo(t: TramoBorrador): boolean {
    if (t.desde == null || t.desde < 0 || t.desde > 999.99) {
      return true;
    }
    return this.tramosLado().filter(x => x.desde === t.desde).length > 1;
  }

  editarTramo(clave: number, campo: 'desde' | 'monto', valor: number | string | null): void {
    const numero = valor === '' || valor == null ? null : Number(valor);
    this.borradorTramos.update(lista => lista.map(t => t.clave === clave ? { ...t, [campo]: Number.isNaN(numero) ? null : numero } : t));
  }

  agregarTramo(): void {
    const rol = this.rol();
    const desdes = this.tramosLado().map(t => t.desde).filter((d): d is number => d != null);
    const mayor = desdes.length ? Math.max(...desdes) : null;
    const ultimo = this.tramosLado().find(t => t.desde === mayor);
    const desde = mayor != null ? Math.min(mayor + 10, 999) : 0;
    this.borradorTramos.update(lista => [...lista, { clave: ++this.secuencia, rol, desde, monto: ultimo?.monto ?? 0 }]);
  }

  quitarTramo(clave: number): void {
    this.borradorTramos.update(lista => lista.filter(t => t.clave !== clave));
  }

  // ==================== GUARDAR ====================

  /** Guarda roles y tramos (de los dos lados) si cambiaron. Cada guardado recalcula en el servidor. */
  guardar(): void {
    if (!this.puedeGuardar()) {
      return;
    }
    const id = this.periodo().id;
    const roles: RolElegido[] = [...this.borradorRoles().entries()].map(([idRol, rolComision]) => ({ idRol, rolComision }));
    const tramos: EscalaComision[] = this.borradorTramos().map(t => ({
      rol: t.rol,
      porcentajeDesde: t.desde as number,
      montoComision: t.monto as number
    }));
    const guardarRoles = this.rolesCambiados();
    const guardarTramos = this.tramosCambiados();

    this.guardando.set(true);
    const inicio: Observable<ReportePeriodo | null> = guardarRoles ? this.service.guardarRoles(id, roles) : of(null);
    inicio.pipe(
      concatMap(r => guardarTramos ? this.service.guardarTramos(id, tramos) : of(r as ReportePeriodo))
    ).subscribe({
      next: reporte => {
        this.guardando.set(false);
        this.guardado.emit(reporte);
      },
      error: e => {
        this.guardando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo guardar la configuración.'), 6000);
      }
    });
  }

  private firma(lista: { rol: RolComision; desde: number | null; monto: number | null }[]): string {
    return lista
      .map(t => `${t.rol}|${t.desde}|${t.monto}`)
      .sort()
      .join(';');
  }
}
