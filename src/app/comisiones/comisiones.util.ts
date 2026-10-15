import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import {
  AccionAuditoria,
  BonoPeriodo,
  ClienteContenido,
  DetalleComision,
  EscalaComision,
  EstadoPeriodo,
  GrupoComision,
  LineaDesglose,
  MetaCantidad,
  MotivoExclusion,
  PagoSustento,
  ParticipanteComision,
  RolComision,
  TipoBono,
  TipoMetaCantidad,
  TipoMetrica,
  VistaPeriodo
} from './models/comision.model';

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function nombreMes(mes: number): string {
  return MESES[mes - 1] ?? '';
}

/** Periodo como lo escribe administración: 2026-09 */
export function codigoPeriodo(anio: number, mes: number): string {
  return `${anio}-${String(mes).padStart(2, '0')}`;
}

/** dd/mm de una fecha ISO (yyyy-mm-dd) */
export function diaMes(fechaIso: string | null | undefined): string {
  if (!fechaIso) {
    return '';
  }
  const [, m, d] = fechaIso.slice(0, 10).split('-');
  return `${d}/${m}`;
}

/** Cómo se ve un mes en pantalla: abierto, cerrado, sin configurar o sin pagos */
export type EstadoVista = 'ABIERTO' | 'CERRADO' | 'SIN_CONFIG' | 'SIN_PAGOS';

export const ESTADO_VISTA_INFO: Record<EstadoVista, { etiqueta: string; clase: string; punto: string }> = {
  ABIERTO: { etiqueta: 'Abierto', clase: 'cmx-st-abierto', punto: 'is-ab' },
  CERRADO: { etiqueta: 'Cerrado', clase: 'cmx-st-cerrado', punto: 'is-ce' },
  SIN_CONFIG: { etiqueta: 'Sin configurar', clase: 'cmx-st-sinconfig', punto: 'is-no' },
  SIN_PAGOS: { etiqueta: 'Sin pagos', clase: 'cmx-st-sinpagos', punto: 'is-no' }
};

export function estadoVista(estado: EstadoPeriodo | null | undefined, pagos: number): EstadoVista {
  if (estado === 'CERRADO') {
    return 'CERRADO';
  }
  if (estado === 'EN_CURSO') {
    return 'ABIERTO';
  }
  return pagos > 0 ? 'SIN_CONFIG' : 'SIN_PAGOS';
}

export function estadoDeVista(vista: VistaPeriodo): EstadoVista {
  return estadoVista(vista.reporte?.periodo.estado, vista.pagos.cantidad);
}

export const METRICA_INFO: Record<TipoMetrica, { etiqueta: string; logrado: string; descripcion: string }> = {
  RECAUDO: {
    etiqueta: 'Recaudo',
    logrado: 'Recaudo',
    descripcion: 'Todo lo que pagan los clientes: cada pago conciliado suma su monto. Supervisor: suma todos los pagos conciliados del mes de la subcartera, incluidos los pagos voluntarios, los no asignados y los de gestiones de quien no participa.'
  },
  CONTENCION: {
    etiqueta: 'Contención',
    logrado: 'Contención',
    descripcion: 'Asesor: cada cliente que contiene suma su saldo capital asignado, una sola vez; la PDP es del día de la contención o antes y cubre la baja 30. Supervisor: suma el saldo capital asignado de todos los clientes CONTENIDO del mes, gestionados o no por su equipo.'
  }
};

/** Por qué un pago no suma, como se muestra */
export const MOTIVO_INFO: Record<MotivoExclusion, string> = {
  PAGO_SISTEMA: 'Pago voluntario (registrado por el supervisor)',
  SUPERVISOR_NO_ASIGNA: 'El supervisor no lo asignó al asesor',
  USUARIO_EXCLUIDO: 'Usuario excluido',
  AGENTE_NO_PARTICIPANTE: 'La gestión es de alguien que no participa',
  PARTICIPANTE_QUITADO: 'Participante quitado',
  NO_CONTENIDO: 'Cliente no contenido',
  YA_CONTENIDO: 'Cliente ya venía contenido',
  PDP_DESPUES_CONTENCION: 'PDP después de la contención',
  SIN_BAJA30: 'Cliente sin baja 30',
  PDP_MENOR_BAJA30: 'PDP menor a la baja 30'
};

