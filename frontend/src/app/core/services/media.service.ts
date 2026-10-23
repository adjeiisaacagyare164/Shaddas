import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { requireSupabaseClient } from '../config/supabase.config';

const MEDIA_BUCKET = 'shaddas-media';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

@Injectable({ providedIn: 'root' })
export class MediaService {
  uploadProductImages(files: File[]): Observable<string[]> {
    return from((async () => {
      const supabase = requireSupabaseClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Sign in as the shop owner before uploading images.');
      }

      return Promise.all(files.map(async file => {
        if (!ALLOWED_IMAGE_TYPES.has(file.type) || file.size > MAX_IMAGE_SIZE) {
          throw new Error('Images must be JPEG, PNG, WebP, or AVIF and no larger than 10 MB.');
        }

        const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
        const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });
        if (error) throw error;

        return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
      }));
    })());
  }
}
