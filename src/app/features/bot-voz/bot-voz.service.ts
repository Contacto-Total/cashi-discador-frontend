import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BotConfig {
  id?: number;
  activo: boolean;
  modoPerfil: string;              // MANUAL | AUTO
  idPerfilActivo?: number;
  horaInicio: string;             // HH:mm:ss
  horaFin: string;
  diasSemana: string;
  maxLlamadasSimultaneas: number;
  politicaTitularidad: string;    // IGNORA | PRIORIZA_LIBRES | SOLO_LIBRES
}

export interface BotPerfil {
  id: number;
  nombre: string;
  diaMesDesde: number;
  diaMesHasta: number;
  maxLlamadasDia: number;
  diasAnticipacion: number;
  incluirVencidas: boolean;
  maxDiasVencida?: number | null;
  maxIntentosPorCuota: number;
  estiloTono: string;
  permiteProponerFechas: boolean;
}

export interface BotContacto {
  id: number;
  idCuota?: number;
  idCliente: number;
  telefono: string;
  idPerfil?: number;
  estado: string;
  intentos: number;
  resultado?: string;
}

export interface BotSesion {
  id: number;
  uuidLlamada: string;
  idCliente?: number;
  idCuota?: number;
  estado?: string;
  resultadoNegocio?: string;
  duracionSeg?: number;
  costoEstimadoUsd?: number;
  inicio?: string;
}

@Injectable({ providedIn: 'root' })
export class BotVozService {
  private readonly apiUrl = `${environment.apiUrl}/bot-admin`;

  constructor(private http: HttpClient) {}

  getConfig(): Observable<BotConfig> { return this.http.get<BotConfig>(`${this.apiUrl}/config`); }
  updateConfig(c: Partial<BotConfig>): Observable<BotConfig> { return this.http.put<BotConfig>(`${this.apiUrl}/config`, c); }

  // Botones start/stop de la cola de llamadas.
  activar(): Observable<BotConfig> { return this.http.post<BotConfig>(`${this.apiUrl}/activar`, {}); }
  desactivar(): Observable<BotConfig> { return this.http.post<BotConfig>(`${this.apiUrl}/desactivar`, {}); }

  getPerfiles(): Observable<BotPerfil[]> { return this.http.get<BotPerfil[]>(`${this.apiUrl}/perfiles`); }
  updatePerfil(id: number, p: Partial<BotPerfil>): Observable<BotPerfil> { return this.http.put<BotPerfil>(`${this.apiUrl}/perfiles/${id}`, p); }

  armarCola(): Observable<any> { return this.http.post<any>(`${this.apiUrl}/cola/armar`, {}); }
  getCola(fecha?: string): Observable<BotContacto[]> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<BotContacto[]>(`${this.apiUrl}/cola${q}`);
  }
  getDescartes(fecha?: string): Observable<any[]> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<any[]>(`${this.apiUrl}/cola/descartes${q}`);
  }

  getSesiones(): Observable<BotSesion[]> { return this.http.get<BotSesion[]>(`${this.apiUrl}/sesiones`); }
}
