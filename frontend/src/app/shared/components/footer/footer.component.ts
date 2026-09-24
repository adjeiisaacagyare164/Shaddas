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
      <!-- WhatsApp CTA Banner Section -->
      <section class="footer-cta-banner">
        <div class="container cta-container">
          <div class="cta-text">
            <span class="badge badge-red">Direct Concierge</span>
            <h2 class="cta-title">Need help choosing or custom inquiries?</h2>
            <p class="cta-desc">Chat directly with the shop owner on WhatsApp for quick responses, product advice, and delivery coordination.</p>
          </div>
          <div class="cta-button-group">
            <a 
              [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" 
              target="_blank" 
              class="btn btn-whatsapp btn-lg"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Main Footer Columns -->
      <div class="footer-main">
        <div class="container footer-grid">
          
          <!-- Column 1: Brand -->
          <div class="footer-col brand-col">
            <a routerLink="/" class="footer-logo">
              <div class="logo-mark">S</div>
              <span class="brand-title">{{ shopService.shopInfo().name }}</span>
            </a>
            <p class="brand-intro">
              {{ shopService.shopInfo().description }}
            </p>
            <div class="currency-badge">
              <span class="currency-flag">🇬🇭</span>
              <span>All prices listed in Ghana Cedis (GH₵)</span>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-col">
            <h4 class="col-heading">Explore</h4>
            <ul class="footer-nav">
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/shop">All Products</a></li>
              <li><a routerLink="/shop" [queryParams]="{view: 'categories'}">Browse Categories</a></li>
              <li><a routerLink="/cart">Your Order Cart</a></li>
            </ul>
          </div>

          <!-- Column 3: Contact Details -->
          <div class="footer-col">
            <h4 class="col-heading">Store Contact</h4>
            <ul class="contact-list">
              <li>
                <span class="icon">📍</span>
                <span>{{ shopService.shopInfo().location }}</span>
              </li>
              <li>
                <span class="icon">📱</span>
                <a [href]="'tel:' + shopService.shopInfo().phone">{{ shopService.shopInfo().phone }}</a>
              </li>
              <li>
                <span class="icon">✉️</span>
                <a [href]="'mailto:' + shopService.shopInfo().email">{{ shopService.shopInfo().email }}</a>
              </li>
              <li>
                <span class="icon">💬</span>
                <a [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" target="_blank">
                  {{ shopService.shopInfo().whatsapp_number }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Shop Owner Portal -->
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

      <!-- Footer Bottom -->
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
      background-color: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      margin-top: 5rem;
    }
    .footer-cta-banner {
      background: linear-gradient(135deg, var(--bg-surface-soft) 0%, var(--bg-surface-elevated) 100%);
      border-bottom: 1px solid var(--border-subtle);
      padding: 3.5rem 0;
    }
    .cta-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    .cta-title {
      font-size: 1.75rem;
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
    .logo-mark {
      width: 2.25rem;
      height: 2.25rem;
      background: linear-gradient(135deg, var(--color-primary-700) 0%, var(--color-primary-900) 100%);
      color: #FFFFFF;
      font-family: var(--font-heading);
      font-weight: 800;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-sm);
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: 0.05em;
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
      background: var(--bg-surface-soft);
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-secondary);
      border: 1px solid var(--border-subtle);
    }
    .col-heading {
      font-size: 1.0625rem;
      margin-bottom: 1.25rem;
      color: var(--text-primary);
    }
    .footer-nav, .contact-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .footer-nav a {
      font-size: 0.9375rem;
      color: var(--text-secondary);
    }
    .footer-nav a:hover {
      color: var(--brand-red);
      padding-left: 4px;
    }
    .contact-list li {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      font-size: 0.9375rem;
      color: var(--text-secondary);
    }
    .contact-list a:hover {
      color: var(--brand-red);
    }
    .admin-desc {
      font-size: 0.875rem;
      margin-bottom: 1rem;
      line-height: 1.5;
    }
    .admin-link-btn {
      width: 100%;
      justify-content: flex-start;
    }
    .footer-bottom {
      border-top: 1px solid var(--border-subtle);
      padding: 1.75rem 0;
      font-size: 0.875rem;
      color: var(--text-muted);
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
    }

    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2.5rem;
      }
      .cta-container {
        flex-direction: column;
        text-align: center;
      }
      .cta-desc {
        margin: 0 auto;
      }
    }
    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .bottom-content {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  shopService = inject(ShopService);
  cartService = inject(CartService);
  currentYear = new Date().getFullYear();
}
