import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisbursementHistory } from './loan-disbursement-history';

describe('LoanDisbursementHistory', () => {
  let component: LoanDisbursementHistory;
  let fixture: ComponentFixture<LoanDisbursementHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDisbursementHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanDisbursementHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
