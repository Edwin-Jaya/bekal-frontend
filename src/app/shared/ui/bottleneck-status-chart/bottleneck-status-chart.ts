import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bottleneck-status-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-full flex-col justify-between rounded-[1.5rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h2 class="text-lg font-bold text-neutral-800">Bottleneck Status</h2>

      <!-- Donut Chart Container -->
      <div class="relative my-4 flex items-center justify-center">
        <svg class="h-44 w-44 -rotate-90 transform" viewBox="0 0 100 100">
          <!-- Background track -->
          <circle cx="50" cy="50" r="38" stroke="#f3e8ff" stroke-width="12" fill="transparent" />
          
          <!-- Outer Ring (Pending / Secondary Purple) -->
          <circle
            cx="50" cy="50" r="38"
            stroke="#a855f7" stroke-width="12"
            fill="transparent"
            stroke-dasharray="238"
            stroke-dashoffset="35"
            stroke-linecap="round"
          />

          <!-- Inner Ring (Disbursed / Green) -->
          <circle
            cx="50" cy="50" r="26"
            stroke="#10b981" stroke-width="8"
            fill="transparent"
            stroke-dasharray="163"
            stroke-dashoffset="30"
            stroke-linecap="round"
          />
        </svg>

        <!-- Center Label -->
        <div class="absolute flex flex-col items-center justify-center text-center">
          <span class="text-2xl font-black tracking-tight text-neutral-900">85%</span>
          <span class="text-[0.7rem] font-medium text-neutral-500">Efficiency</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="flex items-center justify-around text-xs font-semibold text-neutral-600">
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-secondary-600"></span>
          Pending
        </span>
        <span class="flex items-center gap-1.5">
          <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
          Disbursed
        </span>
      </div>
    </div>
  `
})
export class BottleneckStatusChart {}