import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TypificationCatalogV2,
  TenantTypificationConfigV2,
  CreateTypificationCommandV2,
  UpdateTypificationCommandV2,
  UpdateTypificationConfigCommandV2,
  ClassificationTypeV2,
  AdditionalFieldV2
} from '../models/typification-v2.model';
import { Portfolio } from '../models/portfolio.model';
import { Tenant } from '../models/tenant.model';

@Injectable({
  providedIn: 'root'
})
export class TypificationV2Service {
  private catalogUrl = `${environment.gatewayUrl}/v2/typifications/catalog`;
  private configUrl = `${environment.gatewayUrl}/v2/typifications/config`;

  constructor(private http: HttpClient) {}

  // ========================================
  // Catalog Management (V2)
  // ========================================

  getAllClassifications(): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(`${this.catalogUrl}`);
  }

  getActiveClassifications(): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(`${this.catalogUrl}/active`);
  }

  getTypificationsByType(type: ClassificationTypeV2): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(`${this.catalogUrl}/type/${type}`);
  }

  getTypificationsByLevel(level: number): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(`${this.catalogUrl}/level/${level}`);
  }

  getTypificationsByParent(parentId: number): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(`${this.catalogUrl}/${parentId}/children`);
  }

  getClassificationById(id: number): Observable<TypificationCatalogV2> {
    return this.http.get<TypificationCatalogV2>(`${this.catalogUrl}/${id}`);
  }

  getRootTypifications(): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(`${this.catalogUrl}/roots`);
  }

  createTypification(command: CreateTypificationCommandV2): Observable<TypificationCatalogV2> {
    return this.http.post<TypificationCatalogV2>(`${this.catalogUrl}`, command);
  }

  updateTypification(id: number, command: UpdateTypificationCommandV2): Observable<TypificationCatalogV2> {
    return this.http.put<TypificationCatalogV2>(`${this.catalogUrl}/${id}`, command);
  }

  deleteTypification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.catalogUrl}/${id}`);
  }

  activateTypification(id: number): Observable<TypificationCatalogV2> {
    return this.http.put<TypificationCatalogV2>(`${this.catalogUrl}/${id}/activate`, {});
  }

  deactivateTypification(id: number): Observable<TypificationCatalogV2> {
    return this.http.put<TypificationCatalogV2>(`${this.catalogUrl}/${id}/deactivate`, {});
  }

  // ========================================
  // Tenant Configuration Management (V2)
  // ========================================

  getTenantClassifications(tenantId: number, portfolioId?: number, includeDisabled?: boolean): Observable<TenantTypificationConfigV2[]> {
    let params = new HttpParams();
    if (includeDisabled) {
      params = params.set('includeDisabled', 'true');
    }

    if (portfolioId) {
      return this.http.get<TenantTypificationConfigV2[]>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}`,
        { params }
      );
    } else {
      return this.http.get<TenantTypificationConfigV2[]>(
        `${this.configUrl}/tenant/${tenantId}`,
        { params }
      );
    }
  }

  getTenantClassificationsByType(
    tenantId: number,
    type: ClassificationTypeV2,
    portfolioId?: number
  ): Observable<TenantTypificationConfigV2[]> {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set('portfolioId', portfolioId.toString());
    }
    return this.http.get<TenantTypificationConfigV2[]>(
      `${this.configUrl}/tenant/${tenantId}/type/${type}`,
      { params }
    );
  }

  getEffectiveTypifications(
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number
  ): Observable<TypificationCatalogV2[]> {
    return this.http.get<TypificationCatalogV2[]>(
      `${this.configUrl}/effective/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}`
    );
  }

  updateTenantTypificationConfig(
    configId: number,
    command: UpdateTypificationConfigCommandV2
  ): Observable<TenantTypificationConfigV2> {
    return this.http.put<TenantTypificationConfigV2>(
      `${this.configUrl}/${configId}`,
      command
    );
  }

  enableClassification(
    tenantId: number,
    typificationId: number,
    portfolioId?: number,
    subPortfolioId?: number,
    userId?: number
  ): Observable<TenantTypificationConfigV2> {
    const params = new HttpParams().set('userId', userId?.toString() || '1');

    if (subPortfolioId && portfolioId) {
      // Subportfolio level
      return this.http.post<TenantTypificationConfigV2>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/enable`,
        {},
        { params }
      );
    } else if (portfolioId) {
      // Portfolio level (no subportfolio)
      return this.http.post<TenantTypificationConfigV2>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/typification/${typificationId}/enable`,
        {},
        { params }
      );
    } else {
      // Tenant level (no portfolio/subportfolio)
      return this.http.post<TenantTypificationConfigV2>(
        `${this.configUrl}/tenant/${tenantId}/typification/${typificationId}/enable`,
        {},
        { params }
      );
    }
  }

  disableClassification(
    tenantId: number,
    typificationId: number,
    portfolioId?: number,
    subPortfolioId?: number,
    userId?: number
  ): Observable<TenantTypificationConfigV2> {
    const params = new HttpParams().set('userId', userId?.toString() || '1');

    if (subPortfolioId && portfolioId) {
      // Subportfolio level
      return this.http.post<TenantTypificationConfigV2>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/disable`,
        {},
        { params }
      );
    } else if (portfolioId) {
      // Portfolio level (no subportfolio)
      return this.http.post<TenantTypificationConfigV2>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/typification/${typificationId}/disable`,
        {},
        { params }
      );
    } else {
      // Tenant level (no portfolio/subportfolio)
      return this.http.post<TenantTypificationConfigV2>(
        `${this.configUrl}/tenant/${tenantId}/typification/${typificationId}/disable`,
        {},
        { params }
      );
    }
  }

  // ========================================
  // Tenant & Portfolio Management
  // ========================================

  getAllTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${environment.webServiceUrl}/v1/system-config/tenants`);
  }

  getPortfoliosByTenant(tenantId: number): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${environment.webServiceUrl}/v1/system-config/tenants/${tenantId}/portfolios`);
  }

  getSubPortfoliosByPortfolio(portfolioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.webServiceUrl}/v1/system-config/portfolios/${portfolioId}/subportfolios`);
  }

  // ========================================
  // Additional Fields
  // ========================================

  getAdditionalFields(typificationId: number): Observable<AdditionalFieldV2[]> {
    return this.http.get<AdditionalFieldV2[]>(
      `${this.catalogUrl}/${typificationId}/additional-fields`
    );
  }

  /**
   * Obtiene los campos adicionales de una tipificación con valores dinámicos desde la tabla del cliente
   * @param tenantId ID del tenant
   * @param typificationId ID de la tipificación
   * @param portfolioId ID del portfolio (opcional)
   * @param clientId ID del cliente (opcional, para cargar valores dinámicos)
   */
  getTypificationFieldsWithValues(
    tenantId: number,
    typificationId: number,
    portfolioId?: number,
    clientId?: number
  ): Observable<{ typificationId: number; isLeaf: boolean; fields: AdditionalFieldV2[] }> {
    let params = new HttpParams();
    if (portfolioId) {
      params = params.set('portfolioId', portfolioId.toString());
    }
    if (clientId) {
      params = params.set('clientId', clientId.toString());
    }

    return this.http.get<{ typificationId: number; isLeaf: boolean; fields: AdditionalFieldV2[] }>(
      `${this.configUrl}/tenant/${tenantId}/typifications/${typificationId}/fields`,
      { params }
    );
  }

  /**
   * Obtiene las columnas numéricas disponibles en la tabla dinámica de una subcartera
   * @param tenantId ID del tenant
   * @param portfolioId ID del portfolio
   * @param subPortfolioId ID de la subcartera
   */
  getDynamicTableColumns(
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number
  ): Observable<{ columns: string[] }> {
    const params = new HttpParams()
      .set('tenantId', tenantId.toString())
      .set('portfolioId', portfolioId.toString())
      .set('subPortfolioId', subPortfolioId.toString());

    return this.http.get<{ columns: string[] }>(
      `${this.configUrl}/dynamic-table-columns`,
      { params }
    );
  }

  // ========================================
  // Helper Methods
  // ========================================

  buildClassificationTree(typifications: TypificationCatalogV2[]): any[] {
    const map = new Map<number, any>();
    const roots: any[] = [];

    // Create nodes
    typifications.forEach(typification => {
      map.set(typification.id, {
        typification,
        children: [],
        level: typification.nivelJerarquia
      });
    });

    // Build tree
    typifications.forEach(typification => {
      const node = map.get(typification.id);
      const parentId = typification.tipificacionPadre?.id;
      if (parentId) {
        const parent = map.get(parentId);
        if (parent) {
          parent.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    // Sort children by ordenVisualizacion
    const sortChildren = (node: any) => {
      if (node.children.length > 0) {
        node.children.sort((a: any, b: any) => {
          const orderA = a.typification.ordenVisualizacion || 0;
          const orderB = b.typification.ordenVisualizacion || 0;
          return orderA - orderB;
        });
        node.children.forEach((child: any) => sortChildren(child));
      }
    };

    roots.forEach(root => sortChildren(root));
    return roots;
  }
}
