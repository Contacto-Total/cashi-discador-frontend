import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { tap, switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AgentStatus,
  AgentStatusResponse,
  ChangeStatusRequest,
  EstadosDisponibles,
  AgentState
} from '../models/agent-status.model';

@Injectable({
  providedIn: 'root'
})
export class AgentStatusService {
  private apiUrl = `${environment.apiUrl}/api/agent-status`;
  private currentStatusSubject = new BehaviorSubject<AgentStatus | null>(null);
  public currentStatus$ = this.currentStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el estado actual de un agente
   */
  getAgentStatus(idUsuario: number): Observable<AgentStatusResponse> {
    return this.http.get<AgentStatusResponse>(`${this.apiUrl}/${idUsuario}`).pipe(
      tap(response => {
        const status: AgentStatus = {
          idUsuario: response.idUsuario,
          estadoActual: response.estadoActual as AgentState,
          estadoAnterior: response.estadoAnterior as AgentState | undefined,
          timestampCambio: response.timestampCambio,
          tiempoEnEstadoMinutos: response.tiempoEnEstadoMinutos,
          notas: response.notas,
          sessionId: response.sessionId
        };
        this.currentStatusSubject.next(status);
      })
    );
  }

  /**
   * Cambia el estado de un agente manualmente
   */
  changeStatus(idUsuario: number, request: ChangeStatusRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idUsuario}/cambiar-estado`, request).pipe(
      tap(() => {
        // Actualizar el estado después del cambio
        this.getAgentStatus(idUsuario).subscribe();
      })
    );
  }

  /**
   * Entra en modo manual
   */
  enterManualMode(idUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idUsuario}/modo-manual/entrar`, {}).pipe(
      tap(() => {
        this.getAgentStatus(idUsuario).subscribe();
      })
    );
  }

  /**
   * Sale de modo manual
   */
  exitManualMode(idUsuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${idUsuario}/modo-manual/salir`, {}).pipe(
      tap(() => {
        this.getAgentStatus(idUsuario).subscribe();
      })
    );
  }

  /**
   * Obtiene los estados disponibles
   */
  getAvailableStates(): Observable<EstadosDisponibles> {
    return this.http.get<EstadosDisponibles>(`${this.apiUrl}/estados-disponibles`);
  }

  /**
   * Verifica si un agente está disponible para llamadas
   */
  isAvailableForCalls(idUsuario: number): Observable<{ idUsuario: number; disponible: boolean }> {
    return this.http.get<{ idUsuario: number; disponible: boolean }>(
      `${this.apiUrl}/${idUsuario}/disponible-para-llamadas`
    );
  }

  /**
   * Inicia el polling automático del estado del agente cada 30 segundos
   */
  startStatusPolling(idUsuario: number): Observable<AgentStatusResponse> {
    return interval(30000).pipe(
      startWith(0),
      switchMap(() => this.getAgentStatus(idUsuario))
    );
  }

  /**
   * Limpia el estado actual
   */
  clearCurrentStatus(): void {
    this.currentStatusSubject.next(null);
  }

  /**
   * Obtiene el estado actual sin hacer una nueva petición
   */
  getCurrentStatus(): AgentStatus | null {
    return this.currentStatusSubject.value;
  }
}
