import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AsistenciaService } from './asistencia.service';
import { HorarioDeSemana } from './asistencia.models';
import { ESTILOS, sumarDias } from './asistencia.estilos';

/** Cómo es la celda de una persona un día, frente al horario del equipo. */
type EstadoCelda = 'igual' | 'recupera' | 'solicitud' | 'porAprobar' | 'propio' | 'libre';

/**
 * El horario de una semana: el fijo del equipo con lo que cambian las
 * solicitudes de esa semana encima —una recuperación estira la salida; un
 * descanso médico o un permiso cambian el día—. Es contra este horario que se
 * mide el reporte.
 *
 * De solo lectura. El fijo se cambia en Configuración; lo demás son
 * solicitudes. Solo salen el equipo y quienes tienen algo distinto.
 */
@Component({
  selector: 'app-horario-semana',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 [class]="estilos.titulo + ' !mb-0'">Horario de la semana</h2>
        <p class="mt-[3px] text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ subtitulo() }}</p>
      </div>
      <button type="button" [class]="estilos.botonSecundario" (click)="modificar.emit()">
        <lucide-angular name="pencil" [size]="15" class="block"></lucide-angular>
        Modificar horario
      </button>
    </div>

    @if (grilla(); as g) {
      <div [class]="estilos.panel + ' mb-2.5'">
        <table class="w-full border-collapse">
          <caption class="sr-only">Horario de cada asesor en la semana</caption>
          <thead>
            <tr>
              <th scope="col" [class]="estilos.th + ' sticky left-0 z-[1] min-w-[200px] bg-white dark:bg-slate-900'">Asesor</th>
              @for (c of g.columnas; track c.dia) {
                <th scope="col" [class]="estilos.th + ' !text-center'">
                  {{ c.nombre }} <span class="font-semibold normal-case tracking-normal">{{ c.fecha }}</span>
                </th>
              }
            </tr>
          </thead>
          <tbody>
            <tr class="bg-[#f4f6f9] dark:bg-slate-800/60">
              <td [class]="estilos.td + ' sticky left-0 z-[1] bg-[#f4f6f9] font-bold dark:bg-slate-800'">Horario del equipo</td>
              @for (c of g.columnas; track c.dia) {
                <td [class]="estilos.td + ' text-center font-semibold'">{{ c.equipo }}</td>
              }
            </tr>
            @for (f of g.filas; track f.idUsuario) {
              <tr>
                <td [class]="estilos.td + ' sticky left-0 z-[1] bg-white dark:bg-slate-900'">
                  <strong class="block max-w-[220px] truncate font-semibold">{{ f.nombre }}</strong>
                  @if (f.motivo) {
                    <span class="block max-w-[220px] truncate text-[11px] text-[#92400e] dark:text-amber-300">{{ f.motivo }}</span>
                  }
                </td>
                @for (c of f.celdas; track $index) {
                  <td [class]="estilos.td + ' text-center'">
                    <span class="inline-flex items-center gap-1 rounded-md px-2 py-[3px] tabular-nums"
                          [class]="CELDA[c.estado]" [title]="c.titulo">
                      {{ c.texto }}
                      @if (c.extra) {
                        <small class="text-[10.5px] font-bold">+{{ c.extra }}</small>
                      }
                    </span>
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="g.columnas.length + 1" class="secundario !px-3 !py-6 text-center !text-[12.5px]">
                  Todos con el horario del equipo
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <div class="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-[11.5px] text-[#5f6c80] dark:text-slate-400">
        @for (l of LEYENDA; track l.estado) {
          <span class="inline-flex items-center gap-1.5">
            <span class="inline-block h-2.5 w-4 rounded-[3px]" [class]="MUESTRA[l.estado]"></span>{{ l.texto }}
          </span>
        }
      </div>
    }
  `
})
export class HorarioSemanaComponent {
  private readonly servicio = inject(AsistenciaService);

  protected readonly estilos = ESTILOS;

  readonly idSubcartera = input<number | null>(null);
  /** El lunes de la semana que se mira. */
  readonly lunes = input.required<string>();
  /** Ir a Configuración: el horario fijo solo se cambia ahí. */
  readonly modificar = output<void>();

  readonly semana = signal<HorarioDeSemana | null>(null);

  /** Lo igual al equipo, apagado; lo distinto, resaltado. */
  protected readonly CELDA: Record<EstadoCelda, string> = {
    igual: 'text-[#5f6c80] dark:text-slate-400',
    recupera: 'bg-[#fef6e0] font-semibold text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300',
    solicitud: 'bg-[#e0f2fe] font-semibold text-[#075985] dark:bg-sky-950/50 dark:text-sky-300',
    porAprobar: 'border border-dashed border-[#d97706] font-semibold text-[#92400e] dark:border-amber-500 dark:text-amber-300',
    propio: 'bg-[#eef2ff] font-semibold text-[#3730a3] dark:bg-indigo-950/50 dark:text-indigo-300',
    libre: 'text-[#8491a3] dark:text-slate-500'
  };
  /** La muestra de la leyenda: la celda sin texto, con un color que se vea. */
  protected readonly MUESTRA: Record<EstadoCelda, string> = {
    igual: 'border border-[#cbd2dc] bg-white dark:border-slate-600 dark:bg-slate-900',
    recupera: 'bg-[#fcd34d] dark:bg-amber-600',
    solicitud: 'bg-[#7dd3fc] dark:bg-sky-600',
    porAprobar: 'border border-dashed border-[#d97706] dark:border-amber-500',
    propio: 'bg-[#c7d2fe] dark:bg-indigo-700',
    libre: ''
  };
  protected readonly LEYENDA: { estado: EstadoCelda; texto: string }[] = [
    { estado: 'igual', texto: 'Igual al equipo' },
    { estado: 'recupera', texto: 'Recupera horas' },
    { estado: 'solicitud', texto: 'Descanso, permiso o cita' },
    { estado: 'porAprobar', texto: 'Solicitud por aprobar' },
    { estado: 'propio', texto: 'Horario propio' }
  ];

  constructor() {
    effect(() => this.cargar(this.idSubcartera(), this.lunes()));
  }

  readonly subtitulo = computed(() => {
    const s = this.semana();
    const corta = (f: string) => `${f.slice(8, 10)}/${f.slice(5, 7)}`;
    return s ? `Semana del ${corta(s.lunes)} al ${corta(s.sabado)}` : '';
  });

  /** Una fila por asesor con algo distinto del equipo y una columna por día. */
  readonly grilla = computed(() => {
    const s = this.semana();
    if (!s) {
      return null;
    }
    const cortos = ['', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hm = (h: string) => h.slice(0, 5);
    const dias = [...new Set([...s.dias.map(d => d.diaSemana),
      ...s.personas.flatMap(x => x.dias.map(d => d.diaSemana))])].sort((a, b) => a - b);

    const columnas = dias.map(dia => {
      const eq = s.dias.find(d => d.diaSemana === dia);
      const fecha = sumarDias(s.lunes, dia - 1);
      return { dia, nombre: cortos[dia], fecha: `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`,
               equipo: !eq ? '—' : eq.calendario ?? `${hm(eq.entrada)} – ${hm(eq.salida)}` };
    });

    const filas = s.personas.map(persona => {
      const celdas = dias.map(dia => {
        const suyo = persona.dias.find(d => d.diaSemana === dia);
        if (!suyo) {
          return { texto: '—', estado: 'libre' as EstadoCelda, extra: 0, titulo: 'No trabaja ese día' };
        }
        const texto = `${hm(suyo.entrada)} – ${hm(suyo.salida)}`;
        if (suyo.solicitud) {
          return suyo.porAprobar
            ? { texto: suyo.solicitud, estado: 'porAprobar' as EstadoCelda, extra: 0,
                titulo: `${suyo.solicitud} · por aprobar` }
            : { texto: suyo.solicitud, estado: 'solicitud' as EstadoCelda, extra: 0, titulo: suyo.solicitud };
        }
        if (suyo.minutosRecupera) {
          return suyo.porAprobar
            ? { texto, estado: 'porAprobar' as EstadoCelda, extra: suyo.minutosRecupera,
                titulo: `${suyo.motivo} · por aprobar` }
            : { texto, estado: 'recupera' as EstadoCelda, extra: suyo.minutosRecupera, titulo: suyo.motivo ?? '' };
        }
        return suyo.distinto
          ? { texto, estado: 'propio' as EstadoCelda, extra: 0, titulo: 'Horario propio de esta persona' }
          : { texto, estado: 'igual' as EstadoCelda, extra: 0, titulo: 'Igual al equipo' };
      });
      const motivo = persona.dias.find(d => d.minutosRecupera)?.motivo ?? null;
      return { idUsuario: persona.idUsuario, nombre: persona.nombre, motivo, celdas };
    });

    return { columnas, filas: filas.filter(f => f.celdas.some(c => c.estado !== 'igual' && c.estado !== 'libre')) };
  });

  private cargar(sub: number | null, lunes: string): void {
    if (!sub) {
      this.semana.set(null);
      return;
    }
    this.servicio.horarioSemana(sub, lunes).subscribe({
      next: s => this.semana.set(s),
      error: () => this.semana.set(null)
    });
  }
}
