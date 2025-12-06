import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ComprobanteUploadResponse,
  ComprobanteUploadRequest,
  AdjuntoGestion
} from '../models/comprobante.model';

/**
 * Servicio para gestionar comprobantes de pago
 */
@Injectable({
  providedIn: 'root'
})
export class ComprobanteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/v2/comprobantes`;

  /**
   * Sube un comprobante de pago y lo valida con OCR
   * @param file Archivo de imagen del comprobante
   * @param request Datos de la solicitud
   */
  uploadComprobante(
    file: File,
    request: ComprobanteUploadRequest
  ): Observable<ComprobanteUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idCuota', request.idCuota.toString());
    formData.append('idAgente', request.idAgente.toString());

    if (request.montoEsperado !== undefined) {
      formData.append('montoEsperado', request.montoEsperado.toString());
    }
    if (request.documentoEsperado) {
      formData.append('documentoEsperado', request.documentoEsperado);
    }
    if (request.idGestion !== undefined) {
      formData.append('idGestion', request.idGestion.toString());
    }
    if (request.descripcion) {
      formData.append('descripcion', request.descripcion);
    }
    if (request.validarConOcr !== undefined) {
      formData.append('validarConOcr', request.validarConOcr.toString());
    }

    return this.http.post<ComprobanteUploadResponse>(
      `${this.baseUrl}/upload`,
      formData
    );
  }

  /**
   * Obtiene los comprobantes asociados a una cuota
   * @param cuotaId ID de la cuota
   */
  getComprobantesByCuota(cuotaId: number): Observable<AdjuntoGestion[]> {
    return this.http.get<AdjuntoGestion[]>(`${this.baseUrl}/cuota/${cuotaId}`);
  }

  /**
   * Asocia un comprobante existente a una gestión
   * @param uuid UUID del comprobante
   * @param idGestion ID de la gestión
   */
  asociarAGestion(uuid: string, idGestion: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${uuid}/asociar-gestion/${idGestion}`,
      {}
    );
  }
}
