import { Component, HostListener, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastService } from '../../shared/services/toast.service';
import { TenantService } from '../../maintenance/services/tenant.service';
import { PortfolioService } from '../../maintenance/services/portfolio.service';
import { Tenant } from '../../maintenance/models/tenant.model';
import { Portfolio, SubPortfolio } from '../../maintenance/models/portfolio.model';
import { AsistenciaService } from './asistencia.service';
import { DatosPersonal, FichaPersonal, MovimientoPersonal, UsuarioLibre } from './asistencia.models';
import { ESTILOS, hoy, lunesDe, sumarDias } from './asistencia.estilos';
import { PaginadorComponent } from './paginador.component';
import { AVATARES_PERSONAL } from './avatares-personal';

type Estado = 'ACTIVO' | 'CESADO' | '';
type Seccion = 'laboral' | 'datos' | 'historial';
type Modal = 'ficha' | 'form' | 'cese' | 'sub' | null;

/** Los campos del formulario, en el orden en que se revisan. */
interface Form {
  apellidos: string; nombres: string; tipoDocumento: 'DNI' | 'CE'; numeroDocumento: string;
  fechaNacimiento: string; nacionalidad: string; estadoCivil: string;
  telefonoMovil: string; telefonoFijo: string; correo: string;
  direccion: string; distrito: string; fechaIngreso: string; idUsuario: number | null;
}
type Campo = keyof Form;

/** Una subcartera con su gente activa, para el bloque de equipo. */
interface Grupo { idSubcartera: number; subcartera: string; cartera: string; tono: string; gente: FichaPersonal[] }

const POR_PAGINA = 10;
const AREAS = ['a', 'b', 'c', 'd'];
const MOTIVOS_CESE = ['Renuncia', 'Término de contrato', 'Abandono', 'Despido', 'Otro'];
const ESTADOS_CIVILES = ['Soltero(a)', 'Casado(a)', 'Conviviente', 'Divorciado(a)', 'Viudo(a)'];
const NACIONALIDADES = ['Peruana', 'Venezolana', 'Colombiana'];
const DISTRITOS = ['San Juan de Lurigancho', 'Ate', 'Comas', 'San Martín de Porres', 'Los Olivos', 'Villa El Salvador', 'Surco', 'Lima'];
const CAMPOS_ID: Record<Campo, string> = {
  apellidos: 'p-apellidos', nombres: 'p-nombres', tipoDocumento: 'p-tipodoc', numeroDocumento: 'p-numdoc',
  fechaNacimiento: 'p-nacimiento', nacionalidad: 'p-nacionalidad', estadoCivil: 'p-civil',
  telefonoMovil: 'p-movil', telefonoFijo: 'p-fijo', correo: 'p-correo',
  direccion: 'p-direccion', distrito: 'p-distrito', fechaIngreso: 'p-ingreso', idUsuario: 'p-usuario'
};

/** El color de cada subcartera, por su nombre: el mismo en todas las pantallas. */
function tonoDe(subcartera: string | null): string {
  const n = (subcartera ?? '').toUpperCase();
  if (n.includes('PROPIO')) { return 'var(--c-1)'; }
  if (n.includes('CASTIGO')) { return 'var(--c-2)'; }
  if (/\b3\b/.test(n)) { return 'var(--c-3)'; }
  if (/\b5\b/.test(n)) { return 'var(--c-4)'; }
  return 'var(--tenue)';
}

/**
 * Personal: la ficha de cada persona por subcartera.
 *
 * Arriba, el equipo activo del ámbito; abajo, la tabla con activos y cesados.
 * La ficha lleva sus datos, su ingreso, su cese y los cambios de subcartera; de
 * ahí sale quién entra en el control de asistencia y desde cuándo.
 */
