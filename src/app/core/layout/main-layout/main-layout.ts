import { Component, inject, ChangeDetectionStrategy, computed, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthApiService } from '../../auth/auth-api-service';
import { MenuService } from '../../services/menu-service'; 
import { CommonModule } from '@angular/common';
import { IconButton } from '../../../shared/ui/icon-button/icon-button';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    IconButton,
  ],
  templateUrl: './main-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout implements OnInit {
  private authApi = inject(AuthApiService);
  private menuService = inject(MenuService);

  overviewPath = computed(() => {
    const role = this.authApi.getUserRole();

    switch (role) {
      case 'SUPER_ADMIN':
        return 'admin/dashboard';
      case 'MARKETING':
        return 'marketing/dashboard';
      case 'BACK_OFFICE':
        return 'back-office/dashboard';
      case 'BRANCH_MANAGER':
        return 'branch-manager/dashboard';
      default:
        return '/login';
    }
  });

  // Dynamic user role title for the sidebar badge
  userRoleLabel = computed(() => {
    const role = this.authApi.getUserRole();

    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'MARKETING':
        return 'Marketing';
      case 'BACK_OFFICE':
        return 'Back Office';
      case 'BRANCH_MANAGER':
        return 'Branch Manager';
      default:
        return role ? role.replace('_', ' ') : 'User';
    }
  });

  // Reference the signal for template rendering
  menus = this.menuService.menus;

  filteredMenus = computed(() => {
    // 1. Normalize overview path (lowercase, strip leading/trailing slashes)
    const currentOverview = this.overviewPath().toLowerCase().replace(/^\/|\/$/g, '');

    return this.menus().filter(menu => {
      // 2. Normalize backend menu path
      const menuPath = (menu.path || '').toLowerCase().replace(/^\/|\/$/g, '');

      // 3. Exclude if exact path match OR if it points to any dashboard route
      const isDashboardRoute = menuPath === currentOverview || menuPath.endsWith('dashboard');

      return !isDashboardRoute;
    });
  });
  
  // mobile drawer
  isSidebarOpen = signal(false);
  
  // desktop icon-rail collapse
  isCollapsed = signal(false);
  
  searchQuery = '';

  ngOnInit(): void {
    // Fetch dynamic menus when layout mounts
    this.menuService.fetchUserMenus().subscribe();
  }

  toggleSidebar() {
    this.isSidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.isSidebarOpen.set(false);
  }

  toggleCollapse() {
    this.isCollapsed.update((v) => !v);
  }

  onLogout(): void {
    this.authApi.logout();
  }

  sidebarWidthClass = computed(() =>
    this.isCollapsed() ? 'w-64 lg:w-20' : 'w-64 lg:w-64'
  );

  navLinkClass = computed(() => {
    const base =
      'flex items-center rounded-lg py-2.5 text-sm font-normal text-neutral-300 hover:bg-white/5 hover:text-white transition-colors';
    return this.isCollapsed()
      ? `${base} justify-center px-0`
      : `${base} gap-3 px-3.5`;
  });
}