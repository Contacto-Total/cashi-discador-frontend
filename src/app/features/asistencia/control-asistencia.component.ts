import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaReporte } from './asistencia.models';
import { ESTILOS, semanaPorDefecto, sumarDias } from './asistencia.estilos';
import { AsistenciaReporteComponent } from './asistencia-reporte.component';
import { AsistenciaDashboardComponent } from './asistencia-dashboard.component';
import { AsistenciaJustificacionesComponent } from './asistencia-justificaciones.component';
import { AsistenciaCierreComponent } from './asistencia-cierre.component';
import { AsistenciaAuditoriaComponent } from './asistencia-auditoria.component';
import { AsistenciaConfiguracionComponent } from './asistencia-configuracion.component';
import { AsistenciaEdicionComponent } from './asistencia-edicion.component';

/**
 * Control de Asistencia: el módulo de RR.HH. y las supervisoras.
 *
 * El ámbito, el rango y el agente viven aquí y no en cada pestaña: son los
 * mismos para todas y, repetidos, se desincronizan en cuanto alguien cambia de
 * tab. Cada pestaña los recibe como entrada y vuelve a pedir sus datos sola.
 *
 * El ámbito es una cascada de tres —cliente › cartera › subcartera— porque así
 * es como está montada la operación y como se busca una cartera. Sin
 * subcartera elegida no se consulta nada: traer a toda la empresa de golpe
 * hace lenta la pantalla que más se abre, y nadie revisa la asistencia de una
 * empresa entera a la vez.
 *
 * Configuración y Editar horas son BOTONES y no pestañas: no son otra vista de
 * los mismos datos, son otra tarea. Al entrar en ellas desaparecen los filtros
 * y las pestañas, porque ahí no se usan.
 */
