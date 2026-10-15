import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { MenuPermissionService } from '../services/menu-permission.service';
import { ToastService } from '../../shared/services/toast.service';

/**
 * Acceso a una pantalla según Configuración de Menú, el mismo sitio del que sale el menú lateral:
 * si la opción no se le muestra al usuario, la pantalla tampoco se abre escribiendo la URL. No hay
 * roles fijos aquí, así que no puede pasar que la opción aparezca en el menú y la pantalla rechace;
 * quién entra se cambia en Configuración de Menú y vale para el menú y para la dirección a la vez.
 *
 * Lo que el menú no controla (la configuración de la cuenta, las pantallas de uno mismo, una
 * subpantalla a la que se entra desde otra) no lo decide este guard. Una subpantalla puede declarar
 * de qué pantalla del menú depende con `data: { acceso: '/ruta-del-menu' }`; se usa solo cuando su
 * propia dirección no es una del menú.
 */
export const menuAccesoGuard: CanActivateFn = (route, state) => {
  const menus = inject(MenuPermissionService);
  const router = inject(Router);
  const toast = inject(ToastService);

  return menus.puedeEntrar(state.url, route.data?.['acceso']).pipe(
    map(permitido => {
      if (permitido) {
        return true;
      }
      toast.warning('No tienes acceso a esa pantalla');
      // A su pantalla de entrada, la primera del menú: es la misma con la que entra al iniciar sesión.
      return router.createUrlTree([menus.primeraRuta() ?? '/settings']);
    })
  );
};
