import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApprovalsHistory } from './loan-approvals-history';

describe('LoanApprovalsHistory', () => {
  let component: LoanApprovalsHistory;
  let fixture: ComponentFixture<LoanApprovalsHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApprovalsHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanApprovalsHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
