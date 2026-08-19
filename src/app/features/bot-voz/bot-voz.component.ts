import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  BotVozService, BotConfig, BotRitmo, BotContacto, BotSesion, BotTurno,
  BotCola, BotTono, BotRegla, BotColaFiltro, ResumenLlamadas,
} from './bot-voz.service';

@Component({
  selector: 'app-bot-voz',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './bot-voz.component.html',
  styleUrls: ['./bot-voz.component.css'],
})
export class BotVozComponent implements OnInit, OnDestroy {
  /**
   * Qué se está mirando. Arranca en COLAS: es lo que se hace todos los días.
   * Ritmo, voces y reglas se abren desde los botones de la cabecera y vuelven aquí.
   */
  vista: 'colas' | 'ritmo' | 'tonos' | 'reglas' | 'llamadas' = 'colas';

  // ----- Colas y tonos -----
  colas: BotCola[] = [];
  tonos: BotTono[] = [];
  // Cascada inquilino -> cartera -> subcartera, la misma que usa el formulario de
  // campañas. Mi primera version pedia /subcarteras a secas contra la base equivocada
  // y ese endpoint ni existe: cuelga de /comisiones y exige idCartera.
  /** Lo que este usuario puede hacer. Se pide una vez al entrar. */
  esAdmin = false;
  puedeTecnico = false;
  misSubcarteras: number[] = [];

  inquilinos: any[] = [];
  carteras: any[] = [];
  subcarteras: any[] = [];
  idInquilinoSel = 0;
  idCarteraSel = 0;
  armandoCola?: number;
  guardandoCola = false;
  demoCargando?: number;
  /** El audio que esta sonando. Sin esto, cada clic apilaba otra reproduccion encima
   *  y sonaban tres voces a la vez; y volver a pulsar no paraba nada. */
  private demoAudio?: HTMLAudioElement;
  demoSonando?: number;
  /** Lo que diria cada tono, indexado por id. Se guarda para que quede en pantalla
   *  despues de sonar: la diferencia entre un tono y otro esta en las palabras. */
  demoTexto: Record<number, string> = {};
  /** Si la ultima muestra salio de la cache del micro (no se cobro) o se sintetizo. */
  demoCacheada: Record<number, boolean> = {};

  /** Abre los selectores de tono por objetivo. Cerrado, la cola usa uno solo. */
  afinarTonos = false;

  /** Los tres objetivos como casillas. Se juntan en `objetivos` al crear. */
  objRecordatorio = true;
  objCreacion = true;
  objPrimerContacto = false;

  nuevaCola: BotCola = this.colaVacia();
  /** El formulario de alta vive en un modal, como el de campañas. */
  modalCola = false;
  /** Id de la cola que se está editando. undefined = se está creando una nueva. */
  editandoCola?: number;
  /** El fallo al guardar, DENTRO del formulario. El aviso de arriba queda detrás del
   *  modal y no se ve: el error tiene que estar donde está el usuario. */
  errorModal = '';

  /**
   * Estilos que se pueden elegir. Es un selector y no un campo libre a proposito: este
   * texto se inyecta en el system prompt del modelo, y con un textarea abierto
   * cualquiera puede escribir algo que contradiga las reglas duras — "acepta lo que
   * te pida el cliente" iria directo delante del modelo.
   *
   * Los textos estan redactados para matizar COMO habla, nunca QUE puede ofrecer.
   * Cuando haga falta uno nuevo se añade aqui, revisado.
   */
  /**
   * Voces disponibles. El id de ElevenLabs vive AQUI y no en un campo de texto.
   *
   * Antes el formulario pedia "saqk76H0L3GCnuHtLDw6" a mano: un supervisor no tiene
   * de donde sacar eso, y un caracter mal copiado deja al bot mudo en la siguiente
   * llamada sin decir por que. Elige por nombre; el id lo pone el codigo.
   */
  readonly VOCES = [
    { id: 'saqk76H0L3GCnuHtLDw6', nombre: 'Voz femenina (la actual)', genero: 'F' },
  ];

  readonly ESTILOS = [
    { nombre: 'Sin ajuste (el de siempre)', texto: '' },
    { nombre: 'Cordial y cercano',
      texto: 'Usa un trato calido y cercano, sin perder el usted. Reconoce lo que te '
           + 'cuenta el cliente antes de continuar.' },
    { nombre: 'Firme y directo',
      texto: 'Se breve y directo. Ve al punto sin rodeos ni cortesias repetidas, '
           + 'manteniendo el respeto.' },
    { nombre: 'Formal y sobrio',
      texto: 'Manten un registro formal y sobrio, con frases cortas y sin coloquialismos.' },
    { nombre: 'Paciente y explicativo',
      texto: 'Explica con calma y comprueba que el cliente te ha entendido antes de '
           + 'seguir adelante.' },
  ];

  // ----- Reglas de negociacion -----
  reglas: BotRegla[] = [];
  /** Lo que rige hoy para la subcartera mirada, ya con la herencia aplicada. */
  reglasEfectivas?: any;
  subcarteraMirada?: number;

  /** Cola cuyo detalle esta abierto (el boton del ojo). */
  detalleDe?: number;

  config?: BotConfig;
  ritmos: BotRitmo[] = [];
  cola: BotContacto[] = [];
  descartes: any[] = [];
  sesiones: BotSesion[] = [];

  loadingCola = false;
  errorCola = false;
  errorSesiones = false;
  armando = false;
  mensaje = '';
  mensajeEsError = false;

  /** Copia de la config tal como esta en el servidor. Sirve para saber si el
   *  formulario tiene cambios sin guardar: en QAS se perdio un cambio del tope
   *  de simultaneas porque nadie noto que habia que darle a "Guardar". */
  private configGuardada = '';

  /** Igual que configGuardada pero por ritmo, indexado por id. */
  private ritmosGuardados = new Map<number, string>();

  /** Refresco de las vistas de monitoreo. Las filas cambian de estado mientras
   *  el bot disca y sin esto la pantalla se queda en la foto de cuando entraste. */
  private readonly REFRESCO_MS = 5000;
  private refresco?: ReturnType<typeof setInterval>;

  constructor(private svc: BotVozService) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarColas();
    this.cargarTonos();
    this.cargarConfig();
    this.cargarRitmos();
    this.cargarCola(true);   // alimenta el indicador de estado de la cabecera
    this.refresco = setInterval(() => this.refrescar(), this.REFRESCO_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
    this.pararDemo();       // si no, la muestra sigue sonando al cambiar de pantalla
  }

  /** La cola se refresca siempre porque de ella sale el estado de la cabecera.
   *  Config y ritmos no: recargarlos pisaria lo que el usuario esta editando. */
  private refrescar(): void {
    this.cargarCola(true);
    if (this.vista === 'llamadas') this.cargarSesiones();
  }

  /**
   * Estado real del bot. `config.activo` es solo el kill-switch: sigue en true
   * cuando la cola ya se termino, porque nada lo apaga solo. Sin mirar la cola,
   * la cabecera decia "discando" indefinidamente.
   */
  get estadoBot(): string {
    // Sale de las COLAS, no de `bot_config.activo`. Ese flag dejo de gobernar el
    // discado y la cabecera decia "Detenido" con colas marcando.
    const discando = this.colas.filter((c) => c.estaDiscando).length;
    if (!this.colas.length) return 'Sin colas creadas';
    if (!discando) return 'Ninguna cola discando';
    const enLlamada = this.contar('EN_LLAMADA');
    if (enLlamada > 0) return `${enLlamada} en llamada · ${discando} cola(s) activa(s)`;
    const pendientes = this.contar('PENDIENTE');
    if (pendientes > 0) return `${pendientes} por marcar · ${discando} cola(s) activa(s)`;
    return `${discando} cola(s) activa(s) · sin filas pendientes`;
  }

  /** El punto verde de la cabecera. */
  get hayDiscando(): boolean {
    return this.colas.some((c) => c.estaDiscando);
  }


  // colaMarcable, motivoNoIniciar y colaYaIniciada se fueron con el boton maestro:
  // solo servian para decidir si se podia encender el kill-switch global.














  /** "08:00:00" y "08:00" tienen que comparar igual: el backend devuelve con
   *  segundos y el <input type="time"> escribe sin ellos. */
  private hhmm(v?: string): string {
    return (v ?? '').slice(0, 5);
  }










  // ----- Paginacion de las tablas -----
  // Del lado del cliente: la cola son decenas de filas y las sesiones vienen
  // topadas en 100 por el backend, asi que no hace falta paginar en servidor.
  readonly TAM_PAGINA = 5;
  paginaCola = 1;
  paginaSesiones = 1;
  paginaDescartes = 1;

