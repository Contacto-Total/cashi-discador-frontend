import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Headphones, Search, BarChart3 } from 'lucide-angular';

import { RecordingsTrackerComponent } from '../../components/recordings-tracker/recordings-tracker.component';
import { QualityMonitorComponent } from '../../components/quality-monitor/quality-monitor.component';

type Pestana = 'grabaciones' | 'monitoreo';

/**
 * El contenedor de las dos vistas del módulo.
 *
 * Antes eran doce líneas que envolvían al tracker. Las pestañas viven acá y no
 * dentro de `recordings-tracker` a propósito: ese componente tiene 850 líneas de
 * búsqueda, filtros, paginación y descargas, y meterle un router interno era
 * arriesgar una pantalla que ya funciona para agregar una que todavía no existía.
 * Así el tracker no se toca.
 *
 * Las dos pestañas se montan con `*ngIf` y no con `[hidden]`: cambiar de pestaña
 * descarta el estado de la otra, que es lo correcto acá. Son dos preguntas
 * distintas —"quiero oír este audio" y "cómo viene evolucionando el equipo"— y
 * conservar los filtros de una al volver de la otra confunde más de lo que ayuda.
 */
@Component({
  selector: 'app-recordings-page',
  standalone: true,
  imports: [CommonModule, RecordingsTrackerComponent, QualityMonitorComponent, LucideAngularModule],
  templateUrl: './recordings-page.component.html',
  styleUrls: ['./recordings-page.component.scss']
})
export class RecordingsPageComponent {
  readonly Headphones = Headphones;
  readonly Search = Search;
  readonly BarChart3 = BarChart3;

  pestana: Pestana = 'grabaciones';

  seleccionar(pestana: Pestana): void {
    this.pestana = pestana;
  }
}
