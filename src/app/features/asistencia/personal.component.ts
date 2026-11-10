import { AfterViewChecked, ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { forkJoin, of, switchMap } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { DatosPersonal, FichaPersonal, UsuarioLibre } from './asistencia.models';
import { hoy, lunesDe, sumarDias } from './asistencia.estilos';
import { AVATARES_PERSONAL } from './avatares-personal';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_MAL, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, CABECERA, CABECERA_TEXTO, CAMPO, ENTRADA, ETIQUETA, FILTROS,
  FUERTE, HERRAMIENTAS, LISTA, PANTALLA, PILL, PRINCIPAL, REJILLA, REJILLA_FICHA, REJILLA_SOLA, SEC, SUBTITULO, TABLA, TABLA_CAJA,
  TD, TD_1, TH, THEAD, TITULO, TR, VACIO, ZONA
} from './ui/clases';
import {
  AVATAR, AVATAR_BOTON, AVATAR_SIN, AYUDA, CAMPOS, ERROR, MINI, MINI_ICONO, MINI_PELIGRO, NOTA, SECCION_TITULO, TR_ABRE, TR_ELEGIDA, USUARIO, USUARIO_SIN, VOLVER,
  tonoSubcartera
} from './ui/ficha-clases';
import { filasQueEntran } from './ui/filas-por-alto';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { SegmentadoComponent } from './ui/segmentado.component';

type Estado = 'ACTIVO' | 'CESADO';
type Seccion = 'datos' | 'historial';
type Accion = 'datos' | 'sub' | 'mod' | 'cese' | null;
type Modalidad = 'PRESENCIAL' | 'TELETRABAJO';

/** Los campos del formulario de datos, en el orden en que se revisan. */
interface Form {
  apellidos: string; nombres: string; tipoDocumento: 'DNI' | 'CE'; numeroDocumento: string;
  fechaNacimiento: string; nacionalidad: string; estadoCivil: string;
  telefonoMovil: string; telefonoFijo: string; correo: string;
  direccion: string; distrito: string; fechaIngreso: string; idUsuario: number | null;
}
type Campo = keyof Form;

/** Una subcartera con su gente activa, para las tarjetas de arriba. */
interface Grupo { id: number; subcartera: string; cartera: string; cliente: string; tono: string; gente: FichaPersonal[] }

const MOTIVOS_CESE = ['Renuncia', 'Término de contrato', 'Abandono', 'Despido', 'Otro'];
const ESTADOS_CIVILES = ['Soltero(a)', 'Casado(a)', 'Conviviente', 'Divorciado(a)', 'Viudo(a)'];
const CAMPOS_ID: Record<Campo, string> = {
  apellidos: 'p-apellidos', nombres: 'p-nombres', tipoDocumento: 'p-tipodoc', numeroDocumento: 'p-numdoc',
  fechaNacimiento: 'p-nacimiento', nacionalidad: 'p-nacionalidad', estadoCivil: 'p-civil',
  telefonoMovil: 'p-movil', telefonoFijo: 'p-fijo', correo: 'p-correo',
  direccion: 'p-direccion', distrito: 'p-distrito', fechaIngreso: 'p-ingreso', idUsuario: 'p-usuario'
};
/** Ancho mínimo de una tarjeta de subcartera: si no entran todas en una fila, quedan solo con nombre y cifra. */
const ANCHO_TARJETA_REM = 9.5;

/**
 * Personal: la ficha de cada persona por subcartera.
 *
 * Arriba, una tarjeta por subcartera con su gente: la tarjeta filtra la lista y cada avatar abre la ficha.
 * Abajo, la lista plana y paginada por el alto de la tarjeta. La ficha se abre en el panel de la derecha,
 * con sus datos laborales y la acción al lado de cada uno; registrar a alguien ocupa la tarjeta principal.
 */
