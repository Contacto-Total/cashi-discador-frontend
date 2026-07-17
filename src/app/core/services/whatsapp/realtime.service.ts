import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from '../../../../environments/environment';

export type WhatsAppEventType =
  | 'INCOMING' | 'OUTGOING' | 'RECEIPT' | 'CHAT_UPDATE' | 'VIEWERS' | 'STATUS';

export interface WhatsAppEvent {
  type: WhatsAppEventType | string;
  conversationId?: number;
  chat?: string;
  payload?: any;
}

/**
 * Stream de eventos WhatsApp desde Spring v2 (SSE sobre /v2/whatsapp/events).
 * Reemplaza al WebSocket del servicio Go: el front ya no habla con el Go.
 *
 * EventSource reconecta solo mientras el server cierre limpio, pero si responde
 * un error HTTP el navegador cierra el stream para siempre; por eso se reintenta
 * a mano con backoff cuando queda en CLOSED.
 */
@Injectable({
  providedIn: 'root'
})
export class RealtimeService implements OnDestroy {

  private readonly URL = `${environment.apiUrl}/v2/whatsapp/events`;
  private source?: EventSource;
  private eventsSubject = new Subject<WhatsAppEvent>();
  private reconnectTimer?: any;
  private reconnectDelay = 3000;
  private readonly MAX_RECONNECT_DELAY = 30000;
  private destroyed = false;

  events$: Observable<WhatsAppEvent> = this.eventsSubject.asObservable();

  constructor(private zone: NgZone, private auth: AuthService) {
    this.connect();
  }

  /**
   * EventSource no puede mandar cabeceras, así que el JWT viaja por query param:
   * el gateway lo traduce a `Authorization: Bearer` y lo quita de la URI antes de
   * reenviar al backend. Se arma en cada connect() para que al reconectar tome el
   * token renovado y no uno ya vencido.
   */
  private buildUrl(): string {
    const token = this.auth.getToken();
    return token ? `${this.URL}?token=${encodeURIComponent(token)}` : this.URL;
  }

  private connect(): void {
    if (this.destroyed || this.source) return;

    this.source = new EventSource(this.buildUrl());

    this.source.addEventListener('whatsapp', (event: MessageEvent) => {
      try {
        const data: WhatsAppEvent = JSON.parse(event.data);
        // Los callbacks de EventSource pueden caer fuera de la zona de Angular:
        // sin run(), los componentes OnPush no repintarían.
        this.zone.run(() => this.eventsSubject.next(data));
      } catch (error) {
        console.error('❌ Evento SSE ilegible:', error);
      }
    });

    this.source.addEventListener('ping', () => {
      console.log('✅ SSE WhatsApp conectado');
      this.reconnectDelay = 3000;
    });

    this.source.onerror = () => {
      // readyState CONNECTING = el navegador ya está reintentando solo.
      if (this.source?.readyState === EventSource.CLOSED) {
        this.cleanupSource();
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    if (this.destroyed || this.reconnectTimer) return;
    console.warn(`🔌 SSE cerrado. Reintentando en ${this.reconnectDelay}ms`);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.MAX_RECONNECT_DELAY);
      this.connect();
    }, this.reconnectDelay);
  }

  private cleanupSource(): void {
    this.source?.close();
    this.source = undefined;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.cleanupSource();
  }
}
