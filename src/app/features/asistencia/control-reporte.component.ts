import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import { AmbitoAsistencia, AsistenciaDia, AsistenciaReporte, CierreSemana, SemanaAgente, TipoMarcacion } from './asistencia.models';
import { hoy, sumarDias } from './asistencia.estilos';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BARRA_ESTADO_MAL, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, CAMPO, ENTRADA, ETIQUETA, FUERTE, INDICADORES,
  PILL, PRINCIPAL, REJILLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, VACIO, ZONA
} from './ui/clases';
import { MINI, TR_ABRE, TR_ELEGIDA } from './ui/ficha-clases';
import { BOTON_APAGADO, BOTON_SEC, bajarExcel } from './ui/control-comun';
import { estadoDia, notaDia, tonoCinta } from './ui/dia-estado';
import { HorasSemanaComponent } from './ui/horas-semana.component';
import { IndicadorComponent } from './ui/indicador.component';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { Casilla, EXT, casillaDe, claseCasilla, diaCorto, diasDeLaSemana, enCurso } from './ui/semana-celdas';
import { AVISO, DIAS_LARGOS, INSIGNIA, enPalabras } from './ui/solicitud-clases';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
/** El campo de una marca: angosto y centrado; ámbar si se cambió. */
const MARCA = ENTRADA.replace('h-[2.375rem]!', 'h-8!').replace('px-[.625rem]!', 'px-[.375rem]!').replace('py-[.375rem]!', 'py-1!').replace('w-full', 'w-[5.5rem]') + ' text-center';
const MARCA_CAMBIADA = MARCA.replace('border-(--campo-ln)!', 'border-(--am-pt)!').replace('bg-(--campo)!', 'bg-(--am-bg)!');
const hhmm = (h: string | null | undefined): string => (h ? h.slice(0, 5) : '');

/** Las marcas de un día, en el orden en que se marcan. */
const MARCAS: { tipo: TipoMarcacion; etiqueta: string; campo: keyof AsistenciaDia }[] = [
  { tipo: 'ENTRADA', etiqueta: 'Entrada', campo: 'entrada' },
  { tipo: 'ALMUERZO_INICIO', etiqueta: 'Inicio de almuerzo', campo: 'almuerzoInicio' },
  { tipo: 'ALMUERZO_FIN', etiqueta: 'Fin de almuerzo', campo: 'almuerzoFin' },
  { tipo: 'BREAK_INICIO', etiqueta: 'Inicio de break', campo: 'breakInicio' },
  { tipo: 'BREAK_FIN', etiqueta: 'Fin de break', campo: 'breakFin' },
  { tipo: 'SALIDA', etiqueta: 'Salida', campo: 'salida' }
];

type Filtro = '' | 'fuera' | 'marcas' | 'remoto';

/** Una persona en la lista: su semana y lo que hace falta para los filtros. */
interface FilaPersona {
  idUsuario: number;
  nombre: string;
  usuario: string;
  subcartera: string;
  teletrabajo: boolean;
  semana: SemanaAgente | null;
  casillas: Casilla[];
  conMarcas: boolean;
  remoto: boolean;
}

/**
 * Reporte de Control de asistencia: la semana de cada persona del ámbito y, al abrir a alguien, sus días
 * con la corrección de marcas en la misma fila. Las correcciones se guardan juntas desde la barra de abajo,
 * cada una con el motivo de su día.
 */
