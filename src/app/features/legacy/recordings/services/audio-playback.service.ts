import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import { AudioPart } from '../models/quality-monitoring.model';

/** En qué punto está la preparación de la parte que se está escuchando. */
export type PlaybackState = 'vacio' | 'preparando' | 'listo' | 'error';

/** Devuelve la URL desde la que bajar una parte, o null si hay que resolverla por nombre. */
export type ResolverUrl = (parte: AudioPart) => string | null;

/**
 * La reproducción de un audio histórico dentro de la ficha de evaluación.
 *
 * ## Un solo audio a la vez, y por eso es un singleton
 *
 * Hay **un** `HTMLAudioElement` para toda la aplicación. Abrir otra ficha corta la
 * anterior. Dos llamadas sonando juntas no es un caso de uso, es un accidente: el
 * supervisor recorre audios seguidos y cada uno pertenece a la evaluación que tiene
 * delante. Si el audio sobreviviera al cierre de la ficha, terminaría sonando sobre
 * la evaluación equivocada.
 *
 * ## Por qué los bytes se piden con HttpClient y no con `<audio src>`
 *
 * Una etiqueta `<audio src="...">` hace un GET pelado, sin pasar por el interceptor,
 * así que no puede mandar el JWT. El audio se pide aquí como blob, se convierte en un
 * object URL y recién ahí se le da al elemento. Es también la razón por la que no hay
 * URLs prefirmadas de S3 en ningún lado: serían credenciales al portador sobre
 * grabaciones que llevan DNI, teléfono y datos de deuda adentro.
 *
 * ## La preparación arranca al abrir la ficha, no al pulsar play
 *
 * El backend baja el objeto del bucket y lo convierte con ffmpeg —lo que hay en S3 es
 * GSM 6.10, que ningún navegador decodifica—. Mientras el supervisor lee el resumen
 * del modelo y baja por los criterios, esos bytes ya se están preparando; cuando
 * decide escuchar, suena. Si cierra antes, la petición se cancela.
 *
 * ## Las partes de una gestión
 *
 * Una gestión larga se partía en varias grabaciones. Se tratan como **una sola
 * escucha**: al terminar una parte arranca la siguiente sola si el supervisor estaba
 * escuchando, y saltar entre ellas no cierra nada. Cada parte se convierte la primera
 * vez que se la pide y su blob queda mientras la ficha esté abierta, así que volver
 * a la parte 1 es instantáneo y no gasta otro proceso de ffmpeg en el servidor.
 */
@Injectable({ providedIn: 'root' })
export class AudioPlaybackService implements OnDestroy {

  /** Mismo prefijo que la descarga: es el mismo controller. */
  private readonly baseUrl = environment.apiUrl + '/recording';

  /**
   * Cómo se pide el audio de una parte, cuando el módulo sabe su URL exacta.
   *
   * Null es el camino de legacy: se pide por nombre y el backend lo busca en el bucket.
   */
  private urlPorParte: ResolverUrl | null = null;

  /** Las velocidades que se ofrecen, en el orden en que rota el botón. */
  readonly VELOCIDADES = [1, 1.5, 2];

  private readonly audio: HTMLAudioElement = new Audio();

  /**
   * orden de la parte -> object URL ya convertido.
   *
   * Vive lo que vive la ficha. Es la única caché que hay en todo el camino: el
   * backend convierte en cada pedido a propósito, y aquí se evita repetir el pedido
   * cuando el supervisor va y vuelve entre partes de la misma gestión.
   */
  private readonly urls = new Map<number, string>();

  private peticion: Subscription | null = null;

  // ---------------------------------------------------------------- estado visible

  partes: AudioPart[] = [];
  /** Índice dentro de `partes`, no el campo `orden`. */
  indice = 0;

  estado: PlaybackState = 'vacio';
  mensajeError = '';

  reproduciendo = false;
  posicion = 0;
  /** Segundos de la parte actual. Sale del archivo ya cargado; 0 mientras no lo esté. */
  duracion = 0;
  velocidad = 1;

