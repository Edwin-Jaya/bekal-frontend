import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedbackModal } from './shared/ui/feedback-modal/feedback-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FeedbackModal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bekal');
}
