import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EnGestion, HistorialMantenimiento, Mantenimiento, MantenimientoAvance, MantenimientoService,
  cuenta, dosDigitos, horaCorta
} from './mantenimiento.service';
import { MascotaCascoComponent } from './mascota-casco.component';

type Vista = 'OPERATIVO' | 'PROGRAMADO' | 'INMEDIATO' | 'EN_DETENCION' | 'BLOQUEADO';
type Confirmacion = 'ahora' | 'bloquear' | null;
type ClasePaso = 'm-idle' | 'm-run' | 'm-ok' | 'm-skip';

interface Paso { id: string; titulo: string; clase: ClasePaso; sub: string; val: string; barra: number | null; }
interface Etiqueta { texto: string; fondo: string; color: string; borde: string; }

const ETIQUETAS: Record<Vista, Etiqueta> = {
  OPERATIVO: { texto: 'Operativo', fondo: 'var(--ok-bg)', color: 'var(--ok)', borde: 'var(--ok-ln)' },
  PROGRAMADO: { texto: 'Programado', fondo: '#e8f0fe', color: '#1d4ed8', borde: '#c7d9fb' },
  INMEDIATO: { texto: '', fondo: '#e8f0fe', color: '#1d4ed8', borde: '#c7d9fb' },
  EN_DETENCION: { texto: 'En detención', fondo: 'var(--am-bg)', color: 'var(--am)', borde: 'var(--am-ln)' },
  BLOQUEADO: { texto: 'Bloqueado', fondo: 'var(--ro-bg)', color: 'var(--ro)', borde: 'var(--ro-ln)' }
};

/** Trazos de los iconos (lucide), uno por icono. */
const ICONOS = {
  reloj: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z M12 6v6l4 2',
  play: 'M6 3l14 9-14 9V3z',
  x: 'M18 6 6 18M6 6l12 12',
  candado: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 10 0v4',
  abierto: 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z M7 11V7a5 5 0 0 1 9.9-1',
  volver: 'M19 12H5M12 19l-7-7 7-7',
  check: 'M20 6 9 17l-5-5',
  izq: 'm15 18-6-6 6-6',
  der: 'm9 18 6-6-6-6',
  tel: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  nota: 'M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2 M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z M8 12h8M8 16h5',
  cafe: 'M17 8h1a4 4 0 1 1 0 8h-1 M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z M6 2v2M10 2v2M14 2v2',
  llave: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  monitor: 'M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z M8 21h8M12 17v4',
  flujo: 'm3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8',
  grupo: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  historial: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8 M3 3v5h5M12 7v5l4 2',
  subida: 'M16 16l-4-4-4 4 M12 12v9 M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3',
  alerta: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3 M12 9v4 M12 17h.01'
};

const AVISO = 10 * 60_000;
const RECORDATORIO = 5 * 60_000;
const REPOSO = 10_000;
const CADA = 2000;
const POR_PAGINA = 5;

/**
 * Vista de Sistemas para el mantenimiento: programa o lanza la detencion, sigue
 * el flujo paso a paso con los datos en vivo y libera al terminar el despliegue.
 */
@Component({
  selector: 'app-mantenimiento-sistema',
  standalone: true,
  imports: [NgTemplateOutlet, MascotaCascoComponent],
  templateUrl: './mantenimiento-sistema.component.html',
  styleUrl: './mantenimiento-sistema.component.css'
})
export class MantenimientoSistemaComponent implements OnInit, OnDestroy {
  readonly mant = inject(MantenimientoService);
  readonly I = ICONOS;

  readonly avance = signal<MantenimientoAvance | null>(null);
  readonly historial = signal<HistorialMantenimiento | null>(null);
  readonly pestana = signal<'prog' | 'ya'>('prog');
  readonly hora = signal('13:00');
  readonly confirmando = signal<Confirmacion>(null);
  readonly enviando = signal(false);
  readonly error = signal<string | null>(null);
  readonly avisoCerrado = signal(false);
  /** Fila recien agregada al historial, para resaltarla una vez. */
  readonly filaNueva = signal<number | null>(null);

