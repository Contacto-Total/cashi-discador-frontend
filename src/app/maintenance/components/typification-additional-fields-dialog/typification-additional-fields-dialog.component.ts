import { Component, effect, inject, input, output, signal, computed, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { A11yModule } from '@angular/cdk/a11y';
import {
  AutorizadorExcepcion, CampoOpcionDTO, ConfigurarOpcionesCampoRequest, FieldTypeV2, FilaReglaDescuento, ReglaDescuento,
  RestriccionFecha, TipoLimiteDescuento
} from '../../models/typification-v2.model';
import { TypificationV2Service } from '../../services/typification-v2.service';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment';
import { TUI, TUI_ANIM, tuiSwitch, tuiPerilla } from '../typification-ui';
import { AutorizadoresExcepcionDialogComponent, ContextoAutorizadores } from './autorizadores-excepcion-dialog.component';

interface ConfiguracionCabecera {
  codigo: string;
  nombre: string;
  tipoDato: string;
  tipoSql: string;
}

/** Subcartera de la pantalla de Tipificaciones, con su cliente y su cartera. */
export interface SubcarteraMontos {
  tenantId: number;
  cliente: string;
  portfolioId: number;
  cartera: string;
  subId: number;
  subcartera: string;
}

/** Cómo se pueden separar los clientes de la subcartera (GET /v2/descuento-maximo/segmentacion). */
interface Segmentacion {
  antiguaNueva: boolean;
  aniosCastigo: string[];
  conMoneda: boolean;
}

type OpcionVista = CampoOpcionDTO & { visualName: string };

const SIN_SEGMENTACION: Segmentacion = { antiguaNueva: false, aniosCastigo: [], conMoneda: false };
// El campo va dentro de la caja: transparente, sin borde ni sombra y a su altura interior. Los `!` le ganan
// a las reglas globales de styles.css (body.light-theme input y body.dark-theme input:focus), que lo
// pintaban crema encima de la caja blanca y tapaban sus bordes.
const NUM_INPUT = 'h-full w-full min-w-0 border-0! bg-transparent! p-0! shadow-none! text-[12.5px] font-semibold tabular-nums text-[#0f172a]! outline-none placeholder:font-medium placeholder:text-[#8491a3] dark:text-slate-100! dark:placeholder:text-slate-500';
const NUM_CAJA = 'flex h-[30px] items-center gap-1.5 rounded-lg border border-[#d5dbe3] bg-white px-2 focus-within:border-[#2563eb] dark:border-slate-700 dark:bg-slate-900';

@Component({
  selector: 'app-typification-additional-fields-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule, AutorizadoresExcepcionDialogComponent],
  template: `
    <div [class]="ui.fondo" (click)="handleCancel()">
      <div [class]="ui.panel + ' max-w-[980px]'" role="dialog" aria-modal="true" aria-labelledby="mf-titulo"
           cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
           (click)="$event.stopPropagation()" (keydown.escape)="handleCancel()">

        <!-- Cabecera -->
        <div [class]="ui.cabecera">
          <div class="min-w-0">
            <h2 id="mf-titulo" [class]="ui.titulo">Configurar montos</h2>
            <p [class]="ui.subtitulo">
              <b class="font-bold text-[#334155] dark:text-slate-200">{{ typificationName() }}</b>
              · qué montos puede ofrecer el asesor y con qué reglas
            </p>
          </div>
          <button type="button" (click)="handleCancel()" [class]="ui.iconBtn" aria-label="Cerrar">
            <lucide-angular name="x" [size]="17"></lucide-angular>
          </button>
        </div>

        <!-- Cuerpo -->
        <div [class]="ui.cuerpo">
          @if (sinCronograma()) {
            <!-- Antes este caso decía "No se encontraron campos numéricos" y el diálogo
                 quedaba reintentando cada medio segundo, incluso después de cerrarse -->
            <div class="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <lucide-angular name="inbox" [size]="36" class="text-[#c5ccd6]"></lucide-angular>
              <p class="text-[13px] font-bold text-[#334155] dark:text-slate-200">Esta tipificación no registra promesas de pago</p>
              <p class="max-w-[440px] text-[12.5px] leading-[1.5] text-[#5f6c80] dark:text-slate-400">
                Los montos se configuran en las tipificaciones que tienen un campo de cronograma de pagos.
                Se agrega desde «Editar en el catálogo», en «Campos de la tipificación».
              </p>
            </div>
          } @else {
            <!-- Cliente, cartera y subcartera: vienen del filtro maestro de la pantalla y aquí no se cambian -->
            <div class="flex flex-wrap items-end justify-between gap-2.5">
              <div class="flex flex-wrap items-end gap-2.5">
                @for (f of encabezado(); track f.etiqueta) {
                  <div class="flex flex-col gap-1.5">
                    <span [class]="ui.label">{{ f.etiqueta }}</span>
                    <span class="flex h-[38px] items-center rounded-lg border border-[#e6e9ee] bg-[#f8fafc] px-3 text-[13px] font-semibold text-[#334155] dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                      {{ f.valor || '—' }}
                    </span>
                  </div>
                }
              </div>
              @if (opciones().length > 0) {
                <div class="flex flex-wrap items-center gap-3">
                  <span class="text-[12px] text-[#5f6c80] dark:text-slate-400">
                    <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ getOpcionesHabilitadasCount() }}</b> de
                    <b class="font-bold tabular-nums text-[#0f172a] dark:text-slate-100">{{ opciones().length }}</b> montos habilitados
                  </span>
                  <button type="button" (click)="abrirAutorizadores('lista')" [class]="ui.secundario">
                    <lucide-angular name="user-check" [size]="16"></lucide-angular>
                    Autorizadores
                    <span [class]="ui.chipGris + ' tabular-nums'">{{ autorizadoresActivos().length }}</span>
                  </button>
                </div>
              }
            </div>

            @if (!selectedSubPortfolioId()) {
              <div class="flex flex-col items-center gap-2 px-4 py-10 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">
                <lucide-angular name="inbox" [size]="36" class="text-[#c5ccd6]"></lucide-angular>
                <span>Elige una subcartera en el filtro de la pantalla para ver sus montos</span>
              </div>
            } @else if (loadingOpciones() || cargandoCampos()) {
              <div class="flex animate-pulse flex-col gap-2.5 motion-reduce:animate-none" role="status">
                <span class="sr-only">Cargando montos…</span>
                @for (n of esqueleto; track n) {
                  <div class="h-[52px] rounded-xl border border-[#e6e9ee] bg-[#f8fafc] dark:border-slate-800 dark:bg-slate-800/60"></div>
                }
              </div>
            } @else if (errorMessage()) {
              <div class="flex flex-col items-center gap-2.5 px-4 py-10 text-center" role="alert">
                <lucide-angular name="alert-circle" [size]="32" class="text-[#b91c1c]"></lucide-angular>
                <p class="text-[13px] text-[#b91c1c] dark:text-red-300">{{ errorMessage() }}</p>
                <button type="button" (click)="retryLoadOpciones()" [class]="ui.secundario">Reintentar</button>
              </div>
            } @else if (opcionesConNombres().length === 0) {
              <div class="flex flex-col items-center gap-2 px-4 py-10 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">
                <lucide-angular name="inbox" [size]="36" class="text-[#c5ccd6]"></lucide-angular>
                <span>No se encontraron campos numéricos en esta subcartera</span>
              </div>
            } @else {
              <div class="flex flex-col gap-2.5">
                @for (opcion of opcionesConNombres(); track opcion.codigoOpcion) {
                  <div [class]="'flex flex-col rounded-xl border bg-white transition-colors duration-150 dark:bg-slate-900 '
                                + (opcion.estaHabilitada ? 'border-[#c5ccd6] dark:border-slate-600' : 'border-[#e6e9ee] dark:border-slate-800')">

                    <!-- Interruptor y nombre -->
                    <div class="flex min-h-[52px] items-center gap-2.5 px-3 py-2">
                      <button type="button" role="switch" (click)="toggleOpcionOriginal(opcion)"
                              [attr.aria-checked]="opcion.estaHabilitada"
                              [attr.aria-label]="(opcion.estaHabilitada ? 'Deshabilitar ' : 'Habilitar ') + opcion.visualName"
                              [class]="sw(opcion.estaHabilitada)">
                        <span [class]="perilla(opcion.estaHabilitada)"></span>
                      </button>
                      <div class="flex min-w-0 flex-1 flex-col">
                        <span [class]="'truncate text-[12.5px] font-bold leading-[1.35] tracking-[-0.01em] '
                                       + (opcion.estaHabilitada ? 'text-[#0f172a] dark:text-slate-100' : 'text-[#5f6c80] dark:text-slate-400')">{{ opcion.visualName }}</span>
                        @if (opcion.codigoOpcion !== 'personalizado' && opcion.campoTablaDinamica) {
                          <span class="truncate text-[12px] leading-[1.35] text-[#5f6c80] dark:text-slate-400">{{ opcion.campoTablaDinamica }}</span>
                        }
                      </div>
                      @if (opcion.codigoOpcion === 'personalizado') {
                        <span [class]="ui.chipVioleta">Siempre a evaluación</span>
                      } @else if (opcion.estaHabilitada) {
                        <span [class]="resumenPendiente(opcion) ? ui.chipAmbar : ui.chipGris">{{ resumen(opcion) }}</span>
                      }
                    </div>

                    <!-- Reglas: solo si el monto está habilitado -->
                    @if (opcion.estaHabilitada) {
                      <div class="tui-entra flex flex-col gap-3.5 border-t border-[#eef1f5] p-3 dark:border-slate-800">
                        <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          <div class="flex flex-col gap-1.5">
                            <span [class]="ui.label">Fecha de pago</span>
                            <select [ngModel]="opcion.restriccionFecha || 'SIN_RESTRICCION'"
                                    (ngModelChange)="onRestriccionFechaChange(opcion.codigoOpcion, $event)"
                                    [attr.aria-label]="'Restricción de fecha de ' + opcion.visualName"
                                    [class]="ui.inputSm + ' w-full'">
                              <option value="SIN_RESTRICCION">Sin restricción</option>
                              <option value="DENTRO_MES">Solo dentro del mes actual</option>
                              <option value="FUERA_MES">Solo fuera del mes</option>
                            </select>
                          </div>
                          <div class="flex flex-col gap-1.5">
                            <span [class]="ui.label">Cuotas permitidas</span>
                            <!-- Lo que se guarda es un mínimo y un máximo: antes eran 48 botones -->
                            <div class="flex items-center gap-1.5 text-[12.5px] text-[#334155] dark:text-slate-300">
                              <span>De</span>
                              <input type="number" min="1" max="48" [value]="opcion.minCuotas || 1"
                                     (change)="onMinCuotasChange(opcion.codigoOpcion, $event)"
                                     [attr.aria-label]="'Mínimo de cuotas de ' + opcion.visualName"
                                     [class]="ui.inputSm + ' w-[58px] tabular-nums'"/>
                              <span>a</span>
                              <input type="number" min="1" max="48" [value]="opcion.maxCuotas || 6"
                                     (change)="onMaxCuotasChange(opcion.codigoOpcion, $event)"
                                     [attr.aria-label]="'Máximo de cuotas de ' + opcion.visualName"
                                     [class]="ui.inputSm + ' w-[58px] tabular-nums'"/>
                            </div>
                          </div>
                          <div class="flex flex-col gap-1.5">
                            <span [class]="ui.label">Genera carta de acuerdo</span>
                            <div class="flex h-[34px] items-center">
                              <button type="button" role="switch" (click)="alternarCarta(opcion.codigoOpcion)"
                                      [attr.aria-checked]="!!opcion.generaCartaAcuerdo"
                                      [attr.aria-label]="'Genera carta de acuerdo: ' + opcion.visualName"
                                      [class]="sw(!!opcion.generaCartaAcuerdo)">
                                <span [class]="perilla(!!opcion.generaCartaAcuerdo)"></span>
                              </button>
                            </div>
                          </div>
                        </div>

                        @if (opcion.codigoOpcion !== 'personalizado') {
                          <!-- Sobrepago máximo en soles: Personalizado no lo tiene porque ya es monto libre -->
                          <div class="flex flex-col gap-1.5">
                            <label [for]="'mf-tope-' + opcion.codigoOpcion"
                                   class="text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">Sobrepago máximo</label>
                            <div class="flex items-center gap-1.5">
                              <span class="text-[12.5px] font-semibold text-[#5f6c80] dark:text-slate-400">S/</span>
                              <input type="number" min="0" step="1" placeholder="Sin tope"
                                     [id]="'mf-tope-' + opcion.codigoOpcion"
                                     [value]="opcion.topeSobrepagoSoles ?? ''"
                                     (input)="onTopeSobrepagoChange(opcion.codigoOpcion, $event)"
                                     [class]="ui.inputSm + ' w-[120px] tabular-nums'"/>
                            </div>
                            <span [class]="ui.ayuda">
                              @if (opcion.topeSobrepagoSoles != null) {
                                Si la promesa sube hasta S/ {{ opcion.topeSobrepagoSoles }} sobre este monto, se guarda como sobrepago. Si sube más, es monto libre y pasa a evaluación.
                              } @else {
                                Sin tope: si el asesor sube el monto, siempre se guarda como sobrepago.
                              }
                            </span>
                          </div>

                          <!-- Descuento máximo sin aprobación -->
                          @let regla = reglaDe(opcion);
                          <div class="flex flex-col gap-3 rounded-[10px] border border-[#e6e9ee] bg-[#f8fafc] p-3 dark:border-slate-700 dark:bg-slate-800/40">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                              <span class="text-[12.5px] font-bold text-[#0f172a] dark:text-slate-100">Descuento máximo sin aprobación</span>
                              <div class="inline-flex rounded-lg border border-[#d5dbe3] bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900"
                                   role="group" [attr.aria-label]="'Tipo de límite de ' + opcion.visualName">
                                @for (t of tipos; track t.valor) {
                                  <button type="button" [attr.aria-pressed]="regla.tipo === t.valor"
                                          (click)="onTipoChange(opcion.codigoOpcion, t.valor)"
                                          [class]="'h-7 rounded-md px-3 text-[12px] font-bold transition-colors duration-150 '
                                                   + (regla.tipo === t.valor
                                                      ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
                                                      : 'text-[#5f6c80] hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-slate-100')">
                                    {{ t.texto }}
                                  </button>
                                }
                              </div>
                            </div>

                            <div class="flex flex-wrap items-end gap-x-5 gap-y-2.5">
                              <div class="flex min-w-[260px] max-w-[420px] flex-1 flex-col gap-1.5">
                                <label [for]="'mf-ref-' + opcion.codigoOpcion" [class]="ui.label">Descuento calculado sobre</label>
                                <select [id]="'mf-ref-' + opcion.codigoOpcion" [ngModel]="regla.campoReferencia"
                                        (ngModelChange)="onReferenciaChange(opcion.codigoOpcion, $event)"
                                        [class]="ui.inputSm + ' w-full'">
                                  <option [ngValue]="null">El monto de esta tarjeta ({{ opcion.visualName }})</option>
                                  @for (r of referencias(opcion); track r.campo) {
                                    <option [ngValue]="r.campo">{{ r.nombre }} del cliente</option>
                                  }
                                </select>
                              </div>
                              @if (segmentacion().aniosCastigo.length > 0) {
                                <label class="flex h-[34px] cursor-pointer items-center gap-2 text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">
                                  <input type="checkbox" class="h-4 w-4 cursor-pointer accent-[#2563eb]"
                                         [checked]="regla.segmento === 'ANIO'"
                                         (change)="onPorAnioChange(opcion.codigoOpcion, $event)"/>
                                  Límite distinto por año de castigo
                                </label>
                              }
                            </div>

                            <div class="overflow-x-auto">
                              <table class="w-full min-w-[520px] border-separate border-spacing-0 text-left">
                                <thead>
                                  <tr>
                                    @if (regla.segmento === 'ANTIGUA_NUEVA') {
                                      <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Cartera</th>
                                    } @else if (regla.segmento === 'ANIO') {
                                      <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Año de castigo</th>
                                    }
                                    <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Descuento máximo {{ regla.tipo === 'PORCENTAJE' ? '(%)' : '(S/)' }}</th>
                                    <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Cuotas máximas con descuento</th>
                                    <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Monto mínimo por cuota</th>
                                    @if (regla.segmento === 'ANIO') {
                                      <th class="w-8 pb-1.5"><span class="sr-only">Quitar</span></th>
                                    }
                                  </tr>
                                </thead>
                                <tbody>
                                  @for (fila of regla.filas; track $index; let i = $index) {
                                    <tr>
                                      @if (regla.segmento === 'ANTIGUA_NUEVA') {
                                        <td class="py-1 pr-2.5 text-[12.5px] font-bold text-[#334155] dark:text-slate-200">{{ rotuloFila(regla, fila) }}</td>
                                      } @else if (regla.segmento === 'ANIO') {
                                        <td class="py-1 pr-2.5">
                                          @if (fila.valor === null) {
                                            <span class="text-[12.5px] font-bold text-[#334155] dark:text-slate-200">Resto de años</span>
                                          } @else {
                                            <select [ngModel]="fila.valor" (ngModelChange)="onAnioChange(opcion.codigoOpcion, i, $event)"
                                                    aria-label="Año de castigo" [class]="ui.inputSm + ' h-[30px] w-[150px]'">
                                              @for (a of aniosLibres(regla, fila.valor); track a) {
                                                <option [ngValue]="a">Castigo {{ a }}</option>
                                              }
                                            </select>
                                          }
                                        </td>
                                      }
                                      <td class="py-1 pr-2.5">
                                        <span [class]="numCaja">
                                          <span class="text-[11.5px] font-bold text-[#5f6c80] dark:text-slate-400">{{ regla.tipo === 'PORCENTAJE' ? '%' : 'S/' }}</span>
                                          <input type="number" min="0" [attr.max]="regla.tipo === 'PORCENTAJE' ? 100 : null" step="1"
                                                 placeholder="Por definir" [value]="fila.descuentoMaximo ?? ''"
                                                 (change)="onFilaChange(opcion.codigoOpcion, i, 'descuentoMaximo', $event)"
                                                 [attr.aria-label]="'Descuento máximo ' + rotuloFila(regla, fila)"
                                                 [class]="numInput"/>
                                        </span>
                                      </td>
                                      <td class="py-1 pr-2.5">
                                        <span [class]="numCaja">
                                          <span class="text-[11.5px] font-bold text-[#5f6c80] dark:text-slate-400">Máx.</span>
                                          <input type="number" min="1" max="48" step="1" placeholder="De la tarjeta"
                                                 [value]="fila.maxCuotas ?? ''"
                                                 (change)="onFilaChange(opcion.codigoOpcion, i, 'maxCuotas', $event)"
                                                 [attr.aria-label]="'Cuotas máximas con descuento ' + rotuloFila(regla, fila)"
                                                 [class]="numInput"/>
                                        </span>
                                      </td>
                                      <td class="py-1 pr-2.5">
                                        <span [class]="numCaja">
                                          <span class="text-[11.5px] font-bold text-[#5f6c80] dark:text-slate-400">S/</span>
                                          <input type="number" min="0" step="1" placeholder="Opcional"
                                                 [value]="fila.montoMinimoCuota ?? ''"
                                                 (change)="onFilaChange(opcion.codigoOpcion, i, 'montoMinimoCuota', $event)"
                                                 [attr.aria-label]="'Monto mínimo por cuota ' + rotuloFila(regla, fila)"
                                                 [class]="numInput"/>
                                        </span>
                                      </td>
                                      @if (regla.segmento === 'ANIO') {
                                        <td class="py-1">
                                          @if (fila.valor !== null) {
                                            <button type="button" (click)="quitarAnio(opcion.codigoOpcion, i)"
                                                    [attr.aria-label]="'Quitar Castigo ' + fila.valor" [class]="ui.iconBtnPeligro">
                                              <lucide-angular name="trash-2" [size]="15"></lucide-angular>
                                            </button>
                                          }
                                        </td>
                                      }
                                    </tr>
                                  }
                                </tbody>
                              </table>
                            </div>

                            <!-- Agregar año va pegado a los años: los que quedan salen de la cartera (SELECT DISTINCT del backend) -->
                            @if (regla.segmento === 'ANIO') {
                              @let libres = aniosLibres(regla, null);
                              <div class="flex flex-wrap items-center gap-2">
                                @if (libres.length > 0) {
                                  <button type="button" (click)="agregarAnio(opcion.codigoOpcion)" [class]="ui.textoBtn">
                                    <lucide-angular name="plus" [size]="14"></lucide-angular>
                                    Agregar año
                                  </button>
                                  <span [class]="ui.ayuda">Quedan {{ libres.length }} {{ libres.length === 1 ? 'año' : 'años' }} de castigo en la cartera: {{ libres.join(', ') }}</span>
                                } @else {
                                  <span [class]="ui.ayuda">Ya están todos los años de castigo de la cartera.</span>
                                }
                              </div>
                            }

                            <!-- Niveles de autorización: quién aprueba según cuánto pasa el máximo sin aprobación -->
                            <div class="flex flex-col gap-2.5 rounded-[10px] border border-[#e6e9ee] bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                              <span class="text-[12.5px] font-bold text-[#0f172a] dark:text-slate-100">Niveles de autorización</span>
                              <span [class]="ui.ayuda">
                                Si el descuento pasa el máximo sin aprobación, la promesa pasa a evaluación indicando quién autoriza
                                según el descuento. Si no se cumplen las cuotas o el monto mínimo por cuota, se guarda como monto libre,
                                también en evaluación; si solo fallan las cuotas, autoriza el primer nivel. El asesor no ve ningún aviso.
                              </span>
                              @for (fila of regla.filas; track $index; let fi = $index) {
                                @if (fi > 0) {
                                  <div class="border-t border-dashed border-[#e6e9ee] dark:border-slate-700"></div>
                                }
                                <div class="flex flex-col gap-1.5">
                                  @if (regla.segmento) {
                                    <span class="text-[12px] font-bold text-[#334155] dark:text-slate-200">{{ rotuloFila(regla, fila) }}</span>
                                  }
                                  @if (fila.niveles.length > 0) {
                                    <div class="overflow-x-auto">
                                      <table class="w-full min-w-[520px] border-separate border-spacing-0 text-left">
                                        <thead>
                                          <tr>
                                            <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Descuento</th>
                                            <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Hasta {{ regla.tipo === 'PORCENTAJE' ? '(%)' : '(S/)' }}</th>
                                            <th [class]="ui.label + ' pb-1.5 pr-2.5 font-bold'">Autoriza</th>
                                            <th class="w-8 pb-1.5"><span class="sr-only">Quitar</span></th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          @for (n of fila.niveles; track $index; let ni = $index) {
                                            @let desde = desdeNivel(fila, ni);
                                            <tr>
                                              <td class="whitespace-nowrap py-1 pr-2.5 text-[12px] tabular-nums text-[#5f6c80] dark:text-slate-400">
                                                @if (desde === null) {
                                                  <span class="font-semibold text-[#b45309] dark:text-amber-300">El nivel anterior no tiene tope</span>
                                                } @else {
                                                  Más de {{ limiteTexto(regla, desde) }}
                                                }
                                              </td>
                                              <td class="w-[170px] py-1 pr-2.5">
                                                <span [class]="numCaja">
                                                  <span class="text-[11.5px] font-bold text-[#5f6c80] dark:text-slate-400">hasta {{ regla.tipo === 'PORCENTAJE' ? '%' : 'S/' }}</span>
                                                  <input type="number" min="0" [attr.max]="regla.tipo === 'PORCENTAJE' ? 100 : null" step="1"
                                                         placeholder="Sin tope" [value]="n.hasta ?? ''"
                                                         (change)="onNivelHastaChange(opcion.codigoOpcion, fi, ni, $event)"
                                                         [attr.aria-label]="'Descuento hasta, nivel ' + (ni + 1) + ' ' + rotuloFila(regla, fila)"
                                                         [class]="numInput"/>
                                                </span>
                                              </td>
                                              <td class="py-1 pr-2.5">
                                                <select (change)="onNivelAutorizadorChange(opcion.codigoOpcion, fi, ni, $event)"
                                                        [attr.aria-label]="'Quién autoriza el nivel ' + (ni + 1) + ' ' + rotuloFila(regla, fila)"
                                                        [class]="ui.inputSm + ' h-[30px] w-full min-w-[240px]'">
                                                  @if (n.idAutorizador === null) {
                                                    <option value="" selected>Elegir autorizador</option>
                                                  }
                                                  @for (a of autorizadoresParaNivel(n.idAutorizador); track a.id) {
                                                    <option [value]="a.id" [selected]="a.id === n.idAutorizador">{{ etiquetaAutorizador(a) }}</option>
                                                  }
                                                  <option value="nuevo">+ Nuevo autorizador…</option>
                                                </select>
                                              </td>
                                              <td class="w-8 py-1">
                                                <button type="button" (click)="quitarNivel(opcion.codigoOpcion, fi, ni)"
                                                        [attr.aria-label]="'Quitar nivel ' + (ni + 1)" [class]="ui.iconBtnPeligro">
                                                  <lucide-angular name="trash-2" [size]="15"></lucide-angular>
                                                </button>
                                              </td>
                                            </tr>
                                          }
                                        </tbody>
                                      </table>
                                    </div>
                                  } @else {
                                    <span [class]="ui.ayuda">Sin niveles: el descuento pasa a evaluación sin indicar quién autoriza.</span>
                                  }
                                  <div>
                                    <button type="button" (click)="agregarNivel(opcion.codigoOpcion, fi)" [class]="ui.textoBtn">
                                      <lucide-angular name="plus" [size]="14"></lucide-angular>
                                      Agregar nivel
                                    </button>
                                  </div>
                                </div>
                              }
                            </div>

                            <div class="flex flex-wrap items-center justify-end gap-2">
                              <button type="button" (click)="aplicarAOtras(opcion)" [class]="ui.textoBtn">
                                <lucide-angular name="copy" [size]="14"></lucide-angular>
                                Aplicar estos valores a otras tarjetas
                              </button>
                            </div>

                            <span [class]="ui.ayuda">{{ ayuda(opcion) }}</span>
                            @if (segmentacion().conMoneda && regla.tipo === 'MONTO') {
                              <span [class]="ui.ayuda">En las cuentas en dólares, un límite en soles pasa a evaluación.</span>
                            }
                          </div>
                        } @else {
                          <div class="flex flex-col gap-1">
                            <div class="flex items-baseline justify-between gap-2.5">
                              <span class="inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-[#334155] dark:text-slate-300">
                                Tope de la promesa sobre la deuda
                                <span [class]="ui.chipAmbar">Bloquea</span>
                              </span>
                              <b class="text-[13px] font-extrabold tabular-nums">{{ opcion.porcentajeMaximoPromesa ?? 10 }}%</b>
                            </div>
                            <input type="range" min="0" max="100" step="5" [value]="opcion.porcentajeMaximoPromesa ?? 10"
                                   (input)="onPorcentajeMaximoChange(opcion.codigoOpcion, $event)"
                                   aria-label="Límite máximo de la promesa sobre la deuda"
                                   class="w-full cursor-pointer accent-[#2563eb]"/>
                            <span [class]="ui.ayuda">
                              Si la promesa supera la deuda en más de {{ opcion.porcentajeMaximoPromesa ?? 10 }}%, no se puede registrar.
                            </span>
                          </div>
                          <span [class]="ui.ayuda">Monto libre: el asesor escribe el monto y la promesa siempre pasa a evaluación.</span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            }
          }
        </div>

        <!-- Pie -->
        <div class="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#e6e9ee] px-[18px] py-3 dark:border-slate-700">
          <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
            @if (opciones().length > 0) {
              Los montos habilitados aparecen como opciones para el asesor al registrar la promesa
            }
          </span>
          <div class="flex gap-2">
            <button type="button" (click)="handleCancel()" [disabled]="guardando()" [class]="ui.secundario">
              {{ sinCronograma() ? 'Cerrar' : 'Cancelar' }}
            </button>
            @if (!sinCronograma()) {
              <button type="button" (click)="handleSave()" [disabled]="!canSave()" [class]="ui.primario">
                @if (guardando()) {
                  <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
                  Guardando
                } @else {
                  Guardar
                }
              </button>
            }
          </div>
        </div>
      </div>
    </div>

    @if (autorizadoresAbierto() && contextoAutorizadores(); as ctx) {
      <app-autorizadores-excepcion-dialog
        [contexto]="ctx"
        [autorizadores]="autorizadores()"
        [modoInicial]="autorizadoresModo()"
        [usosSinGuardar]="usosSinGuardar"
        (actualizado)="autorizadores.set($event)"
        (creado)="onAutorizadorCreado($event)"
        (close)="cerrarAutorizadores()">
      </app-autorizadores-excepcion-dialog>
    }
  `,
  styles: [TUI_ANIM]
})
export class TypificationAdditionalFieldsDialogComponent {
  isOpen = input.required<boolean>();
  typificationName = input<string>('');
  typificationId = input.required<number>();
  tenantId = input.required<number>();
  portfolioId = input<number | undefined>(undefined);
  /** Subcartera abierta en la pantalla: el diálogo arranca con esa misma elegida. */
  subPortfolioId = input<number | undefined>(undefined);
  /** Subcarteras de la pantalla, para mostrar el cliente, la cartera y la subcartera abiertas. */
  subcarteras = input<SubcarteraMontos[]>([]);

  close = output<void>();
  save = output<void>();

  readonly ui = TUI;
  readonly sw = tuiSwitch;
  readonly perilla = tuiPerilla;
  readonly esqueleto = [0, 1, 2, 3];
  readonly numCaja = NUM_CAJA;
  readonly numInput = NUM_INPUT;
  readonly tipos: { valor: TipoLimiteDescuento; texto: string }[] = [
    { valor: 'PORCENTAJE', texto: 'Porcentaje' },
    { valor: 'MONTO', texto: 'Monto (S/)' }
  ];

  opciones = signal<CampoOpcionDTO[]>([]);
  loadingOpciones = signal<boolean>(false);
  errorMessage = signal<string>('');
  selectedSubPortfolioId = signal<number | undefined>(undefined);
  paymentScheduleFieldId = signal<number | null>(null);
  /** Aún no se sabe si la tipificación tiene campo de cronograma de pagos. */
  cargandoCampos = signal<boolean>(false);
  /** Ya se sabe que no lo tiene: no hay montos que configurar. */
  sinCronograma = signal<boolean>(false);
  guardando = signal<boolean>(false);
  segmentacion = signal<Segmentacion>(SIN_SEGMENTACION);

  /** Autorizadores de la subcartera elegida, para los niveles de autorización. */
  autorizadores = signal<AutorizadorExcepcion[]>([]);
  readonly autorizadoresActivos = computed(() => this.autorizadores().filter(a => a.activo));
  autorizadoresAbierto = signal(false);
  autorizadoresModo = signal<'lista' | 'form'>('lista');
  /** Nivel desde el que se pidió «Nuevo autorizador…»: el creado se le asigna. */
  private nivelPendiente: { codigoOpcion: string; fi: number; ni: number } | null = null;
  /** Lo escrito en cada tipo de límite mientras no se guarde: volver al tipo anterior lo recupera. */
  private memoriaTipo = new Map<string, FilaReglaDescuento[]>();

  // Cabeceras para nombres visuales
  cabeceras = signal<ConfiguracionCabecera[]>([]);
  private cabecerasUrl = `${environment.apiUrl}/configuracion-cabeceras`;
  private descuentoUrl = `${environment.apiUrl}/v2/descuento-maximo`;
  private autorizadoresUrl = `${environment.apiUrl}/v2/autorizadores-excepcion`;

  /** Subcartera del filtro maestro de la pantalla: es la única que se configura en el diálogo. */
  private readonly inicial = computed(() =>
    this.subcarteras().find(s => s.subId === this.subPortfolioId()) ?? null);
  readonly encabezado = computed(() => {
    const s = this.inicial();
    return [
      { etiqueta: 'Cliente', valor: s?.cliente },
      { etiqueta: 'Cartera', valor: s?.cartera },
      { etiqueta: 'Subcartera', valor: s?.subcartera }
    ];
  });
  private readonly seleccion = computed(() =>
    this.subcarteras().find(s => s.subId === this.selectedSubPortfolioId()) ?? null);
  readonly contextoAutorizadores = computed<ContextoAutorizadores | null>(() => {
    const s = this.seleccion();
    return s ? { subId: s.subId, cliente: s.cliente, cartera: s.cartera, subcartera: s.subcartera } : null;
  });

  // Computed: opciones con nombres visuales traducidos
  opcionesConNombres = computed<OpcionVista[]>(() => {
    const opciones = this.opciones();
    const cabeceras = this.cabeceras();

    // Crear mapa de codigo -> nombre visual
    const codigoToNombre = new Map<string, string>();
    for (const c of cabeceras) {
      codigoToNombre.set(c.codigo.toLowerCase(), c.nombre);
    }

    // Devolver opciones con nombre visual
    return opciones.map(opcion => {
      let visualName = opcion.labelOpcion || opcion.codigoOpcion;

      if (opcion.codigoOpcion === 'personalizado') {
        visualName = 'Personalizado';
      } else if (opcion.campoTablaDinamica) {
        const nombre = codigoToNombre.get(opcion.campoTablaDinamica.toLowerCase());
        if (nombre) {
          visualName = nombre;
        }
      }

      return { ...opcion, visualName };
    });
  });

  private typificationService = inject(TypificationV2Service);
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  constructor() {
    // Solo depende de isOpen: lo que se lee al cargar (campo de cronograma, subcartera) no debe
    // volver a dispararlo, o cada respuesta reinicia el diálogo y se queda cargando sin fin
    effect(() => {
      if (this.isOpen()) {
        untracked(() => {
          this.resetState();
          this.elegirInicial();
          this.loadPaymentScheduleField();
        });
      }
    });
  }

  private resetState() {
    this.opciones.set([]);
    this.cabeceras.set([]);
    this.errorMessage.set('');
    this.selectedSubPortfolioId.set(undefined);
    this.paymentScheduleFieldId.set(null);
    this.sinCronograma.set(false);
    this.guardando.set(false);
    this.segmentacion.set(SIN_SEGMENTACION);
    this.limpiarAutorizadores();
  }

  private limpiarAutorizadores() {
    this.autorizadores.set([]);
    this.autorizadoresAbierto.set(false);
    this.nivelPendiente = null;
    this.memoriaTipo.clear();
  }

  /** Se parte de la subcartera abierta en la pantalla. */
  private elegirInicial() {
    const inicial = this.inicial();
    if (!inicial) return;
    this.elegirSub(inicial.subId);
  }

  private loadPaymentScheduleField() {
    const typificationId = this.typificationId();
    if (!typificationId) return;

    this.cargandoCampos.set(true);

    this.typificationService.getAdditionalFields(typificationId).subscribe({
      next: (fields) => {
        this.cargandoCampos.set(false);
        // Find PAYMENT_SCHEDULE field
        const paymentField = fields.find(f => f.tipoCampo === FieldTypeV2.PAYMENT_SCHEDULE);
        if (paymentField) {
          this.paymentScheduleFieldId.set(paymentField.id);
          // Si la subcartera ya estaba elegida, los montos se cargan ahora
          this.loadOpcionesAutomatically();
        } else {
          this.sinCronograma.set(true);
        }
      },
      error: (error) => {
        console.error('Error loading fields:', error);
        this.cargandoCampos.set(false);
        this.errorMessage.set('No se pudieron cargar los campos de la tipificación.');
      }
    });
  }

  private elegirSub(subPortfolioId: number) {
    this.selectedSubPortfolioId.set(subPortfolioId);
    this.loadCabeceras(subPortfolioId);
    this.loadSegmentacion();
    this.loadAutorizadores(subPortfolioId);
    this.loadOpcionesAutomatically();
  }

  private loadAutorizadores(subPortfolioId: number) {
    this.http.get<AutorizadorExcepcion[]>(this.autorizadoresUrl, { params: { idSubcartera: subPortfolioId } }).subscribe({
      next: (lista) => {
        if (this.selectedSubPortfolioId() !== subPortfolioId) return;
        this.autorizadores.set(lista ?? []);
      },
      error: (error) => console.warn('[DIALOG] Error loading autorizadores:', error)
    });
  }

  private loadCabeceras(subPortfolioId: number) {
    this.http.get<ConfiguracionCabecera[]>(`${this.cabecerasUrl}/subcartera/${subPortfolioId}/montos`)
      .subscribe({
        next: (cabeceras) => {
          this.cabeceras.set(cabeceras);
        },
        error: (error) => {
          console.warn('[DIALOG] Error loading cabeceras:', error);
        }
      });
  }

  /** Cartera antigua y nueva o años de castigo, según lo que la subcartera enlaza en Config. Cabeceras. */
  private loadSegmentacion() {
    const sel = this.seleccion();
    if (!sel) return;
    this.http.get<Segmentacion>(`${this.descuentoUrl}/segmentacion`, {
      params: { idTenant: sel.tenantId, idCartera: sel.portfolioId, idSubcartera: sel.subId }
    }).subscribe({
      next: (s) => {
        if (this.selectedSubPortfolioId() !== sel.subId) return;
        this.segmentacion.set({ antiguaNueva: !!s?.antiguaNueva, aniosCastigo: s?.aniosCastigo ?? [], conMoneda: !!s?.conMoneda });
        this.opciones.set(this.opciones().map(o => this.normalizarRegla(o)));
      },
      error: (error) => console.warn('[DIALOG] Error loading segmentación:', error)
    });
  }

  /**
   * Carga los montos cuando ya se conocen las dos cosas que necesita: el campo de
   * cronograma y la subcartera. Se llama al resolverse cada una, así que ya no hace
   * falta el reintento con temporizador que había antes (y que nunca se detenía si
   * la tipificación no tenía ese campo).
   */
  private loadOpcionesAutomatically() {
    const sel = this.seleccion();
    const tenantId = sel?.tenantId ?? this.tenantId();
    const portfolioId = sel?.portfolioId ?? this.portfolioId();
    const subPortfolioId = this.selectedSubPortfolioId();
    const campoId = this.paymentScheduleFieldId();

    if (!tenantId || !portfolioId || !subPortfolioId || !campoId) {
      return;
    }

    this.loadingOpciones.set(true);
    this.errorMessage.set('');

    // First try to get existing options for this subPortfolio
    this.typificationService.getOpcionesCampo(campoId, subPortfolioId).subscribe({
      next: (opciones) => {
        if (this.selectedSubPortfolioId() !== subPortfolioId) return;
        if (opciones && opciones.length > 0) {
          this.opciones.set(opciones.map(o => this.normalizarRegla(o)));
          this.loadingOpciones.set(false);
        } else {
          // Initialize options from subportfolio
          this.initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId);
        }
      },
      error: () => {
        // Initialize options from subportfolio
        this.initializeOpciones(campoId, tenantId, portfolioId, subPortfolioId);
      }
    });
  }

  private initializeOpciones(campoId: number, tenantId: number, portfolioId: number, subPortfolioId: number) {
    this.typificationService.inicializarOpcionesCampo(campoId, tenantId, portfolioId, subPortfolioId)
      .subscribe({
        next: (opciones) => {
          if (this.selectedSubPortfolioId() !== subPortfolioId) return;
          this.opciones.set(opciones.map(o => this.normalizarRegla(o)));
          this.loadingOpciones.set(false);
        },
        error: (error) => {
          console.error('Error initializing options:', error);
          this.errorMessage.set('Error al cargar las opciones. Verifica la configuración de la subcartera.');
          this.loadingOpciones.set(false);
        }
      });
  }

  retryLoadOpciones() {
    if (this.paymentScheduleFieldId()) {
      this.loadOpcionesAutomatically();
    } else {
      // Lo que falló fue la carga de los campos de la tipificación
      this.errorMessage.set('');
      this.loadPaymentScheduleField();
    }
  }

  toggleOpcionOriginal(opcionConNombre: CampoOpcionDTO & { visualName: string }) {
    // Buscar la opcion original en el signal y modificarla
    const opciones = this.opciones();
    const opcionOriginal = opciones.find(o => o.codigoOpcion === opcionConNombre.codigoOpcion);
    if (opcionOriginal) {
      opcionOriginal.estaHabilitada = !opcionOriginal.estaHabilitada;
      // Si se habilita y no tiene restriccion, poner por defecto SIN_RESTRICCION
      if (opcionOriginal.estaHabilitada && !opcionOriginal.restriccionFecha) {
        opcionOriginal.restriccionFecha = RestriccionFecha.SIN_RESTRICCION;
      }
      // Forzar actualizacion del signal
      this.opciones.set([...opciones]);
    }
  }

  onRestriccionFechaChange(codigoOpcion: string, restriccion: string) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.restriccionFecha = restriccion as RestriccionFecha;
      // Forzar actualizacion del signal
      this.opciones.set([...opciones]);
    }
  }

  alternarCarta(codigoOpcion: string) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (opcion) {
      opcion.generaCartaAcuerdo = !opcion.generaCartaAcuerdo;
      this.opciones.set([...opciones]);
    }
  }

  /** Lee un número de cuotas del campo, lo acota a 1–48 y deja el campo mostrando el valor acotado. */
  private leerCuotas(event: Event): number {
    const campo = event.target as HTMLInputElement;
    const leido = parseInt(campo.value, 10);
    const valor = Math.max(1, Math.min(48, isNaN(leido) ? 1 : leido));
    campo.value = String(valor);
    return valor;
  }

  // El mínimo nunca queda por encima del máximo, ni al revés: el otro extremo lo acompaña
  onMinCuotasChange(codigoOpcion: string, event: Event) {
    const min = this.leerCuotas(event);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;

    opcion.minCuotas = min;
    if ((opcion.maxCuotas || 6) < min) opcion.maxCuotas = min;
    this.opciones.set([...opciones]);
  }

  onMaxCuotasChange(codigoOpcion: string, event: Event) {
    const max = this.leerCuotas(event);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;

    opcion.maxCuotas = max;
    if ((opcion.minCuotas || 1) > max) opcion.minCuotas = max;
    this.opciones.set([...opciones]);
  }

  onPorcentajeMaximoChange(codigoOpcion: string, event: Event) {
    const porcentaje = parseInt((event.target as HTMLInputElement).value, 10);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;
    opcion.porcentajeMaximoPromesa = porcentaje;
    this.opciones.set([...opciones]);
  }

  // Sobrepago máximo en soles; vacío = sin tope
  onTopeSobrepagoChange(codigoOpcion: string, event: Event) {
    const valor = (event.target as HTMLInputElement).value.trim();
    const tope = valor === '' ? null : Number(valor);
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;
    opcion.topeSobrepagoSoles = tope === null || isNaN(tope) || tope < 0 ? null : tope;
    this.opciones.set([...opciones]);
  }

  // ---------------------------------------------------------------- Descuento máximo

  private filaVacia(valor: string | null): FilaReglaDescuento {
    return { valor, descuentoMaximo: null, maxCuotas: null, montoMinimoCuota: null, niveles: [] };
  }

  private copiarFila(f: FilaReglaDescuento): FilaReglaDescuento {
    return { ...f, niveles: (f.niveles ?? []).map(n => ({ ...n })) };
  }

  /** Regla que se muestra cuando la tarjeta todavía no tiene una: todo por definir. */
  private reglaInicial(): ReglaDescuento {
    return this.segmentacion().antiguaNueva
      ? { tipo: 'PORCENTAJE', campoReferencia: null, segmento: 'ANTIGUA_NUEVA', filas: [this.filaVacia('ANTIGUA'), this.filaVacia('NUEVA')] }
      : { tipo: 'PORCENTAJE', campoReferencia: null, segmento: null, filas: [this.filaVacia(null)] };
  }

  /**
   * Deja la regla con las filas que corresponden a la subcartera: con periodo de compra, siempre cartera
   * antigua y nueva; por año, los años y al final "Resto de años"; si no, una sola fila.
   */
  private normalizarRegla(o: CampoOpcionDTO): CampoOpcionDTO {
    if (o.codigoOpcion === 'personalizado' || !o.reglaDescuento) return o;
    const r: ReglaDescuento = { ...o.reglaDescuento, filas: (o.reglaDescuento.filas ?? []).map(f => this.copiarFila(f)) };
    const busca = (v: string | null) => r.filas.find(f => f.valor === v);
    if (this.segmentacion().antiguaNueva) {
      r.segmento = 'ANTIGUA_NUEVA';
      r.filas = [busca('ANTIGUA') ?? this.filaVacia('ANTIGUA'), busca('NUEVA') ?? this.filaVacia('NUEVA')];
    } else if (r.segmento === 'ANIO') {
      r.filas = [...r.filas.filter(f => f.valor !== null), busca(null) ?? this.filaVacia(null)];
    } else if (r.segmento === 'ANTIGUA_NUEVA') {
      // La subcartera ya no enlaza el periodo de compra: queda un solo límite por definir
      r.segmento = null;
      r.filas = [this.filaVacia(null)];
    } else {
      r.filas = [busca(null) ?? r.filas[0] ?? this.filaVacia(null)];
    }
    return { ...o, reglaDescuento: r };
  }

  reglaDe(o: CampoOpcionDTO): ReglaDescuento {
    return o.reglaDescuento ?? this.reglaInicial();
  }

  /** Aplica un cambio a la regla de la tarjeta (creándola si aún no tenía) y refresca la vista. */
  private editarRegla(codigoOpcion: string, cambio: (r: ReglaDescuento) => void) {
    const opciones = this.opciones();
    const opcion = opciones.find(o => o.codigoOpcion === codigoOpcion);
    if (!opcion) return;
    const base = this.reglaDe(opcion);
    const r: ReglaDescuento = { ...base, filas: base.filas.map(f => this.copiarFila(f)) };
    cambio(r);
    opcion.reglaDescuento = r;
    this.opciones.set([...opciones]);
  }

  /**
   * Un 85 en % no significa S/ 85: al cambiar de tipo, el descuento y los niveles empiezan vacíos (las
   * cuotas y el mínimo por cuota se mantienen). Mientras no se guarde, volver al tipo anterior lo recupera.
   */
  onTipoChange(codigoOpcion: string, tipo: TipoLimiteDescuento) {
    this.editarRegla(codigoOpcion, r => {
      if (r.tipo === tipo) return;
      this.memoriaTipo.set(codigoOpcion + '|' + r.tipo, r.filas.map(f => this.copiarFila(f)));
      const previas = this.memoriaTipo.get(codigoOpcion + '|' + tipo) ?? [];
      r.tipo = tipo;
      r.filas.forEach(f => {
        const p = previas.find(x => x.valor === f.valor);
        f.descuentoMaximo = p ? p.descuentoMaximo : null;
        f.niveles = p ? p.niveles.map(n => ({ ...n })) : [];
      });
    });
  }

  onReferenciaChange(codigoOpcion: string, campo: string | null) {
    this.editarRegla(codigoOpcion, r => r.campoReferencia = campo || null);
  }

  onPorAnioChange(codigoOpcion: string, event: Event) {
    const porAnio = (event.target as HTMLInputElement).checked;
    this.editarRegla(codigoOpcion, r => {
      const resto = r.filas.find(f => f.valor === null) ?? r.filas[0] ?? this.filaVacia(null);
      if (porAnio) {
        const anios = this.segmentacion().aniosCastigo.slice(0, 1);
        r.segmento = 'ANIO';
        r.filas = [...anios.map(a => this.filaVacia(a)), { ...resto, valor: null }];
      } else {
        r.segmento = null;
        r.filas = [{ ...resto, valor: null }];
      }
    });
  }

  aniosLibres(regla: ReglaDescuento, actual: string | null): string[] {
    const usados = regla.filas.map(f => f.valor).filter(v => v !== null && v !== actual);
    return this.segmentacion().aniosCastigo.filter(a => !usados.includes(a));
  }

  agregarAnio(codigoOpcion: string) {
    this.editarRegla(codigoOpcion, r => {
      const libre = this.aniosLibres(r, null)[0];
      if (!libre) return;
      // Antes de "Resto de años", que siempre va al final
      r.filas.splice(Math.max(0, r.filas.length - 1), 0, this.filaVacia(libre));
    });
  }

  onAnioChange(codigoOpcion: string, i: number, anio: string) {
    this.editarRegla(codigoOpcion, r => r.filas[i].valor = anio);
  }

  quitarAnio(codigoOpcion: string, i: number) {
    this.editarRegla(codigoOpcion, r => r.filas.splice(i, 1));
  }

  onFilaChange(codigoOpcion: string, i: number, campo: 'descuentoMaximo' | 'maxCuotas' | 'montoMinimoCuota', event: Event) {
    const input = event.target as HTMLInputElement;
    const texto = input.value.trim();
    let valor: number | null = texto === '' ? null : Number(texto);
    if (valor !== null && (isNaN(valor) || valor < 0)) valor = null;
    this.editarRegla(codigoOpcion, r => {
      if (valor !== null && campo === 'descuentoMaximo' && r.tipo === 'PORCENTAJE') valor = Math.min(100, valor);
      if (valor !== null && campo === 'maxCuotas') valor = Math.max(1, Math.min(48, Math.round(valor)));
      r.filas[i][campo] = valor;
    });
    input.value = valor === null ? '' : String(valor);
  }

  /** Copia tipo, saldo de referencia, segmento y filas a las demás tarjetas de la subcartera. */
  aplicarAOtras(origen: OpcionVista) {
    const regla = this.reglaDe(origen);
    const opciones = this.opciones();
    let n = 0;
    for (const o of opciones) {
      if (o.codigoOpcion === origen.codigoOpcion || o.codigoOpcion === 'personalizado') continue;
      o.reglaDescuento = {
        ...regla,
        // Sobre su propio monto, la referencia es la tarjeta misma
        campoReferencia: regla.campoReferencia && regla.campoReferencia.toLowerCase() === (o.campoTablaDinamica || '').toLowerCase()
          ? null : regla.campoReferencia,
        filas: regla.filas.map(f => this.copiarFila(f))
      };
      n++;
    }
    this.opciones.set([...opciones]);
    this.toast.success(`Valores de ${origen.visualName} aplicados a ${n} ${n === 1 ? 'tarjeta' : 'tarjetas'}. Se guardan con «Guardar».`);
  }

  /** Saldos del cliente que pueden servir de referencia: los montos de las demás tarjetas. */
  referencias(o: OpcionVista): { campo: string; nombre: string }[] {
    const propio = (o.campoTablaDinamica || '').toLowerCase();
    const vistos = new Set<string>();
    const lista: { campo: string; nombre: string }[] = [];
    for (const x of this.opcionesConNombres()) {
      const campo = x.campoTablaDinamica;
      if (!campo || x.codigoOpcion === 'personalizado' || campo.toLowerCase() === propio || vistos.has(campo.toLowerCase())) continue;
      vistos.add(campo.toLowerCase());
      lista.push({ campo, nombre: x.visualName });
    }
    // La referencia guardada se muestra aunque esa tarjeta ya no esté en la subcartera
    const actual = this.reglaDe(o).campoReferencia;
    if (actual && !vistos.has(actual.toLowerCase()) && actual.toLowerCase() !== propio) {
      lista.push({ campo: actual, nombre: this.nombreCampo(actual) });
    }
    return lista;
  }

  private nombreCampo(campo: string): string {
    const x = this.opcionesConNombres().find(y => (y.campoTablaDinamica || '').toLowerCase() === campo.toLowerCase());
    if (x) return x.visualName;
    const c = this.cabeceras().find(y => y.codigo.toLowerCase() === campo.toLowerCase());
    return c?.nombre ?? campo;
  }

  rotuloFila(regla: ReglaDescuento, fila: FilaReglaDescuento): string {
    if (regla.segmento === 'ANTIGUA_NUEVA') return fila.valor === 'NUEVA' ? 'Cartera nueva' : 'Cartera antigua';
    if (regla.segmento === 'ANIO') return fila.valor === null ? 'Resto de años' : 'Castigo ' + fila.valor;
    return '';
  }

  limiteTexto(regla: ReglaDescuento, v: number): string {
    return regla.tipo === 'PORCENTAJE' ? `${v}%` : `S/ ${v.toLocaleString('es-PE')}`;
  }

  resumenPendiente(o: OpcionVista): boolean {
    return this.reglaDe(o).filas.every(f => f.descuentoMaximo == null);
  }

  /** Resumen del límite junto al nombre de la tarjeta, con cuántos niveles de autorización tiene. */
  resumen(o: OpcionVista): string {
    const r = this.reglaDe(o);
    if (r.filas.every(f => f.descuentoMaximo == null)) return 'Descuento por definir';
    const n = Math.max(0, ...r.filas.map(f => f.niveles?.length ?? 0));
    const niveles = n ? ` · ${n} ${n === 1 ? 'nivel' : 'niveles'}` : '';
    const sobre = r.campoReferencia ? ' sobre ' + this.nombreCampo(r.campoReferencia) : '';
    if (r.segmento === 'ANTIGUA_NUEVA') return (r.tipo === 'PORCENTAJE' ? 'Porcentaje' : 'Monto') + sobre + ': antigua y nueva' + niveles;
    if (r.segmento === 'ANIO') return (r.tipo === 'PORCENTAJE' ? 'Porcentaje' : 'Monto') + sobre + ' por año de castigo' + niveles;
    const lim = r.filas[0].descuentoMaximo as number;
    if (lim === 0) return 'Sin descuento directo' + niveles;
    return (r.campoReferencia
      ? `Hasta ${this.limiteTexto(r, lim)} bajo ${this.nombreCampo(r.campoReferencia)}`
      : `Hasta ${this.limiteTexto(r, lim)} de descuento`) + niveles;
  }

  ayuda(o: OpcionVista): string {
    const r = this.reglaDe(o);
    const sobre = r.campoReferencia ? this.nombreCampo(r.campoReferencia) : o.visualName;
    const cuando = r.campoReferencia ? ` Aplica cuando la promesa es menor que ${o.visualName}.` : '';
    if (r.segmento === 'ANTIGUA_NUEVA') {
      return `El descuento se calcula sobre ${sobre}.${cuando} Cada cliente toma la fila de su cartera: la nueva es la compra más reciente y la antigua, las anteriores. Una fila sin límite está por definir.`;
    }
    if (r.segmento === 'ANIO') {
      return `El descuento se calcula sobre ${sobre}.${cuando} Cada cliente toma la fila del año en que se castigó su deuda; los años sin fila van a «Resto de años». Una fila sin límite está por definir.`;
    }
    const lim = r.filas[0]?.descuentoMaximo;
    if (lim == null) return `Por definir: mientras no tenga límite, todo descuento sobre ${o.visualName} pasa a evaluación.`;
    if (lim === 0) return `Cualquier promesa menor que ${o.visualName} pasa a evaluación.${cuando}`;
    return r.tipo === 'PORCENTAJE'
      ? `Sin aprobación, la promesa puede bajar hasta el ${100 - lim}% de ${sobre}.${cuando} Un descuento mayor pasa a evaluación.`
      : `Sin aprobación, la promesa puede bajar hasta ${sobre} menos ${this.limiteTexto(r, lim)}.${cuando} Un descuento mayor pasa a evaluación.`;
  }

  // ---------------------------------------------------------------- Niveles y autorizadores

  /** Desde dónde empieza un nivel: el máximo sin aprobación o el tope del anterior (null = sin tope). */
  desdeNivel(fila: FilaReglaDescuento, ni: number): number | null {
    return ni === 0 ? (fila.descuentoMaximo ?? 0) : fila.niveles[ni - 1].hasta;
  }

  /** Activos, más el ya elegido aunque esté desactivado. */
  autorizadoresParaNivel(actual: number | null): AutorizadorExcepcion[] {
    return this.autorizadores().filter(a => a.activo || a.id === actual);
  }

  etiquetaAutorizador(a: AutorizadorExcepcion): string {
    return a.nombre + (a.cargo ? ' · ' + a.cargo : '');
  }

  agregarNivel(codigoOpcion: string, fi: number) {
    this.editarRegla(codigoOpcion, r => r.filas[fi].niveles.push({ hasta: null, idAutorizador: null }));
  }

  quitarNivel(codigoOpcion: string, fi: number, ni: number) {
    this.editarRegla(codigoOpcion, r => r.filas[fi].niveles.splice(ni, 1));
  }

  onNivelHastaChange(codigoOpcion: string, fi: number, ni: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const texto = input.value.trim();
    let valor: number | null = texto === '' ? null : Number(texto);
    if (valor !== null && (isNaN(valor) || valor < 0)) valor = null;
    this.editarRegla(codigoOpcion, r => {
      if (valor !== null && r.tipo === 'PORCENTAJE') valor = Math.min(100, valor);
      r.filas[fi].niveles[ni].hasta = valor;
    });
    input.value = valor === null ? '' : String(valor);
  }

  onNivelAutorizadorChange(codigoOpcion: string, fi: number, ni: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select.value === 'nuevo') {
      // El select vuelve a lo que tenía; si se registra uno nuevo, se asigna aquí
      const actual = this.opciones().find(o => o.codigoOpcion === codigoOpcion)?.reglaDescuento?.filas[fi]?.niveles[ni]?.idAutorizador;
      select.value = actual != null ? String(actual) : '';
      this.nivelPendiente = { codigoOpcion, fi, ni };
      this.abrirAutorizadores('form');
      return;
    }
    const id = select.value ? Number(select.value) : null;
    this.editarRegla(codigoOpcion, r => r.filas[fi].niveles[ni].idAutorizador = id);
  }

  abrirAutorizadores(modo: 'lista' | 'form') {
    if (modo === 'lista') this.nivelPendiente = null;
    this.autorizadoresModo.set(modo);
    this.autorizadoresAbierto.set(true);
  }

  cerrarAutorizadores() {
    this.autorizadoresAbierto.set(false);
    this.nivelPendiente = null;
  }

  onAutorizadorCreado(a: AutorizadorExcepcion) {
    const p = this.nivelPendiente;
    this.nivelPendiente = null;
    if (!p) return;
    this.editarRegla(p.codigoOpcion, r => {
      const nivel = r.filas[p.fi]?.niveles[p.ni];
      if (nivel) nivel.idAutorizador = a.id;
    });
  }

  /** Tarjetas de esta pantalla, aún sin guardar, en las que el autorizador es un nivel. */
  readonly usosSinGuardar = (id: number): string[] => this.opcionesConNombres()
    .filter(o => o.codigoOpcion !== 'personalizado'
      && (o.reglaDescuento?.filas ?? []).some(f => (f.niveles ?? []).some(n => n.idAutorizador === id)))
    .map(o => o.visualName);

  /** Lo que el backend rechazaría, avisado antes de enviar. */
  private validarNiveles(): string | null {
    for (const o of this.opcionesConNombres()) {
      const r = o.reglaDescuento;
      if (o.codigoOpcion === 'personalizado' || !r) continue;
      for (const f of r.filas) {
        const donde = o.visualName + (r.segmento ? ` (${this.rotuloFila(r, f)})` : '');
        let anterior = f.descuentoMaximo;
        for (let i = 0; i < (f.niveles ?? []).length; i++) {
          const n = f.niveles[i];
          if (n.idAutorizador === null) return `Elige quién autoriza cada nivel de ${donde}.`;
          if (i > 0 && f.niveles[i - 1].hasta === null) return `En ${donde} hay un nivel después de uno sin tope.`;
          if (n.hasta !== null && anterior !== null && n.hasta <= anterior) {
            return `En ${donde}, cada nivel debe autorizar más descuento que el anterior.`;
          }
          if (n.hasta !== null) anterior = n.hasta;
        }
      }
    }
    return null;
  }

  getOpcionesHabilitadasCount(): number {
    return this.opciones().filter(o => o.estaHabilitada).length;
  }

  canSave(): boolean {
    return this.selectedSubPortfolioId() !== undefined &&
           this.paymentScheduleFieldId() !== null &&
           this.opciones().length > 0 &&
           !this.loadingOpciones() &&
           !this.guardando();
  }

  handleCancel() {
    if (this.guardando()) return;
    this.close.emit();
  }

  handleSave() {
    const campoId = this.paymentScheduleFieldId();
    const opcionesActuales = this.opciones();

    if (!campoId || opcionesActuales.length === 0 || this.guardando()) {
      return;
    }
    const invalido = this.validarNiveles();
    if (invalido) {
      this.toast.error(invalido);
      return;
    }

    const request: ConfigurarOpcionesCampoRequest = {
      idCampo: campoId,
      idSubcartera: this.selectedSubPortfolioId(),
      opciones: opcionesActuales.map(o => ({
        codigoOpcion: o.codigoOpcion,
        estaHabilitada: o.estaHabilitada,
        ordenVisualizacion: o.ordenVisualizacion,
        restriccionFecha: o.restriccionFecha || RestriccionFecha.SIN_RESTRICCION,
        generaCartaAcuerdo: o.generaCartaAcuerdo || false,
        minCuotas: o.minCuotas || 1,
        maxCuotas: o.maxCuotas || 6,
        // Personalizado es monto libre: no lleva descuento máximo
        reglaDescuento: o.codigoOpcion === 'personalizado' ? null : (o.reglaDescuento ?? null),
        porcentajeMaximoPromesa: o.porcentajeMaximoPromesa ?? 10,
        topeSobrepagoSoles: o.topeSobrepagoSoles ?? null
      }))
    };

    this.guardando.set(true);

    this.typificationService.configurarOpciones(request).subscribe({
      next: (opcionesActualizadas) => {
        this.guardando.set(false);
        this.memoriaTipo.clear();
        this.opciones.set(opcionesActualizadas.map(o => this.normalizarRegla(o)));
        const sub = this.selectedSubPortfolioId();
        if (sub) this.loadAutorizadores(sub);
        this.save.emit();
      },
      error: (error) => {
        // Antes el mensaje se guardaba en un sitio que no se pinta mientras hay montos
        // en pantalla: el guardado fallaba sin avisar.
        console.error('Error saving options:', error);
        this.guardando.set(false);
        const mensaje = error?.status === 400 && typeof error?.error?.message === 'string' ? error.error.message : null;
        this.toast.error(mensaje || 'Error al guardar la configuración de montos');
      }
    });
  }
}
