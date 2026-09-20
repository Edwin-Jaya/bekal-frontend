import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { LoanReviewService } from '../services/loan-review-service';
import { LoanApplicationItem, LoanApplicationResponse, LoanReviewDetailInterface } from '../models/loan-review-model';
import { LoanTable } from '../../../shared/ui/loan-table/loan-table';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loan-review-list',
  imports: [LoanTable, Pagination],
  templateUrl: './loan-review-list.html',
  styleUrl: './loan-review-list.css',
})
export class LoanReviewList implements OnInit{
  private loanApplicationService = inject(LoanReviewService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  currentPage: number = 0;
  totalPages: number = 1;
  isLoading = false;
  totalElements = 0;
  pageSize = 10;

  allApplications: LoanApplicationItem[] = [];
  totalEntries: number = 0;


  ngOnInit(): void {
    this.loadApplication(); 
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadApplication();
  }

  onReview(item:LoanApplicationItem){
    this.router.navigate(['/marketing/loan-reviews', item.id]);
  }


  loadApplication(): void {
    this.isLoading = true;

    // ✅ Guard: pastikan tidak pernah negatif
    if (this.currentPage < 0) {
      this.currentPage = 0;
    }

    // Formatter Rupiah (contoh hasil: Rp 50.000.000)
    const currencyFormatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    // Formatter Tanggal WIB (contoh hasil: 24 Agt 2026)
    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    });

    this.loanApplicationService.getPendingLoanApplication(this.currentPage, 10).subscribe({
      next: (response) => {
        if (this.currentPage >= response.totalPages && response.totalPages > 0) {
            this.currentPage = 0;
            this.loadApplication();
            return;
        }
        this.allApplications = response.content.map((item: any) => ({
          id: item.id,
          applicationId: item.applicationNumber || '-',
          applicantName: item.customer?.customerFullName || '-',
          branch: item.branch?.branchCity || item.branch?.branchName || '-',
          loanAmount: item.amountRequested ? currencyFormatter.format(item.amountRequested) : 'Rp 0',
          tenor: item.tenorMonths ? `${item.tenorMonths} Months` : '-',
          submissionDate: item.submittedAt ? dateFormatter.format(new Date(item.submittedAt)) : '-'
        }));
        console.log(response);
        this.totalPages = response.totalPages;
        this.totalEntries = response.totalElements;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Status Code:', err.status);
        console.error('Error Detail:', err.error);
        console.error('Failed to fetch loan applications:', err);
        this.isLoading = false;
      }
    });
  }

}
