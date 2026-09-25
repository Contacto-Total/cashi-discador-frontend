import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
import { ESTILOS, estadoVisible, hoy, semanaPorDefecto, sumarDias } from './asistencia.estilos';
import { AsistenciaReporteComponent } from './asistencia-reporte.component';
import { AsistenciaDashboardComponent } from './asistencia-dashboard.component';
import { AsistenciaJustificacionesComponent } from './asistencia-justificaciones.component';
import { AsistenciaCierreComponent } from './asistencia-cierre.component';
import { AsistenciaAuditoriaComponent } from './asistencia-auditoria.component';
import { AsistenciaHorarioComponent } from './asistencia-horario.component';
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
 * Configuración y Corregir marcaciones son BOTONES y no pestañas: no son otra vista de
 * los mismos datos, son otra tarea. Al entrar en ellas desaparecen los filtros
 * y las pestañas, porque ahí no se usan.
 */
@Component({
  selector: 'app-control-asistencia',
  standalone: true,
  // Engancha las tablas al estilo del módulo (styles.css, «MÓDULO DE ASISTENCIA - tablas»).
  host: { class: 'cashi-asistencia' },
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    AsistenciaReporteComponent,
    AsistenciaDashboardComponent,
    AsistenciaJustificacionesComponent,
    AsistenciaCierreComponent,
    AsistenciaAuditoriaComponent,
    AsistenciaHorarioComponent,
    AsistenciaConfiguracionComponent,
    AsistenciaEdicionComponent
  ],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="min-h-full overflow-x-hidden bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <!-- La cabecera del módulo va siempre, también en Configuración y Editar
           horas: el ámbito y el rango de arriba son los que esas pantallas usan. -->
      <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Control de Asistencia</h1>
            <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ resumen() }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" (click)="pantalla.set('configuracion')"
                    [class]="pantalla() === 'configuracion' ? botonActivo : estilos.botonSecundario"
                    [attr.aria-current]="pantalla() === 'configuracion' ? 'page' : null">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
              Configuración
            </button>
            <button type="button" [class]="estilos.botonSecundario" (click)="pantalla.set('edicion')"
                    [attr.aria-current]="pantalla() === 'edicion' ? 'page' : null">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Corregir marcaciones
            </button>
            <button type="button" [class]="estilos.botonPrimario" (click)="exportar()"
                    [disabled]="!idSubcartera()">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Descargar Excel
            </button>
          </div>
        </div>

        <!-- El ámbito, en los tres niveles con los que está montada la operación -->
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="cliente">Cliente</label>
            <select id="cliente" [class]="estilos.campo + ' !w-[178px]'"
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
            <select id="cartera" [class]="estilos.campo + ' !w-[178px]'"
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
            <select id="subcartera" [class]="estilos.campo + ' !w-[178px]'"
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
            <input id="desde" type="date" [class]="estilos.campo"
                   [ngModel]="desde()" (ngModelChange)="desde.set($event)">
          </div>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="hasta">Hasta</label>
            <input id="hasta" type="date" [class]="estilos.campo"
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

      <!-- Corregir marcaciones y Configuración se entran desde la cabecera y salen con
           «Volver al reporte»: ahí el selector de pantallas no pinta nada. -->
      @if (!esPantallaAparte()) {
        <div class="flex min-h-[54px] items-center overflow-x-auto border-b border-[#e6e9ee] bg-white px-7 py-[11px] dark:border-slate-800 dark:bg-slate-900">
          <nav [class]="estilos.segmentos" aria-label="Pantallas del módulo">
            @for (t of TABS; track t.clave) {
              <button type="button"
                      [class]="estilos.tab + ' ' + (pantalla() === t.clave ? estilos.tabActiva : estilos.tabApagada)
                        + ' disabled:cursor-default disabled:opacity-60'"
                      [disabled]="t.pronto"
                      [attr.aria-current]="pantalla() === t.clave ? 'page' : null"
                      [attr.aria-label]="t.clave === 'justificaciones' && sinResolver()
                        ? 'Solicitudes, ' + sinResolver() + ' sin resolver' : null"
                      (click)="pantalla.set(t.clave)">
                {{ t.texto }}
                @if (t.pronto) {
                  <span class="ml-1.5 rounded-full bg-[#eff5ff] px-1.5 py-px text-[10.5px] font-bold text-[#2563eb] dark:bg-slate-800 dark:text-[#60a5fa]">
                    Pronto
                  </span>
                }
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
              (semanaAnterior)="retrocederSemana()"
              (volverASemana)="volverASemanaPorDefecto()"
              (irA)="pantalla.set($event)" />
          }
          @case ('justificaciones') {
            <app-asistencia-justificaciones
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()" [agente]="agente()"
              (sinResolverCambia)="sinResolver.set($event)" />
          }
          @case ('cierre') {
            <app-asistencia-cierre [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()"
              (irA)="pantalla.set($event)" />
          }
          @case ('horario') {
            <app-asistencia-horario [idSubcartera]="idSubcartera()" [subcartera]="nombreSubcartera()"
              [agente]="agente()" />
          }
          @case ('auditoria') {
            <app-asistencia-auditoria [desde]="desde()" [hasta]="hasta()"
              [idSubcartera]="idSubcartera()" [agente]="agente()" />
          }
          @case ('configuracion') {
            <app-asistencia-configuracion [idSubcartera]="idSubcartera()" [subcartera]="nombreSubcartera()"
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
  /** «Configuración» mientras se está en ella: fondo suave y texto oscuro, como la maqueta. */
  protected readonly botonActivo = ESTILOS.botonSecundario.replace('!text-[#334155]', '!text-[#0f172a]') + ' !bg-[#f4f6f9] dark:!bg-slate-700';

  /**
   * `pronto`: la pantalla existe pero todavía no se abre. El Dashboard queda
   * así por decisión de RR.HH. (22/09/2026): se usará, pero no en esta versión.
   */
  protected readonly TABS = [
    { clave: 'asistencia', texto: 'Reporte', pronto: false },
    { clave: 'dashboard', texto: 'Dashboard', pronto: true },
    { clave: 'justificaciones', texto: 'Solicitudes', pronto: false },
    // El horario de la semana con las recuperaciones: el fijo no se edita.
    { clave: 'horario', texto: 'Horario', pronto: false },
    { clave: 'auditoria', texto: 'Auditoría', pronto: false },
    // El cierre es el último paso de la semana: va al final.
    { clave: 'cierre', texto: 'Cierre semanal', pronto: false }
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

  /** El nombre de la subcartera elegida: Configuración lo usa para decir a quién alcanza un cambio. */
  readonly nombreSubcartera = computed(() =>
    this.subcarteras().find(s => s.id === this.idSubcartera())?.subPortfolioName ?? null);

  /** Configuración y Corregir marcaciones no comparten filtros con el resto. */
  readonly esPantallaAparte = computed(() =>
    this.pantalla() === 'configuracion' || this.pantalla() === 'edicion');

  /** Lo que hay que saber del ámbito antes de mirar a nadie en concreto. */
  readonly resumen = computed(() => {
    const r = this.reporte();
    if (!this.idSubcartera() || !r) {
      return 'Ingreso y salida según el inicio y cierre de sesión en Cashi';
    }
    const faltas = r.dias.filter(d => d.estado === 'FALTA').length;
    const incompletos = r.dias.filter(d => estadoVisible(d) === 'INCOMPLETO').length;
    const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;
    return `${plural(r.agentes.length, 'persona', 'personas')} en el ámbito · `
      + `${plural(faltas, 'falta', 'faltas')} · `
      + `${plural(incompletos, 'día', 'días')} sin marcación completa`;
  });

  constructor() {
    // El número de la pestaña de justificaciones tiene que estar aunque no se
    // haya abierto: es lo que avisa de que hay algo esperando. Cuenta solo lo
    // que le toca a RR.HH. (lo que ya revisó la supervisora), de tres meses
    // atrás a dos adelante, lo mismo que lista la pestaña.
    this.servicio.justificaciones(sumarDias(hoy(), -90), sumarDias(hoy(), 60), ['REVISADA']).subscribe({
      next: j => this.sinResolver.set(j.length),
      error: () => this.sinResolver.set(0)
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
  volverASemanaPorDefecto(): void {
    this.desde.set(semanaPorDefecto().desde);
    this.hasta.set(semanaPorDefecto().hasta);
  }

  retrocederSemana(): void {
    this.desde.set(sumarDias(this.desde(), -7));
    this.hasta.set(sumarDias(this.hasta(), -7));
  }

}
