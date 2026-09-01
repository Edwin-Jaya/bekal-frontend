import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackOfficeDashboard } from './back-office-dashboard';

describe('BackOfficeDashboard', () => {
  let component: BackOfficeDashboard;
  let fixture: ComponentFixture<BackOfficeDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackOfficeDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackOfficeDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
