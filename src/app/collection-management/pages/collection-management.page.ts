import { Component, OnInit, OnDestroy, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

import { SystemConfigService } from '../services/system-config.service';
import { ManagementService, CreateManagementRequest, StartCallRequest, EndCallRequest, RegisterPaymentRequest } from '../services/management.service';
import { PaymentScheduleService } from '../services/payment-schedule.service';
import { ThemeService } from '../../shared/services/theme.service';
import { ManagementClassification } from '../models/system-config.model';
import { CustomerData } from '../models/customer.model';
import { ManagementForm, ValidationErrors } from '../models/management.model';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio } from '../../maintenance/models/portfolio.model';
import { TypificationService } from '../../maintenance/services/typification.service';
import { ApiSystemConfigService } from '../services/api-system-config.service';
import { DynamicFieldRendererComponent } from '../components/dynamic-field-renderer/dynamic-field-renderer.component';
import { MetadataSchema, FieldConfig } from '../../maintenance/models/field-config.model';
import { CustomerOutputConfigService } from '../../maintenance/services/customer-output-config.service';
import { PaymentScheduleViewComponent } from '../components/payment-schedule-view/payment-schedule-view.component';
import { CustomerService } from '../../customers/services/customer.service';
import { SipService, CallState } from '../../core/services/sip.service';
import { AgentService } from '../../core/services/agent.service';
import { AgentState } from '../../core/models/agent-status.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-collection-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DynamicFieldRendererComponent,
    PaymentScheduleViewComponent
  ],
  template: `
    <div class="h-[100dvh] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-black flex flex-col overflow-hidden transition-colors duration-300">
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

      <!-- Alerta de Promesa de Pago Activa -->
      @if (activePaymentSchedules() && activePaymentSchedules().length > 0) {
        <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-[slideInDown_0.5s_ease-out]">
          @for (schedule of activePaymentSchedules(); track schedule.id) {
            <div class="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-600 dark:via-yellow-600 dark:to-amber-700 text-white px-6 py-3 rounded-lg shadow-2xl mb-2">
              <div class="flex items-center gap-3">
                <div class="text-2xl">📅</div>
                <div>
                  <div class="font-bold text-base">Promesa de Pago Activa</div>
                  <div class="text-sm opacity-90">
                    Monto: S/ {{ schedule.totalAmount?.toFixed(2) || '0.00' }}
                    @if (schedule.installments && schedule.installments.length > 0 && schedule.installments[0].dueDate) {
                      - Vencimiento: {{ formatDate(schedule.installments[0].dueDate) }}
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Header Principal - ULTRA COMPACTO -->
      <div class="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white shadow-md relative overflow-hidden">
        <div class="relative px-3 py-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div>
                <div class="flex items-center gap-1.5">
                  <div class="bg-blue-500 dark:bg-blue-600 p-1 rounded">
                  </div>
                  <div>
                    <h1 class="text-sm font-bold">Gestión de Cobranza</h1>
                    <p class="text-[9px] text-blue-200 dark:text-blue-300 flex items-center gap-0.5">
                      {{ campaign().nombre }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="h-6 w-px bg-white/20"></div>
              <div class="text-xs">
                <div class="text-blue-200 dark:text-blue-300 text-[9px]">Asesor</div>
                <div class="font-semibold text-white text-xs">María González Castro</div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Botón de Dark Mode -->
              <button
                (click)="toggleDarkMode()"
                [class]="'flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-300 group border ' +
                  (themeService.isDarkMode()
                    ? 'bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/40'
                    : 'bg-blue-500/90 hover:bg-blue-600 border-blue-600')"
                [attr.aria-label]="themeService.isDarkMode() ? 'Activar modo claro' : 'Activar modo oscuro'"
                title="Cambiar tema"
              >
                @if (themeService.isDarkMode()) {
                  <span class="text-[10px] text-yellow-300 font-semibold">OSCURO</span>
                } @else {
                  <span class="text-[10px] text-white font-semibold">CLARO</span>
                }
              </button>

              <div class="h-6 w-px bg-white/20"></div>

              <div class="text-right">
                <div class="text-blue-200 dark:text-blue-300 text-[9px]">Estado</div>
                <div [class]="'font-semibold text-xs transition-all duration-300 ' + (callActive() ? 'text-green-400 animate-pulse' : isTipifying() ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-200')">
                  {{ callActive() ? '● EN LLAMADA' : isTipifying() ? '✎ TIPIFICANDO' : '○ DISPONIBLE' }}
                </div>
              </div>
              <div [class]="'px-3 py-1 rounded font-mono text-base font-bold transition-all duration-300 ' + (callActive() ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse' : 'bg-slate-800/50 dark:bg-gray-900/80')">
                {{ formatTime(callDuration()) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal - LAYOUT 3 COLUMNAS -->
      <div class="flex-1 flex overflow-hidden">
        <!-- PANEL IZQUIERDO - Info Cliente -->
        <div class="w-64 bg-white dark:bg-slate-900 border-r dark:border-slate-800 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          <!-- Tabs -->
          <div class="flex border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
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
                  <!-- Lista vertical de campos -->
                  @for (field of customerOutputFields(); track field.id) {
                    <div class="pb-1.5 border-b border-slate-100 dark:border-slate-800">
                      <div class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-medium">{{ field.label }}</div>
                      <div class="text-[12px] font-semibold text-slate-800 dark:text-white break-words">
                        {{ formatFieldValue(getFieldValue(field.field), field.format) }}
                      </div>
                    </div>
                  }
                  @if (customerOutputFields().length === 0) {
                    <div class="text-center py-2 text-slate-400 text-[10px]">
                      Sin campos configurados
                    </div>
                  }
                </div>
              }

              @if (activeTab() === 'cuenta') {
                <div class="space-y-1.5">
                  <!-- Producto -->
                  <div class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">Producto</div>
                  <div class="space-y-0.5 text-[10px]">
                    <div class="flex justify-between"><span class="text-slate-500">Tipo:</span><span class="font-semibold text-slate-800 dark:text-white">{{ customerData().cuenta.tipo_producto }}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">Monto:</span><span class="font-semibold text-slate-800 dark:text-white">S/ {{ customerData().cuenta.monto_original.toFixed(2) }}</span></div>
                    <div class="flex justify-between"><span class="text-slate-500">Plazo:</span><span class="font-semibold text-slate-800 dark:text-white">{{ customerData().cuenta.plazo_meses }}m</span></div>
                  </div>
                  <!-- Deuda -->
                  <div class="text-[9px] font-bold text-red-500 uppercase mt-2">Deuda</div>
                  <div class="space-y-0.5 text-[10px]">
                    <div class="flex justify-between"><span class="text-red-400">Capital:</span><span class="font-semibold text-red-600 dark:text-red-300">S/ {{ customerData().deuda.saldo_capital.toFixed(2) }}</span></div>
                    <div class="flex justify-between"><span class="text-red-400">Intereses:</span><span class="font-semibold text-red-600 dark:text-red-300">S/ {{ customerData().deuda.intereses_vencidos.toFixed(2) }}</span></div>
                    <div class="flex justify-between"><span class="text-red-400">Mora:</span><span class="font-semibold text-red-600 dark:text-red-300">S/ {{ customerData().deuda.mora_acumulada.toFixed(2) }}</span></div>
                    <div class="flex justify-between bg-red-100 dark:bg-red-950/50 rounded px-1 py-0.5 mt-1">
                      <span class="font-bold text-red-700 dark:text-red-200">TOTAL:</span>
                      <span class="font-bold text-red-700 dark:text-red-200">S/ {{ customerData().deuda.saldo_total.toFixed(2) }}</span>
                    </div>
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
                (dataChange)="onDynamicFieldsChange($event)"
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
                              <span class="text-gray-500 dark:text-gray-400">Vence: {{ installment.dueDate }}</span>
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

            <!-- Botones de Acción - COMPACTOS -->
            <div class="flex gap-2 pt-2">
              <button
                (click)="saveManagement()"
                [disabled]="saving() || !isFormValid()"
                [title]="'Guardando: ' + saving() + ' | Válido: ' + isFormValid()"
                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white dark:text-white disabled:text-gray-200 py-2 px-4 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                @if (saving()) {
                  Guardando...
                } @else {
                  Guardar Gestión
                }
              </button>
              <button
                (click)="cancelarTipificacion()"
                class="px-6 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white dark:text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        <!-- PANEL DERECHO - Contactos y Acciones Rápidas -->
        <div class="w-64 bg-white dark:bg-slate-900 border-l dark:border-slate-800 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          <!-- Teléfonos -->
          <div class="p-2 border-b dark:border-slate-800">
            <div class="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5">Contacto</div>
            <div class="space-y-1">
              <div class="flex items-center gap-2 p-1.5 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                <span class="text-green-600 dark:text-green-400 text-sm">📱</span>
                <div class="flex-1 min-w-0">
                  <div class="text-[9px] text-green-600 dark:text-green-400">Principal</div>
                  <div class="text-[11px] font-bold text-green-700 dark:text-green-300 truncate">{{ customerData().contacto.telefono_principal }}</div>
                </div>
              </div>
              @if (customerData().contacto.telefono_alternativo) {
                <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span class="text-slate-500 text-sm">📞</span>
                  <div class="flex-1 min-w-0">
                    <div class="text-[9px] text-slate-500 dark:text-slate-400">Alternativo</div>
                    <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{{ customerData().contacto.telefono_alternativo }}</div>
                  </div>
                </div>
              }
              @if (customerData().contacto.telefono_trabajo) {
                <div class="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span class="text-slate-500 text-sm">🏢</span>
                  <div class="flex-1 min-w-0">
                    <div class="text-[9px] text-slate-500 dark:text-slate-400">Trabajo</div>
                    <div class="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">{{ customerData().contacto.telefono_trabajo }}</div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Email y Dirección -->
          <div class="p-2 border-b dark:border-slate-800">
            <div class="space-y-1">
              @if (customerData().contacto.email) {
                <div class="flex items-start gap-2">
                  <span class="text-blue-500 text-sm">✉️</span>
                  <div class="text-[10px] text-gray-600 dark:text-gray-300 break-all">{{ customerData().contacto.email }}</div>
                </div>
              }
              @if (customerData().contacto.direccion) {
                <div class="flex items-start gap-2">
                  <span class="text-orange-500 text-sm">📍</span>
                  <div class="text-[10px] text-gray-600 dark:text-gray-300 line-clamp-2">{{ customerData().contacto.direccion }}</div>
                </div>
              }
            </div>
          </div>

          <!-- Resumen Rápido Deuda -->
          <div class="p-2 bg-red-50 dark:bg-red-950/20">
            <div class="text-center">
              <div class="text-[9px] text-red-500 uppercase font-bold">Deuda Total</div>
              <div class="text-lg font-black text-red-600 dark:text-red-400">S/ {{ customerData().deuda.saldo_total.toFixed(2) }}</div>
              <div class="text-[10px] text-red-500 dark:text-red-400">{{ customerData().deuda.dias_mora }} días mora</div>
            </div>
          </div>

          <!-- Último Pago -->
          <div class="p-2 flex-1">
            <div class="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Último Pago</div>
            <div class="text-[10px] text-gray-600 dark:text-gray-300">
              <div>{{ customerData().deuda.fecha_ultimo_pago }}</div>
              <div class="font-bold text-green-600 dark:text-green-400">S/ {{ customerData().deuda.monto_ultimo_pago.toFixed(2) }}</div>
            </div>
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
  protected historialGestiones = signal<Array<{
    id: number;
    fecha: string;
    asesor: string;
    resultado: string;
    gestion: string;
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

  tabs = [
    { id: 'cliente', label: 'Cliente', icon: 'user' },
    { id: 'cuenta', label: 'Cuenta', icon: 'wallet' },
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

  private callTimer?: number;
  private managementId?: string;
  private callStartTime?: string;

  private callStateSubscription?: Subscription;
  private incomingCallSubscription?: Subscription;
  public callState: CallState = CallState.IDLE;
  public isMuted = signal(false);
  private incomingPhoneNumber: string | null = null;

  constructor(
    private systemConfigService: SystemConfigService,
    private managementService: ManagementService,
    private paymentScheduleService: PaymentScheduleService,
    public themeService: ThemeService,
    private classificationService: TypificationService,
    private apiSystemConfigService: ApiSystemConfigService,
    private customerOutputConfigService: CustomerOutputConfigService,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sipService: SipService,
    private agentService: AgentService,
    private authService: AuthService
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
   */
  private loadCustomerFromDynamicTable(client: any) {
    // Mapear los datos de la tabla dinámica al formato de CustomerData
    this.customerData.set({
      id: client.id || 0,
      id_cliente: client.documento,
      nombre_completo: client.nombre || client.nombres + ' ' + (client.apellidos || ''),
      tipo_documento: 'DNI',
      numero_documento: client.documento,
      fecha_nacimiento: '',
      edad: 0,
      contacto: {
        telefono_principal: client.telefono || client.telefono_1 || '',
        telefono_alternativo: client.telefono_2 || '',
        telefono_trabajo: client.telefono_3 || '',
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

    console.log('✅ [MANUAL] Cliente cargado exitosamente');
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
   */
  private loadClienteDetalle(contactId: number) {
    console.log(`📋 Cargando datos del cliente para contacto ${contactId}...`);

    // Llamar al endpoint que trae datos completos del cliente
    this.http.get<any>(`${environment.gatewayUrl}/contacts/${contactId}/cliente-detalle`).pipe(
      catchError((error) => {
        console.error('❌ Error cargando datos del cliente:', error);
        // Mantener datos hardcodeados si falla
        return of(null);
      })
    ).subscribe({
      next: (clienteDetalle) => {
        if (clienteDetalle) {
          console.log('✅ Cliente cargado:', clienteDetalle);

          // Mapear los datos del backend al formato del signal
          this.customerData.set({
            id: clienteDetalle.idCliente,
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

          console.log('✅ Datos del cliente actualizados en la UI');

          // 📅 Cargar cronogramas de promesas de pago activos
          this.loadActivePaymentSchedules(clienteDetalle.idCliente);
        } else {
          console.log('⚠️ No se pudieron cargar los datos del cliente');
        }
      }
    });
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
      next: (schedules) => {
        console.log('✅ Cronogramas activos cargados:', schedules);
        this.activePaymentSchedules.set(schedules);

        // Si hay promesas activas, mostrar alerta
        if (schedules && schedules.length > 0) {
          console.log(`📅 ¡Cliente tiene ${schedules.length} promesa(s) de pago activa(s)!`);
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
      { id: 'direccion', label: 'Dirección', field: 'contacto.direccion', category: 'contact', format: 'text', highlight: false, size: 'full' },
      { id: 'edad', label: 'Edad', field: 'edad', category: 'personal', format: 'number', highlight: false, size: 'small' },
      { id: 'saldo_total', label: 'Deuda Total', field: 'deuda.saldo_total', category: 'debt', format: 'currency', highlight: true, size: 'small' },
      { id: 'dias_mora', label: 'Días de Mora', field: 'deuda.dias_mora', category: 'debt', format: 'number', highlight: true, size: 'small' },
      { id: 'numero_cuenta', label: 'Nro. Cuenta', field: 'cuenta.numero_cuenta', category: 'account', format: 'text', highlight: false, size: 'medium' },
      { id: 'tipo_producto', label: 'Producto', field: 'cuenta.tipo_producto', category: 'account', format: 'text', highlight: false, size: 'medium' }
    ]);
  }

  loadManagementHistory() {
    const customerId = String(this.customerData().id);
    console.log('[HISTORIAL] Cargando historial para cliente ID:', customerId);

    this.managementService.getManagementsByCustomer(customerId).subscribe({
      next: (managements) => {
        console.log('[HISTORIAL] Gestiones recibidas del backend:', managements);
        console.log('[HISTORIAL] Total de gestiones:', managements.length);

        // Mapear gestiones y cargar cronogramas
        const historial = managements.map(m => {
          // Formatear fecha y hora desde los campos de la gestión
          const fechaHora = m.managementDate && m.managementTime
            ? `${m.managementDate} ${m.managementTime}`
            : new Date().toLocaleString('es-PE');

          const historyItem = {
            id: m.id,
            fecha: fechaHora,
            asesor: m.advisorId,
            resultado: 'Gestión realizada',
            gestion: m.level3Name || m.level2Name || m.level1Name || '-',
            observacion: m.observations || 'Sin observaciones',
            duracion: '00:00:00', // TEMPORAL: No hay callDetail en el nuevo modelo
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
        console.log('✅ Estado cambiado a DISPONIBLE, navegando al dashboard...');
        // Navegar DESPUÉS de cambiar el estado exitosamente
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('❌ Error al cambiar estado:', error);
        // Navegar igual aunque falle el cambio de estado
        this.router.navigate(['/dashboard']);
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
    const customerId = String(this.customerData().id);
    console.log('[SCHEDULE] Loading active schedules for customer ID:', customerId);

    this.isLoadingSchedules.set(true);
    this.managementService.getActiveSchedulesByCustomer(customerId).subscribe({
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

    const request: CreateManagementRequest = {
      customerId: String(this.customerData().id),
      advisorId: 'ADV-001',

      // Multi-tenant fields
      tenantId: this.selectedTenantId!,
      portfolioId: this.selectedPortfolioId || 1, // Temporal: asignar 1 si no está seleccionado
      subPortfolioId: 1, // Temporal: asignar 1

      // Phone from customer data
      phone: this.customerData().contacto?.telefono_principal || '',

      // Hierarchy levels with IDs and names
      level1Id: typificationLevel1Id,
      level1Name: level1?.label || '',
      level2Id: typificationLevel2Id,
      level2Name: level2?.label || null,
      level3Id: typificationLevel3Id,
      level3Name: level3?.label || null,

      observations: this.managementForm.observaciones
    };

    this.managementService.createManagement(request).subscribe({
      next: (response) => {
        if (this.callStartTime && this.callActive()) {
          this.registerCallToBackend(response.id);
        }

        // NOTA: Los pagos ahora se registran automáticamente en el backend desde dynamicFields
        // El backend detecta clasificaciones con requiresPayment=true y procesa los campos
        // monto_pagado, metodo_pago, numero_operacion, fecha_pago, etc.
        // Ya no es necesario llamar a registerPaymentToBackend() aquí

        // El cronograma se crea automáticamente en el backend desde dynamicFields
        // No es necesario llamar a createScheduleToBackend() aquí

        this.onSaveSuccess(contactClassification?.label || '', managementClassification?.label || '-');
      },
      error: (error) => {
        console.error('Error al guardar gestión:', error);
        this.saving.set(false);
        alert('⚠️ Error al guardar la gestión. Por favor intente nuevamente.');
      }
    });
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

    // Cambiar estado a DISPONIBLE y volver al dashboard
    console.log('✅ Gestión guardada, cambiando estado a DISPONIBLE...');

    // Desbloquear llamadas entrantes - tipificación completada
    this.isTipifying.set(false);
    this.sipService.blockIncomingCallsMode(false);
    console.log('✅ Desbloqueando llamadas entrantes - tipificación completada');

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
   * Formatea una fecha para mostrar en la UI
   */
  formatDate(dateValue: string | Date): string {
    if (!dateValue) return '-';

    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return String(dateValue);
    }
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
}