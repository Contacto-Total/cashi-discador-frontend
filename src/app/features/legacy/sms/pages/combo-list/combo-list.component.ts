import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LucideAngularModule, Plus, Eye, Edit, X, Download, Trash2, Inbox, Info, XCircle, Search, MessageSquare, Tags, FileBadge } from 'lucide-angular';
import { ComboService } from '../../services/combo.service';
import { ComboResponse } from '../../models/combo.model';
import { toSignal } from "@angular/core/rxjs-interop";
import { finalize, startWith } from "rxjs";
import { Row } from "../../models/dyn-query.model";
import { Router } from '@angular/router';
import { renderPreviewMessage, smsSegmentsLen } from '../../utils/sms-utils';
import { EditComboModalComponent } from '../../components/edit-combo-modal/edit-combo-modal.component';
import { ThemeService } from '../../../../../shared/services/theme.service';

type ChipKey =
  | 'NOMBRE'
  | 'LTD'
  | 'LTDE'
  | 'LTD_LTDE'
  | 'BAJA30'
  | 'SALDO_MORA'
  | 'BAJA30_SALDOMORA'
  | 'PKM'
  | 'CAPITAL'
  | 'DEUDA_TOTAL'
  | 'HOY'
  | 'MANANA'
  | 'NOMBRECOMPLETO'
  | 'EMAIL'
  | 'NUMCUENTAPMCP'
  | 'DIASMORA';


@Component({
  selector: 'app-combo-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    EditComboModalComponent
  ],
  templateUrl: './combo-list.component.html',
  styleUrl: './combo-list.component.scss'
})
export class ComboListComponent {
  // Lucide icons
  readonly Plus = Plus;
  readonly Eye = Eye;
  readonly Edit = Edit;
  readonly X = X;
  readonly XCircle = XCircle;
  readonly Download = Download;
  readonly Trash2 = Trash2;
  readonly Inbox = Inbox;
  readonly Info = Info;
  readonly Search = Search;
  readonly MessageSquare = MessageSquare;
  readonly Tags = Tags;
  readonly FileBadge = FileBadge;

  private api = inject(ComboService);
  fb = inject(FormBuilder);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  isDarkMode = this.themeService.isDarkMode;

  previewSms = signal<string | null>(null);
  smsLen = (t: string) => smsSegmentsLen(t);

  // Modal de edición
  editModalOpen = signal(false);
  editingCombo = signal<ComboResponse | null>(null);

  openEdit(c: ComboResponse) {
    this.editingCombo.set(c);
    this.editModalOpen.set(true);
    this.lockBodyScroll(true);
  }

  closeEditModal() {
    this.editModalOpen.set(false);
    this.editingCombo.set(null);
    this.lockBodyScroll(false);
  }

  onComboSaved() {
    this.load(); // Recargar la lista
  }

  selectedCombo = signal<ComboResponse | null>(null);

  // ---- Preview (side sheet) ----
  previewOpen = signal(false);
  previewTitle = signal<string>('');
  previewRow = signal<Row | null>(null);
  previewLoading = signal(false);

  // orden/alias visual para las claves más comunes
  private previewOrder: Array<keyof Row> = [
    'DOCUMENTO', 'TELEFONOCELULAR', 'NOMBRE', 'BAJA30', 'DEUDA_TOTAL'
  ];
  private labelOf(k: string) {
    // alias visuales
    if (k === 'TELEFONOCELULAR') return 'TELÉFONO';
    if (k === 'DEUDA_TOTAL') return 'DEUDA TOTAL';
    return k.replaceAll('_', ' ').toUpperCase();
  }

  preview(c: ComboResponse) {
    this.lockBodyScroll(true);
    this.previewOpen.set(true);
    this.previewTitle.set(`${c.name}`);
    this.previewLoading.set(true);
    this.previewRow.set(null);
    this.previewSms.set(null);
    this.selectedCombo.set(c);

    // 1) Traer filas (preview)
    this.api.previewFromCombo(c.id, 1000).subscribe({
      next: rows => {
        const first = rows?.[0] ?? {};
        this.previewRow.set(first);

        const renderYMostrar = (tpl: string) => {
          const rendered = renderPreviewMessage(tpl || '', first);
          this.previewSms.set(rendered || '(sin texto)');
          this.previewLoading.set(false);
        };

        // 2) Obtener texto de plantilla
        //   - si ya vino embebido en el combo, úsalo
        if ((c as any).plantillaTexto) {
          renderYMostrar((c as any).plantillaTexto as string);
        } else if (c.plantillaSmsId) {
          this.api.getPlantillaTexto(c.plantillaSmsId).subscribe({
            next: (res: any) => renderYMostrar(typeof res === 'string' ? res : (res?.template ?? '')),
            error: _ => { this.previewSms.set('(no se pudo cargar el texto)'); this.previewLoading.set(false); }
          });
        } else {
          // sin plantilla: al menos cierra el loading
          this.previewSms.set('(sin texto de SMS)');
          this.previewLoading.set(false);
        }
      },
      error: _ => {
        this.previewLoading.set(false);
        this.previewSms.set('(error al obtener preview)');
      }
    });
  }


