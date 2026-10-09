import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { ThemeService } from '../../../shared/services/theme.service';
import { ToastService } from '../../../shared/services/toast.service';
import {
  TypificationCatalogV2,
  TenantTypificationConfigV2,
  ClassificationTypeV2,
  TypificationTreeNodeV2,
  UpdateTypificationConfigCommandV2
} from '../../models/typification-v2.model';
import { Portfolio } from '../../models/portfolio.model';
import { Tenant } from '../../models/tenant.model';
import { TypificationFormDialogComponent } from '../typification-form-dialog/typification-form-dialog.component';
import { CategoryFormDialogComponent } from '../category-form-dialog/category-form-dialog.component';
import { TypificationAdditionalFieldsDialogComponent } from '../typification-additional-fields-dialog/typification-additional-fields-dialog.component';
import { TUI, tuiSwitch, tuiPerilla, tuiNormalizar } from '../typification-ui';

/** Una fila de la tabla: un nodo del árbol, o un resultado suelto cuando hay filtro. */
interface FilaTipificacion {
  node: TypificationTreeNodeV2;
  depth: number;
  hasKids: boolean;
  /** Ruta de los padres. Solo se llena en la vista plana (con filtro o búsqueda). */
  crumb: string;
}

interface EstadoEliminar {
  tip: TypificationCatalogV2;
  /** 'enUso': el backend se negó a borrarla y `mensaje` trae el motivo. */
  paso: 'confirmar' | 'enUso';
  mensaje: string;
}

@Component({
  selector: 'app-typification-maintenance',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LucideAngularModule, A11yModule, CdkMenuModule,
    TypificationFormDialogComponent, CategoryFormDialogComponent, TypificationAdditionalFieldsDialogComponent
  ],
  templateUrl: './typification-maintenance.component.html',
  styleUrls: ['./typification-maintenance.component.scss']
})
export class TypificationMaintenanceComponent implements OnInit {
  // ==================== SISTEMA VISUAL ====================
  readonly ui = TUI;
  readonly sw = tuiSwitch;
  readonly perilla = tuiPerilla;

  /** En pantallas angostas se ocultan Tipo y Nivel y la rejilla pasa a tres columnas. */
  private readonly rejilla =
    'grid grid-cols-[minmax(0,1fr)_80px_132px] items-center lg:grid-cols-[minmax(0,1fr)_180px_60px_96px_150px] ';
  readonly claseEncabezado =
    this.rejilla + 'min-h-[34px] rounded-t-xl border-b border-[#e6e9ee] bg-[#f8fafc] text-[11.5px] font-bold text-[#334155] ' +
    'dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300';
  readonly claseFila =
    this.rejilla + 'tm-row min-h-[42px] bg-white transition-colors duration-150 hover:bg-[#f8fafc] ' +
    'dark:bg-slate-900 dark:hover:bg-slate-800/60';

  readonly claseMenu =
    `tm-menu flex w-[292px] flex-col gap-px rounded-[10px] border border-[#e6e9ee] bg-white p-1.5 ${TUI.fuente} ` +
    'shadow-[0_12px_28px_rgba(15,23,42,0.14)] dark:border-slate-700 dark:bg-slate-900';
  private readonly menuItemBase =
    'flex w-full items-center gap-[9px] rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] font-semibold outline-none ' +
    'transition-colors duration-150 hover:bg-[#f4f6f9] focus-visible:bg-[#f4f6f9] ' +
    'dark:hover:bg-slate-800 dark:focus-visible:bg-slate-800 ';
  readonly claseMenuItem = this.menuItemBase + 'text-[#0f172a] dark:text-slate-100';
  readonly claseMenuItemPeligro = this.menuItemBase + 'text-[#b91c1c] dark:text-red-400';
  readonly claseMenuItemApagado =
    'flex w-full cursor-not-allowed items-center gap-[9px] rounded-[6px] px-2.5 py-[7px] text-left text-[12.5px] ' +
    'font-semibold text-[#5f6c80] outline-none dark:text-slate-400';

