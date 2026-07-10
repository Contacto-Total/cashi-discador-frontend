import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { map } from 'rxjs/operators';

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
  searchType = signal<'documento' | 'telefono' | 'nombre'>('documento');
  searching = signal(false);
  searchError = signal('');
  hasSearched = signal(false);
  nameSearchTotal = signal(0);
  nameSearchPage = signal(0);
  nameSearchSize = signal(20);
  nameSearchTotalPages = signal(0);

  // Resultados encontrados (para mostrar contexto antes de navegar)
  foundResults = signal<GlobalSearchResult[]>([]);

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
    this.foundResults.set([]);
    this.searchError.set('');
  }

  setSearchType(type: 'documento' | 'telefono' | 'nombre'): void {
    this.searchType.set(type);
    this.searchValue.set('');
    this.foundResults.set([]);
    this.searchError.set('');
    this.hasSearched.set(false);
    this.resetNamePagination();
  }

  search(page = 0): void {
    const value = this.searchValue().trim();
    if (!value) {
      this.searchError.set(this.getEmptySearchMessage());
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

    if (this.searchType() === 'nombre' && value.length < 3) {
      this.searchError.set('Ingresa al menos 3 caracteres para buscar por nombre');
      return;
    }

    this.searching.set(true);
    this.searchError.set('');
    this.foundResults.set([]);
    this.hasSearched.set(true);

    if (this.searchType() === 'nombre') {
      this.searchByName(value, page);
      return;
    }

    const obs = this.searchType() === 'documento'
      ? this.clientSearchService.findClientGlobal(value).pipe(map(result => [result]))
      : this.clientSearchService.findClientGlobalByPhone(value);

    obs.subscribe({
      next: (results: GlobalSearchResult[]) => {
        this.searching.set(false);
        this.foundResults.set(results.filter(r => r && r.clientData && r.clientData.documento));
        this.resetNamePagination();
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

  searchByName(value: string, page: number): void {
    this.clientSearchService.findClientsGlobalByName(value, page, this.nameSearchSize()).subscribe({
      next: (response) => {
        this.searching.set(false);
        this.foundResults.set((response.data || []).filter(r => r && r.clientData && r.clientData.documento));
        this.nameSearchTotal.set(response.total || 0);
        this.nameSearchPage.set(response.page || 0);
        this.nameSearchSize.set(response.size || this.nameSearchSize());
        this.nameSearchTotalPages.set(response.totalPages || 0);
      },
      error: (err) => {
        this.searching.set(false);
        if (err.status === 404) {
          this.foundResults.set([]);
          this.nameSearchTotal.set(0);
          this.nameSearchPage.set(0);
          this.nameSearchTotalPages.set(0);
        } else {
          this.searchError.set('Error al buscar clientes por nombre');
        }
        console.error('Error:', err);
      }
    });
  }

  changeNamePage(page: number): void {
    if (this.searchType() !== 'nombre') return;
    if (page < 0 || page >= this.nameSearchTotalPages()) return;
    this.search(page);
  }

  goToManagement(result: GlobalSearchResult): void {
    if (!result?.clientData?.documento) return;

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
    this.foundResults.set([]);
    this.searchError.set('');
    this.hasSearched.set(false);
    this.resetNamePagination();
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

  getSearchPlaceholder(): string {
    if (this.searchType() === 'documento') return 'Ingresa el documento del cliente (DNI/Cédula)';
    if (this.searchType() === 'telefono') return 'Ingresa el número de teléfono';
    return 'Ingresa nombre, apellido o nombre completo';
  }

  getEmptySearchMessage(): string {
    if (this.searchType() === 'documento') return 'Ingresa un documento para buscar';
    if (this.searchType() === 'telefono') return 'Ingresa un número de teléfono para buscar';
    return 'Ingresa un nombre o apellido para buscar';
  }

  private resetNamePagination(): void {
    this.nameSearchTotal.set(0);
    this.nameSearchPage.set(0);
    this.nameSearchTotalPages.set(0);
  }
}
