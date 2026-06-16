import { Injectable, signal } from '@angular/core';

export type DateInput = Date | string | number | null | undefined;

/**
 * Servicio ÚNICO de formateo de fechas, horas, números y moneda.
 *
 * Fase 1: el locale está FIJO en 'es-PE' (comportamiento idéntico al anterior),
 * pero todo el formateo de la app pasa por aquí en vez de tener 'es-PE'
 * hardcodeado en ~75 sitios. Esto elimina la inconsistencia previa y deja el
 * cambio de locale en UN solo punto.
 *
 * Fase 2 (futuro): `setLocale()` podrá enlazarse al idioma del navegador o a una
 * preferencia de usuario, con allow-list y fallback a es-PE. La política por tipo
 * (p.ej. mantener la fecha en dd/MM aunque cambie el locale) se decide aquí.
 *
 * Se basa en `Intl.*` (nativo): no requiere registerLocaleData ni infla el bundle,
 * y NO toca el parsing de entrada (input type=date ISO + date-formats.ts).
 */
@Injectable({ providedIn: 'root' })
export class FormatService {
  /** Fuente única de verdad del locale. */
  private readonly _locale = signal<string>('es-PE');
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
