import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  RecordatorioPromesa,
  RegistrarRecordatorioRequest,
  ResultadoRecordatorio,
  EstadisticasRecordatorios
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
}
