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
import { SmsTenoresService, guardarArchivo, mensajeDeError, miles, nombreArchivoTenor, tokenDe } from './sms-tenores.service';
import {
  CombinadaTenor,
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

/** Clases que se repiten en la pantalla. */
const ESTILOS = {
  tarjeta: 'flex flex-col gap-[13px] rounded-xl border border-[#e6e9ee] bg-white px-[18px] py-4 dark:border-slate-800 dark:bg-slate-900',
  panel: 'flex flex-col gap-2.5 rounded-[10px] border border-[#eef1f5] bg-[#f8fafc] px-3 py-3 dark:border-slate-800 dark:bg-slate-950/40',
  etiqueta: 'text-xs font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400',
  contador: 'rounded-full border border-[#e2e8f0] bg-white px-2 py-px text-xs font-semibold tabular-nums text-[#5f6c80] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400',
  chip: 'inline-flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-full border border-[#8491a3] bg-white px-[11px] text-[12.5px] font-medium text-[#334155] transition-[background-color,transform,box-shadow] duration-150 hover:bg-[#f4f6f9] hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)] active:scale-95 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700',
  chipUsado: 'inline-flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-full border border-[#0f172a] bg-[#0f172a] px-[11px] text-[12.5px] font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#1e293b] active:scale-95 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-1 dark:border-white dark:bg-white dark:text-slate-900',
  select: 'h-[34px] w-full appearance-none rounded-lg border !border-[#8491a3] !bg-white pl-[11px] pr-8 text-[13px] !text-[#0f172a] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:!bg-[#f4f6f9] disabled:!text-[#5f6c80] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:disabled:!bg-slate-900 dark:disabled:!text-slate-400',
  flechaSelect: 'pointer-events-none absolute right-[11px] top-1/2 flex -translate-y-1/2 text-[#5f6c80] dark:text-slate-400',
  campo: 'h-[38px] rounded-lg border !border-[#8491a3] !bg-white px-3 text-[13.5px] !text-[#0f172a] placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100 dark:placeholder:text-slate-400',
  numeroRango: 'h-8 w-0 min-w-0 flex-1 border-0 !bg-transparent px-1 text-[13px] tabular-nums !text-[#334155] placeholder:text-[#8491a3] [appearance:textfield] focus:outline-none focus:!shadow-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:!text-slate-200 dark:placeholder:text-slate-500',
  casilla: 'mt-px flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-[#8491a3] bg-white text-transparent peer-checked:border-[#0f172a] peer-checked:bg-[#0f172a] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#2563eb] peer-focus-visible:ring-offset-1 dark:border-slate-500 dark:bg-slate-800 dark:peer-checked:border-white dark:peer-checked:bg-white dark:peer-checked:text-slate-900'
} as const;

interface ParteMensaje {
  texto: string;
  variable: boolean;
}

/**
 * Crear o editar un tenor.
 *
 * La subcartera se elige al crear y queda fija: define la tabla de carga y, con
 * ella, las variables, los rangos y las restricciones que se pueden usar.
 *
 * El conteo y la previsualización se piden al elegir la subcartera o al pulsar
 * Recalcular. Cada petición consulta la carga, así que no se lanzan con cada
 * cambio del formulario: los cambios quedan marcados como pendientes.
 *
 * El editor es un textarea con el texto transparente sobre una copia que pinta
 * las variables; ambos comparten caja, fuente e interlineado, y el textarea crece
 * con el contenido para que nunca aparezca una barra que desalinee la copia.
 *
 * Estilos: el CSS global del tema claro sobrescribe enlaces, inputs, selects,
 * checkbox, fieldset, aside y algunas utilidades (`p-3`, `mb-3`, `bg-slate-900`...),
 * y como no está en una capa gana a Tailwind. Por eso los colores van en
 * hexadecimal, los controles usan utilidades con `!`, los enlaces con aspecto de
 * botón llevan `btn` y los grupos son div. Los iconos de lucide copian su `class`
 * al svg: lo que los posiciona o gira va en un span.
 */
@Component({
  selector: 'app-tenor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  styles: [`
    @keyframes aparecer { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    .aparecer { animation: aparecer 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
    @media (prefers-reduced-motion: reduce) { .aparecer { animation: none; } }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">
      <div class="flex flex-wrap items-center justify-between gap-6 border-b border-[#e6e9ee] bg-white px-7 py-3.5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-3.5">
          <a routerLink="/sms/combos"
             class="btn inline-flex h-8 items-center gap-[5px] rounded-lg border border-[#8491a3] pl-2 pr-[11px] text-[13px] font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
            <lucide-angular name="chevron-left" [size]="15" class="block"></lucide-angular>
            Volver
          </a>
          <h1 class="!m-0 text-lg font-bold tracking-[-0.01em]">{{ editando() ? 'Editar tenor' : 'Nuevo tenor' }}</h1>
          @if (estado()) {
            <span class="text-xs text-[#5f6c80] dark:text-slate-400">{{ estado() }}</span>
          }
        </div>

        <div class="flex flex-wrap items-end gap-2">
          <label class="flex flex-col gap-1">
            <span [class]="estilos.etiqueta">Cliente</span>
            <span class="relative block min-w-[150px]">
              <select [ngModel]="idInquilino" (ngModelChange)="idInquilino = $event; alCambiarCliente()" [disabled]="editando()" [class]="estilos.select">
                <option [ngValue]="0">Elegir…</option>
                @for (c of clientes(); track c.id) {
                  <option [ngValue]="c.id">{{ c.tenantName }}</option>
                }
              </select>
              <span [class]="estilos.flechaSelect"><lucide-angular name="chevron-down" [size]="12" class="block"></lucide-angular></span>
            </span>
          </label>
          <span class="mb-[11px] flex text-[#5f6c80] dark:text-slate-500"><lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular></span>
          <label class="flex flex-col gap-1">
            <span [class]="estilos.etiqueta">Cartera</span>
            <span class="relative block min-w-[120px]">
              <select [ngModel]="idCartera" (ngModelChange)="idCartera = $event; alCambiarCartera()" [disabled]="editando() || !idInquilino" [class]="estilos.select">
                <option [ngValue]="0">Elegir…</option>
                @for (c of carteras(); track c.id) {
                  <option [ngValue]="c.id">{{ c.portfolioName }}</option>
                }
              </select>
              <span [class]="estilos.flechaSelect"><lucide-angular name="chevron-down" [size]="12" class="block"></lucide-angular></span>
            </span>
          </label>
          <span class="mb-[11px] flex text-[#5f6c80] dark:text-slate-500"><lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular></span>
          <label class="flex flex-col gap-1">
            <span [class]="estilos.etiqueta">Subcartera</span>
            <span class="relative block min-w-[120px]">
              <select [ngModel]="idSubcartera" (ngModelChange)="idSubcartera = $event; alCambiarSubcartera()" [disabled]="editando() || !idCartera"
                      class="h-[34px] w-full appearance-none rounded-lg border-[1.5px] !border-[#0f172a] !bg-white pl-[11px] pr-8 text-[13px] font-semibold !text-[#0f172a] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] disabled:cursor-not-allowed disabled:!bg-[#f4f6f9] dark:!border-slate-300 dark:!bg-slate-800 dark:!text-slate-100 dark:disabled:!bg-slate-900">
                <option [ngValue]="0">Elegir…</option>
                @for (s of subcarteras(); track s.id) {
                  <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
                }
              </select>
              <span [class]="estilos.flechaSelect"><lucide-angular [name]="editando() ? 'lock' : 'chevron-down'" [size]="12" class="block"></lucide-angular></span>
            </span>
          </label>
        </div>
      </div>

      @if (variables(); as vars) {
        <main class="grid grid-cols-1 gap-[18px] px-7 py-[18px] lg:grid-cols-[minmax(0,1fr)_400px]">
          <div class="flex flex-col gap-3.5">

            <section [class]="estilos.tarjeta">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <h2 class="!m-0 text-[15px] font-bold">Mensaje</h2>
                <div class="flex items-center gap-2.5" role="img" [attr.aria-label]="caracteres() + ' de ' + limite() + ' caracteres'">
                  <div class="flex gap-[3px]">
                    @for (i of indicesSegmento; track i) {
                      <span class="block h-2.5 w-[18px] overflow-hidden rounded-[3px] bg-[#e2e8f0] dark:bg-slate-700">
                        <span class="block h-full" [ngClass]="excede() ? 'bg-[#b91c1c]' : 'bg-[#15803d]'" [style.width.%]="rellenoSegmento(i)"></span>
                      </span>
                    }
                  </div>
                  <span class="text-[13px] font-bold tabular-nums" [ngClass]="excede() ? 'text-[#b91c1c] dark:text-red-400' : 'text-[#15803d] dark:text-green-400'">{{ caracteres() }}</span>
                  <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">/ {{ limite() }} · {{ resumenSms() }}</span>
                </div>
              </div>

              <label class="flex flex-col gap-1">
                <span [class]="estilos.etiqueta">Nombre del tenor</span>
                <input type="text" [ngModel]="nombre" (ngModelChange)="nombre = $event; marcarSinGuardar()" maxlength="150"
                       placeholder="Ej.: SMS Castigo — LTD" [class]="estilos.campo" />
              </label>

              <label class="flex flex-col gap-1">
                <span [class]="estilos.etiqueta">Texto del SMS</span>
                <span class="relative block">
                  <span aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words rounded-[10px] border-[1.5px] border-transparent bg-white px-[13px] py-3 text-sm leading-[1.6] text-[#0f172a] dark:bg-slate-800 dark:text-slate-100">@for (parte of partesPlantilla(); track $index) {@if (parte.variable) {<mark class="rounded-[4px] bg-[#e8f0fe] text-[#1d4ed8] shadow-[0_0_0_2px_#e8f0fe] dark:bg-blue-950 dark:text-blue-300 dark:shadow-[0_0_0_2px_#172554]">{{ parte.texto }}</mark>}@else {<span>{{ parte.texto }}</span>}}<span>&#8203;</span></span>
                  <textarea #editor rows="3" [ngModel]="plantilla" (ngModelChange)="plantilla = $event; marcarCambio()" (input)="ajustarAltura()" maxlength="1000"
                            placeholder="Escribe el SMS y toca las variables para insertarlas"
                            class="relative block min-h-[100px] w-full resize-none overflow-hidden rounded-[10px] border-[1.5px] !border-[#8491a3] !bg-transparent px-[13px] py-3 text-sm leading-[1.6] !text-transparent caret-[#0f172a] selection:bg-[#2563eb]/25 placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:caret-white dark:placeholder:text-slate-400"></textarea>
                </span>
              </label>
            </section>

            <section [class]="estilos.tarjeta">
              <div class="flex flex-wrap items-baseline justify-between gap-3">
                <h2 class="!m-0 text-[15px] font-bold">Variables</h2>
                <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Toca una variable para insertarla en el mensaje · tócala otra vez para quitarla</span>
              </div>
              <div class="grid grid-cols-1 items-stretch gap-3 xl:grid-cols-[0.9fr_2.6fr_0.9fr]">
                <div [class]="estilos.panel">
                  <div class="flex items-center gap-2">
                    <span [class]="estilos.etiqueta">Cliente</span>
                    <span [class]="estilos.contador">{{ vars.cliente.length }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (v of vars.cliente; track v.token) {
                      <button type="button" (click)="insertar(v)" [attr.aria-pressed]="usada(v)" [class]="claseChip(v)">{{ v.etiqueta }}</button>
                    }
                  </div>
                </div>

                <div class="flex flex-col gap-2.5 rounded-[10px] border border-[#dbe7fb] bg-[#f5f9ff] px-3 py-3 dark:border-blue-900 dark:bg-blue-950/30">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span [class]="estilos.etiqueta">Montos</span>
                      <span [class]="estilos.contador">{{ vars.montos.length }}</span>
                    </div>
                    <span class="inline-flex items-center gap-[5px] text-xs font-semibold text-[#1d4ed8] dark:text-blue-300">
                      <lucide-angular name="filter" [size]="12" class="block"></lucide-angular>
                      Además filtran la lista
                    </span>
                  </div>
                  @if (vars.montos.length) {
                    <div class="flex flex-wrap gap-1.5">
                      @for (v of vars.montos; track v.token) {
                        <button type="button" (click)="insertar(v)" [attr.aria-pressed]="usada(v)" [class]="claseChip(v)">
                          @if (usada(v)) {
                            <lucide-angular name="filter" [size]="11" class="block"></lucide-angular>
                          }
                          {{ v.etiqueta }}
                        </button>
                      }
                    </div>

                    @if (combinadas.length || combinadaEnEdicion()) {
                      <div class="flex flex-col gap-2 border-t border-[#dbe7fb] pt-2.5 dark:border-blue-900">
                        <span class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.05em] text-[#5f6c80] dark:text-slate-400">
                          <lucide-angular name="layers" [size]="12" class="block"></lucide-angular>
                          Combinados
                        </span>
                        <div class="flex flex-wrap gap-1.5">
                          @for (c of combinadas; track c.token; let i = $index) {
                            <span class="inline-flex items-center rounded-full" [ngClass]="usadaCombinada(c) ? 'bg-[#0f172a] dark:bg-white' : 'border border-[#8491a3] bg-white dark:border-slate-600 dark:bg-slate-800'">
                              <button type="button" (click)="insertarCombinada(c)" [attr.aria-pressed]="usadaCombinada(c)" [attr.title]="resumenCombinada(c)"
                                      class="inline-flex h-[30px] items-center gap-[5px] whitespace-nowrap rounded-l-full pl-[11px] pr-1.5 text-[12.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                                      [ngClass]="usadaCombinada(c) ? 'font-semibold text-white dark:text-slate-900' : 'font-medium text-[#334155] hover:bg-[#f4f6f9] dark:text-slate-200 dark:hover:bg-slate-700'">
                                <lucide-angular name="layers" [size]="11" class="block"></lucide-angular>
                                {{ c.etiqueta }}
                                <span class="rounded-full px-1.5 text-[10px] tabular-nums" [ngClass]="usadaCombinada(c) ? 'bg-white/20 dark:bg-slate-900/15' : 'bg-[#eef2f7] text-[#5f6c80] dark:bg-slate-700 dark:text-slate-300'">{{ c.columnas.length }}</span>
                              </button>
                              <button type="button" (click)="editarCombinada(i)" [attr.aria-label]="'Editar ' + c.etiqueta"
                                      class="flex h-[30px] w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                                      [ngClass]="usadaCombinada(c) ? 'text-white/80 hover:text-white dark:text-slate-700' : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400'">
                                <lucide-angular name="pencil" [size]="11" class="block"></lucide-angular>
                              </button>
                              <button type="button" (click)="quitarCombinada(i)" [attr.aria-label]="'Quitar ' + c.etiqueta"
                                      class="flex h-[30px] w-6 items-center justify-center rounded-r-full pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                                      [ngClass]="usadaCombinada(c) ? 'text-white/80 hover:text-white dark:text-slate-700' : 'text-[#5f6c80] hover:text-[#b91c1c] dark:text-slate-400'">
                                <lucide-angular name="x" [size]="12" class="block"></lucide-angular>
                              </button>
                            </span>
                          }
                        </div>
                      </div>
                    }

                    @if (combinadaEnEdicion(); as edicion) {
                      <div class="flex flex-col gap-3 rounded-lg border border-[#c7d7f5] bg-white px-3.5 py-3.5 dark:border-blue-900 dark:bg-slate-900">
                        <span class="text-[13px] font-bold">{{ edicion.indice === null ? 'Nuevo monto combinado' : 'Editar monto combinado' }}</span>
                        <label class="flex flex-col gap-1">
                          <span [class]="estilos.etiqueta">Nombre</span>
                          <input type="text" [ngModel]="edicion.etiqueta" (ngModelChange)="edicion.etiqueta = $event" maxlength="60" placeholder="Ej.: LTD combinado"
                                 class="h-9 rounded-lg border !border-[#8491a3] !bg-white px-3 text-[13px] !text-[#0f172a] placeholder:text-[#5f6c80] focus:!border-[#2563eb] focus:outline-none focus:!shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-100" />
                          @if (edicion.etiqueta.trim()) {
                            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">En el mensaje: <span class="font-semibold text-[#1d4ed8] dark:text-blue-300">{{ '{' + tokenDe(edicion.etiqueta) + '}' }}</span></span>
                          }
                        </label>
                        <div class="flex flex-col gap-1.5">
                          <span [class]="estilos.etiqueta">Toca los montos en orden de prioridad</span>
                          <div class="flex flex-wrap gap-1.5">
                            @for (v of vars.montos; track v.token) {
                              <button type="button" (click)="alternarEnCombinada(v.columna!)" [attr.aria-pressed]="edicion.columnas.includes(v.columna!)"
                                      class="inline-flex h-7 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                                      [ngClass]="edicion.columnas.includes(v.columna!) ? 'border-[#1d4ed8] bg-[#1d4ed8] font-semibold text-white' : 'border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200'">
                                @if (edicion.columnas.includes(v.columna!)) {
                                  <span class="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px] font-bold tabular-nums">{{ edicion.columnas.indexOf(v.columna!) + 1 }}</span>
                                }
                                {{ v.etiqueta }}
                              </button>
                            }
                          </div>
                        </div>
                        @if (edicion.columnas.length) {
                          <ol class="flex flex-col gap-1">
                            @for (columna of edicion.columnas; track columna; let k = $index) {
                              <li class="flex items-center gap-2 rounded-md bg-[#f4f6f9] px-2 py-1 text-[12.5px] dark:bg-slate-800">
                                <span class="w-4 text-center font-bold tabular-nums text-[#1d4ed8] dark:text-blue-300">{{ k + 1 }}</span>
                                <span class="flex-1">{{ etiquetaDeMonto(columna) }}</span>
                                <button type="button" (click)="moverEnCombinada(k, -1)" [disabled]="k === 0" aria-label="Subir prioridad" class="flex h-6 w-6 items-center justify-center rounded text-[#5f6c80] hover:bg-white hover:text-[#0f172a] disabled:opacity-30 dark:hover:bg-slate-700"><lucide-angular name="chevron-up" [size]="13" class="block"></lucide-angular></button>
                                <button type="button" (click)="moverEnCombinada(k, 1)" [disabled]="k === edicion.columnas.length - 1" aria-label="Bajar prioridad" class="flex h-6 w-6 items-center justify-center rounded text-[#5f6c80] hover:bg-white hover:text-[#0f172a] disabled:opacity-30 dark:hover:bg-slate-700"><lucide-angular name="chevron-down" [size]="13" class="block"></lucide-angular></button>
                                <button type="button" (click)="alternarEnCombinada(columna)" [attr.aria-label]="'Quitar ' + etiquetaDeMonto(columna)" class="flex h-6 w-6 items-center justify-center rounded text-[#5f6c80] hover:bg-white hover:text-[#b91c1c] dark:hover:bg-slate-700"><lucide-angular name="x" [size]="13" class="block"></lucide-angular></button>
                              </li>
                            }
                          </ol>
                        }
                        <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <label for="minimo-combinada" class="text-[12.5px] text-[#334155] dark:text-slate-300">Saltar montos menores a</label>
                          <div class="flex h-8 w-32 items-center rounded-lg border border-[#8491a3] bg-white pl-2.5 focus-within:border-[#2563eb] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:border-slate-600 dark:bg-slate-800">
                            <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">S/</span>
                            <input id="minimo-combinada" type="number" min="0" step="1" placeholder="sin mínimo" [ngModel]="edicion.minimo" (ngModelChange)="edicion.minimo = $event" [class]="estilos.numeroRango" />
                          </div>
                        </div>
                        <p class="flex items-start gap-2 rounded-md bg-[#f4f7fd] px-2.5 py-2 text-[12px] leading-snug text-[#1e3a8a] dark:bg-blue-950/40 dark:text-blue-200">
                          <lucide-angular name="info" [size]="13" class="block shrink-0 translate-y-px"></lucide-angular>
                          <span>{{ reglaEnEdicion(edicion) }}</span>
                        </p>
                        <div class="flex items-center justify-end gap-2">
                          <button type="button" (click)="combinadaEnEdicion.set(null)" class="h-8 rounded-[7px] px-3 text-[12.5px] font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:text-slate-300 dark:hover:bg-slate-800">Cancelar</button>
                          <button type="button" (click)="guardarCombinada()" [disabled]="!edicion.etiqueta.trim() || edicion.columnas.length < 2"
                                  class="inline-flex h-8 items-center gap-1.5 rounded-[7px] bg-[#0f172a] px-3 text-[12.5px] font-semibold text-white hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-slate-900">
                            <lucide-angular name="check" [size]="12" class="block"></lucide-angular>
                            {{ edicion.indice === null ? 'Crear e insertar' : 'Guardar cambios' }}
                          </button>
                        </div>
                      </div>
                    } @else if (vars.montos.length > 1) {
                      <button type="button" (click)="nuevaCombinada()"
                              class="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#8491a3] bg-white px-3 text-[12.5px] font-medium text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-transparent dark:text-slate-300 dark:hover:bg-slate-800">
                        <lucide-angular name="layers" [size]="12" class="block"></lucide-angular>
                        Combinar montos
                      </button>
                    }

                    <p class="mt-auto flex items-center gap-2 rounded-lg bg-white/80 px-2.5 py-1.5 text-xs text-[#1e40af] ring-1 ring-[#dbe7fb] dark:bg-blue-950/40 dark:text-blue-200 dark:ring-blue-900">
                      <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-white"><lucide-angular name="filter" [size]="10" class="block"></lucide-angular></span>
                      Usar un monto excluye a quien no lo tiene.
                    </p>
                  } @else {
                    <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Esta subcartera no tiene montos marcados como visibles en su configuración de cabeceras.</p>
                  }
                </div>

                <div [class]="estilos.panel">
                  <div class="flex items-center gap-2">
                    <span [class]="estilos.etiqueta">Fechas</span>
                    <span [class]="estilos.contador">{{ vars.fechas.length }}</span>
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    @for (v of vars.fechas; track v.token) {
                      <button type="button" (click)="insertar(v)" [attr.aria-pressed]="usada(v)" [class]="claseChip(v)">{{ v.etiqueta }}</button>
                    }
                  </div>
                </div>
              </div>
            </section>

          </div>

          <div class="flex flex-col gap-3.5">
            <section class="flex flex-col gap-3.5 rounded-xl border border-[#e6e9ee] bg-white px-[18px] py-4 dark:border-slate-800 dark:bg-slate-900">
              <div class="flex items-center gap-[18px]">
                <svg width="108" height="108" viewBox="0 0 108 108" class="shrink-0" role="img" [attr.aria-label]="porcentaje() + '% de la cartera'">
                  <circle cx="54" cy="54" r="44" fill="none" stroke-width="16" class="stroke-[#e8edf5] dark:stroke-slate-700"></circle>
                  <circle cx="54" cy="54" r="44" fill="none" stroke-width="16" transform="rotate(-90 54 54)"
                          class="stroke-[#2563eb] transition-[stroke-dasharray] duration-500 dark:stroke-blue-400"
                          [attr.stroke-linecap]="arco() > 0 ? 'round' : 'butt'"
                          [attr.stroke-dasharray]="arco() + ' ' + circunferencia"></circle>
                  <text x="54" y="60" text-anchor="middle" class="fill-[#0f172a] text-[19px] font-extrabold dark:fill-white">{{ porcentaje() }}%</text>
                </svg>
                <div class="flex min-w-0 flex-col gap-[3px]">
                  @if (conteo(); as c) {
                    <span class="text-4xl font-extrabold leading-none tracking-[-0.02em] tabular-nums">{{ miles(c.clientes) }}</span>
                  } @else {
                    <span class="text-4xl font-extrabold leading-none text-[#8491a3]">—</span>
                  }
                  <span class="text-[13.5px] font-semibold">clientes en esta lista</span>
                  <span class="text-[12.5px] tabular-nums text-[#5f6c80] dark:text-slate-400">de {{ miles(vars.clientesEnCartera) }} en la cartera {{ nombreSubcartera() }}</span>
                </div>
              </div>
              <div class="flex items-center justify-between gap-2.5 border-t border-[#eef1f5] pt-3 dark:border-slate-800">
                <span class="text-xs text-[#5f6c80] dark:text-slate-400">{{ pendiente() ? 'Hay cambios sin recalcular' : 'Calculado con la carga vigente' }}</span>
                <button type="button" (click)="recalcular()" [disabled]="calculando() || !plantilla.trim()"
                        class="inline-flex h-7 items-center gap-1.5 rounded-[7px] border px-[11px] text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        [ngClass]="pendiente() ? 'border-[#2563eb] bg-[#2563eb] text-white hover:bg-[#1d4ed8]' : 'border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800'">
                  <span class="inline-flex" [class.animate-spin]="calculando()">
                    <lucide-angular [name]="calculando() ? 'loader-2' : 'refresh-cw'" [size]="12" class="block"></lucide-angular>
                  </span>
                  Recalcular
                </button>
              </div>
            </section>

            <section [class]="estilos.tarjeta + ' flex-1'">
              <div class="flex items-center justify-between gap-3">
                <h2 class="!m-0 text-[15px] font-bold">Previsualización</h2>
                @if (totalPreview() > 0) {
                  <div class="flex items-center gap-1.5">
                    <button type="button" (click)="verMensaje(-1)" [disabled]="indicePreview() === 0" aria-label="Mensaje anterior"
                            class="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-40 dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800">
                      <lucide-angular name="chevron-left" [size]="12" class="block"></lucide-angular>
                    </button>
                    <span class="text-[12.5px] tabular-nums text-[#334155] dark:text-slate-300">{{ miles(indicePreview() + 1) }} de {{ miles(totalPreview()) }}</span>
                    <button type="button" (click)="verMensaje(1)" [disabled]="indicePreview() >= totalPreview() - 1" aria-label="Mensaje siguiente"
                            class="flex h-[26px] w-[26px] items-center justify-center rounded-[7px] border border-[#8491a3] bg-white text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:opacity-40 dark:border-slate-600 dark:bg-transparent dark:text-slate-200 dark:hover:bg-slate-800">
                      <lucide-angular name="chevron-right" [size]="12" class="block"></lucide-angular>
                    </button>
                  </div>
                }
              </div>
              <div class="flex flex-1 flex-col rounded-[22px] border-[6px] border-[#1e293b] bg-[#0f172a] p-2 shadow-[0_12px_30px_rgba(15,23,42,0.22)] dark:border-slate-700">
                <div class="flex min-h-[176px] flex-1 flex-col gap-3 rounded-[16px] bg-[#f4f6f9] px-3 pb-4 pt-3 dark:bg-slate-800">
                  <div class="flex items-center justify-between text-[11px] text-[#5f6c80] dark:text-slate-400">
                    <span class="font-semibold">SMS · {{ nombreCartera() }}</span>
                    <span class="tabular-nums">{{ ahora | date: 'HH:mm' }}</span>
                  </div>
                  @if (mensaje(); as m) {
                    @for (actual of [m]; track actual.telefono + actual.texto) {
                      <div class="aparecer flex flex-col gap-1.5">
                        <div class="flex items-center gap-2">
                          <span class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-[#dbe4f0] text-xs font-bold text-[#334155] dark:bg-slate-600 dark:text-slate-100">{{ iniciales(actual.nombre) }}</span>
                          <span class="text-[13px] font-semibold">{{ actual.nombre || 'Cliente' }}</span>
                          <span class="text-xs tabular-nums text-[#5f6c80] dark:text-slate-400">{{ actual.telefono }}</span>
                        </div>
                        <p class="rounded-xl rounded-bl-[3px] border border-[#e6e9ee] bg-white px-3 py-[11px] text-[13px] leading-[1.55] tabular-nums dark:border-slate-700 dark:bg-slate-900">{{ actual.texto }}</p>
                        <span class="text-[11px] tabular-nums" [ngClass]="actual.caracteres > limite() ? 'font-semibold text-[#b91c1c] dark:text-red-400' : 'text-[#5f6c80] dark:text-slate-400'">
                          {{ actual.caracteres }} / {{ limite() }} caracteres{{ actual.caracteres > limite() ? ' · pasa del límite, el archivo no se generará' : '' }}
                        </span>
                      </div>
                    }
                  } @else {
                    <p class="my-auto px-2 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">{{ textoSinMensaje() }}</p>
                  }
                </div>
              </div>
            </section>
          </div>

            <section [class]="estilos.tarjeta + ' lg:col-span-2'">
              <h2 class="!m-0 text-[15px] font-bold">Filtros</h2>
              <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div role="group" aria-labelledby="tenor-rangos" class="flex flex-col gap-[9px]">
                  <span id="tenor-rangos" [class]="estilos.etiqueta">Rangos</span>
                  @for (r of rangos; track $index; let i = $index) {
                    <div class="flex h-[38px] items-center gap-2 rounded-lg border border-[#8491a3] bg-white px-1.5 focus-within:border-[#2563eb] focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.2)] dark:border-slate-600 dark:bg-slate-800">
                      <select [ngModel]="r.columna" (ngModelChange)="r.columna = $event; marcarCambio()" aria-label="Monto del rango"
                              class="h-8 min-w-0 max-w-[46%] shrink truncate rounded-md border-0 !bg-transparent px-1 text-[13px] font-semibold !text-[#0f172a] focus:outline-none focus:!shadow-none dark:!text-slate-100">
                        @for (m of vars.montos; track m.token) {
                          <option [ngValue]="m.columna">{{ m.etiqueta }}</option>
                        }
                        @for (c of combinadas; track c.token) {
                          <option [ngValue]="c.token">{{ c.etiqueta }} (combinado)</option>
                        }
                      </select>
                      <span class="h-[15px] w-px shrink-0 bg-[#dfe4ea] dark:bg-slate-600"></span>
                      <input type="number" [ngModel]="r.min" (ngModelChange)="r.min = $event; marcarCambio()" placeholder="mín." aria-label="Mínimo del rango" [class]="estilos.numeroRango" />
                      <span class="text-[13px] text-[#5f6c80] dark:text-slate-400">–</span>
                      <input type="number" [ngModel]="r.max" (ngModelChange)="r.max = $event; marcarCambio()" placeholder="máx." aria-label="Máximo del rango" [class]="estilos.numeroRango" />
                      <button type="button" (click)="quitarRango(i)" aria-label="Quitar rango"
                              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[#5f6c80] hover:bg-[#f4f6f9] hover:text-[#b91c1c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:text-slate-400 dark:hover:bg-slate-700">
                        <lucide-angular name="x" [size]="14" class="block"></lucide-angular>
                      </button>
                    </div>
                  }
                  @if (vars.montos.length) {
                    <button type="button" (click)="agregarRango()"
                            class="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#8491a3] px-3 text-[12.5px] font-medium text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800">
                      <lucide-angular name="plus" [size]="12" class="block"></lucide-angular>
                      Añadir rango
                    </button>
                  } @else {
                    <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Los rangos se arman sobre los montos, y esta subcartera no tiene ninguno visible.</p>
                  }
                </div>

                <div role="group" aria-labelledby="tenor-restricciones" class="flex flex-col gap-[9px]">
                  <span id="tenor-restricciones" [class]="estilos.etiqueta">Restricciones</span>
                  <label class="relative flex cursor-pointer items-start gap-[9px] text-[13px]">
                    <input type="checkbox" class="peer sr-only" [ngModel]="sinPromesaVigente" (ngModelChange)="sinPromesaVigente = $event; marcarCambio()" />
                    <span [class]="estilos.casilla"><lucide-angular name="check" [size]="11" [strokeWidth]="3.4" class="block"></lucide-angular></span>
                    <span>Sin promesa vigente <span class="text-[#5f6c80] dark:text-slate-400">(pendiente, parcial o vencida hace menos de 2 días)</span></span>
                  </label>
                  <label class="relative flex cursor-pointer items-start gap-[9px] text-[13px]">
                    <input type="checkbox" class="peer sr-only" [ngModel]="sinListaNegra" (ngModelChange)="sinListaNegra = $event; marcarCambio()" />
                    <span [class]="estilos.casilla"><lucide-angular name="check" [size]="11" [strokeWidth]="3.4" class="block"></lucide-angular></span>
                    <span>Sin lista negra</span>
                  </label>
                  @if (vars.admiteSoloNoContenido) {
                    <label class="relative flex cursor-pointer items-start gap-[9px] text-[13px]">
                      <input type="checkbox" class="peer sr-only" [ngModel]="soloNoContenido" (ngModelChange)="soloNoContenido = $event; marcarCambio()" />
                      <span [class]="estilos.casilla"><lucide-angular name="check" [size]="11" [strokeWidth]="3.4" class="block"></lucide-angular></span>
                      <span>Solo clientes NO CONTENIDO</span>
                    </label>
                  } @else {
                    <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Esta subcartera no recibe contención.</p>
                  }
                </div>
              </div>
            </section>

          <div class="flex flex-wrap items-center justify-end gap-2 lg:col-span-2">
            <a routerLink="/sms/combos"
               class="btn flex h-10 items-center justify-center rounded-[10px] px-4 text-[13.5px] font-semibold text-[#334155] transition-colors hover:bg-[#eef1f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:text-slate-300 dark:hover:bg-slate-800">
              Cancelar
            </a>
            <button type="button" (click)="generarArchivo()" [disabled]="!editando() || descargando()"
                    [attr.title]="editando() ? null : 'Guarda el tenor para poder generar el archivo'"
                    class="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-[#8491a3] bg-white px-4 text-[13.5px] font-semibold text-[#0f172a] transition-colors hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-transparent dark:text-slate-100 dark:hover:bg-slate-800">
              <span class="inline-flex" [class.animate-spin]="descargando()">
                <lucide-angular [name]="descargando() ? 'loader-2' : 'download'" [size]="15" class="block"></lucide-angular>
              </span>
              Generar archivo
            </button>
            <button type="button" (click)="guardar()" [disabled]="guardando()"
                    class="flex h-10 items-center justify-center gap-[9px] rounded-[10px] bg-[#0f172a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1e293b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
              <span class="inline-flex" [class.animate-spin]="guardando()">
                <lucide-angular [name]="guardando() ? 'loader-2' : 'save'" [size]="15" class="block"></lucide-angular>
              </span>
              {{ editando() ? 'Guardar cambios' : 'Guardar tenor' }}
            </button>
          </div>
        </main>
      } @else if (cargandoVariables()) {
        <main class="px-7 py-10">
          <p class="flex items-center justify-center gap-2 text-[13px] text-[#5f6c80] dark:text-slate-400">
            <span class="inline-flex animate-spin"><lucide-angular name="loader-2" [size]="16" class="block"></lucide-angular></span>
            Cargando las variables de la subcartera…
          </p>
        </main>
      } @else if (errorVariables()) {
        <main class="px-7 py-10">
          <div class="mx-auto flex max-w-lg flex-col items-center gap-1.5 rounded-xl border border-[#f3dcb4] bg-[#fffdf7] px-6 py-8 text-center dark:border-amber-900 dark:bg-amber-950/20">
            <p class="text-[14.5px] font-bold text-[#b45309] dark:text-amber-300">No se pudieron cargar las variables</p>
            <p class="text-[13px] text-[#5f6c80] dark:text-slate-400">{{ errorVariables() }}</p>
            <button type="button" (click)="reintentarVariables()"
                    class="mt-1.5 inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#8491a3] bg-white px-3 text-[12.5px] font-semibold text-[#334155] hover:bg-[#f4f6f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] dark:border-slate-600 dark:bg-transparent dark:text-slate-200">
              <lucide-angular name="refresh-cw" [size]="12" class="block"></lucide-angular>
              Reintentar
            </button>
          </div>
        </main>
      } @else {
        <main class="px-7 py-10">
          <div class="mx-auto flex max-w-lg flex-col items-center gap-1.5 rounded-xl border border-dashed border-[#8491a3] bg-white px-6 py-10 text-center dark:border-slate-600 dark:bg-slate-900">
            <p class="text-[14.5px] font-bold">Elige cliente, cartera y subcartera</p>
            <p class="text-[13px] text-[#5f6c80] dark:text-slate-400">De la subcartera salen las variables, los rangos y las restricciones que puede usar el tenor.</p>
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

  readonly estilos = ESTILOS;
  readonly miles = miles;
  readonly ahora = new Date();
  readonly circunferencia = CIRCUNFERENCIA;
  readonly indicesSegmento = Array.from({ length: SEGMENTOS }, (_, i) => i);

  readonly idTenor = signal<number | null>(null);
  readonly editando = computed(() => this.idTenor() !== null);
  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);
  readonly variables = signal<VariablesSubcartera | null>(null);
  readonly cargandoVariables = signal(false);
  readonly errorVariables = signal<string | null>(null);
  readonly conteo = signal<ConteoTenor | null>(null);
  readonly mensaje = signal<MensajeTenor | null>(null);
  readonly totalPreview = signal(0);
  readonly indicePreview = signal(0);
  readonly calculando = signal(false);
  readonly guardando = signal(false);
  readonly descargando = signal(false);
  /** Hay cambios que afectan a la lista y todavía no se recalcularon. */
  readonly pendiente = signal(false);
  /** Monto combinado que se está creando o editando; nulo si el constructor está cerrado. */
  readonly combinadaEnEdicion = signal<CombinadaEnEdicion | null>(null);
  readonly tokenDe = tokenDe;

  combinadas: CombinadaTenor[] = [];

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

  reintentarVariables(): void {
    if (this.idSubcartera > 0) {
      this.cargarVariables();
    }
  }

  usada(v: VariableTenor): boolean {
    return this.plantilla.includes(`{${v.token}}`);
  }

  claseChip(v: VariableTenor): string {
    return this.usada(v) ? ESTILOS.chipUsado : ESTILOS.chip;
  }

  /**
   * Inserta la variable donde está el cursor del editor. Si ya está en el
   * mensaje, la quita (con el espacio que la precede) en vez de repetirla.
   */
  insertar(v: VariableTenor): void {
    const token = `{${v.token}}`;
    const editor = this.editor?.nativeElement;
    if (this.usada(v)) {
      const escapado = token.replace(/[{}]/g, '\\$&');
      this.plantilla = this.plantilla.replace(new RegExp(' ?' + escapado, 'g'), '');
      this.marcarCambio();
      setTimeout(() => this.ajustarAltura());
      return;
    }
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
      setTimeout(() => this.ajustarAltura());
    }
  }

  usadaCombinada(c: CombinadaTenor): boolean {
    return this.plantilla.includes(`{${c.token}}`);
  }

  /** Inserta o quita la combinada del mensaje, igual que una variable normal. */
  insertarCombinada(c: CombinadaTenor): void {
    this.insertar({ token: c.token, columna: null, etiqueta: c.etiqueta, filtra: true });
  }

  nuevaCombinada(): void {
    this.combinadaEnEdicion.set({ indice: null, etiqueta: '', columnas: [], minimo: null });
  }

  editarCombinada(indice: number): void {
    const c = this.combinadas[indice];
    this.combinadaEnEdicion.set({ indice, etiqueta: c.etiqueta, columnas: [...c.columnas], minimo: c.minimo ?? null });
  }

  alternarEnCombinada(columna: string): void {
    this.combinadaEnEdicion.update(e => {
      if (!e) {
        return e;
      }
      const columnas = e.columnas.includes(columna) ? e.columnas.filter(c => c !== columna) : [...e.columnas, columna];
      return { ...e, columnas };
    });
  }

  moverEnCombinada(indice: number, paso: number): void {
    this.combinadaEnEdicion.update(e => {
      if (!e) {
        return e;
      }
      const destino = indice + paso;
      if (destino < 0 || destino >= e.columnas.length) {
        return e;
      }
      const columnas = [...e.columnas];
      [columnas[indice], columnas[destino]] = [columnas[destino], columnas[indice]];
      return { ...e, columnas };
    });
  }

  etiquetaDeMonto(columna: string): string {
    return this.variables()?.montos.find(m => m.columna === columna)?.etiqueta ?? columna;
  }

  /** Qué le toca a cada cliente con la regla del constructor, en una frase. */
  reglaEnEdicion(e: CombinadaEnEdicion): string {
    const minimo = numeroONulo(e.minimo);
    const condicion = minimo !== null && minimo > 0 ? `que llegue a S/${miles(minimo)}` : 'que tenga monto';
    return `A cada cliente le va el primer monto de la lista ${condicion}. Quien no tenga ninguno no entra en la lista.`;
  }

  /** Regla de una combinada en una línea, para el título de su chip. */
  resumenCombinada(c: CombinadaTenor): string {
    const montos = (c.nombres?.length ? c.nombres : c.columnas).join(' → ');
    return c.minimo ? `${montos} · mínimo S/${miles(c.minimo)}` : montos;
  }

  /** Guarda la combinada del constructor; si es nueva, además la inserta en el mensaje. */
  guardarCombinada(): void {
    const e = this.combinadaEnEdicion();
    if (!e) {
      return;
    }
    const etiqueta = e.etiqueta.trim();
    const token = tokenDe(etiqueta);
    const vars = this.variables();
    const tokensCatalogo = [...(vars?.cliente ?? []), ...(vars?.montos ?? []), ...(vars?.fechas ?? [])].map(v => v.token);
    const repetido = tokensCatalogo.includes(token) || this.combinadas.some((c, i) => i !== e.indice && c.token === token);
    if (!token || repetido) {
      this.toast.warning('Ese nombre ya lo usa otra variable; elige otro.');
      return;
    }
    const nombres = e.columnas.map(c => this.etiquetaDeMonto(c));
    const minimo = numeroONulo(e.minimo);
    const combinada: CombinadaTenor = {
      token,
      etiqueta,
      columnas: [...e.columnas],
      minimo: minimo !== null && minimo > 0 ? minimo : null,
      nombres
    };
    if (e.indice === null) {
      this.combinadas = [...this.combinadas, combinada];
      this.combinadaEnEdicion.set(null);
      this.insertarCombinada(combinada);
      return;
    }
    const anterior = this.combinadas[e.indice];
    if (anterior.token !== token) {
      this.plantilla = this.plantilla.split(`{${anterior.token}}`).join(`{${token}}`);
      this.rangos = this.rangos.map(r => (r.columna === anterior.token ? { ...r, columna: token } : r));
    }
    this.combinadas = this.combinadas.map((c, i) => (i === e.indice ? combinada : c));
    this.combinadaEnEdicion.set(null);
    this.marcarCambio();
  }

  /** Quita la combinada del tenor, del mensaje y de los rangos que la usaban. */
  quitarCombinada(indice: number): void {
    const c = this.combinadas[indice];
    this.plantilla = this.plantilla.replace(new RegExp(' ?' + `{${c.token}}`.replace(/[{}]/g, '\\$&'), 'g'), '');
    this.rangos = this.rangos.filter(r => r.columna !== c.token);
    this.combinadas = this.combinadas.filter((_, i) => i !== indice);
    this.marcarCambio();
    setTimeout(() => this.ajustarAltura());
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

  /** El textarea crece con el texto: así la copia que pinta las variables queda alineada. */
  ajustarAltura(): void {
    const editor = this.editor?.nativeElement;
    if (!editor) {
      return;
    }
    editor.style.height = 'auto';
    editor.style.height = `${editor.scrollHeight}px`;
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

  /** Estado del guardado que acompaña al título. */
  estado(): string {
    if (!this.editando()) {
      return 'Borrador · sin guardar';
    }
    return this.sinGuardar ? 'Cambios sin guardar' : '';
  }

  caracteres(): number {
    return this.mensaje()?.caracteres ?? this.plantilla.length;
  }

  /** Límite de un SMS, la misma regla que aplicaba el módulo anterior. */
  limite(): number {
    return 160;
  }

  excede(): boolean {
    return this.caracteres() > this.limite();
  }

  resumenSms(): string {
    const m = this.mensaje();
    return m ? `${m.segmentos} SMS` : 'plantilla';
  }

  /** Porcentaje lleno de un segmento del medidor, de 0 a 100. */
  rellenoSegmento(indice: number): number {
    const tramo = this.limite() / SEGMENTOS;
    return Math.max(0, Math.min(1, (this.caracteres() - indice * tramo) / tramo)) * 100;
  }

  nombreSubcartera(): string {
    return this.subcarteras().find(s => s.id === this.idSubcartera)?.subPortfolioName ?? '';
  }

  nombreCartera(): string {
    return this.carteras().find(c => c.id === this.idCartera)?.portfolioName ?? 'Cashi';
  }

  iniciales(nombre: string): string {
    const palabras = (nombre || '').trim().split(/\s+/).filter(Boolean);
    if (!palabras.length) {
      return '?';
    }
    return (palabras[0].charAt(0) + (palabras[1]?.charAt(0) ?? '')).toUpperCase();
  }

  partesPlantilla(): ParteMensaje[] {
    return partesDelMensaje(this.plantilla);
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
        this.combinadas = (tenor.combinadas ?? []).map(c => ({ ...c, columnas: [...c.columnas] }));
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
    this.cargandoVariables.set(true);
    this.errorVariables.set(null);
    this.api.variables(this.idInquilino, this.idCartera, this.idSubcartera).subscribe({
      next: vars => {
        this.variables.set(vars);
        this.cargandoVariables.set(false);
        if (!vars.admiteSoloNoContenido) {
          this.soloNoContenido = false;
        }
        setTimeout(() => this.ajustarAltura());
        this.recalcular();
      },
      error: err => {
        this.cargandoVariables.set(false);
        this.errorVariables.set(mensajeDeError(err, 'Revisa la conexión e inténtalo de nuevo.'));
      }
    });
  }

  private limpiarSubcartera(): void {
    this.variables.set(null);
    this.cargandoVariables.set(false);
    this.errorVariables.set(null);
    this.conteo.set(null);
    this.mensaje.set(null);
    this.totalPreview.set(0);
    this.indicePreview.set(0);
    this.pendiente.set(false);
    this.rangos = [];
    this.combinadas = [];
    this.combinadaEnEdicion.set(null);
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
      combinadas: this.combinadas.map(c => ({
        token: c.token,
        etiqueta: c.etiqueta,
        columnas: [...c.columnas],
        minimo: c.minimo ?? null
      })),
      restricciones: {
        sinPromesaVigente: this.sinPromesaVigente,
        sinListaNegra: this.sinListaNegra,
        soloNoContenido: this.soloNoContenido
      }
    };
  }
}

/** Un input numérico vacío llega como null o cadena vacía: ambos significan "sin límite". */
/** Estado del constructor de montos combinados. */
interface CombinadaEnEdicion {
  /** Posición en la lista del tenor; nula si es nueva. */
  indice: number | null;
  etiqueta: string;
  columnas: string[];
  /** Tal como lo deja el campo: vacío o un número. */
  minimo: number | string | null;
}

function numeroONulo(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') {
    return null;
  }
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
}

/** Separa la plantilla en texto y variables para pintar estas últimas. */
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
