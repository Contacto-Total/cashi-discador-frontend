import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { ToastService } from '../../shared/services/toast.service';

type Rubrica = 'CD' | 'PDP';

type Seccion = 'PRESENTACION' | 'NEGOCIACION' | 'CIERRE';

interface CriterioSpeech {
  campo: string;
  etiqueta: string;
  seccion: string;
  activo: boolean;
  /** Si lo agregó calidad, en vez de venir en la rúbrica. Solo decora la fila. */
  personalizado: boolean;
  /**
   * false en pres_asert, cuya descripción la decide el interruptor
   * RIGIDO / NO RIGIDO de esta misma pantalla.
   */
  descripcionEditable: boolean;
  descripcion: string | null;
  ejemplo: string | null;
}

interface ConfigSpeech {
  idSubcartera: number;
  nombreSubcartera: string | null;
  configurada: boolean;
  rigido: boolean;
  cd: CriterioSpeech[];
  pdp: CriterioSpeech[];
}

@Component({
  selector: 'app-plantillas-speech',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <lucide-angular name="file-spreadsheet" [size]="24" class="text-white"></lucide-angular>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Plantillas de Reporte Speech</h1>
            <p class="text-sm text-gray-400">Criterios que salen en la evaluación de calidad, por subcartera</p>
          </div>
        </div>
      </div>

      <!-- Selector en cascada -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800">
          <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <lucide-angular name="folder-tree" [size]="20" class="text-purple-400"></lucide-angular>
            Subcartera
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <!-- Proveedor -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Proveedor</label>
              <select [(ngModel)]="selectedTenantId" (change)="onTenantChange()"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer transition-colors hover:bg-slate-700/60 hover:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option [ngValue]="0">Seleccionar...</option>
                @for (tenant of tenants; track tenant.id) {
                  <option [ngValue]="tenant.id">{{ tenant.tenantName }}</option>
                }
              </select>
            </div>

            <!-- Cartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Cartera</label>
              <select [(ngModel)]="selectedPortfolioId" (change)="onPortfolioChange()"
                      [disabled]="portfolios.length === 0"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer transition-colors enabled:hover:bg-slate-700/60 enabled:hover:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [ngValue]="0">Seleccionar...</option>
                @for (portfolio of portfolios; track portfolio.id) {
                  <option [ngValue]="portfolio.id">{{ portfolio.portfolioName }}</option>
                }
              </select>
            </div>

            <!-- Subcartera -->
            <div>
              <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Subcartera</label>
              <select [(ngModel)]="selectedSubPortfolioId" (change)="onSubPortfolioChange()"
                      [disabled]="subPortfolios.length === 0"
                      class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer transition-colors enabled:hover:bg-slate-700/60 enabled:hover:border-purple-500/60 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option [ngValue]="0">Seleccionar...</option>
                @for (sub of subPortfolios; track sub.id) {
                  <option [ngValue]="sub.id">{{ sub.subPortfolioName }}</option>
                }
              </select>
            </div>

            <button (click)="buscar()"
                    [disabled]="loadingConfig()"
                    class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              @if (loadingConfig()) {
                <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
              } @else {
                <lucide-angular name="search" [size]="16"></lucide-angular>
              }
              Buscar
            </button>
          </div>
        </div>
      </div>

      @if (config(); as cfg) {
        <!-- Modo de la plantilla -->
        <div class="max-w-7xl mx-auto mb-6">
          <div class="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800">
            <h2 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <lucide-angular name="sliders" [size]="20" class="text-purple-400"></lucide-angular>
              Modalidad de presentación del asesor
            </h2>

            <div class="inline-flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button type="button" (click)="setRigido(true)"
                      class="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                      [class]="cfg.rigido ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'">
                <lucide-angular name="lock" [size]="16"></lucide-angular>
                RIGIDO
              </button>
              <button type="button" (click)="setRigido(false)"
                      class="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                      [class]="!cfg.rigido ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'">
                <lucide-angular name="unlock" [size]="16"></lucide-angular>
                NO RIGIDO
              </button>
            </div>
          </div>
        </div>

        <!-- Criterios por rubrica -->
        <div class="max-w-7xl mx-auto">
          <div class="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
            <div class="p-6 border-b border-slate-800">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                  <lucide-angular name="list-checks" [size]="20" class="text-purple-400"></lucide-angular>
                  Criterios de {{ nombreSubcarteraSeleccionada() }}
                  @if (!cfg.configurada) {
                    <span class="px-2 py-0.5 bg-slate-700 text-gray-400 rounded text-xs font-normal">Sin configurar</span>
                  }
                </h2>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-400">
                    {{ activos() }} de {{ criterios().length }} activos
                  </span>
                  <button type="button" (click)="abrirModal()"
                          class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-500/60 text-white rounded-lg text-sm flex items-center gap-1.5 transition-colors">
                    <lucide-angular name="plus" [size]="16" class="text-purple-400"></lucide-angular>
                    Agregar campo
                  </button>
                </div>
              </div>

              <!-- Pestañas CD / PDP -->
              <div class="mt-4 flex gap-6 border-b border-slate-800 -mb-6">
                @for (tab of tabs; track tab.codigo) {
                  <button type="button" (click)="rubrica.set(tab.codigo)"
                          class="pb-3 -mb-px text-sm font-medium border-b-2 transition-colors"
                          [class]="rubrica() === tab.codigo
                                     ? 'border-purple-500 text-white'
                                     : 'border-transparent text-gray-400 hover:text-gray-200'">
                    {{ tab.etiqueta }}
                    <span class="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                          [class]="rubrica() === tab.codigo ? 'bg-purple-600/30 text-purple-200' : 'bg-slate-800 text-gray-500'">
                      {{ tab.codigo === 'CD' ? cfg.cd.length : cfg.pdp.length }}
                    </span>
                  </button>
                }
              </div>
            </div>

            <div class="divide-y divide-slate-800">
              @for (criterio of criterios(); track criterio.campo; let i = $index) {
                <div class="px-6 py-3 flex items-center gap-4 transition-colors hover:bg-slate-800/60">
                  <span class="w-7 h-7 shrink-0 rounded-full bg-slate-800 text-gray-400 text-xs flex items-center justify-center">
                    {{ i + 1 }}
                  </span>

                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium flex items-center gap-2" [class]="criterio.activo ? 'text-white' : 'text-gray-500 line-through'">
                      {{ criterio.etiqueta }}
                      @if (criterio.personalizado) {
                        <span class="px-1.5 py-0.5 rounded text-[10px] bg-purple-600/20 text-purple-300 no-underline shrink-0">PROPIO</span>
                      }
                    </p>
                    <p class="text-xs text-gray-500 font-mono">{{ criterio.campo }}</p>
                    @if (criterio.descripcionEditable && !criterio.descripcion) {
                      <p class="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                        <lucide-angular name="alert-triangle" [size]="12"></lucide-angular>
                        Sin descripción: no se va a evaluar, saldrá vacío
                      </p>
                    }
                  </div>

                  <span class="px-2 py-0.5 rounded text-xs shrink-0" [class]="colorSeccion(criterio.seccion)">
                    {{ criterio.seccion }}
                  </span>

                  <label class="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox"
                           [checked]="criterio.activo"
                           (change)="alternar(criterio)"
                           class="sr-only peer">
                    <div class="w-11 h-6 bg-slate-700 transition-all peer-hover:ring-4 peer-hover:ring-purple-500/25 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>

                  <!-- Todos se editan, de la rúbrica o propios: las descripciones
                       de la rúbrica también viven en la BD. -->
                  <button type="button" title="Editar este criterio"
                          class="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                          (click)="abrirModal(criterio)">
                    <lucide-angular name="pencil" [size]="16"></lucide-angular>
                  </button>
                </div>
              }
            </div>

            <div class="px-6 py-4 border-t border-slate-800 flex items-center justify-end flex-wrap gap-3">
              <button (click)="guardar()"
                      [disabled]="saving()"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50">
                @if (saving()) {
                  <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
                } @else {
                  <lucide-angular name="save" [size]="16"></lucide-angular>
                }
                Guardar
              </button>
            </div>
          </div>
        </div>
      } @else if (!loadingConfig()) {
        <div class="max-w-7xl mx-auto">
          <div class="bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-800 text-center">
            <lucide-angular name="folder-tree" [size]="32" class="text-slate-600 mx-auto mb-2"></lucide-angular>
            <p class="text-sm text-gray-400">
              Seleccione Proveedor, Cartera y Subcartera, y presione Buscar.
            </p>
          </div>
        </div>
      }

      <!-- Agregar campo -->
      @if (modalAbierto()) {
        <div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 py-10"
             (click)="cerrarModal()">
          <div class="bg-slate-900 rounded-xl border border-slate-700 shadow-2xl w-full max-w-3xl"
               (click)="$event.stopPropagation()">

            <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <lucide-angular [name]="editando() ? 'pencil' : 'plus'" [size]="20" class="text-purple-400"></lucide-angular>
                {{ editando() ? 'Editar campo de' : 'Agregar campo a' }}
                {{ rubrica() === 'CD' ? 'CONTACTO DIRECTO' : 'PROMESA DE PAGO' }}
              </h3>
              <button type="button" (click)="cerrarModal()"
                      class="text-gray-500 hover:text-white transition-colors">
                <lucide-angular name="x" [size]="20"></lucide-angular>
              </button>
            </div>

            <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Etiqueta
                  </label>
                  <input type="text" [(ngModel)]="nuevoEtiqueta" maxlength="150"
                         placeholder="Valida identidad del titular"
                         class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <p class="text-xs text-gray-500 mt-1">
                    Es el texto que aparece en el criterio al descargar el reporte de
                    evaluación, y en esta misma lista.
                  </p>
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Sección
                  </label>
                  <select [(ngModel)]="nuevoSeccion"
                          class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="PRESENTACION">PRESENTACIÓN</option>
                    <option value="NEGOCIACION">NEGOCIACIÓN</option>
                    <option value="CIERRE">CIERRE</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">
                    El campo se agrega al final de esa sección y suma en su subtotal.
                  </p>
                </div>

                @if (descripcionBloqueada()) {
                  <!-- pres_asert: su descripción la decide el interruptor de arriba,
                       así que un texto fijo acá lo dejaría sin efecto. -->
                  <div class="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                    <p class="text-xs text-gray-400 leading-relaxed">
                      La instrucción de este criterio la define el modo
                      <span class="text-gray-300">RIGIDO / NO RIGIDO</span> que se elige
                      arriba en esta misma pantalla, porque cambia según cómo se espera
                      que el asesor abra la llamada. Acá solo se editan la etiqueta y la
                      sección.
                    </p>
                  </div>
                } @else {
                  <div>
                    <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Qué debe hacer el asesor
                    </label>
                    <textarea [(ngModel)]="nuevoDescripcion" rows="4" maxlength="400"
                              placeholder="Se espera que el asesor confirme que habla con el titular, pidiendo un dato que solo esa persona pueda saber."
                              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"></textarea>
                    <p class="text-xs text-gray-500 mt-1">
                      {{ (nuevoDescripcion || '').length }}/400
                    </p>
                  </div>

                  <div>
                    <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                      Frase de ejemplo
                    </label>
                    <textarea [(ngModel)]="nuevoEjemplo" rows="2" maxlength="400"
                              placeholder="&quot;Para validar sus datos, ¿me confirma su fecha de nacimiento?&quot;"
                              class="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"></textarea>
                  </div>
                }
              </div>

              <!-- Guía. Está al lado y no escondida en un tooltip a propósito:
                   la calidad de la evaluación depende de cómo se redacte esto. -->
              <div class="space-y-4">
                <div class="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                  <p class="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Ejemplo de una descripción que funciona
                  </p>
                  <p class="text-xs text-gray-400 leading-relaxed italic">
                    "Se espera que el asesor pregunte el motivo de no pago del cliente. A
                    veces el cliente lo menciona sin que el asesor lo pregunte; en ese caso,
                    considerar este campo como cumplido."
                  </p>
                  <p class="text-xs text-gray-500 mt-2 leading-relaxed">
                    <span class="text-gray-300">Ejemplo:</span>
                    "¿A qué se debe que no pudo realizar el pago de la deuda?"
                  </p>
                </div>

                <div class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p class="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <lucide-angular name="alert-triangle" [size]="14"></lucide-angular>
                    Qué evitar
                  </p>
                  <p class="text-xs text-gray-400 leading-relaxed">
                    <span class="text-gray-300">Que se pise con otro criterio.</span>
                    Si describe algo que ya mide un criterio existente, la evaluación puede
                    dar por cumplido uno y no el otro.
                  </p>
                </div>

                @if (editando()) {
                  <div class="bg-slate-800/60 border border-slate-700 rounded-lg p-4">
                    <p class="text-xs text-gray-400 leading-relaxed">
                      Los cambios se aplican a las evaluaciones
                      <span class="text-gray-300">nuevas</span>. Las que ya se hicieron
                      se calificaron con el texto anterior y no se recalculan.
                    </p>
                  </div>
                }
              </div>
            </div>

            <div class="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button type="button" (click)="cerrarModal()"
                      class="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
                Cancelar
              </button>
              <button type="button" (click)="guardarCriterio()"
                      [disabled]="creando() || !formularioCompleto()"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                @if (creando()) {
                  <lucide-angular name="loader-2" [size]="16" class="animate-spin"></lucide-angular>
                } @else {
                  <lucide-angular name="save" [size]="16"></lucide-angular>
                }
                Guardar
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class PlantillasSpeechComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/plantillas-speech`;

  readonly tabs: { codigo: Rubrica; etiqueta: string }[] = [
    { codigo: 'CD', etiqueta: 'CONTACTO DIRECTO' },
    { codigo: 'PDP', etiqueta: 'PROMESA DE PAGO' }
  ];

  // Selector en cascada, igual que Grabaciones Discador
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId = 0;
  selectedPortfolioId = 0;
  selectedSubPortfolioId = 0;

  config = signal<ConfigSpeech | null>(null);
  rubrica = signal<Rubrica>('CD');

  loadingConfig = signal(false);
  saving = signal(false);

  // === Ventana de agregar / editar campo ===
  modalAbierto = signal(false);
  creando = signal(false);
  /** El criterio que se está editando, o null si se está creando uno nuevo. */
  editando = signal<CriterioSpeech | null>(null);
  nuevoEtiqueta = '';
  nuevoSeccion: Seccion = 'PRESENTACION';
  nuevoDescripcion = '';
  nuevoEjemplo = '';

  /** Criterios de la pestaña activa, en el orden en que salen en el Excel. */
  criterios = computed<CriterioSpeech[]>(() => {
    const cfg = this.config();
    if (!cfg) return [];
    return this.rubrica() === 'CD' ? cfg.cd : cfg.pdp;
  });

  activos = computed(() => this.criterios().filter(c => c.activo).length);

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private portfolioService: PortfolioService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  // === Selector en cascada ===

  loadTenants(): void {
    this.tenantService.getAllTenants().subscribe({
      next: (data) => { this.tenants = data; },
      error: (err) => {
        console.error('Error cargando proveedores:', err);
        this.toastService.error('Error al cargar los proveedores');
      }
    });
  }

  onTenantChange(): void {
    this.portfolios = [];
    this.subPortfolios = [];
    this.selectedPortfolioId = 0;
    this.selectedSubPortfolioId = 0;
    this.limpiarConfig();

    if (this.selectedTenantId > 0) {
      this.portfolioService.getPortfoliosByTenant(this.selectedTenantId).subscribe({
        next: (data) => { this.portfolios = data; },
        error: (err) => { console.error('Error cargando carteras:', err); }
      });
    }
  }

  onPortfolioChange(): void {
    this.subPortfolios = [];
    this.selectedSubPortfolioId = 0;
    this.limpiarConfig();

    if (this.selectedPortfolioId > 0) {
      this.portfolioService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (data) => { this.subPortfolios = data; },
        error: (err) => { console.error('Error cargando subcarteras:', err); }
      });
    }
  }

  /**
   * Cambiar de subcartera descarta lo que hay en pantalla: los criterios son de
   * la subcartera que se buscó, no de la que está elegida en el combo, y dejarlos
   * hacía que TRAMO PROPIO se viera como si fuera la configuración de CASTIGO
   * (y que Guardar lo escribiera contra el id equivocado).
   */
  onSubPortfolioChange(): void {
    this.limpiarConfig();
  }

  private limpiarConfig(): void {
    this.config.set(null);
    this.rubrica.set('CD');
  }

  /** Nombre de la subcartera elegida en el combo. Vacío si no hay ninguna. */
  nombreSubcarteraSeleccionada(): string {
    const sub = this.subPortfolios.find(s => s.id === this.selectedSubPortfolioId);
    return sub?.subPortfolioName ?? '';
  }

  /** Nombre de la cartera elegida. Solo viaja al guardar, para leer la tabla. */
  nombreCarteraSeleccionada(): string {
    const cartera = this.portfolios.find(p => p.id === this.selectedPortfolioId);
    return cartera?.portfolioName ?? '';
  }

  // === Búsqueda ===

  buscar(): void {
    if (!this.selectedTenantId || !this.selectedPortfolioId || !this.selectedSubPortfolioId) {
      this.toastService.error('Por favor, selecciona Proveedor, Cartera y Subcartera.');
      return;
    }

    this.loadingConfig.set(true);
    this.limpiarConfig();

    const nombre = encodeURIComponent(this.nombreSubcarteraSeleccionada());
    this.http.get<any>(`${this.apiUrl}/subcartera/${this.selectedSubPortfolioId}?nombre=${nombre}`).subscribe({
      next: (res) => {
        this.config.set(res.data);
        this.loadingConfig.set(false);
      },
      error: (err) => {
        console.error('Error cargando la configuración:', err);
        this.loadingConfig.set(false);
        this.toastService.error('Error al cargar la configuración');
      }
    });
  }

  // === Edición ===

  setRigido(valor: boolean): void {
    this.config.update(cfg => cfg ? { ...cfg, rigido: valor } : cfg);
  }

  alternar(criterio: CriterioSpeech): void {
    const rubrica = this.rubrica();
    this.config.update(cfg => {
      if (!cfg) return cfg;
      const invertir = (lista: CriterioSpeech[]) =>
        lista.map(c => c.campo === criterio.campo ? { ...c, activo: !c.activo } : c);
      return rubrica === 'CD'
        ? { ...cfg, cd: invertir(cfg.cd) }
        : { ...cfg, pdp: invertir(cfg.pdp) };
    });
  }

  // === Criterios propios ===

  /** Sin argumento crea uno nuevo; con un criterio, lo edita. */
  abrirModal(criterio?: CriterioSpeech): void {
    this.editando.set(criterio ?? null);
    this.nuevoEtiqueta = criterio?.etiqueta ?? '';
    this.nuevoSeccion = (criterio?.seccion as Seccion) ?? 'PRESENTACION';
    this.nuevoDescripcion = criterio?.descripcion ?? '';
    this.nuevoEjemplo = criterio?.ejemplo ?? '';
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    if (this.creando()) return;
    this.modalAbierto.set(false);
    this.editando.set(null);
  }

  /**
   * pres_asert: la instrucción sale del modo RIGIDO / NO RIGIDO, no de un texto
   * guardado. Se ocultan los dos campos en vez de mostrarlos deshabilitados
   * para no dar a entender que hay algo que desbloquear.
   */
  descripcionBloqueada(): boolean {
    const criterio = this.editando();
    return !!criterio && !criterio.descripcionEditable;
  }

  /** Los cuatro datos son obligatorios; en pres_asert solo aplican dos. */
  formularioCompleto(): boolean {
    if (!(this.nuevoEtiqueta || '').trim() || !this.nuevoSeccion) return false;
    if (this.descripcionBloqueada()) return true;
    return !!(this.nuevoDescripcion || '').trim() && !!(this.nuevoEjemplo || '').trim();
  }

  /**
   * Aplica una configuración que devolvió el servidor conservando los
   * interruptores que se movieron y todavía no se guardaron.
   *
   * Agregar y editar un criterio son operaciones inmediatas contra la BD, y la
   * respuesta trae la configuración tal como está guardada. Volcarla tal cual
   * pisaría los toggles que el usuario movió antes de presionar Guardar, y
   * desde la pantalla se vería como que "se revirtieron solos".
   */
  private aplicarConfig(nueva: ConfigSpeech): void {
    const previa = this.config();
    if (!previa) {
      this.config.set(nueva);
      return;
    }

    const conservar = (lista: CriterioSpeech[], anterior: CriterioSpeech[]) => {
      const activoPrevio = new Map(anterior.map(c => [c.campo, c.activo]));
      return lista.map(c => activoPrevio.has(c.campo)
        ? { ...c, activo: activoPrevio.get(c.campo)! }
        : c);
    };

    this.config.set({
      ...nueva,
      rigido: previa.rigido,
      cd: conservar(nueva.cd, previa.cd),
      pdp: conservar(nueva.pdp, previa.pdp)
    });
  }

  guardarCriterio(): void {
    const cfg = this.config();
    if (!cfg || !this.formularioCompleto()) return;

    const cuerpo = {
      etiqueta: (this.nuevoEtiqueta || '').trim(),
      seccion: this.nuevoSeccion,
      descripcion: (this.nuevoDescripcion || '').trim() || null,
      ejemplo: (this.nuevoEjemplo || '').trim() || null
    };

    const criterio = this.editando();
    // Al editar, el criterio se identifica por (subcartera, rúbrica, campo) y
    // no por un id: uno de la rúbrica que esta subcartera todavía no tocó no
    // tiene fila propia todavía, así que no habría id al que apuntar.
    const peticion = criterio
      ? this.http.put<any>(
          `${this.apiUrl}/subcartera/${cfg.idSubcartera}/criterio/${this.rubrica()}/${criterio.campo}`,
          cuerpo)
      : this.http.post<any>(`${this.apiUrl}/subcartera/${cfg.idSubcartera}/criterio`,
          { ...cuerpo, rubrica: this.rubrica() });

    this.creando.set(true);
    peticion.subscribe({
      next: (res) => {
        this.aplicarConfig(res.data);
        this.creando.set(false);
        this.modalAbierto.set(false);
        this.editando.set(null);
        this.toastService.success(criterio ? 'Campo actualizado' : 'Campo agregado');
      },
      error: (err) => {
        console.error('Error guardando el criterio:', err);
        this.creando.set(false);
        // El backend devuelve el motivo real en los 400 (nombre repetido, nombre
        // que no da un identificador válido): es lo único accionable que tiene
        // el usuario, así que se muestra tal cual.
        this.toastService.error(err?.error?.message ?? 'No se pudo guardar el campo');
      }
    });
  }

  colorSeccion(seccion: string): string {
    switch (seccion) {
      case 'PRESENTACION': return 'bg-green-600/20 text-green-300';
      case 'NEGOCIACION': return 'bg-amber-600/20 text-amber-300';
      default: return 'bg-blue-600/20 text-blue-300';
    }
  }

  guardar(): void {
    const cfg = this.config();
    if (!cfg) return;

    // Red de seguridad: nunca escribir lo que hay en pantalla contra una
    // subcartera distinta de la que se buscó.
    if (cfg.idSubcartera !== this.selectedSubPortfolioId) {
      this.toastService.error('La subcartera cambió: presiona Buscar antes de guardar.');
      return;
    }

    this.saving.set(true);
    this.http.put<any>(`${this.apiUrl}/subcartera/${cfg.idSubcartera}`, {
      nombreSubcartera: this.nombreSubcarteraSeleccionada() || cfg.nombreSubcartera,
      idInquilino: this.selectedTenantId,
      idCartera: this.selectedPortfolioId,
      nombreCartera: this.nombreCarteraSeleccionada(),
      rigido: cfg.rigido,
      cd: cfg.cd,
      pdp: cfg.pdp
    }).subscribe({
      next: (res) => {
        this.config.set(res.data);
        this.saving.set(false);
        this.toastService.success('Plantilla guardada correctamente');
      },
      error: (err) => {
        console.error('Error guardando la plantilla:', err);
        this.saving.set(false);
        this.toastService.error('Error al guardar la plantilla');
      }
    });
  }
}
