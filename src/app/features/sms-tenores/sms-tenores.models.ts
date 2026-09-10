/** Contratos de /api/sms-tenores. Espejo de TenorDTO en el backend. */

export interface RangoTenor {
  columna: string;
  min: number | null;
  max: number | null;
}

export interface RestriccionesTenor {
  sinPromesaVigente: boolean;
  sinListaNegra: boolean;
  soloNoContenido: boolean;
}

/** Lo que envía el formulario: sirve para guardar y para contar o previsualizar un borrador. */
export interface TenorGuardar {
  nombre: string;
  idInquilino: number | null;
  idCartera: number | null;
  idSubcartera: number | null;
  plantilla: string;
  rangos: RangoTenor[];
  restricciones: RestriccionesTenor;
}

export type EstadoTenor = 'ACTIVO' | 'ARCHIVADO';

export interface Tenor {
  id: number;
  nombre: string;
  idInquilino: number;
  idCartera: number;
  idSubcartera: number;
  nombreCartera: string | null;
  nombreSubcartera: string | null;
  plantilla: string;
  variables: string[];
  rangos: RangoTenor[];
  restricciones: RestriccionesTenor;
  estado: EstadoTenor;
  origen: string;
  /** Último conteo guardado; nulo si el tenor no se pudo calcular. */
  clientesHoy: number | null;
  conteoCalculadoAt: string | null;
  /** Motivo por el que el tenor no se puede calcular con la carga vigente. */
  conteoError: string | null;
  actualizadoAt: string | null;
}

export interface GrupoTenores {
  idSubcartera: number;
  nombreCartera: string | null;
  nombreSubcartera: string | null;
  clientesEnCartera: number;
  tenores: Tenor[];
}

export interface VariableTenor {
  token: string;
  columna: string | null;
  etiqueta: string;
  /** Usarla deja fuera a los clientes que no tienen ese dato. */
  filtra: boolean;
}

export interface VariablesSubcartera {
  idSubcartera: number;
  clientesEnCartera: number;
  cliente: VariableTenor[];
  montos: VariableTenor[];
  fechas: VariableTenor[];
  admiteSoloNoContenido: boolean;
}

export interface ConteoTenor {
  clientes: number;
  clientesEnCartera: number;
}

export interface MensajeTenor {
  nombre: string;
  telefono: string;
  texto: string;
  codificacion: 'GSM7' | 'UCS2';
  caracteres: number;
  segmentos: number;
}

export interface PreviewTenor {
  total: number;
  desde: number;
  mensajes: MensajeTenor[];
}

export interface ExportableTenor {
  exportable: boolean;
  motivo: string | null;
}

export interface RespuestaApi<T> {
  success: boolean;
  data: T;
  message?: string;
}
