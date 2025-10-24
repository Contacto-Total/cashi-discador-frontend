import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CallService } from '../../../core/services/call.service';
import { Call, CallDisposition, CompleteCallRequest } from '../../../core/models/call.model';
import { Contact } from '../../../core/models/contact.model';

@Component({
  selector: 'app-call-notes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './call-notes.component.html',
  styleUrls: ['./call-notes.component.css']
})
export class CallNotesComponent implements OnInit {
  @Input() call: Call | null = null;
  @Input() contact: Contact | null = null;

  @Output() notesComplete = new EventEmitter<void>();

  notesForm!: FormGroup;
  loading = false;

  dispositions = Object.values(CallDisposition);

  constructor(
    private fb: FormBuilder,
    private callService: CallService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.notesForm = this.fb.group({
      disposition: ['', Validators.required],
      notes: ['', Validators.required],
      scheduleCallback: [null]
    });
  }

  onSubmit(): void {
    if (this.notesForm.invalid || !this.call) {
      return;
    }

    this.loading = true;

    const request: CompleteCallRequest = {
      disposition: this.notesForm.value.disposition,
      notes: this.notesForm.value.notes,
      scheduleCallback: this.notesForm.value.scheduleCallback || undefined
    };

    this.callService.completeCall(this.call.callId, request).subscribe({
      next: () => {
        this.loading = false;
        this.notesComplete.emit();
      },
      error: (error) => {
        console.error('Error saving call notes:', error);
        this.loading = false;
      }
    });
  }

  onSkip(): void {
    if (confirm('Skip saving notes? The call will be marked without detailed notes.')) {
      this.notesComplete.emit();
    }
  }
}
