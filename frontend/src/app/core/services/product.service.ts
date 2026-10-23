import { Injectable } from '@angular/core';
import { Observable, from, map } from 'rxjs';
import { Product, ProductFormData } from '../models/product.model';
import { Category } from '../models/category.model';
import { requireSupabaseClient } from '../config/supabase.config';

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
  private get supabase() {
    return requireSupabaseClient();
  }

  private normalizeProduct(product: any): Product {
    return {
      ...product,
      price: Number(product.price ?? 0),
      images: Array.isArray(product.images) ? product.images : [],
      availability: !!product.availability,
      status: product.status ?? 'published',
      category: product.category_id ?? product.category,
      category_name: product.categories?.name ?? product.category_name,
      category_slug: product.categories?.slug ?? product.category_slug,
      id: product.id ?? product.slug ?? `${Date.now()}`
    } as Product;
  }

  // Public Methods
  getCategories(): Observable<Category[]> {
    return from(this.supabase.from('categories').select('*').order('name')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Category[];
      })
    );
  }

  getProducts(params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    in_stock?: boolean;
    sort?: string;
    limit?: number;
  }): Observable<Product[]> {
    const categoryJoin = params?.category ? '!inner' : '';
    let query = this.supabase.from('products')
      .select(`*, categories:categories${categoryJoin} (id, name, slug)`)
      .eq('status', 'published');
    if (params?.category) query = query.eq('categories.slug', params.category);
    if (params?.search) {
      const term = params.search.replace(/[,%()]/g, ' ').trim();
      if (term) query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (params?.featured) query = query.eq('is_featured', true);
    if (params?.in_stock) query = query.eq('availability', true);
    if (params?.sort === 'price_asc') query = query.order('price', { ascending: true });
    else if (params?.sort === 'price_desc') query = query.order('price', { ascending: false });
    else if (params?.sort === 'name_asc') query = query.order('name', { ascending: true });
    else query = query.order('created_at', { ascending: false });
    if (params?.limit) query = query.limit(params.limit);

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map((item: any) => this.normalizeProduct(item));
      })
    );
  }

  getProductDetail(idOrSlug: string): Observable<Product> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
    const column = isUuid ? 'id' : 'slug';
    return from(this.supabase.from('products')
      .select('*, categories:categories (id, name, slug)')
      .eq(column, idOrSlug)
      .eq('status', 'published')
      .maybeSingle()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('Product not found.');
        return this.normalizeProduct(data);
      })
    );
  }

  // Owner Methods
  getOwnerDashboardStats(): Observable<DashboardStatsResponse> {
    return from(Promise.all([
      this.supabase.from('products').select('id', { count: 'exact', head: true }),
      this.supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      this.supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'hidden'),
      this.supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      this.supabase.from('categories').select('id', { count: 'exact', head: true }),
      this.supabase.from('products').select('*, categories:categories (id, name, slug)').order('created_at', { ascending: false }).limit(5)
    ])).pipe(
      map(([total, published, hidden, draft, categories, recent]) => {
        const error = total.error ?? published.error ?? hidden.error ?? draft.error ?? categories.error ?? recent.error;
        if (error) throw error;
        return {
          stats: {
            total_products: total.count ?? 0,
            published_products: published.count ?? 0,
            hidden_products: hidden.count ?? 0,
            draft_products: draft.count ?? 0,
            total_categories: categories.count ?? 0
          },
          recent_products: (recent.data ?? []).map((item: any) => this.normalizeProduct(item))
        };
      })
    );
  }

  getOwnerProducts(params?: { status?: string; category?: string; search?: string }): Observable<Product[]> {
    let query = this.supabase.from('products').select('*, categories:categories (id, name, slug)');
    if (params?.status && params.status !== 'all') query = query.eq('status', params.status);
    if (params?.category && params.category !== 'all') query = query.eq('category_id', params.category);
    if (params?.search) query = query.ilike('name', `%${params.search}%`);

    return from(query.order('created_at', { ascending: false })).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []).map((product: any) => this.normalizeProduct(product));
      })
    );
  }

  getOwnerProduct(id: string): Observable<Product> {
    return from(this.supabase.from('products').select('*, categories:categories (id, name, slug)').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return this.normalizeProduct(data ?? {});
      })
    );
  }

  createProduct(data: ProductFormData): Observable<Product> {
    return from(this.supabase.from('products').insert({
        name: data.name,
        category_id: data.category || null,
        description: data.description,
        price: data.price,
        images: data.images,
        availability: data.availability,
        status: data.status,
        is_featured: data.is_featured
      }).select('*').single()).pipe(
      map(({ data: product, error }) => {
        if (error) throw error;
        return this.normalizeProduct(product ?? {});
      })
    );
  }

  updateProduct(id: string, data: Partial<ProductFormData>): Observable<Product> {
    const { category, ...fields } = data;
    return from(this.supabase.from('products').update({
      ...fields,
      ...(category !== undefined ? { category_id: category || null } : {})
    }).eq('id', id).select('*').single()).pipe(
      map(({ data: product, error }) => {
        if (error) throw error;
        return this.normalizeProduct(product ?? {});
      })
    );
  }

  deleteProduct(id: string): Observable<void> {
    return from(this.supabase.from('products').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }

  // Owner Category Methods
  getOwnerCategories(): Observable<Category[]> {
    return from(this.supabase.from('categories').select('*').order('name')).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return (data ?? []) as Category[];
      })
    );
  }

  getOwnerCategoryDetail(id: string): Observable<Category & { products: Product[] }> {
    return from(this.supabase.from('categories').select('*, products:products(*)').eq('id', id).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return {
          ...(data ?? {}),
          products: ((data as any)?.products ?? []).map((item: any) => this.normalizeProduct(item))
        } as Category & { products: Product[] };
      })
    );
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return from(this.supabase.from('categories').insert({
        name: data.name,
        slug: data.slug,
        image: data.image ?? '',
        description: data.description ?? ''
      }).select('*').single()).pipe(
      map(({ data: category, error }) => {
        if (error) throw error;
        return category as Category;
      })
    );
  }

  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return from(this.supabase.from('categories').update(data).eq('id', id).select('*').single()).pipe(
      map(({ data: category, error }) => {
        if (error) throw error;
        return category as Category;
      })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return from(this.supabase.from('categories').delete().eq('id', id)).pipe(
      map(({ error }) => {
        if (error) throw error;
      })
    );
  }
}
