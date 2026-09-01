import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleTable } from '../../shared/ui/role-table/role-table';
import { FilterTabs } from '../../shared/ui/filter-tabs/filter-tabs';
import { RoleManagementService } from './services/role-management-service';
import { RoleItem } from './models/role-management-model';
import { AddRoleModal } from './components/add-role-modal/add-role-modal';
import { HasPermission } from '../../shared/directives/has-permission/has-permission';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, RoleTable, FilterTabs, AddRoleModal, HasPermission],
  templateUrl: './role-management.html'
})
export class RoleManagement implements OnInit{
  private roleService = inject(RoleManagementService);

  currentPage: number = 1;
  totalPages: number = 1;
  activeTab: string = 'All';
  isLoading = false;
  isAddModalOpen = false;
  allRoles: RoleItem[] = [];
  totalEntries: number = 0;
  selectedRoleForEdit: any | null = null;



  private cdr = inject(ChangeDetectorRef);
  
  ngOnInit(): void {
    // Dipanggil otomatis saat komponen dimuat/diklik dari menu
    this.loadRoles(); 
  }

  private getStatusFromTab(tabName: string): boolean | null {
    if (tabName === 'Active Only') return true;
    if (tabName === 'Inactive Only') return false;
    return null;
  }

  onTabChanged(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadRoles();
  }

  loadRoles(): void {
    this.isLoading = true;
    const statusParam = this.getStatusFromTab(this.activeTab);

    this.roleService.getRoles(this.currentPage, 10, statusParam).subscribe({
      next: (response) => {
      this.allRoles = response.content.map((item: any) => ({
            id: item.id,
            roleName: item.roleName || '-',
            description: item.roleDescription || '-',
            status: item.roleIsActive ? 'Active' : 'Inactive',
            rawRole: item 
          }));

        this.totalPages = response.totalPages;
        this.totalEntries = response.totalElements;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch roles:', err);
        this.isLoading = false;
      }
    });
  }

  openEditModal(role: any): void {
    const roleId = role.id || role.rawRole?.id;

    if (typeof (this.roleService as any).getRoleById === 'function') {
      (this.roleService as any).getRoleById(roleId).subscribe({
        next: (res: any) => {
          // Ambil payload asli dari res.data
          this.selectedRoleForEdit = res.data || res;
          this.isAddModalOpen = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.selectedRoleForEdit = role.rawRole || role;
          this.isAddModalOpen = true;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.selectedRoleForEdit = role.rawRole || role;
      this.isAddModalOpen = true;
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadRoles();
    }
  }

  get filteredRoles(): RoleItem[] {
    if (this.activeTab === 'active') {
      return this.allRoles.filter(r => r.status === 'Active');
    }
    return this.allRoles;
  }

  onRoleSaved(event: { id?: string; data: any }): void {
    if (event.id) {
      // MODE UPDATE
      this.roleService.updateRole(event.id, event.data).subscribe({
        next: () => {
          this.loadRoles();
          this.isAddModalOpen = false;
        },
        error: (err) => console.error('Failed to update role:', err)
      });
    } else {
      // MODE CREATE
      this.roleService.createRole(event.data).subscribe({
        next: () => {
          this.loadRoles();
          this.isAddModalOpen = false;
        },
        error: (err) => console.error('Failed to create role:', err)
      });
    }
  }
  
  openAddModal(): void {
    this.selectedRoleForEdit = null;
    this.isAddModalOpen = true;
  }

  handleDeactivateUser(role: any): void {
  const u = role.data || role.rawRole || role;
  const roleId = u.id;

  if (!confirm(`Apakah Anda yakin ingin me-nonaktifkan user ${u.roleName || u.roleName}?`)) {
    return;
  }

  // Panggil HTTP DELETE untuk menjalankan Soft Delete backend
  this.roleService.deleteRole(roleId).subscribe({
    next: (res) => {
      console.log('Role berhasil dinonaktifkan (Soft Delete):', res);
      this.loadRoles(); // Refresh daftar user di tabel
    },
    error: (err) => {
      console.error('Gagal me-nonaktifkan user:', err);
    }
  });
}

  onToggleStatus(role: RoleItem): void {
    role.status = role.status === 'Active' ? 'Inactive' : 'Active';
  }
}