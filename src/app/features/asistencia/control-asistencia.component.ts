import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { Justificacion } from './asistencia.models';
import { hoy, lunesDe, sumarDias } from './asistencia.estilos';
import { CABECERA, CABECERA_TEXTO, CAMPO, ETIQUETA, FILTROS, LISTA, PANTALLA, SUBTITULO, TITULO } from './ui/clases';
import { MINI_ICONO } from './ui/ficha-clases';
import { SegmentadoComponent } from './ui/segmentado.component';
import { rangoSemana } from './ui/control-comun';
import { ControlReporteComponent } from './control-reporte.component';
import { ControlSolicitudesComponent } from './control-solicitudes.component';
import { ControlRecuperacionesComponent } from './control-recuperaciones.component';
import { ControlCierreComponent } from './control-cierre.component';
import { ControlAuditoriaComponent } from './control-auditoria.component';
import { ControlConfiguracionComponent } from './control-configuracion.component';

type Pestana = 'reporte' | 'dashboard' | 'solicitudes' | 'horario' | 'cierre' | 'auditoria' | 'config';

/**
 * Control de asistencia: la pantalla de RR.HH.
 *
 * Arriba, el ámbito (Cliente › Cartera › Subcartera) y las pestañas; la semana, en las que son de una
 * semana. Cada pestaña pinta esta cabecera dentro de su tarjeta y es dueña de su tabla, su columna y su
 * barra de abajo. El Dashboard se ve, con «Pronto», pero todavía no se abre.
 */
@Component({
  selector: 'app-control-asistencia',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [NgTemplateOutlet, LucideAngularModule, NombrePropioPipe, SegmentadoComponent, ControlReporteComponent, ControlSolicitudesComponent,
            ControlRecuperacionesComponent, ControlCierreComponent, ControlAuditoriaComponent, ControlConfiguracionComponent],
  template: `
    <ng-template #cabecera>
      <div [class]="CABECERA">
        <div [class]="CABECERA_TEXTO">
          <p role="heading" aria-level="1" [class]="TITULO">Control de asistencia</p>
          <p [class]="SUBTITULO">{{ subtitulo() }}</p>
        </div>
        <div [class]="FILTROS">
          <div [class]="CAMPO">
            <label for="ca-cli" [class]="ETIQUETA">Cliente</label>
            <select id="ca-cli" [class]="LISTA" (change)="elegirCliente(+$any($event.target).value || null)">
              <option value="" [selected]="!idCliente()">Todos</option>
              @for (c of clientes(); track c.id) { <option [value]="c.id" [selected]="c.id === idCliente()">{{ c.tenantName || c.businessName }}</option> }
            </select>
          </div>
          <div [class]="CAMPO">
            <label for="ca-car" [class]="ETIQUETA">Cartera</label>
            <select id="ca-car" [class]="LISTA" (change)="elegirCartera(+$any($event.target).value || null)">
              <option value="" [selected]="!idCartera()">Todas</option>
              @for (c of carteras(); track c.id) { <option [value]="c.id" [selected]="c.id === idCartera()">{{ c.portfolioName | nombrePropio }}</option> }
            </select>
          </div>
          <div [class]="CAMPO">
            <label for="ca-sub" [class]="ETIQUETA">Subcartera</label>
            <select id="ca-sub" [class]="LISTA" (change)="elegirSubcartera(+$any($event.target).value || null)">
              <option value="" [selected]="!idSubcartera()">Todas</option>
              @for (s of subcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === idSubcartera()">{{ s.subPortfolioName | nombrePropio }}</option> }
            </select>
          </div>
        </div>
      </div>

      @if (!(pestana() === 'reporte' && detalle())) {
        <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
          <app-segmentado [opciones]="opciones()" [valor]="pestana()" (cambiar)="pestana.set($any($event))" />
          @if (pestana() === 'reporte' || pestana() === 'cierre') {
            <div class="ml-auto flex flex-none items-center gap-[.375rem]">
              <button type="button" [class]="MINI_ICONO" (click)="moverSemana(-7)" aria-label="Semana anterior">
                <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
              </button>
              <span class="min-w-[9.5rem] text-center text-[.875rem] font-semibold">{{ rango() }}</span>
              <button type="button" [class]="MINI_ICONO" (click)="moverSemana(7)" [disabled]="esSemanaActual()" aria-label="Semana siguiente">
                <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
              </button>
            </div>
          }
        </div>
      }
    </ng-template>

    @switch (pestana()) {
      @case ('reporte') {
        <app-control-reporte [abrirAl]="personaReporte()" [cabecera]="cabecera" [ambito]="ambito()" [subcartera]="nombreSubcartera()" [lunes]="lunes()" (detalle)="detalle.set($event)" />
      }
      @case ('solicitudes') {
        <app-control-solicitudes [cabecera]="cabecera" [ambito]="ambito()" [subcartera]="nombreSubcartera()" [lunes]="lunes()" (cambio)="cargarPorAprobar()" />
      }
      @case ('horario') {
        <app-control-recuperaciones [cabecera]="cabecera" [ambito]="ambito()" [subcartera]="nombreSubcartera()" [lunes]="lunes()" (semana)="semanaRecuperaciones.set($event)"
                                    (irA)="irAConfiguracion($event)" />
      }
      @case ('cierre') {
        <app-control-cierre [cabecera]="cabecera" [ambito]="ambito()" [subcartera]="nombreSubcartera()" [lunes]="lunes()" (irA)="pestana.set($any($event))" (abrirPersona)="abrirEnReporte($event)" />
      }
      @case ('auditoria') {
        <app-control-auditoria [cabecera]="cabecera" [ambito]="ambito()" [subcartera]="nombreSubcartera()" [lunes]="lunes()" />
      }
      @case ('config') {
        <app-control-configuracion [clientes]="nombresClientes()" [cabecera]="cabecera" [ambito]="ambito()" [subcartera]="nombreSubcartera()" [lunes]="lunes()" [seccionInicial]="seccionConfig()" />
      }
    }
  `
})
export class ControlAsistenciaComponent implements OnInit {
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly CABECERA = CABECERA; protected readonly CABECERA_TEXTO = CABECERA_TEXTO; protected readonly TITULO = TITULO;
  protected readonly SUBTITULO = SUBTITULO; protected readonly FILTROS = FILTROS; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA;
  protected readonly LISTA = LISTA; protected readonly MINI_ICONO = MINI_ICONO;

