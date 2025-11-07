import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { CampaignService } from '../../core/services/campaign.service';
import { Campaign, CampaignStatus, DialMode } from '../../core/models/campaign.model';

@Component({
  selector: 'app-campaign-form',
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
    MatNativeDateModule,
    MatSliderModule
  ],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.css']
})
export class CampaignFormComponent implements OnInit {
  campaignForm!: FormGroup;
  isEditMode = false;
  campaignId: number | null = null;
  loading = false;

  dialModes = Object.values(DialMode);
  statuses = Object.values(CampaignStatus);

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  initForm(): void {
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      status: [CampaignStatus.DRAFT, Validators.required],
      dialMode: [DialMode.MANUAL, Validators.required],
      startDate: [null],
      endDate: [null],
      maxAttempts: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
      retryInterval: [60, [Validators.required, Validators.min(1)]],
      callerId: [''],
      aggressiveness: [1.2, [Validators.min(1.0), Validators.max(2.0)]],
      intensidad: [50, [Validators.required, Validators.min(1), Validators.max(100)]]
    });

    // Show aggressiveness only for predictive mode
    this.campaignForm.get('dialMode')?.valueChanges.subscribe(value => {
      const aggressivenessControl = this.campaignForm.get('aggressiveness');
      if (value === DialMode.PREDICTIVE) {
        aggressivenessControl?.enable();
      } else {
        aggressivenessControl?.disable();
      }
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.campaignId = parseInt(id, 10);
      this.loadCampaign();
    }
  }

  loadCampaign(): void {
    if (!this.campaignId) return;

    this.loading = true;
    this.campaignService.getCampaignById(this.campaignId).subscribe({
      next: (campaign) => {
        this.campaignForm.patchValue({
          name: campaign.name,
          description: campaign.description,
          status: campaign.status,
          dialMode: campaign.dialMode,
          startDate: campaign.startDate ? new Date(campaign.startDate) : null,
          endDate: campaign.endDate ? new Date(campaign.endDate) : null,
          maxAttempts: campaign.maxAttempts,
          retryInterval: campaign.retryInterval,
          callerId: campaign.callerId,
          aggressiveness: campaign.aggressiveness,
          intensidad: campaign.intensidad || 50
        });
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.campaignForm.invalid) {
      return;
    }

    this.loading = true;
    const campaign: Campaign = this.campaignForm.value;

    const operation = this.isEditMode && this.campaignId
      ? this.campaignService.updateCampaign(this.campaignId, campaign)
      : this.campaignService.createCampaign(campaign);

    operation.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/campaigns']);
      },
      error: (error) => {
        console.error('Error saving campaign:', error);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/campaigns']);
  }

  formatAggressiveness(value: number): string {
    return value.toFixed(2);
  }

  formatIntensidad(value: number): string {
    return `${value}`;
  }
}
