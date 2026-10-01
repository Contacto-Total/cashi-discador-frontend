import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * El equipo con que se entra a Cashi.
 *
 * Solo entran computadoras y laptops: al iniciar sesión se deja el sistema de
 * la máquina (lo lee el backend del User-Agent), y de ahí sale «Equipos
 * permitidos» en Control de Acceso.
 */
@Injectable({ providedIn: 'root' })
export class EquipoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/asistencia/acceso`;

  registrarIngreso(): Observable<void> {
    return this.http.post<void>(`${this.url}/ingreso`, {});
  }
}
