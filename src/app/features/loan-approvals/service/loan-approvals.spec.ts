import { TestBed } from '@angular/core/testing';

import { LoanApprovals } from './loan-approvals';

describe('LoanApprovals', () => {
  let service: LoanApprovals;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanApprovals);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
