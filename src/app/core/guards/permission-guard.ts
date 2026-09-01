import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MenuService } from '../services/menu-service';
import { MenuItem } from '../models/menu-model';
import { map } from 'rxjs';

export const permissionGuard: CanActivateFn = (route, state) => {
const menuService = inject(MenuService);
  const router = inject(Router);

  const targetPath = state.url;

  const hasAccess = (menus: MenuItem[], path: string): boolean => {
    return menus.some(menu => {
      if (menu.path === path) return true;
      if (menu.children && menu.children.length > 0) {
        return hasAccess(menu.children, path);
      }
      return false;
    });
  };

  return menuService.fetchUserMenus().pipe(
    map(userMenus => {
      if (hasAccess(userMenus, targetPath)) {
        return true;
      }
      return router.createUrlTree(['/dashboard']);
    })
  );
};
