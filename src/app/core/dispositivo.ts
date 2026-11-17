/**
 * Cashi solo se usa desde una computadora o una laptop, salvo los usuarios que
 * el gateway y el discador tienen en `cashi.acceso.movil-usuarios`, que entran
 * desde cualquier equipo. Como el front no sabe quién es hasta el login, en un
 * celular la aplicación carga y decide el servidor: al login (o a cualquier
 * petición) de otro usuario responde 403 «Dispositivo no permitido», y entonces
 * se marca la pestaña y se pinta el aviso en lugar de la aplicación.
 *
 * Además del User-Agent se mira lo que un celular no puede esconder cambiando
 * a «modo PC»: la pantalla táctil sin puntero fino. Y el iPad, que desde
 * iPadOS 13 se presenta como una Mac. Eso el servidor no lo ve, así que el
 * front se lo dice con la cabecera X-Cashi-Dispositivo: movil.
 */
import { MASCOTA_CSS, mascotaHtml } from './mascota-cashi';
import { environment } from '../../environments/environment';

const MOVIL = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|BlackBerry|Opera Mini|IEMobile|webOS/i;

/** Pantalla táctil sin puntero fino: un iPad que dice ser Mac o un celular en «modo PC». */
function esTactil(): boolean {
  return (/Macintosh/i.test(navigator.userAgent || '') && navigator.maxTouchPoints > 1)
    || !!window.matchMedia?.('(hover: none) and (pointer: coarse)').matches;
}

/** Marca de la pestaña: el servidor rechazó este equipo para el usuario que intentó entrar. */
const RECHAZO_KEY = 'cashi_dispositivo_rechazado';

/** Cabecera con la que el front avisa que es un celular o tablet aunque el User-Agent diga computadora. */
export const CABECERA_DISPOSITIVO = 'X-Cashi-Dispositivo';

/** La respuesta 403 del gateway o del discador a un equipo no permitido. */
export function esRechazoDeDispositivo(status: number, cuerpo: unknown): boolean {
  const error = (cuerpo as { error?: unknown } | null)?.error;
  return status === 403 && typeof error === 'string' && error.startsWith('Dispositivo no permitido');
}

/** El servidor rechazó el equipo: se marca la pestaña y se recarga para pintar el aviso sin Angular. */
export function marcarDispositivoRechazado(usuario: string | null): void {
  try {
    sessionStorage.setItem(RECHAZO_KEY, JSON.stringify({ usuario }));
  } catch {
    // Sin sessionStorage no hay marca: se pinta igual, sin recargar.
    pintarDispositivoNoPermitido();
    return;
  }
  location.reload();
}

export function dispositivoRechazado(): boolean {
  try {
    return sessionStorage.getItem(RECHAZO_KEY) !== null;
  } catch {
    return false;
  }
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
 * el que intentó entrar o, si no, el último que entró desde este navegador. El
 * modelo y el navegador los lee el backend del User-Agent. Si falla, no pasa nada.
 */
function registrarRechazo(): void {
  let usuario: string | null = null;
  try {
    usuario = JSON.parse(sessionStorage.getItem(RECHAZO_KEY) ?? 'null')?.usuario
      ?? JSON.parse(sessionStorage.getItem('callcenter_user') ?? 'null')?.username
      ?? null;
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
        <button type="button" id="cashi-otro-usuario"
                style="margin-top:20px;padding:0;border:0;background:none;font:inherit;font-size:13px;
                       color:#5f6c80;text-decoration:underline;cursor:pointer">
          Entrar con otro usuario
        </button>
      </div>
    </main>`;
  // Sin la marca ni la sesión de la pestaña, la aplicación vuelve a cargar en el login.
  document.getElementById('cashi-otro-usuario')?.addEventListener('click', () => {
    try {
      sessionStorage.clear();
    } catch {
      // Nada que limpiar.
    }
    location.reload();
  });
}
