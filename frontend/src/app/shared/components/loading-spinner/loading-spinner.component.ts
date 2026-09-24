import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrapper" [ngClass]="{'inline-spinner': inline}">
      <div class="luxury-spinner" [style.width.px]="size" [style.height.px]="size"></div>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 3rem 1rem;
      width: 100%;
    }
    .spinner-wrapper.inline-spinner {
      padding: 0.5rem;
    }
    .luxury-spinner {
      border: 3px solid var(--border-subtle);
      border-top: 3px solid var(--brand-red);
      border-radius: 50%;
      animation: spin 0.8s cubic-bezier(0.6, 0.2, 0.4, 0.8) infinite;
    }
    .spinner-message {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() size = 44;
  @Input() message = 'Loading...';
  @Input() inline = false;
}
