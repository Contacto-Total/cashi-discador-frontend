import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import { AmbitoAsistencia, AsistenciaReporte, CierreSemana, Justificacion, SemanaAgente } from './asistencia.models';
import { hoy, sumarDias } from './asistencia.estilos';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BARRA_ESTADO_MAL, FUERTE, INDICADORES, PILL, PRINCIPAL, REJILLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, TonoPill, VACIO, ZONA
} from './ui/clases';
import { BOTON_APAGADO, BOTON_SEC, bajarExcel } from './ui/control-comun';
import { HorasSemanaComponent } from './ui/horas-semana.component';
import { IndicadorComponent } from './ui/indicador.component';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { Casilla, EXT, casillaDe, claseCasilla, diaCorto, diasDeLaSemana, enCurso } from './ui/semana-celdas';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;

type Filtro = '' | 'marcas' | 'sol' | 'rev' | 'fuera';

interface FilaCierre {
  idUsuario: number;
  nombre: string;
  trabajados: number;
  programados: number;
  semana: SemanaAgente | null;
  casillas: Casilla[];
  recuperado: number;
  conMarcas: boolean;
  conPorAprobar: boolean;
  conSinRevisar: boolean;
}

/**
 * Cierre semanal: lo justo para decidir si la semana de una subcartera se cierra y el resumen que se
 * congela. Bloquea lo que le toca a RR.HH. (marcas faltantes y solicitudes por aprobar); lo que la
 * supervisora no revisó y la tardanza fuera del límite no bloquean, pero quedan a la vista.
 */
