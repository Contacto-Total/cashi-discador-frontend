import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { ThemeService } from '../../../shared/services/theme.service';
import {
  TypificationCatalogV2,
  TenantTypificationConfigV2,
  ClassificationTypeV2,
  TypificationTreeNodeV2
} from '../../models/typification-v2.model';
import { Portfolio } from '../../models/portfolio.model';
import { Tenant } from '../../models/tenant.model';
import { TypificationFormDialogComponent } from '../typification-form-dialog/typification-form-dialog.component';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { TypificationAdditionalFieldsDialogComponent } from '../typification-additional-fields-dialog/typification-additional-fields-dialog.component';
import { AdditionalFieldV2 } from '../../models/typification-v2.model';

@Component({
  selector: 'app-typification-maintenance',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, TypificationFormDialogComponent, CategoryFormDialogComponent, TypificationAdditionalFieldsDialogComponent],
  templateUrl: './typification-maintenance.component.html',
  styleUrls: ['./typification-maintenance.component.scss']
})
export class TypificationMaintenanceComponent implements OnInit {
  selectedTenantId?: number;
  selectedPortfolioId?: number;
  selectedType?: ClassificationTypeV2;

  loading = signal(false);
  showSuccess = signal(false);
  showClassificationDialog = signal(false);
  showCategoryDialog = signal(false);
  showAdditionalFieldsDialog = signal(false);
  classificationDialogMode = signal<'create' | 'edit'>('create');
  selectedClassificationForEdit = signal<TypificationCatalogV2 | undefined>(undefined);
  selectedTypificationForFields = signal<TypificationCatalogV2 | undefined>(undefined);
  additionalFieldsForEdit = signal<AdditionalFieldV2[]>([]);
  parentClassificationForCreate = signal<TypificationCatalogV2 | undefined>(undefined);

