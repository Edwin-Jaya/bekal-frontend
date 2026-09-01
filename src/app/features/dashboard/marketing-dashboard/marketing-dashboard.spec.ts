import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingDashboard } from './marketing-dashboard';

describe('MarketingDashboard', () => {
  let component: MarketingDashboard;
  let fixture: ComponentFixture<MarketingDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
