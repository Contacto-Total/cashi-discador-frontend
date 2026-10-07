import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { AlcanceService } from '../services/alcance.service';
import { AuthService } from '../services/auth.service';

type Nivel = 'clientes' | 'carteras' | 'subcarteras';

/**
 * Listas con las que las pantallas arman el selector Cliente › Cartera › Subcartera, y qué nivel
 * trae cada una. Se reconocen por la ruta y no por el servicio porque varias pantallas las piden
 * por su cuenta.
 */
const LISTAS: ReadonlyArray<readonly [RegExp, Nivel]> = [
  [/\/system-config\/tenants$/, 'clientes'],
  [/\/comisiones\/inquilinos$/, 'clientes'],
  [/\/system-config\/tenants\/\d+\/portfolios$/, 'carteras'],
  [/\/system-config\/portfolios$/, 'carteras'],
  [/\/comisiones\/carteras$/, 'carteras'],
  [/\/portfolios\/\d+\/subportfolios$/, 'subcarteras'],
  [/\/subportfolios(\/by-portfolio\/\d+(\/active)?|\/by-tenant\/\d+)?$/, 'subcarteras'],
  [/\/comisiones\/subcarteras$/, 'subcarteras'],
  [/\/monitoreo\/subcarteras$/, 'subcarteras']
];

/** El nivel que trae una lista del catálogo, o undefined si la ruta no es una de ellas. */
export function nivelDeLista(url: string): Nivel | undefined {
  const ruta = url.split('?')[0];
  return LISTAS.find(([patron]) => patron.test(ruta))?.[1];
}

/**
 * Deja en esas listas solo lo asignado al usuario, de modo que el selector de ámbito de cualquier
 * pantalla ofrezca únicamente sus clientes, carteras y subcarteras. Se hace aquí porque el servicio
 * del catálogo no sabe quién pide. Al administrador no se le acota.
 */
export const alcanceCatalogoInterceptor: HttpInterceptorFn = (req, next) => {
  const nivel = req.method === 'GET' ? nivelDeLista(req.url) : undefined;
  const usuario = inject(AuthService).getCurrentUser();
  if (!nivel || !usuario || usuario.role === 'ADMIN') {
    return next(req);
  }

  return inject(AlcanceService).mio().pipe(
    switchMap(mio => next(req).pipe(
      map(evento => evento instanceof HttpResponse && Array.isArray(evento.body) && !mio.todo
        ? evento.clone({ body: evento.body.filter(fila => mio[nivel].has(Number(fila?.id))) })
        : evento)
    ))
  );
};
