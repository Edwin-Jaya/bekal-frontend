import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleItem, RoleResponse } from '../models/role-management-model';
import { environment } from '../../../../environments/environment';
import { authContext } from '../../../core/interceptor/auth-interceptor';

@Injectable({
  providedIn: 'root',
})
export class RoleManagementService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getRoles(page: number = 1, size: number = 10, status?: boolean | null): Observable<any> {
      let params = new HttpParams()
        .set('page', page - 1) // Spring Boot index dimulai dari 0
        .set('size', size);

      // Hanya kirim param 'status' jika bernilai true/false
      if (status !== null && status !== undefined) {
        params = params.set('status', status);
      }

      return this.http.get<any>(`${this.apiUrl}/role`, { params, context: authContext(), withCredentials: true });
    }

  createRole(payload: Partial<RoleManagementService>): Observable<RoleManagementService> {
     return this.http.post<any>(`${this.apiUrl}/role`, payload, { context: authContext(), withCredentials: true });
  }

  updateRole(id: string, payload: Partial<RoleManagementService>): Observable<RoleManagementService> {
    return this.http.post<any>(`${this.apiUrl}/role/${id}`, payload, { context: authContext(), withCredentials: true });
  }

  deleteRole(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/role/${id}`, { context: authContext(), withCredentials: true });
  }

}

