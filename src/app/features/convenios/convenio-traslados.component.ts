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
    <div class="bg-slate-900/80 backdrop-blur rounded-xl shadow-lg border border-slate-800 overflow-hidden">
      <div class="p-5 border-b border-slate-800">
        <h2 class="text-lg font-bold text-white flex items-center gap-2">
          <lucide-angular name="arrow-left-right" [size]="20" class="text-violet-400"></lucide-angular>
          Traslado de convenios
        </h2>
        <p class="text-sm text-gray-400 mt-1">
          Pasa un convenio activo a otro asesor. Queda registrado el asesor anterior, el nuevo, la fecha del traslado y el motivo.
        </p>
      </div>

      <div class="p-5">
        <div class="flex gap-3 mb-4">
          <div class="relative flex-1">
            <lucide-angular name="search" [size]="16" class="absolute left-3 top-3 text-gray-500"></lucide-angular>
            <input type="text"
                   [ngModel]="texto()"
                   (ngModelChange)="texto.set($event)"
                   (keyup.enter)="cargarConvenios()"
                   placeholder="Buscar por documento o por asesor"
                   class="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none">
          </div>
          <button (click)="cargarConvenios()"
                  class="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
            Buscar
          </button>
        </div>

        @if (cargando()) {
          <p class="text-sm text-gray-400 py-6 text-center">Cargando convenios...</p>
        } @else if (convenios().length === 0) {
          <p class="text-sm text-gray-500 py-6 text-center">No hay convenios activos para mostrar.</p>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-left text-gray-400 text-xs uppercase">
                  <th class="p-2">Documento</th>
                  <th class="p-2">Periodo</th>
                  <th class="p-2">Origen</th>
                  <th class="p-2">Asesor responsable</th>
                  <th class="p-2">Convenio desde</th>
                  <th class="p-2"></th>
                </tr>
              </thead>
              <tbody>
                @for (c of convenios(); track c.id) {
                  <tr class="border-t border-slate-800">
                    <td class="p-2 font-mono text-white">{{ c.documento }}</td>
                    <td class="p-2 text-gray-300">{{ c.periodoOrigen || '-' }}</td>
                    <td class="p-2 text-gray-300">{{ c.origen === 'PROPIO' ? 'Propio' : 'Otro estudio' }}</td>
                    <td class="p-2 text-white">{{ c.nombreResponsable || 'Sin asignar' }}</td>
                    <td class="p-2 text-gray-400">{{ c.fechaCambio | date:'dd/MM/yyyy' }}</td>
                    <td class="p-2 text-right whitespace-nowrap">
                      <button (click)="verHistorial(c)"
                              class="px-2 py-1 text-xs text-gray-300 hover:text-white border border-slate-700 rounded-lg mr-2">
                        Historial
                      </button>
                      <button (click)="abrirTraslado(c)"
                              class="px-2 py-1 text-xs bg-violet-600 hover:bg-violet-500 text-white rounded-lg">
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
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
          <div class="p-5 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold text-white">Historial de traslados</h3>
              <p class="text-sm text-gray-400">Documento {{ hc.documento }}</p>
            </div>
            <button (click)="historialDe.set(null)" class="text-gray-400 hover:text-white">
              <lucide-angular name="x" [size]="18"></lucide-angular>
            </button>
          </div>
          <div class="p-5 overflow-y-auto">
            @if (historial().length === 0) {
              <p class="text-sm text-gray-500 text-center py-4">Este convenio todavía no tiene traslados.</p>
            } @else {
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-gray-400 text-xs uppercase">
                    <th class="p-2">Fecha traslado</th>
                    <th class="p-2">De</th>
                    <th class="p-2">A</th>
                    <th class="p-2">Motivo</th>
                    <th class="p-2">Hecho por</th>
                  </tr>
                </thead>
                <tbody>
                  @for (h of historial(); track h.id) {
                    <tr class="border-t border-slate-700/50">
                      <td class="p-2 text-gray-300">{{ h.fechaTraslado | date:'dd/MM/yyyy' }}</td>
                      <td class="p-2 text-gray-300">{{ h.nombreAnterior || '-' }}</td>
                      <td class="p-2 text-white">{{ h.nombreNuevo || h.idAgenteNuevo }}</td>
                      <td class="p-2 text-gray-400">{{ h.motivo || '-' }}</td>
                      <td class="p-2 text-gray-400">{{ h.registradoPor || '-' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>
    }

    @if (trasladoDe(); as tc) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="cerrarTraslado()"></div>
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <div class="p-5 border-b border-slate-700">
            <h3 class="text-lg font-bold text-white">Trasladar convenio</h3>
            <p class="text-sm text-gray-400">Documento {{ tc.documento }} · Actual: {{ tc.nombreResponsable || 'Sin asignar' }}</p>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="block text-xs text-gray-400 mb-1">Asesor nuevo</label>
              <select [ngModel]="idAgenteNuevo()"
                      (ngModelChange)="idAgenteNuevo.set($event)"
                      class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
                <option [ngValue]="null">Selecciona un asesor</option>
                @for (a of asesoresDisponibles(); track a.id) {
                  <option [ngValue]="a.id">{{ a.nombre }}{{ a.subcartera ? ' · ' + a.subcartera : '' }}</option>
                }
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1">Fecha de traslado</label>
              <input type="date"
                     [ngModel]="fechaTraslado()"
                     (ngModelChange)="fechaTraslado.set($event)"
                     class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
            </div>
            <div>
              <label class="block text-xs text-gray-400 mb-1">Motivo</label>
              <input type="text"
                     maxlength="255"
                     [ngModel]="motivo()"
                     (ngModelChange)="motivo.set($event)"
                     placeholder="Ej.: el asesor ya no labora"
                     class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none">
            </div>
          </div>
          <div class="p-5 border-t border-slate-700 flex justify-end gap-3">
            <button (click)="cerrarTraslado()"
                    class="px-4 py-2 text-sm text-gray-300 hover:text-white border border-slate-600 rounded-lg">
              Cancelar
            </button>
            <button (click)="confirmarTraslado()"
                    [disabled]="guardando() || !idAgenteNuevo() || !fechaTraslado() || !motivo().trim()"
                    class="px-4 py-2 text-sm bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg">
              {{ guardando() ? 'Guardando...' : 'Confirmar traslado' }}
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
