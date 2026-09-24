import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../core/models/product.model';
import { CurrencyGhsPipe } from '../../../shared/pipes/currency-ghs.pipe';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyGhsPipe, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="product-detail-page animate-fade-in">
      
      <!-- LOADING STATE -->
      <div class="container" *ngIf="loading()">
        <app-loading-spinner [size]="48" message="Loading product details..."></app-loading-spinner>
      </div>

      <!-- NOT FOUND STATE -->
      <div class="container not-found-wrapper" *ngIf="!loading() && !product()">
        <div class="card not-found-card">
          <div class="not-found-icon">🔍</div>
          <h2>Product Not Found</h2>
          <p>The product you are looking for is currently unavailable or has been removed.</p>
          <a routerLink="/shop" class="btn btn-primary">Return to Shop</a>
        </div>
      </div>

      <!-- PRODUCT MAIN VIEW -->
      <div class="container" *ngIf="!loading() && product()">
        
        <!-- Breadcrumbs -->
        <div class="breadcrumb">
          <a routerLink="/">Home</a>
          <span>/</span>
          <a routerLink="/shop">Shop</a>
          <span>/</span>
          <a *ngIf="product()?.category_slug" [routerLink]="['/shop']" [queryParams]="{category: product()?.category_slug}">
            {{ product()?.category_name }}
          </a>
          <span *ngIf="product()?.category_slug">/</span>
          <span class="active">{{ product()?.name }}</span>
        </div>

        <div class="product-layout-grid">
          
          <!-- LEFT: IMAGE GALLERY -->
          <div class="gallery-col">
            <div class="main-image-wrapper card">
              <img [src]="activeImage()" [alt]="product()?.name" class="main-image">
              <span 
                class="badge stock-badge" 
                [ngClass]="product()?.availability ? 'badge-success' : 'badge-danger'"
              >
                {{ product()?.availability ? 'In Stock' : 'Out of Stock' }}
              </span>
            </div>

            <!-- Thumbnail Carousel/Row -->
            <div class="thumbnail-row" *ngIf="product()?.images && product()!.images.length > 1">
              <button 
                type="button" 
                *ngFor="let img of product()!.images; let idx = index"
                class="thumb-btn"
                [class.active]="activeImage() === img"
                (click)="setActiveImage(img)"
              >
                <img [src]="img" [alt]="'Image ' + (idx + 1)">
              </button>
            </div>
          </div>

          <!-- RIGHT: PRODUCT DETAILS & ORDER ACTIONS -->
          <div class="details-col">
            <div class="details-header">
              <span class="category-pill" *ngIf="product()?.category_name">
                {{ product()?.category_name }}
              </span>
              <h1 class="product-title">{{ product()?.name }}</h1>
              
              <div class="price-container">
                <span class="price-tag main-price">{{ product()?.price | currencyGhs }}</span>
                <span class="currency-note">Ghana Cedis</span>
              </div>
            </div>

            <!-- Description -->
            <div class="description-section">
              <h4 class="section-label">Description</h4>
              <p class="product-description">{{ product()?.description || 'No description provided for this item.' }}</p>
            </div>

            <!-- QUANTITY & CTA ACTIONS -->
            <div class="purchase-box card">
              
              <div class="quantity-row">
                <span class="qty-label">Quantity:</span>
                <div class="qty-selector">
                  <button type="button" class="qty-btn" (click)="decreaseQty()" [disabled]="quantity <= 1">−</button>
                  <span class="qty-number">{{ quantity }}</span>
                  <button type="button" class="qty-btn" (click)="increaseQty()">+</button>
                </div>
                <div class="subtotal-preview">
                  <span>Subtotal:</span>
                  <strong>{{ (Number(product()?.price || 0) * quantity) | currencyGhs }}</strong>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons-group">
                <!-- Add to Order Cart -->
                <button 
                  type="button" 
                  class="btn btn-secondary btn-lg flex-1"
                  [disabled]="!product()?.availability"
                  (click)="addToCart()"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  <span>Add to Order Cart</span>
                </button>

                <!-- Direct WhatsApp Order CTA -->
                <button 
                  type="button" 
                  class="btn btn-whatsapp btn-lg flex-1"
                  [disabled]="!product()?.availability"
                  (click)="orderDirectlyWhatsApp()"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
                  <span>Order Directly on WhatsApp</span>
                </button>
              </div>

              <!-- Guarantee points -->
              <div class="purchase-guarantees">
                <div class="guarantee-item">
                  <span class="guarantee-icon">⚡</span>
                  <span>Instant response on WhatsApp</span>
                </div>
                <div class="guarantee-item">
                  <span class="guarantee-icon">📍</span>
                  <span>Dispatch from {{ shopService.shopInfo().location }}</span>
                </div>
                <div class="guarantee-item">
                  <span class="guarantee-icon">🛡️</span>
                  <span>Pay upon order arrangement with owner</span>
                </div>
              </div>

            </div>

            <!-- Shop Info Card -->
            <div class="shop-info-widget card">
              <div class="widget-header">
                <div class="logo-mark sm">S</div>
                <div>
                  <h4>{{ shopService.shopInfo().name }}</h4>
                  <span class="location-text">📍 {{ shopService.shopInfo().location }}</span>
                </div>
              </div>
              <p class="widget-desc">
                Have questions regarding sizes, materials, or delivery timelines? Chat with the shop owner anytime.
              </p>
            </div>

          </div>

        </div>

        <!-- RELATED PRODUCTS SECTION -->
        <div class="related-section" *ngIf="product()?.related_products && product()!.related_products!.length > 0">
          <div class="section-header">
            <h2 class="section-title">Related Products</h2>
          </div>

          <div class="related-grid">
            <app-product-card 
              *ngFor="let rel of product()!.related_products" 
              [product]="rel"
            ></app-product-card>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .product-detail-page {
      padding: 2.5rem 0 5rem;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .breadcrumb a:hover {
      color: var(--brand-red);
    }
    .breadcrumb .active {
      color: var(--text-primary);
      font-weight: 600;
    }

    .product-layout-grid {
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: 3.5rem;
      align-items: flex-start;
    }

    /* Gallery */
    .main-image-wrapper {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      aspect-ratio: 1/1;
      background: var(--bg-surface-soft);
      box-shadow: var(--shadow-md);
    }
    .main-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .stock-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
    }
    .thumbnail-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }
    .thumb-btn {
      width: 76px;
      height: 76px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 2px solid var(--border-subtle);
      background: var(--bg-surface-soft);
      padding: 0;
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }
    .thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .thumb-btn.active, .thumb-btn:hover {
      border-color: var(--brand-red);
      transform: translateY(-2px);
    }

    /* Details Column */
    .details-col {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .category-pill {
      display: inline-block;
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--brand-red);
      margin-bottom: 0.35rem;
    }
    .product-title {
      font-size: 2.25rem;
      font-weight: 800;
      line-height: 1.2;
    }
    .price-container {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .main-price {
      font-size: 2rem;
      font-weight: 800;
    }
    .currency-note {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .description-section {
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }
    .section-label {
      font-size: 0.9375rem;
      margin-bottom: 0.5rem;
    }
    .product-description {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--text-secondary);
      white-space: pre-line;
    }

    /* Purchase Box */
    .purchase-box {
      padding: 1.75rem;
      background: var(--bg-surface);
      border: 1.5px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .quantity-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .qty-label {
      font-weight: 600;
      font-size: 0.9375rem;
    }
    .qty-selector {
      display: flex;
      align-items: center;
      border: 1.5px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-surface-soft);
      overflow: hidden;
    }
    .qty-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      transition: background 0.15s;
    }
    .qty-btn:hover:not(:disabled) {
      background: var(--bg-surface-hover);
      color: var(--brand-red);
    }
    .qty-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .qty-number {
      width: 44px;
      text-align: center;
      font-weight: 700;
      font-family: var(--font-price);
      font-size: 1.0625rem;
    }
    .subtotal-preview {
      margin-left: auto;
      font-size: 0.9375rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .subtotal-preview strong {
      font-family: var(--font-price);
      color: var(--brand-red);
    }
    .action-buttons-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .flex-1 {
      flex: 1;
      min-width: 200px;
    }
    .purchase-guarantees {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.65rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
    }
    .guarantee-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.8125rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    /* Shop Info Widget */
    .shop-info-widget {
      padding: 1.25rem 1.5rem;
      background: var(--bg-surface-soft);
    }
    .widget-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .logo-mark.sm {
      width: 2rem;
      height: 2rem;
      font-size: 1rem;
    }
    .location-text {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .widget-desc {
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Related Products */
    .related-section {
      margin-top: 6rem;
      padding-top: 3rem;
      border-top: 1px solid var(--border-subtle);
    }
    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.75rem;
      margin-top: 2rem;
    }

    /* Not Found */
    .not-found-wrapper {
      padding: 5rem 0;
    }
    .not-found-card {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }
    .not-found-icon {
      font-size: 3rem;
    }

    @media (max-width: 992px) {
      .product-layout-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  shopService = inject(ShopService);

  product = signal<Product | null>(null);
  activeImage = signal<string>('');
  loading = signal(true);
  quantity = 1;

  Number = Number;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idOrSlug = params.get('id');
      if (idOrSlug) {
        this.fetchProduct(idOrSlug);
      }
    });
  }

  fetchProduct(idOrSlug: string): void {
    this.loading.set(true);
    this.quantity = 1;
    this.productService.getProductDetail(idOrSlug).subscribe({
      next: prod => {
        this.product.set(prod);
        if (prod.images && prod.images.length > 0) {
          this.activeImage.set(prod.images[0]);
        } else {
          this.activeImage.set('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80');
        }
        this.loading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.loading.set(false);
      }
    });
  }

  setActiveImage(imgUrl: string): void {
    this.activeImage.set(imgUrl);
  }

  increaseQty(): void {
    this.quantity++;
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.addToCart(prod, this.quantity);
    }
  }

  orderDirectlyWhatsApp(): void {
    const prod = this.product();
    if (prod) {
      this.cartService.sendSingleProductViaWhatsApp(prod, this.quantity);
    }
  }
}
