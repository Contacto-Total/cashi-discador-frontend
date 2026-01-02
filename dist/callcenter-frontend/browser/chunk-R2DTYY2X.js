import {
  environment
} from "./chunk-QF774CZR.js";
import {
  HttpClient,
  Injectable,
  map,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-CTRHJBBW.js";

// src/app/collection-management/services/management.service.ts
var _ManagementService = class _ManagementService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${environment.gatewayUrl}/v2/management-records`;
    this.scheduleUrl = `${environment.tipificacionUrl}/payment-schedules`;
    this.cabecerasUrl = `${environment.gatewayUrl}/configuracion-cabeceras`;
  }
  /**
   * Crea un nuevo registro de gestión en el backend discador
   */
  createManagement(request) {
    const backendRequest = this.transformToBackendFormat(request);
    console.log("[MANAGEMENT] Creating management record:", backendRequest);
    return this.http.post(this.baseUrl, backendRequest).pipe(map((response) => this.transformToFrontendFormat(response, request)));
  }
  /**
   * Obtiene una gestión por ID
   */
  getManagementById(managementId) {
    return this.http.get(`${this.baseUrl}/${managementId}`).pipe(map((response) => this.transformToFrontendFormat(response)));
  }
  /**
   * Obtiene todas las gestiones de un cliente por ID
   * @deprecated Usar getManagementsByDocumento para mayor robustez
   */
  getManagementsByCustomer(customerId) {
    return this.http.get(`${this.baseUrl}/client/${customerId}`).pipe(map((records) => records.map((r) => this.transformToFrontendFormat(r))));
  }
  /**
   * Obtiene todas las gestiones de un cliente por documento.
   * Más robusto que buscar por ID ya que el documento es el identificador único.
   */
  getManagementsByDocumento(documento) {
    console.log("[MANAGEMENT] Fetching managements by documento:", documento);
    return this.http.get(`${this.baseUrl}/documento/${documento}`).pipe(map((records) => records.map((r) => this.transformToFrontendFormat(r))));
  }
  getManagementsByAdvisor(advisorId) {
    return this.http.get(`${this.baseUrl}/agent/${advisorId}`).pipe(map((records) => records.map((r) => this.transformToFrontendFormat(r))));
  }
  getActiveSchedulesByCustomer(customerId) {
    console.log("[SCHEDULE] Fetching active schedules for customer:", customerId);
    return this.http.get(`${this.baseUrl}/payment-schedule/client/${customerId}/active`).pipe(map((records) => this.transformToPaymentSchedules(records)));
  }
  /**
   * Obtiene cronogramas de pago activos por documento del cliente.
   * Más robusto que buscar por ID.
   */
  getActiveSchedulesByDocumento(documento) {
    console.log("[SCHEDULE] Fetching active schedules for documento:", documento);
    return this.http.get(`${this.baseUrl}/payment-schedule/documento/${documento}/active`).pipe(map((records) => this.transformToPaymentSchedules(records)));
  }
  /**
   * Transforma los registros del backend (RegistroGestionV2 con cuotasPromesa) al formato PaymentSchedule del frontend
   */
  transformToPaymentSchedules(records) {
    return records.map((record) => {
      const cuotas = record.cuotasPromesa || [];
      const totalAmount = cuotas.reduce((sum, c) => sum + (c.montoPromesa || c.monto || 0), 0);
      const paidAmount = cuotas.filter((c) => c.estado === "PAGADA" || c.estado === "CUMPLIDO").reduce((sum, c) => sum + (c.montoPagadoReal || c.montoPromesa || c.monto || 0), 0);
      const pendingAmount = totalAmount - paidAmount;
      const paidInstallments = cuotas.filter((c) => c.estado === "PAGADA" || c.estado === "CUMPLIDO").length;
      const pendingInstallments = cuotas.filter((c) => c.estado === "PENDIENTE").length;
      return {
        id: record.id,
        scheduleId: {
          scheduleId: record.grupoPromesaUuid || record.uuid
        },
        customerId: String(record.idCliente),
        managementId: String(record.id),
        totalAmount,
        numberOfInstallments: cuotas.length,
        startDate: record.fechaGestion?.split("T")[0] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        isActive: pendingInstallments > 0,
        scheduleType: record.tipoCronograma || "CONFIANZA",
        negotiatedAmount: record.montoPromesaPago || totalAmount,
        installments: cuotas.map((cuota) => ({
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
          status: cuota.estado || "PENDIENTE",
          montoPagadoReal: cuota.montoPagadoReal || 0
        })),
        paidAmount,
        pendingAmount,
        paidInstallments,
        pendingInstallments,
        fullyPaid: pendingInstallments === 0
      };
    });
  }
  startCall(managementId, request) {
    console.log("[CALL] Start call for management:", managementId, request);
    return this.getManagementById(managementId.toString());
  }
  endCall(managementId, request) {
    console.log("[CALL] End call for management:", managementId, request);
    return this.getManagementById(managementId.toString());
  }
  registerPayment(managementId, request) {
    console.log("[PAYMENT] Register payment for management:", managementId, request);
    return this.getManagementById(managementId);
  }
  /**
   * Crea un cronograma de pagos (1 cabecera + N cuotas en tabla separada)
   * Retorna la cabecera con las cuotas asociadas
   */
  createPaymentSchedule(request) {
    console.log("[SCHEDULE] Creating payment schedule:", request);
    return this.http.post(`${this.baseUrl}/payment-schedule`, request);
  }
  /**
   * Actualiza el estado de pago de una cuota de promesa de pago
   * @param recordId ID del registro en registros_gestion_v2
   * @param estadoPago Nuevo estado: PENDIENTE, PAGADA, VENCIDA, PARCIAL, CANCELADA
   * @param montoPagadoReal Monto realmente pagado (opcional)
   * @param fechaPagoReal Fecha en que se realizó el pago (opcional)
   */
  updatePaymentStatus(recordId, estadoPago, montoPagadoReal, fechaPagoReal) {
    console.log("[PAYMENT-STATUS] Updating payment status:", { recordId, estadoPago, montoPagadoReal, fechaPagoReal });
    let params = `estadoPago=${estadoPago}`;
    if (montoPagadoReal !== void 0) {
      params += `&montoPagadoReal=${montoPagadoReal}`;
    }
    if (fechaPagoReal) {
      params += `&fechaPagoReal=${fechaPagoReal}`;
    }
    return this.http.put(`${this.baseUrl}/${recordId}/payment-status?${params}`, {});
  }
  /**
   * Verifica si una cuota puede ser cancelada (pagada)
   * Solo se puede cancelar si está PENDIENTE y la fecha de pago es hoy o futura
   * @param cuotaId ID de la cuota en cuotas_promesa
   */
  puedeCancelarCuota(cuotaId) {
    console.log("[CUOTA] Checking if cuota can be canceled:", cuotaId);
    return this.http.get(`${this.baseUrl}/cuota/${cuotaId}/puede-cancelar`);
  }
  /**
   * Cancela (marca como PAGADA) una cuota de promesa de pago con validación de fecha
   * Valida que la cuota esté PENDIENTE y que la fecha de pago no haya pasado
   * @param cuotaId ID de la cuota en cuotas_promesa
   * @param montoPagadoReal Monto realmente pagado (opcional)
   * @param fechaPagoReal Fecha en que se realizó el pago (opcional)
   * @param observaciones Observaciones adicionales (opcional)
   */
  cancelarCuota(cuotaId, montoPagadoReal, fechaPagoReal, observaciones) {
    console.log("[CUOTA] Canceling cuota:", { cuotaId, montoPagadoReal, fechaPagoReal, observaciones });
    let params = "";
    const paramParts = [];
    if (montoPagadoReal !== void 0) {
      paramParts.push(`montoPagadoReal=${montoPagadoReal}`);
    }
    if (fechaPagoReal) {
      paramParts.push(`fechaPagoReal=${fechaPagoReal}`);
    }
    if (observaciones) {
      paramParts.push(`observaciones=${encodeURIComponent(observaciones)}`);
    }
    if (paramParts.length > 0) {
      params = "?" + paramParts.join("&");
    }
    return this.http.put(`${this.baseUrl}/cuota/${cuotaId}/cancelar${params}`, {});
  }
  /**
   * Obtiene las cabeceras de montos (campos numéricos decimales) para una subcartera
   * Esto permite mostrar los nombres visuales de los campos de monto
   */
  getMontoCabeceras(idSubcartera) {
    console.log("[CABECERAS] Fetching monto cabeceras for subcartera:", idSubcartera);
    return this.http.get(`${this.cabecerasUrl}/subcartera/${idSubcartera}/montos`);
  }
  /**
   * Actualiza la visibilidad y orden de visualización de múltiples cabeceras
   * Usado para configurar qué campos de montos se muestran en la gestión de cobranza
   */
  updateAmountVisibility(idSubcartera, updates) {
    console.log("[CABECERAS] Updating visibility for subcartera:", idSubcartera, updates);
    return this.http.put(`${this.cabecerasUrl}/subcartera/${idSubcartera}/visibility`, updates);
  }
  /**
   * Transforma el request del frontend al formato del backend discador
   */
  transformToBackendFormat(request) {
    const finalTypificationId = request.level3Id || request.level2Id || request.level1Id;
    const rutaParts = [];
    if (request.level1Name)
      rutaParts.push(request.level1Name);
    if (request.level2Name)
      rutaParts.push(request.level2Name);
    if (request.level3Name)
      rutaParts.push(request.level3Name);
    const rutaJerarquia = rutaParts.join(" > ");
    const backendRequest = {
      idTenant: request.tenantId,
      idCartera: request.portfolioId,
      idSubcartera: request.subPortfolioId || void 0,
      idCliente: Number(request.customerId),
      nombreCliente: request.customerName || void 0,
      documentoCliente: request.customerDocument || void 0,
      idAgente: this.extractAgentId(request.advisorId),
      tipificacion: { id: finalTypificationId },
      observaciones: request.observations || "",
      // Campos de contacto
      canalContacto: request.canalContacto || void 0,
      metodoContacto: request.metodoContacto || "GESTION_MANUAL",
      estadoGestion: "COMPLETADA",
      // Campos opcionales de llamada
      idCampana: request.idCampana || void 0,
      idLlamada: request.idLlamada || void 0,
      duracionSegundos: request.duracionSegundos || void 0,
      // Información del agente y dispositivo
      nombreAgente: request.nombreAgente || void 0,
      userAgent: request.userAgent || void 0
    };
    return backendRequest;
  }
  /**
   * Transforma la respuesta del backend al formato del frontend
   */
  transformToFrontendFormat(record, originalRequest) {
    let managementDate = record.fechaGestion;
    if (managementDate && managementDate.includes("T")) {
      managementDate = managementDate.split("T")[0];
    }
    return {
      id: record.id || 0,
      customerId: String(record.idCliente),
      advisorId: String(record.idAgente),
      tenantId: record.idTenant,
      tenantName: "",
      portfolioId: record.idCartera || 0,
      portfolioName: "",
      subPortfolioId: record.idSubcartera,
      subPortfolioName: "",
      phone: record.telefonoContacto || "",
      telefonoContacto: record.telefonoContacto || "",
      level1Id: record.tipificacion?.id || 0,
      level1Name: originalRequest?.level1Name || record.rutaNivel1 || "",
      level2Id: void 0,
      level2Name: originalRequest?.level2Name || record.rutaNivel2 || "",
      level3Id: void 0,
      level3Name: originalRequest?.level3Name || record.rutaNivel3 || "",
      level4Name: record.rutaNivel4 || "",
      observations: record.observaciones,
      managementDate,
      managementTime: void 0,
      // Additional fields for history
      canalContacto: record.canalContacto || "",
      metodoContacto: record.metodoContacto || "",
      nombreAgente: record.nombreAgente || record.userAgent || `Agente ${record.idAgente}`,
      duracionSegundos: record.duracionSegundos || 0,
      // Promesa de pago
      montoPromesa: record.montoPromesa || void 0,
      estadoPago: record.estadoPago || void 0
    };
  }
  /**
   * Extrae el ID numérico del agente desde el advisorId
   * Si es "ADV-001" intenta obtener el ID real del usuario logueado
   */
  extractAgentId(advisorId) {
    if (advisorId.startsWith("ADV-")) {
      return 1;
    }
    return Number(advisorId) || 1;
  }
};
_ManagementService.\u0275fac = function ManagementService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ManagementService)(\u0275\u0275inject(HttpClient));
};
_ManagementService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ManagementService, factory: _ManagementService.\u0275fac, providedIn: "root" });
var ManagementService = _ManagementService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ManagementService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  ManagementService
};
//# sourceMappingURL=chunk-R2DTYY2X.js.map
