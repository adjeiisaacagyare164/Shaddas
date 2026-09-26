import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { WebsiteService } from '../../../core/services/website.service';
import { ShopService } from '../../../core/services/shop.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="home-page animate-fade-in">
      
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-text-content">
            <div class="hero-badge">
              <span class="badge badge-red">
                {{ websiteService.homepageContent().hero_badge || 'Exclusive Collections' }}
              </span>
            </div>

            <h1 class="hero-title">
              {{ websiteService.homepageContent().hero_title }}
            </h1>

            <p class="hero-description">
              {{ websiteService.homepageContent().hero_description }}
            </p>

            <div class="hero-cta-group">
              <a routerLink="/shop" class="btn btn-primary btn-lg">
                <span>{{ websiteService.homepageContent().hero_button_text || 'Shop Now' }}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>

              <a 
                [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" 
                target="_blank" 
                class="btn btn-whatsapp btn-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
                <span>WhatsApp Order</span>
              </a>
            </div>

            <!-- Mini highlights -->
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Verified Quality</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">Fast</span>
                <span class="stat-label">Ghana Delivery</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">Direct</span>
                <span class="stat-label">WhatsApp Chat</span>
              </div>
            </div>
          </div>

          <!-- Hero Image with Luxury Framing -->
          <div class="hero-image-side">
            <div class="hero-image-card">
              <img 
                [src]="websiteService.homepageContent().hero_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'" 
                alt="Shaddas Luxury Storefront"
                class="hero-main-img"
              >
              <div class="floating-badge">
                <div class="badge-icon">🇬🇭</div>
                <div class="badge-info">
                  <strong>Accra, Ghana</strong>
                  <span>Nationwide Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TRUST VALUE PROPS -->
      <section class="trust-bar">
        <div class="container trust-grid">
          <div class="trust-card">
            <div class="trust-icon">💬</div>
            <div>
              <h4>Direct Owner Chat</h4>
              <p>Place orders or ask sizing questions directly on WhatsApp</p>
            </div>
          </div>
          <div class="trust-card">
            <div class="trust-icon">🚚</div>
            <div>
              <h4>Nationwide Delivery</h4>
              <p>Reliable dispatch to Accra, Kumasi, Takoradi & beyond</p>
            </div>
          </div>
          <div class="trust-card">
            <div class="trust-icon">✨</div>
            <div>
              <h4>Premium Selection</h4>
              <p>Hand-curated apparel, bags, sneakers, and accessories</p>
            </div>
          </div>
          <div class="trust-card">
            <div class="trust-icon">🤝</div>
            <div>
              <h4>Easy WhatsApp Checkout</h4>
              <p>No card required online — confirm terms directly with owner</p>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURED CATEGORIES -->
      <section class="section categories-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge badge-cream">Curated Categories</span>
              <h2 class="section-title">Shop by Category</h2>
            </div>
            <a routerLink="/shop" class="view-all-link">
              <span>View All</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>

          <app-loading-spinner *ngIf="loadingCategories()" [size]="36" message="Loading categories..."></app-loading-spinner>

          <div class="categories-grid" *ngIf="!loadingCategories()">
            <a 
              *ngFor="let cat of categories()" 
              [routerLink]="['/shop']" 
              [queryParams]="{category: cat.slug}"
              class="category-card"
            >
              <div class="category-img-wrapper">
                <img [src]="cat.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'" [alt]="cat.name" loading="lazy">
                <div class="category-overlay"></div>
              </div>
              <div class="category-content">
                <h3 class="category-name">{{ cat.name }}</h3>
                <span class="category-count" *ngIf="cat.product_count !== undefined">
                  {{ cat.product_count }} {{ cat.product_count === 1 ? 'Product' : 'Products' }}
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <!-- FEATURED PRODUCTS -->
      <section class="section featured-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge badge-red">Trending & Spotlight</span>
              <h2 class="section-title">Featured Products</h2>
            </div>
            <a routerLink="/shop" [queryParams]="{featured: 'true'}" class="view-all-link">
              <span>Browse All Featured</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>

          <app-loading-spinner *ngIf="loadingFeatured()" [size]="36" message="Loading featured products..."></app-loading-spinner>

          <div class="products-grid" *ngIf="!loadingFeatured() && featuredProducts().length > 0">
            <app-product-card 
              *ngFor="let product of featuredProducts()" 
              [product]="product"
            ></app-product-card>
          </div>
        </div>
      </section>

      <!-- LATEST ARRIVALS -->
      <section class="section latest-section">
        <div class="container">
          <div class="section-header">
            <div>
              <span class="badge badge-cream">Fresh In Store</span>
              <h2 class="section-title">Latest Arrivals</h2>
            </div>
            <a routerLink="/shop" class="view-all-link">
              <span>Explore Shop</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
          </div>

          <app-loading-spinner *ngIf="loadingLatest()" [size]="36" message="Loading new arrivals..."></app-loading-spinner>

          <div class="products-grid" *ngIf="!loadingLatest() && latestProducts().length > 0">
            <app-product-card 
              *ngFor="let product of latestProducts()" 
              [product]="product"
            ></app-product-card>
          </div>
        </div>
      </section>

      <!-- ABOUT THE SHOP CMS SECTION -->
      <section class="section about-section" id="about-section">
        <div class="container about-grid">
          <div class="about-image-side">
            <div class="about-img-card">
              <img 
                [src]="websiteService.homepageContent().about_image || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80'" 
                alt="About Shaddas"
                class="about-img"
              >
              <div class="about-stat-overlay">
                <span class="stat-highlight">GH₵</span>
                <span class="stat-sub">Ghanaian Owned & Operated</span>
              </div>
            </div>
          </div>

          <div class="about-content-side">
            <span class="badge badge-red">Our Story & Commitment</span>
            <h2 class="about-title">{{ websiteService.homepageContent().about_title }}</h2>
            <p class="about-desc">{{ websiteService.homepageContent().about_description }}</p>

            <div class="about-points" *ngIf="websiteService.homepageContent().about_points">
              <div class="point-item" *ngFor="let point of websiteService.homepageContent().about_points">
                <div class="point-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span>{{ point }}</span>
              </div>
            </div>

            <div class="about-actions">
              <a 
                [href]="'https://wa.me/' + cartService.sanitizeWhatsAppNumber(shopService.shopInfo().whatsapp_number)" 
                target="_blank" 
                class="btn btn-whatsapp btn-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
                <span>Chat with Owner</span>
              </a>
              <a routerLink="/shop" class="btn btn-secondary btn-lg">Browse Products</a>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(180deg, var(--bg-surface-soft) 0%, var(--bg-body) 100%);
      padding: 4.5rem 0 5rem;
      border-bottom: 1px solid var(--border-subtle);
      position: relative;
      overflow: hidden;
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      gap: 3.5rem;
    }
    .hero-text-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .hero-title {
      font-size: 3.25rem;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      color: var(--text-primary);
    }
    .hero-description {
      font-size: 1.125rem;
      line-height: 1.65;
      color: var(--text-secondary);
      max-width: 540px;
    }
    .hero-cta-group {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
      margin-top: 0.5rem;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--brand-red);
    }
    .stat-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .stat-divider {
      width: 1px;
      height: 2rem;
      background: var(--border-subtle);
    }
    .hero-image-card {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-subtle);
      aspect-ratio: 4/4.5;
    }
    .hero-main-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .floating-badge {
      position: absolute;
      bottom: 1.5rem;
      left: 1.5rem;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      box-shadow: var(--shadow-lg);
      color: #1c1917;
      border: 1px solid rgba(255, 255, 255, 0.6);
    }
    .badge-icon {
      font-size: 1.5rem;
    }
    .badge-info {
      display: flex;
      flex-direction: column;
      font-size: 0.8125rem;
    }

    /* Trust Bar */
    .trust-bar {
      padding: 2.5rem 0;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }
    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }
    .trust-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    .trust-icon {
      font-size: 1.75rem;
      flex-shrink: 0;
    }
    .trust-card h4 {
      font-size: 0.9375rem;
      margin-bottom: 0.25rem;
    }
    .trust-card p {
      font-size: 0.8125rem;
      line-height: 1.45;
    }

    /* Common Section */
    .section {
      padding: 5rem 0;
    }
    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-title {
      font-size: 2rem;
      margin-top: 0.5rem;
    }
    .view-all-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.9375rem;
      font-weight: 700;
      color: var(--brand-red);
    }
    .view-all-link:hover {
      text-decoration: underline;
    }

    /* Categories Grid */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    .category-card {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      aspect-ratio: 4/5;
      display: flex;
      align-items: flex-end;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-subtle);
      transition: all 0.3s ease;
    }
    .category-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }
    .category-img-wrapper {
      position: absolute;
      inset: 0;
    }
    .category-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .category-card:hover .category-img-wrapper img {
      transform: scale(1.08);
    }
    .category-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(20, 10, 10, 0.85) 100%);
    }
    .category-content {
      position: relative;
      z-index: 2;
      padding: 1.5rem 1.25rem;
      color: #FFFFFF;
    }
    .category-name {
      font-size: 1.125rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 0.2rem;
    }
    .category-count {
      font-size: 0.8125rem;
      opacity: 0.85;
      font-weight: 500;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.75rem;
    }

    /* About Section */
    .about-section {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
    }
    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      align-items: center;
      gap: 4rem;
    }
    .about-img-card {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      aspect-ratio: 4/3.5;
    }
    .about-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .about-stat-overlay {
      position: absolute;
      bottom: 1.5rem;
      right: 1.5rem;
      background: rgba(185, 28, 28, 0.92);
      color: #FFFFFF;
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-lg);
      backdrop-filter: blur(8px);
      box-shadow: var(--shadow-crimson);
      display: flex;
      flex-direction: column;
    }
    .stat-highlight {
      font-family: var(--font-heading);
      font-size: 1.35rem;
      font-weight: 800;
    }
    .stat-sub {
      font-size: 0.75rem;
      opacity: 0.9;
    }
    .about-content-side {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .about-title {
      font-size: 2.25rem;
    }
    .about-desc {
      font-size: 1.0625rem;
      line-height: 1.7;
    }
    .about-points {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 0.5rem 0;
    }
    .point-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .point-check {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--brand-red-light);
      color: var(--brand-red);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .about-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    @media (max-width: 992px) {
      .hero-container, .about-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .trust-grid {
        grid-template-columns: 1fr 1fr;
      }
      .hero-title {
        font-size: 2.5rem;
      }
    }

    @media (max-width: 600px) {
      .trust-grid {
        grid-template-columns: 1fr;
      }
      .hero-title {
        font-size: 2rem;
      }
      .section {
        padding: 3.5rem 0;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  websiteService = inject(WebsiteService);
  shopService = inject(ShopService);
  cartService = inject(CartService);

  categories = signal<Category[]>([]);
  featuredProducts = signal<Product[]>([]);
  latestProducts = signal<Product[]>([]);

  loadingCategories = signal(true);
  loadingFeatured = signal(true);
  loadingLatest = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Categories
    this.productService.getCategories().subscribe({
      next: cats => {
        this.categories.set(cats);
        this.loadingCategories.set(false);
      },
      error: () => this.loadingCategories.set(false)
    });

    // Featured products
    this.productService.getProducts({ featured: true, limit: 8 }).subscribe({
      next: prods => {
        this.featuredProducts.set(prods);
        this.loadingFeatured.set(false);
      },
      error: () => this.loadingFeatured.set(false)
    });

    // Latest products
    this.productService.getProducts({ limit: 8 }).subscribe({
      next: prods => {
        this.latestProducts.set(prods);
        this.loadingLatest.set(false);
      },
      error: () => this.loadingLatest.set(false)
    });
  }
}
