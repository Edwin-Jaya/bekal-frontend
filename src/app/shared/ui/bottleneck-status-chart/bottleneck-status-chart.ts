// bottleneck-status-chart.ts — full replacement
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BottleneckStatusItem {
  stage: string;
  label?: string;
  count: number;
  color?: string;
}

@Component({
  selector: 'app-bottleneck-status-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottleneck-status-chart.html',
})
export class BottleneckStatusChart {
  @Input() data: BottleneckStatusItem[] = [];

  readonly stageOrder = [
    { stage: 'submitted', label: 'Submitted', color: '#94a3b8' },
    { stage: 'in_review', label: 'In Review', color: '#a855f7' },
    { stage: 'in_approval', label: 'In Approval', color: '#f59e0b' },
    { stage: 'in_disbursement', label: 'Pencairan', color: '#3b82f6' },
    { stage: 'disbursed', label: 'Disbursed', color: '#10b981' },
  ];

  get stages(): BottleneckStatusItem[] {
    return this.stageOrder.map((def) => {
      const found = this.data?.find((d) => d.stage === def.stage);
      return {
        stage: def.stage,
        label: found?.label || def.label,
        count: found?.count || 0,
        color: found?.color || def.color,
      };
    });
  }

  get totalCount(): number {
    return this.stages.reduce((acc, s) => acc + s.count, 0);
  }

  // ✅ Bottleneck = non-disbursed stage with highest count
  get bottleneckStage(): BottleneckStatusItem | null {
    const nonDisbursed = this.stages.filter(
      (s) => s.stage !== 'disbursed' && s.count > 0,
    );
    if (!nonDisbursed.length) return null;
    return nonDisbursed.reduce(
      (max, s) => (s.count > max.count ? s : max),
      nonDisbursed[0],
    );
  }

  getPercent(count: number): number {
    if (!this.totalCount) return 0;
    return Math.round((count / this.totalCount) * 100);
  }
}
