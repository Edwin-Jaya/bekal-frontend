import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccessTable } from '../../shared/ui/access-table/access-table';
import { RoleMenuAccess } from './services/role-menu-access';
import { RoleMenuAccessItem, RoleOption, SaveRoleMenuAccessRequest } from './models/access.model';
import { RoleFilter } from '../../shared/ui/role-filter/role-filter';
import { Pagination } from '../../shared/ui/pagination/pagination';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-access-management',
  imports: [AccessTable,RoleFilter,Pagination],
  templateUrl: './access-management.html',
  styleUrl: './access-management.css',
})
export class AccessManagement implements OnInit{
  private roleAccessService = inject(RoleMenuAccess);
  private cdr = inject(ChangeDetectorRef);

  roles: RoleOption[] = []; // Diisi dari Master Role Service Anda
  matrix: RoleMenuAccessItem[] = [];
  selectedRoleId: string = '';
  isLoadingRoles = false;
  isLoading = false;
  isSaving = false;
  successMessage = '';
  errorMessage = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  ngOnInit(): void {
    // Load Master Role pilihan (contoh dummy / fetch dari RoleService)
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.isLoadingRoles = true;
    this.roleAccessService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoadingRoles = false;
        
        // Opsional: Otomatis pilih role pertama jika ada data
        if (this.roles.length > 0) {
          this.onRoleSelected(this.roles[0].id);
        }
      },
      error: (err) => {
        console.error('Gagal memuat daftar role', err);
        this.isLoadingRoles = false;
      }
    });
  }

  onRoleSelected(roleId: string): void {
    this.selectedRoleId = roleId;
    this.currentPage = 0;
    this.loadMatrix();
  }

  onPageChanged(page: number): void {
    this.currentPage = page;
    this.loadMatrix();
  }

  loadMatrix(): void {
    if (!this.selectedRoleId) return;

    this.isLoading = true;
    this.roleAccessService.getMatrixByRole(this.selectedRoleId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.matrix = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  onMatrixUpdated(updatedMatrix: RoleMenuAccessItem[]): void {
    this.matrix = updatedMatrix;
  }

  onSave(): void {
    if (!this.selectedRoleId || this.matrix.length === 0) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.roleAccessService.assignPermissions(this.selectedRoleId, this.matrix).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Perubahan hak akses berhasil disimpan!';
        this.cdr.detectChanges(); // <-- force render

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges(); // <-- force render again when message clears
        }, 3000);
      },
      error: (err) => {
        this.isSaving = false;
        this.errorMessage = 'Gagal menyimpan perubahan. Silakan coba lagi.';
        this.cdr.detectChanges();
      }
    });
  }

}
