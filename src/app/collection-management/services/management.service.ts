import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
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
  nombreCliente?: string;
  documentoCliente?: string;
  idAgente: number;
  idCampana?: number;
  idLlamada?: number;
  fechaGestion?: string;
  duracionSegundos?: number;
  tipificacion: { id: number };
  rutaNivel1?: string;
  rutaNivel2?: string;
  rutaNivel3?: string;
  rutaNivel4?: string;
  observaciones?: string;
  metodoContacto?: string;
  canalContacto?: string;
  estadoGestion?: string;
  nombreAgente?: string;
  userAgent?: string;
  // Campos adicionales
  telefonoContacto?: string;
  montoPromesa?: number;
  estadoPago?: string;
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
  telefonoContacto?: string;  // Teléfono de contacto usado

  // Hierarchical categorization
  level1Id: number;
  level1Name: string;
  level2Id?: number;
  level2Name?: string;
  level3Id?: number;
  level3Name?: string;
  level4Name?: string;

  observations?: string;
  typificationRequiresPayment?: boolean;
  typificationRequiresSchedule?: boolean;

  // Automatic timestamp fields
  managementDate?: string;  // Fecha de gestión (YYYY-MM-DD)
  managementTime?: string;  // Hora de gestión (HH:mm:ss)

  // Additional fields for history display
  canalContacto?: string;     // Channel (LLAMADA_SALIENTE, WHATSAPP, etc.)
  metodoContacto?: string;    // Method (GESTION_MANUAL, GESTION_PROGRESIVO, etc.)
  nombreAgente?: string;      // Agent name (human readable)
  duracionSegundos?: number;  // Duration in seconds

  // Promesa de pago
  montoPromesa?: number;      // Monto prometido
  estadoPago?: string;        // Estado del pago (PENDIENTE, PAGADA, VENCIDA, etc.)
}

export interface CallDetailResource {
  phoneNumber: string;
  startTime: string;
  endTime?: string;
  durationSeconds?: number;
}

/**
 * Interface para gestiones históricas (base de datos antigua)
 */
export interface GestionHistoricaResponse {
  fechaGestion: string;
  horaGestion: string;
  agente: string;
  resultado: string;      // ruta_nivel_2
  solucion: string;       // ruta_nivel_3
  telefono: string;
  observacion: string;
  canal: string;          // LLAMADA_SALIENTE, LLAMADA_ENTRANTE, WHATSAPP
  metodo: string;         // GESTION_MANUAL, GESTION_PROGRESIVO
  montoPromesa: number | null;
  estadoPromesa: string | null;  // PAGADA, VENCIDA, PENDIENTE
}

/**
 * Interface para respuesta paginada
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PaymentDetailResource {
  amount: number;
  scheduledDate: string;
  paymentMethodType: string;
  paymentMethodDetails?: string;
  voucherNumber?: string;
  bankName?: string;
}

/**
 * Interface para respuesta de verificación de continuidad de promesa
 */
export interface ContinuidadPromesaResponse {
  aplica: boolean;
  mensaje: string;
  promesaOrigenUuid?: string;
  montoOriginal?: number;
  montoPagado?: number;
  saldoRestante?: number;
  fechaVencimiento?: string;
  nombreCliente?: string;
  documentoCliente?: string;
}


export interface CreateManagementRequest {
  customerId: string;
  customerName?: string;
  customerDocument?: string;
  advisorId: string;
  idAgente?: number;  // ID numérico del agente para el backend

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
  // metodoContacto: QUIÉN/QUÉ originó la gestión
  metodoContacto?: 'GESTION_MANUAL' | 'GESTION_PROGRESIVO' | 'GESTION_PREDICTIVO' | 'GESTION_AUTOMATICA';
  // canalContacto: POR QUÉ MEDIO se contactó
  canalContacto?: 'LLAMADA_SALIENTE' | 'LLAMADA_ENTRANTE' | 'SMS' | 'WHATSAPP' | 'EMAIL';
  idCampana?: number | null;
  idLlamada?: number | null;
  duracionSegundos?: number | null;

