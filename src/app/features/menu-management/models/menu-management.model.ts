export interface MenuItem {
  id?: string;
  menuName: string;
  menuPath: string;
  menuParent: string;
  menuIcon: string;
  menuSortOrder: number;
  menuIsActive:boolean;
  status:'Active' | 'Inactive';
  deletedAt?: string | null;
}

export interface MenuResponse {
  content: MenuItem[];
  totalElements: number;
  totalPages: number;
  number: number; 
}