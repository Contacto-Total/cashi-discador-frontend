import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ConsultaReporte,
  Entregable,
  EntregablesReportService,
  FechaNombre,
  GuardarEntregable,
  PeriodoProgramado,
  Repeticion
} from '../../../features/reports/entregables-report/entregables-report.service';
import {
  FiltroSubcarteraComponent,
  SeleccionSubcartera
} from '../../../features/reports/entregables-report/filtro-subcartera.component';
import { EUI, EUI_ANIM, euiSegmento } from '../../../features/reports/entregables-report/entregables-ui';
import {
  TEXTO_PERIODO, fechaDelNombre, horaTexto, hoyLocal, periodosDe, rangoProgramado, resolverPatron, resumenRepeticion
} from '../../../features/reports/entregables-report/entregables.util';

/** Lo que se está editando. id null = entregable nuevo. */
interface Borrador {
  id: number | null;
  idConsulta: number;
  nombre: string;
  repeticion: Repeticion;
  diasSemana: number[];
  diaMes: number;
  horaLimite: string;
  periodoProgramado: PeriodoProgramado;
  patronArchivo: string;
  patronAsunto: string;
  fechaNombre: FechaNombre;
  activo: boolean;
}

const LUNES_A_SABADO = [1, 2, 3, 4, 5, 6];

/**
 * Mantenimiento de los entregables de una subcartera: qué consulta usa cada uno, cuándo
 * toca, qué periodo saca y cómo se nombran el archivo y el correo. Lo que se guarda aquí
 * es lo que muestra la pantalla de reportes entregables.
 *
 * No se borra: un entregable que ya no se usa se deja inactivo.
 */
@Component({
  selector: 'app-entregables-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, FiltroSubcarteraComponent],
  templateUrl: './entregables-reporte.component.html',
  styles: [EUI_ANIM]
})
export class EntregablesReporteComponent {

  readonly ui = EUI;
  readonly segmento = euiSegmento;

  readonly repeticiones: { valor: Repeticion; texto: string }[] = [
    { valor: 'DIARIO', texto: 'Diario' },
    { valor: 'SEMANAL', texto: 'Semanal' },
    { valor: 'MENSUAL', texto: 'Mensual' },
    { valor: 'PEDIDO', texto: 'A pedido' }
  ];
  readonly dias: { valor: number; letra: string; nombre: string }[] = [
    { valor: 1, letra: 'L', nombre: 'Lunes' },
    { valor: 2, letra: 'M', nombre: 'Martes' },
    { valor: 3, letra: 'X', nombre: 'Miércoles' },
    { valor: 4, letra: 'J', nombre: 'Jueves' },
    { valor: 5, letra: 'V', nombre: 'Viernes' },
    { valor: 6, letra: 'S', nombre: 'Sábado' },
    { valor: 7, letra: 'D', nombre: 'Domingo' }
  ];
  readonly fechasNombre: { valor: FechaNombre; texto: string }[] = [
    { valor: 'CORTE', texto: 'La del corte' },
    { valor: 'HOY', texto: 'La de hoy' }
  ];
  readonly ayudaRepeticion: Record<Repeticion, string> = {
    DIARIO: 'Marca los días en que se envía. Quita los que no se trabajan.',
    SEMANAL: 'Marca el día o los días de la semana en que toca.',
    MENSUAL: 'Si el mes es más corto, cae el último día.',
    PEDIDO: 'Sin repetición: no aparece en Toca hoy. Se saca cuando lo pidan.'
  };

  private readonly hoy = hoyLocal();

  seleccion = signal<SeleccionSubcartera | null>(null);
  consultas = signal<ConsultaReporte[]>([]);
  entregables = signal<Entregable[]>([]);
  cargando = signal(false);
  guardando = signal(false);

  borrador = signal<Borrador | null>(null);
  /** Cómo estaba el borrador al abrirlo, para saber si hay cambios sin guardar. */
  private original = signal('');

  /** Entregable que pidió abrir la pantalla de reportes (?editar=id). Se usa una vez. */
  private editarAlCargar: number | null;

  constructor(
    private service: EntregablesReportService,
    private toast: ToastService,
    route: ActivatedRoute
  ) {
    const editar = Number(route.snapshot.queryParamMap.get('editar'));
    this.editarAlCargar = Number.isInteger(editar) && editar > 0 ? editar : null;
  }

  // ==================== Tabla ====================

  filas = computed(() => this.entregables().map(e => ({
    e,
    codigo: this.consultas().find(c => c.id === e.idConsulta)?.codigo ?? '—',
    repeticion: resumenRepeticion(e),
    hora: e.repeticion === 'PEDIDO' || !e.horaLimite ? '—' : horaTexto(e.horaLimite),
    periodo: TEXTO_PERIODO[e.periodoProgramado]
  })));

