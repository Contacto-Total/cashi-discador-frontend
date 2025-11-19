export interface RangeFilter {
  field: 'DEUDA_TOTAL' | 'CAPITAL' | 'SALDO_MORA' | 'BAJA30' | 'LTD' | 'LTDE' | 'PKM' | 'DIASMORA';
  min?: number;
  max?: number;
  inclusiveMin?: boolean;
  inclusiveMax?: boolean;
}

export interface DynamicQueryRequest {
  selects: string[];
  tramo?: '3' | '5';
  condiciones: string[];
  restricciones: {
    noContenido: boolean;
    excluirPromesasPeriodoActual: boolean;
    excluirCompromisos: boolean;
    excluirBlacklist: boolean;
  };
  limit?: number | null;
  importeExtra?: number | null;
  selectAll?: boolean;
  plantillaTexto?: string;
  rangos?: RangeFilter[];
}

export interface Row {
  DOCUMENTO: string;
  TELEFONOCELULAR: string;
  NOMBRE: string;
  LTD?: number;
  LTDE?: number;
  LTD_LTDE?: number;
  BAJA30?: number;
  SALDO_MORA?: number;
  BAJA30_SALDOMORA?: number;
  CAPITAL?: number;
  DEUDA_TOTAL?: number;
}

export interface SmsPrecheckItem {
  documento?: string;
  len: number;
  segments: number;
  text: string;
}

export interface SmsPrecheckResult {
  ok: boolean;
  total: number;
  excedidos: number;
  limite: number;
  charset?: string;
  peor?: SmsPrecheckItem;
  ejemplos?: SmsPrecheckItem[];
}

export interface PreviewCandidate {
  variable: string;
  filasQueResuelve: number;
}

export interface PreviewItem {
  documento: string;
  nombre: string;
  variableUsada: string | null;
  valorUsado: number | null;
  sms: string;
}

export interface PreviewInitResp {
  sessionId: string;
  total: number;
  resueltas: number;
  pendientes: number;
  candidatas: PreviewCandidate[];
  muestraPreview: PreviewItem[];
}

export interface PreviewStepResp extends PreviewInitResp {}
