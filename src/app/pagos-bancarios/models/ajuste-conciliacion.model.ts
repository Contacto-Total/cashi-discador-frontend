/** Ajustes finos de conciliación (solo administradores). */

export interface ContextoAjuste {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface FichaPagoBanco {
  id: number;
  documento: string;
  fechaBanco: string | null;
  montoBanco: number | null;
  banco: string | null;
  numeroOperacion: string | null;
  categoria: string | null;
  procesado: boolean;
  revisionManual: boolean;
  periodoBanco: string | null;
  periodoOrigen: string | null;
  grupoId: number | null;
  consolidadoDetalleId: number | null;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  archivoCargaId: number | null;
  nombreArchivo: string | null;
  fechaCarga: string | null;
  usuarioCarga: string | null;
  conciliaciones: ConciliacionFicha[];
  pagosAsesor: PagoAsesorFicha[];
  historico: HistoricoFicha[];
  puedeDesconciliar: boolean;
  motivoNoDesconciliar: string | null;
}

export interface ConciliacionFicha {
  id: number;
  estado: 'ACTIVA' | 'REVERTIDA' | string;
  tipoRelacion: string;
  pagoCuotaId: number | null;
  transaccionId: number | null;
  montoAplicado: number;
  aprobadoPor: string | null;
  fechaAprobacion: string | null;
  fechaReversion: string | null;
  revertidoPor: string | null;
  motivoReversion: string | null;
}

export interface PagoAsesorFicha {
  pagoCuotaId: number;
  cuotaId: number;
  numeroCuota: number | null;
  gestionId: number;
  rutaGestion: string | null;
  agente: string | null;
  fechaGestion: string | null;
  fechaPago: string | null;
  montoPago: number;
  verificadoBanco: boolean;
  pagoVoluntarioSistema: boolean;
}

export interface HistoricoFicha {
  id: number;
  fecha: string | null;
  tipoCambio: string | null;
  usuario: string | null;
  detalleNuevo: string | null;
  observacion: string | null;
}

export interface VistaPreviaAjuste {
  documento: string;
  bcpPagoDetalleId: number | null;
  fechaBanco: string | null;
  montoBanco: number | null;
  categoriaActual: string | null;
  periodoActual: string | null;
  periodoNuevo: string | null;
  conciliacionesARevertir: number[];
  pagosADesverificar: PagoAfectadoAjuste[];
  pagosVoluntariosAEliminar: PagoVoluntarioAjuste[];
  bloqueos: string[];
  avisos: string[];
  ejecutable: boolean;
}

export interface PagoAfectadoAjuste {
  pagoCuotaId: number;
  cuotaId: number;
  gestionId: number;
  agente: string | null;
  fechaPago: string | null;
  montoPago: number;
}

export interface PagoVoluntarioAjuste {
  gestionId: number;
  cuotaId: number;
  pagoCuotaId: number;
  gestionCancelacionId: number | null;
  fechaPago: string | null;
  montoPago: number;
}

export type DestinoDesconciliacion = 'PENDIENTE_RETENIDO' | 'NO_CORRESPONDE' | 'DUPLICADO';

export interface DesconciliarPagoRequest {
  destino: DestinoDesconciliacion;
  motivo: string;
}

export interface ResultadoAjuste {
  exitoso: boolean;
  mensaje: string;
  documento?: string | null;
  bcpPagoDetalleId?: number | null;
  categoriaNueva?: string | null;
  conciliacionesRevertidas?: number;
  pagosDesverificados?: number;
  pagosVoluntariosEliminados?: number;
  pagoCumplido?: boolean | null;
  avisoPagoCumplido?: string | null;
}

/** Pago del banco de un cliente, con lo que tiene enlazado y las acciones que admite. */
export interface PagoBancoCliente {
  id: number;
  fechaBanco: string | null;
  montoBanco: number | null;
  banco: string | null;
  numeroOperacion: string | null;
  categoria: string | null;
  procesado: boolean;
  revisionManual: boolean;
  periodoBanco: string | null;
  periodoOrigen: string | null;
  grupoId: number | null;
  archivoCargaId: number | null;
  nombreArchivo: string | null;
  fechaCarga: string | null;
  enlaces: EnlacePagoBanco[];
  acciones: AccionesPagoBanco;
}

export interface EnlacePagoBanco {
  pagoCuotaId: number;
  cuotaId: number;
  numeroCuota: number | null;
  gestionId: number;
  rutaGestion: string | null;
  agente: string | null;
  fechaPago: string | null;
  montoPago: number;
  pagoVoluntarioSistema: boolean;
}

export interface AccionesPagoBanco {
  desconciliar: boolean;
  motivoNoDesconciliar: string | null;
  resolver: boolean;
  noCorresponde: boolean;
  restaurar: boolean;
  cambiarPeriodo: boolean;
}

/** Fila de historico_correccion (GET /pagos/historico-correcciones). */
export interface HistoricoCorreccion {
  id: number;
  supervisorNombre: string | null;
  fechaCambio: string | null;
  tipoCambio: string | null;
  detalleAnterior: string | null;
  detalleNuevo: string | null;
  observacion: string | null;
  gestionPromesaId: number | null;
  cuotaId: number | null;
  pagoCuotaId: number | null;
  bcpPagoDetalleId: number | null;
}

export interface PaginaHistoricoCorreccion {
  content: HistoricoCorreccion[];
  totalElements: number;
  number: number;
  last: boolean;
}
