import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, DashboardStatsResponse } from '../../../core/services/product.service';
import { ShopService } from '../../../core/services/shop.service';
import { CurrencyGhsPipe } from '../../../shared/pipes/currency-ghs.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyGhsPipe, LoadingSpinnerComponent],
  template: `
    <div class="owner-dashboard animate-fade-in">
      
      <!-- DASHBOARD HEADER -->
      <div class="dashboard-header">
        <div>
          <span class="badge badge-cream">Store Management</span>
          <h1 class="page-title">Dashboard Overview</h1>
          <p class="page-subtitle">Real-time overview of your store catalog, categories, and WhatsApp ordering status.</p>
        </div>

        <div class="header-actions">
          <a routerLink="/owner/products" [queryParams]="{action: 'new'}" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Add New Product</span>
          </a>
        </div>
      </div>

      <!-- WHATSAPP INTEGRATION NOTICE BAR -->
      <div class="card wa-status-card">
        <div class="wa-icon-box">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.062-2.124-.531-1.745-.724-2.883-2.527-2.97-2.643-.087-.116-.708-.941-.708-1.796 0-.855.449-1.275.609-1.449.16-.174.348-.217.464-.217.116 0 .232.002.333.007.107.005.25.04.391.377.145.348.493 1.203.536 1.29.043.087.072.188.014.304-.058.116-.087.188-.174.29-.087.101-.183.226-.261.304-.087.087-.178.181-.077.355.101.174.449.741.964 1.2 1.066.95 1.583 1.246 1.808 1.348.145.065.232.058.319-.043.087-.101.377-.435.478-.58.101-.145.203-.122.348-.072.145.051.928.438 1.087.517.16.079.267.116.304.181.037.065.037.377-.107.782z"/></svg>
        </div>
        <div class="wa-status-text">
          <strong>WhatsApp Orders Active: <code>{{ shopService.shopInfo().whatsapp_number }}</code></strong>
          <span>Customer cart submissions automatically route directly to this phone number.</span>
        </div>
        <a routerLink="/owner/settings" class="btn btn-secondary btn-sm">Edit Number</a>
      </div>

      <!-- LOADING -->
      <app-loading-spinner *ngIf="loading()" [size]="44" message="Loading store analytics..."></app-loading-spinner>

      <!-- STATS OVERVIEW CARDS -->
      <div class="stats-grid" *ngIf="!loading()">
        
        <!-- Total Products -->
        <div class="card stat-card">
          <div class="stat-top">
            <span class="stat-label">Total Catalog Products</span>
            <span class="stat-icon-pill">📦</span>
          </div>
          <div class="stat-value">{{ data()?.stats?.total_products || 0 }}</div>
          <div class="stat-footer">
            <span class="stat-detail">All inventory records</span>
          </div>
        </div>

        <!-- Published Products -->
        <div class="card stat-card stat-published">
          <div class="stat-top">
            <span class="stat-label">Published (Live Online)</span>
            <span class="stat-icon-pill green">✨</span>
          </div>
          <div class="stat-value">{{ data()?.stats?.published_products || 0 }}</div>
          <div class="stat-footer">
            <span class="stat-detail text-success">Visible on public store</span>
          </div>
        </div>

        <!-- Hidden / Draft Products -->
        <div class="card stat-card">
          <div class="stat-top">
            <span class="stat-label">Hidden / Drafts</span>
            <span class="stat-icon-pill amber">🔒</span>
          </div>
          <div class="stat-value">{{ (data()?.stats?.hidden_products || 0) + (data()?.stats?.draft_products || 0) }}</div>
          <div class="stat-footer">
            <span class="stat-detail">Hidden from customers</span>
          </div>
        </div>

        <!-- Total Categories -->
        <div class="card stat-card">
          <div class="stat-top">
            <span class="stat-label">Categories</span>
            <span class="stat-icon-pill">🏷️</span>
          </div>
          <div class="stat-value">{{ data()?.stats?.total_categories || 0 }}</div>
          <div class="stat-footer">
            <span class="stat-detail">Curated collections</span>
          </div>
        </div>

      </div>

      <!-- QUICK SHORTCUTS ROW -->
      <div class="shortcuts-row" *ngIf="!loading()">
        <a routerLink="/owner/products" [queryParams]="{action: 'new'}" class="card shortcut-card">
          <div class="shortcut-icon red">➕</div>
          <div class="shortcut-info">
            <h4>Add New Product</h4>
            <p>Upload photos, set GH₵ price, availability & publish</p>
          </div>
        </a>

        <a routerLink="/owner/categories" class="card shortcut-card">
          <div class="shortcut-icon amber">🏷️</div>
          <div class="shortcut-info">
            <h4>Manage Categories</h4>
            <p>Organize footwear, bags, apparel & collections</p>
          </div>
        </a>

        <a routerLink="/owner/website" class="card shortcut-card">
          <div class="shortcut-icon purple">🎨</div>
          <div class="shortcut-info">
            <h4>Customize Website CMS</h4>
            <p>Edit homepage hero text, about story & banner</p>
          </div>
        </a>

        <a routerLink="/owner/settings" class="card shortcut-card">
          <div class="shortcut-icon green">⚙️</div>
          <div class="shortcut-info">
            <h4>Shop Settings</h4>
            <p>Change WhatsApp number, store location & email</p>
          </div>
        </a>
      </div>

      <!-- RECENT PRODUCTS TABLE -->
      <div class="card recent-table-card" *ngIf="!loading()">
        <div class="table-header-row">
          <div>
            <h3 class="card-heading">Recently Added Products</h3>
            <p class="card-sub">Quickly inspect or modify your latest products.</p>
          </div>
          <a routerLink="/owner/products" class="btn btn-secondary btn-sm">
            View All Products
          </a>
        </div>

        <div class="table-responsive" *ngIf="data()?.recent_products && data()!.recent_products.length > 0">
          <table class="owner-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (GH₵)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Created</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of data()!.recent_products">
                <td>
                  <div class="table-product-cell">
                    <img 
                      [src]="item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80'" 
                      [alt]="item.name"
                      class="table-thumb"
                    >
                    <div class="product-names">
                      <strong>{{ item.name }}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-cream">{{ item.category_name || 'Unassigned' }}</span>
                </td>
                <td>
                  <strong class="price-tag">{{ item.price | currencyGhs }}</strong>
                </td>
                <td>
                  <span class="badge" [ngClass]="item.availability ? 'badge-success' : 'badge-danger'">
                    {{ item.availability ? 'In Stock' : 'Out of Stock' }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="item.status === 'published' ? 'badge-red' : 'badge-cream'">
                    {{ item.status | titlecase }}
                  </span>
                </td>
                <td class="text-muted text-sm">
                  {{ item.created_at | date:'mediumDate' }}
                </td>
                <td class="text-right">
                  <a [routerLink]="['/owner/products']" [queryParams]="{edit: item.id}" class="btn btn-secondary btn-sm">
                    Edit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-table-state" *ngIf="!data()?.recent_products || data()!.recent_products.length === 0">
          <p>No products in the catalog yet.</p>
          <a routerLink="/owner/products" [queryParams]="{action: 'new'}" class="btn btn-primary btn-sm">Create First Product</a>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .owner-dashboard {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .dashboard-header {
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

    /* WhatsApp Status Card */
    .wa-status-card {
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      background: linear-gradient(135deg, rgba(37, 211, 102, 0.08) 0%, var(--bg-surface) 100%);
      border: 1px solid rgba(37, 211, 102, 0.3);
      flex-wrap: wrap;
    }
    .wa-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: #25D366;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .wa-status-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      min-width: 240px;
    }
    .wa-status-text code {
      color: #128C7E;
      font-weight: 700;
      background: rgba(37, 211, 102, 0.15);
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-xs);
    }
    .wa-status-text span {
      font-size: 0.8125rem;
      color: var(--text-secondary);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .stat-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .stat-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .stat-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .stat-icon-pill {
      font-size: 1.25rem;
    }
    .stat-value {
      font-family: var(--font-heading);
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .stat-footer {
      font-size: 0.8125rem;
      color: var(--text-muted);
    }
    .text-success { color: var(--success); font-weight: 600; }

    /* Shortcuts */
    .shortcuts-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
    .shortcut-card {
      padding: 1.25rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      transition: all var(--transition-normal);
    }
    .shortcut-card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--border-strong);
    }
    .shortcut-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
      background: var(--bg-surface-soft);
    }
    .shortcut-info h4 {
      font-size: 0.9375rem;
      margin-bottom: 0.2rem;
    }
    .shortcut-info p {
      font-size: 0.75rem;
      line-height: 1.4;
    }

    /* Table */
    .recent-table-card {
      padding: 1.75rem;
    }
    .table-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .card-heading {
      font-size: 1.25rem;
    }
    .card-sub {
      font-size: 0.875rem;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .owner-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .owner-table th {
      padding: 0.75rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1.5px solid var(--border-subtle);
    }
    .owner-table td {
      padding: 1rem;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--border-subtle);
      vertical-align: middle;
    }
    .table-product-cell {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }
    .table-thumb {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      background: var(--bg-surface-soft);
    }
    .text-right { text-align: right; }
    .text-sm { font-size: 0.8125rem; }
    .empty-table-state {
      padding: 3rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    @media (max-width: 1100px) {
      .stats-grid, .shortcuts-row {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 600px) {
      .stats-grid, .shortcuts-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OwnerDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  shopService = inject(ShopService);

  data = signal<DashboardStatsResponse | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    this.loading.set(true);
    this.productService.getOwnerDashboardStats().subscribe({
      next: res => {
        this.data.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
