import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BotConfig {
  id?: number;
  activo: boolean;
  // `modoRitmo` e `idRitmoActivo` se quitaron: elegian el ritmo del armado GLOBAL,
  // que ya no existe. Cada cola elige el suyo con su propio `modoRitmo`.
  horaInicio: string;             // HH:mm:ss
  horaFin: string;
  diasSemana: string;
  // `maxLlamadasSimultaneas` se quitó de aquí: las llamadas a la vez son de cada cola
  // (BotCola), no un cupo global que repartir. Con tres colas discando, un techo común
  // obligaba a repartir a ojo, y sembrado en 1 dejaba sin efecto lo que dijera la cola.
  actualizadoPor?: string | null;
  fechaActualizacion?: string | null;
}

/**
 * El calendario de intensidad, global para todas las carteras. Sus números van POR
 * TAREA, porque cada uno solo significa algo en una de ellas:
 *
 *   TAREA                    diasAnticipacion   maxDiasVencida   intentos
 *   Recordatorio                    sí                --            sí
 *   PDP de cuota vencida            --                sí            sí
 *   1ª PDP                          --                --            sí
 */
export interface BotRitmo {
  id: number;
  nombre: string;
  diaMesDesde: number;
  diaMesHasta: number;
  /** Solo recordatorios: con cuántos días de adelanto se avisa. */
  diasAnticipacion: number;
  /** Solo vencidas: ancho de la ventana hacia atrás, en días. Techo 3. */
  maxDiasVencida: number;
  intentosRecordatorio: number;
  intentosVencida: number;
  intentosPrimera: number;
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
  /** Tono de respaldo: se usa en los objetivos que no tengan uno propio. */
  idTono?: number | null;
  idTonoRecordatorio?: number | null;
  idTonoVencida?: number | null;
  idTonoPrimera?: number | null;
  idRitmo?: number | null;
  /** AUTO = el ritmo lo decide el día del mes. MANUAL = el ritmo fijado arriba. */
  modoRitmo?: string;
  /**
   * El horario vacío se queda en la ventana legal; una cola solo puede estrecharla.
   *
   * `maxLlamadasSimultaneas` NO hereda de nadie: es el número de esta cola, entre 1 y
   * 5. Vacío vale 1.
   *
   * Los números de intensidad —días de anticipación, ancho de vencidas e intentos— ya
   * no están aquí: los pone el ritmo, y por tarea. La cola dice a quién se llama.
   */
  horaInicio?: string | null;
  horaFin?: string | null;
  diasSemana?: string | null;
  maxLlamadasSimultaneas?: number | null;
  estado?: string;               // BORRADOR | LISTA | CERRADA
  estaDiscando?: boolean;
  /** Por qué dejó de discar. Vacío = la paró una persona. */
  motivoPausa?: string | null;
  pausadaAt?: string | null;
  /** Los rellena el backend al leer; no se guardan. */
  nombreSubcartera?: string;
  nombreCartera?: string;
  nombreInquilino?: string;
  ultimaArmadaAt?: string;
  ultimoResumen?: string;
  /** Quién la tocó por última vez y cuándo. Solo lectura: lo pone el backend. */
  actualizadoPor?: string | null;
  fechaActualizacion?: string | null;
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
  actualizadoPor?: string | null;
  fechaActualizacion?: string | null;
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
  // `ultimoEscalonSoloHoy` se quitó: la condición del último escalón es fija y vive en
  // el backend (BotOfertaService). No se configura por subcartera.
  activo?: boolean;
  actualizadoPor?: string | null;
  fechaActualizacion?: string | null;
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
  idRitmo?: number;
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
  /** De qué cola salió. Se resuelve en el backend por `id_contacto`. */
  idCola?: number | null;
  nombreCola?: string | null;
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

/** Los totales de un día de llamadas, tal y como los cuenta la base. */
export interface ResumenLlamadas {
  fecha: string;
  total: number;
  porEstado: Record<string, number>;
  porResultado: Record<string, number>;
  duracionMediaSeg: number;
  costoUsd: number;
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

