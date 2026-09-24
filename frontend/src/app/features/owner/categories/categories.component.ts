import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category } from '../../../core/models/category.model';
import { Product } from '../../../core/models/product.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-owner-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent, ConfirmModalComponent],
  template: `
    <div class="owner-categories-page animate-fade-in">
      
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <span class="badge badge-cream">Taxonomy</span>
          <h1 class="page-title">Category Management</h1>
          <p class="page-subtitle">Organize your store collections. Categories are used across public filter bars and home spotlights.</p>
        </div>

        <button type="button" class="btn btn-primary" (click)="openAddModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>Add New Category</span>
        </button>
      </div>

      <!-- LOADING -->
      <app-loading-spinner *ngIf="loading()" [size]="44" message="Loading categories..."></app-loading-spinner>

      <!-- CATEGORIES GRID -->
      <div class="categories-grid" *ngIf="!loading()">
        
        <div class="card category-admin-card" *ngFor="let cat of categories()">
          
          <div class="cat-img-box">
            <img 
              [src]="cat.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'" 
              [alt]="cat.name"
            >
            <span class="count-pill">
              {{ cat.product_count || 0 }} {{ cat.product_count === 1 ? 'Product' : 'Products' }}
            </span>
          </div>

          <div class="cat-body">
            <h3 class="cat-name">{{ cat.name }}</h3>
            <span class="cat-slug">/shop?category={{ cat.slug }}</span>
            <p class="cat-desc">{{ cat.description || 'No description provided.' }}</p>

            <div class="cat-actions">
              <button 
                type="button" 
                class="btn btn-secondary btn-sm"
                (click)="viewCategoryProducts(cat)"
              >
                <span>View Products</span>
              </button>

              <button 
                type="button" 
                class="btn btn-secondary btn-sm"
                (click)="openEditModal(cat)"
              >
                <span>Edit</span>
              </button>

              <button 
                type="button" 
                class="btn btn-secondary btn-sm btn-delete"
                (click)="promptDelete(cat)"
                title="Delete Category"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- VIEW CATEGORY PRODUCTS DRAWER / MODAL -->
      <div class="modal-backdrop" *ngIf="selectedCatForProducts" (click)="selectedCatForProducts = null">
        <div class="modal-card modal-lg" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Products in &quot;{{ selectedCatForProducts.name }}&quot;</h3>
            <button type="button" class="modal-close" (click)="selectedCatForProducts = null">✕</button>
          </div>
          
          <div class="category-products-list">
            <app-loading-spinner *ngIf="loadingCatProducts" [size]="32" message="Loading products..."></app-loading-spinner>
            
            <div *ngIf="!loadingCatProducts && catProducts.length > 0" class="mini-products-grid">
              <div class="mini-product-item card" *ngFor="let p of catProducts">
                <img [src]="p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80'" [alt]="p.name">
                <div class="mini-details">
                  <strong>{{ p.name }}</strong>
                  <span class="price-tag">GH₵ {{ p.price }}</span>
                  <span class="badge" [ngClass]="p.status === 'published' ? 'badge-red' : 'badge-cream'">{{ p.status }}</span>
                </div>
              </div>
            </div>

            <div *ngIf="!loadingCatProducts && catProducts.length === 0" class="empty-state">
              <p>No products assigned to this category yet.</p>
              <a routerLink="/owner/products" [queryParams]="{action: 'new'}" (click)="selectedCatForProducts = null" class="btn btn-primary btn-sm">Add Product to this Category</a>
            </div>
          </div>
        </div>
      </div>

      <!-- ADD / EDIT CATEGORY MODAL -->
      <div class="modal-backdrop" *ngIf="showModal" (click)="showModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          
          <div class="modal-header">
            <h3>{{ isEditMode ? 'Edit Category' : 'Add New Category' }}</h3>
            <button type="button" class="modal-close" (click)="showModal = false">✕</button>
          </div>

          <form (submit)="onSaveCategory($event)" class="cat-form">
            <div class="form-group">
              <label class="form-label" for="catName">Category Name *</label>
              <input 
                type="text" 
                id="catName"
                [(ngModel)]="formData.name" 
                name="catName"
                placeholder="e.g. Footwear & Sneakers" 
                class="form-input"
                required
              >
            </div>

            <div class="form-group">
              <label class="form-label" for="catImg">Cover Image URL</label>
              <input 
                type="url" 
                id="catImg"
                [(ngModel)]="formData.image" 
                name="catImg"
                placeholder="https://images.unsplash.com/photo-..." 
                class="form-input"
              >
            </div>

            <div class="form-group">
              <label class="form-label" for="catDesc">Description</label>
              <textarea 
                id="catDesc"
                [(ngModel)]="formData.description" 
                name="catDesc"
                placeholder="Brief summary of items in this category..." 
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ isEditMode ? 'Save Changes' : 'Create Category' }}
              </button>
            </div>
          </form>

        </div>
      </div>

      <!-- DELETE CONFIRMATION -->
      <app-confirm-modal
        [isOpen]="showDeleteConfirm"
        title="Delete Category?"
        [message]="'Are you sure you want to delete &quot;' + (catToDelete?.name || '') + '&quot;? Existing products in this category will become unassigned.'"
        confirmText="Delete Category"
        cancelText="Cancel"
        [isDestructive]="true"
        (confirmed)="onDeleteConfirmed()"
        (cancelled)="showDeleteConfirm = false"
      ></app-confirm-modal>

    </div>
  `,
  styles: [`
    .owner-categories-page {
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

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.75rem;
    }
    .category-admin-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .cat-img-box {
      position: relative;
      height: 160px;
      background: var(--bg-surface-soft);
    }
    .cat-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .count-pill {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(0,0,0,0.75);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      backdrop-filter: blur(4px);
    }
    .cat-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.5rem;
    }
    .cat-name {
      font-size: 1.15rem;
    }
    .cat-slug {
      font-size: 0.75rem;
      color: var(--brand-red);
      font-family: monospace;
    }
    .cat-desc {
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 0.75rem;
      flex: 1;
    }
    .cat-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    /* Modals */
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
      max-width: 520px;
      width: 100%;
      box-shadow: var(--shadow-xl);
      max-height: 85vh;
      overflow-y: auto;
    }
    .modal-card.modal-lg {
      max-width: 720px;
    }
    .modal-header {
      padding: 1.5rem 1.75rem;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .modal-close {
      font-size: 1.25rem;
      padding: 0.25rem;
      color: var(--text-muted);
    }
    .cat-form {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 1rem;
    }
    .category-products-list {
      padding: 1.5rem;
    }
    .mini-products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .mini-product-item {
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .mini-product-item img {
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: var(--radius-sm);
    }
    .mini-details {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      font-size: 0.8125rem;
    }
    .btn-delete:hover {
      color: var(--danger);
      background: var(--danger-bg);
    }
  `]
})
export class OwnerCategoriesComponent implements OnInit {
  private productService = inject(ProductService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  loading = signal(true);

  showModal = false;
  isEditMode = false;
  editCategoryId: string | null = null;

  formData: { name: string; image: string; description: string } = {
    name: '',
    image: '',
    description: ''
  };

  selectedCatForProducts: Category | null = null;
  catProducts: Product[] = [];
  loadingCatProducts = false;

  showDeleteConfirm = false;
  catToDelete: Category | null = null;

  ngOnInit(): void {
    this.fetchCategories();
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        this.openAddModal();
      }
    });
  }

  fetchCategories(): void {
    this.loading.set(true);
    this.productService.getOwnerCategories().subscribe({
      next: cats => {
        this.categories.set(cats);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.editCategoryId = null;
    this.formData = { name: '', image: '', description: '' };
    this.showModal = true;
  }

  openEditModal(cat: Category): void {
    this.isEditMode = true;
    this.editCategoryId = cat.id;
    this.formData = {
      name: cat.name,
      image: cat.image || '',
      description: cat.description || ''
    };
    this.showModal = true;
  }

  viewCategoryProducts(cat: Category): void {
    this.selectedCatForProducts = cat;
    this.loadingCatProducts = true;
    this.productService.getOwnerCategoryDetail(cat.id).subscribe({
      next: res => {
        this.catProducts = res.products || [];
        this.loadingCatProducts = false;
      },
      error: () => this.loadingCatProducts = false
    });
  }

  onSaveCategory(event: Event): void {
    event.preventDefault();
    if (!this.formData.name.trim()) {
      this.toast.error('Category name is required.');
      return;
    }

    if (this.isEditMode && this.editCategoryId) {
      this.productService.updateCategory(this.editCategoryId, this.formData).subscribe({
        next: () => {
          this.toast.success(`Updated "${this.formData.name}" successfully!`);
          this.showModal = false;
          this.fetchCategories();
        }
      });
    } else {
      this.productService.createCategory(this.formData).subscribe({
        next: () => {
          this.toast.success(`Created category "${this.formData.name}"!`);
          this.showModal = false;
          this.fetchCategories();
        }
      });
    }
  }

  promptDelete(cat: Category): void {
    this.catToDelete = cat;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirmed(): void {
    if (!this.catToDelete) return;
    const id = this.catToDelete.id;
    const name = this.catToDelete.name;

    this.productService.deleteCategory(id).subscribe({
      next: () => {
        this.showDeleteConfirm = false;
        this.toast.success(`Category "${name}" deleted.`);
        this.fetchCategories();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.toast.error('Failed to delete category.');
      }
    });
  }
}
