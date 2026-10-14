import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import {
  ColumnaReporte,
  ConsultaReporte,
  DatosReporte,
  Entregable,
  EntregablesReportService
} from './entregables-report.service';
import { FiltroSubcarteraComponent, SeleccionSubcartera } from './filtro-subcartera.component';
import { EUI, EUI_ANIM, euiAviso, euiSegmento } from './entregables-ui';
import {
  MESES, TEXTO_PERIODO, aIso, deIso, diaCorto, dmy, fechaDelNombre, horaTexto, hoyLocal, inicioDeMes,
  nombreDia, normalizar, proximaFecha, rangoProgramado, resolverPatron, resumenRepeticion, sumarDias, tocaEn
} from './entregables.util';

type Modo = 'PROG' | 'EXTRA';

interface ItemLista {
  e: Entregable;
  linea: string;
  toca: boolean;
  proxima: Date | null;
}

interface PeriodoVista {
  extra: boolean;
  desde: Date | null;
  hasta: Date | null;
  regla: string;
  /** Desde posterior a Hasta: no se consulta. */
  invalido: boolean;
}

interface ColumnaVista {
  nombre: string;
  tipo: ColumnaReporte['tipo'];
  porcentaje: boolean;
  alineacion: string;
}

/** Filas que se dibujan en la vista previa; el Excel lleva todas. */
const MAX_FILAS = 500;

/**
 * Reportes entregables de una subcartera: qué toca hoy, con qué periodo sale cada uno y con
 * qué nombre de archivo y asunto se envía. La programación y los nombres se cambian en la
 * pantalla de mantenimiento; aquí solo se consulta y se descarga.
 */
