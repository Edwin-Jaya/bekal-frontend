import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanApprovalList } from './loan-approval-list';

describe('LoanApprovalList', () => {
  let component: LoanApprovalList;
  let fixture: ComponentFixture<LoanApprovalList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanApprovalList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanApprovalList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
