import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserItem, CreateUserItem } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class User {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1'; // Sesuaikan URL backend

  // Method Fetch List Cabang
  getBranches(): Observable<any> {
    return this.http.get(`${this.apiUrl}/branches`,{ withCredentials: true }); // Sesuaikan endpoint backend cabang
  }

  // Method Fetch List Role
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/role/all`,{ withCredentials: true }); // Sesuaikan endpoint backend role
  }

  // GET: Fetch list users
  getUsers(page: number = 1, size: number = 10, status?: boolean | null): Observable<any> {
      let params = new HttpParams()
        .set('page', page - 1) // Spring Boot index dimulai dari 0
        .set('size', size);

      // Hanya kirim param 'status' jika bernilai true/false
      if (status !== null && status !== undefined) {
        params = params.set('status', status);
      }

      return this.http.get<any>(`${this.apiUrl}/internal-user`, { params, withCredentials: true });
    }

  // POST: Create new user
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/internal-user`, userData, { withCredentials: true });
  }

  // PUT: Update user
// user.service.ts
  updateUser(id: string, userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/internal-user/${id}`, userData, { withCredentials: true });
  }
  // DELETE: Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/internal-user/${id}`,{ withCredentials: true });
  }
}