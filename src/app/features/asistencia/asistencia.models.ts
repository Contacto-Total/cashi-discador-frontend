/** Tipos del módulo de asistencia. Reflejan los DTO del backend. */

/** Las seis marcaciones del día. BREAK es la columna «PA» de la hoja anterior. */
export type TipoMarcacion =
  | 'ENTRADA'
  | 'BREAK_INICIO'
  | 'BREAK_FIN'
  | 'ALMUERZO_INICIO'
  | 'ALMUERZO_FIN'
  | 'SALIDA';

/**
 * PUNTUAL / TARDE salen de la hora de entrada; FALTA es un día laborable sin
 * inicio de sesión; NO_LABORABLE es un día sin horario, que no genera falta;
 * INCOMPLETO es un día trabajado al que le falta una marca necesaria para
 * cerrar las horas.
 */
export type EstadoAsistencia =
  | 'PUNTUAL'
  | 'TARDE'
  | 'FALTA'
  | 'NO_LABORABLE'
  | 'INCOMPLETO'
  | 'JUSTIFICADO';

export interface AsistenciaDia {
  fecha: string;
  nombreDia: string;
  idUsuario: number;
  nombreAgente: string;
  username: string;
  subcartera: string | null;

  /** null = no hay marca. Es el rojo «No marcación» de la leyenda. */
  entrada: string | null;
  breakInicio: string | null;
  breakFin: string | null;
  almuerzoInicio: string | null;
  almuerzoFin: string | null;
  salida: string | null;

  /** Marcas escritas a mano: el amarillo «Completado de forma manual». */
  marcasManuales: TipoMarcacion[];
  marcasFaltantes: TipoMarcacion[];

  horaEntradaHorario: string | null;
  horaSalidaHorario: string | null;
  minutosJornada: number | null;
  jornada: string | null;

  estado: EstadoAsistencia;
  /** Qué tipo de día es cuando no se trabajó: «Descanso médico», «Feriado». */
  tipoDia: string | null;
  minutosTardanza: number | null;
  tardanza: string | null;
  minutosExceso: number | null;
  exceso: string | null;

  minutosManana: number | null;
  horasManana: string | null;
  minutosTarde: number | null;
  horasTarde: string | null;
  minutosTrabajados: number | null;
  horasTrabajadas: string | null;

  excesoBreakMin: number | null;
  excesoAlmuerzoMin: number | null;
}

/** El corte con el que RR.HH. decide el bono: de lunes a viernes. */
export interface SemanaAgente {
  idUsuario: number;
  nombreAgente: string;
  lunes: string;
  viernes: string;
  diasTrabajados: number;
  diasPuntual: number;
  diasTarde: number;
  diasFalta: number;
  diasIncompletos: number;
  minutosTardanza: number;
  tardanza: string;
  minutosTrabajados: number;
  horasTrabajadas: string;
  minutosJornada: number;
  jornada: string;
  minutosExceso: number;
  exceso: string;
  superoToleranciaDiaria: boolean;
  superoToleranciaSemanal: boolean;
  pierdeBono: boolean;
}

export interface ResumenAgente {
  idUsuario: number;
  nombreAgente: string;
  username: string;
  subcartera: string | null;
  /** «Supervisor» o «Asesor»: se enseña junto al nombre. */
  rol: string | null;
  diasEsperados: number;
  diasTrabajados: number;
  diasPuntual: number;
  diasTarde: number;
  diasFalta: number;
  diasIncompletos: number;
  porcentajePuntualidad: number;
  minutosTardanza: number;
  tardanzaAcumulada: string;
  minutosTrabajados: number;
  horasTrabajadas: string;
  semanasSinBono: number;
  diasConExcesoPausa: number;
}

export interface AsistenciaReporte {
  dias: AsistenciaDia[];
  semanas: SemanaAgente[];
  agentes: ResumenAgente[];
  /** Los topes con los que se calculó. Son por subcartera, por eso vienen aquí. */
  toleranciaDiaMin: number | null;
  toleranciaSemanaMin: number | null;
}