@Component({
  selector: 'app-entregables-report',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, FiltroSubcarteraComponent],
  styles: [EUI_ANIM],
  template: `
    <div [class]="ui.raiz">

      <!-- ============ Cabecera ============ -->
      <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div class="min-w-0">
          <h1 [class]="ui.titulo">Reportes entregables</h1>
          <p [class]="ui.subtitulo">{{ subtitulo() }}</p>
        </div>
        <a routerLink="/admin/maintenance/entregables-reporte" [class]="ui.secundario">
          <lucide-angular name="sliders-horizontal" [size]="15"></lucide-angular>
          Mantenimiento
        </a>
      </div>

      <div class="mb-4">
        <app-filtro-subcartera (seleccion)="onSeleccion($event)"></app-filtro-subcartera>
      </div>

      @if (!seleccion()?.idSubcartera) {
        <div [class]="ui.vacio">
          <lucide-angular name="file-spreadsheet" [size]="36" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
          Elige proveedor, cartera y subcartera para ver sus entregables.
        </div>
      } @else if (cargandoLista()) {
        <div class="flex flex-wrap items-start gap-4" aria-hidden="true">
          <div class="h-[420px] flex-[1_1_320px] animate-pulse rounded-xl bg-[#e9edf2] motion-reduce:animate-none dark:bg-slate-800"></div>
          <div class="h-[420px] flex-[999_1_560px] animate-pulse rounded-xl bg-[#e9edf2] motion-reduce:animate-none dark:bg-slate-800"></div>
        </div>
      } @else if (entregables().length === 0) {
        <div [class]="ui.vacio">
          <lucide-angular name="inbox" [size]="36" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
          <p class="!m-0 font-bold text-[#334155] dark:text-slate-200">{{ seleccion()?.subcartera }} no tiene entregables activos.</p>
          <p class="mt-1">Se registran en Mantenimiento, sobre las consultas que tenga la subcartera.</p>
        </div>
      } @else {
        <div class="flex flex-wrap items-start gap-4">

          <!-- ============ Lista ============ -->
          <div [class]="ui.tarjeta + ' eui-sube flex min-w-0 flex-[1_1_320px] flex-col gap-1.5 p-3'">
            <div class="flex items-center justify-between gap-2 px-1 pt-0.5">
              <span class="text-[11px] font-bold uppercase tracking-[0.05em] text-[#1d4ed8] dark:text-blue-300">Toca hoy</span>
              <span class="text-[11px] font-bold tabular-nums text-[#5f6c80]">{{ listaHoy().length }}</span>
            </div>
            @if (listaHoy().length === 0) {
              <p class="!m-0 rounded-[10px] border border-dashed border-[#d5dbe3] px-3 py-2.5 text-[12px] text-[#5f6c80] dark:border-slate-700">
                Hoy no toca ninguno según la programación.
              </p>
            }
            @for (it of listaHoy(); track it.e.id) {
              <ng-container *ngTemplateOutlet="item; context: { $implicit: it }"></ng-container>
            }

            @if (listaOtros().length > 0) {
              <div class="mt-2 flex items-center justify-between gap-2 px-1 pt-0.5">
                <span [class]="ui.label">Otros días</span>
                <span class="text-[11px] font-bold tabular-nums text-[#5f6c80]">{{ listaOtros().length }}</span>
              </div>
              @for (it of listaOtros(); track it.e.id) {
                <ng-container *ngTemplateOutlet="item; context: { $implicit: it }"></ng-container>
              }
            }

            @if (listaPedido().length > 0) {
              <div class="mt-2 flex items-center justify-between gap-2 px-1 pt-0.5">
                <span [class]="ui.label">A pedido</span>
                <span class="text-[11px] font-bold tabular-nums text-[#5f6c80]">{{ listaPedido().length }}</span>
              </div>
              @for (it of listaPedido(); track it.e.id) {
                <ng-container *ngTemplateOutlet="item; context: { $implicit: it }"></ng-container>
              }
            }
          </div>

          <!-- ============ Entregable elegido ============ -->
          @if (sel(); as e) {
            <div class="flex min-w-0 flex-[999_1_560px] flex-col gap-3">

              <div [class]="ui.tarjeta + ' eui-sube flex flex-col gap-3.5 px-[18px] py-4'" [style.--i]="1">

                <div class="flex flex-wrap items-start justify-between gap-2.5">
                  <div class="min-w-0">
                    <h2 class="!m-0 text-[17px] font-extrabold tracking-[-0.015em]">{{ e.nombre }}</h2>
                    <p [class]="ui.subtitulo">{{ consultaSel()?.descripcion }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <span [class]="ui.label">Consulta</span>
                    <span [class]="ui.codigoOscuro">{{ consultaSel()?.codigo }}</span>
                  </div>
                </div>

                <div class="flex flex-wrap items-stretch gap-3">

                  <!-- Programación: solo lectura -->
                  <div [class]="ui.bloque + ' flex-[1_1_380px]'">
                    <span [class]="ui.label">Programación</span>
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="text-[16px] font-extrabold tracking-[-0.01em]">{{ programacion().resumen }}</span>
                      @if (programacion().toca) {
                        <span [class]="ui.pildora + ' bg-[#e8f0fe] text-[#1d4ed8] dark:bg-blue-950/50 dark:text-blue-300'">Toca hoy</span>
                      }
                    </div>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ programacion().detalle }}</span>
                    <a routerLink="/admin/maintenance/entregables-reporte" [queryParams]="{ editar: e.id }"
                       [class]="ui.chico + ' w-fit'">
                      <lucide-angular name="pencil" [size]="14"></lucide-angular>
                      Cambiar en Mantenimiento
                    </a>
                  </div>

                  <!-- Periodo -->
                  <div [class]="ui.bloque + ' flex-[1_1_380px]'">
                    <span [class]="ui.label">Periodo</span>

                    <div [class]="ui.segmentos">
                      <button type="button" (click)="cambiarModo('PROG')" [attr.aria-pressed]="!periodo().extra"
                              [class]="segmento(!periodo().extra)">Programado</button>
                      <button type="button" (click)="cambiarModo('EXTRA')" [attr.aria-pressed]="periodo().extra"
                              [disabled]="consultaSel()?.tipoPeriodo === 'SIN'"
                              [class]="segmento(periodo().extra)">Pedido extra</button>
                    </div>

                    @if (!periodo().extra) {
                      <span class="text-[13px] font-semibold leading-[1.45] text-[#334155] dark:text-slate-300">{{ periodo().regla }}</span>
                    } @else if (consultaSel()?.tipoPeriodo === 'DIA') {
                      <div class="eui-entra flex flex-wrap items-end gap-2">
                        <div class="flex flex-col gap-1.5">
                          <label for="er-dia" [class]="ui.campo">Día</label>
                          <input id="er-dia" type="date" [ngModel]="isoHasta()" (ngModelChange)="fijarFechas(null, $event)" [class]="ui.input"/>
                        </div>
                        <button type="button" (click)="atajo('hoy')" [class]="ui.secundario">Hoy</button>
                        <button type="button" (click)="atajo('manana')" [class]="ui.secundario">Mañana</button>
                      </div>
                    } @else {
                      <div class="eui-entra flex flex-col gap-2">
                        <div class="flex flex-wrap items-end gap-2">
                          <div class="flex flex-col gap-1.5">
                            <label for="er-desde" [class]="ui.campo">Desde</label>
                            <input id="er-desde" type="date" [ngModel]="isoDesde()" (ngModelChange)="fijarFechas($event, null)" [class]="ui.input"/>
                          </div>
                          <div class="flex flex-col gap-1.5">
                            <label for="er-hasta" [class]="ui.campo">Hasta</label>
                            <input id="er-hasta" type="date" [ngModel]="isoHasta()" (ngModelChange)="fijarFechas(null, $event)" [class]="ui.input"/>
                          </div>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                          <button type="button" (click)="atajo('ayer')" [class]="ui.chico">Ayer</button>
                          <button type="button" (click)="atajo('semana')" [class]="ui.chico">Esta semana</button>
                          <button type="button" (click)="atajo('mes')" [class]="ui.chico">Mes en curso</button>
                          <button type="button" (click)="atajo('mesAnterior')" [class]="ui.chico">Mes anterior</button>
                        </div>
                      </div>
                    }

                    <div class="mt-auto flex flex-wrap items-baseline gap-2 border-t border-[#e6e9ee] pt-2.5 dark:border-slate-700">
                      <span class="text-[12px] font-bold text-[#5f6c80] dark:text-slate-400">Va a consultar</span>
                      <span class="text-[15px] font-extrabold tracking-[-0.01em] tabular-nums">{{ periodoTexto() }}</span>
                    </div>
                  </div>
                </div>

                @for (a of avisos(); track a.texto) {
                  <p [class]="'!m-0 ' + aviso(a.cuidado)">{{ a.texto }}</p>
                }

                <!-- Se envía como -->
                <div class="flex flex-col gap-2 border-t border-[#e6e9ee] pt-3.5 dark:border-slate-700">
                  <span [class]="ui.label">Se envía como</span>

                  <div class="flex flex-wrap items-center gap-2.5">
                    <span class="w-[60px] shrink-0 text-[12.5px] font-bold text-[#5f6c80] dark:text-slate-400">Archivo</span>
                    <code [class]="ui.codigoCaja">{{ nombres().archivo }}</code>
                    <button type="button" (click)="copiar(nombres().archivo, 'archivo')" [class]="ui.chico + ' min-w-[96px]'">
                      <lucide-angular [name]="copiado() === 'archivo' ? 'check' : 'copy'" [size]="14"></lucide-angular>
                      {{ copiado() === 'archivo' ? 'Copiado' : 'Copiar' }}
                    </button>
                  </div>

                  @if (nombres().asunto) {
                    <div class="flex flex-wrap items-center gap-2.5">
                      <span class="w-[60px] shrink-0 text-[12.5px] font-bold text-[#5f6c80] dark:text-slate-400">Asunto</span>
                      <code [class]="ui.codigoCaja">{{ nombres().asunto }}</code>
                      <button type="button" (click)="copiar(nombres().asunto, 'asunto')" [class]="ui.chico + ' min-w-[96px]'">
                        <lucide-angular [name]="copiado() === 'asunto' ? 'check' : 'copy'" [size]="14"></lucide-angular>
                        {{ copiado() === 'asunto' ? 'Copiado' : 'Copiar' }}
                      </button>
                    </div>
                  }
                </div>

                <div class="flex flex-wrap items-center gap-2.5">
                  <button type="button" (click)="descargar()" [class]="ui.primario"
                          [disabled]="descargando() || cargandoDatos() || periodo().invalido">
                    @if (descargando()) {
                      <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
                      Generando
                    } @else {
                      <lucide-angular name="download" [size]="15"></lucide-angular>
                      Descargar Excel
                    }
                  </button>
                  <button type="button" (click)="consultar()" [class]="ui.secundario"
                          [disabled]="cargandoDatos() || periodo().invalido">
                    <lucide-angular name="refresh-cw" [size]="15" [class]="cargandoDatos() ? 'animate-spin' : ''"></lucide-angular>
                    Actualizar
                  </button>
                  @if (descargadoComo()) {
                    <span class="eui-entra flex min-w-0 items-center gap-1.5 text-[12.5px] font-semibold text-[#166534] dark:text-green-400">
                      <lucide-angular name="check" [size]="15"></lucide-angular>
                      <span class="[overflow-wrap:anywhere]">Descargado como {{ descargadoComo() }}</span>
                    </span>
                  }
                </div>
              </div>

              <!-- ============ Totales ============ -->
              @if (totales().length > 0) {
                <div class="flex flex-wrap gap-2.5">
                  @for (k of totales(); track k.etiqueta; let i = $index) {
                    <div [class]="ui.tarjeta + ' eui-sube flex min-w-0 flex-[1_1_180px] flex-col gap-0.5 px-3.5 py-3'" [style.--i]="2 + i">
                      <span [class]="ui.label">{{ k.etiqueta }}</span>
                      <span class="text-[24px] font-extrabold leading-tight tracking-[-0.025em] tabular-nums">{{ k.valor }}</span>
                      <span class="text-[11px] font-medium text-[#5f6c80] dark:text-slate-400">{{ k.detalle }}</span>
                    </div>
                  }
                </div>
              }

              <!-- ============ Vista previa ============ -->
              <div [class]="ui.tarjeta + ' eui-sube flex flex-col overflow-hidden'" [style.--i]="3">
                <div class="flex flex-wrap items-baseline justify-between gap-2 px-3.5 py-3">
                  <h3 class="!m-0 text-[13.5px] font-extrabold">Vista previa</h3>
                  <span class="text-[12px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ resumenTabla() }}</span>
                </div>

                @if (cargandoDatos()) {
                  <div class="flex flex-col gap-2 border-t border-[#e6e9ee] p-3.5 dark:border-slate-800" aria-hidden="true">
                    @for (n of [1, 2, 3, 4]; track n) {
                      <div class="h-7 animate-pulse rounded-md bg-[#eef1f5] motion-reduce:animate-none dark:bg-slate-800"></div>
                    }
                  </div>
                } @else if (errorDatos()) {
                  <div class="border-t border-[#e6e9ee] px-4 py-8 text-center dark:border-slate-800">
                    <lucide-angular name="alert-triangle" [size]="32" class="mx-auto mb-2 text-[#b45309]"></lucide-angular>
                    <p class="!m-0 text-[12.5px] font-bold text-[#334155] dark:text-slate-200">No se pudo consultar</p>
                    <p class="mx-auto mt-1 max-w-[560px] text-[12px] text-[#5f6c80] [overflow-wrap:anywhere] dark:text-slate-400">{{ errorDatos() }}</p>
                  </div>
                } @else {
                  @if (tabla(); as t) {
                    @if (t.filas.length === 0) {
                      <div class="border-t border-[#e6e9ee] px-4 py-10 text-center text-[12.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
                        <lucide-angular name="inbox" [size]="36" class="mx-auto mb-2 text-[#c5ccd6]"></lucide-angular>
                        La consulta no devolvió filas para este periodo.
                      </div>
                    } @else {
                      <div class="eui-aparece max-h-[560px] overflow-auto border-t border-[#e6e9ee] dark:border-slate-800">
                        <table class="w-full border-separate border-spacing-0 tabular-nums">
                          <thead>
                            <tr>
                              @for (c of t.columnas; track $index) {
                                <th [class]="ui.th + ' sticky top-0 ' + c.alineacion">{{ c.nombre }}</th>
                              }
                            </tr>
                          </thead>
                          <tbody>
                            @for (fila of t.filas; track $index) {
                              <tr class="hover:[&>td]:bg-[#f8fafc] dark:hover:[&>td]:bg-slate-800/60">
                                @for (celda of fila; track $index) {
                                  <td [class]="ui.td + ' ' + t.columnas[$index].alineacion">{{ celda }}</td>
                                }
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                  }
                }
              </div>
            </div>
          }
        </div>
      }
    </div>

    <!-- Fila de la lista de entregables -->
    <ng-template #item let-it>
      <button type="button" (click)="elegir(it.e.id)" [attr.aria-pressed]="it.e.id === idSel()"
              [class]="claseItem(it.e.id === idSel())">
        <span class="flex min-w-0 flex-1 flex-col gap-[3px]">
          <span class="text-[13px] font-bold leading-[1.25]">{{ it.e.nombre }}</span>
          <span class="text-[11.5px] font-medium text-[#5f6c80] dark:text-slate-400">{{ it.linea }}</span>
        </span>
        @if (it.proxima) {
          <span [class]="ui.pildora + ' bg-[#eef1f5] tabular-nums text-[#334155] dark:bg-slate-800 dark:text-slate-300'">{{ corto(it.proxima) }}</span>
        }
      </button>
    </ng-template>
  `
})
export class EntregablesReportComponent {

