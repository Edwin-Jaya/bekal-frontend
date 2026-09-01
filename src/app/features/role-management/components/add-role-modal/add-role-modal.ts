import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-role-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-role-modal.html',
  styleUrl: './add-role-modal.css',
})
export class AddRoleModal implements OnChanges{
    @Input() isOpen = false;
    @Input() roleToEdit: any | null = null;

    @Output() closeModal = new EventEmitter<void>();
    @Output() roleSaved = new EventEmitter<{ id?: string; data: any }>();

    roleForm: FormGroup;

  
  constructor(private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      roleDescription: ['', [Validators.required]],
      status: ['Active', Validators.required]
    });
  }

  close(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  toggleStatus(): void {
    const currentStatus = this.roleForm.get('status')?.value;
    this.roleForm.patchValue({
      status: currentStatus === 'Active' ? 'Inactive' : 'Active'
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roleToEdit'] && this.roleToEdit) {
      const u = this.roleToEdit.data || this.roleToEdit;

      console.log('Data Role yang diproses:', u);

      this.roleForm.patchValue({
        roleName: u.roleName || u.roleName || '',
        roleDescription: u.roleDescription || u.roleDescription || '',
        status: (u.roleIsActive === true || u.status === 'Active') ? 'Active' : 'Inactive'
      });

    } else if (changes['isOpen'] && !this.isOpen) {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.roleForm.reset({
      status: 'Active'
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;

      const payload: any = {
        roleName: formValue.roleName,
        roleDescription: formValue.roleDescription,
        roleIsActive: formValue.status === 'Active'
      };

      this.roleSaved.emit({
        id: this.roleToEdit?.id || this.roleToEdit?.internalUserId,
        data: payload
      });

      this.close();
    }
  }
}
