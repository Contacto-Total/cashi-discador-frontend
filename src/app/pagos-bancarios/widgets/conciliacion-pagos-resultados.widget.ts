import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PosibleMatchConciliacionDTO } from '../models/conciliacion-pagos.model';

@Component({
  selector: 'app-conciliacion-pagos-resultados',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 min-h-64"></div>
  `
})
export class ConciliacionPagosResultadosWidget {
  @Input() data: PosibleMatchConciliacionDTO[] = [];
}
