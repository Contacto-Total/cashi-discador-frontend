import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CAMPO, ETIQUETA } from '../../../asistencia/ui/clases';
import { Llamada, Rubrica } from './monitoreo.models';
import { rubricaEnFrase } from './monitoreo.calculos';

/** «PROMESA DE PAGO» → «Promesa de pago». */
export const oracion = (t: string | null | undefined): string => {
  const s = (t ?? '').trim().toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/** Rótulo del grupo de resultados: la rúbrica en FOH; en Interbank, el tipo de contacto (efectivo o tercero relacionado). */
export const GRUPO_RESULTADO: Record<Rubrica, string> = { PDP: 'PDP', CD: 'CD', TIT: 'CE', TER: 'TR' };
/** Orden de los resultados que evalúa el speech; los que no estén aquí van al final. */
const ORDEN_RESULTADO = ['PROMESA DE PAGO', 'REFINANCIAMIENTO', 'OPORTUNIDAD DE PAGO', 'CONTACTO CON TITULAR O ENCARGADO', 'CON INTENCIÓN',
  'SIN INTENCION', 'SIN INTENCIÓN', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - CON DESCUENTO', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - SIN DESCUENTO',
  'TERCERO INFORMARÁ A TITULAR', 'TERCERO CONOCE AL TITULAR - BRINDA NUEVOS DATOS'];
/** Texto corto de un resultado largo de Interbank. */
const CORTO: Record<string, string> = {
  'TITULAR PAGARÁ CON FRACCIONAMIENTO - CON DESCUENTO': 'Fraccionamiento con descuento',
  'TITULAR PAGARÁ CON FRACCIONAMIENTO - SIN DESCUENTO': 'Fraccionamiento sin descuento'
};
export const textoResultado = (r: string): string => CORTO[r.toUpperCase()] ?? oracion(r);
/** Los resultados que evalúa el speech de Interbank (clientes/ibk/seleccion.py): se ofrecen siempre, haya o no llamadas. */
const CATALOGO_IBK: [Rubrica, string[]][] = [
  ['TIT', ['PROMESA DE PAGO', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - CON DESCUENTO', 'TITULAR PAGARÁ CON FRACCIONAMIENTO - SIN DESCUENTO']],
  ['TER', ['TERCERO INFORMARÁ A TITULAR', 'TERCERO CONOCE AL TITULAR - BRINDA NUEVOS DATOS']]
];
/** Una gestión multiproducto trae varios resultados unidos por « / ». */
export const partes = (nivel2: string | null): string[] => (nivel2 ?? '').split(' / ').map(x => x.trim().toUpperCase()).filter(Boolean);

/** Un grupo del filtro: los resultados de una rúbrica, con su rótulo (CE / TR en Interbank, PDP / CD en FOH). */
export interface GrupoResultado { rubrica: Rubrica; nombre: string; resultados: string[]; }

/**
 * Los grupos del filtro de Resultado: en Interbank su catálogo, siempre; además, los resultados de las llamadas
 * cargadas y el elegido, para que no desaparezca mientras se mira un rango donde no hay llamadas con él.
 */
export function gruposResultado(llamadas: Llamada[], esIbk: boolean, elegido = '', rubricaElegido: Rubrica | null = null): GrupoResultado[] {
  const por = new Map<Rubrica, Set<string>>();
  if (esIbk) CATALOGO_IBK.forEach(([r, rs]) => por.set(r, new Set(rs)));
  for (const l of llamadas) {
    if (!por.has(l.rubrica)) por.set(l.rubrica, new Set());
    partes(l.nivel2).forEach(x => por.get(l.rubrica)!.add(x));
  }
  if (elegido && rubricaElegido && ![...por.values()].some(s => s.has(elegido))) {
    if (!por.has(rubricaElegido)) por.set(rubricaElegido, new Set());
    por.get(rubricaElegido)!.add(elegido);
  }
  const lugar = (x: string): number => { const i = ORDEN_RESULTADO.indexOf(x); return i < 0 ? 99 : i; };
  const orden: Rubrica[] = ['PDP', 'CD', 'TIT', 'TER'];
  return orden.filter(r => por.get(r)?.size).map(r => ({ rubrica: r, nombre: GRUPO_RESULTADO[r],
    resultados: [...por.get(r)!].sort((a, b) => lugar(a) - lugar(b) || a.localeCompare(b)) }));
}

/** La rúbrica a la que pertenece un resultado según los grupos, o null. */
export const rubricaDeResultado = (grupos: GrupoResultado[], r: string): Rubrica | null => grupos.find(g => g.resultados.includes(r))?.rubrica ?? null;

/**
 * El filtro de Resultado, agrupado por rúbrica: lo usan la lista de llamadas y el seguimiento por día. En el
 * seguimiento (conRubrica) reemplaza al selector de rúbrica: el rótulo de cada grupo elige la rúbrica entera y queda
 * en verde la que muestra la matriz. En la lista el rótulo es solo texto.
 */
@Component({
  selector: 'app-resultado-filtro',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  template: `
    <div [class]="CAMPO + ' mb-[.875rem]'">
      <span [class]="ETIQUETA">Resultado</span>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
        @for (g of grupos(); track g.rubrica) {
          <div class="inline-flex min-h-[2.375rem] flex-wrap items-center gap-1 rounded-[.625rem] bg-muted p-[.1875rem]">
            @if (conRubrica()) {
              <button type="button" [class]="ROTULO" [attr.aria-pressed]="rubrica() === g.rubrica" [title]="'Todas las llamadas de ' + enFrase(g.rubrica)"
                      (click)="elegirRubrica.emit(g.rubrica)">{{ g.nombre }}</button>
            } @else {
              <span class="pr-2 pl-[.4375rem] text-[.75rem] font-semibold text-muted-foreground">{{ g.nombre }}</span>
            }
            @for (r of g.resultados; track r) {
              <button type="button" [class]="CHIP" [attr.aria-pressed]="valor() === r" (click)="elegir.emit(r)">{{ texto(r) }}</button>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class ResultadoFiltroComponent {
  readonly grupos = input.required<GrupoResultado[]>();
  readonly valor = input('');
  /** El resultado pulsado; quien lo usa decide si lo elige o lo suelta. */
  readonly elegir = output<string>();
  /** Con rótulos que eligen la rúbrica entera (seguimiento por día). */
  readonly conRubrica = input(false);
  readonly rubrica = input<Rubrica | null>(null);
  readonly elegirRubrica = output<Rubrica>();

  protected readonly CAMPO = CAMPO; protected readonly ETIQUETA = ETIQUETA; protected readonly texto = textoResultado;
  protected readonly enFrase = rubricaEnFrase;
  /** Rótulo pulsable: el mismo texto gris del grupo; el de la rúbrica a la vista, en verde. */
  protected readonly ROTULO = 'h-8 cursor-pointer rounded-[.4375rem] border-0 bg-transparent pr-2 pl-[.4375rem] [font-family:inherit] text-[.75rem] font-semibold '
    + 'text-muted-foreground transition-colors duration-150 hover:text-foreground aria-pressed:text-(--verde-txt)! '
    + 'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--verde-txt)';
  /** Chip de resultado: blanco sobre la cápsula gris; elegido, en verde. */
  protected readonly CHIP = 'h-8 cursor-pointer rounded-[.4375rem] border border-solid border-transparent bg-card px-[.875rem] [font-family:inherit] text-[.8125rem] font-medium text-(--ink2) '
    + 'shadow-[0_1px_2px_rgb(0_0_0/.05)] transition-[background-color,border-color,color] duration-150 '
    + 'hover:border-[color-mix(in_oklab,var(--verde-txt)_30%,var(--border))] hover:bg-[color-mix(in_oklab,var(--verde-txt)_6%,var(--card))] hover:text-foreground '
    + 'aria-pressed:border-(--verde-txt)! aria-pressed:bg-(--ok-bg)! aria-pressed:font-semibold aria-pressed:text-(--verde-txt)!';
}
