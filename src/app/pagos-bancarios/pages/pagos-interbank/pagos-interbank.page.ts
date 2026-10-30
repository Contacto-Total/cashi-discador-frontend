import { AfterViewChecked, Component, ElementRef, EventEmitter, Injector, OnDestroy, OnInit, Output, ViewChild, afterNextRender, computed, inject, signal } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../shared/ui/tarjeta.directive';
import { TituloTarjetaComponent } from '../../../shared/ui/titulo-tarjeta.component';
import { PageHeaderComponent } from '../../../shared/ui/page-header.component';
import { FormatService } from '@/shared/services/format.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Alcance, AlcanceService } from '../../../core/services/alcance.service';
import { TenantService } from '../../../maintenance/services/tenant.service';
import { PortfolioService } from '../../../maintenance/services/portfolio.service';
import { Tenant } from '../../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../../maintenance/models/portfolio.model';
import { BcpPagosService } from '../../services/bcp-pagos.service';
import { ReportePagosBancariosService } from '../../services/reporte-pagos-bancarios.service';
import {
  ArchivoCargaHistorialItem,
  BcpArchivoResultado,
  PagoBancoPendiente,
  PagoNoConfirmadoBanco,
  PrevalidacionArchivoBcp,
  ResumenConciliacionCliente
} from '../../models/bcp-archivo.model';
import { DetallePagoBancario } from '../../models/reporte-pagos-bancarios.model';
import { ALERTAS_PREVALIDACION, MOTIVOS_CORTOS, aFechaIso, esClienteInterbank, fechaCorta, infoCategoria, mesDeFecha, nombreMes } from '../../models/categoria-pago';
import { ContextoIbk, PagoIbkPorResolver, PagoIbkResolverWidget } from '../../widgets/pago-ibk-resolver.widget';
import { ClienteResumenConciliacionDrawerWidget } from '../../widgets/cliente-resumen-conciliacion-drawer.widget';
import { CorreccionClienteDialogWidget, CorreccionClienteSolicitud } from '../../widgets/correccion-cliente-dialog.widget';
import { HistorialCargasBcpWidget } from '../../widgets/historial-cargas-bcp.widget';
import { HistorialCambiosWidget } from '../../widgets/historial-cambios.widget';

type Vista = 'lista' | 'carga' | 'historial';
type Filtro = 'pend' | 'rev' | 'par' | 'conf' | 'conc' | 'nc';
type FiltroCarga = 'nuevos' | 'conc' | 'par' | 'vol' | 'rev' | 'nc' | 'ya' | 'rv';
type Tono = 'ok' | 'am' | 'ro' | 'info' | 'neu';

/** Fila de la lista: un pago del banco o, en No confirmados, un pago del asesor que el banco no reportó. */
interface FilaPago {
  clave: string;
  id: number | null;
  documento: string;
  nombre: string;
  cuenta: string | null;
  producto: string | null;
  moneda: string | null;
  estado: string;
  tono: Tono;
  detalle: string;
  monto: number | null;
  fecha: string;
  montoAsesor: number | null;
  /** Qué se puede hacer en la fila. */
  accion: 'resolver' | 'espera' | 'restaurar' | null;
  motivo: string | null;
}

/** Fila de la revisión de la carga. `retenida` se escribe sobre la fila de la prevalidación. */
interface FilaCarga {
  clave: string;
  grupo: FiltroCarga;
  fila: (PrevalidacionArchivoBcp & { __indice: number }) | null;
  documento: string;
  nombre: string;
  cuenta: string | null;
  producto: string | null;
  moneda: string | null;
  fechaBanco: string;
  montoBanco: number;
  fechaAsesor: string | null;
  montoAsesor: number | null;
  estado: string;
  tono: Tono;
  detalle: string;
  alerta: string;
}

const CONCILIADOS = ['CONCILIADO', 'CONCILIADO_POR_SUMA', 'CONCILIADO_POR_SUMA_CON_DESFASE', 'CONCILIADO_CON_DESFASE', 'CONCILIADO_POR_PARTES'];
const NO_CUENTAN = ['NO_CORRESPONDE', 'OMITIDO_POR_FECHA', 'CLIENTE_NO_ENCONTRADO'];
const FILAS_POR_PEDIDO = 200;

function tonoDe(categoria: string | null | undefined): Tono {
  if (CONCILIADOS.includes(String(categoria))) return 'ok';
  if (categoria === 'PARCIAL_EN_ESPERA') return 'am';
  if (categoria === 'PAGO_VOLUNTARIO') return 'info';
  if (categoria === 'REQUIERE_REVISION') return 'ro';
  return 'neu';
}

