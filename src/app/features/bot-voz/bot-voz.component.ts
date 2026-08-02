import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import {
  BotVozService, BotConfig, BotPerfil, BotContacto, BotSesion,
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

  get motivoNoIniciar(): string {
    if (this.configSinGuardar) return 'Guarda la configuración antes de iniciar';
    if (!this.colaMarcable) return 'No hay cola que marcar: arma la cola del día primero';
    return '';
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
    this.svc.getPerfiles().subscribe((p) => (this.perfiles = p));
  }
  guardarPerfil(p: BotPerfil): void {
    this.svc.updatePerfil(p.id, p).subscribe({ next: () => this.flash(`Perfil ${p.nombre} guardado`), error: () => this.flash('Error al guardar perfil', true) });
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
