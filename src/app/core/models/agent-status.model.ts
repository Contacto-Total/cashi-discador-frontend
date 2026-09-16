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
  SEGUIMIENTO = 'SEGUIMIENTO',
  WHATSAPP = 'WHATSAPP',
  // Agregados 2026-09, mismo orden que el enum de Java y el ENUM de MySQL
  EN_LINEA = 'EN_LINEA',
  CAPACITACION = 'CAPACITACION',
  CONSULTA_TIEMPOS = 'CONSULTA_TIEMPOS',
  COMIDA = 'COMIDA',
  AUSENTE = 'AUSENTE',
  SOPORTE = 'SOPORTE'
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

// Labels amigables para los estados.
// REFRIGERIO se muestra como BREAK desde 2026-09: el almuerzo salio a COMIDA y el
// estado quedo solo para el break corto. El valor en BD sigue siendo REFRIGERIO.
export const AGENT_STATE_LABELS: Record<AgentState, string> = {
  [AgentState.DISPONIBLE]: 'Disponible',
  [AgentState.EN_REUNION]: 'En Reunión',
  [AgentState.REFRIGERIO]: 'BREAK',
  [AgentState.SSHH]: 'Baño',
  [AgentState.EN_LLAMADA]: 'En Llamada',
  [AgentState.TIPIFICANDO]: 'Tipificando',
  [AgentState.EN_MANUAL]: 'Modo Manual',
  [AgentState.DESCONECTADO]: 'Desconectado',
  [AgentState.GESTION_MANUAL]: 'Gestión Manual',
  [AgentState.SEGUIMIENTO]: 'Seguimiento',
  [AgentState.WHATSAPP]: 'WhatsApp',
  [AgentState.EN_LINEA]: 'En Línea',
  [AgentState.CAPACITACION]: 'Capacitación',
  [AgentState.CONSULTA_TIEMPOS]: 'Consulta de Tiempos',
  [AgentState.COMIDA]: 'Comida',
  [AgentState.AUSENTE]: 'Ausente',
  [AgentState.SOPORTE]: 'Soporte'
};

// Estados que el agente elige desde su selector, en el orden en que los ve.
// NO estan aca a proposito:
//   EN_LINEA          lo pone el sistema al entrar y al salir de cada actividad (fase 3)
//   CONSULTA_TIEMPOS  se prende solo al entrar a la pantalla de indicadores
//   EN_MANUAL         legacy, ninguna pantalla lo usa
export const MANUAL_STATES = [
  AgentState.DISPONIBLE,
  AgentState.GESTION_MANUAL,
  AgentState.EN_REUNION,
  AgentState.CAPACITACION,
  AgentState.REFRIGERIO,
  AgentState.COMIDA,
  AgentState.SSHH,
  AgentState.AUSENTE,
  AgentState.SOPORTE
];
