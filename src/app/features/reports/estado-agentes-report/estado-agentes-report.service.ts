import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface RegistroEstadoDTO {
  idHistory: number;
  idUsuario: number;
  nombreAgente: string;
  username: string;
  estadoAnterior: string | null;
  estadoNuevo: string;
  timestampInicio: string;
  timestampFin: string;
  duracionMinutos: number | null;
  duracionFormateada: string;
  notas: string | null;
  sessionId: string | null;
}

/**
 * CONECTADO = todo menos DESCONECTADO
 * |- PAUSAS  = REFRIGERIO + SSHH
 * `- JORNADA = CONECTADO - PAUSAS
 *    |- REUNION = EN_REUNION
 *    `- (base)  = JORNADA - REUNION
 *       |- OCIOSO     = DISPONIBLE
 *       `- PRODUCTIVO = el resto
 */
export interface ResumenPorAgente {
  idUsuario: number;
  nombreAgente: string;
  username: string;
  segundosPorEstado: { [estado: string]: number };
  totalSegundosConectado: number;
  totalSegundosProductivo: number;
  totalSegundosOcioso: number;
  totalSegundosPausa: number;
  totalSegundosReunion: number;
  /** productivo / (jornada - reunion) */
  porcentajeOcupacion: number;
  tiempoConectadoFormateado: string;
  tiempoProductivoFormateado: string;
  tiempoOciosoFormateado: string;
  tiempoPausaFormateado: string;
  tiempoReunionFormateado: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  cantidadSesiones: number;
  /** CONECTADO - PAUSAS (incluye la reunion), no salida - entrada */
  jornadaTotalFormateada: string | null;
  jornadaTotalSegundos: number;
}

export interface ResumenEstadoAgentes {
  totalRegistros: number;
  totalAgentes: number;
  totalCambiosEstado: number;
  agentes: ResumenPorAgente[];
}

export interface ReporteEstadoAgentesResponse {
  resumen: ResumenEstadoAgentes;
}

// ==================== ASISTENCIA ====================

export type EstadoAsistencia = 'PUNTUAL' | 'TARDE' | 'FALTA';

export interface RegistroAsistenciaDTO {
  fecha: string;
  idUsuario: number;
  nombreAgente: string;
  username: string;
  idSubcartera: number | null;
  subcartera: string | null;
  /** null cuando el agente no se conecto ese dia */
  horaIngreso: string | null;
  horaSalida: string | null;
  estadoAsistencia: EstadoAsistencia;
  minutosTardanza: number;
  tardanzaFormateada: string;
  segundosConectado: number;
  tiempoConectado: string;
  segundosJornada: number;
  jornada: string;
  desconexiones: number;
  cambiosEstado: number;
  /** Primera gestion tipificada del dia */
  primeraGestionHora: string | null;
  primeraGestionId: number | null;
  /** Minutos entre la conexion y la primera gestion */
  minutosHastaGestion: number | null;
}

export interface ResumenAsistenciaPorAgente {
  idUsuario: number;
  nombreAgente: string;
  username: string;
  subcartera: string | null;
  diasTrabajados: number;
  diasPuntual: number;
  diasTarde: number;
  diasFalta: number;
  porcentajePuntualidad: number;
  totalMinutosTardanza: number;
  tardanzaAcumulada: string;
  promedioHoraIngreso: string | null;
}

export interface ResumenAsistencia {
  totalAgentes: number;
  totalDias: number;
  totalRegistros: number;
  totalPuntual: number;
  totalTarde: number;
  totalFalta: number;
  porcentajePuntualidad: number;
  totalMinutosTardanza: number;
  tardanzaAcumulada: string;
  agentes: ResumenAsistenciaPorAgente[];
}

export interface ReporteAsistenciaResponse {
  registros: RegistroAsistenciaDTO[];
  resumen: ResumenAsistencia;
}

export interface AgenteOption {
  id: number;
  nombre: string;
  extension: string | null;
}

export interface FiltrosAsistencia {
  fechaDesde: string;
  fechaHasta: string;
  tenantId?: number;
  carteraId?: number;
  subcarteraId?: number;
  idsUsuarios?: number[];
  horaEntrada: string;
  toleranciaMin: number;
  incluirDomingos: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EstadoAgentesReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/estado-agentes`;

  constructor(private http: HttpClient) {}

  /** Solo el resumen por agente. El detalle fila por fila va en el Excel. */
  getReporte(
    fechaDesde: string,
    fechaHasta: string,
    tenantId?: number,
    carteraId?: number,
    subcarteraId?: number
  ): Observable<ReporteEstadoAgentesResponse> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    if (tenantId) params = params.set('tenantId', tenantId.toString());
    if (carteraId) params = params.set('carteraId', carteraId.toString());
    if (subcarteraId) params = params.set('subcarteraId', subcarteraId.toString());

    return this.http.get<ReporteEstadoAgentesResponse>(this.baseUrl, { params });
  }

  exportarExcel(
    fechaDesde: string,
    fechaHasta: string,
    tenantId?: number,
    carteraId?: number,
    subcarteraId?: number
  ): Observable<Blob> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    if (tenantId) params = params.set('tenantId', tenantId.toString());
    if (carteraId) params = params.set('carteraId', carteraId.toString());
    if (subcarteraId) params = params.set('subcarteraId', subcarteraId.toString());

    return this.http.get(`${this.baseUrl}/excel`, {
      params,
      responseType: 'blob'
    });
  }

  // ==================== ASISTENCIA ====================

  getAsistencia(filtros: FiltrosAsistencia): Observable<ReporteAsistenciaResponse> {
    return this.http.get<ReporteAsistenciaResponse>(`${this.baseUrl}/asistencia`, {
      params: this.buildAsistenciaParams(filtros)
    });
  }

  exportarAsistenciaExcel(filtros: FiltrosAsistencia): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/asistencia/excel`, {
      params: this.buildAsistenciaParams(filtros),
      responseType: 'blob'
    });
  }

  /** Roster de la subcartera para el multiselect. Mismas reglas que aplica el SP. */
  getAgentesSubcartera(subcarteraId: number): Observable<AgenteOption[]> {
    return this.http.get<AgenteOption[]>(`${this.baseUrl}/agentes`, {
      params: new HttpParams().set('subcarteraId', subcarteraId.toString())
    });
  }

  private buildAsistenciaParams(f: FiltrosAsistencia): HttpParams {
    let params = new HttpParams()
      .set('fechaDesde', f.fechaDesde)
      .set('fechaHasta', f.fechaHasta)
      .set('horaEntrada', f.horaEntrada)
      .set('toleranciaMin', String(f.toleranciaMin ?? 0))
      .set('incluirDomingos', String(!!f.incluirDomingos));

    if (f.tenantId) params = params.set('tenantId', f.tenantId.toString());
    if (f.carteraId) params = params.set('carteraId', f.carteraId.toString());
    if (f.subcarteraId) params = params.set('subcarteraId', f.subcarteraId.toString());
    if (f.idsUsuarios?.length) params = params.set('idsUsuarios', f.idsUsuarios.join(','));

    return params;
  }
}
