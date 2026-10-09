import { Component, OnInit, signal, computed, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MenuPermissionService, MenuItem, MenuConfigUpdate } from '../../../core/services/menu-permission.service';
import { AuthService, RolResponse } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

interface MenuItemWithVisibility extends MenuItem {
  visible: boolean;
}

// Una fila de cualquiera de las dos columnas, ya resuelta para pintar.
interface FilaMenu {
  item: MenuItemWithVisibility;
  /** Se dibuja bajo su grupo, que está en la misma columna. */
  nested: boolean;
  /** Tiene grupo, pero el grupo quedó en la otra columna. */
  huerfano: boolean;
  /** Solo grupos: cuántos de sus elementos están en esta columna. */
  hijos: number;
  /** Posición en el menú del rol. Vacío si no aplica. */
  pos: string;
  /** Etiqueta del grupo, para las filas huérfanas. */
  grupo: string;
  /** Su visibilidad difiere de la guardada. */
  cambiado: boolean;
}

@Component({
  selector: 'app-menu-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, DragDropModule, A11yModule],
  templateUrl: './menu-configuration.component.html',
  styleUrls: ['./menu-configuration.component.css']
})
export class MenuConfigurationComponent implements OnInit {
  // ==================== SISTEMA VISUAL (el de /reports/estado-agentes) ====================
  // Cada constante lleva un solo valor por propiedad: dos utilidades de Tailwind
  // que pisan lo mismo no se resuelven por el orden en que se escriben.
  readonly claseLabel = 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400';
  readonly claseCard = 'mc-rise overflow-hidden rounded-xl border border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900';
  readonly claseCardHead =
    'flex min-h-[38px] flex-wrap items-center gap-2 border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-1.5 ' +
    'dark:border-slate-800 dark:bg-slate-800';
  readonly claseChip = 'inline-flex h-[18px] shrink-0 items-center whitespace-nowrap rounded-[5px] px-[7px] text-[10.5px] font-bold ';
  readonly claseChipGris = this.claseChip + 'bg-[#eef1f5] text-[#334155] dark:bg-slate-800 dark:text-slate-300';
  readonly claseChipAmbar =
    this.claseChip + 'border border-[#f3e2c0] bg-[#fdf6e7] text-[#b45309] dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300';
  readonly claseIconBtn =
    'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[#5f6c80] transition-colors duration-150 ' +
    'hover:bg-[#eef1f5] hover:text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100';
  readonly claseTextoBtn =
    'inline-flex h-7 shrink-0 items-center gap-[5px] rounded-[7px] border border-[#d5dbe3] bg-white px-[9px] text-[11.5px] ' +
    'font-bold text-[#334155] transition duration-150 hover:border-[#8491a3] hover:bg-[#f8fafc] active:scale-[0.97] ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800';
  readonly claseSecundario =
    'inline-flex h-9 items-center rounded-lg border border-[#d5dbe3] bg-white px-3.5 text-[12.5px] font-bold text-[#0f172a] ' +
    'transition duration-150 hover:border-[#8491a3] hover:bg-[#f8fafc] active:scale-[0.98] ' +
    'disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800';
  readonly clasePrimario =
    'inline-flex h-9 items-center gap-2 rounded-lg bg-[#0f172a] px-4 text-[12.5px] font-bold text-white ' +
    'transition duration-150 hover:bg-[#1e293b] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ' +
    'dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200';

