import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { AsistenciaService } from './asistencia.service';
import { AvisoAsistencia } from './asistencia.models';

/** Cada minuto: es la resolución del aviso («empieza en 5 minutos») y no hace falta más. */
const CADA = 60_000;

/**
 * Los avisos de la jornada del asesor («Tu almuerzo empieza en 5 minutos»,
 * «Break registrado a las 10:26»), en cualquier pantalla de Cashi.
 *
 * Vive en el marco de la aplicación y no en Mi Asistencia porque el asesor pasa
 * el día en la pantalla de agente: un aviso que solo sale en Mi Asistencia no
 * lo ve nadie. Va arriba al centro porque las esquinas ya las ocupan el aviso de
 * WhatsApp, los mensajes de la app y la alerta de tiempo del agente.
 *
 * Solo para asesores: supervisores y administradores no fichan.
 */
@Component({
  selector: 'app-avisos-asistencia',
  standalone: true,
  imports: [LucideAngularModule],
  template: `
    @if (avisos().length) {
      <div class="pointer-events-none fixed left-1/2 top-4 z-[1300] flex w-[min(calc(100%-32px),380px)] -translate-x-1/2 flex-col gap-2">
        @for (a of avisos(); track a.titulo) {
          <div class="pointer-events-auto flex items-start gap-2.5 rounded-xl border px-3.5 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)]"
               [class]="a.tipo === 'aviso'
                 ? 'border-[#f3d9a4] bg-[#fef6e0] text-[#92400e] dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200'
                 : 'border-[#bfe3c8] bg-[#e8f5ec] text-[#166534] dark:border-green-900 dark:bg-green-950 dark:text-green-200'"
               role="status">
            <lucide-angular [name]="a.tipo === 'aviso' ? 'alert-triangle' : 'check-circle'"
                            [size]="16" class="mt-[1px] block shrink-0"></lucide-angular>
            <div class="min-w-0 flex-1">
              <strong class="block text-[12.5px] font-bold">{{ a.titulo }}</strong>
              <span class="block text-[11.5px]">{{ a.texto }}</span>
            </div>
            <button type="button" class="shrink-0 opacity-60 hover:opacity-100"
                    (click)="descartar(a)" aria-label="Cerrar aviso">
              <lucide-angular name="x" [size]="14" class="block"></lucide-angular>
            </button>
          </div>
        }
      </div>
    }
  `
})
export class AvisosAsistenciaComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly servicio = inject(AsistenciaService);
  private readonly destroyRef = inject(DestroyRef);

  readonly avisos = signal<AvisoAsistencia[]>([]);
  /** Los que ya cerró: no vuelven a salir en el siguiente sondeo. */
  private readonly descartados = new Set<string>();
  private reloj?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    // Arranca al entrar un asesor y se apaga al salir: el mismo navegador
    // puede pasar de un asesor a una supervisora sin recargar.
    this.auth.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(usuario => {
        this.detener();
        if (usuario && usuario.role === 'AGENT') {
          this.cargar();
          this.reloj = setInterval(() => this.cargar(), CADA);
        }
      });
    this.destroyRef.onDestroy(() => this.detener());
  }

  /** Cerrar un aviso lo silencia hasta que cambie: no vuelve cada minuto. */
  descartar(aviso: AvisoAsistencia): void {
    this.descartados.add(aviso.titulo);
    this.avisos.update(lista => lista.filter(a => a !== aviso));
  }

  private cargar(): void {
    if (!this.auth.isAuthenticated()) {
      return;
    }
    this.servicio.misAvisos().subscribe({
      next: a => this.avisos.set(a.filter(x => !this.descartados.has(x.titulo))),
      error: () => { /* un aviso que no llega no rompe ninguna pantalla */ }
    });
  }

  private detener(): void {
    clearInterval(this.reloj);
    this.reloj = undefined;
    this.avisos.set([]);
    this.descartados.clear();
  }
}