  constructor(private http: HttpClient) {
    this.audio.preload = 'auto';

    this.audio.addEventListener('timeupdate', () => {
      this.posicion = this.audio.currentTime;
    });
    this.audio.addEventListener('loadedmetadata', () => {
      // Un WAV PCM sí trae la duración en la cabecera, así que este valor es exacto
      // desde el primer momento y no hace falta el truco de saltar al final.
      this.duracion = Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    });
    this.audio.addEventListener('play', () => { this.reproduciendo = true; });
    this.audio.addEventListener('pause', () => { this.reproduciendo = false; });
    this.audio.addEventListener('ended', () => this.alTerminar());
  }

  ngOnDestroy(): void {
    this.cerrar();
  }

  // ---------------------------------------------------------------- ciclo de vida

  /**
   * Deja listo el reproductor para una gestión y empieza a preparar su primera parte.
   *
   * Corta lo que estuviera sonando: ver la nota de la clase sobre por qué hay un solo
   * elemento de audio.
   */
  abrir(partes: AudioPart[], urlPorParte: ResolverUrl | null = null): void {
    this.cerrar();
    this.partes = partes ?? [];
    this.urlPorParte = urlPorParte;
    this.indice = 0;
    if (this.partes.length) {
      this.preparar(0, false);
    }
  }

  /**
   * Corta el audio, cancela lo que esté en vuelo y suelta los object URL.
   *
   * `revokeObjectURL` va exactamente aquí y no en el `ended` de cada parte: mientras la
   * ficha siga abierta el supervisor puede volver a una parte que ya escuchó, y
   * revocarla antes lo obligaría a esperar otra conversión.
   */
  cerrar(): void {
    this.peticion?.unsubscribe();
    this.peticion = null;

    this.audio.pause();
    this.audio.removeAttribute('src');
    this.audio.load();

    for (const url of this.urls.values()) {
      URL.revokeObjectURL(url);
    }
    this.urls.clear();

    this.partes = [];
    this.urlPorParte = null;
    this.indice = 0;
    this.estado = 'vacio';
    this.mensajeError = '';
    this.reproduciendo = false;
    this.posicion = 0;
    this.duracion = 0;
  }

  // ---------------------------------------------------------------- preparación

  get parteActual(): AudioPart | null {
    return this.partes[this.indice] ?? null;
  }

  get hayVarias(): boolean {
    return this.partes.length > 1;
  }

