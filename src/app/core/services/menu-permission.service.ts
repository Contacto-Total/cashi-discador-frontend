import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, combineLatest, map, of, shareReplay, tap } from 'rxjs';
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

  /** Peticiones en curso, para que varias pantallas a la vez no pidan lo mismo dos veces. */
  private menuEnCurso?: Observable<MenuItem[]>;
  private rutasEnCurso?: Observable<string[]>;
  private rutasControladas: string[] | null = null;

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
   * El menú del usuario, cargándolo si todavía no está. Lo usa el guard de acceso: al entrar por
   * URL (o al recargar) la pantalla puede resolverse antes de que el menú llegue.
   */
  menuAsegurado(): Observable<MenuItem[]> {
    if (this.menuItemsSubject.value.length > 0) {
      return of(this.menuItemsSubject.value);
    }
    this.menuEnCurso ??= this.loadVisibleMenu().pipe(shareReplay(1));
    return this.menuEnCurso;
  }

  /**
   * Rutas de las pantallas que Configuración de Menú controla, para cualquier rol. Se piden una
   * vez por sesión: el catálogo solo cambia cuando se da de alta una pantalla.
   */
  rutasDelMenu(): Observable<string[]> {
    if (this.rutasControladas) {
      return of(this.rutasControladas);
    }
    this.rutasEnCurso ??= this.http.get<string[]>(`${this.apiUrl}/rutas`).pipe(
      tap(rutas => this.rutasControladas = rutas),
      shareReplay(1)
    );

    return this.rutasEnCurso;
  }

  /**
   * Decide el acceso a una dirección igual que el sidebar decide qué muestra: la pantalla se abre
   * si está en el menú del usuario, y se cierra si el menú la controla para otros roles pero a él
   * no se le muestra. Lo que el menú no controla (la configuración de la cuenta, una subpantalla a
   * la que se entra desde otra) no lo decide esto.
   */
  puedeEntrar(url: string, dependeDe?: string): Observable<boolean> {
    return combineLatest([this.menuAsegurado(), this.rutasDelMenu()]).pipe(
      map(([menu, controladas]) => {
        const visibles = rutasDeMenu(menu);
        if (cubre(visibles, url)) {
          return true;
        }
        if (cubre(controladas, url)) {
          // El menú controla la pantalla y a este usuario no se la muestra.
          return false;
        }
        // Fuera del menú: si declara de qué pantalla depende, se decide por ella.
        return !dependeDe || cubre(visibles, dependeDe) || !cubre(controladas, dependeDe);
      }),
      // Si no se pudo preguntar, no se cierra el paso: el backend valida igual cada servicio.
      catchError(() => of(true))
    );
  }

  /** La pantalla de entrada: la primera del menú del usuario. */
  primeraRuta(): string | null {
    const primera = (items: MenuItem[]): string | null => {
      for (const item of items) {
        const ruta = item.ruta ?? primera(item.children ?? []);
        if (ruta) {
          return ruta;
        }
      }
      return null;
    };
    return primera(this.menuItemsSubject.value);
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
    this.menuEnCurso = undefined;
  }
}

/** Todas las rutas del menú, incluidas las de los grupos desplegables. */
function rutasDeMenu(menu: MenuItem[]): string[] {
  return menu.flatMap(item => [...(item.ruta ? [item.ruta] : []), ...rutasDeMenu(item.children ?? [])]);
}

/**
 * Alguna de esas rutas es la dirección o la contiene. Se compara por tramos, como el sidebar marca
 * la pantalla abierta: `/pagos-bancarios` no cubre `/pagos-bancarios-reportes`, y la ficha de una
 * campaña (`/admin/campaigns/7`) va con la pantalla de campañas.
 */
function cubre(rutas: string[], url: string): boolean {
  const limpia = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return rutas.some(ruta => {
    const base = ruta.split(/[?#]/)[0].replace(/\/+$/, '');
    return !!base && (limpia === base || limpia.startsWith(`${base}/`));
  });
}
