import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { LucideAngularModule } from 'lucide-angular';
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
  botonPrimarioChico: 'inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-[7px] bg-[#0f172a] px-3 text-[12px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 dark:bg-white dark:!text-slate-900 dark:hover:bg-slate-200',
  botonSecundario: 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonSecundarioAlto: 'inline-flex h-[38px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  cerrar: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] !text-[#5f6c80] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:!text-slate-400 dark:hover:bg-slate-800',
  tarjeta: 'flex min-w-0 flex-col rounded-xl border border-[#e6e9ee] bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  icono: 'flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f1f3f6] dark:bg-slate-800',
  rotulo: '!m-0 text-[11.5px] font-bold uppercase tracking-[0.05em] !text-[#5f6c80] dark:!text-slate-400',
  cifra: 'text-2xl font-extrabold leading-[1.3] tracking-[-0.02em] tabular-nums',
  unidad: 'ml-1.5 text-[12px] font-semibold tracking-normal text-[#5f6c80] dark:text-slate-400',
  pie: 'mt-auto pt-1.5 text-[11.5px] text-[#5f6c80] dark:text-slate-400',
  segmentos: 'inline-flex gap-0.5 rounded-full border border-[#e6e9ee] bg-white p-[3px] dark:border-slate-700 dark:bg-slate-900',
  tab: 'inline-flex h-[30px] items-center gap-[7px] whitespace-nowrap rounded-full px-3.5 text-[12.5px] font-semibold transition-colors',
  tabApagada: '!text-[#5f6c80] hover:!text-[#0f172a] dark:!text-slate-400 dark:hover:!text-slate-100',
  tabActiva: 'bg-[#0f172a] !text-white dark:bg-white dark:!text-[#0f172a]',
  dato: 'flex flex-col gap-0.5 rounded-[10px] border border-[#f1f3f6] bg-[#f8fafc] px-[10px] py-2 dark:border-slate-800 dark:bg-slate-950/40',
  datoValor: 'text-[13px] font-bold tabular-nums',
  panel: 'rounded-xl border border-[#e6e9ee] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-slate-800 dark:bg-slate-900',
  vacio: 'rounded-xl border border-[#e6e9ee] bg-white py-14 text-center dark:border-slate-800 dark:bg-slate-900',
  aviso: 'flex items-start gap-2 rounded-lg bg-[#fdf2dc] px-3 py-2.5 text-[12.5px] leading-snug text-[#92400e] dark:bg-amber-950/40 dark:text-amber-300',
  info: 'flex items-start gap-2 rounded-lg bg-[#eff5ff] px-3 py-2.5 text-[12.5px] leading-snug text-[#1e40af] dark:bg-blue-950/40 dark:text-blue-300',
  fondo: 'fundir fixed inset-0 z-40 bg-[#0f172a]/45',
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

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
               'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Un día de la lista, con sus casos ya ordenados. */
interface GrupoDia {
  clave: string;
  titulo: string;
  casos: CasoAgendaBot[];
}

