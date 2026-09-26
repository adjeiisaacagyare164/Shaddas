import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Shop } from '../models/shop.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private http = inject(HttpClient);
  private readonly API_URL = `${API_BASE_URL}/shop`;

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
    this.fetchPublicShopInfo();
  }

  fetchPublicShopInfo(): Observable<Shop> {
    this.loading.set(true);
    return this.http.get<Shop>(`${this.API_URL}/info/`).pipe(
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

  getOwnerShop(): Observable<Shop> {
    return this.http.get<Shop>(`${this.API_URL}/manage/`);
  }

  updateOwnerShop(data: Partial<Shop>): Observable<Shop> {
    return this.http.patch<Shop>(`${this.API_URL}/manage/`, data).pipe(
      tap(updated => {
        this.shopInfo.set(updated);
      })
    );
  }
}
