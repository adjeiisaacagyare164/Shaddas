import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="site-footer">
      <section class="footer-cta-banner">
        <div class="container cta-container">
          <div class="cta-text">
            <span class="badge badge-red">Direct Concierge</span>
            <h2 class="cta-title">Need help choosing or custom inquiries?</h2>
            <p class="cta-desc">Chat directly with the shop owner on WhatsApp for quick responses, product advice, and delivery coordination.</p>
          </div>
          <div class="cta-button-group">
            <a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank" class="btn btn-whatsapp btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.5 2.16.987 3.202.987 3.161 0 5.739-2.276 5.739-5.486.001-3.123-2.465-5.531-5.546-5.531zm.84 9.866c-.387.331-1.156.442-2.084.442-1.138 0-2.355-.359-3.378-1.027l-.239-.142-1.467.385.38-1.434-.153-.268c-.787-1.318-1.018-2.684-.508-3.907.54-1.305 1.76-2.119 3.17-2.436.879-.194 1.847-.119 2.708.22 1.11.438 1.831 1.174 2.228 2.072.419.949.39 2.02-.085 3.056-.557 1.217-1.688 2.043-2.9 2.387zm5.035-4.423c-.26-.111-.982-.455-1.823-.759-.84-.304-1.182-.39-1.296-.39-.566 0-1.319.242-2.165.662l-.053.028-.111.061c-.393.214-.923.504-1.496.798-.62.319-.777.38-1.062.382-.771.004-1.427-.397-1.843-.863a2.876 2.876 0 0 1-.022-3.249c.364-.55.86-1.062 1.498-1.537.426-.318.844-.419 1.259-.276.367.129.821.341.917.362.197.042.332.167.527.436.62.857.681 1.122.704 1.229.036.171.038.578-.07 1.057-.201.889-.775 1.241-1.759 1.403-.388.064-.784.13-1.144.202-.329.066-.554.308-.735.71-.177.39-.173.921.335 1.528.435.518 1.001.868 1.596.972.923.159 1.888-.067 2.834-.658.482-.301 1.013-.703 1.649-1.414.537-.601.849-.987 1.061-1.478.11-.255.181-.477.178-.633-.002-.141-.04-.262-.099-.343z"></path></svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <div class="footer-main">
        <div class="container footer-grid">
          <div class="footer-col brand-col">
            <a routerLink="/" class="footer-logo">
              <svg class="footer-brand-svg" viewBox="0 0 146 120" aria-hidden="true">
                <path d="M36 24 L72 0 L110 24 L110 66 L85 90 L36 90 L10 66 L10 44 Z" fill="none" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
                <path d="M39 32 L75 10 L96 22 L96 65 L75 81 L38 81 L20 66 L20 49 L39 32 Z" fill="#ef4444" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
                <path d="M44 33 L88 33 L88 74 L54 74 L44 92 Z" fill="#ffffff" stroke="#18181b" stroke-width="12" stroke-linejoin="round"/>
                <path d="M54 39 L84 39 L84 72 L59 72 L54 80 Z" fill="#ffffff"/>
                <path d="M50 71 L94 25" stroke="#18181b" stroke-width="10" stroke-linecap="round"/>
                <path d="M58 82 L86 54" stroke="#18181b" stroke-width="12" stroke-linecap="round"/>
              </svg>
              <span class="brand-title">SHADDAS</span>
            </a>
            <p class="brand-intro">{{ shopService.shopInfo().description }}</p>
            <div class="currency-badge">
              <span class="currency-flag">🇬🇭</span>
              <span>All prices listed in Ghana Cedis (GH₵)</span>
            </div>
          </div>

          <div class="footer-col">
            <h4 class="col-heading">Explore</h4>
            <ul class="footer-nav">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/shop">All Products</a></li>
              <li><a routerLink="/shop" [queryParams]="{view: 'categories'}">Browse Categories</a></li>
              <li><a routerLink="/cart">Your Order Cart</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="col-heading">Store Contact</h4>
            <ul class="contact-list">
              <li><span class="icon">📍</span><span>{{ shopService.shopInfo().location }}</span></li>
              <li><span class="icon">📱</span><a [href]="'tel:' + shopService.shopInfo().phone">{{ shopService.shopInfo().phone }}</a></li>
              <li><span class="icon">✉️</span><a [href]="'mailto:' + shopService.shopInfo().email">{{ shopService.shopInfo().email }}</a></li>
              <li><span class="icon">💬</span><a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank">{{ shopService.shopInfo().whatsapp_number }}</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="col-heading">Shop Administration</h4>
            <p class="admin-desc">Owner portal for inventory, categories, shop details, and homepage management.</p>
            <a routerLink="/owner/login" class="btn btn-secondary btn-sm admin-link-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Owner Dashboard Login</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-content">
          <p>© {{ currentYear }} {{ shopService.shopInfo().name }}. All rights reserved.</p>
          <div class="bottom-badges">
            <span class="badge badge-cream">WhatsApp Direct Order System</span>
            <span class="badge badge-cream">Accra, Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      background: linear-gradient(180deg, #fff 0%, #f7f4f2 100%);
      border-top: 1px solid rgba(17, 24, 39, 0.08);
      margin-top: 5rem;
    }
    .footer-cta-banner {
      background: linear-gradient(135deg, #f9f3f1 0%, #fff 100%);
      border-bottom: 1px solid rgba(17, 24, 39, 0.08);
      padding: 3.5rem 0;
    }
    .cta-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    .cta-title {
      font-size: clamp(1.6rem, 2vw, 2.3rem);
      margin: 0.75rem 0 0.5rem;
    }
    .cta-desc {
      max-width: 580px;
      font-size: 1rem;
    }
    .footer-main {
      padding: 4.5rem 0 3.5rem;
    }
    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
      gap: 3rem;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .footer-brand-svg {
      width: 4rem;
      height: 3.2rem;
      flex-shrink: 0;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 900;
      letter-spacing: -0.05em;
      color: #111827;
    }
    .brand-intro {
      font-size: 0.9375rem;
      line-height: 1.6;
      margin-bottom: 1.25rem;
      max-width: 320px;
    }
    .currency-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #f5f5f5;
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #374151;
      border: 1px solid rgba(17, 24, 39, 0.08);
    }
    .col-heading {
      font-size: 1.0625rem;
      margin-bottom: 1.25rem;
      color: #111827;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .footer-nav, .contact-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    .footer-nav a, .contact-list a {
      font-size: 0.9375rem;
      color: #4b5563;
    }
    .footer-nav a:hover, .contact-list a:hover {
      color: var(--brand-red);
    }
    .contact-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      font-size: 0.9375rem;
      color: #4b5563;
    }
    .admin-desc {
      font-size: 0.875rem;
      margin-bottom: 1rem;
      line-height: 1.5;
      color: #4b5563;
    }
    .admin-link-btn {
      width: 100%;
      justify-content: flex-start;
    }
    .footer-bottom {
      border-top: 1px solid rgba(17, 24, 39, 0.08);
      padding: 1.75rem 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
    .bottom-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .bottom-badges {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    @media (max-width: 992px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
      .cta-container { flex-direction: column; text-align: center; }
      .cta-desc { margin: 0 auto; }
    }
    @media (max-width: 600px) {
      .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
      .bottom-content { flex-direction: column; text-align: center; }
    }
  `]
})
export class FooterComponent {
  shopService = inject(ShopService);
  cartService = inject(CartService);
  currentYear = new Date().getFullYear();
}
