import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { SmsTenoresService, guardarArchivo, mensajeDeError, miles, nombreArchivoTenor } from './sms-tenores.service';
import { GrupoTenores, MensajeTenor, Tenor, TenorGuardar } from './sms-tenores.models';

/** Límite de un SMS, la misma regla que aplicaba el módulo anterior. */
const LIMITE_SMS = 160;

/** Variables que muestra la tarjeta antes de "+N más". */
const VARIABLES_VISIBLES = 2;

/**
 * Lista de tenores agrupados por subcartera.
 *
 * El número de clientes de cada tarjeta es el conteo guardado en el tenor: se
 * recalcula una vez al día después de la carga y bajo demanda, nunca al abrir la
 * pantalla, que así no lanza consultas sobre la cartera.
 *
 * «Vista previa» abre un panel lateral con el mensaje de un cliente real, para
 * recorrerlos y descargar el archivo desde ahí, como en el módulo anterior.
 *
 * Estilos: el CSS global del tema claro sobrescribe enlaces, inputs, encabezados
 * y algunas utilidades (`p-3`, `mt-2`, `bg-slate-900`...), y como no está en una
 * capa gana a Tailwind. Por eso los colores van en hexadecimal, los enlaces con
 * aspecto de botón llevan `btn` y los controles usan utilidades con `!`. Los
 * iconos de lucide copian su `class` al svg: lo que los posiciona va en un span.
 */
