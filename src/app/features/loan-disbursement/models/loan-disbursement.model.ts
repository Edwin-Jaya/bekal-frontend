import { LoanApprovalResponse } from "../../loan-approvals/models/loan-approval.model";

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
  customerFullName: string;
  amountRequested: string;
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