import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination implements OnChanges {
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalElements: number = 0;
  @Input() pageSize: number = 10;

  @Output() pageChange = new EventEmitter<number>();

  pageNumbers: number[] = [];

  ngOnChanges(): void {
    this.generatePageNumbers();
  }

  get startItem(): number {
    if (this.totalElements === 0) return 0;
    return this.currentPage * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  private generatePageNumbers(): void {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 0; i < this.totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(0, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);

      if (this.currentPage <= 1) {
        end = 3;
      } else if (this.currentPage >= this.totalPages - 2) {
        start = this.totalPages - 4;
      }

      if (start > 0) {
        pages.push(0);
        if (start > 1) pages.push(-1);
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < this.totalPages - 1) {
        if (end < this.totalPages - 2) pages.push(-1);
        pages.push(this.totalPages - 1);
      }
    }

    this.pageNumbers = pages;
  }
}
