import { Component, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { ArchivoDropzoneWidget } from './archivo-dropzone.widget';

/** Columna por la que se separa el archivo de cartera. */
const COLUMNA = 'RANGO_MORA_ASIG';
/** Más valores distintos que esto indica que no es el archivo de cartera: no se generan archivos. */
const MAX_VALORES = 5;
/** Filas donde se busca la cabecera, por si el archivo trae un título encima. */
const FILAS_BUSQUEDA_CABECERA = 10;
const TAMANO_MAXIMO_MB = 50;
const SIN_VALOR = '(vacío)';

interface ArchivoSeparado {
  valor: string;
  tramo: string | null;
  nombre: string;
  filas: number;
  blob: Blob;
}

interface Progreso {
  texto: string;
  porcentaje: number;
}

/**
 * Separa un Excel de cartera en un archivo por cada valor de RANGO_MORA_ASIG, para cuando TR3 y TR5
 * llegan juntos. Todo ocurre en el navegador: el archivo no se sube al servidor.
 * Las celdas se copian tal cual (tipo, valor y formato), así no se pierden fechas ni ceros a la izquierda.
 */
@Component({
  selector: 'app-separador-excel-tramo',
  standalone: true,
  imports: [ArchivoDropzoneWidget],
  template: `
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-800 dark:text-white">Separar Excel por tramo</h2>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Cuando TR3 y TR5 llegan en un mismo archivo, se separa por la columna
            <span class="font-mono text-xs font-semibold">{{ columna }}</span> en un Excel por cada valor
            (máximo {{ maxValores }}). El archivo no se sube al servidor.
          </p>
        </div>
        @if (archivo() || resultados().length || error()) {
          <button type="button" (click)="limpiar()" [disabled]="procesando()"
                  class="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Limpiar
          </button>
        }
      </div>

      <app-archivo-dropzone
        inputId="separador-tramo-archivo"
        [extensiones]="extensiones"
        descripcion="Excel de cartera (.xlsx, .xls o .csv)"
        [file]="archivo()"
        [disabled]="procesando()"
        (fileSelected)="separar($event)"
        (rejected)="error.set($event)"
      ></app-archivo-dropzone>

      @if (progreso(); as p) {
        <div class="mt-4" role="status" aria-live="polite">
          <div class="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span>{{ p.texto }}</span>
            <span class="tabular-nums">{{ p.porcentaje }}%</span>
          </div>
          <div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
               role="progressbar" aria-label="Progreso de la separación"
               [attr.aria-valuenow]="p.porcentaje" aria-valuemin="0" aria-valuemax="100">
            <div class="h-full rounded-full bg-blue-600 transition-[width] duration-300 dark:bg-blue-500"
                 [style.width.%]="p.porcentaje"></div>
          </div>
        </div>
      }

      @if (error()) {
        <div role="alert" class="mt-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
          <svg class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ error() }}</span>
        </div>
      }

      @if (resultados().length) {
        <div class="mt-5">
          <p class="mb-2 text-sm text-slate-600 dark:text-slate-400">
            <span class="font-semibold text-slate-800 dark:text-white">{{ resultados().length }} archivos listos</span>
            · {{ totalFilas() }} filas de {{ hoja() }}. Haz clic en cada uno para descargarlo.
          </p>
          <ul class="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
            @for (r of resultados(); track r.nombre) {
              <li class="flex flex-wrap items-center justify-between gap-3 bg-white px-4 py-3 dark:bg-slate-800">
                <div class="min-w-0">
                  <p class="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                    @if (r.tramo) {
                      <span class="rounded bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">{{ r.tramo }}</span>
                    }
                    <span class="truncate">{{ r.nombre }}</span>
                  </p>
                  <p class="text-xs text-slate-600 dark:text-slate-400">
                    {{ columna }} = <span class="font-mono">{{ r.valor }}</span> · {{ r.filas }} filas · {{ tamano(r.blob.size) }}
                  </p>
                </div>
                <button type="button" (click)="descargar(r)"
                        class="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800"
                        [attr.aria-label]="'Descargar ' + r.nombre">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Descargar
                </button>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `
})
export class SeparadorExcelTramoWidget {
  readonly columna = COLUMNA;
  readonly maxValores = MAX_VALORES;
  readonly extensiones = ['.xlsx', '.xls', '.csv'];

  archivo = signal<File | null>(null);
  procesando = signal(false);
  progreso = signal<Progreso | null>(null);
  error = signal<string | null>(null);
  resultados = signal<ArchivoSeparado[]>([]);
  hoja = signal('');

  limpiar(): void {
    this.archivo.set(null);
    this.progreso.set(null);
    this.error.set(null);
    this.resultados.set([]);
    this.hoja.set('');
  }

  totalFilas(): number {
    return this.resultados().reduce((total, r) => total + r.filas, 0);
  }

  async separar(file: File): Promise<void> {
    this.limpiar();
    this.archivo.set(file);

    if (file.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      this.error.set(`El archivo pesa más de ${TAMANO_MAXIMO_MB} MB. Revisa que sea el archivo de cartera.`);
      return;
    }

    this.procesando.set(true);
    try {
      const datos = await this.leer(file);

      await this.avanzar('Abriendo el Excel…', 35);
      // El banco manda un .xls que en realidad es CSV en Latin-1: se decodifica aquí (SheetJS lo leería como
      // UTF-8 y rompería las Ñ) y se lee sin convertir valores, para no perder ceros a la izquierda.
      const esTexto = !this.esZip(datos) && !this.esExcelAntiguo(datos);
      const libro = esTexto
        ? XLSX.read(this.decodificarTexto(datos), { type: 'string', raw: true, dense: false })
        : XLSX.read(datos, { type: 'array', cellNF: true, dense: false });

      await this.avanzar(`Buscando la columna ${COLUMNA}…`, 50);
      const ubicacion = this.ubicarColumna(libro);
      if (!ubicacion) {
        throw new Error(`No se encontró la columna ${COLUMNA} en las primeras ${FILAS_BUSQUEDA_CABECERA} filas. Ese no es el archivo de cartera.`);
      }
      const { nombreHoja, hoja, filaCabecera, columna } = ubicacion;
      const rango = XLSX.utils.decode_range(hoja['!ref'] as string);

      const grupos = new Map<string, number[]>();
      for (let r = filaCabecera + 1; r <= rango.e.r; r++) {
        const celda = hoja[XLSX.utils.encode_cell({ r, c: columna })];
        let valor = celda ? String(celda.w ?? celda.v ?? '').trim() : '';
        if (!valor) {
          if (this.filaVacia(hoja, r, rango)) continue;
          valor = SIN_VALOR;
        }
        const filas = grupos.get(valor);
        if (filas) {
          filas.push(r);
        } else {
          grupos.set(valor, [r]);
          if (grupos.size > MAX_VALORES) {
            throw new Error(
              `La columna ${COLUMNA} tiene más de ${MAX_VALORES} valores distintos `
              + `(${[...grupos.keys()].slice(0, 6).join(', ')}…). Ese no es el archivo de cartera: no se generó ningún archivo.`);
          }
        }
      }
      if (grupos.size === 0) {
        throw new Error('El archivo no tiene filas debajo de la cabecera.');
      }

      const base = file.name.replace(/\.[^.]+$/, '');
      const valores = [...grupos.keys()].sort();
      const resultados: ArchivoSeparado[] = [];
      for (let i = 0; i < valores.length; i++) {
        const valor = valores[i];
        await this.avanzar(`Generando archivo ${i + 1} de ${valores.length}…`, 55 + Math.round((i / valores.length) * 45));
        const filas = grupos.get(valor) as number[];
        const tramo = this.tramo(valor);
        resultados.push({
          valor,
          tramo,
          nombre: `${base}_${tramo ?? this.slug(valor)}.xlsx`,
          filas: filas.length,
          blob: this.armarArchivo(hoja, nombreHoja, filaCabecera, filas, rango)
        });
      }

      this.hoja.set(nombreHoja);
      this.resultados.set(this.nombresUnicos(resultados));
      this.progreso.set({ texto: 'Listo', porcentaje: 100 });
    } catch (e) {
      this.progreso.set(null);
      this.error.set(e instanceof Error && e.message ? e.message : 'No se pudo leer el archivo. Revisa que sea un Excel válido.');
    } finally {
      this.procesando.set(false);
    }
  }

  descargar(r: ArchivoSeparado): void {
    const url = URL.createObjectURL(r.blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = r.nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  tamano(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private leer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onprogress = e => {
        if (e.lengthComputable) {
          this.progreso.set({ texto: 'Leyendo el archivo…', porcentaje: Math.round((e.loaded / e.total) * 30) });
        }
      };
      lector.onload = () => resolve(lector.result as ArrayBuffer);
      lector.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      this.progreso.set({ texto: 'Leyendo el archivo…', porcentaje: 0 });
      lector.readAsArrayBuffer(file);
    });
  }

  /** Actualiza la barra y deja que la pantalla se pinte antes del siguiente paso pesado. */
  private avanzar(texto: string, porcentaje: number): Promise<void> {
    this.progreso.set({ texto, porcentaje });
    return new Promise(resolve => setTimeout(resolve, 30));
  }

  private ubicarColumna(libro: XLSX.WorkBook):
    { nombreHoja: string; hoja: XLSX.WorkSheet; filaCabecera: number; columna: number } | null {
    for (const nombreHoja of libro.SheetNames) {
      const hoja = libro.Sheets[nombreHoja];
      if (!hoja?.['!ref']) continue;
      const rango = XLSX.utils.decode_range(hoja['!ref']);
      const ultimaFila = Math.min(rango.s.r + FILAS_BUSQUEDA_CABECERA - 1, rango.e.r);
      for (let r = rango.s.r; r <= ultimaFila; r++) {
        for (let c = rango.s.c; c <= rango.e.c; c++) {
          const celda = hoja[XLSX.utils.encode_cell({ r, c })];
          if (celda && String(celda.v ?? '').trim().toUpperCase() === COLUMNA) {
            return { nombreHoja, hoja, filaCabecera: r, columna: c };
          }
        }
      }
    }
    return null;
  }

  /** Copia la cabecera (y lo que haya encima) y las filas del grupo, celda por celda. */
  private armarArchivo(hoja: XLSX.WorkSheet, nombreHoja: string, filaCabecera: number,
                       filas: number[], rango: XLSX.Range): Blob {
    const nueva: XLSX.WorkSheet = {};
    const copiarFila = (origen: number, destino: number) => {
      for (let c = rango.s.c; c <= rango.e.c; c++) {
        const celda = hoja[XLSX.utils.encode_cell({ r: origen, c })];
        if (celda) {
          nueva[XLSX.utils.encode_cell({ r: destino, c })] = { ...celda };
        }
      }
    };

    let destino = rango.s.r;
    for (let r = rango.s.r; r <= filaCabecera; r++) {
      copiarFila(r, destino++);
    }
    for (const r of filas) {
      copiarFila(r, destino++);
    }
    nueva['!ref'] = XLSX.utils.encode_range({ s: rango.s, e: { r: destino - 1, c: rango.e.c } });
    if (hoja['!cols']) {
      nueva['!cols'] = hoja['!cols'];
    }

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, nueva, nombreHoja.slice(0, 31));
    const contenido = XLSX.write(libro, { bookType: 'xlsx', type: 'array', compression: true });
    return new Blob([contenido], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private filaVacia(hoja: XLSX.WorkSheet, r: number, rango: XLSX.Range): boolean {
    for (let c = rango.s.c; c <= rango.e.c; c++) {
      const celda = hoja[XLSX.utils.encode_cell({ r, c })];
      if (celda && String(celda.v ?? '').trim() !== '') return false;
    }
    return true;
  }

  /** TR3 = mora asignada 61-90; TR5 = 121 a más. Otros valores se nombran por su texto. */
  private tramo(valor: string): string | null {
    if (/61\s*-\s*90/.test(valor)) return 'TR3';
    if (/121/.test(valor)) return 'TR5';
    return null;
  }

  private slug(valor: string): string {
    const limpio = valor.normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    return limpio || 'SIN_VALOR';
  }

  /** Si dos valores dan el mismo nombre (por ejemplo dos que parecen TR5), se numeran. */
  private nombresUnicos(resultados: ArchivoSeparado[]): ArchivoSeparado[] {
    const usados = new Map<string, number>();
    return resultados.map(r => {
      const veces = (usados.get(r.nombre) ?? 0) + 1;
      usados.set(r.nombre, veces);
      return veces === 1 ? r : { ...r, nombre: r.nombre.replace(/\.xlsx$/, `_${veces}.xlsx`) };
    });
  }

  /** UTF-8 si el texto es válido en UTF-8; si no, Windows-1252 (Latin-1), que es como llega del banco. */
  private decodificarTexto(datos: ArrayBuffer): string {
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(datos).replace(/^﻿/, '');
    } catch {
      return new TextDecoder('windows-1252').decode(datos);
    }
  }

  private esZip(datos: ArrayBuffer): boolean {
    const b = new Uint8Array(datos, 0, Math.min(4, datos.byteLength));
    return b[0] === 0x50 && b[1] === 0x4b;
  }

  private esExcelAntiguo(datos: ArrayBuffer): boolean {
    const b = new Uint8Array(datos, 0, Math.min(4, datos.byteLength));
    return b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;
  }
}
