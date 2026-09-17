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

/**
 * Varios montos bajo una sola variable: a cada cliente se le pone el primero de
 * la lista que sea mayor que cero y llegue al mínimo, si lo hay; sin ninguno, el
 * cliente no entra. Vive en el tenor que la creó.
 */
export interface CombinadaTenor {
  /** Nombre entre llaves con que va en el mensaje; sale de la etiqueta. */
  token: string;
  etiqueta: string;
  /** Columnas de monto en orden de prioridad. */
  columnas: string[];
  /** Por debajo de este monto se salta al siguiente; nulo si no hay. */
  minimo?: number | null;
  /** Etiquetas de esas columnas, solo para mostrar; las pone el backend. */
  nombres?: string[] | null;
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
  combinadas: CombinadaTenor[];
  /** Si el archivo empieza con los contactos de control. */
  incluirContactosControl: boolean;
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
  combinadas: CombinadaTenor[];
  incluirContactosControl: boolean;
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

/**
 * Persona del equipo que recibe el mismo SMS al inicio del archivo, para validar
 * el mensaje. Nombre, documento y celular son suyos; el resto de su fila se copia
 * de un cliente del archivo.
 */
export interface ContactoControl {
  id: number | null;
  nombre: string;
  documento: string | null;
  telefono: string;
}

export interface RespuestaApi<T> {
  success: boolean;
  data: T;
  message?: string;
}
