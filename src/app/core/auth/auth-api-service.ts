import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, ApiResponse, AuthData } from './auth-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = environment.apiUrl;

  login(credentials: LoginRequest): Observable<ApiResponse<AuthData>> {
    return this.http.post<ApiResponse<AuthData>>(
      `${this.baseUrl}/auth/login-employee`, 
      credentials,
      { withCredentials: true }
    );
  }

  register(userData: RegisterRequest | any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/auth/register`,
      userData
    );
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }
  
  logout(): void {
      sessionStorage.removeItem('token');

      document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax';

      this.router.navigate(['/login']);
    }

  getUserRole(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      console.log(decodedPayload.role);
      return decodedPayload?.role || null;
    } catch (e) {
      console.error('Failed to parse JWT role', e);
      return null;
    }
  }
}