@Component({
  selector: 'app-tenores-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">
      <div class="flex flex-wrap items-center justify-between gap-6 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-[3px]">
          <h1 class="!m-0 text-xl font-bold tracking-[-0.01em]">Gestión de Tenores</h1>
          <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Agrupados por subcartera{{ ultimoConteo() ? ' · conteo del ' + (ultimoConteo() | date: 'dd/MM HH:mm') : '' }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5">
          <label class="relative block">
            <span class="sr-only">Buscar tenor</span>
            <span class="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-[#5f6c80] dark:text-slate-400">
              <lucide-angular name="search" [size]="15" class="block"></lucide-angular>
            </span>
            <input type="search" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)"
                   placeholder="Buscar tenor o texto del mensaje"
                   class="h-[38px] w-[280px] rounded-lg border !border-[#8491a3] !bg-white pl-[35px] pr-3 text-[13.5px] !text-[#0f172a] placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-400" />
          </label>
          <a routerLink="/sms/tenores/nuevo"
             class="btn inline-flex h-[38px] items-center gap-[7px] rounded-lg bg-[#0f172a] px-4 text-[13.5px] font-semibold text-white hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
            <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
            Nuevo tenor
          </a>
        </div>
      </div>

      <main class="flex flex-col gap-5 px-7 py-[22px]">
        @if (cargando()) {
          <p class="flex items-center gap-2 text-[13px] text-[#5f6c80] dark:text-slate-400">
            <span class="inline-flex animate-spin"><lucide-angular name="loader-2" [size]="16" class="block"></lucide-angular></span>
            Cargando tenores…
          </p>
        } @else if (!visibles().length && !archivados().length) {
          <div class="flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#8491a3] bg-white px-6 py-10 text-center dark:border-slate-600 dark:bg-slate-900">
            <p class="text-[14.5px] font-bold">{{ busqueda() ? 'Ningún tenor coincide con la búsqueda.' : 'Todavía no hay tenores.' }}</p>
            @if (!busqueda()) {
              <a routerLink="/sms/tenores/nuevo" class="btn text-[13px] font-semibold text-[#2563eb] hover:underline dark:text-blue-400">Crear el primero</a>
            }
          </div>
        }

        @for (grupo of visibles(); track grupo.idSubcartera) {
          <section class="flex flex-col gap-3">
            @if (plegado(grupo.idSubcartera)) {
              <button type="button" (click)="alternar(grupo.idSubcartera)" aria-expanded="false"
                      class="flex w-full items-center gap-3 rounded-xl border border-[#e6e9ee] bg-white px-4 py-[13px] text-left hover:border-[#8491a3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600">
                <span class="flex text-[#5f6c80] dark:text-slate-400"><lucide-angular name="chevron-right" [size]="16" class="block"></lucide-angular></span>
                <span class="text-[14.5px] font-bold">{{ grupo.nombreSubcartera }}</span>
                @if (mostrarCartera(grupo)) {
                  <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ grupo.nombreCartera }}</span>
                }
                <span class="rounded-full bg-[#eef2f7] px-2.5 py-[3px] text-xs font-semibold tabular-nums text-[#475569] dark:bg-slate-800 dark:text-slate-300">{{ cuantosTenores(grupo.tenores.length) }}</span>
                <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ miles(grupo.clientesEnCartera) }} clientes en la cartera</span>
              </button>
            } @else {
              <button type="button" (click)="alternar(grupo.idSubcartera)" aria-expanded="true"
                      class="flex w-full items-center gap-3 rounded-md text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]">
                <span class="flex"><lucide-angular name="chevron-down" [size]="16" class="block"></lucide-angular></span>
                <span class="text-[15px] font-bold">{{ grupo.nombreSubcartera }}</span>
                @if (mostrarCartera(grupo)) {
                  <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ grupo.nombreCartera }}</span>
                }
                <span class="rounded-full bg-[#eef2f7] px-2.5 py-[3px] text-xs font-semibold tabular-nums text-[#475569] dark:bg-slate-800 dark:text-slate-300">{{ cuantosTenores(grupo.tenores.length) }}</span>
                <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">{{ miles(grupo.clientesEnCartera) }} clientes en la cartera</span>
                <span class="h-px flex-1 bg-[#e6e9ee] dark:bg-slate-800"></span>
              </button>

              <div class="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
                @for (t of grupo.tenores; track t.id) {
                  <article class="flex flex-col gap-3 rounded-xl border p-4"
                           [ngClass]="alerta(t) ? 'border-[#f3dcb4] bg-[#fffdf7] dark:border-amber-900 dark:bg-amber-950/20' : 'border-[#e6e9ee] bg-white dark:border-slate-800 dark:bg-slate-900'">
                    <div class="flex items-start justify-between gap-3">
                      <h2 class="!m-0 text-[14.5px] font-bold leading-snug">{{ t.nombre }}</h2>
                      <div class="flex shrink-0 gap-1.5">
                        <button type="button" (click)="abrirVistaPrevia(t)" [disabled]="alerta(t)"
                                class="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:border-[#f0e2c8] disabled:bg-[#fdf8ee] disabled:text-[#c9b48c] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:disabled:border-slate-700 dark:disabled:bg-slate-900 dark:disabled:text-slate-500">
                          <lucide-angular name="eye" [size]="14" class="block"></lucide-angular>
                          Vista previa
                        </button>
                        <a [routerLink]="['/sms/tenores', t.id]"
                           class="btn inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[7px] border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-semibold !text-[#334155] hover:bg-[#f4f6f9] hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:!text-slate-200 dark:hover:bg-slate-700">
                          <lucide-angular name="pencil" [size]="14" class="block"></lucide-angular>
                          Editar
                        </a>
                      </div>
                    </div>

                    <p class="rounded-[10px] rounded-bl-[3px] px-[13px] py-[11px] text-[13px] leading-[1.55] text-[#334155] dark:text-slate-200"
                       [ngClass]="alerta(t) ? 'bg-[#fdf6ea] dark:bg-amber-950/30' : 'bg-[#f4f6f9] dark:bg-slate-800'">{{ t.plantilla }}</p>

                    <div class="flex items-center justify-between gap-3">
                      @if (t.conteoError) {
                        <span class="flex items-start gap-1.5 text-xs font-semibold text-[#b45309] dark:text-amber-300">
                          <span class="mt-px flex shrink-0"><lucide-angular name="alert-triangle" [size]="13" class="block"></lucide-angular></span>
                          {{ t.conteoError }}
                        </span>
                      } @else if (t.clientesHoy === 0) {
                        <span class="flex items-center gap-1.5 text-xs font-semibold text-[#b45309] dark:text-amber-300">
                          <span class="flex shrink-0"><lucide-angular name="alert-triangle" [size]="13" class="block"></lucide-angular></span>
                          Sin clientes con la carga vigente · no genera archivo
                        </span>
                      } @else {
                        <div class="flex flex-wrap gap-[5px]">
                          @for (variable of variablesVisibles(t); track variable) {
                            <span class="rounded-[5px] bg-[#eff5ff] px-2 py-[3px] text-xs font-semibold text-[#1d4ed8] dark:bg-blue-950 dark:text-blue-300">{{ variable }}</span>
                          }
                          @if (t.variables.length > limiteVariables) {
                            <button type="button" (click)="alternarVariables(t.id)" [attr.aria-expanded]="expandido(t.id)"
                                    class="inline-flex items-center gap-[3px] rounded-[5px] border border-[#8491a3] bg-white px-[7px] py-[2px] text-xs font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
                              {{ expandido(t.id) ? 'Ver menos' : '+' + (t.variables.length - limiteVariables) + ' más' }}
                              <span class="flex" [class.rotate-180]="expandido(t.id)"><lucide-angular name="chevron-down" [size]="11" class="block"></lucide-angular></span>
                            </button>
                          }
                        </div>
                      }
                      @if (!t.conteoError) {
                        <p class="flex shrink-0 items-baseline gap-1.5">
                          <span class="text-xl font-bold tabular-nums" [ngClass]="t.clientesHoy === 0 ? 'text-[#b45309] dark:text-amber-300' : ''">{{ miles(t.clientesHoy ?? 0) }}</span>
                          <span class="text-xs" [ngClass]="t.clientesHoy === 0 ? 'text-[#b45309] dark:text-amber-300' : 'text-[#5f6c80] dark:text-slate-400'">clientes</span>
                        </p>
                      }
                    </div>

                    <div class="flex items-center justify-between gap-3 border-t pt-2.5"
                         [ngClass]="alerta(t) ? 'border-[#f3e6cc] dark:border-amber-900/60' : 'border-[#eef1f5] dark:border-slate-800'">
                      <span class="text-xs tabular-nums text-[#5f6c80] dark:text-slate-400">
                        {{ t.conteoCalculadoAt ? 'Conteo del ' + (t.conteoCalculadoAt | date: 'dd/MM HH:mm') : 'Sin conteo todavía' }}
                      </span>
                      <div class="flex items-center gap-1">
                        <button type="button" (click)="recalcular(t)" [disabled]="ocupado() === t.id"
                                class="inline-flex h-7 items-center gap-1.5 rounded-[7px] px-2 text-xs font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                          <lucide-angular name="refresh-cw" [size]="12" class="block"></lucide-angular>
                          Recalcular
                        </button>
                        <button type="button" (click)="archivar(t)" [disabled]="ocupado() === t.id"
                                class="inline-flex h-7 items-center gap-1.5 rounded-[7px] px-2 text-xs font-semibold text-[#334155] hover:bg-[#fef2f2] hover:text-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-50 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:text-red-400">
                          <lucide-angular name="archive" [size]="12" class="block"></lucide-angular>
                          Archivar
                        </button>
                      </div>
                    </div>
                  </article>
                }
              </div>
            }
          </section>
        }

        @if (archivados().length) {
          <section class="flex flex-col gap-2.5">
            <button type="button" (click)="archivadosAbiertos.set(!archivadosAbiertos())" [attr.aria-expanded]="archivadosAbiertos()"
                    class="flex w-full items-center gap-3 rounded-xl border border-dashed border-[#8491a3] bg-[#fbfcfd] px-4 py-[13px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-900">
              <span class="flex text-[#5f6c80] dark:text-slate-400">
                <lucide-angular [name]="archivadosAbiertos() ? 'chevron-down' : 'chevron-right'" [size]="16" class="block"></lucide-angular>
              </span>
              <span class="text-[14.5px] font-bold text-[#5f6c80] dark:text-slate-300">Archivados</span>
              <span class="rounded-full bg-[#f1f5f9] px-2.5 py-[3px] text-xs font-semibold tabular-nums text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400">{{ cuantosTenores(archivados().length) }}</span>
              <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">se conservan como referencia, no generan archivo</span>
            </button>
            @if (archivadosAbiertos()) {
              <div role="list" class="divide-y divide-[#eef1f5] overflow-hidden rounded-xl border border-[#e6e9ee] bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
                @for (t of archivados(); track t.id) {
                  <div role="listitem" class="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span class="text-[13.5px] font-semibold">{{ t.nombre }}</span>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ t.nombreSubcartera }} · {{ t.origen === 'FOH' ? 'traído de la base anterior' : 'archivado' }}</span>
                  </div>
                }
              </div>
            }
          </section>
        }
      </main>

      @if (vistaPrevia(); as t) {
        <div class="fixed inset-0 z-40 bg-[#0f172a]/40" (click)="cerrarVistaPrevia()" aria-hidden="true"></div>
        <aside role="dialog" aria-modal="true" [attr.aria-label]="'Vista previa de ' + t.nombre"
               class="fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col bg-white shadow-2xl dark:bg-slate-900">
          <div class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div class="flex min-w-0 flex-col gap-0.5">
              <h2 class="!m-0 truncate text-[15px] font-bold">{{ t.nombre }}</h2>
              <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ t.nombreSubcartera }} · {{ t.nombreCartera }}</span>
            </div>
            <button type="button" (click)="cerrarVistaPrevia()" aria-label="Cerrar vista previa"
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] text-[#5f6c80] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:text-slate-400 dark:hover:bg-slate-800">
              <lucide-angular name="x" [size]="16" class="block"></lucide-angular>
            </button>
          </div>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex items-center justify-between gap-3">
              <span class="text-[13px] font-semibold">Así le llega a cada cliente</span>
              @if (previewTotal() > 0) {
                <div class="flex items-center gap-1.5">
                  <button type="button" (click)="verMensaje(-1)" [disabled]="previewIndice() === 0 || previewCargando()" aria-label="Mensaje anterior"
                          class="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-40 dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800">
                    <lucide-angular name="chevron-left" [size]="12" class="block"></lucide-angular>
                  </button>
                  <span class="text-[12.5px] tabular-nums text-[#334155] dark:text-slate-300">{{ miles(previewIndice() + 1) }} de {{ miles(previewTotal()) }}</span>
                  <button type="button" (click)="verMensaje(1)" [disabled]="previewIndice() >= previewTotal() - 1 || previewCargando()" aria-label="Mensaje siguiente"
                          class="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-40 dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800">
                    <lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular>
                  </button>
                </div>
              }
            </div>

            @if (previewMensaje(); as m) {
              <div class="flex flex-col gap-[9px] rounded-xl bg-[#f4f6f9] p-[13px] dark:bg-slate-800">
                <div class="flex items-center gap-2">
                  <span class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#dbe4f0] text-xs font-bold text-[#334155] dark:bg-slate-600 dark:text-slate-100">{{ iniciales(m.nombre) }}</span>
                  <span class="text-[13px] font-semibold">{{ m.nombre || 'Cliente' }}</span>
                  <span class="text-xs tabular-nums text-[#5f6c80] dark:text-slate-400">{{ m.telefono }}</span>
                </div>
                <p class="rounded-xl rounded-bl-[3px] border border-[#e6e9ee] bg-white px-3 py-[11px] text-[13px] leading-[1.55] tabular-nums dark:border-slate-700 dark:bg-slate-900">{{ m.texto }}</p>
                <span class="text-xs tabular-nums" [ngClass]="m.caracteres > limiteSms ? 'font-semibold text-[#b91c1c] dark:text-red-400' : 'text-[#5f6c80] dark:text-slate-400'">
                  {{ m.caracteres }} / {{ limiteSms }} caracteres{{ m.caracteres > limiteSms ? ' · pasa del límite, el archivo no se generará' : '' }}
                </span>
              </div>
            } @else {
              <p class="rounded-xl bg-[#f4f6f9] px-3 py-6 text-center text-[13px] text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400">
                {{ previewCargando() ? 'Cargando…' : (previewError() || 'Ningún cliente cumple las condiciones hoy.') }}
              </p>
            }

            <div class="flex flex-col gap-1.5 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-3 text-[12.5px] dark:border-slate-800 dark:bg-slate-950/40">
              <span [class]="'text-xs font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400'">Filtros del tenor</span>
              @for (r of t.rangos; track $index) {
                <span class="tabular-nums">{{ r.columna }}: {{ r.min === null ? 'sin mínimo' : miles(r.min) }} – {{ r.max === null ? 'sin máximo' : miles(r.max) }}</span>
              }
              @if (t.restricciones.sinPromesaVigente) { <span>Sin promesa vigente</span> }
              @if (t.restricciones.sinListaNegra) { <span>Sin lista negra</span> }
              @if (t.restricciones.soloNoContenido) { <span>Solo clientes NO CONTENIDO</span> }
              @if (!t.rangos.length && !t.restricciones.sinPromesaVigente && !t.restricciones.sinListaNegra && !t.restricciones.soloNoContenido) {
                <span class="text-[#5f6c80] dark:text-slate-400">Sin rangos ni restricciones.</span>
              }
            </div>
          </div>

          <div class="flex gap-2 border-t border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <button type="button" (click)="descargar(t)" [disabled]="ocupado() === t.id || previewTotal() === 0"
                    class="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#0f172a] text-[13.5px] font-semibold text-white hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <span class="inline-flex" [class.animate-spin]="ocupado() === t.id">
                <lucide-angular [name]="ocupado() === t.id ? 'loader-2' : 'download'" [size]="15" class="block"></lucide-angular>
              </span>
              Descargar archivo
            </button>
            <a [routerLink]="['/sms/tenores', t.id]"
               class="btn flex h-[42px] items-center justify-center gap-2 rounded-[10px] border border-[#8491a3] bg-white px-4 text-[13.5px] font-semibold !text-[#0f172a] hover:bg-[#f4f6f9] hover:!no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-transparent dark:!text-slate-100 dark:hover:bg-slate-800">
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
  private readonly toast = inject(ToastService);

  readonly miles = miles;
  readonly limiteSms = LIMITE_SMS;
  readonly limiteVariables = VARIABLES_VISIBLES;
  readonly grupos = signal<GrupoTenores[]>([]);
  readonly cargando = signal(true);
  readonly busqueda = signal('');
  readonly ocupado = signal<number | null>(null);
  readonly archivadosAbiertos = signal(false);
  private readonly plegados = signal<ReadonlySet<number>>(new Set<number>());
  private readonly expandidos = signal<ReadonlySet<number>>(new Set<number>());

  /** Tenor abierto en el panel de vista previa y el mensaje que se está mirando. */
  readonly vistaPrevia = signal<Tenor | null>(null);
  readonly previewMensaje = signal<MensajeTenor | null>(null);
  readonly previewTotal = signal(0);
  readonly previewIndice = signal(0);
  readonly previewCargando = signal(false);
  readonly previewError = signal<string | null>(null);

  /** Grupos con sus tenores activos que coinciden con la búsqueda. */
  readonly visibles = computed<GrupoTenores[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.grupos()
      .map(grupo => ({ ...grupo, tenores: grupo.tenores.filter(t => t.estado === 'ACTIVO' && coincide(t, consulta)) }))
      .filter(grupo => grupo.tenores.length > 0);
  });

  readonly archivados = computed<Tenor[]>(() => {
    const consulta = normalizar(this.busqueda());
    return this.grupos()
      .flatMap(grupo => grupo.tenores)
      .filter(t => t.estado === 'ARCHIVADO' && coincide(t, consulta));
  });

  /** Conteo más reciente entre los tenores activos. */
  readonly ultimoConteo = computed<string | null>(() =>
    this.grupos()
      .flatMap(grupo => grupo.tenores)
      .filter(t => t.estado === 'ACTIVO' && !!t.conteoCalculadoAt)
      .map(t => t.conteoCalculadoAt as string)
      .reduce<string | null>((mayor, actual) => (mayor === null || actual > mayor ? actual : mayor), null)
  );

  ngOnInit(): void {
    this.cargar();
  }

  plegado(idSubcartera: number): boolean {
    return this.plegados().has(idSubcartera);
  }

  alternar(idSubcartera: number): void {
    this.plegados.update(actual => alternarEn(actual, idSubcartera));
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
  mostrarCartera(grupo: GrupoTenores): boolean {
    return !!grupo.nombreCartera && normalizar(grupo.nombreCartera) !== normalizar(grupo.nombreSubcartera ?? '');
  }

  cuantosTenores(cantidad: number): string {
    return cantidad === 1 ? '1 tenor' : `${cantidad} tenores`;
  }

  /** Tarjeta en alerta: el tenor no se puede calcular o hoy no alcanza a ningún cliente. */
  alerta(t: Tenor): boolean {
    return !!t.conteoError || t.clientesHoy === 0;
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
    if (this.vistaPrevia()) {
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
        this.toast.success('Tenor archivado.');
        this.ocupado.set(null);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo archivar el tenor.'));
        this.ocupado.set(null);
      }
    });
  }

  private cargar(): void {
    this.cargando.set(true);
    this.api.listar().subscribe({
      next: grupos => {
        this.grupos.set(grupos);
        this.cargando.set(false);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudieron cargar los tenores.'));
        this.cargando.set(false);
      }
    });
  }

  private reemplazar(tenor: Tenor): void {
    this.grupos.update(grupos =>
      grupos.map(grupo => ({ ...grupo, tenores: grupo.tenores.map(t => (t.id === tenor.id ? tenor : t)) }))
    );
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
    restricciones: t.restricciones
  };
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
