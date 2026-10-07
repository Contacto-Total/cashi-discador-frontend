import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { EMPTY, Subscription, interval } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AgentState, AgentStatusResponse } from '../../core/models/agent-status.model';
import { UmbralesEstadoService } from '../../maintenance/services/umbrales-estado.service';
import { ThemeService } from '../../shared/services/theme.service';
import { EstadoMenu } from '../../shared/ui/estado-menu.component';
import { ESTADOS_PANEL, NIVELES, Nivel, UmbralTiempo, nivelDeTiempo } from './estados-panel';

const ROLES_ASESOR = ['AGENT', 'ASESOR'];
const CLAVE_VOZ = 'agent_sound_enabled';
const CADA_SONDEO = 30_000;

/** Cómo se dice cada estado en la alerta de voz. */
const HABLADO: Partial<Record<AgentState, string>> = {
  [AgentState.DISPONIBLE]: 'disponible',
  [AgentState.EN_LLAMADA]: 'en llamada',
  [AgentState.TIPIFICANDO]: 'tipificando',
  [AgentState.EN_REUNION]: 'en reunión',
  [AgentState.REFRIGERIO]: 'en break',
  [AgentState.SSHH]: 'en el baño',
  [AgentState.EN_MANUAL]: 'modo manual',
  [AgentState.GESTION_MANUAL]: 'gestión manual',
  [AgentState.SEGUIMIENTO]: 'seguimiento',
  [AgentState.EN_LINEA]: 'en línea',
  [AgentState.CAPACITACION]: 'en capacitación',
  [AgentState.CONSULTA_TIEMPOS]: 'consultando sus tiempos',
  [AgentState.COMIDA]: 'en el almuerzo',
  [AgentState.AUSENTE]: 'ausente',
  [AgentState.SOPORTE]: 'con soporte técnico'
};

/**
 * Estado del asesor fuera del Panel: en qué estado está, cuánto lleva y en qué tramo del semáforo va.
 * Lo muestra el pie del menú. Sigue el estado por WebSocket, lo vuelve a pedir cada 30 s y entre
 * medias cuenta en local, con los mismos umbrales que el Panel.
 *
 * También da la alerta de voz: una vez por estado, al pasar el tiempo máximo, si el asesor la encendió.
 */
@Injectable({ providedIn: 'root' })
export class EstadoAsesorService {
  private readonly auth = inject(AuthService);
  private readonly estados = inject(AgentStatusService);
  private readonly umbralesApi = inject(UmbralesEstadoService);
  private readonly tema = inject(ThemeService);
  private readonly zona = inject(NgZone);

  /** Solo los asesores tienen estado que mostrar. */
  readonly esAsesor = signal(false);
  readonly estado = signal<AgentState | null>(null);
  readonly segundos = signal(0);
  readonly voz = signal(localStorage.getItem(CLAVE_VOZ) === 'true');

  private readonly umbrales = signal(new Map<string, UmbralTiempo>());
  /** Tope que manda el backend con el estado, por si el estado no tiene umbral cargado. */
  private readonly topeBackend = signal<number | null>(null);

  private readonly umbral = computed<UmbralTiempo | null>(() => {
    const e = this.estado();
    const u = e ? this.umbrales().get(e) : undefined;
    return u && u.tope > 0 ? u : null;
  });

  readonly nivel = computed<Nivel | null>(() => {
    const u = this.umbral();
    if (u) {
      return nivelDeTiempo(this.segundos(), u);
    }
    const tope = this.topeBackend();
    return tope && this.segundos() > tope ? 'excedido' : null;
  });

  /** Lo que pinta la fila del menú, o `null` si no hay estado que mostrar. */
  readonly paraMenu = computed<EstadoMenu | null>(() => {
    const e = this.estado();
    const ficha = e ? ESTADOS_PANEL[e] : null;
    if (!this.esAsesor() || !ficha) {
      return null;
    }
    const oscuro = this.tema.isDarkMode(), nivel = this.nivel(), u = this.umbral();
    return {
      nombre: ficha.nombre,
      icono: ficha.icono,
      tono: oscuro && ficha.oscuro ? ficha.oscuro : ficha.tono,
      tinta: oscuro ? ficha.oscuro ?? ficha.tono : ficha.tinta ?? ficha.tono,
      segundos: this.segundos(),
      leyenda: !nivel ? 'Sin tope de tiempo' : nivel === 'verde' && u ? `Máximo ${this.reloj(u.tope)}` : NIVELES[nivel].leyenda,
      excedido: nivel === 'excedido'
    };
  });

