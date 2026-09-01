import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-user-modal.html'
})
export class AddUserModal implements OnChanges {
  @Input() isOpen = false;
  @Input() userToEdit: any | null = null;
  @Input() branches: any[] = []; // List cabang dinamis
  @Input() roles: any[] = [];    // List role dinamis

  @Output() closeModal = new EventEmitter<void>();
  @Output() userSaved = new EventEmitter<{ id?: string; data: any }>();

  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      branchId: ['', Validators.required],
      roleId: ['', Validators.required],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone_number: ['', Validators.required],
      status: ['Active', Validators.required]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userToEdit'] && this.userToEdit) {
      // 🔍 Ekstrak data jika dibungkus oleh 'data' atau langsung object user
      const u = this.userToEdit.data || this.userToEdit;

      console.log('Data User yang diproses:', u);

      // Ambil ID Branch & Role (samakan huruf kecil agar cocok dengan value dropdown)
      const branchId = (u.branch?.id || u.branchId || '').toLowerCase();
      const roleId = (u.role?.id || u.roleId || '').toLowerCase();
      const phoneNumber = u.internalUserPhoneNumber || u.phone_number || '';

      this.userForm.patchValue({
        branchId: branchId,
        roleId: roleId,
        full_name: u.internalUserFullName || u.full_name || '',
        email: u.internalUserEmail || u.email || '',
        phone_number: phoneNumber,
        status: (u.internalUserIsActive === true || u.status === 'Active') ? 'Active' : 'Inactive'
      });

      // Password opsional saat edit
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else if (changes['isOpen'] && !this.isOpen) {
      this.resetForm();
    }
  }

  toggleStatus(): void {
    const currentStatus = this.userForm.get('status')?.value;
    this.userForm.patchValue({
      status: currentStatus === 'Active' ? 'Inactive' : 'Active'
    });
  }

  close(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  resetForm(): void {
    this.userForm.reset({
      branchId: '',
      roleId: '',
      status: 'Active'
    });
    // Kembalikan validasi wajib password untuk mode Tambah Baru
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      const payload: any = {
        branchId: formValue.branchId,
        roleId: formValue.roleId,
        internalUserFullName: formValue.full_name,
        internalUserEmail: formValue.email,
        internalUserPhoneNumber: formValue.phone_number,
        internalUserIsActive: formValue.status === 'Active'
      };

      if (this.userToEdit) {
        // MODE UPDATE: Sertakan employee code
        payload.internalUserEmployeeCode = this.userToEdit.internalUserEmployeeCode || this.userToEdit.employee_code || '';

        // Sertakan password baru hanya jika diisi
        if (formValue.password) {
          payload.internalUserPasswordHash = formValue.password;
        }
      } else {
        // MODE CREATE: Password wajib diisi
        payload.internalUserPasswordHash = formValue.password;
      }

      this.userSaved.emit({
        id: this.userToEdit?.id || this.userToEdit?.internalUserId,
        data: payload
      });

      this.close();
    }
  }
}