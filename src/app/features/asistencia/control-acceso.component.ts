import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AsistenciaService } from './asistencia.service';
import { ESTILOS } from './asistencia.estilos';
import { PanelAcceso, RechazoDia } from './asistencia.models';
import { SPRITE_LOGOS } from './logos-acceso';

/** Un celular o tablet en el periodo: sus días sumados, con la hora del último intento. */
interface Rechazo {
  dia: string;
  hora: string;
  usuario: string | null;
  nombre: string | null;
  dispositivo: RechazoDia['dispositivo'];
  modelo: string | null;
  navegador: string | null;
  ip: string | null;
  intentos: number;
}

/** El logo que le toca a cada cosa; lo que no tiene logo propio va con un icono genérico. */
const LOGO: Record<string, string> = {
  Android: 'android', iPhone: 'apple', iPad: 'apple', Apple: 'apple', Tablet: 'tablet',
  Chrome: 'chrome', Safari: 'safari', Firefox: 'firefox',
  WINDOWS: 'windows', MAC: 'apple', LINUX: 'linux'
};

const SISTEMAS = [
  { clave: 'WINDOWS', nombre: 'Windows' },
  { clave: 'MAC', nombre: 'Mac' },
  { clave: 'LINUX', nombre: 'Linux' }
] as const;

/** iPhone e iPad van juntos como Apple; «Tablet» son las tablets Android y otras. */
const GRUPOS = [
  { nombre: 'Android', de: ['Android'], color: 'var(--g-1)' },
  { nombre: 'Apple', de: ['iPhone', 'iPad'], color: 'var(--g-2)' },
  { nombre: 'Tablet', de: ['Tablet'], color: 'var(--g-3)' }
] as const;

const POR_PAGINA = 5;

/**
 * Control de Acceso.
 *
 * Cashi solo se abre desde una computadora o laptop. Arriba, cómo va la regla;
 * abajo, los celulares y tablets que lo intentaron.
 *
 * El backend manda los últimos 30 días por equipo y día; el periodo, el filtro
 * y los totales se arman aquí.
 */
