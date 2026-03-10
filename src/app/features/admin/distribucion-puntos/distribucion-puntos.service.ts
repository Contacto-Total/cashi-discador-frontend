import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DistribucionPuntosDetalle {
  id?: number;
  dia: string;
  puntoOriginal: number;
  esDiaLaboral: boolean;
  puntoEfectivo: number;
}

export interface DistribucionPuntos {
  id?: number;
  idCartera: number;
  idSubcartera: number;
  nombreSubcartera: string;
  nombreCartera: string;
  anio: number;
  mes: number;
  sumaPuntosOriginal: number;
  activo: boolean;
  fechaCarga: string;
  cargadoPor: string;
  detalles: DistribucionPuntosDetalle[];
}

export interface ImportResult {
  exitoso: boolean;
  mensaje: string;
  distribucion?: DistribucionPuntos;
}

export interface ConfigDiaLaboral {
  id?: number;
  idCartera: number;
  nombreCartera: string;
  trabajaSabado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DistribucionPuntosService {
  private readonly baseUrl = `${environment.gatewayUrl}/distribucion-puntos`;
  private readonly configUrl = `${environment.gatewayUrl}/config-dia-laboral`;

  constructor(private http: HttpClient) {}

  importar(file: File, idCartera: number, idSubcartera: number,
           nombreCartera: string, nombreSubcartera: string,
           anio: number, mes: number): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idCartera', idCartera.toString());
    formData.append('idSubcartera', idSubcartera.toString());
    formData.append('nombreCartera', nombreCartera);
    formData.append('nombreSubcartera', nombreSubcartera);
    formData.append('anio', anio.toString());
    formData.append('mes', mes.toString());
    return this.http.post<ImportResult>(`${this.baseUrl}/import`, formData);
  }

  listar(anio: number, mes: number): Observable<DistribucionPuntos[]> {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    return this.http.get<DistribucionPuntos[]>(this.baseUrl, { params });
  }

  obtener(id: number): Observable<DistribucionPuntos> {
    return this.http.get<DistribucionPuntos>(`${this.baseUrl}/${id}`);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  recalcular(id: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/recalcular`, {});
  }

  // Config dia laboral
  listarConfig(): Observable<ConfigDiaLaboral[]> {
    return this.http.get<ConfigDiaLaboral[]>(this.configUrl);
  }

  guardarConfig(config: ConfigDiaLaboral): Observable<ConfigDiaLaboral> {
    return this.http.post<ConfigDiaLaboral>(this.configUrl, config);
  }
}