/** Pagos de Interbank: pendientes, montos del mes y carga del archivo del banco. */
@Component({
  selector: 'app-pagos-interbank',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, FormsModule, RouterLink, LucideAngularModule, BotonDirective, TarjetaDirective, TituloTarjetaComponent, PageHeaderComponent,
    PagoIbkResolverWidget, ClienteResumenConciliacionDrawerWidget, CorreccionClienteDialogWidget, HistorialCargasBcpWidget, HistorialCambiosWidget],
  host: { class: 'cashi-pantalla flex min-h-0 flex-1 flex-col gap-3' },
  template: `
    @if (vista() === 'lista') {
      <div class="font-cashi grid min-h-0 flex-1 grid-cols-[minmax(0,2.35fr)_minmax(20rem,1fr)] grid-rows-[minmax(0,1fr)] items-stretch gap-3 text-[.875rem] leading-[1.5] text-foreground antialiased max-[56rem]:grid-cols-[minmax(0,1fr)]">
        <section appTarjeta class="flex min-h-0 flex-col overflow-hidden px-8 pt-[clamp(1rem,2.6vh,2rem)] pb-5">
          <ng-container [ngTemplateOutlet]="cabecera"></ng-container>

          <div class="mb-5 grid flex-none grid-cols-6 gap-3">
            @for (t of tarjetas(); track t.id) {
              <button type="button" [attr.aria-pressed]="filtro() === t.id" (click)="elegirFiltro(t.id)"
                      [style.--t]="color(t.tono)" [style.--t-bg]="fondo(t.tono)"
                      class="font-cashi flex min-w-0 cursor-pointer flex-col gap-1 rounded-xl border! bg-card px-3.5 py-3 text-left max-[81rem]:px-2.5 text-foreground shadow-[0_1px_2px_rgb(15_23_42/.04)] transition-[background-color,border-color] duration-150"
                      [ngClass]="filtro() === t.id ? 'border-(--t)! bg-(--t-bg)! shadow-[0_0_0_1px_var(--t)]' : 'border-border! hover:border-[color-mix(in_oklab,var(--t)_40%,var(--border))]! hover:bg-[color-mix(in_oklab,var(--t)_6%,transparent)]'">
                <span class="text-[1.5rem] leading-[1.15] font-bold" [style.color]="filtro() === t.id ? 'var(--t)' : null">{{ t.total }}</span>
                <span class="text-[.75rem] text-muted-foreground" [style.color]="filtro() === t.id ? 'var(--t)' : null">{{ t.etiqueta }}</span>
              </button>
            }
          </div>

          <div class="mb-3 flex flex-none flex-wrap items-center gap-x-3 gap-y-2">
            <select id="ibk-mes" aria-label="Mes" [class]="LISTA + ' flex-[0_0_10rem]! w-auto!'" [ngModel]="mes()" (ngModelChange)="elegirMes($event)">
              @for (m of meses(); track m) {
                <option [value]="m">{{ nombreDeMes(m) }}</option>
              }
            </select>
            <label class="relative ml-auto block min-w-44 flex-[0_1_17rem]">
              <lucide-angular name="search" [size]="16" class="pointer-events-none absolute top-1/2 left-2.5 flex size-4 -translate-y-1/2 text-muted-foreground [&>svg]:static!"></lucide-angular>
              <input [class]="BUSCADOR" placeholder="Buscar CJ, DNI o nombre" [ngModel]="busqueda()" (ngModelChange)="buscar($event)">
            </label>
            <button type="button" appBoton="secundario" appBotonAlto="chico" class="flex-none" [disabled]="!pagosDelMes().length" (click)="descargarExcel()">
              <lucide-angular name="download" [size]="14"></lucide-angular>Descargar Excel
            </button>
          </div>

          <div #zonaLista class="-mx-8 min-h-0 flex-1 overflow-y-auto px-8">
            <div [class]="REJILLA + ' border-b border-border py-2.5 text-[.75rem] font-medium text-muted-foreground'">
              <span>Cliente</span><span>Estado</span><span>Pago</span><span></span>
            </div>
            @if (cargando()) {
              <p class="m-0 px-2 py-4 text-muted-foreground">Cargando pagos…</p>
            } @else if (error(); as e) {
              <div role="alert" class="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-[.625rem] border border-(--ro-ln) bg-(--ro-bg) px-3 py-2.5 font-medium text-(--ro)">
                <span>{{ e }}</span>
                <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="cargar()">Reintentar</button>
              </div>
            } @else {
              @for (f of paginaLista(); track f.clave) {
                <div data-fila [id]="'fila-' + f.clave" [class]="REJILLA + ' py-[.5625rem]'" [ngClass]="abierta() === f.clave ? '' : 'border-b border-border last:border-b-0'">
                  <div class="min-w-0">
                    <button type="button" class="font-cashi block max-w-full cursor-pointer truncate border-0! bg-transparent p-0! text-left font-semibold text-foreground hover:underline" (click)="abrirResumen(f.documento)">{{ f.nombre }}</button>
                    <span class="block truncate text-[.75rem] text-muted-foreground">DNI {{ f.documento }}{{ f.cuenta ? ', CJ ' + f.cuenta : '' }}</span>
                  </div>
                  <div class="flex min-w-0 flex-col items-start">
                    <span [class]="PILL + ' ' + pill(f.tono)">{{ f.estado }}</span>
                    @if (f.detalle) {
                      <span class="mt-1 text-[.75rem] leading-[1.3] text-muted-foreground">{{ f.detalle }}</span>
                    }
                  </div>
                  <div class="min-w-0">
                    <span class="block font-semibold">{{ f.monto === null ? '—' : monto(f.monto, f.moneda) }}</span>
                    <span class="block truncate text-[.75rem] text-muted-foreground">{{ fechaCorta(f.fecha).slice(0, 5) }}{{ f.montoAsesor !== null ? ', asesor ' + monto(f.montoAsesor, f.moneda) : '' }}</span>
                  </div>
                  <div class="text-right">
                    @if (f.accion === 'resolver') {
                      <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === f.clave" (click)="alternarResolver(f)">Resolver</button>
                    } @else if (f.accion === 'espera') {
                      <span class="text-[.75rem] text-muted-foreground">En espera del banco</span>
                    } @else if (f.accion === 'restaurar') {
                      <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="restaurar(f)">Volver a pendientes</button>
                    }
                  </div>
                </div>
                @if (abierta() === f.clave && porResolver(); as pago) {
                  <div class="border-b border-border px-2 pb-5">
                    <app-pago-ibk-resolver [pago]="pago" [contexto]="contexto()!" (listo)="llevarFilaALaVista()" (cerrado)="alCerrarResolver($event)"></app-pago-ibk-resolver>
                  </div>
                }
              } @empty {
                <div class="mt-3 rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Sin pagos</div>
              }
            }
          </div>

          <ng-container [ngTemplateOutlet]="paginacion" [ngTemplateOutletContext]="{ total: filasLista().length, tam: tamLista(), pagina: paginaActualLista(), ir: irLista }"></ng-container>
        </section>

        <div class="flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto">
          <section appTarjeta [class]="MONTO">
            <app-titulo-tarjeta titulo="Recibido del banco"></app-titulo-tarjeta>
            <div [class]="CIFRA">
              <span class="text-[1.625rem] leading-[1.2] font-bold [@media(max-height:740px)]:text-[1.375rem]">{{ monto(montos().recibido.pen, 'PEN') }}</span>
              @if (montos().recibido.usd) {
                <span class="text-[.9375rem] font-semibold text-foreground/85">{{ monto(montos().recibido.usd, 'USD') }}</span>
              }
            </div>
          </section>

          <section appTarjeta [class]="MONTO + ' grow-2'">
            <app-titulo-tarjeta titulo="Conciliado"></app-titulo-tarjeta>
            <div [class]="CIFRA">
              <span class="text-[1.625rem] leading-[1.2] font-bold text-(--ok) [@media(max-height:740px)]:text-[1.375rem]">{{ monto(montos().conciliado.pen, 'PEN') }}</span>
              @if (montos().conciliado.usd) {
                <span class="text-[.9375rem] font-semibold text-foreground/85">{{ monto(montos().conciliado.usd, 'USD') }}</span>
              }
            </div>
            <div class="flex flex-col gap-2 border-t border-border pt-2.5">
              <div class="flex justify-between gap-3"><span class="flex-none text-muted-foreground">Por conciliar</span><span class="min-w-0 text-right font-semibold">{{ montosDe(montos().porConciliar) }}</span></div>
              <div class="flex justify-between gap-3"><span class="flex-none text-muted-foreground">No corresponde</span><span class="min-w-0 text-right font-semibold">{{ montosDe(montos().noCorresponde) }}</span></div>
            </div>
          </section>

          <section appTarjeta class="flex flex-[3_0_auto] flex-col gap-3.5 px-5 py-[clamp(.875rem,2vh,1.25rem)] [@media(max-height:740px)]:gap-2">
            <div class="flex items-center justify-between gap-3">
              <app-titulo-tarjeta titulo="Archivo del banco"></app-titulo-tarjeta>
              <button type="button" appBoton="secundario" appBotonAlto="chico" class="flex-none" (click)="vista.set('historial')">Historial</button>
            </div>
            <div class="flex flex-1 flex-col justify-between gap-2 [@media(max-height:740px)]:gap-1">
              <div class="flex justify-between gap-3"><span class="flex-none text-muted-foreground">Archivo</span><span class="min-w-0 truncate text-right font-semibold">{{ ultimoArchivo()?.nombreArchivo || '—' }}</span></div>
              <div class="flex justify-between gap-3"><span class="flex-none text-muted-foreground">Fecha</span><span class="min-w-0 text-right font-semibold">{{ fechaHora(ultimoArchivo()?.fechaCarga) }}</span></div>
              <div class="flex justify-between gap-3"><span class="flex-none text-muted-foreground">Usuario</span><span class="min-w-0 truncate text-right font-semibold">{{ ultimoArchivo()?.subidoPorNombre || '—' }}</span></div>
              <div class="flex justify-between gap-3"><span class="flex-none text-muted-foreground">Nuevos</span><span class="min-w-0 text-right font-semibold">{{ nuevosDelArchivo() }}</span></div>
            </div>
            <button type="button" appBoton appBotonAlto="grande" class="w-full flex-none" [disabled]="!contexto()" (click)="abrirCarga()">
              <lucide-angular name="upload" [size]="16"></lucide-angular>Subir nuevo archivo
            </button>
          </section>
        </div>
      </div>

      <div appTarjeta class="font-cashi flex flex-none flex-wrap items-center gap-2 py-3 pr-3 pl-5 text-[.875rem] leading-[1.5] text-foreground antialiased">
        <span class="mr-auto font-medium" [ngClass]="totalPendientes() ? 'text-foreground' : 'text-muted-foreground'">{{ totalPendientes() ? totalPendientes() + ' pagos pendientes' : 'Sin pagos pendientes' }}</span>
        <a appBoton="secundario" class="flex-none px-4!" routerLink="/correccion-pagos">Corrección de pagos</a>
        <button type="button" appBoton="secundario" class="flex-none px-4!" [disabled]="reevaluando() || !contexto()" (click)="reevaluar()">
          <lucide-angular [name]="reevaluando() ? 'loader-2' : 'refresh-cw'" [size]="16" [class.animate-spin]="reevaluando()"></lucide-angular>Reevaluar pendientes
        </button>
      </div>
    }

    @if (vista() === 'carga') {
      <section appTarjeta class="font-cashi flex min-h-0 flex-1 flex-col overflow-hidden px-8 pt-[clamp(1rem,2.6vh,2rem)] pb-5 text-[.875rem] leading-[1.5] text-foreground antialiased">
        <ng-container [ngTemplateOutlet]="cabecera"></ng-container>

        <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
          <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="volverALista()">
            <lucide-angular name="arrow-left" [size]="14"></lucide-angular>Pagos bancarios
          </button>
          <app-titulo-tarjeta titulo="Cargar archivo del banco"></app-titulo-tarjeta>
          <ol class="m-0 ml-auto flex list-none flex-wrap gap-x-7 gap-y-2 p-0 text-muted-foreground">
            @for (p of PASOS; track p; let i = $index) {
              <li class="flex items-center gap-2" [ngClass]="i === paso() ? 'font-semibold text-foreground' : ''">
                <span class="grid size-6 place-items-center rounded-full border text-[.75rem] font-semibold"
                      [ngClass]="i < paso() ? 'border-(--ok) bg-(--ok-pt) text-white' : i === paso() ? 'border-(--ok) text-(--ok)' : 'border-(--campo-ln)'">
                  @if (i < paso()) { <lucide-angular name="check" [size]="14"></lucide-angular> } @else { {{ i + 1 }} }
                </span>{{ p }}
              </li>
            }
          </ol>
        </div>

        @if (!resultado() && !guardado()) {
          <div class="flex min-h-0 flex-1 flex-col gap-3">
            <div class="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border-[1.5px] border-dashed border-(--campo-ln) bg-[color-mix(in_srgb,var(--muted)_40%,transparent)] p-6 text-center"
                 [ngClass]="arrastrando() ? 'border-ring!' : ''"
                 (dragover)="$event.preventDefault(); arrastrando.set(true)" (dragleave)="arrastrando.set(false)" (drop)="soltar($event)">
              <div>
                <span class="block font-semibold">{{ archivo()?.name || 'Arrastra el archivo aquí' }}</span>
                <span class="block text-[.75rem] text-muted-foreground">TRD_CASTIGO_AAAAMMDD.xlsx, hoja HOLISTICO_PAGOS</span>
              </div>
              <button type="button" appBoton="secundario" (click)="selector.click()">Elegir archivo</button>
              <input #selector type="file" accept=".xlsx,.xls" hidden (change)="elegirArchivo($event)">
            </div>
            @if (errorCarga(); as e) {
              <p role="alert" class="m-0 text-[.75rem] font-medium text-(--ro)">{{ e }}</p>
            }
          </div>
        } @else if (guardado(); as g) {
          <div class="flex flex-wrap items-center gap-3.5 rounded-xl border border-(--ok-ln) bg-(--ok-bg) px-4.5 py-4 text-(--ok)">
            <div class="min-w-48 flex-1">
              <span class="block text-[1rem] font-bold">Carga guardada</span>
              <span class="block text-[.75rem]">{{ g }}</span>
            </div>
            <button type="button" appBoton="secundario" (click)="volverALista()">Ver pagos</button>
          </div>
        } @else {
          <div class="mb-3 flex flex-none flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-3">
            <div class="min-w-40 flex-1">
              <span class="block font-semibold">{{ resultado()?.nombreArchivo }}</span>
              <span class="block text-[.75rem] text-muted-foreground">Hoja HOLISTICO_PAGOS</span>
            </div>
            <label class="relative block min-w-44 flex-[0_1_17rem]">
              <lucide-angular name="search" [size]="16" class="pointer-events-none absolute top-1/2 left-2.5 flex size-4 -translate-y-1/2 text-muted-foreground [&>svg]:static!"></lucide-angular>
              <input [class]="BUSCADOR" placeholder="Buscar CJ, DNI o nombre" [ngModel]="busquedaCarga()" (ngModelChange)="buscarCarga($event)">
            </label>
            <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="cambiarArchivo()">Cambiar archivo</button>
          </div>

          @if (filasSinCargar().length) {
            <p role="status" class="m-0 mb-3 flex-none rounded-[.625rem] border border-(--am-ln) bg-(--am-bg) px-3.5 py-2.5 text-(--am)">Sin cargar: {{ filasSinCargar().join('; ') }}</p>
          }

          <div class="mb-1 flex flex-none flex-wrap gap-1.5" role="group" aria-label="Filtrar pagos">
            @for (p of pillsCarga(); track p.id) {
              <button type="button" [attr.aria-pressed]="filtroCarga() === p.id" (click)="elegirFiltroCarga(p.id)"
                      [style.--t]="color(p.tono)" [style.--t-bg]="fondo(p.tono)"
                      class="font-cashi inline-flex cursor-pointer items-center gap-2 rounded-full border! bg-transparent px-3 py-[.3125rem] text-[.8125rem] font-semibold transition-[background-color,border-color,color] duration-150"
                      [ngClass]="filtroCarga() === p.id ? 'border-(--t)! bg-(--t-bg)! text-(--t)' : 'border-border! text-foreground/85 hover:border-[color-mix(in_oklab,var(--t)_40%,var(--border))]! hover:bg-[color-mix(in_oklab,var(--t)_6%,transparent)]'">
                {{ p.etiqueta }}<span [ngClass]="filtroCarga() === p.id ? 'text-(--t)' : 'text-muted-foreground'">{{ p.total }}</span>
              </button>
            }
          </div>

          <div #zonaCarga class="-mx-8 min-h-0 flex-1 overflow-y-auto px-8">
            <div [class]="REJILLA_CARGA + ' border-b border-border py-2.5 text-[.75rem] font-medium text-muted-foreground'">
              <span>Producto</span><span>Cliente</span><span>Pago del banco</span><span>Pago del asesor</span><span>Resultado</span><span></span>
            </div>
            @for (f of paginaCarga(); track f.clave) {
              <div data-fila [id]="'fila-' + f.clave" [class]="REJILLA_CARGA + ' py-[.5625rem]'" [ngClass]="abierta() === f.clave ? '' : 'border-b border-border last:border-b-0'">
                <div class="min-w-0">
                  <span class="block truncate">{{ f.cuenta || '—' }}</span>
                  <span class="block truncate text-[.75rem] text-muted-foreground">{{ f.producto }}{{ f.moneda ? ', ' + f.moneda : '' }}</span>
                </div>
                <div class="min-w-0">
                  @if (f.documento) {
                    <button type="button" class="font-cashi block max-w-full cursor-pointer truncate border-0! bg-transparent p-0! text-left font-semibold text-foreground hover:underline" (click)="abrirResumen(f.documento)">{{ f.nombre }}</button>
                    <span class="block truncate text-[.75rem] text-muted-foreground">DNI {{ f.documento }}</span>
                  } @else {
                    <span class="block font-semibold">—</span>
                    <span class="block text-[.75rem] text-muted-foreground">Fuera de la cartera</span>
                  }
                </div>
                <div class="min-w-0">
                  <span class="block font-semibold">{{ monto(f.montoBanco, f.moneda) }}</span>
                  <span class="block text-[.75rem] text-muted-foreground">{{ fechaCorta(f.fechaBanco) }}</span>
                </div>
                <div class="min-w-0">
                  @if (f.montoAsesor !== null) {
                    <span class="block font-semibold">{{ monto(f.montoAsesor, f.moneda) }}</span>
                    <span class="block text-[.75rem] text-muted-foreground">{{ fechaCorta(f.fechaAsesor).slice(0, 5) }}</span>
                  } @else {
                    <span class="text-muted-foreground">—</span>
                  }
                </div>
                <div class="flex min-w-0 flex-col items-start">
                  <span [class]="PILL + ' ' + pill(f.tono)">{{ f.estado }}</span>
                  @if (f.detalle) { <span class="mt-1 text-[.75rem] leading-[1.3] text-muted-foreground">{{ f.detalle }}</span> }
                  @if (f.alerta) { <span class="mt-1 text-[.75rem] font-medium text-(--ro)">{{ f.alerta }}</span> }
                  @if (f.fila?.retenerRevision) { <span class="mt-1 text-[.75rem] text-muted-foreground">Retenido</span> }
                </div>
                <div class="text-right">
                  @if (f.grupo === 'rev') {
                    <button type="button" appBoton="secundario" appBotonAlto="chico" [attr.aria-expanded]="abierta() === f.clave" (click)="alternarResolverCarga(f)">Resolver</button>
                  } @else if (f.alerta) {
                    <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="alternarRetener(f)">{{ f.fila?.retenerRevision ? 'Quitar retención' : 'Retener' }}</button>
                  }
                </div>
              </div>
              @if (abierta() === f.clave && porResolver(); as pago) {
                <div class="border-b border-border px-2 pb-5">
                  <app-pago-ibk-resolver [pago]="pago" [contexto]="contexto()!" (listo)="llevarFilaALaVista()" (cerrado)="alCerrarResolverCarga($event)"></app-pago-ibk-resolver>
                </div>
              }
            } @empty {
              <div class="mt-3 rounded-xl border border-dashed border-(--campo-ln) px-4 py-8 text-center text-muted-foreground">Sin pagos</div>
            }
          </div>

          <ng-container [ngTemplateOutlet]="paginacion" [ngTemplateOutletContext]="{ total: filasCargaVisibles().length, tam: tamCarga(), pagina: paginaActualCarga(), ir: irCarga }"></ng-container>
        }
      </section>

      <div appTarjeta class="font-cashi flex flex-none flex-wrap items-center gap-2 py-3 pr-3 pl-5 text-[.875rem] leading-[1.5] text-foreground antialiased">
        @if (guardado()) {
          <span class="mr-auto font-medium text-muted-foreground">Carga guardada</span>
        } @else if (resultado()) {
          <span class="mr-auto font-medium">{{ paraGuardar().length }} pagos sin guardar</span>
          @if (alertasActivas()) {
            <label class="flex items-center gap-2"><input type="checkbox" class="size-4 accent-ring" [(ngModel)]="alertasRevisadas">Revisé el pago con alerta</label>
          }
          <button type="button" appBoton="secundario" class="flex-none px-4!" [disabled]="guardando()" (click)="cambiarArchivo()">Descartar</button>
          <button type="button" appBoton class="flex-none px-4!" [disabled]="!puedeGuardar()" (click)="guardar()">
            <lucide-angular [name]="guardando() ? 'loader-2' : 'check'" [size]="16" [class.animate-spin]="guardando()"></lucide-angular>Guardar carga
          </button>
        } @else {
          <span class="mr-auto font-medium" [ngClass]="archivo() ? 'text-foreground' : 'text-muted-foreground'">{{ archivo() ? 'Archivo listo' : 'Sin archivo' }}</span>
          <button type="button" appBoton class="flex-none px-4!" [disabled]="!archivo() || procesando()" (click)="procesar()">
            <lucide-angular [name]="procesando() ? 'loader-2' : 'upload'" [size]="16" [class.animate-spin]="procesando()"></lucide-angular>Procesar archivo
          </button>
        }
      </div>
    }

    @if (vista() === 'historial') {
      <section appTarjeta class="font-cashi flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-8 pt-[clamp(1rem,2.6vh,2rem)] pb-5 text-[.875rem] leading-[1.5] text-foreground antialiased">
        <div class="flex flex-none flex-wrap items-center gap-3">
          <button type="button" appBoton="secundario" appBotonAlto="chico" (click)="vista.set('lista')">
            <lucide-angular name="arrow-left" [size]="14"></lucide-angular>Pagos bancarios
          </button>
          <app-titulo-tarjeta titulo="Historial"></app-titulo-tarjeta>
          <div class="ml-auto grid w-[min(100%,22rem)] grid-cols-2 gap-[.1875rem] rounded-lg bg-muted p-[.1875rem]" role="group" aria-label="Tipo de historial">
            <button type="button" [class]="PESTANA" [ngClass]="vistaHistorial() === 'cargas' ? PESTANA_ACTIVA : PESTANA_REPOSO" [attr.aria-pressed]="vistaHistorial() === 'cargas'" (click)="vistaHistorial.set('cargas')">Cargas de archivos</button>
            <button type="button" [class]="PESTANA" [ngClass]="vistaHistorial() === 'cambios' ? PESTANA_ACTIVA : PESTANA_REPOSO" [attr.aria-pressed]="vistaHistorial() === 'cambios'" (click)="vistaHistorial.set('cambios')">Historial de cambios</button>
          </div>
        </div>
        @if (vistaHistorial() === 'cargas') {
          <app-historial-cargas-bcp></app-historial-cargas-bcp>
        } @else {
          <app-historial-cambios></app-historial-cambios>
        }
      </section>
    }

    <ng-template #cabecera>
      <app-page-header class="flex-none" titulo="Pagos bancarios" subtitulo="Conciliación de pagos" [sinRaya]="true" fila="items-start gap-y-6 [&>div:first-child]:flex-none">
        <div class="grid min-w-0 flex-[0_1_29.5rem] grid-cols-[repeat(3,minmax(0,1fr))] gap-2">
          <div class="flex min-w-0 flex-col gap-[.3125rem]">
            <label for="ibk-cli" [class]="ETIQUETA">Cliente</label>
            <select id="ibk-cli" [class]="LISTA" [ngModel]="tenantId()" (ngModelChange)="elegirCliente($event)">
              @for (c of clientes(); track c.id) {
                <option [ngValue]="c.id">{{ c.tenantName }}</option>
              }
            </select>
          </div>
          <div class="flex min-w-0 flex-col gap-[.3125rem]">
            <label for="ibk-car" [class]="ETIQUETA">Cartera</label>
            <select id="ibk-car" [class]="LISTA" [ngModel]="carteraId()" (ngModelChange)="elegirCartera($event)">
              @for (c of carteras(); track c.id) {
                <option [ngValue]="c.id">{{ c.portfolioName }}</option>
              }
            </select>
          </div>
          <div class="flex min-w-0 flex-col gap-[.3125rem]">
            <label for="ibk-sub" [class]="ETIQUETA">Subcartera</label>
            <select id="ibk-sub" [class]="LISTA" [ngModel]="subcarteraId()" (ngModelChange)="elegirSubcartera($event)">
              @for (s of subcarteras(); track s.id) {
                <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
              }
            </select>
          </div>
        </div>
      </app-page-header>
    </ng-template>

    <ng-template #paginacion let-total="total" let-tam="tam" let-pagina="pagina" let-ir="ir">
      <nav class="mt-1 -mb-1 flex flex-none flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border pt-3" aria-label="Paginación">
        <span class="text-[.75rem] text-muted-foreground">{{ total ? 'Mostrando ' + ((pagina - 1) * tam + 1) + '–' + min(pagina * tam, total) + ' de ' + total : 'Sin resultados' }}</span>
        @if (total > tam) {
          <div class="flex items-center gap-2">
            <span class="text-[.75rem] text-muted-foreground">Página {{ pagina }} de {{ paginas(total, tam) }}</span>
            <button type="button" appBoton="secundario" appBotonAlto="icono" aria-label="Página anterior" [disabled]="pagina <= 1" (click)="ir(pagina - 1)"><lucide-angular name="chevron-left" [size]="16"></lucide-angular></button>
            <button type="button" appBoton="secundario" appBotonAlto="icono" aria-label="Página siguiente" [disabled]="pagina >= paginas(total, tam)" (click)="ir(pagina + 1)"><lucide-angular name="chevron-right" [size]="16"></lucide-angular></button>
          </div>
        }
      </nav>
    </ng-template>

    <app-cliente-resumen-conciliacion-drawer
      [open]="resumenAbierto()" [loading]="resumenCargando()" [error]="resumenError()" [documento]="resumenDocumento()" [resumen]="resumen()"
      [tenantId]="tenantId()" [carteraId]="carteraId()" [subcarteraId]="subcarteraId()"
      (close)="resumenAbierto.set(false)" (ajustado)="alAjustarResumen()" (corregir)="correccionCliente.set($event)"></app-cliente-resumen-conciliacion-drawer>
    <app-correccion-cliente-dialog [solicitud]="correccionCliente()" (cerrado)="alCerrarCorreccion($event)"></app-correccion-cliente-dialog>
  `
})
export class PagosInterbankPage implements OnInit, AfterViewChecked, OnDestroy {
  readonly PASOS = ['Elegir archivo', 'Revisar', 'Guardado'];
  readonly ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-foreground/80!';
  /** El tema antiguo fija con !important el aspecto de los campos: de ahí los `!`. */
  readonly LISTA = 'font-cashi m-0! h-auto! w-full rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly CAMPO = 'font-cashi m-0! w-full min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-3! py-2! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly BUSCADOR = 'font-cashi m-0! w-full min-w-0 rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! py-2! pr-3! pl-[2.125rem]! text-[.875rem]! leading-[1.5]! text-foreground! outline-none '
    + 'placeholder:text-muted-foreground focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly REJILLA = 'grid grid-cols-[minmax(0,1.25fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_7.5rem] items-center gap-x-3 px-2';
  readonly REJILLA_CARGA = 'grid grid-cols-[minmax(0,.85fr)_minmax(0,1.2fr)_minmax(0,.75fr)_minmax(0,.8fr)_minmax(0,1.15fr)_6.5rem] items-center gap-x-3 px-2';
  readonly PILL = 'inline-flex items-center gap-1.5 rounded-full border py-0.5 pr-2.5 pl-2 text-[.75rem] leading-[1.3] font-semibold whitespace-nowrap before:size-[.4375rem] before:flex-none before:rounded-full before:bg-current';
  readonly MONTO = 'flex flex-[1_0_auto] flex-col justify-between gap-2 px-5 py-[clamp(.875rem,2vh,1.25rem)] [@media(max-height:740px)]:gap-1';
  readonly CIFRA = 'flex flex-col gap-1 [@media(max-height:740px)]:flex-row [@media(max-height:740px)]:items-baseline [@media(max-height:740px)]:justify-between [@media(max-height:740px)]:gap-3';
  readonly PESTANA = 'font-cashi cursor-pointer rounded-md border-0 px-1.5 py-[.4375rem] text-[.875rem] font-medium transition-colors duration-150';
  readonly PESTANA_ACTIVA = 'bg-(--seg-activo) text-foreground shadow-[0_1px_2px_rgb(0_0_0/.08)]';
  readonly PESTANA_REPOSO = 'bg-transparent text-foreground/60';

  private readonly bcp = inject(BcpPagosService);
  private readonly reporte = inject(ReportePagosBancariosService);
  private readonly tenants = inject(TenantService);
  private readonly portfolios = inject(PortfolioService);
  private readonly alcance = inject(AlcanceService);
  private readonly auth = inject(AuthService);
  private readonly fmt = inject(FormatService);
  private readonly toast = inject(ToastService);
  private readonly inyector = inject(Injector);

  /** Se eligió otro cliente: sus pagos se ven en la pantalla general. */
  @Output() salir = new EventEmitter<void>();

  @ViewChild('zonaLista') private zonaLista?: ElementRef<HTMLElement>;
  @ViewChild('zonaCarga') private zonaCarga?: ElementRef<HTMLElement>;
  private observador?: ResizeObserver;
  private observada?: HTMLElement;

  vista = signal<Vista>('lista');
  vistaHistorial = signal<'cargas' | 'cambios'>('cargas');

  // Cascada
  clientes = signal<Tenant[]>([]);
  carteras = signal<Portfolio[]>([]);
  subcarteras = signal<SubPortfolio[]>([]);
  tenantId = signal<number | null>(null);
  carteraId = signal<number | null>(null);
  subcarteraId = signal<number | null>(null);
  private miAlcance: Alcance | null = null;

  contexto = computed<ContextoIbk | null>(() => {
    const [tenantId, carteraId, subcarteraId] = [this.tenantId(), this.carteraId(), this.subcarteraId()];
    return tenantId && carteraId && subcarteraId ? { tenantId, carteraId, subcarteraId } : null;
  });

  // Lista
  cargando = signal(false);
  error = signal<string | null>(null);
  reevaluando = signal(false);
  mes = signal(new Date().toISOString().slice(0, 7));
  filtro = signal<Filtro>('pend');
  busqueda = signal('');
  paginaLista = computed(() => this.cortar(this.filasLista(), this.paginaActualLista(), this.tamLista()));
  paginaActualLista = signal(1);
  tamLista = signal(6);
  pagosDelMes = signal<DetallePagoBancario[]>([]);
  private pendientes = signal<PagoBancoPendiente[]>([]);
  private noCorresponden = signal<PagoBancoPendiente[]>([]);
  private noConfirmados = signal<PagoNoConfirmadoBanco[]>([]);
  ultimoArchivo = signal<ArchivoCargaHistorialItem | null>(null);

  // Resolver bajo la fila
  abierta = signal<string | null>(null);
  porResolver = signal<PagoIbkPorResolver | null>(null);

  // Resumen del cliente
  resumenAbierto = signal(false);
  resumenCargando = signal(false);
  resumenError = signal<string | null>(null);
  resumenDocumento = signal<string | null>(null);
  resumen = signal<ResumenConciliacionCliente | null>(null);
  correccionCliente = signal<CorreccionClienteSolicitud | null>(null);

  // Carga
  archivo = signal<File | null>(null);
  arrastrando = signal(false);
  procesando = signal(false);
  guardando = signal(false);
  errorCarga = signal<string | null>(null);
  resultado = signal<BcpArchivoResultado | null>(null);
  guardado = signal<string | null>(null);
  filtroCarga = signal<FiltroCarga>('nuevos');
  busquedaCarga = signal('');
  paginaActualCarga = signal(1);
  tamCarga = signal(7);
  alertasRevisadas = false;
  /** Sube al cambiar una marca de retener: las marcas viven en las filas de la prevalidación. */
  private retenciones = signal(0);

  meses = computed(() => {
    const hoy = new Date();
    const previo = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const fijos = [hoy.toISOString().slice(0, 7), `${previo.getFullYear()}-${String(previo.getMonth() + 1).padStart(2, '0')}`];
    const conPagos = this.pendientes().map(p => mesDeFecha(p.fechaBanco)).filter(Boolean);
    return [...new Set([...fijos, ...conPagos, this.mes()])].sort().reverse();
  });

  private readonly delMes = computed(() => {
    const mes = this.mes();
    const pendientes = this.pendientes().filter(p => mesDeFecha(p.fechaBanco) === mes);
    return {
      rev: pendientes.filter(p => p.categoria !== 'PARCIAL_EN_ESPERA'),
      par: pendientes.filter(p => p.categoria === 'PARCIAL_EN_ESPERA'),
      conf: this.noConfirmados().filter(p => mesDeFecha(p.fechaPago) === mes),
      conc: this.pagosDelMes().filter(p => CONCILIADOS.includes(String(p.categoria)) || p.categoria === 'PAGO_VOLUNTARIO'),
      nc: this.noCorresponden().filter(p => mesDeFecha(p.fechaBanco) === mes)
    };
  });

  totalPendientes = computed(() => {
    const g = this.delMes();
    return g.rev.length + g.par.length + g.conf.length;
  });

  tarjetas = computed<{ id: Filtro; total: number; etiqueta: string; tono: Tono }[]>(() => {
    const g = this.delMes();
    return [
      { id: 'pend', total: this.totalPendientes(), etiqueta: 'Pagos pendientes', tono: 'am' },
      { id: 'rev', total: g.rev.length, etiqueta: 'Requiere revisión', tono: 'ro' },
      { id: 'par', total: g.par.length, etiqueta: 'Parcial en espera', tono: 'am' },
      { id: 'conf', total: g.conf.length, etiqueta: 'No confirmados', tono: 'am' },
      { id: 'conc', total: g.conc.length, etiqueta: 'Conciliados', tono: 'ok' },
      { id: 'nc', total: g.nc.length, etiqueta: 'No corresponden', tono: 'neu' }
    ];
  });

  /** Totales del mes por moneda: lo recibido se reparte en conciliado, por conciliar y no corresponde. */
  montos = computed(() => {
    const vacio = () => ({ pen: 0, usd: 0 });
    const total = { recibido: vacio(), conciliado: vacio(), porConciliar: vacio(), noCorresponde: vacio() };
    for (const pago of this.pagosDelMes()) {
      const categoria = String(pago.categoria);
      const grupo = NO_CUENTAN.includes(categoria) ? total.noCorresponde
        : pago.procesado || CONCILIADOS.includes(categoria) || categoria === 'PAGO_VOLUNTARIO' ? total.conciliado : total.porConciliar;
      const clave = pago.moneda === 'USD' ? 'usd' : 'pen';
      const monto = Number(pago.montoBanco || 0);
      total.recibido[clave] += monto;
      grupo[clave] += monto;
    }
    return total;
  });

  filasLista = computed<FilaPago[]>(() => {
    const g = this.delMes();
    const banco = (p: PagoBancoPendiente) => this.filaDePendiente(p);
    const filas: FilaPago[] = {
      pend: [...g.rev.map(banco), ...g.par.map(banco), ...g.conf.map(p => this.filaNoConfirmada(p))],
      rev: g.rev.map(banco),
      par: g.par.map(banco),
      conf: g.conf.map(p => this.filaNoConfirmada(p)),
      conc: g.conc.map(p => this.filaConciliada(p)),
      nc: g.nc.map(p => this.filaNoCorresponde(p))
    }[this.filtro()];
    return filas.filter(f => this.coincide(f, this.busqueda()));
  });

  // Revisión de la carga
  private readonly filasPrevalidacion = computed(() => {
    const resultado = this.resultado();
    const detalles = resultado?.detalles || [];
    return (resultado?.prevalidacion || resultado?.prevalidacionProcesados || []).map((fila, indice) => {
      const detalle: any = detalles[indice] || {};
      return Object.assign(fila, {
        __indice: indice,
        documentoBanco: fila.documentoBanco ?? detalle.documento,
        fechaBanco: fila.fechaBanco ?? detalle.fechaPago,
        montoBanco: fila.montoBanco ?? detalle.montoPagado,
        cuenta: fila.cuenta ?? detalle.cuenta,
        producto: fila.producto ?? detalle.producto,
        moneda: fila.moneda ?? detalle.moneda
      });
    });
  });

  filasCarga = computed<FilaCarga[]>(() => {
    this.retenciones();
    const resultado = this.resultado();
    const filas: FilaCarga[] = this.filasPrevalidacion().map(fila => this.filaDeCarga(fila));
    for (const [i, o] of (resultado?.omitidos || []).entries()) {
      filas.push({
        clave: `ya-${i}`, grupo: 'ya', fila: null, documento: o.documento || '', nombre: o.documento || '', cuenta: o.cuenta, producto: o.producto, moneda: o.moneda,
        fechaBanco: o.fechaPago || '', montoBanco: Number(o.montoPagado || 0), fechaAsesor: null, montoAsesor: null, estado: 'Ya cargado', tono: 'neu', detalle: '', alerta: ''
      });
    }
    for (const [i, r] of (resultado?.reversas || []).entries()) {
      filas.push({
        clave: `rv-${i}`, grupo: 'rv', fila: null, documento: r.documento || '', nombre: r.documento || '', cuenta: r.cuenta, producto: r.producto, moneda: r.moneda,
        fechaBanco: r.fechaPago || '', montoBanco: Number(r.montoPagado || 0), fechaAsesor: null, montoAsesor: null, estado: 'Reversa', tono: 'am', detalle: 'No se aplica', alerta: ''
      });
    }
    return filas;
  });

  pillsCarga = computed<{ id: FiltroCarga; etiqueta: string; total: number; tono: Tono }[]>(() => {
    const total = (grupo: FiltroCarga) => this.filasCarga().filter(f => f.grupo === grupo).length;
    return [
      { id: 'nuevos', etiqueta: 'Nuevos', total: this.filasCarga().filter(f => f.grupo !== 'ya' && f.grupo !== 'rv').length, tono: 'info' },
      { id: 'conc', etiqueta: 'Se concilian', total: total('conc'), tono: 'ok' },
      { id: 'par', etiqueta: 'En espera', total: total('par'), tono: 'am' },
      { id: 'vol', etiqueta: 'Voluntarios', total: total('vol'), tono: 'info' },
      { id: 'rev', etiqueta: 'Por revisar', total: total('rev'), tono: 'ro' },
      { id: 'nc', etiqueta: 'No corresponden', total: total('nc'), tono: 'neu' },
      { id: 'ya', etiqueta: 'Ya cargados', total: total('ya'), tono: 'neu' },
      { id: 'rv', etiqueta: 'Reversas', total: total('rv'), tono: 'am' }
    ];
  });

  filasCargaVisibles = computed(() => {
    const filtro = this.filtroCarga();
    return this.filasCarga()
      .filter(f => filtro === 'nuevos' ? f.grupo !== 'ya' && f.grupo !== 'rv' : f.grupo === filtro)
      .filter(f => this.coincide(f, this.busquedaCarga()));
  });

  paginaCarga = computed(() => this.cortar(this.filasCargaVisibles(), this.paginaActualCarga(), this.tamCarga()));

  /** Filas que el archivo no pudo cargar, con su número de fila. */
  filasSinCargar = computed(() => this.resultado()?.errores || []);

  /** Lo que se guarda: ni lo que queda fuera de la subcartera, ni lo omitido, ni lo ya conciliado. */
  paraGuardar = computed(() => this.filasPrevalidacion().filter(fila => {
    const estado = fila.estadoPrevalidacion;
    return fila.categoria !== 'CLIENTE_NO_ENCONTRADO' && fila.categoria !== 'OMITIDO_POR_FECHA'
      && estado !== 'CLIENTE_NO_PERTENECE_A_CONTEXTO' && estado !== 'DOCUMENTO_NO_EXISTE_EN_CLIENTES' && estado !== 'PAGO_YA_CONCILIADO_PREVIAMENTE';
  }));

  alertasActivas = computed(() => {
    this.retenciones();
    return this.filasPrevalidacion().some(fila => !!fila.alerta && !fila.retenerRevision);
  });

  paso = computed(() => this.guardado() ? 2 : this.resultado() ? 1 : 0);

  irLista = (pagina: number): void => {
    this.paginaActualLista.set(pagina);
    this.cerrarResolver();
  };

  irCarga = (pagina: number): void => {
    this.paginaActualCarga.set(pagina);
    this.cerrarResolver();
  };

  ngOnInit(): void {
    forkJoin({ alcance: this.alcance.mio(), tenants: this.tenants.getAllTenants() }).subscribe({
      next: ({ alcance, tenants }) => {
        this.miAlcance = alcance;
        const clientes = tenants.filter(t => alcance.todo || alcance.clientes.has(t.id));
        this.clientes.set(clientes);
        const interbank = clientes.find(t => esClienteInterbank(t));
        if (interbank) this.elegirCliente(interbank.id);
        else this.error.set('El usuario no tiene asignada la cartera de Interbank.');
      },
      error: () => this.error.set('No se pudo cargar la cartera de Interbank.')
    });
  }

  ngAfterViewChecked(): void {
    const zona = this.zonaLista?.nativeElement ?? this.zonaCarga?.nativeElement;
    if (zona === this.observada) return;
    this.observador?.disconnect();
    this.observada = zona;
    if (!zona) return;
    this.observador = new ResizeObserver(() => this.ajustarFilas());
    this.observador.observe(zona);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }

  elegirCliente(id: number): void {
    const cliente = this.clientes().find(c => c.id === id);
    if (cliente && !esClienteInterbank(cliente)) {
      this.salir.emit();
      return;
    }
    this.tenantId.set(id);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.carteraId.set(null);
    this.subcarteraId.set(null);
    this.portfolios.getPortfoliosByTenant(id).subscribe(lista => {
      const carteras = lista.filter(c => this.miAlcance?.todo || this.miAlcance?.carteras.has(c.id));
      this.carteras.set(carteras);
      if (carteras.length) this.elegirCartera(carteras[0].id);
    });
  }

  elegirCartera(id: number): void {
    this.carteraId.set(id);
    this.subcarteras.set([]);
    this.subcarteraId.set(null);
    this.portfolios.getSubPortfoliosByPortfolio(id).subscribe(lista => {
      const subcarteras = lista.filter(s => this.miAlcance?.todo || this.miAlcance?.subcarteras.has(s.id));
      this.subcarteras.set(subcarteras);
      if (subcarteras.length) this.elegirSubcartera(subcarteras[0].id);
    });
  }

  elegirSubcartera(id: number): void {
    this.subcarteraId.set(id);
    this.cerrarResolver();
    this.cargar();
  }

  cargar(): void {
    const contexto = this.contexto();
    if (!contexto) return;
    this.cargando.set(true);
    this.error.set(null);
    forkJoin({
      pendientes: this.bcp.listarPagosPendientes(contexto),
      noCorresponden: this.bcp.listarNoCorresponden(contexto),
      noConfirmados: this.bcp.listarNoConfirmados(contexto),
      archivos: this.bcp.listarHistorialArchivosCarga({ ...contexto, page: 0, size: 1 }),
      mes: this.todosLosPagos(this.mes(), contexto)
    }).subscribe({
      next: ({ pendientes, noCorresponden, noConfirmados, archivos, mes }) => {
        this.pendientes.set(pendientes || []);
        this.noCorresponden.set(noCorresponden || []);
        this.noConfirmados.set(noConfirmados || []);
        this.ultimoArchivo.set(archivos?.content?.[0] ?? null);
        this.pagosDelMes.set(mes);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(err?.error?.mensaje || err?.error?.message || 'No se pudieron cargar los pagos.');
        this.cargando.set(false);
      }
    });
  }

  elegirFiltro(filtro: Filtro): void {
    this.filtro.set(filtro);
    this.paginaActualLista.set(1);
    this.cerrarResolver();
  }

  elegirMes(mes: string): void {
    this.mes.set(mes);
    this.paginaActualLista.set(1);
    this.cerrarResolver();
    this.cargar();
  }

  buscar(texto: string): void {
    this.busqueda.set(texto);
    this.paginaActualLista.set(1);
    this.cerrarResolver();
  }

  reevaluar(): void {
    const contexto = this.contexto();
    if (!contexto) return;
    this.reevaluando.set(true);
    this.bcp.reevaluarPendientes(contexto).subscribe({
      next: r => {
        this.reevaluando.set(false);
        const resueltos = (r.pagosEvaluados ?? 0) - (r.pagosPendientes ?? 0);
        this.toast.show(`${resueltos} conciliados, ${r.pagosPendientes ?? 0} siguen pendientes`, 'success');
        this.cargar();
      },
      error: err => {
        this.reevaluando.set(false);
        this.toast.show(err?.error?.mensaje || 'No se pudieron reevaluar los pagos pendientes.', 'error');
      }
    });
  }

  restaurar(fila: FilaPago): void {
    const contexto = this.contexto();
    if (!contexto || fila.id === null) return;
    this.bcp.restaurarPendiente(fila.id, contexto).subscribe({
      next: () => {
        this.toast.show('El pago volvió a pendientes', 'success');
        this.cargar();
      },
      error: err => this.toast.show(err?.error?.mensaje || 'No se pudo devolver el pago a pendientes.', 'error')
    });
  }

  alternarResolver(fila: FilaPago): void {
    if (this.abierta() === fila.clave) return this.cerrarResolver();
    this.abrirResolver(fila.clave, {
      id: fila.id, documento: fila.documento, cuenta: fila.cuenta, producto: fila.producto, moneda: fila.moneda,
      fechaBanco: fila.fecha, montoBanco: Number(fila.monto), motivo: fila.motivo
    });
  }

  alternarResolverCarga(fila: FilaCarga): void {
    if (this.abierta() === fila.clave) return this.cerrarResolver();
    this.abrirResolver(fila.clave, {
      id: null, documento: fila.documento, cuenta: fila.cuenta, producto: fila.producto, moneda: fila.moneda,
      fechaBanco: fila.fechaBanco, montoBanco: fila.montoBanco, motivo: fila.fila?.motivo ?? null
    });
  }

  /** La fila sube para que el panel no quede oculto bajo el borde de la lista. */
  llevarFilaALaVista(): void {
    afterNextRender(() => document.getElementById(`fila-${this.abierta()}`)?.scrollIntoView({ block: 'start' }), { injector: this.inyector });
  }

  /** Tras corregir, el pago del banco se vuelve a evaluar contra lo corregido. */
  alCerrarResolver(huboCambios: boolean): void {
    const pago = this.porResolver();
    const contexto = this.contexto();
    this.cerrarResolver();
    if (!huboCambios || !pago || !contexto) return;
    this.toast.show('Pago resuelto', 'success');
    this.bcp.reevaluarPendientesCliente(pago.documento, contexto).subscribe({ next: () => this.cargar(), error: () => this.cargar() });
  }

  alCerrarResolverCarga(huboCambios: boolean): void {
    this.cerrarResolver();
    if (huboCambios) this.procesar();
  }

  abrirResumen(documento: string): void {
    const contexto = this.contexto();
    if (!documento || !contexto) return;
    this.resumenAbierto.set(true);
    this.resumenDocumento.set(documento);
    this.resumen.set(null);
    this.resumenError.set(null);
    this.cargarResumen(documento, contexto);
  }

  alAjustarResumen(): void {
    const documento = this.resumenDocumento();
    const contexto = this.contexto();
    if (documento && contexto) this.cargarResumen(documento, contexto);
    this.cargar();
  }

  alCerrarCorreccion(evento: { documento: string; huboCambios: boolean }): void {
    this.correccionCliente.set(null);
    if (evento.huboCambios) this.alAjustarResumen();
  }

  async descargarExcel(): Promise<void> {
    const workbook = new Workbook();
    workbook.creator = 'Sistema de Cobranza';
    workbook.created = new Date();
    const hoja = workbook.addWorksheet('Pagos Interbank');
    hoja.columns = [
      { header: 'Fecha banco', key: 'fecha', width: 14 },
      { header: 'CJ', key: 'cuenta', width: 14 },
      { header: 'Producto', key: 'producto', width: 24 },
      { header: 'Moneda', key: 'moneda', width: 10 },
      { header: 'Documento', key: 'documento', width: 14 },
      { header: 'Cliente', key: 'cliente', width: 36 },
      { header: 'Monto banco', key: 'monto', width: 16 },
      { header: 'Estado', key: 'estado', width: 28 }
    ];
    hoja.getRow(1).font = { bold: true };
    for (const pago of this.pagosDelMes()) {
      const fila = hoja.addRow({
        fecha: fechaCorta(pago.fechaBanco), cuenta: pago.cuenta || '', producto: pago.producto || '', moneda: pago.moneda || '',
        documento: pago.documento || '', cliente: pago.nombreCliente || '', monto: Number(pago.montoBanco || 0), estado: infoCategoria(pago.categoria).label
      });
      fila.getCell('monto').numFmt = pago.moneda === 'USD' ? '"US$" #,##0.00' : '"S/" #,##0.00';
    }
    hoja.autoFilter = { from: 'A1', to: 'H1' };
    hoja.views = [{ state: 'frozen', ySplit: 1 }];
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `pagos-interbank-${this.mes()}.xlsx`);
  }

