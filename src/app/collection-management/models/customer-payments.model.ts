export interface CustomerPaymentsContext {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface CustomerCancellationAttempt {
  idGestion: number;
  fechaGestion: string;
  metodoContacto: 'GESTION_AUTOMATICA' | 'GESTION_MANUAL' | 'GESTION_PROGRESIVO' | 'GESTION_PREDICTIVO' | null;
}

export interface CustomerPaymentsSummary {
  documento: string;
  nombreCliente: string | null;
  intentosCancelacion?: CustomerCancellationAttempt[];
}
