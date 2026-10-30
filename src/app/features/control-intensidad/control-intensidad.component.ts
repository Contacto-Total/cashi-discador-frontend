import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { TituloTarjetaComponent } from '../../shared/ui/titulo-tarjeta.component';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { ToastService } from '../../shared/services/toast.service';
import { TUI, tuiPerilla, tuiSwitch } from '../../maintenance/components/typification-ui';
import {
  ControlIntensidadService, EstadoControl, Proveedor, ProveedorCambio, Tramo, TramoCambio, UltimoMinuto
} from './control-intensidad.service';

/** Lo que se edita en una fila de tramo y todavía no se guarda. */
/** Meta de abandono en cola de jefatura, la misma del backend. Solo para pintar en rojo. */
const ABANDONO_MAXIMO_PCT = 10;

const DECISION: Record<UltimoMinuto['decision'], string> = {
  SUBE: 'Sube',
  BAJA: 'Baja',
  MANTIENE: 'Se mantiene',
  CANALES_LLENOS: 'Canales llenos'
};

const MOTIVO_CAMBIO: Record<string, string> = {
  PING: 'Automático: FreeSWITCH lo marcó caído',
  FALLAS: 'Automático: fallaban todas las llamadas',
  VUELTA: 'Automático: el principal volvió',
  MANUAL: 'Manual'
};

/**
 * intensidad automática por tramo (cuántas llamadas se lanzan por cada asesor libre) y
 * proveedores de llamadas. Solo para administradores. Un tramo apagado marca con la intensidad manual
 * de sus campañas, como antes.
 */
