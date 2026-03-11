import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { ClientSearchService, DynamicClient, GlobalSearchResult } from '../../core/services/client-search.service';

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
export class ManualManagementComponent implements OnInit {
  // Búsqueda
  searchValue = signal('');
  searchType = signal<'documento' | 'telefono'>('documento');
  searching = signal(false);
  searchError = signal('');

  // Resultado encontrado (para mostrar contexto antes de navegar)
  foundResult = signal<GlobalSearchResult | null>(null);

  constructor(
    private router: Router,
    private clientSearchService: ClientSearchService
  ) {}

  ngOnInit(): void {
    // No need to load anything on init
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
