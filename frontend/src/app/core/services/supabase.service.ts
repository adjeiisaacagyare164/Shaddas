import { Injectable } from '@angular/core';
import { supabaseClient } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  readonly client = supabaseClient;

  isEnabled(): boolean {
    return !!this.client;
  }

  getSessionToken(): string | null {
    return localStorage.getItem('sb-access-token') || localStorage.getItem('shadas_access_token');
  }
}
