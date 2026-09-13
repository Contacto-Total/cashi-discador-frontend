// Modelos del dominio de auditoria de timing.
// Espejan los DTOs del backend en com.callcenter.dto.auditoria.

export interface PasoTiming {
  numeroEtapa: number;
  etapa: string;
  observacion: string | null;
  codigoRespuesta: string | null;
  tsInicio: string;            // ISO-8601 LocalDateTime
  offsetDesdeInicioMs: number; // ms desde inicio de la llamada
  duracionMs: number | null;   // ms hasta el siguiente paso; null en el ultimo
}

export interface LlamadaTiming {
  uuidLlamada: string;
  telefono: string | null;
  idCampana: number | null;
  estadoFinal: string | null;
  codigoFinal: string | null;
  pasoMaxAlcanzado: number | null;
  tsInicio: string | null;
  tsFin: string | null;
  duracionTotalMs: number | null;
  pasos: PasoTiming[];
}

export interface LlamadaResumen {
  uuidLlamada: string;
  telefono: string | null;
  idCampana: number | null;
  estadoFinal: string | null;
  codigoFinal: string | null;
  pasoMaxAlcanzado: number | null;
  tsInicio: string | null;
  tsFin: string | null;
  duracionTotalMs: number | null;
  cantidadPasos: number;
}

export interface LlamadasPage {
  content: LlamadaResumen[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ConfigAuditoria {
  activo: boolean;
  sp_cabecera_activo: boolean;
  sp_detalle_activo: boolean;
  ultimoCambio: string | null;
  ultimoUsuario: string | null;
}

export interface ConfigAuditoriaLog {
  id: number;
  nombreProcedure: string;
  activoAnterior: number | null;
  activoNuevo: number | null;
  usuario: string | null;
  tsCambio: string;
}
