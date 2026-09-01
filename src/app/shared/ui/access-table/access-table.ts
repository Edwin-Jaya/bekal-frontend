import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleMenuAccessItem } from '../../../features/access-management/models/access.model';


@Component({
  selector: 'app-access-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './access-table.html',
  styleUrl: './access-table.css',
})
export class AccessTable {
  @Input() isLoading: boolean = false;
  @Input() matrix: RoleMenuAccessItem[] = [];
  @Input() selectedRoleId: string = '';

  @Output() roleSelect = new EventEmitter<string>();
  @Output() matrixChange = new EventEmitter<RoleMenuAccessItem[]>();

  onRoleSelect(roleId: string): void {
    this.roleSelect.emit(roleId);
  }

  onPermissionChange(
    item: RoleMenuAccessItem, 
    field: keyof Pick<RoleMenuAccessItem, 'roleMenuCanView' | 'roleMenuCanCreate' | 'roleMenuCanEdit' | 'roleMenuCanDelete' | 'roleMenuCanApprove'>
  ): void {
    item[field] = !item[field];
    this.matrixChange.emit(this.matrix);
  }
}
