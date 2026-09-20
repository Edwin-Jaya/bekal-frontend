import { Component, Input } from '@angular/core';
import { LoanHistoryResponse } from '../../../features/loan-review/models/loan-review-model';
import { CommonModule } from '@angular/common';
import { LoanHistoryDisbursementResponse } from '../../../features/loan-disbursement/models/loan-disbursement-model';

@Component({
  selector: 'app-review-history-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-history-table.html',
  styleUrl: './review-history-table.css',
})
export class ReviewHistoryTable {
  @Input() histories: (LoanHistoryResponse | LoanHistoryDisbursementResponse)[] = [];
  @Input() userRole: string = '';
  @Input() isBackoffice: boolean = false;

  /**
   * Determines if the Notes column should be hidden based on role or flag
   */
  get hideNotes(): boolean {
    return (
      this.isBackoffice ||
      this.userRole == "BACK_OFFICE"
    );
  }

  isReviewHistory(item: LoanHistoryResponse | LoanHistoryDisbursementResponse): item is LoanHistoryResponse {
    return 'result' in item;
  }
}