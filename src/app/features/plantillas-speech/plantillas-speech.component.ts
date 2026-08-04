import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../environments/environment';

type Rubrica = 'CD' | 'PDP';

interface CarteraSpeech {
  idCartera: number;
  nombreCartera: string;
  configurada: boolean;
}

interface CriterioSpeech {
  campo: string;
  etiqueta: string;
  seccion: string;
  activo: boolean;
}

interface ConfigSpeech {
  idCartera: number;
  nombreCartera: string | null;
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
            <p class="text-sm text-gray-400">Criterios que salen en la evaluación de calidad, por cartera</p>
          </div>
        </div>
      </div>

      <!-- Carteras disponibles -->
      <div class="max-w-7xl mx-auto mb-6">
        <div class="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-white flex items-center gap-2">
              <lucide-angular name="briefcase" [size]="20" class="text-purple-400"></lucide-angular>
              Carteras Disponibles
            </h2>
            <button (click)="cargarCarteras()"
                    class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm flex items-center gap-2 transition-colors">
              <lucide-angular name="refresh-cw" [size]="16" [class]="loadingCarteras() ? 'animate-spin' : ''"></lucide-angular>
              Actualizar
            </button>
          </div>

          @if (loadingCarteras()) {
            <div class="p-8 flex justify-center">
              <lucide-angular name="loader-2" [size]="32" class="text-purple-400 animate-spin"></lucide-angular>
            </div>
          } @else if (carteras().length === 0) {
            <p class="text-sm text-gray-400">No hay carteras con gestiones registradas.</p>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (cartera of carteras(); track cartera.idCartera) {
                <button type="button"
                        (click)="seleccionarCartera(cartera)"
                        class="text-left bg-slate-800 rounded-lg p-4 border transition-colors"
                        [class]="cartera.idCartera === carteraSeleccionada()?.idCartera
                                   ? 'border-purple-500 ring-2 ring-purple-500/40'
                                   : 'border-slate-700 hover:border-purple-500'">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center shrink-0">
                      <lucide-angular name="mic" [size]="20" class="text-purple-400"></lucide-angular>
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-semibold text-white truncate">{{ cartera.nombreCartera }}</h3>
                      <p class="text-xs text-gray-400">ID {{ cartera.idCartera }}</p>
                    </div>
                  </div>
                  <div class="mt-2">
                    @if (cartera.configurada) {
                      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-600/20 text-green-300 rounded text-xs">
                        <lucide-angular name="check-circle" [size]="12"></lucide-angular>
                        Configurada
                      </span>
                    } @else {
                      <span class="px-1.5 py-0.5 bg-slate-700 text-gray-400 rounded text-xs">Sin configurar</span>
                    }
                  </div>
                </button>
              }
            </div>
          }
        </div>
      </div>

      @if (carteraSeleccionada(); as cartera) {
        <!-- Modo de la plantilla -->
        <div class="max-w-7xl mx-auto mb-6">
          <div class="bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-800">
            <h2 class="text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <lucide-angular name="sliders" [size]="20" class="text-purple-400"></lucide-angular>
              Modo de la plantilla
            </h2>
            <p class="text-sm text-gray-400 mb-4">
              Se guarda con la cartera, pero todavía no cambia cómo se genera el reporte.
            </p>

            <div class="inline-flex bg-slate-800 rounded-lg p-1 border border-slate-700">
              <button type="button" (click)="setRigido(true)"
                      class="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                      [class]="rigido() ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'">
                <lucide-angular name="lock" [size]="16"></lucide-angular>
                RIGIDO
              </button>
              <button type="button" (click)="setRigido(false)"
                      class="px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                      [class]="!rigido() ? 'bg-purple-600 text-white shadow' : 'text-gray-400 hover:text-white'">
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
                  Criterios de {{ cartera.nombreCartera }}
                </h2>
                <span class="text-sm text-gray-400">
                  {{ activos() }} de {{ criterios().length }} activos
                </span>
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
                      {{ tab.codigo === 'CD' ? config()?.cd?.length : config()?.pdp?.length }}
                    </span>
                  </button>
                }
              </div>
            </div>

