import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, TemplateRef, ViewChild, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { catchError, forkJoin, of } from 'rxjs';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { BotonDirective } from '../../shared/ui/boton.directive';
import { NombrePropioPipe } from '../../shared/ui/nombre-propio.pipe';
import { TarjetaDirective } from '../../shared/ui/tarjeta.directive';
import { AsistenciaService } from './asistencia.service';
import {
  AmbitoAsistencia, DiaCalendario, HorarioBase, PerfilAsistencia, PersonalAsistencia, PoliticaAsistencia, TipoDia, VacacionesAsesor
} from './asistencia.models';
import { TIPOS_DE_CALENDARIO, hoy, lunesDe, sumarDias } from './asistencia.estilos';
import { AsistenciaInhabilitacionesComponent } from './asistencia-inhabilitaciones.component';
import {
  BARRA, BARRA_ESTADO, BARRA_ESTADO_HAY, BARRA_ESTADO_MAL, CAMPO, ENTRADA, ETIQUETA, FUERTE, LISTA, PILL, PRINCIPAL, REJILLA, SEC, TABLA, TABLA_CAJA, TD, TD_1, TH, THEAD, TR, VACIO, ZONA
} from './ui/clases';
import { MINI, MINI_ICONO } from './ui/ficha-clases';
import { BOTON_APAGADO, BOTON_SEC } from './ui/control-comun';
import { MedidorTabla } from './ui/medidor-tabla';
import { PiePaginaComponent } from './ui/pie-pagina.component';
import { DIAS_LARGOS } from './ui/solicitud-clases';

type Seccion = 'reglas' | 'base' | 'cal' | 'vac' | 'inh';
type CampoRegla = 'td' | 'ts' | 'alm' | 'halm' | 'brk' | 'hbrk';

