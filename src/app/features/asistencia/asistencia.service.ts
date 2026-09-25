import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AsistenciaReporte,
  AvisoAsistencia,
  CierreSemana,
  ControlAcceso,
  CambioAsistencia,
  TipoCambio,
  DashboardAsistencia,
  DiaCalendario,
  ImportacionFeriados,
  PerfilAsistencia,
  HorarioDeSemana,
  EquipoAutorizado,
  Horario,
  HorarioBase,
  CambioHorarioBase,
  Justificacion,
  MarcacionManual,
  MiPlan,
  PlanSemana,
  PoliticaAsistencia,
  PropuestaPlan,
  Recuperacion,
  ValidacionPlan,
  TipoDia
} from './asistencia.models';
import { conTipo } from './asistencia.estilos';

/**
 * Cliente de /api/asistencia.
 *
 * Estos endpoints no envuelven la respuesta en { success, data } como los de
 * tenores: devuelven el objeto directamente.
 */
@Injectable({ providedIn: 'root' })
export class AsistenciaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/asistencia`;

  reporte(
    desde: string,
    hasta: string,
    idSubcartera?: number | null,
    idsUsuarios?: number[]
  ): Observable<AsistenciaReporte> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    (idsUsuarios ?? []).forEach(id => {
      params = params.append('idsUsuarios', id);
    });
    return this.http.get<AsistenciaReporte>(`${this.url}/reporte`, { params });
  }

  /**
   * Completa o corrige una marca. El backend exige motivo y guarda quién la
   * escribió: es lo que el color amarillo de la hoja no dice.
   */
  completarMarcacion(marcacion: MarcacionManual): Observable<unknown> {
    return this.http.post(`${this.url}/marcaciones/manual`, marcacion);
  }

  /**
   * Avisa que hubo actividad real. No lleva hora: el reloj lo pone el servidor,
   * porque es el dato del que sale la hora de salida y no puede depender de lo
   * que mande el navegador.
   */
  avisarActividad(): Observable<void> {
    return this.http.post<void>(`${this.url}/marcaciones/actividad`, {});
  }

  /** Marca la salida al cerrar sesión. Tampoco lleva hora. */
  registrarSalida(): Observable<void> {
    return this.http.post<void>(`${this.url}/marcaciones/salida`, {});
  }

  /** El mismo reporte en Excel, con el formato de la hoja que ya usa RR.HH. */
  excel(desde: string, hasta: string, idSubcartera?: number | null): Observable<Blob> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get(`${this.url}/reporte/excel`, { params, responseType: 'blob' });
  }

  horarios(idSubcartera?: number | null, idUsuario?: number | null): Observable<Horario[]> {
    let params = new HttpParams();
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    if (idUsuario) {
      params = params.set('idUsuario', idUsuario);
    }
    return this.http.get<Horario[]>(`${this.url}/horarios`, { params });
  }

  /** No sobrescribe: cierra el horario vigente y abre uno nuevo. */
  guardarHorario(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(`${this.url}/horarios`, horario);
  }

  /** El horario de una semana: el fijo con lo que cambian las solicitudes. Solo lectura. */
  horarioSemana(idSubcartera: number, lunes: string): Observable<HorarioDeSemana> {
    return this.http.get<HorarioDeSemana>(`${this.url}/horario-semana`, { params: { idSubcartera, lunes } });
  }

  /** Si es RR.HH., si supervisa y qué subcarteras ve. */
  perfil(): Observable<PerfilAsistencia> {
    return this.http.get<PerfilAsistencia>(`${this.url}/perfil`);
  }

  /**
   * Lo que hay que decirle ahora sobre su jornada. Se consulta y no se empuja:
   * montar un canal solo para esto sería una pieza más que mantener.
   */
  misAvisos(): Observable<AvisoAsistencia[]> {
    return this.http.get<AvisoAsistencia[]>(`${this.url}/marcaciones/avisos`);
  }

  /** El suyo: mismo cálculo que el de RR.HH., acotado a quien pregunta. */
  reporteMio(desde: string, hasta: string): Observable<AsistenciaReporte> {
    const params = new HttpParams().set('desde', desde).set('hasta', hasta);
    return this.http.get<AsistenciaReporte>(`${this.url}/reporte/mio`, { params });
  }

  dashboard(desde: string, hasta: string, idSubcartera?: number | null): Observable<DashboardAsistencia> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get<DashboardAsistencia>(`${this.url}/dashboard`, { params });
  }

  /**
   * La Auditoría: todo cambio del módulo en un rango de fecha del cambio.
   * Con subcartera, los de su gente y los de su ámbito o de toda la empresa.
   */
  auditoria(desde: string, hasta: string, idSubcartera?: number | null, tipo?: TipoCambio | null): Observable<CambioAsistencia[]> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    if (tipo) {
      params = params.set('tipo', tipo);
    }
    return this.http.get<CambioAsistencia[]>(`${this.url}/auditoria`, { params });
  }

  // ==================== HORARIOS Y POLÍTICA ====================

  /** El historial de cambios: incluye las filas ya cerradas. */
  historialHorarios(idSubcartera?: number | null): Observable<Horario[]> {
    let params = new HttpParams();
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get<Horario[]>(`${this.url}/horarios/historial`, { params });
  }

  /** El horario base de lunes a viernes y el cambio que rige desde el lunes, si hay. */
  horarioBase(idSubcartera?: number | null): Observable<HorarioBase> {
    let params = new HttpParams();
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get<HorarioBase>(`${this.url}/horarios/base`, { params });
  }

  /** Lo cambia RR.HH.: rige desde el lunes siguiente y queda en la Auditoría. */
  cambiarHorarioBase(cambio: CambioHorarioBase): Observable<HorarioBase> {
    return this.http.post<HorarioBase>(`${this.url}/horarios/base`, cambio);
  }

  politica(idSubcartera?: number | null): Observable<PoliticaAsistencia> {
    let params = new HttpParams();
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get<PoliticaAsistencia>(`${this.url}/horarios/politica`, { params });
  }

  guardarPolitica(politica: PoliticaAsistencia): Observable<PoliticaAsistencia> {
    return this.http.post<PoliticaAsistencia>(`${this.url}/horarios/politica`, politica);
  }

  // ==================== CALENDARIO ====================

  calendario(desde: string, hasta: string, idSubcartera?: number | null): Observable<DiaCalendario[]> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get<DiaCalendario[]>(`${this.url}/calendario`, { params });
  }

  marcarDia(dia: DiaCalendario): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.url}/calendario`, dia);
  }

  /** Los feriados nacionales de un año, para sugerirlos al escribir el nombre. */
  feriados(anio: number): Observable<{ fecha: string; nombre: string }[]> {
    const params = new HttpParams().set('anio', anio);
    return this.http.get<{ fecha: string; nombre: string }[]>(`${this.url}/calendario/feriados`, { params });
  }

  /** Lee el archivo de feriados. Con guardar=false es la vista previa: no toca nada. */
  importarArchivoFeriados(archivo: File, guardar: boolean): Observable<ImportacionFeriados> {
    const cuerpo = new FormData();
    cuerpo.append('archivo', archivo);
    const params = new HttpParams().set('guardar', guardar);
    return this.http.post<ImportacionFeriados>(`${this.url}/calendario/feriados/archivo`, cuerpo, { params });
  }

  /** La plantilla del archivo: Fecha y Nombre, con los feriados del año que viene. */
  plantillaFeriados(): Observable<Blob> {
    return this.http.get(`${this.url}/calendario/feriados/plantilla`, { responseType: 'blob' });
  }

  quitarDia(id: number, idSubcartera?: number | null): Observable<void> {
    let params = new HttpParams();
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.delete<void>(`${this.url}/calendario/${id}`, { params });
  }

  // ==================== JUSTIFICACIONES ====================

  tiposDeDia(): Observable<TipoDia[]> {
    return this.http.get<TipoDia[]>(`${this.url}/justificaciones/tipos`);
  }

  /** La bandeja. Sin estados salen todas; la supervisora mira PENDIENTE y RR.HH. REVISADA. */
  justificaciones(
    desde: string,
    hasta: string,
    estados?: string[],
    idUsuario?: number | null
  ): Observable<Justificacion[]> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    (estados ?? []).forEach(e => {
      params = params.append('estados', e);
    });
    if (idUsuario) {
      params = params.set('idUsuario', idUsuario);
    }
    return this.http.get<Justificacion[]>(`${this.url}/justificaciones`, { params });
  }

  misJustificaciones(): Observable<Justificacion[]> {
    return this.http.get<Justificacion[]>(`${this.url}/justificaciones/mias`);
  }

  /**
   * Registra una solicitud. Va como multipart porque el certificado viaja con
   * ella: en dos viajes, una subida que falla deja la solicitud sin papel y
   * nadie se entera hasta que la revisan.
   */
  crearJustificacion(datos: {
    idTipoDia: number;
    fechaDesde: string;
    fechaHasta: string;
    comentario?: string;
    idUsuario?: number | null;
    archivo?: File | null;
    minutosExtra?: number | null;
    fechaOrigen?: string | null;
  }): Observable<{ id: number }> {
    const cuerpo = new FormData();
    cuerpo.append('idTipoDia', String(datos.idTipoDia));
    cuerpo.append('fechaDesde', datos.fechaDesde);
    cuerpo.append('fechaHasta', datos.fechaHasta);
    if (datos.comentario) {
      cuerpo.append('comentario', datos.comentario);
    }
    if (datos.idUsuario) {
      cuerpo.append('idUsuario', String(datos.idUsuario));
    }
    if (datos.archivo) {
      cuerpo.append('archivo', datos.archivo);
    }
    if (datos.minutosExtra) {
      cuerpo.append('minutosExtra', String(datos.minutosExtra));
    }
    if (datos.fechaOrigen) {
      cuerpo.append('fechaOrigen', datos.fechaOrigen);
    }
    return this.http.post<{ id: number }>(`${this.url}/justificaciones`, cuerpo);
  }

  /** Paso 1: la supervisora confirma que la ausencia ocurrió. */
  revisarJustificacion(id: number, conforme: boolean, motivo?: string): Observable<void> {
    return this.http.post<void>(`${this.url}/justificaciones/${id}/revisar`, { conforme, motivo });
  }

  /** Paso 2: RR.HH. decide. Solo sobre lo que ya revisó la supervisora. */
  resolverJustificacion(id: number, aprobada: boolean, motivo?: string): Observable<void> {
    return this.http.post<void>(`${this.url}/justificaciones/${id}/resolver`, { aprobada, motivo });
  }

  /** El certificado con su tipo (imagen o PDF), para verlo o bajarlo con su nombre. */
  certificado(id: number, nombre?: string | null): Observable<Blob> {
    return this.http.get(`${this.url}/justificaciones/${id}/certificado`, { responseType: 'blob' })
      .pipe(map(blob => conTipo(blob, nombre)));
  }

  // ==================== CIERRE SEMANAL ====================

  cierres(): Observable<CierreSemana[]> {
    return this.http.get<CierreSemana[]>(`${this.url}/cierres`);
  }

  /** Lo que cada asesor lleva recuperado en una semana abierta, en minutos, por id. */
  /** Por asesor: lo que recuperó en una semana abierta y lo que tenía que recuperar. Sin recuperaciones, no viene. */
  recuperadoEnSemana(lunes: string, idSubcartera?: number | null): Observable<Record<number, { recuperado: number; pedido: number }>> {
    let params = new HttpParams().set('lunes', lunes);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    return this.http.get<Record<number, { recuperado: number; pedido: number }>>(`${this.url}/cierres/recuperado`, { params });
  }

  // ==================== HORARIO (PLAN DE RECUPERACIÓN) ====================

  planSemana(lunes: string, idSubcartera: number): Observable<PlanSemana> {
    const params = new HttpParams().set('lunes', lunes).set('idSubcartera', idSubcartera);
    return this.http.get<PlanSemana>(`${this.url}/recuperaciones/plan`, { params });
  }

  /** Confirma el plan de una persona de hoy en adelante: llega entero y reemplaza lo que había. */
  guardarPlan(idUsuario: number, bloques: { fecha: string; minutos: number }[]): Observable<void> {
    return this.http.put<void>(`${this.url}/recuperaciones/plan/${idUsuario}`, bloques);
  }

  /** Lo que propone el sistema a partir del plan que se ve. No guarda nada. */
  proponerPlan(idUsuario: number, actual: { fecha: string; minutos: number }[]): Observable<PropuestaPlan> {
    return this.http.post<PropuestaPlan>(`${this.url}/recuperaciones/plan/${idUsuario}/propuesta`, actual);
  }

  validarBloque(idUsuario: number, fecha: string, minutos: number): Observable<ValidacionPlan> {
    const params = new HttpParams().set('fecha', fecha).set('minutos', minutos);
    return this.http.get<ValidacionPlan>(`${this.url}/recuperaciones/plan/${idUsuario}/validar`, { params });
  }

  cierre(id: number): Observable<CierreSemana> {
    return this.http.get<CierreSemana>(`${this.url}/cierres/${id}`);
  }

  cerrarSemana(lunes: string, idSubcartera?: number | null, nota?: string): Observable<{ id: number }> {
    let params = new HttpParams().set('lunes', lunes);
    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera);
    }
    if (nota) {
      params = params.set('nota', nota);
    }
    return this.http.post<{ id: number }>(`${this.url}/cierres`, null, { params });
  }

  // ==================== CONTROL DE ACCESO ====================

  controlAcceso(): Observable<ControlAcceso> {
    return this.http.get<ControlAcceso>(`${this.url}/acceso`);
  }

  registrarEquipo(equipo: EquipoAutorizado): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.url}/acceso/equipos`, equipo);
  }

  darDeBajaEquipo(id: number, motivo: string): Observable<void> {
    return this.http.post<void>(`${this.url}/acceso/equipos/${id}/baja`, { motivo });
  }

  reactivarEquipo(id: number): Observable<void> {
    return this.http.post<void>(`${this.url}/acceso/equipos/${id}/reactivar`, {});
  }

  // ==================== RECUPERACIONES ====================

  /** Las horas que uno debe. Se abren solas al aprobar una justificación. */
  /** Mi Asistencia: su plan de recuperación de hoy en adelante y las pausas de su horario. */
  miPlan(): Observable<MiPlan> {
    return this.http.get<MiPlan>(`${this.url}/recuperaciones/mi-plan`);
  }

  misRecuperaciones(): Observable<Recuperacion[]> {
    return this.http.get<Recuperacion[]>(`${this.url}/recuperaciones/mias`);
  }

  recuperaciones(): Observable<Recuperacion[]> {
    return this.http.get<Recuperacion[]>(`${this.url}/recuperaciones`);
  }

  /** Dar por cumplida o condonar; condonar es decisión de RR.HH. */
  cerrarRecuperacion(id: number, estado: 'CUMPLIDA' | 'CONDONADA', motivo: string): Observable<void> {
    return this.http.post<void>(`${this.url}/recuperaciones/${id}/cerrar`, { estado, motivo });
  }
}
