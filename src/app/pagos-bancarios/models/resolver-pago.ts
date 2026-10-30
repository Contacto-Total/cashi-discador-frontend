import { aFechaIso, diasEntre } from './categoria-pago';
import { CuotaValidaTipificar, PagoPendienteConciliacion } from './correccion-pagos.model';

/** Días después del vencimiento en que todavía se amplía la cuota; pasados, va como promesa del sistema. */
export const DIAS_AMPLIACION = 3;

/** Pago del asesor: las filas de una misma transacción son un solo pago repartido en varias cuotas. */
export interface PagoDelAsesor {
  clave: string;
  /** Primera cuota del pago: el backend redistribuye el total de la transacción desde ella. */
  pagoCuotaId: number;
  fecha: string;
  total: number;
  asesor: string | null;
}

export function agruparPagosDelAsesor(filas: PagoPendienteConciliacion[]): PagoDelAsesor[] {
  const porPago = new Map<string, { pago: PagoDelAsesor; primeraCuota: number }>();
  for (const fila of filas) {
    const clave = fila.transaccionId ? `t${fila.transaccionId}` : `p${fila.pagoCuotaId}`;
    const actual = porPago.get(clave);
    if (!actual) {
      porPago.set(clave, {
        pago: { clave, pagoCuotaId: fila.pagoCuotaId, fecha: aFechaIso(fila.fechaPago), total: Number(fila.montoPago), asesor: fila.nombreAgente || null },
        primeraCuota: fila.numeroCuota
      });
      continue;
    }
    actual.pago.total = Math.round((actual.pago.total + Number(fila.montoPago)) * 100) / 100;
    if (fila.numeroCuota < actual.primeraCuota) {
      actual.primeraCuota = fila.numeroCuota;
      actual.pago.pagoCuotaId = fila.pagoCuotaId;
    }
  }
  return [...porPago.values()].map(item => item.pago).sort((a, b) => b.fecha.localeCompare(a.fecha));
}

/** Cuotas vencidas de la última promesa que admiten ampliar el vencimiento con la fecha del banco. */
export function cuotasAmpliables(cuotas: CuotaValidaTipificar[], fechaBanco: string): CuotaValidaTipificar[] {
  return vencidas(cuotas, fechaBanco).filter(c => Math.abs(diasEntre(aFechaIso(c.fechaPromesa), fechaBanco)) <= DIAS_AMPLIACION);
}

/** Cuotas vencidas hace más de los días de ampliación, dentro del mismo mes del pago. */
export function cuotasPromesaSistema(cuotas: CuotaValidaTipificar[], fechaBanco: string): CuotaValidaTipificar[] {
  return vencidas(cuotas, fechaBanco).filter(c => {
    const vence = aFechaIso(c.fechaPromesa);
    return diasEntre(vence, fechaBanco) > DIAS_AMPLIACION && vence.slice(0, 7) === fechaBanco.slice(0, 7);
  });
}

function vencidas(cuotas: CuotaValidaTipificar[], fechaBanco: string): CuotaValidaTipificar[] {
  return cuotas.filter(c => c.ultimaPromesa && c.estadoCuota === 'VENCIDA' && !!fechaBanco);
}