@Component({
  selector: 'app-personal',
  standalone: true,
  host: { class: 'cashi-asistencia' },
  imports: [CommonModule, FormsModule, PaginadorComponent],
  styles: [`
    :host {
      display: block;
      --texto: #0f172a; --texto-medio: #334155; --apagado: #5f6c80; --tenue: #8491a3;
      --superficie: #ffffff; --borde: #e6e9ee; --borde-suave: #f1f3f6; --borde-control: #8491a3; --hover: #f4f6f9;
      --acento: #2563eb; --neutro-fondo: #f1f3f6;
      --ok-punto: #16a34a; --tarde-fondo: #fef6e0; --tarde-texto: #92400e;
      --falta-fondo: #fdecec; --falta-texto: #b91c1c; --falta-punto: #dc2626;
      --primario: #0f172a; --primario-texto: #ffffff;
      --c-1: #2a78d6; --c-2: #eb6834; --c-3: #1baf7a; --c-4: #eda100;
    }
    :host-context(.dark) {
      --texto: #f1f5f9; --texto-medio: #e2e8f0; --apagado: #94a3b8; --tenue: #64748b;
      --superficie: #0f172a; --borde: #1e293b; --borde-suave: #1e293b; --borde-control: #475569; --hover: #1e293b;
      --acento: #60a5fa; --neutro-fondo: #1e293b;
      --ok-punto: #22c55e; --tarde-fondo: #451a03; --tarde-texto: #fcd34d;
      --falta-fondo: #450a0a; --falta-texto: #fca5a5; --falta-punto: #ef4444;
      --primario: #ffffff; --primario-texto: #0f172a;
      --c-1: #3987e5; --c-2: #d95926; --c-3: #199e70; --c-4: #c98500;
    }
    .aparecer { animation: aparecer .18s ease-out }
    @keyframes aparecer { from { opacity: 0; transform: translateY(3px) } to { opacity: 1; transform: none } }
    .titulo-seccion { margin: 0; font-size: 15px; font-weight: 800; }
    .secundario { font-size: 11.5px; color: var(--apagado); }

    /* Equipo por subcartera: bento. La subcartera con más gente toma el bloque grande. */
    .equipo { margin-bottom: 22px; }
    .cabeza-equipo { display: flex; align-items: baseline; gap: 10px; margin-bottom: 12px; }
    .franjas { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: minmax(120px, auto); }
    .franjas.n1 { grid-template-columns: 1fr; grid-template-areas: "a"; }
    .franjas.n2 { grid-template-columns: 3fr 2fr; grid-template-areas: "a b"; }
    .franjas.n3 { grid-template-columns: 3fr 2fr; grid-template-areas: "a b" "a c"; }
    .franjas.n4 { grid-template-columns: 2fr 1fr 1fr; grid-template-areas: "a b c" "a d d"; }
    .bento-sub { position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 10px; padding: 16px 18px; border-radius: 14px;
      background: color-mix(in srgb, var(--tono) 7%, var(--superficie)); border: 1px solid color-mix(in srgb, var(--tono) 28%, var(--borde)); }
    .bento-sub.principal { padding: 20px 22px; }
    .cabeza-bento { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
    .cabeza-bento strong { display: block; font-size: 14px; font-weight: 800; }
    .cabeza-bento span { display: block; font-size: 11.5px; color: var(--apagado); }
    .cifra-bento { font-size: 30px; line-height: 1; font-weight: 800; letter-spacing: -.03em; color: var(--texto); font-variant-numeric: tabular-nums; }
    .bento-sub.principal .cifra-bento { font-size: 44px; }
    .cifra-bento small { display: block; margin-top: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0; color: var(--apagado); text-align: right; }
    /* La marca de la subcartera: un círculo grande del color, cortado por la esquina. */
    .bento-sub::after { content: ""; position: absolute; right: -36px; bottom: -52px; width: 100px; height: 100px; border-radius: 999px;
      background: color-mix(in srgb, var(--tono) 14%, transparent); pointer-events: none; }
    .figuras { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(auto-fill, 42px); gap: 6px; margin-top: auto; }
    .bento-sub.principal .figuras { grid-template-columns: repeat(auto-fill, 58px); gap: 8px; }
    .figura { width: 42px; height: 42px; padding: 0; border: 0; border-radius: 999px; cursor: pointer; overflow: hidden;
      color: color-mix(in srgb, var(--tono) 88%, #000); background: color-mix(in srgb, var(--tono) 18%, var(--superficie));
      box-shadow: 0 0 0 2px var(--superficie), 0 0 0 3px color-mix(in srgb, var(--tono) 30%, var(--borde));
      display: inline-flex; align-items: center; justify-content: center;
      transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .2s ease; }
    .bento-sub.principal .figura { width: 58px; height: 58px; }
    .figura ::ng-deep svg, .iniciales-ficha ::ng-deep svg { width: 100%; height: 100%; display: block; flex: none; }
    button.figura:hover, button.figura:focus-visible { transform: translateY(-4px) scale(1.08); z-index: 2;
      box-shadow: 0 0 0 2px var(--superficie), 0 0 0 3.5px var(--tono), 0 8px 16px -4px color-mix(in srgb, var(--tono) 55%, transparent); }
    button.figura:active { transform: translateY(-1px) scale(.98); transition-duration: .08s; }
    button.figura:focus-visible { outline: 2px solid var(--acento); outline-offset: 3px; }
    .figura.sin-usu { color: var(--tenue); background: var(--neutro-fondo); box-shadow: 0 0 0 2px var(--superficie), 0 0 0 3px var(--borde-control); }
    .tip-avatar { position: fixed; z-index: 60; pointer-events: none; transform: translate(-50%, calc(-100% - 12px));
      padding: 7px 11px; border-radius: 9px; background: var(--primario); color: var(--primario-texto); box-shadow: 0 8px 22px rgba(15, 23, 42, .22);
      font-size: 12px; line-height: 1.35; white-space: nowrap; animation: tip .14s ease; }
    @keyframes tip { from { opacity: 0; transform: translate(-50%, calc(-100% - 8px)) } }
    .tip-avatar strong { display: block; font-weight: 700; }
    .tip-avatar span { display: flex; align-items: center; gap: 6px; font-size: 11px; opacity: .8; }
    .tip-avatar span i { width: 7px; height: 7px; border-radius: 999px; background: var(--tono-tip, var(--tenue)); }
    .tip-avatar::after { content: ""; position: absolute; left: 50%; bottom: -5px; width: 10px; height: 10px; background: inherit; transform: translateX(-50%) rotate(45deg); border-radius: 2px; }
    .leyenda-equipo { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 10px 0 0; font-size: 11.5px; color: var(--apagado); }
    @media (max-width: 760px) { .franjas.n2, .franjas.n3, .franjas.n4 { grid-template-columns: 1fr; grid-template-areas: none; } .bento-sub { grid-area: auto !important; } }

    /* Una sola subcartera: una tarjeta por persona, centradas en su panel. */
    .panel-solo { display: flex; flex-direction: column; gap: 16px; padding: 18px 20px 22px; border-radius: 14px;
      background: color-mix(in srgb, var(--tono) 7%, var(--superficie)); border: 1px solid color-mix(in srgb, var(--tono) 28%, var(--borde)); }
    .cabeza-solo { display: flex; flex-direction: column; align-items: center; gap: 2px; text-align: center; }
    .cabeza-solo strong { font-size: 15px; font-weight: 800; }
    .cabeza-solo span { font-size: 11.5px; color: var(--apagado); }
    .tarjetas-equipo { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
    .tarjeta-persona { width: 200px; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 18px 12px 14px; border-radius: 14px; cursor: pointer;
      background: var(--superficie); border: 1px solid color-mix(in srgb, var(--tono) 25%, var(--borde)); font: inherit; color: var(--texto); text-align: center;
      transition: transform .28s cubic-bezier(.34, 1.56, .64, 1), box-shadow .2s ease, border-color .2s ease; }
    .tarjeta-persona:hover, .tarjeta-persona:focus-visible { transform: translateY(-3px); border-color: var(--tono);
      box-shadow: 0 10px 20px -8px color-mix(in srgb, var(--tono) 50%, transparent); outline: none; }
    .tarjeta-persona .figura { width: 56px; height: 56px; pointer-events: none; }
    .tarjeta-persona strong { font-size: 13.5px; font-weight: 700; }
    .tarjeta-persona small { font-size: 11.5px; color: var(--apagado); }
    .tarjeta-persona .usu { font-size: 11px; font-weight: 700; padding: 1px 8px; border-radius: 999px; background: color-mix(in srgb, var(--tono) 14%, var(--superficie)); }
    .tarjeta-persona.sin-usu .usu { background: var(--tarde-fondo); color: var(--tarde-texto); }
    @media (prefers-reduced-motion: reduce) {
      .figura, .tarjeta-persona, .tip-avatar { transition: none; animation: none; }
      button.figura:hover, .tarjeta-persona:hover { transform: none; }
    }

    /* La tabla. */
    .persona-celda { display: flex; flex-direction: column; line-height: 1.35; }
    .persona-celda small { font-size: 11px; color: var(--tenue); font-variant-numeric: tabular-nums; }
    .usuario-cashi { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-variant-numeric: tabular-nums; }
    .usuario-cashi::before { content: ""; width: 7px; height: 7px; border-radius: 999px; background: var(--ok-punto); }
    .sin-usuario { display: inline-flex; align-items: center; gap: 5px; padding: 1px 8px; border-radius: 999px; font-size: 11px; font-weight: 700;
      background: var(--tarde-fondo); color: var(--tarde-texto); }
    tr.cesado td:not(.accion) { color: var(--apagado); }
    .nota-pie { margin: 14px 2px 0; font-size: 11.5px; color: var(--apagado); max-width: 62ch; }

    /* La ficha: mide siempre lo mismo, cambiar de pestaña no la estira. */
    .caja-ficha { width: min(100%, 580px); height: min(88vh, 530px); }
    .tabs-ficha { padding: 14px 20px 0; }
    .tabs-ficha nav { display: flex; width: 100%; }
    .tabs-ficha nav button { flex: 1; justify-content: center; }
    .quien-ficha { display: flex; align-items: center; gap: 12px; }
    .iniciales-ficha { width: 52px; height: 52px; border-radius: 999px; flex: none; overflow: hidden;
      color: color-mix(in srgb, var(--tono) 88%, #000); background: color-mix(in srgb, var(--tono) 18%, var(--superficie));
      box-shadow: 0 0 0 2px var(--superficie), 0 0 0 3px color-mix(in srgb, var(--tono) 35%, var(--borde)); }
    .datos-ficha { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
    .dato-ficha { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 14px 10px; text-align: center;
      border-radius: 12px; background: color-mix(in srgb, var(--tono) 7%, var(--superficie)); border: 1px solid color-mix(in srgb, var(--tono) 22%, var(--borde)); }
    .dato-ficha small { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--apagado); }
    .dato-ficha strong { font-size: 16px; font-weight: 800; letter-spacing: -.01em; font-variant-numeric: tabular-nums; }
    .dato-ficha.sin-usu strong { font-size: 13px; color: var(--tarde-texto); }
    @media (max-width: 460px) { .datos-ficha { grid-template-columns: 1fr; } }
    .ambito-ficha { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .ambito-ficha span { color: var(--tenue); }
    .ficha-datos { display: grid; grid-template-columns: 138px 1fr; gap: 9px 14px; margin: 0; font-size: 13px; }
    .ficha-datos dt { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--apagado); padding-top: 2px; }
    .ficha-datos dd { margin: 0; min-width: 0; overflow-wrap: anywhere; }
    .bloque-ficha { display: flex; flex-direction: column; gap: 10px; padding-bottom: 14px; border-bottom: 1px solid var(--borde-suave); }
    .bloque-ficha:last-child { border-bottom: 0; }
    .bloque-ficha h4 { margin: 0; font-size: 12px; font-weight: 800; }
    .campos-ficha { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px 16px; margin: 0; }
    .campos-ficha div { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .campos-ficha dt { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--apagado); }
    .campos-ficha dd { margin: 0; font-size: 13px; font-weight: 600; overflow-wrap: anywhere; }
    .campos-ficha .ancho { grid-column: span 2; }
    @media (max-width: 460px) { .campos-ficha { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    .raya { color: var(--tenue); font-weight: 400; }
    .linea-tiempo { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
    .linea-tiempo li { position: relative; display: grid; grid-template-columns: 76px 1fr; gap: 12px; padding: 0 0 16px; }
    .linea-tiempo li::before { content: ""; position: absolute; left: 88px; top: 6px; width: 9px; height: 9px; border-radius: 999px;
      background: var(--m-punto, var(--tenue)); box-shadow: 0 0 0 3px var(--superficie); z-index: 1; }
    .linea-tiempo li::after { content: ""; position: absolute; left: 92px; top: 12px; bottom: 0; width: 1px; background: var(--borde); }
    .linea-tiempo li:last-child::after { display: none; }
    .linea-tiempo .fecha-mov { font-size: 12px; color: var(--apagado); font-variant-numeric: tabular-nums; padding-top: 1px; }
    .linea-tiempo .detalle-mov { padding-left: 16px; }
    .linea-tiempo .detalle-mov strong { display: block; font-size: 13px; }
    .linea-tiempo .detalle-mov span { display: block; font-size: 12px; color: var(--apagado); }
    .linea-tiempo li.ingreso { --m-punto: var(--ok-punto); }
    .linea-tiempo li.cambio { --m-punto: var(--acento); }
    .linea-tiempo li.cese { --m-punto: var(--falta-punto); }
    .efecto { display: flex; gap: 8px; align-items: flex-start; margin: 0; padding: 10px 12px; border-radius: 10px; background: var(--hover);
      border: 1px solid var(--borde); font-size: 12px; color: var(--apagado); }
    .efecto svg { flex: none; margin-top: 1px; }

    /* El formulario: secciones con su título, dos columnas que se apilan. */
    .seccion-form { display: flex; flex-direction: column; gap: 12px; }
    .seccion-form > h4 { margin: 0; display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 800; text-transform: uppercase;
      letter-spacing: .05em; color: var(--apagado) !important; }
    .seccion-form > h4::after { content: ""; flex: 1; height: 1px; background: var(--borde-suave); }
    .campos-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
    .campos-3 { display: grid; grid-template-columns: 104px minmax(0, 1fr); gap: 12px; }
    @media (max-width: 520px) { .campos-2, .campos-3 { grid-template-columns: 1fr; } }
    .campo-grupo { display: flex; flex-direction: column; gap: 6px; }
    .ayuda { margin: 0; font-size: 11.5px; color: var(--tenue); }
    .error-campo { margin: 0; font-size: 11.5px; color: var(--falta-texto); }
    .con-error input, .con-error select { border-color: var(--falta-texto) !important; }
    .obligatorio { color: var(--falta-texto); margin-left: 2px; }
    .resumen-errores { padding: 10px 12px; border-radius: 10px; border: 1px solid color-mix(in srgb, var(--falta-punto) 40%, var(--superficie));
      background: var(--falta-fondo); color: var(--falta-texto); font-size: 12.5px; }
    .resumen-errores strong { display: block; margin-bottom: 3px; }
    .resumen-errores ul { margin: 0; padding-left: 18px; }
    .resumen-errores a { color: inherit !important; text-decoration: underline; }
    .ambito-form { margin: 0; display: inline-flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px; border-radius: 8px;
      background: var(--hover); border: 1px solid var(--borde); font-size: 13px; font-weight: 600; color: var(--texto); width: fit-content; }
    .ambito-form span { color: var(--tenue); font-weight: 400; }
  `],
  template: `
    <div class="min-h-full bg-[#f6f7f9] font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] dark:bg-slate-950 dark:text-slate-100">

      <div class="flex flex-col gap-4 border-b border-[#e6e9ee] bg-white px-7 py-5 dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-col gap-[3px]">
            <h1 class="!m-0 text-[20px] font-extrabold tracking-[-0.01em]">Personal</h1>
            <p class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ resumen() }}</p>
          </div>
          <button type="button" [class]="estilos.botonPrimario" (click)="abrirForm(null)" [disabled]="!idSubcartera()"
                  [attr.title]="idSubcartera() ? null : 'Elige una subcartera arriba para registrar'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
            Registrar personal
          </button>
        </div>

        <!-- El ámbito, en los tres niveles con los que está montada la operación -->
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="f-cliente">Cliente</label>
            <select id="f-cliente" [class]="estilos.campo + ' !w-[178px]'" [ngModel]="idCliente()" (ngModelChange)="elegirCliente($event)">
              <option [ngValue]="null">Todos</option>
              @for (c of clientes(); track c.id) { <option [ngValue]="c.id">{{ c.businessName || c.tenantName }}</option> }
            </select>
          </div>
          <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="f-cartera">Cartera</label>
            <select id="f-cartera" [class]="estilos.campo + ' !w-[178px]'" [ngModel]="idCartera()" (ngModelChange)="elegirCartera($event)"
                    [disabled]="!idCliente()">
              <option [ngValue]="null">Todas</option>
              @for (c of carteras(); track c.id) { <option [ngValue]="c.id">{{ c.portfolioName }}</option> }
            </select>
          </div>
          <span [class]="estilos.flechaAmbito" aria-hidden="true">›</span>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="f-subcartera">Subcartera</label>
            <select id="f-subcartera" [class]="estilos.campo + ' !w-[178px]'" [ngModel]="idSubcartera()" (ngModelChange)="elegirSubcartera($event)"
                    [disabled]="!idCartera()">
              <option [ngValue]="null">Todas</option>
              @for (s of subcarteras(); track s.id) { <option [ngValue]="s.id">{{ s.subPortfolioName }}</option> }
            </select>
          </div>
          <div class="flex flex-col gap-1.5">
            <label [class]="estilos.etiqueta" for="f-buscar">Buscar</label>
            <input id="f-buscar" type="search" placeholder="Nombre, DNI o usuario" [class]="estilos.campo + ' !w-[260px]'"
                   [ngModel]="busqueda()" (ngModelChange)="busqueda.set($event); pagina.set(1)">
          </div>
        </div>
      </div>

      <div class="px-7 pb-12 pt-5">
        @if (cargando() && !fichas().length) {
          <p class="py-16 text-center text-[13px] text-[#5f6c80] dark:text-slate-400">Cargando…</p>
        } @else if (error()) {
          <div [class]="estilos.vacio">
            <p class="text-[13.5px] font-bold">No se pudo cargar el personal</p>
            <button type="button" [class]="estilos.botonSecundario + ' mt-3'" (click)="cargar()">Reintentar</button>
          </div>
        } @else {
          <div class="aparecer">
            <!-- Equipo por subcartera -->
            <section class="equipo" aria-labelledby="titulo-equipo">
              <div class="cabeza-equipo">
                <h2 class="titulo-seccion" id="titulo-equipo">Equipo por subcartera</h2>
                <span class="secundario">{{ activos().length }} {{ activos().length === 1 ? 'activo' : 'activos' }}</span>
              </div>
              @let gs = grupos();
              @if (gs.length === 1) {
                @let g = gs[0];
                <div class="franjas n1">
                  <div class="panel-solo" [style.--tono]="g.tono">
                    <div class="cabeza-solo"><strong>{{ g.subcartera }}</strong>
                      <span>{{ g.cartera }} · {{ g.gente.length }} {{ g.gente.length === 1 ? 'persona' : 'personas' }}</span></div>
                    <div class="tarjetas-equipo">
                      @for (p of g.gente; track p.id) {
                        <button type="button" class="tarjeta-persona" [class.sin-usu]="!p.idUsuario" (click)="verFicha(p)" [attr.aria-label]="nombreLista(p)">
                          <span class="figura" [class.sin-usu]="!p.idUsuario" aria-hidden="true" [innerHTML]="avatar(p)"></span>
                          <strong>{{ nombreCorto(p) }}</strong>
                          <small>Desde el {{ dma(p.fechaIngreso) }}<br>{{ antiguedad(p) }}</small>
                          <span class="usu">{{ p.usuario ?? 'Sin usuario de Cashi' }}</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              } @else if (gs.length) {
                <div class="franjas" [ngClass]="'n' + (gs.length > 4 ? 4 : gs.length)">
                  @for (g of gs; track g.idSubcartera; let i = $index) {
                    <section class="bento-sub" [class.principal]="i === 0" [style.--tono]="g.tono" [style.grid-area]="areas[i]"
                             [attr.aria-label]="g.subcartera + ': ' + g.gente.length + (g.gente.length === 1 ? ' persona' : ' personas')">
                      <div class="cabeza-bento">
                        <div><strong>{{ g.subcartera }}</strong><span>{{ g.cartera }}</span></div>
                        <div class="cifra-bento">{{ g.gente.length }}<small>{{ sinUsuario(g) ? sinUsuario(g) + ' sin usuario' : (g.gente.length === 1 ? 'persona' : 'personas') }}</small></div>
                      </div>
                      <div class="figuras">
                        @for (p of g.gente; track p.id) {
                          <button type="button" class="figura" [class.sin-usu]="!p.idUsuario" [attr.aria-label]="nombreLista(p)" [innerHTML]="avatar(p)"
                                  (click)="verFicha(p)" (mouseenter)="mostrarTip($event, p, g.tono)" (focus)="mostrarTip($event, p, g.tono)"
                                  (mouseleave)="tip.set(null)" (blur)="tip.set(null)"></button>
                        }
                      </div>
                    </section>
                  }
                </div>
                @if (haySinUsuario()) { <p class="leyenda-equipo">En gris: sin usuario de Cashi</p> }
              } @else {
                <p class="secundario !m-0">Sin personal con ese filtro.</p>
              }
            </section>

            <!-- La tabla -->
            <div class="mb-3 flex items-center justify-between gap-3">
              <nav [class]="estilos.segmentos" aria-label="Estado">
                @for (t of ESTADOS; track t.clave) {
                  <button type="button" [class]="estilos.tab + ' ' + (estado() === t.clave ? estilos.tabActiva : estilos.tabApagada)"
                          [attr.aria-current]="estado() === t.clave ? 'page' : null" (click)="estado.set(t.clave); pagina.set(1)">
                    {{ t.texto }}
                    @if (t.clave !== '') {
                      <span [class]="estilos.cuenta + ' ' + (estado() === t.clave ? estilos.cuentaActiva : estilos.cuentaApagada)">
                        {{ t.clave === 'ACTIVO' ? activos().length : cesados().length }}</span>
                    }
                  </button>
                }
              </nav>
            </div>
            <div [class]="estilos.panel">
              <table class="w-full border-collapse">
                <caption class="sr-only">Personal registrado</caption>
                <thead class="border-b border-[#e6e9ee] dark:border-slate-800">
                  <tr>
                    <th scope="col" [class]="estilos.th">Nombre</th>
                    <th scope="col" [class]="estilos.th">Subcartera</th>
                    <th scope="col" [class]="estilos.th">Fecha de ingreso</th>
                    <th scope="col" [class]="estilos.th">Antigüedad</th>
                    <th scope="col" [class]="estilos.th">Usuario de Cashi</th>
                    <th scope="col" [class]="estilos.th">Móvil</th>
                    <th scope="col" [class]="estilos.th">Estado</th>
                    <th scope="col" [class]="estilos.th"><span class="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of visibles(); track p.id) {
                    <tr class="border-b border-[#f1f3f6] last:border-0 hover:bg-[#f4f6f9] dark:border-slate-800 dark:hover:bg-slate-800/60" [class.cesado]="cesado(p)">
                      <td [class]="estilos.td">
                        <span class="persona-celda"><strong class="font-semibold">{{ nombreLista(p) }}</strong>
                          <small>{{ p.numeroDocumento ? p.tipoDocumento + ' ' + p.numeroDocumento : 'Sin documento' }}</small></span>
                      </td>
                      <td [class]="estilos.td">{{ p.subcartera ?? '—' }}</td>
                      <td [class]="estilos.td">{{ dma(p.fechaIngreso) }}</td>
                      <td [class]="estilos.td">{{ antiguedad(p) }}</td>
                      <td [class]="estilos.td">
                        @if (p.usuario) { <span class="usuario-cashi">{{ p.usuario }}</span> } @else { <span class="sin-usuario">Sin vincular</span> }
                      </td>
                      <td [class]="estilos.td">{{ p.telefonoMovil ?? '—' }}</td>
                      <td [class]="estilos.td">
                        @if (cesado(p)) { <span [class]="PASTILLA.neutro">Cesado {{ dma(p.fechaCese).slice(0, 5) }}</span> }
                        @else if (p.fechaCese) { <span [class]="PASTILLA.tarde">Cesa {{ dma(p.fechaCese).slice(0, 5) }}</span> }
                        @else { <span [class]="PASTILLA.ok">Activo</span> }
                      </td>
                      <td [class]="estilos.td + ' accion w-[1%] text-right'">
                        <button type="button" [class]="estilos.botonChico" (click)="verFicha(p)">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
                          Ver ficha
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="8" class="px-4 py-14 text-center">
                      <strong class="block text-[13.5px]">Sin personal con ese filtro</strong>
                      <span class="text-[12.5px] text-[#5f6c80] dark:text-slate-400">Cambia la subcartera o la búsqueda.</span>
                    </td></tr>
                  }
                </tbody>
              </table>
              <app-paginador [total]="lista().length" [pagina]="pagina()" [porPagina]="porPagina" (cambiar)="pagina.set($event)" />
            </div>
            <p class="nota-pie">Sin usuario de Cashi no sale en el reporte de asistencia.</p>
          </div>
        }
      </div>
    </div>

    @if (tip(); as t) {
      <div class="tip-avatar" aria-hidden="true" [style.left.px]="t.x" [style.top.px]="t.y" [style.--tono-tip]="t.tono">
        <strong>{{ t.nombre }}</strong><span><i></i>{{ t.detalle }}</span>
      </div>
    }

    @if (modal()) {
      <div class="fixed inset-0 z-40 bg-[rgba(2,6,23,0.35)] backdrop-blur-[5px]" (click)="cerrar()"></div>
    }

    <!-- Ficha de la persona -->
    @if (modal() === 'ficha' && actual(); as p) {
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div [class]="caja + ' caja-ficha'" role="dialog" aria-modal="true" aria-labelledby="titulo-ficha">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div class="quien-ficha">
              <span class="iniciales-ficha" [style.--tono]="tonoFicha(p)" [innerHTML]="avatar(p)"></span>
              <div>
                <h2 id="titulo-ficha" class="!m-0 text-[16px] font-extrabold">{{ p.nombres }} {{ p.apellidos }}</h2>
                <p class="mt-0.5 text-[12.5px] text-[#5f6c80] dark:text-slate-400">
                  {{ p.numeroDocumento ? p.tipoDocumento + ' ' + p.numeroDocumento : 'Sin documento' }} · {{ p.subcartera ?? '—' }}</p>
              </div>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrar()" aria-label="Cerrar" id="cerrar-ficha">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <div class="tabs-ficha">
            <nav [class]="estilos.segmentos" aria-label="Secciones de la ficha">
              @for (s of SECCIONES; track s.clave) {
                <button type="button" [class]="estilos.tab + ' ' + (seccion() === s.clave ? estilos.tabActiva : estilos.tabApagada)"
                        [attr.aria-current]="seccion() === s.clave ? 'page' : null" (click)="seccion.set(s.clave)">{{ s.texto }}</button>
              }
            </nav>
          </div>
          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            @switch (seccion()) {
              @case ('laboral') {
                <div class="datos-ficha" [style.--tono]="tonoFicha(p)">
                  <div class="dato-ficha"><small>Fecha de ingreso</small><strong>{{ dma(p.fechaIngreso) }}</strong></div>
                  <div class="dato-ficha"><small>Antigüedad</small><strong>{{ antiguedad(p) }}</strong></div>
                  <div class="dato-ficha" [class.sin-usu]="!p.usuario"><small>Usuario de Cashi</small><strong>{{ p.usuario ?? 'Sin vincular' }}</strong></div>
                </div>
                <div class="bloque-ficha">
                  <dl class="ficha-datos">
                    <dt>Estado</dt>
                    <dd>
                      @if (cesado(p)) { <span [class]="PASTILLA.neutro">Cesado</span> }
                      @else if (p.fechaCese) { <span [class]="PASTILLA.tarde">Cesa</span> }
                      @else { <span [class]="PASTILLA.ok">Activo</span> }
                    </dd>
                    <dt>Ámbito</dt>
                    <dd><span class="ambito-ficha">{{ p.cliente ?? '—' }} <span>›</span> {{ p.cartera ?? '—' }} <span>›</span> {{ p.subcartera ?? '—' }}</span></dd>
                    @if (p.fechaCese) {
                      <dt>Último día</dt><dd>{{ dma(p.fechaCese) }} · {{ p.motivoCese }}</dd>
                    }
                  </dl>
                </div>
                <div class="bloque-ficha">
                  <h4>Últimos movimientos</h4>
                  <ng-container *ngTemplateOutlet="lineaTiempo; context: { $implicit: p.movimientos.slice(0, 3) }" />
                </div>
                @if (!p.usuario) {
                  <p class="efecto">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>
                    <span>Sin usuario de Cashi no sale en el reporte de asistencia.</span>
                  </p>
                }
              }
              @case ('datos') {
                <div class="bloque-ficha">
                  <h4>Datos personales</h4>
                  <dl class="campos-ficha">
                    <div><dt>Apellidos</dt><dd>{{ p.apellidos }}</dd></div>
                    <div><dt>Nombres</dt><dd>{{ p.nombres }}</dd></div>
                    <div><dt>Documento</dt><dd>@if (p.numeroDocumento) { {{ p.tipoDocumento }} {{ p.numeroDocumento }} } @else { <span class="raya">—</span> }</dd></div>
                    <div><dt>Nacimiento</dt><dd>@if (p.fechaNacimiento) { {{ dma(p.fechaNacimiento) }} } @else { <span class="raya">—</span> }</dd></div>
                    <div><dt>Nacionalidad</dt><dd>{{ p.nacionalidad ?? '—' }}</dd></div>
                    <div><dt>Estado civil</dt><dd>{{ p.estadoCivil ?? '—' }}</dd></div>
                  </dl>
                </div>
                <div class="bloque-ficha">
                  <h4>Contacto</h4>
                  <dl class="campos-ficha">
                    <div><dt>Móvil</dt><dd>{{ p.telefonoMovil ?? '—' }}</dd></div>
                    <div><dt>Teléfono fijo</dt><dd>@if (p.telefonoFijo) { {{ p.telefonoFijo }} } @else { <span class="raya">—</span> }</dd></div>
                    <div><dt>Correo</dt><dd>@if (p.correo) { {{ p.correo }} } @else { <span class="raya">—</span> }</dd></div>
                  </dl>
                </div>
                <div class="bloque-ficha">
                  <h4>Domicilio</h4>
                  <dl class="campos-ficha">
                    <div class="ancho"><dt>Dirección</dt><dd>@if (p.direccion) { {{ p.direccion }} } @else { <span class="raya">—</span> }</dd></div>
                    <div><dt>Distrito</dt><dd>@if (p.distrito) { {{ p.distrito }} } @else { <span class="raya">—</span> }</dd></div>
                  </dl>
                </div>
              }
              @case ('historial') {
                <ng-container *ngTemplateOutlet="lineaTiempo; context: { $implicit: p.movimientos }" />
              }
            }
          </div>
          <footer class="flex flex-wrap justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="abrirForm(p)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
              Editar datos
            </button>
            @if (!p.fechaCese) {
              <button type="button" [class]="estilos.botonSecundario" (click)="abrirSub(p)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></svg>
                Cambiar subcartera
              </button>
              <button type="button" [class]="estilos.botonPrimario" (click)="abrirCese(p)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
                Registrar cese
              </button>
            }
          </footer>
        </div>
      </div>
    }

    <ng-template #lineaTiempo let-movs>
      <ol class="linea-tiempo">
        @for (m of movs; track $index) {
          <li [class]="m.tipo"><span class="fecha-mov">{{ dma(m.fecha) }}</span>
            <span class="detalle-mov"><strong>{{ m.titulo }}</strong><span>{{ m.detalle }}</span></span></li>
        }
      </ol>
    </ng-template>

    <!-- Registrar / editar personal -->
    @if (modal() === 'form') {
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div [class]="caja + ' w-[min(100%,680px)]'" role="dialog" aria-modal="true" aria-labelledby="titulo-form">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-form" class="!m-0 text-[15px] font-extrabold">{{ editando() ? 'Editar datos' : 'Registrar personal' }}</h2>
              <p class="mt-0.5 text-[12.5px] text-[#5f6c80] dark:text-slate-400">Los campos con <span class="obligatorio">*</span> son obligatorios</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrar()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <form class="flex flex-1 flex-col gap-[18px] overflow-y-auto px-5 py-4" novalidate (ngSubmit)="guardarForm()" id="form-personal">
            @if (resumenErrores().length) {
              <div class="resumen-errores" tabindex="-1" id="resumen-errores">
                <strong>Revisa {{ resumenErrores().length }} {{ resumenErrores().length === 1 ? 'campo' : 'campos' }}</strong>
                <ul>@for (e of resumenErrores(); track e.campo) { <li><a href="#" (click)="$event.preventDefault(); enfocar(e.campo)">{{ e.mensaje }}</a></li> }</ul>
              </div>
            }
            @if (errorForm()) { <div class="resumen-errores">{{ errorForm() }}</div> }

            <section class="seccion-form">
              <h4>Datos personales</h4>
              <div class="campos-2">
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'apellidos', etiqueta: 'Apellidos', req: true, auto: 'family-name' }" />
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'nombres', etiqueta: 'Nombres', req: true, auto: 'given-name' }" />
              </div>
              <div class="campos-3">
                <div class="campo-grupo">
                  <label [class]="estilos.etiqueta" for="p-tipodoc">Documento</label>
                  <select id="p-tipodoc" [class]="estilos.campo" [ngModel]="form().tipoDocumento" name="tipoDocumento"
                          (ngModelChange)="poner('tipoDocumento', $event)">
                    <option value="DNI">DNI</option><option value="CE">CE</option>
                  </select>
                </div>
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'numeroDocumento', etiqueta: 'Número', req: true, modo: 'numeric' }" />
              </div>
              <div class="campos-2">
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'fechaNacimiento', etiqueta: 'Fecha de nacimiento', req: true, tipo: 'date' }" />
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'nacionalidad', etiqueta: 'Nacionalidad', lista: 'nacionalidades' }" />
                <datalist id="nacionalidades">@for (n of NACIONALIDADES; track n) { <option [value]="n"></option> }</datalist>
              </div>
              <div class="campos-2">
                <div class="campo-grupo">
                  <label [class]="estilos.etiqueta" for="p-civil">Estado civil</label>
                  <select id="p-civil" [class]="estilos.campo" [ngModel]="form().estadoCivil" name="estadoCivil" (ngModelChange)="poner('estadoCivil', $event)">
                    @for (e of ESTADOS_CIVILES; track e) { <option [value]="e">{{ e }}</option> }
                  </select>
                </div>
              </div>
            </section>

            <section class="seccion-form">
              <h4>Contacto</h4>
              <div class="campos-2">
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'telefonoMovil', etiqueta: 'Móvil', req: true, tipo: 'tel', modo: 'numeric', ph: '9XXXXXXXX' }" />
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'telefonoFijo', etiqueta: 'Teléfono fijo', tipo: 'tel', modo: 'numeric' }" />
              </div>
              <ng-container *ngTemplateOutlet="texto; context: { campo: 'correo', etiqueta: 'Correo', tipo: 'email', auto: 'email' }" />
            </section>

            <section class="seccion-form">
              <h4>Domicilio</h4>
              <ng-container *ngTemplateOutlet="texto; context: { campo: 'direccion', etiqueta: 'Dirección', auto: 'street-address' }" />
              <div class="campos-2">
                <ng-container *ngTemplateOutlet="texto; context: { campo: 'distrito', etiqueta: 'Distrito', lista: 'distritos' }" />
                <datalist id="distritos">@for (d of DISTRITOS; track d) { <option [value]="d"></option> }</datalist>
              </div>
            </section>

            <section class="seccion-form">
              <h4>Datos laborales</h4>
              <div class="campo-grupo">
                <span [class]="estilos.etiqueta">Se registra en</span>
                <p class="ambito-form">{{ ambitoForm()[0] }} <span>›</span> {{ ambitoForm()[1] }} <span>›</span> {{ ambitoForm()[2] }}</p>
              </div>
              <div class="campos-2">
                <div class="campo-grupo" [class.con-error]="errores()['fechaIngreso']">
                  <label [class]="estilos.etiqueta" for="p-ingreso">Fecha de ingreso<span class="obligatorio">*</span></label>
                  <input id="p-ingreso" type="date" [class]="estilos.campo" name="fechaIngreso" [ngModel]="form().fechaIngreso"
                         (ngModelChange)="poner('fechaIngreso', $event)" (blur)="validar('fechaIngreso')"
                         [attr.aria-invalid]="errores()['fechaIngreso'] ? true : null" [attr.aria-describedby]="errores()['fechaIngreso'] ? 'err-p-ingreso' : 'ayuda-ingreso'">
                  @if (errores()['fechaIngreso']; as e) { <p class="error-campo" id="err-p-ingreso">{{ e }}</p> }
                  @else { <p class="ayuda" id="ayuda-ingreso">Su primer día de trabajo. Desde aquí cuenta en asistencia.</p> }
                </div>
              </div>
              <div class="campo-grupo">
                <label [class]="estilos.etiqueta" for="p-usuario">Usuario de Cashi</label>
                <select id="p-usuario" [class]="estilos.campo" name="idUsuario" [ngModel]="form().idUsuario" (ngModelChange)="poner('idUsuario', $event)">
                  <option [ngValue]="null">Vincular después</option>
                  @for (u of usuariosDelForm(); track u.idUsuario) {
                    <option [ngValue]="u.idUsuario">{{ u.usuario }}{{ u.nombre ? ' · ' + u.nombre : '' }}</option>
                  }
                </select>
                <p class="ayuda">Con él se leen sus marcas. Si todavía no tiene, se vincula después.</p>
              </div>
            </section>
          </form>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrar()">Cancelar</button>
            <button type="submit" form="form-personal" [class]="estilos.botonPrimario" [disabled]="guardando()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              {{ editando() ? 'Guardar cambios' : 'Registrar' }}
            </button>
          </footer>
        </div>
      </div>
    }

    <ng-template #texto let-campo="campo" let-etiqueta="etiqueta" let-req="req" let-tipo="tipo" let-modo="modo" let-auto="auto" let-ph="ph" let-lista="lista">
      <div class="campo-grupo" [class.con-error]="errorDe(campo)">
        <label [class]="estilos.etiqueta" [attr.for]="idDe(campo)">{{ etiqueta }}@if (req) {<span class="obligatorio">*</span>}</label>
        <input [id]="idDe(campo)" [type]="tipo ?? 'text'" [class]="estilos.campo" [attr.inputmode]="modo ?? null" [attr.autocomplete]="auto ?? null"
               [attr.placeholder]="ph ?? null" [attr.list]="lista ?? null" [name]="campo" [ngModel]="valor(campo)"
               (ngModelChange)="poner(campo, $event)" (blur)="validar(campo)"
               [attr.aria-invalid]="errorDe(campo) ? true : null" [attr.aria-describedby]="errorDe(campo) ? 'err-' + idDe(campo) : null">
        @if (errorDe(campo); as e) { <p class="error-campo" [id]="'err-' + idDe(campo)">{{ e }}</p> }
      </div>
    </ng-template>

    <!-- Registrar cese -->
    @if (modal() === 'cese' && actual(); as p) {
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div [class]="caja + ' w-[min(100%,440px)]'" role="dialog" aria-modal="true" aria-labelledby="titulo-cese">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-cese" class="!m-0 text-[15px] font-extrabold">Registrar cese</h2>
              <p class="mt-0.5 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ p.nombres }} {{ p.apellidos }} · {{ p.subcartera }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrar()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="campo-grupo">
              <label [class]="estilos.etiqueta" for="c-fecha">Último día de trabajo</label>
              <input id="c-fecha" type="date" [class]="estilos.campo" [ngModel]="ceseFecha()" (ngModelChange)="ceseFecha.set($event); errorModal.set('')">
            </div>
            <div class="campo-grupo">
              <label [class]="estilos.etiqueta" for="c-motivo">Motivo</label>
              <select id="c-motivo" [class]="estilos.campo" [ngModel]="ceseMotivo()" (ngModelChange)="ceseMotivo.set($event)">
                @for (m of MOTIVOS_CESE; track m) { <option [value]="m">{{ m }}</option> }
              </select>
            </div>
            <div class="campo-grupo">
              <label [class]="estilos.etiqueta" for="c-comentario">Comentario</label>
              <input id="c-comentario" type="text" maxlength="300" [class]="estilos.campo" [ngModel]="ceseComentario()" (ngModelChange)="ceseComentario.set($event)">
            </div>
            <p class="efecto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
              <span>Sale del reporte de asistencia después de su último día. Sus semanas anteriores no cambian.</span>
            </p>
            @if (errorModal()) { <p class="error-campo">{{ errorModal() }}</p> }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrar()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarCese(p)" [disabled]="guardando()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>
              Registrar cese
            </button>
          </footer>
        </div>
      </div>
    }

    <!-- Cambiar subcartera -->
    @if (modal() === 'sub' && actual(); as p) {
      <div class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
        <div [class]="caja + ' w-[min(100%,440px)]'" role="dialog" aria-modal="true" aria-labelledby="titulo-sub">
          <header class="flex items-start justify-between gap-3 border-b border-[#e6e9ee] px-5 py-4 dark:border-slate-800">
            <div>
              <h2 id="titulo-sub" class="!m-0 text-[15px] font-extrabold">Cambiar subcartera</h2>
              <p class="mt-0.5 text-[12.5px] text-[#5f6c80] dark:text-slate-400">{{ p.nombres }} {{ p.apellidos }} · hoy en {{ p.subcartera }}</p>
            </div>
            <button type="button" [class]="estilos.botonIcono" (click)="cerrar()" aria-label="Cerrar">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </header>
          <div class="flex flex-1 flex-col gap-3.5 overflow-y-auto px-5 py-4">
            <div class="campos-2">
              <div class="campo-grupo">
                <label [class]="estilos.etiqueta" for="s-cartera">Cartera</label>
                <select id="s-cartera" [class]="estilos.campo" [ngModel]="subCartera()" (ngModelChange)="elegirCarteraSub($event)">
                  @for (c of subCarteras(); track c.id) { <option [ngValue]="c.id">{{ c.portfolioName }}</option> }
                </select>
              </div>
              <div class="campo-grupo">
                <label [class]="estilos.etiqueta" for="s-nueva">Nueva subcartera</label>
                <select id="s-nueva" [class]="estilos.campo" [ngModel]="subNueva()" (ngModelChange)="subNueva.set($event); errorModal.set('')">
                  @for (s of subSubcarteras(); track s.id) { <option [ngValue]="s.id">{{ s.subPortfolioName }}</option> }
                </select>
              </div>
            </div>
            <div class="campo-grupo">
              <label [class]="estilos.etiqueta" for="s-desde">Desde</label>
              <input id="s-desde" type="date" [class]="estilos.campo + ' !max-w-[200px]'" [ngModel]="subDesde()" (ngModelChange)="subDesde.set($event); errorModal.set('')">
            </div>
            <div class="campo-grupo">
              <label [class]="estilos.etiqueta" for="s-motivo">Motivo</label>
              <input id="s-motivo" type="text" maxlength="300" placeholder="Ej.: pasa a reforzar Tramo 5" [class]="estilos.campo"
                     [ngModel]="subMotivo()" (ngModelChange)="subMotivo.set($event); errorModal.set('')">
            </div>
            <p class="efecto">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
              <span>Desde esa fecha usa el horario, las reglas y el calendario de la nueva subcartera.</span>
            </p>
            @if (errorModal()) { <p class="error-campo">{{ errorModal() }}</p> }
          </div>
          <footer class="flex justify-end gap-2 border-t border-[#e6e9ee] px-5 py-3.5 dark:border-slate-800">
            <button type="button" [class]="estilos.botonSecundario" (click)="cerrar()">Cancelar</button>
            <button type="button" [class]="estilos.botonPrimario" (click)="guardarSub(p)" [disabled]="guardando()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
              Guardar cambio
            </button>
          </footer>
        </div>
      </div>
    }
  `
})
export class PersonalComponent implements OnInit {
  private readonly servicio = inject(AsistenciaService);
  private readonly clientesServicio = inject(TenantService);
  private readonly carterasServicio = inject(PortfolioService);
  private readonly toast = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly estilos = ESTILOS;
  protected readonly areas = AREAS;
  protected readonly porPagina = POR_PAGINA;
  protected readonly ids = CAMPOS_ID;
  protected readonly MOTIVOS_CESE = MOTIVOS_CESE;
  protected readonly ESTADOS_CIVILES = ESTADOS_CIVILES;
  protected readonly NACIONALIDADES = NACIONALIDADES;
  protected readonly DISTRITOS = DISTRITOS;
  protected readonly ESTADOS: { clave: Estado; texto: string }[] = [
    { clave: 'ACTIVO', texto: 'Activos' }, { clave: 'CESADO', texto: 'Cesados' }, { clave: '', texto: 'Todos' }
  ];
  protected readonly SECCIONES: { clave: Seccion; texto: string }[] = [
    { clave: 'laboral', texto: 'Laboral' }, { clave: 'datos', texto: 'Datos personales' }, { clave: 'historial', texto: 'Historial' }
  ];
  protected readonly PASTILLA = {
    ok: 'inline-flex items-center rounded-full bg-[#e8f5ec] px-[9px] py-[2px] text-[11.5px] font-bold text-[#166534] dark:bg-green-950/50 dark:text-green-300',
    tarde: 'inline-flex items-center rounded-full bg-[#fef6e0] px-[9px] py-[2px] text-[11.5px] font-bold text-[#92400e] dark:bg-amber-950/50 dark:text-amber-300',
    neutro: 'inline-flex items-center rounded-full bg-[#f1f3f6] px-[9px] py-[2px] text-[11.5px] font-bold text-[#5f6c80] dark:bg-slate-800 dark:text-slate-400'
  };
  protected readonly caja = 'pointer-events-auto flex max-h-[88vh] flex-col overflow-hidden rounded-[14px] border border-[#e6e9ee] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.22)] dark:border-slate-800 dark:bg-slate-900';

