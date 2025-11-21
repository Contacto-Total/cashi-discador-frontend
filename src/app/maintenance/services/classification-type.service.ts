import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ClassificationTypeCustom {
  id?: number;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  isSystem: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClassificationTypeService {
  private readonly baseUrl = `${environment.gatewayUrl}/classification-types`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los tipos de clasificación activos
   */
  getActiveTypes(): Observable<ClassificationTypeCustom[]> {
    return this.http.get<ClassificationTypeCustom[]>(`${this.baseUrl}/active`);
  }

  /**
   * Obtiene todos los tipos de clasificación
   */
  getAllTypes(): Observable<ClassificationTypeCustom[]> {
    return this.http.get<ClassificationTypeCustom[]>(`${this.baseUrl}`);
  }

  /**
   * Obtiene un tipo por ID
   */
  getTypeById(id: number): Observable<ClassificationTypeCustom> {
    return this.http.get<ClassificationTypeCustom>(`${this.baseUrl}/${id}`);
  }

  /**
   * Obtiene un tipo por código
   */
  getTypeByCode(code: string): Observable<ClassificationTypeCustom> {
    return this.http.get<ClassificationTypeCustom>(`${this.baseUrl}/code/${code}`);
  }

  /**
   * Crea un nuevo tipo de clasificación
   */
  createType(type: Partial<ClassificationTypeCustom>): Observable<ClassificationTypeCustom> {
    return this.http.post<ClassificationTypeCustom>(`${this.baseUrl}`, type);
  }

  /**
   * Actualiza un tipo de clasificación
   */
  updateType(id: number, type: Partial<ClassificationTypeCustom>): Observable<ClassificationTypeCustom> {
    return this.http.put<ClassificationTypeCustom>(`${this.baseUrl}/${id}`, type);
  }

  /**
   * Elimina un tipo de clasificación
   */
  deleteType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Desactiva un tipo de clasificación
   */
  deactivateType(id: number): Observable<ClassificationTypeCustom> {
    return this.http.patch<ClassificationTypeCustom>(`${this.baseUrl}/${id}/deactivate`, {});
  }
}
