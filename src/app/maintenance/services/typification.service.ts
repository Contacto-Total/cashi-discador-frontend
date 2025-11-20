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
  ClassificationType,
  AdditionalField
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
  private catalogUrl = `${environment.gatewayUrl}/v2/typifications/catalog`;
  private configUrl = `${environment.gatewayUrl}/v2/typifications/config`;

  constructor(private http: HttpClient) {}

  // Catalog Management (V2)
  getAllClassifications(): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}`);
  }

  getTypificationsByType(type: ClassificationType): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/type/${type}`);
  }

  getTypificationsByLevel(level: number): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/level/${level}`);
  }

  getTypificationsByParent(parentId: number): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/${parentId}/children`);
  }

  getClassificationById(id: number): Observable<TypificationCatalog> {
    return this.http.get<TypificationCatalog>(`${this.catalogUrl}/${id}`);
  }

  getRootTypifications(): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(`${this.catalogUrl}/roots`);
  }

  createTypification(command: CreateTypificationCommand): Observable<TypificationCatalog> {
    return this.http.post<TypificationCatalog>(`${this.catalogUrl}`, command);
  }

  updateTypification(id: number, command: UpdateTypificationCommand): Observable<TypificationCatalog> {
    return this.http.put<TypificationCatalog>(`${this.catalogUrl}/${id}`, command);
  }

  deleteTypification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.catalogUrl}/${id}`);
  }

  activateTypification(id: number): Observable<TypificationCatalog> {
    return this.http.put<TypificationCatalog>(`${this.catalogUrl}/${id}/activate`, {});
  }

  deactivateTypification(id: number): Observable<TypificationCatalog> {
    return this.http.put<TypificationCatalog>(`${this.catalogUrl}/${id}/deactivate`, {});
  }

  updateDisplayOrder(updates: Array<{id: number, displayOrder: number}>): Observable<void> {
    // Este endpoint necesita ser implementado en el backend V2
    return this.http.patch<void>(`${this.catalogUrl}/display-order`, updates);
  }

  // Tenant Configuration Management (V2)
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

  getTenantClassificationsByType(
    tenantId: number,
    type: ClassificationType,
    portfolioId?: number
  ): Observable<TenantTypificationConfig[]> {
    // Este método necesita ser implementado en el backend V2 si es necesario
    // Por ahora, obtenemos todas y filtramos en el frontend
    return this.getTenantClassifications(tenantId, portfolioId);
  }

  getTenantClassificationsByLevel(
    tenantId: number,
    level: number,
    portfolioId?: number
  ): Observable<TenantTypificationConfig[]> {
    // Este método necesita ser implementado en el backend V2 si es necesario
    return this.getTenantClassifications(tenantId, portfolioId);
  }

  getEnabledClassifications(
    tenantId: number,
    portfolioId?: number
  ): Observable<TenantTypificationConfig[]> {
    // Filtrar en el frontend las que están habilitadas
    return this.getTenantClassifications(tenantId, portfolioId);
  }

  getEffectiveTypifications(
    tenantId: number,
    portfolioId: number,
    subPortfolioId: number
  ): Observable<TypificationCatalog[]> {
    return this.http.get<TypificationCatalog[]>(
      `${this.configUrl}/effective/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}`
    );
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

  enableClassification(
    tenantId: number,
    typificationId: number,
    portfolioId?: number,
    subPortfolioId?: number,
    userId?: number
  ): Observable<TenantTypificationConfig> {
    const params = new HttpParams().set('userId', userId?.toString() || '1');

    if (subPortfolioId && portfolioId) {
      return this.http.post<TenantTypificationConfig>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/enable`,
        {},
        { params }
      );
    } else if (portfolioId) {
      // Necesitaría un endpoint sin subportfolio en el backend
      return this.http.post<TenantTypificationConfig>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/0/typification/${typificationId}/enable`,
        {},
        { params }
      );
    } else {
      // Necesitaría un endpoint solo con tenant
      return this.http.post<TenantTypificationConfig>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/0/subportfolio/0/typification/${typificationId}/enable`,
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
  ): Observable<TenantTypificationConfig> {
    const params = new HttpParams().set('userId', userId?.toString() || '1');

    if (subPortfolioId && portfolioId) {
      return this.http.post<TenantTypificationConfig>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/${subPortfolioId}/typification/${typificationId}/disable`,
        {},
        { params }
      );
    } else if (portfolioId) {
      return this.http.post<TenantTypificationConfig>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/${portfolioId}/subportfolio/0/typification/${typificationId}/disable`,
        {},
        { params }
      );
    } else {
      return this.http.post<TenantTypificationConfig>(
        `${this.configUrl}/tenant/${tenantId}/portfolio/0/subportfolio/0/typification/${typificationId}/disable`,
        {},
        { params }
      );
    }
  }

  // Tenant Management (usar API Gateway)
  getAllTenants(): Observable<Tenant[]> {
    return this.http.get<Tenant[]>(`${environment.gatewayUrl}/tenants`);
  }

  // Portfolio Management (usar API Gateway)
  getPortfoliosByTenant(tenantId: number): Observable<Portfolio[]> {
    return this.http.get<Portfolio[]>(`${environment.gatewayUrl}/tenants/${tenantId}/carteras`);
  }

  // SubPortfolio Management
  getSubPortfoliosByPortfolio(portfolioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.gatewayUrl}/carteras/${portfolioId}/subcarteras`);
  }

  // Additional Fields
  getAdditionalFields(typificationId: number): Observable<AdditionalField[]> {
    return this.http.get<AdditionalField[]>(
      `${this.catalogUrl}/${typificationId}/additional-fields`
    );
  }

  // Helper method to build tree structure
  buildClassificationTree(typifications: TypificationCatalog[]): any[] {
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
