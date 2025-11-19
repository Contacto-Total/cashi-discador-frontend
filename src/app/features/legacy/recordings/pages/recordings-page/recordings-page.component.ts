import { Component } from '@angular/core';
import { RecordingsTrackerComponent } from '../../components/recordings-tracker/recordings-tracker.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-recordings-page',
  standalone: true,
  imports: [RecordingsTrackerComponent, LucideAngularModule],
  templateUrl: './recordings-page.component.html',
  styleUrls: ['./recordings-page.component.scss']
})
export class RecordingsPageComponent {}
