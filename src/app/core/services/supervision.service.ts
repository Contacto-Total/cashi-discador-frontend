import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminMonitoringService } from './admin-monitoring.service';

export type SupervisionMode = 'none' | 'spy' | 'whisper' | 'barge';

export interface SupervisionState {
  isActive: boolean;
  mode: SupervisionMode;
  callUuid: string | null;
  adminCallUuid: string | null;
  agentName: string | null;
  agentExtension: string | null;
  clientNumber: string | null;
  startTime: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class SupervisionService {
  private adminMonitoringService = inject(AdminMonitoringService);

  // Estado de supervisión usando signals
  private _state = signal<SupervisionState>({
    isActive: false,
    mode: 'none',
    callUuid: null,
    adminCallUuid: null,
    agentName: null,
    agentExtension: null,
    clientNumber: null,
    startTime: null
  });

  // Computed signals para acceso fácil
  readonly isSupervisionActive = computed(() => this._state().isActive);
  readonly currentMode = computed(() => this._state().mode);
  readonly state = computed(() => this._state());

  /**
   * Inicia modo de supervisión
   */
  startSupervision(
    callUuid: string,
    mode: SupervisionMode,
    callInfo: { agentName: string; agentExtension: string; clientNumber: string }
  ): void {
    this._state.set({
      isActive: true,
      mode: mode,
      callUuid: callUuid,
      adminCallUuid: null,
      agentName: callInfo.agentName,
      agentExtension: callInfo.agentExtension,
      clientNumber: callInfo.clientNumber,
      startTime: new Date()
    });
  }

  /**
   * Actualiza el adminCallUuid cuando se conecta
   */
  setAdminCallUuid(uuid: string): void {
    this._state.update(state => ({
      ...state,
      adminCallUuid: uuid
    }));
  }

  /**
   * Cambia el modo de supervisión (sin desconectar)
   */
  changeMode(newMode: SupervisionMode): Observable<any> {
    const state = this._state();
    if (!state.callUuid) {
      throw new Error('No active supervision session');
    }

    return this.adminMonitoringService.changeMode(
      state.callUuid,
      state.adminCallUuid || '',
      newMode
    );
  }

  /**
   * Actualiza el modo localmente después de cambio exitoso
   */
  updateMode(mode: SupervisionMode): void {
    this._state.update(state => ({
      ...state,
      mode: mode
    }));
  }

  /**
   * Detiene la supervisión
   */
  stopSupervision(): void {
    this._state.set({
      isActive: false,
      mode: 'none',
      callUuid: null,
      adminCallUuid: null,
      agentName: null,
      agentExtension: null,
      clientNumber: null,
      startTime: null
    });
  }

  /**
   * Obtiene la etiqueta del modo en español
   */
  getModeLabel(mode: SupervisionMode): string {
    switch (mode) {
      case 'spy': return 'Vigía';
      case 'whisper': return 'Susurro';
      case 'barge': return 'Tripartita';
      default: return 'Sin conexión';
    }
  }

  /**
   * Obtiene el color del modo
   */
  getModeColor(mode: SupervisionMode): string {
    switch (mode) {
      case 'spy': return '#3B82F6';     // Azul
      case 'whisper': return '#10B981'; // Verde
      case 'barge': return '#EF4444';   // Rojo
      default: return '#6B7280';        // Gris
    }
  }

  /**
   * Obtiene el ícono del modo
   */
  getModeIcon(mode: SupervisionMode): string {
    switch (mode) {
      case 'spy': return 'eye';
      case 'whisper': return 'mic';
      case 'barge': return 'users';
      default: return 'eye-off';
    }
  }
}
