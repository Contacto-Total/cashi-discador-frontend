import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, CustomerResource, PagosClienteResponse, GrupoPagos } from '../../services/customer.service';
import { ApiSystemConfigService } from '../../../collection-management/services/api-system-config.service';
import { ManagementService, CreateManagementRequest } from '../../../collection-management/services/management.service';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [class]="customer() ? 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col overflow-hidden' : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col'" [style.height]="customer() ? 'calc(100vh - 56px)' : 'auto'" [style.min-height]="!customer() ? 'calc(100vh - 56px)' : 'auto'">

      @if (!customer()) {
        <!-- Search Screen -->
        <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
          <!-- Header -->
          <div class="max-w-7xl mx-auto mb-6">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Buscar Cliente</h1>
                <p class="text-sm text-gray-600 dark:text-gray-400">Encuentra clientes por documento, cuenta o teléfono</p>
              </div>
            </div>
          </div>

          <!-- Search Bar -->
          <div class="max-w-7xl mx-auto mb-6">
            <div class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl p-4 shadow-lg">
              <div class="flex gap-2 items-center">
                <select [(ngModel)]="searchCriteria"
                        class="px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                  @for (option of searchCriteriaOptions; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
                <input type="text"
                       [(ngModel)]="searchDocument"
                       (keyup.enter)="searchCustomer()"
                       [placeholder]="'Ingrese ' + getSelectedCriteriaLabel().toLowerCase()"
                       class="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                @if (searchPerformed() || showMultipleResults()) {
                  <button (click)="clearSearch()"
                          class="px-5 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:shadow-lg hover:shadow-gray-500/50 transition-all font-semibold cursor-pointer flex items-center gap-2">
                    <span>Limpiar</span>
                  </button>
                }
                <button (click)="searchCustomer()"
                        [disabled]="loading()"
                        class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg hover:shadow-blue-600/50 transition-all font-semibold cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  @if (loading()) {
                  } @else {
                  }
                  <span>{{ loading() ? 'Buscando...' : 'Buscar' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="max-w-7xl mx-auto">
              @if (searchPerformed() && !customer() && !loading() && !showMultipleResults()) {
                <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700/50 rounded-lg flex items-center gap-2">
                  <p class="text-red-600 dark:text-red-400 text-sm">Cliente no encontrado: <strong>{{ searchDocument }}</strong></p>
                </div>
              }

              @if (showMultipleResults() && searchResults().length > 0) {
                <div>
                  <div class="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700/50 rounded-lg flex items-center gap-2">
                    <p class="text-blue-600 dark:text-blue-400 text-sm font-semibold">Se encontraron {{ searchResults().length }} cuentas para este cliente. Seleccione una:</p>
                  </div>

                  <!-- Tabla de Datos del Cliente (Encabezado) -->
                  <div class="mb-3">
                    <table class="w-full text-xs border-collapse">
                      <thead>
                        <tr class="bg-blue-100 dark:bg-blue-900/30">
                          <th class="px-2 py-2 text-left text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-700">Nombre Completo</th>
                          <th class="px-2 py-2 text-left text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-700">Documento</th>
                          <th class="px-2 py-2 text-left text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-700">Edad</th>
                          <th class="px-2 py-2 text-left text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-700">Email</th>
                          <th class="px-2 py-2 text-left text-blue-900 dark:text-blue-200 font-bold border border-blue-200 dark:border-blue-700">Dirección</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="bg-white dark:bg-slate-700">
                          <td class="px-2 py-2 text-gray-900 dark:text-white font-semibold border border-gray-300 dark:border-slate-600">{{ searchResults()[0]?.fullName || 'N/A' }}</td>
                          <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ searchResults()[0]?.documentNumber || 'N/A' }}</td>
                          <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ searchResults()[0]?.age || 'N/A' }}</td>
                          <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ getFirstEmail(searchResults()[0]) || 'N/A' }}</td>
                          <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ searchResults()[0]?.address || 'N/A' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Tabla de Cuentas -->
                  <div class="overflow-x-auto max-h-96">
                    <table class="w-full text-xs border-collapse">
                      <thead>
                        <tr class="bg-gray-200 dark:bg-slate-700">
                          <th class="px-2 py-2 text-left text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">ID</th>
                          <th class="px-2 py-2 text-left text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Proveedor</th>
                          <th class="px-2 py-2 text-left text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Cartera</th>
                          <th class="px-2 py-2 text-left text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Subcartera</th>
                          <th class="px-2 py-2 text-left text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Cuenta</th>
                          <th class="px-2 py-2 text-right text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Días Mora</th>
                          <th class="px-2 py-2 text-right text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Monto Mora</th>
                          <th class="px-2 py-2 text-right text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Capital</th>
                          <th class="px-2 py-2 text-center text-gray-800 dark:text-gray-200 font-bold border border-gray-300 dark:border-slate-600">Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (result of searchResults(); track result.id) {
                          <tr class="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                            <td class="px-2 py-2 text-gray-900 dark:text-white font-mono border border-gray-300 dark:border-slate-600">{{ result.id }}</td>
                            <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ result.tenantName || 'N/A' }}</td>
                            <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ result.portfolioName || 'N/A' }}</td>
                            <td class="px-2 py-2 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600">{{ result.subPortfolioName || 'N/A' }}</td>
                            <td class="px-2 py-2 text-gray-900 dark:text-white font-mono border border-gray-300 dark:border-slate-600">{{ result.accountNumber || 'N/A' }}</td>
                            <td class="px-2 py-2 text-right border border-gray-300 dark:border-slate-600">
                              <span [class]="result.overdueDays && result.overdueDays > 0 ? 'px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded font-semibold' : 'text-gray-900 dark:text-white'">
                                {{ result.overdueDays ?? 0 }}
                              </span>
                            </td>
                            <td class="px-2 py-2 text-right text-gray-900 dark:text-white font-mono border border-gray-300 dark:border-slate-600">
                              {{ result.overdueAmount ? (result.overdueAmount | number:'1.2-2') : '0.00' }}
                            </td>
                            <td class="px-2 py-2 text-right text-gray-900 dark:text-white font-mono border border-gray-300 dark:border-slate-600">
                              {{ result.principalAmount ? (result.principalAmount | number:'1.2-2') : '0.00' }}
                            </td>
                            <td class="px-2 py-2 text-center border border-gray-300 dark:border-slate-600">
                              <button (click)="selectCustomerFromResults(result)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors">
                                Gestionar
                              </button>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              @if (recentCustomers().length > 0 && !showMultipleResults() && !searchPerformed()) {
                <div class="mt-6">
                  <div class="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl p-4 shadow-lg">
                    <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Clientes recientes:</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      @for (customer of recentCustomers(); track customer.document) {
                        <button (click)="quickSearch(customer.document)"
                                class="px-3 py-2.5 bg-gray-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 rounded-lg text-xs transition-colors cursor-pointer text-left border border-gray-200 dark:border-slate-600">
                          <div class="flex items-start justify-between gap-2">
                            <div class="flex-1">
                              <div class="font-bold text-sm">{{ customer.document }}</div>
                              <div class="text-[0.6875rem] text-gray-600 dark:text-gray-400 mt-0.5">{{ customer.fullName }}</div>
                            </div>
                          </div>
                          <div class="flex items-center gap-1.5 mt-2 text-[0.625rem] text-gray-500 dark:text-gray-400">
                            <span class="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded font-medium">{{ customer.tenantName }}</span>
                            <span class="text-gray-400 dark:text-gray-500">›</span>
                            <span class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-medium">{{ customer.portfolioName }}</span>
                            <span class="text-gray-400 dark:text-gray-500">›</span>
                            <span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-medium">{{ customer.subPortfolioName }}</span>
                          </div>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }
          </div>
        </div>
      } @else {
        <!-- Customer Profile View - Compact Layout -->
        <div class="flex-1 flex overflow-hidden">

          <!-- Compact Sidebar with Age-based Avatar -->
          <div class="w-72 bg-white dark:bg-slate-900 border-r border-gray-300 dark:border-slate-700 flex flex-col p-2">
            <!-- Avatar con gradiente según edad -->
            <div class="text-center mb-2">
              <div [class]="getAvatarClass()" class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              </div>
              <h2 class="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight">{{ getFieldValue('nombre_completo') || 'N/A' }}</h2>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-1">{{ customer()!.documentNumber }}</p>

              <!-- Código de Identificación con badge -->
              @if (getFieldValue('codigo_identificacion')) {
                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-300 dark:border-indigo-600/50 rounded-lg mt-2">
                  <span class="text-xs font-mono text-indigo-700 dark:text-indigo-300">{{ getFieldValue('codigo_identificacion') }}</span>
                </div>
              }
            </div>

            <!-- Quick Stats con iconos y colores -->
            <div class="space-y-2 mb-2">
              <div class="flex items-center gap-2 p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border border-blue-200 dark:border-blue-600/30 rounded-lg">
                <div class="p-1.5 bg-blue-200 dark:bg-blue-600/30 rounded">
                </div>
                <div class="flex-1">
                  <p class="text-[0.625rem] text-gray-600 dark:text-gray-400 leading-none">Edad</p>
                  <p class="text-sm text-gray-900 dark:text-white font-bold">{{ getFieldValue('edad') || 'N/A' }} años</p>
                </div>
                <span [class]="getAgeBadgeClass()" class="text-[0.625rem] px-2 py-0.5 rounded-full font-semibold">
                  {{ getAgeCategory() }}
                </span>
              </div>

              <div class="flex items-center gap-2 p-2.5 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20 border border-purple-200 dark:border-purple-600/30 rounded-lg">
                <div class="p-1.5 bg-purple-200 dark:bg-purple-600/30 rounded">
                </div>
                <div class="flex-1">
                  <p class="text-[0.625rem] text-gray-600 dark:text-gray-400 leading-none">Estado Civil</p>
                  <p class="text-sm text-gray-900 dark:text-white font-semibold">{{ getFieldValue('estado_civil') || 'N/A' }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 p-2.5 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20 border border-orange-200 dark:border-orange-600/30 rounded-lg">
                <div class="p-1.5 bg-orange-200 dark:bg-orange-600/30 rounded">
                </div>
                <div class="flex-1">
                  <p class="text-[0.625rem] text-gray-600 dark:text-gray-400 leading-none">Ocupación</p>
                  <p class="text-xs text-gray-900 dark:text-white font-semibold leading-tight">{{ getFieldValue('ocupacion') || 'N/A' }}</p>
                </div>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="space-y-2">
              <!-- Botón Nueva Gestión -->
              <button (click)="openNewManagement()"
                      class="w-full px-3 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-green-600/50">
                <span>Nueva Gestión</span>
              </button>

              <button (click)="clearCustomer()"
                      class="w-full px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-blue-600/50">
                <span>Buscar Otro Cliente</span>
              </button>
            </div>
          </div>

          <!-- Main Content - Compact Table View -->
          <div class="flex-1 flex flex-col overflow-hidden">

            <!-- Tabs con colores -->
            <div class="bg-white dark:bg-slate-800 border-b-2 border-gray-200 dark:border-slate-700 px-4 flex items-center gap-1 shadow-sm">
              <button (click)="activeTab.set('personal')"
                      [class]="activeTab() === 'personal' ? 'border-b-2 border-blue-500 text-blue-700 dark:text-white bg-blue-100 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-blue-700 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Personal</span>
                </div>
              </button>
              <button (click)="activeTab.set('contacto')"
                      [class]="activeTab() === 'contacto' ? 'border-b-2 border-green-500 text-green-700 dark:text-white bg-green-100 dark:bg-green-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-green-700 dark:hover:text-white hover:bg-green-50 dark:hover:bg-green-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Contacto</span>
                </div>
              </button>
              <button (click)="activeTab.set('ubicacion')"
                      [class]="activeTab() === 'ubicacion' ? 'border-b-2 border-purple-500 text-purple-700 dark:text-white bg-purple-100 dark:bg-purple-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Ubicación</span>
                </div>
              </button>
              <button (click)="activeTab.set('referencias')"
                      [class]="activeTab() === 'referencias' ? 'border-b-2 border-indigo-500 text-indigo-700 dark:text-white bg-indigo-100 dark:bg-indigo-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-indigo-700 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Referencias</span>
                </div>
              </button>

              <button (click)="activeTab.set('cuentas')"
                      [class]="activeTab() === 'cuentas' ? 'border-b-2 border-green-500 text-green-700 dark:text-white bg-green-100 dark:bg-green-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-green-700 dark:hover:text-white hover:bg-green-50 dark:hover:bg-green-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Cuenta</span>
                </div>
              </button>
              <button (click)="onTabPagosClick()"
                      [class]="activeTab() === 'pagos' ? 'border-b-2 border-amber-500 text-amber-700 dark:text-white bg-amber-100 dark:bg-amber-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-amber-700 dark:hover:text-white hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Pagos</span>
                  @if (pagosCliente()?.cantidadPagos) {
                    <span class="px-1.5 py-0.5 bg-amber-600 text-white text-[0.625rem] rounded-full">{{ pagosCliente()?.cantidadPagos }}</span>
                  }
                </div>
              </button>
              <button (click)="onTabGestionesClick()"
                      [class]="activeTab() === 'gestiones' ? 'border-b-2 border-slate-500 text-slate-700 dark:text-white bg-slate-100 dark:bg-slate-900/20' : 'text-gray-600 dark:text-gray-400'"
                      class="px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-t-lg">
                <div class="flex items-center gap-1.5">
                  <span>Gestiones</span>
                  @if (historialGestiones().length > 0) {
                    <span class="px-1.5 py-0.5 bg-slate-600 text-white text-[0.625rem] rounded-full">{{ historialGestiones().length }}</span>
                  }
                </div>
              </button>
            </div>

            <!-- Content Area - Mini Secciones -->
            <div class="flex-1 overflow-y-auto p-1 bg-gray-50 dark:bg-slate-900/50">
              <div class="max-w-6xl">

                <!-- Personal Tab con Mini Secciones -->
                @if (activeTab() === 'personal') {
                  <div class="space-y-2">

                    <!-- Sección: Identificación -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-1.5 border border-indigo-200 dark:border-indigo-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-indigo-100 dark:bg-indigo-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">Identificación</h3>
                      </div>
                      <div class="grid grid-cols-2 gap-1.5">
                        @for (field of getFieldsBySection('personal', ['codigo_identificacion', 'documento']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Sección: Información Personal -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-1.5 border border-cyan-200 dark:border-cyan-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-cyan-100 dark:bg-cyan-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-cyan-700 dark:text-cyan-300 uppercase tracking-wide">Información Personal</h3>
                      </div>
                      <div class="grid grid-cols-3 gap-1.5">
                        @for (field of getFieldsBySection('personal', ['primer_nombre', 'segundo_nombre', 'primer_apellido', 'segundo_apellido', 'nombre_completo']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Sección: Datos Demográficos -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-1.5 border border-green-200 dark:border-green-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-green-100 dark:bg-green-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Datos Demográficos</h3>
                      </div>
                      <div class="grid grid-cols-3 gap-1.5">
                        @for (field of getFieldsBySection('personal', ['fecha_nacimiento', 'edad', 'estado_civil']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Sección: Información Laboral -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-orange-200 dark:border-orange-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-orange-100 dark:bg-orange-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Información Laboral</h3>
                      </div>
                      <div class="grid grid-cols-2 gap-1.5">
                        @for (field of getFieldsBySection('personal', ['ocupacion', 'tipo_cliente']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                  </div>
                }

                <!-- Contacto Tab con Mini Secciones -->
                @if (activeTab() === 'contacto') {
                  <div class="space-y-2">

                    <!-- Sección: Teléfonos -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-green-200 dark:border-green-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-green-100 dark:bg-green-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Teléfonos</h3>
                      </div>
                      @if (getPhoneContactMethods().length > 0) {
                        <div class="grid grid-cols-3 gap-1.5">
                          @for (contact of getPhoneContactMethods(); track contact.id) {
                            <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                              <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ getContactLabel(contact.subtype) }}</p>
                              <p class="text-xs text-gray-900 dark:text-white font-medium">{{ contact.value }}</p>
                            </div>
                          }
                        </div>
                      } @else {
                        <div class="text-xs text-gray-500 dark:text-gray-400 italic">No hay teléfonos registrados</div>
                      }
                    </div>

                    <!-- Sección: Correo Electrónico -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-purple-200 dark:border-purple-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-purple-100 dark:bg-purple-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Correo Electrónico</h3>
                      </div>
                      @if (getEmailContactMethods().length > 0) {
                        <div class="grid grid-cols-1 gap-1.5">
                          @for (contact of getEmailContactMethods(); track contact.id) {
                            <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                              <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ contact.label || 'Email' }}</p>
                              <p class="text-xs text-gray-900 dark:text-white font-medium">{{ contact.value }}</p>
                            </div>
                          }
                        </div>
                      } @else {
                        <div class="text-xs text-gray-500 dark:text-gray-400 italic">No hay emails registrados</div>
                      }
                    </div>

                  </div>
                }

                <!-- Ubicación Tab con Mini Secciones -->
                @if (activeTab() === 'ubicacion') {
                  <div class="space-y-2">

                    <!-- Sección: Dirección -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-purple-200 dark:border-purple-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-purple-100 dark:bg-purple-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Dirección</h3>
                      </div>
                      <div class="grid grid-cols-1 gap-1.5">
                        @for (field of getFieldsBySection('ubicacion', ['direccion']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Sección: Ubicación Geográfica -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-blue-200 dark:border-blue-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-blue-100 dark:bg-blue-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Ubicación Geográfica</h3>
                      </div>
                      <div class="grid grid-cols-3 gap-1.5">
                        @for (field of getFieldsBySection('ubicacion', ['distrito', 'provincia', 'departamento']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                  </div>
                }

                <!-- Referencias Tab con Mini Secciones -->
                @if (activeTab() === 'referencias') {
                  <div class="space-y-2">

                    <!-- Sección: Referencias Personales -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-indigo-200 dark:border-indigo-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-indigo-100 dark:bg-indigo-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">Referencia Personal</h3>
                      </div>
                      <div class="grid grid-cols-1 gap-1.5">
                        @for (field of getFieldsBySection('referencias', ['referencia_personal']); track field.fieldCode) {
                          <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                            <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ field.fieldName }}</p>
                            <p class="text-xs text-gray-900 dark:text-white font-medium">{{ field.value || 'N/A' }}</p>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Sección: Teléfonos de Referencia -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-blue-200 dark:border-blue-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-blue-100 dark:bg-blue-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Teléfonos de Referencia</h3>
                      </div>
                      @if (getReferenceContactMethods().length > 0) {
                        <div class="grid grid-cols-2 gap-1.5">
                          @for (contact of getReferenceContactMethods(); track contact.id) {
                            <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                              <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">{{ getContactLabel(contact.subtype) }}</p>
                              <p class="text-xs text-gray-900 dark:text-white font-medium">{{ contact.value }}</p>
                            </div>
                          }
                        </div>
                      } @else {
                        <div class="text-xs text-gray-500 dark:text-gray-400 italic">No hay teléfonos de referencia registrados</div>
                      }
                    </div>

                  </div>
                }

                <!-- Cuenta Tab - Información Financiera -->
                @if (activeTab() === 'cuentas') {
                  <div class="space-y-2">

                    <!-- Sección: Número de Cuenta -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-green-200 dark:border-green-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-green-100 dark:bg-green-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-green-700 dark:text-green-300 uppercase tracking-wide">Número de Cuenta</h3>
                      </div>
                      <div class="grid grid-cols-1 gap-1.5">
                        <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                          <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">Número de Cuenta</p>
                          <p class="text-xs text-gray-900 dark:text-white font-medium font-mono">{{ customer()?.accountNumber || 'N/A' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Sección: Información de Mora -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-red-200 dark:border-red-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-red-100 dark:bg-red-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-red-700 dark:text-red-300 uppercase tracking-wide">Información de Mora</h3>
                      </div>
                      <div class="grid grid-cols-2 gap-1.5">
                        <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                          <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">Días de Mora</p>
                          <p class="text-xs text-gray-900 dark:text-white font-bold">{{ customer()?.overdueDays ?? 0 }} días</p>
                        </div>
                        <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                          <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">Monto de Mora</p>
                          <p class="text-xs text-gray-900 dark:text-white font-bold">S/ {{ customer()?.overdueAmount ? (customer()!.overdueAmount | number:'1.2-2') : '0.00' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Sección: Capital -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg p-2 border border-blue-200 dark:border-blue-600/20">
                      <div class="flex items-center gap-1 mb-1.5">
                        <div class="p-0.5 bg-blue-100 dark:bg-blue-600/20 rounded">
                        </div>
                        <h3 class="text-[0.625rem] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Monto Capital</h3>
                      </div>
                      <div class="grid grid-cols-1 gap-1.5">
                        <div class="bg-gray-50 dark:bg-slate-900/50 rounded p-1.5 border border-gray-200 dark:border-slate-700/50">
                          <p class="text-[0.5625rem] text-gray-600 dark:text-gray-400 font-semibold uppercase mb-0.5 leading-none">Monto Capital</p>
                          <p class="text-xs text-gray-900 dark:text-white font-bold">S/ {{ customer()?.principalAmount ? (customer()!.principalAmount | number:'1.2-2') : '0.00' }}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                }

                <!-- Pagos Tab - Historial de Pagos agrupados por Promesa -->
                @if (activeTab() === 'pagos') {
                  <div class="space-y-2">
                    @if (loadingPagos()) {
                      <div class="flex items-center justify-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                        <span class="ml-2 text-gray-500 dark:text-gray-400">Cargando pagos...</span>
                      </div>
                    } @else if (!pagosCliente() || pagosCliente()!.cantidadPagos === 0) {
                      <div class="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700 text-center">
                        <p class="text-gray-500 dark:text-gray-400 text-sm">No se encontraron pagos registrados para este cliente</p>
                      </div>
                    } @else {
                      <!-- Resumen General -->
                      <div class="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-lg p-3 border border-amber-200 dark:border-amber-600/30">
                        <div class="flex items-center justify-between">
                          <div>
                            <p class="text-[0.625rem] text-amber-700 dark:text-amber-300 font-semibold uppercase">Total Pagado</p>
                            <p class="text-xl font-bold text-amber-800 dark:text-amber-200">S/ {{ pagosCliente()!.totalPagado | number:'1.2-2' }}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-[0.625rem] text-amber-700 dark:text-amber-300 font-semibold uppercase">Pagos Registrados</p>
                            <p class="text-xl font-bold text-amber-800 dark:text-amber-200">{{ pagosCliente()!.cantidadPagos }}</p>
                          </div>
                          <div class="text-right">
                            <p class="text-[0.625rem] text-amber-700 dark:text-amber-300 font-semibold uppercase">Promesas</p>
                            <p class="text-xl font-bold text-amber-800 dark:text-amber-200">{{ pagosCliente()!.grupos.length }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Grupos de Promesa -->
                      @for (grupo of pagosCliente()!.grupos; track grupo.grupoPromesaUuid) {
                        <div class="bg-white dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                          <!-- Header del Grupo (clickeable) -->
                          <button (click)="toggleGrupo(grupo.grupoPromesaUuid)"
                                  class="w-full px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                            <div class="flex items-center gap-2">
                              <span class="text-lg transform transition-transform" [class.rotate-90]="isGrupoExpanded(grupo.grupoPromesaUuid)">▶</span>
                              <div class="text-left">
                                <p class="text-sm font-semibold text-gray-800 dark:text-white">
                                  @if (grupo.esContinuidad) {
                                    <span class="text-blue-600 dark:text-blue-400">Continuidad:</span>
                                  } @else {
                                    <span class="text-amber-600 dark:text-amber-400">Promesa:</span>
                                  }
                                  {{ grupo.fechaPrimerPago }} - {{ grupo.fechaUltimoPago }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center gap-4">
                              <div class="text-right">
                                <p class="text-[0.625rem] text-gray-500 dark:text-gray-400">Pagos</p>
                                <p class="text-sm font-bold text-gray-800 dark:text-white">{{ grupo.cantidadPagos }}</p>
                              </div>
                              <div class="text-right">
                                <p class="text-[0.625rem] text-gray-500 dark:text-gray-400">Total</p>
                                <p class="text-sm font-bold text-green-600 dark:text-green-400">S/ {{ grupo.totalPagado | number:'1.2-2' }}</p>
                              </div>
                            </div>
                          </button>

                          <!-- Detalle de Pagos (expandible) -->
                          @if (isGrupoExpanded(grupo.grupoPromesaUuid)) {
                            <div class="border-t border-gray-200 dark:border-slate-600">
                              <table class="w-full text-xs">
                                <thead>
                                  <tr class="bg-gray-100 dark:bg-slate-700">
                                    <th class="px-2 py-1.5 text-left text-gray-600 dark:text-gray-300 font-semibold">Fecha</th>
                                    <th class="px-2 py-1.5 text-right text-gray-600 dark:text-gray-300 font-semibold">Monto</th>
                                    <th class="px-2 py-1.5 text-left text-gray-600 dark:text-gray-300 font-semibold">Banco</th>
                                    <th class="px-2 py-1.5 text-center text-gray-600 dark:text-gray-300 font-semibold">Cuota</th>
                                    <th class="px-2 py-1.5 text-center text-gray-600 dark:text-gray-300 font-semibold">Estado</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  @for (pago of grupo.pagos; track pago.id) {
                                    <tr class="border-t border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/30">
                                      <td class="px-2 py-1.5 text-gray-800 dark:text-white">{{ pago.fechaPago }}</td>
                                      <td class="px-2 py-1.5 text-right font-mono font-semibold text-gray-800 dark:text-white">S/ {{ pago.monto | number:'1.2-2' }}</td>
                                      <td class="px-2 py-1.5 text-gray-600 dark:text-gray-300">{{ pago.banco || '-' }}</td>
                                      <td class="px-2 py-1.5 text-center">
                                        @if (pago.numeroCuota) {
                                          <span class="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-[0.625rem] font-semibold">
                                            #{{ pago.numeroCuota }}
                                          </span>
                                        } @else {
                                          <span class="text-gray-400">-</span>
                                        }
                                      </td>
                                      <td class="px-2 py-1.5 text-center">
                                        @if (pago.verificado) {
                                          <span class="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-[0.625rem] font-semibold">
                                            Verificado
                                          </span>
                                        } @else {
                                          <span class="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded text-[0.625rem] font-semibold">
                                            Pendiente
                                          </span>
                                        }
                                      </td>
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            </div>
                          }
                        </div>
                      }
                    }
                  </div>
                }

                <!-- Gestiones Tab - Historial de Gestiones -->
                @if (activeTab() === 'gestiones') {
                  <div class="space-y-2">
                    <!-- Header con sub-tabs y controles -->
                    <div class="bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600/20">
                      <div class="px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                        <div class="flex items-center gap-2">
                          <h3 class="text-xs font-bold text-slate-700 dark:text-slate-200">Historial de Gestiones</h3>
                          <!-- Sub-tabs Actual / Histórico -->
                          <div class="flex items-center border border-slate-300 dark:border-slate-600 rounded overflow-hidden">
                            <button
                              (click)="cambiarTabHistorial('actual')"
                              [class]="'px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer ' +
                                (historialTabActivo() === 'actual'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700')">
                              Actual
                            </button>
                            <button
                              (click)="cambiarTabHistorial('historico')"
                              [class]="'px-2 py-0.5 text-xs font-medium transition-colors cursor-pointer border-l border-slate-300 dark:border-slate-600 ' +
                                (historialTabActivo() === 'historico'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700')">
                              Histórico
                            </button>
                          </div>
                          <!-- Row count -->
                          @if (historialTabActivo() === 'actual') {
                            <span class="text-xs text-slate-500 dark:text-slate-400">({{ historialGestionesFiltrado().length }}/{{ historialGestiones().length }})</span>
                          } @else {
                            <span class="text-xs text-slate-500 dark:text-slate-400">({{ historialHistorico().length }}/{{ historialHistoricoTotalElements() }})</span>
                          }
                        </div>
                        <!-- Filtros / Paginación -->
                        @if (historialTabActivo() === 'actual') {
                          <div class="flex items-center gap-1">
                            <button (click)="historialFilter.set('TODOS')"
                              [class]="'px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ' +
                                (historialFilter() === 'TODOS' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600')">
                              Todos
                            </button>
                            <button (click)="historialFilter.set('CD')"
                              [class]="'px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ' +
                                (historialFilter() === 'CD' ? 'bg-green-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600')">
                              [CD]
                            </button>
                            <button (click)="historialFilter.set('CI')"
                              [class]="'px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ' +
                                (historialFilter() === 'CI' ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600')">
                              [CI]
                            </button>
                            <button (click)="loadManagementHistory()" class="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">↻</button>
                          </div>
                        } @else {
                          <div class="flex items-center gap-2">
                            <button (click)="cambiarPaginaHistorico('anterior')"
                              [disabled]="historialHistoricoPage() === 0 || historialHistoricoLoading()"
                              [class]="'px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ' +
                                (historialHistoricoPage() === 0 || historialHistoricoLoading()
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600')">
                              ← Ant
                            </button>
                            <span class="text-xs text-slate-500 dark:text-slate-400">
                              Pág {{ historialHistoricoPage() + 1 }} de {{ historialHistoricoTotalPages() }}
                            </span>
                            <button (click)="cambiarPaginaHistorico('siguiente')"
                              [disabled]="historialHistoricoPage() >= historialHistoricoTotalPages() - 1 || historialHistoricoLoading()"
                              [class]="'px-2 py-0.5 text-xs rounded transition-colors cursor-pointer ' +
                                (historialHistoricoPage() >= historialHistoricoTotalPages() - 1 || historialHistoricoLoading()
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600')">
                              Sig →
                            </button>
                            <button (click)="loadHistorialHistorico(historialHistoricoPage())" class="ml-1 text-xs text-purple-600 dark:text-purple-400 hover:underline cursor-pointer">↻</button>
                          </div>
                        }
                      </div>

                      <!-- Tabla de gestiones -->
                      <div class="overflow-auto" style="max-height: 60vh;">
                        @if (historialTabActivo() === 'actual') {
                          <!-- TAB ACTUAL -->
                          @if (historialGestiones().length === 0) {
                            <div class="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                              Sin gestiones registradas para este cliente
                            </div>
                          } @else if (historialGestionesFiltrado().length === 0) {
                            <div class="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                              No hay gestiones con el filtro seleccionado
                            </div>
                          } @else {
                            <table class="w-full text-xs">
                              <thead class="bg-slate-100 dark:bg-slate-800 sticky top-0">
                                <tr class="text-left text-slate-600 dark:text-slate-300">
                                  <th class="px-2 py-1 font-semibold">Fecha</th>
                                  <th class="px-2 py-1 font-semibold">Asesor</th>
                                  <th class="px-2 py-1 font-semibold">Tipificación</th>
                                  <th class="px-2 py-1 font-semibold">Teléfono</th>
                                  <th class="px-2 py-1 font-semibold">Observación</th>
                                  <th class="px-2 py-1 font-semibold">Canal</th>
                                  <th class="px-2 py-1 font-semibold">Método</th>
                                </tr>
                              </thead>
                              <tbody>
                                @for (gestion of historialGestionesFiltrado(); track gestion.id) {
                                  <tr class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                    <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ gestion.fecha }}</td>
                                    <td class="px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium" [title]="gestion.nombreAgente">{{ gestion.nombreAgente }}</td>
                                    <td class="px-2 py-1.5">
                                      <span class="text-blue-600 dark:text-blue-400 font-medium" [title]="gestion.tipificacionCompleta">
                                        {{ gestion.tipificacionCompleta }}
                                      </span>
                                    </td>
                                    <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 font-mono">{{ gestion.telefono || '-' }}</td>
                                    <td class="px-2 py-1.5 text-slate-500 dark:text-slate-400 max-w-[200px] truncate" [title]="gestion.observacion">
                                      {{ gestion.observacion || '-' }}
                                    </td>
                                    <td class="px-2 py-1.5">
                                      <span [class]="'px-1.5 py-0.5 rounded text-xs font-semibold ' +
                                        (gestion.canal?.includes('SALIENTE') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                         gestion.canal?.includes('ENTRANTE') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                         gestion.canal === 'WHATSAPP' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                         gestion.canal === 'SMS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                         'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                                        {{ gestion.canalDisplay }}
                                      </span>
                                    </td>
                                    <td class="px-2 py-1.5">
                                      <span [class]="'px-1.5 py-0.5 rounded text-xs font-semibold ' +
                                        (gestion.metodo === 'GESTION_MANUAL' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' :
                                         gestion.metodo === 'GESTION_PROGRESIVO' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                         gestion.metodo === 'GESTION_PREDICTIVO' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                         'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                                        {{ gestion.metodoDisplay }}
                                      </span>
                                    </td>
                                  </tr>
                                }
                              </tbody>
                            </table>
                          }
                        } @else {
                          <!-- TAB HISTÓRICO -->
                          @if (historialHistoricoLoading()) {
                            <div class="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                              <span class="animate-pulse">Cargando historial histórico...</span>
                            </div>
                          } @else if (historialHistorico().length === 0) {
                            <div class="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500 text-xs">
                              Sin gestiones históricas para este cliente
                            </div>
                          } @else {
                            <table class="w-full text-xs">
                              <thead class="bg-purple-50 dark:bg-purple-900/20 sticky top-0">
                                <tr class="text-left text-slate-600 dark:text-slate-300">
                                  <th class="px-2 py-1 font-semibold">Fecha</th>
                                  <th class="px-2 py-1 font-semibold">Asesor</th>
                                  <th class="px-2 py-1 font-semibold">Tipificación</th>
                                  <th class="px-2 py-1 font-semibold">Teléfono</th>
                                  <th class="px-2 py-1 font-semibold">Observación</th>
                                  <th class="px-2 py-1 font-semibold">Canal</th>
                                  <th class="px-2 py-1 font-semibold">Método</th>
                                </tr>
                              </thead>
                              <tbody>
                                @for (gestion of historialHistorico(); track gestion.id) {
                                  <tr class="border-b border-slate-100 dark:border-slate-700/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                    <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">{{ gestion.fecha }}</td>
                                    <td class="px-2 py-1.5 text-slate-700 dark:text-slate-200 font-medium" [title]="gestion.nombreAgente">{{ gestion.nombreAgente }}</td>
                                    <td class="px-2 py-1.5">
                                      <span class="text-purple-600 dark:text-purple-400 font-medium" [title]="gestion.tipificacionCompleta">
                                        {{ gestion.tipificacionCompleta }}
                                      </span>
                                    </td>
                                    <td class="px-2 py-1.5 text-slate-600 dark:text-slate-300 font-mono">{{ gestion.telefono || '-' }}</td>
                                    <td class="px-2 py-1.5 text-slate-500 dark:text-slate-400 max-w-[200px] truncate" [title]="gestion.observacion">
                                      {{ gestion.observacion || '-' }}
                                    </td>
                                    <td class="px-2 py-1.5">
                                      <span [class]="'px-1.5 py-0.5 rounded text-xs font-semibold ' +
                                        (gestion.canal?.includes('SALIENTE') ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                         gestion.canal?.includes('ENTRANTE') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                         gestion.canal === 'WHATSAPP' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                                         gestion.canal === 'SMS' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                                         'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                                        {{ gestion.canalDisplay }}
                                      </span>
                                    </td>
                                    <td class="px-2 py-1.5">
                                      <span [class]="'px-1.5 py-0.5 rounded text-xs font-semibold ' +
                                        (gestion.metodo === 'GESTION_MANUAL' ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300' :
                                         gestion.metodo === 'GESTION_PROGRESIVO' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                         gestion.metodo === 'GESTION_PREDICTIVO' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                         'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300')">
                                        {{ gestion.metodoDisplay }}
                                      </span>
                                    </td>
                                  </tr>
                                }
                              </tbody>
                            </table>
                          }
                        }
                      </div>
                    </div>
                  </div>
                }

              </div>
            </div>

          </div>
        </div>
      }

      <!-- Modal Nueva Gestión -->
      @if (showManagementModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" (click)="closeManagementModal()">
          <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700" (click)="$event.stopPropagation()">

            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-blue-500">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-white/20 rounded-lg">
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Nueva Gestión</h2>
                  <p class="text-sm text-blue-100">{{ customer()?.fullName }}</p>
                </div>
              </div>
              <button (click)="closeManagementModal()" class="p-2 hover:bg-white/20 rounded-lg transition-colors">
              </button>
            </div>

            <!-- Form Content -->
            <div class="p-4 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div class="space-y-3">

                <!-- Tipificaciones Jerárquicas -->
                @for (level of hierarchyLevels(); track $index; let levelIndex = $index) {
                  <div class="space-y-1.5">
                    <label class="flex items-center gap-2 text-xs font-semibold text-gray-300">
                      @if (levelIndex === 0) {
                        <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      } @else {
                        <span class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                      }
                      {{ getLevelLabel(levelIndex) }}
                      @if (levelIndex === 0) {
                        <span class="text-red-400">*</span>
                      }
                    </label>
                    <select
                      [value]="selectedClassifications()[levelIndex] || ''"
                      (change)="onClassificationSelect(levelIndex, $any($event.target).value)"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer">
                      <option value="">Seleccione una opción...</option>
                      @for (item of level; track item.id) {
                        <option [value]="item.id">{{ getTypificationLabel(item) }}</option>
                      }
                    </select>
                  </div>
                }

                <!-- Observaciones -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    Observaciones
                  </label>
                  <textarea
                    [(ngModel)]="managementForm.observations"
                    placeholder="Detalles de la conversación..."
                    rows="3"
                    class="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none">
                  </textarea>
                </div>

                <!-- Notas Privadas -->
                <div class="space-y-1.5">
                  <label class="flex items-center gap-2 text-xs font-semibold text-gray-300">
                    Notas Privadas
                  </label>
                  <textarea
                    [(ngModel)]="managementForm.privateNotes"
                    placeholder="Notas internas..."
                    rows="2"
                    class="w-full px-3 py-2 bg-slate-800 border border-orange-600/30 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none">
                  </textarea>
                </div>

              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="px-4 py-3 bg-slate-900/50 border-t border-slate-700 flex gap-2">
              <button
                (click)="saveManagement()"
                [disabled]="!isManagementFormValid() || savingManagement()"
                class="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-600/50 text-sm">
                @if (savingManagement()) {
                } @else {
                }
                <span>{{ savingManagement() ? 'Guardando...' : 'Guardar Gestión' }}</span>
              </button>
              <button
                (click)="closeManagementModal()"
                [disabled]="savingManagement()"
                class="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                <span>Cancelar</span>
              </button>
            </div>

          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CustomerViewComponent implements OnInit {
  private customerService = inject(CustomerService);
  private apiSystemConfigService = inject(ApiSystemConfigService);
  private managementService = inject(ManagementService);

  customer = signal<CustomerResource | null>(null);
  activeTab = signal<'personal' | 'contacto' | 'ubicacion' | 'referencias' | 'cuentas' | 'pagos' | 'gestiones'>('cuentas');
  searchDocument = '';
  searchCriteria = 'documento'; // Criterio de búsqueda por defecto
  searchPerformed = signal(false);
  loading = signal(false);
  recentCustomers = signal<{document: string, fullName: string, tenantName: string, portfolioName: string, subPortfolioName: string}[]>([]);
  searchResults = signal<CustomerResource[]>([]);
  showMultipleResults = signal(false);

  // Pagos del cliente
  pagosCliente = signal<PagosClienteResponse | null>(null);
  loadingPagos = signal(false);
  expandedGrupos = signal<Set<string>>(new Set());

  // Historial de Gestiones
  historialTabActivo = signal<'actual' | 'historico'>('actual');
  historialGestiones = signal<Array<{
    id: number; fecha: string; nombreAgente: string; tipificacionCompleta: string;
    telefono: string; observacion: string; canal: string; canalDisplay: string;
    metodo: string; metodoDisplay: string;
  }>>([]);
  historialHistorico = signal<Array<{
    id: number; fecha: string; nombreAgente: string; tipificacionCompleta: string;
    telefono: string; observacion: string; canal: string; canalDisplay: string;
    metodo: string; metodoDisplay: string;
  }>>([]);
  historialFilter = signal<'TODOS' | 'CI' | 'CD'>('TODOS');
  historialHistoricoPage = signal<number>(0);
  historialHistoricoTotalPages = signal<number>(0);
  historialHistoricoTotalElements = signal<number>(0);
  historialHistoricoLoading = signal<boolean>(false);
  historialGestionesFiltrado = computed(() => {
    const filter = this.historialFilter();
    const gestiones = this.historialGestiones();
    if (filter === 'TODOS') return gestiones;
    return gestiones.filter(g => g.canal?.includes(filter));
  });

  // TODO: Obtener este valor del contexto del usuario/sesión
  private subPortfolioId = 1; // Por ahora hardcodeado, debe venir de la sesión
  private tenantId = 1; // Por ahora hardcodeado, debe venir de la sesión

  // Opciones de criterios de búsqueda
  searchCriteriaOptions = [
    { value: 'documento', label: 'Documento', icon: 'id-card' },
    { value: 'numero_cuenta', label: 'Número de Cuenta', icon: 'credit-card' },
    { value: 'telefono', label: 'Teléfono', icon: 'phone' }
  ];

  // Modal de Nueva Gestión
  showManagementModal = signal(false);
  savingManagement = signal(false);

  // Tipificaciones
  managementClassifications = computed(() => this.apiSystemConfigService.getManagementClassificationsForUI());
  selectedClassifications = signal<string[]>([]);

  // Formulario de gestión
  managementForm = {
    observations: '',
    privateNotes: ''
  };

  hierarchyLevels = computed(() => {
    const all: any[] = this.managementClassifications() as any[];
    const selected = this.selectedClassifications();
    const levels: any[][] = [];

    const roots = all.filter(c => c.hierarchyLevel === 1 || !c.parentId);

    if (roots.length > 0) {
      levels.push(roots);

      for (let i = 0; i < selected.length; i++) {
        const parentId = selected[i];
        const children = all.filter(c => c.parentId && Number(c.parentId) === Number(parentId));

        if (children.length > 0) {
          levels.push(children);
        } else {
          break;
        }
      }
    }

    return levels;
  });

  ngOnInit() {
    // Cargar clientes recientes al iniciar
    this.loadRecentCustomers();
  }

  loadRecentCustomers() {
    this.customerService.getRecentCustomers().subscribe({
      next: (customers) => {
        this.recentCustomers.set(customers);
      },
      error: (error) => {
        console.error('Error cargando clientes recientes:', error);
      }
    });
  }

  searchCustomer() {
    if (!this.searchDocument.trim()) {
      alert('Por favor ingrese un valor de búsqueda');
      return;
    }

    this.loading.set(true);
    this.searchPerformed.set(true);
    this.showMultipleResults.set(false);
    this.searchResults.set([]);

    // Limpiar pagos del cliente anterior
    this.pagosCliente.set(null);
    this.expandedGrupos.set(new Set());

    // Usar búsqueda multi-tenant (sin filtro de tenantId) para encontrar duplicados entre inquilinos
    this.customerService.searchCustomersAcrossAllTenants(this.searchCriteria, this.searchDocument).subscribe({
      next: (data) => {
        console.log('Resultados encontrados:', data);
        if (data.length === 0) {
          // No se encontró ningún resultado
          this.customer.set(null);
          this.searchResults.set([]);
          this.showMultipleResults.set(false);
        } else if (data.length === 1) {
          // Un solo resultado, mostrarlo directamente
          this.customer.set(data[0]);
          this.searchResults.set([]);
          this.showMultipleResults.set(false);
        } else {
          // Múltiples resultados, mostrar lista de selección (incluye duplicados entre tenants)
          this.customer.set(null);
          this.searchResults.set(data);
          this.showMultipleResults.set(true);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error buscando cliente:', error);
        this.customer.set(null);
        this.searchResults.set([]);
        this.showMultipleResults.set(false);
        this.loading.set(false);
      }
    });
  }

  selectCustomerFromResults(selectedCustomer: CustomerResource) {
    // Limpiar pagos del cliente anterior
    this.pagosCliente.set(null);
    this.expandedGrupos.set(new Set());
    // Limpiar gestiones del cliente anterior
    this.historialGestiones.set([]);
    this.historialHistorico.set([]);
    this.historialTabActivo.set('actual');
    this.historialFilter.set('TODOS');

    // Register access for this specific customer
    this.customerService.registerCustomerAccess(selectedCustomer.id).subscribe({
      next: () => {
        console.log('✅ Acceso registrado para cliente ID:', selectedCustomer.id);
        this.customer.set(selectedCustomer);
        this.showMultipleResults.set(false);
        this.searchResults.set([]);
        // Reload recent customers to reflect the update
        this.loadRecentCustomers();
      },
      error: (error) => {
        console.error('Error registrando acceso del cliente:', error);
        // Still show the customer even if tracking fails
        this.customer.set(selectedCustomer);
        this.showMultipleResults.set(false);
        this.searchResults.set([]);
      }
    });
  }

  getSelectedCriteriaLabel(): string {
    const selected = this.searchCriteriaOptions.find(opt => opt.value === this.searchCriteria);
    return selected ? selected.label : 'Buscar por';
  }

  // ============== Métodos para Tab de Pagos ==============

  onTabPagosClick() {
    this.activeTab.set('pagos');
    // Cargar pagos solo si tenemos un cliente seleccionado y no hemos cargado aún
    const currentCustomer = this.customer();
    if (currentCustomer && !this.pagosCliente()) {
      this.loadPagosCliente(currentCustomer.documentNumber);
    }
  }

  loadPagosCliente(documento: string) {
    this.loadingPagos.set(true);
    this.customerService.getPagosCliente(documento).subscribe({
      next: (response) => {
        console.log('Pagos del cliente:', response);
        this.pagosCliente.set(response);
        this.loadingPagos.set(false);
        // Expandir el primer grupo por defecto si existe
        if (response.grupos.length > 0) {
          const newSet = new Set<string>();
          newSet.add(response.grupos[0].grupoPromesaUuid);
          this.expandedGrupos.set(newSet);
        }
      },
      error: (error) => {
        console.error('Error cargando pagos del cliente:', error);
        this.pagosCliente.set(null);
        this.loadingPagos.set(false);
      }
    });
  }

  toggleGrupo(grupoUuid: string) {
    const current = this.expandedGrupos();
    const newSet = new Set(current);
    if (newSet.has(grupoUuid)) {
      newSet.delete(grupoUuid);
    } else {
      newSet.add(grupoUuid);
    }
    this.expandedGrupos.set(newSet);
  }

  isGrupoExpanded(grupoUuid: string): boolean {
    return this.expandedGrupos().has(grupoUuid);
  }

  // ============== Métodos para Tab de Gestiones ==============

  onTabGestionesClick() {
    this.activeTab.set('gestiones');
    const currentCustomer = this.customer();
    if (currentCustomer && this.historialGestiones().length === 0) {
      this.loadManagementHistory();
    }
  }

  loadManagementHistory() {
    const documento = this.customer()?.documentNumber;
    if (!documento) return;

    this.managementService.getManagementsByDocumento(documento).subscribe({
      next: (managements) => {
        const historial = managements.map(m => {
          const fechaOnly = m.managementDate ? this.formatDateOnly(m.managementDate) : '-';
          const hora = m.managementTime ? m.managementTime.substring(0, 5) : '';
          const fecha = hora ? `${fechaOnly} ${hora}` : fechaOnly;
          const tipificacionParts = [m.level1Name, m.level2Name, m.level3Name, m.level4Name].filter(Boolean);
          const tipificacionCompleta = tipificacionParts.join(' > ') || '-';
          return {
            id: m.id,
            fecha,
            nombreAgente: m.nombreAgente || `Agente ${m.advisorId}`,
            tipificacionCompleta,
            telefono: m.telefonoContacto || '',
            observacion: m.observations || '',
            canal: m.canalContacto || '',
            canalDisplay: this.formatCanalDisplay(m.canalContacto),
            metodo: m.metodoContacto || '',
            metodoDisplay: this.formatMetodoDisplay(m.metodoContacto),
          };
        });
        this.historialGestiones.set(historial);
      },
      error: (error) => {
        console.error('Error al cargar historial de gestiones:', error);
      }
    });
  }

  loadHistorialHistorico(page: number = 0) {
    const documento = this.customer()?.documentNumber;
    if (!documento) return;

    this.historialHistoricoLoading.set(true);
    this.managementService.getGestionesHistoricas(documento, page, 10).subscribe({
      next: (response) => {
        const historial = response.content.map((g: any, index: number) => {
          const fechaOnly = g.fechaGestion ? this.formatDateOnly(g.fechaGestion) : '-';
          const hora = g.horaGestion ? g.horaGestion.substring(0, 5) : '';
          const fecha = hora ? `${fechaOnly} ${hora}` : fechaOnly;
          const tipificacionCompleta = [g.resultado, g.solucion].filter(Boolean).join(' > ') || '-';
          return {
            id: index + (page * 10),
            fecha,
            nombreAgente: g.agente || '-',
            tipificacionCompleta,
            telefono: g.telefono || '',
            observacion: g.observacion || '',
            canal: g.canal || '',
            canalDisplay: this.formatCanalDisplay(g.canal),
            metodo: g.metodo || '',
            metodoDisplay: this.formatMetodoDisplay(g.metodo),
          };
        });
        this.historialHistorico.set(historial);
        this.historialHistoricoPage.set(response.page);
        this.historialHistoricoTotalPages.set(response.totalPages);
        this.historialHistoricoTotalElements.set(response.totalElements);
        this.historialHistoricoLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar historial histórico:', error);
        this.historialHistoricoLoading.set(false);
        this.historialHistorico.set([]);
      }
    });
  }

  cambiarTabHistorial(tab: 'actual' | 'historico') {
    this.historialTabActivo.set(tab);
    if (tab === 'historico' && this.historialHistorico().length === 0) {
      this.loadHistorialHistorico();
    }
  }

  cambiarPaginaHistorico(direccion: 'anterior' | 'siguiente') {
    const currentPage = this.historialHistoricoPage();
    const totalPages = this.historialHistoricoTotalPages();
    if (direccion === 'anterior' && currentPage > 0) {
      this.loadHistorialHistorico(currentPage - 1);
    } else if (direccion === 'siguiente' && currentPage < totalPages - 1) {
      this.loadHistorialHistorico(currentPage + 1);
    }
  }

  private formatDateOnly(dateStr: string): string {
    if (!dateStr) return '-';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
  }

  private formatCanalDisplay(canal: string | undefined): string {
    if (!canal) return '-';
    const map: { [key: string]: string } = {
      'LLAMADA_SALIENTE': 'Llamada Saliente', 'LLAMADA_ENTRANTE': 'Llamada Entrante',
      'SMS': 'SMS', 'WHATSAPP': 'WhatsApp', 'EMAIL': 'Email'
    };
    return map[canal] || this.formatSnakeCase(canal);
  }

  private formatMetodoDisplay(metodo: string | undefined): string {
    if (!metodo) return '-';
    const map: { [key: string]: string } = {
      'GESTION_MANUAL': 'Manual', 'GESTION_PROGRESIVO': 'Progresivo',
      'GESTION_PREDICTIVO': 'Predictivo', 'GESTION_AUTOMATICA': 'Automática'
    };
    return map[metodo] || this.formatSnakeCase(metodo);
  }

  private formatSnakeCase(value: string): string {
    if (!value) return '-';
    return value.toLowerCase().split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  quickSearch(document: string) {
    this.searchDocument = document;
    this.searchCustomer();
  }

  clearCustomer() {
    this.customer.set(null);
    this.searchDocument = '';
    this.searchPerformed.set(false);
    this.showMultipleResults.set(false);
    this.searchResults.set([]);
    this.activeTab.set('personal');
    // Limpiar historial de gestiones
    this.historialGestiones.set([]);
    this.historialHistorico.set([]);
    this.historialTabActivo.set('actual');
    this.historialFilter.set('TODOS');
    this.historialHistoricoPage.set(0);
    this.historialHistoricoTotalPages.set(0);
    this.historialHistoricoTotalElements.set(0);
  }

  clearSearch() {
    this.searchDocument = '';
    this.searchPerformed.set(false);
    this.showMultipleResults.set(false);
    this.searchResults.set([]);
  }

  // Obtener icono según la edad
  getAgeIcon(): string {
    const edad = Number(this.getFieldValue('edad')) || 0;
    if (edad < 30) return 'smile';
    if (edad < 50) return 'user';
    return 'glasses';
  }

  // Obtener clase del avatar según edad
  getAvatarClass(): string {
    const edad = Number(this.getFieldValue('edad')) || 0;
    if (edad < 30) return 'bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-green-400/30';
    if (edad < 50) return 'bg-gradient-to-br from-blue-500 to-blue-700 border-4 border-blue-400/30';
    return 'bg-gradient-to-br from-purple-500 to-purple-700 border-4 border-purple-400/30';
  }

  // Obtener categoría de edad
  getAgeCategory(): string {
    const edad = Number(this.getFieldValue('edad')) || 0;
    if (edad < 30) return 'Joven';
    if (edad < 50) return 'Adulto';
    return 'Senior';
  }

  // Obtener clase del badge de edad
  getAgeBadgeClass(): string {
    const edad = Number(this.getFieldValue('edad')) || 0;
    if (edad < 30) return 'bg-green-600/30 text-green-300 border border-green-500/50';
    if (edad < 50) return 'bg-blue-600/30 text-blue-300 border border-blue-500/50';
    return 'bg-purple-600/30 text-purple-300 border border-purple-500/50';
  }

  getFieldValue(fieldCode: string): string | number | null {
    const customerData = this.customer();
    if (!customerData) return null;

    // Mapeo completo de fieldCode a propiedades de CustomerResource
    const fieldMapping: any = {
      // Identificación
      'codigo_identificacion': customerData.identificationCode || customerData.customerId,
      'documento': customerData.documentNumber,
      'tipo_documento': customerData.documentType,
      // Nombres
      'nombre_completo': customerData.fullName,
      'primer_nombre': customerData.firstName,
      'segundo_nombre': customerData.secondName,
      'primer_apellido': customerData.firstLastName,
      'segundo_apellido': customerData.secondLastName,
      // Datos personales
      'edad': customerData.age,
      'fecha_nacimiento': customerData.birthDate,
      'estado_civil': customerData.maritalStatus,
      'ocupacion': customerData.occupation,
      'tipo_cliente': customerData.customerType,
      // Ubicación
      'direccion': customerData.address,
      'distrito': customerData.district,
      'provincia': customerData.province,
      'departamento': customerData.department,
      // Referencias
      'referencia_personal': customerData.personalReference
    };

    return fieldMapping[fieldCode] || null;
  }

  getFieldsByCategory(category: 'personal' | 'contacto' | 'ubicacion' | 'referencias'): any[] {
    // Por ahora retornar array vacío, CustomerResource tiene campos limitados
    return [];
  }

  getFieldsBySection(category: 'personal' | 'contacto' | 'ubicacion' | 'referencias', fieldCodes: string[]): any[] {
    const customerData = this.customer();
    if (!customerData) return [];

    // Definición completa de todos los campos disponibles
    const fieldDefinitions: any = {
      // Identificación
      'codigo_identificacion': { name: 'Código de Identificación', value: customerData.identificationCode, type: 'TEXTO' },
      'documento': { name: 'Documento', value: customerData.documentNumber, type: 'TEXTO' },
      'tipo_documento': { name: 'Tipo de Documento', value: customerData.documentType, type: 'TEXTO' },

      // Nombres
      'nombre_completo': { name: 'Nombre Completo', value: customerData.fullName, type: 'TEXTO' },
      'primer_nombre': { name: 'Primer Nombre', value: customerData.firstName, type: 'TEXTO' },
      'segundo_nombre': { name: 'Segundo Nombre', value: customerData.secondName, type: 'TEXTO' },
      'primer_apellido': { name: 'Primer Apellido', value: customerData.firstLastName, type: 'TEXTO' },
      'segundo_apellido': { name: 'Segundo Apellido', value: customerData.secondLastName, type: 'TEXTO' },

      // Datos personales
      'edad': { name: 'Edad', value: customerData.age, type: 'NUMERICO' },
      'fecha_nacimiento': { name: 'Fecha de Nacimiento', value: customerData.birthDate, type: 'FECHA' },
      'estado_civil': { name: 'Estado Civil', value: customerData.maritalStatus, type: 'TEXTO' },
      'ocupacion': { name: 'Ocupación', value: customerData.occupation, type: 'TEXTO' },
      'tipo_cliente': { name: 'Tipo de Cliente', value: customerData.customerType, type: 'TEXTO' },

      // Ubicación
      'direccion': { name: 'Dirección', value: customerData.address, type: 'TEXTO' },
      'distrito': { name: 'Distrito', value: customerData.district, type: 'TEXTO' },
      'provincia': { name: 'Provincia', value: customerData.province, type: 'TEXTO' },
      'departamento': { name: 'Departamento', value: customerData.department, type: 'TEXTO' },

      // Referencias
      'referencia_personal': { name: 'Referencia Personal', value: customerData.personalReference, type: 'TEXTO' }
    };

    // Crear array de campos basado en fieldCodes solicitados
    const fields: any[] = [];

    for (const fieldCode of fieldCodes) {
      const fieldDef = fieldDefinitions[fieldCode];
      if (fieldDef && fieldDef.value !== null && fieldDef.value !== undefined) {
        fields.push({
          fieldCode: fieldCode,
          fieldName: fieldDef.name,
          value: fieldDef.value,
          dataType: fieldDef.type
        });
      }
    }

    return fields;
  }

  /**
   * Obtiene los métodos de contacto de tipo teléfono
   */
  getPhoneContactMethods() {
    const customerData = this.customer();
    if (!customerData || !customerData.contactMethods) return [];

    // Filtrar solo teléfonos personales (excluir teléfonos de referencia)
    const phones = customerData.contactMethods.filter(cm =>
      cm.contactType === 'telefono' &&
      !cm.subtype.startsWith('telefono_referencia')
    );

    // Ordenar: telefono_principal primero, luego los demás
    const phonePriority: { [key: string]: number } = {
      'telefono_principal': 1,
      'telefono_secundario': 2,
      'telefono_trabajo': 3
    };

    return phones.sort((a, b) => {
      const priorityA = phonePriority[a.subtype] || 999;
      const priorityB = phonePriority[b.subtype] || 999;
      return priorityA - priorityB;
    });
  }

  /**
   * Obtiene los métodos de contacto de tipo email
   */
  getEmailContactMethods() {
    const customerData = this.customer();
    if (!customerData || !customerData.contactMethods) return [];

    return customerData.contactMethods.filter(cm => cm.contactType === 'email');
  }

  /**
   * Convierte el código de subtipo a una etiqueta legible
   */
  getContactLabel(subtype: string): string {
    const labels: { [key: string]: string } = {
      'telefono_principal': 'Teléfono Principal',
      'telefono_secundario': 'Teléfono Secundario',
      'telefono_trabajo': 'Teléfono de Trabajo',
      'telefono_referencia_1': 'Teléfono Referencia 1',
      'telefono_referencia_2': 'Teléfono Referencia 2',
      'email': 'Correo Electrónico'
    };

    return labels[subtype] || subtype;
  }

  /**
   * Obtiene los métodos de contacto de tipo teléfono de referencia
   */
  getReferenceContactMethods() {
    const customerData = this.customer();
    if (!customerData || !customerData.contactMethods) return [];

    // Filtrar solo teléfonos de referencia
    const referencePhones = customerData.contactMethods.filter(cm =>
      cm.contactType === 'telefono' &&
      cm.subtype.startsWith('telefono_referencia')
    );

    // Ordenar por número de referencia
    return referencePhones.sort((a, b) => {
      const numA = a.subtype.includes('1') ? 1 : 2;
      const numB = b.subtype.includes('1') ? 1 : 2;
      return numA - numB;
    });
  }

  /**
   * Obtiene el primer email de un resultado de búsqueda
   */
  getFirstEmail(customer: CustomerResource | null | undefined): string | null {
    if (!customer || !customer.contactMethods) return null;
    const emailContact = customer.contactMethods.find(cm => cm.contactType === 'email');
    return emailContact ? emailContact.value : null;
  }

  /**
   * Abre el formulario para crear una nueva gestión
   */
  openNewManagement() {
    const currentCustomer = this.customer();
    if (!currentCustomer) return;

    console.log('Nueva gestión para cliente:', currentCustomer.id);

    // Cargar tipificaciones según el tenantId del cliente
    const tenantId = currentCustomer.tenantId || 1;
    this.apiSystemConfigService.setTenantAndPortfolio(tenantId, currentCustomer.portfolioId);

    // Resetear formulario
    this.selectedClassifications.set([]);
    this.managementForm = {
      observations: '',
      privateNotes: ''
    };

    // Mostrar modal
    this.showManagementModal.set(true);
  }

  /**
   * Cierra el modal de gestión
   */
  closeManagementModal() {
    this.showManagementModal.set(false);
  }

  /**
   * Maneja la selección de una tipificación en un nivel
   */
  onClassificationSelect(levelIndex: number, selectedId: string) {
    const currentSelections = [...this.selectedClassifications()];

    // Truncar selecciones desde el nivel actual
    currentSelections.length = levelIndex;

    // Agregar nueva selección
    if (selectedId) {
      currentSelections.push(selectedId);
    }

    this.selectedClassifications.set(currentSelections);
  }

  /**
   * Obtiene la etiqueta formateada de una tipificación
   */
  getTypificationLabel(item: any): string {
    return `[${item.codigo}] ${item.label}`;
  }

  /**
   * Obtiene el label del nivel actual
   */
  getLevelLabel(levelIndex: number): string {
    if (levelIndex === 0) return 'Tipo de Resultado';

    const selected = this.selectedClassifications();
    if (!selected[levelIndex - 1]) return `Nivel ${levelIndex + 1}`;

    const parentId = selected[levelIndex - 1];
    const parent = this.managementClassifications().find((c: any) => c.id.toString() === parentId);

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

    if (levelIndex === 2) {
      return `Detalle de ${parent.label}`;
    }

    return `Nivel ${levelIndex + 1}`;
  }

  /**
   * Verifica si el formulario es válido
   */
  isManagementFormValid(): boolean {
    const selected = this.selectedClassifications();

    if (selected.length === 0) {
      return false;
    }

    // Verificar que no haya más niveles disponibles
    const lastSelectedId = selected[selected.length - 1];
    const all: any[] = this.managementClassifications() as any[];
    const hasChildren = all.some((c: any) => c.parentId && Number(c.parentId) === Number(lastSelectedId));

    return !hasChildren;
  }

  /**
   * Guarda la gestión
   */
  saveManagement() {
    if (!this.isManagementFormValid()) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    const currentCustomer = this.customer();
    if (!currentCustomer) return;

    this.savingManagement.set(true);

    // Obtener las tipificaciones seleccionadas
    const selectedClassifs = this.selectedClassifications();
    const allTypifications = this.managementClassifications();

    const level1 = allTypifications.find((c: any) => c.id.toString() === selectedClassifs[0]);
    const level2 = selectedClassifs[1] ? allTypifications.find((c: any) => c.id.toString() === selectedClassifs[1]) : null;
    const level3 = selectedClassifs[2] ? allTypifications.find((c: any) => c.id.toString() === selectedClassifs[2]) : null;

    // Determinar cuál es la tipificación final (hoja)
    const lastSelectedId = selectedClassifs[selectedClassifs.length - 1];
    const managementClassification = allTypifications.find((c: any) => c.id.toString() === lastSelectedId);

    // Crear el request
    const request: CreateManagementRequest = {
      customerId: currentCustomer.customerId || currentCustomer.id.toString(),
      advisorId: 'ADV-001', // TODO: Obtener del contexto del usuario

      // Multi-tenant fields
      tenantId: currentCustomer.tenantId || 1,
      portfolioId: currentCustomer.portfolioId || 1,
      subPortfolioId: currentCustomer.subPortfolioId || 1,

      // Phone from customer data
      phone: this.getPhoneContactMethods()[0]?.value || '',

      // Hierarchy levels with IDs and names
      level1Id: Number(selectedClassifs[0]),
      level1Name: level1?.label || '',
      level2Id: selectedClassifs[1] ? Number(selectedClassifs[1]) : null,
      level2Name: level2?.label || null,
      level3Id: selectedClassifs[2] ? Number(selectedClassifs[2]) : null,
      level3Name: level3?.label || null,

      // Additional fields
      observations: this.managementForm.observations
    };

    console.log('Guardando gestión:', request);

    this.managementService.createManagement(request).subscribe({
      next: (response) => {
        console.log('Gestión guardada exitosamente:', response);
        this.savingManagement.set(false);
        this.showManagementModal.set(false);
        alert('Gestión guardada exitosamente');
      },
      error: (error) => {
        console.error('Error guardando gestión:', error);
        this.savingManagement.set(false);
        alert('Error guardando gestión. Por favor intente nuevamente.');
      }
    });
  }
}
