import { Component } from '@angular/core';
import { RangeSliderComponent } from '../../components/range-slider/range-slider.component';

@Component({
  selector: 'app-campaign-page',
  standalone: true,
  imports: [RangeSliderComponent],
  templateUrl: './campaign-page.component.html',
  styleUrl: './campaign-page.component.css'
})
export class CampaignPageComponent {

}