/** Cartera de Tramo Propio como se muestra; vacío en GENERAL */
export const GRUPO_INFO: Record<GrupoComision, string> = {
  GENERAL: '',
  ANTIGUA: 'CP Antigua',
  NUEVA: 'CP Nueva'
};

/** "TRAMO PROPIO · CP Antigua", o solo el nombre de la subcartera */
export function nombreConGrupo(nombreSubcartera: string, grupo: GrupoComision | null | undefined): string {
  return grupo && grupo !== 'GENERAL' ? `${nombreSubcartera} · ${GRUPO_INFO[grupo]}` : nombreSubcartera;
}

export const ACCION_INFO: Record<AccionAuditoria, string> = {
  CREAR_PERIODO: 'Configuró el período',
  EDITAR_CONFIGURACION: 'Cambió la configuración',
  EDITAR_ROLES: 'Cambió los roles',
  EDITAR_TRAMOS: 'Cambió la escala',
  EDITAR_PARTICIPANTE: 'Agregó un participante',
  CALCULAR: 'Recalculó',
  CAMBIAR_ESTADO: 'Cambió el estado'
};

/**
 * Días hábiles del mes desde un día (inclusive): lunes a viernes, sin feriados (yyyy-mm-dd).
 * Es la misma regla del backend.
 */
