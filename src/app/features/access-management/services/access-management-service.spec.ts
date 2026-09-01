import { TestBed } from '@angular/core/testing';

import { AccessManagementService } from './access-management-service';

describe('RoleMenuAccess', () => {
  let service: AccessManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