  // estado
  all = signal<ComboResponse[]>([]);
  loading = signal(false);

  // filtros
  chips: { key: ChipKey; label: string }[] = [
    { key: 'NOMBRE', label: 'Nombre' },
    { key: 'LTD', label: 'LTD' },
    { key: 'LTDE', label: 'LTDE' },
    { key: 'LTD_LTDE', label: 'LTD + LTDE' },     // solo visual
    { key: 'BAJA30', label: 'Baja 30' },
    { key: 'SALDO_MORA', label: 'Mora' },
    { key: 'BAJA30_SALDOMORA', label: 'Baja30 + Mora' },
    { key: 'PKM', label: 'PKM' },
    { key: 'CAPITAL', label: 'Capital' },
    { key: 'DEUDA_TOTAL', label: 'Deuda Total' },
    { key: 'MANANA', label: 'Mañana' },
    { key: 'HOY', label: 'Hoy' },
    { key: 'NOMBRECOMPLETO', label: 'Nombre Completo' },
    { key: 'EMAIL', label: 'Correo' },
    { key: 'NUMCUENTAPMCP', label: 'Número de Cuenta' },
    { key: 'DIASMORA', label: 'Días Mora' },

  ];

  selected = signal<Set<ChipKey>>(new Set());

  form = this.fb.nonNullable.group({
    q: '',
    tramo: 'ALL' as 'ALL' | '3' | '5' | 'CONTACTO_TOTAL',
    soloActivos: true
  });

