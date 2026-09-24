import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, LoadingSpinnerComponent],
  template: `
    <div class="shop-page animate-fade-in">
      
      <!-- SHOP HEADER -->
      <div class="shop-header">
        <div class="container header-container">
          <div>
            <div class="breadcrumb">
              <a routerLink="/">Home</a>
              <span>/</span>
              <span class="active">Shop</span>
            </div>
            <h1 class="page-title">
              {{ selectedCategoryName() || (searchQuery ? 'Search: "' + searchQuery + '"' : 'All Products') }}
            </h1>
            <p class="page-subtitle">Browse all curated products with direct WhatsApp ordering.</p>
          </div>

          <div class="results-meta" *ngIf="!loading()">
            <span class="badge badge-cream">
              {{ products().length }} {{ products().length === 1 ? 'Product' : 'Products' }} Available
            </span>
          </div>
        </div>
      </div>

      <!-- MAIN SHOP CONTENT -->
      <div class="container shop-body">
        
        <!-- TOOLBAR (Search & Filters) -->
        <div class="shop-toolbar card">
          <!-- Search input -->
          <div class="toolbar-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onFilterChange()"
              placeholder="Search by name, description, or keyword..." 
              class="toolbar-search-input"
            >
            <button *ngIf="searchQuery" (click)="clearSearch()" class="clear-btn" type="button">✕</button>
          </div>

          <!-- Controls (Stock toggle & Sort) -->
          <div class="toolbar-controls">
            <!-- In Stock Only Toggle -->
            <label class="stock-toggle">
              <input 
                type="checkbox" 
                [(ngModel)]="inStockOnly" 
                (change)="onFilterChange()"
              >
              <span>In Stock Only</span>
            </label>

            <!-- Sort dropdown -->
            <div class="sort-wrapper">
              <span class="sort-label">Sort:</span>
              <select [(ngModel)]="sortBy" (change)="onFilterChange()" class="form-select sort-select">
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        <!-- CATEGORY CHIPS (Horizontal Scrollable) -->
        <div class="category-chips-bar">
          <button 
            type="button" 
            class="chip-btn" 
            [class.active]="!selectedCategory"
            (click)="selectCategory('')"
          >
            All Categories
          </button>

          <button 
            *ngFor="let cat of categories()" 
            type="button" 
            class="chip-btn"
            [class.active]="selectedCategory === cat.slug"
            (click)="selectCategory(cat.slug)"
          >
            {{ cat.name }}
          </button>
        </div>

        <!-- LOADING STATE -->
        <app-loading-spinner *ngIf="loading()" [size]="48" message="Loading store catalog..."></app-loading-spinner>

        <!-- EMPTY STATE -->
        <div class="empty-state card" *ngIf="!loading() && products().length === 0">
          <div class="empty-icon">🛍️</div>
          <h3>No products found</h3>
          <p>We couldn't find any items matching your current search or filter criteria.</p>
          <button type="button" class="btn btn-primary" (click)="resetFilters()">
            Reset All Filters
          </button>
        </div>

        <!-- PRODUCT GRID -->
        <div class="products-grid" *ngIf="!loading() && products().length > 0">
          <app-product-card 
            *ngFor="let product of products()" 
            [product]="product"
          ></app-product-card>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .shop-page {
      padding-bottom: 5rem;
    }
    .shop-header {
      background: var(--bg-surface-soft);
      border-bottom: 1px solid var(--border-subtle);
      padding: 3rem 0;
    }
    .header-container {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
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
      margin-bottom: 0.25rem;
    }
    .page-subtitle {
      font-size: 0.9375rem;
    }
    .shop-body {
      margin-top: 2.5rem;
    }

    /* Toolbar */
    .shop-toolbar {
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .toolbar-search {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 260px;
    }
    .toolbar-search svg {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      pointer-events: none;
    }
    .toolbar-search-input {
      width: 100%;
      padding: 0.65rem 2.25rem 0.65rem 2.75rem;
      background: var(--bg-surface-soft);
      border: 1.5px solid var(--border-subtle);
      border-radius: var(--radius-md);
      font-size: 0.9375rem;
      transition: all var(--transition-fast);
    }
    .toolbar-search-input:focus {
      outline: none;
      border-color: var(--border-focus);
      background: var(--bg-surface);
      box-shadow: 0 0 0 3px var(--brand-red-glow);
    }
    .clear-btn {
      position: absolute;
      right: 0.75rem;
      color: var(--text-muted);
      font-size: 0.875rem;
      padding: 0.25rem;
    }
    .toolbar-controls {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .stock-toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
    }
    .stock-toggle input {
      accent-color: var(--brand-red);
      width: 16px;
      height: 16px;
    }
    .sort-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .sort-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      font-weight: 500;
    }
    .sort-select {
      padding: 0.5rem 2rem 0.5rem 0.85rem;
      font-size: 0.875rem;
      border-radius: var(--radius-md);
      background-color: var(--bg-surface-soft);
      cursor: pointer;
    }

    /* Category Chips */
    .category-chips-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      scrollbar-width: thin;
    }
    .chip-btn {
      padding: 0.5rem 1.25rem;
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 600;
      background: var(--bg-surface);
      border: 1.5px solid var(--border-subtle);
      color: var(--text-secondary);
      white-space: nowrap;
      transition: all var(--transition-fast);
    }
    .chip-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-primary);
    }
    .chip-btn.active {
      background: var(--brand-red);
      color: #FFFFFF;
      border-color: var(--brand-red);
      box-shadow: 0 4px 10px var(--brand-red-glow);
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.75rem;
    }

    /* Empty state */
    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .empty-icon {
      font-size: 3rem;
    }
    .empty-state h3 {
      font-size: 1.35rem;
    }
    .empty-state p {
      max-width: 400px;
      margin-bottom: 0.5rem;
    }

    @media (max-width: 768px) {
      .shop-toolbar {
        flex-direction: column;
        align-items: stretch;
      }
      .toolbar-controls {
        justify-content: space-between;
      }
    }
  `]
})
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  searchQuery = '';
  selectedCategory = '';
  inStockOnly = false;
  sortBy = 'newest';

  ngOnInit(): void {
    // Load categories first
    this.productService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    // Listen to query param changes
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.selectedCategory = params['category'] || '';
      this.inStockOnly = params['in_stock'] === 'true';
      this.sortBy = params['sort'] || 'newest';
      this.fetchProducts();
    });
  }

  selectedCategoryName(): string | null {
    if (!this.selectedCategory) return null;
    const cat = this.categories().find(c => c.slug === this.selectedCategory);
    return cat ? cat.name : null;
  }

  fetchProducts(): void {
    this.loading.set(true);
    this.productService.getProducts({
      category: this.selectedCategory,
      search: this.searchQuery,
      in_stock: this.inStockOnly,
      sort: this.sortBy
    }).subscribe({
      next: prods => {
        this.products.set(prods);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectCategory(slug: string): void {
    this.selectedCategory = slug;
    this.updateRoute();
  }

  onFilterChange(): void {
    this.updateRoute();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.updateRoute();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.inStockOnly = false;
    this.sortBy = 'newest';
    this.updateRoute();
  }

  private updateRoute(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategory || null,
        search: this.searchQuery || null,
        in_stock: this.inStockOnly ? 'true' : null,
        sort: this.sortBy !== 'newest' ? this.sortBy : null
      },
      queryParamsHandling: 'merge'
    });
  }
}
