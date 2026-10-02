import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { SipService } from '../../core/services/sip.service';
import { GestionLockService } from '../../core/services/gestion-lock.service';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { InactivityService } from '../../core/services/inactivity.service';
import { AgentState, AgentStatus } from '../../core/models/agent-status.model';

export type EstadoMantenimiento = 'OPERATIVO' | 'PROGRAMADO' | 'EN_DETENCION' | 'BLOQUEADO';

/** Los instantes llegan en milisegundos; `ahora` es el reloj del servidor. */
export interface Mantenimiento {
  estado: EstadoMantenimiento;
  inmediato: boolean;
  entradaCerrada: boolean;
  inicioProgramado: number | null;
  inicioDetencion: number | null;
  limiteDetencion: number | null;
  inicioBloqueo: number | null;
  ahora: number;
}

export interface EnGestion {
  idUsuario: number;
  nombre: string;
  subcartera: string | null;
  estado: 'EN_LLAMADA' | 'TIPIFICANDO';
  desde: number | null;
}

export interface MantenimientoAvance {
  mantenimiento: Mantenimiento;
  conectados: number;
  enSoporte: number;
  enPausa: number;
  enLlamada: number;
  tipificando: number;
  campanasDetenidas: number;
  colasDetenidas: number;
  /** Desde cuando no hay nada en curso; null si algo sigue activo. */
  reposoDesde: number | null;
  enGestion: EnGestion[];
}

export interface FilaHistorial {
  id: number;
  inmediato: boolean;
  inicio: number | null;
  bloqueo: number | null;
  fin: number;
  detencionSegundos: number | null;
  usuario: string | null;
  resultado: 'LIBERADO' | 'CANCELADO';
}

export interface HistorialMantenimiento {
  filas: FilaHistorial[];
  pagina: number;
  paginas: number;
  total: number;
}

export interface AvisoMantenimiento {
  titulo: string;
  texto: string;
  cerrable: boolean;
}

/** Pausas que el asesor puede marcar desde la pantalla de mantenimiento. */
export const PAUSAS_MANTENIMIENTO: AgentState[] = [
  AgentState.SOPORTE, AgentState.COMIDA, AgentState.REFRIGERIO, AgentState.SSHH,
  AgentState.AUSENTE, AgentState.EN_REUNION, AgentState.CAPACITACION
];

/** Marca que la recarga la provoca la liberacion: el aviso de desconexion no se envia. */
export const CLAVE_RECARGA = 'cashi_recarga_mantenimiento';
/** Lo emite el interceptor al recibir un 503 de mantenimiento. */
export const EVENTO_503 = 'cashi:mantenimiento';

const SONDEO_NORMAL = 20_000;
const SONDEO_ACTIVO = 3_000;
/** Estados en los que el agente puede tener una gestion sin guardar. */
const EN_GESTION: AgentState[] = [
  AgentState.EN_LLAMADA, AgentState.TIPIFICANDO, AgentState.GESTION_MANUAL, AgentState.SEGUIMIENTO
];
const COMPROBAR_RECARGA = 3000;
const AVISO = 10 * 60_000;
const RECORDATORIO = 5 * 60_000;