  private idUsuario: number | null = null;
  private nombre = 'Asesor';
  private baseSegundos = 0;
  private baseEn = 0;
  private avisado: AgentState | null = null;
  private suscripciones: Subscription[] = [];

  constructor() {
    this.auth.currentUser$.subscribe(u => {
      const asesor = !!u?.id && !!u.role && ROLES_ASESOR.includes(u.role);
      if (!asesor) {
        this.parar();
      } else if (u!.id !== this.idUsuario) {
        this.parar();
        this.nombre = u!.firstName || u!.username || 'Asesor';
        this.seguir(u!.id);
      }
    });
  }

  alternarVoz(): void {
    this.voz.update(v => !v);
    localStorage.setItem(CLAVE_VOZ, String(this.voz()));
    if (this.voz()) {
      this.decir('Alertas de voz activadas');
    }
  }

  private seguir(id: number): void {
    this.idUsuario = id;
    this.esAsesor.set(true);

    this.umbralesApi.getActivos().subscribe({
      next: lista => this.umbrales.set(new Map(lista.map(u => [u.estado, {
        verde: u.umbralVerdeSegundos, ambar: u.umbralAmarilloSegundos, tope: u.tiempoMaximoSegundos
      }]))),
      error: () => { /* sin umbrales no hay semáforo; el tope lo sigue dando el backend con el estado */ }
    });

    // Un fallo de red no corta el sondeo: se reintenta en la siguiente vuelta.
    const pedir = () => this.estados.getAgentStatus(id).pipe(catchError(() => EMPTY));
    this.suscripciones.push(
      interval(CADA_SONDEO).pipe(startWith(0), switchMap(pedir)).subscribe(r => this.recibir(r)),
      // El aviso por WebSocket llega fuera de la zona de Angular.
      this.estados.subscribeToStatusUpdates(id).subscribe(d => this.zona.run(() => {
        if (d?.estadoActual && d.estadoActual !== this.estado()) {
          this.fijar(d.estadoActual as AgentState, d.segundosEnEstado || 0);
          pedir().subscribe(r => this.recibir(r));
        }
      })),
      interval(1000).subscribe(() => this.tic())
    );
  }

  private parar(): void {
    this.suscripciones.forEach(s => s.unsubscribe());
    this.suscripciones = [];
    this.idUsuario = null;
    this.avisado = null;
    this.esAsesor.set(false);
    this.estado.set(null);
  }

  private recibir(r: AgentStatusResponse): void {
    this.topeBackend.set(r.tiempoMaximoSegundos && r.tiempoMaximoSegundos > 0 ? r.tiempoMaximoSegundos : null);
    const desdeCambio = (Date.now() - Date.parse(r.timestampCambio)) / 1000;
    this.fijar(r.estadoActual as AgentState, r.segundosEnEstado ?? (Number.isFinite(desdeCambio) ? Math.max(0, desdeCambio) : 0));
  }

  /** Toma el tiempo que manda el backend como base; entre un dato y el siguiente se cuenta en local. */
  private fijar(estado: AgentState, segundos: number): void {
    if (estado !== this.estado()) {
      this.avisado = null;
      this.estado.set(estado);
    }
    this.baseSegundos = segundos;
    this.baseEn = Date.now();
    this.tic();
  }

  private tic(): void {
    if (!this.estado()) {
      return;
    }
    this.segundos.set(Math.max(0, Math.floor(this.baseSegundos + (Date.now() - this.baseEn) / 1000)));
    const e = this.estado();
    if (this.voz() && e && this.nivel() === 'excedido' && this.avisado !== e) {
      this.avisado = e;
      this.decir(`${this.nombre}, llevas demasiado tiempo en estado ${HABLADO[e] ?? ESTADOS_PANEL[e]?.nombre ?? e}. Por favor, continúa con tu siguiente gestión.`);
    }
  }

  private decir(texto: string): void {
    if (!('speechSynthesis' in window)) {
      return;
    }
    speechSynthesis.cancel();
    const frase = new SpeechSynthesisUtterance(texto);
    frase.lang = 'es-ES';
    frase.rate = 0.95;
    frase.volume = 0.9;
    const voz = speechSynthesis.getVoices().find(v => v.lang.startsWith('es'));
    if (voz) {
      frase.voice = voz;
    }
    speechSynthesis.speak(frase);
  }

  private reloj(segundos: number): string {
    const m = Math.floor(segundos / 60), s = segundos % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
