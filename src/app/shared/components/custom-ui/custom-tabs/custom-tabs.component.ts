import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
  title: string;
  content?: any;
}

@Component({
  selector: 'app-custom-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-tabs.component.html',
  styleUrls: ['./custom-tabs.component.scss']
})
export class CustomTabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeIndex: number = 0;
  @Output() activeIndexChange = new EventEmitter<number>();
  @Output() tabChange = new EventEmitter<number>();

  selectTab(index: number): void {
    if (this.activeIndex !== index) {
      this.activeIndex = index;
      this.activeIndexChange.emit(index);
      this.tabChange.emit(index);
    }
  }
}
