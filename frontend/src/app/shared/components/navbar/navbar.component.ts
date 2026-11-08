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
          <span>Curated style, delivered across Ghana</span>
          <a class="top-wa-link" [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" aria-label="Contact Shaddas on WhatsApp">
            <span class="announcement-dot"></span> Order directly on WhatsApp
          </a>
        </div>
      </div>

      <nav class="main-nav" aria-label="Main navigation">
        <div class="container nav-container">
          <button type="button" class="mobile-toggle-btn" (click)="toggleMobileMenu()" [attr.aria-expanded]="mobileMenuOpen()" aria-label="Toggle navigation menu">
            <svg *ngIf="!mobileMenuOpen()" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
            <svg *ngIf="mobileMenuOpen()" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 6 12 12M18 6 6 18"/></svg>
          </button>

          <a routerLink="/" class="brand-logo" (click)="closeMobileMenu()" aria-label="Shaddas home">
            <img class="brand-logo-image" src="/shaddas-logo.svg" alt="Shaddas Incorporated">
          </a>

          <div class="nav-links">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/shop" routerLinkActive="active">Shop</a>
            <a routerLink="/shop" [queryParams]="{view: 'categories'}">Categories</a>
            <a href="/#about-section">About</a>
          </div>

          <div class="nav-search">
            <form (submit)="onSearch($event)" role="search">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7.5"/><path d="m16.5 16.5 4 4"/></svg>
                <input type="search" [(ngModel)]="searchQuery" name="searchQuery" placeholder="Search the collection" class="search-input" aria-label="Search products">
              </div>
            </form>
          </div>

          <div class="nav-actions">
            <button type="button" class="action-btn theme-button" (click)="themeService.toggleTheme()" [attr.aria-label]="themeService.currentTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'" [title]="themeService.currentTheme() === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <svg *ngIf="themeService.currentTheme() === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
              <svg *ngIf="themeService.currentTheme() === 'light'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.6 8.6 0 1 0 20.5 15.2Z"/></svg>
            </button>
            <a routerLink="/cart" class="action-btn cart-btn" aria-label="View order cart" (click)="closeMobileMenu()">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M3 3h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
              <span class="cart-badge" *ngIf="cartService.totalItemsCount() > 0">{{ cartService.totalItemsCount() }}</span>
            </a>
            <a [routerLink]="authService.isAuthenticated() ? '/owner/dashboard' : '/owner/login'" class="btn btn-outline-red btn-sm owner-btn" (click)="closeMobileMenu()">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>{{ authService.isAuthenticated() ? 'Dashboard' : 'Owner Login' }}</span>
            </a>
          </div>
        </div>

        <div class="mobile-drawer" *ngIf="mobileMenuOpen()">
          <div class="mobile-search-wrapper">
            <form (submit)="onSearch($event)" role="search">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="11" cy="11" r="7.5"/><path d="m16.5 16.5 4 4"/></svg>
                <input type="search" [(ngModel)]="searchQuery" name="mobileSearch" placeholder="Search the collection" class="search-input" aria-label="Search products">
              </div>
            </form>
          </div>
          <div class="mobile-nav-links">
            <a routerLink="/" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/shop" (click)="closeMobileMenu()">Shop all products</a>
            <a routerLink="/shop" [queryParams]="{view: 'categories'}" (click)="closeMobileMenu()">Categories</a>
            <a href="/#about-section" (click)="closeMobileMenu()">About Shaddas</a>
            <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" class="mobile-wa-cta" (click)="closeMobileMenu()">Chat with us on WhatsApp</a>
            <a [routerLink]="authService.isAuthenticated() ? '/owner/dashboard' : '/owner/login'" (click)="closeMobileMenu()" class="mobile-owner-link">{{ authService.isAuthenticated() ? 'Owner dashboard' : 'Owner sign in' }}</a>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .navbar-sticky { position: sticky; top: 0; z-index: 1000; background: var(--bg-surface); border-bottom: 1px solid var(--border-subtle); box-shadow: 0 4px 20px rgba(24,24,27,.035); }
    .announcement-bar { background: #191719; color: #fff; font-size: .7rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; padding: .42rem 0; }
    .announcement-content { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .top-wa-link { display:inline-flex; align-items:center; gap:.45rem; color:#fff; opacity:.9; }
    .top-wa-link:hover { opacity:1; }
    .announcement-dot { width:7px; height:7px; border-radius:50%; background:#40b978; }
    .nav-container { display:flex; align-items:center; justify-content:space-between; height:5rem; gap:1.15rem; }
    .brand-logo { display:flex; align-items:center; flex:0 0 auto; }
    .brand-logo-image { width: min(220px, 20vw); height: 66px; object-fit:contain; object-position:left center; }
    .nav-links { display:flex; align-items:center; gap:clamp(1rem, 2vw, 1.8rem); }
    .nav-links a { font-size:.78rem; font-weight:800; letter-spacing:.08em; color:var(--text-secondary); position:relative; padding:.45rem 0; text-transform:uppercase; }
    .nav-links a:hover,.nav-links a.active { color:var(--brand-red); }
    .nav-links a.active::after { content:''; position:absolute; left:0; right:0; bottom:-.45rem; height:2px; background:var(--brand-red); }
    .nav-search { flex:1; max-width:280px; min-width:150px; }
    .search-input-wrapper { position:relative; display:flex; align-items:center; }
    .search-icon { position:absolute; left:.9rem; color:var(--text-muted); pointer-events:none; }
    .search-input { width:100%; padding:.68rem .85rem .68rem 2.45rem; background:var(--bg-surface-soft); border:1px solid var(--border-subtle); border-radius:999px; font-size:.83rem; transition:all var(--transition-fast); }
    .search-input:focus { outline:none; border-color:var(--brand-red); background:var(--bg-surface); box-shadow:0 0 0 3px var(--brand-red-glow); }
    .nav-actions { display:flex; align-items:center; gap:.55rem; }
    .action-btn { position:relative; width:2.55rem; height:2.55rem; display:flex; align-items:center; justify-content:center; border-radius:50%; color:var(--text-primary); background:var(--bg-surface-soft); border:1px solid var(--border-subtle); transition:all var(--transition-fast); }
    .action-btn:hover { color:var(--brand-red); border-color:var(--border-strong); background:var(--bg-surface-hover); }
    .cart-badge { position:absolute; top:-.28rem; right:-.28rem; background:var(--brand-red); color:#fff; font-size:.65rem; font-weight:800; min-width:1.1rem; height:1.1rem; padding:0 .2rem; border-radius:999px; display:flex; align-items:center; justify-content:center; }
    .mobile-toggle-btn,.mobile-drawer { display:none; }
    @media (max-width: 1050px) {
      .nav-links,.nav-search,.owner-btn { display:none; }
      .mobile-toggle-btn { display:flex; align-items:center; justify-content:center; padding:.5rem; color:var(--text-primary); }
      .brand-logo-image { width:200px; height:62px; }
      .mobile-drawer { display:flex; flex-direction:column; padding:1rem 1.25rem 1.35rem; border-top:1px solid var(--border-subtle); background:var(--bg-surface); gap:1rem; animation:fadeIn .2s ease-out; }
      .mobile-nav-links { display:flex; flex-direction:column; gap:.2rem; }
      .mobile-nav-links a { font-size:.95rem; font-weight:700; padding:.65rem 0; border-bottom:1px solid var(--border-subtle); }
      .mobile-nav-links .mobile-wa-cta { color:var(--whatsapp-green); }
      .mobile-nav-links .mobile-owner-link { color:var(--brand-red); }
      .top-wa-link { display:none; }
    }
    @media (max-width: 480px) {
      .nav-container { height:4.35rem; gap:.25rem; }
      .brand-logo-image { width:164px; height:56px; }
      .nav-actions { gap:.35rem; }
      .action-btn { width:2.35rem; height:2.35rem; }
      .announcement-bar { font-size:.62rem; letter-spacing:.035em; }
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
  get whatsappUrl(): string {
    return 'https://wa.me/' + this.cartService.sanitizeWhatsAppNumber(this.shopService.shopInfo().whatsapp_number);
  }

  toggleMobileMenu(): void { this.mobileMenuOpen.update(value => !value); }
  closeMobileMenu(): void { this.mobileMenuOpen.set(false); }
  onSearch(event: Event): void {
    event.preventDefault();
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery.trim() } });
    this.closeMobileMenu();
  }
}
