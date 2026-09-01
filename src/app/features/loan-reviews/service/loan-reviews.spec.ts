import { TestBed } from '@angular/core/testing';

import { LoanReviews } from './loan-reviews';

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
