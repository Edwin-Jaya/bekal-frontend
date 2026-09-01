import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRoleModal } from './add-role-modal';

describe('AddRoleModal', () => {
  let component: AddRoleModal;
  let fixture: ComponentFixture<AddRoleModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRoleModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRoleModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
