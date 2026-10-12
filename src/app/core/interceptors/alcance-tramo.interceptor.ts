import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlcanceService } from '../services/alcance.service';
import { AuthService } from '../services/auth.service';
import { enviarSiPuede } from './alcance-documento.interceptor';

/** Rutas del servicio que arma las bases de campaña por tramo. */
const CAMPANIA = `${environment.webServiceUrl}/campania`;

/** ¿El pedido arma una base de campaña? Las lecturas de ese servicio no nombran ningún tramo. */
export function armaCampania(req: HttpRequest<unknown>): boolean {
  return req.method === 'POST' && req.url.startsWith(CAMPANIA);
}

/** El tramo para el que se pide la base, o vacío si el pedido no lo nombra. */
export function tramoDe(req: HttpRequest<unknown>): string {
  const cuerpo = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
  return typeof cuerpo['campaignName'] === 'string' ? cuerpo['campaignName'].trim() : '';
}

/**
 * No deja pedir la base de campaña de un tramo que no es de las subcarteras asignadas al usuario:
 * antes de enviar el pedido pregunta por el tramo, y si no le corresponde lo rechaza sin
 * enviarlo. Se hace aquí porque ese servicio no sabe quién pide. Un pedido que no nombra el tramo
 * tampoco se envía. Al administrador no se le acota.
 */
export const alcanceTramoInterceptor: HttpInterceptorFn = (req, next) => {
  const usuario = inject(AuthService).getCurrentUser();
  if (!armaCampania(req) || !usuario || usuario.role === 'ADMIN') {
    return next(req);
  }
  const tramo = tramoDe(req);
  const permiso = tramo ? inject(AlcanceService).puedeTramo(tramo) : of(false);
  return enviarSiPuede(permiso, req, next, 'Ese tramo no es de una subcartera asignada a tu usuario.');
};
