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
  // Usar gatewayUrl porque agent-status está en el backend de discador (puerto 8080)
  private apiUrl = `${environment.gatewayUrl}/agent-status`;
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
          sessionId: response.sessionId,
          // Campos de umbral de tiempo
          segundosEnEstado: response.segundosEnEstado,
          colorIndicador: response.colorIndicador,
          porcentajeTiempo: response.porcentajeTiempo,
          excedeTiempoMaximo: response.excedeTiempoMaximo,
          tiempoMaximoSegundos: response.tiempoMaximoSegundos
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
   * Inicia el polling automático del estado del agente cada 10 segundos
   * para mantener actualizado el indicador de umbral de tiempo
   */
  startStatusPolling(idUsuario: number): Observable<AgentStatusResponse> {
    return interval(10000).pipe(
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
   * Desconecta al agente (elimina su estado en el backend)
   * Llamar al hacer logout para que el monitoreo muestre al agente como desconectado
   */
  disconnectAgent(idUsuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idUsuario}`).pipe(
      tap(() => {
        console.log(`[AgentStatusService] Agente ${idUsuario} marcado como desconectado`);
        this.currentStatusSubject.next(null);
      })
    );
  }

  /**
   * Obtiene el estado actual sin hacer una nueva petición
   */
  getCurrentStatus(): AgentStatus | null {
    return this.currentStatusSubject.value;
  }
}
