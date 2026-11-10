import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { BotonDirective } from '../../../shared/ui/boton.directive';
import { CAMPO, ETIQUETA } from './clases';
import { BOTON_SEC } from './control-comun';

/**
 * Dar paso o rechazar una solicitud: el motivo del rechazo y los dos botones. La supervisora da conforme
 * y RR.HH. aprueba; rechazar pide el motivo, que es lo que verá el asesor.
 */
@Component({
  selector: 'app-decidir-solicitud',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col gap-[.75rem] rounded-[.75rem] border border-border bg-card px-4 py-[.875rem]' },
  imports: [LucideAngularModule, BotonDirective],
  template: `
    <div [class]="CAMPO">
      <label [for]="id()" [class]="ETIQUETA">Motivo del rechazo</label>
      <textarea [id]="id()" [class]="TEXTAREA" placeholder="Solo si la rechazas" [value]="motivo()" (input)="motivo.set($any($event.target).value); falta.set(false)"></textarea>
    </div>
    @if (falta() || error()) { <p class="m-0 text-[.75rem] leading-[1.5] font-medium text-(--ro)">{{ falta() ? 'Para rechazar hay que decir por qué' : error() }}</p> }
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" appBoton class="px-4!" [disabled]="guardando()" (click)="si.emit(motivo().trim())"><lucide-angular name="check" [size]="16" class="flex"></lucide-angular>{{ textoSi() }}</button>
      <button type="button" appBoton="secundario" [class]="'px-4! ' + BOTON_SEC" [disabled]="guardando()" (click)="rechazar()">Rechazar</button>
    </div>
  `
})
export class DecidirSolicitudComponent {
  /** «Conforme» para la supervisora, «Aprobar» para RR.HH. */
  readonly textoSi = input('Conforme');
  readonly guardando = input(false);
  /** El error que devolvió el backend al guardar. */
  readonly error = input('');
  readonly id = input('motivo-rechazo');
  readonly si = output<string>();
  readonly no = output<string>();

  protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly BOTON_SEC = BOTON_SEC;
  protected readonly TEXTAREA = 'font-cashi m-0! block min-h-[2.75rem]! w-full resize-y rounded-[.5rem]! border! border-(--campo-ln)! bg-(--campo)! px-[.625rem]! py-2! text-[.875rem]! leading-[1.5]! '
    + 'text-foreground! shadow-[0_1px_2px_rgb(0_0_0/.05)] outline-none focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]';
  readonly motivo = signal('');
  readonly falta = signal(false);

  rechazar(): void {
    if (this.motivo().trim().length < 4) {
      this.falta.set(true);
      return;
    }
    this.no.emit(this.motivo().trim());
  }
}
