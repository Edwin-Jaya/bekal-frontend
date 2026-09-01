import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthApiService } from '../../../core/auth/auth-api-service';
import { ButtonComponent } from "../../../shared/ui/button/button";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush // 1. Optimasi performa change detection
})
export class Login {
  private readonly authApi = inject(AuthApiService);
  private readonly router = inject(Router);

  // Form Binding
  email = '';
  password = '';
  
  // 2. Reactive UI State menggunakan Angular Signals
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  rememberMe = signal(false);
  
  toggleRememberMe() {
    this.rememberMe.update((v) => !v);
  }
  
  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  onLogin(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authApi.login({ email: this.email, password: this.password })
      .pipe(
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (response) => {
          const token = response?.data?.token;
          if (!token) {
            this.errorMessage.set('Format token tidak valid.');
            return;
          }

          sessionStorage.setItem('token', token);
          document.cookie = `token=${token}; path=/; SameSite=Lax`;

          const payloadBase64 = token.split('.')[1];
          const decoded = JSON.parse(atob(payloadBase64));

          if (decoded.role === 'SUPER_ADMIN') {
              this.router.navigate(['/admin/dashboard']);
            } else if (decoded.role === 'MARKETING') {
              this.router.navigate(['/marketing/dashboard']);
            } else if (decoded.role === 'BACK_OFFICE') {
              this.router.navigate(['back-office/dashboard']);
            } else if (decoded.role === 'BRANCH_MANAGER') {
              this.router.navigate(['branch-manager/dashboard']);
            }
        },
        error: (err) => {
          if (err.status === 401) {
            this.errorMessage.set('Kombinasi email dan password tidak cocok. Silakan coba lagi.');
          } else if (err.status === 0) {
            this.errorMessage.set('Gagal terhubung ke server Backend.');
          } else {
            this.errorMessage.set('Terjadi kesalahan, silakan coba lagi.');
          }
        }
      });
  }
}