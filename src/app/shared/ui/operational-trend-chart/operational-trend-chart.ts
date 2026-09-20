import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OperationalTrendItem {
  month: string;
  submissionAmount: number;
  disbursedAmount: number;
}

@Component({
  selector: 'app-operational-trend-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-neutral-800">Tren Operasional</h2>
        <div class="flex items-center space-x-4 text-xs font-semibold text-neutral-600">
          <span class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-secondary-500"></span>
            Pengajuan
          </span>
          <span class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-200"></span>
            Pencairan
          </span>
        </div>
      </div>

      <!-- Dynamic Bar Chart Container -->
      <div class="mt-8 flex h-52 items-end justify-around gap-3 px-2">
        <ng-container *ngFor="let item of data">
          <div class="flex flex-col items-center gap-2 h-full justify-end">
            <div class="flex items-end gap-2 h-full">
              <div 
                class="w-10 sm:w-12 rounded-t-full bg-secondary-500 transition-all hover:opacity-80" 
                [style.height.%]="getPercentage(item.submissionAmount)"
                [title]="'Pengajuan: ' + item.submissionAmount">
              </div>
              <div 
                class="w-10 sm:w-12 rounded-t-full bg-emerald-200 transition-all hover:opacity-80" 
                [style.height.%]="getPercentage(item.disbursedAmount)"
                [title]="'Pencairan: ' + item.disbursedAmount">
              </div>
            </div>
            <span class="text-xs font-semibold text-neutral-600">{{ item.month }}</span>
          </div>
        </ng-container>
      </div>
    </div>
  `
})
export class OperationalTrendChart {
  @Input() data: OperationalTrendItem[] = [];

  private get maxVal(): number {
    if (!this.data || this.data.length === 0) return 1;
    return Math.max(...this.data.flatMap(d => [d.submissionAmount, d.disbursedAmount])) || 1;
  }

  getPercentage(val: number): number {
    return Math.max(8, Math.round((val / this.maxVal) * 100));
  }
}