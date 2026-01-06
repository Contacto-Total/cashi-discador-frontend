/**
 * DTO para mostrar promesas de pago en la pantalla de gestion administrativa
 */
export interface PromesaGestion {
  // Identificadores
  idGestion: number;
  grupoPromesaUuid: string;

  // Cliente
  idCliente: number;
  documentoCliente: string;
  nombreCliente: string;

  // Agente
  idAgente: number;
  nombreAgente: string;

  // Cartera
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;

  // Tipificacion
  rutaJerarquia: string;
  observaciones: string;

  // Promesa
  montoPromesa: number;
  totalCuotas: number;
  estadoPago: EstadoPago;
  estadoGestion: EstadoGestion;
  fechaGestion: string;

  // Cuotas
  cuotas: CuotaPromesa[];

  // Anulacion (si aplica)
  motivoAnulacion?: string;
  fechaAnulacion?: string;
  idUsuarioAnulo?: number;
  nombreUsuarioAnulo?: string;
}

/**
 * DTO interno para las cuotas
 */
export interface CuotaPromesa {
  id: number;
  numeroCuota: number;
  montoPromesa: number;
  fechaPromesa: string;
  estado: EstadoCuota;
  fechaPagoReal?: string;
  montoPagadoReal?: number;
  observaciones?: string;
}

/**
 * Request para anular una promesa
 */
export interface AnularPromesaRequest {
  idGestion: number;
  motivo: string;
}

/**
 * Respuesta paginada del backend
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Estados de pago
 */
export type EstadoPago = 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'PARCIAL' | 'CANCELADA';

/**
 * Estados de gestion
 */
export type EstadoGestion = 'COMPLETADA' | 'NO_GESTIONADA' | 'SIN_CONTACTO' | 'ANULADA';

/**
 * Estados de cuota
 */
export type EstadoCuota = 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'PARCIAL' | 'CANCELADA';
