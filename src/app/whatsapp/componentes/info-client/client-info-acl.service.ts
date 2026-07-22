import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ClientSearchService,
  DynamicClient,
  GlobalNameSearchResponse,
  GlobalSearchResult
} from '../../../core/services/client-search.service';

export type { DynamicClient, GlobalSearchResult, GlobalNameSearchResponse };

/**
 * ACL (anti-corruption layer) del módulo WhatsApp sobre el buscador de clientes
 * de /manual-management (`ClientSearchService`). El módulo de info-client habla
 * SOLO con este servicio, no con el core directamente: si el buscador cambia,
 * se adapta aquí y no en los widgets.
 */
@Injectable({ providedIn: 'root' })
export class ClientInfoAclService {
  constructor(private readonly clientSearch: ClientSearchService) {}

  /**
   * Clave de búsqueda por teléfono: los últimos 9 dígitos (de derecha a izquierda),
   * porque el número del chat/columna incluye el código de país.
   */
  phoneKey(phone?: string | null): string {
    const digits = (phone || '').replace(/\D/g, '');
    return digits.length > 9 ? digits.slice(-9) : digits;
  }

  /** Clientes que tienen ese teléfono (lista; mismo endpoint que manual-management). */
  searchByPhone(telefono: string): Observable<GlobalSearchResult[]> {
    return this.clientSearch.findClientGlobalByPhone(telefono);
  }

  /** Cliente por documento exacto (se normaliza a lista para el widget). */
  searchByDocument(documento: string): Observable<GlobalSearchResult[]> {
    return this.clientSearch.findClientGlobal(documento).pipe(map((r) => (r && r.clientData ? [r] : [])));
  }

  /** Clientes por nombre (paginado). */
  searchByName(q: string, page = 0, size = 20): Observable<GlobalNameSearchResponse> {
    return this.clientSearch.findClientsGlobalByName(q, page, size);
  }
}