  /** El refresco cada 5 s puede achicar la lista (filas que salen de la cola).
   *  Sin esto te quedarias en una pagina que ya no existe, viendo vacio. */
  private pagina<T>(filas: T[], actual: number, fijar: (n: number) => void): T[] {
    const total = Math.max(1, Math.ceil(filas.length / this.TAM_PAGINA));
    if (actual > total) { actual = total; fijar(total); }
    const desde = (actual - 1) * this.TAM_PAGINA;
    return filas.slice(desde, desde + this.TAM_PAGINA);
  }

  /** Lo escrito en el buscador de llamadas. */
  busquedaLlamadas = '';

  // ----- Las pastillas de la pantalla de llamadas -----
  //
  // La tabla contesta "que paso en ESTA llamada" y no contesta lo primero que se
  // pregunta al abrirla: cuantas contestaron y cuantas dejaron algo. Eso estaba solo
  // en el total entre parentesis del titulo.
  //
  // Dos familias, y no una lista de dieciseis contadores:
  //   - COMO ACABO la llamada, que sale de `estado` y lo pone el micro.
  //   - QUE SE SACO, que sale de `resultadoNegocio` (la taxonomia del clasificador).
  // Una llamada contestada cuenta en las dos, a proposito: son dos preguntas, no dos
  // trozos de la misma tarta.
  //
  // Se pintan clicando: una pastilla que solo enseña un numero es justo lo que se
  // quito de los filtros de la cola por confuso. Clicando filtra la tabla, y vuelve a
  // clicarse para quitarlo.
  //
  // Las que salen a cero no se pintan. Con seis resultados posibles y llamadas de una
  // sola clase, la fila se llenaria de ceros que no dicen nada.
  private static readonly GRUPOS: { clave: string; etiqueta: string; tono: string;
                                    estados?: string[]; resultados?: string[] }[] = [
    // Como acabo. La primera se llamaba "Contestó" y dejaba fuera los buzones, que
    // TAMBIEN descolgaron: la pantalla decia "Contestó 3" cuando 65 lineas habian
    // descolgado. Ahora dice lo que cuenta —que habló una persona— y el dato de
    // cuantas descolgaron va aparte, en la linea de totales.
    { clave: 'hablo',      etiqueta: 'Habló una persona', tono: 'ok',
      estados: ['COMPLETADA', 'COLGO_CLIENTE'] },
    { clave: 'nocontesto', etiqueta: 'No contestó',   tono: 'gris',
      estados: ['NO_CONTESTA', 'OCUPADO'] },
    { clave: 'buzon',      etiqueta: 'Buzón',         tono: 'gris',   estados: ['BUZON'] },
    { clave: 'error',      etiqueta: 'Falló',         tono: 'malo',   estados: ['ERROR'] },
    // Que se saco
    { clave: 'promesa',    etiqueta: 'Con promesa',   tono: 'ok',
      resultados: ['ACUERDA_PAGO', 'CONFIRMA_PAGO'] },
    { clave: 'yapago',     etiqueta: 'Ya pagó',       tono: 'ok',     resultados: ['YA_PAGO'] },
    { clave: 'asesor',     etiqueta: 'Pide asesor',   tono: 'aviso',  resultados: ['PIDE_ASESOR'] },
    { clave: 'reclamo',    etiqueta: 'Reclamo',       tono: 'aviso',  resultados: ['RECLAMO'] },
    { clave: 'reprograma', etiqueta: 'Reprogramar',   tono: 'aviso',
      resultados: ['PIDE_REPROGRAMAR', 'PIDE_CANCELAR'] },
    { clave: 'nopuede',    etiqueta: 'No puede',      tono: 'gris',   resultados: ['NO_PUEDE'] },
    { clave: 'notitular',  etiqueta: 'No es titular', tono: 'gris',   resultados: ['NO_ES_TITULAR'] },
    { clave: 'sinnada',    etiqueta: 'Sin compromiso', tono: 'gris',  resultados: ['SIN_COMPROMISO'] },
  ];

  /** La pastilla clicada, o null cuando se ven todas las llamadas. */
  pillLlamadas: string | null = null;

  private encaja(s: BotSesion, clave: string): boolean {
    const g = BotVozComponent.GRUPOS.find((x) => x.clave === clave);
    if (!g) return true;
    if (g.estados) return g.estados.includes((s.estado || '').toUpperCase());
    return (g.resultados || []).includes((s.resultadoNegocio || '').toUpperCase());
  }

  /** Los totales del día que devuelve el backend. Null mientras no hayan llegado. */
  private _resumenLlamadas: ResumenLlamadas | null = null;

  get resumenLlamadas(): ResumenLlamadas | null { return this._resumenLlamadas; }
  set resumenLlamadas(r: ResumenLlamadas | null) {
    this._resumenLlamadas = r;
    this.pastillasLlamadas = this.calcularPastillas(r);
  }

  /**
   * Las pastillas con su cuenta, ya sin las que salen a cero.
   *
   * Es un CAMPO y no un getter, y esa es la diferencia entre que se pueda clicar o no.
   * Como getter devolvía un array nuevo en cada detección de cambios, así que el
   * *ngFor destruía y recreaba los botones continuamente —también al pasar el ratón
   * por encima, que ya dispara un ciclo—. Si el elemento se recrea entre el mousedown
   * y el mouseup, el navegador no llega a emitir el click: las pastillas se pintaban,
   * se veían como botones y no hacían absolutamente nada.
   *
   * Los números salen del RESUMEN del día, no de las llamadas cargadas: contando sobre
   * las 100 de la tabla, el número encogía solo según entraban llamadas nuevas.
   */
  pastillasLlamadas: { clave: string; etiqueta: string; tono: string; n: number }[] = [];

  private calcularPastillas(r: ResumenLlamadas | null) {
    if (!r) return [];
    return BotVozComponent.GRUPOS
      .map((g) => {
        const fuente = g.estados ? r.porEstado : r.porResultado;
        const claves = g.estados ?? g.resultados ?? [];
        const n = claves.reduce((a, k) => a + (fuente?.[k] ?? 0), 0);
        return { clave: g.clave, etiqueta: g.etiqueta, tono: g.tono, n };
      })
      .filter((p) => p.n > 0);
  }

  /** Sin esto el *ngFor tampoco reutiliza las filas aunque el array no cambie. */
  trackPastilla(_: number, p: { clave: string }): string { return p.clave; }

  /** Cuántas descolgaron: la persona y el buzón, que también descolgó. */
  get descolgaron(): number {
    const e = this.resumenLlamadas?.porEstado ?? {};
    return ['COMPLETADA', 'COLGO_CLIENTE', 'BUZON'].reduce((a, k) => a + (e[k] ?? 0), 0);
  }

  /** El nombre legible de una pastilla, para decir por que esta filtrada la tabla. */
  etiquetaDelPill(clave: string): string {
    return BotVozComponent.GRUPOS.find((g) => g.clave === clave)?.etiqueta ?? clave;
  }

  alternarPill(clave: string): void {
    this.pillLlamadas = this.pillLlamadas === clave ? null : clave;
    this.paginaSesiones = 1;
  }

  /** Las llamadas que coinciden con la busqueda y con la pastilla activa. */
  get sesionesFiltradas(): BotSesion[] {
    const q = this.busquedaLlamadas.trim().toLowerCase();
    const pill = this.pillLlamadas;
    if (!q && !pill) return this.sesiones;
    return this.sesiones.filter((s) => {
      if (pill && !this.encaja(s, pill)) return false;
      if (!q) return true;
      return (s.documento || '').toLowerCase().includes(q)
        || (s.nombreCliente || '').toLowerCase().includes(q)
        || (s.telefono || '').includes(q)
        || (s.resultadoNegocio || '').toLowerCase().includes(q);
    });
  }

  get sesionesPagina(): BotSesion[] {
    return this.pagina(this.sesionesFiltradas, this.paginaSesiones, (n) => (this.paginaSesiones = n));
  }

  /** Buscar vuelve a la primera pagina: si no, buscas y caes en una que ya no existe. */
  alBuscarLlamadas(): void { this.paginaSesiones = 1; }
  totalPaginas(filas: unknown[]): number {
    return Math.max(1, Math.ceil(filas.length / this.TAM_PAGINA));
  }
  irA(cual: 'cola' | 'sesiones' | 'descartes', n: number): void {
    const filas = cual === 'cola' ? this.cola
      : cual === 'sesiones' ? this.sesionesFiltradas : this.descartes;
    const destino = Math.min(Math.max(1, n), this.totalPaginas(filas));
    if (cual === 'cola') this.paginaCola = destino;
    else if (cual === 'sesiones') this.paginaSesiones = destino;
    else this.paginaDescartes = destino;
  }

