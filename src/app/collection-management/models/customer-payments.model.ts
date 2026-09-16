export interface CustomerPaymentsContext {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface CustomerCancellationReconciliation {
  id: number;
  fechaCancelacion: string;
  montoCancelacion: number | null;
  banco: string | null;
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
