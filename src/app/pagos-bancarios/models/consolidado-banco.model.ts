/** Contexto y periodo (yyyy-MM) del consolidado mensual del banco. */
export interface ConsolidadoContexto {
  periodo: string;
  tenantId: number;
  carteraId: number;
  subcarteraId: number;
}

export interface ConsolidadoCargaResultado {
  exitoso: boolean;
  mensaje: string;
  /** Ya hay un consolidado activo del periodo: se debe confirmar el reemplazo. */
  yaExiste: boolean;
  cargaId: number | null;
  periodo: string | null;
  totalClientes: number | null;
  clientesConPago: number | null;
  montoTotalPagos: number | null;
  errores?: string[];
  advertencias?: string[];
}

export type ResultadoCuadre =
  | 'FALTA_EN_SISTEMA'
  | 'SOBRA_EN_SISTEMA'
  | 'NO_EN_CONSOLIDADO'
  | 'PENDIENTE_CONCILIAR'
  | 'CUADRA';

export interface ConsolidadoFila {
  documento: string;
  identityCode: string | null;
  rangoMora: string | null;
  montoConsolidado: number;
  montoDiarios: number;
  montoRegularizado: number;
  montoRecibido: number;
  montoConciliado: number;
  montoSinConciliar: number;
  diferencia: number;
  pagosRecibidos: number;
  posiblesDuplicados: number;
  pagosAplicadosDeMas: number;
  pagosFinDeMes: number;
  resultado: ResultadoCuadre;
  montoRegularizable: number;
}

export interface ConsolidadoCuadre {
  exitoso: boolean;
  mensaje: string | null;
  carga: {
    id: number;
    periodo: string;
    nombreArchivo: string;
    fechaCarga: string;
    usuarioCargaNombre: string | null;
    totalClientes: number;
    clientesConPago: number;
  } | null;
  resumen: {
    montoConsolidado: number;
    montoRecibido: number;
    montoDiarios: number;
    montoRegularizado: number;
    montoConciliado: number;
    diferencia: number;
    clientesPorResultado: Record<ResultadoCuadre, number>;
    ultimoPagoDiario: string | null;
  } | null;
  filas: ConsolidadoFila[];
}

export interface RegularizarConsolidadoRequest {
  monto: number;
  /** yyyy-MM-dd */
  fechaPago: string;
  observacion: string;
}

export interface RegularizarConsolidadoResponse {
  exitoso: boolean;
  mensaje: string;
  bcpPagoDetalleId: number | null;
  categoria: string | null;
  conciliado: boolean;
}

export interface ResultadoCuadreInfo {
  label: string;
  descripcion: string;
  tono: 'ok' | 'espera' | 'revision' | 'neutro';
}

export const RESULTADOS_CUADRE: Record<ResultadoCuadre, ResultadoCuadreInfo> = {
  FALTA_EN_SISTEMA: {
    label: 'Falta en el sistema',
    descripcion: 'El banco reporta más de lo que llegó en los archivos diarios.',
    tono: 'revision'
  },
  SOBRA_EN_SISTEMA: {
    label: 'Sobra en el sistema',
    descripcion: 'El sistema tiene más de lo que reporta el banco: posible duplicado, pago de otro cliente o pago de fin de mes que el banco contó en el mes siguiente.',
    tono: 'revision'
  },
  NO_EN_CONSOLIDADO: {
    label: 'No está en el consolidado',
    descripcion: 'Tiene pagos en el sistema pero el banco no lo incluye en el consolidado del periodo.',
    tono: 'espera'
  },
  PENDIENTE_CONCILIAR: {
    label: 'Pendiente de conciliar',
    descripcion: 'Lo recibido cuadra con el banco, pero parte sigue en pagos pendientes.',
    tono: 'espera'
  },
  CUADRA: {
    label: 'Cuadra',
    descripcion: 'Lo recibido y conciliado coincide con el banco.',
    tono: 'ok'
  }
};

export const ORDEN_RESULTADOS: ResultadoCuadre[] = [
  'FALTA_EN_SISTEMA',
  'SOBRA_EN_SISTEMA',
  'NO_EN_CONSOLIDADO',
  'PENDIENTE_CONCILIAR',
  'CUADRA'
];