  // ----- Descartes: por que una cuota no entro en la cola -----
  //
  // Antes esto era una fila de pastillas con el codigo crudo ("G13 · cuota 2334 —
  // el cliente ya tiene una promesa nueva vigente"). El codigo no dice nada a quien
  // no se sepa las reglas de memoria, y con veinte pastillas seguidas no habia forma
  // de ver que se descarto por que. Ahora cada regla lleva titulo, explicacion en
  // castellano y si es un problema que haya que arreglar o el sistema haciendo bien
  // su trabajo -- que es la pregunta que uno se hace al mirar esta lista.
  private readonly REGLAS: Record<string, { titulo: string; porque: string; ok: boolean }> = {
    G3:  { titulo: 'En lista negra',        ok: true,
           porque: 'El documento está en la blacklist: no se puede contactar a este cliente.' },
    G4:  { titulo: 'Datos incompletos',     ok: false,
           porque: 'La cuota no tiene gestión o cliente asociado. Es un problema de datos, no una regla de negocio.' },
    G6:  { titulo: 'Ya se llamó hoy',       ok: true,
           porque: 'El bot o un asesor ya contactó esta cuota hoy. No se llama dos veces el mismo día.' },
    G8:  { titulo: 'Sin teléfono válido',   ok: false,
           porque: 'El cliente no tiene ningún celular activo de 9 dígitos. Sin número no hay a dónde marcar.' },
    G11: { titulo: 'Tope diario alcanzado', ok: true,
           porque: 'Se llegó al máximo de llamadas que permite el ritmo activo. Estas cuotas entran mañana.' },
    G12: { titulo: 'Tiene cita agendada',   ok: true,
           porque: 'Hay una llamada agendada con un asesor. Llamar antes pisaría esa cita.' },
    G13: { titulo: 'Ya tiene promesa nueva', ok: true,
           porque: 'El cliente se comprometió hace poco. Cobrarle la deuda vieja teniendo un acuerdo fresco sería un error.' },
    DUP: { titulo: 'Teléfono repetido',     ok: true,
           porque: 'Otra cuota del mismo cliente ya usa ese número hoy. Se llama una vez y se hablan todas.' },
  };

  reglaTitulo(regla: string): string {
    return this.REGLAS[regla]?.titulo ?? regla;
  }
  /** Falso = hay algo que revisar (datos malos), no el sistema filtrando bien. */
  reglaEsNormal(regla: string): boolean {
    return this.REGLAS[regla]?.ok ?? true;
  }

  /** Resumen por regla, para ver de un vistazo si domina un problema real. */
  /**
   * Los descartes de UNA cola, agrupados por regla.
   *
   * Es la única respuesta a "¿por qué no le llamó a este cliente?". Antes se pintaban
   * los de todas las colas juntos, debajo de la lista; ahora cuelgan de la cola que
   * los generó, que es donde se buscan.
   */
  descartesDe(c: BotCola): { regla: string; titulo: string; n: number; ok: boolean }[] {
    const cuenta = new Map<string, number>();
    for (const d of this.descartes) {
      if (d.idCola !== c.id) continue;
      cuenta.set(d.regla, (cuenta.get(d.regla) ?? 0) + 1);
    }
    return [...cuenta.entries()]
      .map(([regla, n]) => ({ regla, n, titulo: this.reglaTitulo(regla), ok: this.reglaEsNormal(regla) }))
      .sort((a, b) => b.n - a.n);
  }

  abrir(v: 'colas' | 'ritmo' | 'tonos' | 'reglas' | 'llamadas'): void {
    // El ritmo es del admin: el botón no se le pinta al supervisor, pero la vista se
    // cierra también aquí. Ocultar el botón no es esconder la pantalla — basta con que
    // algo llame a abrir('ritmo') para colarse.
    if (v === 'ritmo' && !this.esAdmin) return;
    // Un segundo clic en el mismo botón devuelve a las colas: hace de ida y de vuelta.
    this.vista = this.vista === v && v !== 'colas' ? 'colas' : v;
    const t = this.vista;
    if (t === 'llamadas') this.cargarSesiones();
    if (t === 'colas') { this.cargarColas(); this.cargarTonos(); this.cargarCola(); }
    if (t === 'ritmo') this.cargarRitmos();
    if (t === 'tonos') this.cargarTonos();
    if (t === 'reglas') { this.cargarReglas(); this.cargarProveedoresReglas(); }
  }

  // ----- Colas -----

  /**
   * Una cola nueva no trae valores puestos: todo en null es "hereda".
   *
   * Rellenarlos con 08:00 y 1 seria peor que dejarlos vacios — la cola se llevaria
   * una copia congelada del horario y cambiar el global dejaria de servir de nada.
   */
  private colaVacia(): BotCola {
    return {
      nombre: '', idSubcartera: undefined as any, objetivos: '',
      idTono: null, horaInicio: null, horaFin: null,
      maxLlamadasSimultaneas: null,
      modoRitmo: 'AUTO', idRitmo: null,
    };
  }

  // ---- El ritmo que rige, para poder enseñarlo ----
  //
  // Los reintentos y los días de anticipación ya no se editan por cola: los manda el
  // calendario de ritmos. Aquí se resuelve cuál rige hoy para poder decir el número
  // en el formulario, en lectura. Un recuadro que pone "hereda" no informa de nada.

  /** El ritmo que se aplicaría hoy si la cola no fija ninguno. */
  get ritmoVigente(): BotRitmo | undefined {
    if (this.nuevaCola.modoRitmo === 'MANUAL' && this.nuevaCola.idRitmo) {
      return this.ritmos.find((p) => p.id === this.nuevaCola.idRitmo);
    }
    const dia = new Date().getDate();
    return this.ritmos.find((p) => p.diaMesDesde <= dia && p.diaMesHasta >= dia);
  }

  /**
   * Las tres cosas que hace Clara, con el campo de intentos que le toca a cada una.
   *
   * Ordena la pantalla del calendario: antes eran tres números sueltos por ritmo y no
   * había forma de saber a cuál de las tres afectaba cada uno.
   */
  readonly TOPE_VENCIDA = 3;
  readonly TAREAS: Array<{
    clave: string; titulo: string; subtitulo: string; icono: string;
    campoIntentos: 'intentosRecordatorio' | 'intentosVencida' | 'intentosPrimera';
  }> = [
    { clave: 'RECORDATORIO', titulo: 'Recordatorio',
      subtitulo: 'cuotas que aún no vencen', icono: 'bell',
      campoIntentos: 'intentosRecordatorio' },
    { clave: 'CREACION', titulo: 'PDP de cuota vencida',
      subtitulo: 'negociar una promesa nueva', icono: 'handshake',
      campoIntentos: 'intentosVencida' },
    { clave: 'PRIMER_CONTACTO', titulo: '1ª PDP',
      // `plus-circle` y no `user-plus`: el juego de iconos que registra app.config no
      // trae UserPlus, y un icono no registrado no se pinta ni avisa.
      subtitulo: 'clientes que nunca han pactado', icono: 'plus-circle',
      campoIntentos: 'intentosPrimera' },
  ];

  /**
   * Lo que hará Clara con el ritmo elegido, en frases, y solo de lo que esté marcado.
   *
   * Va justo debajo de las casillas y no en una tabla aparte porque es la respuesta a
   * "¿y esto qué significa hoy?". El supervisor no configura nada aquí: lee la
   * consecuencia de lo que acaba de marcar.
   */
  loQueHara(): string[] {
    const r = this.ritmoVigente;
    if (!r) return [];
    const frases: string[] = [];
    if (this.objRecordatorio) {
      frases.push(`Recordará cuotas ${r.diasAnticipacion} día(s) antes de que venzan`
        + `, con ${r.intentosRecordatorio} intento(s) por cliente.`);
    }
    if (this.objCreacion) {
      frases.push(`Negociará cuotas de hasta ${r.maxDiasVencida} día(s) de vencidas`
        + `, con ${r.intentosVencida} intento(s). No entran las de clientes que sigan`
        + ` en el periodo de gracia de su asesor.`);
    }
    if (this.objPrimerContacto) {
      frases.push(`Abrirá primeras promesas con ${r.intentosPrimera} intento(s)`
        + ` por cliente.`);
    }
    return frases;
  }

  /**
   * El calendario de ritmos vive fuera del modal, asi que ir alli lo cierra. Se avisa
   * antes: perder un formulario a medio llenar por pulsar un enlace informativo es
   * peor que el viaje de vuelta.
   */
  irAlCalendario(): void {
    const aviso = 'Se cerrará este formulario y se perderá lo que no hayas guardado. '
      + '¿Ir al calendario de ritmos?';
    if (!confirm(aviso)) return;
    this.cerrarModalCola();
    this.abrir('ritmo');
  }