export function diasHabilesDesde(anio: number, mes: number, desdeDia: number, feriados: string[]): number {
  const fin = new Date(anio, mes, 0).getDate();
  const fuera = new Set(feriados.map(f => f.slice(0, 10)));
  let dias = 0;
  for (let d = Math.max(desdeDia, 1); d <= fin; d++) {
    const w = new Date(anio, mes - 1, d).getDay();
    const iso = `${anio}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (w !== 0 && w !== 6 && !fuera.has(iso)) {
      dias++;
    }
  }
  return dias;
}

export const ROL_INFO: Record<RolComision, string> = {
  ASESOR: 'Asesor',
  SUPERVISOR: 'Supervisor'
};

/** Niveles de un rol ordenados por porcentajeDesde */
export function tramosDe(escalas: EscalaComision[], rol: RolComision): EscalaComision[] {
  return escalas
    .filter(e => e.rol === rol)
    .sort((a, b) => a.porcentajeDesde - b.porcentajeDesde);
}

/**
 * Nivel alcanzado con la comparación del backend: logrado × 100 ≥ desde × base.
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
 * Barra de la escala: un segmento por nivel (el primero, "sin comisión", si la escala no empieza en 0)
 * y un marcador en el cumplimiento. La barra llega hasta el último nivel + 30 puntos.
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
 * Cuánto le falta para el siguiente nivel (con monto). null si ya está en el más alto.
 * base = meta del participante (su meta individual, o la meta del mes para el supervisor).
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
  const siguiente = tramos.find(t => (tramoActual == null || t.porcentajeDesde > tramoActual) && t.montoComision > 0);
  if (!siguiente) {
    return null;
  }
  const falta = (siguiente.porcentajeDesde / 100) * base - logrado;
  return falta > 0 ? { desde: siguiente.porcentajeDesde, monto: siguiente.montoComision, falta } : null;
}

// ==================== METAS DE CANTIDAD Y BONOS ====================

export const TIPOS_META: { tipo: TipoMetaCantidad; nombre: string; descripcion: string; unidad: string }[] = [
  { tipo: 'GESTIONES', nombre: 'Meta de gestiones', descripcion: 'Gestiones (tipificaciones) que registró en el mes', unidad: 'gest.' },
  { tipo: 'PDP', nombre: 'Meta de PDP', descripcion: 'Promesas de pago que realizó en el mes', unidad: 'PDP' },
  { tipo: 'PAGOS', nombre: 'Meta de pagos', descripcion: 'Pagos conciliados (concretados) de sus gestiones en el mes', unidad: 'pagos' },
  { tipo: 'META', nombre: 'Meta de %MET%', descripcion: 'Llegar al 100 % de su meta individual', unidad: '' }
];

export const TIPOS_BONO: Record<TipoBono, string> = {
  LTD: 'Bono por LTD',
  PKM: 'Bono por PKM',
  SOBRE: 'Bono por sobrecumplimiento'
};

/** Valores de campo_monto_origen que cuentan como LTD */
export const ORIGENES_LTD = ['ltd', 'ltd_especial_feria', 'ltd_plus', 'ltd_especial'];

export type PresetBono = 'LTD_A' | 'LTD_S' | 'PKM_A' | 'SOBRE_A' | 'SOBRE_S';

export const PRESETS_BONO: { clave: PresetBono; etiqueta: string }[] = [
  { clave: 'LTD_A', etiqueta: 'Bono por LTD · asesor' },
  { clave: 'LTD_S', etiqueta: 'Bono por LTD · supervisor' },
  { clave: 'PKM_A', etiqueta: 'Bono por PKM · asesor' },
  { clave: 'SOBRE_A', etiqueta: 'Bono por sobrecumplimiento · asesor' },
  { clave: 'SOBRE_S', etiqueta: 'Bono por sobrecumplimiento · supervisor' }
];

/** Bono nuevo con los niveles de las tablas de setiembre 2026 (el sobrecumplimiento se llena a mano) */
export function bonoDePreset(clave: PresetBono): BonoPeriodo {
  const nivel = (desde: number, monto: number) => ({ desde, monto, montoSegundo: null });
  const base = { id: null, activo: true, origenes: [] as string[], baseTotal: false, porPuesto: false, excluidos: [] as number[] };
  switch (clave) {
    case 'LTD_A':
      return { ...base, tipo: 'LTD', aplica: 'ASESOR', origenes: [...ORIGENES_LTD], niveles: [nivel(10, 15), nivel(26, 20), nivel(46, 25)] };
    case 'LTD_S':
      return { ...base, tipo: 'LTD', aplica: 'SUPERVISOR', origenes: [...ORIGENES_LTD], niveles: [nivel(70, 300), nivel(110, 500), nivel(160, 1000)] };
    case 'PKM_A':
      return { ...base, tipo: 'PKM', aplica: 'ASESOR', niveles: [nivel(10, 15), nivel(26, 20), nivel(36, 25)] };
    case 'SOBRE_A':
      return { ...base, tipo: 'SOBRE', aplica: 'ASESOR', niveles: [] };
    case 'SOBRE_S':
      return { ...base, tipo: 'SOBRE', aplica: 'SUPERVISOR', niveles: [] };
  }
}

export function nombreBono(b: Pick<BonoPeriodo, 'tipo' | 'aplica'>): string {
  return `${TIPOS_BONO[b.tipo]} · ${b.aplica === 'ASESOR' ? 'asesor' : 'supervisor'}`;
}

/** Nombre corto de una línea de bono del desglose: "Bono por LTD · asesor" → "LTD" */
export function bonoCorto(nombre: string): string {
  return nombre.replace(/^Bono por /, '').replace(/ · .*$/, '');
}

export interface ChipMeta {
  nombre: string;
  valor: string;
  cumple: boolean;
  monto: number;
}

/** Metas de cantidad del asesor a partir del desglose que calculó el backend */
export function chipsMetas(p: ParticipanteComision): ChipMeta[] {
  return (p.desglose ?? [])
    .filter(l => l.tipo === 'META')
    .map(l => ({
      nombre: l.nombre.replace(/^Meta de /, ''),
      // "3300 de 3300 (150 por día × 22…)" → "3300 / 3300"; "95.5 % de su meta…" → "95.5 %"
      valor: l.detalle.includes(' % ') && !l.detalle.includes(' por día')
        ? l.detalle.slice(0, l.detalle.indexOf('%') + 1)
        : l.detalle.split(' (')[0].replace(' de ', ' / '),
      cumple: l.cumple,
      monto: l.monto
    }));
}

/** Lo que cobra por la escala (o logros) y por las metas de cantidad */
export function partesComision(p: ParticipanteComision): { escala: number; metas: number } {
  const suma = (lineas: LineaDesglose[]) => lineas.filter(l => l.cumple).reduce((s, l) => s + l.monto, 0);
  const lineas = p.desglose ?? [];
  return {
    escala: suma(lineas.filter(l => l.tipo === 'NIVEL' || l.tipo === 'LOGRO')),
    metas: suma(lineas.filter(l => l.tipo === 'META'))
  };
}

export function bonosGanados(p: ParticipanteComision): LineaDesglose[] {
  return (p.desglose ?? []).filter(l => l.tipo === 'BONO' && l.cumple && l.monto > 0);
}

/** Metas de cantidad en el orden de la pantalla, con las que no están marcadas vacías */
export function metasParaEditar(metas: MetaCantidad[] | null | undefined): { tipo: TipoMetaCantidad; activa: boolean; cantidadDia: number | null; monto: number | null }[] {
  return TIPOS_META.map(t => {
    const m = (metas ?? []).find(x => x.tipo === t.tipo);
    return { tipo: t.tipo, activa: !!m, cantidadDia: m?.cantidadDia ?? null, monto: m?.monto ?? null };
  });
}

// ==================== DETALLE ====================

/** Lo que suma el pago según la métrica: el recaudo, o en contención el capital asignado (0 si el cliente ya sumó) */
export function montoDetalle(d: DetalleComision): number {
  return d.recaudoContenido ?? d.recaudo ?? 0;
}

export interface DiaDetalle {
  fecha: string;
  pagos: DetalleComision[];
  clientes?: ClienteContenido[];
  /** Supervisor en RECAUDO: todos los pagos conciliados del día, sumen o no a un asesor */
  pagosSustento?: PagoSustento[];
  etiqueta?: string;
  /** Lo que suma cada pago (por conciliacionId) */
  sumas: Map<number, number>;
  monto: number;
  acumulado: number;
  porcentaje: number | null;
  nivel: EscalaComision | null;
  /** El nivel cambió este día */
  sube: boolean;
}

/**
 * Agrupa los pagos por fecha de banco y acumula. base = meta contra la que se mide
 * (la del asesor o la del mes para el supervisor); tramos = su escala.
 * unaVezPorCliente: el capital de un cliente que pagó a dos asesores suma una sola vez.
 */
export function agruparPorDia(filas: DetalleComision[], base: number | null, tramos: EscalaComision[],
                              unaVezPorCliente = false): DiaDetalle[] {
  const ordenadas = [...filas].sort((a, b) =>
    a.fechaBanco.localeCompare(b.fechaBanco) || a.conciliacionId - b.conciliacionId);
  const dias: DiaDetalle[] = [];
  const contados = new Set<string>();
  let acumulado = 0;
  let nivelAnterior: EscalaComision | null = null;
  for (const d of ordenadas) {
    let dia = dias[dias.length - 1];
    if (!dia || dia.fecha !== d.fechaBanco) {
      dia = { fecha: d.fechaBanco, pagos: [], sumas: new Map(), monto: 0, acumulado: 0, porcentaje: null, nivel: null, sube: false };
      dias.push(dia);
    }
    let monto = montoDetalle(d);
    if (unaVezPorCliente && monto > 0) {
      const cliente = d.documentoCliente ?? '';
      monto = contados.has(cliente) ? 0 : monto;
      contados.add(cliente);
    }
    acumulado += monto;
    dia.pagos.push(d);
    dia.sumas.set(d.conciliacionId, monto);
    dia.monto += monto;
    dia.acumulado = acumulado;
  }
  for (const dia of dias) {
    dia.porcentaje = base ? dia.acumulado / base * 100 : null;
    dia.nivel = base ? tramoAlcanzado(tramos, dia.acumulado, base) : null;
    dia.sube = !!dia.nivel && dia.nivel.montoComision > 0
      && (nivelAnterior == null || nivelAnterior.porcentajeDesde !== dia.nivel.porcentajeDesde);
    nivelAnterior = dia.nivel;
  }
  return dias;
}

/** Supervisor en RECAUDO: suma todos los pagos conciliados del mes, sumen o no a un asesor */
export function agruparPagosPorDia(pagos: PagoSustento[], base: number | null, tramos: EscalaComision[]): DiaDetalle[] {
  const ordenados = [...pagos].sort((a, b) =>
    a.fechaBanco.localeCompare(b.fechaBanco) || a.conciliacionId - b.conciliacionId);
  const dias: DiaDetalle[] = [];
  let acumulado = 0;
  let nivelAnterior: EscalaComision | null = null;
  for (const pg of ordenados) {
    let dia = dias[dias.length - 1];
    if (!dia || dia.fecha !== pg.fechaBanco) {
      dia = { fecha: pg.fechaBanco, pagos: [], pagosSustento: [], sumas: new Map(), monto: 0, acumulado: 0, porcentaje: null, nivel: null, sube: false };
      dias.push(dia);
    }
    const monto = pg.montoAplicado ?? 0;
    acumulado += monto;
    dia.pagosSustento!.push(pg);
    dia.sumas.set(pg.conciliacionId, monto);
    dia.monto += monto;
    dia.acumulado = acumulado;
  }
  for (const dia of dias) {
    dia.porcentaje = base ? dia.acumulado / base * 100 : null;
    dia.nivel = base ? tramoAlcanzado(tramos, dia.acumulado, base) : null;
    dia.sube = !!dia.nivel && dia.nivel.montoComision > 0
      && (nivelAnterior == null || nivelAnterior.porcentajeDesde !== dia.nivel.porcentajeDesde);
    nivelAnterior = dia.nivel;
  }
  return dias;
}

/** Los contenidos sin fecha ya venían contenidos: se agrupan en el primer día del mes */
export function agruparContenidosPorDia(
  contenidos: ClienteContenido[], primerDiaMes: string, base: number | null, tramos: EscalaComision[]
): DiaDetalle[] {
  const porFecha = new Map<string, DiaDetalle>();
  for (const cliente of contenidos) {
    const fecha = cliente.fechaContencion ?? primerDiaMes;
    let dia = porFecha.get(fecha);
    if (!dia) {
      dia = { fecha, pagos: [], clientes: [], sumas: new Map(), monto: 0, acumulado: 0, porcentaje: null, nivel: null, sube: false };
      porFecha.set(fecha, dia);
    }
    dia.clientes!.push(cliente);
    dia.monto += cliente.capitalAsignado ?? 0;
    if (cliente.fechaContencion == null) {
      dia.etiqueta = 'Ya venían contenidos';
    }
  }
  const dias = [...porFecha.values()].sort((a, b) => a.fecha.localeCompare(b.fecha));
  let acumulado = 0;
  let nivelAnterior: EscalaComision | null = null;
  for (const dia of dias) {
    dia.clientes!.sort((a, b) => a.documentoCliente.localeCompare(b.documentoCliente));
    acumulado += dia.monto;
    dia.acumulado = acumulado;
    dia.porcentaje = base ? acumulado / base * 100 : null;
    dia.nivel = base ? tramoAlcanzado(tramos, acumulado, base) : null;
    dia.sube = !!dia.nivel && dia.nivel.montoComision > 0
      && (nivelAnterior == null || nivelAnterior.porcentajeDesde !== dia.nivel.porcentajeDesde);
    nivelAnterior = dia.nivel;
  }
  return dias;
}

// ==================== VARIOS ====================

/** Mensaje del backend ({ message } del manejador global, o { error }) o uno genérico */
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
      return 'No tienes acceso al módulo de comisiones.';
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
