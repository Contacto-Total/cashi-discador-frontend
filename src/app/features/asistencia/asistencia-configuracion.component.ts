import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin, of, switchMap } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { DiaCalendario, Horario, PoliticaAsistencia, ResumenAgente, TipoDia } from './asistencia.models';
import { ESTILOS, aMinutos, enDuracion, finDeSemanaDe, hoy, lunesDe, sumarDias } from './asistencia.estilos';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const DIAS_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

/** Una regla de la política, tal como se enseña y se cambia: de una en una. */
interface Regla {
  clave: 'dia' | 'semana' | 'almuerzo' | 'break';
  nombre: string;
  icono: string;
  pie: string;
  cifra: string;
  unidad: string;
  minutos: number;
  hora: string | null;
  conHora: boolean;
}

/** Un cambio del historial: los días que cambiaron igual, juntos en una línea. */
interface CambioHorario {
  clave: string;
  desde: string;
  hasta: string | null;
  vigente: boolean;
  alcance: string;
  dias: string;
  horario: string;
  motivo: string;
  registradoPor: string | null;
}

const CABECERAS = DIAS_CORTOS;
/** 48 horas semanales: es la regla de la empresa y contra eso se compara. */
const MINUTOS_SEMANA = 48 * 60;
/** Cuántos cambios caben en una página; los huecos mantienen el alto del panel. */
const CAMBIOS_POR_PAGINA = 5;

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
               'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

