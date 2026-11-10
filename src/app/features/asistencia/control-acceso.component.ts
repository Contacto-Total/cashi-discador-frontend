import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import * as XLSX from 'xlsx';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import { PanelAcceso, RechazoDia } from './asistencia.models';
import { SPRITE_LOGOS } from './logos-acceso';
import {
  BARRA, BARRA_ESTADO, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, CABECERA, CABECERA_TEXTO, CAMPO, SUBTITULO, TITULO, ETIQUETA, FILTROS, FUERTE, HERRAMIENTAS,
  INDICADORES, LISTA, PANTALLA, PILL, PRINCIPAL, REJILLA, REJILLA_SOLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TD_NUM, TH, TH_NUM, THEAD, TR, VACIO, ZONA
} from './ui/clases';
import { filasQueEntran } from './ui/filas-por-alto';
import { IndicadorComponent } from './ui/indicador.component';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { SegmentadoComponent } from './ui/segmentado.component';

/** Un celular o tablet en el periodo: sus días sumados, con el día y la hora del último intento. */
interface Rechazo {
  dia: string;
  hora: string;
  usuario: string | null;
  nombre: string | null;
  dispositivo: RechazoDia['dispositivo'];
  modelo: string | null;
  navegador: string | null;
  ip: string | null;
  intentos: number;
}

/** Una computadora con la que se entró en el periodo: usuario, sistema, navegador e IP. */
interface Equipo {
  dia: string;
  hora: string;
  usuario: string;
  nombre: string | null;
  sistema: string;
  navegador: string | null;
  ip: string | null;
  ingresos: number;
}

type Familia = 'Android' | 'Apple' | 'Tablet';

/** El logo de cada cosa; lo que no tiene logo propio va con un icono de línea gris. */
const LOGO: Record<string, string> = {
  Android: 'android', Apple: 'apple', iPhone: 'apple', iPad: 'apple', WINDOWS: 'windows', MAC: 'apple', LINUX: 'linux',
  Chrome: 'chrome', Safari: 'safari', Firefox: 'firefox'
};
const SISTEMA: Record<string, string> = { WINDOWS: 'Windows', MAC: 'Mac', LINUX: 'Linux', OTRO: 'Otro' };

/**
 * Control de acceso: con qué equipos se entra a Cashi. Arriba, cuatro indicadores; abajo, los celulares
 * y tablets rechazados o las computadoras permitidas, en una tabla paginada por el alto de la tarjeta.
 * El backend manda los últimos 30 días por equipo y día; el periodo, el filtro y los totales se arman aquí.
 */
