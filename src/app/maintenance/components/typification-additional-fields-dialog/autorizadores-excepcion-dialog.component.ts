import { Component, computed, effect, inject, input, output, signal, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { A11yModule } from '@angular/cdk/a11y';
import { LucideAngularModule } from 'lucide-angular';
import {
  AutorizadorExcepcion, GuardarAutorizadorExcepcion, UsuarioAutorizable
} from '../../models/typification-v2.model';
import { ToastService } from '../../../shared/services/toast.service';
import { environment } from '../../../../environments/environment';
import { TUI, TUI_ANIM, tuiSwitch, tuiPerilla } from '../typification-ui';

/** Subcartera de Configurar montos a la que pertenecen los autorizadores. */
export interface ContextoAutorizadores {
  subId: number;
  cliente: string;
  cartera: string;
  subcartera: string;
}

type TipoAutorizador = 'USUARIO' | 'EXTERNO';
const CORREO_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Autorizadores de la subcartera: quienes aprueban las promesas que pasan el descuento máximo sin
 * aprobación. Se abre desde Configurar montos, en lista o directo en el formulario de alta cuando se
 * elige «Nuevo autorizador…» en un nivel.
 */
@Component({
  selector: 'app-autorizadores-excepcion-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, A11yModule],
  template: `
    <div [class]="ui.fondo + ' z-[60]'" (click)="cerrar()">
      <div [class]="ui.panel + ' max-w-[720px]'" role="dialog" aria-modal="true" aria-labelledby="au-titulo"
           cdkTrapFocus [cdkTrapFocusAutoCapture]="true"
           (click)="$event.stopPropagation()" (keydown.escape)="cerrar()">

        <div [class]="ui.cabecera">
          <div class="min-w-0">
            <h2 id="au-titulo" [class]="ui.titulo">
              {{ modo() === 'lista' ? 'Autorizadores' : editando() ? 'Editar autorizador' : 'Nuevo autorizador' }}
            </h2>
            <p [class]="ui.subtitulo">
              <b class="font-bold text-[#334155] dark:text-slate-200">{{ contexto().cliente }} · {{ contexto().cartera }} · {{ contexto().subcartera }}</b>
              · quienes aprueban las excepciones de esta subcartera
            </p>
          </div>
          <button type="button" (click)="cerrar()" [class]="ui.iconBtn" aria-label="Cerrar">
            <lucide-angular name="x" [size]="17"></lucide-angular>
          </button>
        </div>

        <div [class]="ui.cuerpo">
          @if (modo() === 'lista') {
            <span [class]="ui.ayuda">
              Pueden ser usuarios de Cashi o personas sin usuario; de estas se registra el correo. Se eligen en los
              niveles de autorización de cada tarjeta. Un autorizador asignado a un nivel no se puede editar ni desactivar.
            </span>
            @if (bloqueo()) {
              <div role="alert" class="flex items-start gap-2.5 rounded-[10px] border border-[#f5c2c2] bg-[#fdecec] px-3 py-2.5 text-[12px] font-semibold leading-[1.45] text-[#b91c1c] dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <lucide-angular name="circle-alert" [size]="16" class="mt-px shrink-0"></lucide-angular>
                <span class="flex-1">{{ bloqueo() }}</span>
                <button type="button" (click)="bloqueo.set('')" [class]="ui.iconBtnPeligro + ' -my-1 -mr-1'" aria-label="Cerrar aviso">
                  <lucide-angular name="x" [size]="14"></lucide-angular>
                </button>
              </div>
            }
            @if (autorizadores().length === 0) {
              <div class="flex flex-col items-center gap-2 rounded-[10px] border border-dashed border-[#d5dbe3] px-4 py-8 text-center dark:border-slate-700">
                <lucide-angular name="user-check" [size]="24" class="text-[#8491a3]"></lucide-angular>
                <span class="text-[12.5px] font-bold">Sin autorizadores en esta subcartera</span>
                <span [class]="ui.ayuda">Mientras no haya, las excepciones pasan a evaluación sin indicar quién autoriza.</span>
              </div>
            } @else {
              <div class="overflow-x-auto rounded-[10px] border border-[#e6e9ee] dark:border-slate-700">
                <table class="w-full min-w-[620px] border-collapse text-left">
                  <thead class="bg-[#f8fafc] dark:bg-slate-800/60">
                    <tr>
                      <th [class]="ui.label + ' px-3 py-2 font-bold'">Autorizador</th>
                      <th [class]="ui.label + ' px-3 py-2 font-bold'">Contacto</th>
                      <th [class]="ui.label + ' px-3 py-2 font-bold'">Activo</th>
                      <th class="w-[44px] px-3 py-2"><span class="sr-only">Editar</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (a of autorizadores(); track a.id) {
                      <tr class="border-t border-[#eef1f5] dark:border-slate-800">
                        <td class="px-3 py-2.5 align-top">
                          <div [class]="'text-[12.5px] font-bold ' + (a.activo ? '' : 'text-[#5f6c80] dark:text-slate-400')">{{ a.nombre }}</div>
                          <div class="text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ a.cargo || 'Sin cargo' }}</div>
                        </td>
                        <td class="px-3 py-2.5 align-top">
                          @if (a.idUsuario) {
                            <span [class]="ui.chipGris"><lucide-angular name="user" [size]="12"></lucide-angular>Usuario de Cashi</span>
                          } @else {
                            <span [class]="ui.chipGris"><lucide-angular name="mail" [size]="12"></lucide-angular>Sin usuario</span>
                          }
                          <div class="mt-1 text-[11.5px] text-[#5f6c80] dark:text-slate-400">{{ a.correo }}</div>
                        </td>
                        <td class="px-3 py-2.5 align-top">
                          <button type="button" role="switch" (click)="alternarActivo(a)" [disabled]="ocupado()"
                                  [attr.aria-checked]="a.activo"
                                  [attr.aria-label]="(a.activo ? 'Desactivar ' : 'Activar ') + a.nombre"
                                  [class]="sw(a.activo)">
                            <span [class]="perilla(a.activo)"></span>
                          </button>
                        </td>
                        <td class="px-3 py-2.5 align-top">
                          <button type="button" (click)="editar(a)" [class]="ui.iconBtn" [attr.aria-label]="'Editar ' + a.nombre">
                            <lucide-angular name="pencil" [size]="15"></lucide-angular>
                          </button>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          } @else {
            <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              @for (f of fijos(); track f.etiqueta) {
                <div class="flex flex-col gap-1.5">
                  <span [class]="ui.label">{{ f.etiqueta }}</span>
                  <span class="flex h-[38px] items-center rounded-lg border border-[#e6e9ee] bg-[#f8fafc] px-3 text-[13px] font-semibold text-[#334155] dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{{ f.valor }}</span>
                </div>
              }
            </div>

            <div class="flex flex-col gap-1.5">
              <span [class]="ui.label">¿Tiene usuario en Cashi?</span>
              <div class="inline-flex w-fit flex-wrap rounded-lg border border-[#d5dbe3] bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900"
                   role="group" aria-label="¿Tiene usuario en Cashi?">
                @for (t of tipos; track t.valor) {
                  <button type="button" [attr.aria-pressed]="tipo() === t.valor" [disabled]="editando()"
                          (click)="tipo.set(t.valor); errores.set({})"
                          [class]="'h-8 rounded-md px-3 text-[12px] font-bold transition-colors duration-150 disabled:cursor-not-allowed '
                                   + (tipo() === t.valor
                                      ? 'bg-[#0f172a] text-white dark:bg-white dark:text-slate-900'
                                      : 'text-[#5f6c80] hover:text-[#0f172a] disabled:opacity-50 dark:text-slate-400 dark:hover:text-slate-100')">
                    {{ t.texto }}
                  </button>
                }
              </div>
              @if (editando()) {
                <span [class]="ui.ayuda">Para cambiar de persona, desactiva este autorizador y crea otro: así el historial de excepciones conserva quién autorizó.</span>
              }
            </div>

            @if (tipo() === 'USUARIO') {
              <div class="flex flex-col gap-1.5">
                <label for="au-usuario" [class]="ui.label">Usuario</label>
                @if (editando()) {
                  <span class="flex h-[38px] items-center rounded-lg border border-[#e6e9ee] bg-[#f8fafc] px-3 text-[13px] font-semibold text-[#334155] dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">{{ nombre }}</span>
                } @else {
                  <select id="au-usuario" [(ngModel)]="idUsuario" [disabled]="cargandoUsuarios()" [class]="ui.input + ' w-full'">
                    <option [ngValue]="null">{{ cargandoUsuarios() ? 'Cargando usuarios…' : 'Elegir usuario' }}</option>
                    @for (u of usuariosLibres(); track u.id) {
                      <option [ngValue]="u.id">{{ (u.nombre || u.nombreUsuario) + (u.roles ? ' · ' + u.roles : '') }}</option>
                    }
                  </select>
                }
                @if (errores()['usuario']) {
                  <span [class]="ui.error">{{ errores()['usuario'] }}</span>
                } @else {
                  <span [class]="ui.ayuda">Usuarios de Cashi con un rol asignado a esta subcartera. El nombre y el correo se toman de su usuario.</span>
                }
              </div>
            } @else {
              <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div class="flex flex-col gap-1.5">
                  <label for="au-nombre" [class]="ui.label">Nombre</label>
                  <input id="au-nombre" type="text" maxlength="150" [(ngModel)]="nombre" [readonly]="editando()"
                         placeholder="Ej.: Bicsania Torres"
                         [class]="ui.input + ' w-full read-only:bg-[#f8fafc] dark:read-only:bg-slate-800/60'"/>
                  @if (errores()['nombre']) {
                    <span [class]="ui.error">{{ errores()['nombre'] }}</span>
                  } @else {
                    <span [class]="ui.ayuda">Una persona o un puesto, por ejemplo «Supervisor Sip».</span>
                  }
                </div>
                <div class="flex flex-col gap-1.5">
                  <label for="au-correo" [class]="ui.label">Correo</label>
                  <input id="au-correo" type="email" maxlength="150" [(ngModel)]="correo"
                         placeholder="nombre@empresa.com" [class]="ui.input + ' w-full'"/>
                  @if (errores()['correo']) {
                    <span [class]="ui.error">{{ errores()['correo'] }}</span>
                  } @else {
                    <span [class]="ui.ayuda">Se guarda para contactarlo cuando haya excepciones por aprobar.</span>
                  }
                </div>
              </div>
            }

            <div class="flex flex-col gap-1.5">
              <label for="au-cargo" [class]="ui.label">Cargo <span class="normal-case tracking-normal">(opcional)</span></label>
              <input id="au-cargo" type="text" maxlength="100" [(ngModel)]="cargo"
                     placeholder="Ej.: Jefatura de Cobranza" [class]="ui.input + ' w-full'"/>
              <span [class]="ui.ayuda">Va junto al nombre en los niveles de autorización y en la promesa que pasa a evaluación.</span>
            </div>
          }
        </div>

        <div class="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-[#e6e9ee] px-[18px] py-3 dark:border-slate-700">
          @if (modo() === 'lista') {
            <button type="button" (click)="cerrar()" [class]="ui.secundario">Cerrar</button>
            <button type="button" (click)="nuevo()" [class]="ui.primario">
              <lucide-angular name="plus" [size]="16"></lucide-angular>
              Nuevo autorizador
            </button>
          } @else {
            <button type="button" (click)="volver()" [disabled]="ocupado()" [class]="ui.secundario">Cancelar</button>
            <button type="button" (click)="guardar()" [disabled]="ocupado()" [class]="ui.primario">
              @if (ocupado()) {
                <lucide-angular name="loader-2" [size]="15" class="animate-spin"></lucide-angular>
                Guardando
              } @else {
                Guardar
              }
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [TUI_ANIM]
})
export class AutorizadoresExcepcionDialogComponent {
  contexto = input.required<ContextoAutorizadores>();
  autorizadores = input<AutorizadorExcepcion[]>([]);
  /** 'form' abre directo el alta (desde «Nuevo autorizador…» de un nivel). */
  modoInicial = input<'lista' | 'form'>('lista');
  /** Tarjetas de la pantalla, aún sin guardar, en las que el autorizador es un nivel. */
  usosSinGuardar = input<(id: number) => string[]>(() => []);

  close = output<void>();
  /** Lista actualizada tras crear, editar o activar. */
  actualizado = output<AutorizadorExcepcion[]>();
  /** Recién creado: Configurar montos lo asigna al nivel desde el que se pidió. */
  creado = output<AutorizadorExcepcion>();

  readonly ui = TUI;
  readonly sw = tuiSwitch;
  readonly perilla = tuiPerilla;
  readonly tipos: { valor: TipoAutorizador; texto: string }[] = [
    { valor: 'USUARIO', texto: 'Sí, elegir su usuario' },
    { valor: 'EXTERNO', texto: 'No, registrar su correo' }
  ];

  modo = signal<'lista' | 'form'>('lista');
  private origen: 'lista' | 'form' = 'lista';
  editandoId = signal<number | null>(null);
  readonly editando = computed(() => this.editandoId() !== null);
  bloqueo = signal('');
  errores = signal<Record<string, string>>({});
  ocupado = signal(false);
  tipo = signal<TipoAutorizador>('EXTERNO');
  usuarios = signal<UsuarioAutorizable[]>([]);
  cargandoUsuarios = signal(false);

  idUsuario: number | null = null;
  nombre = '';
  correo = '';
  cargo = '';

  readonly fijos = computed(() => [
    { etiqueta: 'Cliente', valor: this.contexto().cliente },
    { etiqueta: 'Cartera', valor: this.contexto().cartera },
    { etiqueta: 'Subcartera', valor: this.contexto().subcartera }
  ]);
  /** Los usuarios que ya son autorizadores de la subcartera no se repiten. */
  readonly usuariosLibres = computed(() => {
    const usados = new Set(this.autorizadores().map(a => a.idUsuario).filter(id => id !== null));
    return this.usuarios().filter(u => !usados.has(u.id));
  });

  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private url = `${environment.apiUrl}/v2/autorizadores-excepcion`;

  constructor() {
    effect(() => {
      const inicial = this.modoInicial();
      untracked(() => {
        this.origen = inicial;
        if (inicial === 'form') this.nuevo();
        else this.modo.set('lista');
      });
    });
  }

  cerrar() {
    if (this.ocupado()) return;
    this.close.emit();
  }

  /** Del formulario se vuelve a la lista, salvo que se haya abierto directo en el alta. */
  volver() {
    if (this.origen === 'form') {
      this.close.emit();
      return;
    }
    this.modo.set('lista');
    this.editandoId.set(null);
  }

  nuevo() {
    this.bloqueo.set('');
    this.errores.set({});
    this.editandoId.set(null);
    this.tipo.set('EXTERNO');
    this.idUsuario = null;
    this.nombre = '';
    this.correo = '';
    this.cargo = '';
    this.modo.set('form');
    this.cargarUsuarios();
  }

  /** Mismo criterio que el backend: si un nivel lo usa, no se edita ni se desactiva. */
  private enUso(a: AutorizadorExcepcion, accion: string): boolean {
    const tarjetas = [...new Set([...(a.tarjetas ?? []), ...this.usosSinGuardar()(a.id)])];
    if (tarjetas.length === 0) return false;
    this.bloqueo.set(`No se puede ${accion} a ${a.nombre}: está asignado en los niveles de autorización de `
      + `${tarjetas.length === 1 ? 'la tarjeta' : 'las tarjetas'} ${tarjetas.join(', ')}. Quítalo de esos niveles y guarda primero.`);
    return true;
  }

  editar(a: AutorizadorExcepcion) {
    if (this.enUso(a, 'editar')) return;
    this.bloqueo.set('');
    this.errores.set({});
    this.editandoId.set(a.id);
    this.tipo.set(a.idUsuario ? 'USUARIO' : 'EXTERNO');
    this.idUsuario = a.idUsuario;
    this.nombre = a.nombre ?? '';
    this.correo = a.correo ?? '';
    this.cargo = a.cargo ?? '';
    this.modo.set('form');
  }

  alternarActivo(a: AutorizadorExcepcion) {
    if (a.activo && this.enUso(a, 'desactivar')) return;
    this.bloqueo.set('');
    this.ocupado.set(true);
    this.http.patch<AutorizadorExcepcion>(`${this.url}/${a.id}/activo`, null, { params: { activo: !a.activo } }).subscribe({
      next: (r) => {
        this.ocupado.set(false);
        this.actualizado.emit(this.autorizadores().map(x => x.id === r.id ? r : x));
      },
      error: (e) => {
        this.ocupado.set(false);
        this.bloqueo.set(this.mensajeError(e, 'No se pudo cambiar el estado del autorizador.'));
      }
    });
  }

  private cargarUsuarios() {
    if (this.usuarios().length > 0 || this.cargandoUsuarios()) return;
    this.cargandoUsuarios.set(true);
    this.http.get<UsuarioAutorizable[]>(`${this.url}/usuarios`, { params: { idSubcartera: this.contexto().subId } }).subscribe({
      next: (u) => {
        this.usuarios.set(u ?? []);
        this.cargandoUsuarios.set(false);
      },
      error: () => {
        this.cargandoUsuarios.set(false);
        this.errores.set({ ...this.errores(), usuario: 'No se pudieron cargar los usuarios de la subcartera.' });
      }
    });
  }

  guardar() {
    const err: Record<string, string> = {};
    const nombre = this.nombre.trim();
    const correo = this.correo.trim();
    if (this.tipo() === 'USUARIO' && !this.idUsuario) err['usuario'] = 'Elige el usuario de Cashi.';
    if (this.tipo() === 'EXTERNO') {
      if (!nombre) err['nombre'] = 'Escribe el nombre o el puesto.';
      if (!correo) err['correo'] = 'Sin usuario de Cashi, el correo es obligatorio.';
      else if (!CORREO_OK.test(correo)) err['correo'] = 'Revisa el correo: no tiene un formato válido.';
      else if (this.autorizadores().some(a => a.id !== this.editandoId() && a.correo?.toLowerCase() === correo.toLowerCase())) {
        err['correo'] = 'Ese correo ya está registrado en esta subcartera.';
      }
    }
    this.errores.set(err);
    if (Object.keys(err).length > 0) return;

    const cuerpo: GuardarAutorizadorExcepcion = {
      idSubcartera: this.contexto().subId,
      idUsuario: this.tipo() === 'USUARIO' ? this.idUsuario : null,
      nombre: this.tipo() === 'EXTERNO' ? nombre : null,
      correo: this.tipo() === 'EXTERNO' ? correo : null,
      cargo: this.cargo.trim() || null
    };
    const id = this.editandoId();
    const pedido = id === null
      ? this.http.post<AutorizadorExcepcion>(this.url, cuerpo)
      : this.http.put<AutorizadorExcepcion>(`${this.url}/${id}`, cuerpo);
    this.ocupado.set(true);
    pedido.subscribe({
      next: (a) => {
        this.ocupado.set(false);
        const lista = id === null ? [...this.autorizadores(), a] : this.autorizadores().map(x => x.id === a.id ? a : x);
        this.actualizado.emit(lista);
        this.toast.success(`Autorizador ${id === null ? 'registrado' : 'actualizado'}: ${a.nombre}${a.cargo ? ' · ' + a.cargo : ''}.`);
        if (id === null) this.creado.emit(a);
        this.volver();
      },
      error: (e) => {
        this.ocupado.set(false);
        const mensaje = this.mensajeError(e, 'No se pudo guardar el autorizador.');
        if (id !== null && e?.status === 400 && mensaje.startsWith('No se puede')) {
          // Lo asignaron en otra tipificación mientras se editaba
          this.modo.set('lista');
          this.editandoId.set(null);
          this.bloqueo.set(mensaje);
        } else {
          this.toast.error(mensaje);
        }
      }
    });
  }

  private mensajeError(e: any, porDefecto: string): string {
    const m = e?.error?.message;
    return typeof m === 'string' && m.trim() ? m : porDefecto;
  }
}
