import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AdjustRequest,
  EvaluationDetail,
  MonitoringAudio,
  MonitoringDetailRequest,
  MonitoringMode,
  MonitoringRequest,
  MonitoringSubportfolio,
  MonitoringWeek,
  MONITORING_MODES
} from '../models/quality-monitoring.model';

/**
 * Los dos monitoreos de calidad, que son el mismo contrato contra dos rutas.
 *
 * `apiUrl` y no `webServiceUrl`, igual que los otros tres servicios del módulo: esto lo
 * atiende el backend del discador.
 *
 * Los dos endpoints principales son POST aunque sean consultas. No es descuido: el
 * cuerpo de `/semana` lleva una lista de asesores, y el resto del módulo ya resuelve así
 * sus búsquedas. Un GET con la lista en query params sería el único distinto.
 *
 * **No es `providedIn: 'root'`.** Lo provee cada `QualityMonitorComponent`, porque la
 * ruta base es estado de la instancia: con un singleton, montar el monitoreo del
 * discador le cambiaría la ruta al de legacy por debajo.
 */
@Injectable()
export class QualityMonitoringService {
  private modo: MonitoringMode = 'legacy';

  baseUrl = environment.apiUrl + MONITORING_MODES.legacy.ruta;

  constructor(private http: HttpClient) { }

  /** Apunta el servicio a uno de los dos monitoreos. Se llama una vez, al montar. */
  usar(modo: MonitoringMode): void {
    this.modo = modo;
    this.baseUrl = environment.apiUrl + MONITORING_MODES[modo].ruta;
  }

  /** La URL del audio de una parte. Solo el discador la tiene; en legacy es null. */
  urlDeAudio(idx: number, parte: number): string | null {
    return this.modo === 'discador'
      ? `${this.baseUrl}/evaluacion/${idx}/audio?parte=${parte}`
      : null;
  }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  handleError(error: HttpErrorResponse) {
    if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
      console.log(
        `An error occurred ${error.status}, body was: ${error.error.message}`
      );
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error.message}`
      );
    }
    return throwError(() => ({ status: error.status, message: error.error?.message }))
  }

  /**
   * Las subcarteras que puede elegir el filtro, tal como están dadas de alta en
   * `speech_plantilla_subcartera`.
   *
   * No es un catálogo de la tabla histórica: son las subcarteras con plantilla
   * configurada, que son las únicas cuyos audios se puntúan contra la rúbrica que
   * calidad definió.
   */
  getSubcarteras() {
    return this.http
      .get<MonitoringSubportfolio[]>(this.baseUrl + '/subcarteras', this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /** La matriz asesor × día del rango pedido. */
  getSemana(request: MonitoringRequest) {
    return this.http
      .post<MonitoringWeek>(this.baseUrl + '/semana', request, this.httpOptions)
      .pipe(retry(1), catchError(this.handleError));
  }

  /**
   * Los audios que resume una celda.
   *
   * Sin `retry` a diferencia de la matriz: se dispara al hacer click y el usuario
   * ya está mirando; si falla, conviene que lo sepa de una en vez de esperar un
   * reintento silencioso.
   */
  getDetalle(request: MonitoringDetailRequest) {
    return this.http
      .post<MonitoringAudio[]>(this.baseUrl + '/detalle', request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /** La ficha de un audio: el resumen del modelo y sus criterios uno por uno. */
  getEvaluacion(idx: number) {
    return this.http
      .get<EvaluationDetail>(`${this.baseUrl}/evaluacion/${idx}`, this.httpOptions)
      .pipe(catchError(this.handleError));
  }

  /**
   * Corrige a mano la calificación de uno o más criterios.
   *
   * **Es la única llamada de todo el módulo que modifica algo**, así que no lleva
   * `retry`: reintentar una escritura que pudo haberse aplicado es peor que fallar y
   * dejar que la persona reintente viendo el estado real.
   *
   * En legacy escribe en la base de PRODUCCIÓN, corra el backend donde corra. En el
   * discador escribe en la del propio entorno.
   */
  ajustarEvaluacion(idx: number, request: AdjustRequest) {
    return this.http
      .put<EvaluationDetail>(`${this.baseUrl}/evaluacion/${idx}`, request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
