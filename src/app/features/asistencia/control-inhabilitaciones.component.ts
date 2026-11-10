import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { catchError, forkJoin, map, of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { ComboboxComponent, OpcionCombobox } from '../../shared/ui/combobox.component';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { AsistenciaService } from './asistencia.service';
import { Inhabilitacion, PersonalAsistencia } from './asistencia.models';
import { hoy } from './asistencia.estilos';
import { CAMPO, ENTRADA, ETIQUETA, FUERTE, LISTA, PILL, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, TonoPill } from './ui/clases';
import { MINI } from './ui/ficha-clases';
import { BOTON_APAGADO, BOTON_SEC } from './ui/control-comun';
import { SegmentadoComponent } from './ui/segmentado.component';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { FilaArchivo, ImportarArchivoComponent, bajarPlantilla, fechaDeCelda, sinTildes } from './ui/importar-archivo.component';

type Modo = 'uno' | 'varios' | 'archivo';

/** Una fila del archivo: asesor, rango y comentario, ya validados. */
interface InhabilitacionImportada {
  n: number;
  usuario: string;
  persona: PersonalAsistencia | null;
  desde: string | null;
  hasta: string | null;
  textoDesde: string;
  textoHasta: string;
  comentario: string;
  error: string;
}

const MOTIVO: Record<Inhabilitacion['motivo'], [string, TonoPill]> = {
  DESCANSO: ['Descanso', 'neu'], LICENCIA: ['Licencia', 'info'], VACACIONES: ['Vacaciones', 'ok'], SIN_ASIGNACION: ['Sin asignación', 'am']
};
const ESTADO: Record<Inhabilitacion['estado'], [string, TonoPill]> = {
  VIGENTE: ['Vigente', 'am'], PROGRAMADA: ['Programada', 'info'], TERMINADA: ['Terminada', 'neu'], REVOCADA: ['Revocada', 'neu']
};

/** «2026-10-26T11:30»: lo que pide un input datetime-local, en la hora del equipo. */
function ahoraLocal(): string {
  const d = new Date();
  return `${hoy()}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
const fechaHora = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)} ${iso.slice(11, 16)}`;

/**
 * Configuración › Inhabilitaciones: RR.HH. impide el ingreso a Cashi de un asesor durante un rango de fecha
 * y hora; el bloqueo lo hace el login. Sin sustento es un descanso y las horas quedan como no trabajadas; con
 * sustento es una licencia y cuenta como día justificado. El sustento puede llegar después, desde la fila.
 * Las vacaciones y los días «Sin asignación» salen en la lista porque también bloquean, pero se quitan en
 * su sección. Se inhabilita a un asesor, a varios de una subcartera o desde un archivo.
 */
@Component({
  selector: 'app-control-inhabilitaciones',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-[1_0_auto] flex-col' },
  imports: [LucideAngularModule, BotonDirective, ComboboxComponent, NombrePropioPipe, SegmentadoComponent, ImportarArchivoComponent, PiePaginaComponent],
  template: `
    <div #caja [class]="TABLA_CAJA">
      <table [class]="TABLA">
        <thead [class]="THEAD"><tr [class]="TR">
          <th [class]="TH">Asesor</th><th [class]="TH">Motivo</th><th [class]="TH">Desde</th><th [class]="TH">Hasta</th>
          <th [class]="TH">Sustento</th><th [class]="TH">Estado</th><th [class]="TH">Registró</th><th [class]="TH"></th>
        </tr></thead>
        <tbody>
          @for (f of pagina(); track f.origen + f.id) {
            <tr [class]="TR">
              <td [class]="TD_1"><span [class]="FUERTE">{{ f.nombre }}</span><span [class]="SEC">{{ f.usuario }}@if (f.subcartera) {, {{ f.subcartera | nombrePropio }}}</span></td>
              <td [class]="TD"><span [class]="PILL[MOTIVO[f.motivo][1]]">{{ MOTIVO[f.motivo][0] }}</span>
                @if (f.comentario) { <span [class]="SEC + ' mt-[.1875rem] max-w-[14rem] truncate'" [title]="f.comentario">{{ f.comentario }}</span> }</td>
              <td [class]="TD">{{ cuando(f, f.desde) }}</td>
              <td [class]="TD">{{ cuando(f, f.hasta, true) }}</td>
              <td [class]="TD">
                @if (f.idJustificacion) {
                  <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI + ' max-w-[11rem]'" [attr.aria-pressed]="sustentoAbierto() === f.idJustificacion" (click)="verSustento(f)" [title]="f.sustento ?? 'Ver sustento'">
                    <lucide-angular name="paperclip" [size]="14" class="flex"></lucide-angular><span class="truncate">{{ f.sustento ?? 'Ver sustento' }}</span></button>
                } @else if (f.origen === 'INHABILITACION' && f.estado !== 'REVOCADA') {
                  <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" [disabled]="guardando()" (click)="elegirSustento(f, archivoFila)">
                    <lucide-angular name="upload" [size]="16" class="flex"></lucide-angular>Adjuntar</button>
                } @else {
                  <span class="text-muted-foreground">—</span>
                }
              </td>
              <td [class]="TD"><span [class]="PILL[ESTADO[f.estado][1]] + (f.estado === 'REVOCADA' ? ' line-through' : '')">{{ ESTADO[f.estado][0] }}</span></td>
              <td [class]="TD">{{ f.registradoPor ?? '—' }}</td>
              <td [class]="TD + ' text-right!'">
                @if (f.origen === 'VACACIONES') {
                  <span class="text-[.75rem] text-muted-foreground">Se anula en Vacaciones</span>
                } @else if (f.origen === 'CALENDARIO') {
                  <span class="text-[.75rem] text-muted-foreground">Se quita en Calendario</span>
                } @else if (f.revocable && revocando() !== f.id) {
                  <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="abrirRevocar(f)">Revocar</button>
                }
              </td>
            </tr>
            @if (revocando() === f.id && f.origen === 'INHABILITACION') {
              <tr [class]="TR" data-panel><td colspan="8" class="border-0! pt-0! pr-0! pb-5! pl-[calc(.625rem+1px)]! whitespace-normal!">
                <div id="inh-rev" class="flex scroll-mb-3 flex-wrap items-end gap-x-4 gap-y-3 rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
                  <div [class]="CAMPO + ' flex-[1_1_14rem]'"><label for="ir-m" [class]="ETIQUETA">Motivo de la revocación</label>
                    <input id="ir-m" [class]="ENTRADA" [value]="motivoRevocar()" (input)="motivoRevocar.set($any($event.target).value); error.set('')"></div>
                  @if (error()) { <p class="m-0 basis-full text-[.75rem] font-medium text-(--ro)">{{ error() }}</p> }
                  <div class="flex flex-wrap items-center gap-2">
                    <button type="button" appBoton="peligro" [class]="'h-[2.375rem]! px-4! ' + BOTON_APAGADO" [disabled]="guardando()" (click)="revocar(f)">Revocar</button>
                    <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" (click)="revocando.set(null)">Cancelar</button>
                  </div>
                </div>
              </td></tr>
            }
          } @empty {
            <tr [class]="TR"><td colspan="8" [class]="TD_1 + ' text-muted-foreground!'">Nadie inhabilitado</td></tr>
          }
        </tbody>
      </table>
    </div>
    @if (filas().length) {
      <app-pie-pagina [total]="filas().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="numPagina.set($event)" />
    }
    <input #archivoFila type="file" class="hidden" accept="image/*,application/pdf" (change)="adjuntar(archivoFila)">

    @if (form()) {
      <div id="inh-form" class="mt-[.75rem] flex flex-none scroll-mb-3 flex-col gap-[.875rem] rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
        <div class="flex flex-wrap items-center gap-3">
          <span class="mr-auto text-[.875rem] font-bold text-foreground">Inhabilitar</span>
          <app-segmentado [opciones]="[{ clave: 'uno', texto: 'Un asesor' }, { clave: 'varios', texto: 'Varios de una subcartera' }, { clave: 'archivo', texto: 'Desde archivo' }]"
                          [valor]="modo()" (cambiar)="cambiarModo($any($event))" />
        </div>

        @if (modo() === 'archivo') {
          @if (importadas(); as a) {
            <div class="flex items-center gap-2">
              <lucide-angular name="file-spreadsheet" [size]="16" class="flex text-muted-foreground"></lucide-angular>
              <span class="mr-auto min-w-0 truncate text-[.8125rem] font-semibold text-foreground">{{ a.nombre }}</span>
              <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="importadas.set(null)">Cambiar archivo</button>
            </div>
            <div class="max-h-[16rem] overflow-y-auto rounded-[.625rem] border border-(--line2) px-3">
              @for (r of a.filas; track r.n) {
                <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_10.5rem] items-center gap-3 border-t border-(--line2) py-2 text-[.875rem] first:border-t-0">
                  <span class="min-w-0"><span class="block truncate text-foreground">{{ r.persona?.nombre ?? r.usuario }}</span><span [class]="SEC">{{ r.usuario }}</span></span>
                  <span class="min-w-0 text-foreground">{{ r.desde ? fechaHora(r.desde) : r.textoDesde || '—' }} – {{ r.hasta ? fechaHora(r.hasta) : r.textoHasta || '—' }}@if (r.comentario) {<span [class]="SEC + ' truncate'">{{ r.comentario }}</span>}</span>
                  <small class="text-right text-[.75rem]" [class]="r.error ? 'font-medium text-(--ro)' : 'text-(--ok)'">{{ r.error || 'Lista' }}</small>
                </div>
              }
            </div>
          } @else {
            <app-importar-archivo class="min-h-[13rem]!" columnas="Usuario, Desde, Hasta y Comentario (opcional). Cada fila es un descanso; la licencia, con su sustento, va de una en una" [conHora]="true"
                                  (leido)="leerArchivo($event)" (plantilla)="plantilla()" />
          }
        } @else {
          <div class="flex flex-wrap items-end gap-3">
            @if (modo() === 'uno') {
              <div [class]="CAMPO + ' flex-[1_1_15rem]'"><span [class]="ETIQUETA">Asesor</span>
                <app-combobox [opciones]="opcionesAsesor()" [valor]="idUsuario() ? '' + idUsuario() : null" marcador="Elige al asesor" marcadorBusqueda="Nombre o usuario"
                              alto="campo" etiquetaAria="Asesor" (cambio)="idUsuario.set(+$event); error.set('')" /></div>
              <div [class]="CAMPO + ' flex-none'"><span [class]="ETIQUETA">Motivo</span>
                <app-segmentado [opciones]="[{ clave: 'DESCANSO', texto: 'Descanso' }, { clave: 'LICENCIA', texto: 'Licencia' }]" [valor]="motivo()"
                                (cambiar)="motivo.set($any($event)); archivo.set(null); error.set('')" /></div>
            } @else {
              <div [class]="CAMPO + ' flex-[1_1_15rem]'"><label for="iv-s" [class]="ETIQUETA">Subcartera</label>
                <select id="iv-s" [class]="LISTA" (change)="elegirSubcartera(+$any($event.target).value || null)">
                  <option value="" [selected]="subcarteraVarios() === null">Elige la subcartera</option>
                  @for (s of subcarterasConGente(); track s.id) { <option [value]="s.id" [selected]="s.id === subcarteraVarios()">{{ s.nombre | nombrePropio }}, {{ s.total }} asesores</option> }
                </select></div>
            }
            <div [class]="CAMPO + ' flex-[1_0_14.5rem]'"><label for="in-d" [class]="ETIQUETA">Desde</label>
              <input id="in-d" type="datetime-local" [class]="ENTRADA" [value]="desde()" (change)="desde.set($any($event.target).value); error.set('')"></div>
            <div [class]="CAMPO + ' flex-[1_0_14.5rem]'"><label for="in-h" [class]="ETIQUETA">Hasta</label>
              <input id="in-h" type="datetime-local" [class]="ENTRADA" [min]="desde()" [value]="hasta()" (change)="hasta.set($any($event.target).value); error.set('')"></div>
          </div>
          @if (modo() === 'varios' && subcarteraVarios() !== null) {
            <div class="flex flex-col gap-[.375rem]">
              <div class="flex items-center justify-between">
                <span [class]="ETIQUETA">Asesores: {{ marcados().length }} de {{ deSubcartera().length }}</span>
                <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="marcarTodos()">{{ marcados().length === deSubcartera().length ? 'Quitar todos' : 'Marcar todos' }}</button>
              </div>
              <div class="grid max-h-[11rem] grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-x-4 overflow-y-auto rounded-[.625rem] border border-(--line2) px-3 py-1">
                @for (p of deSubcartera(); track p.idUsuario) {
                  <label class="m-0! flex cursor-pointer items-center gap-[.625rem] py-[.375rem] text-[.875rem] font-normal!">
                    <input type="checkbox" class="m-0! size-4! accent-(--verde-txt)" [checked]="!excluidos().has(p.idUsuario)" (change)="alternar(p.idUsuario)">
                    <span class="min-w-0 truncate text-foreground">{{ p.nombre }}</span><small class="text-[.75rem] text-muted-foreground">{{ p.usuario }}</small>
                  </label>
                }
              </div>
            </div>
          }
          <div class="flex flex-wrap items-end gap-3">
            @if (modo() === 'uno' && motivo() === 'LICENCIA') {
              <div [class]="CAMPO + ' flex-[1_1_14rem]'"><span [class]="ETIQUETA">Sustento</span>
                <label class="m-0! flex h-[2.375rem] cursor-pointer items-center gap-[.625rem] rounded-[.5rem] border border-dashed border-(--campo-ln) px-3 text-[.875rem] font-normal! text-(--ink2) hover:bg-muted">
                  <lucide-angular name="paperclip" [size]="16" class="flex text-muted-foreground"></lucide-angular>
                  <span class="min-w-0 truncate">{{ archivo()?.name ?? 'Adjuntar sustento' }}</span>
                  <input type="file" class="hidden" accept="image/*,application/pdf" (change)="archivo.set($any($event.target).files?.[0] ?? null); error.set('')">
                </label></div>
            }
            <div [class]="CAMPO + ' flex-[2_1_16rem]'"><label for="in-c" [class]="ETIQUETA">Comentario (opcional)</label>
              <input id="in-c" maxlength="300" [class]="ENTRADA" [value]="comentario()" (input)="comentario.set($any($event.target).value)"></div>
          </div>
          <p class="m-0 text-[.75rem] leading-[1.5] text-muted-foreground">{{ modo() === 'varios' ? 'Se registra un descanso por asesor; cada uno se revoca por separado.'
            : motivo() === 'LICENCIA' ? 'Con sustento, ese tiempo cuenta como justificado, igual que una solicitud aprobada.'
            : 'Esas horas quedan como no trabajadas. Si después llega un sustento, se adjunta desde la lista.' }}</p>
        }

        @if (error()) { <p class="m-0 text-[.75rem] font-medium text-(--ro)">{{ error() }}</p> }
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" appBoton [class]="'h-[2.375rem]! px-4! ' + BOTON_APAGADO" [disabled]="guardando() || (modo() === 'archivo' && !validas().length)" (click)="guardar()">
            <lucide-angular [name]="modo() === 'archivo' ? 'upload' : 'check'" [size]="16" class="flex"></lucide-angular>Inhabilitar</button>
          <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" (click)="form.set(false)">Cancelar</button>
          @if (modo() === 'archivo' && importadas(); as a) {
            <span class="ml-auto text-[.75rem] text-muted-foreground">{{ validas().length === 1 ? '1 por inhabilitar' : validas().length + ' por inhabilitar' }}{{ a.filas.length - validas().length ? ', ' + (a.filas.length - validas().length) + ' con error' : '' }}</span>
          }
        </div>
      </div>
    } @else {
      <div class="mt-[.75rem] flex flex-none justify-end">
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="abrirForm()">Inhabilitar asesor</button>
      </div>
    }

  `
})
export class ControlInhabilitacionesComponent implements OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly toast = inject(ToastService);

  readonly idSubcartera = input<number | null>(null);
  /** El sustento que está abierto a la derecha, para marcar su botón. */
  readonly sustentoAbierto = input<number | null>(null);
  readonly sustento = output<Inhabilitacion>();

  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly PILL = PILL;
  protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly ENTRADA = ENTRADA; protected readonly LISTA = LISTA;
  protected readonly MINI = MINI; protected readonly BOTON_SEC = BOTON_SEC; protected readonly BOTON_APAGADO = BOTON_APAGADO;
  protected readonly MOTIVO = MOTIVO; protected readonly ESTADO = ESTADO; protected readonly fechaHora = fechaHora;

  readonly filas = signal<Inhabilitacion[]>([]);
  readonly personal = signal<PersonalAsistencia[]>([]);
  readonly guardando = signal(false);
  readonly error = signal('');

  readonly form = signal(false);
  readonly modo = signal<Modo>('uno');
  readonly idUsuario = signal<number | null>(null);
  readonly motivo = signal<'DESCANSO' | 'LICENCIA'>('DESCANSO');
  readonly desde = signal('');
  readonly hasta = signal('');
  readonly comentario = signal('');
  readonly archivo = signal<File | null>(null);
  readonly subcarteraVarios = signal<number | null>(null);
  /** En «varios» van todos por defecto; aquí, los que se desmarcaron. */
  readonly excluidos = signal(new Set<number>());
  readonly importadas = signal<{ nombre: string; filas: InhabilitacionImportada[] } | null>(null);

  /** La lista llena la tarjeta y se pagina por alto; la zona que desliza es la de Configuración. */
  readonly numPagina = signal(1);
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;
  private readonly medidor = new MedidorTabla(() => ({
    zona: this.host.nativeElement.parentElement ?? undefined, caja: this.caja?.nativeElement, total: this.filas().length, amplia: false,
    clave: `${this.filas().length}|${this.form()}|${this.modo()}|${!!this.importadas()}`
  }));
  readonly porPagina = this.medidor.porPagina;
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.numPagina()), Math.max(1, Math.ceil(this.filas().length / this.porPagina()))));
  readonly pagina = computed(() => { const ini = (this.paginaActual() - 1) * this.porPagina(); return this.filas().slice(ini, ini + this.porPagina()); });

  readonly revocando = signal<number | null>(null);
  readonly motivoRevocar = signal('');
  private paraSustento: Inhabilitacion | null = null;

  /** Para la barra: cuántas están vigentes. */
  readonly vigentes = computed(() => this.filas().filter(f => f.estado === 'VIGENTE').length);
  /** Se inhabilita a quien no cesó. */
  readonly activos = computed(() => this.personal().filter(p => !p.fechaCese || p.fechaCese >= hoy()).sort((a, b) => a.nombre.localeCompare(b.nombre)));
  readonly opcionesAsesor = computed<OpcionCombobox[]>(() => this.activos().map(p => ({ valor: '' + p.idUsuario, etiqueta: p.nombre, ayuda: p.usuario })));
  readonly subcarterasConGente = computed(() => {
    const porId = new Map<number, { id: number; nombre: string; total: number }>();
    for (const p of this.activos()) {
      if (p.idSubcartera === null) continue;
      const s = porId.get(p.idSubcartera) ?? { id: p.idSubcartera, nombre: p.subcartera ?? '—', total: 0 };
      s.total++;
      porId.set(p.idSubcartera, s);
    }
    return [...porId.values()].sort((a, b) => a.nombre.localeCompare(b.nombre));
  });
  readonly deSubcartera = computed(() => this.activos().filter(p => p.idSubcartera === this.subcarteraVarios()));
  readonly marcados = computed(() => this.deSubcartera().filter(p => !this.excluidos().has(p.idUsuario)));
  readonly validas = computed(() => (this.importadas()?.filas ?? []).filter(r => !r.error));

  constructor() {
    effect(() => {
      const sub = this.idSubcartera();
      untracked(() => {
        this.cargar();
        this.servicio.personal(sub).subscribe({ next: p => this.personal.set(p), error: () => this.toast.error('No se pudo cargar el personal') });
      });
    });
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
  }

  private cargar(): void {
    this.servicio.inhabilitaciones(this.idSubcartera()).subscribe({
      next: f => this.filas.set(f),
      error: () => this.toast.error('No se pudieron cargar las inhabilitaciones')
    });
  }

  /** «26/10 11:30»; vacaciones y calendario van por día y su fin es el último día, no las 00:00 del siguiente. */
  cuando(f: Inhabilitacion, iso: string, esFin = false): string {
    const dia = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}`;
    if (f.origen === 'INHABILITACION') return fechaHora(iso);
    if (!esFin) return dia(iso);
    const d = new Date(iso.slice(0, 10) + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  abrirForm(): void {
    this.revocando.set(null);
    this.modo.set('uno');
    this.idUsuario.set(null);
    this.motivo.set('DESCANSO');
    this.desde.set(ahoraLocal());
    this.hasta.set('');
    this.comentario.set('');
    this.archivo.set(null);
    this.importadas.set(null);
    this.elegirSubcartera(this.subcarterasConGente().some(s => s.id === this.idSubcartera()) ? this.idSubcartera() : null);
    this.error.set('');
    this.form.set(true);
    this.mostrar('inh-form', 'start');
  }

  /**
   * Lo que se abre se trae a la vista: la zona puede estar desplazada. El formulario sube hasta arriba para
   * verse entero en pantallas bajas; el panel de una fila, solo lo necesario.
   */
  private mostrar(id: string, donde: ScrollLogicalPosition = 'nearest'): void {
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: donde, behavior: 'smooth' }), 50);
  }

  cambiarModo(m: Modo): void {
    this.modo.set(m);
    this.error.set('');
    if (m !== 'uno') { this.motivo.set('DESCANSO'); this.archivo.set(null); }
  }

  elegirSubcartera(id: number | null): void {
    this.subcarteraVarios.set(id);
    this.excluidos.set(new Set());
    this.error.set('');
  }

  alternar(id: number): void {
    this.excluidos.update(s => { const c = new Set(s); c.has(id) ? c.delete(id) : c.add(id); return c; });
  }

  marcarTodos(): void {
    const todos = this.marcados().length === this.deSubcartera().length;
    this.excluidos.set(todos ? new Set(this.deSubcartera().map(p => p.idUsuario)) : new Set());
  }

  guardar(): void {
    if (this.modo() === 'archivo') { this.importar(); return; }
    const desde = this.desde(), hasta = this.hasta();
    const rango = !desde || !hasta ? 'Pon la fecha y hora de inicio y de fin' : hasta <= desde ? 'El fin tiene que ser después del inicio' : '';
    if (this.modo() === 'varios') {
      const ids = this.marcados().map(p => p.idUsuario);
      const error = this.subcarteraVarios() === null ? 'Elige la subcartera' : !ids.length ? 'Marca al menos un asesor' : rango;
      this.error.set(error);
      if (error) return;
      this.guardando.set(true);
      this.servicio.inhabilitarVarios({ idsUsuarios: ids, desde, hasta, comentario: this.comentario().trim() || null }).subscribe({
        next: r => {
          this.guardando.set(false);
          this.cargar();
          if (r.registradas) this.toast.success(r.registradas === 1 ? '1 asesor inhabilitado' : `${r.registradas} asesores inhabilitados`);
          if (!r.fallidas.length) { this.form.set(false); return; }
          // Quedan marcados solo los que fallaron, para corregir y volver a intentar.
          const fallaron = new Set(r.fallidas.map(f => f.idUsuario));
          this.excluidos.set(new Set(this.deSubcartera().map(p => p.idUsuario).filter(id => !fallaron.has(id))));
          const nombre = (id: number) => this.personal().find(p => p.idUsuario === id)?.nombre ?? `#${id}`;
          this.error.set('No se pudo con: ' + r.fallidas.map(f => `${nombre(f.idUsuario)} (${f.error})`).join('; '));
        },
        error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudo inhabilitar'); }
      });
      return;
    }
    const idUsuario = this.idUsuario(), licencia = this.motivo() === 'LICENCIA';
    const error = !idUsuario ? 'Elige al asesor' : rango || (licencia && !this.archivo() ? 'La licencia necesita su sustento' : '');
    this.error.set(error);
    if (error || !idUsuario) return;
    this.guardando.set(true);
    this.servicio.inhabilitar({ idUsuario, desde, hasta, comentario: this.comentario().trim() || null, archivo: licencia ? this.archivo() : null }).subscribe({
      next: f => {
        this.guardando.set(false);
        this.form.set(false);
        this.toast.success(`${f.nombre} no podrá ingresar hasta el ${this.cuando(f, f.hasta, true)}`);
        this.cargar();
      },
      error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudo inhabilitar'); }
    });
  }

  /** Cada fila: el usuario existe y no cesó, y el rango tiene inicio y fin con hora, en orden. */
  leerArchivo(archivo: { nombre: string; filas: FilaArchivo[] }): void {
    const porUsuario = new Map(this.activos().map(p => [sinTildes(p.usuario), p]));
    const filas = archivo.filas.map((f, i): InhabilitacionImportada => {
      const usuario = String(f['usuario'] ?? '').trim(), persona = porUsuario.get(sinTildes(usuario)) ?? null;
      const textoDesde = String(f['desde'] ?? ''), textoHasta = String(f['hasta'] ?? '');
      const desde = fechaDeCelda(f['desde'] ?? '', true), hasta = fechaDeCelda(f['hasta'] ?? '', true);
      const error = !usuario ? 'Falta el usuario' : !persona ? 'Usuario no encontrado' : !desde ? 'Desde no válido' : !hasta ? 'Hasta no válido' : hasta <= desde ? 'El fin va después del inicio' : '';
      return { n: i, usuario, persona, desde, hasta, textoDesde, textoHasta, comentario: String(f['comentario'] ?? '').trim(), error };
    });
    this.error.set('');
    this.importadas.set({ nombre: archivo.nombre, filas });
  }

  plantilla(): void {
    const p = this.activos()[0]?.usuario ?? 'USUARIO';
    bajarPlantilla('Plantilla_inhabilitaciones.xlsx', 'Inhabilitaciones', [
      ['Usuario', 'Desde', 'Hasta', 'Comentario'],
      [p, '17/11/2026 08:00', '17/11/2026 13:00', 'Descanso por la mañana'],
      [p, '20/11/2026 00:00', '21/11/2026 07:30', 'Sin cartera asignada']
    ]);
  }

  /** Un descanso por fila; lo que el servidor rechaza se queda en la lista con su motivo. */
  private importar(): void {
    const a = this.importadas(), lista = this.validas();
    if (!a || !lista.length) return;
    this.guardando.set(true);
    forkJoin(lista.map(r => this.servicio.inhabilitar({ idUsuario: r.persona!.idUsuario, desde: r.desde!, hasta: r.hasta!, comentario: r.comentario || null, archivo: null })
      .pipe(map(() => ''), catchError(e => of(e?.error?.error ?? 'No se pudo')))))
      .subscribe(res => {
        this.guardando.set(false);
        this.cargar();
        const fallo = new Map(lista.map((r, i) => [r.n, res[i]]));
        const bien = res.filter(x => !x).length;
        if (bien) this.toast.success(bien === 1 ? '1 asesor inhabilitado' : `${bien} inhabilitaciones registradas`);
        const quedan = a.filas.filter(r => r.error || fallo.get(r.n)).map(r => ({ ...r, error: r.error || fallo.get(r.n)! }));
        if (!quedan.length) { this.form.set(false); return; }
        this.importadas.set({ nombre: a.nombre, filas: quedan });
        this.error.set(quedan.length === 1 ? 'Quedó 1 fila sin registrar' : `Quedaron ${quedan.length} filas sin registrar`);
      });
  }

  abrirRevocar(f: Inhabilitacion): void {
    this.motivoRevocar.set('');
    this.error.set('');
    this.revocando.set(f.id);
    this.mostrar('inh-rev');
  }

  revocar(f: Inhabilitacion): void {
    const motivo = this.motivoRevocar().trim();
    if (!motivo) { this.error.set('Escribe el motivo: queda en la Auditoría'); return; }
    this.guardando.set(true);
    this.servicio.revocarInhabilitacion(f.id, motivo).subscribe({
      next: () => { this.guardando.set(false); this.revocando.set(null); this.toast.success(`${f.nombre} ya puede ingresar`); this.cargar(); },
      error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudo revocar'); }
    });
  }

  elegirSustento(f: Inhabilitacion, entrada: HTMLInputElement): void {
    this.paraSustento = f;
    entrada.value = '';
    entrada.click();
  }

  adjuntar(entrada: HTMLInputElement): void {
    const f = this.paraSustento, archivo = entrada.files?.[0];
    if (!f || !archivo) return;
    this.guardando.set(true);
    this.servicio.adjuntarSustento(f.id, archivo).subscribe({
      next: () => { this.guardando.set(false); this.toast.success(`Sustento adjunto: ese tiempo de ${f.nombre} queda justificado`); this.cargar(); },
      error: e => { this.guardando.set(false); this.toast.error(e?.error?.error ?? 'No se pudo adjuntar el sustento'); }
    });
  }

  /** El sustento se ve en la columna de la derecha, como el certificado de una solicitud. */
  verSustento(f: Inhabilitacion): void {
    if (f.idJustificacion) this.sustento.emit(f);
  }

}
