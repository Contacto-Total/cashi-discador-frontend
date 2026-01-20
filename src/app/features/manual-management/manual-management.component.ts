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
  searchDocument = signal('');
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
    this.searchDocument.set(value);
    // Clear previous result when typing
    this.foundResult.set(null);
    this.searchError.set('');
  }

  searchByDocument(): void {
    const documento = this.searchDocument().trim();
    if (!documento) {
      this.searchError.set('Ingresa un documento para buscar');
      return;
    }

    if (documento.length < 6) {
      this.searchError.set('El documento debe tener al menos 6 caracteres');
      return;
    }

    this.searching.set(true);
    this.searchError.set('');
    this.foundResult.set(null);

    this.clientSearchService.findClientGlobal(documento).subscribe({
      next: (result) => {
        this.searching.set(false);
        this.foundResult.set(result);
      },
      error: (err) => {
        this.searching.set(false);
        if (err.status === 404) {
          this.searchError.set('Cliente no encontrado con ese documento');
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
    this.searchDocument.set('');
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
