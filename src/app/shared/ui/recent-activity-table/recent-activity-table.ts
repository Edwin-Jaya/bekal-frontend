// recent-activity-table.ts — full replacement
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface RecentActivityItem {
  applicationNumber: string; // ✅ added — for navigation + display
  applicationId: string; // ✅ added — for router.navigate
  date: string;
  applicant: string;
  amount: number | string;
  action: string; // ✅ added — "Diajukan", "Disetujui Marketing", "Ditolak BM", etc.
  status: string; // current status
  responsible: string; // ✅ now required, filled by backend
}

@Component({
  selector: 'app-recent-activity-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-activity-table.html',
})
export class RecentActivityTable {
  @Input() data: RecentActivityItem[] = [];

  private router = inject(Router);

  // ✅ Navigate to correct detail page based on status
  navigateToDetail(log: RecentActivityItem): void {
    if (!log.applicationId) return;
    switch (log.status) {
      case 'in_review':
        this.router.navigate(['/marketing/loan-reviews', log.applicationId]);
        break;
      case 'in_approval':
        this.router.navigate([
          '/branch-manager/loan-approvals',
          log.applicationId,
        ]);
        break;
      case 'in_disbursement':
        this.router.navigate([
          '/back-office/loan-disbursement',
          log.applicationId,
        ]);
        break;
      default:
        // Admin/history — navigate to read-only detail if you have one
        break;
    }
  }

  formatStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      submitted: 'Submitted',
      in_review: 'In Review',
      in_approval: 'In Approval',
      in_disbursement: 'Pencairan',
      disbursed: 'Disbursed',
      review_rejected: 'Ditolak',
      approval_rejected: 'Ditolak',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    const map: Record<string, string> = {
      submitted: 'bg-slate-100 text-slate-600',
      in_review: 'bg-purple-100 text-purple-600',
      in_approval: 'bg-amber-100 text-amber-700',
      in_disbursement: 'bg-blue-100 text-blue-700',
      disbursed: 'bg-emerald-100 text-emerald-700',
      review_rejected: 'bg-rose-100 text-rose-600',
      approval_rejected: 'bg-rose-100 text-rose-600',
      cancelled: 'bg-neutral-100 text-neutral-500',
    };
    return map[status] || 'bg-neutral-100 text-neutral-600';
  }

  formatAmount(amount: number | string): string {
    if (typeof amount === 'number') {
      return 'Rp ' + amount.toLocaleString('id-ID');
    }
    return amount || '-';
  }
}