  claseTab(activo: boolean): string {
    return 'shrink-0 whitespace-nowrap rounded-[6px] px-3.5 text-[12.5px] font-bold transition-colors duration-150 ' +
      (activo ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
              : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100');
  }

  claseOpcion(activo: boolean): string {
    return 'flex min-h-[40px] cursor-pointer items-center gap-2.5 rounded-lg border px-3 transition-colors duration-150 ' +
      (activo ? 'border-[#2563eb] bg-[#f5f9ff] dark:border-blue-500 dark:bg-blue-500/10'
              : 'border-[#e6e9ee] bg-white hover:bg-[#f8fafc] dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800');
  }

  readonly esqueletoFilas = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  // Roles dinámicos desde el backend
  roles = signal<RolResponse[]>([]);
  loadingRoles = signal(false);
  selectedRole = signal<string>('');

  allItems = signal<MenuItemWithVisibility[]>([]);
  visibleItems = signal<MenuItemWithVisibility[]>([]);
  hiddenItems = signal<MenuItemWithVisibility[]>([]);

  // Diálogo para mover un elemento de grupo
  showParentModal = signal(false);
  itemToAssignParent = signal<MenuItemWithVisibility | null>(null);
  /** Grupo marcado en el diálogo. null = nivel principal. */
  grupoElegido = signal<string | null>(null);
  moviendo = signal(false);

  loading = signal(false);
  saving = signal(false);
  hasChanges = signal(false);

  // Buscador: filtra las dos columnas en memoria
  buscar = signal('');

  /** Visibilidad tal como está guardada, por código. Sirve para marcar lo que cambió. */
  private originalVisible = signal<Map<string, boolean>>(new Map());

  // Listas planas ordenadas (padres seguidos de sus hijos)
  visibleFlat = signal<MenuItemWithVisibility[]>([]);
  hiddenFlat = signal<MenuItemWithVisibility[]>([]);
  availableParents = signal<MenuItemWithVisibility[]>([]);

  filasVisibles = computed(() => this.construirFilas(this.visibleFlat(), true));
  filasOcultas = computed(() => this.construirFilas(this.hiddenFlat(), false));

  nCambios = computed(() => {
    const original = this.originalVisible();
    return this.visibleItems().filter(i => original.get(i.codigo) === false).length
         + this.hiddenItems().filter(i => original.get(i.codigo) === true).length;
  });

  // Ocultar y volver a mostrar deja la visibilidad igual pero manda el elemento al
  // final: hay cambios que guardar aunque el conteo de visibilidad sea cero.
  textoCambios = computed(() => {
    const n = this.nCambios();
    return n === 0 ? 'Cambios sin guardar' : n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`;
  });

  constructor(
    private menuService: MenuPermissionService,
    private authService: AuthService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  /**
   * Carga los roles disponibles desde el backend
   */
  loadRoles(): void {
    this.loadingRoles.set(true);
    this.authService.getRoles().subscribe({
      next: (roles) => {
        // Filtrar solo roles activos
        const activeRoles = roles.filter(r => r.activo);
        this.roles.set(activeRoles);
        this.loadingRoles.set(false);

        // Seleccionar el primer rol por defecto
        if (activeRoles.length > 0) {
          this.selectedRole.set(activeRoles[0].nombreRol);
          this.loadRoleConfig(activeRoles[0].nombreRol);
        }
      },
      error: (err) => {
        console.error('Error loading roles:', err);
        this.loadingRoles.set(false);
        this.toast.error('Error al cargar los roles');
      }
    });
  }

  /**
   * Obtiene la etiqueta de un rol (para mostrar en la UI)
   */
  getRoleLabel(nombreRol: string): string {
    const rol = this.roles().find(r => r.nombreRol === nombreRol);
    return rol?.descripcion || nombreRol;
  }

  selectRole(role: string): void {
    if (this.hasChanges()) {
      if (!confirm('Hay cambios sin guardar. ¿Desea continuar?')) {
        return;
      }
    }
    this.selectedRole.set(role);
    this.loadRoleConfig(role);
  }

  loadRoleConfig(role: string): void {
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
        this.originalVisible.set(new Map(all.map(i => [i.codigo, i.visible])));

        // Usar NgZone para asegurar que Angular detecte todos los cambios
        this.ngZone.run(() => {
          this.availableParents.set(all.filter(item => item.tipo === 'DROPDOWN'));
          this.recalculateHierarchies();
          this.hasChanges.set(false);
          this.loading.set(false);
        });
      },
      error: (err) => {
        console.error('Error loading menu config:', err);
        this.loading.set(false);
        this.toast.error('Error al cargar la configuración del menú');
      }
    });
  }

  /**
   * Recalcula las listas planas ordenadas
   */
  private recalculateHierarchies(): void {
    this.visibleFlat.set(this.buildFlatList(this.visibleItems()));
    this.hiddenFlat.set(this.buildFlatList(this.hiddenItems()));
  }

  /**
   * Construye una lista plana con padres seguidos de sus hijos
   */
  buildFlatList(items: MenuItemWithVisibility[]): MenuItemWithVisibility[] {
    const result: MenuItemWithVisibility[] = [];
    const childrenMap = new Map<string, MenuItemWithVisibility[]>();

    // Agrupar hijos por padre
    items.forEach(item => {
      if (item.codigoPadre) {
        if (!childrenMap.has(item.codigoPadre)) {
          childrenMap.set(item.codigoPadre, []);
        }
        childrenMap.get(item.codigoPadre)!.push(item);
      }
    });

    // Obtener items de nivel superior (sin padre)
    const topLevel = items.filter(item => !item.codigoPadre);
    topLevel.sort((a, b) => a.orden - b.orden);

    // Construir lista plana: padre, luego sus hijos
    topLevel.forEach(parent => {
      result.push(parent);
      const children = childrenMap.get(parent.codigo) || [];
      children.sort((a, b) => a.orden - b.orden);
      children.forEach(child => result.push(child));
    });

    // Hijos cuyo grupo quedó en la otra columna. Antes no se agregaban: el
    // elemento seguía contando pero no se dibujaba en ningún lado, así que un
    // hijo oculto con su grupo visible ya no se podía volver a mostrar.
    const enLista = new Set(items.map(item => item.codigo));
    const huerfanos = items.filter(item => item.codigoPadre && !enLista.has(item.codigoPadre));
    huerfanos.sort((a, b) => (a.codigoPadre ?? '').localeCompare(b.codigoPadre ?? '') || a.orden - b.orden);
    huerfanos.forEach(h => result.push(h));

    return result;
  }

  /** Sin tildes ni mayúsculas: "menu" encuentra "Configuración Menú". */
  private normalizar(s: string | null | undefined): string {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

  /**
   * Convierte la lista plana de una columna en filas listas para pintar y aplica
   * el buscador. La posición se cuenta antes de filtrar, para que el número de
   * cada elemento no cambie al escribir en el buscador.
   */
  private construirFilas(flat: MenuItemWithVisibility[], visible: boolean): FilaMenu[] {
    const q = this.normalizar(this.buscar());
    const original = this.originalVisible();
    const porCodigo = new Map(flat.map(i => [i.codigo, i]));
    const coincide = (i: MenuItemWithVisibility): boolean =>
      !q || this.normalizar(i.etiqueta).includes(q) || this.normalizar(i.ruta).includes(q);

    const hijosDe = new Map<string, MenuItemWithVisibility[]>();
    flat.forEach(i => {
      if (i.codigoPadre && porCodigo.has(i.codigoPadre)) {
        hijosDe.set(i.codigoPadre, [...(hijosDe.get(i.codigoPadre) ?? []), i]);
      }
    });

    const filas: FilaMenu[] = [];
    let posPrincipal = 0;
    const posEnGrupo = new Map<string, number>();

    for (const item of flat) {
      const padre = item.codigoPadre ? porCodigo.get(item.codigoPadre) : undefined;
      const nested = !!padre;
      const huerfano = !!item.codigoPadre && !padre;

      let pos = '';
      if (nested) {
        const n = (posEnGrupo.get(item.codigoPadre!) ?? 0) + 1;
        posEnGrupo.set(item.codigoPadre!, n);
        pos = String(n);
      } else if (!huerfano) {
        posPrincipal++;
        pos = String(posPrincipal);
      }

      const hijos = hijosDe.get(item.codigo) ?? [];
      // Un grupo se muestra si coincide él o alguno de sus hijos; un hijo, si
      // coincide él o su grupo (al buscar "reportes" se ven todos los reportes).
      const mostrar = nested ? coincide(item) || coincide(padre!) : coincide(item) || hijos.some(coincide);
      if (!mostrar) continue;

      filas.push({
        item,
        nested,
        huerfano,
        hijos: hijos.length,
        pos,
        grupo: huerfano ? this.getParentLabel(item.codigoPadre) : '',
        cambiado: original.has(item.codigo) && original.get(item.codigo) !== visible
      });
    }
    return filas;
  }

  get hayBusqueda(): boolean {
    return this.normalizar(this.buscar()).length > 0;
  }

  isChild(item: MenuItemWithVisibility): boolean {
    return !!item.codigoPadre;
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
        // Lo guardado pasa a ser la referencia: se apagan las marcas "Sin guardar"
        this.originalVisible.set(new Map(allItems.map(i => [i.codigo, i.visible])));
        this.toast.success('Configuración guardada correctamente');
      },
      error: (err) => {
        console.error('Error saving config:', err);
        this.saving.set(false);
        this.toast.error('Error al guardar la configuración');
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
    this.grupoElegido.set(item.codigoPadre ?? null);
    this.showParentModal.set(true);
  }

  closeParentModal(): void {
    if (this.moviendo()) return;
    this.showParentModal.set(false);
    this.itemToAssignParent.set(null);
  }

  /** El grupo marcado es el que el elemento ya tiene: no hay nada que mover. */
  sinCambioDeGrupo(): boolean {
    return this.grupoElegido() === (this.itemToAssignParent()?.codigoPadre ?? null);
  }

  // Mover de grupo afecta a todos los roles y se guarda al instante, por eso el
  // diálogo pide confirmar con un botón en vez de aplicar al primer clic.
  confirmarMover(): void {
    if (this.sinCambioDeGrupo() || this.moviendo()) return;
    this.assignParent(this.grupoElegido());
  }

  assignParent(parentCodigo: string | null): void {
    const item = this.itemToAssignParent();
    if (!item) return;

    this.moviendo.set(true);

    // Llamar a la API para guardar el cambio de padre
    this.menuService.updateMenuItemParent(item.codigo, parentCodigo).subscribe({
      next: () => {
        this.moviendo.set(false);
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
        this.toast.success(parentCodigo
          ? `«${item.etiqueta}» se movió a ${this.getParentLabel(parentCodigo)}`
          : `«${item.etiqueta}» pasó al nivel principal`);
      },
      error: (err) => {
        console.error('Error updating parent:', err);
        this.moviendo.set(false);
        this.toast.error('Error al mover el elemento de grupo');
      }
    });
  }

  removeParent(item: MenuItemWithVisibility): void {
    // Igual que mover: es global e inmediato, así que se confirma antes.
    const grupo = this.getParentLabel(item.codigoPadre);
    if (!confirm(`¿Sacar «${item.etiqueta}» del grupo ${grupo}?\n\nAplica a todos los roles y se guarda al instante.`)) {
      return;
    }

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
        this.toast.error('Error al sacar el elemento del grupo');
      }
    });
  }

  getParentLabel(codigoPadre: string | null): string {
    if (!codigoPadre) return '';
    const parent = this.allItems().find(i => i.codigo === codigoPadre);
    return parent ? parent.etiqueta : codigoPadre;
  }
}
