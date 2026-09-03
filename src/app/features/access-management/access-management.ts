import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AccessTable } from '../../shared/ui/access-table/access-table';
import { AccessManagementService } from './services/access-management-service';
import { RoleMenuAccessItem, RoleOption, SaveRoleMenuAccessRequest } from './models/access-management-model';
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
  private roleAccessService = inject(AccessManagementService);
  private cdr = inject(ChangeDetectorRef);

  roles: RoleOption[] = []; 
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

  modifiedItemsCache = new Map<string, RoleMenuAccessItem>();

  ngOnInit(): void {
    this.fetchRoles();
  }

  fetchRoles(): void {
    this.isLoadingRoles = true;
    this.roleAccessService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.isLoadingRoles = false;
        
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
    this.modifiedItemsCache.clear(); 
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
        // NEW: Merge backend data with local cache
        this.matrix = res.content.map(item => {
          // TODO: Replace 'menuId' with the actual unique identifier property of your RoleMenuAccessItem model
          const itemId = item.menuId; 
          
          // If the user previously modified this item, use the modified version
          if (this.modifiedItemsCache.has(itemId)) {
            return this.modifiedItemsCache.get(itemId)!;
          }
          return item;
        });

        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }


  onMatrixUpdated(updatedMatrix: RoleMenuAccessItem[]): void {
    this.matrix = updatedMatrix;
    
    // NEW: Save the modifications to our local cache
    updatedMatrix.forEach(item => {
      // TODO: Replace 'menuId' with the actual unique identifier property
      const itemId = item.menuId;
      this.modifiedItemsCache.set(itemId, item);
    });
  }

  onSave(): void {
    if (!this.selectedRoleId || this.modifiedItemsCache.size === 0) return;

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    // NEW: Send the cached modified items to the backend, not just the current page
    const payload = Array.from(this.modifiedItemsCache.values());

    this.roleAccessService.assignPermissions(this.selectedRoleId, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.successMessage = 'Perubahan hak akses berhasil disimpan!';
        
        // Clear cache after successful save
        this.modifiedItemsCache.clear();
        
        this.cdr.detectChanges();

        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
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
