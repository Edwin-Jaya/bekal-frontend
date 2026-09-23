import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor, authContext, AUTH_CONTEXT } from './auth-interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    sessionStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should not attach token for public api without context', () => {
    http.get('/api/public').subscribe();

    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should not attach token for unauthenticated context', () => {
    http.get('/api/public', { context: authContext('unauthenticated') }).subscribe();

    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should attach Bearer token when authenticate context is set and token exists', () => {
    sessionStorage.setItem('token', 'sample-jwt-token');

    http.get('/api/protected', { context: authContext('authenticate') }).subscribe();

    const req = httpMock.expectOne('/api/protected');
    expect(req.request.headers.get('Authorization')).toBe('Bearer sample-jwt-token');
    req.flush({});
  });

  it('should redirect to login and throw error if token is missing on authenticate context', (done) => {
    http.get('/api/protected', { context: authContext('authenticate') }).subscribe({
      next: () => fail('Should have failed'),
      error: (err) => {
        expect(err.message).toBe('User not authenticated');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
        done();
      }
    });

    httpMock.expectNone('/api/protected');
  });

  it('should attach token in checking context when token exists', () => {
    sessionStorage.setItem('token', 'sample-jwt-token');

    http.get('/api/check', { context: authContext('checking') }).subscribe();

    const req = httpMock.expectOne('/api/check');
    expect(req.request.headers.get('Authorization')).toBe('Bearer sample-jwt-token');
    req.flush({});
  });

  it('should pass through in checking context when token is missing without redirect', () => {
    http.get('/api/check', { context: authContext('checking') }).subscribe();

    const req = httpMock.expectOne('/api/check');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    req.flush({});
  });

  it('should clear token and redirect to /login on 401 error for authenticate context', () => {
    sessionStorage.setItem('token', 'sample-jwt-token');

    http.get('/api/protected', { context: authContext('authenticate') }).subscribe({
      next: () => fail('Should have failed'),
      error: () => {
        expect(sessionStorage.getItem('token')).toBeNull();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      }
    });

    const req = httpMock.expectOne('/api/protected');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });
});