export const dosDigitos = (n: number) => String(n).padStart(2, '0');
export const horaCorta = (ms: number) => {
  const f = new Date(ms);
  return `${dosDigitos(f.getHours())}:${dosDigitos(f.getMinutes())}`;
};
export const cuenta = (ms: number) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${dosDigitos(Math.floor(s / 60))}:${dosDigitos(s % 60)}`;
};

/**
 * Estado del mantenimiento para toda la aplicacion.
 *
 * Decide tres cosas por usuario: que aviso previo ve, si su pantalla esta
 * bloqueada y si el backend esta reiniciando. El bloqueo es individual: quien
 * tiene una llamada o una gestion sin guardar sigue trabajando y se bloquea al
 * terminar.
 */
@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly ws = inject(WebsocketService);
  private readonly sip = inject(SipService);
  private readonly gestionLock = inject(GestionLockService);
  private readonly agentStatus = inject(AgentStatusService);
  private readonly inactividad = inject(InactivityService);
  private readonly router = inject(Router);
  private readonly zone = inject(NgZone);

  private readonly api = `${environment.gatewayUrl}/mantenimiento`;

  readonly datos = signal<Mantenimiento | null>(null);
  /** El backend no responde y lo ultimo que se supo es que habia mantenimiento. */
  readonly reiniciando = signal(false);
  /** Reloj del servidor, al segundo mientras hay mantenimiento. */
  readonly ahora = signal(Date.now());
  /** Llamada activa, gestion sin guardar o tipificacion en curso. */
  readonly ocupado = signal(false);
  readonly enPantallaDeGestion = signal(false);
  readonly estadoAgente = signal<AgentStatus | null>(null);

  private desfase = 0;
  private esAdmin = signal(false);
  private avisoCerrado = signal<number | null>(null);
  private reloj?: ReturnType<typeof setInterval>;
  private periodo = 0;
  private ultimoSondeo = 0;
  private suscripciones: Subscription[] = [];
  private recargaPendiente = false;
  private comprobandoRecarga = false;
  private ultimaComprobacion = 0;
  private bloqueoAnterior = false;

  readonly activo = computed(() => {
    const d = this.datos();
    return !!d && d.estado !== 'OPERATIVO';
  });

  /** Aviso previo. No sale a administradores ni a quien esta en una gestion. */
  readonly aviso = computed<AvisoMantenimiento | null>(() => {
    const d = this.datos();
    if (!d || d.estado !== 'PROGRAMADO' || !d.inicioProgramado || this.esAdmin()
        || this.ocupado() || this.enPantallaDeGestion()) {
      return null;
    }
    const falta = d.inicioProgramado - this.ahora();
    if (falta <= 0) {
      return null;
    }
    if (d.inmediato) {
      return {
        titulo: 'Entramos en mantenimiento en 60 segundos',
        texto: `No inicies una gestión nueva. Quedan ${cuenta(falta)}.`,
        cerrable: false
      };
    }
    const hora = horaCorta(d.inicioProgramado);
    if (falta <= RECORDATORIO) {
      return { titulo: 'Mantenimiento en 5 minutos', texto: `A las ${hora} se bloqueará la pantalla.`, cerrable: false };
    }
    if (falta <= AVISO && this.avisoCerrado() !== d.inicioProgramado) {
      return { titulo: `Mantenimiento a las ${hora}`, texto: 'A esa hora se bloqueará la pantalla.', cerrable: true };
    }
    return null;
  });

  /** La pantalla de mantenimiento tapa la aplicacion de este usuario. */
  readonly bloqueado = computed(() => {
    const d = this.datos();
    if (!d || this.esAdmin() || this.ocupado()) {
      return false;
    }
    return d.estado === 'BLOQUEADO' || (d.estado === 'EN_DETENCION' && d.entradaCerrada);
  });

  constructor() {
    window.addEventListener(EVENTO_503, () => this.zone.run(() => this.consultar()));
  }

  /** Al iniciar sesion. Se puede llamar mas de una vez. */
  iniciar(): void {
    this.detener();
    const usuario = this.auth.getCurrentUser();
    this.esAdmin.set(usuario?.role === 'ADMIN');
    sessionStorage.removeItem(CLAVE_RECARGA);

    this.suscripciones.push(
      this.ws.subscribe('/topic/mantenimiento').subscribe(d => this.recibir(d as Mantenimiento)),
      this.agentStatus.currentStatus$.subscribe(s => this.estadoAgente.set(s))
    );
    // El estado del agente se sigue en todas las pantallas, no solo en la de agente:
    // de el depende que no se le bloquee la pantalla en plena tipificacion.
    if (usuario?.role === 'AGENT') {
      this.suscripciones.push(
        this.agentStatus.subscribeToStatusUpdates(Number(usuario.id)).subscribe(),
        this.agentStatus.getAgentStatus(Number(usuario.id)).subscribe({ error: () => undefined })
      );
    }
    this.consultar();
    this.fijarReloj(SONDEO_NORMAL);
  }

  /** Al cerrar sesion. */
  detener(): void {
    clearInterval(this.reloj);
    this.reloj = undefined;
    this.periodo = 0;
    this.suscripciones.forEach(s => s.unsubscribe());
    this.suscripciones = [];
    this.datos.set(null);
    this.reiniciando.set(false);
    this.bloqueoAnterior = false;
    this.recargaPendiente = false;
    this.inactividad.reanudar();
  }

  cerrarAviso(): void {
    this.avisoCerrado.set(this.datos()?.inicioProgramado ?? null);
  }

  avance(): Observable<MantenimientoAvance> {
    return this.http.get<MantenimientoAvance>(`${this.api}/avance`).pipe(tap(a => this.recibir(a.mantenimiento)));
  }

  historial(pagina: number, porPagina = 5): Observable<HistorialMantenimiento> {
    return this.http.get<HistorialMantenimiento>(`${this.api}/historial`, { params: { pagina, porPagina } });
  }

  /** Reloj del servidor en este instante. */
  horaServidor(): number {
    return Date.now() + this.desfase;
  }

  programar(hora: string): Observable<Mantenimiento> {
    return this.accion('programar', { hora });
  }

  iniciarAhora(): Observable<Mantenimiento> {
    return this.accion('iniciar');
  }

  cancelar(): Observable<Mantenimiento> {
    return this.accion('cancelar');
  }

  bloquear(): Observable<Mantenimiento> {
    return this.accion('bloquear');
  }

  liberar(): Observable<Mantenimiento> {
    return this.accion('liberar');
  }

  /** Vuelve a leer el estado; lo usa el panel tras un conflicto entre administradores. */
  consultar(): void {
    this.ultimoSondeo = Date.now();
    this.http.get<Mantenimiento>(`${this.api}/estado`).subscribe({
      next: d => this.recibir(d),
      error: () => {
        // Sin backend en pleno mantenimiento: es el reinicio del despliegue.
        if (this.activo()) {
          this.reiniciando.set(true);
        }
      }
    });
  }

  cambiarEstadoAgente(estado: AgentState): Observable<unknown> {
    const id = this.auth.getCurrentUser()?.id;
    return this.agentStatus.changeStatus(Number(id), { estado, notas: 'Mantenimiento del sistema' });
  }

  private accion(nombre: string, cuerpo: unknown = {}): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(`${this.api}/${nombre}`, cuerpo).pipe(tap(d => this.recibir(d)));
  }

  private recibir(d: Mantenimiento): void {
    const antes = this.datos();
    this.desfase = d.ahora - Date.now();
    this.reiniciando.set(false);
    this.datos.set(d);
    this.ahora.set(Date.now() + this.desfase);
    // Tras un bloqueo hubo despliegue: se recarga para tomar la version nueva.
    if (antes?.estado === 'BLOQUEADO' && d.estado === 'OPERATIVO' && !this.esAdmin()) {
      this.recargaPendiente = true;
    }
    // Con una recarga pendiente el reloj sigue al segundo, para recargar en cuanto se pueda.
    this.fijarReloj(d.estado === 'OPERATIVO' && !this.recargaPendiente ? SONDEO_NORMAL : 1000);
    this.evaluar();
    this.recargarSiSePuede();
  }

  private fijarReloj(periodo: number): void {
    if (this.periodo === periodo && this.reloj) {
      return;
    }
    clearInterval(this.reloj);
    this.periodo = periodo;
    this.reloj = setInterval(() => this.latido(), periodo);
  }

  private latido(): void {
    if (!this.auth.isAuthenticated()) {
      return;
    }
    this.ahora.set(Date.now() + this.desfase);
    this.evaluar();
    this.recargarSiSePuede();
    const cada = this.activo() ? SONDEO_ACTIVO : SONDEO_NORMAL;
    if (Date.now() - this.ultimoSondeo >= cada) {
      this.consultar();
    }
  }

  /** Recalcula lo que depende de servicios sin señales: llamada, gestion y ruta. */
  private evaluar(): void {
    const estado = this.estadoAgente()?.estadoActual;
    this.ocupado.set(this.sip.enLlamada
      || this.gestionLock.isLocked
      || estado === AgentState.EN_LLAMADA
      || estado === AgentState.TIPIFICANDO);
    this.enPantallaDeGestion.set(this.router.url.startsWith('/collection-management'));

    const bloqueado = this.bloqueado();
    if (bloqueado && !this.bloqueoAnterior) {
      this.alBloquear();
    }
    if (bloqueado) {
      this.inactividad.pausar();
    } else {
      this.inactividad.reanudar();
    }
    this.bloqueoAnterior = bloqueado;
  }

  /**
   * Al aparecer la pantalla, el asesor que no estaba en una pausa queda en
   * Soporte. Los disponibles ya los paso el backend; aqui se cubren los demas
   * estados de trabajo (gestion manual, seguimiento, WhatsApp, en linea).
   */
  private alBloquear(): void {
    const usuario = this.auth.getCurrentUser();
    if (!usuario || usuario.role !== 'AGENT') {
      return;
    }
    this.agentStatus.getAgentStatus(Number(usuario.id)).subscribe({
      next: r => {
        const actual = r.estadoActual as AgentState;
        // Con una llamada o una tipificacion abierta no se toca el estado.
        if (actual === AgentState.EN_LLAMADA || actual === AgentState.TIPIFICANDO) {
          return;
        }
        if (!PAUSAS_MANTENIMIENTO.includes(actual) && actual !== AgentState.DESCONECTADO) {
          this.cambiarEstadoAgente(AgentState.SOPORTE).subscribe({ error: () => undefined });
        }
      },
      error: () => undefined
    });
  }

  /**
   * Recarga para tomar la version desplegada, pero nunca con una gestion abierta:
   * el formulario de tipificacion vive en memoria y una recarga lo borra, dejando
   * al agente en TIPIFICANDO sin forma de cerrarlo. Se espera a que termine.
   */
  private recargarSiSePuede(): void {
    if (!this.recargaPendiente || this.comprobandoRecarga || this.gestionAbierta()) {
      return;
    }
    const usuario = this.auth.getCurrentUser();
    if (!usuario || usuario.role !== 'AGENT') {
      this.recargar();
      return;
    }
    if (Date.now() - this.ultimaComprobacion < COMPROBAR_RECARGA) {
      return;
    }
    // El estado en memoria puede estar atrasado: se confirma con el backend antes de recargar.
    this.ultimaComprobacion = Date.now();
    this.comprobandoRecarga = true;
    this.agentStatus.getAgentStatus(Number(usuario.id)).subscribe({
      next: r => {
        this.comprobandoRecarga = false;
        if (!EN_GESTION.includes(r.estadoActual as AgentState) && !this.gestionAbierta()) {
          this.recargar();
        }
      },
      error: () => { this.comprobandoRecarga = false; }
    });
  }

  private gestionAbierta(): boolean {
    return this.sip.enLlamada
      || this.gestionLock.isLocked
      || this.router.url.startsWith('/collection-management');
  }

  private recargar(): void {
    this.recargaPendiente = false;
    sessionStorage.setItem(CLAVE_RECARGA, '1');
    window.location.reload();
  }
}
