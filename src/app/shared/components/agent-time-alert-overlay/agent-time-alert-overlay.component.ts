import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { AgentStatusService } from '../../../core/services/agent-status.service';

/**
 * Componente overlay flotante para agentes de call center
 *
 * CASOS DE USO:
 * - Mostrar estado actual del agente de forma no intrusiva
 * - Alertar cuando el tiempo en un estado excede el umbral
 * - Permitir al agente ver su tiempo en estado de un vistazo
 * - Activar/desactivar alertas de voz
 *
 * CONSIDERACIONES UX:
 * - No intrusivo durante el trabajo normal
 * - Alertas claras pero no agresivas para evitar fatiga
 * - Auto-cierre del menú para no bloquear la interfaz
 * - Colores consistentes con el estado del agente
 */
@Component({
  selector: 'app-agent-time-alert-overlay',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    @if (isVisible && initialDataLoaded) {
      <div class="agent-overlay-container">
        <!-- Menú desplegable -->
        @if (isMenuOpen) {
          <div class="dropdown-menu"
               [attr.data-estado]="estadoColor"
               [class.alert-mode]="excedeTiempoMaximo"
               (mouseenter)="onMenuInteraction()"
               (mousemove)="onMenuInteraction()">

            <!-- Header con estado actual -->
            <div class="menu-header" [attr.data-estado]="estadoColor" [class.alert-mode]="excedeTiempoMaximo">
              <div class="header-icon">
                <lucide-angular [name]="getEstadoIcon(estadoActual)" [size]="18"></lucide-angular>
              </div>
              <div class="header-info">
                <span class="header-title">Estado Actual</span>
                <span class="header-status">{{ estadoTexto }}</span>
              </div>
              <button class="close-btn" (click)="closeMenu()" title="Cerrar">
                <lucide-angular name="x" [size]="16"></lucide-angular>
              </button>
            </div>

            <!-- Tarjeta de tiempo -->
            <div class="menu-content">
              <div class="time-card" [attr.data-estado]="estadoColor" [class.alert-mode]="excedeTiempoMaximo">
                <div class="time-icon">
                  <lucide-angular name="clock" [size]="20"></lucide-angular>
                </div>
                <div class="time-info">
                  <span class="time-label">Tiempo en estado</span>
                  <span class="time-value">{{ formatTiempo(segundosEnEstado) }}</span>
                </div>
                @if (excedeTiempoMaximo) {
                  <div class="alert-indicator">
                    <lucide-angular name="alert-triangle" [size]="16"></lucide-angular>
                  </div>
                }
              </div>

              <!-- Mensaje de alerta contextual -->
              @if (excedeTiempoMaximo) {
                <div class="alert-message">
                  <lucide-angular name="info" [size]="14"></lucide-angular>
                  <span>Por favor, continúa con tu siguiente gestión</span>
                </div>
              }

              <div class="menu-divider"></div>

              <!-- Control de sonido -->
              <button class="menu-option" (click)="toggleSound($event)" title="Activar o desactivar alertas de voz">
                <div class="option-icon" [class.active]="soundEnabled">
                  @if (soundEnabled) {
                    <lucide-angular name="volume-2" [size]="18"></lucide-angular>
                  } @else {
                    <lucide-angular name="volume-x" [size]="18"></lucide-angular>
                  }
                </div>
                <div class="option-info">
                  <span class="option-label">Alertas de voz</span>
                  <span class="option-hint">{{ soundEnabled ? 'Activadas' : 'Desactivadas' }}</span>
                </div>
                <div class="toggle-switch" [class.active]="soundEnabled">
                  <div class="toggle-knob"></div>
                </div>
              </button>
            </div>
          </div>

          <div class="menu-backdrop" (click)="closeMenu()"></div>
        }

        <!-- Botón principal -->
        <button class="main-btn"
                [attr.data-estado]="estadoColor"
                [class.menu-open]="isMenuOpen"
                [class.alert-mode]="excedeTiempoMaximo && !isMenuOpen"
                (click)="toggleMenu()"
                [title]="getButtonTooltip()">

          <!-- Badge de tiempo -->
          @if (!isMenuOpen && segundosEnEstado > 0) {
            <div class="time-badge"
                 [attr.data-estado]="estadoColor"
                 [class.alert-mode]="excedeTiempoMaximo">
              {{ formatTiempoCorto(segundosEnEstado) }}
            </div>
          }

          <!-- Icono del botón -->
          <div class="btn-icon">
            @if (isMenuOpen) {
              <lucide-angular name="x" [size]="20"></lucide-angular>
            } @else if (excedeTiempoMaximo) {
              <lucide-angular name="alert-triangle" [size]="20"></lucide-angular>
            } @else {
              <lucide-angular [name]="getEstadoIcon(estadoActual)" [size]="20"></lucide-angular>
            }
          </div>

          <!-- Indicador de estado -->
          @if (!isMenuOpen) {
            <div class="status-indicator"
                 [attr.data-estado]="estadoColor"
                 [class.alert-mode]="excedeTiempoMaximo">
            </div>
          }
        </button>

        <!-- Anillo de alerta (sutil, no agresivo) -->
        @if (excedeTiempoMaximo && !isMenuOpen) {
          <div class="alert-ring"></div>
        }
      </div>
    }
  `,
  styles: [`
    /* ===== CONTENEDOR PRINCIPAL ===== */
    .agent-overlay-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ===== BOTÓN PRINCIPAL ===== */
    .main-btn {
      position: relative;
      width: 54px;
      height: 54px;
      border-radius: 14px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: white;
      z-index: 10;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
    }

    .main-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
    }

    .main-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
    }

    /* Estados del botón por tipo de actividad */
    .main-btn[data-estado="disponible"] {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
    }

    .main-btn[data-estado="en_llamada"] {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    }

    .main-btn[data-estado="tipificando"] {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
    }

    .main-btn[data-estado="en_reunion"] {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
    }

    .main-btn[data-estado="refrigerio"] {
      background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
      box-shadow: 0 4px 16px rgba(56, 189, 248, 0.3);
    }

    .main-btn[data-estado="sshh"] {
      background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
      box-shadow: 0 4px 16px rgba(168, 85, 247, 0.3);
    }

    .main-btn[data-estado="en_manual"] {
      background: linear-gradient(135deg, #64748b 0%, #475569 100%);
      box-shadow: 0 4px 16px rgba(100, 116, 139, 0.3);
    }

    .main-btn[data-estado="pausado"] {
      background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
      box-shadow: 0 4px 16px rgba(107, 114, 128, 0.3);
    }

    /* Estado de alerta - animación sutil pero perceptible */
    .main-btn.alert-mode {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
      animation: gentle-pulse 2s ease-in-out infinite;
    }

    .main-btn.menu-open {
      background: linear-gradient(135deg, #475569 0%, #334155 100%);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
      border-radius: 50%;
      animation: none;
    }

    @keyframes gentle-pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
      }
      50% {
        transform: scale(1.03);
        box-shadow: 0 4px 28px rgba(239, 68, 68, 0.55);
      }
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease;
    }

    /* Anillo de alerta externo */
    .alert-ring {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 54px;
      height: 54px;
      border-radius: 14px;
      border: 2px solid rgba(239, 68, 68, 0.6);
      animation: ring-pulse 2.5s ease-out infinite;
      pointer-events: none;
      z-index: 5;
    }

    @keyframes ring-pulse {
      0% {
        transform: scale(1);
        opacity: 0.8;
      }
      100% {
        transform: scale(1.6);
        opacity: 0;
      }
    }

    /* ===== BADGE DE TIEMPO ===== */
    .time-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      padding: 3px 8px;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: 'SF Mono', 'Consolas', monospace;
      background: #1e293b;
      color: #22c55e;
      border: 2px solid currentColor;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
      min-width: 44px;
      text-align: center;
      transition: all 0.3s ease;
      z-index: 15;
    }

    .time-badge[data-estado="disponible"] { color: #22c55e; }
    .time-badge[data-estado="en_llamada"] { color: #3b82f6; }
    .time-badge[data-estado="tipificando"] { color: #8b5cf6; }
    .time-badge[data-estado="en_reunion"] { color: #f59e0b; }
    .time-badge[data-estado="refrigerio"] { color: #38bdf8; }
    .time-badge[data-estado="sshh"] { color: #a855f7; }
    .time-badge[data-estado="en_manual"] { color: #94a3b8; }
    .time-badge[data-estado="pausado"] { color: #9ca3af; }

    .time-badge.alert-mode {
      color: #ef4444;
      animation: badge-attention 1.5s ease-in-out infinite;
    }

    @keyframes badge-attention {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 3px 10px rgba(239, 68, 68, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 3px 16px rgba(239, 68, 68, 0.5);
      }
    }

    /* ===== INDICADOR DE ESTADO ===== */
    .status-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #64748b;
      border: 2.5px solid #1e293b;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      z-index: 15;
    }

    .status-indicator[data-estado="disponible"] { background: #22c55e; }
    .status-indicator[data-estado="en_llamada"] { background: #3b82f6; }
    .status-indicator[data-estado="tipificando"] { background: #8b5cf6; }
    .status-indicator[data-estado="en_reunion"] { background: #f59e0b; }
    .status-indicator[data-estado="refrigerio"] { background: #38bdf8; }
    .status-indicator[data-estado="sshh"] { background: #a855f7; }
    .status-indicator[data-estado="en_manual"] { background: #64748b; }
    .status-indicator[data-estado="pausado"] { background: #6b7280; }

    .status-indicator.alert-mode {
      background: #ef4444;
      animation: indicator-pulse 1.2s ease-in-out infinite;
    }

    @keyframes indicator-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    /* ===== MENÚ DESPLEGABLE ===== */
    .dropdown-menu {
      position: absolute;
      bottom: 66px;
      right: 0;
      width: 280px;
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid #334155;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
      animation: menu-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 20;
    }

    .dropdown-menu.alert-mode {
      border-color: rgba(239, 68, 68, 0.3);
    }

    @keyframes menu-appear {
      0% {
        opacity: 0;
        transform: translateY(16px) scale(0.92);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .menu-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1;
    }

    /* ===== HEADER DEL MENÚ ===== */
    .menu-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      background: rgba(34, 197, 94, 0.08);
      border-bottom: 1px solid rgba(34, 197, 94, 0.15);
      transition: all 0.3s ease;
    }

    .menu-header[data-estado="disponible"] { background: rgba(34, 197, 94, 0.08); border-bottom-color: rgba(34, 197, 94, 0.15); }
    .menu-header[data-estado="en_llamada"] { background: rgba(59, 130, 246, 0.08); border-bottom-color: rgba(59, 130, 246, 0.15); }
    .menu-header[data-estado="tipificando"] { background: rgba(139, 92, 246, 0.08); border-bottom-color: rgba(139, 92, 246, 0.15); }
    .menu-header[data-estado="en_reunion"] { background: rgba(245, 158, 11, 0.08); border-bottom-color: rgba(245, 158, 11, 0.15); }
    .menu-header[data-estado="refrigerio"] { background: rgba(56, 189, 248, 0.08); border-bottom-color: rgba(56, 189, 248, 0.15); }
    .menu-header[data-estado="sshh"] { background: rgba(168, 85, 247, 0.08); border-bottom-color: rgba(168, 85, 247, 0.15); }
    .menu-header[data-estado="en_manual"] { background: rgba(100, 116, 139, 0.08); border-bottom-color: rgba(100, 116, 139, 0.15); }
    .menu-header[data-estado="pausado"] { background: rgba(107, 114, 128, 0.08); border-bottom-color: rgba(107, 114, 128, 0.15); }

    .menu-header.alert-mode {
      background: rgba(239, 68, 68, 0.08);
      border-bottom-color: rgba(239, 68, 68, 0.2);
    }

    .header-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(34, 197, 94, 0.15);
      color: #22c55e;
      transition: all 0.3s ease;
    }

    .menu-header[data-estado="disponible"] .header-icon { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
    .menu-header[data-estado="en_llamada"] .header-icon { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
    .menu-header[data-estado="tipificando"] .header-icon { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
    .menu-header[data-estado="en_reunion"] .header-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .menu-header[data-estado="refrigerio"] .header-icon { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
    .menu-header[data-estado="sshh"] .header-icon { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
    .menu-header[data-estado="en_manual"] .header-icon { background: rgba(100, 116, 139, 0.15); color: #64748b; }
    .menu-header[data-estado="pausado"] .header-icon { background: rgba(107, 114, 128, 0.15); color: #6b7280; }

    .menu-header.alert-mode .header-icon {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    .header-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .header-title {
      font-size: 0.625rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-status {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #f1f5f9;
    }

    .close-btn {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      border: none;
      background: rgba(255, 255, 255, 0.05);
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #f1f5f9;
    }

    /* ===== CONTENIDO DEL MENÚ ===== */
    .menu-content {
      padding: 12px;
    }

    /* Tarjeta de tiempo */
    .time-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border-radius: 12px;
      background: rgba(34, 197, 94, 0.06);
      border: 1px solid rgba(34, 197, 94, 0.12);
      position: relative;
      transition: all 0.3s ease;
    }

    .time-card[data-estado="disponible"] { background: rgba(34, 197, 94, 0.06); border-color: rgba(34, 197, 94, 0.12); }
    .time-card[data-estado="en_llamada"] { background: rgba(59, 130, 246, 0.06); border-color: rgba(59, 130, 246, 0.12); }
    .time-card[data-estado="tipificando"] { background: rgba(139, 92, 246, 0.06); border-color: rgba(139, 92, 246, 0.12); }
    .time-card[data-estado="en_reunion"] { background: rgba(245, 158, 11, 0.06); border-color: rgba(245, 158, 11, 0.12); }
    .time-card[data-estado="refrigerio"] { background: rgba(56, 189, 248, 0.06); border-color: rgba(56, 189, 248, 0.12); }
    .time-card[data-estado="sshh"] { background: rgba(168, 85, 247, 0.06); border-color: rgba(168, 85, 247, 0.12); }
    .time-card[data-estado="en_manual"] { background: rgba(100, 116, 139, 0.06); border-color: rgba(100, 116, 139, 0.12); }
    .time-card[data-estado="pausado"] { background: rgba(107, 114, 128, 0.06); border-color: rgba(107, 114, 128, 0.12); }

    .time-card.alert-mode {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .time-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(34, 197, 94, 0.12);
      color: #22c55e;
      transition: all 0.3s ease;
    }

    .time-card[data-estado="disponible"] .time-icon { background: rgba(34, 197, 94, 0.12); color: #22c55e; }
    .time-card[data-estado="en_llamada"] .time-icon { background: rgba(59, 130, 246, 0.12); color: #3b82f6; }
    .time-card[data-estado="tipificando"] .time-icon { background: rgba(139, 92, 246, 0.12); color: #8b5cf6; }
    .time-card[data-estado="en_reunion"] .time-icon { background: rgba(245, 158, 11, 0.12); color: #f59e0b; }
    .time-card[data-estado="refrigerio"] .time-icon { background: rgba(56, 189, 248, 0.12); color: #38bdf8; }
    .time-card[data-estado="sshh"] .time-icon { background: rgba(168, 85, 247, 0.12); color: #a855f7; }
    .time-card[data-estado="en_manual"] .time-icon { background: rgba(100, 116, 139, 0.12); color: #64748b; }
    .time-card[data-estado="pausado"] .time-icon { background: rgba(107, 114, 128, 0.12); color: #6b7280; }

    .time-card.alert-mode .time-icon {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    .time-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .time-label {
      font-size: 0.625rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .time-value {
      font-size: 1.375rem;
      font-weight: 700;
      font-family: 'SF Mono', 'Consolas', monospace;
      color: #22c55e;
      letter-spacing: 0.5px;
      transition: color 0.3s ease;
    }

    .time-card[data-estado="disponible"] .time-value { color: #22c55e; }
    .time-card[data-estado="en_llamada"] .time-value { color: #3b82f6; }
    .time-card[data-estado="tipificando"] .time-value { color: #8b5cf6; }
    .time-card[data-estado="en_reunion"] .time-value { color: #f59e0b; }
    .time-card[data-estado="refrigerio"] .time-value { color: #38bdf8; }
    .time-card[data-estado="sshh"] .time-value { color: #a855f7; }
    .time-card[data-estado="en_manual"] .time-value { color: #94a3b8; }
    .time-card[data-estado="pausado"] .time-value { color: #9ca3af; }

    .time-card.alert-mode .time-value {
      color: #ef4444;
    }

    .alert-indicator {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      animation: alert-icon-pulse 1.5s ease-in-out infinite;
    }

    @keyframes alert-icon-pulse {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 1; }
    }

    /* Mensaje de alerta */
    .alert-message {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .alert-message lucide-angular {
      color: #ef4444;
      flex-shrink: 0;
    }

    /* Separador */
    .menu-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #334155, transparent);
      margin: 12px 0;
    }

    /* Opción de menú */
    .menu-option {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: none;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .menu-option:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .option-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      color: #64748b;
      transition: all 0.2s ease;
    }

    .option-icon.active {
      background: rgba(34, 197, 94, 0.12);
      color: #22c55e;
    }

    .option-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .option-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: #e2e8f0;
    }

    .option-hint {
      font-size: 0.6875rem;
      color: #64748b;
    }

    /* Toggle switch */
    .toggle-switch {
      width: 44px;
      height: 24px;
      border-radius: 12px;
      background: #334155;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .toggle-switch.active {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .toggle-switch.active .toggle-knob {
      left: 22px;
    }

    /* ===== LIGHT MODE ===== */
    :host-context(body.light-theme),
    :host-context(html:not(.dark)) {
      .dropdown-menu {
        background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
        border-color: #e2e8f0;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      }

      .menu-header {
        background: rgba(34, 197, 94, 0.04);
        border-bottom-color: rgba(34, 197, 94, 0.08);
      }

      .menu-header[data-estado="disponible"] { background: rgba(34, 197, 94, 0.04); border-bottom-color: rgba(34, 197, 94, 0.08); }
      .menu-header[data-estado="en_llamada"] { background: rgba(59, 130, 246, 0.04); border-bottom-color: rgba(59, 130, 246, 0.08); }
      .menu-header[data-estado="tipificando"] { background: rgba(139, 92, 246, 0.04); border-bottom-color: rgba(139, 92, 246, 0.08); }
      .menu-header[data-estado="en_reunion"] { background: rgba(245, 158, 11, 0.04); border-bottom-color: rgba(245, 158, 11, 0.08); }
      .menu-header[data-estado="refrigerio"] { background: rgba(56, 189, 248, 0.04); border-bottom-color: rgba(56, 189, 248, 0.08); }
      .menu-header[data-estado="sshh"] { background: rgba(168, 85, 247, 0.04); border-bottom-color: rgba(168, 85, 247, 0.08); }
      .menu-header[data-estado="en_manual"] { background: rgba(100, 116, 139, 0.04); border-bottom-color: rgba(100, 116, 139, 0.08); }
      .menu-header[data-estado="pausado"] { background: rgba(107, 114, 128, 0.04); border-bottom-color: rgba(107, 114, 128, 0.08); }

      .menu-header.alert-mode {
        background: rgba(239, 68, 68, 0.04);
        border-bottom-color: rgba(239, 68, 68, 0.1);
      }

      .header-title { color: #64748b; }
      .header-status { color: #1e293b; }

      .close-btn {
        background: rgba(0, 0, 0, 0.03);
        color: #64748b;
      }
      .close-btn:hover {
        background: rgba(0, 0, 0, 0.06);
        color: #1e293b;
      }

      .time-card {
        background: rgba(34, 197, 94, 0.04);
        border-color: rgba(34, 197, 94, 0.08);
      }

      .time-card[data-estado="disponible"] { background: rgba(34, 197, 94, 0.04); border-color: rgba(34, 197, 94, 0.08); }
      .time-card[data-estado="en_llamada"] { background: rgba(59, 130, 246, 0.04); border-color: rgba(59, 130, 246, 0.08); }
      .time-card[data-estado="tipificando"] { background: rgba(139, 92, 246, 0.04); border-color: rgba(139, 92, 246, 0.08); }
      .time-card[data-estado="en_reunion"] { background: rgba(245, 158, 11, 0.04); border-color: rgba(245, 158, 11, 0.08); }
      .time-card[data-estado="refrigerio"] { background: rgba(56, 189, 248, 0.04); border-color: rgba(56, 189, 248, 0.08); }
      .time-card[data-estado="sshh"] { background: rgba(168, 85, 247, 0.04); border-color: rgba(168, 85, 247, 0.08); }
      .time-card[data-estado="en_manual"] { background: rgba(100, 116, 139, 0.04); border-color: rgba(100, 116, 139, 0.08); }
      .time-card[data-estado="pausado"] { background: rgba(107, 114, 128, 0.04); border-color: rgba(107, 114, 128, 0.08); }

      .time-card.alert-mode {
        background: rgba(239, 68, 68, 0.04);
        border-color: rgba(239, 68, 68, 0.1);
      }

      .time-label { color: #64748b; }

      .alert-message {
        background: rgba(239, 68, 68, 0.04);
        border-color: rgba(239, 68, 68, 0.1);
        color: #dc2626;
      }

      .menu-divider {
        background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
      }

      .menu-option:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      .option-icon {
        background: rgba(0, 0, 0, 0.03);
        color: #94a3b8;
      }

      .menu-option .option-icon.active {
        background: rgba(34, 197, 94, 0.15) !important;
        color: #16a34a !important;
      }

      .menu-option .option-icon.active lucide-angular {
        color: #16a34a !important;
      }

      .option-label { color: #1e293b; }
      .option-hint { color: #64748b; }

      .toggle-switch {
        background: #cbd5e1;
      }

      .toggle-switch.active {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      }

      .time-badge {
        background: white;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
      }

      .status-indicator {
        border-color: white;
      }

      .alert-ring {
        border-color: rgba(239, 68, 68, 0.5);
      }
    }
  `]
})
export class AgentTimeAlertOverlayComponent implements OnInit, OnDestroy {
  isVisible = false;
  isMenuOpen = false;
  excedeTiempoMaximo = false;
  segundosEnEstado = 0;
  estadoActual = '';
  estadoTexto = '';
  estadoColor = 'disponible';
  soundEnabled = false;
  initialDataLoaded = false;

  private readonly SOUND_STORAGE_KEY = 'agent_sound_enabled';
  private readonly AUTO_CLOSE_DELAY = 5000;
  private statusSubscription?: Subscription;
  private localTimerSubscription?: Subscription;
  private autoCloseTimer?: any;
  private lastAlertState = '';
  private userId: number | null = null;
  private userName = '';

  constructor(
    private authService: AuthService,
    private agentStatusService: AgentStatusService
  ) {}

  ngOnInit(): void {
    this.loadSoundPreference();
    const agentRoles = ['AGENT', 'ASESOR'];

    const user = this.authService.getCurrentUser();
    if (user?.role && agentRoles.includes(user.role) && user.id) {
      this.isVisible = true;
      this.userId = user.id;
      this.userName = user.firstName || user.username || 'Asesor';
      this.startStatusPolling();
    }

    this.authService.currentUser$.subscribe(user => {
      if (user?.role && agentRoles.includes(user.role) && user.id) {
        this.isVisible = true;
        this.userId = user.id;
        this.userName = user.firstName || user.username || 'Asesor';
        if (!this.statusSubscription) {
          this.startStatusPolling();
        }
      } else {
        this.isVisible = false;
        this.stopStatusPolling();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopStatusPolling();
    this.clearAutoCloseTimer();
  }

  private startStatusPolling(): void {
    if (!this.userId) return;

    // Contador local para actualización fluida del tiempo
    this.localTimerSubscription = interval(1000).subscribe(() => {
      if (this.isVisible && this.estadoActual) {
        this.segundosEnEstado++;
      }
    });

    // Polling al backend cada 5 segundos
    this.statusSubscription = interval(5000).pipe(
      startWith(0),
      switchMap(() => this.agentStatusService.getAgentStatus(this.userId!))
    ).subscribe({
      next: (response) => {
        this.initialDataLoaded = true;
        this.excedeTiempoMaximo = response.excedeTiempoMaximo || false;

        // Solo sincronizar segundos con backend cuando cambia el estado
        // Mientras el estado sea el mismo, el timer local (cada 1s) se encarga
        if (response.estadoActual !== this.estadoActual) {
          this.segundosEnEstado = response.segundosEnEstado || 0;
        }

        this.estadoActual = response.estadoActual;
        this.estadoTexto = this.getEstadoTexto(response.estadoActual);
        this.estadoColor = this.getEstadoColorClass(response.estadoActual);

        // Alerta de voz solo cuando cambia a estado excedido
        if (this.soundEnabled && this.excedeTiempoMaximo) {
          const alertKey = `${this.estadoActual}-excedido`;
          if (this.lastAlertState !== alertKey) {
            this.lastAlertState = alertKey;
            this.speakAlert();
          }
        }

        // Reset del estado de alerta cuando cambia el estado
        if (this.estadoActual !== this.lastAlertState.split('-')[0]) {
          this.lastAlertState = '';
        }
      },
      error: (err) => console.error('Error polling agent status:', err)
    });
  }

  private stopStatusPolling(): void {
    this.localTimerSubscription?.unsubscribe();
    this.localTimerSubscription = undefined;
    this.statusSubscription?.unsubscribe();
    this.statusSubscription = undefined;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.startAutoCloseTimer();
    } else {
      this.clearAutoCloseTimer();
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.clearAutoCloseTimer();
  }

  onMenuInteraction(): void {
    if (this.isMenuOpen) {
      this.resetAutoCloseTimer();
    }
  }

  private startAutoCloseTimer(): void {
    this.clearAutoCloseTimer();
    this.autoCloseTimer = setTimeout(() => {
      this.closeMenu();
    }, this.AUTO_CLOSE_DELAY);
  }

  private resetAutoCloseTimer(): void {
    this.startAutoCloseTimer();
  }

  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = undefined;
    }
  }

  toggleSound(event: Event): void {
    event.stopPropagation();
    this.soundEnabled = !this.soundEnabled;
    this.saveSoundPreference();
    this.onMenuInteraction();

    if (this.soundEnabled) {
      this.speak('Alertas de voz activadas');
    }
  }

  private loadSoundPreference(): void {
    const saved = localStorage.getItem(this.SOUND_STORAGE_KEY);
    this.soundEnabled = saved === 'true';
  }

  private saveSoundPreference(): void {
    localStorage.setItem(this.SOUND_STORAGE_KEY, String(this.soundEnabled));
  }

  private speakAlert(): void {
    const estadoHablado = this.getEstadoHablado(this.estadoActual);
    const mensaje = `${this.userName}, llevas demasiado tiempo en estado ${estadoHablado}. Por favor, continúa con tu siguiente gestión.`;
    this.speak(mensaje);
  }

  private speak(text: string): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech no soportado');
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    speechSynthesis.speak(utterance);
  }

  /**
   * Genera tooltip descriptivo para accesibilidad
   */
  getButtonTooltip(): string {
    const tiempo = this.formatTiempo(this.segundosEnEstado);
    if (this.excedeTiempoMaximo) {
      return `${this.estadoTexto} - ${tiempo} (Tiempo excedido)`;
    }
    return `${this.estadoTexto} - ${tiempo}`;
  }

  private getEstadoTexto(estado: string): string {
    const estados: Record<string, string> = {
      'DISPONIBLE': 'Disponible',
      'EN_LLAMADA': 'En Llamada',
      'TIPIFICANDO': 'Tipificando',
      'EN_REUNION': 'En Reunión',
      'REFRIGERIO': 'Refrigerio',
      'SSHH': 'SSHH',
      'EN_MANUAL': 'Modo Manual',
      'PAUSADO': 'Pausado'
    };
    return estados[estado] || estado || 'Sin estado';
  }

  private getEstadoHablado(estado: string): string {
    const estados: Record<string, string> = {
      'DISPONIBLE': 'disponible',
      'EN_LLAMADA': 'en llamada',
      'TIPIFICANDO': 'tipificando',
      'EN_REUNION': 'en reunión',
      'REFRIGERIO': 'refrigerio',
      'SSHH': 'en el baño',
      'EN_MANUAL': 'modo manual',
      'PAUSADO': 'pausado'
    };
    return estados[estado] || estado;
  }

  private getEstadoColorClass(estado: string): string {
    const colores: Record<string, string> = {
      'DISPONIBLE': 'disponible',
      'EN_LLAMADA': 'en_llamada',
      'TIPIFICANDO': 'tipificando',
      'EN_REUNION': 'en_reunion',
      'REFRIGERIO': 'refrigerio',
      'SSHH': 'sshh',
      'EN_MANUAL': 'en_manual',
      'PAUSADO': 'pausado'
    };
    return colores[estado] || 'disponible';
  }

  getEstadoIcon(estado: string): string {
    const iconos: Record<string, string> = {
      'DISPONIBLE': 'check-circle',
      'EN_LLAMADA': 'phone',
      'TIPIFICANDO': 'edit-3',
      'EN_REUNION': 'users',
      'REFRIGERIO': 'coffee',
      'SSHH': 'user',
      'EN_MANUAL': 'pencil',
      'PAUSADO': 'pause-circle'
    };
    return iconos[estado] || 'circle';
  }

  formatTiempo(segundos: number): string {
    if (!segundos || segundos < 0) return '00:00';

    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    if (horas > 0) {
      return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  }

  formatTiempoCorto(segundos: number): string {
    if (!segundos || segundos < 0) return '0:00';

    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;

    if (minutos >= 60) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      return `${horas}:${mins.toString().padStart(2, '0')}`;
    }
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  }
}
