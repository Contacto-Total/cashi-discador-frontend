import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BotConfig {
  id?: number;
  activo: boolean;
  modoPerfil: string;              // MANUAL | AUTO
  idPerfilActivo?: number;
  horaInicio: string;             // HH:mm:ss
  horaFin: string;
  diasSemana: string;
  maxLlamadasSimultaneas: number;
  politicaTitularidad: string;    // IGNORA | PRIORIZA_LIBRES | SOLO_LIBRES
}

export interface BotPerfil {
  id: number;
  nombre: string;
  diaMesDesde: number;
  diaMesHasta: number;
  maxLlamadasDia: number;
  diasAnticipacion: number;
  incluirVencidas: boolean;
  maxDiasVencida?: number | null;
  maxIntentosPorCuota: number;
  estiloTono: string;
  permiteProponerFechas: boolean;
}

/**
 * Una cola de discado del bot: se crea eligiendo una subcartera y se arranca con un
 * boton. NO es una campaña — una campaña reparte contactos entre asesores y esta
 * marca sola; solo se le parece en como trae a los clientes.
 */
export interface BotCola {
  id?: number;
  nombre: string;
  descripcion?: string;
  idInquilino?: number;
  idCartera?: number;
  idSubcartera: number;
  /** Coma-separados: RECORDATORIO | CREACION | PRIMER_CONTACTO */
  objetivos: string;
  idTono?: number | null;
  idPerfil?: number | null;
  /** Todo lo de abajo hereda cuando va vacío: cola → perfil → configuración global. */
  horaInicio?: string | null;
  horaFin?: string | null;
  diasSemana?: string | null;
  maxLlamadasSimultaneas?: number | null;
  politicaTitularidad?: string | null;
  diasAnticipacion?: number | null;
  incluirVencidas?: boolean | null;
  maxDiasVencida?: number | null;
  maxLlamadasDia?: number | null;
  maxIntentosPorCuota?: number | null;
  estado?: string;               // BORRADOR | LISTA | CERRADA
  estaDiscando?: boolean;
  ultimaArmadaAt?: string;
  ultimoResumen?: string;
}

/** Una personalidad del bot: como se llama, como escribe y como suena. Van juntas. */
export interface BotTono {
  id?: number;
  nombre: string;
  descripcion?: string;
  nombreBot: string;
  generoVoz?: string;            // F | M
  estiloTono?: string;
  voiceId: string;
  vozEtiqueta?: string;
  ttsStability?: number;
  ttsStyle?: number;
  ttsSimilarityBoost?: number;
  ttsSpeed?: number;
  activo?: boolean;
}

/**
 * Reglas de negociación de una subcartera. `idSubcartera` null es la fila por defecto.
 * Cada número vacío hereda: la fila de la subcartera → la fila por defecto → el código.
 */
export interface BotRegla {
  id?: number;
  idSubcartera?: number | null;
  nombre?: string;
  pctPrimeraMin?: number | null;
  pctPrimeraMax?: number | null;
  kMinPrimera?: number | null;
  diasMaxPrimeraCuota?: number | null;
  diasMinASegunda?: number | null;
  diasMaxASegunda?: number | null;
  maxCuotasBot?: number | null;
  activo?: boolean;
}

/** Una condición sobre una columna de la tabla de la subcartera. Igual que en campañas. */
export interface BotColaFiltro {
  id?: number;
  idCola?: number;
  fieldCode: string;
  fieldName?: string;
  dataType?: string;              // NUMERICO | FECHA | TEXTO | BOOLEAN
  minValue?: number | null;
  maxValue?: number | null;
  minDate?: string | null;
  maxDate?: string | null;
  selectedValues?: string | null;
}

export interface BotContacto {
  id: number;
  idCliente: number;
  documento?: string;
  nombreCliente?: string;
  idCuota?: number;
  numeroCuota?: number;
  montoCuota?: number;
  fechaPromesa?: string;
  estadoCuota?: string;
  telefono: string;
  idPerfil?: number;
  estado: string;
  intentos: number;
  resultado?: string;
  proximoIntentoAt?: string;
}

export interface BotSesion {
  id: number;
  uuidLlamada: string;
  idCliente?: number;
  documento?: string;
  nombreCliente?: string;
  telefono?: string;
  idCuota?: number;
  numeroCuota?: number;
  montoCuota?: number;
  fechaPromesa?: string;
  estado?: string;
  resultadoNegocio?: string;
  amdResultado?: string;
  duracionSeg?: number;
  costoEstimadoUsd?: number;
  inicio?: string;
  idGestion?: number;
}

/** Un turno de la conversacion, para el detalle de una llamada. */
export interface BotTurno {
  id: number;
  turno: number;
  hablante: string;       // BOT | CLIENTE
  texto: string;
  latenciaMs?: number;
  ts?: string;
}

@Injectable({ providedIn: 'root' })
export class BotVozService {
  private readonly apiUrl = `${environment.apiUrl}/bot-admin`;

  constructor(private http: HttpClient) {}

  getConfig(): Observable<BotConfig> { return this.http.get<BotConfig>(`${this.apiUrl}/config`); }
  updateConfig(c: Partial<BotConfig>): Observable<BotConfig> { return this.http.put<BotConfig>(`${this.apiUrl}/config`, c); }

