import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaDia, AsistenciaReporte, Justificacion, TipoDia } from './asistencia.models';
import { RECUPERACION, TIPOS_DE_CALENDARIO, hoy, lunesDe, sumarDias } from './asistencia.estilos';
import { Visor } from './visor-archivo.component';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, CABECERA, CABECERA_TEXTO, CAMPO, ETIQUETA, FILTROS, FUERTE, INDICADORES, LISTA, PANTALLA, PILL,
  PRINCIPAL, REJILLA, SEC, SUBTITULO, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TITULO, TR, TonoPill, VACIO, VACIO_CHICO, ZONA
} from './ui/clases';
import { MINI, VOLVER } from './ui/ficha-clases';
import { MedidorTabla } from './ui/medidor-tabla';
import { Casilla, EXT, casillaDe, claseCasilla, diaCorto, diasDeLaSemana } from './ui/semana-celdas';
import { HorasSemanaComponent } from './ui/horas-semana.component';
import { FormularioSolicitudComponent, PersonaSolicitud } from './ui/formulario-solicitud.component';
import { IndicadorComponent } from './ui/indicador.component';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { SegmentadoComponent } from './ui/segmentado.component';
import {
  AVISO, COLUMNA, COLUMNA_TARJETA, COLUMNA_TITULO, DESLIZA, DETALLE_SUB, DIAS_LARGOS, FILA, ITEM_BOTON, ITEM_LINEA, ITEM_PILL, ITEM_TITULO,
  LISTA_FILAS
} from './ui/solicitud-clases';
import { VisorCertificadoComponent } from './ui/visor-certificado.component';
import { DetalleSolicitudComponent } from './ui/detalle-solicitud.component';
import { DecidirSolicitudComponent } from './ui/decidir-solicitud.component';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const minutosDe = (h: string | null | undefined): number => (h ? Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5)) : 0);
const hhmm = (h: string): string => h.slice(0, 5);
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

type TipoAlerta = 'marcas' | 'pausa' | 'tarde';

interface Alerta {
  idUsuario: number;
  nombre: string;
  subcartera: string;
  fecha: string;
  tipo: TipoAlerta;
  detalle: string;
  /** Lo que se pasó: minutos de pausa de más o de tardanza. */
  exceso?: number;
}

const TIPO_ALERTA: Record<TipoAlerta, [string, TonoPill]> = {
  marcas: ['Marcas sin registrar', 'am'],
  pausa: ['Exceso de pausa', 'am'],
  tarde: ['Tardanza', 'ro']
};

const ESTADO_SOLICITUD: Record<string, [string, TonoPill]> = {
  PENDIENTE: ['Por revisar', 'am'],
  REVISADA: ['Por aprobar', 'info'],
  APROBADA: ['Aprobada', 'ok'],
  RECHAZADA: ['Rechazada', 'ro']
};


/**
 * Asistencia del equipo: la vista de la supervisora.
 *
 * Lo que necesita para gestionar a su gente: las alertas para el llamado de atención (marcas sin registrar,
 * pausas más largas de lo permitido y tardanzas), la semana de cada uno y, en la columna, las solicitudes
 * que esperan su revisión. Corregir, aprobar y cerrar la semana es de RR.HH., en Control de asistencia.
 *
 * Las alertas salen del mismo reporte que ve RR.HH., de las semanas que todavía no se cierran: una y otra
 * pantalla nunca cuentan cosas distintas.
 */
