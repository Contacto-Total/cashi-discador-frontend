import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TypificationCatalog,
  TenantTypificationConfig,
  CreateTypificationCommand,
  UpdateTypificationCommand,
  UpdateTypificationConfigCommand,
  ClassificationType
} from '../models/typification.model';
import { Portfolio } from '../models/portfolio.model';
import { Tenant } from '../models/tenant.model';

export interface CsvMappingResource {
  id: number;
  csvColumnName: string;
  targetField: string;
  dataType: string;
  columnOrder: number;
}

@Injectable({
  providedIn: 'root'
})
export class TypificationService {
  private baseUrl = environment.apiUrl;
  private catalogUrl = `${this.baseUrl}/v2/typifications/catalog`;
  private configUrl = `${this.baseUrl}/v2/typifications/config`;

  constructor(private http: HttpClient) {}

  // Catalog Management
  getAllClassifications(): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}`);
  }

  getActiveClassifications(): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/active`);
  }

  getTypificationsByType(type: ClassificationType): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/type/${type}`);
  }

  getTypificationsByLevel(level: number): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/level/${level}`);
  }

  getRootTypifications(): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/roots`);
  }

  getTypificationsByParent(parentId: number): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/${parentId}/children`);
  }

  getClassificationById(id: number): Observable<TypificationCatalog> {
    return this.http.get<TypificationCatalog>(`${this.catalogUrl}/${id}`);
  }

  getClassificationByCode(code: string): Observable<TypificationCatalog> {
    return this.http.get<TypificationCatalog>(`${this.catalogUrl}/code/${code}`);
  }

  createTypification(command: CreateTypificationCommand): Observable<TypificationCatalog> {
    return this.http.post<TypificationCatalog>(`${this.catalogUrl}`, command);
  }

  updateTypification(id: number, command: UpdateTypificationCommand): Observable<TypificationCatalog> {
    return this.http.put<TypificationCatalog>(`${this.catalogUrl}/${id}`, command);
  }

  deleteTypification(id: number): Observable<any> {
    return this.http.delete(`${this.catalogUrl}/${id}`);
  }

  activateTypification(id: number): Observable<TypificationCatalog> {
    return this.http.put<TypificationCatalog>(`${this.catalogUrl}/${id}/activate`, {});
  }

  deactivateTypification(id: number): Observable<TypificationCatalog> {
    return this.http.put<TypificationCatalog>(`${this.catalogUrl}/${id}/deactivate`, {});
  }

  checkCodeExists(code: string): Observable<{exists: boolean}> {
    return this.http.get<{exists: boolean}>(`${this.catalogUrl}/code/${code}/exists`);
  }

  countActiveByLevel(level: number): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.catalogUrl}/level/${level}/count`);
  }

  // Tenant Configuration Management
  getTenantClassifications(tenantId: number, portfolioId?: number, subPortfolioId?: number): Observable<TenantTypificationConfig[]> {
    if (subPortfolioId && portfolioId) {
      return this.http.get<TenantTypificationConfig[]>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}`
      );
    } else if (portfolioId) {
      return this.http.get<TenantTypificationConfig[]>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}`
      );
    } else {
      return this.http.get<TenantTypificationConfig[]>(
        `${this.configUrl}/tenant/${tenantId}`
      );
    }
  }

  getEffectiveTypifications(tenantId: number, portfolioId: number, subPortfolioId: number): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(
      `${this.configUrl}/effective/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}`
    );
  }

  getTenantClassificationsByType(
    tenantId: number,
    type: ClassificationType,
    portfolioId?: number
  ): Observable<TenantTypificationConfig[]> {
    // Get all and filter by type on client side
    return this.getTenantClassifications(tenantId, portfolioId);
  }

  getTenantClassificationsByLevel(
    tenantId: number,
    level: number,
    portfolioId?: number
  ): Observable<TenantTypificationConfig[]> {
    // Get all and filter by level on client side
    return this.getTenantClassifications(tenantId, portfolioId);
  }

  getEnabledClassifications(
    tenantId: number,
    portfolioId?: number
  ): Observable<TenantTypificationConfig[]> {
    // Get all and filter enabled on client side
    return this.getTenantClassifications(tenantId, portfolioId);
  }

  createTenantConfiguration(config: TenantTypificationConfig): Observable<TenantTypificationConfig> {
    return this.http.post<TenantTypificationConfig>(`${this.configUrl}`, config);
  }

  updateTenantTypificationConfig(
    configId: number,
    command: UpdateTypificationConfigCommand
  ): Observable<TenantTypificationConfig> {
    return this.http.put<TenantTypificationConfig>(
      `${this.configUrl}/${configId}`,
      command
    );
  }

  deleteTenantConfiguration(configId: number): Observable<any> {
    return this.http.delete(`${this.configUrl}/${configId}`);
  }

  enableClassification(
    tenantId: number,
    typificationId: number,
    portfolioId: number,
    subPortfolioId: number,
    userId: number
  ): Observable<TenantTypificationConfig> {
    return this.http.post<TenantTypificationConfig>(
      `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/enable?userId=${userId}`,
      {}
    );
  }

  disableClassification(
    tenantId: number,
    typificationId: number,
    portfolioId: number,
    subPortfolioId: number,
    userId: number
  ): Observable<TenantTypificationConfig> {
    return this.http.post<TenantTypificationConfig>(
      `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/disable?userId=${userId}`,
      {}
    );
  }

  countConfigurationsByTenant(tenantId: number): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.configUrl}/tenant/${tenantId}/count`);
  }

  // Tenant Management
  getAllTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${this.baseUrl}/system-config/tenants`);
  }

  createTenant(data: {
    tenantCode: string;
    tenantName: string;
    businessName?: string;
    taxId?: string;
    countryCode?: string;
    timezone?: string;
    maxUsers?: number;
    maxConcurrentSessions?: number;
    subscriptionTier?: string;
  }): Observable<Tenant> {
    return this.http.post<Tenant>(`${this.baseUrl}/system-config/tenants`, data);
  }

  updateTenant(tenantId: number, data: {
    tenantName?: string;
    businessName?: string;
    taxId?: string;
    countryCode?: string;
    timezone?: string;
    maxUsers?: number;
    maxConcurrentSessions?: number;
    subscriptionTier?: string;
    isActive?: boolean;
  }): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.baseUrl}/system-config/tenants/${tenantId}`, data);
  }

  deleteTenant(tenantId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/system-config/tenants/${tenantId}`);
  }

  // Portfolio Management
  getPortfoliosByTenant(tenantId: number): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${this.baseUrl}/system-config/tenants/${tenantId}/portfolios`);
  }

  createPortfolio(data: {
    tenantId: number;
    portfolioCode: string;
    portfolioName: string;
    parentPortfolioId?: number;
    description?: string;
  }): Observable<Portfolio> {
    return this.http.post<Portfolio>(`${this.baseUrl}/system-config/portfolios`, data);
  }

  updatePortfolio(portfolioId: number, data: {
    portfolioName?: string;
    description?: string;
    isActive?: boolean;
  }): Observable<Portfolio> {
    return this.http.put<Portfolio>(`${this.baseUrl}/system-config/portfolios/${portfolioId}`, data);
  }

  deletePortfolio(portfolioId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/system-config/portfolios/${portfolioId}`);
  }

  // SubPortfolio Management
  getSubPortfoliosByPortfolio(portfolioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/system-config/portfolios/${portfolioId}/subportfolios`);
  }

  // CSV Column Mapping Management
  saveCsvMappings(portfolioId: number, csvHeaders: string[]): Observable<CsvMappingResource[]> {
    return this.http.post<CsvMappingResource[]>(
      `${this.baseUrl}/portfolios/${portfolioId}/csv-mappings`,
      { csvHeaders }
    );
  }

  getCsvMappings(portfolioId: number): Observable<CsvMappingResource[]> {
    return this.http.get<CsvMappingResource[]>(
      `${this.baseUrl}/portfolios/${portfolioId}/csv-mappings`
    );
  }

  deleteCsvMappings(portfolioId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/portfolios/${portfolioId}/csv-mappings`
    );
  }

  // Helper method to build tree structure
  buildClassificationTree(typifications: TypificationCatalog[]): TypificationTreeNode[] {
    const map = new Map<number, TypificationTreeNode>();
    const roots: TypificationTreeNode[] = [];

    // Create nodes
    typifications.forEach(tipificacion => {
      map.set(tipificacion.id, {
        tipificacion,
        hijos: [],
        nivel: tipificacion.nivelJerarquia
      });
    });

    // Build tree
    typifications.forEach(tipificacion => {
      const node = map.get(tipificacion.id);
      if (node) {
        if (tipificacion.tipificacionPadre?.id) {
          const parent = map.get(tipificacion.tipificacionPadre.id);
          if (parent) {
            parent.hijos.push(node);
          }
        } else {
          roots.push(node);
        }
      }
    });

    // Sort children by ordenVisualizacion
    const sortChildren = (node: TypificationTreeNode) => {
      if (node.hijos.length > 0) {
        node.hijos.sort((a, b) => {
          const orderA = a.tipificacion.ordenVisualizacion || 0;
          const orderB = b.tipificacion.ordenVisualizacion || 0;
          return orderA - orderB;
        });
        node.hijos.forEach(child => sortChildren(child));
      }
    };

    roots.forEach(root => sortChildren(root));
    return roots;
  }
}