  // Topes del sistema. No son configuración de negocio —son la ley y el techo de
  // canales de la máquina— así que no se editan en el panel: se enseñan como límite.
  //
  // Las llamadas a la vez NO están aquí: son de cada cola. Hubo un techo global en
  // `bot_config` que ninguna cola podía pasar, y con tres colas discando obligaba a
  // repartir un cupo que nadie sabía de dónde salía; peor, sembrado en 1 dejaba el
  // formulario de la cola sin efecto. Ahora cada cola dice cuántas sostiene, entre
  // MIN_SIMULTANEAS y MAX_SIMULTANEAS, y no se resta de ningún bolsón común.
  readonly MIN_SIMULTANEAS = 1;
  readonly MAX_SIMULTANEAS = 5;

  /**
   * El `max` del input frena las flechas, no lo que se teclea ni lo que se pega. El
   * backend vuelve a topar esto mismo; aqui se hace ademas para que lo que se guarda
   * sea lo que el formulario ensena, y no un numero que el servidor corrige a la
   * callada.
   */
  private simultaneasEnRango(n: number | null | undefined): number {
    const v = Math.floor(Number(n));
    if (!Number.isFinite(v) || v < this.MIN_SIMULTANEAS) return this.MIN_SIMULTANEAS;
    return Math.min(v, this.MAX_SIMULTANEAS);
  }
  /**
   * "Modificado por jperez · 10/08 14:32". Vacío si nadie lo ha tocado todavía.
   *
   * Se enseña donde se cambia lo que hace Clara —reglas y tonos— porque hay nueve
   * administradores: sin esto, un cambio en lo que puede pactar el bot no tiene autor.
   */
  firma(x?: { actualizadoPor?: string | null; fechaActualizacion?: string | null }): string {
    if (!x?.actualizadoPor) return '';
    const f = x.fechaActualizacion ? new Date(x.fechaActualizacion) : null;
    const cuando = f && !isNaN(f.getTime())
      ? ` · ${f.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })} `
        + f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
      : '';
    return `Modificado por ${x.actualizadoPor}${cuando}`;
  }

  get topeHoraInicio(): string { return this.hhmm(this.config?.horaInicio) || '08:00'; }
  get topeHoraFin(): string { return this.hhmm(this.config?.horaFin) || '20:00'; }

  /** 0,15 -> "15 %". El número crudo no se lee bien en una frase. */
  pct(v?: number | null): string {
    return v == null ? '—' : `${Math.round(Number(v) * 100)} %`;
  }

  cargarColas(): void {
    this.svc.getColas().subscribe({
      next: (c) => (this.colas = c),
      error: () => this.flash('No se pudieron cargar las colas', true),
    });
  }

  cargarTonos(): void {
    this.svc.getTonos(true).subscribe({
      next: (t) => (this.tonos = t),
      error: () => this.flash('No se pudieron cargar los tonos', true),
    });
  }


  cargarSubcarteras(): void {
    if (this.inquilinos.length) return;          // ya cargados
    this.svc.getProveedores().subscribe({
      next: (t) => (this.inquilinos = t || []),
      error: () => this.flash('No se pudieron cargar los proveedores', true),
    });
  }

  alElegirInquilino(): void {
    this.carteras = [];
    this.subcarteras = [];
    this.idCarteraSel = 0;
    this.nuevaCola.idSubcartera = undefined as any;
    if (!this.idInquilinoSel) return;
    this.svc.getCarteras(this.idInquilinoSel).subscribe({
      next: (c) => (this.carteras = c || []),
      error: () => this.flash('No se pudieron cargar las carteras', true),
    });
  }

  /**
   * Al elegir subcartera se enseñan sus condiciones y se cargan sus campos.
   *
   * Los campos dependen de la subcartera —cada una tiene su tabla dinámica y sus
   * columnas— así que este es el primer momento en que se pueden pedir. Antes vivían
   * en un modal aparte que exigía la cola ya creada.
   */
  alElegirSubcartera(): void {
    if (!this.nuevaCola.idSubcartera) return;
    this.verEfectivas(this.nuevaCola.idSubcartera);
    this.cargarCampos(this.nuevaCola.idSubcartera);
    this.recalcular();
  }

  alElegirCartera(): void {
    this.subcarteras = [];
    this.nuevaCola.idSubcartera = undefined as any;
    // Los campos son de la subcartera anterior: dejarlos puestos ofrecería filtrar por
    // columnas que la nueva cartera no tiene.
    this.olvidarFiltros();
    if (!this.idCarteraSel) return;
    this.svc.getSubcarteras(this.idCarteraSel).subscribe({
      next: (s) => (this.subcarteras = s || []),
      error: () => this.flash('No se pudieron cargar las subcarteras', true),
    });
  }

  abrirModalCola(): void {
    this.editandoCola = undefined;
    this.errorModal = '';
    this.nuevaCola = this.colaVacia();
    this.objRecordatorio = true;
    this.objCreacion = true;
    this.objPrimerContacto = false;
    this.afinarTonos = false;
    this.idInquilinoSel = 0;
    this.idCarteraSel = 0;
    this.carteras = [];
    this.subcarteras = [];
    this.olvidarFiltros();
    this.modalCola = true;
    this.cargarSubcarteras();
    this.cargarRitmos();
  }

  cerrarModalCola(): void {
    this.modalCola = false;
    this.errorModal = '';
    this.editandoCola = undefined;
  }

  /**
   * Abre el formulario con la cola ya cargada.
   *
   * Se edita la MISMA cola, no se crea otra: con una por subcartera, "crear" no es una
   * alternativa a "editar". Antes solo se podia crear y borrar, asi que cambiar un
   * horario obligaba a eliminar la cola —perdiendo lo encolado— y rehacerla.
   */
  editarCola(c: BotCola): void {
    this.editandoCola = c.id;
    this.nuevaCola = { ...c };
    const objs = (c.objetivos || '').split(',').map((o) => o.trim());
    this.objRecordatorio = objs.includes('RECORDATORIO');
    this.objCreacion = objs.includes('CREACION');
    this.objPrimerContacto = objs.includes('PRIMER_CONTACTO');
    // Si la cola ya tiene algun tono por objetivo, el bloque se abre solo: si no, no
    // habria forma de ver lo que hay configurado sin saber que existe el enlace.
    this.afinarTonos = c.idTonoRecordatorio != null
        || c.idTonoVencida != null || c.idTonoPrimera != null;
    // La subcartera no se cambia al editar: cambiarla convertiria esta cola en la de
    // otra cartera, con las filas de la anterior dentro. Para eso se borra y se crea.
    this.cargarRitmos();
    if (c.idSubcartera) this.verEfectivas(c.idSubcartera);

    // Los filtros guardados se pintan como marcados: editar parte de lo que hay, no de
    // cero. El catalogo de campos y las marcas llegan por separado y en el orden que
    // quieran; `pintarFiltrosGuardados` se llama desde las dos y la segunda es la que
    // acaba abriendo los campos.
    this.olvidarFiltros();
    this.idInquilinoSel = c.idInquilino ?? 0;
    this.idCarteraSel = c.idCartera ?? 0;
    if (c.idSubcartera) this.cargarCampos(c.idSubcartera);
    this.svc.getFiltros(c.id!).subscribe({
      next: (f) => {
        for (const x of f) {
          if (!x.selectedValues) continue;
          this.marcados[x.fieldCode] = new Set(this.valoresDe(x.selectedValues));
        }
        this.pintarFiltrosGuardados();
        this.recalcular();
      },
      error: () => this.flash('No se pudieron cargar los filtros', true),
    });
    this.modalCola = true;
  }

  eliminarCola(c: BotCola): void {
    if (!c.id) return;
    if (c.estaDiscando) {
      this.flash('Detén la cola antes de eliminarla', true);
      return;
    }
    if (!confirm(`¿Eliminar la cola "${c.nombre}"? Se borra también lo que tenga pendiente hoy.`)) return;
    this.svc.eliminarCola(c.id).subscribe({
      next: () => { this.cargarColas(); this.cargarCola(true); this.flash('Cola eliminada'); },
      error: () => this.flash('No se pudo eliminar la cola', true),
    });
  }

