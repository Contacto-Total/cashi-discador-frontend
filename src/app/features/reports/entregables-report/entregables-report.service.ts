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
  /** Al marcarla como enviada registra lo enviado, y eso no vuelve a salir en el siguiente envío. */
  registraEnvio: boolean;
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

/** Un resultado del procedimiento: una hoja del Excel. */
export interface HojaReporte {
  nombre: string;
  columnas: ColumnaReporte[];
  filas: (string | number | null)[][];
}

/**
 * Lo que devolvió la consulta: columnas y filas en el orden del procedimiento. columnas y filas
 * son las de la primera hoja; hojas trae todas.
 */
export interface DatosReporte {
  columnas: ColumnaReporte[];
  filas: (string | number | null)[][];
  hojas?: HojaReporte[];
  desde: string | null;
  hasta: string | null;
  generadoEn: string;
}

/** Un entregable marcado como enviado. fechaRegistro es hora de Lima (yyyy-MM-ddTHH:mm:ss). */
export interface EnvioEntregable {
  id: number;
  idEntregable: number;
  desde: string | null;
  hasta: string | null;
  nombreArchivo: string | null;
  filas: number;
  estado: 'ENVIADO';
  usuario: string;
  fechaRegistro: string;
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

  /** El Excel con los datos que ya tiene la pantalla, sin volver a consultar. */
  exportarExcel(id: number, datos: DatosReporte): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/${id}/excel`, datos, { responseType: 'blob' });
  }

  /** Los últimos envíos marcados del entregable, el más reciente primero. */
  getEnvios(id: number): Observable<EnvioEntregable[]> {
    return this.http.get<EnvioEntregable[]>(`${this.baseUrl}/${id}/envios`);
  }

  /** Marca como enviado el Excel que se descargó: manda sus mismos datos, sin volver a consultar. */
  marcarEnviado(id: number, nombreArchivo: string, datos: DatosReporte): Observable<EnvioEntregable> {
    return this.http.post<EnvioEntregable>(`${this.baseUrl}/${id}/envios`, { nombreArchivo, datos });
  }

  private periodo(desde: string | null, hasta: string | null): HttpParams {
    let params = new HttpParams();
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return params;
  }
}
