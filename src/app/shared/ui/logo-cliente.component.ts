import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/** Logos de `src/assets/clientes/`, por el nombre del cliente normalizado (los ids cambian entre ambientes). */
const LOGOS: [string, string][] = [
  ['financieraoh', 'financiera-oh.svg'],
  ['interbank', 'interbank.svg'],
];

const normalizar = (nombre: string) => nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Logo del cliente en una baldosa cuadrada de 2rem. Todos los logos llevan la misma baldosa, cada uno con
 * su fondo de marca; un cliente sin logo lleva la baldosa en gris con el edificio. Es decorativo: el nombre
 * del cliente va siempre al lado.
 */
@Component({
  selector: 'app-logo-cliente',
  standalone: true,
  imports: [LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'grid size-8 flex-none place-items-center overflow-hidden rounded-lg bg-muted text-muted-foreground' },
  template: `
    @if (archivo(); as a) {
      <img [src]="'assets/clientes/' + a" alt="" class="block size-full max-w-none" />
    } @else {
      <lucide-angular name="building-2" [size]="16"></lucide-angular>
    }
  `
})
export class LogoClienteComponent {
  readonly cliente = input.required<string>();

  readonly archivo = computed(() => {
    const n = normalizar(this.cliente());
    return LOGOS.find(([clave]) => n.includes(clave))?.[1] ?? null;
  });
}
