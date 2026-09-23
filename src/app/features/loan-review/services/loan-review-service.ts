import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoanHistoryResponse, LoanReviewDetailInterface, LoanReviewResponse, PageResponse, SubmitReviewPayload } from '../models/loan-review-model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { authContext } from '../../../core/interceptor/auth-interceptor';

@Injectable({
  providedIn: 'root',
})
export class LoanReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loan-applications`;

  getReviewDetail(loanId: string): Observable<LoanReviewDetailInterface> {
    return this.http.get<LoanReviewDetailInterface>(
      `${this.apiUrl}/${loanId}/detail`,
      { context: authContext(), withCredentials: true }
    );
  }

  getPendingLoanApplication(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)  // ✅ sudah 0-based, tidak perlu page-1
      .set('size', size);

    return this.http.get<any>(
      `${this.apiUrl}/pending-reviews`, 
      { params, context: authContext(), withCredentials: true }
    );
  }

  submitReview(payload: SubmitReviewPayload): Observable<LoanReviewResponse> {
    return this.http.post<LoanReviewResponse>(
      `${environment.apiUrl}/loan-reviews/submit`, 
      payload, 
      { context: authContext(), withCredentials: true }
    );
  }

  getLoanReviewHistory(page: number = 0, size: number = 10): Observable<PageResponse<LoanHistoryResponse>> {
    const params = new HttpParams()
      .set('page', page)  // ✅ sudah 0-based, tidak perlu page-1
      .set('size', size);

    return this.http.get<PageResponse<LoanHistoryResponse>>(
      `${environment.apiUrl}/loan-reviews/history`, 
      { params, context: authContext(), withCredentials: true }
    );
  }
}