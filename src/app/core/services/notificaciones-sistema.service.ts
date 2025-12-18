import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface NotificacionSistema {
  id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  fechaCreacion: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificacionesSistemaService {
  private apiUrl = `${environment.apiUrl}/notificaciones`;

  // BehaviorSubject para el contador de no leídas
  private countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {
    // Polling cada 60 segundos para actualizar el contador
    interval(60000).subscribe(() => {
      this.refreshCount();
    });
  }

  /**
   * Obtener todas las notificaciones
   * Maneja silenciosamente el error si el endpoint no existe
   */
  getAll(): Observable<NotificacionSistema[]> {
    return this.http.get<NotificacionSistema[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  /**
   * Obtener solo las no leídas
   */
  getNoLeidas(): Observable<NotificacionSistema[]> {
    return this.http.get<NotificacionSistema[]>(`${this.apiUrl}/no-leidas`);
  }

  /**
   * Obtener el conteo de no leídas
   * Maneja silenciosamente el error 404 si el endpoint no existe
   */
  getCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/count`).pipe(
      tap(response => this.countSubject.next(response.count)),
      catchError(() => {
        // Si el endpoint no existe, retornar count 0 silenciosamente
        return of({ count: 0 });
      })
    );
  }

  /**
   * Refrescar el contador (llamar manualmente o desde el polling)
   */
  refreshCount(): void {
    this.getCount().subscribe();
  }

  /**
   * Marcar una notificación como leída
   */
  marcarComoLeida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/leer`, {}).pipe(
      tap(() => this.refreshCount())
    );
  }

  /**
   * Marcar todas como leídas
   */
  marcarTodasComoLeidas(): Observable<{ actualizadas: number }> {
    return this.http.patch<{ actualizadas: number }>(`${this.apiUrl}/leer-todas`, {}).pipe(
      tap(() => this.countSubject.next(0))
    );
  }
}
