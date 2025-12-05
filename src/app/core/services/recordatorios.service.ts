import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RecordatorioPromesa,
  RegistrarRecordatorioRequest,
  ResultadoRecordatorio,
  EstadisticasRecordatorios,
  IniciarDialerResponse,
  SiguienteRecordatorioResponse,
  CompletarRecordatorioResponse,
  EstadoDialerResponse
} from '../models/recordatorio.model';

@Injectable({
  providedIn: 'root'
})
export class RecordatoriosService {

  private baseUrl = `${environment.apiUrl}/v2/management-records/recordatorios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los recordatorios de promesas de pago para hoy del agente
   */
  getMisRecordatoriosHoy(idAgente: number): Observable<RecordatorioPromesa[]> {
    return this.http.get<RecordatorioPromesa[]>(`${this.baseUrl}/hoy/${idAgente}`);
  }

  /**
   * Obtiene los recordatorios de los próximos N días
   */
  getMisRecordatoriosProximos(idAgente: number, dias: number = 3): Observable<RecordatorioPromesa[]> {
    return this.http.get<RecordatorioPromesa[]>(`${this.baseUrl}/proximos/${idAgente}?dias=${dias}`);
  }

  /**
   * Registra un intento de recordatorio
   */
  registrarIntento(request: RegistrarRecordatorioRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, request);
  }

  /**
   * Obtiene las estadísticas de recordatorios del agente
   */
  getEstadisticas(idAgente: number, fecha?: string): Observable<EstadisticasRecordatorios> {
    let url = `${this.baseUrl}/estadisticas/${idAgente}`;
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    return this.http.get<EstadisticasRecordatorios>(url);
  }

  /**
   * Obtiene los posibles resultados para un recordatorio (para dropdown)
   */
  getResultadosPosibles(): Observable<ResultadoRecordatorio[]> {
    return this.http.get<ResultadoRecordatorio[]>(`${this.baseUrl}/resultados-posibles`);
  }

  // ==================== DIALER METHODS ====================

  /**
   * Inicia el discado automático de recordatorios
   */
  iniciarDialer(idAgente: number): Observable<IniciarDialerResponse> {
    return this.http.post<IniciarDialerResponse>(`${this.baseUrl}/dialer/iniciar/${idAgente}`, {});
  }

  /**
   * Obtiene el siguiente recordatorio de la cola
   */
  obtenerSiguiente(idAgente: number): Observable<SiguienteRecordatorioResponse> {
    return this.http.get<SiguienteRecordatorioResponse>(`${this.baseUrl}/dialer/siguiente/${idAgente}`);
  }

  /**
   * Marca el recordatorio actual como completado
   */
  completarActual(
    idAgente: number,
    resultado?: string,
    uuidLlamada?: string,
    observaciones?: string
  ): Observable<CompletarRecordatorioResponse> {
    let params = '';
    const queryParams: string[] = [];

    if (resultado) queryParams.push(`resultado=${resultado}`);
    if (uuidLlamada) queryParams.push(`uuidLlamada=${uuidLlamada}`);
    if (observaciones) queryParams.push(`observaciones=${encodeURIComponent(observaciones)}`);

    if (queryParams.length > 0) {
      params = '?' + queryParams.join('&');
    }

    return this.http.post<CompletarRecordatorioResponse>(
      `${this.baseUrl}/dialer/completar/${idAgente}${params}`,
      {}
    );
  }

  /**
   * Detiene el discado de recordatorios
   */
  detenerDialer(idAgente: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/dialer/detener/${idAgente}`);
  }

  /**
   * Obtiene el estado actual del dialer
   */
  obtenerEstadoDialer(idAgente: number): Observable<EstadoDialerResponse> {
    return this.http.get<EstadoDialerResponse>(`${this.baseUrl}/dialer/estado/${idAgente}`);
  }
}
