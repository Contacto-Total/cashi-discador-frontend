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
  /** AUTO = el ritmo lo decide el día del mes. MANUAL = el perfil fijado arriba. */
  modoPerfil?: string;
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
  /** Por qué dejó de discar. Vacío = la paró una persona. */
  motivoPausa?: string | null;
  pausadaAt?: string | null;
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
  /** Meses de cada opción, en orden: "12,5,3,1". Vacío = los calcula el sistema. */
  curvaMeses?: string | null;
  /** La última opción de la escalera solo se acepta con pago el mismo día. */
  ultimoEscalonSoloHoy?: boolean | null;
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
  idCola?: number;
  tipoObjetivo?: string;
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
  // updateConfig se quitó: `bot_config` ya no es configuración editable, son los
  // límites del sistema (ventana legal y techo de canales). Se leen, no se tocan aquí.

  // `activar`/`desactivar` se quitaron: escribian en bot_config.activo, que ya no
  // gobierna el discado. Cada cola tiene su propio Iniciar/Detener.

  getTurnos(idSesion: number): Observable<BotTurno[]> {
    return this.http.get<BotTurno[]>(`${this.apiUrl}/sesiones/${idSesion}/turnos`);
  }

  getPerfiles(): Observable<BotPerfil[]> { return this.http.get<BotPerfil[]>(`${this.apiUrl}/perfiles`); }
  updatePerfil(id: number, p: Partial<BotPerfil>): Observable<BotPerfil> { return this.http.put<BotPerfil>(`${this.apiUrl}/perfiles/${id}`, p); }

  // ---- Colas: definir, armar, iniciar y detener ----

  /** Qué puede hacer quien está mirando. El servidor decide igual; esto solo evita
   *  ofrecer botones que van a devolver 403. */
  getPermisos(): Observable<{ admin: boolean; subcarteras: number[]; configuracionTecnica: boolean }> {
    return this.http.get<any>(`${this.apiUrl}/permisos`);
  }

  getColas(): Observable<BotCola[]> { return this.http.get<BotCola[]>(`${this.apiUrl}/colas`); }
  crearCola(c: BotCola): Observable<BotCola> { return this.http.post<BotCola>(`${this.apiUrl}/colas`, c); }
  actualizarCola(id: number, c: Partial<BotCola>): Observable<BotCola> {
    return this.http.put<BotCola>(`${this.apiUrl}/colas/${id}`, c);
  }
  /** Rellena la cola del dia con los clientes de SU subcartera. */
  armarColaDe(id: number): Observable<any> { return this.http.post<any>(`${this.apiUrl}/colas/${id}/armar`, {}); }
  eliminarCola(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/colas/${id}`);
  }
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
  /**
   * Prueba de voz con la configuración TAL COMO ESTÁ EN PANTALLA.
   *
   * Se manda el tono entero y no su id: antes leía de la base y sonaba lo último
   * guardado, así que cambiabas la velocidad, dabas a Escuchar y oías la anterior.
   */
  demoTono(t: BotTono): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/tonos/demo`, t);
  }

  // ---- Reglas de negociación por subcartera ----

  // ---- Jerarquía proveedor → cartera → subcartera ----
  //
  // Se pide al MISMO backend que todo lo demás de esta pantalla (`/comisiones/...`),
  // no al microservicio de configuración: ese vive en otro host y otra autenticación,
  // y por eso los tres desplegables salían vacíos sin decir por qué.

  /**
   * Todas las subcarteras que este usuario puede ver, planas.
   *
   * La cascada proveedor -> cartera -> subcartera sirve para ELEGIR al crear una cola.
   * Para pintar el nombre de una que ya está guardada, o para consultar sus reglas,
   * obligaba a recorrer la cascada entera antes de ver nada: las tarjetas mostraban
   * "#27" y la lista de reglas salía vacía.
   */
  getSubcarterasPlanas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subcarteras`);
  }

  getProveedores(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.gatewayUrl}/comisiones/inquilinos`);
  }
  getCarteras(idInquilino: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.gatewayUrl}/comisiones/carteras?idInquilino=${idInquilino}`);
  }
  getSubcarteras(idCartera: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.gatewayUrl}/comisiones/subcarteras?idCartera=${idCartera}`);
  }

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
