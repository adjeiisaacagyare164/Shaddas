import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { ShopService } from '../../../core/services/shop.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="navbar-sticky">
      <!-- Top announcement bar -->
      <div class="announcement-bar">
        <div class="container announcement-content">
          <span>Order directly on WhatsApp | Fast delivery across Ghana</span>
          <div class="top-contact">
            <a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank" class="top-wa-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
              <span>{{ shopService.shopInfo().whatsapp_number }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="main-nav">
        <div class="container nav-container">
          
          <!-- Mobile Menu Button -->
          <button 
            type="button" 
            class="mobile-toggle-btn"
            (click)="toggleMobileMenu()"
            aria-label="Toggle menu"
          >
            <svg *ngIf="!mobileMenuOpen()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg *ngIf="mobileMenuOpen()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <!-- Brand Logo -->
          <a routerLink="/" class="brand-logo" (click)="closeMobileMenu()">
            <div class="logo-mark">S</div>
            <div class="logo-text-group">
              <span class="brand-title">{{ shopService.shopInfo().name }}</span>
              <span class="brand-tagline">GHANA</span>
            </div>
          </a>

          <!-- Desktop Navigation Links -->
          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/shop" routerLinkActive="active">Shop</a>
            <a routerLink="/shop" [queryParams]="{view: 'categories'}">Categories</a>
            <a href="/#about-section">About</a>
          </div>

          <!-- Search Bar (Desktop) -->
          <div class="nav-search">
            <form (submit)="onSearch($event)">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  name="searchQuery" 
                  placeholder="Search products..." 
                  class="search-input"
                >
              </div>
            </form>
          </div>

          <!-- Right Action Controls -->
          <div class="nav-actions">
            <!-- Theme Toggle Button -->
            <button 
              type="button" 
              class="action-btn"
              (click)="themeService.toggleTheme()" 
              [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <!-- Sun Icon for Dark mode -->
              <svg *ngIf="themeService.currentTheme() === 'dark'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <!-- Moon Icon for Light mode -->
              <svg *ngIf="themeService.currentTheme() === 'light'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>

            <!-- Order / Cart Icon Button -->
            <a routerLink="/cart" class="action-btn cart-btn" title="View Order Cart" (click)="closeMobileMenu()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <span class="cart-badge" *ngIf="cartService.totalItemsCount() > 0">
                {{ cartService.totalItemsCount() }}
              </span>
            </a>

            <!-- Owner Login / Portal Button -->
            <a 
              [routerLink]="authService.isAuthenticated() ? '/owner/dashboard' : '/owner/login'" 
              class="btn btn-outline-red btn-sm owner-btn"
              (click)="closeMobileMenu()"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{{ authService.isAuthenticated() ? 'Dashboard' : 'Owner Login' }}</span>
            </a>
          </div>
        </div>

        <!-- Mobile Drawer Menu -->
        <div class="mobile-drawer" *ngIf="mobileMenuOpen()">
          <div class="mobile-search-wrapper">
            <form (submit)="onSearch($event)">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery" 
                  name="mobileSearch" 
                  placeholder="Search products..." 
                  class="search-input"
                >
              </div>
            </form>
          </div>

          <div class="mobile-nav-links">
            <a routerLink="/" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/shop" (click)="closeMobileMenu()">Shop All Products</a>
            <a routerLink="/shop" [queryParams]="{view: 'categories'}" (click)="closeMobileMenu()">Categories</a>
            <a href="/#about-section" (click)="closeMobileMenu()">About Us</a>
            <a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank" class="mobile-wa-cta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
              <span>Chat on WhatsApp</span>
            </a>
            <a [routerLink]="authService.isAuthenticated() ? '/owner/dashboard' : '/owner/login'" (click)="closeMobileMenu()" class="mobile-owner-link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{{ authService.isAuthenticated() ? 'Owner Dashboard' : 'Owner Sign In' }}</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .navbar-sticky {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      transition: all var(--transition-normal);
    }
    .announcement-bar {
      background: linear-gradient(90deg, var(--color-primary-900) 0%, var(--color-primary-800) 50%, var(--color-primary-700) 100%);
      color: #FFFDF9;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.35rem 0;
    }
    .announcement-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .top-wa-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #FFFDF9;
      opacity: 0.9;
    }
    .top-wa-link:hover { opacity: 1; text-decoration: underline; }
    
    .main-nav {
      position: relative;
      background: var(--bg-surface);
      backdrop-filter: blur(12px);
    }
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4.5rem;
      gap: 1.5rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      user-select: none;
    }
    .logo-mark {
      width: 2.5rem;
      height: 2.5rem;
      background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%);
      color: #FFFFFF;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.35rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
      box-shadow: 0 4px 10px var(--brand-red-glow);
    }
    .logo-text-group {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: var(--text-primary);
      line-height: 1;
    }
    .brand-tagline {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.2em;
      color: var(--brand-red);
      margin-top: 0.15rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }
    .nav-links a {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-secondary);
      position: relative;
      padding: 0.25rem 0;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--brand-red);
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--brand-red);
      border-radius: 2px;
    }
    .nav-search {
      flex: 1;
      max-width: 280px;
    }
    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .search-icon {
      position: absolute;
      left: 0.85rem;
      color: var(--text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.55rem 0.85rem 0.55rem 2.35rem;
      background: var(--bg-surface-soft);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      transition: all var(--transition-fast);
    }
    .search-input:focus {
      outline: none;
      border-color: var(--border-focus);
      background: var(--bg-surface);
      box-shadow: 0 0 0 3px var(--brand-red-glow);
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .action-btn {
      position: relative;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      color: var(--text-primary);
      background: var(--bg-surface-soft);
      border: 1px solid var(--border-subtle);
      transition: all var(--transition-fast);
    }
    .action-btn:hover {
      background: var(--bg-surface-hover);
      color: var(--brand-red);
      border-color: var(--border-strong);
    }
    .cart-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--brand-red);
      color: #FFFFFF;
      font-size: 0.7rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px var(--brand-red-glow);
    }
    .mobile-toggle-btn {
      display: none;
      padding: 0.5rem;
      color: var(--text-primary);
    }
    .mobile-drawer {
      display: none;
    }

    @media (max-width: 900px) {
      .nav-links, .nav-search, .owner-btn {
        display: none;
      }
      .mobile-toggle-btn {
        display: flex;
      }
      .mobile-drawer {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.5rem 1.5rem;
        border-top: 1px solid var(--border-subtle);
        background: var(--bg-surface);
        gap: 1rem;
        animation: fadeIn 0.25s ease-out;
      }
      .mobile-search-wrapper .search-input {
        border-radius: var(--radius-md);
      }
      .mobile-nav-links {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }
      .mobile-nav-links a {
        font-size: 1rem;
        font-weight: 600;
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--border-subtle);
      }
      .mobile-wa-cta {
        color: #128C7E !important;
        font-weight: 700 !important;
      }
      .mobile-owner-link {
        color: var(--brand-red) !important;
      }
      .top-contact {
        display: none;
      }
    }
  `]
})
export class NavbarComponent {
  cartService = inject(CartService);
  shopService = inject(ShopService);
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = '';
  mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], {
        queryParams: { search: this.searchQuery.trim() }
      });
      this.closeMobileMenu();
    }
  }
}
