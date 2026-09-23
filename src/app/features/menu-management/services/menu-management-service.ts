import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { authContext } from '../../../core/interceptor/auth-interceptor';

@Injectable({
  providedIn: 'root',
})
export class ManagementMenuService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  getMenus(page: number = 1, size: number = 10, status?: boolean | null): Observable<any> {
      let params = new HttpParams()
        .set('page', page - 1) // Spring Boot index dimulai dari 0
        .set('size', size);

      // Hanya kirim param 'status' jika bernilai true/false
      if (status !== null && status !== undefined) {
        params = params.set('status', status);
      }

      return this.http.get<any>(`${this.apiUrl}/menu`, { params, context: authContext(), withCredentials: true });
    }

  createMenu(payload: Partial<ManagementMenuService>): Observable<ManagementMenuService> {
     return this.http.post<any>(`${this.apiUrl}/menu`, payload, { context: authContext(), withCredentials: true });
  }

  updateMenu(id: string, payload: Partial<ManagementMenuService>): Observable<ManagementMenuService> {
    return this.http.post<any>(`${this.apiUrl}/menu/${id}`, payload, { context: authContext(), withCredentials: true });
  }

  deleteMenu(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menu/${id}`, { context: authContext(), withCredentials: true });
  }
}

