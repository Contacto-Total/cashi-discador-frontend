import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WhatsappOficialAvisosService } from '../services/whatsapp-oficial-avisos.service';

@Component({
  selector: 'app-whatsapp-oficial-popup',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (avisos.aviso(); as a) {
      <div class="aviso-oficial" (click)="avisos.abrir()">
        <div class="aviso-avatar">{{ a.iniciales }}</div>
        <div class="aviso-contenido">
          <div class="aviso-etiqueta">WhatsApp oficial</div>
          <div class="aviso-titulo">{{ a.titulo }}</div>
          <div class="aviso-texto">{{ a.texto }}</div>
        </div>
        <button type="button" class="aviso-cerrar" title="Cerrar" aria-label="Cerrar" (click)="$event.stopPropagation(); avisos.cerrarAviso()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </div>
    }
  `,
  styles: [`
    .aviso-oficial {
      position: fixed;
      top: 18px;
      right: 18px;
      z-index: 1200;
      width: min(360px, calc(100vw - 32px));
      min-height: 78px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 42px 12px 12px;
      border: 1px solid rgba(34, 197, 94, 0.28);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.98);
      color: #0f172a;
      box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
      backdrop-filter: blur(10px);
      cursor: pointer;
    }
    .aviso-avatar {
      width: 48px;
      height: 48px;
      flex: 0 0 48px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: linear-gradient(135deg, #16a34a, #0f766e);
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
    }
    .aviso-contenido { min-width: 0; }
    .aviso-etiqueta {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #059669;
    }
    .aviso-titulo {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 700;
    }
    .aviso-texto {
      display: -webkit-box;
      margin-top: 2px;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: #475569;
      font-size: 13px;
      line-height: 1.35;
    }
    .aviso-cerrar {
      position: absolute;
      top: 9px;
      right: 9px;
      width: 24px;
      height: 24px;
      display: grid;
      place-items: center;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: #64748b;
      cursor: pointer;
    }
    .aviso-cerrar:hover { background: rgba(15, 23, 42, 0.08); color: #0f172a; }
    @media (max-width: 640px) {
      .aviso-oficial { top: 12px; right: 12px; left: 12px; width: auto; }
    }
  `]
})
export class WhatsappOficialPopupComponent {
  constructor(readonly avisos: WhatsappOficialAvisosService) {}
}