  /** Los avatares, ya confiados: son SVG propios, no vienen del usuario. */
  private readonly avatares: SafeHtml[] = AVATARES_PERSONAL.map(a =>
    this.sanitizer.bypassSecurityTrustHtml(a.replace('<svg ', '<svg width="100%" height="100%" ')));

  readonly fichas = signal<FichaPersonal[]>([]);
  readonly cargando = signal(false);
  readonly error = signal(false);
  readonly guardando = signal(false);

  readonly clientes = signal<Tenant[]>([]);
  readonly carteras = signal<Portfolio[]>([]);
  readonly subcarteras = signal<SubPortfolio[]>([]);
  readonly idCliente = signal<number | null>(null);
  readonly idCartera = signal<number | null>(null);
  readonly idSubcartera = signal<number | null>(null);
  readonly busqueda = signal('');
  readonly estado = signal<Estado>('ACTIVO');
  readonly pagina = signal(1);

  readonly modal = signal<Modal>(null);
  readonly idActual = signal<number | null>(null);
  readonly actual = computed(() => this.fichas().find(f => f.id === this.idActual()) ?? null);
  readonly seccion = signal<Seccion>('laboral');
  readonly tip = signal<{ nombre: string; detalle: string; x: number; y: number; tono: string } | null>(null);

