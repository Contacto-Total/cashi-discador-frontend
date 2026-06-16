import { inject, Pipe, PipeTransform } from '@angular/core';
import { DateInput, FormatService } from '../services/format.service';

/**
 * Convierte un digitsInfo estilo Angular ('minInt.minFrac-maxFrac', p.ej. '1.2-2')
 * a opciones de Intl.NumberFormat. Se usa string (no objeto) en los pipes porque
 * los object-literals `{}` en templates rompen el parser de bloques @if/@for (NG5002).
 */
function digitsToIntl(digitsInfo?: string): Intl.NumberFormatOptions | undefined {
  if (!digitsInfo) return undefined;
  const m = /^(\d+)\.(\d+)-(\d+)$/.exec(digitsInfo);
  if (!m) return undefined;
  return {
    minimumIntegerDigits: +m[1],
    minimumFractionDigits: +m[2],
    maximumFractionDigits: +m[3],
  };
}

/**
 * Pipes standalone que delegan en FormatService (locale único).
 *
 * Fase 1: locale fijo es-PE → pipes PUROS (performantes; el resultado solo
 * depende del valor de entrada). Si en la Fase 2 el locale cambia en runtime,
 * se revisará la reactividad (impuro o reload); por ahora puro es correcto.
 *
 * Reemplazan los usos de `| date`, `| number`, `| currency`, `| percent`.
 */

/** Estilos compactos de fecha (orden/separador los pone el locale). */
type DateStyle = 'short' | 'dayMonth';
const DATE_STYLE_OPTS: Record<DateStyle, Intl.DateTimeFormatOptions> = {
  short: { day: '2-digit', month: '2-digit', year: '2-digit' },   // dd/MM/yy
  dayMonth: { day: '2-digit', month: '2-digit' },                  // dd/MM
};

@Pipe({ name: 'appDate', standalone: true })
export class AppDatePipe implements PipeTransform {
  private fmt = inject(FormatService);
  /** style: 'short' (año 2 díg.) | 'dayMonth' (sin año). Sin style = fecha completa. */
  transform(value: DateInput, style?: DateStyle): string {
    return this.fmt.date(value, style ? DATE_STYLE_OPTS[style] : undefined);
  }
}

@Pipe({ name: 'appDateTime', standalone: true })
export class AppDateTimePipe implements PipeTransform {
  private fmt = inject(FormatService);
  /** style: 'seconds' (HH:mm:ss) | 'short' (año 2 díg.) | 'dayMonth' (sin año). */
  transform(value: DateInput, style?: 'seconds' | DateStyle): string {
    if (style === 'seconds') return this.fmt.dateTime(value, true);
    if (style === 'short' || style === 'dayMonth') {
      return this.fmt.dateTime(value, false, DATE_STYLE_OPTS[style]);
    }
    return this.fmt.dateTime(value, false);
  }
}

@Pipe({ name: 'appTime', standalone: true })
export class AppTimePipe implements PipeTransform {
  private fmt = inject(FormatService);
  transform(value: DateInput, withSeconds = true): string {
    return this.fmt.time(value, withSeconds);
  }
}

@Pipe({ name: 'appNumber', standalone: true })
export class AppNumberPipe implements PipeTransform {
  private fmt = inject(FormatService);
  /** digitsInfo estilo Angular: '1.2-2'. Sin args = separadores de miles del locale. */
  transform(value: number | string | null | undefined, digitsInfo?: string): string {
    return this.fmt.number(value, digitsToIntl(digitsInfo));
  }
}

@Pipe({ name: 'appCurrency', standalone: true })
export class AppCurrencyPipe implements PipeTransform {
  private fmt = inject(FormatService);
  /** digitsInfo estilo Angular: '1.2-2' (por defecto 2 decimales). */
  transform(value: number | string | null | undefined, digitsInfo?: string): string {
    const opts = digitsToIntl(digitsInfo);
    return this.fmt.currency(value, opts && {
      minimumFractionDigits: opts.minimumFractionDigits,
      maximumFractionDigits: opts.maximumFractionDigits,
    });
  }
}

@Pipe({ name: 'appPercent', standalone: true })
export class AppPercentPipe implements PipeTransform {
  private fmt = inject(FormatService);
  transform(value: number | string | null | undefined, fractionDigits = 2): string {
    return this.fmt.percent(value, fractionDigits);
  }
}

/** Conveniencia para importar todos los pipes de una. */
export const FORMAT_PIPES = [
  AppDatePipe, AppDateTimePipe, AppTimePipe, AppNumberPipe, AppCurrencyPipe, AppPercentPipe,
] as const;