const aMin = (h: string | null | undefined): number => (h ? Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5)) : 0);
const hora = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const fechaLarga = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}/${f.slice(0, 4)}`;
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const enPalabras = (m: number): string => {
  const h = Math.floor(m / 60), n = m % 60, a = h === 1 ? '1 hora' : `${h} horas`, b = n === 1 ? '1 minuto' : `${n} minutos`;
  return h && n ? `${a} ${b}` : h ? a : b;
};

/** Una subcartera con sus reglas y la jornada con la que se dibujan. */
interface ReglaSub {
  id: number;
  nombre: string;
  cartera: string;
  politica: PoliticaAsistencia | null;
  entrada: string;
  salida: string;
}

/**
 * Configuración de Control de asistencia: las reglas de cada subcartera, el horario base, el calendario y
 * las vacaciones. Reglas y horario se cambian en su sitio y se guardan desde la barra; rigen desde el lunes.
 */
@Component({
  selector: 'app-control-configuracion',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  imports: [NgTemplateOutlet, LucideAngularModule, TarjetaDirective, BotonDirective, NombrePropioPipe, PiePaginaComponent, AsistenciaInhabilitacionesComponent],
  template: `
    <ng-template #icono let-n let-tono="tono" let-chico="chico">
      <span [class]="'grid flex-none place-items-center rounded-[.5rem] ' + (chico ? 'size-6' : 'size-[1.875rem]')"
            [style.color]="tono" [style.background]="'color-mix(in oklab,' + tono + ' 13%,transparent)'" aria-hidden="true">
        <lucide-angular [name]="n" [size]="chico ? 13 : 16" class="flex"></lucide-angular>
      </span>
    </ng-template>

    <!-- La jornada tipo dibujada: tolerancia, almuerzo y break en su hora. -->
    <ng-template #pista let-r let-chica="chica">
      <div [class]="'flex flex-col ' + (chica ? 'gap-1' : 'gap-[.375rem]')">
        <div [class]="'relative rounded-[.5rem] bg-[color-mix(in_oklab,var(--serie-a)_12%,var(--card))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--serie-a)_28%,var(--card))] ' + (chica ? 'h-[1.625rem]' : 'h-9')">
          @for (b of bloques(r); track b.clase) {
            <span [class]="'absolute inset-y-1 min-w-[.375rem] rounded-[.3125rem] ' + b.clase" [style.left.%]="b.izq" [style.width.%]="b.ancho" [title]="b.titulo"></span>
          }
        </div>
        <div class="relative h-4 text-[.6875rem] text-muted-foreground">
          @for (e of eje(r); track e.m; let primero = $first; let ultimo = $last; let i = $index) {
            <span [class]="'absolute top-0 whitespace-nowrap ' + (primero ? '' : ultimo ? '-translate-x-full' : '-translate-x-1/2') + (chica && !primero && !ultimo && i % 2 === 1 ? ' hidden' : '')"
                  [style.left.%]="e.izq">{{ e.texto }}</span>
          }
        </div>
      </div>
    </ng-template>

    <div [class]="REJILLA + ' grid-cols-[minmax(0,1fr)]'">
      <section appTarjeta [class]="PRINCIPAL">
        <ng-container *ngTemplateOutlet="cabecera()" />
        <div class="mb-4 flex flex-none flex-wrap items-center gap-3">
          <div class="flex flex-wrap gap-[.375rem]">
            @for (c of SECCIONES; track c.clave) {
              <button type="button" [class]="CHIP" [attr.aria-pressed]="seccion() === c.clave" (click)="elegir(c.clave)">{{ c.texto }}</button>
            }
          </div>
        </div>

        <div #zona [class]="ZONA">
          @switch (seccion()) {
            @case ('reglas') {
              @if (reglas().length === 1) {
                @let r = reglas()[0];
                <div class="flex min-h-[22rem] flex-[1_0_auto] flex-col gap-5">
                  <div class="flex items-center gap-3">
                    <span class="mr-auto"><span class="block text-[1rem] font-bold text-foreground">{{ r.nombre | nombrePropio }}</span>
                      <small class="text-[.75rem] text-muted-foreground">{{ r.politica?.programada ? 'Cambio desde el ' + corta(r.politica!.programada!.vigenteDesde ?? '') : 'Jornada de ' + r.entrada + ' a ' + r.salida }}</small></span>
                    @if (cambiadaRegla(r.id)) { <button type="button" [class]="MINI" (click)="revertirRegla(r.id)"><lucide-angular name="undo-2" [size]="16" class="flex"></lucide-angular>Revertir</button> }
                  </div>
                  <ng-container *ngTemplateOutlet="pista; context: { $implicit: r, chica: false }" />
                  <div class="grid flex-1 grid-cols-3 border-t border-(--line2) @max-[44.001rem]/p5:grid-cols-1">
                    @for (col of COLUMNAS; track col.titulo; let primera = $first) {
                      <section [class]="'flex min-w-0 flex-col gap-[1.125rem] py-5 ' + (primera ? 'pr-6' : 'border-l border-(--line2) px-6 @max-[44.001rem]/p5:border-t @max-[44.001rem]/p5:border-l-0 @max-[44.001rem]/p5:pl-0')">
                        <div class="flex items-center gap-[.625rem]"><ng-container *ngTemplateOutlet="icono; context: { $implicit: col.icono, tono: col.tono }" /><span class="text-[.875rem] font-semibold text-foreground">{{ col.titulo }}</span></div>
                        <div class="flex flex-col gap-[.875rem]">
                          @for (c of col.campos; track c.campo) {
                            <label class="m-0! flex flex-col gap-[.3125rem]">
                              <span class="text-[.75rem] font-medium text-(--ink2)">{{ c.etiqueta }}</span>
                              <span class="flex items-center gap-2">
                                <input [type]="c.tipo" [class]="claseRegla(r.id, c.campo, false)" [attr.min]="c.tipo === 'number' ? 0 : null" [attr.step]="c.tipo === 'number' ? 5 : null"
                                       [value]="valorRegla(r, c.campo)" (change)="cambiarRegla(r, c.campo, $any($event.target).value)" [attr.aria-label]="c.etiqueta">
                                @if (c.unidad) { <small class="text-[.75rem] text-muted-foreground">{{ c.unidad }}</small> }
                              </span>
                            </label>
                          }
                        </div>
                        <p class="m-0 mt-auto text-[.8125rem] text-(--ink2)">{{ pieRegla(r, col.clave) }}</p>
                      </section>
                    }
                  </div>
                </div>
              } @else if (reglas().length) {
                <div class="grid flex-[1_0_auto] auto-rows-[minmax(min-content,1fr)] grid-cols-2 @max-[60.001rem]/p5:grid-cols-1">
                  @for (r of reglas(); track r.id; let i = $index; let ultima = $last) {
                    <div [class]="claseCompacta(i, ultima)">
                      <div class="flex items-center gap-3">
                        <span class="mr-auto flex flex-wrap items-baseline"><span class="block text-[.9375rem] font-bold text-foreground">{{ r.nombre | nombrePropio }}</span>
                          <small class="ml-2 text-[.75rem] text-muted-foreground">{{ r.politica?.programada ? 'Cambio desde el ' + corta(r.politica!.programada!.vigenteDesde ?? '') : segundaLinea(r) }}</small></span>
                        @if (cambiadaRegla(r.id)) { <button type="button" [class]="MINI" (click)="revertirRegla(r.id)"><lucide-angular name="undo-2" [size]="16" class="flex"></lucide-angular>Revertir</button> }
                      </div>
                      <ng-container *ngTemplateOutlet="pista; context: { $implicit: r, chica: true }" />
                      <div class="grid grid-cols-[minmax(6.5rem,8rem)_minmax(0,1fr)_minmax(0,1.15fr)] items-center gap-x-3 gap-y-2">
                        @for (col of COLUMNAS; track col.titulo) {
                          <div class="flex min-w-0 items-center gap-2"><ng-container *ngTemplateOutlet="icono; context: { $implicit: col.icono, tono: col.tono, chico: true }" /><span class="text-[.8125rem] font-semibold whitespace-nowrap text-foreground">{{ col.corto }}</span></div>
                          @for (c of col.campos; track c.campo) {
                            <label class="m-0! flex min-w-0 items-center gap-[.375rem]">
                              <input [type]="c.tipo" [class]="claseRegla(r.id, c.campo, true) + (c.tipo === 'number' ? ' w-[4.25rem]!' : ' w-[7rem]!')" [attr.min]="c.tipo === 'number' ? 0 : null" [attr.step]="c.tipo === 'number' ? 5 : null"
                                     [value]="valorRegla(r, c.campo)" (change)="cambiarRegla(r, c.campo, $any($event.target).value)" [attr.aria-label]="c.etiqueta + ' de ' + r.nombre">
                              <small class="text-[.6875rem] whitespace-nowrap text-muted-foreground">{{ c.unidadCorta }}</small>
                            </label>
                          }
                        }
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div [class]="VACIO">{{ cargando() ? 'Cargando…' : 'Sin subcarteras en el filtro' }}</div>
              }
            }

            @case ('base') {
              <div class="grid min-h-[24rem] flex-[1_0_auto] grid-rows-[auto_repeat(6,minmax(3.25rem,1fr))_auto]">
                <div [class]="FILA_BASE + ' border-t-0 border-b border-border pb-2 text-[.75rem] font-medium text-muted-foreground'">
                  <span>Día</span><span>Entrada</span><span>Salida</span>
                  <div class="relative h-4">
                    @for (h of EJE_BASE; track h; let primero = $first; let ultimo = $last) {
                      <span [class]="'absolute text-[.6875rem] whitespace-nowrap text-muted-foreground ' + (primero ? '' : ultimo ? '-translate-x-full' : '-translate-x-1/2')" [style.left.%]="posBase(h)">{{ hora(h) }}</span>
                    }
                  </div>
                  <span class="text-right">Horas</span>
                </div>
                @for (d of diasBase(); track d.dia) {
                  <div [class]="FILA_BASE">
                    <span class="text-[.875rem] font-semibold text-foreground">{{ d.nombre }}</span>
                    <input type="time" [class]="claseBase(d.dia, 0)" [value]="d.entrada" [readonly]="d.dia === 6" (change)="cambiarBase(d.dia, 0, $any($event.target).value)" [attr.aria-label]="'Entrada del ' + d.nombre.toLowerCase()">
                    <input type="time" [class]="claseBase(d.dia, 1)" [value]="d.salida" [readonly]="d.dia === 6" (change)="cambiarBase(d.dia, 1, $any($event.target).value)" [attr.aria-label]="'Salida del ' + d.nombre.toLowerCase()">
                    <div class="relative h-[62%] min-h-8 rounded-[.375rem] bg-[linear-gradient(to_right,var(--line2)_1px,transparent_1px)] bg-[length:calc(100%/13)_100%]">
                      @for (b of barrasBase(d); track $index) {
                        <span [class]="'absolute inset-y-0 flex items-center overflow-hidden rounded-[.375rem] border border-solid text-[.75rem] font-medium whitespace-nowrap ' + (b.desde ? '@container/tramo ' : '') + b.clase" [style.left.%]="b.izq" [style.width.%]="b.ancho" [title]="b.titulo">
                          @if (b.desde) {
                            <span class="flex h-full w-full items-center px-[.625rem] whitespace-nowrap @max-[7.5rem]/tramo:flex-col @max-[7.5rem]/tramo:items-start @max-[7.5rem]/tramo:justify-center @max-[7.5rem]/tramo:gap-px @max-[7.5rem]/tramo:px-[.375rem] @max-[7.5rem]/tramo:text-[.6875rem] @max-[7.5rem]/tramo:leading-[1.2] @max-[1.875rem]/tramo:hidden">
                              <span>{{ b.desde }}</span><span class="px-[.3125rem] @max-[7.5rem]/tramo:hidden">–</span><span>{{ b.hasta }}</span>
                            </span>
                          } @else if (b.texto) { <span class="flex h-full w-full items-center px-[.625rem]">{{ b.texto }}</span> }
                        </span>
                      }
                    </div>
                    <span class="text-right">
                      @if (d.dia === 6) { <span [class]="PILL.neu">Opcional</span> } @else { {{ hora(d.jornada) }} }
                    </span>
                  </div>
                }
                <div [class]="FILA_BASE + ' border-border pt-[.625rem] pb-1'">
                  <span></span><span></span><span></span>
                  <span class="flex flex-wrap gap-x-[.875rem] gap-y-1 text-[.75rem] text-(--ink2)">
                    <span class="inline-flex items-center gap-[.375rem]"><i class="size-2 rounded-[.125rem] bg-[color-mix(in_oklab,var(--serie-a)_30%,var(--card))]"></i>Trabajo</span>
                    <span class="inline-flex items-center gap-[.375rem]"><i class="size-2 rounded-[.125rem] bg-(--almuerzo)"></i>Almuerzo</span>
                    @if (politicaBase()?.horaBreak) { <span class="inline-flex items-center gap-[.375rem]"><i class="size-2 rounded-[.125rem] bg-(--break)"></i>Break</span> }
                  </span>
                  <span class="text-right" [class.text-(--ro)]="!!errorBase()"><span class="block text-[.875rem] font-bold">{{ hora(totalBase()) }}</span><small class="text-[.6875rem] text-muted-foreground">lunes a viernes</small></span>
                </div>
              </div>
            }

            @case ('cal') {
              <div class="grid min-h-[24rem] flex-[1_0_auto] grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-7 @max-[56.001rem]/p5:grid-cols-1">
                <section class="flex min-h-0 flex-col">
                  <div class="mb-[.75rem] flex items-center gap-2">
                    <button type="button" [class]="MINI_ICONO" (click)="moverMes(-1)" aria-label="Mes anterior"><lucide-angular name="chevron-left" [size]="16" class="flex"></lucide-angular></button>
                    <span class="flex-1 text-[1rem] font-semibold text-foreground">{{ mesTitulo() }}</span>
                    <button type="button" [class]="MINI_ICONO" (click)="moverMes(1)" aria-label="Mes siguiente"><lucide-angular name="chevron-right" [size]="16" class="flex"></lucide-angular></button>
                  </div>
                  <div class="grid flex-1 auto-rows-[minmax(3.25rem,1fr)] grid-cols-7 gap-1 [grid-template-rows:auto]">
                    @for (d of DIAS_MES; track d) { <span class="pb-1 text-center text-[.75rem] text-muted-foreground">{{ d }}</span> }
                    @for (c of celdasMes(); track c.fecha) {
                      <button type="button" [class]="claseCelda(c)" (click)="nuevoDia(c.fecha)" [title]="c.marca ? (c.marca.tipo ?? '') + ': ' + (c.marca.nombre ?? '') : 'Marcar el ' + fechaLarga(c.fecha)">
                        <span class="text-[.8125rem] font-semibold">{{ +c.fecha.slice(8, 10) }}</span>
                        @if (c.marca) { <small class="block w-full truncate text-[.6875rem] leading-[1.25]">{{ c.marca.nombre }}</small> }
                      </button>
                    }
                  </div>
                </section>
                <section class="flex min-h-0 flex-col">
                  @if (formDia(); as n) {
                    <div class="mb-[.75rem] flex flex-col gap-[.75rem] rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
                      <div class="flex flex-wrap items-end gap-3">
                        <div [class]="CAMPO + ' flex-[0_1_9.5rem]'"><label for="nc-f" [class]="ETIQUETA">Fecha</label><input id="nc-f" type="date" [class]="ENTRADA" [value]="n.fecha" (change)="ponerDia('fecha', $any($event.target).value)"></div>
                        <div [class]="CAMPO + ' flex-[0_1_9.5rem]'"><label for="nc-t" [class]="ETIQUETA">Tipo</label>
                          <select id="nc-t" [class]="LISTA" (change)="ponerDia('idTipoDia', +$any($event.target).value)">
                            @for (t of tiposCalendario(); track t.id) { <option [value]="t.id" [selected]="t.id === n.idTipoDia">{{ t.nombre }}</option> }
                          </select></div>
                        <div [class]="CAMPO + ' flex-[0_1_9.5rem]'"><label for="nc-s" [class]="ETIQUETA">Ámbito</label>
                          <select id="nc-s" [class]="LISTA" (change)="ponerDia('idSubcartera', +$any($event.target).value || null)">
                            <option value="" [selected]="!n.idSubcartera">Toda la empresa</option>
                            @for (s of subcarteras(); track s.id) { <option [value]="s.id" [selected]="s.id === n.idSubcartera">{{ s.nombre | nombrePropio }}</option> }
                          </select></div>
                        <div [class]="CAMPO + ' flex-[1_1_14rem]'"><label for="nc-n" [class]="ETIQUETA">Nombre o motivo</label><input id="nc-n" [class]="ENTRADA" [value]="n.nombre ?? ''" (input)="ponerDia('nombre', $any($event.target).value)"></div>
                      </div>
                      @if (error()) { <p class="m-0 text-[.75rem] font-medium text-(--ro)">{{ error() }}</p> }
                      <div class="flex flex-wrap items-center gap-2">
                        <button type="button" appBoton class="px-4!" [disabled]="guardando()" (click)="guardarDia()"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Agregar</button>
                        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="formDia.set(null)">Cancelar</button>
                      </div>
                    </div>
                  } @else if (importando()) {
                    <div class="mb-[.75rem] flex flex-col gap-[.75rem] rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
                      <span class="text-[.875rem] font-bold">Feriados nacionales</span>
                      <div>
                        @for (f of feriados(); track f.fecha) {
                          @let ya = yaMarcado(f.fecha);
                          <label class="m-0! grid cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-[.625rem] border-t border-(--line2) px-1 py-2 text-[.875rem] font-normal! first:border-t-0">
                            <input type="checkbox" class="m-0! size-4! accent-(--verde-txt)" [checked]="ya || !quitados().has(f.fecha)" [disabled]="ya" (change)="alternarFeriado(f.fecha)">
                            <span>{{ fechaLarga(f.fecha) }}</span><small class="text-[.75rem] text-muted-foreground">{{ f.nombre }}{{ ya ? ', ya está' : '' }}</small>
                          </label>
                        }
                      </div>
                      <div class="flex flex-wrap items-center gap-2">
                        <button type="button" appBoton class="px-4!" [disabled]="guardando()" (click)="importar()"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Importar marcados</button>
                        <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="importando.set(false)">Cancelar</button>
                      </div>
                    </div>
                  }
                  @if (!listaCal().length) {
                    <div [class]="VACIO">Sin días marcados desde este mes</div>
                  } @else {
                    <div class="flex flex-[1_0_auto] flex-col">
                      <div #caja [class]="TABLA_CAJA">
                        <table [class]="TABLA">
                          <thead [class]="THEAD"><tr [class]="TR"><th [class]="TH">Fecha</th><th [class]="TH">Nombre o motivo</th><th [class]="TH"></th></tr></thead>
                          <tbody>
                            @for (c of paginaCal(); track c.id ?? c.fecha) {
                              <tr [class]="TR">
                                <td [class]="TD_1">{{ fechaLarga(c.fecha) }}<span [class]="SEC">{{ DIAS_LARGOS[diaDe(c.fecha)] }}</span></td>
                                <td [class]="TD"><span class="font-semibold">{{ c.nombre || c.motivo }}</span><span [class]="SEC">{{ c.tipo }}, {{ c.idSubcartera ? (nombreSub(c.idSubcartera) | nombrePropio) : 'toda la empresa' }}</span></td>
                                <td [class]="TD + ' text-right!'">
                                  @if (c.fecha >= hoyTexto && !c.heredado && c.id) { <button type="button" [class]="MINI" [disabled]="guardando()" (click)="quitar(c)">Quitar</button> }
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                      <app-pie-pagina [total]="listaCal().length" [pagina]="paginaCalActual()" [porPagina]="porPagina()" (ir)="pagina.set($event)" />
                    </div>
                  }
                  @if (!formDia() && !importando()) {
                    <div class="mt-[.75rem] flex justify-end gap-2">
                      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="abrirImportar()">Importar feriados</button>
                      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="nuevoDia(hoyTexto)">Marcar día</button>
                    </div>
                  }
                </section>
              </div>
            }

            @case ('vac') {
              <div [class]="TABLA_CAJA.replace('flex-[1_0_auto]', 'flex-none')">
                <table [class]="TABLA">
                  <thead [class]="THEAD"><tr [class]="TR">
                    <th [class]="TH">Asesor</th><th [class]="TH">Desde</th><th [class]="TH">Hasta</th><th [class]="TH + ' text-right!'">Días</th><th [class]="TH">Nota</th><th [class]="TH">Registró</th><th [class]="TH"></th>
                  </tr></thead>
                  <tbody>
                    @for (v of vacaciones(); track v.id) {
                      <tr [class]="TR">
                        <td [class]="TD_1"><span [class]="FUERTE">{{ v.nombre }}</span></td>
                        <td [class]="TD">{{ fechaLarga(v.fechaDesde) }}</td><td [class]="TD">{{ fechaLarga(v.fechaHasta) }}</td>
                        <td [class]="TD + ' text-right!'">{{ v.dias }}</td>
                        <td [class]="RES">{{ v.nota || '—' }}</td><td [class]="TD">{{ v.registradoPor ?? '—' }}</td>
                        <td [class]="TD + ' text-right!'">@if (v.editable && anulando() !== v.id) { <button type="button" [class]="MINI" (click)="anulando.set(v.id); error.set('')">Anular</button> }</td>
                      </tr>
                      @if (anulando() === v.id) {
                        <tr [class]="TR"><td colspan="7" class="border-0! pt-0! pr-0! pb-5! pl-[calc(.625rem+1px)]! whitespace-normal!">
                          <div class="flex flex-wrap items-end gap-x-4 gap-y-3 rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
                            <div [class]="CAMPO + ' flex-[1_1_14rem]'"><label for="va-m" [class]="ETIQUETA">Motivo de la anulación</label><input id="va-m" [class]="ENTRADA" [value]="motivoAnular()" (input)="motivoAnular.set($any($event.target).value)"></div>
                            @if (error()) { <p class="m-0 basis-full text-[.75rem] font-medium text-(--ro)">{{ error() }}</p> }
                            <div class="flex flex-wrap items-center gap-2">
                              <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" (click)="anulando.set(null)">Cancelar</button>
                              <button type="button" appBoton class="h-[2.375rem]! px-4!" [disabled]="guardando()" (click)="anular(v)">Anular vacaciones</button>
                            </div>
                          </div>
                        </td></tr>
                      }
                    } @empty {
                      <tr [class]="TR"><td colspan="7" [class]="TD_1 + ' text-muted-foreground!'">Sin vacaciones registradas</td></tr>
                    }
                  </tbody>
                </table>
              </div>
              @if (formVac(); as n) {
                <div class="mt-[.75rem] flex flex-wrap items-end gap-x-4 gap-y-3 rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]">
                  <div class="flex min-w-0 flex-[1_1_auto] flex-wrap items-end gap-3">
                    <div [class]="CAMPO + ' flex-[1_1_14rem]'"><label for="nv-u" [class]="ETIQUETA">Asesor</label>
                      <select id="nv-u" [class]="LISTA" (change)="ponerVac('idUsuario', +$any($event.target).value)">
                        @for (p of gente(); track p.idUsuario) { <option [value]="p.idUsuario" [selected]="p.idUsuario === n.idUsuario">{{ p.nombre }}</option> }
                      </select></div>
                    <div [class]="CAMPO + ' flex-[0_1_9.5rem]'"><label for="nv-d" [class]="ETIQUETA">Desde</label><input id="nv-d" type="date" [class]="ENTRADA" [value]="n.fechaDesde" (change)="ponerVac('fechaDesde', $any($event.target).value)"></div>
                    <div [class]="CAMPO + ' flex-[0_1_9.5rem]'"><label for="nv-h" [class]="ETIQUETA">Hasta</label><input id="nv-h" type="date" [class]="ENTRADA" [value]="n.fechaHasta" (change)="ponerVac('fechaHasta', $any($event.target).value)"></div>
                    <div [class]="CAMPO + ' flex-[1_1_14rem]'"><label for="nv-n" [class]="ETIQUETA">Nota</label><input id="nv-n" [class]="ENTRADA" [value]="n.nota ?? ''" (input)="ponerVac('nota', $any($event.target).value)"></div>
                  </div>
                  @if (error()) { <p class="m-0 basis-full text-[.75rem] font-medium text-(--ro)">{{ error() }}</p> }
                  <div class="flex flex-wrap items-center gap-2">
                    <button type="button" appBoton="secundario" [class]="'h-[2.375rem]! px-4! ' + BOTON_SEC" (click)="formVac.set(null)">Cancelar</button>
                    <button type="button" appBoton class="h-[2.375rem]! px-4!" [disabled]="guardando()" (click)="registrarVac()"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Registrar</button>
                  </div>
                </div>
              } @else {
                <div class="-mx-8 mt-[.75rem] flex items-center justify-end border-t border-(--line2) px-8 pt-[.75rem]">
                  <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" (click)="abrirVac()">Registrar vacaciones</button>
                </div>
              }
            }

            @case ('inh') {
              <app-asistencia-inhabilitaciones [idSubcartera]="ambito().idSubcartera ?? null" />
            }
          }
        </div>
      </section>
    </div>

    <div appTarjeta [class]="BARRA">
      @switch (seccion()) {
        @case ('reglas') {
          <span [class]="cambiosRegla() ? BARRA_ESTADO_HAY : BARRA_ESTADO">{{ textoCambios(cambiosRegla()) }}</span>
          <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC + ' ' + BOTON_APAGADO" [disabled]="!cambiosRegla() || guardando()" (click)="reglasCambiadas.set({})">Descartar</button>
          <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" [disabled]="!cambiosRegla() || guardando()" (click)="guardarReglas()"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Guardar cambios</button>
        }
        @case ('base') {
          @if (cambiosBase()) {
            <span [class]="errorBase() || error() ? BARRA_ESTADO_MAL : BARRA_ESTADO_HAY">{{ errorBase() || error() || textoCambios(cambiosBase()) }}</span>
            <input [class]="ENTRADA + ' w-[16rem]! flex-none'" placeholder="Motivo del cambio" aria-label="Motivo del cambio" [value]="motivoBase()" (input)="motivoBase.set($any($event.target).value); error.set('')">
          } @else {
            <span [class]="BARRA_ESTADO">Sin cambios</span>
          }
          <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC + ' ' + BOTON_APAGADO" [disabled]="!cambiosBase() || guardando()" (click)="baseCambiada.set({})">Descartar</button>
          <button type="button" appBoton [class]="'px-4! ' + BOTON_APAGADO" [disabled]="!cambiosBase() || !!errorBase() || guardando()" (click)="guardarBase()"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>Guardar cambios</button>
        }
        @case ('cal') {
          <span [class]="BARRA_ESTADO">{{ listaCal().length === 1 ? '1 día marcado desde ' + mesNombre() : listaCal().length + ' días marcados desde ' + mesNombre() }}</span>
        }
        @case ('vac') {
          <span [class]="BARRA_ESTADO">{{ vacaciones().length === 1 ? '1 registro de vacaciones' : vacaciones().length + ' registros de vacaciones' }}</span>
        }
        @default {
          <span [class]="BARRA_ESTADO"></span>
        }
      }
    </div>
  `
})
export class ControlConfiguracionComponent implements OnDestroy {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  readonly cabecera = input.required<TemplateRef<unknown>>();
  readonly ambito = input.required<AmbitoAsistencia>();
  readonly subcartera = input<string | null>(null);
  readonly lunes = input.required<string>();
  /** La sección con la que se abre (desde Recuperaciones, el horario base). */
  readonly seccionInicial = input<string | null>(null);
  /** Los nombres de los clientes, para decir de quién es cada subcartera con «Todos». */
  readonly clientes = input<Record<number, string>>({});

  protected readonly REJILLA = REJILLA; protected readonly PRINCIPAL = PRINCIPAL; protected readonly ZONA = ZONA; protected readonly VACIO = VACIO;
  protected readonly TABLA_CAJA = TABLA_CAJA; protected readonly TABLA = TABLA; protected readonly THEAD = THEAD; protected readonly TR = TR; protected readonly TH = TH;
  protected readonly TD = TD; protected readonly TD_1 = TD_1; protected readonly SEC = SEC; protected readonly FUERTE = FUERTE; protected readonly PILL = PILL;
  protected readonly BARRA = BARRA; protected readonly BARRA_ESTADO = BARRA_ESTADO; protected readonly BARRA_ESTADO_HAY = BARRA_ESTADO_HAY; protected readonly BARRA_ESTADO_MAL = BARRA_ESTADO_MAL;
  protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly LISTA = LISTA; protected readonly ENTRADA = ENTRADA;
  protected readonly MINI = MINI; protected readonly MINI_ICONO = MINI_ICONO; protected readonly BOTON_SEC = BOTON_SEC; protected readonly BOTON_APAGADO = BOTON_APAGADO;
  protected readonly DIAS_LARGOS = DIAS_LARGOS; protected readonly hora = hora; protected readonly fechaLarga = fechaLarga; protected readonly hoyTexto = hoy();
  protected readonly RES = TD.replace('whitespace-nowrap', 'whitespace-normal min-w-[8.5rem] max-w-[18rem]');
  protected readonly CHIP = 'inline-flex cursor-pointer items-center gap-[.375rem] rounded-full border! border-solid! border-border! bg-card px-3! py-1! [font-family:inherit] text-[.75rem] leading-[1.5] font-semibold text-(--ink2) '
    + 'transition-colors duration-150 hover:bg-muted dark:bg-muted dark:hover:bg-border aria-pressed:border-(--campo-ln)! aria-pressed:bg-sidebar-accent aria-pressed:text-foreground';
  protected readonly FILA_BASE = 'grid grid-cols-[6.5rem_7rem_7rem_minmax(0,1fr)_5.5rem] items-center gap-4 border-t border-(--line2) px-2 tabular-nums';
  protected readonly DIAS_MES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
  protected readonly SECCIONES: { clave: Seccion; texto: string }[] = [
    { clave: 'reglas', texto: 'Reglas' }, { clave: 'base', texto: 'Horario base' }, { clave: 'cal', texto: 'Calendario' },
    { clave: 'vac', texto: 'Vacaciones' }, { clave: 'inh', texto: 'Inhabilitaciones' }
  ];
  protected readonly COLUMNAS: { clave: 'tol' | 'alm' | 'brk'; titulo: string; corto: string; icono: string; tono: string;
                                 campos: { campo: CampoRegla; etiqueta: string; tipo: string; unidad: string; unidadCorta: string }[] }[] = [
    { clave: 'tol', titulo: 'Tolerancia de ingreso', corto: 'Tolerancia', icono: 'clock', tono: 'var(--am-pt)', campos: [
      { campo: 'td', etiqueta: 'Por día', tipo: 'number', unidad: 'min', unidadCorta: 'min al día' },
      { campo: 'ts', etiqueta: 'Por semana', tipo: 'number', unidad: 'min', unidadCorta: 'min a la semana' }] },
    { clave: 'alm', titulo: 'Almuerzo', corto: 'Almuerzo', icono: 'utensils', tono: 'var(--verde-txt)', campos: [
      { campo: 'alm', etiqueta: 'Duración', tipo: 'number', unidad: 'min', unidadCorta: 'min' },
      { campo: 'halm', etiqueta: 'Hora', tipo: 'time', unidad: '', unidadCorta: '' }] },
    { clave: 'brk', titulo: 'Break', corto: 'Break', icono: 'coffee', tono: 'var(--break)', campos: [
      { campo: 'brk', etiqueta: 'Duración', tipo: 'number', unidad: 'min', unidadCorta: 'min' },
      { campo: 'hbrk', etiqueta: 'Hora', tipo: 'time', unidad: '', unidadCorta: '' }] }
  ];
  /** Las horas del eje del horario base: de 07:00 a 19:00, cada dos horas. */
  protected readonly EJE_BASE = [420, 540, 660, 780, 900, 1020, 1140];

  readonly seccion = signal<Seccion>('reglas');
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly perfil = signal<PerfilAsistencia | null>(null);

  constructor() {
    this.servicio.perfil().subscribe({ next: p => this.perfil.set(p), error: () => this.perfil.set(null) });
    this.servicio.tiposDeDia().subscribe({ next: t => this.tipos.set(t), error: () => this.tipos.set([]) });
    effect(() => {
      const s = this.seccionInicial();
      untracked(() => { if (s === 'base') this.seccion.set('base'); });
    });
    effect(() => {
      const ambito = this.ambito(), seccion = this.seccion(), perfil = this.perfil();
      untracked(() => this.cargar(seccion, ambito, perfil));
    });
    effect(() => {
      const mes = this.mes(), sub = this.ambito().idSubcartera ?? null;
      untracked(() => { if (this.seccion() === 'cal') this.cargarCalendario(mes, sub); });
    });
  }

  ngOnDestroy(): void {
    this.medidor.cerrar();
  }

  elegir(s: Seccion): void {
    this.seccion.set(s);
    this.error.set('');
  }

  private cargar(seccion: Seccion, ambito: AmbitoAsistencia, perfil: PerfilAsistencia | null): void {
    this.error.set('');
    if (seccion === 'reglas' && perfil) this.cargarReglas(ambito, perfil);
    if (seccion === 'base') this.cargarBase(ambito.idSubcartera ?? null);
    if (seccion === 'cal') this.cargarCalendario(this.mes(), ambito.idSubcartera ?? null);
    if (seccion === 'vac') this.cargarVacaciones(ambito.idSubcartera ?? null);
  }

  /** Las subcarteras del ámbito elegido, entre las que ve quien entra. */
  readonly subcarteras = computed(() => {
    const a = this.ambito(), lista = this.perfil()?.subcarteras ?? [];
    return lista.filter(s => (!a.idSubcartera || s.id === a.idSubcartera) && (!a.idCartera || s.idCartera === a.idCartera) && (!a.idCliente || s.idCliente === a.idCliente));
  });

  nombreSub(id: number): string {
    return (this.perfil()?.subcarteras ?? []).find(s => s.id === id)?.nombre ?? '';
  }

  // ==================== REGLAS ====================

  readonly reglas = signal<ReglaSub[]>([]);
  /** Lo cambiado y sin guardar: «sub|campo» → valor. */
  readonly reglasCambiadas = signal<Record<string, string>>({});
  readonly cambiosRegla = computed(() => Object.keys(this.reglasCambiadas()).length);

  private cargarReglas(ambito: AmbitoAsistencia, perfil: PerfilAsistencia): void {
    const subs = (perfil.subcarteras ?? []).filter(s => (!ambito.idSubcartera || s.id === ambito.idSubcartera)
      && (!ambito.idCartera || s.idCartera === ambito.idCartera) && (!ambito.idCliente || s.idCliente === ambito.idCliente));
    this.reglasCambiadas.set({});
    if (!subs.length) {
      this.reglas.set([]);
      return;
    }
    this.cargando.set(true);
    forkJoin(subs.map(s => forkJoin({
      politica: this.servicio.politica(s.id).pipe(catchError(() => of(null))),
      base: this.servicio.horarioBase(s.id).pipe(catchError(() => of(null)))
    }))).subscribe(r => {
      this.cargando.set(false);
      this.reglas.set(subs.map((s, i) => {
        const martes = r[i].base?.dias.find(d => d.diaSemana === 2);
        return { id: s.id, nombre: s.nombre, cartera: s.cartera, politica: r[i].politica, entrada: (martes?.entrada ?? '08:00').slice(0, 5), salida: (martes?.salida ?? '18:30').slice(0, 5) };
      }));
    });
  }

  private original(r: ReglaSub, c: CampoRegla): string {
    const p = r.politica;
    if (!p) return '';
    return { td: String(p.toleranciaDiaMin), ts: String(p.toleranciaSemanaMin), alm: String(p.minutosAlmuerzo), halm: (p.horaAlmuerzo ?? '').slice(0, 5),
             brk: String(p.minutosBreak), hbrk: (p.horaBreak ?? '').slice(0, 5) }[c];
  }

  valorRegla(r: ReglaSub, c: CampoRegla): string {
    return this.reglasCambiadas()[`${r.id}|${c}`] ?? this.original(r, c);
  }

  cambiarRegla(r: ReglaSub, c: CampoRegla, valor: string): void {
    const clave = `${r.id}|${c}`;
    this.reglasCambiadas.update(m => {
      const copia = { ...m };
      if (valor === this.original(r, c)) delete copia[clave]; else copia[clave] = valor;
      return copia;
    });
  }

  cambiadaRegla(id: number): boolean {
    return Object.keys(this.reglasCambiadas()).some(k => k.startsWith(id + '|'));
  }

  revertirRegla(id: number): void {
    this.reglasCambiadas.update(m => Object.fromEntries(Object.entries(m).filter(([k]) => !k.startsWith(id + '|'))));
  }

  claseRegla(id: number, c: CampoRegla, compacto: boolean): string {
    const base = compacto
      ? ENTRADA.replace('h-[2.375rem]!', 'h-[2.125rem]!').replace('px-[.625rem]!', 'px-[.375rem]!').replace('py-[.375rem]!', 'py-1!') + ' text-center'
      : ENTRADA.replace('h-[2.375rem]!', 'h-[2.625rem]!').replace('text-[.875rem]!', 'text-[1rem]!').replace('w-full', 'w-[8.5rem]') + ' text-center';
    return this.reglasCambiadas()[`${id}|${c}`] !== undefined ? base.replace('border-(--campo-ln)!', 'border-(--am-pt)!').replace('bg-(--campo)!', 'bg-(--am-bg)!') : base;
  }

  /** Los tramos de la jornada tipo: la tolerancia al empezar, el almuerzo y el break en su hora. */
  bloques(r: ReglaSub): { clase: string; izq: number; ancho: number; titulo: string }[] {
    const x0 = aMin(r.entrada), x1 = aMin(r.salida), pc = (m: number) => Math.max(0, Math.min(100, (m - x0) / (x1 - x0) * 100));
    const td = +this.valorRegla(r, 'td') || 0, alm = +this.valorRegla(r, 'alm') || 0, halm = this.valorRegla(r, 'halm'), brk = +this.valorRegla(r, 'brk') || 0, hbrk = this.valorRegla(r, 'hbrk');
    const salida: { clase: string; izq: number; ancho: number; titulo: string }[] = [];
    const tramo = (a: number, b: number, clase: string, titulo: string) => salida.push({ clase, izq: pc(a), ancho: pc(b) - pc(a), titulo });
    if (td) tramo(x0, x0 + td, 'left-1 bg-[repeating-linear-gradient(135deg,var(--am-pt)_0_3px,transparent_3px_6px)]', `Tolerancia de ingreso: ${td} min`);
    if (halm) tramo(aMin(halm), aMin(halm) + alm, 'bg-(--almuerzo)', `Almuerzo de ${halm} a ${hora(aMin(halm) + alm)}`);
    if (hbrk) tramo(aMin(hbrk), aMin(hbrk) + brk, 'bg-(--break)', `Break de ${hbrk} a ${hora(aMin(hbrk) + brk)}`);
    return salida;
  }

  /** Las horas de la jornada, cada una; la salida al final. */
  eje(r: ReglaSub): { m: number; izq: number; texto: string }[] {
    const x0 = aMin(r.entrada), x1 = aMin(r.salida), pc = (m: number) => (m - x0) / (x1 - x0) * 100;
    const marcas = Array.from({ length: Math.floor((x1 - x0) / 60) + 1 }, (_, i) => x0 + i * 60).filter(m => x1 - m >= 45);
    return [...marcas.map(m => ({ m, izq: pc(m), texto: hora(m) })), { m: x1, izq: 100, texto: r.salida }];
  }

  pieRegla(r: ReglaSub, clave: 'tol' | 'alm' | 'brk'): string {
    if (clave === 'tol') return `Tarde desde las ${hora(aMin(r.entrada) + (+this.valorRegla(r, 'td') || 0) + 1)}`;
    const h = this.valorRegla(r, clave === 'alm' ? 'halm' : 'hbrk'), m = +this.valorRegla(r, clave) || 0;
    return h ? `De ${h} a ${hora(aMin(h) + m)}` : clave === 'alm' ? 'Sin hora fija' : '';
  }

  /** Con un cliente elegido, la cartera; con «Todos», el cliente y la cartera si se llama distinto. */
  segundaLinea(r: ReglaSub): string {
    if (this.ambito().idCliente) return r.cartera;
    const cliente = this.clientes()[(this.perfil()?.subcarteras ?? []).find(s => s.id === r.id)?.idCliente ?? -1] ?? '';
    return r.cartera && r.cartera.toLowerCase() !== r.nombre.toLowerCase() ? `${cliente}, ${this.propio(r.cartera)}` : cliente;
  }

  private propio(t: string): string {
    return /\p{Ll}/u.test(t) ? t : t.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  }

  claseCompacta(i: number, ultima: boolean): string {
    const n = this.reglas().length, par = i % 2 === 1, ultimaFila = ultima || (i >= n - 2 && i % 2 === 0 && n % 2 === 0);
    const tres = n === 3 && ultima;
    return 'flex min-h-0 flex-col gap-[.625rem] py-4 @max-[60.001rem]/p5:border-l-0 @max-[60.001rem]/p5:px-0 '
      + (par ? 'border-l border-(--line2) pl-6' : 'pr-6') + (tres ? ' col-span-full pr-0' : '')
      + (ultimaFila ? '' : ' border-b border-(--line2)');
  }

  /** Cada subcartera cambiada se guarda con sus reglas: rigen desde el lunes. */
  guardarReglas(): void {
    const cambiadas = this.reglas().filter(r => this.cambiadaRegla(r.id) && r.politica);
    if (!cambiadas.length) return;
    this.guardando.set(true);
    let pendientes = cambiadas.length, fallo = '';
    for (const r of cambiadas) {
      const v = (c: CampoRegla) => this.valorRegla(r, c);
      this.servicio.guardarPolitica({ ...r.politica!, idSubcartera: r.id, toleranciaDiaMin: +v('td') || 0, toleranciaSemanaMin: +v('ts') || 0,
        minutosAlmuerzo: +v('alm') || 0, horaAlmuerzo: v('halm') || null, minutosBreak: +v('brk') || 0, horaBreak: v('hbrk') || null, programada: undefined, heredada: undefined }).subscribe({
        next: () => this.alGuardarReglas(--pendientes, fallo),
        error: e => { fallo = e?.error?.error ?? `No se pudieron guardar las reglas de ${r.nombre}`; this.alGuardarReglas(--pendientes, fallo); }
      });
    }
  }

  private alGuardarReglas(pendientes: number, fallo: string): void {
    if (pendientes > 0) return;
    this.guardando.set(false);
    if (fallo) { this.toast.error(fallo); return; }
    this.toast.success(`Reglas guardadas. Rigen desde el lunes ${this.corta(sumarDias(lunesDe(new Date()), 7))}`);
    const p = this.perfil();
    if (p) this.cargarReglas(this.ambito(), p);
  }

  // ==================== HORARIO BASE ====================

  readonly horarioBase = signal<HorarioBase | null>(null);
  readonly politicaBase = signal<PoliticaAsistencia | null>(null);
  /** «día|0» entrada, «día|1» salida → hora. */
  readonly baseCambiada = signal<Record<string, string>>({});
  readonly motivoBase = signal('');
  readonly cambiosBase = computed(() => Object.keys(this.baseCambiada()).length);

  private cargarBase(sub: number | null): void {
    this.baseCambiada.set({});
    this.motivoBase.set('');
    forkJoin({ base: this.servicio.horarioBase(sub).pipe(catchError(() => of(null))), politica: this.servicio.politica(sub).pipe(catchError(() => of(null))) })
      .subscribe(r => { this.horarioBase.set(r.base); this.politicaBase.set(r.politica); });
  }

  /** Lunes a viernes del horario base y el sábado opcional, con lo cambiado. */
  readonly diasBase = computed(() => {
    const b = this.horarioBase(), cam = this.baseCambiada(), alm = this.politicaBase()?.minutosAlmuerzo ?? 60;
    return [1, 2, 3, 4, 5, 6].map(dia => {
      const fila = b?.dias.find(d => d.diaSemana === dia);
      const entrada = cam[`${dia}|0`] ?? (dia === 6 ? '09:00' : (fila?.entrada ?? '08:00').slice(0, 5));
      const salida = cam[`${dia}|1`] ?? (dia === 6 ? '13:00' : (fila?.salida ?? '18:30').slice(0, 5));
      return { dia, nombre: DIAS_LARGOS[dia], entrada, salida, jornada: aMin(salida) - aMin(entrada) - alm };
    });
  });

  readonly totalBase = computed(() => this.diasBase().filter(d => d.dia !== 6).reduce((t, d) => t + d.jornada, 0));
  readonly errorBase = computed(() => this.cambiosBase() && this.totalBase() !== 48 * 60
    ? `Lunes a viernes suman ${enPalabras(this.totalBase())}; tienen que sumar 48 horas` : '');

  cambiarBase(dia: number, i: 0 | 1, valor: string): void {
    const fila = this.horarioBase()?.dias.find(d => d.diaSemana === dia);
    const original = ((i === 0 ? fila?.entrada : fila?.salida) ?? '').slice(0, 5);
    this.baseCambiada.update(m => {
      const copia = { ...m };
      if (!valor || valor === original) delete copia[`${dia}|${i}`]; else copia[`${dia}|${i}`] = valor;
      return copia;
    });
    this.error.set('');
  }

  claseBase(dia: number, i: 0 | 1): string {
    const base = ENTRADA.replace('px-[.625rem]!', 'px-[.375rem]!').replace('py-[.375rem]!', 'py-1!') + ' h-8! text-center';
    return this.baseCambiada()[`${dia}|${i}`] !== undefined ? base.replace('border-(--campo-ln)!', 'border-(--am-pt)!').replace('bg-(--campo)!', 'bg-(--am-bg)!') : base;
  }

  posBase(m: number): number {
    return (m - 420) / (1200 - 420) * 100;
  }

  /** Las franjas del día: trabajo, almuerzo y break; el sábado, opcional y remoto. */
  barrasBase(d: { dia: number; entrada: string; salida: string }): { clase: string; izq: number; ancho: number; texto: string; titulo: string; desde?: string; hasta?: string }[] {
    const p = this.politicaBase(), x = aMin(d.entrada), y = aMin(d.salida), pc = (m: number) => this.posBase(m);
    const salida: { clase: string; izq: number; ancho: number; texto: string; titulo: string; desde?: string; hasta?: string }[] = [];
    const tramo = (a: number, b: number, clase: string, texto: string, titulo: string) => {
      if (b > a) salida.push({ clase, izq: pc(a), ancho: pc(b) - pc(a), texto, titulo, ...(clase === TR ? { desde: hora(a), hasta: hora(b) } : {}) });
    };
    const TR = 'border-[color-mix(in_oklab,var(--serie-a)_40%,var(--card))] bg-[color-mix(in_oklab,var(--serie-a)_14%,var(--card))] text-(--ok)';
    const ALM = 'border-[color-mix(in_oklab,var(--almuerzo)_55%,var(--card))] bg-[color-mix(in_oklab,var(--almuerzo)_22%,var(--card))]';
    const BRK = 'border-[color-mix(in_oklab,var(--break)_55%,var(--card))] bg-[color-mix(in_oklab,var(--break)_22%,var(--card))]';
    if (d.dia === 6) {
      tramo(x, y, 'border-dashed border-border bg-[repeating-linear-gradient(135deg,var(--line2)_0_6px,transparent_6px_11px)] text-muted-foreground', 'Opcional y remoto', 'Opcional y remoto');
      return salida;
    }
    const al = aMin(p?.horaAlmuerzo ?? '13:00'), alf = al + (p?.minutosAlmuerzo ?? 60), br = p?.horaBreak ? aMin(p.horaBreak) : null, brf = br != null ? br + (p?.minutosBreak ?? 0) : null;
    tramo(x, al, TR, `${hora(x)} – ${hora(al)}`, `${hora(x)} – ${hora(al)}`);
    tramo(al, alf, ALM, '', `Almuerzo, ${hora(al)} – ${hora(alf)}`);
    if (br != null && brf != null) {
      tramo(alf, br, TR, `${hora(alf)} – ${hora(br)}`, `${hora(alf)} – ${hora(br)}`);
      tramo(br, brf, BRK, '', `Break, ${hora(br)} – ${hora(brf)}`);
      tramo(brf, y, TR, `${hora(brf)} – ${hora(y)}`, `${hora(brf)} – ${hora(y)}`);
    } else {
      tramo(alf, y, TR, `${hora(alf)} – ${hora(y)}`, `${hora(alf)} – ${hora(y)}`);
    }
    return salida;
  }

  /** Lo cambia desde el lunes siguiente; lleva motivo, que queda en la Auditoría. */
  guardarBase(): void {
    if (this.errorBase()) return;
    if (!this.motivoBase().trim()) {
      this.error.set('Escribe el motivo del cambio: queda en la Auditoría');
      return;
    }
    this.guardando.set(true);
    const dias = this.diasBase().filter(d => d.dia !== 6).map(d => ({ diaSemana: d.dia, entrada: d.entrada, salida: d.salida }));
    this.servicio.cambiarHorarioBase({ idSubcartera: this.ambito().idSubcartera ?? null, dias, motivo: this.motivoBase().trim() }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.toast.success(`Horario base guardado. Rige desde el lunes ${this.corta(sumarDias(lunesDe(new Date()), 7))}`);
        this.cargarBase(this.ambito().idSubcartera ?? null);
      },
      error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudo guardar el horario base'); }
    });
  }

  // ==================== CALENDARIO ====================

  readonly tipos = signal<TipoDia[]>([]);
  readonly tiposCalendario = computed(() => this.tipos().filter(t => TIPOS_DE_CALENDARIO.includes(t.codigo)));
  readonly mes = signal(hoy().slice(0, 7));
  readonly calendario = signal<DiaCalendario[]>([]);
  readonly formDia = signal<DiaCalendario | null>(null);
  readonly importando = signal(false);
  readonly feriados = signal<{ fecha: string; nombre: string }[]>([]);
  /** Los feriados que se desmarcaron al importar. */
  readonly quitados = signal(new Set<string>());
  readonly pagina = signal(1);
  private readonly medidor = new MedidorTabla(() => ({
    zona: this.zona?.nativeElement, caja: this.seccion() === 'cal' ? this.caja?.nativeElement : undefined, total: this.listaCal().length, amplia: false,
    clave: `${this.mes()}|${this.listaCal().length}|${!!this.formDia()}|${this.importando()}`
  }));
  readonly porPagina = this.medidor.porPagina;
  @ViewChild('zona') private zona?: ElementRef<HTMLElement>;
  @ViewChild('caja') private caja?: ElementRef<HTMLElement>;

  readonly mesTitulo = computed(() => { const [a, m] = this.mes().split('-').map(Number); const n = MESES[m - 1]; return `${n[0].toUpperCase()}${n.slice(1)} ${a}`; });
  readonly mesNombre = computed(() => MESES[+this.mes().slice(5, 7) - 1]);

  private cargarCalendario(mes: string, sub: number | null): void {
    // Desde el primer lunes que se ve en el mes hasta un año adelante: la lista llega a lo que viene.
    const desde = lunesDe(new Date(mes + '-01T00:00:00')), hasta = sumarDias(desde, 400);
    this.servicio.calendario(desde, hasta, sub).subscribe({ next: c => this.calendario.set(c), error: () => this.calendario.set([]) });
  }

  moverMes(paso: number): void {
    const [a, m] = this.mes().split('-').map(Number), d = new Date(a, m - 1 + paso, 1);
    this.mes.set(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    this.pagina.set(1);
  }

  /** Las casillas del mes, de lunes a domingo; la sexta semana solo si el mes llega a ella. */
  readonly celdasMes = computed(() => {
    const ini = lunesDe(new Date(this.mes() + '-01T00:00:00'));
    return Array.from({ length: 42 }, (_, i) => sumarDias(ini, i)).filter((f, i) => i < 35 || f.slice(0, 7) === this.mes())
      .map(f => ({ fecha: f, fuera: f.slice(0, 7) !== this.mes(), marca: this.calendario().find(c => c.fecha === f) ?? null }));
  });

  claseCelda(c: { fecha: string; fuera: boolean; marca: DiaCalendario | null }): string {
    const tono = c.marca?.tipoCodigo === 'FERIADO' ? 'border-(--ro-ln) bg-(--ro-bg) text-(--ro)' : c.marca?.tipoCodigo === 'SIN_ASIGNACION' ? 'border-(--am-ln) bg-(--am-bg) text-(--am)'
      : c.marca ? 'border-border bg-muted text-muted-foreground' : c.fuera ? 'border-transparent bg-transparent text-muted-foreground' : 'border-(--line2) bg-card text-foreground hover:bg-muted';
    return 'flex min-w-0 cursor-pointer flex-col items-start gap-[.125rem] rounded-[.5rem] border border-solid px-[.4375rem] py-[.375rem] text-left [font-family:inherit] transition-colors duration-150 ' + tono
      + (c.fecha === hoy() ? ' shadow-[inset_0_0_0_2px_var(--ring)]' : '');
  }

  /** Los días marcados desde el mes a la vista. */
  readonly listaCal = computed(() => this.calendario().filter(c => c.fecha >= this.mes() + '-01').sort((a, b) => a.fecha.localeCompare(b.fecha)));
  readonly paginaCalActual = computed(() => Math.min(Math.max(1, this.pagina()), Math.max(1, Math.ceil(this.listaCal().length / this.porPagina()))));
  readonly paginaCal = computed(() => {
    const ini = (this.paginaCalActual() - 1) * this.porPagina();
    return this.listaCal().slice(ini, ini + this.porPagina());
  });

  nuevoDia(fecha: string): void {
    this.importando.set(false);
    this.error.set('');
    this.formDia.set({ fecha, idSubcartera: this.ambito().idSubcartera ?? null, idTipoDia: this.tiposCalendario()[0]?.id ?? 0, nombre: '', motivo: '' });
  }

  ponerDia<K extends keyof DiaCalendario>(campo: K, valor: DiaCalendario[K]): void {
    const n = this.formDia();
    if (n) this.formDia.set({ ...n, [campo]: valor });
    this.error.set('');
  }

  guardarDia(): void {
    const n = this.formDia();
    if (!n) return;
    if (!n.fecha || !(n.nombre ?? '').trim()) {
      this.error.set('Pon la fecha y el nombre o motivo');
      return;
    }
    this.guardando.set(true);
    this.servicio.marcarDia({ ...n, nombre: n.nombre!.trim(), motivo: n.nombre!.trim() }).subscribe({
      next: () => { this.guardando.set(false); this.formDia.set(null); this.toast.success('Día marcado'); this.cargarCalendario(this.mes(), this.ambito().idSubcartera ?? null); },
      error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudo marcar el día'); }
    });
  }

  quitar(c: DiaCalendario): void {
    if (!c.id) return;
    this.guardando.set(true);
    this.servicio.quitarDia(c.id, this.ambito().idSubcartera ?? null).subscribe({
      next: () => { this.guardando.set(false); this.toast.success('Día quitado del calendario'); this.cargarCalendario(this.mes(), this.ambito().idSubcartera ?? null); },
      error: e => { this.guardando.set(false); this.toast.error(e?.error?.error ?? 'No se pudo quitar el día'); }
    });
  }

  abrirImportar(): void {
    this.formDia.set(null);
    this.quitados.set(new Set());
    this.servicio.feriados(+this.mes().slice(0, 4)).subscribe({
      next: f => { this.feriados.set(f); this.importando.set(true); },
      error: () => this.toast.error('No se pudieron traer los feriados nacionales')
    });
  }

  yaMarcado(fecha: string): boolean {
    return this.calendario().some(c => c.fecha === fecha && !c.idSubcartera);
  }

  alternarFeriado(fecha: string): void {
    this.quitados.update(s => { const c = new Set(s); c.has(fecha) ? c.delete(fecha) : c.add(fecha); return c; });
  }

  /** Marca para toda la empresa los feriados que siguen marcados. */
  importar(): void {
    const tipo = this.tiposCalendario().find(t => t.codigo === 'FERIADO');
    const lista = this.feriados().filter(f => !this.yaMarcado(f.fecha) && !this.quitados().has(f.fecha));
    if (!tipo || !lista.length) { this.importando.set(false); return; }
    this.guardando.set(true);
    forkJoin(lista.map(f => this.servicio.marcarDia({ fecha: f.fecha, idSubcartera: null, idTipoDia: tipo.id, nombre: f.nombre, motivo: f.nombre }).pipe(catchError(() => of(null)))))
      .subscribe(r => {
        this.guardando.set(false);
        this.importando.set(false);
        const bien = r.filter(Boolean).length;
        this.toast.success(bien === 1 ? '1 feriado importado' : `${bien} feriados importados`);
        this.cargarCalendario(this.mes(), this.ambito().idSubcartera ?? null);
      });
  }

  // ==================== VACACIONES ====================

  readonly vacaciones = signal<VacacionesAsesor[]>([]);
  readonly gente = signal<PersonalAsistencia[]>([]);
  readonly formVac = signal<{ idUsuario: number; fechaDesde: string; fechaHasta: string; nota: string | null } | null>(null);
  readonly anulando = signal<number | null>(null);
  readonly motivoAnular = signal('');

  private cargarVacaciones(sub: number | null): void {
    this.formVac.set(null);
    this.anulando.set(null);
    this.servicio.vacaciones(sub).subscribe({
      next: v => this.vacaciones.set([...v].sort((a, b) => b.fechaDesde.localeCompare(a.fechaDesde))),
      error: () => this.vacaciones.set([])
    });
    this.servicio.personal(sub).subscribe({ next: p => this.gente.set(p.filter(x => !x.fechaCese || x.fechaCese >= hoy())), error: () => this.gente.set([]) });
  }

  abrirVac(): void {
    const lunes = sumarDias(lunesDe(new Date()), 7);
    this.error.set('');
    this.formVac.set({ idUsuario: this.gente()[0]?.idUsuario ?? 0, fechaDesde: lunes, fechaHasta: sumarDias(lunes, 4), nota: '' });
  }

  ponerVac(campo: 'idUsuario' | 'fechaDesde' | 'fechaHasta' | 'nota', valor: string | number): void {
    const n = this.formVac();
    if (n) this.formVac.set({ ...n, [campo]: valor });
    this.error.set('');
  }

  registrarVac(): void {
    const n = this.formVac();
    if (!n) return;
    if (!n.fechaDesde || !n.fechaHasta) { this.error.set('Pon las dos fechas'); return; }
    if (n.fechaHasta < n.fechaDesde) { this.error.set('La fecha final no puede ser antes de la inicial'); return; }
    this.guardando.set(true);
    this.servicio.registrarVacaciones({ idUsuario: n.idUsuario, fechaDesde: n.fechaDesde, fechaHasta: n.fechaHasta, nota: (n.nota ?? '').trim() || null }).subscribe({
      next: () => { this.guardando.set(false); this.toast.success('Vacaciones registradas'); this.cargarVacaciones(this.ambito().idSubcartera ?? null); },
      error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudieron registrar las vacaciones'); }
    });
  }

  anular(v: VacacionesAsesor): void {
    if (!this.motivoAnular().trim()) { this.error.set('Escribe el motivo: queda en la Auditoría'); return; }
    this.guardando.set(true);
    this.servicio.anularVacaciones(v.id, this.motivoAnular().trim()).subscribe({
      next: () => { this.guardando.set(false); this.motivoAnular.set(''); this.toast.success('Vacaciones anuladas'); this.cargarVacaciones(this.ambito().idSubcartera ?? null); },
      error: e => { this.guardando.set(false); this.error.set(e?.error?.error ?? 'No se pudieron anular'); }
    });
  }

  // ==================== APOYO ====================

  textoCambios(n: number): string {
    return n ? (n === 1 ? '1 cambio sin guardar' : `${n} cambios sin guardar`) : 'Sin cambios';
  }

  corta(f: string): string {
    return f ? `${f.slice(8, 10)}/${f.slice(5, 7)}` : '';
  }

  diaDe(fecha: string): number {
    return new Date(fecha + 'T00:00:00').getDay();
  }
}