  // ---------- Filtros ----------

  private readonly delAmbito = computed(() => {
    const cli = this.idCliente(), car = this.idCartera(), sub = this.idSubcartera();
    const q = this.busqueda().trim().toLowerCase();
    return this.fichas().filter(p => (!cli || p.idCliente === cli) && (!car || p.idCartera === car) && (!sub || p.idSubcartera === sub)
      && (!q || this.nombreLista(p).toLowerCase().includes(q) || (p.numeroDocumento ?? '').includes(q)
        || (p.usuario ?? '').toLowerCase().includes(q)))
      .sort((a, b) => this.nombreLista(a).localeCompare(this.nombreLista(b)));
  });
  readonly activos = computed(() => this.delAmbito().filter(p => !this.cesado(p)));
  readonly cesados = computed(() => this.delAmbito().filter(p => this.cesado(p)));
  readonly lista = computed(() => {
    const e = this.estado();
    return e === 'ACTIVO' ? this.activos() : e === 'CESADO' ? this.cesados() : this.delAmbito();
  });
  readonly visibles = computed(() => {
    const ini = (this.pagina() - 1) * POR_PAGINA;
    return this.lista().slice(ini, ini + POR_PAGINA);
  });
  readonly resumen = computed(() => {
    const a = this.activos().length, c = this.cesados().length;
    const sin = this.activos().filter(p => !p.idUsuario).length;
    return `${a} ${a === 1 ? 'activo' : 'activos'} · ${c} ${c === 1 ? 'cesado' : 'cesados'}`
      + (sin ? ` · ${sin} sin usuario de Cashi` : '');
  });
  readonly grupos = computed<Grupo[]>(() => {
    const porSub = new Map<number, Grupo>();
    for (const p of this.activos()) {
      if (p.idSubcartera == null) { continue; }
      const g = porSub.get(p.idSubcartera) ?? { idSubcartera: p.idSubcartera, subcartera: p.subcartera ?? '—',
        cartera: p.cartera ?? '', tono: tonoDe(p.subcartera), gente: [] };
      g.gente.push(p);
      porSub.set(p.idSubcartera, g);
    }
    return [...porSub.values()].sort((a, b) => b.gente.length - a.gente.length);
  });
  readonly haySinUsuario = computed(() => this.activos().some(p => !p.idUsuario));

