import { TestBed } from '@angular/core/testing';

import { DashboardOverviewService } from './dashboard-overview-service';

describe('DashboardOverviewService', () => {
  let service: DashboardOverviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardOverviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