@Component({
  selector: 'app-control-cierre',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent, PiePaginaComponent, HorasSemanaComponent],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)]'">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />
        @if (!ambito().idSubcartera) {
          <div [class]="ZONA"><div [class]="VACIO">Elige una subcartera en el filtro</div></div>
        } @else {
          <div [class]="INDICADORES + ' @max-[44.001rem]/p5:grid-cols-2'">
            <app-indicador [valor]="faltantes()" rotulo="Días con marcas faltantes" [filtra]="true" tono="am" [activo]="filtro() === 'marcas'" (elegir)="filtrar('marcas')">
              <span [class]="pillDe(faltantes(), true)">{{ textoDe(faltantes(), true) }}</span>
            </app-indicador>
            <app-indicador [valor]="porAprobar().length" rotulo="Solicitudes por aprobar" [filtra]="true" tono="am" [activo]="filtro() === 'sol'" (elegir)="filtrar('sol')">
              <span [class]="pillDe(porAprobar().length, true)">{{ textoDe(porAprobar().length, true) }}</span>
            </app-indicador>
            <app-indicador [valor]="sinRevisar().length" rotulo="Sin revisar por la supervisora" [filtra]="true" tono="info" [activo]="filtro() === 'rev'" (elegir)="filtrar('rev')">
              <span [class]="pillDe(sinRevisar().length, false)">{{ textoDe(sinRevisar().length, false) }}</span>
            </app-indicador>
            <app-indicador [valor]="fuera()" [unidad]="'de ' + filas().length" rotulo="Fuera del límite de tardanza" [filtra]="true" tono="ro" [activo]="filtro() === 'fuera'" (elegir)="filtrar('fuera')">
              <span [class]="pillDe(fuera(), false)">{{ textoDe(fuera(), false) }}</span>
            </app-indicador>
          </div>

          <div #zona [class]="ZONA">
            @if (cargando() && !reporte()) {
              <div [class]="VACIO">Cargando…</div>
            } @else if (!lista().length) {
              <div [class]="VACIO">{{ filtro() ? 'Nadie con ese filtro' : 'Sin asesores en la semana' }}</div>
            } @else {
              <div class="flex flex-[1_0_auto] flex-col">
                <div #caja [class]="TABLA_CAJA">
                  <table [class]="TABLA">
                    <thead [class]="THEAD"><tr [class]="TR">
                      <th [class]="TH">Asesor</th>
                      @for (f of diasSemana(); track f) {
                        <th [class]="(f === hoyTexto ? TH_HOY : TH) + ' text-center! px-[.1875rem]!'">{{ diaCorto(f) }}</th>
                      }
                      <th [class]="TH + ' pl-6!'">Horas</th><th [class]="TH + ' text-right!'">Recuperadas</th><th [class]="TH + ' text-right!'">Tardanza</th>
                    </tr></thead>
                    <tbody>
                      @for (p of paginaLista(); track p.idUsuario) {
                        @let s = p.semana;
                        <tr [class]="TR" [style.height]="amplia() ? altoFila() + 'px' : null">
                          <td [class]="amplia() ? TD_1_AMPLIA : TD_1"><span [class]="FUERTE">{{ p.nombre }}</span><span [class]="SEC">{{ p.trabajados }} de {{ p.programados }} días</span></td>
                          @for (c of p.casillas; track c.fecha) {
                            <td [class]="(amplia() ? TD_AMPLIA : TD) + ' text-center! px-[.1875rem]!'">
                              <span [class]="claseCasilla(c, amplia(), corregible(c))" [style.height]="amplia() ? 'calc(' + altoFila() + 'px - .875rem)' : null"
                                    [title]="corregible(c) ? 'Corregir las marcas del ' + corta(c.fecha) : c.titulo" (click)="corregible(c) && abrirPersona.emit(p.idUsuario)">
                                <span [class]="amplia() ? 'text-[.875rem] font-semibold' : 'font-medium'">{{ c.cifra }}</span>
                                @if (amplia() && c.marcas) { <small [class]="EXT + (c.estado && c.estado !== c.cifra ? '' : ' font-medium')">{{ c.marcas }}</small> }
                                @if (amplia() && c.estado && c.estado !== c.cifra) { <small [class]="EXT + ' font-medium'">{{ c.estado }}</small> }
                              </span>
                            </td>
                          }
                          <td [class]="(amplia() ? TD_AMPLIA : TD) + ' pl-6!'">
                            <app-horas-semana [trab]="s?.minutosTrabajados ?? 0" [jornada]="s?.minutosJornada ?? 0" [pres]="s?.minutosPresenciales ?? 0" [rem]="s?.minutosRemotos ?? 0" [max]="maxJornada()" />
                          </td>
                          <td [class]="(amplia() ? TD_AMPLIA : TD) + ' text-right!'">{{ enHoras(p.recuperado) }}</td>
                          <td [class]="(amplia() ? TD_AMPLIA : TD) + ' text-right!'">
                            <span [class]="s?.pierdeBono ? 'font-semibold text-(--ro)' : 'font-normal'">{{ enHoras(s?.minutosTardanza ?? 0) }}</span>
                            <span [class]="s?.pierdeBono ? SEC_RO : SEC">{{ limite(s) }}</span>
                          </td>
                        </tr>
                      }
                    </tbody>
                    <tfoot>
                      <tr [class]="TR">
                        <td [class]="PIE_1"><span class="font-semibold">Total</span><span [class]="SEC">{{ filas().length === 1 ? '1 persona' : filas().length + ' personas' }}</span></td>
                        @for (f of diasSemana(); track f) {
                          <td [class]="PIE + ' text-center! px-[.1875rem]!'"><span class="inline-flex min-w-[3.75rem] flex-col items-center px-[.375rem] py-[.3125rem] leading-[1.2]" [class]="amplia() ? 'text-[.875rem]' : 'text-[.8125rem]'"><span class="font-semibold">{{ f >= hoyTexto ? '—' : enHoras(sumaDia(f)) }}</span></span></td>
                        }
                        <td [class]="PIE + ' pl-6!'"><span class="font-semibold">{{ enHoras(total().trab) }}</span><span [class]="SEC">Remotas {{ enHoras(total().rem) }}</span></td>
                        <td [class]="PIE + ' text-right!'"><span class="font-semibold">{{ enHoras(total().recuperado) }}</span></td>
                        <td [class]="PIE + ' text-right!'"><span class="font-semibold">{{ enHoras(total().tardanza) }}</span></td>
                      </tr>
                    </tfoot>
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
      @if (!ambito().idSubcartera) {
        <span [class]="BARRA_ESTADO">Sin subcartera elegida</span>
      } @else if (cierre(); as c) {
        <span [class]="BARRA_ESTADO">Cerrada el {{ c.cerradoEn ? corta(c.cerradoEn.slice(0, 10)) : '—' }} por {{ c.cerradoPor ?? 'RR.HH.' }}</span>
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="excel()"><lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel</button>
      } @else if (confirmando()) {
        <span [class]="BARRA_ESTADO_HAY">Al cerrar, nadie puede corregir marcas ni resolver solicitudes de esta semana</span>
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="guardando()" (click)="confirmando.set(false)">Cancelar</button>
        <button type="button" appBoton="peligro" class="px-4!" [disabled]="guardando()" (click)="cerrar()">Confirmar cierre</button>
      } @else {
        <span [class]="error() || (!pronto() && bloqueos().length) ? BARRA_ESTADO_MAL : BARRA_ESTADO">{{ error() || estadoBarra() }}</span>
        @if (porAprobar().length && !pronto()) {
          <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="irA.emit('solicitudes')">Ver solicitudes</button>
        }
        <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" [disabled]="pronto() || bloqueos().length > 0 || cargando()" (click)="confirmando.set(true)">Cerrar la semana</button>
      }
    </div>
  `
})
export class ControlCierreComponent implements OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  readonly cabecera = input.required<TemplateRef<unknown>>();
  readonly ambito = input.required<AmbitoAsistencia>();
  readonly subcartera = input<string | null>(null);
  readonly lunes = input.required<string>();
  readonly irA = output<string>();
  /** Una casilla con marcas por completar lleva a la persona en el Reporte, donde se corrigen. */
  readonly abrirPersona = output<number>();

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly INDICADORES = INDICADORES;
  protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY; protected readonly BARRA_ESTADO_MAL = BARRA_ESTADO_MAL;
  protected readonly BOTON_SEC = BOTON_SEC; protected readonly BOTON_APAGADO = BOTON_APAGADO; protected readonly EXT = EXT;
  protected readonly TH_HOY = TH.replace('text-muted-foreground!', 'text-foreground!');
  protected readonly TD_AMPLIA = TD.replace('py-[.5625rem]!', 'py-[.375rem]!');
  protected readonly TD_1_AMPLIA = TD_1.replace('py-[.5625rem]!', 'py-[.375rem]!');
  protected readonly SEC_RO = SEC.replace('text-muted-foreground!', 'text-(--ro)!');
  /** El total va arriba de la raya: borde superior y sin el de abajo. */
  protected readonly PIE = TD.replace('border-b!', 'border-t!').replace('border-(--line2)!', 'border-border!').replace('py-[.5625rem]!', 'pt-[.625rem]! pb-[.5625rem]!')
    .replace('first:pl-[calc(.625rem+1px)]!', 'first:pl-2!').replace('last:pr-0!', 'last:pr-2!');
  protected readonly PIE_1 = this.PIE.replace('text-foreground!', 'text-[color-mix(in_srgb,var(--foreground)_80%,transparent)]!');
  protected readonly enHoras = enHoras; protected readonly corta = corta; protected readonly diaCorto = diaCorto; protected readonly claseCasilla = claseCasilla;
  protected readonly hoyTexto = hoy();

  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly solicitudes = signal<Justificacion[]>([]);
  readonly recuperado = signal<Record<number, { recuperado: number; pedido: number }>>({});
  readonly cierres = signal<CierreSemana[]>([]);
  readonly cargando = signal(false);
  readonly filtro = signal<Filtro>('');
  readonly pagina = signal(1);
  readonly confirmando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  private pedido = 0;

  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.caja?.nativeElement, total: this.lista().length, amplia: true,
    clave: `${this.filtro()}|${this.lista().length}|${this.lunes()}|${this.ambito().idSubcartera}`
  }));
  readonly porPagina = this.medidor.porPagina;
  readonly altoFila = this.medidor.altoFila;
  readonly amplia = computed(() => this.altoFila() > 0);

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;

  constructor() {
    this.cargarCierres();
    effect(() => {
      const ambito = this.ambito(), lunes = this.lunes();
      untracked(() => this.cargar(lunes, ambito));
    });
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
  }

  private cargarCierres(): void {
    this.servicio.cierres().subscribe({ next: c => this.cierres.set(c), error: () => this.cierres.set([]) });
  }

  private cargar(lunes: string, ambito: AmbitoAsistencia): void {
    const pedido = ++this.pedido;
    this.confirmando.set(false);
    this.error.set('');
    this.pagina.set(1);
    if (!ambito.idSubcartera) {
      this.reporte.set(null);
      return;
    }
    this.cargando.set(true);
    const sabado = sumarDias(lunes, 5);
    forkJoin({
      reporte: this.servicio.reporte(lunes, sabado, ambito).pipe(catchError(() => of(null))),
      solicitudes: this.servicio.justificaciones(lunes, sabado).pipe(catchError(() => of([] as Justificacion[]))),
      recuperado: this.servicio.recuperadoEnSemana(lunes, ambito.idSubcartera).pipe(catchError(() => of({} as Record<number, { recuperado: number; pedido: number }>)))
    }).subscribe(r => {
      if (pedido !== this.pedido) return;
      if (!r.reporte) this.toast.error('No se pudo cargar la semana');
      this.reporte.set(r.reporte);
      this.solicitudes.set(r.solicitudes);
      this.recuperado.set(r.recuperado);
      this.cargando.set(false);
    });
  }

  readonly diasSemana = computed(() => diasDeLaSemana(this.lunes(), this.reporte()?.dias ?? [], sumarDias));
  private readonly gente = computed(() => new Set((this.reporte()?.agentes ?? []).map(a => a.idUsuario)));
  /** Las de la semana de su gente; las de recuperar horas no son ausencias. */
  private readonly deLaSemana = computed(() => this.solicitudes().filter(j => this.gente().has(j.idUsuario) && j.minutosExtra == null));
  readonly porAprobar = computed(() => this.deLaSemana().filter(j => j.estado === 'REVISADA'));
  readonly sinRevisar = computed(() => this.deLaSemana().filter(j => j.estado === 'PENDIENTE'));

  /** Días que se trabajaron y les falta alguna marca; el de hoy, mientras está en curso, no. */
  private readonly aMedias = computed(() => (this.reporte()?.dias ?? []).filter(d =>
    d.fecha <= hoy() && d.estado !== 'FALTA' && (d.marcasFaltantes ?? []).length > 0 && !enCurso(d)));
  readonly faltantes = computed(() => this.aMedias().length);

  readonly filas = computed<FilaCierre[]>(() => {
    const r = this.reporte();
    if (!r) return [];
    const porDia = new Map(r.dias.map(d => [`${d.idUsuario}|${d.fecha}`, d]));
    const semanas = new Map(r.semanas.filter(s => s.lunes === this.lunes()).map(s => [s.idUsuario, s]));
    const conMarcas = new Set(this.aMedias().map(d => d.idUsuario));
    const conApr = new Set(this.porAprobar().map(j => j.idUsuario)), conRev = new Set(this.sinRevisar().map(j => j.idUsuario));
    return r.agentes.map(a => {
      const dias = r.dias.filter(d => d.idUsuario === a.idUsuario && d.fecha <= hoy());
      return {
        idUsuario: a.idUsuario, nombre: a.nombreAgente, semana: semanas.get(a.idUsuario) ?? null,
        trabajados: dias.filter(d => new Date(d.fecha + 'T00:00:00').getDay() !== 6 && ['PUNTUAL', 'TARDE', 'INCOMPLETO'].includes(d.estado)).length,
        programados: dias.filter(d => (d.minutosJornada ?? 0) > 0).length,
        casillas: this.diasSemana().map(f => casillaDe(f, porDia.get(`${a.idUsuario}|${f}`))),
        recuperado: this.recuperado()[a.idUsuario]?.recuperado ?? 0,
        conMarcas: conMarcas.has(a.idUsuario), conPorAprobar: conApr.has(a.idUsuario), conSinRevisar: conRev.has(a.idUsuario)
      };
    });
  });

  readonly fuera = computed(() => this.filas().filter(p => p.semana?.pierdeBono).length);

  filtrar(f: Filtro): void {
    this.filtro.set(f && this.filtro() !== f ? f : '');
    this.pagina.set(1);
  }

  readonly lista = computed(() => {
    const f = this.filtro();
    return this.filas().filter(p => !f || (f === 'marcas' ? p.conMarcas : f === 'sol' ? p.conPorAprobar : f === 'rev' ? p.conSinRevisar : !!p.semana?.pierdeBono));
  });
  readonly maxJornada = computed(() => Math.max(1, ...this.filas().map(p => p.semana?.minutosJornada ?? 0)));
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.lista().length / this.porPagina()))));
  readonly paginaLista = computed(() => {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return this.lista().slice(ini, ini + this.porPagina());
  });

  sumaDia(fecha: string): number {
    return (this.reporte()?.dias ?? []).filter(d => d.fecha === fecha).reduce((t, d) => t + (d.minutosTrabajados ?? 0), 0);
  }

  readonly total = computed(() => {
    const filas = this.filas();
    return {
      trab: filas.reduce((t, p) => t + (p.semana?.minutosTrabajados ?? 0), 0),
      rem: filas.reduce((t, p) => t + (p.semana?.minutosRemotos ?? 0), 0),
      recuperado: filas.reduce((t, p) => t + p.recuperado, 0),
      tardanza: filas.reduce((t, p) => t + (p.semana?.minutosTardanza ?? 0), 0)
    };
  });

  /** El cierre de esta semana y esta subcartera, si ya se hizo. */
  readonly cierre = computed(() => this.cierres().find(c => c.lunes === this.lunes() && (c.idSubcartera ?? null) === (this.ambito().idSubcartera ?? null)) ?? null);

  /** Se cierra desde el lunes siguiente: hasta entonces entran solicitudes y correcciones. */
  readonly pronto = computed(() => sumarDias(this.lunes(), 7) > hoy());

  readonly bloqueos = computed(() => {
    const m = this.faltantes(), a = this.porAprobar().length;
    return [m ? (m === 1 ? '1 día con marcas faltantes' : `${m} días con marcas faltantes`) : '',
            a ? (a === 1 ? '1 solicitud por aprobar' : `${a} solicitudes por aprobar`) : ''].filter(Boolean);
  });

  readonly estadoBarra = computed(() => this.pronto() ? `Se cierra desde el lunes ${corta(sumarDias(this.lunes(), 7))}`
    : this.bloqueos().length ? 'No se puede cerrar: ' + this.bloqueos().join(' y ') : 'Lista para cerrar');

  /** La píldora de cada indicador: si bloquea el cierre, si no bloquea o si ya está listo. */
  pillDe(n: number, bloquea: boolean): string {
    const tono: TonoPill = !n ? 'ok' : bloquea ? 'am' : 'neu';
    return PILL[tono] + ' self-start';
  }

  textoDe(n: number, bloquea: boolean): string {
    return !n ? 'Listo' : bloquea ? 'Bloquea el cierre' : 'No bloquea';
  }

  /** Sin cerrar, una casilla con marcas por completar lleva a corregirlas. */
  corregible(c: Casilla): boolean {
    return !this.cierre() && c.sinPausa;
  }

  limite(s: SemanaAgente | null): string {
    if (!s?.pierdeBono) return 'Dentro del límite';
    return s.superoToleranciaDiaria && s.superoToleranciaSemanal ? 'Diario y semanal' : s.superoToleranciaDiaria ? 'Diario excedido' : 'Semanal excedido';
  }

  cerrar(): void {
    this.guardando.set(true);
    this.error.set('');
    this.servicio.cerrarSemana(this.lunes(), this.ambito().idSubcartera).subscribe({
      next: () => {
        this.guardando.set(false);
        this.confirmando.set(false);
        this.toast.success(`Semana del ${corta(this.lunes())} al ${corta(sumarDias(this.lunes(), 5))} cerrada`);
        this.cargarCierres();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.confirmando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo cerrar la semana');
      }
    });
  }

  excel(): void {
    bajarExcel(this.servicio.excel(this.lunes(), sumarDias(this.lunes(), 5), this.ambito()), `Asistencia_${this.lunes()}.xlsx`,
      () => this.toast.error('No se pudo generar el Excel'));
  }
}
