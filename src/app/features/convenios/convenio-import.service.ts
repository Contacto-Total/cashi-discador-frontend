import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// ==================== Interfaces para Validación ====================

export interface ConvenioValidado {
  documento: string;
  identityCode: string;
  nombreCliente: string;
  nombreSubcartera: string;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  montoConvenio: number;
  numeroCuotas: number;
  montoPagado: number;
  fila: number;
}

export interface ConvenioNoEncontrado {
  documento: string;
  identityCode: string;
  montoConvenio: number;
  fila: number;
}

export interface ConvenioExistente {
  documento: string;
  identityCode: string;
  nombreCliente: string;
  fila: number;
}

export interface ConvenioValidationResult {
  exitoso: boolean;
  mensaje: string;
  totalRegistros: number;
  conveniosValidos: ConvenioValidado[];
  conveniosNoEncontrados: ConvenioNoEncontrado[];
  conveniosYaExistentes: ConvenioExistente[];
  erroresFormato: string[];
}

// ==================== Interfaces para Importación ====================

export interface ConvenioImportado {
  documento: string;
  identityCode: string;
  nombreCliente: string;
  nombreSubcartera: string;
  montoConvenio: number;
  numeroCuotas: number;
  montoPagado: number;
  cuotasPagadas: number;
  cuotasPendientes: number;
  idGestion: number;
}

export interface ConvenioImportResult {
  exitoso: boolean;
  mensaje: string;
  totalRegistros: number;
  conveniosNuevos: number;
  conveniosOmitidos: number;
  errores: number;
  detalleErrores: string[];
  conveniosImportados: ConvenioImportado[];
}

@Injectable({
  providedIn: 'root'
})
export class ConvenioImportService {
  private apiUrl = `${environment.apiUrl}/convenios`;

  constructor(private http: HttpClient) {}

  /**
   * PASO 1: Valida el archivo Excel y retorna qué convenios se pueden importar.
   *
   * @param file Archivo Excel con hoja "CONVENIOS"
   * @returns Resultado de validación con listas clasificadas
   */
  validarConvenios(file: File): Observable<ConvenioValidationResult> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ConvenioValidationResult>(`${this.apiUrl}/validate`, formData);
  }

  /**
   * PASO 2: Importa los convenios confirmados.
   *
   * @param file Archivo Excel con hoja "CONVENIOS"
   * @param documentos Lista de documentos (DNI) a importar
   * @returns Resultado de importación
   */
  importarConvenios(file: File, documentos: string[]): Observable<ConvenioImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    // Enviar documentos como parámetros individuales (Spring los recogerá como lista)
    documentos.forEach(doc => {
      formData.append('documentos', doc);
    });

    return this.http.post<ConvenioImportResult>(`${this.apiUrl}/import`, formData);
  }
}
