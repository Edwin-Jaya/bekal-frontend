import { Component, inject } from '@angular/core';
import { FeedbackService } from '../../../core/services/feedback-service';
import { FeedbackData } from '../../../core/models/feedback-model';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [],
  templateUrl: './feedback-modal.html',
  styleUrl: './feedback-modal.css',
})
export class FeedbackModal {
  protected readonly feedbackService = inject(FeedbackService);

  close(): void {
    this.feedbackService.close();
  }

  onConfirm(data: FeedbackData): void {
    if (data.onConfirm) {
      data.onConfirm();
    }
    this.close();
  }

  onCancel(data: FeedbackData): void {
    if (data.onCancel) {
      data.onCancel();
    }
    this.close();
  }
}