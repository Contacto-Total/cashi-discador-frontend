import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** intensidad automática por tramo y proveedores de llamadas. */
export interface UltimoMinuto {
  fecha: string;
  decision: 'CANALES_LLENOS' | 'BAJA' | 'SUBE' | 'MANTIENE';
  motivo: string | null;
  intensidadAnterior: number;
  intensidadNueva: number;
  /** Suma de los puntos de las 6 variables (0 a 100); null en registros de antes de la regla de puntaje. */
  puntaje: number | null;
  /** % que cambió, después de las reglas de seguridad. */
  cambioPct: number | null;
  campanas: number;
  asesoresDisponibles: number;
  asesoresLibresLargo: number;
  tipificandoLargo: number;
  enCola: number;
  esperaMaximaSeg: number;
  entraronCola: number;
  colgaronCola: number;
  abandonoPct: number | null;
  llamadasProveedor: number | null;
  canales: number | null;
  /** Clientes distintos marcados hoy por hora. */
  avance: number | null;
  /** % de las llamadas de hoy que llegaron a un asesor. */
  contactabilidadPct: number | null;
  /** Llamadas lanzadas en los últimos 5 min; con 0 la intensidad no cambia. */
  marcadas5Min: number | null;
}

export interface Tramo {
  idSubcartera: number;
  nombre: string;
  activo: boolean;
  intensidadInicial: number;
  /** La de hoy: la inicial si todavía no se decidió nada en el día. */
  intensidadActual: number;
  piso: number;
  esperaMaximaSeg: number;
  /** Clientes por hora de una campaña normal del tramo; null si no está cargado (la variable no suma). */
  avanceNormal: number | null;
  /** % de marcadas que llegan a un asesor en el tramo; null si no está cargado. */
  contactabilidadNormalPct: number | null;
  ultimoMinuto: UltimoMinuto | null;
}

/** Lo único que se edita por tramo. */
export interface TramoCambio {
  activo: boolean;
  intensidadInicial: number;
  esperaMaximaSeg: number;
}

export interface Proveedor {
  id: number;
  nombre: string;
  gateway: string;
  prefijo: string;
  canales: number | null;
  prioridad: number;
  habilitado: boolean;
  enUso: boolean;
  actualizadoPor: string | null;
  actualizadoEn: string | null;
}

export interface ProveedorCambio {
  nombre: string;
  gateway: string;
  prefijo: string;
  canales: number | null;
  prioridad: number;
  habilitado: boolean;
}

export interface CambioProveedor {
  fecha: string;
  gatewayAnterior: string | null;
  gatewayNuevo: string;
  motivo: 'PING' | 'FALLAS' | 'VUELTA' | 'MANUAL';
  detalle: string | null;
  usuario: string | null;
}

export interface EstadoControl {
  tramos: Tramo[];
  proveedores: Proveedor[];
  gatewayEnUso: string;
  cambioAutomatico: boolean;
  cambios: CambioProveedor[];
}

@Injectable({ providedIn: 'root' })
export class ControlIntensidadService {
  private readonly http = inject(HttpClient);
  // Bajo /mantenimiento: el api-gateway ya enruta ese prefijo al discador.
  private readonly api = `${environment.gatewayUrl}/mantenimiento/control-intensidad`;

  estado(): Observable<EstadoControl> {
    return this.http.get<EstadoControl>(this.api);
  }

  guardarTramo(idSubcartera: number, cambio: TramoCambio): Observable<Tramo> {
    return this.http.put<Tramo>(`${this.api}/tramos/${idSubcartera}`, cambio);
  }

  crearProveedor(cambio: ProveedorCambio): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.api}/proveedores`, cambio);
  }

  guardarProveedor(id: number, cambio: ProveedorCambio): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.api}/proveedores/${id}`, cambio);
  }

  /** Cada minuto que decidió hoy el control para un tramo, del primero al último. */
  historial(idSubcartera: number): Observable<UltimoMinuto[]> {
    return this.http.get<UltimoMinuto[]>(`${this.api}/tramos/${idSubcartera}/historial`);
  }

  /** Subcarteras con intensidad automática; lo usan las pantallas de campañas. */
  subcarterasAutomaticas(): Observable<number[]> {
    return this.http.get<number[]>(`${this.api}/automaticas`);
  }

  usarProveedor(id: number): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.api}/proveedores/${id}/usar`, {});
  }
}
