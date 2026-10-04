import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Cashi, la mascota. El dibujo está en `cashi-ui.css` (bloque MASCOTA); aquí solo va el marcado.
 * `plana` la deja quieta y sin sombras, para tamaños chicos como la marca del menú lateral.
 */
@Component({
  selector: 'app-cashi-mascota',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="cashi-mascota grid flex-none place-items-center" [style.width.px]="110 * escala" [style.height.px]="100 * escala" aria-hidden="true">
      <div [style.transform]="'translateY(' + 18 * escala + 'px)'">
        <div class="mascot-container" [class.mascot-plano]="plana" [style.--mascot-scale]="escala" [style.animation]="plana ? 'none' : null">
          <div class="mascot-figure" [style.animation]="plana ? 'none' : null">
            <div class="mascot-body">
              <div class="mascot-antenna"></div>
              <div class="mascot-head">
                <div class="mascot-eyes" style="--pupil-x:0px;--pupil-y:0px">
                  <div class="eye left-eye"><div class="pupil"></div></div>
                  <div class="eye right-eye"><div class="pupil"></div></div>
                </div>
                <div class="mascot-mouth"></div>
              </div>
              <svg class="mascot-headset" viewBox="0 0 100 100" fill="none">
                <path d="M10.5 46L10.5 20A20.5 20.5 0 0 1 30 -0.5L70 -0.5A20.5 20.5 0 0 1 89.5 20L89.5 46" stroke="#10b981" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M96 50Q91 72 67 65" stroke="#10b981" stroke-width="3.5" stroke-linecap="round"/>
                <circle cx="67" cy="65" r="4" fill="#059669"/>
                <rect x="-5" y="28" width="22" height="24" rx="8" fill="#10b981"/>
                <rect x="83" y="28" width="22" height="24" rx="8" fill="#10b981"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CashiMascotaComponent {
  @Input() escala = 1;
  @Input() plana = false;
}
