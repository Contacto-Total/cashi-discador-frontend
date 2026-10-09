import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** Umbral de un estado. `idSubcartera` 0 es la configuración general. */
export interface ConfigUmbralEstado {
  id: number;
  estado: string;
  idSubcartera: number;
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

/** Subcartera que se puede configurar. */
export interface SubcarteraUmbral {
  idSubcartera: number;
  cliente: string;
  cartera: string;
  subcartera: string;
  asesores: number;
}

export interface CambioUmbral {
  estado: string;
  idSubcartera: number;
  umbralVerdeSegundos: number | null;
  umbralAmarilloSegundos: number | null;
  tiempoMaximoSegundos: number | null;
  alertaSupervisor: boolean;
  sonidoAlerta: boolean;
  activo: boolean;
}

/** Lo que se guarda de una vez: filas que cambian y filas de subcartera que vuelven a la general. */
export interface CambiosUmbrales {
  guardar: CambioUmbral[];
  quitar: { estado: string; idSubcartera: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class UmbralesEstadoService {
  private apiUrl = `${environment.apiUrl}/config/umbrales-estado`;

  constructor(private http: HttpClient) {}

  /** Todos: los generales y los de cada subcartera. */
  getAll(): Observable<ConfigUmbralEstado[]> {
    return this.http.get<ConfigUmbralEstado[]>(this.apiUrl);
  }

  /** Los umbrales activos que rigen para quien los pide, según su subcartera: el semáforo del asesor. */
  getActivos(): Observable<ConfigUmbralEstado[]> {
    return this.http.get<ConfigUmbralEstado[]>(`${this.apiUrl}/activos`);
  }

  getSubcarteras(): Observable<SubcarteraUmbral[]> {
    return this.http.get<SubcarteraUmbral[]>(`${this.apiUrl}/subcarteras`);
  }

  /** Guarda los cambios y devuelve cómo queda todo. */
  guardar(cambios: CambiosUmbrales): Observable<ConfigUmbralEstado[]> {
    return this.http.put<ConfigUmbralEstado[]>(this.apiUrl, cambios);
  }
}
