import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewHistoryTable } from './review-history-table';

describe('ReviewHistoryTable', () => {
  let component: ReviewHistoryTable;
  let fixture: ComponentFixture<ReviewHistoryTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewHistoryTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewHistoryTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
