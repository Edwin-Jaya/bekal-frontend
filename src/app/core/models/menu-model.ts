export interface MenuItem {
  id: number;
  parentId: number | null;
  name: string;
  path: string;
  icon: string;
  sortOrder: number;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canApprove: boolean;
  children: MenuItem[];
}