  crearCola(): void {
    const objetivos = [
      this.objRecordatorio ? 'RECORDATORIO' : null,
      this.objCreacion ? 'CREACION' : null,
      this.objPrimerContacto ? 'PRIMER_CONTACTO' : null,
    ].filter(Boolean).join(',');
    if (!objetivos) {
      this.errorModal = 'Marca al menos una cosa que deba hacer Clara.';
      return;
    }
    this.errorModal = '';
    this.guardandoCola = true;
    // Con el bloque cerrado se limpian los tres: si no, quien lo abre, elige tonos y
    // vuelve a cerrarlo guardaria unos tonos que la pantalla ya no enseña. Lo mismo
    // si se queda con un solo objetivo: ahi el bloque se oculta, y guardar un tono
    // por objetivo que nadie puede ver ni quitar es peor que no guardarlo.
    const porObjetivo = this.afinarTonos && this.hayVariosObjetivos()
      ? {
          idTonoRecordatorio: this.objRecordatorio ? this.nuevaCola.idTonoRecordatorio : null,
          idTonoVencida: this.objCreacion ? this.nuevaCola.idTonoVencida : null,
          idTonoPrimera: this.objPrimerContacto ? this.nuevaCola.idTonoPrimera : null,
        }
      : { idTonoRecordatorio: null, idTonoVencida: null, idTonoPrimera: null };
    // El inquilino y la cartera ya los eligio el usuario en la cascada. Hacen falta
    // para localizar la tabla dinamica de la subcartera, que es de donde salen los
    // clientes sin promesa.
    this.guardarCola({
      ...this.nuevaCola, objetivos, ...porObjetivo,
      maxLlamadasSimultaneas: this.simultaneasEnRango(this.nuevaCola.maxLlamadasSimultaneas),
      idInquilino: this.idInquilinoSel || undefined,
      idCartera: this.idCarteraSel || undefined,
    });
  }

  /** Afinar el tono solo tiene sentido si la cola hace mas de una cosa. */
  hayVariosObjetivos(): boolean {
    return [this.objRecordatorio, this.objCreacion, this.objPrimerContacto]
        .filter(Boolean).length > 1;
  }

  private guardarCola(cola: BotCola): void {
    const peticion = this.editandoCola
      ? this.svc.actualizarCola(this.editandoCola, cola)
      : this.svc.crearCola(cola);
    peticion.subscribe({
      next: (guardada) => {
        const editaba = !!this.editandoCola;
        // Los filtros van en una segunda petición porque son otra tabla, pero forman
        // parte del mismo guardado: se eligen en este formulario y sin ellos la cola
        // quedaría trayendo la cartera entera. Al crear hace falta el id que acaba de
        // devolver el backend.
        const idCola = this.editandoCola ?? guardada?.id;
        const terminar = () => {
          this.guardandoCola = false;
          this.nuevaCola = this.colaVacia();
          this.olvidarFiltros();
          this.modalCola = false;
          this.editandoCola = undefined;
          this.cargarColas();
          this.flash(editaba ? 'Cola actualizada' : 'Cola creada');
        };
        if (!idCola) { terminar(); return; }
        this.svc.guardarFiltros(idCola, this.filtrosDeLoMarcado()).subscribe({
          next: () => terminar(),
          error: () => {
            // La cola sí quedó guardada: decirlo es más útil que un "no se pudo" a
            // secas, que haría pensar que hay que volver a crearla.
            terminar();
            this.flash('La cola se guardó, pero no se pudieron guardar sus filtros', true);
          },
        });
      },
      error: (e) => {
        this.guardandoCola = false;
        // Se queda EN el formulario. Antes salía como aviso de página y el modal lo
        // tapaba: parecía que el botón no hacía nada.
        this.errorModal =
          e?.status === 409 ? 'Esa subcartera ya tiene una cola. Edita la que hay.'
          : e?.status === 403 ? 'No tienes permiso sobre esa subcartera.'
          : e?.status === 400 ? 'Faltan datos: revisa el nombre y la subcartera.'
          : 'No se pudo guardar la cola. Vuelve a intentarlo.';
      },
    });
  }

  armarColaDe(c: BotCola): void {
    if (!c.id) return;
    this.armandoCola = c.id;
    this.svc.armarColaDe(c.id).subscribe({
      next: (r) => {
        this.armandoCola = undefined;
        this.cargarColas();
        this.flash(`Encolados ${r?.encolados ?? 0}`
          + (r?.primerContacto ? `, ${r.primerContacto} sin promesa previa` : ''));
      },
      error: () => {
        this.armandoCola = undefined;
        this.flash('No se pudo armar la cola', true);
      },
    });
  }

  /** Un solo boton que alterna, como el de la cabecera. Parar no pierde lo encolado. */
  alternarCola(c: BotCola): void {
    if (!c.id) return;
    const accion = c.estaDiscando ? this.svc.detenerCola(c.id) : this.svc.iniciarCola(c.id);
    accion.subscribe({
      next: (actualizada) => {
        c.estaDiscando = actualizada.estaDiscando;
        this.flash(c.estaDiscando ? 'Cola iniciada' : 'Cola detenida');
      },
      error: () => this.flash('No se pudo cambiar el estado de la cola', true),
    });
  }

  /**
   * Los cinco estados de una cola. Son cinco y no dos porque hay tres formas
   * distintas de "no está llamando" y cada una se arregla de otra manera: esperar,
   * volver a armar, o darle a Iniciar.
   */
  estadoCola(c: BotCola): { texto: string; clase: string; ayuda: string } {
    if (!c.estaDiscando) {
      if (c.motivoPausa) {
        return { texto: 'Detenida por el sistema', clase: 'st-alerta',
                 ayuda: c.motivoPausa };
      }
      if (!c.ultimaArmadaAt) {
        return { texto: 'Borrador', clase: 'st-borrador',
                 ayuda: 'Creada pero nunca armada. Dale a Armar para llenarla.' };
      }
      return { texto: 'Pausada', clase: 'st-pausada',
               ayuda: 'La detuvo una persona. Dale a Iniciar para reanudar.' };
    }
    if (!this.dentroDeHorario(c)) {
      return { texto: 'Fuera de horario', clase: 'st-espera',
               ayuda: this.porQueFueraDeHorario(c) };
    }
    if (this.pendientesDe(c) === 0) {
      return { texto: 'Cola agotada', clase: 'st-espera',
               ayuda: 'No quedan clientes por marcar hoy. Vuelve a armarla.' };
    }
    return { texto: 'Discando', clase: 'st-discando', ayuda: 'Marcando ahora mismo.' };
  }

