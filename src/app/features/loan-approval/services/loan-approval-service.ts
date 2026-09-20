import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LoanApprovalDetailInterface, LoanApprovalResponse, LoanHistoryResponse, PageResponse, SubmitPayload } from '../models/loan-approval-model';

@Injectable({
  providedIn: 'root',
})
export class LoanApprovalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loan-applications`;

  getPendingLoanApplicationApproval(page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page)  // ✅ sudah 0-based, tidak perlu page-1
      .set('size', size);

    return this.http.get<any>(`${this.apiUrl}/pending-approvals`, { params, withCredentials: true });
  }

  submitApproval(payload: SubmitPayload): Observable<LoanApprovalResponse> {
    return this.http.post<LoanApprovalResponse>(
      `${environment.apiUrl}/loan-approval/submit`, 
      payload, 
      { withCredentials: true }
    );
  }

  getApprovalDetail(loanId: string): Observable<LoanApprovalDetailInterface> {
    return this.http.get<LoanApprovalDetailInterface>(
      `${this.apiUrl}/${loanId}/detail-approval`,
      { withCredentials: true }
    );
  }

  getLoanApprovalHistory(page: number = 0, size: number = 10): Observable<PageResponse<LoanHistoryResponse>> {
    const params = new HttpParams()
      .set('page', page)  // ✅ sudah 0-based, tidak perlu page-1
      .set('size', size);

    return this.http.get<PageResponse<LoanHistoryResponse>>(
      `${environment.apiUrl}/loan-approval/history`, 
      { params, withCredentials: true }
    );
  }
}