import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReviewHistory } from './loan-review-history';

describe('LoanReviewHistory', () => {
  let component: LoanReviewHistory;
  let fixture: ComponentFixture<LoanReviewHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanReviewHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanReviewHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
