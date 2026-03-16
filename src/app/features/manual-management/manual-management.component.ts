import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { ClientSearchService, DynamicClient, GlobalSearchResult } from '../../core/services/client-search.service';
import { AgentStatusService } from '../../core/services/agent-status.service';
import { AuthService } from '../../core/services/auth.service';
import { AgentState } from '../../core/models/agent-status.model';

@Component({
  selector: 'app-manual-management',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './manual-management.component.html',
  styleUrls: ['./manual-management.component.css']
})
export class ManualManagementComponent implements OnInit, OnDestroy {
  // Búsqueda
  searchValue = signal('');
  searchType = signal<'documento' | 'telefono'>('documento');
  searching = signal(false);
  searchError = signal('');

  // Resultado encontrado (para mostrar contexto antes de navegar)
  foundResult = signal<GlobalSearchResult | null>(null);

  private previousState: string | null = null;

  constructor(
    private router: Router,
    private clientSearchService: ClientSearchService,
    private agentStatusService: AgentStatusService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Cambiar estado a GESTION_MANUAL al entrar
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      // Guardar estado anterior para restaurarlo al salir
      this.agentStatusService.currentStatus$.subscribe(status => {
        if (status && !this.previousState && status.estadoActual !== 'GESTION_MANUAL') {
          this.previousState = status.estadoActual;
        }
      });

      this.agentStatusService.changeStatus(currentUser.id, {
        estado: AgentState.GESTION_MANUAL,
        notas: 'Entró a gestión manual'
      }).subscribe({
        next: () => console.log('✅ Estado cambiado a GESTION_MANUAL'),
        error: (err) => console.error('❌ Error cambiando estado:', err)
      });
    }
  }

  ngOnDestroy(): void {
    // Restaurar estado anterior al salir (DISPONIBLE por defecto)
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.id) {
      const restoreState = this.previousState === 'DISPONIBLE' || !this.previousState
        ? AgentState.DISPONIBLE
        : this.previousState as AgentState;

      this.agentStatusService.changeStatus(currentUser.id, {
        estado: restoreState,
        notas: 'Salió de gestión manual'
      }).subscribe({
        next: () => console.log(`✅ Estado restaurado a ${restoreState}`),
        error: (err) => console.error('❌ Error restaurando estado:', err)
      });
    }
  }

  // ========== BÚSQUEDA GLOBAL DE CLIENTE ==========

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.foundResult.set(null);
    this.searchError.set('');
  }

  setSearchType(type: 'documento' | 'telefono'): void {
    this.searchType.set(type);
    this.searchValue.set('');
    this.foundResult.set(null);
    this.searchError.set('');
  }

  search(): void {
    const value = this.searchValue().trim();
    if (!value) {
      this.searchError.set(this.searchType() === 'documento'
        ? 'Ingresa un documento para buscar'
        : 'Ingresa un número de teléfono para buscar');
      return;
    }

    if (this.searchType() === 'documento' && value.length < 6) {
      this.searchError.set('El documento debe tener al menos 6 caracteres');
      return;
    }

    if (this.searchType() === 'telefono' && value.length < 7) {
      this.searchError.set('El teléfono debe tener al menos 7 dígitos');
      return;
    }

    this.searching.set(true);
    this.searchError.set('');
    this.foundResult.set(null);

    const obs = this.searchType() === 'documento'
      ? this.clientSearchService.findClientGlobal(value)
      : this.clientSearchService.findClientGlobalByPhone(value);

    obs.subscribe({
      next: (result) => {
        this.searching.set(false);
        this.foundResult.set(result);
      },
      error: (err) => {
        this.searching.set(false);
        if (err.status === 404) {
          this.searchError.set(this.searchType() === 'documento'
            ? 'Cliente no encontrado con ese documento'
            : 'Cliente no encontrado con ese número de teléfono');
        } else {
          this.searchError.set('Error al buscar el cliente');
        }
        console.error('Error:', err);
      }
    });
  }

  goToManagement(): void {
    const result = this.foundResult();
    if (!result) return;

    this.router.navigate(['/collection-management'], {
      queryParams: {
        documento: result.clientData.documento,
        tenantId: result.tenantId,
        portfolioId: result.portfolioId,
        subPortfolioId: result.subPortfolioId,
        source: 'manual'
      }
    });
  }

  clearSearch(): void {
    this.searchValue.set('');
    this.foundResult.set(null);
    this.searchError.set('');
  }

  // ========== HELPERS ==========

  getClientName(client: DynamicClient): string {
    if (client.nombre) return client.nombre;
    const nombres = client.nombres || '';
    const apellidos = client.apellidos || '';
    return `${nombres} ${apellidos}`.trim() || 'Sin nombre';
  }

  getClientPhone(client: DynamicClient): string {
    return client.telefono || client.telefono_1 || client.telefono_2 || 'Sin teléfono';
  }
}
