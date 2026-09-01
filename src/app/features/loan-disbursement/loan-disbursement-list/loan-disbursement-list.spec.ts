import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDisbursementList } from './loan-disbursement-list';

describe('LoanDisbursementList', () => {
  let component: LoanDisbursementList;
  let fixture: ComponentFixture<LoanDisbursementList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanDisbursementList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanDisbursementList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
