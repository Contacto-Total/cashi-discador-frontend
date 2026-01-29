export interface RecordatorioPromesa {
  idCuota: number;
  numeroCuota: number;
  totalCuotas: number;
  monto: number;
  fechaPago: string;
  estadoCuota: string;

  // Estado de la promesa para mostrar en UI
  estadoPromesa: 'AL_DIA' | 'PENDIENTE_HOY' | 'VENCIDA' | 'SIN_FECHA';
  diasVencida: number | null;

  idCliente: number;
  nombreCliente: string;
  documentoCliente: string;
  telefono: string;

  idGestion: number;
  rutaJerarquia: string;
  observaciones: string;
  fechaGestion: string;

  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  idCampana: number;

  intentosRecordatorio: number;
  ultimoIntentoRecordatorio: string | null;
  resultadoUltimoIntento: string | null;
  yaLlamoHoy: boolean;
}

export interface RegistrarRecordatorioRequest {
  idCuota: number;
  idAgente: number;
  resultado: string;
  uuidLlamada?: string;
  observaciones?: string;
}

export interface ResultadoRecordatorio {
  value: string;
  label: string;
}

export interface EstadisticasRecordatorios {
  fecha: string;
  totalLlamadas: number;
  contestadas: number;
  noContestadas: number;
  pendientesHoy: number;
}

// ==================== DIALER INTERFACES ====================

export interface EstadoDiscadoRecordatorios {
  idAgente: number;
  activo: boolean;
  totalRecordatorios: number;
  recordatoriosCompletados: number;
  recordatoriosPendientes: number;
  recordatorioActual: RecordatorioPromesa | null;
  fechaInicio: string | null;
  fechaFin: string | null;
}

export interface IniciarDialerResponse {
  success: boolean;
  mensaje: string;
  estado: EstadoDiscadoRecordatorios;
}

export interface SiguienteRecordatorioResponse {
  recordatorio: RecordatorioPromesa | null;
  estado: EstadoDiscadoRecordatorios | null;
  hayMas: boolean;
}

export interface CompletarRecordatorioResponse {
  success: boolean;
  mensaje: string;
  estado: EstadoDiscadoRecordatorios;
  terminado: boolean;
}

export interface EstadoDialerResponse {
  activo: boolean;
  estado: EstadoDiscadoRecordatorios | null;
}

// ==================== AMD INTERFACES ====================

export interface ResultadoLlamadaAMD {
  estado: 'HUMANO' | 'BUZON' | 'NO_CONTESTO' | 'ERROR';
  mensaje: string;
  callUuid: string | null;
  agentUuid: string | null;
  razonAMD: string | null;
  recordatorio: RecordatorioPromesa | null;

  // Indicadores booleanos
  esHumano: boolean;
  esBuzon: boolean;
  noContesto: boolean;
  esError: boolean;

  // Estado del dialer (si aplica)
  estadoDialer: EstadoDiscadoRecordatorios | null;
}
