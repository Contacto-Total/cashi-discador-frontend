import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import {
  AccionAuditoria,
  DetalleComision,
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

/** Orden del ciclo de vida del período */
export const ESTADOS: EstadoPeriodo[] = ['EN_CURSO', 'EN_REVISION', 'REVISADO', 'APROBADO'];

export const ESTADO_INFO: Record<EstadoPeriodo, { etiqueta: string; clase: string; descripcion: string }> = {
  EN_CURSO: {
    etiqueta: 'En curso',
    clase: 'cmx-st-curso',
    descripcion: 'Se actualiza solo con cada pago conciliado o corregido y al guardar la configuración.'
  },
  EN_REVISION: {
    etiqueta: 'En revisión',
    clase: 'cmx-st-revision',
    descripcion: 'Ya no se actualiza solo. Se puede actualizar a mano o volver a en curso.'
  },
  REVISADO: {
    etiqueta: 'Revisado',
    clase: 'cmx-st-revisado',
    descripcion: 'Números validados. Espera la aprobación de la jefatura de administración.'
  },
  APROBADO: {
    etiqueta: 'Aprobado',
    clase: 'cmx-st-aprobado',
    descripcion: 'Congelado: es lo que se paga.'
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
    logrado: 'Recaudo contenido',
    descripcion: 'Recaudo de clientes CONTENIDO en la tabla dinámica'
  }
};

export const MOTIVO_INFO: Record<MotivoExclusion, { etiqueta: string; descripcion: string }> = {
  PAGO_SISTEMA: {
    etiqueta: 'Pago de sistema',
    descripcion: 'La promesa o el pago están a nombre de un usuario de sistema (SYSCA CASHI): promesa sistema o pago voluntario.'
  },
  SUPERVISOR_NO_ASIGNA: {
    etiqueta: 'No asignado',
    descripcion: 'Al regularizar la fecha, el supervisor indicó que el pago no corresponde al asesor.'
  },
  USUARIO_EXCLUIDO: {
    etiqueta: 'Usuario excluido',
    descripcion: 'La promesa o el pago son de un usuario excluido en la configuración de la subcartera.'
  },
  AGENTE_NO_PARTICIPANTE: {
    etiqueta: 'Fuera de la lista',
    descripcion: 'La gestión es de alguien que no está en la lista de asesores del período.'
  },
  PARTICIPANTE_QUITADO: {
    etiqueta: 'Asesor quitado',
    descripcion: 'El asesor fue quitado del período: no divide la meta ni comisiona.'
  },
  NO_CONTENIDO: {
    etiqueta: 'No contenido',
    descripcion: 'El cliente no está CONTENIDO en la tabla dinámica: en T3 su pago no suma al alcance.'
  }
};

export const ACCION_INFO: Record<AccionAuditoria, string> = {
  CREAR_PERIODO: 'Creó el período',
  EDITAR_ROLES: 'Cambió los roles',
  EDITAR_TRAMOS: 'Cambió los tramos',
  EDITAR_PARTICIPANTE: 'Editó un participante',
  CALCULAR: 'Recalculó',
  CAMBIAR_ESTADO: 'Cambió el estado',
  EDITAR_PLANTILLA: 'Configuración de la subcartera'
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

/** Entre cuántos asesores se divide la meta: el número fijo de la subcartera o los asesores no quitados */
export function divisorMeta(periodo: PeriodoComision, participantes: ParticipanteComision[]): number {
  return periodo.divisionMeta === 'FIJO' && periodo.asesoresFijos
    ? periodo.asesoresFijos
    : asesoresActivos(participantes);
}

/** Meta que le toca a cada asesor (null si no hay entre quién dividir) */
export function metaPorAsesor(periodo: PeriodoComision, participantes: ParticipanteComision[]): number | null {
  const n = divisorMeta(periodo, participantes);
  return n > 0 ? periodo.metaGrupal / n : null;
}

/**
 * Tramo alcanzado con la comparación exacta del backend: logrado × 100 ≥ desde × base.
 * tramos ordenados ascendente.
 */
export function tramoAlcanzado(tramos: EscalaComision[], logrado: number, base: number): EscalaComision | null {
  let alcanzado: EscalaComision | null = null;
  for (const t of tramos) {
    if (logrado * 100 >= t.porcentajeDesde * base) {
      alcanzado = t;
    }
  }
  return alcanzado;
}

export interface SegmentoBarra {
  ancho: number;
  nivel: number;
  titulo: string;
}

export interface Barra {
  segmentos: SegmentoBarra[];
  marcador: number;
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

  const conBase = cortes[0].monto == null ? 0 : 1;
  const segmentos = cortes.map((c, i) => {
    const hasta = i + 1 < cortes.length ? cortes[i + 1].desde : escala;
    return {
      ancho: Math.max(((hasta - c.desde) / escala) * 100, 0),
      nivel: c.monto == null || c.monto === 0 ? 0 : Math.min(i + conBase, 7),
      titulo: c.monto == null
        ? `0 – ${hasta} %: sin comisión`
        : `${c.desde} %${i + 1 < cortes.length ? ' – ' + hasta + ' %' : ' a más'}: S/ ${c.monto}`
    };
  });
  const pct = porcentaje ?? 0;
  return {
    segmentos,
    marcador: Math.min(pct, escala - 0.5) / escala * 100
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

// ==================== DETALLE ====================

/** Monto del pago según la métrica (recaudo o recaudo contenido) */
export function montoDetalle(d: DetalleComision): number {
  return d.recaudo ?? d.recaudoContenido ?? 0;
}

/** Acumulado del asesor hasta el pago según la métrica */
export function acumuladoDetalle(d: DetalleComision): number {
  return d.recaudoAcumulado ?? d.recaudoContenidoAcumulado ?? 0;
}

export interface DiaDetalle {
  fecha: string;
  pagos: DetalleComision[];
  recaudo: number;
  acumulado: number;
  porcentaje: number | null;
  comision: number;
}

/**
 * Agrupa pagos por fecha de pago (ya vienen en orden). Con varios asesores (vista de la
 * subcartera) el acumulado es la suma de todos y la comisión se calcula con los tramos
 * y la base que se pasan.
 */
export function agruparPorDia(
  filas: DetalleComision[],
  base: number | null,
  tramos: EscalaComision[] | null
): DiaDetalle[] {
  const ordenadas = [...filas].sort((a, b) =>
    a.fechaBanco.localeCompare(b.fechaBanco) || a.conciliacionId - b.conciliacionId);
  const dias: DiaDetalle[] = [];
  let acumulado = 0;
  for (const d of ordenadas) {
    let dia = dias[dias.length - 1];
    if (!dia || dia.fecha !== d.fechaBanco) {
      dia = { fecha: d.fechaBanco, pagos: [], recaudo: 0, acumulado: 0, porcentaje: null, comision: 0 };
      dias.push(dia);
    }
    const monto = montoDetalle(d);
    acumulado += monto;
    dia.pagos.push(d);
    dia.recaudo += monto;
    dia.acumulado = acumulado;
    if (tramos) {
      dia.porcentaje = base ? acumulado / base * 100 : null;
      const t = base ? tramoAlcanzado(tramos, acumulado, base) : null;
      dia.comision = t ? t.montoComision : 0;
    } else {
      dia.porcentaje = d.porcentajeAcumulado;
      dia.comision = d.comisionAlcanzada;
    }
  }
  return dias;
}

// ==================== VARIOS ====================

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
