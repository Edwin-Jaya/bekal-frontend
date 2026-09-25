import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoanDisbursementService } from './loan-disbursement-service';
import { environment } from '../../../../environments/environment';
import { AUTH_CONTEXT } from '../../../core/interceptor/auth-interceptor';
import { LoanDisbursementDetailInterface, LoanDisbursementResponse, SubmitDisbursementPayload, PageResponse, LoanHistoryDisbursementResponse } from '../models/loan-disbursement-model';

describe('LoanDisbursementService (Service Pengajuan Aplikasi - Back Office Disbursement)', () => {
  let service: LoanDisbursementService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanDisbursementService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(LoanDisbursementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getApprovalDetail()', () => {
    it('should send GET request to /loan-applications/:id/detail-disbursement with auth context', () => {
      const loanId = 'loan-app-303';
      const mockDetail: Partial<LoanDisbursementDetailInterface> = {
        customerResponse: {
          id: 'cust-3',
          customerFullName: 'Ahmad Fauzi',
          customerNik: '3301234567890003',
          customerPhoneNumber: '081333333333',
          customerEmail: 'ahmad@example.com',
          customerAddress: 'Jl. Merdeka No. 45'
        },
        documentResponse: [],
        employmentResponse: {
          customerEmploymentType: 'Permanent',
          customerCompanyName: 'PT BCA Multifinance',
          customerJobTitle: 'Supervisor',
          customerDeclaredIncome: 18000000,
          customerVerifiedIncome: 18000000
        },
        loanApplicationResponse: {
          id: loanId,
          applicationNumber: 'APP-2026-003',
          amountRequested: 75000000,
          tenorMonths: 36,
          monthlyInstallment: 2500000,
          interestRate: 0.08,
          purpose: 'Pembelian Kendaraan',
          status: 'PENDING_DISBURSEMENT',
          submittedAt: '2026-09-25T07:00:00Z'
        }
      };

      service.getApprovalDetail(loanId).subscribe((res) => {
        expect(res).toEqual(mockDetail as LoanDisbursementDetailInterface);
        expect(res.customerResponse.customerFullName).toBe('Ahmad Fauzi');
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-applications/${loanId}/detail-disbursement`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockDetail);
    });

    it('should handle error when disbursement detail request fails', (done) => {
      const loanId = 'unknown-loan';

      service.getApprovalDetail(loanId).subscribe({
        next: () => fail('Should have failed with 404'),
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-applications/${loanId}/detail-disbursement`);
      req.flush({ message: 'Disbursement detail not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPendingLoanApplicationDisbursement()', () => {
    it('should send GET request to /loan-applications/pending-disbursement with page offset (page - 1)', () => {
      const mockResponse = {
        content: [
          {
            id: 'loan-3',
            applicationId: 'APP-2026-003',
            applicantName: 'Ahmad Fauzi',
            branch: 'Bandung',
            loanAmount: '75000000',
            tenor: '36',
            submissionDate: '2026-09-25'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      // Passing page = 1 means query param page will be set to 0
      service.getPendingLoanApplicationDisbursement(1, 10).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.content.length).toBe(1);
      });

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/loan-applications/pending-disbursement`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });
  });

  describe('submitDisbursement()', () => {
    it('should send POST request to /loan-disbursement/submit with disbursement payload', () => {
      const payload: SubmitDisbursementPayload = {
        loanApplicationId: 'loan-app-303',
        status: 'DISBURSED'
      };

      const mockResponse: LoanDisbursementResponse = {
        id: 'disb-001',
        loanApplicationId: 'loan-app-303',
        status: 'DISBURSED',
        disbursedAt: '2026-09-25T10:00:00Z',
        disbursedBy: { id: 'bo-user-1' }
      };

      service.submitDisbursement(payload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.status).toBe('DISBURSED');
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-disbursement/submit`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });

    it('should handle submission disbursement failure', (done) => {
      const payload: SubmitDisbursementPayload = {
        loanApplicationId: 'loan-app-303',
        status: 'DISBURSED'
      };

      service.submitDisbursement(payload).subscribe({
        next: () => fail('Should have failed with 500 error'),
        error: (err) => {
          expect(err.status).toBe(500);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-disbursement/submit`);
      req.flush({ message: 'Core banking transfer failed' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getLoanDisbursementHistory()', () => {
    it('should send GET request to /loan-disbursement/history with page and size query params', () => {
      const mockHistory: PageResponse<LoanHistoryDisbursementResponse> = {
        content: [
          {
            applicationId: 'loan-app-303',
            applicationNumber: 'APP-2026-003',
            amountRequested: '75000000',
            customerFullName: 'Ahmad Fauzi',
            status: 'DISBURSED',
            createdAt: '2026-09-25T10:00:00Z'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      // Passing page = 1 means query param page is 0
      service.getLoanDisbursementHistory(1, 10).subscribe((res) => {
        expect(res.content.length).toBe(1);
        expect(res.content[0].status).toBe('DISBURSED');
      });

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/loan-disbursement/history`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockHistory);
    });
  });
});
