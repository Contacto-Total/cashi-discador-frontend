export type OrigenFilaConciliacion = 'BANCO' | 'AGENTE';

export type TipoMatchConciliacion =
  | 'MATCH_EXACTO_OPERACION'
  | 'MATCH_DOCUMENTO_MONTO_FECHA'
  | 'POSIBLE_MATCH_DOCUMENTO_FECHA'
  | 'SOLO_BANCO'
  | 'SOLO_AGENTE';

export interface PosibleMatchConciliacionDTO {
  grupoConciliacionId: string;
  tipoMatch: TipoMatchConciliacion | string;
  tipoMatchDescripcion: string;
  prioridadMatch: number;
  bcpId: number | null;
  pcId: number | null;
  transaccionId: number | null;
  cuotaId: number | null;
  idGestion: number | null;
  diffDias: number | null;
  diffMonto: number | null;
  origenFila: OrigenFilaConciliacion;
  fecha: string | null;
  numeroOperacion: string | null;
  documentoCliente: string | null;
  entidad: string | null;
  monto: number | null;
  bancoProcesado: boolean | null;
  pagoVerificadoBanco: boolean | null;
}

export interface PosiblesMatchConciliacionParams {
  fechaInicio: string;
  fechaFin?: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
  toleranciaMonto?: number;
  toleranciaDias?: number;
}

export interface GrupoPosibleMatchConciliacion {
  grupoConciliacionId: string;
  tipoMatch: string;
  tipoMatchDescripcion: string;
  prioridadMatch: number;
  diffDias: number | null;
  diffMonto: number | null;
  banco: PosibleMatchConciliacionDTO | null;
  agente: PosibleMatchConciliacionDTO | null;
}
