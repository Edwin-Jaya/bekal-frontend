import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoanReviewService } from './loan-review-service';
import { environment } from '../../../../environments/environment';
import { AUTH_CONTEXT } from '../../../core/interceptor/auth-interceptor';
import { LoanReviewDetailInterface, LoanReviewResponse, SubmitReviewPayload, PageResponse, LoanHistoryResponse } from '../models/loan-review-model';

describe('LoanReviewService (Service Pengajuan Aplikasi - Marketing Review)', () => {
  let service: LoanReviewService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanReviewService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(LoanReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getReviewDetail()', () => {
    it('should send GET request to /loan-applications/:id/detail with authContext and withCredentials', () => {
      const loanId = 'loan-app-101';
      const mockDetail: Partial<LoanReviewDetailInterface> = {
        customerResponse: {
          id: 'cust-1',
          customerFullName: 'John Doe',
          customerNik: '3201234567890001',
          customerPhoneNumber: '08123456789',
          customerEmail: 'john@example.com',
          customerAddress: 'Jl. Sudirman No. 1'
        },
        documentResponse: [],
        employmentResponse: {
          customerEmploymentType: 'Permanent',
          customerCompanyName: 'PT ABC',
          customerJobTitle: 'Manager',
          customerDeclaredIncome: 15000000,
          customerVerifiedIncome: 15000000
        },
        loanApplicationResponse: {
          id: loanId,
          applicationNumber: 'APP-2026-001',
          amountRequested: 50000000,
          tenorMonths: 12,
          monthlyInstallment: 4500000,
          interestRate: 0.08,
          purpose: 'Modal Usaha',
          status: 'PENDING_REVIEW',
          submittedAt: '2026-09-25T08:00:00Z'
        }
      };

      service.getReviewDetail(loanId).subscribe((res) => {
        expect(res).toEqual(mockDetail as LoanReviewDetailInterface);
        expect(res.customerResponse.customerFullName).toBe('John Doe');
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-applications/${loanId}/detail`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockDetail);
    });

    it('should handle error when loan application detail is not found', (done) => {
      const loanId = 'unknown-id';

      service.getReviewDetail(loanId).subscribe({
        next: () => fail('Should have failed with 404'),
        error: (err) => {
          expect(err.status).toBe(404);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-applications/${loanId}/detail`);
      req.flush({ message: 'Application not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getPendingLoanApplication()', () => {
    it('should send GET request to /loan-applications/pending-reviews with pagination parameters', () => {
      const mockResponse = {
        content: [
          {
            id: 'loan-1',
            applicationId: 'APP-001',
            applicantName: 'Jane Doe',
            branch: 'Jakarta',
            loanAmount: '20000000',
            tenor: '12',
            submissionDate: '2026-09-25'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      service.getPendingLoanApplication(0, 10).subscribe((res) => {
        expect(res.content.length).toBe(1);
        expect(res.totalElements).toBe(1);
      });

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/loan-applications/pending-reviews`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });
  });

  describe('submitReview()', () => {
    it('should send POST request to /loan-reviews/submit with review payload', () => {
      const payload: SubmitReviewPayload = {
        loanApplicationId: 'loan-app-101',
        result: 'RECOMMENDED',
        verifiedIncome: 16000000,
        notes: 'Dokumen lengkap dan penghasilan terverifikasi'
      };

      const mockResponse: LoanReviewResponse = {
        id: 'rev-001',
        loanApplicationId: 'loan-app-101',
        result: 'RECOMMENDED',
        notes: 'Dokumen lengkap dan penghasilan terverifikasi',
        reviewedAt: '2026-09-25T09:00:00Z',
        reviewedBy: { id: 'usr-1' }
      };

      service.submitReview(payload).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.result).toBe('RECOMMENDED');
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-reviews/submit`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });

    it('should handle submission validation error', (done) => {
      const payload: SubmitReviewPayload = {
        loanApplicationId: 'loan-app-101',
        result: 'RECOMMENDED'
      };

      service.submitReview(payload).subscribe({
        next: () => fail('Should have failed with 400 Bad Request'),
        error: (err) => {
          expect(err.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/loan-reviews/submit`);
      req.flush({ message: 'Verified income is required' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getLoanReviewHistory()', () => {
    it('should send GET request to /loan-reviews/history with page and size params', () => {
      const mockHistory: PageResponse<LoanHistoryResponse> = {
        content: [
          {
            applicationId: 'loan-app-101',
            applicationNumber: 'APP-001',
            customerFullName: 'John Doe',
            amountRequested: '50000000',
            status: 'REVIEWED',
            result: 'APPROVED',
            notes: 'Approved for further review',
            createdAt: '2026-09-25T09:00:00Z'
          }
        ],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
      };

      service.getLoanReviewHistory(0, 10).subscribe((res) => {
        expect(res.content.length).toBe(1);
        expect(res.content[0].result).toBe('APPROVED');
      });

      const req = httpMock.expectOne((r) => r.url === `${baseUrl}/loan-reviews/history`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockHistory);
    });
  });
});
