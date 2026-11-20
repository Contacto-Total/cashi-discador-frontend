import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { WaoMensaje } from '../models/whatsapp-oficial.models';
import { WhatsappOficialService } from './whatsapp-oficial.service';

@Injectable({ providedIn: 'root' })
export class WhatsappOficialAvisosService {
  readonly pendientes = signal<Record<string, number>>({});
  readonly chatActivo = signal<string | null>(null);

  private readonly ultimoVisto = new Map<string, number>();
  private temporizador?: ReturnType<typeof setInterval>;
  private base = false;
  private audio?: AudioContext;

  constructor(
    private readonly api: WhatsappOficialService,
    private readonly avisos: NotificationService,
    private readonly router: Router
  ) {}

  iniciar(): void {
    if (this.temporizador) return;
    this.pedirPermiso();
    this.consultar();
    this.temporizador = setInterval(() => this.consultar(), 10000);
  }

  detener(): void {
    if (this.temporizador) clearInterval(this.temporizador);
    this.temporizador = undefined;
    this.base = false;
    this.ultimoVisto.clear();
    this.pendientes.set({});
  }

  limpiar(clave: string): void {
    this.pendientes.update(p => {
      const { [clave]: _, ...resto } = p;
      return resto;
    });
  }

  private consultar(): void {
    this.api.conversaciones(100).subscribe({
      next: lista => this.procesar(lista),
      error: err => {
        if ([401, 403, 404].includes(err?.status)) this.detener();
      }
    });
  }

  private procesar(lista: WaoMensaje[]): void {
    for (const m of lista) {
      if (m.direccion !== 'ENTRANTE') continue;
      const clave = m.userId ?? m.waId ?? '';
      if (!clave || m.id <= (this.ultimoVisto.get(clave) ?? 0)) continue;
      this.ultimoVisto.set(clave, m.id);
      if (this.base) this.avisar(m, clave);
    }
    this.base = true;
  }

  private avisar(m: WaoMensaje, clave: string): void {
    const enPantalla = this.router.url.startsWith('/whatsapp-oficial') && document.visibilityState === 'visible';
    const viendoChat = enPantalla && this.chatActivo() === clave;
    const titulo = m.nombre || (m.waId ? '+' + m.waId : clave);
    const texto = m.contenido || '[' + m.tipo.toLowerCase() + ']';

    if (!viendoChat) {
      this.pendientes.update(p => ({ ...p, [clave]: (p[clave] ?? 0) + 1 }));
    }
    this.sonar();
    if (!enPantalla) {
      this.avisos.show({
        type: 'info',
        title: 'WhatsApp oficial · ' + titulo,
        message: texto.length > 90 ? texto.slice(0, 90) + '…' : texto,
        duration: 8000,
        actions: [{ label: 'Abrir', primary: true, callback: () => { this.router.navigateByUrl('/whatsapp-oficial'); } }]
      });
    }
    if (document.visibilityState === 'hidden') this.notificarEscritorio(titulo, texto);
  }

  private pedirPermiso(): void {
    try {
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    } catch { }
  }

  private notificarEscritorio(titulo: string, texto: string): void {
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        const n = new Notification('WhatsApp oficial · ' + titulo, { body: texto, tag: 'whatsapp-oficial' });
        n.onclick = () => { window.focus(); this.router.navigateByUrl('/whatsapp-oficial'); n.close(); };
      }
    } catch { }
  }

  private sonar(): void {
    try {
      this.audio ??= new AudioContext();
      const ctx = this.audio;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch { }
  }
}
