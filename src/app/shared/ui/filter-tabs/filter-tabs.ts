import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filter-tabs.html'
})
export class FilterTabs {
  @Input() tabs: string[] = ['All', 'Active Only'];
  @Input() activeTab: string = 'All';
  @Output() tabChanged = new EventEmitter<string>();

  selectTab(tab: string): void {
    this.activeTab = tab;
    this.tabChanged.emit(tab);
  }
}