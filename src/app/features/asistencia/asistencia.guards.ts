import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AsistenciaService } from './asistencia.service';

/**
 * Control de Asistencia es de RR.HH. Una supervisora que llega por la URL va a
 * la vista de su equipo, que es la suya. Si el perfil no responde no se bloquea:
 * el backend ya rechaza lo que no le toca.
 */
export const rrhhGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(AsistenciaService).perfil().pipe(
    map(p => p.rrhh ? true : router.createUrlTree([p.supervisora ? '/asistencia-equipo' : '/'])),
    catchError(() => of(true))
  );
};
