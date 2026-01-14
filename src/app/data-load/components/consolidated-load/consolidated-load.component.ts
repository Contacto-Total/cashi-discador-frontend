import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { HeaderConfigurationService } from '../../../maintenance/services/header-configuration.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { ComplementaryFileService } from '../../services/complementary-file.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import { HeaderConfiguration, LoadType, BulkCreateHeaderConfigurationRequest, HeaderConfigurationItem, DataType } from '../../../maintenance/models/header-configuration.model';
import { SubPortfolio, Portfolio } from '../../../maintenance/models/portfolio.model';
import { Tenant } from '../../../maintenance/models/tenant.model';
import {
  LoadMode,
  FileToProcess,
  FileType,
  ComplementaryFileType,
  detectFileTypeByName,
  getFileTypeLabel
} from '../../models/complementary-file.model';

interface UnregisteredColumn {
  name: string;
  sampleValues: string[];
  detectedType: string;
  selected?: boolean;  // Para seleccionar cuáles crear
}

interface NewHeaderForm {
  headerName: string;
  dataType: string;
  displayLabel: string;
  format: string;
  required: boolean;
  sampleValues: string[];
}

@Component({
  selector: 'app-consolidated-load',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, NotificationsComponent],
  template: `
    <!-- Toast Notifications -->
    <app-notifications></app-notifications>

    <!-- Dialog de Columnas No Registradas -->
    @if (showUnregisteredColumnsDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-amber-600 to-orange-600 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="alert-triangle" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">Columnas no registradas detectadas</h2>
                <p class="text-amber-100 text-sm">
                  {{ unregisteredColumns().length }} columna(s) en
                  <span class="font-semibold">{{ pendingFileForValidation()?.file?.name }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 overflow-y-auto max-h-[60vh]">
            <p class="text-gray-300 text-sm mb-4">
              Seleccione las columnas que desea registrar como cabeceras. Las columnas no seleccionadas serán ignoradas durante la importación.
            </p>

            <!-- Lista de columnas con checkboxes -->
            <div class="space-y-3 mb-4">
              @for (col of unregisteredColumns(); track col.name; let i = $index) {
                <div class="bg-slate-700/50 rounded-lg border transition-all"
                     [class.border-emerald-500]="col.selected"
                     [class.border-slate-600]="!col.selected">
                  <div class="p-3">
                    <div class="flex items-start gap-3">
                      <!-- Checkbox -->
                      <label class="flex items-center cursor-pointer mt-1">
                        <input type="checkbox"
                               [checked]="col.selected"
                               (change)="toggleColumnSelection(i)"
                               class="w-5 h-5 rounded border-slate-500 bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer">
                      </label>

                      <!-- Info de la columna -->
                      <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                          <span class="font-mono text-amber-400 font-semibold text-lg">{{ col.name }}</span>
                          <span class="text-xs px-2 py-1 rounded-full"
                                [class.bg-purple-900/50]="col.detectedType === 'FECHA'"
                                [class.text-purple-400]="col.detectedType === 'FECHA'"
                                [class.bg-blue-900/50]="col.detectedType === 'NUMERICO'"
                                [class.text-blue-400]="col.detectedType === 'NUMERICO'"
                                [class.bg-slate-600]="col.detectedType === 'TEXTO'"
                                [class.text-gray-300]="col.detectedType === 'TEXTO'">
                            {{ col.detectedType }}
                          </span>
                        </div>

                        @if (col.sampleValues.length > 0) {
                          <div class="text-xs text-gray-400 mb-2">
                            <span class="text-gray-500">Ejemplos:</span>
                            <code class="font-mono bg-slate-800 px-2 py-0.5 rounded ml-1 text-gray-300">{{ col.sampleValues.slice(0, 3).join(' | ') }}</code>
                          </div>
                        }

                        <!-- Formulario expandible cuando está seleccionado -->
                        @if (col.selected && newHeaderForms()[i]) {
                          <div class="mt-3 pt-3 border-t border-slate-600 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label class="block text-xs text-gray-400 mb-1">Etiqueta visual</label>
                              <input type="text"
                                     [value]="newHeaderForms()[i].displayLabel"
                                     (input)="updateHeaderForm(i, 'displayLabel', $event)"
                                     class="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                     placeholder="Ej: Fecha de Pago">
                            </div>
                            <div>
                              <label class="block text-xs text-gray-400 mb-1">Tipo de dato</label>
                              <select [value]="newHeaderForms()[i].dataType"
                                      (change)="updateHeaderForm(i, 'dataType', $event)"
                                      class="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500">
                                <option value="TEXTO">TEXTO</option>
                                <option value="NUMERICO">NUMERICO</option>
                                <option value="FECHA">FECHA</option>
                              </select>
                            </div>
                            <div>
                              <label class="block text-xs text-gray-400 mb-1">Formato (opcional)</label>
                              <input type="text"
                                     [value]="newHeaderForms()[i].format"
                                     (input)="updateHeaderForm(i, 'format', $event)"
                                     class="w-full px-3 py-1.5 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                     [placeholder]="newHeaderForms()[i].dataType === 'FECHA' ? 'dd/MM/yyyy' : ''">
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Resumen -->
            <div class="bg-slate-900/50 rounded-lg p-3 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-400">
                  <span class="text-emerald-400 font-semibold">{{ getSelectedColumnsCount() }}</span> columna(s) seleccionada(s) para crear
                </span>
                @if (getSelectedColumnsCount() < unregisteredColumns().length) {
                  <span class="text-sm text-gray-500">
                    ({{ unregisteredColumns().length - getSelectedColumnsCount() }} serán ignoradas)
                  </span>
                }
              </div>
              <button (click)="selectAllColumns()"
                      class="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer">
                {{ getSelectedColumnsCount() === unregisteredColumns().length ? 'Deseleccionar todo' : 'Seleccionar todo' }}
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-slate-700 p-4 bg-slate-900 flex flex-col sm:flex-row gap-3 justify-between">
            <button
              (click)="cancelUnregisteredDialog()"
              class="px-4 py-2.5 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors font-medium cursor-pointer">
              Cancelar importación
            </button>
            <div class="flex gap-3">
              <button
                (click)="proceedIgnoringUnregisteredColumns()"
                class="px-4 py-2.5 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer">
                <lucide-angular name="skip-forward" [size]="16"></lucide-angular>
                Ignorar todas y continuar
              </button>
              @if (getSelectedColumnsCount() > 0) {
                <button
                  (click)="createSelectedHeadersAndContinue()"
                  [disabled]="isCreatingHeaders()"
                  class="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (isCreatingHeaders()) {
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creando...
                  } @else {
                    <lucide-angular name="plus-circle" [size]="16"></lucide-angular>
                    Crear {{ getSelectedColumnsCount() }} cabecera(s) y continuar
                  }
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Loading Overlay Modal -->
    @if (isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 max-w-md w-full mx-4">
          <div class="flex flex-col items-center gap-6">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-slate-600 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-bold text-white mb-2">{{ loadingMessage() }}</h3>
              <p class="text-gray-400 text-sm">Por favor espere...</p>
            </div>
            <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full animate-pulse" style="width: 100%"></div>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <lucide-angular name="upload-cloud" [size]="20" class="text-white"></lucide-angular>
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">Carga Consolidada de Datos</h1>
              <p class="text-sm text-gray-400">Importación de archivos de cartera CONTACTO TOTAL</p>
            </div>
          </div>
        </div>

        <!-- Selectores en Cascada -->
        <div class="bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-slate-800 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                <lucide-angular name="building-2" [size]="14" class="inline mr-1"></lucide-angular>
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange($event)"
                      class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                <lucide-angular name="folder" [size]="14" class="inline mr-1"></lucide-angular>
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange($event)"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-300 mb-1.5">
                <lucide-angular name="folder-tree" [size]="14" class="inline mr-1"></lucide-angular>
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange($event)"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (sp of subPortfolios(); track sp.id) {
                  <option [value]="sp.id">{{ sp.subPortfolioCode }} - {{ sp.subPortfolioName }}</option>
                }
              </select>
            </div>
          </div>
        </div>

        @if (selectedSubPortfolioId > 0) {
          <!-- Selector de Tipo de Carga -->
          <div class="bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-slate-800 mb-6">
            <h3 class="text-sm font-semibold text-gray-300 mb-3">
              <lucide-angular name="layers" [size]="14" class="inline mr-1"></lucide-angular>
              Tipo de Carga
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Carga Diaria -->
              <button (click)="selectLoadMode('DAILY')"
                      [class.ring-2]="selectedLoadMode() === 'DAILY'"
                      [class.ring-blue-500]="selectedLoadMode() === 'DAILY'"
                      [class.bg-blue-900/30]="selectedLoadMode() === 'DAILY'"
                      class="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 transition-all text-left cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="calendar" [size]="20" class="text-blue-400"></lucide-angular>
                  </div>
                  <div>
                    <h4 class="font-semibold text-white">Carga Diaria</h4>
                    <p class="text-xs text-gray-400">Actualización diaria</p>
                  </div>
                </div>
                <p class="text-xs text-gray-500">Cartera_CONTACTO_TOTAL_YYYY-MM-DD.xlsx</p>
              </button>

              <!-- Carga Inicial de Mes -->
              <button (click)="selectLoadMode('INITIAL_MONTH')"
                      [class.ring-2]="selectedLoadMode() === 'INITIAL_MONTH'"
                      [class.ring-emerald-500]="selectedLoadMode() === 'INITIAL_MONTH'"
                      [class.bg-emerald-900/30]="selectedLoadMode() === 'INITIAL_MONTH'"
                      class="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-emerald-500 transition-all text-left cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="calendar-range" [size]="20" class="text-emerald-400"></lucide-angular>
                  </div>
                  <div>
                    <h4 class="font-semibold text-white">Carga Inicial de Mes</h4>
                    <p class="text-xs text-gray-400">Asignación + Complementarios</p>
                  </div>
                </div>
                <p class="text-xs text-gray-500">CONTACTO_TOTAL_ASIGNACION_YYYYMM.xlsx + opcionales</p>
              </button>

              <!-- Carga PKM -->
              <button (click)="selectLoadMode('PKM')"
                      [class.ring-2]="selectedLoadMode() === 'PKM'"
                      [class.ring-amber-500]="selectedLoadMode() === 'PKM'"
                      [class.bg-amber-900/30]="selectedLoadMode() === 'PKM'"
                      class="p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-amber-500 transition-all text-left cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="trending-up" [size]="20" class="text-amber-400"></lucide-angular>
                  </div>
                  <div>
                    <h4 class="font-semibold text-white">Carga PKM</h4>
                    <p class="text-xs text-gray-400">Variable (sin fecha fija)</p>
                  </div>
                </div>
                <p class="text-xs text-gray-500">CONTACTO_TOTAL_PKM_MESYY.xlsx</p>
              </button>
            </div>
          </div>

          @if (selectedLoadMode()) {
            <!-- Área de Carga de Archivos -->
            <div class="bg-slate-900/80 backdrop-blur rounded-xl shadow-lg border border-slate-800 overflow-hidden">
              <!-- Header del área de carga -->
              <div class="p-4 border-b border-slate-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-bold text-white">{{ getLoadModeTitle() }}</h2>
                    <p class="text-sm text-gray-400 mt-1">{{ getLoadModeDescription() }}</p>
                  </div>
                  <div class="flex gap-2">
                    @if (filesToProcess().length > 0) {
                      <button (click)="clearFiles()"
                              class="px-3 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-all text-sm cursor-pointer">
                        <lucide-angular name="trash-2" [size]="14" class="inline mr-1"></lucide-angular>
                        Limpiar
                      </button>
                    }
                    <label class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-medium cursor-pointer text-sm flex items-center gap-2">
                      <lucide-angular name="plus" [size]="16"></lucide-angular>
                      Agregar Archivo
                      <input type="file"
                             accept=".xlsx,.xls"
                             (change)="onFileSelected($event)"
                             [multiple]="selectedLoadMode() === 'INITIAL_MONTH'"
                             class="hidden">
                    </label>
                  </div>
                </div>
              </div>

              <!-- Lista de archivos -->
              <div class="p-4">
                @if (filesToProcess().length === 0) {
                  <div class="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center">
                    <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <lucide-angular name="file-spreadsheet" [size]="32" class="text-gray-600"></lucide-angular>
                    </div>
                    <h3 class="text-white font-semibold mb-2">Arrastra archivos aquí o haz clic en "Agregar Archivo"</h3>
                    <p class="text-gray-400 text-sm">{{ getExpectedFilesDescription() }}</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (file of filesToProcess(); track file.file.name) {
                      <div class="bg-slate-800 rounded-xl p-4 border"
                           [class.border-emerald-500/50]="file.validated && !file.error"
                           [class.border-red-500/50]="file.error"
                           [class.border-slate-700]="!file.validated && !file.error">
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                 [class.bg-emerald-600/20]="file.validated && !file.error"
                                 [class.bg-red-600/20]="file.error"
                                 [class.bg-slate-700]="!file.validated && !file.error">
                              @if (file.validated && !file.error) {
                                <lucide-angular name="check-circle" [size]="20" class="text-emerald-400"></lucide-angular>
                              } @else if (file.error) {
                                <lucide-angular name="alert-circle" [size]="20" class="text-red-400"></lucide-angular>
                              } @else {
                                <lucide-angular name="file-spreadsheet" [size]="20" class="text-gray-400"></lucide-angular>
                              }
                            </div>
                            <div>
                              <p class="font-medium text-white">{{ file.file.name }}</p>
                              <div class="flex items-center gap-2 mt-0.5">
                                <span class="px-2 py-0.5 rounded text-xs font-medium"
                                      [class.bg-blue-900/50]="file.type === 'DAILY'"
                                      [class.text-blue-400]="file.type === 'DAILY'"
                                      [class.bg-emerald-900/50]="file.type === 'INITIAL_MAIN'"
                                      [class.text-emerald-400]="file.type === 'INITIAL_MAIN'"
                                      [class.bg-purple-900/50]="file.type === 'COMPLEMENTARY_FACILITIES'"
                                      [class.text-purple-400]="file.type === 'COMPLEMENTARY_FACILITIES'"
                                      [class.bg-amber-900/50]="file.type === 'COMPLEMENTARY_PKM'"
                                      [class.text-amber-400]="file.type === 'COMPLEMENTARY_PKM'"
                                      [class.bg-gray-700]="file.type === 'UNKNOWN'"
                                      [class.text-gray-400]="file.type === 'UNKNOWN'">
                                  {{ getFileTypeLabel(file.type) }}
                                </span>
                                @if (file.rowCount) {
                                  <span class="text-xs text-gray-400">{{ file.rowCount }} registros</span>
                                }
                              </div>
                            </div>
                          </div>
                          <div class="flex items-center gap-2">
                            @if (file.error) {
                              <span class="text-xs text-red-400 max-w-xs truncate">{{ file.error }}</span>
                            }
                            <button (click)="removeFile(file)"
                                    class="p-2 text-gray-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-all cursor-pointer">
                              <lucide-angular name="x" [size]="16"></lucide-angular>
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Resumen y Botón de Procesar -->
                  @if (canProcess()) {
                    <div class="mt-6 pt-4 border-t border-slate-700">
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-400">
                          <span class="text-white font-semibold">{{ getTotalRows() }}</span> registros en
                          <span class="text-white font-semibold">{{ filesToProcess().length }}</span> archivo(s)
                        </div>
                        <button (click)="processFiles()"
                                class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                          <lucide-angular name="play" [size]="18"></lucide-angular>
                          Procesar Carga
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>
          }

          <!-- Resultado de la carga -->
          @if (lastResult()) {
            <div class="mt-6 bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border"
                 [class.border-emerald-500/50]="lastResult()?.success"
                 [class.border-red-500/50]="!lastResult()?.success">
              <div class="flex items-center gap-3 mb-3">
                @if (lastResult()?.success) {
                  <div class="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="check-circle" [size]="24" class="text-emerald-400"></lucide-angular>
                  </div>
                  <h3 class="text-lg font-bold text-emerald-400">Carga completada exitosamente</h3>
                } @else {
                  <div class="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="alert-triangle" [size]="24" class="text-red-400"></lucide-angular>
                  </div>
                  <h3 class="text-lg font-bold text-red-400">Carga completada con errores</h3>
                }
              </div>

              <!-- Estadísticas principales -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div class="bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-400">Total filas</p>
                  <p class="text-2xl font-bold text-white">{{ lastResult()?.mainFileResult?.totalRows || lastResult()?.totalProcessed || 0 }}</p>
                </div>
                <div class="bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-400">Insertados</p>
                  <p class="text-2xl font-bold text-emerald-400">{{ lastResult()?.mainFileResult?.insertedRows || 0 }}</p>
                </div>
                <div class="bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-400">Actualizados</p>
                  <p class="text-2xl font-bold text-blue-400">{{ lastResult()?.mainFileResult?.updatedRows || 0 }}</p>
                </div>
                <div class="bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-400">Fallidos</p>
                  <p class="text-2xl font-bold" [class.text-red-400]="lastResult()?.totalErrors" [class.text-gray-400]="!lastResult()?.totalErrors">{{ lastResult()?.totalErrors || 0 }}</p>
                </div>
              </div>

              <!-- Detalle de errores -->
              @if (lastResult()?.mainFileResult?.errors?.length > 0) {
                <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <lucide-angular name="alert-circle" [size]="18" class="text-red-400"></lucide-angular>
                    <h4 class="font-semibold text-red-400">
                      Detalle de errores ({{ lastResult()?.mainFileResult?.errors?.length }}
                      @if (lastResult()?.mainFileResult?.totalErrors > lastResult()?.mainFileResult?.errors?.length) {
                        de {{ lastResult()?.mainFileResult?.totalErrors }}
                      })
                    </h4>
                  </div>
                  <div class="max-h-48 overflow-y-auto space-y-1 text-sm">
                    @for (error of lastResult()?.mainFileResult?.errors; track $index) {
                      <div class="bg-slate-800/50 rounded px-3 py-2 text-gray-300 font-mono text-xs">
                        <span class="text-red-400 mr-2">●</span>{{ error }}
                      </div>
                    }
                  </div>
                  @if (lastResult()?.mainFileResult?.totalErrors > lastResult()?.mainFileResult?.errors?.length) {
                    <p class="text-gray-500 text-xs mt-2 italic">
                      * Se muestran solo los primeros {{ lastResult()?.mainFileResult?.errors?.length }} errores de {{ lastResult()?.mainFileResult?.totalErrors }} totales
                    </p>
                  }
                </div>
              }

              <!-- Errores de sincronización de clientes -->
              @if (lastResult()?.mainFileResult?.syncError) {
                <div class="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="users" [size]="18" class="text-amber-400"></lucide-angular>
                    <h4 class="font-semibold text-amber-400">Error en sincronización de clientes</h4>
                  </div>
                  <p class="text-gray-300 text-sm">{{ lastResult()?.mainFileResult?.syncError }}</p>
                </div>
              }

              <!-- Resultados de sincronización exitosa -->
              @if (lastResult()?.mainFileResult?.syncCustomersCreated !== undefined || lastResult()?.mainFileResult?.syncCustomersUpdated !== undefined) {
                <div class="bg-slate-800/50 rounded-lg p-3 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="users" [size]="16" class="text-cyan-400"></lucide-angular>
                    <span class="text-sm text-gray-400">Sincronización de clientes:</span>
                  </div>
                  <div class="flex gap-4 text-sm">
                    <span class="text-emerald-400">{{ lastResult()?.mainFileResult?.syncCustomersCreated || 0 }} creados</span>
                    <span class="text-blue-400">{{ lastResult()?.mainFileResult?.syncCustomersUpdated || 0 }} actualizados</span>
                  </div>
                </div>
              }

              <!-- Resultados de archivos complementarios -->
              @if (lastResult()?.complementaryResults?.length > 0) {
                <div class="bg-slate-800/50 rounded-lg p-3 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="file-plus" [size]="16" class="text-purple-400"></lucide-angular>
                    <span class="text-sm text-gray-400">Archivos complementarios:</span>
                  </div>
                  @for (comp of lastResult()?.complementaryResults; track $index) {
                    <div class="flex items-center gap-2 text-sm mt-1">
                      @if (comp?.failedRows > 0 || comp?.errors?.length > 0) {
                        <lucide-angular name="alert-circle" [size]="14" class="text-amber-400"></lucide-angular>
                      } @else {
                        <lucide-angular name="check" [size]="14" class="text-emerald-400"></lucide-angular>
                      }
                      <span class="text-gray-300">
                        {{ comp?.updatedRows || 0 }} actualizados
                        @if (comp?.notFoundRows > 0) {
                          <span class="text-amber-400 ml-2">{{ comp?.notFoundRows }} no encontrados</span>
                        }
                        @if (comp?.failedRows > 0) {
                          <span class="text-red-400 ml-2">{{ comp?.failedRows }} fallidos</span>
                        }
                      </span>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }

        @if (selectedSubPortfolioId > 0 && !hasHeadersConfigured()) {
          <div class="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 text-center">
            <lucide-angular name="alert-triangle" [size]="48" class="text-amber-400 mx-auto mb-3"></lucide-angular>
            <h3 class="text-lg font-bold text-amber-400 mb-2">Configuración de cabeceras pendiente</h3>
            <p class="text-gray-400 mb-4">Debe configurar las cabeceras para esta subcartera antes de importar datos.</p>
            <a routerLink="/admin/maintenance/headers" class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium">
              <lucide-angular name="settings" [size]="16"></lucide-angular>
              Ir a Configuración de Cabeceras
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConsolidatedLoadComponent implements OnInit {
  private notificationService = inject(NotificationService);

  // Signals para estado
  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  headersInicial = signal<HeaderConfiguration[]>([]);
  headersActualizacion = signal<HeaderConfiguration[]>([]);
  complementaryTypes = signal<ComplementaryFileType[]>([]);

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  selectedLoadMode = signal<LoadMode | null>(null);
  filesToProcess = signal<FileToProcess[]>([]);
  isLoading = signal(false);
  loadingMessage = signal('Procesando...');
  lastResult = signal<any>(null);

  // Signals para columnas no registradas
  showUnregisteredColumnsDialog = signal(false);
  unregisteredColumns = signal<UnregisteredColumn[]>([]);
  pendingFileForValidation = signal<FileToProcess | null>(null);
  newHeaderForms = signal<NewHeaderForm[]>([]);
  isCreatingHeaders = signal(false);

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private headerConfigService: HeaderConfigurationService,
    private complementaryFileService: ComplementaryFileService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  // ==================== Carga de datos iniciales ====================

  loadTenants() {
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => this.tenants.set(tenants),
      error: (error) => console.error('Error loading tenants:', error)
    });
  }

  onTenantChange(tenantId: number) {
    this.selectedTenantId = tenantId;
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.resetLoadState();

    if (tenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
        next: (portfolios) => this.portfolios.set(portfolios),
        error: (error) => console.error('Error loading portfolios:', error)
      });
    }
  }

  onPortfolioChange(portfolioId: number) {
    this.selectedPortfolioId = portfolioId;
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.resetLoadState();

    if (portfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
        next: (subPortfolios) => this.subPortfolios.set(subPortfolios),
        error: (error) => console.error('Error loading subportfolios:', error)
      });
    }
  }

  onSubPortfolioChange(subPortfolioId: number) {
    this.selectedSubPortfolioId = subPortfolioId;
    this.resetLoadState();

    if (subPortfolioId > 0) {
      this.loadHeaderConfigurations();
      this.loadComplementaryTypes();
    }
  }

  loadHeaderConfigurations() {
    // Cargar cabeceras para INICIAL
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, 'INICIAL').subscribe({
      next: (headers) => this.headersInicial.set(headers),
      error: (error) => console.error('Error loading INICIAL headers:', error)
    });

    // Cargar cabeceras para ACTUALIZACION
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, 'ACTUALIZACION').subscribe({
      next: (headers) => this.headersActualizacion.set(headers),
      error: (error) => console.error('Error loading ACTUALIZACION headers:', error)
    });
  }

  loadComplementaryTypes() {
    this.complementaryFileService.getTypesBySubPortfolio(this.selectedSubPortfolioId).subscribe({
      next: (types) => this.complementaryTypes.set(types),
      error: (error) => console.error('Error loading complementary types:', error)
    });
  }

  // ==================== Selección de modo de carga ====================

  selectLoadMode(mode: LoadMode) {
    this.selectedLoadMode.set(mode);
    this.filesToProcess.set([]);
    this.lastResult.set(null);
  }

  resetLoadState() {
    this.selectedLoadMode.set(null);
    this.filesToProcess.set([]);
    this.lastResult.set(null);
  }

  // ==================== Manejo de archivos ====================

  async onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    // Procesar archivos secuencialmente para evitar condiciones de carrera
    // especialmente con el diálogo de columnas no registradas
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileType = detectFileTypeByName(file.name);

      // Validar que el tipo de archivo es apropiado para el modo seleccionado
      if (!this.isFileTypeValidForMode(fileType)) {
        this.notificationService.error(
          'Archivo no válido',
          `El archivo "${file.name}" no es válido para el tipo de carga seleccionado.`
        );
        continue;
      }

      // Verificar si ya existe un archivo del mismo tipo
      if (this.isDuplicateFileType(fileType)) {
        this.notificationService.warning(
          'Archivo duplicado',
          `Ya existe un archivo de tipo "${getFileTypeLabel(fileType)}".`
        );
        continue;
      }

      const fileToProcess: FileToProcess = {
        file,
        type: fileType,
        validated: false
      };

      this.filesToProcess.update(files => [...files, fileToProcess]);

      // Esperar a que se procese completamente antes de continuar con el siguiente
      await this.parseAndValidateFile(fileToProcess);

      // Si hay un diálogo de columnas no registradas abierto, esperar a que se cierre
      // antes de procesar el siguiente archivo
      if (this.showUnregisteredColumnsDialog()) {
        await this.waitForDialogClose();
      }
    }

    event.target.value = '';
  }

  /**
   * Espera a que el diálogo de columnas no registradas se cierre
   */
  private waitForDialogClose(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.showUnregisteredColumnsDialog()) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  isFileTypeValidForMode(fileType: FileType): boolean {
    const mode = this.selectedLoadMode();
    switch (mode) {
      case 'DAILY':
        return fileType === 'DAILY';
      case 'INITIAL_MONTH':
        return ['INITIAL_MAIN', 'COMPLEMENTARY_FACILITIES', 'COMPLEMENTARY_PKM'].includes(fileType);
      case 'PKM':
        return fileType === 'COMPLEMENTARY_PKM';
      default:
        return false;
    }
  }

  isDuplicateFileType(fileType: FileType): boolean {
    return this.filesToProcess().some(f => f.type === fileType);
  }

  removeFile(fileToRemove: FileToProcess) {
    this.filesToProcess.update(files => files.filter(f => f !== fileToRemove));
  }

  clearFiles() {
    this.filesToProcess.set([]);
    this.lastResult.set(null);
  }

  async parseAndValidateFile(fileToProcess: FileToProcess): Promise<void> {
    try {
      const data = await this.readExcelFile(fileToProcess.file);
      if (data.length === 0) {
        this.updateFileError(fileToProcess, 'El archivo está vacío');
        return;
      }

      const headers = Object.keys(data[0]);
      fileToProcess.data = data;
      fileToProcess.headers = headers;
      fileToProcess.rowCount = data.length;

      // Detectar columnas no registradas (para todos los archivos: DAILY, INITIAL_MAIN, PKM y Facilidades)
      // PKM y Facilidades usan las cabeceras de INICIAL ya que sus columnas se agregan a esa tabla
      const unregistered = this.detectUnregisteredColumns(fileToProcess);

      if (unregistered.length > 0) {
        // Mostrar diálogo de advertencia
        this.unregisteredColumns.set(unregistered);
        this.pendingFileForValidation.set(fileToProcess);
        this.showUnregisteredColumnsDialog.set(true);
        return; // Esperar decisión del usuario
      }

      // Si no hay columnas no registradas, validar directamente
      this.completeFileValidation(fileToProcess);

    } catch (error: any) {
      this.updateFileError(fileToProcess, error.message || 'Error al leer el archivo');
    }
  }

  /**
   * Detecta las columnas del archivo que no están registradas como cabeceras
   * NOTA: PKM y Facilidades usan las cabeceras de INICIAL porque sus columnas
   * se agregan a la misma tabla de carga inicial de mes
   */
  private detectUnregisteredColumns(fileToProcess: FileToProcess): UnregisteredColumn[] {
    if (!fileToProcess.headers || !fileToProcess.data) return [];

    // Obtener cabeceras configuradas según el tipo de archivo
    // DAILY usa cabeceras de ACTUALIZACION, todos los demás usan INICIAL
    const configuredHeaders = fileToProcess.type === 'DAILY'
      ? this.headersActualizacion()
      : this.headersInicial(); // INITIAL_MAIN, COMPLEMENTARY_PKM, COMPLEMENTARY_FACILITIES usan INICIAL

    // Crear set de nombres de cabeceras registradas (incluyendo aliases)
    const registeredHeadersLower = new Set<string>();
    configuredHeaders.forEach(header => {
      registeredHeadersLower.add(header.headerName.toLowerCase());
      if (header.aliases) {
        header.aliases.forEach(alias => {
          registeredHeadersLower.add(alias.alias.toLowerCase());
        });
      }
    });

    // Detectar columnas del archivo que no están registradas
    const unregistered: UnregisteredColumn[] = [];

    fileToProcess.headers.forEach(headerName => {
      if (!registeredHeadersLower.has(headerName.toLowerCase())) {
        // Recopilar valores de muestra (primeras 5 filas)
        const sampleValues: string[] = [];
        for (let i = 0; i < Math.min(5, fileToProcess.data!.length); i++) {
          const value = fileToProcess.data![i][headerName];
          if (value !== undefined && value !== null && String(value).trim() !== '') {
            sampleValues.push(String(value).trim());
          }
        }

        unregistered.push({
          name: headerName,
          sampleValues,
          detectedType: this.detectColumnType(sampleValues)
        });
      }
    });

    return unregistered;
  }

  /**
   * Detecta el tipo de dato de una columna basándose en valores de muestra
   */
  private detectColumnType(sampleValues: string[]): string {
    if (sampleValues.length === 0) return 'TEXTO';

    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    ];

    const isDate = sampleValues.every(v =>
      datePatterns.some(pattern => pattern.test(v))
    );
    if (isDate) return 'FECHA';

    const numericRegex = /^-?\d+([.,]\d+)?$/;
    const isNumeric = sampleValues.every(v =>
      numericRegex.test(v.replace(/,/g, '.'))
    );
    if (isNumeric) return 'NUMERICO';

    return 'TEXTO';
  }

  /**
   * Completa la validación de un archivo
   */
  private completeFileValidation(fileToProcess: FileToProcess) {
    fileToProcess.validated = true;
    fileToProcess.error = undefined;
    this.filesToProcess.update(files => [...files]);
  }

  updateFileError(fileToProcess: FileToProcess, error: string) {
    fileToProcess.error = error;
    fileToProcess.validated = false;
    this.filesToProcess.update(files => [...files]);
  }

  readExcelFile(file: File): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          // cellDates: true convierte números de fecha Excel a objetos Date de JavaScript
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

          // Convertir objetos Date a strings en formato d/M/yyyy
          const processedData = (jsonData as Record<string, any>[]).map(row => {
            const processedRow: Record<string, any> = {};
            for (const [key, value] of Object.entries(row)) {
              if (value instanceof Date) {
                // Convertir Date a string en formato d/M/yyyy
                const day = value.getDate();
                const month = value.getMonth() + 1; // getMonth() es 0-indexed
                const year = value.getFullYear();
                processedRow[key] = `${day}/${month}/${year}`;
              } else if (typeof value === 'number' && this.looksLikeExcelDate(value, key)) {
                // Fallback: convertir números de fecha Excel que no se convirtieron
                const date = this.excelDateToJSDate(value);
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                processedRow[key] = `${day}/${month}/${year}`;
              } else {
                processedRow[key] = value;
              }
            }
            return processedRow;
          });

          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Detecta si un número podría ser una fecha de Excel basándose en el nombre de la columna
   */
  private looksLikeExcelDate(value: number, columnName: string): boolean {
    // Verificar si el nombre de columna sugiere una fecha
    const dateKeywords = ['fecha', 'date', 'fec_', 'vencimiento', 'nacimiento', 'registro', 'creacion'];
    const lowerKey = columnName.toLowerCase();
    const isDateColumn = dateKeywords.some(keyword => lowerKey.includes(keyword));

    // Rango típico de fechas Excel (1900-2100 aproximadamente)
    // Excel: 1 = 1/1/1900, 44197 = 1/1/2021, 73050 = 31/12/2099
    const isInDateRange = value > 1 && value < 73050;

    return isDateColumn && isInDateRange;
  }

  /**
   * Convierte un número de fecha de Excel a Date de JavaScript
   * Excel cuenta días desde el 1 de enero de 1900 (con un bug del año bisiesto 1900)
   */
  private excelDateToJSDate(excelDate: number): Date {
    // Excel tiene un bug: considera 1900 como año bisiesto, así que restamos 1 para fechas > 60
    const adjustedDate = excelDate > 60 ? excelDate - 1 : excelDate;
    // Fecha base de Excel: 1 de enero de 1900
    const baseDate = new Date(1900, 0, 1);
    // Sumar los días (restando 1 porque Excel cuenta desde 1, no desde 0)
    return new Date(baseDate.getTime() + (adjustedDate - 1) * 24 * 60 * 60 * 1000);
  }

  // ==================== Procesamiento ====================

  canProcess(): boolean {
    const files = this.filesToProcess();
    if (files.length === 0) return false;

    const mode = this.selectedLoadMode();

    // Verificar que todos los archivos están validados
    const allValidated = files.every(f => f.validated && !f.error);
    if (!allValidated) return false;

    // Para carga inicial, el archivo principal es obligatorio
    if (mode === 'INITIAL_MONTH') {
      return files.some(f => f.type === 'INITIAL_MAIN');
    }

    return true;
  }

  getTotalRows(): number {
    return this.filesToProcess().reduce((sum, f) => sum + (f.rowCount || 0), 0);
  }

  async processFiles() {
    const mode = this.selectedLoadMode();
    if (!mode) return;

    this.isLoading.set(true);
    this.lastResult.set(null);

    try {
      switch (mode) {
        case 'DAILY':
          await this.processDailyLoad();
          break;
        case 'INITIAL_MONTH':
          await this.processInitialMonthLoad();
          break;
        case 'PKM':
          await this.processPkmLoad();
          break;
      }
    } catch (error: any) {
      console.error('Error processing files:', error);
      this.lastResult.set({
        success: false,
        totalProcessed: 0,
        totalErrors: 1,
        error: error.message
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  async processDailyLoad() {
    this.loadingMessage.set('Procesando carga diaria...');
    const file = this.filesToProcess().find(f => f.type === 'DAILY');
    if (!file || !file.data) throw new Error('No hay archivo de carga diaria');

    const result = await firstValueFrom(this.headerConfigService.importData(
      this.selectedSubPortfolioId,
      'ACTUALIZACION',
      file.data
    ));

    this.lastResult.set({
      success: !result.errors || result.errors.length === 0,
      totalProcessed: result.insertedRows || 0,
      totalErrors: result.failedRows || 0,
      mode: 'DAILY',
      mainFileResult: result
    });

    this.filesToProcess.set([]);
  }

  async processInitialMonthLoad() {
    const files = this.filesToProcess();
    const mainFile = files.find(f => f.type === 'INITIAL_MAIN');
    if (!mainFile || !mainFile.data) throw new Error('No hay archivo de asignación inicial');

    let totalProcessed = 0;
    let totalErrors = 0;
    const complementaryResults: any[] = [];

    // 1. Procesar archivo principal (INICIAL)
    this.loadingMessage.set('Procesando asignación inicial...');
    const mainResult = await firstValueFrom(this.headerConfigService.importData(
      this.selectedSubPortfolioId,
      'INICIAL',
      mainFile.data
    ));

    totalProcessed += mainResult.insertedRows || 0;
    totalErrors += mainResult.failedRows || 0;

    // 2. Procesar archivos complementarios (actualizan columnas en la tabla INICIAL existente)
    // Estos archivos usan updateComplementaryData con un campo de enlace para hacer UPDATE
    const facilitiesFile = files.find(f => f.type === 'COMPLEMENTARY_FACILITIES');
    if (facilitiesFile && facilitiesFile.data) {
      this.loadingMessage.set('Procesando facilidades de pago...');
      try {
        // Detectar automáticamente el campo de enlace del archivo
        const linkField = this.detectLinkField(facilitiesFile.data);

        const facilitiesResult = await firstValueFrom(this.headerConfigService.updateComplementaryData(
          this.selectedSubPortfolioId,
          'INICIAL',
          facilitiesFile.data,
          linkField
        ));

        complementaryResults.push(facilitiesResult);
        totalProcessed += facilitiesResult?.updatedRows || 0;
        totalErrors += facilitiesResult?.failedRows || 0;

        this.notificationService.success(
          'Facilidades procesadas',
          `${facilitiesResult?.updatedRows || 0} registros actualizados`
        );
      } catch (error: any) {
        console.error('Error processing facilities:', error);
        this.notificationService.error('Error en Facilidades', error.message || 'Error al procesar facilidades de pago');
        totalErrors++;
      }
    }

    const pkmFile = files.find(f => f.type === 'COMPLEMENTARY_PKM');
    if (pkmFile && pkmFile.data) {
      this.loadingMessage.set('Procesando PKM...');
      try {
        // Detectar automáticamente el campo de enlace del archivo
        const linkField = this.detectLinkField(pkmFile.data);

        const pkmResult = await firstValueFrom(this.headerConfigService.updateComplementaryData(
          this.selectedSubPortfolioId,
          'INICIAL',
          pkmFile.data,
          linkField
        ));

        complementaryResults.push(pkmResult);
        totalProcessed += pkmResult?.updatedRows || 0;
        totalErrors += pkmResult?.failedRows || 0;

        this.notificationService.success(
          'PKM procesado',
          `${pkmResult?.updatedRows || 0} registros actualizados`
        );
      } catch (error: any) {
        console.error('Error processing PKM:', error);
        this.notificationService.error('Error en PKM', error.message || 'Error al procesar archivo PKM');
        totalErrors++;
      }
    }

    this.lastResult.set({
      success: totalErrors === 0,
      totalProcessed,
      totalErrors,
      mode: 'INITIAL_MONTH',
      mainFileResult: mainResult,
      complementaryResults
    });

    this.filesToProcess.set([]);
  }

  async processPkmLoad() {
    this.loadingMessage.set('Procesando carga PKM...');
    const file = this.filesToProcess().find(f => f.type === 'COMPLEMENTARY_PKM');
    if (!file || !file.data) throw new Error('No hay archivo PKM');

    // Detectar automáticamente el campo de enlace del archivo
    const linkField = this.detectLinkField(file.data);

    // Usar updateComplementaryData para actualizar columnas específicas en la tabla INICIAL
    const result = await firstValueFrom(this.headerConfigService.updateComplementaryData(
      this.selectedSubPortfolioId,
      'INICIAL',
      file.data,
      linkField
    ));

    this.lastResult.set({
      success: (result?.failedRows ?? 0) === 0,
      totalProcessed: result?.updatedRows || 0,
      totalErrors: result?.failedRows || 0,
      mode: 'PKM',
      mainFileResult: result
    });

    this.notificationService.success(
      'PKM procesado',
      `${result?.updatedRows || 0} registros actualizados`
    );

    this.filesToProcess.set([]);
  }

  // ==================== Helpers ====================

  hasHeadersConfigured(): boolean {
    return this.headersInicial().length > 0 || this.headersActualizacion().length > 0;
  }

  getLoadModeTitle(): string {
    switch (this.selectedLoadMode()) {
      case 'DAILY': return 'Carga Diaria';
      case 'INITIAL_MONTH': return 'Carga Inicial de Mes';
      case 'PKM': return 'Carga PKM';
      default: return '';
    }
  }

  getLoadModeDescription(): string {
    switch (this.selectedLoadMode()) {
      case 'DAILY':
        return 'Suba el archivo de actualización diaria (Cartera_CONTACTO_TOTAL_YYYY-MM-DD.xlsx)';
      case 'INITIAL_MONTH':
        return 'Suba el archivo de asignación (obligatorio) y opcionalmente el archivo de facilidades';
      case 'PKM':
        return 'Suba el archivo PKM para actualizar la columna PKM de los registros existentes';
      default:
        return '';
    }
  }

  getExpectedFilesDescription(): string {
    switch (this.selectedLoadMode()) {
      case 'DAILY':
        return 'Archivo esperado: Cartera_CONTACTO_TOTAL_YYYY-MM-DD.xlsx';
      case 'INITIAL_MONTH':
        return 'Principal: CONTACTO_TOTAL_ASIGNACION_YYYYMM.xlsx | Opcionales: Facilidades_Pago_*.xlsx, CONTACTO_TOTAL_PKM_*.xlsx';
      case 'PKM':
        return 'Archivo esperado: CONTACTO_TOTAL_PKM_MESYY.xlsx';
      default:
        return '';
    }
  }

  getFileTypeLabel(type: FileType): string {
    return getFileTypeLabel(type);
  }

  // ==================== Manejo de columnas no registradas ====================

  /**
   * Cancela el diálogo y elimina el archivo pendiente
   */
  cancelUnregisteredDialog() {
    const pendingFile = this.pendingFileForValidation();
    if (pendingFile) {
      this.filesToProcess.update(files => files.filter(f => f !== pendingFile));
    }

    this.showUnregisteredColumnsDialog.set(false);
    this.unregisteredColumns.set([]);
    this.pendingFileForValidation.set(null);
    this.newHeaderForms.set([]);

    this.notificationService.info('Importación cancelada', 'El archivo no fue procesado');
  }

  /**
   * Alterna la selección de una columna
   */
  toggleColumnSelection(index: number) {
    this.unregisteredColumns.update(cols => {
      const updated = [...cols];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });

    // Inicializar o limpiar el formulario correspondiente
    const col = this.unregisteredColumns()[index];
    this.newHeaderForms.update(forms => {
      const updated = [...forms];
      if (col.selected) {
        updated[index] = {
          headerName: col.name,
          dataType: col.detectedType,
          displayLabel: this.generateDisplayLabel(col.name),
          format: col.detectedType === 'FECHA' ? 'dd/MM/yyyy' : '',
          required: false,
          sampleValues: col.sampleValues
        };
      }
      return updated;
    });
  }

  /**
   * Genera una etiqueta visual a partir del nombre de la columna
   */
  private generateDisplayLabel(headerName: string): string {
    return headerName
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  /**
   * Actualiza un campo del formulario de cabecera
   */
  updateHeaderForm(index: number, field: string, event: Event) {
    const value = (event.target as HTMLInputElement | HTMLSelectElement).value;
    this.newHeaderForms.update(forms => {
      const updated = [...forms];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  }

  /**
   * Obtiene el conteo de columnas seleccionadas
   */
  getSelectedColumnsCount(): number {
    return this.unregisteredColumns().filter(c => c.selected).length;
  }

  /**
   * Detecta automáticamente el campo de enlace (linkField) de los datos
   * Busca campos comunes de identificación en orden de prioridad
   */
  private detectLinkField(data: Record<string, any>[]): string {
    if (!data || data.length === 0) {
      return 'IDENTITY_CODE'; // Fallback por defecto
    }

    // Lista de nombres de campo comunes para identificación (en orden de prioridad)
    const identityFieldNames = [
      'IDENTITY_CODE',
      'identity_code',
      'COD_CLI',
      'cod_cli',
      'CODIGO_IDENTIFICACION',
      'codigo_identificacion',
      'CUSTOMER_ID',
      'customer_id',
      'ID_CLIENTE',
      'id_cliente',
      'DOCUMENTO',
      'documento',
      'DNI',
      'dni',
      'RUC',
      'ruc',
      'NUM_DOCUMENTO',
      'num_documento'
    ];

    // Obtener las keys del primer registro
    const availableKeys = Object.keys(data[0]);

    // Buscar el primer campo de identificación disponible
    for (const fieldName of identityFieldNames) {
      // Búsqueda exacta
      if (availableKeys.includes(fieldName)) {
        return fieldName;
      }

      // Búsqueda case-insensitive
      const found = availableKeys.find(key =>
        key.toLowerCase() === fieldName.toLowerCase()
      );
      if (found) {
        return found;
      }

      // Búsqueda parcial (el campo contiene el nombre)
      const partial = availableKeys.find(key =>
        key.toLowerCase().includes(fieldName.toLowerCase().replace(/_/g, ''))
      );
      if (partial) {
        return partial;
      }
    }

    // Si no se encuentra ninguno, usar la primera columna como fallback
    return availableKeys[0];
  }

  /**
   * Selecciona o deselecciona todas las columnas
   */
  selectAllColumns() {
    const allSelected = this.getSelectedColumnsCount() === this.unregisteredColumns().length;

    this.unregisteredColumns.update(cols =>
      cols.map(col => ({ ...col, selected: !allSelected }))
    );

    // Inicializar formularios para todas las columnas seleccionadas
    if (!allSelected) {
      this.newHeaderForms.set(
        this.unregisteredColumns().map(col => ({
          headerName: col.name,
          dataType: col.detectedType,
          displayLabel: this.generateDisplayLabel(col.name),
          format: col.detectedType === 'FECHA' ? 'dd/MM/yyyy' : '',
          required: false,
          sampleValues: col.sampleValues
        }))
      );
    }
  }

  /**
   * Crea las cabeceras seleccionadas y continúa con la validación
   */
  async createSelectedHeadersAndContinue() {
    const selectedColumns = this.unregisteredColumns().filter(c => c.selected);
    const forms = this.newHeaderForms();

    if (selectedColumns.length === 0) {
      this.notificationService.warning('Sin selección', 'No hay columnas seleccionadas para crear');
      return;
    }

    const pendingFile = this.pendingFileForValidation();
    if (!pendingFile) {
      this.notificationService.error('Error', 'No hay archivo pendiente');
      return;
    }

    const loadType: LoadType = pendingFile.type === 'DAILY' ? 'ACTUALIZACION' : 'INICIAL';

    // Preparar datos para crear cabeceras en lote
    const headersToCreate: HeaderConfigurationItem[] = selectedColumns.map((col) => {
      const originalIndex = this.unregisteredColumns().findIndex(c => c.name === col.name);
      const form = forms[originalIndex];

      return {
        fieldDefinitionId: 0, // Campo personalizado
        headerName: form?.headerName || col.name,
        dataType: (form?.dataType || col.detectedType) as DataType,
        displayLabel: form?.displayLabel || this.generateDisplayLabel(col.name),
        format: form?.format || (col.detectedType === 'FECHA' ? 'dd/MM/yyyy' : undefined),
        required: form?.required || false,
        sourceField: undefined,
        regexPattern: undefined
      };
    });

    const bulkRequest: BulkCreateHeaderConfigurationRequest = {
      subPortfolioId: this.selectedSubPortfolioId,
      loadType,
      headers: headersToCreate
    };

    this.isCreatingHeaders.set(true);

    try {
      // Crear cabeceras en lote
      const result = await firstValueFrom(
        this.headerConfigService.createBulk(bulkRequest)
      );

      this.notificationService.success(
        'Cabeceras creadas',
        `Se crearon ${headersToCreate.length} cabecera(s) exitosamente`
      );

      // Recargar las cabeceras configuradas
      if (loadType === 'ACTUALIZACION') {
        const headers = await firstValueFrom(
          this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, 'ACTUALIZACION')
        );
        this.headersActualizacion.set(headers);
      } else {
        const headers = await firstValueFrom(
          this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, 'INICIAL')
        );
        this.headersInicial.set(headers);
      }

      // Cerrar diálogo
      this.showUnregisteredColumnsDialog.set(false);
      this.unregisteredColumns.set([]);
      this.newHeaderForms.set([]);
      this.pendingFileForValidation.set(null);

      // Re-validar el archivo con las nuevas cabeceras
      await this.parseAndValidateFile(pendingFile);

    } catch (error: any) {
      console.error('Error creando cabeceras:', error);
      this.notificationService.error(
        'Error al crear cabeceras',
        error.error?.message || error.message || 'No se pudieron crear las cabeceras'
      );
    } finally {
      this.isCreatingHeaders.set(false);
    }
  }

  /**
   * Procede ignorando las columnas no registradas
   */
  proceedIgnoringUnregisteredColumns() {
    const pendingFile = this.pendingFileForValidation();

    if (!pendingFile) {
      this.notificationService.error('Error', 'No hay archivo pendiente para procesar');
      return;
    }

    const unselectedColumns = this.unregisteredColumns().filter(c => !c.selected);
    if (unselectedColumns.length > 0) {
      const ignoredColumns = unselectedColumns.map(c => c.name).join(', ');
      this.notificationService.warning(
        'Columnas ignoradas',
        `Las siguientes columnas no serán importadas: ${ignoredColumns}`,
        8000
      );
    }

    // Cerrar diálogo
    this.showUnregisteredColumnsDialog.set(false);
    this.unregisteredColumns.set([]);
    this.newHeaderForms.set([]);
    this.pendingFileForValidation.set(null);

    // Completar la validación del archivo
    this.completeFileValidation(pendingFile);
  }
}
