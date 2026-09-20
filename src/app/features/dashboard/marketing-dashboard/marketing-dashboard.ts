import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCard } from '../../../shared/ui/metric-card/metric-card';
import { OperationalTrendChart } from '../../../shared/ui/operational-trend-chart/operational-trend-chart';
import { BottleneckStatusChart } from '../../../shared/ui/bottleneck-status-chart/bottleneck-status-chart';
import { RecentActivityTable } from '../../../shared/ui/recent-activity-table/recent-activity-table';
import { DashboardOverviewService, DashboardOverview } from '../super-admin-dashboard/service/dashboard-overview-service';

@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MetricCard,
    OperationalTrendChart,
    BottleneckStatusChart,
    RecentActivityTable
  ],
  templateUrl: './marketing-dashboard.html',
  styleUrl: './marketing-dashboard.css',
})
export class MarketingDashboard implements OnInit {
  private dashboardService = inject(DashboardOverviewService);

  overviewData = signal<DashboardOverview | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        // Konversi nilai metrik ke string agar sesuai tipe input MetricCard
        if (data?.metrics) {
          data.metrics.totalPengajuan.value = String(data.metrics.totalPengajuan.value);
          data.metrics.antreanReview.value = String(data.metrics.antreanReview.value);
          data.metrics.totalDicairkan.value = String(data.metrics.totalDicairkan.value);
        }
        this.overviewData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load marketing dashboard data', err);
        this.isLoading.set(false);
      }
    });
  }
}