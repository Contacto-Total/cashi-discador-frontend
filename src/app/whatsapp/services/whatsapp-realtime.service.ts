import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { TypedWhatsAppEvent } from '../models';

@Injectable({ providedIn: 'root' })
export class WhatsappRealtimeService implements OnDestroy {
  private readonly eventsUrl = `${environment.apiUrl}/v2/whatsapp/events`;
  private readonly eventsSubject = new Subject<TypedWhatsAppEvent>();
  private eventSource?: EventSource;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private reconnectDelay = 3000;
  private readonly maxReconnectDelay = 30000;
  private destroyed = false;

  readonly events$: Observable<TypedWhatsAppEvent> = this.eventsSubject.asObservable();

  constructor(
    private readonly zone: NgZone,
    private readonly auth: AuthService
  ) {}

  connect(token?: string): Observable<TypedWhatsAppEvent> {
    this.destroyed = false;
    if (!this.eventSource) {
      const jwt = token || this.auth.getToken();
      const url = jwt ? `${this.eventsUrl}?token=${encodeURIComponent(jwt)}` : this.eventsUrl;
      this.eventSource = new EventSource(url);
      this.eventSource.onmessage = (event) => this.emitEvent(event.data);
      this.eventSource.addEventListener('whatsapp', (event) => this.emitEvent((event as MessageEvent).data));
      this.eventSource.addEventListener('ping', () => this.reconnectDelay = 3000);
      this.eventSource.onerror = () => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.cleanupSource();
          this.scheduleReconnect(token);
        }
      };
    }

    return this.events$;
  }

  disconnect(): void {
    this.destroyed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.cleanupSource();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private emitEvent(data: string): void {
    try {
      this.zone.run(() => this.eventsSubject.next(JSON.parse(data) as TypedWhatsAppEvent));
    } catch (error) {
      console.error('Error parsing WhatsApp SSE event', error);
    }
  }

  private scheduleReconnect(token?: string): void {
    if (this.destroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.reconnectDelay = Math.min(this.reconnectDelay * 2, this.maxReconnectDelay);
      this.connect(token);
    }, this.reconnectDelay);
  }

  private cleanupSource(): void {
    this.eventSource?.close();
    this.eventSource = undefined;
  }
}
