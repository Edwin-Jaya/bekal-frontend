import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuModal } from './add-menu-modal';

describe('AddMenuModal', () => {
  let component: AddMenuModal;
  let fixture: ComponentFixture<AddMenuModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMenuModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMenuModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
