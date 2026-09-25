import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Iconos de trazo fino (1.5) del módulo de comisiones.
 * Decorativos por defecto (aria-hidden); el texto del botón o su aria-label da el significado.
 */
const TRAZOS: Record<string, string[]> = {
  'chevron-left': ['M15 18l-6-6 6-6'],
  'chevron-right': ['M9 18l6-6-6-6'],
  'arrow-left': ['M19 12H5', 'M11 18l-6-6 6-6'],
  'arrow-up-right': ['M7 17L17 7', 'M8 7h9v9'],
  plus: ['M12 5v14', 'M5 12h14'],
  x: ['M6 6l12 12', 'M18 6L6 18'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  calculator: ['M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z', 'M8 7h8', 'M8.5 12h.01', 'M12 12h.01', 'M15.5 12h.01', 'M8.5 16h.01', 'M12 16h.01', 'M15.5 16h.01'],
  lock: ['M7 11V8a5 5 0 0110 0v3', 'M5.5 11h13v9.5h-13z'],
  unlock: ['M7 11V8a5 5 0 019.6-2', 'M5.5 11h13v9.5h-13z'],
  download: ['M12 4v11', 'M7.5 10.5L12 15l4.5-4.5', 'M5 19.5h14'],
  trash: ['M4.5 7h15', 'M9.5 7V4.5h5V7', 'M6.5 7l1 13h9l1-13'],
  users: ['M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5', 'M16 4.3a3.5 3.5 0 010 6.4', 'M18 14.8c1.6.8 2.7 2.6 3 5.2'],
  sliders: ['M4 7h10', 'M18 7h2', 'M16 5v4', 'M4 17h4', 'M12 17h8', 'M10 15v4'],
  receipt: ['M6 3h12v18l-3-2-3 2-3-2-3 2z', 'M9 8h6', 'M9 12h6'],
  history: ['M3.5 12a8.5 8.5 0 102.6-6.1', 'M3 4v4h4', 'M12 8v4.5l3 2'],
  alert: ['M12 4l9 16H3z', 'M12 10v4', 'M12 17h.01'],
  info: ['M12 21a9 9 0 100-18 9 9 0 000 18z', 'M12 11v5', 'M12 8h.01'],
  search: ['M11 18a7 7 0 100-14 7 7 0 000 14z', 'M20 20l-4-4'],
  refresh: ['M20 11a8 8 0 10-2.3 5.7', 'M20 5v6h-6'],
  eye: ['M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z', 'M12 15a3 3 0 100-6 3 3 0 000 6z'],
  'user-minus': ['M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5', 'M16 11h5'],
  'user-plus': ['M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7z', 'M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5', 'M18.5 8.5v5', 'M16 11h5'],
  layers: ['M12 3l9 5-9 5-9-5z', 'M3 13l9 5 9-5'],
  calendar: ['M5 5h14v15H5z', 'M5 10h14', 'M9 3v4', 'M15 3v4'],
  send: ['M4 12l16-8-6 16-2.5-6.5z', 'M11.5 13.5L20 4']
};

@Component({
  selector: 'cmx-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round"
         aria-hidden="true" focusable="false">
      @for (d of trazos(); track $index) {
        <path [attr.d]="d" />
      }
    </svg>
  `,
  host: { class: 'inline-flex shrink-0' }
})
export class CmxIconComponent {
  readonly name = input.required<string>();
  readonly size = input<number>(18);
  readonly stroke = input<number>(1.5);

  readonly trazos = computed(() => TRAZOS[this.name()] ?? []);
}
