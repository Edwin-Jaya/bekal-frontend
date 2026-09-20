import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { LoanReviewService } from '../services/loan-review-service';
import { FeedbackService } from '../../../core/services/feedback-service'; // Adjust path as needed
import {
  LoanReviewDetailInterface,
  SubmitReviewPayload,
} from '../models/loan-review-model';
import { environment } from '../../../../environments/environment';
import { SafePipe } from '../../../shared/pipe/safe-pipe';

@Component({
  selector: 'app-loan-review-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SafePipe],
  templateUrl: './loan-review-detail.html',
  styleUrl: './loan-review-detail.css',
})
export class LoanReviewDetail implements OnInit {
  @Input() id!: string;

  private route = inject(ActivatedRoute);
  private loanService = inject(LoanReviewService);
  private feedbackService = inject(FeedbackService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private location = inject(Location);
  private router = inject(Router);

  detailData?: LoanReviewDetailInterface;
  isLoading = true;
  isSubmitting = false;

  selectedDoc: any = null;
  zoomLevel: number = 1;

  reviewForm: FormGroup = this.fb.group({
    decision: ['APPROVED', Validators.required],
    verifiedIncome: [0, [Validators.required, Validators.min(0)]],
    notes: ['', [Validators.required, Validators.minLength(5)]],
  });

  ngOnInit(): void {
    const activeId = this.id || this.route.snapshot.paramMap.get('id');

    if (activeId) {
      this.id = activeId;
      this.fetchDetailData();
    } else {
      console.error('No review ID found in route URL');
      this.isLoading = false;
      this.feedbackService.show({
        type: 'error',
        title: 'ID Tidak Ditemukan',
        message: 'URL tidak valid atau ID peninjauan tidak ditemukan.',
        onConfirm: () => this.back(),
      });
      this.cdr.markForCheck();
    }
  }

  fetchDetailData(): void {
    this.isLoading = true;
    this.loanService.getReviewDetail(this.id).subscribe({
      next: (data) => {
        this.detailData = data;
        this.isLoading = false;

        if (data?.employmentResponse?.customerDeclaredIncome) {
          this.reviewForm.patchValue({
            verifiedIncome: data.employmentResponse.customerDeclaredIncome,
          });
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load review details:', err);
        this.isLoading = false;
        this.feedbackService.show({
          type: 'error',
          title: 'Gagal Memuat Data',
          message: 'Terjadi kesalahan saat mengambil detail peninjauan.',
        });
        this.cdr.markForCheck();
      },
    });
  }

  onSubmitReview(): void {
    if (this.reviewForm.invalid || !this.id || this.isSubmitting) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const isApproved = this.reviewForm.value.decision === 'APPROVED';

    // Konfirmasi sebelum submit
    this.feedbackService.show({
      type: isApproved ? 'info' : 'warning',
      title: isApproved ? 'Konfirmasi Persetujuan' : 'Konfirmasi Penolakan',
      message: isApproved
        ? 'Apakah Anda yakin ingin menyetujui peninjauan ini?'
        : 'Apakah Anda yakin ingin menolak peninjauan ini?',
      confirmText: 'Ya, Kirim',
      cancelText: 'Batal',
      onConfirm: () => this.executeSubmit(),
    });
  }

  private executeSubmit(): void {
    this.isSubmitting = true;

    const payload: SubmitReviewPayload = {
      loanApplicationId: this.id,
      result: this.reviewForm.value.decision,
      verifiedIncome: Number(this.reviewForm.value.verifiedIncome),
      notes: this.reviewForm.value.notes,
    };

    this.loanService.submitReview(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.feedbackService.show({
          type: 'success',
          title: 'Berhasil',
          message: 'Peninjauan loan berhasil dikirim!',
          confirmText: 'Selesai',
          onConfirm: () => {
            this.router.navigate(['/marketing/loan-reviews']);
          },
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Error submitting review:', err);
        this.feedbackService.show({
          type: 'error',
          title: 'Gagal Menyimpan',
          message:
            err?.error?.message ||
            'Gagal mengirimkan peninjauan. Silakan coba lagi.',
        });
      },
    });
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined || value === null) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  }

  back(): void {
    this.location.back();
  }

  get currentVerifiedIncome(): number {
    const formIncome = this.reviewForm.get('verifiedIncome')?.value;
    if (formIncome !== null && formIncome !== undefined && formIncome !== '') {
      return Number(formIncome);
    }
    return this.detailData?.employmentResponse?.customerVerifiedIncome || 0;
  }

  get calculatedDsr(): number {
    const monthlyInstallment =
      this.detailData?.loanApplicationResponse?.monthlyInstallment || 0;
    const income = this.currentVerifiedIncome;

    if (!income || income <= 0) return 0;

    const dsr = (monthlyInstallment / income) * 100;
    return parseFloat(dsr.toFixed(1));
  }

  get isDsrSafe(): boolean {
    return this.calculatedDsr <= 40;
  }

  formatCompactCurrency(value: number): string {
    if (!value || isNaN(value)) return 'Rp 0';

    if (value >= 1_000_000) {
      const formatted = (value / 1_000_000)
        .toFixed(2)
        .replace(/\.00$/, '')
        .replace(/\.0$/, '');
      return `Rp ${formatted}M`;
    }
    return this.formatCurrency(value);
  }

  openDocument(doc: any): void {
    const fileUrl = doc.fileUrl || doc.documentUrl || doc.filePath;
    if (!fileUrl) {
      console.warn('No file URL found for document:', doc);
      return;
    }

    // ✅ If local upload, build full URL via FileController
    const fullUrl = fileUrl.startsWith('/uploads/')
      ? `${environment.apiUrl}/files/${fileUrl.replace('/uploads/', '')}`
      : fileUrl; // ✅ If already full URL (e.g. https://storage.example.com), use as-is

    this.selectedDoc = { ...doc, resolvedUrl: fullUrl };
    this.zoomLevel = 1;
  }

  closeModal(): void {
    this.selectedDoc = null;
    this.zoomLevel = 1;
  }

  zoomIn(): void {
    if (this.zoomLevel < 3)
      this.zoomLevel = parseFloat((this.zoomLevel + 0.25).toFixed(2));
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5)
      this.zoomLevel = parseFloat((this.zoomLevel - 0.25).toFixed(2));
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  isImage(fileUrl: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
  }

  isPdf(fileUrl: string): boolean {
    return /\.pdf$/i.test(fileUrl);
  }

  // ✅ Format status: "in_disbursement" → "In Disbursement"
  formatStatus(status: string): string {
    if (!status) return '-';
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // ✅ Total income = declared + other income
  get totalIncome(): number {
    const declared =
      this.detailData?.employmentResponse?.customerDeclaredIncome || 0;
    const other = this.detailData?.employmentResponse?.customerOtherIncome || 0;
    return declared + other;
  }

  // ✅ Plafond from nested structure
  get plafondAmount(): number {
    // Direct on loanApplicationResponse (review/approval pages)
    const direct =
      this.detailData?.loanApplicationResponse?.plafond?.plafondAmount;
    if (direct) return direct;

    // Nested inside loanReviewResponse.loanApplicationId.plafond (disbursement page)
    const nested = (this.detailData as any)?.loanReviewResponse
      ?.loanApplicationId?.plafond?.plafondAmount;
    return nested || 0;
  }
}
