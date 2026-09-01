import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanTable } from './loan-table';

describe('LoanTable', () => {
  let component: LoanTable;
  let fixture: ComponentFixture<LoanTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
