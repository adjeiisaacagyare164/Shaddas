import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ShopService } from '../../../core/services/shop.service';
import { ThemeService } from '../../../core/services/theme.service';
import { ToastComponent } from '../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-owner-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  template: `
    <div class="owner-app-container">
      
      <!-- MOBILE TOP BAR -->
      <header class="owner-mobile-header">
        <button type="button" class="mobile-menu-btn" (click)="toggleSidebar()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div class="mobile-brand">
          <div class="logo-mark xs">S</div>
          <span class="brand-name">{{ shopService.shopInfo().name }} Owner</span>
        </div>

        <button type="button" class="theme-btn-sm" (click)="themeService.toggleTheme()">
          <svg *ngIf="themeService.currentTheme() === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg *ngIf="themeService.currentTheme() === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
      </header>

      <!-- SIDEBAR (Collapsible & Mobile Drawer) -->
      <aside class="owner-sidebar" [class.open]="sidebarOpen()">
        
        <!-- Sidebar Brand -->
        <div class="sidebar-header">
          <a routerLink="/owner/dashboard" class="sidebar-brand">
            <div class="logo-mark sm">S</div>
            <div class="brand-details">
              <span class="brand-title">{{ shopService.shopInfo().name }}</span>
              <span class="badge-role">Owner Dashboard</span>
            </div>
          </a>
          <button type="button" class="sidebar-close-btn" (click)="closeSidebar()">✕</button>
        </div>

        <!-- Navigation Links -->
        <nav class="sidebar-nav">
          <a 
            routerLink="/owner/dashboard" 
            routerLinkActive="active" 
            [routerLinkActiveOptions]="{exact: true}"
            (click)="closeSidebar()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </a>

          <a 
            routerLink="/owner/products" 
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Products</span>
          </a>

          <a 
            routerLink="/owner/categories" 
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>Categories</span>
          </a>

          <a 
            routerLink="/owner/website" 
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            <span>Website CMS</span>
          </a>

          <a 
            routerLink="/owner/settings" 
            routerLinkActive="active"
            (click)="closeSidebar()"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Shop Settings</span>
          </a>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer">
          <a routerLink="/" target="_blank" class="view-store-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>View Public Store</span>
          </a>

          <button type="button" class="logout-btn" (click)="onLogout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      <!-- MAIN OWNER WORKSPACE -->
      <div class="owner-workspace">
        
        <!-- Desktop Header Bar -->
        <header class="owner-top-bar">
          <div class="top-bar-left">
            <span class="store-badge">
              <span class="live-indicator"></span>
              Live Store: <strong>{{ shopService.shopInfo().name }}</strong>
            </span>
            <span class="wa-badge">
              💬 WhatsApp: {{ shopService.shopInfo().whatsapp_number }}
            </span>
          </div>

          <div class="top-bar-right">
            <!-- Theme Toggle -->
            <button 
              type="button" 
              class="theme-toggle-btn" 
              (click)="themeService.toggleTheme()"
              title="Toggle Light/Dark Theme"
            >
              <svg *ngIf="themeService.currentTheme() === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg *ngIf="themeService.currentTheme() === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>

            <!-- Store Front Link -->
            <a routerLink="/" target="_blank" class="btn btn-secondary btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Live Website</span>
            </a>

            <!-- User Profile Pill -->
            <div class="user-profile-pill">
              <div class="avatar-circle">
                {{ authService.currentUser()?.name?.charAt(0) || 'O' }}
              </div>
              <div class="user-text">
                <span class="user-name">{{ authService.currentUser()?.name || 'Store Owner' }}</span>
                <span class="user-email">{{ authService.currentUser()?.email || 'owner@shadas.com' }}</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="owner-main-content">
          <router-outlet></router-outlet>
        </main>

      </div>

      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    .owner-app-container {
      display: flex;
      min-height: 100vh;
      background: var(--bg-body);
    }
    .owner-mobile-header {
      display: none;
    }

    /* Sidebar */
    .owner-sidebar {
      width: 260px;
      background: var(--bg-surface);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 100;
      transition: transform 0.3s ease;
    }
    .sidebar-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .logo-mark.sm {
      width: 2.25rem;
      height: 2.25rem;
      font-size: 1.15rem;
    }
    .brand-details {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.03em;
    }
    .badge-role {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--brand-red);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .sidebar-close-btn {
      display: none;
    }

    /* Sidebar Nav */
    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      overflow-y: auto;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }
    .sidebar-nav a:hover {
      background: var(--bg-surface-soft);
      color: var(--text-primary);
    }
    .sidebar-nav a.active {
      background: var(--brand-red);
      color: #FFFFFF;
      box-shadow: 0 4px 12px var(--brand-red-glow);
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 1.25rem 1rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .view-store-link, .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
      width: 100%;
    }
    .view-store-link:hover {
      background: var(--bg-surface-soft);
      color: var(--brand-red);
    }
    .logout-btn:hover {
      background: var(--danger-bg);
      color: var(--danger);
    }

    /* Owner Workspace */
    .owner-workspace {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .owner-top-bar {
      height: 4.5rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .top-bar-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .store-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      background: var(--bg-surface-soft);
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      border: 1px solid var(--border-subtle);
    }
    .live-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 0 2px var(--success-bg);
    }
    .wa-badge {
      font-size: 0.8125rem;
      color: #128C7E;
      font-weight: 600;
    }
    .top-bar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .theme-toggle-btn {
      width: 2.25rem;
      height: 2.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      background: var(--bg-surface-soft);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
    }
    .theme-toggle-btn:hover {
      background: var(--bg-surface-hover);
      color: var(--brand-red);
    }
    .user-profile-pill {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.35rem 0.75rem 0.35rem 0.35rem;
      background: var(--bg-surface-soft);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
    }
    .avatar-circle {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--brand-red);
      color: #fff;
      font-weight: 700;
      font-size: 0.8125rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .user-text {
      display: flex;
      flex-direction: column;
      line-height: 1.1;
    }
    .user-name {
      font-size: 0.8125rem;
      font-weight: 700;
    }
    .user-email {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .owner-main-content {
      flex: 1;
      padding: 2.5rem;
    }

    @media (max-width: 992px) {
      .owner-app-container {
        flex-direction: column;
      }
      .owner-mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 4rem;
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border-subtle);
        padding: 0 1.25rem;
        position: sticky;
        top: 0;
        z-index: 99;
      }
      .mobile-brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .brand-name {
        font-family: var(--font-heading);
        font-weight: 700;
      }
      .logo-mark.xs {
        width: 1.75rem;
        height: 1.75rem;
        font-size: 0.875rem;
      }
      .owner-sidebar {
        position: fixed;
        inset: 0 auto 0 0;
        transform: translateX(-100%);
        box-shadow: var(--shadow-xl);
      }
      .owner-sidebar.open {
        transform: translateX(0);
      }
      .sidebar-close-btn {
        display: block;
        font-size: 1.25rem;
        padding: 0.25rem;
      }
      .owner-top-bar {
        display: none;
      }
      .owner-main-content {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class OwnerLayoutComponent {
  authService = inject(AuthService);
  shopService = inject(ShopService);
  themeService = inject(ThemeService);

  sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
