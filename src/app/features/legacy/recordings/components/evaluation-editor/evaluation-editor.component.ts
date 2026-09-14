import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, X, FileText, Save, Check, RotateCcw,
  Play, Pause, RotateCw, Download, AudioLines, TriangleAlert
} from 'lucide-angular';

import { ToastService } from '../../../../../shared/services/toast.service';
import { QualityMonitoringService } from '../../services/quality-monitoring.service';
import { HistoricalRecordingsService } from '../../services/historical-recordings.service';
import { RecordingDownloadService } from '../../services/recording-download.service';
import { AudioPlaybackService } from '../../services/audio-playback.service';
import {
  AudioPart, EvaluationCriterion, EvaluationDetail, MonitoringMode, NOMBRE_RUBRICA, etiquetaTipificacion
} from '../../models/quality-monitoring.model';
import { Transcription } from '../../models/transcription.model';

/** Los criterios de una sección, para dibujarlos agrupados como en el Excel. */
interface Bloque {
  seccion: string;
  etiqueta: string;
  criterios: EvaluationCriterion[];
  puntos: number;
  total: number;
}

/**
 * La ficha de un audio evaluado, con corrección manual de criterios.
 *
 * ## Por qué es un modal y no una pestaña aparte
 *
 * El supervisor llega acá desde una celda o desde la ficha de un asesor, y lo que
 * está haciendo es recorrer varios audios seguidos buscando dónde el modelo se
 * equivocó. Sacarlo de la pantalla para cada uno le hace perder la lista en la que
 * estaba y lo obliga a volver a ubicarse en cada vuelta. Además lo que se edita son
 * catorce o dieciséis interruptores: no da para una pantalla propia.
 *
 * Una vista aparte tendría sentido si esto fuera un flujo largo —una calibración
 * con varios evaluadores, un historial de discusión por criterio—. Si eso llega, el
 * componente ya está separado y montarlo en una ruta es cambiar dónde se declara.
 *
 * ## Lo que hace distinto a un formulario común
 *
 * **Solo viaja lo que cambió.** El PUT manda únicamente los criterios que el
 * supervisor tocó. Mandar los dieciséis convertiría cada guardado en dieciséis
 * filas de bitácora que dicen "cambió de 1 a 1".
 *
 * **Escribe en producción.** Es la única pantalla del módulo que modifica datos,
 * por eso el botón de guardar está deshabilitado hasta que haya un cambio real y
 * por eso se pide un comentario: la corrección queda registrada con quién y por qué.
 *
 * ## El audio se escucha aquí, y esto cambió
 *
 * Hasta agosto de 2026 este comentario decía que la ficha no reproduce el audio
 * «porque para cuando llega aquí ya escuchó la llamada». **Era falso en la
 * práctica:** el supervisor que duda de una nota tenía que descargar el WAV,
 * buscarlo en la carpeta de descargas y abrirlo en otro programa, y al volver había
 * perdido la fila en la que estaba. Ahora suena dentro de la ficha.
 *
 * El reproductor vive en el bloque de cumplimiento y ese bloque queda **fijo al
 * hacer scroll**: la lista tiene catorce o dieciséis criterios, y sin eso quien
 * llega al criterio doce y quiere pausar tiene que subir a buscar el botón.
 *
 * Lo que sigue sin estar es la descarga del XLSX: esa vive en la pestaña de
 * Grabaciones, que es donde el supervisor prepara la revisión. Aquí solo aparece un
 * enlace de descarga cuando la conversión falla, como salida de emergencia.
 *
 * La transcripción quedó plegada y apagada por defecto. Responde la pregunta
 * concreta que aparece al dudar de un criterio —«¿dijo o no dijo la frase?»— sin
 * salir de la pantalla ni perder los cambios sin guardar.
 */
@Component({
  selector: 'app-evaluation-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './evaluation-editor.component.html',
  styleUrls: ['./evaluation-editor.component.scss']
})
export class EvaluationEditorComponent implements OnDestroy {
  readonly X = X;
  readonly FileText = FileText;
  readonly Save = Save;
  readonly Check = Check;
  readonly RotateCcw = RotateCcw;
  readonly Play = Play;
  readonly Pause = Pause;
  readonly RotateCw = RotateCw;
  readonly Download = Download;
  readonly AudioLines = AudioLines;
  readonly TriangleAlert = TriangleAlert;

