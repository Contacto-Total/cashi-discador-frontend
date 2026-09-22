import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AsistenciaReporte,
  AvisoAsistencia,
  CierreSemana,
  ControlAcceso,
  CorreccionMarcacion,
  DashboardAsistencia,
  DiaCalendario,
  ImportacionFeriados,
  PerfilAsistencia,
  EquipoAutorizado,
  Horario,
  Justificacion,
  MarcacionManual,
  PoliticaAsistencia,
  Recuperacion,
  TipoDia
} from './asistencia.models';

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

  /**
   * Lo que hay que decirle ahora sobre su jornada. Se consulta y no se empuja:
   * montar un canal solo para esto sería una pieza más que mantener.
   */
  /** Si es RR.HH., si supervisa y qué subcarteras ve. */
  perfil(): Observable<PerfilAsistencia> {
    return this.http.get<PerfilAsistencia>(`${this.url}/perfil`);
  }

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

  /** Las marcas escritas a mano, con su motivo y quién las escribió. */
  auditoria(desde: string, hasta: string, idUsuario?: number | null): Observable<CorreccionMarcacion[]> {
    let params = new HttpParams().set('desde', desde).set('hasta', hasta);
    if (idUsuario) {
      params = params.set('idUsuario', idUsuario);
    }
    return this.http.get<CorreccionMarcacion[]>(`${this.url}/auditoria`, { params });
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

  certificado(id: number): Observable<Blob> {
    return this.http.get(`${this.url}/justificaciones/${id}/certificado`, { responseType: 'blob' });
  }

  // ==================== CIERRE SEMANAL ====================

  cierres(): Observable<CierreSemana[]> {
    return this.http.get<CierreSemana[]>(`${this.url}/cierres`);
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

  /** Reabrir descongela lo que se pagó: solo administración. */
  reabrirSemana(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/cierres/${id}`);
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
