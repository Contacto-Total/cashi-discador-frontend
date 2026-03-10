import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  DistribucionPuntosService,
  DistribucionPuntos,
  DistribucionPuntosDetalle,
  ImportResult,
  ConfigDiaLaboral
} from './distribucion-puntos.service';
import { ComisionesService } from '../../../comisiones/services/comisiones.service';
import { Inquilino, Cartera, Subcartera } from '../../../comisiones/models/comision.model';

@Component({
  selector: 'app-distribucion-puntos',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DecimalPipe],
  template: `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <lucide-angular name="percent" [size]="28" class="text-teal-500"></lucide-angular>
          Distribucion de Puntos
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">
          Importar y gestionar la distribucion de puntos diarios por cartera y subcartera
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Proveedor -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proveedor</label>
            <select [(ngModel)]="selectedProveedor" (ngModelChange)="onProveedorChange($event)"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              <option [ngValue]="null">Seleccionar</option>
              @for (prov of proveedores(); track prov.id) {
                <option [ngValue]="prov.id">{{ prov.nombreInquilino }}</option>
              }
            </select>
          </div>

          <!-- Cartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cartera</label>
            <select [(ngModel)]="selectedCartera" (ngModelChange)="onCarteraChange($event)"
              [disabled]="!selectedProveedor"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Seleccionar</option>
              @for (cart of carteras(); track cart.id) {
                <option [ngValue]="cart.id">{{ cart.nombreCartera }}</option>
              }
            </select>
          </div>

          <!-- Subcartera -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subcartera</label>
            <select [(ngModel)]="selectedSubcartera" (ngModelChange)="onSubcarteraChange($event)"
              [disabled]="!selectedCartera"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                     disabled:opacity-50 disabled:cursor-not-allowed">
              <option [ngValue]="null">Seleccionar</option>
              @for (sub of subcarteras(); track sub.id) {
                <option [ngValue]="sub.id">{{ sub.nombreSubcartera }}</option>
              }
            </select>
          </div>

          <!-- Anio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anio</label>
            <select [(ngModel)]="anio"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              @for (a of aniosDisponibles; track a) {
                <option [ngValue]="a">{{ a }}</option>
              }
            </select>
          </div>

          <!-- Mes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mes</label>
            <select [(ngModel)]="mes"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
              @for (m of mesesDisponibles; track m.value) {
                <option [ngValue]="m.value">{{ m.label }}</option>
              }
            </select>
          </div>

          <!-- Buscar -->
          <div class="flex items-end">
            <button (click)="cargarDistribuciones()"
              [disabled]="loading()"
              class="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold
                     rounded-lg transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) {
                <lucide-angular name="loader-2" [size]="18" class="animate-spin"></lucide-angular>
              } @else {
                <lucide-angular name="search" [size]="18"></lucide-angular>
              }
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Upload Section -->
      @if (selectedSubcartera) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <lucide-angular name="upload" [size]="20" class="text-teal-500"></lucide-angular>
            Importar Archivo de Puntos
          </h2>

          <div class="flex flex-col md:flex-row gap-4 items-start">
            <!-- Drag & Drop Zone -->
            <div
              class="flex-1 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
              [class]="isDragOver()
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-teal-400 bg-gray-50 dark:bg-gray-700/50'"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event)"
              (click)="fileInput.click()">

              <input #fileInput type="file" accept=".xlsx,.xls,.csv" class="hidden"
                (change)="onFileSelected($event)" />

              @if (selectedFile()) {
                <div class="flex items-center justify-center gap-3">
                  <lucide-angular name="file-spreadsheet" [size]="32" class="text-teal-500"></lucide-angular>
                  <div class="text-left">
                    <p class="text-sm font-medium text-gray-800 dark:text-white">{{ selectedFile()!.name }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatFileSize(selectedFile()!.size) }}</p>
                  </div>
                  <button (click)="clearFile($event)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <lucide-angular name="x" [size]="18"></lucide-angular>
                  </button>
                </div>
              } @else {
                <lucide-angular name="upload-cloud" [size]="40" class="mx-auto text-gray-400 dark:text-gray-500 mb-2"></lucide-angular>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Arrastra un archivo aqui o <span class="text-teal-500 font-semibold">haz clic para seleccionar</span>
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Formatos: .xlsx, .xls, .csv</p>
              }
            </div>

            <!-- Import Button -->
            <button (click)="importar()"
              [disabled]="!selectedFile() || loading()"
              class="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg
                     transition-colors flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed">
              @if (loading()) {
                <lucide-angular name="loader-2" [size]="18" class="animate-spin"></lucide-angular>
                {{ loadingMessage() }}
              } @else {
                <lucide-angular name="upload" [size]="18"></lucide-angular>
                Importar
              }
            </button>
          </div>

          <!-- Import Result -->
          @if (importResult()) {
            <div class="mt-4 p-3 rounded-lg flex items-center gap-2"
              [class]="importResult()!.exitoso
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'">
              @if (importResult()!.exitoso) {
                <lucide-angular name="check-circle" [size]="20"></lucide-angular>
              } @else {
                <lucide-angular name="alert-circle" [size]="20"></lucide-angular>
              }
              <span class="text-sm font-medium">{{ importResult()!.mensaje }}</span>
            </div>
          }
        </div>
      }

      <!-- Preview Table (after import or viewing detail) -->
      @if (detallePreview()) {
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <lucide-angular name="table" [size]="16" class="text-teal-500"></lucide-angular>
              Detalle de Distribucion de Puntos
            </h3>
            <button (click)="detallePreview.set(null)"
              class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <lucide-angular name="x" [size]="18"></lucide-angular>
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Dia</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Dia Semana</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Punto Original %</th>
                  <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Laborable?</th>
                  <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Punto Efectivo %</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                @for (det of detallePreview()!; track det.dia) {
                  <tr
                    class="transition-colors"
                    [class]="det.esDiaLaboral
                      ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      : 'bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20'">
                    <td class="px-4 py-2 text-gray-900 dark:text-white font-medium">{{ getDiaNumero(det.dia) }}</td>
                    <td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ det.dia }}</td>
                    <td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ getDiaSemana(det.dia) }}</td>
                    <td class="px-4 py-2 text-right text-gray-900 dark:text-white">
                      <div class="flex items-center justify-end gap-2">
                        <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div class="h-2 rounded-full bg-blue-500 transition-all"
                            [style.width.%]="Math.min(det.puntoOriginal * 10, 100)"></div>
                        </div>
                        {{ det.puntoOriginal | number:'1.2-2' }}%
                      </div>
                    </td>
                    <td class="px-4 py-2 text-center">
                      @if (det.esDiaLaboral) {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          Si
                        </span>
                      } @else {
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          No
                        </span>
                      }
                    </td>
                    <td class="px-4 py-2 text-right font-semibold"
                      [class]="det.esDiaLaboral
                        ? 'text-teal-600 dark:text-teal-400'
                        : 'text-gray-400 dark:text-gray-500'">
                      <div class="flex items-center justify-end gap-2">
                        <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div class="h-2 rounded-full bg-teal-500 transition-all"
                            [style.width.%]="Math.min(det.puntoEfectivo * 10, 100)"></div>
                        </div>
                        {{ det.puntoEfectivo | number:'1.2-2' }}%
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
              <tfoot class="bg-gray-100 dark:bg-gray-700 font-bold border-t-2 border-gray-300 dark:border-gray-500">
                <tr>
                  <td colspan="3" class="px-4 py-3 text-gray-900 dark:text-white">TOTAL</td>
                  <td class="px-4 py-3 text-right text-blue-700 dark:text-blue-300">
                    {{ getSumaPuntosOriginal() | number:'1.2-2' }}%
                  </td>
                  <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    {{ getDiasLaborales() }} dias
                  </td>
                  <td class="px-4 py-3 text-right text-teal-700 dark:text-teal-300">
                    {{ getSumaPuntosEfectivo() | number:'1.2-2' }}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      }

      <!-- Existing Distributions List -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-6">
        <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <lucide-angular name="list" [size]="16" class="text-teal-500"></lucide-angular>
            Distribuciones del Periodo: {{ getNombreMes(mes) }} {{ anio }}
          </h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Subcartera</th>
                <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Suma Puntos</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Fecha Carga</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cargado Por</th>
                <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              @if (loading()) {
                <tr>
                  <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="loader-2" [size]="32" class="animate-spin mx-auto mb-2"></lucide-angular>
                    <p>Cargando distribuciones...</p>
                  </td>
                </tr>
              } @else if (distribuciones().length === 0) {
                <tr>
                  <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                    <lucide-angular name="inbox" [size]="48" class="mx-auto mb-2 text-gray-400"></lucide-angular>
                    <p>No hay distribuciones para este periodo</p>
                    <p class="text-xs mt-1">Selecciona un periodo y presiona "Buscar", o importa un nuevo archivo</p>
                  </td>
                </tr>
              } @else {
                @for (dist of distribuciones(); track dist.id) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">{{ dist.nombreCartera }}</td>
                    <td class="px-4 py-3 text-gray-600 dark:text-gray-400">{{ dist.nombreSubcartera }}</td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <div class="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                          <div class="h-2.5 rounded-full bg-teal-500 transition-all"
                            [style.width.%]="Math.min(dist.sumaPuntosOriginal, 100)"></div>
                        </div>
                        <span class="text-sm font-bold text-teal-600 dark:text-teal-400">
                          {{ dist.sumaPuntosOriginal | number:'1.2-2' }}%
                        </span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{{ dist.fechaCarga }}</td>
                    <td class="px-4 py-3 text-gray-600 dark:text-gray-400 text-xs">{{ dist.cargadoPor }}</td>
                    <td class="px-4 py-3 text-center">
                      <div class="flex items-center justify-center gap-1">
                        <button (click)="verDetalle(dist)"
                          class="p-1.5 text-teal-500 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
                          title="Ver detalle">
                          <lucide-angular name="eye" [size]="16"></lucide-angular>
                        </button>
                        <button (click)="eliminarDistribucion(dist.id!)"
                          class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Eliminar">
                          <lucide-angular name="trash-2" [size]="16"></lucide-angular>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        @if (distribuciones().length > 0) {
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span class="font-semibold">{{ distribuciones().length }}</span> distribuciones
            </p>
          </div>
        }
      </div>

      <!-- Config Sabados Panel -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <button (click)="toggleConfigPanel()"
          class="w-full px-4 py-3 flex items-center justify-between text-left
                 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <lucide-angular name="settings" [size]="16" class="text-teal-500"></lucide-angular>
            Configuracion Sabados
          </h3>
          @if (showConfigPanel()) {
            <lucide-angular name="chevron-up" [size]="18" class="text-gray-400"></lucide-angular>
          } @else {
            <lucide-angular name="chevron-down" [size]="18" class="text-gray-400"></lucide-angular>
          }
        </button>

        @if (showConfigPanel()) {
          <div class="border-t border-gray-200 dark:border-gray-600">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Cartera</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Trabaja Sabado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  @if (configs().length === 0) {
                    <tr>
                      <td colspan="2" class="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                        <p class="text-sm">No hay configuraciones registradas</p>
                      </td>
                    </tr>
                  } @else {
                    @for (cfg of configs(); track cfg.id) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td class="px-4 py-3 text-gray-900 dark:text-white font-medium">{{ cfg.nombreCartera }}</td>
                        <td class="px-4 py-3 text-center">
                          <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" [checked]="cfg.trabajaSabado" (change)="toggleConfig(cfg)"
                              class="sr-only peer" />
                            <div class="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4
                                        peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer
                                        peer-checked:after:translate-x-full peer-checked:after:border-white
                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                        after:bg-white after:border-gray-300 after:border after:rounded-full
                                        after:h-5 after:w-5 after:transition-all
                                        peer-checked:bg-teal-500"></div>
                            <span class="ml-3 text-sm font-medium"
                              [class]="cfg.trabajaSabado
                                ? 'text-teal-600 dark:text-teal-400'
                                : 'text-gray-500 dark:text-gray-400'">
                              {{ cfg.trabajaSabado ? 'Si' : 'No' }}
                            </span>
                          </label>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: []
})
export class DistribucionPuntosComponent implements OnInit {
  Math = Math;

  // Cascade dropdowns
  proveedores = signal<Inquilino[]>([]);
  carteras = signal<Cartera[]>([]);
  subcarteras = signal<Subcartera[]>([]);
  selectedProveedor: number | null = null;
  selectedCartera: number | null = null;
  selectedCarteraNombre = '';
  selectedSubcartera: number | null = null;
  selectedSubcarteraNombre = '';

  // Period
  anio: number;
  mes: number;
  aniosDisponibles: number[];
  mesesDisponibles = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  // File upload
  selectedFile = signal<File | null>(null);
  isDragOver = signal(false);

  // State
  loading = signal(false);
  loadingMessage = signal('');
  importResult = signal<ImportResult | null>(null);

  // Existing distributions for the period
  distribuciones = signal<DistribucionPuntos[]>([]);

  // Preview detail of selected distribution
  detallePreview = signal<DistribucionPuntosDetalle[] | null>(null);

  // Config dia laboral
  configs = signal<ConfigDiaLaboral[]>([]);
  showConfigPanel = signal(false);

  constructor(
    private distribucionService: DistribucionPuntosService,
    private comisionesService: ComisionesService
  ) {
    const today = new Date();
    this.anio = today.getFullYear();
    this.mes = today.getMonth() + 1;
    this.aniosDisponibles = [this.anio - 1, this.anio, this.anio + 1];
  }

  ngOnInit(): void {
    // Load proveedores
    this.comisionesService.obtenerInquilinos().subscribe({
      next: (data) => this.proveedores.set(data),
      error: (err) => console.error('Error cargando proveedores:', err)
    });

    // Load distributions for current period
    this.cargarDistribuciones();
  }

  // ==================== CASCADE DROPDOWNS ====================

  onProveedorChange(idProveedor: number | null): void {
    this.selectedCartera = null;
    this.selectedCarteraNombre = '';
    this.selectedSubcartera = null;
    this.selectedSubcarteraNombre = '';
    this.carteras.set([]);
    this.subcarteras.set([]);

    if (idProveedor) {
      this.comisionesService.obtenerCarteras(idProveedor).subscribe({
        next: (data) => this.carteras.set(data),
        error: (err) => console.error('Error cargando carteras:', err)
      });
    }
  }

  onCarteraChange(idCartera: number | null): void {
    this.selectedSubcartera = null;
    this.selectedSubcarteraNombre = '';
    this.subcarteras.set([]);

    if (idCartera) {
      const cartera = this.carteras().find(c => c.id === idCartera);
      this.selectedCarteraNombre = cartera?.nombreCartera || '';

      this.comisionesService.obtenerSubcarteras(idCartera).subscribe({
        next: (data) => this.subcarteras.set(data),
        error: (err) => console.error('Error cargando subcarteras:', err)
      });
    } else {
      this.selectedCarteraNombre = '';
    }
  }

  onSubcarteraChange(idSubcartera: number | null): void {
    if (idSubcartera) {
      const sub = this.subcarteras().find(s => s.id === idSubcartera);
      this.selectedSubcarteraNombre = sub?.nombreSubcartera || '';
    } else {
      this.selectedSubcarteraNombre = '';
    }
  }

  // ==================== FILE HANDLING ====================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
      this.importResult.set(null);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const validExtensions = ['.xlsx', '.xls', '.csv'];
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (validExtensions.includes(extension)) {
        this.selectedFile.set(file);
        this.importResult.set(null);
      } else {
        this.importResult.set({
          exitoso: false,
          mensaje: 'Formato de archivo no valido. Use .xlsx, .xls o .csv'
        });
      }
    }
  }

  clearFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.importResult.set(null);
  }

  // ==================== IMPORT ====================

  importar(): void {
    const file = this.selectedFile();
    if (!file || !this.selectedCartera || !this.selectedSubcartera) return;

    this.loading.set(true);
    this.loadingMessage.set('Importando...');
    this.importResult.set(null);

    this.distribucionService.importar(
      file,
      this.selectedCartera,
      this.selectedSubcartera,
      this.selectedCarteraNombre,
      this.selectedSubcarteraNombre,
      this.anio,
      this.mes
    ).subscribe({
      next: (result) => {
        this.importResult.set(result);
        this.loading.set(false);
        this.loadingMessage.set('');

        if (result.exitoso && result.distribucion) {
          this.detallePreview.set(result.distribucion.detalles);
          this.selectedFile.set(null);
          this.cargarDistribuciones();
        }
      },
      error: (err) => {
        console.error('Error importando archivo:', err);
        this.importResult.set({
          exitoso: false,
          mensaje: err.error?.mensaje || 'Error al importar el archivo. Verifique el formato.'
        });
        this.loading.set(false);
        this.loadingMessage.set('');
      }
    });
  }

  // ==================== DISTRIBUTIONS LIST ====================

  cargarDistribuciones(): void {
    this.loading.set(true);

    this.distribucionService.listar(this.anio, this.mes).subscribe({
      next: (data) => {
        this.distribuciones.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando distribuciones:', err);
        this.distribuciones.set([]);
        this.loading.set(false);
      }
    });
  }

  verDetalle(dist: DistribucionPuntos): void {
    if (this.detallePreview() && dist.detalles === this.detallePreview()) {
      this.detallePreview.set(null);
    } else if (dist.detalles && dist.detalles.length > 0) {
      this.detallePreview.set(dist.detalles);
    } else {
      // Fetch full detail from server
      this.distribucionService.obtener(dist.id!).subscribe({
        next: (full) => this.detallePreview.set(full.detalles),
        error: (err) => console.error('Error cargando detalle:', err)
      });
    }
  }

  eliminarDistribucion(id: number): void {
    if (!confirm('Esta seguro de eliminar esta distribucion? Esta accion no se puede deshacer.')) {
      return;
    }

    this.loading.set(true);

    this.distribucionService.eliminar(id).subscribe({
      next: () => {
        this.detallePreview.set(null);
        this.cargarDistribuciones();
      },
      error: (err) => {
        console.error('Error eliminando distribucion:', err);
        this.loading.set(false);
        alert('Error al eliminar la distribucion');
      }
    });
  }

  // ==================== CONFIG SABADOS ====================

  toggleConfigPanel(): void {
    const isOpen = this.showConfigPanel();
    this.showConfigPanel.set(!isOpen);

    if (!isOpen && this.configs().length === 0) {
      this.cargarConfigs();
    }
  }

  cargarConfigs(): void {
    this.distribucionService.listarConfig().subscribe({
      next: (data) => this.configs.set(data),
      error: (err) => console.error('Error cargando configs:', err)
    });
  }

  toggleConfig(config: ConfigDiaLaboral): void {
    const updated: ConfigDiaLaboral = {
      ...config,
      trabajaSabado: !config.trabajaSabado
    };

    this.distribucionService.guardarConfig(updated).subscribe({
      next: (saved) => {
        const current = this.configs();
        const idx = current.findIndex(c => c.id === saved.id);
        if (idx >= 0) {
          const updated = [...current];
          updated[idx] = saved;
          this.configs.set(updated);
        }
      },
      error: (err) => {
        console.error('Error guardando config:', err);
        alert('Error al guardar la configuracion');
      }
    });
  }

  // ==================== HELPERS ====================

  getNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getDiaNumero(dia: string): string {
    if (!dia) return '';
    const parts = dia.split('-');
    return parts.length === 3 ? parseInt(parts[2], 10).toString() : dia;
  }

  getDiaSemana(dia: string): string {
    if (!dia) return '';
    try {
      const date = new Date(dia + 'T00:00:00');
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      return dias[date.getDay()] || '';
    } catch {
      return '';
    }
  }

  getSumaPuntosOriginal(): number {
    const detalles = this.detallePreview();
    if (!detalles) return 0;
    return detalles.reduce((sum, d) => sum + d.puntoOriginal, 0);
  }

  getSumaPuntosEfectivo(): number {
    const detalles = this.detallePreview();
    if (!detalles) return 0;
    return detalles.reduce((sum, d) => sum + d.puntoEfectivo, 0);
  }

  getDiasLaborales(): number {
    const detalles = this.detallePreview();
    if (!detalles) return 0;
    return detalles.filter(d => d.esDiaLaboral).length;
  }
}
