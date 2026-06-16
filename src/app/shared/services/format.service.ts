import { Injectable, signal } from '@angular/core';

export type DateInput = Date | string | number | null | undefined;

/**
 * Servicio ÚNICO de formateo de fechas, horas, números y moneda.
 *
 * Todo el formateo de la app pasa por aquí en vez de tener 'es-PE' hardcodeado en
 * ~75 sitios. Esto deja el locale en UN solo punto.
 *
 * Fase 2 (ACTIVA): el locale se enlaza al idioma del navegador (`navigator.language`)
 * al crear el servicio, con fallback a 'es-PE'. Modo "completo": TODO sigue al
 * navegador, incluidas las fechas (en-US → MM/DD/YYYY, es-PE → DD/MM/YYYY) y los
 * separadores de número/moneda. El símbolo de moneda se mantiene "S/" (es el PEN del
 * negocio, no depende del idioma). `setLocale()` permite override (p.ej. preferencia
 * de usuario) en el futuro.
 *
 * Se basa en `Intl.*` (nativo): no requiere registerLocaleData ni infla el bundle,
 * y NO toca el parsing de entrada (input type=date ISO + date-formats.ts).
 */
@Injectable({ providedIn: 'root' })
export class FormatService {
  /**
   * Resuelve el locale del navegador (BCP47, p.ej. "en-US", "es-ES", "pt-BR").
   * Fallback a 'es-PE' si no hay `navigator`, viene vacío o Intl no lo acepta.
   * Se lee UNA sola vez al crear el servicio (el idioma no cambia en la sesión) →
   * los pipes puros formatean con el locale correcto desde el arranque, sin
   * necesidad de reactividad.
   */
  private static resolveBrowserLocale(): string {
    try {
      const nav = typeof navigator !== 'undefined'
        ? (navigator.language || (navigator.languages && navigator.languages[0]) || '')
        : '';
      if (!nav) return 'es-PE';
      new Intl.DateTimeFormat(nav); // valida el tag; lanza RangeError si es inválido
      return nav;
    } catch {
      return 'es-PE';
    }
  }

  /** Fuente única de verdad del locale (Fase 2: enlazado al idioma del navegador). */
  private readonly _locale = signal<string>(FormatService.resolveBrowserLocale());
  readonly locale = this._locale.asReadonly();

  /** Moneda por defecto del negocio. */
  private readonly currencySymbol = 'S/';

  /** Fase 2: cambiar el locale activo (navegador / preferencia). */
  setLocale(locale: string): void {
    this._locale.set(locale);
  }

  /** Normaliza cualquier entrada a Date válida o null. */
  private toDate(value: DateInput): Date | null {
    if (value === null || value === undefined || value === '') return null;
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Fecha. Por defecto dd/MM/yyyy (estable, sin ambigüedad dd vs mm).
   * Acepta `options` de Intl para casos especiales (mes corto, día/mes sin año,
   * fecha larga, etc.) — así TODO el formateo de fecha pasa por el servicio.
   */
  date(value: DateInput, options?: Intl.DateTimeFormatOptions): string {
    const d = this.toDate(value);
    if (!d) return '';
    return new Intl.DateTimeFormat(
      this._locale(),
      options ?? { day: '2-digit', month: '2-digit', year: 'numeric' },
    ).format(d);
  }

  /** Fecha + hora: dd/MM/yyyy HH:mm (o HH:mm:ss si withSeconds). */
  dateTime(value: DateInput, withSeconds = false): string {
    const d = this.toDate(value);
    if (!d) return '';
    return new Intl.DateTimeFormat(this._locale(), {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {}),
      hour12: false,
    }).format(d);
  }

  /** Hora HH:mm:ss (o HH:mm si withSeconds=false). */
  time(value: DateInput, withSeconds = true): string {
    const d = this.toDate(value);
    if (!d) return '';
    return new Intl.DateTimeFormat(this._locale(), {
      hour: '2-digit', minute: '2-digit',
      ...(withSeconds ? { second: '2-digit' } : {}),
      hour12: false,
    }).format(d);
  }

  /** Número con separadores de miles del locale. */
  number(value: number | string | null | undefined, options?: Intl.NumberFormatOptions): string {
    const n = typeof value === 'number' ? value : Number(value);
    if (value === null || value === undefined || value === '' || isNaN(n)) return '';
    return new Intl.NumberFormat(this._locale(), options).format(n);
  }

  /** Moneda canónica: "S/ 1,234.56". */
  currency(
    value: number | string | null | undefined,
    options?: { minimumFractionDigits?: number; maximumFractionDigits?: number },
  ): string {
    const n = typeof value === 'number' ? value : Number(value);
    if (value === null || value === undefined || value === '' || isNaN(n)) return '';
    const formatted = new Intl.NumberFormat(this._locale(), {
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    }).format(n);
    return `${this.currencySymbol} ${formatted}`;
  }

  /** Porcentaje: usa el número formateado + "%" (no multiplica). */
  percent(value: number | string | null | undefined, fractionDigits = 2): string {
    const n = typeof value === 'number' ? value : Number(value);
    if (value === null || value === undefined || value === '' || isNaN(n)) return '';
    return this.number(n, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }) + '%';
  }
}