  resumen = computed(() => {
    const s = this.seleccion();
    if (!s?.idSubcartera) return 'Qué consulta usa cada entregable, cuándo toca, qué periodo saca y cómo se nombra.';
    const total = this.entregables().length;
    const activos = this.entregables().filter(e => e.activo).length;
    const cuenta = this.cargando() ? '' : ` · ${total} ${total === 1 ? 'entregable' : 'entregables'}, ${activos} ${activos === 1 ? 'activo' : 'activos'}`;
    return `${s.proveedor} · ${s.subcartera}${cuenta}`;
  });

  // ==================== Formulario ====================

  consultaBorrador = computed(() => {
    const b = this.borrador();
    return b ? this.consultas().find(c => c.id === b.idConsulta) ?? null : null;
  });

  periodos = computed(() => {
    const c = this.consultaBorrador();
    return (c ? periodosDe(c.tipoPeriodo) : []).map(valor => ({ valor, texto: TEXTO_PERIODO[valor] }));
  });

  sucio = computed(() => {
    const b = this.borrador();
    return !!b && JSON.stringify(b) !== this.original();
  });

  /** Lo primero que falta para poder guardar; vacío si está completo. */
  error = computed(() => {
    const b = this.borrador();
    if (!b) return '';
    if (!b.nombre.trim()) return 'Falta el nombre.';
    if ((b.repeticion === 'DIARIO' || b.repeticion === 'SEMANAL') && b.diasSemana.length === 0) return 'Marca al menos un día.';
    if (b.repeticion === 'MENSUAL' && !(b.diaMes >= 1 && b.diaMes <= 31)) return 'El día del mes va de 1 a 31.';
    if (b.repeticion !== 'PEDIDO' && !b.horaLimite) return 'Falta la hora límite.';
    if (!b.patronArchivo.trim()) return 'Falta el nombre del archivo.';
    return '';
  });

  /** Cómo saldrían hoy el archivo y el asunto con lo que hay en el formulario. */
  vistaPrevia = computed(() => {
    const b = this.borrador();
    if (!b) return { archivo: '', asunto: '' };
    const fecha = fechaDelNombre(b.fechaNombre, rangoProgramado(b.periodoProgramado, this.hoy).hasta, this.hoy);
    return { archivo: resolverPatron(b.patronArchivo, fecha), asunto: resolverPatron(b.patronAsunto, fecha) };
  });

  // ==================== Carga ====================

  onSeleccion(seleccion: SeleccionSubcartera): void {
    const anterior = this.seleccion()?.idSubcartera ?? null;
    this.seleccion.set(seleccion);
    if (seleccion.idSubcartera === anterior) return;

    // Cambiar de subcartera cierra lo que se estaba editando: el borrador era de la anterior.
    this.consultas.set([]);
    this.entregables.set([]);
    this.cerrar();
    if (seleccion.idSubcartera != null) this.cargar(seleccion.idSubcartera);
  }

  private cargar(idSubcartera: number, abrir: number | null = null): void {
    this.cargando.set(true);
    forkJoin({
      consultas: this.service.getConsultas(idSubcartera),
      entregables: this.service.getEntregables(idSubcartera, true)
    }).subscribe({
      next: ({ consultas, entregables }) => {
        if (this.seleccion()?.idSubcartera !== idSubcartera) return;
        this.consultas.set(consultas);
        this.entregables.set(entregables);
        this.cargando.set(false);

        const idAbrir = abrir ?? this.editarAlCargar;
        this.editarAlCargar = null;
        const elegido = idAbrir != null ? entregables.find(e => e.id === idAbrir) : undefined;
        if (elegido) this.abrir(elegido);
      },
      error: (err) => {
        if (this.seleccion()?.idSubcartera !== idSubcartera) return;
        console.error('Error cargando entregables:', err);
        this.cargando.set(false);
        this.toast.error(this.mensaje(err, 'No se pudieron cargar los entregables de la subcartera'));
      }
    });
  }

  // ==================== Acciones ====================

  editar(e: Entregable): void {
    if (this.borrador()?.id === e.id) return;
    if (this.sucio() && !confirm('Hay cambios sin guardar. ¿Descartarlos?')) return;
    this.abrir(e);
  }

  nuevo(): void {
    const consulta = this.consultas()[0];
    if (!consulta) return;
    if (this.sucio() && !confirm('Hay cambios sin guardar. ¿Descartarlos?')) return;
    this.fijar({
      id: null,
      idConsulta: consulta.id,
      nombre: '',
      repeticion: 'PEDIDO',
      diasSemana: [1],
      diaMes: 1,
      horaLimite: '09:00',
      periodoProgramado: periodosDe(consulta.tipoPeriodo)[0],
      patronArchivo: 'Reporte_[DIA]_[MES]_[ANIO].xlsx',
      patronAsunto: 'REPORTE_[DIA]/[MES]/[ANIO]',
      fechaNombre: 'CORTE',
      activo: true
    });
  }

