import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AlcanceService } from '../services/alcance.service';
import { AuthService } from '../services/auth.service';

/** Rutas del servicio de cartas: las de acuerdo y de no adeudo, y las de cesión. */
const CARTAS = `${environment.webServiceUrl}/cartas`;

/** ¿La ruta es del servicio de cartas? */
export function esDeCartas(url: string): boolean {
  return url.startsWith(CARTAS);
}

/** El documento del cliente que nombra el pedido: en la ruta, en los parámetros o en el cuerpo. */
export function documentoDe(req: HttpRequest<unknown>): string | null {
  const enRuta = /\/datos-cliente\/([^/?#]+)/.exec(req.url);
  if (enRuta) {
    return decodeURIComponent(enRuta[1]);
  }
  const consulta = new URLSearchParams(req.urlWithParams.split('?')[1] ?? '');
  const cuerpo = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
  const documento = consulta.get('dni') ?? consulta.get('documento') ?? cuerpo['dni'] ?? cuerpo['documento'];
  return documento == null || String(documento).trim() === '' ? null : String(documento).trim();
}

/** Envía el pedido si la consulta de permiso responde que sí; si no, lo rechaza sin enviarlo. */
export function enviarSiPuede(
  permiso: Observable<boolean>, req: HttpRequest<unknown>, next: HttpHandlerFn, motivo: string
): Observable<HttpEvent<unknown>> {
  return permiso.pipe(
    switchMap(puede => puede
      ? next(req)
      : throwError(() => new HttpErrorResponse({
          status: 403,
          statusText: 'Forbidden',
          url: req.url,
          error: { message: motivo }
        })))
  );
}

/**
 * No deja pedir al servicio de cartas un cliente que no es de las subcarteras asignadas al
 * usuario: antes de enviar el pedido pregunta por el documento, y si no le corresponde lo
 * rechaza sin enviarlo. Se hace aquí porque ese servicio no sabe quién pide. Al administrador no
 * se le acota, y un pedido que no nombra a ningún cliente pasa tal cual.
 */
export const alcanceDocumentoInterceptor: HttpInterceptorFn = (req, next) => {
  const usuario = inject(AuthService).getCurrentUser();
  if (!esDeCartas(req.url) || !usuario || usuario.role === 'ADMIN') {
    return next(req);
  }
  const documento = documentoDe(req);
  if (!documento) {
    return next(req);
  }

  return enviarSiPuede(inject(AlcanceService).puedeDocumento(documento), req, next,
    'Ese cliente no es de una subcartera asignada a tu usuario.');
};