  /** Por qué no puede marcar ahora. Sin esto, "fuera de horario" no dice si es la
   *  hora o el día, que se arreglan distinto. */
  private porQueFueraDeHorario(c: BotCola): string {
    const ahora = new Date();
    const dias = c.diasSemana || this.config?.diasSemana || '';
    const hoy = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][ahora.getDay()];
    if (dias && !dias.toUpperCase().split(',').map((d) => d.trim()).includes(hoy)) {
      return `Hoy no se marca: la ventana permitida es ${dias}. Vuelve el próximo día hábil.`;
    }
    const desde = (c.horaInicio || this.config?.horaInicio || '').slice(0, 5);
    const hasta = (c.horaFin || this.config?.horaFin || '').slice(0, 5);
    return `Fuera del horario ${desde}–${hasta}. Sigue sola cuando vuelva a abrirse.`;
  }

  /** Filas de HOY de esa cola que todavía se pueden marcar. */
  pendientesDe(c: BotCola): number {
    return this.cola.filter((f) => f.idCola === c.id &&
      (f.estado === 'PENDIENTE' || f.estado === 'EN_LLAMADA')).length;
  }

  /**
   * ¿Puede marcar ahora mismo?
   *
   * Mira el horario de la cola Y el que hereda. Antes solo miraba el suyo, y una cola
   * que lo tiene vacío —lo normal— nunca daba "fuera de horario": decía "Discando" un
   * domingo a las ocho de la tarde sin marcar nada y sin explicar por qué.
   */
  private dentroDeHorario(c: BotCola): boolean {
    const ahora = new Date();
    const hhmm = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const desde = (c.horaInicio || this.config?.horaInicio || '').slice(0, 5);
    const hasta = (c.horaFin || this.config?.horaFin || '').slice(0, 5);
    if (desde && hhmm < desde) return false;
    if (hasta && hhmm > hasta) return false;
    // Los días también se heredan. Es lo que faltaba: el tope legal es de lunes a
    // viernes y el fin de semana no se marca.
    const dias = c.diasSemana || this.config?.diasSemana || '';
    if (dias) {
      const hoy = ['D', 'L', 'M', 'X', 'J', 'V', 'S'][ahora.getDay()];
      if (!dias.toUpperCase().split(',').map((d) => d.trim()).includes(hoy)) return false;
    }
    return true;
  }

  /** El estado de la fila, en castellano. "EN_LLAMADA" no es una palabra. */
  situacionFila(estado?: string): string {
    switch (estado) {
      case 'PENDIENTE':  return 'Por marcar';
      case 'EN_LLAMADA': return 'Llamando ahora';
      case 'COMPLETADA': return 'Ya se llamó';
      case 'DESCARTADA': return 'Descartada';
      default:           return estado || '—';
    }
  }

  /** Por qué está ese cliente en la cola, dicho para una persona. */
  motivoLlamada(objetivo?: string): string {
    switch (objetivo) {
      case 'RECORDATORIO':    return 'Recordarle una cuota por vencer';
      case 'CREACION':        return 'Negociar una cuota vencida';
      case 'PRIMER_CONTACTO': return 'Abrir su primera promesa';
      default:                return '—';
    }
  }

  verDetalle(c: BotCola): void {
    this.detalleDe = this.detalleDe === c.id ? undefined : c.id;
    this.busquedaDetalle = '';
    this.paginaDetalle = 1;
    if (this.detalleDe) this.cargarCola();   // trae también los descartes
  }

  // ---- El detalle de una cola: buscador y paginado ----
  //
  // La cola de castigo trae ~9.800 filas. Pintarlas todas cuelga el navegador, y sin
  // buscador la unica forma de encontrar a alguien es bajar por la lista.

  busquedaDetalle = '';
  paginaDetalle = 1;
  readonly POR_PAGINA_DETALLE = 5;

  /** Lo encolado hoy por ESA cola, ya filtrado por lo que se haya escrito. */
  filasDe(c: BotCola): BotContacto[] {
    const q = this.busquedaDetalle.trim().toLowerCase();
    return this.cola.filter((f) => {
      if (f.idCola !== c.id) return false;
      if (!q) return true;
      // Documento, nombre o telefono: los tres campos por los que se busca a alguien.
      return (f.documento || '').toLowerCase().includes(q)
          || (f.nombreCliente || '').toLowerCase().includes(q)
          || (f.telefono || '').includes(q);
    });
  }

  /** La pagina que se pinta. */
  filasDePagina(c: BotCola): BotContacto[] {
    const todas = this.filasDe(c);
    const total = this.paginasDetalle(c);
    if (this.paginaDetalle > total) this.paginaDetalle = total;
    const desde = (this.paginaDetalle - 1) * this.POR_PAGINA_DETALLE;
    return todas.slice(desde, desde + this.POR_PAGINA_DETALLE);
  }

  paginasDetalle(c: BotCola): number {
    return Math.max(1, Math.ceil(this.filasDe(c).length / this.POR_PAGINA_DETALLE));
  }

  pasarPagina(c: BotCola, delta: number): void {
    this.paginaDetalle = Math.min(Math.max(1, this.paginaDetalle + delta), this.paginasDetalle(c));
  }

  /** Buscar reinicia la pagina: si no, buscas y te quedas en una pagina que ya no existe. */
  alBuscarEnDetalle(): void { this.paginaDetalle = 1; }

  nombreSubcartera(id?: number): string {
    // El nombre viaja con la cola, así que no hace falta ninguna lista aparte: en
    // cuanto la tarjeta existe, su nombre existe. Antes salía "#27" hasta que llegara
    // una segunda petición, y si fallaba se quedaba así.
    const deLaCola = this.colas.find((c) => c.idSubcartera === id)?.nombreSubcartera;
    if (deLaCola) return deLaCola;
    const s = this.subcarteras.find((x) => x.id === id);
    return s ? (s.nombreSubcartera || `#${id}`) : `#${id ?? '—'}`;
  }

  nombreTono(id?: number | null): string {
    if (!id) return 'Clara (por defecto)';
    return this.tonos.find((t) => t.id === id)?.nombre ?? `#${id}`;
  }

  objetivosDe(c: BotCola): string[] {
    const bonito: Record<string, string> = {
      RECORDATORIO: 'Recordar',
      CREACION: 'Negociar',
      PRIMER_CONTACTO: '1ª promesa',
    };
    return (c.objetivos || '').split(',').filter(Boolean).map((o) => bonito[o.trim()] ?? o);
  }

  // ----- Reglas -----

  // ---- Cascada de Reglas ----
  //
  // Estado propio, separado del alta de una cola. Compartirlo haria que elegir una
  // cartera aqui dejara el formulario de la cola a medio rellenar la proxima vez que
  // se abriera, y viceversa.
  regProveedores: any[] = [];
  regCarteras: any[] = [];
  regSubcarteras: any[] = [];
  regProveedorSel = 0;
  regCarteraSel = 0;

  cargarProveedoresReglas(): void {
    if (this.regProveedores.length) return;
    this.svc.getProveedores().subscribe({
      next: (p) => (this.regProveedores = p || []),
      error: () => this.flash('No se pudieron cargar los proveedores', true),
    });
  }

  regAlElegirProveedor(): void {
    this.regCarteras = [];
    this.regSubcarteras = [];
    this.regCarteraSel = 0;
    this.subcarteraMirada = undefined;
    this.reglasEfectivas = undefined;
    if (!this.regProveedorSel) return;
    this.svc.getCarteras(this.regProveedorSel).subscribe({
      next: (c) => (this.regCarteras = c || []),
      error: () => this.flash('No se pudieron cargar las carteras', true),
    });
  }

  regAlElegirCartera(): void {
    this.regSubcarteras = [];
    this.subcarteraMirada = undefined;
    this.reglasEfectivas = undefined;
    if (!this.regCarteraSel) return;
    this.svc.getSubcarteras(this.regCarteraSel).subscribe({
      next: (s) => (this.regSubcarteras = s || []),
      error: () => this.flash('No se pudieron cargar las subcarteras', true),
    });
  }

  cargarReglas(): void {
    this.svc.getReglas().subscribe({
      next: (r) => (this.reglas = r),
      error: () => this.flash('No se pudieron cargar las reglas', true),
    });
  }

  /** Lo que rige hoy, que no siempre es lo que hay guardado en su fila. */
  verEfectivas(idSubcartera?: number): void {
    this.subcarteraMirada = idSubcartera;
    this.svc.getReglasEfectivas(idSubcartera).subscribe({
      next: (r) => (this.reglasEfectivas = r),
      error: () => this.flash('No se pudieron resolver las reglas', true),
    });
  }

  guardarRegla(r: BotRegla): void {
    const obs = r.id ? this.svc.actualizarRegla(r.id, r) : this.svc.crearRegla(r);
    obs.subscribe({
      next: (g) => { r.id = g.id; this.flash('Reglas guardadas'); },
      error: () => this.flash('No se pudo guardar. ¿Ya hay una fila por defecto?', true),
    });
  }

  // ----- Filtros: a qué parte de la cartera se llama -----
  //
  // Van por SUBCARTERA y viven dentro del formulario, junto a los objetivos. Antes
  // eran un modal aparte que colgaba de `/colas/{id}`, así que había que crear la cola
  // primero y volver después: dos pasos para una sola decisión —a quién llamamos—.
  //
  // Y no filtraban. Los filtros solo se leían en la rama de primera promesa del
  // armado; recordatorios y vencidas salen de `cuotas_promesa` y no los recibían, así
  // que marcabas "solo LTD" y la cola seguía trayendo nueve mil. Eso se arregló en el
  // backend; aquí lo que cambia es que se ven donde se decide.

  /** Borra todo rastro de los filtros de otra cola u otra cartera. */
  private olvidarFiltros(): void {
    this.camposDe = undefined;
    this.campos = [];
    this.agregados = [];
    this.campoAAgregar = '';
    this.marcados = {};
    this.enCurso.clear();
    this.cargandoCampos = false;
    this.cargandoValores = false;
    this.entran = undefined;
    this.errorPreview = '';
    clearTimeout(this.timerPreview);
  }

  /** Catálogo de campos segmentables. Sin valores: esos se piden campo a campo. */
  campos: any[] = [];
  cargandoCampos = false;
  /** Los campos que el usuario ha añadido, ya con sus valores cargados. */
  agregados: any[] = [];
  campoAAgregar = '';
  cargandoValores = false;
  /** Campos cuyos valores están pedidos y aún no han vuelto. */
  private enCurso = new Set<string>();
  /** Valores marcados, por campo. Es lo que se convierte en filtros al guardar. */
  marcados: Record<string, Set<string>> = {};
  /** La subcartera cuyos campos están cargados. Descarta respuestas que llegan tarde. */
  private camposDe?: number;

  /**
   * Cuánta gente entra con lo que hay marcado ahora. Se recalcula solo.
   *
   * Antes esto era un botón "Ver cuántos entran" y tres números sueltos por la
   * pantalla: los valores de cada chip, el número de valores de cada campo y este.
   * Ninguno contaba lo que iba a entrar de verdad. Ahora hay uno, sale del mismo
   * código que arma la cola, y se refresca al tocar cualquier cosa que lo cambie.
   */
  entran?: number;
  calculando = false;
  errorPreview = '';
  private timerPreview?: any;

  /** Carga los campos de la subcartera elegida. Idempotente: no recarga la misma. */
  private cargarCampos(idSubcartera?: number): void {
    if (!idSubcartera || !this.idInquilinoSel || !this.idCarteraSel) return;
    if (this.camposDe === idSubcartera) return;
    this.camposDe = idSubcartera;
    this.campos = [];
    this.agregados = [];
    this.campoAAgregar = '';
    this.enCurso.clear();
    this.cargandoCampos = true;
    this.svc.getCampos(this.idInquilinoSel, this.idCarteraSel, idSubcartera).subscribe({
      next: (cs) => {
        if (this.camposDe !== idSubcartera) return;
        this.campos = cs || [];
        this.cargandoCampos = false;
        this.pintarFiltrosGuardados();
      },
      error: () => {
        if (this.camposDe !== idSubcartera) return;
        this.cargandoCampos = false;
        this.flash('No se pudieron cargar los campos', true);
      },
    });
  }

  /**
   * Deja abiertos los campos que ya tenían filtro guardado.
   *
   * Hacen falta las dos cosas y llegan en el orden que quieran: el catálogo dice cómo
   * se llama el campo, los filtros dicen cuáles estaban puestos. La que llegue segunda
   * es la que acaba pintando.
   */
  private pintarFiltrosGuardados(): void {
    if (this.cargandoCampos || !this.campos.length) return;
    for (const codigo of Object.keys(this.marcados)) {
      if (this.agregados.some((a) => a.codigo === codigo)) continue;
      const campo = this.campos.find((c) => c.codigo === codigo);
      if (campo) this.cargarValores(campo);
    }
  }

  /** Los que aún no están puestos: añadir dos veces el mismo campo no significa nada. */
  camposDisponibles(): any[] {
    return this.campos.filter((c) => !this.agregados.some((a) => a.codigo === c.codigo));
  }

  agregarFiltro(): void {
    const campo = this.campos.find((c) => c.codigo === this.campoAAgregar);
    if (!campo) return;
    this.cargarValores(campo);
    this.campoAAgregar = '';
  }

  /**
   * Trae los valores de ese campo y lo añade a la lista de puestos.
   *
   * Los dos guardas no son adorno. `enCurso` evita que el mismo campo se pida dos veces
   * antes de que vuelva la primera —el `agregados.some()` de quien llama no sirve,
   * porque `agregados` no se llena hasta la respuesta— y la comparación con `camposDe`
   * descarta lo que llega tarde: cambiar de subcartera dejaba entrar los valores de la
   * anterior en la nueva.
   */
  private cargarValores(campo: any): void {
    const sub = this.camposDe;
    if (!sub || !this.idInquilinoSel || !this.idCarteraSel) return;
    if (this.enCurso.has(campo.codigo)) return;
    this.enCurso.add(campo.codigo);
    this.cargandoValores = true;
    this.svc.getValoresDeCampo(this.idInquilinoSel, this.idCarteraSel, sub, campo.codigo).subscribe({
      next: (vs) => {
        this.enCurso.delete(campo.codigo);
        this.cargandoValores = this.enCurso.size > 0;
        if (this.camposDe !== sub) return;                   // llegó tarde: otra subcartera
        if (this.agregados.some((a) => a.codigo === campo.codigo)) return;
        this.agregados.push({ ...campo, valores: vs || [] });
      },
      error: () => {
        this.enCurso.delete(campo.codigo);
        this.cargandoValores = this.enCurso.size > 0;
        if (this.camposDe !== sub) return;
        this.flash(`No se pudieron leer los valores de ${campo.etiqueta}`, true);
      },
    });
  }

  /** Quita el campo de la pantalla y con él sus marcas: si no está, no filtra. */
  quitarFiltro(codigo: string): void {
    this.agregados = this.agregados.filter((a) => a.codigo !== codigo);
    delete this.marcados[codigo];
    this.recalcular();
  }

  estaMarcado(campo: string, valor: string): boolean {
    return this.marcados[campo]?.has(valor) ?? false;
  }

  alternarValor(campo: string, valor: string): void {
    const set = this.marcados[campo] ?? new Set<string>();
    if (set.has(valor)) set.delete(valor); else set.add(valor);
    if (set.size) this.marcados[campo] = set; else delete this.marcados[campo];
    this.recalcular();
  }

  /** Cuántos marcados lleva un campo. Nada marcado = ese campo no filtra. */
  marcadosDe(campo: string): number {
    return this.marcados[campo]?.size ?? 0;
  }

  /** Cuántas condiciones acabarían aplicándose. */
  get camposFiltrando(): number {
    return Object.keys(this.marcados).length;
  }

  /**
   * Vuelve a contar, medio segundo después del último cambio.
   *
   * La espera no es cosmética: cada conteo recorre el mismo camino que el armado. Sin
   * ella, marcar cinco valores seguidos dispara cinco recorridos completos y solo
   * importa el último. Lo llaman los objetivos, el ritmo y cada casilla de filtro.
   */
  recalcular(): void {
    this.entran = undefined;
    this.errorPreview = '';
    clearTimeout(this.timerPreview);
    const sub = this.nuevaCola.idSubcartera;
    const objetivos = this.objetivosMarcados();
    if (!sub || !objetivos || !this.idInquilinoSel || !this.idCarteraSel) return;
    this.calculando = true;
    this.timerPreview = setTimeout(() => {
      this.svc.preview(sub, {
        idCola: this.editandoCola ?? null,
        idInquilino: this.idInquilinoSel,
        idCartera: this.idCarteraSel,
        objetivos,
        modoRitmo: this.nuevaCola.modoRitmo,
        idRitmo: this.nuevaCola.idRitmo,
        filtros: this.filtrosDeLoMarcado(),
      }).subscribe({
        next: (r) => {
          this.calculando = false;
          // Que hoy no haya ritmo vigente no es un fallo de la aplicación: es algo que
          // el admin tiene que arreglar en el calendario, y se dice tal cual.
          if (r?.error) { this.errorPreview = r.error; return; }
          this.entran = r.entran ?? 0;
        },
        error: () => { this.calculando = false; this.errorPreview = 'No se pudo calcular'; },
      });
    }, 500);
  }

  /** Los objetivos en la forma que entiende el backend. Vacío = la cola no trae a nadie. */
  private objetivosMarcados(): string {
    return [
      this.objRecordatorio ? 'RECORDATORIO' : null,
      this.objCreacion ? 'CREACION' : null,
      this.objPrimerContacto ? 'PRIMER_CONTACTO' : null,
    ].filter(Boolean).join(',');
  }

  /** Lo marcado, en la forma que entiende el backend. Lo usan contar y guardar. */
  private filtrosDeLoMarcado(): BotColaFiltro[] {
    // Un campo sin nada marcado no genera filtro: no filtrar es distinto de filtrar
    // por nada.
    return Object.entries(this.marcados)
      .filter(([, vals]) => vals.size > 0)
      .map(([fieldCode, vals]) => ({
        fieldCode, dataType: 'TEXTO', selectedValues: JSON.stringify([...vals]),
      }));
  }

  /**
   * Los valores marcados de un filtro, vengan como vengan.
   *
   * Se guardan en JSON y NO separados por comas, porque los valores de la cartera las
   * llevan dentro: marcar "2.<500 - 1,000]" se partia en "2.<500 - 1" y "000]", y el
   * filtro no encontraba a nadie. Toda la columna `rango_capital` estaba rota asi, y
   * el formulario lo enseñaba como "Entran 0" sin decir por que.
   *
   * Se sigue leyendo el formato viejo: las colas ya guardadas no se migran solas.
   */
  private valoresDe(s: string | null | undefined): string[] {
    const t = (s || '').trim();
    if (!t) return [];
    if (t.startsWith('[')) {
      try {
        const a = JSON.parse(t);
        if (Array.isArray(a)) return a.map((v) => String(v));
      } catch { /* no era JSON: se lee como lista separada por comas */ }
    }
    return t.split(',').map((v) => v.trim()).filter(Boolean);
  }

  // ----- Tonos -----


  guardarTono(t: BotTono): void {
    const obs = t.id ? this.svc.actualizarTono(t.id, t) : this.svc.crearTono(t);
    obs.subscribe({
      next: (guardado) => { t.id = guardado.id; this.flash('Tono guardado'); },
      error: () => this.flash('No se pudo guardar el tono', true),
    });
  }

  /**
   * Genera y reproduce una frase con ESE tono.
   *
   * La frase la escribe el bot con el estilo configurado, no es un texto fijo: la
   * diferencia entre un tono y otro esta sobre todo en las palabras, y una frase
   * fija sonaria igual con todos los tonos.
   */
  escuchar(t: BotTono): void {
    // Ya no hace falta guardar antes: se prueba lo que hay en pantalla.
    // Si ya suena algo, este clic lo para y no pide nada mas: el boton es el mismo
    // para escuchar y para cortar.
    if (this.demoSonando != null) { this.pararDemo(); return; }
    if (this.demoCargando != null) return;          // ya hay una muestra en camino

    this.demoCargando = t.id ?? -1;
    this.svc.demoTono(t).subscribe({
      next: (d) => {
        const clave = t.id ?? -1;
        this.demoCargando = undefined;
        this.demoTexto[clave] = d?.texto ?? '';
        // Solo se factura la primera vez con esos ajustes; luego sale de la cache
        // del micro. Se enseña para que nadie tenga que adivinar cuando gasta.
        this.demoCacheada[clave] = d?.cacheada === true;
        if (!d?.audioBase64) {
          this.flash(d?.error || 'Se generó la frase pero no el audio', true);
          return;
        }
        const audio = new Audio(`data:audio/wav;base64,${d.audioBase64}`);
        this.demoAudio = audio;
        this.demoSonando = clave;
        // Los tres caminos por los que deja de sonar: termina, falla o lo paran.
        audio.onended = () => this.pararDemo();
        audio.onerror = () => { this.pararDemo(); this.flash('No se pudo reproducir', true); };
        audio.play().catch(() => {
          this.pararDemo();
          this.flash('El navegador bloqueó la reproducción', true);
        });
      },
      error: () => {
        this.demoCargando = undefined;
        this.flash('No se pudo generar la muestra', true);
      },
    });
  }

  /** El género lo dice la voz elegida; no es un campo aparte que pueda contradecirla. */
  alElegirVoz(t: BotTono): void {
    const v = this.VOCES.find((x) => x.id === t.voiceId);
    if (v) { t.vozEtiqueta = v.nombre; t.generoVoz = v.genero; }
  }

  pararDemo(): void {
    if (this.demoAudio) {
      this.demoAudio.pause();
      this.demoAudio.currentTime = 0;
    }
    this.demoAudio = undefined;
    this.demoSonando = undefined;
  }

  /** Texto del boton: escuchar, generando o parar. */
  textoEscuchar(t: BotTono): string {
    const clave = t.id ?? -1;
    if (this.demoCargando === clave) return 'Generando…';
    if (this.demoSonando === clave) return 'Detener';
    return 'Escuchar';
  }

  /** Solo se bloquean los OTROS: el del audio que suena tiene que poder pararlo. */
  escucharBloqueado(t: BotTono): boolean {
    const clave = t.id ?? -1;
    if (this.demoCargando != null) return this.demoCargando !== clave;
    if (this.demoSonando != null) return this.demoSonando !== clave;
    return false;
  }

  // ----- Config -----
  cargarPermisos(): void {
    this.svc.getPermisos().subscribe({
      next: (p) => {
        this.esAdmin = !!p.admin;
        this.puedeTecnico = !!p.configuracionTecnica;
        this.misSubcarteras = p.subcarteras || [];
      },
      // Sin permisos resueltos se asume lo mas restrictivo: es preferible que falte un
      // boton a que aparezca uno que el servidor va a rechazar.
      error: () => { this.esAdmin = false; this.puedeTecnico = false; this.misSubcarteras = []; },
    });
  }

  /**
   * ¿Puede crear una cola? Un admin siempre. Un supervisor solo si le queda alguna
   * subcartera suya sin cola — porque es una por subcartera.
   */
  get puedeCrearCola(): boolean {
    if (this.esAdmin) return true;
    const conCola = new Set(this.colas.map((c) => c.idSubcartera));
    return this.misSubcarteras.some((id) => !conCola.has(id));
  }

  get motivoNoCrear(): string {
    if (!this.misSubcarteras.length) {
      return 'No tienes ninguna subcartera asignada, así que no hay cola que crear.';
    }
    return 'Ya existe la cola de tu subcartera. Edítala en vez de crear otra.';
  }

  cargarConfig(): void {
    this.svc.getConfig().subscribe({
      next: (c) => this.fijarConfig(c),
      error: () => this.flash('No se pudo cargar la configuración', true),
    });
  }

  private fijarConfig(c: BotConfig): void {
    // El backend devuelve LocalTime con segundos ("11:00:00") y las opciones
    // del select son "HH:MM". Sin recortar, ninguna opcion coincide con el
    // valor del ngModel y los dos desplegables salen en blanco.
    c.horaInicio = this.hhmm(c.horaInicio);
    c.horaFin = this.hhmm(c.horaFin);
    this.config = c;
    // La copia de referencia se toma ya normalizada: si no, el recorte de los
    // segundos contaria como un cambio sin guardar apenas abres la pantalla.
    this.configGuardada = JSON.stringify(c);
  }


  // ----- Ritmos -----
  cargarRitmos(): void {
    this.svc.getRitmos().subscribe((p) => {
      this.ritmos = p;
      this.ritmosGuardados = new Map(p.map((x) => [x.id, JSON.stringify(x)]));
    });
  }
  /** Mismo problema que la config: sin esto editas un ritmo, no le das a
   *  guardar y el cambio se pierde sin ningun aviso. */
  ritmoSinGuardar(p: BotRitmo): boolean {
    const guardado = this.ritmosGuardados.get(p.id);
    return guardado !== undefined && guardado !== JSON.stringify(p);
  }
  guardarRitmo(p: BotRitmo): void {
    this.svc.actualizarRitmo(p.id, p).subscribe({
      next: (r) => {
        Object.assign(p, r);
        this.ritmosGuardados.set(p.id, JSON.stringify(p));
        this.flash(`Ritmo ${p.nombre} guardado`);
      },
      error: () => this.flash('Error al guardar ritmo', true),
    });
  }

  // ----- Detalle de una llamada -----
  sesionAbierta?: BotSesion;
  turnos: BotTurno[] = [];
  cargandoTurnos = false;

  abrirDetalle(s: BotSesion): void {
    this.sesionAbierta = s;
    this.turnos = [];
    this.cargandoTurnos = true;
    this.svc.getTurnos(s.id).subscribe({
      next: (t) => { this.turnos = t; this.cargandoTurnos = false; },
      error: () => { this.cargandoTurnos = false; this.flash('No se pudo cargar la transcripción', true); },
    });
  }
  cerrarDetalle(): void {
    this.sesionAbierta = undefined;
    this.turnos = [];
  }

  // ----- Cola -----
  // El armado global se elimino: la cola del dia SIEMPRE es la de una cola concreta.
  // Habia dos botones para lo mismo —"Armar cola del dia" y "Armar" en cada fila— y
  // el global no sabia a que subcartera llamaba, asi que mezclaba todas.

  /** silencioso: sin spinner, para que el refresco automatico no parpadee. */
  cargarCola(silencioso = false): void {
    this.loadingCola = !silencioso;
    this.svc.getCola().subscribe({
      next: (c) => { this.cola = c; this.errorCola = false; this.loadingCola = false; },
      error: () => {
        // Sin esto un 500 se veia igual que una cola vacia: la tabla mostraba
        // "La cola esta vacia" mientras en la BD habia 4 filas.
        this.errorCola = true;
        this.loadingCola = false;
        if (!silencioso) this.flash('No se pudo cargar la cola', true);
      },
    });
    this.svc.getDescartes().subscribe({
      next: (d) => (this.descartes = d),
      error: () => (this.descartes = []),
    });
  }
  contar(estado: string): number {
    return this.cola.filter((c) => c.estado === estado).length;
  }

  // ----- Llamadas (monitoreo) -----
  cargarSesiones(): void {
    this.svc.getSesiones().subscribe({
      next: (s) => { this.sesiones = s; this.errorSesiones = false; },
      error: () => { this.errorSesiones = true; this.flash('No se pudieron cargar las llamadas', true); },
    });
    // Los contadores van aparte porque son de TODO el día y la tabla solo de las 100
    // últimas. Si esta falla no se avisa: la pantalla sirve igual sin las pastillas,
    // y un aviso rojo por unos contadores tapa el que sí importa, el de la tabla.
    this.svc.getResumenSesiones().subscribe({
      next: (r) => (this.resumenLlamadas = r),
      error: () => (this.resumenLlamadas = null),
    });
  }

  /**
   * Aviso efimero. El segundo argumento decide el color.
   *
   * Estaba como `_error` y no se usaba: todas las llamadas pasaban `true` para los
   * fallos y salian igual de verdes que un guardado correcto. "No se pudieron cargar
   * las subcarteras" en verde se lee como que fue bien.
   */
  private flash(m: string, error = false): void {
    this.mensaje = m;
    this.mensajeEsError = error;
    setTimeout(() => { this.mensaje = ''; this.mensajeEsError = false; }, 3500);
  }
}
