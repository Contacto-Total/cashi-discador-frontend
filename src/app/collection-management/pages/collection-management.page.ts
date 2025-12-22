import { Component, OnInit, OnDestroy, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

import { SystemConfigService } from '../services/system-config.service';
import { ManagementService, CreateManagementRequest, StartCallRequest, EndCallRequest, RegisterPaymentRequest, PaymentScheduleRequest, ConfiguracionCabecera } from '../services/management.service';
import { PaymentScheduleService } from '../services/payment-schedule.service';
import { ThemeService } from '../../shared/services/theme.service';
import { ManagementClassification } from '../models/system-config.model';
import { CustomerData } from '../models/customer.model';
import { ManagementForm, ValidationErrors } from '../models/management.model';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio } from '../../maintenance/models/portfolio.model';
import { TypificationService } from '../../maintenance/services/typification.service';
import { TypificationV2Service } from '../../maintenance/services/typification-v2.service';
import { CampoOpcionDTO } from '../../maintenance/models/typification-v2.model';
import { ApiSystemConfigService } from '../services/api-system-config.service';
import { DynamicFieldRendererComponent } from '../components/dynamic-field-renderer/dynamic-field-renderer.component';
import { MetadataSchema, FieldConfig } from '../../maintenance/models/field-config.model';
import { AmountOption } from '../../shared/components/payment-schedule/payment-schedule.component';
import { CustomerOutputConfigService } from '../../maintenance/services/customer-output-config.service';
import { PaymentScheduleViewComponent } from '../components/payment-schedule-view/payment-schedule-view.component';
import { CustomerService } from '../../customers/services/customer.service';
import { SipService, CallState } from '../../core/services/sip.service';
import { AgentService } from '../../core/services/agent.service';
import { AgentState, AgentStatus } from '../../core/models/agent-status.model';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AuthService } from '../../core/services/auth.service';
import { StatusAlarmClockComponent } from '../../shared/components/status-alarm-clock/status-alarm-clock.component';
import { AutorizacionService, SupervisorEnLinea, CrearSolicitudRequest, SolicitudAutorizacion } from '../../core/services/autorizacion.service';
import { SelectSupervisorModalComponent } from '../../shared/components/select-supervisor-modal/select-supervisor-modal.component';
import { RecordatoriosService } from '../../core/services/recordatorios.service';
import { MatDialog } from '@angular/material/dialog';
import { RecordatoriosModalComponent } from '../../shared/components/recordatorios-modal/recordatorios-modal.component';
import { ComprobanteService } from '../services/comprobante.service';
import { ComprobanteUploadDialogComponent, ComprobanteUploadDialogData, ComprobanteUploadDialogResult } from '../components/comprobante-upload-dialog/comprobante-upload-dialog.component';
import { VoucherPaymentDialogComponent, VoucherPaymentDialogData, VoucherPaymentDialogResult } from '../components/voucher-payment-dialog/voucher-payment-dialog.component';
import { ComprobanteUploadResponse } from '../models/comprobante.model';
import { CartaAcuerdoService } from '../../core/services/carta-acuerdo.service';
import { ConfirmCartaDialogComponent } from '../../features/dialer/call-notes/confirm-carta-dialog/confirm-carta-dialog.component';

