import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="container">
      <h1>{{ isEditMode ? 'Edit' : 'New' }} Contact</h1>
      <mat-card>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Phone Number</mat-label>
            <input matInput formControlName="phoneNumber">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Campaign ID</mat-label>
            <input matInput formControlName="campaignId" type="number">
          </mat-form-field>
          <div class="actions">
            <button mat-button type="button" (click)="onCancel()">Cancel</button>
            <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`.container { padding: 24px; max-width: 800px; margin: 0 auto; } .full-width { width: 100%; display: block; margin-bottom: 16px; } .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }`]
})
export class ContactFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  contactId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: [''],
      campaignId: [null, Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactId = parseInt(id);
      this.contactService.getContactById(this.contactId).subscribe(contact => {
        this.form.patchValue(contact);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const operation = this.isEditMode && this.contactId
      ? this.contactService.updateContact(this.contactId, this.form.value)
      : this.contactService.createContact(this.form.value);

    operation.subscribe(() => {
      this.router.navigate(['/contacts']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/contacts']);
  }
}
