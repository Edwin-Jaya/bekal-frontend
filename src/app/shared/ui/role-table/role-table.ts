import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RoleItem } from '../../../features/role-management/models/role-management-model';
import { HasPermission } from '../../directives/has-permission/has-permission';

@Component({
  selector: 'app-role-table',
  imports: [CommonModule,HasPermission],
  templateUrl: './role-table.html'
})
export class RoleTable {
  @Input() roles: RoleItem[] = [];
  @Output() editRole = new EventEmitter<RoleItem>();
  @Output() deactivate = new EventEmitter<any>();

  onEdit(role: RoleItem): void {
    this.editRole.emit(role);
  }

  onDeactivate(role: any): void {
      this.deactivate.emit(role);
  }
}