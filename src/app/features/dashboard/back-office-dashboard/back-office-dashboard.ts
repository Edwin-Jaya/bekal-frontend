import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCard } from '../../../shared/ui/metric-card/metric-card';
import { OperationalTrendChart } from '../../../shared/ui/operational-trend-chart/operational-trend-chart';
import { BottleneckStatusChart } from '../../../shared/ui/bottleneck-status-chart/bottleneck-status-chart';
import { RecentActivityTable } from '../../../shared/ui/recent-activity-table/recent-activity-table';
import { DashboardOverviewService, DashboardOverview } from '../super-admin-dashboard/service/dashboard-overview-service';

@Component({
  selector: 'app-back-office-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCard,
    OperationalTrendChart,
    BottleneckStatusChart,
    RecentActivityTable
  ],
  templateUrl: './back-office-dashboard.html',
  styleUrl: './back-office-dashboard.css',
})
export class BackOfficeDashboard implements OnInit {
  private dashboardService = inject(DashboardOverviewService);

  overviewData = signal<DashboardOverview | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        // Safe string conversion for Back Office metrics
        if (data?.metrics) {
          data.metrics.totalPengajuan.value = String(data.metrics.totalPengajuan.value);
          data.metrics.antreanPencairan.value = String(data.metrics.antreanPencairan.value);
          data.metrics.totalDicairkan.value = String(data.metrics.totalDicairkan.value);
        }
        this.overviewData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load back office dashboard data', err);
        this.isLoading.set(false);
      }
    });
  }
}