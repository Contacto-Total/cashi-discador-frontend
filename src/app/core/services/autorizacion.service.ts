import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, interval, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WebsocketService } from './websocket.service';

/**
 * Supervisor/Admin en línea
 */
export interface SupervisorEnLinea {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  sipExtension: string;
  estado: string;
  rol: 'ADMIN' | 'SUPERVISOR';
  solicitudesPendientes?: number;
}

/**
 * Cuota del cronograma de pagos
 */
export interface CuotaSolicitud {
  numeroCuota: number;
  monto: number;
  fechaPago: string;
}

/**
 * Solicitud de autorización completa
 */
export interface SolicitudAutorizacion {
  id?: number;
  uuid?: string;

  // Contexto
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;

  // Agente solicitante
  idAgenteSolicitante: number;
  nombreAgente?: string;

  // Supervisor destinatario
  idSupervisor: number;
  nombreSupervisor?: string;

  // Cliente
  idCliente: number;
  nombreCliente?: string;
  documentoCliente?: string;

  // Tipificación
  idTipificacion: number;
  nombreTipificacion?: string;

  // Detalles del cronograma
  montoTotal: number;
  numeroCuotas: number;
  campoMontoOrigen?: string;
  cuotas?: CuotaSolicitud[];

  // Observaciones
  observacionesAgente?: string;
  comentariosSupervisor?: string;

  // Estado
  estado?: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'EXPIRADA' | 'CANCELADA';
  fechaSolicitud?: string;
  fechaRespuesta?: string;
  fechaExpiracion?: string;
  segundosRestantes?: number;
}

/**
 * Request para crear solicitud
 */
export interface CrearSolicitudRequest {
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  idAgenteSolicitante: number;
  nombreAgente: string;
  idSupervisor: number;
  idCliente: number;
  nombreCliente?: string;
  documentoCliente?: string;
  idTipificacion: number;
  nombreTipificacion?: string;
  montoTotal: number;
  numeroCuotas: number;
  campoMontoOrigen?: string;
  cuotas: CuotaSolicitud[];
  observacionesAgente?: string;
}

/**
 * Request para responder a solicitud
 */
export interface ResponderSolicitudRequest {
  uuidSolicitud: string;
  idSupervisor: number;
  aprobada: boolean;
  comentarios?: string;
}

/**
 * Evento de WebSocket para autorizaciones
 */
