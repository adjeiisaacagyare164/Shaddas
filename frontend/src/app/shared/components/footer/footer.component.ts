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
            <a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.57 15.15L2 22l5-1.31A10 10 0 1 0 12 2zm0 18.2a8.17 8.17 0 0 1-4.17-1.14l-.3-.18-2.97.78.79-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.15c-.24-.12-1.4-.7-1.62-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.18 1.1.15 1.52.09.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28z"/></svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <div class="footer-main">
        <div class="container footer-grid">
          <div class="footer-col brand-col">
            <a routerLink="/" class="footer-logo" aria-label="Shaddas home">
              <img src="/shaddas-logo.svg" alt="Shaddas Incorporated" class="footer-brand-image">
            </a>
            <p class="brand-intro">{{ shopService.shopInfo().description }}</p>
            <div class="currency-badge"><span>🇬🇭</span><span>All prices in Ghana Cedis (GH₵)</span></div>
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
              <li><span>📍</span><span>{{ shopService.shopInfo().location }}</span></li>
              <li><span>📱</span><a [href]="'tel:' + shopService.shopInfo().phone">{{ shopService.shopInfo().phone }}</a></li>
              <li><span>✉️</span><a [href]="'mailto:' + shopService.shopInfo().email">{{ shopService.shopInfo().email }}</a></li>
              <li><span>💬</span><a [href]="whatsappUrl" target="_blank" rel="noopener noreferrer">{{ shopService.shopInfo().whatsapp_number }}</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4 class="col-heading">Shop Administration</h4>
            <p class="admin-desc">Owner portal for inventory, categories, shop details, and homepage management.</p>
            <a routerLink="/owner/login" class="btn btn-secondary btn-sm admin-link-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Owner Dashboard Login</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-content">
          <p>© {{ currentYear }} {{ shopService.shopInfo().name }}. All rights reserved.</p>
          <div class="bottom-badges"><span class="badge badge-cream">WhatsApp Direct Order</span><span class="badge badge-cream">Accra, Ghana</span></div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer { background:var(--bg-surface); border-top:1px solid var(--border-subtle); margin-top:3rem; }
    .footer-cta-banner { background:var(--bg-surface-soft); border-bottom:1px solid var(--border-subtle); padding:clamp(2rem,5vw,3.5rem) 0; }
    .cta-container { display:flex; align-items:center; justify-content:space-between; gap:2rem; }
    .cta-title { font-size:clamp(1.5rem,2.4vw,2.2rem); margin:.75rem 0 .5rem; }
    .cta-desc { max-width:580px; font-size:.95rem; }
    .footer-main { padding:3.75rem 0 3rem; }
    .footer-grid { display:grid; grid-template-columns:2fr 1fr 1.5fr 1.5fr; gap:2.5rem; }
    .footer-logo { display:inline-flex; align-items:center; margin-bottom:1rem; }
    .footer-brand-image { width:220px; max-width:100%; height:76px; object-fit:contain; object-position:left center; }
    .brand-intro { font-size:.9rem; line-height:1.7; margin-bottom:1.1rem; max-width:340px; }
    .currency-badge { display:inline-flex; align-items:center; gap:.5rem; background:var(--bg-surface-soft); padding:.45rem .8rem; border-radius:999px; font-size:.76rem; font-weight:700; color:var(--text-secondary); border:1px solid var(--border-subtle); }
    .col-heading { font-size:.82rem; margin-bottom:1.1rem; color:var(--text-primary); text-transform:uppercase; letter-spacing:.09em; }
    .footer-nav,.contact-list { list-style:none; display:flex; flex-direction:column; gap:.75rem; }
    .footer-nav a,.contact-list a { font-size:.88rem; color:var(--text-secondary); }
    .footer-nav a:hover,.contact-list a:hover { color:var(--brand-red); }
    .contact-list li { display:flex; align-items:flex-start; gap:.65rem; font-size:.88rem; color:var(--text-secondary); }
    .admin-desc { font-size:.86rem; margin-bottom:1rem; line-height:1.6; }
    .admin-link-btn { width:100%; justify-content:flex-start; }
    .footer-bottom { border-top:1px solid var(--border-subtle); padding:1.3rem 0; font-size:.8rem; color:var(--text-muted); }
    .bottom-content { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; }
    .bottom-badges { display:flex; gap:.5rem; flex-wrap:wrap; }
    @media (max-width: 992px) { .footer-grid { grid-template-columns:1fr 1fr; gap:2rem; } .cta-container { flex-direction:column; align-items:flex-start; } }
    @media (max-width: 600px) { .footer-grid { grid-template-columns:1fr 1fr; gap:1.6rem 1rem; } .brand-col { grid-column:1/-1; } .bottom-content { flex-direction:column; text-align:center; } }
  `]
})
export class FooterComponent {
  shopService = inject(ShopService);
  cartService = inject(CartService);
  currentYear = new Date().getFullYear();
  get whatsappUrl(): string { return 'https://wa.me/' + this.cartService.sanitizeWhatsAppNumber(this.shopService.shopInfo().whatsapp_number); }
}