  readonly ETIQUETA_SECCION: Record<string, string> = {
    PRESENTACION: 'Presentación',
    NEGOCIACION: 'Negociación',
    CIERRE: 'Cierre'
  };

  readonly COLOR_SECCION: Record<string, string> = {
    PRESENTACION: 'bg-emerald-500',
    NEGOCIACION: 'bg-amber-500',
    CIERRE: 'bg-sky-500'
  };

  /** El audio a mostrar. Cambiarlo recarga la ficha. */
  /**
   * Cuál de los dos monitoreos abrió esta ficha.
   *
   * Decide dos cosas: de dónde se pide el audio —por key en el discador, por nombre en
   * legacy— y si se ofrece la descarga cruda como salida de emergencia. Esa descarga
   * existe solo en legacy, donde el endpoint sabe buscar el archivo por nombre.
   */
  @Input() modo: MonitoringMode = 'legacy';

  @Input() set idx(valor: number | null) {
    this._idx = valor;
    if (valor !== null) {
      this.cargar(valor);
    }
  }
  private _idx: number | null = null;

  @Output() cerrado = new EventEmitter<void>();

  /** Se emite cuando se guardó algo, para que la matriz de atrás se recargue. */
  @Output() guardado = new EventEmitter<void>();

  ficha: EvaluationDetail | null = null;
  isLoading = false;
  isSaving = false;

  /**
   * «CD - Contacto con titular o encargado»: la sigla sola no dice por qué el audio se
   * puntuó contra esa rúbrica, y varias tipificaciones caen en la misma.
   */
  get etiquetaRubrica(): string {
    if (!this.ficha) {
      return '';
    }
    const tipificacion = etiquetaTipificacion(this.ficha.resultado);
    return tipificacion ? `${this.ficha.rubrica} - ${tipificacion}` : this.ficha.rubrica;
  }

  /** El tooltip del distintivo: qué significa la sigla. */
  get significadoRubrica(): string {
    const nombre = this.ficha ? NOMBRE_RUBRICA[this.ficha.rubrica] : '';
    return nombre ? `${this.ficha!.rubrica}: rúbrica de ${nombre.toLowerCase()}` : '';
  }

  /** campo -> valor elegido en pantalla. Arranca como copia de lo que trajo el backend. */
  valores: Record<string, number | null> = {};

  transcripcion: Transcription[] | null = null;
  isLoadingTranscripcion = false;
  mostrarTranscripcion = false;

  constructor(
    private monitoreo: QualityMonitoringService,
    private historicas: HistoricalRecordingsService,
    private descargas: RecordingDownloadService,
    private toast: ToastService,
    /**
     * Público porque la plantilla lee su estado directamente.
     *
     * Es un singleton con un único elemento de audio, así que el componente no lo
     * posee: lo toma prestado mientras la ficha está abierta y lo suelta al cerrar.
     */
    public player: AudioPlaybackService
  ) {}

  /**
   * Cerrar la ficha detiene el audio. Nada de mini-reproductor flotante: el audio es
   * el contexto de ESTA evaluación, y si sobreviviera al cierre terminaría sonando
   * sobre la ficha equivocada.
   */
  ngOnDestroy(): void {
    this.player.cerrar();
  }

  // ------------------------------------------------------------------ carga

  private cargar(idx: number): void {
    this.isLoading = true;
    this.ficha = null;
    this.transcripcion = null;
    this.mostrarTranscripcion = false;
    // Antes de pedir nada: si venía sonando el audio de la ficha anterior, se corta ya.
    // Esperar a que llegue la respuesta lo dejaría sonando sobre una ficha que ya no es.
    this.player.cerrar();

    this.monitoreo.getEvaluacion(idx).subscribe({
      next: (data) => {
        this.ficha = data;
        this.valores = {};
        for (const c of data.criterios) {
          this.valores[c.campo] = c.valor;
        }
        this.recalcularBloques();
        this.isLoading = false;

        // La conversión arranca al abrir la ficha, no al pulsar play: mientras el
        // supervisor lee el resumen y baja por los criterios, el audio ya se está
        // preparando en el servidor. Si cierra antes, la petición se cancela.
        this.player.abrir(
          data.audios ?? [],
          (parte) => this.monitoreo.urlDeAudio(data.idx, parte.orden));
      },
      error: (e) => {
        this.isLoading = false;
        this.toast.error(e?.message || 'No se pudo cargar la evaluación');
        this.cerrar();
      }
    });
  }

  cerrar(): void {
    this.player.cerrar();
    this.cerrado.emit();
  }