  readonly ui = EUI;
  readonly segmento = euiSegmento;
  readonly aviso = euiAviso;
  readonly corto = diaCorto;

  private readonly hoy = hoyLocal();

  seleccion = signal<SeleccionSubcartera | null>(null);
  consultas = signal<ConsultaReporte[]>([]);
  entregables = signal<Entregable[]>([]);
  cargandoLista = signal(false);

  idSel = signal<number | null>(null);
  /** Por entregable: si se mira el periodo programado o un pedido extra, y con qué fechas. */
  private modo = signal<Record<number, Modo>>({});
  private extraDesde = signal<Record<number, string>>({});
  private extraHasta = signal<Record<number, string>>({});

  datos = signal<DatosReporte | null>(null);
  cargandoDatos = signal(false);
  errorDatos = signal<string | null>(null);
  descargando = signal(false);
  descargadoComo = signal<string | null>(null);
  copiado = signal<'archivo' | 'asunto' | null>(null);

  /** Para descartar la respuesta de una consulta que ya no es la que se está mirando. */
  private turno = 0;

  constructor(
    private service: EntregablesReportService,
    private toast: ToastService
  ) {}

  // ==================== Lista ====================

  private items = computed<ItemLista[]>(() => this.entregables().map(e => {
    const toca = tocaEn(e, this.hoy);
    return {
      e,
      toca,
      proxima: toca ? null : proximaFecha(e, this.hoy),
      linea: resumenRepeticion(e) + (e.repeticion === 'PEDIDO' || !e.horaLimite ? '' : ` · máx. ${horaTexto(e.horaLimite)}`)
    };
  }));

