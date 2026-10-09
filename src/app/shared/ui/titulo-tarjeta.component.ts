import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Título de tarjeta. */
@Component({
  selector: 'app-titulo-tarjeta',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<p role="heading" aria-level="2" class="m-0 text-[1rem] font-bold text-foreground">{{ titulo }}</p>`
})
export class TituloTarjetaComponent {
  @Input({ required: true }) titulo!: string;
}
