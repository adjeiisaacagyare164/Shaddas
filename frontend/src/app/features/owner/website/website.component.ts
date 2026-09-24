import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsiteService } from '../../../core/services/website.service';
import { ToastService } from '../../../core/services/toast.service';
import { HomepageContent } from '../../../core/models/website.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-owner-website',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="owner-website-page animate-fade-in">
      
      <!-- HEADER -->
      <div class="page-header">
        <div>
          <span class="badge badge-cream">Content Management System</span>
          <h1 class="page-title">Website CMS Editor</h1>
          <p class="page-subtitle">Update your public homepage headlines, hero image, and about section. Changes reflect immediately on the live store.</p>
        </div>

        <button 
          type="button" 
          class="btn btn-primary btn-lg"
          [disabled]="saving()"
          (click)="onSaveCMS()"
        >
          <span>{{ saving() ? 'Saving Changes...' : 'Save & Publish Live' }}</span>
        </button>
      </div>

      <!-- LOADING -->
      <app-loading-spinner *ngIf="loading()" [size]="44" message="Loading CMS content..."></app-loading-spinner>

      <div class="cms-layout-grid" *ngIf="!loading()">
        
        <!-- FORM COLUMN -->
        <div class="cms-form-col">
          
          <!-- HERO SECTION SETTINGS -->
          <div class="card section-editor-card">
            <div class="section-card-header">
              <span class="step-num">1</span>
              <div>
                <h3 class="card-title">Homepage Hero Section</h3>
                <p class="card-desc">The primary banner seen when customers visit your store.</p>
              </div>
            </div>

            <div class="form-content">
              
              <!-- Badge -->
              <div class="form-group">
                <label class="form-label" for="heroBadge">Top Pill Badge</label>
                <input 
                  type="text" 
                  id="heroBadge"
                  [(ngModel)]="cmsData.hero_badge" 
                  name="heroBadge"
                  placeholder="e.g. New Arrivals 2026" 
                  class="form-input"
                >
              </div>

              <!-- Title / Headline -->
              <div class="form-group">
                <label class="form-label" for="heroTitle">Hero Headline *</label>
                <input 
                  type="text" 
                  id="heroTitle"
                  [(ngModel)]="cmsData.hero_title" 
                  name="heroTitle"
                  placeholder="Main headline..." 
                  class="form-input"
                  required
                >
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label" for="heroDesc">Hero Subtitle / Description *</label>
                <textarea 
                  id="heroDesc"
                  [(ngModel)]="cmsData.hero_description" 
                  name="heroDesc"
                  placeholder="Describe your store offerings..." 
                  class="form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>

              <!-- Hero Image URL -->
              <div class="form-group">
                <label class="form-label" for="heroImg">Hero Showcase Image URL</label>
                <input 
                  type="url" 
                  id="heroImg"
                  [(ngModel)]="cmsData.hero_image" 
                  name="heroImg"
                  placeholder="https://images.unsplash.com/..." 
                  class="form-input"
                >
              </div>

              <!-- Button CTA Text -->
              <div class="form-group">
                <label class="form-label" for="heroBtn">Hero CTA Button Text</label>
                <input 
                  type="text" 
                  id="heroBtn"
                  [(ngModel)]="cmsData.hero_button_text" 
                  name="heroBtn"
                  placeholder="e.g. Shop Now" 
                  class="form-input"
                >
              </div>

            </div>
          </div>

          <!-- ABOUT SECTION SETTINGS -->
          <div class="card section-editor-card">
            <div class="section-card-header">
              <span class="step-num">2</span>
              <div>
                <h3 class="card-title">About Shadas Section</h3>
                <p class="card-desc">Share your brand story, mission, and why customers in Ghana should trust your store.</p>
              </div>
            </div>

            <div class="form-content">
              
              <!-- About Title -->
              <div class="form-group">
                <label class="form-label" for="aboutTitle">Section Title *</label>
                <input 
                  type="text" 
                  id="aboutTitle"
                  [(ngModel)]="cmsData.about_title" 
                  name="aboutTitle"
                  placeholder="e.g. About Shadas" 
                  class="form-input"
                  required
                >
              </div>

              <!-- About Description -->
              <div class="form-group">
                <label class="form-label" for="aboutDesc">About Story / Text *</label>
                <textarea 
                  id="aboutDesc"
                  [(ngModel)]="cmsData.about_description" 
                  name="aboutDesc"
                  placeholder="Your story..." 
                  class="form-textarea"
                  rows="4"
                  required
                ></textarea>
              </div>

              <!-- About Image -->
              <div class="form-group">
                <label class="form-label" for="aboutImg">About Feature Image URL</label>
                <input 
                  type="url" 
                  id="aboutImg"
                  [(ngModel)]="cmsData.about_image" 
                  name="aboutImg"
                  placeholder="https://images.unsplash.com/..." 
                  class="form-input"
                >
              </div>

              <!-- About Trust Points (One per line) -->
              <div class="form-group">
                <label class="form-label" for="aboutPoints">Key Trust Points (One bullet point per line)</label>
                <textarea 
                  id="aboutPoints"
                  [(ngModel)]="aboutPointsRaw" 
                  name="aboutPoints"
                  placeholder="Direct & instant WhatsApp ordering&#10;Fast delivery across Ghana&#10;Verified quality guarantee" 
                  class="form-textarea"
                  rows="4"
                ></textarea>
              </div>

            </div>
          </div>

        </div>

        <!-- PREVIEW COLUMN -->
        <div class="cms-preview-col">
          <div class="card preview-card sticky-preview">
            <div class="preview-header">
              <span class="preview-label">Live Preview Previewer</span>
              <span class="badge badge-red">Homepage Mockup</span>
            </div>

            <div class="mockup-hero">
              <span class="badge badge-red badge-sm">{{ cmsData.hero_badge || 'Preview Badge' }}</span>
              <h4 class="mockup-title">{{ cmsData.hero_title || 'Hero Title Preview' }}</h4>
              <p class="mockup-desc">{{ cmsData.hero_description || 'Hero description preview text will appear here.' }}</p>
              
              <div class="mockup-img-box" *ngIf="cmsData.hero_image">
                <img [src]="cmsData.hero_image" alt="Hero Preview">
              </div>

              <div class="mockup-btn">
                <span class="btn btn-primary btn-sm">{{ cmsData.hero_button_text || 'Shop Now' }}</span>
              </div>
            </div>

            <div class="mockup-divider"></div>

            <div class="mockup-about">
              <span class="badge badge-cream badge-sm">About Section</span>
              <h4>{{ cmsData.about_title }}</h4>
              <p>{{ cmsData.about_description }}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .owner-website-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .page-title {
      font-size: 2.25rem;
      margin: 0.25rem 0;
    }
    .page-subtitle {
      font-size: 0.9375rem;
    }

    .cms-layout-grid {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 2.5rem;
      align-items: flex-start;
    }
    .cms-form-col {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .section-editor-card {
      padding: 2rem;
    }
    .section-card-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 1.5rem;
    }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--brand-red);
      color: #fff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9375rem;
      flex-shrink: 0;
    }
    .card-title {
      font-size: 1.2rem;
      margin-bottom: 0.2rem;
    }
    .card-desc {
      font-size: 0.8125rem;
    }
    .form-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    /* Live Preview */
    .sticky-preview {
      position: sticky;
      top: 6rem;
      padding: 1.75rem;
    }
    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 1.25rem;
    }
    .preview-label {
      font-size: 0.8125rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .mockup-hero {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .mockup-title {
      font-size: 1.25rem;
      line-height: 1.3;
    }
    .mockup-desc {
      font-size: 0.8125rem;
      line-height: 1.5;
    }
    .mockup-img-box {
      height: 180px;
      border-radius: var(--radius-md);
      overflow: hidden;
      margin: 0.5rem 0;
    }
    .mockup-img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .mockup-divider {
      height: 1px;
      background: var(--border-subtle);
      margin: 1.5rem 0;
    }
    .mockup-about {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .mockup-about h4 {
      font-size: 1.1rem;
    }
    .mockup-about p {
      font-size: 0.8125rem;
      line-height: 1.5;
    }

    @media (max-width: 992px) {
      .cms-layout-grid {
        grid-template-columns: 1fr;
      }
      .sticky-preview {
        position: static;
      }
    }
  `]
})
export class OwnerWebsiteComponent implements OnInit {
  private websiteService = inject(WebsiteService);
  private toast = inject(ToastService);

  loading = signal(true);
  saving = signal(false);

  cmsData: HomepageContent = {
    hero_badge: '',
    hero_title: '',
    hero_description: '',
    hero_image: '',
    hero_button_text: '',
    about_title: '',
    about_description: '',
    about_image: '',
    about_points: []
  };

  aboutPointsRaw = '';

  ngOnInit(): void {
    this.fetchCMS();
  }

  fetchCMS(): void {
    this.loading.set(true);
    this.websiteService.getOwnerHomepage().subscribe({
      next: data => {
        this.cmsData = data;
        this.aboutPointsRaw = (data.about_points || []).join('\n');
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSaveCMS(): void {
    if (!this.cmsData.hero_title.trim() || !this.cmsData.about_title.trim()) {
      this.toast.error('Please fill in the required hero and about section titles.');
      return;
    }

    const points = this.aboutPointsRaw
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);
    this.cmsData.about_points = points;

    this.saving.set(true);
    this.websiteService.updateOwnerHomepage(this.cmsData).subscribe({
      next: updated => {
        this.cmsData = updated;
        this.saving.set(false);
        this.toast.success('Homepage CMS content saved and published to live website!');
      },
      error: () => {
        this.saving.set(false);
        this.toast.error('Failed to save CMS content. Please check input values.');
      }
    });
  }
}
