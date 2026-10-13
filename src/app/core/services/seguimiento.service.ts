import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CoberturaSeguimiento,
  MiListaSeguimiento,
  SeguimientoPeriodo
} from '../models/seguimiento.model';

/**
 * Seguimiento por periodos. Reemplaza a la configuracion por subcartera que
 * usaba RecordatoriosService: ahora la lista sale de un periodo que el
 * supervisor activa, se guarda en BD y se reparte por round robin cada dia.
 *
 * RecordatoriosService sigue existiendo porque el flujo de llamada del asesor
 * (iniciar / siguiente / llamar-directo / completar) entra por los endpoints
 * viejos, que ya leen de estas tablas.
 */
@Injectable({ providedIn: 'root' })
export class SeguimientoService {

  private baseUrl = `${environment.apiUrl}/v2/seguimiento`;

  constructor(private http: HttpClient) {}

  // ==================== PERIODOS (supervisor) ====================

  listarPeriodos(idSubcartera?: number): Observable<SeguimientoPeriodo[]> {
    const params = idSubcartera ? `?idSubcartera=${idSubcartera}` : '';
    return this.http.get<SeguimientoPeriodo[]>(`${this.baseUrl}/periodos${params}`);
  }

  obtenerPeriodo(id: number): Observable<SeguimientoPeriodo> {
    return this.http.get<SeguimientoPeriodo>(`${this.baseUrl}/periodos/${id}`);
  }

  /**
   * El periodo que gobierna la subcartera ahora mismo.
   * El backend responde 204 si no hay ninguno activo: eso no es un error, es
   * que el supervisor todavia no lo encendio.
   */
  periodoActivo(idSubcartera: number): Observable<SeguimientoPeriodo | null> {
    return this.http.get<SeguimientoPeriodo>(
      `${this.baseUrl}/periodos/activo?idSubcartera=${idSubcartera}`,
      { observe: 'response' }
    ).pipe(
      map(resp => resp.status === 204 ? null : (resp.body ?? null)),
      catchError(() => of(null))
    );
  }

  crearPeriodo(periodo: SeguimientoPeriodo): Observable<SeguimientoPeriodo> {
    return this.http.post<SeguimientoPeriodo>(`${this.baseUrl}/periodos`, periodo);
  }

  /** Solo se puede editar en BORRADOR: el backend rechaza el resto. */
  actualizarPeriodo(id: number, cambios: SeguimientoPeriodo): Observable<SeguimientoPeriodo> {
    return this.http.put<SeguimientoPeriodo>(`${this.baseUrl}/periodos/${id}`, cambios);
  }

  /** Genera el padron y la lista de hoy. Es lo que enciende el seguimiento. */
  activarPeriodo(id: number): Observable<SeguimientoPeriodo> {
    return this.http.post<SeguimientoPeriodo>(`${this.baseUrl}/periodos/${id}/activar`, {});
  }

  cerrarPeriodo(id: number): Observable<SeguimientoPeriodo> {
    return this.http.post<SeguimientoPeriodo>(`${this.baseUrl}/periodos/${id}/cerrar`, {});
  }

  /** Rearma la lista de hoy a mano (si el job de las 08:00 no corrio). */
  regenerarListaDeHoy(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/periodos/${id}/regenerar-lista`, {});
  }

  cobertura(id: number, fecha?: string): Observable<CoberturaSeguimiento> {
    const params = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<CoberturaSeguimiento>(`${this.baseUrl}/periodos/${id}/cobertura${params}`);
  }

  bajaManual(id: number, documentos: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/periodos/${id}/baja-manual`, { documentos });
  }

  // ==================== LISTA DEL ASESOR ====================

  /**
   * Lo que le toca hoy al asesor. Devuelve null si su subcartera no tiene
   * periodo activo (204) o si falla la consulta: en los dos casos el dashboard
   * tiene que esconder el boton, no mostrar un error.
   */
  miLista(idAsesor: number, idSubcartera: number, incluirItems = true): Observable<MiListaSeguimiento | null> {
    return this.http.get<MiListaSeguimiento>(
      `${this.baseUrl}/mi-lista/${idAsesor}?idSubcartera=${idSubcartera}&incluirItems=${incluirItems}`,
      { observe: 'response' }
    ).pipe(
      map(resp => resp.status === 204 ? null : (resp.body ?? null)),
      catchError(() => of(null))
    );
  }

  /**
   * Suelta el item que el asesor tenia tomado sin trabajar.
   *
   * Hace falta al cancelar: si no se suelta, el cliente queda bloqueado hasta
   * que lo libere el reaper de los 30 minutos y nadie mas lo puede llamar.
   */
  soltarItem(idItem: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/items/${idItem}/soltar`, {});
  }
}
