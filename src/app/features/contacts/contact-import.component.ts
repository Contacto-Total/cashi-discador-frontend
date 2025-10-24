import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact-import',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="container">
      <h1>Import Contacts from CSV</h1>
      <mat-card>
        <div class="upload-area" (drop)="onDrop($event)" (dragover)="onDragOver($event)">
          <mat-icon>cloud_upload</mat-icon>
          <p>Drag and drop CSV file here</p>
          <p>or</p>
          <button mat-raised-button color="primary" (click)="fileInput.click()">
            Select File
          </button>
          <input #fileInput type="file" accept=".csv" (change)="onFileSelected($event)" style="display:none">
        </div>

        <div *ngIf="selectedFile">
          <p>Selected: {{ selectedFile.name }}</p>
          <button mat-raised-button color="accent" (click)="importFile()" [disabled]="importing">
            Import
          </button>
        </div>

        <mat-progress-bar *ngIf="importing" mode="indeterminate"></mat-progress-bar>

        <div *ngIf="result" class="result">
          <h3>Import Results</h3>
          <p>Success: {{ result.successCount }}</p>
          <p>Errors: {{ result.errorCount }}</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.container { padding: 24px; max-width: 800px; margin: 0 auto; } .upload-area { border: 2px dashed #ccc; padding: 60px; text-align: center; border-radius: 8px; } .result { margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px; }`]
})
export class ContactImportComponent {
  selectedFile: File | null = null;
  importing = false;
  result: any = null;

  constructor(private contactService: ContactService, private router: Router) {}

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  importFile(): void {
    if (!this.selectedFile) return;

    this.importing = true;
    const mapping = { firstName: 'firstName', lastName: 'lastName', phoneNumber: 'phoneNumber', email: 'email' };

    this.contactService.importContacts(1, this.selectedFile, mapping).subscribe({
      next: (result) => {
        this.result = result;
        this.importing = false;
      },
      error: (error) => {
        console.error('Import error:', error);
        this.importing = false;
      }
    });
  }
}
