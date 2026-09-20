import { LoanApprovalResponse } from "../../loan-approval/models/loan-approval-model";

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

export interface LoanApplicationResponse {
  id: string;
  applicationNumber: string;
  amountRequested: number;
  tenorMonths: number;
  monthlyInstallment: number;
  interestRate: number;
  purpose: string;
  status: string;
  submittedAt: string;
  branch?: BranchResponse;
  plafond?: PlafondResponse; // ✅ added
}

export interface LoanDisbursementDetailInterface {
  customerResponse: CustomerResponse;
  documentResponse: DocumentResponse[];
  employmentResponse: EmploymentResponse;
  loanApplicationResponse: LoanApplicationResponse;
  loanReviewResponse?: any;
  loanApprovalResponse?:LoanApprovalResponse;
}

export interface SubmitDisbursementPayload {
  loanApplicationId: string;
  status: string;
}


export interface LoanDisbursementResponse {
  id: string;
  loanApplicationId: any;
  status: string;
  disbursedAt: string;
  disbursedBy: any;
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

export interface LoanHistoryDisbursementResponse {
  applicationId: string;
  applicationNumber: string;
  amountRequested: string;
  customerFullName: string;
  status: string;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}