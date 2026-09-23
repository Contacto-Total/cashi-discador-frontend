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

/**
 * Como se dibuja cada estado: color, icono y como se lee en voz alta.
 * Fuente unica para las pantallas de supervisor. Si se agrega un estado al enum,
 * TypeScript obliga a completarlo aca y ninguna pantalla queda mostrandolo en gris.
 *
 * Los iconos son nombres de lucide y tienen que estar en el pick de app.config.ts.
 */
export interface AgentStateUi {
  color: string;
  icon: string;
  /** Texto para la alerta hablada del supervisor (speechSynthesis). */
  hablado: string;
}

export const AGENT_STATE_UI: Record<AgentState, AgentStateUi> = {
  // En la cola
  [AgentState.DISPONIBLE]:       { color: '#10B981', icon: 'circle',          hablado: 'disponible' },
  [AgentState.EN_LLAMADA]:       { color: '#3B82F6', icon: 'phone-call',      hablado: 'en llamada' },
  [AgentState.TIPIFICANDO]:      { color: '#06B6D4', icon: 'edit',            hablado: 'tipificando' },
  [AgentState.EN_MANUAL]:        { color: '#475569', icon: 'pencil',          hablado: 'en modo manual' },
  // Fuera de la cola, trabajando
  [AgentState.GESTION_MANUAL]:   { color: '#009688', icon: 'clipboard-edit',  hablado: 'en gestion manual' },
  [AgentState.SEGUIMIENTO]:      { color: '#E91E63', icon: 'bell-ring',       hablado: 'en seguimiento' },
  [AgentState.WHATSAPP]:         { color: '#25D366', icon: 'message-circle',  hablado: 'en whatsapp' },
  [AgentState.CONSULTA_TIEMPOS]: { color: '#A855F7', icon: 'clock',           hablado: 'consultando sus tiempos' },
  [AgentState.EN_REUNION]:       { color: '#8B5CF6', icon: 'users',           hablado: 'en reunion' },
  [AgentState.CAPACITACION]:     { color: '#6366F1', icon: 'book-open',       hablado: 'en capacitacion' },
  // Fuera de la cola, sin actividad
  [AgentState.EN_LINEA]:         { color: '#94A3B8', icon: 'user-check',      hablado: 'en linea, fuera de la cola' },
  // Pausas
  [AgentState.REFRIGERIO]:       { color: '#F59E0B', icon: 'coffee',          hablado: 'en break' },
  [AgentState.COMIDA]:           { color: '#EA580C', icon: 'utensils',        hablado: 'en comida' },
  [AgentState.SSHH]:             { color: '#FBBF24', icon: 'user',            hablado: 'en el bano' },
  [AgentState.AUSENTE]:          { color: '#B91C1C', icon: 'user-x',          hablado: 'ausente' },
  [AgentState.SOPORTE]:          { color: '#0EA5E9', icon: 'monitor',         hablado: 'en soporte' },
  // Sin sesion
  [AgentState.DESCONECTADO]:     { color: '#EF4444', icon: 'circle',          hablado: 'desconectado' }
};

/** Estado desconocido (dato viejo o estado nuevo sin mapear todavia). */
export const AGENT_STATE_UI_FALLBACK: AgentStateUi = {
  color: '#6B7280', icon: 'circle', hablado: 'sin estado'
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