  listaHoy = computed(() => this.items().filter(i => i.toca));
  listaOtros = computed(() => this.items()
    .filter(i => !i.toca && i.proxima)
    .sort((a, b) => a.proxima!.getTime() - b.proxima!.getTime()));
  listaPedido = computed(() => this.items().filter(i => !i.toca && !i.proxima));

  subtitulo = computed(() => {
    const h = this.hoy;
    const dia = nombreDia(h);
    const fecha = `${dia.charAt(0).toUpperCase()}${dia.slice(1)} ${h.getDate()} de ${MESES[h.getMonth()].toLowerCase()} de ${h.getFullYear()}`;
    if (!this.seleccion()?.idSubcartera || this.cargandoLista()) return fecha;
    const total = this.entregables().length;
    if (total === 0) return fecha;
    const tocan = this.listaHoy().length;
    return `${fecha} · ${tocan ? `hoy tocan ${tocan} de ${total} entregables` : 'hoy no toca ningún entregable'}`;
  });

  // ==================== Entregable elegido ====================

  sel = computed(() => this.entregables().find(e => e.id === this.idSel()) ?? null);
  consultaSel = computed(() => {
    const e = this.sel();
    return e ? this.consultas().find(c => c.id === e.idConsulta) ?? null : null;
  });

  programacion = computed(() => {
    const e = this.sel();
    if (!e) return { resumen: '', detalle: '', toca: false };
    const toca = tocaEn(e, this.hoy);
    const proxima = toca ? null : proximaFecha(e, this.hoy);
    let detalle = 'Sin repetición: se saca cuando lo pidan.';
    if (e.repeticion !== 'PEDIDO') {
      detalle = (e.horaLimite ? `Hora límite ${horaTexto(e.horaLimite)}` : 'Sin hora límite') +
        (proxima ? ` · próximo: ${nombreDia(proxima)} ${dmy(proxima)}` : '');
    }
    return { resumen: resumenRepeticion(e), detalle, toca };
  });

