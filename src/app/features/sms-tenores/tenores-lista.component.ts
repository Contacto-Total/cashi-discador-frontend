import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { ToastService } from '../../shared/services/toast.service';
import { SmsTenoresService, guardarArchivo, mensajeDeError, miles, nombreArchivoTenor } from './sms-tenores.service';
import { ContactoControl, EstadoTenor, GrupoTenores, MensajeTenor, Tenor, TenorGuardar } from './sms-tenores.models';

/** Límite de un SMS, la misma regla que aplicaba el módulo anterior. */
const LIMITE_SMS = 160;
const POR_PAGINA = 6;
/** Variables que muestra la tarjeta antes de "+N". */
const VARIABLES_VISIBLES = 3;

interface ParteMensaje {
  texto: string;
  variable: boolean;
}

interface TenorVista extends Tenor {
  partes: ParteMensaje[];
}

/** Clases que se repiten en la pantalla. */
const ESTILOS = {
  etiqueta: 'text-xs font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  select: 'h-[38px] w-full appearance-none rounded-lg border !border-[#8491a3] !bg-white pl-[11px] pr-8 text-[13px] !text-[#0f172a] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:!bg-[#f4f6f9] disabled:!text-[#5f6c80] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:disabled:!bg-slate-900 dark:disabled:!text-slate-400',
  flechaSelect: 'pointer-events-none absolute right-[11px] top-1/2 flex -translate-y-1/2 text-[#5f6c80] dark:text-slate-400',
  botonSecundario: 'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700',
  campo: 'h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white px-[11px] text-[13px] !text-[#0f172a] placeholder:text-[#8491a3] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-500',
  botonEliminar: 'flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] border border-[#d5dbe3] bg-white !text-[#b91c1c] transition-colors hover:bg-[#fdecec] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:!text-red-400 dark:hover:bg-red-950/40',
  botonPagina: 'flex h-8 min-w-8 items-center justify-center rounded-[7px] px-2 text-[12.5px] font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-40'
} as const;

/**
 * Lista de tenores, con filtros por cliente, cartera y subcartera y paginación.
 *
 * El número de clientes de cada tarjeta es el conteo guardado en el tenor: se
 * recalcula una vez al día después de la carga y bajo demanda, nunca al abrir la
 * pantalla, que así no lanza consultas sobre la cartera.
 *
 * «Vista previa» abre un panel lateral con el mensaje de un cliente real, para
 * recorrerlos, recalcular, archivar, eliminar o descargar el archivo desde ahí.
 *
 * Estilos: el CSS global del tema claro sobrescribe enlaces, inputs, encabezados
 * y algunas utilidades (`p-3`, `mt-2`, `bg-slate-900`...), y como no está en una
 * capa gana a Tailwind. Por eso los colores van en hexadecimal, los enlaces con
 * aspecto de botón llevan `btn` y los controles usan utilidades con `!`. Los
 * iconos de lucide copian su `class` al svg: lo que los posiciona va en un span.
 * Las animaciones viven en los estilos del componente, que sí quedan aislados.
 */
@Component({
  selector: 'app-tenores-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  styles: [`
    @keyframes aparecer { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes deslizar { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }
    @keyframes fundir { from { opacity: 0; } to { opacity: 1; } }
    @keyframes brotar { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: none; } }
    .aparecer { animation: aparecer 0.55s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
    .deslizar { animation: deslizar 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
    .fundir { animation: fundir 0.3s ease-out both; }
    .brotar { animation: brotar 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards; }
    @media (prefers-reduced-motion: reduce) {
      .aparecer, .deslizar, .fundir, .brotar { animation: none; }
    }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">
      <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-[3px]">
            <h1 class="!m-0 text-xl font-bold tracking-[-0.01em]">Gestión de Tenores</h1>
            <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
              {{ resumen() }}{{ ultimoConteo() ? ' · conteo del ' + (ultimoConteo() | date: 'dd/MM HH:mm') : '' }}
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button type="button" (click)="abrirContactos()"
                    class="inline-flex h-[38px] items-center gap-[7px] rounded-lg border border-[#8491a3] bg-white px-3.5 text-[13px] font-semibold !text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700">
              <lucide-angular name="users" [size]="15" class="block"></lucide-angular>
              Contactos de control
            </button>
            <a routerLink="/sms/tenores/nuevo"
               class="btn inline-flex h-[38px] items-center gap-[7px] rounded-lg bg-[#0f172a] px-4 text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
              Nuevo tenor
            </a>
          </div>
        </div>

        <div class="flex flex-wrap items-end gap-2.5">
          <label class="flex min-w-[150px] flex-col gap-1">
            <span [class]="estilos.etiqueta">Cliente</span>
            <span class="relative block">
              <select [ngModel]="filtroInquilino()" (ngModelChange)="alCambiarCliente($event)" [class]="estilos.select">
                <option [ngValue]="0">Todos</option>
                @for (c of clientes(); track c.id) {
                  <option [ngValue]="c.id">{{ c.tenantName }}</option>
                }
              </select>
              <span [class]="estilos.flechaSelect"><lucide-angular name="chevron-down" [size]="12" class="block"></lucide-angular></span>
            </span>
          </label>
          <span class="mb-[13px] flex text-[#5f6c80] dark:text-slate-500"><lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular></span>
          <label class="flex min-w-[150px] flex-col gap-1">
            <span [class]="estilos.etiqueta">Cartera</span>
            <span class="relative block">
              <select [ngModel]="filtroCartera()" (ngModelChange)="alCambiarCartera($event)" [disabled]="!filtroInquilino()" [class]="estilos.select">
                <option [ngValue]="0">Todas</option>
                @for (c of carteras(); track c.id) {
                  <option [ngValue]="c.id">{{ c.portfolioName }}</option>
                }
              </select>
              <span [class]="estilos.flechaSelect"><lucide-angular name="chevron-down" [size]="12" class="block"></lucide-angular></span>
            </span>
          </label>
          <span class="mb-[13px] flex text-[#5f6c80] dark:text-slate-500"><lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular></span>
          <label class="flex min-w-[150px] flex-col gap-1">
            <span [class]="estilos.etiqueta">Subcartera</span>
            <span class="relative block">
              <select [ngModel]="filtroSubcartera()" (ngModelChange)="alCambiarSubcartera($event)" [disabled]="!filtroCartera()" [class]="estilos.select">
                <option [ngValue]="0">Todas</option>
                @for (s of subcarteras(); track s.id) {
                  <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
                }
              </select>
              <span [class]="estilos.flechaSelect"><lucide-angular name="chevron-down" [size]="12" class="block"></lucide-angular></span>
            </span>
          </label>

          <label class="relative block flex-1 basis-[240px]">
            <span class="sr-only">Buscar tenor</span>
            <span class="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-[#5f6c80] dark:text-slate-400">
              <lucide-angular name="search" [size]="15" class="block"></lucide-angular>
            </span>
            <input type="search" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event); irA(1)"
                   placeholder="Buscar por nombre o texto del mensaje"
                   class="h-[38px] w-full rounded-lg border !border-[#8491a3] !bg-white pl-[35px] pr-3 text-[13.5px] !text-[#0f172a] placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-400" />
          </label>

          <div role="group" aria-label="Estado" class="flex h-[38px] rounded-lg border border-[#8491a3] bg-white p-[3px] dark:border-slate-600 dark:bg-slate-800">
            @for (opcion of estados; track opcion.valor) {
              <button type="button" (click)="estado.set(opcion.valor); irA(1)" [attr.aria-pressed]="estado() === opcion.valor"
                      class="inline-flex items-center gap-2 rounded-[6px] pl-3 pr-2 text-[12.5px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                      [ngClass]="estado() === opcion.valor ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900' : 'text-[#5f6c80] hover:bg-[#f4f6f9] dark:text-slate-300 dark:hover:bg-slate-700'">
                {{ opcion.texto }}
                <span class="rounded-full px-1.5 py-px text-[11px] tabular-nums" [ngClass]="estado() === opcion.valor ? 'bg-white/20 dark:bg-slate-900/15' : 'bg-[#eef2f7] dark:bg-slate-700'">{{ opcion.valor === 'ACTIVO' ? activos().length : archivados().length }}</span>
              </button>
            }
          </div>

          @if (hayFiltros()) {
            <button type="button" (click)="limpiarFiltros()" [class]="estilos.botonSecundario + ' h-[38px]'">
              <lucide-angular name="x" [size]="13" class="block"></lucide-angular>
              Limpiar
            </button>
          }
        </div>
      </div>

      <main class="flex flex-col gap-5 px-7 py-[22px]">
        @if (cargando()) {
          <p class="flex items-center gap-2 text-[13px] text-[#5f6c80] dark:text-slate-400">
            <span class="inline-flex animate-spin"><lucide-angular name="loader-2" [size]="16" class="block"></lucide-angular></span>
            Cargando tenores…
          </p>
        } @else if (!filtrados().length) {
          <div class="aparecer flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#8491a3] bg-white px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-900">
            <p class="text-[14.5px] font-semibold">{{ hayFiltros() ? 'Ningún tenor coincide con el filtro.' : estado() === 'ACTIVO' ? 'Todavía no hay tenores.' : 'No hay tenores archivados.' }}</p>
            @if (!hayFiltros() && estado() === 'ACTIVO') {
              <a routerLink="/sms/tenores/nuevo" class="btn text-[13px] font-semibold text-[#2563eb] hover:underline dark:text-blue-400">Crear el primero</a>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            @for (t of pagina(); track t.id; let i = $index) {
              <article class="aparecer group flex h-full min-h-[300px] flex-col gap-3 rounded-xl border p-4 transition-[translate,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[#c5ccd6] hover:shadow-[0_14px_32px_rgba(15,23,42,0.10)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:hover:border-slate-600"
                       [style.animation-delay.ms]="i * 35"
                       [ngClass]="claseTarjeta(t)">
                <div class="flex items-start justify-between gap-2">
                  <span class="truncate text-xs font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">{{ t.nombreSubcartera }}{{ mostrarCartera(t) ? ' · ' + t.nombreCartera : '' }}</span>
                  @if (t.estado === 'ARCHIVADO') {
                    <span class="shrink-0 rounded-full bg-[#eef2f7] px-2 py-[2px] text-[11px] font-semibold text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400">Archivado</span>
                  } @else if (alerta(t)) {
                    <span class="flex shrink-0 items-center gap-1 rounded-full bg-[#fdf2dc] px-2 py-[2px] text-[11px] font-semibold text-[#b45309] dark:bg-amber-950/50 dark:text-amber-300">
                      <lucide-angular name="alert-triangle" [size]="11" class="block"></lucide-angular>
                      {{ t.conteoError ? 'Revisar' : 'Sin clientes' }}
                    </span>
                  }
                </div>

                <h2 class="!m-0 line-clamp-2 text-[15px] font-bold leading-snug">{{ t.nombre }}</h2>

                <p class="rounded-[10px] rounded-bl-[3px] px-[13px] py-[10px] text-[13px] leading-[1.55] text-[#334155] dark:text-slate-200"
                   [ngClass]="alerta(t) ? 'bg-[#fbf3e3] dark:bg-amber-950/30' : 'bg-[#f4f6f9] dark:bg-slate-800'">
                  @for (parte of t.partes; track $index) {
                    @if (parte.variable) {<span class="font-semibold" [ngClass]="alerta(t) ? 'text-[#9a6412] dark:text-amber-300' : 'text-[#1d4ed8] dark:text-blue-400'">{{ parte.texto }}</span>} @else {<span>{{ parte.texto }}</span>}
                  }
                </p>

                <div class="flex flex-wrap gap-1.5">
                  @for (variable of variablesVisibles(t); track variable; let j = $index) {
                    <span class="brotar inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold transition-colors"
                          [ngClass]="alerta(t) ? 'border border-[#ecd9b5] bg-white text-[#8a5a1f] dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-[#eff5ff] text-[#1d4ed8] group-hover:bg-[#e2ecff] dark:bg-blue-950 dark:text-blue-300'"
                          [style.animation-delay.ms]="i * 35 + j * 40">{{ variable }}</span>
                  }
                  @if (t.variables.length > limiteVariables) {
                    <button type="button" (click)="alternarVariables(t.id)" [attr.aria-expanded]="expandido(t.id)"
                            class="inline-flex h-6 items-center gap-[3px] rounded-full border bg-white px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:bg-slate-800"
                            [ngClass]="alerta(t) ? 'border-[#ecd9b5] text-[#8a5a1f] hover:bg-[#fbf3e3] dark:border-amber-900 dark:text-amber-300' : 'border-[#8491a3] text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:text-slate-200'">
                      {{ expandido(t.id) ? 'menos' : '+' + (t.variables.length - limiteVariables) }}
                      <span class="flex transition-transform" [class.rotate-180]="expandido(t.id)"><lucide-angular name="chevron-down" [size]="11" class="block"></lucide-angular></span>
                    </button>
                  }
                </div>

                <div class="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 border-t pt-3"
                     [ngClass]="alerta(t) ? 'border-[#f3e6cc] dark:border-amber-900/60' : 'border-[#eef1f5] dark:border-slate-800'">
                  <div class="flex flex-col gap-0.5">
                    @if (t.conteoError) {
                      <span class="line-clamp-2 max-w-[220px] text-xs font-semibold leading-snug text-[#b45309] dark:text-amber-300">{{ t.conteoError }}</span>
                    } @else {
                      <span class="flex items-baseline gap-1.5">
                        <span class="text-xl font-bold leading-none tabular-nums" [ngClass]="t.clientesHoy === 0 ? 'text-[#b45309] dark:text-amber-300' : ''">{{ t.clientesHoy === null ? '—' : miles(t.clientesHoy) }}</span>
                        <span class="text-xs text-[#5f6c80] dark:text-slate-400">clientes</span>
                      </span>
                      <span class="whitespace-nowrap text-[11px] tabular-nums text-[#5f6c80] dark:text-slate-400">
                        {{ t.conteoCalculadoAt ? 'Conteo del ' + (t.conteoCalculadoAt | date: 'dd/MM HH:mm') : 'Sin conteo todavía' }}
                      </span>
                    }
                  </div>
                  <div class="flex shrink-0 items-center gap-1.5">
                    @if (t.estado === 'ACTIVO') {
                      <button type="button" (click)="abrirVistaPrevia(t)" [class]="estilos.botonSecundario">
                        <lucide-angular name="eye" [size]="14" class="block"></lucide-angular>
                        Vista previa
                      </button>
                      <a [routerLink]="['/sms/tenores', t.id]" [class]="'btn ' + estilos.botonSecundario">
                        <lucide-angular name="pencil" [size]="14" class="block"></lucide-angular>
                        Editar
                      </a>
                    } @else {
                      <span class="text-xs text-[#5f6c80] dark:text-slate-400">{{ t.origen === 'FOH' ? 'Traído de la base anterior' : 'Solo referencia' }}</span>
                    }
                    <button type="button" (click)="eliminar(t)" [disabled]="ocupado() === t.id"
                            [class]="estilos.botonEliminar" aria-label="Eliminar tenor" title="Eliminar tenor">
                      <lucide-angular name="trash-2" [size]="14" class="block"></lucide-angular>
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>

          @if (totalPaginas() > 1) {
            <nav aria-label="Paginación" class="flex flex-wrap items-center justify-between gap-3">
              <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">
                {{ miles(desde() + 1) }}–{{ miles(desde() + pagina().length) }} de {{ miles(filtrados().length) }}
              </span>
              <div class="flex items-center gap-1">
                <button type="button" (click)="irA(paginaActual() - 1)" [disabled]="paginaActual() === 1" aria-label="Página anterior"
                        [class]="estilos.botonPagina + ' border border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800'">
                  <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                </button>
                @for (p of paginasVisibles(); track $index) {
                  @if (p === 0) {
                    <span class="px-1 text-[12.5px] text-[#5f6c80]">…</span>
                  } @else {
                    <button type="button" (click)="irA(p)" [attr.aria-current]="p === paginaActual() ? 'page' : null"
                            [class]="estilos.botonPagina"
                            [ngClass]="p === paginaActual() ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900' : 'text-[#334155] hover:bg-[#eef1f5] dark:text-slate-200 dark:hover:bg-slate-800'">
                      {{ p }}
                    </button>
                  }
                }
                <button type="button" (click)="irA(paginaActual() + 1)" [disabled]="paginaActual() === totalPaginas()" aria-label="Página siguiente"
                        [class]="estilos.botonPagina + ' border border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800'">
                  <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                </button>
              </div>
            </nav>
          }
        }
      </main>

      @if (contactosAbierto()) {
        <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div class="fundir absolute inset-0 bg-[#0f172a]/45 backdrop-blur-[2px]" (click)="cerrarContactos()" aria-hidden="true"></div>
          <div role="dialog" aria-modal="true" aria-labelledby="titulo-contactos"
               class="aparecer relative flex max-h-[85vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-slate-900">
            <div class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
              <div class="flex min-w-0 flex-col gap-1">
                <h2 id="titulo-contactos" class="!m-0 text-[15px] font-bold leading-snug">Contactos de control</h2>
                <p class="text-[12.5px] leading-snug text-[#5f6c80] dark:text-slate-400">Reciben el mismo SMS al inicio del archivo de los tenores que los incluyen, con los importes y demás datos de un cliente de ese archivo. Aquí se agregan y se corrigen.</p>
              </div>
              <button type="button" (click)="cerrarContactos()" aria-label="Cerrar"
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] text-[#5f6c80] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:text-slate-400 dark:hover:bg-slate-800">
                <lucide-angular name="x" [size]="16" class="block"></lucide-angular>
              </button>
            </div>

            <div class="flex flex-1 flex-col overflow-y-auto px-5 py-2">
              @if (cargandoContactos()) {
                <p class="flex items-center gap-2 py-4 text-[13px] text-[#5f6c80] dark:text-slate-400">
                  <span class="inline-flex animate-spin"><lucide-angular name="loader-2" [size]="16" class="block"></lucide-angular></span>
                  Cargando…
                </p>
              } @else {
                @if (errorContacto() && contactoEnEdicion() === null) {
                  <p class="py-3 text-[12.5px] font-semibold text-[#b91c1c] dark:text-red-400">{{ errorContacto() }}</p>
                }
                <ul class="!m-0 flex list-none flex-col divide-y divide-[#eef1f5] !p-0 dark:divide-slate-800">
                  @for (c of contactos(); track c.id) {
                    @if (contactoEnEdicion() === c.id) {
                      <li class="py-3">
                        <form class="flex flex-col gap-2.5" (ngSubmit)="guardarContacto(c)">
                          <div class="grid grid-cols-1 gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
                            <label class="flex flex-col gap-1">
                              <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">Nombre</span>
                              <input name="edicionNombre" [(ngModel)]="edicion.nombre" maxlength="100" autocomplete="off" [class]="estilos.campo">
                            </label>
                            <label class="flex flex-col gap-1">
                              <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">Documento</span>
                              <input name="edicionDocumento" [(ngModel)]="edicion.documento" maxlength="12" autocomplete="off" placeholder="DNI o CE" [class]="estilos.campo">
                            </label>
                            <label class="flex flex-col gap-1">
                              <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">Celular</span>
                              <input name="edicionTelefono" [(ngModel)]="edicion.telefono" maxlength="9" inputmode="numeric" autocomplete="off" placeholder="9XXXXXXXX" [class]="estilos.campo">
                            </label>
                          </div>
                          @if (errorContacto()) {
                            <p class="text-[12.5px] font-semibold text-[#b91c1c] dark:text-red-400">{{ errorContacto() }}</p>
                          }
                          <div class="flex items-center gap-2">
                            <button type="submit" [disabled]="guardandoContacto()"
                                    class="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#0f172a] px-3 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                              <span class="inline-flex" [class.animate-spin]="guardandoContacto()"><lucide-angular [name]="guardandoContacto() ? 'loader-2' : 'check'" [size]="14" class="block"></lucide-angular></span>
                              Guardar
                            </button>
                            <button type="button" (click)="cancelarEdicion()" [disabled]="guardandoContacto()" [class]="estilos.botonSecundario">Cancelar</button>
                          </div>
                        </form>
                      </li>
                    } @else {
                      <li class="flex items-center justify-between gap-3 py-2.5">
                        <div class="flex min-w-0 flex-col">
                          <span class="truncate text-[13.5px] font-semibold">{{ c.nombre }}</span>
                          <span class="text-[12px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ c.documento || 'Sin documento' }} · {{ c.telefono }}</span>
                        </div>
                        <button type="button" (click)="editarContacto(c)" [disabled]="guardandoContacto()" [class]="estilos.botonSecundario">
                          <lucide-angular name="pencil" [size]="14" class="block"></lucide-angular>
                          Editar
                        </button>
                      </li>
                    }
                  } @empty {
                    <li class="py-4 text-[13px] text-[#5f6c80] dark:text-slate-400">Todavía no hay contactos de control.</li>
                  }
                </ul>
              }
            </div>

            <form class="flex flex-col gap-2.5 border-t border-[#e6e9ee] bg-[#f8fafc] px-5 py-4 dark:border-slate-800 dark:bg-slate-950/40" (ngSubmit)="agregarContacto()">
              <span [class]="estilos.etiqueta">Agregar contacto</span>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-[1.4fr_1fr_1fr]">
                <label class="flex flex-col gap-1">
                  <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">Nombre</span>
                  <input name="nuevoNombre" [(ngModel)]="nuevoContacto.nombre" maxlength="100" autocomplete="off" placeholder="Nombre y apellido" [class]="estilos.campo">
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">Celular</span>
                  <input name="nuevoTelefono" [(ngModel)]="nuevoContacto.telefono" maxlength="9" inputmode="numeric" autocomplete="off" placeholder="9XXXXXXXX" [class]="estilos.campo">
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">DNI</span>
                  <input name="nuevoDocumento" [(ngModel)]="nuevoContacto.documento" maxlength="12" autocomplete="off" placeholder="DNI o CE" [class]="estilos.campo">
                </label>
              </div>
              @if (errorAlta()) {
                <p class="text-[12.5px] font-semibold text-[#b91c1c] dark:text-red-400">{{ errorAlta() }}</p>
              }
              <button type="submit" [disabled]="guardandoContacto()"
                      class="inline-flex h-[38px] w-fit items-center gap-[7px] rounded-lg bg-[#0f172a] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                <span class="inline-flex" [class.animate-spin]="guardandoContacto()"><lucide-angular [name]="guardandoContacto() ? 'loader-2' : 'plus'" [size]="15" class="block"></lucide-angular></span>
                Agregar
              </button>
            </form>
          </div>
        </div>
      }

      @if (vistaPrevia(); as t) {
        <div class="fundir fixed inset-0 z-40 bg-[#0f172a]/45 backdrop-blur-[2px]" (click)="cerrarVistaPrevia()" aria-hidden="true"></div>
        <aside role="dialog" aria-modal="true" [attr.aria-label]="'Vista previa de ' + t.nombre"
               class="deslizar fixed inset-y-0 right-0 z-50 flex w-full max-w-[480px] flex-col bg-white shadow-2xl dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div class="flex min-w-0 flex-col gap-1">
              <span class="text-xs font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">{{ t.nombreSubcartera }}{{ mostrarCartera(t) ? ' · ' + t.nombreCartera : '' }}</span>
              <h2 class="!m-0 text-[15px] font-bold leading-snug">{{ t.nombre }}</h2>
            </div>
            <button type="button" (click)="cerrarVistaPrevia()" aria-label="Cerrar vista previa"
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] text-[#5f6c80] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:text-slate-400 dark:hover:bg-slate-800">
              <lucide-angular name="x" [size]="16" class="block"></lucide-angular>
            </button>
          </div>

          <div class="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
            <div class="grid grid-cols-2 gap-2.5">
              <div class="flex flex-col gap-0.5 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                <span class="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Clientes hoy</span>
                <span class="text-xl font-bold leading-none tabular-nums">{{ previewTotal() > 0 || previewMensaje() ? miles(previewTotal()) : (t.clientesHoy === null ? '—' : miles(t.clientesHoy)) }}</span>
                <span class="text-[11px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ porcentaje(t) }}</span>
              </div>
              <div class="flex flex-col gap-0.5 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-2.5 dark:border-slate-800 dark:bg-slate-950/40">
                <span class="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">Último conteo</span>
                <span class="text-[15px] font-semibold tabular-nums">{{ t.conteoCalculadoAt ? (t.conteoCalculadoAt | date: 'dd/MM HH:mm') : 'Pendiente' }}</span>
                <button type="button" (click)="recalcular(t)" [disabled]="ocupado() === t.id"
                        class="inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-blue-400">
                  <span class="inline-flex" [class.animate-spin]="ocupado() === t.id"><lucide-angular name="refresh-cw" [size]="11" class="block"></lucide-angular></span>
                  Recalcular
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2.5">
              <div class="flex items-center justify-between gap-3">
                <span class="text-[13px] font-semibold">Así le llega a cada cliente</span>
                @if (previewTotal() > 0) {
                  <div class="flex items-center gap-1.5">
                    <button type="button" (click)="verMensaje(-1)" [disabled]="previewIndice() === 0 || previewCargando()" aria-label="Mensaje anterior"
                            class="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-[#8491a3] bg-white text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-40 dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800">
                      <lucide-angular name="chevron-left" [size]="12" class="block"></lucide-angular>
                    </button>
                    <span class="text-[12.5px] tabular-nums text-[#334155] dark:text-slate-300">{{ miles(previewIndice() + 1) }} de {{ miles(previewTotal()) }}</span>
                    <button type="button" (click)="verMensaje(1)" [disabled]="previewIndice() >= previewTotal() - 1 || previewCargando()" aria-label="Mensaje siguiente"
                            class="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-[#8491a3] bg-white text-[#334155] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-40 dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800">
                      <lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular>
                    </button>
                  </div>
                }
              </div>

              <div class="rounded-[22px] border-[6px] border-[#1e293b] bg-[#0f172a] p-2 shadow-[0_12px_30px_rgba(15,23,42,0.25)] dark:border-slate-700">
                <div class="flex min-h-[210px] flex-col gap-3 rounded-[16px] bg-[#f4f6f9] px-3 pb-4 pt-3 dark:bg-slate-800">
                  <div class="flex items-center justify-between text-[11px] text-[#5f6c80] dark:text-slate-400">
                    <span class="font-semibold">SMS · {{ remitente(t) }}</span>
                    <span class="tabular-nums">{{ ahora | date: 'HH:mm' }}</span>
                  </div>
                  @if (previewMensaje(); as m) {
                    @for (actual of [m]; track actual.telefono + actual.texto) {
                      <div class="aparecer flex flex-col gap-1.5">
                        <div class="flex items-center gap-2">
                          <span class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#dbe4f0] text-xs font-bold text-[#334155] dark:bg-slate-600 dark:text-slate-100">{{ iniciales(actual.nombre) }}</span>
                          <span class="text-[13px] font-semibold">{{ actual.nombre || 'Cliente' }}</span>
                          <span class="text-xs tabular-nums text-[#5f6c80] dark:text-slate-400">{{ actual.telefono }}</span>
                        </div>
                        <p class="rounded-xl rounded-bl-[3px] border border-[#e6e9ee] bg-white px-3 py-[11px] text-[13px] leading-[1.55] tabular-nums dark:border-slate-700 dark:bg-slate-900">{{ actual.texto }}</p>
                        <span class="text-[11px] tabular-nums" [ngClass]="actual.caracteres > limiteSms ? 'font-semibold text-[#b91c1c] dark:text-red-400' : 'text-[#5f6c80] dark:text-slate-400'">
                          {{ actual.caracteres }} / {{ limiteSms }} caracteres{{ actual.caracteres > limiteSms ? ' · pasa del límite, el archivo no se generará' : '' }}
                        </span>
                      </div>
                    }
                  } @else {
                    <p class="my-auto text-center text-[13px] text-[#5f6c80] dark:text-slate-400">
                      {{ previewCargando() ? 'Cargando…' : (previewError() || 'Ningún cliente cumple las condiciones hoy.') }}
                    </p>
                  }
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-3 dark:border-slate-800 dark:bg-slate-950/40">
              <span [class]="estilos.etiqueta">Variables</span>
              <div class="flex flex-wrap gap-1.5">
                @for (variable of t.variables; track variable; let j = $index) {
                  <span class="brotar inline-flex h-6 items-center rounded-full bg-[#eff5ff] px-2.5 text-xs font-semibold text-[#1d4ed8] dark:bg-blue-950 dark:text-blue-300" [style.animation-delay.ms]="j * 40">{{ variable }}</span>
                }
                @if (!t.variables.length) {
                  <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">El mensaje no usa variables.</span>
                }
              </div>
              @for (c of t.combinadas; track c.token) {
                <div class="flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-[#eef1f5] pt-2 text-[12.5px] dark:border-slate-800">
                  <span class="flex items-center gap-1 font-semibold"><lucide-angular name="layers" [size]="12" class="block text-[#1d4ed8] dark:text-blue-300"></lucide-angular>{{ c.etiqueta }}:</span>
                  @for (nombre of (c.nombres ?? c.columnas); track $index; let k = $index) {
                    @if (k > 0) { <span class="text-[#8491a3]">→</span> }
                    <span class="text-[#334155] dark:text-slate-300">{{ nombre }}</span>
                  }
                  @if (c.minimo) {
                    <span class="rounded-full bg-[#eef2f7] px-1.5 text-[11px] font-semibold tabular-nums text-[#334155] dark:bg-slate-800 dark:text-slate-300">mín. S/{{ miles(c.minimo) }}</span>
                  }
                </div>
              }
            </div>

            <div class="flex flex-col gap-1.5 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-3 text-[12.5px] dark:border-slate-800 dark:bg-slate-950/40">
              <span [class]="estilos.etiqueta">Filtros</span>
              @for (r of t.rangos; track $index) {
                <span class="flex items-center gap-1.5 tabular-nums"><lucide-angular name="filter" [size]="12" class="block text-[#5f6c80]"></lucide-angular>{{ r.columna }}: {{ r.min === null ? 'sin mínimo' : miles(r.min) }} – {{ r.max === null ? 'sin máximo' : miles(r.max) }}</span>
              }
              @if (t.restricciones.sinPromesaVigente) { <span class="flex items-center gap-1.5"><lucide-angular name="check" [size]="12" class="block text-[#15803d]"></lucide-angular>Sin promesa vigente</span> }
              @if (t.restricciones.sinListaNegra) { <span class="flex items-center gap-1.5"><lucide-angular name="check" [size]="12" class="block text-[#15803d]"></lucide-angular>Sin lista negra</span> }
              @if (t.restricciones.soloNoContenido) { <span class="flex items-center gap-1.5"><lucide-angular name="check" [size]="12" class="block text-[#15803d]"></lucide-angular>Solo clientes NO CONTENIDO</span> }
              @if (!t.rangos.length && !t.restricciones.sinPromesaVigente && !t.restricciones.sinListaNegra && !t.restricciones.soloNoContenido) {
                <span class="text-[#5f6c80] dark:text-slate-400">Sin rangos ni restricciones.</span>
              }
            </div>

            <div class="flex flex-wrap items-center gap-1">
            <button type="button" (click)="archivar(t)" [disabled]="ocupado() === t.id"
                    class="inline-flex w-fit items-center gap-1.5 rounded-[7px] px-2 py-1 text-[12.5px] font-semibold text-[#5f6c80] transition-colors hover:bg-[#fef2f2] hover:text-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400">
              <lucide-angular name="archive" [size]="13" class="block"></lucide-angular>
              Archivar este tenor
            </button>
            <button type="button" (click)="eliminar(t)" [disabled]="ocupado() === t.id"
                    class="inline-flex w-fit items-center gap-1.5 rounded-[7px] px-2 py-1 text-[12.5px] font-semibold text-[#b91c1c] transition-colors hover:bg-[#fef2f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40">
              <lucide-angular name="trash-2" [size]="13" class="block"></lucide-angular>
              Eliminar este tenor
            </button>
            </div>
          </div>

          <div class="flex gap-2 border-t border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <button type="button" (click)="descargar(t)" [disabled]="ocupado() === t.id || previewTotal() === 0"
                    class="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#0f172a] text-[13.5px] font-semibold text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <span class="inline-flex" [class.animate-spin]="ocupado() === t.id">
                <lucide-angular [name]="ocupado() === t.id ? 'loader-2' : 'download'" [size]="15" class="block"></lucide-angular>
              </span>
              Descargar archivo
            </button>
            <a [routerLink]="['/sms/tenores', t.id]"
               class="btn flex h-[42px] items-center justify-center gap-2 rounded-[10px] border border-[#8491a3] bg-white px-4 text-[13.5px] font-semibold !text-[#0f172a] transition-colors hover:bg-[#f4f6f9] hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-transparent dark:!text-slate-100 dark:hover:bg-slate-800">
              <lucide-angular name="pencil" [size]="14" class="block"></lucide-angular>
              Editar
            </a>
          </div>
        </aside>
      }
    </div>
  `
})
export class TenoresListaComponent implements OnInit {
  private readonly api = inject(SmsTenoresService);
  private readonly tenants = inject(TenantService);
  private readonly portafolios = inject(PortfolioService);
  private readonly toast = inject(ToastService);

  readonly estilos = ESTILOS;
  readonly miles = miles;
  readonly limiteSms = LIMITE_SMS;
  readonly limiteVariables = VARIABLES_VISIBLES;
  readonly ahora = new Date();
  readonly estados: { valor: EstadoTenor; texto: string }[] = [
    { valor: 'ACTIVO', texto: 'Activos' },
    { valor: 'ARCHIVADO', texto: 'Archivados' }
  ];

  readonly tenores = signal<TenorVista[]>([]);
  /** Tamaño de la carga de cada subcartera, para el porcentaje del panel. */
  private readonly clientesPorSubcartera = signal<ReadonlyMap<number, number>>(new Map());
  readonly cargando = signal(true);
  readonly ocupado = signal<number | null>(null);
  private readonly expandidos = signal<ReadonlySet<number>>(new Set<number>());

  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);
  readonly filtroInquilino = signal(0);
  readonly filtroCartera = signal(0);
  readonly filtroSubcartera = signal(0);
  readonly busqueda = signal('');
  readonly estado = signal<EstadoTenor>('ACTIVO');
  private readonly paginaPedida = signal(1);

  /** Tenor abierto en el panel de vista previa y el mensaje que se está mirando. */
  readonly vistaPrevia = signal<Tenor | null>(null);
  readonly previewMensaje = signal<MensajeTenor | null>(null);
  readonly previewTotal = signal(0);
  readonly previewIndice = signal(0);
  readonly previewCargando = signal(false);
  readonly previewError = signal<string | null>(null);

  /** Ventana de contactos de control. */
  readonly contactosAbierto = signal(false);
  readonly contactos = signal<ContactoControl[]>([]);
  readonly cargandoContactos = signal(false);
  readonly guardandoContacto = signal(false);
  readonly errorContacto = signal<string | null>(null);
  /** Contacto que se está corrigiendo y lo escrito en sus campos. */
  readonly contactoEnEdicion = signal<number | null>(null);
  edicion = { nombre: '', documento: '', telefono: '' };
  readonly errorAlta = signal<string | null>(null);
  nuevoContacto = { nombre: '', documento: '', telefono: '' };

  readonly activos = computed(() => this.tenores().filter(t => t.estado === 'ACTIVO'));
  readonly archivados = computed(() => this.tenores().filter(t => t.estado === 'ARCHIVADO'));

  readonly hayFiltros = computed(() => !!this.filtroInquilino() || !!this.busqueda().trim());

  readonly filtrados = computed<TenorVista[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.tenores().filter(t =>
      t.estado === this.estado()
      && (!this.filtroInquilino() || t.idInquilino === this.filtroInquilino())
      && (!this.filtroCartera() || t.idCartera === this.filtroCartera())
      && (!this.filtroSubcartera() || t.idSubcartera === this.filtroSubcartera())
      && coincide(t, consulta));
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / POR_PAGINA)));
  readonly paginaActual = computed(() => Math.min(Math.max(1, this.paginaPedida()), this.totalPaginas()));
  readonly desde = computed(() => (this.paginaActual() - 1) * POR_PAGINA);
  readonly pagina = computed(() => this.filtrados().slice(this.desde(), this.desde() + POR_PAGINA));

  /** Números de página a mostrar; 0 marca un salto. */
  readonly paginasVisibles = computed<number[]>(() => {
    const total = this.totalPaginas();
    const actual = this.paginaActual();
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const paginas = new Set<number>([1, total, actual - 1, actual, actual + 1].filter(p => p >= 1 && p <= total));
    const lista: number[] = [];
    let anterior = 0;
    for (const p of [...paginas].sort((a, b) => a - b)) {
      if (anterior && p - anterior > 1) {
        lista.push(0);
      }
      lista.push(p);
      anterior = p;
    }
    return lista;
  });

  readonly resumen = computed(() => {
    const activos = this.activos().length;
    const subcarteras = new Set(this.activos().map(t => t.idSubcartera)).size;
    if (!activos) {
      return 'Plantillas de SMS por subcartera';
    }
    return `${activos} ${activos === 1 ? 'tenor activo' : 'tenores activos'} en ${subcarteras} ${subcarteras === 1 ? 'subcartera' : 'subcarteras'}`;
  });

  /** Conteo más reciente entre los tenores activos. */
  readonly ultimoConteo = computed<string | null>(() =>
    this.activos()
      .map(t => t.conteoCalculadoAt)
      .filter((f): f is string => !!f)
      .reduce<string | null>((mayor, actual) => (mayor === null || actual > mayor ? actual : mayor), null)
  );

  ngOnInit(): void {
    this.cargar();
    this.tenants.getAllTenants().subscribe({
      next: clientes => this.clientes.set(clientes),
      error: () => this.toast.error('No se pudieron cargar los clientes.')
    });
  }

  alCambiarCliente(id: number): void {
    this.filtroInquilino.set(id);
    this.filtroCartera.set(0);
    this.filtroSubcartera.set(0);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.irA(1);
    if (id > 0) {
      this.portafolios.getPortfoliosByTenant(id).subscribe({
        next: carteras => this.carteras.set(carteras),
        error: () => this.toast.error('No se pudieron cargar las carteras.')
      });
    }
  }

  alCambiarCartera(id: number): void {
    this.filtroCartera.set(id);
    this.filtroSubcartera.set(0);
    this.subcarteras.set([]);
    this.irA(1);
    if (id > 0) {
      this.portafolios.getSubPortfoliosByPortfolio(id).subscribe({
        next: subcarteras => this.subcarteras.set(subcarteras),
        error: () => this.toast.error('No se pudieron cargar las subcarteras.')
      });
    }
  }

  alCambiarSubcartera(id: number): void {
    this.filtroSubcartera.set(id);
    this.irA(1);
  }

  limpiarFiltros(): void {
    this.busqueda.set('');
    this.alCambiarCliente(0);
  }

  irA(pagina: number): void {
    this.paginaPedida.set(pagina);
  }

  expandido(idTenor: number): boolean {
    return this.expandidos().has(idTenor);
  }

  alternarVariables(idTenor: number): void {
    this.expandidos.update(actual => alternarEn(actual, idTenor));
  }

  variablesVisibles(t: Tenor): string[] {
    return this.expandido(t.id) ? t.variables : t.variables.slice(0, VARIABLES_VISIBLES);
  }

  /** El nombre de la cartera solo se muestra si no repite el de la subcartera. */
  mostrarCartera(t: Tenor): boolean {
    return !!t.nombreCartera && normalizar(t.nombreCartera) !== normalizar(t.nombreSubcartera ?? '');
  }

  /** Tarjeta en alerta: el tenor no se puede calcular o hoy no alcanza a ningún cliente. */
  alerta(t: Tenor): boolean {
    return !!t.conteoError || t.clientesHoy === 0;
  }

  claseTarjeta(t: Tenor): string {
    if (t.estado === 'ARCHIVADO') {
      return 'border-dashed border-[#c5ccd6] bg-[#fbfcfd] dark:border-slate-700 dark:bg-slate-900/60';
    }
    return this.alerta(t)
      ? 'border-[#f3dcb4] bg-[#fffdf7] dark:border-amber-900 dark:bg-amber-950/20'
      : 'border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900';
  }

  porcentaje(t: Tenor): string {
    const total = this.clientesPorSubcartera().get(t.idSubcartera) ?? 0;
    const clientes = this.previewTotal() > 0 || this.previewMensaje() ? this.previewTotal() : t.clientesHoy;
    if (!total || clientes === null || clientes === undefined) {
      return 'de la cartera';
    }
    return `${Math.round((clientes * 100) / total)} % de ${miles(total)} en la cartera`;
  }

  remitente(t: Tenor): string {
    return t.nombreCartera || 'Cashi';
  }

  abrirVistaPrevia(t: Tenor): void {
    this.vistaPrevia.set(t);
    this.previewMensaje.set(null);
    this.previewTotal.set(0);
    this.previewIndice.set(0);
    this.previewError.set(null);
    this.cargarMensaje(t, 0);
  }

  cerrarVistaPrevia(): void {
    this.vistaPrevia.set(null);
  }

  @HostListener('document:keydown.escape')
  alPulsarEscape(): void {
    if (this.contactosAbierto()) {
      this.cerrarContactos();
    } else if (this.vistaPrevia()) {
      this.cerrarVistaPrevia();
    }
  }

  verMensaje(desplazamiento: number): void {
    const t = this.vistaPrevia();
    const siguiente = this.previewIndice() + desplazamiento;
    if (!t || siguiente < 0 || siguiente >= this.previewTotal()) {
      return;
    }
    this.cargarMensaje(t, siguiente);
  }

  iniciales(nombre: string): string {
    const palabras = (nombre || '').trim().split(/\s+/).filter(Boolean);
    if (!palabras.length) {
      return '?';
    }
    return (palabras[0].charAt(0) + (palabras[1]?.charAt(0) ?? '')).toUpperCase();
  }

  descargar(t: Tenor): void {
    this.ocupado.set(t.id);
    this.api.exportable(t.id).subscribe({
      next: estado => {
        if (!estado.exportable) {
          this.toast.warning(estado.motivo ?? 'El archivo no se puede generar.');
          this.ocupado.set(null);
          return;
        }
        this.api.descargar(t.id).subscribe({
          next: blob => {
            guardarArchivo(blob, nombreArchivoTenor(t.id));
            this.ocupado.set(null);
          },
          error: () => {
            this.toast.error('No se pudo descargar el archivo.');
            this.ocupado.set(null);
          }
        });
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo comprobar el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  recalcular(t: Tenor): void {
    this.ocupado.set(t.id);
    this.api.recalcular(t.id).subscribe({
      next: actualizado => {
        this.reemplazar(actualizado);
        this.ocupado.set(null);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo recalcular el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  archivar(t: Tenor): void {
    if (!confirm(`¿Archivar "${t.nombre}"? Dejará de generar archivos y quedará como referencia.`)) {
      return;
    }
    this.ocupado.set(t.id);
    this.api.archivar(t.id).subscribe({
      next: archivado => {
        this.reemplazar(archivado);
        this.cerrarVistaPrevia();
        this.toast.success('Tenor archivado.');
        this.ocupado.set(null);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo archivar el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  /** Borra el tenor, activo o archivado. No se puede deshacer: por eso pregunta antes. */
  eliminar(t: Tenor): void {
    if (!confirm(`¿Eliminar "${t.nombre}"? Se borra para siempre y no se puede deshacer.`)) {
      return;
    }
    this.ocupado.set(t.id);
    this.api.eliminar(t.id).subscribe({
      next: () => {
        this.tenores.update(lista => lista.filter(x => x.id !== t.id));
        if (this.vistaPrevia()?.id === t.id) {
          this.cerrarVistaPrevia();
        }
        this.toast.success('Tenor eliminado.');
        this.ocupado.set(null);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo eliminar el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  abrirContactos(): void {
    this.contactosAbierto.set(true);
    this.contactoEnEdicion.set(null);
    this.errorContacto.set(null);
    this.errorAlta.set(null);
    this.cargandoContactos.set(true);
    this.api.contactosControl().subscribe({
      next: lista => {
        this.contactos.set(lista);
        this.cargandoContactos.set(false);
      },
      error: err => {
        this.errorContacto.set(mensajeDeError(err, 'No se pudieron cargar los contactos de control.'));
        this.cargandoContactos.set(false);
      }
    });
  }

  cerrarContactos(): void {
    this.contactosAbierto.set(false);
    this.contactoEnEdicion.set(null);
  }

  editarContacto(c: ContactoControl): void {
    this.contactoEnEdicion.set(c.id);
    this.edicion = { nombre: c.nombre, documento: c.documento ?? '', telefono: c.telefono };
    this.errorContacto.set(null);
  }

  cancelarEdicion(): void {
    this.contactoEnEdicion.set(null);
    this.errorContacto.set(null);
  }

  /** Las mismas reglas que el backend, para avisar sin esperar la respuesta. */
  private problemaContacto(c: { nombre: string; documento: string; telefono: string }): string | null {
    if (!c.nombre.trim()) {
      return 'Escribe el nombre.';
    }
    if (!/^[0-9A-Za-z]{8,12}$/.test(c.documento.trim())) {
      return 'El documento tiene que tener entre 8 y 12 letras o dígitos.';
    }
    if (!/^9\d{8}$/.test(c.telefono.replace(/\D/g, ''))) {
      return 'El celular tiene que tener 9 dígitos y empezar en 9.';
    }
    return null;
  }

  guardarContacto(c: ContactoControl): void {
    const problema = this.problemaContacto(this.edicion);
    if (problema) {
      this.errorContacto.set(problema);
      return;
    }
    if (c.id === null) {
      return;
    }
    const id = c.id;
    const { nombre, documento, telefono } = this.edicion;
    this.guardandoContacto.set(true);
    this.errorContacto.set(null);
    this.api.actualizarContactoControl(id, { id, nombre, documento, telefono }).subscribe({
      next: guardado => {
        this.contactos.update(lista => lista.map(x => (x.id === id ? guardado : x)));
        this.contactoEnEdicion.set(null);
        this.guardandoContacto.set(false);
        this.toast.success('Contacto de control actualizado.');
      },
      error: err => {
        this.errorContacto.set(mensajeDeError(err, 'No se pudo guardar el contacto.'));
        this.guardandoContacto.set(false);
      }
    });
  }

  agregarContacto(): void {
    const problema = this.problemaContacto(this.nuevoContacto);
    if (problema) {
      this.errorAlta.set(problema);
      return;
    }
    const { nombre, documento, telefono } = this.nuevoContacto;
    this.guardandoContacto.set(true);
    this.errorAlta.set(null);
    this.api.crearContactoControl({ id: null, nombre, documento, telefono }).subscribe({
      next: creado => {
        this.contactos.update(lista => [...lista, creado].sort((a, b) => a.nombre.localeCompare(b.nombre)));
        this.nuevoContacto = { nombre: '', documento: '', telefono: '' };
        this.guardandoContacto.set(false);
        this.toast.success('Contacto de control agregado.');
      },
      error: err => {
        this.errorAlta.set(mensajeDeError(err, 'No se pudo agregar el contacto.'));
        this.guardandoContacto.set(false);
      }
    });
  }

  /** Un mensaje real del tenor, tal como se guardó. La primera llamada trae también el total. */
  private cargarMensaje(t: Tenor, desde: number): void {
    this.previewCargando.set(true);
    this.api.preview(borradorDe(t), desde).subscribe({
      next: preview => {
        this.previewMensaje.set(preview.mensajes[0] ?? null);
        this.previewTotal.set(preview.total);
        this.previewIndice.set(preview.desde);
        this.previewCargando.set(false);
      },
      error: err => {
        this.previewError.set(mensajeDeError(err, 'No se pudo generar la vista previa.'));
        this.previewCargando.set(false);
      }
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api.listar().subscribe({
      next: grupos => {
        this.tenores.set(aplanar(grupos));
        this.clientesPorSubcartera.set(new Map(grupos.map(g => [g.idSubcartera, g.clientesEnCartera])));
        this.cargando.set(false);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudieron cargar los tenores.'));
        this.cargando.set(false);
      }
    });
  }

  private reemplazar(tenor: Tenor): void {
    this.tenores.update(lista => lista.map(t => (t.id === tenor.id ? vista(tenor) : t)));
    if (this.vistaPrevia()?.id === tenor.id) {
      this.vistaPrevia.set(tenor);
    }
  }
}

/** El tenor guardado, en la forma que espera el backend para contar y previsualizar. */
function borradorDe(t: Tenor): TenorGuardar {
  return {
    nombre: t.nombre,
    idInquilino: t.idInquilino,
    idCartera: t.idCartera,
    idSubcartera: t.idSubcartera,
    plantilla: t.plantilla,
    rangos: t.rangos,
    restricciones: t.restricciones,
    combinadas: t.combinadas,
    incluirContactosControl: t.incluirContactosControl
  };
}

function aplanar(grupos: GrupoTenores[]): TenorVista[] {
  return grupos.flatMap(g => g.tenores).map(vista);
}

function vista(t: Tenor): TenorVista {
  return { ...t, partes: partesDelMensaje(t.plantilla) };
}

/** Separa la plantilla en texto y variables para resaltar estas últimas. */
function partesDelMensaje(plantilla: string): ParteMensaje[] {
  const partes: ParteMensaje[] = [];
  const variable = /\{[A-Z0-9_]+\}/g;
  let desde = 0;
  let m: RegExpExecArray | null;
  while ((m = variable.exec(plantilla)) !== null) {
    if (m.index > desde) {
      partes.push({ texto: plantilla.slice(desde, m.index), variable: false });
    }
    partes.push({ texto: m[0], variable: true });
    desde = m.index + m[0].length;
  }
  if (desde < plantilla.length) {
    partes.push({ texto: plantilla.slice(desde), variable: false });
  }
  return partes;
}

function alternarEn(actual: ReadonlySet<number>, id: number): ReadonlySet<number> {
  const siguiente = new Set(actual);
  if (siguiente.has(id)) {
    siguiente.delete(id);
  } else {
    siguiente.add(id);
  }
  return siguiente;
}

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function coincide(t: Tenor, consulta: string): boolean {
  return !consulta || normalizar(t.nombre).includes(consulta) || normalizar(t.plantilla).includes(consulta);
}
