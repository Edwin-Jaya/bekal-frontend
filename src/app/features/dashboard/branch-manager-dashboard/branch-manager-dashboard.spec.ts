import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagerDashboard } from './branch-manager-dashboard';

describe('BranchManagerDashboard', () => {
  let component: BranchManagerDashboard;
  let fixture: ComponentFixture<BranchManagerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagerDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchManagerDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