  /**
   * Pide los bytes de una parte y los carga en el elemento.
   *
   * @param autoplay true cuando el supervisor ya estaba escuchando: al saltar de parte
   *                 o al encadenar con la siguiente, quedarse en pausa lo obligaría a
   *                 volver a pulsar play para seguir la misma llamada
   */
  private preparar(indice: number, autoplay: boolean): void {
    const parte = this.partes[indice];
    if (!parte) {
      return;
    }

    this.peticion?.unsubscribe();
    this.indice = indice;
    this.posicion = 0;
    this.duracion = 0;
    this.mensajeError = '';

    const cacheada = this.urls.get(parte.orden);
    if (cacheada) {
      this.estado = 'listo';
      this.cargar(cacheada, autoplay);
      return;
    }

    // Dos caminos, y la diferencia es dónde vive la ruta del archivo.
    //
    // En el discador la fila de la llamada guarda `recording_s3_key`, así que el backend
    // resuelve el objeto con el `idx` y basta un GET. En legacy no hay tal cosa: lo único
    // que se sabe es el nombre del WAV, y el backend tiene que buscarlo en el índice del
    // bucket, así que se le mandan los cuatro campos en un POST.
    //
    // La key nunca viaja del navegador al backend, ni siquiera en el discador: mandarla
    // convertiría ese endpoint en un lector de cualquier objeto del bucket.
    const directa = this.urlPorParte?.(parte) ?? null;

    this.estado = 'preparando';
    this.peticion = (directa
      ? this.http.get(directa, { responseType: 'blob' })
      : this.http.post(
          this.baseUrl + '/historico/audio/preescucha',
          { anio: parte.anio, mes: parte.mes, dia: parte.dia, nombre: parte.nombre },
          { responseType: 'blob' })
    ).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.urls.set(parte.orden, url);
        this.estado = 'listo';
        this.cargar(url, autoplay);
      },
      error: (e: HttpErrorResponse) => {
        this.estado = 'error';
        this.mensajeError = this.explicar(e.status);
      }
    });
  }

  private cargar(url: string, autoplay: boolean): void {
    this.audio.src = url;
    this.audio.playbackRate = this.velocidad;
    this.audio.load();
    if (autoplay) {
      // Puede rechazar si el navegador todavía no vio un gesto del usuario. Cuando
      // llega aquí siempre lo hubo —un click en play o en una parte—, pero el catch
      // evita una promesa sin capturar en consola si alguna vez deja de ser cierto.
      this.audio.play().catch(() => { this.reproduciendo = false; });
    }
  }

  /**
   * Traduce el código de respuesta a algo que el supervisor pueda accionar.
   *
   * Los tres casos son distintos y esconderlos detrás de un mensaje único haría que
   * "reintenta" y "este archivo no existe" se vieran igual.
   */
  private explicar(status: number): string {
    switch (status) {
      case 404: return 'Este audio no está en el bucket';
      case 422: return 'No se pudo preparar este audio';
      case 503: return 'El servidor está ocupado, reintenta en un momento';
      default: return 'No se pudo preparar este audio';
    }
  }

  /** Vuelve a intentar la parte que falló. Es el botón de la franja de error. */
  reintentar(): void {
    this.urls.delete(this.parteActual?.orden ?? -1);
    this.preparar(this.indice, false);
  }

  // ---------------------------------------------------------------- controles

  alternar(): void {
    if (this.estado !== 'listo') {
      return;
    }
    if (this.audio.paused) {
      this.audio.play().catch(() => { this.reproduciendo = false; });
    } else {
      this.audio.pause();
    }
  }

  /** Salto relativo, en segundos. Negativo retrocede. */
  saltar(segundos: number): void {
    if (this.estado !== 'listo' || !this.duracion) {
      return;
    }
    this.irA(this.audio.currentTime + segundos);
  }

  irA(segundo: number): void {
    if (this.estado !== 'listo' || !this.duracion) {
      return;
    }
    const destino = Math.min(Math.max(segundo, 0), this.duracion);
    this.audio.currentTime = destino;
    this.posicion = destino;
  }

  /**
   * Rota entre 1×, 1.5× y 2×.
   *
   * No es un adorno: quien revisa veinte audios seguidos se ahorra minutos reales, y
   * a 2× una llamada de tres minutos se escucha en uno y medio sin perder inteligibilidad
   * —el navegador corrige el tono—.
   */
  cambiarVelocidad(): void {
    const siguiente = (this.VELOCIDADES.indexOf(this.velocidad) + 1) % this.VELOCIDADES.length;
    this.velocidad = this.VELOCIDADES[siguiente];
    this.audio.playbackRate = this.velocidad;
  }

  /** Salta a otra parte de la misma gestión, conservando si estaba sonando o no. */
  irAParte(indice: number): void {
    if (indice === this.indice || !this.partes[indice]) {
      return;
    }
    this.preparar(indice, this.reproduciendo);
  }

  /**
   * Al terminar una parte arranca la siguiente.
   *
   * Es una sola llamada partida en archivos: encadenarlas es lo que el supervisor
   * esperaría de un reproductor, y obligarlo a pulsar la parte 2 sería recordarle una
   * división que es del sistema de archivos y no de la conversación.
   */
  private alTerminar(): void {
    this.reproduciendo = false;
    this.posicion = this.duracion;

    if (this.indice + 1 < this.partes.length) {
      this.preparar(this.indice + 1, true);
    }
  }

  // ---------------------------------------------------------------- formato

  /** Segundos a m:ss. Sirve tanto para la posición como para la duración de FOH. */
  static reloj(segundos: number | null | undefined): string {
    if (segundos === null || segundos === undefined || !Number.isFinite(segundos)) {
      return '0:00';
    }
    const total = Math.max(0, Math.round(segundos));
    return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, '0')}`;
  }
}
