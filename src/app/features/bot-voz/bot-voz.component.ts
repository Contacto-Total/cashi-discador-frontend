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

  /** Refresco de las vistas de monitoreo. Las filas cambian de estado mientras
   *  el bot disca y sin esto la pantalla se queda en la foto de cuando entraste. */
  private readonly REFRESCO_MS = 5000;
  private refresco?: ReturnType<typeof setInterval>;

  constructor(private svc: BotVozService) {}

  ngOnInit(): void {
    this.cargarConfig();
    this.cargarPerfiles();
    this.refresco = setInterval(() => this.refrescarTabActiva(), this.REFRESCO_MS);
  }

  ngOnDestroy(): void {
    clearInterval(this.refresco);
  }

  /** Solo la pestaña visible: config y perfiles los edita el usuario y
   *  recargarlos le pisaria lo que esta escribiendo. */
  private refrescarTabActiva(): void {
    if (this.activeTab === 'cola') this.cargarCola(true);
    if (this.activeTab === 'llamadas') this.cargarSesiones();
  }

  switchTab(t: 'config' | 'perfiles' | 'cola' | 'llamadas'): void {
    this.activeTab = t;
    if (t === 'cola') this.cargarCola();
    if (t === 'llamadas') this.cargarSesiones();
  }

  // ----- Config -----
  cargarConfig(): void {
    this.svc.getConfig().subscribe({ next: (c) => (this.config = c), error: () => this.flash('No se pudo cargar la configuración', true) });
  }
  guardarConfig(): void {
    if (!this.config) return;
    this.svc.updateConfig(this.config).subscribe({
      next: (c) => { this.config = c; this.flash('Configuración guardada'); },
      error: () => this.flash('Error al guardar', true),
    });
  }
  iniciar(): void {
    this.svc.activar().subscribe({ next: (c) => { this.config = c; this.flash('Bot iniciado — discando cola'); }, error: () => this.flash('Error al iniciar', true) });
  }
  detener(): void {
    this.svc.desactivar().subscribe({ next: (c) => { this.config = c; this.flash('Bot detenido'); }, error: () => this.flash('Error al detener', true) });
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
