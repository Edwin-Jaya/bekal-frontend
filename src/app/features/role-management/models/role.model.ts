export interface RoleItem {
  id?: string;
  roleName: string;
  description: string;
  status:'Active' | 'Inactive';
  deletedAt?: string | null;
}

export interface RoleResponse {
  content: RoleItem[];
  totalElements: number;
  totalPages: number;
  number: number; 
}