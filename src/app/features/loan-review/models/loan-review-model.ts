export interface CustomerResponse {
  id: string;
  customerFullName: string;
  customerNik: string;
  customerPhoneNumber: string;
  customerEmail: string;
  customerAddress: string;
}

export interface DocumentResponse {
  id: string;
  documentType: string;
  fileUrl: string;
  status: string;
  isLatest: boolean;
  rejectionReason?: string;
}

export interface EmploymentResponse {
  customerEmploymentType: string;
  customerCompanyName: string;
  customerJobTitle: string;
  customerDeclaredIncome: number;
  customerVerifiedIncome: number;
  customerOtherIncome?: number; // ✅ added
}

export interface BranchResponse {
  id: string;
  branchCode: string;
  branchName: string;
  branchAddress: string;
  branchCity: string;
  branchStatus: string;
}

export interface PlafondResponse { // ✅ added
  id: string;
  plafondAmount: number;
  interestRate: number;
  maxTenorMonths: number;
  usedAmount: number;
  status: string;
  validFrom: string;
  validUntil: string;
}

export interface LoanApplicationResponse {
  id: string;
  applicationNumber: string;
  amountRequested: number;
  tenorMonths: number;
  monthlyInstallment: number;
  totalRepayment?: number;
  interestRate: number;
  purpose: string;
  status: string;
  submittedAt: string;
  branch?: BranchResponse;
  plafond?: PlafondResponse; // ✅ added
}

export interface LoanReviewDetailInterface {
  customerResponse: CustomerResponse;
  documentResponse: DocumentResponse[];
  employmentResponse: EmploymentResponse;
  loanApplicationResponse: LoanApplicationResponse;
  loanReviewResponse?: any;
}

export interface SubmitReviewPayload {
  loanApplicationId: string;
  result: string;
  verifiedIncome?: number;
  notes?: string;
}

export interface LoanReviewResponse {
  id: string;
  loanApplicationId: any;
  result: string;
  notes: string;
  reviewedAt: string;
  reviewedBy: any;
}

export interface LoanApplicationItem {
  id: string;
  applicationId: string;
  applicantName: string;
  branch: string;
  loanAmount: string;
  tenor: string;
  submissionDate: string;
}

export interface LoanHistoryResponse {
  applicationId: string;
  applicationNumber: string;
  customerFullName: string;
  amountRequested: string;
  status: string;
  result: 'APPROVED' | 'REJECTED';
  notes: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}