import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';

/**
 * Contrato que debe implementar cualquier pantalla protegida por este guard.
 */
export interface PuedeBloquearSalida {
  /** Devuelve true si la navegación hacia `nextUrl` está permitida. */
  puedeSalir(nextUrl: string): boolean;
}

/**
 * Impide salir de la gestión de cobranza cuando ya se hizo una llamada y la
 * gestión todavía no se ha guardado. La única salida válida es "Guardar
 * Gestión", que resetea el estado y habilita la navegación programática.
 *
 * Excepción: el cierre de sesión / expiración (navegación a /login) siempre se
 * permite, para no dejar al agente atrapado con una sesión muerta.
 */
export const gestionPendienteGuard: CanDeactivateFn<PuedeBloquearSalida> = (
  component,
  _currentRoute,
  _currentState,
  nextState
) => {
  const nextUrl = nextState?.url ?? '';

  if (nextUrl.startsWith('/login')) {
    return true;
  }

  if (component.puedeSalir(nextUrl)) {
    return true;
  }

  inject(ToastService).warning('Debes guardar la gestión antes de salir');
  return false;
};
