import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/** Columna de la base de la subcartera. */
export interface ColumnaBase {
  columna: string;
  nombre: string;
  tipo: 'TEXTO' | 'NUMERO' | 'FECHA' | 'SINO';
}

export type TipoFiltro = 'LISTA' | 'MENOR' | 'MAYOR' | 'IGUAL' | 'ENTRE' | 'VACIO' | 'RANGO_FECHA';

/** Filtro que EXCLUYE filas. En LISTA, `valores` son los valores desmarcados. */
export interface FiltroContingencia {
  columna: string;
  tipo: TipoFiltro;
  valores?: string[];
  desde?: string;
  hasta?: string;
}

export interface PrioridadContingencia {
  columna: string;
  direccion: 'DESC' | 'ASC';
}

export interface FilasContingencia {
  totalTabla: number;
  excluidasBlacklistPago: number;
  base: number;
  quedan: number;
  clientes: number;
  filas: Record<string, unknown>[];
}

export interface ValorColumna {
  valor: string;
  filas: number;
}

export interface GenerarContingencia {
  idSubcartera: number;
  filtros: FiltroContingencia[];
  prioridad: PrioridadContingencia[];
  nombre: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin: string;
  modoDiscado: 'MANUAL' | 'PROGRESSIVE' | 'PREDICTIVE';
  intensidad: number | null;
}

export interface UsuarioAcceso {
  idUsuario: number;
  usuario: string;
  nombre: string;
  roles: string;
  habilitado: boolean;
}

/** Valor con el que la lista de un filtro representa las celdas vacías (igual que el backend). */
export const VACIO = '__VACIO__';

@Injectable({ providedIn: 'root' })
export class CampaignContingenciaService {
  private http = inject(HttpClient);
  private api = `${environment.gatewayUrl}/admin/campaigns/contingencia`;

  columnas(idSubcartera: number): Observable<ColumnaBase[]> {
    return this.http.get<ColumnaBase[]>(`${this.api}/columnas/${idSubcartera}`);
  }

  filas(idSubcartera: number, filtros: FiltroContingencia[], prioridad: PrioridadContingencia[],
        pagina: number, tamano: number): Observable<FilasContingencia> {
    return this.http.post<FilasContingencia>(`${this.api}/filas`, { idSubcartera, filtros, prioridad, pagina, tamano });
  }

  valores(idSubcartera: number, filtros: FiltroContingencia[], columna: string, buscar: string): Observable<ValorColumna[]> {
    return this.http.post<ValorColumna[]>(`${this.api}/valores`, { idSubcartera, filtros, columna, buscar });
  }

  generar(req: GenerarContingencia): Observable<{ campaignId: number; contactosImportados: number }> {
    return this.http.post<{ campaignId: number; contactosImportados: number }>(`${this.api}/generar`, req);
  }

  // ── Acceso: los ADMIN siempre; los demás, solo si un ADMIN se la dio ──
  private apiAcceso = `${environment.gatewayUrl}/admin/campaigns/contingencia-acceso`;

  /** ¿El usuario de la sesión la puede usar? */
  mio(): Observable<{ habilitado: boolean }> {
    return this.http.get<{ habilitado: boolean }>(`${this.apiAcceso}/mio`);
  }

  /** Solo ADMIN: quienes entran a Gestión de campañas y si ya la tienen. */
  usuariosAcceso(): Observable<UsuarioAcceso[]> {
    return this.http.get<UsuarioAcceso[]>(`${this.apiAcceso}/usuarios`);
  }

  /** Solo ADMIN. */
  cambiarAcceso(idUsuario: number, habilitado: boolean): Observable<{ habilitado: boolean }> {
    return this.http.put<{ habilitado: boolean }>(`${this.apiAcceso}/usuarios/${idUsuario}`, { habilitado });
  }
}
