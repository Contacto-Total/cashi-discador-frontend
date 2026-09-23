import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CartaNoAdeudoDocumento,
  CartaNoAdeudoClienteCorreo,
  CartaNoAdeudoEnviada,
  CartaNoAdeudoFallido,
  CartaNoAdeudoValidacionPago,
  CartaNoAdeudoHistorial,
  CartaNoAdeudoRechazo,
  CartaNoAdeudoPage,
  CartaNoAdeudoSolicitud,
  EnviarCartasNoAdeudoResponse,
  MetodoContactoCorreo,
  CartaNoAdeudoSolicitudFilters,
  CrearCartaNoAdeudoSolicitudRequest,
  ReenviarCartaNoAdeudoItem
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

  generarVistaPrevia(cliente: CartaNoAdeudoClienteCorreo): Observable<Blob> {
    return this.http.post(
      `${environment.apiUrl}/cartas/carta-no-adeudo/generar-validado`,
      {
        documento: cliente.documento,
        tenantId: cliente.idTenant,
        carteraId: cliente.idCartera,
        subcarteraId: cliente.idSubcartera
      },
      { responseType: 'blob' }
    );
  }

  enviarAValidacionPagos(solicitudes: CrearCartaNoAdeudoSolicitudRequest[]): Observable<CartaNoAdeudoSolicitud[]> {
    return this.http.post<CartaNoAdeudoSolicitud[]>(
      `${this.baseUrl}/solicitudes/enviar-validacion-pagos`,
      { solicitudes }
    );
  }

  rechazarSolicitud(idSolicitud: number, justificacion: string): Observable<CartaNoAdeudoSolicitud> {
    return this.http.post<CartaNoAdeudoSolicitud>(
      `${this.baseUrl}/solicitudes/${idSolicitud}/rechazar`,
      { justificacion }
    );
  }

  reenviarAValidacionPagos(reenvios: ReenviarCartaNoAdeudoItem[]): Observable<CartaNoAdeudoSolicitud[]> {
    return this.http.post<CartaNoAdeudoSolicitud[]>(
      `${this.baseUrl}/solicitudes/reenviar-validacion-pagos`,
      { reenvios }
    );
  }

  enviarSolicitudes(
    solicitudIds: number[],
    asunto?: string,
    cuerpo?: string
  ): Observable<EnviarCartasNoAdeudoResponse> {
    return this.http.post<EnviarCartasNoAdeudoResponse>(
      `${this.baseUrl}/solicitudes/enviar`,
      { solicitudIds, asunto, cuerpo }
    );
  }

  listarFallidos(page = 0, size = 20): Observable<CartaNoAdeudoPage<CartaNoAdeudoFallido>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoFallido>>(`${this.baseUrl}/solicitudes/fallidos`, { params });
  }

  listarEnviadas(page = 0, size = 20, correo?: string): Observable<CartaNoAdeudoPage<CartaNoAdeudoEnviada>> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    if (correo?.trim()) {
      params = params.set('correo', correo.trim());
    }
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoEnviada>>(`${this.baseUrl}/solicitudes/enviadas`, { params });
  }

  listarValidacionPagos(page = 0, size = 20): Observable<CartaNoAdeudoPage<CartaNoAdeudoValidacionPago>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoValidacionPago>>(
      `${this.baseUrl}/solicitudes/validacion-pagos`, { params });
  }

  enviarCopia(
    idSolicitud: number,
    correoDestino: string,
    asunto?: string,
    cuerpo?: string
  ): Observable<EnviarCartasNoAdeudoResponse> {
    return this.http.post<EnviarCartasNoAdeudoResponse>(
      `${this.baseUrl}/solicitudes/${idSolicitud}/enviar-copia`,
      { correoDestino, asunto, cuerpo }
    );
  }

  listarRechazos(page = 0, size = 20): Observable<CartaNoAdeudoPage<CartaNoAdeudoRechazo>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<CartaNoAdeudoPage<CartaNoAdeudoRechazo>>(`${this.baseUrl}/rechazos`, { params });
  }

  listarCorreos(cliente: CartaNoAdeudoClienteCorreo, page = 0, size = 20): Observable<CartaNoAdeudoPage<MetodoContactoCorreo>> {
    const params = new HttpParams().set('tenantId', cliente.idTenant).set('carteraId', cliente.idCartera)
      .set('subcarteraId', cliente.idSubcartera).set('page', page).set('size', size);
    return this.http.get<CartaNoAdeudoPage<MetodoContactoCorreo>>(
      `${environment.apiUrl}/contacts/${encodeURIComponent(cliente.documento)}/emails`, { params });
  }

  agregarCorreo(cliente: CartaNoAdeudoClienteCorreo, valor: string): Observable<MetodoContactoCorreo> {
    return this.http.post<MetodoContactoCorreo>(`${environment.apiUrl}/contacts/metodo-contacto-email`, {
      documento: cliente.documento, valor, subtipo: 'email_principal', tenantId: cliente.idTenant,
      carteraId: cliente.idCartera, subcarteraId: cliente.idSubcartera
    });
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
