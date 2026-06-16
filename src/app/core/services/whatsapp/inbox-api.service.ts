import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ConversacionDto {
  id: number;
  chatJid: string;
  chatTitulo: string;
  estado: 'ACTIVA' | 'CERRADA';
  instanciaId: string;
  ultimaActividad: string;
}

export interface MensajeDto {
  id: number;
  wspMsgId: string;
  direccion: 'ENTRANTE' | 'SALIENTE';
  texto: string;
  tieneMedia: boolean;
  mediaTipo: string;
  mediaUrl: string;
  mediaMime: string;
  mediaNombre: string;
  quotedMsgId: string;
  quotedTexto: string;
  asesoraId: number;
  asesoraNombre: string;
  estadoEntrega: 'PENDIENTE' | 'ENVIADO' | 'ENTREGADO' | 'LEIDO';
  timestampWsp: number;
}

@Injectable({
  providedIn: 'root'
})
export class InboxApiService {

  private readonly BASE = (environment as any).wspInboxUrl || 'http://localhost:8085/api/v1/wsp';

  constructor(private http: HttpClient) {}

  getConversaciones(): Observable<ConversacionDto[]> {
    return this.http.get<ConversacionDto[]>(`${this.BASE}/conversaciones`);
  }

  getMensajes(conversacionId: number): Observable<MensajeDto[]> {
    return this.http.get<MensajeDto[]>(`${this.BASE}/conversaciones/${conversacionId}/mensajes`);
  }
}