  /** El menú se abre hacia abajo alineado a la derecha; si no cabe, hacia arriba. */
  readonly posMenu: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 }
  ];

  readonly esqueletoFilas = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // ==================== ESTADO ====================
  selectedTenantId?: number;
  selectedPortfolioId?: number;
  selectedSubPortfolioId?: number;
  /** Filtro por tipo. Se aplica en memoria sobre lo ya cargado de la subcartera. */
  selectedType?: ClassificationTypeV2;
  /** Buscador por nombre o código, también en memoria. */
  buscar = '';

  loading = signal(false);
  showClassificationDialog = signal(false);
  showCategoryDialog = signal(false);
  showAdditionalFieldsDialog = signal(false);
  classificationDialogMode = signal<'create' | 'edit'>('create');
  selectedClassificationForEdit = signal<TypificationCatalogV2 | undefined>(undefined);
  selectedTypificationForFields = signal<TypificationCatalogV2 | undefined>(undefined);
  parentClassificationForCreate = signal<TypificationCatalogV2 | undefined>(undefined);

  eliminar = signal<EstadoEliminar | null>(null);
  eliminando = signal(false);

  classificationTypes = Object.values(ClassificationTypeV2);
  typifications: TypificationCatalogV2[] = [];
  tenantConfigs: TenantTypificationConfigV2[] = [];
  treeNodes: TypificationTreeNodeV2[] = [];
  filas: FilaTipificacion[] = [];
  /** Ramas contraídas. Lo que no está aquí se muestra expandido, incluidas las tipificaciones nuevas. */
  private colapsados = new Set<number>();
  /** Tipificaciones con un cambio de estado en curso: su interruptor queda bloqueado. */
  private cambiando = new Set<number>();
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: any[] = [];

  // Inline editing state
  editingNodeId = signal<number | null>(null);
  editingForm = signal<{
    nombrePersonalizado: string;
    descripcionPersonalizada: string;
    colorPersonalizado: string;
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
    public themeService: ThemeService,
    private toast: ToastService
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
    this.selectedSubPortfolioId = undefined;
    this.portfolios = [];
    this.subPortfolios = [];
    this.limpiarLista();

    if (this.selectedTenantId) {
      this.loadPortfolios();
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

  private limpiarLista() {
    this.typifications = [];
    this.tenantConfigs = [];
    this.treeNodes = [];
    this.filas = [];
    this.colapsados.clear();
    this.cancelEdit();
  }

  loadTypifications() {
    if (!this.selectedTenantId || !this.selectedPortfolioId || !this.selectedSubPortfolioId) return;

    this.loading.set(true);

    // Siempre la configuración de la subcartera, con las deshabilitadas. El filtro
    // por tipo ya no cambia de endpoint: antes pedía la configuración de la cartera
    // (sin subcartera y sin deshabilitadas) y mostraba otro estado.
    this.classificationService.getTenantClassifications(
      this.selectedTenantId,
      this.selectedPortfolioId,
      true, // includeDisabled = true for maintenance view
      this.selectedSubPortfolioId
    ).subscribe({
      next: (configs) => {
        this.tenantConfigs = configs;
        // Extract typifications from tenant configs
        this.typifications = configs.map(config => config.tipificacion);

        // Si hay subcartera, aplicar padres personalizados del endpoint effective
        if (this.selectedSubPortfolioId && this.selectedPortfolioId) {
          this.classificationService.getEffectiveTypifications(
            this.selectedTenantId!,
            this.selectedPortfolioId,
            this.selectedSubPortfolioId
          ).subscribe({
            next: (effectiveTyps) => {
              // Crear mapa de padres personalizados
              const parentOverrides = new Map<number, number | null>();
              effectiveTyps.forEach(t => {
                parentOverrides.set(t.id, t.parentTypificationId ?? null);
              });
              // Aplicar padres personalizados a las tipificaciones
              this.typifications.forEach(t => {
                if (parentOverrides.has(t.id)) {
                  t.parentTypificationId = parentOverrides.get(t.id)!;
                }
              });
              this.buildTree();
              this.loading.set(false);
            },
            error: () => {
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
        this.toast.error('Error al cargar las tipificaciones');
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
      // Usar parentTypificationId si está disponible, sino tipificacionPadre?.id
      const parentId = typification.parentTypificationId || typification.tipificacionPadre?.id;
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
    // Antes se expandía todo en cada recarga: habilitar una tipificación deshacía
    // lo que el usuario había contraído. Ahora las ramas contraídas se conservan.
    this.refrescarFilas();
  }

  // ==================== FILAS, FILTRO Y BÚSQUEDA ====================

  /** Con filtro de tipo o texto en el buscador la lista deja de ser árbol. */
  get vistaPlana(): boolean {
    return !!this.selectedType || tuiNormalizar(this.buscar).length > 0;
  }

  private refrescarFilas() {
    const q = tuiNormalizar(this.buscar);
    const filas: FilaTipificacion[] = [];

    if (this.selectedType || q) {
      const recorrer = (nodes: TypificationTreeNodeV2[], ruta: string[]) => nodes.forEach(n => {
        const nombre = this.nombreDe(n);
        const okTipo = !this.selectedType || n.typification.tipoClasificacion === this.selectedType;
        const okTexto = !q
          || tuiNormalizar(nombre).includes(q)
          || tuiNormalizar(n.typification.nombre).includes(q)
          || tuiNormalizar(n.typification.codigo).includes(q);
        if (okTipo && okTexto) {
          filas.push({ node: n, depth: 0, hasKids: false, crumb: ruta.join(' › ') });
        }
        recorrer(n.children, [...ruta, nombre]);
      });
      recorrer(this.treeNodes, []);
    } else {
      const bajar = (nodes: TypificationTreeNodeV2[], depth: number) => nodes.forEach(n => {
        filas.push({ node: n, depth, hasKids: n.children.length > 0, crumb: '' });
        if (n.children.length > 0 && !this.colapsados.has(n.typification.id)) {
          bajar(n.children, depth + 1);
        }
      });
      bajar(this.treeNodes, 0);
    }

    this.filas = filas;
  }

  onBuscarChange(valor: string) {
    this.buscar = valor;
    this.refrescarFilas();
  }

  toggleNode(nodeId: number) {
    if (this.colapsados.has(nodeId)) {
      this.colapsados.delete(nodeId);
    } else {
      this.colapsados.add(nodeId);
    }
    this.refrescarFilas();
  }

  isExpanded(nodeId: number): boolean {
    return !this.colapsados.has(nodeId);
  }

  expandAll() {
    this.colapsados.clear();
    this.refrescarFilas();
  }

  collapseAll() {
    const conHijos = (nodes: TypificationTreeNodeV2[]) => nodes.forEach(n => {
      if (n.children.length > 0) {
        this.colapsados.add(n.typification.id);
        conHijos(n.children);
      }
    });
    conHijos(this.treeNodes);
    this.refrescarFilas();
  }

  onTypeChange() {
    this.refrescarFilas();
  }

  onPortfolioChange() {
    this.selectedSubPortfolioId = undefined;
    this.subPortfolios = [];
    this.limpiarLista();

    if (this.selectedPortfolioId) {
      this.classificationService.getSubPortfoliosByPortfolio(this.selectedPortfolioId).subscribe({
        next: (data) => {
          this.subPortfolios = data;
        },
        error: (error) => {
          console.error('Error loading subportfolios:', error);
        }
      });
    }
  }

  onSubPortfolioChange() {
    this.limpiarLista();

    if (this.selectedSubPortfolioId) {
      this.loadTypifications();
    }
  }

  // ==================== DATOS PARA PINTAR ====================

  get nombreSubcartera(): string {
    const sub = this.subPortfolios.find(s => s.id === this.selectedSubPortfolioId);
    return sub ? (sub.subPortfolioName || sub.nombre || '') : '';
  }

  get totalHabilitadas(): number {
    return this.tenantConfigs.filter(c => c.estaHabilitada === true).length;
  }

  get totalPersonalizadas(): number {
    return this.tenantConfigs.filter(c => this.hasCustomizations(c)).length;
  }

  nombreDe(node: TypificationTreeNodeV2): string {
    return this.getEffectiveValue(node.config, node.typification, 'nombre');
  }

  /** Mientras se personaliza, el cuadro de color muestra el que se está eligiendo. */
  colorDe(node: TypificationTreeNodeV2): string {
    if (this.isEditing(node.config?.id) && this.editingForm()) {
      return this.editingForm()!.colorPersonalizado;
    }
    return this.getEffectiveValue(node.config, node.typification, 'color') || '#6B7280';
  }

  iconoDe(node: TypificationTreeNodeV2): string {
    return this.getEffectiveValue(node.config, node.typification, 'icono');
  }

  abreviatura(node: TypificationTreeNodeV2): string {
    return node.typification.codigo?.substring(0, 2) || 'NA';
  }

  habilitada(node: TypificationTreeNodeV2): boolean {
    return node.config?.estaHabilitada === true;
  }

  /** Tiene nombre propio en esta subcartera, distinto al del catálogo. */
  renombrada(node: TypificationTreeNodeV2): boolean {
    const propio = node.config?.nombrePersonalizado;
    return !!propio && propio !== node.typification.nombre;
  }

  estaCambiando(node: TypificationTreeNodeV2): boolean {
    return this.cambiando.has(node.typification.id);
  }

  // ==================== HABILITAR / DESHABILITAR ====================

  toggleTypification(node: TypificationTreeNodeV2) {
    if (!this.selectedTenantId || !node.config || this.estaCambiando(node)) return;

    const id = node.typification.id;
    const enabled = !this.habilitada(node);
    const nombre = this.nombreDe(node);

    // La fila responde al instante; si el backend falla se devuelve a como estaba.
    node.config.estaHabilitada = enabled;
    this.cambiando.add(id);

    const action$ = enabled
      ? this.classificationService.enableClassification(
          this.selectedTenantId,
          id,
          this.selectedPortfolioId,
          this.selectedSubPortfolioId
        )
      : this.classificationService.disableClassification(
          this.selectedTenantId,
          id,
          this.selectedPortfolioId,
          this.selectedSubPortfolioId
        );

    action$.subscribe({
      next: () => {
        this.cambiando.delete(id);
        this.toast.success(enabled ? `«${nombre}» habilitada` : `«${nombre}» deshabilitada`, 2000);
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error toggling typification:', error);
        this.cambiando.delete(id);
        if (node.config) node.config.estaHabilitada = !enabled;
        this.toast.error('No se pudo cambiar el estado de la tipificación');
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  // Classification dialog methods
  openCreateRootDialog() {
    // Sin subcartera la tipificación nueva no se puede habilitar donde se la va a
    // buscar, y quedaría creada pero invisible.
    if (!this.selectedSubPortfolioId) return;
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
    const eraEdicion = this.classificationDialogMode() === 'edit';
    this.showClassificationDialog.set(false);
    this.selectedClassificationForEdit.set(undefined);
    this.parentClassificationForCreate.set(undefined);
    this.showSuccessMessage(eraEdicion
      ? `«${typification.nombre}» se actualizó en el catálogo`
      : `«${typification.nombre}» se creó y quedó habilitada en esta subcartera`);
    this.loadTypifications();
  }

  // Diálogo de montos (antes "campos adicionales"). Carga sus propios datos al abrir.
  openAdditionalFieldsDialog(typification: TypificationCatalogV2) {
    this.selectedTypificationForFields.set(typification);
    this.showAdditionalFieldsDialog.set(true);
  }

  closeAdditionalFieldsDialog() {
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(undefined);
  }

  onAdditionalFieldsSaved() {
    this.showAdditionalFieldsDialog.set(false);
    this.selectedTypificationForFields.set(undefined);
    this.showSuccessMessage('Montos guardados');
  }

  // ==================== ELIMINAR DEL CATÁLOGO ====================

  abrirEliminar(typification: TypificationCatalogV2) {
    if (typification.esSistema) return;
    this.eliminar.set({ tip: typification, paso: 'confirmar', mensaje: '' });
  }

  cerrarEliminar() {
    if (this.eliminando()) return;
    this.eliminar.set(null);
  }

  /** La tipificación que se intentó borrar ya está apagada en esta subcartera. */
  get eliminarYaDeshabilitada(): boolean {
    const e = this.eliminar();
    if (!e) return false;
    return this.tenantConfigs.some(c => c.tipificacion.id === e.tip.id && c.estaHabilitada !== true);
  }

  confirmarEliminar() {
    const e = this.eliminar();
    if (!e || this.eliminando()) return;

    this.eliminando.set(true);

    // Siempre eliminar físicamente del catálogo global
    this.classificationService.deleteTypification(e.tip.id).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.eliminar.set(null);
        this.showSuccessMessage(`«${e.tip.nombre}» se eliminó del catálogo`);
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al eliminar tipificación:', error);
        this.eliminando.set(false);

        // El backend rechaza con 400 y explica por qué (casi siempre: tiene gestiones
        // asociadas). Borrarla rompería el historial, así que se ofrece apagarla aquí.
        const mensaje = error?.error?.error || error?.error?.message;
        if (error?.status === 400 && mensaje) {
          this.eliminar.set({ tip: e.tip, paso: 'enUso', mensaje });
        } else {
          this.eliminar.set(null);
          this.toast.error('Error al eliminar la tipificación');
        }
      }
    });
  }

  deshabilitarEnSubcartera() {
    const e = this.eliminar();
    if (!e || !this.selectedTenantId || this.eliminando()) return;

    this.eliminando.set(true);

    this.classificationService.disableClassification(
      this.selectedTenantId,
      e.tip.id,
      this.selectedPortfolioId,
      this.selectedSubPortfolioId
    ).subscribe({
      next: () => {
        this.eliminando.set(false);
        this.eliminar.set(null);
        this.showSuccessMessage(`«${e.tip.nombre}» quedó deshabilitada en esta subcartera`);
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al deshabilitar tipificación:', error);
        this.eliminando.set(false);
        this.toast.error('No se pudo deshabilitar la tipificación');
      }
    });
  }

  showSuccessMessage(mensaje: string = 'Cambio guardado') {
    this.toast.success(mensaje);
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
    this.showSuccessMessage('Categoría creada');
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
    // Una categoría creada fuera de las cuatro fijas se muestra con su código
    return labels[type] ?? type;
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
  startEdit(node: TypificationTreeNodeV2) {
    const config = node.config;
    const typification = node.typification;

    // Segundo clic sobre la misma fila: cierra el editor
    if (config && this.isEditing(config.id)) {
      this.cancelEdit();
      return;
    }

    this.editingNodeId.set(config?.id || null);
    this.editingForm.set({
      nombrePersonalizado: config?.nombrePersonalizado || typification.nombre,
      descripcionPersonalizada: config?.descripcionPersonalizada || typification.descripcion || '',
      colorPersonalizado: config?.colorPersonalizado || typification.colorSugerido || '#3B82F6'
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
   * Lo que el guardado no debe tocar. El backend reemplaza TODOS los campos de la
   * configuración con lo que llega, y los que faltan toman su valor por defecto:
   * `estaHabilitada` y `heredaDePadre` pasan a true. Sin esto, personalizar o
   * restablecer una tipificación deshabilitada la volvía a habilitar.
   */
  private estadoQueSeConserva(config: TenantTypificationConfigV2): UpdateTypificationConfigCommandV2 {
    return {
      estaHabilitada: config.estaHabilitada,
      heredaDePadre: config.heredaDePadre
    };
  }

  /**
   * Guarda los cambios de edición inline
   */
  saveEdit(node: TypificationTreeNodeV2) {
    if (!this.editingForm() || !node.config) return;

    this.savingEdit.set(true);
    const form = this.editingForm()!;
    const config = node.config;
    const nombre = form.nombrePersonalizado.trim();
    const descripcion = form.descripcionPersonalizada.trim();

    // Lo que coincide con el catálogo no se guarda como personalización
    const command: UpdateTypificationConfigCommandV2 = {
      ...this.estadoQueSeConserva(config),
      nombrePersonalizado: nombre && nombre !== node.typification.nombre ? nombre : undefined,
      descripcionPersonalizada: descripcion && descripcion !== (node.typification.descripcion || '') ? descripcion : undefined,
      colorPersonalizado: form.colorPersonalizado !== (node.typification.colorSugerido || '#3B82F6') ? form.colorPersonalizado : undefined,
      // El editor no los muestra: se reenvían tal cual para no borrarlos
      iconoPersonalizado: config.iconoPersonalizado || undefined,
      ordenVisualizacionPersonalizado: config.ordenVisualizacionPersonalizado ?? undefined,
      requiereObservacionesPersonalizado: config.requiereObservacionesPersonalizado ?? undefined
    };

    this.classificationService.updateTenantTypificationConfig(config.id, command).subscribe({
      next: () => {
        this.savingEdit.set(false);
        this.editingNodeId.set(null);
        this.editingForm.set(null);
        this.showSuccessMessage('Personalización guardada');
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al guardar personalización:', error);
        this.savingEdit.set(false);
        this.toast.error('Error al guardar los cambios');
      }
    });
  }

  /**
   * Resetea la personalización a valores del catálogo
   */
  resetCustomization(node: TypificationTreeNodeV2) {
    if (!node.config) return;

    if (!confirm(`¿Restablecer «${this.nombreDe(node)}» a los valores del catálogo?\n\nSe pierden el nombre, la descripción y el color propios de esta subcartera.`)) {
      return;
    }

    // Todo lo personalizado va vacío; el estado (habilitada o no) se conserva
    const command: UpdateTypificationConfigCommandV2 = this.estadoQueSeConserva(node.config);

    this.classificationService.updateTenantTypificationConfig(node.config.id, command).subscribe({
      next: () => {
        this.cancelEdit();
        this.showSuccessMessage('Personalización restablecida');
        this.loadTypifications();
      },
      error: (error) => {
        console.error('Error al resetear personalización:', error);
        this.toast.error('Error al restablecer la personalización');
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
   * Verifica si un nodo tiene personalizaciones.
   *
   * El orden personalizado no cuenta: se guarda pero nadie lo lee (el árbol se
   * ordena por el orden global del catálogo). Además se comparaba con `!== null`,
   * así que cualquier configuración sin ese campo salía como personalizada.
   */
  hasCustomizations(config: any): boolean {
    if (!config) return false;
    return !!(
      config.nombrePersonalizado ||
      config.descripcionPersonalizada ||
      config.colorPersonalizado ||
      config.iconoPersonalizado
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
}
