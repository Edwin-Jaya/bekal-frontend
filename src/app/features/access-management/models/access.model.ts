// Payload item yang diterima dari Endpoint GET (Load Matrix)
export interface RoleMenuAccessItem {
  menuId: string;
  menuName: string;
  roleMenuCanView: boolean;
  roleMenuCanCreate: boolean;
  roleMenuCanEdit: boolean;
  roleMenuCanDelete: boolean;
  roleMenuCanApprove: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// Payload item yang dikirim ke Endpoint POST (Save Matrix)
export interface SaveRoleMenuAccessRequest {
  menuId: string;
  roleMenuCanView: boolean;
  roleMenuCanCreate: boolean;
  roleMenuCanEdit: boolean;
  roleMenuCanDelete: boolean;
  roleMenuCanApprove: boolean;
}

// Wrapper Response Spring Boot Pageable
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export interface RoleOption {
  id: string;
  roleName: string;
  roleDescription?: string;
  roleIsActive?: boolean;
}