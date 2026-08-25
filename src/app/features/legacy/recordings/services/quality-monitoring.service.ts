import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  AdjustRequest,
  EvaluationDetail,
  MonitoringAudio,
  MonitoringDetailRequest,
  MonitoringRequest,
  MonitoringSubportfolio,
  MonitoringWeek
} from '../models/quality-monitoring.model';

/**
 * La pestaña Monitoreo de Grabaciones Históricas.
 *
 * `apiUrl` y no `webServiceUrl`, igual que los otros tres servicios del módulo:
 * esto lo atiende el discador leyendo de la base histórica de producción.
 *
 * Los dos endpoints son POST aunque sean consultas. No es descuido: el cuerpo de
 * `/semana` lleva una lista de asesores, y el resto del módulo ya resuelve así sus
 * búsquedas. Un GET con la lista en query params sería el único distinto.
 */
@Injectable({
  providedIn: 'root'
})
export class QualityMonitoringService {
  baseUrl = environment.apiUrl + '/gestion/historica/monitoreo';

  constructor(private http: HttpClient) { }

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
   * **Escribe en la base de PRODUCCIÓN.** Es la única llamada de todo el módulo
   * que modifica algo, así que no lleva `retry`: reintentar una escritura que
   * pudo haberse aplicado es peor que fallar y dejar que la persona reintente
   * viendo el estado real.
   */
  ajustarEvaluacion(idx: number, request: AdjustRequest) {
    return this.http
      .put<EvaluationDetail>(`${this.baseUrl}/evaluacion/${idx}`, request, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
}
