import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface VerificarPromesaResponse {
  tienePromesaPendiente: boolean;
  idGestion?: number;
}

export interface CartaGeneradaHistorial {
  id: number;
  idGestion: number;
  idCliente: number;
  idAgente: number;
  codigoPlantilla: string;
  fechaGeneracion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartaAcuerdoService {
  private apiUrl = `${environment.apiUrl}/cartas`;

  constructor(private http: HttpClient) {}

  /**
   * Verifica si un cliente tiene una promesa de pago pendiente
   */
  verificarPromesaPendiente(idCliente: number): Observable<VerificarPromesaResponse> {
    return this.http.get<VerificarPromesaResponse>(`${this.apiUrl}/verificar-promesa/${idCliente}`);
  }

  /**
   * Genera la carta de acuerdo automáticamente desde una gestión
   * Retorna el PDF como Blob
   */
  generarCarta(idGestion: number, idAgente: number): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/generar/${idGestion}?idAgente=${idAgente}`, null, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf'
      })
    });
  }

  /**
   * Obtiene el historial de cartas generadas para un cliente
   */
  obtenerHistorial(idCliente: number): Observable<CartaGeneradaHistorial[]> {
    return this.http.get<CartaGeneradaHistorial[]>(`${this.apiUrl}/historial/${idCliente}`);
  }

  /**
   * Descarga el PDF generado
   */
  descargarPdf(blob: Blob, nombreArchivo: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
