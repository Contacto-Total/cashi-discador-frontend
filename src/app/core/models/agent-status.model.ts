// Modelo para el nuevo sistema de estados de agentes
export interface AgentStatus {
  idUsuario: number;
  estadoActual: AgentState;
  estadoAnterior?: AgentState;
  timestampCambio: string;
  tiempoEnEstadoMinutos: number;
  sessionId?: string;
  notas?: string;
  // Campos de umbral de tiempo
  segundosEnEstado?: number;
  colorIndicador?: 'verde' | 'amarillo' | 'rojo';
  porcentajeTiempo?: number;
  excedeTiempoMaximo?: boolean;
  tiempoMaximoSegundos?: number;
}

export enum AgentState {
  DISPONIBLE = 'DISPONIBLE',
  EN_REUNION = 'EN_REUNION',
  REFRIGERIO = 'REFRIGERIO',
  SSHH = 'SSHH',
  EN_LLAMADA = 'EN_LLAMADA',
  TIPIFICANDO = 'TIPIFICANDO',
  EN_MANUAL = 'EN_MANUAL',
  DESCONECTADO = 'DESCONECTADO',
  GESTION_MANUAL = 'GESTION_MANUAL',
  SEGUIMIENTO = 'SEGUIMIENTO'
}

export interface AgentStatusResponse {
  idUsuario: number;
  estadoActual: string;
  estadoAnterior?: string;
  timestampCambio: string;
  tiempoEnEstadoMinutos: number;
  notas?: string;
  sessionId?: string;
  // Campos de umbral de tiempo
  segundosEnEstado?: number;
  colorIndicador?: 'verde' | 'amarillo' | 'rojo';
  porcentajeTiempo?: number;
  excedeTiempoMaximo?: boolean;
  tiempoMaximoSegundos?: number;
}

export interface ChangeStatusRequest {
  estado: string;
  notas?: string;
}

export interface EstadosDisponibles {
  estadosManuales: string[];
  estadosSistema: string[];
  todosLosEstados: string[];
}

// Labels amigables para los estados
export const AGENT_STATE_LABELS: Record<AgentState, string> = {
  [AgentState.DISPONIBLE]: 'Disponible',
  [AgentState.EN_REUNION]: 'En Reunión',
  [AgentState.REFRIGERIO]: 'Refrigerio',
  [AgentState.SSHH]: 'Baño',
  [AgentState.EN_LLAMADA]: 'En Llamada',
  [AgentState.TIPIFICANDO]: 'Tipificando',
  [AgentState.EN_MANUAL]: 'Modo Manual',
  [AgentState.DESCONECTADO]: 'Desconectado',
  [AgentState.GESTION_MANUAL]: 'Gestión Manual',
  [AgentState.SEGUIMIENTO]: 'Seguimiento'
};

// Estados que el agente puede cambiar manualmente
export const MANUAL_STATES = [
  AgentState.DISPONIBLE,
  AgentState.EN_REUNION,
  AgentState.REFRIGERIO,
  AgentState.SSHH,
  AgentState.GESTION_MANUAL
];
