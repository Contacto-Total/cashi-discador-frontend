import { AgentState } from '../../core/models/agent-status.model';

/**
 * Cómo se muestra cada estado en el Panel del asesor.
 *  - `tono`: color del estado (botón, foco de la tarjeta, baldosas).
 *  - `tinta`: el mismo tono bajado lo justo para leerse como titular; sin ella, el tono ya se lee.
 *  - `oscuro`: tono para el tema oscuro, un paso más claro: varios (índigo, morado, rojo) no se
 *    leen sobre casi negro. En ese tema tono y tinta son el mismo valor.
 *  - `detalle`: qué pasa en ese estado, para el botón.
 *  - `sinTope`: lo que se dice en lugar de la escala cuando el estado no tiene tiempo máximo.
 */
export interface EstadoPanel {
  nombre: string;
  icono: string;
  tono: string;
  tinta?: string;
  oscuro?: string;
  detalle?: string;
  sinTope?: string;
}

export const ESTADOS_PANEL: Record<AgentState, EstadoPanel> = {
  [AgentState.DISPONIBLE]: { nombre: 'Disponible', icono: 'headset', tono: 'var(--nivel-verde)', detalle: 'Recibe llamadas si hay campaña', sinTope: 'Te encuentras a la espera de una llamada' },
  [AgentState.GESTION_MANUAL]: { nombre: 'Gestión manual', icono: 'phone-outgoing', tono: '#009688', oscuro: '#26a69a', detalle: 'Llamadas desde Gestión Manual' },
  [AgentState.EN_REUNION]: { nombre: 'En reunión', icono: 'users', tono: '#ffc107', tinta: '#b38600', oscuro: '#ffc107', detalle: 'Reunión con el equipo' },
  [AgentState.CAPACITACION]: { nombre: 'Capacitación', icono: 'book-open', tono: '#3f51b5', oscuro: '#7986cb', detalle: 'Sesión de capacitación' },
  [AgentState.REFRIGERIO]: { nombre: 'Break', icono: 'coffee', tono: '#2196f3', tinta: '#1791f2', oscuro: '#42a5f5', detalle: 'Descanso corto' },
  [AgentState.COMIDA]: { nombre: 'Comida', icono: 'utensils-crossed', tono: '#ef6c00', tinta: '#e76900', oscuro: '#fb8c00', detalle: 'Almuerzo' },
  [AgentState.SSHH]: { nombre: 'Baño', icono: 'shower-head', tono: '#9c27b0', oscuro: '#ba68c8', detalle: 'Servicios higiénicos' },
  [AgentState.AUSENTE]: { nombre: 'Ausente', icono: 'user-x', tono: '#c62828', oscuro: '#ef5350', detalle: 'Fuera del puesto' },
  [AgentState.SOPORTE]: { nombre: 'Soporte', icono: 'monitor', tono: '#00838f', oscuro: '#26c6da', detalle: 'Falla del equipo o incidencia' },
  // Los pone el sistema: no se eligen a mano.
  [AgentState.EN_LLAMADA]: { nombre: 'En llamada', icono: 'phone-call', tono: '#f44336', oscuro: '#ff6659', sinTope: 'Llamada en curso' },
  [AgentState.TIPIFICANDO]: { nombre: 'Tipificando', icono: 'clipboard-pen-line', tono: '#ff5722', tinta: '#ff511a', oscuro: '#ff7043' },
  [AgentState.EN_LINEA]: { nombre: 'En línea', icono: 'user-check', tono: '#78909c', tinta: '#5f7682', oscuro: '#90a4ae', sinTope: 'Conectado, fuera de la cola' },
  [AgentState.EN_MANUAL]: { nombre: 'Modo manual', icono: 'phone-outgoing', tono: '#607d8b', oscuro: '#90a4ae' },
  [AgentState.SEGUIMIENTO]: { nombre: 'Seguimiento', icono: 'bell-ring', tono: '#e91e63', oscuro: '#f06292' },
  [AgentState.WHATSAPP]: { nombre: 'WhatsApp', icono: 'message-circle', tono: '#25d366', tinta: '#128c4a', oscuro: '#25d366' },
  [AgentState.CONSULTA_TIEMPOS]: { nombre: 'Consulta de tiempos', icono: 'clock', tono: '#795548', oscuro: '#a1887f' },
  [AgentState.DESCONECTADO]: { nombre: 'Desconectado', icono: 'circle', tono: '#9e9e9e', tinta: '#757575', oscuro: '#bdbdbd' }
};

/** Estados que dejan al asesor atendiendo; el resto de los que elige a mano son pausas. */
export const ESTADOS_OPERATIVOS: ReadonlySet<AgentState> = new Set([AgentState.DISPONIBLE, AgentState.GESTION_MANUAL]);

/**
 * Nivel del semáforo de tiempo. El rojo es el último tramo antes del tope, no haberlo pasado:
 * `excedido` empieza al superar el tope, que es lo que el backend llama exceder el tiempo máximo.
 */
export const NIVELES = {
  verde: { trazo: 'var(--trazo-verde)', tinta: 'var(--nivel-verde)', icono: 'circle-check', leyenda: 'Dentro del margen' },
  ambar: { trazo: 'var(--trazo-ambar)', tinta: 'var(--nivel-ambar-texto)', icono: 'circle-alert', leyenda: 'Acercándose al tope' },
  rojo: { trazo: 'var(--trazo-rojo)', tinta: 'var(--nivel-rojo)', icono: 'triangle-alert', leyenda: 'Al límite' },
  excedido: { trazo: 'var(--trazo-rojo)', tinta: 'var(--nivel-rojo)', icono: 'triangle-alert', leyenda: 'Tiempo excedido' }
} as const;

export type Nivel = keyof typeof NIVELES;

/** Tramos del semáforo de un estado, en segundos. */
export interface UmbralTiempo { verde: number; ambar: number; tope: number; }

export function nivelDeTiempo(segundos: number, u: UmbralTiempo): Nivel {
  return segundos > u.tope ? 'excedido' : segundos > u.ambar ? 'rojo' : segundos > u.verde ? 'ambar' : 'verde';
}
