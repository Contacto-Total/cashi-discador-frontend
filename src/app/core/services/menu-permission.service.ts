import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MenuItem {
  id: number;
  codigo: string;
  etiqueta: string;
  icono: string;
  ruta: string | null;
  codigoPadre: string | null;
  orden: number;
  tipo: 'LINK' | 'DROPDOWN';
  visible?: boolean;
  children: MenuItem[];
}

export interface MenuConfigUpdate {
  rol: string;
  permissions: {
    menuCodigo: string;
    visible: boolean;
    orden: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuPermissionService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/menu`;

  constructor(private http: HttpClient) {}

  /**
   * Load visible menu for current user (called on app init)
   */
  loadVisibleMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/visible`).pipe(
      tap(items => this.menuItemsSubject.next(items))
    );
  }

  /**
   * Get current menu items
   */
  getMenuItems(): MenuItem[] {
    return this.menuItemsSubject.value;
  }

  /**
   * Get menu configuration for a specific role (admin)
   */
  getMenuConfigForRole(role: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/config/${role}`);
  }

  /**
   * Get all roles configuration (admin)
   */
  getAllRolesConfig(): Observable<Record<string, MenuItem[]>> {
    return this.http.get<Record<string, MenuItem[]>>(`${this.apiUrl}/config/all`);
  }

  /**
   * Update menu configuration for a role (admin)
   */
  updateMenuConfig(config: MenuConfigUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/config`, config);
  }

  /**
   * Update parent of a menu item (admin) - affects all roles
   */
  updateMenuItemParent(codigo: string, codigoPadre: string | null): Observable<any> {
    return this.http.put(`${this.apiUrl}/item/${codigo}/parent`, { codigoPadre });
  }

  /**
   * Clear cached menu (on logout)
   */
  clearMenu(): void {
    this.menuItemsSubject.next([]);
  }
}
