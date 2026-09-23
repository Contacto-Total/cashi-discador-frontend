import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import {
  CartaNoAdeudoClienteCorreo,
  CartaNoAdeudoEnviada,
  CartaNoAdeudoFallido,
  CartaNoAdeudoObservacion,
  CartaNoAdeudoSeguimiento,
  CartaNoAdeudoSeguimientoEvento,
  CartaNoAdeudoValidacionPago,
  MetodoContactoCorreo,
  ReenviarCartaNoAdeudoItem
} from '../../../models/carta-no-adeudo.model';
import {
  CARTA_NO_ADEUDO_ASUNTO,
  CARTA_NO_ADEUDO_CUERPO,
  CARTA_NO_ADEUDO_REMITENTE,
  nombreAdjuntoCartaNoAdeudo,
  renderPlantillaCorreo
} from '../../../models/carta-no-adeudo-email-template';
import { CartaNoAdeudoService } from '../../../services/carta-no-adeudo.service';
import { CartaNoAdeudoListaWidgetComponent } from '../../widgets/carta-no-adeudo-lista-widget/carta-no-adeudo-lista-widget.component';
import { BcpPagosService } from '../../../../../pagos-bancarios/services/bcp-pagos.service';
import { ResumenConciliacionCliente } from '../../../../../pagos-bancarios/models/bcp-archivo.model';
import { ClienteResumenConciliacionLecturaWidget } from '../../../../../pagos-bancarios/widgets/cliente-resumen-conciliacion-lectura.widget';
import { firstValueFrom } from 'rxjs';

type PestanaCarta = 'correo' | 'pagos' | 'historial';
type SubTabPagos = 'validacion' | 'fallidos';
type OrigenEnvio = 'pagos' | 'fallidos';

