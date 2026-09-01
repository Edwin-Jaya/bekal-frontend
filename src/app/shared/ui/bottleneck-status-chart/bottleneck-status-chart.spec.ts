import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottleneckStatusChart } from './bottleneck-status-chart';

describe('BottleneckStatusChart', () => {
  let component: BottleneckStatusChart;
  let fixture: ComponentFixture<BottleneckStatusChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottleneckStatusChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottleneckStatusChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
