/** Fila de alcance de meta por rango capital (v_meta_dashboard). */
export interface MetaAlcance {
  idInquilino: number;
  nombreInquilino: string;
  idCartera: number;
  nombreCartera: string;
  idSubcartera: number;
  nombreSubcartera: string;
  anio: number;
  mes: number;
  tipoMetrica: string;
  estado: string;
  codigoRango: string;
  etiquetaRango: string;
  orden: number;
  meta: number;
  avance: number;
  pctAlcance: number;
  metaIdealHoy: number;
}

export interface MetaResumen {
  totalMeta: number;
  totalAvance: number;
  totalMetaIdealHoy: number;
  pctGlobal: number;
  numRangos: number;
}

export interface MetaAlcanceResponse {
  data: MetaAlcance[];
  resumen: MetaResumen;
  anio: number;
  mes: number;
}

/** Punto de la curva de timing (recaudo acumulado por día y rango). */
export interface MetaTiming {
  fecha: string;
  dia: number;
  codigoRango: string;
  etiquetaRango: string;
  orden: number;
  recaudoAcum: number;
}

export interface MetaTimingResponse {
  data: MetaTiming[];
  anio: number;
  mes: number;
}
