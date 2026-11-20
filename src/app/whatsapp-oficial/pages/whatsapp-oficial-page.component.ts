import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WhatsappOficialService } from '../services/whatsapp-oficial.service';
import { UserInfoService } from '../../whatsapp/services/user-info.service';
import {
  WaoBaja, WaoEstado, WaoMensaje, WaoPlantilla, WaoRemitente, WaoResumen
} from '../models/whatsapp-oficial.models';

type Pestana = 'plantillas' | 'resumen' | 'bajas';

@Component({
  selector: 'app-whatsapp-oficial-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <main class="h-screen min-h-0 overflow-hidden bg-slate-100 text-slate-950">
      <section class="grid h-full min-h-0 grid-cols-1 sm:grid-cols-[minmax(300px,30%)_minmax(0,1fr)] lg:grid-cols-[minmax(280px,22%)_minmax(0,1fr)_minmax(300px,26%)]">

        <aside class="flex h-full min-h-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
          <header class="border-b border-slate-200 p-3">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">WhatsApp oficial</p>
                @if (estado(); as e) {
                  <p class="mt-0.5 text-[11px] text-slate-500">
                    <span class="mr-1 inline-block size-2 rounded-full" [class.bg-emerald-500]="e.habilitado" [class.bg-rose-500]="!e.habilitado"></span>
                    {{ e.habilitado ? 'Conectado a Meta' : 'Deshabilitado' }}
                  </p>
                }
              </div>
              <button type="button"
                class="grid size-9 shrink-0 place-items-center rounded-full border border-slate-300 text-slate-600 transition hover:border-emerald-500 hover:text-emerald-700"
                title="Actualizar" aria-label="Actualizar" (click)="refrescar()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.animate-spin]="cargando()"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>
              </button>
            </div>
            <label class="mt-3 block">
              <span class="sr-only">Buscar chat</span>
              <input class="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                type="search" placeholder="Buscar chat" [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event)" />
            </label>
            <form class="mt-2 flex gap-2" (ngSubmit)="abrirNuevo()">
              <input class="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 outline-none placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                name="nuevo" placeholder="Nuevo chat: número con 51 o ID de Meta" [ngModel]="nuevoContacto()" (ngModelChange)="nuevoContacto.set($event)" />
              <button type="submit" class="shrink-0 rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 disabled:bg-slate-300" [disabled]="!nuevoContacto().trim()">Abrir</button>
            </form>
          </header>

          <section class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            @if (!chatsFiltrados().length) {
              <div class="flex h-full flex-col items-center justify-center px-8 text-center text-slate-500">
                <div class="grid size-14 place-items-center rounded-full bg-slate-100 text-2xl">#</div>
                <p class="mt-4 font-semibold text-slate-900">Sin conversaciones</p>
                <p class="mt-2 text-sm">Cuando un cliente escriba al número oficial, aparecerá aquí.</p>
              </div>
            } @else {
              @for (chat of chatsFiltrados(); track clave(chat)) {
                <button type="button"
                  class="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-3 text-left transition hover:bg-slate-50"
                  [class.bg-emerald-50]="clave(chat) === seleccion()"
                  (click)="seleccionar(clave(chat))">
                  <div class="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">{{ iniciales(chat) }}</div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-2">
                      <p class="truncate text-sm font-semibold text-slate-950">{{ titulo(chat) }}</p>
                      <time class="shrink-0 text-xs font-medium text-slate-500">{{ chat.fechaCreacion | date: 'dd/MM HH:mm' }}</time>
                    </div>
                    <p class="mt-1 truncate text-sm text-slate-600">
                      @if (chat.direccion === 'SALIENTE') { <span class="font-medium text-emerald-700">Tú: </span> }
                      {{ vistaPrevia(chat) }}
                    </p>
                  </div>
                </button>
              }
            }
          </section>
        </aside>

        <section class="hidden h-full min-h-0 flex-col overflow-hidden bg-white sm:flex">
          @if (seleccion(); as sel) {
            <header class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <div class="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">{{ inicialesClave() }}</div>
              <div class="min-w-0 flex-1">
                <h2 class="truncate text-base font-semibold text-slate-950">{{ tituloSeleccion() }}</h2>
                <p class="truncate text-xs text-slate-500">{{ subtituloSeleccion() }}</p>
              </div>
              @if (enBaja()) {
                <span class="rounded-md bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">No quiere mensajes</span>
              }
            </header>

            <div #panel class="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-5 py-4">
              @if (!mensajes().length) {
                <div class="flex h-full flex-col items-center justify-center text-center text-slate-500">
                  <p class="font-semibold text-slate-900">Sin mensajes</p>
                  <p class="mt-1 text-sm">Todavía no hay historial para esta conversación.</p>
                </div>
              } @else {
                <div class="space-y-1.5">
                  @for (m of mensajes(); track m.id) {
                    <article class="flex" [class.justify-end]="m.direccion === 'SALIENTE'" [class.justify-start]="m.direccion === 'ENTRANTE'">
                      <div class="max-w-[75%] rounded-lg px-3 py-2 text-sm shadow-sm"
                        [class.bg-emerald-100]="m.direccion === 'SALIENTE'" [class.bg-white]="m.direccion === 'ENTRANTE'">
                        @if (m.plantilla) { <p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Plantilla · {{ m.plantilla }}</p> }
                        @if (m.mediaId) {
                          @if (esImagen(m) && archivos()[m.id]) {
                            <img [src]="archivos()[m.id]" alt="Imagen recibida" class="mb-1 max-h-72 max-w-full cursor-zoom-in rounded-md" (click)="imagenAmpliada.set(archivos()[m.id])" />
                          } @else if (esImagen(m)) {
                            <p class="text-xs text-slate-500">Cargando imagen...</p>
                          } @else if (archivos()[m.id]) {
                            <a [href]="archivos()[m.id]" target="_blank" class="mb-1 block text-xs font-semibold text-emerald-700 underline">Abrir {{ m.tipo.toLowerCase() }}</a>
                          } @else {
                            <p class="text-xs text-slate-500">Cargando {{ m.tipo.toLowerCase() }}...</p>
                          }
                        }
                        @if (m.contenido || !m.mediaId) {
                          <p class="whitespace-pre-wrap break-words text-slate-900">{{ m.contenido || ('[' + m.tipo.toLowerCase() + ']') }}</p>
                        }
                        <p class="mt-1 flex items-center justify-end gap-1 text-[11px] text-slate-500">
                          @if (m.usuario) { <span>{{ m.usuario }} ·</span> }
                          <span>{{ m.fechaCreacion | date: 'HH:mm' }}</span>
                          <button type="button" class="rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700" title="Detalle del mensaje" aria-label="Detalle del mensaje" (click)="abrirDetalle(m)">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
                          </button>
                          @if (m.direccion === 'SALIENTE') {
                            <span [class.text-sky-600]="m.estado === 'LEIDO'" [class.text-rose-600]="m.estado === 'FALLIDO'" [title]="m.detalleError || m.estado">{{ marca(m) }}</span>
                          }
                        </p>
                        @if (m.estado === 'FALLIDO' && m.detalleError) { <p class="mt-1 text-[11px] text-rose-600">{{ m.detalleError }}</p> }
                      </div>
                    </article>
                  }
                </div>
              }
            </div>

            <footer class="space-y-2 border-t border-slate-200 p-3">
              @if (error()) {
                <p class="rounded-md bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 ring-1 ring-rose-200">{{ error() }}</p>
              }
              <div class="flex items-center justify-between gap-2 text-xs">
                @if (ventanaAbierta()) {
                  <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                    Ventana 24 h · {{ ventanaRestante() }}
                  </span>
                } @else {
                  <span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800 ring-1 ring-amber-200">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>
                    Ventana 24 h cerrada · solo plantillas
                  </span>
                }
              </div>
              <form class="flex items-end gap-2" (ngSubmit)="enviarTexto()">
                <textarea class="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm leading-tight text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100 disabled:text-slate-500"
                  rows="1" name="texto"
                  [placeholder]="ventanaAbierta() ? 'Escribe un mensaje' : 'Ventana cerrada: usa una plantilla'"
                  [disabled]="!ventanaAbierta() || enBaja() || enviando()"
                  [ngModel]="texto()" (ngModelChange)="texto.set($event)"
                  (keydown.enter)="alEnter($event)"></textarea>
                <button type="submit"
                  class="h-11 shrink-0 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                  [disabled]="!texto().trim() || !ventanaAbierta() || enBaja() || enviando()">
                  {{ enviando() ? 'Enviando' : 'Enviar' }}
                </button>
              </form>
            </footer>
          } @else {
            <div class="flex h-full flex-col items-center justify-center px-8 text-center text-slate-500">
              <div class="grid size-16 place-items-center rounded-full bg-emerald-50 text-3xl text-emerald-600">✉</div>
              <p class="mt-4 text-lg font-semibold text-slate-900">WhatsApp oficial de Meta</p>
              <p class="mt-2 max-w-sm text-sm">Elige una conversación de la lista o abre una nueva con el número del cliente.</p>
            </div>
          }
        </section>

        <aside class="hidden h-full min-h-0 flex-col overflow-hidden border-l border-slate-200 bg-white lg:flex">
          <header class="border-b border-slate-200 px-3 pt-3">
            <h3 class="px-1 text-sm font-semibold text-slate-900">Información y herramientas</h3>
            <nav class="mt-2 flex gap-1">
              @for (p of pestanas; track p.id) {
                <button type="button" class="rounded-t-lg px-3 py-2 text-xs font-semibold transition"
                  [class.bg-emerald-50]="pestana() === p.id" [class.text-emerald-700]="pestana() === p.id"
                  [class.text-slate-500]="pestana() !== p.id" (click)="cambiarPestana(p.id)">{{ p.etiqueta }}</button>
              }
            </nav>
          </header>

          <div class="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            @if (pestana() === 'plantillas') {
              @if (!seleccion()) {
                <p class="text-sm text-slate-500">Elige una conversación para enviar una plantilla.</p>
              } @else if (errorPlantillas()) {
                <p class="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200">{{ errorPlantillas() }}</p>
              } @else {
                <label class="block">
                  <span class="text-xs font-semibold text-slate-600">Plantilla aprobada</span>
                  <select class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                    [ngModel]="plantillaElegida()" (ngModelChange)="elegirPlantilla($event)">
                    <option [ngValue]="null">Selecciona una plantilla</option>
                    @for (p of plantillasAprobadas(); track p.name + p.language) {
                      <option [ngValue]="p.name + '|' + p.language">{{ p.name }} · {{ p.language }} · {{ p.category }}</option>
                    }
                  </select>
                </label>
                @if (plantillaActual(); as pl) {
                  <div class="rounded-lg bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">
                    <p class="whitespace-pre-wrap">{{ cuerpoPlantilla(pl) }}</p>
                  </div>
                  @for (v of variables(); track v; let i = $index) {
                    <label class="block">
                      <span class="text-xs font-semibold text-slate-600">Variable {{ '{{' + v + '}}' }}</span>
                      <input class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        [ngModel]="parametros()[i]" (ngModelChange)="fijarParametro(i, $event)" [name]="'var' + v" />
                    </label>
                  }
                  <button type="button"
                    class="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
                    [disabled]="enviando() || enBaja() || faltanParametros()" (click)="enviarPlantilla()">
                    {{ enviando() ? 'Enviando' : 'Enviar plantilla' }}
                  </button>
                }
              }
            }

            @if (pestana() === 'resumen') {
              @if (resumen(); as r) {
                <div class="rounded-xl p-4 ring-1" [class.bg-amber-50]="cercaDelTope()" [class.ring-amber-200]="cercaDelTope()" [class.bg-slate-50]="!cercaDelTope()" [class.ring-slate-200]="!cercaDelTope()">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mensajes enviados este mes</p>
                  <p class="mt-1 text-3xl font-bold text-slate-900">{{ r.enviadosMes }} <span class="text-base font-medium text-slate-500">/ {{ r.topeGratisMes }}</span></p>
                  <div class="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full rounded-full" [class.bg-emerald-500]="!cercaDelTope()" [class.bg-amber-500]="cercaDelTope()" [style.width.%]="porcentajeTope()"></div>
                  </div>
                  @if (cercaDelTope()) {
                    <p class="mt-2 text-xs font-medium text-amber-800">Cerca del tope de mensajes de servicio sin costo. Pasado el tope, Meta cobra cada mensaje.</p>
                  }
                  <p class="mt-2 text-xs text-slate-500">Recibidos este mes: {{ r.recibidosMes }}</p>
                </div>
              }
              @if (estado(); as e) {
                <div class="space-y-1 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 ring-1 ring-slate-200">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Conexión con Meta</p>
                  <p>Versión de la API: {{ e.version }}</p>
                  <p>ID del número: {{ e.phoneNumberId }}</p>
                  <p>ID de la cuenta: {{ e.wabaId }}</p>
                  <p>Token: {{ e.tokenConfigurado ? 'configurado' : 'falta' }} · Firma: {{ e.appSecretConfigurado ? 'configurada' : 'falta' }}</p>
                </div>
              }
              @if (seleccion()) {
                <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cliente</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900">{{ tituloSeleccion() }}</p>
                  <p class="text-xs text-slate-500">{{ subtituloSeleccion() }}</p>
                  <button type="button"
                    class="mt-3 w-full rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                    [disabled]="enBaja()" (click)="darDeBajaSeleccion()">
                    {{ enBaja() ? 'Ya no recibe mensajes' : 'Registrar que no quiere mensajes' }}
                  </button>
                </div>
              }
            }

            @if (pestana() === 'bajas') {
              @if (!bajas().length) {
                <p class="text-sm text-slate-500">Nadie ha pedido dejar de recibir mensajes.</p>
              } @else {
                @for (b of bajas(); track b.id) {
                  <div class="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-semibold text-slate-900">{{ b.waId }}</p>
                      <p class="truncate text-xs text-slate-500">{{ b.origen }} · {{ b.fechaCreacion | date: 'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                    <button type="button" class="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50" (click)="quitarBaja(b.waId)">Quitar</button>
                  </div>
                }
              }
            }
          </div>
        </aside>
      </section>
      @if (detalle(); as d) {
        <div class="fixed inset-0 z-[9999] flex justify-end bg-slate-950/50" (click)="cerrarDetalle()">
          <aside class="flex h-full w-full max-w-sm flex-col bg-white shadow-2xl" (click)="$event.stopPropagation()">
            <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h3 class="text-sm font-semibold text-slate-950">Detalle del mensaje</h3>
              <button type="button" class="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Cerrar" (click)="cerrarDetalle()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </header>
            <div class="flex-1 overflow-y-auto px-5 py-4">
              @if (d.direccion === 'SALIENTE') {
                <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Enviado por</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">{{ remitente()?.nombre || d.usuario || 'Sistema' }}</p>
                @if (remitente()?.rol) { <p class="text-xs text-slate-500">{{ remitente()?.rol }}</p> }
                @if (remitente()?.cartera) { <p class="text-xs text-slate-500">Cartera: {{ remitente()?.cartera }}</p> }
              } @else {
                <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recibido de</p>
                <p class="mt-1 text-sm font-semibold text-slate-900">{{ d.nombre || d.userId || d.waId }}</p>
                @if (d.waId) { <p class="text-xs text-slate-500">+{{ d.waId }}</p> }
              }
              <p class="mt-2 text-xs text-slate-500">{{ d.fechaCreacion | date: 'd MMM y, HH:mm' }}</p>
              <hr class="my-4 border-slate-200" />
              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Estado</p>
              <p class="mt-1 text-sm text-slate-900">{{ d.estado }}</p>
              @if (d.detalleError) { <p class="mt-1 text-xs text-rose-600">{{ d.detalleError }}</p> }
            </div>
          </aside>
        </div>
      }
      @if (imagenAmpliada(); as src) {
        <div class="fixed inset-0 z-[9999] grid place-items-center bg-slate-950/80 p-6" (click)="imagenAmpliada.set(null)">
          <img [src]="src" alt="Imagen" class="max-h-full max-w-full rounded-md" />
        </div>
      }
    </main>
  `
})
export class WhatsappOficialPageComponent implements OnInit, OnDestroy {
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;

  readonly pestanas: { id: Pestana; etiqueta: string }[] = [
    { id: 'plantillas', etiqueta: 'Plantillas' },
    { id: 'resumen', etiqueta: 'Resumen' },
    { id: 'bajas', etiqueta: 'Bajas' }
  ];

  readonly estado = signal<WaoEstado | null>(null);
  readonly resumen = signal<WaoResumen | null>(null);
  readonly chats = signal<WaoMensaje[]>([]);
  readonly mensajes = signal<WaoMensaje[]>([]);
  readonly bajas = signal<WaoBaja[]>([]);
  readonly plantillas = signal<WaoPlantilla[]>([]);
  readonly seleccion = signal<string | null>(null);
  readonly busqueda = signal('');
  readonly nuevoContacto = signal('');
  readonly texto = signal('');
  readonly error = signal('');
  readonly errorPlantillas = signal('');
  readonly enviando = signal(false);
  readonly cargando = signal(false);
  readonly pestana = signal<Pestana>('plantillas');
  readonly archivos = signal<Record<number, string>>({});
  readonly imagenAmpliada = signal<string | null>(null);
  readonly detalle = signal<WaoMensaje | null>(null);
  readonly remitente = signal<WaoRemitente | null>(null);
  private readonly solicitados = new Set<number>();
  readonly plantillaElegida = signal<string | null>(null);
  readonly parametros = signal<string[]>([]);
  private readonly ahora = signal(Date.now());
  private temporizador?: ReturnType<typeof setInterval>;

  readonly chatsFiltrados = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const lista = this.chats();
    if (!q) return lista;
    return lista.filter(c =>
      [c.nombre, c.waId, c.userId, c.contenido].some(v => (v ?? '').toLowerCase().includes(q)));
  });

  readonly chatActual = computed(() => this.chats().find(c => this.clave(c) === this.seleccion()) ?? null);

  readonly ultimoEntrante = computed(() => {
    const entrantes = this.mensajes().filter(m => m.direccion === 'ENTRANTE');
    return entrantes.length ? entrantes[entrantes.length - 1] : null;
  });

  readonly ventanaAbierta = computed(() => {
    const m = this.ultimoEntrante();
    return !!m && this.ahora() - this.aMs(m.fechaCreacion) < this.horasVentana() * 3600000;
  });

  readonly ventanaRestante = computed(() => {
    const m = this.ultimoEntrante();
    if (!m) return '';
    const resto = this.horasVentana() * 3600000 - (this.ahora() - this.aMs(m.fechaCreacion));
    const minutos = Math.max(0, Math.floor(resto / 60000));
    return `quedan ${Math.floor(minutos / 60)} h ${minutos % 60} min`;
  });

  readonly enBaja = computed(() => {
    const c = this.chatActual();
    const claves = [this.seleccion(), c?.waId, c?.userId].filter((v): v is string => !!v);
    return this.bajas().some(b => claves.includes(b.waId));
  });

  readonly plantillasAprobadas = computed(() => this.plantillas().filter(p => p.status === 'APPROVED'));

  readonly plantillaActual = computed(() => {
    const clave = this.plantillaElegida();
    if (!clave) return null;
    return this.plantillasAprobadas().find(p => `${p.name}|${p.language}` === clave) ?? null;
  });

  readonly variables = computed(() => {
    const pl = this.plantillaActual();
    if (!pl) return [] as string[];
    const encontrados = this.cuerpoPlantilla(pl).match(/\{\{(\d+)\}\}/g) ?? [];
    return Array.from(new Set(encontrados.map(v => v.replace(/[{}]/g, '')))).sort((a, b) => Number(a) - Number(b));
  });

  readonly faltanParametros = computed(() =>
    this.variables().some((_, i) => !(this.parametros()[i] ?? '').trim()));

  readonly porcentajeTope = computed(() => {
    const r = this.resumen();
    return r && r.topeGratisMes ? Math.min(100, (r.enviadosMes / r.topeGratisMes) * 100) : 0;
  });

  readonly cercaDelTope = computed(() => this.porcentajeTope() >= 90);

  constructor(private readonly api: WhatsappOficialService, private readonly userInfo: UserInfoService) {}

  ngOnInit(): void {
    this.api.estado().subscribe({ next: e => this.estado.set(e), error: () => this.estado.set(null) });
    this.refrescar();
    this.cargarBajas();
    this.temporizador = setInterval(() => {
      this.ahora.set(Date.now());
      this.refrescar(true);
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearInterval(this.temporizador);
    Object.values(this.archivos()).forEach(u => URL.revokeObjectURL(u));
  }

  esImagen(m: WaoMensaje): boolean {
    return m.tipo === 'IMAGE' || m.tipo === 'STICKER';
  }

  abrirDetalle(m: WaoMensaje): void {
    this.detalle.set(m);
    this.remitente.set(null);
    if (m.direccion !== 'SALIENTE' || !m.usuario) return;
    this.api.usuario(m.usuario).subscribe({
      next: u => {
        this.remitente.set({ nombre: u.nombre, rol: u.rol ?? undefined });
        this.userInfo.getUserInfoView(u.id).subscribe({
          next: v => this.remitente.set({ nombre: u.nombre, rol: v.roles?.[0] ?? u.rol ?? undefined, cartera: v.asignaciones?.[0]?.nombreCartera })
        });
      },
      error: () => this.remitente.set({ nombre: m.usuario ?? '' })
    });
  }

  cerrarDetalle(): void {
    this.detalle.set(null);
  }

  private cargarArchivos(lista: WaoMensaje[]): void {
    for (const m of lista) {
      if (!m.mediaId || this.solicitados.has(m.id)) continue;
      this.solicitados.add(m.id);
      this.api.media(m.id).subscribe({
        next: blob => this.archivos.update(a => ({ ...a, [m.id]: URL.createObjectURL(blob) })),
        error: () => this.solicitados.delete(m.id)
      });
    }
  }

  clave(m: WaoMensaje): string {
    return m.userId ?? m.waId ?? '';
  }

  titulo(m: WaoMensaje): string {
    return m.nombre || (m.waId ? '+' + m.waId : m.userId) || 'Sin identificar';
  }

  iniciales(m: WaoMensaje): string {
    const base = (m.nombre || '').trim();
    if (!base) return '#';
    const partes = base.split(/\s+/);
    return ((partes[0]?.[0] ?? '') + (partes[1]?.[0] ?? '')).toUpperCase();
  }

  inicialesClave(): string {
    const c = this.chatActual();
    return c ? this.iniciales(c) : '#';
  }

  tituloSeleccion(): string {
    const c = this.chatActual();
    return c ? this.titulo(c) : (this.seleccion() ?? '');
  }

  subtituloSeleccion(): string {
    const c = this.chatActual();
    if (c?.waId) return '+' + c.waId;
    return c?.userId ?? this.seleccion() ?? '';
  }

  vistaPrevia(m: WaoMensaje): string {
    return m.contenido || (m.plantilla ? 'Plantilla ' + m.plantilla : '[' + m.tipo.toLowerCase() + ']');
  }

  marca(m: WaoMensaje): string {
    switch (m.estado) {
      case 'ENTREGADO':
      case 'LEIDO': return '✓✓';
      case 'FALLIDO': return '!';
      default: return '✓';
    }
  }

  cuerpoPlantilla(p: WaoPlantilla): string {
    return p.components?.find(c => c.type === 'BODY')?.text ?? '';
  }

  refrescar(silencioso = false): void {
    if (!silencioso) this.cargando.set(true);
    this.api.conversaciones(100).subscribe({
      next: lista => { this.chats.set(lista); this.cargando.set(false); },
      error: () => this.cargando.set(false)
    });
    this.api.resumen().subscribe({ next: r => this.resumen.set(r), error: () => this.resumen.set(null) });
    const sel = this.seleccion();
    if (sel) this.cargarMensajes(sel);
  }

  seleccionar(clave: string): void {
    this.seleccion.set(clave);
    this.error.set('');
    this.texto.set('');
    this.mensajes.set([]);
    this.cargarMensajes(clave, true);
  }

  abrirNuevo(): void {
    const valor = this.nuevoContacto().trim();
    if (!valor) return;
    this.nuevoContacto.set('');
    this.seleccionar(this.normalizarContacto(valor));
  }

  cambiarPestana(p: Pestana): void {
    this.pestana.set(p);
    if (p === 'plantillas' && !this.plantillas().length && !this.errorPlantillas()) this.cargarPlantillas();
    if (p === 'bajas') this.cargarBajas();
  }

  elegirPlantilla(valor: string | null): void {
    this.plantillaElegida.set(valor);
    this.parametros.set([]);
  }

  fijarParametro(i: number, valor: string): void {
    const copia = [...this.parametros()];
    copia[i] = valor;
    this.parametros.set(copia);
  }

  alEnter(evento: Event): void {
    const e = evento as KeyboardEvent;
    if (e.shiftKey) return;
    e.preventDefault();
    this.enviarTexto();
  }

  enviarTexto(): void {
    const sel = this.seleccion();
    const texto = this.texto().trim();
    if (!sel || !texto || this.enviando()) return;
    this.enviando.set(true);
    this.error.set('');
    this.api.enviarTexto(sel, texto).subscribe({
      next: () => { this.texto.set(''); this.enviando.set(false); this.refrescar(true); },
      error: err => { this.error.set(this.mensajeError(err)); this.enviando.set(false); }
    });
  }

  enviarPlantilla(): void {
    const sel = this.seleccion();
    const pl = this.plantillaActual();
    if (!sel || !pl || this.enviando()) return;
    this.enviando.set(true);
    this.error.set('');
    const params = this.variables().map((_, i) => (this.parametros()[i] ?? '').trim());
    this.api.enviarPlantilla(sel, pl.name, pl.language, params).subscribe({
      next: () => { this.enviando.set(false); this.elegirPlantilla(null); this.refrescar(true); },
      error: err => { this.error.set(this.mensajeError(err)); this.enviando.set(false); }
    });
  }

  darDeBajaSeleccion(): void {
    const sel = this.seleccion();
    if (!sel) return;
    this.api.registrarBaja(sel, 'Registrado por el asesor').subscribe({
      next: () => this.cargarBajas(),
      error: err => this.error.set(this.mensajeError(err))
    });
  }

  quitarBaja(waId: string): void {
    this.api.quitarBaja(waId).subscribe({ next: () => this.cargarBajas(), error: err => this.error.set(this.mensajeError(err)) });
  }

  private cargarMensajes(clave: string, bajar = false): void {
    this.api.mensajes(clave, 200).subscribe({
      next: lista => {
        if (this.seleccion() !== clave) return;
        this.mensajes.set(lista);
        this.cargarArchivos(lista);
        if (bajar) setTimeout(() => this.bajarPanel());
      }
    });
  }

  private cargarBajas(): void {
    this.api.bajas().subscribe({ next: b => this.bajas.set(b), error: () => this.bajas.set([]) });
  }

  private cargarPlantillas(): void {
    this.api.plantillas().subscribe({
      next: r => this.plantillas.set(r.data ?? []),
      error: () => this.errorPlantillas.set('No tienes permiso para ver las plantillas o Meta no respondió.')
    });
  }

  private bajarPanel(): void {
    const el = this.panel?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }

  private horasVentana(): number {
    return this.estado()?.ventanaHoras ?? 24;
  }

  private aMs(fecha: string): number {
    return new Date(fecha).getTime();
  }

  private normalizarContacto(valor: string): string {
    if (/^[A-Za-z]{2}\.[A-Za-z0-9]+$/.test(valor)) return valor;
    const digitos = valor.replace(/\D/g, '');
    return digitos.length === 9 && digitos.startsWith('9') ? '51' + digitos : digitos;
  }

  private mensajeError(err: any): string {
    const texto: string = err?.error?.message ?? err?.message ?? 'No se pudo completar la acción';
    const comillas = texto.match(/"([^"]+)"/);
    return comillas ? comillas[1] : texto;
  }
}
