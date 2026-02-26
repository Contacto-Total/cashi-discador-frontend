import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  RecordatorioPromesa,
  RegistrarRecordatorioRequest,
  ResultadoRecordatorio,
  EstadisticasRecordatorios,
  IniciarDialerResponse,
  SiguienteRecordatorioResponse,
  CompletarRecordatorioResponse,
  EstadoDialerResponse,
  ResultadoLlamadaAMD
} from '../models/recordatorio.model';

export interface VerificacionHorarioResponse {
  permitido: boolean;
  tieneConfiguracion: boolean;
  mensaje: string;
}

export interface ConfiguracionHorarioRecordatorio {
  id?: number;
  idSubcartera: number;
  horaInicio: string; // Format: "HH:mm:ss" or "HH:mm"
  horaFin: string;
  descripcion?: string;
  activo: boolean;
}

export interface ConfiguracionPromesasRecordatorio {
  id?: number;
  idSubcartera: number;
  diasProximosPromesas: number;  // 0 = solo hoy, 1 = hoy + mañana, etc.
  diasVencidasPromesas: number;  // 0 = no incluir, 1+ = días hacia atrás (saltando ayer)
  activo: boolean;
}

export interface ResumenConfiguracionPromesas {
  config: ConfiguracionPromesasRecordatorio;
  proximas: {
    desde: string;
    hasta: string;
    descripcion: string;
  };
  vencidas: {
    desde: string | null;
    hasta: string | null;
    descripcion: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class RecordatoriosService {

  private baseUrl = `${environment.apiUrl}/v2/management-records/recordatorios`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los recordatorios de promesas de pago del agente.
   * Si se proporciona idSubcartera, usa la configuración de esa subcartera
   * para determinar el rango de fechas (próximas y vencidas).
   */
  getMisRecordatoriosHoy(idAgente: number, idSubcartera?: number): Observable<RecordatorioPromesa[]> {
    const params = idSubcartera ? `?idSubcartera=${idSubcartera}` : '';
    return this.http.get<RecordatorioPromesa[]>(`${this.baseUrl}/hoy/${idAgente}${params}`);
  }

  /**
   * Obtiene los recordatorios de los próximos N días
   */
  getMisRecordatoriosProximos(idAgente: number, dias: number = 3): Observable<RecordatorioPromesa[]> {
    return this.http.get<RecordatorioPromesa[]>(`${this.baseUrl}/proximos/${idAgente}?dias=${dias}`);
  }

  /**
   * Registra un intento de recordatorio
   */
  registrarIntento(request: RegistrarRecordatorioRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/registrar`, request);
  }

  /**
   * Obtiene las estadísticas de recordatorios del agente
   */
  getEstadisticas(idAgente: number, fecha?: string): Observable<EstadisticasRecordatorios> {
    let url = `${this.baseUrl}/estadisticas/${idAgente}`;
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    return this.http.get<EstadisticasRecordatorios>(url);
  }

  /**
   * Obtiene los posibles resultados para un recordatorio (para dropdown)
   */
  getResultadosPosibles(): Observable<ResultadoRecordatorio[]> {
    return this.http.get<ResultadoRecordatorio[]>(`${this.baseUrl}/resultados-posibles`);
  }

  // ==================== DIALER METHODS ====================

  /**
   * Inicia el discado automático de recordatorios
   * @param idAgente ID del agente
   * @param idSubcartera ID de la subcartera (opcional, para usar configuración de promesas)
   */
  iniciarDialer(idAgente: number, idSubcartera?: number): Observable<IniciarDialerResponse> {
    const params = idSubcartera ? `?idSubcartera=${idSubcartera}` : '';
    return this.http.post<IniciarDialerResponse>(`${this.baseUrl}/dialer/iniciar/${idAgente}${params}`, {});
  }

  /**
   * Obtiene el siguiente recordatorio de la cola
   */
  obtenerSiguiente(idAgente: number): Observable<SiguienteRecordatorioResponse> {
    return this.http.get<SiguienteRecordatorioResponse>(`${this.baseUrl}/dialer/siguiente/${idAgente}`);
  }

  /**
   * Inicia una llamada con detección AMD para el recordatorio actual.
   * El backend hace la llamada, analiza si es humano o buzón.
   * - Si es buzón: auto-registra y pasa al siguiente
   * - Si es humano: conecta al agente
   */
  iniciarLlamadaConAMD(idAgente: number): Observable<ResultadoLlamadaAMD> {
    return this.http.post<ResultadoLlamadaAMD>(`${this.baseUrl}/dialer/llamar/${idAgente}`, {});
  }

  /**
   * Inicia una llamada directa (sin AMD) para el recordatorio actual.
   * Funciona como llamada manual: originate al agente, bridge al cliente.
   * El agente escucha timbrar y tipifica SIEMPRE.
   */
  iniciarLlamadaDirecta(idAgente: number): Observable<{ success: boolean; callUuid: string; recordatorio: any; mensaje: string }> {
    return this.http.post<{ success: boolean; callUuid: string; recordatorio: any; mensaje: string }>(
      `${this.baseUrl}/dialer/llamar-directo/${idAgente}`, {}
    );
  }

  /**
   * Marca el recordatorio actual como completado
   */
  completarActual(
    idAgente: number,
    resultado?: string,
    uuidLlamada?: string,
    observaciones?: string
  ): Observable<CompletarRecordatorioResponse> {
    let params = '';
    const queryParams: string[] = [];

    if (resultado) queryParams.push(`resultado=${resultado}`);
    if (uuidLlamada) queryParams.push(`uuidLlamada=${uuidLlamada}`);
    if (observaciones) queryParams.push(`observaciones=${encodeURIComponent(observaciones)}`);

    if (queryParams.length > 0) {
      params = '?' + queryParams.join('&');
    }

    return this.http.post<CompletarRecordatorioResponse>(
      `${this.baseUrl}/dialer/completar/${idAgente}${params}`,
      {}
    );
  }

  /**
   * Detiene el discado de recordatorios
   */
  detenerDialer(idAgente: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/dialer/detener/${idAgente}`);
  }

  /**
   * Obtiene el estado actual del dialer
   */
  obtenerEstadoDialer(idAgente: number): Observable<EstadoDialerResponse> {
    return this.http.get<EstadoDialerResponse>(`${this.baseUrl}/dialer/estado/${idAgente}`);
  }

  // ==================== HORARIOS METHODS ====================

  /**
   * Verifica si la hora actual está dentro del horario permitido para recordatorios.
   * El frontend usa este endpoint antes de mostrar el modal.
   */
  verificarHorario(idSubcartera: number): Observable<VerificacionHorarioResponse> {
    return this.http.get<VerificacionHorarioResponse>(`${this.baseUrl}/horarios/verificar/${idSubcartera}`);
  }

  /**
   * Obtiene las configuraciones de horario de una subcartera
   */
  obtenerHorarios(idSubcartera: number, incluirInactivos = false): Observable<ConfiguracionHorarioRecordatorio[]> {
    return this.http.get<ConfiguracionHorarioRecordatorio[]>(
      `${this.baseUrl}/horarios/subcartera/${idSubcartera}?incluirInactivos=${incluirInactivos}`
    );
  }

  /**
   * Crea los horarios por defecto para una subcartera (8-9am, 2-3pm, 5-6pm)
   */
  crearHorariosDefecto(idSubcartera: number): Observable<ConfiguracionHorarioRecordatorio[]> {
    return this.http.post<ConfiguracionHorarioRecordatorio[]>(
      `${this.baseUrl}/horarios/subcartera/${idSubcartera}/defecto`,
      {}
    );
  }

  /**
   * Actualiza todos los horarios de una subcartera
   */
  actualizarHorarios(idSubcartera: number, horarios: ConfiguracionHorarioRecordatorio[]): Observable<ConfiguracionHorarioRecordatorio[]> {
    return this.http.put<ConfiguracionHorarioRecordatorio[]>(
      `${this.baseUrl}/horarios/subcartera/${idSubcartera}`,
      horarios
    );
  }

  /**
   * Guarda o actualiza un horario específico
   */
  guardarHorario(config: ConfiguracionHorarioRecordatorio): Observable<ConfiguracionHorarioRecordatorio> {
    return this.http.post<ConfiguracionHorarioRecordatorio>(`${this.baseUrl}/horarios`, config);
  }

  /**
   * Elimina un horario específico
   */
  eliminarHorario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/horarios/${id}`);
  }

  /**
   * Cambia el estado de un horario (activo/inactivo)
   */
  cambiarEstadoHorario(id: number, activo: boolean): Observable<ConfiguracionHorarioRecordatorio> {
    return this.http.post<ConfiguracionHorarioRecordatorio>(
      `${this.baseUrl}/horarios/${id}/estado?activo=${activo}`,
      {}
    );
  }

  // ==================== COMBINED METHODS ====================

  /**
   * Obtiene los recordatorios solo si estamos en horario permitido.
   * Primero verifica el horario y luego obtiene los recordatorios.
   * Si no hay subcartera configurada o el horario no está permitido, devuelve lista vacía.
   *
   * @param idAgente ID del agente
   * @param idSubcartera ID de la subcartera (opcional, si no se proporciona, no verifica horario)
   * @returns Observable con recordatorios o lista vacía si no está en horario
   */
  getMisRecordatoriosSiEnHorario(
    idAgente: number,
    idSubcartera?: number
  ): Observable<{ recordatorios: RecordatorioPromesa[]; horarioInfo: VerificacionHorarioResponse | null }> {
    // Si no hay subcartera, obtener recordatorios sin verificar horario (solo hoy)
    if (!idSubcartera) {
      return this.getMisRecordatoriosHoy(idAgente).pipe(
        map(recordatorios => ({
          recordatorios,
          horarioInfo: null
        })),
        catchError(() => of({ recordatorios: [], horarioInfo: null }))
      );
    }

    // Verificar horario primero, luego obtener recordatorios con configuración
    return this.verificarHorario(idSubcartera).pipe(
      switchMap(horarioInfo => {
        if (horarioInfo.permitido) {
          // Pasar idSubcartera para usar la configuración de fechas
          return this.getMisRecordatoriosHoy(idAgente, idSubcartera).pipe(
            map(recordatorios => ({ recordatorios, horarioInfo })),
            catchError(() => of({ recordatorios: [], horarioInfo }))
          );
        } else {
          console.log(`⏰ Fuera del horario de recordatorios: ${horarioInfo.mensaje}`);
          return of({ recordatorios: [], horarioInfo });
        }
      }),
      catchError(err => {
        // Si falla la verificación de horario, asumir que está permitido
        console.warn('Error verificando horario, continuando sin restricción:', err);
        return this.getMisRecordatoriosHoy(idAgente, idSubcartera).pipe(
          map(recordatorios => ({ recordatorios, horarioInfo: null })),
          catchError(() => of({ recordatorios: [], horarioInfo: null }))
        );
      })
    );
  }

  // ==================== CONFIGURACIÓN DE PROMESAS ====================

  /**
   * Obtiene la configuración de promesas para una subcartera
   */
  obtenerConfigPromesas(idSubcartera: number): Observable<ConfiguracionPromesasRecordatorio> {
    return this.http.get<ConfiguracionPromesasRecordatorio>(
      `${this.baseUrl}/config-promesas/subcartera/${idSubcartera}`
    );
  }

  /**
   * Guarda la configuración de promesas para una subcartera
   */
  guardarConfigPromesas(idSubcartera: number, config: ConfiguracionPromesasRecordatorio): Observable<ConfiguracionPromesasRecordatorio> {
    return this.http.post<ConfiguracionPromesasRecordatorio>(
      `${this.baseUrl}/config-promesas/subcartera/${idSubcartera}`,
      config
    );
  }

  /**
   * Obtiene un resumen de la configuración con ejemplos de fechas
   */
  obtenerResumenConfigPromesas(idSubcartera: number): Observable<ResumenConfiguracionPromesas> {
    return this.http.get<ResumenConfiguracionPromesas>(
      `${this.baseUrl}/config-promesas/subcartera/${idSubcartera}/resumen`
    );
  }
}