/** Minutos a «hh:mm», como se lee una jornada: «09:30», «53:00». */
function enHoras(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Configuración del módulo: el horario, las pausas y el calendario.
 *
 * Nada de esto se edita con un UPDATE. El reporte se consulta sobre el pasado;
 * si una fila se sobrescribiera, cambiar el horario en noviembre recalcularía
 * las tardanzas de octubre que ya se usaron para pagar. Cambiar cierra la fila
 * vigente y abre otra, y por eso el motivo es obligatorio.
 */
@Component({
  selector: 'app-asistencia-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    /* Título de sección y su fila: el título a la izquierda y lo que acompaña
       a la derecha, con el mismo alto en las dos columnas. */
    .titulo-seccion { margin: 0; font-size: 15px; font-weight: 800; letter-spacing: -.01em }
    .fila-seccion {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 10px; min-height: 38px; margin-bottom: 12px;
    }
    .leyenda-cal { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px }
    .leyenda-cal span { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #5f6c80 }
    .leyenda-cal i { width: 11px; height: 11px; border-radius: 3px; border: 1px solid #e6e9ee }
    :host-context(.dark) .leyenda-cal span { color: #94a3b8 }
    :host-context(.dark) .leyenda-cal i { border-color: #1e293b }

    /* El reloj de la semana. La pista es la escala del día; el turno, la barra
       de ese horario, con el mismo grosor y las puntas de las del dashboard. */
    .tabla-horario .col-reloj { width: 42%; min-width: 320px }
    .tabla-horario .marcas {
      display: flex; justify-content: space-between;
      font-size: 10.5px; font-weight: 600; letter-spacing: 0; text-transform: none;
      color: #8491a3; font-variant-numeric: tabular-nums;
    }
    .pista {
      position: relative; display: block; height: 14px; border-radius: 999px;
      /* Mezclada con el texto y no con el borde: sobre blanco, el gris suave
         casi no se distinguía del fondo de la tabla. */
      background-color: color-mix(in srgb, #0f172a 9%, #fff);
    }
    .pista .turno {
      position: absolute; top: 0; height: 100%; overflow: hidden;
      /* Recta donde empieza y curva donde acaba, como las barras del dashboard. */
      border-radius: 0 999px 999px 0;
      background: color-mix(in srgb, #0f172a 72%, #fff);
    }
    .pista .corte { position: absolute; top: 0; height: 100% }
    .pista .corte.almuerzo { background: color-mix(in srgb, #f59e0b 88%, #fff) }
    .pista .corte.break { background: color-mix(in srgb, #ea580c 82%, #fff) }
    :host-context(.dark) .pista { background-color: color-mix(in srgb, #f1f5f9 12%, #0f172a) }
    :host-context(.dark) .pista .turno { background: color-mix(in srgb, #f1f5f9 72%, #0f172a) }
    /* Un día cambiado y aún sin guardar: la fila lleva una marca al borde. */
    tr.pendiente td:first-child { box-shadow: inset 3px 0 0 #f59e0b }
    /* El aviso de las 48 horas, al pie de la tabla, con su punto de color. */
    .aviso-semana { display: inline-flex; align-items: center; gap: 7px; font-weight: 600 }
    .aviso-semana::before { content: ""; width: 8px; height: 8px; border-radius: 999px; background: currentColor }
    .aviso-semana.ok { color: #166534 }
    .aviso-semana.mal { color: #b91c1c }
    :host-context(.dark) .aviso-semana.ok { color: #86efac }
    :host-context(.dark) .aviso-semana.mal { color: #fca5a5 }

    /* Bento de reglas: dos columnas; las filas se reparten el alto del panel
       de cambios que tiene al lado. */
    .bento {
      flex: 1; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-rows: minmax(104px, 1fr); gap: 12px;
    }
    .regla {
      display: flex; flex-direction: column; gap: 3px; padding: 14px 16px;
      background: #fff; border: 1px solid #e6e9ee; border-radius: 12px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, .04);
      transition: transform .15s, box-shadow .15s;
    }
    .regla:hover { transform: scale(1.015); box-shadow: 0 6px 18px rgba(15, 23, 42, .08) }
    @media (prefers-reduced-motion: reduce) {
      .regla { transition: none }
      .regla:hover { transform: none }
    }
    .regla .cabeza { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px }
    .regla .icono {
      width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
      background: #f1f3f6; color: #334155;
    }
    .regla .cifra { font-size: 22px; font-weight: 800; line-height: 1.2; letter-spacing: -.02em; font-variant-numeric: tabular-nums }
    .regla .cifra small { margin-left: 5px; font-size: 12.5px; font-weight: 600; color: #5f6c80 }
    .regla .pie-cifra { margin: 0; padding-top: 4px; font-size: 11.5px; color: #5f6c80 }
    .regla .pie-tarjeta { margin-top: auto; padding-top: 10px }
    :host-context(.dark) .regla { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .regla .icono { background: #1e293b; color: #e2e8f0 }
    :host-context(.dark) .regla .cifra small,
    :host-context(.dark) .regla .pie-cifra { color: #94a3b8 }
    @media (max-width: 640px) { .bento { grid-template-columns: 1fr } }

    /* Las listas dentro de un panel respiran igual que las celdas de la tabla. */
    .lista-panel { list-style: none; margin: 0; padding: 0 12px }
    .lista-panel li {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      padding: 10.5px 0; border-bottom: 1px solid #f1f3f6;
    }
    .lista-panel li:last-child { border-bottom: 0 }
    .lista-panel li.hueco { visibility: hidden }
    :host-context(.dark) .lista-panel li { border-color: #1e293b }
    .dia-reg { display: flex; align-items: center; gap: 7px }
    .dia-reg .punto-tipo { width: 8px; height: 8px; border-radius: 3px; flex: none }
    .dia-reg strong { font-size: 12.5px; font-variant-numeric: tabular-nums }
    .pie-reg { margin: 2px 0 0 15px; white-space: normal; font-size: 11.5px; color: #5f6c80 }
    :host-context(.dark) .pie-reg { color: #94a3b8 }

    /* La ficha de un detalle: el dato a la derecha de su nombre. */
    .ficha { display: grid; grid-template-columns: 118px 1fr; gap: 9px 14px; margin: 0; font-size: 13px }
    .ficha dt {
      padding-top: 2px; font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; color: #5f6c80;
    }
    .ficha dd { margin: 0 }
    :host-context(.dark) .ficha dt { color: #94a3b8 }

    /* El mes: una rejilla con los bordes compartidos, no celdas sueltas. */
    .mes {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px;
      background: #e6e9ee; border: 1px solid #e6e9ee;
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 1px 2px rgba(15,23,42,.04);
    }
    .mes .cab-dia {
      background: #fff; padding: 7px 8px; text-align: center;
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .05em; color: #5f6c80;
    }
    .dia-cal {
      background: #fff; min-height: 76px; padding: 6px 7px;
      display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
      border: 0; font: inherit; text-align: left; color: inherit; cursor: pointer;
    }
    .dia-cal:hover { background: #f4f6f9 }
    .dia-cal:focus-visible { outline: 2px solid #2563eb; outline-offset: -2px }
    .dia-cal .num { font-size: 12.5px; font-weight: 700; font-variant-numeric: tabular-nums }
    .dia-cal.fuera { background: #f6f7f9; cursor: default }
    .dia-cal.fuera .num { color: #8491a3; font-weight: 600 }
    /* El fin de semana según el HORARIO del ámbito: en CASTIGO el sábado se
       trabaja y no puede salir en gris. */
    .dia-cal.finde { background: #f1f3f6 }
    .dia-cal.finde .num { color: #8491a3 }
    .dia-cal.hoy .num {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 22px; height: 22px; padding: 0 6px; border-radius: 999px;
      background: #0f172a; color: #fff;
    }
    .etq-dia {
      max-width: 100%; padding: 1px 6px; border-radius: 5px; line-height: 1.5;
      font-size: 10.5px; font-weight: 700;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .etq-feriado { background: #fdecec; color: #b91c1c }
    .etq-sinasig { background: #fdeee0; color: #c2410c }
    :host-context(.dark) .mes { background: #1e293b; border-color: #1e293b }
    :host-context(.dark) .mes .cab-dia { background: #0f172a }
    :host-context(.dark) .dia-cal { background: #0f172a }
    :host-context(.dark) .dia-cal:hover { background: #1e293b }
    :host-context(.dark) .dia-cal.fuera { background: #020617 }
    :host-context(.dark) .dia-cal.finde { background: #0b1220 }
    :host-context(.dark) .dia-cal.hoy .num { background: #fff; color: #0f172a }
    :host-context(.dark) .etq-feriado { background: rgba(69,10,10,.6); color: #fca5a5 }
    :host-context(.dark) .etq-sinasig { background: rgba(67,20,7,.6); color: #fdba74 }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-xl font-extrabold tracking-[-0.01em]">Configuración</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Horarios y calendario. Se toca de vez en cuando, no a diario
          </p>
        </div>
        <button type="button" [class]="estilos.botonSecundario" (click)="volver.emit()">
          <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
          Volver al reporte
        </button>
      </div>
    </div>

    <div class="flex min-h-[54px] items-center border-b border-[#e6e9ee] bg-white px-7 py-[11px] dark:border-slate-800 dark:bg-slate-900">
      <nav [class]="estilos.segmentos" role="tablist">
        @for (t of TABS; track t.clave) {
          <button type="button" role="tab" [attr.aria-selected]="tab() === t.clave"
                  [attr.aria-label]="t.clave === 'calendario'
                    ? 'Calendario, ' + diasDelAnio().length + ' días registrados en ' + anio() : null"
                  [class]="estilos.tab + ' ' + (tab() === t.clave ? estilos.tabActiva : estilos.tabApagada)"
                  (click)="tab.set(t.clave)">
            {{ t.texto }}
            @if (t.clave === 'calendario') {
              <span aria-hidden="true"
                    [class]="estilos.cuenta + ' ' + (tab() === t.clave ? estilos.cuentaActiva : estilos.cuentaApagada)">
                {{ diasDelAnio().length }}
              </span>
            }
          </button>
        }
      </nav>
    </div>

    @if (tab() === 'horarios') {
      <!-- El horario que se ve es el de la subcartera, salvo que se pida el
           de alguien en concreto: hay asesores con excepción. -->
      <div class="flex flex-wrap items-end gap-3 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="persona-h">Excepción por persona</label>
          <select id="persona-h" [class]="estilos.campo + ' w-[210px]'"
                  [ngModel]="idPersona()" (ngModelChange)="elegirPersona($event)">
            <option [ngValue]="null">Ninguna (horario de la subcartera)</option>
            @for (p of personas(); track p.idUsuario) {
              <option [ngValue]="p.idUsuario">{{ p.nombreAgente }}</option>
            }
          </select>
        </div>
        @if (idPersona()) {
          <p class="!m-0 pb-[11px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
            Lo que se guarde aquí vale solo para esta persona.
          </p>
        }
        <button type="button" [class]="estilos.botonSecundario + ' ml-auto'" (click)="abrirHorario()">
          <lucide-angular name="clock" [size]="15" class="block"></lucide-angular>
          Nuevo horario
        </button>
      </div>

      <div class="px-7 py-5">
      <div class="aparecer">

        <!-- El horario de la semana, con el turno dibujado sobre el eje de horas -->
        <div class="fila-seccion">
          <h2 class="titulo-seccion !m-0">Horario vigente</h2>
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="leyenda-cal">
              @for (l of LEYENDA_RELOJ; track l.texto) {
                <span><i [style.background]="l.color" [style.border-color]="l.color"></i>{{ l.texto }}</span>
              }
            </div>
            <span class="whitespace-nowrap text-[11.5px]"
                  [class]="guardado()
                    ? 'font-bold text-[#166534] dark:text-green-300'
                    : 'text-[#5f6c80] dark:text-slate-400'">
              {{ estadoHorario() }}
            </span>
            <!-- Guardar solo aparece cuando hay algo que guardar. -->
            @if (borrador().size) {
              <button type="button" [class]="estilos.botonPrimario"
                      [disabled]="!cuadraLaSemana() || guardando()"
                      [title]="cuadraLaSemana() ? '' : 'No se puede guardar hasta que la semana sume 48 horas'"
                      (click)="guardarHorarios()">
                <lucide-angular name="save" [size]="14" class="block"></lucide-angular>
                {{ guardando() ? 'Guardando…' : 'Guardar' }}
              </button>
            }
          </div>
        </div>

        <div [class]="estilos.panel">
          <table class="tabla-horario w-full border-collapse">
            <caption class="sr-only">
              Horario por día de la semana, con el turno dibujado sobre el eje de horas
            </caption>
            <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
              <tr>
                <th scope="col" [class]="estilos.th">Día</th>
                <th scope="col" [class]="estilos.th">Entrada</th>
                <th scope="col" [class]="estilos.th">Salida</th>
                <th scope="col" [class]="estilos.th">Jornada</th>
                <th scope="col" [class]="estilos.th + ' col-reloj'">
                  <!-- El eje de horas vive en la cabecera de su columna. -->
                  <div class="marcas">
                    @for (m of marcasDelEje(); track m) { <span>{{ m }}</span> }
                  </div>
                </th>
                <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
              </tr>
            </thead>
            <tbody>
              @for (d of semana(); track d.diaSemana) {
                <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#f4f6f9] dark:border-slate-800 dark:hover:bg-slate-800/40"
                    [class.pendiente]="d.pendiente">
                  <td [class]="estilos.td">
                    <strong>{{ DIAS[d.diaSemana - 1] }}</strong>
                    @if (d.remoto) {
                      <span [class]="PASTILLA.neutro + ' ml-2.5'">Remoto</span>
                    }
                    @if (d.pendiente) {
                      <span [class]="PASTILLA.tarde + ' ml-2.5'">Sin guardar</span>
                    }
                  </td>
                  <td [class]="estilos.td">{{ d.horaEntrada }}</td>
                  <td [class]="estilos.td">{{ d.horaSalida }}</td>
                  <td [class]="estilos.td + ' secundario'">{{ d.jornada }}</td>
                  <td [class]="estilos.td + ' col-reloj'">
                    <span class="pista" [title]="d.horaEntrada + ' – ' + d.horaSalida">
                      <span class="turno" [style.left.%]="d.izquierda" [style.width.%]="d.ancho">
                        @for (c of d.cortes; track c.tipo) {
                          <span class="corte" [class]="c.tipo"
                                [style.left.%]="c.izquierda" [style.width.%]="c.ancho"></span>
                        }
                      </span>
                    </span>
                  </td>
                  <td [class]="estilos.td + ' text-right'">
                    <div class="flex justify-end gap-1.5">
                      <button type="button" [class]="estilos.botonIcono" (click)="deshacer(d.diaSemana)"
                              [disabled]="!d.pendiente"
                              [attr.aria-label]="'Deshacer el cambio del ' + DIAS[d.diaSemana - 1].toLowerCase()"
                              title="Deshacer">
                        <lucide-angular name="rotate-ccw" [size]="14" class="block"></lucide-angular>
                      </button>
                      <button type="button" [class]="estilos.botonIcono" (click)="abrirHorario(d.diaSemana)"
                              [attr.aria-label]="'Cambiar horario del ' + DIAS[d.diaSemana - 1].toLowerCase()"
                              title="Cambiar">
                        <lucide-angular name="pencil" [size]="14" class="block"></lucide-angular>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="!px-3 !py-10 text-center">
                    <strong class="block text-[13.5px]">Sin horario</strong>
                    <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                      Ni este ámbito ni la empresa tienen un horario vigente. Créalo con «Nuevo horario».
                    </span>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr class="border-t border-[#e6e9ee] bg-[#f4f6f9] font-bold dark:border-slate-800 dark:bg-slate-800/60">
                <td [class]="estilos.td" colspan="3">Total semanal</td>
                <td [class]="estilos.td">{{ totalSemana() }}</td>
                <td [class]="estilos.td" colspan="2">
                  <span class="aviso-semana" [class.ok]="cuadraLaSemana()" [class.mal]="!cuadraLaSemana()">
                    {{ avisoSemana() }}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-[minmax(0,35fr)_minmax(0,65fr)]">
          <!-- Tolerancias y pausas: cada regla se cambia por separado,
               que es como se piensan y como se explican. -->
          <div class="flex flex-col">
            <div class="fila-seccion">
              <h2 class="titulo-seccion !m-0">Tolerancias y pausas</h2>
              @if (politica()?.heredada) {
                <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400"
                      title="Al cambiar una regla se crea una propia de esta subcartera">
                  De la empresa
                </span>
              }
            </div>
            <div class="bento">
              @for (r of reglas(); track r.clave) {
                <div class="regla">
                  <div class="cabeza">
                    <span class="icono"><lucide-angular [name]="r.icono" [size]="15" class="block"></lucide-angular></span>
                  </div>
                  <h3 [class]="estilos.rotulo + ' !m-0'">{{ r.nombre }}</h3>
                  <div class="cifra">{{ r.cifra }}@if (r.unidad) {<small>{{ r.unidad }}</small>}</div>
                  <p class="pie-cifra">{{ r.pie }}</p>
                  <div class="pie-tarjeta">
                    <button type="button" [class]="estilos.botonChico" (click)="abrirRegla(r)"
                            [attr.aria-label]="'Editar ' + r.nombre.toLowerCase()">
                      <lucide-angular name="pencil" [size]="13" class="block"></lucide-angular>
                      Editar
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- El registro de cambios -->
          <div class="flex flex-col">
            <div class="fila-seccion">
              <h2 class="titulo-seccion !m-0">Cambios de horario</h2>
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ cambios().length }} {{ cambios().length === 1 ? 'registro' : 'registros' }}
              </span>
            </div>
            <div [class]="estilos.panel + ' flex flex-1 flex-col !overflow-hidden'">
              <ul class="lista-panel flex-1">
                @for (c of paginaCambios(); track c.clave) {
                  <li>
                    <div class="min-w-0 flex-1">
                      <span class="dia-reg">
                        <i class="punto-tipo" [style.background]="c.vigente ? '#16a34a' : '#8491a3'"></i>
                        <strong>{{ c.desde }}{{ c.hasta ? ' – ' + c.hasta : '' }}</strong>
                        @if (c.vigente) { <span [class]="PASTILLA.ok">Vigente</span> }
                      </span>
                      <div class="pie-reg">{{ c.alcance }} · {{ c.dias }} · {{ c.horario }}</div>
                    </div>
                    <button type="button" [class]="estilos.botonChico" (click)="cambio.set(c)">
                      <lucide-angular name="eye" [size]="13" class="block"></lucide-angular>
                      Ver detalle
                    </button>
                  </li>
                } @empty {
                  <li class="!justify-center !py-10 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                    Todavía no se ha cambiado ningún horario
                  </li>
                }
                @for (h of huecosCambios(); track $index) {
                  <li class="hueco" aria-hidden="true">
                    <div><strong class="text-[12.5px]">&nbsp;</strong><div class="pie-reg">&nbsp;</div></div>
                  </li>
                }
              </ul>
              @if (cambios().length) {
                <div class="flex items-center justify-between gap-3 border-t border-[#f1f3f6] px-3 py-2.5 dark:border-slate-800">
                  <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ textoPagina() }}</span>
                  <div class="flex gap-1.5">
                    <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() - 1)"
                            [disabled]="pagina() === 0" aria-label="Página anterior">
                      <lucide-angular name="chevron-left" [size]="14" class="block"></lucide-angular>
                    </button>
                    <button type="button" [class]="estilos.botonIcono" (click)="pagina.set(pagina() + 1)"
                            [disabled]="!hayMas()" aria-label="Página siguiente">
                      <lucide-angular name="chevron-right" [size]="14" class="block"></lucide-angular>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      </div>
    }

    @if (tab() === 'calendario') {
      <!-- La barra del mes, con lo que se hace desde aquí -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center gap-2">
          <button type="button" [class]="estilos.botonIcono + ' text-[15px]'" (click)="moverMes(-1)"
                  aria-label="Mes anterior">‹</button>
          <strong class="min-w-[138px] text-center text-[14.5px] capitalize">{{ tituloMes() }}</strong>
          <button type="button" [class]="estilos.botonIcono + ' text-[15px]'" (click)="moverMes(1)"
                  aria-label="Mes siguiente">›</button>
          <button type="button" [class]="estilos.botonChico" (click)="irAHoy()">Hoy</button>
        </div>

        <div class="flex flex-wrap gap-2">
          <button type="button" [class]="estilos.botonSecundario" (click)="importarFeriados()"
                  [disabled]="guardando()">
            <lucide-angular name="upload" [size]="15" class="block"></lucide-angular>
            Importar feriados del año
          </button>
          <button type="button" [class]="estilos.botonPrimario" (click)="abrirDia(hoyISO(), null)">
            <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
            Agregar día
          </button>
        </div>
      </div>

      <div class="px-7 py-5">
      <div class="aparecer">
        <div class="grid items-start gap-4 min-[1060px]:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div>
            <!-- Qué significa cada fondo, antes de la rejilla -->
            <div class="fila-seccion">
              <div class="leyenda-cal">
                @for (l of LEYENDA; track l.texto) {
                  <span><i [style.background]="l.fondo" [style.border-color]="l.borde"></i>{{ l.texto }}</span>
                }
              </div>
            </div>

            <div class="mes">
              @for (c of CABECERAS; track c) { <div class="cab-dia">{{ c }}</div> }
              @for (d of celdas(); track d.fecha) {
                <button type="button" class="dia-cal"
                        [class.fuera]="!d.delMes" [class.finde]="d.finde" [class.hoy]="d.esHoy"
                        [disabled]="!d.delMes"
                        (click)="abrirDia(d.fecha, d.marca)"
                        [attr.aria-label]="'Marcar el ' + d.dia + ' como no laborable'">
                  <span class="num">{{ d.dia }}</span>
                  <!-- El fin de semana no se espera a nadie: un feriado en sábado
                       no cambia nada y marcarlo solo ensucia el mes. -->
                  @if (d.marca && !d.finde) {
                    <span class="etq-dia"
                          [class]="esFeriadoDia(d.marca) ? 'etq-feriado' : 'etq-sinasig'"
                          [title]="textoDia(d.marca)">
                      {{ etiquetaDia(d.marca) }}
                    </span>
                  }
                </button>
              }
            </div>
          </div>

          <div>
            <div class="fila-seccion">
              <h2 class="titulo-seccion !m-0">Días registrados</h2>
              <span class="text-[11.5px] lowercase text-[#5f6c80] dark:text-slate-400">{{ tituloMes() }}</span>
            </div>
            <div [class]="estilos.panel">
              <ul class="lista-panel">
                @for (d of diasOrdenados(); track d.id) {
                  <li>
                    <div class="min-w-0">
                      <span class="dia-reg">
                        <i class="punto-tipo" [style.background]="esFeriadoDia(d) ? '#dc2626' : '#ea580c'"></i>
                        <strong>{{ diaCorto(d.fecha) }}</strong>
                        <span [class]="esFeriadoDia(d) ? PASTILLA.neutro : PASTILLA.incomp">{{ d.tipo }}</span>
                      </span>
                      <div class="pie-reg">
                        {{ textoDia(d) }} · {{ alcanceDia(d) }}{{ recuperable(d) ? ' · se recupera' : '' }}
                      </div>
                    </div>
                    <!-- El formulario dice a quién alcanza: un día de la empresa sale
                         con «Empresa» y se cambia para todos a la vista. -->
                    <button type="button" [class]="estilos.botonChico" (click)="abrirDia(d.fecha, d)">
                      Editar
                    </button>
                  </li>
                } @empty {
                  <li>
                    <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">Ningún día registrado en este mes</span>
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    }

    <!-- Editar el horario de un día -->
    @if (formHorario()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarHorario()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,460px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-horario">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-horario" class="!m-0 text-[15px] font-extrabold">
                {{ horarioNuevo ? 'Nuevo horario' : 'Cambiar horario' }}
              </h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ aplicarSemana ? 'De lunes a viernes' : DIAS[nuevoHorario.diaSemana - 1] }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarHorario()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-col gap-1">
              <span [class]="estilos.etiqueta">Alcance</span>
              <p class="!m-0 text-[13px]">{{ alcance() }}</p>
            </div>
            @if (horarioNuevo && !aplicarSemana) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="h-dia">Día</label>
                <select id="h-dia" [class]="estilos.campo" [(ngModel)]="nuevoHorario.diaSemana">
                  @for (d of DIAS; track $index) {
                    <option [ngValue]="$index + 1">{{ d }}</option>
                  }
                </select>
              </div>
            }
            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="h-entrada">Entrada</label>
                <input id="h-entrada" type="time" [class]="estilos.campo" [(ngModel)]="nuevoHorario.horaEntrada">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="h-salida">Salida</label>
                <input id="h-salida" type="time" [class]="estilos.campo" [(ngModel)]="nuevoHorario.horaSalida">
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-desde">Rige desde</label>
              <input id="h-desde" type="date" [class]="estilos.campo" [(ngModel)]="nuevoHorario.vigenteDesde">
            </div>
            <!-- Casi siempre el cambio es para toda la semana laboral: hacerlo
                 día a día son cinco formularios iguales. -->
            <label class="flex cursor-pointer items-center gap-2.5 text-[13px]" for="h-semana">
              <input id="h-semana" type="checkbox" class="h-4 w-4 accent-[#0f172a]"
                     [(ngModel)]="aplicarSemana">
              Aplicar el mismo horario de lunes a viernes
            </label>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="h-motivo">Motivo del cambio</label>
              <input id="h-motivo" type="text" [class]="estilos.campo"
                     placeholder="Ej.: cierre de mes, se extiende media hora"
                     [(ngModel)]="nuevoHorario.motivo">
            </div>
            <div class="flex flex-col gap-1">
              <span [class]="estilos.etiqueta">Jornada resultante</span>
              <p class="!m-0 text-[13px]"
                 [class]="jornadaResultante().error ? 'text-[#b91c1c] dark:text-red-300' : ''">
                {{ jornadaResultante().texto }}
              </p>
            </div>
            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarHorario()">Cancelar</button>
            <!-- Aplicar deja el cambio en la tabla; se guarda con el Guardar de arriba. -->
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarHorario()">Aplicar</button>
          </footer>
        </div>
      </div>
    }

    <!-- Cambiar una regla. Una sola: es como se piensan y como se explican,
         y un formulario con las ocho a la vez invita a tocar de más. -->
    @if (regla(); as r) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarRegla()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,420px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-regla">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-regla" class="!m-0 text-[15px] font-extrabold">Cambiar regla</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ r.nombre }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarRegla()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1">
              <span [class]="estilos.etiqueta">Alcance</span>
              <p class="!m-0 text-[13px]">{{ alcance() }}</p>
            </div>

            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="r-minutos">Minutos</label>
                <input id="r-minutos" type="number" min="0" max="240" step="5"
                       [class]="estilos.campo" [(ngModel)]="reglaMinutos">
              </div>
              @if (r.conHora) {
                <div class="flex flex-1 flex-col gap-1.5">
                  <label [class]="estilos.etiqueta" for="r-hora">Hora</label>
                  <input id="r-hora" type="time" [class]="estilos.campo"
                         [(ngModel)]="reglaHora" [disabled]="!reglaMinutos">
                </div>
              }
            </div>

            @if (r.clave === 'break') {
              <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Cero minutos significa que esta subcartera no tiene break.
              </p>
            }

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="r-motivo">Motivo</label>
              <input id="r-motivo" type="text" [class]="estilos.campo"
                     placeholder="Un tope que cambia sin explicación es una discusión garantizada"
                     [(ngModel)]="reglaMotivo">
            </div>

            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarRegla()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarRegla()" [disabled]="guardando()">
              <lucide-angular name="save" [size]="15" class="block"></lucide-angular>
              Guardar
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- El detalle de un cambio de horario del historial -->
    @if (cambio(); as c) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cambio.set(null)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto w-[min(100%,520px)] overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-cambio">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-cambio" class="!m-0 text-[15px] font-extrabold">Cambio de horario</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ c.desde }}{{ c.hasta ? ' – ' + c.hasta : ' · vigente' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cambio.set(null)" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>
          <div class="px-5 py-4">
            <dl class="ficha">
              <dt>Alcance</dt><dd>{{ c.alcance }}</dd>
              <dt>Día</dt><dd>{{ c.dias }}</dd>
              <dt>Horario</dt><dd class="tabular-nums">{{ c.horario }}</dd>
              <dt>Motivo</dt><dd>{{ c.motivo }}</dd>
              <dt>Registrado por</dt><dd>{{ c.registradoPor ?? '—' }}</dd>
            </dl>
          </div>
          <footer class="flex justify-end border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cambio.set(null)">Cerrar</button>
          </footer>
        </div>
      </div>
    }

    <!-- Marcar un día del calendario: uno o un rango, con lo que cuesta en horas -->
    @if (formDia()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarDia()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,460px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-dia">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-dia" class="!m-0 text-[15px] font-extrabold">
                {{ diaEditado() ? 'Editar día no laborable' : 'Marcar día no laborable' }}
              </h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                @if (diaEditado(); as d) {
                  {{ d.fecha | date: 'dd/MM/yyyy' }}
                } @else {
                  Se puede marcar un día o un rango
                }
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarDia()" aria-label="Cerrar">
              <lucide-angular name="x" [size]="15" class="block"></lucide-angular>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="d-desde">Desde</label>
                <input id="d-desde" type="date" [class]="estilos.campo"
                       [ngModel]="diaDesde()" (ngModelChange)="cambiarDesde($event)">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="d-hasta">Hasta</label>
                <input id="d-hasta" type="date" [class]="estilos.campo" [min]="diaDesde()"
                       [ngModel]="diaHasta()" (ngModelChange)="diaHasta.set($event)">
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="d-tipo">Tipo</label>
              <select id="d-tipo" [class]="estilos.campo" [ngModel]="diaTipo()" (ngModelChange)="cambiarTipo($event)">
                @for (t of tiposDelFormulario(); track t.id) {
                  <option [ngValue]="t.id">{{ t.nombre }}</option>
                }
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="d-alcance">Alcance</label>
              <select id="d-alcance" [class]="estilos.campo" [ngModel]="diaAlcance()" (ngModelChange)="diaAlcance.set($event)">
                @for (o of alcances(); track o.id) {
                  <option [ngValue]="o.id">{{ o.texto }}</option>
                }
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <span [class]="estilos.etiqueta">Recuperación</span>
              @let r = recuperacion();
              @if (r.tipo === 'invalido') {
                <p class="!m-0 text-[13px]">—</p>
              } @else {
                <div class="rounded-lg border border-[#e6e9ee] bg-[#f6f7f9] px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
                  @if (r.tipo === 'no') {
                    <p class="!m-0 text-[12.5px] leading-normal">
                      <strong class="font-semibold">No se recupera.</strong>
                      <span class="text-[#5f6c80] dark:text-slate-400">El día se paga y nadie devuelve horas.</span>
                    </p>
                  } @else if (r.tipo === 'nada') {
                    <p class="!m-0 text-[11.5px] leading-normal text-[#5f6c80] dark:text-slate-400">
                      Ese rango no tiene días laborables {{ r.enAlcance }}: no hay nada que recuperar.
                    </p>
                  } @else {
                    <div class="text-[15px] font-bold tabular-nums">
                      {{ enDuracion(r.minutos) }}<small [class]="estilos.unidad">por recuperar</small>
                    </div>
                    <p class="!m-0 mt-0.5 text-[11.5px] leading-normal text-[#5f6c80] dark:text-slate-400">
                      {{ r.dias }} {{ r.dias === 1 ? 'día no trabajado' : 'días no trabajados' }} {{ r.deAlcance }}.
                      @if (!r.quedan) {
                        <span [class]="avisoMal">No quedan días laborables de {{ r.mes }} para recuperarlo</span>
                      } @else if (r.conMediaHora <= r.quedan) {
                        Se devuelve dentro de {{ r.mes }}:
                        <strong class="text-[#0f172a] dark:text-slate-100">media hora extra durante {{ r.conMediaHora }} {{ r.conMediaHora === 1 ? 'día' : 'días' }}</strong>,
                        de los {{ r.quedan }} que quedan.
                      } @else {
                        <span [class]="avisoMal">Con media hora extra no alcanza antes de fin de {{ r.mes }}</span><br>
                        Harían falta <strong class="text-[#0f172a] dark:text-slate-100">{{ r.porDia }} min por día</strong>
                        en los {{ r.quedan }} días que quedan.
                      }
                    </p>
                  }
                </div>
              }
            </div>

            <!-- Un feriado se llama por su nombre; un día sin asignación pide el motivo. -->
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="d-motivo">{{ esFeriado() ? 'Nombre del feriado' : 'Motivo' }}</label>
              <input id="d-motivo" type="text" list="lista-feriados" autocomplete="off" [class]="estilos.campo"
                     [placeholder]="esFeriado() ? 'Ej.: Combate de Angamos' : 'Ej.: sin carga de asignación del estudio'"
                     aria-describedby="error-d-motivo"
                     [ngModel]="diaTexto()" (ngModelChange)="diaTexto.set($event); faltaTexto.set(false)">
              <!-- Los oficiales del año se ofrecen como sugerencia, sin obligar. -->
              <datalist id="lista-feriados">
                @if (esFeriado()) {
                  @for (f of feriadosSugeridos(); track $index) { <option [value]="f"></option> }
                }
              </datalist>
              @if (faltaTexto()) {
                <p id="error-d-motivo" class="!m-0 text-xs text-[#b91c1c] dark:text-red-300">
                  Hace falta: es lo que se lee en el calendario
                </p>
              }
            </div>

            @if (error()) {
              <p class="!m-0 text-xs text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            @if (diaEditado()) {
              <button type="button" [class]="estilos.botonSecundario + ' mr-auto'" (click)="quitarDesdeModal()"
                      [disabled]="guardando()">Quitar</button>
            }
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarDia()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarDia()" [disabled]="guardando()">
              {{ guardando() ? 'Guardando…' : 'Guardar' }}
            </button>
          </footer>
        </div>
      </div>
    }
  `
})
export class AsistenciaConfiguracionComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly DIAS = DIAS;
  protected readonly CABECERAS = CABECERAS;

  /** Las pastillas del historial y del calendario, con los tonos de Cashi. */
  protected readonly PASTILLA = {
    ok: 'inline-flex items-center rounded-full bg-[#e8f5ec] px-[9px] py-[2px] text-[11.5px] font-bold text-[#166534] dark:bg-green-950/50 dark:text-green-300',
    neutro: 'inline-flex items-center rounded-full bg-[#f1f3f6] px-[9px] py-[2px] text-[11.5px] font-bold text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400',
    incomp: 'inline-flex items-center rounded-full bg-[#fdeee0] px-[9px] py-[2px] text-[11.5px] font-bold text-[#c2410c] dark:bg-orange-950/50 dark:text-orange-300',
    tarde: 'inline-flex items-center rounded-full bg-[#fef6e0] px-[9px] py-[2px] text-[11.5px] font-bold text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300'
  };

  /** Los tres colores del reloj, con su nombre. */
  protected readonly LEYENDA_RELOJ = [
    { texto: 'Trabajo', color: 'color-mix(in srgb, #0f172a 72%, #fff)' },
    { texto: 'Almuerzo', color: 'color-mix(in srgb, #f59e0b 88%, #fff)' },
    { texto: 'Break', color: 'color-mix(in srgb, #ea580c 82%, #fff)' }
  ];

  /** Qué dice cada fondo de la rejilla. */
  protected readonly LEYENDA = [
    { texto: 'Laborable', fondo: '#ffffff', borde: '#e6e9ee' },
    { texto: 'Fin de semana', fondo: '#f1f3f6', borde: '#e6e9ee' },
    { texto: 'Feriado', fondo: '#fdecec', borde: '#dc2626' },
    { texto: 'Sin asignación', fondo: '#fdeee0', borde: '#ea580c' }
  ];

  protected readonly TABS = [
    { clave: 'horarios', texto: 'Horarios' },
    { clave: 'calendario', texto: 'Calendario' }
  ] as const;

  /** Vuelve al reporte; la pantalla la manda el módulo. */
  readonly volver = output<void>();

  readonly idSubcartera = input<number | null>(null);

  readonly tab = signal<string>('horarios');
  /** El horario que de verdad rige: persona, subcartera o empresa, por día. */
  readonly horarios = signal<Horario[]>([]);
  readonly historial = signal<Horario[]>([]);
  readonly politica = signal<PoliticaAsistencia | null>(null);
  readonly tipos = signal<TipoDia[]>([]);
  readonly dias = signal<DiaCalendario[]>([]);
  /** Los días registrados del año: es el número de la pestaña. */
  readonly diasDelAnio = signal<DiaCalendario[]>([]);
  readonly pagina = signal(0);
  readonly mes = signal(new Date());
  readonly anio = computed(() => this.mes().getFullYear());

  readonly guardando = signal(false);
  /** «Guardado» se queda unos segundos y vuelve a «Sin cambios». */
  readonly guardado = signal(false);
  readonly error = signal('');

  /** La persona con excepción, si se está mirando una. */
  readonly idPersona = signal<number | null>(null);
  readonly personas = signal<ResumenAgente[]>([]);
  /** Casi siempre el cambio es para toda la semana laboral. */
  aplicarSemana = true;
  /** El modal se abrió con «Nuevo horario»: deja elegir el día. */
  horarioNuevo = false;

  readonly formHorario = signal(false);
  readonly formDia = signal(false);

  /** La regla que se está cambiando, y el detalle de un cambio de horario. */
  readonly regla = signal<Regla | null>(null);
  readonly cambio = signal<CambioHorario | null>(null);
  reglaMinutos = 0;
  reglaHora: string | null = null;
  reglaMotivo = '';

  nuevoHorario: Horario = {
    idSubcartera: null,
    idUsuario: null,
    diaSemana: 1,
    horaEntrada: '08:00',
    horaSalida: '18:30',
    vigenteDesde: hoy(),
    motivo: ''
  };

  /** El formulario de día. El registro que se edita; null si es uno nuevo. */
  readonly diaEditado = signal<DiaCalendario | null>(null);
  readonly diaDesde = signal(hoy());
  readonly diaHasta = signal(hoy());
  readonly diaTipo = signal(0);
  /** null = toda la empresa; si no, la subcartera elegida. */
  readonly diaAlcance = signal<number | null>(null);
  readonly diaTexto = signal('');
  readonly faltaTexto = signal(false);
  /** Los feriados oficiales, por año, para sugerirlos en el nombre. */
  private readonly feriadosPorAnio = signal<Map<number, string[]>>(new Map());

  protected readonly enDuracion = enDuracion;
  /** El aviso en rojo con su punto, como el de las 48 horas. */
  protected readonly avisoMal = "inline-flex items-center gap-[7px] font-semibold text-[#b91c1c] before:h-2 before:w-2 before:rounded-full before:bg-current before:content-[''] dark:text-red-300";

  /** Lo que se ha cambiado y aún no se ha guardado, por día de la semana. */
  readonly borrador = signal<Map<number, { entrada: string; salida: string; motivo: string; vigenteDesde: string }>>(new Map());

  /**
   * El nombre de la subcartera elegida. El módulo solo pasa el id; el nombre
   * sale del historial o, si no hay cambios propios, de su gente.
   */
  readonly nombreSubcartera = computed(() => {
    const id = this.idSubcartera();
    return this.historial().find(h => h.idSubcartera === id && h.subcartera)?.subcartera
      ?? this.personas().find(p => p.subcartera)?.subcartera
      ?? 'Esta subcartera';
  });

  /**
   * La escala del eje: desde una hora antes de la entrada más temprana hasta
   * una después de la salida más tardía, redondeado a un número par de horas
   * para que las marcas caigan cada dos.
   */
  private readonly escala = computed(() => {
    const filas = this.filasCrudas();
    if (!filas.length) {
      return { desde: 7 * 60, hasta: 21 * 60 };
    }
    const ini = Math.min(...filas.map(f => aMinutos(f.entrada))) - 60;
    const fin = Math.max(...filas.map(f => aMinutos(f.salida))) + 60;
    const desde = Math.floor(ini / 60);
    let hasta = Math.ceil(fin / 60);
    if ((hasta - desde) % 2) {
      hasta += 1;
    }
    return { desde: desde * 60, hasta: hasta * 60 };
  });

  /** Las marcas del eje, cada dos horas. */
  readonly marcasDelEje = computed(() => {
    const { desde, hasta } = this.escala();
    const marcas: string[] = [];
    for (let m = desde; m <= hasta; m += 120) {
      marcas.push(`${String(m / 60).padStart(2, '0')}:00`);
    }
    return marcas;
  });

  /**
   * Los días que se trabajan, con el borrador encima si lo hay. Un día sin
   * horario no se pinta: la tabla dice lo que rige, no la semana entera.
   */
  private readonly filasCrudas = computed(() => {
    const vigentes = this.horarios();
    const cambios = this.borrador();
    const filas: { diaSemana: number; entrada: string; salida: string; pendiente: boolean }[] = [];
    for (let dia = 1; dia <= 7; dia++) {
      const fila = vigentes.find(h => h.diaSemana === dia);
      const cambio = cambios.get(dia);
      if (!fila && !cambio) {
        continue;
      }
      filas.push({
        diaSemana: dia,
        entrada: cambio ? cambio.entrada : this.hhmm(fila!.horaEntrada),
        salida: cambio ? cambio.salida : this.hhmm(fila!.horaSalida),
        pendiente: !!cambio
      });
    }
    return filas;
  });

  /**
   * Las filas listas para pintar: horas, jornada y el turno situado sobre el
   * eje, con las pausas que caigan dentro recortadas encima.
   */
  readonly semana = computed(() => {
    const { desde, hasta } = this.escala();
    const total = hasta - desde;
    const p = this.politica();

    return this.filasCrudas().map(f => {
      const ini = aMinutos(f.entrada);
      const fin = aMinutos(f.salida);
      const izquierda = ((ini - desde) / total) * 100;
      const ancho = ((fin - ini) / total) * 100;

      // Solo entra la pausa que cabe ENTERA dentro del turno: un sábado de
      // media jornada no tiene almuerzo, y una subcartera sin break no lo
      // tiene ningún día.
      const cortes = [];
      for (const [tipo, hora, minutos] of [
        ['almuerzo', p?.horaAlmuerzo, p?.minutosAlmuerzo],
        ['break', p?.horaBreak, p?.minutosBreak]
      ] as [string, string | null | undefined, number | undefined][]) {
        if (!hora || !minutos) {
          continue;
        }
        const h = aMinutos(this.hhmm(hora));
        if (h < ini || h + minutos > fin) {
          continue;
        }
        cortes.push({
          tipo,
          izquierda: ((h - ini) / (fin - ini)) * 100,
          ancho: (minutos / (fin - ini)) * 100
        });
      }

      const jornada = fin - ini - this.almuerzoDentro(ini, fin);
      return {
        ...f,
        horaEntrada: f.entrada,
        horaSalida: f.salida,
        jornada: enHoras(jornada),
        minutosJornada: jornada,
        izquierda, ancho, cortes,
        // El sábado solo lo trabaja CASTIGO, y desde casa.
        remoto: f.diaSemana === 6
      };
    });
  });

  /** La suma de la semana tal como se está viendo, con el borrador incluido. */
  private readonly minutosSemana = computed(() =>
    this.semana().reduce((total, d) => total + d.minutosJornada, 0));

  readonly totalSemana = computed(() => enHoras(this.minutosSemana()));

  readonly cuadraLaSemana = computed(() => this.minutosSemana() === MINUTOS_SEMANA);

  readonly avisoSemana = computed(() => {
    const diferencia = this.minutosSemana() - MINUTOS_SEMANA;
    if (diferencia === 0) {
      return 'Cumple las 48 horas semanales';
    }
    return diferencia < 0
      ? `Faltan ${enHoras(-diferencia)} para las 48 horas semanales`
      : `Se excede en ${enHoras(diferencia)} de las 48 horas semanales`;
  });

  /** Lo que dice la etiqueta junto al Guardar. */
  readonly estadoHorario = computed(() => {
    if (this.guardado()) {
      return 'Guardado';
    }
    const n = this.borrador().size;
    return n ? `${n} ${n === 1 ? 'día sin guardar' : 'días sin guardar'}` : 'Sin cambios';
  });

  /**
   * Las cuatro reglas de la política, cada una con lo suyo. Se enseñan y se
   * cambian por separado porque así es como se piensan: «el break es de 15
   * minutos a las cinco», no «la política tiene ocho campos».
   */
  readonly reglas = computed<Regla[]>(() => {
    const p = this.politica();
    if (!p) {
      return [];
    }
    return [
      {
        clave: 'dia', nombre: 'Tolerancia del día', icono: 'clock',
        pie: 'Pasado esto se pierde el bono',
        cifra: String(p.toleranciaDiaMin), unidad: 'min',
        minutos: p.toleranciaDiaMin, hora: null, conHora: false
      },
      {
        clave: 'semana', nombre: 'Tolerancia de la semana', icono: 'calendar-days',
        pie: 'Suma solo los días con retraso',
        cifra: String(p.toleranciaSemanaMin), unidad: 'min',
        minutos: p.toleranciaSemanaMin, hora: null, conHora: false
      },
      {
        clave: 'almuerzo', nombre: 'Almuerzo', icono: 'utensils',
        pie: 'No cuenta como trabajado',
        cifra: String(p.minutosAlmuerzo),
        unidad: p.horaAlmuerzo ? `min · ${this.hhmm(p.horaAlmuerzo)}` : 'min',
        minutos: p.minutosAlmuerzo, hora: p.horaAlmuerzo ? this.hhmm(p.horaAlmuerzo) : null,
        conHora: true
      },
      {
        clave: 'break', nombre: 'Break', icono: 'coffee',
        pie: 'Después del almuerzo',
        cifra: p.minutosBreak ? String(p.minutosBreak) : 'Sin break',
        unidad: p.minutosBreak ? (p.horaBreak ? `min · ${this.hhmm(p.horaBreak)}` : 'min') : '',
        minutos: p.minutosBreak, hora: p.horaBreak ? this.hhmm(p.horaBreak) : null,
        conHora: true
      }
    ];
  });

  /** A quién aplica lo que se está cambiando, con nombre. */
  readonly alcance = computed(() => {
    const idPersona = this.idPersona();
    if (idPersona) {
      const persona = this.personas().find(p => p.idUsuario === idPersona)?.nombreAgente ?? 'Esta persona';
      return `${persona} · solo esta persona`;
    }
    return this.idSubcartera() ? this.nombreSubcartera() : 'Todas las carteras (configuración por defecto)';
  });

  /**
   * El historial, un cambio por línea. Los días que cambiaron a la vez, con
   * el mismo motivo y la misma vigencia, van juntos: «Lun a Vie», no cinco
   * líneas iguales.
   */
  readonly cambios = computed<CambioHorario[]>(() => {
    const grupos = new Map<string, Horario[]>();
    for (const h of this.historial()) {
      const clave = [h.vigenteDesde, h.vigenteHasta ?? '', h.motivo, h.idSubcartera ?? '', h.idUsuario ?? ''].join('|');
      (grupos.get(clave) ?? grupos.set(clave, []).get(clave)!).push(h);
    }
    return [...grupos.entries()].map(([clave, filas]) => {
      const ordenadas = [...filas].sort((a, b) => a.diaSemana - b.diaSemana);
      const primera = ordenadas[0];
      const unicos = (valores: string[]) => [...new Set(valores)].join(' / ');
      return {
        clave,
        desde: this.fechaLarga(primera.vigenteDesde),
        hasta: primera.vigenteHasta ? this.fechaLarga(primera.vigenteHasta) : null,
        vigente: !primera.vigenteHasta,
        alcance: this.alcanceDe(primera),
        dias: this.textoDias(ordenadas.map(h => h.diaSemana)),
        horario: `${unicos(ordenadas.map(h => this.hhmm(h.horaEntrada)))} – ${unicos(ordenadas.map(h => this.hhmm(h.horaSalida)))}`,
        motivo: primera.motivo,
        registradoPor: primera.registradoPor ?? null
      };
    });
  });

  readonly paginaCambios = computed(() =>
    this.cambios().slice(this.pagina() * CAMBIOS_POR_PAGINA, (this.pagina() + 1) * CAMBIOS_POR_PAGINA));

  /** Huecos invisibles: la última página mide lo mismo que las demás. */
  readonly huecosCambios = computed(() => {
    const visibles = this.paginaCambios().length;
    return visibles ? Array.from({ length: CAMBIOS_POR_PAGINA - visibles }) : [];
  });

  readonly hayMas = computed(() =>
    (this.pagina() + 1) * CAMBIOS_POR_PAGINA < this.cambios().length);

  /** Solo los tipos que tienen sentido en un calendario, no los de ausencia. */
  readonly tiposDeCalendario = computed(() =>
    this.tipos().filter(t => ['FERIADO', 'NO_LABORABLE', 'SIN_ASIGNACION'].includes(t.codigo)));

  readonly esFeriado = computed(() =>
    this.tipos().find(t => t.id === this.diaTipo())?.codigo === 'FERIADO');

  /** Feriado o sin asignación, como en el artifact; y el del día que se edita, si es otro. */
  readonly tiposDelFormulario = computed(() => {
    const actual = this.diaEditado()?.idTipoDia;
    return this.tiposDeCalendario()
      .filter(t => t.codigo === 'FERIADO' || t.codigo === 'SIN_ASIGNACION' || t.id === actual)
      .sort((a, b) => (a.codigo === 'FERIADO' ? -1 : b.codigo === 'FERIADO' ? 1 : 0));
  });

  /** A quién alcanza: la empresa entera o la subcartera elegida. */
  readonly alcances = computed(() => {
    const ambito = this.idSubcartera();
    const opciones: { id: number | null; texto: string }[] = [{ id: null, texto: 'Empresa' }];
    if (ambito) {
      opciones.push({ id: ambito, texto: this.nombreSubcartera() });
    }
    return opciones;
  });

  readonly feriadosSugeridos = computed(() =>
    this.feriadosPorAnio().get(Number(this.diaDesde().slice(0, 4))) ?? []);

  /**
   * Las horas a recuperar salen del horario de los días que cubre: un feriado
   * se paga y no se recupera; un día sin asignación se devuelve con media hora
   * extra en los días que quedan del mes. RR.HH. solo lo revisa.
   */
  readonly recuperacion = computed(() => {
    const vacio = { minutos: 0, dias: 0, quedan: 0, conMediaHora: 0, porDia: 0, mes: '', enAlcance: '', deAlcance: '' };
    const tipo = this.tipos().find(t => t.id === this.diaTipo());
    if (!tipo?.recuperable) {
      return { ...vacio, tipo: 'no' as const };
    }
    const desde = this.diaDesde();
    const hasta = this.diaHasta() || desde;
    if (!desde || hasta < desde) {
      return { ...vacio, tipo: 'invalido' as const };
    }

    const empresa = this.diaAlcance() === null;
    const enAlcance = empresa ? 'en la empresa' : `en ${this.nombreSubcartera()}`;
    const deAlcance = empresa ? 'de toda la empresa' : `de ${this.nombreSubcartera()}`;

    let minutos = 0;
    let dias = 0;
    for (let f = desde; f <= hasta; f = sumarDias(f, 1)) {
      const jornada = this.jornadaDe(f);
      if (jornada) {
        minutos += jornada;
        dias += 1;
      }
    }
    if (!minutos) {
      return { ...vacio, tipo: 'nada' as const, enAlcance };
    }

    // El pago cierra con el mes: lo que se deja de trabajar se devuelve dentro
    // del mismo mes, no en el siguiente.
    const [anio, mes] = hasta.split('-').map(Number);
    const finMes = `${anio}-${String(mes).padStart(2, '0')}-${new Date(anio, mes, 0).getDate()}`;
    let quedan = 0;
    for (let f = sumarDias(hasta, 1); f <= finMes; f = sumarDias(f, 1)) {
      if (this.jornadaDe(f)) {
        quedan += 1;
      }
    }
    const MEDIA_HORA = 30;
    return {
      ...vacio, tipo: 'calculo' as const, minutos, dias, quedan, enAlcance, deAlcance,
      conMediaHora: Math.ceil(minutos / MEDIA_HORA),
      porDia: quedan ? Math.ceil(minutos / quedan) : 0,
      mes: MESES[mes - 1].toLowerCase()
    };
  });

  readonly tituloMes = computed(() =>
    `${MESES[this.mes().getMonth()]} ${this.mes().getFullYear()}`);

  readonly diasOrdenados = computed(() =>
    [...this.dias()].sort((a, b) => a.fecha.localeCompare(b.fecha)));

  /**
   * Las celdas del mes. Arranca el lunes de la semana del día 1 y ocupa solo
   * las semanas que hagan falta: reservar siempre seis filas deja una fila
   * entera vacía en la mitad de los meses.
   *
   * Lo que es «fin de semana» sale del HORARIO del ámbito, no del día de la
   * semana: en CASTIGO el sábado se trabaja y no puede salir en gris.
   */
  readonly celdas = computed(() => {
    const base = this.mes();
    const anio = base.getFullYear();
    const mes = base.getMonth();

    const laborables = new Set(this.horarios().map(h => h.diaSemana));
    const desplazamiento = (new Date(anio, mes, 1).getDay() + 6) % 7;
    const diasDelMes = new Date(anio, mes + 1, 0).getDate();
    const cuantas = Math.ceil((desplazamiento + diasDelMes) / 7) * 7;

    const marcados = new Map(this.dias().map(d => [d.fecha, d]));
    const hoyTexto = hoy();

    return Array.from({ length: cuantas }, (_, i) => {
      const dia = new Date(anio, mes, 1 - desplazamiento + i);
      const fecha = this.aISO(dia);
      const iso = ((dia.getDay() + 6) % 7) + 1;
      return {
        fecha,
        dia: dia.getDate(),
        delMes: dia.getMonth() === mes,
        finde: !laborables.has(iso),
        esHoy: fecha === hoyTexto,
        marca: marcados.get(fecha) ?? null
      };
    });
  });

  /** El ancho del break en la pista de 24 horas. */
  readonly anchoBreak = computed(() => {
    const p = this.politica();
    return p?.minutosBreak ? (p.minutosBreak / (24 * 60)) * 100 : 0;
  });

  private avisoGuardado: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const ambito = this.idSubcartera();
      this.cargarHorarios(ambito);
    });
    effect(() => {
      const ambito = this.idSubcartera();
      const base = this.mes();
      this.cargarCalendario(ambito, base);
    });
    // El número de la pestaña es del año: solo se pide al cambiar de año.
    effect(() => {
      const ambito = this.idSubcartera();
      const anio = this.anio();
      this.cargarAnio(ambito, anio);
    });

    // El selector de excepción solo lista a quien está en el ámbito elegido.
    effect(() => {
      const ambito = this.idSubcartera();
      if (!ambito) {
        this.personas.set([]);
        this.idPersona.set(null);
        return;
      }
      const lunes = lunesDe(new Date());
      this.servicio.reporte(lunes, finDeSemanaDe(new Date()), ambito).subscribe({
        next: r => this.personas.set(r.agentes),
        error: () => this.personas.set([])
      });
    });

    this.servicio.tiposDeDia().subscribe({
      next: t => {
        this.tipos.set(t);
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de día')
    });
  }

  /** Cambiar de persona recarga el horario: el suyo puede no ser el de todos. */
  elegirPersona(id: number | null): void {
    this.idPersona.set(id);
    this.borrador.set(new Map());
    this.cargarHorarios(this.idSubcartera());
  }

  /**
   * El horario que rige cada día, con la misma precedencia que el reporte:
   * la persona sobre la subcartera y la subcartera sobre la empresa. Pedir
   * solo el de la subcartera dejaba CASTIGO con el sábado y nada más, como
   * si de lunes a viernes no se trabajara.
   */
  private cargarHorarios(idSubcartera: number | null): void {
    const idPersona = this.idPersona();
    const vacio = of([] as Horario[]);
    forkJoin({
      empresa: this.servicio.horarios(null),
      subcartera: idSubcartera ? this.servicio.horarios(idSubcartera) : vacio,
      persona: idSubcartera && idPersona ? this.servicio.horarios(idSubcartera, idPersona) : vacio
    }).subscribe({
      next: ({ empresa, subcartera, persona }) => {
        const efectivo: Horario[] = [];
        for (let dia = 1; dia <= 7; dia++) {
          const fila = persona.find(h => h.diaSemana === dia)
            ?? subcartera.find(h => h.diaSemana === dia)
            ?? empresa.find(h => h.diaSemana === dia);
          if (fila) {
            efectivo.push(fila);
          }
        }
        this.horarios.set(efectivo);
      },
      error: () => this.toast.error('No se pudo cargar el horario')
    });

    // El historial también junta los dos niveles: lo de la empresa rige aquí
    // mientras la subcartera no tenga lo suyo.
    forkJoin({
      empresa: this.servicio.historialHorarios(null),
      propio: idSubcartera ? this.servicio.historialHorarios(idSubcartera) : vacio
    }).subscribe({
      next: ({ empresa, propio }) => {
        const unicos = new Map([...empresa, ...propio].map(h => [h.id, h]));
        // Lo vigente primero y, dentro de cada grupo, lo más reciente arriba.
        this.historial.set([...unicos.values()].sort((a, b) =>
          Number(!!a.vigenteHasta) - Number(!!b.vigenteHasta)
          || (b.vigenteDesde ?? '').localeCompare(a.vigenteDesde ?? '')
          || (b.id ?? 0) - (a.id ?? 0)));
        this.pagina.set(0);
      },
      error: () => this.toast.error('No se pudo cargar el historial')
    });
    this.servicio.politica(idSubcartera).subscribe({
      next: p => this.politica.set(p),
      error: () => this.toast.error('No se pudieron cargar las tolerancias')
    });
  }

  private cargarCalendario(idSubcartera: number | null, base: Date): void {
    const desde = this.aISO(new Date(base.getFullYear(), base.getMonth(), 1));
    const hasta = this.aISO(new Date(base.getFullYear(), base.getMonth() + 1, 0));
    this.servicio.calendario(desde, hasta, idSubcartera).subscribe({
      next: d => this.dias.set(d),
      error: () => this.toast.error('No se pudo cargar el calendario')
    });
  }

  private cargarAnio(idSubcartera: number | null, anio: number): void {
    this.servicio.calendario(`${anio}-01-01`, `${anio}-12-31`, idSubcartera).subscribe({
      next: d => this.diasDelAnio.set(d),
      error: () => this.diasDelAnio.set([])
    });
  }

  /** Tras marcar o quitar un día: el mes que se ve y el número del año. */
  private recargarCalendario(): void {
    this.cargarCalendario(this.idSubcartera(), this.mes());
    this.cargarAnio(this.idSubcartera(), this.anio());
  }

  moverMes(paso: number): void {
    const base = this.mes();
    this.mes.set(new Date(base.getFullYear(), base.getMonth() + paso, 1));
  }

  irAHoy(): void {
    const ahora = new Date();
    this.mes.set(new Date(ahora.getFullYear(), ahora.getMonth(), 1));
  }

  hoyISO(): string {
    return hoy();
  }

  /**
   * Fecha local a texto. `toISOString()` pasa por UTC y en Lima devuelve el día
   * anterior para todo lo que caiga antes de las 19:00.
   */
  private aISO(fecha: Date): string {
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${fecha.getFullYear()}-${mes}-${dia}`;
  }

  /**
   * Trae los feriados nacionales del año que se está viendo. Se pulsa una vez
   * al empezar el año: escribirlos a mano son veinte formularios.
   */
  importarFeriados(): void {
    const anio = this.mes().getFullYear();
    this.guardando.set(true);
    this.servicio.importarFeriados(anio).subscribe({
      next: r => {
        this.guardando.set(false);
        this.toast.success(r.importados
          ? `${r.importados} feriados de ${anio} añadidos`
          : `Los feriados de ${anio} ya estaban`);
        this.recargarCalendario();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudieron importar los feriados');
      }
    });
  }

  // ==================== HORARIO ====================

  /** Abre el cambio de un día concreto, con lo que hoy tiene puesto. */
  abrirHorario(diaSemana?: number): void {
    const dia = diaSemana ?? this.semana()[0]?.diaSemana ?? 1;
    const fila = this.semana().find(d => d.diaSemana === dia);
    this.formHorario.set(true);
    this.error.set('');
    this.horarioNuevo = diaSemana === undefined;
    this.aplicarSemana = diaSemana === undefined;
    this.nuevoHorario = {
      idSubcartera: this.idSubcartera(),
      idUsuario: this.idPersona(),
      diaSemana: dia,
      horaEntrada: fila?.horaEntrada ?? '08:00',
      horaSalida: fila?.horaSalida ?? '18:30',
      vigenteDesde: hoy(),
      motivo: ''
    };
  }

  cerrarHorario(): void {
    this.formHorario.set(false);
  }

  /** Quita el cambio de un día y deja lo que estaba vigente. */
  deshacer(diaSemana: number): void {
    this.borrador.update(actual => {
      const copia = new Map(actual);
      copia.delete(diaSemana);
      return copia;
    });
  }

  /**
   * Guarda los días del borrador de una vez.
   *
   * Se acumulan y se guardan juntos, y no uno por uno al cerrar el modal,
   * porque la semana tiene que sumar 48 horas: cambiar un día suelto la
   * descuadra y el guardado se bloquea hasta que vuelve a cuadrar.
   */
  guardarHorarios(): void {
    const cambios = [...this.borrador().entries()];
    if (!cambios.length) {
      return;
    }

    this.guardando.set(true);
    let pendientes = cambios.length;
    let fallo: string | null = null;

    for (const [diaSemana, cambio] of cambios) {
      this.servicio.guardarHorario({
        idSubcartera: this.idSubcartera(),
        idUsuario: this.idPersona(),
        diaSemana,
        horaEntrada: cambio.entrada,
        horaSalida: cambio.salida,
        vigenteDesde: cambio.vigenteDesde,
        motivo: cambio.motivo
      }).subscribe({
        next: () => this.alGuardarHorario(--pendientes, fallo),
        error: respuesta => {
          fallo = respuesta?.error?.error ?? respuesta?.error ?? 'No se pudo guardar';
          this.alGuardarHorario(--pendientes, fallo);
        }
      });
    }
  }

  /** El modal no persiste: deja el cambio en el borrador de la tabla. */
  guardarHorario(): void {
    if (!this.nuevoHorario.motivo.trim()) {
      this.error.set('El motivo es obligatorio: queda en el registro de cambios');
      return;
    }
    if (this.nuevoHorario.horaSalida <= this.nuevoHorario.horaEntrada) {
      this.error.set('La salida tiene que ser posterior a la entrada');
      return;
    }

    const dias = this.aplicarSemana ? [1, 2, 3, 4, 5] : [this.nuevoHorario.diaSemana];
    this.borrador.update(actual => {
      const copia = new Map(actual);
      for (const dia of dias) {
        copia.set(dia, {
          entrada: this.nuevoHorario.horaEntrada,
          salida: this.nuevoHorario.horaSalida,
          motivo: this.nuevoHorario.motivo.trim(),
          vigenteDesde: this.nuevoHorario.vigenteDesde ?? hoy()
        });
      }
      return copia;
    });
    this.guardado.set(false);
    this.cerrarHorario();
  }

  private alGuardarHorario(pendientes: number, fallo: string | null): void {
    if (pendientes > 0) {
      return;
    }
    this.guardando.set(false);
    if (fallo) {
      this.error.set(fallo);
      this.toast.error(fallo);
      return;
    }
    this.borrador.set(new Map());
    this.toast.success('Horario guardado');
    this.cargarHorarios(this.idSubcartera());

    // La etiqueta confirma y a los pocos segundos vuelve a «Sin cambios».
    this.guardado.set(true);
    if (this.avisoGuardado) {
      clearTimeout(this.avisoGuardado);
    }
    this.avisoGuardado = setTimeout(() => this.guardado.set(false), 3000);
  }

  /** La jornada que quedaría con las horas del modal, ya sin el almuerzo. */
  jornadaResultante(): { texto: string; error: boolean } {
    const { horaEntrada, horaSalida } = this.nuevoHorario;
    if (!horaEntrada || !horaSalida) {
      return { texto: '—', error: false };
    }
    const ini = aMinutos(horaEntrada);
    const fin = aMinutos(horaSalida);
    if (fin <= ini) {
      return { texto: 'La salida tiene que ser posterior a la entrada', error: true };
    }
    const almuerzo = this.almuerzoDentro(ini, fin);
    return {
      texto: enHoras(fin - ini - almuerzo)
        + (almuerzo ? ' · ya descontada la hora de almuerzo, que no se trabaja' : ''),
      error: false
    };
  }

  /** Los minutos de almuerzo, si el almuerzo cae entero dentro del turno. */
  private almuerzoDentro(ini: number, fin: number): number {
    const p = this.politica();
    if (!p?.horaAlmuerzo || !p.minutosAlmuerzo) {
      return 0;
    }
    const h = aMinutos(this.hhmm(p.horaAlmuerzo));
    return h >= ini && h + p.minutosAlmuerzo <= fin ? p.minutosAlmuerzo : 0;
  }

  // ==================== UNA REGLA ====================

  abrirRegla(r: Regla): void {
    this.regla.set(r);
    this.reglaMinutos = r.minutos;
    this.reglaHora = r.hora;
    this.reglaMotivo = '';
    this.error.set('');
  }

  cerrarRegla(): void {
    this.regla.set(null);
  }

  /**
   * Guarda la política entera con esa regla cambiada: es versionada, así que
   * cada cambio cierra la vigente y abre otra con TODOS los valores. Mandar
   * solo el campo tocado dejaría los demás en su valor por defecto.
   */
  guardarRegla(): void {
    const r = this.regla();
    const actual = this.politica();
    if (!r || !actual) {
      return;
    }
    if (!this.reglaMotivo.trim()) {
      this.error.set('El motivo del cambio es obligatorio');
      return;
    }

    const nueva: PoliticaAsistencia = {
      idSubcartera: this.idSubcartera(),
      toleranciaDiaMin: r.clave === 'dia' ? this.reglaMinutos : actual.toleranciaDiaMin,
      toleranciaSemanaMin: r.clave === 'semana' ? this.reglaMinutos : actual.toleranciaSemanaMin,
      minutosAlmuerzo: r.clave === 'almuerzo' ? this.reglaMinutos : actual.minutosAlmuerzo,
      minutosBreak: r.clave === 'break' ? this.reglaMinutos : actual.minutosBreak,
      horaAlmuerzo: r.clave === 'almuerzo' ? this.reglaHora : actual.horaAlmuerzo,
      horaBreak: r.clave === 'break' ? this.reglaHora : actual.horaBreak,
      avisoPrevioMin: actual.avisoPrevioMin,
      vigenteDesde: hoy(),
      motivo: this.reglaMotivo.trim()
    };

    this.guardando.set(true);
    this.servicio.guardarPolitica(nueva).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarRegla();
        this.toast.success(`${r.nombre} actualizada`);
        this.cargarHorarios(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar');
      }
    });
  }

  // ==================== CALENDARIO ====================

  abrirDia(fecha: string, marca: DiaCalendario | null): void {
    const feriado = this.tiposDeCalendario().find(t => t.codigo === 'FERIADO');
    this.diaEditado.set(marca);
    this.diaDesde.set(marca?.fecha ?? fecha);
    this.diaHasta.set(marca?.fecha ?? fecha);
    // Lo nuevo empieza como feriado de la empresa, que es lo que más se marca.
    this.diaTipo.set(marca?.idTipoDia ?? feriado?.id ?? this.tiposDeCalendario()[0]?.id ?? 0);
    this.diaAlcance.set(marca ? (marca.idSubcartera ?? null) : null);
    this.diaTexto.set(marca ? this.textoDia(marca) : '');
    this.faltaTexto.set(false);
    this.error.set('');
    this.formDia.set(true);
    this.cargarFeriados(Number((marca?.fecha ?? fecha).slice(0, 4)));
  }

  cerrarDia(): void {
    this.formDia.set(false);
  }

  cambiarDesde(fecha: string): void {
    this.diaDesde.set(fecha);
    if (!this.diaHasta() || this.diaHasta() < fecha) {
      this.diaHasta.set(fecha);
    }
    if (fecha) {
      this.cargarFeriados(Number(fecha.slice(0, 4)));
    }
  }

  /** Un feriado es de la empresa; el día sin asignación, de una cartera. */
  cambiarTipo(id: number): void {
    this.diaTipo.set(id);
    if (this.tipos().find(t => t.id === id)?.codigo === 'FERIADO') {
      this.diaAlcance.set(null);
    }
  }

  guardarDia(): void {
    const texto = this.diaTexto().trim();
    if (!texto) {
      this.faltaTexto.set(true);
      return;
    }
    const desde = this.diaDesde();
    const hasta = this.diaHasta() || desde;
    if (!desde || hasta < desde) {
      this.error.set('La fecha final no puede ser anterior a la inicial');
      return;
    }
    const fechas = this.fechasAMarcar(desde, hasta);
    if (!fechas.length) {
      this.error.set('Ese rango no tiene días laborables');
      return;
    }

    const editado = this.diaEditado();
    const feriado = this.esFeriado();
    const alcance = this.diaAlcance();
    const base = {
      idSubcartera: alcance,
      idTipoDia: this.diaTipo(),
      nombre: feriado ? texto : null,
      // El backend pide motivo siempre; el de un feriado importado se conserva.
      motivo: feriado ? (editado?.nombre && editado.motivo ? editado.motivo : texto) : texto
    };
    // Si al editar se movió la fecha o el alcance, el registro de antes sobra.
    const sobraElAnterior = !!editado?.id
      && ((editado.idSubcartera ?? null) !== alcance || !fechas.includes(editado.fecha));

    this.guardando.set(true);
    this.error.set('');
    forkJoin(fechas.map(fecha => this.servicio.marcarDia({ ...base, fecha }))).pipe(
      switchMap(() => sobraElAnterior
        ? this.servicio.quitarDia(editado!.id!, editado!.idSubcartera ?? null)
        : of(null))
    ).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarDia();
        this.toast.success(fechas.length === 1 ? 'Día marcado' : `${fechas.length} días marcados`);
        this.recargarCalendario();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo marcar el día');
        this.recargarCalendario();
      }
    });
  }

  /**
   * Un día suelto se marca tal cual; en un rango solo los días que se trabajan,
   * que son los que dejan de trabajarse. Sin horario cargado, todos.
   */
  private fechasAMarcar(desde: string, hasta: string): string[] {
    if (desde === hasta) {
      return [desde];
    }
    const todas: string[] = [];
    for (let f = desde; f <= hasta; f = sumarDias(f, 1)) {
      todas.push(f);
    }
    return this.semana().length ? todas.filter(f => this.jornadaDe(f) > 0) : todas;
  }

  /** Los minutos de jornada de una fecha según el horario que rige; 0 si no se trabaja. */
  private jornadaDe(fecha: string): number {
    const diaSemana = ((new Date(fecha + 'T00:00:00').getDay() + 6) % 7) + 1;
    return this.semana().find(f => f.diaSemana === diaSemana)?.minutosJornada ?? 0;
  }

  private cargarFeriados(anio: number): void {
    if (!anio || this.feriadosPorAnio().has(anio)) {
      return;
    }
    this.servicio.feriados(anio).subscribe({
      next: lista => this.feriadosPorAnio.update(m =>
        new Map(m).set(anio, [...new Set(lista.map(f => f.nombre))])),
      error: () => { /* sin sugerencias; el campo se escribe igual */ }
    });
  }

  /** Quitar desde el propio modal, que es donde se está mirando el día. */
  quitarDesdeModal(): void {
    const editado = this.diaEditado();
    if (editado) {
      this.cerrarDia();
      this.quitarDia(editado);
    }
  }

  /** Se quita en su propio alcance: el formulario ya dijo si era de la empresa. */
  quitarDia(d: DiaCalendario): void {
    if (!d.id) {
      return;
    }
    this.servicio.quitarDia(d.id, d.idSubcartera ?? null).subscribe({
      next: () => {
        this.toast.success('Día quitado del calendario');
        this.recargarCalendario();
      },
      error: respuesta => this.toast.error(respuesta?.error?.error ?? 'No se pudo quitar')
    });
  }

  // ==================== PRESENTACIÓN ====================

  esFeriadoDia(d: DiaCalendario): boolean {
    return d.tipoCodigo === 'FERIADO';
  }

  /** Un feriado se llama por su nombre; lo demás, por su motivo. */
  textoDia(d: DiaCalendario): string {
    return this.esFeriadoDia(d) ? (d.nombre ?? d.motivo) : d.motivo;
  }

  /** La etiqueta de la rejilla: el nombre del feriado, o el tipo y a quién toca. */
  etiquetaDia(d: DiaCalendario): string {
    return this.esFeriadoDia(d) ? (d.nombre ?? d.tipo ?? '') : `${d.tipo ?? 'No laborable'} · ${this.alcanceDia(d)}`;
  }

  alcanceDia(d: DiaCalendario): string {
    return d.heredado || !d.idSubcartera ? 'Empresa' : this.nombreSubcartera();
  }

  /** Lo recuperable lo dice el tipo: un feriado se paga; un día sin asignación se devuelve. */
  recuperable(d: DiaCalendario): boolean {
    return this.tipos().find(t => t.id === d.idTipoDia)?.recuperable ?? false;
  }

  /** «08 dic». */
  diaCorto(fecha: string): string {
    const [, mes, dia] = fecha.split('-');
    return `${dia} ${MESES_CORTOS[Number(mes) - 1]}`;
  }

  /** Dónde cae una hora en una pista que va de 00:00 a 24:00. */
  porcentaje(hora: string): number {
    const [h, m] = this.hhmm(hora).split(':').map(Number);
    return ((h * 60 + m) / (24 * 60)) * 100;
  }

  hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  textoPagina(): string {
    const desde = this.pagina() * CAMBIOS_POR_PAGINA + 1;
    const hasta = Math.min(desde + CAMBIOS_POR_PAGINA - 1, this.cambios().length);
    return `${desde}–${hasta} de ${this.cambios().length}`;
  }

  /** «01/09/2026». */
  private fechaLarga(iso: string | undefined | null): string {
    if (!iso) {
      return '—';
    }
    const [anio, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${anio}`;
  }

  /** «Sábado», «Lun a Vie» o «Lun, Mié»: los días de un cambio, como se dicen. */
  private textoDias(dias: number[]): string {
    if (dias.length === 1) {
      return DIAS[dias[0] - 1];
    }
    const seguidos = dias.every((d, i) => i === 0 || d === dias[i - 1] + 1);
    return seguidos
      ? `${DIAS_CORTOS[dias[0] - 1]} a ${DIAS_CORTOS[dias[dias.length - 1] - 1]}`
      : dias.map(d => DIAS_CORTOS[d - 1]).join(', ');
  }

  /** A quién aplica una fila del historial: la persona, la subcartera o todas. */
  private alcanceDe(h: Horario): string {
    const subcartera = h.idSubcartera
      ? (h.subcartera ?? (h.idSubcartera === this.idSubcartera() ? this.nombreSubcartera() : 'Otra subcartera'))
      : 'Todas las carteras';
    return h.idUsuario ? `${h.persona ?? 'Una persona'} · ${subcartera}` : subcartera;
  }
}
