import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { AVATARES_PERSONAL } from '../asistencia/avatares-personal';
import { AsesorAgenda, BotAgendaService, CasoAgendaBot } from './bot-agenda.service';

/**
 * Clases que se repiten en la pantalla, con el sistema de Gestión de Tenores (el
 * mismo de bot de voz y control de asistencia).
 *
 * El CSS global del tema claro pisa inputs y algunas utilidades y, al no estar en
 * una capa, gana a Tailwind: por eso los colores van en hexadecimal y los controles
 * llevan `!`.
 */
const CLASES = {
  etiqueta: 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  ayuda: 'text-[12px] leading-snug text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:text-[#8491a3] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonPrimario: 'inline-flex h-[38px] items-center justify-center gap-[7px] whitespace-nowrap rounded-lg bg-[#0f172a] px-4 text-[13.5px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:!text-slate-900 dark:hover:bg-slate-200',
  botonPrimarioChico: 'inline-flex h-[30px] items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] bg-[#0f172a] px-3 text-[12px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 dark:bg-white dark:!text-slate-900 dark:hover:bg-slate-200',
  botonChico: 'inline-flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonAlto: 'inline-flex h-[38px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonIcono: 'flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] border border-[#8491a3] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200',
  cerrar: 'flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] !text-[#5f6c80] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:!text-slate-400 dark:hover:bg-slate-800',
  tarjeta: 'flex min-w-0 flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  rotulo: '!m-0 text-[11.5px] font-bold uppercase tracking-[0.05em] !text-[#5f6c80] dark:!text-slate-400',
  vacio: 'rounded-xl border border-[#e6e9ee] bg-white py-14 text-center dark:border-slate-800 dark:bg-slate-900',
};

/** Lo que distingue a cada tipo: orden, color, icono y rótulo. */
const TIPOS: Record<string, { orden: number; rotulo: string; plural: string; icono: string;
                              texto: string; fondo: string; rail: string }> = {
  PROMESA:       { orden: 0, rotulo: 'Promesa', plural: 'Promesas', icono: 'banknote',
                   texto: '#166534', fondo: '#e8f6ee', rail: '#15803d' },
  SIN_CERRAR:    { orden: 1, rotulo: 'Sin cerrar', plural: 'Sin cerrar', icono: 'alert-circle',
                   texto: '#92400e', fondo: '#fdf2dc', rail: '#b45309' },
  CITA:          { orden: 2, rotulo: 'Cita', plural: 'Citas', icono: 'calendar-clock',
                   texto: '#1d4ed8', fondo: '#eff5ff', rail: '#2563eb' },
  CON_INTENCION: { orden: 3, rotulo: 'Con intención', plural: 'Con intención', icono: 'message-circle',
                   texto: '#475569', fondo: '#eef2f7', rail: '#64748b' },
};

/** Minutos antes de la hora pactada en los que ya se puede llamar. */
const MARGEN_LLAMADA_MIN = 15;
/** Filas por página; con cuatro, la lista y la columna de asesores acaban a la par. */
const POR_PAGINA = 4;

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
               'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Un asesor en la columna del reparto, con lo que le tocó hoy. */
interface RepartoAsesor {
  idAgente: number;
  nombre: string;
  subcartera: string;
  cuantas: number;
  monto: number;
  sinGestionar: number;
}

/**
 * Agenda del bot: lo que Clara dejó y necesita a una persona.
 *
 * Es un REGISTRO, no un discador: aquí se ve con quién quedó el bot, a qué hora y
 * por qué, y la llamada se hace desde gestión manual, que es donde está la ficha
 * del cliente y la tipificación.
 *
 * La misma pantalla sirve a los dos roles. La supervisión ve la cola de lo que
 * sigue pendiente y, al lado, quién lleva las promesas que repartió el sistema esta
 * mañana; el asesor solo ve sus promesas. El recorte lo hace el backend.
 */
@Component({
  selector: 'app-bot-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule],
  templateUrl: './bot-agenda.component.html',
  styleUrls: ['./bot-agenda.component.css'],
})
export class BotAgendaComponent implements OnInit, OnDestroy {
  readonly ui = CLASES;
  readonly tipos = TIPOS;
  readonly clavesTipo = ['PROMESA', 'SIN_CERRAR', 'CITA', 'CON_INTENCION'];

  casos: CasoAgendaBot[] = [];
  asesores: AsesorAgenda[] = [];

  cargando = false;
  error = false;
  errorMotivo = '';
  guardando = false;
  aviso = '';

  /** Si quien mira reparte trabajo. Se descubre probando el catálogo de asesores. */
  esSupervision = false;

  filtroTipo = '';
  /**
   * Día suelto; vacío es toda la cola, que es como abre: lo pendiente no caduca con la
   * jornada y lo de días anteriores es justo lo que hay que levantar. El día sirve para
   * mirar una fecha concreta.
   */
  filtroDia = '';
  buscar = '';
  pagina = 0;

  casoAbierto?: CasoAgendaBot;
  asesorAbierto?: RepartoAsesor;

  private readonly REFRESCO_MS = 30000;
  private refresco?: ReturnType<typeof setInterval>;
  private reloj?: ReturnType<typeof setInterval>;
  private temporizadorAviso?: ReturnType<typeof setTimeout>;
  ahora = Date.now();

  /** Las 48 figuras, saneadas una vez: con el tamaño inyectado o Safari las encoge a cero. */
  private readonly avatares: SafeHtml[] = AVATARES_PERSONAL.map((a) =>
    this.sanitizer.bypassSecurityTrustHtml(a.replace('<svg ', '<svg width="100%" height="100%" ')));

  constructor(private svc: BotAgendaService,
              private router: Router,
              private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Un 403 aquí es la respuesta esperable para un asesor, no un error: dice que
    // esta pantalla es de solo lectura para él y que no ve el reparto de los demás.
    this.svc.asesores().subscribe({
      next: (a) => { this.esSupervision = true; this.asesores = a; },
      error: () => { this.esSupervision = false; this.asesores = []; },
    });
    this.cargar();
    this.refresco = setInterval(() => this.cargar(true), this.REFRESCO_MS);
    this.reloj = setInterval(() => (this.ahora = Date.now()), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
    clearInterval(this.reloj);
    clearTimeout(this.temporizadorAviso);
  }

  cargar(silencioso = false): void {
    this.cargando = !silencioso && this.casos.length === 0;
    this.svc.casos().subscribe({
      next: (c) => {
        this.casos = c;
        this.error = false;
        this.errorMotivo = '';
        this.cargando = false;
        this.ahora = Date.now();
        if (this.casoAbierto) {
          this.casoAbierto = c.find((x) => this.mismo(x, this.casoAbierto!)) ?? this.casoAbierto;
        }
      },
      error: (e) => {
        // Un fallo no puede verse igual que "no hay casos": eso ya nos pasó con la
        // cola del bot y se leyó como un bug.
        this.error = true;
        this.errorMotivo = this.motivoDe(e?.status);
        this.cargando = false;
      },
    });
  }

  private motivoDe(status?: number): string {
    if (status === 0) return 'No hay conexión con el servidor.';
    if (status === 401) return 'Tu sesión caducó. Vuelve a entrar.';
    if (status === 403) return 'Tu usuario no tiene permiso para ver esta agenda.';
    if (status === 404) return 'El servicio de agenda no está publicado todavía.';
    return 'El servidor respondió con un error' + (status ? ' (' + status + ')' : '') + '.';
  }

  // ---------- qué entra en cada mitad ----------

  /**
   * La promesa repartida no está en la cola de nadie: su sitio es la ficha de su
   * asesor. Si vence sin gestionar queda como no atendida y la vuelve a traer el
   * discador de campañas, que es donde se levanta; la agenda no la persigue.
   */
  private fueraDeLaCola(c: CasoAgendaBot): boolean {
    if (!this.esSupervision) return false;
    return c.tipo === 'PROMESA' && !!c.idAgenteAsignado;
  }

  /** La cola sin el filtro de día: de ahí salen los días que vale la pena ofrecer. */
  private get colaSinDia(): CasoAgendaBot[] {
    return this.casos
      .filter((c) => !this.fueraDeLaCola(c))
      .filter((c) => c.seguimiento !== 'COMPLETADO');
  }

  /** Lo pendiente, lo más antiguo arriba: es lo que lleva más tiempo esperando. */
  get visibles(): CasoAgendaBot[] {
    const q = this.buscar.trim().toLowerCase();
    return this.colaSinDia
      .filter((c) => !this.filtroDia || (c.cuando || '').slice(0, 10) === this.filtroDia)
      .filter((c) => !this.filtroTipo || c.tipo === this.filtroTipo)
      .filter((c) => !q || (`${c.nombreCliente ?? ''} ${c.documento ?? ''} ${c.telefono ?? ''}`)
        .toLowerCase().includes(q))
      .sort((a, b) => (a.cuando || '').localeCompare(b.cuando || ''));
  }

  get paginas(): number {
    return Math.max(1, Math.ceil(this.visibles.length / POR_PAGINA));
  }

  get filas(): CasoAgendaBot[] {
    const desde = Math.min(this.pagina, this.paginas - 1) * POR_PAGINA;
    return this.visibles.slice(desde, desde + POR_PAGINA);
  }

  get desdeFila(): number {
    return Math.min(this.pagina, this.paginas - 1) * POR_PAGINA + 1;
  }

  get hastaFila(): number {
    return this.desdeFila + this.filas.length - 1;
  }

  pasarPagina(paso: number): void {
    this.pagina = Math.max(0, Math.min(this.paginas - 1, this.pagina + paso));
  }

  /** Cuántos hay de ese tipo en la cola: la pastilla cuenta lo que se verá al pulsarla. */
  contar(tipo: string): number {
    return this.colaSinDia
      .filter((c) => !this.filtroDia || (c.cuando || '').slice(0, 10) === this.filtroDia)
      .filter((c) => c.tipo === tipo).length;
  }

  /**
   * Solo se ofrecen los tipos que hay en la cola: una pastilla que marca 0 no filtra
   * nada. A la supervisión eso le quita Promesas, que ya no pasan por su lista.
   */
  get tiposConCasos(): string[] {
    return this.clavesTipo.filter((t) => this.contar(t) > 0 || this.filtroTipo === t);
  }

  alternarTipo(tipo: string): void {
    this.filtroTipo = this.filtroTipo === tipo ? '' : tipo;
    this.pagina = 0;
  }

  // ---------- el reparto de hoy ----------

  /** Quién lleva qué de lo que repartió el sistema esta mañana. */
  get repartidasHoy(): RepartoAsesor[] {
    if (!this.esSupervision) return [];
    const hoy = BotAgendaComponent.iso(new Date());
    const cuenta = new Map<number, RepartoAsesor>();
    for (const c of this.casos) {
      if (c.tipo !== 'PROMESA' || !c.idAgenteAsignado) continue;
      if ((c.asignadoAt || '').slice(0, 10) !== hoy) continue;
      const ficha = this.asesores.find((a) => a.id === c.idAgenteAsignado);
      const fila = cuenta.get(c.idAgenteAsignado) ?? {
        idAgente: c.idAgenteAsignado,
        nombre: c.nombreAsignado ?? ficha?.nombre ?? 'Sin nombre',
        subcartera: ficha?.subcartera ?? '',
        cuantas: 0, monto: 0, sinGestionar: 0,
      };
      fila.cuantas++;
      fila.monto += c.monto ?? 0;
      if (c.seguimiento !== 'COMPLETADO') fila.sinGestionar++;
      cuenta.set(c.idAgenteAsignado, fila);
    }
    return [...cuenta.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  get totalRepartidoHoy(): number {
    return this.repartidasHoy.reduce((s, r) => s + r.cuantas, 0);
  }

  /** Las promesas de un asesor, incluidas las que dejó vencer: es el control de ella. */
  promesasDe(r: RepartoAsesor): CasoAgendaBot[] {
    return this.casos
      .filter((c) => c.tipo === 'PROMESA' && c.idAgenteAsignado === r.idAgente)
      .sort((a, b) => (a.cuando || '').localeCompare(b.cuando || ''));
  }

  /**
   * Cómo acabó una promesa: vencida sin gestionar es «No atendida», y a partir de ahí
   * la recupera el discador de campañas, no esta pantalla.
   */
  marcaDePromesa(c: CasoAgendaBot): { texto: string; tono: 'ok' | 'aviso' | 'malo' } {
    if (c.seguimiento === 'COMPLETADO') return { texto: 'Completado', tono: 'ok' };
    if ((c.diasVencida ?? 0) > 0) return { texto: 'No atendida', tono: 'malo' };
    return { texto: 'Pendiente', tono: 'aviso' };
  }

  // ---------- avatar y color, como en Personal ----------

  avatarDe(r: RepartoAsesor): SafeHtml {
    const ficha = this.asesores.find((a) => a.id === r.idAgente)?.idPersonal ?? r.idAgente;
    return this.avatares[ficha % this.avatares.length];
  }

  /** El color de cada subcartera, por su nombre: el mismo en todas las pantallas. */
  tonoDe(subcartera?: string): string {
    const n = (subcartera ?? '').toUpperCase();
    if (n.includes('PROPIO') || n.includes('PROPIA')) return 'var(--c-1)';
    if (n.includes('CASTIGO')) return 'var(--c-2)';
    if (/\b3\b/.test(n)) return 'var(--c-3)';
    if (/\b5\b/.test(n)) return 'var(--c-4)';
    return 'var(--c-gris)';
  }

  // ---------- estado de un caso ----------

  abierto(c: CasoAgendaBot): boolean {
    return c.seguimiento !== 'COMPLETADO' && c.estadoCita !== 'ATENDIDA';
  }

  minutosPara(c: CasoAgendaBot): number {
    if (!c.cuando) return 0;
    return Math.round((new Date(c.cuando).getTime() - this.ahora) / 60000);
  }

  cuentaAtras(c: CasoAgendaBot): string {
    const hoy = BotAgendaComponent.iso(new Date());
    const dia = (c.cuando || '').slice(0, 10);
    if (c.tipo === 'PROMESA') {
      if ((c.diasVencida ?? 0) > 0) return `Vencida hace ${c.diasVencida} d`;
      return dia === hoy ? 'Vence hoy' : 'Vence mañana';
    }
    if (dia !== hoy) return DIAS[new Date(c.cuando).getDay()].slice(0, 3);
    const m = this.minutosPara(c);
    if (m > 90) return `en ${Math.floor(m / 60)} h ${m % 60} min`;
    if (m > 0) return `en ${m} min`;
    const pasado = Math.abs(m);
    return pasado > 90 ? `hace ${Math.floor(pasado / 60)} h ${pasado % 60} min` : `hace ${pasado} min`;
  }

  /** La cita que toca ahora: se resalta para que no haya que buscarla. */
  inminente(c: CasoAgendaBot): boolean {
    return c.tipo === 'CITA' && this.abierto(c) && Math.abs(this.minutosPara(c)) <= 60;
  }

  /**
   * El botón de llamar se abre 15 minutos antes de la hora pactada y no se cierra
   * después: una cita que se pasó sigue habiendo que atenderla. En el resto de tipos
   * no hay hora que esperar, así que está siempre disponible.
   */
  puedeLlamar(c: CasoAgendaBot): boolean {
    if (!this.abierto(c)) return false;
    // La promesa la trabaja el asesor al que se la repartió el sistema. La supervisión
    // la ve para controlar que se haga, no para llamarla ella.
    if (this.esSupervision && c.tipo === 'PROMESA') return false;
    if (c.tipo !== 'CITA') return true;
    return this.minutosPara(c) <= MARGEN_LLAMADA_MIN;
  }

  motivoNoLlamar(c: CasoAgendaBot): string {
    if (this.esSupervision && c.tipo === 'PROMESA') {
      return 'La promesa la trabaja el asesor al que se le repartió.';
    }
    if (c.estadoCita === 'ATENDIDA') return 'La cita ya se atendió.';
    if (c.seguimiento === 'COMPLETADO') return 'Ya hubo gestión de una persona sobre este cliente.';
    const d = new Date(new Date(c.cuando).getTime() - MARGEN_LLAMADA_MIN * 60000);
    return `Se habilita a las ${this.hora(d.toISOString())}, ${MARGEN_LLAMADA_MIN} min antes de la hora pactada.`;
  }

  /**
   * Lo que se habló, armado con los datos duros que ya trae el caso. No se le pide al
   * modelo: el importe, las cuotas y la fecha los decidió el código durante la llamada.
   */
  negociado(c: CasoAgendaBot): { rotulo: string; valor: string }[] {
    if (c.tipo === 'PROMESA' && c.monto) {
      const lineas = [
        { rotulo: 'Clara ofreció', valor: `${c.totalCuotas ?? 1} cuotas de ${this.soles(c.monto)}` },
        { rotulo: 'El cliente aceptó', valor: `pagar el ${this.diaLegible(c.cuando)}` },
      ];
      if ((c.diasVencida ?? 0) > 0) lineas.push({ rotulo: 'Quedó pendiente', valor: 'el pago no figura' });
      return lineas;
    }
    if (c.tipo === 'CITA') {
      return [{ rotulo: 'El cliente pidió', valor: `que lo llamen a las ${this.hora(c.cuando)}` }];
    }
    return [];
  }

  // ---------- acciones ----------

  /**
   * Llamar es ir a gestión manual con el cliente ya buscado: ahí está la ficha, el
   * softphone y la tipificación. Esta pantalla no marca por su cuenta.
   */
  llamar(c: CasoAgendaBot, ev?: Event): void {
    ev?.stopPropagation();
    if (!this.puedeLlamar(c)) return;
    const documento = (c.documento || '').trim();
    this.router.navigate(['/manual-management'], {
      queryParams: documento ? { documento } : { telefono: c.telefono },
    });
  }

  recordar(r: RepartoAsesor): void {
    if (this.guardando) return;
    this.guardando = true;
    this.svc.recordar(r.idAgente, r.sinGestionar).subscribe({
      next: (res) => {
        this.guardando = false;
        // El aviso viaja por WebSocket: si no tiene Cashi abierto no le llega, y decir
        // "avisado" sin más haría creer que sí.
        this.flash(res?.enviado ? `Aviso enviado a ${r.nombre}` : `${r.nombre} no está conectado`);
      },
      error: () => {
        this.guardando = false;
        this.flash('No se pudo enviar el aviso');
      },
    });
  }

  abrirCaso(c: CasoAgendaBot): void {
    this.asesorAbierto = undefined;
    this.casoAbierto = c;
  }

  abrirAsesor(r: RepartoAsesor): void {
    this.casoAbierto = undefined;
    this.asesorAbierto = r;
  }

  cerrarFicha(): void {
    this.casoAbierto = undefined;
    this.asesorAbierto = undefined;
  }

  // ---------- presentación ----------

  mismo(a: CasoAgendaBot, b: CasoAgendaBot): boolean {
    return a.tipo === b.tipo && a.referencia === b.referencia;
  }

  hora(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  /** «lunes 28 de septiembre», con hoy, ayer y mañana dichos por su nombre. */
  diaLegible(iso?: string): string {
    if (!iso) return '—';
    const clave = iso.slice(0, 10);
    const d = new Date(clave + 'T00:00:00');
    const largo = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
    if (clave === BotAgendaComponent.iso(new Date())) return `hoy, ${largo}`;
    if (clave === BotAgendaComponent.iso(BotAgendaComponent.enDias(-1))) return `ayer, ${largo}`;
    if (clave === BotAgendaComponent.iso(BotAgendaComponent.enDias(1))) return `mañana, ${largo}`;
    return largo;
  }

  soles(n?: number): string {
    return 'S/ ' + (n ?? 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** Insignia con los tonos del sistema. */
  insignia(tono: 'ok' | 'aviso' | 'malo' | 'gris' | 'azul'): string {
    const base = 'inline-flex h-[22px] items-center gap-1 whitespace-nowrap rounded-full px-2 text-[11.5px] font-semibold';
    const tonos = {
      ok: 'bg-[#e8f6ee] text-[#15803d] dark:bg-emerald-950/60 dark:text-emerald-300',
      aviso: 'bg-[#fdf2dc] text-[#b45309] dark:bg-amber-950/50 dark:text-amber-300',
      malo: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/40 dark:text-red-300',
      gris: 'bg-[#eef2f7] text-[#475569] dark:bg-slate-800 dark:text-slate-300',
      azul: 'bg-[#eff5ff] text-[#1d4ed8] dark:bg-blue-950/60 dark:text-blue-300',
    };
    return `${base} ${tonos[tono]}`;
  }

  /** Estado de la cita, con su tono. */
  estadoCita(c: CasoAgendaBot): { texto: string; tono: 'ok' | 'gris' | 'azul' } {
    if (c.estadoCita === 'ATENDIDA') return { texto: 'Atendida', tono: 'ok' };
    if (c.estadoCita === 'NO_CONTESTA') return { texto: 'No contestó', tono: 'gris' };
    return { texto: 'Por atender', tono: 'azul' };
  }

  /** Texto del motivo, que llega como código del bot. */
  etiquetaMotivo(motivo?: string): string {
    if (!motivo) return '';
    return ({
      PIDE_ASESOR: 'Pidió un asesor',
      PIDE_REPROGRAMAR: 'Pidió otra fecha',
      NO_PUEDE: 'No podía atender',
      ACEPTA_SIN_CERRAR: 'Aceptó sin cerrar',
      ACUERDA_PAGO: 'Acordó pagar',
      CON_INTENCION: 'Con intención',
    } as Record<string, string>)[motivo] ?? motivo;
  }

  /** El título dice qué se está mirando, incluido el día cuando hay uno elegido. */
  get tituloLista(): string {
    const base = this.esSupervision ? 'Por gestionar' : 'Mis promesas';
    return this.filtroDia ? `${base} · ${this.diaLegible(this.filtroDia)}` : base;
  }

  private flash(m: string): void {
    this.aviso = m;
    clearTimeout(this.temporizadorAviso);
    this.temporizadorAviso = setTimeout(() => (this.aviso = ''), 2600);
  }

  private static iso(d: Date): string {
    return [d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0')].join('-');
  }

  private static enDias(dias: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    return d;
  }
}
