import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TypificationService } from '../../services/typification.service';
import { ThemeService } from '../../../shared/services/theme.service';
import {
  TypificationCatalog,
  TenantTypificationConfig,
  ClassificationType,
  TypificationTreeNode
} from '../../models/typification.model';
import { Portfolio } from '../../models/portfolio.model';
import { Tenant } from '../../models/tenant.model';
import { TypificationFormDialogComponent } from '../typification-form-dialog/typification-form-dialog.component';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-typification-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TypificationFormDialogComponent, CategoryFormDialogComponent],
  templateUrl: './typification-maintenance.component.html',
  styleUrls: ['./typification-maintenance.component.scss']
})
export class TypificationMaintenanceComponent implements OnInit {
  selectedTenantId?: number;
  selectedPortfolioId?: number;
  selectedType?: ClassificationType;

  loading = signal(false);
  showSuccess = signal(false);
  showClassificationDialog = signal(false);
  showCategoryDialog = signal(false);
  classificationDialogMode = signal<'create' | 'edit'>('create');
  selectedClassificationForEdit = signal<TypificationCatalog | undefined>(undefined);
  parentClassificationForCreate = signal<TypificationCatalog | undefined>(undefined);

  classificationTypes = Object.values(ClassificationType);
  typifications: TypificationCatalog[] = [];
  tenantConfigs: TenantTypificationConfig[] = [];
  treeNodes: TypificationTreeNode[] = [];
  expandedNodes = new Set<number>();
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];

  constructor(
    private classificationService: TypificationService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  loadTenants() {
    this.classificationService.getAllTenants().subscribe({
      next: (data) => {
        this.tenants = data;
        if (data.length > 0) {
          this.selectedTenantId = data[0].id;
          this.onTenantChange();
        }
      },
      error: (error) => {
        console.error('Error loading tenants:', error);
      }
    });
  }

  onTenantChange() {
    this.selectedPortfolioId = undefined;
    this.portfolios = [];
    this.typifications = [];
    this.treeNodes = [];

    if (this.selectedTenantId) {
      this.loadPortfolios();
      this.loadTypifications();
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

  loadTypifications() {
    if (!this.selectedTenantId) return;

    this.loading.set(true);

    // Load catalog and configurations
    this.classificationService.getActiveClassifications().subscribe({
      next: (tipificaciones) => {
        this.typifications = tipificaciones;

        // Load configurations if tenant is selected
        if (this.selectedTenantId) {
          this.classificationService.getTenantClassifications(
            this.selectedTenantId,
            this.selectedPortfolioId
          ).subscribe({
            next: (configs) => {
              this.tenantConfigs = configs;
              this.buildTree();
              this.loading.set(false);
            },
            error: (error) => {
              console.error('Error loading configs:', error);
              this.buildTree();
              this.loading.set(false);
            }
          });
        } else {
          this.buildTree();
          this.loading.set(false);
        }
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Error loading typifications:', error);
      }
    });
  }

  loadTenantConfigs() {
    // This method is now redundant, keeping for backward compatibility
    // but it's no longer called
    if (!this.selectedTenantId) return;

    const request$ = this.selectedType
      ? this.classificationService.getTenantClassificationsByType(
          this.selectedTenantId,
          this.selectedType,
          this.selectedPortfolioId
        )
      : this.classificationService.getTenantClassifications(
          this.selectedTenantId,
          this.selectedPortfolioId
        );

    request$.subscribe({
      next: (configs) => {
        this.tenantConfigs = configs;
        this.buildTree();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tenant configs:', error);
        this.buildTree();
        this.loading.set(false);
      }
    });
  }

  buildTree() {
    const configMap = new Map<number, TenantTypificationConfig>();
    this.tenantConfigs.forEach(config => {
      configMap.set(config.tipificacion.id, config);
    });

    const nodeMap = new Map<number, TypificationTreeNode>();

    this.typifications.forEach(tipificacion => {
      const node: TypificationTreeNode = {
        tipificacion,
        configuracion: configMap.get(tipificacion.id),
        hijos: [],
        nivel: tipificacion.nivelJerarquia
      };
      nodeMap.set(tipificacion.id, node);
    });

    const roots: TypificationTreeNode[] = [];

    this.typifications.forEach(tipificacion => {
      const node = nodeMap.get(tipificacion.id)!;
      if (tipificacion.tipificacionPadre?.id) {
        const parent = nodeMap.get(tipificacion.tipificacionPadre.id);
        if (parent) {
          parent.hijos.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortNodes = (nodes: TypificationTreeNode[]) => {
      nodes.sort((a, b) => {
        const orderA = a.tipificacion.ordenVisualizacion || 0;
        const orderB = b.tipificacion.ordenVisualizacion || 0;
        return orderA - orderB;
      });
      nodes.forEach(node => {
        if (node.hijos.length > 0) {
          sortNodes(node.hijos);
        }
      });
    };

    sortNodes(roots);
    this.treeNodes = roots;
    this.expandAll();
  }

  toggleNode(nodeId: number) {
    if (this.expandedNodes.has(nodeId)) {
      this.expandedNodes.delete(nodeId);
    } else {
      this.expandedNodes.add(nodeId);
    }
  }

  isExpanded(nodeId: number): boolean {
    return this.expandedNodes.has(nodeId);
  }

  expandAll() {
    this.typifications.forEach(c => this.expandedNodes.add(c.id));
  }

  collapseAll() {
    this.expandedNodes.clear();
  }

  onTypeChange() {
    this.loadTypifications();
  }

  onPortfolioChange() {
    this.loadTypifications();
  }

  toggleTypification(node: TypificationTreeNode, event: Event) {
    if (!this.selectedTenantId || !this.selectedPortfolioId) {
      alert('Por favor seleccione un tenant y una cartera');
      return;
    }

    const target = event.target as HTMLInputElement;
    const enabled = target.checked;

    // For now, use first subportfolio or 1 as default
    // TODO: Add subportfolio selector
    const subPortfolioId = 1;
    const userId = 1; // TODO: Get from auth service

    const action$ = enabled
      ? this.classificationService.enableClassification(
          this.selectedTenantId,
          node.tipificacion.id,
          this.selectedPortfolioId,
          subPortfolioId,
          userId
        )
      : this.classificationService.disableClassification(
          this.selectedTenantId,
          node.tipificacion.id,
          this.selectedPortfolioId,
          subPortfolioId,
          userId
        );

    action$.subscribe({
      next: () => {
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error toggling typification:', error);
        target.checked = !enabled;
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  // Classification dialog methods
  openCreateRootDialog() {
    this.classificationDialogMode.set('create');
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
    this.showClassificationDialog.set(true);
  }

  openCreateChildDialog(parent: TypificationCatalog) {
    this.classificationDialogMode.set('create');
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(parent);
    this.showClassificationDialog.set(true);
  }

  openEditDialog(typification: TypificationCatalog) {
    this.classificationDialogMode.set('edit');
    this.selectedClassificationForEdit.set(typification);
    this.parentClassificationForCreate.set(undefined);
    this.showClassificationDialog.set(true);
  }

  closeClassificationDialog() {
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
  }

  onClassificationSaved(typification: TypificationCatalog) {
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
    this.showSuccessMessage();
    this.loadTypifications();
  }

  deleteTypification(tipificacion: TypificationCatalog) {
    if (tipificacion.esSistema) {
      alert('No se pueden eliminar tipificaciones del sistema');
      return;
    }

    if (!confirm(`¿Está seguro de eliminar la tipificación "${tipificacion.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    this.classificationService.deleteTypification(tipificacion.id).subscribe({
      next: () => {
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al eliminar tipificación:', error);
        alert('Error al eliminar la tipificación. Puede que tenga dependencias.');
      }
    });
  }

  showSuccessMessage() {
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }

  // Category dialog methods
  openCreateCategoryDialog() {
    this.showCategoryDialog.set(true);
  }

  closeCategoryDialog() {
    this.showCategoryDialog.set(false);
  }

  onCategorySaved(categoryName: string) {
    this.showCategoryDialog.set(false);
    this.showSuccessMessage();
    // Reload typification types
    this.classificationTypes = Object.values(ClassificationType);
  }

  getTypeLabel(type: ClassificationType): string {
    const labels: Record<ClassificationType, string> = {
      [ClassificationType.RESULTADO_CONTACTO]: 'Resultado de Contacto (Nivel 1)',
      [ClassificationType.TIPO_GESTION]: 'Tipo de Gestión (Nivel 2)',
      [ClassificationType.MODALIDAD_PAGO]: 'Modalidad de Pago (Nivel 3)',
      [ClassificationType.TIPO_FRACCIONAMIENTO]: 'Tipo de Fraccionamiento (Nivel 4)'
    };
    return labels[type];
  }

  /**
   * Mueve un nodo hacia arriba en el orden
   */
  moveUp(node: TypificationTreeNode, siblings: TypificationTreeNode[], index: number, parent: TypificationTreeNode | null) {
    if (index === 0) return; // Ya está al inicio

    // Intercambiar posiciones en el array
    [siblings[index - 1], siblings[index]] = [siblings[index], siblings[index - 1]];

    // Actualizar ordenVisualizacion en el backend
    this.updateOrder(siblings);
  }

  /**
   * Mueve un nodo hacia abajo en el orden
   */
  moveDown(node: TypificationTreeNode, siblings: TypificationTreeNode[], index: number, parent: TypificationTreeNode | null) {
    if (index === siblings.length - 1) return; // Ya está al final

    // Intercambiar posiciones en el array
    [siblings[index], siblings[index + 1]] = [siblings[index + 1], siblings[index]];

    // Actualizar ordenVisualizacion en el backend
    this.updateOrder(siblings);
  }

  /**
   * Actualiza el orden de los nodos en el backend
   * TODO: Implement batch update endpoint in backend
   */
  private updateOrder(siblings: TypificationTreeNode[]) {
    // Update each node individually
    siblings.forEach((node, index) => {
      const ordenVisualizacion = index * 10;
      if (node.tipificacion.ordenVisualizacion !== ordenVisualizacion) {
        this.classificationService.updateTypification(node.tipificacion.id, {
          ordenVisualizacion: ordenVisualizacion
        }).subscribe({
          next: () => {
            console.log(`Updated order for ${node.tipificacion.nombre}`);
          },
          error: (error) => {
            console.error('Error al actualizar orden:', error);
          }
        });
      }
    });

    this.showSuccessMessage();
    // Reload to reflect changes
    setTimeout(() => this.loadTypifications(), 500);
  }
}