@Component({
  selector: 'app-asistencia-equipo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [LucideAngularModule, TarjetaDirective, BotonDirective, NombrePropioPipe, IndicadorComponent, SegmentadoComponent, PiePaginaComponent,
            FormularioSolicitudComponent, VisorCertificadoComponent, HorasSemanaComponent, DetalleSolicitudComponent, DecidirSolicitudComponent],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)_min(calc(28cqw_-_.42rem),22rem)] @max-[48.001rem]/p5:grid-cols-[minmax(0,1fr)] @max-[48.001rem]/p5:grid-rows-[auto] @max-[48.001rem]/p5:overflow-y-auto'">
      <section appTarjeta [class]="PRINCIPAL + ' @max-[48.001rem]/p5:min-h-[32rem]'">
        <div [class]="CABECERA">
          <div [class]="CABECERA_TEXTO">
            <p role="heading" aria-level="1" [class]="TITULO">Asistencia del equipo</p>
            <p [class]="SUBTITULO">Semana del {{ rangoSemana() }}</p>
          </div>
          <div [class]="FILTROS">
            <div [class]="CAMPO">
              <label for="eq-cli" [class]="ETIQUETA">Cliente</label>
              <select id="eq-cli" [class]="LISTA" (change)="elegirCliente(+$any($event.target).value || null)">
                <option value="" [selected]="!idCliente()">Todos</option>
                @for (c of clientes(); track c.id) { <option [value]="c.id" [selected]="c.id === idCliente()">{{ nombreCliente(c) }}</option> }
              </select>
            </div>
            <div [class]="CAMPO">
              <label for="eq-car" [class]="ETIQUETA">Cartera</label>
              <select id="eq-car" [class]="LISTA" (change)="elegirCartera(+$any($event.target).value || null)">
                <option value="" [selected]="!idCartera()">Todas</option>
                @for (c of carteras(); track c.id) { <option [value]="c.id" [selected]="c.id === idCartera()">{{ c.portfolioName | nombrePropio }}</option> }
              </select>
            </div>
            <div [class]="CAMPO">
              <label for="eq-sub" [class]="ETIQUETA">Subcartera</label>
              <select id="eq-sub" [class]="LISTA" (change)="elegirSubcartera(+$any($event.target).value || null)">
                <option value="" [selected]="!idSubcartera()">Todas</option>
                @for (s of subcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === idSubcartera()">{{ s.subPortfolioName | nombrePropio }}</option> }
              </select>
            </div>
          </div>
        </div>

        <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
          <app-segmentado [opciones]="[{ clave: 'alertas', texto: 'Alertas', n: alertas().length }, { clave: 'semana', texto: 'Semana' }]"
                          [valor]="vista()" (cambiar)="vista.set($any($event)); pagina.set(1)" />
          @if (vista() === 'semana') {
            <span class="ml-auto text-[.75rem] leading-[1.5] text-muted-foreground">{{ rangoSemana() }}</span>
          }
        </div>

        <div [class]="INDICADORES + ' @max-[44.001rem]/p5:grid-cols-2'">
          <app-indicador [valor]="conAlerta().length" [unidad]="'de ' + gente().length" rotulo="Asesores con alertas" [filtra]="true" tono="ro"
                         [activo]="vista() === 'alertas' && !filtro()" (elegir)="filtrar(null)"
                         [detalle]="conAlerta().length ? 'Más alertas: ' + corto(conAlerta()[0].nombre) : 'Sin alertas'" />
          <app-indicador [valor]="cuenta('marcas')" rotulo="Marcas sin registrar" [filtra]="true" tono="am"
                         [activo]="vista() === 'alertas' && filtro() === 'marcas'" (elegir)="filtrar('marcas')"
                         [detalle]="cuenta('marcas') ? nombres('marcas') : 'Todo registrado'" />
          <app-indicador [valor]="cuenta('pausa')" rotulo="Excesos de pausa" [filtra]="true" tono="am"
                         [activo]="vista() === 'alertas' && filtro() === 'pausa'" (elegir)="filtrar('pausa')"
                         [detalle]="cuenta('pausa') ? nombres('pausa') : 'Pausas dentro del tiempo'" />
          <app-indicador [valor]="cuenta('tarde')" rotulo="Tardanzas" [filtra]="true" tono="ro"
                         [activo]="vista() === 'alertas' && filtro() === 'tarde'" (elegir)="filtrar('tarde')"
                         [detalle]="cuenta('tarde') ? nombres('tarde') : 'Todos a tiempo'" />
        </div>

        <div #zona [class]="ZONA">
          @if (cargando() && !reporte()) {
            <div [class]="VACIO">Cargando…</div>
          } @else if (!filasVista()) {
            <div [class]="VACIO">{{ vista() === 'alertas' ? 'Sin alertas' : 'Sin asesores' }}</div>
          } @else {
            <div class="flex flex-[1_0_auto] flex-col">
              <div #caja [class]="TABLA_CAJA">
                <table [class]="TABLA">
                  @if (vista() === 'alertas') {
                    <thead [class]="THEAD"><tr [class]="TR">
                      <th [class]="TH">Asesor</th><th [class]="TH">Día</th><th [class]="TH">Alerta</th><th [class]="TH">Detalle</th>
                    </tr></thead>
                    <tbody>
                      @for (a of paginaAlertas(); track $index) {
                        <tr [class]="TR">
                          <td [class]="TD_1"><span [class]="FUERTE">{{ a.nombre }}</span><span [class]="SEC">{{ a.subcartera | nombrePropio }}</span></td>
                          <td [class]="TD">{{ diaLargo(a.fecha) }}</td>
                          <td [class]="TD"><span [class]="PILL[tipoAlerta[a.tipo][1]]">{{ tipoAlerta[a.tipo][0] }}</span></td>
                          <td [class]="TD">{{ a.detalle }}
                            @if (a.exceso) { <span [class]="SEC">{{ a.tipo === 'tarde' ? enHoras(a.exceso) + ' tarde' : '+' + a.exceso + ' min' }}</span> }
                          </td>
                        </tr>
                      }
                    </tbody>
                  } @else {
                    <thead [class]="THEAD"><tr [class]="TR">
                      <th [class]="TH">Asesor</th>
                      @for (f of diasSemana(); track f) {
                        <th [class]="(f === hoyTexto ? TH_HOY : TH) + ' text-center! px-[.1875rem]!'">{{ diaCorto(f) }}</th>
                      }
                      <th [class]="TH + ' pl-6!'">Horas</th>
                    </tr></thead>
                    <tbody>
                      @for (p of paginaSemana(); track p.idUsuario) {
                        <tr [class]="TR" [style.height]="amplia() ? altoFila() + 'px' : null">
                          <td [class]="amplia() ? TD_1_AMPLIA : TD_1"><span [class]="FUERTE">{{ p.nombre }}</span><span [class]="SEC">{{ p.subcartera | nombrePropio }}{{ p.teletrabajo ? ', teletrabajo' : '' }}</span></td>
                          @for (c of p.casillas; track c.fecha) {
                            <td [class]="(amplia() ? TD_AMPLIA : TD) + ' text-center! px-[.1875rem]!'">
                              <span [class]="casillaClase(c)" [style.height]="amplia() ? 'calc(' + altoFila() + 'px - .875rem)' : null" [title]="c.titulo">
                                <span [class]="amplia() ? 'text-[.875rem] font-semibold' : 'font-medium'">{{ c.cifra }}</span>
                                @if (amplia() && c.marcas) { <small [class]="EXT + (c.estado && c.estado !== c.cifra ? '' : ' font-medium')">{{ c.marcas }}</small> }
                                @if (amplia() && c.estado && c.estado !== c.cifra) { <small [class]="EXT + ' font-medium'">{{ c.estado }}</small> }
                              </span>
                            </td>
                          }
                          <td [class]="(amplia() ? TD_AMPLIA : TD) + ' pl-6!'">
                            <app-horas-semana [trab]="p.trab" [jornada]="p.jornada" [pres]="p.pres" [rem]="p.rem" [max]="maxJornada()" />
                          </td>
                        </tr>
                      }
                    </tbody>
                  }
                </table>
              </div>
              <app-pie-pagina [total]="filasVista()" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
            </div>
          }
        </div>
      </section>

      <div [class]="COLUMNA">
        @if (formulario()) {
          <app-formulario-solicitud [tipos]="tipos()" [personas]="personas()" [diasAVista]="reporte()?.dias ?? []" [solicitudes]="solicitudes()"
                                    [enTeletrabajoDe]="teletrabajo" (cerrar)="formulario.set(false)" (listo)="alRegistrar()" />
        } @else if (abierta() && certificado() === abierta()!.id) {
          <app-visor-certificado [archivo]="visor.abierto()" [cargando]="visor.cargando()" [nombre]="abierta()!.archivoNombre || 'Certificado'"
                                 (cerrar)="cerrarCertificado()" />
        } @else if (abierta(); as s) {
          <section appTarjeta [class]="COLUMNA_TARJETA" [attr.aria-label]="'Solicitud de ' + s.nombreAgente">
            <div class="mb-[.75rem] flex items-center">
              <button type="button" [class]="VOLVER" (click)="cerrarDetalle()"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Solicitudes</button>
            </div>
            <p role="heading" aria-level="2" [class]="COLUMNA_TITULO">{{ s.nombreAgente }}</p>
            <div [class]="DESLIZA">
              <app-detalle-solicitud [solicitud]="s" [segunda]="segundaDe(s)" [aviso]="avisoTele()" (certificado)="verCertificado(s)">
                @if (s.estado === 'PENDIENTE' && !s.semanaCerrada) {
                  <app-decidir-solicitud id="eq-motivo" textoSi="Conforme" [guardando]="guardando()" [error]="errorRevision()" (si)="conforme(s, $event)" (no)="rechazar(s, $event)" />
                }
              </app-detalle-solicitud>
            </div>
          </section>
        } @else {
          <section appTarjeta [class]="COLUMNA_TARJETA" aria-label="Solicitudes">
            <p role="heading" aria-level="2" [class]="COLUMNA_TITULO">Solicitudes</p>
            <div class="mb-[.5rem] flex flex-wrap gap-[.375rem]">
              <button type="button" [class]="CHIP" [attr.aria-pressed]="lista() === 'rev'" (click)="lista.set('rev')">Por revisar <i class="text-muted-foreground not-italic">{{ porRevisar().length }}</i></button>
              <button type="button" [class]="CHIP" [attr.aria-pressed]="lista() === 'hechas'" (click)="lista.set('hechas')">Revisadas <i class="text-muted-foreground not-italic">{{ revisadas().length }}</i></button>
            </div>
            <div [class]="DESLIZA">
              <ul [class]="LISTA_FILAS">
                @for (s of listaVista(); track s.id) {
                  @let estado = estadoSolicitud(s);
                  <li [class]="FILA">
                    <button type="button" [class]="ITEM_BOTON" (click)="abrir(s)">
                      <span [class]="ITEM_TITULO">{{ s.nombreAgente }}</span>
                      <small [class]="ITEM_LINEA">{{ s.tipo }}, {{ rangoCorto(s) }}</small>
                      <span [class]="PILL[estado[1]] + ITEM_PILL">{{ estado[0] }}</span>
                    </button>
                  </li>
                }
              </ul>
              @if (!listaVista().length) { <div [class]="VACIO_CHICO">{{ lista() === 'rev' ? 'Nada por revisar' : 'Sin solicitudes revisadas' }}</div> }
            </div>
          </section>
        }
      </div>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="porRevisar().length ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ porRevisar().length === 1 ? '1 solicitud por revisar' : porRevisar().length + ' solicitudes por revisar' }}</span>
      <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" [disabled]="formulario() || !personas().length" (click)="abrirRegistro()">Registrar solicitud</button>
    </div>
  `
})
export class AsistenciaEquipoComponent implements OnInit, OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly CABECERA = CABECERA;
  protected readonly CABECERA_TEXTO = CABECERA_TEXTO; protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO;
  protected readonly FILTROS = FILTROS; protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly LISTA = LISTA;
  protected readonly INDICADORES = INDICADORES; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO; protected readonly VACIO_CHICO = VACIO_CHICO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR;
  protected readonly TH = TH; protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly SEC = SEC; protected readonly FUERTE = FUERTE;
  protected readonly PILL = PILL; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY;
  protected readonly MINI = MINI; protected readonly VOLVER = VOLVER; protected readonly COLUMNA = COLUMNA; protected readonly COLUMNA_TARJETA = COLUMNA_TARJETA;
  protected readonly COLUMNA_TITULO = COLUMNA_TITULO; protected readonly DESLIZA = DESLIZA; protected readonly LISTA_FILAS = LISTA_FILAS; protected readonly FILA = FILA;
  protected readonly ITEM_BOTON = ITEM_BOTON; protected readonly ITEM_TITULO = ITEM_TITULO; protected readonly ITEM_LINEA = ITEM_LINEA; protected readonly ITEM_PILL = ITEM_PILL;
  protected readonly DETALLE_SUB = DETALLE_SUB; protected readonly AVISO = AVISO;
  protected readonly tipoAlerta = TIPO_ALERTA;
  /** Con las filas ampliadas, las celdas pierden parte de su relleno. */
  protected readonly TD_AMPLIA = TD.replace('py-[.5625rem]!', 'py-[.375rem]!');
  protected readonly TD_1_AMPLIA = TD_1.replace('py-[.5625rem]!', 'py-[.375rem]!');
  /** La cabecera del día de hoy, en negro. */
  protected readonly TH_HOY = TH.replace('text-muted-foreground!', 'text-foreground!');
  protected readonly enHoras = enHoras;
  protected readonly hoyTexto = hoy();
  protected readonly BOTON_SEC = 'dark:bg-muted dark:hover:bg-border';
  /** Deshabilitado como en el molde: gris, sin el degradado ni la transparencia del botón común. */
  protected readonly BOTON_APAGADO = 'disabled:[background-image:none]! disabled:bg-muted! disabled:text-muted-foreground! disabled:opacity-100! disabled:border-transparent!';
  /** Datos del detalle de una solicitud: la cifra en negrita y su línea gris. */
  /** Filtro en forma de píldora: el elegido, en gris con borde. */
  protected readonly CHIP = 'inline-flex cursor-pointer items-center gap-[.375rem] rounded-full border! border-solid! border-border! bg-card px-3! py-1! [font-family:inherit] text-[.75rem] leading-[1.5] font-semibold text-(--ink2) '
    + 'transition-colors duration-150 hover:bg-muted dark:bg-muted dark:hover:bg-border aria-pressed:border-(--campo-ln)! aria-pressed:bg-sidebar-accent aria-pressed:text-foreground';
  protected readonly EXT = EXT;
  protected readonly diaCorto = diaCorto;

  // ---------- Ámbito ----------
  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);

  /** La semana en curso; el reporte trae también la anterior, que sigue abierta hasta el cierre del lunes. */
  readonly lunes = lunesDe(new Date());
  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly cargando = signal(false);
  private turnoCarga = 0;
  readonly solicitudes = signal<Justificacion[]>([]);
  readonly tipos = signal<TipoDia[]>([]);

  readonly vista = signal<'alertas' | 'semana'>('alertas');
  readonly filtro = signal<TipoAlerta | null>(null);
  readonly pagina = signal(1);
  /** Las filas por página y, con alto de sobra, el de las filas ampliadas de la semana. */
  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.caja?.nativeElement, total: this.filasVista(), amplia: this.vista() === 'semana',
    clave: `${this.vista()}|${this.filtro()}|${this.filasVista()}|${this.idCliente()}|${this.idCartera()}|${this.idSubcartera()}`
  }));
  readonly porPagina = this.medidor.porPagina;
  readonly altoFila = this.medidor.altoFila;

  // ---------- Columna ----------
  readonly lista = signal<'rev' | 'hechas'>('rev');
  readonly abierta = signal<Justificacion | null>(null);
  readonly errorRevision = signal('');
  readonly guardando = signal(false);
  readonly formulario = signal(false);
  /** La solicitud cuyo certificado se ve en la columna. */
  readonly certificado = signal<number | null>(null);
  protected readonly visor = new Visor();
  /** Lo que el teletrabajo por horas de la abierta no cubre, como lo calcula el backend. */
  readonly avisoTele = signal('');

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;

  readonly rangoSemana = computed(() => {
    const a = new Date(this.lunes + 'T00:00:00'), b = new Date(sumarDias(this.lunes, 5) + 'T00:00:00');
    return a.getMonth() === b.getMonth()
      ? `${a.getDate()} al ${b.getDate()} de ${MESES[b.getMonth()]}`
      : `${a.getDate()} de ${MESES[a.getMonth()]} al ${b.getDate()} de ${MESES[b.getMonth()]}`;
  });

  /** La gente del ámbito que trabaja esta semana. */
  readonly gente = computed(() => {
    const r = this.reporte();
    if (!r) return [];
    const estaSemana = new Set(r.dias.filter(d => d.fecha >= this.lunes).map(d => d.idUsuario));
    return r.agentes.filter(a => estaSemana.has(a.idUsuario));
  });

  /** Para quién puede registrar una solicitud: su gente, por nombre. */
  readonly personas = computed<PersonaSolicitud[]>(() =>
    [...this.gente()].sort((a, b) => a.nombreAgente.localeCompare(b.nombreAgente, 'es')).map(a => ({ idUsuario: a.idUsuario, nombre: a.nombreAgente })));

  /**
   * Lo que la supervisora tiene que mirar, de las semanas abiertas y hasta ayer: marcas de pausa sin
   * registrar, pausas pasadas de su tiempo y tardanzas sobre el límite diario.
   */
  readonly alertas = computed<Alerta[]>(() => {
    const r = this.reporte();
    if (!r) return [];
    const hoyTexto = hoy(), tolerancia = r.toleranciaDiaMin ?? 10, salida: Alerta[] = [];
    for (const d of r.dias) {
      const dia = new Date(d.fecha + 'T00:00:00').getDay();
      if (d.fecha >= hoyTexto || dia === 0 || dia === 6 || d.semanaCerrada || !d.entrada) continue;
      const base = { idUsuario: d.idUsuario, nombre: d.nombreAgente, subcartera: d.subcartera ?? '', fecha: d.fecha };
      const faltan: string[] = d.marcasFaltantes ?? [];
      for (const [prefijo, nombre] of [['ALMUERZO', 'almuerzo'], ['BREAK', 'break']] as const) {
        const ini = faltan.includes(`${prefijo}_INICIO`), fin = faltan.includes(`${prefijo}_FIN`);
        if (ini || fin) {
          salida.push({ ...base, tipo: 'marcas',
            detalle: ini && fin ? `Sin marcas de ${nombre}` : fin ? `Sin regreso del ${nombre}` : `Sin salida al ${nombre}` });
        }
      }
      if ((d.excesoAlmuerzoMin ?? 0) > 0 && d.almuerzoInicio && d.almuerzoFin) {
        salida.push({ ...base, tipo: 'pausa', detalle: `Almuerzo de ${enHoras(minutosDe(d.almuerzoFin) - minutosDe(d.almuerzoInicio))}`, exceso: d.excesoAlmuerzoMin! });
      }
      if ((d.excesoBreakMin ?? 0) > 0 && d.breakInicio && d.breakFin) {
        salida.push({ ...base, tipo: 'pausa', detalle: `Break de ${enHoras(minutosDe(d.breakFin) - minutosDe(d.breakInicio))}`, exceso: d.excesoBreakMin! });
      }
      if ((d.minutosTardanza ?? 0) > tolerancia) {
        salida.push({ ...base, tipo: 'tarde', detalle: `Entró ${hhmm(d.entrada)}`, exceso: d.minutosTardanza! });
      }
    }
    return salida.sort((a, b) => b.fecha.localeCompare(a.fecha) || a.nombre.localeCompare(b.nombre, 'es'));
  });

  cuenta(tipo: TipoAlerta): number {
    return this.alertas().filter(a => a.tipo === tipo).length;
  }

  /** Quién tiene alertas, con más alertas primero. */
  readonly conAlerta = computed(() => {
    const porPersona = new Map<number, { nombre: string; n: number }>();
    for (const a of this.alertas()) {
      const p = porPersona.get(a.idUsuario) ?? { nombre: a.nombre, n: 0 };
      p.n++;
      porPersona.set(a.idUsuario, p);
    }
    return [...porPersona.values()].sort((a, b) => b.n - a.n);
  });

  /** «Pepe, Harlington y 2 más»: los nombres de pila de quienes tienen esa alerta. */
  nombres(tipo: TipoAlerta): string {
    const n = [...new Set(this.alertas().filter(a => a.tipo === tipo).map(a => a.nombre.split(' ')[0]))];
    return n.length > 2 ? `${n.slice(0, 2).join(', ')} y ${n.length - 2} más` : n.join(' y ');
  }

  /** «Verónica V.»: el nombre y la inicial del apellido. */
  corto(nombre: string): string {
    const [a, b] = nombre.split(' ');
    return b ? `${a} ${b[0]}.` : a;
  }

  filtrar(tipo: TipoAlerta | null): void {
    this.vista.set('alertas');
    this.filtro.set(tipo && this.filtro() !== tipo ? tipo : null);
    this.pagina.set(1);
  }

  readonly alertasVistas = computed(() => {
    const f = this.filtro();
    return f ? this.alertas().filter(a => a.tipo === f) : this.alertas();
  });

  /** Lunes a viernes, y el sábado solo si alguien marcó. */
  readonly diasSemana = computed(() => diasDeLaSemana(this.lunes, this.reporte()?.dias ?? [], sumarDias));

  /** Una fila por persona: sus casillas de la semana y sus horas. */
  readonly semana = computed(() => {
    const r = this.reporte();
    if (!r) return [];
    const porDia = new Map(r.dias.map(d => [`${d.idUsuario}|${d.fecha}`, d]));
    const semanas = new Map(r.semanas.filter(s => s.lunes === this.lunes).map(s => [s.idUsuario, s]));
    return this.gente().map(a => {
      const s = semanas.get(a.idUsuario);
      return {
        idUsuario: a.idUsuario, nombre: a.nombreAgente, subcartera: a.subcartera ?? '', teletrabajo: this.teletrabajo(a.idUsuario),
        casillas: this.diasSemana().map(f => casillaDe(f, porDia.get(`${a.idUsuario}|${f}`))),
        trab: s?.minutosTrabajados ?? 0, jornada: s?.minutosJornada ?? 0, pres: s?.minutosPresenciales ?? 0, rem: s?.minutosRemotos ?? 0
      };
    });
  });
  readonly maxJornada = computed(() => Math.max(1, ...this.semana().map(p => p.jornada)));

  readonly filasVista = computed(() => this.vista() === 'alertas' ? this.alertasVistas().length : this.semana().length);
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.filasVista() / this.porPagina()))));
  readonly paginaAlertas = computed(() => this.trozo(this.alertasVistas()));
  readonly paginaSemana = computed(() => this.trozo(this.semana()));
  /** Todas las filas entran y sobra alto: la semana se muestra amplia. */
  readonly amplia = computed(() => this.vista() === 'semana' && this.altoFila() > 0);

  private trozo<T>(filas: T[]): T[] {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return filas.slice(ini, ini + this.porPagina());
  }

  // ---------- Solicitudes ----------
  private readonly deSuGente = computed(() => {
    const suyos = new Set(this.gente().map(p => p.idUsuario));
    return this.solicitudes().filter(j => suyos.has(j.idUsuario));
  });
  /** Las que puede revisar. Las de una semana cerrada no: RR.HH. cerró sin que se revisaran. */
  readonly porRevisar = computed(() => this.deSuGente().filter(j => j.estado === 'PENDIENTE' && !j.semanaCerrada));
  /** Las que revisó ella. */
  readonly revisadas = computed(() => {
    const yo = this.auth.getCurrentUser()?.id;
    return this.deSuGente().filter(j => j.estado !== 'PENDIENTE' && j.idUsuarioRevisa != null && j.idUsuarioRevisa === yo);
  });
  readonly listaVista = computed(() => this.lista() === 'rev' ? this.porRevisar() : this.revisadas());

  ngOnInit(): void {
    this.cargarClientes();
    this.servicio.tiposDeDia().subscribe({
      // La recuperación no se pide: la planifica RR.HH.
      next: t => this.tipos.set(t.filter(x => !TIPOS_DE_CALENDARIO.includes(x.codigo) && x.codigo !== RECUPERACION)),
      error: () => this.tipos.set([])
    });
    this.cargar();
    this.cargarSolicitudes();
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
    this.visor.cerrar();
  }

  // ---------- Ámbito ----------

  /** Sin filtrar por `isActive`: Financiera Oh está inactiva en QAS. */
  private cargarClientes(): void {
    this.clientesServicio.getAllTenants().subscribe({
      next: c => this.clientes.set([...c].sort((a, b) => this.nombreCliente(a).localeCompare(this.nombreCliente(b)))),
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  nombreCliente(c: Tenant): string {
    return c.tenantName || c.businessName;
  }

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.cargar();
    if (!id) return;
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const ordenadas = [...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.carteras.set(ordenadas);
        if (ordenadas.length === 1) this.elegirCartera(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    this.cargar();
    if (!id) return;
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(ordenadas);
        if (ordenadas.length === 1) this.elegirSubcartera(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.cargar();
  }

  /** La semana pasada y esta: las alertas cubren las semanas que todavía no se cierran. */
  private cargar(): void {
    const turno = ++this.turnoCarga;
    this.cargando.set(true);
    this.pagina.set(1);
    this.cerrarDetalle();
    const ambito = { idCliente: this.idCliente(), idCartera: this.idCartera(), idSubcartera: this.idSubcartera() };
    this.servicio.reporte(sumarDias(this.lunes, -7), sumarDias(this.lunes, 5), ambito).subscribe({
      next: r => {
        if (turno !== this.turnoCarga) return;
        this.reporte.set(r);
        this.cargando.set(false);
      },
      error: () => {
        if (turno !== this.turnoCarga) return;
        this.reporte.set(null);
        this.cargando.set(false);
        this.toast.error('No se pudo cargar la asistencia del equipo');
      }
    });
  }

  /** Las de los últimos tres meses y las que vienen, en el orden en que se registraron. */
  private cargarSolicitudes(): void {
    this.servicio.justificaciones(sumarDias(hoy(), -90), sumarDias(hoy(), 60)).subscribe({
      next: j => this.solicitudes.set([...j].sort((a, b) => a.id - b.id)),
      error: () => this.solicitudes.set([])
    });
  }

  // ---------- Semana ----------

  /** Si esa persona trabaja en teletrabajo: su último día de la semana lo dice. */
  protected readonly teletrabajo = (idUsuario: number | null): boolean => {
    const dias = (this.reporte()?.dias ?? []).filter(d => d.idUsuario === idUsuario && d.fecha <= hoy());
    return dias[dias.length - 1]?.origenRemoto === 'MODALIDAD';
  };

  casillaClase(c: Casilla): string {
    return claseCasilla(c, this.amplia());
  }

  diaLargo(fecha: string): string {
    return `${DIAS_LARGOS[new Date(fecha + 'T00:00:00').getDay()]} ${corta(fecha)}`;
  }

  // ---------- Revisar ----------

  abrir(s: Justificacion): void {
    this.abierta.set(s);
    this.errorRevision.set('');
    this.cerrarCertificado();
    this.avisoTele.set('');
    // El teletrabajo por horas: lo que su horario no cubre, como lo calcula el backend.
    if (s.remotoDesde && s.remotoHasta && s.oficinaDesde && s.oficinaHasta) {
      this.servicio.solicitudPrevista({ idTipoDia: s.idTipoDia, fechaDesde: s.fechaDesde, fechaHasta: s.fechaHasta, idUsuario: s.idUsuario, idSolicitud: s.id,
        oficinaDesde: hhmm(s.oficinaDesde), oficinaHasta: hhmm(s.oficinaHasta), remotoDesde: hhmm(s.remotoDesde), remotoHasta: hhmm(s.remotoHasta) }).subscribe({
        next: p => { if (this.abierta()?.id === s.id) this.avisoTele.set((p.aviso ?? '').replace('no cubres tu horario', 'no cubre su horario')); },
        error: () => { /* sin el aviso, el detalle sigue sirviendo */ }
      });
    }
  }

  cerrarDetalle(): void {
    this.abierta.set(null);
    this.cerrarCertificado();
  }

  verCertificado(s: Justificacion): void {
    this.certificado.set(s.id);
    this.visor.abrir(this.servicio.certificado(s.id, s.archivoNombre), s.archivoNombre, () => { /* el visor dice que no se pudo */ });
  }

  cerrarCertificado(): void {
    this.certificado.set(null);
    this.visor.cerrar();
  }

  conforme(s: Justificacion, motivo: string): void {
    this.decidir(s, true, motivo, 'Solicitud revisada. Pasa a RR.HH. para aprobarla');
  }

  rechazar(s: Justificacion, motivo: string): void {
    this.decidir(s, false, motivo, 'Solicitud rechazada. El asesor verá el motivo');
  }

  private decidir(s: Justificacion, aFavor: boolean, motivo: string, mensaje: string): void {
    this.guardando.set(true);
    this.errorRevision.set('');
    this.servicio.revisarJustificacion(s.id, aFavor, motivo || undefined).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarDetalle();
        this.toast.success(mensaje);
        this.cargarSolicitudes();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.errorRevision.set(respuesta?.error?.error ?? 'No se pudo guardar la revisión');
      }
    });
  }

  estadoSolicitud(s: Justificacion): [string, TonoPill] {
    return ESTADO_SOLICITUD[s.estado];
  }

  /** «09/11» o «03/11 al 05/11». */
  rangoCorto(s: Justificacion): string {
    return !s.fechaHasta || s.fechaHasta === s.fechaDesde ? corta(s.fechaDesde) : `${corta(s.fechaDesde)} al ${corta(s.fechaHasta)}`;
  }



  /** Bajo las horas: su modalidad, si es teletrabajo; si no, su horario de ese día de la semana. */
  segundaDe(s: Justificacion): string {
    if (s.tipo?.toUpperCase() === 'TELETRABAJO') {
      return this.teletrabajo(s.idUsuario) ? 'Teletrabajo' : 'Presencial';
    }
    const dia = new Date(s.fechaDesde + 'T00:00:00').getDay();
    const suyos = (this.reporte()?.dias ?? []).filter(d => d.idUsuario === s.idUsuario && d.horaEntradaHorario && d.horaSalidaHorario);
    const d = suyos.find(x => x.fecha === s.fechaDesde) ?? suyos.find(x => new Date(x.fecha + 'T00:00:00').getDay() === dia);
    return d ? `Horario ${hhmm(d.horaEntradaHorario!)} a ${hhmm(d.horaSalidaHorario!)}` : '';
  }


  // ---------- Registrar ----------

  abrirRegistro(): void {
    this.cerrarDetalle();
    this.formulario.set(true);
  }

  alRegistrar(): void {
    this.formulario.set(false);
    this.cargarSolicitudes();
    this.cargar();
  }
}
