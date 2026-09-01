import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserModal } from './add-user-modal';

describe('AddUserModal', () => {
  let component: AddUserModal;
  let fixture: ComponentFixture<AddUserModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUserModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
