import { Injectable, signal } from '@angular/core';

/**
 * Luz del estado que el Panel del asesor comparte con el menú: mientras el Panel está en pantalla,
 * el menú recibe arriba el mismo color y la misma entrada que las tarjetas.
 */
@Injectable({ providedIn: 'root' })
export class LuzEstadoService {
  /** Color del estado, o `null` si el Panel no está en pantalla. */
  readonly tono = signal<string | null>(null);
  /** Sube en cada cambio de estado; quien la pinta repite la entrada de la luz. */
  readonly entrada = signal(0);
}
