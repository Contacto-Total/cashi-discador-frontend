import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from '../../shared/services/toast.service';
import { AsistenciaService } from './asistencia.service';
import { DashboardAsistencia } from './asistencia.models';
import { ESTILOS, duracionCorta, unidadDe } from './asistencia.estilos';

/**
 * El pulso de la cartera: lo que se mira antes de entrar al detalle.
 *
 * No carga nada hasta que hay ámbito elegido. Traer a toda la empresa de golpe
 * en la pantalla que más se abre la vuelve lenta sin que nadie lo pida.
 *
 * Las barras y la cinta son CSS, no una librería de gráficos: son cuatro
 * formas y meter Chart.js por esto añade 200 KB al bundle para dibujar
 * rectángulos.
 */
@Component({
  selector: 'app-asistencia-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styles: [`
    :host { display: block; }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    /* Las columnas del día: crecen desde abajo, con el borde de arriba redondeado. */
    .columna { display: flex; flex-direction: column; justify-content: flex-end; height: 120px; gap: 2px }
    .tramo { width: 100%; border-radius: 3px 3px 0 0 }
    .tramo:not(:first-child) { border-radius: 0 }
    /* La barra de una persona: el relleno dice cuánto, el color si pasa el tope. */
    .barra { position: relative; height: 8px; border-radius: 999px; background: #f1f3f6; overflow: hidden }
    .barra::after {
      content: ""; position: absolute; inset: 0 auto 0 0; width: var(--valor);
      border-radius: 999px; background: var(--color);
    }
    :host-context(.dark) .barra { background: #1e293b }
  `],
  template: `
    @if (!idSubcartera()) {
      <div [class]="estilos.vacio">
        <strong class="block text-[13.5px]">Elige una subcartera</strong>
        <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">
          El dashboard se consulta por ámbito. Así no se trae a toda la empresa de golpe.
        </span>
      </div>
    } @else if (cargando()) {
      <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
    } @else if (datos(); as d) {
      <div class="aparecer">

        <div class="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="calendar-days" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Puntualidad</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.porcentajePuntualidad }}<small [class]="estilos.unidad">%</small></div>
            <div [class]="estilos.banda">
              <div class="barra w-full" [style.--valor.%]="d.porcentajePuntualidad"
                   [style.--color]="d.porcentajePuntualidad >= 80 ? '#16a34a' : '#f59e0b'"></div>
            </div>
            <p [class]="estilos.pie">{{ d.personas }} personas en el ámbito</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="clock" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Tardanza acumulada</h3>
            </div>
            <div [class]="estilos.cifra">
              {{ duracionCorta(d.minutosTardanzaTotal) }}<small [class]="estilos.unidad">{{ unidadDe(d.minutosTardanzaTotal) }}</small>
            </div>
            <div [class]="estilos.banda">
              <div class="flex w-full gap-[3px]">
                @for (p of d.porDia; track p.fecha) {
                  <span class="h-3 flex-1 rounded-[3px]"
                        [class]="p.minutosTardanza > 0 ? 'bg-[#f59e0b]' : 'bg-[#16a34a]'"
                        [title]="p.nombreDia + ': ' + p.minutosTardanza + ' min'"></span>
                }
              </div>
            </div>
            <p [class]="estilos.pie">De todo el ámbito en el rango</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="alert-triangle" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Días por completar</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.diasIncompletos }}</div>
            <div [class]="estilos.banda">
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                {{ d.diasIncompletos ? 'Les falta alguna marca' : 'Todo marcado' }}
              </span>
            </div>
            <p [class]="estilos.pie">Se corrigen desde el reporte</p>
          </div>

          <div [class]="estilos.tarjeta">
            <div class="mb-2 flex items-center gap-2.5">
              <span [class]="estilos.icono">
                <lucide-angular name="award" [size]="15" class="block"></lucide-angular>
              </span>
              <h3 [class]="estilos.rotulo">Sin bono</h3>
            </div>
            <div [class]="estilos.cifra">{{ d.sinBono }}</div>
            <div [class]="estilos.banda">
              <span class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">
                de {{ d.personas }} {{ d.personas === 1 ? 'persona' : 'personas' }}
              </span>
            </div>
            <p [class]="estilos.pie">Pasaron algún tope de tardanza</p>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-[1.2fr_1fr]">

          <div>
            <h2 [class]="estilos.titulo">Cómo fue cada día</h2>
            <div [class]="estilos.tarjeta">
              <div class="flex items-end gap-2">
                @for (p of d.porDia; track p.fecha) {
                  <div class="flex flex-1 flex-col items-center gap-1.5">
                    <div class="columna w-full"
                         [title]="p.puntuales + ' puntuales, ' + p.tarde + ' tarde, ' + p.faltas + ' faltas'">
                      @if (p.faltas) {
                        <span class="tramo bg-[#dc2626]" [style.height.%]="alto(p.faltas, d)"></span>
                      }
                      @if (p.tarde) {
                        <span class="tramo bg-[#f59e0b]" [style.height.%]="alto(p.tarde, d)"></span>
                      }
                      @if (p.puntuales) {
                        <span class="tramo bg-[#16a34a]" [style.height.%]="alto(p.puntuales, d)"></span>
                      }
                    </div>
                    <span class="text-[11px] font-semibold text-[#5f6c80] dark:text-slate-400">
                      {{ p.nombreDia.slice(0, 3) }}
                    </span>
                    <span class="text-[10.5px] text-[#8491a3] dark:text-slate-500">{{ p.fecha | date: 'dd/MM' }}</span>
                  </div>
                } @empty {
                  <p class="w-full py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                    Sin días laborables en el rango
                  </p>
                }
              </div>

              <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[#f1f3f6] pt-2.5 text-[11.5px] text-[#5f6c80] dark:border-slate-800 dark:text-slate-400">
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-[#16a34a]"></span>Puntual
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-[#f59e0b]"></span>Tarde
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-[#dc2626]"></span>Falta
                </span>
              </div>
            </div>
          </div>

          <div>
            <h2 [class]="estilos.titulo">Quién acumula más tardanza</h2>
            <div [class]="estilos.tarjeta + ' !px-0 !py-0'">
              <ul class="!m-0 list-none !p-0">
                @for (f of d.ranking; track f.idUsuario) {
                  <li class="border-b border-[#f1f3f6] px-4 py-2.5 last:border-0 dark:border-slate-800">
                    <div class="mb-1.5 flex items-baseline justify-between gap-3">
                      <div class="min-w-0">
                        <strong class="block truncate text-[12.5px]">{{ f.nombreAgente }}</strong>
                        <span class="text-[11px] text-[#5f6c80] dark:text-slate-400">
                          {{ f.porcentajePuntualidad }}% puntual
                        </span>
                      </div>
                      <span class="shrink-0 text-[12.5px] font-bold tabular-nums"
                            [class]="f.pierdeBono ? 'text-[#b91c1c] dark:text-red-300' : ''">
                        {{ duracionCorta(f.minutosTardanza) }} {{ unidadDe(f.minutosTardanza) }}
                      </span>
                    </div>
                    <div class="barra" [style.--valor.%]="anchoRanking(f.minutosTardanza, d)"
                         [style.--color]="f.pierdeBono ? '#dc2626' : '#8491a3'"></div>
                  </li>
                } @empty {
                  <li class="px-4 py-10 text-center text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                    Nadie llegó tarde en el rango
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AsistenciaDashboardComponent {
  private readonly servicio = inject(AsistenciaService);
  private readonly toast = inject(ToastService);

  protected readonly estilos = ESTILOS;
  protected readonly duracionCorta = duracionCorta;
  protected readonly unidadDe = unidadDe;

  readonly idSubcartera = input<number | null>(null);
  readonly desde = input.required<string>();
  readonly hasta = input.required<string>();

  readonly datos = signal<DashboardAsistencia | null>(null);
  readonly cargando = signal(false);

  /** El día con más gente: contra él se escalan las columnas. */
  private readonly tope = computed(() => {
    const d = this.datos();
    if (!d) {
      return 1;
    }
    return Math.max(1, ...d.porDia.map(p => p.puntuales + p.tarde + p.faltas));
  });

  constructor() {
    // Vuelve a pedir en cuanto cambia el ámbito o el rango: son los tres
    // valores que definen la consulta y no hay más de donde venga el cambio.
    effect(() => {
      const ambito = this.idSubcartera();
      const desde = this.desde();
      const hasta = this.hasta();
      if (!ambito) {
        this.datos.set(null);
        return;
      }
      this.cargar(desde, hasta, ambito);
    });
  }

  private cargar(desde: string, hasta: string, idSubcartera: number): void {
    this.cargando.set(true);
    this.servicio.dashboard(desde, hasta, idSubcartera).subscribe({
      next: d => {
        this.datos.set(d);
        this.cargando.set(false);
      },
      error: () => {
        this.toast.error('No se pudo cargar el dashboard');
        this.cargando.set(false);
      }
    });
  }

  /** Alto de un tramo en porcentaje del día más poblado. */
  alto(cuantos: number, d: DashboardAsistencia): number {
    void d;
    return (cuantos / this.tope()) * 100;
  }

  /** Ancho de la barra del ranking, contra quien más acumula. */
  anchoRanking(minutos: number, d: DashboardAsistencia): number {
    const mayor = Math.max(1, ...d.ranking.map(f => f.minutosTardanza));
    return (minutos / mayor) * 100;
  }
}
