import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConvenioImportado {
  documento: string;
  identityCode: string;
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
  conveniosExistentes: number;
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
   * Importa convenios desde un archivo Excel
   */
  importarConvenios(
    file: File,
    tenantId: number,
    carteraId: number,
    subcarteraId: number
  ): Observable<ConvenioImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenantId', tenantId.toString());
    formData.append('carteraId', carteraId.toString());
    formData.append('subcarteraId', subcarteraId.toString());

    return this.http.post<ConvenioImportResult>(`${this.apiUrl}/import`, formData);
  }
}
