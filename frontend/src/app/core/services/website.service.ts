import { Injectable, signal } from '@angular/core';
import { Observable, tap, catchError, from, map, of, switchMap } from 'rxjs';
import { HomepageContent } from '../models/website.model';
import { requireSupabaseClient, supabaseClient } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  private defaultContent: HomepageContent = {
    hero_badge: 'New Season Collection 2026',
    hero_title: 'Luxury & Everyday Essentials Curated for Ghana',
    hero_description: 'Experience effortless direct shopping. Browse our curated fashion, luxury bags, and footwear — send your order straight to our WhatsApp in one click.',
    hero_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    hero_button_text: 'Shop New Arrivals',
    about_title: 'Welcome to Shaddas',
    about_description: 'At Shaddas, we believe shopping should be personal, transparent, and seamless. We hand-select premium items and bring them to your doorstep across Accra and throughout Ghana. When you place an order, you connect directly with us on WhatsApp for fast confirmations and prompt dispatch.',
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
    this.fetchPublicHomepage().subscribe();
  }

  fetchPublicHomepage(): Observable<HomepageContent> {
    if (supabaseClient) {
      return from(supabaseClient.from('homepage_content').select('*').limit(1).maybeSingle()).pipe(
        map(({ data, error }) => {
          if (error) {
            throw error;
          }
          const normalized = { ...this.defaultContent, ...(data ?? {}) } as HomepageContent;
          normalized.about_points = Array.isArray(normalized.about_points) ? normalized.about_points : this.defaultContent.about_points;
          return normalized;
        }),
        tap(content => this.homepageContent.set(content)),
        catchError(err => {
          console.warn('Fallback homepage CMS content', err);
          return of(this.defaultContent);
        })
      );
    }

    return of(this.defaultContent);
  }

  getOwnerHomepage(): Observable<HomepageContent> {
    return from(requireSupabaseClient().from('homepage_content').select('*').limit(1).single()).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        const normalized = { ...this.defaultContent, ...(data ?? {}) } as HomepageContent;
        normalized.about_points = Array.isArray(normalized.about_points) ? normalized.about_points : this.defaultContent.about_points;
        return normalized;
      })
    );
  }

  updateOwnerHomepage(data: Partial<HomepageContent>): Observable<HomepageContent> {
    const supabase = requireSupabaseClient();
    return from(supabase.from('homepage_content').select('id').limit(1).single()).pipe(
      switchMap(({ data: content, error }) => {
        if (error) throw error;
        return from(supabase.from('homepage_content').update(data).eq('id', content.id).select('*').single());
      }),
      map(({ data, error }) => {
        if (error) throw error;
        const updated = { ...this.defaultContent, ...(data ?? {}) } as HomepageContent;
        this.homepageContent.set(updated);
        return updated;
      })
    );
  }
}
