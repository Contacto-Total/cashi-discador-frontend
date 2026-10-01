/**
 * Cashi solo se abre desde una computadora o una laptop. Celulares, tablets y
 * lo demás quedan fuera. El backend y el gateway rechazan lo mismo por el
 * User-Agent; esto evita que la aplicación siquiera cargue.
 *
 * Además del User-Agent se mira lo que un celular no puede esconder cambiando
 * a «modo PC»: la pantalla táctil sin puntero fino. Y el iPad, que desde
 * iPadOS 13 se presenta como una Mac.
 */
import { MASCOTA_CSS, mascotaHtml } from './mascota-cashi';
import { environment } from '../../environments/environment';

const MOVIL = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|BlackBerry|Opera Mini|IEMobile|webOS/i;

/** Pantalla táctil sin puntero fino: un iPad que dice ser Mac o un celular en «modo PC». */
function esTactil(): boolean {
  return (/Macintosh/i.test(navigator.userAgent || '') && navigator.maxTouchPoints > 1)
    || !!window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
}

export function esDispositivoPermitido(): boolean {
  const ua = navigator.userAgent || '';
  if (MOVIL.test(ua)) {
    return false;
  }
  // El iPad con iPadOS dice «Macintosh», pero una Mac no tiene pantalla táctil.
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) {
    return false;
  }
  // Chromium lo dice directo, aunque se pida la versión de escritorio.
  if ((navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData?.mobile === true) {
    return false;
  }
  // Un celular o tablet en «modo PC»: su entrada principal sigue siendo el dedo.
  // Una laptop táctil tiene touchpad o mouse, así que no cae aquí.
  if (window.matchMedia?.('(hover: none) and (pointer: coarse)').matches) {
    return false;
  }
  return true;
}

/**
 * Deja constancia del intento en Control de Acceso. Sin sesión: el usuario es
 * el último que entró desde este navegador, si alguno entró. El modelo y el
 * navegador los lee el backend del User-Agent. Si falla, no pasa nada.
 */
function registrarRechazo(): void {
  let usuario: string | null = null;
  try {
    usuario = JSON.parse(localStorage.getItem('callcenter_user') ?? 'null')?.username ?? null;
  } catch {
    usuario = null;
  }
  fetch(`${environment.apiUrl}/asistencia/acceso/rechazo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, tactil: esTactil() }),
    keepalive: true
  }).catch(() => undefined);
}

/** En lugar de la aplicación, el aviso con la mascota de Cashi: sin Angular, sin estilos de la app. */
export function pintarDispositivoNoPermitido(): void {
  registrarRechazo();
  document.title = 'Cashi · Dispositivo no permitido';
  // El iPhone pinta la franja de la hora y la de la barra de Safari con el fondo
  // de html/body (blanco en la app), no con el del <main>: sin esto se ve cortado.
  document.documentElement.style.background = '#f6f7f9';
  document.body.style.background = '#f6f7f9';
  document.body.innerHTML = `
    <style>${MASCOTA_CSS}</style>
    <main style="min-height:100vh;min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px;
                 font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;background:#f6f7f9;color:#0f172a">
      <div style="max-width:420px;text-align:center">
        <div style="margin:0 auto 26px">${mascotaHtml('Dispositivo no permitido')}</div>
        <h1 style="margin:0 0 8px;font-size:20px;font-weight:800">Cashi solo se abre desde una computadora</h1>
        <p style="margin:0;font-size:14px;line-height:1.5;color:#5f6c80">
          Por seguridad, el sistema solo funciona en computadoras y laptops.
          Desde un celular o una tablet no se puede entrar.
        </p>
      </div>
    </main>`;
}
