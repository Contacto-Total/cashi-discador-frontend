import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'spanishDate',
  standalone: true
})
export class SpanishDatePipe implements PipeTransform {
  transform(value: string | Date, dateFormat: string = 'dd/MM/yyyy HH:mm'): string {
    if (!value) return '';
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, dateFormat, { locale: es });
  }
}