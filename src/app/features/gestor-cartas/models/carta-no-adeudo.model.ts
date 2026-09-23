export type CartaNoAdeudoTipoSolicitud = 'ORIGINAL' | 'COPIA_PERDIDA';

export type CartaNoAdeudoEstado =
  | 'PENDIENTE_REVISION_CORREO'
  | 'PENDIENTE_VALIDACION_PAGOS'
  | 'OBSERVADA'
  | 'RECHAZADA'
  | 'APROBADA_PARA_ENVIO'
  | 'PENDIENTE_ENVIO'
  | 'ENVIANDO'
  | 'ENVIADA'
  | 'ERROR_ENVIO';

export interface CrearCartaNoAdeudoSolicitudRequest {
  idCliente: number;
  idGestion: number;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  tipoSolicitud: CartaNoAdeudoTipoSolicitud;
  idSolicitudOrigen?: number;
  idMetodoContactoDestino?: number;
  correoDestino: string;
}

export interface CartaNoAdeudoSolicitud {
  id: number;
  idCliente: number;
  idGestion: number;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  tipoSolicitud: CartaNoAdeudoTipoSolicitud;
  idSolicitudOrigen: number | null;
  estado: CartaNoAdeudoEstado;
  idMetodoContactoDestino: number | null;
  correoDestino: string;
  usuarioCreacion: number;
  usuarioUltimaActualizacion: number | null;
  fechaSolicitud: string;
  fechaUltimaActualizacion: string | null;
}

export interface CartaNoAdeudoHistorial {
  id: number;
  idSolicitud: number;
  tipoEvento: string;
  estadoAnterior: CartaNoAdeudoEstado | null;
  estadoNuevo: CartaNoAdeudoEstado | null;
  observacion: string | null;
  codigoLote: string | null;
  numeroIntento: number | null;
  correoDestino: string | null;
  estadoEnvio: string | null;
  idMensajeServidor: string | null;
  respuestaServidor: string | null;
  detalleError: string | null;
  idUsuario: number;
  fechaEvento: string;
  fechaResultado: string | null;
}

export interface CartaNoAdeudoRechazo {
  id: number;
  idSolicitud: number;
  estadoAnterior: CartaNoAdeudoEstado;
  estadoResultante: CartaNoAdeudoEstado;
  justificacion: string;
  idUsuarioRechazo: number;
  fechaRechazo: string;
}

export interface CartaNoAdeudoDocumento {
  id: number;
  idSolicitud: number;
  version: number;
  hashDocumento: string;
  idUsuarioGeneracion: number;
  fechaGeneracion: string;
}

export interface CartaNoAdeudoPage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface CartaNoAdeudoSolicitudFilters {
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  estado?: CartaNoAdeudoEstado;
  page?: number;
  size?: number;
}

export interface CartaNoAdeudoClienteCorreo {
  idSolicitud?: number;
  idCliente: number;
  idGestion: number;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  documento: string;
  nombreCliente: string;
  correo: string | null;
  idMetodoContacto: number | null;
  montoPagado: number;
  fechaUltimoPago: string | null;
}

export interface MetodoContactoCorreo {
  id: number;
  valor: string;
  subtipo: string;
}

export interface ResultadoEnvioSolicitud {
  idSolicitud: number;
  exito: boolean;
  estado: CartaNoAdeudoEstado | string;
  mensaje: string;
}

export interface EnviarCartasNoAdeudoResponse {
  total: number;
  enviadas: number;
  fallidas: number;
  resultados: ResultadoEnvioSolicitud[];
}

export interface CartaNoAdeudoFallido {
  idSolicitud: number;
  idCliente: number;
  idGestion: number;
  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  documento: string | null;
  nombreCliente: string | null;
  correoDestino: string | null;
  numeroIntento: number | null;
  detalleError: string | null;
  fechaUltimaActualizacion: string | null;
}