@Component({
  selector: 'app-personal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, NombrePropioPipe, SegmentadoComponent, PiePaginaComponent],
  template: `
    <ng-template #avatar let-p let-clase="clase">
      <span [class]="AVATAR + (p.idUsuario ? '' : AVATAR_SIN) + ' ' + clase" [style.color]="p.idUsuario ? tonoDe(p) : 'var(--muted-foreground)'"
            [innerHTML]="avatarDe(p)" aria-hidden="true"></span>
    </ng-template>

    <div [class]="REJILLA + ' ' + (elegida() && !nuevo() ? REJILLA_FICHA : REJILLA_SOLA)">
      <section appTarjeta [class]="PRINCIPAL">
        @if (nuevo(); as n) {
          <!-- ===================== Registrar persona ===================== -->
          <div [class]="CABECERA">
            <div [class]="CABECERA_TEXTO">
              <p role="heading" aria-level="1" [class]="TITULO">Registrar persona</p>
              <p [class]="SUBTITULO">Datos personales, contacto y datos laborales</p>
            </div>
          </div>
          <div [class]="HERRAMIENTAS">
            <button type="button" [class]="VOLVER" (click)="cancelarNuevo()"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Personal</button>
          </div>
          <div [class]="ZONA">
            <div class="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start @max-[52.001rem]/tarjeta:grid-cols-[minmax(0,1fr)]">
              <div class="flex min-w-0 flex-col gap-6">
                <section class="flex flex-col gap-[.875rem]">
                  <p role="heading" aria-level="2" [class]="SECCION_TITULO">Datos personales</p>
                  <div [class]="CAMPOS"><ng-container *ngTemplateOutlet="camposPersonales" /></div>
                </section>
                <section class="flex flex-col gap-[.875rem]">
                  <p role="heading" aria-level="2" [class]="SECCION_TITULO">Contacto</p>
                  <div [class]="CAMPOS"><ng-container *ngTemplateOutlet="camposContacto" /></div>
                </section>
              </div>
              <div class="ml-7 flex min-h-full min-w-0 flex-col gap-6 border-l border-(--line2) pl-7 @max-[52.001rem]/tarjeta:mt-6 @max-[52.001rem]/tarjeta:ml-0 @max-[52.001rem]/tarjeta:border-l-0 @max-[52.001rem]/tarjeta:pl-0">
                <section class="flex flex-col gap-[.875rem]">
                  <p role="heading" aria-level="2" [class]="SECCION_TITULO">Datos laborales</p>
                  <div [class]="CAMPOS">
                    <div [class]="CAMPO">
                      <label for="n-cli" [class]="ETIQUETA">Cliente</label>
                      <select id="n-cli" [class]="LISTA" (change)="nuevoCliente(+$any($event.target).value)">
                        @for (c of clientes(); track c.id) { <option [value]="c.id" [selected]="c.id === n.idCliente">{{ nombreCliente(c) }}</option> }
                      </select>
                    </div>
                    <div [class]="CAMPO">
                      <label for="n-car" [class]="ETIQUETA">Cartera</label>
                      <select id="n-car" [class]="LISTA" (change)="nuevaCartera(+$any($event.target).value)">
                        @for (c of nCarteras(); track c.id) { <option [value]="c.id" [selected]="c.id === n.idCartera">{{ c.portfolioName | nombrePropio }}</option> }
                      </select>
                    </div>
                    <div [class]="CAMPO">
                      <label for="n-sub" [class]="ETIQUETA">Subcartera</label>
                      <select id="n-sub" [class]="LISTA" (change)="ponerNuevo('idSubcartera', +$any($event.target).value)">
                        @for (s of nSubcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === n.idSubcartera">{{ s.subPortfolioName | nombrePropio }}</option> }
                      </select>
                    </div>
                    <div [class]="CAMPO">
                      <label [for]="ids.fechaIngreso" [class]="ETIQUETA">Fecha de ingreso <span class="text-(--ro)">*</span></label>
                      <input [id]="ids.fechaIngreso" type="date" [class]="ENTRADA" [value]="form().fechaIngreso" (change)="poner('fechaIngreso', $any($event.target).value)">
                      <small [class]="AYUDA">Primer día de trabajo; desde aquí cuenta en asistencia.</small>
                    </div>
                    <div [class]="CAMPO">
                      <label for="n-mod" [class]="ETIQUETA">Modalidad</label>
                      <select id="n-mod" [class]="LISTA" (change)="ponerNuevo('modalidad', $any($event.target).value)">
                        <option value="PRESENCIAL" [selected]="n.modalidad === 'PRESENCIAL'">Presencial</option>
                        <option value="TELETRABAJO" [selected]="n.modalidad === 'TELETRABAJO'">Teletrabajo</option>
                      </select>
                      <small [class]="AYUDA">En teletrabajo sus horas cuentan como remotas.</small>
                    </div>
                    <div [class]="CAMPO">
                      <label [for]="ids.idUsuario" [class]="ETIQUETA">Usuario de Cashi</label>
                      <ng-container *ngTemplateOutlet="campoUsuario" />
                      <small [class]="AYUDA">Con él se leen sus marcas; se puede vincular después.</small>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        } @else {
          <!-- ===================== Lista ===================== -->
          <div [class]="CABECERA">
            <div [class]="CABECERA_TEXTO">
              <p role="heading" aria-level="1" [class]="TITULO">Personal</p>
              <p [class]="SUBTITULO">Fichas por subcartera</p>
            </div>
            <div [class]="FILTROS">
              <div [class]="CAMPO">
                <label for="pe-cli" [class]="ETIQUETA">Cliente</label>
                <select id="pe-cli" [class]="LISTA" (change)="elegirCliente(+$any($event.target).value || null)">
                  <option value="" [selected]="!idCliente()">Todos</option>
                  @for (c of clientes(); track c.id) { <option [value]="c.id" [selected]="c.id === idCliente()">{{ nombreCliente(c) }}</option> }
                </select>
              </div>
              <div [class]="CAMPO">
                <label for="pe-car" [class]="ETIQUETA">Cartera</label>
                <select id="pe-car" [class]="LISTA" (change)="elegirCartera(+$any($event.target).value || null)">
                  <option value="" [selected]="!idCartera()">Todas</option>
                  @for (c of carteras(); track c.id) { <option [value]="c.id" [selected]="c.id === idCartera()">{{ c.portfolioName | nombrePropio }}</option> }
                </select>
              </div>
              <div [class]="CAMPO">
                <label for="pe-sub" [class]="ETIQUETA">Subcartera</label>
                <select id="pe-sub" [class]="LISTA" (change)="elegirSubcartera(+$any($event.target).value || null)">
                  <option value="" [selected]="!idSubcartera()">Todas</option>
                  @for (s of subcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === idSubcartera()">{{ s.subPortfolioName | nombrePropio }}</option> }
                </select>
              </div>
            </div>
          </div>

          @if (error()) {
            <div [class]="VACIO">No se pudo cargar Personal
              <div class="mt-[.75rem]"><button type="button" appBoton="secundario" appBotonAlto="chico" (click)="cargar()">Reintentar</button></div>
            </div>
          } @else if (cargando() && !fichas().length) {
            <p class="m-0 text-muted-foreground">Cargando…</p>
          } @else {
            @if (estado() === 'ACTIVO' && grupos().length) {
              <div #tarjetas class="mb-4 grid flex-none gap-3"
                   [style.grid-template-columns]="compacta() ? 'repeat(' + grupos().length + ',minmax(0,1fr))' : 'repeat(auto-fit,minmax(min(100%,' + ANCHO_TARJETA + 'rem),1fr))'">
                @for (g of grupos(); track g.id) {
                  @let sel = grupo() === g.id;
                  @let uno = grupos().length === 1;
                  <section [style.--t]="g.tono" (click)="uno ? null : alternarGrupo(g.id)"
                           class="@container/sub relative flex min-w-0 flex-col gap-2 overflow-hidden rounded-xl border border-solid border-[color-mix(in_oklab,var(--t)_28%,var(--border))] bg-[color-mix(in_oklab,var(--t)_7%,var(--card))] text-left text-foreground transition-[opacity,box-shadow] duration-150
                                  after:pointer-events-none after:absolute after:rounded-full after:bg-(--t) after:opacity-[.16] after:content-['']"
                           [class]="(compacta() ? 'px-[.75rem] py-[.625rem] after:-right-5 after:-bottom-7 after:size-14' : 'px-[.875rem] py-[.75rem] after:-right-6 after:-bottom-6 after:size-20')
                                    + (uno ? '' : ' cursor-pointer') + (sel ? ' shadow-[0_0_0_2px_var(--t)]' : '') + (grupo() && !sel ? ' opacity-55 hover:opacity-100' : '')">
                    <ng-template #cabeza>
                      <div class="min-w-0">
                        <span class="block truncate text-[.875rem] font-bold">{{ g.subcartera | nombrePropio }}</span>
                        <small class="mt-[.125rem] block truncate text-[.75rem] text-muted-foreground">{{ subtituloGrupo(g) }}</small>
                      </div>
                      <div class="text-right text-[1.5rem] leading-none font-bold @max-[12.001rem]/sub:flex @max-[12.001rem]/sub:items-baseline @max-[12.001rem]/sub:gap-[.375rem] @max-[12.001rem]/sub:text-left">
                        {{ g.gente.length }}<small class="mt-[.375rem] block min-w-0 truncate text-[.6875rem] leading-[1.2] font-medium text-muted-foreground">{{ detalleGrupo(g) }}</small>
                      </div>
                    </ng-template>
                    @if (uno) {
                      <div class="relative z-[1] flex items-start justify-between gap-3 @max-[12.001rem]/sub:flex-col @max-[12.001rem]/sub:gap-1"><ng-container *ngTemplateOutlet="cabeza" /></div>
                    } @else {
                      <button type="button" [attr.aria-pressed]="sel" [attr.aria-label]="sel ? 'Ver todas las subcarteras' : 'Ver solo ' + g.subcartera"
                              (click)="$event.stopPropagation(); alternarGrupo(g.id)"
                              class="relative z-[1] flex w-full cursor-pointer justify-between gap-3 rounded-[.375rem] border-0! bg-transparent p-0! text-left [font-family:inherit] text-inherit @max-[12.001rem]/sub:flex-col @max-[12.001rem]/sub:gap-1">
                        <ng-container *ngTemplateOutlet="cabeza" />
                      </button>
                    }
                    @if (!compacta()) {
                      @let visibles = cuantosVen(g);
                      <div class="relative z-[1] mt-auto flex flex-wrap overflow-hidden pt-[4px] pr-0 pb-[4px] pl-[3px]" [attr.data-grupo]="g.id"
                           [class]="uno ? 'h-[calc(2.375rem+1.5rem+8px)] gap-1' : 'h-[calc(2.375rem+8px)] @max-[12.001rem]/sub:h-[calc(2rem+8px)]'">
                        @for (p of g.gente.slice(0, visibles); track p.id) {
                          <button type="button" [class]="AVATAR_BOTON + (uno ? ' flex w-24 flex-col items-center gap-[.3125rem]' : ' -mr-[.3125rem]')"
                                  (click)="$event.stopPropagation(); verFicha(p)" [attr.aria-label]="nombreLista(p)" [attr.title]="nombreCorto(p) + (p.usuario ? ', ' + p.usuario : ', sin usuario de Cashi')">
                            <ng-container *ngTemplateOutlet="avatar; context: { $implicit: p, clase: 'size-[2.375rem]' }" />
                            @if (uno) { <span class="max-w-full truncate text-[.75rem] font-medium text-(--ink2)">{{ nombreCorto(p) }}</span> }
                          </button>
                        }
                        @if (visibles < g.gente.length) {
                          <button type="button" (click)="$event.stopPropagation(); uno ? null : alternarGrupo(g.id)" [attr.aria-label]="(g.gente.length - visibles) + ' personas más'"
                                  class="inline-grid size-[2.375rem] flex-none place-items-center rounded-full border-0! bg-card p-0! text-[.75rem] font-bold text-foreground shadow-[0_0_0_2px_var(--card),0_0_0_3px_color-mix(in_oklab,var(--t)_35%,transparent)] @max-[12.001rem]/sub:size-8"
                                  [class]="uno ? 'ml-[1.8125rem] cursor-default' : 'cursor-pointer'">+{{ g.gente.length - visibles }}</button>
                        }
                      </div>
                    }
                  </section>
                }
              </div>
            }

            <div [class]="HERRAMIENTAS">
              <app-segmentado [opciones]="[{ clave: 'ACTIVO', texto: 'Activos', n: activos().length }, { clave: 'CESADO', texto: 'Cesados', n: cesados().length }]"
                              [valor]="estado()" (cambiar)="estado.set($any($event)); pagina.set(1)" />
              <div class="ml-auto flex items-center gap-3">
                <div [class]="BUSCAR" class="flex-[0_1_18rem]">
                  <span [class]="BUSCAR_ICONO"><lucide-angular name="search" [size]="16" class="flex"></lucide-angular></span>
                  <input type="search" placeholder="Nombre, usuario o documento" aria-label="Buscar" [class]="BUSCAR_CAMPO" [value]="busqueda()"
                         (input)="busqueda.set($any($event.target).value); pagina.set(1)">
                </div>
              </div>
            </div>

            <div #zona [class]="ZONA">
              @if (!lista().length) {
                <div [class]="VACIO">{{ busqueda().trim() ? 'Sin resultados' : estado() === 'CESADO' ? 'Sin personas cesadas' : 'Sin personas activas' }}</div>
              } @else {
                <div class="flex flex-[1_0_auto] flex-col">
                  <div #caja [class]="TABLA_CAJA">
                    <table [class]="TABLA">
                      <thead [class]="THEAD"><tr [class]="TR">
                        <th [class]="TH">Persona</th>
                        @if (verSubcartera()) { <th [class]="TH">Subcartera</th> }
                        <th [class]="TH">Usuario de Cashi</th>
                        @if (!elegida()) { <th [class]="TH">Ingreso</th><th [class]="TH">Modalidad</th> }
                        <th [class]="TH">Estado</th>
                        <th [class]="TH"></th>
                      </tr></thead>
                      <tbody>
                        @for (p of paginaLista(); track p.id) {
                          @let ces = cesado(p);
                          <tr [class]="TR + ' ' + TR_ABRE + (abierta() === p.id ? TR_ELEGIDA : '')" (click)="alternarFicha(p)" [attr.aria-selected]="abierta() === p.id">
                            <td [class]="TD_1"><span [class]="FUERTE">{{ nombreLista(p) }}</span><span [class]="SEC">{{ p.tipoDocumento }} {{ p.numeroDocumento ?? '—' }}</span></td>
                            @if (verSubcartera()) {
                              <td [class]="TD">
                                <span class="inline-flex items-center gap-[.4375rem] whitespace-nowrap"><i class="block size-2 flex-none rounded-full" [style.background]="tonoDe(p)"></i>{{ p.subcartera | nombrePropio }}</span>
                                @if (!idCliente()) { <span [class]="SEC + ' ml-[.9375rem]'">{{ clienteCorto(p) }}</span> }
                              </td>
                            }
                            <td [class]="TD"><span [class]="p.usuario ? USUARIO : USUARIO_SIN">{{ p.usuario ?? 'Sin vincular' }}</span></td>
                            @if (!elegida()) {
                              <td [class]="TD">{{ dma(p.fechaIngreso) }}<span [class]="SEC">{{ antiguedad(p) }}</span></td>
                              <td [class]="TD"><span [class]="p.modalidad === 'TELETRABAJO' ? PILL.info : PILL.neu">{{ p.modalidad === 'TELETRABAJO' ? 'Teletrabajo' : 'Presencial' }}</span></td>
                            }
                            <td [class]="TD">
                              @if (ces) { <span [class]="PILL.neu">Cesado el {{ dma(p.fechaCese).slice(0, 5) }}</span> }
                              @else if (p.fechaCese) { <span [class]="PILL.am">Cesa el {{ dma(p.fechaCese).slice(0, 5) }}</span> }
                              @else { <span [class]="PILL.ok">Activo</span> }
                            </td>
                            <td [class]="TD + ' w-8 pr-1! text-right!'"><lucide-angular name="chevron-right" [size]="16" class="inline-flex text-muted-foreground"></lucide-angular></td>
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
        }
      </section>

      @if (fichaPanel(); as p) {
        <!-- ===================== Ficha en el panel derecho ===================== -->
        <section appTarjeta class="flex min-h-0 min-w-0 flex-col self-stretch overflow-hidden p-0!" [attr.aria-label]="'Ficha de ' + p.nombres + ' ' + p.apellidos">
          @let ces = cesado(p);
          <div class="relative flex flex-none flex-col items-center gap-1 border-b border-(--line2) bg-card px-4 pt-5 pb-[.875rem] text-center">
            <button type="button" id="cerrar-ficha" [class]="MINI_ICONO + ' absolute! top-[.625rem] right-[.625rem]'" (click)="cerrarFicha()" aria-label="Cerrar ficha" title="Cerrar">
              <lucide-angular name="x" [size]="16" class="flex"></lucide-angular>
            </button>
            <ng-container *ngTemplateOutlet="avatar; context: { $implicit: p, clase: 'mb-[.375rem] size-16' }" />
            <span class="text-[1rem] font-bold text-foreground">{{ p.nombres }} {{ p.apellidos }}</span>
            <small class="text-[.75rem] text-muted-foreground">{{ p.tipoDocumento }} {{ p.numeroDocumento ?? '—' }}</small>
          </div>
          <div class="grid flex-none grid-cols-3 border-b border-(--line2)">
            <div class="flex min-w-0 flex-col gap-[.125rem] px-2 py-3 text-center"><span class="text-[.6875rem] text-muted-foreground">Ingreso</span><span class="text-[.8125rem] font-semibold text-foreground [overflow-wrap:anywhere]">{{ dma(p.fechaIngreso) }}</span></div>
            <div class="flex min-w-0 flex-col gap-[.125rem] border-l border-(--line2) px-2 py-3 text-center"><span class="text-[.6875rem] text-muted-foreground">Antigüedad</span><span class="text-[.8125rem] font-semibold text-foreground [overflow-wrap:anywhere]">{{ antiguedad(p) }}</span></div>
            <div class="flex min-w-0 flex-col gap-[.125rem] border-l border-(--line2) px-2 py-3 text-center"><span class="text-[.6875rem] text-muted-foreground">Usuario</span><span class="text-[.8125rem] font-semibold [overflow-wrap:anywhere]" [class]="p.usuario ? 'text-foreground' : 'text-(--am)'">{{ p.usuario ?? 'Sin vincular' }}</span></div>
          </div>

          @if (accion(); as a) {
            <div class="flex flex-none items-center gap-3 px-4 pt-[.875rem]">
              <button type="button" [class]="VOLVER" (click)="accion.set(null)"><lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Ficha</button>
              <span class="text-[.9375rem] font-bold text-foreground">{{ TITULO_ACCION[a] }}</span>
            </div>
            <div class="flex min-h-0 flex-1 flex-col gap-[.875rem] overflow-y-auto px-4 pt-3 pb-4">
              <div class="flex min-w-0 flex-col gap-3">
                <div class="grid grid-cols-[minmax(0,1fr)] gap-[.625rem]">
                  @switch (a) {
                    @case ('datos') {
                      <ng-container *ngTemplateOutlet="camposPersonales" />
                      <ng-container *ngTemplateOutlet="camposContacto" />
                      <div [class]="CAMPO">
                        <label [for]="ids.fechaIngreso" [class]="ETIQUETA">Fecha de ingreso <span class="text-(--ro)">*</span></label>
                        <input [id]="ids.fechaIngreso" type="date" [class]="ENTRADA" [value]="form().fechaIngreso" (change)="poner('fechaIngreso', $any($event.target).value)">
                      </div>
                      <div [class]="CAMPO">
                        <label [for]="ids.idUsuario" [class]="ETIQUETA">Usuario de Cashi</label>
                        <ng-container *ngTemplateOutlet="campoUsuario" />
                      </div>
                    }
                    @case ('sub') {
                      <div [class]="CAMPO">
                        <label for="f-sub" [class]="ETIQUETA">Nueva subcartera</label>
                        <select id="f-sub" [class]="LISTA" (change)="cambioSub.set(+$any($event.target).value)">
                          @for (s of cambioSubcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === cambioSub()" [disabled]="s.id === p.idSubcartera">{{ rotuloSubcartera(s) }}{{ s.id === p.idSubcartera ? ' (actual)' : '' }}</option> }
                        </select>
                      </div>
                      <div [class]="CAMPO">
                        <label for="f-desde" [class]="ETIQUETA">Desde el lunes</label>
                        <input id="f-desde" type="date" step="7" [class]="ENTRADA" [value]="cambioDesde()" (change)="cambioDesde.set($any($event.target).value)">
                      </div>
                      <div [class]="CAMPO">
                        <label for="f-mot" [class]="ETIQUETA">Motivo</label>
                        <input id="f-mot" [class]="ENTRADA" placeholder="Queda en el historial" [value]="cambioMotivo()" (input)="cambioMotivo.set($any($event.target).value)">
                      </div>
                    }
                    @case ('mod') {
                      <div [class]="CAMPO">
                        <label for="f-mod" [class]="ETIQUETA">Nueva modalidad</label>
                        <select id="f-mod" [class]="LISTA" (change)="cambioModalidad.set($any($event.target).value)">
                          @for (m of MODALIDADES; track m) {
                            <option [value]="m" [selected]="m === cambioModalidad()" [disabled]="m === modalidadDe(p)">{{ nombreModalidad(m) }}{{ m === modalidadDe(p) ? ' (actual)' : '' }}</option>
                          }
                        </select>
                      </div>
                      <div [class]="CAMPO">
                        <label for="f-desde" [class]="ETIQUETA">Desde</label>
                        <input id="f-desde" type="date" [class]="ENTRADA" [value]="cambioDesde()" (change)="cambioDesde.set($any($event.target).value)">
                      </div>
                      <div [class]="CAMPO">
                        <label for="f-mot" [class]="ETIQUETA">Motivo</label>
                        <input id="f-mot" [class]="ENTRADA" placeholder="Queda en el historial" [value]="cambioMotivo()" (input)="cambioMotivo.set($any($event.target).value)">
                      </div>
                    }
                    @case ('cese') {
                      <div [class]="CAMPO">
                        <label for="f-desde" [class]="ETIQUETA">Último día</label>
                        <input id="f-desde" type="date" [class]="ENTRADA" [value]="cambioDesde()" (change)="cambioDesde.set($any($event.target).value)">
                      </div>
                      <div [class]="CAMPO">
                        <label for="f-mc" [class]="ETIQUETA">Motivo</label>
                        <select id="f-mc" [class]="LISTA" (change)="ceseMotivo.set($any($event.target).value)">
                          @for (m of MOTIVOS_CESE; track m) { <option [value]="m" [selected]="m === ceseMotivo()">{{ m }}</option> }
                        </select>
                      </div>
                      <div [class]="CAMPO">
                        <label for="f-mot" [class]="ETIQUETA">Comentario</label>
                        <input id="f-mot" [class]="ENTRADA" [value]="cambioMotivo()" (input)="cambioMotivo.set($any($event.target).value)">
                      </div>
                    }
                  }
                </div>
                @if (notaAccion(p); as nota) { <p [class]="NOTA">{{ nota }}</p> }
                @if (errorAccion()) { <p [class]="ERROR" role="alert">{{ errorAccion() }}</p> }
                <div class="flex flex-wrap items-center justify-start gap-2">
                  <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" (click)="accion.set(null)">Cancelar</button>
                  <button type="button" appBoton class="h-[2.375rem]! px-4!" [disabled]="guardando()" (click)="guardarAccion(p)">
                    <lucide-angular name="check" [size]="16" class="flex"></lucide-angular>{{ a === 'cese' ? 'Registrar cese' : 'Guardar' }}
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <div class="flex flex-none flex-col border-b border-(--line2) px-4 py-1">
              <div class="grid min-h-[2.75rem] grid-cols-[5.25rem_minmax(0,1fr)_auto] items-center gap-3 py-[.375rem]">
                <span class="text-[.8125rem] text-muted-foreground">Subcartera</span>
                <div class="flex min-w-0 flex-col items-start gap-[.0625rem] text-[.8125rem] font-semibold text-foreground">
                  <span class="inline-flex items-center gap-[.4375rem] whitespace-nowrap"><i class="block size-2 flex-none rounded-full" [style.background]="tonoDe(p)"></i>{{ p.subcartera | nombrePropio }}</span>
                  <small class="ml-[.9375rem] text-[.6875rem] font-medium text-muted-foreground">{{ clienteCorto(p) }}</small>
                </div>
                @if (!ces) { <button type="button" [class]="MINI" (click)="abrirAccion(p, 'sub')">Cambiar</button> }
              </div>
              <div class="grid min-h-[2.75rem] grid-cols-[5.25rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-(--line2) py-[.375rem]">
                <span class="text-[.8125rem] text-muted-foreground">Modalidad</span>
                <div class="flex min-w-0 flex-col items-start"><span [class]="modalidadDe(p) === 'TELETRABAJO' ? PILL.info : PILL.neu">{{ nombreModalidad(modalidadDe(p)) }}</span></div>
                @if (!ces) { <button type="button" [class]="MINI" (click)="abrirAccion(p, 'mod')">Cambiar</button> }
              </div>
              <div class="grid min-h-[2.75rem] grid-cols-[5.25rem_minmax(0,1fr)_auto] items-center gap-3 border-t border-(--line2) py-[.375rem]">
                <span class="text-[.8125rem] text-muted-foreground">Estado</span>
                <div class="flex min-w-0 flex-col items-start">
                  @if (ces) { <span [class]="PILL.neu">Cesado el {{ dma(p.fechaCese).slice(0, 5) }}</span> }
                  @else if (p.fechaCese) { <span [class]="PILL.am">Cesa el {{ dma(p.fechaCese).slice(0, 5) }}</span> }
                  @else { <span [class]="PILL.ok">Activo</span> }
                </div>
                @if (!p.fechaCese) { <button type="button" [class]="MINI_PELIGRO" (click)="abrirAccion(p, 'cese')">Registrar cese</button> }
              </div>
            </div>
            <div class="mx-4 mt-[.875rem] flex flex-none items-center gap-2">
              <div class="grid flex-1 grid-cols-2 gap-[.1875rem] rounded-[.5rem] bg-muted p-[.1875rem]" role="group">
                @for (s of SECCIONES; track s.clave) {
                  <button type="button" [attr.aria-pressed]="seccion() === s.clave" (click)="seccion.set(s.clave)"
                          class="cursor-pointer rounded-[.375rem] border-0! bg-transparent px-2 py-[.375rem] [font-family:inherit] text-[.8125rem] font-medium text-(--ink2) aria-pressed:bg-(--seg-activo)! aria-pressed:text-foreground aria-pressed:shadow-[0_1px_2px_rgb(0_0_0/.08)]">{{ s.texto }}</button>
                }
              </div>
            </div>
            <div class="flex min-h-0 flex-1 flex-col gap-[.875rem] overflow-y-auto px-4 pt-3 pb-4">
              @if (seccion() === 'historial') {
                <ol class="relative m-0 flex list-none flex-col gap-3 py-0 pr-0 pl-4 before:absolute before:top-[.375rem] before:bottom-[.375rem] before:left-1 before:w-px before:bg-border before:content-['']">
                  @for (m of p.movimientos; track $index) {
                    <li class="relative grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 text-[.8125rem] before:absolute before:top-[.3125rem] before:-left-4 before:size-[.5625rem] before:rounded-full before:border-2 before:border-solid before:content-['']"
                        [class]="m.tipo === 'ingreso' ? 'before:border-(--ok-pt) before:bg-(--ok-pt)' : m.tipo === 'cese' ? 'before:border-(--ro-pt) before:bg-card' : 'before:border-muted-foreground before:bg-card'">
                      <time class="text-[.75rem] text-muted-foreground">{{ dma(m.fecha) }}</time>
                      <div><span class="block font-semibold text-foreground">{{ m.titulo }}</span><small class="block text-[.75rem] text-muted-foreground">{{ m.detalle }}</small></div>
                    </li>
                  }
                </ol>
              } @else {
                <div class="flex flex-col">
                  @for (d of datosDe(p); track d[0]; let primero = $first) {
                    <div class="flex justify-between gap-3 py-[.4375rem] text-[.8125rem]" [class]="primero ? '' : 'border-t border-(--line2)'">
                      <span class="text-muted-foreground">{{ d[0] }}</span><span class="text-right font-semibold text-foreground">{{ d[1] }}</span>
                    </div>
                  }
                </div>
                <div class="flex justify-end pt-3">
                  <button type="button" [class]="MINI" (click)="abrirAccion(p, 'datos')"><lucide-angular name="pencil" [size]="16" class="flex"></lucide-angular>Editar datos</button>
                </div>
              }
            </div>
          }
        </section>
      }
    </div>

    <div appTarjeta [class]="BARRA">
      @if (nuevo()) {
        <span [class]="errorForm() ? BARRA_ESTADO_MAL : BARRA_ESTADO">{{ errorForm() || 'Los campos con * son obligatorios' }}</span>
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="cancelarNuevo()">Cancelar</button>
        <button type="button" appBoton class="px-4!" [disabled]="guardando()" (click)="registrar()"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Registrar</button>
      } @else {
        <span [class]="BARRA_ESTADO">{{ activos().length === 1 ? '1 persona activa' : activos().length + ' personas activas' }}{{ sinUsuario() ? ', ' + sinUsuario() + ' sin usuario de Cashi' : '' }}</span>
        <button type="button" appBoton class="px-4!" (click)="abrirNuevo()">Registrar persona</button>
      }
    </div>

    <!-- Campos compartidos por el registro y la edición -->
    <ng-template #camposPersonales>
      <div [class]="CAMPO">
        <label [for]="ids.apellidos" [class]="ETIQUETA">Apellidos <span class="text-(--ro)">*</span></label>
        <input [id]="ids.apellidos" autocomplete="off" [class]="ENTRADA" [value]="form().apellidos" (input)="poner('apellidos', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.nombres" [class]="ETIQUETA">Nombres <span class="text-(--ro)">*</span></label>
        <input [id]="ids.nombres" autocomplete="off" [class]="ENTRADA" [value]="form().nombres" (input)="poner('nombres', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.tipoDocumento" [class]="ETIQUETA">Documento</label>
        <select [id]="ids.tipoDocumento" [class]="LISTA" (change)="poner('tipoDocumento', $any($event.target).value)">
          <option value="DNI" [selected]="form().tipoDocumento === 'DNI'">DNI</option>
          <option value="CE" [selected]="form().tipoDocumento === 'CE'">CE</option>
        </select>
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.numeroDocumento" [class]="ETIQUETA">Número <span class="text-(--ro)">*</span></label>
        <input [id]="ids.numeroDocumento" inputmode="numeric" [attr.maxlength]="form().tipoDocumento === 'DNI' ? 8 : 12" [class]="ENTRADA" [value]="form().numeroDocumento" (input)="poner('numeroDocumento', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.fechaNacimiento" [class]="ETIQUETA">Fecha de nacimiento <span class="text-(--ro)">*</span></label>
        <input [id]="ids.fechaNacimiento" type="date" [class]="ENTRADA" [value]="form().fechaNacimiento" (change)="poner('fechaNacimiento', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.nacionalidad" [class]="ETIQUETA">Nacionalidad</label>
        <input [id]="ids.nacionalidad" [class]="ENTRADA" [value]="form().nacionalidad" (input)="poner('nacionalidad', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.estadoCivil" [class]="ETIQUETA">Estado civil</label>
        <select [id]="ids.estadoCivil" [class]="LISTA" (change)="poner('estadoCivil', $any($event.target).value)">
          @for (e of ESTADOS_CIVILES; track e) { <option [value]="e" [selected]="e === form().estadoCivil">{{ e }}</option> }
        </select>
      </div>
    </ng-template>
    <ng-template #camposContacto>
      <div [class]="CAMPO">
        <label [for]="ids.telefonoMovil" [class]="ETIQUETA">Móvil <span class="text-(--ro)">*</span></label>
        <input [id]="ids.telefonoMovil" inputmode="numeric" maxlength="9" [class]="ENTRADA" [value]="form().telefonoMovil" (input)="poner('telefonoMovil', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.telefonoFijo" [class]="ETIQUETA">Teléfono fijo</label>
        <input [id]="ids.telefonoFijo" [class]="ENTRADA" [value]="form().telefonoFijo" (input)="poner('telefonoFijo', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.correo" [class]="ETIQUETA">Correo</label>
        <input [id]="ids.correo" type="email" [class]="ENTRADA" [value]="form().correo" (input)="poner('correo', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.direccion" [class]="ETIQUETA">Dirección</label>
        <input [id]="ids.direccion" [class]="ENTRADA" [value]="form().direccion" (input)="poner('direccion', $any($event.target).value)">
      </div>
      <div [class]="CAMPO">
        <label [for]="ids.distrito" [class]="ETIQUETA">Distrito</label>
        <input [id]="ids.distrito" [class]="ENTRADA" [value]="form().distrito" (input)="poner('distrito', $any($event.target).value)">
      </div>
    </ng-template>
    <ng-template #campoUsuario>
      <select [id]="ids.idUsuario" [class]="LISTA" (change)="poner('idUsuario', +$any($event.target).value || null)">
        <option value="" [selected]="!form().idUsuario">Sin vincular</option>
        @for (u of usuariosDelForm(); track u.idUsuario) { <option [value]="u.idUsuario" [selected]="u.idUsuario === form().idUsuario">{{ u.usuario }}</option> }
      </select>
    </ng-template>
  `
})
export class PersonalComponent implements OnInit, AfterViewChecked, OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);
  private readonly toast = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly REJILLA = REJILLA; protected readonly REJILLA_SOLA = REJILLA_SOLA; protected readonly REJILLA_FICHA = REJILLA_FICHA;
  protected readonly PRINCIPAL = PRINCIPAL; protected readonly CABECERA = CABECERA; protected readonly CABECERA_TEXTO = CABECERA_TEXTO;
  protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly FILTROS = FILTROS; protected readonly CAMPO = CAMPO;
  protected readonly ETIQUETA = ETIQUETA; protected readonly LISTA = LISTA; protected readonly ENTRADA = ENTRADA; protected readonly BUSCAR = BUSCAR;
  protected readonly BUSCAR_ICONO = BUSCAR_ICONO; protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO; protected readonly HERRAMIENTAS = HERRAMIENTAS;
  protected readonly ZONA = ZONA; protected readonly VACIO = VACIO; protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA;
  protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH; protected readonly TD = TD; protected readonly TD_1 = TD_1;
  protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly PILL = PILL; protected readonly BARRA = BARRA;
  protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_MAL = BARRA_ESTADO_MAL;
  protected readonly AVATAR = AVATAR; protected readonly AVATAR_SIN = AVATAR_SIN; protected readonly AVATAR_BOTON = AVATAR_BOTON;
  protected readonly MINI = MINI; protected readonly MINI_ICONO = MINI_ICONO; protected readonly MINI_PELIGRO = MINI_PELIGRO; protected readonly VOLVER = VOLVER; protected readonly USUARIO = USUARIO;
  protected readonly USUARIO_SIN = USUARIO_SIN; protected readonly TR_ABRE = TR_ABRE; protected readonly TR_ELEGIDA = TR_ELEGIDA;
  protected readonly SECCION_TITULO = SECCION_TITULO; protected readonly CAMPOS = CAMPOS; protected readonly AYUDA = AYUDA;
  protected readonly NOTA = NOTA; protected readonly ERROR = ERROR;
  /** Secundario en oscuro: el gris de los botones, como en el artifact. */
  protected readonly BOTON_SEC = 'dark:bg-muted dark:hover:bg-border';
  protected readonly ANCHO_TARJETA = ANCHO_TARJETA_REM;
  protected readonly ids = CAMPOS_ID;
  protected readonly MOTIVOS_CESE = MOTIVOS_CESE;
  protected readonly ESTADOS_CIVILES = ESTADOS_CIVILES;
  protected readonly MODALIDADES: Modalidad[] = ['PRESENCIAL', 'TELETRABAJO'];
  protected readonly SECCIONES: { clave: Seccion; texto: string }[] = [{ clave: 'datos', texto: 'Datos personales' }, { clave: 'historial', texto: 'Historial' }];
  protected readonly TITULO_ACCION: Record<Exclude<Accion, null>, string> = { datos: 'Editar datos', sub: 'Cambiar subcartera', mod: 'Cambiar modalidad', cese: 'Registrar cese' };

  /** Los avatares, ya confiados: son SVG propios, no vienen del usuario. */
  private readonly avatares: SafeHtml[] = AVATARES_PERSONAL.map(a =>
    this.sanitizer.bypassSecurityTrustHtml(a.replace('<svg ', '<svg width="100%" height="100%" ')));

  readonly fichas = signal<FichaPersonal[]>([]);
  readonly cargando = signal(false);
  readonly error = signal(false);
  readonly guardando = signal(false);

  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);
  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly busqueda = signal('');
  readonly estado = signal<Estado>('ACTIVO');
  /** Subcartera elegida en las tarjetas de arriba (filtro de la lista). */
  readonly grupo = signal<number | null>(null);
  readonly pagina = signal(1);
  readonly porPagina = signal(8);

  readonly abierta = signal<number | null>(null);
  readonly elegida = computed(() => this.fichas().find(f => f.id === this.abierta()) ?? null);
  /** La ficha del panel derecho: la elegida, salvo mientras se registra a alguien. */
  readonly fichaPanel = computed(() => this.nuevo() ? null : this.elegida());
  readonly seccion = signal<Seccion>('datos');
  readonly accion = signal<Accion>(null);
  readonly errorAccion = signal('');

  // Cambio de subcartera, modalidad y cese (comparten fecha y motivo).
  readonly cambioSubcarteras = signal<SubPortfolio[]>([]);
  readonly cambioSub = signal<number | null>(null);
  readonly cambioModalidad = signal<Modalidad>('TELETRABAJO');
  readonly cambioDesde = signal('');
  readonly cambioMotivo = signal('');
  readonly ceseMotivo = signal(MOTIVOS_CESE[0]);

  // Registro y edición de datos.
  readonly nuevo = signal<{ idCliente: number | null; idCartera: number | null; idSubcartera: number | null; modalidad: Modalidad } | null>(null);
  readonly nCarteras = signal<Portfolio[]>([]);
  readonly nSubcarteras = signal<SubPortfolio[]>([]);
  readonly form = signal<Form>(this.formVacio());
  readonly errorForm = signal('');
  readonly usuariosLibres = signal<UsuarioLibre[]>([]);
  readonly usuariosDelForm = computed(() => {
    const p = this.accion() === 'datos' ? this.elegida() : null;
    const libres = this.usuariosLibres();
    return p?.idUsuario && p.usuario && !libres.some(u => u.idUsuario === p.idUsuario)
      ? [{ idUsuario: p.idUsuario, usuario: p.usuario, nombre: null }, ...libres] : libres;
  });

  // Medidas: cuántas filas entran, si las tarjetas caben en una fila y cuántos avatares se ven por tarjeta.
  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;
  @ViewChild('tarjetas') private tarjetas?: ElementRef<HTMLElement>;
  readonly compacta = signal(false);
  private readonly visibles = signal<Record<number, number>>({});
  private observador?: ResizeObserver;
  private observadas: Element[] = [];
  private cuadro = 0;

  ngOnInit(): void {
    this.cargar();
    // Sin filtrar por `isActive`: el cliente real y varias de sus carteras figuran como inactivos.
    this.clientesServicio.getAllTenants().subscribe({
      next: c => this.clientes.set([...c].sort((a, b) => this.nombreCliente(a).localeCompare(this.nombreCliente(b)))),
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.servicio.fichas().subscribe({
      next: f => { this.fichas.set(f); this.cargando.set(false); },
      error: () => { this.error.set(true); this.cargando.set(false); }
    });
  }

  ngAfterViewChecked(): void {
    const vigiladas = [this.zona?.nativeElement, this.tarjetas?.nativeElement].filter((e): e is HTMLElement => !!e);
    if (vigiladas.length !== this.observadas.length || vigiladas.some((e, i) => e !== this.observadas[i])) {
      this.observador?.disconnect();
      this.observadas = vigiladas;
      this.observador = new ResizeObserver(() => this.medirLuego());
      vigiladas.forEach(e => this.observador!.observe(e));
    }
    this.medirLuego();
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
    cancelAnimationFrame(this.cuadro);
  }

  /** Se mide después de pintar, cuando el alto y el ancho ya son los finales. */
  private medirLuego(): void {
    cancelAnimationFrame(this.cuadro);
    this.cuadro = requestAnimationFrame(() => this.medir());
  }

  private medir(): void {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const fila = this.tarjetas?.nativeElement;
    if (fila) {
      const n = this.grupos().length, gap = .75 * rem;
      const compacta = n > 1 && fila.clientWidth < n * ANCHO_TARJETA_REM * rem + (n - 1) * gap;
      if (compacta !== this.compacta()) { this.compacta.set(compacta); return; }
      // Avatares que entran en una línea; si no entran todos, el último lugar es para «+N».
      const vis: Record<number, number> = {};
      fila.querySelectorAll<HTMLElement>('[data-grupo]').forEach(caja => {
        const g = this.grupos().find(x => x.id === +caja.dataset['grupo']!);
        const primero = caja.querySelector<HTMLElement>('button');
        if (!g || !primero) return;
        const uno = this.grupos().length === 1;
        // Cada avatar ocupa su ancho menos el solape (con nombres, su casilla más el hueco); el «+N» toma el último lugar.
        const paso = uno ? primero.offsetWidth + .25 * rem : primero.offsetWidth - .3125 * rem;
        const caben = Math.max(1, Math.floor((caja.clientWidth - 3 + (uno ? .25 * rem : 0)) / paso));
        vis[g.id] = g.gente.length <= caben ? g.gente.length : Math.max(1, caben - 1);
      });
      const antes = this.visibles();
      if (Object.keys(vis).some(k => antes[+k] !== vis[+k]) || Object.keys(antes).length !== Object.keys(vis).length) this.visibles.set(vis);
    }
    const zona = this.zona?.nativeElement, caja = this.caja?.nativeElement;
    if (zona && caja) {
      const n = filasQueEntran(zona, caja);
      if (n && n !== this.porPagina()) this.porPagina.set(n);
    }
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.accion()) this.accion.set(null);
    else if (this.abierta()) this.cerrarFicha();
  }

  // ---------- Ámbito ----------

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.grupo.set(null);
    this.pagina.set(1);
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
    this.grupo.set(null);
    this.pagina.set(1);
    if (!id) return;
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(ordenadas);
        if (ordenadas.length === 1) this.idSubcartera.set(ordenadas[0].id);
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.grupo.set(null);
    this.pagina.set(1);
  }

  // ---------- Listas ----------

  private readonly delAmbito = computed(() => {
    const cli = this.idCliente(), car = this.idCartera(), sub = this.idSubcartera();
    return this.fichas().filter(p => (!cli || p.idCliente === cli) && (!car || p.idCartera === car) && (!sub || p.idSubcartera === sub));
  });
  readonly activos = computed(() => this.delAmbito().filter(p => !this.cesado(p)));
  readonly cesados = computed(() => this.delAmbito().filter(p => this.cesado(p)));
  readonly sinUsuario = computed(() => this.activos().filter(p => !p.idUsuario).length);

  /** Una tarjeta por subcartera con gente activa; la más grande primero. */
  readonly grupos = computed<Grupo[]>(() => {
    const porSub = new Map<number, Grupo>();
    for (const p of this.activos()) {
      if (p.idSubcartera == null) continue;
      const g = porSub.get(p.idSubcartera) ?? { id: p.idSubcartera, subcartera: p.subcartera ?? '—', cartera: p.cartera ?? '',
        cliente: this.clienteCorto(p), tono: this.tonoDe(p), gente: [] };
      g.gente.push(p);
      porSub.set(p.idSubcartera, g);
    }
    return [...porSub.values()]
      .map(g => ({ ...g, gente: [...g.gente].sort((a, b) => this.nombreLista(a).localeCompare(this.nombreLista(b), 'es')) }))
      .sort((a, b) => b.gente.length - a.gente.length || a.id - b.id);
  });

  /** La lista plana: por subcartera (en el orden de las tarjetas) y por apellido. */
  readonly lista = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const g = this.estado() === 'ACTIVO' && this.grupos().length > 1 ? this.grupo() : null;
    const orden = this.grupos().map(x => x.id);
    const pos = (id: number | null) => { const i = orden.indexOf(id ?? -1); return i < 0 ? orden.length : i; };
    return (this.estado() === 'ACTIVO' ? this.activos() : this.cesados())
      .filter(p => (!g || p.idSubcartera === g)
        && (!q || this.nombreLista(p).toLowerCase().includes(q) || (p.numeroDocumento ?? '').includes(q) || (p.usuario ?? '').toLowerCase().includes(q)))
      .sort((a, b) => pos(a.idSubcartera) - pos(b.idSubcartera) || this.nombreLista(a).localeCompare(this.nombreLista(b), 'es'));
  });
  /** La columna Subcartera solo cuando la lista mezcla subcarteras. */
  readonly verSubcartera = computed(() => !(this.estado() === 'ACTIVO' && this.grupo()) && new Set(this.delAmbito().map(p => p.idSubcartera)).size > 1);
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.lista().length / this.porPagina()))));
  readonly paginaLista = computed(() => {
    const ini = (this.paginaActual() - 1) * this.porPagina();
    return this.lista().slice(ini, ini + this.porPagina());
  });

  alternarGrupo(id: number): void {
    this.grupo.set(this.grupo() === id ? null : id);
    this.pagina.set(1);
  }

  cuantosVen(g: Grupo): number {
    return this.visibles()[g.id] ?? g.gente.length;
  }

  // ---------- Lectura ----------

  cesado(p: FichaPersonal): boolean {
    return !!p.fechaCese && p.fechaCese < hoy();
  }

  nombreLista(p: FichaPersonal): string {
    return `${p.apellidos}, ${p.nombres}`;
  }

  nombreCorto(p: FichaPersonal): string {
    return `${p.nombres.split(' ')[0]} ${p.apellidos.split(' ')[0]}`;
  }

  nombreCliente(c: Tenant): string {
    return c.tenantName || c.businessName;
  }

  /** El nombre corto del cliente de la ficha (el de la lista de clientes, no la razón social). */
  clienteCorto(p: FichaPersonal): string {
    const c = this.clientes().find(x => x.id === p.idCliente);
    return c ? this.nombreCliente(c) : (p.cliente ?? '—');
  }

  tonoDe(p: FichaPersonal): string {
    return tonoSubcartera(p.cliente, p.subcartera);
  }

  /** Segunda línea de una tarjeta: con todos los clientes a la vista, el cliente; con uno elegido, la cartera. */
  subtituloGrupo(g: Grupo): string {
    const car = new NombrePropioPipe().transform(g.cartera), sub = new NombrePropioPipe().transform(g.subcartera);
    return this.idCliente() ? car : g.cliente + (car && car !== sub ? ', ' + car : '');
  }

  detalleGrupo(g: Grupo): string {
    const sin = g.gente.filter(p => !p.idUsuario).length, tele = g.gente.filter(p => p.modalidad === 'TELETRABAJO').length;
    return sin ? `${sin} sin usuario` : tele ? `${tele} en teletrabajo` : g.gente.length === 1 ? 'persona' : 'personas';
  }

  dma(iso: string | null): string {
    return iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '—';
  }

  /** «1 año 5 meses», contado hasta hoy o hasta su último día. */
  antiguedad(p: FichaPersonal): string {
    const fin = new Date(`${this.cesado(p) ? p.fechaCese : hoy()}T12:00:00`);
    const ini = new Date(`${p.fechaIngreso}T12:00:00`);
    if (fin < ini) return '—';
    let meses = (fin.getFullYear() - ini.getFullYear()) * 12 + fin.getMonth() - ini.getMonth();
    if (fin.getDate() < ini.getDate()) meses -= 1;
    if (meses < 1) {
      const d = Math.round((fin.getTime() - ini.getTime()) / 86400000) + 1;
      return `${d} ${d === 1 ? 'día' : 'días'}`;
    }
    const a = Math.floor(meses / 12), m = meses % 12;
    return [a ? `${a} ${a === 1 ? 'año' : 'años'}` : '', m ? `${m} ${m === 1 ? 'mes' : 'meses'}` : ''].filter(Boolean).join(' ');
  }

  edad(iso: string | null): string {
    if (!iso) return '';
    const a = new Date(`${hoy()}T12:00:00`), b = new Date(`${iso}T12:00:00`);
    let e = a.getFullYear() - b.getFullYear();
    if (a.getMonth() < b.getMonth() || (a.getMonth() === b.getMonth() && a.getDate() < b.getDate())) e--;
    return `${e} años`;
  }

  avatarDe(p: FichaPersonal): SafeHtml {
    return this.avatares[p.id % this.avatares.length];
  }

  modalidadDe(p: FichaPersonal): Modalidad {
    return p.modalidad === 'TELETRABAJO' ? 'TELETRABAJO' : 'PRESENCIAL';
  }

  nombreModalidad(m: Modalidad): string {
    return m === 'TELETRABAJO' ? 'Teletrabajo' : 'Presencial';
  }

  datosDe(p: FichaPersonal): [string, string][] {
    return [
      ['Nacimiento', p.fechaNacimiento ? `${this.dma(p.fechaNacimiento)}, ${this.edad(p.fechaNacimiento)}` : '—'],
      ['Nacionalidad', p.nacionalidad ?? '—'],
      ['Estado civil', p.estadoCivil ?? '—'],
      ['Móvil', p.telefonoMovil ?? '—'],
            ...(p.telefonoFijo ? [['Teléfono fijo', p.telefonoFijo] as [string, string]] : []),
      ['Correo', p.correo ?? '—'],
      ['Domicilio', [p.direccion, p.distrito].filter(Boolean).join(', ') || '—']
    ];
  }

  // ---------- Ficha ----------

  verFicha(p: FichaPersonal): void {
    this.estado.set(this.cesado(p) ? 'CESADO' : 'ACTIVO');
    if (this.grupo() && this.grupo() !== p.idSubcartera) this.grupo.set(null);
    this.abrir(p);
    // La lista va a la página de esa persona.
    const i = this.lista().findIndex(x => x.id === p.id);
    if (i >= 0) this.pagina.set(Math.floor(i / this.porPagina()) + 1);
  }

  alternarFicha(p: FichaPersonal): void {
    if (this.abierta() === p.id) this.cerrarFicha();
    else this.abrir(p);
  }

  private abrir(p: FichaPersonal): void {
    this.abierta.set(p.id);
    this.seccion.set('datos');
    this.accion.set(null);
    this.errorAccion.set('');
  }

  cerrarFicha(): void {
    this.abierta.set(null);
    this.accion.set(null);
  }

  /** Después de guardar: la ficha nueva reemplaza a la vieja en la lista. */
  private reemplazar(f: FichaPersonal): void {
    this.fichas.update(lista => lista.some(x => x.id === f.id) ? lista.map(x => x.id === f.id ? f : x) : [...lista, f]);
  }

  abrirAccion(p: FichaPersonal, a: Exclude<Accion, null>): void {
    this.errorAccion.set('');
    this.cambioMotivo.set('');
    if (a === 'datos') {
      this.form.set({
        apellidos: p.apellidos, nombres: p.nombres, tipoDocumento: p.tipoDocumento, numeroDocumento: p.numeroDocumento ?? '',
        fechaNacimiento: p.fechaNacimiento ?? '', nacionalidad: p.nacionalidad ?? '', estadoCivil: p.estadoCivil ?? ESTADOS_CIVILES[0],
        telefonoMovil: p.telefonoMovil ?? '', telefonoFijo: p.telefonoFijo ?? '', correo: p.correo ?? '',
        direccion: p.direccion ?? '', distrito: p.distrito ?? '', fechaIngreso: p.fechaIngreso, idUsuario: p.idUsuario
      });
      this.cargarUsuariosLibres();
    } else if (a === 'sub') {
      // Los cambios rigen desde un lunes: el próximo.
      this.cambioDesde.set(sumarDias(lunesDe(new Date()), 7));
      this.cambioSubcarteras.set([]);
      this.cambioSub.set(null);
      // Todas las subcarteras del cliente, de todas sus carteras, en un solo selector.
      if (p.idCliente) {
        this.carterasServicio.getPortfoliosByTenant(p.idCliente).pipe(
          switchMap(c => c.length ? forkJoin(c.map(x => this.carterasServicio.getSubPortfoliosByPortfolio(x.id))) : of([] as SubPortfolio[][]))
        ).subscribe({
          next: listas => {
            const todas = listas.flat().sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
            this.cambioSubcarteras.set(todas);
            this.cambioSub.set((todas.find(x => x.id !== p.idSubcartera) ?? todas[0])?.id ?? null);
          },
          error: () => this.toast.error('No se pudieron cargar las subcarteras')
        });
      }
    } else if (a === 'mod') {
      this.cambioModalidad.set(this.modalidadDe(p) === 'TELETRABAJO' ? 'PRESENCIAL' : 'TELETRABAJO');
      this.cambioDesde.set(hoy());
    } else {
      this.cambioDesde.set(hoy());
      this.ceseMotivo.set(MOTIVOS_CESE[0]);
    }
    this.accion.set(a);
  }

  /** Nombre de la subcartera; si otra del cliente se llama igual, con su cartera al lado. */
  rotuloSubcartera(s: SubPortfolio): string {
    const pipe = new NombrePropioPipe(), nombre = pipe.transform(s.subPortfolioName);
    const repetido = this.cambioSubcarteras().some(x => x.id !== s.id && x.subPortfolioName === s.subPortfolioName);
    return repetido ? `${nombre} (${pipe.transform(s.portfolioName)})` : nombre;
  }

  notaAccion(p: FichaPersonal): string {
    switch (this.accion()) {
      case 'sub': return 'Desde esa fecha usa el horario, las reglas y el calendario de la nueva subcartera.';
      case 'mod': return this.cambioModalidad() === 'TELETRABAJO'
        ? 'Desde esa fecha sus horas cuentan como remotas sin pedir solicitud.'
        : 'Desde esa fecha sus horas cuentan como presenciales; para un día remoto pide Teletrabajo.';
      case 'cese': return 'Sale del reporte de asistencia después de su último día. Sus semanas anteriores no cambian.';
      default: return '';
    }
  }

  guardarAccion(p: FichaPersonal): void {
    const a = this.accion();
    if (!a) return;
    if (a === 'datos') { this.guardarDatos(p); return; }
    const desde = this.cambioDesde(), motivo = this.cambioMotivo().trim();
    let error = '';
    if (a === 'sub') {
      const nueva = this.cambioSub();
      error = !nueva ? 'Elige la nueva subcartera' : nueva === p.idSubcartera ? 'Ya está en esa subcartera'
        : !desde ? 'Pon desde cuándo' : new Date(`${desde}T12:00:00`).getDay() !== 1 ? 'El cambio rige desde un lunes'
        : !motivo ? 'Escribe el motivo: queda en el historial' : '';
    } else if (a === 'mod') {
      error = this.cambioModalidad() === this.modalidadDe(p) ? `Ya está en ${this.nombreModalidad(this.cambioModalidad()).toLowerCase()}`
        : !desde ? 'Pon desde cuándo' : desde < p.fechaIngreso ? `No puede ser antes de su ingreso, el ${this.dma(p.fechaIngreso)}`
        : !motivo ? 'Escribe el motivo: queda en el historial' : '';
    } else {
      error = !desde ? 'Pon el último día de trabajo' : desde < p.fechaIngreso ? 'El cese no puede ser antes del ingreso' : '';
    }
    this.errorAccion.set(error);
    if (error) return;
    this.guardando.set(true);
    const peticion = a === 'sub' ? this.servicio.cambiarSubcartera(p.id, { idSubcartera: this.cambioSub()!, fechaDesde: desde, motivo })
      : a === 'mod' ? this.servicio.cambiarModalidad(p.id, { modalidad: this.cambioModalidad(), fechaDesde: desde, motivo })
      : this.servicio.registrarCese(p.id, { fecha: desde, motivo: this.ceseMotivo(), comentario: motivo || null });
    peticion.subscribe({
      next: ficha => {
        this.guardando.set(false);
        this.reemplazar(ficha);
        this.accion.set(null);
        this.toast.success(a === 'sub' ? `${this.nombreCorto(ficha)} pasa a ${ficha.subcartera ?? 'la nueva subcartera'} desde el ${this.dma(desde).slice(0, 5)}`
          : a === 'mod' ? `${this.nombreCorto(ficha)}: ${this.nombreModalidad(this.cambioModalidad()).toLowerCase()} desde el ${this.dma(desde).slice(0, 5)}`
          : `Cese de ${this.nombreCorto(ficha)} registrado`);
      },
      error: r => { this.guardando.set(false); this.errorAccion.set(r?.error?.error ?? 'No se pudo guardar'); }
    });
  }

  // ---------- Registro y edición ----------

  abrirNuevo(): void {
    const cli = this.idCliente() ?? this.clientes()[0]?.id ?? null;
    this.form.set(this.formVacio());
    this.errorForm.set('');
    this.nuevo.set({ idCliente: cli, idCartera: null, idSubcartera: null, modalidad: 'PRESENCIAL' });
    this.cargarUsuariosLibres();
    if (cli) this.nuevoCliente(cli, this.idCartera(), this.idSubcartera());
  }

  ponerNuevo(campo: 'idSubcartera' | 'modalidad', valor: number | Modalidad): void {
    const n = this.nuevo();
    if (n) this.nuevo.set({ ...n, [campo]: valor });
  }

  cancelarNuevo(): void {
    this.nuevo.set(null);
    this.errorForm.set('');
  }

  nuevoCliente(id: number, cartera: number | null = null, subcartera: number | null = null): void {
    const n = this.nuevo();
    if (!n) return;
    this.nuevo.set({ ...n, idCliente: id, idCartera: null, idSubcartera: null });
    this.nCarteras.set([]);
    this.nSubcarteras.set([]);
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const ordenadas = [...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.nCarteras.set(ordenadas);
        const elegida = ordenadas.find(x => x.id === cartera) ?? ordenadas[0];
        if (elegida) this.nuevaCartera(elegida.id, subcartera);
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  nuevaCartera(id: number, subcartera: number | null = null): void {
    const n = this.nuevo();
    if (!n) return;
    this.nuevo.set({ ...n, idCartera: id, idSubcartera: null });
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.nSubcarteras.set(ordenadas);
        const actual = this.nuevo();
        if (actual) this.nuevo.set({ ...actual, idSubcartera: (ordenadas.find(x => x.id === subcartera) ?? ordenadas[0])?.id ?? null });
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  private cargarUsuariosLibres(): void {
    this.servicio.usuariosLibres().subscribe({ next: u => this.usuariosLibres.set(u), error: () => this.usuariosLibres.set([]) });
  }

  private formVacio(): Form {
    return { apellidos: '', nombres: '', tipoDocumento: 'DNI', numeroDocumento: '', fechaNacimiento: '', nacionalidad: 'Peruana',
      estadoCivil: ESTADOS_CIVILES[0], telefonoMovil: '', telefonoFijo: '', correo: '', direccion: '', distrito: '',
      fechaIngreso: sumarDias(lunesDe(new Date()), 7), idUsuario: null };
  }

  poner(campo: Campo, valor: unknown): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    this.errorForm.set('');
    this.errorAccion.set('');
  }

  /** El primer error del formulario, en el orden de los campos; vacío si todo está bien. */
  private errorDelForm(idActual: number | null): string {
    const f = this.form();
    const v = (c: Campo) => String(f[c] ?? '').trim();
    if (!v('apellidos')) return 'Escribe los apellidos';
    if (!v('nombres')) return 'Escribe los nombres';
    const doc = v('numeroDocumento');
    if (!doc) return 'Escribe el número de documento';
    if (f.tipoDocumento === 'DNI' && !/^\d{8}$/.test(doc)) return 'El DNI tiene 8 dígitos';
    if (f.tipoDocumento === 'CE' && !/^[A-Za-z0-9]{8,12}$/.test(doc)) return 'El carné de extranjería tiene de 8 a 12 letras o números';
    if (this.fichas().some(p => p.tipoDocumento === f.tipoDocumento && p.numeroDocumento === doc && p.id !== idActual)) return 'Ya hay alguien registrado con ese documento';
    if (!v('fechaNacimiento')) return 'Pon la fecha de nacimiento';
    const edad = (new Date(`${hoy()}T12:00:00`).getTime() - new Date(`${v('fechaNacimiento')}T12:00:00`).getTime()) / (365.25 * 86400000);
    if (edad < 18) return 'Debe ser mayor de edad';
    if (!v('telefonoMovil')) return 'Escribe el móvil';
    if (!/^9\d{8}$/.test(v('telefonoMovil'))) return 'El móvil tiene 9 dígitos y empieza con 9';
    if (v('correo') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('correo'))) return 'Revisa el correo';
    if (!v('fechaIngreso')) return 'Pon la fecha de ingreso';
    return '';
  }

  private datosDelForm(idSubcartera: number | null, modalidad: Modalidad | null): DatosPersonal {
    const f = this.form();
    const limpio = (t: string) => t.trim() || null;
    return {
      tipoDocumento: f.tipoDocumento, numeroDocumento: f.numeroDocumento.trim(), apellidos: f.apellidos.trim(), nombres: f.nombres.trim(),
      fechaNacimiento: f.fechaNacimiento, nacionalidad: limpio(f.nacionalidad), estadoCivil: limpio(f.estadoCivil),
      telefonoMovil: f.telefonoMovil.trim(), telefonoFijo: limpio(f.telefonoFijo), correo: limpio(f.correo),
      direccion: limpio(f.direccion), distrito: limpio(f.distrito), idUsuario: f.idUsuario, fechaIngreso: f.fechaIngreso,
      idSubcartera, modalidad
    };
  }

  registrar(): void {
    const n = this.nuevo();
    if (!n) return;
    const error = this.errorDelForm(null) || (!n.idSubcartera ? 'Elige la subcartera' : '');
    this.errorForm.set(error);
    if (error) return;
    this.guardando.set(true);
    this.servicio.registrarFicha(this.datosDelForm(n.idSubcartera, n.modalidad)).subscribe({
      next: ficha => {
        this.guardando.set(false);
        this.reemplazar(ficha);
        this.nuevo.set(null);
        this.estado.set('ACTIVO');
        this.abrir(ficha);
        this.toast.success(`${this.nombreCorto(ficha)} registrado en ${ficha.subcartera}`);
      },
      error: r => { this.guardando.set(false); this.errorForm.set(r?.error?.error ?? 'No se pudo registrar'); }
    });
  }

  private guardarDatos(p: FichaPersonal): void {
    const error = this.errorDelForm(p.id);
    this.errorAccion.set(error);
    if (error) return;
    this.guardando.set(true);
    this.servicio.editarFicha(p.id, this.datosDelForm(null, null)).subscribe({
      next: ficha => {
        this.guardando.set(false);
        this.reemplazar(ficha);
        this.accion.set(null);
        this.toast.success(`Datos de ${this.nombreCorto(ficha)} guardados`);
      },
      error: r => { this.guardando.set(false); this.errorAccion.set(r?.error?.error ?? 'No se pudo guardar'); }
    });
  }
}
