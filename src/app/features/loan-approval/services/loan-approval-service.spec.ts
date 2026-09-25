import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoanApprovalService } from './loan-approval-service';
import { environment } from '../../../../environments/environment';
import { AUTH_CONTEXT } from '../../../core/interceptor/auth-interceptor';
import { LoanApprovalDetailInterface, LoanApprovalResponse, SubmitPayload, PageResponse, LoanHistoryResponse } from '../models/loan-approval-model';

describe('LoanApprovalService (Service Pengajuan Aplikasi - Branch Manager Approval)', () => {
  let service: LoanApprovalService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanApprovalService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(LoanApprovalService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getApprovalDetail()', () => {
    it('should send GET request to /loan-applications/:id/detail-approval with auth context', () => {
      const loanId = 'loan-app-202';
      const mockDetail: Partial<LoanApprovalDetailInterface> = {
        customerResponse: {
          id: 'cust-2',
          customerFullName: 'Siti Rahma',
          customerNik: '3171234567890002',
          customerPhoneNumber: '08198765432',
          customerEmail: 'siti@example.com',
          customerAddress: 'Jl. Thamrin No. 20'
        },
        documentResponse: [],
        employmentResponse: {
          customerEmploymentType: 'Permanent',
          customerCompanyName: 'PT BCA Finance',
          customerJobTitle: 'Analyst',
          customerDeclaredIncome: 12000000,
          customerVerifiedIncome: 12000000
        },
        loanApplicationResponse: {
          id: loanId,
          applicationNumber: 'APP-2026-002',
          amountRequested: 35000000,
          tenorMonths: 24,
          monthlyInstallment: 1800000,
          interestRate: 0.09,
          purpose: 'Renovasi Rumah',
          status: 'PENDING_APPROVAL',
          submittedAt: '2026-09-25T08:30:00Z'
        },
        loanReviewResponse: {
          id: 'rev-002',
          loanApplicationId: loanId,
          result: 'RECOMMENDED',
          notes: 'Kapasitas finansial memadai',
          reviewedAt: '2026-09-25T09:00:00Z',
          reviewedBy: { id: 'usr-marketing' }
        }
      };

      service.getApprovalDetail(loanId).subscribe((res) => {
        expect(res).toEqual(mockDetail as LoanApprovalDetailInterface);
        expect(res.loanApplicationResponse.id).toBe(loanId);
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-applications/${loanId}/detail-approval`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockDetail);
    });

    it('should handle error when approval detail request fails', (done) => {
      const loanId = 'loan-err';

      service.getApprovalDetail(loanId).subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-applications/${loanId}/detail-approval`);
      req.flush({ message: 'Internal Server Error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getPendingLoanApplicationApproval()', () => {
    it('should send GET request to /loan-applications/pending-approvals with page and size query params', () => {
      const mockResponse = {
        content: [
          {
            id: 'loan-app-202',
            applicationId: 'APP-2026-002',
            applicantName: 'Siti Rahma',
            branch: 'Jakarta Selatan',
            loanAmount: '35000000',
            tenor: '24',
            submissionDate: '2026-09-25'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      service.getPendingLoanApplicationApproval(0, 10).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.content.length).toBe(1);
      });

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/loan-applications/pending-approvals`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });
  });

  describe('submitApproval()', () => {
    it('should send POST request to /loan-approval/submit with approved decision', () => {
      const payload: SubmitPayload = {
        loanApplicationId: 'loan-app-202',
        result: 'APPROVED',
        notes: 'Disetujui untuk proses pencairan dana'
      };

      const mockResponse: LoanApprovalResponse = {
        id: 'appr-001',
        loanApplicationId: 'loan-app-202',
        result: 'APPROVED',
        notes: 'Disetujui untuk proses pencairan dana',
        approvedAt: '2026-09-25T09:30:00Z',
        approvedBy: {
          id: 'bm-01',
          internalUserFullName: 'Branch Manager 1',
          internalUserEmployeeCode: 'BM001',
          internalUserEmail: 'bm@bca.co.id',
          internalUserPhoneNumber: '0811111111'
        }
      };

      service.submitApproval(payload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.result).toBe('APPROVED');
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-approval/submit`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });

    it('should handle rejection submission', () => {
      const payload: SubmitPayload = {
        loanApplicationId: 'loan-app-202',
        result: 'REJECTED',
        notes: 'Dokumen agunan tidak sesuai kriteria'
      };

      const mockResponse: LoanApprovalResponse = {
        id: 'appr-002',
        loanApplicationId: 'loan-app-202',
        result: 'REJECTED',
        notes: 'Dokumen agunan tidak sesuai kriteria',
        approvedAt: '2026-09-25T09:35:00Z',
        approvedBy: {
          id: 'bm-01',
          internalUserFullName: 'Branch Manager 1',
          internalUserEmployeeCode: 'BM001',
          internalUserEmail: 'bm@bca.co.id',
          internalUserPhoneNumber: '0811111111'
        }
      };

      service.submitApproval(payload).subscribe((res) => {
        expect(res.result).toBe('REJECTED');
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-approval/submit`);
      expect(req.request.body.result).toBe('REJECTED');
      req.flush(mockResponse);
    });
  });

  describe('getLoanApprovalHistory()', () => {
    it('should send GET request to /loan-approval/history with pagination parameters', () => {
      const mockHistory: PageResponse<LoanHistoryResponse> = {
        content: [
          {
            applicationId: 'loan-app-202',
            applicationNumber: 'APP-2026-002',
            customerFullName: 'Siti Rahma',
            amountRequested: '35000000',
            status: 'APPROVED',
            result: 'APPROVED',
            notes: 'Approved by BM',
            createdAt: '2026-09-25T09:30:00Z'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      service.getLoanApprovalHistory(0, 10).subscribe((res) => {
        expect(res.content.length).toBe(1);
        expect(res.content[0].result).toBe('APPROVED');
      });

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/loan-approval/history`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockHistory);
    });
  });
});
