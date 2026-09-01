import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { LoanTable } from '../../../shared/ui/loan-table/loan-table';
import { LoanApplicationItem } from '../../loan-reviews/models/loan-review.model';
import { LoanDisbursement } from '../service/loan-disbursement';
import { Router } from '@angular/router';


@Component({
  selector: 'app-loan-disbursement-list',
  imports: [Pagination, LoanTable],
  templateUrl: './loan-disbursement-list.html',
  styleUrl: './loan-disbursement-list.css',
})
export class LoanDisbursementList implements OnInit{
    private loanApplicationService = inject(LoanDisbursement);
    private cdr = inject(ChangeDetectorRef);
    private router=inject(Router);

    currentPage: number = 1;
    totalPages: number = 1;
    isLoading = false;
    totalElements = 0;
    pageSize = 10;

    totalEntries: number = 0;

    allApplications: LoanApplicationItem[] = [];

    onPageChanged(page: number): void {
      this.currentPage = page;
      this.loadApplication();
    }

    onReview(item: LoanApplicationItem){
      this.router.navigate(['/back-office/loan-disbursement/', item.id]);
    }
    
    ngOnInit(): void {
      this.loadApplication();
    }

    loadApplication(): void {
      this.isLoading = true;

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

      this.loanApplicationService.getPendingLoanApplicationDisbursement(this.currentPage, 10).subscribe({
        next: (response) => {
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
