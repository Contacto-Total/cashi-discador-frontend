import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { EquipoService } from './equipo.service';
import { ControlAcceso, EquipoAutorizado } from './asistencia.models';

const ESTILOS = {
  etiqueta: 'text-xs font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:text-[#8491a3] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonSecundario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonPrimario: 'inline-flex h-[38px] items-center gap-[7px] rounded-lg bg-[#0f172a] px-3.5 text-[13px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:!text-[#0f172a] dark:hover:bg-slate-200',
  botonIcono: 'inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-[7px] border border-[#e6e9ee] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-default disabled:opacity-45 dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200',
  th: 'whitespace-nowrap px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  td: 'whitespace-nowrap px-3 py-2 text-[12.5px]',
  tarjeta: 'flex flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  rotulo: 'text-[11.5px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  cifra: 'text-2xl font-extrabold leading-[1.3] tracking-[-0.02em] tabular-nums',
  pie: 'mt-auto pt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400',
  icono: 'flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f1f3f6] text-[#0f172a] dark:bg-slate-800 dark:text-slate-100',
  titulo: 'mb-2.5 text-[13.5px] font-extrabold tracking-[-0.01em]',
  panel: 'overflow-x-auto rounded-xl border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900'
} as const;

/**
 * Control de acceso: qué computadoras pueden abrir Cashi.
 *
 * Es una lista blanca, no una detección: si la máquina no está, no entra, y el
 * intento queda registrado. Lo que se autoriza es la máquina y no la red,
 * porque CASTIGO trabaja el sábado desde casa y ahí la IP cambia cada semana.
 *
 * Un equipo no se borra, se da de baja: borrarlo dejaría los intentos y las
 * conexiones apuntando a la nada, que es justo lo que hay que poder auditar.
 */
@Component({
  selector: 'app-control-acceso',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-[3px]">
            <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Control de Acceso</h1>
            <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              Solo las computadoras con pase instalado pueden abrir Cashi
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" [class]="estilos.botonPrimario" (click)="abrirAlta()">
              <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
              Registrar equipo
            </button>
          </div>
        </div>

        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="ubicacion">Ubicación</label>
            <select id="ubicacion" [class]="estilos.campo + ' w-[180px]'"
                    [ngModel]="filtroUbicacion()" (ngModelChange)="filtroUbicacion.set($event)">
              <option value="">Todas</option>
              <option value="OFICINA">Oficina</option>
              <option value="REMOTO">Remoto</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="estado-eq">Estado</label>
            <select id="estado-eq" [class]="estilos.campo + ' w-[180px]'"
                    [ngModel]="filtroEstado()" (ngModelChange)="filtroEstado.set($event)">
              <option value="ACTIVOS">Activos</option>
              <option value="BAJA">De baja</option>
              <option value="TODOS">Todos</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="buscar-eq">Buscar</label>
            <input id="buscar-eq" type="search" placeholder="Equipo o persona"
                   [class]="estilos.campo + ' w-[210px]'"
                   [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)">
          </div>
        </div>
      </div>

      <div class="px-7 py-5">
        @if (cargando()) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando equipos…</p>
        } @else if (panel(); as p) {
          <div class="aparecer">

            <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="shield-check" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Equipos activos</h3>
                </div>
                <div [class]="estilos.cifra">{{ p.activos }}</div>
                <p [class]="estilos.pie">{{ p.enOficina }} en oficina, {{ p.remotos }} remotos</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="ban" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Dados de baja</h3>
                </div>
                <div [class]="estilos.cifra + ' !text-[#5f6c80] dark:!text-slate-400'">{{ p.deBaja }}</div>
                <p [class]="estilos.pie">Ya no pueden entrar</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="shield-alert" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Intentos rechazados</h3>
                </div>
                <div [class]="estilos.cifra + (p.rechazos7Dias > 0 ? ' !text-[#b91c1c] dark:!text-red-300' : '')">
                  {{ p.rechazos7Dias }}
                </div>
                <p [class]="estilos.pie">Últimos 7 días</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-2.5">
                  <span [class]="estilos.icono">
                    <lucide-angular name="alarm-clock" [size]="15" class="block"></lucide-angular>
                  </span>
                  <h3 [class]="estilos.rotulo">Sin usar hace 30 días</h3>
                </div>
                <div [class]="estilos.cifra + (p.sinUsar30Dias > 0 ? ' !text-[#92400e] dark:!text-amber-300' : '')">
                  {{ p.sinUsar30Dias }}
                </div>
                <p [class]="estilos.pie">Candidatos a dar de baja</p>
              </div>
            </div>

            <h2 [class]="estilos.titulo">Equipos autorizados</h2>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Equipos con pase instalado</caption>
                <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                  <tr>
                    <th scope="col" [class]="estilos.th">Equipo</th>
                    <th scope="col" [class]="estilos.th">Asignado a</th>
                    <th scope="col" [class]="estilos.th">Ámbito</th>
                    <th scope="col" [class]="estilos.th">Ubicación</th>
                    <th scope="col" [class]="estilos.th">Instalado</th>
                    <th scope="col" [class]="estilos.th">Última conexión</th>
                    <th scope="col" [class]="estilos.th">Estado</th>
                    <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (e of equipos(); track e.id) {
                    <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#fafbfc] dark:border-slate-800 dark:hover:bg-slate-800/40"
                        [class.opacity-60]="!e.activo">
                      <td [class]="estilos.td + ' font-bold'">{{ e.nombre }}</td>
                      <td [class]="estilos.td">{{ e.asignadoA ?? 'Sin asignar' }}</td>
                      <td [class]="estilos.td + ' text-[#5f6c80] dark:text-slate-400'">{{ e.subcartera ?? '—' }}</td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                              [class]="e.ubicacion === 'REMOTO'
                                ? 'bg-[#f1f3f6] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400'
                                : 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300'">
                          {{ e.ubicacion === 'REMOTO' ? 'Remoto' : 'Oficina' }}
                        </span>
                      </td>
                      <td [class]="estilos.td + ' tabular-nums'">{{ e.instaladoEn | date: 'dd/MM/yyyy' }}</td>
                      <td [class]="estilos.td + ' tabular-nums'">
                        {{ e.ultimaConexion ? (e.ultimaConexion | date: 'dd/MM HH:mm') : 'Nunca' }}
                        @if (e.diasSinUsar != null && e.diasSinUsar >= 30) {
                          <span class="ml-1.5 text-[11px] text-[#92400e] dark:text-amber-300">
                            hace {{ e.diasSinUsar }} días
                          </span>
                        }
                      </td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[11.5px] font-bold"
                              [class]="e.activo
                                ? 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300'
                                : 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300'">
                          {{ e.activo ? 'Activo' : 'De baja' }}
                        </span>
                        @if (!e.activo && e.motivoBaja) {
                          <span class="ml-1.5 text-[11px] text-[#5f6c80] dark:text-slate-400">{{ e.motivoBaja }}</span>
                        }
                      </td>
                      <td [class]="estilos.td + ' text-right'">
                        @if (e.activo) {
                          <button type="button" [class]="estilos.botonIcono" (click)="abrirBaja(e)"
                                  [attr.aria-label]="'Dar de baja ' + e.nombre" title="Dar de baja">
                            <lucide-angular name="ban" [size]="13" class="block"></lucide-angular>
                          </button>
                        } @else {
                          <button type="button" [class]="estilos.botonIcono" (click)="reactivar(e)"
                                  [attr.aria-label]="'Reactivar ' + e.nombre" title="Reactivar">
                            <lucide-angular name="rotate-ccw" [size]="13" class="block"></lucide-angular>
                          </button>
                        }
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="8" class="px-3 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                        {{ panel()?.equipos?.length ? 'Ningún equipo cuadra con el filtro' : 'Todavía no hay equipos registrados' }}
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <h2 [class]="estilos.titulo + ' !mt-6'">Intentos rechazados</h2>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Intentos de entrada desde equipos sin pase</caption>
                <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                  <tr>
                    <th scope="col" [class]="estilos.th">Cuándo</th>
                    <th scope="col" [class]="estilos.th">Usuario</th>
                    <th scope="col" [class]="estilos.th">Origen</th>
                    <th scope="col" [class]="estilos.th">Dispositivo</th>
                    <th scope="col" [class]="estilos.th">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of p.rechazos; track r.id) {
                    <tr class="border-b border-[#f1f3f6] last:border-0 dark:border-slate-800">
                      <td [class]="estilos.td + ' tabular-nums'">{{ r.cuando | date: 'dd/MM HH:mm' }}</td>
                      <td [class]="estilos.td">
                        <span class="font-semibold">{{ r.usuario }}</span>
                        @if (r.nombreAgente) {
                          <span class="ml-1.5 text-[#5f6c80] dark:text-slate-400">{{ r.nombreAgente }}</span>
                        }
                      </td>
                      <td [class]="estilos.td + ' text-[#5f6c80] dark:text-slate-400'">{{ r.origen }}</td>
                      <td [class]="estilos.td">{{ r.dispositivo ?? '—' }}</td>
                      <td [class]="estilos.td">{{ r.motivo }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="5" class="px-3 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                        Ningún intento rechazado en los últimos 7 días
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>

      <!-- Registrar equipo -->
      @if (alta()) {
        <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarAlta()"></div>
        <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,480px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
               role="dialog" aria-modal="true" aria-labelledby="titulo-alta">
            <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
              <div>
                <h2 id="titulo-alta" class="!m-0 text-[15px] font-extrabold">Registrar equipo</h2>
                <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  El pase lo genera el navegador la primera vez que se abre Cashi
                </p>
              </div>
              <button type="button" [class]="estilos.botonIcono" (click)="cerrarAlta()" aria-label="Cerrar">
                <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
              </button>
            </header>

            <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-nombre">Nombre del equipo</label>
                <input id="eq-nombre" type="text" placeholder="PC-OFI-01" [class]="estilos.campo"
                       [(ngModel)]="nuevo.nombre">
              </div>
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-huella">Pase</label>
                <input id="eq-huella" type="text" placeholder="Pégalo desde la máquina que se registra"
                       [class]="estilos.campo" [(ngModel)]="nuevo.huella">
                <!-- Registrar la máquina desde la que se está mirando es el caso
                     más común: se evita tener que copiarlo a mano. -->
                <button type="button"
                        class="self-start text-[11.5px] font-semibold text-[#2563eb] hover:underline"
                        (click)="usarEsteEquipo()">
                  Usar el pase de esta computadora
                </button>
              </div>
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-ubicacion">Ubicación</label>
                <select id="eq-ubicacion" [class]="estilos.campo" [(ngModel)]="nuevo.ubicacion">
                  <option value="OFICINA">Oficina</option>
                  <option value="REMOTO">Remoto</option>
                </select>
              </div>
              @if (error()) {
                <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
              }
            </div>

            <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrarAlta()">Cancelar</button>
              <button type="button" [class]="estilos.botonPrimario" (click)="registrar()" [disabled]="guardando()">
                <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
                {{ guardando() ? 'Guardando…' : 'Registrar' }}
              </button>
            </footer>
          </div>
        </div>
      }

      <!-- Dar de baja -->
      @if (baja(); as equipo) {
        <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarBaja()"></div>
        <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="pointer-events-auto w-[min(100%,440px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
               role="dialog" aria-modal="true" aria-labelledby="titulo-baja">
            <header class="border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
              <h2 id="titulo-baja" class="!m-0 text-[15px] font-extrabold">Dar de baja {{ equipo.nombre }}</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Deja de poder entrar. El equipo no se borra: su historial se conserva.
              </p>
            </header>
            <div class="flex flex-col gap-1.5 px-5 py-4">
              <label [class]="estilos.etiqueta" for="motivo-baja">Motivo</label>
              <input id="motivo-baja" type="text" placeholder="Ej.: se devolvió a sistemas"
                     [class]="estilos.campo" [(ngModel)]="motivoBaja">
              @if (error()) {
                <p class="!m-0 mt-1 text-xs text-[#b91c1c]">{{ error() }}</p>
              }
            </div>
            <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrarBaja()">Cancelar</button>
              <button type="button" [class]="estilos.botonPrimario" (click)="confirmarBaja()" [disabled]="guardando()">
                <lucide-angular name="ban" [size]="15" class="block"></lucide-angular>
                {{ guardando() ? 'Guardando…' : 'Dar de baja' }}
              </button>
            </footer>
          </div>
        </div>
      }
    </div>
  `
})
export class ControlAccesoComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly equipoService = inject(EquipoService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;

  readonly panel = signal<ControlAcceso | null>(null);
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly filtroUbicacion = signal('');
  readonly filtroEstado = signal('ACTIVOS');
  readonly busqueda = signal('');

  readonly alta = signal(false);
  readonly baja = signal<EquipoAutorizado | null>(null);
  motivoBaja = '';

  nuevo: EquipoAutorizado = {
    nombre: '',
    huella: '',
    idUsuario: null,
    idSubcartera: null,
    ubicacion: 'OFICINA'
  };

  /**
   * Los equipos que pasan los tres filtros. Se filtra en el cliente porque son
   * decenas de filas: volver al servidor por cada letra solo añadiría espera.
   */
  readonly equipos = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();
    const ubicacion = this.filtroUbicacion();
    const estado = this.filtroEstado();

    return (this.panel()?.equipos ?? []).filter(e => {
      if (estado === 'ACTIVOS' && !e.activo) {
        return false;
      }
      if (estado === 'BAJA' && e.activo) {
        return false;
      }
      if (ubicacion && e.ubicacion !== ubicacion) {
        return false;
      }
      if (!texto) {
        return true;
      }
      return e.nombre.toLowerCase().includes(texto)
        || (e.asignadoA ?? '').toLowerCase().includes(texto);
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.servicio.controlAcceso().subscribe({
      next: p => {
        this.panel.set(p);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar el control de acceso');
        this.cargando.set(false);
      }
    });
  }

  // ==================== ALTA ====================

  abrirAlta(): void {
    this.alta.set(true);
    this.error.set('');
    this.nuevo = { nombre: '', huella: '', idUsuario: null, idSubcartera: null, ubicacion: 'OFICINA' };
  }

  cerrarAlta(): void {
    this.alta.set(false);
  }

  /** Rellena el pase con el de la máquina desde la que se está mirando. */
  usarEsteEquipo(): void {
    this.nuevo.huella = this.equipoService.paseVisible();
  }

  registrar(): void {
    if (!this.nuevo.nombre.trim()) {
      this.error.set('El equipo necesita un nombre');
      return;
    }
    if (!this.nuevo.huella?.trim()) {
      this.error.set('Falta el pase del equipo');
      return;
    }

    this.guardando.set(true);
    this.servicio.registrarEquipo(this.nuevo).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarAlta();
        this.toast.success('Equipo registrado');
        this.cargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo registrar el equipo');
      }
    });
  }

  // ==================== BAJA ====================

  abrirBaja(equipo: EquipoAutorizado): void {
    this.baja.set(equipo);
    this.motivoBaja = '';
    this.error.set('');
  }

  cerrarBaja(): void {
    this.baja.set(null);
  }

  confirmarBaja(): void {
    const equipo = this.baja();
    if (!equipo?.id) {
      return;
    }
    if (!this.motivoBaja.trim()) {
      this.error.set('Di por qué se da de baja');
      return;
    }

    this.guardando.set(true);
    this.servicio.darDeBajaEquipo(equipo.id, this.motivoBaja.trim()).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarBaja();
        this.toast.success('Equipo dado de baja');
        this.cargar();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo dar de baja');
      }
    });
  }

  reactivar(equipo: EquipoAutorizado): void {
    if (!equipo.id) {
      return;
    }
    this.servicio.reactivarEquipo(equipo.id).subscribe({
      next: () => {
        this.toast.success('Equipo reactivado');
        this.cargar();
      },
      error: () => this.toast.error('No se pudo reactivar el equipo')
    });
  }
}
