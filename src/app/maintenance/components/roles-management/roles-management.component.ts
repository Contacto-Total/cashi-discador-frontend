import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Observable } from 'rxjs';
import { TenantService } from '../../services/tenant.service';
import { PortfolioService } from '../../services/portfolio.service';
import { Tenant } from '../../models/tenant.model';
import { Portfolio } from '../../models/portfolio.model';
import { SubPortfolio } from '../../models/portfolio.model';
import { RolService, RolRequest, RolResponse } from '../../services/rol.service';
import { PermisoService, PermisoResponse } from '../../services/permiso.service';

// Interfaces
interface Permission {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
}

interface RoleAssignment {
  type: 'INQUILINO' | 'CARTERA' | 'SUBCARTERA';
  tenantId: number;
  portfolioId?: number;
  subPortfolioId?: number;
}

interface Role {
  id?: number;
  name: string;
  description: string;
  permissions: number[]; // IDs de permisos asignados
  assignments: RoleAssignment[]; // Asignaciones múltiples
  active: boolean;
}

@Component({
  selector: 'app-roles-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="h-[calc(100dvh-56px)] bg-slate-950 overflow-hidden flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="p-3 max-w-[1800px] mx-auto">
          <!-- Header -->
          <div class="mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <lucide-angular name="shield-check" [size]="16" class="text-white"></lucide-angular>
              </div>
              <div>
                <h1 class="text-lg font-bold text-white">Gestión de Roles</h1>
                <p class="text-xs text-gray-400">Define roles, permisos y asignaciones múltiples</p>
              </div>
            </div>
          </div>

          <!-- Grid de 3 Columnas -->
          <div class="grid grid-cols-12 gap-3">
            <!-- Columna 1: Lista de Roles (25%) -->
            <div class="col-span-3 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="list" [size]="16" class="text-purple-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">Roles</h2>
                  <span class="text-xs text-gray-400">({{ roles().length }})</span>
                </div>
                <button (click)="createNewRole()"
                        class="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1">
                  <lucide-angular name="plus" [size]="12"></lucide-angular>
                  Nuevo
                </button>
              </div>

              <div class="p-2 space-y-1 overflow-y-auto flex-1">
                @if (roles().length === 0) {
                  <div class="text-center py-8">
                    <lucide-angular name="shield-off" [size]="28" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Sin roles</p>
                    <p class="text-xs text-gray-500">Crea uno nuevo</p>
                  </div>
                } @else {
                  @for (role of roles(); track role.id) {
                    <div (click)="selectRole(role)"
                         [class]="selectedRole()?.id === role.id ? 'bg-purple-900/40 border-purple-500' : 'bg-slate-800 border-slate-700 hover:border-purple-500/50'"
                         class="p-2 rounded border cursor-pointer transition-all">
                      <div class="flex items-start justify-between">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-1">
                            <lucide-angular name="shield-check" [size]="12" class="text-purple-400 flex-shrink-0"></lucide-angular>
                            <h3 class="text-xs font-semibold text-white truncate">{{ role.name }}</h3>
                          </div>
                          <div class="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                            <span>{{ role.permissions.length }} permisos</span>
                            <span>•</span>
                            <span>{{ countSubPortfoliosForRole(role) }} subcarteras</span>
                          </div>
                        </div>
                        <button (click)="deleteRole(role); $event.stopPropagation()"
                                class="p-0.5 text-gray-400 hover:text-red-400 rounded transition-colors flex-shrink-0">
                          <lucide-angular name="trash-2" [size]="12"></lucide-angular>
                        </button>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Columna 2: Asignaciones (35%) -->
            <div class="col-span-4 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <lucide-angular name="map-pin" [size]="16" class="text-green-400"></lucide-angular>
                    <h2 class="text-sm font-bold text-white">Asignaciones</h2>
                    <span class="text-xs text-gray-400">({{ selectedRole() ? marcadas().size : 0 }})</span>
                  </div>
                  @if (selectedRole()) {
                    <button (click)="toggleExpandAll()"
                            [title]="isAnyExpanded() ? 'Colapsar todo' : 'Expandir todo'"
                            class="p-1 text-xs text-gray-400 hover:text-white hover:bg-slate-700 rounded transition-colors">
                      <lucide-angular [name]="isAnyExpanded() ? 'chevron-up' : 'chevron-down'" [size]="12"></lucide-angular>
                    </button>
                  }
                </div>
              </div>

              <div class="p-3 overflow-y-auto flex-1">
                @if (selectedRole()) {
                  <div class="space-y-1">
                    @for (tenant of tenants(); track tenant.id) {
                      <div class="border border-slate-700 rounded overflow-hidden">
                        <!-- Tenant Level -->
                        <div class="bg-slate-800 p-2">
                          <label class="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox"
                                   [checked]="isTenantAssigned(tenant.id)"
                                   (change)="toggleTenantAssignment(tenant.id)"
                                   class="w-3.5 h-3.5 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                            <lucide-angular name="building-2" [size]="12" class="text-blue-400"></lucide-angular>
                            <span class="text-xs font-semibold text-white group-hover:text-purple-300 flex-1">
                              {{ tenant.tenantName }}
                            </span>
                            @if (getPortfoliosByTenant(tenant.id).length > 0) {
                              <button (click)="toggleTenantExpand(tenant.id); $event.stopPropagation()"
                                      class="p-0.5 hover:bg-slate-700 rounded">
                                <lucide-angular [name]="isTenantExpanded(tenant.id) ? 'chevron-down' : 'chevron-right'"
                                                [size]="12"
                                                class="text-gray-400"></lucide-angular>
                              </button>
                            }
                          </label>
                        </div>

                        <!-- Portfolios (if expanded) -->
                        @if (isTenantExpanded(tenant.id)) {
                          <div class="bg-slate-800/50 pl-4">
                            @if (getPortfoliosByTenant(tenant.id).length === 0) {
                              <div class="p-2 text-xs text-gray-500 italic">
                                Sin carteras
                              </div>
                            }
                            @for (portfolio of getPortfoliosByTenant(tenant.id); track portfolio.id) {
                              <div class="border-t border-slate-700/50">
                                <!-- Portfolio Level -->
                                <div class="p-1.5">
                                  <label class="flex items-center gap-1.5 cursor-pointer group">
                                    <input type="checkbox"
                                           [checked]="isPortfolioAssigned(portfolio.id)"
                                           (change)="togglePortfolioAssignment(portfolio.id)"
                                           class="w-3 h-3 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500">
                                    <lucide-angular name="folder" [size]="11" class="text-green-400"></lucide-angular>
                                    <span class="text-xs font-medium text-gray-300 group-hover:text-purple-300 flex-1">
                                      {{ portfolio.portfolioName }}
                                    </span>
                                    @if (getSubPortfoliosByPortfolio(portfolio.id).length > 0) {
                                      <button (click)="togglePortfolioExpand(portfolio.id); $event.stopPropagation()"
                                              class="p-0.5 hover:bg-slate-700 rounded">
                                        <lucide-angular [name]="isPortfolioExpanded(portfolio.id) ? 'chevron-down' : 'chevron-right'"
                                                        [size]="11"
                                                        class="text-gray-400"></lucide-angular>
                                      </button>
                                    }
                                  </label>
                                </div>

                                <!-- SubPortfolios (if expanded) -->
                                @if (isPortfolioExpanded(portfolio.id)) {
                                  <div class="pl-3 pb-1">
                                    @if (getSubPortfoliosByPortfolio(portfolio.id).length === 0) {
                                      <div class="p-1 text-xs text-gray-500 italic">
                                        Sin subcarteras
                                      </div>
                                    }
                                    @for (subPortfolio of getSubPortfoliosByPortfolio(portfolio.id); track subPortfolio.id) {
                                      <div class="p-1">
                                        <label class="flex items-center gap-1.5 cursor-pointer group">
                                          <input type="checkbox"
                                                 [checked]="isSubPortfolioAssigned(subPortfolio.id)"
                                                 (change)="toggleSubPortfolioAssignment(subPortfolio.id)"
                                                 class="w-3 h-3 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500">
                                          <lucide-angular name="folder-tree" [size]="10" class="text-purple-400"></lucide-angular>
                                          <span class="text-xs text-gray-400 group-hover:text-purple-300">
                                            {{ subPortfolio.subPortfolioName }}
                                          </span>
                                        </label>
                                      </div>
                                    }
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        }
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-angular name="map" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-xs text-gray-400">Selecciona un rol para asignar</p>
                  </div>
                }
              </div>
            </div>

            <!-- Columna 3: Editor de Rol + Permisos (40%) -->
            <div class="col-span-5 bg-slate-900 rounded-lg border border-slate-800 shadow-sm flex flex-col max-h-[calc(100vh-140px)]">
              <div class="p-3 border-b border-slate-800 flex-shrink-0">
                <div class="flex items-center gap-2">
                  <lucide-angular name="edit" [size]="16" class="text-purple-400"></lucide-angular>
                  <h2 class="text-sm font-bold text-white">
                    {{ selectedRole()?.id ? 'Editar Rol' : selectedRole() ? 'Nuevo Rol' : 'Información' }}
                  </h2>
                </div>
              </div>

              <div class="p-3 space-y-3 overflow-y-auto flex-1">
                @if (selectedRole()) {
                  <!-- Información Básica -->
                  <div class="space-y-2">
                    <div>
                      <label class="block text-xs font-semibold text-gray-300 mb-1">Nombre del Rol</label>
                      <input type="text"
                             [(ngModel)]="selectedRole()!.name"
                             placeholder="Ej: Asesor de Cobranza"
                             class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500">
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-300 mb-1">Descripción</label>
                      <textarea [(ngModel)]="selectedRole()!.description"
                                rows="2"
                                placeholder="Describe las responsabilidades..."
                                class="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"></textarea>
                    </div>

                    <div class="flex items-center gap-2">
                      <input type="checkbox"
                             [(ngModel)]="selectedRole()!.active"
                             id="roleActive"
                             class="w-3.5 h-3.5 text-purple-600 bg-slate-800 border-slate-700 rounded focus:ring-purple-500">
                      <label for="roleActive" class="text-xs text-gray-300 cursor-pointer">Rol activo</label>
                    </div>
                  </div>

                  <!-- Permisos -->
                  <div>
                    <div class="flex items-center justify-between mb-2">
                      <label class="text-xs font-semibold text-purple-300">Permisos</label>
                      <span class="text-xs text-gray-400">{{ selectedRole()!.permissions.length }} seleccionados</span>
                    </div>

                    <div class="space-y-1.5">
                      @for (category of permissionCategories(); track category) {
                        <div class="bg-slate-800 rounded border border-slate-700 p-2">
                          <div class="flex items-center gap-1.5 mb-1.5">
                            <lucide-angular name="package" [size]="12" class="text-purple-400"></lucide-angular>
                            <h4 class="text-xs font-semibold text-white">{{ category }}</h4>
                          </div>
                          <div class="space-y-0.5 ml-4">
                            @for (permission of getPermissionsByCategory(category); track permission.id) {
                              <label class="flex items-start gap-1.5 p-1 hover:bg-slate-700/50 rounded cursor-pointer group">
                                <input type="checkbox"
                                       [checked]="isPermissionSelected(permission.id)"
                                       (change)="togglePermission(permission.id)"
                                       class="mt-0.5 w-3.5 h-3.5 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500">
                                <div class="flex-1 min-w-0">
                                  <div class="text-xs font-medium text-gray-300 group-hover:text-white truncate">
                                    {{ permission.name }}
                                  </div>
                                  <div class="text-xs text-gray-500 leading-tight">
                                    {{ permission.description }}
                                  </div>
                                </div>
                              </label>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                } @else {
                  <div class="text-center py-12">
                    <lucide-angular name="hand-metal" [size]="32" class="text-gray-600 mx-auto mb-2"></lucide-angular>
                    <p class="text-sm text-gray-400">Selecciona o crea un rol</p>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Botones de Acción -->
          @if (selectedRole()) {
            <div class="mt-3 flex justify-end gap-2">
              <button (click)="cancelEdit()"
                      class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-sm font-semibold transition-colors">
                Cancelar
              </button>
              <button (click)="saveRole()"
                      [disabled]="!isRoleValid()"
                      class="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded text-sm font-semibold transition-colors flex items-center gap-1.5">
                <lucide-angular name="save" [size]="16"></lucide-angular>
                Guardar
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class RolesManagementComponent implements OnInit {
  // Dropdowns
  tenants = signal<Tenant[]>([]);
  allPortfolios = signal<Portfolio[]>([]);
  allSubPortfolios = signal<SubPortfolio[]>([]);

  // Expansión de árbol
  expandedTenants = signal<number[]>([]);
  expandedPortfolios = signal<number[]>([]);

  // Roles y permisos
  roles = signal<Role[]>([]);
  selectedRole = signal<Role | null>(null);

  /** Subcarteras marcadas en el rol que se está editando. */
  marcadas = computed(() => this.subcarterasCubiertas(this.selectedRole()?.assignments ?? []));

  // Consultas del catálogo en curso y si alguna falló: sin el catálogo completo no se puede
  // traducir lo marcado a filas por subcartera.
  private catalogoPendiente = signal(0);
  private catalogoFallido = signal(false);

  // Permisos disponibles (se cargan del backend)
  availablePermissions = signal<Permission[]>([]);

  permissionCategories = computed(() => {
    const categories = new Set(this.availablePermissions().map(p => p.category));
    return Array.from(categories);
  });

  private tenantService = inject(TenantService);
  private portfolioService = inject(PortfolioService);
  private rolService = inject(RolService);
  private permisoService = inject(PermisoService);

  ngOnInit() {
    this.loadAllData();
    this.loadRolesFromBackend();
    this.loadPermissionsFromBackend();
  }

  loadAllData() {
    this.pedirCatalogo(this.tenantService.getAllTenants(), tenants => {
      this.tenants.set(tenants);

      tenants.forEach(tenant => {
        this.pedirCatalogo(this.portfolioService.getPortfoliosByTenant(tenant.id), portfolios => {
          // Asegurar que cada portfolio tenga el tenantId correcto
          const portfoliosWithTenant = portfolios.map(p => ({ ...p, tenantId: tenant.id }));
          this.allPortfolios.set([...this.allPortfolios(), ...portfoliosWithTenant]);

          portfolios.forEach(portfolio => {
            this.pedirCatalogo(this.portfolioService.getSubPortfoliosByPortfolio(portfolio.id), subPortfolios => {
              this.allSubPortfolios.set([...this.allSubPortfolios(), ...subPortfolios]);
            });
          });
        });
      });
    });
  }

  /** Una consulta del catálogo, llevando la cuenta de las que faltan y de si alguna falló. */
  private pedirCatalogo<T>(consulta: Observable<T>, alLlegar: (datos: T) => void) {
    this.catalogoPendiente.update(n => n + 1);
    consulta.subscribe({
      next: datos => {
        alLlegar(datos);
        this.catalogoPendiente.update(n => n - 1);
      },
      error: err => {
        console.error('Error al cargar el catálogo de clientes, carteras y subcarteras:', err);
        this.catalogoFallido.set(true);
        this.catalogoPendiente.update(n => n - 1);
      }
    });
  }

  loadRolesFromBackend() {
    this.rolService.obtenerTodos().subscribe({
      next: (roles) => {
        this.roles.set(roles.map(r => ({
          id: r.idRol,
          name: r.nombreRol,
          description: r.descripcion || '',
          permissions: r.permisoIds,
          assignments: r.asignaciones.map(a => ({
            type: a.tipoAsignacion as 'INQUILINO' | 'CARTERA' | 'SUBCARTERA',
            tenantId: a.tenantId,
            portfolioId: a.portfolioId,
            subPortfolioId: a.subPortfolioId
          })),
          active: r.activo
        })));
      },
      error: (err) => console.error('Error al cargar roles:', err)
    });
  }

  loadPermissionsFromBackend() {
    this.permisoService.obtenerTodos().subscribe({
      next: (permisos) => {
        this.availablePermissions.set(permisos.map(p => ({
          id: p.idPermiso,
          code: p.codigoPermiso,
          name: p.nombrePermiso,
          description: p.descripcion || '',
          category: p.categoria
        })));
      },
      error: (err) => console.error('Error al cargar permisos:', err)
    });
  }

  getPortfoliosByTenant(tenantId: number): Portfolio[] {
    return this.allPortfolios().filter(p => p.tenantId === tenantId);
  }

  getSubPortfoliosByPortfolio(portfolioId: number): SubPortfolio[] {
    return this.allSubPortfolios().filter(sp => sp.portfolioId === portfolioId);
  }

  /** Cuántas subcarteras cubren las asignaciones de un rol. */
  countSubPortfoliosForRole(role: Role): number {
    return this.subcarterasCubiertas(role.assignments).size;
  }

  /**
   * Subcarteras del catálogo que cubren unas asignaciones. Una fila de cliente o de cartera
   * cuenta por todas las subcarteras que cuelgan de ella.
   */
  private subcarterasCubiertas(assignments: RoleAssignment[]): Set<number> {
    const ids = new Set<number>();
    this.allSubPortfolios().forEach(sp => {
      const portfolio = this.allPortfolios().find(p => p.id === sp.portfolioId);
      if (!portfolio) return;
      const cubierta = assignments.some(a =>
        (a.type === 'INQUILINO' && a.tenantId === portfolio.tenantId) ||
        (a.type === 'CARTERA' && a.portfolioId === sp.portfolioId) ||
        (a.type === 'SUBCARTERA' && a.subPortfolioId === sp.id)
      );
      if (cubierta) ids.add(sp.id);
    });
    return ids;
  }

  /**
   * Una fila por subcartera, con cliente, cartera y subcartera tomados del catálogo. Lo guardado
   * no depende de cuántas subcarteras tenga la cartera o el cliente, y quien lee la asignación
   * solo necesita mirar la subcartera.
   */
  private filasPorSubcartera(ids: Set<number>): RoleAssignment[] {
    const filas: RoleAssignment[] = [];
    const puestas = new Set<number>();
    this.allSubPortfolios().forEach(sp => {
      const portfolio = this.allPortfolios().find(p => p.id === sp.portfolioId);
      if (portfolio && ids.has(sp.id) && !puestas.has(sp.id)) {
        puestas.add(sp.id);
        filas.push({ type: 'SUBCARTERA', tenantId: portfolio.tenantId, portfolioId: sp.portfolioId, subPortfolioId: sp.id });
      }
    });
    return filas;
  }

  // Expansión de árbol
  toggleTenantExpand(tenantId: number) {
    const expanded = this.expandedTenants();
    if (expanded.includes(tenantId)) {
      this.expandedTenants.set(expanded.filter(id => id !== tenantId));
    } else {
      this.expandedTenants.set([...expanded, tenantId]);
    }
  }

  isTenantExpanded(tenantId: number): boolean {
    return this.expandedTenants().includes(tenantId);
  }

  togglePortfolioExpand(portfolioId: number) {
    const expanded = this.expandedPortfolios();
    if (expanded.includes(portfolioId)) {
      this.expandedPortfolios.set(expanded.filter(id => id !== portfolioId));
    } else {
      this.expandedPortfolios.set([...expanded, portfolioId]);
    }
  }

  isPortfolioExpanded(portfolioId: number): boolean {
    return this.expandedPortfolios().includes(portfolioId);
  }

  // Cliente y cartera se ven marcados cuando lo están todas sus subcarteras.
  isTenantAssigned(tenantId: number): boolean {
    return this.todasMarcadas(this.subcarterasDeCliente(tenantId));
  }

  isPortfolioAssigned(portfolioId: number): boolean {
    return this.todasMarcadas(this.subcarterasDeCartera(portfolioId));
  }

  isSubPortfolioAssigned(subPortfolioId: number): boolean {
    return this.marcadas().has(subPortfolioId);
  }

  toggleTenantAssignment(tenantId: number) {
    this.alternar(this.subcarterasDeCliente(tenantId));
  }

  togglePortfolioAssignment(portfolioId: number) {
    this.alternar(this.subcarterasDeCartera(portfolioId));
  }

  toggleSubPortfolioAssignment(subPortfolioId: number) {
    this.alternar([subPortfolioId]);
  }

  private subcarterasDeCartera(portfolioId: number): number[] {
    return this.getSubPortfoliosByPortfolio(portfolioId).map(sp => sp.id);
  }

  private subcarterasDeCliente(tenantId: number): number[] {
    return this.getPortfoliosByTenant(tenantId).flatMap(p => this.subcarterasDeCartera(p.id));
  }

  private todasMarcadas(ids: number[]): boolean {
    const marcadas = this.marcadas();
    return ids.length > 0 && ids.every(id => marcadas.has(id));
  }

  /** Marca las subcarteras dadas; si ya lo estaban todas, las desmarca. */
  private alternar(ids: number[]) {
    const role = this.selectedRole();
    if (!role || ids.length === 0) return;
    const marcadas = new Set(this.marcadas());
    const quitar = ids.every(id => marcadas.has(id));
    ids.forEach(id => quitar ? marcadas.delete(id) : marcadas.add(id));
    this.selectedRole.set({ ...role, assignments: this.filasPorSubcartera(marcadas) });
  }

  createNewRole() {
    const newRole: Role = {
      name: '',
      description: '',
      permissions: [],
      assignments: [],
      active: true
    };
    this.selectedRole.set(newRole);
    // Nuevo rol: todo colapsado
    this.expandedTenants.set([]);
    this.expandedPortfolios.set([]);
  }

  selectRole(role: Role) {
    this.selectedRole.set({ ...role });
    // Rol existente: expandir solo las ramas que tienen asignaciones
    this.expandOnlyAssignedBranches();
  }

  isAnyExpanded(): boolean {
    return this.expandedTenants().length > 0 || this.expandedPortfolios().length > 0;
  }

  toggleExpandAll() {
    if (this.isAnyExpanded()) {
      // Colapsar todo
      this.expandedTenants.set([]);
      this.expandedPortfolios.set([]);
    } else {
      // Expandir todo
      const tenantIds = this.tenants().map(t => t.id);
      this.expandedTenants.set(tenantIds);

      const portfolioIds = this.allPortfolios().map(p => p.id);
      this.expandedPortfolios.set(portfolioIds);
    }
  }

  expandOnlyAssignedBranches() {
    const role = this.selectedRole();
    if (!role || role.assignments.length === 0) {
      // No expandir nada si no hay asignaciones
      this.expandedTenants.set([]);
      this.expandedPortfolios.set([]);
      return;
    }

    const tenantsToExpand: number[] = [];
    const portfoliosToExpand: number[] = [];

    role.assignments.forEach(assignment => {
      // Expandir tenant si tiene asignaciones directas de TENANT, PORTFOLIO o SUBPORTFOLIO
      if (assignment.type === 'INQUILINO' || assignment.type === 'CARTERA' || assignment.type === 'SUBCARTERA') {
        if (!tenantsToExpand.includes(assignment.tenantId)) {
          tenantsToExpand.push(assignment.tenantId);
        }
      }

      // Expandir portfolio si tiene asignaciones de PORTFOLIO o SUBPORTFOLIO
      if ((assignment.type === 'CARTERA' || assignment.type === 'SUBCARTERA') && assignment.portfolioId) {
        if (!portfoliosToExpand.includes(assignment.portfolioId)) {
          portfoliosToExpand.push(assignment.portfolioId);
        }
      }
    });

    this.expandedTenants.set(tenantsToExpand);
    this.expandedPortfolios.set(portfoliosToExpand);
  }

  deleteRole(role: Role) {
    if (!role.id) return;

    if (confirm(`¿Estás seguro de eliminar el rol "${role.name}"?`)) {
      this.rolService.eliminar(role.id).subscribe({
        next: () => {
          const currentRoles = this.roles();
          this.roles.set(currentRoles.filter(r => r.id !== role.id));
          if (this.selectedRole()?.id === role.id) {
            this.selectedRole.set(null);
          }
          alert('Rol eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar rol:', err);
          alert('Error al eliminar rol: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  getPermissionsByCategory(category: string): Permission[] {
    return this.availablePermissions().filter(p => p.category === category);
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedRole()?.permissions.includes(permissionId) || false;
  }

  togglePermission(permissionId: number) {
    const role = this.selectedRole();
    if (!role) return;

    const index = role.permissions.indexOf(permissionId);
    if (index > -1) {
      role.permissions.splice(index, 1);
    } else {
      role.permissions.push(permissionId);
    }
    this.selectedRole.set({ ...role });
  }

  isRoleValid(): boolean {
    const role = this.selectedRole();
    return !!(role && role.name.trim() && role.description.trim());
  }

  saveRole() {
    const role = this.selectedRole();
    if (!role || !this.isRoleValid()) return;
    if (this.catalogoPendiente() > 0 || this.catalogoFallido()) {
      alert('No se terminó de cargar el catálogo de clientes, carteras y subcarteras. Recarga la página antes de guardar.');
      return;
    }

    const request: RolRequest = {
      nombreRol: role.name,
      descripcion: role.description,
      activo: role.active,
      permisoIds: role.permissions,
      asignaciones: this.filasPorSubcartera(this.subcarterasCubiertas(role.assignments)).map(a => ({
        tipoAsignacion: a.type,
        tenantId: a.tenantId,
        portfolioId: a.portfolioId,
        subPortfolioId: a.subPortfolioId
      }))
    };

    if (role.id) {
      // Editar existente
      this.rolService.actualizar(role.id, request).subscribe({
        next: (response) => {
          const currentRoles = this.roles();
          const index = currentRoles.findIndex(r => r.id === role.id);
          if (index > -1) {
            currentRoles[index] = {
              id: response.idRol,
              name: response.nombreRol,
              description: response.descripcion || '',
              permissions: response.permisoIds,
              assignments: response.asignaciones.map(a => ({
                type: a.tipoAsignacion as 'INQUILINO' | 'CARTERA' | 'SUBCARTERA',
                tenantId: a.tenantId,
                portfolioId: a.portfolioId,
                subPortfolioId: a.subPortfolioId
              })),
              active: response.activo
            };
            this.roles.set([...currentRoles]);
          }
          this.selectedRole.set(null);
          alert('Rol actualizado correctamente');
        },
        error: (err) => {
          console.error('Error al actualizar rol:', err);
          alert('Error al actualizar rol: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Crear nuevo
      this.rolService.crear(request).subscribe({
        next: (response) => {
          const newRole: Role = {
            id: response.idRol,
            name: response.nombreRol,
            description: response.descripcion || '',
            permissions: response.permisoIds,
            assignments: response.asignaciones.map(a => ({
              type: a.tipoAsignacion as 'INQUILINO' | 'CARTERA' | 'SUBCARTERA',
              tenantId: a.tenantId,
              portfolioId: a.portfolioId,
              subPortfolioId: a.subPortfolioId
            })),
            active: response.activo
          };
          this.roles.set([...this.roles(), newRole]);
          this.selectedRole.set(null);
          alert('Rol creado correctamente');
        },
        error: (err) => {
          console.error('Error al crear rol:', err);
          alert('Error al crear rol: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  cancelEdit() {
    this.selectedRole.set(null);
  }
}
