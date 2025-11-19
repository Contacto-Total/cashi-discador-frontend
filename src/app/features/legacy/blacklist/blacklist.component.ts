import { Component } from '@angular/core';
import { BlacklistPageComponent } from './pages/blacklist-page/blacklist-page.component';

@Component({
  selector: 'app-blacklist',
  standalone: true,
  imports: [BlacklistPageComponent],
  template: '<app-blacklist-page></app-blacklist-page>'
})
export class BlacklistComponent {}
