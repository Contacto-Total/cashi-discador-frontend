import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ClientSearchService, DynamicClient } from '../../core/services/client-search.service';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';

import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

@Component({
  selector: 'app-manual-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './manual-management.component.html',
  styleUrls: ['./manual-management.component.css']
})
export class ManualManagementComponent implements OnInit {
  // Selectores de contexto
  tenants: Tenant[] = [];
  portfolios: Portfolio[] = [];
  subPortfolios: SubPortfolio[] = [];
  selectedTenantId = signal<number | null>(null);
  selectedPortfolioId = signal<number | null>(null);
  selectedSubPortfolioId = signal<number | null>(null);
  loadingTenants = signal(false);
  loadingPortfolios = signal(false);
  loadingSubPortfolios = signal(false);

  // Búsqueda
  searchDocument = signal('');
  searchResults = signal<DynamicClient[]>([]);
  searching = signal(false);
  searchError = signal('');

  private searchSubject = new Subject<string>();

  constructor(
    private router: Router,
    private clientSearchService: ClientSearchService,
    private tenantService: TenantService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.setupSearchAutocomplete();
    this.loadTenants();
  }

  // ========== CARGA DE SELECTORES EN CASCADA ==========

  private loadTenants(): void {
    this.loadingTenants.set(true);
    this.tenantService.getAllTenants().subscribe({
      next: (tenants) => {
        this.tenants = tenants.filter(t => t.isActive);
        this.loadingTenants.set(false);
      },
      error: (err) => {
        console.error('Error cargando inquilinos:', err);
        this.loadingTenants.set(false);
      }
    });
  }

  onTenantChange(tenantId: number | null): void {
    this.selectedTenantId.set(tenantId);
    this.selectedPortfolioId.set(null);
    this.selectedSubPortfolioId.set(null);
    this.portfolios = [];
    this.subPortfolios = [];
    this.clearSearch();

    if (tenantId) {
      this.loadingPortfolios.set(true);
      this.portfolioService.getPortfoliosByTenant(tenantId).subscribe({
        next: (portfolios) => {
          this.portfolios = portfolios.filter(p => p.isActive);
          this.loadingPortfolios.set(false);
        },
        error: (err) => {
          console.error('Error cargando carteras:', err);
          this.loadingPortfolios.set(false);
        }
      });
    }
  }

  onPortfolioChange(portfolioId: number | null): void {
    this.selectedPortfolioId.set(portfolioId);
    this.selectedSubPortfolioId.set(null);
    this.subPortfolios = [];
    this.clearSearch();

    if (portfolioId) {
      this.loadingSubPortfolios.set(true);
      this.portfolioService.getSubPortfoliosByPortfolio(portfolioId).subscribe({
        next: (subPortfolios) => {
          this.subPortfolios = subPortfolios.filter(sp => sp.isActive);
          this.loadingSubPortfolios.set(false);
        },
        error: (err) => {
          console.error('Error cargando subcarteras:', err);
          this.loadingSubPortfolios.set(false);
        }
      });
    }
  }

  onSubPortfolioChange(subPortfolioId: number | null): void {
    this.selectedSubPortfolioId.set(subPortfolioId);
    this.clearSearch();
  }

  canSearch(): boolean {
    return this.selectedTenantId() !== null &&
           this.selectedPortfolioId() !== null &&
           this.selectedSubPortfolioId() !== null;
  }

  // ========== BÚSQUEDA DE CLIENTE ==========

  private setupSearchAutocomplete(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 3 || !this.canSearch()) {
          return of([]);
        }
        this.searching.set(true);
        this.searchError.set('');
        return this.clientSearchService.searchClientsByDocumento(
          this.selectedTenantId()!,
          this.selectedPortfolioId()!,
          this.selectedSubPortfolioId()!,
          term,
          10
        ).pipe(
          catchError(err => {
            console.error('Error buscando clientes:', err);
            this.searchError.set('Error al buscar clientes');
            return of([]);
          })
        );
      })
    ).subscribe(results => {
      this.searching.set(false);
      this.searchResults.set(results);
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchDocument.set(value);
    this.searchSubject.next(value);
  }

  searchByDocument(): void {
    const documento = this.searchDocument();
    if (!documento) {
      this.searchError.set('Ingresa un documento para buscar');
      return;
    }

    if (!this.canSearch()) {
      this.searchError.set('Selecciona inquilino, cartera y subcartera primero');
      return;
    }

    this.searching.set(true);
    this.searchError.set('');

    this.clientSearchService.findClientByDocumento(
      this.selectedTenantId()!,
      this.selectedPortfolioId()!,
      this.selectedSubPortfolioId()!,
      documento
    ).subscribe({
      next: (client) => {
        this.searching.set(false);
        // Redirigir a collection-management con los datos del cliente
        this.navigateToCollectionManagement(client);
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

  selectClient(client: DynamicClient): void {
    // Redirigir a collection-management con los datos del cliente
    this.navigateToCollectionManagement(client);
  }

  private navigateToCollectionManagement(client: DynamicClient): void {
    // Navegar a collection-management pasando los datos como state
    this.router.navigate(['/collection-management'], {
      queryParams: {
        documento: client.documento,
        tenantId: this.selectedTenantId(),
        portfolioId: this.selectedPortfolioId(),
        subPortfolioId: this.selectedSubPortfolioId(),
        source: 'manual'
      }
    });
  }

  clearSearch(): void {
    this.searchDocument.set('');
    this.searchResults.set([]);
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
