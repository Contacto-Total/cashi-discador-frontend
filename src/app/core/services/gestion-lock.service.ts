import { Injectable } from '@angular/core';

/**
 * Puente entre la pantalla de gestión de cobranza y los puntos de salida que
 * NO pasan por el router (p. ej. el botón de "Cerrar sesión"). La pantalla
 * registra un predicado que indica si la gestión está "bloqueada" (se hizo una
 * llamada y aún no se guarda); el resto de la app consulta `isLocked` sin
 * acoplarse al componente.
 *
 * El registro/desregistro se hace por identidad de función: así, ante cualquier
 * orden de creación/destrucción de instancias, una instancia nunca borra el
 * predicado registrado por otra.
 */
@Injectable({ providedIn: 'root' })
export class GestionLockService {
  private check: (() => boolean) | null = null;

  register(fn: () => boolean): void {
    this.check = fn;
  }

  unregister(fn: () => boolean): void {
    if (this.check === fn) {
      this.check = null;
    }
  }

  get isLocked(): boolean {
    return this.check ? this.check() : false;
  }
}
