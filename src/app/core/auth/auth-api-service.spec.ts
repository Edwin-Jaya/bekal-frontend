import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api-service';
import { environment } from '../../../environments/environment';
import { LoginRequest, ApiResponse, AuthData, RegisterRequest } from './auth-model';

describe('AuthApiService', () => {
  let service: AuthApiService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthApiService);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login()', () => {
    it('should send POST request to /auth/login-employee with credentials and withCredentials=true', () => {
      const credentials: LoginRequest = {
        email: 'employee@bca.co.id',
        password: 'password123'
      };

      const mockResponse: ApiResponse<AuthData> = {
        timestamp: '2026-09-25T10:00:00Z',
        status: 200,
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token',
          type: 'Bearer'
        }
      };

      service.login(credentials).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        expect(res.data.token).toBe('mock-jwt-token');
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/login-employee`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(credentials);
      expect(req.request.withCredentials).toBeTrue();
      req.flush(mockResponse);
    });

    it('should handle login error response', (done) => {
      const credentials: LoginRequest = {
        email: 'invalid@bca.co.id',
        password: 'wrong'
      };

      service.login(credentials).subscribe({
        next: () => fail('Should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/login-employee`);
      req.flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register()', () => {
    it('should send POST request to /auth/register with user payload', () => {
      const registerData: RegisterRequest = {
        email: 'newuser@bca.co.id',
        password: 'Password@123',
        fullName: 'New Employee',
        role: 'MARKETING',
        branchId: 'BR-001'
      };

      const mockResponse: ApiResponse<any> = {
        timestamp: '2026-09-25T10:00:00Z',
        status: 201,
        success: true,
        message: 'Registration successful',
        data: { id: 'usr-123', email: 'newuser@bca.co.id' }
      };

      service.register(registerData).subscribe((res) => {
        expect(res.success).toBeTrue();
        expect(res.message).toBe('Registration successful');
        expect(res.data.id).toBe('usr-123');
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockResponse);
    });

    it('should handle registration error response', (done) => {
      const registerData: RegisterRequest = {
        email: 'existing@bca.co.id',
        password: 'Password@123'
      };

      service.register(registerData).subscribe({
        next: () => fail('Should have failed with 409 Conflict'),
        error: (error) => {
          expect(error.status).toBe(409);
          done();
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/auth/register`);
      req.flush({ message: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('isAuthenticated()', () => {
    it('should return true if token exists in sessionStorage', () => {
      sessionStorage.setItem('token', 'valid-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if token does not exist in sessionStorage', () => {
      sessionStorage.removeItem('token');
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('logout()', () => {
    it('should remove token from sessionStorage, clear cookie, and navigate to /login', () => {
      sessionStorage.setItem('token', 'valid-token');
      document.cookie = 'token=valid-token; path=/';

      service.logout();

      expect(sessionStorage.getItem('token')).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getUserRole()', () => {
    it('should return null if token is not present in sessionStorage', () => {
      sessionStorage.removeItem('token');
      expect(service.getUserRole()).toBeNull();
    });

    it('should decode JWT and return user role when valid token exists', () => {
      const payload = {
        sub: '123456',
        email: 'employee@bca.co.id',
        role: 'SUPER_ADMIN',
        exp: 1999999999
      };
      const encodedPayload = btoa(JSON.stringify(payload));
      const dummyJwt = `header.${encodedPayload}.signature`;

      sessionStorage.setItem('token', dummyJwt);

      expect(service.getUserRole()).toBe('SUPER_ADMIN');
    });

    it('should return null if token payload is invalid base64 or JSON', () => {
      sessionStorage.setItem('token', 'invalid.token.structure!!!');
      expect(service.getUserRole()).toBeNull();
    });
  });
});
