import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type Repeticion = 'DIARIO' | 'SEMANAL' | 'MENSUAL' | 'PEDIDO';
export type PeriodoProgramado = 'SIN' | 'DIA' | 'MES_HOY' | 'MES_AYER' | 'MES_ANT';
export type TipoPeriodo = 'SIN' | 'DIA' | 'RANGO';
export type FechaNombre = 'CORTE' | 'HOY';
export type OperacionTotal = 'FILAS' | 'SUMA' | 'DISTINTOS' | 'CONTAR_VALOR';
export type TipoColumna = 'TEXTO' | 'ENTERO' | 'DECIMAL' | 'FECHA' | 'FECHA_HORA';

/** Una tarjeta de total: se calcula sobre las filas que devuelve la consulta. */
export interface TotalConsulta {
  etiqueta: string;
  operacion: OperacionTotal;
  columna: string | null;
  valor: string | null;
  esMoneda: boolean;
  detalle: string | null;
}

/** Una consulta del procedimiento de la subcartera (CAPACITY, PROYECTADO...). */
export interface ConsultaReporte {
  id: number;
  idSubcartera: number;
  codigo: string;
  descripcion: string;
  tipoPeriodo: TipoPeriodo;
  conPlantilla: boolean;
  nota: string | null;
  avisoCortePasado: string | null;
  avisoCruzaMes: string | null;
  columnasPorcentaje: string[];
  totales: TotalConsulta[];
}

export interface Entregable {
  id: number;
  idSubcartera: number;
  idConsulta: number;
  nombre: string;
  repeticion: Repeticion;
  /** 1 = lunes ... 7 = domingo. */
  diasSemana: number[];
  diaMes: number | null;
  /** HH:mm */
  horaLimite: string | null;
  periodoProgramado: PeriodoProgramado;
  patronArchivo: string;
  patronAsunto: string | null;
  fechaNombre: FechaNombre;
  activo: boolean;
  actualizadoPor?: string | null;
  fechaActualizacion?: string | null;
}

export interface GuardarEntregable {
  idSubcartera: number;
  idConsulta: number;
  nombre: string;
  repeticion: Repeticion;
  diasSemana: number[];
  diaMes: number | null;
  horaLimite: string | null;
  periodoProgramado: PeriodoProgramado;
  patronArchivo: string;
  patronAsunto: string | null;
  fechaNombre: FechaNombre;
  activo: boolean;
}

export interface ColumnaReporte {
  nombre: string;
  tipo: TipoColumna;
}

/** Lo que devolvió la consulta: columnas y filas en el orden del procedimiento. */
export interface DatosReporte {
  columnas: ColumnaReporte[];
  filas: (string | number | null)[][];
  desde: string | null;
  hasta: string | null;
  generadoEn: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntregablesReportService {
  private readonly baseUrl = `${environment.gatewayUrl}/reportes/entregables`;

  constructor(private http: HttpClient) {}

  getConsultas(idSubcartera: number): Observable<ConsultaReporte[]> {
    const params = new HttpParams().set('idSubcartera', idSubcartera.toString());
    return this.http.get<ConsultaReporte[]>(`${this.baseUrl}/consultas`, { params });
  }

  getEntregables(idSubcartera: number, incluirInactivos = false): Observable<Entregable[]> {
    const params = new HttpParams()
      .set('idSubcartera', idSubcartera.toString())
      .set('incluirInactivos', String(incluirInactivos));
    return this.http.get<Entregable[]>(this.baseUrl, { params });
  }

  crear(entregable: GuardarEntregable): Observable<Entregable> {
    return this.http.post<Entregable>(this.baseUrl, entregable);
  }

  actualizar(id: number, entregable: GuardarEntregable): Observable<Entregable> {
    return this.http.put<Entregable>(`${this.baseUrl}/${id}`, entregable);
  }

  getDatos(id: number, desde: string | null, hasta: string | null): Observable<DatosReporte> {
    return this.http.get<DatosReporte>(`${this.baseUrl}/${id}/datos`, { params: this.periodo(desde, hasta) });
  }

  exportarExcel(id: number, desde: string | null, hasta: string | null): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/excel`, {
      params: this.periodo(desde, hasta),
      responseType: 'blob'
    });
  }

  private periodo(desde: string | null, hasta: string | null): HttpParams {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return params;
  }
}
