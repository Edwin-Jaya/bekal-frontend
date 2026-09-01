import { Component, OnInit, inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

import { CreateUserItem, UserItem } from './models/user.model';
import { FilterTabs } from '../../shared/ui/filter-tabs/filter-tabs';
import { UserTable } from '../../shared/ui/user-table/user-table';
import { AddUserModal } from './components/add-user-modal/add-user-modal';
import { UserManagementService } from './services/user-management-service'; // Direct Import Service
import { HasPermission } from '../../shared/directives/has-permission/has-permission';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FilterTabs,
    UserTable,
    AddUserModal,
    HasPermission
  ],
  templateUrl: './user-management.html'
})
export class UserManagement implements OnInit {
  private userService = inject(UserManagementService);
  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);

  activeTab: string = 'All';
  currentPage: number = 1;
  totalPages: number = 1;
  totalEntries: number = 0;
  isAddModalOpen = false;
  isLoading = false;
  selectedUserForEdit: any | null = null;

  // Master Data
  allUsers: UserItem[] = [];
  branchesList: any[] = [];
  rolesList: any[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsers();
      this.loadMasterData();
    }
  }

  // Load List Cabang & Role untuk Dropdown Modal
  loadMasterData(): void {
    // Fetch List Cabang
    this.userService.getBranches().subscribe({
      next: (res: any) => {
        // 📍 Ambil array dari res.data
        this.branchesList = res.data || [];
        console.log('Branches Loaded:', this.branchesList);
        this.cdr.markForCheck(); // Paksa Angular refresh view
      },
      error: (err) => console.error('Gagal fetch branches:', err)
    });

    // Fetch List Role
    this.userService.getRoles().subscribe({
      next: (res: any) => {
        // 📍 Ambil array dari res.data
        this.rolesList = res.data || [];
        console.log('Roles Loaded:', this.rolesList);
        this.cdr.markForCheck(); // Paksa Angular refresh view
      },
      error: (err) => console.error('Gagal fetch roles:', err)
    });
  }

  private getStatusFromTab(tabName: string): boolean | null {
    if (tabName === 'Active Only') return true;
    if (tabName === 'Inactive Only') return false;
    return null;
  }

  loadUsers(): void {
    this.isLoading = true;
    const statusParam = this.getStatusFromTab(this.activeTab);

    this.userService.getUsers(this.currentPage, 10, statusParam).subscribe({
      next: (response) => {
        this.allUsers = response.content.map((item: any) => ({
          id: item.id || item.internalUserId,
          full_name: item.internalUserFullName || item.full_name,
          email: item.internalUserEmail || item.email,
          role: item.role?.roleName || item.roleName || '-',
          status: (item.internalUserIsActive ?? item.status === 'Active') ? 'Active' : 'Inactive',
          rawUser: item // Menyimpan data utuh backend untuk keperluan edit
        }));

        this.totalPages = response.totalPages;
        this.totalEntries = response.totalElements;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch users:', err);
        this.isLoading = false;
      }
    });
  }

  onTabChanged(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadUsers();
  }

  openAddModal(): void {
    this.selectedUserForEdit = null;
    this.isAddModalOpen = true;
  }

  // Mengambil data lengkap (termasuk branchId, roleId, phone_number) untuk mode Edit
  openEditModal(user: any): void {
    const userId = user.id || user.rawUser?.id;

    if (typeof (this.userService as any).getUserById === 'function') {
      (this.userService as any).getUserById(userId).subscribe({
        next: (res: any) => {
          // Ambil payload asli dari res.data
          this.selectedUserForEdit = res.data || res;
          this.isAddModalOpen = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.selectedUserForEdit = user.rawUser || user;
          this.isAddModalOpen = true;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.selectedUserForEdit = user.rawUser || user;
      this.isAddModalOpen = true;
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  handleDeactivateUser(user: any): void {
  const u = user.data || user.rawUser || user;
  const userId = u.id;

  if (!confirm(`Apakah Anda yakin ingin me-nonaktifkan user ${u.internalUserFullName || u.full_name}?`)) {
    return;
  }

  // Panggil HTTP DELETE untuk menjalankan Soft Delete backend
  this.userService.deleteUser(userId).subscribe({
    next: (res) => {
      console.log('User berhasil dinonaktifkan (Soft Delete):', res);
      this.loadUsers(); // Refresh daftar user di tabel
    },
    error: (err) => {
      console.error('Gagal me-nonaktifkan user:', err);
    }
  });
}

  onUserSaved(event: { id?: string; data: any }): void {
    if (event.id) {
      // MODE UPDATE
      this.userService.updateUser(event.id, event.data).subscribe({
        next: () => {
          this.loadUsers();
          this.isAddModalOpen = false;
        },
        error: (err) => console.error('Failed to update user:', err)
      });
    } else {
      // MODE CREATE
      this.userService.createUser(event.data).subscribe({
        next: () => {
          this.loadUsers();
          this.isAddModalOpen = false;
        },
        error: (err) => console.error('Failed to create user:', err)
      });
    }
  }

  onDeleteUser(user: UserItem): void {
    if (confirm(`Apakah yakin ingin menghapus ${user.full_name}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Failed to delete user:', err)
      });
    }
  }

  get filteredUsers(): UserItem[] {
    if (this.activeTab === 'Active Only') {
      return this.allUsers.filter((u) => u.status === 'Active');
    }
    return this.allUsers;
  }
}