  // Carga del archivo

  abrirCarga(): void {
    this.reiniciarCarga();
    this.cerrarResolver();
    this.vista.set('carga');
  }

  volverALista(): void {
    this.cerrarResolver();
    this.vista.set('lista');
    this.reiniciarCarga();
    this.cargar();
  }

  soltar(evento: DragEvent): void {
    evento.preventDefault();
    this.arrastrando.set(false);
    this.tomarArchivo(evento.dataTransfer?.files?.[0]);
  }

  elegirArchivo(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    this.tomarArchivo(entrada.files?.[0]);
    entrada.value = '';
  }

  procesar(): void {
    const archivo = this.archivo();
    const contexto = this.contexto();
    if (!archivo || !contexto) return;
    this.procesando.set(true);
    this.errorCarga.set(null);
    this.bcp.cargarArchivoIbk(archivo, contexto).subscribe({
      next: resultado => {
        this.procesando.set(false);
        if (!resultado.exitoso) {
          this.errorCarga.set(resultado.mensaje);
          return;
        }
        this.alertasRevisadas = false;
        this.resultado.set(resultado);
        this.filtroCarga.set('nuevos');
        this.paginaActualCarga.set(1);
      },
      error: err => {
        this.procesando.set(false);
        this.errorCarga.set(err?.error?.mensaje || err?.error?.message || 'No se pudo procesar el archivo.');
      }
    });
  }

