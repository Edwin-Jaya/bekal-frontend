import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { LoanDisbursementDetailInterface, LoanDisbursementResponse, LoanHistoryDisbursementResponse, PageResponse, SubmitDisbursementPayload } from '../models/loan-disbursement-model';

@Injectable({
  providedIn: 'root',
})
export class LoanDisbursementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/loan-applications`;

  getPendingLoanApplicationDisbursement(page: number = 1, size: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page - 1) 
      .set('size', size);

    return this.http.get<any>(`${this.apiUrl}/pending-disbursement`, { params, withCredentials: true });
  }

  submitDisbursement(payload: SubmitDisbursementPayload): Observable<LoanDisbursementResponse> {
    return this.http.post<LoanDisbursementResponse>(`${environment.apiUrl}/loan-disbursement/submit`, payload, {withCredentials:true});
  }

  getApprovalDetail(loanId: string): Observable<LoanDisbursementDetailInterface> {
    return this.http.get<LoanDisbursementDetailInterface>(`${this.apiUrl}/${loanId}/detail-disbursement`,{withCredentials:true});
  }

  getLoanDisbursementHistory(page: number = 0, size: number = 10): Observable<PageResponse<LoanHistoryDisbursementResponse>> {
    const params = new HttpParams()
      .set('page', page-1)
      .set('size', size);

    return this.http.get<PageResponse<LoanHistoryDisbursementResponse>>(`${environment.apiUrl}/loan-disbursement/history`, { params, withCredentials:true});
  }
}
