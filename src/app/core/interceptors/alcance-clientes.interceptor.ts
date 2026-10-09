import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { AlcanceService } from '../services/alcance.service';
import { AuthService } from '../services/auth.service';

/** Rutas del servicio de clientes, por las dos entradas con que lo llama el front. */
const CLIENTES = /\/(api\/customers|tipificacion\/v1\/customers)(\/|$)/;

/** ¿La ruta es del servicio de clientes? */
export function esDeClientes(url: string): boolean {
  return CLIENTES.test(url.split('?')[0]);
}

/**
 * Lo que queda de una respuesta del servicio de clientes para quien tiene esas subcarteras. De
 * una lista, los clientes que están en ellas. De un cliente suelto, él mismo, o undefined si no
 * es suyo. Un objeto que no es un cliente (no trae subcartera) pasa tal cual.
 */
export function recortarClientes(cuerpo: unknown, subcarteras: ReadonlySet<number>): unknown {
  const esMio = (fila: any) => fila?.subPortfolioId != null && subcarteras.has(Number(fila.subPortfolioId));

  if (Array.isArray(cuerpo)) {
    return cuerpo.filter(esMio);
  }
  if (cuerpo && typeof cuerpo === 'object' && 'subPortfolioId' in cuerpo) {
    return esMio(cuerpo) ? cuerpo : undefined;
  }
  return cuerpo;
}

/**
 * Deja en las respuestas del servicio de clientes solo los de las subcarteras asignadas al
 * usuario: las búsquedas devuelven menos filas y un cliente ajeno pedido por su id o documento
 * llega como no encontrado. Se hace aquí porque ese servicio no sabe quién pide. Al administrador
 * no se le acota.
 */
export const alcanceClientesInterceptor: HttpInterceptorFn = (req, next) => {
  const usuario = inject(AuthService).getCurrentUser();
  if (req.method !== 'GET' || !esDeClientes(req.url) || !usuario || usuario.role === 'ADMIN') {
    return next(req);
  }

  return inject(AlcanceService).mio().pipe(
    switchMap(mio => next(req).pipe(
      map(evento => {
        if (!(evento instanceof HttpResponse) || mio.todo) {
          return evento;
        }
        const cuerpo = recortarClientes(evento.body, mio.subcarteras);
        if (cuerpo === undefined) {
          throw new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url });
        }
        return evento.clone({ body: cuerpo });
      })
    ))
  );
};
