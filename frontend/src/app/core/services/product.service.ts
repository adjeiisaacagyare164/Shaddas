import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';
import { Category } from '../models/category.model';
import { API_BASE_URL } from '../config/api.config';

export interface DashboardStatsResponse {
  stats: {
    total_products: number;
    published_products: number;
    hidden_products: number;
    draft_products: number;
    total_categories: number;
  };
  recent_products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly API_URL = `${API_BASE_URL}/products`;

  // Public Methods
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/public/categories/`);
  }

  getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    in_stock?: boolean;
    sort?: string;
    limit?: number;
  }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.featured) httpParams = httpParams.set('featured', 'true');
    if (params?.in_stock) httpParams = httpParams.set('in_stock', 'true');
    if (params?.sort) httpParams = httpParams.set('sort', params.sort);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());

    return this.http.get<Product[]>(`${this.API_URL}/public/products/`, { params: httpParams });
  }

  getProductDetail(idOrSlug: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/public/products/${idOrSlug}/`);
  }

  // Owner Methods
  getOwnerDashboardStats(): Observable<DashboardStatsResponse> {
    return this.http.get<DashboardStatsResponse>(`${this.API_URL}/owner/dashboard/stats/`);
  }

  getOwnerProducts(params?: { status?: string; category?: string; search?: string }): Observable<Product[]> {
    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.category) httpParams = httpParams.set('category', params.category);
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<Product[]>(`${this.API_URL}/owner/products/`, { params: httpParams });
  }

  getOwnerProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/owner/products/${id}/`);
  }

  createProduct(data: ProductFormData): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/owner/products/`, data);
  }

  updateProduct(id: string, data: Partial<ProductFormData>): Observable<Product> {
    return this.http.patch<Product>(`${this.API_URL}/owner/products/${id}/`, data);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/owner/products/${id}/`);
  }

  // Owner Category Methods
  getOwnerCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/owner/categories/`);
  }

  getOwnerCategoryDetail(id: string): Observable<Category & { products: Product[] }> {
    return this.http.get<Category & { products: Product[] }>(`${this.API_URL}/owner/categories/${id}/`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/owner/categories/`, data);
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.API_URL}/owner/categories/${id}/`, data);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/owner/categories/${id}/`);
  }
}
