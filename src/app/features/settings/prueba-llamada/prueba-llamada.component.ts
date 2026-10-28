import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription, firstValueFrom } from 'rxjs';
import { SipService, CallState } from '../../../core/services/sip.service';
import { AgentStatusService, CupoPruebaLlamada } from '../../../core/services/agent-status.service';
import { AuthService } from '../../../core/services/auth.service';
import { AgentState } from '../../../core/models/agent-status.model';
import { ESTILOS } from '../../asistencia/asistencia.estilos';

type TipoPrueba = 'ECO_RETRASO' | 'ECO' | 'NUMERO';
type Fase = 'conectando' | 'timbrando' | 'en-llamada';

// Extensiones de eco del dialplan default de FreeSWITCH (default.xml): no salen a la calle
const DESTINO_ECO: Record<'ECO_RETRASO' | 'ECO', string> = {
  ECO_RETRASO: '9195',
  ECO: '9196'
};

const DURACION_MAX_SEGUNDOS = 30;
// Un número que no contesta no debe dejar la prueba colgada hasta el call_timeout del dialplan
const TIMBRADO_MAX_MS = 45_000;

// En estos estados el discador le puede mandar una llamada, o ya está en una
const ESTADOS_BLOQUEADOS: AgentState[] = [AgentState.DISPONIBLE, AgentState.EN_LLAMADA, AgentState.TIPIFICANDO];
const ROLES_ASESOR = ['AGENT', 'ASESOR'];

// Las mismas reglas que las rutas de salida del dialplan (02_outbound_ipbusiness.xml)
const NUMERO_VALIDO = /^(9\d{8}|[2-7]\d{6})$/;

/**
 * Prueba de llamada en /settings. Llama desde el navegador directo a FreeSWITCH: no crea
 * registro de llamada ni gestión. Solo se permite fuera de DISPONIBLE para que el discador
 * no mande una llamada durante la prueba, y se corta sola a los 30 segundos.
 */
@Component({
  selector: 'app-prueba-llamada',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './prueba-llamada.component.html',
  styles: [':host { display: block; }']
})
export class PruebaLlamadaComponent implements OnInit, OnDestroy {
  readonly duracionMax = DURACION_MAX_SEGUNDOS;
  readonly estilos = ESTILOS;
  readonly aviso = 'flex items-start gap-2 rounded-lg px-3 py-2 text-[12px] leading-[1.45]';
  readonly avisoVerde = 'bg-[#e8f5ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300';
  readonly avisoAmbar = 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300';
  readonly avisoRojo = 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300';
  readonly opcion = 'flex items-center gap-3 rounded-[10px] border border-[#e6e9ee] bg-white px-3.5 py-3 text-left !text-[#0f172a] transition-colors hover:border-[#8491a3] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#e6e9ee] disabled:hover:bg-white dark:border-slate-700 dark:bg-slate-900 dark:!text-slate-100 dark:hover:bg-slate-800';

  estadoAgente: AgentState | null = null;
  estadoVerificado = false;
  verificando = false;

  enCurso: TipoPrueba | null = null;
  fase: Fase | null = null;
  segundosRestantes = DURACION_MAX_SEGUNDOS;
  resultado: { tipo: 'ok' | 'error'; mensaje: string } | null = null;

  numero = '';
  numeroInvalido = false;
  // Llamadas a número real: 4 por hora, las cuenta el backend (PruebaLlamadaService)
  cupo: CupoPruebaLlamada | null = null;
  solicitando = false;

  private subs: Subscription[] = [];
  private cupoTimeout?: ReturnType<typeof setTimeout>;
  private callSub?: Subscription;
  private contador?: ReturnType<typeof setInterval>;
  private timbradoTimeout?: ReturnType<typeof setTimeout>;
  private cortePorTiempo = false;
  private cortePorUsuario = false;
  private destruido = false;

