import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Product, ProductFormData } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { CurrencyGhsPipe } from '../../../shared/pipes/currency-ghs.pipe';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-owner-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyGhsPipe, LoadingSpinnerComponent, ConfirmModalComponent],
  template: `
    <div class="owner-products-page animate-fade-in">
      
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <span class="badge badge-cream">Inventory Control</span>
          <h1 class="page-title">Product Management</h1>
          <p class="page-subtitle">Add, edit, publish, or hide products. Published items appear on the public site immediately.</p>
        </div>

        <button type="button" class="btn btn-primary" (click)="openAddModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add New Product</span>
        </button>
      </div>

      <!-- FILTER & SEARCH TOOLBAR -->
      <div class="card toolbar-card">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onFilterChange()"
            placeholder="Search by product name or details..." 
            class="search-input"
          >
        </div>

        <div class="filters-group">
          <!-- Status Filter -->
          <div class="filter-item">
            <span class="filter-label">Status:</span>
            <select [(ngModel)]="statusFilter" (change)="onFilterChange()" class="form-select">
              <option value="all">All Statuses</option>
              <option value="published">Published (Live)</option>
              <option value="hidden">Hidden</option>
              <option value="draft">Drafts</option>
            </select>
          </div>

          <!-- Category Filter -->
          <div class="filter-item">
            <span class="filter-label">Category:</span>
            <select [(ngModel)]="categoryFilter" (change)="onFilterChange()" class="form-select">
              <option value="all">All Categories</option>
              <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- LOADING STATE -->
      <app-loading-spinner *ngIf="loading()" [size]="44" message="Loading product catalog..."></app-loading-spinner>

      <!-- PRODUCTS TABLE -->
      <div class="card products-card" *ngIf="!loading()">
        
        <div class="table-responsive" *ngIf="products().length > 0">
          <table class="owner-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Featured</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products()">
                
                <!-- Image & Name -->
                <td>
                  <div class="product-cell">
                    <img 
                      [src]="p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80'" 
                      [alt]="p.name"
                      class="product-thumb"
                    >
                    <div class="product-info-text">
                      <strong class="p-name">{{ p.name }}</strong>
                      <span class="p-images-count" *ngIf="p.images?.length">{{ p.images.length }} {{ p.images.length === 1 ? 'image' : 'images' }}</span>
                    </div>
                  </div>
                </td>

                <!-- Price -->
                <td>
                  <span class="price-tag">{{ p.price | currencyGhs }}</span>
                </td>

                <!-- Category -->
                <td>
                  <span class="badge badge-cream">{{ p.category_name || 'Unassigned' }}</span>
                </td>

                <!-- Stock Availability -->
                <td>
                  <button 
                    type="button" 
                    class="badge badge-interactive" 
                    [ngClass]="p.availability ? 'badge-success' : 'badge-danger'"
                    (click)="toggleAvailability(p)"
                    title="Click to toggle stock status"
                  >
                    {{ p.availability ? 'In Stock' : 'Out of Stock' }}
                  </button>
                </td>

                <!-- Status (Published/Hidden/Draft) -->
                <td>
                  <button 
                    type="button" 
                    class="badge badge-interactive"
                    [ngClass]="p.status === 'published' ? 'badge-red' : (p.status === 'hidden' ? 'badge-danger' : 'badge-cream')"
                    (click)="toggleStatus(p)"
                    title="Click to toggle Published / Hidden"
                  >
                    {{ p.status | titlecase }}
                  </button>
                </td>

                <!-- Featured -->
                <td>
                  <span *ngIf="p.is_featured" class="badge badge-red">★ Featured</span>
                  <span *ngIf="!p.is_featured" class="text-muted text-sm">—</span>
                </td>

                <!-- Actions -->
                <td class="text-right">
                  <div class="action-btn-group">
                    <button 
                      type="button" 
                      class="btn btn-secondary btn-sm"
                      (click)="openEditModal(p)"
                      title="Edit Product"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      <span>Edit</span>
                    </button>

                    <button 
                      type="button" 
                      class="btn btn-secondary btn-sm"
                      (click)="toggleStatus(p)"
                      [title]="p.status === 'published' ? 'Hide from public store' : 'Publish to live store'"
                    >
                      <span>{{ p.status === 'published' ? 'Hide' : 'Publish' }}</span>
                    </button>

                    <button 
                      type="button" 
                      class="btn btn-secondary btn-sm btn-delete"
                      (click)="promptDelete(p)"
                      title="Delete Product"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty Products List -->
        <div class="empty-state" *ngIf="products().length === 0">
          <div class="empty-icon">📦</div>
          <h3>No products match your filter</h3>
          <p>Try clearing your search query or creating a new product.</p>
          <button type="button" class="btn btn-primary btn-sm" (click)="openAddModal()">
            Create New Product
          </button>
        </div>

      </div>

      <!-- PRODUCT ADD / EDIT MODAL -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()">
        <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
          
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Edit Product' : 'Add New Product' }}</h3>
            <button type="button" class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form (submit)="onSaveProduct($event)" class="product-form">
            <div class="form-grid-2">
              
              <!-- Product Name -->
              <div class="form-group col-span-2">
                <label class="form-label" for="prodName">Product Name *</label>
                <input 
                  type="text" 
                  id="prodName"
                  [(ngModel)]="formData.name" 
                  name="prodName"
                  placeholder="e.g. Shadas Italian Leather Loafers" 
                  class="form-input"
                  required
                >
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="form-label" for="prodCategory">Category *</label>
                <select 
                  id="prodCategory"
                  [(ngModel)]="formData.category" 
                  name="prodCategory"
                  class="form-select"
                  required
                >
                  <option value="" disabled>Select category...</option>
                  <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
                </select>
              </div>

              <!-- Price (GH₵) -->
              <div class="form-group">
                <label class="form-label" for="prodPrice">Price in Ghana Cedis (GH₵) *</label>
                <input 
                  type="number" 
                  id="prodPrice"
                  [(ngModel)]="formData.price" 
                  name="prodPrice"
                  placeholder="e.g. 450.00" 
                  step="0.01"
                  min="0"
                  class="form-input"
                  required
                >
              </div>

              <!-- Description -->
              <div class="form-group col-span-2">
                <label class="form-label" for="prodDesc">Product Description *</label>
                <textarea 
                  id="prodDesc"
                  [(ngModel)]="formData.description" 
                  name="prodDesc"
                  placeholder="Describe material, styling notes, sizing recommendations, and details..." 
                  class="form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>

              <!-- Image URLs (Comma separated or multi-line) -->
              <div class="form-group col-span-2">
                <label class="form-label" for="prodImages">
                  Product Image URLs (One URL per line or comma-separated)
                </label>
                <textarea 
                  id="prodImages"
                  [(ngModel)]="imagesRawInput" 
                  name="prodImages"
                  placeholder="https://images.unsplash.com/...&#10;https://..." 
                  class="form-textarea"
                  rows="3"
                ></textarea>
                <span class="form-hint">Paste high-quality product photo links. First image will be used as the primary display photo.</span>
              </div>

              <!-- Stock & Featured Toggles -->
              <div class="form-group">
                <label class="form-label">Availability / Stock Status</label>
                <div class="toggle-switch-row">
                  <label class="switch-label">
                    <input type="checkbox" [(ngModel)]="formData.availability" name="prodAvailability">
                    <span>{{ formData.availability ? 'In Stock (Available for order)' : 'Out of Stock' }}</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Featured Spotlight</label>
                <div class="toggle-switch-row">
                  <label class="switch-label">
                    <input type="checkbox" [(ngModel)]="formData.is_featured" name="prodFeatured">
                    <span>Show on Homepage Featured Section</span>
                  </label>
                </div>
              </div>

              <!-- Publish Status -->
              <div class="form-group col-span-2">
                <label class="form-label">Publishing Status</label>
                <div class="radio-status-group">
                  <label class="radio-card" [class.selected]="formData.status === 'published'">
                    <input type="radio" value="published" [(ngModel)]="formData.status" name="prodStatus">
                    <div>
                      <strong>Published (Live)</strong>
                      <span>Visible immediately to customers on the public store.</span>
                    </div>
                  </label>

                  <label class="radio-card" [class.selected]="formData.status === 'draft'">
                    <input type="radio" value="draft" [(ngModel)]="formData.status" name="prodStatus">
                    <div>
                      <strong>Draft</strong>
                      <span>Save as a work-in-progress draft. Not visible publicly.</span>
                    </div>
                  </label>

                  <label class="radio-card" [class.selected]="formData.status === 'hidden'">
                    <input type="radio" value="hidden" [(ngModel)]="formData.status" name="prodStatus">
                    <div>
                      <strong>Hidden</strong>
                      <span>Temporarily hide from store without deleting.</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <!-- Modal Footer Actions -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">
                Cancel
              </button>

              <button 
                type="button" 
                class="btn btn-secondary" 
                (click)="saveAsDraft()"
                *ngIf="!isEditMode || formData.status !== 'draft'"
              >
                Save Draft
              </button>

              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="savingProduct()"
              >
                {{ savingProduct() ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Publish Product') }}
              </button>
            </div>
          </form>

        </div>
      </div>

      <!-- DELETE CONFIRMATION MODAL -->
      <app-confirm-modal
        [isOpen]="showDeleteConfirm"
        title="Delete Product?"
        [message]="'Are you sure you want to delete &quot;' + (productToDelete?.name || '') + '&quot;? This will permanently remove it from the public catalog.'"
        confirmText="Delete Product"
        cancelText="Keep Product"
        [isDestructive]="true"
        (confirmed)="onDeleteConfirmed()"
        (cancelled)="showDeleteConfirm = false"
      ></app-confirm-modal>

    </div>
  `,
  styles: [`
    .owner-products-page {
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

    /* Toolbar */
    .toolbar-card {
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .search-box {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 260px;
    }
    .search-box svg {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 0.65rem 1rem 0.65rem 2.75rem;
      background: var(--bg-surface-soft);
      border: 1.5px solid var(--border-subtle);
      border-radius: var(--radius-md);
      font-size: 0.9375rem;
    }
    .filters-group {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }
    .filter-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .filter-label {
      font-size: 0.8125rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Table */
    .products-card {
      padding: 1rem;
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
      padding: 0.875rem 1rem;
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
    .product-cell {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .product-thumb {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      background: var(--bg-surface-soft);
    }
    .product-info-text {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .p-name {
      font-size: 0.9375rem;
      line-height: 1.3;
    }
    .p-images-count {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .badge-interactive {
      cursor: pointer;
      user-select: none;
      transition: transform 0.15s;
    }
    .badge-interactive:hover {
      transform: scale(1.05);
    }
    .action-btn-group {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.4rem;
    }
    .btn-delete:hover {
      color: var(--danger);
      background: var(--danger-bg);
      border-color: var(--danger);
    }
    .text-right { text-align: right; }
    .text-muted { color: var(--text-muted); }
    .text-sm { font-size: 0.8125rem; }

    /* Modal Backdrop & Card */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      max-width: 720px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-xl);
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-close {
      font-size: 1.25rem;
      color: var(--text-muted);
      padding: 0.25rem;
    }
    .modal-close:hover { color: var(--text-primary); }
    .product-form {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    .col-span-2 { grid-column: span 2; }
    .form-hint {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .toggle-switch-row {
      padding: 0.5rem 0;
    }
    .switch-label {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }
    .switch-label input {
      accent-color: var(--brand-red);
      width: 18px;
      height: 18px;
    }
    .radio-status-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .radio-card {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border: 1.5px solid var(--border-subtle);
      border-radius: var(--radius-md);
      background: var(--bg-surface-soft);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .radio-card.selected {
      border-color: var(--brand-red);
      background: var(--bg-surface);
      box-shadow: 0 0 0 2px var(--brand-red-glow);
    }
    .radio-card input {
      accent-color: var(--brand-red);
      margin-top: 0.2rem;
    }
    .radio-card div {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .radio-card strong {
      font-size: 0.875rem;
    }
    .radio-card span {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.3;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }

    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .empty-icon { font-size: 3rem; }

    @media (max-width: 768px) {
      .form-grid-2, .radio-status-group {
        grid-template-columns: 1fr;
      }
      .col-span-2 {
        grid-column: span 1;
      }
    }
  `]
})
export class OwnerProductsComponent implements OnInit {
  private productService = inject(ProductService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  savingProduct = signal(false);

  searchQuery = '';
  statusFilter = 'all';
  categoryFilter = 'all';

  showModal = false;
  isEditMode = false;
  editProductId: string | null = null;
  imagesRawInput = '';

  formData: ProductFormData = {
    name: '',
    category: '',
    price: 0,
    description: '',
    images: [],
    availability: true,
    status: 'published',
    is_featured: false
  };

  showDeleteConfirm = false;
  productToDelete: Product | null = null;

  ngOnInit(): void {
    this.productService.getOwnerCategories().subscribe(cats => {
      this.categories.set(cats);
    });

    this.fetchProducts();

    // Check query params for action=new or edit=ID
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        this.openAddModal();
      } else if (params['edit']) {
        this.loadProductToEdit(params['edit']);
      }
    });
  }

  fetchProducts(): void {
    this.loading.set(true);
    this.productService.getOwnerProducts({
      search: this.searchQuery,
      status: this.statusFilter,
      category: this.categoryFilter
    }).subscribe({
      next: prods => {
        this.products.set(prods);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange(): void {
    this.fetchProducts();
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editProductId = null;
    this.formData = {
      name: '',
      category: this.categories().length > 0 ? this.categories()[0].id : '',
      price: 0,
      description: '',
      images: [],
      availability: true,
      status: 'published',
      is_featured: false
    };
    this.imagesRawInput = '';
    this.showModal = true;
  }

  openEditModal(p: Product): void {
    this.isEditMode = true;
    this.editProductId = p.id;
    this.formData = {
      name: p.name,
      category: p.category || '',
      price: Number(p.price),
      description: p.description,
      images: p.images || [],
      availability: p.availability,
      status: p.status,
      is_featured: !!p.is_featured
    };
    this.imagesRawInput = (p.images || []).join('\n');
    this.showModal = true;
  }

  loadProductToEdit(id: string): void {
    this.productService.getOwnerProduct(id).subscribe({
      next: prod => this.openEditModal(prod)
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { action: null, edit: null },
      queryParamsHandling: 'merge'
    });
  }

  saveAsDraft(): void {
    this.formData.status = 'draft';
    this.onSaveProduct();
  }

  onSaveProduct(event?: Event): void {
    if (event) event.preventDefault();

    if (!this.formData.name.trim()) {
      this.toast.error('Please enter a product name.');
      return;
    }

    if (this.formData.price <= 0) {
      this.toast.error('Please enter a valid price in Ghana Cedis.');
      return;
    }

    // Process images
    const urls = this.imagesRawInput
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.length > 0);
    this.formData.images = urls;

    this.savingProduct.set(true);

    if (this.isEditMode && this.editProductId) {
      this.productService.updateProduct(this.editProductId, this.formData).subscribe({
        next: () => {
          this.savingProduct.set(false);
          this.toast.success(`Updated "${this.formData.name}" successfully!`);
          this.closeModal();
          this.fetchProducts();
        },
        error: err => {
          this.savingProduct.set(false);
          this.toast.error('Failed to update product. Please check input values.');
        }
      });
    } else {
      this.productService.createProduct(this.formData).subscribe({
        next: () => {
          this.savingProduct.set(false);
          this.toast.success(`Created "${this.formData.name}" successfully!`);
          this.closeModal();
          this.fetchProducts();
        },
        error: err => {
          this.savingProduct.set(false);
          this.toast.error('Failed to create product. Please check input values.');
        }
      });
    }
  }

  toggleStatus(p: Product): void {
    const nextStatus = p.status === 'published' ? 'hidden' : 'published';
    this.productService.updateProduct(p.id, { status: nextStatus }).subscribe({
      next: () => {
        this.toast.success(`Product "${p.name}" is now ${nextStatus === 'published' ? 'live on public store' : 'hidden'}.`);
        this.fetchProducts();
      }
    });
  }

  toggleAvailability(p: Product): void {
    const nextAvail = !p.availability;
    this.productService.updateProduct(p.id, { availability: nextAvail }).subscribe({
      next: () => {
        this.toast.info(`Stock status for "${p.name}" updated to ${nextAvail ? 'In Stock' : 'Out of Stock'}.`);
        this.fetchProducts();
      }
    });
  }

  promptDelete(p: Product): void {
    this.productToDelete = p;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirmed(): void {
    if (!this.productToDelete) return;
    const id = this.productToDelete.id;
    const name = this.productToDelete.name;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.toast.success(`Deleted product "${name}".`);
        this.fetchProducts();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.toast.error('Failed to delete product.');
      }
    });
  }
}
