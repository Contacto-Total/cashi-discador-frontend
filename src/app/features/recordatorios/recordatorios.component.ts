import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RecordatoriosService } from '../../core/services/recordatorios.service';
import { CallService } from '../../core/services/call.service';
import { AuthService } from '../../core/services/auth.service';
import { RecordatorioPromesa, EstadisticasRecordatorios } from '../../core/models/recordatorio.model';

@Component({
  selector: 'app-recordatorios',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './recordatorios.component.html',
  styleUrls: ['./recordatorios.component.css']
})
export class RecordatoriosComponent implements OnInit, OnDestroy {
  // Lista de recordatorios
  recordatorios = signal<RecordatorioPromesa[]>([]);
  loading = signal(false);
  error = signal('');

  // Estadísticas
  estadisticas = signal<EstadisticasRecordatorios | null>(null);

  // Filtro: hoy o próximos días
  vistaActual = signal<'hoy' | 'proximos'>('hoy');
  diasProximos = signal(3);

  // Control de llamada en progreso
  llamandoA = signal<number | null>(null);

  private destroy$ = new Subject<void>();
  private refreshInterval$ = interval(60000); // Refrescar cada minuto

  constructor(
    private router: Router,
    private recordatoriosService: RecordatoriosService,
    private callService: CallService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarRecordatorios();
    this.cargarEstadisticas();

    // Auto-refresh cada minuto
    this.refreshInterval$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cargarRecordatorios();
        this.cargarEstadisticas();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private get idAgente(): number {
    return this.authService.getCurrentUser()?.id || 0;
  }

  cargarRecordatorios(): void {
    if (!this.idAgente) {
      this.error.set('No se pudo obtener el ID del agente');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const observable = this.vistaActual() === 'hoy'
      ? this.recordatoriosService.getMisRecordatoriosHoy(this.idAgente)
      : this.recordatoriosService.getMisRecordatoriosProximos(this.idAgente, this.diasProximos());

    observable.subscribe({
      next: (data) => {
        this.recordatorios.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando recordatorios:', err);
        this.error.set('Error al cargar los recordatorios');
        this.loading.set(false);
      }
    });
  }

  cargarEstadisticas(): void {
    if (!this.idAgente) return;

    this.recordatoriosService.getEstadisticas(this.idAgente).subscribe({
      next: (stats) => this.estadisticas.set(stats),
      error: (err) => console.error('Error cargando estadísticas:', err)
    });
  }

  cambiarVista(vista: 'hoy' | 'proximos'): void {
    this.vistaActual.set(vista);
    this.cargarRecordatorios();
  }

  /**
   * Inicia una llamada al cliente y navega a la pantalla de tipificación
   */
  llamarCliente(recordatorio: RecordatorioPromesa): void {
    if (!recordatorio.telefono) {
      alert('Este cliente no tiene teléfono registrado');
      return;
    }

    this.llamandoA.set(recordatorio.idCuota);

    // Hacer la llamada
    this.callService.makeCall({
      agentId: this.idAgente,
      phoneNumber: recordatorio.telefono
    }).subscribe({
      next: (call) => {
        console.log('Llamada iniciada:', call);

        // Navegar a collection-management con los datos del cliente
        this.router.navigate(['/collection-management'], {
          queryParams: {
            documento: recordatorio.documentoCliente,
            tenantId: recordatorio.idTenant,
            portfolioId: recordatorio.idCartera,
            subPortfolioId: recordatorio.idSubcartera,
            source: 'recordatorio',
            idCuota: recordatorio.idCuota
          }
        });

        this.llamandoA.set(null);
      },
      error: (err) => {
        console.error('Error al iniciar llamada:', err);
        alert('Error al iniciar la llamada. Intente nuevamente.');
        this.llamandoA.set(null);
      }
    });
  }

  /**
   * Navega directamente a tipificación sin hacer llamada (gestión manual)
   */
  gestionarSinLlamada(recordatorio: RecordatorioPromesa): void {
    this.router.navigate(['/collection-management'], {
      queryParams: {
        documento: recordatorio.documentoCliente,
        tenantId: recordatorio.idTenant,
        portfolioId: recordatorio.idCartera,
        subPortfolioId: recordatorio.idSubcartera,
        source: 'recordatorio-manual',
        idCuota: recordatorio.idCuota
      }
    });
  }

  // Helpers para formateo
  formatMonto(monto: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(monto);
  }

  formatFecha(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short'
    });
  }

  formatFechaCompleta(fecha: string): string {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoClass(recordatorio: RecordatorioPromesa): string {
    if (recordatorio.yaLlamoHoy) {
      return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
    }
    return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400';
  }

  getResultadoLabel(resultado: string | null): string {
    if (!resultado) return '-';
    const labels: { [key: string]: string } = {
      'CONTESTADO': 'Contestado',
      'NO_CONTESTADO': 'No contestó',
      'OCUPADO': 'Ocupado',
      'BUZON': 'Buzón',
      'NUMERO_INVALIDO': 'Inválido',
      'CONFIRMO_PAGO': 'Confirmó pago',
      'YA_PAGO': 'Ya pagó',
      'REPROGRAMAR': 'Reprogramar'
    };
    return labels[resultado] || resultado;
  }

  getPendientesCount(): number {
    return this.recordatorios().filter(r => !r.yaLlamoHoy).length;
  }

  getLlamadosCount(): number {
    return this.recordatorios().filter(r => r.yaLlamoHoy).length;
  }
}
