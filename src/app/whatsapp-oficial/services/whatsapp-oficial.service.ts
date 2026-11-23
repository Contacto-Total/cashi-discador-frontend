import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  WaoBaja, WaoPalabraProhibida, WaoEstado, WaoMensaje, WaoEspectador, WaoPlantillasRespuesta, WaoResumen, WaoUsuario
} from '../models/whatsapp-oficial.models';

@Injectable({ providedIn: 'root' })
export class WhatsappOficialService {
  private readonly base = `${environment.apiUrl}/whatsapp-oficial`;

  constructor(private readonly http: HttpClient) {}

  estado(): Observable<WaoEstado> {
    return this.http.get<WaoEstado>(`${this.base}/estado`);
  }

  resumen(): Observable<WaoResumen> {
    return this.http.get<WaoResumen>(`${this.base}/resumen`);
  }

  conversaciones(limite = 100): Observable<WaoMensaje[]> {
    return this.http.get<WaoMensaje[]>(`${this.base}/conversaciones`, { params: { limite } });
  }

  mensajes(contacto: string, limite = 200): Observable<WaoMensaje[]> {
    return this.http.get<WaoMensaje[]>(
      `${this.base}/conversaciones/${encodeURIComponent(contacto)}/mensajes`, { params: { limite } });
  }

  enviarTexto(waId: string, texto: string): Observable<WaoMensaje> {
    return this.http.post<WaoMensaje>(`${this.base}/mensajes/texto`, { waId, texto });
  }

  enviarPlantilla(waId: string, plantilla: string, idioma: string, parametros: string[]): Observable<WaoMensaje> {
    return this.http.post<WaoMensaje>(`${this.base}/mensajes/plantilla`, { waId, plantilla, idioma, parametros });
  }

  plantillas(): Observable<WaoPlantillasRespuesta> {
    return this.http.get<WaoPlantillasRespuesta>(`${this.base}/plantillas`);
  }

  bajas(): Observable<WaoBaja[]> {
    return this.http.get<WaoBaja[]>(`${this.base}/bajas`);
  }

  registrarBaja(waId: string, motivo: string): Observable<WaoBaja> {
    return this.http.post<WaoBaja>(`${this.base}/bajas`, { waId, motivo });
  }

  quitarBaja(waId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/bajas/${encodeURIComponent(waId)}`);
  }

  palabrasProhibidas(): Observable<WaoPalabraProhibida[]> {
    return this.http.get<WaoPalabraProhibida[]>(`${this.base}/palabras-prohibidas`);
  }

  agregarPalabraProhibida(palabra: string, alternativas: string): Observable<WaoPalabraProhibida> {
    return this.http.post<WaoPalabraProhibida>(`${this.base}/palabras-prohibidas`, { palabra, alternativas });
  }

  quitarPalabraProhibida(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/palabras-prohibidas/${id}`);
  }

  media(id: number): Observable<Blob> {
    return this.http.get(`${this.base}/mensajes/${id}/media`, { responseType: 'blob' });
  }

  usuario(username: string): Observable<WaoUsuario> {
    return this.http.get<WaoUsuario>(`${this.base}/usuarios/${encodeURIComponent(username)}`);
  }

  enviarArchivo(numero: string, archivo: File, texto: string): Observable<WaoMensaje> {
    const datos = new FormData();
    datos.append('numero', numero);
    datos.append('archivo', archivo, archivo.name);
    if (texto) datos.append('texto', texto);
    return this.http.post<WaoMensaje>(`${this.base}/mensajes/archivo`, datos);
  }

  viendo(chat: string): Observable<WaoEspectador[]> {
    return this.http.post<WaoEspectador[]>(`${this.base}/conversaciones/${encodeURIComponent(chat)}/viendo`, {});
  }

  dejarDeVer(chat: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/conversaciones/${encodeURIComponent(chat)}/viendo`);
  }
}
