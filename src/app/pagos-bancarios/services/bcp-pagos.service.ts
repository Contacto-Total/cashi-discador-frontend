import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BcpArchivoResultado, BcpPagoManualRequest, BcpPagoManualResponse } from '../models/bcp-archivo.model';

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
}
