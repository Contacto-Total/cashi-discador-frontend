import { ChangeDetectionStrategy, Component, ElementRef, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideAngularModule } from 'lucide-angular';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { TypificationService } from '../../../../../maintenance/services/typification.service';
import { PortfolioService } from '../../../../../maintenance/services/portfolio.service';
import { BotonDirective } from '../../../../../shared/ui/boton.directive';
import { PageHeaderComponent } from '../../../../../shared/ui/page-header.component';
import { PanelSubcarterasComponent, SubcarteraPanel } from '../../../../../shared/ui/panel-subcarteras.component';
import { TarjetaDirective } from '../../../../../shared/ui/tarjeta.directive';
import { NombrePropioPipe } from '../../../../../shared/ui/nombre-propio.pipe';

/**
 * Enlace público de cada reporte, por código de cliente y de cartera (los ids cambian entre ambientes).
 * Todas las subcarteras de una cartera abren el mismo reporte. Una cartera que no esté aquí no aparece.
 */
const ENLACES: Record<string, string> = {
  FOH_TR3: 'https://app.powerbi.com/view?r=eyJrIjoiOTNkNDYxOGEtNGQ1MS00MmQ0LTgwMjAtNmVkYzE4NjRhYTQzIiwidCI6IjVmZjNlMmE4LTJkYWUtNGY2MC04ZWE4LWFjZjE5NTQ0MzMyNSIsImMiOjR9',
  FOH_TR5: 'https://app.powerbi.com/view?r=eyJrIjoiYjAxNjIxYWUtNGQwYy00ZjMzLWJiNTQtMDcxNmQ4NTdmNjI2IiwidCI6IjVmZjNlMmE4LTJkYWUtNGY2MC04ZWE4LWFjZjE5NTQ0MzMyNSIsImMiOjR9',
  FOH_CAS: 'https://app.powerbi.com/view?r=eyJrIjoiMTAxY2MzNTgtMjVjMi00Mjg3LWE2NTYtMmI5OGU0N2QxM2YxIiwidCI6IjVmZjNlMmE4LTJkYWUtNGY2MC04ZWE4LWFjZjE5NTQ0MzMyNSIsImMiOjR9'
};

const clave = (cliente: string | undefined, cartera: string | undefined) => `${cliente ?? ''}_${cartera ?? ''}`.trim().toUpperCase();

/** Una subcartera con su cliente, su cartera y el reporte que le toca. */
interface Ambito {
  cliente: string;
  cartera: string;
  subId: number;
  subcartera: string;
  enlace: string;
}

/**
 * Reporte Power BI: el reporte publicado de la cartera elegida (Tramo 3, Tramo 5 o Castigo), cargado en la
 * pantalla. Se elige como en la ficha del cliente: cliente, cartera y subcartera arriba, o la subcartera en el
 * panel lateral. Cambiar de subcartera dentro de la misma cartera no vuelve a cargar el reporte.
 */
