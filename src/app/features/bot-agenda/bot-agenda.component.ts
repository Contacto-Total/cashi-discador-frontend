import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';
import { LucideAngularModule } from 'lucide-angular';
import { BotAgendaService, BotAgendaFila } from './bot-agenda.service';

/**
 * Clases que se repiten en la pantalla, con el sistema de Gestión de Tenores (el
 * mismo de bot de voz y control de asistencia).
 *
 * El CSS global del tema claro pisa inputs y algunas utilidades y, al no estar en
 * una capa, gana a Tailwind: por eso los colores van en hexadecimal y los controles
 * llevan `!`.
 */
const CLASES = {
  etiqueta: 'text-xs font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  ayuda: 'text-[12px] leading-snug text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100',
  botonPrimario: 'inline-flex h-[38px] items-center justify-center gap-[7px] whitespace-nowrap rounded-lg bg-[#0f172a] px-4 text-[13.5px] font-semibold !text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:!text-slate-900 dark:hover:bg-slate-200',
  botonLlamar: 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] bg-[#15803d] px-3 text-[12.5px] font-semibold !text-white transition-colors hover:bg-[#166534] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:!bg-[#eef2f7] disabled:!text-[#5f6c80] disabled:opacity-100 dark:disabled:!bg-slate-800 dark:disabled:!text-slate-400',
  botonSecundario: 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonSecundarioAlto: 'inline-flex h-[38px] items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  botonMarcado: '!border-[#0f172a] !bg-[#eef2f7] dark:!border-white dark:!bg-slate-700',
  botonIcono: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] border border-[#d5dbe3] bg-white !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  cerrar: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] !text-[#5f6c80] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:!text-slate-400 dark:hover:bg-slate-800',
  tarjeta: 'flex flex-col gap-3.5 rounded-xl border border-[#e6e9ee] bg-white px-[18px] py-4 dark:border-slate-800 dark:bg-slate-900',
  dato: 'flex flex-col gap-0.5 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40',
  datoTitulo: 'text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  datoValor: 'text-[15px] font-bold tabular-nums',
  chip: 'inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full bg-[#f4f6f9] px-2.5 text-xs font-semibold text-[#334155] dark:bg-slate-800 dark:text-slate-300',
  chipBot: 'inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full bg-[#eff5ff] px-2.5 text-xs font-semibold text-[#1d4ed8] dark:bg-blue-950 dark:text-blue-300',
  aviso: 'flex items-start gap-2 rounded-lg bg-[#fdf2dc] px-3 py-2.5 text-[12.5px] leading-snug text-[#92400e] dark:bg-amber-950/40 dark:text-amber-300',
  info: 'flex items-start gap-2 rounded-lg bg-[#eff5ff] px-3 py-2.5 text-[12.5px] leading-snug text-[#1e40af] dark:bg-blue-950/40 dark:text-blue-300',
  error: 'text-[12.5px] font-semibold text-[#b91c1c] dark:text-red-400',
  th: 'whitespace-nowrap border-b border-[#e6e9ee] bg-[#f8fafc] px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
  td: 'border-b border-[#eef1f5] px-3 py-2.5 align-top text-[13px] dark:border-slate-800',
  fondo: 'fundir fixed inset-0 z-40 bg-[#0f172a]/45 backdrop-blur-[2px]',
};

/** Minutos antes de la hora pactada en los que ya se puede llamar. */
const MARGEN_LLAMADA_MIN = 15;

/**
 * Llamadas que el bot dejó agendadas (F1f).
 *
 * Es un REGISTRO, no un discador: aquí se ve con quién quedó el bot, a qué hora y
 * por qué, y la llamada se hace desde gestión manual, que es donde está la ficha
 * del cliente y la tipificación.
 *
 * Hoy la atiende la supervisora: las citas se crean sin asesor asignado, así que
 * la pantalla abre en "todas" para quien tenga permiso de supervisión y solo cae
 * en "mías" si el usuario no lo tiene.
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

  agendas: BotAgendaFila[] = [];
  seleccionada?: BotAgendaFila;
  cargando = false;
  error = false;
  /** Por qué falló, para no dar el mismo mensaje a un 403 que a un servicio caído. */
  errorMotivo = '';
  mensaje = '';
  mensajeError = false;
  cerrando = false;

  /** Si el usuario puede ver las de todos. Se descubre probando el endpoint. */
  puedeVerTodas = false;
  verTodas = false;

  /** Filtro por estado; vacío = todas. */
  filtroEstado = '';

  fecha = new Date().toISOString().slice(0, 10);

  /** Refresco suave: el bot puede añadir citas mientras miras. */
  private readonly REFRESCO_MS = 15000;
  private refresco?: ReturnType<typeof setInterval>;
  /** Reloj propio: la cuenta atrás tiene que avanzar aunque no llegue nada nuevo. */
  private reloj?: ReturnType<typeof setInterval>;
  ahora = Date.now();

  constructor(private svc: BotAgendaService, private router: Router) {}

  ngOnInit(): void {
    // Se prueba una vez: si responde, es supervisión o admin, y entonces la vista
    // útil es "todas" —un supervisor no tiene citas propias—. Un 403 aquí es
    // esperable para un asesor y no se pinta como error.
    this.svc.todas(this.fecha).subscribe({
      next: (a) => {
        this.puedeVerTodas = true;
        this.verTodas = true;
        this.agendas = a;
        this.cargando = false;
      },
      error: () => {
        this.puedeVerTodas = false;
        this.verTodas = false;
        this.cargar();
      },
    });
    this.refresco = setInterval(() => this.cargar(true), this.REFRESCO_MS);
    this.reloj = setInterval(() => (this.ahora = Date.now()), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
    clearInterval(this.reloj);
  }

  cargar(silencioso = false): void {
    this.cargando = !silencioso && this.agendas.length === 0;
    const fuente = this.verTodas ? this.svc.todas(this.fecha) : this.svc.mias(this.fecha);
    fuente.subscribe({
      next: (a) => {
        this.agendas = a;
        this.error = false;
        this.errorMotivo = '';
        this.cargando = false;
        this.ahora = Date.now();
        // La ficha abierta se refresca con su fila: si otro la cerró, que se vea.
        if (this.seleccionada) {
          this.seleccionada = a.find((x) => x.id === this.seleccionada!.id) ?? this.seleccionada;
        }
      },
      error: (e) => {
        // Un fallo no puede verse igual que "no hay citas": eso ya nos pasó con la
        // cola del bot y se leyó como un bug.
        this.error = true;
        this.errorMotivo = this.motivoDe(e?.status);
        this.cargando = false;
      },
    });
  }

  /**
   * Traduce el código HTTP a algo accionable. Sin esto, un 404 del gateway y un
   * 403 de permisos daban el mismo texto vago y no se sabía a quién avisar.
   */
  private motivoDe(status?: number): string {
    if (status === 0) return 'No hay conexión con el servidor.';
    if (status === 401) return 'Tu sesión caducó. Vuelve a entrar.';
    if (status === 403) return 'Tu usuario no tiene permiso para ver esta agenda.';
    if (status === 404) return 'El servicio de agenda no está publicado todavía.';
    return 'El servidor respondió con un error' + (status ? ' (' + status + ')' : '') + '.';
  }

  alternarAlcance(): void {
    this.verTodas = !this.verTodas;
    this.cargar();
  }

  cambiarFecha(v: string): void {
    this.fecha = v;
    this.cargar();
  }

  alternarFiltro(estado: string): void {
    this.filtroEstado = this.filtroEstado === estado ? '' : estado;
  }

  contar(estado: string): number {
    return this.agendas.filter((a) => a.estado === estado).length;
  }

  /**
   * Lo que se pinta: primero lo que falta por hacer y, dentro, por hora.
   *
   * Las cerradas NO se quitan de la lista: el supervisor necesita ver qué pasó con
   * cada cita del día, y que una desaparezca al marcarla se lee como que se perdió.
   */
  get filas(): BotAgendaFila[] {
    const orden = (a: BotAgendaFila) => (this.abierta(a) ? 0 : 1);
    return this.agendas
      .filter((a) => !this.filtroEstado || a.estado === this.filtroEstado)
      .slice()
      .sort((a, b) =>
        orden(a) - orden(b) ||
        new Date(a.fechaHoraPactada).getTime() - new Date(b.fechaHoraPactada).getTime());
  }

  /** Sigue viva: nadie la ha cerrado todavía. */
  abierta(a: BotAgendaFila): boolean {
    return a.estado === 'PENDIENTE' || a.estado === 'VENCIDA';
  }

  /** Minutos que faltan; negativo si ya pasó la hora. */
  minutosPara(a: BotAgendaFila): number {
    return Math.round((new Date(a.fechaHoraPactada).getTime() - this.ahora) / 60000);
  }

  cuentaAtras(a: BotAgendaFila): string {
    const m = this.minutosPara(a);
    if (m < -60) return `hace ${Math.floor(Math.abs(m) / 60)} h`;
    if (m < -1) return `hace ${Math.abs(m)} min`;
    if (m <= 0) return 'ahora';
    if (m < 60) return `en ${m} min`;
    return `en ${Math.floor(m / 60)} h ${m % 60} min`;
  }

  /** Inminente: es la que hay que llamar ya. */
  esInminente(a: BotAgendaFila): boolean {
    const m = this.minutosPara(a);
    return m <= 5 && m >= -30 && this.abierta(a);
  }

  /**
   * El botón de llamar se abre {{MARGEN_LLAMADA_MIN}} minutos antes de la hora y no
   * se cierra después: una cita que se pasó sigue habiendo que atenderla. Antes de
   * esa ventana queda deshabilitado con el motivo a la vista, no en gris a secas.
   */
  puedeLlamar(a: BotAgendaFila): boolean {
    return this.abierta(a) && this.minutosPara(a) <= MARGEN_LLAMADA_MIN;
  }

  motivoNoLlamar(a: BotAgendaFila): string {
    if (!this.abierta(a)) return `Esta cita ya está ${this.etiquetaEstado(a.estado).toLowerCase()}`;
    return `Se habilita a las ${this.hora(this.restar(a.fechaHoraPactada, MARGEN_LLAMADA_MIN))}`;
  }

  private restar(iso: string, minutos: number): string {
    return new Date(new Date(iso).getTime() - minutos * 60000).toISOString();
  }

  hora(iso?: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Llamar es ir a gestión manual con el cliente ya buscado: ahí está la ficha, el
   * softphone y la tipificación. Esta pantalla no marca por su cuenta.
   */
  llamar(a: BotAgendaFila, ev?: Event): void {
    ev?.stopPropagation();
    if (!this.puedeLlamar(a)) return;
    const documento = (a.documento || '').trim();
    this.router.navigate(['/manual-management'], {
      queryParams: documento
        ? { documento, agenda: a.id }
        : { telefono: a.telefono, agenda: a.id },
    });
  }

  /** Cierre manual: la fila se queda, con su estado nuevo. */
  cerrarCita(a: BotAgendaFila, contesto: boolean, ev?: Event): void {
    ev?.stopPropagation();
    if (this.cerrando) return;
    this.cerrando = true;
    this.svc.cerrar(a.id, contesto).subscribe({
      next: () => {
        a.estado = contesto ? 'ATENDIDA' : 'NO_CONTESTA';
        a.detalleCierre = 'Cerrada por el asesor';
        this.cerrando = false;
        this.flash(contesto ? 'Cita marcada como atendida' : 'Cita marcada como no contestó');
      },
      error: () => {
        this.cerrando = false;
        this.flash('No se pudo guardar el cierre', true);
      },
    });
  }

  etiquetaEstado(estado: string): string {
    return ({
      PENDIENTE: 'Pendiente',
      ATENDIDA: 'Atendida',
      NO_CONTESTA: 'No contestó',
      VENCIDA: 'Sin llamar',
      CANCELADA: 'Cancelada',
    } as Record<string, string>)[estado] ?? estado;
  }

  /** Clases de la insignia de estado, con los tonos del sistema. */
  claseEstado(estado: string): string {
    const base = 'inline-flex h-[22px] items-center whitespace-nowrap rounded-full px-2 text-[11.5px] font-semibold';
    const tonos: Record<string, string> = {
      PENDIENTE: 'bg-[#eff5ff] text-[#1d4ed8] dark:bg-blue-950/60 dark:text-blue-300',
      ATENDIDA: 'bg-[#e8f6ee] text-[#15803d] dark:bg-emerald-950/60 dark:text-emerald-300',
      NO_CONTESTA: 'bg-[#fdf2dc] text-[#b45309] dark:bg-amber-950/50 dark:text-amber-300',
      VENCIDA: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/40 dark:text-red-300',
      CANCELADA: 'bg-[#eef2f7] text-[#475569] dark:bg-slate-800 dark:text-slate-300',
    };
    return `${base} ${tonos[estado] ?? tonos['CANCELADA']}`;
  }

  /** Pastilla de filtro por estado, del mismo sistema que las de bot de voz. */
  clasePastilla(estado: string): string {
    const base = 'inline-flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-[12.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]';
    if (this.filtroEstado === estado) {
      return `${base} border-[#0f172a] bg-[#0f172a] !text-white dark:border-white dark:bg-white dark:!text-slate-900`;
    }
    return `${base} border-[#d5dbe3] bg-white !text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-700 dark:bg-slate-800 dark:!text-slate-200`;
  }

  /**
   * De dónde salió la cita. Hoy todas son del bot; el campo existe para cuando las
   * asesoras registren las suyas desde esta misma pantalla.
   */
  esDelBot(a: BotAgendaFila): boolean {
    return (a.origen ?? 'BOT') === 'BOT';
  }

  /** Texto del motivo, que llega como código del bot. */
  etiquetaMotivo(motivo?: string): string {
    if (!motivo) return 'Sin motivo';
    return ({
      PIDE_ASESOR: 'Pidió que le llamen',
      PIDE_REPROGRAMAR: 'Pidió otra fecha',
      NO_PUEDE: 'No podía atender',
      ACEPTA_SIN_CERRAR: 'Interesado, sin cerrar',
    } as Record<string, string>)[motivo] ?? motivo;
  }

  quienLaAtiende(a: BotAgendaFila): string {
    return a.nombreAgente || 'Por asignar';
  }

  abrir(a: BotAgendaFila): void { this.seleccionada = a; }
  cerrarDetalle(): void { this.seleccionada = undefined; }

  private flash(m: string, error = false): void {
    this.mensaje = m;
    this.mensajeError = error;
    setTimeout(() => (this.mensaje = ''), 3500);
  }
}
