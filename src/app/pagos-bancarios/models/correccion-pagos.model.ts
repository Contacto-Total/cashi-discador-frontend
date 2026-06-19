export interface CorreccionPagoContexto {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface BuscarPagosPendientesConciliacionRequest extends CorreccionPagoContexto {
  documento: string;
}

export interface PagoPendienteConciliacion {
  pagoCuotaId: number;
  transaccionId: number;
  documento: string;
  fechaPago: string;
  montoPago: number;
  banco: string;
  numeroOperacion: string;
  cuotaId: number;
  numeroCuota: number;
  fechaPromesa: string;
  montoPromesa: number;
  estadoCuota: string;
  gestionId: number;
  fechaGestion: string;
  nombreCliente: string;
  nombreAgente: string;
  estadoPagoGestion: string;
  rutaTipificacion: string;
}

export interface CorregirPagoRequest {
  fechaPago: string;
  montoPago: number;
}

export interface CorregirPagoResponse {
  pagoCuotaId: number;
  cuotaId: number;
  gestionId: number;
  documento: string;
  transaccionId: number;
  fechaPagoAnterior: string;
  montoPagoAnterior: number;
  fechaPagoNueva: string;
  montoPagoNuevo: number;
  estadoCuota: string;
  estadoPagoGestion: string;
}