@Component({
  selector: 'app-carta-no-adeudo-email-page',
  standalone: true,
  imports: [LucideAngularModule, CartaNoAdeudoListaWidgetComponent, ClienteResumenConciliacionLecturaWidget],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 dark:bg-slate-900">
      <div class="mx-auto max-w-7xl">
        <div class="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-base font-semibold text-slate-800 dark:text-white">Emisión de cartas por correo</h1>
          <div class="flex items-center gap-2">
          <nav class="inline-flex w-full rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium shadow-sm sm:w-auto dark:border-slate-700 dark:bg-slate-800" aria-label="Etapas de emisión">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 transition-colors sm:flex-none"
              [class.bg-blue-600]="activeTab() === 'correo'"
              [class.text-white]="activeTab() === 'correo'"
              [class.text-slate-500]="activeTab() !== 'correo'"
              (click)="seleccionarTab('correo')">
              <lucide-angular name="mail" [size]="14"></lucide-angular>
              Validación de correo
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 transition-colors sm:flex-none"
              [class.bg-blue-600]="activeTab() === 'pagos'"
              [class.text-white]="activeTab() === 'pagos'"
              [class.text-slate-500]="activeTab() !== 'pagos'"
              (click)="seleccionarTab('pagos')">
              <lucide-angular name="badge-check" [size]="14"></lucide-angular>
              Validación de pagos
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 transition-colors sm:flex-none"
              [class.bg-blue-600]="activeTab() === 'historial'"
              [class.text-white]="activeTab() === 'historial'"
              [class.text-slate-500]="activeTab() !== 'historial'"
              (click)="seleccionarTab('historial')">
              <lucide-angular name="history" [size]="14"></lucide-angular>
              Historial
            </button>
          </nav>
          <button
            type="button"
            (click)="abrirSidenav()"
            class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-blue-300"
            aria-label="Abrir seguimiento">
            Seguimiento
          </button>
          </div>
        </div>

        @if (activeTab() === 'correo') {
          <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div class="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
                [class.bg-blue-600]="modoCorreo() === 'pendientes'"
                [class.text-white]="modoCorreo() === 'pendientes'"
                [class.text-slate-500]="modoCorreo() !== 'pendientes'"
                (click)="cambiarModoCorreo('pendientes')">
                <lucide-angular name="users" [size]="14"></lucide-angular>
                Pendientes
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
                [class.bg-blue-600]="modoCorreo() === 'rechazados'"
                [class.text-white]="modoCorreo() === 'rechazados'"
                [class.text-slate-500]="modoCorreo() !== 'rechazados'"
                (click)="cambiarModoCorreo('rechazados')">
                <lucide-angular name="alert-triangle" [size]="14"></lucide-angular>
                Requieren corrección ({{ clientesRechazados().length }})
              </button>
            </div>
            <span class="text-xs text-slate-500 dark:text-slate-400">
              {{ modoCorreo() === 'rechazados' ? 'Rechazados en Validación de pagos' : 'Clientes con pago cumplido' }}
            </span>
          </div>

          @if (modoCorreo() === 'pendientes') {
            <app-carta-no-adeudo-lista-widget
              [clientes]="clientes()"
              [page]="pagina()"
              [totalPages]="totalPaginas()"
              [totalElements]="totalCandidatos()"
              [todosSeleccionados]="todosCorreo()"
              [vistaPreviaUrl]="vistaPreviaUrl()"
              [cargandoVistaPrevia]="cargandoVistaPrevia()"
              [correoRemitente]="remitenteCorreo"
              [correoDestinatario]="clienteCorreo()?.correo ?? null"
              [correoAsunto]="correoAsuntoRender()"
              [correoCuerpoHtml]="correoSeguroHtml()"
              [correoAdjuntoNombre]="correoAdjuntoRender()"
              (buscar)="cargarCandidatos($event)"
              (cambiarPagina)="cambiarPagina($event)"
              (verVistaPrevia)="generarVistaPrevia($event)"
              (todosCambiaron)="cambiarTodosCorreo($event)"
              (enviarValidacionPagos)="enviarAValidacionPagos($event)">
              @if (clienteCorreo(); as cliente) {
                <section correoControls class="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                  <div class="flex items-center gap-2">
                    <lucide-angular name="mail" [size]="14" class="text-slate-400"></lucide-angular>
                    <span class="truncate text-sm font-semibold text-slate-800 dark:text-white">{{ cliente.nombreCliente }}</span>
                    <span class="text-xs text-slate-500">{{ cliente.documento }}</span>
                    @if (cliente.correo) {
                      <span class="ml-auto truncate rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">{{ cliente.correo }}</span>
                    }
                  </div>
                  <div class="mt-2 flex items-center gap-1.5">
                    <select
                      #selectorCorreo
                      class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      (change)="seleccionarCorreoPorValor(cliente, selectorCorreo.value)">
                      <option value="">Seleccionar correo</option>
                      @for (correo of correos(); track correo.id) {
                        <option [value]="correo.valor" [selected]="cliente.correo === correo.valor">{{ correo.valor }}</option>
                      }
                    </select>
                    <input
                      #nuevoCorreo
                      type="email"
                      placeholder="nuevo@correo.com"
                      class="min-w-0 flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700"
                      (input)="correoNuevo.set(nuevoCorreo.value.trim())" />
                    <button
                      type="button"
                      [disabled]="!correoValido()"
                      (click)="agregarCorreo(cliente)"
                      class="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">Agregar</button>
                  </div>
                </section>
              }
            </app-carta-no-adeudo-lista-widget>
          } @else {
            <app-carta-no-adeudo-lista-widget
              [clientes]="clientesRechazados()"
              [totalElements]="clientesRechazados().length"
              [todosSeleccionados]="todosRechazados()"
              [vistaPreviaUrl]="vistaPreviaUrl()"
              [cargandoVistaPrevia]="cargandoVistaPrevia()"
              [correoRemitente]="remitenteCorreo"
              [correoDestinatario]="clienteCorreo()?.correo ?? null"
              [correoAsunto]="correoAsuntoRender()"
              [correoCuerpoHtml]="correoSeguroHtml()"
              [correoAdjuntoNombre]="correoAdjuntoRender()"
              titulo="Clientes que requieren corrección"
              descripcion="Rechazados en Validación de pagos. Corrige el correo y reenvíalos."
              (verVistaPrevia)="generarVistaPrevia($event)"
              (todosCambiaron)="cambiarTodosRechazados($event)"
              (enviarValidacionPagos)="reenviarRechazadosAValidacionPagos($event)">
              @if (clienteCorreo(); as cliente) {
                <section correoControls class="mb-3 space-y-2">
                  <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
                    <div class="flex items-center gap-2">
                      <lucide-angular name="mail" [size]="14" class="text-slate-400"></lucide-angular>
                      <span class="truncate text-sm font-semibold text-slate-800 dark:text-white">{{ cliente.nombreCliente }}</span>
                      <span class="text-xs text-slate-500">{{ cliente.documento }}</span>
                      @if (cliente.correo) {
                        <span class="ml-auto truncate rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">{{ cliente.correo }}</span>
                      }
                    </div>
                    <div class="mt-2 flex items-center gap-1.5">
                      <select
                        #selectorCorreoRechazado
                        class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        (change)="seleccionarCorreoPorValor(cliente, selectorCorreoRechazado.value)">
                        <option value="">Seleccionar correo</option>
                        @for (correo of correos(); track correo.id) {
                          <option [value]="correo.valor" [selected]="cliente.correo === correo.valor">{{ correo.valor }}</option>
                        }
                      </select>
                      <input
                        #nuevoCorreoRechazado
                        type="email"
                        placeholder="nuevo@correo.com"
                        class="min-w-0 flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700"
                        (input)="correoNuevo.set(nuevoCorreoRechazado.value.trim())" />
                      <button
                        type="button"
                        [disabled]="!correoValido()"
                        (click)="agregarCorreo(cliente)"
                        class="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">Agregar</button>
                    </div>
                  </div>
                  <div class="rounded-lg border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-700/60 dark:bg-amber-900/20">
                    <h3 class="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Observaciones</h3>
                    <div class="mt-1.5 max-h-[9rem] space-y-1.5 overflow-y-auto pr-1">
                      @for (observacion of observacionesSeleccionadas(); track $index) {
                        <div class="rounded-md border border-amber-200 bg-white px-2 py-1.5 dark:border-amber-700/60 dark:bg-slate-800">
                          <p class="text-xs text-slate-700 dark:text-slate-200">{{ observacion.justificacion }}</p>
                          <p class="mt-0.5 text-[10px] text-slate-500">{{ observacion.fecha }}</p>
                        </div>
                      } @empty {
                        <p class="text-xs text-slate-500">Sin observaciones registradas.</p>
                      }
                    </div>
                  </div>
                </section>
              }
            </app-carta-no-adeudo-lista-widget>
          }
        }

        @if (activeTab() === 'pagos') {
          <div class="mb-3 inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-medium shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
              [class.bg-blue-600]="subTabPagos() === 'validacion'"
              [class.text-white]="subTabPagos() === 'validacion'"
              [class.text-slate-500]="subTabPagos() !== 'validacion'"
              (click)="cambiarSubTabPagos('validacion')">
              <lucide-angular name="badge-check" [size]="14"></lucide-angular>
              En validación ({{ totalPagos() }})
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors"
              [class.bg-blue-600]="subTabPagos() === 'fallidos'"
              [class.text-white]="subTabPagos() === 'fallidos'"
              [class.text-slate-500]="subTabPagos() !== 'fallidos'"
              (click)="cambiarSubTabPagos('fallidos')">
              <lucide-angular name="alert-triangle" [size]="14"></lucide-angular>
              Fallidos ({{ totalFallidos() }})
            </button>
          </div>

          @if (subTabPagos() === 'validacion') {
            <app-carta-no-adeudo-lista-widget
              [clientes]="clientesEnPagos()"
              [page]="paginaPagos()"
              [totalPages]="totalPaginasPagos()"
              [totalElements]="totalPagos()"
              [mostrarAccion]="false"
              [mostrarVistaDetalle]="false"
              [todosSeleccionados]="todosPagos()"
              titulo="Clientes en validación de pagos"
              descripcion="Selecciona un cliente para revisar pagos y gestiones."
              (verVistaPrevia)="cargarPagosCliente($event)"
              (cambiarPagina)="cargarValidacionPagos($event)"
              (todosCambiaron)="cambiarTodosPagos($event)"
              (seleccionadosCambiaron)="seleccionadosPagos.set($event)">
              @if (clientePagos(); as cliente) {
                <div detalleDerecho class="space-y-3">
                  <section class="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-900/40">
                    <div class="flex items-center justify-between gap-2">
                      <h2 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Rechazar solicitud</h2>
                      <span class="truncate text-[11px] text-slate-500">{{ cliente.nombreCliente }}</span>
                    </div>
                    <div class="mt-1.5 flex gap-1.5">
                      <textarea #justificacion rows="2" placeholder="Justificación del rechazo" maxlength="300" class="min-w-0 flex-1 resize-none rounded-lg border border-slate-200 p-1.5 text-xs outline-none focus:border-rose-500 dark:border-slate-600 dark:bg-slate-700" (input)="justificacionRechazo.set(justificacion.value.trim())"></textarea>
                      <button type="button" [disabled]="!cliente.idSolicitud || !justificacionRechazo()" (click)="rechazarCliente(cliente)" class="self-start rounded-lg bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-40">Rechazar</button>
                    </div>
                  </section>
                  <app-cliente-resumen-conciliacion-lectura
                    mode="inline"
                    [open]="true"
                    [loading]="cargandoResumenPagos()"
                    [error]="errorResumenPagos()"
                    [documento]="cliente.documento"
                    [resumen]="resumenPagos()"
                    [tenantId]="cliente.idTenant"
                    [carteraId]="cliente.idCartera"
                    [subcarteraId]="cliente.idSubcartera">
                  </app-cliente-resumen-conciliacion-lectura>
                  @if (observacionesDe(cliente); as observaciones) {
                    @if (observaciones.length > 0) {
                      <div class="rounded-lg border border-amber-200 bg-amber-50 p-2.5 dark:border-amber-700/60 dark:bg-amber-900/20">
                        <h3 class="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Historial de observaciones</h3>
                        <div class="mt-1.5 max-h-[9rem] space-y-1.5 overflow-y-auto pr-1">
                          @for (observacion of observaciones; track $index) {
                            <div class="rounded-md border border-amber-200 bg-white px-2 py-1.5 dark:border-amber-700/60 dark:bg-slate-800">
                              <p class="text-xs text-slate-700 dark:text-slate-200">{{ observacion.justificacion }}</p>
                              <p class="mt-0.5 text-[10px] text-slate-500">{{ observacion.fecha }}</p>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
              }
            </app-carta-no-adeudo-lista-widget>
            <footer class="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <input #correoPrueba type="email" placeholder="Correo para prueba" class="min-w-0 flex-1 bg-transparent px-1 py-1.5 text-xs outline-none" (input)="correoPruebaEnvio.set(correoPrueba.value.trim())" />
              <button type="button" [disabled]="!correoPruebaEnvio()" class="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40">Enviar prueba</button>
              <button type="button" (click)="abrirDialogoEnvio('pagos')" class="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Enviar</button>
            </footer>
          } @else {
            <app-carta-no-adeudo-lista-widget
              [clientes]="clientesEnFallidos()"
              [page]="paginaFallidos()"
              [totalPages]="totalPaginasFallidos()"
              [totalElements]="totalFallidos()"
              [mostrarAccion]="false"
              [todosSeleccionados]="todosFallidos()"
              titulo="Cartas con error de envío"
              descripcion="Selecciona las solicitudes para reintentar el envío."
              [vistaPreviaUrl]="vistaPreviaUrl()"
              [cargandoVistaPrevia]="cargandoVistaPrevia()"
              [correoRemitente]="remitenteCorreo"
              [correoDestinatario]="clienteCorreo()?.correo ?? null"
              [correoAsunto]="correoAsuntoRender()"
              [correoCuerpoHtml]="correoSeguroHtml()"
              [correoAdjuntoNombre]="correoAdjuntoRender()"
              (verVistaPrevia)="generarVistaPrevia($event)"
              (cambiarPagina)="cargarFallidos($event)"
              (todosCambiaron)="cambiarTodosFallidos($event)"
              (seleccionadosCambiaron)="seleccionadosFallidos.set($event)">
            </app-carta-no-adeudo-lista-widget>
            <footer class="mt-3 flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800">
              <p class="text-xs text-slate-600 dark:text-slate-300">
                {{ todosFallidos() ? totalFallidos() : seleccionadosFallidos().length }} solicitud{{ (todosFallidos() ? totalFallidos() : seleccionadosFallidos().length) === 1 ? '' : 'es' }} seleccionada{{ (todosFallidos() ? totalFallidos() : seleccionadosFallidos().length) === 1 ? '' : 's' }}
              </p>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                [disabled]="(todosFallidos() ? totalFallidos() : seleccionadosFallidos().length) === 0"
                (click)="abrirDialogoEnvio('fallidos')">
                <lucide-angular name="rotate-ccw" [size]="16"></lucide-angular>
                Reintentar envío
              </button>
            </footer>
          }
        }

        @if (activeTab() === 'historial') {
          <div class="mb-3 flex w-full max-w-md gap-2">
            <input
              #correoBusqueda
              type="search"
              placeholder="Buscar por correo"
              [value]="busquedaCorreoHistorial()"
              (input)="busquedaCorreoHistorial.set(correoBusqueda.value)"
              (keyup.enter)="buscarEnviadas(correoBusqueda.value)"
              class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
            <button
              type="button"
              (click)="buscarEnviadas(correoBusqueda.value)"
              class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700">
              <lucide-angular name="search" [size]="16"></lucide-angular>
            </button>
          </div>
          <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
                <thead class="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/40">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold">Documento</th>
                    <th class="px-4 py-3 text-left font-semibold">Cliente</th>
                    <th class="px-4 py-3 text-left font-semibold">Correo</th>
                    <th class="px-4 py-3 text-left font-semibold">Tipo</th>
                    <th class="px-4 py-3 text-left font-semibold">Fecha de envío</th>
                    <th class="px-4 py-3 text-right font-semibold">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  @for (enviada of enviadas(); track enviada.idSolicitud) {
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/40">
                      <td class="px-4 py-3 text-slate-700 dark:text-slate-200">{{ enviada.documento }}</td>
                      <td class="px-4 py-3 text-slate-700 dark:text-slate-200">{{ enviada.nombreCliente }}</td>
                      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ enviada.correoDestino }}</td>
                      <td class="px-4 py-3">
                        <span
                          class="rounded-full px-2 py-0.5 text-xs font-medium"
                          [class.bg-blue-100]="enviada.tipoSolicitud === 'ORIGINAL'"
                          [class.text-blue-700]="enviada.tipoSolicitud === 'ORIGINAL'"
                          [class.bg-amber-100]="enviada.tipoSolicitud === 'COPIA_PERDIDA'"
                          [class.text-amber-700]="enviada.tipoSolicitud === 'COPIA_PERDIDA'">
                          {{ enviada.tipoSolicitud === 'COPIA_PERDIDA' ? 'Copia' : 'Original' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-slate-600 dark:text-slate-300">{{ formatearFecha(enviada.fechaEnvio) }}</td>
                      <td class="px-4 py-3 text-right">
                        <button
                          type="button"
                          (click)="abrirDialogoCopia(enviada)"
                          class="inline-flex items-center gap-2 rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <lucide-angular name="copy" [size]="14"></lucide-angular>
                          Enviar copia
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="px-4 py-10 text-center text-sm text-slate-500">No hay cartas enviadas.</td></tr>
                  }
                </tbody>
              </table>
            </div>
            @if (totalPaginasEnviadas() > 1) {
              <div class="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">
                <span>Página {{ paginaEnviadas() + 1 }} de {{ totalPaginasEnviadas() }} ({{ totalEnviadas() }})</span>
                <div class="flex gap-2">
                  <button type="button" [disabled]="paginaEnviadas() === 0" (click)="listarEnviadas(paginaEnviadas() - 1)" class="rounded-md border border-slate-300 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600">Anterior</button>
                  <button type="button" [disabled]="paginaEnviadas() >= totalPaginasEnviadas() - 1" (click)="listarEnviadas(paginaEnviadas() + 1)" class="rounded-md border border-slate-300 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600">Siguiente</button>
                </div>
              </div>
            }
          </section>
        }

        @if (dialogEnvio()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" (click)="dialogEnvio.set(false)">
            <div class="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-slate-800" (click)="$event.stopPropagation()">
              <h2 class="text-base font-semibold text-slate-800 dark:text-white">Confirmar envío</h2>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Se enviarán {{ cantidadSeleccionada() }} correos.</p>
              <div class="mt-5 flex justify-end gap-2">
                <button type="button" class="rounded-lg px-3 py-2 text-sm text-slate-600 disabled:opacity-40 dark:text-slate-300" [disabled]="cargandoEnvio()" (click)="dialogEnvio.set(false)">Cancelar</button>
                <button type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40" [disabled]="cargandoEnvio()" (click)="confirmarEnvio()">
                  @if (cargandoEnvio()) {
                    <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Enviando...
                  } @else {
                    Aceptar
                  }
                </button>
              </div>
            </div>
          </div>
        }

        @if (dialogCopia()) {
          <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" (click)="cerrarDialogoCopia()">
            <div class="w-full max-w-md rounded-xl bg-white p-5 shadow-xl dark:bg-slate-800" (click)="$event.stopPropagation()">
              <h2 class="text-base font-semibold text-slate-800 dark:text-white">Enviar copia</h2>
              @if (copiaSolicitud(); as solicitud) {
                <p class="mt-1 text-xs text-slate-500">{{ solicitud.documento }} · {{ solicitud.nombreCliente }}</p>
              }
              <label class="mt-4 block text-xs font-medium text-slate-600 dark:text-slate-300">Correo destinatario</label>
              <input
                #correoCopiaInput
                type="email"
                [value]="correoCopia()"
                (input)="correoCopia.set(correoCopiaInput.value.trim())"
                placeholder="correo@destino.com"
                class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white" />
              <div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200">
                Verificar que haya realizado el pago a derecho a copia antes de enviar.
              </div>
              <div class="mt-5 flex justify-end gap-2">
                <button type="button" class="rounded-lg px-3 py-2 text-sm text-slate-600 disabled:opacity-40 dark:text-slate-300" [disabled]="enviandoCopia()" (click)="cerrarDialogoCopia()">Cancelar</button>
                <button type="button" class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-40" [disabled]="enviandoCopia() || !correoCopiaValido()" (click)="confirmarEnvioCopia()">
                  @if (enviandoCopia()) {
                    <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Enviando...
                  } @else {
                    Enviar
                  }
                </button>
              </div>
            </div>
          </div>
        }

        @if (sidenavAbierto()) {
          <div class="fixed inset-0 z-50 flex justify-end bg-slate-950/20" (click)="cerrarSidenav()">
            <aside class="flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:w-[440px] sm:max-w-[94vw]" (click)="$event.stopPropagation()">
              <header class="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <div>
                  <h2 class="text-sm font-semibold text-slate-800 dark:text-white">Seguimiento del cliente</h2>
                  <p class="text-[11px] text-slate-500">Recorrido de la carta de no adeudo</p>
                </div>
                <button type="button" (click)="cerrarSidenav()" class="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Cerrar seguimiento">
                  <lucide-angular name="x" [size]="16"></lucide-angular>
                </button>
              </header>

              <div class="border-b border-slate-200 p-3 dark:border-slate-700">
                <div class="flex gap-2">
                  <input
                    #documentoSeguimiento
                    type="search"
                    placeholder="Buscar por documento"
                    [value]="busquedaSeguimiento()"
                    (input)="busquedaSeguimiento.set(documentoSeguimiento.value)"
                    (keyup.enter)="buscarSeguimiento(documentoSeguimiento.value)"
                    class="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
                  <button type="button" (click)="buscarSeguimiento(documentoSeguimiento.value)" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700" aria-label="Buscar">
                    <lucide-angular name="search" [size]="16"></lucide-angular>
                  </button>
                </div>
              </div>

              <div class="flex-1 overflow-y-auto p-4">
                @if (cargandoSeguimiento()) {
                  <div class="flex flex-col items-center justify-center py-16 text-slate-500">
                    <div class="h-7 w-7 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    <p class="mt-3 text-sm">Buscando...</p>
                  </div>
                } @else if (errorSeguimiento()) {
                  <div class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300">{{ errorSeguimiento() }}</div>
                } @else if (seguimiento(); as data) {
                  @if (!data.encontrado || data.solicitudes.length === 0) {
                    <div class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                      No hay un proceso de carta de no adeudo para este cliente.
                    </div>
                  } @else {
                    <div class="mb-4">
                      <p class="text-sm font-semibold text-slate-800 dark:text-white">{{ data.nombreCliente || 'Cliente' }}</p>
                      <p class="text-xs text-slate-500">Documento: {{ data.documento }}</p>
                    </div>
                    @for (solicitud of data.solicitudes; track solicitud.idSolicitud) {
                      <div class="mb-4 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                        <div class="mb-3 flex items-center justify-between gap-2">
                          <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Solicitud #{{ solicitud.idSolicitud }}</p>
                          <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {{ solicitud.tipoSolicitud === 'COPIA_PERDIDA' ? 'Copia' : 'Original' }} · {{ solicitud.estado }}
                          </span>
                        </div>
                        <ol class="relative ml-1.5 border-l border-slate-200 dark:border-slate-700">
                          @for (evento of solicitud.eventos; track $index) {
                            <li class="relative mb-3 ml-4 last:mb-0">
                              <span
                                class="absolute -left-[22px] mt-1 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900"
                                [class.bg-blue-500]="tonoEvento(evento) === 'info'"
                                [class.bg-emerald-500]="tonoEvento(evento) === 'ok'"
                                [class.bg-rose-500]="tonoEvento(evento) === 'error'"
                                [class.bg-amber-500]="tonoEvento(evento) === 'warn'"></span>
                              <p class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ descripcionEvento(evento) }}</p>
                              <p class="text-[11px] text-slate-500">{{ formatearFecha(evento.fecha) }}</p>
                              @if (evento.detalle) {
                                <p class="mt-0.5 rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-500 dark:bg-slate-800">{{ evento.detalle }}</p>
                              }
                            </li>
                          } @empty {
                            <li class="ml-4 text-[11px] text-slate-500">Sin eventos registrados.</li>
                          }
                        </ol>
                      </div>
                    }
                  }
                } @else {
                  <div class="flex flex-col items-center justify-center py-16 text-center text-slate-400">
                    <lucide-angular name="package" [size]="32"></lucide-angular>
                    <p class="mt-2 text-sm">Busca un documento para ver su recorrido.</p>
                  </div>
                }
              </div>
            </aside>
          </div>
        }
      </div>
    </div>
  `
})
export class CartaNoAdeudoEmailPageComponent implements OnInit, OnDestroy {
  private readonly cartaNoAdeudoService = inject(CartaNoAdeudoService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly bcpPagosService = inject(BcpPagosService);

  readonly activeTab = signal<PestanaCarta>('correo');
  readonly subTabPagos = signal<SubTabPagos>('validacion');
  readonly clientes = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly pagina = signal(0);
  readonly totalPaginas = signal(0);
  readonly totalCandidatos = signal(0);
  readonly vistaPreviaUrl = signal<SafeResourceUrl | null>(null);
  readonly cargandoVistaPrevia = signal(false);
  readonly clientesEnPagos = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly paginaPagos = signal(0);
  readonly totalPaginasPagos = signal(0);
  readonly totalPagos = signal(0);
  readonly clientePagos = signal<CartaNoAdeudoClienteCorreo | null>(null);
  readonly resumenPagos = signal<ResumenConciliacionCliente | null>(null);
  readonly cargandoResumenPagos = signal(false);
  readonly errorResumenPagos = signal<string | null>(null);
  readonly seleccionadosPagos = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly correoPruebaEnvio = signal('');
  readonly dialogEnvio = signal(false);
  readonly origenEnvio = signal<OrigenEnvio>('pagos');
  readonly cargandoEnvio = signal(false);
  readonly modoCorreo = signal<'pendientes' | 'rechazados'>('pendientes');
  readonly todosCorreo = signal(false);
  readonly todosRechazados = signal(false);
  readonly todosPagos = signal(false);
  readonly todosFallidos = signal(false);
  readonly clientesRechazados = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly observacionesPorCliente = signal<Record<number, CartaNoAdeudoObservacion[]>>({});
  readonly justificacionRechazo = signal('');
  readonly clienteCorreo = signal<CartaNoAdeudoClienteCorreo | null>(null);
  readonly correos = signal<MetodoContactoCorreo[]>([]);
  readonly correoNuevo = signal('');
  readonly fallidos = signal<CartaNoAdeudoFallido[]>([]);
  readonly paginaFallidos = signal(0);
  readonly totalPaginasFallidos = signal(0);
  readonly totalFallidos = signal(0);
  readonly seleccionadosFallidos = signal<CartaNoAdeudoClienteCorreo[]>([]);
  readonly enviadas = signal<CartaNoAdeudoEnviada[]>([]);
  readonly paginaEnviadas = signal(0);
  readonly totalPaginasEnviadas = signal(0);
  readonly totalEnviadas = signal(0);
  readonly dialogCopia = signal(false);
  readonly enviandoCopia = signal(false);
  readonly copiaSolicitud = signal<CartaNoAdeudoEnviada | null>(null);
  readonly correoCopia = signal('');
  readonly busquedaCorreoHistorial = signal('');
  readonly sidenavAbierto = signal(false);
  readonly busquedaSeguimiento = signal('');
  readonly seguimiento = signal<CartaNoAdeudoSeguimiento | null>(null);
  readonly cargandoSeguimiento = signal(false);
  readonly errorSeguimiento = signal<string | null>(null);
  private documentoBusqueda?: string;
  private objectUrl?: string;
  private solicitudVistaPrevia = 0;
  private fallidosCargados = false;
  private enviadasCargadas = false;
  private pagosCargados = false;

  readonly clientesEnFallidos = computed<CartaNoAdeudoClienteCorreo[]>(() =>
    this.fallidos().map(fallido => ({
      idSolicitud: fallido.idSolicitud,
      idCliente: fallido.idCliente,
      idGestion: fallido.idGestion,
      idTenant: fallido.idTenant,
      idCartera: fallido.idCartera,
      idSubcartera: fallido.idSubcartera,
      documento: fallido.documento ?? '',
      nombreCliente: fallido.nombreCliente ?? '',
      correo: fallido.correoDestino,
      idMetodoContacto: null,
      montoPagado: 0,
      fechaUltimoPago: null
    }))
  );

  readonly remitenteCorreo = CARTA_NO_ADEUDO_REMITENTE;

  readonly correoSeguroHtml = computed<SafeHtml | null>(() => {
    const cliente = this.clienteCorreo();
    if (!cliente) {
      return null;
    }
    return this.sanitizer.bypassSecurityTrustHtml(renderPlantillaCorreo(CARTA_NO_ADEUDO_CUERPO, {
      nombre: cliente.nombreCliente,
      documento: cliente.documento
    }));
  });

  readonly correoAsuntoRender = computed(() =>
    renderPlantillaCorreo(CARTA_NO_ADEUDO_ASUNTO, {
      nombre: this.clienteCorreo()?.nombreCliente ?? '',
      documento: this.clienteCorreo()?.documento ?? ''
    })
  );

  readonly correoAdjuntoRender = computed(() => {
    const cliente = this.clienteCorreo();
    return cliente ? nombreAdjuntoCartaNoAdeudo(cliente.documento) : '';
  });

  readonly observacionesSeleccionadas = computed<CartaNoAdeudoObservacion[]>(() => {
    if (this.modoCorreo() !== 'rechazados') {
      return [];
    }
    const cliente = this.clienteCorreo();
    if (!cliente) {
      return [];
    }
    return this.observacionesPorCliente()[cliente.idCliente] ?? [];
  });

  ngOnInit(): void {
    this.cargarCandidatos();
  }

  cambiarModoCorreo(modo: 'pendientes' | 'rechazados'): void {
    if (this.modoCorreo() === modo) return;
    this.modoCorreo.set(modo);
    this.todosCorreo.set(false);
    this.todosRechazados.set(false);
    this.clienteCorreo.set(null);
    this.correos.set([]);
    this.limpiarVistaPrevia();
    this.vistaPreviaUrl.set(null);
    this.cargandoVistaPrevia.set(false);
  }

  cambiarTodosCorreo(checked: boolean): void {
    this.todosCorreo.set(checked);
  }

  cambiarTodosRechazados(checked: boolean): void {
    this.todosRechazados.set(checked);
  }

  cambiarTodosPagos(checked: boolean): void {
    this.todosPagos.set(checked);
    if (checked) {
      this.seleccionadosPagos.set([]);
    }
  }

  cambiarTodosFallidos(checked: boolean): void {
    this.todosFallidos.set(checked);
    if (checked) {
      this.seleccionadosFallidos.set([]);
    }
  }

  seleccionarCorreoPorValor(cliente: CartaNoAdeudoClienteCorreo, valor: string): void {
    const correo = this.correos().find(item => item.valor === valor);
    if (correo) {
      this.seleccionarCorreo(cliente, correo);
    }
  }

  seleccionarTab(tab: PestanaCarta): void {
    this.activeTab.set(tab);
    this.seleccionadosPagos.set([]);
    this.seleccionadosFallidos.set([]);
    if (tab === 'pagos' && !this.pagosCargados) {
      this.cargarValidacionPagos(0);
    }
    if (tab === 'historial' && !this.enviadasCargadas) {
      this.listarEnviadas(0);
    }
  }

  cambiarSubTabPagos(subTab: SubTabPagos): void {
    this.subTabPagos.set(subTab);
    this.seleccionadosPagos.set([]);
    this.seleccionadosFallidos.set([]);
    if (subTab === 'fallidos' && !this.fallidosCargados) {
      this.cargarFallidos(0);
    }
    if (subTab === 'validacion' && !this.pagosCargados) {
      this.cargarValidacionPagos(0);
    }
  }

  cargarValidacionPagos(page = 0): void {
    this.cartaNoAdeudoService.listarValidacionPagos(page, 20).subscribe({
      next: response => {
        this.clientesEnPagos.set(response.content.map(validacion => this.aClientePago(validacion)));
        this.paginaPagos.set(response.page);
        this.totalPaginasPagos.set(response.totalPages);
        this.totalPagos.set(response.totalElements);
        this.pagosCargados = true;
      },
      error: error => console.error('No se pudieron cargar los clientes en validación de pagos', error)
    });
  }

  private aClientePago(validacion: CartaNoAdeudoValidacionPago): CartaNoAdeudoClienteCorreo {
    return {
      idSolicitud: validacion.idSolicitud,
      idCliente: validacion.idCliente,
      idGestion: validacion.idGestion,
      idTenant: validacion.idTenant,
      idCartera: validacion.idCartera,
      idSubcartera: validacion.idSubcartera,
      documento: validacion.documento ?? '',
      nombreCliente: validacion.nombreCliente ?? '',
      correo: validacion.correoDestino,
      idMetodoContacto: validacion.idMetodoContactoDestino,
      montoPagado: 0,
      fechaUltimoPago: null
    };
  }

  cargarCandidatos(documento?: string, page = 0): void {
    this.documentoBusqueda = documento?.trim() || undefined;
    this.cartaNoAdeudoService.listarCandidatos(this.documentoBusqueda, page, 20).subscribe({
      next: response => {
        this.clientes.set(response.content.slice(0, 20));
        this.pagina.set(response.page);
        this.totalPaginas.set(response.totalPages);
        this.totalCandidatos.set(response.totalElements);
      },
      error: error => console.error('No se pudieron cargar candidatos para carta de no adeudo', error)
    });
  }

  cambiarPagina(page: number): void {
    this.cargarCandidatos(this.documentoBusqueda, page);
  }

  enviarAValidacionPagos(clientes: CartaNoAdeudoClienteCorreo[]): void {
    const fuente = this.todosCorreo() ? this.obtenerTodosLosCandidatos() : Promise.resolve(clientes);
    fuente.then(lista => {
      if (!lista.length) return;
      const solicitudes = lista.map(cliente => ({
        idCliente: cliente.idCliente,
        idGestion: cliente.idGestion,
        idTenant: cliente.idTenant,
        idCartera: cliente.idCartera,
        idSubcartera: cliente.idSubcartera,
        tipoSolicitud: 'ORIGINAL' as const,
        idMetodoContactoDestino: cliente.idMetodoContacto ?? undefined,
        correoDestino: cliente.correo ?? ''
      }));
      this.cartaNoAdeudoService.enviarAValidacionPagos(solicitudes).subscribe({
        next: () => {
          this.todosCorreo.set(false);
          this.cargarCandidatos(this.documentoBusqueda, this.pagina());
          this.pagosCargados = false;
          this.cargarValidacionPagos(0);
          this.activeTab.set('pagos');
        },
        error: error => console.error('No se pudieron enviar las cartas a validación de pagos', error)
      });
    });
  }

  private async obtenerTodosLosCandidatos(): Promise<CartaNoAdeudoClienteCorreo[]> {
    const primera = await firstValueFrom(this.cartaNoAdeudoService.listarCandidatos(this.documentoBusqueda, 0, 100));
    const items = [...primera.content];
    for (let page = 1; page < primera.totalPages; page++) {
      const response = await firstValueFrom(this.cartaNoAdeudoService.listarCandidatos(this.documentoBusqueda, page, 100));
      items.push(...response.content);
    }
    return items;
  }

  cargarPagosCliente(cliente: CartaNoAdeudoClienteCorreo): void {
    this.clientePagos.set(cliente);
    this.resumenPagos.set(null);
    this.errorResumenPagos.set(null);
    this.cargandoResumenPagos.set(true);
    this.bcpPagosService.obtenerResumenConciliacionCliente(cliente.documento, {
      tenantId: cliente.idTenant,
      carteraId: cliente.idCartera,
      subcarteraId: cliente.idSubcartera
    }).subscribe({
      next: resumen => {
        this.resumenPagos.set(resumen);
        this.cargandoResumenPagos.set(false);
      },
      error: error => {
        this.cargandoResumenPagos.set(false);
        this.errorResumenPagos.set(
          error?.error?.mensaje || error?.error?.message || 'No se pudo cargar el resumen del cliente');
        console.error('No se pudo cargar el resumen de pagos del cliente', error);
      }
    });
  }

  rechazarCliente(cliente: CartaNoAdeudoClienteCorreo): void {
    if (!cliente.idSolicitud || !this.justificacionRechazo()) return;
    const justificacion = this.justificacionRechazo();
    this.cartaNoAdeudoService.rechazarSolicitud(cliente.idSolicitud, justificacion).subscribe({
      next: () => {
        this.clientesEnPagos.update(clientes => clientes.filter(item => item.idSolicitud !== cliente.idSolicitud));
        this.registrarRechazado(cliente, justificacion);
        this.clientePagos.set(null);
        this.resumenPagos.set(null);
        this.justificacionRechazo.set('');
      },
      error: error => console.error('No se pudo rechazar la solicitud', error)
    });
  }

  private registrarRechazado(cliente: CartaNoAdeudoClienteCorreo, justificacion: string): void {
    const observacion: CartaNoAdeudoObservacion = {
      justificacion,
      fecha: new Date().toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
    };
    this.observacionesPorCliente.update(mapa => ({
      ...mapa,
      [cliente.idCliente]: [...(mapa[cliente.idCliente] ?? []), observacion]
    }));
    this.clientesRechazados.update(lista => {
      const existe = lista.some(item => item.idCliente === cliente.idCliente);
      return existe
        ? lista.map(item => item.idCliente === cliente.idCliente ? { ...item, ...cliente } : item)
        : [...lista, { ...cliente }];
    });
  }

  reenviarRechazadosAValidacionPagos(clientes: CartaNoAdeudoClienteCorreo[]): void {
    const seleccion = this.todosRechazados() ? this.clientesRechazados() : clientes;
    const reenvios: ReenviarCartaNoAdeudoItem[] = seleccion
      .filter(cliente => typeof cliente.idSolicitud === 'number')
      .map(cliente => ({
        idSolicitud: cliente.idSolicitud as number,
        correoDestino: cliente.correo,
        idMetodoContactoDestino: cliente.idMetodoContacto
      }));
    if (!reenvios.length) return;

    this.cartaNoAdeudoService.reenviarAValidacionPagos(reenvios).subscribe({
      next: () => {
        const reenviados = new Set(reenvios.map(reenvio => reenvio.idSolicitud));
        this.clientesRechazados.update(lista => lista.filter(item => !(item.idSolicitud && reenviados.has(item.idSolicitud))));
        this.todosRechazados.set(false);
        this.clienteCorreo.set(null);
        this.modoCorreo.set('pendientes');
        this.pagosCargados = false;
        this.cargarValidacionPagos(0);
        this.activeTab.set('pagos');
      },
      error: error => console.error('No se pudieron reenviar las solicitudes a validación de pagos', error)
    });
  }

  cargarFallidos(page = 0): void {
    this.cartaNoAdeudoService.listarFallidos(page, 20).subscribe({
      next: response => {
        this.fallidos.set(response.content);
        this.paginaFallidos.set(response.page);
        this.totalPaginasFallidos.set(response.totalPages);
        this.totalFallidos.set(response.totalElements);
        this.fallidosCargados = true;
      },
      error: error => console.error('No se pudieron cargar las cartas fallidas', error)
    });
  }

  listarEnviadas(page = 0): void {
    this.cartaNoAdeudoService.listarEnviadas(page, 20, this.busquedaCorreoHistorial()).subscribe({
      next: response => {
        this.enviadas.set(response.content);
        this.paginaEnviadas.set(response.page);
        this.totalPaginasEnviadas.set(response.totalPages);
        this.totalEnviadas.set(response.totalElements);
        this.enviadasCargadas = true;
      },
      error: error => console.error('No se pudieron cargar las cartas enviadas', error)
    });
  }

  buscarEnviadas(correo: string): void {
    this.busquedaCorreoHistorial.set(correo.trim());
    this.listarEnviadas(0);
  }

  observacionesDe(cliente: CartaNoAdeudoClienteCorreo): CartaNoAdeudoObservacion[] {
    return this.observacionesPorCliente()[cliente.idCliente] ?? [];
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '';
    const valor = new Date(fecha);
    return Number.isNaN(valor.getTime())
      ? fecha
      : valor.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
  }

  abrirSidenav(): void {
    this.sidenavAbierto.set(true);
  }

  cerrarSidenav(): void {
    this.sidenavAbierto.set(false);
  }

  buscarSeguimiento(termino: string): void {
    const documento = termino.trim();
    this.busquedaSeguimiento.set(documento);
    if (!documento) {
      this.seguimiento.set(null);
      this.errorSeguimiento.set(null);
      return;
    }
    this.cargandoSeguimiento.set(true);
    this.errorSeguimiento.set(null);
    this.cartaNoAdeudoService.obtenerSeguimiento(documento).subscribe({
      next: seguimiento => {
        this.seguimiento.set(seguimiento);
        this.cargandoSeguimiento.set(false);
      },
      error: error => {
        this.cargandoSeguimiento.set(false);
        this.seguimiento.set(null);
        this.errorSeguimiento.set(
          error?.error?.mensaje || error?.error?.message || 'No se pudo obtener el seguimiento del cliente');
        console.error('No se pudo obtener el seguimiento del cliente', error);
      }
    });
  }

  descripcionEvento(evento: CartaNoAdeudoSeguimientoEvento): string {
    switch (evento.tipoEvento) {
      case 'SOLICITUD_CREADA':
        return 'Solicitud creada';
      case 'ENVIADA_A_VALIDACION_PAGOS':
        return 'Enviada a Validación de pagos';
      case 'RECHAZADA_EN_VALIDACION_PAGOS':
      case 'RECHAZO_EN_VALIDACION_PAGOS':
        return 'Rechazada en Validación de pagos — regresa a Validación de correo';
      case 'REENVIADA_A_VALIDACION_PAGOS':
        return 'Reenviada a Validación de pagos';
      case 'COPIA_CREADA':
        return 'Copia generada';
      case 'ENVIO_INICIADO':
        return evento.numeroIntento ? `Envío iniciado (intento ${evento.numeroIntento})` : 'Envío iniciado';
      case 'ENVIO_EXITOSO':
        return 'Carta enviada';
      case 'ENVIO_FALLIDO':
        return 'Error al enviar la carta';
      default:
        return evento.tipoEvento;
    }
  }

  tonoEvento(evento: CartaNoAdeudoSeguimientoEvento): 'info' | 'ok' | 'warn' | 'error' {
    switch (evento.tipoEvento) {
      case 'ENVIO_EXITOSO':
        return 'ok';
      case 'ENVIO_FALLIDO':
        return 'error';
      case 'RECHAZADA_EN_VALIDACION_PAGOS':
      case 'RECHAZO_EN_VALIDACION_PAGOS':
        return 'warn';
      default:
        return 'info';
    }
  }

  abrirDialogoCopia(enviada: CartaNoAdeudoEnviada): void {
    this.copiaSolicitud.set(enviada);
    this.correoCopia.set(enviada.correoDestino ?? '');
    this.dialogCopia.set(true);
  }

  cerrarDialogoCopia(): void {
    if (this.enviandoCopia()) return;
    this.dialogCopia.set(false);
    this.copiaSolicitud.set(null);
    this.correoCopia.set('');
  }

  correoCopiaValido(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoCopia());
  }

  confirmarEnvioCopia(): void {
    const solicitud = this.copiaSolicitud();
    if (!solicitud || !this.correoCopiaValido() || this.enviandoCopia()) return;

    this.enviandoCopia.set(true);
    this.cartaNoAdeudoService
      .enviarCopia(solicitud.idSolicitud, this.correoCopia(), CARTA_NO_ADEUDO_ASUNTO, CARTA_NO_ADEUDO_CUERPO)
      .subscribe({
        next: response => {
          this.enviandoCopia.set(false);
          if (response.fallidas > 0) {
            console.error('No se pudo enviar la copia', response.resultados);
            return;
          }
          this.cerrarDialogoCopia();
          this.enviadasCargadas = false;
          this.listarEnviadas(0);
        },
        error: error => {
          this.enviandoCopia.set(false);
          console.error('No se pudo enviar la copia', error);
        }
      });
  }

  abrirDialogoEnvio(origen: OrigenEnvio): void {
    if (this.cantidadSeleccion(origen) === 0) return;
    this.origenEnvio.set(origen);
    this.dialogEnvio.set(true);
  }

  cantidadSeleccionada(): number {
    return this.cantidadSeleccion(this.origenEnvio());
  }

  private cantidadSeleccion(origen: OrigenEnvio): number {
    if (origen === 'fallidos') {
      return this.todosFallidos() ? this.totalFallidos() : this.seleccionadosFallidos().length;
    }
    return this.todosPagos() ? this.totalPagos() : this.seleccionadosPagos().length;
  }

  confirmarEnvio(): void {
    const origen = this.origenEnvio();
    if (this.cargandoEnvio()) return;

    const todos = origen === 'fallidos' ? this.todosFallidos() : this.todosPagos();
    const idsPromise: Promise<number[]> = todos
      ? (origen === 'fallidos' ? this.idsTodosFallidos() : this.idsTodosPagos())
      : Promise.resolve(this.seleccionActual(origen)
          .map(cliente => cliente.idSolicitud)
          .filter((id): id is number => typeof id === 'number'));

    idsPromise.then(ids => {
      if (!ids.length) return;
      this.cargandoEnvio.set(true);
      this.cartaNoAdeudoService.enviarSolicitudes(ids, CARTA_NO_ADEUDO_ASUNTO, CARTA_NO_ADEUDO_CUERPO).subscribe({
        next: response => {
          this.cargandoEnvio.set(false);
          this.dialogEnvio.set(false);
          const enviadas = new Set(response.resultados.filter(resultado => resultado.exito).map(resultado => resultado.idSolicitud));
          if (origen === 'pagos') {
            this.clientesEnPagos.update(clientes => clientes.filter(cliente => !(cliente.idSolicitud && enviadas.has(cliente.idSolicitud))));
            this.seleccionadosPagos.set([]);
            this.pagosCargados = false;
            if (todos) this.cargarValidacionPagos(this.paginaPagos());
          } else {
            this.fallidos.update(fallidos => fallidos.filter(fallido => !enviadas.has(fallido.idSolicitud)));
            this.seleccionadosFallidos.set([]);
            if (todos) {
              this.fallidosCargados = false;
              this.cargarFallidos(this.paginaFallidos());
            }
          }
          this.todosPagos.set(false);
          this.todosFallidos.set(false);
          if (response.fallidas > 0) {
            this.fallidosCargados = false;
            this.cargarFallidos(0);
          }
          if (response.enviadas > 0) {
            this.enviadasCargadas = false;
          }
        },
        error: error => {
          this.cargandoEnvio.set(false);
          console.error('No se pudieron enviar las cartas de no adeudo', error);
        }
      });
    });
  }

  private async idsTodosPagos(): Promise<number[]> {
    const ids: number[] = [];
    let page = 0;
    let totalPages = 1;
    do {
      const response = await firstValueFrom(this.cartaNoAdeudoService.listarValidacionPagos(page, 100));
      response.content.forEach(item => ids.push(item.idSolicitud));
      totalPages = response.totalPages;
      page++;
    } while (page < totalPages);
    return ids;
  }

  private async idsTodosFallidos(): Promise<number[]> {
    const ids: number[] = [];
    let page = 0;
    let totalPages = 1;
    do {
      const response = await firstValueFrom(this.cartaNoAdeudoService.listarFallidos(page, 100));
      response.content.forEach(item => ids.push(item.idSolicitud));
      totalPages = response.totalPages;
      page++;
    } while (page < totalPages);
    return ids;
  }

  private seleccionActual(origen: OrigenEnvio): CartaNoAdeudoClienteCorreo[] {
    return origen === 'fallidos' ? this.seleccionadosFallidos() : this.seleccionadosPagos();
  }

  generarVistaPrevia(cliente: CartaNoAdeudoClienteCorreo): void {
    this.clienteCorreo.set(cliente);
    this.cargarCorreos(cliente);
    const solicitudActual = ++this.solicitudVistaPrevia;
    this.cargandoVistaPrevia.set(true);
    this.limpiarVistaPrevia();
    this.vistaPreviaUrl.set(null);
    this.cartaNoAdeudoService.generarVistaPrevia(cliente).subscribe({
      next: pdf => {
        if (solicitudActual !== this.solicitudVistaPrevia) {
          return;
        }
        this.objectUrl = URL.createObjectURL(pdf);
        this.vistaPreviaUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl));
        this.cargandoVistaPrevia.set(false);
      },
      error: error => {
        if (solicitudActual !== this.solicitudVistaPrevia) {
          return;
        }
        this.cargandoVistaPrevia.set(false);
        console.error('No se pudo generar la vista previa de la carta', error);
      }
    });
  }

  correoValido(): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.correoNuevo()); }
  cargarCorreos(cliente: CartaNoAdeudoClienteCorreo): void { this.cartaNoAdeudoService.listarCorreos(cliente).subscribe({ next: pagina => this.correos.set(pagina.content), error: error => console.error('No se pudieron cargar correos', error) }); }
  seleccionarCorreo(cliente: CartaNoAdeudoClienteCorreo, correo: MetodoContactoCorreo): void {
    const actualizado = { ...cliente, correo: correo.valor, idMetodoContacto: correo.id };
    this.clienteCorreo.set(actualizado);
    this.clientes.update(clientes => clientes.map(item => item.idCliente === cliente.idCliente ? actualizado : item));
    this.clientesRechazados.update(lista => lista.map(item => item.idCliente === cliente.idCliente ? { ...item, ...actualizado } : item));
  }
  agregarCorreo(cliente: CartaNoAdeudoClienteCorreo): void { if (!this.correoValido()) return; this.cartaNoAdeudoService.agregarCorreo(cliente, this.correoNuevo()).subscribe({ next: correo => { this.seleccionarCorreo(cliente, correo); this.correoNuevo.set(''); this.cargarCorreos(cliente); }, error: error => console.error('No se pudo agregar correo', error) }); }

  ngOnDestroy(): void {
    this.solicitudVistaPrevia++;
    this.limpiarVistaPrevia();
  }

  private limpiarVistaPrevia(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }
}
