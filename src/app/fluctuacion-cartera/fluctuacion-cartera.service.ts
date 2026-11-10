import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  DashboardFluctuacion, ModoFluctuacion, PeriodoFluctuacion, SubcarteraFluctuacion
} from './fluctuacion-cartera.model';

/** REQ-054 Fluctuación de cartera. Solo lectura. */
@Injectable({ providedIn: 'root' })
export class FluctuacionCarteraService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.gatewayUrl}/dashboard/fluctuacion-cartera`;

  /** Subcarteras con historial de asignación dentro del alcance del usuario. */
  subcarteras(): Observable<SubcarteraFluctuacion[]> {
    return this.http.get<SubcarteraFluctuacion[]>(`${this.baseUrl}/subcarteras`);
  }

  /** Cortes disponibles, del más reciente al más antiguo. */
  periodos(idSubcartera: number, modo: ModoFluctuacion): Observable<PeriodoFluctuacion[]> {
    const params = new HttpParams().set('idSubcartera', idSubcartera).set('modo', modo);
    return this.http.get<PeriodoFluctuacion[]>(`${this.baseUrl}/periodos`, { params });
  }

  dashboard(idSubcartera: number, modo: ModoFluctuacion, corte?: string): Observable<DashboardFluctuacion> {
    let params = new HttpParams().set('idSubcartera', idSubcartera).set('modo', modo);
    if (corte) {
      params = params.set('corte', corte);
    }
    return this.http.get<DashboardFluctuacion>(this.baseUrl, { params });
  }
}
