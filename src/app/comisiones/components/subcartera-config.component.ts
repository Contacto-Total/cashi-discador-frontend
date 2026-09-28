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
import { AppDateTimePipe } from '@/shared/pipes/format.pipes';
import { ToastService } from '@/shared/services/toast.service';
import { ComisionesService } from '../services/comisiones.service';
import {
  Cartera,
  DivisionMeta,
  EscalaComision,
  ExcluidoComision,
  Inquilino,
  PlantillaSubcartera,
  RolCashi,
  RolComision,
  Subcartera,
  TipoMetrica,
  UsuarioCashi
} from '../models/comision.model';
import { ESTADO_INFO, METRICA_INFO, ROL_INFO, mensajeError, nombreMes } from '../comisiones.util';
import { CmxIconComponent } from './cmx-icon.component';

interface TramoBorrador {
  clave: number;
  rol: RolComision;
  desde: number | null;
  monto: number | null;
}

/**
 * Configuración de comisiones de una subcartera (plantilla): métrica, roles y tramos de cada lado,
 * entre cuántos asesores se divide la meta y usuarios excluidos. Se copia a cada período nuevo; con
 * «Aplicar también al período en curso», se copia además al período en curso y se recalcula.
 */
@Component({
  selector: 'cmx-subcartera-config',
  standalone: true,
  imports: [FormsModule, AppDateTimePipe, CmxIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cmx-app">
      <!-- ============ CONTEXTO ============ -->
      <div class="cmx-ctx">
        <span class="cmx-mark" aria-hidden="true"></span>
        <h1 class="cmx-crumb">
          <button type="button" (click)="volver.emit()">Comisiones</button>
          <span class="cmx-sep">/</span>Configurar subcartera
        </h1>
        @if (plantilla(); as pl) {
          <span class="cmx-chip"><i>Subcartera</i>{{ pl.nombreSubcartera }}</span>
        }
        <span class="cmx-right">
          <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="guardando()" (click)="volver.emit()">Cancelar</button>
          <button type="button" class="cmx-btn cmx-btn-act" [disabled]="!puedeGuardar()" (click)="guardar()">
            @if (guardando()) { <cmx-icon name="refresh" [size]="15" class="cmx-spin" /> Guardando… }
            @else { <cmx-icon name="check" [size]="15" /> Guardar configuración }
          </button>
        </span>
      </div>

      <div class="cmx-banner is-info cmx-enter">
        <span class="cmx-banner-ic" aria-hidden="true">i</span>
        <span>Esta es la <b>plantilla de la subcartera</b>: se copia a cada período nuevo. Los períodos que ya existen no
          cambian, salvo el que está en curso si marcas «Aplicar también al período en curso».</span>
      </div>

      <div class="cmx-cfg">
        <div>
          <!-- ============ SUBCARTERA ============ -->
          <section class="cmx-card cmx-enter" aria-labelledby="cmx-sc-sub">
            <div class="cmx-card-h">
              <h2 id="cmx-sc-sub" style="font-size:.85rem;font-weight:700">Subcartera</h2>
              <em>la configuración es de una subcartera, no de un mes</em>
            </div>
            <div class="cmx-card-b">
              <div class="cmx-grid3">
                <div class="cmx-field">
                  <label for="cmx-sc-prov">Proveedor</label>
                  <select id="cmx-sc-prov" [ngModel]="idInquilino()" (ngModelChange)="elegirInquilino($event)">
                    <option [ngValue]="null">Elige un proveedor</option>
                    @for (i of inquilinos(); track i.id) { <option [ngValue]="i.id">{{ i.nombreInquilino }}</option> }
                  </select>
                </div>
                <div class="cmx-field">
                  <label for="cmx-sc-car">Cartera</label>
                  <select id="cmx-sc-car" [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)" [disabled]="!carteras().length">
                    <option [ngValue]="null">{{ idInquilino() ? 'Elige una cartera' : 'Primero el proveedor' }}</option>
                    @for (c of carteras(); track c.id) { <option [ngValue]="c.id">{{ c.nombreCartera }}</option> }
                  </select>
                </div>
                <div class="cmx-field">
                  <label for="cmx-sc-sub-sel">Subcartera</label>
                  <select id="cmx-sc-sub-sel" [ngModel]="idSubcartera()" (ngModelChange)="elegirSubcartera($event)" [disabled]="!subcarteras().length">
                    <option [ngValue]="null">{{ idCartera() ? 'Elige una subcartera' : 'Primero la cartera' }}</option>
                    @for (s of subcarteras(); track s.id) { <option [ngValue]="s.id">{{ s.nombreSubcartera }}</option> }
                  </select>
                </div>
              </div>
              @if (plantilla(); as pl) {
                <div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center">
                  @if (pl.existe) {
                    <span class="cmx-tag cmx-tag-d">Tiene configuración</span>
                    @if (pl.actualizadoPorNombre) {
                      <span class="cmx-rule-desc" style="margin:0">Última modificación: {{ pl.actualizadoPorNombre }} · {{ pl.fechaActualizacion | appDateTime }}</span>
                    }
                  } @else {
                    <span class="cmx-tag cmx-tag-v">Sin configuración</span>
                    <span class="cmx-rule-desc" style="margin:0">
                      {{ pl.periodos.length ? 'Abajo está lo de su último período: revísalo y guárdalo para crearla.' : 'Todavía no tiene períodos: arma la configuración desde cero.' }}
                    </span>
                  }
                </div>
              }
            </div>
          </section>

          @if (cargando()) {
            <div style="display:grid;gap:12px;margin-top:16px">
              @for (i of [1, 2, 3]; track i) { <div class="cmx-skel" style="height:90px"></div> }
            </div>
          } @else if (plantilla()) {
            <!-- ============ MÉTRICA ============ -->
            <section class="cmx-card cmx-enter" style="--i:1" aria-labelledby="cmx-sc-met">
              <div class="cmx-card-h"><h2 id="cmx-sc-met" style="font-size:.85rem;font-weight:700">Se mide por</h2></div>
              <div class="cmx-card-b">
                <div class="cmx-grid2" role="radiogroup" aria-labelledby="cmx-sc-met">
                  @for (t of metricas; track t) {
                    <button type="button" class="cmx-metric" role="radio" [attr.aria-checked]="tipo() === t" (click)="tipo.set(t)">
                      <b>{{ metricaInfo[t].etiqueta }}</b>
                      <span>{{ metricaInfo[t].descripcion }}</span>
                    </button>
                  }
                </div>
              </div>
            </section>

            <!-- ============ DIVISIÓN DE LA META ============ -->
            <section class="cmx-card cmx-enter" style="--i:2" aria-labelledby="cmx-sc-div">
              <div class="cmx-card-h"><h2 id="cmx-sc-div" style="font-size:.85rem;font-weight:700">Asesores que dividen la meta</h2></div>
              <div class="cmx-card-b" role="radiogroup" aria-labelledby="cmx-sc-div">
                <label class="cmx-opt">
                  <input type="radio" name="cmx-sc-division" value="AUTO" [checked]="division() === 'AUTO'" (change)="division.set('AUTO')" />
                  <span>
                    <b>Automático</b>
                    <span>Los asesores del período que no estén quitados.</span>
                  </span>
                </label>
                <label class="cmx-opt">
                  <input type="radio" name="cmx-sc-division" value="FIJO" [checked]="division() === 'FIJO'" (change)="division.set('FIJO')" />
                  <span>
                    <b>Número fijo</b>
                    <span>Para cuando la meta se reparte entre más (o menos) asesores de los que hay en la lista.</span>
                    <input id="cmx-sc-fijos" class="cmx-opt-num" type="number" min="1" max="999" step="1"
                           [disabled]="division() !== 'FIJO'" aria-label="Asesores fijos que dividen la meta"
                           [ngModel]="fijos()" (ngModelChange)="cambiarFijos($event)" />
                  </span>
                </label>
                @if (division() === 'FIJO' && !fijosValido()) {
                  <ul class="cmx-errors" role="alert"><li>Indica un número de asesores entre 1 y 999.</li></ul>
                }
                <div class="cmx-hint">El supervisor siempre se mide contra la meta completa de la subcartera.</div>
              </div>
            </section>

            <!-- ============ EXCLUIDOS ============ -->
            <section class="cmx-card cmx-enter" style="--i:3" aria-labelledby="cmx-sc-exc">
              <div class="cmx-card-h">
                <h2 id="cmx-sc-exc" style="font-size:.85rem;font-weight:700">Usuarios excluidos</h2>
                <em>sus promesas y pagos no comisionan en esta subcartera</em>
              </div>
              <div class="cmx-card-b">
                <div class="cmx-xchips">
                  @for (u of plantilla()!.excluidosSistema; track u.idUsuario) {
                    <span class="cmx-xchip is-fixed">{{ u.nombre }} <small>{{ u.idUsuario }}</small></span>
                  }
                  @for (u of excluidos(); track u.idUsuario) {
                    <span class="cmx-xchip">
                      {{ u.nombre }} <small>{{ u.idUsuario }}</small>
                      <button type="button" (click)="quitarExcluido(u.idUsuario)" [attr.aria-label]="'Quitar a ' + u.nombre + ' de los excluidos'">
                        <cmx-icon name="x" [size]="11" [stroke]="2" />
                      </button>
                    </span>
                  }
                </div>
                <div class="cmx-addrow">
                  <select id="cmx-sc-user" aria-label="Usuario a excluir" [ngModel]="usuarioElegido()" (ngModelChange)="usuarioElegido.set($event)">
                    <option [ngValue]="null">{{ usuariosLibres().length ? 'Elige un usuario' : 'No hay más usuarios' }}</option>
                    @for (u of usuariosLibres(); track u.idUsuario) { <option [ngValue]="u.idUsuario">{{ u.nombre }} · {{ u.idUsuario }}</option> }
                  </select>
                  <button type="button" class="cmx-btn cmx-btn-sec" [disabled]="usuarioElegido() == null" (click)="agregarExcluido()">
                    <cmx-icon name="plus" [size]="15" /> Excluir
                  </button>
                </div>
                <div class="cmx-hint">Los de sistema no se pueden quitar. Un pago de un usuario excluido aparece en el sustento como «Usuario excluido».</div>
              </div>
            </section>

            <!-- ============ LADO ============ -->
            <div class="cmx-enter" style="--i:4;margin:18px 0 12px;display:flex;flex-wrap:wrap;align-items:center;gap:12px">
              <div class="cmx-segctl" role="group" aria-label="Qué lado se configura" #seg>
                <span class="cmx-segctl-pill" aria-hidden="true" #pill></span>
                @for (r of lados; track r) {
                  <button type="button" [attr.aria-pressed]="lado() === r" [attr.data-lado]="r" (click)="lado.set(r)">{{ rolInfo[r] }}</button>
                }
              </div>
              <span style="font-size:.78rem;color:var(--cmx-ink-3)">Roles y tabla comisional por defecto del {{ nombreLado() }}.</span>
            </div>

            <!-- ============ ROLES ============ -->
            <section class="cmx-card cmx-enter" style="--i:5" aria-labelledby="cmx-sc-roles">
              <div class="cmx-card-h">
                <h2 id="cmx-sc-roles" style="font-size:.85rem;font-weight:700">Roles de Cashi que cuentan como {{ nombreLado() }}</h2>
                @if (ocultos()) { <em>no aparecen los {{ ocultos() }} que ya cuentan como {{ nombreOtro() }}</em> }
              </div>
              <div class="cmx-card-b">
                <label class="cmx-search">
                  <span class="sr-only">Buscar rol</span>
                  <span class="cmx-search-ic"><cmx-icon name="search" [size]="15" /></span>
                  <input type="search" placeholder="Buscar rol" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
                </label>
                @for (r of rolesVisibles(); track r.idRol) {
                  <div class="cmx-rolrow">
                    <label>
                      <input type="checkbox" [checked]="borradorRoles().get(r.idRol) === lado()" (change)="marcarRol(r.idRol, $any($event.target).checked)" />
                      {{ r.nombreRol }}
                    </label>
                    @if (r.asignadoASubcartera) {
                      <span class="cmx-tag cmx-tag-d">asignado a la subcartera</span>
                    } @else {
                      <span class="cmx-tag cmx-tag-s">otra subcartera</span>
                    }
                  </div>
                } @empty {
                  <p class="cmx-rule-desc" style="padding:8px 0">{{ busqueda() ? 'Ningún rol coincide con la búsqueda.' : 'No hay roles asignados a esta subcartera.' }}</p>
                }
                @if (!verTodos() && !busqueda() && otrosSinAsignar()) {
                  <button type="button" class="cmx-btn cmx-btn-link" style="margin-top:6px" (click)="verTodos.set(true)">
                    Mostrar los {{ otrosSinAsignar() }} roles de otras subcarteras
                  </button>
                }
              </div>
            </section>

            <!-- ============ TRAMOS ============ -->
            <section class="cmx-card cmx-enter" style="--i:6" aria-labelledby="cmx-sc-tramos">
              <div class="cmx-card-h">
                <h2 id="cmx-sc-tramos" style="font-size:.85rem;font-weight:700">Tabla comisional del {{ nombreLado() }}</h2>
                <em>porcentaje de cumplimiento → comisión en soles</em>
              </div>
              <div class="cmx-card-b">
                @for (t of tramosLado(); track t.clave; let i = $index) {
                  <div class="cmx-trow">
                    desde
                    <input type="number" min="0" max="999.99" step="0.01" [class.is-invalid]="errorTramo(t)"
                           [attr.aria-label]="'Desde, en porcentaje, tramo ' + (i + 1)"
                           [ngModel]="t.desde" (ngModelChange)="editarTramo(t.clave, 'desde', $event)" /> %
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
          }
        </div>

        <!-- ============ COLUMNA DERECHA ============ -->
        <div>
          <div class="cmx-prev cmx-enter" style="--i:2">
            <div class="cmx-prev-t">Cómo se usa</div>
            <div class="cmx-prev-r" style="display:block;font-size:.78rem">
              Al crear un período de la subcartera se copian la métrica, los roles, las dos tablas comisionales, la división
              de la meta y los excluidos.
            </div>
            <div class="cmx-prev-r" style="display:block;font-size:.78rem;padding-top:6px">
              Sin configuración, el período nuevo se copia del mes anterior, como hasta ahora.
            </div>
          </div>

          @if (plantilla(); as pl) {
            <section class="cmx-card cmx-enter" style="--i:3;margin-top:12px" aria-labelledby="cmx-sc-per">
              <div class="cmx-card-h"><h2 id="cmx-sc-per" style="font-size:.85rem;font-weight:700">Períodos de esta subcartera</h2></div>
              <div class="cmx-card-b">
                @if (pl.periodos.length) {
                  <div class="cmx-uses">
                    @for (p of pl.periodos.slice(0, 6); track p.id) {
                      <div>
                        <span>{{ nombreMes(p.mes) }} {{ p.anio }}</span>
                        <span [class]="'cmx-state ' + estadoInfo[p.estado].clase">{{ estadoInfo[p.estado].etiqueta }}</span>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="cmx-rule-desc">Todavía no tiene períodos.</p>
                }
                @if (enCurso().length) {
                  <label class="cmx-rolrow" style="margin-top:10px;border-top:1px dashed var(--cmx-line);border-bottom:0">
                    <input type="checkbox" id="cmx-sc-aplicar" [checked]="aplicar()" (change)="aplicar.set($any($event.target).checked)" />
                    Aplicar también a {{ enCursoTexto() }} (en curso): se recalcula al guardar
                  </label>
                }
              </div>
            </section>
            <div class="cmx-warnbox cmx-enter" style="--i:4">
              Los períodos en revisión, revisados o aprobados no cambian. La configuración solo mira hacia adelante.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class SubcarteraConfigComponent implements OnInit {
  private readonly service = inject(ComisionesService);
  private readonly toast = inject(ToastService);

  /** Subcartera con la que se abre (por ejemplo, la del último período visto) */
  readonly idSubcarteraInicial = input<number | null>(null);

  readonly volver = output<void>();
  readonly guardado = output<PlantillaSubcartera>();

  readonly lados: RolComision[] = ['ASESOR', 'SUPERVISOR'];
  readonly metricas: TipoMetrica[] = ['RECAUDO', 'CONTENCION'];
  readonly rolInfo = ROL_INFO;
  readonly metricaInfo = METRICA_INFO;
  readonly estadoInfo = ESTADO_INFO;
  readonly nombreMes = nombreMes;

  // ---------- Selección de subcartera ----------
  readonly inquilinos = signal<Inquilino[]>([]);
  readonly carteras = signal<Cartera[]>([]);
  readonly subcarteras = signal<Subcartera[]>([]);
  readonly idInquilino = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);

  // ---------- Plantilla ----------
  readonly plantilla = signal<PlantillaSubcartera | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly tipo = signal<TipoMetrica>('RECAUDO');
  readonly division = signal<DivisionMeta>('AUTO');
  readonly fijos = signal<number | null>(null);
  readonly excluidos = signal<ExcluidoComision[]>([]);
  readonly usuarios = signal<UsuarioCashi[]>([]);
  readonly usuarioElegido = signal<number | null>(null);
  readonly aplicar = signal(true);

  readonly enCurso = computed(() => (this.plantilla()?.periodos ?? []).filter(p => p.estado === 'EN_CURSO'));
  readonly enCursoTexto = computed(() => this.enCurso().map(p => `${nombreMes(p.mes).toLowerCase()} ${p.anio}`).join(' y '));

  readonly usuariosLibres = computed(() => {
    const ya = new Set(this.excluidos().map(e => e.idUsuario));
    return this.usuarios().filter(u => !ya.has(u.idUsuario));
  });

  // ---------- Lado, roles y tramos ----------
  private readonly seg = viewChild<ElementRef<HTMLElement>>('seg');
  private readonly pill = viewChild<ElementRef<HTMLElement>>('pill');
  private pillListo = false;
  private secuencia = 0;

  readonly lado = signal<RolComision>('ASESOR');
  readonly nombreLado = computed(() => this.lado() === 'ASESOR' ? 'asesor' : 'supervisor');
  readonly nombreOtro = computed(() => this.lado() === 'ASESOR' ? 'supervisor' : 'asesor');
  private readonly otro = computed<RolComision>(() => this.lado() === 'ASESOR' ? 'SUPERVISOR' : 'ASESOR');

  readonly rolesDisponibles = signal<RolCashi[]>([]);
  readonly borradorRoles = signal(new Map<number, RolComision>());
  readonly busqueda = signal('');
  readonly verTodos = signal(false);

  private readonly rolesDelLado = computed(() => {
    const elegidos = this.borradorRoles();
    return this.rolesDisponibles().filter(r => elegidos.get(r.idRol) !== this.otro());
  });
  readonly ocultos = computed(() => this.rolesDisponibles().length - this.rolesDelLado().length);
  readonly rolesVisibles = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const elegidos = this.borradorRoles();
    return this.rolesDelLado().filter(r =>
      texto ? r.nombreRol.toLowerCase().includes(texto)
        : this.verTodos() || r.asignadoASubcartera || elegidos.get(r.idRol) === this.lado());
  });
  readonly otrosSinAsignar = computed(() => {
    const elegidos = this.borradorRoles();
    return this.rolesDelLado().filter(r => !r.asignadoASubcartera && elegidos.get(r.idRol) !== this.lado()).length;
  });

  readonly borradorTramos = signal<TramoBorrador[]>([]);
  readonly tramosLado = computed(() => this.borradorTramos().filter(t => t.rol === this.lado()));

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
  readonly erroresLado = computed(() => [...new Set(this.errores().get(this.lado()) ?? [])]);
  readonly fijosValido = computed(() => {
    const n = this.fijos();
    return n != null && Number.isInteger(n) && n >= 1 && n <= 999;
  });
  readonly puedeGuardar = computed(() =>
    !!this.plantilla() && !this.guardando() && !this.cargando()
    && ![...this.errores().values()].some(l => l.length > 0)
    && (this.division() === 'AUTO' || this.fijosValido()));

  constructor() {
    // Píldora del selector Asesor / Supervisor
    afterRenderEffect(() => {
      this.lado();
      this.plantilla();
      const seg = this.seg()?.nativeElement;
      const pill = this.pill()?.nativeElement;
      const boton = seg?.querySelector<HTMLElement>(`[data-lado="${this.lado()}"]`);
      if (!pill || !boton) {
        this.pillListo = false;
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
    this.service.obtenerInquilinos().subscribe({
      next: data => this.inquilinos.set(data),
      error: e => this.toast.error(mensajeError(e, 'No se pudieron cargar los proveedores.'))
    });
    const inicial = this.idSubcarteraInicial();
    if (inicial != null) {
      this.service.obtenerJerarquiaSubcartera(inicial).subscribe({
        next: j => {
          this.elegirInquilino(j.idInquilino, j.idCartera, inicial);
        }
      });
    }
  }

  // ==================== SELECCIÓN ====================

  elegirInquilino(id: number | null, idCartera: number | null = null, idSubcartera: number | null = null): void {
    this.idInquilino.set(id);
    this.idCartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.elegirSubcartera(null);
    if (id != null) {
      this.service.obtenerCarteras(id).subscribe({
        next: data => {
          this.carteras.set(data);
          if (idCartera != null) {
            this.elegirCartera(idCartera, idSubcartera);
          }
        }
      });
    }
  }

  elegirCartera(id: number | null, idSubcartera: number | null = null): void {
    this.idCartera.set(id);
    this.subcarteras.set([]);
    this.elegirSubcartera(null);
    if (id != null) {
      this.service.obtenerSubcarteras(id).subscribe({
        next: data => {
          this.subcarteras.set(data);
          if (idSubcartera != null) {
            this.elegirSubcartera(idSubcartera);
          }
        }
      });
    }
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.plantilla.set(null);
    if (id == null) {
      return;
    }
    this.cargando.set(true);
    this.service.obtenerPlantilla(id).subscribe({
      next: pl => {
        this.cargar(pl);
        this.cargando.set(false);
      },
      error: e => {
        this.cargando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo cargar la configuración de la subcartera.'));
      }
    });
    this.service.listarRolesSubcartera(id).subscribe({ next: roles => this.rolesDisponibles.set(roles) });
    this.service.listarUsuariosSubcartera(id).subscribe({ next: usuarios => this.usuarios.set(usuarios) });
  }

  private cargar(pl: PlantillaSubcartera): void {
    this.plantilla.set(pl);
    this.tipo.set(pl.tipoMetrica);
    this.division.set(pl.divisionMeta ?? 'AUTO');
    this.fijos.set(pl.asesoresFijos);
    this.excluidos.set([...pl.excluidos]);
    this.borradorRoles.set(new Map(pl.roles.map(r => [r.idRol, r.rolComision])));
    this.borradorTramos.set(pl.escalas.map(e => ({ clave: ++this.secuencia, rol: e.rol, desde: e.porcentajeDesde, monto: e.montoComision })));
    this.aplicar.set(true);
    this.busqueda.set('');
    this.verTodos.set(false);
    this.usuarioElegido.set(null);
  }

  cambiarFijos(valor: number | string | null): void {
    const n = valor === '' || valor == null ? null : Number(valor);
    this.fijos.set(n == null || Number.isNaN(n) ? null : n);
  }

  // ==================== EXCLUIDOS ====================

  agregarExcluido(): void {
    const id = this.usuarioElegido();
    const u = this.usuarios().find(x => x.idUsuario === id);
    if (!u) {
      return;
    }
    this.excluidos.update(lista => [...lista, { idUsuario: u.idUsuario, nombre: u.nombre }]);
    this.usuarioElegido.set(null);
  }

  quitarExcluido(idUsuario: number): void {
    this.excluidos.update(lista => lista.filter(e => e.idUsuario !== idUsuario));
  }

  // ==================== ROLES Y TRAMOS ====================

  marcarRol(idRol: number, marcado: boolean): void {
    const mapa = new Map(this.borradorRoles());
    if (marcado) {
      mapa.set(idRol, this.lado());
    } else {
      mapa.delete(idRol);
    }
    this.borradorRoles.set(mapa);
  }

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
    const rol = this.lado();
    const desdes = this.tramosLado().map(t => t.desde).filter((d): d is number => d != null);
    const mayor = desdes.length ? Math.max(...desdes) : null;
    const ultimo = this.tramosLado().find(t => t.desde === mayor);
    this.borradorTramos.update(lista => [...lista, {
      clave: ++this.secuencia,
      rol,
      desde: mayor != null ? Math.min(mayor + 10, 999) : 0,
      monto: ultimo?.monto ?? 0
    }]);
  }

  quitarTramo(clave: number): void {
    this.borradorTramos.update(lista => lista.filter(t => t.clave !== clave));
  }

  // ==================== GUARDAR ====================

  guardar(): void {
    const id = this.idSubcartera();
    if (id == null || !this.puedeGuardar()) {
      return;
    }
    const escalas: EscalaComision[] = this.borradorTramos().map(t => ({
      rol: t.rol,
      porcentajeDesde: t.desde as number,
      montoComision: t.monto as number
    }));
    this.guardando.set(true);
    this.service.guardarPlantilla(id, {
      tipoMetrica: this.tipo(),
      divisionMeta: this.division(),
      asesoresFijos: this.division() === 'FIJO' ? this.fijos() : null,
      escalas,
      roles: [...this.borradorRoles().entries()].map(([idRol, rolComision]) => ({ idRol, rolComision })),
      excluidos: this.excluidos(),
      aplicarEnCurso: this.enCurso().length > 0 && this.aplicar()
    }).subscribe({
      next: pl => {
        this.guardando.set(false);
        const aplicado = this.enCurso().length > 0 && this.aplicar();
        this.toast.success(aplicado
          ? `Configuración de ${pl.nombreSubcartera} guardada. ${this.enCursoTexto()} se recalculó con ella.`
          : `Configuración de ${pl.nombreSubcartera} guardada. Se usará desde el próximo período.`);
        this.guardado.emit(pl);
      },
      error: e => {
        this.guardando.set(false);
        this.toast.error(mensajeError(e, 'No se pudo guardar la configuración.'), 6000);
      }
    });
  }
}
