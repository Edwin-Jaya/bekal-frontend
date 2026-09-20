import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoanDisbursementService } from '../services/loan-disbursement-service';
import { LoanHistoryDisbursementResponse } from '../models/loan-disbursement-model';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { ReviewHistoryTable } from '../../../shared/ui/review-history-table/review-history-table';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-disbursement-history',
  standalone: true,
  imports: [CommonModule, Pagination, ReviewHistoryTable, ReactiveFormsModule],
  templateUrl: './loan-disbursement-history.html',
  styleUrl: './loan-disbursement-history.css',
})
export class LoanDisbursementHistory implements OnInit {
  private loanApplicationService = inject(LoanDisbursementService);
  private cdr = inject(ChangeDetectorRef);

  currentPage: number = 0;        // ✅ 0-based, konsisten dengan Pagination component
  totalPages: number = 1;
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  totalEntries: number = 0;

  allHistories: LoanHistoryDisbursementResponse[] = [];

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

    // ✅ Tidak perlu konversi lagi, currentPage sudah 0-based = langsung ke API
    const apiPage = this.currentPage;

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

    this.loanApplicationService
      .getLoanDisbursementHistory(apiPage, this.pageSize)
      .subscribe({
        next: (response: any) => {
          const pageData = response?.data || response;
          const listContent =
            pageData?.content || (Array.isArray(pageData) ? pageData : []);

          const totalPagesFromApi = pageData?.totalPages ?? 1;
          const totalElementsFromApi =
            pageData?.totalElements ?? listContent.length;

          // ✅ Jika currentPage melampaui totalPages, reset ke 0 (bukan 1)
          if (this.currentPage >= totalPagesFromApi && totalPagesFromApi > 0) {
            this.currentPage = 0;
            this.fetchHistory();
            return;
          }

          this.allHistories = listContent.map((item: any) => {
            const rawAmount =
              item.amountRequested ??
              item.amount ??
              item.loanAmount ??
              item.disbursedAmount ??
              0;

            return {
              id: item.applicationId || item.id,
              applicationId: item.applicationId,
              applicationNumber: item.applicationNumber || '-',
              customerFullName:
                item.customerName || item.customerFullName || '-',
              amountRequested: rawAmount
                ? currencyFormatter.format(rawAmount)
                : 'Rp 0',
              status: this.formatStatus(item.currentStatus || item.status),
              createdAt: item.disbursedAt
                ? dateFormatter.format(new Date(item.disbursedAt))
                : item.reviewedAt
                ? dateFormatter.format(new Date(item.reviewedAt))
                : '-',
            };
          });

          this.totalPages = totalPagesFromApi;
          this.totalElements = totalElementsFromApi;
          this.totalEntries = totalElementsFromApi;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to fetch loan disbursement history:', err);
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