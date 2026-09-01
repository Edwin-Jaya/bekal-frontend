import { Component } from '@angular/core';
import { RecentActivityTable } from '../../../shared/ui/recent-activity-table/recent-activity-table';
import { BottleneckStatusChart } from '../../../shared/ui/bottleneck-status-chart/bottleneck-status-chart';
import { OperationalTrendChart } from '../../../shared/ui/operational-trend-chart/operational-trend-chart';
import { MetricCard } from '../../../shared/ui/metric-card/metric-card';

@Component({
  selector: 'app-dashboard',
  imports: [MetricCard,
    OperationalTrendChart,
    BottleneckStatusChart,
    RecentActivityTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