// ==================== JUSTIFICACIONES ====================

export type EstadoJustificacion = 'PENDIENTE' | 'REVISADA' | 'APROBADA' | 'RECHAZADA';

export interface TipoDia {
  id: number;
  codigo: string;
  nombre: string;
  pagado: boolean;
  recuperable: boolean;
  exigeCertificado: boolean;
}

export interface Justificacion {
  id: number;
  idUsuario: number;
  nombreAgente: string | null;
  username: string | null;
  subcartera: string | null;
  idTipoDia: number;
  tipo: string | null;
  pagado: boolean | null;
  recuperable: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
  dias: number;
  comentario: string | null;
  archivoNombre: string | null;
  tieneArchivo: boolean;
  estado: EstadoJustificacion;
  solicitadaPor: string | null;
  solicitadaEn: string | null;
  revisadaPor: string | null;
  revisadaEn: string | null;
  resueltaPor: string | null;
  resueltaEn: string | null;
  motivoResolucion: string | null;
}

// ==================== CALENDARIO ====================

export interface DiaCalendario {
  id?: number;
  fecha: string;
  idSubcartera: number | null;
  idTipoDia: number;
  tipoCodigo?: string | null;
  tipo?: string | null;
  nombre: string | null;
  motivo: string;
  /** TRUE si viene del calendario de la empresa: desde aquí no se edita. */
  heredado?: boolean;
}

// ==================== CIERRE SEMANAL ====================

export interface AgenteCerrado {
  idUsuario: number;
  nombreAgente: string | null;
  diasTrabajados: number;
  diasPuntual: number;
  diasTarde: number;
  diasFalta: number;
  diasIncompletos: number;
  minutosTardanza: number;
  tardanza: string;
  minutosTrabajados: number;
  horasTrabajadas: string;
  minutosJornada: number;
  jornada: string;
  pierdeBono: boolean;
  motivoBono: string | null;
  /** Lo que cambió después del cierre. 0 = nada que compensar. */
  ajusteTardanzaMin: number;
  ajusteTrabajadasMin: number;
}

export interface CierreSemana {
  id: number;
  lunes: string;
  ultimoDia: string;
  idSubcartera: number | null;
  subcartera: string | null;
  cerradoPor: string | null;
  cerradoEn: string | null;
  nota: string | null;
  personas: number;
  sinBono: number;
  ajustesPosteriores: number;
  agentes: AgenteCerrado[] | null;
}

// ==================== AUDITORÍA Y DASHBOARD ====================

export interface CorreccionMarcacion {
  id: number;
  cuando: string;
  idUsuario: number;
  nombreAgente: string | null;
  fecha: string;
  marca: string;
  antes: string | null;
  despues: string | null;
  motivo: string | null;
  corrigio: string | null;
}

export interface PuntoDia {
  fecha: string;
  nombreDia: string;
  puntuales: number;
  tarde: number;
  faltas: number;
  incompletos: number;
  minutosTardanza: number;
}

/** Un cuadro del mapa de la semana: un día de una persona. */
export interface CuadroDia {
  fecha: string;
  nombreDia: string;
  estado: EstadoAsistencia;
}

export interface FilaAgenteDashboard {
  idUsuario: number;
  nombreAgente: string;
  /** «Karol R.»: en el mapa y las barras no cabe el nombre entero. */
  nombreCorto: string;
  subcartera: string | null;
  minutosTardanza: number;
  tardanza: string;
  porcentajePuntualidad: number;
  pierdeBono: boolean;
  minutosTrabajados: number;
  horasTrabajadas: string;
  minutosJornada: number;
  jornada: string | null;
  semana: CuadroDia[];
}

export interface AvisoPausa {
  idUsuario: number;
  nombreAgente: string;
  nombreCorto: string;
  excesoAlmuerzoMin: number;
  excesoBreakMin: number;
  totalMin: number;
}

