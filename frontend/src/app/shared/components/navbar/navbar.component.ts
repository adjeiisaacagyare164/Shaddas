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
      <div class="announcement-bar">
        <div class="container announcement-content">
          <span>Order directly on WhatsApp | Fast delivery across Ghana</span>
          <div class="top-contact">
            <a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank" class="top-wa-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.5 2.16.987 3.202.987 3.161 0 5.739-2.276 5.739-5.486.001-3.123-2.465-5.531-5.546-5.531zm.84 9.866c-.387.331-1.156.442-2.084.442-1.138 0-2.355-.359-3.378-1.027l-.239-.142-1.467.385.38-1.434-.153-.268c-.787-1.318-1.018-2.684-.508-3.907.54-1.305 1.76-2.119 3.17-2.436.879-.194 1.847-.119 2.708.22 1.11.438 1.831 1.174 2.228 2.072.419.949.39 2.02-.085 3.056-.557 1.217-1.688 2.043-2.9 2.387zm5.035-4.423c-.26-.111-.982-.455-1.823-.759-.84-.304-1.182-.39-1.296-.39-.566 0-1.319.242-2.165.662l-.053.028-.111.061c-.393.214-.923.504-1.496.798-.62.319-.777.38-1.062.382-.771.004-1.427-.397-1.843-.863a2.876 2.876 0 0 1-.022-3.249c.364-.55.86-1.062 1.498-1.537.426-.318.844-.419 1.259-.276.367.129.821.341.917.362.197.042.332.167.527.436.62.857.681 1.122.704 1.229.036.171.038.578-.07 1.057-.201.889-.775 1.241-1.759 1.403-.388.064-.784.13-1.144.202-.329.066-.554.308-.735.71-.177.39-.173.921.335 1.528.435.518 1.001.868 1.596.972.923.159 1.888-.067 2.834-.658.482-.301 1.013-.703 1.649-1.414.537-.601.849-.987 1.061-1.478.11-.255.181-.477.178-.633-.002-.141-.04-.262-.099-.343z"></path></svg>
              <span>{{ shopService.shopInfo().whatsapp_number }}</span>
            </a>
          </div>
        </div>
      </div>

      <nav class="main-nav">
        <div class="container nav-container">
          <button type="button" class="mobile-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle menu">
            <svg *ngIf="!mobileMenuOpen()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg *ngIf="mobileMenuOpen()" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <a routerLink="/" class="brand-logo" (click)="closeMobileMenu()">
            <svg class="brand-svg" viewBox="0 0 146 120" aria-hidden="true">
              <path d="M36 24 L72 0 L110 24 L110 66 L85 90 L36 90 L10 66 L10 44 Z" fill="none" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
              <path d="M39 32 L75 10 L96 22 L96 65 L75 81 L38 81 L20 66 L20 49 L39 32 Z" fill="#ef4444" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
              <path d="M44 33 L88 33 L88 74 L54 74 L44 92 Z" fill="#ffffff" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
              <path d="M54 39 L84 39 L84 72 L59 72 L54 80 Z" fill="#ffffff"/>
              <path d="M50 71 L94 25" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
              <path d="M58 82 L86 54" stroke="#18181b" stroke-width="12" stroke-linecap="round"/>
              <path d="M34 34 L20 44" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
              <path d="M39 65 L33 88" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
            </svg>
            <div class="logo-text-group">
              <span class="brand-title">SHADDAS</span>
              <span class="brand-tagline">INCORPORATED</span>
            </div>
          </a>

          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/shop" routerLinkActive="active">Shop</a>
            <a routerLink="/shop" [queryParams]="{view: 'categories'}">Categories</a>
            <a href="/#about-section">About</a>
          </div>

          <div class="nav-search">
            <form (submit)="onSearch($event)">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" [(ngModel)]="searchQuery" name="searchQuery" placeholder="Search products..." class="search-input">
              </div>
            </form>
          </div>

          <div class="nav-actions">
            <button type="button" class="action-btn" (click)="themeService.toggleTheme()" [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <svg *ngIf="themeService.currentTheme() === 'dark'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <svg *ngIf="themeService.currentTheme() === 'light'" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
            </button>

            <a routerLink="/cart" class="action-btn cart-btn" title="View Order Cart" (click)="closeMobileMenu()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 1.95L8.5 15H18l2-8H6.35"/></svg>
              <span class="cart-badge" *ngIf="cartService.totalItemsCount() > 0">{{ cartService.totalItemsCount() }}</span>
            </a>

            <a [routerLink]="authService.isAuthenticated() ? '/owner/dashboard' : '/owner/login'" class="btn btn-outline-red btn-sm owner-btn" (click)="closeMobileMenu()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{{ authService.isAuthenticated() ? 'Dashboard' : 'Owner Login' }}</span>
            </a>
          </div>
        </div>

        <div class="mobile-drawer" *ngIf="mobileMenuOpen()">
          <div class="mobile-search-wrapper">
            <form (submit)="onSearch($event)">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" [(ngModel)]="searchQuery" name="mobileSearch" placeholder="Search products..." class="search-input">
              </div>
            </form>
          </div>

          <div class="mobile-nav-links">
            <a routerLink="/" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/shop" (click)="closeMobileMenu()">Shop All Products</a>
            <a routerLink="/shop" [queryParams]="{view: 'categories'}" (click)="closeMobileMenu()">Categories</a>
            <a href="/#about-section" (click)="closeMobileMenu()">About Us</a>
            <a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank" class="mobile-wa-cta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.5 2.16.987 3.202.987 3.161 0 5.739-2.276 5.739-5.486.001-3.123-2.465-5.531-5.546-5.531zm.84 9.866c-.387.331-1.156.442-2.084.442-1.138 0-2.355-.359-3.378-1.027l-.239-.142-1.467.385.38-1.434-.153-.268c-.787-1.318-1.018-2.684-.508-3.907.54-1.305 1.76-2.119 3.17-2.436.879-.194 1.847-.119 2.708.22 1.11.438 1.831 1.174 2.228 2.072.419.949.39 2.02-.085 3.056-.557 1.217-1.688 2.043-2.9 2.387zm5.035-4.423c-.26-.111-.982-.455-1.823-.759-.84-.304-1.182-.39-1.296-.39-.566 0-1.319.242-2.165.662l-.053.028-.111.061c-.393.214-.923.504-1.496.798-.62.319-.777.38-1.062.382-.771.004-1.427-.397-1.843-.863a2.876 2.876 0 0 1-.022-3.249c.364-.55.86-1.062 1.498-1.537.426-.318.844-.419 1.259-.276.367.129.821.341.917.362.197.042.332.167.527.436.62.857.681 1.122.704 1.229.036.171.038.578-.07 1.057-.201.889-.775 1.241-1.759 1.403-.388.064-.784.13-1.144.202-.329.066-.554.308-.735.71-.177.39-.173.921.335 1.528.435.518 1.001.868 1.596.972.923.159 1.888-.067 2.834-.658.482-.301 1.013-.703 1.649-1.414.537-.601.849-.987 1.061-1.478.11-.255.181-.477.178-.633-.002-.141-.04-.262-.099-.343z"></path></svg>
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
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(17, 24, 39, 0.08);
      transition: all var(--transition-normal);
    }
    .announcement-bar {
      background: linear-gradient(90deg, #111827 0%, #1f2937 40%, #111827 100%);
      color: #fff;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-weight: 700;
      padding: 0.4rem 0;
    }
    .announcement-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .top-wa-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      color: #fff;
      opacity: 0.92;
    }
    .top-wa-link:hover { opacity: 1; text-decoration: underline; }

    .main-nav {
      position: relative;
      background: rgba(255, 255, 255, 0.9);
    }
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 4.85rem;
      gap: 1.5rem;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      user-select: none;
      min-width: 0;
    }
    .brand-svg {
      width: 4.4rem;
      height: 3.5rem;
      flex-shrink: 0;
      filter: drop-shadow(0 0.25rem 0.45rem rgba(17, 24, 39, 0.08));
    }
    .logo-text-group {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: clamp(1.2rem, 2vw, 2.2rem);
      font-weight: 900;
      letter-spacing: -0.06em;
      color: #111827;
    }
    .brand-tagline {
      font-size: 0.62rem;
      letter-spacing: 0.32em;
      font-weight: 800;
      color: var(--brand-red);
      margin-top: 0.2rem;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.75rem;
    }
    .nav-links a {
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: #4b5563;
      position: relative;
      padding: 0.35rem 0;
      text-transform: uppercase;
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--brand-red);
    }
    .nav-links a.active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -0.45rem;
      height: 2px;
      background: var(--brand-red);
      border-radius: 999px;
    }
    .nav-search {
      flex: 1;
      max-width: 300px;
    }
    .search-input-wrapper { position: relative; display: flex; align-items: center; }
    .search-icon {
      position: absolute;
      left: 0.9rem;
      color: var(--text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.7rem 0.9rem 0.7rem 2.5rem;
      background: #f8f8f8;
      border: 1px solid rgba(17, 24, 39, 0.08);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      transition: all var(--transition-fast);
      color: #111827;
    }
    .search-input:focus {
      outline: none;
      border-color: rgba(185, 28, 28, 0.5);
      box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.1);
      background: white;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .action-btn {
      position: relative;
      width: 2.6rem;
      height: 2.6rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      color: #111827;
      background: #f6f6f6;
      border: 1px solid rgba(17, 24, 39, 0.08);
      transition: all var(--transition-fast);
    }
    .action-btn:hover {
      background: #f1f1f1;
      color: var(--brand-red);
      border-color: rgba(185, 28, 28, 0.2);
    }
    .cart-badge {
      position: absolute;
      top: -0.25rem;
      right: -0.25rem;
      background: var(--brand-red);
      color: #fff;
      font-size: 0.68rem;
      font-weight: 800;
      min-width: 1.1rem;
      height: 1.1rem;
      padding: 0 0.25rem;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mobile-toggle-btn { display: none; padding: 0.5rem; color: #111827; }
    .mobile-drawer { display: none; }

    @media (max-width: 900px) {
      .nav-links, .nav-search, .owner-btn { display: none; }
      .mobile-toggle-btn { display: flex; }
      .mobile-drawer {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.25rem 1.5rem;
        border-top: 1px solid rgba(17, 24, 39, 0.08);
        background: rgba(255,255,255,0.98);
        gap: 1rem;
        animation: fadeIn 0.25s ease-out;
      }
      .mobile-nav-links { display: flex; flex-direction: column; gap: 0.8rem; }
      .mobile-nav-links a {
        font-size: 1rem;
        font-weight: 700;
        padding: 0.55rem 0;
        border-bottom: 1px solid rgba(17, 24, 39, 0.08);
      }
      .mobile-wa-cta { color: #128C7E !important; font-weight: 800 !important; }
      .mobile-owner-link { color: var(--brand-red) !important; }
      .top-contact { display: none; }
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
      this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery.trim() } });
      this.closeMobileMenu();
    }
  }
}