  cancelar(): void {
    if (this.sucio() && !confirm('Hay cambios sin guardar. ¿Descartarlos?')) return;
    this.cerrar();
  }

  cambiar(cambio: Partial<Borrador>): void {
    this.borrador.update(b => (b ? { ...b, ...cambio } : b));
  }

  /** Al cambiar de consulta, el periodo programado se ajusta a uno que esa consulta admita. */
  elegirConsulta(c: ConsultaReporte): void {
    const b = this.borrador();
    if (!b) return;
    const validos = periodosDe(c.tipoPeriodo);
    this.cambiar({
      idConsulta: c.id,
      periodoProgramado: validos.includes(b.periodoProgramado) ? b.periodoProgramado : validos[0]
    });
  }

  elegirRepeticion(repeticion: Repeticion): void {
    const b = this.borrador();
    if (!b || b.repeticion === repeticion) return;
    let diasSemana = b.diasSemana;
    if (repeticion === 'DIARIO') diasSemana = [...LUNES_A_SABADO];
    if (repeticion === 'SEMANAL') diasSemana = [1];
    this.cambiar({ repeticion, diasSemana, horaLimite: b.horaLimite || '09:00' });
  }

  alternarDia(dia: number): void {
    const b = this.borrador();
    if (!b) return;
    const diasSemana = b.diasSemana.includes(dia) ? b.diasSemana.filter(d => d !== dia) : [...b.diasSemana, dia].sort((x, y) => x - y);
    this.cambiar({ diasSemana });
  }

  cambiarDiaMes(texto: string | number): void {
    const dia = Math.trunc(Number(texto));
    this.cambiar({ diaMes: Number.isFinite(dia) ? Math.min(31, Math.max(1, dia)) : 1 });
  }

  guardar(): void {
    const b = this.borrador();
    const idSubcartera = this.seleccion()?.idSubcartera;
    if (!b || idSubcartera == null || this.error() || this.guardando()) return;

    const conDias = b.repeticion === 'DIARIO' || b.repeticion === 'SEMANAL';
    const cuerpo: GuardarEntregable = {
      idSubcartera,
      idConsulta: b.idConsulta,
      nombre: b.nombre.trim(),
      repeticion: b.repeticion,
      diasSemana: conDias ? b.diasSemana : [],
      diaMes: b.repeticion === 'MENSUAL' ? b.diaMes : null,
      horaLimite: b.repeticion === 'PEDIDO' ? null : b.horaLimite,
      periodoProgramado: b.periodoProgramado,
      patronArchivo: b.patronArchivo.trim(),
      patronAsunto: b.patronAsunto.trim() || null,
      fechaNombre: b.fechaNombre,
      activo: b.activo
    };

    this.guardando.set(true);
    const pedido = b.id == null ? this.service.crear(cuerpo) : this.service.actualizar(b.id, cuerpo);
    pedido.subscribe({
      next: (guardado) => {
        this.guardando.set(false);
        this.toast.success(b.id == null ? 'Entregable creado' : 'Cambios guardados');
        this.cerrar();
        this.cargar(idSubcartera, guardado.id);
      },
      error: (err) => {
        console.error('Error guardando el entregable:', err);
        this.guardando.set(false);
        this.toast.error(this.mensaje(err, 'No se pudo guardar el entregable'));
      }
    });
  }

  claseDia(marcado: boolean): string {
    return 'h-[38px] w-[38px] rounded-lg border text-[13px] font-bold transition-colors duration-150 ' +
      (marcado ? 'border-[#0f172a] bg-[#0f172a] text-white dark:border-white dark:bg-white dark:text-slate-900'
               : 'border-[#d5dbe3] bg-white text-[#334155] hover:border-[#8491a3] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300');
  }

  claseEstado(activo: boolean): string {
    return this.ui.pildora + ' ' +
      (activo ? 'bg-[#e7f6ec] text-[#166534] dark:bg-green-950/50 dark:text-green-300'
              : 'bg-[#eef1f5] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400');
  }

  // ==================== Interno ====================

  private abrir(e: Entregable): void {
    this.fijar({
      id: e.id,
      idConsulta: e.idConsulta,
      nombre: e.nombre,
      repeticion: e.repeticion,
      diasSemana: [...(e.diasSemana || [])],
      diaMes: e.diaMes ?? 1,
      horaLimite: e.horaLimite ?? '09:00',
      periodoProgramado: e.periodoProgramado,
      patronArchivo: e.patronArchivo,
      patronAsunto: e.patronAsunto ?? '',
      fechaNombre: e.fechaNombre,
      activo: e.activo
    });
  }

  private fijar(b: Borrador): void {
    this.borrador.set(b);
    this.original.set(JSON.stringify(b));
  }

  private cerrar(): void {
    this.borrador.set(null);
    this.original.set('');
  }

  private mensaje(err: any, porDefecto: string): string {
    return err?.error?.message || err?.error?.mensaje || err?.error?.error || porDefecto;
  }
}
