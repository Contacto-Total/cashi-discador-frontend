import { Injectable, computed, signal } from '@angular/core';
import { Llamada, Rubrica } from './monitoreo.models';

const iso = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const hoyIso = (): string => iso(new Date());
const primeroDelMes = (): string => hoyIso().slice(0, 8) + '01';

/** Esta semana (lunes a hoy) y la anterior (lunes a domingo). */
export function rangosSemana(): Record<'semana' | 'anterior', [string, string]> {
  const hoy = new Date();
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7));
  const mas = (d: Date, n: number): string => { const x = new Date(d); x.setDate(x.getDate() + n); return iso(x); };
  return { semana: [iso(lunes), iso(hoy)], anterior: [mas(lunes, -7), mas(lunes, -1)] };
}

export type FiltroEstado = '' | 'revisar' | 'falta' | 'revisadas';

/**
 * Lo que la pestaña Monitoreo recuerda mientras se va y vuelve de la revisión de una llamada o del
 * rendimiento: el ámbito, los filtros, la página y la última llamada abierta.
 */
@Injectable({ providedIn: 'root' })
export class MonitoreoEstado {
  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly pestana = signal<'grabaciones' | 'monitoreo'>('grabaciones');

  readonly desde = signal(primeroDelMes());
  readonly hasta = signal(hoyIso());
  readonly asesor = signal('');
  readonly q = signal('');
  readonly filtro = signal<FiltroEstado>('');
  readonly resultado = signal('');
  readonly pagina = signal(1);
  readonly ultima = signal<number | null>(null);
  /** El lunes y la rúbrica que mira el seguimiento por día; null = la última semana con llamadas. */
  readonly semana = signal<string | null>(null);
  readonly rubricaSeguimiento = signal<Rubrica | null>(null);
  /** La rúbrica del seguimiento antes de elegir un resultado (null = la de más llamadas), para volver a ella al soltarlo. */
  private rubricaAntes: { rubrica: Rubrica | null } | null = null;

  /**
   * Elegir o soltar un resultado, desde la lista o el seguimiento. El seguimiento pasa a la rúbrica de ese resultado;
   * al soltarlo vuelve a la que tenía antes de elegir el primero.
   */
  elegirResultado(r: string, rubricaDe: (r: string) => Rubrica | null): void {
    const antes = this.resultado(), nuevo = antes === r ? '' : r;
    if (nuevo && !antes) this.rubricaAntes = { rubrica: this.rubricaSeguimiento() };
    this.resultado.set(nuevo); this.pagina.set(1);
    if (nuevo) {
      const rub = rubricaDe(nuevo);
      if (rub) this.rubricaSeguimiento.set(rub);
    } else if (this.rubricaAntes) {
      this.rubricaSeguimiento.set(this.rubricaAntes.rubrica);
      this.rubricaAntes = null;
    }
  }
  /** La rúbrica elegida a mano en el seguimiento: ya no se vuelve a la anterior. */
  elegirRubrica(r: Rubrica): void { this.rubricaSeguimiento.set(r); this.rubricaAntes = null; }

  /** Las llamadas del ámbito y las fechas pedidas, y la llave con que se pidieron. */
  readonly llamadas = signal<Llamada[]>([]);
  readonly llave = signal('');

  /** Lo que ve la lista, en orden: sirve también a la revisión para «anterior» y «siguiente». */
  readonly visibles = signal<Llamada[]>([]);

  readonly periodo = computed(() => {
    const r = rangosSemana();
    if (this.desde() === r.semana[0] && this.hasta() === r.semana[1]) return 'semana';
    if (this.desde() === r.anterior[0] && this.hasta() === r.anterior[1]) return 'anterior';
    return '';
  });

  /** Al cambiar el ámbito se olvidan los filtros que dependen de él. */
  cambiarAmbito(): void {
    this.asesor.set('');
    this.resultado.set('');
    this.filtro.set('');
    this.pagina.set(1);
    this.llamadas.set([]);
    this.llave.set('');
    this.semana.set(null);
    this.rubricaSeguimiento.set(null);
    this.rubricaAntes = null;
  }
}