@Component({
  selector: 'app-control-acceso',
  standalone: true,
  host: { class: 'cashi-asistencia' },
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: block;
      --texto: #0f172a; --texto-medio: #334155; --apagado: #5f6c80; --tenue: #8491a3;
      --superficie: #ffffff; --neutro-fondo: #f1f3f6; --borde-control: #8491a3; --acento: #2563eb;
      --ok-punto: #16a34a; --tarde-fondo: #fef6e0; --tarde-texto: #92400e; --tarde-punto: #f59e0b;
      --falta-punto: #dc2626;
      --g-1: var(--texto);
      --g-2: color-mix(in srgb, var(--texto) 55%, var(--superficie));
      --g-3: color-mix(in srgb, var(--texto) 25%, var(--superficie));
    }
    :host-context(.dark) {
      --texto: #f1f5f9; --texto-medio: #e2e8f0; --apagado: #94a3b8; --tenue: #64748b;
      --superficie: #0f172a; --neutro-fondo: #1e293b; --borde-control: #475569; --acento: #60a5fa;
      --ok-punto: #22c55e; --tarde-fondo: #451a03; --tarde-texto: #fcd34d; --tarde-punto: #f59e0b;
      --falta-punto: #ef4444;
    }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }

    .kpis { display: grid; gap: 16px; margin-bottom: 20px; grid-template-columns: repeat(4, minmax(0, 1fr)); }
    @media (max-width: 980px) { .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 560px) { .kpis { grid-template-columns: 1fr; } }
    .banda { margin-top: 12px; min-height: 50px; }
    .pie { margin-top: auto; padding-top: 8px; font-size: 11.5px; color: var(--apagado); }

    .estado-regla { display: inline-flex; align-items: center; gap: 7px; font-size: 20px; font-weight: 800; letter-spacing: -.01em; }
    .estado-regla::before { content: ""; width: 10px; height: 10px; border-radius: 999px; background: var(--ok-punto);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ok-punto) 22%, transparent); }
    .estado-regla.pronto::before { background: var(--tenue); box-shadow: none; }
    .estado-regla.pronto { color: var(--apagado); }

    .estados { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
    .fila-estado { display: grid; grid-template-columns: 124px 1fr 24px; align-items: center; gap: 8px;
      font-size: 11.5px; color: var(--apagado); }
    .nombre-estado { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
    .barra-estado { height: 8px; border-radius: 999px; background: var(--neutro-fondo); overflow: hidden; }
    .barra-estado b { display: block; height: 100%; border-radius: 999px;
      background: color-mix(in srgb, var(--texto) 45%, var(--superficie)); }
    .fila-estado strong { text-align: right; color: var(--texto) !important; font-variant-numeric: tabular-nums; }

    .tendencia { display: block; width: 100%; height: 46px; overflow: visible; }
    .tendencia .area { fill: color-mix(in srgb, var(--acento) 12%, transparent); }
    .tendencia .linea { fill: none; stroke: var(--acento); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
    .tendencia .punto { fill: var(--superficie); stroke: var(--acento); stroke-width: 1.6; }
    .eje { position: relative; height: 13px; margin-top: 4px; font-size: 10px; color: var(--tenue); font-variant-numeric: tabular-nums; }
    .eje span { position: absolute; top: 0; white-space: nowrap; }
    .eje .ini { left: 0; }
    .eje .fin { right: 0; }

    .barra-partida { display: flex; gap: 2px; height: 12px; margin: 12px 0; border-radius: 999px; overflow: hidden; }
    .barra-partida i { display: block; height: 100%; }
    .leyenda-partida { display: flex; flex-direction: column; gap: 6px; }
    .leyenda-partida > span { display: grid; grid-template-columns: 8px 13px 1fr auto 34px; align-items: center; gap: 7px;
      font-size: 11.5px; color: var(--apagado); }
    .leyenda-partida > span > i { width: 8px; height: 8px; border-radius: 2px; }
    .leyenda-partida strong { color: var(--texto) !important; font-variant-numeric: tabular-nums; text-align: right; }
    .leyenda-partida small { text-align: right; color: var(--tenue); font-size: 9.5px; font-variant-numeric: tabular-nums; }

    .marca-so { display: inline-flex; align-items: center; gap: 7px; }
    .marca-so svg { flex: none; color: var(--texto-medio); }
    .marca-so small { display: block; font-size: 11px; color: var(--tenue); }
    .persona-celda { display: flex; flex-direction: column; line-height: 1.35; }
    .persona-celda small { font-size: 11px; color: var(--tenue); }
    .ip { font-variant-numeric: tabular-nums; color: var(--texto-medio); }
    .origen-celda { display: flex; align-items: center; gap: 8px; }
    .origen { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border-radius: 999px;
      font-size: 11px; font-weight: 700; background: var(--tarde-fondo); color: var(--tarde-texto); }
    .intentos-min { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-variant-numeric: tabular-nums; }
    .intentos-min::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: var(--borde-control); }
    .intentos-min.medio::before { background: var(--tarde-punto); }
    .intentos-min.alto::before { background: var(--falta-punto); }
    .secundario { font-size: 11.5px; color: var(--apagado); }
  `],
  template: `
    <div class="pointer-events-none absolute h-0 w-0 overflow-hidden" aria-hidden="true" [innerHTML]="sprite"></div>

    <ng-template #icono let-nombre let-tam="tam">
      @switch (logoDe(nombre)) {
        @case ('tablet') {
          <svg [attr.width]="tam" [attr.height]="tam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 4a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v16a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1v-16z" /><path d="M11 17a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
          </svg>
        }
        @case ('otro') {
          <svg [attr.width]="tam" [attr.height]="tam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M3.6 9h16.8" /><path d="M3.6 15h16.8" />
            <path d="M11.5 3a17 17 0 0 0 0 18" /><path d="M12.5 3a17 17 0 0 1 0 18" />
          </svg>
        }
        @default {
          <svg [attr.width]="tam" [attr.height]="tam" aria-hidden="true"><use [attr.href]="'#logo-' + logoDe(nombre)" /></svg>
        }
      }
    </ng-template>

    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-[3px]">
            <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Control de Acceso</h1>
            <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Cashi solo se abre desde una computadora o laptop</p>
          </div>
          <button type="button" [class]="estilos.botonPrimario" disabled aria-disabled="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
            Registrar equipo remoto
            <span class="rounded-full bg-white/20 px-2 py-[1px] text-[11px] font-bold dark:bg-[#0f172a]/15">Pronto</span>
          </button>
        </div>

        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="periodo-acceso">Periodo</label>
            <select id="periodo-acceso" [class]="estilos.campo + ' !w-[210px]'"
                    [ngModel]="periodo()" (ngModelChange)="periodo.set(+$event); pagina.set(1)">
              <option [ngValue]="1">Hoy</option>
              <option [ngValue]="7">Últimos 7 días</option>
              <option [ngValue]="30">Últimos 30 días</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="dispositivo-acceso">Dispositivo</label>
            <select id="dispositivo-acceso" [class]="estilos.campo + ' !w-[210px]'"
                    [ngModel]="dispositivo()" (ngModelChange)="dispositivo.set($event); pagina.set(1)">
              <option value="">Todos</option>
              <option value="Android">Android</option>
              <option value="Apple">Apple (iPhone y iPad)</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="buscar-acceso">Buscar</label>
            <input id="buscar-acceso" type="search" placeholder="Usuario o IP" [class]="estilos.campo + ' !w-[158px]'"
                   [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event); pagina.set(1)">
          </div>
        </div>
      </div>

      <div class="px-7 pb-12 pt-5">
        @if (cargando() && !datos()) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
        } @else if (error()) {
          <div [class]="estilos.vacio">
            <p class="text-[13.5px] font-bold">No se pudo cargar Control de Acceso</p>
            <button type="button" [class]="estilos.botonSecundario + ' mt-3'" (click)="cargar()">Reintentar</button>
          </div>
        } @else {
          <div class="aparecer">
            <div class="kpis">
              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4" width="19" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Equipos permitidos</h3>
                </div>
                <span class="estado-regla">Activo</span>
                <div class="estados">
                  @for (s of sistemas(); track s.nombre) {
                    <div class="fila-estado">
                      <span class="nombre-estado">
                        <ng-container *ngTemplateOutlet="icono; context: { $implicit: s.clave, tam: 13 }" />{{ s.nombre }}
                      </span>
                      <span class="barra-estado"><b [style.width.%]="s.pct"></b></span>
                      <strong>{{ s.n }}</strong>
                    </div>
                  }
                </div>
                <p class="pie">Equipos que entraron en el periodo</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Rechazados</h3>
                </div>
                <div [class]="estilos.cifra">{{ totalIntentos() }}<small [class]="estilos.unidad">{{ totalIntentos() === 1 ? 'intento' : 'intentos' }}</small></div>
                <div class="banda">
                  @let t = tendencia();
                  <svg class="tendencia" [attr.viewBox]="'0 0 ' + t.ancho + ' ' + t.alto" preserveAspectRatio="none" role="img"
                       [attr.aria-label]="t.etiqueta">
                    <path [attr.d]="t.area" class="area" />
                    <path [attr.d]="t.linea" class="linea" vector-effect="non-scaling-stroke" />
                    @for (p of t.puntos; track p.dia) {
                      <circle [attr.cx]="p.x" [attr.cy]="p.y" r="2.6" class="punto"><title>{{ p.titulo }}</title></circle>
                    }
                  </svg>
                  @if (t.puntos.length > 1) {
                    <div class="eje"><span class="ini">{{ t.puntos[0].dm }}</span><span class="fin">{{ t.puntos[t.puntos.length - 1].dm }}</span></div>
                  }
                </div>
                <p class="pie">{{ filtrados().length }} {{ filtrados().length === 1 ? 'dispositivo' : 'dispositivos' }} · {{ conUsuario() }} con usuario</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><rect x="5" y="11" width="3.5" height="6" rx="1"/><rect x="10.2" y="7" width="3.5" height="10" rx="1"/><rect x="15.4" y="4" width="3.5" height="13" rx="1"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Por dispositivo</h3>
                </div>
                <div class="barra-partida" role="img" [attr.aria-label]="etiquetaTipos()">
                  @for (g of porTipo(); track g.nombre) {
                    @if (g.n) { <i [style.flex]="g.n" [style.background]="g.color" [attr.title]="g.nombre + ' · ' + g.n"></i> }
                  }
                  @if (!totalTipos()) { <i style="flex:1; background:var(--neutro-fondo)"></i> }
                </div>
                <div class="leyenda-partida">
                  @for (g of porTipo(); track g.nombre) {
                    <span>
                      <i [style.background]="g.color"></i>
                      <ng-container *ngTemplateOutlet="icono; context: { $implicit: g.nombre, tam: 13 }" />
                      {{ g.nombre }}<strong>{{ g.n }}</strong><small>{{ g.pct }}%</small>
                    </span>
                  }
                </div>
                <p class="pie">Intentos en el periodo</p>
              </div>

              <div [class]="estilos.tarjeta">
                <div class="mb-2 flex items-center gap-[9px]">
                  <span [class]="estilos.icono">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                  </span>
                  <h3 [class]="estilos.rotulo">Acceso remoto</h3>
                </div>
                <span class="estado-regla pronto">Pronto</span>
                <div class="banda"></div>
                <p class="pie">Por VPN</p>
              </div>
            </div>

            <div class="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1.5">
              <h2 [class]="estilos.titulo + ' !m-0'">Dispositivos rechazados</h2>
              <span class="secundario">{{ filtrados().length }} {{ filtrados().length === 1 ? 'dispositivo' : 'dispositivos' }} en el periodo</span>
            </div>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Celulares y tablets que intentaron abrir Cashi</caption>
                <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                  <tr>
                    <th scope="col" [class]="estilos.th">Último intento</th>
                    <th scope="col" [class]="estilos.th">Usuario</th>
                    <th scope="col" [class]="estilos.th">Dispositivo</th>
                    <th scope="col" [class]="estilos.th">Navegador</th>
                    <th scope="col" [class]="estilos.th">IP</th>
                    <th scope="col" [class]="estilos.th">Intentos</th>
                  </tr>
                </thead>
                <tbody>
                  @for (r of visibles(); track $index) {
                    <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#f4f6f9] dark:border-slate-800 dark:hover:bg-slate-800/60">
                      <td [class]="estilos.td">{{ cuando(r) }}</td>
                      <td [class]="estilos.td">
                        @if (r.usuario) {
                          <span class="persona-celda">{{ r.nombre ?? r.usuario }}<small>{{ r.usuario }}</small></span>
                        } @else {
                          <span class="secundario">Sin iniciar sesión</span>
                        }
                      </td>
                      <td [class]="estilos.td">
                        <span class="marca-so">
                          <ng-container *ngTemplateOutlet="icono; context: { $implicit: r.dispositivo, tam: 15 }" />
                          <span>{{ r.dispositivo }}<small>{{ r.modelo }}</small></span>
                        </span>
                      </td>
                      <td [class]="estilos.td">
                        <span class="marca-so">
                          <ng-container *ngTemplateOutlet="icono; context: { $implicit: r.navegador, tam: 15 }" />
                          {{ r.navegador === 'Samsung' ? 'Samsung Internet' : r.navegador }}
                        </span>
                      </td>
                      <td [class]="estilos.td">
                        <span class="origen-celda">
                          <span class="ip">{{ r.ip }}</span>
                          @if (r.ip && r.ip === datos()?.ipOficina) { <span class="origen">Oficina</span> }
                        </span>
                      </td>
                      <td [class]="estilos.td">
                        <span class="intentos-min" [class.alto]="r.intentos >= 10" [class.medio]="r.intentos >= 3 && r.intentos < 10"
                              [attr.title]="r.intentos + (r.intentos === 1 ? ' intento' : ' intentos')">{{ r.intentos }}</span>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="6" class="secundario py-7 text-center">Sin rechazos en el periodo</td></tr>
                  }
                </tbody>
              </table>
              @if (paginas() > 1) {
                <div class="flex items-center justify-between gap-3 border-t border-[#f1f3f6] px-3 py-2.5 dark:border-slate-800">
                  <span class="secundario">{{ (pagina() - 1) * porPagina + 1 }}–{{ (pagina() - 1) * porPagina + visibles().length }} de {{ filtrados().length }}</span>
                  <div class="flex gap-1.5">
                    <button type="button" [class]="estilos.botonIcono + ' !h-8 !min-w-8'" aria-label="Página anterior"
                            [disabled]="pagina() === 1" (click)="pagina.set(pagina() - 1)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button type="button" [class]="estilos.botonIcono + ' !h-8 !min-w-8'" aria-label="Página siguiente"
                            [disabled]="pagina() === paginas()" (click)="pagina.set(pagina() + 1)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class ControlAccesoComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);

  protected readonly estilos = ESTILOS;
  protected readonly porPagina = POR_PAGINA;
  /** Contenido fijo del propio front (los logos), no datos de nadie. */
  protected readonly sprite = inject(DomSanitizer).bypassSecurityTrustHtml(SPRITE_LOGOS);

  readonly datos = signal<PanelAcceso | null>(null);
  readonly cargando = signal(false);
  readonly error = signal(false);

  readonly periodo = signal(7);
  readonly dispositivo = signal('');
  readonly busqueda = signal('');
  readonly pagina = signal(1);

  ngOnInit(): void {
    this.cargar();
  }

  /** Siempre los 30 días: cambiar el periodo no vuelve a pedir nada. */
  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.servicio.controlAcceso(30).subscribe({
      next: d => {
        this.datos.set(d);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      }
    });
  }

  private readonly hoy = computed(() => this.datos()?.hoy ?? new Date().toISOString().slice(0, 10));
  private readonly desde = computed(() => menosDias(this.hoy(), this.periodo() - 1));

  /** Los rechazos del periodo, un renglón por equipo. */
  readonly filtrados = computed<Rechazo[]>(() => {
    const desde = this.desde();
    const tipo = this.dispositivo();
    const q = this.busqueda().trim().toLowerCase();

    const grupos = new Map<string, Rechazo>();
    for (const r of this.datos()?.rechazos ?? []) {
      if (r.dia < desde) {
        continue;
      }
      if (tipo && !(r.dispositivo === tipo || (tipo === 'Apple' && (r.dispositivo === 'iPhone' || r.dispositivo === 'iPad')))) {
        continue;
      }
      if (q && !(r.usuario ?? '').toLowerCase().includes(q) && !(r.nombre ?? '').toLowerCase().includes(q)
          && !(r.ip ?? '').includes(q)) {
        continue;
      }
      const clave = [r.usuario, r.dispositivo, r.modelo, r.navegador, r.ip].join('|');
      const actual = grupos.get(clave);
      if (!actual) {
        grupos.set(clave, { ...r, hora: r.ultimo });
      } else {
        actual.intentos += r.intentos;
        if (r.dia + r.ultimo > actual.dia + actual.hora) {
          actual.dia = r.dia;
          actual.hora = r.ultimo;
        }
      }
    }
    return [...grupos.values()].sort((a, b) => (b.dia + b.hora).localeCompare(a.dia + a.hora));
  });

  readonly totalIntentos = computed(() => this.filtrados().reduce((t, r) => t + r.intentos, 0));
  readonly conUsuario = computed(() => new Set(this.filtrados().filter(r => r.usuario).map(r => r.usuario)).size);

  /** Un punto por día (hasta 7), con el área suave debajo. */
  readonly tendencia = computed(() => {
    const dias = Math.min(7, this.periodo());
    const lista = this.filtrados();
    const crudos = (this.datos()?.rechazos ?? []);
    const claves = new Set(lista.map(r => [r.usuario, r.dispositivo, r.modelo, r.navegador, r.ip].join('|')));
    const porDia = Array.from({ length: dias }, (_, i) => {
      const d = menosDias(this.hoy(), dias - 1 - i);
      const n = crudos.filter(r => r.dia === d && claves.has([r.usuario, r.dispositivo, r.modelo, r.navegador, r.ip].join('|')))
        .reduce((t, r) => t + r.intentos, 0);
      return { dia: d, n };
    });
    const max = Math.max(1, ...porDia.map(p => p.n));
    const ancho = 240, alto = 46, pad = 4;
    const puntos = porDia.map((p, k) => ({
      dia: p.dia,
      dm: dm(p.dia),
      titulo: `${dm(p.dia)} · ${p.n}`,
      x: +(porDia.length === 1 ? ancho / 2 : pad + k * (ancho - 2 * pad) / (porDia.length - 1)).toFixed(1),
      y: +(alto - pad - (p.n / max) * (alto - 2 * pad)).toFixed(1)
    }));
    const linea = puntos.map((p, k) => `${k ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
    const area = `${linea} L${puntos[puntos.length - 1].x},${alto} L${puntos[0].x},${alto} Z`;
    const etiqueta = 'Intentos por día: ' + porDia.map(p => `${dm(p.dia)} ${p.n}`).join(', ');
    return { ancho, alto, puntos, linea, area, etiqueta };
  });

  readonly porTipo = computed(() => {
    const lista = this.filtrados();
    const grupos = GRUPOS.map(g => ({
      nombre: g.nombre,
      color: g.color,
      n: lista.filter(r => (g.de as readonly string[]).includes(r.dispositivo)).reduce((s, r) => s + r.intentos, 0)
    }));
    const total = Math.max(1, grupos.reduce((t, g) => t + g.n, 0));
    return grupos.map(g => ({ ...g, pct: Math.round(g.n / total * 100) }));
  });
  readonly totalTipos = computed(() => this.porTipo().reduce((t, g) => t + g.n, 0));
  readonly etiquetaTipos = computed(() => this.porTipo().map(g => `${g.nombre} ${g.n}`).join(', '));

  /** Equipos que entraron en el periodo: personas distintas por sistema. */
  readonly sistemas = computed(() => {
    const desde = this.desde();
    const ingresos = (this.datos()?.ingresos ?? []).filter(i => i.dia >= desde);
    const cuentas = SISTEMAS.map(s => ({
      clave: s.clave,
      nombre: s.nombre,
      n: new Set(ingresos.filter(i => i.sistema === s.clave).map(i => i.usuario)).size
    }));
    const total = Math.max(1, cuentas.reduce((t, c) => t + c.n, 0));
    return cuentas.map(c => ({ ...c, pct: +(c.n / total * 100).toFixed(1) }));
  });

  readonly paginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / POR_PAGINA)));
  readonly visibles = computed(() => {
    const pagina = Math.min(this.pagina(), this.paginas());
    const ini = (pagina - 1) * POR_PAGINA;
    return this.filtrados().slice(ini, ini + POR_PAGINA);
  });

  cuando(r: Rechazo): string {
    if (r.dia === this.hoy()) {
      return `Hoy ${r.hora}`;
    }
    return r.dia === menosDias(this.hoy(), 1) ? `Ayer ${r.hora}` : `${dm(r.dia)} ${r.hora}`;
  }

  logoDe(nombre: string | null): string {
    return (nombre && LOGO[nombre]) || 'otro';
  }
}

function menosDias(iso: string, n: number): string {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dm(iso: string): string {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}
