import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { forkJoin, of, switchMap } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import {
  DiaBase, DiaCalendario, Horario, HorarioBase, ImportacionFeriados, PoliticaAsistencia, TipoDia
} from './asistencia.models';
import {
  ESTILOS, TIPOS_DE_CALENDARIO, aMinutos, enDuracion, hoy, sumarDias
} from './asistencia.estilos';

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
  /** «Desde el lunes 28/09: 15 min»: lo que ya se cambió y todavía no rige. */
  programada: string | null;
}

const CABECERAS = DIAS_CORTOS;
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
               'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];

/** Todos trabajan 48 horas a la semana: el horario base tiene que sumarlas justas. */
const MINUTOS_SEMANA = 48 * 60;
const CORTO_BASE: Record<number, string> = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie' };

/** «9 h 30», «10 h», «45 min»: la jornada como se lee en el horario. */
function duracionBase(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h && m ? `${h} h ${String(m).padStart(2, '0')}` : h ? `${h} h` : `${m} min`;
}

/** «Lun 08:00–19:00 · Mar a Vie 08:00–18:30»: los días seguidos con el mismo horario, juntos. */
function textoHorario(dias: DiaBase[]): string {
  const grupos: { desde: number; hasta: number; entrada: string; salida: string }[] = [];
  for (const d of dias) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.entrada === d.entrada && ultimo.salida === d.salida) {
      ultimo.hasta = d.diaSemana;
    } else {
      grupos.push({ desde: d.diaSemana, hasta: d.diaSemana, entrada: d.entrada, salida: d.salida });
    }
  }
  return grupos.map(g => `${CORTO_BASE[g.desde]}${g.hasta !== g.desde ? ` a ${CORTO_BASE[g.hasta]}` : ''} ${g.entrada}–${g.salida}`)
    .join(' · ');
}

