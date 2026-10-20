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
  /** Quién lo dejó ahí: la supervisión, o el reparto automático de promesas. */
  asignadoPor?: string;
  /** Cuándo se asignó, para separar lo que repartió el sistema esta mañana. */
  asignadoAt?: string;

  /** Información que el cliente necesita, reconocida por el bot; ausente si no pidió nada. */
  infoSolicitada?: InfoSolicitada | null;
}

/** Lo que el bot reconoció que el cliente necesita que le hagan llegar o le aclaren. */
export interface InfoSolicitada {
  /** Ausente si el cliente no pidió nada pero sí aceptó algo. */
  tipo?: 'MONTO' | 'CRONOGRAMA' | 'MEDIO_PAGO' | 'ENVIO_DOCUMENTO' | 'ORIGEN_DEUDA' | 'NEGOCIACION' | 'OTRO';
  /** Lo que dijo el cliente al pedirlo; puede venir vacío. */
  frase?: string;
  /** Todos los pedidos de la llamada (el primero es el principal). */
  pedidos?: InfoSolicitada[];
  /** Lo que el cliente aceptó o prefiere, solo para mostrar. */
  canal?: 'WHATSAPP' | 'SMS' | 'CORREO' | 'LLAMADA';
  medioPago?: string;
  fechaPrometida?: string;
  cuotas?: number;
}

export interface AsesorAgenda {
  id: number;
  nombre: string;
  /** Ficha de Personal: decide qué avatar le toca, igual que en la pantalla Personal. */
  idPersonal?: number;
  subcartera?: string;
}

/** Un asesor en el reparto del mes de una subcartera. */
export interface RepartoAsesorMes {
  idAgente: number;
  nombre?: string;
  promesas: number;
  prometido: number;
  /** Lo prometido del mes: lo que el sorteo usa para repartir. */
  carga: number;
  peso: number;
  /** Probabilidad de que le toque la próxima promesa. */
  probabilidadPct: number;
}

export interface RepartoSubcartera {
  idSubcartera: number;
  /** Cliente y cartera: hay subcarteras con el mismo nombre en clientes distintos. */
  inquilino?: string;
  cartera?: string;
  subcartera?: string;
  asesores: RepartoAsesorMes[];
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
   * Los casos pendientes. La pantalla no pregunta por fechas: el backend acota por su
   * cuenta y decide qué devuelve según el rol —todo a la supervisión, y solo sus
   * promesas repartidas a un asesor—.
   */
  casos(desde?: string, hasta?: string): Observable<CasoAgendaBot[]> {
    const q = desde && hasta ? `?desde=${desde}&hasta=${hasta}` : '';
    return this.http.get<CasoAgendaBot[]>(`${this.apiUrl}/casos${q}`);
  }

  /** Los asesores a los que se puede repartir. Solo responde a supervisión. */
  asesores(): Observable<AsesorAgenda[]> {
    return this.http.get<AsesorAgenda[]>(`${this.apiUrl}/asesores`);
  }

  /** Cómo va el reparto del mes en cada subcartera. Solo responde a supervisión. */
  repartoMes(): Observable<RepartoSubcartera[]> {
    return this.http.get<RepartoSubcartera[]>(`${this.apiUrl}/reparto/todas`);
  }

  /** Le avisa al asesor que mire su agenda. Solo le llega si tiene Cashi abierto. */
  recordar(idAgente: number, casos: number): Observable<{ enviado: boolean }> {
    return this.http.post<{ enviado: boolean }>(`${this.apiUrl}/recordar`, { idAgente, casos });
  }
}
