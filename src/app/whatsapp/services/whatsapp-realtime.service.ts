import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TypedWhatsAppEvent } from '../models';

@Injectable({ providedIn: 'root' })
export class WhatsappRealtimeService implements OnDestroy {
  private readonly eventsUrl = `${environment.apiUrl}/v2/whatsapp/events`;
  private readonly eventsSubject = new Subject<TypedWhatsAppEvent>();
  private eventSource?: EventSource;

  readonly events$: Observable<TypedWhatsAppEvent> = this.eventsSubject.asObservable();

  connect(token?: string): Observable<TypedWhatsAppEvent> {
    if (!this.eventSource) {
      const url = token ? `${this.eventsUrl}?token=${encodeURIComponent(token)}` : this.eventsUrl;
      this.eventSource = new EventSource(url);
      this.eventSource.onmessage = (event) => this.emitEvent(event.data);
      this.eventSource.onerror = (error) => this.eventsSubject.error(error);
    }

    return this.events$;
  }

  disconnect(): void {
    this.eventSource?.close();
    this.eventSource = undefined;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  private emitEvent(data: string): void {
    try {
      this.eventsSubject.next(JSON.parse(data) as TypedWhatsAppEvent);
    } catch (error) {
      console.error('Error parsing WhatsApp SSE event', error);
    }
  }
}
