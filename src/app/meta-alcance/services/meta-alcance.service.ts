import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MetaAlcanceResponse, MetaTimingResponse } from '../models/meta-alcance.model';

export interface MetaFiltro {
  anio?: number;
  mes?: number;
  idInquilino?: number;
  idCartera?: number;
  idSubcartera?: number;
  codigoRango?: string;
}

@Injectable({ providedIn: 'root' })
export class MetaAlcanceService {

  private readonly baseUrl = `${environment.gatewayUrl}/dashboard/meta`;

  constructor(private http: HttpClient) {}

  getAlcance(f: MetaFiltro): Observable<MetaAlcanceResponse> {
    return this.http.get<MetaAlcanceResponse>(`${this.baseUrl}/alcance`, { params: this.toParams(f) });
  }

  getTiming(f: MetaFiltro): Observable<MetaTimingResponse> {
    return this.http.get<MetaTimingResponse>(`${this.baseUrl}/timing`, { params: this.toParams(f) });
  }

  refrescar(f: MetaFiltro): Observable<{ ok: boolean; mensaje: string }> {
    return this.http.post<{ ok: boolean; mensaje: string }>(
      `${this.baseUrl}/refrescar`, null, { params: this.toParams(f) });
  }

  private toParams(f: MetaFiltro): HttpParams {
    let p = new HttpParams();
    if (f.anio != null) p = p.set('anio', f.anio.toString());
    if (f.mes != null) p = p.set('mes', f.mes.toString());
    if (f.idInquilino) p = p.set('idInquilino', f.idInquilino.toString());
    if (f.idCartera) p = p.set('idCartera', f.idCartera.toString());
    if (f.idSubcartera) p = p.set('idSubcartera', f.idSubcartera.toString());
    if (f.codigoRango) p = p.set('codigoRango', f.codigoRango);
    return p;
  }
}
