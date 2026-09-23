import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { LoanReviewService } from './loan-review-service';

describe('LoanReviewService', () => {
  let service: LoanReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(LoanReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

