import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AprobarArchivoBcpRequest,
  AprobarArchivoBcpResponse,
  BcpArchivoCargaRequest,
  BcpArchivoResultado,
  BcpPagoManualRequest,
  BcpPagoManualResponse,
  BcpPagoManualFiltros,
  BcpPagoManualListResponse,
  ResumenConciliacionCliente,
  ResumenConciliacionClienteRequest,
  ResultadoConciliacion
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
  cargarArchivo(file: File, request: BcpArchivoCargaRequest): Observable<BcpArchivoResultado> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', request.tenantId.toString());
    formData.append('carteraId', request.carteraId.toString());
    formData.append('subcarteraId', request.subcarteraId.toString());

    if (request.toleranciaMonto !== undefined) {
      formData.append('toleranciaMonto', request.toleranciaMonto.toString());
    }

    console.log('[BCP] Cargando archivo:', file.name);

    return this.http.post<BcpArchivoResultado>(`${this.baseUrl}/cargar-archivo`, formData);
  }

  aprobarArchivo(request: AprobarArchivoBcpRequest): Observable<AprobarArchivoBcpResponse> {
    console.log('[BCP] Aprobando archivo:', request.nombreArchivo);
    return this.http.post<AprobarArchivoBcpResponse>(`${this.baseUrl}/aprobar-archivo`, request);
  }

  obtenerResumenConciliacionCliente(documento: string, request: ResumenConciliacionClienteRequest): Observable<ResumenConciliacionCliente> {
    const params = new HttpParams()
      .set('tenantId', request.tenantId.toString())
      .set('carteraId', request.carteraId.toString())
      .set('subcarteraId', request.subcarteraId.toString());

    return this.http.get<ResumenConciliacionCliente>(`${this.baseUrl}/clientes/${encodeURIComponent(documento)}/resumen-conciliacion`, { params });
  }

  /**
   * Carga y procesa un archivo Excel de Financiera OH
   * @param file Archivo Excel a procesar
   * @returns Resultado con detalles de pagos
   */
  cargarArchivoOh(file: File, request: BcpArchivoCargaRequest): Observable<BcpArchivoResultado> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', request.tenantId.toString());
    formData.append('carteraId', request.carteraId.toString());
    formData.append('subcarteraId', request.subcarteraId.toString());

    if (request.toleranciaMonto !== undefined) {
      formData.append('toleranciaMonto', request.toleranciaMonto.toString());
    }

    console.log('[OH] Cargando archivo Excel:', file.name);

    return this.http.post<BcpArchivoResultado>(`${this.baseUrl}/cargar-archivo-oh`, formData);
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

  // ============== CONFIGURACIÓN DE CONCILIACIÓN ==============

  /**
   * Obtiene la configuración actual de conciliación
   */
  obtenerConfiguracionConciliacion(): Observable<{ toleranciaMonto: number }> {
    console.log('[BCP] Obteniendo configuración de conciliación');
    return this.http.get<{ toleranciaMonto: number }>(`${this.baseUrl}/conciliacion/config`);
  }

  /**
   * Actualiza la tolerancia de monto para conciliación
   * @param tolerancia Valor en soles (ej: 1.00 = ±1 sol de tolerancia)
   */
  actualizarToleranciaMonto(tolerancia: number): Observable<{ exitoso: boolean; mensaje: string; toleranciaMonto?: number }> {
    console.log('[BCP] Actualizando tolerancia de monto a:', tolerancia);
    const params = new HttpParams().set('tolerancia', tolerancia.toString());
    return this.http.put<{ exitoso: boolean; mensaje: string; toleranciaMonto?: number }>(
      `${this.baseUrl}/conciliacion/config/tolerancia-monto`,
      null,
      { params }
    );
  }

  // ============== CONCILIACIÓN MANUAL ==============

  /**
   * Ejecuta la conciliación completa: pagos pendientes + re-intento de pagos "por fuera"
   */
  ejecutarConciliacionCompleta(): Observable<ResultadoConciliacion> {
    console.log('[BCP] Ejecutando conciliación completa...');
    return this.http.post<ResultadoConciliacion>(`${this.baseUrl}/conciliar-completo`, null);
  }

  // ============== REPORTES DE CONCILIACIÓN ==============

  /**
   * Descarga el reporte de conciliación en formato Excel por fecha o rango de fechas
   * @param fechaInicio Fecha de inicio (formato YYYY-MM-DD)
   * @param fechaFin Fecha fin opcional (formato YYYY-MM-DD)
   */
  descargarReporteConciliacionPorFecha(
    fechaInicio: string,
    tenantId: number,
    carteraId: number,
    subcarteraId: number,
    fechaFin?: string
  ): Observable<HttpResponse<Blob>> {
    console.log('[BCP] Descargando reporte de conciliación por fecha:', {
      fechaInicio,
      fechaFin,
      tenantId,
      carteraId,
      subcarteraId
    });
    return this.descargarArchivoExcelConFiltros('reporte-conciliacion/excel', fechaInicio, tenantId, carteraId, subcarteraId, fechaFin);
  }

  // /**
  //  * Descarga el reporte resumido de conciliación en formato Excel por fecha o rango de fechas
  //  * @param fechaInicio Fecha de inicio (formato YYYY-MM-DD)
  //  * @param fechaFin Fecha fin opcional (formato YYYY-MM-DD)
  //  */
  // descargarReporteConciliacionResumenPorFecha(
  //   fechaInicio: string,
  //   tenantId: number,
  //   carteraId: number,
  //   subcarteraId: number,
  //   fechaFin?: string
  // ): Observable<HttpResponse<Blob>> {
  //   console.log('[BCP] Descargando reporte resumido de conciliación por fecha:', {
  //     fechaInicio,
  //     fechaFin,
  //     tenantId,
  //     carteraId,
  //     subcarteraId
  //   });
  //   return this.descargarArchivoExcelConFiltros('reporte-conciliacion-resumen/excel', fechaInicio, tenantId, carteraId, subcarteraId, fechaFin);
  // }

  /**
   * Expone el helper de descarga para reutilizar el mismo patrón en la UI
   */
  procesarDescargaArchivo(response: HttpResponse<Blob>, nombrePorDefecto: string): void {
    this.procesarDescargaBlob(response, nombrePorDefecto);
  }

  private descargarArchivoExcel(endpoint: string, fechaInicio: string, fechaFin?: string): Observable<HttpResponse<Blob>> {
    let params = new HttpParams().set('fechaInicio', fechaInicio);
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      params,
      responseType: 'blob',
      observe: 'response'
    });
  }

  private descargarArchivoExcelConFiltros(
    endpoint: string,
    fechaInicio: string,
    tenantId: number,
    carteraId: number,
    subcarteraId: number,
    fechaFin?: string
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('tenantId', tenantId.toString())
      .set('carteraId', carteraId.toString())
      .set('subcarteraId', subcarteraId.toString());

    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get(`${this.baseUrl}/${endpoint}`, {
      params,
      responseType: 'blob',
      observe: 'response'
    });
  }

  /**
   * Procesa la descarga de un archivo blob
   */
  private procesarDescargaBlob(response: HttpResponse<Blob>, nombrePorDefecto: string): void {
    const blob = response.body;
    if (!blob) {
      console.error('[BCP] No se recibió el archivo');
      return;
    }

    // Extraer nombre del archivo del header Content-Disposition o usar uno por defecto
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = nombrePorDefecto;

    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '');
      }
    }

    // Crear enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();

    // Limpiar
    window.URL.revokeObjectURL(url);
  }
}
