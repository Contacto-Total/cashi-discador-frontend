import { BotonDirective } from '../../../shared/ui/boton.directive';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import * as XLSX from 'xlsx';
import { MINI } from './ficha-clases';

/** Una fila del archivo, con las cabeceras sin tildes ni mayúsculas: «Ámbito» llega como «ambito». */
export type FilaArchivo = Record<string, string | number>;

/** Para comparar sin que importen mayúsculas, tildes ni espacios de más. */
export function sinTildes(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

const dos = (n: number): string => String(n).padStart(2, '0');

/**
 * «2026-11-02» y, si viene, la hora («2026-11-02T08:30»). Acepta lo que deja Excel al escribir una fecha
 * (el número de serie) y el texto «02/11/2026 08:30» o «2026-11-02 08:30».
 */
export function fechaDeCelda(valor: string | number, conHora = false): string | null {
  if (typeof valor === 'number') {
    if (!isFinite(valor) || valor <= 0) return null;
    // Días desde el 30/12/1899, la base de Excel; la parte decimal es la hora del día.
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(valor * 86400) * 1000);
    const fecha = `${d.getUTCFullYear()}-${dos(d.getUTCMonth() + 1)}-${dos(d.getUTCDate())}`;
    return conHora ? `${fecha}T${dos(d.getUTCHours())}:${dos(d.getUTCMinutes())}` : fecha;
  }
  const t = String(valor ?? '').trim();
  const m = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})(?:[ T]+(\d{1,2}):(\d{2}))?$/.exec(t);
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T]+(\d{1,2}):(\d{2}))?$/.exec(t);
  if (!m && !iso) return null;
  const [a, mes, dia] = m ? [+m[3], +m[2], +m[1]] : [+iso![1], +iso![2], +iso![3]];
  const h = m ? m[4] : iso![4], min = m ? m[5] : iso![5];
  const d = new Date(a, mes - 1, dia);
  if (d.getFullYear() !== a || d.getMonth() !== mes - 1 || d.getDate() !== dia) return null;
  const fecha = `${a}-${dos(mes)}-${dos(dia)}`;
  if (!conHora) return fecha;
  if (h === undefined || min === undefined || +h > 23 || +min > 59) return null;
  return `${fecha}T${dos(+h)}:${min}`;
}

/** La plantilla: la fila de cabeceras y ejemplos, como texto para que Excel no cambie el formato de las fechas. */
export function bajarPlantilla(nombre: string, hoja: string, filas: string[][]): void {
  const ws = XLSX.utils.aoa_to_sheet(filas);
  ws['!cols'] = filas[0].map((_, i) => ({ wch: Math.max(12, ...filas.map(f => (f[i] ?? '').length + 2)) }));
  Object.keys(ws).filter(k => !k.startsWith('!')).forEach(k => { ws[k].t = 's'; ws[k].z = '@'; });
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, ws, hoja);
  XLSX.writeFile(libro, nombre);
}

/**
 * Un CSV llega como texto: en UTF-8 o, si lo guardó Excel en Windows, en Windows-1252. Se lee sin que la
 * librería adivine tipos, porque tomaría «01/11/2026» como fecha de Estados Unidos (11 de enero).
 */
async function textoCsv(archivo: File): Promise<string> {
  const bytes = await archivo.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes).replace(/^﻿/, '');
  } catch {
    return new TextDecoder('windows-1252').decode(bytes);
  }
}

/** La primera hoja del archivo; las filas vacías no cuentan. */
export async function leerArchivo(archivo: File): Promise<FilaArchivo[]> {
  const libro = /\.csv$/i.test(archivo.name)
    ? XLSX.read(await textoCsv(archivo), { type: 'string', raw: true })
    : XLSX.read(await archivo.arrayBuffer(), { type: 'array' });
  const hoja = libro.Sheets[libro.SheetNames[0]];
  if (!hoja) return [];
  const crudas = XLSX.utils.sheet_to_json<Record<string, string | number>>(hoja, { defval: '', raw: true });
  return crudas
    .map(f => Object.fromEntries(Object.entries(f).map(([k, v]) => [sinTildes(k), typeof v === 'string' ? v.trim() : v])))
    .filter(f => Object.values(f).some(v => v !== ''));
}

