import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MenuItem } from '../../../features/menu-management/models/menu-management.model';
import { HasPermission } from '../../directives/has-permission/has-permission';

@Component({
  selector: 'app-menu-table',
  imports: [CommonModule, HasPermission],
  templateUrl: './menu-table.html',
  styleUrl: './menu-table.css',
})
export class MenuTable {
  @Input() menus: MenuItem[] = [];
  @Output() editMenu = new EventEmitter<MenuItem>();
  @Output() deactivate = new EventEmitter<any>();

  onEdit(menu: MenuItem): void {
    this.editMenu.emit(menu);
  }

  onDeactivate(menu: any): void {
      this.deactivate.emit(menu);
  }

}
