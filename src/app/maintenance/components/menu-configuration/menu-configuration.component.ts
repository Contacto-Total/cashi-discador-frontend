import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuPermissionService, MenuItem, MenuConfigUpdate } from '../../../core/services/menu-permission.service';

type RoleType = 'ADMIN' | 'SUPERVISOR' | 'AGENT' | 'COORDINADOR';

interface MenuItemWithVisibility extends MenuItem {
  visible: boolean;
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

  visibleItems = signal<MenuItemWithVisibility[]>([]);
  hiddenItems = signal<MenuItemWithVisibility[]>([]);

  loading = signal(false);
  saving = signal(false);
  hasChanges = signal(false);

  roleLabels: Record<RoleType, string> = {
    'ADMIN': 'Administrador',
    'SUPERVISOR': 'Supervisor',
    'AGENT': 'Agente',
    'COORDINADOR': 'Coordinador'
  };

  constructor(private menuService: MenuPermissionService) {}

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
        const visible: MenuItemWithVisibility[] = [];
        const hidden: MenuItemWithVisibility[] = [];

        items.forEach(item => {
          const itemWithVisibility = { ...item, visible: item.visible ?? false } as MenuItemWithVisibility;
          if (item.visible) {
            visible.push(itemWithVisibility);
          } else {
            hidden.push(itemWithVisibility);
          }
        });

        visible.sort((a, b) => a.orden - b.orden);
        hidden.sort((a, b) => a.orden - b.orden);

        this.visibleItems.set(visible);
        this.hiddenItems.set(hidden);
        this.hasChanges.set(false);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading menu config:', err);
        this.loading.set(false);
        alert('Error al cargar la configuracion del menu');
      }
    });
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
    this.hasChanges.set(true);
  }

  moveToVisible(item: MenuItemWithVisibility): void {
    const hidden = [...this.hiddenItems()];
    const visible = [...this.visibleItems()];

    const index = hidden.findIndex(i => i.codigo === item.codigo);
    if (index > -1) {
      hidden.splice(index, 1);
      visible.push(item);
    }

    this.hiddenItems.set(hidden);
    this.visibleItems.set(visible);
    this.updateOrders();
    this.hasChanges.set(true);
  }

  moveToHidden(item: MenuItemWithVisibility): void {
    const hidden = [...this.hiddenItems()];
    const visible = [...this.visibleItems()];

    const index = visible.findIndex(i => i.codigo === item.codigo);
    if (index > -1) {
      visible.splice(index, 1);
      hidden.push(item);
    }

    this.visibleItems.set(visible);
    this.hiddenItems.set(hidden);
    this.updateOrders();
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
}