  /** Tras liberar: los pasos tal como quedaron y el estado del ultimo. */
  private readonly cierre = signal<{ pasos: Paso[]; fase: 'run' | 'ok' } | null>(null);
  private readonly tic = signal(0);
  private sondeo?: ReturnType<typeof setInterval>;
  private reloj?: ReturnType<typeof setInterval>;
  private esperas: ReturnType<typeof setTimeout>[] = [];

  /** Reloj del servidor, al segundo mientras la vista esta abierta. */
  readonly ahora = computed(() => { this.tic(); return this.mant.horaServidor(); });

  readonly vista = computed<Vista>(() => {
    const d = this.mant.datos();
    if (!d) {
      return 'OPERATIVO';
    }
    return d.estado === 'PROGRAMADO' && d.inmediato ? 'INMEDIATO' : d.estado;
  });

  readonly etiqueta = computed<Etiqueta>(() => {
    const base = ETIQUETAS[this.vista()];
    return this.vista() === 'INMEDIATO' ? { ...base, texto: `Inicia en ${cuenta(this.falta())}` } : base;
  });

  readonly subtitulo = computed(() => {
    const d = this.mant.datos();
    switch (this.vista()) {
      case 'PROGRAMADO': return `Sistemas · programado para las ${this.h(d?.inicioProgramado)}`;
      case 'INMEDIATO': return 'Sistemas · inicio inmediato';
      case 'EN_DETENCION': return `Sistemas · detención iniciada ${this.h(d?.inicioDetencion)}`;
      case 'BLOQUEADO': return `Sistemas · bloqueado desde ${this.h(d?.inicioBloqueo)}`;
      default: return 'Sistemas · sin mantenimiento programado';
    }
  });

  readonly activo = computed(() => this.vista() === 'EN_DETENCION' || this.vista() === 'BLOQUEADO');
  readonly lista = computed<EnGestion[]>(() => this.avance()?.enGestion ?? []);
  readonly bloqueados = computed(() => {
    const a = this.avance();
    return a && this.activo() ? Math.max(0, a.conectados - a.enPausa - a.enGestion.length) : 0;
  });

  readonly listo = computed(() => this.vista() === 'BLOQUEADO' && !this.mant.reiniciando());
  readonly listoTexto = computed(() => {
    const desde = this.h(this.mant.datos()?.inicioBloqueo);
    const quedan = this.lista().length;
    return quedan
      ? `Bloqueado desde ${desde}. Siguen en gestión: ${quedan}.`
      : `Sin llamadas ni tipificaciones en curso desde ${desde}.`;
  });

  readonly tiempoMaximo = computed(() => {
    const limite = this.mant.datos()?.limiteDetencion;
    return limite ? cuenta(limite - this.ahora()) : '';
  });

  /** Lo que ve un asesor libre en este momento. */
  readonly asesorBloqueado = computed(() => {
    const d = this.mant.datos();
    return !!d && (d.estado === 'BLOQUEADO' || (d.estado === 'EN_DETENCION' && d.entradaCerrada));
  });
  readonly avisoAsesor = computed<{ titulo: string; texto: string; cerrable: boolean } | null>(() => {
    const d = this.mant.datos();
    if (!d || d.estado !== 'PROGRAMADO' || !d.inicioProgramado) {
      return null;
    }
    const falta = this.falta();
    if (falta <= 0) {
      return null;
    }
    if (d.inmediato) {
      return { titulo: 'Entramos en mantenimiento en 60 segundos', texto: 'No inicies una gestión nueva.', cerrable: false };
    }
    const hora = horaCorta(d.inicioProgramado);
    if (falta <= RECORDATORIO) {
      return { titulo: 'Mantenimiento en 5 minutos', texto: `A las ${hora} se bloqueará la pantalla.`, cerrable: false };
    }
    if (falta <= AVISO && !this.avisoCerrado()) {
      return { titulo: `Mantenimiento a las ${hora}`, texto: 'A esa hora se bloqueará la pantalla.', cerrable: true };
    }
    return null;
  });

