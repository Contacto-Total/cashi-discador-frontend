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
  private latencyInterval: any = null;
  private currentExtension: string | null = null;

  constructor(private authService: AuthService) {}

  connect(): void {
    // Guard: prevent duplicate connections
    if (this.stompClient && this.stompClient.active) {
      console.log('[WebSocket] Already connected/connecting, skipping duplicate connect()');
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      console.error('Cannot connect to WebSocket: No authentication token');
      return;
    }

    // Deactivate any orphaned client before creating a new one
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
      } catch (e) {
        // Ignore errors from orphaned client
      }
      this.stompClient = null;
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
    console.log(`[WebSocket] subscribe() called for topic: ${topic}, already exists: ${this.messageSubjects.has(topic)}`);

    if (!this.messageSubjects.has(topic)) {
      const subject = new Subject<any>();
      this.messageSubjects.set(topic, subject);

      if (this.stompClient && this.stompClient.connected) {
        console.log(`[WebSocket] Client connected, subscribing immediately to ${topic}`);
        this.subscribeToTopic(topic, subject);
      } else {
        console.log(`[WebSocket] Client not connected yet, waiting for connection to subscribe to ${topic}`);
        // Wait for connection then subscribe
        const subscription = this.connectionStatus$.subscribe(connected => {
          console.log(`[WebSocket] connectionStatus$ emitted: ${connected} for pending topic ${topic}`);
          // Double-check that the client is actually connected
          if (connected && this.stompClient?.connected) {
            this.subscribeToTopic(topic, subject);
            subscription.unsubscribe();
          }
        });
      }
    }

    return this.messageSubjects.get(topic)!.asObservable();
  }

  private subscribeToTopic(topic: string, subject: Subject<any>): void {
    // Guard against calling subscribe when not connected
    if (!this.stompClient?.connected) {
      console.warn(`[WebSocket] Cannot subscribe to ${topic}: STOMP client not connected`);
      return;
    }

    try {
      console.log(`[WebSocket] 🔌 Subscribing to topic: ${topic}`);
      this.stompClient.subscribe(topic, (message: IMessage) => {
        try {
          console.log(`[WebSocket] 📨 Raw message on ${topic}:`, message.body);
          const payload = JSON.parse(message.body);
          console.log(`[WebSocket] 📦 Parsed payload on ${topic}:`, payload);
          subject.next(payload);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      });
    } catch (error) {
      console.error(`[WebSocket] Error subscribing to ${topic}:`, error);
    }
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

  /**
   * Start measuring latency via WebSocket ping-pong
   * @param extension The SIP extension (e.g., "1001")
   */
  startLatencyMonitoring(extension: string): void {
    this.currentExtension = extension;

    // Subscribe to PONG responses
    this.subscribe('/user/queue/latency').subscribe((pongMessage: any) => {
      if (pongMessage.type === 'PONG' && pongMessage.clientTimestamp) {
        const now = Date.now();
        const rtt = now - pongMessage.clientTimestamp; // Round-trip time in milliseconds

        console.log(`📡 Latency for ${extension}: ${rtt} ms`);

        // Send latency update to backend
        this.send('/app/latency.update', {
          extension: extension,
          latency: rtt
        });
      }
    });

    // Send PING every 10 seconds
    this.latencyInterval = setInterval(() => {
      if (this.isConnected() && this.currentExtension) {
        const timestamp = Date.now();
        this.send('/app/latency.ping', {
          type: 'PING',
          timestamp: timestamp,
          extension: this.currentExtension
        });
      }
    }, 10000); // Every 10 seconds

    // Send first ping immediately
    if (this.isConnected()) {
      const timestamp = Date.now();
      this.send('/app/latency.ping', {
        type: 'PING',
        timestamp: timestamp,
        extension: extension
      });
    }
  }

  /**
   * Stop latency monitoring
   */
  stopLatencyMonitoring(): void {
    if (this.latencyInterval) {
      clearInterval(this.latencyInterval);
      this.latencyInterval = null;
    }
    this.currentExtension = null;
  }
}
