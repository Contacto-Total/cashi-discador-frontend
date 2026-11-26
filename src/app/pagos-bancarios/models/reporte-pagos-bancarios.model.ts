export interface ReportePagosBancarios {
  periodo: string;
  banco: string;
  totalRegistros: number;
  montoTotal: number;
  pagina: number;
  tamanoPagina: number;
  totalPaginas: number;
  incluyePeriodoCompra?: boolean;
  /** Compra elegida (PRIMERA, SEGUNDA, …); null si se consultó toda la subcartera */
  compra?: string | null;
  /** La subcartera tiene compras; el Excel lleva la columna «Compra» */
  incluyeCompra?: boolean;
  pagos: DetallePagoBancario[];
}

/** Filtros del reporte. compra: orden_compra de Tramo Propio; null = toda la subcartera. */
export interface FiltrosReportePagosBancarios {
  periodo: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  compra: string | null;
}

export interface DetallePagoBancario {
  id: number;
  documento: string | null;
  codigoDepositante: string | null;
  fechaBanco: string | null;
  horaAtencion: string | null;
  montoBanco: number | null;
  banco: string | null;
  medioAtencion: string | null;
  numeroOperacion: string | null;
  numeroOperacionCanal: string | null;
  sucursal: string | null;
  agencia: string | null;
  referencia: string | null;
  procesado: boolean | null;
  cuotaAplicadaId: number | null;
  transaccionIdAplicada: number | null;
  periodoCompra?: string | null;
  /** Compra del cliente (orden_compra) */
  compra?: string | null;
  /** Deuda, producto y moneda del pago (solo en los archivos que los traen). */
  cuenta?: string | null;
  producto?: string | null;
  moneda?: string | null;
  categoria?: string | null;
  nombreCliente?: string | null;
}