  readonly pestana = signal<Pestana>('reporte');
  /** El Reporte con una persona abierta: su detalle ocupa el lugar de las pestañas. */
  readonly detalle = signal(false);
  /** Configuración puede abrirse en una sección (desde Recuperaciones, en el horario base). */
  readonly seccionConfig = signal<string | null>(null);
  /** La persona que se abre al entrar al Reporte (desde el Cierre, para corregir sus marcas). */
  readonly personaReporte = signal<number | null>(null);
  /** La semana que muestra Recuperaciones: la dice la cabecera. */
  readonly semanaRecuperaciones = signal<string | null>(null);

  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);

  /** La semana a la vista: de lunes a sábado. Arranca en la que corre; la siguiente no se mira. */
  readonly lunes = signal(lunesDe(new Date()));
  readonly esSemanaActual = computed(() => this.lunes() >= lunesDe(new Date()));
  readonly rango = computed(() => rangoSemana(this.lunes(), sumarDias));

  /** Lo que espera a RR.HH.: el número de la pestaña, aunque no se haya abierto. */
  private readonly porAprobar = signal<Justificacion[]>([]);

  readonly opciones = computed(() => [
    { clave: 'reporte', texto: 'Reporte' },
    { clave: 'dashboard', texto: 'Dashboard', pronto: true },
    { clave: 'solicitudes', texto: 'Solicitudes', n: this.porAprobar().length || null },
    { clave: 'horario', texto: 'Recuperaciones' },
    { clave: 'cierre', texto: 'Cierre semanal' },
    { clave: 'auditoria', texto: 'Auditoría' },
    { clave: 'config', texto: 'Configuración' }
  ]);

  readonly subtitulo = computed(() => {
    switch (this.pestana()) {
      case 'solicitudes': return 'Aprobación de RR.HH.';
      case 'horario': return 'Recuperaciones de la semana del ' + rangoSemana(this.semanaRecuperaciones() ?? sumarDias(lunesDe(new Date()), 7), sumarDias);
      case 'auditoria': return 'Historial de cambios';
      case 'config': return 'Reglas, horario y calendario';
      default: return 'Semana del ' + this.rango();
    }
  });

  readonly nombresClientes = computed(() => Object.fromEntries(this.clientes().map(c => [c.id, c.tenantName || c.businessName])));
  readonly nombreSubcartera = computed(() => this.subcarteras().find(s => s.id === this.idSubcartera())?.subPortfolioName ?? null);

  /** El ámbito elegido, para todas las pestañas. */
  readonly ambito = computed(() => ({ idCliente: this.idCliente(), idCartera: this.idCartera(), idSubcartera: this.idSubcartera() }));

  ngOnInit(): void {
    this.cargarPorAprobar();
    // Sin filtrar por `isActive`: Financiera Oh y varias de sus carteras están inactivas en QAS.
    this.clientesServicio.getAllTenants().subscribe({
      next: c => this.clientes.set([...c].sort((a, b) => (a.tenantName || a.businessName).localeCompare(b.tenantName || b.businessName))),
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  /** Lo que espera a RR.HH., de tres meses atrás a dos adelante: lo mismo que lista la pestaña. */
  cargarPorAprobar(): void {
    this.servicio.justificaciones(sumarDias(hoy(), -90), sumarDias(hoy(), 60), ['REVISADA']).subscribe({
      next: j => this.porAprobar.set(j),
      error: () => this.porAprobar.set([])
    });
  }

  abrirEnReporte(id: number): void {
    this.personaReporte.set(id);
    this.pestana.set('reporte');
  }

  irAConfiguracion(seccion: string): void {
    this.seccionConfig.set(seccion);
    this.pestana.set('config');
  }

  moverSemana(dias: number): void {
    const lunes = sumarDias(this.lunes(), dias), actual = lunesDe(new Date());
    this.lunes.set(lunes > actual ? actual : lunes);
  }

  // ---------- Ámbito ----------

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    if (!id) return;
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const ordenadas = [...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.carteras.set(ordenadas);
        if (ordenadas.length === 1) this.elegirCartera(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    if (!id) return;
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(ordenadas);
        if (ordenadas.length === 1) this.elegirSubcartera(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
  }
}
