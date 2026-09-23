import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MenuItem } from '../models/menu-model';
import { environment } from '../../../environments/environment';
import { authContext } from '../interceptor/auth-interceptor';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/me/menus`;

  // Holds dynamic menu state globally
  menus = signal<MenuItem[]>([]);

  fetchUserMenus(): Observable<MenuItem[]> {
    return this.http
      .get<MenuItem[]>(this.apiUrl, { context: authContext(), withCredentials: true })
      .pipe(tap((menuTree) => this.menus.set(menuTree)));
  }

  clearMenus(): void {
    this.menus.set([]);
  }
}