  cambiarArchivo(): void {
    this.reiniciarCarga();
    this.cerrarResolver();
  }

  elegirFiltroCarga(filtro: FiltroCarga): void {
    this.filtroCarga.set(filtro);
    this.paginaActualCarga.set(1);
    this.cerrarResolver();
  }

  buscarCarga(texto: string): void {
    this.busquedaCarga.set(texto);
    this.paginaActualCarga.set(1);
    this.cerrarResolver();
  }

  alternarRetener(fila: FilaCarga): void {
    if (!fila.fila) return;
    fila.fila.retenerRevision = !fila.fila.retenerRevision;
    this.retenciones.update(valor => valor + 1);
  }

  puedeGuardar(): boolean {
    return !this.guardando() && this.paraGuardar().length > 0 && (!this.alertasActivas() || this.alertasRevisadas);
  }

  guardar(): void {
    const resultado = this.resultado();
    const contexto = this.contexto();
    const usuario = this.auth.getCurrentUser();
    if (!resultado || !contexto || !usuario || !this.puedeGuardar()) return;
    this.guardando.set(true);
    this.bcp.aprobarArchivo({
      nombreArchivo: resultado.nombreArchivo,
      cabecera: resultado.cabecera,
      detalles: this.paraGuardar().map(fila => ({ ...resultado.detalles[fila.__indice], retenerRevision: !!fila.retenerRevision })),
      ...contexto,
      aprobadoPorId: usuario.id,
      aprobadoPorNombre: `${usuario.firstName || ''} ${usuario.lastName || ''}`.trim() || usuario.username
    }).subscribe({
      next: respuesta => {
        this.guardando.set(false);
        if (!respuesta.exitoso) {
          this.toast.show(respuesta.mensaje || 'No se pudo guardar la carga.', 'error');
          return;
        }
        this.guardado.set(`${respuesta.pagosInsertados} pagos guardados, ${respuesta.conciliacionesAprobadas} conciliados, ${respuesta.pagosPendientes ?? 0} pendientes`);
        this.resultado.set(null);
      },
      error: err => {
        this.guardando.set(false);
        this.toast.show(err?.error?.mensaje || err?.error?.message || 'No se pudo guardar la carga.', 'error');
      }
    });
  }

