import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReviewList } from './loan-review-list';

describe('LoanReviewList', () => {
  let component: LoanReviewList;
  let fixture: ComponentFixture<LoanReviewList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanReviewList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanReviewList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
