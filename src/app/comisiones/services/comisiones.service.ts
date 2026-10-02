import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AgregarParticipanteRequest,
  AuditoriaComision,
  BonoPeriodo,
  CandidatoAsesor,
  Cartera,
  ConfiguracionPeriodo,
  DetalleComision,
  GrupoComision,
  Inquilino,
  MesPeriodo,
  MiPeriodoComision,
  ReportePeriodo,
  Subcartera,
  SupervisorCashi,
  VistaPeriodo
} from '../models/comision.model';

function conGrupo(params: HttpParams, grupo: GrupoComision | null): HttpParams {
  return grupo && grupo !== 'GENERAL' ? params.set('grupo', grupo) : params;
}

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

  /**
   * El período del mes si ya está configurado, y aunque no lo esté: pagos y meta INTERNA.
   * grupo: la cartera de Tramo Propio (ANTIGUA / NUEVA); null en las demás subcarteras.
   */
  obtenerVista(idSubcartera: number, anio: number, mes: number, grupo: GrupoComision | null): Observable<VistaPeriodo> {
    const params = conGrupo(new HttpParams().set('idSubcartera', idSubcartera).set('anio', anio).set('mes', mes), grupo);
    return this.http.get<VistaPeriodo>(`${this.baseUrl}/periodos/vista`, { params });
  }

  /** Los 12 meses del año de una subcartera (y cartera, en Tramo Propio) para el selector de período */
  listarMeses(idSubcartera: number, anio: number, grupo: GrupoComision | null): Observable<MesPeriodo[]> {
    const params = conGrupo(new HttpParams().set('idSubcartera', idSubcartera).set('anio', anio), grupo);
    return this.http.get<MesPeriodo[]>(`${this.baseUrl}/periodos/meses`, { params });
  }

  /** Candidatos a asesor del mes: el personal con la subcartera asignada (en Tramo Propio, marca a quien está en la otra cartera) */
  listarAsesores(idSubcartera: number, anio: number, mes: number, grupo: GrupoComision | null): Observable<CandidatoAsesor[]> {
    const params = conGrupo(new HttpParams().set('idSubcartera', idSubcartera).set('anio', anio).set('mes', mes), grupo);
    return this.http.get<CandidatoAsesor[]>(`${this.baseUrl}/periodos/asesores`, { params });
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

  // ==================== MIS COMISIONES (solo lo del usuario de la sesión) ====================

  /** Períodos recalculados en los que participa, del más reciente al más antiguo */
  misPeriodos(): Observable<MiPeriodoComision[]> {
    return this.http.get<MiPeriodoComision[]>(`${this.baseUrl}/mis`);
  }

  /** El período con solo su fila */
  miPeriodo(id: number): Observable<ReportePeriodo> {
    return this.http.get<ReportePeriodo>(`${this.baseUrl}/mis/${id}`);
  }

  /** Su detalle pago a pago (el supervisor, el de sus asesores) */
  miDetalle(id: number): Observable<DetalleComision[]> {
    return this.http.get<DetalleComision[]>(`${this.baseUrl}/mis/${id}/detalle`);
  }
}