/**
 * Configuración del módulo: las reglas (tolerancias y pausas), el horario base
 * de la subcartera y el calendario.
 *
 * El horario base es el de lunes a viernes y suma 48 horas; cada subcartera
 * puede tener el suyo. Un cambio de regla o de horario base rige desde el lunes
 * siguiente, para no cambiar la semana que ya empezó, y queda en la Auditoría.
 * Lo que cambia el horario de una persona en una semana son sus recuperaciones.
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
    .titulo-seccion { margin: 0; font-size: 15px; font-weight: 800 }
    .fila-seccion {
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 10px; min-height: 38px; margin-bottom: 12px;
    }
    .leyenda-cal { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px }
    .leyenda-cal span { display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; color: #5f6c80 }
    .leyenda-cal i { width: 11px; height: 11px; border-radius: 3px; border: 1px solid #e6e9ee }
    :host-context(.dark) .leyenda-cal span { color: #94a3b8 }
    :host-context(.dark) .leyenda-cal i { border-color: #1e293b }

    /* Reglas: cuatro tarjetas en fila; dos en pantallas medianas y una en el móvil. */
    .bento { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); grid-auto-rows: minmax(104px, auto); gap: 12px }
    @media (max-width: 1100px) { .bento { grid-template-columns: repeat(2, minmax(0, 1fr)) } }
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
    .regla .cifra small { margin-left: 5px; font-size: 12.5px; font-weight: 600; letter-spacing: normal; color: #5f6c80 }
    .regla .pie-cifra { margin: 2px 0 0; padding-top: 4px; font-size: 11.5px; color: #5f6c80 }
    .regla .pie-tarjeta { margin-top: auto; padding-top: 10px }
    :host-context(.dark) .regla { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .regla .icono { background: #1e293b; color: #e2e8f0 }
    :host-context(.dark) .regla .cifra small,
    :host-context(.dark) .regla .pie-cifra { color: #94a3b8 }
    @media (max-width: 640px) { .bento { grid-template-columns: 1fr } }
    /* El cambio que ya se guardó y rige el lunes, debajo del valor de hoy. */
    .regla .programada { margin: 6px 0 0; font-size: 12px; font-weight: 600; color: #2563eb }
    :host-context(.dark) .regla .programada { color: #60a5fa }

    /* Horario base: la semana del equipo en seis días; el sábado, sin horario fijo. */
    .horario-base {
      display: flex; flex-direction: column; gap: 12px; padding: 14px 16px;
      background: #fff; border: 1px solid #e6e9ee; border-radius: 12px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, .04);
    }
    .dias-base { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px }
    @media (max-width: 760px) { .dias-base { grid-template-columns: repeat(3, minmax(0, 1fr)) } }
    .dia-base { display: flex; flex-direction: column; gap: 2px; padding: 10px 12px; border: 1px solid #e6e9ee; border-radius: 10px }
    .dia-base b { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80 !important }
    .dia-base strong { font-size: 14px; font-weight: 700; font-variant-numeric: tabular-nums }
    .dia-base small { font-size: 11.5px; color: #5f6c80 }
    .dia-base.libre { border-style: dashed; background: #f6f7f9 }
    .dia-base.libre strong { font-size: 12.5px; font-weight: 600; color: #5f6c80 !important }
    .horario-base .programada { margin: 0; font-size: 12px; font-weight: 600; color: #2563eb }
    .pie-base { display: flex; align-items: center; justify-content: space-between; gap: 12px }
    .pie-base p { margin: 0; font-size: 11.5px; color: #5f6c80 }
    :host-context(.dark) .horario-base { background: #0f172a; border-color: #1e293b; box-shadow: 0 1px 2px rgba(0, 0, 0, .3) }
    :host-context(.dark) .dia-base { border-color: #1e293b }
    :host-context(.dark) .dia-base b,
    :host-context(.dark) .dia-base.libre strong { color: #94a3b8 !important }
    :host-context(.dark) .dia-base small,
    :host-context(.dark) .pie-base p { color: #94a3b8 }
    :host-context(.dark) .dia-base.libre { background: #020617 }
    :host-context(.dark) .horario-base .programada { color: #60a5fa }
    /* En el formulario: la entrada y la salida de cada día, como en Corregir. */
    .tabla-base td { vertical-align: middle }
    :host input.celda-edit {
      width: 116px; height: 32px; padding: 0 8px; border-radius: 6px;
      border: 1px solid #8491a3 !important; background: #fff !important; color: #0f172a !important;
      font: inherit; font-size: 12.5px; font-variant-numeric: tabular-nums;
    }
    :host input.celda-edit:focus-visible {
      outline: none; border-color: #2563eb !important; box-shadow: 0 0 0 3px rgba(37,99,235,.2);
    }
    :host-context(.dark) input.celda-edit { border-color: #475569 !important; background: #0f172a !important; color: #f1f5f9 !important }
    .suma-base { margin: 0; font-size: 12.5px; font-weight: 600 }
    .suma-base.ok { color: #166534 }
    .suma-base.mal { color: #b91c1c }
    :host-context(.dark) .suma-base.ok { color: #86efac }
    :host-context(.dark) .suma-base.mal { color: #fca5a5 }

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
          <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Configuración</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Reglas de asistencia y calendario laboral
          </p>
        </div>
        <button type="button" [class]="estilos.botonSecundario" (click)="volver.emit()">
          <lucide-angular name="arrow-left" [size]="15" class="block"></lucide-angular>
          Volver al reporte
        </button>
      </div>
    </div>

    <!-- REGLAS Y HORARIO BASE. Un cambio rige desde el lunes siguiente. -->
    <div class="px-7 pb-2 pt-5">
    <div class="aparecer">
      <div class="fila-seccion">
        <h2 class="titulo-seccion !m-0">Reglas</h2>
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
              <span class="icono">@switch (r.clave) {@case ('dia') {<svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 1.8"/></svg>} @case ('semana') {<svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" rx="2"/><path d="M8 2.5v4M16 2.5v4M3 10h18"/></svg>} @case ('almuerzo') {<svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3v6a2.5 2.5 0 0 0 5 0V3"/><path d="M7.5 9v12"/><path d="M17.5 3c-1.4 1.8-2 3.6-2 5.6 0 1.6.7 2.4 2 2.4h1V3z"/><path d="M18.5 11v10"/></svg>} @default {<svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5h13v4.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8.5z"/><path d="M17 10h1.5a2 2 0 0 1 0 4H17"/><path d="M7 3v2.5M11 3v2.5"/></svg>}}</span>
            </div>
            <h3 [class]="estilos.rotulo + ' !mb-0.5'">{{ r.nombre }}</h3>
            <div class="cifra">{{ r.cifra }}@if (r.unidad) {<small>{{ r.unidad }}</small>}</div>
            <p class="pie-cifra">{{ r.pie }}</p>
            @if (r.programada) {
              <p class="programada">{{ r.programada }}</p>
            }
            <div class="pie-tarjeta">
              <button type="button" [class]="estilos.botonChico" (click)="abrirRegla(r)"
                      [attr.aria-label]="'Editar ' + r.nombre.toLowerCase()">
                <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Editar
              </button>
            </div>
          </div>
        }
      </div>

      <!-- El horario base de la subcartera: de lunes a viernes, 48 h. -->
      <div class="fila-seccion mt-[22px]">
        <div class="flex items-baseline gap-2.5">
          <h2 class="titulo-seccion !m-0">Horario base</h2>
          <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ cuentaBase() }}</span>
        </div>
      </div>
      <div class="horario-base">
        <div class="dias-base">
          @for (d of base()?.dias ?? []; track d.diaSemana) {
            <div class="dia-base">
              <b>{{ d.nombre }}</b><strong>{{ hhmm(d.entrada) }} – {{ hhmm(d.salida) }}</strong><small>{{ duracionBase(d.minutosJornada) }}</small>
            </div>
          }
          <div class="dia-base libre"><b>Sábado</b><strong>Sin horario fijo</strong><small>opcional</small></div>
        </div>
        @if (baseProgramada(); as prog) {
          <p class="programada">{{ prog }}</p>
        }
        <div class="pie-base">
          <p>El almuerzo no cuenta como trabajado. El sábado no tiene horario fijo: se usa para completar o recuperar.</p>
          <button type="button" [class]="estilos.botonChico" (click)="abrirBase()" [disabled]="!base()">
            <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            Editar
          </button>
        </div>
      </div>
    </div>
    </div>

    <!-- CALENDARIO -->
    <div class="px-7 pb-12 pt-3">
      <div class="aparecer">
        <div class="fila-seccion">
          <div class="flex items-baseline gap-2.5">
            <h2 class="titulo-seccion !m-0">Calendario</h2>
            <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ cuentaDelAnio() }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" [class]="estilos.botonSecundario" (click)="abrirImportar()">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 9 12 4 17 9"/><line x1="12" y1="4" x2="12" y2="16"/></svg>
              Importar feriados
            </button>
            <button type="button" [class]="estilos.botonPrimario" (click)="abrirDia(hoyISO(), null)">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
              Agregar día
            </button>
          </div>
        </div>
        <div class="mb-3.5 mt-0.5 flex items-center gap-2">
          <button type="button" [class]="estilos.botonIcono" (click)="moverMes(-1)"
                  aria-label="Mes anterior">‹</button>
          <strong class="min-w-[138px] text-center text-[14.5px] capitalize">{{ tituloMes() }}</strong>
          <button type="button" [class]="estilos.botonIcono" (click)="moverMes(1)"
                  aria-label="Mes siguiente">›</button>
          <button type="button" [class]="estilos.botonChico" (click)="irAHoy()">Hoy</button>
        </div>
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
                        [attr.aria-label]="'Marcar el ' + d.dia">
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
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ r.nombre }} · rige desde el lunes {{ proximoLunesCorto() }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarRegla()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex flex-col gap-3.5 px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <span class="text-[13px]">Alcance</span>
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

            @if (error()) {
              <p class="!m-0 text-[12px] text-[#b91c1c]">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarRegla()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarRegla()" [disabled]="guardando()">Guardar</button>
          </footer>
        </div>
      </div>
    }

    <!-- Cambiar el horario base: los cinco días, que sumen 48 h, con su motivo -->
    @if (formBase()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarBase()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,520px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-horario-base">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-horario-base" class="!m-0 text-[15px] font-extrabold">Cambiar horario base</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ nombreAmbito() }} · rige desde el lunes {{ proximoLunesCorto() }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarBase()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div [class]="estilos.panel">
              <table class="tabla-base w-full border-collapse">
                <caption class="sr-only">Entrada y salida de cada día</caption>
                <thead>
                  <tr>
                    <th scope="col" [class]="estilos.th">Día</th>
                    <th scope="col" [class]="estilos.th">Entrada</th>
                    <th scope="col" [class]="estilos.th">Salida</th>
                    <th scope="col" [class]="estilos.th">Jornada</th>
                  </tr>
                </thead>
                <tbody>
                  @for (f of filasBase(); track f.diaSemana; let i = $index) {
                    <tr>
                      <td [class]="estilos.td"><strong>{{ f.nombre }}</strong></td>
                      <td [class]="estilos.td">
                        <input class="celda-edit" type="time" [ngModel]="f.entrada" (ngModelChange)="cambiarFilaBase(i, 'entrada', $event)"
                               [attr.aria-label]="'Entrada del ' + f.nombre.toLowerCase()">
                      </td>
                      <td [class]="estilos.td">
                        <input class="celda-edit" type="time" [ngModel]="f.salida" (ngModelChange)="cambiarFilaBase(i, 'salida', $event)"
                               [attr.aria-label]="'Salida del ' + f.nombre.toLowerCase()">
                      </td>
                      <td [class]="estilos.td + ' font-bold'">{{ sumaBase().jornadas[i] === null ? '—' : duracionBase(sumaBase().jornadas[i] ?? 0) }}</td>
                    </tr>
                  }
                  <tr>
                    <td [class]="estilos.td"><strong>Sábado</strong></td>
                    <td [class]="estilos.td + ' secundario'" colspan="3">Sin horario fijo</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="suma-base" [class.ok]="sumaBase().ok" [class.mal]="!sumaBase().ok">{{ sumaBase().texto }}</p>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="motivo-horario-base">Motivo</label>
              <input id="motivo-horario-base" type="text" maxlength="200" [class]="estilos.campo"
                     placeholder="Ej.: el equipo entra media hora antes desde octubre"
                     aria-describedby="error-horario-base"
                     [ngModel]="motivoBase()" (ngModelChange)="motivoBase.set($event); faltaMotivoBase.set(false)">
              @if (faltaMotivoBase()) {
                <p id="error-horario-base" class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">Escribe el motivo: queda en la Auditoría</p>
              }
            </div>
            @if (errorBase()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ errorBase() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarBase()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarBase()"
                    [disabled]="guardando() || !sumaBase().ok">Guardar</button>
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
                {{ diaEditado() ? 'Editar día' : 'Marcar día' }}
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
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
              <span class="text-[13px]">Recuperación</span>
              @let r = recuperacion();
              @if (r.tipo === 'invalido') {
                <p class="!m-0 text-[13px]">—</p>
              } @else {
                <div class="rounded-[10px] border border-[#e6e9ee] bg-[#f4f6f9] px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                  @if (r.tipo === 'no') {
                    <div class="text-[19px] font-extrabold tracking-[-0.02em] tabular-nums">No se recupera</div>
                    <p class="!mb-0 !mt-0.5 text-[11.5px] leading-[1.5] text-[#5f6c80] dark:text-slate-400">El día se paga y nadie devuelve horas</p>
                  } @else if (r.tipo === 'nada') {
                    <p class="!m-0 text-[11.5px] leading-[1.5] text-[#5f6c80] dark:text-slate-400">
                      Ese rango no tiene días laborables {{ r.enAlcance }}: no hay nada que recuperar.
                    </p>
                  } @else {
                    <div class="text-[19px] font-extrabold tracking-[-0.02em] tabular-nums">
                      {{ enDuracion(r.minutos) }}<small class="ml-[5px] text-[12px] font-semibold tracking-normal text-[#5f6c80] dark:text-slate-400">por recuperar</small>
                    </div>
                    <p class="!mb-0 !mt-0.5 text-[11.5px] leading-[1.5] text-[#5f6c80] dark:text-slate-400">
                      {{ r.dias }} {{ r.dias === 1 ? 'día no trabajado' : 'días no trabajados' }} {{ r.deAlcance }}.
                      @if (!r.quedan) {
                        <span [class]="avisoMal">No quedan días laborables de {{ r.mes }} para recuperarlo</span>
                      } @else if (r.conMediaHora <= r.quedan) {
                        Se devuelve dentro de {{ r.mes }}:
                        <strong class="!text-[#0f172a] dark:!text-slate-100">media hora extra durante {{ r.conMediaHora }} {{ r.conMediaHora === 1 ? 'día' : 'días' }}</strong>,
                        de los {{ r.quedan }} que quedan.
                      } @else {
                        <span [class]="avisoMal">Con media hora extra no alcanza antes de fin de {{ r.mes }}</span><br>
                        Harían falta <strong class="!text-[#0f172a] dark:!text-slate-100">{{ r.porDia }} min por día</strong>
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
              <input id="d-motivo" type="text" list="lista-feriados" autocomplete="off" [attr.maxlength]="esFeriado() ? 120 : 200" [class]="estilos.campo"
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
                <p id="error-d-motivo" class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">
                  Hace falta: es lo que se lee en el calendario
                </p>
              }
            </div>

            @if (error()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
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
    <!-- Importar feriados: el archivo de RR.HH., con vista previa antes de guardar -->
    @if (formImportar()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarImportar()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,600px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-importar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-importar" class="!m-0 text-[15px] font-extrabold">Importar feriados</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Excel o CSV con dos columnas: Fecha y Nombre
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarImportar()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-wrap items-center gap-2">
              <input id="archivo-feriados" type="file" accept=".xlsx,.xls,.csv" class="sr-only"
                     (change)="elegirArchivo($event)">
              <label for="archivo-feriados" [class]="estilos.botonSecundario + ' cursor-pointer'">
                <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>
                {{ archivoFeriados() ? 'Elegir otro archivo' : 'Elegir archivo' }}
              </label>
              @if (archivoFeriados(); as a) {
                <span class="min-w-0 truncate text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ a.name }}</span>
              }
              <button type="button" [class]="estilos.botonSecundario + ' ml-auto'" (click)="descargarPlantilla()">
                <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>
                Descargar plantilla
              </button>
            </div>

            @if (leyendo()) {
              <p class="!m-0 py-6 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">Leyendo el archivo…</p>
            }

            @if (vistaImportacion(); as v) {
              <div class="flex flex-wrap gap-2">
                <span [class]="PASTILLA.ok">{{ v.nuevos }} {{ v.nuevos === 1 ? 'nuevo' : 'nuevos' }}</span>
                @if (v.existentes) {
                  <span [class]="PASTILLA.neutro">{{ v.existentes }} ya {{ v.existentes === 1 ? 'estaba' : 'estaban' }}</span>
                }
                @if (v.errores) {
                  <span [class]="PASTILLA.falta">{{ v.errores }} con error</span>
                }
              </div>
              <div [class]="estilos.panel + ' max-h-[320px] overflow-y-auto'">
                <table class="w-full border-collapse">
                  <caption class="sr-only">Filas del archivo y qué pasa con cada una</caption>
                  <thead class="sticky top-0">
                    <tr>
                      <th scope="col" [class]="estilos.th">Fila</th>
                      <th scope="col" [class]="estilos.th">Fecha</th>
                      <th scope="col" [class]="estilos.th">Nombre</th>
                      <th scope="col" [class]="estilos.th">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (f of v.filas; track f.fila) {
                      <tr>
                        <td [class]="estilos.td + ' secundario'">{{ f.fila }}</td>
                        <td [class]="estilos.td">{{ f.fecha ? (f.fecha | date: 'dd/MM/yyyy') : '—' }}</td>
                        <td [class]="estilos.td + ' max-w-[200px] truncate'" [title]="f.nombre ?? ''">{{ f.nombre || '—' }}</td>
                        <td [class]="estilos.td">
                          <span [class]="PASTILLA_FILA[f.estado].clase">{{ PASTILLA_FILA[f.estado].texto }}</span>
                          @if (f.detalle) {
                            <span class="secundario ml-2">{{ f.detalle }}</span>
                          }
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            @if (errorImportar()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ errorImportar() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrarImportar()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="confirmarImportacion()"
                    [disabled]="guardando() || !vistaImportacion()?.nuevos">
              <svg class="shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg>
              {{ guardando() ? 'Importando…' : textoImportar() }}
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
    tarde: 'inline-flex items-center rounded-full bg-[#fef6e0] px-[9px] py-[2px] text-[11.5px] font-bold text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300',
    falta: 'inline-flex items-center rounded-full bg-[#fdecec] px-[9px] py-[2px] text-[11.5px] font-bold text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300'
  };

  /** Qué pasa con cada fila del archivo de feriados. */
  protected readonly PASTILLA_FILA = {
    NUEVO: { texto: 'Nuevo', clase: this.PASTILLA.ok },
    YA_EXISTE: { texto: 'Ya estaba', clase: this.PASTILLA.neutro },
    ERROR: { texto: 'Error', clase: this.PASTILLA.falta }
  };

  /** Qué dice cada fondo de la rejilla. */
  protected readonly LEYENDA = [
    { texto: 'Laborable', fondo: '#ffffff', borde: '#e6e9ee' },
    { texto: 'Fin de semana', fondo: '#f1f3f6', borde: '#e6e9ee' },
    { texto: 'Feriado', fondo: '#fdecec', borde: '#dc2626' },
    { texto: 'Sin asignación', fondo: '#fdeee0', borde: '#ea580c' }
  ];

  /** Vuelve al reporte; la pantalla la manda el módulo. */
  readonly volver = output<void>();

  readonly idSubcartera = input<number | null>(null);
  /** El nombre de la subcartera elegida, para decir a quién alcanza un cambio. */
  readonly subcartera = input<string | null>(null);

  /** El horario que rige cada día (subcartera o empresa): marca los fines de semana y el costo de un día. */
  readonly horarios = signal<Horario[]>([]);
  readonly politica = signal<PoliticaAsistencia | null>(null);
  readonly tipos = signal<TipoDia[]>([]);
  readonly dias = signal<DiaCalendario[]>([]);
  /** Los días registrados del año: es el número junto al título. */
  readonly diasDelAnio = signal<DiaCalendario[]>([]);
  readonly mes = signal(new Date());
  readonly anio = computed(() => this.mes().getFullYear());

  readonly guardando = signal(false);
  readonly error = signal('');

  readonly formDia = signal(false);

  /** El horario base del ámbito: lunes a viernes y el cambio que rige desde el lunes. */
  readonly base = signal<HorarioBase | null>(null);
  /** El formulario del horario base: los cinco días que se están escribiendo. */
  readonly formBase = signal(false);
  readonly filasBase = signal<{ diaSemana: number; nombre: string; entrada: string; salida: string }[]>([]);
  readonly motivoBase = signal('');
  readonly faltaMotivoBase = signal(false);
  readonly errorBase = signal('');
  protected readonly duracionBase = duracionBase;

  /** La regla que se está cambiando. */
  readonly regla = signal<Regla | null>(null);
  reglaMinutos = 0;
  reglaHora: string | null = null;

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
  /** El aviso en rojo con su punto, para lo que no cuadra al marcar un día. */
  protected readonly avisoMal = "inline-flex items-center gap-[7px] font-semibold text-[#b91c1c] before:h-2 before:w-2 before:rounded-full before:bg-current before:content-[''] dark:text-red-300";
  readonly nombreSubcartera = computed(() => this.subcartera() ?? 'Esta subcartera');

  /** La jornada de cada día de la semana según el horario que rige, ya sin el almuerzo. */
  private readonly jornadas = computed(() => new Map(this.horarios().map(h => {
    const ini = aMinutos(this.hhmm(h.horaEntrada));
    const fin = aMinutos(this.hhmm(h.horaSalida));
    return [h.diaSemana, Math.max(0, fin - ini - this.almuerzoDentro(ini, fin))] as [number, number];
  })));

  /** «12 días registrados en 2026», junto al título del calendario. */
  readonly cuentaDelAnio = computed(() => {
    const n = this.diasDelAnio().length;
    return `${n} ${n === 1 ? 'día registrado' : 'días registrados'} en ${this.anio()}`;
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
    // Lo que ya se cambió y rige el lunes, solo en la regla que cambia.
    const prog = p.programada ?? null;
    const programada = (actual: string, luego: string | null) => prog && luego !== null && luego !== actual
      ? `Desde el lunes ${this.fechaCorta(prog.vigenteDesde)}: ${luego}` : null;
    const valor = {
      dia: (x: PoliticaAsistencia) => `${x.toleranciaDiaMin} min`,
      semana: (x: PoliticaAsistencia) => `${x.toleranciaSemanaMin} min`,
      almuerzo: (x: PoliticaAsistencia) => `${x.minutosAlmuerzo} min` + (x.horaAlmuerzo ? ` · ${this.hhmm(x.horaAlmuerzo)}` : ''),
      break: (x: PoliticaAsistencia) => x.minutosBreak && x.horaBreak ? `${x.minutosBreak} min · ${this.hhmm(x.horaBreak)}` : 'Sin break'
    };
    const luego = (clave: keyof typeof valor) => (prog ? valor[clave](prog) : null);
    return [
      {
        clave: 'dia', nombre: 'Tolerancia del día', icono: 'clock',
        pie: 'Pasado esto, límite diario excedido',
        cifra: String(p.toleranciaDiaMin), unidad: 'min',
        minutos: p.toleranciaDiaMin, hora: null, conHora: false,
        programada: programada(valor.dia(p), luego('dia'))
      },
      {
        clave: 'semana', nombre: 'Tolerancia de la semana', icono: 'calendar-days',
        pie: 'Suma solo los días con retraso',
        cifra: String(p.toleranciaSemanaMin), unidad: 'min',
        minutos: p.toleranciaSemanaMin, hora: null, conHora: false,
        programada: programada(valor.semana(p), luego('semana'))
      },
      {
        clave: 'almuerzo', nombre: 'Almuerzo', icono: 'utensils',
        pie: 'No cuenta como trabajado',
        cifra: String(p.minutosAlmuerzo),
        unidad: p.horaAlmuerzo ? `min · ${this.hhmm(p.horaAlmuerzo)}` : 'min',
        minutos: p.minutosAlmuerzo, hora: p.horaAlmuerzo ? this.hhmm(p.horaAlmuerzo) : null,
        conHora: true, programada: programada(valor.almuerzo(p), luego('almuerzo'))
      },
      {
        clave: 'break', nombre: 'Break', icono: 'coffee',
        pie: 'Después del almuerzo',
        cifra: p.minutosBreak ? String(p.minutosBreak) : 'Sin break',
        unidad: p.minutosBreak ? (p.horaBreak ? `min · ${this.hhmm(p.horaBreak)}` : 'min') : '',
        minutos: p.minutosBreak, hora: p.horaBreak ? this.hhmm(p.horaBreak) : null,
        conHora: true, programada: programada(valor.break(p), luego('break'))
      }
    ];
  });

  /** «CASTIGO» o «Todas las carteras»: de quién es el horario base que se ve. */
  readonly nombreAmbito = computed(() => (this.idSubcartera() ? this.nombreSubcartera() : 'Todas las carteras'));

  /** «CASTIGO · 48 h por semana», junto al título. */
  readonly cuentaBase = computed(() => {
    const b = this.base();
    return b ? `${this.nombreAmbito()} · ${duracionBase(b.minutosSemana)} por semana` : '';
  });

  /** «Desde el lunes 28/09: Lun a Vie 07:30–17:30»: lo guardado que todavía no rige. */
  readonly baseProgramada = computed(() => {
    const p = this.base()?.programado;
    return p ? `Desde el lunes ${this.fechaCorta(p.desde)}: ${textoHorario(p.dias.map(d => ({
      ...d, entrada: this.hhmm(d.entrada), salida: this.hhmm(d.salida)
    })))}` : null;
  });

  /**
   * La jornada de cada día del formulario y la suma de la semana. El almuerzo
   * es el que regirá el lunes (la regla ya cambiada, si la hay) y no cuenta.
   * Sin las 48 h justas no se puede guardar.
   */
  readonly sumaBase = computed(() => {
    const p = this.politica();
    const almuerzo = (p?.programada ?? p)?.minutosAlmuerzo ?? 60;
    const jornadas = this.filasBase().map(f => (f.entrada && f.salida
      ? Math.max(0, aMinutos(f.salida) - aMinutos(f.entrada) - almuerzo) : null));
    const total = jornadas.reduce<number>((t, j) => t + (j ?? 0), 0);
    const dif = total - MINUTOS_SEMANA;
    const texto = !dif ? `Suma ${duracionBase(total)} por semana`
      : dif < 0 ? `Suma ${duracionBase(total)}: faltan ${duracionBase(-dif)} para las 48 h`
        : `Suma ${duracionBase(total)}: sobran ${duracionBase(dif)} de las 48 h`;
    return { jornadas, ok: dif === 0, texto };
  });

  /** A quién aplica lo que se está cambiando, con nombre. */
  readonly alcance = computed(() =>
    this.idSubcartera() ? this.nombreSubcartera() : 'Todas las carteras (configuración por defecto)');

  /** Solo los tipos que tienen sentido en un calendario, no los de ausencia. */
  readonly tiposDeCalendario = computed(() =>
    this.tipos().filter(t => TIPOS_DE_CALENDARIO.includes(t.codigo)));

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

    this.servicio.tiposDeDia().subscribe({
      next: t => {
        this.tipos.set(t);
      },
      error: () => this.toast.error('No se pudieron cargar los tipos de día')
    });
  }

  /**
   * El horario que rige cada día, con la misma precedencia que el reporte:
   * la persona sobre la subcartera y la subcartera sobre la empresa. Pedir
   * solo el de la subcartera dejaba CASTIGO con el sábado y nada más, como
   * si de lunes a viernes no se trabajara.
   */
  private cargarHorarios(idSubcartera: number | null): void {
    const vacio = of([] as Horario[]);
    forkJoin({
      empresa: this.servicio.horarios(null),
      subcartera: idSubcartera ? this.servicio.horarios(idSubcartera) : vacio
    }).subscribe({
      next: ({ empresa, subcartera }) => {
        const efectivo: Horario[] = [];
        for (let dia = 1; dia <= 7; dia++) {
          const fila = subcartera.find(h => h.diaSemana === dia)
            ?? empresa.find(h => h.diaSemana === dia);
          if (fila) {
            efectivo.push(fila);
          }
        }
        this.horarios.set(efectivo);
      },
      error: () => this.toast.error('No se pudo cargar el horario')
    });

    this.servicio.politica(idSubcartera).subscribe({
      next: p => this.politica.set(p),
      error: () => this.toast.error('No se pudieron cargar las tolerancias')
    });

    this.servicio.horarioBase(idSubcartera).subscribe({
      next: b => this.base.set(b),
      error: () => this.toast.error('No se pudo cargar el horario base')
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

  // ==================== IMPORTAR FERIADOS ====================

  readonly formImportar = signal(false);
  readonly archivoFeriados = signal<File | null>(null);
  readonly vistaImportacion = signal<ImportacionFeriados | null>(null);
  readonly leyendo = signal(false);
  readonly errorImportar = signal('');

  readonly textoImportar = computed(() => {
    const n = this.vistaImportacion()?.nuevos ?? 0;
    return n === 1 ? 'Importar 1 feriado' : `Importar ${n} feriados`;
  });

  abrirImportar(): void {
    this.archivoFeriados.set(null);
    this.vistaImportacion.set(null);
    this.errorImportar.set('');
    this.formImportar.set(true);
  }

  cerrarImportar(): void {
    this.formImportar.set(false);
  }

  /** Al elegir el archivo se lee sin guardar: primero se ve qué entra y qué no. */
  elegirArchivo(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    const archivo = campo.files?.[0] ?? null;
    // Vaciarlo deja volver a elegir el mismo archivo después de corregirlo.
    campo.value = '';
    if (!archivo) {
      return;
    }
    this.archivoFeriados.set(archivo);
    this.vistaImportacion.set(null);
    this.errorImportar.set('');
    this.leyendo.set(true);
    this.servicio.importarArchivoFeriados(archivo, false).subscribe({
      next: vista => {
        this.leyendo.set(false);
        this.vistaImportacion.set(vista);
      },
      error: respuesta => {
        this.leyendo.set(false);
        this.errorImportar.set(respuesta?.error?.error ?? 'No se pudo leer el archivo');
      }
    });
  }

  /** Guarda las filas nuevas; las que ya estaban y las que tienen error no se tocan. */
  confirmarImportacion(): void {
    const archivo = this.archivoFeriados();
    if (!archivo) {
      return;
    }
    this.guardando.set(true);
    this.servicio.importarArchivoFeriados(archivo, true).subscribe({
      next: r => {
        this.guardando.set(false);
        this.formImportar.set(false);
        this.toast.success(r.nuevos === 1 ? '1 feriado añadido' : `${r.nuevos} feriados añadidos`);
        this.recargarCalendario();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.errorImportar.set(respuesta?.error?.error ?? 'No se pudieron importar los feriados');
      }
    });
  }

  descargarPlantilla(): void {
    this.servicio.plantillaFeriados().subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = 'Plantilla_feriados.xlsx';
        enlace.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('No se pudo descargar la plantilla')
    });
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

    const nueva: PoliticaAsistencia = {
      idSubcartera: this.idSubcartera(),
      toleranciaDiaMin: r.clave === 'dia' ? this.reglaMinutos : actual.toleranciaDiaMin,
      toleranciaSemanaMin: r.clave === 'semana' ? this.reglaMinutos : actual.toleranciaSemanaMin,
      minutosAlmuerzo: r.clave === 'almuerzo' ? this.reglaMinutos : actual.minutosAlmuerzo,
      minutosBreak: r.clave === 'break' ? this.reglaMinutos : actual.minutosBreak,
      horaAlmuerzo: r.clave === 'almuerzo' ? this.reglaHora : actual.horaAlmuerzo,
      horaBreak: r.clave === 'break' ? this.reglaHora : actual.horaBreak,
      avisoPrevioMin: actual.avisoPrevioMin,
      // La semana en curso se mide con la regla con la que empezó.
      vigenteDesde: this.proximoLunes()
    };

    this.guardando.set(true);
    this.servicio.guardarPolitica(nueva).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarRegla();
        this.toast.success(`${r.nombre}: rige desde el lunes ${this.proximoLunesCorto()}`);
        this.cargarHorarios(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo guardar');
      }
    });
  }

  // ==================== HORARIO BASE ====================

  /** Arranca con el que regirá el lunes: el ya cambiado, si lo hay, o el de hoy. */
  abrirBase(): void {
    const b = this.base();
    if (!b) {
      return;
    }
    const dias = b.programado?.dias ?? b.dias;
    this.filasBase.set(dias.map(d => ({
      diaSemana: d.diaSemana, nombre: d.nombre, entrada: this.hhmm(d.entrada), salida: this.hhmm(d.salida)
    })));
    this.motivoBase.set('');
    this.faltaMotivoBase.set(false);
    this.errorBase.set('');
    this.formBase.set(true);
    setTimeout(() => document.querySelector<HTMLInputElement>('.tabla-base input')?.focus());
  }

  cerrarBase(): void {
    this.formBase.set(false);
  }

  cambiarFilaBase(i: number, campo: 'entrada' | 'salida', valor: string): void {
    this.filasBase.update(filas => filas.map((f, j) => (j === i ? { ...f, [campo]: valor ?? '' } : f)));
  }

  /** Rige desde el lunes siguiente; el motivo va a la Auditoría. */
  guardarBase(): void {
    const motivo = this.motivoBase().trim();
    if (!motivo) {
      this.faltaMotivoBase.set(true);
      document.getElementById('motivo-horario-base')?.focus();
      return;
    }
    if (!this.sumaBase().ok) {
      return;
    }
    this.guardando.set(true);
    this.errorBase.set('');
    this.servicio.cambiarHorarioBase({
      idSubcartera: this.idSubcartera(),
      dias: this.filasBase().map(f => ({ diaSemana: f.diaSemana, entrada: f.entrada, salida: f.salida })),
      motivo
    }).subscribe({
      next: b => {
        this.guardando.set(false);
        this.base.set(b);
        this.cerrarBase();
        this.toast.success(`Horario base guardado: rige desde el lunes ${this.proximoLunesCorto()}`);
        this.cargarHorarios(this.idSubcartera());
      },
      error: respuesta => {
        this.guardando.set(false);
        this.errorBase.set(respuesta?.error?.error ?? 'No se pudo guardar');
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
    return this.horarios().length ? todas.filter(f => this.jornadaDe(f) > 0) : todas;
  }

  /** Los minutos de jornada de una fecha según el horario que rige; 0 si no se trabaja. */
  private jornadaDe(fecha: string): number {
    const diaSemana = ((new Date(fecha + 'T00:00:00').getDay() + 6) % 7) + 1;
    return this.jornadas().get(diaSemana) ?? 0;
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

  hhmm(hora: string): string {
    return hora.length > 5 ? hora.slice(0, 5) : hora;
  }

  /** El lunes que viene: desde ahí rige una regla nueva. */
  proximoLunes(): string {
    const hoyFecha = new Date();
    const dias = ((8 - hoyFecha.getDay()) % 7) || 7;
    return this.aISO(new Date(hoyFecha.getFullYear(), hoyFecha.getMonth(), hoyFecha.getDate() + dias));
  }

  proximoLunesCorto(): string {
    return this.fechaCorta(this.proximoLunes());
  }

  /** «2026-09-28» → «28/09». */
  private fechaCorta(iso: string | undefined | null): string {
    return iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}` : '';
  }
}
