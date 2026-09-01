import { TestBed } from '@angular/core/testing';

import { LoanDisbursementService } from './loan-disbursement-service';

describe('LoanDisbursement', () => {
  let service: LoanDisbursementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanDisbursementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
