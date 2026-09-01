import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

      <!-- Custom Bar Chart Container -->
      <div class="mt-8 flex h-52 items-end justify-around gap-3 px-2">
        <!-- Pair 1 -->
        <div class="flex items-end gap-2 h-full">
          <div class="w-12 rounded-t-full bg-secondary-200 transition-all hover:opacity-80" style="height: 60%;"></div>
          <div class="w-12 rounded-t-full bg-emerald-100 transition-all hover:opacity-80" style="height: 40%;"></div>
        </div>

        <!-- Pair 2 -->
        <div class="flex items-end gap-2 h-full">
          <div class="w-12 rounded-t-full bg-secondary-200 transition-all hover:opacity-80" style="height: 80%;"></div>
          <div class="w-12 rounded-t-full bg-emerald-100 transition-all hover:opacity-80" style="height: 55%;"></div>
        </div>

        <!-- Pair 3 -->
        <div class="flex items-end gap-2 h-full">
          <div class="w-12 rounded-t-full bg-secondary-200 transition-all hover:opacity-80" style="height: 95%;"></div>
          <div class="w-12 rounded-t-full bg-emerald-100 transition-all hover:opacity-80" style="height: 70%;"></div>
        </div>
      </div>
    </div>
  `
})
export class OperationalTrendChart {}