  filtersSig = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() }
  );

  // derivado: lista filtrada
  filtered = computed(() => {
    const { q, tramo, soloActivos } = this.filtersSig();
    const keys = this.selected();

    const qn = (q ?? '').trim().toLowerCase();

    return this.all().filter(c => {
      if (soloActivos && !c.isActive) return false;
      if (tramo !== 'ALL' && c.tramo !== tramo) return false;

      if (keys.size) {
        const s = new Set(c.selects ?? []);
        const hasNombre =
          s.has('NOMBRE' as any) || /\{NOMBRE\}/i.test(c.plantillaTexto || '');

        for (const k of keys) {
          if (k === 'NOMBRE') {
            if (!hasNombre) return false;   // ahora sí filtra por NOMBRE
            continue;
          }
          if (!s.has(k)) return false;
        }
      }

      if (qn) {
        const hay = (c.name ?? '').toLowerCase().includes(qn) ||
          (c.plantillaTexto ?? '').toLowerCase().includes(qn);
        if (!hay) return false;
      }

      return true;
    });
  });

  // Modal states
  alertMessage = signal<string>('');
  loadingModal = signal<{ isOpen: boolean; data?: { title: string; subtitle?: string } }>({ isOpen: false });

  constructor() {
    this.load();
    effect(() => this.filtered());
  }

  load() {
    this.loading.set(true);
    this.api.list().subscribe({
      next: rs => { this.all.set(rs ?? []); this.loading.set(false); },
      error: _ => { this.all.set([]); this.loading.set(false); }
    });
  }

  trackById(_i: number, r: ComboResponse) { return r.id; }

  // chips
  isSelected(key: ChipKey) { return this.selected().has(key); }
  toggleChip(key: ChipKey) {
    const set = new Set(this.selected());
    set.has(key) ? set.delete(key) : set.add(key);
    this.selected.set(set); // filtered() se recalcula
  }
  clearChips() { this.selected.set(new Set()); }


  private buildDownloadName(c: ComboResponse): string {
    const date = new Date().toISOString().slice(0, 10);

    // base = nombre del combo (o fallback por si viniera vacío)
    const base = (c.name ?? `combo_${c.id}`).trim();

    // saneamos caracteres que rompen nombres en Windows/macOS
    const safe = base
      .replace(/[<>:"/\\|?*]+/g, '') // quita caracteres prohibidos
      .replace(/\s+/g, ' ')          // colapsa espacios
      .slice(0, 150);                // límite defensivo

    return `${safe} - ${date}.xlsx`;
  }


  /** Pop-up reutilizable */
  private alert(message: string, title = 'Aviso') {
    this.alertMessage.set(message);
  }

  closeAlert() {
    this.alertMessage.set('');
  }

  export(c: ComboResponse) {
    const id = c.id;

    // Abre el loader
    this.loadingModal.set({
      isOpen: true,
      data: { title: 'Generando Excel…', subtitle: 'Preparando datos y creando archivo' }
    });

    // 1) Precheck del combo (backend calcula usando la plantilla del combo)
    this.api.precheck(id).subscribe({
      next: (res) => {
        if (!res.ok) {
          // Cierra loader y muestra detalle del porqué no pasa el límite
          this.loadingModal.set({ isOpen: false });

          const header = `${res.excedidos} ${res.excedidos === 1 ? 'fila' : 'filas'} superan los caracteres.`;

          const ejemplosTxt = (res.ejemplos ?? [])
            .map((e, i) => `• ${e.len} caracteres — DNI: ${e.documento || '(sin DNI)'}`)
            .join('\n');

          this.alert(
            `${header}\n\nPrimeros ${Math.min((res.ejemplos ?? []).length, 3)} casos:\n${ejemplosTxt}`,
            'Mensaje demasiado largo'
          );
          return;
        }

        // 2) Exportar (el backend devolverá 422 si no hay filas)
        this.api.exportFromCombo(id).pipe(finalize(() => this.loadingModal.set({ isOpen: false })))
          .subscribe({
            next: (blob) => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = this.buildDownloadName(c);
              document.body.appendChild(a); a.click(); a.remove();
              URL.revokeObjectURL(url);
            },
            error: (err) => {
              this.loadingModal.set({ isOpen: false });
              // 422 => backend detectó "sin filas para exportar"
              const msg =
                err?.status === 422
                  ? (err?.error?.message || 'No hay filas para exportar con los filtros seleccionados.')
                  : (err?.error?.message || err?.message || 'Ocurrió un error al exportar.');
              this.alert(msg, err?.status === 422 ? 'Sin resultados' : 'Error');
            }
          });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'No se pudo validar el SMS del combo.';
        this.alert(msg, 'Error en precheck');
      }
    });
  }

  // acciones desde el sheet
  exportSelected() {
    const c = this.selectedCombo();
    if (!c) return;
    this.export(c);
  }

  removeSelected() {
    const c = this.selectedCombo();
    if (!c) return;
    if (!confirm(`¿Eliminar el combo "${c.name}"?`)) return;
    this.api.delete(c.id).subscribe(() => {
      this.closePreview();
      this.load();
    });
  }

  closePreview() {
    this.previewOpen.set(false);
    this.lockBodyScroll(false);
    this.previewSms.set('');
    this.previewSms.set(null);
    this.previewRow.set(null);
    this.selectedCombo.set(null);
  }


  // devuelve pares [label, value] en orden bonito (si existen), y luego el resto
  previewPairs() {
    const row = this.previewRow();
    if (!row) return [] as Array<[string, string | number]>;

    const used = new Set<string>();
    const primary: Array<[string, string | number]> = [];
    for (const k of this.previewOrder) {
      if (row[k] !== undefined) {
        primary.push([this.labelOf(String(k)), row[k] as any]);
        used.add(String(k));
      }
    }
    const rest: Array<[string, string | number]> = [];
    for (const [k, v] of Object.entries(row)) {
      if (!used.has(k)) rest.push([this.labelOf(k), v as any]);
    }
    return [...primary, ...rest];
  }

  New() {
    this.router.navigate(['/sms/dynamic']);
  }


  remove(c: ComboResponse) {
    if (!confirm(`¿Eliminar el combo "${c.name}"?`)) return;
    this.api.delete(c.id).subscribe(() => this.load());
  }


  private savedScrollTop = 0;

  private lockBodyScroll(lock: boolean) {
    const body = document.body;
    if (lock) {
      this.savedScrollTop = window.scrollY || window.pageYOffset || 0;
      body.style.top = `-${this.savedScrollTop}px`;
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
      body.style.top = '';
      window.scrollTo(0, this.savedScrollTop || 0);
    }
  }


  visibleTags(c: ComboResponse) {
    const out = [...(c.selects ?? [])];
    if (/\{NOMBRE\}/i.test(c.plantillaTexto || '') && !out.includes('NOMBRE' as any)) {
      out.unshift('NOMBRE' as any);
    }
    return out;
  }

  protected readonly Math = Math;
}
