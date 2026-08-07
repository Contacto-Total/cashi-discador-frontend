export interface ReportePagosBancarios {
  periodo: string;
  banco: string;
  totalRegistros: number;
  montoTotal: number;
  pagos: DetallePagoBancario[];
}

export interface DetallePagoBancario {
  id: number;
  documento: string | null;
  codigoDepositante: string | null;
  fechaBanco: string | null;
  horaAtencion: string | null;
  montoBanco: number | null;
  banco: string | null;
  medioAtencion: string | null;
  numeroOperacion: string | null;
  numeroOperacionCanal: string | null;
  sucursal: string | null;
  agencia: string | null;
  referencia: string | null;
  procesado: boolean | null;
  cuotaAplicadaId: number | null;
  transaccionIdAplicada: number | null;
}
