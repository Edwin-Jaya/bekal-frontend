import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { LoanDisbursement } from '../service/loan-disbursement';
import { LoanHistoryDisbursementResponse } from '../models/loan-disbursement.model';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { ReviewHistoryTable } from '../../../shared/ui/review-history-table/review-history-table';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-disbursement-history',
  imports: [CommonModule, Pagination, ReviewHistoryTable, ReactiveFormsModule],
  templateUrl: './loan-disbursement-history.html',
  styleUrl: './loan-disbursement-history.css',
})
export class LoanDisbursementHistory {
  private loanApplicationService = inject(LoanDisbursement);
  private cdr = inject(ChangeDetectorRef)

  allHistories: LoanHistoryDisbursementResponse[] = [];
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
    
    this.loanApplicationService.getLoanDisbursementHistory(this.currentPage, 10).subscribe({
      next: (response) => {
        this.allHistories = response.content.map((item: any) => ({
          id: item.applicationId,                                                  
          applicationId: item.applicationId,
          applicationNumber: item.applicationNumber || '-',
          customerFullName: item.customerName || '-',                              
          amountRequested: item.amountRequested ?? 0,                              
          status: item.currentStatus || '-',                                                                                                            
          createdAt: item.disbursedAt ? dateFormatter.format(new Date(item.disbursedAt)) : '-' 
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
