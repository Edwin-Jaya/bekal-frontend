import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivityTable } from './recent-activity-table';

describe('RecentActivityTable', () => {
  let component: RecentActivityTable;
  let fixture: ComponentFixture<RecentActivityTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentActivityTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
