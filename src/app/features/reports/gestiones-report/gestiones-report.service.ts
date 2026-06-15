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
  campoMontoOrigen: string;
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
  page: number;
  size: number;
  totalPages: number;
}

export interface AgenteGestion {
  id: number;
  nombre: string;
}

export interface TipificacionCatalogo {
  id: number;
  nombre: string;
  nivel: number;
  parentId: number | null;
}

export interface GestionesFiltros {
  fechaDesde?: string;
  fechaHasta?: string;
  idCartera?: number | null;
  idSubcartera?: number | null;
  idAgentes?: number[];
  idCampana?: number | null;
  documento?: string;
  telefono?: string;
  rutaNivel1?: string | null;
  rutaNivel2?: string | null;
  rutaNivel3?: string | null;
  gestionSistema?: string | null; // '' (todas) | 'EXCLUIR' (Call) | 'SOLO' (Progresivo/Predictivo) | 'EXTERNA' (vacío)
}

@Injectable({
  providedIn: 'root'
})
export class GestionesReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/gestiones`;

  constructor(private http: HttpClient) {}

  /** Construye los HttpParams comunes a partir de los filtros */
  private buildParams(f: GestionesFiltros): HttpParams {
    let params = new HttpParams();
    if (f.fechaDesde) params = params.set('fechaDesde', f.fechaDesde);
    if (f.fechaHasta) params = params.set('fechaHasta', f.fechaHasta);
    if (f.idCartera) params = params.set('idCartera', f.idCartera.toString());
    if (f.idSubcartera) params = params.set('idSubcartera', f.idSubcartera.toString());
    if (f.idCampana) params = params.set('idCampana', f.idCampana.toString());
    if (f.documento && f.documento.trim()) params = params.set('documento', f.documento.trim());
    if (f.telefono && f.telefono.trim()) params = params.set('telefono', f.telefono.trim());
    if (f.rutaNivel1) params = params.set('rutaNivel1', f.rutaNivel1);
    if (f.rutaNivel2) params = params.set('rutaNivel2', f.rutaNivel2);
    if (f.rutaNivel3) params = params.set('rutaNivel3', f.rutaNivel3);
    if (f.gestionSistema) params = params.set('gestionSistema', f.gestionSistema);
    if (f.idAgentes && f.idAgentes.length) {
      for (const id of f.idAgentes) {
        params = params.append('idAgentes', id.toString());
      }
    }
    return params;
  }

  getReporte(filtros: GestionesFiltros, page: number = 0, size: number = 50): Observable<ReporteResponse> {
    const params = this.buildParams(filtros)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ReporteResponse>(this.baseUrl, { params });
  }

  exportarExcel(filtros: GestionesFiltros): Observable<Blob> {
    const params = this.buildParams(filtros);
    return this.http.get(`${this.baseUrl}/excel`, { params, responseType: 'blob' });
  }

  /** Asesores con gestiones, acotados a proveedor/cartera/subcartera */
  getAgentes(idTenant?: number | null, idCartera?: number | null, idSubcartera?: number | null): Observable<AgenteGestion[]> {
    let params = new HttpParams();
    if (idTenant) params = params.set('idTenant', idTenant.toString());
    if (idCartera) params = params.set('idCartera', idCartera.toString());
    if (idSubcartera) params = params.set('idSubcartera', idSubcartera.toString());
    return this.http.get<AgenteGestion[]>(`${this.baseUrl}/agentes`, { params });
  }

  /** Catálogo de tipificaciones (niveles 1-3) para los filtros en cascada */
  getTipificaciones(): Observable<TipificacionCatalogo[]> {
    return this.http.get<TipificacionCatalogo[]>(`${this.baseUrl}/tipificaciones`);
  }
}
