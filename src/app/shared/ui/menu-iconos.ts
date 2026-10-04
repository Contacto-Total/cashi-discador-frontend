/**
 * Iconos del menú lateral.
 *
 * El backend manda un `icono` por entrada, pero varios se repiten o no dicen
 * lo que es la pantalla. Aquí se fijan por `codigo`, que es estable y no
 * depende de la tabla de configuración. Lo que no esté en el mapa usa el icono
 * del backend. Es el mismo mapa de cashi-frontend-v2 (features/menu/iconos.ts);
 * los nombres son de lucide y tienen que estar en el pick de app.config.ts.
 */
const PORTADA: Record<string, string> = {
  // Operación
  COBRANZA: 'headset',
  GESTION_MANUAL: 'phone-outgoing',
  CONSULTA_CLIENTE: 'user-search',
  RANKING_EQUIPO: 'medal',
  WHATSAPP: 'message-circle-more',
  GESTION_PROMESAS: 'handshake',
  EXCEPCIONES: 'triangle-alert',

  // Bots — el de voz con cara de robot, que para eso es un bot
  BOT_VOZ: 'bot',
  BOT_AGENDA: 'calendar-clock',

  // Monitoreo
  MONITOREO: 'radar',
  MONITOREO_LLAMADAS: 'phone-call',
  MONITOREO_SALUD_SISTEMA: 'heart-pulse',
  MONITOREO_SISTEMA_METRICAS: 'gauge',
  MONITOREO_METRICAS: 'activity',
  PRODUCTIVIDAD_AGENTES: 'trending-up',

  // Audio
  GRABACIONES: 'audio-lines',
  GRABACIONES_DISCADOR: 'audio-lines',
  PLANTILLAS_SPEECH: 'message-square-quote',

  // Carga de datos
  CARGA_DATOS: 'database-zap',
  CARGA_INICIAL: 'cloud-upload',
  CARGA_TELEFONOS: 'phone-incoming',
  CARGA_DIARIA: 'calendar-arrow-up',
  CARGA_CONSOLIDADA: 'layers',
  CARGA_CONVENIOS: 'file-spreadsheet',

  // Dinero
  PAGOS_BANCARIOS: 'landmark',
  COMISIONES: 'badge-percent',
  DASHBOARD_PAGOS: 'chart-pie',

  // Campañas
  CAMPANAS: 'megaphone',
  CAMP_GESTION: 'clipboard-list',
  GENERACION_CAMPANAS: 'rocket',
  GESTION_TENORES: 'message-square-text',

  // Cartas
  CARTAS: 'mails',
  CARTAS_ACUERDOS: 'handshake',
  CARTAS_NO_ADEUDO: 'file-check-2',
  CARTAS_CESION: 'file-signature',
  CARTAS_PENDIENTES: 'clock',

  // Reportes
  REPORTES: 'chart-column-big',
  REP_CONTACTO: 'square-user-round',
  REPORTE_ESTADO_AGENTES: 'user-round-check',
  REP_RANKING: 'medal',
  REPORTE_COMPROMISOS: 'handshake',
  REP_PRODUCCION: 'trending-up',
  REP_SPEECH: 'mic',
  REP_MONITOREO: 'activity',
  REP_POWERBI: 'zap',
  REP_CARTERA_PROPIA: 'wallet',
  REP_CONTINUIDAD: 'git-branch',
  REP_CONCILIACION: 'file-check-2',
  REP_GESTIONES: 'clipboard-list',
  HISTORIAL_LLAMADAS: 'phone-call',

  // Telefonía
  CONSULTA_LINEAS: 'smartphone',
  EXTENSIONES: 'phone-forwarded',
  BLACKLIST_MAIN: 'shield-ban',

  // Mantenimiento
  MANTENIMIENTO: 'sliders-horizontal',
  MANT_PROVEEDORES: 'building-2',
  MANT_CARTERAS: 'briefcase',
  MANT_SUBCARTERAS: 'folder-tree',
  MANT_UMBRALES_ESTADO: 'timer',
  MANT_CABECERAS: 'columns-3',
  MANT_ROLES: 'shield-check',
  MANT_USUARIOS: 'users',
  MANT_BLACKLIST: 'ban',
  MANT_TIPIFICACIONES: 'tags',
  MANT_MONTOS: 'circle-dollar-sign',
  MANT_METAS: 'target',
  MANT_MENU: 'menu',
  MANT_HORARIOS_RECORDATORIOS: 'clock',
  'plantillas-carta': 'file-signature',
};

export function iconoDeMenu(codigo: string, iconoBackend: string | null | undefined): string {
  return PORTADA[codigo] ?? iconoBackend ?? 'dot';
}
