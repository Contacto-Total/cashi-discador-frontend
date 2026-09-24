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
  duracionSegundos: number | null;
  duracionFormateada: string;
  notas: string | null;
  sessionId: string | null;
}

/**
 * CONECTADO (Jornada) = todo menos DESCONECTADO
 * |- EN COLA          = DISPONIBLE + EN_LLAMADA + TIPIFICANDO + EN_MANUAL
 * `- FUERA DE LA COLA = CONECTADO - EN COLA
 *    |- EN LINEA      = EN_LINEA
 *    |- OTRAS TAREAS  = GESTION_MANUAL + SEGUIMIENTO + WHATSAPP + CONSULTA_TIEMPOS
 *    |- REUNION Y CAP = EN_REUNION + CAPACITACION
 *    `- PAUSAS        = REFRIGERIO + COMIDA + SSHH + AUSENTE + SOPORTE
 *
 * PRODUCTIVO cruza los dos grupos, no es subtotal de ninguno:
 *   EN_LLAMADA + TIPIFICANDO + SEGUIMIENTO
 * Desde 2026-09 no cuenta la gestion manual (GESTION_MANUAL / EN_MANUAL): el estado se
 * mantiene aunque el asesor salga de la pantalla. WhatsApp tampoco, por lo mismo.
 */
export interface ResumenPorAgente {
  idUsuario: number;
  nombreAgente: string;
  username: string;
  segundosPorEstado: { [estado: string]: number };

  totalSegundosConectado: number;
  totalSegundosEnCola: number;
  totalSegundosFueraDeCola: number;
  totalSegundosProductivo: number;
  totalSegundosOcioso: number;
  totalSegundosEnLinea: number;
  totalSegundosOtrasTareas: number;
  totalSegundosReunion: number;
  totalSegundosPausa: number;

  tiempoConectadoFormateado: string;
  tiempoEnColaFormateado: string;
  tiempoFueraDeColaFormateado: string;
  tiempoProductivoFormateado: string;
  tiempoOciosoFormateado: string;
  tiempoEnLineaFormateado: string;
  tiempoOtrasTareasFormateado: string;
  tiempoReunionFormateado: string;
  tiempoPausaFormateado: string;

  /** Productivo / (Conectado - Pausas) */
  porcentajeOcupacion: number;
  porcentajeEnCola: number;
  porcentajeFueraDeCola: number;
  /** Ocioso / En cola. Mide al discador, no al asesor. */
  porcentajeOcioso: number;
  porcentajePausas: number;

  horaEntrada: string | null;
  horaSalida: string | null;
  cantidadSesiones: number;
}

export interface ResumenEstadoAgentes {
  totalRegistros: number;
  totalAgentes: number;
  totalCambiosEstado: number;
  agentes: ResumenPorAgente[];
}

export interface ReporteEstadoAgentesResponse {
  /** Tramos del periodo, paginados. El resumen no depende de ellos; la linea de
   *  tiempo de la pantalla si, y por eso se piden aparte con un size alto. */
  registros: RegistroEstadoDTO[];
  resumen: ResumenEstadoAgentes;
  total: number;
  page: number;
  size: number;
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
  /** Hora de la primera gestion tipificada del dia */
  primeraGestionHora: string | null;
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

  /**
   * Resumen por agente y, si se pide un `size` alto, los tramos del dia para dibujar
   * la jornada. Por defecto el backend devuelve 50 tramos: alcanza para el resumen.
   */
  getReporte(
    fechaDesde: string,
    fechaHasta: string,
    tenantId?: number,
    carteraId?: number,
    subcarteraId?: number,
    page?: number,
    size?: number
  ): Observable<ReporteEstadoAgentesResponse> {
    let params = new HttpParams()
      .set('fechaDesde', fechaDesde)
      .set('fechaHasta', fechaHasta);

    if (tenantId) params = params.set('tenantId', tenantId.toString());
    if (carteraId) params = params.set('carteraId', carteraId.toString());
    if (subcarteraId) params = params.set('subcarteraId', subcarteraId.toString());
    if (page != null) params = params.set('page', page.toString());
    if (size != null) params = params.set('size', size.toString());

    return this.http.get<ReporteEstadoAgentesResponse>(this.baseUrl, { params });
  }

  /**
   * La jornada del asesor que pregunta. El backend resuelve el usuario desde el token,
   * asi que no se manda ningun id: no hay forma de pedir la de otro.
   */
  getMisTiempos(fecha: string): Observable<ReporteEstadoAgentesResponse> {
    return this.http.get<ReporteEstadoAgentesResponse>(`${this.baseUrl}/mis-tiempos`, {
      params: new HttpParams().set('fecha', fecha)
    });
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
