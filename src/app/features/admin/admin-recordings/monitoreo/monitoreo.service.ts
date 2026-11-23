import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Cierre, Ficha, Llamada, Rendimiento, Transcripcion, Seguimiento } from './monitoreo.models';

/** La pestaña Monitoreo de Grabaciones Discador: lista, revisión, rendimiento, audio y transcripción. */
@Injectable({ providedIn: 'root' })
export class MonitoreoService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl + '/discador/monitoreo';

  /** Las llamadas evaluadas de una subcartera entre dos fechas incluidas (AAAA-MM-DD). */
  llamadas(subcartera: number, desde: string, hasta: string): Observable<Llamada[]> {
    const params = new HttpParams().set('subcartera', subcartera).set('desde', desde).set('hasta', hasta);
    return this.http.get<Llamada[]>(`${this.base}/llamadas`, { params });
  }

  ficha(idx: number): Observable<Ficha> {
    return this.http.get<Ficha>(`${this.base}/llamada/${idx}`);
  }

  /** Cierra la revisión. Escribe: sin reintentos. */
  cerrar(idx: number, cierre: Cierre): Observable<Ficha> {
    return this.http.put<Ficha>(`${this.base}/llamada/${idx}`, cierre);
  }

  /** Toda la historia evaluada de un asesor, o del equipo sin asesor. */
  rendimiento(subcartera: number, asesor: string | null): Observable<Rendimiento> {
    let params = new HttpParams().set('subcartera', subcartera);
    if (asesor) params = params.set('asesor', asesor);
    return this.http.get<Rendimiento>(`${this.base}/rendimiento`, { params });
  }

  /** Seguimiento por día: por asesor, día y rúbrica entre dos fechas (las dos incluidas). */
  seguimiento(subcartera: number, desde: string, hasta: string): Observable<Seguimiento> {
    const params = new HttpParams().set('subcartera', subcartera).set('desde', desde).set('hasta', hasta);
    return this.http.get<Seguimiento>(`${this.base}/seguimiento`, { params });
  }

  /** El Excel de la lista: llamadas y criterios de la subcartera entre dos fechas. */
  excel(subcartera: number, desde: string, hasta: string): Observable<Blob> {
    const params = new HttpParams().set('subcartera', subcartera).set('desde', desde).set('hasta', hasta);
    return this.http.get(`${this.base}/excel`, { params, responseType: 'blob' });
  }

  /** Lo descarga con el nombre del rango. */
  bajarExcel(subcartera: number, desde: string, hasta: string, alFallar: () => void): void {
    this.excel(subcartera, desde, hasta).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob), a = document.createElement('a');
        a.href = url; a.download = `monitoreo-${desde}-${hasta}.xlsx`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      },
      error: alFallar
    });
  }

  /** El audio de una parte, ya en WAV. */
  audio(idx: number, parte = 1): Observable<Blob> {
    return this.http.get(`${this.base}/evaluacion/${idx}/audio`, { params: { parte }, responseType: 'blob' });
  }

  transcripcion(idx: number): Observable<Transcripcion[]> {
    return this.http.get<Transcripcion[]>(`${environment.apiUrl}/gestion/historica/audios/${idx}/transcripcion`);
  }
}
