import { Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { AsistenciaReporte, Justificacion, PerfilAsistencia, TipoDia } from './asistencia.models';
import {
  ESTILOS, RECUPERACION, TIPOS_DE_CALENDARIO, avisoAnticipacion, avisoDeCierre, detalleRecuperacion,
  errorDeRecuperacion, fechaTexto, hoy, lunesDe, primerDiaPermitido, sumarDias
} from './asistencia.estilos';
import { Visor, VisorArchivoComponent } from './visor-archivo.component';
import { PaginadorComponent, pagina } from './paginador.component';

type TipoAlerta = 'MARCA' | 'PAUSA' | 'TARDANZA';

interface Alerta {
  idUsuario: number;
  nombre: string;
  /** Para ordenar: la fecha del día, o la del sábado para la alerta de la semana. */
  orden: string;
  dia: string;
  tipo: TipoAlerta;
  alerta: string;
  detalle: string;
  /** En un exceso de pausa: cuántos minutos se pasó. */
  minutos?: number;
}

const DIAS_CORTOS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** Las marcas faltantes y excesos: rojo lo que no se registró, ámbar lo que se pasó. */
const PASTILLA_ALERTA: Record<TipoAlerta, string> = {
  MARCA: 'bg-[#fdecec] text-[#b91c1c] dark:bg-red-950/50 dark:text-red-300',
  PAUSA: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300',
  TARDANZA: 'bg-[#fef6e0] text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300'
};

/**
 * Asistencia del Equipo: la vista de la supervisora.
 *
 * Solo lo que necesita para gestionar a su gente: las alertas para el llamado
 * de atención —marcas sin registrar, pausas más largas de lo permitido y
 * límites de tardanza excedidos— y las justificaciones que esperan su revisión.
 * Corregir, aprobar y cerrar la semana es de RR.HH., en Control de Asistencia.
 *
 * Las alertas no tienen tabla propia: salen del mismo reporte que ve RR.HH.,
 * así una y otra nunca cuentan cosas distintas.
 */
@Component({
  selector: 'app-asistencia-equipo',
  standalone: true,
  host: { class: 'cashi-asistencia' },
  imports: [CommonModule, FormsModule, LucideAngularModule, VisorArchivoComponent, PaginadorComponent],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    .ficha { display: grid; grid-template-columns: 118px 1fr; gap: 9px 14px; margin: 0; font-size: 13px }
    .ficha dt { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80; padding-top: 2px }
    .ficha dd { margin: 0 }
    :host-context(.dark) .ficha dt { color: #94a3b8 }

    /* Los cuatro indicadores miden lo mismo: cada dibujo cabe en unas dos líneas. */
    .kpis { display: grid; gap: 16px; grid-template-columns: repeat(4, minmax(0, 1fr)) }
    @media (max-width: 980px) { .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)) } }
    @media (max-width: 640px) { .kpis { grid-template-columns: minmax(0, 1fr) } }
    .kpi { display: flex; flex-direction: column; padding: 14px 16px; background: #fff; border: 1px solid #e6e9ee; border-radius: 12px; box-shadow: 0 1px 2px rgba(15,23,42,.04) }
    .cabeza-kpi { display: flex; align-items: center; gap: 9px; margin-bottom: 8px }
    .cabeza-kpi h3 { margin: 0; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #5f6c80 !important }
    :host-context(.dark) .cabeza-kpi h3 { color: #94a3b8 !important }
    .icono-kpi { width: 28px; height: 28px; border-radius: 8px; flex: none; display: flex; align-items: center; justify-content: center; background: #f1f3f6; color: #0f172a }
    .cifra { font-size: 24px; font-weight: 800; line-height: 1.3; letter-spacing: -.02em; font-variant-numeric: tabular-nums }
    .cifra small { margin-left: 6px; font-size: 12px; font-weight: 600; letter-spacing: normal; color: #5f6c80 }
    .vacio-kpi { display: flex; align-items: center; gap: 8px; margin: 10px 0 0; font-size: 12.5px; font-weight: 600; color: #5f6c80 }
    .vacio-kpi.ok { color: #166534 }
    /* Asesores con alertas: dos columnas parejas; cada persona con su número de alertas. */
    .nombres-kpi { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin-top: 10px }
    .nombre-kpi { display: flex; align-items: center; justify-content: space-between; gap: 6px; min-width: 0; height: 26px; padding: 0 4px 0 10px; border-radius: 999px; font-size: 12px; font-weight: 700; background: #fdecec; color: #b91c1c }
    .nombre-kpi span { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .nombre-kpi b { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; font-size: 11px; background: color-mix(in srgb, #dc2626 16%, transparent); font-variant-numeric: tabular-nums }
    .nombre-kpi.resto { justify-content: center; padding: 0 10px; background: #f1f3f6; color: #5f6c80 }
    /* Marcas sin registrar: la semana, en ámbar los días con marcas sin registrar, y quiénes. */
    .tira-kpi { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 4px; margin-top: 10px }
    .dia-kpi { display: flex; flex-direction: column; align-items: center; gap: 1px; padding: 4px 0; border-radius: 6px; background: #e8f5ec; color: #166534; font-size: 10.5px; line-height: 1.2 }
    .dia-kpi b { font-weight: 700 }
    .dia-kpi.falta { background: #fef6e0; color: #92400e; box-shadow: inset 0 0 0 1px #f59e0b }
    /* Nadie trabajó ese día (un feriado, un día que no llegó): gris, no verde. */
    .dia-kpi.vacio { background: #f1f3f6; color: #5f6c80 }
    .quienes-kpi { margin: 10px 0 0; font-size: 12.5px; color: #5f6c80; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .quienes-kpi strong { font-weight: 600; color: #0f172a !important }
    /* Excesos de pausa: los dos más grandes. */
    .barras-pausa { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 12.5px }
    .barras-pausa li { display: grid; grid-template-columns: 88px minmax(0, 1fr) 52px; align-items: center; gap: 8px; min-height: 26px }
    .barras-pausa li span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .barras-pausa li i { display: block; height: 8px; border-radius: 999px; background: #f59e0b }
    .barras-pausa li em { font-style: normal; font-weight: 600; color: #92400e; text-align: right }
    /* Solicitudes por revisar: nombre y tipo en una línea; dos como máximo. */
    .lista-kpi { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; font-size: 12.5px }
    .lista-kpi li { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 0; min-height: 26px }
    .lista-kpi li > strong { font-weight: 600; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis }
    .p-sol { display: inline-flex; flex: none; align-items: center; padding: 2px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 700; background: #eef2ff; color: #2563eb }

    /* Alertas a la izquierda y solicitudes a la derecha. */
    /* 14 px: en la maqueta el margen de las tarjetas (14) y el de los paneles (10) se funden. */
    .paneles-equipo { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr); gap: 20px; align-items: stretch; margin-top: 14px }
    /* Los dos paneles miden lo mismo: el más corto se estira y el paginador se
       queda al pie, así la fila no queda con un hueco al lado de la tabla larga. */
    .paneles-equipo > section { display: flex; flex-direction: column }
    .paneles-equipo .panel-crece { flex: 1; display: flex; flex-direction: column }
    .paneles-equipo .panel-crece app-paginador { margin-top: auto }
    @media (max-width: 1100px) { .paneles-equipo { grid-template-columns: minmax(0, 1fr) } }
    .linea-dos { display: block; margin-top: 2px; font-size: 11.5px; font-weight: 400; color: #5f6c80 }

    :host-context(.dark) .kpi { background: #0f172a; border-color: #1e293b }
    :host-context(.dark) .icono-kpi { background: #1e293b; color: #f1f5f9 }
    :host-context(.dark) .cabeza-kpi h3, :host-context(.dark) .cifra small, :host-context(.dark) .vacio-kpi,
    :host-context(.dark) .quienes-kpi, :host-context(.dark) .linea-dos { color: #94a3b8 }
    :host-context(.dark) .quienes-kpi strong { color: #f1f5f9 !important }
    :host-context(.dark) .vacio-kpi.ok { color: #86efac }
    :host-context(.dark) .nombre-kpi { background: #450a0a; color: #fca5a5 }
    :host-context(.dark) .nombre-kpi.resto { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .dia-kpi { background: #052e16; color: #86efac }
    :host-context(.dark) .dia-kpi.falta { background: #451a03; color: #fcd34d }
    :host-context(.dark) .dia-kpi.vacio { background: #1e293b; color: #94a3b8 }
    :host-context(.dark) .barras-pausa li em { color: #fcd34d }
    :host-context(.dark) .p-sol { background: #1e293b; color: #60a5fa }
  `],
  template: `
    <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Asistencia del Equipo</h1>
          <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ resumen() }}</p>
        </div>
        <button type="button" [class]="estilos.botonPrimario" (click)="abrirRegistro()" [disabled]="!gente().length">
          <lucide-angular name="plus" [size]="15" class="block"></lucide-angular>
          Registrar solicitud
        </button>
      </div>

      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-cliente">Cliente</label>
          <select id="eq-cliente" [class]="estilos.campo + ' !w-[178px]'"
                  [ngModel]="idCliente()" (ngModelChange)="elegirCliente($event)">
            <option [ngValue]="null">Elige uno</option>
            @for (c of clientes(); track c.id) {
              <option [ngValue]="c.id">{{ c.businessName || c.tenantName }}</option>
            }
          </select>
        </div>
        <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-cartera">Cartera</label>
          <select id="eq-cartera" [class]="estilos.campo + ' !w-[178px]'"
                  [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)" [disabled]="!idCliente()">
            <option [ngValue]="null">Elige una</option>
            @for (c of carteras(); track c.id) {
              <option [ngValue]="c.id">{{ c.portfolioName }}</option>
            }
          </select>
        </div>
        <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-subcartera">Subcartera</label>
          <select id="eq-subcartera" [class]="estilos.campo + ' !w-[178px]'"
                  [ngModel]="idSubcartera()" (ngModelChange)="cambiarSubcartera($event)" [disabled]="!idCartera()">
            <option [ngValue]="null">Elige una</option>
            @for (s of subcarteras(); track s.id) {
              <option [ngValue]="s.id">{{ s.subPortfolioName }}</option>
            }
          </select>
        </div>
        <div class="flex flex-col gap-1.5">
          <label [class]="estilos.etiqueta" for="eq-semana-antes">Semana</label>
          <div class="flex h-[38px] items-center gap-2" role="group" aria-label="Semana">
            <button type="button" id="eq-semana-antes" [class]="estilos.botonIcono" (click)="moverSemana(-1)"
                    aria-label="Semana anterior">‹</button>
            <strong class="min-w-[150px] text-center text-[13px] tabular-nums">{{ textoSemana() }}</strong>
            <button type="button" [class]="estilos.botonIcono" (click)="moverSemana(1)"
                    [disabled]="esSemanaActual()" aria-label="Semana siguiente">›</button>
          </div>
        </div>
      </div>
    </div>

    <div class="px-7 py-5">
      <!-- El plazo del cierre: a la vista, no escondido en el formulario -->
      <div class="mb-4 flex items-start gap-2.5 rounded-xl border border-[#fbd391] bg-[#fef6e0] px-4 py-3 text-[12.5px] leading-normal text-[#92400e] dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
           role="note">
        <svg class="mt-px shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
        <p class="!m-0"><strong class="font-extrabold">{{ aviso.titulo }}:</strong> {{ aviso.texto }}@if (aviso.fecha) {<strong class="font-extrabold">{{ aviso.fecha }}</strong>}{{ aviso.resto }}</p>
      </div>
      @if (cargando()) {
        <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando tu equipo…</p>
      } @else if (sinAsignar()) {
        <div [class]="estilos.vacio">
          <strong class="block text-[13.5px]">No tienes subcarteras asignadas</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Esta vista muestra a los asesores de las subcarteras que supervisas.
          </span>
        </div>
      } @else if (!idSubcartera()) {
        <div [class]="estilos.vacio">
          <strong class="block text-[13.5px]">Elige una subcartera</strong>
          <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
            Las alertas y las solicitudes son de los asesores de esa subcartera.
          </span>
        </div>
      } @else {
        <div class="aparecer">
          <!-- Cada indicador con su dibujo: quién tiene alertas, en qué día faltan
               marcas, cuánto se pasó cada pausa y qué solicitudes esperan. -->
          <div class="kpis">
            <div class="kpi">
              <div class="cabeza-kpi">
                <span class="icono-kpi"><lucide-angular name="bell" [size]="15" class="block"></lucide-angular></span>
                <h3>Asesores con alertas</h3>
              </div>
              @if (!gente().length) {
                <p class="vacio-kpi"><lucide-angular name="users" [size]="18" class="block"></lucide-angular>Sin asesores asignados</p>
              } @else {
                <div class="cifra">{{ conAlerta().length }}<small>de {{ gente().length }}</small></div>
                @if (conAlerta().length) {
                  <div class="nombres-kpi">
                    @for (p of conNombre(); track p.idUsuario) {
                      <span class="nombre-kpi" [title]="p.nombre + ': ' + p.cuantas + (p.cuantas === 1 ? ' alerta' : ' alertas')">
                        <span>{{ corto(p.nombre) }}</span><b>{{ p.cuantas }}</b>
                      </span>
                    }
                    @if (sinNombre().length) {
                      <span class="nombre-kpi resto" [title]="nombresDe(sinNombre())">y {{ sinNombre().length }} más</span>
                    }
                  </div>
                } @else {
                  <p class="vacio-kpi ok"><lucide-angular name="check-circle" [size]="18" class="block"></lucide-angular>Sin alertas esta semana</p>
                }
              }
            </div>

            <div class="kpi">
              <div class="cabeza-kpi">
                <span class="icono-kpi"><lucide-angular name="pencil" [size]="15" class="block"></lucide-angular></span>
                <h3>Marcas sin registrar</h3>
              </div>
              @if (!gente().length) {
                <p class="vacio-kpi"><lucide-angular name="users" [size]="18" class="block"></lucide-angular>Sin asesores asignados</p>
              } @else {
                <div class="cifra">{{ cuenta('MARCA') }}</div>
                @if (cuenta('MARCA')) {
                  <div class="tira-kpi" [style.grid-template-columns]="'repeat(' + tira().length + ', minmax(0, 1fr))'"
                       role="img" aria-label="Días de la semana; en ámbar los que tienen marcas sin registrar">
                    @for (d of tira(); track d.fecha) {
                      <span class="dia-kpi" [class.falta]="d.n > 0" [class.vacio]="d.vacio" [title]="d.titulo"><b>{{ d.letra }}</b><small>{{ d.numero }}</small></span>
                    }
                  </div>
                  <p class="quienes-kpi" [title]="nombresSinMarcar()">
                    @for (n of sinMarcarPartes(); track $index) {
                      <strong>{{ n.nombre }}</strong>{{ n.sep }}
                    }
                    @if (sinMarcarResto()) { y {{ sinMarcarResto() }} más }
                  </p>
                } @else {
                  <p class="vacio-kpi ok"><lucide-angular name="check-circle" [size]="18" class="block"></lucide-angular>Todas las marcas registradas</p>
                }
              }
            </div>

            <div class="kpi">
              <div class="cabeza-kpi">
                <span class="icono-kpi"><lucide-angular name="coffee" [size]="15" class="block"></lucide-angular></span>
                <h3>Excesos de pausa</h3>
              </div>
              @if (!gente().length) {
                <p class="vacio-kpi"><lucide-angular name="users" [size]="18" class="block"></lucide-angular>Sin asesores asignados</p>
              } @else {
                <div class="cifra">{{ cuenta('PAUSA') }}</div>
                @if (pausas().length) {
                  <ul class="barras-pausa">
                    @for (x of pausas(); track $index) {
                      <li>
                        <span>{{ corto(x.nombre) }}</span>
                        <i [style.width.%]="x.ancho"></i>
                        <em>+{{ x.minutos }} min</em>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="vacio-kpi ok"><lucide-angular name="check-circle" [size]="18" class="block"></lucide-angular>Pausas dentro de lo permitido</p>
                }
              }
            </div>

            <div class="kpi">
              <div class="cabeza-kpi">
                <span class="icono-kpi"><lucide-angular name="file-text" [size]="15" class="block"></lucide-angular></span>
                <h3>Solicitudes por revisar</h3>
              </div>
              @if (!gente().length) {
                <p class="vacio-kpi"><lucide-angular name="users" [size]="18" class="block"></lucide-angular>Sin asesores asignados</p>
              } @else {
                <div class="cifra">{{ porRevisar().length }}</div>
                @if (porRevisar().length) {
                  <ul class="lista-kpi">
                    @for (j of porRevisar().slice(0, 2); track j.id) {
                      <li [title]="(j.nombreAgente ?? '') + ': ' + diasDe(j)">
                        <strong>{{ corto(j.nombreAgente ?? '') }}</strong><span class="p-sol">{{ j.tipo }}</span>
                      </li>
                    }
                  </ul>
                } @else {
                  <p class="vacio-kpi"><lucide-angular name="inbox" [size]="18" class="block"></lucide-angular>Sin solicitudes por revisar</p>
                }
              }
            </div>
          </div>

          <div class="paneles-equipo">
          <!-- Alertas del equipo -->
          <section aria-labelledby="titulo-alertas">
            <div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5">
              <div>
                <h2 id="titulo-alertas" [class]="estilos.titulo + ' !mb-0'">Alertas del equipo</h2>
                <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  Marcas sin registrar, excesos de pausa y tardanzas
                </p>
              </div>
              <nav [class]="estilos.segmentos" aria-label="Filtrar alertas">
                @for (f of FILTROS; track f.clave) {
                  <button type="button"
                          [class]="estilos.tab + ' ' + (filtro() === f.clave ? estilos.tabActiva : estilos.tabApagada)"
                          [attr.aria-current]="filtro() === f.clave ? 'page' : null"
                          (click)="filtro.set(f.clave); paginaAlertas.set(1)">
                    {{ f.texto }}
                  </button>
                }
              </nav>
            </div>
            <div [class]="estilos.panel + ' panel-crece'">
              <table class="w-full border-collapse">
                <caption class="sr-only">Alertas de la semana, por asesor</caption>
                <thead>
                  <tr>
                    <th scope="col" [class]="estilos.th">Asesor</th>
                    <th scope="col" [class]="estilos.th">Fecha</th>
                    <th scope="col" [class]="estilos.th">Alerta</th>
                    <th scope="col" [class]="estilos.th">Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  @for (a of alertasDeLaPagina(); track $index) {
                    <tr>
                      <td [class]="estilos.td + ' max-w-[200px] truncate font-semibold'">{{ a.nombre }}</td>
                      <td [class]="estilos.td">{{ a.dia }}</td>
                      <td [class]="estilos.td">
                        <span class="inline-flex items-center rounded-full px-[9px] py-0.5 text-[11.5px] font-bold"
                              [class]="PASTILLA_ALERTA[a.tipo]">{{ a.alerta }}</span>
                      </td>
                      <td [class]="estilos.td + ' secundario'">{{ a.detalle }}</td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="!px-3 !py-8 text-center">
                        <lucide-angular [name]="!gente().length ? 'users' : 'check-circle'" [size]="26"
                                        class="mx-auto mb-2 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
                        <strong class="block text-[13.5px]">
                          {{ !gente().length ? 'Sin asesores asignados' : alertas().length ? 'Sin alertas para este filtro' : 'Sin alertas esta semana' }}
                        </strong>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <app-paginador [total]="alertasVisibles().length" [pagina]="paginaAlertas()" [porPagina]="POR_PAGINA_ALERTAS"
                             (cambiar)="paginaAlertas.set($event)" />
            </div>
          </section>

          <!-- Solicitudes por revisar -->
          <section aria-labelledby="titulo-just">
            <div class="mb-3">
              <h2 id="titulo-just" [class]="estilos.titulo + ' !mb-0'">Solicitudes por revisar</h2>
              <p class="mt-[3px] text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                Revisión de la supervisora antes de la aprobación de RR.HH.
              </p>
            </div>
            <div [class]="estilos.panel + ' panel-crece'">
              <table class="w-full border-collapse">
                <caption class="sr-only">Solicitudes que esperan tu revisión</caption>
                <thead>
                  <tr>
                    <th scope="col" [class]="estilos.th">Asesor</th>
                    <th scope="col" [class]="estilos.th">Tipo</th>
                    <th scope="col" [class]="estilos.th">Certificado</th>
                    <th scope="col" [class]="estilos.th"><span class="sr-only">Acción</span></th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Al final, las de una semana cerrada: no se revisaron y ya no se revisan. -->
                  @for (j of bandejaDeLaPagina(); track j.id) {
                    <tr>
                      <!-- La bandeja es angosta: a 1440 px el texto baja de línea antes que cortar el botón. -->
                      <td [class]="estilos.td + ' max-w-[200px] truncate font-semibold !whitespace-normal'">
                        {{ j.nombreAgente }}
                        <span class="linea-dos">Solicitud del {{ j.solicitadaEn | date: 'dd/MM HH:mm' }}</span>
                      </td>
                      <td [class]="estilos.td + ' !whitespace-normal'">
                        {{ j.tipo }}
                        <span class="linea-dos">{{ diasDe(j) }}{{ j.semanaCerrada ? ' · semana cerrada' : '' }}</span>
                        @if (detalleRecuperacion(j); as d) {
                          <span class="block text-[11px] text-[#92400e] dark:text-amber-300">{{ d }}</span>
                        }
                      </td>
                      <td [class]="estilos.td + ' !whitespace-normal'">
                        @if (j.tieneArchivo) {
                          <button type="button" [class]="estilos.adjunto" (click)="verCertificado(j)" [title]="j.archivoNombre ?? 'Ver'">
                            <span class="min-w-0 truncate">{{ j.archivoNombre ?? 'Ver' }}</span>
                          </button>
                        } @else {
                          <span class="text-[#8491a3] dark:text-slate-500">—</span>
                        }
                      </td>
                      <td [class]="estilos.td + ' text-right'">
                        <button type="button" [class]="estilos.botonChico" (click)="abrirRevision(j)">
                          <svg class="shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                          {{ j.semanaCerrada ? 'Ver' : 'Revisar' }}
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="!px-3 !py-8 text-center">
                        <lucide-angular [name]="!gente().length ? 'users' : 'inbox'" [size]="26"
                                        class="mx-auto mb-2 block text-[#8491a3] dark:text-slate-500"></lucide-angular>
                        <strong class="block text-[13.5px]">{{ !gente().length ? 'Sin asesores asignados' : 'Sin solicitudes por revisar' }}</strong>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
              <app-paginador [total]="bandeja().length" [pagina]="paginaBandeja()" [porPagina]="POR_PAGINA_BANDEJA"
                             (cambiar)="paginaBandeja.set($event)" />
            </div>
          </section>
          </div>
        </div>
      }
    </div>

    <!-- Revisar justificación -->
    @if (enRevision(); as j) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrarRevision()"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,540px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-revisar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-revisar" class="!m-0 text-[15px] font-extrabold">{{ j.semanaCerrada ? 'Solicitud sin revisar' : 'Revisar solicitud' }}</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                {{ j.nombreAgente }} · solicitada el {{ j.solicitadaEn | date: 'dd/MM HH:mm' }}
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrarRevision()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <dl class="ficha">
              <dt>Tipo</dt><dd>{{ j.tipo }}</dd>
              <dt>Días</dt><dd>{{ diasDe(j) }}</dd>
              @if (detalleRecuperacion(j); as d) {
                <dt>Recuperación</dt><dd>{{ d }}</dd>
              }
              <dt>Comentario</dt><dd>{{ j.comentario || '—' }}</dd>
              <dt>Adjunto</dt>
              <dd>
                @if (j.tieneArchivo) {
                  <button type="button" [class]="estilos.adjunto" (click)="verCertificado(j)" [title]="j.archivoNombre ?? 'Ver adjunto'">
                    <span class="min-w-0 truncate">{{ j.archivoNombre ?? 'Ver adjunto' }}</span>
                  </button>
                } @else {
                  Este tipo no lo exige
                }
              </dd>
            </dl>

            @if (rechazando()) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-motivo">Por qué se rechaza</label>
                <textarea id="eq-motivo" rows="3" maxlength="300" [class]="estilos.area" placeholder="Ej.: no avisó y no trajo constancia"
                          [ngModel]="motivo()" (ngModelChange)="motivo.set($event); faltaMotivo.set(false)"></textarea>
                @if (faltaMotivo()) {
                  <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">Escribe el motivo: es lo que verá el asesor.</p>
                }
              </div>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <!-- De una semana cerrada solo se mira: el backend ya no deja revisarla. -->
            @if (j.semanaCerrada) {
              <span class="mr-auto self-center text-[11.5px] text-[#5f6c80] dark:text-slate-400">Sus días son de una semana cerrada: ya no se revisa</span>
            } @else {
              <button type="button" [class]="estilos.botonSecundario + ' mr-auto'" (click)="rechazar(j)"
                      [disabled]="guardando()">
                {{ rechazando() ? 'Confirmar rechazo' : 'Rechazar' }}
              </button>
              <button type="button" [class]="estilos.botonSecundario" (click)="cerrarRevision()">Cancelar</button>
              <button type="button" [class]="estilos.botonPrimario" (click)="conforme(j)" [disabled]="guardando()">
                Conforme, enviar a RR.HH.
              </button>
            }
          </footer>
        </div>
      </div>
    }

    <!-- Registrar solicitud -->
    @if (registrando()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="registrando.set(false)"></div>
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="pointer-events-auto flex max-h-[88vh] w-[min(100%,480px)] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900"
             role="dialog" aria-modal="true" aria-labelledby="titulo-registrar">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-registrar" class="!m-0 text-[15px] font-extrabold">Registrar solicitud</h2>
              <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                Para un asesor que no puede registrarla él mismo
              </p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="registrando.set(false)" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>

          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-quien">Para quién</label>
              <select id="eq-quien" [class]="estilos.campo" [(ngModel)]="nueva.idUsuario">
                @for (p of gente(); track p.idUsuario) {
                  <option [ngValue]="p.idUsuario">{{ p.nombreAgente }}</option>
                }
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-tipo">Tipo</label>
              <select id="eq-tipo" [class]="estilos.campo" [(ngModel)]="nueva.idTipoDia">
                @for (t of tipos(); track t.id) {
                  <option [ngValue]="t.id">{{ t.nombre }}</option>
                }
              </select>
            </div>
            @if (esRecuperacion()) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-origen">Recupera lo del</label>
                <input id="eq-origen" type="date" [class]="estilos.campo" [max]="hoyTexto"
                       [(ngModel)]="nueva.fechaOrigen">
              </div>
            }
            <div class="flex gap-3">
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-desde">{{ esRecuperacion() ? 'Recupera desde' : 'Desde' }}</label>
                <input id="eq-desde" type="date" [class]="estilos.campo" [attr.min]="primerDia()"
                       [(ngModel)]="nueva.fechaDesde">
              </div>
              <div class="flex flex-1 flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-hasta">Hasta</label>
                <input id="eq-hasta" type="date" [class]="estilos.campo" [min]="nueva.fechaDesde"
                       [(ngModel)]="nueva.fechaHasta">
              </div>
            </div>
            @if (esRecuperacion()) {
              <div class="flex flex-col gap-1.5">
                <label [class]="estilos.etiqueta" for="eq-minutos">Minutos extra por día</label>
                <input id="eq-minutos" type="number" min="5" max="60" step="5" [class]="estilos.campo"
                       [(ngModel)]="nueva.minutosExtra">
                <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                  Esos días sale más tarde. La tardanza igual cuenta para el límite.
                </p>
              </div>
            }
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-comentario">Comentario</label>
              <textarea id="eq-comentario" rows="3" maxlength="500" [class]="estilos.area" placeholder="Qué pasó, en una línea"
                        [(ngModel)]="nueva.comentario"></textarea>
            </div>
            @if (!esRecuperacion()) {
            <div class="flex flex-col gap-1.5">
              <label [class]="estilos.etiqueta" for="eq-adjunto">Certificado o constancia</label>
              <input id="eq-adjunto" type="file" accept=".pdf,.jpg,.jpeg,.png" class="!bg-transparent [font:revert] file:[all:revert]"
                     (change)="elegirArchivo($event)">
              <p class="!m-0 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ tipoElegido()?.exigeCertificado ? 'Obligatorio para este tipo' : 'Opcional' }} · hasta 10 MB
              </p>
            </div>
            }
            @if (error()) {
              <p class="!m-0 text-[12px] text-[#b91c1c] dark:text-red-300">{{ error() }}</p>
            }
          </div>

          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="registrando.set(false)">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="registrar()" [disabled]="guardando()">
              {{ guardando() ? 'Enviando…' : 'Enviar a RR.HH.' }}
            </button>
          </footer>
        </div>
      </div>
    }

    @if (visor.abierto(); as archivo) {
      <app-visor-archivo [archivo]="archivo" (cerrar)="visor.cerrar()" />
    }
  `
})
export class AsistenciaEquipoComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);

  protected readonly estilos = ESTILOS;
  protected readonly PASTILLA_ALERTA = PASTILLA_ALERTA;
  protected readonly FILTROS: { clave: TipoAlerta; texto: string }[] = [
    { clave: 'MARCA', texto: 'Marcas sin registrar' },
    { clave: 'PAUSA', texto: 'Excesos de pausa' },
    { clave: 'TARDANZA', texto: 'Tardanza' }
  ];

  readonly perfil = signal<PerfilAsistencia | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  /** Arranca en la semana en curso: las alertas sirven el mismo día. */
  readonly lunes = signal(lunesDe(new Date()));
  readonly reporte = signal<AsistenciaReporte | null>(null);
  readonly pendientes = signal<Justificacion[]>([]);
  readonly tipos = signal<TipoDia[]>([]);
  readonly filtro = signal<TipoAlerta>('MARCA');
  /** De a pocas filas: una semana con mucha gente llenaba media pantalla. */
  protected readonly POR_PAGINA_ALERTAS = 8;
  protected readonly POR_PAGINA_BANDEJA = 5;
  readonly paginaAlertas = signal(1);
  readonly paginaBandeja = signal(1);
  /** Otra subcartera u otra semana: se vuelve a la primera página. */
  private readonly alCambiarDeVista = effect(() => {
    this.idSubcartera();
    this.lunes();
    untracked(() => {
      this.paginaAlertas.set(1);
      this.paginaBandeja.set(1);
    });
  });
  readonly cargando = signal(true);
  readonly guardando = signal(false);

  readonly enRevision = signal<Justificacion | null>(null);
  readonly rechazando = signal(false);
  readonly motivo = signal('');
  readonly faltaMotivo = signal(false);

  readonly registrando = signal(false);
  readonly error = signal('');
  private archivo: File | null = null;
  nueva = { idUsuario: null as number | null, idTipoDia: null as number | null,
            fechaDesde: hoy(), fechaHasta: hoy(), comentario: '',
            fechaOrigen: hoy(), minutosExtra: null as number | null };
  protected readonly hoyTexto = hoy();
  protected readonly detalleRecuperacion = detalleRecuperacion;
  protected readonly aviso = avisoDeCierre('supervisora');

  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);

  /**
   * Lo que puede elegir: RR.HH. y ADMIN, todo; la supervisora, solo las
   * subcarteras que supervisa y, hacia arriba, sus carteras y clientes.
   */
  private readonly permitido = computed(() => {
    const p = this.perfil();
    if (!p || p.rrhh) {
      return null;
    }
    return {
      clientes: new Set(p.subcarteras.map(s => s.idCliente)),
      carteras: new Set(p.subcarteras.map(s => s.idCartera)),
      subcarteras: new Set(p.subcarteras.map(s => s.id))
    };
  });

  readonly sinAsignar = computed(() => {
    const p = this.perfil();
    return !!p && !p.rrhh && !p.subcarteras.length;
  });

  readonly sabado = computed(() => sumarDias(this.lunes(), 5));
  readonly esSemanaActual = computed(() => this.lunes() >= lunesDe(new Date()));

  readonly textoSemana = computed(() => {
    const [a, b] = [new Date(this.lunes() + 'T00:00:00'), new Date(this.sabado() + 'T00:00:00')];
    const mes = MESES[b.getMonth()].slice(0, 3);
    return `${a.getDate()} – ${b.getDate()} ${mes}`;
  });

  readonly gente = computed(() => this.reporte()?.agentes ?? []);

  readonly resumen = computed(() => {
    const [a, b] = [new Date(this.lunes() + 'T00:00:00'), new Date(this.sabado() + 'T00:00:00')];
    const conAlerta = new Set(this.alertas().map(x => x.idUsuario)).size;
    return `Semana del ${a.getDate()} al ${b.getDate()} de ${MESES[b.getMonth()]}`
      + ` · ${this.gente().length} asesores · ${conAlerta} con alertas`;
  });

  /**
   * Las alertas salen del reporte. Una marca que falta solo cuenta cuando el día
   * ya terminó: hoy a mediodía el almuerzo todavía no se ha marcado y no es
   * falta de nadie.
   */
  readonly alertas = computed<Alerta[]>(() => {
    const r = this.reporte();
    if (!r) {
      return [];
    }
    const ahora = new Date();
    const hoyTexto = fechaTexto(ahora);
    const horaAhora = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`;
    const tolDia = r.toleranciaDiaMin ?? 10;
    const tolSemana = r.toleranciaSemanaMin ?? 30;
    const salida: Alerta[] = [];

    for (const d of r.dias) {
      if (d.estado === 'NO_LABORABLE' || d.estado === 'JUSTIFICADO' || d.estado === 'FALTA' || d.fecha > hoyTexto) {
        continue;
      }
      const base = { idUsuario: d.idUsuario, nombre: d.nombreAgente, orden: d.fecha, dia: this.diaCorto(d.fecha) };
      const terminado = d.fecha < hoyTexto || (!!d.horaSalidaHorario && horaAhora >= d.horaSalidaHorario.slice(0, 5));

      if (terminado) {
        this.faltanteDePausa(salida, base, d.marcasFaltantes, 'ALMUERZO', 'almuerzo', d.almuerzoInicio, d.almuerzoFin);
        this.faltanteDePausa(salida, base, d.marcasFaltantes, 'BREAK', 'break', d.breakInicio, d.breakFin);
      }
      if ((d.excesoAlmuerzoMin ?? 0) > 0) {
        salida.push({ ...base, tipo: 'PAUSA', alerta: 'Exceso de almuerzo', minutos: d.excesoAlmuerzoMin!,
          detalle: this.detalleExceso(d.almuerzoInicio, d.almuerzoFin, d.excesoAlmuerzoMin!) });
      }
      if ((d.excesoBreakMin ?? 0) > 0) {
        salida.push({ ...base, tipo: 'PAUSA', alerta: 'Exceso de break', minutos: d.excesoBreakMin!,
          detalle: this.detalleExceso(d.breakInicio, d.breakFin, d.excesoBreakMin!) });
      }
      if ((d.minutosTardanza ?? 0) > tolDia) {
        salida.push({ ...base, tipo: 'TARDANZA', alerta: 'Límite diario excedido',
          detalle: `Ingresó ${d.entrada?.slice(0, 5) ?? '—'} · tardanza ${this.duracion(d.minutosTardanza!)}` });
      }
    }

    for (const s of r.semanas) {
      if (s.superoToleranciaSemanal) {
        salida.push({ idUsuario: s.idUsuario, nombre: s.nombreAgente, orden: this.sabado(), dia: 'Semana',
          tipo: 'TARDANZA', alerta: 'Límite semanal excedido',
          detalle: `${this.duracion(s.minutosTardanza)} en la semana · límite ${this.duracion(tolSemana)}` });
      }
    }

    return salida.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es') || a.orden.localeCompare(b.orden));
  });

  readonly alertasVisibles = computed(() =>
    this.alertas().filter(a => a.tipo === this.filtro()));
  readonly alertasDeLaPagina = computed(() =>
    pagina(this.alertasVisibles(), this.paginaAlertas(), this.POR_PAGINA_ALERTAS));
  readonly bandejaDeLaPagina = computed(() =>
    pagina(this.bandeja(), this.paginaBandeja(), this.POR_PAGINA_BANDEJA));

  /** Solo las de su gente: la bandeja es de toda la empresa. */
  private readonly deSuGente = computed(() => {
    const suyos = new Set(this.gente().map(p => p.idUsuario));
    return this.pendientes().filter(j => suyos.has(j.idUsuario));
  });
  /**
   * Las que puede revisar. Las de una semana cerrada no: RR.HH. cerró sin que
   * se revisaran, se quedan «Por revisar» y el cierre lo anotó en la Auditoría.
   */
  readonly porRevisar = computed(() => this.deSuGente().filter(j => !j.semanaCerrada));
  /** La bandeja: primero lo que se puede revisar y al final lo que quedó sin revisar. */
  readonly bandeja = computed(() => [
    ...this.porRevisar(), ...this.deSuGente().filter(j => j.semanaCerrada)
  ]);

  cuenta(tipo: TipoAlerta): number {
    return this.alertas().filter(x => x.tipo === tipo).length;
  }

  /** Quién tiene alertas, con más alertas primero. */
  readonly conAlerta = computed(() => {
    const porPersona = new Map<number, { idUsuario: number; nombre: string; cuantas: number }>();
    for (const a of this.alertas()) {
      const p = porPersona.get(a.idUsuario) ?? { idUsuario: a.idUsuario, nombre: a.nombre, cuantas: 0 };
      p.cuantas++;
      porPersona.set(a.idUsuario, p);
    }
    return [...porPersona.values()].sort((a, b) => b.cuantas - a.cuantas);
  });
  /** Dos por fila y dos filas; con más de cuatro, tres nombres y el resto en la cuarta casilla. */
  readonly conNombre = computed(() => this.conAlerta().length > 4 ? this.conAlerta().slice(0, 3) : this.conAlerta());
  readonly sinNombre = computed(() => this.conAlerta().slice(this.conNombre().length));

  /**
   * La semana, con cuántas marcas sin registrar hubo cada día. De lunes a
   * viernes; el sábado solo si alguien lo trabajó o lo tenía en su horario, y
   * el domingo nunca. Un día en que nadie trabajó sale en gris, no en verde.
   */
  readonly tira = computed(() => {
    const suyos = new Set(this.gente().map(p => p.idUsuario));
    const dias = (this.reporte()?.dias ?? []).filter(d => suyos.has(d.idUsuario));
    const sabado = sumarDias(this.lunes(), 5);
    const conSabado = dias.some(d => d.fecha === sabado && (!!d.entrada || d.estado !== 'NO_LABORABLE'));
    return (conSabado ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4]).map(i => {
      const fecha = sumarDias(this.lunes(), i);
      const n = this.alertas().filter(a => a.tipo === 'MARCA' && a.orden === fecha).length;
      const trabajaron = dias.some(d => d.fecha === fecha && !!d.entrada);
      const dia = DIAS_CORTOS[new Date(fecha + 'T00:00:00').getDay()];
      return { fecha, letra: dia[0], numero: Number(fecha.slice(8, 10)), n, vacio: !n && !trabajaron,
        titulo: `${dia}: ${n ? `${n} sin marcar` : trabajaron ? 'completo' : 'nadie trabajó'}` };
    });
  });

  /** Quiénes no marcaron: el nombre de pila (dos que se llaman igual, con apellido); hasta tres. */
  private readonly sinMarcar = computed(() => [...new Set(this.alertas().filter(a => a.tipo === 'MARCA').map(a => a.nombre))]);
  readonly sinMarcarCorto = computed(() => {
    const lista = this.sinMarcar();
    const pila = (n: string) => n.split(' ')[0];
    const repetido = (n: string) => lista.filter(x => pila(x) === pila(n)).length > 1;
    return lista.slice(0, lista.length > 3 ? 3 : lista.length)
      .map(n => (repetido(n) ? n.split(' ').slice(0, 2).join(' ') : pila(n)));
  });
  readonly sinMarcarResto = computed(() => Math.max(0, this.sinMarcar().length - 3));
  /** Cada nombre con lo que va después: «, » entre ellos e « y » antes del último (si no hay resto). */
  readonly sinMarcarPartes = computed(() => {
    const nombres = this.sinMarcarCorto();
    const resto = this.sinMarcarResto();
    return nombres.map((nombre, i) => ({
      nombre,
      sep: i === nombres.length - 1 ? '' : i === nombres.length - 2 && !resto ? ' y ' : ', '
    }));
  });
  readonly nombresSinMarcar = computed(() => this.sinMarcar().join(', '));

  /** Los dos excesos de pausa más grandes, con su barra contra el mayor. */
  readonly pausas = computed(() => {
    const lista = this.alertas().filter(a => a.tipo === 'PAUSA' && a.minutos);
    const mayor = Math.max(1, ...lista.map(a => a.minutos ?? 0));
    return [...lista].sort((a, b) => (b.minutos ?? 0) - (a.minutos ?? 0)).slice(0, 2)
      .map(a => ({ nombre: a.nombre, minutos: a.minutos ?? 0, ancho: Math.max(8, ((a.minutos ?? 0) / mayor) * 100) }));
  });

  nombresDe(lista: { nombre: string }[]): string {
    return lista.map(x => x.nombre).join(', ');
  }

  /** «Leydi M.»: el nombre y la inicial del apellido. */
  corto(nombre: string): string {
    const [a, b] = nombre.split(' ');
    return b ? `${a} ${b[0]}.` : a;
  }

  ngOnInit(): void {
    this.servicio.perfil().subscribe({
      next: p => {
        this.perfil.set(p);
        this.cargando.set(false);
        this.cargarClientes();
      },
      error: () => {
        this.cargando.set(false);
        this.toast.error('No se pudo saber qué subcarteras supervisas');
      }
    });
    this.servicio.tiposDeDia().subscribe({
      next: t => this.tipos.set(t.filter(x => !TIPOS_DE_CALENDARIO.includes(x.codigo))),
      error: () => this.tipos.set([])
    });
  }

  // ==================== ÁMBITO ====================

  /** Sin filtrar por `isActive`, como en Control de Asistencia: Financiera Oh está inactiva en QAS. */
  private cargarClientes(): void {
    this.clientesServicio.getAllTenants().subscribe({
      next: c => {
        const permitido = this.permitido();
        const lista = c.filter(x => !permitido || permitido.clientes.has(x.id))
          .sort((a, b) => (a.businessName || a.tenantName).localeCompare(b.businessName || b.tenantName));
        this.clientes.set(lista);
        if (lista.length === 1) {
          this.elegirCliente(lista[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.reporte.set(null);
    if (!id) {
      return;
    }
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => {
        const permitido = this.permitido();
        const lista = c.filter(x => !permitido || permitido.carteras.has(x.id))
          .sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.carteras.set(lista);
        if (lista.length === 1) {
          this.elegirCartera(lista[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    this.reporte.set(null);
    if (!id) {
      return;
    }
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const permitido = this.permitido();
        const lista = s.filter(x => !permitido || permitido.subcarteras.has(x.id))
          .sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(lista);
        if (lista.length === 1) {
          this.cambiarSubcartera(lista[0].id);
        }
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  cambiarSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.reporte.set(null);
    if (id) {
      this.cargar();
    }
  }

  moverSemana(n: number): void {
    this.lunes.set(sumarDias(this.lunes(), 7 * n));
    this.cargar();
  }

  private cargar(): void {
    const sub = this.idSubcartera();
    if (!sub) {
      this.cargando.set(false);
      return;
    }
    this.cargando.set(true);
    this.servicio.reporte(this.lunes(), this.sabado(), sub).subscribe({
      next: r => {
        this.reporte.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.reporte.set(null);
        this.cargando.set(false);
        this.toast.error('No se pudo cargar la asistencia del equipo');
      }
    });
    this.cargarPendientes();
  }

  /** Las pendientes de revisión de los últimos tres meses y las que vienen. */
  private cargarPendientes(): void {
    this.servicio.justificaciones(sumarDias(hoy(), -90), sumarDias(hoy(), 60), ['PENDIENTE']).subscribe({
      next: j => this.pendientes.set(j),
      error: () => this.pendientes.set([])
    });
  }

  // ==================== REVISAR ====================

  abrirRevision(j: Justificacion): void {
    this.enRevision.set(j);
    this.rechazando.set(false);
    this.motivo.set('');
    this.faltaMotivo.set(false);
  }

  cerrarRevision(): void {
    this.enRevision.set(null);
  }

  conforme(j: Justificacion): void {
    this.decidir(j, true, 'Enviada a RR.HH. para su aprobación');
  }

  /** El primer clic pide el motivo; el segundo rechaza. */
  rechazar(j: Justificacion): void {
    if (!this.rechazando()) {
      this.rechazando.set(true);
      return;
    }
    if (!this.motivo().trim()) {
      this.faltaMotivo.set(true);
      return;
    }
    this.decidir(j, false, 'Rechazada: el asesor verá el motivo');
  }

  private decidir(j: Justificacion, aFavor: boolean, mensaje: string): void {
    this.guardando.set(true);
    this.servicio.revisarJustificacion(j.id, aFavor, this.motivo().trim() || undefined).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarRevision();
        this.toast.success(mensaje);
        this.cargarPendientes();
      },
      error: respuesta => {
        this.guardando.set(false);
        this.toast.error(respuesta?.error?.error ?? 'No se pudo guardar la revisión');
      }
    });
  }

  /** El visor del adjunto: la foto o el PDF en grande, sin salir de la bandeja. */
  protected readonly visor = new Visor();

  verCertificado(j: Justificacion): void {
    this.visor.abrir(this.servicio.certificado(j.id, j.archivoNombre), j.archivoNombre,
      () => this.toast.error('No se pudo abrir el adjunto'));
  }

  // ==================== REGISTRAR ====================

  /** Método y no computed: `nueva` es un objeto del formulario, no una signal. */
  tipoElegido(): TipoDia | null {
    return this.tipos().find(t => t.id === this.nueva.idTipoDia) ?? null;
  }

  primerDia(): string | null {
    return primerDiaPermitido(this.tipoElegido());
  }

  esRecuperacion(): boolean {
    return this.tipoElegido()?.codigo === RECUPERACION;
  }

  abrirRegistro(): void {
    this.nueva = { idUsuario: this.gente()[0]?.idUsuario ?? null, idTipoDia: this.tipos()[0]?.id ?? null,
                   fechaDesde: hoy(), fechaHasta: hoy(), comentario: '',
                   fechaOrigen: hoy(), minutosExtra: null };
    this.archivo = null;
    this.error.set('');
    this.registrando.set(true);
  }

  elegirArchivo(evento: Event): void {
    this.archivo = (evento.target as HTMLInputElement).files?.[0] ?? null;
  }

  registrar(): void {
    const tipo = this.tipoElegido();
    if (!this.nueva.idUsuario || !tipo) {
      this.error.set('Elige a la persona y el tipo');
      return;
    }
    if (this.nueva.fechaHasta < this.nueva.fechaDesde) {
      this.error.set('La fecha final no puede ser anterior a la inicial');
      return;
    }
    const primerDia = this.primerDia();
    if (primerDia && this.nueva.fechaDesde < primerDia) {
      this.error.set(avisoAnticipacion(tipo));
      return;
    }
    const recupera = tipo.codigo === RECUPERACION;
    const errorRecuperacion = recupera ? errorDeRecuperacion(this.nueva) : null;
    if (errorRecuperacion) {
      this.error.set(errorRecuperacion);
      return;
    }
    if (tipo.exigeCertificado && !this.archivo) {
      this.error.set(`${tipo.nombre} necesita certificado adjunto`);
      return;
    }

    const nombre = this.gente().find(p => p.idUsuario === this.nueva.idUsuario)?.nombreAgente ?? '';
    this.guardando.set(true);
    this.servicio.crearJustificacion({
      idUsuario: this.nueva.idUsuario,
      idTipoDia: tipo.id,
      fechaDesde: this.nueva.fechaDesde,
      fechaHasta: this.nueva.fechaHasta,
      comentario: this.nueva.comentario.trim() || undefined,
      archivo: recupera ? null : this.archivo,
      minutosExtra: recupera ? Number(this.nueva.minutosExtra) : null,
      fechaOrigen: recupera ? this.nueva.fechaOrigen : null
    }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.registrando.set(false);
        this.toast.success(`Registrada para ${nombre} y enviada a RR.HH.`);
      },
      error: respuesta => {
        this.guardando.set(false);
        this.error.set(respuesta?.error?.error ?? 'No se pudo registrar la solicitud');
      }
    });
  }

  // ==================== APOYO ====================

  diasDe(j: Justificacion): string {
    const corta = (f: string) => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
    return j.fechaDesde === j.fechaHasta ? corta(j.fechaDesde) : `${corta(j.fechaDesde)} al ${corta(j.fechaHasta)}`;
  }

  private diaCorto(fecha: string): string {
    return `${DIAS_CORTOS[new Date(fecha + 'T00:00:00').getDay()]} ${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`;
  }

  /** «0:19»: una duración, no una hora de reloj. */
  private duracion(minutos: number): string {
    return `${Math.floor(minutos / 60)}:${String(minutos % 60).padStart(2, '0')}`;
  }

  /** «+14 min · 74 de 60»: cuánto se pasó, cuánto usó y cuánto tenía. */
  private detalleExceso(inicio: string | null, fin: string | null, exceso: number): string {
    if (!inicio || !fin) {
      return `+${exceso} min`;
    }
    const aMin = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3, 5));
    const usado = aMin(fin) - aMin(inicio);
    return `+${exceso} min · ${usado} de ${usado - exceso}`;
  }

  /**
   * La pausa que falta, dicha según qué parte falta: ninguna de las dos marcas,
   * o solo la vuelta, o solo la salida.
   */
  private faltanteDePausa(salida: Alerta[], base: Omit<Alerta, 'tipo' | 'alerta' | 'detalle'>,
                          faltantes: string[], prefijo: 'ALMUERZO' | 'BREAK', nombre: string,
                          inicio: string | null, fin: string | null): void {
    const faltaInicio = faltantes.includes(`${prefijo}_INICIO`);
    const faltaFin = faltantes.includes(`${prefijo}_FIN`);
    if (faltaInicio && faltaFin) {
      salida.push({ ...base, tipo: 'MARCA', alerta: `No marcó ${nombre}`,
        detalle: `Sin salida ni regreso del ${nombre}` });
    } else if (faltaFin) {
      salida.push({ ...base, tipo: 'MARCA', alerta: `No marcó el regreso del ${nombre}`,
        detalle: `Salió al ${nombre} a las ${inicio?.slice(0, 5) ?? '—'}` });
    } else if (faltaInicio) {
      salida.push({ ...base, tipo: 'MARCA', alerta: `No marcó la salida al ${nombre}`,
        detalle: `Regresó del ${nombre} a las ${fin?.slice(0, 5) ?? '—'}` });
    }
  }
}