  // ------------------------------------------------------------------ edición

  marcar(campo: string, valor: number): void {
    if (!this.ficha?.editable || this.isSaving) {
      return;
    }
    this.valores[campo] = valor;
    this.recalcularBloques();
  }

  /** Devuelve un criterio a lo que dice el backend, sin tener que recargar la ficha. */
  deshacer(campo: string): void {
    const original = this.ficha?.criterios.find(c => c.campo === campo);
    if (original) {
      this.valores[campo] = original.valor;
      this.recalcularBloques();
    }
  }

  cambio(campo: string): boolean {
    const original = this.ficha?.criterios.find(c => c.campo === campo);
    return !!original && original.valor !== this.valores[campo];
  }

  /** Solo los criterios que de verdad cambiaron: es lo único que viaja en el PUT. */
  private get cambios(): Record<string, number> {
    const salida: Record<string, number> = {};
    for (const c of this.ficha?.criterios ?? []) {
      const valor = this.valores[c.campo];
      if (valor !== null && valor !== undefined && valor !== c.valor) {
        salida[c.campo] = valor;
      }
    }
    return salida;
  }

  get cantidadCambios(): number {
    return Object.keys(this.cambios).length;
  }

  get puedeGuardar(): boolean {
    return !!this.ficha?.editable && this.cantidadCambios > 0 && !this.isSaving;
  }

  guardar(): void {
    if (!this.puedeGuardar || this._idx === null) {
      return;
    }
    this.isSaving = true;

    this.monitoreo.ajustarEvaluacion(this._idx, { criterios: this.cambios }).subscribe({
      next: (data) => {
        this.ficha = data;
        this.valores = {};
        for (const c of data.criterios) {
          this.valores[c.campo] = c.valor;
        }
        this.recalcularBloques();
        this.isSaving = false;
        this.toast.success('Evaluación corregida');
        this.guardado.emit();
      },
      error: (e) => {
        this.isSaving = false;
        this.toast.error(e?.message || 'No se pudo guardar la corrección');
      }
    });
  }

  // ------------------------------------------------------------------ puntaje en vivo

  /**
   * El puntaje tal como quedaría con los cambios sin guardar.
   *
   * Se recalcula acá y no se espera al backend para que el supervisor vea el efecto
   * de bajar un criterio antes de confirmarlo. El denominador es el mismo que usa el
   * backend: la rúbrica completa, esté o no calificado cada criterio.
   */
  get puntosEditados(): number {
    let total = 0;
    for (const c of this.ficha?.criterios ?? []) {
      total += this.valores[c.campo] ?? 0;
    }
    return total;
  }

  get cumplimientoEditado(): number | null {
    const posibles = this.ficha?.posibles ?? 0;
    return posibles ? Math.round(this.puntosEditados * 1000 / posibles) / 10 : null;
  }

  /**
   * Los criterios agrupados por sección, en el orden del Excel.
   *
   * **Es un campo y no un getter, y eso NO es una optimización.** Como getter, el
   * template lo llamaba en cada ciclo de detección de cambios y devolvía objetos nuevos
   * cada vez; sin `trackBy`, el `*ngFor` destruía y reconstruía las dieciséis filas en
   * cada ciclo. Con el WebSocket de latencia disparando detección de cambios cada pocos
   * segundos, el botón que se estaba pulsando desaparecía entre el `mousedown` y el
   * `mouseup`, el navegador no llegaba a emitir el `click` y el criterio no cambiaba.
   * Ese era el bug de «hago click en la X y no pasa nada».
   *
   * Se recalcula donde de verdad cambia algo: al cargar, al marcar, al deshacer y al
   * guardar. El `trackBy` de la plantilla es la segunda red.
   */
  bloques: Bloque[] = [];

  private recalcularBloques(): void {
    const orden = ['PRESENTACION', 'NEGOCIACION', 'CIERRE'];
    const mapa = new Map<string, Bloque>();

    for (const c of this.ficha?.criterios ?? []) {
      let bloque = mapa.get(c.seccion);
      if (!bloque) {
        bloque = {
          seccion: c.seccion,
          etiqueta: this.ETIQUETA_SECCION[c.seccion] ?? c.seccion,
          criterios: [], puntos: 0, total: 0
        };
        mapa.set(c.seccion, bloque);
      }
      bloque.criterios.push(c);
      bloque.puntos += this.valores[c.campo] ?? 0;
      bloque.total++;
    }

    this.bloques = [...mapa.values()].sort(
      (a, b) => orden.indexOf(a.seccion) - orden.indexOf(b.seccion));
  }

