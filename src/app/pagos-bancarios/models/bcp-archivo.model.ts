/**
 * Cabecera del archivo CREP del BCP
 */
export interface BcpArchivoCabecera {
  codigoAfiliado: string;
  fechaProceso: string;
  totalRegistros: number;
  montoTotal: number;
  codigoInternoBcp: string;
  codigoTeletransfer: string;
  horaCorte: string;
  codigoServicio: string;
}

/**
 * Detalle (pago individual) del archivo CREP del BCP
 */
export interface BcpArchivoDetalle {
  numeroFila: number;
  codigoDepositante: string;
  documento: string;
  datoAdicionalDepositante: string;
  fechaPago: string;
  montoPagado: number;
  sucursal: string;
  agencia: string;
  numeroOperacion: string;
  terminal: string;
  medioAtencion: string;
  horaAtencion: string;
  numeroCheque: string;
  codigoBanco: string;
  flagExtorno: string;
  numeroOperacionBd: string;
  referencia: string;
  numeroOperacionCanal: string;
  /** Al aprobar: retenido por el supervisor para resolverlo a mano. */
  retenerRevision?: boolean;
}

/**
 * Resultado completo del parsing del archivo CREP
 */
export interface BcpArchivoResultado {
  exitoso: boolean;
  mensaje: string;
  nombreArchivo: string;
  cabecera: BcpArchivoCabecera | null;
  detalles: BcpArchivoDetalle[];
  registrosProcesados: number;
  erroresEncontrados: number;
  errores: string[];
  archivoId: number | null;
  duplicadosOmitidos: number;
  prevalidacion?: PrevalidacionArchivoBcp[] | null;
  prevalidacionProcesados?: PrevalidacionArchivoBcp[] | null;
  prevalidacionNoProcesados?: PrevalidacionArchivoBcp[] | null;
  todosAprobables?: boolean;
  estadoCarga?: EstadoCargaArchivoBcp;
  pagosDuplicados?: BcpPagoDuplicado[] | null;
}

export type EstadoCargaArchivoBcp =
  | 'PREVALIDADO'
  | 'PREVALIDADO_CON_DUPLICADOS_CONTEXTO'
  | 'ARCHIVO_CON_PAGOS_DUPLICADOS'
  | 'TODOS_PAGOS_YA_REGISTRADOS'
  | 'PROCESADO_SIN_PREVALIDACION';

export type MotivoPagoDuplicadoBcp =
  | 'NUMERO_OPERACION_EXISTENTE'
  | 'DOCUMENTO_FECHA_MONTO_EXISTENTE';

export interface BcpPagoDuplicado {
  documento: string;
  fechaBanco: string;
  montoBanco: number;
  banco: string;
  numeroOperacion: string | null;
  motivo: MotivoPagoDuplicadoBcp | string;
}

