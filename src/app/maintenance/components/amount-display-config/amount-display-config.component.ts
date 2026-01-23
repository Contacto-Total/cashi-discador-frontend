import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TypificationService } from '../../services/typification.service';
import { PortfolioService } from '../../services/portfolio.service';
import { ManagementService, ConfiguracionCabecera } from '../../../collection-management/services/management.service';
import { FirstInstallmentConfigService } from '../../services/first-installment-config.service';
import { Tenant } from '../../models/tenant.model';
import { Portfolio, SubPortfolio } from '../../models/portfolio.model';

interface AmountFieldConfig extends ConfiguracionCabecera {
  isVisible: boolean;
}

@Component({
  selector: 'app-amount-display-config',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DragDropModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Header -->
      <div class="max-w-5xl mx-auto mb-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                <lucide-angular name="eye" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Campos de Montos a Mostrar</h1>
                <p class="text-xs text-gray-400">Configure qué campos de importes se muestran en el panel de deuda</p>
              </div>
            </div>
          </div>

          <button (click)="saveChanges()"
                  [disabled]="!hasChanges() || saving()"
                  class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer">
            @if (saving()) {
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            } @else {
              <lucide-angular name="save" [size]="18"></lucide-angular>
              <span>Guardar Cambios</span>
            }
          </button>
        </div>
      </div>

      <!-- Selectors -->
      <div class="max-w-5xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-800">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Tenant Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Proveedor
              </label>
              <select [(ngModel)]="selectedTenantId"
                      (ngModelChange)="onTenantChange()"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option [value]="0">Seleccione un proveedor...</option>
                @for (tenant of tenants(); track tenant.id) {
                  <option [value]="tenant.id">{{ tenant.tenantName }} ({{ tenant.tenantCode }})</option>
                }
              </select>
            </div>

            <!-- Portfolio Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Cartera
              </label>
              <select [(ngModel)]="selectedPortfolioId"
                      (ngModelChange)="onPortfolioChange()"
                      [disabled]="selectedTenantId === 0"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una cartera...</option>
                @for (portfolio of portfolios(); track portfolio.id) {
                  <option [value]="portfolio.id">{{ portfolio.portfolioName }} ({{ portfolio.portfolioCode }})</option>
                }
              </select>
            </div>

            <!-- SubPortfolio Selector -->
            <div>
              <label class="block text-sm font-semibold text-gray-300 mb-2">
                Subcartera
              </label>
              <select [(ngModel)]="selectedSubPortfolioId"
                      (ngModelChange)="onSubPortfolioChange()"
                      [disabled]="selectedPortfolioId === 0"
                      class="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [value]="0">Seleccione una subcartera...</option>
                @for (subPortfolio of subPortfolios(); track subPortfolio.id) {
                  <option [value]="subPortfolio.id">{{ subPortfolio.subPortfolioName }} ({{ subPortfolio.subPortfolioCode }})</option>
                }
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Expansion Panel: Primera Cuota Config -->
      @if (selectedSubPortfolioId > 0) {
        <div class="max-w-5xl mx-auto mb-6">
          <div class="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            <!-- Header (clickeable) -->
            <button (click)="toggleFirstInstallmentPanel()"
                    class="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <lucide-angular name="calendar-days" [size]="16" class="text-white"></lucide-angular>
                </div>
                <div class="text-left">
                  <h3 class="text-sm font-semibold text-white">Configuración Primera Cuota</h3>
                  <p class="text-xs text-gray-400">
                    @if (selectedMaxDays() !== null) {
                      Máximo {{ selectedMaxDays() }} días configurado
                    } @else {
                      Sin restricción de días
                    }
                  </p>
                </div>
              </div>
              <lucide-angular [name]="firstInstallmentPanelOpen() ? 'chevron-up' : 'chevron-down'"
                              [size]="20"
                              class="text-gray-400"></lucide-angular>
            </button>

            <!-- Content (colapsable) -->
            @if (firstInstallmentPanelOpen()) {
              <div class="px-4 pb-4 border-t border-slate-800">
                <div class="mt-4">
                  <p class="text-sm text-gray-300 mb-3">
                    Selecciona el máximo de días permitidos para la fecha de la primera cuota.
                    Si el agente selecciona una fecha fuera de este rango, la gestión se guardará como <span class="text-yellow-400 font-medium">excepción en evaluación</span>.
                  </p>

                  <!-- Chips de días -->
                  <div class="flex flex-wrap gap-2">
                    @for (day of availableDays; track day) {
                      <button (click)="selectMaxDays(day)"
                              [class]="selectedMaxDays() === day
                                ? 'bg-purple-600 text-white border-purple-500'
                                : 'bg-slate-800 text-gray-300 border-slate-700 hover:border-purple-500/50 hover:text-white'"
                              class="px-4 py-2 rounded-lg border text-sm font-medium transition-all">
                        {{ day }} {{ day === 1 ? 'día' : 'días' }}
                      </button>
                    }
                    <!-- Opción sin restricción -->
                    <button (click)="selectMaxDays(null)"
                            [class]="selectedMaxDays() === null
                              ? 'bg-gray-600 text-white border-gray-500'
                              : 'bg-slate-800 text-gray-300 border-slate-700 hover:border-gray-500/50 hover:text-white'"
                            class="px-4 py-2 rounded-lg border text-sm font-medium transition-all">
                      Sin límite
                    </button>
                  </div>

                  <!-- Botón guardar config primera cuota -->
                  @if (hasFirstInstallmentChanges()) {
                    <div class="mt-4 flex justify-end">
                      <button (click)="saveFirstInstallmentConfig()"
                              [disabled]="savingFirstInstallment()"
                              class="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
                        @if (savingFirstInstallment()) {
                          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Guardando...</span>
                        } @else {
                          <lucide-angular name="save" [size]="16"></lucide-angular>
                          <span>Guardar configuración</span>
                        }
                      </button>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Info Card -->
      @if (selectedSubPortfolioId > 0) {
        <div class="max-w-5xl mx-auto mb-6">
          <div class="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <lucide-angular name="info" [size]="20" class="text-amber-400 mt-0.5 flex-shrink-0"></lucide-angular>
              <div>
                <p class="text-amber-200 text-sm font-medium">Instrucciones - Campos de Montos</p>
                <ul class="text-amber-200/70 text-sm mt-1 space-y-1">
                  <li>Use los toggles para mostrar u ocultar cada campo de monto en el panel de deuda</li>
                  <li>Haga clic en el nombre para editarlo y personalizar cómo se muestra</li>
                  <li>Arrastre los campos para cambiar el orden de visualización</li>
                  <li>Los cambios se guardan al hacer clic en "Guardar Cambios"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Fields List -->
        <div class="max-w-5xl mx-auto">
          <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
            @if (loading()) {
              <div class="p-12 text-center">
                <div class="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p class="mt-4 text-gray-400">Cargando campos de montos...</p>
              </div>
            } @else if (amountFields().length === 0) {
              <div class="p-12 text-center">
                <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <lucide-angular name="dollar-sign" [size]="32" class="text-gray-600"></lucide-angular>
                </div>
                <p class="text-gray-300 mb-2">No se encontraron campos de montos</p>
                <p class="text-sm text-gray-500">
                  Esta subcartera no tiene campos numéricos decimales configurados
                </p>
              </div>
            } @else {
              <!-- Header -->
              <div class="bg-slate-800 border-b border-slate-700 px-6 py-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold text-gray-300">
                    {{ amountFields().length }} campos de montos encontrados
                  </span>
                  <div class="flex items-center gap-4">
                    <button (click)="toggleAll(true)"
                            class="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                      Mostrar todos
                    </button>
                    <button (click)="toggleAll(false)"
                            class="text-xs text-red-400 hover:text-red-300 transition-colors">
                      Ocultar todos
                    </button>
                  </div>
                </div>
              </div>

              <!-- Draggable List -->
              <div cdkDropList
                   (cdkDropListDropped)="drop($event)"
                   class="divide-y divide-slate-800">
                @for (field of amountFields(); track field.id; let i = $index) {
                  <div cdkDrag
                       class="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors cursor-move">
                    <!-- Drag Handle -->
                    <div class="flex items-center gap-4 flex-1">
                      <div cdkDragHandle class="text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing">
                        <lucide-angular name="grip-vertical" [size]="20"></lucide-angular>
                      </div>

                      <!-- Order Number -->
                      <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-sm font-bold text-slate-400">
                        {{ i + 1 }}
                      </div>

                      <!-- Field Info -->
                      <div class="flex-1 min-w-0">
                        <input type="text"
                               [(ngModel)]="field.nombre"
                               (ngModelChange)="onNameChange(field)"
                               class="w-full bg-transparent border-b border-transparent hover:border-slate-600 focus:border-amber-500 focus:outline-none font-medium text-white px-1 py-0.5 -ml-1 transition-colors"
                               [title]="'Editar nombre: ' + field.nombre">
                        <div class="text-xs text-gray-500 font-mono mt-0.5">{{ field.codigo }}</div>
                      </div>

                      <!-- Data Type Badge -->
                      <div class="px-2 py-1 bg-slate-800 rounded text-xs text-gray-400">
                        {{ field.tipoSql }}
                      </div>
                    </div>

                    <!-- Toggle -->
                    <label class="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox"
                             [checked]="field.isVisible"
                             (change)="toggleVisibility(field)"
                             class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                      <span class="ml-3 text-sm font-medium" [class]="field.isVisible ? 'text-amber-400' : 'text-gray-500'">
                        {{ field.isVisible ? 'Visible' : 'Oculto' }}
                      </span>
                    </label>

                    <!-- Drag Placeholder -->
                    <div *cdkDragPlaceholder class="bg-amber-900/20 border-2 border-dashed border-amber-500 rounded-lg h-16"></div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- Success Toast -->
      @if (showSuccess()) {
        <div class="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in">
          <lucide-angular name="check-circle" [size]="20"></lucide-angular>
          <span>Cambios guardados exitosamente</span>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }

    .cdk-drag-preview {
      background: #1e293b;
      border-radius: 0.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border: 1px solid #334155;
    }

    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .cdk-drop-list-dragging .cdk-drag {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `]
})
export class AmountDisplayConfigComponent implements OnInit {
  tenants = signal<Tenant[]>([]);
  portfolios = signal<Portfolio[]>([]);
  subPortfolios = signal<SubPortfolio[]>([]);
  amountFields = signal<AmountFieldConfig[]>([]);
  originalFields = signal<AmountFieldConfig[]>([]);

  loading = signal(false);
  saving = signal(false);
  showSuccess = signal(false);

  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  // Primera cuota config
  firstInstallmentPanelOpen = signal(false);
  selectedMaxDays = signal<number | null>(null);
  originalMaxDays = signal<number | null>(null);
  savingFirstInstallment = signal(false);
  availableDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private typificationService: TypificationService,
    private portfolioService: PortfolioService,
    private managementService: ManagementService,
    private firstInstallmentService: FirstInstallmentConfigService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.typificationService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants.set(tenants);
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
      }
    });
  }

  onTenantChange() {
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.portfolios.set([]);
    this.subPortfolios.set([]);
    this.amountFields.set([]);
    this.originalFields.set([]);
    // Reset primera cuota config
    this.selectedMaxDays.set(null);
    this.originalMaxDays.set(null);
    this.firstInstallmentPanelOpen.set(false);

    if (this.selectedTenantId > 0) {
      this.loadPortfolios();
    }
  }

  loadPortfolios() {
    this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
      next: (portfolios) => {
        this.portfolios.set(portfolios);
      },
      error: (error) => {
        console.error('Error loading portfolios:', error);
      }
    });
  }

  onPortfolioChange() {
    this.selectedSubPortfolioId = 0;
    this.subPortfolios.set([]);
    this.amountFields.set([]);
    this.originalFields.set([]);
    // Reset primera cuota config
    this.selectedMaxDays.set(null);
    this.originalMaxDays.set(null);
    this.firstInstallmentPanelOpen.set(false);

    if (this.selectedPortfolioId > 0) {
      this.loadSubPortfolios();
    }
  }

  loadSubPortfolios() {
    this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
      next: (subPortfolios) => {
        this.subPortfolios.set(subPortfolios);
      },
      error: (error) => {
        console.error('Error loading subportfolios:', error);
      }
    });
  }

  onSubPortfolioChange() {
    this.amountFields.set([]);
    this.originalFields.set([]);
    // Reset primera cuota config
    this.selectedMaxDays.set(null);
    this.originalMaxDays.set(null);
    this.firstInstallmentPanelOpen.set(false);

    if (this.selectedSubPortfolioId > 0) {
      this.loadAmountFields();
      this.loadFirstInstallmentConfig();
    }
  }

  loadAmountFields() {
    this.loading.set(true);

    this.managementService.getMontoCabeceras(this.selectedSubPortfolioId).subscribe({
      next: (cabeceras) => {
        // Sort by ordenMonto, then map to AmountFieldConfig
        const sorted = [...cabeceras].sort((a, b) =>
          (a.ordenMonto || 0) - (b.ordenMonto || 0)
        );

        const fields: AmountFieldConfig[] = sorted.map(c => ({
          ...c,
          isVisible: c.esVisibleMonto === 1 || c.esVisibleMonto === undefined || c.esVisibleMonto === null
        }));

        this.amountFields.set(fields);
        // Deep copy for comparison
        this.originalFields.set(JSON.parse(JSON.stringify(fields)));
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading amount fields:', error);
        this.loading.set(false);
      }
    });
  }

  toggleVisibility(field: AmountFieldConfig) {
    field.isVisible = !field.isVisible;
    this.amountFields.set([...this.amountFields()]);
  }

  onNameChange(field: AmountFieldConfig) {
    // Trigger change detection
    this.amountFields.set([...this.amountFields()]);
  }

  toggleAll(visible: boolean) {
    const fields = this.amountFields().map(f => ({
      ...f,
      isVisible: visible
    }));
    this.amountFields.set(fields);
  }

  drop(event: CdkDragDrop<AmountFieldConfig[]>) {
    const fields = [...this.amountFields()];
    moveItemInArray(fields, event.previousIndex, event.currentIndex);
    this.amountFields.set(fields);
  }

  hasChanges(): boolean {
    const current = this.amountFields();
    const original = this.originalFields();

    if (current.length !== original.length) return true;

    for (let i = 0; i < current.length; i++) {
      if (current[i].id !== original[i].id) return true;
      if (current[i].isVisible !== original[i].isVisible) return true;
      if (current[i].nombre !== original[i].nombre) return true;
    }

    return false;
  }

  saveChanges() {
    if (!this.hasChanges() || this.saving()) return;

    this.saving.set(true);

    const updates = this.amountFields().map((field, index) => ({
      id: field.id,
      esVisibleMonto: field.isVisible ? 1 : 0,
      ordenMonto: index * 10, // Espaciado de 10 para permitir inserciones futuras
      nombre: field.nombre
    }));

    this.managementService.updateAmountVisibility(this.selectedSubPortfolioId, updates).subscribe({
      next: () => {
        this.saving.set(false);
        this.showSuccessMessage();
        // Update original to current
        this.originalFields.set(JSON.parse(JSON.stringify(this.amountFields())));
      },
      error: (error) => {
        console.error('Error saving changes:', error);
        this.saving.set(false);
        alert('Error al guardar los cambios');
      }
    });
  }

  showSuccessMessage() {
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }

  // ==================== Primera Cuota Config ====================

  toggleFirstInstallmentPanel() {
    this.firstInstallmentPanelOpen.update(v => !v);
  }

  loadFirstInstallmentConfig() {
    this.firstInstallmentService.getConfig(this.selectedSubPortfolioId).subscribe({
      next: (config) => {
        const maxDays = config?.maxDays ?? null;
        this.selectedMaxDays.set(maxDays);
        this.originalMaxDays.set(maxDays);
      },
      error: (error) => {
        console.error('Error loading first installment config:', error);
        this.selectedMaxDays.set(null);
        this.originalMaxDays.set(null);
      }
    });
  }

  selectMaxDays(days: number | null) {
    this.selectedMaxDays.set(days);
  }

  hasFirstInstallmentChanges(): boolean {
    return this.selectedMaxDays() !== this.originalMaxDays();
  }

  saveFirstInstallmentConfig() {
    if (!this.hasFirstInstallmentChanges() || this.savingFirstInstallment()) return;

    this.savingFirstInstallment.set(true);

    const config = {
      subPortfolioId: this.selectedSubPortfolioId,
      maxDays: this.selectedMaxDays()!
    };

    this.firstInstallmentService.saveConfig(config).subscribe({
      next: () => {
        this.savingFirstInstallment.set(false);
        this.originalMaxDays.set(this.selectedMaxDays());
        this.showSuccessMessage();
      },
      error: (error) => {
        console.error('Error saving first installment config:', error);
        this.savingFirstInstallment.set(false);
        alert('Error al guardar la configuración de primera cuota');
      }
    });
  }
}
