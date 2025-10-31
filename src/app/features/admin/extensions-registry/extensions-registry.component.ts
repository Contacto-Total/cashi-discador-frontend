import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminMonitoringService, ExtensionRegistration } from '../../../core/services/admin-monitoring.service';

@Component({
  selector: 'app-extensions-registry',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './extensions-registry.component.html',
  styleUrls: ['./extensions-registry.component.css']
})
export class ExtensionsRegistryComponent implements OnInit, OnDestroy {
  extensions: ExtensionRegistration[] = [];
  loading: boolean = false;
  error: string | null = null;

  private pollingSubscription?: Subscription;

  constructor(
    private router: Router,
    private monitoringService: AdminMonitoringService
  ) {}

  ngOnInit(): void {
    this.loadExtensions();
    this.startPolling();
  }

  ngOnDestroy(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  /**
   * Carga las extensiones registradas
   */
  loadExtensions(): void {
    this.loading = true;
    this.error = null;

    this.monitoringService.getExtensionRegistrations().subscribe({
      next: (extensions) => {
        this.extensions = extensions;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading extensions:', err);
        this.error = 'Error al cargar las extensiones registradas';
        this.loading = false;
      }
    });
  }

  /**
   * Inicia polling cada 5 segundos
   */
  startPolling(): void {
    this.pollingSubscription = interval(5000).pipe(
      switchMap(() => this.monitoringService.getExtensionRegistrations())
    ).subscribe({
      next: (extensions) => {
        this.extensions = extensions;
      },
      error: (err) => {
        console.error('Error polling extensions:', err);
      }
    });
  }

  /**
   * Vuelve a la pantalla de campañas
   */
  goBack(): void {
    this.router.navigate(['/admin/campaigns']);
  }

  /**
   * Obtiene la clase CSS según el estado
   */
  getStatusClass(status: string): string {
    return status === 'REGISTRADO' ? 'status-registered' : 'status-unregistered';
  }
}
