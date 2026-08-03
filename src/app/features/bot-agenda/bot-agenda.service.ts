import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Una llamada que el bot pactó con el cliente para que la atienda un asesor. */
export interface BotAgendaFila {
  id: number;
  fechaHoraPactada: string;
  nombreCliente?: string;
  documento?: string;
  telefono?: string;
  motivo?: string;
  resumen?: string;
  estado: string;          // PENDIENTE | ATENDIDA | NO_CONTESTA | VENCIDA | CANCELADA
  detalleCierre?: string;
  intentos?: number;
  idCuota?: number;
  idAgenteTitular?: number;
  idAgenteAsignado?: number;
  nombreAgente?: string;
}

/**
 * Prefijo propio `/api/bot-agenda`, distinto de `/api/bot-admin`: aquí el asesor
 * tiene que poder ver lo suyo, y ese otro es solo-ADMIN.
 */
@Injectable({ providedIn: 'root' })
export class BotAgendaService {
  private readonly apiUrl = `${environment.apiUrl}/bot-agenda`;

  constructor(private http: HttpClient) {}

  /** Las del asesor que consulta. */
  mias(fecha?: string): Observable<BotAgendaFila[]> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<BotAgendaFila[]>(`${this.apiUrl}/mias${q}`);
  }

  /** Todas las del día (supervisión y admin). */
  todas(fecha?: string): Observable<BotAgendaFila[]> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<BotAgendaFila[]>(`${this.apiUrl}${q}`);
  }

  resumen(fecha?: string): Observable<Record<string, number>> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<Record<string, number>>(`${this.apiUrl}/resumen${q}`);
  }

  cerrar(id: number, contesto: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/cerrar?contesto=${contesto}`, {});
  }
}
