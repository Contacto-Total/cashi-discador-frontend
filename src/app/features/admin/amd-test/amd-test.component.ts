import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

// Llamaos obviamente al servicio
import { AmdEvent, AmdTestService } from './amd-test.service';

// Estadop de cada audio para tener un control de los audios que se suban
export type Estado_Audio = 'cola' | 'procesando' | 'humano' | 'buzon' | 'sindetectar'

// Filtros para la barra de resumenes (netamente Frontend)
export type Filters = 'todos' | 'humano' | 'buzon' | 'sindetectar'

// Para resultados acumulados de un audio -  Parar cada card que usamos
export interface Results_Audios {
  indice: number;
  nombre_archivo: string;
  ts: string;
  estado: Estado_Audio;
  chunkActual: number;
  human_score: number | null;
  buzon_score: number | null;
  chunks: number;
  primerVad: number | null;
  primerNumpy: number | null;
  primerGoertzel: number | null;
  primerF0: number | null;
  decisison_en_Chunk: number | null;
  f0_promedio: number | null;
  ts_inicio: string;
  ts_fin: string;
}

@Component({
  selector: 'app-amd-test',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './amd-test.component.html',
  styleUrls: ['./amd-test.component.css'],
})
export class AmdTestComponent {
  // Variables de carga
  isDragging = false;
  uploadError: string | null = null;
  pendingCount = 0;
  concurrency = 10;
  private files: File[] = [];

  // acumulador para el promedio de f0 (suma y cantidad, por audio)
  private f0Acc = new Map<number, { suma: number; n: number }>();

  // Estados por lotes
  started = false;
  finished = false;
  batchTotal = 0;
  processedCount= 0;
  processingCount= 0;
  startedAt = '';
  endedAt = '';
  durationLabel = '';

  // Variables para conteo
  counts = { humano: 0, buzon: 0, sindetectar: 0};

  // Filtros y Resultados, inicializamos
  filter: Filters = 'todos';
  results: Results_Audios[] = [];


  constructor(private service: AmdTestService) {}

  // Drag & drop
  onDragOver(e: DragEvent): void {
      e.preventDefault();
      this.isDragging = true;
    }

  onDragLeave(e: DragEvent): void {
      e.preventDefault();
      this.isDragging = false;
    }

  onDrop(e: DragEvent): void {
      e.preventDefault();
      this.isDragging = false;
      this.selectFiles(e.dataTransfer?.files);
  }

    //Input de archivos
  onFileInput(e: Event): void {
      const input = e.target as HTMLInputElement;
      this.selectFiles(input.files);
  }

  // Filtra .wav y guarda la lista en this.files
    private selectFiles(list: FileList | null | undefined): void {
      if (!list) return;
      const wavs = Array.from(list).filter(f => f.name.toLowerCase().endsWith('.wav'));
      if (wavs.length === 0) {
        this.uploadError = 'No se seleccionaron archivos .wav';
        return;
      }
      this.uploadError = null;
      this.files = wavs;
      this.pendingCount = wavs.length;
    }

    // Tamaño del lote
    setConcurrency(e: Event): void {
      const value = Number((e.target as HTMLInputElement).value);
      this.concurrency = Math.max(1, Math.min(value || 1, this.pendingCount));
    }

    // Iniciamos el lote
    async startBatch(): Promise<void> {
      if (this.files.length === 0) return;

      // preparamos e estado del lote
      this.started = true;
      this.finished = false;
      this.batchTotal = this.files.length;
      this.processedCount = 0;
      this.processingCount = 0;
      this.counts = { humano: 0, buzon: 0, sindetectar: 0 };
      this.startedAt = this.horaActual();
      const t0 = Date.now();

      // incializamos un Results_Audios por cada archivo, todos en 'cola'
      this.results = this.files.map((file, i): Results_Audios => ({
        indice: i + 1,
        nombre_archivo: file.name,
        ts: '',
        estado: 'cola',
        chunkActual: 0,
        human_score: null,
        buzon_score: null,
        chunks: 0,
        primerVad: null,
        primerNumpy: null,
        primerGoertzel: null,
        primerF0: null,
        decisison_en_Chunk: null,
        f0_promedio: null,
        ts_inicio: '',
        ts_fin: '',
      }));

      // procesar en lotes
      for (let i = 0; i < this.files.length; i += this.concurrency) {
        const ola = this.results.slice(i, i + this.concurrency);
        await Promise.all(ola.map(audio => this.processOne(audio)));
      }

      // lote terminado
      this.finished = true;
      this.endedAt = this.horaActual();
      this.durationLabel = this.formatDuracion(Date.now() - t0);
    }