  periodo = computed<PeriodoVista>(() => {
    const e = this.sel();
    const c = this.consultaSel();
    if (!e || !c) return { extra: false, desde: null, hasta: null, regla: '', invalido: false };

    const programado = c.tipoPeriodo === 'SIN' ? { desde: null, hasta: null } : rangoProgramado(e.periodoProgramado, this.hoy);
    const regla = c.tipoPeriodo === 'SIN' ? 'Sin fechas: la foto de hoy.' : `${TEXTO_PERIODO[e.periodoProgramado]}.`;
    const extra = c.tipoPeriodo !== 'SIN' && this.modo()[e.id] === 'EXTRA';
    if (!extra) return { extra, ...programado, regla, invalido: false };

    const hasta = deIso(this.extraHasta()[e.id]) ?? programado.hasta ?? this.hoy;
    const desde = c.tipoPeriodo === 'DIA' ? hasta : (deIso(this.extraDesde()[e.id]) ?? inicioDeMes(hasta));
    return { extra, desde, hasta, regla, invalido: desde.getTime() > hasta.getTime() };
  });

  isoDesde = computed(() => { const d = this.periodo().desde; return d ? aIso(d) : ''; });
  isoHasta = computed(() => { const d = this.periodo().hasta; return d ? aIso(d) : ''; });

