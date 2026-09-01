import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManagementMenuService } from '../../services/menu-management-service';

@Component({
  selector: 'app-add-menu-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-menu-modal.html',
  styleUrl: './add-menu-modal.css',
})
export class AddMenuModal implements OnChanges {
  @Input() isOpen = false;
  @Input() menuToEdit: any | null = null;
  @Input() parentMenuItems: any[] = []; 

  @Output() closeModal = new EventEmitter<void>();
  @Output() menuSaved = new EventEmitter<{ id?: string; data: any }>();

  private menuService = inject(ManagementMenuService);
  private fb = inject(FormBuilder);

  menuForm: FormGroup;
  availableParents: any[] = [];

  constructor() {
    this.menuForm = this.fb.group({
      menuParentId: [null],
      menuName: ['', [Validators.required]],
      menuPath: ['', [Validators.required]],
      menuIcon: [''],
      menuSortOrder: [1, [Validators.required, Validators.min(1)]],
      menuIsActive: [true]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.fetchAndSetParentMenus();

      if (this.menuToEdit) {
        const u = this.menuToEdit.data || this.menuToEdit;

        // Ambil parent ID dari objek menuParent atau menuParentId
        const parentId = u.menuParentId || u.menuParent?.id || (typeof u.menuParent === 'string' ? u.menuParent : null);

        this.menuForm.patchValue({
          menuParentId: parentId,
          menuName: u.menuName || '',
          menuPath: u.menuPath || '',
          menuIcon: u.menuIcon || '',
          menuSortOrder: u.menuSortOrder ?? 1,
          menuIsActive: u.menuIsActive ?? (u.status === 'Active')
        });
      } else {
        this.resetForm();
      }
    } else if (changes['isOpen'] && !this.isOpen) {
      this.resetForm();
    }
  }

  private fetchAndSetParentMenus(): void {
    const rawItem = this.menuToEdit?.data || this.menuToEdit;
    const currentEditId = rawItem?.id || rawItem?.menuId;

    // Jika @Input parentMenuItems sudah diisi, gunakan itu. Jika kosong, fetch langsung dari Service.
    if (this.parentMenuItems && this.parentMenuItems.length > 0) {
      this.availableParents = this.parentMenuItems.filter(
        (m: any) => (m.id || m.menuId) !== currentEditId
      );
    } else {
      this.menuService.getMenus(1, 100, true).subscribe({
        next: (response: any) => {
          const fetchedList = response.content || response || [];
          // Filter agar menu yang sedang diedit tidak bisa menjadi parent untuk dirinya sendiri
          this.availableParents = fetchedList.filter(
            (m: any) => (m.id || m.menuId) !== currentEditId
          );
        },
        error: (err) => console.error('Gagal mengambil daftar parent menu:', err)
      });
    }
  }

  toggleStatus(): void {
    const current = this.menuForm.get('menuIsActive')?.value;
    this.menuForm.patchValue({ menuIsActive: !current });
  }

  close(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  resetForm(): void {
    this.menuForm.reset({
      menuParentId: null,
      menuName: '',
      menuPath: '',
      menuIcon: '',
      menuSortOrder: 1,
      menuIsActive: true
    });
  }

  onSubmit(): void {
    if (this.menuForm.valid) {
      const formValue = this.menuForm.value;
      const selectedParentId = formValue.menuParentId || null;

      const payload: any = {
        // Kirim ID flat
        menuParentId: selectedParentId,
        
        // Kirim format Objek Relasi (Diperlukan jika JPA Backend memakai @ManyToOne Menu menuParent)
        menuParent: selectedParentId ? { id: selectedParentId } : null,
        
        menuName: formValue.menuName ?? '',
        menuPath: formValue.menuPath ?? '',
        menuIcon: formValue.menuIcon ?? '',
        menuSortOrder: Number(formValue.menuSortOrder) || 1,
        menuIsActive: Boolean(formValue.menuIsActive)
      };

      const rawItem = this.menuToEdit?.data || this.menuToEdit;
      const editId = rawItem?.id || rawItem?.menuId;

      this.menuSaved.emit({
        id: editId,
        data: payload
      });

      this.close();
    }
  }
}