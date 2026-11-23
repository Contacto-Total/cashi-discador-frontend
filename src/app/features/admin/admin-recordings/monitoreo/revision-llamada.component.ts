import { ChangeDetectionStrategy, Component, ElementRef, Injector, OnDestroy, ViewChild, afterNextRender, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../../../shared/services/toast.service';
import { BotonDirective } from '../../../../shared/ui/boton.directive';
import { TarjetaDirective } from '../../../../shared/ui/tarjeta.directive';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BARRA_ESTADO_MAL, BUSCAR, BUSCAR_CAMPO, BUSCAR_ICONO, ENTRADA, INDICADORES, PANTALLA, PILL, PRINCIPAL,
  REJILLA, SUBTITULO, TITULO, VACIO, ZONA
} from '../../../asistencia/ui/clases';
import { BOTON_APAGADO, BOTON_SEC } from '../../../asistencia/ui/control-comun';
import { MINI, MINI_PELIGRO } from '../../../asistencia/ui/ficha-clases';
import { IndicadorComponent } from '../../../asistencia/ui/indicador.component';
import { MonitoreoEstado } from './monitoreo-estado';
import { MonitoreoService } from './monitoreo.service';
import { Criterio, EstadoFalta, Ficha, Resultado } from './monitoreo.models';
import { notas, pct, pts } from './monitoreo.calculos';
import { estadoLlamada, oracion } from './monitoreo-lista.component';
import { Linea, inicios, leerLineas, lineaEn, lineasDe, mmss } from './transcripcion';

