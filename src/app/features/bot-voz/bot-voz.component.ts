import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  BotVozService, BotConfig, BotContacto, BotSesion, BotTurno,
  BotCola, BotTono, BotRegla, BotColaRegla, BotColaFiltro, ResumenLlamadas,
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
   * Voces y reglas se abren desde los botones de la cabecera y vuelven aquí.
   *
   * La vista 'ritmo' desaparecio con la tabla `bot_ritmo`: era un calendario unico
   * para todas las carteras, asi que quien bajaba ahi los intentos se los bajaba a las
   * colas de los demas. Esos numeros se editan hoy dentro de cada cola.
   */
  vista: 'colas' | 'tonos' | 'reglas' | 'llamadas' = 'colas';

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

  // `afinarTonos` y los tres selectores de tono por objetivo se fueron: el bloque
  // pedia `hayVariosObjetivos()` para pintarse, asi que con un objetivo por cola era
  // pantalla inalcanzable — ni rota ni visible, y sin forma de quitar lo que hubiera
  // guardado.

  /**
   * El objetivo de la cola. Uno solo, y sin valor por defecto.
   *
   * Antes eran tres casillas que se juntaban con comas, dos de ellas marcadas de
   * salida. Elegir a que viene una cola es una decision de negocio y ninguna de las
   * tres es "la normal": preseleccionar dos hacia que una cola creada de corrido
   * saliera recordando y negociando sin que nadie lo hubiera pedido.
   */
  objetivo: string = '';

  nuevaCola: BotCola = this.colaVacia();
  /** El formulario de alta vive en un modal, como el de campañas. */
  modalCola = false;
  /** Id de la cola que se está editando. undefined = se está creando una nueva. */
  editandoCola?: number;
  /** El fallo al guardar, DENTRO del formulario. El aviso de arriba queda detrás del
   *  modal y no se ve: el error tiene que estar donde está el usuario. */
  errorModal = '';

  // ----- Condiciones de negociación de la cola (bloque 5 del formulario) -----
  //
  // Van en el alta de la cola y no en la pantalla de reglas porque son de ESTA cola:
  // las de la pantalla de reglas son de la subcartera entera. Hasta ahora solo se
  // tocaban por SQL y son lo que cambia cada semana, así que un cambio de curva
  // obligaba a pedirle a alguien que entrara a la base.

  /** Sobre qué saldo se calcula el descuento. Es un desplegable y no un campo libre:
   *  el nombre de la columna se lo inventa nadie, y una errata deja a Clara sin base
   *  sobre la que descontar. */
  readonly CAMPOS_BASE = [
    { valor: 'sld_capital_asig', nombre: 'Capital' },
    { valor: 'sld_total_asig', nombre: 'Deuda total' },
  ];

  reglaCola: BotColaRegla = this.reglaColaVacia();

  /** La cola no tiene condiciones propias y usa las de su subcartera: el GET devolvió
   *  204. Solo sirve para avisarlo; no bloquea nada. */
  reglaHeredada = false;

  /** El fallo de la curva, pegado a SU campo. Un error de formato en un texto que se
   *  teclea a mano tiene que señalar dónde está, no salir en el pie del modal. */
  errorCurva = '';

  /** El mismo criterio que aplica el backend antes de devolver 400. */
  static readonly ERROR_CURVA =
    'Escribe porcentajes entre 0 y 100 separados por comas, por ejemplo 70,80,90';

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
  /** Las filas de la cola cuyo detalle esta abierto. Ya no es "la cola de hoy" de
   *  todas juntas: se piden por `idCola` y solo al abrir el ojo. */
  cola: BotContacto[] = [];
  descartes: any[] = [];
  sesiones: BotSesion[] = [];

  /**
   * Como esta cada cola, contado en la BASE e indexado por id.
   *
   * Antes cada tarjeta contaba sus pendientes filtrando en el navegador la cola del
   * dia entera. Sin dias eso seria bajarse todas las filas de todas las colas cada
   * cinco segundos para pintar un numero al lado de "Armada".
   */
  contadores: Record<number, { pendientes: number; enLlamada: number;
                               completadas: number; descartadas: number; total: number }> = {};

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
    // Los contadores alimentan el indicador de la cabecera y el "por marcar" de cada
    // tarjeta. Antes eso salia de traerse la cola del dia entera y contarla aqui.
    this.cargarContadores();
    this.refresco = setInterval(() => this.refrescar(), this.REFRESCO_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
    this.pararDemo();       // si no, la muestra sigue sonando al cambiar de pantalla
  }

  /**
   * Recargar las COLAS cada cinco segundos es obligatorio, no una comodidad.
   *
   * El estado de una cola lo cambia el servidor solo: el discador la pasa a FINALIZADA
   * en cuanto no le queda ninguna fila viva. Sin esta recarga la tarjeta se quedaria
   * diciendo "Discando" para siempre, sobre una cola que ya no marca a nadie. De paso
   * mata la trampa del `motivoPausa` rancio despues de Iniciar o Detener, que se
   * quedaba acusando a un fallo de hace tres dias.
   *
   * La config no se recarga: pisaria lo que el usuario esta editando.
   */
  private refrescar(): void {
    this.cargarColas();
    this.cargarContadores();
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

  /**
   * La cola cuyas llamadas se están viendo. null = todas.
   *
   * Con una sola cola daba igual; con castigo y propia discando a la vez, la tabla las
   * mezclaba y no se podía leer ninguna: son dos guiones distintos, dos importes
   * distintos y dos canales de pago distintos. El filtro va al servidor, como el de las
   * pastillas, para que el contador y las filas hablen de lo mismo.
   */
  colaLlamadas: number | null = null;

  /**
   * El selector de dia se retiro, y con el `fechaLlamadas` y su setter.
   *
   * Existia porque las pastillas contaban HOY y la tabla enseñaba las 100 ultimas de
   * siempre, y la pantalla se contradecia sola. La solucion de entonces fue atar las
   * dos a un dia; la de ahora es quitar el dia de en medio: una cola vive hasta que se
   * acaba, asi que sus llamadas son suyas venga el dia que venga. Contadores y tabla
   * miran lo mismo —todo lo de la cola elegida— y siguen sin contradecirse.
   */
  /**
   * El dia que se mira, VACIO por defecto = todos.
   *
   * Ponerlo en hoy dejaba la pantalla en cero casi cada mañana: no hay una cola
   * discando todos los dias, asi que lo normal era abrir Llamadas y no ver nada
   * teniendo miles de llamadas dentro. Se abre con todo y se acota si hace falta.
   */
  fechaLlamadas: string = '';

  cambiarColaLlamadas(id: number | null): void {
    this.colaLlamadas = id;
    this.paginaSesiones = 1;
    this.cargarSesiones();
  }

  cambiarFechaLlamadas(fecha: string): void {
    this.fechaLlamadas = fecha || '';
    // El desplegable de colas se rehace con el dia: las que no llamaron ese dia dejan
    // de ofrecerse. Y si la que estaba elegida no esta entre ellas, se suelta el filtro
    // en vez de dejar seleccionada una cola que ya no sale en la lista.
    this.refrescarColasFiltro();
    this.paginaSesiones = 1;
    this.cargarSesiones();
  }

  /**
   * Las colas que se pueden elegir en el filtro, id -> nombre.
   *
   * NO sale de `colas` —las que existen hoy— sino de las que aparecen en las sesiones
   * ya cargadas, mas las vivas. Al borrar una cola sus llamadas siguen en el
   * historico, y atando el selector a las colas vivas desaparecia justo cuando mas
   * falta hacia: quedaba una sola cola y ya no habia forma de mirar lo de la borrada.
   *
   * Es acumulativo a proposito: cuando se filtra por una cola la respuesta solo trae
   * sesiones de esa cola, y recalcularlo desde cero dejaria el selector con una unica
   * opcion —la elegida— y sin manera de volver.
   */
  private colasVistas = new Map<number, string>();

  /** Lo anterior ya resuelto para el <select>. Es un CAMPO, no un getter: un array
   *  nuevo en cada deteccion de cambios recrea las <option> mientras se despliegan. */
  colasFiltro: { id: number; nombre: string }[] = [];

  trackCola(_: number, c: { id: number }): number { return c.id; }

  /**
   * Rehace el selector de colas de la pantalla de Llamadas.
   *
   * Las colas salen de una CONSULTA PROPIA al histórico, no de las sesiones cargadas.
   * Deducirlas de la tabla estaba mal y se vio en cuanto hubo datos: la tabla trae las
   * 100 últimas y el desplegable solo se enteraba de las colas presentes en esas 100.
   * En QAS eso dejó fuera la cola 4 entera —1.775 llamadas— porque su última sesión es
   * más vieja que las 100 últimas, y el selector enseñaba únicamente la cola 5.
   */
  private refrescarColasFiltro(): void {
    // Con un dia elegido se parte de cero: lo visto en otros dias no vale, o el
    // desplegable acumularia colas que ese dia no llamaron.
    if (this.fechaLlamadas) this.colasVistas.clear();
    this.svc.getColasDelHistorico(this.fechaLlamadas || null).subscribe({
      next: (filas) => {
        for (const f of filas) {
          if (f.idCola == null) continue;
          // El nombre puede venir null si la cola se borró ANTES de que las sesiones
          // empezaran a guardarlo. Se la llama por su id: sin nombre la opción sería
          // una línea en blanco y no se podría elegir a ciegas.
          this.colasVistas.set(f.idCola, f.nombreCola || `Cola ${f.idCola}`);
        }
        this.componerColasFiltro();
        // La cola elegida puede no haber llamado el dia nuevo: se suelta el filtro en
        // vez de dejar un desplegable enseñando algo que ya no esta entre sus opciones.
        if (this.fechaLlamadas && this.colaLlamadas != null
            && !this.colasFiltro.some((c) => c.id === this.colaLlamadas)) {
          this.colaLlamadas = null;
        }
      },
      // Sin el histórico se pinta al menos lo que hay vivo: un selector vacío deja al
      // supervisor sin poder filtrar nada.
      error: () => this.componerColasFiltro(),
    });
  }

  /** El nombre de una cola VIVA manda sobre el guardado: si la renombraron, el
   *  selector tiene que decir el de ahora, no el del día de la llamada. */
  private componerColasFiltro(): void {
    const m = new Map(this.colasVistas);
    for (const c of this.colas) if (c.id != null) m.set(c.id, c.nombre);
    this.colasFiltro = [...m].map(([id, nombre]) => ({ id, nombre }))
        .sort((a, b) => a.id - b.id);
  }

  /** Como se llama la cola de una sesion, ya este borrada o ya no tenga. */
  nombreDeCola(s: BotSesion): string {
    if (s.idCola == null) return '—';
    return s.nombreCola || this.colasVistas.get(s.idCola) || `Cola ${s.idCola}`;
  }

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
  pastillasLlamadas: { clave: string; etiqueta: string; tono: string; n: number;
                       fijo: boolean }[] = [];

  private calcularPastillas(r: ResumenLlamadas | null) {
    if (!r) return [];
    return BotVozComponent.GRUPOS
      .map((g) => {
        const fuente = g.estados ? r.porEstado : r.porResultado;
        const claves = g.estados ?? g.resultados ?? [];
        const n = claves.reduce((a, k) => a + (fuente?.[k] ?? 0), 0);
        // `fijo`: las de COMO ACABO se pintan siempre, tambien a cero. Con las colas
        // paradas el dia entero salian todas a cero, se filtraban todas y la fila de
        // pastillas desaparecia entera —con ella el resumen del dia—, que es justo lo
        // que el supervisor abre a mirar cuando el discador no esta marcando. Son
        // cuatro y son excluyentes: cuatro ceros se leen como "hoy no se llamo".
        // Las de QUE SE SACO siguen ocultandose a cero: ahi si serian ruido.
        return { clave: g.clave, etiqueta: g.etiqueta, tono: g.tono, n, fijo: !!g.estados };
      })
      .filter((p) => p.fijo || p.n > 0);
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
    // Se vuelve a pedir la lista al backend en vez de filtrar lo que ya hay: aqui solo
    // estan las 100 ultimas, y una pastilla que cuenta 7 enseñaba 2 porque las otras
    // cinco se habian salido de la ventana.
    this.cargarSesiones();
  }

  /**
   * Las llamadas que coinciden con el buscador.
   *
   * La pastilla ya NO se filtra aquí: la lista llega filtrada del backend. Filtrarla
   * otra vez no cambiaría nada, pero dejaría dos sitios donde decidir lo mismo, que es
   * como se acaba con dos criterios distintos.
   */
  get sesionesFiltradas(): BotSesion[] {
    const q = this.busquedaLlamadas.trim().toLowerCase();
    if (!q) return this.sesiones;
    return this.sesiones.filter((s) =>
      (s.documento || '').toLowerCase().includes(q)
      || (s.nombreCliente || '').toLowerCase().includes(q)
      || (s.telefono || '').includes(q)
      || (s.resultadoNegocio || '').toLowerCase().includes(q));
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
           porque: 'Se llegó al máximo de llamadas que permite la cola. Estas cuotas entran mañana.' },
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

  abrir(v: 'colas' | 'tonos' | 'reglas' | 'llamadas'): void {
    // Un segundo clic en el mismo botón devuelve a las colas: hace de ida y de vuelta.
    this.vista = this.vista === v && v !== 'colas' ? 'colas' : v;
    const t = this.vista;
    if (t === 'llamadas') this.cargarSesiones();
    // Las filas de una cola NO se piden al volver: se piden por `idCola` y solo cuando
    // se abre su detalle. Pedirlas aqui seria bajarse las de todas las colas para
    // pintar una lista de tarjetas que ya lleva sus numeros en `contadores`.
    if (t === 'colas') { this.cargarColas(); this.cargarTonos(); this.cargarContadores(); }
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
  // ---- Condiciones de negociacion de la cola ----
  //
  // Cuelgan de la cola y no de la subcartera porque son lo que cambia cada semana:
  // "esta semana bajamos el minimo de quinientos a cuatrocientos". Antes esto solo se
  // podia tocar por SQL.

  /** Una regla en blanco. `campoBase` viene puesto porque en propia siempre es el
   *  capital, y dejarlo vacio obligaria a elegirlo cada vez para poner lo mismo. */
  private reglaColaVacia(): BotColaRegla {
    return {
      campoBase: 'sld_capital_asig',
      curvaDescuento: '',
      escalonesCastigo: '',
      pagoMinimo: null,
      diasMaxPago: null,
      ultimoTramoSoloHoy: false,
      maxCuotasBot: null,
    };
  }

  /**
   * El bloque esta vacio y la cola tiene que seguir heredando de su subcartera.
   *
   * `campoBase` NO cuenta: viene preseleccionado, asi que si contara, abrir el
   * formulario para cambiar el horario le escribiria a la cola una regla propia sin
   * que nadie lo pidiera — y dejaria de heredar sin que se note.
   */
  sinCondiciones(): boolean {
    const r = this.reglaCola;
    return !r.curvaDescuento?.trim()
        && r.pagoMinimo == null
        && r.diasMaxPago == null
        && r.maxCuotasBot == null
        && !r.ultimoTramoSoloHoy;
  }

  /**
   * El mismo criterio que el backend antes de devolver 400: numeros entre 0 y 100
   * separados por comas. Se comprueba tambien aqui para que el error salga sin ida y
   * vuelta, no porque el servidor sobre.
   *
   * Vacia es valida: significa que la cola no fija curva y hereda.
   */
  curvaValida(): boolean {
    const curva = (this.reglaCola.curvaDescuento || '').trim();
    if (!curva) return true;
    // En castigo la curva NO son porcentajes: son los nombres de las columnas que
    // traen el importe ya calculado (`ltd`, `ltd_plus`…). Sin esta rama, el validador
    // de propia los leía como números, `Number('ltd')` daba NaN y el formulario se
    // quedaba bloqueado con «Revisa las condiciones de negociación» sin decir cuál.
    // Se validan contra los escalones que el backend dijo que existen, que además
    // impide guardar el nombre de una columna vacía.
    if (this.esCastigo) return true;   // en castigo la curva no se usa
    return curva.split(',').every((t) => {
      const v = Number(t.trim());
      return t.trim() !== '' && Number.isFinite(v) && v > 0 && v < 100;
    });
  }

  // ----- La curva de descuentos, por escalones -----
  //
  // El campo de texto con comas se quedo corto: no valida al escribir, no deja ver el
  // orden y, sobre todo, esconde lo unico que importa —cuanto va a DECIR Clara—. El
  // suelo aplasta mas de lo que parece: con 90 % y suelo 200 muerde en el 54 % de la
  // cartera antigua, asi que "70,80,90" acaba siendo tres veces el mismo importe y el
  // backend lo deduplica a uno solo. Configurabas tres rebajas y ofrecias una.
  //
  // `escalones` manda en la pantalla y se vuelca a `curvaDescuento` en cada cambio, asi
  // que el contrato con el backend no se toca: sigue viajando "70,80,90".

  /** Los porcentajes de la curva, en el orden en que Clara los ofrece. */
  escalones: number[] = [];

  /** Importe representativo de la subcartera, para la vista previa. `n: 0` = sin dato. */
  muestra: { campo: string; n: number; mediana?: number; minimo?: number; maximo?: number } | null = null;

  /**
   * Texto -> escalones, y de vuelta.
   *
   * Se reescribe la curva con lo que se pinta para que lo que ves sea lo que se guarda.
   * La columna admite cualquier texto —una fila vieja o un UPDATE a mano pueden traer
   * "90%" o "noventa"— y sin este viaje de ida y vuelta la pantalla enseñaria cero
   * escalones mientras el formulario seguia mandando la basura al guardar: el backend
   * responderia 400 sin que nada en pantalla explicara por que.
   */
  private leerEscalones(): void {
    const crudo = (this.reglaCola.curvaDescuento || '').trim();
    this.escalones = crudo
      .split(',')
      .map((t) => Number(t.trim()))
      .filter((v) => Number.isFinite(v) && v > 0 && v < 100)
      .map((v) => Math.round(v));
    const habia = crudo.split(',').filter((t) => t.trim() !== '').length;
    this.escribirCurva();
    if (habia && this.escalones.length < habia) {
      this.errorCurva = 'La curva guardada tenía valores ilegibles; se han descartado.';
    }
  }

  /** Escalones -> texto. El backend sigue recibiendo lo mismo de siempre. */
  private escribirCurva(): void {
    this.reglaCola.curvaDescuento = this.escalones.join(',');
    this.errorCurva = '';
  }

  cambiarEscalon(i: number, valor: number | string): void {
    const v = Math.round(Number(valor));
    if (!Number.isFinite(v)) return;
    this.escalones[i] = Math.min(99, Math.max(1, v));
    this.escribirCurva();
  }

  /**
   * Un escalon nuevo por encima del ultimo, sin pasar de 99.
   *
   * Se siembra con algo razonable en vez de con 0: un escalon a 0 % no es una oferta,
   * y obligaba a moverlo siempre antes de que sirviera de nada.
   */
  anadirEscalon(): void {
    const ultimo = this.escalones.length ? this.escalones[this.escalones.length - 1] : 70;
    this.escalones.push(Math.min(99, ultimo + 10));
    this.escribirCurva();
  }

  quitarEscalon(i: number): void {
    this.escalones.splice(i, 1);
    this.escribirCurva();
  }

  /** El orden es el orden en que Clara ofrece, asi que se mueve a mano, no se ordena solo. */
  moverEscalon(i: number, salto: number): void {
    const j = i + salto;
    if (j < 0 || j >= this.escalones.length) return;
    [this.escalones[i], this.escalones[j]] = [this.escalones[j], this.escalones[i]];
    this.escribirCurva();
  }

  /**
   * Lo que Clara diria en este escalon: la misma cuenta que hace el backend, con el
   * suelo aplicado y redondeado a soles enteros.
   *
   * Si no hay muestra devuelve null y la pantalla se limita a los porcentajes: preferir
   * no enseñar importe a enseñar uno inventado.
   */
  importeDe(pct: number): number | null {
    const base = this.muestra?.mediana;
    if (base == null || !this.muestra?.n) return null;
    // Mismo redondeo que el backend: a soles enteros primero el importe y luego el
    // suelo. Redondear solo uno de los dos hace que la vista previa diga 200 donde la
    // llamada dice 201.
    const piso = Math.round(Number(this.reglaCola.pagoMinimo ?? 0));
    return Math.max(Math.round(Number(base) * (1 - pct / 100)), piso);
  }

  /** Este escalon dice el mismo importe que el anterior: el suelo lo aplasto. */
  escalonAplastado(i: number): boolean {
    if (i === 0) return false;
    const hoy = this.importeDe(this.escalones[i]);
    return hoy != null && hoy === this.importeDe(this.escalones[i - 1]);
  }

  /** Cuantos escalones distintos oira el cliente de verdad. */
  get escalonesUtiles(): number {
    if (!this.escalones.length) return 0;
    if (this.importeDe(this.escalones[0]) == null) return this.escalones.length;
    return this.escalones.filter((_, i) => !this.escalonAplastado(i)).length;
  }

  // ----- Castigo: los escalones ya existen -----
  //
  // En propia nosotros proponemos la curva de descuentos; en castigo esos escalones ya
  // vienen calculados por cliente en la tabla, asi que aqui no se propone nada: se
  // marca cuales entran en la cola. Por eso el bloque de condiciones cambia de forma
  // segun la subcartera elegida.

  /** Los escalones que existen en esta subcartera, con su importe de ejemplo. */
  escalonesCastigo: { campo: string; etiqueta: string; n: number; mediana?: number;
               minimo?: number; maximo?: number }[] = [];

  /** Los que el usuario marco para esta cola. Viajan en `escalonesCastigo`, que es su
   *  campo propio: la curva de porcentajes es de propia y aqui no significa nada. */
  escalonesElegidos: string[] = [];

  /** True si la subcartera elegida es de castigo. Decide la forma del formulario. */
  get esCastigo(): boolean {
    const n = (this.nombreSubcartera(this.nuevaCola.idSubcartera) || '').toUpperCase();
    return n.includes('CASTIG');
  }

  alternarEscalon(campo: string): void {
    const i = this.escalonesElegidos.indexOf(campo);
    if (i >= 0) this.escalonesElegidos.splice(i, 1);
    else this.escalonesElegidos.push(campo);
    // Se respeta el orden en que los devuelve el backend —de mas caro a mas barato—,
    // que es el orden en que Clara los ofrece. Dejarlo al orden de los clics haria que
    // la escalera empezara por la rebaja mas grande.
    this.escalonesElegidos.sort(
      (a: string, b: string) => this.escalonesCastigo.findIndex((e) => e.campo === a)
                              - this.escalonesCastigo.findIndex((e) => e.campo === b));
    this.reglaCola.escalonesCastigo = this.escalonesElegidos.join(',');
    this.normalizarReglaCastigo();
  }

  /**
   * En castigo no hay columna base ni plazo ni tope de cuotas: el importe ya viene en
   * cada escalón y el plazo lo fija la política según ese importe.
   *
   * Se llama al guardar y al cargar, no solo al marcar un escalón. Estaba dentro de
   * `alternarEscalon` y solo corría si tocabas un checkbox: editar la cola sin volver a
   * marcarlos guardaba el `campoBase` por defecto de propia con la curva vacía, y el
   * backend se iba al camino del catálogo y ofrecía la deuda entera como si fuera una
   * rebaja. Visto en la llamada de Martha Mendoza del 24/08.
   */
  private normalizarReglaCastigo(): void {
    if (!this.esCastigo) return;
    this.reglaCola.campoBase = undefined as any;
    this.reglaCola.diasMaxPago = null;
    this.reglaCola.maxCuotasBot = null;
    // La curva de porcentajes es de propia y aqui no significa nada. Dejarla con el
    // valor heredado del formulario mandaba a castigo por el camino equivocado.
    this.reglaCola.curvaDescuento = '';
  }

  /** Pide los escalones de la subcartera. Silencioso: es una ayuda, no un requisito. */
  cargarEscalones(): void {
    const sub = this.nuevaCola.idSubcartera;
    const inq = this.idInquilinoSel || this.nuevaCola.idInquilino;
    const cart = this.idCarteraSel || this.nuevaCola.idCartera;
    if (!sub || !inq || !cart || !this.esCastigo) { this.escalonesCastigo = []; return; }
    this.svc.getEscalones(inq, cart, sub).subscribe({
      next: (e) => {
        this.escalonesCastigo = e || [];
        this.escalonesElegidos = (this.reglaCola.escalonesCastigo || '')
          .split(',').map((x: string) => x.trim())
          .filter((x: string) => this.escalonesCastigo.some((e) => e.campo === x));
      },
      error: () => (this.escalonesCastigo = []),
    });
  }

  /** El nombre legible de la columna sobre la que se descuenta, para los avisos. */
  nombreCampoBase(): string {
    const c = this.CAMPOS_BASE.find((x) => x.valor === this.reglaCola.campoBase);
    return c ? c.nombre : (this.reglaCola.campoBase || 'La columna elegida');
  }

  /**
   * Pide el importe de referencia. Silencioso a proposito: es una ayuda visual y su
   * fallo no puede estorbar al que esta montando la cola.
   */
  cargarMuestra(): void {
    const sub = this.nuevaCola.idSubcartera;
    const campo = this.reglaCola.campoBase;
    // Al editar no se pasa por los selectores —la subcartera de una cola no se cambia—
    // asi que ahi los ids salen de la propia cola.
    const inq = this.idInquilinoSel || this.nuevaCola.idInquilino;
    const cart = this.idCarteraSel || this.nuevaCola.idCartera;
    if (!sub || !campo || !inq || !cart) { this.muestra = null; return; }
    this.svc.getMuestra(inq, cart, sub, campo).subscribe({
      next: (m) => (this.muestra = m),
      error: () => (this.muestra = null),
    });
  }

  /**
   * Carga las condiciones de una cola al abrirla.
   *
   * El 204 llega como cuerpo null y NO es un error: quiere decir que la cola no tiene
   * regla propia y usa la de su subcartera. Se avisa y se dejan los campos en blanco,
   * que es justo lo que hay que ver.
   */
  private cargarReglaDeCola(id: number): void {
    this.reglaCola = this.reglaColaVacia();
    this.reglaHeredada = false;
    this.errorCurva = '';
    this.svc.getReglaDeCola(id).subscribe({
      next: (r) => {
        if (!r) { this.reglaHeredada = true; this.escalones = []; this.cargarMuestra(); return; }
        this.reglaCola = {
          campoBase: r.campoBase || 'sld_capital_asig',
          curvaDescuento: r.curvaDescuento || '',
          // Sin esto los escalones de castigo se perdian al abrir la cola para editarla:
          // el formulario se rellenaba sin ellos y al guardar los borraba.
          escalonesCastigo: r.escalonesCastigo || '',
          pagoMinimo: r.pagoMinimo ?? null,
          diasMaxPago: r.diasMaxPago ?? null,
          ultimoTramoSoloHoy: !!r.ultimoTramoSoloHoy,
          maxCuotasBot: r.maxCuotasBot ?? null,
        };
        this.leerEscalones();
        this.cargarMuestra();
        this.cargarEscalones();
      },
      // Sin condiciones a la vista es preferible a un formulario a medio rellenar: si
      // falla la lectura, se deja en blanco y marcado como heredado, que es el estado
      // mas conservador —guardar asi no le escribe una regla propia—.
      error: () => { this.reglaHeredada = true; this.escalones = []; },
    });
  }

  /**
   * Una cola nueva ya NO nace con todo en null.
   *
   * Los tres numeros de abajo eran "hereda del calendario de ritmos" y ese calendario
   * ya no existe, asi que null aqui solo significaria un INSERT contra tres columnas
   * NOT NULL. Se siembran con lo mas conservador: se marca una vez a cada cliente, no
   * se avisa con adelanto y la ventana de vencidas es de un dia.
   */
  private colaVacia(): BotCola {
    return {
      nombre: '', idSubcartera: undefined as any, objetivos: '',
      idTono: null, horaInicio: null, horaFin: null,
      maxLlamadasSimultaneas: null,
      intentosMaximos: 1, diasAnticipacion: 0, maxDiasVencida: 1,
    };
  }

  // El ritmo vigente, las tres TAREAS y el enlace al calendario se fueron con la tabla
  // `bot_ritmo`. Los numeros que ensenaban en lectura ahora se editan en el propio
  // formulario, porque son de esta cola y de ninguna otra.

  // Topes del sistema. No son configuración de negocio —son la ley y el techo de
  // canales de la máquina— así que no se editan en el panel: se enseñan como límite.
  //
  // Las llamadas a la vez NO están aquí: son de cada cola. Hubo un techo global en
  // `bot_config` que ninguna cola podía pasar, y con tres colas discando obligaba a
  // repartir un cupo que nadie sabía de dónde salía; peor, sembrado en 1 dejaba el
  // formulario de la cola sin efecto. Ahora cada cola dice cuántas sostiene, entre
  // MIN_SIMULTANEAS y MAX_SIMULTANEAS, y no se resta de ningún bolsón común.
  readonly MIN_SIMULTANEAS = 1;
  readonly MAX_SIMULTANEAS = 20;

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
      next: (c) => { this.colas = c; this.refrescarColasFiltro(); },
      error: () => this.flash('No se pudieron cargar las colas', true),
    });
  }

  /**
   * Los seis numeros de cada cola, contados en la base.
   *
   * Un fallo aqui no se avisa: la lista de colas se lee igual sin los contadores, y un
   * aviso rojo cada cinco segundos por un numero que falta taparia el que si importa.
   * Se dejan los anteriores en vez de vaciarlos — un cero mentiria diciendo que la
   * cola se quedo sin trabajo, que es justo lo que dispara "Finalizada".
   */
  cargarContadores(): void {
    this.svc.getContadores().subscribe({
      next: (filas) => {
        const m: Record<number, { pendientes: number; enLlamada: number;
                                  completadas: number; descartadas: number; total: number }> = {};
        for (const f of filas) {
          m[f.idCola] = { pendientes: f.pendientes, enLlamada: f.enLlamada,
                          completadas: f.completadas, descartadas: f.descartadas, total: f.total };
        }
        this.contadores = m;
      },
      error: () => { /* se queda la ultima foto buena */ },
    });
  }

  // ---- Filtrar la lista de colas ----
  //
  // Filtra el NAVEGADOR y ordena el BACKEND. Son un punado de colas ya cargadas, asi
  // que un viaje al servidor por tecla no compra nada; y reordenar aqui lo que el
  // backend ya ordeno es como se acaba viendo una lista distinta segun por donde
  // entres.

  busquedaCola: string = '';
  subcarteraFiltro: number | null = null;

  /** Las colas que se pintan. NO ordena: el orden llega hecho de `GET /colas`. */
  get colasVisibles(): BotCola[] {
    const q = this.busquedaCola.trim().toLowerCase();
    return this.colas.filter((c) => {
      if (this.subcarteraFiltro != null && c.idSubcartera !== this.subcarteraFiltro) return false;
      if (!q) return true;
      return (c.nombre || '').toLowerCase().includes(q);
    });
  }

  /** Las subcarteras que de verdad tienen cola. Ofrecer las demas es ofrecer un
   *  filtro que solo puede dejar la lista vacia. */
  get subcarterasConCola(): { id: number; nombre: string }[] {
    const m = new Map<number, string>();
    for (const c of this.colas) {
      if (c.idSubcartera == null) continue;
      m.set(c.idSubcartera, c.nombreSubcartera || `#${c.idSubcartera}`);
    }
    return [...m].map(([id, nombre]) => ({ id, nombre }));
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
    this.cargarMuestra();
    this.cargarEscalones();
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
    // Sin objetivo preseleccionado: el boton de guardar se queda deshabilitado hasta
    // que alguien elija uno, que es lo que obliga a decidirlo en vez de heredarlo.
    this.objetivo = '';
    this.idInquilinoSel = 0;
    this.idCarteraSel = 0;
    this.carteras = [];
    this.subcarteras = [];
    this.olvidarFiltros();
    // Una cola nueva arranca sin condiciones propias: heredara las de su subcartera
    // salvo que aqui se rellene el bloque.
    this.reglaCola = this.reglaColaVacia();
    this.reglaHeredada = true;
    this.errorCurva = '';
    this.escalones = [];
    this.muestra = null;
    this.modalCola = true;
    this.cargarSubcarteras();
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
    // Se normaliza al leer, no solo al guardar: la columna admite fisicamente una coma
    // y una fila vieja o un UPDATE a mano pueden traerla. Si trae dos objetivos ningun
    // radio queda marcado, que es exactamente lo que hay que ver — y guardar obliga a
    // elegir uno, que es lo que el backend va a exigir de todos modos.
    this.objetivo = (c.objetivos || '').trim().toUpperCase();
    // La subcartera no se cambia al editar: cambiarla convertiria esta cola en la de
    // otra cartera, con las filas de la anterior dentro. Para eso se borra y se crea.
    if (c.idSubcartera) this.verEfectivas(c.idSubcartera);
    if (c.id) this.cargarReglaDeCola(c.id);

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
    const borrada = c.id;
    this.svc.eliminarCola(c.id).subscribe({
      next: () => {
        // Si el detalle abierto era el suyo hay que cerrarlo y soltar sus filas: si no,
        // la tabla seguiria pintando los clientes de una cola que ya no existe y el ojo
        // no se podria volver a pulsar para cerrarla.
        if (this.detalleDe === borrada) { this.detalleDe = undefined; this.cola = []; this.descartes = []; }
        this.cargarColas();
        this.cargarContadores();
        this.flash('Cola eliminada');
      },
      error: () => this.flash('No se pudo eliminar la cola', true),
    });
  }

  crearCola(): void {
    if (!this.objetivo) {
      this.errorModal = 'Elige qué debe hacer Clara.';
      return;
    }
    // La curva se comprueba antes de tocar nada. Si se dejara para el tercer paso, la
    // cola y sus filtros quedarian escritos y las condiciones no, por una coma de mas.
    if (!this.curvaValida()) {
      this.errorCurva = BotVozComponent.ERROR_CURVA;
      this.errorModal = 'Revisa las condiciones de negociación.';
      return;
    }
    this.errorCurva = '';
    this.errorModal = '';
    this.guardandoCola = true;
    // El inquilino y la cartera ya los eligio el usuario en la cascada. Hacen falta
    // para localizar la tabla dinamica de la subcartera, que es de donde salen los
    // clientes sin promesa.
    //
    // Los tres numeros de intensidad viajan dentro de `nuevaCola` y se mandan siempre,
    // tambien los que la pantalla no ensena para este objetivo: son NOT NULL en la base
    // y el backend los normaliza, asi que vaciar uno vale lo que el de por defecto.
    this.guardarCola({
      ...this.nuevaCola, objetivos: this.objetivo,
      maxLlamadasSimultaneas: this.simultaneasEnRango(this.nuevaCola.maxLlamadasSimultaneas),
      idInquilino: this.idInquilinoSel || undefined,
      idCartera: this.idCarteraSel || undefined,
    });
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
          this.reglaCola = this.reglaColaVacia();
          this.errorCurva = '';
          this.escalones = [];
          this.muestra = null;
          this.olvidarFiltros();
          this.modalCola = false;
          this.editandoCola = undefined;
          this.cargarColas();
          this.flash(editaba ? 'Cola actualizada' : 'Cola creada');
        };

        /**
         * Tercer paso: las condiciones de negociación. Van al final por lo mismo que
         * los filtros —cuelgan del id de la cola, que al crear no existe hasta que
         * responde el backend— y solo se mandan si alguien rellenó el bloque: sin eso
         * la cola sigue heredando las de su subcartera.
         */
        const guardarRegla = () => {
          if (!idCola || this.sinCondiciones()) { terminar(); return; }
          this.normalizarReglaCastigo();
          this.svc.guardarReglaDeCola(idCola, this.reglaCola).subscribe({
            next: () => { this.reglaHeredada = false; terminar(); },
            error: (e) => {
              // La cola YA está guardada. Se apunta su id como "editando" para que el
              // siguiente clic en Guardar la actualice en vez de intentar crearla otra
              // vez, que chocaría con el 409 de "esa subcartera ya tiene una cola".
              this.editandoCola = idCola;
              // El botón vuelve a estar disponible: dejarlo en "Guardando…" tras fallar
              // el segundo paso deja la pantalla colgada sin nada que la desbloquee.
              this.guardandoCola = false;
              this.cargarColas();
              if (e?.status === 400) {
                // El modal se queda abierto y con lo tecleado: la curva es justo lo que
                // el usuario acaba de escribir a mano y hacérsela repetir sería el peor
                // castigo posible por una coma de más.
                this.errorCurva = BotVozComponent.ERROR_CURVA;
                // Además en el pie, porque el bloque 5 puede haber quedado fuera de la
                // parte visible del modal y el botón no diría por qué no cerró.
                this.errorModal = 'La cola se guardó. Revisa las condiciones de negociación.';
              } else {
                this.errorModal = 'La cola se guardó, pero no se pudieron guardar sus '
                  + 'condiciones de negociación. Vuelve a intentarlo.';
              }
            },
          });
        };

        if (!idCola) { terminar(); return; }
        this.svc.guardarFiltros(idCola, this.filtrosDeLoMarcado()).subscribe({
          next: () => guardarRegla(),
          error: () => {
            // La cola sí quedó guardada: decirlo es más útil que un "no se pudo" a
            // secas, que haría pensar que hay que volver a crearla.
            guardarRegla();
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
  /**
   * El avance mide LO QUE SE VA A LLAMAR, no las filas de la tabla.
   *
   * La primera version contaba descartada como gestionada —"las dos estan cerradas"— y
   * salio mal a la primera prueba: una cola de 8.030 con 8.024 descartadas y ni una
   * llamada hecha marcaba 100%. Y es que una descartada no se trabajo, se quito de en
   * medio: la blacklist, el sin telefono o el "hoy ya le llamaron" no son gestion.
   *
   * Asi que la descartada sale del DENOMINADOR en vez de llenar la barra. Con eso, esa
   * misma cola marca 0 de 6, que es la verdad.
   */
  totalDe(c: BotCola): number {
    if (c.id == null) return 0;
    const x = this.contadores[c.id];
    return x ? Math.max(0, x.total - x.descartadas) : 0;
  }

  gestionadosDe(c: BotCola): number {
    return c.id != null ? (this.contadores[c.id]?.completadas ?? 0) : 0;
  }

  /** Los que se quitaron de en medio. Se dicen aparte, no se esconden: si de 8.030
   *  entran 6, quien mira la cola tiene que ver por que. */
  descartadasDe(c: BotCola): number {
    return c.id != null ? (this.contadores[c.id]?.descartadas ?? 0) : 0;
  }

  /** El porcentaje, entero. Sin total no hay avance que ensenar: devuelve 0 y la
   *  barra no se pinta (el *ngIf de la plantilla mira `totalDe`). */
  avanceDe(c: BotCola): number {
    const total = this.totalDe(c);
    return total ? Math.round((this.gestionadosDe(c) / total) * 100) : 0;
  }

  /**
   * Los que quedan por marcar. Sale de los CONTADORES, no de `this.cola`.
   *
   * `this.cola` son las filas del panel de detalle, y solo están cargadas si abriste
   * el ojo de esa cola. Contando ahí, una cola con filas pendientes en la base decía
   * "0 por marcar" y `estadoCola` la daba por «Cola agotada» — que es justo lo que
   * hacía que una cola recién armada pareciera muerta.
   */
  pendientesDe(c: BotCola): number {
    if (c.id == null) return 0;
    const x = this.contadores[c.id];
    if (!x) return 0;
    return Math.max(0, x.total - x.descartadas - x.completadas);
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

  /**
   * Las reglas que esta pantalla puede editar: las de subcartera y la fila por defecto.
   *
   * Las de COLA se caen de aqui a proposito. Se veian con el mismo titulo que las de
   * subcartera —cinco tarjetas diciendo "TRAMO PROPIO"— y ademas con los campos
   * equivocados: esta pantalla ofrece enganche y cuotas, que es el trato de castigo, y
   * una regla de cola de propia se negocia con curva de descuento, suelo y plazo, que
   * no aparecen por ningun lado. Se editan donde viven, en el alta de la cola, que es
   * ademas donde se elige la antiguedad a la que aplican.
   */
  get reglasDeSubcartera(): BotRegla[] {
    return this.reglas.filter((r) => r.idCola == null);
  }

  /** De que cartera es esta subcartera, si alguna cola nos lo ha dicho ya. */
  carteraDeSubcartera(id?: number | null): string {
    if (id == null) return '';
    return this.colas.find((c) => c.idSubcartera === id)?.nombreCartera ?? '';
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
        // Los tres numeros van al preview porque el recuento depende de ellos: la
        // ventana de anticipacion y la de vencidas deciden que cuotas entran. Los
        // intentos no cambian el universo, pero el backend los quiere en el mismo
        // objeto y mandarlos aparte seria tener dos formas de decir lo mismo.
        intentosMaximos: this.nuevaCola.intentosMaximos,
        diasAnticipacion: this.nuevaCola.diasAnticipacion,
        maxDiasVencida: this.nuevaCola.maxDiasVencida,
        filtros: this.filtrosDeLoMarcado(),
      }).subscribe({
        next: (r) => {
          this.calculando = false;
          // El backend puede devolver un motivo en vez de un numero (subcartera sin
          // campos, filtro imposible). Se ensena tal cual como aviso, no como error de
          // la aplicacion.
          if (r?.error) { this.errorPreview = r.error; return; }
          this.entran = r.entran ?? 0;
        },
        error: () => { this.calculando = false; this.errorPreview = 'No se pudo calcular'; },
      });
    }, 500);
  }

  /**
   * El objetivo en la forma que entiende el backend. Vacio = la cola no trae a nadie.
   *
   * Sigue devolviendo un string y el campo del backend se sigue llamando `objetivos`
   * en plural: no se renombro para no arrastrar una migracion de datos por un nombre.
   * Lo que cambio es que ya solo puede llevar UN valor, y el backend rechaza con 400
   * cualquier cosa que traiga una coma.
   */
  private objetivosMarcados(): string {
    return this.objetivo || '';
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


  // El bloque de Ritmos se fue con la tabla `bot_ritmo`. Cargaba el calendario que
  // decidia cuanto insistir segun el dia del mes, y era comun a todas las colas: bajar
  // los intentos de la tuya se los bajaba a las de los demas. Ahora cada cola lleva su
  // propio `intentosMaximos` en su formulario.

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

  /**
   * Las filas de UNA cola. Antes se pedia "la cola del dia" sin decir cual, y el
   * backend devolvia lo que hubiera con fecha de hoy: al cambiar el dia, lo que quedo
   * sin marcar desaparecia de la pantalla —y del discador— sin que nadie lo cerrara.
   *
   * Ahora se pide por `id_cola` y la cola es suya, no del calendario. Sin cola abierta
   * no hay nada que pedir: se vacia y se sale.
   *
   * silencioso: sin spinner, para que el refresco automatico no parpadee.
   */
  cargarCola(silencioso = false): void {
    const idCola = this.detalleDe;
    if (!idCola) { this.cola = []; this.descartes = []; this.loadingCola = false; return; }
    this.loadingCola = !silencioso;
    this.svc.getCola(idCola).subscribe({
      next: (c) => { this.cola = c; this.errorCola = false; this.loadingCola = false; },
      error: () => {
        // Sin esto un 500 se veia igual que una cola vacia: la tabla mostraba
        // "La cola esta vacia" mientras en la BD habia 4 filas.
        this.errorCola = true;
        this.loadingCola = false;
        if (!silencioso) this.flash('No se pudo cargar la cola', true);
      },
    });
    this.svc.getDescartes(idCola).subscribe({
      next: (d) => (this.descartes = d),
      error: () => (this.descartes = []),
    });
  }
  contar(estado: string): number {
    return this.cola.filter((c) => c.estado === estado).length;
  }

  // ----- Llamadas (monitoreo) -----
  cargarSesiones(): void {
    const g = BotVozComponent.GRUPOS.find((x) => x.clave === this.pillLlamadas);
    // Fecha vacia = todas las llamadas de la cola elegida, del dia que sean.
    this.svc.getSesiones(g?.estados, g?.resultados, this.colaLlamadas,
                         this.fechaLlamadas || null).subscribe({
      next: (s) => {
        this.sesiones = s;
        this.errorSesiones = false;
        // De aqui salen las opciones del filtro de cola: del historico, no de las
        // colas que existen hoy.
        this.componerColasFiltro();
      },
      error: () => { this.errorSesiones = true; this.flash('No se pudieron cargar las llamadas', true); },
    });
    // Los contadores van aparte porque cuentan el día ENTERO en la base y la tabla
    // solo trae las 100 últimas de ese mismo día. Si esta falla no se avisa: la pantalla sirve igual sin las pastillas,
    // y un aviso rojo por unos contadores tapa el que sí importa, el de la tabla.
    this.svc.getResumenSesiones(this.colaLlamadas, this.fechaLlamadas || null).subscribe({
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
