import { TestBed } from '@angular/core/testing';

import { LoanReviews } from './loan-review-service';

describe('LoanReviews', () => {
  let service: LoanReviews;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanReviews);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
