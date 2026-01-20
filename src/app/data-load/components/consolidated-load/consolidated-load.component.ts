import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
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
import { PeriodSnapshotService, PeriodStatusResponse, DailyStatusResponse } from '../../services/period-snapshot.service';
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
  LinkFieldValidation,
  determineFileType,
  getFileTypeLabel,
  isValidExcelFile,
  COMMON_LINK_FIELDS
} from '../../models/complementary-file.model';
import {
  FILE_LIMITS,
  FILE_CONFIG_STATES,
  LOAD_TYPES,
  DATA_TYPES,
  formatFileSize
} from '../../constants/data-load.constants';

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

    <!-- Period Change Confirmation Dialog -->
    @if (showPeriodChangeDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="calendar-clock" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">Cambio de Periodo Detectado</h2>
                <p class="text-amber-100 text-sm">Se archivará el periodo anterior</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            @if (isExecutingSnapshot()) {
              <!-- Snapshot in progress -->
              <div class="text-center py-6">
                <div class="relative mx-auto w-16 h-16 mb-4">
                  <div class="w-16 h-16 border-4 border-gray-200 dark:border-slate-600 rounded-full"></div>
                  <div class="absolute top-0 left-0 w-16 h-16 border-4 border-amber-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ snapshotProgress() }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Por favor espere mientras se archiva el periodo anterior...</p>
              </div>
            } @else {
              <!-- Confirmation content -->
              <div class="space-y-4">
                <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <lucide-angular name="alert-triangle" [size]="20" class="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"></lucide-angular>
                    <div>
                      <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                        Ya existen <span class="font-bold">{{ periodStatus()?.recordCount | number }}</span> registros cargados en esta subcartera.
                      </p>
                      <p class="text-amber-700 dark:text-amber-300 text-sm mt-1">
                        Al continuar, se archivará la información actual antes de cargar los nuevos datos.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Tabla actual:</span>
                    <span class="font-mono text-gray-900 dark:text-white">{{ periodStatus()?.tableName }}</span>
                  </div>
                  @if (periodStatus()?.currentPeriod) {
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Periodo actual:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ periodStatus()?.currentPeriod }}</span>
                    </div>
                  }
                  @if (periodStatus()?.lastArchivedPeriod) {
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Último archivo:</span>
                      <span class="text-gray-900 dark:text-white">{{ periodStatus()?.lastArchivedPeriod }}</span>
                    </div>
                  }
                </div>

                <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <lucide-angular name="archive" [size]="20" class="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"></lucide-angular>
                    <div>
                      <p class="text-emerald-800 dark:text-emerald-200 text-sm font-medium">
                        Los datos actuales se guardarán en el histórico
                      </p>
                      <p class="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                        Podrá consultar los datos archivados posteriormente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          @if (!isExecutingSnapshot()) {
            <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
              <button (click)="cancelPeriodChange()"
                      class="px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium cursor-pointer">
                Cancelar
              </button>
              <button (click)="confirmPeriodChange()"
                      class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors font-medium flex items-center gap-2 cursor-pointer">
                <lucide-angular name="archive" [size]="16"></lucide-angular>
                Archivar y Continuar
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- Verification Warning Dialog (cuando falla la verificación del periodo) -->
    @if (showVerificationWarningDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-amber-500 to-yellow-500 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="wifi-off" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">No se pudo verificar el periodo</h2>
                <p class="text-amber-100 text-sm">La verificación del estado actual falló</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="alert-triangle" [size]="20" class="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                    No se pudo verificar si existen datos previos en esta subcartera.
                  </p>
                  <p class="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    Si continúa, los datos existentes podrían ser sobrescritos sin ser archivados.
                  </p>
                </div>
              </div>
            </div>

            @if (verificationError()) {
              <div class="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Detalle del error:</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 font-mono">{{ verificationError() }}</p>
              </div>
            }

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="info" [size]="20" class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Recomendación
                  </p>
                  <p class="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Si es la primera vez que carga datos en esta subcartera, puede continuar sin problemas.
                    Si ya existen datos, cancele y reintente más tarde.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
            <button (click)="cancelVerificationWarning()"
                    class="px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium cursor-pointer">
              Cancelar
            </button>
            <button (click)="proceedWithoutVerification()"
                    class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-colors font-medium flex items-center gap-2 cursor-pointer">
              <lucide-angular name="alert-triangle" [size]="16"></lucide-angular>
              Continuar de todos modos
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Post-Snapshot Error Dialog (cuando la carga falla después de archivar) -->
    @if (showPostSnapshotErrorDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-500 to-rose-500 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="database" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">Error en la carga</h2>
                <p class="text-red-100 text-sm">Los datos fueron archivados pero la carga falló</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="x-circle" [size]="20" class="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-red-800 dark:text-red-200 text-sm font-medium">
                    La carga de datos falló después de archivar el periodo anterior.
                  </p>
                  <p class="text-red-700 dark:text-red-300 text-sm mt-1">
                    {{ postSnapshotErrorMessage() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="archive" [size]="20" class="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-emerald-800 dark:text-emerald-200 text-sm font-medium">
                    Sus datos están seguros
                  </p>
                  <p class="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                    Los datos del periodo anterior fueron archivados exitosamente en:
                    <span class="font-mono font-semibold">{{ archivedPeriodInfo() }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="info" [size]="20" class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    ¿Qué hacer ahora?
                  </p>
                  <p class="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Puede reintentar la carga. La tabla inicial está vacía y lista para recibir los nuevos datos.
                    Si el problema persiste, contacte al administrador.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
            <button (click)="closePostSnapshotErrorDialog()"
                    class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors font-medium flex items-center gap-2 cursor-pointer">
              <lucide-angular name="check" [size]="16"></lucide-angular>
              Entendido
            </button>
          </div>
        </div>
      </div>
    }

    <!-- ==================== DIÁLOGOS PARA SNAPSHOT DIARIO ==================== -->

    <!-- Daily Snapshot Confirmation Dialog -->
    @if (showDailySnapshotDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-500 to-cyan-500 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="calendar-days" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">Datos Diarios Existentes</h2>
                <p class="text-blue-100 text-sm">Se archivará la carga anterior</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6">
            @if (isExecutingDailySnapshot()) {
              <!-- Snapshot in progress -->
              <div class="text-center py-6">
                <div class="relative mx-auto w-16 h-16 mb-4">
                  <div class="w-16 h-16 border-4 border-gray-200 dark:border-slate-600 rounded-full"></div>
                  <div class="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ dailySnapshotProgress() }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Por favor espere mientras se archivan los datos del día anterior...</p>
              </div>
            } @else {
              <!-- Confirmation content -->
              <div class="space-y-4">
                <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <lucide-angular name="info" [size]="20" class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></lucide-angular>
                    <div>
                      <p class="text-blue-800 dark:text-blue-200 text-sm font-medium">
                        Ya existen <span class="font-bold">{{ dailyStatus()?.recordCount | number }}</span> registros de carga diaria.
                      </p>
                      <p class="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        Al continuar, se archivará la información actual antes de cargar los nuevos datos.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-gray-600 dark:text-gray-400">Tabla:</span>
                    <span class="font-mono text-gray-900 dark:text-white">{{ dailyStatus()?.tableName }}</span>
                  </div>
                  @if (dailyStatus()?.lastLoadDate) {
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Última carga:</span>
                      <span class="font-semibold text-gray-900 dark:text-white">{{ dailyStatus()?.lastLoadDate }}</span>
                    </div>
                  }
                  @if (dailyStatus()?.lastArchivedDate) {
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Último archivo:</span>
                      <span class="text-gray-900 dark:text-white">{{ dailyStatus()?.lastArchivedDate }}</span>
                    </div>
                  }
                </div>

                <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
                  <div class="flex items-start gap-3">
                    <lucide-angular name="archive" [size]="20" class="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"></lucide-angular>
                    <div>
                      <p class="text-emerald-800 dark:text-emerald-200 text-sm font-medium">
                        Los datos actuales se guardarán en el histórico
                      </p>
                      <p class="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                        Podrá consultar los datos archivados posteriormente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          @if (!isExecutingDailySnapshot()) {
            <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
              <button (click)="cancelDailySnapshot()"
                      class="px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium cursor-pointer">
                Cancelar
              </button>
              <button (click)="confirmDailySnapshot()"
                      class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors font-medium flex items-center gap-2 cursor-pointer">
                <lucide-angular name="archive" [size]="16"></lucide-angular>
                Archivar y Continuar
              </button>
            </div>
          }
        </div>
      </div>
    }

    <!-- Daily Verification Warning Dialog -->
    @if (showDailyVerificationWarningDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-amber-500 to-yellow-500 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="wifi-off" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">No se pudo verificar estado diario</h2>
                <p class="text-amber-100 text-sm">La verificación de datos existentes falló</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="alert-triangle" [size]="20" class="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-amber-800 dark:text-amber-200 text-sm font-medium">
                    No se pudo verificar si existen datos de carga diaria previos.
                  </p>
                  <p class="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    Si continúa, los datos existentes podrían ser sobrescritos sin ser archivados.
                  </p>
                </div>
              </div>
            </div>

            @if (dailyVerificationError()) {
              <div class="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Detalle del error:</p>
                <p class="text-sm text-gray-700 dark:text-gray-300 font-mono">{{ dailyVerificationError() }}</p>
              </div>
            }

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="info" [size]="20" class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    Recomendación
                  </p>
                  <p class="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Si es la primera carga diaria del día, puede continuar sin problemas.
                    Si ya realizó cargas hoy, cancele y reintente más tarde.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
            <button (click)="cancelDailyVerificationWarning()"
                    class="px-4 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors font-medium cursor-pointer">
              Cancelar
            </button>
            <button (click)="proceedDailyWithoutVerification()"
                    class="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-colors font-medium flex items-center gap-2 cursor-pointer">
              <lucide-angular name="alert-triangle" [size]="16"></lucide-angular>
              Continuar de todos modos
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Post-Daily-Snapshot Error Dialog -->
    @if (showPostDailySnapshotErrorDialog()) {
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"></div>
        <div class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 max-w-lg w-full mx-4 overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-red-500 to-rose-500 p-5">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <lucide-angular name="database" [size]="24" class="text-white"></lucide-angular>
              </div>
              <div>
                <h2 class="text-xl font-bold !text-white">Error en carga diaria</h2>
                <p class="text-red-100 text-sm">Los datos fueron archivados pero la carga falló</p>
              </div>
            </div>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="x-circle" [size]="20" class="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-red-800 dark:text-red-200 text-sm font-medium">
                    La carga diaria falló después de archivar los datos anteriores.
                  </p>
                  <p class="text-red-700 dark:text-red-300 text-sm mt-1">
                    {{ postDailySnapshotErrorMessage() }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="archive" [size]="20" class="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-emerald-800 dark:text-emerald-200 text-sm font-medium">
                    Sus datos están seguros
                  </p>
                  <p class="text-emerald-700 dark:text-emerald-300 text-sm mt-1">
                    Los datos diarios anteriores fueron archivados en:
                    <span class="font-mono font-semibold">{{ archivedDailyInfo() }}</span>
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <div class="flex items-start gap-3">
                <lucide-angular name="info" [size]="20" class="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></lucide-angular>
                <div>
                  <p class="text-blue-800 dark:text-blue-200 text-sm font-medium">
                    ¿Qué hacer ahora?
                  </p>
                  <p class="text-blue-700 dark:text-blue-300 text-sm mt-1">
                    Puede reintentar la carga. La tabla de actualización está vacía y lista para recibir los nuevos datos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900 flex justify-end gap-3">
            <button (click)="closePostDailySnapshotErrorDialog()"
                    class="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-colors font-medium flex items-center gap-2 cursor-pointer">
              <lucide-angular name="check" [size]="16"></lucide-angular>
              Entendido
            </button>
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
                             accept=".xlsx,.xls,.csv"
                             (change)="onFileSelected($event)"
                             [multiple]="selectedLoadMode() === 'INITIAL_MONTH'"
                             class="hidden">
                    </label>
                  </div>
                </div>
              </div>

              <!-- Lista de archivos -->
              <div class="p-4"
                   (dragover)="onDragOver($event)"
                   (dragenter)="onDragEnter($event)"
                   (dragleave)="onDragLeave($event)"
                   (drop)="onDrop($event)">
                @if (filesToProcess().length === 0) {
                  <div class="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200"
                       [class.border-gray-300]="!isDragging()"
                       [class.dark:border-slate-700]="!isDragging()"
                       [class.border-emerald-500]="isDragging()"
                       [class.bg-emerald-50]="isDragging()"
                       [class.dark:bg-emerald-900/20]="isDragging()">
                    <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all"
                         [class.bg-gray-100]="!isDragging()"
                         [class.dark:bg-slate-800]="!isDragging()"
                         [class.bg-emerald-100]="isDragging()"
                         [class.dark:bg-emerald-800]="isDragging()">
                      <lucide-angular [name]="isDragging() ? 'download' : 'file-spreadsheet'" [size]="32"
                                      [class.text-gray-400]="!isDragging()"
                                      [class.dark:text-gray-600]="!isDragging()"
                                      [class.text-emerald-600]="isDragging()"
                                      [class.dark:text-emerald-400]="isDragging()"></lucide-angular>
                    </div>
                    <h3 class="font-semibold mb-2 transition-colors"
                        [class.text-gray-900]="!isDragging()"
                        [class.dark:text-white]="!isDragging()"
                        [class.text-emerald-700]="isDragging()"
                        [class.dark:text-emerald-300]="isDragging()">
                      {{ isDragging() ? '¡Suelta los archivos aquí!' : 'Arrastra archivos aquí o haz clic en "Agregar Archivo"' }}
                    </h3>
                    <p class="text-gray-500 dark:text-gray-400 text-sm">{{ getExpectedFilesDescription() }}</p>
                  </div>
                } @else {
                  <!-- Indicador de drop cuando ya hay archivos -->
                  @if (isDragging()) {
                    <div class="mb-3 border-2 border-dashed border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center transition-all">
                      <div class="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <lucide-angular name="download" [size]="20"></lucide-angular>
                        <span class="font-semibold">¡Suelta para agregar más archivos!</span>
                      </div>
                    </div>
                  }
                  <div class="space-y-3">
                    @for (file of filesToProcess(); track file.file.name; let fileIndex = $index) {
                      <div class="bg-gray-50 dark:bg-slate-800 rounded-xl border overflow-hidden transition-all"
                           [class.border-emerald-500]="file.configState === FILE_CONFIG_STATES.READY"
                           [class.border-amber-500]="file.configState === FILE_CONFIG_STATES.CONFIGURING"
                           [class.border-red-500]="file.configState === FILE_CONFIG_STATES.ERROR"
                           [class.border-gray-200]="file.configState === FILE_CONFIG_STATES.LOADING"
                           [class.dark:border-emerald-500]="file.configState === FILE_CONFIG_STATES.READY"
                           [class.dark:border-amber-500]="file.configState === FILE_CONFIG_STATES.CONFIGURING"
                           [class.dark:border-red-500]="file.configState === FILE_CONFIG_STATES.ERROR"
                           [class.dark:border-slate-700]="file.configState === FILE_CONFIG_STATES.LOADING">

                        <!-- Cabecera del archivo (siempre visible) -->
                        <div class="p-4 flex items-center justify-between">
                          <div class="flex items-center gap-3">
                            <!-- Icono de estado -->
                            <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                                 [class.bg-emerald-100]="file.configState === FILE_CONFIG_STATES.READY"
                                 [class.dark:bg-emerald-600/20]="file.configState === FILE_CONFIG_STATES.READY"
                                 [class.bg-amber-100]="file.configState === FILE_CONFIG_STATES.CONFIGURING"
                                 [class.dark:bg-amber-600/20]="file.configState === FILE_CONFIG_STATES.CONFIGURING"
                                 [class.bg-red-100]="file.configState === FILE_CONFIG_STATES.ERROR"
                                 [class.dark:bg-red-600/20]="file.configState === FILE_CONFIG_STATES.ERROR"
                                 [class.bg-gray-200]="file.configState === FILE_CONFIG_STATES.LOADING"
                                 [class.dark:bg-slate-700]="file.configState === FILE_CONFIG_STATES.LOADING">
                              @if (file.configState === FILE_CONFIG_STATES.READY) {
                                <lucide-angular name="check-circle" [size]="20" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
                              } @else if (file.configState === FILE_CONFIG_STATES.CONFIGURING) {
                                <lucide-angular name="settings" [size]="20" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                              } @else if (file.configState === FILE_CONFIG_STATES.ERROR) {
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
                                @if (file.configState === FILE_CONFIG_STATES.READY && file.selectedSheet) {
                                  <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded text-xs">
                                    <lucide-angular name="sheet" [size]="10" class="inline mr-0.5"></lucide-angular>
                                    {{ file.selectedSheet }}
                                  </span>
                                }
                                @if (file.configState === FILE_CONFIG_STATES.READY && file.linkField) {
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
                            @if (file.configState === FILE_CONFIG_STATES.ERROR) {
                              <span class="text-xs text-red-600 dark:text-red-400 max-w-xs truncate">{{ file.error }}</span>
                            }
                            @if (file.configState === FILE_CONFIG_STATES.CONFIGURING) {
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
                        @if (file.configState === FILE_CONFIG_STATES.CONFIGURING && file.isExpanded) {
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

                              <!-- Selector de Campo de Enlace (para COMPLEMENTARY y DAILY) -->
                              @if ((file.type === 'COMPLEMENTARY' || (file.type === 'MAIN' && selectedLoadMode() === 'DAILY')) && file.headers && file.headers.length > 0) {
                                <div>
                                  <label class="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                                    <lucide-angular name="link" [size]="12" class="inline mr-1"></lucide-angular>
                                    Campo de enlace
                                    @if (selectedLoadMode() === 'DAILY') {
                                      <span class="text-xs font-normal text-gray-400 ml-1">(para vincular con tabla inicial)</span>
                                    }
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
                                    @if (selectedLoadMode() === 'DAILY') {
                                      Columna para identificar registros en la tabla inicial y actualizarlos
                                    } @else {
                                      Columna que identifica los registros a actualizar
                                    }
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
                                      <!-- Fila principal: checkbox + nombre + badges de tablas + ejemplos -->
                                      <div class="flex items-center gap-3">
                                        <input type="checkbox"
                                               [(ngModel)]="col.selected"
                                               class="w-4 h-4 rounded !border-gray-400 dark:!border-slate-500 text-emerald-500 focus:ring-emerald-500 cursor-pointer">
                                        <div class="flex-1 min-w-0">
                                          <div class="flex items-center gap-2 flex-wrap">
                                            <code class="font-mono text-sm !text-amber-700 dark:!text-amber-400 !bg-amber-100 dark:!bg-amber-900/30 px-1.5 py-0.5 rounded">{{ col.name }}</code>
                                            <!-- Badges indicando en qué tablas falta (solo para DAILY mode) -->
                                            @if (selectedLoadMode() === 'DAILY') {
                                              @if (col.missingInActualizacion && col.missingInInicial) {
                                                <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium !bg-red-100 dark:!bg-red-900/30 !text-red-700 dark:!text-red-400">
                                                  Falta en ambas
                                                </span>
                                              } @else if (col.missingInActualizacion) {
                                                <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium !bg-orange-100 dark:!bg-orange-900/30 !text-orange-700 dark:!text-orange-400">
                                                  Falta en Diaria
                                                </span>
                                              } @else if (col.missingInInicial) {
                                                <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium !bg-purple-100 dark:!bg-purple-900/30 !text-purple-700 dark:!text-purple-400">
                                                  Falta en Inicial
                                                </span>
                                              }
                                            }
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
                                          @if (col.detectedType === DATA_TYPES.DATE) {
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
                                          <div [class.sm:col-span-2]="col.detectedType !== DATA_TYPES.DATE">
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
                                  @if (selectedLoadMode() === 'DAILY') {
                                    Las columnas seleccionadas se crearán en las tablas donde falten (Diaria y/o Inicial). Las no seleccionadas serán ignoradas.
                                  } @else {
                                    Las columnas seleccionadas se crearán como nuevas cabeceras. Las no seleccionadas serán ignoradas.
                                  }
                                </p>
                              </div>
                            }

                            <!-- Vista Previa de Datos -->
                            @if (file.data && file.data.length > 0 && file.headers) {
                              <div class="border-t !border-gray-200 dark:!border-slate-700 pt-4 mt-4">
                                <button (click)="toggleDataPreview(file)"
                                        class="flex items-center gap-2 text-sm font-semibold !text-gray-700 dark:!text-gray-300 hover:!text-blue-600 dark:hover:!text-blue-400 cursor-pointer mb-3">
                                  <lucide-angular [name]="file.showPreview ? 'chevron-down' : 'chevron-right'" [size]="16"></lucide-angular>
                                  <lucide-angular name="eye" [size]="16" class="!text-blue-600 dark:!text-blue-400"></lucide-angular>
                                  Vista previa ({{ file.data.length > 5 ? '5 de ' + file.data.length : file.data.length }} registros)
                                </button>

                                @if (file.showPreview) {
                                  <div class="overflow-x-auto rounded-lg border !border-gray-200 dark:!border-slate-700 max-h-48">
                                    <table class="min-w-full text-xs">
                                      <thead class="!bg-gray-100 dark:!bg-slate-800 sticky top-0">
                                        <tr>
                                          @for (header of file.headers.slice(0, 8); track header) {
                                            <th class="px-2 py-1.5 text-left font-semibold !text-gray-700 dark:!text-gray-300 whitespace-nowrap border-r !border-gray-200 dark:!border-slate-700 last:border-r-0"
                                                [class.!bg-purple-100]="header === file.linkField"
                                                [class.dark:!bg-purple-900/30]="header === file.linkField">
                                              {{ header }}
                                              @if (header === file.linkField) {
                                                <lucide-angular name="link" [size]="10" class="inline ml-1 !text-purple-600 dark:!text-purple-400"></lucide-angular>
                                              }
                                            </th>
                                          }
                                          @if (file.headers.length > 8) {
                                            <th class="px-2 py-1.5 text-center !text-gray-500 dark:!text-gray-400">
                                              +{{ file.headers.length - 8 }} cols
                                            </th>
                                          }
                                        </tr>
                                      </thead>
                                      <tbody class="!bg-white dark:!bg-slate-900">
                                        @for (row of file.data.slice(0, 5); track $index; let rowIdx = $index) {
                                          <tr class="border-t !border-gray-100 dark:!border-slate-800">
                                            @for (header of file.headers.slice(0, 8); track header) {
                                              <td class="px-2 py-1 !text-gray-600 dark:!text-gray-400 whitespace-nowrap max-w-32 truncate border-r !border-gray-100 dark:!border-slate-800 last:border-r-0"
                                                  [class.!bg-purple-50]="header === file.linkField"
                                                  [class.dark:!bg-purple-900/10]="header === file.linkField"
                                                  [title]="row[header]">
                                                {{ row[header] ?? '-' }}
                                              </td>
                                            }
                                            @if (file.headers.length > 8) {
                                              <td class="px-2 py-1 text-center !text-gray-400">...</td>
                                            }
                                          </tr>
                                        }
                                      </tbody>
                                    </table>
                                  </div>
                                }
                              </div>
                            }

                            <!-- Validaciones del Campo de Enlace -->
                            @if (file.linkField && file.data && file.data.length > 0) {
                              @let validation = validateLinkFieldData(file);
                              @if (validation.hasWarnings) {
                                <div class="border-t !border-gray-200 dark:!border-slate-700 pt-4 mt-4">
                                  <div class="p-3 rounded-lg !bg-amber-50 dark:!bg-amber-900/20 border !border-amber-200 dark:!border-amber-700/50">
                                    <div class="flex items-center gap-2 mb-2">
                                      <lucide-angular name="alert-triangle" [size]="16" class="!text-amber-600 dark:!text-amber-400"></lucide-angular>
                                      <span class="text-sm font-semibold !text-amber-800 dark:!text-amber-300">Advertencias de validación</span>
                                    </div>
                                    <ul class="text-xs space-y-1 !text-amber-700 dark:!text-amber-400">
                                      @if (validation.emptyCount > 0) {
                                        <li class="flex items-center gap-1">
                                          <lucide-angular name="circle-x" [size]="12"></lucide-angular>
                                          {{ validation.emptyCount }} registro(s) con campo de enlace vacío
                                        </li>
                                      }
                                      @if (validation.duplicateCount > 0) {
                                        <li class="flex items-center gap-1">
                                          <lucide-angular name="copy" [size]="12"></lucide-angular>
                                          {{ validation.duplicateCount }} valor(es) duplicado(s) en campo de enlace
                                        </li>
                                      }
                                    </ul>
                                    <p class="text-xs !text-amber-600 dark:!text-amber-500 mt-2 italic">
                                      Estos registros podrían no vincularse correctamente con la tabla inicial.
                                    </p>
                                  </div>
                                </div>
                              }
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
                        <button (click)="showConfirmation.set(true)"
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

          <!-- Modal de Confirmación -->
          @if (showConfirmation()) {
            <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <!-- Header -->
                <div class="p-5 border-b border-gray-200 dark:border-slate-700">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <lucide-angular name="clipboard-check" [size]="20" class="text-emerald-600 dark:text-emerald-400"></lucide-angular>
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white">Confirmar procesamiento</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Revise el resumen antes de continuar</p>
                    </div>
                  </div>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-4">
                  <!-- Modo de carga -->
                  <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <lucide-angular name="folder" [size]="18" class="text-blue-600 dark:text-blue-400"></lucide-angular>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Modo de carga</div>
                      <div class="font-semibold text-gray-900 dark:text-white">
                        @switch (selectedLoadMode()) {
                          @case ('DAILY') { Carga Diaria }
                          @case ('INITIAL_MONTH') { Carga Inicial de Mes }
                          @case ('COMPLEMENTARY') { Carga Complementaria }
                        }
                      </div>
                    </div>
                  </div>

                  <!-- Registros totales -->
                  <div class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <lucide-angular name="database" [size]="18" class="text-purple-600 dark:text-purple-400"></lucide-angular>
                    <div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Total de registros</div>
                      <div class="font-semibold text-gray-900 dark:text-white">{{ getTotalRows() }} en {{ filesToProcess().length }} archivo(s)</div>
                    </div>
                  </div>

                  <!-- Campo de enlace (para DAILY y COMPLEMENTARY) -->
                  @if (selectedLoadMode() === 'DAILY' || selectedLoadMode() === 'COMPLEMENTARY') {
                    @for (file of filesToProcess(); track file.file.name) {
                      @if (file.linkField) {
                        <div class="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50">
                          <lucide-angular name="link" [size]="18" class="text-purple-600 dark:text-purple-400"></lucide-angular>
                          <div class="flex-1">
                            <div class="text-xs text-purple-600 dark:text-purple-400">Campo de enlace</div>
                            <div class="font-semibold text-purple-800 dark:text-purple-300">{{ file.linkField }}</div>
                          </div>
                          @let validation = validateLinkFieldData(file);
                          @if (validation.hasWarnings) {
                            <div class="text-xs text-amber-600 dark:text-amber-400">
                              @if (validation.emptyCount > 0) {
                                <div>{{ validation.emptyCount }} vacíos</div>
                              }
                              @if (validation.duplicateCount > 0) {
                                <div>{{ validation.duplicateCount }} duplicados</div>
                              }
                            </div>
                          }
                        </div>
                      }
                    }
                  }

                  <!-- Nuevas columnas a crear -->
                  @let newColumns = getNewColumnsToCreate();
                  @if (newColumns.total > 0) {
                    <div class="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700/50">
                      <div class="flex items-center gap-2 mb-2">
                        <lucide-angular name="plus-circle" [size]="18" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                        <span class="font-semibold text-amber-800 dark:text-amber-300">{{ newColumns.total }} columna(s) nueva(s)</span>
                      </div>
                      @if (selectedLoadMode() === 'DAILY' && (newColumns.actualizacion > 0 || newColumns.inicial > 0)) {
                        <div class="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                          @if (newColumns.actualizacion > 0) {
                            <div>• {{ newColumns.actualizacion }} en tabla Diaria</div>
                          }
                          @if (newColumns.inicial > 0) {
                            <div>• {{ newColumns.inicial }} en tabla Inicial</div>
                          }
                        </div>
                      }
                    </div>
                  }

                  <!-- Advertencia general -->
                  <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                    <div class="flex items-start gap-2">
                      <lucide-angular name="info" [size]="16" class="text-blue-600 dark:text-blue-400 mt-0.5"></lucide-angular>
                      <p class="text-xs text-blue-700 dark:text-blue-300">
                        @if (selectedLoadMode() === 'DAILY') {
                          Los datos se importarán a la tabla de carga diaria y actualizarán los registros correspondientes en la tabla inicial usando el campo de enlace.
                        } @else if (selectedLoadMode() === 'INITIAL_MONTH') {
                          Los datos se importarán a la tabla de carga inicial. Esta operación puede crear nuevos registros.
                        } @else {
                          Los datos complementarios actualizarán los registros existentes usando el campo de enlace.
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="p-5 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
                  <button (click)="showConfirmation.set(false)"
                          class="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                    Cancelar
                  </button>
                  <button (click)="confirmAndProcess()"
                          class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all font-semibold cursor-pointer flex items-center gap-2">
                    <lucide-angular name="check" [size]="18"></lucide-angular>
                    Confirmar y Procesar
                  </button>
                </div>
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

              <!-- ========== ESTADÍSTICAS PARA CARGA DIARIA ========== -->
              @if (lastResult()?.mode === 'DAILY' && lastResult()?.mainFileResult?.actualizacion) {
                <!-- Resumen general -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Total filas procesadas</p>
                    <p class="text-2xl font-bold !text-gray-900 dark:!text-white">{{ lastResult()?.mainFileResult?.totalRows || 0 }}</p>
                  </div>
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Actualizados en Inicial</p>
                    <p class="text-2xl font-bold !text-blue-600 dark:!text-blue-400">{{ lastResult()?.totalUpdatedInicial || 0 }}</p>
                  </div>
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Errores totales</p>
                    <p class="text-2xl font-bold" [class.!text-red-600]="lastResult()?.totalErrors" [class.dark:!text-red-400]="lastResult()?.totalErrors" [class.!text-gray-400]="!lastResult()?.totalErrors">{{ lastResult()?.totalErrors || 0 }}</p>
                  </div>
                </div>

                <!-- Detalles por tabla -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <!-- Tabla Actualización (Histórico) -->
                  <div class="!bg-amber-50 dark:!bg-amber-900/20 rounded-lg p-3 border !border-amber-200 dark:!border-amber-700/50">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <lucide-angular name="clock" [size]="16" class="!text-amber-600 dark:!text-amber-400"></lucide-angular>
                        <span class="text-sm font-semibold !text-amber-700 dark:!text-amber-400">Tabla Diaria</span>
                      </div>
                      @if (lastResult()?.mainFileResult?.tableActualizacion) {
                        <code class="text-xs !bg-amber-200 dark:!bg-amber-800/50 !text-amber-800 dark:!text-amber-300 px-2 py-0.5 rounded font-mono">
                          {{ lastResult()?.mainFileResult?.tableActualizacion }}
                        </code>
                      }
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-xs">
                      <div class="text-center">
                        <p class="!text-gray-500 dark:!text-gray-400">Insertados</p>
                        <p class="font-bold !text-emerald-600 dark:!text-emerald-400">{{ lastResult()?.mainFileResult?.actualizacion?.insertedRows || 0 }}</p>
                      </div>
                      <div class="text-center">
                        <p class="!text-gray-500 dark:!text-gray-400">Actualizados</p>
                        <p class="font-bold !text-blue-600 dark:!text-blue-400">{{ lastResult()?.mainFileResult?.actualizacion?.updatedRows || 0 }}</p>
                      </div>
                      <div class="text-center">
                        <p class="!text-gray-500 dark:!text-gray-400">Fallidos</p>
                        <p class="font-bold !text-red-600 dark:!text-red-400">{{ lastResult()?.mainFileResult?.actualizacion?.failedRows || 0 }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Tabla Inicial (Maestra) -->
                  <div class="!bg-emerald-50 dark:!bg-emerald-900/20 rounded-lg p-3 border !border-emerald-200 dark:!border-emerald-700/50">
                    <div class="flex items-center justify-between gap-2 mb-2">
                      <div class="flex items-center gap-2">
                        <lucide-angular name="database" [size]="16" class="!text-emerald-600 dark:!text-emerald-400"></lucide-angular>
                        <span class="text-sm font-semibold !text-emerald-700 dark:!text-emerald-400">Tabla Inicial</span>
                      </div>
                      @if (lastResult()?.mainFileResult?.tableInicial) {
                        <code class="text-xs !bg-emerald-200 dark:!bg-emerald-800/50 !text-emerald-800 dark:!text-emerald-300 px-2 py-0.5 rounded font-mono">
                          {{ lastResult()?.mainFileResult?.tableInicial }}
                        </code>
                      }
                    </div>
                    <div class="grid grid-cols-3 gap-2 text-xs">
                      <div class="text-center">
                        <p class="!text-gray-500 dark:!text-gray-400">Actualizados</p>
                        <p class="font-bold !text-blue-600 dark:!text-blue-400">{{ lastResult()?.mainFileResult?.inicial?.updatedRows || 0 }}</p>
                      </div>
                      <div class="text-center">
                        <p class="!text-gray-500 dark:!text-gray-400">No encontrados</p>
                        <p class="font-bold !text-amber-600 dark:!text-amber-400">{{ lastResult()?.mainFileResult?.inicial?.notFoundRows || 0 }}</p>
                      </div>
                      <div class="text-center">
                        <p class="!text-gray-500 dark:!text-gray-400">Fallidos</p>
                        <p class="font-bold !text-red-600 dark:!text-red-400">{{ lastResult()?.mainFileResult?.inicial?.failedRows || 0 }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              } @else {
                <!-- ========== ESTADÍSTICAS PARA OTROS MODOS (INICIAL/COMPLEMENTARIO) ========== -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Total filas</p>
                    <p class="text-2xl font-bold !text-gray-900 dark:!text-white">{{ lastResult()?.mainFileResult?.totalRows || lastResult()?.totalProcessed || 0 }}</p>
                  </div>
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Insertados</p>
                    <p class="text-2xl font-bold !text-emerald-600 dark:!text-emerald-400">{{ lastResult()?.mainFileResult?.insertedRows || 0 }}</p>
                  </div>
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Actualizados</p>
                    <p class="text-2xl font-bold !text-blue-600 dark:!text-blue-400">{{ lastResult()?.mainFileResult?.updatedRows || 0 }}</p>
                  </div>
                  <div class="!bg-gray-100 dark:!bg-slate-800 rounded-lg p-3">
                    <p class="!text-gray-500 dark:!text-gray-400">Fallidos</p>
                    <p class="text-2xl font-bold" [class.!text-red-600]="lastResult()?.totalErrors" [class.dark:!text-red-400]="lastResult()?.totalErrors" [class.!text-gray-400]="!lastResult()?.totalErrors">{{ lastResult()?.totalErrors || 0 }}</p>
                  </div>
                </div>
              }

              <!-- Detalle de errores -->
              @if (lastResult()?.mainFileResult?.errors?.length > 0) {
                <div class="!bg-red-50 dark:!bg-red-900/20 border !border-red-200 dark:!border-red-500/30 rounded-lg p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <lucide-angular name="alert-circle" [size]="18" class="!text-red-600 dark:!text-red-400"></lucide-angular>
                    <h4 class="font-semibold !text-red-600 dark:!text-red-400">
                      Detalle de errores ({{ lastResult()?.mainFileResult?.errors?.length }}
                      @if (lastResult()?.mainFileResult?.totalErrors > lastResult()?.mainFileResult?.errors?.length) {
                        de {{ lastResult()?.mainFileResult?.totalErrors }}
                      })
                    </h4>
                  </div>
                  <div class="max-h-48 overflow-y-auto space-y-1 text-sm">
                    @for (error of lastResult()?.mainFileResult?.errors; track $index) {
                      <div class="!bg-white dark:!bg-slate-800/50 rounded px-3 py-2 !text-gray-700 dark:!text-gray-300 font-mono text-xs">
                        <span class="!text-red-600 dark:!text-red-400 mr-2">●</span>{{ error }}
                      </div>
                    }
                  </div>
                  @if (lastResult()?.mainFileResult?.totalErrors > lastResult()?.mainFileResult?.errors?.length) {
                    <p class="!text-gray-400 dark:!text-gray-500 text-xs mt-2 italic">
                      * Se muestran solo los primeros {{ lastResult()?.mainFileResult?.errors?.length }} errores de {{ lastResult()?.mainFileResult?.totalErrors }} totales
                    </p>
                  }
                </div>
              }

              <!-- Errores de sincronización de clientes -->
              @if (lastResult()?.mainFileResult?.syncError) {
                <div class="!bg-amber-50 dark:!bg-amber-900/20 border !border-amber-200 dark:!border-amber-500/30 rounded-lg p-4 mt-3">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="users" [size]="18" class="!text-amber-600 dark:!text-amber-400"></lucide-angular>
                    <h4 class="font-semibold !text-amber-600 dark:!text-amber-400">Error en sincronización de clientes</h4>
                  </div>
                  <p class="!text-gray-700 dark:!text-gray-300 text-sm">{{ lastResult()?.mainFileResult?.syncError }}</p>
                </div>
              }

              <!-- Resultados de sincronización exitosa -->
              @if (lastResult()?.mainFileResult?.syncCustomersCreated !== undefined || lastResult()?.mainFileResult?.syncCustomersUpdated !== undefined || lastResult()?.syncCustomersCreated !== undefined) {
                <div class="!bg-cyan-50 dark:!bg-cyan-900/20 rounded-lg p-3 mt-3 border !border-cyan-200 dark:!border-cyan-700/50">
                  <div class="flex items-center gap-2 mb-2">
                    <lucide-angular name="users" [size]="16" class="!text-cyan-600 dark:!text-cyan-400"></lucide-angular>
                    <span class="text-sm font-semibold !text-cyan-700 dark:!text-cyan-400">Sincronización de clientes (desde tabla Inicial):</span>
                  </div>
                  <div class="flex gap-4 text-sm">
                    <span class="!text-emerald-600 dark:!text-emerald-400">
                      <lucide-angular name="user-plus" [size]="14" class="inline mr-1"></lucide-angular>
                      {{ lastResult()?.syncCustomersCreated || lastResult()?.mainFileResult?.syncCustomersCreated || 0 }} creados
                    </span>
                    <span class="!text-blue-600 dark:!text-blue-400">
                      <lucide-angular name="user-check" [size]="14" class="inline mr-1"></lucide-angular>
                      {{ lastResult()?.syncCustomersUpdated || lastResult()?.mainFileResult?.syncCustomersUpdated || 0 }} actualizados
                    </span>
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
export class ConsolidatedLoadComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);

  // Constantes expuestas para uso en template
  readonly DATA_TYPES = DATA_TYPES;
  readonly FILE_CONFIG_STATES = FILE_CONFIG_STATES;

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

  // Signal para estado de drag & drop
  isDragging = signal(false);

  // Signal para mostrar resumen de confirmación antes de procesar
  showConfirmation = signal(false);

  // Signals para cambio de periodo
  showPeriodChangeDialog = signal(false);
  periodStatus = signal<PeriodStatusResponse | null>(null);
  isExecutingSnapshot = signal(false);
  snapshotProgress = signal('');

  // Signals para advertencias de verificación fallida
  showVerificationWarningDialog = signal(false);
  verificationError = signal<string | null>(null);

  // Signal para error post-snapshot (carga falló después de archivar)
  showPostSnapshotErrorDialog = signal(false);
  postSnapshotErrorMessage = signal<string | null>(null);
  archivedPeriodInfo = signal<string | null>(null);

  // Signals para snapshot diario (carga diaria)
  showDailySnapshotDialog = signal(false);
  dailyStatus = signal<DailyStatusResponse | null>(null);
  isExecutingDailySnapshot = signal(false);
  dailySnapshotProgress = signal('');

  // Signals para advertencias de verificación diaria fallida
  showDailyVerificationWarningDialog = signal(false);
  dailyVerificationError = signal<string | null>(null);

  // Signal para error post-snapshot diario
  showPostDailySnapshotErrorDialog = signal(false);
  postDailySnapshotErrorMessage = signal<string | null>(null);
  archivedDailyInfo = signal<string | null>(null);

  constructor(
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private headerConfigService: HeaderConfigurationService,
    private complementaryFileService: ComplementaryFileService,
    private periodSnapshotService: PeriodSnapshotService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  ngOnDestroy() {
    // Limpiar caché de validación para liberar memoria
    this.validationCache.clear();
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
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, LOAD_TYPES.INICIAL).subscribe({
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
    this.headerConfigService.getBySubPortfolioAndLoadType(this.selectedSubPortfolioId, LOAD_TYPES.ACTUALIZACION).subscribe({
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

    await this.addFilesToProcess(files, mode);
    event.target.value = '';
  }

  // ==================== Drag & Drop ====================

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const mode = this.selectedLoadMode();
    if (!mode) {
      this.notificationService.warning(
        'Seleccione tipo de carga',
        'Debe seleccionar un tipo de carga antes de arrastrar archivos.'
      );
      return;
    }

    this.addFilesToProcess(files, mode);
  }

  // ==================== Procesamiento común de archivos ====================

  /**
   * Método común para agregar archivos (usado por onFileSelected y onDrop)
   * Incluye validaciones de formato y tamaño
   */
  private async addFilesToProcess(files: FileList, mode: LoadMode): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validar formato Excel o CSV
      if (!isValidExcelFile(file.name)) {
        this.notificationService.error(
          'Archivo no válido',
          `"${file.name}" no es un archivo válido (.xlsx, .xls o .csv).`
        );
        continue;
      }

      // Validar tamaño de archivo
      if (file.size > FILE_LIMITS.MAX_SIZE_BYTES) {
        this.notificationService.error(
          'Archivo muy grande',
          `"${file.name}" (${formatFileSize(file.size)}) excede el límite de ${FILE_LIMITS.MAX_SIZE_DISPLAY}.`
        );
        continue;
      }

      // Determinar tipo de archivo
      const hasMainFile = this.filesToProcess().some(f => f.type === 'MAIN');
      const fileType = determineFileType(mode, hasMainFile);

      // Validar restricciones según el modo
      if (!this.canAddFile(fileType)) {
        continue;
      }

      // Crear objeto FileToProcess
      const fileToProcess: FileToProcess = {
        file,
        type: fileType,
        configState: FILE_CONFIG_STATES.LOADING,
        isExpanded: true,
        validated: false
      };

      this.filesToProcess.update(currentFiles => [...currentFiles, fileToProcess]);

      // Procesar archivo de forma asíncrona
      this.parseAndValidateFile(fileToProcess);
    }
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
      if (file.configState === FILE_CONFIG_STATES.READY) {
        file.configState = FILE_CONFIG_STATES.CONFIGURING;
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
        if (currentMain.configState === FILE_CONFIG_STATES.READY) {
          currentMain.configState = FILE_CONFIG_STATES.CONFIGURING;
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
          file.configState = FILE_CONFIG_STATES.READY;
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

        // Pre-seleccionar campo de enlace sugerido para archivos complementarios o carga diaria
        if (fileToProcess.type === 'COMPLEMENTARY' || this.selectedLoadMode() === 'DAILY') {
          fileToProcess.linkField = this.suggestLinkField(headers) || undefined;
        }

        // Detectar columnas no registradas
        fileToProcess.unregisteredColumns = this.detectUnregisteredColumns(fileToProcess);
      }

      // Determinar si necesita configuración
      const isDaily = this.selectedLoadMode() === 'DAILY';
      const needsConfig = needsSheetSelection ||
                          (fileToProcess.type === 'COMPLEMENTARY') ||
                          isDaily ||  // Carga diaria siempre requiere configuración (link field)
                          (fileToProcess.unregisteredColumns && fileToProcess.unregisteredColumns.length > 0);

      if (needsConfig) {
        fileToProcess.configState = FILE_CONFIG_STATES.CONFIGURING;
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
   * Para DAILY: compara contra AMBAS tablas (ACTUALIZACION e INICIAL)
   */
  private detectUnregisteredColumns(fileToProcess: FileToProcess): UnregisteredColumn[] {
    if (!fileToProcess.headers || !fileToProcess.data) return [];

    const isDaily = this.selectedLoadMode() === 'DAILY';

    // Para DAILY: crear sets de ambas tablas
    // Para otros modos: solo usar INICIAL
    const headersActualizacionSet = new Set<string>();
    const headersInicialSet = new Set<string>();

    if (isDaily) {
      // Crear set de cabeceras de ACTUALIZACION
      this.headersActualizacion().forEach(header => {
        headersActualizacionSet.add(header.headerName.toLowerCase());
        if (header.aliases) {
          header.aliases.forEach(alias => {
            headersActualizacionSet.add(alias.alias.toLowerCase());
          });
        }
      });
    }

    // Crear set de cabeceras de INICIAL (usado por todos los modos)
    this.headersInicial().forEach(header => {
      headersInicialSet.add(header.headerName.toLowerCase());
      if (header.aliases) {
        header.aliases.forEach(alias => {
          headersInicialSet.add(alias.alias.toLowerCase());
        });
      }
    });

    // Detectar columnas del archivo que no están registradas
    const unregistered: UnregisteredColumn[] = [];

    fileToProcess.headers.forEach(headerName => {
      const headerLower = headerName.toLowerCase();

      if (isDaily) {
        // Para DAILY: verificar si falta en alguna de las dos tablas
        const missingInActualizacion = !headersActualizacionSet.has(headerLower);
        const missingInInicial = !headersInicialSet.has(headerLower);

        // Solo agregar si falta en al menos una tabla
        if (missingInActualizacion || missingInInicial) {
          const sampleValues = this.collectSampleValues(fileToProcess, headerName);
          const detectedType = this.detectColumnType(sampleValues);

          unregistered.push({
            name: headerName,
            sampleValues,
            detectedType,
            selected: true,  // Por defecto, seleccionada para crear
            displayLabel: this.generateDisplayLabel(headerName),
            format: detectedType === DATA_TYPES.DATE ? 'dd/MM/yyyy' : undefined,
            missingInActualizacion,
            missingInInicial
          });
        }
      } else {
        // Para otros modos: solo verificar contra INICIAL
        if (!headersInicialSet.has(headerLower)) {
          const sampleValues = this.collectSampleValues(fileToProcess, headerName);
          const detectedType = this.detectColumnType(sampleValues);

          unregistered.push({
            name: headerName,
            sampleValues,
            detectedType,
            selected: true,
            displayLabel: this.generateDisplayLabel(headerName),
            format: detectedType === DATA_TYPES.DATE ? 'dd/MM/yyyy' : undefined
          });
        }
      }
    });

    return unregistered;
  }

  /**
   * Recopila valores de muestra de las primeras 5 filas
   */
  private collectSampleValues(fileToProcess: FileToProcess, headerName: string): string[] {
    const sampleValues: string[] = [];
    for (let i = 0; i < Math.min(5, fileToProcess.data!.length); i++) {
      const value = fileToProcess.data![i][headerName];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        sampleValues.push(String(value).trim());
      }
    }
    return sampleValues;
  }

  /**
   * Detecta el tipo de dato de una columna basándose en valores de muestra
   */
  private detectColumnType(sampleValues: string[]): string {
    if (sampleValues.length === 0) return DATA_TYPES.TEXT;

    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}$/,
      /^\d{2}\/\d{2}\/\d{4}$/,
      /^\d{2}-\d{2}-\d{4}$/,
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
    ];

    const isDate = sampleValues.every(v =>
      datePatterns.some(pattern => pattern.test(v))
    );
    if (isDate) return DATA_TYPES.DATE;

    const numericRegex = /^-?\d+([.,]\d+)?$/;
    const isNumeric = sampleValues.every(v =>
      numericRegex.test(v.replace(/,/g, '.'))
    );
    if (isNumeric) return DATA_TYPES.NUMERIC;

    return DATA_TYPES.TEXT;
  }

  /**
   * Completa la validación de un archivo
   */
  private completeFileValidation(fileToProcess: FileToProcess) {
    fileToProcess.validated = true;
    fileToProcess.error = undefined;
    fileToProcess.configState = FILE_CONFIG_STATES.READY;
    fileToProcess.isExpanded = false;
    this.filesToProcess.update(files => [...files]);
  }

  updateFileError(fileToProcess: FileToProcess, error: string) {
    fileToProcess.error = error;
    fileToProcess.validated = false;
    fileToProcess.configState = FILE_CONFIG_STATES.ERROR;
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
   * Alterna la vista previa de datos de un archivo
   */
  toggleDataPreview(file: FileToProcess) {
    file.showPreview = !file.showPreview;
    this.updateFilesSignal();
  }

  /**
   * Valida los datos del campo de enlace en busca de valores vacíos y duplicados
   * Cachea el resultado para evitar recálculos en cada ciclo de detección de cambios
   */
  private validationCache = new Map<string, LinkFieldValidation>();

  validateLinkFieldData(file: FileToProcess): LinkFieldValidation {
    if (!file.linkField || !file.data || file.data.length === 0) {
      return { hasWarnings: false, emptyCount: 0, duplicateCount: 0 };
    }

    // Crear clave de cache basada en archivo y campo de enlace
    const cacheKey = `${file.file.name}_${file.linkField}_${file.data.length}`;
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    const linkField = file.linkField;
    const values: string[] = [];
    let emptyCount = 0;

    // Contar vacíos y recopilar valores no vacíos
    file.data.forEach(row => {
      const value = row[linkField];
      if (value === undefined || value === null || String(value).trim() === '') {
        emptyCount++;
      } else {
        values.push(String(value).trim());
      }
    });

    // Contar duplicados
    const valueCounts = new Map<string, number>();
    values.forEach(v => {
      valueCounts.set(v, (valueCounts.get(v) || 0) + 1);
    });
    let duplicateCount = 0;
    valueCounts.forEach((count, value) => {
      if (count > 1) duplicateCount++;
    });

    const result: LinkFieldValidation = {
      hasWarnings: emptyCount > 0 || duplicateCount > 0,
      emptyCount,
      duplicateCount
    };

    this.validationCache.set(cacheKey, result);
    return result;
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

    // Para DAILY (archivo MAIN), debe tener campo de enlace para vincular con tabla inicial
    if (file.type === 'MAIN' && this.selectedLoadMode() === 'DAILY' && !file.linkField) {
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
        const isDaily = this.selectedLoadMode() === 'DAILY';

        if (isDaily) {
          // Para DAILY: crear columnas en las tablas donde falten
          const colsForActualizacion = selectedColumns.filter(c => c.missingInActualizacion);
          const colsForInicial = selectedColumns.filter(c => c.missingInInicial);

          // Crear en tabla ACTUALIZACION
          if (colsForActualizacion.length > 0) {
            const headersActualizacion: HeaderConfigurationItem[] = colsForActualizacion.map(col => ({
              fieldDefinitionId: 0,
              headerName: col.name,
              displayLabel: col.displayLabel || col.name,
              dataType: col.detectedType as DataType,
              format: col.format,
              required: false
            }));

            await firstValueFrom(this.headerConfigService.createBulk({
              subPortfolioId: this.selectedSubPortfolioId,
              loadType: LOAD_TYPES.ACTUALIZACION,
              headers: headersActualizacion
            }));
          }

          // Crear en tabla INICIAL
          if (colsForInicial.length > 0) {
            const headersInicial: HeaderConfigurationItem[] = colsForInicial.map(col => ({
              fieldDefinitionId: 0,
              headerName: col.name,
              displayLabel: col.displayLabel || col.name,
              dataType: col.detectedType as DataType,
              format: col.format,
              required: false
            }));

            await firstValueFrom(this.headerConfigService.createBulk({
              subPortfolioId: this.selectedSubPortfolioId,
              loadType: LOAD_TYPES.INICIAL,
              headers: headersInicial
            }));
          }

          // Recargar cabeceras
          await this.loadHeaders(this.selectedSubPortfolioId);

          // Mensaje de resumen
          const parts: string[] = [];
          if (colsForActualizacion.length > 0) parts.push(`${colsForActualizacion.length} en Diaria`);
          if (colsForInicial.length > 0) parts.push(`${colsForInicial.length} en Inicial`);
          this.notificationService.success('Cabeceras creadas', `Se crearon: ${parts.join(', ')}`);

        } else {
          // Para otros modos: comportamiento original
          const headersToCreate: HeaderConfigurationItem[] = selectedColumns.map(col => ({
            fieldDefinitionId: 0,
            headerName: col.name,
            displayLabel: col.displayLabel || col.name,
            dataType: col.detectedType as DataType,
            format: col.format,
            required: false
          }));

          const request: BulkCreateHeaderConfigurationRequest = {
            subPortfolioId: this.selectedSubPortfolioId,
            loadType: LOAD_TYPES.INICIAL,
            headers: headersToCreate
          };

          await firstValueFrom(this.headerConfigService.createBulk(request));
          await this.loadHeaders(this.selectedSubPortfolioId);

          this.notificationService.success(
            'Cabeceras creadas',
            `Se crearon ${selectedColumns.length} cabecera(s) exitosamente`
          );
        }
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

          // Detectar si es archivo CSV disfrazado de Excel (texto plano con extensión .xls)
          const isCsvContent = this.detectCsvContent(data);

          let workbook: XLSX.WorkBook;
          if (isCsvContent) {
            // Leer como CSV (texto separado por comas)
            const textContent = new TextDecoder('utf-8').decode(data);
            workbook = XLSX.read(textContent, { type: 'string', cellDates: true });
            console.log('📄 Archivo detectado como CSV (contenido de texto)');
          } else {
            // Leer como Excel binario normal
            workbook = XLSX.read(data, { type: 'array', cellDates: true });
          }

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
   * Detecta si el contenido del archivo es CSV (texto plano) en lugar de Excel binario.
   * Los archivos Excel binarios (.xls) comienzan con el encabezado OLE2: D0 CF 11 E0
   * Los archivos XLSX comienzan con el encabezado ZIP: 50 4B 03 04
   * Si no tiene ninguno de estos encabezados, es probablemente texto plano (CSV)
   */
  private detectCsvContent(data: Uint8Array): boolean {
    if (data.length < 4) return false;

    // Verificar encabezado OLE2 (archivos .xls binarios): D0 CF 11 E0
    const isOle2 = data[0] === 0xD0 && data[1] === 0xCF && data[2] === 0x11 && data[3] === 0xE0;

    // Verificar encabezado ZIP (archivos .xlsx): 50 4B 03 04
    const isZip = data[0] === 0x50 && data[1] === 0x4B && data[2] === 0x03 && data[3] === 0x04;

    // Si no es Excel binario ni XLSX, verificar si es texto ASCII/UTF-8
    if (!isOle2 && !isZip) {
      // Revisar los primeros 1000 bytes para ver si son caracteres de texto válidos
      const sampleSize = Math.min(data.length, 1000);
      let textCharCount = 0;
      for (let i = 0; i < sampleSize; i++) {
        const byte = data[i];
        // Caracteres ASCII imprimibles, tabuladores, saltos de línea, o UTF-8 continuation bytes
        if ((byte >= 32 && byte <= 126) || byte === 9 || byte === 10 || byte === 13 || byte >= 128) {
          textCharCount++;
        }
      }
      // Si más del 90% son caracteres de texto, considerarlo como CSV
      return (textCharCount / sampleSize) > 0.9;
    }

    return false;
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

          // Detectar si es archivo CSV disfrazado de Excel
          const isCsvContent = this.detectCsvContent(data);

          let workbook: XLSX.WorkBook;
          if (isCsvContent) {
            // Leer como CSV (texto separado por comas)
            const textContent = new TextDecoder('utf-8').decode(data);
            workbook = XLSX.read(textContent, { type: 'string', cellDates: true });
            console.log('📄 Archivo detectado como CSV en preview (contenido de texto)');
          } else {
            // Leer como Excel binario normal
            workbook = XLSX.read(data, { type: 'array', cellDates: true });
          }

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
        firstValueFrom(this.headerConfigService.getBySubPortfolioAndLoadType(subPortfolioId, LOAD_TYPES.INICIAL)),
        firstValueFrom(this.headerConfigService.getBySubPortfolioAndLoadType(subPortfolioId, LOAD_TYPES.ACTUALIZACION))
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

  /**
   * Calcula el número de columnas nuevas a crear
   */
  getNewColumnsToCreate(): { total: number; actualizacion: number; inicial: number } {
    let total = 0;
    let actualizacion = 0;
    let inicial = 0;

    this.filesToProcess().forEach(file => {
      if (file.unregisteredColumns) {
        const selected = file.unregisteredColumns.filter(c => c.selected);
        total += selected.length;

        if (this.selectedLoadMode() === 'DAILY') {
          selected.forEach(col => {
            if (col.missingInActualizacion) actualizacion++;
            if (col.missingInInicial) inicial++;
          });
        }
      }
    });

    return { total, actualizacion, inicial };
  }

  /**
   * Confirma y procesa los archivos
   */
  confirmAndProcess() {
    this.showConfirmation.set(false);
    this.processFiles();
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
    const file = this.filesToProcess().find(f => f.type === 'MAIN');
    if (!file || !file.data) throw new Error('No hay archivo de carga diaria');
    if (!file.linkField) throw new Error('No se ha seleccionado un campo de enlace');

    // Verificar si se requiere confirmación de snapshot diario
    try {
      console.log('[DailySnapshot] Verificando estado diario para subPortfolioId:', this.selectedSubPortfolioId);
      const dailyStatus = await firstValueFrom(
        this.periodSnapshotService.checkDailyStatus(this.selectedSubPortfolioId)
      );
      console.log('[DailySnapshot] Estado diario:', dailyStatus);

      if (dailyStatus.requiresConfirmation) {
        console.log('[DailySnapshot] Se requiere confirmación - mostrando diálogo');
        // Mostrar diálogo de confirmación de snapshot diario
        this.dailyStatus.set(dailyStatus);
        this.showDailySnapshotDialog.set(true);
        this.isLoading.set(false);
        return; // Esperar confirmación del usuario
      } else {
        console.log('[DailySnapshot] No se requiere confirmación - continuando con carga');
      }
    } catch (error: any) {
      console.error('[DailySnapshot] Error al verificar estado diario:', error);
      // Mostrar diálogo de advertencia para que el usuario decida
      const errorMessage = error?.message || error?.error?.message || 'Error de conexión con el servidor';
      this.dailyVerificationError.set(errorMessage);
      this.showDailyVerificationWarningDialog.set(true);
      this.isLoading.set(false);
      return; // Esperar decisión del usuario
    }

    // Si no se requiere confirmación, procesar directamente
    await this.executeDailyLoad();
  }

  /**
   * Ejecuta la carga diaria después de verificar/confirmar el snapshot
   */
  private async executeDailyLoad() {
    this.loadingMessage.set('Procesando carga diaria...');
    const file = this.filesToProcess().find(f => f.type === 'MAIN');
    if (!file || !file.data) throw new Error('No hay archivo de carga diaria');
    if (!file.linkField) throw new Error('No se ha seleccionado un campo de enlace');

    // Usar el nuevo endpoint que:
    // 1. Inserta/Actualiza en tabla ACTUALIZACION (histórico)
    // 2. Actualiza la tabla INICIAL (maestra) usando el campo de enlace seleccionado
    // 3. Sincroniza clientes desde INICIAL
    const result = await firstValueFrom(this.headerConfigService.importDailyData(
      this.selectedSubPortfolioId,
      file.data,
      file.linkField
    ));

    // Calcular totales de ambas tablas
    const actualizacionResult = result.actualizacion || {};
    const inicialResult = result.inicial || {};

    const totalInserted = actualizacionResult.insertedRows || 0;
    const totalUpdatedActualizacion = actualizacionResult.updatedRows || 0;
    const totalUpdatedInicial = inicialResult.updatedRows || 0;
    const totalErrors = (actualizacionResult.failedRows || 0) + (inicialResult.failedRows || 0);

    this.lastResult.set({
      success: !result.errors || result.errors.length === 0,
      totalProcessed: totalInserted + totalUpdatedActualizacion,
      totalUpdatedInicial: totalUpdatedInicial,
      totalErrors: totalErrors,
      mode: 'DAILY',
      mainFileResult: result,
      syncCustomersCreated: result.syncCustomersCreated,
      syncCustomersUpdated: result.syncCustomersUpdated
    });

    // Mostrar notificación con detalles
    if (totalUpdatedInicial > 0) {
      this.notificationService.success(
        'Carga diaria completada',
        `${totalInserted} insertados, ${totalUpdatedInicial} actualizados en tabla inicial`
      );
    }

    this.filesToProcess.set([]);
  }

  async processInitialMonthLoad() {
    const files = this.filesToProcess();
    const mainFile = files.find(f => f.type === 'MAIN');
    if (!mainFile || !mainFile.data) throw new Error('No hay archivo de asignación inicial');

    // Verificar si se requiere confirmación de cambio de periodo
    try {
      console.log('[PeriodSnapshot] Verificando estado del periodo para subPortfolioId:', this.selectedSubPortfolioId);
      const periodStatus = await firstValueFrom(
        this.periodSnapshotService.checkPeriodStatus(this.selectedSubPortfolioId)
      );
      console.log('[PeriodSnapshot] Estado del periodo:', periodStatus);

      if (periodStatus.requiresConfirmation) {
        console.log('[PeriodSnapshot] Se requiere confirmación - mostrando diálogo');
        // Mostrar diálogo de confirmación de cambio de periodo
        this.periodStatus.set(periodStatus);
        this.showPeriodChangeDialog.set(true);
        this.isLoading.set(false);
        return; // Esperar confirmación del usuario
      } else {
        console.log('[PeriodSnapshot] No se requiere confirmación - continuando con carga');
      }
    } catch (error: any) {
      console.error('[PeriodSnapshot] Error al verificar estado del periodo:', error);
      // Mostrar diálogo de advertencia para que el usuario decida
      const errorMessage = error?.message || error?.error?.message || 'Error de conexión con el servidor';
      this.verificationError.set(errorMessage);
      this.showVerificationWarningDialog.set(true);
      this.isLoading.set(false);
      return; // Esperar decisión del usuario
    }

    // Si no se requiere confirmación, procesar directamente
    await this.executeInitialMonthLoad();
  }

  /**
   * Ejecuta la carga inicial de mes después de verificar/confirmar el cambio de periodo
   */
  private async executeInitialMonthLoad() {
    const files = this.filesToProcess();
    const mainFile = files.find(f => f.type === 'MAIN');
    if (!mainFile || !mainFile.data) throw new Error('No hay archivo de asignación inicial');

    // 1. Procesar archivo principal (INICIAL)
    this.loadingMessage.set('Procesando asignación inicial...');
    const mainResult = await firstValueFrom(this.headerConfigService.importData(
      this.selectedSubPortfolioId,
      LOAD_TYPES.INICIAL,
      mainFile.data
    ));

    let totalProcessed = mainResult.insertedRows || 0;
    let totalErrors = mainResult.failedRows || 0;

    // 2. Procesar archivos complementarios usando método común
    const complementaryFiles = files.filter(f => f.type === 'COMPLEMENTARY');
    const compResults = await this.processComplementaryFiles(complementaryFiles);

    totalProcessed += compResults.totalUpdated;
    totalErrors += compResults.totalErrors;

    this.lastResult.set({
      success: totalErrors === 0,
      totalProcessed,
      totalErrors,
      mode: 'INITIAL_MONTH',
      mainFileResult: mainResult,
      complementaryResults: compResults.results
    });

    this.filesToProcess.set([]);
  }

  // ==================== Period Change Management ====================

  /**
   * Cancela el cambio de periodo y cierra el diálogo
   */
  cancelPeriodChange() {
    this.showPeriodChangeDialog.set(false);
    this.periodStatus.set(null);
    this.notificationService.info('Carga cancelada', 'La carga inicial de mes fue cancelada');
  }

  /**
   * Cancela cuando la verificación del periodo falló y el usuario no quiere continuar
   */
  cancelVerificationWarning() {
    this.showVerificationWarningDialog.set(false);
    this.verificationError.set(null);
    this.notificationService.info('Carga cancelada', 'La carga fue cancelada por precaución');
  }

  /**
   * El usuario decide continuar con la carga a pesar de que la verificación falló
   */
  async proceedWithoutVerification() {
    this.showVerificationWarningDialog.set(false);
    this.verificationError.set(null);
    this.isLoading.set(true);
    this.loadingMessage.set('Procesando asignación inicial...');

    try {
      await this.executeInitialMonthLoad();
      this.isLoading.set(false);
      this.notificationService.success(
        'Carga completada',
        `${this.lastResult()?.totalProcessed || 0} registros procesados`
      );
    } catch (error: any) {
      this.isLoading.set(false);
      const friendlyMsg = this.getFriendlyErrorMessage(error);
      this.notificationService.error('Error en la carga', friendlyMsg);
    }
  }

  /**
   * Cierra el diálogo de error post-snapshot
   */
  closePostSnapshotErrorDialog() {
    this.showPostSnapshotErrorDialog.set(false);
    this.postSnapshotErrorMessage.set(null);
    this.archivedPeriodInfo.set(null);
  }

  /**
   * Confirma el cambio de periodo, ejecuta el snapshot y continúa con la carga
   */
  async confirmPeriodChange() {
    this.isExecutingSnapshot.set(true);
    this.snapshotProgress.set('Archivando periodo anterior...');

    let snapshotCompleted = false;
    let archivePeriod: string | null = null;

    try {
      // Ejecutar snapshot
      const snapshotResult = await firstValueFrom(
        this.periodSnapshotService.executeSnapshotForSubPortfolio(this.selectedSubPortfolioId)
      );

      if (!snapshotResult.success) {
        throw new Error(snapshotResult.message || 'Error al ejecutar snapshot');
      }

      // Marcar que el snapshot fue exitoso
      snapshotCompleted = true;
      archivePeriod = snapshotResult.archivePeriod;

      this.snapshotProgress.set('Archivo completado. Iniciando carga...');

      // Notificar éxito del snapshot
      this.notificationService.success(
        'Periodo archivado',
        `${snapshotResult.tablesArchived} tabla(s) archivada(s) para periodo ${snapshotResult.archivePeriod}`
      );

      // Cerrar diálogo y continuar con la carga
      this.showPeriodChangeDialog.set(false);
      this.isExecutingSnapshot.set(false);
      this.periodStatus.set(null);

      // Iniciar la carga
      this.isLoading.set(true);
      this.loadingMessage.set('Procesando asignación inicial...');

      await this.executeInitialMonthLoad();

      this.isLoading.set(false);
      this.notificationService.success(
        'Carga completada',
        `${this.lastResult()?.totalProcessed || 0} registros procesados`
      );

    } catch (error: any) {
      this.isExecutingSnapshot.set(false);
      this.showPeriodChangeDialog.set(false);
      this.isLoading.set(false);

      // Distinguir entre error de snapshot y error de carga post-snapshot
      if (snapshotCompleted) {
        // El snapshot fue exitoso pero la carga falló
        // Mostrar diálogo especial informando que los datos están en histórico
        const errorMessage = error?.message || error?.error?.message || 'Error desconocido en la carga';
        this.postSnapshotErrorMessage.set(errorMessage);
        this.archivedPeriodInfo.set(`cashi_historico_db (periodo ${archivePeriod})`);
        this.showPostSnapshotErrorDialog.set(true);
      } else {
        // El snapshot falló
        const errorMsg = this.extractErrorMessage(error, 'No se pudo completar el archivado del periodo');
        this.notificationService.error('Error en snapshot mensual', errorMsg);
      }
    }
  }

  // ==================== Daily Snapshot Management ====================

  /**
   * Cancela el snapshot diario y cierra el diálogo
   */
  cancelDailySnapshot() {
    this.showDailySnapshotDialog.set(false);
    this.dailyStatus.set(null);
    this.notificationService.info('Carga cancelada', 'La carga diaria fue cancelada');
  }

  /**
   * Cancela cuando la verificación del estado diario falló
   */
  cancelDailyVerificationWarning() {
    this.showDailyVerificationWarningDialog.set(false);
    this.dailyVerificationError.set(null);
    this.notificationService.info('Carga cancelada', 'La carga diaria fue cancelada por precaución');
  }

  /**
   * El usuario decide continuar con la carga diaria a pesar de que la verificación falló
   */
  async proceedDailyWithoutVerification() {
    this.showDailyVerificationWarningDialog.set(false);
    this.dailyVerificationError.set(null);
    this.isLoading.set(true);
    this.loadingMessage.set('Procesando carga diaria...');

    try {
      await this.executeDailyLoad();
      this.isLoading.set(false);
      this.notificationService.success(
        'Carga diaria completada',
        `${this.lastResult()?.totalProcessed || 0} registros procesados`
      );
    } catch (error: any) {
      this.isLoading.set(false);
      const friendlyMsg = this.getFriendlyErrorMessage(error);
      this.notificationService.error('Error en la carga diaria', friendlyMsg);
    }
  }

  /**
   * Cierra el diálogo de error post-snapshot diario
   */
  closePostDailySnapshotErrorDialog() {
    this.showPostDailySnapshotErrorDialog.set(false);
    this.postDailySnapshotErrorMessage.set(null);
    this.archivedDailyInfo.set(null);
  }

  /**
   * Confirma el snapshot diario, ejecuta el archivado y continúa con la carga
   */
  async confirmDailySnapshot() {
    this.isExecutingDailySnapshot.set(true);
    this.dailySnapshotProgress.set('Archivando datos diarios anteriores...');

    let snapshotCompleted = false;
    let archiveDate: string | null = null;

    try {
      // Ejecutar snapshot diario
      const snapshotResult = await firstValueFrom(
        this.periodSnapshotService.executeDailySnapshotForSubPortfolio(this.selectedSubPortfolioId)
      );

      if (!snapshotResult.success) {
        throw new Error(snapshotResult.message || 'Error al ejecutar snapshot diario');
      }

      // Marcar que el snapshot fue exitoso
      snapshotCompleted = true;
      archiveDate = snapshotResult.archivePeriod;

      this.dailySnapshotProgress.set('Archivo completado. Iniciando carga...');

      // Notificar éxito del snapshot
      this.notificationService.success(
        'Datos diarios archivados',
        `${snapshotResult.tablesArchived} tabla(s) archivada(s) para fecha ${snapshotResult.archivePeriod}`
      );

      // Cerrar diálogo y continuar con la carga
      this.showDailySnapshotDialog.set(false);
      this.isExecutingDailySnapshot.set(false);
      this.dailyStatus.set(null);

      // Iniciar la carga
      this.isLoading.set(true);
      this.loadingMessage.set('Procesando carga diaria...');

      await this.executeDailyLoad();

      this.isLoading.set(false);
      this.notificationService.success(
        'Carga diaria completada',
        `${this.lastResult()?.totalProcessed || 0} registros procesados`
      );

    } catch (error: any) {
      this.isExecutingDailySnapshot.set(false);
      this.showDailySnapshotDialog.set(false);
      this.isLoading.set(false);

      // Distinguir entre error de snapshot y error de carga post-snapshot
      if (snapshotCompleted) {
        // El snapshot fue exitoso pero la carga falló
        const errorMessage = error?.message || error?.error?.message || 'Error desconocido en la carga';
        this.postDailySnapshotErrorMessage.set(errorMessage);
        this.archivedDailyInfo.set(`cashi_historico_db (fecha ${archiveDate})`);
        this.showPostDailySnapshotErrorDialog.set(true);
      } else {
        // El snapshot falló
        const errorMsg = this.extractErrorMessage(error, 'No se pudo completar el archivado diario');
        this.notificationService.error('Error en snapshot diario', errorMsg);
      }
    }
  }

  async processComplementaryLoad() {
    const files = this.filesToProcess().filter(f => f.type === 'COMPLEMENTARY');
    if (files.length === 0) throw new Error('No hay archivos complementarios');

    // Usar método común para procesar archivos complementarios
    const compResults = await this.processComplementaryFiles(files);

    this.lastResult.set({
      success: compResults.totalErrors === 0,
      totalProcessed: compResults.totalUpdated,
      totalErrors: compResults.totalErrors,
      mode: 'COMPLEMENTARY',
      complementaryResults: compResults.results
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
        return 'Archivo Excel (.xlsx, .xls) o CSV con los datos de actualización diaria';
      case 'INITIAL_MONTH':
        return 'El primer archivo será el principal. Los adicionales actualizarán columnas de los registros existentes';
      case 'COMPLEMENTARY':
        return 'Archivos Excel (.xlsx, .xls) o CSV con una columna de identificación para vincular registros';
      default:
        return '';
    }
  }

  getFileTypeLabel(type: FileType): string {
    return getFileTypeLabel(type);
  }

  // ==================== Helpers privados ====================

  /**
   * Extrae y formatea el mensaje de error de una respuesta HTTP o excepción.
   * Maneja errores de backend Spring Boot y errores de base de datos.
   */
  private extractErrorMessage(error: any, defaultMessage: string = 'Error desconocido'): string {
    // Intentar extraer el mensaje de diferentes estructuras de error
    let message = error?.error?.message
                || error?.error?.error
                || error?.message
                || error?.statusText
                || defaultMessage;

    // Si el mensaje contiene información de error SQL, extraer la parte relevante
    if (typeof message === 'string') {
      // Detectar errores de clave duplicada de MySQL
      const duplicateMatch = message.match(/Duplicate entry '([^']+)' for key '([^']+)'/);
      if (duplicateMatch) {
        const [, value, key] = duplicateMatch;
        // Extraer nombre de tabla del key (formato: tabla.indice)
        const tableName = key.split('.')[0];
        message = `Registro duplicado: el valor '${value}' ya existe en la tabla '${tableName}'`;
      }
    }

    return message;
  }

  /**
   * Procesa archivos complementarios de forma común.
   * Usado tanto en processInitialMonthLoad como en processComplementaryLoad.
   * @param files Lista de archivos complementarios a procesar
   * @returns Objeto con totales y resultados
   */
  private async processComplementaryFiles(
    files: FileToProcess[]
  ): Promise<{ totalUpdated: number; totalErrors: number; results: any[] }> {
    let totalUpdated = 0;
    let totalErrors = 0;
    const results: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.data) continue;

      const displayIndex = i + 1;
      this.loadingMessage.set(`Procesando archivo complementario ${displayIndex} de ${files.length}...`);

      try {
        const linkField = file.linkField || this.detectLinkField(file.data);

        const result = await firstValueFrom(this.headerConfigService.updateComplementaryData(
          this.selectedSubPortfolioId,
          LOAD_TYPES.INICIAL,
          file.data,
          linkField
        ));

        results.push(result);
        totalUpdated += result?.updatedRows || 0;
        totalErrors += result?.failedRows || 0;

        this.notificationService.success(
          `Archivo complementario ${displayIndex} procesado`,
          `${result?.updatedRows || 0} registros actualizados`
        );
      } catch (error: any) {
        console.error('Error processing complementary file:', error);
        const friendlyMsg = this.getFriendlyErrorMessage(error);
        this.notificationService.error(`Error en archivo complementario ${displayIndex}`, friendlyMsg);
        totalErrors++;
      }
    }

    return { totalUpdated, totalErrors, results };
  }

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