  periodoTexto = computed(() => {
    const p = this.periodo();
    if (!p.desde || !p.hasta) return 'Sin fechas';
    return p.desde.getTime() === p.hasta.getTime() ? dmy(p.desde) : `${dmy(p.desde)} → ${dmy(p.hasta)}`;
  });

  nombres = computed(() => {
    const e = this.sel();
    if (!e) return { archivo: '', asunto: '' };
    const fecha = fechaDelNombre(e.fechaNombre, this.periodo().hasta, this.hoy);
    return { archivo: resolverPatron(e.patronArchivo, fecha), asunto: resolverPatron(e.patronAsunto, fecha) };
  });

  avisos = computed<{ texto: string; cuidado: boolean }[]>(() => {
    const c = this.consultaSel();
    const p = this.periodo();
    if (!c) return [];
    const lista: { texto: string; cuidado: boolean }[] = [];
    if (c.nota) lista.push({ texto: c.nota, cuidado: false });
    if (p.invalido) {
      lista.push({ texto: 'Desde es posterior a Hasta: corrige las fechas para consultar.', cuidado: true });
      return lista;
    }
    if (c.avisoCortePasado && p.hasta && p.hasta.getTime() < this.hoy.getTime()) {
      lista.push({ texto: c.avisoCortePasado, cuidado: true });
    }
    if (c.avisoCruzaMes && p.desde && p.hasta &&
        (p.desde.getMonth() !== p.hasta.getMonth() || p.desde.getFullYear() !== p.hasta.getFullYear())) {
      lista.push({ texto: c.avisoCruzaMes, cuidado: true });
    }
    return lista;
  });

  // ==================== Resultado ====================

  private columnas = computed<ColumnaVista[]>(() => {
    const d = this.datos();
    if (!d) return [];
    const porcentajes = new Set((this.consultaSel()?.columnasPorcentaje ?? []).map(normalizar));
    return d.columnas.map(col => {
      const porcentaje = porcentajes.has(normalizar(col.nombre));
      const numero = porcentaje || col.tipo === 'DECIMAL' || col.tipo === 'ENTERO';
      const fecha = col.tipo === 'FECHA' || col.tipo === 'FECHA_HORA';
      return {
        nombre: col.nombre,
        tipo: col.tipo,
        porcentaje,
        alineacion: numero ? 'text-right' : (fecha ? 'text-center' : 'text-left')
      };
    });
  });

  tabla = computed(() => {
    const d = this.datos();
    if (!d) return null;
    const columnas = this.columnas();
    return {
      columnas,
      filas: d.filas.slice(0, MAX_FILAS).map(fila => fila.map((valor, i) => this.formato(valor, columnas[i])))
    };
  });

