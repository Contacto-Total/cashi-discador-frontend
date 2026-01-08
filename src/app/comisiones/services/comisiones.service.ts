import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ComisionMeta,
  ComisionBono,
  ComisionReporte,
  ComisionConfigResumen,
  Inquilino,
  Cartera,
  Subcartera
} from '../models/comision.model';

@Injectable({
  providedIn: 'root'
})
export class ComisionesService {

  private readonly baseUrl = `${environment.gatewayUrl}/comisiones`;

  constructor(private http: HttpClient) {}

  // ==================== INQUILINOS / CARTERAS / SUBCARTERAS ====================

  /**
   * Obtener inquilinos disponibles
   */
  obtenerInquilinos(): Observable<Inquilino[]> {
    return this.http.get<Inquilino[]>(`${this.baseUrl}/inquilinos`);
  }

  /**
   * Obtener carteras de un inquilino
   */
  obtenerCarteras(idInquilino: number): Observable<Cartera[]> {
    const params = new HttpParams().set('idInquilino', idInquilino.toString());
    return this.http.get<Cartera[]>(`${this.baseUrl}/carteras`, { params });
  }

  /**
   * Obtener subcarteras de una cartera
   */
  obtenerSubcarteras(idCartera: number): Observable<Subcartera[]> {
    const params = new HttpParams().set('idCartera', idCartera.toString());
    return this.http.get<Subcartera[]>(`${this.baseUrl}/subcarteras`, { params });
  }

  /**
   * Obtener jerarquía de una subcartera (inquilino y cartera padre)
   */
  obtenerJerarquiaSubcartera(idSubcartera: number): Observable<{ idInquilino: number; idCartera: number }> {
    return this.http.get<{ idInquilino: number; idCartera: number }>(`${this.baseUrl}/subcarteras/${idSubcartera}/jerarquia`);
  }

  // ==================== METAS ====================

  /**
   * Obtener metas de un período
   */
  obtenerMetas(anio: number, mes: number): Observable<ComisionMeta[]> {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    return this.http.get<ComisionMeta[]>(`${this.baseUrl}/metas`, { params });
  }

  /**
   * Obtener una meta por ID
   */
  obtenerMeta(id: number): Observable<ComisionMeta> {
    return this.http.get<ComisionMeta>(`${this.baseUrl}/metas/${id}`);
  }

  /**
   * Crear o actualizar una meta
   */
  guardarMeta(meta: ComisionMeta): Observable<ComisionMeta> {
    console.log('[COMISIONES] Guardando meta:', meta);
    return this.http.post<ComisionMeta>(`${this.baseUrl}/metas`, meta);
  }

