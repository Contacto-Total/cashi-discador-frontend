import { MenuItem } from '../../core/services/menu-permission.service';

/** Un grupo de pantallas del menú lateral, con su rótulo. */
export interface SeccionMenu {
  nombre: string;
  items: MenuItem[];
}

/**
 * Secciones del menú lateral. Se asignan por `codigo`, como los iconos: el orden de las secciones es
 * el de esta lista y, dentro de cada una, el que trae el menú. Lo que no esté aquí cae en «Otros»,
 * así una pantalla nueva nunca desaparece del menú.
 */
const SECCIONES: ReadonlyArray<readonly [string, ReadonlyArray<string>]> = [
  ['Operación', ['COBRANZA', 'GESTION_MANUAL', 'CONSULTA_CLIENTE', 'WHATSAPP', 'GESTION_PROMESAS', 'EXCEPCIONES']],
  ['Mi trabajo', ['MI_ASISTENCIA', 'RANKING_EQUIPO', 'MIS_COMISIONES']],
  ['Supervisión', ['MONITOREO', 'PRODUCTIVIDAD_AGENTES', 'GRABACIONES', 'GRABACIONES_DISCADOR', 'REPORTES']],
  ['Campañas', ['CAMPANAS', 'GENERACION_CAMPANAS', 'GESTION_TENORES', 'BOT_VOZ', 'BOT_AGENDA', 'PLANTILLAS_SPEECH']],
  ['Pagos y cartera', ['CARGA_DATOS', 'PAGOS_BANCARIOS', 'COMISIONES', 'DASHBOARD_PAGOS', 'CARTAS']],
  ['Administración', ['MANTENIMIENTO', 'BLACKLIST_MAIN', 'CONSULTA_LINEAS', 'EXTENSIONES']]
];

export function seccionesDeMenu(menu: MenuItem[]): SeccionMenu[] {
  const puestos = new Set(SECCIONES.flatMap(([, codigos]) => codigos));
  return [
    ...SECCIONES.map(([nombre, codigos]) => ({ nombre, items: menu.filter(i => codigos.includes(i.codigo)) })),
    { nombre: 'Otros', items: menu.filter(i => !puestos.has(i.codigo)) }
  ].filter(s => s.items.length > 0);
}
