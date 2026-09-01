import { TestBed } from '@angular/core/testing';

import { LoanApi } from './loan-api';

describe('LoanApi', () => {
  let service: LoanApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
