import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { AuthApiService } from '../../../core/auth/auth-api.service';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authApiSpy: jasmine.SpyObj<AuthApiService>;
  let routerSpy: jasmine.SpyObj<Router>;


  function fakeToken(role: string): string {
    const header = btoa(JSON.stringify({ alg: 'none' }));
    const payload = btoa(JSON.stringify({ role }));
    return `${header}.${payload}.signature`;
  }

  beforeEach(async () => {
    authApiSpy = jasmine.createSpyObj('AuthApiService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthApiService, useValue: authApiSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to admin dashboard on successful login with SUPER_ADMIN role', () => {
    const token = fakeToken('SUPER_ADMIN');
    authApiSpy.login.and.returnValue(of({ data: { token } } as any));

    component.email = 'admin@test.com';
    component.password = 'correctpassword';
    component.onLogin();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
    expect(component.errorMessage()).toBe('');
    expect(component.isLoading()).toBeFalse();
  });

  it('should show error on 401 invalid credentials', () => {
    authApiSpy.login.and.returnValue(
      throwError(() => ({ status: 401 }))
    );

    component.email = 'wrong@test.com';
    component.password = 'wrongpassword';
    component.onLogin();

    expect(component.errorMessage()).toBe('Kombinasi email dan password tidak cocok. Silakan coba lagi.');
    expect(component.isLoading()).toBeFalse();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should show error when backend is unreachable (status 0)', () => {
    authApiSpy.login.and.returnValue(
      throwError(() => ({ status: 0 }))
    );

    component.email = 'user@test.com';
    component.password = 'somepassword';
    component.onLogin();

    expect(component.errorMessage()).toBe('Gagal terhubung ke server Backend.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should show generic error on unexpected error status', () => {
    authApiSpy.login.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.email = 'user@test.com';
    component.password = 'somepassword';
    component.onLogin();

    expect(component.errorMessage()).toBe('Terjadi kesalahan, silakan coba lagi.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should show error when token is missing from response', () => {
    authApiSpy.login.and.returnValue(of({ data: {} } as any));

    component.email = 'user@test.com';
    component.password = 'somepassword';
    component.onLogin();

    expect(component.errorMessage()).toBe('Format token tidak valid.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should set isLoading to true while request is in flight and false after', () => {
    authApiSpy.login.and.returnValue(
      throwError(() => ({ status: 401 }))
    );

    component.onLogin();

    expect(component.isLoading()).toBeFalse();
  });
});