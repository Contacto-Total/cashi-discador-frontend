import { Pipe, PipeTransform } from '@angular/core';

/** Siglas que nunca son palabra: se quedan en mayúsculas en los dos modos. */
const SIGLAS = new Set([
  'IBK', 'FOH', 'SIP', 'BCP', 'BBVA', 'SBS', 'DNI', 'RUC', 'PDP', 'MN', 'AMD', 'SMS', 'WSP', 'IVR', 'PYME', 'RDNP', 'FEN'
]);
/** Siglas que en una frase pueden ser palabra («NO ME INTERESA»): solo se respetan en nombres de entidad. */
const SIGLAS_SOLO_TITULO = new Set(['ME', 'CE', 'TC']);
/** Conectores que en tipo título van en minúscula, salvo al inicio. */
const CONECTORES = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'u', 'en', 'por', 'con', 'sin', 'a', 'al']);

/**
 * Muestra un nombre que llega todo en mayúsculas desde la base: en tipo título para clientes, carteras y
 * subcarteras («INTERBANK» → «Interbank») y en tipo oración para frases como las tipificaciones
 * («TITULAR CORTA LLAMADA» → «Titular corta llamada»). Respeta las siglas y las palabras con números, y deja
 * igual un texto que ya trae minúsculas. No repone tildes que el dato no trae. No se usa en códigos
 * («NA», «CCL»): esos se muestran tal cual.
 *
 * Solo para pintar: nunca en `[value]`, comparaciones ni lo que va al backend, porque los nombres se cruzan
 * tal cual entre ambientes y en los reportes.
 */
@Pipe({ name: 'nombrePropio', standalone: true })
export class NombrePropioPipe implements PipeTransform {
  transform(valor: string | null | undefined, modo: 'titulo' | 'oracion' = 'titulo'): string {
    if (!valor || /\p{Ll}/u.test(valor)) {
      return valor ?? '';
    }
    let primera = true;
    return valor.replace(/[\p{L}\p{N}]+/gu, palabra => {
      const esPrimera = primera;
      primera = false;
      if (SIGLAS.has(palabra) || (modo === 'titulo' && SIGLAS_SOLO_TITULO.has(palabra)) || /\d/.test(palabra)
          || (modo === 'titulo' && palabra.length === 1 && !CONECTORES.has(palabra.toLocaleLowerCase('es')))) {
        return palabra;
      }
      const minuscula = palabra.toLocaleLowerCase('es');
      if (esPrimera || (modo === 'titulo' && !CONECTORES.has(minuscula))) {
        return minuscula.charAt(0).toLocaleUpperCase('es') + minuscula.slice(1);
      }
      return minuscula;
    });
  }
}
