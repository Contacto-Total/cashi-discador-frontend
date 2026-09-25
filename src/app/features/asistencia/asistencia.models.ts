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
  codigoTipoDia: string | null;
  minutosTardanza: number | null;
  tardanza: string | null;
  minutosExceso: number | null;
  exceso: string | null;
  /** Recuperación aprobada ese día: minutos más a la salida y si la cumplió (null = aún sin salida). */
  minutosRecupera: number | null;
  recuperoCumplida: boolean | null;

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

/**
 * Un aviso para el asesor sobre su propia jornada.
 *
 * Sale como toast y no como panel: el del almuerzo tiene que interrumpir, y un
 * recuadro en una pantalla que quizá no está mirando no interrumpe nada.
 */
export interface AvisoAsistencia {
  /** `aviso` es algo que hay que hacer; `ok`, algo que ya quedó registrado. */
  tipo: 'aviso' | 'ok';
  titulo: string;
  texto: string;
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
  /** null = se puede registrar después; N = se pide con N días de anticipación. */
  diasAnticipacion: number | null;
}

export interface Justificacion {
  id: number;
  idUsuario: number;
  nombreAgente: string | null;
  username: string | null;
  subcartera: string | null;
  /** «Supervisor» o «Asesor»: quien revisa mira distinto uno que otro. */
  rol: string | null;
  idTipoDia: number;
  tipo: string | null;
  pagado: boolean | null;
  recuperable: boolean | null;
  fechaDesde: string;
  fechaHasta: string;
  dias: number;
  comentario: string | null;
  /** Solo en una recuperación: minutos más a la salida cada día y el día que recupera. */
  minutosExtra: number | null;
  fechaOrigen: string | null;
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
  /** Alguno de sus días es de una semana cerrada: ya no se revisa ni se aprueba. */
  semanaCerrada?: boolean | null;
}

// ==================== CALENDARIO ====================

/**
 * Qué puede hacer quien entra al módulo. RR.HH. es configuración y no un rol:
 * Emily es SUPERVISOR como las demás y lo que la distingue viene de aquí.
 */
export interface PerfilAsistencia {
  rrhh: boolean;
  supervisora: boolean;
  subcarteras: { id: number; nombre: string; cartera: string; idCartera: number; idCliente: number | null }[];
}

/** Un día del horario del equipo. */
export interface DiaDeHorario {
  diaSemana: number;
  nombre: string;
  entrada: string;
  salida: string;
}

/**
 * El horario de una persona un día. `distinto` = no es el del equipo;
 * `minutosRecupera` = sale más tarde por una recuperación; `solicitud` = el
 * tipo que cambia ese día («Descanso médico»); `porAprobar` si esa solicitud
 * todavía espera a RR.HH.
 */
export interface CeldaDeHorario {
  diaSemana: number;
  entrada: string;
  salida: string;
  distinto: boolean;
  minutosRecupera: number | null;
  solicitud: string | null;
  porAprobar: boolean;
  motivo: string | null;
}

/** El horario de una semana: el fijo del equipo más lo que cambian las solicitudes. */
export interface HorarioDeSemana {
  lunes: string;
  sabado: string;
  idSubcartera: number | null;
  /** `calendario` = feriado o sin asignación: ese día no se espera a nadie. */
  dias: (DiaDeHorario & { calendario: string | null })[];
  personas: { idUsuario: number; nombre: string; dias: CeldaDeHorario[] }[];
}

/** Lo que sale de leer el archivo de feriados, fila por fila. */
export interface ImportacionFeriados {
  guardado: boolean;
  nuevos: number;
  existentes: number;
  errores: number;
  filas: {
    fila: number;
    fecha: string | null;
    nombre: string | null;
    estado: 'NUEVO' | 'YA_EXISTE' | 'ERROR';
    detalle: string | null;
  }[];
}

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
  /** Lo que devolvió esa semana de sus horas por recuperar. */
  minutosRecuperados?: number | null;
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

/**
 * Una fila de la Auditoría: cualquier cambio del módulo —marca, recuperación,
 * solicitud, regla, feriado o cierre— con su valor anterior, el nuevo, el
 * motivo y quién lo hizo.
 */
export type TipoCambio = 'MARCACION' | 'RECUPERACION' | 'SOLICITUD' | 'REGLA' | 'FERIADO' | 'CIERRE';

