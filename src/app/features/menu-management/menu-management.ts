import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from './models/menu-management.model';
import { MenuTable } from '../../shared/ui/menu-table/menu-table';
import { FilterTabs } from '../../shared/ui/filter-tabs/filter-tabs';
import { Menu } from './services/menu';
import { AddMenuModal } from './components/add-menu-modal/add-menu-modal';
import { HasPermission } from '../../shared/directives/has-permission/has-permission';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, MenuTable, FilterTabs, AddMenuModal, HasPermission],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.css',
})
export class MenuManagement implements OnInit {
  private menuService = inject(Menu);
  private cdr = inject(ChangeDetectorRef);

  currentPage: number = 1;
  totalPages: number = 1;
  activeTab: string = 'All';
  isLoading = false;
  isAddModalOpen = false;
  
  allMenus: MenuItem[] = [];
  menuList: any[] = []; 
  totalEntries: number = 0;
  selectedMenuForEdit: any | null = null;

  ngOnInit(): void {
    this.loadMenus(); 
  }

  private getStatusFromTab(tabName: string): boolean | null {
    if (tabName === 'Active Only') return true;
    if (tabName === 'Inactive Only') return false;
    return null;
  }

  onTabChanged(tab: string): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.loadMenus();
  }

  loadMenus(): void {
    this.isLoading = true;
    const statusParam = this.getStatusFromTab(this.activeTab);

    this.menuService.getMenus(this.currentPage, 10, statusParam).subscribe({
      next: (response) => {
        this.allMenus = response.content.map((item: any) => ({
          id: item.id,
          menuName: item.menuName || '-',
          menuPath: item.menuPath || '-',
          menuIcon: item.menuIcon || '-',
          menuSortOrder: item.menuSortOrder ?? 0,
          menuIsActive: item.menuIsActive ?? false,
          menuParent: item.menuParent,
          rawMenu: item
        }));

        this.menuList = [...this.allMenus];
        this.totalPages = response.totalPages;
        this.totalEntries = response.totalElements;
        this.isLoading = false;

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to fetch menus:', err);
        this.isLoading = false;
      }
    });
  }

  openEditModal(menu: any): void {
    const menuId = menu.id || menu.rawMenu?.id;

    if (typeof (this.menuService as any).getMenuById === 'function') {
      (this.menuService as any).getMenuById(menuId).subscribe({
        next: (res: any) => {
          this.selectedMenuForEdit = res.data || res;
          this.isAddModalOpen = true;
          this.cdr.markForCheck();
        },
        error: () => {
          this.selectedMenuForEdit = menu.rawMenu || menu;
          this.isAddModalOpen = true;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.selectedMenuForEdit = menu.rawMenu || menu;
      this.isAddModalOpen = true;
    }
  }

  openAddModal(): void {
    this.selectedMenuForEdit = null;
    this.isAddModalOpen = true;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
  
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadMenus();
    }
  }

  get filteredMenus(): MenuItem[] {
    if (this.activeTab === 'Active Only') {
      return this.allMenus.filter(r => r.menuIsActive);
    } else if (this.activeTab === 'Inactive Only') {
      return this.allMenus.filter(r => !r.menuIsActive);
    }
    return this.allMenus;
  }

  onMenuSaved(event: { id?: string; data: any }): void {
    if (event.id) {
      this.menuService.updateMenu(event.id, event.data).subscribe({
        next: () => {
          this.loadMenus();
          this.isAddModalOpen = false;
        },
        error: (err) => console.error('Failed to update menu:', err)
      });
    } else {
      this.menuService.createMenu(event.data).subscribe({
        next: () => {
          this.loadMenus();
          this.isAddModalOpen = false;
        },
        error: (err) => console.error('Failed to create menu:', err)
      });
    }
  }

  handleDeactivateMenu(menu: any): void {
    const u = menu.data || menu.rawMenu || menu;
    const menuId = u.id;

    if (!confirm(`Apakah Anda yakin ingin me-nonaktifkan menu "${u.menuName}"?`)) {
      return;
    }

    this.menuService.deleteMenu(menuId).subscribe({
      next: (res) => {
        console.log('Menu berhasil dinonaktifkan (Soft Delete):', res);
        this.loadMenus();
      },
      error: (err) => {
        console.error('Gagal me-nonaktifkan menu:', err);
      }
    });
  }
}