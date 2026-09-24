import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { ShopService } from '../../../core/services/shop.service';
import { CustomerOrderInfo } from '../../../core/models/cart.model';
import { CurrencyGhsPipe } from '../../../shared/pipes/currency-ghs.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyGhsPipe],
  template: `
    <div class="cart-page animate-fade-in">
      
      <!-- CART HEADER -->
      <div class="cart-header">
        <div class="container">
          <div class="breadcrumb">
            <a routerLink="/">Home</a>
            <span>/</span>
            <span class="active">Your Order Cart</span>
          </div>
          <h1 class="page-title">Review & Send WhatsApp Order</h1>
          <p class="page-subtitle">No online payment required. Submit your cart directly to our WhatsApp to finalize delivery.</p>
        </div>
      </div>

      <div class="container cart-body">
        
        <!-- EMPTY CART STATE -->
        <div class="empty-cart card" *ngIf="cartService.items().length === 0">
          <div class="empty-icon">🛍️</div>
          <h2>Your order cart is empty</h2>
          <p>Browse our curated collections and add your desired products to place an order via WhatsApp.</p>
          <a routerLink="/shop" class="btn btn-primary btn-lg">
            Explore All Products
          </a>
        </div>

        <!-- ACTIVE CART GRID -->
        <div class="cart-grid" *ngIf="cartService.items().length > 0">
          
          <!-- LEFT: ITEMS LIST -->
          <div class="cart-items-col">
            <div class="card items-card">
              <div class="card-header-row">
                <h3 class="section-title">Order Items ({{ cartService.totalItemsCount() }})</h3>
                <button type="button" class="clear-cart-btn" (click)="cartService.clearCart()">
                  Clear Cart
                </button>
              </div>

              <!-- Item rows -->
              <div class="cart-item-list">
                <div class="cart-item-row" *ngFor="let item of cartService.items()">
                  <!-- Thumbnail -->
                  <div class="item-img-wrapper" [routerLink]="['/shop', item.product.id]">
                    <img 
                      [src]="item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80'" 
                      [alt]="item.product.name"
                    >
                  </div>

                  <!-- Item details -->
                  <div class="item-info">
                    <span class="item-category" *ngIf="item.product.category_name">
                      {{ item.product.category_name }}
                    </span>
                    <h4 class="item-name">
                      <a [routerLink]="['/shop', item.product.id]">{{ item.product.name }}</a>
                    </h4>
                    <span class="item-unit-price">{{ item.product.price | currencyGhs }} each</span>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="item-quantity-controls">
                    <div class="qty-selector sm">
                      <button type="button" class="qty-btn" (click)="cartService.updateQuantity(item.product.id, item.quantity - 1)">−</button>
                      <span class="qty-number">{{ item.quantity }}</span>
                      <button type="button" class="qty-btn" (click)="cartService.updateQuantity(item.product.id, item.quantity + 1)">+</button>
                    </div>
                  </div>

                  <!-- Item Subtotal -->
                  <div class="item-total">
                    <span class="price-tag">{{ (Number(item.product.price) * item.quantity) | currencyGhs }}</span>
                  </div>

                  <!-- Remove Button -->
                  <button 
                    type="button" 
                    class="item-remove-btn" 
                    (click)="cartService.removeFromCart(item.product.id)"
                    title="Remove item"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </div>
              </div>

              <!-- Bottom continue shopping link -->
              <div class="cart-bottom-actions">
                <a routerLink="/shop" class="continue-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  <span>Continue Shopping</span>
                </a>
              </div>
            </div>
          </div>

          <!-- RIGHT: CUSTOMER DETAILS & WHATSAPP SUBMIT -->
          <div class="checkout-summary-col">
            <div class="card checkout-card">
              <h3 class="card-title">Delivery & Customer Details</h3>
              <p class="card-subtitle">Please enter your details to generate your official WhatsApp order message.</p>

              <!-- Form -->
              <form (submit)="onSubmitOrder($event)" class="customer-order-form">
                
                <!-- Full Name -->
                <div class="form-group">
                  <label class="form-label" for="custName">Your Full Name *</label>
                  <input 
                    type="text" 
                    id="custName"
                    [(ngModel)]="customerInfo.name" 
                    name="custName"
                    placeholder="e.g. Kwame Mensah" 
                    class="form-input"
                    required
                  >
                </div>

                <!-- Phone / WhatsApp Number -->
                <div class="form-group">
                  <label class="form-label" for="custPhone">Phone / WhatsApp Number *</label>
                  <input 
                    type="tel" 
                    id="custPhone"
                    [(ngModel)]="customerInfo.phone" 
                    name="custPhone"
                    placeholder="e.g. 054 123 4567 or +233 ..." 
                    class="form-input"
                    required
                  >
                </div>

                <!-- Delivery / Location Info -->
                <div class="form-group">
                  <label class="form-label" for="custLocation">Delivery / Location Information *</label>
                  <textarea 
                    id="custLocation"
                    [(ngModel)]="customerInfo.location" 
                    name="custLocation"
                    placeholder="e.g. East Legon, near ANC Mall, House #42 / Accra" 
                    class="form-textarea"
                    rows="2"
                    required
                  ></textarea>
                </div>

                <!-- Additional Note -->
                <div class="form-group">
                  <label class="form-label" for="custNote">Additional Note (Optional)</label>
                  <textarea 
                    id="custNote"
                    [(ngModel)]="customerInfo.note" 
                    name="custNote"
                    placeholder="e.g. Preferred delivery time, color preference, or size inquiries..." 
                    class="form-textarea"
                    rows="2"
                  ></textarea>
                </div>

                <!-- Order Pricing Summary -->
                <div class="order-summary-box">
                  <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>{{ cartService.subtotal() | currencyGhs }}</span>
                  </div>
                  <div class="summary-row total-row">
                    <span>Estimated Total:</span>
                    <span class="price-tag total-price">{{ cartService.total() | currencyGhs }}</span>
                  </div>
                  <div class="currency-disclaimer">
                    <span>🇬🇭 All pricing is in Ghana Cedis (GH₵). Delivery fee arranged with shop owner.</span>
                  </div>
                </div>

                <!-- WhatsApp Order Submission Button -->
                <button 
                  type="submit" 
                  class="btn btn-whatsapp btn-lg submit-whatsapp-btn"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
                  <span>Send Order via WhatsApp</span>
                </button>

                <!-- WhatsApp number note -->
                <div class="whatsapp-target-note">
                  <span>Direct to {{ shopService.shopInfo().name }} WhatsApp:</span>
                  <strong>{{ shopService.shopInfo().whatsapp_number }}</strong>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .cart-page {
      padding-bottom: 6rem;
    }
    .cart-header {
      background: var(--bg-surface-soft);
      border-bottom: 1px solid var(--border-subtle);
      padding: 3rem 0;
    }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .breadcrumb a:hover {
      color: var(--brand-red);
    }
    .breadcrumb .active {
      color: var(--text-primary);
      font-weight: 600;
    }
    .page-title {
      font-size: 2.25rem;
      margin-bottom: 0.35rem;
    }
    .page-subtitle {
      font-size: 0.9375rem;
      max-width: 600px;
    }

    .cart-body {
      margin-top: 2.5rem;
    }

    /* Empty Cart */
    .empty-cart {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      max-width: 540px;
      margin: 0 auto;
    }
    .empty-icon {
      font-size: 3.5rem;
    }
    .empty-cart h2 {
      font-size: 1.75rem;
    }
    .empty-cart p {
      line-height: 1.6;
      margin-bottom: 0.5rem;
    }

    /* Cart Grid */
    .cart-grid {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 2.5rem;
      align-items: flex-start;
    }

    /* Items Card */
    .items-card {
      padding: 1.75rem;
    }
    .card-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .section-title {
      font-size: 1.25rem;
    }
    .clear-cart-btn {
      font-size: 0.8125rem;
      color: var(--danger);
      font-weight: 600;
      transition: opacity 0.2s;
    }
    .clear-cart-btn:hover {
      text-decoration: underline;
    }

    /* Item Row */
    .cart-item-list {
      display: flex;
      flex-direction: column;
    }
    .cart-item-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .item-img-wrapper {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--bg-surface-soft);
      flex-shrink: 0;
      cursor: pointer;
    }
    .item-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .item-info {
      flex: 1;
      min-width: 140px;
    }
    .item-category {
      font-size: 0.75rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
    }
    .item-name {
      font-size: 0.9375rem;
      font-weight: 700;
      line-height: 1.3;
      margin: 0.15rem 0 0.25rem;
    }
    .item-name a:hover {
      color: var(--brand-red);
    }
    .item-unit-price {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }
    .qty-selector.sm {
      border: 1.5px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      background: var(--bg-surface-soft);
    }
    .qty-selector.sm .qty-btn {
      width: 28px;
      height: 28px;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-selector.sm .qty-number {
      width: 32px;
      font-size: 0.875rem;
      font-weight: 700;
      text-align: center;
    }
    .item-total {
      min-width: 90px;
      text-align: right;
    }
    .item-total .price-tag {
      font-size: 1rem;
    }
    .item-remove-btn {
      color: var(--text-muted);
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .item-remove-btn:hover {
      color: var(--danger);
      background: var(--danger-bg);
    }
    .cart-bottom-actions {
      padding-top: 1.25rem;
    }
    .continue-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--brand-red);
    }
    .continue-link:hover {
      text-decoration: underline;
    }

    /* Checkout Summary Card */
    .checkout-card {
      padding: 1.75rem;
    }
    .card-title {
      font-size: 1.25rem;
      margin-bottom: 0.25rem;
    }
    .card-subtitle {
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .customer-order-form {
      display: flex;
      flex-direction: column;
    }
    .order-summary-box {
      background: var(--bg-surface-soft);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      margin: 0.75rem 0 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border: 1px solid var(--border-subtle);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9375rem;
    }
    .total-row {
      padding-top: 0.75rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 1.125rem;
      font-weight: 700;
    }
    .total-price {
      font-size: 1.35rem;
    }
    .currency-disclaimer {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
      margin-top: 0.25rem;
    }
    .submit-whatsapp-btn {
      width: 100%;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      font-size: 1.0625rem;
    }
    .whatsapp-target-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      margin-top: 1rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      flex-wrap: wrap;
    }
    .whatsapp-target-note strong {
      color: #128C7E;
    }

    @media (max-width: 992px) {
      .cart-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      .cart-item-row {
        flex-wrap: wrap;
      }
      .item-total {
        margin-left: auto;
      }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);
  shopService = inject(ShopService);

  Number = Number;

  customerInfo: CustomerOrderInfo = {
    name: '',
    phone: '',
    location: '',
    note: ''
  };

  onSubmitOrder(event: Event): void {
    event.preventDefault();
    this.cartService.sendCartOrderViaWhatsApp(this.customerInfo);
  }
}
