import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoanHistoryResponse } from '../models/loan-review.model';
import { LoanReviews } from '../service/loan-reviews';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { CommonModule } from '@angular/common';
import { ReviewHistoryTable } from '../../../shared/ui/review-history-table/review-history-table';

@Component({
  selector: 'app-loan-review-history',
  imports: [ReviewHistoryTable, Pagination, CommonModule],
  templateUrl: './loan-review-history.html',
  styleUrl: './loan-review-history.css',
})
export class LoanReviewHistory {
  private loanApplicationService = inject(LoanReviews);
  private cdr = inject(ChangeDetectorRef)

  allHistories: LoanHistoryResponse[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading = false;
  totalElements = 0;
  pageSize = 10;
  totalEntries: number = 0;


  ngOnInit(): void {
    this.fetchHistory();
  }
  onPageChanged(page: number): void {
    this.currentPage = page;
    this.fetchHistory();
  }

  fetchHistory(): void {
    this.isLoading=true
    

    // Formatter Rupiah (contoh hasil: Rp 50.000.000)
    const currencyFormatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    const dateFormatter = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Asia/Jakarta'
    });
    
    this.loanApplicationService.getLoanReviewHistory(this.currentPage, 10).subscribe({
      next: (response) => {
        this.allHistories = response.content.map((item: any) => ({
          id: item.applicationId,                                                  
          applicationId: item.applicationId,
          applicationNumber: item.applicationNumber || '-',
          customerFullName: item.customerName || '-',                              
          amountRequested: item.amountRequested ?? 0,                              
          status: item.currentStatus || '-',                                       
          result: item.reviewResult || '-',                                        
          notes: item.reviewNotes || '-',                                          
          createdAt: item.reviewedAt ? dateFormatter.format(new Date(item.reviewedAt)) : '-' 
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
