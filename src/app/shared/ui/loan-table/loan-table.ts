import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoanApplicationItem } from '../../../features/loan-review/models/loan-review-model';
import { HasPermission } from '../../directives/has-permission/has-permission';

@Component({
  selector: 'app-loan-table',
  imports: [HasPermission],
  templateUrl: './loan-table.html',
  styleUrl: './loan-table.css',
})
export class LoanTable {
  @Input() applications: LoanApplicationItem[] = [];
  @Output() review = new EventEmitter<LoanApplicationItem>();

  onReview(application: LoanApplicationItem): void {
    this.review.emit(application);
  }
}