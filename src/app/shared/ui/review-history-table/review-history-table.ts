import { Component, Input, Output } from '@angular/core';
import { LoanHistoryResponse } from '../../../features/loan-review/models/loan-review-model';
import { CommonModule } from '@angular/common';
import { LoanHistoryDisbursementResponse } from '../../../features/loan-disbursement/models/loan-disbursement-model';

@Component({
  selector: 'app-review-history-table',
  imports: [CommonModule],
  templateUrl: './review-history-table.html',
  styleUrl: './review-history-table.css',
})
export class ReviewHistoryTable {
  @Input() histories: (LoanHistoryResponse | LoanHistoryDisbursementResponse)[] = [];

  isReviewHistory(item: LoanHistoryResponse | LoanHistoryDisbursementResponse): item is LoanHistoryResponse {
    return 'result' in item;
  }
}
