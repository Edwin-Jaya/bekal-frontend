import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReviewDetail } from './loan-review-detail';

describe('LoanReviewDetail', () => {
  let component: LoanReviewDetail;
  let fixture: ComponentFixture<LoanReviewDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanReviewDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanReviewDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
