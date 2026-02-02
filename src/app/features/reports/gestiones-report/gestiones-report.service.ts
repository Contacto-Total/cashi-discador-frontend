import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReporteGestionesDTO {
  id: number;
  idTenant: number;
  nombreTenant: string;
  idCampana: number;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;
  idCliente: number;
  nombreCliente: string;
  documentoCliente: string;
  idAgente: number;
  nombreAgente: string;
  idLlamada: number;
  telefonoContacto: string;
  fechaGestion: string;
  fechaActualizacion: string;
  estadoGestion: string;
  metodoContacto: string;
  canalContacto: string;
  observaciones: string;
  idTipificacion: number;
  rutaNivel1: string;
  rutaNivel2: string;
  rutaNivel3: string;
  rutaNivel4: string;
  rutaJerarquia: string;
  montoBase: number;
  montoPromesa: number;
  totalCuotas: number;
  estadoPago: string;
  fechaPagoReal: string;
  montoPagadoReal: number;
  esContinuidad: boolean;
  promesaOrigenUuid: string;
  motivoAnulacion: string;
  fechaAnulacion: string;
  nombreUsuarioAnulo: string;
  esExcepcionPrimeraCuota: boolean;
  fechaAprobacionExcepcion: string;
  nombreUsuarioAprobador: string;
}

export interface ResumenMetricas {
  totalGestiones: number;
  gestionesCompletadas: number;
  gestionesSinContacto: number;
  gestionesAnuladas: number;
  montoTotalPromesas: number;
  montoTotalPagado: number;
  montoTotalPendiente: number;
  totalPromesas: number;
  promesasPagadas: number;
  promesasPendientes: number;
  promesasVencidas: number;
}

export interface ReporteResponse {
  data: ReporteGestionesDTO[];
  metricas: ResumenMetricas;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class GestionesReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/gestiones`;

  constructor(private http: HttpClient) {}

  getReporte(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
    idAgente?: number,
    idCampana?: number,
    estadoGestion?: string
  ): Observable<ReporteResponse> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (idAgente) params = params.set('idAgente', idAgente.toString());
    if (idCampana) params = params.set('idCampana', idCampana.toString());
    if (estadoGestion) params = params.set('estadoGestion', estadoGestion);

    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde?: string,
    fechaHasta?: string,
    idCartera?: number,
    idSubcartera?: number,
    idAgente?: number,
    idCampana?: number,
    estadoGestion?: string
  ): Observable<Blob> {
    let params = new HttpParams();

    if (fechaDesde) params = params.set('fechaDesde', fechaDesde);
    if (fechaHasta) params = params.set('fechaHasta', fechaHasta);
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    if (idAgente) params = params.set('idAgente', idAgente.toString());
    if (idCampana) params = params.set('idCampana', idCampana.toString());
    if (estadoGestion) params = params.set('estadoGestion', estadoGestion);

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }
}
