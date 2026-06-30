export interface CorreccionPagoContexto {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface BuscarPagosPendientesConciliacionRequest extends CorreccionPagoContexto {
  documento: string;
}

export interface BuscarCuotasValidasTipificarRequest extends CorreccionPagoContexto {
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

export type EstadoCuotaValidaTipificar = 'PENDIENTE' | 'PARCIAL' | 'VENCIDA';

export interface CuotaValidaTipificar {
  cuotaId: number;
  numeroCuota: number;
  fechaPromesa: string;
  montoPromesa: number;
  montoPagadoReal: number | null;
  estadoCuota: EstadoCuotaValidaTipificar;
  gestionId: number;
  grupoPromesaUuid: string;
  fechaGestion: string;
  documento: string;
  nombreCliente: string;
  asesorId: number;
  nombreAsesor: string;
  estadoPagoGestion: string;
  rutaTipificacion: string;
}

export interface CrearCancelacionRequest {
  documento: string;
  fechaPago: string;
  montoPago: number;
  banco?: string;
  numeroOperacion?: string;
  observaciones?: string;
}

export interface CrearCancelacionResponse {
  pagoCuotaId: number;
  gestionCancelacionId: number;
  cuotaId: number;
  gestionId: number;
  grupoPromesaUuid: string;
  documento: string;
  transaccionId: number;
  fechaPago: string;
  montoPago: number;
  banco: string;
  numeroOperacion: string | null;
  asesorId: number;
  estadoCuota: string;
  estadoPagoGestion: string;
}

export interface AmpliarVencimientoRequest {
  documento: string;
  fechaPago: string;
  montoPago: number;
  pagoCorrespondeAsesor: boolean;
  banco?: string;
  numeroOperacion?: string;
  observaciones?: string;
}

export interface AmpliarVencimientoResponse {
  pagoCuotaId: number;
  cuotaId: number;
  gestionId: number;
  grupoPromesaUuid: string;
  documento: string;
  transaccionId: number;
  fechaVencimientoAnterior: string;
  fechaVencimientoNueva: string;
  fechaPago: string;
  montoPago: number;
  pagoCorrespondeAsesor: boolean;
  banco: string;
  numeroOperacion: string | null;
  asesorId: number;
  estadoCuota: string;
  estadoPagoGestion: string;
}

export interface CrearPromesaSistemaPagoBancoRequest {
  documento: string;
  fechaPago: string;
  montoPago: number;
}

export interface CrearPromesaSistemaPagoBancoResponse {
  pagoCuotaId: number;
  cuotaId: number;
  gestionId: number;
  grupoPromesaUuid: string;
  documento: string;
  transaccionId: number;
  fechaPago: string;
  montoPago: number;
  banco: string;
  numeroOperacion: string | null;
  estadoCuota: string;
  estadoPagoGestion: string;
}

export interface CrearPagoVoluntarioSistemaRequest {
  documento: string;
  fechaPago: string;
  montoPago: number;
}

export interface CrearPagoVoluntarioSistemaResponse {
  pagoCuotaId: number;
  cuotaId: number | null;
  gestionId: number | null;
  documento: string;
  transaccionId: number;
  fechaPago: string;
  montoPago: number;
  banco: string;
  numeroOperacion: string | null;
  estadoCuota: string | null;
  estadoPagoGestion: string | null;
}
