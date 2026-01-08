import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuPermissionService, MenuItem, MenuConfigUpdate } from '../../../core/services/menu-permission.service';

type RoleType = 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'COORDINADOR';

interface MenuItemWithVisibility extends MenuItem {
  visible: boolean;
}

interface HierarchicalItem {
  item: MenuItemWithVisibility;
  children: MenuItemWithVisibility[];
}

@Component({
  selector: 'app-menu-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DragDropModule],
  templateUrl: './menu-configuration.component.html',
  styleUrls: ['./menu-configuration.component.css']
})
export class MenuConfigurationComponent implements OnInit {
  roles: RoleType[] = ['ADMIN', 'SUPERVISOR', 'AGENT', 'COORDINADOR'];
  selectedRole = signal<RoleType>('SUPERVISOR');

  allItems = signal<MenuItemWithVisibility[]>([]);
  visibleItems = signal<MenuItemWithVisibility[]>([]);
  hiddenItems = signal<MenuItemWithVisibility[]>([]);

  // Modal para asignar padre
  showParentModal = signal(false);
  itemToAssignParent = signal<MenuItemWithVisibility | null>(null);

  loading = signal(false);
  saving = signal(false);
  hasChanges = signal(false);

  roleLabels: Record<RoleType, string> = {
    'ADMIN': 'Administrador',
    'SUPERVISOR': 'Supervisor',
    'AGENT': 'Agente',
    'COORDINADOR': 'Coordinador'
  };

  // Jerarquías pre-calculadas (no computed)
  visibleHierarchy = signal<HierarchicalItem[]>([]);
  hiddenHierarchy = signal<HierarchicalItem[]>([]);
  availableParents = signal<MenuItemWithVisibility[]>([]);

  constructor(
    private menuService: MenuPermissionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRoleConfig(this.selectedRole());
  }

  selectRole(role: RoleType): void {
    if (this.hasChanges()) {
      if (!confirm('Hay cambios sin guardar. ¿Desea continuar?')) {
        return;
      }
    }
    this.selectedRole.set(role);
    this.loadRoleConfig(role);
  }

  loadRoleConfig(role: RoleType): void {
    this.loading.set(true);
    this.menuService.getMenuConfigForRole(role).subscribe({
      next: (items) => {
        const all: MenuItemWithVisibility[] = [];
        const visible: MenuItemWithVisibility[] = [];
        const hidden: MenuItemWithVisibility[] = [];

        items.forEach(item => {
          const itemWithVisibility = { ...item, visible: item.visible ?? false } as MenuItemWithVisibility;
          all.push(itemWithVisibility);
          if (item.visible) {
            visible.push(itemWithVisibility);
          } else {
            hidden.push(itemWithVisibility);
          }
        });

        // Guardar datos
        this.allItems.set(all);
        this.visibleItems.set(visible);
        this.hiddenItems.set(hidden);

        // Calcular jerarquías y padres disponibles de una sola vez
        this.availableParents.set(all.filter(item => item.tipo === 'DROPDOWN'));
        this.recalculateHierarchies();

        this.hasChanges.set(false);

        // Usar setTimeout para asegurar que Angular procese todo antes de quitar el loading
        setTimeout(() => {
          this.loading.set(false);
          this.cdr.detectChanges();
        }, 0);
      },
      error: (err) => {
        console.error('Error loading menu config:', err);
        this.loading.set(false);
        alert('Error al cargar la configuracion del menu');
      }
    });
  }

  /**
   * Recalcula las jerarquías de visible y hidden
   */
  private recalculateHierarchies(): void {
    this.visibleHierarchy.set(this.buildHierarchy(this.visibleItems()));
    this.hiddenHierarchy.set(this.buildHierarchy(this.hiddenItems()));
  }

  /**
   * Construye la jerarquía agrupando padres con sus hijos
   */
  buildHierarchy(items: MenuItemWithVisibility[]): HierarchicalItem[] {
    const result: HierarchicalItem[] = [];
    const childrenMap = new Map<string, MenuItemWithVisibility[]>();

    // Primero, agrupar hijos por padre
    items.forEach(item => {
      if (item.codigoPadre) {
        if (!childrenMap.has(item.codigoPadre)) {
          childrenMap.set(item.codigoPadre, []);
        }
        childrenMap.get(item.codigoPadre)!.push(item);
      }
    });

    // Luego, construir la jerarquía con padres y sus hijos
    items.forEach(item => {
      if (!item.codigoPadre) {
        // Es un item de nivel superior (padre o item suelto)
        const children = childrenMap.get(item.codigo) || [];
        children.sort((a, b) => a.orden - b.orden);
        result.push({ item, children });
      }
    });

    // Ordenar por orden del padre
    result.sort((a, b) => a.item.orden - b.item.orden);

    return result;
  }

  dropVisible(event: CdkDragDrop<MenuItemWithVisibility[]>): void {
    if (event.previousContainer === event.container) {
      const items = [...this.visibleItems()];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.visibleItems.set(items);
    } else {
      const prevItems = [...this.hiddenItems()];
      const currItems = [...this.visibleItems()];
      transferArrayItem(prevItems, currItems, event.previousIndex, event.currentIndex);
      this.hiddenItems.set(prevItems);
      this.visibleItems.set(currItems);
    }
    this.updateOrders();
    this.recalculateHierarchies();
    this.hasChanges.set(true);
  }