  resumenTabla = computed(() => {
    const d = this.datos();
    if (this.cargandoDatos()) return 'Consultando…';
    if (!d) return '';
    const filas = d.filas.length;
    const recorte = filas > MAX_FILAS ? ` (se muestran ${MAX_FILAS}; el Excel las lleva todas)` : '';
    return `${this.entero(filas)} ${filas === 1 ? 'fila' : 'filas'}${recorte} · ${d.columnas.length} columnas · consultado a las ${d.generadoEn}`;
  });

  totales = computed(() => {
    const d = this.datos();
    const c = this.consultaSel();
    if (!d || !c || this.cargandoDatos() || this.errorDatos()) return [];
    const indices = d.columnas.map(col => normalizar(col.nombre));
    return c.totales.map(t => {
      const i = t.columna ? indices.indexOf(normalizar(t.columna)) : -1;
      let numero: number | null = null;
      if (t.operacion === 'FILAS') {
        numero = d.filas.length;
      } else if (i >= 0) {
        const valores = d.filas.map(f => f[i]);
        if (t.operacion === 'SUMA') {
          numero = valores.reduce<number>((suma, v) => suma + (Number(v) || 0), 0);
        } else if (t.operacion === 'DISTINTOS') {
          numero = new Set(valores.filter(v => v !== null && v !== '').map(v => normalizar(String(v)))).size;
        } else {
          const buscado = normalizar(t.valor);
          numero = valores.filter(v => normalizar(v === null ? '' : String(v)) === buscado).length;
        }
      }
      let valor = '—';
      if (numero !== null) {
        valor = t.esMoneda ? `S/ ${this.decimal(numero)}` : (Number.isInteger(numero) ? this.entero(numero) : this.decimal(numero));
      }
      return { etiqueta: t.etiqueta, valor, detalle: t.detalle ?? '' };
    });
  });

  // ==================== Acciones ====================

  onSeleccion(seleccion: SeleccionSubcartera): void {
    const anterior = this.seleccion()?.idSubcartera ?? null;
    this.seleccion.set(seleccion);
    if (seleccion.idSubcartera === anterior) return;

    this.turno++;
    this.consultas.set([]);
    this.entregables.set([]);
    this.idSel.set(null);
    this.limpiarResultado();
    if (seleccion.idSubcartera == null) {
      this.cargandoLista.set(false);
      return;
    }

    const idSubcartera = seleccion.idSubcartera;
    this.cargandoLista.set(true);
    forkJoin({
      consultas: this.service.getConsultas(idSubcartera),
      entregables: this.service.getEntregables(idSubcartera)
    }).subscribe({
      next: ({ consultas, entregables }) => {
        if (this.seleccion()?.idSubcartera !== idSubcartera) return;
        this.consultas.set(consultas);
        this.entregables.set(entregables);
        this.cargandoLista.set(false);
        // Arranca en lo primero que toca hoy; si hoy no toca nada, en el primero de la lista.
        const primero = this.listaHoy()[0]?.e ?? entregables[0];
        if (primero) this.elegir(primero.id);
      },
      error: (err) => {
        if (this.seleccion()?.idSubcartera !== idSubcartera) return;
        console.error('Error cargando entregables:', err);
        this.cargandoLista.set(false);
        this.toast.error(this.mensaje(err, 'No se pudieron cargar los entregables de la subcartera'));
      }
    });
  }

  elegir(id: number): void {
    if (id === this.idSel()) return;
    this.idSel.set(id);
    this.consultar();
  }

  cambiarModo(modo: Modo): void {
    const e = this.sel();
    if (!e || (this.modo()[e.id] ?? 'PROG') === modo) return;
    this.modo.update(m => ({ ...m, [e.id]: modo }));
    this.consultar();
  }

  /** Cambia las fechas del pedido extra; null deja la que ya estaba. */
  fijarFechas(desde: string | null, hasta: string | null): void {
    const e = this.sel();
    if (!e) return;
    if (desde !== null) this.extraDesde.update(m => ({ ...m, [e.id]: desde }));
    if (hasta !== null) this.extraHasta.update(m => ({ ...m, [e.id]: hasta }));
    this.consultar();
  }

