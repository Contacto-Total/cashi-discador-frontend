/** Tipos de fila que devuelve sp_reporte_conciliacion. */
export type TipoCasoConciliacion =
  | 'MATCH_COMPLETO'
  | 'PAGO_REGISTRADO'
  | 'PROMESA_PENDIENTE'
  | 'PAGO_POR_FUERA'
  | 'PENDIENTE_CONCILIAR'
  | 'RETENIDO'
  | 'NO_CORRESPONDE'
  | 'SIN_PROMESA';

export interface ReporteConciliacionRequest {
  fechaInicio: string;
  fechaFin?: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  documento?: string;
  tipoCaso?: TipoCasoConciliacion | null;
  /** Desde 0. */
  page: number;
  size: number;
  /** true vuelve a ejecutar el procedure; si no, el back reutiliza la última consulta (5 min). */
  refrescar?: boolean;
}

export interface ReporteConciliacionFila {
  tipoCaso: TipoCasoConciliacion;
  idGestion: number | null;
  fechaGestion: string | null;
  nombreAgente: string | null;
  documentoCliente: string | null;
  nombreCliente: string | null;
  idCuota: number | null;
  numeroCuota: number | null;
  fechaPromesa: string | null;
  montoPromesa: number | null;
  estadoCuota: string | null;
  idPagoSistema: number | null;
  fechaPagoRegistrada: string | null;
  montoPagoRegistrado: number | null;
  bancoRegistrado: string | null;
  operacionRegistrada: string | null;
  obsPago: string | null;
  idPagoBanco: number | null;
  fechaBancoReal: string | null;
  montoBancoReal: number | null;
  operacionBanco: string | null;
  entidadBancaria: string | null;
  medioAtencion: string | null;
  agencia: string | null;
  sucursal: string | null;
  validacionMonto: string | null;
  diferenciaMonto: number | null;
  idConciliacion: number | null;
  montoAplicado: number | null;
  categoriaBanco: string | null;
  estadoBanco: string | null;
}

export interface ResumenReporteConciliacion {
  totalRegistros: number;
  matchCompleto: number;
  pagosPorFuera: number;
  pendientesProcesar: number;
  montoMatchCompleto: number;
  montoPagosPorFuera: number;
  pendientesConciliar: number;
  retenidos: number;
  montoPendienteConciliar: number;
  noCorresponden: number;
  montoNoCorresponde: number;
}

export interface ReporteConciliacionPagina {
  resumen: ResumenReporteConciliacion;
  filas: ReporteConciliacionFila[];
  total: number;
  page: number;
  size: number;
}
