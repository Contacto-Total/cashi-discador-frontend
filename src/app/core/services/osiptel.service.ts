import { Injectable } from '@angular/core';

/**
 * Modelo NO-ortogonal V17+:
 * el estado Osiptel vive en metodos_contacto.estado_osiptel y viaja en el
 * JSON del cliente como `contactMethod.estadoOsiptel`. Este service ya NO
 * hace HTTP — es un helper puro de presentacion que clasifica el string
 * en CSS classes y labels para los badges.
 */
export type EstadoOsiptel = 'SIN_VALIDAR' | 'VALIDADO' | 'NO_VALIDADO';

export interface OsiptelBadge {
  label: string;
  /** Clases Tailwind para el span del badge. */
  classes: string;
  tooltip: string;
}

@Injectable({ providedIn: 'root' })
export class OsiptelService {
  /**
   * Mapea el estado_osiptel del backend a la presentacion visual.
   * Si el estado es SIN_VALIDAR o undefined, devuelve null (no se muestra badge).
   */
  badgeFor(estado: EstadoOsiptel | string | undefined | null): OsiptelBadge | null {
    switch (estado) {
      case 'VALIDADO':
        return {
          label: 'Titular ✓',
          tooltip: 'Validado en Osiptel: el cliente es titular de esta linea',
          classes:
            'inline-block mt-0.5 px-1 py-0 text-[0.5rem] font-bold rounded ' +
            'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ' +
            'border border-emerald-300 dark:border-emerald-600/50',
        };
      case 'NO_VALIDADO':
        return {
          label: 'No titular',
          tooltip: 'Validado en Osiptel: la linea NO esta registrada al cliente',
          classes:
            'inline-block mt-0.5 px-1 py-0 text-[0.5rem] font-bold rounded ' +
            'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ' +
            'border border-amber-300 dark:border-amber-600/50',
        };
      default:
        // SIN_VALIDAR o desconocido -> sin badge
        return null;
    }
  }
}
