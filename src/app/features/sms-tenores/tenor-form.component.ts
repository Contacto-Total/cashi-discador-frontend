import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin } from 'rxjs';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { ToastService } from '../../shared/services/toast.service';
import { SmsTenoresService, guardarArchivo, mensajeDeError, nombreArchivoTenor } from './sms-tenores.service';
import {
  ConteoTenor,
  MensajeTenor,
  PreviewTenor,
  RangoTenor,
  TenorGuardar,
  VariableTenor,
  VariablesSubcartera
} from './sms-tenores.models';

const RADIO = 44;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;
const SEGMENTOS = 8;

/**
 * Crear o editar un tenor.
 *
 * La subcartera se elige al crear y queda fija: define la tabla de carga y, con
 * ella, las variables, los rangos y las restricciones que se pueden usar.
 *
 * El conteo y la previsualización se piden al elegir la subcartera o al pulsar
 * Recalcular. Cada petición consulta la carga, así que no se lanzan con cada
 * cambio del formulario: los cambios quedan marcados como pendientes.
 */
@Component({
  selector: 'app-tenor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header class="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 bg-white px-7 py-3.5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3.5 self-center">
          <a routerLink="/sms/combos"
             class="inline-flex h-8 items-center gap-1 rounded-lg border border-[#8491a3] pl-2 pr-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
            <lucide-angular name="chevron-left" [size]="15"></lucide-angular>
            Volver
          </a>
          <h1 class="text-lg font-bold tracking-tight">{{ editando() ? 'Editar tenor' : 'Nuevo tenor' }}</h1>
          @if (pendiente()) {
            <span class="text-xs font-semibold text-amber-800 dark:text-amber-300">Cambios sin recalcular</span>
          }
        </div>

        <div class="flex flex-wrap items-end gap-2">
          <label class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Cliente</span>
            <select [ngModel]="idInquilino" (ngModelChange)="idInquilino = $event; alCambiarCliente()" [disabled]="editando()"
                    class="h-9 min-w-40 rounded-lg border border-[#8491a3] bg-white px-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:disabled:bg-slate-900">
              <option [ngValue]="0">Elegir…</option>
              @for (c of clientes(); track c.id) {
                <option [ngValue]="c.id">{{ c.tenantName }}</option>
              }
            </select>
          </label>
          <lucide-angular name="chevron-right" [size]="12" class="mb-3 text-slate-500"></lucide-angular>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Cartera</span>
            <select [ngModel]="idCartera" (ngModelChange)="idCartera = $event; alCambiarCartera()" [disabled]="editando() || !idInquilino"
                    class="h-9 min-w-32 rounded-lg border border-[#8491a3] bg-white px-2.5 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:disabled:bg-slate-900">
              <option [ngValue]="0">Elegir…</option>
              @for (c of carteras(); track c.id) {
                <option [ngValue]="c.id">{{ c.portfolioName }}</option>
              }
            </select>
          </label>
          <lucide-angular name="chevron-right" [size]="12" class="mb-3 text-slate-500"></lucide-angular>
          <label class="flex flex-col gap-1">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Subcartera</span>
            <select [ngModel]="idSubcartera" (ngModelChange)="idSubcartera = $event; alCambiarSubcartera()" [disabled]="editando() || !idCartera"
                    class="h-9 min-w-32 rounded-lg border-[1.5px] border-slate-900 bg-white px-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600/30 disabled:bg-slate-100 dark:border-slate-300 dark:bg-slate-800 dark:disabled:bg-slate-900">
              <option [ngValue]="0">Elegir…</option>
              @for (s of subcarteras(); track s.id) {
                <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
              }
            </select>
          </label>
          <span class="mb-0.5 flex max-w-40 items-center gap-1.5 text-xs leading-snug text-slate-600 dark:text-slate-400">
            <lucide-angular name="lock" [size]="12" class="shrink-0"></lucide-angular>
            La subcartera no se puede cambiar después de crear
          </span>
        </div>
      </header>

      @if (variables(); as vars) {
        <main class="grid grid-cols-1 items-start gap-4 px-7 py-5 lg:grid-cols-[minmax(0,1fr)_400px]">
          <div class="flex flex-col gap-3.5">

            <section class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="text-[15px] font-bold">Mensaje</h2>
                <div class="flex items-center gap-2.5" role="img" [attr.aria-label]="caracteres() + ' de ' + limite() + ' caracteres'">
                  <div class="flex gap-[3px]">
                    @for (i of indicesSegmento; track i) {
                      <span class="block h-2.5 w-[18px] rounded-[3px]" [style.background]="fondoSegmento(i)"></span>
                    }
                  </div>
                  <span class="text-sm font-bold tabular-nums" [ngClass]="excede() ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'">{{ caracteres() }}</span>
                  <span class="text-sm tabular-nums text-slate-600 dark:text-slate-400">/ {{ limite() }} · {{ mensaje() ? 'mensaje de ejemplo' : 'plantilla' }}</span>
                </div>
              </div>
              <label class="flex flex-col gap-1">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Nombre del tenor</span>
                <input type="text" [ngModel]="nombre" (ngModelChange)="nombre = $event; marcarSinGuardar()" maxlength="150"
                       placeholder="Ej.: SMS Castigo — LTD"
                       class="h-9 rounded-lg border border-[#8491a3] bg-white px-3 text-sm placeholder:text-slate-500 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-600 dark:bg-slate-800" />
              </label>
              <label class="flex flex-col gap-1">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Texto del SMS</span>
                <textarea #editor rows="3" [ngModel]="plantilla" (ngModelChange)="plantilla = $event; marcarCambio()" maxlength="1000"
                          class="rounded-lg border border-[#8491a3] bg-white px-3 py-2.5 text-sm leading-relaxed focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-slate-600 dark:bg-slate-800"></textarea>
              </label>
            </section>

            <section class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h2 class="text-[15px] font-bold">Variables</h2>
                <span class="text-sm text-slate-600 dark:text-slate-400">Toca una variable para insertarla donde está el cursor</span>
              </div>
              <div class="grid grid-cols-1 gap-3 xl:grid-cols-[0.9fr_2.6fr_0.9fr]">
                <div class="flex flex-col gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Cliente</span>
                    <span class="rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">{{ vars.cliente.length }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (v of vars.cliente; track v.token) {
                      <button type="button" (click)="insertar(v)" [attr.aria-pressed]="usada(v)" [ngClass]="claseChip(v)">{{ v.etiqueta }}</button>
                    }
                  </div>
                </div>

                <div class="flex flex-col gap-2.5 rounded-lg border border-blue-100 bg-blue-50/60 p-3 dark:border-blue-900 dark:bg-blue-950/30">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Montos</span>
                      <span class="rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">{{ vars.montos.length }}</span>
                    </div>
                    <span class="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 dark:text-blue-300">
                      <lucide-angular name="filter" [size]="12"></lucide-angular>
                      Además filtran la lista
                    </span>
                  </div>
                  @if (vars.montos.length) {
                    <div class="flex flex-wrap gap-1.5">
                      @for (v of vars.montos; track v.token) {
                        <button type="button" (click)="insertar(v)" [attr.aria-pressed]="usada(v)" [ngClass]="claseChip(v)">
                          <lucide-angular name="filter" [size]="11"></lucide-angular>
                          {{ v.etiqueta }}
                        </button>
                      }
                    </div>
                    <p class="text-xs text-blue-900 dark:text-blue-200">Solo entran los clientes que tienen dato en cada monto que usa el mensaje.</p>
                  } @else {
                    <p class="text-sm text-slate-600 dark:text-slate-400">Esta subcartera no tiene montos configurados como visibles.</p>
                  }
                </div>

                <div class="flex flex-col gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950/40">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Fechas</span>
                    <span class="rounded-full border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">{{ vars.fechas.length }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (v of vars.fechas; track v.token) {
                      <button type="button" (click)="insertar(v)" [attr.aria-pressed]="usada(v)" [ngClass]="claseChip(v)">{{ v.etiqueta }}</button>
                    }
                  </div>
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <h2 class="text-[15px] font-bold">Filtros</h2>
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <fieldset class="flex flex-col gap-2">
                  <legend class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Rangos</legend>
                  @for (r of rangos; track $index; let i = $index) {
                    <div class="flex flex-wrap items-center gap-2 rounded-lg border border-[#8491a3] bg-white px-2.5 py-1.5 dark:border-slate-600 dark:bg-slate-800">
                      <select [ngModel]="r.columna" (ngModelChange)="r.columna = $event; marcarCambio()" aria-label="Columna del rango"
                              class="h-8 rounded-md border border-[#8491a3] bg-white px-1.5 text-sm font-semibold dark:border-slate-600 dark:bg-slate-900">
                        @for (m of vars.montos; track m.token) {
                          <option [ngValue]="m.columna">{{ m.etiqueta }}</option>
                        }
                      </select>
                      <label class="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        mín.
                        <input type="number" [ngModel]="r.min" (ngModelChange)="r.min = $event; marcarCambio()"
                               class="h-8 w-24 rounded-md border border-[#8491a3] px-2 text-sm tabular-nums text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
                      </label>
                      <label class="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        máx.
                        <input type="number" [ngModel]="r.max" (ngModelChange)="r.max = $event; marcarCambio()"
                               class="h-8 w-24 rounded-md border border-[#8491a3] px-2 text-sm tabular-nums text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100" />
                      </label>
                      <button type="button" (click)="quitarRango(i)" aria-label="Quitar rango"
                              class="ml-auto rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-400 dark:hover:bg-slate-700">
                        <lucide-angular name="x" [size]="14"></lucide-angular>
                      </button>
                    </div>
                  }
                  <button type="button" (click)="agregarRango()" [disabled]="!vars.montos.length"
                          class="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#8491a3] px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-800">
                    <lucide-angular name="plus" [size]="13"></lucide-angular>
                    Añadir rango
                  </button>
                </fieldset>

                <fieldset class="flex flex-col gap-2.5">
                  <legend class="mb-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Restricciones</legend>
                  <label class="flex items-start gap-2.5 text-sm">
                    <input type="checkbox" [ngModel]="sinPromesaVigente" (ngModelChange)="sinPromesaVigente = $event; marcarCambio()" class="mt-0.5 h-4 w-4 accent-slate-900 dark:accent-white" />
                    <span>Sin promesa vigente <span class="text-slate-600 dark:text-slate-400">(pendiente, parcial o vencida hace menos de 2 días)</span></span>
                  </label>
                  <label class="flex items-start gap-2.5 text-sm">
                    <input type="checkbox" [ngModel]="sinListaNegra" (ngModelChange)="sinListaNegra = $event; marcarCambio()" class="mt-0.5 h-4 w-4 accent-slate-900 dark:accent-white" />
                    <span>Sin lista negra</span>
                  </label>
                  @if (vars.admiteSoloNoContenido) {
                    <label class="flex items-start gap-2.5 text-sm">
                      <input type="checkbox" [ngModel]="soloNoContenido" (ngModelChange)="soloNoContenido = $event; marcarCambio()" class="mt-0.5 h-4 w-4 accent-slate-900 dark:accent-white" />
                      <span>Solo clientes NO CONTENIDO</span>
                    </label>
                  } @else {
                    <p class="text-sm text-slate-600 dark:text-slate-400">Esta subcartera no recibe contención.</p>
                  }
                </fieldset>
              </div>
            </section>
          </div>

          <aside class="flex flex-col gap-3.5 lg:sticky lg:top-4">
            <section class="flex flex-col gap-3.5 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center gap-4">
                <svg width="108" height="108" viewBox="0 0 108 108" class="shrink-0" role="img" [attr.aria-label]="porcentaje() + '% de la cartera'">
                  <circle cx="54" cy="54" r="44" fill="none" stroke-width="16" class="stroke-slate-200 dark:stroke-slate-700"></circle>
                  <circle cx="54" cy="54" r="44" fill="none" stroke-width="16" transform="rotate(-90 54 54)"
                          class="stroke-blue-600 transition-[stroke-dasharray] duration-500 dark:stroke-blue-400"
                          [attr.stroke-linecap]="arco() > 0 ? 'round' : 'butt'"
                          [attr.stroke-dasharray]="arco() + ' ' + circunferencia"></circle>
                  <text x="54" y="60" text-anchor="middle" class="fill-slate-900 text-[19px] font-extrabold dark:fill-white">{{ porcentaje() }}%</text>
                </svg>
                <div class="flex flex-col gap-0.5">
                  @if (conteo(); as c) {
                    <span class="text-4xl font-extrabold leading-none tracking-tight tabular-nums">{{ c.clientes | number }}</span>
                  } @else {
                    <span class="text-4xl font-extrabold leading-none text-slate-400">—</span>
                  }
                  <span class="text-sm font-semibold">clientes en esta lista</span>
                  <span class="text-sm tabular-nums text-slate-600 dark:text-slate-400">de {{ vars.clientesEnCartera | number }} en la cartera</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-2.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span class="text-xs text-slate-600 dark:text-slate-400">{{ pendiente() ? 'Hay cambios sin recalcular' : 'Calculado con la carga vigente' }}</span>
                <button type="button" (click)="recalcular()" [disabled]="calculando() || !plantilla.trim()"
                        class="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        [ngClass]="pendiente() ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700' : 'border-[#8491a3] text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'">
                  <lucide-angular [name]="calculando() ? 'loader-2' : 'refresh-cw'" [size]="12" [class.animate-spin]="calculando()"></lucide-angular>
                  Recalcular
                </button>
              </div>
            </section>

            <section class="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center justify-between gap-3">
                <h2 class="text-[15px] font-bold">Previsualización</h2>
                @if (totalPreview() > 0) {
                  <div class="flex items-center gap-1.5">
                    <button type="button" (click)="verMensaje(-1)" [disabled]="indicePreview() === 0" aria-label="Mensaje anterior"
                            class="flex h-7 w-7 items-center justify-center rounded-md border border-[#8491a3] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-40 dark:hover:bg-slate-800">
                      <lucide-angular name="chevron-left" [size]="13"></lucide-angular>
                    </button>
                    <span class="text-sm tabular-nums text-slate-700 dark:text-slate-300">{{ (indicePreview() + 1) | number }} de {{ totalPreview() | number }}</span>
                    <button type="button" (click)="verMensaje(1)" [disabled]="indicePreview() >= totalPreview() - 1" aria-label="Mensaje siguiente"
                            class="flex h-7 w-7 items-center justify-center rounded-md border border-[#8491a3] hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-40 dark:hover:bg-slate-800">
                      <lucide-angular name="chevron-right" [size]="13"></lucide-angular>
                    </button>
                  </div>
                }
              </div>
              @if (mensaje(); as m) {
                <div class="flex flex-col gap-2 rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
                  <div class="flex items-center gap-2">
                    <span class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-300 text-xs font-bold text-slate-800 dark:bg-slate-600 dark:text-slate-100">{{ inicial(m.nombre) }}</span>
                    <span class="text-sm font-semibold">{{ m.nombre || 'Cliente' }}</span>
                    <span class="text-xs tabular-nums text-slate-600 dark:text-slate-400">{{ m.telefono }}</span>
                  </div>
                  <p class="rounded-xl rounded-bl-sm border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed dark:border-slate-700 dark:bg-slate-900">{{ m.texto }}</p>
                  @if (m.segmentos > 1) {
                    <p class="text-xs font-semibold text-red-700 dark:text-red-400">Este mensaje ocupa {{ m.segmentos }} SMS: el archivo no se podrá generar.</p>
                  }
                </div>
              } @else {
                <p class="rounded-xl bg-slate-100 px-3 py-6 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">{{ textoSinMensaje() }}</p>
              }
            </section>

            <div class="flex flex-col gap-2">
              <button type="button" (click)="guardar()" [disabled]="guardando()"
                      class="flex h-11 items-center justify-center gap-2 rounded-lg bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                <lucide-angular [name]="guardando() ? 'loader-2' : 'save'" [size]="15" [class.animate-spin]="guardando()"></lucide-angular>
                {{ editando() ? 'Guardar cambios' : 'Guardar tenor' }}
              </button>
              <div class="flex gap-2">
                <button type="button" (click)="generarArchivo()" [disabled]="!editando() || descargando()"
                        [attr.title]="editando() ? null : 'Guarda el tenor para poder generar el archivo'"
                        class="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#8491a3] text-sm font-semibold hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800">
                  <lucide-angular [name]="descargando() ? 'loader-2' : 'download'" [size]="15" [class.animate-spin]="descargando()"></lucide-angular>
                  Generar archivo
                </button>
                <a routerLink="/sms/combos"
                   class="flex h-10 w-28 items-center justify-center rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800">
                  Cancelar
                </a>
              </div>
            </div>
          </aside>
        </main>
      } @else {
        <main class="px-7 py-10">
          <div class="mx-auto max-w-lg rounded-xl border border-dashed border-[#8491a3] bg-white px-6 py-10 text-center dark:bg-slate-900">
            <p class="font-semibold">Elige cliente, cartera y subcartera</p>
            <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">De la subcartera salen las variables, los rangos y las restricciones que puede usar el tenor.</p>
          </div>
        </main>
      }
    </div>
  `
})
export class TenorFormComponent implements OnInit {
  private readonly api = inject(SmsTenoresService);
  private readonly tenants = inject(TenantService);
  private readonly portafolios = inject(PortfolioService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  @ViewChild('editor') private editor?: ElementRef<HTMLTextAreaElement>;

  readonly circunferencia = CIRCUNFERENCIA;
  readonly indicesSegmento = Array.from({ length: SEGMENTOS }, (_, i) => i);

  readonly idTenor = signal<number | null>(null);
  readonly editando = computed(() => this.idTenor() !== null);
  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);
  readonly variables = signal<VariablesSubcartera | null>(null);
  readonly conteo = signal<ConteoTenor | null>(null);
  readonly mensaje = signal<MensajeTenor | null>(null);
  readonly totalPreview = signal(0);
  readonly indicePreview = signal(0);
  readonly calculando = signal(false);
  readonly guardando = signal(false);
  readonly descargando = signal(false);
  /** Hay cambios que afectan a la lista y todavía no se recalcularon. */
  readonly pendiente = signal(false);

  readonly porcentaje = computed(() => {
    const c = this.conteo();
    return c && c.clientesEnCartera > 0 ? Math.round((c.clientes * 100) / c.clientesEnCartera) : 0;
  });
  readonly arco = computed(() => (this.porcentaje() / 100) * CIRCUNFERENCIA);

  idInquilino = 0;
  idCartera = 0;
  idSubcartera = 0;
  nombre = '';
  plantilla = '';
  rangos: RangoTenor[] = [];
  sinPromesaVigente = true;
  sinListaNegra = true;
  soloNoContenido = false;

  /** Hay cambios sin guardar: el archivo se genera con la versión guardada. */
  private sinGuardar = false;

  ngOnInit(): void {
    this.tenants.getAllTenants().subscribe({
      next: clientes => this.clientes.set(clientes),
      error: () => this.toast.error('No se pudieron cargar los clientes.')
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id > 0) {
      this.idTenor.set(id);
      this.cargarTenor(id);
    }
  }

  alCambiarCliente(): void {
    this.idCartera = 0;
    this.idSubcartera = 0;
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.limpiarSubcartera();
    if (this.idInquilino > 0) {
      this.portafolios.getPortfoliosByTenant(this.idInquilino).subscribe({
        next: carteras => this.carteras.set(carteras),
        error: () => this.toast.error('No se pudieron cargar las carteras.')
      });
    }
  }

  alCambiarCartera(): void {
    this.idSubcartera = 0;
    this.subcarteras.set([]);
    this.limpiarSubcartera();
    if (this.idCartera > 0) {
      this.portafolios.getSubPortfoliosByPortfolio(this.idCartera).subscribe({
        next: subcarteras => this.subcarteras.set(subcarteras),
        error: () => this.toast.error('No se pudieron cargar las subcarteras.')
      });
    }
  }

  alCambiarSubcartera(): void {
    this.limpiarSubcartera();
    if (this.idSubcartera > 0) {
      this.cargarVariables();
    }
  }

  usada(v: VariableTenor): boolean {
    return this.plantilla.includes(`{${v.token}}`);
  }

  claseChip(v: VariableTenor): string {
    const base = 'inline-flex h-[30px] items-center gap-1 rounded-full border px-3 text-[12.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600';
    return this.usada(v)
      ? `${base} border-slate-900 bg-slate-900 font-semibold text-white dark:border-white dark:bg-white dark:text-slate-900`
      : `${base} border-[#8491a3] bg-white font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700`;
  }

  /** Inserta la variable donde está el cursor del editor. */
  insertar(v: VariableTenor): void {
    const token = `{${v.token}}`;
    const editor = this.editor?.nativeElement;
    const inicio = editor?.selectionStart ?? this.plantilla.length;
    const fin = editor?.selectionEnd ?? inicio;
    this.plantilla = this.plantilla.slice(0, inicio) + token + this.plantilla.slice(fin);
    this.marcarCambio();
    if (editor) {
      const posicion = inicio + token.length;
      queueMicrotask(() => {
        editor.focus();
        editor.setSelectionRange(posicion, posicion);
      });
    }
  }

  agregarRango(): void {
    const primera = this.variables()?.montos[0]?.columna;
    if (!primera) {
      return;
    }
    this.rangos = [...this.rangos, { columna: primera, min: null, max: null }];
    this.marcarCambio();
  }

  quitarRango(indice: number): void {
    this.rangos = this.rangos.filter((_, i) => i !== indice);
    this.marcarCambio();
  }

  marcarCambio(): void {
    this.pendiente.set(true);
    this.sinGuardar = true;
  }

  marcarSinGuardar(): void {
    this.sinGuardar = true;
  }

  /** Cuenta y trae el primer mensaje en una sola petición: el total de la previsualización es el conteo. */
  recalcular(): void {
    const vars = this.variables();
    if (!vars || !this.plantilla.trim()) {
      return;
    }
    this.calculando.set(true);
    this.api.preview(this.borrador(), 0).subscribe({
      next: preview => {
        this.conteo.set({ clientes: preview.total, clientesEnCartera: vars.clientesEnCartera });
        this.aplicarPreview(preview);
        this.pendiente.set(false);
        this.calculando.set(false);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo calcular la lista.'));
        this.calculando.set(false);
      }
    });
  }

  verMensaje(desplazamiento: number): void {
    const siguiente = this.indicePreview() + desplazamiento;
    if (siguiente < 0 || siguiente >= this.totalPreview()) {
      return;
    }
    this.api.preview(this.borrador(), siguiente).subscribe({
      next: preview => this.aplicarPreview(preview),
      error: err => this.toast.error(mensajeDeError(err, 'No se pudo cargar el mensaje.'))
    });
  }

  guardar(): void {
    if (!this.nombre.trim()) {
      this.toast.warning('Ponle un nombre al tenor.');
      return;
    }
    const id = this.idTenor();
    const peticion = id ? this.api.actualizar(id, this.borrador()) : this.api.crear(this.borrador());
    this.guardando.set(true);
    peticion.subscribe({
      next: () => {
        this.sinGuardar = false;
        this.toast.success(id ? 'Tenor actualizado.' : 'Tenor creado.');
        this.guardando.set(false);
        this.router.navigate(['/sms/combos']);
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo guardar el tenor.'));
        this.guardando.set(false);
      }
    });
  }

  generarArchivo(): void {
    const id = this.idTenor();
    if (!id) {
      return;
    }
    if (this.sinGuardar) {
      this.toast.warning('Guarda los cambios antes de generar el archivo: se genera con la versión guardada.');
      return;
    }
    this.descargando.set(true);
    this.api.exportable(id).subscribe({
      next: estado => {
        if (!estado.exportable) {
          this.toast.warning(estado.motivo ?? 'El archivo no se puede generar.');
          this.descargando.set(false);
          return;
        }
        this.api.descargar(id).subscribe({
          next: blob => {
            guardarArchivo(blob, nombreArchivoTenor(id));
            this.descargando.set(false);
          },
          error: () => {
            this.toast.error('No se pudo descargar el archivo.');
            this.descargando.set(false);
          }
        });
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se pudo comprobar el tenor.'));
        this.descargando.set(false);
      }
    });
  }

  caracteres(): number {
    return this.mensaje()?.caracteres ?? this.plantilla.length;
  }

  limite(): number {
    return this.mensaje()?.codificacion === 'UCS2' ? 70 : 160;
  }

  excede(): boolean {
    return this.caracteres() > this.limite();
  }

  fondoSegmento(indice: number): string {
    const tramo = this.limite() / SEGMENTOS;
    const lleno = Math.max(0, Math.min(1, (this.caracteres() - indice * tramo) / tramo)) * 100;
    const color = this.excede() ? '#b91c1c' : '#15803d';
    return `linear-gradient(90deg, ${color} ${lleno}%, #e2e8f0 ${lleno}%)`;
  }

  inicial(nombre: string): string {
    return (nombre || '?').charAt(0).toUpperCase();
  }

  textoSinMensaje(): string {
    if (this.calculando()) {
      return 'Calculando…';
    }
    if (!this.plantilla.trim()) {
      return 'Escribe el mensaje para ver cómo le llega a un cliente.';
    }
    if (this.pendiente() || this.conteo() === null) {
      return 'Pulsa Recalcular para ver un mensaje de ejemplo.';
    }
    return 'Ningún cliente cumple las condiciones.';
  }

  private cargarTenor(id: number): void {
    this.api.obtener(id).subscribe({
      next: tenor => {
        this.nombre = tenor.nombre;
        this.plantilla = tenor.plantilla;
        this.rangos = tenor.rangos.map(r => ({ ...r }));
        this.sinPromesaVigente = tenor.restricciones.sinPromesaVigente;
        this.sinListaNegra = tenor.restricciones.sinListaNegra;
        this.soloNoContenido = tenor.restricciones.soloNoContenido;
        this.idInquilino = tenor.idInquilino;
        this.idCartera = tenor.idCartera;
        this.idSubcartera = tenor.idSubcartera;
        this.sinGuardar = false;
        forkJoin({
          carteras: this.portafolios.getPortfoliosByTenant(tenor.idInquilino),
          subcarteras: this.portafolios.getSubPortfoliosByPortfolio(tenor.idCartera)
        }).subscribe({
          next: ({ carteras, subcarteras }) => {
            this.carteras.set(carteras);
            this.subcarteras.set(subcarteras);
            this.cargarVariables();
          },
          error: () => this.toast.error('No se pudo cargar la cartera del tenor.')
        });
      },
      error: err => {
        this.toast.error(mensajeDeError(err, 'No se encontró el tenor.'));
        this.router.navigate(['/sms/combos']);
      }
    });
  }

  private cargarVariables(): void {
    this.api.variables(this.idInquilino, this.idCartera, this.idSubcartera).subscribe({
      next: vars => {
        this.variables.set(vars);
        if (!vars.admiteSoloNoContenido) {
          this.soloNoContenido = false;
        }
        this.recalcular();
      },
      error: err => this.toast.error(mensajeDeError(err, 'No se pudieron cargar las variables de la subcartera.'))
    });
  }

  private limpiarSubcartera(): void {
    this.variables.set(null);
    this.conteo.set(null);
    this.mensaje.set(null);
    this.totalPreview.set(0);
    this.indicePreview.set(0);
    this.pendiente.set(false);
    this.rangos = [];
    this.soloNoContenido = false;
  }

  private aplicarPreview(preview: PreviewTenor): void {
    this.mensaje.set(preview.mensajes[0] ?? null);
    this.totalPreview.set(preview.total);
    this.indicePreview.set(preview.desde);
  }

  private borrador(): TenorGuardar {
    return {
      nombre: this.nombre,
      idInquilino: this.idInquilino || null,
      idCartera: this.idCartera || null,
      idSubcartera: this.idSubcartera || null,
      plantilla: this.plantilla,
      rangos: this.rangos.map(r => ({ columna: r.columna, min: numeroONulo(r.min), max: numeroONulo(r.max) })),
      restricciones: {
        sinPromesaVigente: this.sinPromesaVigente,
        sinListaNegra: this.sinListaNegra,
        soloNoContenido: this.soloNoContenido
      }
    };
  }
}

/** Un input numérico vacío llega como null o cadena vacía: ambos significan "sin límite". */
function numeroONulo(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}
