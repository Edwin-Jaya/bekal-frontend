import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col justify-between rounded-[1.25rem] border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all hover:shadow-md">
      <span class="text-[0.6875rem] font-bold uppercase tracking-wider text-neutral-500">
        {{ title }}
      </span>
      <div class="my-2">
        <span class="text-2xl font-extrabold text-neutral-900 md:text-3xl">
          {{ value }}
        </span>
      </div>
      <span class="text-xs font-semibold" [ngClass]="subtextColorClass">
        {{ subtext }}
      </span>
    </div>
  `
})
export class MetricCard {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string;
  @Input({ required: true }) subtext!: string;
  @Input() subtextColor: 'purple' | 'green' | 'gray' = 'gray';

  get subtextColorClass(): string {
    switch (this.subtextColor) {
      case 'purple':
        return 'text-secondary-600';
      case 'green':
        return 'text-emerald-500';
      default:
        return 'text-neutral-400';
    }
  }
}