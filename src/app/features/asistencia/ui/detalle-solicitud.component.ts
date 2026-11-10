import { BotonDirective } from '../../../shared/ui/boton.directive';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { Justificacion } from '../asistencia.models';
import { MINI } from './ficha-clases';
import { AVISO, DETALLE_SUB, DIAS_LARGOS } from './solicitud-clases';

const hhmm = (h: string): string => h.slice(0, 5);
const corta = (f: string): string => `${f.slice(8, 10)}/${f.slice(5, 7)}`;

/**
 * El detalle de una solicitud, igual para la supervisora y para RR.HH.: el tipo y los días, las horas y
 * el horario de ese día, el comentario con quién la registró y cuándo, el certificado y, en el teletrabajo
 * por horas, lo que su horario no cubre. Lo que se puede hacer con ella va proyectado debajo.
 */
@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: '@container/pnl flex flex-col gap-[.875rem] pt-2' },
  imports: [BotonDirective, LucideAngularModule],
  template: `
    @let s = solicitud();
    <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-x-6 gap-y-3 border-b border-(--line2) pb-[.875rem] @max-[46.001rem]/pnl:grid-cols-[repeat(2,minmax(0,1fr))]">
      <div class="min-w-0"><span [class]="DATO">{{ s.tipo }}</span><small [class]="DATO_SUB">{{ diasDe(s) }}</small></div>
      <div class="min-w-0"><span [class]="DATO">{{ horasDe(s) }}</span>@if (segunda()) {<small [class]="DATO_SUB">{{ segunda() }}</small>}</div>
      <div class="min-w-0 @max-[46.001rem]/pnl:col-span-full"><span [class]="DATO">{{ s.comentario || 'Sin comentario' }}</span><small [class]="DATO_SUB">{{ registroDe(s) }}</small></div>
    </div>
    @if (s.tieneArchivo) {
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p [class]="DETALLE_SUB + ' mr-auto'"><lucide-angular name="paperclip" [size]="14" class="inline-block align-[-.125rem] [&_svg]:size-[.875rem]"></lucide-angular> {{ s.archivoNombre || 'Adjunto' }}</p>
        <button type="button" appBoton="secundario" appBotonAlto="chico" [class]="MINI + ' h-[2.375rem]!'" [attr.aria-pressed]="certificadoAbierto()" (click)="certificado.emit()">
          {{ certificadoAbierto() ? 'Cerrar certificado' : 'Ver certificado' }}
        </button>
      </div>
    }
    @if (aviso()) { <p [class]="AVISO.am">{{ aviso() }}</p> }
    <ng-content />
  `
})
export class DetalleSolicitudComponent {
  readonly solicitud = input.required<Justificacion>();
  /** Bajo las horas: el horario de ese día, o la modalidad en el teletrabajo. */
  readonly segunda = input('');
  /** Lo que el teletrabajo por horas no cubre, dicho para quien revisa. */
  readonly aviso = input('');
  readonly certificadoAbierto = input(false);
  readonly certificado = output<void>();

  protected readonly MINI = MINI; protected readonly AVISO = AVISO; protected readonly DETALLE_SUB = DETALLE_SUB;
  protected readonly DATO = 'block text-[.9375rem] leading-[1.5] font-bold [overflow-wrap:anywhere] text-foreground';
  protected readonly DATO_SUB = 'block text-[.75rem] leading-[1.5] [overflow-wrap:anywhere] text-muted-foreground';

  /** «Martes 03/11» o «03/11 al 05/11». */
  diasDe(s: Justificacion): string {
    return !s.fechaHasta || s.fechaHasta === s.fechaDesde
      ? `${DIAS_LARGOS[new Date(s.fechaDesde + 'T00:00:00').getDay()]} ${corta(s.fechaDesde)}`
      : `${corta(s.fechaDesde)} al ${corta(s.fechaHasta)}`;
  }

  horasDe(s: Justificacion): string {
    if (s.remotoDesde && s.remotoHasta && s.oficinaDesde && s.oficinaHasta) {
      return `Oficina ${hhmm(s.oficinaDesde)}–${hhmm(s.oficinaHasta)}, remoto ${hhmm(s.remotoDesde)}–${hhmm(s.remotoHasta)}`;
    }
    return s.trabajaDesde && s.trabajaHasta ? `De ${hhmm(s.trabajaDesde)} a ${hhmm(s.trabajaHasta)}` : 'Día completo';
  }

  /** «Registró Verónica Valdivieso el 03/11 a las 15:02». */
  registroDe(s: Justificacion): string {
    const en = s.solicitadaEn ?? '';
    return `Registró ${s.solicitadaPor ?? '—'}${en ? ` el ${corta(en.slice(0, 10))} a las ${en.slice(11, 16)}` : ''}`;
  }
}
