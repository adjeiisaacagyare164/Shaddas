import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';
import type { Session } from '@supabase/supabase-js';
import { User, AuthResponse } from '../models/user.model';
import { supabaseClient } from '../config/supabase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  readonly ready: Promise<void>;

  constructor() {
    if (!supabaseClient) {
      this.ready = Promise.resolve();
      return;
    }

    this.ready = supabaseClient.auth.getSession().then(async ({ data, error }) => {
      if (error) {
        throw error;
      }
      await this.setOwnerFromSession(data.session);
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
      queueMicrotask(() => void this.setOwnerFromSession(session));
    });
  }

  private async setOwnerFromSession(session: Session | null): Promise<void> {
    if (!session?.user || !supabaseClient) {
      this.currentUser.set(null);
      return;
    }

    const { data, error } = await supabaseClient.from('shops').select('owner_id').limit(1).maybeSingle();
    if (error || data?.owner_id !== session.user.id) {
      this.currentUser.set(null);
      return;
    }

    this.currentUser.set({
      id: session.user.id,
      email: session.user.email ?? '',
      name: (session.user.user_metadata?.['name'] as string | undefined) ?? session.user.email?.split('@')[0] ?? 'Shop Owner',
      role: 'owner',
      is_active: true,
      created_at: session.user.created_at ?? new Date().toISOString()
    });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    if (!supabaseClient) {
      return from(Promise.reject(new Error('Supabase is not configured.')));
    }

    return from((async () => {
      const { data, error } = await supabaseClient.auth.signInWithPassword(credentials);
      if (error) {
        throw error;
      }

      await this.setOwnerFromSession(data.session);
      if (!this.currentUser()) {
        await supabaseClient.auth.signOut();
        throw new Error('This account is not configured as the Shaddas owner.');
      }

      return {
        user: this.currentUser()!,
        tokens: {
          access: data.session?.access_token ?? '',
          refresh: data.session?.refresh_token ?? ''
        }
      };
    })());
  }

  sendPasswordReset(email: string): Observable<void> {
    if (!supabaseClient) {
      return from(Promise.reject(new Error('Supabase is not configured.')));
    }

    return from(supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/owner/login`
    }).then(({ error }) => {
      if (error) throw error;
    }));
  }

  logout(): void {
    if (supabaseClient) void supabaseClient.auth.signOut();
    this.currentUser.set(null);
    this.router.navigate(['/owner/login']);
  }
}
