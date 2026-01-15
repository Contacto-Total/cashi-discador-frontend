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
  FileConfigState,
  ComplementaryFileType,
  UnregisteredColumn,
  SheetInfo,
  determineFileType,
  getFileTypeLabel,
  isValidExcelFile,
  COMMON_LINK_FIELDS
} from '../../models/complementary-file.model';

@Component({
  selector: 'app-consolidated-load',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, NotificationsComponent],
  template: `
    <!-- Toast Notifications -->
    <app-notifications></app-notifications>

    <!-- Loading Overlay Modal -->
    @if (isLoading()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-slate-700 max-w-md w-full mx-4">
          <div class="flex flex-col items-center gap-6">
            <div class="relative">
              <div class="w-16 h-16 border-4 border-gray-200 dark:border-slate-600 rounded-full"></div>
              <div class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <div class="text-center">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ loadingMessage() }}</h3>
              <p class="text-gray-500 dark:text-gray-400 text-sm">Por favor espere...</p>
            </div>
            <div class="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full animate-pulse" style="width: 100%"></div>
            </div>
          </div>
        </div>
      </div>
    }

    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <lucide-angular name="upload-cloud" [size]="20" class="text-white"></lucide-angular>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Carga Consolidada de Datos</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Importación de archivos de cartera CONTACTO TOTAL</p>
            </div>
          </div>
        </div>

        <!-- Selectores en Cascada -->
        <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-800 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                <lucide-angular name="building-2" [size]="14" class="inline mr-1"></lucide-angular>
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange($event)"
                      class="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantCode }} - {{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                <lucide-angular name="folder" [size]="14" class="inline mr-1"></lucide-angular>
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange($event)"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioCode }} - {{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                <lucide-angular name="folder-tree" [size]="14" class="inline mr-1"></lucide-angular>
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange($event)"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
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
          <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border border-gray-200 dark:border-slate-800 mb-6">
            <h3 class="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
              <lucide-angular name="layers" [size]="14" class="inline mr-1"></lucide-angular>
              Tipo de Carga
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Carga Diaria -->
              <button (click)="selectLoadMode('DAILY')"
                      [class.ring-2]="selectedLoadMode() === 'DAILY'"
                      [class.ring-blue-500]="selectedLoadMode() === 'DAILY'"
                      [class.bg-blue-50]="selectedLoadMode() === 'DAILY'"
                      [class.dark:bg-blue-900/30]="selectedLoadMode() === 'DAILY'"
                      class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-500 transition-all text-left cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-blue-100 dark:bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="calendar" [size]="20" class="text-blue-600 dark:text-blue-400"></lucide-angular>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Carga Diaria</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Actualización diaria</p>
                  </div>
                </div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Un archivo Excel con la actualización diaria</p>
              </button>

              <!-- Carga Inicial de Mes -->
              <button (click)="selectLoadMode('INITIAL_MONTH')"
                      [class.ring-2]="selectedLoadMode() === 'INITIAL_MONTH'"
                      [class.ring-emerald-500]="selectedLoadMode() === 'INITIAL_MONTH'"
                      [class.bg-emerald-50]="selectedLoadMode() === 'INITIAL_MONTH'"
                      [class.dark:bg-emerald-900/30]="selectedLoadMode() === 'INITIAL_MONTH'"
                      class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-emerald-500 transition-all text-left cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="calendar-range" [size]="20" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Carga Inicial de Mes</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Principal + Complementarios</p>
                  </div>
                </div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Archivo principal (1°) + archivos complementarios opcionales</p>
              </button>

              <!-- Subida Complementaria -->
              <button (click)="selectLoadMode('COMPLEMENTARY')"
                      [class.ring-2]="selectedLoadMode() === 'COMPLEMENTARY'"
                      [class.ring-amber-500]="selectedLoadMode() === 'COMPLEMENTARY'"
                      [class.bg-amber-50]="selectedLoadMode() === 'COMPLEMENTARY'"
                      [class.dark:bg-amber-900/30]="selectedLoadMode() === 'COMPLEMENTARY'"
                      class="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-amber-500 transition-all text-left cursor-pointer">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 bg-amber-100 dark:bg-amber-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="file-plus" [size]="20" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900 dark:text-white">Subida Complementaria</h4>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Archivos adicionales</p>
                  </div>
                </div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Cualquier archivo Excel complementario</p>
              </button>
            </div>
          </div>

          @if (selectedLoadMode()) {
            <!-- Área de Carga de Archivos -->
            <div class="bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
              <!-- Header del área de carga -->
              <div class="p-4 border-b border-gray-200 dark:border-slate-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ getLoadModeTitle() }}</h2>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ getLoadModeDescription() }}</p>
                  </div>
                  <div class="flex gap-2">
                    @if (filesToProcess().length > 0) {
                      <button (click)="clearFiles()"
                              class="px-3 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-all text-sm cursor-pointer">
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
                  <div class="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 text-center">
                    <div class="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <lucide-angular name="file-spreadsheet" [size]="32" class="text-gray-400 dark:text-gray-600"></lucide-angular>
                    </div>
                    <h3 class="text-gray-900 dark:text-white font-semibold mb-2">Arrastra archivos aquí o haz clic en "Agregar Archivo"</h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">{{ getExpectedFilesDescription() }}</p>
                  </div>
                } @else {
                  <div class="space-y-3">
                    @for (file of filesToProcess(); track file.file.name; let fileIndex = $index) {
                      <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border overflow-hidden transition-all"
                           [class.border-emerald-500]="file.configState === 'ready'"
                           [class.border-amber-500]="file.configState === 'configuring'"
                           [class.border-red-500]="file.configState === 'error'"
                           [class.border-gray-200]="file.configState === 'loading'"
                           [class.dark:border-emerald-500]="file.configState === 'ready'"
                           [class.dark:border-amber-500]="file.configState === 'configuring'"
                           [class.dark:border-red-500]="file.configState === 'error'"
                           [class.dark:border-slate-700]="file.configState === 'loading'">

                        <!-- Cabecera del archivo (siempre visible) -->
                        <div class="p-4 flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <!-- Icono de estado -->
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                 [class.bg-emerald-100]="file.configState === 'ready'"
                                 [class.dark:bg-emerald-600/20]="file.configState === 'ready'"
                                 [class.bg-amber-100]="file.configState === 'configuring'"
                                 [class.dark:bg-amber-600/20]="file.configState === 'configuring'"
                                 [class.bg-red-100]="file.configState === 'error'"
                                 [class.dark:bg-red-600/20]="file.configState === 'error'"
                                 [class.bg-gray-200]="file.configState === 'loading'"
                                 [class.dark:bg-slate-700]="file.configState === 'loading'">
                              @if (file.configState === 'ready') {
                                <lucide-angular name="check-circle" [size]="20" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
                              } @else if (file.configState === 'configuring') {
                                <lucide-angular name="settings" [size]="20" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                              } @else if (file.configState === 'error') {
                                <lucide-angular name="alert-circle" [size]="20" class="text-red-600 dark:text-red-400"></lucide-angular>
                              } @else {
                                <div class="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              }
                            </div>

                            <!-- Info del archivo -->
                            <div>
                              <p class="font-medium text-gray-900 dark:text-white">{{ file.file.name }}</p>
                              <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                                <!-- Tipo de archivo: clickeable solo en INITIAL_MONTH -->
                                @if (selectedLoadMode() === 'INITIAL_MONTH' && filesToProcess().length > 1) {
                                  <button (click)="toggleFileType(file)"
                                          class="px-2 py-0.5 rounded text-xs font-medium cursor-pointer transition-all flex items-center gap-1 hover:ring-2 hover:ring-offset-1"
                                          [class.bg-emerald-100]="file.type === 'MAIN'"
                                          [class.dark:bg-emerald-900/50]="file.type === 'MAIN'"
                                          [class.text-emerald-700]="file.type === 'MAIN'"
                                          [class.dark:text-emerald-400]="file.type === 'MAIN'"
                                          [class.hover:ring-emerald-400]="file.type === 'MAIN'"
                                          [class.bg-amber-100]="file.type === 'COMPLEMENTARY'"
                                          [class.dark:bg-amber-900/50]="file.type === 'COMPLEMENTARY'"
                                          [class.text-amber-700]="file.type === 'COMPLEMENTARY'"
                                          [class.dark:text-amber-400]="file.type === 'COMPLEMENTARY'"
                                          [class.hover:ring-amber-400]="file.type === 'COMPLEMENTARY'"
                                          title="Click para cambiar tipo">
                                    {{ getFileTypeLabel(file.type) }}
                                    <lucide-angular name="repeat" [size]="10"></lucide-angular>
                                  </button>
                                } @else {
                                  <span class="px-2 py-0.5 rounded text-xs font-medium"
                                        [class.bg-emerald-100]="file.type === 'MAIN'"
                                        [class.dark:bg-emerald-900/50]="file.type === 'MAIN'"
                                        [class.text-emerald-700]="file.type === 'MAIN'"
                                        [class.dark:text-emerald-400]="file.type === 'MAIN'"
                                        [class.bg-amber-100]="file.type === 'COMPLEMENTARY'"
                                        [class.dark:bg-amber-900/50]="file.type === 'COMPLEMENTARY'"
                                        [class.text-amber-700]="file.type === 'COMPLEMENTARY'"
                                        [class.dark:text-amber-400]="file.type === 'COMPLEMENTARY'">
                                    {{ getFileTypeLabel(file.type) }}
                                  </span>
                                }
                                @if (file.configState === 'ready' && file.selectedSheet) {
                                  <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded text-xs">
                                    <lucide-angular name="sheet" [size]="10" class="inline mr-0.5"></lucide-angular>
                                    {{ file.selectedSheet }}
                                  </span>
                                }
                                @if (file.configState === 'ready' && file.linkField) {
                                  <span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded text-xs">
                                    <lucide-angular name="link" [size]="10" class="inline mr-0.5"></lucide-angular>
                                    {{ file.linkField }}
                                  </span>
                                }
                                @if (file.rowCount) {
                                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ file.rowCount }} registros</span>
                                }
                              </div>
                            </div>
                          </div>

                          <!-- Acciones -->
                          <div class="flex items-center gap-2">
                            @if (file.configState === 'error') {
                              <span class="text-xs text-red-600 dark:text-red-400 max-w-xs truncate">{{ file.error }}</span>
                            }
                            @if (file.configState === 'configuring') {
                              <button (click)="toggleFileExpanded(file)"
                                      class="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-all cursor-pointer">
                                <lucide-angular [name]="file.isExpanded ? 'chevron-up' : 'chevron-down'" [size]="18"></lucide-angular>
                              </button>
                            }
                            <button (click)="removeFile(file)"
                                    class="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-all cursor-pointer">
                              <lucide-angular name="x" [size]="16"></lucide-angular>
                            </button>
                          </div>
                        </div>

                        <!-- Panel de Configuración Expandible -->
                        @if (file.configState === 'configuring' && file.isExpanded) {
                          <div class="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <!-- Selector de Hoja -->
                              @if (file.sheetsInfo && file.sheetsInfo.length > 1) {
                                <div>
                                  <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                                    <lucide-angular name="table-2" [size]="12" class="inline mr-1"></lucide-angular>
                                    Hoja de Excel
                                  </label>
                                  <select [(ngModel)]="file.selectedSheet"
                                          (ngModelChange)="onSheetChange(file, $event)"
                                          class="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option [ngValue]="undefined">Seleccione una hoja...</option>
                                    @for (sheet of file.sheetsInfo; track sheet.name) {
                                      <option [value]="sheet.name">{{ sheet.name }} ({{ sheet.rowCount }} filas, {{ sheet.headers.length }} cols)</option>
                                    }
                                  </select>
                                </div>
                              }

                              <!-- Selector de Campo de Enlace (solo para COMPLEMENTARY) -->
                              @if (file.type === 'COMPLEMENTARY' && file.headers && file.headers.length > 0) {
                                <div>
                                  <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                                    <lucide-angular name="link" [size]="12" class="inline mr-1"></lucide-angular>
                                    Campo de enlace
                                  </label>
                                  <select [(ngModel)]="file.linkField"
                                          class="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    <option [ngValue]="undefined">Seleccione campo de enlace...</option>
                                    @for (header of file.headers; track header) {
                                      <option [value]="header">
                                        {{ header }}
                                        @if (isCommonLinkField(header)) { (sugerido) }
                                      </option>
                                    }
                                  </select>
                                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Columna que identifica los registros a actualizar
                                  </p>
                                </div>
                              }
                            </div>

                            <!-- Columnas No Registradas -->
                            @if (file.unregisteredColumns && file.unregisteredColumns.length > 0) {
                              <div class="border-t !border-gray-200 dark:!border-slate-700 pt-4 mt-4">
                                <div class="flex items-center justify-between mb-3 p-2 !bg-amber-50 dark:!bg-amber-900/20 rounded-lg border !border-amber-200 dark:!border-amber-700/50">
                                  <div class="flex items-center gap-2">
                                    <lucide-angular name="alert-triangle" [size]="16" class="!text-amber-600 dark:!text-amber-400"></lucide-angular>
                                    <span class="text-sm font-semibold !text-gray-900 dark:!text-white">
                                      {{ file.unregisteredColumns.length }} columna(s) no registrada(s)
                                    </span>
                                  </div>
                                  <button (click)="toggleAllColumnsForFile(file)"
                                          class="text-xs !text-emerald-700 dark:!text-emerald-400 hover:underline cursor-pointer font-medium">
                                    {{ getSelectedColumnsCountForFile(file) === file.unregisteredColumns.length ? 'Deseleccionar' : 'Seleccionar' }} todas
                                  </button>
                                </div>

                                <div class="space-y-3 max-h-64 overflow-y-auto">
                                  @for (col of file.unregisteredColumns; track col.name; let colIndex = $index) {
                                    <div class="p-3 !bg-gray-100 dark:!bg-slate-800 rounded-lg border !border-gray-200 dark:!border-slate-700"
                                         [class.!border-emerald-400]="col.selected"
                                         [class.dark:!border-emerald-600]="col.selected">
                                      <!-- Fila principal: checkbox + nombre + ejemplos -->
                                      <div class="flex items-center gap-3">
                                        <input type="checkbox"
                                               [(ngModel)]="col.selected"
                                               class="w-4 h-4 rounded !border-gray-400 dark:!border-slate-500 text-emerald-500 focus:ring-emerald-500 cursor-pointer">
                                        <div class="flex-1 min-w-0">
                                          <div class="flex items-center gap-2 flex-wrap">
                                            <code class="font-mono text-sm !text-amber-700 dark:!text-amber-400 !bg-amber-100 dark:!bg-amber-900/30 px-1.5 py-0.5 rounded">{{ col.name }}</code>
                                            @if (col.sampleValues.length > 0) {
                                              <span class="text-xs !text-gray-500 dark:!text-gray-400">
                                                Ej: <span class="!bg-gray-200 dark:!bg-slate-700 !text-gray-700 dark:!text-gray-300 px-1 py-0.5 rounded font-mono">{{ col.sampleValues.slice(0, 2).join(', ') }}</span>
                                              </span>
                                            }
                                          </div>
                                        </div>
                                      </div>

                                      <!-- Fila de configuración: tipo de dato + formato (solo si está seleccionada) -->
                                      @if (col.selected) {
                                        <div class="mt-3 pt-3 border-t !border-gray-200 dark:!border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                          <!-- Tipo de dato -->
                                          <div>
                                            <label class="block text-xs font-medium !text-gray-600 dark:!text-gray-400 mb-1">
                                              Tipo de dato
                                            </label>
                                            <select [(ngModel)]="col.detectedType"
                                                    class="w-full px-2.5 py-1.5 text-sm !bg-white dark:!bg-slate-700 !border-gray-300 dark:!border-slate-600 rounded-md !text-gray-900 dark:!text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                              <option value="TEXTO">TEXTO</option>
                                              <option value="NUMERICO">NUMERICO</option>
                                              <option value="FECHA">FECHA</option>
                                            </select>
                                          </div>

                                          <!-- Formato (solo para FECHA) -->
                                          @if (col.detectedType === 'FECHA') {
                                            <div>
                                              <label class="block text-xs font-medium !text-gray-600 dark:!text-gray-400 mb-1">
                                                Formato
                                              </label>
                                              <select [(ngModel)]="col.format"
                                                      class="w-full px-2.5 py-1.5 text-sm !bg-white dark:!bg-slate-700 !border-gray-300 dark:!border-slate-600 rounded-md !text-gray-900 dark:!text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                                                <option value="dd/MM/yyyy">dd/MM/yyyy (31/12/2024)</option>
                                                <option value="d/M/yyyy">d/M/yyyy (1/1/2024)</option>
                                                <option value="MM/dd/yyyy">MM/dd/yyyy (12/31/2024)</option>
                                                <option value="yyyy-MM-dd">yyyy-MM-dd (2024-12-31)</option>
                                                <option value="dd-MM-yyyy">dd-MM-yyyy (31-12-2024)</option>
                                              </select>
                                            </div>
                                          }

                                          <!-- Etiqueta de visualización -->
                                          <div [class.sm:col-span-2]="col.detectedType !== 'FECHA'">
                                            <label class="block text-xs font-medium !text-gray-600 dark:!text-gray-400 mb-1">
                                              Etiqueta de visualización
                                            </label>
                                            <input type="text"
                                                   [(ngModel)]="col.displayLabel"
                                                   [placeholder]="col.name"
                                                   class="w-full px-2.5 py-1.5 text-sm !bg-white dark:!bg-slate-700 !border-gray-300 dark:!border-slate-600 rounded-md !text-gray-900 dark:!text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:!text-gray-400">
                                          </div>
                                        </div>
                                      }
                                    </div>
                                  }
                                </div>

                                <p class="text-xs !text-gray-600 dark:!text-gray-400 mt-3 p-2 !bg-blue-50 dark:!bg-blue-900/20 rounded-lg border !border-blue-200 dark:!border-blue-800/50">
                                  <lucide-angular name="info" [size]="12" class="inline mr-1 !text-blue-600 dark:!text-blue-400"></lucide-angular>
                                  Las columnas seleccionadas se crearán como nuevas cabeceras. Las no seleccionadas serán ignoradas.
                                </p>
                              </div>
                            }

                            <!-- Botón de Validar -->
                            <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                              <button (click)="cancelFileConfiguration(file)"
                                      class="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors text-sm cursor-pointer">
                                Cancelar
                              </button>
                              <button (click)="validateFileConfiguration(file)"
                                      [disabled]="!canValidateFile(file) || isCreatingHeaders()"
                                      class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                @if (isCreatingHeaders()) {
                                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                  Procesando...
                                } @else {
                                  <lucide-angular name="check" [size]="16"></lucide-angular>
                                  Validar Configuración
                                }
                              </button>
                            </div>
                          </div>
                        }
                      </div>
                    }
                  </div>

                  <!-- Resumen y Botón de Procesar -->
                  @if (canProcess()) {
                    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <div class="flex items-center justify-between">
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          <span class="text-gray-900 dark:text-white font-semibold">{{ getTotalRows() }}</span> registros en
                          <span class="text-gray-900 dark:text-white font-semibold">{{ filesToProcess().length }}</span> archivo(s)
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
            <div class="mt-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-xl p-4 shadow-lg border"
                 [class.border-emerald-500/50]="lastResult()?.success"
                 [class.border-red-500/50]="!lastResult()?.success">
              <div class="flex items-center gap-3 mb-3">
                @if (lastResult()?.success) {
                  <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="check-circle" [size]="24" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
                  </div>
                  <h3 class="text-lg font-bold text-emerald-600 dark:text-emerald-400">Carga completada exitosamente</h3>
                } @else {
                  <div class="w-10 h-10 bg-red-100 dark:bg-red-600/20 rounded-lg flex items-center justify-center">
                    <lucide-angular name="alert-triangle" [size]="24" class="text-red-600 dark:text-red-400"></lucide-angular>
                  </div>
                  <h3 class="text-lg font-bold text-red-600 dark:text-red-400">Carga completada con errores</h3>
                }
              </div>

              <!-- Estadísticas principales -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-500 dark:text-gray-400">Total filas</p>
                  <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ lastResult()?.mainFileResult?.totalRows || lastResult()?.totalProcessed || 0 }}</p>
                </div>
                <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-500 dark:text-gray-400">Insertados</p>
                  <p class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ lastResult()?.mainFileResult?.insertedRows || 0 }}</p>
                </div>
                <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-500 dark:text-gray-400">Actualizados</p>
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ lastResult()?.mainFileResult?.updatedRows || 0 }}</p>
                </div>
                <div class="bg-gray-100 dark:bg-slate-800 rounded-lg p-3">
                  <p class="text-gray-500 dark:text-gray-400">Fallidos</p>
                  <p class="text-2xl font-bold" [class.text-red-600]="lastResult()?.totalErrors" [class.dark:text-red-400]="lastResult()?.totalErrors" [class.text-gray-400]="!lastResult()?.totalErrors">{{ lastResult()?.totalErrors || 0 }}</p>
                </div>
              </div>

              <!-- Detalle de errores -->
              @if (lastResult()?.mainFileResult?.errors?.length > 0) {
                <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <lucide-angular name="alert-circle" [size]="18" class="text-red-600 dark:text-red-400"></lucide-angular>
                    <h4 class="font-semibold text-red-600 dark:text-red-400">
                      Detalle de errores ({{ lastResult()?.mainFileResult?.errors?.length }}
                      @if (lastResult()?.mainFileResult?.totalErrors > lastResult()?.mainFileResult?.errors?.length) {
                        de {{ lastResult()?.mainFileResult?.totalErrors }}
                      })
                    </h4>
                  </div>
                  <div class="max-h-48 overflow-y-auto space-y-1 text-sm">
                    @for (error of lastResult()?.mainFileResult?.errors; track $index) {
                      <div class="bg-white dark:bg-slate-800/50 rounded px-3 py-2 text-gray-700 dark:text-gray-300 font-mono text-xs">
                        <span class="text-red-600 dark:text-red-400 mr-2">●</span>{{ error }}
                      </div>
                    }
                  </div>
                  @if (lastResult()?.mainFileResult?.totalErrors > lastResult()?.mainFileResult?.errors?.length) {
                    <p class="text-gray-400 dark:text-gray-500 text-xs mt-2 italic">
                      * Se muestran solo los primeros {{ lastResult()?.mainFileResult?.errors?.length }} errores de {{ lastResult()?.mainFileResult?.totalErrors }} totales
                    </p>
                  }
                </div>
              }

              <!-- Errores de sincronización de clientes -->
              @if (lastResult()?.mainFileResult?.syncError) {
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="users" [size]="18" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                    <h4 class="font-semibold text-amber-600 dark:text-amber-400">Error en sincronización de clientes</h4>
                  </div>
                  <p class="text-gray-700 dark:text-gray-300 text-sm">{{ lastResult()?.mainFileResult?.syncError }}</p>
                </div>
              }

              <!-- Resultados de sincronización exitosa -->
              @if (lastResult()?.mainFileResult?.syncCustomersCreated !== undefined || lastResult()?.mainFileResult?.syncCustomersUpdated !== undefined) {
                <div class="bg-gray-100 dark:bg-slate-800/50 rounded-lg p-3 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="users" [size]="16" class="text-cyan-600 dark:text-cyan-400"></lucide-angular>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Sincronización de clientes:</span>
                  </div>
                  <div class="flex gap-4 text-sm">
                    <span class="text-emerald-600 dark:text-emerald-400">{{ lastResult()?.mainFileResult?.syncCustomersCreated || 0 }} creados</span>
                    <span class="text-blue-600 dark:text-blue-400">{{ lastResult()?.mainFileResult?.syncCustomersUpdated || 0 }} actualizados</span>
                  </div>
                </div>
              }

              <!-- Resultados de archivos complementarios -->
              @if (lastResult()?.complementaryResults?.length > 0) {
                <div class="bg-gray-100 dark:bg-slate-800/50 rounded-lg p-3 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="file-plus" [size]="16" class="text-purple-600 dark:text-purple-400"></lucide-angular>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Archivos complementarios:</span>
                  </div>
                  @for (comp of lastResult()?.complementaryResults; track $index) {
                    <div class="flex items-center gap-2 text-sm mt-1">
                      @if (comp?.failedRows > 0 || comp?.errors?.length > 0) {
                        <lucide-angular name="alert-circle" [size]="14" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                      } @else {
                        <lucide-angular name="check" [size]="14" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
                      }
                      <span class="text-gray-700 dark:text-gray-300">
                        {{ comp?.updatedRows || 0 }} actualizados
                        @if (comp?.notFoundRows > 0) {
                          <span class="text-amber-600 dark:text-amber-400 ml-2">{{ comp?.notFoundRows }} no encontrados</span>
                        }
                        @if (comp?.failedRows > 0) {
                          <span class="text-red-600 dark:text-red-400 ml-2">{{ comp?.failedRows }} fallidos</span>
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

  // Signal para estado de creación de headers
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
      error: (error) => {
        console.error('Error loading tenants:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al cargar proveedores', friendlyMsg);
      }
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
        error: (error) => {
          console.error('Error loading portfolios:', error);
          const friendlyMsg = this.getFriendlyErrorMessage(error);
          this.notificationService.error('Error al cargar carteras', friendlyMsg);
        }
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
        error: (error) => {
          console.error('Error loading subportfolios:', error);
          const friendlyMsg = this.getFriendlyErrorMessage(error);
          this.notificationService.error('Error al cargar subcarteras', friendlyMsg);
        }
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
      error: (error) => {
        console.error('Error loading INICIAL headers:', error);
        // 404 significa que no hay cabeceras configuradas - no mostrar error
        if (error?.status !== 404) {
          this.notificationService.warning(
            'Cabeceras no disponibles',
            'No se pudieron cargar las cabeceras de carga inicial'
          );
        }
      }
    });

    // Cargar cabeceras para ACTUALIZACION
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, 'ACTUALIZACION').subscribe({
      next: (headers) => this.headersActualizacion.set(headers),
      error: (error) => {
        console.error('Error loading ACTUALIZACION headers:', error);
        // 404 significa que no hay cabeceras configuradas - no mostrar error
        if (error?.status !== 404) {
          this.notificationService.warning(
            'Cabeceras no disponibles',
            'No se pudieron cargar las cabeceras de actualización diaria'
          );
        }
      }
    });
  }

  loadComplementaryTypes() {
    this.complementaryFileService.getTypesBySubPortfolio(this.selectedSubPortfolioId).subscribe({
      next: (types) => this.complementaryTypes.set(types),
      error: (error) => {
        console.error('Error loading complementary types:', error);
        // No mostrar error si simplemente no hay tipos configurados
        if (error?.status !== 404 && error?.status !== 0) {
          this.notificationService.warning(
            'Tipos complementarios no disponibles',
            'No se pudieron cargar los tipos de archivos complementarios'
          );
        }
      }
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

    const mode = this.selectedLoadMode();
    if (!mode) return;

    // Procesar archivos en paralelo (cada uno manejará su propio estado inline)
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar que es un archivo Excel válido
      if (!isValidExcelFile(file.name)) {
        this.notificationService.error(
          'Archivo no válido',
          `El archivo "${file.name}" no es un archivo Excel válido (.xlsx o .xls).`
        );
        continue;
      }

      // Verificar si ya existe un archivo principal
      const hasMainFile = this.filesToProcess().some(f => f.type === 'MAIN');

      // Determinar el tipo de archivo basándose en el modo y si ya hay archivo principal
      const fileType = determineFileType(mode, hasMainFile);

      // Validar restricciones según el modo
      if (!this.canAddFile(fileType)) {
        continue;
      }

      // Crear archivo con estado inicial 'loading'
      const fileToProcess: FileToProcess = {
        file,
        type: fileType,
        configState: 'loading',
        isExpanded: true,
        validated: false
      };

      this.filesToProcess.update(files => [...files, fileToProcess]);

      // Procesar el archivo (no bloqueante - usa configuración inline)
      this.parseAndValidateFile(fileToProcess);
    }

    event.target.value = '';
  }

  /**
   * Valida si se puede agregar un archivo según el modo y tipo
   * - DAILY: solo 1 archivo principal
   * - INITIAL_MONTH: 1 archivo principal + N complementarios
   * - COMPLEMENTARY: N archivos complementarios
   */
  canAddFile(fileType: FileType): boolean {
    const mode = this.selectedLoadMode();
    const hasMainFile = this.filesToProcess().some(f => f.type === 'MAIN');

    switch (mode) {
      case 'DAILY':
        // Solo permite 1 archivo principal
        if (hasMainFile) {
          this.notificationService.warning(
            'Límite alcanzado',
            'La carga diaria solo permite un archivo.'
          );
          return false;
        }
        return true;

      case 'INITIAL_MONTH':
        // Permite 1 archivo principal + múltiples complementarios
        if (fileType === 'MAIN' && hasMainFile) {
          this.notificationService.warning(
            'Archivo principal ya existe',
            'Ya existe un archivo principal. Los archivos adicionales se agregarán como complementarios.'
          );
          return false;
        }
        return true;

      case 'COMPLEMENTARY':
        // Solo permite archivos complementarios (múltiples)
        return true;

      default:
        return false;
    }
  }

  removeFile(fileToRemove: FileToProcess) {
    this.filesToProcess.update(files => files.filter(f => f !== fileToRemove));
  }

  /**
   * Cambia el tipo de archivo entre MAIN y COMPLEMENTARY
   * Solo disponible en modo INITIAL_MONTH cuando hay múltiples archivos
   */
  toggleFileType(file: FileToProcess) {
    if (this.selectedLoadMode() !== 'INITIAL_MONTH') return;

    if (file.type === 'MAIN') {
      // Cambiar de MAIN a COMPLEMENTARY
      file.type = 'COMPLEMENTARY';

      // Necesita campo de enlace, abrir configuración
      if (file.headers && file.headers.length > 0) {
        file.linkField = this.suggestLinkField(file.headers) || undefined;
      }

      // Si estaba listo, volver a configuración para seleccionar linkField
      if (file.configState === 'ready') {
        file.configState = 'configuring';
        file.isExpanded = true;
        file.validated = false;
      }

      this.notificationService.info(
        'Tipo cambiado',
        `"${file.file.name}" ahora es Complementario. Seleccione el campo de enlace.`
      );
    } else {
      // Cambiar de COMPLEMENTARY a MAIN
      // Primero, degradar el MAIN actual a COMPLEMENTARY (si existe)
      const currentMain = this.filesToProcess().find(f => f.type === 'MAIN');
      if (currentMain) {
        currentMain.type = 'COMPLEMENTARY';

        // Configurar el antiguo MAIN como complementario
        if (currentMain.headers && currentMain.headers.length > 0) {
          currentMain.linkField = this.suggestLinkField(currentMain.headers) || undefined;
        }

        // Si estaba listo, volver a configuración
        if (currentMain.configState === 'ready') {
          currentMain.configState = 'configuring';
          currentMain.isExpanded = true;
          currentMain.validated = false;
        }
      }

      // Ahora este archivo pasa a ser MAIN
      file.type = 'MAIN';
      file.linkField = undefined; // MAIN no necesita campo de enlace

      // Si tiene datos y no hay columnas no registradas pendientes, puede estar listo
      if (file.data && file.headers) {
        const hasUnregisteredSelected = file.unregisteredColumns?.some(c => c.selected);
        if (!hasUnregisteredSelected && file.selectedSheet) {
          file.configState = 'ready';
          file.isExpanded = false;
          file.validated = true;
        }
      }

      this.notificationService.success(
        'Tipo cambiado',
        `"${file.file.name}" ahora es el archivo Principal.`
      );
    }

    this.updateFilesSignal();
  }

  clearFiles() {
    this.filesToProcess.set([]);
    this.lastResult.set(null);
  }

  async parseAndValidateFile(fileToProcess: FileToProcess): Promise<void> {
    try {
      // Paso 1: Detectar hojas disponibles en el archivo Excel
      const sheetsInfo = await this.getExcelSheetsWithPreview(fileToProcess.file);

      if (sheetsInfo.length === 0) {
        this.updateFileError(fileToProcess, 'El archivo no contiene hojas válidas');
        return;
      }

      // Guardar las hojas disponibles como SheetInfo
      fileToProcess.sheetsInfo = sheetsInfo.map(s => ({
        name: s.name,
        headers: s.headers,
        rowCount: s.rowCount
      }));

      // Paso 2: Si hay múltiples hojas, requerirá configuración
      const needsSheetSelection = sheetsInfo.length > 1;

      // Paso 3: Si solo hay una hoja, seleccionarla automáticamente y leer datos
      if (!needsSheetSelection) {
        const singleSheet = sheetsInfo[0];
        fileToProcess.selectedSheet = singleSheet.name;

        if (singleSheet.rowCount === 0) {
          this.updateFileError(fileToProcess, 'El archivo está vacío');
          return;
        }

        // Leer datos de la única hoja
        const data = await this.readExcelFile(fileToProcess.file, singleSheet.name);
        if (data.length === 0) {
          this.updateFileError(fileToProcess, 'El archivo está vacío');
          return;
        }
        const headers = Object.keys(data[0]);
        if (headers.length === 0) {
          this.updateFileError(fileToProcess, 'El archivo no tiene columnas definidas');
          return;
        }
        fileToProcess.data = data;
        fileToProcess.headers = headers;
        fileToProcess.rowCount = data.length;

        // Pre-seleccionar campo de enlace sugerido para archivos complementarios
        if (fileToProcess.type === 'COMPLEMENTARY') {
          fileToProcess.linkField = this.suggestLinkField(headers) || undefined;
        }

        // Detectar columnas no registradas
        fileToProcess.unregisteredColumns = this.detectUnregisteredColumns(fileToProcess);
      }

      // Determinar si necesita configuración
      const needsConfig = needsSheetSelection ||
                          (fileToProcess.type === 'COMPLEMENTARY') ||
                          (fileToProcess.unregisteredColumns && fileToProcess.unregisteredColumns.length > 0);

      if (needsConfig) {
        fileToProcess.configState = 'configuring';
        fileToProcess.isExpanded = true;
        this.updateFilesSignal();
      } else {
        // Archivo listo sin configuración adicional
        this.completeFileValidation(fileToProcess);
      }

    } catch (error: any) {
      this.updateFileError(fileToProcess, error.message || 'Error al leer el archivo');
    }
  }

  /**
   * Fuerza la actualización del signal de archivos
   */
  private updateFilesSignal() {
    this.filesToProcess.update(files => [...files]);
  }

  /**
   * Detecta las columnas del archivo que no están registradas como cabeceras
   * NOTA: Archivos complementarios y Facilidades usan las cabeceras de INICIAL porque sus columnas
   * se agregan a la misma tabla de carga inicial de mes
   */
  private detectUnregisteredColumns(fileToProcess: FileToProcess): UnregisteredColumn[] {
    if (!fileToProcess.headers || !fileToProcess.data) return [];

    // Obtener cabeceras configuradas según el modo de carga
    // DAILY usa cabeceras de ACTUALIZACION, los demás modos usan INICIAL
    const configuredHeaders = this.selectedLoadMode() === 'DAILY'
      ? this.headersActualizacion()
      : this.headersInicial();

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

        const detectedType = this.detectColumnType(sampleValues);
        unregistered.push({
          name: headerName,
          sampleValues,
          detectedType,
          selected: true,  // Por defecto, seleccionada para crear
          displayLabel: this.generateDisplayLabel(headerName),
          format: detectedType === 'FECHA' ? 'dd/MM/yyyy' : undefined
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
    fileToProcess.configState = 'ready';
    fileToProcess.isExpanded = false;
    this.filesToProcess.update(files => [...files]);
  }

  updateFileError(fileToProcess: FileToProcess, error: string) {
    fileToProcess.error = error;
    fileToProcess.validated = false;
    fileToProcess.configState = 'error';
    this.filesToProcess.update(files => [...files]);
  }

  // ==================== Métodos para configuración inline ====================

  /**
   * Expande o colapsa el panel de configuración de un archivo
   */
  toggleFileExpanded(file: FileToProcess) {
    file.isExpanded = !file.isExpanded;
    this.updateFilesSignal();
  }

  /**
   * Maneja el cambio de hoja seleccionada
   */
  async onSheetChange(file: FileToProcess, sheetName: string) {
    if (!sheetName || !file.sheetsInfo) return;

    const sheetInfo = file.sheetsInfo.find(s => s.name === sheetName);
    if (!sheetInfo) return;

    try {
      // Leer datos de la hoja seleccionada
      const data = await this.readExcelFile(file.file, sheetName);
      if (data.length === 0) {
        file.error = 'La hoja seleccionada está vacía';
        file.headers = undefined;
        file.data = undefined;
        file.rowCount = undefined;
        this.updateFilesSignal();
        return;
      }

      const headers = Object.keys(data[0]);
      if (headers.length === 0) {
        file.error = 'La hoja no tiene columnas definidas';
        file.headers = undefined;
        file.data = undefined;
        file.rowCount = undefined;
        this.updateFilesSignal();
        return;
      }

      // Actualizar datos del archivo
      file.error = undefined;
      file.data = data;
      file.headers = headers;
      file.rowCount = data.length;

      // Pre-seleccionar campo de enlace sugerido para archivos complementarios
      if (file.type === 'COMPLEMENTARY') {
        file.linkField = this.suggestLinkField(headers) || undefined;
      }

      // Detectar columnas no registradas
      file.unregisteredColumns = this.detectUnregisteredColumns(file);

      this.updateFilesSignal();
    } catch (error: any) {
      file.error = error.message || 'Error al leer la hoja';
      this.updateFilesSignal();
    }
  }

  /**
   * Verifica si un header es un campo de enlace común
   */
  isCommonLinkField(header: string): boolean {
    const headerLower = header.toLowerCase();
    return COMMON_LINK_FIELDS.some(field =>
      headerLower === field.toLowerCase() ||
      headerLower.includes(field.toLowerCase())
    );
  }

  /**
   * Alterna la selección de todas las columnas no registradas de un archivo
   */
  toggleAllColumnsForFile(file: FileToProcess) {
    if (!file.unregisteredColumns) return;

    const allSelected = file.unregisteredColumns.every(c => c.selected);
    file.unregisteredColumns.forEach(c => c.selected = !allSelected);
    this.updateFilesSignal();
  }

  /**
   * Cuenta las columnas seleccionadas para un archivo
   */
  getSelectedColumnsCountForFile(file: FileToProcess): number {
    if (!file.unregisteredColumns) return 0;
    return file.unregisteredColumns.filter(c => c.selected).length;
  }

  /**
   * Cancela la configuración de un archivo y lo elimina
   */
  cancelFileConfiguration(file: FileToProcess) {
    this.removeFile(file);
    this.notificationService.info('Archivo removido', 'La configuración fue cancelada');
  }

  /**
   * Valida si un archivo puede ser validado
   */
  canValidateFile(file: FileToProcess): boolean {
    // Debe tener una hoja seleccionada si hay múltiples
    if (file.sheetsInfo && file.sheetsInfo.length > 1 && !file.selectedSheet) {
      return false;
    }

    // Para COMPLEMENTARY, debe tener campo de enlace
    if (file.type === 'COMPLEMENTARY' && !file.linkField) {
      return false;
    }

    // Debe tener datos cargados
    if (!file.headers || !file.data) {
      return false;
    }

    return true;
  }

  /**
   * Valida la configuración de un archivo y lo marca como listo
   */
  async validateFileConfiguration(file: FileToProcess) {
    if (!this.canValidateFile(file)) return;

    // Si hay columnas seleccionadas para crear, crearlas primero
    const selectedColumns = file.unregisteredColumns?.filter(c => c.selected) || [];

    if (selectedColumns.length > 0) {
      this.isCreatingHeaders.set(true);
      try {
        const loadType: LoadType = this.selectedLoadMode() === 'DAILY' ? 'ACTUALIZACION' : 'INICIAL';

        const headersToCreate: HeaderConfigurationItem[] = selectedColumns.map(col => ({
          fieldDefinitionId: 0,  // Campo personalizado sin definición de campo
          headerName: col.name,
          displayLabel: col.displayLabel || col.name,
          dataType: col.detectedType as DataType,
          format: col.format,
          required: false
        }));

        const request: BulkCreateHeaderConfigurationRequest = {
          subPortfolioId: this.selectedSubPortfolioId,
          loadType: loadType,
          headers: headersToCreate
        };

        await firstValueFrom(this.headerConfigService.createBulk(request));

        // Recargar cabeceras
        await this.loadHeaders(this.selectedSubPortfolioId);

        this.notificationService.success(
          'Cabeceras creadas',
          `Se crearon ${selectedColumns.length} cabecera(s) exitosamente`
        );
      } catch (error: any) {
        console.error('Error creating headers:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error('Error al crear cabeceras', friendlyMsg);
        this.isCreatingHeaders.set(false);
        return;
      }
      this.isCreatingHeaders.set(false);
    }

    // Marcar archivo como validado
    this.completeFileValidation(file);
  }

  readExcelFile(file: File, sheetName?: string): Promise<Record<string, any>[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          // cellDates: true convierte números de fecha Excel a objetos Date de JavaScript
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });
          // Usar la hoja especificada o la primera por defecto
          const targetSheetName = sheetName || workbook.SheetNames[0];
          const sheet = workbook.Sheets[targetSheetName];
          if (!sheet) {
            reject(new Error(`Hoja "${targetSheetName}" no encontrada en el archivo`));
            return;
          }
          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

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

  /**
   * Obtiene información de todas las hojas de un archivo Excel con vista previa
   */
  getExcelSheetsWithPreview(file: File): Promise<{ name: string; headers: string[]; sampleRows: any[]; rowCount: number }[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array', cellDates: true });

          const sheetsInfo = workbook.SheetNames.map(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, any>[];

            const headers = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
            const sampleRows = jsonData.slice(0, 3); // Primeras 3 filas como muestra
            const rowCount = jsonData.length;

            return { name: sheetName, headers, sampleRows, rowCount };
          });

          resolve(sheetsInfo);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Sugiere un campo de enlace basándose en las columnas del archivo
   */
  suggestLinkField(headers: string[]): string | null {
    const headersLower = headers.map(h => h.toLowerCase());

    for (const commonField of COMMON_LINK_FIELDS) {
      const index = headersLower.findIndex(h =>
        h === commonField.toLowerCase() ||
        h.includes(commonField.toLowerCase()) ||
        commonField.toLowerCase().includes(h)
      );
      if (index !== -1) {
        return headers[index]; // Retorna el nombre original (con mayúsculas)
      }
    }

    return null;
  }

  /**
   * Recarga las cabeceras configuradas para la subcartera actual
   */
  private async loadHeaders(subPortfolioId: number): Promise<void> {
    try {
      const [inicial, actualizacion] = await Promise.all([
        firstValueFrom(this.headerConfigService.getBySubPortfolioAndLoadType(subPortfolioId, 'INICIAL')),
        firstValueFrom(this.headerConfigService.getBySubPortfolioAndLoadType(subPortfolioId, 'ACTUALIZACION'))
      ]);
      this.headersInicial.set(inicial || []);
      this.headersActualizacion.set(actualizacion || []);
    } catch (error) {
      console.warn('Error loading headers:', error);
    }
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
      return files.some(f => f.type === 'MAIN');
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
        case 'COMPLEMENTARY':
          await this.processComplementaryLoad();
          break;
      }
    } catch (error: any) {
      console.error('Error processing files:', error);
      const friendlyMsg = this.getFriendlyErrorMessage(error);
      this.lastResult.set({
        success: false,
        totalProcessed: 0,
        totalErrors: 1,
        error: friendlyMsg
      });
      this.notificationService.error('Error en el procesamiento', friendlyMsg);
    } finally {
      this.isLoading.set(false);
    }
  }

  async processDailyLoad() {
    this.loadingMessage.set('Procesando carga diaria...');
    const file = this.filesToProcess().find(f => f.type === 'MAIN');
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
    const mainFile = files.find(f => f.type === 'MAIN');
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
    const complementaryFiles = files.filter(f => f.type === 'COMPLEMENTARY');

    for (let i = 0; i < complementaryFiles.length; i++) {
      const compFile = complementaryFiles[i];
      if (!compFile.data) continue;

      this.loadingMessage.set(`Procesando archivo complementario ${i + 1} de ${complementaryFiles.length}...`);
      try {
        // Usar el campo de enlace seleccionado por el usuario, o detectar si no se seleccionó
        const linkField = compFile.linkField || this.detectLinkField(compFile.data);

        const compResult = await firstValueFrom(this.headerConfigService.updateComplementaryData(
          this.selectedSubPortfolioId,
          'INICIAL',
          compFile.data,
          linkField
        ));

        complementaryResults.push(compResult);
        totalProcessed += compResult?.updatedRows || 0;
        totalErrors += compResult?.failedRows || 0;

        this.notificationService.success(
          `Archivo complementario ${i + 1} procesado`,
          `${compResult?.updatedRows || 0} registros actualizados`
        );
      } catch (error: any) {
        console.error('Error processing complementary file:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error(`Error en archivo complementario ${i + 1}`, friendlyMsg);
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

  async processComplementaryLoad() {
    const files = this.filesToProcess().filter(f => f.type === 'COMPLEMENTARY');
    if (files.length === 0) throw new Error('No hay archivos complementarios');

    let totalProcessed = 0;
    let totalErrors = 0;
    const complementaryResults: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.data) continue;

      this.loadingMessage.set(`Procesando archivo complementario ${i + 1} de ${files.length}...`);

      try {
        // Usar el campo de enlace seleccionado por el usuario, o detectar si no se seleccionó
        const linkField = file.linkField || this.detectLinkField(file.data);

        // Usar updateComplementaryData para actualizar columnas específicas en la tabla INICIAL
        const result = await firstValueFrom(this.headerConfigService.updateComplementaryData(
          this.selectedSubPortfolioId,
          'INICIAL',
          file.data,
          linkField
        ));

        complementaryResults.push(result);
        totalProcessed += result?.updatedRows || 0;
        totalErrors += result?.failedRows || 0;

        this.notificationService.success(
          `Archivo complementario ${i + 1} procesado`,
          `${result?.updatedRows || 0} registros actualizados`
        );
      } catch (error: any) {
        console.error('Error processing complementary file:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error(`Error en archivo complementario ${i + 1}`, friendlyMsg);
        totalErrors++;
      }
    }

    this.lastResult.set({
      success: totalErrors === 0,
      totalProcessed,
      totalErrors,
      mode: 'COMPLEMENTARY',
      complementaryResults
    });

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
      case 'COMPLEMENTARY': return 'Subida Complementaria';
      default: return '';
    }
  }

  getLoadModeDescription(): string {
    switch (this.selectedLoadMode()) {
      case 'DAILY':
        return 'Suba el archivo Excel con la actualización diaria de la cartera';
      case 'INITIAL_MONTH':
        return 'Suba el archivo principal (obligatorio) y opcionalmente archivos complementarios';
      case 'COMPLEMENTARY':
        return 'Suba archivos Excel para actualizar columnas adicionales de los registros existentes';
      default:
        return '';
    }
  }

  getExpectedFilesDescription(): string {
    switch (this.selectedLoadMode()) {
      case 'DAILY':
        return 'Archivo Excel (.xlsx, .xls) con los datos de actualización diaria';
      case 'INITIAL_MONTH':
        return 'El primer archivo será el principal. Los adicionales actualizarán columnas de los registros existentes';
      case 'COMPLEMENTARY':
        return 'Archivos Excel (.xlsx, .xls) con una columna de identificación para vincular registros';
      default:
        return '';
    }
  }

  getFileTypeLabel(type: FileType): string {
    return getFileTypeLabel(type);
  }

  // ==================== Helpers privados ====================

  /**
   * Genera una etiqueta visual a partir del nombre de la columna
   * Convierte NOMBRE_COLUMNA -> Nombre Columna
   */
  private generateDisplayLabel(headerName: string): string {
    return headerName
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
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

  // ==================== Manejo de errores ====================

  /**
   * Convierte errores HTTP técnicos a mensajes amigables para el usuario
   */
  private getFriendlyErrorMessage(error: any): string {
    // Si el error tiene un mensaje personalizado del backend, usarlo
    if (error?.error?.message && !error.error.message.includes('Http failure')) {
      return error.error.message;
    }

    const status = error?.status;
    switch (status) {
      case 400:
        return 'Datos inválidos. Por favor verifique la información.';
      case 401:
        return 'Sesión expirada. Por favor inicie sesión nuevamente.';
      case 403:
        return 'No tiene permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no existe.';
      case 409:
        return error?.error?.message || 'Conflicto: el recurso tiene datos asociados.';
      case 500:
        return 'Error interno del servidor. Por favor intente más tarde.';
      case 502:
      case 503:
      case 504:
        return 'El servidor no está disponible. Por favor intente más tarde.';
      case 0:
        return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      default:
        if (error?.message && !error.message.includes('Http failure')) {
          return error.message;
        }
        return 'Ocurrió un error inesperado. Por favor intente nuevamente.';
    }
  }
}
