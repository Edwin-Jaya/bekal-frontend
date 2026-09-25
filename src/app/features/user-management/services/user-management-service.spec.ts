import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserManagementService } from './user-management-service';
import { environment } from '../../../../environments/environment';
import { AUTH_CONTEXT } from '../../../core/interceptor/auth-interceptor';
import { CreateUserItem } from '../models/user.model';

describe('UserManagementService', () => {
  let service: UserManagementService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserManagementService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserManagementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser() / User Registration', () => {
    it('should send POST request to /internal-user with user registration payload and auth context', () => {
      const newUser: CreateUserItem = {
        branch: 'BR001',
        role: 'MARKETING',
        employee_code: 'EMP123',
        full_name: 'Budi Santoso',
        email: 'budi@bca.co.id',
        password: 'Password@123',
        phone_number: '081234567890',
        status: 'Active'
      };

      const mockResponse = {
        success: true,
        message: 'Internal user created successfully',
        data: { id: 'usr-999', ...newUser }
      };

      service.createUser(newUser).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.data.id).toBe('usr-999');
      });

      const req = httpMock.expectOne(`${apiUrl}/internal-user`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });

    it('should handle registration failure when email/employee code already exists', (done) => {
      const newUser: Partial<CreateUserItem> = {
        email: 'duplicate@bca.co.id',
        employee_code: 'EMP123'
      };

      service.createUser(newUser).subscribe({
        next: () => fail('Should have failed with 400 Bad Request'),
        error: (err) => {
          expect(err.status).toBe(400);
          done();
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/internal-user`);
      req.flush({ message: 'User already exists' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getUsers()', () => {
    it('should send GET request to /internal-user with default pagination (page 0 for Spring Boot)', () => {
      const mockResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0
      };

      service.getUsers(1, 10).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url === `${apiUrl}/internal-user`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      expect(req.request.params.has('status')).toBeFalse();
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockResponse);
    });

    it('should include status parameter when provided', () => {
      service.getUsers(2, 20, true).subscribe();

      const req = httpMock.expectOne((r) => r.url === `${apiUrl}/internal-user`);
      expect(req.request.params.get('page')).toBe('1');
      expect(req.request.params.get('size')).toBe('20');
      expect(req.request.params.get('status')).toBe('true');
      req.flush({ content: [] });
    });
  });

  describe('getBranches()', () => {
    it('should send GET request to /branches with auth context and withCredentials', () => {
      const mockBranches = [
        { id: '1', branchCode: 'KC-001', branchName: 'Jakarta Pusat' },
        { id: '2', branchCode: 'KC-002', branchName: 'Surabaya' }
      ];

      service.getBranches().subscribe((res) => {
        expect(res).toEqual(mockBranches);
        expect(res.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/branches`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockBranches);
    });
  });

  describe('getRoles()', () => {
    it('should send GET request to /role/all with auth context and withCredentials', () => {
      const mockRoles = [
        { id: '1', roleName: 'SUPER_ADMIN' },
        { id: '2', roleName: 'MARKETING' }
      ];

      service.getRoles().subscribe((res) => {
        expect(res).toEqual(mockRoles);
        expect(res.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/role/all`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush(mockRoles);
    });
  });

  describe('updateUser()', () => {
    it('should send POST request to /internal-user/:id with updated data', () => {
      const updatedData = { full_name: 'Budi Updated', status: 'Inactive' };
      const userId = 'usr-100';

      service.updateUser(userId, updatedData).subscribe((res) => {
        expect(res.success).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/internal-user/${userId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(updatedData);
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush({ success: true });
    });
  });

  describe('deleteUser()', () => {
    it('should send DELETE request to /internal-user/:id', () => {
      const userId = 'usr-100';

      service.deleteUser(userId).subscribe((res) => {
        expect(res.success).toBeTrue();
      });

      const req = httpMock.expectOne(`${apiUrl}/internal-user/${userId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBeTrue();
      expect(req.request.context.get(AUTH_CONTEXT)).toBe('authenticate');
      req.flush({ success: true });
    });
  });
});
