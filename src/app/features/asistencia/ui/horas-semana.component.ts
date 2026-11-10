import { ChangeDetectionStrategy, Component, input } from '@angular/core';

const enHoras = (m: number): string => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/**
 * Las horas de la semana de una persona en su celda: lo trabajado contra lo previsto y la barra repartida
 * entre presenciales y remotas, medida contra la jornada más larga de la tabla.
 */
@Component({
  selector: 'app-horas-semana',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex min-w-[8rem] flex-col gap-1' },
  template: `
    <span>{{ enHoras(trab()) }} <small class="text-[.75rem] text-muted-foreground">de {{ enHoras(jornada()) }}</small></span>
    <div class="flex h-[.375rem] gap-[2px] overflow-hidden rounded-full bg-(--line2)">
      <i class="h-full bg-(--serie-a)" [style.width.%]="pres() / max() * 100" [title]="'Presenciales ' + enHoras(pres())"></i>
      <i class="h-full bg-(--serie-b)" [style.width.%]="rem() / max() * 100" [title]="'Remotas ' + enHoras(rem())"></i>
    </div>
    @if (rem()) { <small class="text-[.75rem] text-muted-foreground">Remotas {{ enHoras(rem()) }}</small> }
  `
})
export class HorasSemanaComponent {
  readonly trab = input(0);
  readonly jornada = input(0);
  readonly pres = input(0);
  readonly rem = input(0);
  /** La jornada más larga de la tabla: todas las barras se miden contra ella. */
  readonly max = input(1);
  protected readonly enHoras = enHoras;
}
