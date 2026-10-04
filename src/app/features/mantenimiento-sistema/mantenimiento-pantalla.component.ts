import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { AGENT_STATE_LABELS, AgentState } from '../../core/models/agent-status.model';
import { MantenimientoService, PAUSAS_MANTENIMIENTO, horaCorta } from './mantenimiento.service';
import { MascotaCascoComponent } from './mascota-casco.component';

/**
 * Pantalla que tapa la aplicacion durante el mantenimiento.
 *
 * Se pinta por encima, sin recargar ni cerrar sesion: el softphone vive en la
 * pagina y una recarga cortaria la llamada en curso. El asesor puede marcar una
 * pausa desde aqui; Disponible no se ofrece.
 */
@Component({
  selector: 'app-mantenimiento-pantalla',
  standalone: true,
  imports: [MascotaCascoComponent],
  templateUrl: './mantenimiento-pantalla.component.html',
  styleUrl: './mantenimiento-pantalla.component.css'
})
export class MantenimientoPantallaComponent {
  readonly mant = inject(MantenimientoService);
  private readonly auth = inject(AuthService);

  readonly pausas = PAUSAS_MANTENIMIENTO;
  readonly etiquetas = AGENT_STATE_LABELS;
  readonly guardando = signal(false);

  readonly texto = computed(() => this.mant.reiniciando()
    ? 'Servicio en reinicio. Cambio de estado no disponible.'
    : 'Sesión activa. No cierre ni recargue la pestaña.');

  readonly inicio = computed(() => {
    const d = this.mant.datos();
    const ms = d?.inicioDetencion ?? d?.inicioProgramado;
    return ms ? horaCorta(ms) : null;
  });

  /** Solo los asesores tienen estado que marcar. */
  readonly verSelector = computed(() =>
    this.auth.getCurrentUser()?.role === 'AGENT' && !!this.mant.estadoAgente());

  /** Fuera de una pausa el asesor esta pasando a Soporte: es lo que se muestra. */
  readonly actual = computed(() => {
    const e = this.mant.estadoAgente()?.estadoActual;
    return e && this.pausas.includes(e) ? e : AgentState.SOPORTE;
  });

  readonly desde = computed(() => {
    const t = this.mant.estadoAgente()?.timestampCambio;
    const ms = t ? new Date(t).getTime() : NaN;
    return Number.isNaN(ms) ? null : horaCorta(ms);
  });

  cambiar(evento: Event): void {
    const estado = (evento.target as HTMLSelectElement).value as AgentState;
    this.guardando.set(true);
    this.mant.cambiarEstadoAgente(estado).subscribe({
      next: () => this.guardando.set(false),
      error: () => this.guardando.set(false)
    });
  }
}