  // ---------- Formulario ----------

  readonly editando = signal<FichaPersonal | null>(null);
  readonly form = signal<Form>(this.formVacio());
  readonly errores = signal<Partial<Record<Campo, string>>>({});
  readonly resumenErrores = signal<{ campo: Campo; mensaje: string }[]>([]);
  readonly errorForm = signal('');
  readonly usuariosLibres = signal<UsuarioLibre[]>([]);
  readonly usuariosDelForm = computed(() => {
    const e = this.editando();
    const libres = this.usuariosLibres();
    return e?.idUsuario && e.usuario && !libres.some(u => u.idUsuario === e.idUsuario)
      ? [{ idUsuario: e.idUsuario, usuario: e.usuario, nombre: null }, ...libres] : libres;
  });
  readonly ambitoForm = computed(() => {
    const e = this.editando();
    if (e) { return [e.cliente ?? '—', e.cartera ?? '—', e.subcartera ?? '—']; }
    const cli = this.clientes().find(c => c.id === this.idCliente());
    return [cli ? (cli.businessName || cli.tenantName) : '—',
      this.carteras().find(c => c.id === this.idCartera())?.portfolioName ?? '—',
      this.subcarteras().find(s => s.id === this.idSubcartera())?.subPortfolioName ?? '—'];
  });

