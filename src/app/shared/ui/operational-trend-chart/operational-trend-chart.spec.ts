import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalTrendChart } from './operational-trend-chart';

describe('OperationalTrendChart', () => {
  let component: OperationalTrendChart;
  let fixture: ComponentFixture<OperationalTrendChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalTrendChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationalTrendChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
