import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WSMessage } from '../../models/message.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private socket?: WebSocket;
  private messagesSubject = new Subject<WSMessage>();
  private readonly WS_URL = (environment as any).whatsappBackendWsUrl || '';
  private reconnectInterval = 3000;
  private reconnectTimer?: any;
  private destroyed = false;

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.destroyed) return;
    if (!this.WS_URL) {
      console.warn('WebSocket WhatsApp no configurado para backend v2');
      return;
    }
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.socket = new WebSocket(this.WS_URL);

    this.socket.onopen = () => {
      console.log('✅ WebSocket WhatsApp conectado');
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = undefined;
      }
    };

    this.socket.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        this.messagesSubject.next(data);
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    this.socket.onclose = () => {
      if (!this.destroyed) {
        console.log('🔌 WebSocket desconectado. Reconectando...');
        this.scheduleReconnect();
      }
    };

    this.socket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      this.socket?.close();
    };
  }

  private scheduleReconnect(): void {
    if (!this.destroyed && !this.reconnectTimer) {
      this.reconnectTimer = setTimeout(() => {
        this.reconnectTimer = undefined;
        this.connect();
      }, this.reconnectInterval);
    }
  }

  getMessages(): Observable<WSMessage> {
    return this.messagesSubject.asObservable();
  }

  disconnect(): void {
    this.destroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.socket?.close();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
