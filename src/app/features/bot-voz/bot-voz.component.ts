import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  BotVozService, BotConfig, BotPerfil, BotContacto, BotSesion, BotTurno,
  BotCola, BotTono, BotRegla, BotColaFiltro,
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
  /** Todas las que puede ver, sin depender de la cascada. */
  subcarterasPlanas: any[] = [];
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

  /** Los tres objetivos como casillas. Se juntan en `objetivos` al crear. */
  objRecordatorio = true;
  objCreacion = true;
  objPrimerContacto = false;

  nuevaCola: BotCola = this.colaVacia();
  /** El formulario de alta vive en un modal, como el de campañas. */
  modalCola = false;
  /** Id de la cola que se está editando. undefined = se está creando una nueva. */
  editandoCola?: number;

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

  // ----- Filtros de la cola que se esta editando -----
  /** Cola cuyo detalle esta abierto (el boton del ojo). */
  detalleDe?: number;
  filtrosDe?: number;
  filtros: BotColaFiltro[] = [];

  config?: BotConfig;
  perfiles: BotPerfil[] = [];
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

  /** Igual que configGuardada pero por perfil, indexado por id. */
  private perfilesGuardados = new Map<number, string>();

  /** Refresco de las vistas de monitoreo. Las filas cambian de estado mientras
   *  el bot disca y sin esto la pantalla se queda en la foto de cuando entraste. */
  private readonly REFRESCO_MS = 5000;
  private refresco?: ReturnType<typeof setInterval>;

  constructor(private svc: BotVozService) {}

  ngOnInit(): void {
    this.cargarPermisos();
    this.cargarSubcarterasPlanas();
    this.cargarColas();
    this.cargarTonos();
    this.cargarConfig();
    this.cargarPerfiles();
    this.cargarCola(true);   // alimenta el indicador de estado de la cabecera
    this.refresco = setInterval(() => this.refrescar(), this.REFRESCO_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
    this.pararDemo();       // si no, la muestra sigue sonando al cambiar de pantalla
  }

  /** La cola se refresca siempre porque de ella sale el estado de la cabecera.
   *  Config y perfiles no: recargarlos pisaria lo que el usuario esta editando. */
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

  get colaPagina(): BotContacto[] {
    return this.pagina(this.cola, this.paginaCola, (n) => (this.paginaCola = n));
  }
  get sesionesPagina(): BotSesion[] {
    return this.pagina(this.sesiones, this.paginaSesiones, (n) => (this.paginaSesiones = n));
  }
  get descartesPagina(): any[] {
    return this.pagina(this.descartes, this.paginaDescartes, (n) => (this.paginaDescartes = n));
  }
  totalPaginas(filas: unknown[]): number {
    return Math.max(1, Math.ceil(filas.length / this.TAM_PAGINA));
  }
  irA(cual: 'cola' | 'sesiones' | 'descartes', n: number): void {
    const filas = cual === 'cola' ? this.cola
      : cual === 'sesiones' ? this.sesiones : this.descartes;
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
           porque: 'Se llegó al máximo de llamadas que permite el perfil activo. Estas cuotas entran mañana.' },
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
  reglaPorque(d: any): string {
    return this.REGLAS[d?.regla]?.porque ?? (d?.detalle || 'Sin detalle registrado.');
  }
  /** Falso = hay algo que revisar (datos malos), no el sistema filtrando bien. */
  reglaEsNormal(regla: string): boolean {
    return this.REGLAS[regla]?.ok ?? true;
  }

  /** Resumen por regla, para ver de un vistazo si domina un problema real. */
  get descartesPorRegla(): { regla: string; titulo: string; n: number; ok: boolean }[] {
    const cuenta = new Map<string, number>();
    for (const d of this.descartes) cuenta.set(d.regla, (cuenta.get(d.regla) ?? 0) + 1);
    return [...cuenta.entries()]
      .map(([regla, n]) => ({ regla, n, titulo: this.reglaTitulo(regla), ok: this.reglaEsNormal(regla) }))
      .sort((a, b) => b.n - a.n);
  }

  abrir(v: 'colas' | 'ritmo' | 'tonos' | 'reglas' | 'llamadas'): void {
    // Un segundo clic en el mismo botón devuelve a las colas: hace de ida y de vuelta.
    this.vista = this.vista === v && v !== 'colas' ? 'colas' : v;
    const t = this.vista;
    if (t === 'llamadas') this.cargarSesiones();
    if (t === 'colas') { this.cargarColas(); this.cargarTonos(); this.cargarCola(); }
    if (t === 'ritmo') this.cargarPerfiles();
    if (t === 'tonos') this.cargarTonos();
    if (t === 'reglas') { this.cargarReglas(); this.cargarSubcarteras(); }
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
      maxLlamadasSimultaneas: null, maxLlamadasDia: null,
      diasAnticipacion: null, maxIntentosPorCuota: null,
      modoPerfil: 'AUTO', idPerfil: null,
    };
  }

  // ---- Lo que se hereda, para poder enseñarlo ----
  //
  // Un recuadro vacío que pone "hereda" no informa de nada: no sabes si vas a llamar
  // a 50 clientes o a 500. Estos ayudantes ponen el valor real en el placeholder.

  /** El ritmo que se aplicaría hoy si la cola no fija ninguno. */
  get ritmoVigente(): BotPerfil | undefined {
    if (this.nuevaCola.modoPerfil === 'MANUAL' && this.nuevaCola.idPerfil) {
      return this.perfiles.find((p) => p.id === this.nuevaCola.idPerfil);
    }
    const dia = new Date().getDate();
    return this.perfiles.find((p) => p.diaMesDesde <= dia && p.diaMesHasta >= dia);
  }

  heredado(campo: 'maxLlamadasDia' | 'diasAnticipacion' | 'maxIntentosPorCuota'): string {
    const v = this.ritmoVigente?.[campo];
    return v == null ? 'hereda' : `hereda: ${v}`;
  }

  // Topes del sistema. No son configuración de negocio —son la ley y el techo de
  // canales de la máquina— así que no se editan en el panel: se enseñan como límite.
  get topeSimultaneas(): number { return this.config?.maxLlamadasSimultaneas ?? 1; }
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

  cargarSubcarterasPlanas(): void {
    this.svc.getSubcarterasPlanas().subscribe({
      next: (s) => (this.subcarterasPlanas = s || []),
      error: () => this.flash('No se pudieron cargar las subcarteras', true),
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

  /** Al elegir subcartera se enseñan las condiciones que le aplican. */
  alElegirSubcartera(): void {
    if (this.nuevaCola.idSubcartera) this.verEfectivas(this.nuevaCola.idSubcartera);
  }

  alElegirCartera(): void {
    this.subcarteras = [];
    this.nuevaCola.idSubcartera = undefined as any;
    if (!this.idCarteraSel) return;
    this.svc.getSubcarteras(this.idCarteraSel).subscribe({
      next: (s) => (this.subcarteras = s || []),
      error: () => this.flash('No se pudieron cargar las subcarteras', true),
    });
  }

  abrirModalCola(): void {
    this.editandoCola = undefined;
    this.nuevaCola = this.colaVacia();
    this.objRecordatorio = true;
    this.objCreacion = true;
    this.objPrimerContacto = false;
    this.idInquilinoSel = 0;
    this.idCarteraSel = 0;
    this.carteras = [];
    this.subcarteras = [];
    this.modalCola = true;
    this.cargarSubcarteras();
    this.cargarPerfiles();
  }

  cerrarModalCola(): void {
    this.modalCola = false;
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
    // La subcartera no se cambia al editar: cambiarla convertiria esta cola en la de
    // otra cartera, con las filas de la anterior dentro. Para eso se borra y se crea.
    this.cargarPerfiles();
    if (c.idSubcartera) this.verEfectivas(c.idSubcartera);
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
      this.flash('Marca al menos a quién debe llamar', true);
      return;
    }
    this.guardandoCola = true;
    // El inquilino y la cartera ya los eligio el usuario en la cascada. Hacen falta
    // para localizar la tabla dinamica de la subcartera, que es de donde salen los
    // clientes sin promesa.
    this.guardarCola({
      ...this.nuevaCola, objetivos,
      idInquilino: this.idInquilinoSel || undefined,
      idCartera: this.idCarteraSel || undefined,
    });
  }

  private guardarCola(cola: BotCola): void {
    const peticion = this.editandoCola
      ? this.svc.actualizarCola(this.editandoCola, cola)
      : this.svc.crearCola(cola);
    peticion.subscribe({
      next: () => {
        const editaba = !!this.editandoCola;
        this.guardandoCola = false;
        this.nuevaCola = this.colaVacia();
        this.modalCola = false;
        this.editandoCola = undefined;
        this.cargarColas();
        this.flash(editaba ? 'Cola actualizada' : 'Cola creada');
      },
      error: (e) => {
        this.guardandoCola = false;
        // 409 es la regla de una cola por subcartera, y merece su propio mensaje: con
        // un "no se pudo guardar" el supervisor no sabe que ya tiene una.
        this.flash(e?.status === 409
          ? 'Esa subcartera ya tiene una cola. Edita la que hay.'
          : this.editandoCola ? 'No se pudo guardar la cola' : 'No se pudo crear la cola', true);
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
               ayuda: 'Está encendida, pero fuera de su ventana. Sigue mañana sola.' };
    }
    if (this.pendientesDe(c) === 0) {
      return { texto: 'Cola agotada', clase: 'st-espera',
               ayuda: 'No quedan clientes por marcar hoy. Vuelve a armarla.' };
    }
    return { texto: 'Discando', clase: 'st-discando', ayuda: 'Marcando ahora mismo.' };
  }

  /** Filas de HOY de esa cola que todavía se pueden marcar. */
  pendientesDe(c: BotCola): number {
    return this.cola.filter((f) => f.idCola === c.id &&
      (f.estado === 'PENDIENTE' || f.estado === 'EN_LLAMADA')).length;
  }

  private dentroDeHorario(c: BotCola): boolean {
    const ahora = new Date();
    const hhmm = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    if (c.horaInicio && hhmm < c.horaInicio.slice(0, 5)) return false;
    if (c.horaFin && hhmm > c.horaFin.slice(0, 5)) return false;
    return true;
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
    if (this.detalleDe) this.cargarCola();
  }

  /** Lo encolado hoy por ESA cola. */
  filasDe(c: BotCola): BotContacto[] {
    return this.cola.filter((f) => f.idCola === c.id);
  }

  nombreSubcartera(id?: number): string {
    const s = this.subcarterasPlanas.find((x) => x.id === id)
           || this.subcarteras.find((x) => x.id === id);
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

  // ----- Filtros de una cola -----

  editarFiltros(c: BotCola): void {
    if (!c.id) return;
    this.filtrosDe = this.filtrosDe === c.id ? undefined : c.id;
    if (this.filtrosDe) {
      this.svc.getFiltros(c.id).subscribe({
        next: (f) => (this.filtros = f),
        error: () => this.flash('No se pudieron cargar los filtros', true),
      });
    }
  }

  nuevoFiltro(): void {
    this.filtros.push({ fieldCode: '', dataType: 'NUMERICO' });
  }

  quitarFiltro(i: number): void { this.filtros.splice(i, 1); }

  guardarFiltros(): void {
    if (!this.filtrosDe) return;
    this.svc.guardarFiltros(this.filtrosDe, this.filtros).subscribe({
      next: (f) => { this.filtros = f; this.flash('Filtros guardados'); },
      error: () => this.flash('No se pudieron guardar los filtros', true),
    });
  }

  // ----- Tonos -----

  nuevoTono(): void {
    this.tonos.push({
      nombre: 'Nuevo tono', nombreBot: 'Clara', generoVoz: 'F',
      voiceId: 'saqk76H0L3GCnuHtLDw6', vozEtiqueta: 'Karla',
      ttsStability: 0.7, ttsStyle: 0.2, ttsSimilarityBoost: 0.75, ttsSpeed: 1.1,
      activo: true,
    });
  }

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

  nombrePerfil(id?: number): string {
    return this.perfiles.find((p) => p.id === id)?.nombre ?? '—';
  }

  // ----- Perfiles -----
  cargarPerfiles(): void {
    this.svc.getPerfiles().subscribe((p) => {
      this.perfiles = p;
      this.perfilesGuardados = new Map(p.map((x) => [x.id, JSON.stringify(x)]));
    });
  }
  /** Mismo problema que la config: sin esto editas un perfil, no le das a
   *  guardar y el cambio se pierde sin ningun aviso. */
  perfilSinGuardar(p: BotPerfil): boolean {
    const guardado = this.perfilesGuardados.get(p.id);
    return guardado !== undefined && guardado !== JSON.stringify(p);
  }
  guardarPerfil(p: BotPerfil): void {
    this.svc.updatePerfil(p.id, p).subscribe({
      next: (r) => {
        Object.assign(p, r);
        this.perfilesGuardados.set(p.id, JSON.stringify(p));
        this.flash(`Perfil ${p.nombre} guardado`);
      },
      error: () => this.flash('Error al guardar perfil', true),
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