@Component({
  selector: 'app-control-asistencia',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    AsistenciaReporteComponent,
    AsistenciaDashboardComponent,
    AsistenciaJustificacionesComponent,
    AsistenciaCierreComponent,
    AsistenciaAuditoriaComponent,
    AsistenciaConfiguracionComponent,
    AsistenciaEdicionComponent
  ],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="min-h-full overflow-x-hidden bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      @if (!esPantallaAparte()) {
        <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Control de Asistencia</h1>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ resumen() }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              <button type="button" [class]="estilos.botonSecundario" (click)="pantalla.set('configuracion')">
                <lucide-angular name="settings" [size]="15" class="block"></lucide-angular>
                Configuración
              </button>
              <button type="button" [class]="estilos.botonSecundario" (click)="pantalla.set('edicion')">
                <lucide-angular name="pencil" [size]="15" class="block"></lucide-angular>
                Editar horas
              </button>
              <button type="button" [class]="estilos.botonPrimario" (click)="exportar()"
                      [disabled]="!idSubcartera()">
                <lucide-angular name="download" [size]="15" class="block"></lucide-angular>
                Descargar Excel
              </button>
            </div>
          </div>

          <!-- El ámbito, en los tres niveles con los que está montada la operación -->
          <div class="flex flex-wrap items-end gap-3">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="cliente">Cliente</label>
              <select id="cliente" [class]="estilos.campo + ' w-[178px]'"
                      [ngModel]="idCliente()" (ngModelChange)="elegirCliente($event)">
                <option [ngValue]="null">Todos</option>
                @for (c of clientes(); track c.id) {
                  <option [ngValue]="c.id">{{ c.businessName || c.tenantName }}</option>
                }
              </select>
            </div>
            <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="cartera">Cartera</label>
              <select id="cartera" [class]="estilos.campo + ' w-[178px]'"
                      [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)"
                      [disabled]="!idCliente()">
                <option [ngValue]="null">Todas</option>
                @for (c of carteras(); track c.id) {
                  <option [ngValue]="c.id">{{ c.portfolioName }}</option>
                }
              </select>
            </div>
            <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="subcartera">Subcartera</label>
              <select id="subcartera" [class]="estilos.campo + ' w-[178px]'"
                      [ngModel]="idSubcartera()" (ngModelChange)="elegirSubcartera($event)"
                      [disabled]="!idCartera()">
                <option [ngValue]="null">Elige una</option>
                @for (s of subcarteras(); track s.id) {
                  <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
                }
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="desde">Desde</label>
              <input id="desde" type="date" [class]="estilos.campo + ' w-[148px]'"
                     [ngModel]="desde()" (ngModelChange)="desde.set($event)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="hasta">Hasta</label>
              <input id="hasta" type="date" [class]="estilos.campo + ' w-[148px]'"
                     [ngModel]="hasta()" (ngModelChange)="hasta.set($event)">
            </div>

            <!-- Un solo campo para buscar y elegir: escribir filtra, el desplegable lista el roster. -->
            <div class="flex min-w-[200px] flex-1 flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="buscar">Agente</label>
              <input id="buscar" type="text" list="roster-asistencia" autocomplete="off"
                     placeholder="Escribe o elige de la lista" [class]="estilos.campo"
                     [ngModel]="agente()" (ngModelChange)="agente.set($event)">
              <datalist id="roster-asistencia">
                @for (a of roster(); track a) { <option [value]="a"></option> }
              </datalist>
            </div>
          </div>
        </div>

        <div class="flex min-h-[54px] items-center overflow-x-auto border-b border-[#e6e9ee] bg-white px-7 py-[11px] dark:border-slate-800 dark:bg-slate-900">
          <nav [class]="estilos.segmentos" aria-label="Pantallas del módulo">
            @for (t of TABS; track t.clave) {
              <button type="button"
                      [class]="estilos.tab + ' ' + (pantalla() === t.clave ? estilos.tabActiva : estilos.tabApagada)"
                      [attr.aria-current]="pantalla() === t.clave ? 'page' : null"
                      [attr.aria-label]="t.clave === 'justificaciones' && sinResolver()
                        ? 'Justificaciones, ' + sinResolver() + ' sin resolver' : null"
                      (click)="pantalla.set(t.clave)">
                {{ t.texto }}
                @if (t.clave === 'justificaciones' && sinResolver()) {
                  <span aria-hidden="true"
                        [class]="estilos.cuenta + ' ' + (pantalla() === t.clave ? estilos.cuentaActiva : estilos.cuentaApagada)">
                    {{ sinResolver() }}
                  </span>
                }
              </button>
            }
          </nav>
        </div>
      }

      <div>
        @switch (pantalla()) {
          @case ('asistencia') {
            <app-asistencia-reporte
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()"
              [agente]="agente()"
              (rosterCambia)="roster.set($event)"
              (reporteCargado)="reporte.set($event)" />
          }
          @case ('dashboard') {
            <app-asistencia-dashboard
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()"
              [justificacionesPendientes]="sinResolver()"
              (semanaAnterior)="retrocederSemana()"
              (irA)="pantalla.set($event)" />
          }
          @case ('justificaciones') {
            <app-asistencia-justificaciones
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()"
              (sinResolverCambia)="sinResolver.set($event)" />
          }
          @case ('cierre') {
            <app-asistencia-cierre [idSubcartera]="idSubcartera()" />
          }
          @case ('auditoria') {
            <app-asistencia-auditoria [desde]="desde()" [hasta]="hasta()" />
          }
          @case ('configuracion') {
            <app-asistencia-configuracion [idSubcartera]="idSubcartera()"
              (volver)="pantalla.set('asistencia')" />
          }
          @case ('edicion') {
            <app-asistencia-edicion
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()"
              (volver)="pantalla.set('asistencia')" />
          }
        }
      </div>
    </div>
  `
})
export class ControlAsistenciaComponent implements OnInit {
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;

  protected readonly TABS = [
    { clave: 'asistencia', texto: 'Reporte' },
    { clave: 'dashboard', texto: 'Dashboard' },
    { clave: 'justificaciones', texto: 'Justificaciones' },
    { clave: 'cierre', texto: 'Cierre semanal' },
    { clave: 'auditoria', texto: 'Auditoría' }
  ] as const;

  readonly pantalla = signal<string>('asistencia');

  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly desde = signal(semanaPorDefecto().desde);
  readonly hasta = signal(semanaPorDefecto().hasta);
  readonly agente = signal('');

  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);

  /** Los nombres del roster, para el desplegable del campo de agente. */
  readonly roster = signal<string[]>([]);
  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly sinResolver = signal(0);

  /** Configuración y Editar horas no comparten filtros con el resto. */
  readonly esPantallaAparte = computed(() =>
    this.pantalla() === 'configuracion' || this.pantalla() === 'edicion');

  /** Lo que hay que saber del ámbito antes de mirar a nadie en concreto. */
  readonly resumen = computed(() => {
    const r = this.reporte();
    if (!this.idSubcartera() || !r) {
      return 'Ingreso y salida según el inicio y cierre de sesión en Cashi';
    }
    const faltas = r.dias.filter(d => d.estado === 'FALTA').length;
    const incompletos = r.dias.filter(d => d.estado === 'INCOMPLETO').length;
    const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
    return `${plural(r.agentes.length, 'persona', 'personas')} en el ámbito · `
      + `${plural(faltas, 'falta', 'faltas')} · `
      + `${plural(incompletos, 'día', 'días')} sin marcación completa`;
  });

  constructor() {
    // El número de la pestaña de justificaciones tiene que estar aunque no se
    // haya abierto: es lo que avisa de que hay algo esperando.
    effect(() => {
      const desde = this.desde();
      const hasta = this.hasta();
      this.servicio.justificaciones(desde, hasta, ['PENDIENTE', 'REVISADA']).subscribe({
        next: j => this.sinResolver.set(j.length),
        error: () => this.sinResolver.set(0)
      });
    });
  }

  ngOnInit(): void {
    // Sin filtrar por `isActive`: en QAS el cliente que se usa —Financiera Oh—
    // y tres de sus cuatro carteras están marcados como inactivos, así que
    // filtrar deja la pantalla vacía justo para el caso real. La bandera dice
    // si se siguen cargando datos, no si se puede consultar su asistencia.
    this.clientesServicio.getAllTenants().subscribe({
      next: c => {
        const ordenados = [...c].sort((a, b) =>
          (a.businessName || a.tenantName).localeCompare(b.businessName || b.tenantName));
        this.clientes.set(ordenados);
        // Con un solo cliente, elegirlo a mano es un paso de más.
        if (ordenados.length === 1) {
          this.elegirCliente(ordenados[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  // ==================== ÁMBITO ====================

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.agente.set('');
    if (!id) {
      return;
    }
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const ordenadas = [...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.carteras.set(ordenadas);
        if (ordenadas.length === 1) {
          this.elegirCartera(ordenadas[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    this.agente.set('');
    if (!id) {
      return;
    }
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) =>
          a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(ordenadas);
        if (ordenadas.length === 1) {
          this.elegirSubcartera(ordenadas[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  /** Cambiar de subcartera vacía la persona elegida: el roster es otro. */
  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.agente.set('');
    this.reporte.set(null);
    this.roster.set([]);
  }

  /**
   * Descarga el Excel. Lo arma el backend y no el navegador: el formato tiene
   * que coincidir con el de la hoja que RR.HH. ya lee, colores incluidos, y eso
   * se mantiene en un solo sitio.
   */
  exportar(): void {
    this.servicio.excel(this.desde(), this.hasta(), this.idSubcartera()).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = `Asistencia_${this.desde()}_${this.hasta()}.xlsx`;
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se pudo generar el Excel')
    });
  }

  /** El botón «Semana anterior» del dashboard mueve el rango, que vive aquí. */
  retrocederSemana(): void {
    this.desde.set(sumarDias(this.desde(), -7));
    this.hasta.set(sumarDias(this.hasta(), -7));
  }

}
