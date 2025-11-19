import { Component } from '@angular/core';
import { AgreementsPageComponent } from './pages/agreements-page/agreements-page.component';

@Component({
  selector: 'app-agreements',
  standalone: true,
  imports: [AgreementsPageComponent],
  template: '<app-agreements-page></app-agreements-page>'
})
export class AgreementsComponent {}