@Component({
  selector: 'app-control-reporte',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, NombrePropioPipe, IndicadorComponent, PiePaginaComponent, HorasSemanaComponent],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)]'">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />

        @if (persona(); as p) {
          <!-- ===================== Una persona ===================== -->
          <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
            <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="cerrar()"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Reporte</button>
            <span class="text-[1rem] font-bold">{{ p.nombre }}</span>
            <span [class]="INSIGNIA">{{ p.subcartera | nombrePropio }}</span>
            @if (p.teletrabajo) { <span [class]="INSIGNIA">Teletrabajo</span> }
            @if (cerrada()) { <span [class]="INSIGNIA">Semana cerrada</span> }
            <div class="ml-auto flex flex-none items-center gap-[.375rem]">
              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" [disabled]="indice() <= 0" (click)="mover(-1)" aria-label="Persona anterior">
                <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
              </button>
              <span class="min-w-[9.5rem] text-center text-[.875rem] font-semibold">{{ indice() + 1 }} de {{ lista().length }}</span>
              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" [disabled]="indice() >= lista().length - 1" (click)="mover(1)" aria-label="Persona siguiente">
                <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
              </button>
            </div>
          </div>

          <div [class]="INDICADORES + ' @max-[44.001rem]/p5:grid-cols-2'">
            <app-indicador [valor]="puntualidad()" unidad="%" rotulo="Puntualidad">
              <div class="grid auto-rows-[2.25rem] grid-flow-col auto-cols-[minmax(0,1fr)] content-center gap-1">
                @for (d of cinta(); track d.fecha) {
                  <span [class]="claseCinta(d)" [title]="tituloCinta(d)"><span class="font-semibold">{{ diaCorto(d.fecha).slice(0, 2) }}</span></span>
                }
              </div>
            </app-indicador>
            <app-indicador [valor]="enHoras(p.semana?.minutosTardanza ?? 0)" rotulo="Tardanza de la semana">
              <div class="relative">
                <span class="absolute right-0 bottom-full left-0 mb-[.3125rem] block h-4 text-[.75rem] text-muted-foreground">
                  <span class="absolute top-0 -translate-x-1/2 whitespace-nowrap" [style.left]="'clamp(0%, ' + topeTardanza().t + '%, 100%)'">Tope {{ enPalabras(topeSemana()) }}</span>
                </span>
                <div class="relative h-2 rounded-full bg-(--line2)" role="img" [attr.aria-label]="'Tope ' + enPalabras(topeSemana())">
                  <i class="absolute inset-y-0 left-0 rounded-full" [class]="topeTardanza().pasa ? 'bg-(--ro-pt)' : 'bg-(--serie-a)'" [style.width.%]="topeTardanza().pct"></i>
                  <b class="absolute -inset-y-1 -ml-px w-[2px] rounded-[1px] bg-foreground" [style.left.%]="topeTardanza().t"></b>
                </div>
              </div>
            </app-indicador>
            <app-indicador [valor]="enHoras(p.semana?.minutosTrabajados ?? 0)" [unidad]="'de ' + enHoras(p.semana?.minutosJornada ?? 0)" rotulo="Horas trabajadas">
              <div class="grid grid-cols-[repeat(10,minmax(0,1fr))] gap-[3px]" role="img" [attr.aria-label]="segmentos().pct + ' %'">
                @for (s of segmentos().tramos; track $index) { <i [class]="'h-2 rounded-[2px] ' + s"></i> }
              </div>
            </app-indicador>
            <app-indicador [valor]="excesos().total ? '+' + excesos().total : '0'" unidad="min" rotulo="Exceso de pausas">
              <div class="mt-[.375rem] flex flex-wrap gap-x-[.875rem] gap-y-1 text-[.75rem] text-muted-foreground">
                <span class="inline-flex items-center gap-[.375rem]">Almuerzo <span class="font-semibold [font-variant-numeric:proportional-nums_lining-nums]">+{{ excesos().almuerzo }}</span></span>
                <span class="inline-flex items-center gap-[.375rem]">Break <span class="font-semibold [font-variant-numeric:proportional-nums_lining-nums]">+{{ excesos().break }}</span></span>
              </div>
            </app-indicador>
          </div>

          <div [class]="ZONA">
            <div [class]="TABLA_CAJA">
              <table [class]="TABLA">
                <thead [class]="THEAD"><tr [class]="TR">
                  <th [class]="TH">Día</th><th [class]="TH">Entrada</th><th [class]="TH">Almuerzo</th><th [class]="TH">Break</th><th [class]="TH">Salida</th>
                  <th [class]="TH_NUM">Tardanza</th><th [class]="TH_NUM">Mañana</th><th [class]="TH_NUM">Tarde</th><th [class]="TH_NUM">Horas</th><th [class]="TH">Estado</th>
                </tr></thead>
                <tbody>
                  @for (d of diasPersona(); track d.fecha) {
                    @let abierto = diaAbierto() === d.fecha;
                    @let e = estadoDia(d);
                    <tr [class]="TR + ' ' + TR_ABRE + (abierto ? TR_ELEGIDA : '')" (click)="abrirDia(d.fecha)" [attr.aria-expanded]="abierto">
                      <td [class]="TD_1 + (abierto ? ' border-b-transparent!' : '')"><span [class]="FUERTE">{{ nombreDia(d.fecha) }}</span><span [class]="SEC">{{ corta(d.fecha) }}</span></td>
                      <td [class]="TDA(abierto)">{{ hhmm(d.entrada) || '—' }}</td>
                      <td [class]="TDA(abierto)">{{ tramo(d.almuerzoInicio, d.almuerzoFin) }}</td>
                      <td [class]="TDA(abierto)">{{ tramo(d.breakInicio, d.breakFin) }}</td>
                      <td [class]="TDA(abierto)">{{ hhmm(d.salida) || '—' }}</td>
                      <td [class]="TDA(abierto) + ' text-right!'">{{ d.minutosTardanza ? enHoras(d.minutosTardanza) : '—' }}</td>
                      <td [class]="TDA(abierto) + ' text-right!'">{{ d.minutosManana == null ? '—' : enHoras(d.minutosManana) }}</td>
                      <td [class]="TDA(abierto) + ' text-right!'">{{ d.minutosTarde == null ? '—' : enHoras(d.minutosTarde) }}</td>
                      <td [class]="TDA(abierto) + ' text-right!'"><span [class]="FUERTE">{{ d.minutosTrabajados == null ? '—' : enHoras(d.minutosTrabajados) }}</span>
                        @if (d.minutosRemotos) { <span [class]="SEC">{{ d.minutosPresenciales ? 'Remoto ' + enHoras(d.minutosRemotos) : 'Remoto' }}</span> }
                      </td>
                      <td [class]="TDA(abierto)">
                        <span [class]="PILL[e[1]]">{{ e[0] }}</span>
                        @if (notaDia(d); as nota) { <span [class]="SEC">{{ nota }}</span> }
                        @else if (tieneCambios(d.fecha)) { <span [class]="SEC">Con cambios</span> }
                      </td>
                    </tr>
                    @if (abierto) {
                      <tr [class]="TR">
                        <td colspan="10" class="border-0! border-b! border-solid! border-(--line2)! pt-0! pr-0! pb-5! pl-[calc(.625rem+1px)]! whitespace-normal!">
                          <div class="flex flex-col gap-[.875rem] pt-2">
                            @if (diaCerrado(d.fecha)) {
                              <p class="m-0 text-[.875rem] text-muted-foreground">Semana cerrada</p>
                            } @else {
                              <div class="flex flex-col gap-[.75rem] rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
                                <div class="grid grid-cols-[repeat(6,minmax(5.5rem,auto))] items-end gap-x-3 gap-y-2">
                                  @for (m of MARCAS; track m.tipo) {
                                    <div [class]="CAMPO">
                                      <label [for]="'m-' + d.fecha + '-' + m.tipo" [class]="ETIQUETA">{{ m.etiqueta }}</label>
                                      <input [id]="'m-' + d.fecha + '-' + m.tipo" type="time" [class]="claseMarca(d.fecha, m.tipo)" [value]="valorActual(d, m.tipo)"
                                             (change)="cambiar(d, m.tipo, $any($event.target).value)">
                                    </div>
                                  }
                                </div>
                                <div [class]="CAMPO">
                                  <label [for]="'mot-' + d.fecha" [class]="ETIQUETA">Motivo de la corrección</label>
                                  <input [id]="'mot-' + d.fecha" [class]="ENTRADA" [value]="motivos()[d.fecha] ?? ''" (input)="ponerMotivo(d.fecha, $any($event.target).value)">
                                </div>
                                @if (tieneCambios(d.fecha)) {
                                  <div class="flex flex-wrap items-center gap-2">
                                    <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="revertir(d.fecha)"><lucide-angular name="undo-2" [size]="16" class="flex"></lucide-angular>Revertir</button>
                                  </div>
                                }
                              </div>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  }
                </tbody>
              </table>
            </div>
          </div>
        } @else {
          <!-- ===================== La lista ===================== -->
          <div [class]="INDICADORES + ' @max-[44.001rem]/p5:grid-cols-2'">
            <app-indicador [valor]="filas().length" rotulo="Asesores" [conDetalle]="false" [filtra]="true" tono="ok" [activo]="!filtro()" (elegir)="filtrar('')" />
            <app-indicador [valor]="cuenta('fuera')" rotulo="Fuera del límite de tardanza" [conDetalle]="false" [filtra]="true" tono="ro"
                           [activo]="filtro() === 'fuera'" (elegir)="filtrar('fuera')" />
            <app-indicador [valor]="cuenta('marcas')" rotulo="Con marcas por completar" [conDetalle]="false" [filtra]="true" tono="am"
                           [activo]="filtro() === 'marcas'" (elegir)="filtrar('marcas')" />
            <app-indicador [valor]="cuenta('remoto')" rotulo="Con horas remotas" [conDetalle]="false" [filtra]="true" tono="info"
                           [activo]="filtro() === 'remoto'" (elegir)="filtrar('remoto')" />
          </div>
          <div class="-mt-1 mb-4 flex flex-none items-center gap-3">
            <div [class]="BUSCAR + ' flex-[1_1_auto]'">
              <span [class]="BUSCAR_ICONO"><lucide-angular name="search" [size]="16" class="flex"></lucide-angular></span>
              <input [class]="BUSCAR_CAMPO" placeholder="Buscar asesor" aria-label="Buscar asesor" [value]="busqueda()" (input)="busqueda.set($any($event.target).value); pagina.set(1)">
            </div>
            <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! flex-none px-4! ' + BOTON_SEC" (click)="excel()">
              <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel
            </button>
          </div>

          <div #zona [class]="ZONA">
            @if (cargando() && !reporte()) {
              <div [class]="VACIO">Cargando…</div>
            } @else if (!lista().length) {
              <div [class]="VACIO">Sin asesores con ese filtro</div>
            } @else {
              <div class="flex flex-[1_0_auto] flex-col">
                <div #caja [class]="TABLA_CAJA">
                  <table [class]="TABLA">
                    <thead [class]="THEAD"><tr [class]="TR">
                      <th [class]="TH">Asesor</th>
                      @for (f of diasSemana(); track f) {
                        <th [class]="(f === hoyTexto ? TH_HOY : TH) + ' text-center! px-[.1875rem]!'">{{ diaCorto(f) }}</th>
                      }
                      <th [class]="TH_NUM + ' pl-6!'">Tardanza</th><th [class]="TH">Horas</th><th [class]="TH"></th>
                    </tr></thead>
                    <tbody>
                      @for (p of paginaLista(); track p.idUsuario) {
                        @let s = p.semana;
                        <tr [class]="TR + ' ' + TR_ABRE" [style.height]="amplia() ? altoFila() + 'px' : null" (click)="abrir(p.idUsuario)">
                          <td [class]="amplia() ? TD_1_AMPLIA : TD_1"><span [class]="FUERTE">{{ p.nombre }}</span><span [class]="SEC">{{ p.subcartera | nombrePropio }}{{ p.teletrabajo ? ', teletrabajo' : '' }}</span></td>
                          @for (c of p.casillas; track c.fecha) {
                            <td [class]="(amplia() ? TD_AMPLIA : TD) + ' text-center! px-[.1875rem]!'">
                              <span [class]="claseCasilla(c, amplia())" [style.height]="amplia() ? 'calc(' + altoFila() + 'px - .875rem)' : null" [title]="c.titulo">
                                <span [class]="amplia() ? 'text-[.875rem] font-semibold' : 'font-medium'">{{ c.cifra }}</span>
                                @if (amplia() && c.marcas) { <small [class]="EXT + (c.estado && c.estado !== c.cifra ? '' : ' font-medium')">{{ c.marcas }}</small> }
                                @if (amplia() && c.estado && c.estado !== c.cifra) { <small [class]="EXT + ' font-medium'">{{ c.estado }}</small> }
                              </span>
                            </td>
                          }
                          <td [class]="(amplia() ? TD_AMPLIA : TD) + ' pl-6! text-right!'">
                            <span [class]="s?.pierdeBono ? 'font-semibold text-(--ro)' : 'font-normal'">{{ enHoras(s?.minutosTardanza ?? 0) }}</span>
                            <span [class]="s?.pierdeBono ? SEC_RO : SEC">{{ limite(s) }}</span>
                          </td>
                          <td [class]="amplia() ? TD_AMPLIA : TD">
                            <app-horas-semana [trab]="s?.minutosTrabajados ?? 0" [jornada]="s?.minutosJornada ?? 0" [pres]="s?.minutosPresenciales ?? 0" [rem]="s?.minutosRemotos ?? 0" [max]="maxJornada()" />
                          </td>
                          <td [class]="(amplia() ? TD_AMPLIA : TD) + ' w-8 pr-1! text-right!'"><lucide-angular name="chevron-right" [size]="16" class="inline-flex text-muted-foreground"></lucide-angular></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                <app-pie-pagina [total]="lista().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
              </div>
            }
          </div>
        }
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      @if (persona()) {
        <span [class]="errorCambios() ? BARRA_ESTADO_MAL : cambios().length ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ errorCambios() || textoCambios() }}</span>
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC + ' ' + BOTON_APAGADO" [disabled]="!cambios().length || guardando()" (click)="descartar()">Descartar</button>
        <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" [disabled]="!cambios().length || guardando()" (click)="guardar()">
          <lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Guardar cambios
        </button>
      } @else {
        <span [class]="BARRA_ESTADO">{{ lista().length === 1 ? '1 asesor' : lista().length + ' asesores' }}</span>
      }
    </div>
  `
})
export class ControlReporteComponent implements OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  readonly cabecera = input.required<TemplateRef<unknown>>();
  readonly ambito = input.required<AmbitoAsistencia>();
  readonly subcartera = input<string | null>(null);
  readonly lunes = input.required<string>();
  /** La persona que se abre al llegar (desde el Cierre, para corregir sus marcas). */
  readonly abrirAl = input<number | null>(null);
  /** Si hay una persona abierta: el contenedor esconde las pestañas. */
  readonly detalle = output<boolean>();

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly PILL = PILL;
  protected readonly INDICADORES = INDICADORES; protected readonly BUSCAR = BUSCAR; protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO; protected readonly BUSCAR_ICONO = BUSCAR_ICONO;
  protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY; protected readonly BARRA_ESTADO_MAL = BARRA_ESTADO_MAL;
  protected readonly MINI = MINI; protected readonly TR_ABRE = TR_ABRE; protected readonly TR_ELEGIDA = TR_ELEGIDA;
  protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly ENTRADA = ENTRADA; protected readonly INSIGNIA = INSIGNIA; protected readonly AVISO = AVISO;
  protected readonly EXT = EXT; protected readonly BOTON_SEC = BOTON_SEC; protected readonly BOTON_APAGADO = BOTON_APAGADO; protected readonly MARCAS = MARCAS;
  protected readonly TH_NUM = TH + ' text-right!';
  protected readonly SEC_RO = SEC.replace('text-muted-foreground!', 'text-(--ro)!');
  protected readonly TH_HOY = TH.replace('text-muted-foreground!', 'text-foreground!');
  protected readonly TD_AMPLIA = TD.replace('py-[.5625rem]!', 'py-[.375rem]!');
  protected readonly TD_1_AMPLIA = TD_1.replace('py-[.5625rem]!', 'py-[.375rem]!');
  protected readonly enHoras = enHoras; protected readonly enPalabras = enPalabras; protected readonly corta = corta; protected readonly hhmm = hhmm;
  protected readonly diaCorto = diaCorto; protected readonly claseCasilla = claseCasilla; protected readonly estadoDia = estadoDia; protected readonly notaDia = notaDia;
  protected readonly hoyTexto = hoy();

  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly cargando = signal(false);
  readonly cierres = signal<CierreSemana[]>([]);
  readonly filtro = signal<Filtro>('');
  readonly busqueda = signal('');
  readonly pagina = signal(1);
  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.caja?.nativeElement, total: this.lista().length, amplia: true,
    clave: `${this.filtro()}|${this.busqueda()}|${this.lista().length}|${this.lunes()}|${JSON.stringify(this.ambito())}`
  }));
  readonly porPagina = this.medidor.porPagina;
  readonly altoFila = this.medidor.altoFila;
  readonly amplia = computed(() => this.altoFila() > 0);

  /** La persona abierta y el día desplegado. */
  readonly abierta = signal<number | null>(null);
  readonly diaAbierto = signal<string | null>(null);
  /** Las horas cambiadas: una por día y marca; volver al valor original no es un cambio. */
  readonly cambios = signal<{ fecha: string; tipo: TipoMarcacion; hora: string }[]>([]);
  readonly motivos = signal<Record<string, string>>({});
  readonly errorCambios = signal('');
  readonly guardando = signal(false);

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;
  private pedido = 0;

  constructor() {
    this.servicio.cierres().subscribe({ next: c => this.cierres.set(c), error: () => this.cierres.set([]) });
    effect(() => {
      const ambito = this.ambito(), lunes = this.lunes();
      untracked(() => this.cargar(lunes, ambito));
    });
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
    this.detalle.emit(false);
  }

  private cargar(lunes: string, ambito: AmbitoAsistencia): void {
    const pedido = ++this.pedido;
    this.cargando.set(true);
    this.pagina.set(1);
    this.servicio.reporte(lunes, sumarDias(lunes, 5), ambito).subscribe({
      next: r => {
        if (pedido !== this.pedido) return;
        this.reporte.set(r);
        this.cargando.set(false);
        // Con otra semana o ámbito, la persona abierta sigue si está; sus cambios no.
        this.descartar();
        const al = this.abrirAl();
        if (al && !this.abierta() && r.agentes.some(a => a.idUsuario === al)) this.abrir(al);
        else if (this.abierta() && !r.agentes.some(a => a.idUsuario === this.abierta())) this.cerrar();
      },
      error: () => {
        if (pedido !== this.pedido) return;
        this.cargando.set(false);
        this.toast.error('No se pudo cargar la asistencia');
      }
    });
  }

  // ---------- La lista ----------

  readonly diasSemana = computed(() => diasDeLaSemana(this.lunes(), this.reporte()?.dias ?? [], sumarDias));

  readonly filas = computed<FilaPersona[]>(() => {
    const r = this.reporte();
    if (!r) return [];
    const porDia = new Map(r.dias.map(d => [`${d.idUsuario}|${d.fecha}`, d]));
    const semanas = new Map(r.semanas.filter(s => s.lunes === this.lunes()).map(s => [s.idUsuario, s]));
    return r.agentes.map(a => {
      const dias = r.dias.filter(d => d.idUsuario === a.idUsuario && d.fecha <= hoy());
      const s = semanas.get(a.idUsuario) ?? null;
      const teletrabajo = dias[dias.length - 1]?.origenRemoto === 'MODALIDAD';
      return {
        idUsuario: a.idUsuario, nombre: a.nombreAgente, usuario: a.username ?? '', subcartera: a.subcartera ?? '', teletrabajo, semana: s,
        casillas: this.diasSemana().map(f => casillaDe(f, porDia.get(`${a.idUsuario}|${f}`))),
        conMarcas: dias.some(d => d.estado === 'INCOMPLETO' || ((d.marcasFaltantes ?? []).length > 0 && !!d.entrada && !enCurso(d))),
        remoto: teletrabajo || (s?.minutosRemotos ?? 0) > 0
      };
    });
  });

  cuenta(f: Filtro): number {
    return this.filas().filter(p => this.pasa(p, f)).length;
  }

  private pasa(p: FilaPersona, f: Filtro): boolean {
    return f === 'fuera' ? !!p.semana?.pierdeBono : f === 'marcas' ? p.conMarcas : f === 'remoto' ? p.remoto : true;
  }

  filtrar(f: Filtro): void {
    this.filtro.set(f && this.filtro() !== f ? f : '');
    this.pagina.set(1);
  }

  readonly lista = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    return this.filas().filter(p => this.pasa(p, this.filtro()) && (!q || `${p.nombre} ${p.usuario}`.toLowerCase().includes(q)));
  });
  readonly maxJornada = computed(() => Math.max(1, ...this.filas().map(p => p.semana?.minutosJornada ?? 0)));
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.lista().length / this.porPagina()))));
  readonly paginaLista = computed(() => {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return this.lista().slice(ini, ini + this.porPagina());
  });

  limite(s: SemanaAgente | null): string {
    if (!s?.pierdeBono) return 'Dentro del límite';
    return s.superoToleranciaDiaria && s.superoToleranciaSemanal ? 'Diario y semanal' : s.superoToleranciaDiaria ? 'Diario excedido' : 'Semanal excedido';
  }

  excel(): void {
    bajarExcel(this.servicio.excel(this.lunes(), sumarDias(this.lunes(), 5), this.ambito()), `Asistencia_${this.lunes()}.xlsx`,
      () => this.toast.error('No se pudo generar el Excel'));
  }

  // ---------- Una persona ----------

  readonly persona = computed(() => this.lista().find(p => p.idUsuario === this.abierta()) ?? this.filas().find(p => p.idUsuario === this.abierta()) ?? null);
  readonly indice = computed(() => this.lista().findIndex(p => p.idUsuario === this.abierta()));

  abrir(id: number): void {
    this.abierta.set(id);
    this.diaAbierto.set(null);
    this.descartar();
    this.detalle.emit(true);
  }

  cerrar(): void {
    this.abierta.set(null);
    this.diaAbierto.set(null);
    this.descartar();
    this.detalle.emit(false);
  }

  /** Pasar a otra persona descarta lo que no se guardó. */
  mover(paso: number): void {
    const siguiente = this.lista()[this.indice() + paso];
    if (siguiente) this.abrir(siguiente.idUsuario);
  }

  /** Sus días: de lunes a viernes hasta hoy, y el sábado si marcó. */
  readonly diasPersona = computed(() => {
    const id = this.abierta();
    return (this.reporte()?.dias ?? []).filter(d => {
      const dia = new Date(d.fecha + 'T00:00:00').getDay();
      return d.idUsuario === id && d.fecha <= hoy() && dia !== 0 && (dia !== 6 || !!d.entrada);
    });
  });

  readonly cinta = computed(() => this.diasPersona());

  /** De los días que vino, cuántos llegó a tiempo. */
  readonly puntualidad = computed(() => {
    const vino = this.diasPersona().filter(d => new Date(d.fecha + 'T00:00:00').getDay() !== 6 && ['PUNTUAL', 'TARDE', 'INCOMPLETO'].includes(d.estado));
    return vino.length ? Math.round(vino.filter(d => d.estado === 'PUNTUAL').length / vino.length * 100) : 100;
  });

  readonly topeSemana = computed(() => this.reporte()?.toleranciaSemanaMin ?? 30);
  /** La barra de tardanza: llega hasta 1.6 veces el tope, o algo más si se pasó. */
  readonly topeTardanza = computed(() => {
    const tard = this.persona()?.semana?.minutosTardanza ?? 0, tope = this.topeSemana(), max = Math.max(tope * 1.6, tard * 1.1);
    return { pct: Math.min(100, tard / max * 100), t: Math.min(100, tope / max * 100), pasa: tard > tope };
  });

  /** Diez tramos de lo trabajado contra lo previsto; en ámbar si va por debajo de lo que lleva la semana. */
  readonly segmentos = computed(() => {
    const s = this.persona()?.semana, trab = s?.minutosTrabajados ?? 0, jornada = s?.minutosJornada ?? 0;
    const hastaHoy = this.diasPersona().reduce((t, d) => t + (d.minutosJornada ?? 0), 0);
    const ok = trab >= hastaHoy * .97, llenos = jornada ? trab / jornada * 10 : 0;
    const lleno = ok ? 'bg-(--serie-a)' : 'bg-(--am-pt)';
    const medio = ok ? 'bg-[color-mix(in_oklab,var(--serie-a)_45%,var(--line2))]' : 'bg-[color-mix(in_oklab,var(--am-pt)_45%,var(--line2))]';
    return { pct: Math.round(jornada ? trab / jornada * 100 : 0),
             tramos: Array.from({ length: 10 }, (_, i) => i + 1 <= llenos ? lleno : i < llenos ? medio : 'bg-(--line2)') };
  });

  readonly excesos = computed(() => {
    const almuerzo = this.diasPersona().reduce((t, d) => t + (d.excesoAlmuerzoMin ?? 0), 0);
    const pausa = this.diasPersona().reduce((t, d) => t + (d.excesoBreakMin ?? 0), 0);
    return { almuerzo, break: pausa, total: almuerzo + pausa };
  });

  claseCinta(d: AsistenciaDia): string {
    const tono = { ok: 'border-(--ok-ln) bg-(--ok-bg) text-(--ok)', am: 'border-(--am-ln) bg-(--am-bg) text-(--am)', ro: 'border-(--ro-ln) bg-(--ro-bg) text-(--ro)',
                   info: 'border-(--info-ln) bg-(--info-bg) text-(--info)', neu: 'border-transparent bg-muted text-muted-foreground' }[tonoCinta(d)];
    return 'flex min-h-8 flex-col items-center justify-center rounded-[.375rem] border border-solid text-[.75rem] leading-[1.15] ' + tono
      + (d.fecha === hoy() ? ' shadow-[0_0_0_2px_var(--card),0_0_0_3px_var(--ring)]' : '');
  }

  tituloCinta(d: AsistenciaDia): string {
    return `${this.nombreDia(d.fecha)} ${corta(d.fecha)}: ${estadoDia(d)[0]}${d.tipoDia ? ', ' + d.tipoDia.toLowerCase() : ''}`;
  }

  /** Si ese día cae en una semana cerrada de toda la empresa o de la subcartera de la persona. */
  diaCerrado(fecha: string): boolean {
    const suya = this.persona()?.subcartera ?? null, sub = this.ambito().idSubcartera;
    return this.cierres().some(c => fecha >= c.lunes && fecha <= c.ultimoDia
      && (c.idSubcartera === null || (sub ? c.idSubcartera === sub : !!suya && c.subcartera === suya)));
  }

  readonly cerrada = computed(() => {
    const dias = this.diasPersona();
    return dias.length > 0 && dias.every(d => this.diaCerrado(d.fecha));
  });

  abrirDia(fecha: string): void {
    this.diaAbierto.set(this.diaAbierto() === fecha ? null : fecha);
  }

  // ---------- Corregir marcas ----------

  private valorDe(d: AsistenciaDia, tipo: TipoMarcacion): string {
    const campo = MARCAS.find(m => m.tipo === tipo)!.campo;
    return hhmm(d[campo] as string | null);
  }

  valorActual(d: AsistenciaDia, tipo: TipoMarcacion): string {
    return this.cambios().find(c => c.fecha === d.fecha && c.tipo === tipo)?.hora ?? this.valorDe(d, tipo);
  }

  claseMarca(fecha: string, tipo: TipoMarcacion): string {
    const tocada = this.cambios().some(c => c.fecha === fecha && c.tipo === tipo);
    return tocada ? MARCA_CAMBIADA : MARCA;
  }

  tieneCambios(fecha: string): boolean {
    return this.cambios().some(c => c.fecha === fecha);
  }

  cambiar(d: AsistenciaDia, tipo: TipoMarcacion, hora: string): void {
    const original = this.valorDe(d, tipo);
    this.errorCambios.set('');
    this.cambios.update(lista => {
      const resto = lista.filter(c => !(c.fecha === d.fecha && c.tipo === tipo));
      return !hora || hora === original ? resto : [...resto, { fecha: d.fecha, tipo, hora }];
    });
  }

  ponerMotivo(fecha: string, texto: string): void {
    this.motivos.update(m => ({ ...m, [fecha]: texto }));
    this.errorCambios.set('');
  }

  revertir(fecha: string): void {
    this.cambios.update(lista => lista.filter(c => c.fecha !== fecha));
    this.motivos.update(m => { const copia = { ...m }; delete copia[fecha]; return copia; });
    this.errorCambios.set('');
  }

  descartar(): void {
    this.cambios.set([]);
    this.motivos.set({});
    this.errorCambios.set('');
  }

  textoCambios(): string {
    const n = this.cambios().length;
    return n ? (n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`) : 'Sin cambios';
  }

  /** Una corrección por cada hora cambiada: cada marca es una fila propia en el backend, con su motivo. */
  guardar(): void {
    const id = this.abierta();
    if (!id) return;
    const sinMotivo = [...new Set(this.cambios().map(c => c.fecha))].filter(f => !(this.motivos()[f] ?? '').trim());
    if (sinMotivo.length) {
      this.errorCambios.set(sinMotivo.length === 1 ? `Falta el motivo del ${corta(sinMotivo[0])}` : `Faltan los motivos de: ${sinMotivo.map(corta).join(', ')}`);
      return;
    }
    this.guardando.set(true);
    let pendientes = this.cambios().length, fallo = false;
    for (const c of this.cambios()) {
      this.servicio.completarMarcacion({ idUsuario: id, fecha: c.fecha, tipo: c.tipo, hora: `${c.hora}:00`, motivo: this.motivos()[c.fecha].trim() }).subscribe({
        next: () => this.alTerminar(--pendientes, fallo),
        error: () => { fallo = true; this.alTerminar(--pendientes, fallo); }
      });
    }
  }

  private alTerminar(pendientes: number, fallo: boolean): void {
    if (pendientes > 0) return;
    this.guardando.set(false);
    if (fallo) {
      this.toast.error('Alguna corrección no se pudo guardar');
      return;
    }
    this.toast.success('Marcas corregidas');
    this.cargar(this.lunes(), this.ambito());
  }

  // ---------- Apoyo ----------

  TDA(abierto: boolean): string {
    return TD + (abierto ? ' border-b-transparent!' : '');
  }

  tramo(inicio: string | null, fin: string | null): string {
    return inicio || fin ? `${hhmm(inicio) || '—'} – ${hhmm(fin) || '—'}` : '—';
  }

  nombreDia(fecha: string): string {
    return DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()];
  }
}
