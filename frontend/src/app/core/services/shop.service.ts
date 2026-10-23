import { Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, from, map, of, switchMap } from 'rxjs';
import { Shop } from '../models/shop.model';
import { requireSupabaseClient, supabaseClient } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private defaultShop: Shop = {
    name: 'Shaddas',
    description: 'Discover luxury and everyday essentials curated for Ghana. Place orders directly via WhatsApp.',
    whatsapp_number: '+233 53 558 9099',
    phone: '+233 53 558 9099',
    email: 'contact@shadas.com',
    location: 'East Legon, Accra - Ghana',
    instagram: '@shadas_official',
    facebook: 'shadas.store',
    currency: 'GH₵',
    currency_code: 'GHS'
  };

  shopInfo = signal<Shop>(this.defaultShop);
  loading = signal<boolean>(false);

  constructor() {
    this.fetchPublicShopInfo().subscribe();
  }

  fetchPublicShopInfo(): Observable<Shop> {
    this.loading.set(true);

    if (supabaseClient) {
      return from(supabaseClient.from('shops').select('*').limit(1).maybeSingle()).pipe(
        map(({ data, error }) => {
          if (error) {
            throw error;
          }
          return { ...this.defaultShop, ...(data ?? {}) } as Shop;
        }),
        tap(shop => {
          this.shopInfo.set(shop);
          this.loading.set(false);
        }),
        catchError(err => {
          console.warn('Using default shop settings as fallback', err);
          this.loading.set(false);
          return of(this.defaultShop);
        })
      );
    }

    this.loading.set(false);
    return of(this.defaultShop);
  }

  getOwnerShop(): Observable<Shop> {
    return from(requireSupabaseClient().from('shops').select('*').limit(1).maybeSingle()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        if (!data) throw new Error('The Shaddas shop record has not been initialized.');
        return { ...this.defaultShop, ...data } as Shop;
      })
    );
  }

  updateOwnerShop(data: Partial<Shop>): Observable<Shop> {
    const supabase = requireSupabaseClient();
    return from(supabase.from('shops').select('id').limit(1).single()).pipe(
      switchMap(({ data: shop, error }) => {
        if (error) throw error;
        return from(supabase.from('shops').update(data).eq('id', shop.id).select('*').single());
      }),
      map(({ data, error }) => {
        if (error) throw error;
        const updated = { ...this.defaultShop, ...(data ?? {}) } as Shop;
        this.shopInfo.set(updated);
        return updated;
      })
    );
  }
}
