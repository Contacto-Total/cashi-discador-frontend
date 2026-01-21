import { Component, OnInit, signal, computed, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { HeaderConfigurationService } from '../../services/header-configuration.service';
import { FieldDefinitionService } from '../../services/field-definition.service';
import { TypificationService } from '../../services/typification.service';
import { PortfolioService } from '../../services/portfolio.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { NotificationsComponent } from '../../../shared/components/notifications/notifications.component';
import {
  HeaderConfiguration,
  HeaderConfigurationItem,
  CreateHeaderConfigurationRequest,
  DataType,
  LoadType,
  HeaderAlias,
  HeaderResolutionResult,
  ImportPreviewResult,
  ImportResult,
  ConflictResolution,
  ConflictItem
} from '../../models/header-configuration.model';
import { FieldDefinition } from '../../models/field-definition.model';
import { Tenant } from '../../models/tenant.model';
import { Portfolio } from '../../models/portfolio.model';
import { SubPortfolio } from '../../models/portfolio.model';
import { DATE_DETECTION_PATTERNS, detectDateFormat } from '../../../shared/constants/date-formats';

// Interface para columnas detectadas en el archivo
interface DetectedColumn {
  name: string;
  dataType: DataType;
  format?: string;
  displayLabel: string;
  sampleValues: string[];
  selected: boolean;
  // Auto-matching properties
  matchedFieldDefinition?: FieldDefinition;
  matchStatus: 'matched' | 'review' | 'no-match';
  matchScore?: number; // Similarity score (0-100)
}

@Component({
  selector: 'app-header-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NotificationsComponent],
  template: `
    <!-- Notifications Toast -->
    <app-notifications></app-notifications>

    <!-- Dialog de Selección de Columnas -->
    @if (showColumnSelectionDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="columns" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">Seleccionar columnas a importar</h2>
                <p class="text-emerald-100 text-sm">
                  {{ detectedColumns().length }} columna(s) detectada(s) en
                  <span class="font-semibold">{{ importFileName() }}</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5 overflow-y-auto max-h-[55vh]">
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Seleccione las columnas que desea agregar como cabeceras. Las columnas no seleccionadas serán ignoradas.
            </p>

            <!-- Lista de columnas con checkboxes -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              @for (col of detectedColumns(); track col.name; let i = $index) {
                <div class="bg-gray-50 dark:bg-slate-700/50 rounded-lg border transition-all cursor-pointer"
                     [class.border-emerald-500]="col.selected"
                     [class.border-gray-200]="!col.selected"
                     [class.dark:border-slate-600]="!col.selected"
                     [class.bg-emerald-50]="col.selected"
                     [class.dark:bg-emerald-900/20]="col.selected"
                     (click)="toggleColumnDetected(i)">
                  <div class="p-3">
                    <div class="flex items-start gap-3">
                      <!-- Checkbox -->
                      <div class="mt-0.5">
                        <input type="checkbox"
                               [checked]="col.selected"
                               (click)="$event.stopPropagation()"
                               (change)="toggleColumnDetected(i)"
                               class="w-4 h-4 rounded border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer">
                      </div>

                      <!-- Info de la columna -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          <span class="font-mono text-sm font-semibold truncate"
                                [class.text-emerald-600]="col.selected"
                                [class.dark:text-emerald-400]="col.selected"
                                [class.text-gray-700]="!col.selected"
                                [class.dark:text-gray-300]="!col.selected">
                            {{ col.name }}
                          </span>
                          <span class="text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0"
                                [class.bg-purple-100]="col.dataType === 'FECHA'"
                                [class.dark:bg-purple-900/50]="col.dataType === 'FECHA'"
                                [class.text-purple-600]="col.dataType === 'FECHA'"
                                [class.dark:text-purple-400]="col.dataType === 'FECHA'"
                                [class.bg-blue-100]="col.dataType === 'NUMERICO'"
                                [class.dark:bg-blue-900/50]="col.dataType === 'NUMERICO'"
                                [class.text-blue-600]="col.dataType === 'NUMERICO'"
                                [class.dark:text-blue-400]="col.dataType === 'NUMERICO'"
                                [class.bg-gray-200]="col.dataType === 'TEXTO'"
                                [class.dark:bg-slate-600]="col.dataType === 'TEXTO'"
                                [class.text-gray-600]="col.dataType === 'TEXTO'"
                                [class.dark:text-gray-300]="col.dataType === 'TEXTO'">
                            {{ col.dataType }}
                          </span>
                        </div>
                        @if (col.sampleValues.length > 0) {
                          <div class="text-[11px] text-gray-500 truncate">
                            Ej: {{ col.sampleValues.slice(0, 2).join(' | ') }}
                          </div>
                        }
                        <!-- Match Status Indicator -->
                        <div class="mt-1.5 flex items-center gap-1.5">
                          @if (col.matchStatus === 'matched') {
                            <span class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-full">
                              <lucide-angular name="check-circle" [size]="10"></lucide-angular>
                              {{ col.matchedFieldDefinition?.fieldName }}
                            </span>
                          } @else if (col.matchStatus === 'review') {
                            <span class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 rounded-full">
                              <lucide-angular name="alert-circle" [size]="10"></lucide-angular>
                              Revisar: {{ col.matchedFieldDefinition?.fieldName }}
                            </span>
                          } @else {
                            <span class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-full">
                              <lucide-angular name="x-circle" [size]="10"></lucide-angular>
                              Sin coincidencia
                            </span>
                          }
                          @if (col.matchScore) {
                            <span class="text-[9px] text-gray-400">({{ col.matchScore }}%)</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  <span class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ getSelectedColumnsCount() }}</span>
                  de {{ detectedColumns().length }} columna(s) seleccionada(s)
                </span>
              </div>
              <div class="flex gap-2">
                <button (click)="selectAllDetectedColumns()"
                        class="text-xs px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 cursor-pointer">
                  Seleccionar todas
                </button>
                <button (click)="deselectAllDetectedColumns()"
                        class="text-xs px-3 py-1.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 cursor-pointer">
                  Deseleccionar todas
                </button>
              </div>
            </div>

            <div class="flex gap-3 justify-end">
              <button
                (click)="cancelColumnSelection()"
                class="px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium cursor-pointer">
                Cancelar
              </button>
              <button
                (click)="confirmColumnSelection()"
                [disabled]="getSelectedColumnsCount() === 0"
                class="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                <lucide-angular name="check" [size]="16"></lucide-angular>
                Agregar {{ getSelectedColumnsCount() }} cabecera(s)
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="h-[calc(100dvh-56px)] bg-gray-100 dark:bg-slate-950 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="p-3 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <lucide-angular name="table-2" [size]="16" class="text-white"></lucide-angular>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-white">Configuración de Cabeceras</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">Define las cabeceras personalizadas por subcartera</p>
          </div>
        </div>
      </div>

      <!-- Filtros en Cascada -->
      <div class="mb-2">
        <div class="bg-white dark:bg-slate-900 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                <lucide-angular name="building-2" [size]="16" class="inline mr-1"></lucide-angular>
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange()"
                      class="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                <lucide-angular name="folder" [size]="16" class="inline mr-1"></lucide-angular>
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange()"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                <lucide-angular name="folder-tree" [size]="16" class="inline mr-1"></lucide-angular>
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange()"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                  <option [value]="subPortfolio.id">{{ subPortfolio.subPortfolioName }}</option>
                }
              </select>
            </div>

            <!-- Tipo de Carga -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                <lucide-angular name="database" [size]="16" class="inline mr-1"></lucide-angular>
                Tipo de Carga
              </label>
              <select [(ngModel)]="selectedLoadType"
                      (ngModelChange)="onLoadTypeChange()"
                      [disabled]="selectedSubPortfolioId === 0"
                      class="w-full px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="ACTUALIZACION">Carga Diaria</option>
                <option value="INICIAL">Carga Inicial del Mes</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      @if (selectedSubPortfolioId > 0) {
        <!-- Panel de Acciones -->
        <div class="mb-2">
          <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
            <!-- Contenido del Panel -->
            <div class="p-3">
              <!-- Primera fila: Botones principales y contador -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <!-- Dropdown para descargar plantillas -->
                <div class="relative">
                  <button (click)="toggleDownloadMenu()"
                          #downloadButton
                          class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all cursor-pointer">
                    <lucide-angular name="file-text" [size]="16"></lucide-angular>
                    <span class="hidden sm:inline">Descargar Plantilla</span>
                    <span class="sm:hidden">Plantilla</span>
                    <lucide-angular [name]="downloadMenuOpen() ? 'chevron-up' : 'chevron-down'" [size]="14"></lucide-angular>
                  </button>
                </div>

                <!-- Botón Importar Configuración -->
                <label class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all cursor-pointer">
                  <lucide-angular name="folder-open" [size]="16"></lucide-angular>
                  <span class="hidden sm:inline">Importar CSV/Excel</span>
                  <span class="sm:hidden">Importar</span>
                  <input type="file"
                         accept=".csv,.xlsx,.xls"
                         (change)="onFileSelected($event)"
                         class="hidden">
                </label>

                <!-- Botón Agregar Cabecera Manual -->
                <button (click)="openManualDialog()"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all cursor-pointer">
                  <lucide-angular name="plus" [size]="16"></lucide-angular>
                  <span class="hidden sm:inline">Agregar Cabecera</span>
                  <span class="sm:hidden">Agregar</span>
                </button>

                <!-- Botón Importar desde otra Subcartera -->
                <button (click)="openImportFromSubPortfolioDialog()"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-all cursor-pointer">
                  <lucide-angular name="copy" [size]="16"></lucide-angular>
                  <span class="hidden sm:inline">Copiar de otra Subcartera</span>
                  <span class="sm:hidden">Copiar</span>
                </button>

                <!-- Contador de cabeceras -->
                @if (previewHeaders().length > 0) {
                  <div class="ml-auto flex items-center gap-2 px-3 py-1.5">
                    <lucide-angular name="table-2" [size]="14" class="text-indigo-500 dark:text-indigo-400"></lucide-angular>
                    <span class="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{{ previewHeaders().length }}</span>
                    <span class="text-xs text-indigo-600 dark:text-indigo-400">cabecera(s)</span>
                  </div>
                }
              </div>

              <!-- Menú dropdown con posición fixed para evitar overflow hidden del contenedor -->
              @if (downloadMenuOpen()) {
                <div class="fixed inset-0 z-[9998]" (click)="downloadMenuOpen.set(false)"></div>
                <div class="fixed w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 py-1 z-[9999]"
                     [style.top.px]="dropdownPosition().top"
                     [style.left.px]="dropdownPosition().left">
                  <button (click)="downloadCSVTemplate()"
                          class="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left text-gray-700 dark:text-gray-300 cursor-pointer">
                    <lucide-angular name="file-text" [size]="16" class="text-gray-500 dark:text-gray-400"></lucide-angular>
                    <span class="text-sm font-medium">Descargar CSV</span>
                  </button>
                  <button (click)="downloadExcelTemplate()"
                          class="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left text-gray-700 dark:text-gray-300 cursor-pointer">
                    <lucide-angular name="table-2" [size]="16" class="text-green-500 dark:text-green-400"></lucide-angular>
                    <span class="text-sm font-medium">Descargar Excel (.xlsx)</span>
                  </button>
                </div>
              }

              <!-- Segunda fila: Botones de acción cuando hay cabeceras -->
              @if (previewHeaders().length > 0) {
                <div class="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                  <button (click)="clearAll()"
                          class="flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer">
                    <lucide-angular name="trash-2" [size]="14"></lucide-angular>
                    <span>Limpiar</span>
                  </button>

                  <button (click)="confirmConfiguration()"
                          [disabled]="isSaving()"
                          class="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                    @if (isSaving()) {
                      <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
                      <span>Guardando...</span>
                    } @else {
                      <lucide-angular name="save" [size]="16"></lucide-angular>
                      <span>Guardar</span>
                    }
                  </button>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Tabla de Previsualización -->
        <div>
          <div class="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
            @if (previewHeaders().length === 0) {
              <div class="p-6 text-center">
                <div class="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <lucide-angular name="table-2" [size]="24" class="text-gray-400 dark:text-gray-600"></lucide-angular>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">No hay cabeceras configuradas</p>
              </div>
            } @else {
              <div class="overflow-x-auto max-h-[calc(100dvh-340px)] overflow-y-auto">
                <table class="w-full">
                  <thead class="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0">
                    <tr>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Nombre</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Tipo</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Etiqueta</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Campo Catálogo</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Formato</th>
                      <th class="px-2 py-1.5 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Req.</th>
                      <th class="px-2 py-1.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
                    @for (header of previewHeaders(); track $index) {
                      <tr class="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <td class="px-2 py-1.5">
                          <div class="flex items-center gap-1">
                            @if (header.id) {
                              <lucide-angular
                                name="database"
                                [size]="12"
                                class="text-green-500 dark:text-green-400 flex-shrink-0"
                                title="Cabecera guardada en BD">
                              </lucide-angular>
                            } @else {
                              <span class="px-1 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-[9px] rounded font-medium">NUEVO</span>
                            }
                            <span class="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{{ header.headerName }}</span>
                            @if (header.sourceField && header.regexPattern) {
                              <lucide-angular
                                name="sparkles"
                                [size]="12"
                                class="text-amber-500 dark:text-amber-400 flex-shrink-0"
                                title="Campo transformado mediante expresión regular desde: {{ header.sourceField }}">
                              </lucide-angular>
                            }
                          </div>
                        </td>
                        <td class="px-2 py-1.5">
                          <span [class]="getDataTypeBadgeClass(header.dataType)"
                                class="inline-flex px-1.5 py-0.5 rounded text-xs font-medium">
                            {{ header.dataType }}
                          </span>
                        </td>
                        <td class="px-2 py-1.5">
                          <span class="text-xs text-gray-900 dark:text-white">{{ header.displayLabel }}</span>
                        </td>
                        <td class="px-2 py-1.5">
                          @if (header.fieldDefinitionId === 0) {
                            <span class="text-xs text-amber-600 dark:text-amber-400 italic">Sin asociar</span>
                          } @else {
                            <span class="font-mono text-xs text-gray-500 dark:text-gray-400">{{ getFieldCodeById(header.fieldDefinitionId) }}</span>
                          }
                        </td>
                        <td class="px-2 py-1.5">
                          <span class="text-xs text-gray-500 dark:text-gray-400">{{ header.format || '-' }}</span>
                        </td>
                        <td class="px-2 py-1.5 text-center">
                          @if (header.required) {
                            <lucide-angular name="check-circle" [size]="14" class="text-green-500 dark:text-green-400 inline"></lucide-angular>
                          } @else {
                            <lucide-angular name="circle" [size]="14" class="text-gray-400 dark:text-gray-600 inline"></lucide-angular>
                          }
                        </td>
                        <td class="px-2 py-1.5">
                          <div class="flex items-center gap-1">
                            <button (click)="editPreviewHeader($index)"
                                    class="p-1 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
                                    title="Editar">
                              <lucide-angular name="edit" [size]="14"></lucide-angular>
                            </button>
                            @if (canManageAlias($index)) {
                              <button (click)="openAliasDialog($index)"
                                      class="p-1 text-amber-500 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors relative"
                                      title="Gestionar alias">
                                <lucide-angular name="tags" [size]="14"></lucide-angular>
                                @if (getAliasCount($index) > 0) {
                                  <span class="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center">
                                    {{ getAliasCount($index) }}
                                  </span>
                                }
                              </button>
                            }
                            <button (click)="removePreviewHeader($index)"
                                    class="p-1 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
                                    title="Eliminar">
                              <lucide-angular name="trash-2" [size]="14"></lucide-angular>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      }

      <!-- Dialog Agregar/Editar Manual -->
      @if (showManualDialog()) {
        <div class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-slate-800">
            <!-- Dialog Header -->
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="plus-circle" [size]="20"></lucide-angular>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold !text-white">{{ editingIndex() !== null ? 'Editar' : 'Agregar' }} Cabecera</h2>
                    <p class="text-indigo-100 text-sm">Complete la información de la cabecera</p>
                  </div>
                </div>
                <button (click)="closeManualDialog()" class="text-white/80 hover:text-white">
                  <lucide-angular name="x" [size]="20"></lucide-angular>
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div class="space-y-4">
                <!-- Campo Base de Datos (Dropdown del Catálogo) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <lucide-angular name="book-open" [size]="16" class="inline mr-1"></lucide-angular>
                    Campo Base de Datos (Opcional)
                    @if (formData.id) {
                      <lucide-angular name="lock" [size]="12" class="inline ml-1 text-amber-500 dark:text-amber-400" title="No editable"></lucide-angular>
                    }
                  </label>
                  <select [(ngModel)]="formData.fieldDefinitionId"
                          (ngModelChange)="onFieldDefinitionSelect()"
                          [disabled]="!!formData.id"
                          class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    <option [value]="0">Sin asociar - Campo personalizado</option>
                    @for (group of groupedFieldDefinitions(); track group.table) {
                      <optgroup [label]="group.label">
                        @for (field of group.fields; track field.id) {
                          <option [value]="field.id">
                            {{ field.fieldName }} ({{ field.fieldCode }})
                          </option>
                        }
                      </optgroup>
                    }
                  </select>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    @if (formData.id) {
                      La asociación al catálogo no puede cambiarse en cabeceras existentes.
                    } @else {
                      Seleccione un campo del catálogo o deje "Sin asociar" para crear un campo personalizado.
                    }
                  </p>
                </div>

                <!-- Información del Catálogo (Solo Lectura) -->
                @if (getSelectedFieldDefinition(); as selectedField) {
                  <div class="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 space-y-2 border border-gray-200 dark:border-slate-700/50">
                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">📋 Información del Catálogo</p>

                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs text-gray-500 dark:text-gray-400">Tipo de Dato:</span>
                      <span [class]="getDataTypeBadgeClass(selectedField.dataType)"
                            class="inline-flex px-2 py-0.5 rounded text-xs font-medium">
                        {{ selectedField.dataType }}
                      </span>
                      @if (selectedField.associatedTable) {
                        <span class="text-xs text-gray-400 dark:text-gray-500">|</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">Tabla:</span>
                        <span class="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                          {{ selectedField.associatedTable === 'clientes' ? '👤 Clientes' : selectedField.associatedTable === 'metodos_contacto' ? '📞 Contactos' : selectedField.associatedTable }}
                        </span>
                      }
                    </div>

                    @if (selectedField.description) {
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Descripción:</span> {{ selectedField.description }}
                      </div>
                    }

                    @if (selectedField.format) {
                      <div class="text-xs text-gray-500 dark:text-gray-400">
                        <span class="font-semibold">Formato del Sistema:</span>
                        <code class="text-cyan-600 dark:text-cyan-400">{{ selectedField.format }}</code>
                      </div>
                    }
                  </div>
                }

                <!-- Advertencia para cabeceras existentes -->
                @if (formData.id) {
                  <div class="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg p-3 mb-2">
                    <div class="flex items-start gap-2">
                      <lucide-angular name="alert-triangle" [size]="16" class="text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0"></lucide-angular>
                      <div>
                        <p class="text-sm text-amber-700 dark:text-amber-300 font-medium">Cabecera existente en base de datos</p>
                        <p class="text-xs text-amber-600 dark:text-amber-400/80 mt-1">
                          El nombre del campo y tipo de dato no pueden modificarse porque la columna ya existe en la tabla.
                          Solo puede editar: etiqueta visual, formato y obligatoriedad.
                        </p>
                      </div>
                    </div>
                  </div>
                }

                <!-- Selector de Tipo de Dato (para campos personalizados) -->
                @if (formData.fieldDefinitionId === 0) {
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      <lucide-angular name="type" [size]="16" class="inline mr-1"></lucide-angular>
                      Tipo de Dato *
                      @if (formData.id) {
                        <lucide-angular name="lock" [size]="12" class="inline ml-1 text-amber-500 dark:text-amber-400" title="No editable"></lucide-angular>
                      }
                    </label>
                    <select [(ngModel)]="formData.dataType"
                            [disabled]="!!formData.id"
                            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="TEXTO">TEXTO</option>
                      <option value="NUMERICO">NUMERICO</option>
                      <option value="FECHA">FECHA</option>
                      <option value="BOOLEANO">BOOLEANO</option>
                    </select>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      @if (formData.id) {
                        El tipo de dato no puede cambiarse en cabeceras existentes.
                      } @else {
                        Seleccione el tipo de dato para este campo personalizado.
                      }
                    </p>
                  </div>
                }

                <!-- Campo Sistema (Input Texto Libre) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <lucide-angular name="settings" [size]="16" class="inline mr-1"></lucide-angular>
                    Campo Sistema *
                    @if (formData.id) {
                      <lucide-angular name="lock" [size]="12" class="inline ml-1 text-amber-500 dark:text-amber-400" title="No editable"></lucide-angular>
                    }
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.headerName"
                         [disabled]="!!formData.id"
                         placeholder="Ej: DNI, Saldo Vencido, Teléfono Principal"
                         class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    @if (formData.id) {
                      El nombre del campo no puede cambiarse en cabeceras existentes.
                    } @else {
                      Nombre de la cabecera tal como viene del proveedor.
                    }
                  </p>
                </div>

                <!-- Etiqueta Visual (Input Texto) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <lucide-angular name="eye" [size]="16" class="inline mr-1"></lucide-angular>
                    Etiqueta Visual *
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.displayLabel"
                         placeholder="Ej: Número de Documento, Saldo Pendiente"
                         class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Texto que se mostrará en la interfaz de usuario.
                  </p>
                </div>

                <!-- Formato (Input Texto Opcional) -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <lucide-angular name="file-text" [size]="16" class="inline mr-1"></lucide-angular>
                    Formato
                  </label>
                  <input type="text"
                         [(ngModel)]="formData.format"
                         placeholder="Ej: dd/MM/yyyy, decimal(18,2)"
                         class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Formato específico para esta subcartera (opcional, puede diferir del formato del sistema).
                  </p>
                </div>

                <!-- Obligatorio -->
                <div class="flex items-center gap-3">
                  <input type="checkbox"
                         [(ngModel)]="formData.required"
                         id="required"
                         class="w-4 h-4 text-indigo-600 bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-700 rounded focus:ring-indigo-500">
                  <label for="required" class="text-sm text-gray-700 dark:text-gray-300">
                    Campo obligatorio
                  </label>
                </div>

                <!-- Sección de Transformación -->
                <div class="col-span-2 border-t border-gray-200 dark:border-slate-700 pt-4 mt-2">
                  <!-- Toggle Header -->
                  <button type="button"
                          (click)="showTransformSection.set(!showTransformSection())"
                          class="w-full flex items-center justify-between text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-3 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors">
                    <div class="flex items-center gap-2">
                      <lucide-angular name="git-branch" [size]="16"></lucide-angular>
                      Transformación de Campo (Opcional)
                    </div>
                    <lucide-angular
                      [name]="showTransformSection() ? 'chevron-up' : 'chevron-down'"
                      [size]="16">
                    </lucide-angular>
                  </button>

                  @if (showTransformSection()) {
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Si este campo se deriva de otro campo mediante regex, configúralo aquí.<br>
                      Ejemplo: extraer documento desde IDENTITY_CODE.
                    </p>

                    <div class="grid grid-cols-1 gap-4">
                      <!-- Campo Origen -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <lucide-angular name="arrow-right" [size]="16" class="inline mr-1"></lucide-angular>
                          Campo Origen
                        </label>
                        <select [(ngModel)]="formData.sourceField"
                                class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                          <option value="">Seleccione un campo origen...</option>
                          @for (header of availableSourceHeaders(); track header.headerName) {
                            <option [value]="header.headerName">
                              {{ header.headerName }} - {{ header.displayLabel }}
                            </option>
                          }
                        </select>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Campo desde donde se extraerá el valor mediante regex.
                        </p>
                      </div>

                      <!-- Patrón Regex -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          <lucide-angular name="code" [size]="16" class="inline mr-1"></lucide-angular>
                          Patrón Regex
                          @if (formData.sourceField && formData.sourceField.trim() !== '') {
                            <span class="text-red-500 dark:text-red-400 ml-1">*</span>
                          }
                        </label>
                        <input type="text"
                               [(ngModel)]="formData.regexPattern"
                               placeholder="Ej: .{{8}}$ (últimos 8 caracteres)"
                               class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Ejemplos: <code class="text-emerald-600 dark:text-emerald-400">.{{8}}$</code> últimos 8 • <code class="text-emerald-600 dark:text-emerald-400">\\d{{8}}</code> 8 dígitos
                        </p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="border-t border-gray-200 dark:border-slate-800 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-slate-950">
              <button (click)="closeManualDialog()"
                      class="px-5 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white rounded-lg font-medium transition-colors">
                Cancelar
              </button>
              <button (click)="saveManualHeader()"
                      [disabled]="!canSaveManualHeader()"
                      class="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {{ editingIndex() !== null ? 'Actualizar' : 'Agregar' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Dialog Gestión de Alias -->
      @if (showAliasDialog()) {
        <div class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-slate-800">
            <!-- Dialog Header -->
            <div class="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="tags" [size]="20"></lucide-angular>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold !text-white">Gestionar Alias</h2>
                    <p class="text-amber-100 text-sm">{{ selectedHeaderForAlias()?.headerName }}</p>
                  </div>
                </div>
                <button (click)="closeAliasDialog()" class="text-white/80 hover:text-white">
                  <lucide-angular name="x" [size]="20"></lucide-angular>
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="p-6">
              <!-- Info del campo -->
              <div class="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 mb-4 border border-gray-200 dark:border-slate-700/50">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre principal de la cabecera</p>
                <p class="text-gray-900 dark:text-white font-mono font-semibold">{{ selectedHeaderForAlias()?.headerName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Los alias permiten que el sistema reconozca columnas del Excel aunque tengan nombres diferentes.</p>
              </div>

              <!-- Agregar nuevo alias -->
              <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <lucide-angular name="plus" [size]="14" class="inline mr-1"></lucide-angular>
                  Agregar nuevo alias
                </label>
                <div class="flex gap-2">
                  <input type="text"
                         [ngModel]="newAliasName()"
                         (ngModelChange)="newAliasName.set($event)"
                         (keyup.enter)="addAlias()"
                         placeholder="Nombre alternativo de la columna"
                         class="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                  <button (click)="addAlias()"
                          [disabled]="!newAliasName().trim()"
                          class="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Agregar
                  </button>
                </div>
              </div>

              <!-- Lista de alias -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <lucide-angular name="list" [size]="14" class="inline mr-1"></lucide-angular>
                  Alias configurados
                </label>

                @if (loadingAliases()) {
                  <div class="text-center py-4">
                    <lucide-angular name="loader-2" [size]="24" class="text-amber-500 dark:text-amber-400 animate-spin mx-auto"></lucide-angular>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Cargando alias...</p>
                  </div>
                } @else if (aliases().length === 0) {
                  <div class="text-center py-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-gray-200 dark:border-slate-700/50">
                    <lucide-angular name="tags" [size]="24" class="text-gray-400 dark:text-gray-600 mx-auto"></lucide-angular>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">No hay alias configurados</p>
                  </div>
                } @else {
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    @for (alias of aliases(); track alias.id) {
                      <div class="flex items-center justify-between bg-gray-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-gray-200 dark:border-slate-700/50">
                        <div class="flex items-center gap-2">
                          <lucide-angular name="tag" [size]="14" class="text-amber-500 dark:text-amber-400"></lucide-angular>
                          <span class="text-gray-900 dark:text-white font-mono text-sm">{{ alias.alias }}</span>
                          @if (alias.isPrincipal) {
                            <span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded text-[10px] font-medium">Principal</span>
                          }
                        </div>
                        @if (!alias.isPrincipal) {
                          <button (click)="removeAlias(alias)"
                                  class="p-1 text-red-500 dark:text-red-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded transition-colors"
                                  title="Eliminar alias">
                            <lucide-angular name="trash-2" [size]="14"></lucide-angular>
                          </button>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="border-t border-gray-200 dark:border-slate-800 p-4 flex justify-end bg-gray-50 dark:bg-slate-950">
              <button (click)="closeAliasDialog()"
                      class="px-5 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Dialog Importar desde otra Subcartera -->
      @if (showImportFromSubPortfolioDialog()) {
        <div class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-200 dark:border-slate-800">
            <!-- Dialog Header -->
            <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-5">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <lucide-angular name="copy" [size]="24" class="text-white"></lucide-angular>
                </div>
                <div>
                  <h2 class="text-xl font-bold !text-white">Importar Cabeceras desde otra Subcartera</h2>
                  <p class="text-purple-100 text-sm">Copie la configuración de cabeceras de una subcartera existente</p>
                </div>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="p-5 overflow-y-auto max-h-[60vh]">
              <!-- Selector de Subcartera Origen -->
              <div class="mb-5">
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Seleccione la subcartera origen
                </label>
                <select [ngModel]="importSourceSubPortfolioId()"
                        (ngModelChange)="onImportSourceChange($event)"
                        class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option [value]="0" disabled>-- Seleccione una subcartera --</option>
                  @for (sp of getAvailableSourceSubPortfolios(); track sp.id) {
                    <option [value]="sp.id">{{ sp.subPortfolioName }} ({{ sp.subPortfolioCode }})</option>
                  }
                </select>
              </div>

              <!-- Loading Preview -->
              @if (isLoadingImportPreview()) {
                <div class="flex flex-col items-center justify-center py-10">
                  <lucide-angular name="loader-2" [size]="40" class="text-purple-500 animate-spin mb-3"></lucide-angular>
                  <p class="text-gray-500 dark:text-gray-400">Cargando preview...</p>
                </div>
              }

              <!-- Preview Result -->
              @if (importPreviewResult() && !isLoadingImportPreview()) {
                <div class="space-y-4">
                  <!-- Resumen -->
                  <div class="grid grid-cols-2 gap-3">
                    <div class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div class="flex items-center gap-2">
                        <lucide-angular name="plus-circle" [size]="20" class="text-green-600 dark:text-green-400"></lucide-angular>
                        <span class="text-green-700 dark:text-green-300 font-semibold">{{ importPreviewResult()!.totalNew }} nuevas</span>
                      </div>
                      <p class="text-xs text-green-600 dark:text-green-400 mt-1">Cabeceras que se agregarán</p>
                    </div>
                    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <div class="flex items-center gap-2">
                        <lucide-angular name="alert-triangle" [size]="20" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                        <span class="text-amber-700 dark:text-amber-300 font-semibold">{{ importPreviewResult()!.totalConflicts }} conflictos</span>
                      </div>
                      <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">Ya existen en destino</p>
                    </div>
                  </div>

                  <!-- Lista de cabeceras a importar -->
                  @if (importPreviewResult()!.headersToImport.length > 0) {
                    <div>
                      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <lucide-angular name="check-circle" [size]="16" class="text-green-500"></lucide-angular>
                        Cabeceras nuevas a importar
                      </h4>
                      <div class="bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                        @for (header of importPreviewResult()!.headersToImport; track header.headerName) {
                          <div class="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                            <div class="flex items-center gap-2">
                              <span class="font-mono text-sm text-gray-700 dark:text-gray-300">{{ header.headerName }}</span>
                              <span class="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-slate-600 text-gray-600 dark:text-gray-300">{{ header.dataType }}</span>
                            </div>
                            @if (header.hasAliases) {
                              <span class="text-xs text-purple-600 dark:text-purple-400">{{ header.aliasCount }} alias</span>
                            }
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <!-- Lista de conflictos -->
                  @if (importPreviewResult()!.conflicts.length > 0) {
                    <div>
                      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <lucide-angular name="alert-triangle" [size]="16" class="text-amber-500"></lucide-angular>
                        Cabeceras en conflicto
                      </h4>

                      <!-- Selector de resolución de conflictos -->
                      <div class="mb-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <label class="block text-sm font-medium text-amber-700 dark:text-amber-300 mb-2">¿Qué hacer con los conflictos?</label>
                        <div class="space-y-2">
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="conflictResolution" value="SKIP"
                                   [checked]="importConflictResolution() === 'SKIP'"
                                   (change)="importConflictResolution.set('SKIP')"
                                   class="text-purple-600 focus:ring-purple-500">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Omitir (mantener las existentes)</span>
                          </label>
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="conflictResolution" value="REPLACE"
                                   [checked]="importConflictResolution() === 'REPLACE'"
                                   (change)="importConflictResolution.set('REPLACE')"
                                   class="text-purple-600 focus:ring-purple-500">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Reemplazar todas</span>
                          </label>
                          <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="conflictResolution" value="SELECTIVE"
                                   [checked]="importConflictResolution() === 'SELECTIVE'"
                                   (change)="importConflictResolution.set('SELECTIVE')"
                                   class="text-purple-600 focus:ring-purple-500">
                            <span class="text-sm text-gray-700 dark:text-gray-300">Seleccionar individualmente</span>
                          </label>
                        </div>
                      </div>

                      <!-- Lista de conflictos con checkboxes si es SELECTIVE -->
                      <div class="bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                        @for (conflict of importPreviewResult()!.conflicts; track conflict.headerName) {
                          <div class="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
                            <div class="flex items-center gap-2">
                              @if (importConflictResolution() === 'SELECTIVE') {
                                <input type="checkbox"
                                       [checked]="selectedConflictsToReplace().has(conflict.headerName)"
                                       (change)="toggleConflictSelection(conflict.headerName)"
                                       class="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded">
                              }
                              <span class="font-mono text-sm text-gray-700 dark:text-gray-300">{{ conflict.headerName }}</span>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">
                              <span class="text-purple-600 dark:text-purple-400">{{ conflict.sourceDisplayLabel }}</span>
                              <lucide-angular name="arrow-right" [size]="12" class="inline mx-1"></lucide-angular>
                              <span class="text-amber-600 dark:text-amber-400">{{ conflict.targetDisplayLabel }}</span>
                            </div>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>
              }

              <!-- Empty state cuando no hay preview -->
              @if (!importPreviewResult() && !isLoadingImportPreview() && importSourceSubPortfolioId() === 0) {
                <div class="text-center py-10">
                  <lucide-angular name="folder-search" [size]="48" class="text-gray-300 dark:text-gray-600 mx-auto mb-3"></lucide-angular>
                  <p class="text-gray-500 dark:text-gray-400">Seleccione una subcartera para ver las cabeceras disponibles</p>
                </div>
              }
            </div>

            <!-- Dialog Footer -->
            <div class="border-t border-gray-200 dark:border-slate-800 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-slate-950">
              <button (click)="closeImportFromSubPortfolioDialog()"
                      class="px-5 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                Cancelar
              </button>
              <button (click)="executeImportFromSubPortfolio()"
                      [disabled]="!importPreviewResult() || isExecutingImport() || (importPreviewResult()!.totalNew === 0 && importPreviewResult()!.totalConflicts === 0)"
                      class="px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                @if (isExecutingImport()) {
                  <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
                  <span>Importando...</span>
                } @else {
                  <lucide-angular name="download" [size]="16"></lucide-angular>
                  <span>Importar Cabeceras</span>
                }
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Dialog Seleccionar Separador CSV -->
      @if (showCsvSeparatorDialog()) {
        <div class="fixed inset-0 bg-black/50 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-slate-800">
            <!-- Dialog Header -->
            <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <lucide-angular name="file-text" [size]="20" class="text-white"></lucide-angular>
                </div>
                <div>
                  <h2 class="text-lg font-bold !text-white">Seleccionar Separador</h2>
                  <p class="text-emerald-100 text-xs">{{ importFileName() }}</p>
                </div>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="p-5">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Seleccione el carácter separador usado en su archivo CSV:
              </p>

              <div class="space-y-2">
                <label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                       [class.border-emerald-500]="csvSeparator === ';'"
                       [class.bg-emerald-50]="csvSeparator === ';'"
                       [class.dark:bg-emerald-900/20]="csvSeparator === ';'"
                       [class.border-gray-200]="csvSeparator !== ';'"
                       [class.dark:border-slate-700]="csvSeparator !== ';'">
                  <input type="radio" name="csvSep" value=";" [(ngModel)]="csvSeparator"
                         class="text-emerald-600 focus:ring-emerald-500">
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Punto y coma</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2 font-mono">(;)</span>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                       [class.border-emerald-500]="csvSeparator === ','"
                       [class.bg-emerald-50]="csvSeparator === ','"
                       [class.dark:bg-emerald-900/20]="csvSeparator === ','"
                       [class.border-gray-200]="csvSeparator !== ','"
                       [class.dark:border-slate-700]="csvSeparator !== ','">
                  <input type="radio" name="csvSep" value="," [(ngModel)]="csvSeparator"
                         class="text-emerald-600 focus:ring-emerald-500">
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Coma</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2 font-mono">(,)</span>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                       [class.border-emerald-500]="csvSeparator === '|'"
                       [class.bg-emerald-50]="csvSeparator === '|'"
                       [class.dark:bg-emerald-900/20]="csvSeparator === '|'"
                       [class.border-gray-200]="csvSeparator !== '|'"
                       [class.dark:border-slate-700]="csvSeparator !== '|'">
                  <input type="radio" name="csvSep" value="|" [(ngModel)]="csvSeparator"
                         class="text-emerald-600 focus:ring-emerald-500">
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Pipe</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2 font-mono">(|)</span>
                  </div>
                </label>

                <label class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all"
                       [class.border-emerald-500]="csvSeparator === '\t'"
                       [class.bg-emerald-50]="csvSeparator === '\t'"
                       [class.dark:bg-emerald-900/20]="csvSeparator === '\t'"
                       [class.border-gray-200]="csvSeparator !== '\t'"
                       [class.dark:border-slate-700]="csvSeparator !== '\t'">
                  <input type="radio" name="csvSep" [value]="'\t'" [(ngModel)]="csvSeparator"
                         class="text-emerald-600 focus:ring-emerald-500">
                  <div>
                    <span class="font-medium text-gray-700 dark:text-gray-300">Tabulación</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-2 font-mono">(Tab)</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="border-t border-gray-200 dark:border-slate-800 p-4 flex justify-end gap-3 bg-gray-50 dark:bg-slate-950">
              <button (click)="cancelCsvImport()"
                      class="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">
                Cancelar
              </button>
              <button (click)="confirmCsvSeparator()"
                      class="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                <lucide-angular name="check" [size]="16"></lucide-angular>
                Continuar
              </button>
            </div>
          </div>
        </div>
      }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderConfigurationComponent implements OnInit {
  @ViewChild('downloadButton', { read: ElementRef }) downloadButton?: ElementRef;

  // Inyección del servicio de notificaciones
  private notificationService = inject(NotificationService);

  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  fieldDefinitions = signal<FieldDefinition[]>([]);
  previewHeaders = signal<HeaderConfigurationItem[]>([]);
  showManualDialog = signal(false);
  editingIndex = signal<number | null>(null);
  downloadMenuOpen = signal(false);
  showTransformSection = signal(false);
  dropdownPosition = signal<{ top: number; left: number }>({ top: 120, left: 100 });
  headersAreSaved = signal(false); // Indica si hay cabeceras guardadas en BD
  isLoading = signal(false); // Estado de carga global
  isSaving = signal(false); // Estado de guardado

  // Signals para gestión de alias
  showAliasDialog = signal(false);
  selectedHeaderForAlias = signal<HeaderConfiguration | null>(null);
  aliases = signal<HeaderAlias[]>([]);
  newAliasName = signal('');
  loadingAliases = signal(false);
  savedHeaders = signal<HeaderConfiguration[]>([]); // Cabeceras guardadas en BD con sus IDs

  // Signals para selección de columnas al importar archivo
  showColumnSelectionDialog = signal(false);
  detectedColumns = signal<DetectedColumn[]>([]);
  importFileName = signal('');

  // Signals para importar desde otra subcartera
  showImportFromSubPortfolioDialog = signal(false);
  importPreviewResult = signal<ImportPreviewResult | null>(null);
  importSourceSubPortfolioId = signal<number>(0);
  importConflictResolution = signal<ConflictResolution>('SKIP');
  selectedConflictsToReplace = signal<Set<string>>(new Set());
  isLoadingImportPreview = signal(false);
  isExecutingImport = signal(false);
  allSubPortfolios = signal<SubPortfolio[]>([]); // Todas las subcarteras disponibles

  // Signals para diálogo de separador CSV
  showCsvSeparatorDialog = signal(false);
  pendingCsvFile = signal<File | null>(null);

  // Computed signal para mostrar solo campos disponibles (no usados)
  availableFieldDefinitions = computed(() => {
    const usedIds = this.previewHeaders().map(h => h.fieldDefinitionId);
    const currentId = this.formData.fieldDefinitionId;
    const editIdx = this.editingIndex();

    return this.fieldDefinitions().filter(f => {
      // Si estamos editando, permitir el campo actual
      if (editIdx !== null && f.id === currentId) {
        return true;
      }
      // Si no está en uso, mostrar
      return !usedIds.includes(f.id);
    });
  });

  // Computed signal para campos agrupados por tabla asociada
  groupedFieldDefinitions = computed(() => {
    const fields = this.availableFieldDefinitions();
    const groups: { table: string; label: string; fields: typeof fields }[] = [];

    // Agrupar por tabla asociada
    const clientesFields = fields.filter(f => f.associatedTable === 'clientes');
    const contactosFields = fields.filter(f => f.associatedTable === 'metodos_contacto');
    const otrosFields = fields.filter(f => !f.associatedTable || f.associatedTable === 'otros');

    if (clientesFields.length > 0) {
      groups.push({ table: 'clientes', label: '👤 Datos del Cliente', fields: clientesFields });
    }
    if (contactosFields.length > 0) {
      groups.push({ table: 'metodos_contacto', label: '📞 Métodos de Contacto', fields: contactosFields });
    }
    if (otrosFields.length > 0) {
      groups.push({ table: 'otros', label: '📋 Otros Campos', fields: otrosFields });
    }

    return groups;
  });

  // Computed signal para cabeceras disponibles como campo origen (no transformadas)
  availableSourceHeaders = computed(() => {
    const currentHeaderName = this.formData.headerName;

    return this.previewHeaders().filter(h => {
      // No permitir usar campos transformados como origen (evitar cadena de transformaciones)
      if (h.sourceField && h.regexPattern) {
        return false;
      }
      // No permitir usar el mismo campo como origen
      if (h.headerName === currentHeaderName) {
        return false;
      }
      return true;
    });
  });

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;
  selectedLoadType: LoadType = 'ACTUALIZACION';
  csvSeparator = ';';

  formData = {
    id: undefined as number | undefined,      // ID si es existente
    fieldDefinitionId: 0,
    headerName: '',
    dataType: 'TEXTO' as DataType,
    displayLabel: '',
    format: '',
    required: false,
    sourceField: '',
    regexPattern: '',
    hasData: false                            // Si tiene datos en la tabla
  };

  constructor(
    private headerConfigService: HeaderConfigurationService,
    private fieldDefinitionService: FieldDefinitionService,
    private typificationService: TypificationService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit() {
    this.loadTenants();
    this.loadFieldDefinitions();
  }

  loadFieldDefinitions() {
    // Cargar solo campos asociados a clientes y métodos de contacto
    this.fieldDefinitionService.getFieldsForCustomerSync().subscribe({
      next: (definitions) => {
        this.fieldDefinitions.set(definitions);
      },
      error: (error) => {
        console.error('Error al cargar definiciones de campos:', error);
        // Fallback: si el endpoint nuevo falla, intentar con el antiguo
        this.fieldDefinitionService.getAllActive().subscribe({
          next: (definitions) => {
            this.fieldDefinitions.set(definitions);
          },
          error: (fallbackError) => {
            if (fallbackError?.status === 0 || fallbackError?.status >= 500) {
              this.notificationService.warning(
                'Definiciones no disponibles',
                'No se pudieron cargar las definiciones de campos predefinidos'
              );
            }
          }
        });
      }
    });
  }

  loadTenants() {
    this.typificationService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al cargar proveedores', friendlyMsg);
      }
    });
  }

  onTenantChange() {
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.previewHeaders.set([]);

    if (this.selectedTenantId > 0) {
      this.loadPortfolios();
    }
  }

  onPortfolioChange() {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.previewHeaders.set([]);

    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios();
    }
  }

  onSubPortfolioChange() {
    this.previewHeaders.set([]);
    this.headersAreSaved.set(false);
    if (this.selectedSubPortfolioId > 0) {
      this.loadExistingHeaders();
    }
  }

  onLoadTypeChange() {
    this.previewHeaders.set([]);
    this.headersAreSaved.set(false);
    if (this.selectedSubPortfolioId > 0) {
      this.loadExistingHeaders();
    }
  }

  loadPortfolios() {
    this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
      next: (portfolios) => {
        this.portfolios.set(portfolios);
      },
      error: (error) => {
        console.error('Error loading portfolios:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al cargar carteras', friendlyMsg);
      }
    });
  }

  loadSubPortfolios() {
    this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
      next: (subPortfolios) => {
        this.subPortfolios.set(subPortfolios);
      },
      error: (error) => {
        console.error('Error loading subportfolios:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al cargar subcarteras', friendlyMsg);
      }
    });
  }

  loadExistingHeaders() {
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, this.selectedLoadType).subscribe({
      next: (headers) => {
        // Guardar cabeceras completas con IDs para gestión de alias
        this.savedHeaders.set(headers);

        // Preservar el ID para saber cuáles ya existen en BD
        const items: HeaderConfigurationItem[] = headers.map(h => ({
          id: h.id,                    // Preservar ID
          fieldDefinitionId: h.fieldDefinitionId,
          headerName: h.headerName,
          dataType: h.dataType,
          displayLabel: h.displayLabel,
          format: h.format,
          required: h.required,
          sourceField: h.sourceField,
          regexPattern: h.regexPattern,
          hasData: true               // Asumimos que tienen datos si ya existen
        }));
        this.previewHeaders.set(items);
        this.headersAreSaved.set(headers.length > 0);
      },
      error: (error) => {
        console.error('Error loading headers:', error);
        this.headersAreSaved.set(false);
        this.savedHeaders.set([]);
        // 404 significa que no hay cabeceras configuradas - no es un error
        if (error?.status !== 404) {
          const friendlyMsg = this.getFriendlyErrorMessage(error);
          this.notificationService.error('Error al cargar cabeceras', friendlyMsg);
        }
      }
    });
  }

  openManualDialog() {
    this.editingIndex.set(null);
    this.formData = {
      id: undefined,
      fieldDefinitionId: 0,
      headerName: '',
      dataType: 'TEXTO',
      displayLabel: '',
      format: '',
      required: false,
      sourceField: '',
      regexPattern: '',
      hasData: false
    };
    this.showTransformSection.set(false);
    this.showManualDialog.set(true);
  }

  onFieldDefinitionSelect() {
    const selectedId = this.formData.fieldDefinitionId;
    if (selectedId === 0) {
      // Si se des-selecciona, solo heredar el tipo de dato como TEXTO
      this.formData.dataType = 'TEXTO';
      return;
    }

    const selectedField = this.fieldDefinitions().find(f => f.id === selectedId);
    if (selectedField) {
      // Heredar solo el tipo de dato del catálogo
      this.formData.dataType = selectedField.dataType;
    }
  }

  getSelectedFieldDefinition() {
    const selectedId = this.formData.fieldDefinitionId;
    if (selectedId === 0) return null;
    return this.fieldDefinitions().find(f => f.id === selectedId);
  }

  closeManualDialog() {
    this.showManualDialog.set(false);
    this.editingIndex.set(null);
  }

  canSaveManualHeader(): boolean {
    // Validar campos básicos
    if (!this.formData.headerName.trim() || !this.formData.displayLabel.trim()) {
      return false;
    }

    // Si hay campo origen, el regex es obligatorio
    if (this.formData.sourceField && this.formData.sourceField.trim() !== '') {
      if (!this.formData.regexPattern || this.formData.regexPattern.trim() === '') {
        return false;
      }
    }

    // Si no hay campo de BD seleccionado (campo personalizado), debe tener tipo de dato
    if (this.formData.fieldDefinitionId === 0) {
      return !!this.formData.dataType && ['TEXTO', 'NUMERICO', 'FECHA', 'BOOLEANO'].includes(this.formData.dataType);
    }

    // Si hay campo de BD seleccionado, está válido
    return true;
  }

  saveManualHeader() {
    if (!this.canSaveManualHeader()) return;

    const editIdx = this.editingIndex();

    // Crear el objeto de cabecera preservando id y hasData si existen
    const newHeader: HeaderConfigurationItem = {
      id: this.formData.id,                   // Preservar ID si es cabecera existente
      fieldDefinitionId: this.formData.fieldDefinitionId,
      headerName: this.formData.headerName.trim(),
      dataType: this.formData.dataType,
      displayLabel: this.formData.displayLabel.trim(),
      format: this.formData.format?.trim() || undefined,
      required: this.formData.required,
      sourceField: this.formData.sourceField?.trim() || undefined,
      regexPattern: this.formData.regexPattern?.trim() || undefined,
      hasData: this.formData.hasData          // Preservar indicador de datos
    };

    if (editIdx !== null) {
      // Editando - actualizar en memoria
      const currentHeaders = [...this.previewHeaders()];
      currentHeaders[editIdx] = newHeader;
      this.previewHeaders.set(currentHeaders);
    } else {
      // Agregando nuevo - solo agregar a memoria local (NO enviar al backend)
      // El envío al backend se hace cuando el usuario presiona "Guardar"
      const currentHeaders = [...this.previewHeaders()];
      currentHeaders.push(newHeader);
      this.previewHeaders.set(currentHeaders);
    }

    this.closeManualDialog();
  }

  editPreviewHeader(index: number) {
    const header = this.previewHeaders()[index];
    this.editingIndex.set(index);
    this.formData = {
      id: header.id,                          // Preservar ID si existe
      fieldDefinitionId: header.fieldDefinitionId,
      headerName: header.headerName,
      dataType: header.dataType,
      displayLabel: header.displayLabel,
      format: header.format || '',
      required: header.required || false,
      sourceField: header.sourceField || '',
      regexPattern: header.regexPattern || '',
      hasData: header.hasData || false        // Preservar indicador de datos
    };
    // Expandir sección de transformación si tiene datos
    this.showTransformSection.set(!!(header.sourceField || header.regexPattern));
    this.showManualDialog.set(true);
  }

  async removePreviewHeader(index: number) {
    const header = this.previewHeaders()[index];

    // Si la cabecera existe en BD, advertir
    if (header.id) {
      const confirmed = await this.notificationService.confirm({
        title: 'Eliminar cabecera',
        message: `La cabecera "${header.headerName}" ya existe en la base de datos.\n\nSi la tabla tiene datos, la eliminación será rechazada por el servidor.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'warning'
      });
      if (!confirmed) return;
    }

    const currentHeaders = [...this.previewHeaders()];
    currentHeaders.splice(index, 1);
    this.previewHeaders.set(currentHeaders);
    this.notificationService.info('Cabecera removida', 'Recuerde guardar los cambios');
  }

  async clearAll() {
    const hasSavedHeaders = this.headersAreSaved();

    const confirmed = await this.notificationService.confirm({
      title: hasSavedHeaders ? 'Eliminar todas las cabeceras' : 'Limpiar vista',
      message: hasSavedHeaders
        ? 'Esto eliminará las cabeceras guardadas en la base de datos. Esta acción no se puede deshacer.'
        : '¿Está seguro de limpiar todas las cabeceras de la vista?',
      confirmText: hasSavedHeaders ? 'Eliminar todo' : 'Limpiar',
      cancelText: 'Cancelar',
      type: hasSavedHeaders ? 'danger' : 'warning'
    });

    if (!confirmed) return;

    // Si hay cabeceras guardadas en BD, eliminarlas
    if (hasSavedHeaders) {
      this.isLoading.set(true);
      this.headerConfigService.deleteAllBySubPortfolioAndLoadType(
        this.selectedSubPortfolioId,
        this.selectedLoadType
      ).subscribe({
        next: () => {
          this.previewHeaders.set([]);
          this.savedHeaders.set([]);
          this.headersAreSaved.set(false);
          this.isLoading.set(false);
          this.notificationService.success('Cabeceras eliminadas', 'Todas las cabeceras han sido eliminadas exitosamente');
        },
        error: (error) => {
          this.isLoading.set(false);
          // Manejar errores de forma más amigable
          if (error?.status === 404) {
            // Las cabeceras ya no existen en el servidor - limpiar la vista local
            this.previewHeaders.set([]);
            this.savedHeaders.set([]);
            this.headersAreSaved.set(false);
            this.notificationService.info(
              'Cabeceras no encontradas',
              'Las cabeceras ya no existen en el sistema. La vista ha sido actualizada.'
            );
            return;
          }
          // Para 409 (Conflict), mostrar el mensaje del backend
          if (error?.status === 409) {
            const backendMessage = error?.error?.message || 'Las cabeceras tienen datos asociados y no pueden eliminarse.';
            this.notificationService.warning('No se pueden eliminar', backendMessage);
            return;
          }
          console.error('Error al eliminar cabeceras:', error);
          // Mostrar mensaje de error más amigable
          const friendlyMessage = this.getFriendlyErrorMessage(error);
          this.notificationService.error('Error al eliminar', friendlyMessage);
        }
      });
    } else {
      // Solo limpiar la vista local
      this.previewHeaders.set([]);
      this.notificationService.info('Vista limpiada', 'Se han removido todas las cabeceras de la vista');
    }
  }

  async confirmConfiguration() {
    if (this.previewHeaders().length === 0) {
      this.notificationService.warning('Sin cabeceras', 'No hay cabeceras para guardar');
      return;
    }

    const currentHeaders = this.previewHeaders();

    // Clasificar cabeceras
    const newHeaders = currentHeaders.filter(h => !h.id);
    const existingHeaders = currentHeaders.filter(h => h.id);
    const currentIds = new Set(currentHeaders.filter(h => h.id).map(h => h.id));
    const headersToDelete = this.savedHeaders().filter(h => !currentIds.has(h.id));

    // Si no hay cambios
    if (newHeaders.length === 0 && existingHeaders.length === 0 && headersToDelete.length === 0) {
      this.notificationService.info('Sin cambios', 'No hay cambios pendientes para guardar');
      return;
    }

    // Preparar detalles para el diálogo
    const details: string[] = [];
    if (newHeaders.length > 0) details.push(`${newHeaders.length} cabecera(s) nueva(s)`);
    if (existingHeaders.length > 0) details.push(`${existingHeaders.length} cabecera(s) actualizada(s)`);
    if (headersToDelete.length > 0) {
      details.push(`${headersToDelete.length} cabecera(s) a eliminar:`);
      headersToDelete.forEach(h => details.push(`  • ${h.headerName}`));
    }

    const confirmed = await this.notificationService.confirm({
      title: 'Guardar configuración',
      message: headersToDelete.length > 0
        ? 'Se guardarán los cambios en la configuración de cabeceras.\n\nSi alguna cabecera a eliminar tiene datos, la eliminación fallará.'
        : 'Se guardarán los cambios en la configuración de cabeceras.',
      confirmText: 'Guardar',
      cancelText: 'Cancelar',
      type: headersToDelete.length > 0 ? 'warning' : 'info',
      details
    });

    if (!confirmed) return;

    this.saveConfigurationWithSmartLogic(newHeaders, existingHeaders, headersToDelete);
  }

  private async saveConfigurationWithSmartLogic(
    newHeaders: HeaderConfigurationItem[],
    existingHeaders: HeaderConfigurationItem[],
    headersToDelete: HeaderConfiguration[]
  ) {
    this.isSaving.set(true);
    const errors: string[] = [];
    const deletionErrors: string[] = [];

    try {
      // 1. Intentar eliminar cabeceras removidas (una por una para capturar errores individuales)
      for (const header of headersToDelete) {
        try {
          await firstValueFrom(this.headerConfigService.delete(header.id));
        } catch (error: any) {
          // Si es 404, la cabecera ya no existe - no es un error real
          if (error?.status === 404) {
            continue; // La cabecera ya fue eliminada, continuar con las demás
          }
          // Para 409 (Conflict), usar el mensaje del backend que indica que tiene datos
          const errorMsg = error?.error?.message || this.getFriendlyErrorMessage(error);
          deletionErrors.push(`${header.headerName}: ${errorMsg}`);
        }
      }

      // 2. Actualizar cabeceras existentes
      for (const header of existingHeaders) {
        if (!header.id) continue;
        try {
          await firstValueFrom(this.headerConfigService.update(header.id, {
            displayLabel: header.displayLabel,
            format: header.format,
            required: header.required
          }));
        } catch (error: any) {
          const friendlyMsg = this.getFriendlyErrorMessage(error);
          errors.push(`${header.headerName}: ${friendlyMsg}`);
        }
      }

      // 3. Crear nuevas cabeceras
      if (newHeaders.length > 0) {
        try {
          const request = {
            subPortfolioId: this.selectedSubPortfolioId,
            loadType: this.selectedLoadType,
            headers: newHeaders.map(h => ({
              fieldDefinitionId: h.fieldDefinitionId,
              headerName: h.headerName,
              dataType: h.dataType,
              displayLabel: h.displayLabel,
              format: h.format,
              required: h.required,
              sourceField: h.sourceField,
              regexPattern: h.regexPattern
            }))
          };
          await firstValueFrom(this.headerConfigService.createBulk(request));
        } catch (error: any) {
          const friendlyMsg = this.getFriendlyErrorMessage(error);
          errors.push(`Creación de cabeceras: ${friendlyMsg}`);
        }
      }

      // Mostrar resultados
      if (deletionErrors.length > 0) {
        const errorDetails = deletionErrors.join('\n• ');
        this.notificationService.warning(
          'Algunas cabeceras no se eliminaron',
          `Las siguientes cabeceras no pudieron eliminarse (probablemente tienen datos):\n• ${errorDetails}`
        );
      }

      if (errors.length > 0) {
        const errorDetails = errors.join('\n• ');
        this.notificationService.error('Errores durante el guardado', `• ${errorDetails}`);
      }

      if (deletionErrors.length === 0 && errors.length === 0) {
        this.notificationService.success('Configuración guardada', 'Todos los cambios se aplicaron exitosamente');
      } else if (errors.length === 0 && deletionErrors.length > 0) {
        this.notificationService.info('Guardado parcial', 'El resto de la configuración se guardó correctamente');
      }

    } finally {
      this.isSaving.set(false);
      this.loadExistingHeaders();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.importFileName.set(file.name);
    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');

    if (isExcel) {
      this.parseExcel(file);
    } else {
      // Es CSV - mostrar diálogo para seleccionar separador
      this.pendingCsvFile.set(file);
      this.showCsvSeparatorDialog.set(true);
    }

    event.target.value = ''; // Reset input
  }

  /**
   * Confirma el separador seleccionado y procesa el archivo CSV
   */
  confirmCsvSeparator() {
    const file = this.pendingCsvFile();
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const csv = e.target.result;
      this.parseCSV(csv);
    };
    reader.readAsText(file);

    this.showCsvSeparatorDialog.set(false);
    this.pendingCsvFile.set(null);
  }

  /**
   * Cancela la importación de CSV
   */
  cancelCsvImport() {
    this.showCsvSeparatorDialog.set(false);
    this.pendingCsvFile.set(null);
    this.importFileName.set('');
  }

  /**
   * Parsea un archivo Excel (.xlsx o .xls)
   */
  parseExcel(file: File) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        // Cargar librería XLSX de forma dinámica desde CDN
        if (!(window as any).XLSX) {
          this.notificationService.info('Cargando soporte Excel', 'Por favor espere...');
          await this.loadXLSXLibrary();
        }

        const XLSX = (window as any).XLSX;
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Leer la primera hoja
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convertir a CSV usando el separador seleccionado
        const csvData = XLSX.utils.sheet_to_csv(worksheet, {
          FS: this.csvSeparator
        });

        this.parseCSV(csvData);
      } catch (error) {
        console.error('Error al procesar Excel:', error);
        this.notificationService.error('Error al procesar Excel', 'Verifique que el formato del archivo sea correcto');
      }
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * Carga la librería XLSX desde CDN si no está disponible
   */
  private loadXLSXLibrary(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).XLSX) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar la librería XLSX'));
      document.head.appendChild(script);
    });
  }

  /**
   * Parsea una línea CSV respetando comillas dobles
   * Los separadores dentro de comillas no se consideran delimitadores
   * Ejemplo: "DECIMAL(10,2)" se mantiene como un solo campo aunque contenga coma
   */
  private parseCsvLine(line: string, separator: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        // Toggle estado de comillas
        inQuotes = !inQuotes;
      } else if (char === separator && !inQuotes) {
        // Si es el separador y no estamos dentro de comillas, guardamos el campo
        result.push(current.trim());
        current = '';
      } else {
        // Cualquier otro carácter se agrega al campo actual
        current += char;
      }
    }

    // Agregar el último campo
    result.push(current.trim());

    // Limpiar comillas dobles al inicio y final de cada campo
    return result.map(field => {
      if (field.startsWith('"') && field.endsWith('"')) {
        return field.slice(1, -1);
      }
      return field;
    });
  }

  /**
   * Detecta el tipo de dato basándose en los valores de muestra
   * Analiza los primeros N registros para inferir el tipo
   */
  private detectDataType(sampleValues: string[]): { dataType: DataType; format?: string } {
    // Filtrar valores vacíos y NULL para el análisis
    const nonEmptyValues = sampleValues.filter(v =>
      v && v.trim() !== '' && v.trim().toUpperCase() !== 'NULL'
    );

    if (nonEmptyValues.length === 0) {
      return { dataType: 'TEXTO' };
    }

    // Umbral dinámico: si hay pocos valores, ser más permisivo
    const threshold = nonEmptyValues.length <= 2 ? 0.5 : 0.8;

    // Usar patrones centralizados de shared/constants/date-formats.ts
    // IMPORTANTE: Estos patrones están sincronizados con el backend (DateParserUtil.java)
    for (const pattern of DATE_DETECTION_PATTERNS) {
      const matchCount = nonEmptyValues.filter(v => pattern.regex.test(v.trim())).length;
      // Si al menos threshold% de los valores no vacíos coinciden con el patrón de fecha
      if (matchCount >= nonEmptyValues.length * threshold) {
        console.log(`Fecha detectada: ${nonEmptyValues[0]} -> formato: ${pattern.format}`);
        return { dataType: 'FECHA', format: pattern.format };
      }
    }

    // Verificar si es numérico
    const numericRegex = /^-?\d+([.,]\d+)?$/;
    const numericCount = nonEmptyValues.filter(v => {
      const cleaned = v.trim().replace(/,/g, '.');
      return numericRegex.test(cleaned);
    }).length;

    // Si al menos threshold% de los valores son numéricos
    if (numericCount >= nonEmptyValues.length * threshold) {
      // Detectar si tiene decimales
      const hasDecimals = nonEmptyValues.some(v => v.includes('.') || v.includes(','));
      return {
        dataType: 'NUMERICO',
        format: hasDecimals ? 'decimal(18,2)' : undefined
      };
    }

    // Por defecto es texto
    return { dataType: 'TEXTO' };
  }

  /**
   * Genera una etiqueta visual legible a partir del nombre de columna
   * Ejemplo: "FECHA_PROCESO" -> "Fecha Proceso"
   */
  private generateDisplayLabel(headerName: string): string {
    return headerName
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Normaliza un string para comparación de similitud
   * Elimina acentos, convierte a minúsculas, elimina caracteres especiales
   */
  private normalizeForMatching(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
      .replace(/[^a-z0-9]/g, ''); // Solo letras y números
  }

  /**
   * Calcula la distancia de Levenshtein entre dos strings
   */
  private levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix: number[][] = [];

    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Calcula el score de similitud entre dos strings (0-100)
   */
  private calculateSimilarityScore(str1: string, str2: string): number {
    const norm1 = this.normalizeForMatching(str1);
    const norm2 = this.normalizeForMatching(str2);

    if (norm1 === norm2) return 100;
    if (norm1.length === 0 || norm2.length === 0) return 0;

    // Check if one contains the other
    if (norm1.includes(norm2) || norm2.includes(norm1)) {
      const containScore = Math.min(norm1.length, norm2.length) / Math.max(norm1.length, norm2.length) * 80;
      return Math.round(containScore + 20); // Bonus for containing
    }

    const distance = this.levenshteinDistance(norm1, norm2);
    const maxLen = Math.max(norm1.length, norm2.length);
    const similarity = (1 - distance / maxLen) * 100;

    return Math.round(Math.max(0, similarity));
  }

  /**
   * Busca el FieldDefinition que mejor coincide con el nombre de columna
   * Retorna el match con score >= 60, o undefined si no hay match suficiente
   * Usa fieldDefinitions() para buscar en TODOS los campos, no solo los disponibles
   */
  private findMatchingFieldDefinition(columnName: string): { field: FieldDefinition; score: number } | undefined {
    // Usar fieldDefinitions() en lugar de availableFieldDefinitions() para buscar en todos
    const availableFields = this.fieldDefinitions();
    if (availableFields.length === 0) {
      console.warn('Auto-matching: No hay campos cargados en fieldDefinitions');
      return undefined;
    }

    let bestMatch: { field: FieldDefinition; score: number } | undefined;

    for (const field of availableFields) {
      // Comparar contra fieldCode y fieldName
      const scoreCode = this.calculateSimilarityScore(columnName, field.fieldCode);
      const scoreName = this.calculateSimilarityScore(columnName, field.fieldName);
      const maxScore = Math.max(scoreCode, scoreName);

      if (maxScore >= 60 && (!bestMatch || maxScore > bestMatch.score)) {
        bestMatch = { field, score: maxScore };
      }
    }

    return bestMatch;
  }

  parseCSV(csv: string) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      this.notificationService.error('Archivo vacío', 'El archivo CSV está vacío o no tiene datos');
      return;
    }

    // Primera línea contiene los nombres de las columnas
    const columnNames = this.parseCsvLine(lines[0], this.csvSeparator);

    if (columnNames.length === 0) {
      this.notificationService.error('Sin columnas', 'No se encontraron columnas en el archivo');
      return;
    }

    // Recopilar hasta 5 registros de muestra para cada columna
    const sampleSize = Math.min(5, lines.length - 1);
    const columnSamples: string[][] = columnNames.map(() => []);

    for (let i = 1; i <= sampleSize; i++) {
      const rowValues = this.parseCsvLine(lines[i], this.csvSeparator);
      rowValues.forEach((value, colIndex) => {
        if (colIndex < columnNames.length) {
          columnSamples[colIndex].push(value);
        }
      });
    }

    // Crear lista de columnas detectadas para mostrar en el diálogo de selección
    const detectedCols: DetectedColumn[] = [];

    // Log para debug: verificar cuántos campos hay disponibles para matching
    console.log(`Auto-matching: ${this.fieldDefinitions().length} campos cargados para matching`);

    for (let colIndex = 0; colIndex < columnNames.length; colIndex++) {
      const headerName = columnNames[colIndex].trim();

      if (!headerName) continue;

      // Detectar tipo de dato analizando los valores de muestra
      const { dataType, format } = this.detectDataType(columnSamples[colIndex]);

      // Generar etiqueta visual legible
      const displayLabel = this.generateDisplayLabel(headerName);

      // Auto-matching: buscar el FieldDefinition que mejor coincide
      const matchResult = this.findMatchingFieldDefinition(headerName);

      let matchStatus: 'matched' | 'review' | 'no-match';
      if (matchResult && matchResult.score >= 80) {
        matchStatus = 'matched';
      } else if (matchResult && matchResult.score >= 60) {
        matchStatus = 'review';
      } else {
        matchStatus = 'no-match';
      }

      detectedCols.push({
        name: headerName,
        dataType: dataType,
        format: format,
        displayLabel: displayLabel,
        sampleValues: columnSamples[colIndex].filter(v => v.trim() !== ''),
        selected: true, // Por defecto todas seleccionadas
        matchedFieldDefinition: matchResult?.field,
        matchStatus: matchStatus,
        matchScore: matchResult?.score
      });
    }

    if (detectedCols.length === 0) {
      this.notificationService.error('Sin cabeceras válidas', 'No se encontraron cabeceras válidas en el archivo');
      return;
    }

    // Calcular estadísticas de matching
    const matchedCount = detectedCols.filter(c => c.matchStatus === 'matched').length;
    const reviewCount = detectedCols.filter(c => c.matchStatus === 'review').length;
    const noMatchCount = detectedCols.filter(c => c.matchStatus === 'no-match').length;

    // Mostrar diálogo de selección de columnas
    this.detectedColumns.set(detectedCols);
    this.showColumnSelectionDialog.set(true);

    // Notificar sobre el resultado del auto-matching
    if (reviewCount > 0 || noMatchCount > 0) {
      this.notificationService.info(
        'Auto-matching completado',
        `${matchedCount} coincidencias exactas, ${reviewCount} para revisar, ${noMatchCount} sin coincidencia`
      );
    }
  }

  // ==================== Métodos para selección de columnas ====================

  /**
   * Alterna la selección de una columna detectada
   */
  toggleColumnDetected(index: number) {
    this.detectedColumns.update(cols => {
      const updated = [...cols];
      updated[index] = { ...updated[index], selected: !updated[index].selected };
      return updated;
    });
  }

  /**
   * Obtiene el conteo de columnas seleccionadas
   */
  getSelectedColumnsCount(): number {
    return this.detectedColumns().filter(c => c.selected).length;
  }

  /**
   * Selecciona todas las columnas detectadas
   */
  selectAllDetectedColumns() {
    this.detectedColumns.update(cols =>
      cols.map(col => ({ ...col, selected: true }))
    );
  }

  /**
   * Deselecciona todas las columnas detectadas
   */
  deselectAllDetectedColumns() {
    this.detectedColumns.update(cols =>
      cols.map(col => ({ ...col, selected: false }))
    );
  }

  /**
   * Cancela la selección de columnas
   */
  cancelColumnSelection() {
    this.showColumnSelectionDialog.set(false);
    this.detectedColumns.set([]);
    this.importFileName.set('');
    this.notificationService.info('Importación cancelada', 'No se agregaron cabeceras');
  }

  /**
   * Confirma la selección de columnas y las agrega como cabeceras
   */
  confirmColumnSelection() {
    const selectedColumns = this.detectedColumns().filter(c => c.selected);

    if (selectedColumns.length === 0) {
      this.notificationService.warning('Sin selección', 'Debe seleccionar al menos una columna');
      return;
    }

    // Crear cabeceras a partir de las columnas seleccionadas
    // Usar el FieldDefinition matched si existe, sino fieldDefinitionId = 0
    const newHeaders: HeaderConfigurationItem[] = selectedColumns.map(col => ({
      fieldDefinitionId: col.matchedFieldDefinition?.id ?? 0,
      headerName: col.name,
      dataType: col.dataType,
      displayLabel: col.displayLabel,
      format: col.format,
      required: false
    }));

    // Agregar a las cabeceras existentes (no reemplazar)
    const currentHeaders = this.previewHeaders();
    const existingNames = new Set(currentHeaders.map(h => h.headerName.toLowerCase()));

    // Filtrar cabeceras que ya existen
    const uniqueNewHeaders = newHeaders.filter(h => !existingNames.has(h.headerName.toLowerCase()));
    const duplicateCount = newHeaders.length - uniqueNewHeaders.length;

    if (uniqueNewHeaders.length > 0) {
      this.previewHeaders.set([...currentHeaders, ...uniqueNewHeaders]);
    }

    // Cerrar diálogo
    this.showColumnSelectionDialog.set(false);
    this.detectedColumns.set([]);
    this.importFileName.set('');

    // Contar columnas con match de campo BD
    const matchedWithField = selectedColumns.filter(c => c.matchedFieldDefinition).length;
    const unmatchedCount = selectedColumns.length - matchedWithField;

    // Mostrar mensaje
    if (duplicateCount > 0) {
      this.notificationService.success(
        `${uniqueNewHeaders.length} cabecera(s) agregada(s)`,
        `${duplicateCount} columna(s) ignorada(s) por duplicado. ${matchedWithField} con campo BD asignado.`
      );
    } else {
      this.notificationService.success(
        `${uniqueNewHeaders.length} cabecera(s) agregada(s)`,
        `${matchedWithField} con campo BD asignado, ${unmatchedCount} sin asignar`
      );
    }
  }

  toggleDownloadMenu() {
    this.downloadMenuOpen.update(v => !v);

    if (this.downloadMenuOpen() && this.downloadButton) {
      const rect = this.downloadButton.nativeElement.getBoundingClientRect();
      this.dropdownPosition.set({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
  }

  /**
   * Escapa un valor para CSV: si contiene el separador, comillas o saltos de línea,
   * lo envuelve en comillas dobles y escapa las comillas internas
   */
  private escapeCsvValue(value: string, separator: string): string {
    if (!value) return '';

    // Si el valor contiene el separador, comillas o saltos de línea, debe estar entre comillas
    if (value.includes(separator) || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      // Escapar comillas dobles duplicándolas
      const escaped = value.replace(/"/g, '""');
      return `"${escaped}"`;
    }

    return value;
  }

  /**
   * Crea una fila CSV escapando correctamente los valores
   */
  private createCsvRow(values: string[], separator: string): string {
    return values.map(v => this.escapeCsvValue(v, separator)).join(separator);
  }

  downloadCSVTemplate() {
    this.downloadMenuOpen.set(false);

    // Crear el contenido del CSV con el separador seleccionado
    const sep = this.csvSeparator;

    let rows: string[][];
    let hasConfiguration = false;

    // Prioridad: previewHeaders > savedHeaders > plantilla vacía
    const headersToExport = this.previewHeaders().length > 0
      ? this.previewHeaders()
      : this.savedHeaders().length > 0
        ? this.savedHeaders().map(h => ({
            fieldDefinitionId: h.fieldDefinitionId,
            headerName: h.headerName,
            displayLabel: h.displayLabel,
            format: h.format,
            dataType: h.dataType,
            required: h.required,
            sourceField: h.sourceField,
            regexPattern: h.regexPattern
          }))
        : [];

    // Si hay configuración (preview o guardada), exportar la configuración actual
    if (headersToExport.length > 0) {
      hasConfiguration = true;
      // Cabecera
      rows = [
        ['codigoCampo', 'nombreCabecera', 'etiquetaVisual', 'formato', 'tipoDato', 'obligatorio', 'campoAsociado', 'regEx']
      ];

      // Agregar cada header de la configuración actual
      headersToExport.forEach(header => {
        // Buscar el código del campo en fieldDefinitions
        const fieldDef = this.fieldDefinitions().find(fd => fd.id === header.fieldDefinitionId);
        const codigoCampo = fieldDef ? fieldDef.fieldCode : '';

        rows.push([
          codigoCampo,
          header.headerName,
          header.displayLabel,
          header.format || '',
          header.dataType || '',
          header.required ? '1' : '0',
          header.sourceField || '',
          header.regexPattern || ''
        ]);
      });
    } else {
      // Si no hay configuración, exportar plantilla vacía con ejemplos
      rows = [
        ['codigoCampo', 'nombreCabecera', 'etiquetaVisual', 'formato', 'tipoDato', 'obligatorio', 'campoAsociado', 'regEx'],
        ['documento', 'DNI', 'Número de Documento', '', 'TEXTO', '1', '', ''],
        ['nombre_completo', 'NOMBRE', 'Nombre del Cliente', '', 'TEXTO', '1', '', ''],
        ['telefono_principal', 'TELEFONO', 'Teléfono Principal', '', 'TEXTO', '0', '', ''],
        ['email', 'CORREO', 'Correo Electrónico', '', 'TEXTO', '0', '', ''],
        ['monto_capital', 'MONTO_CAPITAL', 'Monto Capital (S/.)', 'decimal(18,2)', 'NUMERICO', '1', '', ''],
        ['fecha_vencimiento', 'FEC_VENC', 'Fecha de Vencimiento', 'dd/MM/yyyy', 'FECHA', '1', '', ''],
        ['', 'DOCUMENTO_EXTRAIDO', 'Documento Extraído', '', 'TEXTO', '0', 'DNI', '"^D.*?(\\d{7})$|^C.*?(\\d{8})$"']
      ];
    }

    // Crear CSV con tratamiento especial para el campo regEx (última columna)
    const csvLines = rows.map((row, index) => {
      if (index === 0) {
        // La cabecera se procesa normalmente
        return this.createCsvRow(row, sep);
      }

      // Para las filas de datos, procesar los primeros 7 campos normalmente
      // y el último campo (regEx) con comillas forzadas si tiene valor
      const firstSevenFields = row.slice(0, 7);
      const regexField = row[7] || '';

      let csvRow = this.createCsvRow(firstSevenFields, sep);

      // Agregar el campo regEx con comillas forzadas si tiene valor
      if (regexField && regexField.trim() !== '') {
        // Escapar comillas dobles internas duplicándolas
        const escapedRegex = regexField.replace(/"/g, '""');
        csvRow += sep + `"${escapedRegex}"`;
      } else {
        csvRow += sep;
      }

      return csvRow;
    });

    const csvContent = csvLines.join('\n');

    // Crear el blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const separatorName = this.csvSeparator === ',' ? 'coma' :
                         this.csvSeparator === ';' ? 'punto-coma' :
                         this.csvSeparator === '|' ? 'pipe' : 'tab';

    const fileName = hasConfiguration
      ? `cabeceras-${this.selectedLoadType.toLowerCase()}-${separatorName}.csv`
      : `plantilla-cabeceras-${separatorName}.csv`;

    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.notificationService.success(
      'Archivo descargado',
      hasConfiguration
        ? `Configuración de ${headersToExport.length} cabecera(s) exportada`
        : 'Plantilla CSV descargada'
    );
  }

  async downloadExcelTemplate() {
    this.downloadMenuOpen.set(false);

    // Cargar librería XLSX si no está disponible
    if (!(window as any).XLSX) {
      try {
        this.notificationService.info('Cargando', 'Preparando soporte para Excel...');
        await this.loadXLSXLibrary();
      } catch (error) {
        this.notificationService.error('Error', 'No se pudo cargar el soporte para Excel');
        return;
      }
    }

    const XLSX = (window as any).XLSX;

    let data: any[][];
    let hasConfiguration = false;

    // Prioridad: previewHeaders > savedHeaders > plantilla vacía
    const headersToExport = this.previewHeaders().length > 0
      ? this.previewHeaders()
      : this.savedHeaders().length > 0
        ? this.savedHeaders().map(h => ({
            fieldDefinitionId: h.fieldDefinitionId,
            headerName: h.headerName,
            displayLabel: h.displayLabel,
            format: h.format,
            dataType: h.dataType,
            required: h.required,
            sourceField: h.sourceField,
            regexPattern: h.regexPattern
          }))
        : [];

    if (headersToExport.length > 0) {
      hasConfiguration = true;
      // Cabecera
      data = [
        ['codigoCampo', 'nombreCabecera', 'etiquetaVisual', 'formato', 'tipoDato', 'obligatorio', 'campoAsociado', 'regEx']
      ];

      // Agregar cada header de la configuración actual
      headersToExport.forEach(header => {
        const fieldDef = this.fieldDefinitions().find(fd => fd.id === header.fieldDefinitionId);
        const codigoCampo = fieldDef ? fieldDef.fieldCode : '';

        data.push([
          codigoCampo,
          header.headerName,
          header.displayLabel,
          header.format || '',
          header.dataType || '',
          header.required ? '1' : '0',
          header.sourceField || '',
          header.regexPattern || ''
        ]);
      });
    } else {
      // Plantilla vacía con ejemplos
      data = [
        ['codigoCampo', 'nombreCabecera', 'etiquetaVisual', 'formato', 'tipoDato', 'obligatorio', 'campoAsociado', 'regEx'],
        ['documento', 'DNI', 'Número de Documento', '', 'TEXTO', '1', '', ''],
        ['nombre_completo', 'NOMBRE', 'Nombre del Cliente', '', 'TEXTO', '1', '', ''],
        ['telefono_principal', 'TELEFONO', 'Teléfono Principal', '', 'TEXTO', '0', '', ''],
        ['email', 'CORREO', 'Correo Electrónico', '', 'TEXTO', '0', '', ''],
        ['monto_capital', 'MONTO_CAPITAL', 'Monto Capital (S/.)', 'decimal(18,2)', 'NUMERICO', '1', '', ''],
        ['fecha_vencimiento', 'FEC_VENC', 'Fecha de Vencimiento', 'dd/MM/yyyy', 'FECHA', '1', '', ''],
        ['', 'DOCUMENTO_EXTRAIDO', 'Doc. Extraído (ejemplo regex)', '', 'TEXTO', '0', 'DNI', '^D.*?(\\d{7})$|^C.*?(\\d{8})$']
      ];
    }

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Aplicar anchos de columna para mejor formato
    ws['!cols'] = [
      { wch: 25 }, // codigoCampo
      { wch: 20 }, // nombreCabecera
      { wch: 30 }, // etiquetaVisual
      { wch: 20 }, // formato
      { wch: 12 }, // tipoDato
      { wch: 12 }, // obligatorio
      { wch: 18 }, // campoAsociado
      { wch: 35 }  // regEx
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Configuración Cabeceras');

    // Nombre del archivo
    const fileName = hasConfiguration
      ? `cabeceras-${this.selectedLoadType.toLowerCase()}.xlsx`
      : 'plantilla-cabeceras.xlsx';

    // Descargar el archivo
    XLSX.writeFile(wb, fileName);

    this.notificationService.success(
      'Archivo descargado',
      hasConfiguration
        ? `Configuración de ${headersToExport.length} cabecera(s) exportada`
        : 'Plantilla Excel descargada'
    );
  }

  getDataTypeBadgeClass(dataType: DataType): string {
    switch (dataType) {
      case 'TEXTO':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
      case 'NUMERICO':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
      case 'FECHA':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
      case 'BOOLEANO':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    }
  }

  getFieldCodeById(fieldDefinitionId: number): string {
    const field = this.fieldDefinitions().find(f => f.id === fieldDefinitionId);
    return field ? field.fieldCode : '-';
  }

  // ==================== Gestión de Alias ====================

  /**
   * Abre el diálogo de gestión de alias para una cabecera
   */
  openAliasDialog(index: number) {
    // Buscar la cabecera guardada por su ID, no por índice
    const previewHeader = this.previewHeaders()[index];
    if (!previewHeader || !previewHeader.id) {
      this.notificationService.warning('Cabecera no guardada', 'Debe guardar las cabeceras primero para poder gestionar alias');
      return;
    }

    // Buscar en savedHeaders por el ID
    const savedHeader = this.savedHeaders().find(h => h.id === previewHeader.id);
    if (!savedHeader) {
      this.notificationService.warning('Cabecera no encontrada', 'No se encontró la cabecera en la base de datos');
      return;
    }

    this.selectedHeaderForAlias.set(savedHeader);
    this.newAliasName.set('');
    this.showAliasDialog.set(true);
    this.loadAliases(savedHeader.id);
  }

  /**
   * Cierra el diálogo de alias
   */
  closeAliasDialog() {
    this.showAliasDialog.set(false);
    this.selectedHeaderForAlias.set(null);
    this.aliases.set([]);
    this.newAliasName.set('');
  }

  /**
   * Carga los alias de una cabecera
   */
  loadAliases(headerConfigId: number) {
    this.loadingAliases.set(true);
    this.headerConfigService.getAliases(headerConfigId).subscribe({
      next: (aliases) => {
        this.aliases.set(aliases);
        this.loadingAliases.set(false);
      },
      error: (error) => {
        console.error('Error al cargar alias:', error);
        this.loadingAliases.set(false);
        this.aliases.set([]);
        // 404 significa que no hay alias - no es un error
        if (error?.status !== 404) {
          const friendlyMsg = this.getFriendlyErrorMessage(error);
          this.notificationService.error('Error al cargar alias', friendlyMsg);
        }
      }
    });
  }

  /**
   * Agrega un nuevo alias
   */
  addAlias() {
    const header = this.selectedHeaderForAlias();
    const aliasName = this.newAliasName().trim();

    if (!header || !header.id || !aliasName) {
      return;
    }

    this.headerConfigService.addAlias(header.id, {
      alias: aliasName,
      username: 'admin' // TODO: obtener del usuario autenticado
    }).subscribe({
      next: (newAlias) => {
        this.aliases.update(current => [...current, newAlias]);
        this.newAliasName.set('');
        this.notificationService.success('Alias agregado', `Se agregó "${aliasName}" como alias`);
      },
      error: (error) => {
        console.error('Error al agregar alias:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al agregar alias', friendlyMsg);
      }
    });
  }

  /**
   * Elimina un alias
   */
  async removeAlias(alias: HeaderAlias) {
    const confirmed = await this.notificationService.confirm({
      title: 'Eliminar alias',
      message: `¿Está seguro de eliminar el alias "${alias.alias}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'warning'
    });

    if (!confirmed) return;

    this.headerConfigService.removeAlias(alias.id, 'admin').subscribe({
      next: () => {
        this.aliases.update(current => current.filter(a => a.id !== alias.id));
        this.notificationService.success('Alias eliminado', `Se eliminó el alias "${alias.alias}"`);
      },
      error: (error) => {
        // Si es 404, el alias ya no existe - eliminarlo de la lista local
        if (error?.status === 404) {
          this.aliases.update(current => current.filter(a => a.id !== alias.id));
          this.notificationService.info('Alias no encontrado', 'El alias ya no existe en el sistema');
          return;
        }
        console.error('Error al eliminar alias:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al eliminar alias', friendlyMsg);
      }
    });
  }

  /**
   * Verifica si una cabecera tiene ID guardado (puede gestionar alias)
   */
  canManageAlias(index: number): boolean {
    const previewHeader = this.previewHeaders()[index];
    return !!previewHeader && !!previewHeader.id;
  }

  /**
   * Obtiene la cantidad de alias de una cabecera
   */
  getAliasCount(index: number): number {
    const previewHeader = this.previewHeaders()[index];
    if (!previewHeader || !previewHeader.id) return 0;

    const savedHeader = this.savedHeaders().find(h => h.id === previewHeader.id);
    return savedHeader?.aliases?.length || 0;
  }

  /**
   * Convierte errores HTTP técnicos a mensajes amigables para el usuario
   */
  private getFriendlyErrorMessage(error: any): string {
    // Si el error tiene un mensaje personalizado del backend, usarlo (prioridad alta)
    if (error?.error?.message && !error.error.message.includes('Http failure')) {
      return error.error.message;
    }

    // Mapear códigos de estado HTTP a mensajes amigables
    const status = error?.status;
    switch (status) {
      case 400:
        return 'Datos inválidos. Por favor verifique la información ingresada.';
      case 401:
        return 'Sesión expirada. Por favor inicie sesión nuevamente.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'El recurso ya no existe en el sistema.';
      case 409:
        // Para conflictos, el backend debería enviar un mensaje específico
        return error?.error?.message || 'No se puede completar la operación porque hay datos asociados.';
      case 422:
        return 'No se puede procesar: la cabecera tiene datos asociados.';
      case 500:
        return 'Error interno del servidor. Por favor intente más tarde.';
      case 502:
      case 503:
      case 504:
        return 'El servidor no está disponible. Por favor intente más tarde.';
      case 0:
        return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      default:
        // Para errores desconocidos, dar un mensaje genérico
        if (error?.message && !error.message.includes('Http failure')) {
          return error.message;
        }
        return 'Ocurrió un error inesperado. Por favor intente nuevamente.';
    }
  }

  // ==================== Métodos para Importar desde otra Subcartera ====================

  /**
   * Abre el diálogo para importar cabeceras desde otra subcartera
   */
  async openImportFromSubPortfolioDialog(): Promise<void> {
    // Cargar todas las subcarteras si no están cargadas
    if (this.allSubPortfolios().length === 0) {
      try {
        const allSubPortfolios = await firstValueFrom(this.portfolioService.getAllSubPortfolios());
        this.allSubPortfolios.set(allSubPortfolios);
      } catch (error) {
        this.notificationService.error('Error al cargar subcarteras');
        return;
      }
    }

    // Reset state
    this.importSourceSubPortfolioId.set(0);
    this.importPreviewResult.set(null);
    this.importConflictResolution.set('SKIP');
    this.selectedConflictsToReplace.set(new Set());
    this.isLoadingImportPreview.set(false);
    this.isExecutingImport.set(false);

    this.showImportFromSubPortfolioDialog.set(true);
  }

  /**
   * Cierra el diálogo de importación
   */
  closeImportFromSubPortfolioDialog(): void {
    this.showImportFromSubPortfolioDialog.set(false);
    this.importPreviewResult.set(null);
  }

  /**
   * Obtiene las subcarteras disponibles como origen (excluyendo la actual)
   */
  getAvailableSourceSubPortfolios(): SubPortfolio[] {
    return this.allSubPortfolios().filter(sp => sp.id !== this.selectedSubPortfolioId);
  }

  /**
   * Maneja el cambio de subcartera origen y carga el preview
   */
  async onImportSourceChange(sourceId: number): Promise<void> {
    this.importSourceSubPortfolioId.set(sourceId);

    if (sourceId <= 0) {
      this.importPreviewResult.set(null);
      return;
    }

    this.isLoadingImportPreview.set(true);
    this.importPreviewResult.set(null);
    this.selectedConflictsToReplace.set(new Set());

    try {
      const preview = await firstValueFrom(
        this.headerConfigService.previewImportFromSubPortfolio(
          this.selectedSubPortfolioId,
          sourceId,
          this.selectedLoadType
        )
      );
      this.importPreviewResult.set(preview);
    } catch (error) {
      console.error('Error loading import preview:', error);
      this.notificationService.error('Error al cargar preview de importación');
    } finally {
      this.isLoadingImportPreview.set(false);
    }
  }

  /**
   * Toggle selection de un conflicto para reemplazar
   */
  toggleConflictSelection(headerName: string): void {
    const current = this.selectedConflictsToReplace();
    const newSet = new Set(current);

    if (newSet.has(headerName)) {
      newSet.delete(headerName);
    } else {
      newSet.add(headerName);
    }

    this.selectedConflictsToReplace.set(newSet);
  }

  /**
   * Ejecuta la importación de cabeceras
   */
  async executeImportFromSubPortfolio(): Promise<void> {
    const preview = this.importPreviewResult();
    if (!preview) return;

    // Validar que hay algo que importar
    if (preview.totalNew === 0 && preview.totalConflicts === 0) {
      this.notificationService.warning('No hay cabeceras para importar');
      return;
    }

    // Si es SELECTIVE y hay conflictos pero no se seleccionó ninguno, y no hay nuevas
    if (this.importConflictResolution() === 'SELECTIVE' &&
        preview.totalConflicts > 0 &&
        this.selectedConflictsToReplace().size === 0 &&
        preview.totalNew === 0) {
      this.notificationService.warning('Seleccione al menos una cabecera para reemplazar o cambie la resolución de conflictos');
      return;
    }

    this.isExecutingImport.set(true);

    try {
      const headersToReplace = this.importConflictResolution() === 'SELECTIVE'
        ? Array.from(this.selectedConflictsToReplace())
        : undefined;

      const result = await firstValueFrom(
        this.headerConfigService.importFromSubPortfolio(
          this.selectedSubPortfolioId,
          {
            sourceSubPortfolioId: this.importSourceSubPortfolioId(),
            loadType: this.selectedLoadType,
            conflictResolution: this.importConflictResolution(),
            headersToReplace
          }
        )
      );

      if (result.success) {
        const message = `Importación completada: ${result.headersImported} nuevas, ${result.headersReplaced} reemplazadas, ${result.headersSkipped} omitidas, ${result.aliasesImported} aliases`;
        this.notificationService.success(message);

        // Recargar las cabeceras
        this.loadExistingHeaders();

        this.closeImportFromSubPortfolioDialog();
      } else {
        const errorMsg = result.errors.length > 0
          ? result.errors.join(', ')
          : 'Error desconocido en la importación';
        this.notificationService.error(errorMsg);
      }
    } catch (error) {
      console.error('Error executing import:', error);
      this.notificationService.error(this.getFriendlyErrorMessage(error));
    } finally {
      this.isExecutingImport.set(false);
    }
  }
}
