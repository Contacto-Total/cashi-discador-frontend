import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { SubPortfolio } from '../../maintenance/models/portfolio.model';
import { ESTILOS, hoy, lunesDe } from './asistencia.estilos';
import { AsistenciaReporteComponent } from './asistencia-reporte.component';
import { AsistenciaDashboardComponent } from './asistencia-dashboard.component';
import { AsistenciaJustificacionesComponent } from './asistencia-justificaciones.component';
import { AsistenciaCierreComponent } from './asistencia-cierre.component';
import { AsistenciaAuditoriaComponent } from './asistencia-auditoria.component';
import { AsistenciaConfiguracionComponent } from './asistencia-configuracion.component';

/**
 * Control de Asistencia: el módulo de RR.HH. y las supervisoras.
 *
 * El ámbito y el rango viven aquí y no en cada pestaña: son los mismos para
 * todas y, repetidos, se desincronizan en cuanto alguien cambia de tab. Cada
 * pestaña los recibe como entrada y vuelve a pedir sus datos sola.
 *
 * Sin subcartera elegida no se consulta nada. Traer a toda la empresa de golpe
 * hace lenta la pantalla que más se abre, y además nadie revisa la asistencia
 * de una empresa entera a la vez: se revisa por cartera.
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
    AsistenciaConfiguracionComponent
  ],
  styles: [`
    :host { display: block; }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 pt-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-[3px]">
            <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Control de Asistencia</h1>
            <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
          </div>
        </div>

        <!-- El ámbito y el rango mandan sobre todas las pestañas -->
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="ambito">Ámbito</label>
            <select id="ambito" [class]="estilos.campo + ' w-[240px]'"
                    [ngModel]="idSubcartera()" (ngModelChange)="idSubcartera.set($event)">
              <option [ngValue]="null">Elige una subcartera</option>
              @for (cartera of carteras(); track cartera.nombre) {
                <optgroup [label]="cartera.nombre">
                  @for (sub of cartera.subcarteras; track sub.id) {
                    <option [ngValue]="sub.id">{{ sub.subPortfolioName }}</option>
                  }
                </optgroup>
              }
            </select>
          </div>

          @if (tabUsaRango()) {
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="desde">Desde</label>
              <input id="desde" type="date" [class]="estilos.campo + ' w-[150px]'"
                     [ngModel]="desde()" (ngModelChange)="desde.set($event)">
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="hasta">Hasta</label>
              <input id="hasta" type="date" [class]="estilos.campo + ' w-[150px]'"
                     [ngModel]="hasta()" (ngModelChange)="hasta.set($event)">
            </div>
            <button type="button" [class]="estilos.botonSecundario" (click)="estaSemana()">
              <lucide-angular name="calendar-days" [size]="15" class="block"></lucide-angular>
              Esta semana
            </button>
          }
        </div>

        <!-- Las pestañas -->
        <nav class="-mb-px flex flex-wrap gap-0.5" aria-label="Secciones de asistencia">
          @for (t of TABS; track t.clave) {
            <button type="button"
                    class="inline-flex items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-[13px] font-semibold transition-colors"
                    [class]="tab() === t.clave
                      ? 'border-[#0f172a] !text-[#0f172a] dark:border-white dark:!text-white'
                      : 'border-transparent !text-[#5f6c80] hover:!text-[#334155] dark:!text-slate-400 dark:hover:!text-slate-200'"
                    [attr.aria-current]="tab() === t.clave ? 'page' : null"
                    (click)="tab.set(t.clave)">
              <lucide-angular [name]="t.icono" [size]="15" class="block"></lucide-angular>
              {{ t.texto }}
            </button>
          }
        </nav>
      </div>

      <div class="px-7 py-5">
        @switch (tab()) {
          @case ('reporte') {
            <app-asistencia-reporte
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()" />
          }
          @case ('dashboard') {
            <app-asistencia-dashboard
              [idSubcartera]="idSubcartera()" [desde]="desde()" [hasta]="hasta()" />
          }
          @case ('justificaciones') {
            <app-asistencia-justificaciones [desde]="desde()" [hasta]="hasta()" />
          }
          @case ('cierre') {
            <app-asistencia-cierre [idSubcartera]="idSubcartera()" />
          }
          @case ('auditoria') {
            <app-asistencia-auditoria [desde]="desde()" [hasta]="hasta()" />
          }
          @case ('configuracion') {
            <app-asistencia-configuracion [idSubcartera]="idSubcartera()" />
          }
        }
      </div>
    </div>
  `
})
export class ControlAsistenciaComponent implements OnInit {
  private readonly carterasServicio = inject(PortfolioService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;

  protected readonly TABS = [
    { clave: 'reporte', texto: 'Reporte', icono: 'calendar-days' },
    { clave: 'dashboard', texto: 'Dashboard', icono: 'bar-chart-3' },
    { clave: 'justificaciones', texto: 'Justificaciones', icono: 'file-text' },
    { clave: 'cierre', texto: 'Cierre semanal', icono: 'lock' },
    { clave: 'auditoria', texto: 'Auditoría', icono: 'history' },
    { clave: 'configuracion', texto: 'Configuración', icono: 'settings' }
  ] as const;

  readonly tab = signal<string>('reporte');
  readonly idSubcartera = signal<number | null>(null);
  readonly desde = signal(lunesDe(new Date()));
  readonly hasta = signal(hoy());
  readonly subcarteras = signal<SubPortfolio[]>([]);

  /**
   * Las subcarteras agrupadas por su cartera. La cascada cliente → cartera →
   * subcartera cabe en un solo control porque el backend solo acota por
   * subcartera; la cartera está para encontrarla, no para filtrar.
   */
  readonly carteras = computed(() => {
    const grupos = new Map<string, SubPortfolio[]>();
    for (const sub of this.subcarteras()) {
      const clave = sub.portfolioName ?? 'Sin cartera';
      const subs = grupos.get(clave);
      if (subs) {
        subs.push(sub);
      } else {
        grupos.set(clave, [sub]);
      }
    }
    return [...grupos.entries()]
      .map(([nombre, subs]) => ({
        nombre,
        subcarteras: subs.sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName))
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  /**
   * El cierre y la configuración no miran un rango de días: uno trabaja por
   * semanas cerradas y la otra sobre lo vigente. Enseñarles las fechas haría
   * creer que las filtran.
   */
  readonly tabUsaRango = computed(() =>
    this.tab() !== 'cierre' && this.tab() !== 'configuracion');

  readonly subtitulo = computed(() => {
    const elegida = this.subcarteras().find(s => s.id === this.idSubcartera());
    return elegida
      ? `${elegida.portfolioName} · ${elegida.subPortfolioName}`
      : 'Ingreso y salida según el inicio y cierre de sesión en Cashi';
  });

  ngOnInit(): void {
    this.carterasServicio.getAllSubPortfolios().subscribe({
      next: subs => this.subcarteras.set(subs.filter(s => s.isActive)),
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  estaSemana(): void {
    this.desde.set(lunesDe(new Date()));
    this.hasta.set(hoy());
  }
}
