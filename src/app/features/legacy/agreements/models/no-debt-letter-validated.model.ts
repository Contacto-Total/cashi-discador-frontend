export interface GenerateValidatedNoDebtLetterRequest {
  documento: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export type NoDebtLetterValidationFailureReason =
  | 'CUOTAS_SIN_PAGO_REGISTRADO_SISTEMA'
  | 'PAGOS_PENDIENTES_VERIFICACION_BANCO'
  | 'PROMESA_PAGADA_NO_ENCONTRADA'
  | string;

export interface NoDebtLetterRejectedInstallment {
  cuotaId: number;
  numeroCuota: number;
  fechaPromesa: string;
  montoPromesa: number;
  estado: string;
  motivo: string;
}

export interface NoDebtLetterRejectedPayment {
  pagoCuotaId: number;
  cuotaId: number;
  numeroCuota: number;
  fechaPago: string;
  montoPago: number;
  banco: string | null;
  numeroOperacion: string | null;
  verificadoBanco: boolean;
  pagoBancarioId: number | null;
  fechaVerificacion: string | null;
  motivo: string;
}

export interface NoDebtLetterValidationErrorResponse {
  apto?: false;
  motivo?: NoDebtLetterValidationFailureReason;
  mensaje?: string;
  message?: string;
  code?: NoDebtLetterValidationFailureReason;
  gestionId?: number;
  cuotas?: NoDebtLetterRejectedInstallment[];
  pagos?: NoDebtLetterRejectedPayment[];
}

export interface EligibleNoDebtLetterClient {
  gestionId: number;
  documento: string;
  nombreCliente: string;
  montoPagado: number;
  agenteId: number;
  nombreAgente: string;
  fechaPromesa: string;
  fechaUltimoPago: string;
}

export interface EligibleNoDebtLetterClientsResponse {
  success: boolean;
  total: number;
  page: number;
  size: number;
  totalPages: number;
  data: EligibleNoDebtLetterClient[];
}