/**
 * Agenda del bot: lo que Clara dejó y necesita a una persona.
 *
 * Es un REGISTRO, no un discador: aquí se ve con quién quedó el bot, a qué hora y
 * por qué, y la llamada se hace desde gestión manual, que es donde está la ficha
 * del cliente y la tipificación.
 *
 * La misma pantalla sirve a los dos roles: la supervisión ve todo y reparte, y un
 * asesor solo ve lo que le asignaron. El recorte lo hace el backend; aquí solo se
 * esconde lo que no le toca manejar.
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
  seleccionado?: CasoAgendaBot;
  asesores: AsesorAgenda[] = [];

  cargando = false;
  error = false;
  errorMotivo = '';
  mensaje = '';
  mensajeError = false;
  guardando = false;

  /** Si quien mira reparte trabajo. Se descubre probando el catálogo de asesores. */
  esSupervision = false;

  desde = BotAgendaComponent.iso(BotAgendaComponent.hace(6));
  hasta = BotAgendaComponent.iso(new Date());

  filtroTipo = '';
  filtroSeguimiento: 'TODOS' | 'PENDIENTE' | 'COMPLETADO' = 'TODOS';
  filtroAsesor = 'TODOS';
  buscar = '';

  /** Asesor elegido en la ficha, antes de pulsar Asignar. */
  asesorElegido?: number;

  private readonly REFRESCO_MS = 30000;
  private refresco?: ReturnType<typeof setInterval>;
  private reloj?: ReturnType<typeof setInterval>;
  ahora = Date.now();

  constructor(private svc: BotAgendaService, private router: Router) {}

  ngOnInit(): void {
    // Un 403 aquí es la respuesta esperable para un asesor, no un error: dice que
    // esta pantalla es de solo lectura para él y que no puede repartir.
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
  }

  cargar(silencioso = false): void {
    this.cargando = !silencioso && this.casos.length === 0;
    this.svc.casos(this.desde, this.hasta).subscribe({
      next: (c) => {
        this.casos = c;
        this.error = false;
        this.errorMotivo = '';
        this.cargando = false;
        this.ahora = Date.now();
        if (this.seleccionado) {
          this.seleccionado = c.find((x) => this.mismo(x, this.seleccionado!)) ?? this.seleccionado;
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

  // ---------- rango ----------

  cambiarRango(cual: 'hoy' | '7' | 'mes'): void {
    const hoy = new Date();
    if (cual === 'hoy') {
      this.desde = BotAgendaComponent.iso(hoy);
    } else if (cual === '7') {
      this.desde = BotAgendaComponent.iso(BotAgendaComponent.hace(6));
    } else {
      this.desde = BotAgendaComponent.iso(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
    }
    this.hasta = BotAgendaComponent.iso(hoy);
    this.cargar();
  }

  /** Qué atajo está marcado, para que el rango escrito a mano no marque ninguno. */
  rangoActivo(cual: 'hoy' | '7' | 'mes'): boolean {
    const hoy = new Date();
    if (this.hasta !== BotAgendaComponent.iso(hoy)) return false;
    if (cual === 'hoy') return this.desde === BotAgendaComponent.iso(hoy);
    if (cual === '7') return this.desde === BotAgendaComponent.iso(BotAgendaComponent.hace(6));
    return this.desde === BotAgendaComponent.iso(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
  }

  private static hace(dias: number): Date {
    const d = new Date();
    d.setDate(d.getDate() - dias);
    return d;
  }

  private static iso(d: Date): string {
    return [d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0')].join('-');
  }

  // ---------- filtros ----------

  alternarTipo(tipo: string): void {
    this.filtroTipo = this.filtroTipo === tipo ? '' : tipo;
  }

  /** Los casos que pasan todos los filtros de la pantalla. */
  get visibles(): CasoAgendaBot[] {
    const q = this.buscar.trim().toLowerCase();
    return this.casos
      .filter((c) => !this.filtroTipo || c.tipo === this.filtroTipo)
      .filter((c) => this.filtroSeguimiento === 'TODOS' || c.seguimiento === this.filtroSeguimiento)
      .filter((c) => this.pasaFiltroAsesor(c))
      .filter((c) => !q || (`${c.nombreCliente ?? ''} ${c.documento ?? ''} ${c.telefono ?? ''}`)
        .toLowerCase().includes(q));
  }

  private pasaFiltroAsesor(c: CasoAgendaBot): boolean {
    if (!this.esSupervision || this.filtroAsesor === 'TODOS') return true;
    if (this.filtroAsesor === 'SIN') return !c.idAgenteAsignado;
    return String(c.idAgenteAsignado ?? '') === this.filtroAsesor;
  }

  /** La lista, agrupada por día y con el día más reciente arriba. */
  get grupos(): GrupoDia[] {
    const porDia = new Map<string, CasoAgendaBot[]>();
    for (const c of this.visibles) {
      const clave = (c.cuando || '').slice(0, 10);
      if (!porDia.has(clave)) porDia.set(clave, []);
      porDia.get(clave)!.push(c);
    }
    return [...porDia.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([clave, casos]) => ({
        clave,
        titulo: this.tituloDia(clave),
        casos: casos.sort((x, y) =>
          (TIPOS[x.tipo]?.orden ?? 9) - (TIPOS[y.tipo]?.orden ?? 9) ||
          (x.cuando || '').localeCompare(y.cuando || '')),
      }));
  }

  private tituloDia(clave: string): string {
    if (!clave) return 'Sin fecha';
    const d = new Date(clave + 'T00:00:00');
    const largo = `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
    const hoy = BotAgendaComponent.iso(new Date());
    const ayer = BotAgendaComponent.iso(BotAgendaComponent.hace(1));
    if (clave === hoy) return `Hoy · ${largo}`;
    if (clave === ayer) return `Ayer · ${largo}`;
    return largo;
  }

  // ---------- cifras ----------

  contar(tipo: string): number {
    return this.casos.filter((c) => c.tipo === tipo && this.pasaFiltroAsesor(c)).length;
  }

  /** El pie de cada tarjeta: el dato que de verdad dice si hay trabajo pendiente. */
  pieDe(tipo: string): string {
    const propios = this.casos.filter((c) => c.tipo === tipo && this.pasaFiltroAsesor(c));
    if (tipo === 'PROMESA') {
      const total = propios.reduce((s, c) => s + (c.monto ?? 0), 0);
      return `${this.soles(total)} comprometidos`;
    }
    if (tipo === 'CITA') {
      const proximas = propios.filter((c) => {
        const m = this.minutosPara(c);
        return this.abierto(c) && m > -MARGEN_LLAMADA_MIN && m <= 60;
      }).length;
      if (proximas) return `${proximas} en la próxima hora`;
      return `${propios.filter((c) => this.abierto(c)).length} sin atender`;
    }
    return `${propios.filter((c) => c.seguimiento !== 'COMPLETADO').length} sin gestionar`;
  }

  get totalVisible(): number {
    return this.visibles.length;
  }

  // ---------- estado de un caso ----------

  /** Sigue vivo: nadie lo ha trabajado todavía. */
  abierto(c: CasoAgendaBot): boolean {
    return c.seguimiento !== 'COMPLETADO' && c.estadoCita !== 'ATENDIDA';
  }

  minutosPara(c: CasoAgendaBot): number {
    if (!c.cuando) return 0;
    return Math.round((new Date(c.cuando).getTime() - this.ahora) / 60000);
  }

  cuentaAtras(c: CasoAgendaBot): string {
    if (c.tipo === 'PROMESA') {
      return (c.diasVencida ?? 0) > 0 ? `Vencida hace ${c.diasVencida} d` : 'Vence hoy';
    }
    if ((c.cuando || '').slice(0, 10) !== BotAgendaComponent.iso(new Date())) {
      return DIAS[new Date(c.cuando).getDay()].slice(0, 3);
    }
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
    if (c.tipo !== 'CITA') return true;
    return this.minutosPara(c) <= MARGEN_LLAMADA_MIN;
  }

  motivoNoLlamar(c: CasoAgendaBot): string {
    if (c.estadoCita === 'ATENDIDA') return 'La cita ya se atendió.';
    if (c.seguimiento === 'COMPLETADO') return 'Ya hubo gestión de una persona sobre este cliente.';
    const d = new Date(new Date(c.cuando).getTime() - MARGEN_LLAMADA_MIN * 60000);
    return `Se habilita a las ${this.hora(d.toISOString())}, ${MARGEN_LLAMADA_MIN} min antes de la hora pactada.`;
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

  /** Cierre manual de una cita: la fila se queda, con su estado nuevo. */
  cerrarCita(c: CasoAgendaBot, contesto: boolean): void {
    if (this.guardando || !c.idAgenda) return;
    this.guardando = true;
    this.svc.cerrar(c.idAgenda, contesto).subscribe({
      next: () => {
        c.estadoCita = contesto ? 'ATENDIDA' : 'NO_CONTESTA';
        if (contesto) c.seguimiento = 'COMPLETADO';
        this.guardando = false;
        this.flash(contesto ? 'Cita marcada como atendida' : 'Cita marcada como no contestó');
      },
      error: () => {
        this.guardando = false;
        this.flash('No se pudo guardar el cierre', true);
      },
    });
  }

  /** Dejar el seguimiento a un asesor. Solo la supervisión llega hasta aquí. */
  asignar(c: CasoAgendaBot): void {
    if (this.guardando || !c.referencia || !this.asesorElegido) return;
    const elegido = this.asesores.find((a) => a.id === Number(this.asesorElegido));
    this.guardando = true;
    this.svc.asignar(c.tipo, c.referencia, Number(this.asesorElegido)).subscribe({
      next: () => {
        c.idAgenteAsignado = elegido?.id;
        c.nombreAsignado = elegido?.nombre;
        this.guardando = false;
        this.flash(`Seguimiento asignado a ${elegido?.nombre ?? 'el asesor'}`);
      },
      error: () => {
        this.guardando = false;
        this.flash('No se pudo asignar el seguimiento', true);
      },
    });
  }

  abrir(c: CasoAgendaBot): void {
    this.seleccionado = c;
    this.asesorElegido = c.idAgenteAsignado ?? this.asesores[0]?.id;
  }

  cerrarDetalle(): void {
    this.seleccionado = undefined;
  }

  // ---------- presentación ----------

  mismo(a: CasoAgendaBot, b: CasoAgendaBot): boolean {
    return a.tipo === b.tipo && a.referencia === b.referencia;
  }

  hora(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
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
  estadoCita(c: CasoAgendaBot): { texto: string; tono: 'ok' | 'aviso' | 'gris' | 'azul' } {
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

  claseTab(activa: boolean): string {
    return `${CLASES.tab} ${activa ? CLASES.tabActiva : CLASES.tabApagada}`;
  }

  private flash(m: string, error = false): void {
    this.mensaje = m;
    this.mensajeError = error;
    setTimeout(() => (this.mensaje = ''), 3500);
  }
}
