import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { WaoMensaje } from '../models/whatsapp-oficial.models';
import { WhatsappOficialService } from './whatsapp-oficial.service';

@Injectable({ providedIn: 'root' })
export class WhatsappOficialAvisosService {
  readonly pendientes = signal<Record<string, number>>({});
  readonly chatActivo = signal<string | null>(null);
  readonly aviso = signal<{ clave: string; titulo: string; texto: string; iniciales: string } | null>(null);
  readonly alerta = signal<string | null>(null);
  private cierre?: ReturnType<typeof setTimeout>;
  private cierreAlerta?: ReturnType<typeof setTimeout>;

  private readonly ultimoVisto = new Map<string, number>();
  private temporizador?: ReturnType<typeof setInterval>;
  private base = false;
  private audio?: AudioContext;

  constructor(
    private readonly api: WhatsappOficialService,
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
    this.cerrarAviso();
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
    const texto = this.vistaPrevia(m);

    if (!viendoChat) {
      this.pendientes.update(p => ({ ...p, [clave]: (p[clave] ?? 0) + 1 }));
    }
    this.sonar();
    if (!enPantalla) this.mostrar(clave, titulo, this.vistaPrevia(m));
    if (document.visibilityState === 'hidden') this.notificarEscritorio(titulo, texto);
  }

  abrir(): void {
    const a = this.aviso();
    if (!a) return;
    this.router.navigate(['/whatsapp-oficial'], { queryParams: { chat: a.clave } });
    this.cerrarAviso();
  }

  alertar(texto: string): void {
    this.alerta.set(texto);
    if (this.cierreAlerta) clearTimeout(this.cierreAlerta);
    this.cierreAlerta = setTimeout(() => this.cerrarAlerta(), 7000);
  }

  cerrarAlerta(): void {
    if (this.cierreAlerta) clearTimeout(this.cierreAlerta);
    this.cierreAlerta = undefined;
    this.alerta.set(null);
  }

  cerrarAviso(): void {
    if (this.cierre) clearTimeout(this.cierre);
    this.cierre = undefined;
    this.aviso.set(null);
  }

  private mostrar(clave: string, titulo: string, texto: string): void {
    const base = titulo.replace(/[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ ]/g, '').trim();
    const partes = base.split(/\s+/).filter(Boolean);
    const iniciales = partes.length > 1 ? (partes[0][0] + partes[1][0]) : base.slice(0, 2);
    this.aviso.set({ clave, titulo, texto: texto.length > 90 ? texto.slice(0, 90) + '...' : texto, iniciales: (iniciales || '#').toUpperCase() });
    if (this.cierre) clearTimeout(this.cierre);
    this.cierre = setTimeout(() => this.cerrarAviso(), 15000);
  }

  private vistaPrevia(m: WaoMensaje): string {
    if (m.contenido?.trim()) return m.contenido.trim();
    switch (m.tipo) {
      case 'IMAGE': return 'Foto';
      case 'STICKER': return 'Sticker';
      case 'AUDIO': return 'Mensaje de voz';
      case 'VIDEO': return 'Video';
      case 'DOCUMENT': return 'Documento';
      default: return 'Nuevo mensaje';
    }
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
