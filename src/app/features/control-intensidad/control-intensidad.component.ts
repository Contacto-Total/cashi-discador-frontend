import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe, DatePipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { TituloTarjetaComponent } from '../../shared/ui/titulo-tarjeta.component';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { ToastService } from '../../shared/services/toast.service';
import { TUI, tuiPerilla, tuiSwitch } from '../../maintenance/components/typification-ui';
import { CampanaControl, ControlIntensidadService, EstadoControl, ProveedorCanales } from './control-intensidad.service';

/**
 * REQ-022: control automático de intensidad del discador y canales contratados por proveedor.
 * Solo para administradores. Con el control apagado el discador marca con la intensidad manual.
 */
@Component({
  selector: 'app-control-intensidad',
  standalone: true,
  imports: [NgClass, DecimalPipe, DatePipe, PageHeaderComponent, TituloTarjetaComponent, TarjetaDirective, BotonDirective],
  template: `
    <div class="font-cashi flex flex-col gap-3 text-[.875rem] leading-[1.5] text-foreground antialiased">
      <section appTarjeta class="flex flex-col gap-4 px-8 pt-6 pb-6">
        <app-page-header titulo="Control de intensidad"
                         subtitulo="El discador calcula cuántas llamadas sostener por campaña según los asesores disponibles, los canales del proveedor y el abandono."></app-page-header>

        @if (estado(); as e) {
          <!-- Configuración del control -->
          <div class="flex flex-col gap-3">
            <app-titulo-tarjeta titulo="Control automático"></app-titulo-tarjeta>
            <div class="flex items-center gap-3">
              <button type="button" role="switch" [class]="switchClase(activo())" [attr.aria-checked]="activo()"
                      aria-label="Control automático activo" (click)="activo.set(!activo())">
                <span [class]="perillaClase(activo())"></span>
              </button>
              <span class="font-semibold">{{ activo() ? 'Activo' : 'Apagado: todas las campañas usan su intensidad manual' }}</span>
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label class="flex flex-col gap-1">
                <span [class]="TUI.label">Subcarteras</span>
                <input [class]="TUI.input" [value]="subcarteras()" placeholder="21"
                       (input)="subcarteras.set($any($event.target).value)">
              </label>
              <label class="flex flex-col gap-1">
                <span [class]="TUI.label">Abandono objetivo (%)</span>
                <input type="number" min="1" max="50" [class]="TUI.input" [value]="abandonoObjetivo()"
                       (input)="abandonoObjetivo.set(+$any($event.target).value)">
              </label>
              <label class="flex flex-col gap-1">
                <span [class]="TUI.label">Margen de canales (%)</span>
                <input type="number" min="0" max="50" [class]="TUI.input" [value]="margenSeguridad()"
                       (input)="margenSeguridad.set(+$any($event.target).value)">
              </label>
              <label class="flex flex-col gap-1">
                <span [class]="TUI.label">Llamadas nuevas por segundo</span>
                <input type="number" min="1" max="30" [class]="TUI.input" [value]="maxPorSegundo()"
                       (input)="maxPorSegundo.set(+$any($event.target).value)">
              </label>
            </div>
            <p class="m-0 text-[.75rem] text-muted-foreground">
              Cada campaña arranca en el {{ e.config.volumenArranque }}% de lo que marcaría con su intensidad manual
              y se ajusta una vez por minuto con el abandono de los últimos {{ e.config.ventanaMinutos }} minutos.
              @if (e.config.actualizadoPor) {
                Último cambio: {{ e.config.actualizadoPor }}, {{ e.config.actualizadoEn | date:'dd/MM/yyyy HH:mm' }}.
              }
            </p>
            <div>
              <button type="button" appBoton [disabled]="guardando()" (click)="guardarConfig()">Guardar</button>
            </div>
          </div>

          <!-- Canales por proveedor -->
          <div class="flex flex-col gap-3">
            <app-titulo-tarjeta titulo="Canales por proveedor"></app-titulo-tarjeta>
            <table class="w-full border-collapse text-left">
              <thead>
                <tr [class]="TUI.label">
                  <th class="py-2 pr-3">Proveedor</th>
                  <th class="py-2 pr-3">Gateway</th>
                  <th class="py-2 pr-3">Canales contratados</th>
                  <th class="py-2 pr-3">Último cambio</th>
                  <th class="py-2"></th>
                </tr>
              </thead>
              <tbody>
                @for (p of e.proveedores; track p.id) {
                  <tr class="border-t border-border">
                    <td class="py-2 pr-3 font-semibold">
                      {{ p.nombre }}
                      @if (p.enUso) {
                        <span class="ml-2 rounded-full border border-(--ok-ln) bg-(--ok-bg) px-2 py-0.5 text-[.6875rem] font-bold text-(--ok)">En uso</span>
                      }
                    </td>
                    <td class="py-2 pr-3 text-muted-foreground">{{ p.gateway }}</td>
                    <td class="py-2 pr-3">
                      <input type="number" min="1" max="10000" [class]="TUI.inputSm + ' w-28'" [value]="p.canales ?? ''"
                             placeholder="Sin dato" [attr.aria-label]="'Canales de ' + p.nombre"
                             (input)="canalesEditados[p.id] = $any($event.target).value">
                    </td>
                    <td class="py-2 pr-3 text-[.75rem] text-muted-foreground">
                      {{ p.actualizadoPor ?? '' }} {{ p.actualizadoEn ? (p.actualizadoEn | date:'dd/MM/yyyy HH:mm') : '' }}
                    </td>
                    <td class="py-2 text-right">
                      <button type="button" appBoton="secundario" appBotonAlto="chico" [disabled]="guardando()"
                              (click)="guardarCanales(p)">Guardar</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            <p class="m-0 text-[.75rem] text-muted-foreground">
              El proveedor en uso es el gateway configurado en el backend ({{ e.gatewayEnUso }}). Sin canales cargados
              para ese proveedor, el control no se aplica.
            </p>
          </div>

          <!-- Campañas bajo control -->
          <div class="flex flex-col gap-3">
            <app-titulo-tarjeta titulo="Campañas bajo control"></app-titulo-tarjeta>
            @if (e.campanas.length === 0) {
              <p class="m-0 text-muted-foreground">Ninguna campaña bajo control en este momento.</p>
            } @else {
              <table class="w-full border-collapse text-left tabular-nums">
                <thead>
                  <tr [class]="TUI.label">
                    <th class="py-2 pr-3">Campaña</th>
                    <th class="py-2 pr-3">Asesores</th>
                    <th class="py-2 pr-3">En curso</th>
                    <th class="py-2 pr-3">Pendientes</th>
                    <th class="py-2 pr-3">Objetivo (manual)</th>
                    <th class="py-2 pr-3">Volumen</th>
                    <th class="py-2 pr-3">Abandono</th>
                  </tr>
                </thead>
                <tbody>
                  @for (c of e.campanas; track c.idCampana) {
                    <tr class="border-t border-border">
                      <td class="py-2 pr-3 font-semibold">{{ c.campana }}</td>
                      <td class="py-2 pr-3">{{ c.capacidad | number:'1.0-1' }}</td>
                      <td class="py-2 pr-3">{{ c.enCurso }}</td>
                      <td class="py-2 pr-3">{{ c.pendientes | number }}</td>
                      <td class="py-2 pr-3">
                        {{ c.objetivo }} ({{ c.objetivoManual }})
                        @if (c.recortada) {
                          <span class="ml-1 text-[.6875rem] font-bold text-(--am)">recortado por canales</span>
                        }
                      </td>
                      <td class="py-2 pr-3">{{ c.factor * 100 | number:'1.0-0' }}%</td>
                      <td class="py-2 pr-3" [ngClass]="abandonoClase(c)">
                        {{ c.abandonoPct === null ? 'sin datos' : (c.abandonoPct | number:'1.1-1') + '%' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        } @else {
          <p class="m-0 text-muted-foreground">Cargando…</p>
        }
      </section>
    </div>
  `
})
export class ControlIntensidadComponent implements OnInit, OnDestroy {
  private readonly servicio = inject(ControlIntensidadService);
  private readonly toast = inject(ToastService);
  private refresco?: ReturnType<typeof setInterval>;

