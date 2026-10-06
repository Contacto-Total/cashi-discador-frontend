import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConfigUmbralEstado {
  id: number;
  estado: string;
  nombreUmbral: string;
  umbralVerdeSegundos: number;
  umbralAmarilloSegundos: number;
  umbralRojoSegundos: number;
  tiempoMaximoSegundos: number;
  alertaSupervisor: boolean;
  sonidoAlerta: boolean;
  activo: boolean;
  mensajeAlerta: string;
}

@Injectable({
  providedIn: 'root'
})
export class UmbralesEstadoService {
  private apiUrl = `${environment.apiUrl}/config/umbrales-estado`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ConfigUmbralEstado[]> {
    return this.http.get<ConfigUmbralEstado[]>(this.apiUrl);
  }

  update(id: number, data: Partial<ConfigUmbralEstado>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  recargarCache(): Observable<any> {
    return this.http.post(`${this.apiUrl}/recargar-cache`, {});
  }
}
