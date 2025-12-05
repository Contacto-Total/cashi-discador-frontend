export interface RecordatorioPromesa {
  idCuota: number;
  numeroCuota: number;
  totalCuotas: number;
  monto: number;
  fechaPago: string;
  estadoCuota: string;

  idCliente: number;
  nombreCliente: string;
  documentoCliente: string;
  telefono: string;

  idGestion: number;
  rutaJerarquia: string;
  observaciones: string;
  fechaGestion: string;

  idTenant: number;
  idCartera: number;
  idSubcartera: number;
  idCampana: number;

  intentosRecordatorio: number;
  ultimoIntentoRecordatorio: string | null;
  resultadoUltimoIntento: string | null;
  yaLlamoHoy: boolean;
}

export interface RegistrarRecordatorioRequest {
  idCuota: number;
  idAgente: number;
  resultado: string;
  uuidLlamada?: string;
  observaciones?: string;
}

export interface ResultadoRecordatorio {
  value: string;
  label: string;
}

export interface EstadisticasRecordatorios {
  fecha: string;
  totalLlamadas: number;
  contestadas: number;
  noContestadas: number;
  pendientesHoy: number;
}
