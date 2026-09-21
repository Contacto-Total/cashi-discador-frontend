import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CartaNoAdeudoDocumento,
  CartaNoAdeudoClienteCorreo,
  CartaNoAdeudoHistorial,
  CartaNoAdeudoPage,
  CartaNoAdeudoSolicitud,
  CartaNoAdeudoSolicitudFilters,
  CrearCartaNoAdeudoSolicitudRequest
} from '../models/carta-no-adeudo.model';

@Injectable({ providedIn: 'root' })
export class CartaNoAdeudoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cartas/no-adeudo`;

  crearSolicitud(request: CrearCartaNoAdeudoSolicitudRequest): Observable<CartaNoAdeudoSolicitud> {
    return this.http.post<CartaNoAdeudoSolicitud>(`${this.baseUrl}/solicitudes`, request);
  }

  listarCandidatos(documento?: string, page = 0, size = 20): Observable<CartaNoAdeudoPage<CartaNoAdeudoClienteCorreo>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (documento?.trim()) {
      params = params.set('documento', documento.trim());
    }
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoClienteCorreo>>(`${this.baseUrl}/candidatos`, { params });
  }

  listarSolicitudes(filters: CartaNoAdeudoSolicitudFilters): Observable<CartaNoAdeudoPage<CartaNoAdeudoSolicitud>> {
    let params = this.contextParams(filters)
      .set('page', (filters.page ?? 0).toString())
      .set('size', (filters.size ?? 20).toString());

    if (filters.estado) {
      params = params.set('estado', filters.estado);
    }

    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoSolicitud>>(`${this.baseUrl}/solicitudes`, { params });
  }

  listarSolicitudesCliente(
    idCliente: number,
    filters: Omit<CartaNoAdeudoSolicitudFilters, 'estado'>
  ): Observable<CartaNoAdeudoPage<CartaNoAdeudoSolicitud>> {
    const params = this.contextParams(filters)
      .set('page', (filters.page ?? 0).toString())
      .set('size', (filters.size ?? 20).toString());

    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoSolicitud>>(
      `${this.baseUrl}/clientes/${idCliente}/solicitudes`,
      { params }
    );
  }

  listarHistorial(idSolicitud: number, page = 0, size = 20): Observable<CartaNoAdeudoPage<CartaNoAdeudoHistorial>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoHistorial>>(
      `${this.baseUrl}/solicitudes/${idSolicitud}/historial`,
      { params }
    );
  }

  listarDocumentos(idSolicitud: number, page = 0, size = 20): Observable<CartaNoAdeudoPage<CartaNoAdeudoDocumento>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoDocumento>>(
      `${this.baseUrl}/solicitudes/${idSolicitud}/documentos`,
      { params }
    );
  }

  private contextParams(filters: Pick<CartaNoAdeudoSolicitudFilters, 'tenantId' | 'carteraId' | 'subcarteraId'>): HttpParams {
    return new HttpParams()
      .set('tenantId', filters.tenantId.toString())
      .set('carteraId', filters.carteraId.toString())
      .set('subcarteraId', filters.subcarteraId.toString());
  }
}
