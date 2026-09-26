import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-owner-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card card">
        
        <!-- Brand Header -->
        <div class="login-header">
          <a routerLink="/" class="brand-logo">
            <div class="logo-mark">S</div>
            <div class="brand-details">
              <span class="brand-title">{{ shopService.shopInfo().name }}</span>
              <span class="brand-tagline">SHOP OWNER PORTAL</span>
            </div>
          </a>
          <h2 class="welcome-heading">Welcome Back</h2>
          <p class="welcome-sub">Sign in to manage products, categories, website CMS, and shop settings.</p>
        </div>

        <!-- Error Alert -->
        <div class="alert alert-danger" *ngIf="errorMessage()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{{ errorMessage() }}</span>
        </div>

        <!-- Login Form -->
        <form (submit)="onLogin($event)" class="login-form">
          
          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label" for="email">Owner Email Address</label>
            <div class="input-icon-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input 
                type="email" 
                id="email"
                [(ngModel)]="email" 
                name="email"
                placeholder="e.g. owner@shadas.com" 
                class="form-input with-icon"
                required
              >
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <div class="label-row">
              <label class="form-label" for="password">Password</label>
              <button type="button" class="forgot-link" (click)="showForgotModal = true">
                Forgot password?
              </button>
            </div>
            
            <div class="input-icon-wrapper">
              <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password"
                [(ngModel)]="password" 
                name="password"
                placeholder="Enter your password" 
                class="form-input with-icon with-right-btn"
                required
              >
              <button 
                type="button" 
                class="toggle-pwd-btn" 
                (click)="showPassword = !showPassword"
                title="Toggle password visibility"
              >
                <!-- Eye open -->
                <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <!-- Eye closed -->
                <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn btn-primary btn-lg submit-btn"
            [disabled]="loading()"
          >
            <span *ngIf="!loading()">Sign In to Dashboard</span>
            <span *ngIf="loading()">Authenticating...</span>
            <svg *ngIf="!loading()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>

          <!-- Quick Seed Creds Helper -->
          <div class="seed-helper-box">
            <span class="helper-title">Default Owner Credentials:</span>
            <code>Email: owner&#64;shadas.com | Password: owner123</code>
            <button type="button" class="fill-btn" (click)="fillDefaultCreds()">Auto-fill</button>
          </div>

          <div class="back-to-store">
            <a routerLink="/">← Return to Public Website</a>
          </div>

        </form>

      </div>

      <!-- Forgot Password Modal -->
      <div class="modal-backdrop" *ngIf="showForgotModal" (click)="showForgotModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <h3>Reset Password</h3>
          <p>For store security in Version 1, password resets can be performed directly via the Django admin console or terminal command.</p>
          <p class="sub-hint">Contact platform admin or run: <code>python manage.py createsuperuser</code></p>
          <button type="button" class="btn btn-primary btn-sm" (click)="showForgotModal = false">Understood</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      background: radial-gradient(circle at top, var(--bg-surface-soft) 0%, var(--bg-body) 100%);
    }
    .login-card {
      max-width: 460px;
      width: 100%;
      padding: 2.75rem 2.25rem;
      box-shadow: var(--shadow-xl);
      animation: fadeIn 0.3s ease-out;
    }
    .login-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-bottom: 2rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 800;
    }
    .brand-tagline {
      font-size: 0.65rem;
      font-weight: 700;
      color: var(--brand-red);
      letter-spacing: 0.15em;
    }
    .welcome-heading {
      font-size: 1.75rem;
      margin-bottom: 0.35rem;
    }
    .welcome-sub {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .alert-danger {
      background: var(--danger-bg);
      color: var(--danger);
      border: 1px solid rgba(220, 38, 38, 0.2);
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .forgot-link {
      font-size: 0.8125rem;
      color: var(--brand-red);
      font-weight: 600;
    }
    .forgot-link:hover {
      text-decoration: underline;
    }
    .input-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input-icon {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      pointer-events: none;
    }
    .form-input.with-icon {
      padding-left: 2.75rem;
    }
    .form-input.with-right-btn {
      padding-right: 2.75rem;
    }
    .toggle-pwd-btn {
      position: absolute;
      right: 0.75rem;
      color: var(--text-muted);
      padding: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .toggle-pwd-btn:hover {
      color: var(--text-primary);
    }

    .submit-btn {
      width: 100%;
      margin-top: 0.5rem;
    }

    .seed-helper-box {
      background: var(--bg-surface-soft);
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-md);
      padding: 0.85rem;
      font-size: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      text-align: center;
      margin-top: 0.5rem;
    }
    .helper-title {
      font-weight: 700;
      color: var(--text-primary);
    }
    .seed-helper-box code {
      font-family: monospace;
      color: var(--brand-red);
    }
    .fill-btn {
      align-self: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--brand-red);
      text-decoration: underline;
      cursor: pointer;
    }

    .back-to-store {
      text-align: center;
      margin-top: 1rem;
    }
    .back-to-store a {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .back-to-store a:hover {
      color: var(--brand-red);
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      z-index: 1000;
    }
    .modal-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 2rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: var(--shadow-xl);
    }
    .sub-hint {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
  `]
})
export class OwnerLoginComponent implements OnInit {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  shopService = inject(ShopService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = 'owner@shadas.com';
  password = 'owner123';
  showPassword = false;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showForgotModal = false;

  private returnUrl = '/owner/dashboard';

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/owner/dashboard']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/owner/dashboard';
  }

  fillDefaultCreds(): void {
    this.email = 'owner@shadas.com';
    this.password = 'owner123';
  }

  onLogin(event: Event): void {
    event.preventDefault();
    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Welcome back to Shaddas Dashboard!');
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.loading.set(false);
        const detail = err.error?.detail || err.error?.errors?.non_field_errors?.[0] || 'Invalid email or password. Please try again.';
        this.errorMessage.set(detail);
        this.toast.error(detail);
      }
    });
  }
}