/**
 * Zona para soltar o elegir un Excel o CSV, con la plantilla al lado. Lee la primera hoja y entrega las
 * filas; qué columnas valen y qué hacer con ellas lo decide quien la usa.
 */
@Component({
  selector: 'app-importar-archivo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BotonDirective, LucideAngularModule],
  host: { class: 'flex min-h-0 flex-1 flex-col' },
  template: `
    <label class="m-0! flex min-h-[11rem] flex-1 cursor-pointer flex-col items-center justify-center gap-[.625rem] rounded-xl border border-dashed px-5 py-6 text-center transition-colors duration-150"
           [class]="encima() ? 'border-ring bg-[color-mix(in_oklab,var(--ring)_6%,transparent)]' : 'border-(--campo-ln) hover:bg-muted'"
           (dragover)="$event.preventDefault(); encima.set(true)" (dragleave)="encima.set(false)" (drop)="soltar($event)">
      <span class="grid size-10 place-items-center rounded-full bg-muted text-muted-foreground"><lucide-angular name="file-spreadsheet" [size]="18" class="flex"></lucide-angular></span>
      <span class="text-[.875rem] font-semibold text-foreground">{{ leyendo() ? 'Leyendo el archivo…' : 'Arrastra el archivo aquí o elige uno' }}</span>
      <small class="max-w-[24rem] text-[.75rem] leading-[1.5] text-muted-foreground">Excel o CSV con las columnas {{ columnas() }}</small>
      @if (error()) { <small class="text-[.75rem] font-medium text-(--ro)">{{ error() }}</small> }
      <input type="file" class="hidden" accept=".xlsx,.xls,.csv" (change)="elegir($event)">
    </label>
    <div class="mt-[.625rem] flex flex-none items-center justify-between gap-2">
      <small class="text-[.75rem] text-muted-foreground">Las fechas van como 02/11/2026{{ conHora() ? ' 08:30' : '' }}</small>
      <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="plantilla.emit()"><lucide-angular name="download" [size]="14" class="flex"></lucide-angular>Descargar plantilla</button>
    </div>
  `
})
export class ImportarArchivoComponent {
  /** Las columnas, dichas como se leen: «Fecha, Tipo, Ámbito y Nombre». */
  readonly columnas = input.required<string>();
  readonly conHora = input(false);
  readonly leido = output<{ nombre: string; filas: FilaArchivo[] }>();
  readonly plantilla = output<void>();

  protected readonly MINI = MINI;
  readonly encima = signal(false);
  readonly leyendo = signal(false);
  readonly error = signal('');

  elegir(ev: Event): void {
    const entrada = ev.target as HTMLInputElement, archivo = entrada.files?.[0];
    entrada.value = '';
    if (archivo) this.leer(archivo);
  }

  soltar(ev: DragEvent): void {
    ev.preventDefault();
    this.encima.set(false);
    const archivo = ev.dataTransfer?.files?.[0];
    if (archivo) this.leer(archivo);
  }

  private async leer(archivo: File): Promise<void> {
    this.error.set('');
    if (!/\.(xlsx|xls|csv)$/i.test(archivo.name)) { this.error.set('Solo Excel o CSV'); return; }
    this.leyendo.set(true);
    try {
      const filas = await leerArchivo(archivo);
      if (!filas.length) this.error.set('El archivo no tiene filas');
      else this.leido.emit({ nombre: archivo.name, filas });
    } catch {
      this.error.set('No se pudo leer el archivo');
    } finally {
      this.leyendo.set(false);
    }
  }
}