  readonly TUI = TUI;
  readonly estado = signal<EstadoControl | null>(null);
  readonly guardando = signal(false);
  readonly activo = signal(false);
  readonly subcarteras = signal('');
  readonly abandonoObjetivo = signal(10);
  readonly margenSeguridad = signal(15);
  readonly maxPorSegundo = signal(20);
  /** Lo que se escribió en cada fila de proveedor y aún no se guarda. */
  canalesEditados: Record<number, string> = {};

  ngOnInit(): void {
    this.cargar(true);
    // La tabla de campañas cambia cada ciclo del discador; los campos editables no se pisan.
    this.refresco = setInterval(() => this.cargar(false), 30_000);
  }

  ngOnDestroy(): void {
    if (this.refresco) clearInterval(this.refresco);
  }

  switchClase(on: boolean): string {
    return tuiSwitch(on);
  }

  perillaClase(on: boolean): string {
    return tuiPerilla(on);
  }

  abandonoClase(c: CampanaControl): string {
    const objetivo = this.estado()?.config.abandonoObjetivo ?? 10;
    if (c.abandonoPct === null) return 'text-muted-foreground';
    return c.abandonoPct > objetivo ? 'font-bold text-(--ro)' : 'font-bold text-(--ok)';
  }

  guardarConfig(): void {
    this.guardando.set(true);
    this.servicio.guardarConfig({
      activo: this.activo(),
      subcarteras: this.subcarteras(),
      abandonoObjetivo: this.abandonoObjetivo(),
      margenSeguridad: this.margenSeguridad(),
      maxPorSegundo: this.maxPorSegundo()
    }).subscribe({
      next: () => {
        this.toast.success(this.activo() ? 'Control de intensidad guardado y activo' : 'Control de intensidad guardado y apagado');
        this.guardando.set(false);
        this.cargar(true);
      },
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  guardarCanales(p: ProveedorCanales): void {
    const texto = this.canalesEditados[p.id];
    const valor = texto === undefined ? p.canales : (texto.trim() === '' ? null : Number(texto));
    if (valor !== null && (!Number.isInteger(valor) || valor < 1)) {
      this.toast.warning('Los canales deben ser un número entero mayor que cero, o vacío si no se conoce');
      return;
    }
    this.guardando.set(true);
    this.servicio.guardarCanales(p.id, valor).subscribe({
      next: () => {
        this.toast.success(`Canales de ${p.nombre} guardados`);
        delete this.canalesEditados[p.id];
        this.guardando.set(false);
        this.cargar(false);
      },
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  private cargar(conCampos: boolean): void {
    this.servicio.estado().subscribe({
      next: e => {
        this.estado.set(e);
        if (conCampos) {
          this.activo.set(e.config.activo);
          this.subcarteras.set(e.config.subcarteras ?? '');
          this.abandonoObjetivo.set(e.config.abandonoObjetivo);
          this.margenSeguridad.set(e.config.margenSeguridad);
          this.maxPorSegundo.set(e.config.maxPorSegundo);
        }
      },
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  private fallo(err: HttpErrorResponse): void {
    this.guardando.set(false);
    this.toast.error(err.error?.error ?? 'No se pudo completar la operación');
  }
}
