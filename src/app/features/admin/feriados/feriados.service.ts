import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Feriado {
  id?: number;
  fecha: string;
  descripcion: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeriadosService {
  private readonly baseUrl = `${environment.gatewayUrl}/feriados`;

  constructor(private http: HttpClient) {}

  listar(anio?: number): Observable<Feriado[]> {
    let params = new HttpParams();
    if (anio) params = params.set('anio', anio.toString());
    return this.http.get<Feriado[]>(this.baseUrl, { params });
  }

  crear(feriado: Feriado): Observable<Feriado> {
    return this.http.post<Feriado>(this.baseUrl, feriado);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
