import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CampaignContingenciaService } from './campaign-contingencia.service';

/** La pantalla de contingencia solo abre si un ADMIN se la habilitó al usuario; si no, vuelve a Gestión de campañas. */
export const contingenciaGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(CampaignContingenciaService).mio().pipe(
    map(r => r.habilitado ? true : router.parseUrl('/admin/campaigns')),
    catchError(() => of(router.parseUrl('/admin/campaigns'))),
  );
};