  readonly pasos = computed<Paso[]>(() => {
    const cierre = this.cierre();
    if (cierre) {
      const ultimo: Paso = cierre.fase === 'run'
        ? { id: 'reanudar', titulo: 'Discado reanudado', clase: 'm-run', sub: 'Encendiendo campañas y colas', val: '', barra: null }
        : { id: 'reanudar', titulo: 'Discado reanudado', clase: 'm-ok', sub: 'Campañas y colas encendidas', val: 'Ahora', barra: null };
      return [...cierre.pasos.slice(0, -1), ultimo];
    }
    return this.calcularPasos();
  });

  ngOnInit(): void {
    this.pedir();
    this.cargarHistorial(0);
    this.sondeo = setInterval(() => this.pedir(), CADA);
    this.reloj = setInterval(() => this.tic.update(n => n + 1), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.sondeo);
    clearInterval(this.reloj);
    this.esperas.forEach(clearTimeout);
  }

  programar(): void {
    this.avisoCerrado.set(false);
    this.enviar(this.mant.programar(this.hora()));
  }

  iniciarAhora(): void {
    this.enviar(this.mant.iniciarAhora());
  }

  cancelar(): void {
    this.enviar(this.mant.cancelar(), () => this.cargarHistorial(0, true));
  }

  bloquear(): void {
    this.enviar(this.mant.bloquear());
  }

  liberar(): void {
    const pasos = this.calcularPasos();
    this.enviar(this.mant.liberar(), () => {
      this.cierre.set({ pasos, fase: 'run' });
      this.esperas.push(
        setTimeout(() => this.cierre.set({ pasos, fase: 'ok' }), 900),
        setTimeout(() => { this.cierre.set(null); this.cargarHistorial(0, true); }, 2300)
      );
    });
  }

  cargarHistorial(pagina: number, resaltar = false): void {
    this.mant.historial(pagina, POR_PAGINA).subscribe({
      next: h => {
        this.historial.set(h);
        this.filaNueva.set(resaltar && h.filas.length ? h.filas[0].id : null);
      },
      error: () => undefined
    });
  }

  h(ms: number | null | undefined): string {
    return ms ? horaCorta(ms) : '–';
  }

  fecha(ms: number): string {
    const f = new Date(ms);
    return `${dosDigitos(f.getDate())}/${dosDigitos(f.getMonth() + 1)}/${f.getFullYear()}`;
  }

  duracion(segundos: number | null): string {
    return segundos == null ? '–' : cuenta(segundos * 1000);
  }

  /** Tiempo que lleva el asesor en su estado. */
  lleva(a: EnGestion): string {
    return a.desde ? cuenta(this.ahora() - a.desde) : '';
  }

