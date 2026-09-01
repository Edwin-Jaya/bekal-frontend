import { Component, Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { MenuService } from '../../../core/services/menu-service';
import { Router } from '@angular/router';
import { MenuItem } from '../../../core/models/menu-model';

export type PermissionAction = 'canCreate' | 'canEdit' | 'canDelete' | 'canApprove';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})

export class HasPermission {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);
  private menuService = inject(MenuService);
  private router = inject(Router);

  @Input() set appHasPermission(action: PermissionAction) {
    const currentPath = this.router.url;

    this.menuService.fetchUserMenus().subscribe(menus => {
      const activeMenu = this.findMenuByPath(menus, currentPath);

      if (activeMenu && activeMenu[action]) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }

  private findMenuByPath(menus: MenuItem[], path: string): MenuItem | undefined {
    for (const menu of menus) {
      if (menu.path === path) return menu;
      if (menu.children && menu.children.length > 0) {
        const found = this.findMenuByPath(menu.children, path);
        if (found) return found;
      }
    }
    return undefined;
  }
}
