import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

/** idSubcartera → sus compras (orden_compra de la base), de la más antigua a la más nueva. */
export type ComprasPorSubcartera = Record<number, string[]>;

/**
 * Compras de cada subcartera (hoy solo Tramo Propio: PRIMERA, SEGUNDA, …), para las opciones
 * «TRAMO PROPIO · PRIMERA» del filtro Subcartera de los reportes. Salen de la base: una compra nueva
 * aparece sola. Se piden una vez por sesión de la pantalla.
 */
@Injectable({ providedIn: 'root' })
export class ComprasCarteraService {
  private readonly url = `${environment.gatewayUrl}/reportes/compras`;
  private cache$?: Observable<ComprasPorSubcartera>;

  /** Compras ya cargadas (ver cargar()); vacío mientras no llegan. */
  readonly compras = signal<ComprasPorSubcartera>({});

  constructor(private http: HttpClient) {}

  /** Pide las compras una vez y las deja en compras(). */
  cargar(): void {
    this.obtener().subscribe(compras => this.compras.set(compras));
  }

  obtener(): Observable<ComprasPorSubcartera> {
    this.cache$ ??= this.http.get<ComprasPorSubcartera>(this.url).pipe(
      // Sin compras el filtro queda como antes: una opción por subcartera.
      catchError(() => of({} as ComprasPorSubcartera)),
      shareReplay(1)
    );
    return this.cache$;
  }
}

export interface OpcionSubcartera {
  valor: string;
  etiqueta: string;
}

/**
 * Opciones del combo Subcartera: cada subcartera y, debajo, una por cada compra suya
 * («TRAMO PROPIO», «TRAMO PROPIO · PRIMERA», «TRAMO PROPIO · SEGUNDA»).
 */
export function opcionesSubcartera(
  subcarteras: { id: number; nombreSubcartera: string }[],
  compras: ComprasPorSubcartera
): OpcionSubcartera[] {
  return subcarteras.flatMap(sub => [
    { valor: valorOpcionCompra(sub.id), etiqueta: sub.nombreSubcartera },
    ...(compras[sub.id] ?? []).map(compra => ({
      valor: valorOpcionCompra(sub.id, compra),
      etiqueta: `${sub.nombreSubcartera} · ${compra}`
    }))
  ]);
}

/** Valor de una opción del combo Subcartera: '21' (toda la subcartera) o '21:PRIMERA' (una compra). */
export function valorOpcionCompra(idSubcartera: number, compra?: string | null): string {
  return compra ? `${idSubcartera}:${compra}` : String(idSubcartera);
}

/** Lo inverso de valorOpcionCompra. '' → sin subcartera. */
export function leerOpcionCompra(valor: string | null | undefined): { idSubcartera: number | null; compra: string | null } {
  const texto = valor ?? '';
  const corte = texto.indexOf(':');
  const id = corte < 0 ? texto : texto.slice(0, corte);
  return {
    idSubcartera: id ? Number(id) : null,
    compra: corte < 0 ? null : texto.slice(corte + 1) || null
  };
}

/** Color de cada compra en el desglose. */
export interface ColorCompra { texto: string; fondo: string; borde: string }
const COLORES_COMPRA: ColorCompra[] = [
  { texto: '#6d28d9', fondo: '#f5f3ff', borde: '#ddd6fe' },
  { texto: '#0e7490', fondo: '#ecfeff', borde: '#a5f3fc' },
  { texto: '#b45309', fondo: '#fffbeb', borde: '#fde68a' },
  { texto: '#be123c', fondo: '#fff1f2', borde: '#fecdd3' },
  { texto: '#047857', fondo: '#ecfdf5', borde: '#a7f3d0' },
  { texto: '#1d4ed8', fondo: '#eff6ff', borde: '#bfdbfe' }
];
export function colorCompra(i: number): ColorCompra {
  return COLORES_COMPRA[((i % COLORES_COMPRA.length) + COLORES_COMPRA.length) % COLORES_COMPRA.length];
}
