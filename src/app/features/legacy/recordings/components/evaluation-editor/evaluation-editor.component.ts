import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, X, FileText, Save, Check, RotateCcw
} from 'lucide-angular';

import { ToastService } from '../../../../../shared/services/toast.service';
import { QualityMonitoringService } from '../../services/quality-monitoring.service';
import { HistoricalRecordingsService } from '../../services/historical-recordings.service';
import { EvaluationCriterion, EvaluationDetail } from '../../models/quality-monitoring.model';
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
 * ## Qué NO tiene, y por qué
 *
 * No descarga el XLSX ni reproduce el audio. Las dos cosas viven en la pestaña de
 * Grabaciones, que es donde el supervisor prepara su revisión: para cuando llega
 * acá ya escuchó la llamada. Repetirlas convertía la ficha en una barra de
 * herramientas y enterraba lo único que se viene a hacer, que es mirar los
 * criterios y corregir.
 *
 * La transcripción sí quedó, plegada y apagada por defecto. Es la excepción porque
 * es la única que responde la pregunta concreta que aparece al dudar de un
 * criterio —«¿dijo o no dijo la frase?»— sin salir de la pantalla ni perder los
 * cambios sin guardar.
 */
@Component({
  selector: 'app-evaluation-editor',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './evaluation-editor.component.html',
  styleUrls: ['./evaluation-editor.component.scss']
})
export class EvaluationEditorComponent {
  readonly X = X;
  readonly FileText = FileText;
  readonly Save = Save;
  readonly Check = Check;
  readonly RotateCcw = RotateCcw;

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

  /** campo -> valor elegido en pantalla. Arranca como copia de lo que trajo el backend. */
  valores: Record<string, number | null> = {};

  transcripcion: Transcription[] | null = null;
  isLoadingTranscripcion = false;
  mostrarTranscripcion = false;

  constructor(
    private monitoreo: QualityMonitoringService,
    private historicas: HistoricalRecordingsService,
    private toast: ToastService
  ) {}

  // ------------------------------------------------------------------ carga

  private cargar(idx: number): void {
    this.isLoading = true;
    this.ficha = null;
    this.transcripcion = null;
    this.mostrarTranscripcion = false;

    this.monitoreo.getEvaluacion(idx).subscribe({
      next: (data) => {
        this.ficha = data;
        this.valores = {};
        for (const c of data.criterios) {
          this.valores[c.campo] = c.valor;
        }
        this.recalcularBloques();
        this.isLoading = false;
      },
      error: (e) => {
        this.isLoading = false;
        this.toast.error(e?.message || 'No se pudo cargar la evaluación');
        this.cerrar();
      }
    });
  }

  cerrar(): void {
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

  // ------------------------------------------------------------------ formato

  pct(valor: number | null | undefined): string {
    return valor === null || valor === undefined ? '—' : `${valor}%`;
  }
}