export interface AutorizacionEvent {
  tipo: 'NUEVA_SOLICITUD_AUTORIZACION' | 'SOLICITUD_APROBADA' | 'SOLICITUD_RECHAZADA' | 'SOLICITUD_CANCELADA' | 'SOLICITUD_EXPIRADA';
  solicitud: SolicitudAutorizacion;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {
  private readonly baseUrl = `${environment.gatewayUrl}/autorizaciones`;

  // Signals para estado reactivo
  readonly supervisoresEnLinea = signal<SupervisorEnLinea[]>([]);
  readonly solicitudesPendientes = signal<SolicitudAutorizacion[]>([]);
  readonly solicitudActual = signal<SolicitudAutorizacion | null>(null);
  readonly cargando = signal<boolean>(false);

  // Subjects para eventos
  private nuevaSolicitudSubject = new Subject<SolicitudAutorizacion>();
  private respuestaSubject = new Subject<SolicitudAutorizacion>();

  // Observables públicos
  readonly nuevaSolicitud$ = this.nuevaSolicitudSubject.asObservable();
  readonly respuesta$ = this.respuestaSubject.asObservable();

  // Estado de subscripción WebSocket
  private wsSubscribed = false;

  constructor(
    private http: HttpClient,
    private webSocketService: WebsocketService
  ) {
    // Suscribirse a eventos WebSocket al crear el servicio
    this.subscribeToWebSocket();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('callcenter_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Obtiene el ID del usuario actual desde localStorage
   */
  private getCurrentUserId(): number | null {
    try {
      const userStr = localStorage.getItem('callcenter_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.id || null;
      }
    } catch (e) {
      console.error('[AUTORIZACION] Error obteniendo usuario actual:', e);
    }
    return null;
  }

  /**
   * Obtiene los supervisores/admins que están en línea
   */
  obtenerSupervisoresEnLinea(): Observable<SupervisorEnLinea[]> {
    console.log('[AUTORIZACION] Obteniendo supervisores en línea...');
    this.cargando.set(true);

    return this.http.get<SupervisorEnLinea[]>(
      `${this.baseUrl}/supervisores-en-linea`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(supervisores => {
        this.supervisoresEnLinea.set(supervisores);
        this.cargando.set(false);
        console.log('[AUTORIZACION] Supervisores encontrados:', supervisores.length);
      })
    );
  }

  /**
   * Crea una nueva solicitud de autorización
   */
  crearSolicitud(request: CrearSolicitudRequest): Observable<SolicitudAutorizacion> {
    console.log('[AUTORIZACION] Creando solicitud:', request);
    this.cargando.set(true);

    return this.http.post<SolicitudAutorizacion>(
      this.baseUrl,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(solicitud => {
        this.solicitudActual.set(solicitud);
        this.cargando.set(false);
        console.log('[AUTORIZACION] Solicitud creada:', solicitud.uuid);
      })
    );
  }

  /**
   * Responde a una solicitud (aprobar o rechazar)
   */
  responderSolicitud(request: ResponderSolicitudRequest): Observable<SolicitudAutorizacion> {
    console.log('[AUTORIZACION] Respondiendo solicitud:', request);

    return this.http.post<SolicitudAutorizacion>(
      `${this.baseUrl}/responder`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(solicitud => {
        console.log('[AUTORIZACION] Solicitud respondida:', solicitud.estado);
        // Actualizar lista de pendientes
        this.solicitudesPendientes.update(list =>
          list.filter(s => s.uuid !== solicitud.uuid)
        );
      })
    );
  }

  /**
   * Obtiene solicitudes pendientes para un supervisor
   */
  obtenerSolicitudesPendientes(idSupervisor: number): Observable<SolicitudAutorizacion[]> {
    console.log('[AUTORIZACION] Obteniendo pendientes para supervisor:', idSupervisor);

    return this.http.get<SolicitudAutorizacion[]>(
      `${this.baseUrl}/pendientes/${idSupervisor}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(solicitudes => {
        this.solicitudesPendientes.set(solicitudes);
        console.log('[AUTORIZACION] Solicitudes pendientes:', solicitudes.length);
      })
    );
  }

  /**
   * Obtiene una solicitud por UUID
   */
  obtenerPorUuid(uuid: string): Observable<SolicitudAutorizacion> {
    return this.http.get<SolicitudAutorizacion>(
      `${this.baseUrl}/${uuid}`,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Cancela una solicitud pendiente
   */
  cancelarSolicitud(uuid: string, idAgente: number): Observable<SolicitudAutorizacion> {
    console.log('[AUTORIZACION] Cancelando solicitud:', uuid);

    return this.http.post<SolicitudAutorizacion>(
      `${this.baseUrl}/${uuid}/cancelar`,
      { idAgente },
      { headers: this.getHeaders() }
    ).pipe(
      tap(solicitud => {
        this.solicitudActual.set(null);
        console.log('[AUTORIZACION] Solicitud cancelada');
      })
    );
  }

  /**
   * Suscribe a eventos de WebSocket para autorizaciones
   */
  private subscribeToWebSocket(): void {
    if (this.wsSubscribed) return;

    // Intentar conectar si no está conectado
    if (!this.webSocketService.isConnected()) {
      this.webSocketService.connect();
    }

    // Suscribirse a eventos personales (para el usuario actual)
    this.webSocketService.subscribe('/user/queue/messages').subscribe((message: any) => {
      this.handleWebSocketMessage(message);
    });

    // Suscribirse al topic general de autorizaciones
    this.webSocketService.subscribe('/topic/autorizaciones/supervisores').subscribe((message: any) => {
      this.handleWebSocketMessage(message);
    });

    this.wsSubscribed = true;
    console.log('[AUTORIZACION] Subscrito a WebSocket para autorizaciones');
  }

  /**
   * Maneja mensajes de WebSocket
   */
  private handleWebSocketMessage(message: any): void {
    console.log('[AUTORIZACION] 📨 Mensaje WebSocket recibido (raw):', JSON.stringify(message, null, 2));

    if (!message) return;

    // Normalizar el mensaje - el backend puede enviar en varios formatos:
    // 1. Directo: { tipo: "...", solicitud: {...}, timestamp: ... }
    // 2. Envuelto por sendToUserByUsername: { type: "...", payload: { tipo: "...", solicitud: {...} }, timestamp: ... }
    // 3. Otro formato envuelto: { type: "...", payload: { tipo: "...", solicitud: {...} } }
    let evento: AutorizacionEvent;

    if (message.tipo && message.solicitud) {
      // Formato directo desde sendDirectToUser o topic
      evento = message as AutorizacionEvent;
      console.log('[AUTORIZACION] ✅ Mensaje en formato directo:', evento.tipo);
    } else if (message.payload && message.payload.tipo) {
      // Formato envuelto desde sendToUserByUsername
      evento = message.payload as AutorizacionEvent;
      console.log('[AUTORIZACION] ✅ Mensaje normalizado desde payload:', evento.tipo);
    } else if (message.type && message.payload && message.payload.solicitud) {
      // Otro formato envuelto
      evento = message.payload as AutorizacionEvent;
      console.log('[AUTORIZACION] ✅ Mensaje normalizado desde type/payload:', evento.tipo);
    } else {
      console.log('[AUTORIZACION] ⚠️ Formato de mensaje no reconocido:', message);
      return;
    }

    if (!evento.tipo || !evento.solicitud) {
      console.log('[AUTORIZACION] ⚠️ Evento incompleto, ignorando:', evento);
      return;
    }

    // Obtener ID del usuario actual para filtrar mensajes
    const currentUserId = this.getCurrentUserId();
    console.log('[AUTORIZACION] Procesando evento:', evento.tipo, '| Usuario actual:', currentUserId);

    switch (evento.tipo) {
      case 'NUEVA_SOLICITUD_AUTORIZACION':
        // Solo mostrar si la solicitud es para ESTE supervisor
        if (evento.solicitud.idSupervisor !== currentUserId) {
          console.log('[AUTORIZACION] Ignorando solicitud - no es para este supervisor. Destinatario:', evento.solicitud.idSupervisor, 'Yo:', currentUserId);
          return;
        }
        console.log('[AUTORIZACION] Nueva solicitud recibida para MÍ!');
        this.solicitudesPendientes.update(list => [evento.solicitud, ...list]);
        this.nuevaSolicitudSubject.next(evento.solicitud);
        break;

      case 'SOLICITUD_APROBADA':
        // Verificar que esta respuesta es para MÍ (el agente que hizo la solicitud)
        if (evento.solicitud.idAgenteSolicitante !== currentUserId) {
          console.log('[AUTORIZACION] ⏭️ Ignorando APROBADA - no es mi solicitud. Agente:', evento.solicitud.idAgenteSolicitante, 'Yo:', currentUserId);
          return;
        }
        console.log('[AUTORIZACION] ✅ ¡MI Solicitud fue APROBADA!');
        this.solicitudActual.set(evento.solicitud);
        this.respuestaSubject.next(evento.solicitud);
        break;

      case 'SOLICITUD_RECHAZADA':
        // Verificar que esta respuesta es para MÍ (el agente que hizo la solicitud)
        if (evento.solicitud.idAgenteSolicitante !== currentUserId) {
          console.log('[AUTORIZACION] ⏭️ Ignorando RECHAZADA - no es mi solicitud. Agente:', evento.solicitud.idAgenteSolicitante, 'Yo:', currentUserId);
          return;
        }
        console.log('[AUTORIZACION] ❌ ¡MI Solicitud fue RECHAZADA!');
        this.solicitudActual.set(evento.solicitud);
        this.respuestaSubject.next(evento.solicitud);
        break;

      case 'SOLICITUD_CANCELADA':
        console.log('[AUTORIZACION] Solicitud cancelada por agente');
        this.solicitudesPendientes.update(list =>
          list.filter(s => s.uuid !== evento.solicitud.uuid)
        );
        break;

      case 'SOLICITUD_EXPIRADA':
        console.log('[AUTORIZACION] Solicitud expirada!');
        this.solicitudActual.set(evento.solicitud);
        this.respuestaSubject.next(evento.solicitud);
        break;
    }
  }

  /**
   * Limpia el estado actual
   */
  limpiarEstado(): void {
    this.solicitudActual.set(null);
    this.supervisoresEnLinea.set([]);
  }
}