  private calcularPasos(): Paso[] {
    const d = this.mant.datos();
    const a = this.avance();
    const v = this.vista();
    const paso = (id: string, titulo: string, clase: ClasePaso = 'm-idle', sub = '', val = '', barra: number | null = null): Paso =>
      ({ id, titulo, clase, sub, val, barra });

    let aviso = paso('aviso', 'Aviso a los usuarios');
    if (d && v === 'PROGRAMADO') {
      const inicio = d.inicioProgramado ?? 0;
      const falta = this.falta();
      aviso = falta <= RECORDATORIO
        ? paso('aviso', 'Aviso a los usuarios', 'm-run', `Recordatorio enviado ${horaCorta(inicio - RECORDATORIO)}`, '5 min')
        : falta <= AVISO
          ? paso('aviso', 'Aviso a los usuarios', 'm-run', `Aviso enviado ${horaCorta(inicio - AVISO)}`, '10 min')
          : paso('aviso', 'Aviso a los usuarios', 'm-run', `Aviso a las ${horaCorta(inicio - AVISO)}`, 'Pendiente');
    } else if (v === 'INMEDIATO') {
      aviso = paso('aviso', 'Aviso a los usuarios', 'm-run', 'Aviso de 60 segundos', `${Math.max(0, Math.ceil(this.falta() / 1000))} s`);
    } else if (d && this.activo()) {
      const inicio = d.inicioProgramado ?? 0;
      aviso = paso('aviso', 'Aviso a los usuarios', 'm-ok',
        d.inmediato ? 'Aviso de 60 segundos' : `Aviso ${horaCorta(inicio - AVISO)} · recordatorio ${horaCorta(inicio - RECORDATORIO)}`,
        'Enviado');
    }

    if (!d || !this.activo()) {
      return [aviso, paso('discado', 'Discado detenido'), paso('llamadas', 'Llamadas en curso'),
        paso('gestiones', 'Tipificaciones'), paso('pantallas', 'Pantallas bloqueadas'),
        paso('reposo', 'Reposo verificado'), paso('reanudar', 'Discado reanudado')];
    }

    const campanas = a?.campanasDetenidas ?? 0;
    const colas = a?.colasDetenidas ?? 0;
    const discado = paso('discado', 'Discado detenido', 'm-ok',
      `${campanas} ${campanas === 1 ? 'campaña' : 'campañas'} y ${colas} ${colas === 1 ? 'cola' : 'colas'} del bot`,
      this.h(d.inicioDetencion));

    const ll = a?.enLlamada ?? 0;
    const ti = a?.tipificando ?? 0;
    const enGestion = a?.enGestion.length ?? 0;
    const conectados = a?.conectados ?? 0;
    const llamadas = ll
      ? paso('llamadas', 'Llamadas en curso', 'm-run', `${ll} en llamada`, String(ll))
      : paso('llamadas', 'Llamadas en curso', 'm-ok', 'Sin llamadas en curso', '0');
    const gestiones = ll || ti
      ? paso('gestiones', 'Tipificaciones', 'm-run', `${ti} tipificando`, String(ti))
      : paso('gestiones', 'Tipificaciones', 'm-ok', 'Sin tipificaciones abiertas', '0');
    const pantallas = enGestion
      ? paso('pantallas', 'Pantallas bloqueadas', 'm-run', 'Cada usuario se bloquea al terminar', `${Math.max(0, conectados - enGestion)} de ${conectados}`)
      : paso('pantallas', 'Pantallas bloqueadas', 'm-ok', 'Todas las pantallas bloqueadas', `${conectados} de ${conectados}`);

    let reposo = paso('reposo', 'Reposo verificado');
    if (v === 'BLOQUEADO') {
      reposo = enGestion
        ? paso('reposo', 'Reposo verificado', 'm-skip', 'Bloqueo sin esperar', 'Forzado')
        : paso('reposo', 'Reposo verificado', 'm-ok', 'Nada en curso durante 10 s', this.h(d.inicioBloqueo));
    } else if (a?.reposoDesde) {
      const lleva = Math.min(REPOSO, Math.max(0, this.ahora() - a.reposoDesde));
      reposo = paso('reposo', 'Reposo verificado', 'm-run', 'Sin actividad durante 10 s',
        `${Math.ceil((REPOSO - lleva) / 1000)} s`, Math.round(lleva / REPOSO * 100));
    }

    return [aviso, discado, llamadas, gestiones, pantallas, reposo, paso('reanudar', 'Discado reanudado')];
  }

  private falta(): number {
    const inicio = this.mant.datos()?.inicioProgramado;
    return inicio ? inicio - this.ahora() : Number.POSITIVE_INFINITY;
  }

  private pedir(): void {
    this.mant.avance().subscribe({ next: a => this.avance.set(a), error: () => undefined });
  }

  private enviar(accion: Observable<Mantenimiento>, alTerminar?: () => void): void {
    this.error.set(null);
    this.enviando.set(true);
    accion.subscribe({
      next: () => {
        this.enviando.set(false);
        this.confirmando.set(null);
        alTerminar?.();
        this.pedir();
      },
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        this.confirmando.set(null);
        this.error.set(e.error?.error ?? 'No se pudo completar la acción');
        this.mant.consultar();
      }
    });
  }
}
