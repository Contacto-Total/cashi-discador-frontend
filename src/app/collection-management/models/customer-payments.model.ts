export interface CustomerPaymentsContext {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface CustomerCancellationReconciliation {
  correccionId: number;
  pagoCuotaId: number | null;
  cuotaId: number | null;
  fechaRegistro: string;
  fechaPago: string | null;
  montoCancelacion: number | null;
  banco: string | null;
  numeroOperacion: string | null;
  montoBanco: number | null;
  fechaBanco: string | null;
  estadoConciliacion: 'CONCILIADO' | 'PENDIENTE_CONCILIACION' | 'INCONSISTENTE' | 'ELIMINADO';
}

export interface CustomerPaymentsPage {
  content: CustomerCancellationReconciliation[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
