import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

/** Lo que el usuario tiene asignado, por nivel. Con `todo` no se le acota nada (administrador). */
export interface Alcance {
  todo: boolean;
  clientes: Set<number>;
  carteras: Set<number>;
  subcarteras: Set<number>;
}

interface AlcanceRespuesta {
  admin: boolean;
  subcarteras: { id: number; idCartera: number; idInquilino: number }[];
}

const NADA: Alcance = { todo: false, clientes: new Set(), carteras: new Set(), subcarteras: new Set() };

@Injectable({
  providedIn: 'root'
})
export class AlcanceService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private deQuien: string | null = null;
  private pedido: Observable<Alcance> | null = null;

  /**
   * Clientes, carteras y subcarteras asignados a quien tiene la sesión. Se pide una vez por
   * usuario. Si la consulta falla responde vacío, porque sin saber qué le toca no se le muestra
   * nada, y no se guarda: el siguiente pedido lo vuelve a intentar.
   */
  mio(): Observable<Alcance> {
    const usuario = this.auth.getCurrentUser()?.username ?? null;
    if (!this.pedido || usuario !== this.deQuien) {
      this.deQuien = usuario;
      this.pedido = this.http.get<AlcanceRespuesta>(`${environment.apiUrl}/menu/alcance`).pipe(
        map(r => ({
          todo: r.admin,
          clientes: new Set(r.subcarteras.map(s => s.idInquilino)),
          carteras: new Set(r.subcarteras.map(s => s.idCartera)),
          subcarteras: new Set(r.subcarteras.map(s => s.id))
        })),
        catchError(() => {
          this.pedido = null;
          return of(NADA);
        }),
        shareReplay(1)
      );
    }
    return this.pedido;
  }
}
