import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserItem } from '../../../features/user-management/models/user.model';
import { HasPermission } from '../../directives/has-permission/has-permission';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, HasPermission],
  templateUrl: './user-table.html'
})
export class UserTable {
  @Input() users: UserItem[] = [];
  @Output() editUser = new EventEmitter<UserItem>();
  @Output() deactivate = new EventEmitter<any>();

  onEdit(user: UserItem): void {
    this.editUser.emit(user);
  }

  onDeactivate(user: any): void {
      this.deactivate.emit(user);
  }
}