  dropHidden(event: CdkDragDrop<MenuItemWithVisibility[]>): void {
    if (event.previousContainer === event.container) {
      const items = [...this.hiddenItems()];
      moveItemInArray(items, event.previousIndex, event.currentIndex);
      this.hiddenItems.set(items);
    } else {
      const prevItems = [...this.visibleItems()];
      const currItems = [...this.hiddenItems()];
      transferArrayItem(prevItems, currItems, event.previousIndex, event.currentIndex);
      this.visibleItems.set(prevItems);
      this.hiddenItems.set(currItems);
    }
    this.updateOrders();
    this.recalculateHierarchies();
    this.hasChanges.set(true);
  }

  moveToVisible(item: MenuItemWithVisibility): void {
    const hidden = [...this.hiddenItems()];
    const visible = [...this.visibleItems()];

    const index = hidden.findIndex(i => i.codigo === item.codigo);
    if (index > -1) {
      hidden.splice(index, 1);
      item.visible = true;
      visible.push(item);
    }

    this.hiddenItems.set(hidden);
    this.visibleItems.set(visible);
    this.updateOrders();
    this.recalculateHierarchies();
    this.hasChanges.set(true);
  }

  moveToHidden(item: MenuItemWithVisibility): void {
    const hidden = [...this.hiddenItems()];
    const visible = [...this.visibleItems()];

    const index = visible.findIndex(i => i.codigo === item.codigo);
    if (index > -1) {
      visible.splice(index, 1);
      item.visible = false;
      hidden.push(item);
    }

    this.visibleItems.set(visible);
    this.hiddenItems.set(hidden);
    this.updateOrders();
    this.recalculateHierarchies();
    this.hasChanges.set(true);
  }

  private updateOrders(): void {
    const visible = this.visibleItems();
    const hidden = this.hiddenItems();

    visible.forEach((item, index) => {
      item.orden = index + 1;
      item.visible = true;
    });

    hidden.forEach((item, index) => {
      item.orden = index + 1;
      item.visible = false;
    });
  }

  save(): void {
    this.saving.set(true);

    const allItems = [...this.visibleItems(), ...this.hiddenItems()];

    const config: MenuConfigUpdate = {
      rol: this.selectedRole(),
      permissions: allItems.map(item => ({
        menuCodigo: item.codigo,
        visible: item.visible,
        orden: item.orden
      }))
    };

    this.menuService.updateMenuConfig(config).subscribe({
      next: () => {
        this.saving.set(false);
        this.hasChanges.set(false);
        alert('Configuracion guardada correctamente');
      },
      error: (err) => {
        console.error('Error saving config:', err);
        this.saving.set(false);
        alert('Error al guardar la configuracion');
      }
    });
  }

  cancel(): void {
    if (this.hasChanges()) {
      if (confirm('¿Descartar los cambios?')) {
        this.loadRoleConfig(this.selectedRole());
      }
    }
  }

  getItemTypeLabel(tipo: string): string {
    return tipo === 'DROPDOWN' ? '(dropdown)' : '';
  }

  // ========================================
  // Funciones para asignar/quitar padre
  // ========================================

  openParentModal(item: MenuItemWithVisibility): void {
    this.itemToAssignParent.set(item);
    this.showParentModal.set(true);
  }

  closeParentModal(): void {
    this.showParentModal.set(false);
    this.itemToAssignParent.set(null);
  }

  assignParent(parentCodigo: string | null): void {
    const item = this.itemToAssignParent();
    if (!item) return;

    // Llamar a la API para guardar el cambio de padre
    this.menuService.updateMenuItemParent(item.codigo, parentCodigo).subscribe({
      next: () => {
        // Actualizar en visibleItems o hiddenItems
        const updateInList = (list: MenuItemWithVisibility[]) => {
          return list.map(i => {
            if (i.codigo === item.codigo) {
              return { ...i, codigoPadre: parentCodigo };
            }
            return i;
          });
        };

        if (item.visible) {
          this.visibleItems.set(updateInList(this.visibleItems()));
        } else {
          this.hiddenItems.set(updateInList(this.hiddenItems()));
        }

        // Actualizar en allItems
        this.allItems.set(updateInList(this.allItems()));

        // Recalcular jerarquías
        this.recalculateHierarchies();

        this.closeParentModal();
      },
      error: (err) => {
        console.error('Error updating parent:', err);
        alert('Error al actualizar el padre');
      }
    });
  }

  removeParent(item: MenuItemWithVisibility): void {
    // Llamar a la API para quitar el padre
    this.menuService.updateMenuItemParent(item.codigo, null).subscribe({
      next: () => {
        const updateInList = (list: MenuItemWithVisibility[]) => {
          return list.map(i => {
            if (i.codigo === item.codigo) {
              return { ...i, codigoPadre: null };
            }
            return i;
          });
        };

        if (item.visible) {
          this.visibleItems.set(updateInList(this.visibleItems()));
        } else {
          this.hiddenItems.set(updateInList(this.hiddenItems()));
        }

        this.allItems.set(updateInList(this.allItems()));

        // Recalcular jerarquías
        this.recalculateHierarchies();
      },
      error: (err) => {
        console.error('Error removing parent:', err);
        alert('Error al quitar el padre');
      }
    });
  }

  getParentLabel(codigoPadre: string | null): string {
    if (!codigoPadre) return '';
    const parent = this.allItems().find(i => i.codigo === codigoPadre);
    return parent ? parent.etiqueta : codigoPadre;
  }
}
