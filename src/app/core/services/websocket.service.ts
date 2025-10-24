import { Injectable } from '@angular/core';
import { Client, IMessage, StompConfig } from '@stomp/stompjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import SockJS from 'sockjs-client';

// Patch XMLHttpRequest globally if using ngrok to avoid CORS wildcard issues
if (typeof window !== 'undefined' && environment.wsUrl.includes('ngrok')) {
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
    const urlStr = url.toString();
    if (urlStr.includes('ngrok')) {
      Object.defineProperty(this, 'withCredentials', {
        get: () => false,
        set: () => {},
        configurable: true
      });
    }
    return originalOpen.apply(this, [method, url, ...args] as any);
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: Client | null = null;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  public connectionStatus$ = this.connectionStatus.asObservable();
  private messageSubjects: Map<string, Subject<any>> = new Map();

  constructor(private authService: AuthService) {}

  connect(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.error('Cannot connect to WebSocket: No authentication token');
      return;
    }

    const config: StompConfig = {
      webSocketFactory: () => new SockJS(environment.wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP: ' + str);
      },
      onConnect: () => {
        console.log('WebSocket Connected');
        this.connectionStatus.next(true);
      },
      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        this.connectionStatus.next(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      }
    };

    this.stompClient = new Client(config);
    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
      this.connectionStatus.next(false);
      this.messageSubjects.clear();
    }
  }

  subscribe(topic: string): Observable<any> {
    if (!this.messageSubjects.has(topic)) {
      const subject = new Subject<any>();
      this.messageSubjects.set(topic, subject);

      if (this.stompClient && this.stompClient.connected) {
        this.subscribeToTopic(topic, subject);
      } else {
        // Wait for connection then subscribe
        const subscription = this.connectionStatus$.subscribe(connected => {
          if (connected && this.stompClient) {
            this.subscribeToTopic(topic, subject);
            subscription.unsubscribe();
          }
        });
      }
    }

    return this.messageSubjects.get(topic)!.asObservable();
  }

  private subscribeToTopic(topic: string, subject: Subject<any>): void {
    this.stompClient?.subscribe(topic, (message: IMessage) => {
      try {
        const payload = JSON.parse(message.body);
        subject.next(payload);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    });
  }

  send(destination: string, body: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(body)
      });
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  }

  isConnected(): boolean {
    return this.connectionStatus.value;
  }
}