@Component({
  selector: 'app-collection-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    DynamicFieldRendererComponent,
    PaymentScheduleViewComponent,
    SelectSupervisorModalComponent,
    StatusAlarmClockComponent
  ],
  template: `
    <div class="collection-management-container h-[100dvh] flex flex-col overflow-hidden">
      <!-- Notificación de éxito -->
      @if (showSuccess()) {
        <div class="fixed top-4 right-4 z-50 animate-[slideInRight_0.5s_ease-out]">
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <div>
              <div class="font-bold">¡Gestión Guardada!</div>
              <div class="text-sm opacity-90">Los datos se registraron correctamente</div>
            </div>
          </div>
        </div>
      }


      <!-- Header Principal - ULTRA COMPACTO -->
      <div class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white shadow-md relative overflow-hidden">
        <div class="relative px-4 py-2">
          <div class="flex items-center justify-between">
            <!-- Lado Izquierdo: Título -->
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-blue-500/30 dark:bg-blue-600/30 rounded-lg flex items-center justify-center">
                <lucide-angular name="clipboard-list" [size]="18" class="text-white"></lucide-angular>
              </div>
              <h1 class="text-base font-bold">Gestión de Cobranza</h1>
            </div>

            <!-- Lado Derecho: Estado, Indicador de Tiempo y Cronómetro -->
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-blue-200 dark:text-blue-300 text-[10px]">Estado</div>
                <div [class]="'font-semibold text-sm transition-all duration-300 ' + (callActive() ? 'text-green-400 animate-pulse' : isTipifying() ? 'text-yellow-400' : 'text-white/80')">
                  {{ callActive() ? '● EN LLAMADA' : isTipifying() ? '✎ TIPIFICANDO' : '○ DISPONIBLE' }}
                </div>
              </div>
              <!-- Indicador de umbral de tiempo (reloj de alarma) -->
              <app-status-alarm-clock
                [color]="colorIndicador()"
                [excedido]="excedeTiempoMaximo()"
                [size]="22">
              </app-status-alarm-clock>
              <div [class]="'px-4 py-1.5 rounded-lg font-mono text-lg font-bold transition-all duration-300 ' + (callActive() ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse shadow-lg shadow-red-500/30' : 'bg-blue-800/50 dark:bg-gray-900/80')">
                {{ formatTime(callDuration()) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal - LAYOUT 3 COLUMNAS + HISTORIAL -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Upper section with 3 columns -->
        <div class="flex-1 flex overflow-hidden min-h-0">
          <!-- PANEL IZQUIERDO - Info Cliente -->
        <div class="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          <!-- Tabs -->
          <div class="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                [class]="'flex-1 px-2 py-1.5 text-[11px] font-semibold transition-all relative ' +
                  (activeTab() === tab.id ? 'text-blue-700 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/50' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800')"
              >
                {{ tab.label }}
                @if (activeTab() === tab.id) {
                  <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
                }
              </button>
            }
          </div>

          <!-- Contenido de tabs -->
          <div class="flex-1 overflow-y-auto p-2">
            <div>
              @if (activeTab() === 'cliente') {
                <div class="space-y-2">
                  <!-- Lista vertical de campos (excluyendo contacto que va abajo) -->
                  @for (field of customerOutputFields(); track field.id) {
                    @if (!isContactField(field.field)) {
                      <div class="pb-1.5 border-b border-slate-100 dark:border-slate-800">
                        <div class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">{{ field.label }}</div>
                        <div class="text-[12px] font-semibold text-slate-800 dark:text-white break-words">
                          {{ formatFieldValue(getFieldValue(field.field), field.format) }}
                        </div>
                      </div>
                    }
                  }
                  @if (customerOutputFields().length === 0) {
                    <div class="text-center py-2 text-slate-400 text-[10px]">
                      Sin campos configurados
                    </div>
                  }

                  <!-- Información de Contacto -->
                  <div class="space-y-1.5 mt-1">
                    <!-- Teléfono Principal -->
                    <div class="flex items-center gap-2 p-1.5 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                      <lucide-angular name="smartphone" [size]="14" class="text-green-600 dark:text-green-400"></lucide-angular>
                      <div class="flex-1 min-w-0">
                        <div class="text-[9px] text-green-600 dark:text-green-400">Principal</div>
                        <div class="text-[11px] font-bold text-green-700 dark:text-green-300 truncate">{{ customerData().contacto.telefono_principal }}</div>
                      </div>
                    </div>
                    <!-- Teléfono Alternativo -->
                    @if (customerData().contacto.telefono_alternativo) {
                      <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <lucide-angular name="phone" [size]="14" class="text-slate-500 dark:text-slate-400"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-slate-500 dark:text-slate-400">Alternativo</div>
                          <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{{ customerData().contacto.telefono_alternativo }}</div>
                        </div>
                      </div>
                    }
                    <!-- Teléfono Trabajo -->
                    @if (customerData().contacto.telefono_trabajo) {
                      <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                        <lucide-angular name="building-2" [size]="14" class="text-slate-500 dark:text-slate-400"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-slate-500 dark:text-slate-400">Trabajo</div>
                          <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{{ customerData().contacto.telefono_trabajo }}</div>
                        </div>
                      </div>
                    }
                    <!-- Email -->
                    @if (customerData().contacto.email) {
                      <div class="flex items-center gap-2 p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-800">
                        <lucide-angular name="mail" [size]="14" class="text-blue-500 dark:text-blue-400"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-blue-500 dark:text-blue-400">Email</div>
                          <div class="text-[11px] font-semibold text-blue-700 dark:text-blue-300 truncate">{{ customerData().contacto.email }}</div>
                        </div>
                      </div>
                    }
                    <!-- Dirección -->
                    @if (customerData().contacto.direccion) {
                      <div class="flex items-center gap-2 p-1.5 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-800">
                        <lucide-angular name="map-pin" [size]="14" class="text-orange-500 dark:text-orange-400 flex-shrink-0"></lucide-angular>
                        <div class="flex-1 min-w-0">
                          <div class="text-[9px] text-orange-500 dark:text-orange-400">Dirección</div>
                          <div class="text-[11px] font-semibold text-orange-700 dark:text-orange-300 line-clamp-2">{{ customerData().contacto.direccion }}</div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }

              @if (activeTab() === 'historial') {
                <div class="space-y-1">
                  @if (historialGestiones().length === 0) {
                    <div class="text-center py-4">
                      <p class="text-[10px] text-gray-400">Sin gestiones previas</p>
                      <button (click)="loadManagementHistory()" class="mt-2 px-2 py-1 bg-blue-500 text-white text-[9px] rounded">Recargar</button>
                    </div>
                  } @else {
                    @for (gestion of historialGestiones(); track $index) {
                      <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-1.5">
                        <div class="flex justify-between items-center text-[9px]">
                          <span class="font-bold text-gray-600 dark:text-gray-300">{{ gestion.fecha }}</span>
                          <span class="text-gray-400">{{ gestion.asesor }}</span>
                        </div>
                        <div class="text-[10px] font-semibold text-blue-600 dark:text-blue-300 mt-0.5">{{ gestion.gestion }}</div>
                        <div class="text-[9px] text-gray-500 dark:text-gray-400 truncate">{{ gestion.observacion }}</div>
                        @if (gestion.schedule) {
                          <button (click)="openScheduleDetail(gestion.id)" class="text-[8px] text-purple-600 dark:text-purple-400 mt-0.5 hover:underline">
                            Ver cronograma →
                          </button>
                        }
                      </div>
                    }
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Panel Central - ULTRA COMPACTO -->
        <div class="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-900 transition-colors duration-300">
          <div class="p-3 space-y-2">
            <!-- Control de Llamada - COMPACTO -->
            <div [class]="'bg-white dark:bg-gray-800 rounded-lg shadow-md border p-2 transition-colors duration-300 ' + (callActive() ? 'border-green-400 dark:border-green-500' : 'border-gray-200 dark:border-gray-700')">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-xs">
                  <div [class]="'p-1 rounded transition-all duration-300 ' + (callActive() ? 'bg-green-100 dark:bg-green-900/30 animate-pulse' : 'bg-blue-100 dark:bg-blue-900/30')">
                  </div>
                  Control de Llamada
                </h3>
                <div class="flex gap-2">
                  <button
                    (click)="toggleMute()"
                    [disabled]="!callActive()"
                    [class]="'px-4 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 text-xs shadow-md hover:shadow-lg ' +
                      (callActive()
                        ? (isMuted()
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white')
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed')"
                  >
                    {{ isMuted() ? '🔇 Activar' : '🔊 Silenciar' }}
                  </button>
                  <button
                    (click)="endCall()"
                    [disabled]="!callActive()"
                    class="px-4 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 rounded-lg font-bold flex items-center gap-2 transition-all duration-300 text-xs shadow-md hover:shadow-lg"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            </div>

            @if (!usesHierarchicalClassifications()) {
            <!-- Resultado de Contacto - COMPACTO -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-300">
              <label class="block font-bold text-gray-800 dark:text-white mb-1 text-[11px] flex items-center gap-1">
                <div class="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                Resultado de Contacto *
              </label>
              <div class="relative">
                <select
                  [(ngModel)]="managementForm.resultadoContacto"
                  (ngModelChange)="onContactResultChange()"
                  [class]="'w-full p-2 pr-8 border rounded-lg font-semibold text-gray-700 dark:text-white appearance-none cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 hover:border-blue-400 dark:hover:border-blue-600 text-xs ' +
                    (errors().resultadoContacto ? 'border-red-500 bg-red-50 dark:bg-red-950/30 dark:border-red-600' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900') + ' ' +
                    (managementForm.resultadoContacto ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-600' : '')"
                >
                  <option value="">-- Seleccionar resultado --</option>
                  @for (tip of contactClassifications(); track tip.id) {
                    <option [value]="tip.id">[{{ tip.codigo }}] {{ tip.label }}</option>
                  }
                </select>
              </div>
              @if (errors().resultadoContacto) {
                <div class="text-red-600 text-[10px] mt-1 flex items-center gap-1">
                  Requerido
                </div>
              }
            </div>
            }

            <!-- Alerta de Promesa de Pago Activa - Compacto -->
            @if (activePaymentSchedules() && activePaymentSchedules().length > 0) {
              <div class="animate-[slideInDown_0.3s_ease-out]">
                @for (schedule of activePaymentSchedules(); track schedule.id) {
                  <div class="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 dark:from-amber-600 dark:via-yellow-600 dark:to-orange-600 text-white rounded-md shadow-md mb-1.5 overflow-hidden border border-amber-400 dark:border-amber-500">
                    <!-- Header -->
                    <div class="px-3 py-2 bg-black/10 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                          <lucide-angular name="alert-triangle" [size]="14" class="text-white"></lucide-angular>
                        </div>
                        <div>
                          <div class="font-bold text-xs">PROMESA DE PAGO ACTIVA</div>
                          <div class="text-[10px] opacity-80">No puede registrar otra promesa</div>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          (click)="openVoucherPaymentDialog(schedule)"
                          class="px-2.5 py-1 bg-white/20 hover:bg-white/30 rounded text-[11px] font-semibold transition-all flex items-center gap-1 border border-white/30"
                          title="Validar voucher con IA">
                          <lucide-angular name="scan-line" [size]="12"></lucide-angular>
                          Voucher
                        </button>
                        <div class="text-right">
                          <div class="text-base font-bold">S/ {{ schedule.totalAmount?.toFixed(2) || '0.00' }}</div>
                          <div class="text-[10px] opacity-80">Total</div>
                        </div>
                      </div>
                    </div>
                    <!-- Detalle de cuotas -->
                    <div class="px-3 py-2 bg-black/5">
                      <div class="text-[10px] font-semibold mb-1.5 opacity-90">DETALLE DE CUOTAS:</div>
                      <div class="flex flex-wrap gap-1.5">
                        @for (cuota of schedule.installments; track cuota.numeroCuota) {
                          <div class="flex items-center gap-1.5 text-[11px] bg-white/20 rounded px-2 py-1">
                            <span class="font-bold">C{{ cuota.numeroCuota }}</span>
                            <span class="opacity-70">|</span>
                            @if (tienePagoParcial(cuota)) {
                              <span class="text-[10px] opacity-70">S/ {{ cuota.monto?.toFixed(2) }}</span>
                              <span class="font-bold text-xs">S/ {{ getSaldoPendienteCuota(cuota).toFixed(2) }}</span>
                            } @else {
                              <span class="font-bold text-xs">S/ {{ cuota.monto?.toFixed(2) || '0.00' }}</span>
                            }
                            <span class="opacity-70">|</span>
                            <span class="font-medium flex items-center gap-0.5">
                              <lucide-angular name="calendar" [size]="11"></lucide-angular>
                              {{ formatDate(cuota.dueDate) }}
                            </span>
                            @if (cuota.status === 'PAGADA' || cuota.status === 'PAGADO' || cuota.status === 'CUMPLIDO') {
                              <span class="bg-green-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="check" [size]="10"></lucide-angular></span>
                            } @else if (cuota.status === 'PARCIAL') {
                              <span class="bg-amber-500 text-[10px] px-1 py-0.5 rounded font-semibold">Parcial</span>
                            } @else if (cuota.status === 'VENCIDA' || cuota.status === 'VENCIDO') {
                              <span class="bg-red-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="alert-triangle" [size]="10"></lucide-angular></span>
                            } @else if (cuota.status === 'CANCELADA' || cuota.status === 'CANCELADO') {
                              <span class="bg-gray-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="x" [size]="10"></lucide-angular></span>
                            } @else {
                              <span class="bg-blue-600 text-[10px] px-1 py-0.5 rounded font-semibold flex items-center"><lucide-angular name="clock" [size]="10"></lucide-angular></span>
                            }
                          </div>
                        }
                      </div>
                      @if (schedule.cuotasPendientes > 0 && schedule.nextDueDate) {
                        <div class="mt-1.5 text-[10px] opacity-80">
                          <span class="font-semibold">{{ schedule.cuotasPendientes }}</span> pendiente(s) · Próx: <span class="font-semibold">{{ formatDate(schedule.nextDueDate) }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Tipo de Gestión - DROPDOWNS EN LÍNEA -->
            @if (usesHierarchicalClassifications()) {
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-3">
                <div class="text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-2">Clasificación</div>
                <div class="flex flex-wrap gap-2">
                  @for (level of hierarchyLevels(); track $index) {
                    @if (shouldShowLevel($index)) {
                      <div class="flex-1 min-w-[140px]">
                        <label class="block text-[9px] text-gray-500 dark:text-gray-400 mb-0.5">
                          {{ getDynamicLevelLabel($index) }}{{ $index === 0 ? ' *' : '' }}
                        </label>
                        <select
                          [ngModel]="selectedClassifications()[$index]"
                          (ngModelChange)="onClassificationLevelChange($index, $event)"
                          [class]="'w-full p-1.5 border rounded text-[11px] font-medium transition-all focus:outline-none focus:ring-1 focus:ring-blue-400 ' +
                            (errors().tipoGestion && $index === 0 ? 'border-red-400 bg-red-50 dark:bg-red-950/30' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-white') + ' ' +
                            (selectedClassifications()[$index] ? 'border-green-400 bg-green-50 dark:bg-green-950/30' : '')"
                        >
                          <option value="">Seleccionar...</option>
                          @for (option of level; track option.id) {
                            <option [value]="option.id">[{{ option.codigo }}] {{ option.label }}</option>
                          }
                        </select>
                      </div>
                    }
                  }
                </div>
                @if (errors().tipoGestion) {
                  <div class="text-red-500 text-[9px] mt-1">Seleccione una clasificación</div>
                }
              </div>
            }

            <!-- Sección de Campos Dinámicos - NUEVA -->
            @if (isLoadingDynamicFields()) {
              <div class="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 rounded-lg shadow-md p-3">
                <div class="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span class="text-xs">Cargando campos adicionales...</span>
                </div>
              </div>
            }
            
            @if (!isLoadingDynamicFields() && isLeafClassification() && dynamicFields().length === 0) {
              <div class="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-3">
                <div class="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                  <span class="text-xs">Esta clasificación no tiene campos adicionales configurados</span>
                </div>
              </div>
            }

            <!-- Componente de Campos Dinámicos -->
            @if (!isLoadingDynamicFields() && isLeafClassification() && dynamicFieldsSchema()) {
              <app-dynamic-field-renderer
                #dynamicFieldRendererComponent
                [schema]="dynamicFieldsSchema()"
                [externalUpdates]="externalFieldUpdates()"
                [selectedClassification]="selectedClassification()"
                [customerAmounts]="customerPaymentAmounts()"
                (dataChange)="onDynamicFieldsChange($event)"
                (customAmountDetected)="onCustomAmountDetected($event)"
              />
            }

            <!-- Schedule Helper - Payment Schedule Information -->
            @if (isLoadingSchedules()) {
              <div class="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-lg shadow-md p-3 animate-pulse">
                <div class="flex items-center justify-center gap-2 text-purple-600 dark:text-purple-400">
                  <span class="text-xs font-semibold">Cargando cronogramas pendientes...</span>
                </div>
              </div>
            }

            @if (!isLoadingSchedules() && showScheduleHelper() && activeSchedules().length > 0) {
              <div class="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-300 dark:border-purple-700 rounded-lg shadow-lg p-3 space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="p-1.5 bg-purple-500 dark:bg-purple-600 rounded">
                    </div>
                    <div>
                      <h4 class="text-xs font-bold text-purple-900 dark:text-purple-100">Cronograma Activo Detectado</h4>
                      <p class="text-[9px] text-purple-600 dark:text-purple-300">Cliente tiene {{ activeSchedules().length }} cronograma(s) pendiente(s)</p>
                    </div>
                  </div>
                </div>

                @for (schedule of activeSchedules(); track schedule.id) {
                  <div class="bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 p-2 space-y-2">
                    <!-- Schedule Summary -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="text-xs font-bold text-purple-900 dark:text-purple-100">
                          {{ schedule.scheduleType || 'CRONOGRAMA' }}
                        </div>
                        <div class="text-[9px] px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-semibold">
                          ACTIVO
                        </div>
                      </div>
                      <div class="text-xs font-bold text-purple-900 dark:text-purple-100">
                        S/ {{ schedule.totalAmount | number:'1.2-2' }}
                      </div>
                    </div>

                    <!-- Pending Installments -->
                    <div class="space-y-1">
                      <div class="text-[9px] font-bold text-gray-600 dark:text-gray-300 uppercase">Cuotas Pendientes</div>
                      @for (installment of getPendingInstallments(schedule); track installment.id; let idx = $index) {
                        @if (idx < 3) {
                          <div class="flex items-center justify-between text-[10px] bg-gray-50 dark:bg-gray-900 p-1.5 rounded">
                            <div class="flex items-center gap-2">
                              <span class="font-semibold text-gray-700 dark:text-gray-300">Cuota #{{ installment.installmentNumber }}</span>
                              <span class="text-gray-500 dark:text-gray-400">Vence: {{ formatDate(installment.dueDate) }}</span>
                            </div>
                            <span class="font-bold text-purple-700 dark:text-purple-300">S/ {{ installment.amount | number:'1.2-2' }}</span>
                          </div>
                        }
                      }
                      @if (getPendingInstallments(schedule).length > 3) {
                        <div class="text-[9px] text-center text-gray-500 dark:text-gray-400 italic">
                          + {{ getPendingInstallments(schedule).length - 3 }} cuotas más
                        </div>
                      }
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex gap-2 pt-1">
                      <!-- Botón Usar Próxima Cuota - Mostrar si allowsInstallmentSelection es true -->
                      @if (selectedClassification()?.allowsInstallmentSelection === true) {
                        <button
                          type="button"
                          (click)="applyNextInstallmentPayment()"
                          class="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1">
                          Usar Próxima Cuota
                        </button>
                      }

                      <!-- Botón Pagar Todo - Mostrar si suggestsFullAmount es true -->
                      @if (selectedClassification()?.suggestsFullAmount === true) {
                        <button
                          type="button"
                          (click)="applyFullSchedulePayment()"
                          class="flex-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white text-[10px] font-bold rounded transition-colors flex items-center justify-center gap-1">
                          Pagar Todo (S/ {{ calculatePendingAmount(schedule) | number:'1.2-2' }})
                        </button>
                      }
                    </div>

                    <!-- Info Note -->
                    <div class="text-[9px] text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 p-1.5 rounded flex items-start gap-1">
                      <span>El pago se aplicará automáticamente a las cuotas pendientes en orden de vencimiento</span>
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Selector de Cuota para Cancelación -->
            @if (isCancellationTypification() && (pendingInstallmentsForCancellation().length > 0 || overdueInstallments().length > 0)) {
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3 space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-lg">💰</span>
                  <div>
                    <h4 class="text-xs font-bold text-green-900 dark:text-green-100">Seleccionar Cuota a Cancelar</h4>
                    <p class="text-[9px] text-green-600 dark:text-green-300">Elija qué cuota de la promesa de pago está cancelando</p>
                  </div>
                </div>

                <!-- Cuotas disponibles para cancelar -->
                @if (pendingInstallmentsForCancellation().length > 0) {
                  <div class="space-y-1.5">
                    @for (cuota of pendingInstallmentsForCancellation(); track cuota.numeroCuota) {
                      <label
                        class="flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all"
                        [class]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-700'"
                      >
                        <div class="flex items-center gap-3">
                          <input
                            type="radio"
                            name="cuotaCancelacion"
                            [value]="cuota"
                            [checked]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota"
                            (change)="onSelectCuotaForCancellation(cuota)"
                            class="w-4 h-4 text-green-600"
                          />
                          <div>
                            <span class="font-bold text-xs">Cuota {{ cuota.numeroCuota }}</span>
                            <span class="text-[10px] ml-2" [class]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'">
                              Vence: {{ formatDate(cuota.dueDate) }}
                            </span>
                            @if (tienePagoParcial(cuota)) {
                              <span class="text-[9px] ml-1 px-1 py-0.5 rounded" [class]="selectedInstallmentForCancellation()?.numeroCuota === cuota.numeroCuota ? 'bg-green-400 text-white' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'">Parcial</span>
                            }
                          </div>
                        </div>
                        <div class="text-right">
                          @if (tienePagoParcial(cuota)) {
                            <span class="text-xs opacity-70 mr-1">S/ {{ cuota.monto?.toFixed(2) }}</span>
                            <span class="font-bold text-sm">S/ {{ getSaldoPendienteCuota(cuota).toFixed(2) }}</span>
                          } @else {
                            <span class="font-bold text-sm">S/ {{ cuota.monto?.toFixed(2) || '0.00' }}</span>
                          }
                        </div>
                      </label>
                    }
                  </div>
                }

                <!-- Cuotas VENCIDAS (no se pueden cancelar) -->
                @if (overdueInstallments().length > 0) {
                  <div class="mt-3 pt-3 border-t border-red-200 dark:border-red-800">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm">⛔</span>
                      <span class="text-[10px] font-bold text-red-700 dark:text-red-400">CUOTAS VENCIDAS (No se pueden cancelar)</span>
                    </div>
                    <div class="space-y-1">
                      @for (cuota of overdueInstallments(); track cuota.numeroCuota) {
                        <div class="flex items-center justify-between p-2 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 opacity-75">
                          <div class="flex items-center gap-3">
                            <span class="text-red-500 dark:text-red-400 text-xs">✗</span>
                            <div>
                              <span class="font-bold text-xs text-red-800 dark:text-red-300">Cuota {{ cuota.numeroCuota }}</span>
                              <span class="text-[10px] ml-2 text-red-600 dark:text-red-400">
                                Venció: {{ formatDate(cuota.dueDate) }}
                              </span>
                            </div>
                          </div>
                          <span class="font-bold text-sm text-red-700 dark:text-red-400">S/ {{ cuota.monto?.toFixed(2) || '0.00' }}</span>
                        </div>
                      }
                    </div>
                    <div class="text-[9px] text-red-600 dark:text-red-400 mt-2">
                      La fecha de pago ya pasó. Estas cuotas serán marcadas como promesa rota.
                    </div>
                  </div>
                }

                <!-- Mensaje cuando no hay cuotas disponibles para cancelar -->
                @if (pendingInstallmentsForCancellation().length === 0 && overdueInstallments().length > 0) {
                  <div class="text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded flex items-center gap-1">
                    <span>🚫</span>
                    <span>No hay cuotas disponibles para cancelar. Todas las cuotas están vencidas.</span>
                  </div>
                } @else if (!selectedInstallmentForCancellation() && pendingInstallmentsForCancellation().length > 0) {
                  <div class="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Debe seleccionar una cuota para registrar la cancelación</span>
                  </div>
                }

                <!-- Campos editables de monto y fecha cuando hay cuota seleccionada -->
                @if (selectedInstallmentForCancellation()) {
                  <div class="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm">✏️</span>
                      <span class="text-[10px] font-bold text-green-800 dark:text-green-300">Datos del Pago (editables)</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <!-- Monto pagado -->
                      <div>
                        <label class="block text-[10px] font-semibold text-green-700 dark:text-green-300 mb-1">Monto Pagado</label>
                        <div class="relative">
                          <span class="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400">S/</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            [value]="montoPagoEditable()"
                            (input)="onMontoPagoChange($event)"
                            class="w-full pl-7 pr-2 py-1.5 text-sm font-semibold rounded-lg border border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <p class="text-[10px] text-green-700 dark:text-green-300 mt-0.5 font-medium">
                          Pendiente: S/ {{ tienePagoParcial(selectedInstallmentForCancellation()) ? getSaldoPendienteCuota(selectedInstallmentForCancellation()).toFixed(2) : selectedInstallmentForCancellation()?.monto?.toFixed(2) }}
                        </p>
                      </div>
                      <!-- Fecha del pago -->
                      <div>
                        <label class="block text-[10px] font-semibold text-green-700 dark:text-green-300 mb-1">Fecha del Pago</label>
                        <input
                          type="date"
                          [value]="fechaPagoEditable()"
                          (input)="onFechaPagoChange($event)"
                          class="w-full px-2 py-1.5 text-sm rounded-lg border border-green-300 dark:border-green-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                        <p class="text-[9px] text-green-600 dark:text-green-400 mt-0.5">
                          Por defecto: hoy
                        </p>
                      </div>
                    </div>
                    <!-- Info de distribución si el monto es diferente -->
                    @if (montoPagoEditable() !== selectedInstallmentForCancellation()?.monto) {
                      <div class="mt-2 p-2 rounded-lg text-[10px]"
                           [class]="montoPagoEditable() < selectedInstallmentForCancellation()?.monto
                             ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                             : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'">
                        @if (montoPagoEditable() < selectedInstallmentForCancellation()?.monto) {
                          <span class="flex items-center gap-1">
                            <span>⚠️</span>
                            <span><strong>Pago parcial:</strong> La cuota quedará con saldo pendiente de S/ {{ (selectedInstallmentForCancellation()?.monto - montoPagoEditable()).toFixed(2) }}</span>
                          </span>
                        } @else {
                          <span class="flex items-center gap-1">
                            <span>ℹ️</span>
                            <span><strong>Pago mayor:</strong> El excedente de S/ {{ (montoPagoEditable() - selectedInstallmentForCancellation()?.monto).toFixed(2) }} se aplicará a las siguientes cuotas</span>
                          </span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- Botón para subir comprobante (opcional) -->
            @if (isCancellationTypification() && selectedInstallmentForCancellation()) {
              <div class="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-lg">📎</span>
                    <div>
                      <h4 class="text-xs font-bold text-purple-900 dark:text-purple-100">Comprobante de Pago</h4>
                      <p class="text-[9px] text-purple-600 dark:text-purple-300">Opcional: Sube una imagen del voucher para validación OCR</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    (click)="openComprobanteUploadDialog()"
                    class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                    [class]="uploadedComprobante()
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'"
                  >
                    @if (uploadedComprobante()) {
                      ✅ Comprobante Subido
                    } @else {
                      📤 Subir Comprobante
                    }
                  </button>
                </div>
                @if (uploadedComprobante()) {
                  <div class="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-[10px] space-y-1">
                    <p class="text-gray-600 dark:text-gray-400">{{ uploadedComprobante()?.mensaje }}</p>
                    @if (uploadedComprobante()?.ocrResult?.monto) {
                      <p><strong>Monto detectado:</strong> S/ {{ uploadedComprobante()?.ocrResult?.monto | number:'1.2-2' }}</p>
                    }
                    @if (uploadedComprobante()?.ocrResult?.banco) {
                      <p><strong>Banco:</strong> {{ uploadedComprobante()?.ocrResult?.banco }}</p>
                    }
                    <button
                      type="button"
                      (click)="uploadedComprobante.set(null)"
                      class="text-red-500 hover:text-red-700 text-[9px] underline"
                    >
                      Quitar comprobante
                    </button>
                  </div>
                }
              </div>
            }

            <!-- Botones de Acción - COMPACTOS -->
            <div class="flex gap-2 pt-2">
              @if (requiresAuthorization()) {
                <!-- Botón de Solicitar Autorización (cuando es monto personalizado) -->
                <button
                  (click)="openSupervisorSelectionModal()"
                  [disabled]="saving() || !isFormValid() || waitingForAuthorization()"
                  class="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  @if (waitingForAuthorization()) {
                    <span class="animate-pulse">⏳ Esperando Autorización...</span>
                  } @else {
                    🔐 Solicitar Autorización
                  }
                </button>
              } @else {
                <!-- Botón Normal de Guardar -->
                <button
                  (click)="saveManagement()"
                  [disabled]="saving() || !isFormValid() || (isCancellationTypification() && (pendingInstallmentsForCancellation().length > 0 || overdueInstallments().length > 0) && !selectedInstallmentForCancellation()) || (isCancellationTypification() && pendingInstallmentsForCancellation().length === 0 && overdueInstallments().length > 0)"
                  [title]="'Guardando: ' + saving() + ' | Válido: ' + isFormValid()"
                  class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  @if (saving()) {
                    Guardando...
                  } @else {
                    Guardar Gestión
                  }
                </button>
              }
              <button
                (click)="cancelarTipificacion()"
                class="px-6 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white dark:text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO - Resumen Deuda y Montos -->
        <div class="w-72 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          <!-- Resumen Rápido Deuda -->
          <div class="p-2 bg-red-100 dark:bg-red-950/20">
            <div class="text-center">
              <div class="text-[9px] uppercase font-bold" [ngClass]="themeService.isDarkMode() ? 'text-red-400' : 'text-red-800'">{{ getPrimaryAmountLabel() }}</div>
              <div class="text-xl font-black" [ngClass]="themeService.isDarkMode() ? 'text-red-400' : 'text-red-800'">{{ formatCurrency(getPrimaryAmountValue()) }}</div>
              <div class="text-[11px] font-semibold" [ngClass]="themeService.isDarkMode() ? 'text-orange-400' : 'text-orange-700'">{{ clientDiasMora() }} días mora</div>
            </div>
          </div>

          <!-- Montos de la Cuenta -->
          <div class="p-2 flex-1 overflow-y-auto">
            @if (clientAmountFields().length > 0) {
              <div class="space-y-1.5">
                @for (field of clientAmountFields(); track field.field; let i = $index) {
                  <div class="flex justify-between items-center py-1 px-2 rounded text-xs"
                       [class]="getAmountRowClass(i)">
                    <span class="truncate mr-2 font-medium" [ngClass]="themeService.isDarkMode() ? 'text-red-300' : 'text-red-800'">{{ field.label }}</span>
                    <span class="font-bold whitespace-nowrap text-sm" [ngClass]="themeService.isDarkMode() ? 'text-red-300' : 'text-red-800'">
                      {{ formatCurrency(field.value) }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
        </div>

        <!-- SECCION DE HISTORIAL DE GESTIONES - Compacto -->
        <div class="h-44 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex flex-col transition-colors duration-300">
          <div class="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-sm">📋</span>
              <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200">Historial de Gestiones</h3>
              <span class="text-[10px] text-slate-500 dark:text-slate-400">({{ historialGestiones().length }} registros)</span>
            </div>
            <button (click)="loadManagementHistory()" class="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <span>↻</span> Actualizar
            </button>
          </div>
          <div class="flex-1 overflow-auto">
            @if (historialGestiones().length === 0) {
              <div class="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-xs">
                Sin gestiones registradas para este cliente
              </div>
            } @else {
              <table class="w-full text-[10px]">
                <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0">
                  <tr class="text-left text-slate-600 dark:text-slate-300">
                    <th class="px-2 py-1 font-semibold">Fecha</th>
                    <th class="px-2 py-1 font-semibold">Agente</th>
                    <th class="px-2 py-1 font-semibold">Tipificación</th>
                    <th class="px-2 py-1 font-semibold">Canal</th>
                    <th class="px-2 py-1 font-semibold">Método</th>
                    <th class="px-2 py-1 font-semibold">Duración</th>
                    <th class="px-2 py-1 font-semibold">Observación</th>
                    <th class="px-2 py-1 font-semibold text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (gestion of historialGestiones(); track gestion.id) {
                    <tr class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ gestion.fecha }}</td>
                      <td class="px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium whitespace-nowrap">{{ gestion.nombreAgente }}</td>
                      <td class="px-2 py-1.5 max-w-[200px]">
                        <span class="text-blue-600 dark:text-blue-400 font-medium truncate block" [title]="gestion.tipificacionCompleta">
                          {{ gestion.tipificacionCompleta }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5">
                        <span [class]="'px-1.5 py-0.5 rounded text-[9px] font-semibold ' +
                          (gestion.canal === 'LLAMADA' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                           gestion.canal === 'WHATSAPP' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                           'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                          {{ gestion.canal }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5">
                        <span [class]="'px-1.5 py-0.5 rounded text-[9px] font-semibold ' +
                          (gestion.metodo === 'OUTBOUND' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                           gestion.metodo === 'INBOUND' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                           'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                          {{ gestion.metodo }}
                        </span>
                      </td>
                      <td class="px-2 py-1.5 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">{{ gestion.duracion }}</td>
                      <td class="px-2 py-1.5 text-slate-500 dark:text-slate-400 max-w-[150px] truncate" [title]="gestion.observacion">
                        {{ gestion.observacion }}
                      </td>
                      <td class="px-2 py-1.5 text-center">
                        @if (gestion.hasSchedule) {
                          <button (click)="openScheduleDetail(gestion.id)"
                            class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[9px] font-semibold hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors">
                            📅 Cronograma
                          </button>
                        } @else {
                          <span class="text-slate-400 dark:text-slate-600">-</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            }
          </div>
        </div>
      </div>

      <!-- Modal de Cronograma Detallado -->
      @if (showScheduleDetail() && scheduleManagementId()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-slideInUp">
            <!-- Header del modal -->
            <div class="bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white px-6 py-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div>
                  <h2 class="text-lg font-bold">Cronograma de Pagos</h2>
                  <p class="text-sm opacity-90">Gestión {{ scheduleManagementId() }}</p>
                </div>
              </div>
              <button
                type="button"
                (click)="closeScheduleDetail()"
                class="p-2 hover:bg-white/20 rounded-lg transition-colors">
              </button>
            </div>

            <!-- Contenido del modal -->
            <div class="flex-1 overflow-y-auto p-6">
              <app-payment-schedule-view [managementId]="scheduleManagementId()!" />
            </div>

            <!-- Footer del modal -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                (click)="closeScheduleDetail()"
                class="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300
                       hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Modal de Selección de Supervisor para Autorización -->
      <app-select-supervisor-modal
        [(visible)]="showSupervisorModal"
        (supervisorSelected)="onSupervisorSelected($event)"
        (cancelled)="onSupervisorSelectionCancelled()">
      </app-select-supervisor-modal>
    </div>
  `,
  styles: [`
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CollectionManagementPage implements OnInit, OnDestroy {
  protected callActive = signal(false);
  protected callDuration = signal(0);
  protected saving = signal(false);
  protected showScheduleDetail = signal(false);
  protected scheduleManagementId = signal<number | null>(null);
  protected showOutputSelector = false; // Para el dropdown de campos del cliente
  protected errors = signal<ValidationErrors>({});
  protected showSuccess = signal(false);
  protected animateEntry = signal(true);
  protected activeTab = signal('cliente');
  protected isTipifying = signal(false); // Bloquea llamadas entrantes durante tipificación

  // Signals para indicador de umbral de tiempo (reloj de alarma)
  protected colorIndicador = signal<'verde' | 'amarillo' | 'rojo'>('verde');
  protected excedeTiempoMaximo = signal(false);
  private agentStatusSubscription?: Subscription;

  // Signals para autorización de montos personalizados
  protected requiresAuthorization = signal(false);
  protected waitingForAuthorization = signal(false);
  showSupervisorModal = false;
  private currentAuthorizationData: CrearSolicitudRequest | null = null;

  protected historialGestiones = signal<Array<{
    id: number;
    fecha: string;
    asesor: string;
    nombreAgente: string;
    resultado: string;
    gestion: string;
    tipificacionCompleta: string;
    canal: string;
    metodo: string;
    observacion: string;
    duracion: string;
    hasSchedule: boolean;
    schedule: any;
  }>>([]);

  selectedTenantId?: number;
  selectedPortfolioId?: number;
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];

  // Testing fields
  testDocument = '';
  testPhone = '';

  // Configuración de outputs del cliente
  customerOutputFields = signal<any[]>([]);

  campaign = computed(() => this.systemConfigService.getCampaign());
  contactClassifications = computed(() => this.systemConfigService.getContactClassifications());
  managementClassifications = computed(() => this.apiSystemConfigService.getManagementClassificationsForUI());

  managementClassificationsHierarchical = computed(() => {
    const all: any[] = this.managementClassifications() as any[];
    const byId = new Map<string, any>();
    const children = new Map<string, any[]>();

    all.forEach((item: any) => {
      const itemId = String(item.id);
      byId.set(itemId, item);
      children.set(itemId, []);
    });

    all.forEach((item: any) => {
      if (item.parentId) {
        const parentIdStr = String(item.parentId);
        const childList = children.get(parentIdStr);
        if (childList) {
          childList.push(item);
        }
      }
    });

    const flatten = (items: any[], level: number = 0): any[] => {
      const flattened: any[] = [];
      items.forEach((item: any) => {
        flattened.push({
          ...item,
          indentLevel: level,
          displayLabel: '  '.repeat(level) + (level > 0 ? '└─ ' : '') + `[${item.codigo}] ${item.label}`
        });
        const itemIdStr = String(item.id);
        const itemChildren = children.get(itemIdStr) || [];
        if (itemChildren.length > 0) {
          flattened.push(...flatten(itemChildren, level + 1));
        }
      });
      return flattened;
    };

    const roots = all.filter((item: any) => !item.parentId);
    return flatten(roots, 0);
  });

  paymentMethods = computed(() => this.systemConfigService.getPaymentMethods());
  scheduleTypes = computed(() => this.systemConfigService.getScheduleConfig().tipos_cronograma);
  periodicities = computed(() => this.systemConfigService.getScheduleConfig().periodicidades);

  // Computed para obtener los montos disponibles del cliente (de la tabla ini_*)
  // Respeta la configuración del admin: si hay config, solo muestra las habilitadas
  // Usa nombres visuales de montoCabeceras como fuente de verdad
  customerPaymentAmounts = computed<AmountOption[]>(() => {
    const rawData = this.rawClientData();
    const enabledOptions = this.enabledPaymentOptions();
    const hasConfig = this.hasPaymentOptionsConfig();
    const cabeceras = this.montoCabeceras();

    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('[PAYMENT] No raw client data available');
      return [];
    }

    // Crear mapa de código -> nombre visual desde cabeceras
    const codigoToNombre = new Map<string, string>();
    for (const c of cabeceras) {
      codigoToNombre.set(c.codigo.toLowerCase(), c.nombre);
    }

    const amounts: AmountOption[] = [];

    // Si hay configuración en el mantenimiento, solo mostrar las opciones habilitadas
    if (hasConfig) {
      // Solo incluir los campos que están en enabledOptions
      for (const option of enabledOptions) {
        // Handle "personalizado" option specially - add as custom option marker
        if (option.codigoOpcion === 'personalizado') {
          amounts.push({
            label: 'Otro monto',
            value: -1, // Special marker for custom amount
            field: 'personalizado',
            generaCartaAcuerdo: option.generaCartaAcuerdo || false
          });
          continue;
        }

        const fieldName = option.campoTablaDinamica;
        if (!fieldName) continue;

        // Find the value in rawData (case-insensitive)
        const rawKey = Object.keys(rawData).find(k => k.toLowerCase() === fieldName.toLowerCase());
        if (!rawKey) continue;

        const value = rawData[rawKey];
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));

        // Include if value is valid number (including 0, but not NaN)
        if (!isNaN(numValue) && numValue >= 0) {
          // Prioridad: 1) nombre de cabeceras, 2) labelOpcion del backend, 3) formatFieldLabel
          const visualName = codigoToNombre.get(fieldName.toLowerCase())
            || option.labelOpcion
            || this.formatFieldLabel(fieldName);

          amounts.push({
            label: visualName,
            value: numValue,
            field: fieldName,
            restriccionFecha: option.restriccionFecha || 'SIN_RESTRICCION',
            generaCartaAcuerdo: option.generaCartaAcuerdo || false
          });
        }
      }

      console.log('[PAYMENT] Amounts from CONFIG (enabled only):', amounts.length);
    } else {
      // No hay configuración: usar montoCabeceras si están disponibles
      if (cabeceras.length > 0) {
        // Usar solo los campos definidos en cabeceras (montos reales)
        for (const cabecera of cabeceras) {
          const lowerCodigo = cabecera.codigo.toLowerCase();
          const value = rawData[lowerCodigo] ?? rawData[cabecera.codigo];

          if (value !== undefined && value !== null) {
            const numValue = typeof value === 'number' ? value : parseFloat(value);
            if (!isNaN(numValue) && numValue >= 0) {
              amounts.push({
                label: cabecera.nombre,
                value: numValue,
                field: lowerCodigo,
                generaCartaAcuerdo: false
              });
            }
          }
        }
        console.log('[PAYMENT] Amounts FALLBACK (from cabeceras):', amounts.length);
      } else {
        // Sin cabeceras ni config: no mostrar nada para evitar datos incorrectos
        console.log('[PAYMENT] No config and no cabeceras - showing empty');
      }
    }

    // Ordenar por valor descendente (montos más altos primero, pero "personalizado" va al final)
    amounts.sort((a, b) => {
      if (a.field === 'personalizado') return 1;
      if (b.field === 'personalizado') return -1;
      return b.value - a.value;
    });

    return amounts;
  });

  tabs = [
    { id: 'cliente', label: 'Cliente', icon: 'user' },
    { id: 'historial', label: 'Historial', icon: 'history' }
  ];

  managementForm: ManagementForm = {
    resultadoContacto: '',
    tipoGestion: '',
    clasificacionNivel1: '',
    clasificacionNivel2: '',
    clasificacionNivel3: '',
    motivoNoPago: '',
    metodoPago: '',
    montoPago: '',
    fechaCompromiso: '',
    horaCompromiso: '',
    ultimos4Tarjeta: '',
    bancoSeleccionado: '',
    observaciones: '',
    notasPrivadas: ''
  };

  selectedClassifications = signal<string[]>([]);
  dynamicFields = signal<any[]>([]);
  dynamicFieldValues = signal<any>({});
  isLoadingDynamicFields = signal(false);
  isLeafClassification = signal(false);
  dynamicFieldsSchema = signal<MetadataSchema | null>(null);
  externalFieldUpdates = signal<any>({}); // Para comunicar actualizaciones externas al componente hijo

  // ViewChild para acceder al componente de campos dinámicos
  @ViewChild('dynamicFieldRendererComponent') dynamicFieldRenderer?: DynamicFieldRendererComponent;

  // Payment schedule signals
  activeSchedules = signal<any[]>([]);
  isLoadingSchedules = signal(false);
  showScheduleHelper = signal(false);

  // Computed para obtener la clasificación seleccionada actual con sus propiedades de tipo
  selectedClassification = computed<ManagementClassification | null>(() => {
    const selectedIds = this.selectedClassifications();
    if (selectedIds.length === 0) return null;

    const lastSelectedId = selectedIds[selectedIds.length - 1];
    if (!lastSelectedId) return null;

    const allTypifications = this.managementClassifications();
    const found = allTypifications.find((c: any) => String(c.id) === String(lastSelectedId));

    // DEBUG: Log para verificar las propiedades
    if (found) {
      console.log('[DEBUG] Selected typification:', found);
      console.log('[DEBUG] suggestsFullAmount:', found.suggestsFullAmount);
      console.log('[DEBUG] allowsInstallmentSelection:', found.allowsInstallmentSelection);
      console.log('[DEBUG] requiresManualAmount:', found.requiresManualAmount);
    }

    return found as ManagementClassification || null;
  });

  // Computed para determinar si el formulario es válido y completo para habilitar el botón guardar
  isFormValid = computed(() => {
    // 1. Verificar clasificación seleccionada
    if (this.usesHierarchicalClassifications()) {
      // Sistema jerárquico: verificar que se haya seleccionado al menos una clasificación
      const selected = this.selectedClassifications();

      if (selected.length === 0 || !selected[selected.length - 1]) {
        console.log('[isFormValid] ❌ No hay clasificación seleccionada');
        return false;
      }

      // Verificar que no haya más niveles disponibles (no debe haber hijos)
      const lastSelectedId = selected[selected.length - 1];
      const all: any[] = this.managementClassifications() as any[];
      const hasChildren = all.some((c: any) => c.parentId && Number(c.parentId) === Number(lastSelectedId));

      // Solo es válido si no hay hijos disponibles
      if (hasChildren) {
        console.log('[isFormValid] ❌ Aún hay niveles por seleccionar, lastSelectedId:', lastSelectedId);
        return false;
      }
      console.log('[isFormValid] ✅ Clasificación completa:', selected);
    } else {
      // Sistema simple: verificar resultado de contacto
      if (!this.managementForm.resultadoContacto) {
        return false;
      }
    }

    // 2. Verificar campos dinámicos requeridos
    const schema = this.dynamicFieldsSchema();
    const dynamicValues = this.dynamicFieldValues();

    console.log('[isFormValid] Schema:', schema);
    console.log('[isFormValid] Dynamic Values:', dynamicValues);

    if (schema && schema.fields && schema.fields.length > 0) {
      for (const field of schema.fields) {
        if (field.required) {
          const value = dynamicValues[field.id];
          console.log(`[isFormValid] Campo '${field.id}' (required=${field.required}): valor='${value}'`);

          // Campo vacío
          if (value === undefined || value === null || value === '') {
            console.log(`[isFormValid] ❌ Campo requerido '${field.id}' está vacío`);
            return false;
          }

          // Tabla sin filas
          if (field.type === 'table') {
            if (!Array.isArray(value) || value.length === 0) {
              console.log(`[isFormValid] ❌ Tabla '${field.id}' sin filas`);
              return false;
            }
          }
        }
      }
    }

    console.log('[isFormValid] ✅ Formulario válido!');
    return true;
  });

  hierarchyLevels = computed(() => {
    const all: any[] = this.managementClassifications() as any[];
    const selected = this.selectedClassifications();
    const levels: any[][] = [];

    console.log('[hierarchyLevels] Total classifications:', all.length);
    console.log('[hierarchyLevels] Selected:', selected);

    const roots = all.filter(c => c.hierarchyLevel === 1 || !c.parentId);
    console.log('[hierarchyLevels] Nivel 1 (roots):', roots.length, roots.map((r: any) => `${r.codigo} (ID:${r.id})`));

    if (roots.length > 0) {
      levels.push(roots);
    }

    for (let i = 0; i < selected.length; i++) {
      const parentId = selected[i];
      console.log(`[hierarchyLevels] Buscando hijos del nivel ${i+1}, parentId:`, parentId);

      if (parentId) {
        const children = all.filter((c: any) => c.parentId && Number(c.parentId) === Number(parentId));
        console.log(`[hierarchyLevels] Encontrados ${children.length} hijos:`, children.map((c: any) => `${c.codigo} (ID:${c.id}, parent:${c.parentId})`));

        if (children.length > 0) {
          levels.push(children);
        } else {
          console.log(`[hierarchyLevels] No se encontraron hijos, deteniendo búsqueda`);
          break;
        }
      }
    }

    console.log('[hierarchyLevels] Total niveles construidos:', levels.length);
    return levels;
  });

  scheduleForm = {
    numeroCuotas: '',
    montoCuota: '',
    periodicidad: '',
    fechaPrimeraCuota: '',
    tipoCronograma: '',
    montoInicial: '',
    montoNegociado: '', // Para tipo Financiera
    cuotas: [] as Array<{numero: number, monto: string, fechaVencimiento: string}>
  };

  customerData = signal<CustomerData>({
    id_cliente: 'CLI-2025-0087453',
    nombre_completo: 'GARCÍA RODRIGUEZ, CARMEN ROSA',
    tipo_documento: 'DNI',
    numero_documento: '45621378',
    fecha_nacimiento: '15/03/1985',
    edad: 40,
    contacto: {
      telefono_principal: '+51 987 654 321',
      telefono_alternativo: '+51 945 123 456',
      telefono_trabajo: '+51 01 4567890',
      email: 'carmen.garcia@email.com',
      direccion: 'Av. Los Álamos 458, Dpto 302, San Borja, Lima',
    },
    cuenta: {
      numero_cuenta: '****5678',
      tipo_producto: 'Préstamo Personal',
      fecha_desembolso: '15/01/2024',
      monto_original: 15000.00,
      plazo_meses: 24,
      tasa_interes: 18.5,
    },
    deuda: {
      saldo_capital: 8750.50,
      intereses_vencidos: 456.78,
      mora_acumulada: 234.50,
      gastos_cobranza: 120.00,
      saldo_total: 9561.78,
      dias_mora: 45,
      fecha_ultimo_pago: '15/10/2024',
      monto_ultimo_pago: 458.33,
    }
  });

  // Cronogramas de pago activos
  activePaymentSchedules = signal<any[]>([]);

  // Cuota seleccionada para cancelación/pago
  selectedInstallmentForCancellation = signal<any | null>(null);

  // Campos editables para el pago
  montoPagoEditable = signal<number>(0);
  fechaPagoEditable = signal<string>('');

  // Comprobante subido para la cancelación (opcional)
  uploadedComprobante = signal<ComprobanteUploadResponse | null>(null);

  // Computed para detectar si la tipificación seleccionada es de tipo Cancelación (código CA)
  isCancellationTypification = computed(() => {
    const selected = this.selectedClassification();
    if (!selected) return false;
    // Detectar por código "CA" o por label que contenga "CANCELACION"
    return selected.codigo === 'CA' ||
           selected.label?.toUpperCase().includes('CANCELACION') ||
           selected.label?.toUpperCase().includes('CANCELACIÓN');
  });

  // Computed para obtener las cuotas pendientes de todas las promesas activas
  // IMPORTANTE: Solo incluye cuotas que pueden ser canceladas (fecha de pago >= hoy)
  pendingInstallmentsForCancellation = computed(() => {
    const schedules = this.activePaymentSchedules();
    const allPending: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalizar a inicio del día

    for (const schedule of schedules) {
      if (schedule.installments) {
        for (const cuota of schedule.installments) {
          // El backend usa PAGADA/CANCELADA, no PAGADO/CANCELADO
          const estado = cuota.status?.toUpperCase();
          if (estado !== 'PAGADA' && estado !== 'PAGADO' && estado !== 'CUMPLIDO' && estado !== 'CANCELADA' && estado !== 'CANCELADO' && estado !== 'VENCIDA' && estado !== 'VENCIDO') {
            // Validar que la fecha de pago no haya pasado
            const fechaPago = cuota.dueDate || cuota.fechaPago;
            if (fechaPago) {
              // Usar parseDateLocal para evitar bug de timezone
              const fechaPagoDate = this.parseDateLocal(fechaPago);
              // Solo incluir si la fecha de pago es hoy o futura
              if (fechaPagoDate >= today) {
                allPending.push({
                  ...cuota,
                  scheduleId: schedule.id,
                  grupoPromesaUuid: schedule.grupoPromesaUuid
                });
              }
            }
          }
        }
      }
    }

    return allPending;
  });

  // Computed para obtener cuotas VENCIDAS (fecha de pago pasada, no se pueden cancelar)
  overdueInstallments = computed(() => {
    const schedules = this.activePaymentSchedules();
    const overdue: any[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const schedule of schedules) {
      if (schedule.installments) {
        for (const cuota of schedule.installments) {
          const estado = cuota.status?.toUpperCase();
          // Cuotas pendientes con fecha vencida o cuotas ya marcadas como VENCIDA
          if (estado === 'VENCIDA' || estado === 'VENCIDO') {
            overdue.push({
              ...cuota,
              scheduleId: schedule.id,
              grupoPromesaUuid: schedule.grupoPromesaUuid
            });
          } else if (estado === 'PENDIENTE') {
            const fechaPago = cuota.dueDate || cuota.fechaPago;
            if (fechaPago) {
              // Usar parseDateLocal para evitar bug de timezone
              const fechaPagoDate = this.parseDateLocal(fechaPago);
              // Si la fecha de pago ya pasó, está vencida
              if (fechaPagoDate < today) {
                overdue.push({
                  ...cuota,
                  scheduleId: schedule.id,
                  grupoPromesaUuid: schedule.grupoPromesaUuid
                });
              }
            }
          }
        }
      }
    }

    return overdue;
  });

  // Raw client data from ini_* table (to detect all numeric columns dynamically)
  rawClientData = signal<Record<string, any>>({});

  // Computed para extraer campos de MONTOS del cliente para mostrar en panel de negociación
  // Usa las cabeceras configuradas para filtrar solo montos reales (decimal) y mostrar nombres visuales
  clientAmountFields = computed(() => {
    const rawData = this.rawClientData();
    const cabeceras = this.montoCabeceras();
    const amountFields: { label: string; value: number; field: string }[] = [];

    // Si tenemos cabeceras configuradas, usarlas para filtrar solo montos
    if (cabeceras.length > 0) {
      for (const cabecera of cabeceras) {
        const lowerCodigo = cabecera.codigo.toLowerCase();
        const value = rawData[lowerCodigo] ?? rawData[cabecera.codigo];

        if (value !== undefined && value !== null) {
          const numValue = typeof value === 'number' ? value : parseFloat(value);
          if (!isNaN(numValue)) {
            amountFields.push({
              label: cabecera.nombre,  // Usar nombre visual de la cabecera
              value: numValue,
              field: lowerCodigo
            });
          }
        }
      }
    } else {
      // Fallback: si no hay cabeceras, usar lógica anterior pero con exclusiones estrictas
      const excludeFields = [
        'id', 'id_campana', 'id_cartera', 'id_subcartera', 'prioridad', 'estado',
        'documento', 'num_cuenta', 'num_cuenta_pmcp', 'numero_cuenta',
        'periodo', 'edad', 'dias_mora', 'dias_mora_asig',
        'telefono_celular', 'telefono_domicilio', 'telefono_laboral',
        'telf_referencia_1', 'telf_referencia_2'
      ];

      for (const [key, value] of Object.entries(rawData)) {
        const lowerKey = key.toLowerCase();
        // Excluir campos que empiezan con fec_, fecha_, telefono_, telf_
        if (lowerKey.startsWith('fec_') || lowerKey.startsWith('fecha_')) continue;
        if (lowerKey.startsWith('telefono_') || lowerKey.startsWith('telf_')) continue;
        // Excluir campos específicos
        if (excludeFields.includes(lowerKey)) continue;

        const numValue = typeof value === 'number' ? value : parseFloat(value);
        if (!isNaN(numValue) && numValue >= 0) {
          amountFields.push({
            label: this.formatFieldLabel(key),
            value: numValue,
            field: key
          });
        }
      }
    }

    // Ordenar por valor descendente (mayores primero)
    return amountFields.sort((a, b) => b.value - a.value);
  });

  // Computed para obtener días de mora del cliente
  clientDiasMora = computed(() => {
    const rawData = this.rawClientData();
    const diasMora = rawData['dias_mora'] || rawData['dias_mora_asig'] || 0;
    return typeof diasMora === 'number' ? diasMora : parseInt(diasMora) || 0;
  });

  // Cabeceras de configuración para mostrar nombres visuales
  montoCabeceras = signal<{ codigo: string; nombre: string; tipoDato: string; tipoSql: string }[]>([]);

  // Enabled payment amount options (configured in maintenance)
  enabledPaymentOptions = signal<CampoOpcionDTO[]>([]);
  paymentScheduleFieldId = signal<number | null>(null);
  // Flag to indicate if payment options have been configured (even if all are disabled)
  hasPaymentOptionsConfig = signal<boolean>(false);

  private callTimer?: number;
  private managementId?: string;
  private callStartTime?: string;

  private callStateSubscription?: Subscription;
  private incomingCallSubscription?: Subscription;
  private outgoingCallSubscription?: Subscription;
  public callState: CallState = CallState.IDLE;
  public isMuted = signal(false);
  private incomingPhoneNumber: string | null = null;
  private outgoingPhoneNumber: string | null = null;

  constructor(
    private systemConfigService: SystemConfigService,
    private managementService: ManagementService,
    private paymentScheduleService: PaymentScheduleService,
    public themeService: ThemeService,
    private classificationService: TypificationService,
    private typificationV2Service: TypificationV2Service,
    private apiSystemConfigService: ApiSystemConfigService,
    private customerOutputConfigService: CustomerOutputConfigService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sipService: SipService,
    private agentService: AgentService,
    private agentStatusService: AgentStatusService,
    private authService: AuthService,
    private autorizacionService: AutorizacionService,
    private recordatoriosService: RecordatoriosService,
    private dialog: MatDialog,
    private comprobanteService: ComprobanteService,
    private cartaAcuerdoService: CartaAcuerdoService
  ) {}

  ngOnInit() {
    this.loadTenants();
    this.loadManagementHistory();

    // Verificar estado inicial de la llamada
    const initialCallState = this.sipService.getCallState();
    console.log('📞 [CollectionManagement] Estado inicial de llamada:', initialCallState);

    if (initialCallState === CallState.ACTIVE && !this.callActive()) {
      console.log('⏱️ Llamada ya está activa, iniciando timer automáticamente...');
      this.callActive.set(true);
      this.startCall(); // Iniciar timer automáticamente
    }

    // Suscribirse a cambios de estado de llamada
    this.callStateSubscription = this.sipService.onCallStatus.subscribe((state: CallState) => {
      console.log('📞 [CollectionManagement] Estado de llamada:', state);
      this.callState = state;

      // Cuando la llamada se activa, cambiar estado a EN_LLAMADA
      if (state === CallState.ACTIVE && !this.callActive()) {
        this.callActive.set(true);
        this.startCall(); // Iniciar timer
        // Cambiar estado del agente a EN_LLAMADA
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.id) {
          this.agentService.changeAgentStatus(currentUser.id, { estado: AgentState.EN_LLAMADA }).subscribe({
            next: () => console.log('✅ Estado cambiado a EN_LLAMADA'),
            error: (err: any) => console.error('❌ Error cambiando estado:', err)
          });
        }
      }

      // Cuando la llamada termina, SIEMPRE cambiar estado a TIPIFICANDO
      // El agente debe quedarse en la pantalla para completar la tipificación
      if ((state === CallState.ENDED || state === CallState.IDLE) && this.callActive()) {
        this.callActive.set(false);

        // INMEDIATAMENTE bloquear llamadas entrantes ANTES de cambiar estado en backend
        // Esto previene la race condition con el auto-dialer
        this.isTipifying.set(true);
        this.sipService.blockIncomingCallsMode(true);
        console.log('🚫 Bloqueando llamadas entrantes - agente en tipificación');

        // Obtener la duración de la llamada antes de detener el timer
        const finalDuration = this.callDuration();

        // Detener timer
        if (this.callTimer) {
          clearInterval(this.callTimer);
          this.callTimer = undefined;
        }

        // SIEMPRE cambiar a TIPIFICANDO cuando termina una llamada
        // El agente debe completar el formulario antes de volver a DISPONIBLE
        console.log(`📝 Llamada terminada (${finalDuration}s), cambiando a TIPIFICANDO`);
        const currentUser = this.authService.getCurrentUser();
        if (currentUser?.id) {
          this.agentService.changeAgentStatus(currentUser.id, { estado: AgentState.TIPIFICANDO }).subscribe({
            next: () => console.log('✅ Estado cambiado a TIPIFICANDO - agente debe completar formulario'),
            error: (err: any) => console.error('❌ Error cambiando estado:', err)
          });
        }
      }
    });

    // Suscribirse a llamadas entrantes para cargar automáticamente el cliente
    this.incomingCallSubscription = this.sipService.onIncomingCall.subscribe((callInfo: { from: string }) => {
      console.log('📲 [CollectionManagement] Llamada entrante de:', callInfo.from);
      this.incomingPhoneNumber = callInfo.from;

      // Buscar y cargar automáticamente el cliente por su número de teléfono
      if (callInfo.from) {
        this.autoLoadCustomerByPhone(callInfo.from);
      }
    });

    // Suscribirse a llamadas SALIENTES (desde /dialer manual) para cargar automáticamente el cliente
    this.outgoingCallSubscription = this.sipService.onOutgoingCall.subscribe((callInfo: { to: string }) => {
      console.log('📤 [CollectionManagement] Llamada saliente a:', callInfo.to);
      this.outgoingPhoneNumber = callInfo.to;

      // Buscar y cargar automáticamente el cliente por el número al que se llama
      if (callInfo.to) {
        this.autoLoadCustomerByPhone(callInfo.to);
      }
    });

    // Verificar si hay una llamada saliente en curso (navegación desde /dialer)
    // El evento onOutgoingCall ya se emitió antes de navegar aquí, así que leemos el número guardado
    const pendingOutgoingNumber = this.sipService.getCurrentOutgoingNumber();
    // Verificar que no hay cliente REAL cargado (customerData tiene datos mock por defecto,
    // pero sin 'id' numérico). Un cliente real tiene 'id' del backend.
    if (pendingOutgoingNumber && !this.customerData()?.id) {
      console.log('📤 [CollectionManagement] Llamada saliente pendiente detectada:', pendingOutgoingNumber);
      this.outgoingPhoneNumber = pendingOutgoingNumber;
      this.autoLoadCustomerByPhone(pendingOutgoingNumber);
      // Limpiar para evitar cargar de nuevo si el usuario navega de vuelta
      this.sipService.clearCurrentOutgoingNumber();
    }

    // Verificar si viene desde gestión manual con parámetros de cliente
    this.route.queryParams.subscribe(params => {
      if (params['source'] === 'manual' && params['documento']) {
        console.log('📋 [MANUAL] Cargando cliente desde gestión manual:', params);
        this.loadCustomerByDocumentoFromManual(
          params['documento'],
          Number(params['tenantId']),
          Number(params['portfolioId']),
          Number(params['subPortfolioId'])
        );
      }
    });

    // Suscribirse a respuestas de autorización
    this.autorizacionService.respuesta$.subscribe(solicitud => {
      if (solicitud && this.waitingForAuthorization()) {
        this.handleAuthorizationResponse(solicitud);
      }
    });

    // Iniciar polling del estado del agente para el indicador de umbral de tiempo
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      this.agentStatusSubscription = this.agentStatusService.startStatusPolling(currentUser.id).subscribe({
        next: (response) => {
          // Actualizar indicadores de umbral de tiempo
          if (response.colorIndicador) {
            this.colorIndicador.set(response.colorIndicador);
          }
          this.excedeTiempoMaximo.set(response.excedeTiempoMaximo || false);
        },
        error: (err) => console.error('❌ Error polling estado del agente:', err)
      });
    }
  }

  /**
   * Busca y carga automáticamente un cliente por su número de teléfono
   * Se llama cuando llega una llamada entrante
   * Busca en todos los tenants/carteras/subcarteras
   */
  private autoLoadCustomerByPhone(phoneNumber: string) {
    console.log('🔍 [AUTO-LOAD] Buscando cliente por teléfono:', phoneNumber);

    this.customerService.searchCustomersAcrossAllTenants('telefono', phoneNumber).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          console.log('✅ [AUTO-LOAD] Cliente encontrado:', customers[0]);
          this.loadCustomerFromResource(customers[0]);
        } else {
          console.warn('⚠️ [AUTO-LOAD] No se encontró cliente con teléfono:', phoneNumber);
          // Opcional: mostrar notificación al usuario
        }
      },
      error: (error) => {
        console.error('❌ [AUTO-LOAD] Error buscando cliente:', error);
      }
    });
  }

  /**
   * Carga un cliente por documento desde la gestión manual
   * Busca en la tabla dinámica ini_ de la subcartera especificada
   */
  private loadCustomerByDocumentoFromManual(
    documento: string,
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number
  ) {
    console.log('🔍 [MANUAL] Buscando cliente por documento:', documento);

    // Establecer el contexto de tenant/portfolio/subportfolio para las tipificaciones
    this.selectedTenantId = tenantId;
    this.selectedPortfolioId = portfolioId;
    this.selectedSubPortfolioId = subPortfolioId;
    this.reloadTypifications();
    this.loadCustomerOutputConfig();

    // Buscar cliente en la tabla dinámica
    this.http.get<any>(`${environment.apiUrl}/client-search/find`, {
      params: {
        tenantId: tenantId.toString(),
        portfolioId: portfolioId.toString(),
        subPortfolioId: subPortfolioId.toString(),
        documento: documento
      }
    }).pipe(
      catchError((error) => {
        console.error('❌ [MANUAL] Error buscando cliente:', error);
        return of(null);
      })
    ).subscribe({
      next: (clientData) => {
        if (clientData) {
          console.log('✅ [MANUAL] Cliente encontrado:', clientData);
          this.loadCustomerFromDynamicTable(clientData);
        } else {
          console.warn('⚠️ [MANUAL] Cliente no encontrado');
        }
      }
    });
  }

  /**
   * Carga los datos de un cliente desde la tabla dinámica ini_
   * @param client Datos del cliente desde la tabla dinámica
   * IMPORTANTE: Siempre usa client.id (ini_*.id) para consistencia entre flujos
   */
  private loadCustomerFromDynamicTable(client: any) {
    // Guardar los datos raw del cliente para detectar columnas numéricas dinámicamente
    this.rawClientData.set(client);
    console.log('[CUSTOMER] Raw client data from ini_* table:', client);

    // Cargar cabeceras de montos para esta subcartera
    this.loadMontoCabeceras();

    // SIEMPRE usar client.id (ini_*.id) - es consistente entre llamada activa y gestión manual
    const customerId = client.id || 0;
    console.log('[CUSTOMER] Using ini_*.id as customerId:', customerId);

    // Mapear los datos de la tabla dinámica al formato de CustomerData
    this.customerData.set({
      id: customerId,
      id_cliente: client.documento,
      nombre_completo: client.nombre || client.nombres + ' ' + (client.apellidos || ''),
      tipo_documento: 'DNI',
      numero_documento: client.documento,
      fecha_nacimiento: '',
      edad: 0,
      contacto: {
        telefono_principal: client.telefono_celular || client.telefono_principal || client.telefono || client.telefono_1 || '',
        telefono_alternativo: client.telefono_domicilio || client.telefono_secundario || client.telefono_2 || '',
        telefono_trabajo: client.telefono_laboral || client.telefono_trabajo || client.telefono_3 || '',
        email: client.email || '',
        direccion: client.direccion || ''
      },
      cuenta: {
        numero_cuenta: client.cuenta || '',
        tipo_producto: client.producto || 'PRÉSTAMO',
        fecha_desembolso: '',
        monto_original: client.monto_original || 0,
        plazo_meses: 0,
        tasa_interes: 0
      },
      deuda: {
        saldo_capital: client.deuda_capital || 0,
        intereses_vencidos: 0,
        mora_acumulada: client.deuda_mora || 0,
        gastos_cobranza: 0,
        saldo_total: (client.deuda_capital || 0) + (client.deuda_mora || 0),
        dias_mora: client.dias_mora || 0,
        fecha_ultimo_pago: '',
        monto_ultimo_pago: 0
      }
    });

    // Cargar historial de gestiones
    this.loadManagementHistory();

    // Cargar promesas de pago activas usando el customerId correcto
    if (customerId) {
      this.loadActivePaymentSchedules(customerId);
    }

    console.log('✅ Cliente cargado exitosamente, customerId:', customerId);
  }

  /**
   * Carga las cabeceras de montos desde configuracion_cabeceras para mostrar nombres visuales
   */
  private loadMontoCabeceras() {
    if (!this.selectedSubPortfolioId) {
      console.warn('[CABECERAS] No hay subcartera seleccionada');
      return;
    }

    console.log('[CABECERAS] Cargando cabeceras de montos para subcartera:', this.selectedSubPortfolioId);

    this.managementService.getMontoCabeceras(this.selectedSubPortfolioId).pipe(
      catchError(error => {
        console.error('[CABECERAS] Error cargando cabeceras:', error);
        return of([]);
      })
    ).subscribe(cabeceras => {
      console.log('[CABECERAS] Cabeceras cargadas:', cabeceras);
      this.montoCabeceras.set(cabeceras.map(c => ({
        codigo: c.codigo,
        nombre: c.nombre,
        tipoDato: c.tipoDato,
        tipoSql: c.tipoSql
      })));
    });
  }

  // Variable para almacenar el subPortfolioId seleccionado
  selectedSubPortfolioId?: number;

  loadTenants() {
    const currentUser = this.authService.getCurrentUser();
    console.log('[V2] Usuario actual:', currentUser);

    if (currentUser?.tenantId && currentUser?.portfolioId && currentUser?.subPortfolioId) {
      this.selectedTenantId = currentUser.tenantId;
      this.selectedPortfolioId = currentUser.portfolioId;
      this.selectedSubPortfolioId = currentUser.subPortfolioId;
      console.log(`[V2] Usando asignación del usuario: tenant=${this.selectedTenantId}, portfolio=${this.selectedPortfolioId}, subPortfolio=${this.selectedSubPortfolioId}`);

      // Cargar datos SIN llamar a onTenantChange (que resetea portfolioId)
      this.reloadTypifications();
      this.loadCustomerOutputConfig();
      this.loadFirstCustomer();
    } else {
      console.error('[V2] Usuario no tiene asignación completa de tenant/portfolio/subportfolio');
      console.error('[V2] Valores recibidos:', {
        tenantId: currentUser?.tenantId,
        portfolioId: currentUser?.portfolioId,
        subPortfolioId: currentUser?.subPortfolioId
      });
    }
  }

  onTenantChange() {
    this.selectedPortfolioId = undefined;
    this.portfolios = [];

    if (this.selectedTenantId) {
      this.loadPortfolios();
      this.reloadTypifications();
      this.loadCustomerOutputConfig();
      this.loadFirstCustomer(); // Cargar el primer cliente del tenant
    }
  }

  loadPortfolios() {
    if (!this.selectedTenantId) return;

    this.classificationService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
      next: (data) => {
        this.portfolios = data;
      },
      error: (error) => {
        console.error('Error loading portfolios:', error);
      }
    });
  }

  onPortfolioChange() {
    this.reloadTypifications();
    this.loadCustomerOutputConfig();
  }

  reloadTypifications() {
    if (!this.selectedTenantId) return;

    this.apiSystemConfigService.setTenantAndPortfolio(
      this.selectedTenantId,
      this.selectedPortfolioId,
      this.selectedSubPortfolioId
    );
  }

  /**
   * Carga la configuración de outputs del cliente desde el backend
   *
   * LÓGICA:
   * 1. Llama a GET /api/v1/customer-outputs/config?tenantId=X&portfolioId=Y
   * 2. Backend SIEMPRE retorna 200 OK (nunca 404)
   * 3. Si id === null → No hay configuración guardada → Usar campos por defecto
   * 4. Si id !== null → Hay configuración guardada → Usar esos campos (incluso si fieldsConfig="[]")
   *
   * DIFERENCIA IMPORTANTE:
   * - id=null, fieldsConfig="[]": No existe config en BD → Mostrar campos DEFAULT
   * - id=123, fieldsConfig="[]": Existe config vacía → Admin configuró NO mostrar nada
   */
  loadCustomerOutputConfig() {
    if (!this.selectedTenantId) return;

    // TEMPORAL: El endpoint customer-outputs/config no existe aún
    // Usar directamente los campos por defecto
    console.log('[TEMPORAL] loadCustomerOutputConfig - endpoint no existe, usando campos por defecto');
    this.setDefaultOutputFields();
    return;

    /* COMENTADO TEMPORALMENTE - endpoint no existe
    this.customerOutputConfigService.getConfiguration(this.selectedTenantId, this.selectedPortfolioId)
      .pipe(
        catchError((error) => {
          console.error('Error cargando configuración:', error);
          this.setDefaultOutputFields();
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          if (!response) return; // Si hubo error, ya se manejó en catchError

          // Verificar si existe configuración en BD
          if (response.id === null) {
            // No hay configuración guardada → usar campos por defecto
            this.setDefaultOutputFields();
            return;
          }

          // Hay configuración guardada → usar esos campos (incluso si está vacío)
          try {
            const fields = JSON.parse(response.fieldsConfig);
            // Filtrar solo campos visibles y ordenar
            const visibleFields = fields
              .filter((f: any) => f.isVisible)
              .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

            this.customerOutputFields.set(visibleFields);
          } catch (error) {
            console.error('Error parseando fieldsConfig:', error);
            this.setDefaultOutputFields();
          }
        }
      });
    */
  }

  /**
   * Carga el cliente de la llamada activa del agente
   * MODIFICADO: Ahora consulta la llamada activa y carga ese contacto dinámicamente
   */
  loadFirstCustomer() {
    // Obtener el usuario actual con su extensión SIP
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.sipExtension) {
      console.error('❌ No se pudo obtener la extensión SIP del agente logueado');
      // Fallback a contacto de prueba
      this.loadClienteDetalle(475);
      return;
    }

    console.log(`📋 Buscando llamada activa del agente con extensión SIP ${currentUser.sipExtension}...`);

    // Primero obtener la llamada activa del agente usando su extensión SIP
    this.http.get<any>(`${environment.gatewayUrl}/autodialer/active-call/extension/${currentUser.sipExtension}`).pipe(
      catchError((error) => {
        console.warn('⚠️ No hay llamada activa o error consultando:', error);
        // Si no hay llamada activa, usar contacto de prueba (475)
        console.log('📋 Usando contacto de prueba 475');
        return of({ contactId: 475 });
      })
    ).subscribe({
      next: (activeCall) => {
        const contactId = activeCall?.contactId;

        if (!contactId) {
          console.warn('⚠️ No se obtuvo contactId de la llamada activa');
          return;
        }

        console.log(`✅ Llamada activa encontrada, contactId: ${contactId}`);
        this.loadClienteDetalle(contactId);
      }
    });
  }

  /**
   * Carga los datos del cliente desde el backend
   * MODIFICADO: Ahora usa el mismo servicio que la búsqueda manual para obtener datos completos
   */
  private loadClienteDetalle(contactId: number) {
    console.log(`📋 Cargando datos del cliente para contacto ${contactId}...`);

    // Primero obtener info básica del contacto para conseguir el documento
    this.http.get<any>(`${environment.gatewayUrl}/contacts/${contactId}/cliente-detalle`).pipe(
      catchError((error) => {
        console.error('❌ Error cargando datos del cliente:', error);
        return of(null);
      })
    ).subscribe({
      next: (clienteDetalle) => {
        if (clienteDetalle && clienteDetalle.documento) {
          console.log('✅ Cliente básico cargado, documento:', clienteDetalle.documento);

          // Obtener tenant, portfolio y subportfolio del usuario actual
          const currentUser = this.authService.getCurrentUser();
          const tenantId = currentUser?.tenantId;
          const portfolioId = currentUser?.portfolioId;
          const subPortfolioId = currentUser?.subPortfolioId;

          if (!tenantId || !portfolioId || !subPortfolioId) {
            console.error('❌ No se pudo obtener asignación completa del usuario:', { tenantId, portfolioId, subPortfolioId });
            // Fallback: usar datos limitados del clienteDetalle
            this.loadClienteDetalleFallback(clienteDetalle);
            return;
          }

          // Usar el endpoint /api/client-search/find que retorna datos COMPLETOS de la tabla dinámica
          console.log(`🔍 Buscando datos completos del cliente con documento ${clienteDetalle.documento} en tenant ${tenantId}, portfolio ${portfolioId}, subportfolio ${subPortfolioId}...`);
          this.customerService.findClientByDocumento(tenantId, portfolioId, subPortfolioId, clienteDetalle.documento).subscribe({
            next: (clienteCompleto) => {
              if (clienteCompleto) {
                console.log('✅ Datos completos del cliente obtenidos:', clienteCompleto);
                // Usar loadCustomerFromDynamicTable - siempre usa ini_*.id
                this.loadCustomerFromDynamicTable(clienteCompleto);
              } else {
                console.warn('⚠️ No se encontró cliente con documento:', clienteDetalle.documento);
                // Fallback: usar datos limitados del clienteDetalle
                this.loadClienteDetalleFallback(clienteDetalle);
              }
            },
            error: (error) => {
              console.error('❌ Error buscando datos completos del cliente:', error);
              // Fallback: usar datos limitados del clienteDetalle
              this.loadClienteDetalleFallback(clienteDetalle);
            }
          });
        } else {
          console.log('⚠️ No se pudieron cargar los datos del cliente');
        }
      }
    });
  }

  /**
   * Fallback: carga datos limitados del cliente cuando no se puede obtener datos completos
   * ADVERTENCIA: En este modo NO tenemos el ini_*.id, las gestiones pueden no guardarse correctamente
   * @param clienteDetalle Datos básicos del cliente
   */
  private loadClienteDetalleFallback(clienteDetalle: any) {
    console.warn('⚠️ FALLBACK: No se pudo obtener datos de tabla dinámica');
    console.warn('⚠️ Las gestiones guardadas pueden no tener el ID correcto del cliente');

    // Guardar los datos raw del cliente
    this.rawClientData.set(clienteDetalle);
    console.log('[FALLBACK] Raw client data from detalle:', clienteDetalle);

    // Cargar cabeceras de montos para esta subcartera
    this.loadMontoCabeceras();

    // FALLBACK: usar clienteDetalle.idCliente (NO es ini_*.id, puede causar inconsistencias)
    const customerId = clienteDetalle.idCliente || 0;
    console.warn('[FALLBACK] Using clienteDetalle.idCliente as customerId:', customerId, '(NOT ini_*.id)');

    // Mapear los datos del backend al formato del signal
    this.customerData.set({
      id: customerId,
      id_cliente: `CLI-${clienteDetalle.idCliente}`,
      nombre_completo: clienteDetalle.nombreCompleto || '',
      tipo_documento: clienteDetalle.tipoDocumento || 'DNI',
      numero_documento: clienteDetalle.documento || '',
      fecha_nacimiento: clienteDetalle.fechaNacimiento || '',
      edad: clienteDetalle.edad || 0,
      contacto: {
        telefono_principal: clienteDetalle.telefonoPrincipal || '',
        telefono_alternativo: clienteDetalle.telefonoSecundario || '',
        telefono_trabajo: clienteDetalle.telefonoTrabajo || '',
        email: clienteDetalle.email || '',
        direccion: clienteDetalle.direccion || ''
      },
      cuenta: {
        numero_cuenta: clienteDetalle.cuenta || '',
        tipo_producto: clienteDetalle.producto || '',
        fecha_desembolso: '',
        monto_original: 0,
        plazo_meses: 0,
        tasa_interes: 0
      },
      deuda: {
        saldo_capital: clienteDetalle.deudaCapital || 0,
        intereses_vencidos: 0,
        mora_acumulada: 0,
        gastos_cobranza: 0,
        saldo_total: clienteDetalle.deudaTotal || 0,
        dias_mora: clienteDetalle.diasMora || 0,
        fecha_ultimo_pago: '',
        monto_ultimo_pago: 0
      }
    });

    console.warn('⚠️ Datos del cliente cargados en modo FALLBACK, customerId:', customerId);

    // 📅 Cargar cronogramas de promesas de pago activos (puede no encontrar resultados correctos)
    this.loadActivePaymentSchedules(customerId);
  }

  /**
   * Carga los cronogramas de promesas de pago activos para un cliente
   */
  private loadActivePaymentSchedules(customerId: number) {
    console.log(`📅 Cargando cronogramas activos para cliente ${customerId}...`);

    this.paymentScheduleService.getActiveSchedulesByCustomer(customerId).pipe(
      catchError((error) => {
        console.warn('⚠️ Error cargando cronogramas activos:', error);
        return of([]);
      })
    ).subscribe({
      next: (records: any[]) => {
        console.log('✅ Registros de promesas cargados:', records);

        if (!records || records.length === 0) {
          this.activePaymentSchedules.set([]);
          return;
        }

        // El backend devuelve cabeceras con cuotasPromesa incluidas
        // Cada record es una cabecera con su lista de cuotas
        const schedules = records.map((header: any) => {
          const cuotasPromesa = header.cuotasPromesa || [];

          // Ordenar cuotas por número
          cuotasPromesa.sort((a: any, b: any) => (a.numeroCuota || 1) - (b.numeroCuota || 1));

          // Calcular monto total sumando todas las cuotas (usando montoPromesa del backend)
          const totalAmount = cuotasPromesa.reduce((sum: number, c: any) => sum + (c.montoPromesa || c.monto || 0), 0);

          // Encontrar cuotas pendientes (excluir PAGADAS, VENCIDAS y CANCELADAS)
          // VENCIDA = promesa rota, el cliente puede crear una nueva
          const pendingCuotas = cuotasPromesa.filter((c: any) =>
            c.estado !== 'PAGADA' && c.estado !== 'PAGADO' && c.estado !== 'CUMPLIDO' &&
            c.estado !== 'CANCELADA' && c.estado !== 'VENCIDA'
          );
          const nextCuota = pendingCuotas[0] || cuotasPromesa[0];

          return {
            id: header.grupoPromesaUuid || header.id,
            grupoPromesaUuid: header.grupoPromesaUuid,
            totalAmount: totalAmount || header.montoPromesa,
            numberOfInstallments: header.totalCuotas || cuotasPromesa.length,
            fechaGestion: header.fechaGestion,
            installments: cuotasPromesa.map((c: any) => ({
              id: c.id,
              numeroCuota: c.numeroCuota,
              monto: c.montoPromesa || c.monto,
              montoPromesa: c.montoPromesa || c.monto,
              // La fecha de pago viene de CuotaPromesa.fechaPromesa
              dueDate: c.fechaPromesa || c.fechaPago || null,
              fechaPromesa: c.fechaPromesa || c.fechaPago,
              status: c.estado || 'PENDIENTE',
              montoPagadoReal: c.montoPagadoReal || 0
            })),
            nextDueDate: nextCuota?.fechaPromesa || nextCuota?.fechaPago,
            cuotasPendientes: pendingCuotas.length
          };
        });

        // Filtrar solo cronogramas que tienen al menos una cuota pendiente
        const activeSchedules = schedules.filter((s: any) => s.cuotasPendientes > 0);

        console.log('📅 Cronogramas transformados:', schedules);
        console.log('📅 Cronogramas activos (con cuotas pendientes):', activeSchedules);
        this.activePaymentSchedules.set(activeSchedules);

        if (activeSchedules.length > 0) {
          console.log(`📅 ¡Cliente tiene ${activeSchedules.length} promesa(s) de pago activa(s)!`);
        }
      }
    });
  }

  /**
   * Establece campos por defecto cuando no hay configuración guardada
   */
  private setDefaultOutputFields() {
    this.customerOutputFields.set([
      { id: 'numero_documento', label: 'DNI/Documento', field: 'numero_documento', category: 'personal', format: 'text', highlight: true, size: 'medium' },
      { id: 'nombre_completo', label: 'Nombre Completo', field: 'nombre_completo', category: 'personal', format: 'text', highlight: false, size: 'full' },
      { id: 'telefono_principal', label: 'Celular', field: 'contacto.telefono_principal', category: 'contact', format: 'text', highlight: false, size: 'medium' },
      { id: 'email', label: 'Email', field: 'contacto.email', category: 'contact', format: 'text', highlight: false, size: 'medium' },
      { id: 'direccion', label: 'Dirección', field: 'contacto.direccion', category: 'contact', format: 'text', highlight: false, size: 'full' }
    ]);
  }

  loadManagementHistory() {
    // Usar documento en lugar de ID para buscar el historial
    // El documento es el identificador único real del cliente
    const documento = this.customerData()?.numero_documento;
    if (!documento) {
      console.log('[HISTORIAL] No hay documento del cliente, omitiendo carga de historial');
      return;
    }
    console.log('[HISTORIAL] Cargando historial para documento:', documento);

    this.managementService.getManagementsByDocumento(documento).subscribe({
      next: (managements) => {
        console.log('[HISTORIAL] Gestiones recibidas del backend:', managements);
        console.log('[HISTORIAL] Total de gestiones:', managements.length);

        // Mapear gestiones y cargar cronogramas
        const historial = managements.map(m => {
          // Formatear fecha y hora desde los campos de la gestión
          const fechaHora = m.managementDate && m.managementTime
            ? `${m.managementDate} ${m.managementTime}`
            : new Date().toLocaleString('es-PE');

          // Construir ruta completa de tipificación
          const tipificacionParts = [m.level1Name, m.level2Name, m.level3Name, m.level4Name].filter(Boolean);
          const tipificacionCompleta = tipificacionParts.join(' > ') || '-';

          // Formatear duración
          const duracionSeg = m.duracionSegundos || 0;
          const duracionFormatted = this.formatTime(duracionSeg);

          const historyItem = {
            id: m.id,
            fecha: fechaHora,
            asesor: m.advisorId,
            nombreAgente: m.nombreAgente || `Agente ${m.advisorId}`,
            resultado: 'Gestión realizada',
            gestion: m.level3Name || m.level2Name || m.level1Name || '-',
            tipificacionCompleta: tipificacionCompleta,
            canal: m.canalContacto || 'N/A',
            metodo: m.metodoContacto || 'N/A',
            observacion: m.observations || 'Sin observaciones',
            duracion: duracionFormatted,
            hasSchedule: m.typificationRequiresSchedule || false,
            schedule: null as any
          };

          // Cargar cronograma si existe
          if (historyItem.hasSchedule) {
            this.paymentScheduleService.getPaymentScheduleByManagementId(m.id).subscribe({
              next: (schedule) => {
                if (schedule) {
                  historyItem.schedule = schedule;
                }
              },
              error: () => {
                // Silenciar error si no hay cronograma
              }
            });
          }

          return historyItem;
        });

        this.historialGestiones.set(historial);
        console.log('[HISTORIAL] Historial establecido en signal:', this.historialGestiones());
      },
      error: (error) => {
        console.error('[HISTORIAL] Error al cargar historial de gestiones:', error);
        console.error('[HISTORIAL] Detalles del error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
      }
    });
  }

  private formatDateTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  private calculateCallDuration(callDetail: any): string {
    if (!callDetail.durationSeconds) {
      return '00:00:00';
    }
    return this.formatTime(callDetail.durationSeconds);
  }

  /**
   * Calcula la duración de la llamada en segundos desde callStartTime hasta ahora
   */
  private calculateCallDurationSeconds(): number {
    if (!this.callStartTime) return 0;
    const startTime = new Date(this.callStartTime).getTime();
    const now = new Date().getTime();
    return Math.floor((now - startTime) / 1000);
  }

  ngOnDestroy() {
    if (this.callTimer) {
      clearInterval(this.callTimer);
    }

    // IMPORTANTE: Desbloquear llamadas si el componente se destruye
    // Esto cubre el caso cuando el usuario navega fuera sin guardar
    if (this.isTipifying()) {
      this.isTipifying.set(false);
      this.sipService.blockIncomingCallsMode(false);
      console.log('🔓 [ngOnDestroy] Desbloqueando llamadas entrantes al salir del componente');
    }

    // Limpiar suscripciones
    if (this.callStateSubscription) {
      this.callStateSubscription.unsubscribe();
    }
    if (this.incomingCallSubscription) {
      this.incomingCallSubscription.unsubscribe();
    }
    if (this.outgoingCallSubscription) {
      this.outgoingCallSubscription.unsubscribe();
    }
    if (this.agentStatusSubscription) {
      this.agentStatusSubscription.unsubscribe();
    }
  }

  cancelarTipificacion() {
    console.log('❌ Cancelando tipificación...');

    // Desbloquear llamadas entrantes
    this.isTipifying.set(false);
    this.sipService.blockIncomingCallsMode(false);
    console.log('🔓 Desbloqueando llamadas entrantes - tipificación cancelada');

    // Cambiar estado a DISPONIBLE y LUEGO navegar
    const currentUser = this.authService.getCurrentUser();
    const agentId = currentUser?.id || 1;
    this.agentService.changeAgentStatus(agentId, { estado: AgentState.DISPONIBLE }).subscribe({
      next: () => {
        console.log('✅ Estado cambiado a DISPONIBLE, navegando al agent-dashboard...');
        // Navegar DESPUÉS de cambiar el estado exitosamente
        this.router.navigate(['/agent-dashboard']);
      },
      error: (error) => {
        console.error('❌ Error al cambiar estado:', error);
        // Navegar igual aunque falle el cambio de estado
        this.router.navigate(['/agent-dashboard']);
      }
    });
  }

  protected openScheduleDetail(managementId: number) {
    this.scheduleManagementId.set(managementId);
    this.showScheduleDetail.set(true);
  }

  protected closeScheduleDetail() {
    this.showScheduleDetail.set(false);
    this.scheduleManagementId.set(null);
  }

  // ===== MÉTODOS DE AUTORIZACIÓN PARA MONTOS PERSONALIZADOS =====

  /**
   * Detecta cuando el usuario selecciona un monto personalizado en el cronograma de pagos
   */
  onCustomAmountDetected(isCustom: boolean): void {
    console.log('🔐 [Authorization] Custom amount detected:', isCustom);
    this.requiresAuthorization.set(isCustom);
    if (!isCustom) {
      this.waitingForAuthorization.set(false);
      this.currentAuthorizationData = null;
    }
  }

  /**
   * Abre el modal de selección de supervisor para solicitar autorización
   */
  openSupervisorSelectionModal(): void {
    console.log('📋 [Authorization] Opening supervisor selection modal');

    // Preparar los datos de la solicitud antes de abrir el modal
    const dynamicValues = this.dynamicFieldValues();
    const schema = this.dynamicFieldsSchema();
    let paymentScheduleData = null;

    if (schema && schema.fields) {
      const paymentScheduleField = schema.fields.find(f => f.type === 'payment_schedule');
      if (paymentScheduleField && dynamicValues[paymentScheduleField.id]) {
        paymentScheduleData = dynamicValues[paymentScheduleField.id];
      }
    }

    if (!paymentScheduleData) {
      alert('⚠️ No hay datos de cronograma de pago para autorizar');
      return;
    }

    const currentUser = this.authService.getCurrentUser();

    // Obtener tipificación seleccionada
    const selectedClassifs = this.selectedClassifications();
    const allTypifications = this.managementClassifications();
    const lastSelectedId = selectedClassifs[selectedClassifs.length - 1];
    const selectedTypification = allTypifications.find((c: any) => c.id.toString() === lastSelectedId);

    const nombreAgente = currentUser
      ? `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.username
      : 'Agente';

    this.currentAuthorizationData = {
      idTenant: this.selectedTenantId!,
      idCartera: this.selectedPortfolioId,
      idSubcartera: this.selectedSubPortfolioId,
      idAgenteSolicitante: currentUser?.id || 0,
      nombreAgente: nombreAgente,
      idSupervisor: 0, // Se completará cuando seleccione supervisor
      idCliente: this.customerData().id || 0,
      nombreCliente: this.customerData().nombre_completo || '',
      documentoCliente: this.customerData().numero_documento || '',
      idTipificacion: selectedTypification?.id ? Number(selectedTypification.id) : 0,
      nombreTipificacion: selectedTypification?.label || '',
      montoTotal: paymentScheduleData.montoTotal,
      numeroCuotas: paymentScheduleData.numeroCuotas,
      campoMontoOrigen: paymentScheduleData.campoMontoOrigen,
      montoBase: paymentScheduleData.montoBase,  // Monto original del campo (antes de excepción)
      cuotas: paymentScheduleData.cuotas.map((c: any) => ({
        numeroCuota: c.numeroCuota,
        monto: c.monto,
        fechaPago: c.fechaPago
      })),
      observacionesAgente: this.managementForm.observaciones || 'Solicitud de monto personalizado'
    };

    this.showSupervisorModal = true;
  }

  /**
   * Callback cuando el agente selecciona un supervisor
   */
  onSupervisorSelected(supervisor: SupervisorEnLinea): void {
    console.log('👤 [Authorization] Supervisor selected:', supervisor);
    this.showSupervisorModal = false;

    if (!this.currentAuthorizationData) {
      console.error('❌ No authorization data prepared');
      return;
    }

    // Agregar el ID del supervisor a la solicitud
    const solicitudCompleta: CrearSolicitudRequest = {
      ...this.currentAuthorizationData,
      idSupervisor: supervisor.idUsuario
    };

    // Enviar la solicitud
    this.autorizacionService.crearSolicitud(solicitudCompleta).subscribe({
      next: (solicitud) => {
        console.log('✅ [Authorization] Request created:', solicitud);
        this.waitingForAuthorization.set(true);
        // Mostrar mensaje de espera
        alert(`📤 Solicitud enviada a ${supervisor.nombreCompleto}\n\nEsperando autorización...`);
      },
      error: (error) => {
        console.error('❌ [Authorization] Error creating request:', error);
        alert('❌ Error al enviar la solicitud de autorización');
      }
    });
  }

  /**
   * Callback cuando el agente cancela la selección de supervisor
   */
  onSupervisorSelectionCancelled(): void {
    console.log('❌ [Authorization] Supervisor selection cancelled');
    this.showSupervisorModal = false;
  }

  /**
   * Maneja la respuesta de autorización (aprobada o rechazada)
   */
  private handleAuthorizationResponse(solicitud: SolicitudAutorizacion): void {
    console.log('📬 [Authorization] Response received:', solicitud);
    this.waitingForAuthorization.set(false);

    if (solicitud.estado === 'APROBADA') {
      // Autorización aprobada - guardar automáticamente
      alert('✅ ¡Autorización APROBADA!\n\nGuardando gestión automáticamente...');
      this.requiresAuthorization.set(false); // Desactivar para que el guardado sea normal
      this.saveManagement(); // Guardar la gestión
    } else if (solicitud.estado === 'RECHAZADA') {
      // Autorización rechazada - mostrar mensaje
      const motivo = solicitud.comentariosSupervisor || 'Sin motivo especificado';
      alert(`❌ Autorización RECHAZADA\n\nMotivo: ${motivo}\n\nPuede modificar los datos y volver a solicitar autorización.`);
    } else if (solicitud.estado === 'EXPIRADA') {
      alert('⏰ La solicitud de autorización ha expirado.\n\nPuede volver a solicitarla seleccionando otro supervisor.');
    }
  }

  toggleCall() {
    if (this.callActive()) {
      this.endCall();
    } else {
      this.startCall();
    }
  }

  startCall() {
    this.callActive.set(true);
    this.callDuration.set(0);
    this.callStartTime = new Date().toISOString();

    this.callTimer = window.setInterval(() => {
      this.callDuration.update(duration => duration + 1);
    }, 1000);
  }

  endCall(navigate: boolean = false) {
    console.log('📵 Finalizando llamada...');

    // Colgar la llamada SIP
    this.sipService.hangup();

    // Detener el timer
    this.callActive.set(false);
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = undefined;
    }

    // NO navegar - el agente debe quedarse en tipificación
    // Solo navegará cuando guarde la gestión (onSaveSuccess)
    if (navigate) {
      this.router.navigate(['/agent-dashboard']);
    }
  }

  formatTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  onContactResultChange() {
    this.managementForm.tipoGestion = '';
    this.managementForm.motivoNoPago = '';
  }

  onManagementTypeChange() {
  }

  showManagementType(): boolean {
    return this.managementForm.resultadoContacto === 'CPC' || this.managementForm.resultadoContacto === 'CTT';
  }

  usesHierarchicalClassifications(): boolean {
    const levels = this.hierarchyLevels();
    return levels.length > 0 && levels[0].length > 0;
  }

  getTypificationsForLevel(levelIndex: number): any[] {
    const levels = this.hierarchyLevels();
    return levels[levelIndex] || [];
  }

  onClassificationLevelChange(levelIndex: number, value: string) {
    const newSelections = [...this.selectedClassifications()];
    newSelections[levelIndex] = value;

    this.selectedClassifications.set(newSelections.slice(0, levelIndex + 1));

    if (levelIndex === 0) {
      this.managementForm.clasificacionNivel1 = value;
      this.managementForm.clasificacionNivel2 = '';
      this.managementForm.clasificacionNivel3 = '';
    } else if (levelIndex === 1) {
      this.managementForm.clasificacionNivel2 = value;
      this.managementForm.clasificacionNivel3 = '';
    } else if (levelIndex === 2) {
      this.managementForm.clasificacionNivel3 = value;
    }

    if (value) {
      this.managementForm.tipoGestion = value;
      const numValue = Number(value);
      if (!isNaN(numValue) && numValue > 0) {
        this.loadDynamicFields(numValue);
      } else {
        this.dynamicFields.set([]);
        this.dynamicFieldValues.set({});
        this.isLeafClassification.set(false);
      }
    } else {
      const lastValid = this.selectedClassifications().filter(v => v).pop();
      this.managementForm.tipoGestion = lastValid || '';
      this.dynamicFields.set([]);
      this.dynamicFieldValues.set({});
      this.isLeafClassification.set(false);
    }
  }

  private loadDynamicFields(typificationId: number) {
    // Cargar campos dinámicos desde el backend
    this.isLoadingDynamicFields.set(true);
    this.apiSystemConfigService.getClassificationFields(typificationId).subscribe({
      next: (response) => {
        this.isLeafClassification.set(response.isLeaf);
        this.dynamicFields.set(response.fields || []);

        // Convertir campos del backend al formato MetadataSchema
        // Los tipos ya vienen en lowercase desde el backend, no necesitan conversión
        const fieldConfigs: FieldConfig[] = (response.fields || []).map((field: any, index: number) => {
          return {
          id: field.fieldCode,
          label: field.fieldName,
          type: field.fieldType.toLowerCase(), // Asegurar lowercase por compatibilidad
          required: field.isRequired || false,
          placeholder: field.description || '',
          helpText: field.description,
          displayOrder: field.displayOrder || 0,
          // Para campos select, mapear options
          options: field.options ? field.options.map((opt: any) => {
            if (typeof opt === 'string') {
              return { value: opt, label: opt };
            }
            return { value: opt.value || opt, label: opt.label || opt };
          }) : undefined,
          min: field.validationRules?.min,
          max: field.validationRules?.max,
          minLength: field.validationRules?.minLength,
          maxLength: field.validationRules?.maxLength,
          // Para campos tipo tabla, incluir columnas
          columns: field.fieldType.toLowerCase() === 'table' && field.columns ? field.columns.map((col: any) => ({
            id: col.id || col.fieldCode,
            label: col.label || col.fieldName,
            type: (col.type || col.fieldType).toLowerCase(), // Asegurar lowercase
            required: col.required || col.isRequired || false,
            // Para columnas tipo select, mapear options
            options: col.options ? col.options.map((opt: any) => {
              if (typeof opt === 'string') {
                return { value: opt, label: opt };
              }
              return { value: opt.value || opt, label: opt.label || opt };
            }) : undefined
          })) : undefined,
          allowAddRow: field.fieldType.toLowerCase() === 'table',
          allowDeleteRow: field.fieldType.toLowerCase() === 'table',
          minRows: field.minRows || 0,
          maxRows: field.maxRows,
          // For table fields, copy linkedToField property if present
          ...(field.linkedToField && { linkedToField: field.linkedToField })
          };
        });

        const schema: MetadataSchema = {
          fields: fieldConfigs
        };

        this.dynamicFieldsSchema.set(schema);
        this.isLoadingDynamicFields.set(false);

        // Check if there's a payment_schedule field and load its enabled options
        const paymentScheduleField = (response.fields || []).find((f: any) =>
          f.fieldType.toLowerCase() === 'payment_schedule'
        );
        if (paymentScheduleField && paymentScheduleField.id) {
          this.paymentScheduleFieldId.set(paymentScheduleField.id);
          this.loadEnabledPaymentOptions(paymentScheduleField.id);
        } else {
          this.paymentScheduleFieldId.set(null);
          this.enabledPaymentOptions.set([]);
          this.hasPaymentOptionsConfig.set(false);
        }

        // Check if this is a payment typification and load schedules
        this.checkAndLoadPaymentSchedules();
      },
      error: (error) => {
        console.error('Error cargando campos dinámicos:', error);
        this.isLoadingDynamicFields.set(false);
        this.isLeafClassification.set(false);
        this.dynamicFields.set([]);
        this.dynamicFieldsSchema.set(null);
      }
    });
  }

  /**
   * Loads enabled payment options for a payment_schedule field
   * Uses getOpcionesCampo to get ALL options (to know if config exists)
   * then filters to only show enabled ones
   */
  private loadEnabledPaymentOptions(fieldId: number) {
    console.log('[PAYMENT] Loading options for field ID:', fieldId);

    // Get ALL options (enabled and disabled) to know if config exists
    this.typificationV2Service.getOpcionesCampo(fieldId).subscribe({
      next: (allOpciones) => {
        // If there are any options in DB, config has been initialized
        const hasConfig = allOpciones && allOpciones.length > 0;
        this.hasPaymentOptionsConfig.set(hasConfig);

        // Filter only enabled options
        const enabledOpciones = hasConfig
          ? allOpciones.filter(o => o.estaHabilitada)
          : [];

        console.log('[PAYMENT] Options config exists:', hasConfig, '| Total:', allOpciones?.length || 0, '| Enabled:', enabledOpciones.length);
        this.enabledPaymentOptions.set(enabledOpciones);
      },
      error: (error) => {
        console.warn('[PAYMENT] Error loading options, showing all amounts:', error);
        // If error, assume no config exists → show all amounts
        this.hasPaymentOptionsConfig.set(false);
        this.enabledPaymentOptions.set([]);
      }
    });
  }

  /**
   * Checks if the current selected typification requires payment
   * and loads active schedules if needed
   */
  private checkAndLoadPaymentSchedules() {
    // Get the currently selected typification
    const selected = this.selectedClassifications();
    if (selected.length === 0) {
      this.showScheduleHelper.set(false);
      return;
    }

    const lastSelectedId = selected[selected.length - 1];
    const allTypifications = this.managementClassifications();
    const currentClass = allTypifications.find((c: any) => c.id.toString() === lastSelectedId);

    // Check if this typification requires payment (codes: PC, PT, PP, PPT)
    if (currentClass && currentClass.requiere_pago) {
      console.log('[SCHEDULE] Payment typification detected:', currentClass.codigo);
      console.log('[DEBUG-SCHEDULE] Full typification object:', currentClass);
      console.log('[DEBUG-SCHEDULE] suggestsFullAmount:', currentClass.suggestsFullAmount);
      console.log('[DEBUG-SCHEDULE] allowsInstallmentSelection:', currentClass.allowsInstallmentSelection);
      console.log('[DEBUG-SCHEDULE] requiresManualAmount:', currentClass.requiresManualAmount);
      this.loadActiveSchedules();
    } else {
      this.showScheduleHelper.set(false);
      this.activeSchedules.set([]);
    }
  }

  /**
   * Loads active payment schedules for the current customer
   */
  private loadActiveSchedules() {
    // Usar documento en lugar de ID para buscar cronogramas
    const documento = this.customerData()?.numero_documento;
    if (!documento) {
      console.log('[SCHEDULE] No hay documento del cliente, omitiendo carga de cronogramas');
      return;
    }
    console.log('[SCHEDULE] Loading active schedules for documento:', documento);

    this.isLoadingSchedules.set(true);
    this.managementService.getActiveSchedulesByDocumento(documento).subscribe({
      next: (schedules) => {
        console.log('[SCHEDULE] Active schedules loaded:', schedules);
        this.activeSchedules.set(schedules);
        this.showScheduleHelper.set(schedules.length > 0);
        this.isLoadingSchedules.set(false);

        // Auto-suggest payment amount from next pending installment
        if (schedules.length > 0) {
          this.suggestPaymentAmount(schedules[0]);
        }
      },
      error: (error) => {
        console.error('[SCHEDULE] Error loading schedules:', error);
        this.isLoadingSchedules.set(false);
        this.showScheduleHelper.set(false);
      }
    });
  }

  /**
   * Suggests payment amount based on next pending installment
   */
  private suggestPaymentAmount(schedule: any) {
    if (!schedule.installments || schedule.installments.length === 0) return;

    // Find first pending installment
    const pendingInstallment = schedule.installments
      .filter((inst: any) => inst.status.status === 'PENDING') // Corregido: el backend usa 'PENDING' en inglés
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    if (pendingInstallment) {
      console.log('[SCHEDULE] Suggested payment amount:', pendingInstallment.amount);

      // Pre-fill the payment amount in managementForm if not already set
      if (!this.managementForm.montoPago) {
        this.managementForm.montoPago = pendingInstallment.amount.toFixed(2);
      }

      // Also pre-fill the dynamic fields for compatibility
      const currentValues = { ...this.dynamicFieldValues() };
      if (!currentValues['monto_pagado']) {
        currentValues['monto_pagado'] = pendingInstallment.amount;
        this.dynamicFieldValues.set(currentValues);
      }
    }
  }

  /**
   * Applies full payment from schedule
   */
  // Force recompile
  applyFullSchedulePayment() {
    const schedules = this.activeSchedules();
    if (schedules.length === 0) return;

    const schedule = schedules[0];
    const pendingAmount = this.calculatePendingAmount(schedule);

    console.log('[BUTTON] Pagar Todo clicked. Amount:', pendingAmount);

    // Buscar el campo de monto en el schema
    const schema = this.dynamicFieldsSchema();
    const montoField = schema?.fields.find(f =>
      f.type === 'currency' || f.id.toLowerCase().includes('monto')
    );

    if (montoField) {
      console.log('[BUTTON] Found monto field:', montoField.id);

      // Actualizar el signal de actualizaciones externas
      const updates: any = {};
      updates[montoField.id] = pendingAmount;

      // Si hay campo saldo_pendiente, calcularlo (será 0 porque se paga todo)
      const hasSaldoField = schema?.fields.some(f => f.id === 'saldo_pendiente');
      if (hasSaldoField) {
        updates.saldo_pendiente = 0; // Al pagar todo, el saldo pendiente es 0
        console.log('[BUTTON] Saldo pendiente será 0 (pago total)');

        // Actualizar también dynamicFieldValues para que la validación pase
        const currentValues = { ...this.dynamicFieldValues() };
        currentValues[montoField.id] = pendingAmount;
        currentValues.saldo_pendiente = 0;
        this.dynamicFieldValues.set(currentValues);
      }

      this.externalFieldUpdates.set(updates);
      console.log('[BUTTON] Updated externalFieldUpdates:', updates);

      // Limpiar después de un breve delay para permitir futuras actualizaciones
      setTimeout(() => this.externalFieldUpdates.set({}), 100);
    } else {
      console.warn('[BUTTON] No se encontró campo de monto en el schema');
    }
  }

  /**
   * Applies next installment payment
   */
  applyNextInstallmentPayment() {
    console.log('[BUTTON-PP] Usar Próxima Cuota clicked!');
    const schedules = this.activeSchedules();
    console.log('[BUTTON-PP] Active schedules:', schedules);

    if (schedules.length === 0) {
      console.warn('[BUTTON-PP] No schedules found');
      return;
    }

    const schedule = schedules[0];
    console.log('[BUTTON-PP] Using schedule:', schedule);
    console.log('[BUTTON-PP] Schedule installments:', schedule.installments);

    const pendingInstallments = schedule.installments
      .filter((inst: any) => {
        console.log('[BUTTON-PP] Checking installment:', inst, 'Status:', inst.status?.status);
        return inst.status.status === 'PENDING'; // Corregido: el backend usa 'PENDING' en inglés
      });

    console.log('[BUTTON-PP] Pending installments:', pendingInstallments);

    const pendingInstallment = pendingInstallments
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

    console.log('[BUTTON-PP] Next pending installment:', pendingInstallment);

    if (pendingInstallment) {
      console.log('[BUTTON-PP] Usar Próxima Cuota - Amount:', pendingInstallment.amount);

      // Buscar el campo de monto en el schema
      const schema = this.dynamicFieldsSchema();
      const montoField = schema?.fields.find(f =>
        f.type === 'currency' || f.id.toLowerCase().includes('monto')
      );

      if (montoField) {
        console.log('[BUTTON-PP] Found monto field:', montoField.id);

        // Actualizar el signal de actualizaciones externas
        const updates: any = {};
        updates[montoField.id] = pendingInstallment.amount;

        // Si hay campo saldo_pendiente, calcularlo
        const hasSaldoField = schema?.fields.some(f => f.id === 'saldo_pendiente');
        if (hasSaldoField) {
          const totalPendiente = this.calculatePendingAmount(schedule);
          const saldoPendiente = Math.max(0, totalPendiente - pendingInstallment.amount);
          updates.saldo_pendiente = saldoPendiente;
          console.log('[BUTTON-PP] Saldo pendiente calculado:', saldoPendiente, '= Total', totalPendiente, '- Monto', pendingInstallment.amount);

          // Actualizar también dynamicFieldValues para que la validación pase
          const currentValues = { ...this.dynamicFieldValues() };
          currentValues[montoField.id] = pendingInstallment.amount;
          currentValues.saldo_pendiente = saldoPendiente;
          this.dynamicFieldValues.set(currentValues);
        }

        this.externalFieldUpdates.set(updates);
        console.log('[BUTTON-PP] Updated externalFieldUpdates:', updates);

        // Limpiar después de un breve delay para permitir futuras actualizaciones
        setTimeout(() => this.externalFieldUpdates.set({}), 100);
      } else {
        console.warn('[BUTTON-PP] No se encontró campo de monto en el schema');
      }
    } else {
      console.warn('[BUTTON-PP] No pending installment found');
    }
  }

  /**
   * Calculates total pending amount from schedule
   */
  calculatePendingAmount(schedule: any): number {
    console.log('[CALC] Schedule:', schedule);
    console.log('[CALC] Installments:', schedule.installments);
    const pendingInstallments = schedule.installments
      .filter((inst: any) => {
        console.log('[CALC] Installment status:', inst.status, 'Status value:', inst.status?.status);
        return inst.status.status === 'PENDING'; // Corregido: el backend usa 'PENDING' en inglés
      });
    console.log('[CALC] Pending installments:', pendingInstallments);
    const total = pendingInstallments.reduce((sum: number, inst: any) => sum + inst.amount, 0);
    console.log('[CALC] Total pending amount:', total);
    return total;
  }

  /**
   * Gets pending installments from schedule
   */
  protected getPendingInstallments(schedule: any): any[] {
    if (!schedule.installments) return [];
    return schedule.installments
      .filter((inst: any) => inst.status.status === 'PENDING') // Corregido: el backend usa 'PENDING' en inglés
      .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  /**
   * Maneja cambios en los campos dinámicos del componente
   * Calcula saldo_pendiente en tiempo real para mostrar a la asesora
   * También se calcula en backend al guardar para histórico
   */
  onDynamicFieldsChange(data: any) {
    this.dynamicFieldValues.set(data);

    // Calcular saldo pendiente en tiempo real cuando cambia monto_pagado
    if (data.monto_pagado !== undefined && data.monto_pagado !== null) {
      this.calculateAndUpdatePendingBalance(data.monto_pagado);
    }
  }

  /**
   * Calcula y actualiza el saldo pendiente en tiempo real
   * para que la asesora pueda informar al cliente
   * Fórmula: Saldo Pendiente = (Suma de cuotas pendientes) - (Monto Pagado)
   */
  private calculateAndUpdatePendingBalance(montoPagado: number) {
    const schedules = this.activeSchedules();

    if (schedules.length === 0) {
      console.log('[SALDO] No hay cronogramas activos');
      return;
    }

    const schedule = schedules[0];
    const totalPendiente = this.calculatePendingAmount(schedule);
    const saldoPendiente = Math.max(0, totalPendiente - (montoPagado || 0));

    console.log('[SALDO] Total pendiente:', totalPendiente);
    console.log('[SALDO] Monto pagado:', montoPagado);
    console.log('[SALDO] Saldo pendiente calculado:', saldoPendiente);

    // Actualizar el campo saldo_pendiente para que la asesora lo vea
    const schema = this.dynamicFieldsSchema();
    const hasSaldoField = schema?.fields.some(f => f.id === 'saldo_pendiente');

    if (hasSaldoField) {
      console.log('[SALDO] Actualizando campo saldo_pendiente con:', saldoPendiente);

      // Actualizar tanto en el componente hijo (para mostrar) como en dynamicFieldValues (para validación)
      const updates: any = { saldo_pendiente: saldoPendiente };
      this.externalFieldUpdates.set(updates);

      // También actualizar directamente dynamicFieldValues para que la validación pase
      const currentValues = { ...this.dynamicFieldValues() };
      currentValues.saldo_pendiente = saldoPendiente;
      this.dynamicFieldValues.set(currentValues);

      setTimeout(() => this.externalFieldUpdates.set({}), 100);
    }
  }

  getDynamicLevelLabel(levelIndex: number): string {
    if (levelIndex === 0) {
      const level1 = this.hierarchyLevels()[0] || [];
      if (level1.length === 0) return 'Nivel 1';
      const codes = level1.map((c: any) => c.codigo);
      if (codes.includes('RP') || codes.includes('CSA')) {
        return 'Tipo de Resultado';
      }
      return 'Categoría Principal';
    }

    const parentIndex = levelIndex - 1;
    const parentId = this.selectedClassifications()[parentIndex];

    if (!parentId) return `Nivel ${levelIndex + 1}`;

    const parent = this.managementClassifications().find(c => c.id == parentId);
    if (!parent) return `Nivel ${levelIndex + 1}`;

    if (levelIndex === 1) {
      const labelMap: Record<string, string> = {
        'RP': 'Intención de Pago',
        'CSA': 'Motivo de No Atención',
        'SC': 'Razón de No Contacto',
        'GA': 'Tipo de Gestión'
      };
      return labelMap[parent.codigo] || `Detalle de ${parent.label}`;
    }

    return `Detalle de ${parent.label}`;
  }

  shouldShowLevel(levelIndex: number): boolean {
    if (levelIndex === 0) {
      return this.usesHierarchicalClassifications();
    }

    const previousLevel = levelIndex - 1;
    const previousValue = this.selectedClassifications()[previousLevel];

    if (!previousValue) return false;

    const options = this.getTypificationsForLevel(levelIndex);
    return options.length > 0;
  }

  /**
   * Formatea el nombre de un campo de la tabla ini_* para mostrarlo de forma legible
   * Convierte snake_case a Title Case y aplica traducciones comunes
   */
  formatFieldLabel(fieldName: string): string {
    // Traducciones comunes de campos de cobranza
    const translations: Record<string, string> = {
      'deuda_total': 'Deuda Total',
      'saldo_total': 'Saldo Total',
      'saldo_capital': 'Saldo Capital',
      'capital': 'Capital',
      'deuda_capital': 'Deuda Capital',
      'intereses': 'Intereses',
      'intereses_vencidos': 'Intereses Vencidos',
      'mora': 'Mora',
      'mora_acumulada': 'Mora Acumulada',
      'deuda_mora': 'Deuda Mora',
      'gastos': 'Gastos',
      'gastos_cobranza': 'Gastos Cobranza',
      'monto_original': 'Monto Original',
      'monto_desembolso': 'Monto Desembolso',
      'saldo_vencido': 'Saldo Vencido',
      'cuota_vencida': 'Cuota Vencida',
      'cuotas_vencidas': 'Cuotas Vencidas',
      'monto_cuota': 'Monto Cuota',
      'dias_mora': 'Días Mora',
      'monto_minimo': 'Monto Mínimo',
      'monto_total': 'Monto Total',
      'deuda': 'Deuda',
      'saldo': 'Saldo'
    };

    // Buscar traducción exacta
    const lowerField = fieldName.toLowerCase();
    if (translations[lowerField]) {
      return translations[lowerField];
    }

    // Si no hay traducción, convertir snake_case a Title Case
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Formatea un valor numérico como moneda (Soles)
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

  /**
   * Parsea una fecha string (YYYY-MM-DD) a Date en timezone local.
   * Evita el bug de timezone donde new Date("YYYY-MM-DD") interpreta como UTC.
   */
  private parseDateLocal(dateString: string): Date {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * Obtiene la etiqueta del monto principal (primer campo de montos o "Deuda Total")
   */
  getPrimaryAmountLabel(): string {
    const fields = this.clientAmountFields();
    if (fields.length > 0) {
      // Buscar campo que contenga "total" en el nombre
      const totalField = fields.find(f =>
        f.label.toLowerCase().includes('total') ||
        f.field.toLowerCase().includes('total')
      );
      return totalField?.label || fields[0].label;
    }
    return 'Deuda Total';
  }

  /**
   * Obtiene el valor del monto principal
   */
  getPrimaryAmountValue(): number {
    const fields = this.clientAmountFields();
    if (fields.length > 0) {
      // Buscar campo que contenga "total" en el nombre
      const totalField = fields.find(f =>
        f.label.toLowerCase().includes('total') ||
        f.field.toLowerCase().includes('total')
      );
      return totalField?.value || fields[0].value;
    }
    return this.customerData().deuda?.saldo_total || 0;
  }

  /**
   * Obtiene las clases CSS para cada fila de montos según su índice
   * Alterna entre 2 colores para mejor visualización
   */
  getAmountRowClass(index: number): string {
    const colors = [
      'bg-red-50 !text-black dark:bg-red-950/30 dark:!text-red-300',
      'bg-white !text-black dark:bg-gray-800 dark:!text-red-400',
    ];
    return colors[index % colors.length];
  }

  showPaymentSection(): boolean {
    const selectedManagement = this.managementClassifications().find(c => c.id === this.managementForm.tipoGestion);
    return selectedManagement?.requiere_pago || false;
  }

  showScheduleSection(): boolean {
    const selectedManagement = this.managementClassifications().find(c => c.id === this.managementForm.tipoGestion);
    return selectedManagement?.requiere_cronograma || false;
  }

  onInstallmentCountChange() {
    const numInstallments = parseInt(this.scheduleForm.numeroCuotas);

    if (isNaN(numInstallments) || numInstallments < 1) {
      // If invalid number, clear installments
      this.scheduleForm.cuotas = [];
      return;
    }

    const currentLength = this.scheduleForm.cuotas.length;

    if (numInstallments > currentLength) {
      // Add missing installments
      for (let i = currentLength + 1; i <= numInstallments; i++) {
        this.scheduleForm.cuotas.push({
          numero: i,
          monto: '',
          fechaVencimiento: ''
        });
      }
    } else if (numInstallments < currentLength) {
      // Remove extra installments
      this.scheduleForm.cuotas = this.scheduleForm.cuotas.slice(0, numInstallments);
      // Renumber
      this.scheduleForm.cuotas.forEach((cuota, idx) => {
        cuota.numero = idx + 1;
      });
    }
  }

  generateSchedule() {
    const numCuotas = parseInt(this.scheduleForm.numeroCuotas);
    if (isNaN(numCuotas) || numCuotas < 1) {
      alert('Por favor ingrese un número válido de cuotas');
      return;
    }

    // Generar array de cuotas vacías
    this.scheduleForm.cuotas = [];
    for (let i = 1; i <= numCuotas; i++) {
      this.scheduleForm.cuotas.push({
        numero: i,
        monto: '',
        fechaVencimiento: ''
      });
    }
  }

  addInstallmentRow() {
    const nextNumber = this.scheduleForm.cuotas.length + 1;
    this.scheduleForm.cuotas.push({
      numero: nextNumber,
      monto: '',
      fechaVencimiento: ''
    });
    // Actualizar el número de cuotas
    this.scheduleForm.numeroCuotas = nextNumber.toString();
  }

  removeInstallmentRow(index: number) {
    if (this.scheduleForm.cuotas.length > 1) {
      this.scheduleForm.cuotas.splice(index, 1);
      // Renumerar las cuotas
      this.scheduleForm.cuotas.forEach((cuota, idx) => {
        cuota.numero = idx + 1;
      });
      // Actualizar el número de cuotas
      this.scheduleForm.numeroCuotas = this.scheduleForm.cuotas.length.toString();
    }
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadMontoNegociadoFromOutput(fieldId: string) {
    // Buscar el campo en customerOutputFields
    const field = this.customerOutputFields().find((f: any) => f.id === fieldId);
    if (!field) return;

    // Obtener el valor del campo usando la ruta del field
    const fieldPath = field.field.split('.');
    let value: any = this.customerData();

    for (const key of fieldPath) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        value = null;
        break;
      }
    }

    if (value) {
      this.scheduleForm.montoNegociado = value.toString();
    }
  }

  toggleScheduleDetail() {
    this.showScheduleDetail.update(show => !show);
  }

  saveManagement() {
    if (!this.validateForm()) {
      return;
    }

    this.saving.set(true);

    let contactClassification: any;
    let managementClassification: any;

    if (this.usesHierarchicalClassifications()) {
      // Sistema jerárquico: obtener clasificación (categoría) y tipificación (hoja)
      const selected = this.selectedClassifications();
      const allTypifications = this.managementClassifications();

      // TIPIFICACIÓN: La hoja/leaf (última selección)
      const lastSelectedId = selected[selected.length - 1];
      managementClassification = allTypifications.find((c: any) => c.id.toString() === lastSelectedId);

      // CLASIFICACIÓN: La categoría padre de la tipificación
      // Si la tipificación tiene parent_id, buscar ese parent como clasificación
      // Si es root (sin parent), usar el mismo como clasificación
      if (managementClassification?.parentId) {
        const parentId = managementClassification.parentId;
        contactClassification = allTypifications.find((c: any) => c.id.toString() === parentId.toString());
      } else {
        // Si no tiene padre, usar la misma como clasificación
        contactClassification = managementClassification;
      }
    } else {
      // Sistema simple
      contactClassification = this.contactClassifications().find((c: any) => c.id === this.managementForm.resultadoContacto);
      managementClassification = this.managementClassifications().find((g: any) => g.id === this.managementForm.tipoGestion);
    }

    // Obtener IDs de las 3 tipificaciones seleccionadas
    const selectedClassifs = this.selectedClassifications();
    const typificationLevel1Id = Number(selectedClassifs[0]);
    const typificationLevel2Id = selectedClassifs[1] ? Number(selectedClassifs[1]) : null;
    const typificationLevel3Id = selectedClassifs[2] ? Number(selectedClassifs[2]) : null;

    // Get classification names
    const allTypifications = this.managementClassifications();
    const level1 = allTypifications.find((c: any) => c.id.toString() === selectedClassifs[0]);
    const level2 = selectedClassifs[1] ? allTypifications.find((c: any) => c.id.toString() === selectedClassifs[1]) : null;
    const level3 = selectedClassifs[2] ? allTypifications.find((c: any) => c.id.toString() === selectedClassifs[2]) : null;

    // Verificar si hay un cronograma de pago en los campos dinámicos
    const dynamicValues = this.dynamicFieldValues();
    const schema = this.dynamicFieldsSchema();
    let paymentScheduleData = null;

    console.log('[SAVE] === DEBUG PAYMENT SCHEDULE ===');
    console.log('[SAVE] dynamicValues:', dynamicValues);
    console.log('[SAVE] schema:', schema);
    console.log('[SAVE] schema.fields:', schema?.fields);

    // Buscar el campo payment_schedule en el schema y obtener su valor
    if (schema && schema.fields) {
      const paymentScheduleField = schema.fields.find(f => f.type === 'payment_schedule');
      console.log('[SAVE] paymentScheduleField found:', paymentScheduleField);
      if (paymentScheduleField) {
        console.log('[SAVE] Looking for field id:', paymentScheduleField.id);
        console.log('[SAVE] Value in dynamicValues:', dynamicValues[paymentScheduleField.id]);
      }
      if (paymentScheduleField && dynamicValues[paymentScheduleField.id]) {
        paymentScheduleData = dynamicValues[paymentScheduleField.id];
        console.log('[SAVE] Payment schedule detected:', paymentScheduleData);
      }
    }
    console.log('[SAVE] Final paymentScheduleData:', paymentScheduleData);

    // ⚠️ VALIDACIÓN: No permitir registrar nueva promesa si hay cuotas pendientes
    if (paymentScheduleData && paymentScheduleData.cuotas && paymentScheduleData.cuotas.length > 0) {
      const activeSchedules = this.activePaymentSchedules();
      const hasPendingInstallments = activeSchedules.some(schedule => schedule.cuotasPendientes > 0);

      if (hasPendingInstallments) {
        this.saving.set(false);
        alert('⚠️ No puede registrar una nueva Promesa de Pago.\n\nEl cliente ya tiene una promesa de pago activa con cuotas pendientes.\n\nDebe esperar a que se completen o cancelen las cuotas pendientes antes de registrar una nueva promesa.');
        return;
      }
    }

    // Si hay cronograma de pago con cuotas, usar el endpoint específico
    if (paymentScheduleData && paymentScheduleData.cuotas && paymentScheduleData.cuotas.length > 0) {
      const finalTypificationId = typificationLevel3Id || typificationLevel2Id || typificationLevel1Id;

      // Determinar si es una llamada activa o gestión manual
      const isActiveCallSchedule = this.callActive() || !!this.callStartTime;

      // Obtener el ID del agente actual
      const currentUserSchedule = this.authService.getCurrentUser();

      const scheduleRequest: PaymentScheduleRequest = {
        idCliente: this.customerData().id || 0,
        nombreCliente: this.customerData().nombre_completo,
        documentoCliente: this.customerData().numero_documento,
        idAgente: currentUserSchedule?.id || 1,
        idTenant: this.selectedTenantId!,
        idCartera: this.selectedPortfolioId || 1,
        idSubcartera: this.selectedSubPortfolioId,
        idTipificacion: finalTypificationId,
        observaciones: this.managementForm.observaciones,
        metodoContacto: isActiveCallSchedule ? 'GESTION_PROGRESIVO' : 'GESTION_MANUAL',
        canalContacto: isActiveCallSchedule ? 'LLAMADA_SALIENTE' : undefined,
        campoMontoOrigen: paymentScheduleData.campoMontoOrigen,  // Campo de origen del monto (ej: sld_mora)
        montoBase: paymentScheduleData.montoBase,  // Monto original del campo (antes de excepción). null = monto libre
        schedule: {
          montoTotal: paymentScheduleData.montoTotal,
          numeroCuotas: paymentScheduleData.numeroCuotas,
          cuotas: paymentScheduleData.cuotas.map((cuota: any) => ({
            numeroCuota: cuota.numeroCuota,
            monto: cuota.monto,
            fechaPago: cuota.fechaPago
          }))
        }
      };

      console.log('[SAVE] Creating payment schedule with request:', scheduleRequest);

      this.managementService.createPaymentSchedule(scheduleRequest).subscribe({
        next: (records) => {
          console.log('[SAVE] Payment schedule created successfully:', records);
          // Mostrar modal para generar Carta de Acuerdo SOLO si el monto seleccionado tiene generaCartaAcuerdo = true
          // records puede ser un array o un objeto con id
          const idGestion = Array.isArray(records) && records.length > 0 ? records[0].id : records?.id;
          const debeGenerarCarta = paymentScheduleData.generaCartaAcuerdo === true;

          if (idGestion && debeGenerarCarta) {
            console.log('[CARTA] Monto seleccionado requiere carta de acuerdo, mostrando modal...');
            this.mostrarModalGenerarCarta(idGestion, contactClassification?.label || '', managementClassification?.label || '-');
          } else {
            if (idGestion && !debeGenerarCarta) {
              console.log('[CARTA] Monto seleccionado NO requiere carta de acuerdo, omitiendo modal.');
            }
            this.onSaveSuccess(contactClassification?.label || '', managementClassification?.label || '-');
          }
        },
        error: (error) => {
          console.error('Error al guardar cronograma de pago:', error);
          this.saving.set(false);
          alert('⚠️ Error al guardar el cronograma de pago. Por favor intente nuevamente.');
        }
      });
    } else {
      // Gestión normal sin cronograma de pago
      // Determinar si es una llamada activa o gestión manual
      const isActiveCall = this.callActive() || !!this.callStartTime;

      // Obtener información del usuario actual
      const currentUser = this.authService.getCurrentUser();

      const request: CreateManagementRequest = {
        customerId: String(this.customerData().id),
        customerName: this.customerData().nombre_completo || '',
        customerDocument: this.customerData().numero_documento || '',
        advisorId: 'ADV-001',

        // Multi-tenant fields
        tenantId: this.selectedTenantId!,
        portfolioId: this.selectedPortfolioId || 1,
        subPortfolioId: 1,

        // Phone from customer data
        phone: this.customerData().contacto?.telefono_principal || '',

        // Hierarchy levels with IDs and names
        level1Id: typificationLevel1Id,
        level1Name: level1?.label || '',
        level2Id: typificationLevel2Id,
        level2Name: level2?.label || null,
        level3Id: typificationLevel3Id,
        level3Name: level3?.label || null,

        observations: this.managementForm.observaciones,

        // Campos de contexto de gestión
        metodoContacto: isActiveCall ? 'GESTION_PROGRESIVO' : 'GESTION_MANUAL',
        canalContacto: isActiveCall ? 'LLAMADA_SALIENTE' : undefined,
        idCampana: null,  // Se puede obtener del contexto si hay campaña activa
        idLlamada: null,  // Se puede obtener si hay ID de llamada en el sistema
        duracionSegundos: isActiveCall && this.callStartTime ? this.calculateCallDurationSeconds() : null,

        // Información del agente y dispositivo
        nombreAgente: currentUser?.username || currentUser?.firstName || 'Sistema',
        userAgent: navigator.userAgent
      };

      this.managementService.createManagement(request).subscribe({
        next: (response) => {
          if (this.callStartTime && this.callActive()) {
            this.registerCallToBackend(response.id);
          }

          // Si es una cancelación y hay cuota seleccionada, registrar el pago
          // Usa el nuevo endpoint que distribuye automáticamente entre cuotas
          const selectedCuota = this.selectedInstallmentForCancellation();
          if (this.isCancellationTypification() && selectedCuota && selectedCuota.id) {
            // Usar los valores editables (monto y fecha)
            const montoPago = this.montoPagoEditable() || selectedCuota.monto;
            const fechaPago = this.fechaPagoEditable() || new Date().toISOString().split('T')[0];

            console.log('💰 Registrando pago:', {
              cuota: selectedCuota.numeroCuota,
              montoOriginal: selectedCuota.monto,
              montoPagado: montoPago,
              fecha: fechaPago
            });

            // Buscar el grupoPromesaUuid de la cuota
            const schedule = this.activePaymentSchedules().find(s =>
              s.installments?.some((c: any) => c.id === selectedCuota.id)
            );
            const grupoPromesaUuid = schedule?.grupoPromesaUuid || schedule?.id;

            if (!grupoPromesaUuid) {
              console.error('No se encontró el grupoPromesaUuid');
              this.selectedInstallmentForCancellation.set(null);
              this.onSaveSuccess(contactClassification?.label || '', managementClassification?.label || '-');
              return;
            }

            const currentUser = this.authService.getCurrentUser();

            // Usar el nuevo endpoint de pagos
            this.http.post<any>(`${environment.apiUrl}/pagos/registrar`, {
              grupoPromesaUuid: grupoPromesaUuid,
              monto: montoPago,
              fechaPago: fechaPago,
              banco: null,
              numeroOperacion: null,
              agenteId: currentUser?.id || 1,
              metodoRegistro: 'MANUAL',
              observaciones: this.managementForm.observaciones || 'Pago registrado desde gestión',
              comprobanteUrl: null
            }).subscribe({
              next: (result) => {
                console.log('✅ Pago registrado exitosamente:', result);
                // Limpiar la selección y campos editables
                this.selectedInstallmentForCancellation.set(null);
                this.montoPagoEditable.set(0);
                this.fechaPagoEditable.set('');
                // Recargar los cronogramas activos para reflejar el cambio
                const customerId = this.customerData().id;
                if (customerId) {
                  this.loadActivePaymentSchedules(customerId);
                }
                this.onSaveSuccess(contactClassification?.label || '', managementClassification?.label || '-');
              },
              error: (err) => {
                console.error('⚠️ Error registrando pago:', err);
                if (err.error?.error || err.error?.mensaje) {
                  alert(`⚠️ ${err.error.error || err.error.mensaje || 'Error al registrar el pago.'}`);
                }
                // Aunque falle el pago, la gestión ya se guardó
                this.selectedInstallmentForCancellation.set(null);
                this.onSaveSuccess(contactClassification?.label || '', managementClassification?.label || '-');
              }
            });
          } else {
            this.onSaveSuccess(contactClassification?.label || '', managementClassification?.label || '-');
          }
        },
        error: (error) => {
          console.error('Error al guardar gestión:', error);
          this.saving.set(false);
          alert('⚠️ Error al guardar la gestión. Por favor intente nuevamente.');
        }
      });
    }
  }

  private registerCallToBackend(managementId: number) {
    if (!this.callStartTime) return;

    const startCallRequest: StartCallRequest = {
      phoneNumber: this.customerData().contacto.telefono_principal,
      startTime: this.callStartTime
    };

    this.managementService.startCall(managementId, startCallRequest).subscribe({
      next: (response) => {
        if (!this.callActive()) {
          const endCallRequest: EndCallRequest = {
            endTime: new Date().toISOString()
          };
          this.managementService.endCall(managementId, endCallRequest).subscribe({
            next: () => {},
            error: (err) => console.error('Error al finalizar llamada:', err)
          });
        }
      },
      error: (error) => {
        console.error('Error al registrar llamada:', error);
      }
    });
  }

  private registerPaymentToBackend(managementId: string) {
    if (!this.managementForm.montoPago || !this.managementForm.metodoPago) return;

    const paymentRequest: RegisterPaymentRequest = {
      amount: parseFloat(this.managementForm.montoPago),
      scheduledDate: new Date().toISOString().split('T')[0],
      paymentMethodType: this.managementForm.metodoPago,
      paymentMethodDetails: this.managementForm.ultimos4Tarjeta || undefined,
      voucherNumber: undefined,
      bankName: this.managementForm.bancoSeleccionado || undefined
    };

    this.managementService.registerPayment(managementId, paymentRequest).subscribe({
      next: (response) => {},
      error: (error) => {
        console.error('Error al registrar pago:', error);
      }
    });
  }

  private createScheduleToBackend(managementId: string) {
    if (this.scheduleForm.cuotas.length === 0) return;

    // Validar que todas las cuotas tengan monto y fecha
    const hasInvalidInstallments = this.scheduleForm.cuotas.some(
      cuota => !cuota.monto || !cuota.fechaVencimiento
    );

    if (hasInvalidInstallments) {
      alert('⚠️ Por favor complete todos los montos y fechas de las cuotas');
      return;
    }

    const scheduleRequest: any = {
      customerId: String(this.customerData().id),
      managementId: managementId,
      scheduleType: this.scheduleForm.tipoCronograma,
      negotiatedAmount: this.scheduleForm.montoNegociado ? parseFloat(this.scheduleForm.montoNegociado) : null,
      installments: this.scheduleForm.cuotas.map(cuota => ({
        installmentNumber: cuota.numero,
        amount: parseFloat(cuota.monto),
        dueDate: cuota.fechaVencimiento
      }))
    };

    this.paymentScheduleService.createPaymentSchedule(scheduleRequest).subscribe({
      next: (response) => {},
      error: (error) => {
        console.error('Error al crear cronograma:', error);
        alert('⚠️ Error al crear el cronograma de pagos');
      }
    });
  }

  private onSaveSuccess(resultadoCodigo: string, gestionCodigo: string) {
    this.saving.set(false);
    this.showSuccess.set(true);

    // Colgar la llamada SIP y detener timer (sin navegar todavía)
    this.endCall(false);

    this.loadManagementHistory();

    this.managementForm = {
      resultadoContacto: '',
      tipoGestion: '',
      clasificacionNivel1: '',
      clasificacionNivel2: '',
      clasificacionNivel3: '',
      motivoNoPago: '',
      metodoPago: '',
      montoPago: '',
      fechaCompromiso: '',
      horaCompromiso: '',
      ultimos4Tarjeta: '',
      bancoSeleccionado: '',
      observaciones: '',
      notasPrivadas: ''
    };

    this.callDuration.set(0);
    this.callStartTime = undefined;

    this.activeTab.set('historial');

    // Desbloquear llamadas entrantes - tipificación completada
    this.isTipifying.set(false);
    this.sipService.blockIncomingCallsMode(false);
    console.log('✅ Desbloqueando llamadas entrantes - tipificación completada');

    // Verificar si estamos en modo recordatorio dialer
    const recordatorioEnCurso = sessionStorage.getItem('recordatorioEnCurso');
    if (recordatorioEnCurso) {
      console.log('🔔 Modo recordatorio dialer activo, procesando siguiente...');
      this.procesarSiguienteRecordatorio(JSON.parse(recordatorioEnCurso));
      return;
    }

    // Flujo normal: cambiar estado a DISPONIBLE y volver al dashboard
    console.log('✅ Gestión guardada, cambiando estado a DISPONIBLE...');

    const currentUser = this.authService.getCurrentUser();
    const agentId = currentUser?.id || 1; // Fallback a 1 si no se obtiene
    this.agentService.changeAgentStatus(agentId, { estado: AgentState.DISPONIBLE }).subscribe({
      next: () => {
        console.log('✅ Estado cambiado a DISPONIBLE');
        // Esperar 2 segundos para mostrar mensaje de éxito, luego navegar
        setTimeout(() => {
          this.showSuccess.set(false);
          console.log('🔄 Navegando a /agent-dashboard...');
          this.router.navigate(['/agent-dashboard']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('❌ Error cambiando estado:', err);
        // Navegar de todas formas aunque falle el cambio de estado
        setTimeout(() => {
          this.showSuccess.set(false);
          this.router.navigate(['/agent-dashboard']);
        }, 2000);
      }
    });
  }

  /**
   * Procesa el siguiente recordatorio después de completar la tipificación
   */
  private procesarSiguienteRecordatorio(recordatorioActual: any): void {
    const currentUser = this.authService.getCurrentUser();
    const agentId = currentUser?.id || recordatorioActual.idAgente;

    // Completar el recordatorio actual en el backend
    this.recordatoriosService.completarActual(agentId, 'CONTESTADO').subscribe({
      next: (response) => {
        console.log('🔔 Recordatorio completado:', response);

        if (response.terminado) {
          // Ya no hay más recordatorios - mostrar modal de finalización
          console.log('🔔 Todos los recordatorios completados');
          sessionStorage.removeItem('recordatorioEnCurso');

          // Mostrar modal de finalización
          setTimeout(() => {
            this.showSuccess.set(false);
            this.mostrarModalRecordatoriosFinalizado(agentId);
          }, 1000);
        } else {
          // Obtener el siguiente recordatorio
          this.recordatoriosService.obtenerSiguiente(agentId).subscribe({
            next: (siguienteResp) => {
              if (siguienteResp.hayMas && siguienteResp.recordatorio) {
                console.log('🔔 Siguiente recordatorio:', siguienteResp.recordatorio);

                // Guardar el nuevo recordatorio en sesión
                sessionStorage.setItem('recordatorioEnCurso', JSON.stringify({
                  idCuota: siguienteResp.recordatorio.idCuota,
                  idAgente: agentId,
                  idCliente: siguienteResp.recordatorio.idCliente,
                  nombreCliente: siguienteResp.recordatorio.nombreCliente,
                  telefono: siguienteResp.recordatorio.telefono,
                  monto: siguienteResp.recordatorio.monto,
                  numeroCuota: siguienteResp.recordatorio.numeroCuota,
                  totalCuotas: siguienteResp.recordatorio.totalCuotas
                }));

                // Iniciar cuenta regresiva y luego llamar
                this.showSuccess.set(false);
                this.mostrarCountdownYLlamar(siguienteResp.recordatorio);
              } else {
                // No hay más recordatorios
                sessionStorage.removeItem('recordatorioEnCurso');
                this.showSuccess.set(false);
                this.mostrarModalRecordatoriosFinalizado(agentId);
              }
            },
            error: (err) => {
              console.error('Error obteniendo siguiente recordatorio:', err);
              sessionStorage.removeItem('recordatorioEnCurso');
              this.showSuccess.set(false);
              this.router.navigate(['/agent-dashboard']);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error completando recordatorio:', err);
        sessionStorage.removeItem('recordatorioEnCurso');
        this.showSuccess.set(false);
        this.router.navigate(['/agent-dashboard']);
      }
    });
  }

  /**
   * Muestra countdown animado y luego inicia la llamada
   */
  private mostrarCountdownYLlamar(recordatorio: any): void {
    const dialogRef = this.dialog.open(RecordatoriosModalComponent, {
      width: '450px',
      disableClose: true,
      data: {
        cantidad: 0,
        pendientes: 1,
        idAgente: this.authService.getCurrentUser()?.id || 0,
        // Indicar que es un "siguiente" no un inicio
        modoSiguiente: true,
        recordatorio: recordatorio
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.action === 'call' && result.recordatorio) {
        // Iniciar la llamada
        this.sipService.call(result.recordatorio.telefono);
      } else if (result?.action === 'cancelled') {
        sessionStorage.removeItem('recordatorioEnCurso');
        this.router.navigate(['/agent-dashboard']);
      }
    });
  }

  /**
   * Muestra el modal de recordatorios finalizados
   */
  private mostrarModalRecordatoriosFinalizado(agentId: number): void {
    const dialogRef = this.dialog.open(RecordatoriosModalComponent, {
      width: '450px',
      disableClose: true,
      data: {
        cantidad: 0,
        pendientes: 0,
        idAgente: agentId,
        modoFinalizado: true
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      // Cambiar estado a disponible y navegar al dashboard
      this.agentService.changeAgentStatus(agentId, { estado: AgentState.DISPONIBLE }).subscribe({
        next: () => this.router.navigate(['/agent-dashboard']),
        error: () => this.router.navigate(['/agent-dashboard'])
      });
    });
  }

  private validateForm(): boolean {
    const newErrors: ValidationErrors = {};

    // 1. Validar clasificación (sistema jerárquico o simple)
    if (this.usesHierarchicalClassifications()) {
      // Sistema jerárquico: verificar que se haya seleccionado clasificación completa
      const selected = this.selectedClassifications();
      if (selected.length === 0 || !selected[selected.length - 1]) {
        newErrors['typification'] = 'Debe seleccionar una clasificación';
      } else {
        // TEMPORAL: No verificar isLeaf, verificar si hay hijos disponibles
        const lastSelectedId = selected[selected.length - 1];
        const all: any[] = this.managementClassifications() as any[];
        const hasChildren = all.some((c: any) => c.parentId && Number(c.parentId) === Number(lastSelectedId));

        if (hasChildren) {
          newErrors['typification'] = 'Debe completar todos los niveles de clasificación';
        }
      }
    } else {
      // Sistema simple: verificar resultado de contacto
      if (!this.managementForm.resultadoContacto) {
        newErrors['resultadoContacto'] = 'Requerido';
      }

      if (this.showManagementType() && !this.managementForm.tipoGestion) {
        newErrors['tipoGestion'] = 'Requerido';
      }
    }

    // 2. Validar campos de pago si son requeridos
    // NOTA: Los campos de pago ahora son campos dinámicos (monto_pagado, metodo_pago, etc.)
    // Se validan automáticamente en el paso 3 como parte de los campos dinámicos requeridos

    // 3. Validar campos dinámicos requeridos
    const schema = this.dynamicFieldsSchema();
    if (schema && schema.fields && schema.fields.length > 0) {
      const dynamicValues = this.dynamicFieldValues();

      for (const field of schema.fields) {
        if (field.required) {
          const value = dynamicValues[field.id];

          // Verificar si el campo está vacío
          if (value === undefined || value === null || value === '') {
            newErrors[`dynamic_${field.id}`] = `${field.label} es requerido`;
          }

          // Para campos tipo tabla, verificar que tenga al menos una fila
          if (field.type === 'table' && (!Array.isArray(value) || value.length === 0)) {
            newErrors[`dynamic_${field.id}`] = `${field.label} debe tener al menos una fila`;
          }
        }
      }
    }

    this.errors.set(newErrors);

    if (Object.keys(newErrors).length > 0) {
      alert('Por favor complete todos los campos requeridos');
      return false;
    }

    return true;
  }

  calculateRemaining(): string {
    if (!this.managementForm.montoPago) return '0.00';
    const monto = parseFloat(this.managementForm.montoPago);
    const restante = this.customerData().deuda.saldo_total - monto;
    return restante.toFixed(2);
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  /**
   * Obtiene el valor de un campo del cliente usando notación de punto
   * Ejemplo: 'contactInfo.mobilePhone' → customerData.contactInfo.mobilePhone
   */
  getFieldValue(field: string): any {
    const customer = this.customerData();
    if (!customer) return null;

    return field.split('.').reduce((obj: any, key: string) => obj?.[key], customer);
  }

  /**
   * Formatea un valor según su tipo
   */
  formatFieldValue(value: any, format?: string): string {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    switch (format) {
      case 'currency':
        return 'S/ ' + Number(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      case 'number':
        return String(value);

      case 'date':
        if (typeof value === 'string') {
          const date = new Date(value);
          return date.toLocaleDateString('es-PE');
        }
        return String(value);

      default:
        return String(value);
    }
  }

  /**
   * Verifica si un campo es de contacto (para excluirlo de la lista principal)
   * ya que estos campos se muestran en la sección de Contacto
   */
  isContactField(fieldName: string): boolean {
    const contactFields = [
      'celular',
      'telefono',
      'telefono_principal',
      'telefono_alternativo',
      'telefono_trabajo',
      'email',
      'correo',
      'direccion',
      'address'
    ];
    const lowerField = fieldName.toLowerCase();
    return contactFields.some(cf => lowerField.includes(cf));
  }

  /**
   * Formatea una fecha para mostrar en la UI
   * Usa parseDateLocal para fechas string YYYY-MM-DD para evitar bug de timezone
   */
  formatDate(dateValue: string | Date): string {
    if (!dateValue) return '-';

    try {
      let date: Date;
      if (typeof dateValue === 'string') {
        // Si es formato YYYY-MM-DD, usar parseDateLocal para evitar bug de timezone
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          date = this.parseDateLocal(dateValue);
        } else {
          date = new Date(dateValue);
        }
      } else {
        date = dateValue;
      }
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return String(dateValue);
    }
  }

  /**
   * Calcula el saldo pendiente de una cuota
   * saldoPendiente = monto - montoPagadoReal
   */
  getSaldoPendienteCuota(cuota: any): number {
    const pagado = cuota?.montoPagadoReal || 0;
    return Math.max(0, (cuota?.monto || 0) - pagado);
  }

  /**
   * Verifica si una cuota tiene pago parcial
   */
  tienePagoParcial(cuota: any): boolean {
    return (cuota?.montoPagadoReal || 0) > 0;
  }

  /**
   * Muestra el detalle de un cronograma de pago
   */
  showPaymentScheduleDetail(schedule: any) {
    console.log('📅 Detalle de promesa de pago:', schedule);

    // Construir mensaje con las cuotas
    let message = `PROMESA DE PAGO\n\n`;
    message += `Monto Total: S/ ${schedule.totalAmount?.toFixed(2) || '0.00'}\n`;
    message += `Número de Cuotas: ${schedule.numberOfInstallments}\n\n`;
    message += `DETALLE DE CUOTAS:\n`;

    if (schedule.installments && schedule.installments.length > 0) {
      for (const cuota of schedule.installments) {
        const fechaStr = cuota.dueDate ? this.formatDate(cuota.dueDate) : '-';
        let estadoStr = '⏳ Pendiente';
        if (cuota.status === 'PAGADA' || cuota.status === 'PAGADO' || cuota.status === 'CUMPLIDO') {
          estadoStr = '✅ PAGADA';
        } else if (cuota.status === 'VENCIDA' || cuota.status === 'VENCIDO') {
          estadoStr = '⚠️ VENCIDA';
        } else if (cuota.status === 'CANCELADA' || cuota.status === 'CANCELADO') {
          estadoStr = '✗ CANCELADA';
        }
        message += `  Cuota ${cuota.numeroCuota}: S/ ${cuota.monto?.toFixed(2) || '0.00'} - ${fechaStr} - ${estadoStr}\n`;
      }
    }

    alert(message);
  }

  getContactClassificationLabel(id: string): string {
    const typification = this.contactClassifications().find(c => c.id === id);
    if (!typification) return id;

    const label = typification.label || typification.codigo;
    return `[${typification.codigo}] ${label}`;
  }

  getManagementClassificationLabel(id: string): string {
    const typification = this.managementClassifications().find(g => g.id === id);
    if (!typification) return id;

    const label = typification.label || typification.codigo;
    return `[${typification.codigo}] ${label}`;
  }

  getTableRows(fieldCode: string): any[] {
    const data = this.dynamicFieldValues()[fieldCode];
    if (Array.isArray(data)) {
      return data;
    }
    return [];
  }

  addTableRow(fieldCode: string, columns: any[]) {
    if (!Array.isArray(columns)) {
      console.error('addTableRow: columns no es un array válido', columns);
      return;
    }

    const currentValues = { ...this.dynamicFieldValues() };
    
    if (!Array.isArray(currentValues[fieldCode])) {
      currentValues[fieldCode] = [];
    }

    const newRow = this.createEmptyTableRow(columns);
    (currentValues[fieldCode] as any[]).push(newRow);

    this.dynamicFieldValues.set(currentValues);
  }

  removeTableRow(fieldCode: string, rowIndex: number) {
    const currentValues = { ...this.dynamicFieldValues() };
    
    if (Array.isArray(currentValues[fieldCode])) {
      (currentValues[fieldCode] as any[]).splice(rowIndex, 1);
      this.dynamicFieldValues.set(currentValues);
    }
  }

  private createEmptyTableRow(columns: any[]): any {
    const row: any = {};
    
    columns.forEach(column => {
      if (column.type === 'auto-number') {
        row[column.id] = null;
      } else if (column.type === 'number' || column.type === 'currency') {
        row[column.id] = column.defaultValue || 0;
      } else if (column.type === 'date') {
        row[column.id] = column.defaultValue || '';
      } else {
        row[column.id] = column.defaultValue || '';
      }
    });

    return row;
  }

  /**
   * Busca un cliente por documento de testing
   */
  searchByTestDocument() {
    if (!this.testDocument.trim() || !this.selectedTenantId) {
      console.warn('[TEST] Documento vacío o tenant no seleccionado');
      return;
    }

    console.log('[TEST] Buscando cliente por documento:', this.testDocument);
    this.customerService.searchCustomersByCriteria(this.selectedTenantId, 'documento', this.testDocument).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          console.log('[TEST] Cliente encontrado:', customers[0]);
          this.loadCustomerFromResource(customers[0]);
        } else {
          console.warn('[TEST] No se encontró cliente con documento:', this.testDocument);
          alert('No se encontró cliente con el documento: ' + this.testDocument);
        }
      },
      error: (error) => {
        console.error('[TEST] Error buscando cliente:', error);
        alert('Error buscando cliente');
      }
    });
  }

  /**
   * Busca un cliente por teléfono de testing
   */
  searchByTestPhone() {
    if (!this.testPhone.trim() || !this.selectedTenantId) {
      console.warn('[TEST] Teléfono vacío o tenant no seleccionado');
      return;
    }

    console.log('[TEST] Buscando cliente por teléfono:', this.testPhone);
    this.customerService.searchCustomersByCriteria(this.selectedTenantId, 'telefono', this.testPhone).subscribe({
      next: (customers) => {
        if (customers && customers.length > 0) {
          console.log('[TEST] Cliente encontrado:', customers[0]);
          this.loadCustomerFromResource(customers[0]);
        } else {
          console.warn('[TEST] No se encontró cliente con teléfono:', this.testPhone);
          alert('No se encontró cliente con el teléfono: ' + this.testPhone);
        }
      },
      error: (error) => {
        console.error('[TEST] Error buscando cliente:', error);
        alert('Error buscando cliente');
      }
    });
  }

  /**
   * Carga un cliente desde un CustomerResource
   * Similar a loadFirstCustomer pero reutilizable
   */
  private loadCustomerFromResource(customer: any) {
    console.log('[TEST] Cargando cliente:', customer);

    // Guardar los datos raw del cliente para detectar columnas numéricas dinámicamente
    this.rawClientData.set(customer);
    console.log('[PAYMENT] Raw client data from resource:', customer);

    // Cargar cabeceras de montos para esta subcartera
    this.loadMontoCabeceras();

    // Mapear CustomerResource a CustomerData
    this.customerData.set({
      id: customer.id,
      id_cliente: customer.documentNumber || customer.identificationCode,
      nombre_completo: customer.fullName || '',
      tipo_documento: customer.documentType || 'DNI',
      numero_documento: customer.documentNumber || '',
      fecha_nacimiento: customer.birthDate || '',
      edad: customer.age || null,
      contacto: {
        telefono_principal: customer.contactMethods?.find((cm: any) => cm.subtype === 'telefono_principal')?.value || '',
        telefono_alternativo: customer.contactMethods?.find((cm: any) => cm.subtype === 'telefono_secundario')?.value || '',
        telefono_trabajo: customer.contactMethods?.find((cm: any) => cm.subtype === 'telefono_trabajo')?.value || '',
        email: customer.contactMethods?.find((cm: any) => cm.contactType === 'email')?.value || '',
        direccion: customer.address || ''
      },
      cuenta: {
        numero_cuenta: customer.accountNumber || '',
        tipo_producto: 'PRÉSTAMO',
        fecha_desembolso: '2024-01-15',
        monto_original: customer.principalAmount || 0,
        plazo_meses: 12,
        tasa_interes: 2.5
      },
      deuda: {
        saldo_capital: customer.principalAmount || 0,
        intereses_vencidos: 0,
        mora_acumulada: customer.overdueAmount || 0,
        gastos_cobranza: 0,
        saldo_total: (customer.principalAmount || 0) + (customer.overdueAmount || 0),
        dias_mora: customer.overdueDays || 0,
        fecha_ultimo_pago: '',
        monto_ultimo_pago: 0
      }
    });

    // Cargar historial de gestiones del cliente
    this.loadManagementHistory();

    // Cargar promesas de pago activas
    if (customer.id) {
      this.loadActivePaymentSchedules(customer.id);
    }

    console.log('[TEST] Cliente cargado exitosamente');
  }

  // ============================================
  // MÉTODOS DE CONTROL DE LLAMADA (SIP)
  // ============================================

  /**
   * Colgar llamada activa
   */
  hangupCall() {
    console.log('📵 Colgando llamada...');
    this.sipService.hangup();
  }

  /**
   * Alternar mutear/desmutear
   */
  toggleMute() {
    if (this.isMuted()) {
      console.log('🔊 Desmuteando...');
      this.sipService.unmute();
      this.isMuted.set(false);
    } else {
      console.log('🔇 Muteando...');
      this.sipService.mute();
      this.isMuted.set(true);
    }
  }

  /**
   * Verificar si está en llamada activa
   */
  isInActiveCall(): boolean {
    return this.callState === CallState.ACTIVE;
  }

  /**
   * Obtener texto del estado de llamada
   */
  getCallStateText(): string {
    switch (this.callState) {
      case CallState.IDLE: return 'LISTO';
      case CallState.CONNECTING: return 'CONECTANDO...';
      case CallState.RINGING: return 'TIMBRANDO...';
      case CallState.ACTIVE: return 'EN LLAMADA';
      case CallState.ENDED: return 'FINALIZADA';
      default: return 'DESCONOCIDO';
    }
  }

  /**
   * Abre el modal para subir comprobante de pago
   */
  openComprobanteUploadDialog(): void {
    const cuota = this.selectedInstallmentForCancellation();
    const customer = this.customerData();
    const currentUser = this.authService.getCurrentUser();

    if (!cuota || !customer) {
      console.warn('[COMPROBANTE] No hay cuota o cliente seleccionado');
      return;
    }

    const dialogData: ComprobanteUploadDialogData = {
      idCuota: cuota.id,
      montoEsperado: cuota.monto || 0,
      documentoEsperado: customer.numero_documento || '',
      nombreCliente: customer.nombre_completo || '',
      idAgente: currentUser?.id || 1
    };

    const dialogRef = this.dialog.open(ComprobanteUploadDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false,
      backdropClass: 'comprobante-modal-backdrop',
      panelClass: 'comprobante-modal-panel'
    });

    dialogRef.afterClosed().subscribe((result: ComprobanteUploadDialogResult) => {
      if (result?.uploaded && result.response) {
        console.log('[COMPROBANTE] Comprobante subido:', result.response);
        this.uploadedComprobante.set(result.response);

        // Actualizar campos editables con los valores detectados por OCR
        const ocrResult = result.response.ocrResult;
        if (ocrResult) {
          // Actualizar monto si fue detectado
          if (ocrResult.monto && ocrResult.monto > 0) {
            console.log('[COMPROBANTE] Actualizando monto con OCR:', ocrResult.monto);
            this.montoPagoEditable.set(ocrResult.monto);
          }

          // Actualizar fecha si fue detectada (formato esperado: YYYY-MM-DD o similar)
          if (ocrResult.fecha) {
            console.log('[COMPROBANTE] Actualizando fecha con OCR:', ocrResult.fecha);
            // Intentar parsear la fecha del OCR
            const fechaOcr = this.parseFechaOcr(ocrResult.fecha);
            if (fechaOcr) {
              this.fechaPagoEditable.set(fechaOcr);
            }
          }
        }

        // Mostrar advertencia si no coincide
        if (!result.validacionesOk) {
          console.warn('[COMPROBANTE] El comprobante tiene diferencias con los datos esperados');
        }
      }
    });
  }

  /**
   * Abre el modal para registrar pago con voucher (flujo nuevo)
   * Auto-selecciona: Contacto Directo + Cancelación + Cuota más próxima
   */
  openVoucherPaymentDialog(schedule: any): void {
    const customer = this.customerData();
    const currentUser = this.authService.getCurrentUser();

    if (!customer) {
      console.warn('[VOUCHER] No hay cliente seleccionado');
      return;
    }

    if (!schedule.installments || schedule.installments.length === 0) {
      console.warn('[VOUCHER] No hay cuotas en el cronograma');
      return;
    }

    // Preparar cuotas para el diálogo
    const cuotas = schedule.installments.map((c: any) => ({
      id: c.id,
      numeroCuota: c.numeroCuota,
      monto: c.monto,
      dueDate: c.dueDate,
      status: c.status,
      montoPagadoReal: c.montoPagadoReal || 0
    }));

    const dialogData: VoucherPaymentDialogData = {
      nombreCliente: customer.nombre_completo || '',
      documentoCliente: customer.numero_documento || '',
      idCliente: customer.id || 0,
      idAgente: currentUser?.id || 1,
      cuotas: cuotas,
      grupoPromesaUuid: schedule.grupoPromesaUuid || schedule.id
    };

    const dialogRef = this.dialog.open(VoucherPaymentDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      data: dialogData,
      disableClose: false,
      backdropClass: 'voucher-modal-backdrop',
      panelClass: 'voucher-modal-panel'
    });

    dialogRef.afterClosed().subscribe((result: VoucherPaymentDialogResult) => {
      if (result?.confirmed && result.autoSelect) {
        console.log('[VOUCHER] Pago confirmado, auto-seleccionando:', result.autoSelect);

        // Auto-seleccionar la clasificación: Contacto Directo
        this.autoSelectClassification(result.autoSelect.categoriaId, result.autoSelect.detalleId);

        // Auto-seleccionar la cuota
        this.selectedInstallmentForCancellation.set(result.autoSelect.cuotaSeleccionada);

        // Auto-llenar observaciones
        this.managementForm.observaciones = result.autoSelect.observaciones;

        // Guardar el comprobante subido
        if (result.ocrResponse) {
          this.uploadedComprobante.set(result.ocrResponse);

          // Auto-llenar monto y fecha con los valores del OCR
          const ocrResult = result.ocrResponse.ocrResult;
          if (ocrResult) {
            // Actualizar monto si fue detectado
            if (ocrResult.monto && ocrResult.monto > 0) {
              console.log('[VOUCHER] Actualizando monto con OCR:', ocrResult.monto);
              this.montoPagoEditable.set(ocrResult.monto);
            } else {
              // Si no hay monto OCR, usar el monto de la cuota seleccionada
              this.montoPagoEditable.set(result.autoSelect.cuotaSeleccionada.monto || 0);
            }

            // Actualizar fecha si fue detectada
            if (ocrResult.fecha) {
              console.log('[VOUCHER] Actualizando fecha con OCR:', ocrResult.fecha);
              const fechaParsed = this.parseFechaOcr(ocrResult.fecha);
              if (fechaParsed) {
                this.fechaPagoEditable.set(fechaParsed);
              } else {
                // Si no se pudo parsear, usar fecha de hoy
                this.fechaPagoEditable.set(new Date().toISOString().split('T')[0]);
              }
            } else {
              // Si no hay fecha OCR, usar fecha de hoy
              this.fechaPagoEditable.set(new Date().toISOString().split('T')[0]);
            }
          }
        }

        // Mostrar mensaje de éxito
        console.log('[VOUCHER] Formulario auto-completado. Listo para guardar.');
      }
    });
  }

  /**
   * Auto-selecciona la clasificación jerárquica por códigos o labels
   */
  private autoSelectClassification(categoriaCode: string, detalleCode: string): void {
    // Usar directamente managementClassifications en lugar de hierarchyLevels
    // porque hierarchyLevels depende de selecciones previas
    const allClassifications: any[] = this.managementClassifications() as any[];

    if (!allClassifications || allClassifications.length === 0) {
      console.warn('[VOUCHER] No hay clasificaciones disponibles');
      return;
    }

    // Obtener los roots (nivel 1)
    const roots = allClassifications.filter(c => c.hierarchyLevel === 1 || !c.parentId);

    console.log('[VOUCHER] Total clasificaciones:', allClassifications.length);
    console.log('[VOUCHER] Roots disponibles:', roots.map(r => `${r.codigo}: ${r.label}`));
    console.log('[VOUCHER] Buscando categoría:', categoriaCode, 'y detalle:', detalleCode);

    // Buscar la categoría (nivel 0) por código o por label que contenga "CONTACTO DIRECTO"
    const categoria = roots.find((opt: any) =>
      opt.codigo === categoriaCode ||
      opt.codigo?.toUpperCase() === categoriaCode ||
      opt.label?.toUpperCase().includes('CONTACTO DIRECTO') ||
      opt.label?.toUpperCase().includes('CONTACTO_DIRECTO')
    );

    if (categoria) {
      this.onClassificationLevelChange(0, categoria.id);
      console.log('[VOUCHER] Categoría seleccionada:', categoria.label, '(id:', categoria.id, ')');

      // Esperar a que se actualice el signal y buscar los hijos directamente
      setTimeout(() => {
        // Buscar hijos del padre seleccionado directamente en allClassifications
        const children = allClassifications.filter((c: any) =>
          c.parentId && Number(c.parentId) === Number(categoria.id)
        );

        console.log('[VOUCHER] Hijos disponibles:', children.map(c => `${c.codigo}: ${c.label}`));

        if (children.length > 0) {
          // Buscar detalle por código o por label que contenga "CANCELACION"
          const detalle = children.find((opt: any) =>
            opt.codigo === detalleCode ||
            opt.codigo?.toUpperCase() === detalleCode ||
            opt.label?.toUpperCase().includes('CANCELACION') ||
            opt.label?.toUpperCase().includes('CANCELACIÓN')
          );

          if (detalle) {
            this.onClassificationLevelChange(1, detalle.id);
            console.log('[VOUCHER] Detalle seleccionado:', detalle.label, '(id:', detalle.id, ')');
          } else {
            console.warn('[VOUCHER] No se encontró detalle "CANCELACION". Opciones:', children.map(c => c.label));
          }
        } else {
          console.warn('[VOUCHER] No se encontraron hijos para categoría:', categoria.id);
        }
      }, 150);
    } else {
      console.warn('[VOUCHER] No se encontró categoría "CONTACTO DIRECTO". Opciones:', roots.map(r => r.label));
    }
  }

  /**
   * Selecciona una cuota para cancelación e inicializa los campos editables
   */
  onSelectCuotaForCancellation(cuota: any): void {
    this.selectedInstallmentForCancellation.set(cuota);
    // Inicializar monto con el valor de la cuota
    this.montoPagoEditable.set(cuota.monto || 0);
    // Inicializar fecha con hoy
    this.fechaPagoEditable.set(new Date().toISOString().split('T')[0]);
  }

  /**
   * Maneja cambios en el monto del pago editable
   */
  onMontoPagoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value) || 0;
    this.montoPagoEditable.set(value);
  }

  /**
   * Maneja cambios en la fecha del pago editable
   */
  onFechaPagoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fechaPagoEditable.set(input.value);
  }

  /**
   * Parsea la fecha del OCR a formato YYYY-MM-DD
   * Soporta formatos comunes: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, DD/MM/YY
   */
  private parseFechaOcr(fechaStr: string): string | null {
    if (!fechaStr) return null;

    // Limpiar espacios
    fechaStr = fechaStr.trim();

    // Si ya está en formato YYYY-MM-DD, devolverlo
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      return fechaStr;
    }

    // Formato DD/MM/YYYY o DD-MM-YYYY
    let match = fechaStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = match[2].padStart(2, '0');
      const year = match[3];
      return `${year}-${month}-${day}`;
    }

    // Formato DD/MM/YY
    match = fechaStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/);
    if (match) {
      const day = match[1].padStart(2, '0');
      const month = match[2].padStart(2, '0');
      const year = parseInt(match[3]) > 50 ? `19${match[3]}` : `20${match[3]}`;
      return `${year}-${month}-${day}`;
    }

    console.warn('[COMPROBANTE] No se pudo parsear la fecha OCR:', fechaStr);
    return null;
  }

  // ==================== CARTA DE ACUERDO ====================

  /**
   * Muestra el modal de confirmación para generar Carta de Acuerdo después de guardar promesa
   */
  private mostrarModalGenerarCarta(idGestion: number, contactLabel: string, managementLabel: string): void {
    const dialogRef = this.dialog.open(ConfirmCartaDialogComponent, {
      width: '400px',
      disableClose: true,
      data: { idGestion }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'generate') {
        // Generar carta y luego finalizar
        this.generarCartaYFinalizar(idGestion, contactLabel, managementLabel);
      } else {
        // Usuario eligió "Ahora no", solo finalizar
        this.onSaveSuccess(contactLabel, managementLabel);
      }
    });
  }

  /**
   * Genera la carta de acuerdo y luego finaliza la gestión
   */
  private generarCartaYFinalizar(idGestion: number, contactLabel: string, managementLabel: string): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('⚠️ No se puede generar la carta: usuario no encontrado');
      this.onSaveSuccess(contactLabel, managementLabel);
      return;
    }

    console.log('📄 Generando Carta de Acuerdo para gestión:', idGestion);

    this.cartaAcuerdoService.generarCarta(idGestion, user.id).subscribe({
      next: (blob) => {
        this.cartaAcuerdoService.descargarPdf(blob, `carta_acuerdo_${idGestion}.pdf`);
        console.log('✅ Carta de Acuerdo generada exitosamente');
        alert('✅ Carta de Acuerdo generada exitosamente');
        this.onSaveSuccess(contactLabel, managementLabel);
      },
      error: (error) => {
        console.error('❌ Error generando carta:', error);
        alert('⚠️ Error al generar la Carta de Acuerdo. La gestión se guardó correctamente.');
        this.onSaveSuccess(contactLabel, managementLabel);
      }
    });
  }
}