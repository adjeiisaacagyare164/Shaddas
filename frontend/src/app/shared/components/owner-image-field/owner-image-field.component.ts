import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { MediaService } from '../../../core/services/media.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-owner-image-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-field">
      <label class="form-label">{{ label }}</label>
      <div class="image-field-row">
        <div class="image-preview" [class.empty]="!value">
          <img *ngIf="value" [src]="value" [alt]="label + ' preview'" (error)="previewFailed.set(true)" [hidden]="previewFailed()">
          <span *ngIf="!value || previewFailed()">Image preview</span>
        </div>
        <div class="image-field-controls">
          <input type="url" class="form-input" [value]="value" (input)="imageUrlChange.emit(urlValue($event))" placeholder="Paste an image URL">
          <label class="upload-button" [class.disabled]="uploading()">
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml" [disabled]="uploading()" (change)="upload($event)">
            {{ uploading() ? 'Uploading…' : 'Upload image' }}
          </label>
          <small>JPG, PNG, WebP or AVIF · up to 10 MB. SVG logos can be set using a URL.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .image-field { display:flex; flex-direction:column; gap:.5rem; }
    .image-field-row { display:grid; grid-template-columns:120px minmax(0,1fr); gap:1rem; align-items:start; }
    .image-preview { width:120px; aspect-ratio:1; display:flex; align-items:center; justify-content:center; overflow:hidden; background:var(--bg-surface-soft); border:1px solid var(--border-subtle); border-radius:10px; color:var(--text-muted); font-size:.72rem; text-align:center; }
    .image-preview img { width:100%; height:100%; object-fit:cover; }
    .image-preview.empty img { display:none; }
    .image-field-controls { display:grid; gap:.55rem; align-content:start; }
    .upload-button { width:max-content; display:inline-flex; align-items:center; justify-content:center; padding:.55rem .85rem; border:1px solid var(--border-strong); border-radius:8px; background:var(--bg-surface); font-size:.82rem; font-weight:700; cursor:pointer; }
    .upload-button:hover { border-color:var(--brand-red); color:var(--brand-red); }
    .upload-button.disabled { opacity:.55; pointer-events:none; }
    .upload-button input { display:none; }
    .image-field small { color:var(--text-muted); font-size:.72rem; line-height:1.45; }
    @media(max-width:480px) { .image-field-row { grid-template-columns:82px minmax(0,1fr); gap:.7rem; } .image-preview { width:82px; } }
  `]
})
export class OwnerImageFieldComponent {
  private mediaService = inject(MediaService);
  private toast = inject(ToastService);

  @Input() value = '';
  @Input() label = 'Image';
  @Output() imageUrlChange = new EventEmitter<string>();
  uploading = signal(false);
  previewFailed = signal(false);

  urlValue(event: Event): string { return (event.target as HTMLInputElement).value; }

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.previewFailed.set(false);
    this.uploading.set(true);
    this.mediaService.uploadProductImages([file]).subscribe({
      next: ([url]) => {
        this.imageUrlChange.emit(url);
        this.toast.success(`${this.label} uploaded.`);
      },
      error: error => {
        this.toast.error(error?.message || `Could not upload ${this.label.toLowerCase()}.`);
        this.uploading.set(false);
        input.value = '';
      },
      complete: () => {
        this.uploading.set(false);
        input.value = '';
      }
    });
  }
}
