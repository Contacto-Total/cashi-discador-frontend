export interface CustomerPaymentsContext {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface CustomerBankPayment {
  id: number;
  fechaPago: string | null;
  montoPago: number | null;
}

export interface CustomerPaymentsPage {
  content: CustomerBankPayment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}