  /** Identidades estables para los dos `*ngFor` de la hoja. */
  porSeccion = (_: number, b: Bloque) => b.seccion;
  porCampo = (_: number, c: EvaluationCriterion) => c.campo;

  // ------------------------------------------------------------------ evidencia

  verTranscripcion(): void {
    if (!this.ficha) {
      return;
    }
    this.mostrarTranscripcion = !this.mostrarTranscripcion;
    if (!this.mostrarTranscripcion || this.transcripcion) {
      return;
    }

    this.isLoadingTranscripcion = true;
    this.historicas.getTranscripcionByIdx(this.ficha.idx).subscribe({
      next: (data) => {
        this.transcripcion = data as Transcription[];
        this.isLoadingTranscripcion = false;
      },
      error: () => {
        this.isLoadingTranscripcion = false;
        this.toast.error('No se pudo cargar la transcripción');
      }
    });
  }

  // ------------------------------------------------------------------ audio

  /**
   * Cuánto de la parte actual va reproducido, en porcentaje.
   *
   * Se calcula sobre la duración que reportó el archivo ya cargado y no sobre la
   * columna DURACION de FOH: esa es la del WAV original y, tras la conversión, no
   * tiene por qué coincidir al decimal. Un riel que se llena antes o después de que
   * el audio termine se ve como un error aunque el audio esté bien.
   */
  get progreso(): number {
    return this.player.duracion
      ? Math.min(100, (this.player.posicion / this.player.duracion) * 100)
      : 0;
  }

  /** Salta al punto del riel donde se hizo click. */
  buscarEnRiel(evento: MouseEvent): void {
    const riel = evento.currentTarget as HTMLElement;
    const ancho = riel.getBoundingClientRect().width;
    if (!ancho) {
      return;
    }
    const proporcion = (evento.clientX - riel.getBoundingClientRect().left) / ancho;
    this.player.irA(proporcion * this.player.duracion);
  }

  reloj(segundos: number | null | undefined): string {
    return AudioPlaybackService.reloj(segundos);
  }

  /**
   * La duración de una parte, para el rótulo del selector.
   *
   * Sale de la columna DURACION, que llega en segundos con decimales ('179.96'). Es
   * la única forma de saber cuánto dura la parte 2 sin haberla convertido todavía, y
   * ese es justamente el dato que decide si vale la pena saltar a ella.
   */
  duracionDe(parte: AudioPart): string {
    const valor = Number(parte.duracion);
    return parte.duracion && !Number.isNaN(valor) ? AudioPlaybackService.reloj(valor) : '';
  }

  porParte = (_: number, parte: AudioPart) => parte.orden;

  /**
   * La salida de emergencia cuando la conversión falla.
   *
   * Baja el objeto tal como está en el bucket. Sigue funcionando aunque ffmpeg no
   * pueda con él, porque la descarga no lo convierte: lo que el navegador no puede
   * reproducir, un reproductor de escritorio a veces sí.
   */
  /**
   * Si esta ficha ofrece bajar el archivo crudo.
   *
   * Solo en legacy: ese endpoint resuelve el objeto por nombre, que es la única pista
   * que tienen las gestiones de FOH. Las del discador se identifican por su key, y
   * exponer un endpoint que baje una key cualquiera del bucket a pedido del navegador
   * es exactamente lo que se evitó en el de preescucha.
   */
  get puedeDescargar(): boolean {
    return this.modo === 'legacy';
  }

  descargarParteActual(): void {
    const parte = this.player.parteActual;
    if (!parte || !this.ficha || !this.puedeDescargar) {
      return;
    }

    const fecha = this.ficha.fecha.replace(/-/g, '');
    this.descargas.downloadGestionHistoricaAudioFileByName({
      anio: parte.anio ?? '',
      mes: parte.mes ?? '',
      dia: parte.dia ?? '',
      nombre: parte.nombre,
      fecha,
      resultado: this.ficha.resultado,
      telefono: this.ficha.telefono,
      documento: this.ficha.documento,
      cliente: this.ficha.cliente,
      asesor: this.ficha.asesor
    }).subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = parte.nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se encontró el audio.')
    });
  }

  // ------------------------------------------------------------------ formato

  pct(valor: number | null | undefined): string {
    return valor === null || valor === undefined ? '—' : `${valor}%`;
  }
}