@Component({
  selector: 'app-control-acceso',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent, SegmentadoComponent, PiePaginaComponent],
  template: `
    <div class="pointer-events-none absolute size-0 overflow-hidden" aria-hidden="true" [innerHTML]="sprite"></div>

    <ng-template #logo let-nombre>
      @if (logoDe(nombre); as l) {
        <svg class="size-[1.125rem] flex-none p-[.0625rem]" aria-hidden="true"><use [attr.href]="'#logo-' + l" /></svg>
      } @else {
        <span class="grid size-[1.125rem] flex-none place-items-center text-muted-foreground">
          <lucide-angular [name]="nombre === 'Tablet' ? 'tablet' : 'globe'" [size]="16" class="flex"></lucide-angular>
        </span>
      }
    </ng-template>

    <div [class]="REJILLA + ' ' + REJILLA_SOLA">
      <section appTarjeta [class]="PRINCIPAL">
        <div [class]="CABECERA">
          <div [class]="CABECERA_TEXTO">
            <p role="heading" aria-level="1" [class]="TITULO">Control de acceso</p>
            <p [class]="SUBTITULO">Equipos con los que se entra a Cashi</p>
          </div>
          <div [class]="FILTROS">
            <div [class]="CAMPO">
              <label for="ca-periodo" [class]="ETIQUETA">Periodo</label>
              <select id="ca-periodo" [class]="LISTA" (change)="periodo.set(+$any($event.target).value); pagina.set(1)">
                @for (p of PERIODOS; track p.dias) { <option [value]="p.dias" [selected]="p.dias === periodo()">{{ p.texto }}</option> }
              </select>
            </div>
            <div [class]="CAMPO">
              <label for="ca-disp" [class]="ETIQUETA">Dispositivo</label>
              <select id="ca-disp" [class]="LISTA" (change)="familia.set($any($event.target).value); pagina.set(1)">
                <option value="" [selected]="!familia()">Todos</option>
                <option value="Android" [selected]="familia() === 'Android'">Android</option>
                <option value="Apple" [selected]="familia() === 'Apple'">Apple (iPhone y iPad)</option>
                <option value="Tablet" [selected]="familia() === 'Tablet'">Tablet</option>
              </select>
            </div>
            <div [class]="CAMPO">
              <label for="ca-q" [class]="ETIQUETA">Buscar</label>
              <div [class]="BUSCAR">
                <span [class]="BUSCAR_ICONO"><lucide-angular name="search" [size]="16" class="flex"></lucide-angular></span>
                <input id="ca-q" type="search" placeholder="Usuario o IP" [class]="BUSCAR_CAMPO" [value]="busqueda()"
                       (input)="busqueda.set($any($event.target).value); pagina.set(1)">
              </div>
            </div>
          </div>
        </div>

        @if (error()) {
          <div [class]="VACIO">
            No se pudo cargar Control de acceso
            <div class="mt-[.75rem]"><button type="button" appBoton="secundario" appBotonAlto="chico" (click)="cargar()">Reintentar</button></div>
          </div>
        } @else if (cargando() && !datos()) {
          <p class="m-0 text-muted-foreground">Cargando…</p>
        } @else {
          <div [class]="INDICADORES">
            <app-indicador [valor]="equipos().length" rotulo="Equipos permitidos" [detalle]="detalleSistemas()" />
            <app-indicador [valor]="intentos()" [unidad]="intentos() === 1 ? 'intento' : 'intentos'" rotulo="Rechazados"
                           [detalle]="usuarios() === 1 ? '1 usuario con sesión' : usuarios() + ' usuarios con sesión'" />
            <app-indicador [valor]="rechazos().length" [unidad]="rechazos().length === 1 ? 'dispositivo' : 'dispositivos'" rotulo="Por dispositivo" [detalle]="detalleFamilias()" />
            <app-indicador valor="Pronto" rotulo="Acceso remoto" detalle="Equipos para trabajar desde casa" />
          </div>

          <div [class]="HERRAMIENTAS">
            <app-segmentado [opciones]="[{ clave: 'rec', texto: 'Dispositivos rechazados', n: rechazos().length }, { clave: 'ing', texto: 'Equipos permitidos', n: equipos().length }]"
                            [valor]="vista()" (cambiar)="vista.set($any($event)); pagina.set(1)" />
          </div>

          <div #zona [class]="ZONA">
            @if (!filasVista()) {
              <div [class]="VACIO">{{ vista() === 'rec' ? 'Sin rechazos en el periodo' : 'Sin resultados' }}</div>
            } @else {
              <div class="flex flex-[1_0_auto] flex-col">
                <div #caja [class]="TABLA_CAJA">
                  <table [class]="TABLA">
                    @if (vista() === 'rec') {
                      <thead [class]="THEAD"><tr [class]="TR">
                        <th [class]="TH">Último intento</th><th [class]="TH">Usuario</th><th [class]="TH">Dispositivo</th>
                        <th [class]="TH">Navegador</th><th [class]="TH">IP</th><th [class]="TH_NUM">Intentos</th>
                      </tr></thead>
                      <tbody>
                        @for (r of paginaRechazos(); track $index) {
                          <tr [class]="TR">
                            <td [class]="TD_1">{{ dm(r.dia) }}<span [class]="SEC">{{ r.hora }}</span></td>
                            <td [class]="TD"><ng-container *ngTemplateOutlet="quien; context: { $implicit: r.usuario, nombre: r.nombre }" /></td>
                            <td [class]="TD">
                              <span class="inline-flex items-center gap-2">
                                <ng-container *ngTemplateOutlet="logo; context: { $implicit: familiaDe(r) }" />
                                <span class="min-w-0">{{ tipoDe(r) }}@if (r.modelo) {<span class="ml-[.375rem] text-muted-foreground">{{ r.modelo }}</span>}</span>
                              </span>
                            </td>
                            <td [class]="TD"><ng-container *ngTemplateOutlet="navegador; context: { $implicit: r.navegador }" /></td>
                            <td [class]="TD"><ng-container *ngTemplateOutlet="ip; context: { $implicit: r.ip }" /></td>
                            <td [class]="TD_NUM">
                              <span class="inline-flex items-center gap-[.375rem] font-semibold text-foreground before:size-2 before:rounded-full before:content-['']"
                                    [class]="r.intentos >= 10 ? 'before:bg-(--ro-pt)' : r.intentos >= 3 ? 'before:bg-(--am-pt)' : 'before:bg-muted-foreground'">{{ r.intentos }}</span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    } @else {
                      <thead [class]="THEAD"><tr [class]="TR">
                        <th [class]="TH">Usuario</th><th [class]="TH">Sistema</th><th [class]="TH">Navegador</th>
                        <th [class]="TH">IP</th><th [class]="TH">Último ingreso</th><th [class]="TH_NUM">Ingresos</th>
                      </tr></thead>
                      <tbody>
                        @for (e of paginaEquipos(); track $index) {
                          <tr [class]="TR">
                            <td [class]="TD_1"><ng-container *ngTemplateOutlet="quien; context: { $implicit: e.usuario, nombre: e.nombre }" /></td>
                            <td [class]="TD">
                              <span class="inline-flex items-center gap-2">
                                <ng-container *ngTemplateOutlet="logo; context: { $implicit: e.sistema }" />{{ sistema(e.sistema) }}
                              </span>
                            </td>
                            <td [class]="TD"><ng-container *ngTemplateOutlet="navegador; context: { $implicit: e.navegador }" /></td>
                            <td [class]="TD"><ng-container *ngTemplateOutlet="ip; context: { $implicit: e.ip }" /></td>
                            <td [class]="TD">{{ dm(e.dia) }} {{ e.hora }}</td>
                            <td [class]="TD_NUM">{{ e.ingresos }}</td>
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
        }
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="BARRA_ESTADO">{{ intentos() === 1 ? '1 intento rechazado' : intentos() + ' intentos rechazados' }}, {{ usuarios() === 1 ? '1 usuario' : usuarios() + ' usuarios' }}</span>
      <button type="button" appBoton="secundario" [class]="BOTON_BARRA" disabled>
        Registrar equipo remoto <span [class]="PILL.neu">Pronto</span>
      </button>
      <button type="button" appBoton="secundario" [class]="BOTON_BARRA" (click)="excel()" [disabled]="!filasVista()">
        <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel
      </button>
    </div>

    <ng-template #quien let-usuario let-nombre="nombre">
      @if (usuario) {
        <span [class]="FUERTE">{{ nombre ?? usuario }}</span><span [class]="SEC">{{ usuario }}</span>
      } @else {
        <span [class]="SEC">Sin sesión</span>
      }
    </ng-template>
    <ng-template #navegador let-nav>
      <span class="inline-flex items-center gap-2">
        <ng-container *ngTemplateOutlet="logo; context: { $implicit: nombreNavegador(nav) }" />{{ nav === 'Samsung' ? 'Samsung Internet' : (nav ?? '—') }}
      </span>
    </ng-template>
    <ng-template #ip let-ip>
      <span class="mr-2 tabular-nums">{{ ip ?? '—' }}</span>@if (ip && ip === datos()?.ipOficina) {<span [class]="PILL.neu">Oficina</span>}
    </ng-template>
  `
})
export class ControlAccesoComponent implements OnInit, AfterViewChecked, OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  /** Contenido fijo del propio front (los logos), no datos de nadie. */
  protected readonly sprite = inject(DomSanitizer).bypassSecurityTrustHtml(SPRITE_LOGOS);

  protected readonly PERIODOS = [{ dias: 1, texto: 'Hoy' }, { dias: 7, texto: 'Últimos 7 días' }, { dias: 30, texto: 'Últimos 30 días' }];
  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly PRINCIPAL = PRINCIPAL;
  protected readonly CABECERA = CABECERA; protected readonly CABECERA_TEXTO = CABECERA_TEXTO; protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly FILTROS = FILTROS; protected readonly CAMPO = CAMPO;
  protected readonly ETIQUETA = ETIQUETA; protected readonly LISTA = LISTA; protected readonly BUSCAR = BUSCAR;
  protected readonly BUSCAR_ICONO = BUSCAR_ICONO; protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO; protected readonly INDICADORES = INDICADORES;
  protected readonly HERRAMIENTAS = HERRAMIENTAS; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TABLA = TABLA; protected readonly TH = TH; protected readonly TH_NUM = TH_NUM;
  protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly TD_NUM = TD_NUM; protected readonly SEC = SEC;
  protected readonly FUERTE = FUERTE; protected readonly PILL = PILL; protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO;
  /** Botones de la barra: 1rem a los lados; deshabilitado queda gris y sin borde, como en el artifact. */
  protected readonly BOTON_BARRA = 'px-4! disabled:opacity-100 disabled:border-transparent! disabled:bg-muted disabled:text-muted-foreground! disabled:shadow-none';

  readonly datos = signal<PanelAcceso | null>(null);
  readonly cargando = signal(false);
  readonly error = signal(false);

  readonly periodo = signal(7);
  readonly familia = signal<'' | Familia>('');
  readonly busqueda = signal('');
  readonly vista = signal<'rec' | 'ing'>('rec');
  readonly pagina = signal(1);
  readonly porPagina = signal(8);

  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;
  private observador?: ResizeObserver;
  private observada?: HTMLElement;

  ngOnInit(): void {
    this.cargar();
  }

  /** Siempre los 30 días: cambiar el periodo no vuelve a pedir nada. */
  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.servicio.controlAcceso(30).subscribe({
      next: d => { this.datos.set(d); this.cargando.set(false); },
      error: () => { this.error.set(true); this.cargando.set(false); }
    });
  }

  /** Se mide después de pintar: durante el cambio de pestaña conviven las dos tablas y la cuenta saldría corta. */
  ngAfterViewChecked(): void {
    const zona = this.zona?.nativeElement;
    if (zona !== this.observada) {
      this.observador?.disconnect();
      this.observada = zona;
      if (zona) {
        this.observador = new ResizeObserver(() => this.medirLuego());
        this.observador.observe(zona);
      }
    }
    this.medirLuego();
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    cancelAnimationFrame(this.cuadro);
  }

  private cuadro = 0;
  private medirLuego(): void {
    cancelAnimationFrame(this.cuadro);
    this.cuadro = requestAnimationFrame(() => this.ajustarFilas());
  }

  /** Las filas por página salen del alto que queda; si cambian, se repinta una vez. */
  private ajustarFilas(): void {
    const zona = this.zona?.nativeElement, caja = this.caja?.nativeElement;
    if (!zona || !caja) return;
    const n = filasQueEntran(zona, caja);
    if (n && n !== this.porPagina()) this.porPagina.set(n);
  }

  private readonly hoy = computed(() => this.datos()?.hoy ?? new Date().toISOString().slice(0, 10));
  private readonly desde = computed(() => menosDias(this.hoy(), this.periodo() - 1));
  private readonly buscado = computed(() => this.busqueda().trim().toLowerCase());

  /** Los rechazos del periodo, un renglón por equipo, del más nuevo al más viejo. */
  readonly rechazos = computed<Rechazo[]>(() => {
    const desde = this.desde(), fam = this.familia(), q = this.buscado();
    const grupos = new Map<string, Rechazo>();
    for (const r of this.datos()?.rechazos ?? []) {
      if (r.dia < desde || (fam && this.familiaDe(r) !== fam)) continue;
      if (q && ![r.usuario, r.nombre, r.ip].some(x => (x ?? '').toLowerCase().includes(q))) continue;
      const clave = [r.usuario, r.dispositivo, r.modelo, r.navegador, r.ip].join('|');
      const actual = grupos.get(clave);
      if (!actual) grupos.set(clave, { ...r, hora: r.ultimo });
      else {
        actual.intentos += r.intentos;
        if (r.dia + r.ultimo > actual.dia + actual.hora) { actual.dia = r.dia; actual.hora = r.ultimo; }
      }
    }
    return [...grupos.values()].sort((a, b) => (b.dia + b.hora).localeCompare(a.dia + a.hora));
  });

  /** Las computadoras con las que se entró en el periodo, un renglón por equipo. */
  readonly equipos = computed<Equipo[]>(() => {
    const desde = this.desde(), q = this.buscado();
    const grupos = new Map<string, Equipo>();
    for (const i of this.datos()?.ingresos ?? []) {
      if (i.dia < desde) continue;
      if (q && ![i.usuario, i.nombre, i.ip].some(x => (x ?? '').toLowerCase().includes(q))) continue;
      const clave = [i.usuario, i.sistema, i.navegador, i.ip].join('|');
      const actual = grupos.get(clave);
      if (!actual) grupos.set(clave, { dia: i.dia, hora: i.ultimo, usuario: i.usuario, nombre: i.nombre, sistema: i.sistema, navegador: i.navegador, ip: i.ip, ingresos: i.ingresos });
      else {
        actual.ingresos += i.ingresos;
        if (i.dia + i.ultimo > actual.dia + actual.hora) { actual.dia = i.dia; actual.hora = i.ultimo; }
      }
    }
    return [...grupos.values()].sort((a, b) => (b.dia + b.hora).localeCompare(a.dia + a.hora));
  });

  readonly intentos = computed(() => this.rechazos().reduce((t, r) => t + r.intentos, 0));
  readonly usuarios = computed(() => new Set(this.rechazos().filter(r => r.usuario).map(r => r.usuario)).size);
  readonly detalleSistemas = computed(() => ['WINDOWS', 'MAC', 'LINUX']
    .map(s => [SISTEMA[s], this.equipos().filter(e => e.sistema === s).length] as const)
    .filter(([, n]) => n).map(([s, n]) => `${s} ${n}`).join(', ') || 'Sin ingresos en el periodo');
  readonly detalleFamilias = computed(() => (['Android', 'Apple', 'Tablet'] as Familia[])
    .map(f => `${f} ${this.rechazos().filter(r => this.familiaDe(r) === f).length}`).join(', '));

  readonly filasVista = computed(() => this.vista() === 'rec' ? this.rechazos().length : this.equipos().length);
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.filasVista() / this.porPagina()))));
  readonly paginaRechazos = computed(() => this.cortar(this.rechazos()));
  readonly paginaEquipos = computed(() => this.cortar(this.equipos()));

  private cortar<T>(filas: T[]): T[] {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return filas.slice(ini, ini + this.porPagina());
  }

  /** iPhone e iPad van juntos como Apple; «Tablet» son las tablets Android y otras. */
  familiaDe(r: { dispositivo: string }): Familia | 'Otro' {
    return r.dispositivo === 'Android' ? 'Android' : r.dispositivo === 'iPhone' || r.dispositivo === 'iPad' ? 'Apple' : r.dispositivo === 'Tablet' ? 'Tablet' : 'Otro';
  }

  tipoDe(r: { dispositivo: string }): string {
    return r.dispositivo === 'Android' || r.dispositivo === 'iPhone' ? 'Celular' : r.dispositivo === 'iPad' || r.dispositivo === 'Tablet' ? 'Tablet' : 'Otro';
  }

  logoDe(nombre: string | null): string | null {
    return (nombre && LOGO[nombre]) || null;
  }

  nombreNavegador(nav: string | null): string | null {
    return nav ? nav.replace(/ \d+$/, '') : null;
  }

  sistema(clave: string): string {
    return SISTEMA[clave] ?? clave;
  }

  dm(iso: string): string {
    return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
  }

  /** La tabla que se ve, con todas sus filas del periodo y el filtro. */
  excel(): void {
    const filas = this.vista() === 'rec'
      ? this.rechazos().map(r => ({ 'Último intento': `${this.dm(r.dia)} ${r.hora}`, Usuario: r.usuario ?? 'Sin sesión', Nombre: r.nombre ?? '',
        Dispositivo: this.tipoDe(r), Modelo: r.modelo ?? '', Navegador: r.navegador ?? '', IP: r.ip ?? '', Intentos: r.intentos }))
      : this.equipos().map(e => ({ Usuario: e.usuario, Nombre: e.nombre ?? '', Sistema: this.sistema(e.sistema), Navegador: e.navegador ?? '',
        IP: e.ip ?? '', 'Último ingreso': `${this.dm(e.dia)} ${e.hora}`, Ingresos: e.ingresos }));
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(filas), this.vista() === 'rec' ? 'Rechazados' : 'Permitidos');
    XLSX.writeFile(libro, 'Control_de_acceso.xlsx');
  }
}

function menosDias(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
