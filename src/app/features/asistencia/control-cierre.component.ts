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
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BARRA_ESTADO_MAL, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, FUERTE, LISTA, INDICADORES, PILL, PRINCIPAL, REJILLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, TonoPill, VACIO, ZONA
} from './ui/clases';
import { BOTON_APAGADO, BOTON_SEC, MESES, bajarExcel } from './ui/control-comun';
import { HorasSemanaComponent } from './ui/horas-semana.component';
import { IndicadorComponent } from './ui/indicador.component';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { MINI, TR_ABRE } from './ui/ficha-clases';
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

type Vista = 'semana' | 'cerradas';

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
        @if (vista() === 'cerradas') {
          @if (!abierta()) {
            <!-- El historial: se vuelve a la semana con «Cierre semanal»; la subcartera la elige el filtro de arriba y aquí se acota por mes. -->
            <div class="mb-[.75rem] flex flex-none flex-wrap items-center gap-3">
              <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="elegirVista('semana')"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Cierre semanal</button>
              <div class="ml-auto">
                <select [class]="LISTA + ' w-auto! min-w-[11rem]'" aria-label="Mes" (change)="mesCerradas.set($any($event.target).value); pagina.set(1)">
                  <option value="" [selected]="!mesCerradas()">Todos los meses</option>
                  @for (m of mesesCerradas(); track m.clave) { <option [value]="m.clave" [selected]="m.clave === mesCerradas()">{{ m.texto }}</option> }
                </select>
              </div>
            </div>
          }
          <div #zona [class]="ZONA">
            @if (abierta(); as c) {
              <!-- La foto que se guardó al cerrar: cómo quedó cada asesor esa semana. -->
              <div class="mb-[.75rem] flex flex-none flex-wrap items-center gap-3">
                <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="abrirCierre(null)"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Semanas cerradas</button>
                <span class="text-[1rem] font-bold text-foreground">Semana del {{ corta(c.lunes) }} – {{ corta(c.ultimoDia) }}</span>
                @if (c.subcartera) { <span [class]="PILL.neu">{{ c.subcartera }}</span> }
                @if (c.agentes?.length) {
                  <div [class]="BUSCAR" class="ml-auto flex-[0_1_18rem]">
                    <span [class]="BUSCAR_ICONO"><lucide-angular name="search" [size]="16" class="flex"></lucide-angular></span>
                    <input type="search" placeholder="Nombre del asesor" aria-label="Buscar asesor" [class]="BUSCAR_CAMPO" [value]="busqueda()"
                           (input)="busqueda.set($any($event.target).value); pagina.set(1)">
                  </div>
                }
              </div>
              @if (!c.agentes) {
                <div [class]="VACIO">Cargando…</div>
              } @else {
                <div class="flex flex-[1_0_auto] flex-col">
                  <div #caja [class]="TABLA_CAJA">
                    <table [class]="TABLA">
                      <thead [class]="THEAD"><tr [class]="TR">
                        <th [class]="TH">Asesor</th><th [class]="TH + ' text-right!'">Días</th><th [class]="TH + ' text-right!'">Puntual</th><th [class]="TH + ' text-right!'">Tarde</th>
                        <th [class]="TH + ' text-right!'">Faltas</th><th [class]="TH + ' pl-6!'">Horas</th><th [class]="TH + ' text-right!'">Recuperadas</th><th [class]="TH + ' text-right!'">Tardanza</th><th [class]="TH">Límite</th>
                      </tr></thead>
                      <tbody>
                        @if (!fotoFiltrada().length) { <tr [class]="TR"><td colspan="9" [class]="TD_1 + ' text-muted-foreground!'">Sin resultados</td></tr> }
                        @for (a of paginaFoto(); track a.idUsuario) {
                          <tr [class]="TR">
                            <td [class]="TD_1"><span [class]="FUERTE">{{ a.nombreAgente ?? '—' }}</span></td>
                            <td [class]="TD + ' text-right!'">{{ a.diasTrabajados }}</td><td [class]="TD + ' text-right!'">{{ a.diasPuntual }}</td>
                            <td [class]="TD + ' text-right!'">{{ a.diasTarde }}</td><td [class]="TD + ' text-right!'">{{ a.diasFalta }}</td>
                            <td [class]="TD + ' pl-6!'">{{ a.horasTrabajadas }}<span [class]="SEC">de {{ a.jornada }}</span>
                              @if (a.ajusteTrabajadasMin) { <span [class]="SEC">{{ ajuste(a.ajusteTrabajadasMin) }} después del cierre</span> }</td>
                            <td [class]="TD + ' text-right!'">{{ enHoras(a.minutosRecuperados ?? 0) }}</td>
                            <td [class]="TD + ' text-right!'"><span [class]="a.pierdeBono ? 'font-semibold text-(--ro)' : ''">{{ a.tardanza }}</span>
                              @if (a.ajusteTardanzaMin) { <span [class]="SEC">{{ ajuste(a.ajusteTardanzaMin) }} después del cierre</span> }</td>
                            <td [class]="TD"><span [class]="a.pierdeBono ? PILL.ro : PILL.ok" [title]="a.pierdeBono ? (a.motivoBono ?? 'Fuera del límite de tardanza') : 'Dentro del límite de tardanza'">{{ a.pierdeBono ? 'Fuera' : 'Dentro' }}</span></td>
                          </tr>
                        }
                      </tbody>
                      <tfoot>
                        @let t = totalesDe(c);
                        <tr [class]="TR">
                          <td [class]="PIE_1"><span class="font-semibold">Total</span><span [class]="SEC">{{ c.personas === 1 ? '1 persona' : c.personas + ' personas' }}</span></td>
                          <td [class]="PIE"></td><td [class]="PIE"></td><td [class]="PIE"></td>
                          <td [class]="PIE + ' text-right!'"><span class="font-semibold">{{ t.faltas }}</span></td>
                          <td [class]="PIE + ' pl-6!'"><span class="font-semibold">{{ enHoras(t.trabajadas) }}</span></td>
                          <td [class]="PIE + ' text-right!'"><span class="font-semibold">{{ enHoras(t.recuperado) }}</span></td>
                          <td [class]="PIE + ' text-right!'"><span class="font-semibold">{{ enHoras(t.tardanza) }}</span></td>
                          <td [class]="PIE"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <app-pie-pagina [total]="fotoFiltrada().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
                </div>
              }
            } @else if (!encontradas().length) {
              <div [class]="VACIO">{{ mesCerradas() ? 'Sin semanas cerradas ese mes' : 'Sin semanas cerradas' }}</div>
            } @else {
              <div class="flex flex-[1_0_auto] flex-col">
                <div #caja [class]="TABLA_CAJA">
                  <table [class]="TABLA">
                    <thead [class]="THEAD"><tr [class]="TR">
                      <th [class]="TH">Semana</th>@if (!ambito().idSubcartera) { <th [class]="TH">Subcartera</th> }
                      <th [class]="TH + ' text-right!'">Faltas</th><th [class]="TH + ' text-right!'">Tardanza</th><th [class]="TH">Límite de tardanza</th><th [class]="TH">Cerró</th><th [class]="TH"></th>
                    </tr></thead>
                    <tbody>
                      @for (c of paginaCerradas(); track c.id) {
                        @let t = totalesDe(c);
                        <tr [class]="TR + ' ' + TR_ABRE" (click)="abrirCierre(c)">
                          <td [class]="TD_1"><span [class]="FUERTE">{{ corta(c.lunes) }} – {{ corta(c.ultimoDia) }}</span><span [class]="SEC">{{ c.personas === 1 ? '1 persona' : c.personas + ' personas' }}</span></td>
                          @if (!ambito().idSubcartera) { <td [class]="TD">{{ c.subcartera ?? 'Todas' }}</td> }
                          <td [class]="TD + ' text-right!'">{{ c.agentes ? t.faltas : '—' }}</td>
                          <td [class]="TD + ' text-right!'">{{ c.agentes ? enHoras(t.tardanza) : '—' }}</td>
                          <td [class]="TD"><span [class]="c.sinBono ? PILL.ro : PILL.ok">{{ c.sinBono ? (c.sinBono === 1 ? '1 fuera del límite' : c.sinBono + ' fuera del límite') : 'Todos dentro' }}</span></td>
                          <td [class]="TD">{{ c.cerradoPor ?? 'RR.HH.' }}<span [class]="SEC">{{ c.cerradoEn ? corta(c.cerradoEn.slice(0, 10)) + ' ' + c.cerradoEn.slice(11, 16) : '' }}</span></td>
                          <td [class]="TD + ' w-8 text-right! text-muted-foreground'"><lucide-angular name="chevron-right" [size]="16" class="inline-flex"></lucide-angular></td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
                <app-pie-pagina [total]="encontradas().length" [pagina]="paginaActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
              </div>
            }
          </div>
        } @else if (!ambito().idSubcartera) {
          <div [class]="ZONA"><div [class]="VACIO">Elige una subcartera en el filtro</div></div>
        } @else {
          <!-- Lo que ya está listo no filtra: no hay nada que ver ahí. -->
          <div [class]="INDICADORES + ' @max-[44.001rem]/p5:grid-cols-2'">
            <app-indicador [valor]="faltantes()" rotulo="Días con marcas faltantes" [filtra]="faltantes() > 0 || filtro() === 'marcas'" tono="am" [activo]="filtro() === 'marcas'" (elegir)="filtrar('marcas')">
              <span [class]="pillDe(faltantes(), true)">{{ textoDe(faltantes(), true) }}</span>
            </app-indicador>
            <app-indicador [valor]="porAprobar().length" rotulo="Solicitudes por aprobar" [filtra]="porAprobar().length > 0 || filtro() === 'sol'" tono="am" [activo]="filtro() === 'sol'" (elegir)="filtrar('sol')">
              <span [class]="pillDe(porAprobar().length, true)">{{ textoDe(porAprobar().length, true) }}</span>
            </app-indicador>
            <app-indicador [valor]="sinRevisar().length" rotulo="Sin revisar por la supervisora" [filtra]="sinRevisar().length > 0 || filtro() === 'rev'" tono="info" [activo]="filtro() === 'rev'" (elegir)="filtrar('rev')">
              <span [class]="pillDe(sinRevisar().length, false)">{{ textoDe(sinRevisar().length, false) }}</span>
            </app-indicador>
            <app-indicador [valor]="fuera()" [unidad]="'de ' + filas().length" rotulo="Fuera del límite de tardanza" [filtra]="fuera() > 0 || filtro() === 'fuera'" tono="ro" [activo]="filtro() === 'fuera'" (elegir)="filtrar('fuera')">
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

    <!-- El historial se abre desde la barra, como las demás acciones de la pantalla. -->
    <ng-template #verCerradas>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="elegirVista('cerradas')">Semanas cerradas</button>
    </ng-template>
    <div appTarjeta [class]="BARRA">
      @if (vista() === 'cerradas') {
        @if (abierta(); as c) {
          <span [class]="BARRA_ESTADO">Cerrada el {{ c.cerradoEn ? corta(c.cerradoEn.slice(0, 10)) : '—' }} por {{ c.cerradoPor ?? 'RR.HH.' }}</span>
          <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="excelCierre(c)"><lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel</button>
        } @else {
          <span [class]="BARRA_ESTADO">{{ cerradas().length === 1 ? '1 semana cerrada' : cerradas().length + ' semanas cerradas' }}</span>
        }
      } @else if (!ambito().idSubcartera) {
        <span [class]="BARRA_ESTADO">Sin subcartera elegida</span>
        <ng-container *ngTemplateOutlet="verCerradas" />
      } @else if (cierre(); as c) {
        <span [class]="BARRA_ESTADO">Cerrada el {{ c.cerradoEn ? corta(c.cerradoEn.slice(0, 10)) : '—' }} por {{ c.cerradoPor ?? 'RR.HH.' }}</span>
        <ng-container *ngTemplateOutlet="verCerradas" />
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="excel()"><lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel</button>
      } @else if (confirmando()) {
        <span [class]="BARRA_ESTADO_HAY">Al cerrar, nadie puede corregir marcas ni resolver solicitudes de esta semana</span>
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="guardando()" (click)="confirmando.set(false)">Cancelar</button>
        <button type="button" appBoton="peligro" class="px-4!" [disabled]="guardando()" (click)="cerrar()">Confirmar cierre</button>
      } @else {
        <span [class]="error() || (!pronto() && bloqueos().length) ? BARRA_ESTADO_MAL : BARRA_ESTADO">{{ error() || estadoBarra() }}</span>
        <ng-container *ngTemplateOutlet="verCerradas" />
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
  protected readonly LISTA = LISTA; protected readonly BUSCAR = BUSCAR; protected readonly BUSCAR_ICONO = BUSCAR_ICONO; protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO; protected readonly MINI = MINI; protected readonly TR_ABRE = TR_ABRE; protected readonly PILL = PILL;
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
  /** La semana que se revisa o el historial de semanas cerradas. */
  readonly vista = signal<Vista>('semana');
  /** La semana cerrada abierta en el historial, con su foto. */
  readonly abierta = signal<CierreSemana | null>(null);
  /** En la foto de una semana: el asesor que se busca. */
  readonly busqueda = signal('');
  /** En el historial: «2026-10» o vacío para todos los meses. */
  readonly mesCerradas = signal('');
  readonly cargando = signal(false);
  readonly filtro = signal<Filtro>('');
  readonly pagina = signal(1);
  readonly confirmando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  private pedido = 0;

  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.caja?.nativeElement, amplia: this.vista() === 'semana',
    total: this.vista() === 'semana' ? this.lista().length : this.abierta() ? this.fotoFiltrada().length : this.encontradas().length,
    clave: `${this.vista()}|${this.abierta()?.id}|${this.filtro()}|${this.lista().length}|${this.lunes()}|${this.ambito().idSubcartera}`
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
  /** Lo que se pagina: la semana, la lista de cerradas o la foto de una. */
  private readonly totalVisible = computed(() => this.vista() === 'semana' ? this.lista().length
    : this.abierta() ? this.fotoFiltrada().length : this.encontradas().length);
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.totalVisible() / this.porPagina()))));
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

  /** Las semanas cerradas del filtro, la más reciente primero; sin subcartera, todas. */
  readonly cerradas = computed(() => {
    const sub = this.ambito().idSubcartera ?? null;
    return this.cierres().filter(c => !sub || c.idSubcartera === sub)
      .sort((a, b) => b.lunes.localeCompare(a.lunes) || (a.subcartera ?? '').localeCompare(b.subcartera ?? ''));
  });
  /** Los meses que tienen semanas cerradas, el más reciente primero; la semana cuenta en el mes de su lunes. */
  readonly mesesCerradas = computed(() => [...new Set(this.cerradas().map(c => c.lunes.slice(0, 7)))]
    .map(clave => { const n = MESES[+clave.slice(5, 7) - 1]; return { clave, texto: `${n[0].toUpperCase()}${n.slice(1)} ${clave.slice(0, 4)}` }; }));
  readonly encontradas = computed(() => { const m = this.mesCerradas(); return m ? this.cerradas().filter(c => c.lunes.startsWith(m)) : this.cerradas(); });
  /** La foto de la semana abierta con el asesor buscado. */
  readonly fotoFiltrada = computed(() => {
    const q = this.busqueda().trim().toLowerCase(), a = this.abierta()?.agentes ?? [];
    return q ? a.filter(x => (x.nombreAgente ?? '').toLowerCase().includes(q)) : a;
  });
  readonly paginaCerradas = computed(() => { const ini = (this.paginaActual() - 1) * this.porPagina(); return this.encontradas().slice(ini, ini + this.porPagina()); });
  readonly paginaFoto = computed(() => { const ini = (this.paginaActual() - 1) * this.porPagina(); return this.fotoFiltrada().slice(ini, ini + this.porPagina()); });

  elegirVista(v: Vista): void {
    this.vista.set(v);
    this.abierta.set(null);
    this.busqueda.set('');
    this.pagina.set(1);
  }

  /** Abre la foto de una semana cerrada; si la lista no la trajo, se pide. */
  abrirCierre(c: CierreSemana | null): void {
    this.pagina.set(1);
    this.busqueda.set('');
    this.abierta.set(c);
    if (!c || c.agentes) return;
    this.servicio.cierre(c.id).subscribe({
      next: completo => { if (this.abierta()?.id === c.id) this.abierta.set(completo); },
      error: () => { this.abierta.set(null); this.toast.error('No se pudo abrir la semana cerrada'); }
    });
  }

  totalesDe(c: CierreSemana): { faltas: number; tardanza: number; recuperado: number; trabajadas: number } {
    const a = c.agentes ?? [];
    return {
      faltas: a.reduce((t, x) => t + x.diasFalta, 0), tardanza: a.reduce((t, x) => t + x.minutosTardanza, 0),
      recuperado: a.reduce((t, x) => t + (x.minutosRecuperados ?? 0), 0), trabajadas: a.reduce((t, x) => t + x.minutosTrabajados, 0)
    };
  }

  /** «+00:30» o «−00:15»: lo que cambió después de cerrar. */
  ajuste(m: number): string {
    return (m > 0 ? '+' : '−') + enHoras(Math.abs(m));
  }

  excelCierre(c: CierreSemana): void {
    bajarExcel(this.servicio.excel(c.lunes, c.ultimoDia, { idSubcartera: c.idSubcartera }), `Cierre_${c.lunes}.xlsx`,
      () => this.toast.error('No se pudo generar el Excel'));
  }

  excel(): void {
    bajarExcel(this.servicio.excel(this.lunes(), sumarDias(this.lunes(), 5), this.ambito()), `Asistencia_${this.lunes()}.xlsx`,
      () => this.toast.error('No se pudo generar el Excel'));
  }
}
