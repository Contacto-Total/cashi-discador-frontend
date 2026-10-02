import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
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
 * lo ve nadie. Van arriba a la derecha, con fondo blanco y el color del caso
 * solo en el borde y el icono. No salen en la pantalla de gestion, para no
 * tapar la tipificacion: aparecen al salir de ella.
 *
 * Solo para asesores: supervisores y administradores no fichan.
 */
@Component({
  selector: 'app-avisos-asistencia',
  standalone: true,
  imports: [LucideAngularModule],
  styles: [`
    .noti { animation: entra-noti .3s ease; }
    @keyframes entra-noti { from { transform: translateX(400px); opacity: 0; } to { transform: none; opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .noti { animation: none; } }
  `],
  template: `
    @if (!enGestion() && avisos().length) {
      <div class="pointer-events-none fixed right-5 top-4 z-[1300] flex w-[min(400px,calc(100vw-40px))] flex-col gap-3 font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif]">
        @for (a of avisos(); track a.titulo) {
          <div [class]="tarjeta + (a.tipo === 'aviso' ? ' border-[#f59e0b]' : ' border-[#10b981]')" role="status">
            <lucide-angular [name]="a.tipo === 'aviso' ? 'alert-triangle' : 'check-circle'" [size]="18"
                            class="mt-[1px] block shrink-0"
                            [class]="a.tipo === 'aviso' ? 'text-[#f59e0b]' : 'text-[#10b981]'"></lucide-angular>
            <div class="min-w-0 flex-1">
              <strong [class]="titulo">{{ a.titulo }}</strong>
              <span [class]="detalle">{{ a.texto }}</span>
            </div>
            <button type="button" [class]="cerrar" (click)="descartar(a)" aria-label="Cerrar aviso">
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
  private readonly router = inject(Router);

  protected readonly tarjeta = 'noti pointer-events-auto flex items-start gap-2.5 rounded-lg border bg-white py-3.5 pl-4 pr-3 text-[13px] leading-[1.45] shadow-[0_4px_12px_rgba(15,23,42,0.12)] dark:bg-slate-900';
  protected readonly titulo = 'block font-bold !text-[#0f172a] dark:!text-slate-100';
  protected readonly detalle = 'mt-0.5 block text-[12px] !text-[#5f6c80] dark:!text-slate-400';
  protected readonly cerrar = 'shrink-0 rounded p-[3px] leading-none !text-[#8491a3] hover:bg-[#f4f6f9] hover:!text-[#0f172a] dark:hover:bg-slate-800 dark:hover:!text-slate-100';

  /** En la pantalla de gestion no se muestra nada: taparia la tipificacion. */
  readonly enGestion = signal(false);

  readonly avisos = signal<AvisoAsistencia[]>([]);
  /** Los que ya cerró: no vuelven a salir en el siguiente sondeo. */
  private readonly descartados = new Set<string>();
  private reloj?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.enGestion.set(this.router.url.startsWith('/collection-management'));
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.enGestion.set(this.router.url.startsWith('/collection-management')));

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
