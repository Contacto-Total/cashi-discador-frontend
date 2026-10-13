import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Permite que un panel lateral derecho pida plegar el menú principal mientras está abierto.
 * El estado del menú vive en AppComponent, que escucha estas solicitudes.
 */
@Injectable({ providedIn: 'root' })
export class MenuLateralService {
  private readonly solicitudes = new Subject<'plegar' | 'restaurar'>();
  readonly solicitudes$ = this.solicitudes.asObservable();
  private panelesAbiertos = 0;

  panelAbierto(): void {
    if (this.panelesAbiertos++ === 0) this.avisar('plegar');
  }

  panelCerrado(): void {
    if (this.panelesAbiertos === 0) return;
    if (--this.panelesAbiertos === 0) this.avisar('restaurar');
  }

  // Los paneles avisan durante la detección de cambios; el menú se actualiza después para no alterarla.
  private avisar(solicitud: 'plegar' | 'restaurar'): void {
    Promise.resolve().then(() => this.solicitudes.next(solicitud));
  }
}
