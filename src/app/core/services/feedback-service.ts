import { Injectable, signal } from '@angular/core';
import { FeedbackData } from '../models/feedback-model'; // Sesuaikan path model

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  // Ganti nama signal menjadi `state`
  readonly state = signal<FeedbackData | null>(null);

  show(data: FeedbackData): void {
    this.state.set({
      confirmText: 'OK',
      ...data,
    });
  }

  close(): void {
    this.state.set(null);
  }
}