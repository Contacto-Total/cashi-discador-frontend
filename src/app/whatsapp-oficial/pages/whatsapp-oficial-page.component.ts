import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, effect, signal, untracked } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { WhatsappOficialService } from '../services/whatsapp-oficial.service';
import { WhatsappOficialAvisosService } from '../services/whatsapp-oficial-avisos.service';
import { AuthService } from '../../core/services/auth.service';
import { SipService } from '../../core/services/sip.service';
import { ClientInfoAclService, GlobalSearchResult, DynamicClient } from '../../whatsapp/componentes/info-client/client-info-acl.service';
import { UserInfoService } from '../../whatsapp/services/user-info.service';
import { MENSAJES_RAPIDOS, MensajeRapido } from '../models/mensajes-rapidos';
import {
  WaoBaja, WaoPalabraProhibida, WaoEspectador, WaoEstado, WaoMensaje, WaoPlantilla, WaoRemitente, WaoResumen
} from '../models/whatsapp-oficial.models';

type Pestana = 'herramientas' | 'resumen' | 'bajas';
type Herramienta = 'plantillas' | 'mensajes' | 'buscar';
type ModoBusqueda = 'telefono' | 'documento';

interface CoincidenciaProhibida {
  inicio: number;
  fin: number;
  texto: string;
  opciones: { alternativa: string; mensaje: string }[];
}

function normalizarPalabra(s: string): string {
  return s.normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase();
}