  // Botones start/stop de la cola de llamadas.
  activar(): Observable<BotConfig> { return this.http.post<BotConfig>(`${this.apiUrl}/activar`, {}); }
  desactivar(): Observable<BotConfig> { return this.http.post<BotConfig>(`${this.apiUrl}/desactivar`, {}); }

  getTurnos(idSesion: number): Observable<BotTurno[]> {
    return this.http.get<BotTurno[]>(`${this.apiUrl}/sesiones/${idSesion}/turnos`);
  }

  getPerfiles(): Observable<BotPerfil[]> { return this.http.get<BotPerfil[]>(`${this.apiUrl}/perfiles`); }
  updatePerfil(id: number, p: Partial<BotPerfil>): Observable<BotPerfil> { return this.http.put<BotPerfil>(`${this.apiUrl}/perfiles/${id}`, p); }

  // ---- Colas: definir, armar, iniciar y detener ----

  getColas(): Observable<BotCola[]> { return this.http.get<BotCola[]>(`${this.apiUrl}/colas`); }
  crearCola(c: BotCola): Observable<BotCola> { return this.http.post<BotCola>(`${this.apiUrl}/colas`, c); }
  actualizarCola(id: number, c: Partial<BotCola>): Observable<BotCola> {
    return this.http.put<BotCola>(`${this.apiUrl}/colas/${id}`, c);
  }
  /** Rellena la cola del dia con los clientes de SU subcartera. */
  armarColaDe(id: number): Observable<any> { return this.http.post<any>(`${this.apiUrl}/colas/${id}/armar`, {}); }
  /** El boton. Arrancar y parar no pierden lo encolado. */
  iniciarCola(id: number): Observable<BotCola> { return this.http.post<BotCola>(`${this.apiUrl}/colas/${id}/iniciar`, {}); }
  detenerCola(id: number): Observable<BotCola> { return this.http.post<BotCola>(`${this.apiUrl}/colas/${id}/detener`, {}); }

  // ---- Tonos: el catalogo que elige el supervisor y edita el administrador ----

  getTonos(todos = false): Observable<BotTono[]> {
    return this.http.get<BotTono[]>(`${this.apiUrl}/tonos${todos ? '?todos=true' : ''}`);
  }
  crearTono(t: BotTono): Observable<BotTono> { return this.http.post<BotTono>(`${this.apiUrl}/tonos`, t); }
  actualizarTono(id: number, t: Partial<BotTono>): Observable<BotTono> {
    return this.http.put<BotTono>(`${this.apiUrl}/tonos/${id}`, t);
  }
  /** Que diria, con que voz, y el audio ya sintetizado en base64. */
  demoTono(id: number): Observable<any> { return this.http.get<any>(`${this.apiUrl}/tonos/${id}/demo`); }

  // ---- Reglas de negociación por subcartera ----

  getReglas(): Observable<BotRegla[]> { return this.http.get<BotRegla[]>(`${this.apiUrl}/reglas`); }
  /** Lo que rige HOY para esa subcartera, ya con la herencia aplicada. */
  getReglasEfectivas(idSubcartera?: number): Observable<any> {
    const q = idSubcartera ? `?idSubcartera=${idSubcartera}` : '';
    return this.http.get<any>(`${this.apiUrl}/reglas/efectivas${q}`);
  }
  crearRegla(r: BotRegla): Observable<BotRegla> { return this.http.post<BotRegla>(`${this.apiUrl}/reglas`, r); }
  actualizarRegla(id: number, r: BotRegla): Observable<BotRegla> {
    return this.http.put<BotRegla>(`${this.apiUrl}/reglas/${id}`, r);
  }

  // ---- Filtros de una cola ----

  getFiltros(idCola: number): Observable<BotColaFiltro[]> {
    return this.http.get<BotColaFiltro[]>(`${this.apiUrl}/colas/${idCola}/filtros`);
  }
  /** Reemplaza el conjunto entero: así se edita en el formulario. */
  guardarFiltros(idCola: number, f: BotColaFiltro[]): Observable<BotColaFiltro[]> {
    return this.http.put<BotColaFiltro[]>(`${this.apiUrl}/colas/${idCola}/filtros`, f);
  }

  /** Subcarteras para el desplegable al crear una cola. */
  getSubcarteras(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/subcarteras`);
  }
  /** Inquilino y cartera de una subcartera: hacen falta para leer su tabla dinamica. */
  getJerarquia(idSubcartera: number): Observable<{ idInquilino: number; idCartera: number }> {
    return this.http.get<{ idInquilino: number; idCartera: number }>(
      `${environment.apiUrl}/subcarteras/${idSubcartera}/jerarquia`);
  }

  armarCola(): Observable<any> { return this.http.post<any>(`${this.apiUrl}/cola/armar`, {}); }
  getCola(fecha?: string): Observable<BotContacto[]> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<BotContacto[]>(`${this.apiUrl}/cola${q}`);
  }
  getDescartes(fecha?: string): Observable<any[]> {
    const q = fecha ? `?fecha=${fecha}` : '';
    return this.http.get<any[]>(`${this.apiUrl}/cola/descartes${q}`);
  }

  getSesiones(): Observable<BotSesion[]> { return this.http.get<BotSesion[]>(`${this.apiUrl}/sesiones`); }
}