  // No hay PUT de configuración: `bot_config` ya no es configuración editable, son los
  // límites del sistema. Y de esos solo queda la ventana legal (Ley 29571), que no se
  // negocia. El techo de llamadas simultáneas se quitó de aquí: es de cada cola.

  // `activar`/`desactivar` se quitaron: escribian en bot_config.activo, que ya no
  // gobierna el discado. Cada cola tiene su propio Iniciar/Detener.

  getTurnos(idSesion: number): Observable<BotTurno[]> {
    return this.http.get<BotTurno[]>(`${this.apiUrl}/sesiones/${idSesion}/turnos`);
  }

  getRitmos(): Observable<BotRitmo[]> { return this.http.get<BotRitmo[]>(`${this.apiUrl}/ritmos`); }
  actualizarRitmo(id: number, p: Partial<BotRitmo>): Observable<BotRitmo> { return this.http.put<BotRitmo>(`${this.apiUrl}/ritmos/${id}`, p); }

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

  // ---- Filtros ----
  //
  // Van por SUBCARTERA y no por cola. Los filtros son parte de la misma decisión que
  // los objetivos —a quién llamamos— así que se eligen dentro del alta, y ahí la cola
  // todavía no existe. Colgarlos de `/colas/{id}` obligaba a guardar primero y volver
  // después por otro formulario.

  /** Por qué campos se puede segmentar esta subcartera. */
  getCampos(idInquilino: number, idCartera: number, idSubcartera: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subcarteras/${idSubcartera}/campos`,
      { params: { idInquilino, idCartera } });
  }

  /** Los valores de un campo. Se piden al añadir ese filtro, no al abrir la pantalla. */
  getValoresDeCampo(idInquilino: number, idCartera: number, idSubcartera: number,
                    campo: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/subcarteras/${idSubcartera}/campos/${encodeURIComponent(campo)}/valores`,
      { params: { idInquilino, idCartera } });
  }

  /**
   * Cuánta gente entraría, sin guardar nada.
   *
   * Corre el mismo código que arma la cola, en simulación. La versión anterior contaba
   * con una consulta aparte cuyo universo era el de la primera promesa, así que el
   * número no tenía que ver con lo que entraba por recordatorio ni por vencidas.
   */
  preview(idSubcartera: number, req: {
    idCola?: number | null; idInquilino: number; idCartera: number;
    objetivos: string; modoRitmo?: string; idRitmo?: number | null;
    filtros: BotColaFiltro[];
  }): Observable<{ entran?: number; candidatos?: number; error?: string }> {
    return this.http.post<any>(`${this.apiUrl}/subcarteras/${idSubcartera}/preview`, req);
  }

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

  /**
   * Las últimas llamadas. Con `estados`/`resultados` el backend devuelve solo esas.
   *
   * El filtro va al servidor y no al navegador porque aquí solo hay 100 filas: al
   * clicar una pastilla que cuenta 7 salían 2, y parecía que faltaban cinco.
   */
  getSesiones(estados?: string[], resultados?: string[],
              idCola?: number | null): Observable<BotSesion[]> {
    let p = new HttpParams();
    (estados ?? []).forEach((e) => (p = p.append('estados', e)));
    (resultados ?? []).forEach((r) => (p = p.append('resultados', r)));
    if (idCola) p = p.set('idCola', String(idCola));
    return this.http.get<BotSesion[]>(`${this.apiUrl}/sesiones`, { params: p });
  }

  /**
   * Los totales del día, contados en la base.
   *
   * `getSesiones` devuelve solo las 100 últimas —suficiente para la tabla, insuficiente
   * para contar—. Las pastillas salen de aquí para que no encojan solas según entran
   * llamadas nuevas.
   */
  getResumenSesiones(idCola?: number | null): Observable<ResumenLlamadas> {
    const p = idCola ? new HttpParams().set('idCola', String(idCola)) : undefined;
    return this.http.get<ResumenLlamadas>(`${this.apiUrl}/sesiones/resumen`, { params: p });
  }
}
