import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import {
  AccionAuditoria,
  EscalaComision,
  EstadoPeriodo,
  MotivoExclusion,
  ParticipanteComision,
  PeriodoComision,
  RolComision,
  TipoMetrica
} from './models/comision.model';

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function nombreMes(mes: number): string {
  return MESES[mes - 1] ?? '';
}

export const ESTADO_INFO: Record<EstadoPeriodo, { etiqueta: string; descripcion: string }> = {
  EN_CURSO: {
    etiqueta: 'En curso',
    descripcion: 'Se puede configurar y recalcular con los datos del día.'
  },
  REVISADO: {
    etiqueta: 'Revisado',
    descripcion: 'Los números fueron validados. Se puede reabrir o cerrar.'
  },
  CERRADO: {
    etiqueta: 'Cerrado',
    descripcion: 'Congelado: resultados y sustento ya no cambian.'
  }
};

export const METRICA_INFO: Record<TipoMetrica, { etiqueta: string; logrado: string; descripcion: string }> = {
  RECAUDO: {
    etiqueta: 'Recaudo',
    logrado: 'Recaudo',
    descripcion: 'Suma de pagos conciliados del mes'
  },
  CONTENCION: {
    etiqueta: 'Contención',
    logrado: 'Contención',
    descripcion: 'Capital asignado de clientes CONTENIDO con pago conciliado'
  }
};

export const MOTIVO_INFO: Record<MotivoExclusion, { etiqueta: string; descripcion: string }> = {
  PAGO_SISTEMA: {
    etiqueta: 'Pago de sistema',
    descripcion: 'La gestión está a nombre de SYSCA CASHI: promesa sistema o pago voluntario.'
  },
  SUPERVISOR_NO_ASIGNA: {
    etiqueta: 'No asignado por supervisor',
    descripcion: 'Al regularizar la fecha, el supervisor indicó que el pago no corresponde al asesor.'
  },
  AGENTE_NO_PARTICIPANTE: {
    etiqueta: 'Fuera de la lista',
    descripcion: 'La gestión es de alguien que no está en la lista de asesores del período.'
  },
  PARTICIPANTE_QUITADO: {
    etiqueta: 'Asesor quitado',
    descripcion: 'El asesor fue quitado del período: no divide la meta ni comisiona.'
  }
};

export const ACCION_INFO: Record<AccionAuditoria, string> = {
  CREAR_PERIODO: 'Creó el período',
  EDITAR_ROLES: 'Cambió los roles',
  EDITAR_TRAMOS: 'Cambió los tramos',
  EDITAR_PARTICIPANTE: 'Editó un participante',
  CALCULAR: 'Calculó',
  CAMBIAR_ESTADO: 'Cambió el estado'
};

export const ROL_INFO: Record<RolComision, string> = {
  ASESOR: 'Asesor',
  SUPERVISOR: 'Supervisor'
};

/** Tramos de un rol ordenados por porcentajeDesde */
export function tramosDe(escalas: EscalaComision[], rol: RolComision): EscalaComision[] {
  return escalas
    .filter(e => e.rol === rol)
    .sort((a, b) => a.porcentajeDesde - b.porcentajeDesde);
}

/** Asesores que dividen la meta */
export function asesoresActivos(participantes: ParticipanteComision[]): number {
  return participantes.filter(p => p.rol === 'ASESOR' && !p.quitado).length;
}

/** Meta que le toca a cada asesor (null si no hay asesores) */
export function metaPorAsesor(periodo: PeriodoComision, participantes: ParticipanteComision[]): number | null {
  const n = asesoresActivos(participantes);
  return n > 0 ? periodo.metaGrupal / n : null;
}

export interface SegmentoBarra {
  ancho: number;
  nivel: number;
  alcanzado: boolean;
  titulo: string;
}

export interface Barra {
  segmentos: SegmentoBarra[];
  marcador: number;
  escala: number;
}

/**
 * Barra de tramos: un segmento por tramo (el primero, "sin comisión", si la tabla no empieza en 0)
 * y un marcador en el cumplimiento. La escala llega hasta el último tramo + 30 puntos.
 */
export function construirBarra(tramos: EscalaComision[], porcentaje: number | null): Barra {
  const ultimo = tramos.length ? tramos[tramos.length - 1].porcentajeDesde : 100;
  const escala = Math.max(ultimo + 30, 120);
  const cortes: { desde: number; monto: number | null }[] = [];
  if (!tramos.length || tramos[0].porcentajeDesde > 0) {
    cortes.push({ desde: 0, monto: null });
  }
  tramos.forEach(t => cortes.push({ desde: t.porcentajeDesde, monto: t.montoComision }));

  const pct = porcentaje ?? 0;
  const segmentos = cortes.map((c, i) => {
    const hasta = i + 1 < cortes.length ? cortes[i + 1].desde : escala;
    return {
      ancho: Math.max(((hasta - c.desde) / escala) * 100, 0),
      nivel: c.monto == null ? 0 : Math.min(i + (cortes[0].monto == null ? 0 : 1), 7),
      alcanzado: pct >= c.desde,
      titulo: c.monto == null
        ? `0 – ${hasta}%: sin comisión`
        : `${c.desde}%${i + 1 < cortes.length ? ' – ' + hasta + '%' : ' a más'}: S/ ${c.monto}`
    };
  });
  return {
    segmentos,
    marcador: Math.min(pct, escala) / escala * 100,
    escala
  };
}

export interface SiguienteTramo {
  desde: number;
  monto: number;
  falta: number;
}

/**
 * Cuánto le falta al participante para el siguiente tramo. null si ya está en el más alto.
 * base = meta del participante (meta por asesor, o meta grupal para el supervisor).
 */
export function siguienteTramo(
  tramos: EscalaComision[],
  tramoActual: number | null,
  logrado: number,
  base: number | null
): SiguienteTramo | null {
  if (base == null) {
    return null;
  }
  const siguiente = tramos.find(t => tramoActual == null || t.porcentajeDesde > tramoActual);
  if (!siguiente) {
    return null;
  }
  const falta = (siguiente.porcentajeDesde / 100) * base - logrado;
  return falta > 0 ? { desde: siguiente.porcentajeDesde, monto: siguiente.montoComision, falta } : null;
}

/** Mensaje del backend ({ message } del manejador global, o { error } de base de ajuste) o uno genérico */
export function mensajeError(error: unknown, porDefecto: string): string {
  if (error instanceof HttpErrorResponse) {
    const cuerpo = error.error;
    if (cuerpo && typeof cuerpo === 'object' && typeof cuerpo.message === 'string' && cuerpo.message) {
      return cuerpo.message;
    }
    if (cuerpo && typeof cuerpo === 'object' && typeof cuerpo.error === 'string' && cuerpo.error
        && !('status' in cuerpo)) {
      return cuerpo.error;
    }
    if (error.status === 0) {
      return 'No hay conexión con el servidor. Intenta de nuevo.';
    }
    if (error.status === 403) {
      return 'Solo los administradores pueden usar el módulo de comisiones.';
    }
  }
  return porDefecto;
}

export function descargar(blob: Blob, nombre: string): void {
  saveAs(blob, nombre);
}

/** Nombre de archivo sin caracteres raros */
export function nombreArchivo(...partes: (string | number)[]): string {
  return partes
    .map(p => String(p).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_'))
    .join('_')
    .replace(/_+/g, '_') + '.xlsx';
}