export interface CambioAsistencia {
  /** «M-12» para una marca corregida, «A-7» para el resto. */
  id: string;
  fecha: string;
  tipo: TipoCambio;
  /** El asesor. NULL si el cambio es de un ámbito. */
  idUsuario: number | null;
  asesor: string | null;
  /** «CASTIGO», «Toda la empresa». Solo en los cambios de un ámbito. */
  ambito: string | null;
  detalle: string;
  valorAnterior: string | null;
  valorNuevo: string | null;
  motivo: string | null;
  /** Quién lo hizo; «Automático» si lo hizo el sistema. */
  usuario: string;
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
  /** «Sin asignación», «Feriado», «Cita médica»: el nombre del día cuando no es uno normal. */
  tipoDia: string | null;
  codigoTipoDia: string | null;
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
  /** Los días en que se pasó de cada pausa: los «casos» del aviso. */
  casosAlmuerzo?: number;
  casosBreak?: number;
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
  /** Días con alguna marca sin registrar, break incluido: los que bloquean el cierre. */
  diasPorCompletar: number;
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
  /** Opcional: en la Auditoría queda desde cuándo rige. */
  motivo?: string | null;
  /** TRUE si la que se ve es la de la empresa y no la de esta subcartera. */
  heredada?: boolean;
  /** La que ya se cambió y rige desde el lunes; NULL si no hay ninguna esperando. */
  programada?: PoliticaAsistencia | null;
}

// ==================== RECUPERACIONES ====================

/**
 * La pestaña Horario: la semana de una subcartera como calendario. Las horas
 * llegan como «18:30:00».
 */
export type EstadoSemanaPlan = 'CERRADA' | 'POR_CERRAR' | 'EN_CURSO' | 'PROXIMA' | 'PLANIFICADA';

export interface PlanSemana {
  lunes: string;
  sabado: string;
  estadoSemana: EstadoSemanaPlan;
  asesores: number;
  minutosSemana: number;
  dias: DiaPlan[];
  ausencias: AusenciaPlan[];
  /** Las de la semana, también las de días pasados con lo que de verdad se quedó. */
  bloques: BloquePlan[];
  /** Todas las de hoy en adelante de la gente del ámbito: el plan que se confirma entero. */
  futuros: BloquePlan[];
  deudas: DeudaPlan[];
}

/** Un día del equipo. `abierto` = sábado sin horario fijo; `noLaborable` = feriado o sin asignación. */
export interface DiaPlan {
  fecha: string;
  entrada: string;
  salida: string;
  abierto: boolean;
  noLaborable: string | null;
  horaAlmuerzo: string | null;
  minutosAlmuerzo: number | null;
  horaBreak: string | null;
  minutosBreak: number | null;
}

export interface AusenciaPlan {
  idUsuario: number;
  nombre: string;
  tipo: string;
  desde: string;
  hasta: string;
  porAprobar: boolean;
}

/** Una recuperación de un día: sale `minutos` después de su `salida` fija. */
export interface BloquePlan {
  id: number | null;
  idUsuario: number;
  nombre: string;
  fecha: string;
  minutos: number;
  salida: string;
  confirmado: boolean;
  /** Lo que de verdad se quedó, en los días que ya pasaron. */
  hecho: number | null;
}

export interface DeudaPlan {
  idUsuario: number;
  nombre: string;
  origen: string;
  total: number;
  recuperado: number;
  vence: string;
}

export interface ValidacionPlan {
  motivo: string | null;
  salida: string | null;
}

/** Lo del propio asesor: su plan de recuperación y las pausas de su horario. */
export interface MiPlan {
  /** «Permiso del 15/09»; NULL si no debe horas. */
  origen: string | null;
  total: number;
  recuperado: number;
  vence: string | null;
  bloques: BloquePlan[];
  horaAlmuerzo: string | null;
  minutosAlmuerzo: number | null;
  horaBreak: string | null;
  minutosBreak: number | null;
}

export interface PropuestaPlan {
  bloques: BloquePlan[];
  falta: number;
  mensaje: string;
}

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
  /** Las solicitudes de recuperación que abonan a esta deuda, en una línea. null = ninguna. */
  programada: string | null;
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
  /** El alcance y el autor con nombres; solo los trae el historial. */
  subcartera?: string | null;
  persona?: string | null;
  registradoPor?: string | null;
}

/** Un día del horario base: entrada, salida y la jornada sin el almuerzo. */
export interface DiaBase {
  /** 1 = lunes … 5 = viernes. */
  diaSemana: number;
  nombre: string;
  entrada: string;
  salida: string;
  minutosJornada: number;
}

/**
 * El horario base de un ámbito (null = la empresa): de lunes a viernes; el
 * sábado no tiene horario fijo. Un cambio rige desde el lunes siguiente y,
 * mientras no llega, viene en `programado`.
 */
export interface HorarioBase {
  idSubcartera: number | null;
  /** La subcartera no tiene horario propio y usa el de la empresa. */
  heredado: boolean;
  dias: DiaBase[];
  minutosSemana: number;
  programado: { desde: string; dias: DiaBase[]; minutosSemana: number; motivo: string | null } | null;
}

/** Lo que se manda al cambiarlo: los cinco días y el motivo, que es obligatorio. */
export interface CambioHorarioBase {
  idSubcartera: number | null;
  dias: { diaSemana: number; entrada: string; salida: string }[];
  motivo: string;
}

/** Lo que se manda al completar una marca a mano. El motivo es obligatorio. */
export interface MarcacionManual {
  idUsuario: number;
  fecha: string;
  tipo: TipoMarcacion;
  hora: string;
  motivo: string;
}
