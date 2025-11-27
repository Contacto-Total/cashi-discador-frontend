import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaymentSchedule } from '../models/payment-schedule.model';

/**
 * Interface para el registro de gestión V2 del backend discador
 */
export interface RegistroGestionV2 {
  id?: number;
  uuid?: string;
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  idCliente: number;
  idAgente: number;
  idCampana?: number;
  idLlamada?: number;
  fechaGestion?: string;
  duracionSegundos?: number;
  tipificacion: { id: number };
  tipificacionNivel1?: { id: number };
  tipificacionNivel2?: { id: number };
  tipificacionNivel3?: { id: number };
  tipificacionNivel4?: { id: number };
  observaciones?: string;
  notasPrivadas?: string;
  metodoContacto?: string;
  canalContacto?: string;
  estadoGestion?: string;
  fechaSeguimiento?: string;
  requiereSeguimiento?: boolean;
  fechaCreacion?: string;
  rutaJerarquia?: string;
}

export interface ManagementResource {
  id: number;
  customerId: string;
  advisorId: string;

  // Multi-tenant fields
  tenantId: number;
  tenantName: string;
  portfolioId: number;
  portfolioName: string;
  subPortfolioId?: number;
  subPortfolioName?: string;

  // Contact info
  phone: string;

  // Hierarchical categorization
  level1Id: number;
  level1Name: string;
  level2Id?: number;
  level2Name?: string;
  level3Id?: number;
  level3Name?: string;

  observations?: string;
  typificationRequiresPayment?: boolean;
  typificationRequiresSchedule?: boolean;

  // Automatic timestamp fields
  managementDate?: string;  // Fecha de gestión (YYYY-MM-DD)
  managementTime?: string;  // Hora de gestión (HH:mm:ss)
}

export interface CallDetailResource {
  phoneNumber: string;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
}

export interface PaymentDetailResource {
  amount: number;
  scheduledDate: string;
  paymentMethodType: string;
  paymentMethodDetails?: string;
  voucherNumber?: string;
  bankName?: string;
}


export interface CreateManagementRequest {
  customerId: string;
  advisorId: string;

  // Multi-tenant fields
  tenantId: number;
  portfolioId: number;
  subPortfolioId?: number | null;

  // Contact info
  phone: string;

  // Hierarchical categorization (3 levels)
  level1Id: number;
  level1Name: string;
  level2Id?: number | null;
  level2Name?: string | null;
  level3Id?: number | null;
  level3Name?: string | null;

  observations?: string;

  // Campos adicionales para registro completo
  metodoContacto?: 'LLAMADA_SALIENTE' | 'LLAMADA_ENTRANTE' | 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PRESENCIAL' | 'GESTION_MANUAL';
  canalContacto?: 'TELEFONO' | 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PRESENCIAL' | 'SISTEMA';
  idCampana?: number | null;
  idLlamada?: number | null;
  duracionSegundos?: number | null;
}

export interface StartCallRequest {
  phoneNumber: string;
  startTime: string;
}

export interface EndCallRequest {
  endTime: string;
}

export interface RegisterPaymentRequest {
  amount: number;
  scheduledDate: string;
  paymentMethodType: string;
  paymentMethodDetails?: string;
  voucherNumber?: string;
  bankName?: string;
}

/**
 * Interface para crear cronograma de pagos con cuotas
 */
export interface PaymentScheduleRequest {
  idCliente: number;
  idAgente: number;
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  idCampana?: number;
  idTipificacion: number;
  observaciones?: string;
  metodoContacto?: string;
  campoMontoOrigen?: string;  // Nombre del campo de donde viene el monto (ej: sld_mora, sld_total)
  schedule: {
    montoTotal: number;
    numeroCuotas: number;
    cuotas: PaymentInstallmentRequest[];
  };
}

export interface PaymentInstallmentRequest {
  numeroCuota: number;
  monto: number;
  fechaPago: string; // formato YYYY-MM-DD
}

/**
 * Interface para configuración de cabecera desde la tabla configuracion_cabeceras
 */