  // Información del agente y dispositivo
  nombreAgente?: string;
  userAgent?: string;
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
  nombreCliente?: string;
  documentoCliente?: string;
  idAgente: number;
  idTenant: number;
  idCartera?: number;
  idSubcartera?: number;
  idCampana?: number;
  idTipificacion: number;
  observaciones?: string;
  metodoContacto?: string;  // GESTION_MANUAL, GESTION_PROGRESIVO, etc.
  canalContacto?: string;   // LLAMADA_SALIENTE, LLAMADA_ENTRANTE, SMS, etc.
  campoMontoOrigen?: string;  // Nombre del campo de donde viene el monto (ej: sld_mora, sld_total)
  montoBase?: number;  // Monto original del campo (antes de descuento/excepción). null = monto libre
  // Campos de continuidad
  esContinuidad?: boolean;           // true si es promesa de continuidad
  promesaOrigenUuid?: string;        // UUID de la promesa original (caída)
  montoOriginalPromesa?: number;     // Monto de la promesa original
  montoPagadoPrevio?: number;        // Lo que ya había pagado de la promesa original
  // Excepción de primera cuota
  esExcepcionPrimeraCuota?: boolean; // true si la fecha de primera cuota excede el límite configurado
  diasPrimeraCuota?: number;         // Días desde hoy hasta la fecha de la primera cuota
  maxDiasPermitidos?: number;        // Máximo de días permitidos según configuración
  // Porcentaje de auto-aprobación para excepciones
  porcentajeAutoAprobacion?: number;
  schedule: {
    montoTotal: number;
    numeroCuotas: number;
    cuotas: PaymentInstallmentRequest[];
    porcentajeAutoAprobacion?: number;  // Porcentaje para calcular excepciones
    generaCartaAcuerdo?: boolean;       // Si el monto genera carta de acuerdo
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
  esVisibleMonto?: number;  // 1 = visible, 0 = oculto
  ordenMonto?: number;      // Orden de visualización
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
   * Obtiene todas las gestiones de un cliente por ID
   * @deprecated Usar getManagementsByDocumento para mayor robustez
   */
  getManagementsByCustomer(customerId: string): Observable<ManagementResource[]> {
    return this.http.get<RegistroGestionV2[]>(`${this.baseUrl}/client/${customerId}`).pipe(
      map(records => records.map(r => this.transformToFrontendFormat(r)))
    );
  }

  /**
   * Obtiene todas las gestiones de un cliente por documento.
   * Más robusto que buscar por ID ya que el documento es el identificador único.
   */
  getManagementsByDocumento(documento: string): Observable<ManagementResource[]> {
    console.log('[MANAGEMENT] Fetching managements by documento:', documento);
    return this.http.get<RegistroGestionV2[]>(`${this.baseUrl}/documento/${documento}`).pipe(
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
    // Usar el nuevo endpoint del backend discador que devuelve cabeceras con cuotas
    return this.http.get<any[]>(`${this.baseUrl}/payment-schedule/client/${customerId}/active`).pipe(
      map(records => this.transformToPaymentSchedules(records))
    );
  }

  /**
   * Obtiene cronogramas de pago activos por documento del cliente.
   * Más robusto que buscar por ID.
   */
  getActiveSchedulesByDocumento(documento: string): Observable<PaymentSchedule[]> {
    console.log('[SCHEDULE] Fetching active schedules for documento:', documento);
    return this.http.get<any[]>(`${this.baseUrl}/payment-schedule/documento/${documento}/active`).pipe(
      tap(rawRecords => {
        console.log('🔍 [SCHEDULE] Datos CRUDOS del backend:', rawRecords);
        if (rawRecords && rawRecords.length > 0) {
          rawRecords.forEach((r, i) => {
            console.log(`🔍 [SCHEDULE] Registro[${i}]: id=${r.id}, documento=${r.documentoCliente}, cuotasPromesa=`, r.cuotasPromesa);
          });
        }
      }),
      map(records => this.transformToPaymentSchedules(records))
    );
  }

  /**
   * Transforma los registros del backend (RegistroGestionV2 con cuotasPromesa) al formato PaymentSchedule del frontend
   */
  private transformToPaymentSchedules(records: any[]): PaymentSchedule[] {
    return records.map(record => {
      const cuotas = record.cuotasPromesa || [];

      // Calcular totales (usando montoPromesa que es el nuevo nombre del campo)
      const totalAmount = cuotas.reduce((sum: number, c: any) => sum + (c.montoPromesa || c.monto || 0), 0);
      const paidAmount = cuotas
        .filter((c: any) => c.estado === 'PAGADA' || c.estado === 'CUMPLIDO')
        .reduce((sum: number, c: any) => sum + (c.montoPagadoReal || c.montoPromesa || c.monto || 0), 0);
      const pendingAmount = totalAmount - paidAmount;

      const paidInstallments = cuotas.filter((c: any) => c.estado === 'PAGADA' || c.estado === 'CUMPLIDO').length;
      const pendingInstallments = cuotas.filter((c: any) => c.estado === 'PENDIENTE').length;

      return {
        id: record.id,
        scheduleId: {
          scheduleId: record.grupoPromesaUuid || record.uuid
        },
        customerId: String(record.idCliente),
        managementId: String(record.id),
        totalAmount: totalAmount,
        numberOfInstallments: cuotas.length,
        startDate: record.fechaGestion?.split('T')[0] || new Date().toISOString().split('T')[0],
        isActive: pendingInstallments > 0,
        scheduleType: record.tipoCronograma || 'CONFIANZA',
        negotiatedAmount: record.montoPromesaPago || totalAmount,
        installments: cuotas.map((cuota: any) => ({
          id: cuota.id,
          installmentNumber: cuota.numeroCuota,
          numeroCuota: cuota.numeroCuota,
          amount: cuota.montoPromesa || cuota.monto,
          monto: cuota.montoPromesa || cuota.monto,
          montoPromesa: cuota.montoPromesa || cuota.monto,
          dueDate: cuota.fechaPromesa || cuota.fechaPago,
          fechaPago: cuota.fechaPromesa || cuota.fechaPago,
          fechaPromesa: cuota.fechaPromesa || cuota.fechaPago,
          paidDate: cuota.fechaPagoReal || null,
          status: cuota.estado || 'PENDIENTE',
          montoPagadoReal: cuota.montoPagadoReal || 0
        })),
        paidAmount,
        pendingAmount,
        paidInstallments,
        pendingInstallments,
        fullyPaid: pendingInstallments === 0
      } as PaymentSchedule;
    });
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
   * Crea un cronograma de pagos (1 cabecera + N cuotas en tabla separada)
   * Retorna la cabecera con las cuotas asociadas
   */
  createPaymentSchedule(request: PaymentScheduleRequest): Observable<RegistroGestionV2> {
    console.log('[SCHEDULE] Creating payment schedule:', request);
    return this.http.post<RegistroGestionV2>(`${this.baseUrl}/payment-schedule`, request);
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
   * Verifica si una cuota puede ser cancelada (pagada)
   * Solo se puede cancelar si está PENDIENTE y la fecha de pago es hoy o futura
   * @param cuotaId ID de la cuota en cuotas_promesa
   */
  puedeCancelarCuota(cuotaId: number): Observable<{ cuotaId: number; puedeCancelar: boolean; mensaje?: string }> {
    console.log('[CUOTA] Checking if cuota can be canceled:', cuotaId);
    return this.http.get<{ cuotaId: number; puedeCancelar: boolean; mensaje?: string }>(`${this.baseUrl}/cuota/${cuotaId}/puede-cancelar`);
  }

  /**
   * Cancela (marca como PAGADA) una cuota de promesa de pago con validación de fecha
   * Valida que la cuota esté PENDIENTE y que la fecha de pago no haya pasado
   * @param cuotaId ID de la cuota en cuotas_promesa
   * @param montoPagadoReal Monto realmente pagado (opcional)
   * @param fechaPagoReal Fecha en que se realizó el pago (opcional)
   * @param observaciones Observaciones adicionales (opcional)
   */
  cancelarCuota(
    cuotaId: number,
    montoPagadoReal?: number,
    fechaPagoReal?: string,
    observaciones?: string
  ): Observable<any> {
    console.log('[CUOTA] Canceling cuota:', { cuotaId, montoPagadoReal, fechaPagoReal, observaciones });

    let params = '';
    const paramParts: string[] = [];
    if (montoPagadoReal !== undefined) {
      paramParts.push(`montoPagadoReal=${montoPagadoReal}`);
    }
    if (fechaPagoReal) {
      paramParts.push(`fechaPagoReal=${fechaPagoReal}`);
    }
    if (observaciones) {
      paramParts.push(`observaciones=${encodeURIComponent(observaciones)}`);
    }
    if (paramParts.length > 0) {
      params = '?' + paramParts.join('&');
    }

    return this.http.put<any>(`${this.baseUrl}/cuota/${cuotaId}/cancelar${params}`, {});
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
   * Actualiza la visibilidad y orden de visualización de múltiples cabeceras
   * Usado para configurar qué campos de montos se muestran en la gestión de cobranza
   */
  updateAmountVisibility(
    idSubcartera: number,
    updates: { id: number; esVisibleMonto: number; ordenMonto: number }[]
  ): Observable<ConfiguracionCabecera[]> {
    console.log('[CABECERAS] Updating visibility for subcartera:', idSubcartera, updates);
    return this.http.put<ConfiguracionCabecera[]>(
      `${this.cabecerasUrl}/subcartera/${idSubcartera}/visibility`,
      updates
    );
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
      nombreCliente: request.customerName || undefined,
      documentoCliente: request.customerDocument || undefined,
      idAgente: this.extractAgentId(request.advisorId),
      tipificacion: { id: finalTypificationId },
      observaciones: request.observations || '',
      // Campos de contacto
      telefonoContacto: request.phone || undefined,
      canalContacto: request.canalContacto || undefined,
      metodoContacto: request.metodoContacto || 'GESTION_MANUAL',
      estadoGestion: 'COMPLETADA',
      // Campos opcionales de llamada
      idCampana: request.idCampana || undefined,
      idLlamada: request.idLlamada || undefined,
      duracionSegundos: request.duracionSegundos || undefined,
      // Información del agente y dispositivo
      nombreAgente: request.nombreAgente || undefined,
      userAgent: request.userAgent || undefined
    };

    // Nota: Los niveles jerárquicos (rutaNivel1, rutaNivel2, etc.) se calculan
    // automáticamente en el backend basándose en la tipificación principal

    return backendRequest;
  }

  /**
   * Transforma la respuesta del backend al formato del frontend
   */
  private transformToFrontendFormat(record: RegistroGestionV2, originalRequest?: CreateManagementRequest): ManagementResource {
    // Extraer fecha sin hora
    let managementDate = record.fechaGestion;
    if (managementDate && managementDate.includes('T')) {
      managementDate = managementDate.split('T')[0];
    }

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
      phone: record.telefonoContacto || '',
      telefonoContacto: record.telefonoContacto || '',
      level1Id: (record.tipificacion as any)?.id || 0,
      level1Name: originalRequest?.level1Name || record.rutaNivel1 || '',
      level2Id: undefined,
      level2Name: originalRequest?.level2Name || record.rutaNivel2 || '',
      level3Id: undefined,
      level3Name: originalRequest?.level3Name || record.rutaNivel3 || '',
      level4Name: record.rutaNivel4 || '',
      observations: record.observaciones,
      managementDate: managementDate,
      managementTime: undefined,
      // Additional fields for history
      canalContacto: record.canalContacto || '',
      metodoContacto: record.metodoContacto || '',
      nombreAgente: record.nombreAgente || record.userAgent || `Agente ${record.idAgente}`,
      duracionSegundos: record.duracionSegundos || 0,
      // Promesa de pago
      montoPromesa: record.montoPromesa || undefined,
      estadoPago: record.estadoPago || undefined
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

  // ==================== HISTORIAL HISTÓRICO (Base de datos antigua) ====================

  /**
   * Obtiene gestiones históricas de un cliente desde la base de datos antigua (Web-Service)
   * @param documento Documento del cliente
   * @param page Número de página (0-indexed)
   * @param size Tamaño de página
   */
  getGestionesHistoricas(documento: string, page: number = 0, size: number = 10): Observable<PageResponse<GestionHistoricaResponse>> {
    console.log('[HISTORICO] Fetching historical managements for documento:', documento, { page, size });
    return this.http.get<PageResponse<GestionHistoricaResponse>>(
      `${environment.gatewayUrl.replace('/api', '')}/web-service/gestion/historica/cliente/${documento}`,
      { params: { page: page.toString(), size: size.toString() } }
    );
  }

  // ==================== CONTINUIDAD DE PROMESAS ====================

  /**
   * Verifica si un cliente puede crear una promesa de continuidad.
   * Aplica si tiene promesa VENCIDA con pagos parciales.
   * @param documento Documento del cliente
   */
  verificarContinuidad(documento: string): Observable<ContinuidadPromesaResponse> {
    console.log('[CONTINUIDAD] Verificando continuidad para documento:', documento);
    return this.http.get<ContinuidadPromesaResponse>(
      `${environment.gatewayUrl}/v2/management-records/promesas/continuidad/verificar/${documento}`
    );
  }
}
