import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { AmdTestService, AmdEvent, UploadResponse } from './amd-test.service';

@Component({
  selector: 'app-amd-test',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './amd-test.component.html',
  styleUrls: ['./amd-test.component.css'],
})
export class AmdTestComponent implements OnDestroy {
  // Estado de upload
  selectedFile: File | null = null;
  isDragging = false;
  uploading = false;
  uploadError: string | null = null;

  // Estado del job
  jobId: string | null = null;
  wavInfo: AmdEvent | null = null;
  events: AmdEvent[] = [];
  decision: AmdEvent | null = null;
  finished = false;

  private wsHandle: { close: () => void } | null = null;

  constructor(private service: AmdTestService) {}

  ngOnDestroy(): void {
    this.wsHandle?.close();
  }

  // ── Drag & drop ───────────────────────────────────────────────────
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.name.toLowerCase().endsWith('.wav')) {
      this.uploadError = 'Solo se aceptan archivos .wav';
      return;
    }
    this.uploadError = null;
    this.selectedFile = file;
    this.startTest();
  }

  // ── Upload + WS ──────────────────────────────────────────────────
  startTest(): void {
    if (!this.selectedFile) return;

    this.resetState();
    this.uploading = true;

    this.service.upload(this.selectedFile).subscribe({
      next: (res: UploadResponse) => {
        this.jobId = res.job_id;
        this.uploading = false;
        this.connectProgress(res.job_id);
      },
      error: (err) => {
        this.uploading = false;
        this.uploadError = `Error subiendo audio: ${err.message || err.statusText || 'desconocido'}`;
      },
    });
  }

  private connectProgress(jobId: string): void {
    const { events$, close } = this.service.openProgress(jobId);
    this.wsHandle = { close };

    events$.subscribe({
      next: (event: AmdEvent) => {
        this.events.push(event);

        switch (event['type']) {
          case 'wav_info':
            this.wavInfo = event;
            break;
          case 'decision':
            this.decision = event;
            break;
          case 'end':
          case 'ws_closed':
          case 'timeout':
            this.finished = true;
            break;
        }
      },
      error: () => {
        this.finished = true;
      },
      complete: () => {
        this.finished = true;
      },
    });
  }

  reset(): void {
    this.wsHandle?.close();
    this.resetState();
    this.selectedFile = null;
  }

  private resetState(): void {
    this.jobId = null;
    this.wavInfo = null;
    this.events = [];
    this.decision = null;
    this.finished = false;
    this.uploadError = null;
  }

  // ── Helpers para template ────────────────────────────────────────
  formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  eventClass(type: string): string {
    switch (type) {
      case 'decision':
        return 'event-decision';
      case 'error':
      case 'ws_error':
        return 'event-error';
      case 'chunk':
        return 'event-chunk';
      case 'analysis':
        return 'event-analysis';
      case 'whisper_running':
      case 'whisper_pending':
        return 'event-whisper';
      case 'wav_info':
      case 'converted':
      case 'connecting':
      case 'start':
        return 'event-info';
      case 'end':
      case 'ws_closed':
        return 'event-end';
      default:
        return '';
    }
  }
}