export interface ConfiguracionCabecera {
  id: number;
  codigo: string;      // Nombre técnico (ej: SLD_MORA)
  nombre: string;      // Nombre visual (ej: "Saldo mora")
  tipoDato: string;    // TEXTO, NUMERICO, FECHA
  tipoSql: string;     // decimal(18,2), int, etc.
  ordenVisualizacion?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ManagementService {
  // Usando el backend discador para gestiones V2
  private readonly baseUrl = `${environment.gatewayUrl}/v2/management-records`;
  private readonly scheduleUrl = `${environment.tipificacionUrl}/payment-schedules`;
  private readonly cabecerasUrl = `${environment.gatewayUrl}/configuracion-cabeceras`;

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo registro de gestión en el backend discador
   */
  createManagement(request: CreateManagementRequest): Observable<ManagementResource> {
    // Transformar el request al formato que espera el backend discador
    const backendRequest: RegistroGestionV2 = this.transformToBackendFormat(request);

    console.log('[MANAGEMENT] Creating management record:', backendRequest);

    return this.http.post<RegistroGestionV2>(this.baseUrl, backendRequest).pipe(
      map(response => this.transformToFrontendFormat(response, request))
    );
  }

  /**
   * Obtiene una gestión por ID
   */
  getManagementById(managementId: string): Observable<ManagementResource> {
    return this.http.get<RegistroGestionV2>(`${this.baseUrl}/${managementId}`).pipe(
      map(response => this.transformToFrontendFormat(response))
    );
  }

  /**
   * Obtiene todas las gestiones de un cliente
   */
  getManagementsByCustomer(customerId: string): Observable<ManagementResource[]> {
    return this.http.get<RegistroGestionV2[]>(`${this.baseUrl}/client/${customerId}`).pipe(
      map(records => records.map(r => this.transformToFrontendFormat(r)))
    );
  }

  getManagementsByAdvisor(advisorId: string): Observable<ManagementResource[]> {
    return this.http.get<RegistroGestionV2[]>(`${this.baseUrl}/agent/${advisorId}`).pipe(
      map(records => records.map(r => this.transformToFrontendFormat(r)))
    );
  }

  getActiveSchedulesByCustomer(customerId: string): Observable<PaymentSchedule[]> {
    console.log('[SCHEDULE] Fetching active schedules for customer:', customerId);
    return this.http.get<PaymentSchedule[]>(`${this.scheduleUrl}/customer/${customerId}/active`);
  }

  startCall(managementId: number, request: StartCallRequest): Observable<ManagementResource> {
    // Por ahora mantener la funcionalidad básica
    console.log('[CALL] Start call for management:', managementId, request);
    return this.getManagementById(managementId.toString());
  }

  endCall(managementId: number, request: EndCallRequest): Observable<ManagementResource> {
    // Por ahora mantener la funcionalidad básica
    console.log('[CALL] End call for management:', managementId, request);
    return this.getManagementById(managementId.toString());
  }

  registerPayment(managementId: string, request: RegisterPaymentRequest): Observable<ManagementResource> {
    // Por ahora mantener la funcionalidad básica
    console.log('[PAYMENT] Register payment for management:', managementId, request);
    return this.getManagementById(managementId);
  }

  /**
   * Crea un cronograma de pagos con múltiples cuotas
   * Cada cuota se guarda como un registro separado con el mismo grupoPromesaUuid
   */
  createPaymentSchedule(request: PaymentScheduleRequest): Observable<RegistroGestionV2[]> {
    console.log('[SCHEDULE] Creating payment schedule:', request);
    return this.http.post<RegistroGestionV2[]>(`${this.baseUrl}/payment-schedule`, request);
  }

  /**
   * Actualiza el estado de pago de una cuota de promesa de pago
   * @param recordId ID del registro en registros_gestion_v2
   * @param estadoPago Nuevo estado: PENDIENTE, PAGADA, VENCIDA, PARCIAL, CANCELADA
   * @param montoPagadoReal Monto realmente pagado (opcional)
   * @param fechaPagoReal Fecha en que se realizó el pago (opcional)
   */
  updatePaymentStatus(
    recordId: number,
    estadoPago: 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'PARCIAL' | 'CANCELADA',
    montoPagadoReal?: number,
    fechaPagoReal?: string
  ): Observable<RegistroGestionV2> {
    console.log('[PAYMENT-STATUS] Updating payment status:', { recordId, estadoPago, montoPagadoReal, fechaPagoReal });

    let params = `estadoPago=${estadoPago}`;
    if (montoPagadoReal !== undefined) {
      params += `&montoPagadoReal=${montoPagadoReal}`;
    }
    if (fechaPagoReal) {
      params += `&fechaPagoReal=${fechaPagoReal}`;
    }

    return this.http.put<RegistroGestionV2>(`${this.baseUrl}/${recordId}/payment-status?${params}`, {});
  }

  /**
   * Obtiene las cabeceras de montos (campos numéricos decimales) para una subcartera
   * Esto permite mostrar los nombres visuales de los campos de monto
   */
  getMontoCabeceras(idSubcartera: number): Observable<ConfiguracionCabecera[]> {
    console.log('[CABECERAS] Fetching monto cabeceras for subcartera:', idSubcartera);
    return this.http.get<ConfiguracionCabecera[]>(`${this.cabecerasUrl}/subcartera/${idSubcartera}/montos`);
  }

  /**
   * Transforma el request del frontend al formato del backend discador
   */
  private transformToBackendFormat(request: CreateManagementRequest): RegistroGestionV2 {
    // Determinar cuál es la tipificación final (la de mayor nivel seleccionada)
    const finalTypificationId = request.level3Id || request.level2Id || request.level1Id;

    // Generar ruta jerárquica: "Nivel1 > Nivel2 > Nivel3"
    const rutaParts: string[] = [];
    if (request.level1Name) rutaParts.push(request.level1Name);
    if (request.level2Name) rutaParts.push(request.level2Name);
    if (request.level3Name) rutaParts.push(request.level3Name);
    const rutaJerarquia = rutaParts.join(' > ');

    const backendRequest: RegistroGestionV2 = {
      idTenant: request.tenantId,
      idCartera: request.portfolioId,
      idSubcartera: request.subPortfolioId || undefined,
      idCliente: Number(request.customerId),
      idAgente: this.extractAgentId(request.advisorId),
      tipificacion: { id: finalTypificationId },
      observaciones: request.observations || '',
      // Campos corregidos
      canalContacto: request.canalContacto || 'SISTEMA',
      metodoContacto: request.metodoContacto || 'GESTION_MANUAL',
      estadoGestion: 'COMPLETADA',
      rutaJerarquia: rutaJerarquia || undefined,
      // Campos opcionales de llamada
      idCampana: request.idCampana || undefined,
      idLlamada: request.idLlamada || undefined,
      duracionSegundos: request.duracionSegundos || undefined
    };

    // Agregar niveles jerárquicos si existen
    if (request.level1Id) {
      backendRequest.tipificacionNivel1 = { id: request.level1Id };
    }
    if (request.level2Id) {
      backendRequest.tipificacionNivel2 = { id: request.level2Id };
    }
    if (request.level3Id) {
      backendRequest.tipificacionNivel3 = { id: request.level3Id };
    }

    return backendRequest;
  }

  /**
   * Transforma la respuesta del backend al formato del frontend
   */
  private transformToFrontendFormat(record: RegistroGestionV2, originalRequest?: CreateManagementRequest): ManagementResource {
    return {
      id: record.id || 0,
      customerId: String(record.idCliente),
      advisorId: String(record.idAgente),
      tenantId: record.idTenant,
      tenantName: '',
      portfolioId: record.idCartera || 0,
      portfolioName: '',
      subPortfolioId: record.idSubcartera,
      subPortfolioName: '',
      phone: record.canalContacto || '',
      level1Id: record.tipificacionNivel1?.id || (record.tipificacion as any)?.id || 0,
      level1Name: originalRequest?.level1Name || (record.tipificacionNivel1 as any)?.nombre || '',
      level2Id: record.tipificacionNivel2?.id,
      level2Name: originalRequest?.level2Name || (record.tipificacionNivel2 as any)?.nombre || '',
      level3Id: record.tipificacionNivel3?.id,
      level3Name: originalRequest?.level3Name || (record.tipificacionNivel3 as any)?.nombre || '',
      observations: record.observaciones,
      managementDate: record.fechaGestion?.split('T')[0],
      managementTime: record.fechaGestion?.split('T')[1]?.substring(0, 8)
    };
  }

  /**
   * Extrae el ID numérico del agente desde el advisorId
   * Si es "ADV-001" intenta obtener el ID real del usuario logueado
   */
  private extractAgentId(advisorId: string): number {
    // Por ahora usar un ID fijo, luego integrar con el sistema de auth
    // TODO: Obtener el ID real del agente desde el servicio de autenticación
    if (advisorId.startsWith('ADV-')) {
      return 1; // ID temporal
    }
    return Number(advisorId) || 1;
  }
}