  // Presentación

  color(tono: Tono): string {
    return tono === 'neu' ? 'var(--muted-foreground)' : `var(--${tono})`;
  }

  fondo(tono: Tono): string {
    return tono === 'neu' ? 'var(--muted)' : `var(--${tono}-bg)`;
  }

  pill(tono: Tono): string {
    return tono === 'neu' ? 'border-border bg-transparent text-muted-foreground' : `border-(--${tono}-ln) bg-(--${tono}-bg) text-(--${tono})`;
  }

  monto(valor: number | null | undefined, moneda: string | null | undefined): string {
    const simbolo = moneda === 'USD' ? 'US$' : 'S/';
    return `${simbolo} ${this.fmt.number(Number(valor ?? 0), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  montosDe(total: { pen: number; usd: number }): string {
    return total.usd ? `${this.monto(total.pen, 'PEN')} · ${this.monto(total.usd, 'USD')}` : this.monto(total.pen, 'PEN');
  }

  fechaCorta(valor: unknown): string {
    return fechaCorta(valor);
  }

  fechaHora(valor: string | null | undefined): string {
    if (!valor) return '—';
    return `${fechaCorta(valor)} ${String(valor).slice(11, 16)}`;
  }

  nuevosDelArchivo(): string {
    const archivo = this.ultimoArchivo();
    if (!archivo) return '—';
    return archivo.totalRegistros ? `${archivo.cantidadPagos} de ${archivo.totalRegistros}` : String(archivo.cantidadPagos);
  }

  nombreDeMes(mes: string): string {
    return nombreMes(mes);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  paginas(total: number, tam: number): number {
    return Math.max(1, Math.ceil(total / tam));
  }

  // Internos

  private abrirResolver(clave: string, pago: PagoIbkPorResolver): void {
    this.abierta.set(clave);
    this.porResolver.set(pago);
  }

  private cerrarResolver(): void {
    this.abierta.set(null);
    this.porResolver.set(null);
  }

  private tomarArchivo(archivo: File | undefined): void {
    if (!archivo) return;
    if (!/\.xlsx?$/i.test(archivo.name)) {
      this.errorCarga.set('El archivo debe ser de tipo Excel (.xlsx o .xls).');
      return;
    }
    this.errorCarga.set(null);
    this.archivo.set(archivo);
  }

  private reiniciarCarga(): void {
    this.archivo.set(null);
    this.resultado.set(null);
    this.guardado.set(null);
    this.errorCarga.set(null);
    this.busquedaCarga.set('');
    this.alertasRevisadas = false;
  }

  /** Reparte el mes en pedidos: el reporte devuelve como máximo 200 filas por página. */
  private todosLosPagos(mes: string, c: ContextoIbk): Observable<DetallePagoBancario[]> {
    return this.reporte.obtenerReporte(mes, c.tenantId, c.carteraId, c.subcarteraId, 0, FILAS_POR_PEDIDO).pipe(
      switchMap(primera => {
        if (primera.totalPaginas <= 1) return of(primera.pagos);
        const resto = Array.from({ length: primera.totalPaginas - 1 }, (_, i) =>
          this.reporte.obtenerReporte(mes, c.tenantId, c.carteraId, c.subcarteraId, i + 1, FILAS_POR_PEDIDO));
        return forkJoin(resto).pipe(map(paginas => [primera, ...paginas].flatMap(p => p.pagos)));
      })
    );
  }

  private cargarResumen(documento: string, contexto: ContextoIbk): void {
    this.resumenCargando.set(true);
    this.bcp.obtenerResumenConciliacionCliente(documento, contexto).subscribe({
      next: resumen => {
        this.resumen.set(resumen);
        this.resumenCargando.set(false);
      },
      error: err => {
        this.resumenError.set(err?.error?.mensaje || err?.error?.message || 'No se pudo cargar el resumen del cliente.');
        this.resumenCargando.set(false);
      }
    });
  }

  private cortar<T>(filas: T[], pagina: number, tam: number): T[] {
    return filas.slice((pagina - 1) * tam, pagina * tam);
  }

  private coincide(fila: { documento: string; nombre: string; cuenta: string | null }, texto: string): boolean {
    const buscado = texto.trim().toUpperCase();
    return !buscado || `${fila.documento} ${fila.nombre} ${fila.cuenta ?? ''}`.toUpperCase().includes(buscado);
  }

  /** Filas que entran en el alto disponible: la tarjeta llena la página y no se desplaza si cabe. */
  private ajustarFilas(): void {
    if (this.abierta()) return;
    const zona = this.observada;
    const fila = zona?.querySelector<HTMLElement>('[data-fila]');
    if (!zona || !fila) return;
    const cabecera = (zona.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
    const entran = Math.max(3, Math.floor((zona.clientHeight - cabecera) / fila.offsetHeight));
    if (this.vista() === 'lista') {
      this.tamLista.set(entran);
      this.paginaActualLista.update(p => Math.min(p, this.paginas(this.filasLista().length, entran)));
    } else {
      this.tamCarga.set(entran);
      this.paginaActualCarga.update(p => Math.min(p, this.paginas(this.filasCargaVisibles().length, entran)));
    }
  }

  private motivoDe(motivo: string | null | undefined): string {
    return (motivo && MOTIVOS_CORTOS[motivo]) || '';
  }

  private filaDePendiente(p: PagoBancoPendiente): FilaPago {
    const parcial = p.categoria === 'PARCIAL_EN_ESPERA';
    const sugerida = p.categoriaSugerida && p.categoriaSugerida !== 'REQUIERE_REVISION';
    return {
      clave: `p${p.id}`, id: p.id, documento: p.documento, nombre: p.nombreCliente || p.documento, cuenta: p.cuenta ?? null, producto: p.producto ?? null, moneda: p.moneda ?? null,
      estado: infoCategoria(p.categoria).label, tono: tonoDe(p.categoria),
      detalle: parcial ? `Falta ${this.monto(p.montoFaltante, p.moneda)}` : sugerida ? 'Ya puede conciliarse' : this.motivoDe(p.motivo),
      monto: Number(p.montoBanco), fecha: aFechaIso(p.fechaBanco), montoAsesor: p.montoPagoAsesor ?? null,
      accion: parcial ? 'espera' : 'resolver', motivo: p.motivo
    };
  }

  private filaNoConfirmada(p: PagoNoConfirmadoBanco): FilaPago {
    return {
      clave: `a${p.pagoCuotaId}`, id: null, documento: p.documento, nombre: p.nombreCliente || p.documento, cuenta: p.cuenta, producto: p.producto, moneda: p.moneda,
      estado: 'No confirmado', tono: 'am', detalle: `${p.diasHabiles ?? 0} días hábiles`, monto: null, fecha: aFechaIso(p.fechaPago), montoAsesor: Number(p.monto), accion: null, motivo: null
    };
  }

  private filaConciliada(p: DetallePagoBancario): FilaPago {
    return {
      clave: `c${p.id}`, id: p.id, documento: p.documento || '', nombre: p.nombreCliente || p.documento || '', cuenta: p.cuenta ?? null, producto: p.producto ?? null, moneda: p.moneda ?? null,
      estado: infoCategoria(p.categoria).label, tono: tonoDe(p.categoria), detalle: '', monto: Number(p.montoBanco), fecha: aFechaIso(p.fechaBanco), montoAsesor: null, accion: null, motivo: null
    };
  }

  private filaNoCorresponde(p: PagoBancoPendiente): FilaPago {
    const delSistema = p.motivo === 'PRODUCTO_FUERA_DE_CARTERA';
    return {
      clave: `n${p.id}`, id: p.id, documento: p.documento, nombre: p.nombreCliente || p.documento, cuenta: p.cuenta ?? null, producto: p.producto ?? null, moneda: p.moneda ?? null,
      estado: 'No corresponde', tono: 'neu', detalle: this.motivoDe(p.motivo), monto: Number(p.montoBanco), fecha: aFechaIso(p.fechaBanco), montoAsesor: null,
      accion: delSistema ? null : 'restaurar', motivo: p.motivo
    };
  }

  private filaDeCarga(fila: PrevalidacionArchivoBcp & { __indice: number }): FilaCarga {
    const categoria = String(fila.categoria || fila.estadoPrevalidacion || '');
    const estado = String(fila.estadoPrevalidacion || '');
    const fuera = categoria === 'CLIENTE_NO_ENCONTRADO' || estado === 'CLIENTE_NO_PERTENECE_A_CONTEXTO' || estado === 'DOCUMENTO_NO_EXISTE_EN_CLIENTES';
    const yaConciliado = estado === 'PAGO_YA_CONCILIADO_PREVIAMENTE';
    const grupo: FiltroCarga = yaConciliado ? 'ya' : CONCILIADOS.includes(categoria) ? 'conc'
      : categoria === 'PARCIAL_EN_ESPERA' ? 'par' : categoria === 'PAGO_VOLUNTARIO' ? 'vol'
      : categoria === 'NO_CORRESPONDE' || categoria === 'OMITIDO_POR_FECHA' || fuera ? 'nc' : 'rev';
    const alerta = String(fila.alerta || '').split(',').map(c => c.trim()).filter(Boolean).map(c => ALERTAS_PREVALIDACION[c] || c).join('; ');
    const detalle = grupo === 'par' ? `Falta ${this.monto(fila.montoFaltante, fila.moneda)}`
      : grupo === 'vol' ? 'Sin promesa'
      : grupo === 'conc' ? (categoria === 'CONCILIADO' ? 'Se concilia al guardar' : '')
      : this.motivoDe(fila.motivo || fila.estadoPrevalidacion);
    return {
      clave: `f${fila.__indice}`, grupo, fila, documento: fila.documentoBanco || '', nombre: fila.nombreCliente || fila.documentoBanco || '',
      cuenta: fila.cuenta ?? null, producto: fila.producto ?? null, moneda: fila.moneda ?? null,
      fechaBanco: aFechaIso(fila.fechaBanco), montoBanco: Number(fila.montoBanco || 0), fechaAsesor: fila.fechaPago, montoAsesor: fila.montoPago ?? null,
      estado: infoCategoria(categoria).label, tono: tonoDe(categoria), detalle, alerta: grupo === 'rev' ? '' : alerta
    };
  }
}
