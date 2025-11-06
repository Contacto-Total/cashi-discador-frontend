import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AutoDialerService, AutoDialerEstadisticas } from '../../../core/services/autodialer.service';

@Component({
  selector: 'app-autodialer-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autodialer-admin.component.html',
  styleUrls: ['./autodialer-admin.component.css']
})
export class AutodialerAdminComponent implements OnInit, OnDestroy {
  isActivo: boolean = false;
  loading: boolean = false;
  loadingConfig: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  configSuccessMessage: string | null = null;

  estadisticas: AutoDialerEstadisticas | null = null;
  private statsSubscription?: Subscription;

  // Configuración
  intensidadMarcacion: number = 1.50;
  intervaloMarcacionSegundos: number = 30;

  constructor(private autoDialerService: AutoDialerService) {}

  ngOnInit(): void {
    this.loadEstado();
    this.loadConfiguracion();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
  }

  /**
   * Carga el estado actual del auto-dialer
   */
  loadEstado(): void {
    this.autoDialerService.getEstado().subscribe({
      next: (response) => {
        this.isActivo = response.activo;
      },
      error: (err) => {
        console.error('Error loading auto-dialer estado:', err);
        this.error = 'Error al cargar el estado del auto-dialer';
      }
    });
  }

  /**
   * Inicia el polling de estadísticas cada 5 segundos
   */
  startPolling(): void {
    this.statsSubscription = this.autoDialerService.startStatsPolling().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
        this.isActivo = stats.activo;
      },
      error: (err) => {
        console.error('Error loading estadísticas:', err);
      }
    });
  }

  /**
   * Toggle el auto-dialer (activar/desactivar)
   */
  toggleAutoDialer(): void {
    this.loading = true;
    this.error = null;
    this.successMessage = null;

    this.autoDialerService.toggle('admin').subscribe({
      next: (response) => {
        this.loading = false;
        this.isActivo = response.activo;
        this.successMessage = response.mensaje;

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error toggling auto-dialer:', err);
        this.error = 'Error al cambiar el estado del auto-dialer';
        this.loading = false;
      }
    });
  }

  /**
   * Obtiene el color del badge de estado
   */
  getStatusColor(): string {
    return this.isActivo ? '#10B981' : '#6B7280';
  }

  /**
   * Obtiene el texto del badge de estado
   */
  getStatusText(): string {
    return this.isActivo ? 'ACTIVO' : 'INACTIVO';
  }

  /**
   * Obtiene el texto del botón
   */
  getButtonText(): string {
    if (this.loading) return 'Procesando...';
    return this.isActivo ? 'DESACTIVAR AUTO-DIALER' : 'ACTIVAR AUTO-DIALER';
  }

  /**
   * Obtiene el ícono del botón
   */
  getButtonIcon(): string {
    return this.isActivo ? '⏸️' : '▶️';
  }

  /**
   * Carga la configuración actual del autodialer
   */
  loadConfiguracion(): void {
    this.autoDialerService.getConfiguracion().subscribe({
      next: (config) => {
        this.intensidadMarcacion = config.intensidadMarcacion;
        this.intervaloMarcacionSegundos = config.intervaloMarcacionSegundos;
      },
      error: (err) => {
        console.error('Error loading configuración:', err);
        this.error = 'Error al cargar la configuración';
      }
    });
  }

  /**
   * Guarda la configuración del autodialer
   */
  guardarConfiguracion(): void {
    this.loadingConfig = true;
    this.error = null;
    this.configSuccessMessage = null;

    const config = {
      intensidadMarcacion: this.intensidadMarcacion,
      intervaloMarcacionSegundos: this.intervaloMarcacionSegundos
    };

    this.autoDialerService.updateConfiguracion(config).subscribe({
      next: () => {
        this.loadingConfig = false;
        this.configSuccessMessage = 'Configuración guardada correctamente';

        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.configSuccessMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error guardando configuración:', err);
        this.error = 'Error al guardar la configuración';
        this.loadingConfig = false;
      }
    });
  }
}
