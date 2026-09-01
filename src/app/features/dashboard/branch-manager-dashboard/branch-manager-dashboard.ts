import { Component } from '@angular/core';
import { MetricCard } from '../../../shared/ui/metric-card/metric-card';
import { OperationalTrendChart } from '../../../shared/ui/operational-trend-chart/operational-trend-chart';
import { BottleneckStatusChart } from '../../../shared/ui/bottleneck-status-chart/bottleneck-status-chart';
import { RecentActivityTable } from '../../../shared/ui/recent-activity-table/recent-activity-table';

@Component({
  selector: 'app-branch-manager-dashboard',
  imports: [MetricCard,
        OperationalTrendChart,
        BottleneckStatusChart,
        RecentActivityTable],
  templateUrl: './branch-manager-dashboard.html',
  styleUrl: './branch-manager-dashboard.css',
})
export class BranchManagerDashboard {

}