    // hora actual como texto "HH:MM:SS"
    private horaActual(): string {
      return new Date().toLocaleTimeString('es-PE', { hour12: false });
    }

    // para milisegundos
    private formatDuracion(ms: number): string {
      const totalSec = Math.round(ms / 1000);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60; return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
    }

    // Procesar audio: subimops -> WS(pasamos por weebsocket -> escuchamos  hasta finalizar analisiss
    private processOne(audio: Results_Audios): Promise<void> {
      const file = this.files[audio.indice - 1];

      audio.estado = 'procesando';
      this.processingCount++;

      return new Promise<void>((resolve) => { let terminado = false;

        const terminar = (close?: () => void) => {
          if (terminado) return;          // evitamos contar dos veces
          terminado = true;
          if (close) close();
          if (audio.estado === 'humano') this.counts.humano++;
          else if (audio.estado === 'buzon') this.counts.buzon++;
          else this.counts.sindetectar++;
          this.processingCount--;
          this.processedCount++;
          resolve();
        };

        // pasamos el WAV al disparador
        this.service.upload(file).subscribe({
          next: (res) => {
            // abrimos websocket de progreso con el job_id devuelto
            const { event$, close } = this.service.openProgress(res.job_id);

            event$.subscribe({
              next: (evt) => {
                this.aplicarEvento(audio, evt);               // Bloque 6
                if (evt.type === 'end' || evt.type === 'ws_closed') {
                  terminar(close);
                }
              },
              error: () => terminar(close),
            });
          },
          error: () => {
            audio.estado = 'sindetectar';// si lña subida falla lo marcamos con que no fue detectado
            terminar();
          },
        });
      });
    }


    // Traducimos eventos que nos llegan del detector
    private aplicarEvento(audio: Results_Audios, evt: AmdEvent): void {

      // Jalamos el timestamp del evento para mostrarlo
      if (!audio.ts){
        audio.ts = evt.ts ?? '';
      }
      
      // Jalamos el timestamp de fin del audio para mostrarlo
      if (evt.type === 'end' || evt.type === 'decision') {
        audio.ts_fin = evt.ts ?? audio.ts_fin;
      }

      switch (evt.type) {

        case 'chunk':
          // el disparador numera cada chunk que envía
          audio.chunkActual = evt['n'] ?? audio.chunkActual;
          audio.chunks = audio.chunkActual;
          break;

        case 'analysis': {
          // evento del detector
          audio.chunkActual = evt['chunk'] ?? audio.chunkActual;
          audio.chunks = audio.chunkActual;
          audio.human_score = evt['scores']?.human ?? audio.human_score;
          audio.buzon_score = evt['scores']?.buzon ?? audio.buzon_score;

          // capturamos donde se ejecuto el primer var o nos devolvio respuesta mejor dicho
          const vad = evt['models']?.vad?.value;
          if (audio.primerVad === null && typeof vad === 'number' && vad > 0) {
            audio.primerVad = evt['chunk'];
          }
          
          // capturamos donde se ejecuto el primer var o nos devolvio respuesta mejor dicho (variable del python: rms)
          const numpy = evt['models']?.rms?.value;
          if (audio.primerNumpy === null && typeof numpy === 'number' && numpy > 0) {
            audio.primerNumpy = evt['chunk'];
          }

          // capturamos donde se ejecuto el primer var o nos devolvio respuesta mejor dicho (variable del python: goertzel)
          const goertzel = evt['models']?.goertzel?.value;
          if (audio.primerGoertzel === null && typeof goertzel === 'number' && goertzel > 0) {
            audio.primerGoertzel = evt['chunk'];
          }

          // capturamos donde se ejecuto el primer var o nos devolvio respuesta mejor dicho (variable del python: goertzel)
          const fo_ = evt['models']?.f0?.value;
          if (audio.primerF0 === null && typeof fo_  === 'number' && fo_ > 0) {
            audio.primerF0 = evt['chunk'];
          }

          // Promedio del acumulado de todas las respuesta del f0/pitch
          const f0 = evt['models']?.f0?.value;
          if (typeof f0 === 'number' && f0 > 0) {
            const acc = this.f0Acc.get(audio.indice) ?? { suma: 0, n: 0 };
            acc.suma += f0;
            acc.n++;
            this.f0Acc.set(audio.indice, acc);
            audio.f0_promedio = acc.suma / acc.n;
          }
          break;
        }

        case 'decision': {
          // decisión final del detector (dsp o whisper)
          const d = evt['decision'];
          if (d) {
            const r = String(d.result ?? '').toLowerCase();
            audio.estado = r === 'humano'      ? 'humano'
                         : r.startsWith('buz') ? 'buzon'
                         : 'sindetectar';
            audio.human_score = d.scores?.human ?? audio.human_score;
            audio.buzon_score = d.scores?.buzon ?? audio.buzon_score;
            audio.decisison_en_Chunk = d.decided_at_chunk ?? audio.decisison_en_Chunk;
          }
          break;
        }

        case 'end':
        case 'timeout':
        case 'ws_closed':
          // si terminó sin decisión clara -> sin detectar
          if (audio.estado === 'procesando') {
            audio.estado = 'sindetectar';
          }
          break;
      }
    }


