// REQ-054 Fluctuación de cartera: lo que devuelve /api/dashboard/fluctuacion-cartera.

export type ModoFluctuacion = 'MES' | 'DIA';

export interface SubcarteraFluctuacion {
  idInquilino: number;
  inquilino: string;
  idCartera: number;
  cartera: string;
  idSubcartera: number;
  subcartera: string;
}

/** Un corte: un mes (clave AAAA-MM) o un día de carga (clave AAAA-MM-DD). */
export interface PeriodoFluctuacion {
  clave: string;
  etiqueta: string;
  etiquetaCorta: string;
  fecha: string;
}

export interface Indicadores {
  clientes: number;
  cj: number;
  capital: number;
  score: number | null;
}

export type GrupoFluctuacion = Indicadores;

export interface PuntoSerie {
  clave: string;
  etiqueta: string;
  score: number | null;
  cj: number;
  capital: number;
}

export interface FilaRiesgo {
  codigo: string;
  nombre: string;
  regla: string;
  peso: number;
  porcentajeAnterior: number | null;
  porcentajeActual: number | null;
  puntosAnterior: number | null;
  puntosActual: number | null;
}

export interface FilaOportunidad {
  tipificacion: string;
  base: string;
  clientesMantienen: number;
  capitalMantienen: number;
  clientesSalieron: number;
  capitalSalieron: number;
}

export interface GestionResumen {
  tipificacion: string | null;
  montoPromesa: number | null;
  estadoPago: string | null;
  fecha: string | null;
  deOtroCj: boolean;
}

export interface FilaAlerta {
  documento: string;
  cj: string;
  producto: string | null;
  capital: number;
  mejorEstado: string | null;
  ultimaGestion: GestionResumen | null;
  fechaSalida: string | null;
}

export interface AlertaFluctuacion {
  clientesSalieron: number;
  cjSalieron: number;
  capitalSalieron: number;
  filas: FilaAlerta[];
}

export type Asignacion = 'ASIGNADO' | 'MANTIENE' | 'ENTRO' | 'SALIO';

export interface FilaDetalle {
  documento: string | null;
  cj: string;
  producto: string | null;
  capital: number;
  asignacion: Asignacion;
  fechaMovimiento: string | null;
  score: number | null;
  riesgos: string[] | null;
  prioridad: number | null;
  fechaCastigo: string | null;
  mejorEstado: string | null;
  ultimaGestion: GestionResumen | null;
  conOportunidadOPromesa: boolean;
}

export interface DashboardFluctuacion {
  subcartera: SubcarteraFluctuacion;
  corte: PeriodoFluctuacion;
  anterior: PeriodoFluctuacion | null;
  actual: Indicadores;
  previo: Indicadores | null;
  serie: PuntoSerie[];
  riesgos: FilaRiesgo[];
  salieron: GrupoFluctuacion;
  mantienenAntes: GrupoFluctuacion;
  mantienen: GrupoFluctuacion;
  entraron: GrupoFluctuacion;
  oportunidades: FilaOportunidad[];
  alerta: AlertaFluctuacion;
  detalle: FilaDetalle[];
  cjSinDatos: number;
  desdeGestiones: string;
}