  atajo(cual: 'hoy' | 'manana' | 'ayer' | 'semana' | 'mes' | 'mesAnterior'): void {
    const h = this.hoy;
    const ayer = sumarDias(h, -1);
    switch (cual) {
      case 'hoy': return this.fijarFechas(null, aIso(h));
      case 'manana': return this.fijarFechas(null, aIso(sumarDias(h, 1)));
      case 'ayer': return this.fijarFechas(aIso(ayer), aIso(ayer));
      // La semana empieza el lunes.
      case 'semana': return this.fijarFechas(aIso(sumarDias(h, -((h.getDay() + 6) % 7))), aIso(h));
      case 'mes': return this.fijarFechas(aIso(inicioDeMes(h)), aIso(h));
      case 'mesAnterior': {
        const fin = new Date(h.getFullYear(), h.getMonth(), 0);
        return this.fijarFechas(aIso(inicioDeMes(fin)), aIso(fin));
      }
    }
  }

  consultar(): void {
    const e = this.sel();
    const p = this.periodo();
    const turno = ++this.turno;
    this.limpiarResultado();
    if (!e || p.invalido) return;

    this.cargandoDatos.set(true);
    this.service.getDatos(e.id, p.desde ? aIso(p.desde) : null, p.hasta ? aIso(p.hasta) : null).subscribe({
      next: (datos) => {
        if (turno !== this.turno) return;
        this.datos.set(datos);
        this.cargandoDatos.set(false);
      },
      error: (err) => {
        if (turno !== this.turno) return;
        console.error('Error consultando el entregable:', err);
        this.errorDatos.set(this.mensaje(err, 'El servidor no respondió.'));
        this.cargandoDatos.set(false);
      }
    });
  }

  descargar(): void {
    const e = this.sel();
    const p = this.periodo();
    if (!e || p.invalido || this.descargando()) return;
    const nombre = this.nombres().archivo;

    this.descargando.set(true);
    this.descargadoComo.set(null);
    this.service.exportarExcel(e.id, p.desde ? aIso(p.desde) : null, p.hasta ? aIso(p.hasta) : null).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.descargando.set(false);
        this.descargadoComo.set(nombre);
      },
      error: (err) => {
        console.error('Error exportando el entregable:', err);
        this.descargando.set(false);
        this.toast.error('No se pudo generar el Excel');
      }
    });
  }

  copiar(texto: string, cual: 'archivo' | 'asunto'): void {
    if (!navigator.clipboard) {
      this.toast.error('No se pudo copiar');
      return;
    }
    navigator.clipboard.writeText(texto).then(
      () => {
        this.copiado.set(cual);
        setTimeout(() => { if (this.copiado() === cual) this.copiado.set(null); }, 2000);
      },
      () => this.toast.error('No se pudo copiar')
    );
  }

  claseItem(elegido: boolean): string {
    return 'flex min-h-[56px] w-full items-center gap-2.5 rounded-[10px] border px-3 py-[9px] text-left ' +
      'transition-colors duration-150 ' +
      (elegido ? 'border-[#2563eb] bg-[#f5f9ff] dark:bg-blue-950/30'
               : 'border-[#e6e9ee] bg-white hover:border-[#c5ccd6] dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500');
  }

  // ==================== Formato ====================

  private formato(valor: string | number | null, columna: ColumnaVista): string {
    if (valor === null || valor === '') return '';
    if (columna.porcentaje) return `${(Number(valor) * 100).toFixed(1)}%`;
    switch (columna.tipo) {
      case 'FECHA': {
        const d = deIso(String(valor));
        return d ? dmy(d) : String(valor);
      }
      case 'FECHA_HORA': {
        const d = deIso(String(valor));
        return d ? `${dmy(d)} ${String(valor).slice(11, 16)}`.trim() : String(valor);
      }
      case 'DECIMAL': return this.decimal(Number(valor));
      case 'ENTERO': return this.entero(Number(valor));
      default: return String(valor);
    }
  }

  private decimal(n: number): string {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  private entero(n: number): string {
    return n.toLocaleString('en-US');
  }

  private limpiarResultado(): void {
    this.datos.set(null);
    this.errorDatos.set(null);
    this.cargandoDatos.set(false);
    this.descargadoComo.set(null);
    this.copiado.set(null);
  }

  private mensaje(err: any, porDefecto: string): string {
    return err?.error?.message || err?.error?.mensaje || err?.error?.error || porDefecto;
  }
}