  // ---------- Cese y cambio de subcartera ----------

  readonly errorModal = signal('');
  readonly ceseFecha = signal('');
  readonly ceseMotivo = signal(MOTIVOS_CESE[0]);
  readonly ceseComentario = signal('');
  readonly subCarteras = signal<Portfolio[]>([]);
  readonly subSubcarteras = signal<SubPortfolio[]>([]);
  readonly subCartera = signal<number | null>(null);
  readonly subNueva = signal<number | null>(null);
  readonly subDesde = signal('');
  readonly subMotivo = signal('');

  ngOnInit(): void {
    this.cargar();
    // Sin filtrar por `isActive`: el cliente real y varias de sus carteras
    // figuran como inactivos y la pantalla se quedaría vacía.
    this.clientesServicio.getAllTenants().subscribe({
      next: c => {
        const ordenados = [...c].sort((a, b) => (a.businessName || a.tenantName).localeCompare(b.businessName || b.tenantName));
        this.clientes.set(ordenados);
        if (ordenados.length === 1) { this.elegirCliente(ordenados[0].id); }
      },
      error: () => this.toast.error('No se pudieron cargar los clientes')
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(false);
    this.servicio.fichas().subscribe({
      next: f => { this.fichas.set(f); this.cargando.set(false); },
      error: () => { this.error.set(true); this.cargando.set(false); }
    });
  }

  @HostListener('window:scroll')
  ocultarTip(): void {
    this.tip.set(null);
  }

  @HostListener('document:keydown.escape')
  alEscape(): void {
    if (this.modal()) { this.cerrar(); }
  }

  // ---------- Ámbito ----------

  elegirCliente(id: number | null): void {
    this.idCliente.set(id);
    this.idCartera.set(null);
    this.idSubcartera.set(null);
    this.carteras.set([]);
    this.subcarteras.set([]);
    this.pagina.set(1);
    if (!id) { return; }
    this.carterasServicio.getPortfoliosByTenant(id).subscribe({
      next: c => this.carteras.set([...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName))),
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCartera(id: number | null): void {
    this.idCartera.set(id);
    this.idSubcartera.set(null);
    this.subcarteras.set([]);
    this.pagina.set(1);
    if (!id) { return; }
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subcarteras.set(ordenadas);
        if (ordenadas.length === 1) { this.idSubcartera.set(ordenadas[0].id); }
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  elegirSubcartera(id: number | null): void {
    this.idSubcartera.set(id);
    this.pagina.set(1);
  }

  // ---------- Lectura ----------

  cesado(p: FichaPersonal): boolean {
    return !!p.fechaCese && p.fechaCese < hoy();
  }

  nombreLista(p: FichaPersonal): string {
    return `${p.apellidos}, ${p.nombres}`;
  }

  nombreCorto(p: FichaPersonal): string {
    return `${p.nombres.split(' ')[0]} ${p.apellidos.split(' ')[0]}`;
  }

  dma(iso: string | null): string {
    return iso ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}` : '—';
  }

  /** «1 año 5 meses», contado hasta hoy o hasta su último día. */
  antiguedad(p: FichaPersonal): string {
    const fin = new Date(`${this.cesado(p) ? p.fechaCese : hoy()}T12:00:00`);
    const ini = new Date(`${p.fechaIngreso}T12:00:00`);
    if (fin < ini) { return '—'; }
    let meses = (fin.getFullYear() - ini.getFullYear()) * 12 + fin.getMonth() - ini.getMonth();
    if (fin.getDate() < ini.getDate()) { meses -= 1; }
    if (meses < 1) {
      const d = Math.round((fin.getTime() - ini.getTime()) / 86400000) + 1;
      return `${d} ${d === 1 ? 'día' : 'días'}`;
    }
    const a = Math.floor(meses / 12), m = meses % 12;
    return [a ? `${a} ${a === 1 ? 'año' : 'años'}` : '', m ? `${m} ${m === 1 ? 'mes' : 'meses'}` : ''].filter(Boolean).join(' ');
  }

  avatar(p: FichaPersonal): SafeHtml {
    return this.avatares[p.id % this.avatares.length];
  }

  tonoFicha(p: FichaPersonal): string {
    return p.idUsuario ? tonoDe(p.subcartera) : 'var(--tenue)';
  }

  sinUsuario(g: Grupo): number {
    return g.gente.filter(p => !p.idUsuario).length;
  }

  mostrarTip(ev: Event, p: FichaPersonal, tono: string): void {
    const r = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    this.tip.set({ nombre: `${p.nombres.split(' ')[0]} ${p.apellidos}`, detalle: p.usuario ?? 'Sin usuario de Cashi',
      x: r.left + r.width / 2, y: r.top, tono });
  }

  // ---------- Ficha ----------

  verFicha(p: FichaPersonal): void {
    this.tip.set(null);
    this.idActual.set(p.id);
    this.seccion.set('laboral');
    this.modal.set('ficha');
    setTimeout(() => document.getElementById('cerrar-ficha')?.focus());
  }

  cerrar(): void {
    this.modal.set(null);
    this.editando.set(null);
  }

  /** Después de guardar: la ficha nueva reemplaza a la vieja en la lista. */
  private reemplazar(f: FichaPersonal): void {
    this.fichas.update(lista => lista.some(x => x.id === f.id) ? lista.map(x => x.id === f.id ? f : x) : [...lista, f]);
  }

  // ---------- Formulario ----------

  abrirForm(p: FichaPersonal | null): void {
    this.editando.set(p);
    this.form.set(p ? {
      apellidos: p.apellidos, nombres: p.nombres, tipoDocumento: p.tipoDocumento, numeroDocumento: p.numeroDocumento ?? '',
      fechaNacimiento: p.fechaNacimiento ?? '', nacionalidad: p.nacionalidad ?? '', estadoCivil: p.estadoCivil ?? ESTADOS_CIVILES[0],
      telefonoMovil: p.telefonoMovil ?? '', telefonoFijo: p.telefonoFijo ?? '', correo: p.correo ?? '',
      direccion: p.direccion ?? '', distrito: p.distrito ?? '', fechaIngreso: p.fechaIngreso, idUsuario: p.idUsuario
    } : this.formVacio());
    this.errores.set({});
    this.resumenErrores.set([]);
    this.errorForm.set('');
    this.modal.set('form');
    this.servicio.usuariosLibres().subscribe({ next: u => this.usuariosLibres.set(u), error: () => this.usuariosLibres.set([]) });
    setTimeout(() => document.getElementById('p-apellidos')?.focus());
  }

  private formVacio(): Form {
    return { apellidos: '', nombres: '', tipoDocumento: 'DNI', numeroDocumento: '', fechaNacimiento: '', nacionalidad: 'Peruana',
      estadoCivil: ESTADOS_CIVILES[0], telefonoMovil: '', telefonoFijo: '', correo: '', direccion: '', distrito: '',
      fechaIngreso: '', idUsuario: null };
  }

  idDe(campo: string): string {
    return CAMPOS_ID[campo as Campo];
  }

  errorDe(campo: string): string | undefined {
    return this.errores()[campo as Campo];
  }

  valor(campo: Campo): unknown {
    return this.form()[campo];
  }

  poner(campo: Campo, valor: unknown): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    this.errorForm.set('');
    if (this.errores()[campo]) { this.validar(campo); }
  }

  /** El mensaje de un campo, o null si está bien. Se revisa al salir de él y al guardar. */
  private error_(campo: Campo): string | null {
    const f = this.form();
    const v = String(f[campo] ?? '').trim();
    switch (campo) {
      case 'apellidos': return v ? null : 'Escribe los apellidos';
      case 'nombres': return v ? null : 'Escribe los nombres';
      case 'numeroDocumento':
        if (!v) { return 'Escribe el número de documento'; }
        if (f.tipoDocumento === 'DNI' && !/^\d{8}$/.test(v)) { return 'El DNI tiene 8 dígitos'; }
        if (f.tipoDocumento === 'CE' && !/^[A-Za-z0-9]{8,12}$/.test(v)) { return 'El carné de extranjería tiene de 8 a 12 letras o números'; }
        return this.fichas().some(p => p.tipoDocumento === f.tipoDocumento && p.numeroDocumento === v && p.id !== this.editando()?.id)
          ? 'Ya hay alguien registrado con ese documento' : null;
      case 'fechaNacimiento': {
        if (!v) { return 'Pon la fecha de nacimiento'; }
        const edad = (new Date(`${hoy()}T12:00:00`).getTime() - new Date(`${v}T12:00:00`).getTime()) / (365.25 * 86400000);
        return edad < 18 ? 'Debe ser mayor de edad' : null;
      }
      case 'telefonoMovil':
        if (!v) { return 'Escribe el móvil'; }
        return /^9\d{8}$/.test(v) ? null : 'El móvil tiene 9 dígitos y empieza con 9';
      case 'correo': return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Revisa el correo';
      case 'fechaIngreso': return v ? null : 'Pon la fecha de ingreso';
      default: return null;
    }
  }

  validar(campo: Campo): string | null {
    const msg = this.error_(campo);
    this.errores.update(e => ({ ...e, [campo]: msg ?? undefined }));
    return msg;
  }

  enfocar(campo: Campo): void {
    document.getElementById(CAMPOS_ID[campo])?.focus();
  }

  guardarForm(): void {
    const lista = (Object.keys(CAMPOS_ID) as Campo[])
      .map(campo => ({ campo, mensaje: this.validar(campo) }))
      .filter((x): x is { campo: Campo; mensaje: string } => !!x.mensaje);
    this.resumenErrores.set(lista);
    if (lista.length) {
      setTimeout(() => document.getElementById('resumen-errores')?.focus());
      return;
    }
    const f = this.form();
    const limpio = (t: string) => t.trim() || null;
    const datos: DatosPersonal = {
      tipoDocumento: f.tipoDocumento, numeroDocumento: f.numeroDocumento.trim(), apellidos: f.apellidos.trim(), nombres: f.nombres.trim(),
      fechaNacimiento: f.fechaNacimiento, nacionalidad: limpio(f.nacionalidad), estadoCivil: limpio(f.estadoCivil),
      telefonoMovil: f.telefonoMovil.trim(), telefonoFijo: limpio(f.telefonoFijo), correo: limpio(f.correo),
      direccion: limpio(f.direccion), distrito: limpio(f.distrito), idUsuario: f.idUsuario, fechaIngreso: f.fechaIngreso,
      idSubcartera: this.editando() ? null : this.idSubcartera()
    };
    const e = this.editando();
    this.guardando.set(true);
    (e ? this.servicio.editarFicha(e.id, datos) : this.servicio.registrarFicha(datos)).subscribe({
      next: ficha => {
        this.guardando.set(false);
        this.reemplazar(ficha);
        this.cerrar();
        this.toast.success(e ? `Datos de ${this.nombreCorto(ficha)} guardados` : `${this.nombreCorto(ficha)} registrado en ${ficha.subcartera}`);
      },
      error: r => {
        this.guardando.set(false);
        this.errorForm.set(r?.error?.error ?? 'No se pudo guardar');
      }
    });
  }

  // ---------- Cese ----------

  abrirCese(p: FichaPersonal): void {
    this.idActual.set(p.id);
    this.ceseFecha.set(hoy());
    this.ceseMotivo.set(MOTIVOS_CESE[0]);
    this.ceseComentario.set('');
    this.errorModal.set('');
    this.modal.set('cese');
    setTimeout(() => document.getElementById('c-fecha')?.focus());
  }

  guardarCese(p: FichaPersonal): void {
    const f = this.ceseFecha();
    const error = !f ? 'Pon el último día de trabajo' : f < p.fechaIngreso ? 'El cese no puede ser antes del ingreso' : '';
    this.errorModal.set(error);
    if (error) { return; }
    this.guardando.set(true);
    this.servicio.registrarCese(p.id, { fecha: f, motivo: this.ceseMotivo(), comentario: this.ceseComentario().trim() || null }).subscribe({
      next: ficha => {
        this.guardando.set(false);
        this.reemplazar(ficha);
        this.cerrar();
        this.toast.success(`Cese de ${this.nombreCorto(ficha)} registrado`);
      },
      error: r => { this.guardando.set(false); this.errorModal.set(r?.error?.error ?? 'No se pudo registrar'); }
    });
  }

  // ---------- Cambio de subcartera ----------

  abrirSub(p: FichaPersonal): void {
    this.idActual.set(p.id);
    this.subCarteras.set([]);
    this.subSubcarteras.set([]);
    this.subCartera.set(null);
    this.subNueva.set(null);
    // Los cambios rigen desde un lunes: el próximo.
    this.subDesde.set(sumarDias(lunesDe(new Date()), 7));
    this.subMotivo.set('');
    this.errorModal.set('');
    this.modal.set('sub');
    if (!p.idCliente) { return; }
    this.carterasServicio.getPortfoliosByTenant(p.idCliente).subscribe({
      next: c => {
        const ordenadas = [...c].sort((a, b) => a.portfolioName.localeCompare(b.portfolioName));
        this.subCarteras.set(ordenadas);
        const otra = ordenadas.find(x => x.id !== p.idCartera) ?? ordenadas[0];
        if (otra) { this.elegirCarteraSub(otra.id); }
      },
      error: () => this.toast.error('No se pudieron cargar las carteras')
    });
  }

  elegirCarteraSub(id: number): void {
    this.subCartera.set(id);
    this.subNueva.set(null);
    this.carterasServicio.getSubPortfoliosByPortfolio(id).subscribe({
      next: s => {
        const ordenadas = [...s].sort((a, b) => a.subPortfolioName.localeCompare(b.subPortfolioName));
        this.subSubcarteras.set(ordenadas);
        this.subNueva.set(ordenadas[0]?.id ?? null);
      },
      error: () => this.toast.error('No se pudieron cargar las subcarteras')
    });
  }

  guardarSub(p: FichaPersonal): void {
    const nueva = this.subNueva(), desde = this.subDesde(), motivo = this.subMotivo().trim();
    const error = !nueva ? 'Elige la nueva subcartera' : nueva === p.idSubcartera ? 'Ya está en esa subcartera'
      : !desde ? 'Pon desde cuándo' : new Date(`${desde}T12:00:00`).getDay() !== 1 ? 'El cambio rige desde un lunes'
      : !motivo ? 'Escribe el motivo: queda en el historial' : '';
    this.errorModal.set(error);
    if (error || !nueva) { return; }
    this.guardando.set(true);
    this.servicio.cambiarSubcartera(p.id, { idSubcartera: nueva, fechaDesde: desde, motivo }).subscribe({
      next: ficha => {
        this.guardando.set(false);
        this.reemplazar(ficha);
        this.cerrar();
        const nombre = this.subSubcarteras().find(s => s.id === nueva)?.subPortfolioName ?? '';
        this.toast.success(`${this.nombreCorto(ficha)} pasa a ${nombre} desde el ${this.dma(desde).slice(0, 5)}`);
      },
      error: r => { this.guardando.set(false); this.errorModal.set(r?.error?.error ?? 'No se pudo guardar'); }
    });
  }
}
