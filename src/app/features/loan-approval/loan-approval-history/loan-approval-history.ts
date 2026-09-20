import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoanApprovalService } from '../services/loan-approval-service';
import { LoanHistoryResponse } from '../models/loan-approval-model';
import { ReviewHistoryTable } from '../../../shared/ui/review-history-table/review-history-table';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loan-approval-history',
  standalone: true,
  imports: [ReviewHistoryTable, Pagination, CommonModule],
  templateUrl: './loan-approval-history.html',
  styleUrl: './loan-approval-history.css',
})
export class LoanApprovalsHistory implements OnInit {
  private loanApplicationService = inject(LoanApprovalService);
  private cdr = inject(ChangeDetectorRef);

  allHistories: LoanHistoryResponse[] = [];
  currentPage: number = 0;        // ✅ 0-based
  totalPages: number = 1;
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  totalEntries: number = 0;

  ngOnInit(): void {
    this.fetchHistory();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;      // ✅ langsung pakai, sudah 0-based dari Pagination
    this.fetchHistory();
  }

  private formatStatus(status: string): string {
    if (!status) return '-';
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  fetchHistory(): void {
    this.isLoading = true;

    // ✅ Guard: pastikan tidak pernah negatif
    if (this.currentPage < 0) {
      this.currentPage = 0;
    }

    const currencyFormatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    });

    // ✅ Langsung pakai currentPage sebagai apiPage (sudah 0-based)
    this.loanApplicationService
      .getLoanApprovalHistory(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          // ✅ Jika currentPage melampaui totalPages, reset ke 0
          if (this.currentPage >= response.totalPages && response.totalPages > 0) {
            this.currentPage = 0;
            this.fetchHistory();
            return;
          }

          this.allHistories = response.content.map((item: any) => ({
            id: item.applicationId,
            applicationId: item.applicationId,
            applicationNumber: item.applicationNumber || '-',
            customerFullName: item.customerName || '-',
            amountRequested: currencyFormatter.format(item.amountRequested ?? 0),
            status: this.formatStatus(item.currentStatus),
            result: item.reviewResult || '-',
            notes: item.reviewNotes || '-',
            createdAt: item.reviewedAt
              ? dateFormatter.format(new Date(item.reviewedAt))
              : '-',
          }));

          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.totalEntries = response.totalElements;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to fetch loan approval history:', err);
          this.allHistories = [];
          this.totalElements = 0;
          this.totalEntries = 0;
          this.totalPages = 1;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
      });
  }
}