@Component({
  selector: 'app-control-intensidad',
  standalone: true,
  imports: [NgClass, DecimalPipe, DatePipe, PageHeaderComponent, TituloTarjetaComponent, TarjetaDirective, BotonDirective],
  template: `
    <div class="font-cashi flex flex-col gap-3 text-[.875rem] leading-[1.5] text-foreground antialiased">
      <section appTarjeta class="flex flex-col gap-5 px-8 pt-6 pb-6">
        <app-page-header titulo="Control de intensidad"
                         subtitulo="Cada minuto, por tramo, la intensidad sube o baja según la cola, la espera, el abandono y los asesores libres."></app-page-header>

        @if (estado(); as e) {
          <!-- Tramos -->
          <div class="flex flex-col gap-3">
            <app-titulo-tarjeta titulo="Intensidad por tramo"></app-titulo-tarjeta>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left tabular-nums">
                <thead>
                  <tr [class]="TUI.label">
                    <th class="py-2 pr-3">Tramo</th>
                    <th class="py-2 pr-3">Automático</th>
                    <th class="py-2 pr-3">Arranque</th>
                    <th class="py-2 pr-3">Hoy</th>
                    <th class="py-2 pr-3">Espera máx. (s)</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of e.tramos; track t.idSubcartera) {
                    <tr class="border-t border-border">
                      <td class="py-2 pr-3 font-semibold">{{ t.nombre }} <span class="text-muted-foreground">({{ t.idSubcartera }})</span></td>
                      <td class="py-2 pr-3">
                        <button type="button" role="switch" [class]="switchClase(t.activo)" [attr.aria-checked]="t.activo"
                                [disabled]="guardando()" [attr.aria-label]="'Intensidad automática de ' + t.nombre"
                                (click)="guardarTramo(t, { activo: !t.activo })">
                          <span [class]="perillaClase(t.activo)"></span>
                        </button>
                      </td>
                      <td class="py-2 pr-3"><input type="number" min="1" [class]="TUI.inputSm + ' w-20'" [value]="t.intensidadInicial" [attr.aria-label]="'Arranque de ' + t.nombre" (change)="guardarTramo(t, { intensidadInicial: num($event) })"></td>
                      <td class="py-2 pr-3 font-bold">{{ t.activo ? t.intensidadActual : 'manual' }}</td>
                      <td class="py-2 pr-3"><input type="number" min="1" [class]="TUI.inputSm + ' w-20'" [value]="t.esperaMaximaSeg" [attr.aria-label]="'Espera máxima de ' + t.nombre" (change)="guardarTramo(t, { esperaMaximaSeg: num($event) })"></td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            <p class="m-0 text-[.75rem] text-muted-foreground">
              Intensidad = llamadas por cada asesor libre. Cada día arranca en el arranque (100 / personas que contestan
              por cada 100 marcadas; un tramo sin historial, 17) y nunca baja de la mitad. No tiene techo: la frenan la cola,
              la espera, el abandono en cola (meta 10%) y los canales del proveedor. Tipificando de más es la alerta roja de
              TIPIFICANDO en la configuración de umbrales. Al apagar un tramo, en el siguiente ciclo sus campañas vuelven
              a su intensidad manual. Los cambios se guardan solos: el switch al tocarlo y los números al salir del campo.
            </p>
          </div>

          <!-- Último minuto -->
          <div class="flex flex-col gap-3">
            <app-titulo-tarjeta titulo="Último minuto por tramo"></app-titulo-tarjeta>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left tabular-nums">
                <thead>
                  <tr [class]="TUI.label">
                    <th class="py-2 pr-3">Tramo</th>
                    <th class="py-2 pr-3">Hora</th>
                    <th class="py-2 pr-3">Decisión</th>
                    <th class="py-2 pr-3">En cola</th>
                    <th class="py-2 pr-3">Espera máx.</th>
                    <th class="py-2 pr-3">Abandono en cola</th>
                    <th class="py-2 pr-3">Libres sin llamada</th>
                    <th class="py-2 pr-3">Tipificando de más</th>
                    <th class="py-2 pr-3">Disponibles</th>
                    <th class="py-2 pr-3">Llamadas / canales</th>
                    <th class="py-2">Por qué</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of e.tramos; track t.idSubcartera) {
                    @if (t.ultimoMinuto; as m) {
                      <tr class="border-t border-border">
                        <td class="py-2 pr-3 font-semibold">{{ t.nombre }}</td>
                        <td class="py-2 pr-3 text-muted-foreground">{{ m.fecha | date:'dd/MM HH:mm' }}</td>
                        <td class="py-2 pr-3 font-bold" [ngClass]="decisionClase(m)">{{ decision(m) }} {{ m.intensidadAnterior }} → {{ m.intensidadNueva }}</td>
                        <td class="py-2 pr-3">{{ m.enCola }}</td>
                        <td class="py-2 pr-3" [ngClass]="m.esperaMaximaSeg > t.esperaMaximaSeg ? 'font-bold text-(--ro)' : ''">{{ m.esperaMaximaSeg }} s</td>
                        <td class="py-2 pr-3" [ngClass]="m.abandonoPct !== null && m.abandonoPct > ABANDONO_MAXIMO_PCT ? 'font-bold text-(--ro)' : ''">
                          {{ m.abandonoPct === null ? 'nadie entró' : (m.abandonoPct | number:'1.1-1') + '%' }}
                          <span class="text-muted-foreground">({{ m.colgaronCola }} de {{ m.entraronCola }})</span>
                        </td>
                        <td class="py-2 pr-3">{{ m.asesoresLibresLargo }}</td>
                        <td class="py-2 pr-3">{{ m.tipificandoLargo }}</td>
                        <td class="py-2 pr-3">{{ m.asesoresDisponibles }}</td>
                        <td class="py-2 pr-3">{{ m.llamadasProveedor ?? 'sin dato' }} / {{ m.canales ?? 'sin dato' }}</td>
                        <td class="py-2 text-[.75rem] text-muted-foreground">{{ m.motivo }}</td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
            <p class="m-0 text-[.75rem] text-muted-foreground">
              Se revisa en este orden y la primera que se cumple decide: canales llenos, no lanza más; alguien espera más
              de lo permitido o hay cola y el abandono pasa la meta, baja en % según cuánto se pasó (sin bajar del piso);
              hay un asesor libre sin llamada, nadie en cola
              y nadie tipificando de más, sube 1; si no, se mantiene.
            </p>
          </div>

          <!-- Proveedores -->
          <div class="flex flex-col gap-3">
            <app-titulo-tarjeta titulo="Proveedores"></app-titulo-tarjeta>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr [class]="TUI.label">
                    <th class="py-2 pr-3">Nombre</th>
                    <th class="py-2 pr-3">Gateway</th>
                    <th class="py-2 pr-3">Prefijo</th>
                    <th class="py-2 pr-3">Canales</th>
                    <th class="py-2 pr-3">Prioridad</th>
                    <th class="py-2 pr-3">Habilitado</th>
                    <th class="py-2 pr-3"></th>
                    <th class="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of e.proveedores; track p.id) {
                    @let b = borradorProveedor(p);
                    <tr class="border-t border-border">
                      <td class="py-2 pr-3"><input [class]="TUI.inputSm + ' w-28'" [value]="b.nombre" (input)="b.nombre = $any($event.target).value"></td>
                      <td class="py-2 pr-3"><input [class]="TUI.inputSm + ' w-28'" [value]="b.gateway" (input)="b.gateway = $any($event.target).value"></td>
                      <td class="py-2 pr-3"><input [class]="TUI.inputSm + ' w-24'" [value]="b.prefijo" (input)="b.prefijo = $any($event.target).value"></td>
                      <td class="py-2 pr-3"><input type="number" min="1" [class]="TUI.inputSm + ' w-20'" [value]="b.canales ?? ''" placeholder="Sin dato" (input)="b.canales = numONulo($event)"></td>
                      <td class="py-2 pr-3"><input type="number" min="1" [class]="TUI.inputSm + ' w-16'" [value]="b.prioridad" (input)="b.prioridad = num($event)"></td>
                      <td class="py-2 pr-3">
                        <button type="button" role="switch" [class]="switchClase(b.habilitado)" [attr.aria-checked]="b.habilitado"
                                [attr.aria-label]="'Habilitar ' + p.nombre" (click)="b.habilitado = !b.habilitado">
                          <span [class]="perillaClase(b.habilitado)"></span>
                        </button>
                      </td>
                      <td class="py-2 pr-3">
                        @if (p.enUso) {
                          <span class="rounded-full border border-(--ok-ln) bg-(--ok-bg) px-2 py-0.5 text-[.6875rem] font-bold text-(--ok)">En uso</span>
                        } @else {
                          <button type="button" appBoton="secundario" appBotonAlto="chico" [disabled]="guardando() || !p.habilitado" (click)="usar(p)">Usar este</button>
                        }
                      </td>
                      <td class="py-2 text-right">
                        <button type="button" appBoton="secundario" appBotonAlto="chico" [disabled]="guardando()" (click)="guardarProveedor(p.id, b)">Guardar</button>
                      </td>
                    </tr>
                  }
                  <tr class="border-t border-border">
                    <td class="py-2 pr-3"><input [class]="TUI.inputSm + ' w-28'" placeholder="Nombre" [value]="nuevoProveedor.nombre" (input)="nuevoProveedor.nombre = $any($event.target).value"></td>
                    <td class="py-2 pr-3"><input [class]="TUI.inputSm + ' w-28'" placeholder="Gateway" [value]="nuevoProveedor.gateway" (input)="nuevoProveedor.gateway = $any($event.target).value"></td>
                    <td class="py-2 pr-3"><input [class]="TUI.inputSm + ' w-24'" placeholder="Prefijo" [value]="nuevoProveedor.prefijo" (input)="nuevoProveedor.prefijo = $any($event.target).value"></td>
                    <td class="py-2 pr-3"><input type="number" min="1" [class]="TUI.inputSm + ' w-20'" placeholder="Sin dato" [value]="nuevoProveedor.canales ?? ''" (input)="nuevoProveedor.canales = numONulo($event)"></td>
                    <td class="py-2 pr-3"><input type="number" min="1" [class]="TUI.inputSm + ' w-16'" [value]="nuevoProveedor.prioridad" (input)="nuevoProveedor.prioridad = num($event)"></td>
                    <td class="py-2 pr-3" colspan="2"></td>
                    <td class="py-2 text-right">
                      <button type="button" appBoton="secundario" appBotonAlto="chico" [disabled]="guardando()" (click)="agregarProveedor()">Agregar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="m-0 text-[.75rem] text-muted-foreground">
              Todas las llamadas (discador y manuales) salen por el proveedor en uso ({{ e.gatewayEnUso }}).
              @if (e.cambioAutomatico) {
                Cambio automático encendido: si FreeSWITCH marca caído al proveedor en uso, o en un minuto fallan el 80% o
                más de las llamadas y ninguna timbra, se pasa al siguiente por prioridad que esté habilitado y arriba.
                Si fue por caída, vuelve solo al principal cuando lleva 5 minutos arriba; si fue por fallas, se vuelve desde aquí.
              } @else {
                Cambio automático apagado: el proveedor solo se cambia desde aquí.
              }
            </p>
          </div>

          <!-- Cambios de proveedor -->
          @if (e.cambios.length > 0) {
            <div class="flex flex-col gap-3">
              <app-titulo-tarjeta titulo="Últimos cambios de proveedor"></app-titulo-tarjeta>
              <table class="w-full border-collapse text-left">
                <thead>
                  <tr [class]="TUI.label">
                    <th class="py-2 pr-3">Fecha</th>
                    <th class="py-2 pr-3">De</th>
                    <th class="py-2 pr-3">A</th>
                    <th class="py-2 pr-3">Tipo</th>
                    <th class="py-2 pr-3">Detalle</th>
                    <th class="py-2">Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  @for (c of e.cambios; track c.fecha) {
                    <tr class="border-t border-border">
                      <td class="py-2 pr-3 text-muted-foreground">{{ c.fecha | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                      <td class="py-2 pr-3">{{ c.gatewayAnterior }}</td>
                      <td class="py-2 pr-3 font-semibold">{{ c.gatewayNuevo }}</td>
                      <td class="py-2 pr-3">{{ motivoCambio(c.motivo) }}</td>
                      <td class="py-2 pr-3 text-[.75rem] text-muted-foreground">{{ c.detalle }}</td>
                      <td class="py-2">{{ c.usuario ?? '' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
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
  readonly ABANDONO_MAXIMO_PCT = ABANDONO_MAXIMO_PCT;
  readonly estado = signal<EstadoControl | null>(null);
  readonly guardando = signal(false);

  /** Lo escrito en cada proveedor y aún no guardado: el refresco de cada 30 s no lo pisa. */
  private borradoresProveedor: Record<number, ProveedorCambio> = {};
  nuevoProveedor: ProveedorCambio = { nombre: '', gateway: '', prefijo: '', canales: null, prioridad: 3, habilitado: true };

  ngOnInit(): void {
    this.cargar();
    // el último minuto cambia cada minuto
    this.refresco = setInterval(() => this.cargar(), 30_000);
  }

  ngOnDestroy(): void {
    if (this.refresco) clearInterval(this.refresco);
  }

  borradorProveedor(p: Proveedor): ProveedorCambio {
    return this.borradoresProveedor[p.id] ??= {
      nombre: p.nombre, gateway: p.gateway, prefijo: p.prefijo, canales: p.canales, prioridad: p.prioridad,
      habilitado: p.habilitado
    };
  }

  num(evento: Event): number {
    return Number((evento.target as HTMLInputElement).value);
  }

  numONulo(evento: Event): number | null {
    const texto = (evento.target as HTMLInputElement).value.trim();
    return texto === '' ? null : Number(texto);
  }

  switchClase(on: boolean): string {
    return tuiSwitch(on);
  }

  perillaClase(on: boolean): string {
    return tuiPerilla(on);
  }

  decision(m: UltimoMinuto): string {
    return DECISION[m.decision] ?? m.decision;
  }

  decisionClase(m: UltimoMinuto): string {
    if (m.decision === 'SUBE') return 'text-(--ok)';
    if (m.decision === 'BAJA' || m.decision === 'CANALES_LLENOS') return 'text-(--ro)';
    return '';
  }

  motivoCambio(motivo: string): string {
    return MOTIVO_CAMBIO[motivo] ?? motivo;
  }

  /** Guarda en el momento: el switch al tocarlo, los números al salir del campo. */
  guardarTramo(t: Tramo, cambio: Partial<TramoCambio>): void {
    const datos: TramoCambio = {
      activo: t.activo, intensidadInicial: t.intensidadInicial, esperaMaximaSeg: t.esperaMaximaSeg, ...cambio
    };
    if (!Number.isInteger(datos.intensidadInicial) || datos.intensidadInicial < 1
        || !Number.isInteger(datos.esperaMaximaSeg) || datos.esperaMaximaSeg < 1) {
      this.toast.warning('El arranque y la espera deben ser números enteros mayores que cero');
      this.cargar(); // vuelve a mostrar lo guardado
      return;
    }
    this.guardando.set(true);
    this.servicio.guardarTramo(t.idSubcartera, datos).subscribe({
      next: guardado => {
        // se pinta lo que devolvió el backend sin esperar la recarga
        this.estado.update(e => e && { ...e, tramos: e.tramos.map(x => x.idSubcartera === guardado.idSubcartera ? guardado : x) });
        this.toast.success(cambio.activo === undefined ? `${guardado.nombre}: guardado`
          : guardado.activo ? `${guardado.nombre}: intensidad automática encendida` : `${guardado.nombre}: intensidad manual`);
        this.guardando.set(false);
      },
      error: (err: HttpErrorResponse) => { this.fallo(err); this.cargar(); }
    });
  }

  guardarProveedor(id: number, b: ProveedorCambio): void {
    this.guardando.set(true);
    this.servicio.guardarProveedor(id, b).subscribe({
      next: p => {
        this.toast.success(`Proveedor ${p.nombre} guardado`);
        this.estado.update(e => e && { ...e, proveedores: e.proveedores.map(x => x.id === p.id ? p : x) });
        delete this.borradoresProveedor[id];
        this.guardando.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  agregarProveedor(): void {
    this.guardando.set(true);
    this.servicio.crearProveedor(this.nuevoProveedor).subscribe({
      next: p => {
        this.toast.success(`Proveedor ${p.nombre} agregado`);
        this.nuevoProveedor = { nombre: '', gateway: '', prefijo: '', canales: null, prioridad: 3, habilitado: true };
        this.guardando.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  usar(p: Proveedor): void {
    if (!confirm(`¿Pasar todas las llamadas a ${p.nombre} (${p.gateway})?`)) return;
    this.guardando.set(true);
    this.servicio.usarProveedor(p.id).subscribe({
      next: () => {
        this.toast.success(`Las llamadas salen ahora por ${p.nombre}`);
        this.guardando.set(false);
        this.cargar();
      },
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  private cargar(): void {
    this.servicio.estado().subscribe({
      next: e => this.estado.set(e),
      error: (err: HttpErrorResponse) => this.fallo(err)
    });
  }

  private fallo(err: HttpErrorResponse): void {
    this.guardando.set(false);
    this.toast.error(err.error?.error ?? 'No se pudo completar la operación');
  }
}
