import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PageResponse, RoleMenuAccessItem, SaveRoleMenuAccessRequest, RoleOption, ApiResponse } from '../models/access-management-model';
import { map } from 'rxjs/operators';
import { authContext } from '../../../core/interceptor/auth-interceptor';

@Injectable({
  providedIn: 'root',
})

export class AccessManagementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/role-menu-access`;
  private rolesUrl = `${environment.apiUrl}/role/all`;

  getRoles(): Observable<RoleOption[]> {
    return this.http.get<ApiResponse<RoleOption[]>>(this.rolesUrl, { context: authContext(), withCredentials: true }).pipe(
      map(response => response.data)
    );
  }

  // GET: Load matrix per role
  getMatrixByRole(roleId: string, page = 0, size = 10): Observable<PageResponse<RoleMenuAccessItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<RoleMenuAccessItem>>(`${this.apiUrl}/role/${roleId}`, { params, context: authContext(), withCredentials: true });
  }

  // POST: Simpan checklist matrix
  assignPermissions(roleId: string, matrix: SaveRoleMenuAccessRequest[]): Observable<string> {
    const payload: SaveRoleMenuAccessRequest[] = matrix.map(item => ({
      menuId: item.menuId,
      roleMenuCanView: item.roleMenuCanView,
      roleMenuCanCreate: item.roleMenuCanCreate,
      roleMenuCanEdit: item.roleMenuCanEdit,
      roleMenuCanDelete: item.roleMenuCanDelete,
      roleMenuCanApprove: item.roleMenuCanApprove
    }));

    return this.http.post(`${this.apiUrl}/assign/${roleId}`, payload, { responseType: 'text', context: authContext(), withCredentials: true });
  }
}

