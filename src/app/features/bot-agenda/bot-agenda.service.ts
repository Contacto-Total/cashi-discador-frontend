import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Un caso de la Agenda del bot: algo que dejó Clara y necesita a una persona.
 *
 * Las cuatro fuentes llegan con la misma forma; lo que cambia es el `tipo`, que
 * decide el orden, el color y qué dato propio se muestra.
 */
export interface CasoAgendaBot {
  tipo: 'PROMESA' | 'SIN_CERRAR' | 'CITA' | 'CON_INTENCION';
  cuando: string;
  idCliente?: number;
  documento?: string;
  nombreCliente?: string;
  telefono?: string;
  resumen?: string;
  motivo?: string;

  estadoCita?: string;
  idAgenda?: number;
  /** Clave con la que se asigna el caso; única junto al `tipo`. */
  referencia?: number;

  idSesion?: number;
  uuidLlamada?: string;

  monto?: number;
  numeroCuota?: number;
  totalCuotas?: number;
  diasVencida?: number;

  seguimiento?: 'PENDIENTE' | 'COMPLETADO';
  gestionadoAt?: string;
  gestionadoPor?: string;

  idAgenteAsignado?: number;
  nombreAsignado?: string;
}

export interface AsesorAgenda {
  id: number;
  nombre: string;
}

/**
 * Prefijo propio `/api/bot-agenda`, distinto de `/api/bot-admin`: aquí el asesor
 * tiene que poder ver lo suyo, y ese otro es solo-ADMIN.
 */
@Injectable({ providedIn: 'root' })
export class BotAgendaService {
  private readonly apiUrl = `${environment.apiUrl}/bot-agenda`;

  constructor(private http: HttpClient) {}

  /**
   * Los casos de un rango. El backend decide qué devuelve según el rol: todo a la
   * supervisión y solo lo asignado a un asesor.
   */
  casos(desde: string, hasta: string): Observable<CasoAgendaBot[]> {
    return this.http.get<CasoAgendaBot[]>(`${this.apiUrl}/casos?desde=${desde}&hasta=${hasta}`);
  }

  /** Los asesores a los que se puede repartir. Solo responde a supervisión. */
  asesores(): Observable<AsesorAgenda[]> {
    return this.http.get<AsesorAgenda[]>(`${this.apiUrl}/asesores`);
  }

  /** Deja el caso en manos de un asesor; con `idAgente` nulo se lo quita. */
  asignar(tipo: string, referencia: number, idAgente: number | null): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/asignar`, { tipo, referencia, idAgente });
  }

  /** `contesto` distingue una cita atendida de una que no respondió. */
  cerrar(idAgenda: number, contesto: boolean): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${idAgenda}/cerrar?contesto=${contesto}`, {});
  }
}
