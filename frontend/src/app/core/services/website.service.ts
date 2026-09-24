import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { HomepageContent } from '../models/website.model';
import { API_BASE_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  private http = inject(HttpClient);
  private readonly API_URL = `${API_BASE_URL}/website`;

  private defaultContent: HomepageContent = {
    hero_badge: 'New Season Collection 2026',
    hero_title: 'Luxury & Everyday Essentials Curated for Ghana',
    hero_description: 'Experience effortless direct shopping. Browse our curated fashion, luxury bags, and footwear — send your order straight to our WhatsApp in one click.',
    hero_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    hero_button_text: 'Shop New Arrivals',
    about_title: 'Welcome to Shadas',
    about_description: 'At Shadas, we believe shopping should be personal, transparent, and seamless. We hand-select premium items and bring them to your doorstep across Accra and throughout Ghana. When you place an order, you connect directly with us on WhatsApp for fast confirmations and prompt dispatch.',
    about_image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
    about_points: [
      'Direct WhatsApp ordering with the shop owner',
      'Fast and reliable dispatch across all regions of Ghana',
      '100% verified quality and authentic craftsmanship',
      'Flexible customer care and tailored recommendations'
    ]
  };

  homepageContent = signal<HomepageContent>(this.defaultContent);

  constructor() {
    this.fetchPublicHomepage();
  }

  fetchPublicHomepage(): Observable<HomepageContent> {
    return this.http.get<HomepageContent>(`${this.API_URL}/homepage/`).pipe(
      tap(content => this.homepageContent.set(content)),
      catchError(err => {
        console.warn('Fallback homepage CMS content', err);
        return of(this.defaultContent);
      })
    );
  }

  getOwnerHomepage(): Observable<HomepageContent> {
    return this.http.get<HomepageContent>(`${this.API_URL}/manage/homepage/`);
  }

  updateOwnerHomepage(data: Partial<HomepageContent>): Observable<HomepageContent> {
    return this.http.patch<HomepageContent>(`${this.API_URL}/manage/homepage/`, data).pipe(
      tap(updated => this.homepageContent.set(updated))
    );
  }
}