  /**
   * Eliminar una meta
   */
  eliminarMeta(id: number): Observable<{ mensaje: string }> {
    console.log('[COMISIONES] Eliminando meta ID:', id);
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/metas/${id}`);
  }

  // ==================== BONOS ====================

  /**
   * Obtener bonos por período
   */
  obtenerBonos(anio: number, mes: number): Observable<ComisionBono[]> {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    return this.http.get<ComisionBono[]>(`${this.baseUrl}/bonos`, { params });
  }

  /**
   * Obtener bonos activos por período
   */
  obtenerBonosActivos(anio: number, mes: number): Observable<ComisionBono[]> {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    return this.http.get<ComisionBono[]>(`${this.baseUrl}/bonos/activos`, { params });
  }

  /**
   * Copiar bonos de un período a otro
   */
  copiarBonos(anioOrigen: number, mesOrigen: number, anioDestino: number, mesDestino: number): Observable<{ mensaje: string; cantidadCopiada: number; bonos: ComisionBono[] }> {
    const params = new HttpParams()
      .set('anioOrigen', anioOrigen.toString())
      .set('mesOrigen', mesOrigen.toString())
      .set('anioDestino', anioDestino.toString())
      .set('mesDestino', mesDestino.toString());
    return this.http.post<{ mensaje: string; cantidadCopiada: number; bonos: ComisionBono[] }>(
      `${this.baseUrl}/bonos/copiar`, null, { params }
    );
  }

  /**
   * Obtener un bono por ID
   */
  obtenerBono(id: number): Observable<ComisionBono> {
    return this.http.get<ComisionBono>(`${this.baseUrl}/bonos/${id}`);
  }

  /**
   * Crear o actualizar un bono
   */
  guardarBono(bono: ComisionBono): Observable<ComisionBono> {
    console.log('[COMISIONES] Guardando bono:', bono);
    return this.http.post<ComisionBono>(`${this.baseUrl}/bonos`, bono);
  }

  /**
   * Eliminar un bono
   */
  eliminarBono(id: number): Observable<{ mensaje: string }> {
    console.log('[COMISIONES] Eliminando bono ID:', id);
    return this.http.delete<{ mensaje: string }>(`${this.baseUrl}/bonos/${id}`);
  }

  /**
   * Obtener campos disponibles para bonos
   */
  obtenerCamposDisponibles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/bonos/campos-disponibles`);
  }

  /**
   * Obtener valores únicos de un campo para el dropdown de bonos
   */
  obtenerValoresCampo(campo: string): Observable<string[]> {
    const params = new HttpParams().set('campo', campo);
    return this.http.get<string[]>(`${this.baseUrl}/bonos/valores-campo`, { params });
  }

  // ==================== CÁLCULO ====================

  /**
   * Calcular comisiones para un período
   */
  calcularComisiones(anio: number, mes: number, idSubcartera?: number): Observable<ComisionReporte> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera.toString());
    }

    console.log('[COMISIONES] Calculando comisiones:', { anio, mes, idSubcartera });
    return this.http.get<ComisionReporte>(`${this.baseUrl}/calcular`, { params });
  }

  // ==================== UTILIDADES ====================

  /**
   * Obtener resumen de configuración
   */
  obtenerResumenConfig(anio: number, mes: number): Observable<ComisionConfigResumen> {
    const params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());
    return this.http.get<ComisionConfigResumen>(`${this.baseUrl}/resumen-config`, { params });
  }

  /**
   * Obtener nombre legible de un campo
   */
  getNombreCampo(campo: string): string {
    const nombres: Record<string, string> = {
      'campo_monto_origen': 'Campo Monto Origen',
      'ruta_nivel_1': 'Tipificación Nivel 1',
      'ruta_nivel_2': 'Tipificación Nivel 2',
      'ruta_nivel_3': 'Tipificación Nivel 3',
      'ruta_nivel_4': 'Tipificación Nivel 4',
      'nombre_subcartera': 'Subcartera',
      'nombre_cartera': 'Cartera',
      'estado_gestion': 'Estado Gestión',
      'metodo_contacto': 'Método Contacto',
      'canal_contacto': 'Canal Contacto'
    };
    return nombres[campo] || campo;
  }

  /**
   * Obtener nombre del mes
   */
  getNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || '';
  }

  // ==================== EXPORTAR ====================

  /**
   * Exportar reporte de comisiones en PDF
   */
  exportarPdf(anio: number, mes: number, idSubcartera?: number): Observable<Blob> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera.toString());
    }

    return this.http.get(`${this.baseUrl}/exportar-pdf`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Exportar reporte de comisiones en Excel
   */
  exportarExcel(anio: number, mes: number, idSubcartera?: number): Observable<Blob> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera.toString());
    }

    return this.http.get(`${this.baseUrl}/exportar-excel`, {
      params,
      responseType: 'blob'
    });
  }

  // ==================== BASE DE AJUSTE ====================

  /**
   * Agregar promesas pagadas al envío del período
   */
  agregarEnvioBaseAjuste(anio: number, mes: number, idSubcartera?: number): Observable<{ registrosAgregados: number; fechaEnvio: string; mensaje: string }> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera.toString());
    }

    console.log('[COMISIONES] Agregando envío Base Ajuste:', { anio, mes, idSubcartera });
    return this.http.post<{ registrosAgregados: number; fechaEnvio: string; mensaje: string }>(
      `${this.baseUrl}/base-ajuste/agregar-envio`,
      null,
      { params }
    );
  }

  /**
   * Obtener estadísticas de Base de Ajuste
   */
  obtenerEstadisticasBaseAjuste(anio: number, mes: number, idSubcartera?: number): Observable<{
    total_registros: number;
    total_envios: number;
    total_asesores: number;
    monto_total: number;
    primer_envio: string;
    ultimo_envio: string;
  }> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera.toString());
    }

    return this.http.get<any>(`${this.baseUrl}/base-ajuste/estadisticas`, { params });
  }

  /**
   * Exportar Base de Ajuste en Excel
   */
  exportarBaseAjusteExcel(anio: number, mes: number, idSubcartera?: number): Observable<Blob> {
    let params = new HttpParams()
      .set('anio', anio.toString())
      .set('mes', mes.toString());

    if (idSubcartera) {
      params = params.set('idSubcartera', idSubcartera.toString());
    }

    return this.http.get(`${this.baseUrl}/base-ajuste/exportar-excel`, {
      params,
      responseType: 'blob'
    });
  }
}
