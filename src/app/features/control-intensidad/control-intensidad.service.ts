import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/** REQ-022: control automático de intensidad del discador y canales por proveedor. */
export interface ConfigControl {
  activo: boolean;
  subcarteras: string | null;
  abandonoObjetivo: number;
  margenSeguridad: number;
  maxPorSegundo: number;
  volumenArranque: number;
  ventanaMinutos: number;
  actualizadoPor: string | null;
  actualizadoEn: string | null;
}

export interface ProveedorCanales {
  id: number;
  gateway: string;
  nombre: string;
  canales: number | null;
  /** Es el gateway por el que sale hoy el backend. */
  enUso: boolean;
  actualizadoPor: string | null;
  actualizadoEn: string | null;
}

export interface CampanaControl {
  idCampana: number;
  campana: string;
  /** Asesores disponibles que le tocan, ya repartidos con otras campañas. */
  capacidad: number;
  enCurso: number;
  pendientes: number;
  objetivoManual: number;
  objetivo: number;
  factor: number;
  abandonoPct: number | null;
  recortada: boolean;
}

export interface EstadoControl {
  config: ConfigControl;
  gatewayEnUso: string;
  proveedores: ProveedorCanales[];
  campanas: CampanaControl[];
}

export interface CambioConfig {
  activo: boolean;
  subcarteras: string;
  abandonoObjetivo: number;
  margenSeguridad: number;
  maxPorSegundo: number;
}

@Injectable({ providedIn: 'root' })
export class ControlIntensidadService {
  private readonly http = inject(HttpClient);
  // Bajo /mantenimiento: el api-gateway ya enruta ese prefijo al discador.
  private readonly api = `${environment.gatewayUrl}/mantenimiento/control-intensidad`;

  estado(): Observable<EstadoControl> {
    return this.http.get<EstadoControl>(this.api);
  }

  guardarConfig(cambio: CambioConfig): Observable<ConfigControl> {
    return this.http.put<ConfigControl>(`${this.api}/config`, cambio);
  }

  guardarCanales(idProveedor: number, canales: number | null): Observable<ProveedorCanales> {
    return this.http.put<ProveedorCanales>(`${this.api}/proveedores/${idProveedor}`, { canales });
  }
}