export interface DashboardAsistencia {
  personas: number;
  porcentajePuntualidad: number;
  diasPuntuales: number;
  diasTrabajados: number;
  minutosTardanzaTotal: number;
  /** El tope del ámbito: el de una persona por cuantas son. */
  minutosTopeEquipo: number;
  pierdenBono: number;
  diasIncompletos: number;
  totalPuntual: number;
  totalTarde: number;
  totalFalta: number;
  totalIncompleto: number;
  porDia: PuntoDia[];
  agentes: FilaAgenteDashboard[];
  minutosExcesoAlmuerzo: number;
  minutosExcesoBreak: number;
  avisos: AvisoPausa[];
}

// ==================== POLÍTICA ====================

export interface PoliticaAsistencia {
  id?: number;
  idSubcartera: number | null;
  toleranciaDiaMin: number;
  toleranciaSemanaMin: number;
  minutosAlmuerzo: number;
  /** 0 = sin break. Hay subcarteras que no lo tienen. */
  minutosBreak: number;
  horaAlmuerzo: string | null;
  horaBreak: string | null;
  avisoPrevioMin: number;
  vigenteDesde?: string;
  vigenteHasta?: string | null;
  motivo: string;
  /** TRUE si la que se ve es la de la empresa y no la de esta subcartera. */
  heredada?: boolean;
}

// ==================== RECUPERACIONES ====================

/**
 * Horas que alguien debe por un día recuperable.
 *
 * `minutosPorSemana` es lo que hay que estirar la jornada para llegar a tiempo:
 * lo calcula el backend, no se marca a mano.
 */
export interface Recuperacion {
  id: number;
  idUsuario: number;
  nombreAgente: string | null;
  subcartera: string | null;
  fechaOrigen: string;
  minutosTotales: number;
  minutosRecuperados: number;
  minutosPendientes: number;
  totales: string;
  pendientes: string;
  fechaLimite: string;
  /** Días que quedan. Negativo = ya se pasó. */
  diasRestantes: number;
  semanasRestantes: number;
  minutosPorSemana: number;
  estado: 'PENDIENTE' | 'CUMPLIDA' | 'VENCIDA' | 'CONDONADA';
  motivoCierre: string | null;
}

// ==================== CONTROL DE ACCESO ====================

export interface EquipoAutorizado {
  id?: number;
  nombre: string;
  huella?: string;
  idUsuario: number | null;
  asignadoA?: string | null;
  idSubcartera: number | null;
  subcartera?: string | null;
  ubicacion: 'OFICINA' | 'REMOTO';
  activo?: boolean;
  motivoBaja?: string | null;
  instaladoEn?: string | null;
  ultimaConexion?: string | null;
  diasSinUsar?: number | null;
}

export interface IntentoAcceso {
  id: number;
  cuando: string;
  usuario: string;
  nombreAgente: string | null;
  ip: string | null;
  origen: string;
  dispositivo: string | null;
  motivo: string;
}

export interface ControlAcceso {
  activos: number;
  enOficina: number;
  remotos: number;
  deBaja: number;
  rechazos7Dias: number;
  sinUsar30Dias: number;
  equipos: EquipoAutorizado[];
  rechazos: IntentoAcceso[];
}

export interface Horario {
  id?: number;
  idSubcartera: number | null;
  idUsuario: number | null;
  /** 1 = lunes … 7 = domingo. */
  diaSemana: number;
  horaEntrada: string;
  horaSalida: string;
  vigenteDesde?: string;
  vigenteHasta?: string | null;
  motivo: string;
  nombreDia?: string;
  minutosVentana?: number;
}

/** Lo que se manda al completar una marca a mano. El motivo es obligatorio. */
export interface MarcacionManual {
  idUsuario: number;
  fecha: string;
  tipo: TipoMarcacion;
  hora: string;
  motivo: string;
}