@Component({
  selector: 'app-whatsapp-oficial-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, FormsModule],
  styles: [`
    .fondo-cashi {
      background-color: #efeae2;
      background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='170' height='170' viewBox='0 0 170 170'><g opacity='0.17'><g transform='translate(36 34) rotate(-14) scale(0.5)'><rect x='48.5' y='-12' width='3' height='16' rx='2' fill='%2310b981'/><circle cx='50' cy='-14' r='4' fill='%2310b981'/><rect x='10' y='0' width='80' height='80' rx='20' fill='%23f5f8f9' stroke='%2310b981' stroke-width='2.5'/><circle cx='31' cy='40' r='9' fill='%2310b981'/><circle cx='69' cy='40' r='9' fill='%2310b981'/><circle cx='31' cy='40' r='3.5' fill='white'/><circle cx='69' cy='40' r='3.5' fill='white'/><path d='M38 50H62V50Q62 62 50 62Q38 62 38 50Z' fill='%2310b981'/><g fill='none'><path d='M10.5 46L10.5 20A20.5 20.5 0 0 1 30 -0.5L70 -0.5A20.5 20.5 0 0 1 89.5 20L89.5 46' stroke='%2310b981' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/><path d='M96 50Q91 72 67 65' stroke='%2310b981' stroke-width='3.5' stroke-linecap='round'/></g><circle cx='67' cy='65' r='4' fill='%23059669'/><rect x='-5' y='28' width='22' height='24' rx='8' fill='%2310b981'/><rect x='83' y='28' width='22' height='24' rx='8' fill='%2310b981'/></g><g transform='translate(121 119) rotate(-14) scale(0.5)'><rect x='48.5' y='-12' width='3' height='16' rx='2' fill='%2310b981'/><circle cx='50' cy='-14' r='4' fill='%2310b981'/><rect x='10' y='0' width='80' height='80' rx='20' fill='%23f5f8f9' stroke='%2310b981' stroke-width='2.5'/><circle cx='31' cy='40' r='9' fill='%2310b981'/><circle cx='69' cy='40' r='9' fill='%2310b981'/><circle cx='31' cy='40' r='3.5' fill='white'/><circle cx='69' cy='40' r='3.5' fill='white'/><path d='M38 50H62V50Q62 62 50 62Q38 62 38 50Z' fill='%2310b981'/><g fill='none'><path d='M10.5 46L10.5 20A20.5 20.5 0 0 1 30 -0.5L70 -0.5A20.5 20.5 0 0 1 89.5 20L89.5 46' stroke='%2310b981' stroke-width='7' stroke-linecap='round' stroke-linejoin='round'/><path d='M96 50Q91 72 67 65' stroke='%2310b981' stroke-width='3.5' stroke-linecap='round'/></g><circle cx='67' cy='65' r='4' fill='%23059669'/><rect x='-5' y='28' width='22' height='24' rx='8' fill='%2310b981'/><rect x='83' y='28' width='22' height='24' rx='8' fill='%2310b981'/></g></g></svg>");
      background-size: 170px 170px;
      background-repeat: repeat;
    }
  `],
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
                    <div class="mt-1 flex items-center justify-between gap-2">
                      <p class="min-w-0 flex-1 truncate text-sm text-slate-600" [class.font-semibold]="avisos.pendientes()[clave(chat)]" [class.text-slate-900]="avisos.pendientes()[clave(chat)]">
                        @if (chat.direccion === 'SALIENTE') { <span class="font-medium text-emerald-700">Tú: </span> }
                        {{ vistaPrevia(chat) }}
                      </p>
                      @if (avisos.pendientes()[clave(chat)]; as n) {
                        <span class="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-emerald-600 px-1.5 text-[11px] font-bold text-white">{{ n }}</span>
                      }
                    </div>
                  </div>
                </button>
              }
            }
          </section>
        </aside>

        <section class="hidden h-full min-h-0 flex-col overflow-hidden bg-white sm:flex">
          @if (seleccion(); as sel) {
            <header class="relative flex items-center gap-3 border-b border-slate-200 bg-[#f0f2f5] px-4 py-2.5">
              <div class="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-slate-950">{{ inicialesClave() }}</div>
              <div class="min-w-0 flex-1">
                <h2 class="truncate text-[15px] font-semibold text-slate-950">{{ tituloSeleccion() }}</h2>
                <p class="truncate text-xs text-slate-500">{{ subtituloSeleccion() }}</p>
              </div>
              @if (enBaja()) {
                <span class="rounded-md bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">No quiere mensajes</span>
              }
              <button type="button" class="relative grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-200" title="Quién está viendo este chat" aria-label="Quién está viendo este chat" (click)="verEspectadores.set(!verEspectadores())">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                @if (espectadores().length) {
                  <span class="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white">{{ espectadores().length }}</span>
                }
              </button>
              <button type="button" class="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-200" title="Llamar" aria-label="Llamar" (click)="llamar()">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
              </button>
              @if (verEspectadores()) {
                <div class="absolute right-16 top-14 z-20 w-64 rounded-xl bg-white p-3 text-sm shadow-xl ring-1 ring-slate-200">
                  <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Viendo este chat</p>
                  @for (e of espectadores(); track e.usuario) {
                    <p class="mt-2 flex items-center gap-2 text-slate-800">
                      <span class="size-2 rounded-full bg-emerald-500"></span>{{ e.nombre }}@if (e.usuario === usuarioActual()) { <span class="text-xs text-slate-400">(tú)</span> }
                    </p>
                  } @empty {
                    <p class="mt-2 text-xs text-slate-500">Nadie más lo está viendo.</p>
                  }
                </div>
              }
            </header>

            <div #panel class="fondo-cashi min-h-0 flex-1 overflow-y-auto px-[6%] py-4">
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
                        [class]="m.direccion === 'SALIENTE' ? 'bg-[#d9fdd3]' : 'bg-white'">
                        @if (m.plantilla) { <p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Plantilla · {{ m.plantilla }}</p> }
                        @if (m.mediaId) {
                          @if (esImagen(m) && archivos()[m.id]) {
                            <img [src]="archivos()[m.id]" alt="Imagen recibida" class="mb-1 max-h-72 max-w-full cursor-zoom-in rounded-md" (click)="imagenAmpliada.set(archivos()[m.id])" />
                          } @else if (esImagen(m)) {
                            <p class="text-xs text-slate-500">Cargando imagen...</p>
                          } @else if (m.tipo === 'AUDIO' && archivos()[m.id]) {
                            <audio controls [src]="archivos()[m.id]" class="mb-1 h-10 w-64 max-w-full"></audio>
                          } @else if (m.tipo === 'VIDEO' && archivos()[m.id]) {
                            <video controls [src]="archivos()[m.id]" class="mb-1 max-h-72 max-w-full rounded-md"></video>
                          } @else if (archivos()[m.id]) {
                            <a [href]="archivos()[m.id]" target="_blank" [attr.download]="m.contenido || 'archivo'" class="mb-1 flex items-center gap-2 rounded-md bg-black/5 px-3 py-2 text-xs font-semibold text-emerald-800">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/></svg>
                              Descargar {{ m.tipo === 'DOCUMENT' ? 'documento' : m.tipo.toLowerCase() }}
                            </a>
                          } @else {
                            <p class="text-xs text-slate-500">Cargando {{ m.tipo.toLowerCase() }}...</p>
                          }
                        }
                        @if ((m.contenido && m.tipo !== 'DOCUMENT') || !m.mediaId) {
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

            <footer class="space-y-2 border-t border-slate-200 bg-[#f0f2f5] p-3">
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
              @if (adjunto(); as f) {
                <div class="flex items-center gap-3 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200">
                  @if (adjuntoVista()) { <img [src]="adjuntoVista()" alt="" class="size-12 rounded-md object-cover" /> }
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-semibold text-slate-900">{{ f.name }}</p>
                    <p class="text-xs text-slate-500">{{ (f.size / 1024) | number: '1.0-0' }} KB · escribe un mensaje opcional y envía</p>
                  </div>
                  <button type="button" class="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Quitar archivo" (click)="quitarAdjunto()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
              }
              @if (emojis()) {
                <div class="grid grid-cols-8 gap-1 rounded-xl bg-white p-2 text-xl ring-1 ring-slate-200">
                  @for (e of listaEmojis; track e) {
                    <button type="button" class="rounded-md p-1 hover:bg-slate-100" (click)="agregarEmoji(e)">{{ e }}</button>
                  }
                </div>
              }
              @if (menuAdjuntar()) {
                <div class="flex flex-wrap gap-2 rounded-xl bg-white p-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  <button type="button" class="rounded-lg px-3 py-2 hover:bg-slate-100" (click)="imagenInput.click()">Foto</button>
                  <button type="button" class="rounded-lg px-3 py-2 hover:bg-slate-100" (click)="documentoInput.click()">Documento</button>
                  <button type="button" class="rounded-lg px-3 py-2 hover:bg-slate-100" (click)="audioInput.click()">Audio</button>
                </div>
              }
              <input #imagenInput type="file" class="hidden" accept="image/jpeg,image/png" (change)="elegirArchivo($event)" />
              <input #documentoInput type="file" class="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv" (change)="elegirArchivo($event)" />
              <input #audioInput type="file" class="hidden" accept="audio/*" (change)="elegirArchivo($event)" />
              @if (coincidencias().length) {
                <div class="space-y-3 rounded-xl bg-rose-50 p-3 text-xs ring-1 ring-rose-200">
                  <p class="font-semibold text-rose-800">Este mensaje no se puede enviar así</p>
                  @for (c of coincidencias(); track c.inicio) {
                    <div class="space-y-1.5">
                      <p class="text-rose-800">
                        «{{ c.texto }}» no está permitida.
                        @if (c.opciones.length) { Elige cómo enviarlo: } @else { Escríbelo sin esa palabra. }
                      </p>
                      @for (o of c.opciones; track o.alternativa) {
                        <button type="button" class="block w-full rounded-lg bg-white px-3 py-2 text-left text-slate-800 ring-1 ring-rose-200 transition hover:bg-emerald-50 hover:ring-emerald-300" (click)="aplicarOpcion(o.mensaje)">
                          <span class="line-clamp-2">{{ o.mensaje }}</span>
                        </button>
                      }
                    </div>
                  }
                </div>
              }
              <form class="flex items-end gap-2" (ngSubmit)="enviarPrincipal()">
                @if (grabando()) {
                  <button type="button" class="grid size-11 shrink-0 place-items-center rounded-full text-rose-600 hover:bg-rose-50" title="Cancelar" aria-label="Cancelar grabación" (click)="cancelarGrabacion()">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>
                  </button>
                  <div class="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 text-sm text-slate-700 ring-1 ring-slate-200">
                    <span class="size-2.5 animate-pulse rounded-full bg-rose-500"></span>
                    Grabando {{ tiempoGrabacion() }}
                  </div>
                  <button type="button" class="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700" title="Enviar audio" aria-label="Enviar audio" (click)="detenerGrabacion(true)">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12 2-12 2z"/></svg>
                  </button>
                } @else {
                  <button type="button" class="grid size-11 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-200 disabled:opacity-40" title="Emojis" aria-label="Emojis" [disabled]="!puedeEscribir()" (click)="emojis.set(!emojis()); menuAdjuntar.set(false)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9.5h.01M15 9.5h.01"/></svg>
                  </button>
                  <button type="button" class="grid size-11 shrink-0 place-items-center rounded-full text-slate-500 hover:bg-slate-200 disabled:opacity-40" title="Adjuntar" aria-label="Adjuntar" [disabled]="!puedeEscribir()" (click)="menuAdjuntar.set(!menuAdjuntar()); emojis.set(false)">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m21 11.5-8.6 8.6a5.5 5.5 0 0 1-7.8-7.8l8.6-8.6a3.7 3.7 0 0 1 5.2 5.2l-8.6 8.6a1.8 1.8 0 0 1-2.6-2.6l7.9-7.9"/></svg>
                  </button>
                  <textarea class="max-h-32 min-h-11 min-w-0 flex-1 resize-none rounded-3xl border border-transparent bg-white px-4 py-3 text-sm leading-tight text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 disabled:bg-slate-100 disabled:text-slate-500"
                    rows="1" name="texto"
                    [placeholder]="ventanaAbierta() ? 'Escribe un mensaje' : 'Ventana cerrada: usa una plantilla'"
                    [disabled]="!puedeEscribir()"
                    [ngModel]="texto()" (ngModelChange)="texto.set($event)"
                    (keydown.enter)="alEnter($event)"></textarea>
                  @if (texto().trim() || adjunto()) {
                    <button type="submit" class="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      title="Enviar" aria-label="Enviar" [disabled]="!puedeEscribir()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12 2-12 2z"/></svg>
                    </button>
                  } @else {
                    <button type="button" class="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                      title="Grabar audio" aria-label="Grabar audio" [disabled]="!puedeEscribir()" (click)="iniciarGrabacion()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
                    </button>
                  }
                }
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
            @if (pestana() === 'herramientas') {
              <div class="flex gap-1 rounded-full bg-slate-100 p-0.5 text-xs font-medium">
                @for (h of herramientas; track h.id) {
                  <button type="button" class="flex-1 rounded-full px-2 py-1.5 transition"
                    [class]="herramienta() === h.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                    (click)="cambiarHerramienta(h.id)">{{ h.etiqueta }}</button>
                }
              </div>
            }

            @if (pestana() === 'herramientas' && herramienta() === 'plantillas') {
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

            @if (pestana() === 'herramientas' && herramienta() === 'mensajes') {
              @if (seleccion()) {
                <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Mensajes rápidos</p>
                  <p class="mt-1 text-xs text-slate-500">{{ ventanaAbierta() ? 'Haz clic en uno para enviarlo.' : 'Ventana de 24 h cerrada: solo plantillas.' }}</p>
                  <ul class="mt-3 divide-y divide-slate-200 overflow-hidden rounded-lg bg-white ring-1 ring-slate-200">
                    @for (r of mensajesRapidos; track r.titulo) {
                      <li>
                        <button type="button" class="block w-full px-3 py-2 text-left transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                          [disabled]="!puedeEscribir()" (click)="enviarRapido(r)">
                          <span class="block text-xs font-semibold text-slate-800">{{ r.titulo }}</span>
                          <span class="mt-0.5 line-clamp-2 block text-xs text-slate-500">{{ textoRapido(r) }}</span>
                        </button>
                      </li>
                    }
                  </ul>
                </div>
              } @else {
                <p class="text-sm text-slate-500">Elige una conversación para usar los mensajes rápidos.</p>
              }
            }

            @if (pestana() === 'herramientas' && herramienta() === 'buscar') {
              <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div class="flex gap-1 rounded-full bg-slate-100 p-0.5 text-xs font-medium">
                  @for (m of modosBusqueda; track m.id) {
                    <button type="button" class="flex-1 rounded-full px-2 py-1 transition"
                      [class]="modoBusqueda() === m.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                      (click)="cambiarModoBusqueda(m.id)">{{ m.etiqueta }}</button>
                  }
                </div>
                <form class="mt-2 flex gap-2" (ngSubmit)="buscarCliente()">
                  <input class="min-w-0 flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    type="search" name="consultaCliente"
                    [placeholder]="modoBusqueda() === 'documento' ? 'DNI / documento' : 'Número de teléfono'"
                    [ngModel]="consultaCliente()" (ngModelChange)="consultaCliente.set($event)" />
                  <button type="submit" class="shrink-0 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:bg-slate-300"
                    [disabled]="buscandoCliente() || !consultaCliente().trim()">{{ buscandoCliente() ? '…' : 'Buscar' }}</button>
                </form>
                @if (errorBusqueda()) {
                  <p class="mt-2 text-xs font-medium text-rose-600">{{ errorBusqueda() }}</p>
                }
              </div>
              @if (resultadosCliente().length) {
                <ul class="divide-y divide-slate-100 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
                  @for (r of resultadosCliente(); track r.clientId + '-' + r.subPortfolioId) {
                    <li>
                      <button type="button" class="block w-full px-4 py-3 text-left transition hover:bg-emerald-50/70" (click)="abrirChatCliente(r)">
                        <p class="truncate text-[11px] font-semibold uppercase tracking-wide text-slate-400">{{ r.nombreCartera }} · {{ r.nombreSubcartera }}</p>
                        <p class="mt-1 truncate text-sm font-bold leading-5 text-slate-950">{{ nombreCliente(r.clientData) }}</p>
                        <p class="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
                          <span>Doc: {{ r.clientData.documento }}</span>
                          @if (r.clientData.dias_mora != null) {
                            <span class="text-slate-300">•</span>
                            <span>Mora: {{ r.clientData.dias_mora }} días</span>
                          }
                        </p>
                      </button>
                    </li>
                  }
                </ul>
                <p class="text-xs text-slate-500">Haz clic en un cliente para abrir su chat.</p>
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
              <div class="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Palabras no permitidas</p>
                <p class="mt-1 text-xs text-slate-500">Si un asesor escribe una de estas palabras, el mensaje no se envía.</p>
                <form class="mt-3 flex gap-2" (submit)="$event.preventDefault(); agregarPalabraProhibida()">
                  <input type="text" name="nuevaPalabra" maxlength="120" placeholder="Palabra o frase"
                    class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    [ngModel]="nuevaPalabra()" (ngModelChange)="nuevaPalabra.set($event)" />
                  <button type="submit" class="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50" [disabled]="!nuevaPalabra().trim()">Agregar</button>
                </form>
                <input type="text" name="nuevasAlternativas" maxlength="480" placeholder="Alternativas separadas por coma (opcional)"
                  class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  [ngModel]="nuevasAlternativas()" (ngModelChange)="nuevasAlternativas.set($event)" />
                <p class="mt-1 text-xs text-slate-500">Para cubrir variantes termina la palabra con * (ejemplo: deuda*).</p>
                @if (!palabrasProhibidas().length) {
                  <p class="mt-3 text-xs text-slate-500">Aún no hay palabras registradas.</p>
                } @else {
                  <div class="mt-3 flex flex-wrap gap-2">
                    @for (w of palabrasProhibidas(); track w.id) {
                      <span class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
                        <span [title]="w.alternativas ? w.alternativas.split('|').join(', ') : 'Sin alternativas'">{{ w.palabra }}</span>
                        <button type="button" class="font-bold text-rose-600 hover:text-rose-800" aria-label="Quitar" (click)="quitarPalabraProhibida(w.id)">×</button>
                      </span>
                    }
                  </div>
                }
              </div>
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
    { id: 'herramientas', etiqueta: 'Herramientas' },
    { id: 'resumen', etiqueta: 'Resumen' },
    { id: 'bajas', etiqueta: 'Bajas' }
  ];

  readonly estado = signal<WaoEstado | null>(null);
  readonly resumen = signal<WaoResumen | null>(null);
  readonly chats = signal<WaoMensaje[]>([]);
  readonly mensajes = signal<WaoMensaje[]>([]);
  readonly bajas = signal<WaoBaja[]>([]);
  readonly palabrasProhibidas = signal<WaoPalabraProhibida[]>([]);
  readonly nuevaPalabra = signal('');
  readonly nuevasAlternativas = signal('');
  readonly reglasProhibidas = computed(() =>
    this.palabrasProhibidas()
      .map(p => ({
        tokens: p.palabra.split(' '),
        alternativas: p.alternativas ? p.alternativas.split('|').map(a => a.trim()).filter(Boolean) : []
      }))
      .sort((a, b) => b.tokens.length - a.tokens.length)
  );
  readonly coincidencias = computed<CoincidenciaProhibida[]>(() => {
    const texto = this.texto();
    const reglas = this.reglasProhibidas();
    if (!texto || !reglas.length) return [];
    const tokens = Array.from(texto.matchAll(/[\p{L}\p{N}]+/gu)).map(m => ({
      inicio: m.index ?? 0,
      fin: (m.index ?? 0) + m[0].length,
      norm: normalizarPalabra(m[0])
    }));
    const encontradas: CoincidenciaProhibida[] = [];
    let i = 0;
    while (i < tokens.length) {
      const regla = reglas.find(r => r.tokens.every((t, k) => {
        const tk = tokens[i + k];
        if (!tk) return false;
        return t.endsWith('*') ? tk.norm.startsWith(t.slice(0, -1)) : tk.norm === t;
      }));
      if (!regla) { i++; continue; }
      const ultimo = tokens[i + regla.tokens.length - 1];
      const inicio = tokens[i].inicio;
      const fin = ultimo.fin;
      encontradas.push({
        inicio,
        fin,
        texto: texto.slice(inicio, fin),
        opciones: regla.alternativas.map(a => ({ alternativa: a, mensaje: this.reemplazar(texto, inicio, fin, a) }))
      });
      i += regla.tokens.length;
    }
    return encontradas;
  });
  readonly plantillas = signal<WaoPlantilla[]>([]);
  readonly seleccion = signal<string | null>(null);
  readonly busqueda = signal('');
  readonly nuevoContacto = signal('');
  readonly texto = signal('');
  readonly error = signal('');
  readonly errorPlantillas = signal('');
  readonly enviando = signal(false);
  readonly cargando = signal(false);
  readonly pestana = signal<Pestana>('herramientas');
  readonly mensajesRapidos: MensajeRapido[] = MENSAJES_RAPIDOS;
  readonly herramientas: { id: Herramienta; etiqueta: string }[] = [
    { id: 'plantillas', etiqueta: 'Plantillas' },
    { id: 'mensajes', etiqueta: 'Mensajes' },
    { id: 'buscar', etiqueta: 'Buscar cliente' }
  ];
  readonly modosBusqueda: { id: ModoBusqueda; etiqueta: string }[] = [
    { id: 'telefono', etiqueta: 'Teléfono' },
    { id: 'documento', etiqueta: 'Documento' }
  ];
  readonly herramienta = signal<Herramienta>('plantillas');
  readonly modoBusqueda = signal<ModoBusqueda>('telefono');
  readonly consultaCliente = signal('');
  readonly buscandoCliente = signal(false);
  readonly errorBusqueda = signal('');
  readonly resultadosCliente = signal<GlobalSearchResult[]>([]);
  readonly archivos = signal<Record<number, string>>({});
  readonly espectadores = signal<WaoEspectador[]>([]);
  readonly verEspectadores = signal(false);
  readonly emojis = signal(false);
  readonly menuAdjuntar = signal(false);
  readonly adjunto = signal<File | null>(null);
  readonly adjuntoVista = signal<string | null>(null);
  readonly grabando = signal(false);
  readonly segundosGrabacion = signal(0);
  readonly tiempoGrabacion = computed(() => {
    const s = this.segundosGrabacion();
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });
  readonly listaEmojis = ['😀','😂','😊','😍','🙂','😉','🙏','👍','👏','🙌','💪','🤝','👋','😅','😢','😮','😡','❤️','✅','❌','📞','📄','💳','⏰','📅','💬','🎉','🌟','😴','🤔','😬','🥲'];
  private mediaRecorder?: MediaRecorder;
  private trozos: Blob[] = [];
  private flujoAudio?: MediaStream;
  private relojGrabacion?: ReturnType<typeof setInterval>;
  private latidoPresencia?: ReturnType<typeof setInterval>;
  private chatPresencia: string | null = null;
  readonly usuarioActual = computed(() => this.auth.getCurrentUser()?.username ?? '');
  readonly puedeEscribir = computed(() => this.ventanaAbierta() && !this.enBaja() && !this.enviando());
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

  constructor(private readonly api: WhatsappOficialService, private readonly userInfo: UserInfoService, readonly avisos: WhatsappOficialAvisosService, private readonly auth: AuthService, private readonly sip: SipService, private readonly acl: ClientInfoAclService, private readonly route: ActivatedRoute) {
    effect(() => {
      const texto = this.error();
      if (!texto) return;
      untracked(() => {
        this.avisos.alertar(texto);
        this.error.set('');
      });
    });
  }

  ngOnInit(): void {
    this.api.estado().subscribe({ next: e => this.estado.set(e), error: () => this.estado.set(null) });
    this.refrescar();
    this.cargarBajas();
    this.cargarPalabrasProhibidas();
    this.cambiarHerramienta('plantillas');
    const chatUrl = this.route.snapshot.queryParamMap.get('chat');
    if (chatUrl) this.seleccionar(chatUrl);
    this.temporizador = setInterval(() => {
      this.ahora.set(Date.now());
      this.refrescar(true);
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.temporizador) clearInterval(this.temporizador);
    this.avisos.chatActivo.set(null);
    this.detenerPresencia();
    this.detenerGrabacion(false);
    Object.values(this.archivos()).forEach(u => URL.revokeObjectURL(u));
  }

  private iniciarPresencia(clave: string): void {
    this.detenerPresencia();
    this.chatPresencia = clave;
    this.espectadores.set([]);
    const latir = () => this.api.viendo(clave).subscribe({
      next: lista => { if (this.chatPresencia === clave) this.espectadores.set(lista); },
      error: () => undefined
    });
    latir();
    this.latidoPresencia = setInterval(latir, 7000);
  }

  private detenerPresencia(): void {
    if (this.latidoPresencia) clearInterval(this.latidoPresencia);
    this.latidoPresencia = undefined;
    if (this.chatPresencia) this.api.dejarDeVer(this.chatPresencia).subscribe({ error: () => undefined });
    this.chatPresencia = null;
  }

  llamar(): void {
    const c = this.chatActual();
    const telefono = (c?.waId ?? '').replace(/\D/g, '');
    if (!telefono) {
      this.error.set('Este contacto no tiene teléfono visible: Meta solo entregó su identificador.');
      return;
    }
    if (!this.sip.isRegistered()) {
      this.error.set('Tu softphone no está conectado. Conéctate para poder llamar.');
      return;
    }
    const destino = telefono.startsWith('51') && telefono.length === 11 ? telefono.slice(2) : telefono;
    this.error.set('');
    this.sip.call(destino).catch(() => this.error.set('No se pudo iniciar la llamada.'));
  }

  textoRapido(r: MensajeRapido): string {
    const nombre = (this.chatActual()?.nombre ?? '').trim().split(/\s+/)[0] ?? '';
    return nombre ? r.texto.replace('{nombre}', nombre) : r.texto.replace(' {nombre}', '').replace('{nombre}', '');
  }

  enviarRapido(r: MensajeRapido): void {
    const sel = this.seleccion();
    if (!sel || !this.puedeEscribir()) return;
    this.enviando.set(true);
    this.error.set('');
    this.api.enviarTexto(sel, this.textoRapido(r)).subscribe({
      next: () => { this.enviando.set(false); this.refrescar(true); setTimeout(() => this.bajarPanel(), 300); },
      error: err => { this.error.set(this.mensajeError(err)); this.enviando.set(false); }
    });
  }

  cambiarHerramienta(h: Herramienta): void {
    this.herramienta.set(h);
    if (h === 'plantillas' && !this.plantillas().length && !this.errorPlantillas()) this.cargarPlantillas();
  }

  cambiarModoBusqueda(m: ModoBusqueda): void {
    this.modoBusqueda.set(m);
    this.consultaCliente.set('');
    this.errorBusqueda.set('');
  }

  buscarCliente(): void {
    const valor = this.consultaCliente().trim();
    if (!valor) return;
    this.buscandoCliente.set(true);
    this.errorBusqueda.set('');
    this.resultadosCliente.set([]);
    const consulta = this.modoBusqueda() === 'documento'
      ? this.acl.searchByDocument(valor)
      : this.acl.searchByPhone(this.acl.phoneKey(valor));
    consulta.pipe(finalize(() => this.buscandoCliente.set(false))).subscribe({
      next: lista => {
        const limpia = (lista ?? []).filter(r => r && r.clientData && r.clientData.documento);
        this.resultadosCliente.set(limpia);
        if (!limpia.length) this.errorBusqueda.set('Sin resultados.');
      },
      error: () => this.errorBusqueda.set('No se pudo buscar el cliente.')
    });
  }

  nombreCliente(c: DynamicClient): string {
    const completo = c['nombre_completo'] || c['nombreCompleto'] || c['fullName'];
    if (typeof completo === 'string' && completo.trim()) return completo.trim();
    if (c.nombre?.trim()) return c.nombre;
    const partes = [c.nombres, c.apellidos].map(p => p?.trim()).filter(Boolean);
    return partes.length ? partes.join(' ') : 'Sin nombre';
  }

  abrirChatCliente(r: GlobalSearchResult): void {
    const c = r.clientData;
    const buscado = this.modoBusqueda() === 'telefono' ? this.acl.phoneKey(this.consultaCliente()) : '';
    const claves = [buscado, ...[c.telefono, c.telefono_1, c.telefono_2, c.telefono_3].map(t => this.acl.phoneKey(t ? String(t) : ''))]
      .filter((k, i, a) => k.length === 9 && a.indexOf(k) === i)
      .map(k => '51' + k);
    if (!claves.length) {
      this.error.set('Este cliente no tiene teléfonos registrados.');
      return;
    }
    this.errorBusqueda.set('');
    forkJoin(claves.map(k => this.api.mensajes(k, 200).pipe(catchError(() => of([] as WaoMensaje[])))))
      .subscribe(listas => {
        const i = listas.findIndex(l => l.some(m => m.direccion === 'ENTRANTE'));
        if (i >= 0) this.seleccionar(claves[i]);
        else this.error.set('Este cliente aún no ha escrito al número oficial, así que no se puede abrir su chat.');
      });
  }

  agregarEmoji(e: string): void {
    this.texto.update(t => t + e);
  }

  elegirArchivo(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    this.menuAdjuntar.set(false);
    if (!archivo) return;
    this.quitarAdjunto();
    this.adjunto.set(archivo);
    if (archivo.type.startsWith('image/')) this.adjuntoVista.set(URL.createObjectURL(archivo));
  }

  quitarAdjunto(): void {
    const v = this.adjuntoVista();
    if (v) URL.revokeObjectURL(v);
    this.adjuntoVista.set(null);
    this.adjunto.set(null);
  }

  enviarPrincipal(): void {
    if (this.adjunto()) this.enviarAdjunto();
    else this.enviarTexto();
  }

  private enviarAdjunto(): void {
    const sel = this.seleccion();
    const archivo = this.adjunto();
    if (!sel || !archivo || this.enviando()) return;
    this.subirArchivo(sel, archivo, this.texto().trim(), () => { this.texto.set(''); this.quitarAdjunto(); });
  }

  private subirArchivo(sel: string, archivo: File, texto: string, alTerminar: () => void): void {
    this.enviando.set(true);
    this.error.set('');
    this.api.enviarArchivo(sel, archivo, texto).subscribe({
      next: () => { alTerminar(); this.enviando.set(false); this.refrescar(true); },
      error: err => { this.error.set(this.mensajeError(err)); this.enviando.set(false); }
    });
  }

  async iniciarGrabacion(): Promise<void> {
    if (this.grabando() || !this.puedeEscribir()) return;
    try {
      this.flujoAudio = await navigator.mediaDevices.getUserMedia({ audio: true });
      const formato = ['audio/ogg;codecs=opus', 'audio/mp4', 'audio/webm;codecs=opus'].find(t => MediaRecorder.isTypeSupported(t));
      this.mediaRecorder = formato ? new MediaRecorder(this.flujoAudio, { mimeType: formato }) : new MediaRecorder(this.flujoAudio);
      this.trozos = [];
      this.mediaRecorder.ondataavailable = e => { if (e.data.size) this.trozos.push(e.data); };
      this.mediaRecorder.start();
      this.segundosGrabacion.set(0);
      this.grabando.set(true);
      this.relojGrabacion = setInterval(() => this.segundosGrabacion.update(s => s + 1), 1000);
    } catch {
      this.error.set('No se pudo usar el micrófono. Revisa el permiso del navegador.');
    }
  }

  cancelarGrabacion(): void {
    this.detenerGrabacion(false);
  }

  detenerGrabacion(enviar: boolean): void {
    if (this.relojGrabacion) clearInterval(this.relojGrabacion);
    this.relojGrabacion = undefined;
    const grabador = this.mediaRecorder;
    const sel = this.seleccion();
    this.mediaRecorder = undefined;
    this.grabando.set(false);
    if (!grabador || grabador.state === 'inactive') {
      this.flujoAudio?.getTracks().forEach(t => t.stop());
      return;
    }
    grabador.onstop = () => {
      this.flujoAudio?.getTracks().forEach(t => t.stop());
      if (!enviar || !sel || !this.trozos.length) return;
      const tipo = grabador.mimeType || 'audio/webm';
      const ext = tipo.includes('ogg') ? 'ogg' : tipo.includes('mp4') ? 'm4a' : 'webm';
      const archivo = new File([new Blob(this.trozos, { type: tipo })], `audio.${ext}`, { type: tipo });
      this.subirArchivo(sel, archivo, '', () => undefined);
    };
    grabador.stop();
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
    this.avisos.chatActivo.set(clave);
    this.avisos.limpiar(clave);
    this.iniciarPresencia(clave);
    this.quitarAdjunto();
    this.emojis.set(false);
    this.menuAdjuntar.set(false);
    this.verEspectadores.set(false);
    this.error.set('');
    this.texto.set('');
    this.mensajes.set([]);
    this.cargarMensajes(clave, true);
  }

  abrirNuevo(): void {
    const valor = this.nuevoContacto().trim();
    if (!valor) return;
    const clave = this.normalizarContacto(valor);
    this.error.set('');
    this.api.mensajes(clave, 200).subscribe({
      next: lista => {
        if (lista.some(m => m.direccion === 'ENTRANTE')) {
          this.nuevoContacto.set('');
          this.seleccionar(clave);
        } else {
          this.error.set('Ese contacto nunca ha escrito al número oficial, así que no se le puede enviar mensajes.');
        }
      },
      error: err => this.error.set(this.mensajeError(err))
    });
  }

  cambiarPestana(p: Pestana): void {
    this.pestana.set(p);
    if (p === 'herramientas') this.cambiarHerramienta(this.herramienta());
    if (p === 'bajas') this.cargarBajas();
    if (p === 'resumen') this.cargarPalabrasProhibidas();
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

  aplicarOpcion(mensaje: string): void {
    this.texto.set(mensaje);
  }

  private reemplazar(texto: string, inicio: number, fin: number, alternativa: string): string {
    const original = texto.charAt(inicio);
    const esMayuscula = original !== original.toLowerCase() && original === original.toUpperCase();
    const nueva = esMayuscula ? alternativa.charAt(0).toUpperCase() + alternativa.slice(1) : alternativa;
    return texto.slice(0, inicio) + nueva + texto.slice(fin);
  }

  agregarPalabraProhibida(): void {
    const palabra = this.nuevaPalabra().trim();
    if (!palabra) return;
    const alternativas = this.nuevasAlternativas().split(',').map(a => a.trim()).filter(Boolean).join('|');
    this.api.agregarPalabraProhibida(palabra, alternativas).subscribe({
      next: () => { this.nuevaPalabra.set(''); this.nuevasAlternativas.set(''); this.cargarPalabrasProhibidas(); },
      error: err => this.error.set(this.mensajeError(err))
    });
  }

  quitarPalabraProhibida(id: number): void {
    this.api.quitarPalabraProhibida(id).subscribe({
      next: () => this.cargarPalabrasProhibidas(),
      error: err => this.error.set(this.mensajeError(err))
    });
  }

  private cargarPalabrasProhibidas(): void {
    this.api.palabrasProhibidas().subscribe({ next: l => this.palabrasProhibidas.set(l), error: () => this.palabrasProhibidas.set([]) });
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
