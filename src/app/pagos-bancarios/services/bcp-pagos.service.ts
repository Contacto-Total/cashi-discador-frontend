import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BcpArchivoResultado,
  BcpPagoManualRequest,
  BcpPagoManualResponse,
  BcpPagoManualFiltros,
  BcpPagoManualListResponse
} from '../models/bcp-archivo.model';

@Injectable({
  providedIn: 'root'
})
export class BcpPagosService {

  private readonly baseUrl = `${environment.gatewayUrl}/pagos-bcp`;

  constructor(private http: HttpClient) {}

  /**
   * Carga y procesa un archivo CREP del BCP
   * @param file Archivo TXT a procesar
   * @returns Resultado con cabecera y detalles de pagos
   */
  cargarArchivo(file: File): Observable<BcpArchivoResultado> {
    const formData = new FormData();
    formData.append('file', file);

    console.log('[BCP] Cargando archivo:', file.name);

    return this.http.post<BcpArchivoResultado>(`${this.baseUrl}/cargar-archivo`, formData);
  }

  /**
   * Registra un pago de forma manual
   * @param pago Datos del pago manual
   * @returns Resultado del registro
   */
  registrarPagoManual(pago: BcpPagoManualRequest): Observable<BcpPagoManualResponse> {
    console.log('[BCP] Registrando pago manual:', pago);
    return this.http.post<BcpPagoManualResponse>(`${this.baseUrl}/registrar-manual`, pago);
  }

  /**
   * Verifica el estado del servicio
   */
  verificarEstado(): Observable<{ servicio: string; estado: string; version: string }> {
    return this.http.get<{ servicio: string; estado: string; version: string }>(`${this.baseUrl}/status`);
  }

  // ============== PAGOS MANUALES ==============

  /**
   * Lista pagos manuales con filtros y paginación
   */
  listarPagosManuales(filtros: BcpPagoManualFiltros = {}): Observable<BcpPagoManualListResponse> {
    let params = new HttpParams();

    if (filtros.documento) params = params.set('documento', filtros.documento);
    if (filtros.banco) params = params.set('banco', filtros.banco);
    if (filtros.medioAtencion) params = params.set('medioAtencion', filtros.medioAtencion);
    if (filtros.fechaDesde) params = params.set('fechaDesde', filtros.fechaDesde);
    if (filtros.fechaHasta) params = params.set('fechaHasta', filtros.fechaHasta);
    if (filtros.page) params = params.set('page', filtros.page.toString());
    if (filtros.size) params = params.set('size', filtros.size.toString());

    console.log('[BCP] Listando pagos manuales con filtros:', filtros);
    return this.http.get<BcpPagoManualListResponse>(`${this.baseUrl}/manuales`, { params });
  }

  /**
   * Actualiza un pago manual
   */
  actualizarPagoManual(id: number, pago: BcpPagoManualRequest): Observable<BcpPagoManualResponse> {
    console.log('[BCP] Actualizando pago manual ID:', id, pago);
    return this.http.put<BcpPagoManualResponse>(`${this.baseUrl}/manuales/${id}`, pago);
  }

  /**
   * Elimina un pago manual
   */
  eliminarPagoManual(id: number): Observable<BcpPagoManualResponse> {
    console.log('[BCP] Eliminando pago manual ID:', id);
    return this.http.delete<BcpPagoManualResponse>(`${this.baseUrl}/manuales/${id}`);
  }
}
