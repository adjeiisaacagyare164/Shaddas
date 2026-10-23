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
      <aside class="login-visual" aria-label="Shaddas brand">
        <a routerLink="/" class="visual-brand" aria-label="Shaddas home">
          <span class="visual-mark">S</span>
          <span class="visual-wordmark">SHADDAS</span>
        </a>
        <div class="visual-copy">
          <span class="visual-eyebrow">OWNER WORKSPACE</span>
          <h1>Made for<br><em>the details.</em></h1>
          <span class="visual-location">ACCRA, GHANA</span>
        </div>
        <span class="visual-index">01 <span></span> 01</span>
      </aside>

      <main class="login-main">
        <div class="topbar">
          <span class="secure-label">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>
            SECURE OWNER ACCESS
          </span>
          <a routerLink="/" class="store-link">Back to storefront <span aria-hidden="true">↗</span></a>
        </div>

        <section class="login-content" aria-labelledby="login-title">
          <div class="form-heading">
            <span class="form-eyebrow">{{ shopService.shopInfo().name }} / ADMIN</span>
            <h2 id="login-title">Welcome back<span>.</span></h2>
            <p>Sign in to continue to your store.</p>
          </div>

          <div class="alert alert-danger" *ngIf="errorMessage()" role="alert" aria-live="polite">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>{{ errorMessage() }}</span>
          </div>

          <form (submit)="onLogin($event)" class="login-form">
            <div class="form-group">
              <label class="form-label" for="email">Email address</label>
              <div class="input-shell">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>
                <input
                  type="email"
                  id="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="you@yourstore.com"
                  autocomplete="username"
                  class="form-input"
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label class="form-label" for="password">Password</label>
                <button type="button" class="forgot-link" (click)="showForgotModal = true; resetMessage.set(null)">
                  Forgot password?
                </button>
              </div>

              <div class="input-shell">
                <svg class="field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  [(ngModel)]="password"
                  name="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  class="form-input has-action"
                  required
                >
                <button
                  type="button"
                  class="toggle-password"
                  (click)="showPassword = !showPassword"
                  [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                  [attr.aria-pressed]="showPassword"
                >
                  <svg *ngIf="!showPassword" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg *ngIf="showPassword" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10 10 0 0 1 12 5c6.4 0 10 7 10 7a15 15 0 0 1-3 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a9.8 9.8 0 0 0 3.1-.5"/></svg>
                </button>
              </div>
            </div>

            <button
              type="submit"
              class="submit-btn"
              [disabled]="loading()"
              [attr.aria-busy]="loading()"
            >
              <span>{{ loading() ? 'Signing in...' : 'Sign in' }}</span>
              <svg *ngIf="!loading()" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              <span *ngIf="loading()" class="button-spinner" aria-hidden="true"></span>
            </button>
          </form>

          <div class="form-footer">
            <span class="footer-rule"></span>
            <span>SHADDAS OWNER PORTAL</span>
            <span class="footer-rule"></span>
          </div>
        </section>
      </main>

      <!-- Forgot Password Modal -->
      <div class="modal-backdrop" *ngIf="showForgotModal" (click)="showForgotModal = false">
        <div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="reset-title" (click)="$event.stopPropagation()">
          <span class="modal-eyebrow">ACCOUNT RECOVERY</span>
          <h3 id="reset-title">Reset password</h3>
          <p>We will send a reset link to the owner email entered on the sign-in form.</p>
          <p class="sub-hint" *ngIf="resetMessage()" role="status">{{ resetMessage() }}</p>
          <button type="button" class="submit-btn modal-submit" (click)="sendPasswordReset()" [disabled]="resetLoading() || !email.trim()">
            {{ resetLoading() ? 'Sending...' : 'Send reset link' }}
          </button>
          <button type="button" class="modal-close" (click)="showForgotModal = false">Cancel</button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }
    .login-page {
      min-height: 100vh;
      min-height: 100svh;
      display: grid;
      grid-template-columns: minmax(380px, 0.94fr) minmax(500px, 1.06fr);
      background: var(--bg-body);
      color: var(--text-primary);
    }
    .login-visual {
      min-height: 100vh;
      min-height: 100svh;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 42px 48px;
      overflow: hidden;
      color: #fff;
      background-color: #2a1715;
      background-image: linear-gradient(180deg, rgba(22, 13, 12, 0.16) 0%, rgba(22, 13, 12, 0.28) 38%, rgba(22, 13, 12, 0.78) 100%), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1500&q=85');
      background-size: cover;
      background-position: center;
      animation: image-reveal 700ms ease-out both;
    }
    .visual-brand { display: inline-flex; align-items: center; gap: 12px; width: fit-content; color: #fff; }
    .visual-mark {
      width: 38px;
      height: 38px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255, 255, 255, 0.72);
      font-family: var(--font-heading);
      font-size: 22px;
      line-height: 1;
    }
    .visual-wordmark { font-family: var(--font-heading); font-size: 15px; font-weight: 700; letter-spacing: 0.12em; }
    .visual-copy { padding-bottom: 27px; animation: rise-in 550ms 120ms ease-out both; }
    .visual-eyebrow, .visual-location, .visual-index, .secure-label, .form-eyebrow, .footer-rule + span, .modal-eyebrow {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
    }
    .visual-eyebrow { color: #e9c9b1; }
    .visual-copy h1 {
      margin: 17px 0 32px;
      color: #fff;
      font-family: var(--font-heading);
      font-size: 54px;
      font-weight: 500;
      line-height: 1.03;
      letter-spacing: 0;
    }
    .visual-copy h1 em { color: #e9c9b1; font-family: Georgia, 'Times New Roman', serif; font-weight: 400; }
    .visual-location { color: rgba(255, 255, 255, 0.72); }
    .visual-index { display: flex; align-items: center; gap: 10px; color: rgba(255, 255, 255, 0.75); }
    .visual-index span { width: 30px; height: 1px; background: rgba(255, 255, 255, 0.58); }
    .login-main { min-width: 0; display: flex; flex-direction: column; padding: 37px 58px 30px; }
    .topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
    .secure-label { display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); white-space: nowrap; }
    .secure-label svg { color: var(--success); }
    .store-link { display: inline-flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 13px; font-weight: 600; white-space: nowrap; }
    .store-link span { color: var(--brand-red); font-size: 16px; }
    .store-link:hover { color: var(--brand-red); }
    .login-content { width: min(100%, 420px); margin: auto; padding: 58px 0 44px; animation: rise-in 500ms 80ms ease-out both; }
    .form-heading { margin-bottom: 37px; }
    .form-eyebrow { display: block; margin-bottom: 17px; color: var(--brand-red); }
    .form-heading h2 { margin: 0; font-size: 36px; font-weight: 600; line-height: 1.14; letter-spacing: 0; }
    .form-heading h2 span { color: var(--brand-red); }
    .form-heading p { margin-top: 11px; color: var(--text-secondary); font-size: 14px; }
    .login-form { display: flex; flex-direction: column; gap: 24px; }
    .form-group { display: flex; flex-direction: column; gap: 9px; }
    .label-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .form-label { color: var(--text-primary); font-size: 13px; font-weight: 600; }
    .forgot-link { padding: 2px 0; color: var(--brand-red); font-size: 12px; font-weight: 600; }
    .forgot-link:hover { text-decoration: underline; text-underline-offset: 3px; }
    .input-shell { position: relative; }
    .field-icon { position: absolute; top: 50%; left: 15px; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
    .input-shell .form-input {
      width: 100%;
      min-height: 52px;
      padding: 0 48px 0 45px;
      border: 1px solid var(--border-strong);
      border-radius: 6px;
      background: var(--bg-surface);
      color: var(--text-primary);
      font-size: 14px;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
    }
    .input-shell .form-input::placeholder { color: var(--text-muted); opacity: 0.8; }
    .input-shell .form-input:focus { outline: none; border-color: var(--brand-red); box-shadow: 0 0 0 3px var(--brand-red-glow); }
    .toggle-password { position: absolute; top: 50%; right: 10px; transform: translateY(-50%); display: grid; place-items: center; width: 34px; height: 34px; border-radius: 4px; color: var(--text-muted); }
    .toggle-password:hover { color: var(--text-primary); background: var(--bg-surface-soft); }
    .toggle-password:focus-visible, .forgot-link:focus-visible, .store-link:focus-visible, .visual-brand:focus-visible, .modal-close:focus-visible { outline: 2px solid var(--brand-red); outline-offset: 3px; }
    .submit-btn {
      width: 100%;
      min-height: 52px;
      margin-top: 5px;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 11px;
      border: 1px solid var(--brand-red);
      border-radius: 6px;
      background: var(--brand-red);
      color: #fff;
      font-size: 14px;
      font-weight: 700;
      transition: background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
    }
    .submit-btn:hover:not(:disabled) { border-color: var(--brand-red-hover); background: var(--brand-red-hover); transform: translateY(-1px); }
    .submit-btn:focus-visible { outline: 3px solid var(--brand-red-glow); outline-offset: 3px; }
    .submit-btn:disabled { cursor: wait; opacity: 0.72; }
    .button-spinner { width: 17px; height: 17px; border: 2px solid rgba(255,255,255,.45); border-top-color: #fff; border-radius: 50%; animation: spin 700ms linear infinite; }
    .form-footer { display: flex; align-items: center; justify-content: center; gap: 13px; margin-top: 35px; color: var(--text-muted); }
    .form-footer > span:nth-child(2) { font-size: 9px; font-weight: 700; letter-spacing: 0.13em; white-space: nowrap; }
    .footer-rule { width: 35px; height: 1px; background: var(--border-strong); }
    .alert { display: flex; align-items: center; gap: 10px; margin: -18px 0 23px; padding: 12px 13px; border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 6px; font-size: 13px; }
    .alert-danger { background: var(--danger-bg); color: var(--danger); }
    .alert-danger svg { flex: 0 0 auto; }
    .modal-backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; padding: 20px; background: rgba(20, 15, 13, 0.58); backdrop-filter: blur(5px); }
    .modal-card { width: min(100%, 410px); padding: 31px; display: flex; flex-direction: column; align-items: flex-start; gap: 13px; border: 1px solid var(--border-subtle); border-radius: 8px; background: var(--bg-surface); box-shadow: var(--shadow-xl); animation: rise-in 220ms ease-out both; }
    .modal-eyebrow { color: var(--brand-red); }
    .modal-card h3 { font-size: 24px; font-weight: 600; letter-spacing: 0; }
    .modal-card p { font-size: 13px; line-height: 1.65; }
    .sub-hint { color: var(--text-secondary); }
    .modal-submit { margin-top: 7px; }
    .modal-close { align-self: center; padding: 5px 12px; color: var(--text-secondary); font-size: 13px; font-weight: 600; }
    .modal-close:hover { color: var(--text-primary); }
    @keyframes rise-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes image-reveal { from { opacity: 0.65; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 900px) {
      .login-page { grid-template-columns: minmax(300px, 0.8fr) minmax(430px, 1.2fr); }
      .login-visual { padding: 34px 32px; }
      .visual-copy h1 { font-size: 45px; }
      .login-main { padding-right: 36px; padding-left: 36px; }
    }
    @media (max-width: 680px) {
      .login-page { display: flex; flex-direction: column; }
      .login-visual { min-height: 190px; height: 190px; padding: 23px 25px; background-position: center 46%; }
      .visual-brand { gap: 10px; }
      .visual-mark { width: 32px; height: 32px; font-size: 19px; }
      .visual-wordmark { font-size: 13px; }
      .visual-copy { display: none; }
      .visual-index { position: absolute; right: 25px; bottom: 26px; font-size: 9px; }
      .login-main { flex: 1; padding: 23px 25px 27px; }
      .topbar { align-items: flex-start; }
      .secure-label { font-size: 9px; }
      .store-link { font-size: 12px; }
      .login-content { margin: auto; padding: 52px 0 31px; }
      .form-heading { margin-bottom: 31px; }
      .form-heading h2 { font-size: 32px; }
    }
    @media (max-width: 380px) {
      .login-main { padding-right: 19px; padding-left: 19px; }
      .topbar { gap: 10px; }
      .secure-label { gap: 5px; font-size: 8px; }
      .store-link { gap: 4px; font-size: 11px; }
      .login-content { padding-top: 42px; }
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
    }
  `]
})
export class OwnerLoginComponent implements OnInit {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  shopService = inject(ShopService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  showForgotModal = false;
  resetLoading = signal(false);
  resetMessage = signal<string | null>(null);

  private returnUrl = '/owner/dashboard';

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/owner/dashboard';
    void this.authService.ready.then(() => {
      if (this.authService.isAuthenticated()) {
        this.router.navigate(['/owner/dashboard']);
      }
    });
  }

  sendPasswordReset(): void {
    this.resetLoading.set(true);
    this.resetMessage.set(null);
    this.authService.sendPasswordReset(this.email.trim()).subscribe({
      next: () => {
        this.resetMessage.set('A password reset link has been sent if this email is registered.');
        this.resetLoading.set(false);
      },
      error: error => {
        this.resetMessage.set(error.message || 'Could not send a password reset email.');
        this.resetLoading.set(false);
      }
    });
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
        const detail = err.message || 'Invalid email or password. Please try again.';
        this.errorMessage.set(detail);
        this.toast.error(detail);
      }
    });
  }
}