export interface BcpArchivoCargaRequest {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface AprobarArchivoBcpRequest {
  nombreArchivo: string;
  cabecera: BcpArchivoCabecera | null;
  detalles: BcpArchivoDetalle[];
  /** El backend vuelve a prevalidar al guardar; ya no hace falta enviarla. */
  prevalidacion?: PrevalidacionArchivoBcp[];
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  aprobadoPorId: number;
  aprobadoPorNombre: string;
  observacion?: string;
}

export interface AprobarArchivoBcpResponse {
  exitoso: boolean;
  mensaje: string;
  archivoId?: number;
  pagosInsertados: number;
  pagosVerificados: number;
  conciliacionesAprobadas: number;
  pagosPendientes?: number;
  resumenCategorias?: Record<string, number>;
  errores: string[];
}

export type EstadoPrevalidacionBcp =
  | 'LISTO_PARA_APROBAR'
  | 'REQUIERE_REVISION_MONTO'
  | 'PAGO_REGISTRADO_FECHA_DISTINTA_BANCO'
  | 'PAGO_REGISTRADO_FECHA_MONTO_DISTINTOS_BANCO'
  | 'DOCUMENTO_NO_EXISTE_EN_CLIENTES'
  | 'CLIENTE_NO_PERTENECE_A_CONTEXTO'
  | 'NO_TIENE_PROMESA'
  | 'PROMESA_SIN_CUOTAS_PENDIENTES'
  | 'FALTA_TIPIFICACION_CANCELACION'
  | 'FECHA_FUERA_DE_RANGO_DE_PROMESA'
  | 'PAGO_YA_CONCILIADO_PREVIAMENTE'
  | 'SIN_CANDIDATO';

export interface PrevalidacionArchivoBcp {
  tipoMatch: string;
  prioridad: number;
  pcIds: string | null;
  cuotaIds: string | null;
  idGestion: number | null;
  tenantId?: number | null;
  carteraId?: number | null;
  subcarteraId?: number | null;
  diffDias: number | null;
  diffMonto: number | null;
  documentoBanco: string;
  fechaBanco: string;
  montoBanco: number;
  numeroOperacion: string | null;
  banco: string;
  documentoAgente: string | null;
  fechaPago: string | null;
  montoPago: number | null;
  operacionAgente: string | null;
  estadoPrevalidacion: EstadoPrevalidacionBcp | string;
  categoria?: CategoriaPagoBanco | string | null;
  motivo?: string | null;
  grupoId?: number | null;
  transaccionId?: number | null;
  montoEsperado?: number | null;
  montoFaltante?: number | null;
  /** Enlace automático de baja confianza: códigos de ALERTAS_PREVALIDACION separados por coma. */
  alerta?: string | null;
  /** Marcado en pantalla: el supervisor no quiere que se aplique solo; queda pendiente al guardar. */
  retenerRevision?: boolean;
}

export type CategoriaPagoBanco =
  | 'CONCILIADO'
  | 'CONCILIADO_POR_SUMA'
  | 'CONCILIADO_POR_SUMA_CON_DESFASE'
  | 'CONCILIADO_CON_DESFASE'
  | 'PARCIAL_EN_ESPERA'
  | 'CONCILIADO_POR_PARTES'
  | 'PAGO_VOLUNTARIO'
  | 'REQUIERE_REVISION'
  | 'OMITIDO_POR_FECHA'
  | 'CLIENTE_NO_ENCONTRADO'
  | 'NO_CORRESPONDE';

/** Pago bancario guardado que aún no termina de conciliarse. */
export interface PagoBancoPendiente {
  id: number;
  documento: string;
  fechaBanco: string;
  montoBanco: number;
  numeroOperacion: string | null;
  banco: string;
  categoria: CategoriaPagoBanco | string;
  categoriaSugerida: CategoriaPagoBanco | string | null;
  motivo: string | null;
  fechaPagoAsesor: string | null;
  montoPagoAsesor: number | null;
  grupoId: number | null;
  montoEsperado: number | null;
  montoFaltante: number | null;
  fechaLimiteGrupo: string | null;
}

export interface ReevaluacionPendientesResponse {
  exitoso: boolean;
  mensaje: string;
  pagosEvaluados?: number;
  pagosVerificados?: number;
  conciliacionesAprobadas?: number;
  pagosPendientes?: number;
  resumenCategorias?: Record<string, number>;
}

/** Pago bancario elegido para resolver, venga de la vista previa o de los pendientes guardados. */
export interface PagoBancoPorResolver {
  documento: string;
  fechaBanco: string;
  montoBanco: number;
  numeroOperacion: string | null;
  categoria: string | null;
  motivo: string | null;
}

export interface ResumenConciliacionClienteRequest {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface ResumenConciliacionCliente {
  documento: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  nombreCliente: string | null;
  pagoCumplido: boolean;
  intentosCancelacion?: IntentoCancelacionResumenConciliacion[];
  promesas: PromesaResumenConciliacion[];
}

export interface IntentoCancelacionResumenConciliacion {
  idGestion: number;
  fechaGestion: string;
  metodoContacto: 'GESTION_AUTOMATICA' | 'GESTION_MANUAL' | 'GESTION_PROGRESIVO' | 'GESTION_PREDICTIVO' | null;
}

export interface PromesaResumenConciliacion {
  idGestion: number;
  grupoPromesaUuid: string;
  fechaGestion: string;
  estadoPago: string;
  montoPromesa: number;
  montoPagadoReal: number;
  totalCuotas: number;
  nombreAgente: string;
  rutaTipificacion: string;
  cuotas: CuotaResumenConciliacion[];
}

export interface AdjuntoResumenConciliacion {
  uuid: string;
  nombreArchivo: string;
  tipoArchivo: string;
  tamanoBytes: number;
  fechaCreacion: string;
}

export interface CuotaResumenConciliacion {
  cuotaId: number;
  numeroCuota: number;
  fechaPromesa: string;
  montoPromesa: number;
  estado: string;
  fechaPagoReal: string | null;
  montoPagadoReal: number | null;
  pagos: PagoResumenConciliacion[];
  adjuntos?: AdjuntoResumenConciliacion[];
}

export interface PagoResumenConciliacion {
  pagoCuotaId: number;
  transaccionId: number | null;
  fechaPago: string;
  montoPago: number;
  banco: string;
  numeroOperacion: string | null;
  verificadoBanco: boolean;
  pagoBancarioId: number | null;
  fechaVerificacion: string | null;
  /** Fecha que reportó el banco para el pago enlazado (fechaPago es la que registró el asesor). */
  fechaBanco?: string | null;
  montoBanco?: number | null;
  /** yyyyMM en que el banco cuenta el pago; difiere del mes de fechaBanco en pagos de fin de mes. */
  periodoBanco?: string | null;
  /** Inferido en backend: la cancelación que registró el pago subió voucher. */
  tieneVoucher?: boolean;
}

export interface HistorialArchivosCargaRequest {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  /** Solo los archivos donde aparece este cliente. */
  documento?: string;
  /** yyyy-MM: solo los archivos con pagos de ese mes. */
  mes?: string;
  page?: number;
  size?: number;
}

export type TipoArchivoCarga = 'BCP' | 'OH' | 'CONSOLIDADO';

export interface ArchivoCargaHistorialItem {
  archivoCargaId: number;
  nombreArchivo: string;
  tipo: TipoArchivoCarga | string;
  subidoPorNombre: string | null;
  fechaCarga: string;
  fechaPagoDesde: string | null;
  fechaPagoHasta: string | null;
  cantidadPagos: number;
  montoTotal: number;
  conciliados: number;
  montoConciliado: number;
  /** Incluye los retenidos. */
  pendientes: number;
  montoPendiente: number;
  retenidos: number;
  noCorresponden: number;
  montoNoCorresponde: number;
  /** Solo al buscar por documento. */
  pagosCliente: number | null;
  montoCliente: number | null;
}

export interface ArchivoCargaHistorialPage {
  content: ArchivoCargaHistorialItem[];
  pageable: object;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ArchivoCargaDetalleRequest {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  /** Solo las filas de este cliente. */
  documento?: string;
}

export type EstadoFilaArchivo = 'CONCILIADO' | 'PENDIENTE' | 'RETENIDO' | 'NO_CORRESPONDE';

export type TipoRelacionArchivoCarga = 'BCP_A_CUOTA' | 'BCP_A_TRANSACCION';

export interface ArchivoCargaDetalleItem {
  /** Null si la fila no tiene una conciliación activa. */
  conciliacionId: number | null;
  archivoCargaId: number;
  nombreArchivo: string;
  fechaCarga: string;
  bcpPagoDetalleId: number;
  numeroFila: number | null;
  documento: string;
  codigoDepositante: string;
  fechaBanco: string;
  horaAtencion: string;
  montoBanco: number;
  banco: string;
  medioAtencion: string;
  numeroOperacion: string | null;
  categoria: string | null;
  estado: EstadoFilaArchivo;
  pagoCuotaId: number | null;
  transaccionId: number | null;
  montoAplicado: number | null;
  tipoRelacion: TipoRelacionArchivoCarga | string | null;
  fechaAprobacion: string | null;
  cuotaId: number | null;
  numeroCuota: number | null;
  fechaPromesa: string | null;
  montoPromesa: number | null;
  estadoCuota: string | null;
  gestionId: number | null;
  nombreCliente: string | null;
  nombreAgente: string | null;
  estadoPagoGestion: string | null;
  rutaNivel1: string;
  rutaNivel2: string;
  rutaNivel3: string;
  rutaNivel4: string;
}

/**
 * DTO para registro manual de pago
 */
export interface BcpPagoManualRequest {
  documento: string;
  nombreDepositante?: string;
  fechaPago: string;
  monto: number;
  numeroOperacion: string;
  sucursal?: string;
  agencia?: string;
  medioAtencion?: string;
  observaciones?: string;
  /** Banco donde se realizó el pago: BCP, INTERBANK, BBVA, SCOTIABANK, BANBIF, OTRO */
  banco?: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

/**
 * Respuesta del registro manual
 */
export interface BcpPagoManualResponse {
  exitoso: boolean;
  mensaje: string;
  pagoId?: number;
  documento?: string;
  monto?: number;
  numeroOperacion?: string;
}

/**
 * Pago manual almacenado en BD
 */
export interface BcpPagoManual {
  id: number;
  documento: string;
  codigoDepositante: string;
  datoAdicionalDepositante?: string;
  fechaBanco: string;
  montoBanco: number;
  numeroOperacion: string;
  sucursal?: string;
  agencia?: string;
  terminal?: string;
  medioAtencion?: string;
  horaAtencion?: string;
  banco: string;
  tenantId: number | null;
  carteraId: number | null;
  subcarteraId: number | null;
  procesado: boolean;
  cuotaAplicadaId?: number;
  referencia?: string;
}

/**
 * Filtros para buscar pagos manuales
 */
export interface BcpPagoManualFiltros {
  documento?: string;
  banco?: string;
  medioAtencion?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  page?: number;
  size?: number;
}

/**
 * Respuesta paginada de pagos manuales
 */
export interface BcpPagoManualListResponse {
  data: BcpPagoManual[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