  classificationTypes = Object.values(ClassificationTypeV2);
  typifications: TypificationCatalogV2[] = [];
  tenantConfigs: TenantTypificationConfigV2[] = [];
  treeNodes: TypificationTreeNodeV2[] = [];
  expandedNodes = new Set<number>();
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];

  // Inline editing state
  editingNodeId = signal<number | null>(null);
  editingForm = signal<{
    nombrePersonalizado: string;
    descripcionPersonalizada: string;
    colorPersonalizado: string;
    iconoPersonalizado: string;
    ordenVisualizacionPersonalizado: number;
  } | null>(null);
  savingEdit = signal(false);

  presetColors = [
    { hex: '#3B82F6', name: 'Azul' },
    { hex: '#10B981', name: 'Verde' },
    { hex: '#EF4444', name: 'Rojo' },
    { hex: '#F59E0B', name: 'Naranja' },
    { hex: '#8B5CF6', name: 'Violeta' },
    { hex: '#EC4899', name: 'Rosa' },
    { hex: '#6366F1', name: 'Índigo' },
    { hex: '#14B8A6', name: 'Turquesa' }
  ];

  commonIcons = [
    'phone', 'phone-call', 'check-circle', 'x-circle', 'alert-circle',
    'user', 'users', 'credit-card', 'dollar-sign', 'calendar',
    'clock', 'mail', 'message-square', 'file-text', 'building', 'wallet'
  ];

  constructor(
    private classificationService: TypificationV2Service,
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

    // Load ALL tenant configurations (including disabled) for maintenance view
    const request$ = this.selectedType
      ? this.classificationService.getTenantClassificationsByType(
          this.selectedTenantId,
          this.selectedType,
          this.selectedPortfolioId
        )
      : this.classificationService.getTenantClassifications(
          this.selectedTenantId,
          this.selectedPortfolioId,
          true // includeDisabled = true for maintenance view
        );

    request$.subscribe({
      next: (configs) => {
        this.tenantConfigs = configs;
        // Extract typifications from tenant configs
        this.typifications = configs.map(config => config.tipificacion);
        this.buildTree();
        this.loading.set(false);
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
    const configMap = new Map<number, TenantTypificationConfigV2>();
    this.tenantConfigs.forEach(config => {
      configMap.set(config.tipificacion.id, config);
    });

    const nodeMap = new Map<number, TypificationTreeNodeV2>();

    this.typifications.forEach(typification => {
      const node: TypificationTreeNodeV2 = {
        typification,
        config: configMap.get(typification.id),
        children: [],
        level: typification.nivelJerarquia
      };
      nodeMap.set(typification.id, node);
    });

    const roots: TypificationTreeNodeV2[] = [];

    this.typifications.forEach(typification => {
      const node = nodeMap.get(typification.id)!;
      // Usar idTipificacionPadre si está disponible, sino tipificacionPadre?.id
      const parentId = typification.idTipificacionPadre || typification.tipificacionPadre?.id;
      if (parentId) {
        const parent = nodeMap.get(parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          // Si no encuentra el padre, lo agrega como raíz (fallback)
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortNodes = (nodes: TypificationTreeNodeV2[]) => {
      nodes.sort((a, b) => {
        const orderA = a.typification.ordenVisualizacion || 0;
        const orderB = b.typification.ordenVisualizacion || 0;
        return orderA - orderB;
      });
      nodes.forEach(node => {
        if (node.children.length > 0) {
          sortNodes(node.children);
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

  toggleTypification(node: TypificationTreeNodeV2, event: Event) {
    if (!this.selectedTenantId) return;

    const target = event.target as HTMLInputElement;
    const enabled = target.checked;

    const action$ = enabled
      ? this.classificationService.enableClassification(
          this.selectedTenantId,
          node.typification.id,
          this.selectedPortfolioId
        )
      : this.classificationService.disableClassification(
          this.selectedTenantId,
          node.typification.id,
          this.selectedPortfolioId
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

  openCreateChildDialog(parent: TypificationCatalogV2) {
    this.classificationDialogMode.set('create');
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(parent);
    this.showClassificationDialog.set(true);
  }

  openEditDialog(typification: TypificationCatalogV2) {
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

  onClassificationSaved(typification: TypificationCatalogV2) {
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
    this.showSuccessMessage();
    this.loadTypifications();
  }

  // Additional Fields dialog methods
  openAdditionalFieldsDialog(typification: TypificationCatalogV2) {
    this.selectedTypificationForFields.set(typification);
    this.loading.set(true);

    // Cargar campos adicionales existentes
    this.classificationService.getAdditionalFields(typification.id).subscribe({
      next: (fields) => {
        this.additionalFieldsForEdit.set(fields);
        this.showAdditionalFieldsDialog.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading additional fields:', error);
        this.additionalFieldsForEdit.set([]);
        this.showAdditionalFieldsDialog.set(true);
        this.loading.set(false);
      }
    });
  }

  closeAdditionalFieldsDialog() {
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(undefined);
    this.additionalFieldsForEdit.set([]);
  }

  onAdditionalFieldsSaved() {
    // El nuevo diálogo ya guarda internamente, solo cerramos y mostramos éxito
    console.log('Campos adicionales guardados exitosamente');
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(undefined);
    this.additionalFieldsForEdit.set([]);
    this.showSuccessMessage();
  }

  deleteTypification(typification: TypificationCatalogV2) {
    if (typification.esSistema) {
      alert('No se pueden eliminar tipificaciones del sistema');
      return;
    }

    // Si estamos en una vista filtrada por tenant/cartera, solo deshabilitar para esa subcartera
    // Si NO hay filtros, eliminar del catálogo global
    const isFiltered = this.selectedTenantId !== undefined;

    const message = isFiltered
      ? `¿Está seguro de deshabilitar la tipificación "${typification.nombre}" para esta cartera?\n\nPuedes volver a habilitarla después.`
      : `¿Está seguro de eliminar la tipificación "${typification.nombre}" del catálogo global?\n\nEsto afectará a TODAS las carteras y subcarteras.\n\nEsta acción no se puede deshacer.`;

    if (!confirm(message)) {
      return;
    }

    if (isFiltered) {
      // Deshabilitar solo para esta cartera/subcartera
      this.classificationService.disableClassification(
        this.selectedTenantId!,
        typification.id,
        this.selectedPortfolioId
      ).subscribe({
        next: () => {
          this.showSuccessMessage();
          this.loadTypifications();
        },
        error: (error) => {
          console.error('Error al deshabilitar tipificación:', error);
          alert('Error al deshabilitar la tipificación.');
        }
      });
    } else {
      // Eliminar del catálogo global (afecta a todos)
      this.classificationService.deleteTypification(typification.id).subscribe({
        next: () => {
          this.showSuccessMessage();
          this.loadTypifications();
        },
        error: (error) => {
          console.error('Error al eliminar tipificación:', error);
          alert('Error al eliminar la tipificación del catálogo global. Puede que tenga dependencias.');
        }
      });
    }
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
    this.classificationTypes = Object.values(ClassificationTypeV2);
  }

  getTypeLabel(type: ClassificationTypeV2): string {
    const labels: Record<ClassificationTypeV2, string> = {
      [ClassificationTypeV2.RESULTADO_CONTACTO]: 'Resultado de Contacto',
      [ClassificationTypeV2.TIPO_GESTION]: 'Tipo de Gestión',
      [ClassificationTypeV2.MODALIDAD_PAGO]: 'Modalidad de Pago',
      [ClassificationTypeV2.TIPO_FRACCIONAMIENTO]: 'Tipo de Fraccionamiento'
    };
    return labels[type];
  }

  /**
   * Mueve un nodo hacia arriba en el orden
   */
  moveUp(node: TypificationTreeNodeV2, siblings: TypificationTreeNodeV2[], index: number, parent: TypificationTreeNodeV2 | null) {
    if (index === 0) return; // Ya está al inicio

    // Intercambiar posiciones en el array
    [siblings[index - 1], siblings[index]] = [siblings[index], siblings[index - 1]];

    // Actualizar ordenVisualizacion en el backend
    this.updateOrder(siblings);
  }

  /**
   * Mueve un nodo hacia abajo en el orden
   */
  moveDown(node: TypificationTreeNodeV2, siblings: TypificationTreeNodeV2[], index: number, parent: TypificationTreeNodeV2 | null) {
    if (index === siblings.length - 1) return; // Ya está al final

    // Intercambiar posiciones en el array
    [siblings[index], siblings[index + 1]] = [siblings[index + 1], siblings[index]];

    // Actualizar ordenVisualizacion en el backend
    this.updateOrder(siblings);
  }

  /**
   * Actualiza el orden de los nodos en el backend
   */
  private updateOrder(siblings: TypificationTreeNodeV2[]) {
    // Actualizar ordenVisualizacion (espaciado de 10 para permitir inserciones futuras)
    const updates = siblings.map((node, index) => ({
      id: node.typification.id,
      ordenVisualizacion: index * 10
    }));

    // TODO: Este endpoint necesita ser implementado en el backend V2
    // Por ahora simular éxito
    console.warn('updateOrder: endpoint no implementado en V2', updates);
    this.showSuccessMessage();

    /* Cuando esté listo en el backend:
    this.classificationService.updateDisplayOrder(updates).subscribe({
      next: () => {
        this.showSuccessMessage();
      },
      error: (error) => {
        console.error('Error al actualizar orden:', error);
        this.loadTypifications();
      }
    });
    */
  }

  // ========================================
  // Inline Editing Methods
  // ========================================

  /**
   * Inicia la edición inline de una tipificación
   */
  startEdit(node: TypificationTreeNodeV2, event: Event) {
    event.stopPropagation();

    const config = node.config;
    const typification = node.typification;

    this.editingNodeId.set(config?.id || null);
    this.editingForm.set({
      nombrePersonalizado: config?.nombrePersonalizado || typification.nombre,
      descripcionPersonalizada: config?.descripcionPersonalizada || typification.descripcion || '',
      colorPersonalizado: config?.colorPersonalizado || typification.colorSugerido || '#3B82F6',
      iconoPersonalizado: config?.iconoPersonalizado || typification.iconoSugerido || '',
      ordenVisualizacionPersonalizado: config?.ordenVisualizacionPersonalizado || typification.ordenVisualizacion || 0
    });
  }

  /**
   * Cancela la edición inline
   */
  cancelEdit() {
    this.editingNodeId.set(null);
    this.editingForm.set(null);
  }

  /**
   * Guarda los cambios de edición inline
   */
  saveEdit(node: TypificationTreeNodeV2) {
    if (!this.editingForm() || !node.config) return;

    this.savingEdit.set(true);
    const form = this.editingForm()!;

    const command = {
      nombrePersonalizado: form.nombrePersonalizado !== node.typification.nombre ? form.nombrePersonalizado : undefined,
      descripcionPersonalizada: form.descripcionPersonalizada !== (node.typification.descripcion || '') ? form.descripcionPersonalizada : undefined,
      colorPersonalizado: form.colorPersonalizado !== (node.typification.colorSugerido || '#3B82F6') ? form.colorPersonalizado : undefined,
      iconoPersonalizado: form.iconoPersonalizado !== (node.typification.iconoSugerido || '') ? form.iconoPersonalizado : undefined,
      ordenVisualizacionPersonalizado: form.ordenVisualizacionPersonalizado !== (node.typification.ordenVisualizacion || 0) ? form.ordenVisualizacionPersonalizado : undefined
    };

    this.classificationService.updateTenantTypificationConfig(node.config.id, command).subscribe({
      next: () => {
        this.savingEdit.set(false);
        this.editingNodeId.set(null);
        this.editingForm.set(null);
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al guardar personalización:', error);
        this.savingEdit.set(false);
        alert('Error al guardar los cambios');
      }
    });
  }

  /**
   * Resetea la personalización a valores del catálogo
   */
  resetCustomization(node: TypificationTreeNodeV2, event: Event) {
    event.stopPropagation();

    if (!node.config) return;

    if (!confirm('¿Resetear a valores del catálogo global?')) {
      return;
    }

    const command = {
      nombrePersonalizado: undefined,
      descripcionPersonalizada: undefined,
      colorPersonalizado: undefined,
      iconoPersonalizado: undefined,
      ordenVisualizacionPersonalizado: undefined
    };

    this.classificationService.updateTenantTypificationConfig(node.config.id, command).subscribe({
      next: () => {
        this.showSuccessMessage();
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al resetear personalización:', error);
        alert('Error al resetear personalización');
      }
    });
  }

  /**
   * Verifica si un nodo está siendo editado
   */
  isEditing(configId: number | undefined): boolean {
    return configId !== undefined && this.editingNodeId() === configId;
  }

  /**
   * Verifica si un nodo tiene personalizaciones
   */
  hasCustomizations(config: any): boolean {
    if (!config) return false;
    return !!(
      config.nombrePersonalizado ||
      config.descripcionPersonalizada ||
      config.colorPersonalizado ||
      config.iconoPersonalizado ||
      config.ordenVisualizacionPersonalizado !== null
    );
  }

  /**
   * Obtiene el valor efectivo de un campo
   */
  getEffectiveValue(config: any, typification: any, field: string): any {
    const customField = field + 'Personalizado';
    const catalogField = field === 'nombre' ? 'nombre' : field === 'color' ? 'colorSugerido' : field === 'icono' ? 'iconoSugerido' : field;

    return config?.[customField] || typification[catalogField] || '';
  }

  /**
   * Verifica si un nodo coincide con el filtro de tipo actual
   */
  matchesTypeFilter(typification: TypificationCatalogV2): boolean {
    if (!this.selectedType) return true; // Sin filtro = todos coinciden
    return typification.tipoClasificacion === this.selectedType;
  }

  /**
   * Verifica si un nodo o alguno de sus descendientes coincide con el filtro
   */
  nodeOrChildrenMatch(node: TypificationTreeNodeV2): boolean {
    if (!this.selectedType) return true;
    if (this.matchesTypeFilter(node.typification)) return true;
    return node.children.some(child => this.nodeOrChildrenMatch(child));
  }

  /**
   * Obtiene la ruta breadcrumb del padre
   */
  getParentBreadcrumb(node: TypificationTreeNodeV2): string {
    const breadcrumbs: string[] = [];
    let current = node;

    // Buscar el padre en el árbol
    const findParent = (nodes: TypificationTreeNodeV2[], targetId: number): TypificationTreeNodeV2 | null => {
      for (const n of nodes) {
        if (n.children.some(c => c.typification.id === targetId)) {
          return n;
        }
        const found = findParent(n.children, targetId);
        if (found) return found;
      }
      return null;
    };

    const parentId = current.typification.idTipificacionPadre || current.typification.tipificacionPadre?.id;
    if (parentId) {
      const parent = findParent(this.treeNodes, current.typification.id);
      if (parent) {
        // Construir breadcrumb recursivamente
        const buildPath = (n: TypificationTreeNodeV2): string[] => {
          const path: string[] = [];
          const pid = n.typification.idTipificacionPadre || n.typification.tipificacionPadre?.id;
          if (pid) {
            const p = findParent(this.treeNodes, n.typification.id);
            if (p) {
              path.push(...buildPath(p));
            }
          }
          path.push(this.getEffectiveValue(n.config, n.typification, 'nombre'));
          return path;
        };

        return buildPath(parent).join(' > ');
      }
    }

    return '';
  }

  /**
   * Obtiene nodos filtrados (solo los que coinciden con el tipo)
   */
  getFilteredNodes(nodes: TypificationTreeNodeV2[]): TypificationTreeNodeV2[] {
    if (!this.selectedType) return nodes;

    const filtered: TypificationTreeNodeV2[] = [];

    const collectMatching = (nodeList: TypificationTreeNodeV2[]) => {
      for (const node of nodeList) {
        if (this.matchesTypeFilter(node.typification)) {
          filtered.push(node);
        }
        if (node.children.length > 0) {
          collectMatching(node.children);
        }
      }
    };

    collectMatching(nodes);
    return filtered;
  }
}
