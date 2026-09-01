import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleOption } from '../../../features/access-management/models/access-management-model';

@Component({
  selector: 'app-role-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './role-filter.html',
  styleUrl: './role-filter.css',
})
export class RoleFilter {
  @Input() roles: RoleOption[] = [];
  @Input() selectedRoleId: string = '';
  @Output() roleSelect = new EventEmitter<string>();

  onSelect(roleId: string): void {
    this.roleSelect.emit(roleId);
  }
}
