/**
 * Seguimiento por periodos (tablas seguimiento_periodo / _padron / _lista_dia / _lista_item).
 *
 * Tres capas con vidas distintas:
 *  - PERIODO: un mes por subcartera. Lo activa el supervisor y eso genera el padron.
 *  - PADRON:  el cliente del segmento. Estable todo el mes. NO tiene asesor.
 *  - LISTA DEL DIA: se rearma cada dia y se reparte por round robin.
 */

export type EstadoPeriodo = 'BORRADOR' | 'ACTIVO' | 'CERRADO';
export type EstadoListaDia = 'GENERANDO' | 'ABIERTA' | 'CERRADA';
export type EstadoItem = 'PENDIENTE' | 'EN_LLAMADA' | 'COMPLETADA' | 'DESCARTADA';
export type TipoItem = 'VENCIDA' | 'VIGENTE';

/** Valores de estado_cliente_calculado. Menor prioridad = mejor. */
export type EstadoSegmento = 'CD' | 'CI' | 'PR' | 'NC';

export const ESTADOS_SEGMENTO: { valor: EstadoSegmento; etiqueta: string }[] = [
  { valor: 'CD', etiqueta: 'CD - Contacto Directo' },
  { valor: 'CI', etiqueta: 'CI - Contacto Indirecto' },
  { valor: 'PR', etiqueta: 'PR - Promesa Rota' },
  { valor: 'NC', etiqueta: 'NC - No Contactado' }
];

export const CAMPOS_SEGMENTO: { valor: string; etiqueta: string }[] = [
  { valor: 'mejor_estado_historico', etiqueta: 'Mejor estado histórico' },
  { valor: 'mejor_estado_mes', etiqueta: 'Mejor estado del mes' },
  { valor: 'ultimo_estado', etiqueta: 'Último estado' }
];

export interface SeguimientoPeriodo {
  id?: number;
  idSubcartera: number;
  idCartera?: number | null;
  idTenant?: number | null;
  anio?: number;
  mes?: number;
  estado?: EstadoPeriodo;

  // Segmento: que clientes forman el padron
  segmentoFuente?: string;
  segmentoCampo?: string;
  /** CSV: 'PR' o 'PR,CI' */
  segmentoValores?: string | null;

  // Promesas: que entra a la lista de cada dia
  incluyeVencidas?: boolean;
  incluyeVigentes?: boolean;
  /**
   * SIN USO. Las vencidas entran por mes: las que cayeron dentro del mes en
   * curso hasta T-2 (ayer es periodo de gracia). Se deja porque el backend
   * sigue devolviendo la columna.
   */
  diasVencidasMax?: number | null;
  /** 0 = solo las que vencen hoy */
  diasVigentesAdelante?: number;

  /** null = grupo por defecto de la subcartera (todos sus asesores) */
  idGrupoAsesores?: number | null;

  // Bajas
  bajaPorPagoCumplido?: boolean;
  bajaPorCuotasMes?: boolean;

  // Auditoria
  creadoPor?: number | null;
  activadoPor?: number | null;
  activadoEn?: string | null;
  cerradoPor?: number | null;
  cerradoEn?: string | null;
  creadoEn?: string | null;
  actualizadoEn?: string | null;
}

export interface SeguimientoListaItem {
  id: number;
  idLista: number;
  idPadron: number;
  idAsesor: number;
  orden: number;

  idGestion?: number | null;
  idCuota?: number | null;
  tipo: TipoItem;
  fechaPromesa?: string | null;
  montoPromesa?: number | null;
  diasVencida?: number | null;
  telefono?: string | null;
  idMetodoContacto?: number | null;

  estado: EstadoItem;
  motivoDescarte?: string | null;
  intentos: number;
  claimedBy?: string | null;
  claimedAt?: string | null;

  uuidLlamada?: string | null;
  idGestionResultado?: number | null;
  resultado?: string | null;
  atendidoEn?: string | null;
}

/** Respuesta de /mi-lista/{idAsesor}. 204 = la subcartera no tiene periodo activo. */
export interface MiListaSeguimiento {
  idLista: number;
  fecha: string;
  estadoLista: EstadoListaDia;
  total: number;
  pendientes: number;
  completadas: number;
  items: SeguimientoListaItem[];
}

export interface CoberturaAsesor {
  idAsesor: number;
  asesor: string;
  asignados: number;
  pendientes: number;
  enLlamada: number;
  completadas: number;
  descartadas: number;
}

export interface ExclusionPadron {
  motivo: string;
  total: number;
}

export interface CoberturaSeguimiento {
  idPeriodo: number;
  fecha: string;
  padronActivo: number;
  padronExcluido: number;
  exclusiones: ExclusionPadron[];
  lista: {
    idLista: number;
    estado: EstadoListaDia;
    totalItems: number;
    totalAsesores: number;
    generadaEn: string | null;
  } | null;
  asesores: CoberturaAsesor[];
}

/** Etiquetas de los motivos por los que un cliente sale del padron. */
export const MOTIVOS_EXCLUSION: Record<string, string> = {
  PAGO_CUMPLIDO: 'Pago cumplido en la base',
  CUOTAS_MES_PAGADAS: 'Pagó las cuotas del mes',
  FUERA_DE_CARTERA: 'Ya no está en la cartera',
  FUERA_DE_SEGMENTO: 'Cambió de segmento',
  MANUAL: 'Lo sacó el supervisor',
  SIN_MOTIVO: 'Sin motivo registrado'
};
