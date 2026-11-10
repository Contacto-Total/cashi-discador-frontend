import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  AsesorConvenio,
  ConvenioActivo,
  ConvenioImportService,
  ConvenioTrasladoHistorial
} from './convenio-import.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-convenio-traslados',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="bg-slate-900/80 backdrop-blur rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
      <div class="p-6 border-b border-slate-800 flex flex-wrap items-start justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
            <lucide-angular name="arrow-left-right" [size]="22" class="text-violet-400"></lucide-angular>
          </div>
          <div>
            <h2 class="text-lg font-bold text-white">Traslado de convenios</h2>
            <p class="text-sm text-gray-400 mt-0.5 max-w-xl">
              Pasa un convenio activo a otro asesor. Queda registrado el asesor anterior, el nuevo, la fecha del traslado y el motivo.
            </p>
          </div>
        </div>
        <div class="px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-gray-300">
          <span class="font-semibold text-white">{{ convenios().length }}</span>
          {{ convenios().length === 1 ? 'convenio activo' : 'convenios activos' }}
        </div>
      </div>

      <div class="p-6">
        <div class="flex flex-wrap gap-3 mb-5">
          <div class="relative flex-1 min-w-[240px]">
            <lucide-angular name="search" [size]="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"></lucide-angular>
            <input type="text"
                   [ngModel]="texto()"
                   (ngModelChange)="texto.set($event)"
                   (keyup.enter)="cargarConvenios()"
                   placeholder="Buscar por documento o por asesor"
                   class="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition">
            @if (texto()) {
              <button (click)="limpiarBusqueda()"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                <lucide-angular name="x" [size]="16"></lucide-angular>
              </button>
            }
          </div>
          <button (click)="cargarConvenios()"
                  class="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
            <lucide-angular name="search" [size]="16"></lucide-angular>
            Buscar
          </button>
        </div>

        @if (cargando()) {
          <div class="space-y-2">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="h-12 rounded-lg bg-slate-800/60 animate-pulse"></div>
            }
          </div>
        } @else if (convenios().length === 0) {
          <div class="py-14 flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-3">
              <lucide-angular name="inbox" [size]="26" class="text-gray-500"></lucide-angular>
            </div>
            <p class="text-sm font-medium text-gray-300">No hay convenios activos para mostrar</p>
            <p class="text-xs text-gray-500 mt-1">Prueba con otro documento o con el nombre de otro asesor.</p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-slate-800">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-800/60 text-left text-gray-400 text-[11px] uppercase tracking-wider">
                  <th class="px-4 py-3 font-semibold">Documento</th>
                  <th class="px-4 py-3 font-semibold">Periodo</th>
                  <th class="px-4 py-3 font-semibold">Origen</th>
                  <th class="px-4 py-3 font-semibold">Asesor responsable</th>
                  <th class="px-4 py-3 font-semibold">Convenio desde</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                @for (c of convenios(); track c.id) {
                  <tr class="hover:bg-slate-800/40 transition-colors">
                    <td class="px-4 py-3 font-mono font-semibold text-white">{{ c.documento }}</td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded-md bg-slate-800 text-gray-300 text-xs font-medium">{{ periodoTexto(c.periodoOrigen) }}</span>
                    </td>
                    <td class="px-4 py-3">
                      @if (c.origen === 'PROPIO') {
                        <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">Propio</span>
                      } @else {
                        <span class="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-medium">Otro estudio</span>
                      }
                    </td>
                    <td class="px-4 py-3">
                      @if (c.nombreResponsable) {
                        <div class="flex items-center gap-2.5">
                          <div class="w-8 h-8 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold flex items-center justify-center shrink-0">
                            {{ iniciales(c.nombreResponsable) }}
                          </div>
                          <span class="text-white">{{ c.nombreResponsable }}</span>
                        </div>
                      } @else {
                        <span class="text-gray-500 italic">Sin asignar</span>
                      }
                    </td>
                    <td class="px-4 py-3 text-gray-400">
                      <span class="inline-flex items-center gap-1.5">
                        <lucide-angular name="calendar" [size]="14" class="text-gray-500"></lucide-angular>
                        {{ c.fechaCambio | date:'dd/MM/yyyy' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right whitespace-nowrap">
                      <button (click)="verHistorial(c)"
                              class="px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-lg mr-2 inline-flex items-center gap-1.5 transition-colors">
                        <lucide-angular name="history" [size]="14"></lucide-angular>
                        Historial
                      </button>
                      <button (click)="abrirTraslado(c)"
                              class="px-3 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg inline-flex items-center gap-1.5 transition-colors">
                        <lucide-angular name="arrow-left-right" [size]="14"></lucide-angular>
                        Trasladar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    @if (historialDe(); as hc) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="historialDe.set(null)"></div>
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
          <div class="p-5 border-b border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                <lucide-angular name="history" [size]="20" class="text-violet-400"></lucide-angular>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Historial de traslados</h3>
                <p class="text-sm text-gray-400">Documento <span class="font-mono text-gray-200">{{ hc.documento }}</span></p>
              </div>
            </div>
            <button (click)="historialDe.set(null)" class="text-gray-400 hover:text-white p-1">
              <lucide-angular name="x" [size]="18"></lucide-angular>
            </button>
          </div>
          <div class="p-5 overflow-y-auto">
            @if (historial().length === 0) {
              <div class="py-8 flex flex-col items-center text-center">
                <lucide-angular name="inbox" [size]="28" class="text-gray-500 mb-2"></lucide-angular>
                <p class="text-sm text-gray-400">Este convenio todavía no tiene traslados.</p>
              </div>
            } @else {
              <ol class="relative border-l border-slate-600 ml-2 space-y-5">
                @for (h of historial(); track h.id) {
                  <li class="ml-5">
                    <span class="absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full bg-violet-500 ring-4 ring-slate-800"></span>
                    <div class="bg-slate-900/60 border border-slate-700 rounded-xl p-3.5">
                      <div class="flex items-center justify-between gap-2 mb-2">
                        <span class="inline-flex items-center gap-1.5 text-xs font-medium text-violet-300">
                          <lucide-angular name="calendar" [size]="13"></lucide-angular>
                          {{ h.fechaTraslado | date:'dd/MM/yyyy' }}
                        </span>
                        <span class="text-xs text-gray-500">Por {{ h.registradoPor || '-' }}</span>
                      </div>
                      <div class="flex items-center flex-wrap gap-2 text-sm">
                        <span class="text-gray-300">{{ h.nombreAnterior || 'Sin asignar' }}</span>
                        <lucide-angular name="arrow-right" [size]="14" class="text-gray-500"></lucide-angular>
                        <span class="font-semibold text-white">{{ h.nombreNuevo || h.idAgenteNuevo }}</span>
                      </div>
                      @if (h.motivo) {
                        <p class="text-xs text-gray-400 mt-2">{{ h.motivo }}</p>
                      }
                    </div>
                  </li>
                }
              </ol>
            }
          </div>
        </div>
      </div>
    }

    @if (trasladoDe(); as tc) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="cerrarTraslado()"></div>
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <div class="p-5 border-b border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center">
                <lucide-angular name="arrow-left-right" [size]="20" class="text-violet-400"></lucide-angular>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Trasladar convenio</h3>
                <p class="text-sm text-gray-400">Documento <span class="font-mono text-gray-200">{{ tc.documento }}</span></p>
              </div>
            </div>
            <button (click)="cerrarTraslado()" class="text-gray-400 hover:text-white p-1">
              <lucide-angular name="x" [size]="18"></lucide-angular>
            </button>
          </div>

          <div class="p-5 space-y-5">
            <div class="flex items-center gap-3 bg-slate-900/60 border border-slate-700 rounded-xl p-3.5">
              <div class="flex-1 min-w-0">
                <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Asesor actual</p>
                <p class="text-sm font-medium text-white truncate">{{ tc.nombreResponsable || 'Sin asignar' }}</p>
              </div>
              <lucide-angular name="arrow-right" [size]="18" class="text-violet-400 shrink-0"></lucide-angular>
              <div class="flex-1 min-w-0">
                <p class="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Asesor nuevo</p>
                <p class="text-sm font-medium truncate" [class]="nombreNuevo() ? 'text-violet-300' : 'text-gray-500'">
                  {{ nombreNuevo() || 'Por elegir' }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1.5">Asesor nuevo</label>
              <select [ngModel]="idAgenteNuevo()"
                      (ngModelChange)="idAgenteNuevo.set($event)"
                      class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition">
                <option [ngValue]="null">Selecciona un asesor</option>
                @for (a of asesoresDisponibles(); track a.id) {
                  <option [ngValue]="a.id">{{ a.nombre }}{{ a.subcartera ? ' · ' + a.subcartera : '' }}</option>
                }
              </select>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-gray-300 mb-1.5">Fecha de traslado</label>
                <input type="date"
                       [ngModel]="fechaTraslado()"
                       (ngModelChange)="fechaTraslado.set($event)"
                       class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition">
              </div>
              <div>
                <label class="block text-xs font-medium text-gray-300 mb-1.5">Motivo</label>
                <input type="text"
                       maxlength="255"
                       [ngModel]="motivo()"
                       (ngModelChange)="motivo.set($event)"
                       placeholder="Ej.: el asesor ya no labora"
                       class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 focus:outline-none transition">
              </div>
            </div>
          </div>

          <div class="p-5 border-t border-slate-700 flex justify-end gap-3">
            <button (click)="cerrarTraslado()"
                    class="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors">
              Cancelar
            </button>
            <button (click)="confirmarTraslado()"
                    [disabled]="guardando() || !idAgenteNuevo() || !fechaTraslado() || !motivo().trim()"
                    class="px-5 py-2.5 text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl inline-flex items-center gap-2 transition-colors">
              @if (guardando()) {
                <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
                Guardando...
              } @else {
                <lucide-angular name="check" [size]="16"></lucide-angular>
                Confirmar traslado
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConvenioTrasladosComponent implements OnInit {
  private convenioService = inject(ConvenioImportService);
  private notificationService = inject(NotificationService);

  texto = signal('');
  cargando = signal(false);
  guardando = signal(false);
  convenios = signal<ConvenioActivo[]>([]);
  asesores = signal<AsesorConvenio[]>([]);
  historial = signal<ConvenioTrasladoHistorial[]>([]);
  historialDe = signal<ConvenioActivo | null>(null);
  trasladoDe = signal<ConvenioActivo | null>(null);
  idAgenteNuevo = signal<number | null>(null);
  fechaTraslado = signal(this.hoy());
  motivo = signal('');

  ngOnInit(): void {
    this.cargarConvenios();
    this.convenioService.obtenerAsesores().subscribe({
      next: (lista) => this.asesores.set(lista),
      error: () => this.notificationService.error('Error', 'No se pudo cargar la lista de asesores')
    });
  }

  nombreNuevo(): string {
    const id = this.idAgenteNuevo();
    return this.asesores().find(a => a.id === id)?.nombre ?? '';
  }

  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/).filter(Boolean);
    return ((partes[0]?.[0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase();
  }

  periodoTexto(periodo?: string | null): string {
    return periodo && /^\d{6}$/.test(periodo) ? `${periodo.slice(4)}/${periodo.slice(0, 4)}` : (periodo || '-');
  }

  limpiarBusqueda(): void {
    this.texto.set('');
    this.cargarConvenios();
  }

  asesoresDisponibles(): AsesorConvenio[] {
    const actual = this.trasladoDe()?.idAgenteResponsable;
    return this.asesores().filter(a => a.id !== actual);
  }

  cargarConvenios(): void {
    this.cargando.set(true);
    this.convenioService.obtenerConveniosActivos(this.texto().trim()).subscribe({
      next: (lista) => {
        this.convenios.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.notificationService.error('Error', 'No se pudieron cargar los convenios');
      }
    });
  }

  verHistorial(convenio: ConvenioActivo): void {
    this.historial.set([]);
    this.historialDe.set(convenio);
    this.convenioService.obtenerHistorialTraslados(convenio.id).subscribe({
      next: (lista) => this.historial.set(lista),
      error: () => this.notificationService.error('Error', 'No se pudo cargar el historial')
    });
  }

  abrirTraslado(convenio: ConvenioActivo): void {
    this.idAgenteNuevo.set(null);
    this.fechaTraslado.set(this.hoy());
    this.motivo.set('');
    this.trasladoDe.set(convenio);
  }

  cerrarTraslado(): void {
    this.trasladoDe.set(null);
  }

  confirmarTraslado(): void {
    const convenio = this.trasladoDe();
    const idNuevo = this.idAgenteNuevo();
    if (!convenio || !idNuevo || this.guardando()) {
      return;
    }
    this.guardando.set(true);
    this.convenioService.trasladarConvenio({
      idConvenio: convenio.id,
      idAgenteNuevo: idNuevo,
      fechaTraslado: this.fechaTraslado(),
      motivo: this.motivo().trim()
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarTraslado();
        this.notificationService.success('Traslado registrado', `El convenio ${convenio.documento} fue trasladado`);
        this.cargarConvenios();
      },
      error: (err) => {
        this.guardando.set(false);
        const detalle = typeof err.error === 'string' ? err.error : 'No se pudo registrar el traslado';
        this.notificationService.error('Error en el traslado', detalle);
      }
    });
  }

  private hoy(): string {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
  }
}
