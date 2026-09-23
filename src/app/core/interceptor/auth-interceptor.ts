import { HttpInterceptorFn, HttpContextToken, HttpContext, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export type AuthContextType = 'checking' | 'authenticate' | 'unauthenticated';

export const AUTH_CONTEXT = new HttpContextToken<AuthContextType | null>(() => null);

export function authContext(type: AuthContextType = 'authenticate'): HttpContext {
  return new HttpContext().set(AUTH_CONTEXT, type);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  const authType = req.context.get(AUTH_CONTEXT);

  // Jika tidak memiliki HttpContext atau null, diperlakukan sebagai Public API (kecualikan HttpContext)
  if (!authType || authType === 'unauthenticated') {
    return next(req);
  }

  // Jika running di server-side (SSR), tidak ada sessionStorage/browser context
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  const token = sessionStorage.getItem('token');

  if (authType === 'authenticate') {
    if (!token) {
      router.navigate(['/login']);
      return throwError(() => new Error('User not authenticated'));
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(authReq).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          sessionStorage.removeItem('token');
          if (typeof document !== 'undefined') {
            document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax';
          }
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  if (authType === 'checking') {
    // Mode checking: lampirkan token jika ada, tetapi jangan paksa redirect jika token kosong / 401
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
    return next(req);
  }

  return next(req);
};
