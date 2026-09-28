import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AuditoriaComision,
  Cartera,
  CrearPeriodoRequest,
  DetalleComision,
  EscalaComision,
  EstadoPeriodo,
  Inquilino,
  PeriodoComision,
  PlantillaSubcartera,
  ReportePeriodo,
  RolCashi,
  RolElegido,
  Subcartera,
  SustentoPeriodo,
  UsuarioCashi
} from '../models/comision.model';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.gatewayUrl}/comisiones`;

  // ==================== CATÁLOGOS (los usan también otros módulos) ====================

  obtenerInquilinos(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.baseUrl}/inquilinos`);
  }

  obtenerCarteras(idInquilino: number): Observable<Cartera[]> {
    const params = new HttpParams().set('idInquilino', idInquilino);
    return this.http.get<Cartera[]>(`${this.baseUrl}/carteras`, { params });
  }

  obtenerSubcarteras(idCartera: number): Observable<Subcartera[]> {
    const params = new HttpParams().set('idCartera', idCartera);
    return this.http.get<Subcartera[]>(`${this.baseUrl}/subcarteras`, { params });
  }

  obtenerJerarquiaSubcartera(idSubcartera: number): Observable<{ idInquilino: number; idCartera: number }> {
    return this.http.get<{ idInquilino: number; idCartera: number }>(`${this.baseUrl}/subcarteras/${idSubcartera}/jerarquia`);
  }

  // ==================== CONFIGURACIÓN DE LA SUBCARTERA ====================

  obtenerPlantilla(idSubcartera: number): Observable<PlantillaSubcartera> {
    return this.http.get<PlantillaSubcartera>(`${this.baseUrl}/subcarteras/${idSubcartera}/plantilla`);
  }

  guardarPlantilla(idSubcartera: number, plantilla: Partial<PlantillaSubcartera>): Observable<PlantillaSubcartera> {
    return this.http.put<PlantillaSubcartera>(`${this.baseUrl}/subcarteras/${idSubcartera}/plantilla`, plantilla);
  }

  listarRolesSubcartera(idSubcartera: number): Observable<RolCashi[]> {
    return this.http.get<RolCashi[]>(`${this.baseUrl}/subcarteras/${idSubcartera}/roles-disponibles`);
  }

  listarUsuariosSubcartera(idSubcartera: number): Observable<UsuarioCashi[]> {
    return this.http.get<UsuarioCashi[]>(`${this.baseUrl}/subcarteras/${idSubcartera}/usuarios`);
  }

  // ==================== PERÍODOS ====================

  listarPeriodos(anio: number, mes: number): Observable<PeriodoComision[]> {
    const params = new HttpParams().set('anio', anio).set('mes', mes);
    return this.http.get<PeriodoComision[]>(`${this.baseUrl}/periodos`, { params });
  }

  crearPeriodo(request: CrearPeriodoRequest): Observable<ReportePeriodo> {
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos`, request);
  }

  obtenerPeriodo(id: number): Observable<ReportePeriodo> {
    return this.http.get<ReportePeriodo>(`${this.baseUrl}/periodos/${id}`);
  }

  eliminarPeriodo(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/periodos/${id}`);
  }

  guardarTramos(id: number, tramos: EscalaComision[]): Observable<ReportePeriodo> {
    return this.http.put<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/tramos`, tramos);
  }

  listarRolesDisponibles(id: number): Observable<RolCashi[]> {
    return this.http.get<RolCashi[]>(`${this.baseUrl}/periodos/${id}/roles-disponibles`);
  }

  guardarRoles(id: number, roles: RolElegido[]): Observable<ReportePeriodo> {
    return this.http.put<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/roles`, roles);
  }

  cambiarQuitado(id: number, idResultado: number, quitado: boolean): Observable<ReportePeriodo> {
    const params = new HttpParams().set('quitado', quitado);
    return this.http.put<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/participantes/${idResultado}/quitado`, null, { params });
  }

  /** Recalcula a mano con los pagos de este momento (EN_CURSO o EN_REVISION) */
  actualizar(id: number): Observable<ReportePeriodo> {
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/actualizar`, null);
  }

  cambiarEstado(id: number, estado: EstadoPeriodo): Observable<ReportePeriodo> {
    const params = new HttpParams().set('estado', estado);
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/estado`, null, { params });
  }

  obtenerSustento(id: number, idResultado?: number): Observable<SustentoPeriodo> {
    let params = new HttpParams();
    if (idResultado != null) {
      params = params.set('idResultado', idResultado);
    }
    return this.http.get<SustentoPeriodo>(`${this.baseUrl}/periodos/${id}/sustento`, { params });
  }

  /** Detalle pago a pago; sin idResultado (o con el supervisor) trae el de todos los asesores */
  obtenerDetalle(id: number, idResultado?: number): Observable<DetalleComision[]> {
    let params = new HttpParams();
    if (idResultado != null) {
      params = params.set('idResultado', idResultado);
    }
    return this.http.get<DetalleComision[]>(`${this.baseUrl}/periodos/${id}/detalle`, { params });
  }

  historial(id: number): Observable<AuditoriaComision[]> {
    return this.http.get<AuditoriaComision[]>(`${this.baseUrl}/periodos/${id}/historial`);
  }

  exportarExcelPeriodo(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/periodos/${id}/excel`, { responseType: 'blob' });
  }

  exportarExcelParticipante(id: number, idResultado: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/periodos/${id}/participantes/${idResultado}/excel`, { responseType: 'blob' });
  }
}
