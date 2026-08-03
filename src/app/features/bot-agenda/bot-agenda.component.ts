import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BotAgendaService, BotAgendaFila } from './bot-agenda.service';

/**
 * Llamadas que el bot dejó agendadas (F1f).
 *
 * Es un REGISTRO, no un discador: el sistema no marca nada. Aquí el asesor ve con
 * quién quedó el bot, a qué hora y por qué, y llama con su gestión normal.
 *
 * Existe porque una notificación se pierde y una lista no: el asesor puede estar
 * en llamada cuando llega el aviso, o haber recargado la pantalla.
 *
 * Dos modos en el mismo componente: el asesor ve las suyas, quien tenga permiso de
 * supervisión las ve todas. Lo decide el backend, no el front — `/mias` filtra por
 * el usuario del token.
 */
@Component({
  selector: 'app-bot-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './bot-agenda.component.html',
  styleUrls: ['./bot-agenda.component.css'],
})
export class BotAgendaComponent implements OnInit, OnDestroy {
  agendas: BotAgendaFila[] = [];
  seleccionada?: BotAgendaFila;
  cargando = false;
  error = false;
  /** Por qué falló, para no dar el mismo mensaje a un 403 que a un servicio caído. */
  errorMotivo = '';
  mensaje = '';

  /** Si el usuario puede ver las de todos. Se descubre probando el endpoint. */
  puedeVerTodas = false;
  verTodas = false;

  fecha = new Date().toISOString().slice(0, 10);

  /** Refresco suave: otro asesor o el bot pueden añadir citas mientras miras. */
  private readonly REFRESCO_MS = 15000;
  private refresco?: ReturnType<typeof setInterval>;

  constructor(private svc: BotAgendaService) {}

  ngOnInit(): void {
    this.cargar();
    // Se prueba una vez: si responde, es supervisor o admin y se le ofrece el
    // conmutador. Un 403 aqui es esperable y no se muestra como error.
    this.svc.todas(this.fecha).subscribe({
      next: () => (this.puedeVerTodas = true),
      error: () => (this.puedeVerTodas = false),
    });
    this.refresco = setInterval(() => this.cargar(true), this.REFRESCO_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
  }

  cargar(silencioso = false): void {
    this.cargando = !silencioso;
    const fuente = this.verTodas ? this.svc.todas(this.fecha) : this.svc.mias(this.fecha);
    fuente.subscribe({
      next: (a) => { this.agendas = a; this.error = false; this.errorMotivo = ''; this.cargando = false; },
      error: (e) => {
        // Un fallo no puede verse igual que "no tienes agendas": eso ya nos pasó
        // con la cola del bot y se leyó como un bug.
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

  contar(estado: string): number {
    return this.agendas.filter((a) => a.estado === estado).length;
  }

  /** Las que todavía van a ocurrir, que es lo que el asesor necesita ver arriba. */
  get proximas(): BotAgendaFila[] {
    return this.agendas.filter((a) => a.estado === 'PENDIENTE');
  }

  get cerradas(): BotAgendaFila[] {
    return this.agendas.filter((a) => a.estado !== 'PENDIENTE');
  }

  /** Minutos que faltan; negativo si ya pasó la hora. */
  minutosPara(a: BotAgendaFila): number {
    return Math.round((new Date(a.fechaHoraPactada).getTime() - Date.now()) / 60000);
  }

  cuentaAtras(a: BotAgendaFila): string {
    const m = this.minutosPara(a);
    if (m < -1) return `hace ${Math.abs(m)} min`;
    if (m <= 0) return 'ahora';
    if (m < 60) return `en ${m} min`;
    return `en ${Math.floor(m / 60)} h ${m % 60} min`;
  }

  /** Inminente: es la que el asesor tiene que tener presente ya. */
  esInminente(a: BotAgendaFila): boolean {
    const m = this.minutosPara(a);
    return m <= 5 && a.estado === 'PENDIENTE';
  }

  etiquetaEstado(estado: string): string {
    return ({
      PENDIENTE: 'Pendiente',
      ATENDIDA: 'Atendida',
      NO_CONTESTA: 'No contestó',
      CANCELADA: 'Cancelada',
    } as Record<string, string>)[estado] ?? estado;
  }

  abrir(a: BotAgendaFila): void { this.seleccionada = a; }
  cerrarDetalle(): void { this.seleccionada = undefined; }

  private flash(m: string, _error = false): void {
    this.mensaje = m;
    setTimeout(() => (this.mensaje = ''), 3500);
  }
}