@Component({
  selector: 'app-powerbi-report',
  standalone: true,
  imports: [NgClass, LucideAngularModule, PageHeaderComponent, PanelSubcarterasComponent, TarjetaDirective, BotonDirective, NombrePropioPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './powerbi-report.component.html',
  host: { class: 'cashi-pantalla @container/pbi flex min-h-0 flex-1 flex-col gap-3' }
})
export class PowerbiReportComponent implements OnInit {
  private readonly clientesApi = inject(TypificationService);
  private readonly carterasApi = inject(PortfolioService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly visor = viewChild<ElementRef<HTMLElement>>('visor');

  readonly LISTA = 'font-cashi m-0! h-auto! w-full rounded-[.625rem]! border! border-(--campo-ln)! bg-(--campo)! px-2.5! py-2! text-[.875rem]! leading-[1.5]! text-ellipsis text-foreground! outline-none '
    + 'focus:border-ring! focus:shadow-[0_0_0_3px_rgb(16_185_129/.3)]!';
  readonly ETIQUETA = 'm-0! text-[.75rem]! leading-[1.5]! font-medium! text-foreground/80!';

  readonly cargando = signal(true);
  readonly error = signal<string | null>(null);
  readonly ambito = signal<Ambito[]>([]);
  readonly sub = signal<number | null>(null);
  /** Mientras el reporte elegido no termina de cargar en el visor. */
  readonly cargandoReporte = signal(true);

  readonly actual = computed(() => this.ambito().find(a => a.subId === this.sub()) ?? null);
  readonly clientes = computed(() => [...new Set(this.ambito().map(a => a.cliente))]);
  readonly carteras = computed(() => [...new Set(this.ambito().filter(a => a.cliente === this.actual()?.cliente).map(a => a.cartera))]);
  readonly deLaCartera = computed(() => this.ambito().filter(a => a.cliente === this.actual()?.cliente && a.cartera === this.actual()?.cartera));
  readonly panelSubs = computed<SubcarteraPanel[]>(() => this.ambito().map(a => ({ id: a.subId, cliente: a.cliente, cartera: a.cartera, subcartera: a.subcartera })));

  /** El enlace es un texto: mientras no cambie, el visor conserva el mismo reporte sin recargarlo. */
  readonly enlace = computed(() => this.actual()?.enlace ?? null);
  readonly reporte = computed<SafeResourceUrl | null>(() => {
    const enlace = this.enlace();
    return enlace ? this.sanitizer.bypassSecurityTrustResourceUrl(enlace) : null;
  });

  ngOnInit(): void {
    this.cargarAmbito();
  }

  /** Subcarteras activas de las carteras con reporte (la marca de la cartera no se mira: hay carteras en uso marcadas como inactivas). */
  cargarAmbito(): void {
    this.cargando.set(true);
    this.error.set(null);
    const activo = (v: unknown) => Number(v) !== 0;
    forkJoin({ clientes: this.clientesApi.getAllTenants(), subs: this.carterasApi.getAllSubPortfolios() }).pipe(
      switchMap(({ clientes, subs }) => {
        const activos = clientes.filter(c => activo(c.isActive));
        const carteras$ = activos.map(c => this.carterasApi.getPortfoliosByTenant(c.id).pipe(catchError(() => of([]))));
        return (carteras$.length ? forkJoin(carteras$) : of([])).pipe(map(porCliente => ({ activos, porCliente, subs })));
      })
    ).subscribe({
      next: ({ activos, porCliente, subs }) => {
        const ambito: Ambito[] = [];
        activos.forEach((c, i) => (porCliente[i] ?? []).forEach(p => {
          const enlace = ENLACES[clave(c.tenantCode, p.portfolioCode)];
          if (!enlace) return;
          subs.filter(s => s.portfolioId === p.id && activo(s.isActive))
            .forEach(s => ambito.push({ cliente: c.tenantName, cartera: p.portfolioName, subId: s.id, subcartera: s.subPortfolioName, enlace }));
        }));
        this.ambito.set(ambito);
        this.cargando.set(false);
        if (ambito.length) this.elegirSub(ambito[0].subId);
      },
      error: () => {
        this.error.set('No se pudieron cargar las subcarteras');
        this.cargando.set(false);
      }
    });
  }

  elegirCliente(cliente: string): void {
    const primera = this.ambito().find(a => a.cliente === cliente);
    if (primera) this.elegirSub(primera.subId);
  }

  elegirCartera(cartera: string): void {
    const primera = this.ambito().find(a => a.cliente === this.actual()?.cliente && a.cartera === cartera);
    if (primera) this.elegirSub(primera.subId);
  }

  elegirSub(id: number | string): void {
    const antes = this.enlace();
    this.sub.set(Number(id));
    if (this.enlace() !== antes) this.cargandoReporte.set(true);
  }

  async pantallaCompleta(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await this.visor()?.nativeElement.requestFullscreen();
    } catch {
      // El navegador puede negarla; el reporte sigue en la pantalla.
    }
  }
}
