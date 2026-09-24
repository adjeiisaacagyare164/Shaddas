import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="isOpen" (click)="onCancel()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-icon" [ngClass]="{'icon-danger': isDestructive}">
          <svg *ngIf="isDestructive" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <svg *ngIf="!isDestructive" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>

        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>

        <div class="modal-actions">
          <button type="button" class="btn btn-secondary btn-sm" (click)="onCancel()">
            {{ cancelText }}
          </button>
          <button 
            type="button" 
            class="btn btn-sm" 
            [ngClass]="isDestructive ? 'btn-danger' : 'btn-primary'"
            (click)="onConfirm()"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-dialog {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 2rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: var(--shadow-xl);
      animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-icon {
      width: 52px;
      height: 52px;
      margin: 0 auto 1.25rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface-soft);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--brand-red);
    }
    .modal-icon.icon-danger {
      background: var(--danger-bg);
      color: var(--danger);
    }
    .modal-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    .modal-message {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      margin-bottom: 1.75rem;
      line-height: 1.5;
    }
    .modal-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .btn-danger {
      background: var(--danger);
      color: #fff;
    }
    .btn-danger:hover {
      background: #B91C1C;
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() isDestructive = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
