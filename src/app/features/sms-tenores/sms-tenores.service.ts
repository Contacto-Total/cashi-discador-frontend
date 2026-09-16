import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ContactoControl,
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

  /** Devuelve un tenor archivado a la lista de activos; el backend recalcula su conteo. */
  desarchivar(id: number): Observable<Tenor> {
    return this.http.post<RespuestaApi<Tenor>>(`${this.url}/tenor/${id}/desarchivar`, null).pipe(map(r => r.data));
  }

  /** Borra el tenor, activo o archivado. No se puede deshacer. */
  eliminar(id: number): Observable<void> {
    return this.http.delete<RespuestaApi<unknown>>(`${this.url}/tenor/${id}`).pipe(map(() => undefined));
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

  contactosControl(): Observable<ContactoControl[]> {
    return this.http.get<RespuestaApi<ContactoControl[]>>(`${this.url}/contactos-control`).pipe(map(r => r.data));
  }

  crearContactoControl(contacto: ContactoControl): Observable<ContactoControl> {
    return this.http.post<RespuestaApi<ContactoControl>>(`${this.url}/contactos-control`, contacto).pipe(map(r => r.data));
  }

  /** Corrige nombre, documento, celular y correo. */
  actualizarContactoControl(id: number, contacto: ContactoControl): Observable<ContactoControl> {
    return this.http.put<RespuestaApi<ContactoControl>>(`${this.url}/contactos-control/${id}`, contacto).pipe(map(r => r.data));
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

export const MAX_NOMBRE_ARCHIVO = 80;

/** Letras sin tilde, dígitos, guion y guion bajo; sin separador al principio ni al final. Igual que el backend. */
const NOMBRE_ARCHIVO_VALIDO = /^[A-Za-z0-9](?:[A-Za-z0-9_-]*[A-Za-z0-9])?$/;

/** Correo con forma válida, con la misma regla que usa el backend para filtrar. */
export const CORREO_VALIDO = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+([.][A-Za-z0-9-]+)*[.][A-Za-z]{2,}$/;

/**
 * Nombre de archivo propuesto a partir del nombre del tenor: minúsculas, sin tildes y
 * con guion bajo. "SMS - Tramo 3 - Saldo Mora" da sms_tramo_3_saldo_mora. Misma regla
 * que TenorService.sugerirNombreArchivo.
 */
export function sugerirNombreArchivo(nombre: string): string {
  let base = (nombre ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  if (base.length > MAX_NOMBRE_ARCHIVO) {
    base = base.slice(0, MAX_NOMBRE_ARCHIVO).replace(/_+$/, '');
  }
  return base || 'tenor';
}

/** Por qué el nombre de archivo no sirve, o nulo si sirve. */
export function problemaNombreArchivo(nombre: string): string | null {
  const limpio = nombre.trim();
  if (!limpio) {
    return 'Escribe el nombre del archivo.';
  }
  if (limpio.length > MAX_NOMBRE_ARCHIVO) {
    return `No puede pasar de ${MAX_NOMBRE_ARCHIVO} caracteres.`;
  }
  if (!NOMBRE_ARCHIVO_VALIDO.test(limpio)) {
    return 'Solo letras sin tilde, números, guion (-) y guion bajo (_), sin espacios ni guion al inicio o al final.';
  }
  return null;
}

/**
 * Nombre final del Excel: el configurado, la fecha y la extensión, con el separador
 * que usa el nombre (el último si usa los dos; guion bajo si no usa ninguno). Solo para
 * la vista previa: el archivo se descarga con el que calcula el backend en hora de Lima.
 */
export function nombreArchivoConFecha(base: string, fecha: Date = new Date()): string {
  const limpio = base.trim();
  const separador = limpio.lastIndexOf('-') > limpio.lastIndexOf('_') ? '-' : '_';
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${limpio}${separador}${dia}${separador}${mes}${separador}${fecha.getFullYear()}.xlsx`;
}
