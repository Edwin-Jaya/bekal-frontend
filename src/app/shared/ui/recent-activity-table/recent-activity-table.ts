import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ActivityLog {
  date: string;
  applicant: string;
  amount: string;
  status: 'Review' | 'Approved' | 'Rejected';
  responsible: string;
}

@Component({
  selector: 'app-recent-activity-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-[1.5rem] border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md">
      <h2 class="mb-6 text-lg font-bold text-neutral-800">Log Aktivitas & Pengajuan Terbaru</h2>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-neutral-700">
          <thead>
            <tr class="border-b border-neutral-200/60 text-[0.6875rem] font-bold uppercase tracking-wider text-neutral-400">
              <th class="pb-3 pl-2">Date</th>
              <th class="pb-3">Applicant</th>
              <th class="pb-3">Amount</th>
              <th class="pb-3">Status</th>
              <th class="pb-3 pr-2">Responsible</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100 font-medium">
            <tr *ngFor="let log of logs" class="transition-colors hover:bg-white/40">
              <td class="py-4 pl-2 text-neutral-500">{{ log.date }}</td>
              <td class="py-4 font-semibold text-neutral-900">{{ log.applicant }}</td>
              <td class="py-4 font-bold text-neutral-800">{{ log.amount }}</td>
              <td class="py-4">
                <span
                  class="inline-block rounded-full px-3 py-1 text-xs font-semibold"
                  [ngClass]="getStatusBadgeClass(log.status)"
                >
                  {{ log.status }}
                </span>
              </td>
              <td class="py-4 pr-2 text-neutral-600">{{ log.responsible }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RecentActivityTable {
  logs: ActivityLog[] = [
    { date: '24 Oct 2023', applicant: 'Andi Wijaya', amount: 'Rp 250M', status: 'Review', responsible: 'Marketing' },
    { date: '24 Oct 2023', applicant: 'Siti Aminah', amount: 'Rp 45M', status: 'Approved', responsible: 'Branch Manager' },
    { date: '23 Oct 2023', applicant: 'CV Maju Terus', amount: 'Rp 1.2B', status: 'Rejected', responsible: 'Risk Analyst' }
  ];

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Review':
        return 'bg-secondary-100 text-secondary-600';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'Rejected':
        return 'bg-rose-100 text-rose-600';
      default:
        return 'bg-neutral-100 text-neutral-600';
    }
  }
}