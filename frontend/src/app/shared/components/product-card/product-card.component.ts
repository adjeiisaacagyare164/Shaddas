import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { CurrencyGhsPipe } from '../../pipes/currency-ghs.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyGhsPipe],
  template: `
    <div class="product-card card card-hover">
      <!-- Image Container -->
      <div class="image-wrapper" [routerLink]="['/shop', product.id]">
        <img 
          [src]="product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'" 
          [alt]="product.name" 
          loading="lazy"
          class="product-image"
        >

        <!-- Availability Badge -->
        <span 
          class="badge stock-badge" 
          [ngClass]="product.availability ? 'badge-success' : 'badge-danger'"
        >
          {{ product.availability ? 'In Stock' : 'Out of Stock' }}
        </span>

        <!-- Quick View Overlay on Hover -->
        <div class="quick-view-overlay">
          <span>View Details</span>
        </div>
      </div>

      <!-- Content -->
      <div class="card-content">
        <div class="category-tag" *ngIf="product.category_name">
          {{ product.category_name }}
        </div>

        <h3 class="product-title" [title]="product.name">
          <a [routerLink]="['/shop', product.id]">{{ product.name }}</a>
        </h3>

        <div class="price-row">
          <span class="price-tag">{{ product.price | currencyGhs }}</span>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions">
          <button 
            type="button" 
            class="btn btn-secondary btn-sm flex-1 add-btn"
            [disabled]="!product.availability"
            (click)="onAddToCart($event)"
            title="Add to Order Cart"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span>Add to Cart</span>
          </button>

          <button 
            type="button" 
            class="btn btn-whatsapp btn-sm btn-icon"
            (click)="onWhatsAppDirect($event)"
            title="Order Directly on WhatsApp"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-xl);
      border-color: var(--border-strong);
    }
    .image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 100%; /* 1:1 Aspect ratio */
      background: var(--bg-surface-soft);
      overflow: hidden;
      cursor: pointer;
    }
    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover .product-image {
      transform: scale(1.06);
    }
    .stock-badge {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      z-index: 2;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }
    .quick-view-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .quick-view-overlay span {
      background: rgba(255, 255, 255, 0.95);
      color: #1c1917;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      font-weight: 700;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-md);
      transform: translateY(6px);
      transition: transform 0.25s ease;
    }
    .product-card:hover .quick-view-overlay {
      opacity: 1;
    }
    .product-card:hover .quick-view-overlay span {
      transform: translateY(0);
    }
    .card-content {
      padding: 1.125rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.4rem;
    }
    .category-tag {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .product-title {
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.7rem;
    }
    .product-title a:hover {
      color: var(--brand-red);
    }
    .price-row {
      margin-top: auto;
      padding-top: 0.25rem;
    }
    .price-tag {
      font-size: 1.1875rem;
      font-weight: 700;
    }
    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .flex-1 { flex: 1; }
    .add-btn {
      font-size: 0.8125rem;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart(this.product, 1);
  }

  onWhatsAppDirect(event: Event): void {
    event.stopPropagation();
    this.cartService.sendSingleProductViaWhatsApp(this.product, 1);
  }
}
