import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface HistorialLlamadaDTO {
  idLlamada: number;
  uuidLlamada: string;
  anexoDestino: string;
  anexoAgente: string;
  nombreAgente: string;
  fechaInicioLlamada: string;
  fechaRinging: string;
  fechaFinLlamada: string;
  duracionTotalSegundos: number;
  resultadoFinal: string;
  idCampana: number;
  nombreCampana: string;
  idContacto: number;
  documentoCliente: string;
  nombreCliente: string;
  telefonoContacto: string;
  idHistorial: number;
  estadoAnterior: string;
  estadoNuevo: string;
  timestampCambio: string;
  duracionEstadoAnteriorMs: number;
  duracionEstadoAnteriorFormato: string;
  detalle: string;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;
  // Tiempos desglosados
  tiempoSenalizacionMs: number;
  tiempoTimbradoMs: number;
  tiempoSenalizacionFormato: string;
  tiempoTimbradoFormato: string;
}

export interface ResumenMetricas {
  totalLlamadas: number;
  totalTransiciones: number;
  llamadasConectadas: number;
  llamadasNoContestadas: number;
  llamadasFallidas: number;
  llamadasAbandonadas: number;
  duracionPromedioSegundos: number;
  duracionMaximaSegundos: number;
  tiempoPromedioEnColaMs: number;
  tiempoPromedioMarcandoMs: number;
}

export interface ReporteResponse {
  data: HistorialLlamadaDTO[];
  metricas: ResumenMetricas;
  total: number;
  page: number;
  size: number;
  totalPages: number;
  fechaDesde: string;
  fechaHasta: string;
}

@Injectable({
  providedIn: 'root'
})
export class HistorialLlamadasReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/historial-llamadas`;

  constructor(private http: HttpClient) {}

  getReporte(
    fechaDesde?: string,
    fechaHasta?: string,
    idCampana?: number,
    idCartera?: number,
    idSubcartera?: number,
    estadoFinal?: string,
    page: number = 0,
    size: number = 50
  ): Observable<ReporteResponse> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCampana) params = params.set('idCampana', idCampana.toString());
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (estadoFinal) params = params.set('estadoFinal', estadoFinal);
    params = params.set('page', page.toString());
    params = params.set('size', size.toString());

    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde?: string,
    fechaHasta?: string,
    idCampana?: number,
    idCartera?: number,
    idSubcartera?: number,
    estadoFinal?: string
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCampana) params = params.set('idCampana', idCampana.toString());
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (estadoFinal) params = params.set('estadoFinal', estadoFinal);

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }

  getMetricas(
    fechaDesde?: string,
    fechaHasta?: string,
    idCampana?: number,
    idCartera?: number,
    idSubcartera?: number,
    estadoFinal?: string
  ): Observable<ResumenMetricas> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCampana) params = params.set('idCampana', idCampana.toString());
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (estadoFinal) params = params.set('estadoFinal', estadoFinal);

    return this.http.get<ResumenMetricas>(`${this.baseUrl}/metricas`, { params });
  }
}
