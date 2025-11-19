import { Component, Input, Output, EventEmitter, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynQueryService } from '../../services/dyn-query.service';
import { PreviewStepResp, PreviewCandidate, PreviewItem } from '../../models/dyn-query.model';

export interface RoundWizardModalData {
  sessionId: string;
  init: PreviewStepResp;
  template: string;
}

@Component({
  selector: 'app-round-wizard-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="$event.stopPropagation()">
      <div class="modal-content round-wizard-modal" (click)="$event.stopPropagation()">
        <div class="dlg">
          <header class="dlg__head">
            <h2>¿Completar con otro importe?</h2>
          </header>

          <section class="dlg__body">
            <!-- STATS -->
            <div class="group-card">
              <div class="group-title">Progreso</div>
              <div class="stats">
                <div class="stat"><span>Total</span><b>{{ state().total }}</b></div>
                <div class="stat"><span>Resueltas</span><b class="ok">{{ state().resueltas }}</b></div>
                <div class="stat"><span>Pendientes</span><b class="warn">{{ state().pendientes }}</b></div>
              </div>
            </div>

            <!-- CANDIDATAS -->
            <div class="group-card">
              <div class="group-title">Opciones</div>

              <ng-container *ngIf="state().candidatas?.length; else noCand">
                <div class="chip-container">
                  <button type="button" class="chip"
                          *ngFor="let c of state().candidatas"
                          (click)="choose(c.variable)">
                    <span class="chip__var">{{ pretty(c.variable) }}</span>
                    <span class="chip__count">{{ c.filasQueResuelve }} casos</span>
                  </button>
                </div>
              </ng-container>
              <ng-template #noCand>
                <div class="muted">No existen casos para resolver.</div>
              </ng-template>
            </div>

            <!-- PREVIEW -->
            <div class="group-card">
              <div class="group-title">Previsualización</div>
              <div class="preview-list">
                <div class="pv-item" *ngFor="let p of (state().muestraPreview || [])">
                  <div class="pv-left">
                    <div class="pv-doc">{{ p.documento || '(sin doc.)' }}</div>
                    <div class="pv-nom muted">{{ p.nombre }}</div>
                    <div class="pv-meta">
                      <span>Usada: <b>{{ pretty(p.variableUsada) || '—' }}</b></span>
                      <span>Valor: <b>{{ p.valorUsado ?? '—' }}</b></span>
                    </div>
                  </div>
                  <div class="pv-sms preview-box">{{ p.sms }}</div>
                </div>
              </div>
            </div>
          </section>

          <footer class="dlg__foot">
            <button type="button" class="btn btn-secondary" (click)="skip()" [disabled]="loading()">Omitir</button>
            <span class="spacer"></span>
            <button type="button" class="btn btn-primary" (click)="download()" [disabled]="loading()">
              Generar
            </button>
          </footer>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
      animation: slideUp 0.3s ease-out;
      display: flex;
      flex-direction: column;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .round-wizard-modal {
      width: 820px;
      max-width: 90vw;
    }

    .dlg {
      width: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      max-height: 80vh;
    }

    .dlg__head {
      display: flex;
      align-items: center;
      gap: 22px;
      padding: 14px 18px;
      border-bottom: 1px solid #e5e7eb;
      justify-content: center;
    }

    .dlg__head h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
    }

    .dlg__body {
      flex: 1 1 auto;
      overflow: auto;
    }

    .dlg__foot {
      padding: 12px 18px;
      border-top: 1px solid #e5e7eb;
      background: #fff;
      box-shadow: 0 -6px 12px -10px rgba(0,0,0,.12);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .spacer {
      flex: 1;
    }

    .group-card {
      border: 1px solid #e5e7eb;
      background: #fff;
      border-radius: 12px;
      padding: 12px;
      margin: 20px 15px;
    }

    .group-title {
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .stat {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 10px 12px;
      background: #fafafa;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .stat span {
      color: #6b7280;
      font-size: .9rem;
    }

    .stat b {
      font-size: 1rem;
    }

    .stat b.ok {
      color: #059669;
    }

    .stat b.warn {
      color: #b45309;
    }

    .chip-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: center;
    }

    .chip {
      appearance: none;
      border: 1px solid #dfe3ee;
      background: #f8f9fc;
      color: #111827;
      border-radius: 999px;
      padding: 8px 14px;
      font-weight: 600;
      line-height: 1.1;
      cursor: pointer;
      transition: background .15s, border-color .15s, transform .04s;
      box-shadow: 0 1px 0 rgba(0,0,0,.02);
    }

    .chip:hover {
      background: #f8fafc;
    }

    .chip:active {
      transform: translateY(1px);
    }

    .chip:focus-visible {
      outline: 2px solid #6366f1;
      outline-offset: 2px;
    }

    .chip__var {
      margin-right: 8px;
    }

    .chip__count {
      font-size: 12px;
      color: #4b5563;
    }

    .preview-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .pv-item {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 12px;
      background: #fff;
    }

    .pv-left {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .pv-doc {
      font-weight: 600;
      font-size: 13px;
    }

    .pv-meta {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #334155;
    }

    .muted {
      color: #6b7280;
    }

    .preview-box {
      background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      color: #fff;
      padding: 12px;
      border-radius: 12px;
      min-height: 85px;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
      color: white;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
    }

    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 720px) {
      .pv-item {
        grid-template-columns: 1fr;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundWizardModalComponent {
  @Input() isOpen = false;
  @Input() data: RoundWizardModalData | null = null;
  @Output() closed = new EventEmitter<void>();

  private api = inject(DynQueryService);

  private prettyMap: Record<string, string> = {
    'LTD': 'LTD',
    'LTDE': 'LTDE',
    'PKM': 'PKM',
    'SALDO_MORA': 'Saldo Mora',
    'BAJA30': 'Baja 30',
    'BAJA30_SALDOMORA': 'Baja 30 + Mora',
    'CAPITAL': 'Capital',
    'DEUDA_TOTAL': 'Deuda Total',
    'NOMBRECOMPLETO': 'Nombre completo',
    'NUMCUENTAPMCP': 'N° de Cuenta',
    'DIASMORA': 'Días mora',
    'LTD_LTDE': 'LTD + LTDE'
  };

  state = signal<PreviewStepResp>(this.data?.init || {} as PreviewStepResp);
  loading = signal(false);

  ngOnChanges() {
    if (this.data?.init) {
      this.state.set(this.data.init);
    }
  }

  pretty(v: string | null | undefined): string {
    const key = (v ?? '').toUpperCase();
    if (!key) return '';
    if (this.prettyMap[key]) return this.prettyMap[key];

    return key
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\p{L}/gu, m => m.toUpperCase());
  }

  choose(variable: string) {
    if (!this.data?.sessionId) return;

    this.loading.set(true);
    this.api.previewChoose(this.data.sessionId, variable).subscribe({
      next: (res) => {
        this.state.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  skip() {
    if (!this.data?.sessionId) return;

    this.loading.set(true);
    this.api.previewDownloadBase(this.data.sessionId).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, 'sms_report_base');
        this.loading.set(false);
        this.closed.emit();
      },
      error: () => this.loading.set(false)
    });
  }

  download() {
    if (!this.data?.sessionId) return;

    this.loading.set(true);
    this.api.previewDownload(this.data.sessionId).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, 'sms_report');
        this.loading.set(false);
        this.closed.emit();
      },
      error: () => this.loading.set(false)
    });
  }

  private downloadBlob(blob: Blob, prefix: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${prefix}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  close() {
    this.closed.emit();
  }
}
