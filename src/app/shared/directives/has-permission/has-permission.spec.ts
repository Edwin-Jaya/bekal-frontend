import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HasPermission } from './has-permission';

describe('HasPermission', () => {
  let component: HasPermission;
  let fixture: ComponentFixture<HasPermission>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HasPermission]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HasPermission);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