            @if (loadingConfig()) {
              <div class="p-8 flex justify-center">
                <lucide-angular name="loader-2" [size]="32" class="text-purple-400 animate-spin"></lucide-angular>
              </div>
            } @else {
              <div class="divide-y divide-slate-800">
                @for (criterio of criterios(); track criterio.campo; let i = $index) {
                  <div class="px-6 py-3 flex items-center gap-4 hover:bg-slate-800/30 transition-colors">
                    <span class="w-7 h-7 shrink-0 rounded-full bg-slate-800 text-gray-400 text-xs flex items-center justify-center">
                      {{ i + 1 }}
                    </span>

                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium" [class]="criterio.activo ? 'text-white' : 'text-gray-500 line-through'">
                        {{ criterio.etiqueta }}
                      </p>
                      <p class="text-xs text-gray-500 font-mono">{{ criterio.campo }}</p>
                    </div>

                    <span class="px-2 py-0.5 rounded text-xs shrink-0" [class]="colorSeccion(criterio.seccion)">
                      {{ criterio.seccion }}
                    </span>

                    <label class="relative inline-flex items-center cursor-pointer shrink-0">
                      <input type="checkbox"
                             [checked]="criterio.activo"
                             (change)="alternar(criterio)"
                             class="sr-only peer">
                      <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                }
              </div>

              <div class="px-6 py-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <p class="text-xs text-gray-500">
                  Los criterios apagados no salen en el Excel: la fila se elimina y las de abajo suben.
                </p>
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
            }
          </div>
        </div>
      } @else if (!loadingCarteras()) {
        <div class="max-w-7xl mx-auto">
          <div class="bg-slate-900 rounded-xl p-8 shadow-sm border border-slate-800 text-center">
            <lucide-angular name="briefcase" [size]="32" class="text-slate-600 mx-auto mb-2"></lucide-angular>
            <p class="text-sm text-gray-400">Seleccione una cartera para configurar su plantilla.</p>
          </div>
        </div>
      }

      <!-- Toast de éxito/error -->
      @if (toastMessage()) {
        <div class="fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg animate-slide-in flex items-center gap-2"
             [class]="toastType() === 'success' ? 'bg-green-600' : 'bg-red-600'">
          <lucide-angular [name]="toastType() === 'success' ? 'check-circle' : 'alert-circle'" [size]="20" class="text-white"></lucide-angular>
          <span class="text-white font-medium">{{ toastMessage() }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .animate-slide-in {
      animation: slideIn 0.3s ease-out;
    }
  `]
})
export class PlantillasSpeechComponent implements OnInit {
  private apiUrl = `${environment.apiUrl}/plantillas-speech`;

  readonly tabs: { codigo: Rubrica; etiqueta: string }[] = [
    { codigo: 'CD', etiqueta: 'CONTACTO DIRECTO' },
    { codigo: 'PDP', etiqueta: 'PROMESA DE PAGO' }
  ];

  carteras = signal<CarteraSpeech[]>([]);
  carteraSeleccionada = signal<CarteraSpeech | null>(null);
  config = signal<ConfigSpeech | null>(null);
  rubrica = signal<Rubrica>('CD');

  loadingCarteras = signal(false);
  loadingConfig = signal(false);
  saving = signal(false);

  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  /** Criterios de la pestaña activa, en el orden en que salen en el Excel. */
  criterios = computed<CriterioSpeech[]>(() => {
    const cfg = this.config();
    if (!cfg) return [];
    return this.rubrica() === 'CD' ? cfg.cd : cfg.pdp;
  });

  activos = computed(() => this.criterios().filter(c => c.activo).length);

  rigido = computed(() => this.config()?.rigido ?? false);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarCarteras();
  }

  cargarCarteras(): void {
    this.loadingCarteras.set(true);
    this.http.get<any>(`${this.apiUrl}/carteras`).subscribe({
      next: (res) => {
        this.carteras.set(res.data || []);
        this.loadingCarteras.set(false);

        // Al recargar se mantiene la cartera abierta, si sigue existiendo.
        const actual = this.carteraSeleccionada();
        if (actual) {
          const vigente = this.carteras().find(c => c.idCartera === actual.idCartera);
          this.carteraSeleccionada.set(vigente ?? null);
        }
      },
      error: (err) => {
        console.error('Error cargando carteras:', err);
        this.loadingCarteras.set(false);
        this.mostrarToast('Error al cargar las carteras', 'error');
      }
    });
  }

  seleccionarCartera(cartera: CarteraSpeech): void {
    this.carteraSeleccionada.set(cartera);
    this.rubrica.set('CD');
    this.cargarConfig(cartera.idCartera);
  }

  private cargarConfig(idCartera: number): void {
    this.loadingConfig.set(true);
    this.config.set(null);

    this.http.get<any>(`${this.apiUrl}/cartera/${idCartera}`).subscribe({
      next: (res) => {
        this.config.set(res.data);
        this.loadingConfig.set(false);
      },
      error: (err) => {
        console.error('Error cargando configuración:', err);
        this.loadingConfig.set(false);
        this.mostrarToast('Error al cargar la configuración', 'error');
      }
    });
  }

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

  colorSeccion(seccion: string): string {
    switch (seccion) {
      case 'PRESENTACION': return 'bg-green-600/20 text-green-300';
      case 'NEGOCIACION': return 'bg-amber-600/20 text-amber-300';
      default: return 'bg-blue-600/20 text-blue-300';
    }
  }

  guardar(): void {
    const cartera = this.carteraSeleccionada();
    const cfg = this.config();
    if (!cartera || !cfg) return;

    this.saving.set(true);
    this.http.put<any>(`${this.apiUrl}/cartera/${cartera.idCartera}`, {
      nombreCartera: cartera.nombreCartera,
      rigido: cfg.rigido,
      cd: cfg.cd,
      pdp: cfg.pdp
    }).subscribe({
      next: (res) => {
        this.config.set(res.data);
        this.saving.set(false);
        this.mostrarToast('Plantilla guardada correctamente', 'success');
        this.cargarCarteras();
      },
      error: (err) => {
        console.error('Error guardando plantilla:', err);
        this.saving.set(false);
        this.mostrarToast('Error al guardar la plantilla', 'error');
      }
    });
  }

  private mostrarToast(mensaje: string, tipo: 'success' | 'error'): void {
    this.toastMessage.set(mensaje);
    this.toastType.set(tipo);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
