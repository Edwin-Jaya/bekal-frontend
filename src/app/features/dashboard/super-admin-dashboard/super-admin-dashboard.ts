import { Component, inject, OnInit, signal } from '@angular/core';
import { RecentActivityTable } from '../../../shared/ui/recent-activity-table/recent-activity-table';
import { BottleneckStatusChart } from '../../../shared/ui/bottleneck-status-chart/bottleneck-status-chart';
import { OperationalTrendChart } from '../../../shared/ui/operational-trend-chart/operational-trend-chart';
import { MetricCard } from '../../../shared/ui/metric-card/metric-card';
import { DashboardOverview, DashboardOverviewService } from './service/dashboard-overview-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,
    MetricCard,
    OperationalTrendChart,
    BottleneckStatusChart,
    RecentActivityTable],
  templateUrl: './super-admin-dashboard.html',
  styleUrl: './super-admin-dashboard.css',
})
export class SuperAdminDashboard implements OnInit{
  private dashboardService = inject(DashboardOverviewService);
  
  // Signals for reactive state management
  overviewData = signal<DashboardOverview | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        this.overviewData.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.isLoading.set(false);
      }
    });
  }

}
