import { Component, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  LucideAngularModule, X, FileText, Save, Check, RotateCcw,
  Play, Pause, RotateCw, Download, AudioLines, TriangleAlert,
  FileSpreadsheet, LoaderCircle, Pencil
} from 'lucide-angular';

import { ToastService } from '../../../../../shared/services/toast.service';
import { QualityMonitoringService } from '../../services/quality-monitoring.service';
import { EvaluationDraft, EvaluationDraftService } from '../../services/evaluation-draft.service';
import { HistoricalRecordingsService } from '../../services/historical-recordings.service';
import { RecordingDownloadService } from '../../services/recording-download.service';
import { RecordingEvaluationReportService } from '../../services/recording-evaluation-report.service';
import { AudioPlaybackService } from '../../services/audio-playback.service';
import {
  AdjustField, AudioPart, EvaluationCriterion, EvaluationDetail, MonitoringMode,
  NOMBRE_RUBRICA, etiquetaTipificacion
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
  imports: [CommonModule, FormsModule, LucideAngularModule],
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
  readonly FileSpreadsheet = FileSpreadsheet;
  readonly LoaderCircle = LoaderCircle;
  readonly Pencil = Pencil;

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
    // Cambiar de audio con la ficha abierta es otra forma de cerrarla.
    this.guardarBorrador(false);
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

  /**
   * campo -> motivo escrito para ESTE cambio, mientras no se guarde.
   *
   * No se mezcla con `EvaluationCriterion.comentario`, que es el motivo de la corrección
   * ANTERIOR y ya está guardado: una cosa es lo que alguien explicó en su momento y otra
   * lo que se está por explicar ahora.
   */
  motivos: Record<string, string> = {};

  /** Un motivo de tres letras no es un motivo. Frena el "ok" y el "asd", no al que escribe. */
  readonly MINIMO_MOTIVO = 15;

  /** El historial se despliega bajo pedido: lo normal es que interese la última. */
  mostrarHistorial = false;

  transcripcion: Transcription[] | null = null;
  isLoadingTranscripcion = false;
  mostrarTranscripcion = false;

  descargandoExcel = false;
  descargandoAudio = false;

  /** El borrador que se restauró al abrir, para el aviso de arriba. Null si se empezó de cero. */
  borradorRetomado: EvaluationDraft | null = null;

  constructor(
    private monitoreo: QualityMonitoringService,
    private borradores: EvaluationDraftService,
    private historicas: HistoricalRecordingsService,
    private descargas: RecordingDownloadService,
    private reportes: RecordingEvaluationReportService,
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
    // Salir de la pantalla sin pasar por cerrar() —cambio de ruta— tampoco pierde nada.
    this.guardarBorrador(false);
    this.player.cerrar();
  }

  /** Cerrar la pestaña o recargar con la ficha abierta deja el borrador igual. */
  @HostListener('window:beforeunload')
  alSalirDelNavegador(): void {
    this.guardarBorrador(false);
  }

  // ------------------------------------------------------------------ carga

  private cargar(idx: number): void {
    this.isLoading = true;
    this.ficha = null;
    this.valores = {};
    this.motivos = {};
    this.borradorRetomado = null;
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
        this.restaurarBorrador(data);
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

  /**
   * Cerrar ya no tira lo que se hizo: si hay cambios, quedan como borrador y la grilla
   * lo marca. Se retoma al volver a abrir el audio.
   */
  cerrar(): void {
    this.guardarBorrador(true);
    this.player.cerrar();
    this.cerrado.emit();
  }

  // ------------------------------------------------------------------ borrador

  /**
   * Deja los cambios sin guardar como borrador, o borra el borrador si ya no hay cambios
   * —el supervisor deshizo todo antes de cerrar—.
   */
  private guardarBorrador(avisar: boolean): void {
    if (!this.ficha?.editable || this._idx === null || this.isSaving) {
      return;
    }
    const valores: Record<string, number> = {};
    const motivos: Record<string, string> = {};
    const base: Record<string, number | null> = {};
    for (const c of this.ficha.criterios) {
      const valor = this.valores[c.campo];
      if (valor !== null && valor !== undefined && valor !== c.valor) {
        valores[c.campo] = valor;
        motivos[c.campo] = this.motivos[c.campo] ?? '';
        base[c.campo] = c.valor;
      }
    }
    const n = Object.keys(valores).length;
    if (!n) {
      this.borradores.borrar(this.modo, this._idx);
      return;
    }
    this.borradores.guardar(this.modo, this._idx, {
      valores, motivos, base, guardadoEn: new Date().toISOString()
    });
    if (avisar) {
      this.toast.info(`Revisión guardada como borrador · ${n} ${n === 1 ? 'cambio' : 'cambios'}`);
    }
  }

  /**
   * Vuelve a poner lo que quedó en el borrador de este audio.
   *
   * Solo restaura un criterio si el backend sigue diciendo lo mismo que cuando se empezó:
   * si otro supervisor lo guardó en el medio, ese cambio se descarta y se avisa.
   */
  private restaurarBorrador(data: EvaluationDetail): void {
    const borrador = data.editable ? this.borradores.obtener(this.modo, data.idx) : null;
    if (!borrador) {
      return;
    }
    let aplicados = 0;
    let vencidos = 0;
    for (const [campo, valor] of Object.entries(borrador.valores)) {
      const actual = data.criterios.find(c => c.campo === campo);
      if (actual && actual.valor === borrador.base[campo] && actual.valor !== valor) {
        this.valores[campo] = valor;
        this.motivos[campo] = borrador.motivos[campo] ?? '';
        aplicados++;
      } else {
        vencidos++;
      }
    }
    if (vencidos) {
      this.toast.warning(aplicados
        ? 'Parte de tu borrador no se restauró: esos criterios se guardaron después por otra revisión'
        : 'Tu borrador ya no aplica: la evaluación se guardó después por otra revisión');
    }
    if (aplicados) {
      this.borradorRetomado = borrador;
    } else {
      this.borradores.borrar(this.modo, data.idx);
    }
  }

  /** Tira el borrador y deja la ficha como está guardada. */
  descartarBorrador(): void {
    if (!this.ficha || this._idx === null) {
      return;
    }
    this.borradores.borrar(this.modo, this._idx);
    for (const c of this.ficha.criterios) {
      this.valores[c.campo] = c.valor;
    }
    this.motivos = {};
    this.borradorRetomado = null;
    this.recalcularBloques();
    this.toast.info('Borrador descartado');
  }

  /** «hoy a las 10:42» o «el 21/10 a las 10:42». */
  get cuandoBorrador(): string {
    if (!this.borradorRetomado) {
      return '';
    }
    const f = new Date(this.borradorRetomado.guardadoEn);
    const hora = f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const hoy = new Date().toDateString() === f.toDateString();
    return hoy
      ? `hoy a las ${hora}`
      : `el ${f.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit' })} a las ${hora}`;
  }

  // ------------------------------------------------------------------ edición

  marcar(campo: string, valor: number): void {
    if (!this.ficha?.editable || this.isSaving) {
      return;
    }
    this.valores[campo] = valor;
    if (!this.cambio(campo)) {
      // Volvió solo a su valor original: ya no hay nada que explicar.
      delete this.motivos[campo];
    }
    this.recalcularBloques();
  }

  /** Devuelve un criterio a lo que dice el backend, sin tener que recargar la ficha. */
  deshacer(campo: string): void {
    const original = this.ficha?.criterios.find(c => c.campo === campo);
    if (original) {
      this.valores[campo] = original.valor;
      delete this.motivos[campo];
      this.recalcularBloques();
    }
  }

  cambio(campo: string): boolean {
    const original = this.ficha?.criterios.find(c => c.campo === campo);
    return !!original && original.valor !== this.valores[campo];
  }

  /** Solo los criterios que de verdad cambiaron: es lo único que viaja en el PUT. */
  private get cambios(): Record<string, AdjustField> {
    const salida: Record<string, AdjustField> = {};
    for (const c of this.ficha?.criterios ?? []) {
      const valor = this.valores[c.campo];
      if (valor !== null && valor !== undefined && valor !== c.valor) {
        salida[c.campo] = { valor, comentario: (this.motivos[c.campo] || '').trim() };
      }
    }
    return salida;
  }

  get cantidadCambios(): number {
    return Object.keys(this.cambios).length;
  }

  /** Los criterios cambiados a los que todavía les falta el motivo. */
  get sinMotivo(): string[] {
    return Object.keys(this.cambios)
      .filter(campo => (this.motivos[campo] || '').trim().length < this.MINIMO_MOTIVO);
  }

  /** Lo que ya escribió para este criterio, para el contador de la caja. */
  largoMotivo(campo: string): number {
    return (this.motivos[campo] || '').trim().length;
  }

  get puedeGuardar(): boolean {
    return !!this.ficha?.editable && this.cantidadCambios > 0
      && this.sinMotivo.length === 0 && !this.isSaving;
  }

  /**
   * Revisado: escuchó el audio y estuvo conforme con todo.
   *
   * Es el botón que hoy no existía, y sin él solo se registrarían los errores del speech
   * y nunca sus aciertos —que son el denominador de la precisión—. Por eso se habilita
   * justo cuando no hay nada que corregir, que es el caso en que antes no había nada que
   * pulsar.
   */
  get puedeRevisar(): boolean {
    return !!this.ficha?.editable && this.cantidadCambios === 0 && !this.isSaving;
  }

  /** La última revisión, que es la que se muestra en la cinta. */
  get ultimaRevision() {
    return this.ficha?.revisiones?.[0] ?? null;
  }

  revisar(): void {
    if (this.puedeRevisar) {
      this.enviar({});
    }
  }

  guardar(): void {
    if (this.puedeGuardar) {
      this.enviar(this.cambios);
    }
  }

  private enviar(criterios: Record<string, AdjustField>): void {
    if (this._idx === null) {
      return;
    }
    const huboCambios = Object.keys(criterios).length > 0;
    this.isSaving = true;

    this.monitoreo.ajustarEvaluacion(this._idx, { criterios }).subscribe({
      next: (data) => {
        this.ficha = data;
        this.valores = {};
        this.motivos = {};
        for (const c of data.criterios) {
          this.valores[c.campo] = c.valor;
        }
        this.recalcularBloques();
        this.isSaving = false;
        // Guardado o marcado como revisado: el borrador ya cumplió.
        this.borradores.borrar(this.modo, data.idx);
        this.borradorRetomado = null;
        this.toast.success(huboCambios ? 'Evaluación corregida' : 'Audio marcado como revisado');
        this.guardado.emit();
      },
      error: (e) => {
        this.isSaving = false;
        // El backend devuelve el motivo real en los 400 —falta el motivo del cambio, el
        // criterio no es de esta rúbrica—: es lo único accionable que tiene el usuario.
        this.toast.error(e?.message || 'No se pudo guardar la revisión');
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

  // ------------------------------------------------------------------ descargas

  /**
   * El Excel se baja de la nota GUARDADA, asi que no se ofrece con cambios pendientes.
   *
   * El backend arma el xlsx leyendo audios_evaluaciones. Con correcciones sin guardar,
   * el archivo saldria con la nota vieja mientras la pantalla muestra la nueva, y eso
   * se lee como un error del sistema y no como lo que es. Guardar primero y bajar
   * despues deja una sola version de la verdad.
   */
  get puedeDescargarExcel(): boolean {
    return !!this.ficha && !this.descargandoExcel && this.cantidadCambios === 0;
  }

  get motivoExcel(): string {
    if (this.cantidadCambios > 0) {
      return 'Guarda los cambios antes de bajar el reporte: el Excel sale con la nota guardada';
    }
    return 'Descargar el reporte de evaluación en Excel';
  }

  /**
   * Hay audio que bajar si hay una parte y una via para traerla.
   *
   * En el discador la via es el mismo endpoint del reproductor; si la conversion
   * fallo, no hay archivo que ofrecer y el boton queda apagado. En legacy siempre se
   * puede, porque ahi se baja el crudo por nombre sin pasar por ffmpeg.
   */
  get puedeDescargarAudio(): boolean {
    if (!this.ficha || !this.player.parteActual || this.descargandoAudio) {
      return false;
    }
    if (this.player.urlParteActual) {
      return true;
    }
    return this.modo === 'legacy' ? this.puedeDescargar : this.player.estado !== 'error';
  }

  get motivoAudio(): string {
    if (!this.player.parteActual) {
      return 'Esta gestión no tiene grabación';
    }
    if (!this.puedeDescargarAudio && !this.descargandoAudio) {
      return 'El audio no se pudo preparar';
    }
    return this.player.hayVarias
      ? 'Descargar la parte que estás escuchando'
      : 'Descargar la grabación';
  }

  descargarExcel(): void {
    if (!this.ficha || !this.puedeDescargarExcel) {
      return;
    }

    this.descargandoExcel = true;
    this.reportes.downloadGestionHistoricaReporteFile({
      dni: this.ficha.documento,
      cliente: this.ficha.cliente,
      telefono: this.ficha.telefono,
      fecha: this.ficha.fecha,
      asesor: this.ficha.asesor,
      resultado: this.ficha.resultado,
      gestionHistoricaAudioIdx: this.ficha.idx
    }).subscribe({
      next: (blob: any) => {
        this.descargandoExcel = false;
        this.guardarArchivo(blob, `evaluacion_${this.ficha!.documento}_${this.ficha!.fecha}.xlsx`);
      },
      error: (e: { status?: number }) => {
        this.descargandoExcel = false;
        // 404 no es una falla: es una gestion con audio que todavia no se evaluo, y
        // en un rango cualquiera eso es lo normal. Merece su propio texto.
        this.toast.error(e?.status === 404
          ? 'Este audio todavía no tiene evaluación.'
          : 'No se pudo generar el reporte.');
      }
    });
  }

  /**
   * Baja el audio de la parte que esta sonando.
   *
   * Tres caminos, en orden de preferencia: el blob que el reproductor ya tiene (gratis),
   * el endpoint del discador por idx, o el de legacy por nombre.
   */
  descargarAudio(): void {
    const parte = this.player.parteActual;
    if (!this.ficha || !parte || !this.puedeDescargarAudio) {
      return;
    }

    const yaEstá = this.player.urlParteActual;
    if (yaEstá) {
      this.bajarDesdeUrl(yaEstá, parte.nombre);
      return;
    }

    if (this.modo === 'legacy') {
      this.descargarParteActual();
      return;
    }

    const peticion = this.monitoreo.descargarAudio(this.ficha.idx, parte.orden);
    if (!peticion) {
      return;
    }

    this.descargandoAudio = true;
    peticion.subscribe({
      next: (blob: Blob) => {
        this.descargandoAudio = false;
        this.guardarArchivo(blob, parte.nombre);
      },
      error: () => {
        this.descargandoAudio = false;
        this.toast.error('No se pudo descargar el audio.');
      }
    });
  }

  private guardarArchivo(blob: Blob, nombre: string): void {
    const url = window.URL.createObjectURL(blob);
    this.bajarDesdeUrl(url, nombre);
    window.URL.revokeObjectURL(url);
  }

  /** El object URL del reproductor NO se revoca: sigue siendo el src del audio. */
  private bajarDesdeUrl(url: string, nombre: string): void {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
  }

  // ------------------------------------------------------------------ formato

  pct(valor: number | null | undefined): string {
    return valor === null || valor === undefined ? '—' : `${valor}%`;
  }
}
