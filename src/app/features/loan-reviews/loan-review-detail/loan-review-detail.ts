import { ChangeDetectorRef, Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoanReviews } from '../service/loan-reviews';
import { LoanReviewDetailInterface, SubmitReviewPayload } from '../models/loan-review.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-loan-review-detail',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './loan-review-detail.html',
  styleUrl: './loan-review-detail.css',
})
export class LoanReviewDetail implements OnInit {
  @Input() id!: string;

  private route = inject(ActivatedRoute);
  private loanService = inject(LoanReviews);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);
  private router = inject(Router);

  detailData?: LoanReviewDetailInterface;
  isLoading = true;
  isSubmitting = false;

  reviewForm: FormGroup = this.fb.group({
    decision: ['APPROVED', Validators.required],
    verifiedIncome: [0, [Validators.required, Validators.min(0)]],
    notes: ['', [Validators.required, Validators.minLength(5)]]
  });

ngOnInit(): void {
    // Fallback to route snapshot if @Input binding is not passed
    const activeId = this.id || this.route.snapshot.paramMap.get('id');

    if (activeId) {
      this.id = activeId;
      this.fetchDetailData();
    } else {
      console.error('No review ID found in route URL');
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  fetchDetailData(): void {
    this.isLoading = true;
    this.loanService.getReviewDetail(this.id).subscribe({
      next: (data) => {
        this.detailData = data;
        this.isLoading = false;
        console.log(data);
        // Pre-fill verified income with declared income by default
        if (data?.employmentResponse?.customerDeclaredIncome) {
          this.reviewForm.patchValue({
            verifiedIncome: data.employmentResponse.customerDeclaredIncome
          });
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load review details:', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(value);
  }

  back():void {
    this.location.back()
  }
  
  onSubmitReview(): void {
    if (this.reviewForm.invalid || !this.id || this.isSubmitting) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const payload: SubmitReviewPayload = {
      loanApplicationId: this.id,
      result: this.reviewForm.value.decision,
      verifiedIncome: Number(this.reviewForm.value.verifiedIncome),
      notes: this.reviewForm.value.notes
    };

    this.loanService.submitReview(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        alert('Loan review successfully submitted!');
        this.router.navigate(['/marketing/loan-reviews']); // Redirect ke halaman daftar antrean
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting review:', err);
        alert(err?.error?.message || 'Failed to submit review. Please try again.');
      }
    });
  }

  // Ambil verified income dari form input, jika kosong fallback ke response API
  get currentVerifiedIncome(): number {
    const formIncome = this.reviewForm.get('verifiedIncome')?.value;
    if (formIncome !== null && formIncome !== undefined && formIncome !== '') {
      return Number(formIncome);
    }
    return this.detailData?.employmentResponse?.customerVerifiedIncome || 0;
  }

  // Hitung persentase DSR: (Angsuran / Income) * 100
  get calculatedDsr(): number {
    const monthlyInstallment = this.detailData?.loanApplicationResponse?.monthlyInstallment || 0;
    const income = this.currentVerifiedIncome;
    
    if (!income || income <= 0) return 0;
    
    const dsr = (monthlyInstallment / income) * 100;
    return parseFloat(dsr.toFixed(1)); // Format 1 angka di belakang koma (misal: 18.2)
  }

  // Cek status aman (maksimal threshold 40%)
  get isDsrSafe(): boolean {
    return this.calculatedDsr <= 40;
  }

  // Format mata uang ringkas (misal: Rp 4.56M & Rp 25M)
  formatCompactCurrency(value: number): string {
    if (!value || isNaN(value)) return 'Rp 0';
    
    if (value >= 1_000_000) {
      const formatted = (value / 1_000_000).toFixed(2).replace(/\.00$/, '').replace(/\.0$/, '');
      return `Rp ${formatted}M`;
    }
    return this.formatCurrency(value);
  }

  openDocument(doc: any): void {
  // Assuming your backend document model includes a file URL or path property
  const fileUrl = doc.fileUrl || doc.documentUrl || doc.filePath;
  
  if (fileUrl) {
    window.open(fileUrl, '_blank');
  } else {
    console.warn('No file URL found for document:', doc);
  }
}
}
