import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/** Título de tarjeta con su icono en baldosa. La baldosa toma `--tono` si existe; si no, el verde de marca. */
@Component({
  selector: 'app-titulo-tarjeta',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-center gap-2.5' },
  template: `
    <span class="grid size-7 flex-none place-items-center rounded-lg bg-[color-mix(in_oklab,var(--tono,var(--brand))_14%,transparent)] text-[color:var(--tono,var(--brand))] transition-colors duration-500">
      <lucide-angular [name]="icono" [size]="14"></lucide-angular>
    </span>
    <p role="heading" aria-level="2" class="m-0 text-[16px] font-bold text-foreground">{{ titulo }}</p>
  `
})
export class TituloTarjetaComponent {
  @Input({ required: true }) icono!: string;
  @Input({ required: true }) titulo!: string;
}
