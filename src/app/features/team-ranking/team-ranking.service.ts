import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AgentRankingInfo {
  idAgente: number;
  nombreAgente: string;
  posicion: number;
  esYo: boolean;
  totalGestiones: number;
  totalPromesas: number;
  montoPromesas: number;
  proyeccionDia: number;
  recaudoDia: number;
  efectividadProyeccion: number;
  efectividadGeneral: number;
  trend: 'up' | 'down' | 'stable';
  minutosEnLlamada?: number;
  minutosProductivos?: number;
}

export interface TeamTotals {
  totalGestiones: number;
  totalPromesas: number;
  montoTotalPromesas: number;
  proyeccionTotal: number;
  recaudoTotal: number;
  efectividadProyeccionEquipo: number;
  totalAgentes: number;
}

export interface MetasProgreso {
  tieneMeta: boolean;
  metaGestionesDiarias: number | null;
  metaPromesasDiarias: number | null;
  metaMontoDiario: number | null;
  gestionesActuales: number | null;
  promesasActuales: number | null;
  montoActual: number | null;
  porcentajeGestiones: number | null;
  porcentajePromesas: number | null;
  porcentajeMonto: number | null;
}

export interface TeamRankingDTO {
  miRanking: AgentRankingInfo | null;
  ranking: AgentRankingInfo[];
  nombreSubcartera: string;
  nombreCartera: string;
  totalesEquipo: TeamTotals;
  metasProgreso: MetasProgreso | null;
}

export interface ResumenPromesas {
  totalPromesas: number;
  montoTotal: number;
  promesasPagadas: number;
  montoPagado: number;
  promesasPendientes: number;
  montoPendiente: number;
  promesasVencidas: number;
  montoVencido: number;
}

export interface PromesaDetalle {
  fechaGestion: string;
  documentoCliente: string;
  nombreCliente: string;
  telefonoContacto: string;
  nombreAgente: string;
  montoPromesa: number;
  totalCuotas: number | null;
  estadoPago: string;
  fechaPagoCompromiso: string | null;
  tipificacion: string;
  observaciones: string;
}

export interface PromesasMesDTO {
  resumen: ResumenPromesas;
  promesas: PromesaDetalle[];
  mesAnio: string;
  fechaInicio: string;
  fechaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamRankingService {
  private apiUrl = `${environment.apiUrl}/agent/team-ranking`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el ranking completo del equipo
   */
  getRankingEquipo(agenteId: number): Observable<TeamRankingDTO> {
    return this.http.get<TeamRankingDTO>(`${this.apiUrl}/${agenteId}`);
  }

  /**
   * Obtiene solo las métricas del agente actual
   */
  getMiRanking(agenteId: number): Observable<{
    miRanking: AgentRankingInfo;
    totalAgentes: number;
    totalesEquipo: TeamTotals;
  }> {
    return this.http.get<any>(`${this.apiUrl}/${agenteId}/mi-ranking`);
  }

  /**
   * Obtiene las promesas del mes para el agente
   */
  getPromesasMes(agenteId: number): Observable<PromesasMesDTO> {
    return this.http.get<PromesasMesDTO>(`${this.apiUrl}/${agenteId}/promesas-mes`);
  }
}
