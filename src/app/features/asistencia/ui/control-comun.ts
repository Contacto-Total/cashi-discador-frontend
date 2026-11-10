import { Observable } from 'rxjs';

/** Descarga el Excel del reporte: lo arma el backend, con el formato de la hoja que RR.HH. ya lee. */
export function bajarExcel(excel$: Observable<Blob>, nombre: string, alFallar: () => void): void {
  excel$.subscribe({
    next: blob => {
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = url;
      enlace.download = nombre;
      enlace.click();
      URL.revokeObjectURL(url);
    },
    error: alFallar
  });
}

/** «2 al 7 de noviembre» o «27 de octubre al 1 de noviembre»: de lunes a sábado. */
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export function rangoSemana(lunes: string, sumar: (f: string, n: number) => string): string {
  const a = new Date(lunes + 'T00:00:00'), b = new Date(sumar(lunes, 5) + 'T00:00:00');
  return a.getMonth() === b.getMonth()
    ? `${a.getDate()} al ${b.getDate()} de ${MESES[b.getMonth()]}`
    : `${a.getDate()} de ${MESES[a.getMonth()]} al ${b.getDate()} de ${MESES[b.getMonth()]}`;
}

/** Botón secundario de la pantalla (el «btn sec» del molde) con la letra y el alto de los campos. */
export const BOTON_SEC = 'dark:bg-muted dark:hover:bg-border';
/** Deshabilitado como en el molde: gris, sin el degradado ni la transparencia del botón común. */
export const BOTON_APAGADO = 'disabled:[background-image:none]! disabled:bg-muted! disabled:text-muted-foreground! disabled:opacity-100! disabled:border-transparent!';