    // % de progreso del lote (barra)
    get progressPct(): number {
      if (this.batchTotal === 0) return 0;
      return Math.round((this.processedCount / this.batchTotal) * 100);
    }

    // audios visibles según el filtro activo
    get filteredAudios(): Results_Audios[] {
      if (this.filter === 'todos') return this.results;
      return this.results.filter(a => a.estado === this.filter);
    }

    // Acciones de la pantlla

    setFilter(f: Filters): void {
      this.filter = f;
    }

    // resetear todo para un lote nuevo
    newBatch(): void {
      this.started = false;
      this.finished = false;
      this.results = [];
      this.files = [];
      this.pendingCount = 0;
      this.batchTotal = 0;
      this.processedCount = 0;
      this.processingCount = 0;
      this.counts = { humano: 0, buzon: 0, sindetectar: 0 };
      this.filter = 'todos';
      this.uploadError = null;
      this.f0Acc.clear();
    }

    // exportar los resultados a un archivo CSV
    exportCsv(): void {
      const header = 'indice,archivo,resultado,chunks,human_score,buzon_score,primer_vad,decision_en_chunk,f0_promedio,hora';
      const filas = this.results.map(a => [
        a.indice,
        `"${a.nombre_archivo}"`,
        a.estado,
        a.chunks,
        a.human_score ?? '',
        a.buzon_score ?? '',
        a.primerVad ?? '',
        a.decisison_en_Chunk ?? '',
        a.f0_promedio ?? '',
        a.ts,
      ].join(','));
      const csv = [header, ...filas].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `amd-batch-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }

    // Helpers de display (icono y texto por estado)

    iconFor(estado: Estado_Audio): string {
      const map: Record<Estado_Audio, string> = {
        cola: 'clock',
        procesando: 'loader',
        humano: 'user-check',
        buzon: 'voicemail',
        sindetectar: 'circle-off',
      };
      return map[estado];
    }

    labelFor(estado: Estado_Audio): string {
      const map: Record<Estado_Audio, string> = {
        cola: 'EN COLA',
        procesando: 'PROCESANDO',
        humano: 'HUMANO',
        buzon: 'BUZÓN',
        sindetectar: 'SIN DETECTAR',
      };
      return map[estado];
    }

    // formatea un número de chunk: 5 -> "c5", null -> "none"
    chunkLabel(n: number | null): string {
      return n !== null ? 'c' + n : 'none';
    }
}
