import { TestBed } from '@angular/core/testing';

import { LoanDisbursement } from './loan-disbursement';

describe('LoanDisbursement', () => {
  let service: LoanDisbursement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanDisbursement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
