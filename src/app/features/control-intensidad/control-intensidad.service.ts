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
  abandonoMaximoPct: number;
  asesorLibreSeg: number;
  tipificandoMaximoSeg: number;
  ventanaAbandonoMin: number;
  actualizadoPor: string | null;
  actualizadoEn: string | null;
  ultimoMinuto: UltimoMinuto | null;
}

export interface TramoCambio {
  nombre: string;
  activo: boolean;
  intensidadInicial: number;
  esperaMaximaSeg: number;
  abandonoMaximoPct: number;
  asesorLibreSeg: number;
  tipificandoMaximoSeg: number;
  ventanaAbandonoMin: number;
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

  usarProveedor(id: number): Observable<Proveedor> {
    return this.http.post<Proveedor>(`${this.api}/proveedores/${id}/usar`, {});
  }
}
