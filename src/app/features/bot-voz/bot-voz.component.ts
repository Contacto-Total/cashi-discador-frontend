import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
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
  activeTab: 'config' | 'perfiles' | 'colas' | 'tonos' | 'reglas' | 'llamadas' = 'config';

  // ----- Colas y tonos -----
  colas: BotCola[] = [];
  tonos: BotTono[] = [];
  // Cascada inquilino -> cartera -> subcartera, la misma que usa el formulario de
  // campañas. Mi primera version pedia /subcarteras a secas contra la base equivocada
  // y ese endpoint ni existe: cuelga de /comisiones y exige idCartera.
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

  /** Los tres objetivos como casillas. Se juntan en `objetivos` al crear. */
  objRecordatorio = true;
  objCreacion = true;
  objPrimerContacto = false;

  nuevaCola: BotCola = this.colaVacia();
  /** El formulario de alta vive en un modal, como el de campañas. */
  modalCola = false;

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
    { id: 'saqk76H0L3GCnuHtLDw6', nombre: 'Karla', genero: 'F' },
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

  constructor(private svc: BotVozService,
              private tenantSvc: TenantService,
              private portfolioSvc: PortfolioService) {}

  ngOnInit(): void {
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
    if (this.activeTab === 'llamadas') this.cargarSesiones();
  }

  /**
   * Estado real del bot. `config.activo` es solo el kill-switch: sigue en true
   * cuando la cola ya se termino, porque nada lo apaga solo. Sin mirar la cola,
   * la cabecera decia "discando" indefinidamente.
   */
  get estadoBot(): string {
    if (!this.config?.activo) return 'Detenido';
    const enLlamada = this.contar('EN_LLAMADA');
    if (enLlamada > 0) return `Discando — ${enLlamada} en llamada`;
    const pendientes = this.contar('PENDIENTE');
    if (pendientes > 0) return `Activo — ${pendientes} en cola`;
    return this.cola.length ? 'Activo — cola terminada' : 'Activo — sin cola';
  }

  /** true si el formulario de config difiere de lo ultimo guardado. */
  get configSinGuardar(): boolean {
    return !!this.config && this.configGuardada !== '' &&
           JSON.stringify(this.config) !== this.configGuardada;
  }

  /** Filas que el bot todavia puede marcar. Sin esto, "Iniciar" prendia el
   *  kill-switch sobre una cola vacia y el bot quedaba "activo" sin marcar
   *  nada, que es indistinguible de que algo se rompio. */
  get colaMarcable(): number {
    return this.contar('PENDIENTE') + this.contar('EN_LLAMADA');
  }

  /** Solo aplica antes de arrancar. El aviso de cambios sin guardar va aparte
   *  porque ese importa siempre, tambien con el bot discando: editar la config
   *  a media cola y no guardarla es justo cuando mas se pierde. */
  get motivoNoIniciar(): string {
    if (this.configSinGuardar) return 'Guarda la configuración antes de iniciar';
    if (!this.colaMarcable) return 'No hay cola que marcar: arma la cola del día primero';
    return '';
  }

  /** Cuantas filas de la cola ya se intentaron: distingue arrancar de reanudar. */
  get colaYaIniciada(): boolean {
    return this.cola.some((c) => (c.intentos ?? 0) > 0);
  }

  get marcadas(): number {
    return this.cola.filter((c) => (c.intentos ?? 0) > 0).length;
  }

  /** Un solo boton que alterna. Con dos botones, uno siempre estaba gris y
   *  "Iniciar" mentia cuando la cola ya iba por la mitad. */
  get textoBotonDiscado(): string {
    if (this.config?.activo) return 'Detener discado';
    return this.colaYaIniciada ? 'Reanudar discado' : 'Iniciar discado';
  }

  get iconoBotonDiscado(): string {
    return this.config?.activo ? 'square' : 'play';
  }

  alternarDiscado(): void {
    if (this.config?.activo) this.detener();
    else this.iniciar();
  }

  /**
   * Dias seleccionables, en la convencion L M X J V: la X de miercoles evita la M
   * repetida de martes. Es lo que ya guarda la columna, asi que lo que se pinta y
   * lo que se guarda son el mismo valor.
   *
   * Sabado y domingo NO estan: la Ley 29571 prohibe la cobranza en fin de semana
   * (ver §10 del MD). Se quitan del selector en vez de dejarlos y avisar, porque
   * un aviso se ignora y una opcion que no existe, no.
   */
  readonly DIAS = [
    { codigo: 'L', nombre: 'Lunes' },
    { codigo: 'M', nombre: 'Martes' },
    { codigo: 'X', nombre: 'Miércoles' },
    { codigo: 'J', nombre: 'Jueves' },
    { codigo: 'V', nombre: 'Viernes' },
  ];

  readonly PRESETS_DIAS = [
    { nombre: 'Toda la semana', codigos: 'L,M,X,J,V', resumen: 'Marca de lunes a viernes.' },
    { nombre: 'Solo L-M-V', codigos: 'L,X,V', resumen: 'Marca lunes, miércoles y viernes.' },
  ];

  /**
   * Ventana horaria recomendada por la Ley 29571 arts. 61-62 (llamadas a horas
   * inoportunas). El MD la fija en 08:00-20:00 de lunes a viernes (§10). El
   * desplegable solo ofrece horas de ese rango, asi que no se puede elegir una
   * hora fuera de la ley: la validacion vive en las opciones que existen.
   */
  readonly HORA_LEGAL_DESDE = '08:00';
  readonly HORA_LEGAL_HASTA = '20:00';

  /**
   * Horas en punto de la ventana legal (08:00-20:00), sin minutos.
   *
   * Es un <select> y no un <input type="time"> porque ese dibuja el widget
   * nativo, que muestra AM/PM segun el idioma del navegador y no se puede
   * forzar desde el HTML (peticion abierta en el W3C desde 2022). Aqui el texto
   * de cada opcion lo escribimos nosotros, asi que siempre es 24 h.
   *
   * Solo 13 opciones: el rango invalido no se puede ni elegir, con lo que la
   * validacion de min/max deja de depender de que el usuario escriba bien.
   */
  private opcionesHora(desde: number, hasta: number): string[] {
    return Array.from({ length: hasta - desde + 1 },
                      (_, i) => `${String(desde + i).padStart(2, '0')}:00`);
  }

  /** Si la BD trae una hora que no esta en la rejilla (11:30 o 23:00, puestas
   *  por SQL), se agrega como opcion para que el select no salga en blanco y
   *  al guardar no la borre. */
  private conActual(lista: string[], actual?: string): string[] {
    const hm = this.hhmm(actual);
    return !hm || lista.includes(hm) ? lista : [...lista, hm].sort();
  }

  /** El inicio llega hasta una hora antes del tope: si no, el fin se queda sin
   *  ninguna opcion posible. */
  get horasInicio(): string[] {
    const desde = Number(this.HORA_LEGAL_DESDE.slice(0, 2));
    const hasta = Number(this.HORA_LEGAL_HASTA.slice(0, 2)) - 1;
    return this.conActual(this.opcionesHora(desde, hasta), this.config?.horaInicio);
  }

  /** El fin solo ofrece horas posteriores al inicio: asi no se puede elegir un
   *  rango invertido, en vez de avisarlo despues de haberlo guardado. */
  get horasFin(): string[] {
    const desde = Number(this.hhmm(this.config?.horaInicio).slice(0, 2) ||
                         this.HORA_LEGAL_DESDE.slice(0, 2)) + 1;
    const hasta = Number(this.HORA_LEGAL_HASTA.slice(0, 2));
    return this.conActual(this.opcionesHora(Math.min(desde, hasta), hasta), this.config?.horaFin);
  }

  /** Al mover el inicio, el fin puede quedar antes: se corre al minimo valido. */
  alCambiarInicio(): void {
    if (!this.config) return;
    if (this.hhmm(this.config.horaFin) <= this.hhmm(this.config.horaInicio)) {
      this.config.horaFin = this.horasFin[0];
    }
  }

  readonly PRESETS_HORARIO = [
    { nombre: 'Todo el día', inicio: '08:00', fin: '20:00' },
    { nombre: 'Mañana', inicio: '08:00', fin: '12:00' },
    { nombre: 'Tarde', inicio: '14:00', fin: '20:00' },
  ];

  aplicarPresetHorario(p: { inicio: string; fin: string }): void {
    if (!this.config) return;
    this.config.horaInicio = p.inicio;
    this.config.horaFin = p.fin;
  }

  presetHorarioActivo(p: { inicio: string; fin: string }): boolean {
    return this.hhmm(this.config?.horaInicio) === this.hhmm(p.inicio)
        && this.hhmm(this.config?.horaFin) === this.hhmm(p.fin);
  }

  /** "08:00:00" y "08:00" tienen que comparar igual: el backend devuelve con
   *  segundos y el <input type="time"> escribe sin ellos. */
  private hhmm(v?: string): string {
    return (v ?? '').slice(0, 5);
  }

  get horarioInvalido(): boolean {
    const i = this.hhmm(this.config?.horaInicio), f = this.hhmm(this.config?.horaFin);
    return !!i && !!f && f <= i;
  }

  get horarioFueraDeLey(): boolean {
    const i = this.hhmm(this.config?.horaInicio), f = this.hhmm(this.config?.horaFin);
    if (!i || !f) return false;
    return i < this.HORA_LEGAL_DESDE || f > this.HORA_LEGAL_HASTA;
  }

  get resumenHorario(): string {
    const i = this.hhmm(this.config?.horaInicio), f = this.hhmm(this.config?.horaFin);
    if (!i || !f) return '';
    if (this.horarioInvalido) return 'La hora de fin debe ser posterior a la de inicio.';
    const horas = (Number(f.slice(0, 2)) * 60 + Number(f.slice(3)) -
                   Number(i.slice(0, 2)) * 60 - Number(i.slice(3))) / 60;
    const texto = `Marca de ${i} a ${f} (${Number(horas.toFixed(1))} h por día).`;
    return this.horarioFueraDeLey
      ? `${texto} Fuera de la ventana recomendada por la Ley 29571 (${this.HORA_LEGAL_DESDE}–${this.HORA_LEGAL_HASTA}).`
      : texto;
  }

  private codigosActivos(): string[] {
    return (this.config?.diasSemana ?? '')
      .toUpperCase().split(',').map((d) => d.trim()).filter(Boolean);
  }

  diaActivo(codigo: string): boolean {
    return this.codigosActivos().includes(codigo);
  }

  /** Reescribe el campo en el orden canonico, nunca en el orden de los clics. */
  alternarDia(codigo: string): void {
    if (!this.config) return;
    const activos = new Set(this.codigosActivos());
    activos.has(codigo) ? activos.delete(codigo) : activos.add(codigo);
    this.config.diasSemana = this.DIAS
      .filter((d) => activos.has(d.codigo)).map((d) => d.codigo).join(',');
  }

  aplicarPresetDias(codigos: string): void {
    if (this.config) this.config.diasSemana = codigos;
  }

  presetActivo(codigos: string): boolean {
    return this.config?.diasSemana === codigos;
  }

  /** Los cuadritos en una frase, para no tener que descifrarlos. */
  get resumenDias(): string {
    const activos = this.codigosActivos();
    if (!activos.length) return 'No marca ningún día: el bot nunca saldrá a discar.';
    const preset = this.PRESETS_DIAS.find((p) => this.presetActivo(p.codigos));
    if (preset) return preset.resumen;
    const nombres = this.DIAS.filter((d) => activos.includes(d.codigo))
      .map((d) => d.nombre.toLowerCase());
    if (nombres.length === 1) return `Marca solo los ${nombres[0]}.`;
    return `Marca ${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}.`;
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

  switchTab(t: 'config' | 'perfiles' | 'colas' | 'tonos' | 'reglas' | 'llamadas'): void {
    this.activeTab = t;
    if (t === 'llamadas') this.cargarSesiones();
    if (t === 'colas') { this.cargarColas(); this.cargarTonos(); this.cargarSubcarteras(); this.cargarCola(); }
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
    };
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
    this.tenantSvc.getAllTenants().subscribe({
      next: (t) => (this.inquilinos = t || []),
      error: () => this.flash('No se pudieron cargar los inquilinos', true),
    });
  }

  alElegirInquilino(): void {
    this.carteras = [];
    this.subcarteras = [];
    this.idCarteraSel = 0;
    this.nuevaCola.idSubcartera = undefined as any;
    if (!this.idInquilinoSel) return;
    this.portfolioSvc.getPortfoliosByTenant(this.idInquilinoSel).subscribe({
      next: (c) => (this.carteras = c || []),
      error: () => this.flash('No se pudieron cargar las carteras', true),
    });
  }

  alElegirCartera(): void {
    this.subcarteras = [];
    this.nuevaCola.idSubcartera = undefined as any;
    if (!this.idCarteraSel) return;
    this.portfolioSvc.getSubPortfoliosByPortfolio(this.idCarteraSel).subscribe({
      next: (s) => (this.subcarteras = s || []),
      error: () => this.flash('No se pudieron cargar las subcarteras', true),
    });
  }

  abrirModalCola(): void {
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
  }

  cerrarModalCola(): void { this.modalCola = false; }

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
    this.svc.crearCola(cola).subscribe({
      next: () => {
        this.guardandoCola = false;
        this.nuevaCola = this.colaVacia();
        this.modalCola = false;
        this.cargarColas();
        this.flash('Cola creada');
      },
      error: () => {
        this.guardandoCola = false;
        this.flash('No se pudo crear la cola', true);
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

  nombreSubcartera(id?: number): string {
    const s = this.subcarteras.find((x) => x.id === id);
    return s ? (s.nombre || s.nombreSubcartera || `#${id}`) : `#${id ?? '—'}`;
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

  nuevaRegla(): void {
    this.reglas.push({ idSubcartera: null, nombre: 'Nueva regla', activo: true });
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
    if (!t.id) { this.flash('Guarda el tono antes de escucharlo', true); return; }
    // Si ya suena algo, este clic lo para y no pide nada mas: el boton es el mismo
    // para escuchar y para cortar.
    if (this.demoSonando != null) { this.pararDemo(); return; }
    if (this.demoCargando != null) return;          // ya hay una muestra en camino

    this.demoCargando = t.id;
    this.svc.demoTono(t.id).subscribe({
      next: (d) => {
        this.demoCargando = undefined;
        this.demoTexto[t.id!] = d?.texto ?? '';
        if (!d?.audioBase64) {
          this.flash(d?.error || 'Se generó la frase pero no el audio', true);
          return;
        }
        const audio = new Audio(`data:audio/wav;base64,${d.audioBase64}`);
        this.demoAudio = audio;
        this.demoSonando = t.id;
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
    if (this.demoCargando === t.id) return 'Generando…';
    if (this.demoSonando === t.id) return 'Detener';
    return 'Escuchar';
  }

  /** Solo se bloquean los OTROS: el del audio que suena tiene que poder pararlo. */
  escucharBloqueado(t: BotTono): boolean {
    if (this.demoCargando != null) return this.demoCargando !== t.id;
    if (this.demoSonando != null) return this.demoSonando !== t.id;
    return false;
  }

  // ----- Config -----
  cargarConfig(): void {
    this.svc.getConfig().subscribe({
      next: (c) => this.fijarConfig(c),
      error: () => this.flash('No se pudo cargar la configuración', true),
    });
  }
  guardarConfig(): void {
    if (!this.config) return;
    // Antes se guardaba un horario invertido y el aviso recien salia despues,
    // con la configuracion ya rota en la base.
    if (this.horarioInvalido) {
      this.flash('La hora de fin debe ser posterior a la de inicio', true);
      return;
    }
    if (!this.config.diasSemana) {
      this.flash('Selecciona al menos un día de la semana', true);
      return;
    }
    // Sanea lo que pueda venir de la base: un "S" o "D" heredado seguiria
    // haciendo discar en fin de semana y el selector ya no lo muestra, asi que
    // nadie podria quitarlo desde aqui.
    const validos = this.DIAS.map((d) => d.codigo);
    this.config.diasSemana = this.codigosActivos()
      .filter((c) => validos.includes(c))
      .join(',');
    if (!this.config.diasSemana) {
      this.flash('Selecciona al menos un día de la semana', true);
      return;
    }
    this.svc.updateConfig(this.config).subscribe({
      next: (c) => { this.fijarConfig(c); this.flash('Configuración guardada'); },
      error: () => this.flash('Error al guardar', true),
    });
  }

  /** Los botones start/stop solo mueven el kill-switch. Antes pisaban toda la
   *  config con la respuesta del servidor y se borraba lo que el usuario
   *  estuviera editando: asi se perdio un cambio del tope de simultaneas. */
  iniciar(): void {
    if (this.motivoNoIniciar) { this.flash(this.motivoNoIniciar, true); return; }
    this.svc.activar().subscribe({
      next: (c) => { this.marcarActivo(c.activo); this.flash('Bot iniciado — discando cola'); },
      error: () => this.flash('Error al iniciar', true),
    });
  }
  detener(): void {
    this.svc.desactivar().subscribe({
      next: (c) => { this.marcarActivo(c.activo); this.flash('Bot detenido'); },
      error: () => this.flash('Error al detener', true),
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

  /** Mueve solo `activo`, en el formulario y en la referencia guardada, para
   *  que el kill-switch no cuente como un cambio sin guardar. */
  private marcarActivo(valor: boolean): void {
    if (!this.config) return;
    this.config.activo = valor;
    if (this.configGuardada) {
      const guardada = JSON.parse(this.configGuardada);
      guardada.activo = valor;
      this.configGuardada = JSON.stringify(guardada);
    }
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
  get hayPerfilesSinGuardar(): boolean {
    return this.perfiles.some((p) => this.perfilSinGuardar(p));
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
