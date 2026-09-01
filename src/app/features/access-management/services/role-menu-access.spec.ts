import { TestBed } from '@angular/core/testing';

import { RoleMenuAccess } from './role-menu-access';

describe('RoleMenuAccess', () => {
  let service: RoleMenuAccess;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleMenuAccess);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
