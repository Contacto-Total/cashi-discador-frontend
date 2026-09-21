import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

const CLAVE = 'cashi.equipo.pase';

export interface ResultadoAcceso {
  permitido: boolean;
  motivo?: string;
  mensaje?: string;
}

/**
 * El pase de esta computadora.
 *
 * Es un valor que se genera una vez y se guarda en el navegador. NO es un pase
 * instalado en la máquina: quien copie el `localStorage` de un equipo
 * autorizado entra desde otro. Sirve para el caso real —que alguien abra Cashi
 * desde su casa en una máquina que nadie registró— y deja el rastro del intento,
 * pero no aguanta a quien quiera saltárselo a propósito. Para eso hace falta un
 * pase instalado de verdad, firmado fuera del navegador.
 *
 * Se borra si se limpia el navegador, y entonces el equipo pide registro otra
 * vez: es el precio de no tener agente instalado.
 */
@Injectable({ providedIn: 'root' })
export class EquipoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/asistencia/acceso`;

  /** El pase de esta máquina; lo crea la primera vez. */
  pase(): string {
    let valor = '';
    try {
      valor = localStorage.getItem(CLAVE) ?? '';
      if (!valor) {
        valor = this.generar();
        localStorage.setItem(CLAVE, valor);
      }
    } catch {
      // En navegación privada o con el almacenamiento bloqueado no hay pase
      // estable. Se devuelve uno de esta sesión: el acceso se rechazará y
      // quedará registrado, que es justo lo que tiene que pasar.
      valor = valor || this.generar();
    }
    return valor;
  }

  /** Lo que se le enseña a quien registra el equipo, para que lo copie. */
  paseVisible(): string {
    return this.pase();
  }

  /**
   * Le pregunta al backend si esta máquina puede entrar. Se llama al iniciar
   * sesión; si dice que no, queda registrado el intento.
   */
  validar(): Observable<ResultadoAcceso> {
    return this.http.post<ResultadoAcceso>(`${this.url}/validar`, {
      huella: this.pase(),
      dispositivo: this.dispositivo()
    });
  }

  /** Lo que se puede decir del equipo sin identificar a nadie. */
  private dispositivo(): string {
    const agente = navigator.userAgent;
    if (/Android/i.test(agente)) {
      return 'Android';
    }
    if (/iPhone|iPad/i.test(agente)) {
      return 'iPhone';
    }
    if (/Mac OS X/i.test(agente)) {
      return 'Mac';
    }
    if (/Windows/i.test(agente)) {
      return 'Windows';
    }
    if (/Linux/i.test(agente)) {
      return 'Linux';
    }
    return 'Desconocido';
  }

  private generar(): string {
    if (crypto?.randomUUID) {
      return crypto.randomUUID();
    }
    // Navegadores viejos: sirve igual, el valor solo tiene que ser único.
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
  }
}
