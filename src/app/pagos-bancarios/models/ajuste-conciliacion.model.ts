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
  /** Registrarlo como pago voluntario del sistema y conciliarlo (administrador). */
  pagoVoluntario: boolean;
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

/** Texto de cada tipo de cambio del histórico de correcciones. */
export const ETIQUETAS_TIPO_CAMBIO: Record<string, string> = {
  MODIFICACION_PAGO_CUOTA: 'Pago del asesor modificado',
  ELIMINACION_PAGO_CUOTA: 'Pago del asesor eliminado',
  CREACION_PAGO_CUOTA_CANCELACION: 'Pago creado en una cuota',
  AMPLIACION_FECHA_CUOTA: 'Vencimiento ampliado',
  REGULARIZACION_FECHA_CUOTA_CANCELACION: 'Vencimiento ampliado con pago',
  CREACION_PROMESA_SISTEMA_PAGO_BANCO: 'Promesa del sistema creada',
  PAGO_VOLUNTARIO_SISTEMA: 'Pago voluntario registrado',
  REGULARIZACION_PAGO_CUOTA_PAGADA: 'Fecha de pago regularizada',
  AJUSTE_PAGO_PARCIAL_BANCO: 'Pago parcial del banco',
  COMPLEMENTO_PAGO_PARTIDO_BANCO: 'Complemento de pago parcial',
  PAGO_NO_CORRESPONDE: 'Pago marcado No corresponde',
  PAGO_NO_CORRESPONDE_REVERTIDO: 'Pago vuelto a pendientes',
  RECALCULO_PAGO_CUMPLIDO: 'Carta de no adeudo recalculada',
  REGULARIZACION_CONSOLIDADO_BANCO: 'Regularizado desde el consolidado',
  CAMBIO_PERIODO_BANCO: 'Mes del pago cambiado',
  DESCONCILIACION_PAGO_BANCO: 'Pago desconciliado',
  ELIMINACION_PAGO_VOLUNTARIO_SISTEMA: 'Pago voluntario eliminado',
  ENLACE_MANUAL_PAGO_BANCO: 'Pago enlazado a mano',
  CAMBIO_SUBCARTERA_PAGO_BANCO: 'Pago movido de subcartera',
  ANULACION_CARGA_BANCO: 'Carga anulada'
};

/** Historial de cambios de todas las carteras (GET /pagos-bcp/ajustes/historico-cambios). */
export interface FiltroHistorialCambios {
  desde: string;
  hasta: string;
  tenantId?: number | null;
  carteraId?: number | null;
  subcarteraId?: number | null;
  usuarioId?: number | null;
  tipoCambio?: string | null;
  documento?: string | null;
  pagina: number;
  tamano: number;
}

export interface CambioHistorial {
  id: number;
  fecha: string | null;
  tipoCambio: string | null;
  usuarioId: number | null;
  usuario: string | null;
  documento: string | null;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  proveedor: string | null;
  cartera: string | null;
  subcartera: string | null;
  observacion: string | null;
  detalleAnterior: string | null;
  detalleNuevo: string | null;
  bcpPagoDetalleId: number | null;
  pagoCuotaId: number | null;
  gestionPromesaId: number | null;
  cuotaId: number | null;
}

export interface HistorialCambios {
  contenido: CambioHistorial[];
  total: number;
  pagina: number;
  tamano: number;
  usuarios: { id: number; nombre: string; cambios: number }[];
}