  constructor(
    private sipService: SipService,
    private agentStatusService: AgentStatusService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verificarEstado();
    this.cargarCupo();

    // Si el asesor cambia de estado en otra parte (cabecera, otra pestaña) se refleja aquí,
    // y si pasa a DISPONIBLE con la prueba en curso, se corta.
    this.subs.push(
      this.agentStatusService.currentStatus$.subscribe(status => {
        if (!status) return;
        this.estadoAgente = status.estadoActual;
        this.estadoVerificado = true;
        if (this.enCurso && ESTADOS_BLOQUEADOS.includes(status.estadoActual)) {
          this.resultado = { tipo: 'error', mensaje: 'Se cortó la prueba: cambiaste a un estado en el que pueden entrarte llamadas.' };
          this.colgarPrueba();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.destruido = true;
    clearTimeout(this.cupoTimeout);
    this.subs.forEach(s => s.unsubscribe());
    if (this.enCurso) {
      this.colgarPrueba();
    }
    this.limpiar();
  }

  /** Por qué no se puede probar ahora; null si se puede */
  get motivoBloqueo(): string | null {
    if (!this.sipService.isRegistered()) {
      return 'El softphone no está conectado. Si persiste, recarga la página (F5).';
    }
    if (this.enCurso) {
      return null;
    }
    if (this.sipService.enLlamada) {
      return 'Tienes una llamada en curso.';
    }
    if (this.esAsesor && !this.estadoVerificado) {
      return this.verificando ? 'Verificando tu estado...' : 'No se pudo verificar tu estado. Vuelve a intentarlo.';
    }
    if (this.estadoAgente && ESTADOS_BLOQUEADOS.includes(this.estadoAgente)) {
      return `Estás en ${this.nombreEstado(this.estadoAgente)}. Cambia a una pausa (por ejemplo Soporte) para probar: así el discador no te envía llamadas durante la prueba.`;
    }
    return null;
  }

  /** El bloqueo depende del estado del asesor: tiene sentido volver a consultarlo */
  get estadoReintentable(): boolean {
    return this.sipService.isRegistered() && !this.sipService.enLlamada && !this.enCurso;
  }

  get esAsesor(): boolean {
    return ROLES_ASESOR.includes(this.authService.getCurrentUser()?.role ?? '');
  }

  get textoFase(): string {
    switch (this.fase) {
      case 'conectando': return 'Conectando...';
      case 'timbrando': return this.enCurso === 'NUMERO' ? 'Timbrando...' : 'Conectando...';
      case 'en-llamada': return 'En llamada';
      default: return '';
    }
  }

  get progreso(): number {
    return (this.segundosRestantes / DURACION_MAX_SEGUNDOS) * 100;
  }

  get sinCupo(): boolean {
    return !!this.cupo && this.cupo.restantes <= 0;
  }

  /** Hora (de Lima) en que se libera el próximo intento */
  get horaLibera(): string {
    if (!this.cupo?.liberaEn) return '';
    return new Date(this.cupo.liberaEn).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  cargarCupo(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;
    this.agentStatusService.getCupoPruebaLlamada(user.id).subscribe({
      next: c => this.aplicarCupo(c),
      error: () => this.cupo = null
    });
  }

  private aplicarCupo(c: CupoPruebaLlamada): void {
    this.cupo = c;
    // Al cumplirse la hora se libera un intento: se vuelve a consultar para habilitar el botón
    clearTimeout(this.cupoTimeout);
    if (c.liberaEn) {
      const espera = Math.max(1000, c.liberaEn - Date.now() + 1000);
      this.cupoTimeout = setTimeout(() => this.cargarCupo(), espera);
    }
  }

  verificarEstado(): void {
    const user = this.authService.getCurrentUser();
    if (!user?.id) return;
    this.verificando = true;
    this.agentStatusService.getAgentStatus(user.id).subscribe({
      next: r => {
        this.estadoAgente = r.estadoActual as AgentState;
        this.estadoVerificado = true;
        this.verificando = false;
      },
      error: () => {
        this.estadoVerificado = false;
        this.verificando = false;
      }
    });
  }

  async iniciar(tipo: TipoPrueba): Promise<void> {
    if (this.solicitando || this.enCurso) return;
    this.solicitando = true;
    try {
      await this.iniciarPrueba(tipo);
    } finally {
      this.solicitando = false;
    }
  }

  private async iniciarPrueba(tipo: TipoPrueba): Promise<void> {
    this.resultado = null;
    this.numeroInvalido = false;

    let destino: string;
    if (tipo === 'NUMERO') {
      destino = this.numero.replace(/\D/g, '');
      if (!NUMERO_VALIDO.test(destino)) {
        this.numeroInvalido = true;
        return;
      }
    } else {
      destino = DESTINO_ECO[tipo];
    }

    // El estado se vuelve a pedir al backend justo antes de llamar: es la única fuente fiable
    const user = this.authService.getCurrentUser();
    if (user?.id) {
      try {
        const r = await firstValueFrom(this.agentStatusService.getAgentStatus(user.id));
        this.estadoAgente = r.estadoActual as AgentState;
        this.estadoVerificado = true;
      } catch {
        this.estadoVerificado = false;
      }
    }
    if (this.motivoBloqueo) {
      return;
    }

    // Llamada real: el backend cuenta el intento y la rechaza si ya hubo 4 en la última hora.
    // Si no se puede validar, no se llama.
    if (tipo === 'NUMERO' && user?.id) {
      try {
        this.aplicarCupo(await firstValueFrom(this.agentStatusService.registrarPruebaLlamada(user.id, destino)));
      } catch (error: any) {
        if (error?.status === 429 && error.error) {
          // El aviso con la hora en que se libera lo muestra el formulario
          this.aplicarCupo(error.error as CupoPruebaLlamada);
        } else {
          this.resultado = { tipo: 'error', mensaje: 'No se pudo validar el límite de llamadas. Vuelve a intentarlo.' };
        }
        return;
      }
    }

    this.enCurso = tipo;
    this.fase = 'conectando';
    this.segundosRestantes = DURACION_MAX_SEGUNDOS;
    this.cortePorTiempo = false;
    this.cortePorUsuario = false;

    this.callSub = this.sipService.onCallStatus.subscribe(state => this.onEstadoLlamada(state));
    this.timbradoTimeout = setTimeout(() => {
      if (this.fase !== 'en-llamada') {
        this.resultado = { tipo: 'error', mensaje: 'No contestaron. Se canceló la prueba.' };
        this.cortePorUsuario = true;
        this.colgarPrueba();
      }
    }, TIMBRADO_MAX_MS);

    try {
      await this.sipService.llamarPrueba(destino);
      // Colgó o salió de la página mientras se abría el micrófono: la sesión SIP recién
      // existe ahora, así que el hangup de antes no tuvo qué cortar
      if (this.destruido || this.cortePorUsuario) {
        this.colgarPrueba();
      }
    } catch (error: any) {
      this.resultado = { tipo: 'error', mensaje: error?.message === 'Microphone not available'
        ? 'No se encontró un micrófono para la llamada.'
        : (error?.message || 'No se pudo iniciar la llamada.') };
      this.limpiar();
    }
  }

  colgar(): void {
    this.cortePorUsuario = true;
    this.colgarPrueba();
  }

  private onEstadoLlamada(state: CallState): void {
    if (!this.enCurso) return;

    switch (state) {
      case CallState.RINGING:
        if (this.fase !== 'en-llamada') this.fase = 'timbrando';
        break;
      case CallState.ACTIVE:
        if (this.fase !== 'en-llamada') {
          this.fase = 'en-llamada';
          clearTimeout(this.timbradoTimeout);
          this.iniciarContador();
        }
        break;
      case CallState.ENDED:
        this.onFinLlamada();
        break;
    }
  }

  private iniciarContador(): void {
    this.contador = setInterval(() => {
      this.segundosRestantes--;
      if (this.segundosRestantes <= 0) {
        this.cortePorTiempo = true;
        this.colgarPrueba();
      }
    }, 1000);
  }

  private onFinLlamada(): void {
    const conecto = this.fase === 'en-llamada';
    if (!this.resultado) {
      if (this.cortePorTiempo) {
        this.resultado = { tipo: 'ok', mensaje: `Prueba completa: se cortó a los ${DURACION_MAX_SEGUNDOS} segundos.` };
      } else if (conecto) {
        this.resultado = { tipo: 'ok', mensaje: 'Prueba finalizada.' };
      } else if (this.cortePorUsuario) {
        this.resultado = { tipo: 'ok', mensaje: 'Prueba cancelada.' };
      } else {
        this.resultado = { tipo: 'error', mensaje: `No se pudo conectar: ${this.traducirCausa(this.sipService.lastHangupCause)}` };
      }
    }
    this.limpiar();
  }

  /** Cuelga solo si la llamada en curso es la de prueba: nunca una llamada real */
  private colgarPrueba(): void {
    if (this.sipService.isPruebaActiva()) {
      this.sipService.hangup();
    } else {
      this.limpiar();
    }
  }

  private limpiar(): void {
    clearInterval(this.contador);
    clearTimeout(this.timbradoTimeout);
    this.callSub?.unsubscribe();
    this.callSub = undefined;
    this.enCurso = null;
    this.fase = null;
  }

  private traducirCausa(causa: string): string {
    const causas: Record<string, string> = {
      'Busy': 'el número está ocupado.',
      'Rejected': 'la llamada fue rechazada.',
      'Unavailable': 'el número no está disponible.',
      'Not Found': 'el número no existe.',
      'Address Incomplete': 'el número está incompleto.',
      'No Answer': 'no contestaron.',
      'Request Timeout': 'el servidor no respondió.',
      'Connection Error': 'error de conexión con el servidor.',
      'User Denied Media Access': 'el navegador no dio acceso al micrófono.'
    };
    return causas[causa] ?? (causa || 'causa desconocida.');
  }

  private nombreEstado(estado: AgentState): string {
    const nombres: Partial<Record<AgentState, string>> = {
      [AgentState.DISPONIBLE]: 'Disponible',
      [AgentState.EN_LLAMADA]: 'En llamada',
      [AgentState.TIPIFICANDO]: 'Tipificando'
    };
    return nombres[estado] ?? estado;
  }
}
