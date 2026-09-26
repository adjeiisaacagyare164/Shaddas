import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShopService } from '../../../core/services/shop.service';
import { ToastService } from '../../../core/services/toast.service';
import { CartService } from '../../../core/services/cart.service';
import { Shop } from '../../../core/models/shop.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-owner-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="owner-settings-page animate-fade-in">
      
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <span class="badge badge-cream">Configuration</span>
          <h1 class="page-title">Shop Settings</h1>
          <p class="page-subtitle">Configure your store identity, location, and the official WhatsApp number for order dispatch.</p>
        </div>

        <button 
          type="button" 
          class="btn btn-primary btn-lg"
          [disabled]="saving()"
          (click)="onSaveSettings()"
        >
          <span>{{ saving() ? 'Saving Settings...' : 'Save Settings' }}</span>
        </button>
      </div>

      <!-- LOADING -->
      <app-loading-spinner *ngIf="loading()" [size]="44" message="Loading shop configuration..."></app-loading-spinner>

      <div class="settings-grid" *ngIf="!loading()">
        
        <!-- MAIN SETTINGS CARD -->
        <div class="card settings-card">
          
          <!-- WHATSAPP INTEGRATION BOX (PROMINENT) -->
          <div class="whatsapp-config-box">
            <div class="wa-header">
              <div class="wa-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
              </div>
              <div>
                <h4>Official WhatsApp Order Destination</h4>
                <p>All customer orders generated on the website open a direct chat to this phone number.</p>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="waNum">WhatsApp Order Number * (Include country code e.g. +233 ...)</label>
              <input 
                type="tel" 
                id="waNum"
                [(ngModel)]="shopData.whatsapp_number" 
                name="waNum"
                placeholder="+233 53 558 9099" 
                class="form-input wa-input"
                required
              >
              <span class="form-hint">
                Current sanitized number for wa.me links: 
                <strong>{{ cartService.sanitizeWhatsAppNumber(shopData.whatsapp_number) }}</strong>
              </span>
            </div>
          </div>

          <!-- BASIC STORE DETAILS -->
          <div class="form-grid-2">
            
            <!-- Shop Name -->
            <div class="form-group">
              <label class="form-label" for="shopName">Shop / Brand Name *</label>
              <input 
                type="text" 
                id="shopName"
                [(ngModel)]="shopData.name" 
                name="shopName"
                placeholder="Shaddas"
                class="form-input"
                required
              >
            </div>

            <!-- Shop Phone -->
            <div class="form-group">
              <label class="form-label" for="shopPhone">Store Phone (Customer Calls)</label>
              <input 
                type="tel" 
                id="shopPhone"
                [(ngModel)]="shopData.phone" 
                name="shopPhone"
                placeholder="+233 53 558 9099" 
                class="form-input"
              >
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label" for="shopEmail">Store Email</label>
              <input 
                type="email" 
                id="shopEmail"
                [(ngModel)]="shopData.email" 
                name="shopEmail"
                placeholder="contact@shadas.com" 
                class="form-input"
              >
            </div>

            <!-- Location -->
            <div class="form-group">
              <label class="form-label" for="shopLoc">Physical Location / Dispatch Hub *</label>
              <input 
                type="text" 
                id="shopLoc"
                [(ngModel)]="shopData.location" 
                name="shopLoc"
                placeholder="East Legon, Accra - Ghana" 
                class="form-input"
                required
              >
            </div>

            <!-- Instagram -->
            <div class="form-group">
              <label class="form-label" for="shopIg">Instagram Username / Link</label>
              <input 
                type="text" 
                id="shopIg"
                [(ngModel)]="shopData.instagram" 
                name="shopIg"
                placeholder="@shadas_official" 
                class="form-input"
              >
            </div>

            <!-- Facebook -->
            <div class="form-group">
              <label class="form-label" for="shopFb">Facebook Page</label>
              <input 
                type="text" 
                id="shopFb"
                [(ngModel)]="shopData.facebook" 
                name="shopFb"
                placeholder="shadas.store" 
                class="form-input"
              >
            </div>

            <!-- Description -->
            <div class="form-group col-span-2">
              <label class="form-label" for="shopDesc">Store Brand Statement / Bio</label>
              <textarea 
                id="shopDesc"
                [(ngModel)]="shopData.description" 
                name="shopDesc"
                placeholder="Brief summary displayed in footer and about references..." 
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

          </div>

          <!-- Currency Section (Informational) -->
          <div class="currency-info-box">
            <div class="currency-left">
              <span class="flag">🇬🇭</span>
              <div>
                <strong>Currency: Ghana Cedis (GH₵)</strong>
                <p>All product listings, cart subtotals, and WhatsApp messages use Ghana Cedis formatting.</p>
              </div>
            </div>
            <span class="badge badge-cream">Active Standard</span>
          </div>

        </div>

      </div>

    </div>
  `,
  styles: [`
    .owner-settings-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .page-title {
      font-size: 2.25rem;
      margin: 0.25rem 0;
    }
    .page-subtitle {
      font-size: 0.9375rem;
    }

    .settings-card {
      padding: 2.25rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 900px;
    }

    /* WhatsApp Config Box */
    .whatsapp-config-box {
      background: linear-gradient(135deg, rgba(37, 211, 102, 0.08) 0%, var(--bg-surface-soft) 100%);
      border: 1.5px solid rgba(37, 211, 102, 0.4);
      border-radius: var(--radius-lg);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .wa-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    .wa-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #25D366;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .wa-header h4 {
      font-size: 1.125rem;
      margin-bottom: 0.2rem;
    }
    .wa-header p {
      font-size: 0.8125rem;
    }
    .wa-input {
      font-family: var(--font-price);
      font-size: 1.125rem;
      font-weight: 700;
      color: #128C7E;
      border-color: rgba(37, 211, 102, 0.5);
    }
    .wa-input:focus {
      border-color: #25D366;
      box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.25);
    }
    .form-hint strong {
      color: #128C7E;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .col-span-2 { grid-column: span 2; }

    .currency-info-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      background: var(--bg-surface-soft);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .currency-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .flag {
      font-size: 2rem;
    }
    .currency-left p {
      font-size: 0.8125rem;
      margin-top: 0.15rem;
    }

    @media (max-width: 768px) {
      .form-grid-2 {
        grid-template-columns: 1fr;
      }
      .col-span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class OwnerSettingsComponent implements OnInit {
  private shopService = inject(ShopService);
  private toast = inject(ToastService);
  cartService = inject(CartService);

  loading = signal(true);
  saving = signal(false);

  shopData: Shop = {
    name: 'Shaddas',
    description: '',
    whatsapp_number: '',
    phone: '',
    email: '',
    location: '',
    instagram: '',
    facebook: '',
    currency: 'GH₵',
    currency_code: 'GHS'
  };

  ngOnInit(): void {
    this.fetchSettings();
  }

  fetchSettings(): void {
    this.loading.set(true);
    this.shopService.getOwnerShop().subscribe({
      next: shop => {
        this.shopData = shop;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSaveSettings(): void {
    if (!this.shopData.name.trim() || !this.shopData.whatsapp_number.trim() || !this.shopData.location.trim()) {
      this.toast.error('Please enter Shop Name, WhatsApp Number, and Location.');
      return;
    }

    this.saving.set(true);
    this.shopService.updateOwnerShop(this.shopData).subscribe({
      next: updated => {
        this.shopData = updated;
        this.saving.set(false);
        this.toast.success('Shop settings and WhatsApp number updated successfully!');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to update shop settings.');
      }
    });
  }
}
