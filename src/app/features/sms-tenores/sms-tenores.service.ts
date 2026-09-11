import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ConteoTenor,
  ExportableTenor,
  GrupoTenores,
  PreviewTenor,
  RespuestaApi,
  Tenor,
  TenorGuardar,
  VariablesSubcartera
} from './sms-tenores.models';

/** Cliente de /api/sms-tenores. Las respuestas vienen envueltas en { success, data }. */
@Injectable({ providedIn: 'root' })
export class SmsTenoresService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/sms-tenores`;

  listar(): Observable<GrupoTenores[]> {
    return this.http.get<RespuestaApi<GrupoTenores[]>>(`${this.url}/lista`).pipe(map(r => r.data));
  }

  variables(idInquilino: number, idCartera: number, idSubcartera: number): Observable<VariablesSubcartera> {
    const params = new HttpParams()
      .set('idInquilino', idInquilino)
      .set('idCartera', idCartera)
      .set('idSubcartera', idSubcartera);
    return this.http.get<RespuestaApi<VariablesSubcartera>>(`${this.url}/variables`, { params }).pipe(map(r => r.data));
  }

  /** Una consulta por llamada: no conviene lanzarla con cada cambio del formulario. */
  contar(borrador: TenorGuardar): Observable<ConteoTenor> {
    return this.http.post<RespuestaApi<ConteoTenor>>(`${this.url}/conteo`, borrador).pipe(map(r => r.data));
  }

  preview(borrador: TenorGuardar, desde: number): Observable<PreviewTenor> {
    const params = new HttpParams().set('desde', desde).set('limite', 1);
    return this.http.post<RespuestaApi<PreviewTenor>>(`${this.url}/preview`, borrador, { params }).pipe(map(r => r.data));
  }

  obtener(id: number): Observable<Tenor> {
    return this.http.get<RespuestaApi<Tenor>>(`${this.url}/tenor/${id}`).pipe(map(r => r.data));
  }

  crear(tenor: TenorGuardar): Observable<Tenor> {
    return this.http.post<RespuestaApi<Tenor>>(`${this.url}/tenor`, tenor).pipe(map(r => r.data));
  }

  actualizar(id: number, tenor: TenorGuardar): Observable<Tenor> {
    return this.http.put<RespuestaApi<Tenor>>(`${this.url}/tenor/${id}`, tenor).pipe(map(r => r.data));
  }

  archivar(id: number): Observable<Tenor> {
    return this.http.post<RespuestaApi<Tenor>>(`${this.url}/tenor/${id}/archivar`, null).pipe(map(r => r.data));
  }

  recalcular(id: number): Observable<Tenor> {
    return this.http.post<RespuestaApi<Tenor>>(`${this.url}/tenor/${id}/recalcular`, null).pipe(map(r => r.data));
  }

  /** Conviene preguntar antes de descargar: si no se puede, el motivo llega como JSON y no dentro de un blob. */
  exportable(id: number): Observable<ExportableTenor> {
    return this.http.get<RespuestaApi<ExportableTenor>>(`${this.url}/tenor/${id}/exportable`).pipe(map(r => r.data));
  }

  descargar(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/tenor/${id}/export`, { responseType: 'blob' });
  }
}

/** Mensaje que manda el backend en un error, o el texto por defecto si no hay. */
export function mensajeDeError(err: unknown, porDefecto: string): string {
  if (err instanceof HttpErrorResponse && err.error && typeof err.error === 'object' && 'message' in err.error) {
    const mensaje = (err.error as { message?: string }).message;
    if (mensaje) {
      return mensaje;
    }
  }
  return porDefecto;
}

/** Descarga un blob en el navegador con el nombre dado. */
export function guardarArchivo(blob: Blob, nombre: string): void {
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

/** Token de una etiqueta, con la misma regla que el backend: "LTD combinado" es LTD_COMBINADO. */
export function tokenDe(etiqueta: string): string {
  return etiqueta
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/** Número entero con espacio fino entre miles (1 340); raya si no hay valor. */
export function miles(valor: number | null | undefined): string {
  if (valor === null || valor === undefined) {
    return '—';
  }
  return Math.round(valor).toLocaleString('en-US').replace(/,/g, ' ');
}

/** Nombre del Excel de un tenor, con la fecha del día. */
export function nombreArchivoTenor(id: number): string {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `tenor_${id}_${hoy.getFullYear()}-${mes}-${dia}.xlsx`;
}
