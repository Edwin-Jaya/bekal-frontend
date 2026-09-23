import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecentActivityItem } from '../../../../shared/ui/recent-activity-table/recent-activity-table';
import { environment } from '../../../../../environments/environment';

export type SubtextColor = 'purple' | 'green' | 'gray';

export interface MetricCardData {
  value: string;
  subtext: string;
  subtextColor: SubtextColor;
}

export interface DashboardOverview {
  metrics: {
    totalPengajuan: MetricCardData;
    antreanReview: MetricCardData;
    antreanApproval: MetricCardData;
    antreanPencairan: MetricCardData;
    totalDicairkan: MetricCardData;
  };
  charts: {
    operationalTrend: Array<{
      month: string;
      submissionAmount: number;
      disbursedAmount: number;
    }>;
    bottleneckStatus: Array<{ stage: string; count: number }>;
  };
  recentActivities: RecentActivityItem[];
}

@Injectable({
  providedIn: 'root',
})
export class DashboardOverviewService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/admin/dashboard`;

  getOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.baseUrl}/overview`);
  }

  getRecentActivities(page = 0, size = 10): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/recent-activities`, {
      params: { page, size },
    });
  }
}
