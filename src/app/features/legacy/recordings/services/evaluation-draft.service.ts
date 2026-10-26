import { Injectable } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';
import { MonitoringMode } from '../models/quality-monitoring.model';

/**
 * Una revisión a medias: lo que el supervisor cambió en la ficha y cerró sin guardar.
 *
 * Solo viajan los criterios tocados, igual que en el PUT. `base` guarda el valor que
 * tenía cada uno al empezar: si al reabrir el backend ya no dice lo mismo —otro
 * supervisor guardó en el medio—, ese cambio no se restaura, porque se haría contra
 * una nota que el supervisor nunca vio.
 */
export interface EvaluationDraft {
  valores: Record<string, number>;
  motivos: Record<string, string>;
  base: Record<string, number | null>;
  /** ISO. Es lo que muestra la etiqueta de la grilla. */
  guardadoEn: string;
}

/**
 * Los borradores de revisión de la ficha de evaluación.
 *
 * **Viven en `localStorage` y son por supervisor**: la llave lleva el usuario, así que
 * en una PC compartida cada uno ve solo los suyos. No llegan a otra PC ni a otro
 * navegador; si eso hace falta, el reemplazo es un endpoint y esta clase es el único
 * lugar que cambia.
 *
 * Se leen de un caché en memoria y no del storage en cada consulta: la grilla pregunta
 * por cada fila en cada ciclo de detección de cambios.
 */
@Injectable({ providedIn: 'root' })
export class EvaluationDraftService {

  private static readonly PREFIJO = 'cashi.monitoreo.borradores.';

  /** Un borrador olvidado no se arrastra para siempre. */
  private static readonly VIGENCIA_DIAS = 30;

  private usuarioCacheado: string | null = null;
  private cache: Record<string, EvaluationDraft> = {};

  constructor(private auth: AuthService) {}

  obtener(modo: MonitoringMode, idx: number): EvaluationDraft | null {
    return this.todos()[this.llave(modo, idx)] ?? null;
  }

  tiene(modo: MonitoringMode, idx: number): boolean {
    return !!this.todos()[this.llave(modo, idx)];
  }

  guardar(modo: MonitoringMode, idx: number, borrador: EvaluationDraft): void {
    const todos = this.todos();
    todos[this.llave(modo, idx)] = borrador;
    this.persistir();
  }

  borrar(modo: MonitoringMode, idx: number): void {
    const todos = this.todos();
    const llave = this.llave(modo, idx);
    if (todos[llave]) {
      delete todos[llave];
      this.persistir();
    }
  }

  private llave(modo: MonitoringMode, idx: number): string {
    return `${modo}:${idx}`;
  }

  private get usuario(): string {
    return this.auth.getCurrentUser()?.username ?? 'anonimo';
  }

  /** El mapa del usuario actual. Se recarga solo si cambió quién está logueado. */
  private todos(): Record<string, EvaluationDraft> {
    const usuario = this.usuario;
    if (usuario !== this.usuarioCacheado) {
      this.usuarioCacheado = usuario;
      this.cache = this.leer(usuario);
    }
    return this.cache;
  }

  private leer(usuario: string): Record<string, EvaluationDraft> {
    try {
      const crudo = localStorage.getItem(EvaluationDraftService.PREFIJO + usuario);
      const todos: Record<string, EvaluationDraft> = crudo ? JSON.parse(crudo) : {};
      const limite = Date.now() - EvaluationDraftService.VIGENCIA_DIAS * 86_400_000;
      for (const [llave, b] of Object.entries(todos)) {
        if (!b?.valores || new Date(b.guardadoEn).getTime() < limite) {
          delete todos[llave];
        }
      }
      return todos;
    } catch {
      // Storage bloqueado o JSON roto: sin borradores, la ficha funciona como antes.
      return {};
    }
  }

  private persistir(): void {
    if (this.usuarioCacheado === null) {
      return;
    }
    try {
      const llave = EvaluationDraftService.PREFIJO + this.usuarioCacheado;
      if (Object.keys(this.cache).length) {
        localStorage.setItem(llave, JSON.stringify(this.cache));
      } else {
        localStorage.removeItem(llave);
      }
    } catch {
      // Sin espacio o sin permiso: el borrador sigue vivo en memoria hasta recargar.
    }
  }
}
