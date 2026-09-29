import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AgregarParticipanteRequest,
  AuditoriaComision,
  BonoPeriodo,
  Cartera,
  ConfiguracionPeriodo,
  DetalleComision,
  Inquilino,
  MesPeriodo,
  ReportePeriodo,
  RolCashi,
  Subcartera,
  SupervisorCashi,
  UsuarioCashi,
  VistaPeriodo
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

  // ==================== PERÍODOS ====================

  /** El período del mes si ya está configurado, y aunque no lo esté: pagos, meta INTERNA y rol sugerido */
  obtenerVista(idSubcartera: number, anio: number, mes: number): Observable<VistaPeriodo> {
    const params = new HttpParams().set('idSubcartera', idSubcartera).set('anio', anio).set('mes', mes);
    return this.http.get<VistaPeriodo>(`${this.baseUrl}/periodos/vista`, { params });
  }

  /** Los 12 meses del año de una subcartera para el selector de período */
  listarMeses(idSubcartera: number, anio: number): Observable<MesPeriodo[]> {
    const params = new HttpParams().set('idSubcartera', idSubcartera).set('anio', anio);
    return this.http.get<MesPeriodo[]>(`${this.baseUrl}/periodos/meses`, { params });
  }

  listarRolesSubcartera(idSubcartera: number): Observable<RolCashi[]> {
    return this.http.get<RolCashi[]>(`${this.baseUrl}/subcarteras/${idSubcartera}/roles-disponibles`);
  }

  /** Candidatos a asesor: usuarios activos con el rol */
  listarUsuariosRol(idRol: number): Observable<UsuarioCashi[]> {
    return this.http.get<UsuarioCashi[]>(`${this.baseUrl}/roles/${idRol}/usuarios`);
  }

  /** Candidatos a supervisor */
  listarSupervisores(): Observable<SupervisorCashi[]> {
    return this.http.get<SupervisorCashi[]>(`${this.baseUrl}/supervisores`);
  }

  /** Crea el período del mes si no existe o reemplaza la configuración de uno abierto. No calcula. */
  guardarConfiguracion(config: ConfiguracionPeriodo): Observable<ReportePeriodo> {
    return this.http.put<ReportePeriodo>(`${this.baseUrl}/periodos/configuracion`, config);
  }

  obtenerPeriodo(id: number): Observable<ReportePeriodo> {
    return this.http.get<ReportePeriodo>(`${this.baseUrl}/periodos/${id}`);
  }

  agregarParticipante(id: number, request: AgregarParticipanteRequest): Observable<ReportePeriodo> {
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/participantes`, request);
  }

  /** Reemplaza los bonos de un período abierto (se aplican al recalcular) */
  guardarBonos(id: number, bonos: BonoPeriodo[]): Observable<ReportePeriodo> {
    return this.http.put<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/bonos`, bonos);
  }

  /** Select de los pagos conciliados del mes, cálculo y guardado (el cálculo es manual) */
  recalcular(id: number): Observable<ReportePeriodo> {
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/recalcular`, null);
  }

  /** Congela el último recálculo; recalcular = true recalcula antes de cerrar */
  cerrar(id: number, recalcular = false): Observable<ReportePeriodo> {
    const params = new HttpParams().set('recalcular', recalcular);
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/cerrar`, null, { params });
  }

  reabrir(id: number): Observable<ReportePeriodo> {
    return this.http.post<ReportePeriodo>(`${this.baseUrl}/periodos/${id}/reabrir`, null);
  }

  /** Detalle pago a pago de todos los asesores */
  obtenerDetalle(id: number): Observable<DetalleComision[]> {
    return this.http.get<DetalleComision[]>(`${this.baseUrl}/periodos/${id}/detalle`);
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