const ORDEN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'T', 'PRESENTACION', 'NEGOCIACION', 'CIERRE'];
const PAUTA: Record<string, string> = {
  I: 'Contacto con el cliente', II: 'Empatizar', III: 'Negociación y solución', IV: 'Cierre', V: 'Despedida',
  VI: 'Trato al cliente (interna)', VII: 'Registro de la gestión (interna)', T: 'Tercero relacionado',
  PRESENTACION: 'Presentación', NEGOCIACION: 'Negociación', CIERRE: 'Cierre'
};
const RES: Record<Resultado, string> = { CUMPLE: 'Cumple', NO_CUMPLE: 'No cumple', NA: 'No aplica' };
const MIN_MOTIVO = 15;
const VELOCIDADES = [1, 1.25, 1.5, 2];
const fechaCorta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}/${f.slice(0, 4)}`;
const enSoles = (v: number | null): string => v == null ? '—' : 'S/ ' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Revisión de una llamada evaluada por el speech: los criterios a la izquierda, agrupados por pauta (Interbank)
 * o por sección (FOH), con ✗ / ✓ / NA, el motivo de cada cambio y su historial; la falta crítica arriba. A la
 * derecha, fija, la llamada: sus datos, el audio y la transcripción, que sigue al audio y enlaza cada frase
 * citada con su línea. La barra cierra la revisión: «Revisado» sin cambios o «Guardar cambios».
 */
@Component({
  selector: 'app-revision-llamada',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: PANTALLA + ' @container/p5' },
  imports: [LucideAngularModule, TarjetaDirective, BotonDirective, IndicadorComponent],
  template: `
    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)_clamp(20rem,38cqw,30rem)] @max-[48rem]/p5:grid-cols-[minmax(0,1fr)] @max-[48rem]/p5:grid-rows-[minmax(0,1.25fr)_minmax(0,1fr)]'">
      <section appTarjeta [class]="PRINCIPAL">
        <div class="mb-[.875rem] flex flex-none items-center justify-between gap-3 [@media(max-height:700px)]:mb-[.5rem]">
          <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="volver()">
            <lucide-angular name="arrow-left" [size]="16" class="flex"></lucide-angular>Monitoreo
          </button>
          <div class="flex items-center gap-[.375rem] text-[.8125rem] font-medium text-muted-foreground">
            @if (posicion() >= 0) { <span class="mr-1 whitespace-nowrap">{{ posicion() + 1 }} de {{ e.visibles().length }}</span> }
            <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Llamada anterior" [disabled]="posicion() <= 0" (click)="mover(-1)">
              <lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular>
            </button>
            <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Llamada siguiente" [disabled]="posicion() < 0 || posicion() >= e.visibles().length - 1" (click)="mover(1)">
              <lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
            </button>
          </div>
        </div>

        @if (ficha(); as f) {
          <div class="mb-4 flex flex-none flex-wrap items-center justify-between gap-x-6 gap-y-3 [@media(max-height:700px)]:mb-[.75rem]">
            <div class="min-w-0 flex-none">
              <p role="heading" aria-level="1" [class]="TITULO + ' whitespace-normal!'">{{ f.asesor }}</p>
              <p [class]="SUBTITULO">{{ oracion(f.nivel1) }} · {{ oracion(f.nivel2) }}</p>
            </div>
            <span [class]="PILL[estadoPill()[1]]">{{ estadoPill()[0] }}</span>
          </div>

          <div [class]="INDICADORES + ' [@media(max-height:700px)]:mb-4'">
            <app-indicador [bajo]="true" [detalleNeutro]="!antes(grande(), grandeAntes())" [compacto]="true" [detalleRojo]="hoy().anula" [valor]="pct(grande())" unidad="%" [rotulo]="f.cliente === 'FOH' ? 'Puntaje' : unaNota() ? 'Nota' : 'Nota Interbank'"
                           [detalle]="hoy().anula ? 'Sin la falta ' + pct(hoy().sinFalta) + ' %' : antes(grande(), grandeAntes()) || (unaNota() ? 'Sobre 100' : 'Tope 85 %')" />
            @if (unaNota()) {
              <app-indicador [bajo]="true" [compacto]="true" [valor]="pts(hoy().cumplidos)" [unidad]="'de ' + pts(hoy().posibles)" rotulo="Puntos" [detalle]="aplican() + (aplican() === 1 ? ' criterio aplica' : ' criterios aplican')" />
            } @else {
              <app-indicador [bajo]="true" [detalleNeutro]="!antes(hoy().interna, guardadas().interna)" [compacto]="true" [valor]="pct(hoy().interna)" unidad="%" rotulo="Nota interna" [detalle]="antes(hoy().interna, guardadas().interna) || pts(hoy().cumplidos) + ' de ' + pts(hoy().posibles) + ' puntos'" />
            }
            <app-indicador [bajo]="true" [compacto]="true" [valor]="noCumplen()" rotulo="No cumplen" [filtra]="true" tono="ro" [activo]="filtro() === 'nc'" (elegir)="filtrar('nc')" [detalle]="'de ' + aplican() + ' que aplican'" />
            <app-indicador [bajo]="true" [detalleNeutro]="!cambios().length" [compacto]="true" [valor]="corregidos()" rotulo="Corregidos" [filtra]="true" tono="info" [activo]="filtro() === 'corr'" (elegir)="filtrar('corr')"
                           [detalle]="cambios().length ? cambios().length + ' sin guardar' : corregidos() ? 'Guardados' : 'Sin cambios'" />
          </div>

          <div #zonaCriterios [class]="ZONA">
            @if (f.falta; as falta) {
              <div id="c-falta" class="mb-5 grid scroll-mt-3 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-[.375rem] rounded-[.75rem] border border-solid px-[.625rem] py-3"
                   [class]="faltaActiva() ? 'border-(--ro-ln) bg-(--ro-bg)' : 'border-border bg-transparent'">
                <div class="pt-[.0625rem]"><lucide-angular name="triangle-alert" [size]="18" class="flex" [class]="faltaActiva() ? 'text-(--ro)' : 'text-muted-foreground'"></lucide-angular></div>
                <div class="min-w-0">
                  <span class="text-[.875rem] font-semibold" [class]="faltaActiva() ? 'text-(--ro)' : 'text-foreground'">{{ tituloFalta() }}</span>
                  <p class="m-0 mt-[.125rem] text-[.75rem] leading-[1.45] text-muted-foreground">{{ sinPunto(falta.texto) }} · {{ efectoFalta() }}</p>
                  @if (falta.frase) {
                    <button type="button" [class]="EVI + (faltaActiva() ? ' border-l-(--ro-ln)!' : '')" [disabled]="!lineasFalta().length" [attr.aria-pressed]="verDe() === 'FALTA'" title="Ver en la transcripción" (click)="verLinea('FALTA', lineasFalta())">{{ falta.frase }}</button>
                  }
                </div>
                <div class="flex items-center gap-[.375rem]">
                  @if (falta_() === 'PENDIENTE') {
                    <button type="button" appBoton="peligro" appBotonAlto="chico" (click)="falta_.set('CONFIRMADA')">Confirmar falta</button>
                    <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="falta_.set('DESCARTADA')">No es falta</button>
                  } @else {
                    <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" (click)="falta_.set('PENDIENTE')">Cambiar</button>
                  }
                </div>
              </div>
            }

            @if (!filtro() && f.resumen) {
              <div class="mb-5 rounded-[.75rem] border border-solid border-border py-3 pr-[.625rem] pl-[calc(.625rem+1px)]">
                <p role="heading" aria-level="2" class="m-0 mb-[.25rem] text-[.875rem] font-bold text-foreground">Resumen</p>
                <p class="m-0 text-[.8125rem] leading-[1.5] text-(--ink2)">{{ f.resumen }}</p>
              </div>
            }

            @for (g of grupos(); track g.clave; let primero = $first) {
              <div [class.mt-5]="!primero">
                <div class="flex items-baseline justify-between gap-3 border-0 border-b border-solid border-border pb-2 pl-[calc(.625rem+1px)] text-[.875rem] font-bold text-foreground">
                  {{ g.titulo }}<span class="flex-none text-[.75rem] font-semibold text-muted-foreground">{{ pts(g.c) }} de {{ pts(g.a) }}</span>
                </div>
                @for (c of g.criterios; track c.codigo) {
                  @let cambio = borrador()[c.codigo] !== guardado()[c.codigo];
                  <div [id]="'c-' + id(c.codigo)" class="grid scroll-mt-3 items-start gap-x-3 gap-y-[.375rem] border-0 border-b border-solid py-3 pr-[.625rem] pl-[calc(.625rem+1px)]"
                       [class]="(f.cliente === 'FOH' ? 'grid-cols-[minmax(0,1fr)_auto] ' : 'grid-cols-[2.5rem_minmax(0,1fr)_auto] ')
                                + (cambio ? 'rounded-[.625rem] border-b-transparent bg-[color-mix(in_srgb,var(--am-bg)_70%,transparent)]' : 'border-(--line2)')
                                + (brilla() === c.codigo ? ' animate-[sp-brilla_1.6s_ease-out]' : '')">
                    @if (f.cliente !== 'FOH') {
                      <div class="pt-[.0625rem] text-[.8125rem] font-semibold text-(--ink2)">{{ c.codigo }}<small class="block text-[.6875rem] font-medium text-muted-foreground">{{ pts(c.puntos) }} pts</small></div>
                    }
                    <div class="min-w-0">
                      <span class="block text-[.875rem] leading-[1.4] font-semibold text-foreground">{{ c.texto }}</span>
                      @if (c.frase) {
                        <button type="button" [class]="EVI" [disabled]="!lineasDeCriterio()[c.codigo]?.length" [attr.aria-pressed]="verDe() === c.codigo" title="Ver en la transcripción"
                                (click)="verLinea(c.codigo, lineasDeCriterio()[c.codigo] || [])">{{ c.frase }}</button>
                      }
                      @if (c.motivo) { <p class="m-0 mt-[.25rem] text-[.75rem] leading-[1.45] text-muted-foreground">{{ c.motivo }}</p> }
                    </div>
                    <div class="flex items-center gap-[.375rem]">
                      @if (cambio) {
                        <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI" aria-label="Revertir" title="Revertir" (click)="revertir(c.codigo)">
                          <lucide-angular name="undo-2" [size]="16" class="flex"></lucide-angular>
                        </button>
                      } @else { <span class="size-8 flex-none"></span> }
                      @if (f.editable) {
                        <div class="inline-flex gap-[.1875rem] rounded-[.5rem] bg-muted p-[.1875rem]" role="group" [attr.aria-label]="'Resultado de ' + c.texto">
                          @for (o of opciones(c); track o) {
                            <button type="button" [class]="RES_BTN + ' ' + (o === 'CUMPLE' ? RES_SI : o === 'NO_CUMPLE' ? RES_NO : '')" [attr.aria-pressed]="borrador()[c.codigo] === o"
                                    [attr.aria-label]="RES[o]" [title]="RES[o]" (click)="elegir(c.codigo, o)">
                              @if (o === 'NA') { NA } @else { <lucide-angular [name]="o === 'CUMPLE' ? 'check' : 'x'" [size]="16" class="flex"></lucide-angular> }
                            </button>
                          }
                        </div>
                      } @else {
                        <span [class]="PILL[borrador()[c.codigo] === 'CUMPLE' ? 'ok' : borrador()[c.codigo] === 'NO_CUMPLE' ? 'ro' : 'neu']">{{ RES[borrador()[c.codigo] || 'NA'] }}</span>
                      }
                    </div>
                    @if (cambio) {
                      <div class="flex min-w-0 flex-col gap-[.3125rem]" [class]="f.cliente === 'FOH' ? 'col-[1/-1]' : 'col-[2/-1]'">
                        <label [for]="'mot-' + id(c.codigo)" class="text-[.75rem] font-medium text-(--ink2)">Motivo del cambio</label>
                        <textarea [id]="'mot-' + id(c.codigo)" rows="2" maxlength="500" [class]="ENTRADA + ' h-auto! min-h-[3.5rem] resize-y' + (motivoMal(c.codigo) ? ' border-(--ro-ln)!' : '')"
                                  [value]="motivos()[c.codigo] || ''" (input)="escribirMotivo(c.codigo, $any($event.target).value)"></textarea>
                        <small class="text-[.75rem]" [class]="motivoMal(c.codigo) ? 'font-medium text-(--ro)' : 'text-muted-foreground'">
                          {{ motivoMal(c.codigo) ? 'Escribe el motivo, de al menos ' + MIN_MOTIVO + ' caracteres' : (motivos()[c.codigo] || '').length + ' de 500 caracteres' }}
                        </small>
                      </div>
                    } @else if (c.historial; as h) {
                      <div class="flex min-w-0 flex-wrap gap-x-[.875rem] gap-y-[.125rem] text-[.75rem] text-muted-foreground" [class]="f.cliente === 'FOH' ? 'col-[1/-1]' : 'col-[2/-1]'">
                        <span><span class="font-semibold text-(--ink2)">Corregido</span> por {{ h.usuario }} el {{ h.fecha }}</span>
                        <span>Valor anterior: {{ h.antes ? RES[h.antes] : '—' }}</span><span>Motivo: {{ h.motivo }}</span>
                      </div>
                    }
                    @if (c.codigo === '3.4' && f.cuentas.length) {
                      <div class="col-[2/-1] grid min-w-0 grid-cols-[auto_auto_1fr_auto] gap-y-[.375rem]">
                        @for (k of f.cuentas; track k.cj) {
                          <div class="col-[1/-1] grid grid-cols-subgrid items-center gap-x-5 rounded-[.625rem] border border-solid border-border bg-card px-3 py-2">
                            <div><small class="block text-[.6875rem] leading-[1.3] text-muted-foreground">CJ</small><span class="text-[.8125rem] font-semibold whitespace-nowrap">{{ k.cj }}</span></div>
                            <div><small class="block text-[.6875rem] leading-[1.3] text-muted-foreground">Óptimo</small><span class="text-[.8125rem] font-semibold whitespace-nowrap">{{ soles(k.optimo) }}</span></div>
                            <div><small class="block text-[.6875rem] leading-[1.3] text-muted-foreground">Acordado</small><span class="text-[.8125rem] font-semibold whitespace-nowrap">{{ soles(k.acordado) }}</span>
                              @if (k.acordado != null && k.pagos) { <small class="block text-[.6875rem] leading-[1.3] text-muted-foreground">en {{ k.pagos }} {{ k.pagos === 1 ? 'pago' : 'pagos' }}</small> }</div>
                            @if (k.llegaAlOptimo != null) { <span [class]="PILL[k.llegaAlOptimo ? 'ok' : 'ro']">{{ k.llegaAlOptimo ? 'Llega al óptimo' : 'Por debajo del óptimo' }}</span> } @else { <span></span> }
                          </div>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
            } @empty {
              <div [class]="VACIO">{{ filtro() === 'nc' ? 'Ningún criterio está en No cumple' : 'Sin criterios corregidos' }}</div>
            }
          </div>
        } @else {
          <div [class]="VACIO">{{ error() || 'Cargando…' }}</div>
        }
      </section>

      <section appTarjeta class="flex min-h-0 min-w-0 flex-col self-stretch overflow-hidden px-[1.125rem] pt-[1.125rem] pb-0">
        <p role="heading" aria-level="2" class="m-0 mb-[.75rem] text-[1rem] leading-[1.25] font-bold text-foreground">Llamada</p>
        @if (ficha(); as f) {
          <dl class="m-0 grid flex-none grid-cols-[minmax(0,1.35fr)_minmax(0,.75fr)_minmax(0,.9fr)] gap-x-3 gap-y-[.625rem] [@media(max-height:700px)]:gap-y-[.375rem]">
            <div class="min-w-0"><dt class="text-[.75rem] text-muted-foreground">Fecha</dt><dd class="m-0 text-[.8125rem] font-semibold [overflow-wrap:anywhere]">{{ fechaCorta(f.fecha) }} {{ f.hora }}</dd></div>
            <div class="min-w-0"><dt class="text-[.75rem] text-muted-foreground">Duración</dt><dd class="m-0 text-[.8125rem] font-semibold">{{ f.duracion ? mmss(f.duracion) : '—' }}</dd></div>
            <div class="min-w-0"><dt class="text-[.75rem] text-muted-foreground">Cliente</dt><dd class="m-0 text-[.8125rem] font-semibold [overflow-wrap:anywhere]">{{ f.titular || '—' }}</dd></div>
            @if (f.cliente === 'IBK' && f.rubrica === 'TIT') {
              <div class="min-w-0"><dt class="text-[.75rem] text-muted-foreground">CJ</dt><dd class="m-0 text-[.8125rem] font-semibold [overflow-wrap:anywhere]">{{ f.cj || '—' }}</dd></div>
            }
          </dl>
          @if (f.audios.length) {
            <div class="mt-[.875rem] [@media(max-height:700px)]:mt-[.625rem] flex flex-none items-center gap-3 rounded-[.625rem] border border-solid border-border bg-card p-[.375rem]">
              <button type="button" appBoton="secundario" appBotonAlto="icono" [class]="MINI + ' rounded-[.4375rem]!'" [attr.aria-label]="sonando() ? 'Pausar' : 'Reproducir'" (click)="alternarAudio()">
                <lucide-angular [name]="sonando() ? 'pause' : 'play'" [size]="16" class="flex"></lucide-angular>
              </button>
              <span class="flex-none text-[.75rem] whitespace-nowrap text-muted-foreground">{{ mmss(posicion_()) }}</span>
              <div #riel class="relative h-[.3125rem] flex-1 cursor-pointer touch-none rounded-full bg-muted before:absolute before:inset-x-0 before:-inset-y-2 before:content-['']"
                   role="slider" tabindex="0" aria-label="Posición del audio" [attr.aria-valuemin]="0" [attr.aria-valuemax]="duracion()" [attr.aria-valuenow]="posicion_()"
                   (pointerdown)="arrastrar($event)" (keydown.arrowleft)="saltar(-5)" (keydown.arrowright)="saltar(5)">
                <i class="absolute inset-y-0 left-0 rounded-[inherit] bg-(--verde-txt)" [style.width.%]="avance()"></i>
                <span class="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-solid border-(--verde-txt) bg-card" [style.left.%]="avance()"></span>
              </div>
              <span class="flex-none text-[.75rem] whitespace-nowrap text-muted-foreground">{{ mmss(duracion()) }}</span>
              <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI" aria-label="Velocidad de reproducción" (click)="cambiarVelocidad()">{{ velocidadTexto() }}</button>
            </div>
          }
          <div class="mt-4 mb-[.75rem] flex flex-none items-center gap-3 border-0 border-t border-solid border-(--line2) pt-4 [@media(max-height:700px)]:mt-[.75rem] [@media(max-height:700px)]:mb-[.5rem] [@media(max-height:700px)]:pt-[.75rem]">
            <p role="heading" aria-level="3" class="m-0 text-[.9375rem] font-bold text-foreground">Transcripción</p>
            <div [class]="BUSCAR + ' ml-auto min-w-0 flex-auto'">
              <lucide-angular name="search" [size]="16" [class]="BUSCAR_ICONO"></lucide-angular>
              <input [class]="BUSCAR_TR" placeholder="Buscar" aria-label="Buscar en la transcripción" [disabled]="!lineas().length" [value]="q()" (input)="buscarTexto($any($event.target).value)" (keydown.enter)="siguienteCoincidencia()">
            </div>
          </div>
          <div #zonaTr class="-mx-[1.125rem] flex min-h-0 flex-1 flex-col overflow-y-auto px-[1.25rem] pb-[1.125rem]" (wheel)="soltar()" (touchmove)="soltar()">
            @if (!lineas().length) {
              <div [class]="VACIO">Sin transcripción</div>
            } @else {
              <div class="flex flex-col gap-3">
                @for (t of turnos(); track t.desde) {
                  <div class="flex flex-col gap-1" [class]="t.quien === 'ASESOR' ? 'items-end' : 'items-start'">
                    <span class="px-[.375rem] text-[.75rem] font-semibold" [class]="t.quien === 'ASESOR' ? 'text-(--verde-txt)' : 'text-muted-foreground'">{{ t.quien === 'ASESOR' ? 'Asesor' : f.rubrica === 'TER' ? 'Tercero' : 'Cliente' }}</span>
                    @for (i of t.indices; track i; let ultimo = $last) {
                      <div [id]="'ln-' + i" [class]="burbuja(t.quien, i, ultimo)" [title]="'Escuchar desde ' + mmss(ini()[i] || 0)" (click)="oir(i)">
                        <p class="m-0 text-[.8125rem] leading-[1.5] text-foreground" [innerHTML]="resaltado(i)"></p>
                        @if (marcasDe()[i]; as ms) {
                          <span class="flex flex-wrap justify-end gap-1">
                            @for (m of ms; track m) {
                              <button type="button" class="cursor-pointer rounded-full border border-solid border-border bg-card px-[.4375rem] text-[.6875rem] leading-[1.125rem] font-semibold text-muted-foreground transition-colors duration-150 hover:border-(--campo-ln) hover:text-foreground"
                                      [title]="m === 'FALTA' ? 'Ver la falta crítica' : 'Ver el criterio ' + m" (click)="irCriterio(m); $event.stopPropagation()">{{ m === 'FALTA' ? 'Falta' : m }}</button>
                            }
                          </span>
                        }
                      </div>
                    }
                  </div>
                }
              </div>
              @if (sonando() && !sigue()) {
                <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI + ' sticky bottom-2 z-[1] mx-auto mt-[.75rem] flex shadow-[0_4px_12px_rgb(0_0_0/.12)]'" (click)="seguir()">
                  <lucide-angular name="arrow-down" [size]="16" class="flex"></lucide-angular>Seguir el audio
                </button>
              }
            }
          </div>
        }
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      <span [class]="estadoBarra()[1]">{{ estadoBarra()[0] }}</span>
      @if (ficha(); as f) {
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="excel()">
          <lucide-angular name="download" [size]="16" class="flex"></lucide-angular>Descargar Excel
        </button>
        @if (yaRevisada() && !pendientes() && falta_() !== 'PENDIENTE') {
          <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="!siguientePorRevisar()" (click)="irSiguientePorRevisar()">
            Siguiente por revisar<lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular>
          </button>
        }
        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="!pendientes()" (click)="descartar()">Descartar</button>
        @if (pendientes()) {
          <button type="button" appBoton="primario" class="px-4!" [disabled]="guardando() || !f.editable" (click)="guardar()">
            <lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Guardar cambios
          </button>
        } @else if (!yaRevisada() || falta_() === 'PENDIENTE') {
          <button type="button" appBoton="primario" class="px-4!" [disabled]="guardando() || !f.editable || falta_() === 'PENDIENTE'"
                  [title]="falta_() === 'PENDIENTE' ? 'Confirma o descarta la falta crítica primero' : 'Escuché el audio y estoy conforme con la evaluación'" (click)="revisado()">
            <lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Revisado
          </button>
        }
      }
    </div>
  `,
  styles: [`@keyframes sp-brilla { from { background-color: var(--am-bg); } to { background-color: transparent; } }`]
})
export class RevisionLlamadaComponent implements OnDestroy {
  private readonly injector = inject(Injector);
  private readonly servicio = inject(MonitoreoService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly ruta = inject(ActivatedRoute);
  protected readonly e = inject(MonitoreoEstado);

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly INDICADORES = INDICADORES; protected readonly TITULO = TITULO; protected readonly SUBTITULO = SUBTITULO; protected readonly PILL = PILL;
  protected readonly BARRA = BARRA; protected readonly BOTON_SEC = BOTON_SEC + ' ' + BOTON_APAGADO; protected readonly MINI = MINI; protected readonly MINI_PELIGRO = MINI_PELIGRO;
  protected readonly ENTRADA = ENTRADA; protected readonly BUSCAR = BUSCAR; protected readonly BUSCAR_CAMPO = BUSCAR_CAMPO;
  /** El buscador de la transcripción es más bajo que los campos de filtro. */
  protected readonly BUSCAR_TR = BUSCAR_CAMPO.replace('h-[2.375rem]!', 'h-[2.125rem]!'); protected readonly BUSCAR_ICONO = BUSCAR_ICONO;
  protected readonly RES = RES; protected readonly MIN_MOTIVO = MIN_MOTIVO;
  protected readonly oracion = oracion; protected readonly pct = pct; protected readonly pts = pts; protected readonly mmss = mmss; protected readonly fechaCorta = fechaCorta;
  protected readonly soles = enSoles;
  /** Frase citada: enlaza con su línea de la transcripción. */
  protected readonly EVI = 'mt-[.375rem] block max-w-full cursor-pointer border-0 border-l-2 border-solid border-border bg-transparent py-[.0625rem] pr-0 pl-[.625rem] text-left [font-family:inherit] text-[.8125rem] leading-[1.45] text-(--ink2) '
    + 'hover:border-l-(--am-pt) hover:text-foreground aria-pressed:border-l-(--am-pt) aria-pressed:text-foreground disabled:cursor-default disabled:hover:border-l-border disabled:hover:text-(--ink2)';
  protected readonly RES_BTN = 'grid h-7 w-8 cursor-pointer place-items-center rounded-[.375rem] border border-solid border-transparent bg-transparent [font-family:inherit] text-[.6875rem] font-bold '
    + 'text-[color-mix(in_srgb,var(--foreground)_55%,transparent)] hover:text-foreground aria-pressed:bg-(--seg-activo) aria-pressed:text-foreground aria-pressed:shadow-[0_1px_2px_rgb(0_0_0/.08)]';
  protected readonly RES_SI = 'aria-pressed:border-(--ok-ln)! aria-pressed:bg-(--ok-bg)! aria-pressed:text-(--ok)!';
  protected readonly RES_NO = 'aria-pressed:border-(--ro-ln)! aria-pressed:bg-(--ro-bg)! aria-pressed:text-(--ro)!';

  readonly ficha = signal<Ficha | null>(null);
  readonly error = signal('');
  readonly lineas = signal<Linea[]>([]);
  readonly guardado = signal<Record<string, Resultado | null>>({});
  readonly borrador = signal<Record<string, Resultado | null>>({});
  readonly motivos = signal<Record<string, string>>({});
  readonly intento = signal(false);
  /** Estado de la falta en pantalla; se guarda con el cierre. */
  readonly falta_ = signal<EstadoFalta | null>(null);
  readonly filtro = signal<'' | 'nc' | 'corr'>('');
  readonly verDe = signal<string | null>(null);
  readonly ver = signal<number[]>([]);
  readonly brilla = signal<string | null>(null);
  readonly q = signal('');
  readonly qi = signal(0);
  readonly guardando = signal(false);

  // ---------- audio ----------
  private audio?: HTMLAudioElement;
  private url?: string;
  /** La descarga del audio en curso y las acciones pedidas mientras llega: una sola descarga y un solo reproductor. */
  private descarga?: Subscription;
  private pendientes_: (() => void)[] = [];
  readonly sonando = signal(false);
  readonly posicion_ = signal(0);
  readonly sigue = signal(true);
  readonly velocidad = signal(1);
  readonly lineaSonando = signal(-1);

  @ViewChild('zonaCriterios') private zonaCriterios?: ElementRef<HTMLElement>;
  @ViewChild('zonaTr') private zonaTr?: ElementRef<HTMLElement>;
  @ViewChild('riel') private riel?: ElementRef<HTMLElement>;

  readonly idx = computed(() => this.ficha()?.idx ?? null);
  readonly unaNota = computed(() => this.ficha()?.cliente === 'FOH' || this.ficha()?.rubrica === 'TER');
  readonly hoy = computed(() => notas(this.ficha()?.rubrica ?? 'PDP', this.ficha()?.criterios ?? [], this.borrador(), this.falta_()));
  readonly guardadas = computed(() => notas(this.ficha()?.rubrica ?? 'PDP', this.ficha()?.criterios ?? [], this.guardado(), this.ficha()?.falta?.estado ?? null));
  readonly grande = computed(() => this.unaNota() ? this.hoy().interna : this.hoy().interbank);
  readonly grandeAntes = computed(() => this.unaNota() ? this.guardadas().interna : this.guardadas().interbank);
  readonly cambios = computed(() => (this.ficha()?.criterios ?? []).filter(c => this.borrador()[c.codigo] !== this.guardado()[c.codigo]));
  readonly faltaCambio = computed(() => !!this.ficha()?.falta && this.falta_() !== this.ficha()!.falta!.estado);
  readonly pendientes = computed(() => this.cambios().length + (this.faltaCambio() ? 1 : 0));
  readonly aplican = computed(() => (this.ficha()?.criterios ?? []).filter(c => this.borrador()[c.codigo] !== 'NA').length);
  readonly noCumplen = computed(() => (this.ficha()?.criterios ?? []).filter(c => this.borrador()[c.codigo] === 'NO_CUMPLE').length);
  readonly corregidos = computed(() => (this.ficha()?.criterios ?? []).filter(c => c.historial || this.borrador()[c.codigo] !== this.guardado()[c.codigo]).length);
  readonly yaRevisada = computed(() => (this.ficha()?.revisiones.length ?? 0) > 0);
  readonly faltaActiva = computed(() => this.falta_() === 'PENDIENTE' || this.falta_() === 'CONFIRMADA');
  readonly tituloFalta = computed(() => this.falta_() === 'PENDIENTE' ? 'Falta crítica por confirmar' : this.falta_() === 'CONFIRMADA' ? 'Falta crítica confirmada' : 'Falta crítica descartada');
  readonly efectoFalta = computed(() => this.falta_() === 'PENDIENTE' ? 'La nota queda en 0 hasta que la confirmes o la descartes.'
    : this.falta_() === 'CONFIRMADA' ? 'La nota queda en 0.' : 'La nota se calcula con los criterios.');

  readonly estadoPill = computed((): [string, 'neu' | 'am' | 'ro' | 'ok' | 'info'] => {
    const f = this.ficha();
    if (!f) return ['', 'neu'];
    if (this.pendientes()) return ['Cambios sin guardar', 'neu'];
    if (this.falta_() === 'PENDIENTE') return ['Falta por confirmar', 'ro'];
    if (!this.yaRevisada()) return ['Por revisar', 'am'];
    const ajustes = f.criterios.some(c => c.resultado !== c.resultadoIa) || f.falta?.estado === 'DESCARTADA';
    return ajustes ? ['Revisada con ajustes', 'info'] : ['Revisada', 'ok'];
  });

  readonly estadoBarra = computed((): [string, string] => {
    const sinMotivo = this.cambios().filter(c => (this.motivos()[c.codigo] || '').trim().length < MIN_MOTIVO).length;
    if (this.pendientes() && sinMotivo && this.intento()) return [sinMotivo === 1 ? 'Falta el motivo de 1 cambio' : `Falta el motivo de ${sinMotivo} cambios`, BARRA_ESTADO_MAL];
    if (this.pendientes()) return [this.pendientes() === 1 ? '1 cambio sin guardar' : `${this.pendientes()} cambios sin guardar`, BARRA_ESTADO_HAY];
    if (this.falta_() === 'PENDIENTE') return ['Falta crítica por confirmar', BARRA_ESTADO_HAY];
    const r = this.ficha()?.revisiones[0];
    if (r) {
      const f = this.ficha()!, aj = f.criterios.filter(c => c.resultado !== c.resultadoIa).length;
      const que = [aj ? (aj === 1 ? '1 criterio ajustado' : `${aj} criterios ajustados`) : '', f.falta?.estado === 'DESCARTADA' ? 'falta descartada' : ''].filter(Boolean);
      return [`Revisada por ${r.usuario} el ${r.fecha}, ` + (que.length ? que.join(' y ') : 'conforme con todo'), BARRA_ESTADO];
    }
    return ['Sin cambios', BARRA_ESTADO];
  });

  readonly grupos = computed(() => {
    const f = this.ficha();
    if (!f) return [];
    const filtro = this.filtro(), b = this.borrador(), g = this.guardado();
    const visible = (c: Criterio): boolean => !filtro || (filtro === 'nc' ? b[c.codigo] === 'NO_CUMPLE' : !!c.historial || b[c.codigo] !== g[c.codigo]);
    const claves = [...ORDEN, ...[...new Set(f.criterios.map(c => c.grupo))].filter(x => !ORDEN.includes(x))];
    return claves.map(clave => {
      const todos = f.criterios.filter(c => c.grupo === clave);
      let c = 0, a = 0;
      todos.forEach(x => { const r = b[x.codigo]; if (r === 'NA' || r == null) return; a += x.puntos; if (r === 'CUMPLE') c += x.puntos; });
      const titulo = clave === 'T' ? 'Tercero relacionado' : f.cliente === 'FOH' ? (PAUTA[clave] ?? oracion(clave)) : `${clave}. ${PAUTA[clave] ?? clave}`;
      return { clave, titulo, c, a, criterios: todos.filter(visible) };
    }).filter(x => x.criterios.length);
  });

  // ---------- transcripción ----------
  /** La duración real del audio cuando ya cargó: la registrada en la gestión puede no coincidir con el archivo. */
  private readonly duracionAudio = signal(0);
  readonly ini = computed(() => inicios(this.lineas(), this.duracionAudio() || (this.ficha()?.duracion ?? null)));
  readonly duracion = computed(() => this.duracionAudio() || this.ficha()?.duracion || Math.round(this.ini().at(-1) ?? 0) + 5);
  readonly avance = computed(() => this.duracion() ? Math.min(100, (this.posicion_() / this.duracion()) * 100) : 0);
  readonly velocidadTexto = computed(() => String(this.velocidad()).replace('.', ',') + '×');
  readonly lineasDeCriterio = computed(() => Object.fromEntries((this.ficha()?.criterios ?? []).map(c => [c.codigo, lineasDe(c.frase, this.lineas())])) as Record<string, number[]>);
  readonly lineasFalta = computed(() => lineasDe(this.ficha()?.falta?.frase, this.lineas()));
  /** Las marcas de cada línea: los criterios (y la falta) cuya frase está ahí. */
  readonly marcasDe = computed(() => {
    const por: Record<number, string[]> = {};
    if (this.ficha()?.cliente === 'FOH') return por;
    Object.entries(this.lineasDeCriterio()).forEach(([cod, ls]) => ls.forEach(i => (por[i] ||= []).push(cod)));
    this.lineasFalta().forEach(i => (por[i] ||= []).push('FALTA'));
    return por;
  });
  readonly turnos = computed(() => {
    const salida: { quien: Linea['quien']; desde: number; indices: number[] }[] = [];
    this.lineas().forEach((l, i) => {
      const ultimo = salida[salida.length - 1];
      if (ultimo && ultimo.quien === l.quien) ultimo.indices.push(i); else salida.push({ quien: l.quien, desde: i, indices: [i] });
    });
    return salida;
  });

  readonly posicion = computed(() => this.e.visibles().findIndex(l => l.idx === this.idx()));
  readonly siguientePorRevisar = computed(() => this.e.visibles().find(l => l.idx !== this.idx() && l.estado === 'POR_REVISAR') ?? null);

  constructor() {
    this.ruta.paramMap.subscribe(p => this.cargar(+(p.get('idx') ?? 0)));
  }

  ngOnDestroy(): void { this.pararAudio(true); }

  private cargar(idx: number): void {
    this.pararAudio(true);
    this.ficha.set(null); this.error.set(''); this.lineas.set([]); this.filtro.set(''); this.verDe.set(null); this.ver.set([]); this.q.set('');
    forkJoin({
      ficha: this.servicio.ficha(idx),
      texto: this.servicio.transcripcion(idx).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ ficha, texto }) => {
        this.e.ultima.set(idx);
        this.aplicar(ficha);
        this.lineas.set(leerLineas(texto));
      },
      error: err => this.error.set(err?.error?.message || 'No se pudo abrir la llamada')
    });
  }

  private aplicar(f: Ficha): void {
    const res = Object.fromEntries(f.criterios.map(c => [c.codigo, c.resultado])) as Record<string, Resultado | null>;
    this.ficha.set(f);
    this.guardado.set(res);
    this.borrador.set({ ...res });
    this.motivos.set({});
    this.intento.set(false);
    this.falta_.set(f.falta?.estado ?? null);
  }

  // ---------- criterios ----------
  protected id(cod: string): string { return cod.replace(/\./g, '-'); }
  protected sinPunto(t: string | null): string { return (t ?? '').replace(/\.$/, ''); }
  protected opciones(c: Criterio): Resultado[] { return [...(c.admiteNa ? ['NA' as Resultado] : []), 'NO_CUMPLE', 'CUMPLE']; }

  /** Un clic sobre la opción ya elegida pasa a la contraria (✓ ↔ ✗); NA no tiene contraria. */
  elegir(cod: string, r: Resultado): void {
    let nuevo = r;
    if (this.borrador()[cod] === r) {
      if (r === 'NA') return;
      nuevo = r === 'CUMPLE' ? 'NO_CUMPLE' : 'CUMPLE';
    }
    this.borrador.update(b => ({ ...b, [cod]: nuevo }));
    if (nuevo === this.guardado()[cod]) this.motivos.update(m => { const x = { ...m }; delete x[cod]; return x; });
    // Después del repintado: con eventCoalescing el campo aún no existe en el siguiente setTimeout.
    else afterNextRender(() => { const t = document.getElementById('mot-' + this.id(cod)) as HTMLTextAreaElement | null; if (t && !t.value) t.focus({ preventScroll: true }); }, { injector: this.injector });
  }
  revertir(cod: string): void {
    this.borrador.update(b => ({ ...b, [cod]: this.guardado()[cod] }));
    this.motivos.update(m => { const x = { ...m }; delete x[cod]; return x; });
  }
  escribirMotivo(cod: string, v: string): void { this.motivos.update(m => ({ ...m, [cod]: v })); }
  motivoMal(cod: string): boolean { return this.intento() && (this.motivos()[cod] || '').trim().length < MIN_MOTIVO; }
  filtrar(f: 'nc' | 'corr'): void { this.filtro.set(this.filtro() === f ? '' : f); this.zonaCriterios?.nativeElement.scrollTo({ top: 0 }); }
  antes(v: number | null, a: number | null): string { return this.pendientes() && v !== a ? `Antes ${pct(a)} %` : ''; }

  descartar(): void {
    this.borrador.set({ ...this.guardado() });
    this.motivos.set({});
    this.intento.set(false);
    this.falta_.set(this.ficha()?.falta?.estado ?? null);
  }

  guardar(): void {
    const f = this.ficha();
    if (!f) return;
    const sinMotivo = this.cambios().find(c => (this.motivos()[c.codigo] || '').trim().length < MIN_MOTIVO);
    if (sinMotivo) {
      this.intento.set(true);
      const t = document.getElementById('mot-' + this.id(sinMotivo.codigo));
      t?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      (t as HTMLTextAreaElement | null)?.focus({ preventScroll: true });
      return;
    }
    const criterios = Object.fromEntries(this.cambios().map(c => [c.codigo, { resultado: this.borrador()[c.codigo]!, motivo: this.motivos()[c.codigo].trim() }]));
    this.cerrar({ criterios, falta: this.faltaCambio() && this.falta_() !== 'PENDIENTE' ? this.falta_() as 'CONFIRMADA' | 'DESCARTADA' : null }, true);
  }

  excel(): void {
    const sub = this.e.idSubcartera();
    if (sub) this.servicio.bajarExcel(sub, this.e.desde(), this.e.hasta(), () => this.toast.error('No se pudo descargar el Excel'));
  }

  revisado(): void {
    if (this.falta_() === 'PENDIENTE') return;
    this.cerrar({ criterios: {}, falta: null }, false);
  }

  private cerrar(cierre: { criterios: Record<string, { resultado: Resultado; motivo: string }>; falta: 'CONFIRMADA' | 'DESCARTADA' | null }, conCambios: boolean): void {
    const f = this.ficha()!;
    this.guardando.set(true);
    this.servicio.cerrar(f.idx, cierre).subscribe({
      next: nueva => {
        this.guardando.set(false);
        this.aplicar(nueva);
        // La lista refleja el cierre sin volver a pedirla.
        const estado = nueva.criterios.some(c => c.resultado !== c.resultadoIa) || nueva.falta?.estado === 'DESCARTADA' ? 'REVISADA_AJUSTES' : 'REVISADA';
        const r = nueva.revisiones[0];
        this.e.llamadas.update(ls => ls.map(l => l.idx !== nueva.idx ? l : {
          ...l, estado, falta: nueva.falta?.estado ?? null, revisadoPor: r?.usuario ?? null, revisadoEn: r?.fecha ?? null,
          puntos: this.hoy().anula ? 0 : this.hoy().cumplidos, posibles: this.hoy().posibles }));
        if (conCambios) {
          const n = notas(nueva.rubrica, nueva.criterios, this.guardado(), nueva.falta?.estado ?? null);
          this.toast.success(`Evaluación corregida. ${nueva.cliente === 'FOH' ? 'Puntaje' : nueva.rubrica === 'TER' ? 'Nota' : 'Nota Interbank'} ${pct(nueva.cliente === 'FOH' || nueva.rubrica === 'TER' ? n.interna : n.interbank)} %`);
        } else {
          this.toast.success('Llamada marcada como revisada');
        }
      },
      error: err => { this.guardando.set(false); this.toast.error(err?.error?.message || 'No se pudo guardar la revisión'); }
    });
  }

  // ---------- navegación ----------
  volver(): void { this.router.navigate(['/admin/recordings'], { queryParams: { tab: 'monitoreo' } }); }
  mover(d: number): void {
    const l = this.e.visibles()[this.posicion() + d];
    if (l) this.router.navigate(['/admin/recordings/llamada', l.idx], { replaceUrl: true });
  }
  irSiguientePorRevisar(): void {
    const l = this.siguientePorRevisar();
    if (l) this.router.navigate(['/admin/recordings/llamada', l.idx], { replaceUrl: true });
  }

  // ---------- transcripción y criterios enlazados ----------
  verLinea(cod: string, lineas: number[]): void {
    if (this.verDe() === cod) { this.verDe.set(null); this.ver.set([]); return; }
    if (!lineas.length) return;
    this.soltar();
    this.verDe.set(cod);
    this.ver.set(lineas);
    afterNextRender(() => this.centrar(document.getElementById('ln-' + lineas[0]), this.zonaTr?.nativeElement), { injector: this.injector });
  }
  irCriterio(cod: string): void {
    const el = document.getElementById(cod === 'FALTA' ? 'c-falta' : 'c-' + this.id(cod));
    if (this.filtro()) this.filtro.set('');
    afterNextRender(() => {
      const destino = document.getElementById(cod === 'FALTA' ? 'c-falta' : 'c-' + this.id(cod)) ?? el;
      destino?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      this.brilla.set(cod);
      setTimeout(() => this.brilla.set(null), 1600);
    }, { injector: this.injector });
  }
  protected burbuja(quien: Linea['quien'], i: number, ultimo: boolean): string {
    const a = quien === 'ASESOR';
    let c = 'flex max-w-[88%] cursor-pointer flex-col gap-1 rounded-[.875rem] border border-solid px-3 py-[.4375rem] transition-[background-color,border-color] duration-300 hover:border-(--campo-ln) ';
    c += a ? 'border-(--ok-ln) bg-(--ok-bg) ' : 'border-(--line2) bg-muted ';
    if (ultimo) c += a ? 'rounded-br-[.25rem] ' : 'rounded-bl-[.25rem] ';
    if (this.ver().includes(i)) c += 'border-(--am-pt)! bg-(--am-bg)! ';
    if (this.lineaSonando() === i) c += a ? 'border-(--verde-txt)! shadow-[0_0_0_1px_var(--verde-txt)] ' : 'border-muted-foreground! shadow-[0_0_0_1px_var(--muted-foreground)] ';
    return c;
  }
  /** El texto de la línea con las coincidencias de la búsqueda marcadas. */
  protected resaltado(i: number): string {
    const esc = (s: string): string => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const texto = esc(this.lineas()[i].dice), q = this.q().trim();
    if (!q) return texto;
    const re = new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const antes = this.lineas().slice(0, i).reduce((n, l) => n + (esc(l.dice).match(re)?.length ?? 0), 0);
    let k = antes;
    return texto.replace(re, m => `<mark class="rounded-[.125rem] bg-(--am-bg) text-inherit shadow-[0_0_0_1px_var(--am-ln)]${k++ === this.qi() ? ' bg-(--am-ln)!' : ''}">${m}</mark>`);
  }
  buscarTexto(v: string): void { this.q.set(v); this.qi.set(0); this.soltar(); afterNextRender(() => this.irCoincidencia(), { injector: this.injector }); }
  siguienteCoincidencia(): void {
    const total = this.zonaTr?.nativeElement.querySelectorAll('mark').length ?? 0;
    if (!total) return;
    this.qi.set((this.qi() + 1) % total);
    afterNextRender(() => this.irCoincidencia(), { injector: this.injector });
  }
  private irCoincidencia(): void {
    // La enésima marca: el sanitizador de [innerHTML] quita los data-*, y las marcas salen en el orden de las coincidencias.
    const m = this.zonaTr?.nativeElement.querySelectorAll('mark')[this.qi()] as HTMLElement | undefined;
    if (m) this.centrar(m, this.zonaTr?.nativeElement);
  }
  private centrar(el: HTMLElement | null | undefined, zona: HTMLElement | undefined): void {
    if (!el || !zona) return;
    const r = el.getBoundingClientRect(), z = zona.getBoundingClientRect();
    zona.scrollTo({ top: zona.scrollTop + r.top - z.top - (z.height - r.height) / 2, behavior: 'smooth' });
  }

  // ---------- audio ----------
  alternarAudio(): void {
    if (this.sonando()) { this.audio?.pause(); return; }
    this.prepararAudio(() => { this.sigue.set(true); void this.audio!.play(); });
  }
  oir(i: number): void {
    if (window.getSelection()?.toString()) return;
    this.prepararAudio(() => { this.audio!.currentTime = this.ini()[i] ?? 0; this.sigue.set(true); void this.audio!.play(); });
  }
  saltar(s: number): void { this.prepararAudio(() => { this.audio!.currentTime = Math.max(0, Math.min(this.duracion(), this.audio!.currentTime + s)); }); }
  cambiarVelocidad(): void {
    const v = VELOCIDADES[(VELOCIDADES.indexOf(this.velocidad()) + 1) % VELOCIDADES.length];
    this.velocidad.set(v);
    if (this.audio) this.audio.playbackRate = v;
  }
  arrastrar(ev: PointerEvent): void {
    const riel = this.riel?.nativeElement;
    if (!riel) return;
    const ir = (x: number): void => {
      const r = riel.getBoundingClientRect(), p = Math.max(0, Math.min(1, (x - r.left) / r.width));
      this.prepararAudio(() => { this.audio!.currentTime = p * this.duracion(); this.sigue.set(true); });
    };
    ir(ev.clientX);
    const mover = (e: PointerEvent): void => ir(e.clientX);
    const soltar = (): void => { window.removeEventListener('pointermove', mover); window.removeEventListener('pointerup', soltar); };
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
  }
  soltar(): void { if (this.sonando() && this.sigue()) this.sigue.set(false); }
  seguir(): void {
    this.sigue.set(true);
    const i = this.lineaSonando();
    if (i >= 0) this.centrar(document.getElementById('ln-' + i), this.zonaTr?.nativeElement);
  }

  /**
   * El audio se pide recién al primer play: es un WAV que el backend convierte. Mientras llega, los
   * clics no piden otra descarga ni crean otro reproductor; se aplican en orden cuando llega.
   */
  private prepararAudio(luego: () => void): void {
    if (this.audio) { luego(); return; }
    this.pendientes_.push(luego);
    if (this.descarga) return;
    const f = this.ficha();
    if (!f) return;
    this.descarga = this.servicio.audio(f.idx).subscribe({
      next: blob => {
        this.descarga = undefined;
        this.url = URL.createObjectURL(blob);
        const a = new Audio(this.url);
        a.playbackRate = this.velocidad();
        a.addEventListener('play', () => this.sonando.set(true));
        a.addEventListener('pause', () => this.sonando.set(false));
        a.addEventListener('ended', () => this.sonando.set(false));
        a.addEventListener('timeupdate', () => this.alAvanzar(a.currentTime));
        a.addEventListener('loadedmetadata', () => { if (Number.isFinite(a.duration) && a.duration > 0) this.duracionAudio.set(a.duration); });
        this.audio = a;
        const acciones = this.pendientes_;
        this.pendientes_ = [];
        acciones.forEach(accion => accion());
      },
      error: err => {
        this.descarga = undefined; this.pendientes_ = [];
        this.toast.error(err?.status === 503 ? 'El servidor de audio está ocupado; intenta en un momento' : 'No se pudo cargar el audio');
      }
    });
  }
  private alAvanzar(t: number): void {
    this.posicion_.set(t);
    const i = lineaEn(this.ini(), t);
    if (i !== this.lineaSonando()) {
      this.lineaSonando.set(i);
      if (this.sigue() && i >= 0) this.centrar(document.getElementById('ln-' + i), this.zonaTr?.nativeElement);
    }
  }
  /** Con `soltarArchivo` (otra llamada o salir de la pantalla) cancela la descarga y libera el reproductor. */
  private pararAudio(soltarArchivo: boolean): void {
    this.audio?.pause();
    if (soltarArchivo) {
      this.descarga?.unsubscribe();
      this.descarga = undefined; this.pendientes_ = [];
      if (this.audio) { this.audio.removeAttribute('src'); this.audio.load(); }
      if (this.url) URL.revokeObjectURL(this.url);
      this.audio = undefined; this.url = undefined;
      this.sonando.set(false); this.posicion_.set(0); this.lineaSonando.set(-1); this.duracionAudio.set(0);
    }
  }
}
