import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  BotVozService, BotConfig, BotPerfil, BotContacto, BotSesion, BotTurno,
} from './bot-voz.service';

@Component({
  selector: 'app-bot-voz',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './bot-voz.component.html',
  styleUrls: ['./bot-voz.component.css'],
})
export class BotVozComponent implements OnInit, OnDestroy {
  activeTab: 'config' | 'perfiles' | 'cola' | 'llamadas' = 'config';

  config?: BotConfig;
  perfiles: BotPerfil[] = [];
  cola: BotContacto[] = [];
  descartes: any[] = [];
  sesiones: BotSesion[] = [];

  loadingCola = false;
  armando = false;
  mensaje = '';

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
    this.cargarConfig();
    this.cargarPerfiles();
    this.cargarCola(true);   // alimenta el indicador de estado de la cabecera
    this.refresco = setInterval(() => this.refrescar(), this.REFRESCO_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
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
   * Los siete dias del selector, en la convencion L M X J V S D: la X de
   * miercoles evita la M repetida de martes. Es lo que ya guarda la columna,
   * asi que lo que se pinta y lo que se guarda son el mismo valor.
   */
  readonly DIAS = [
    { codigo: 'L', nombre: 'Lunes' },
    { codigo: 'M', nombre: 'Martes' },
    { codigo: 'X', nombre: 'Miércoles' },
    { codigo: 'J', nombre: 'Jueves' },
    { codigo: 'V', nombre: 'Viernes' },
    { codigo: 'S', nombre: 'Sábado' },
    { codigo: 'D', nombre: 'Domingo' },
  ];

  readonly PRESETS_DIAS = [
    { nombre: 'Lun a Vie', codigos: 'L,M,X,J,V', resumen: 'Marca de lunes a viernes.' },
    { nombre: 'Lun a Sáb', codigos: 'L,M,X,J,V,S', resumen: 'Marca de lunes a sábado.' },
    { nombre: 'Todos', codigos: 'L,M,X,J,V,S,D', resumen: 'Marca todos los días.' },
  ];

  /**
   * Ventana horaria recomendada por la Ley 29571 arts. 61-62 (llamadas a horas
   * inoportunas). El MD la fija como default 08:00-20:00 L-S. No se bloquea
   * fuera de rango — en QAS hace falta discar de noche — pero se avisa, que es
   * lo que faltaba: hoy el panel dejaba poner 23:00 sin decir nada.
   */
  readonly HORA_LEGAL_DESDE = '08:00';
  readonly HORA_LEGAL_HASTA = '20:00';

  /** Opciones cada media hora: se elige de una lista, no se teclea. */
  readonly HORAS = Array.from({ length: 48 }, (_, i) => {
    const hh = String(Math.floor(i / 2)).padStart(2, '0');
    const mm = i % 2 ? '30' : '00';
    return { valor: `${hh}:${mm}:00`, etiqueta: `${hh}:${mm}` };
  });

  /** Si la BD trae una hora fuera de la rejilla de medias horas (08:15, puesta
   *  por SQL), el select saldria en blanco y al guardar la borraria. Se agrega
   *  como opcion extra en su sitio. */
  private conValorActual(lista: { valor: string; etiqueta: string }[], actual?: string) {
    const hm = this.hhmm(actual);
    if (!hm || lista.some((h) => h.etiqueta === hm)) return lista;
    return [...lista, { valor: actual!, etiqueta: hm }]
      .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta));
  }

  /** El inicio no puede ser la ultima opcion del dia: dejaria sin ninguna al fin. */
  get horasInicio(): { valor: string; etiqueta: string }[] {
    return this.conValorActual(this.HORAS.slice(0, -1), this.config?.horaInicio);
  }

  /** La hora de fin solo ofrece opciones posteriores al inicio: asi el rango
   *  invalido no se puede ni elegir, en vez de avisarlo despues. */
  get horasFin(): { valor: string; etiqueta: string }[] {
    const desde = this.hhmm(this.config?.horaInicio);
    const base = desde ? this.HORAS.filter((h) => h.etiqueta > desde) : this.HORAS;
    return this.conValorActual(base, this.config?.horaFin);
  }

  readonly PRESETS_HORARIO = [
    { nombre: 'Legal (08–20)', inicio: '08:00:00', fin: '20:00:00' },
    { nombre: 'Mañana', inicio: '09:00:00', fin: '13:00:00' },
    { nombre: 'Tarde', inicio: '14:00:00', fin: '20:00:00' },
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

  switchTab(t: 'config' | 'perfiles' | 'cola' | 'llamadas'): void {
    this.activeTab = t;
    if (t === 'cola') this.cargarCola();
    if (t === 'llamadas') this.cargarSesiones();
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
    this.config = c;
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
  armarCola(): void {
    this.armando = true;
    this.svc.armarCola().subscribe({
      next: (r) => { this.armando = false; this.flash(`Cola armada: ${r.encolados} en cola, ${r.candidatos} candidatos`); this.cargarCola(); },
      error: () => { this.armando = false; this.flash('Error al armar la cola', true); },
    });
  }
  /** silencioso: sin spinner, para que el refresco automatico no parpadee. */
  cargarCola(silencioso = false): void {
    this.loadingCola = !silencioso;
    this.svc.getCola().subscribe({ next: (c) => { this.cola = c; this.loadingCola = false; }, error: () => (this.loadingCola = false) });
    this.svc.getDescartes().subscribe((d) => (this.descartes = d));
  }
  contar(estado: string): number {
    return this.cola.filter((c) => c.estado === estado).length;
  }

  // ----- Llamadas (monitoreo) -----
  cargarSesiones(): void {
    this.svc.getSesiones().subscribe((s) => (this.sesiones = s));
  }

  private flash(m: string, _error = false): void {
    this.mensaje = m;
    setTimeout(() => (this.mensaje = ''), 3500);
  }
}
