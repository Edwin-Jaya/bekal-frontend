import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/me/menus';

  // Holds dynamic menu state globally
  menus = signal<MenuItem[]>([]);

  fetchUserMenus(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.apiUrl, { withCredentials: true }).pipe(
      tap((menuTree) => this.menus.set(menuTree))
    );
  }

  clearMenus(): void {
    this.menus.set([]);
  }
}
