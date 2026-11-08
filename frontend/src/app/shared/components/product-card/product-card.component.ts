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
      <div class="image-wrapper" [routerLink]="['/shop', product.id]">
        <img 
          [src]="product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80'" 
          [alt]="product.name" 
          loading="lazy"
          class="product-image"
        >

        <span class="badge stock-badge" [ngClass]="product.availability ? 'badge-success' : 'badge-danger'">
          {{ product.availability ? 'In Stock' : 'Out of Stock' }}
        </span>

        <div class="quick-view-overlay">
          <span>View Details</span>
        </div>
      </div>

      <div class="card-content">
        <div class="category-tag" *ngIf="product.category_name">{{ product.category_name }}</div>
        <h3 class="product-title" [title]="product.name">
          <a [routerLink]="['/shop', product.id]">{{ product.name }}</a>
        </h3>

        <div class="price-row">
          <span class="price-tag">{{ product.price | currencyGhs }}</span>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-secondary btn-sm flex-1 add-btn" [disabled]="!product.availability" (click)="onAddToCart($event)" title="Add to Order Cart">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 1.95L8.5 15H18l2-8H6.35"/></svg>
            <span>Add to Cart</span>
          </button>

          <button type="button" class="btn btn-whatsapp btn-sm btn-icon" (click)="onWhatsAppDirect($event)" title="Order Directly on WhatsApp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.5 2.16.987 3.202.987 3.161 0 5.739-2.276 5.739-5.486.001-3.123-2.465-5.531-5.546-5.531zm.84 9.866c-.387.331-1.156.442-2.084.442-1.138 0-2.355-.359-3.378-1.027l-.239-.142-1.467.385.38-1.434-.153-.268c-.787-1.318-1.018-2.684-.508-3.907.54-1.305 1.76-2.119 3.17-2.436.879-.194 1.847-.119 2.708.22 1.11.438 1.831 1.174 2.228 2.072.419.949.39 2.02-.085 3.056-.557 1.217-1.688 2.043-2.9 2.387zm5.035-4.423c-.26-.111-.982-.455-1.823-.759-.84-.304-1.182-.39-1.296-.39-.566 0-1.319.242-2.165.662l-.053.028-.111.061c-.393.214-.923.504-1.496.798-.62.319-.777.38-1.062.382-.771.004-1.427-.397-1.843-.863a2.876 2.876 0 0 1-.022-3.249c.364-.55.86-1.062 1.498-1.537.426-.318.844-.419 1.259-.276.367.129.821.341.917.362.197.042.332.167.527.436.62.857.681 1.122.704 1.229.036.171.038.578-.07 1.057-.201.889-.775 1.241-1.759 1.403-.388.064-.784.13-1.144.202-.329.066-.554.308-.735.71-.177.39-.173.921.335 1.528.435.518 1.001.868 1.596.972.923.159 1.888-.067 2.834-.658.482-.301 1.013-.703 1.649-1.414.537-.601.849-.987 1.061-1.478.11-.255.181-.477.178-.633-.002-.141-.04-.262-.099-.343z"></path></svg>
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
      background: linear-gradient(180deg, #ffffff 0%, #fffaf8 100%);
      border: 1px solid rgba(17, 24, 39, 0.08);
      border-radius: 1.4rem;
      overflow: hidden;
      transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 22px 50px -18px rgba(17, 24, 39, 0.18);
      border-color: rgba(185, 28, 28, 0.18);
    }
    .image-wrapper {
      position: relative;
      width: 100%;
      aspect-ratio: 4 / 5;
      background: #f6f3f1;
      overflow: hidden;
      cursor: pointer;
    }
    .product-image {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .product-card:hover .product-image { transform: scale(1.05); }
    .stock-badge {
      position: absolute;
      top: 0.8rem;
      left: 0.8rem;
      z-index: 2;
      backdrop-filter: blur(8px);
      box-shadow: 0 6px 12px rgba(17, 24, 39, 0.08);
    }
    .quick-view-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(17, 24, 39, 0.37) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .quick-view-overlay span {
      background: rgba(255, 255, 255, 0.96);
      color: #111827;
      padding: 0.55rem 1rem;
      font-size: 0.75rem;
      font-weight: 800;
      border-radius: 999px;
      box-shadow: 0 12px 20px rgba(17, 24, 39, 0.12);
      transform: translateY(8px);
      transition: transform 0.25s ease;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .product-card:hover .quick-view-overlay { opacity: 1; }
    .product-card:hover .quick-view-overlay span { transform: translateY(0); }
    .card-content {
      padding: 1.1rem 1.1rem 1rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.45rem;
    }
    .category-tag {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
    }
    .product-title {
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.7rem;
    }
    .product-title a:hover { color: var(--brand-red); }
    .price-row {
      margin-top: auto;
      padding-top: 0.15rem;
    }
    .price-tag {
      font-size: 1.25rem;
      font-weight: 800;
    }
    .card-actions {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-top: 0.75rem;
    }
    .flex-1 { flex: 1; }
    .add-btn {
      font-size: 0.82rem;
      font-weight: 700;
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
