import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div
          class="flex items-start gap-3 p-4 rounded-lg shadow-xl border backdrop-blur-sm animate-slide-in"
          [class]="getNotificationClasses(notification.type)"
          role="alert">

          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            @switch (notification.type) {
              @case ('success') {
                <lucide-angular name="check-circle" [size]="20" class="text-green-600 dark:text-green-400"></lucide-angular>
              }
              @case ('error') {
                <lucide-angular name="x-circle" [size]="20" class="text-red-600 dark:text-red-400"></lucide-angular>
              }
              @case ('warning') {
                <lucide-angular name="alert-triangle" [size]="20" class="text-amber-600 dark:text-amber-400"></lucide-angular>
              }
              @case ('info') {
                <lucide-angular name="info" [size]="20" class="text-blue-600 dark:text-blue-400"></lucide-angular>
              }
            }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ notification.title }}</p>
            @if (notification.message) {
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line">{{ notification.message }}</p>
            }

            <!-- Actions -->
            @if (notification.actions && notification.actions.length > 0) {
              <div class="flex gap-2 mt-2">
                @for (action of notification.actions; track action.label) {
                  <button
                    (click)="action.callback(); notificationService.dismiss(notification.id)"
                    [class]="action.primary
                      ? 'px-2 py-1 bg-gray-900/10 dark:bg-white/20 hover:bg-gray-900/20 dark:hover:bg-white/30 text-gray-900 dark:text-white text-xs font-medium rounded'
                      : 'px-2 py-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs'">
                    {{ action.label }}
                  </button>
                }
              </div>
            }
          </div>

          <!-- Close button -->
          <button
            (click)="notificationService.dismiss(notification.id)"
            class="flex-shrink-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <lucide-angular name="x" [size]="16"></lucide-angular>
          </button>
        </div>
      }
    </div>

    <!-- Confirmation Dialog -->
    @if (notificationService.confirmDialog().visible) {
      <div class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-[10000] p-4">
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-slate-700 animate-scale-in">
          <!-- Header -->
          <div class="p-5 border-b border-gray-200 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <div [class]="getConfirmIconBgClass()">
                @switch (notificationService.confirmDialog().options.type) {
                  @case ('danger') {
                    <lucide-angular name="alert-triangle" [size]="20" class="text-red-600 dark:text-red-400"></lucide-angular>
                  }
                  @case ('warning') {
                    <lucide-angular name="alert-circle" [size]="20" class="text-amber-600 dark:text-amber-400"></lucide-angular>
                  }
                  @default {
                    <lucide-angular name="help-circle" [size]="20" class="text-blue-600 dark:text-blue-400"></lucide-angular>
                  }
                }
              </div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                {{ notificationService.confirmDialog().options.title }}
              </h3>
            </div>
          </div>

          <!-- Body -->
          <div class="p-5">
            <p class="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-line">
              {{ notificationService.confirmDialog().options.message }}
            </p>

            @if (notificationService.confirmDialog().options.details?.length) {
              <ul class="mt-3 space-y-1 max-h-32 overflow-y-auto">
                @for (detail of notificationService.confirmDialog().options.details; track detail) {
                  <li class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span class="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                    {{ detail }}
                  </li>
                }
              </ul>
            }
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              (click)="notificationService.resolveConfirm(false)"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white rounded-lg font-medium transition-colors">
              {{ notificationService.confirmDialog().options.cancelText }}
            </button>
            <button
              (click)="notificationService.resolveConfirm(true)"
              [class]="getConfirmButtonClass()">
              {{ notificationService.confirmDialog().options.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes scale-in {
      from {
        transform: scale(0.95);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .animate-slide-in {
      animation: slide-in 0.3s ease-out;
    }

    .animate-scale-in {
      animation: scale-in 0.2s ease-out;
    }
  `]
})
export class NotificationsComponent {
  notificationService = inject(NotificationService);

  getNotificationClasses(type: string): string {
    const base = 'bg-white dark:bg-slate-800/95';
    switch (type) {
      case 'success':
        return `${base} border-green-500/50 dark:border-green-500/30`;
      case 'error':
        return `${base} border-red-500/50 dark:border-red-500/30`;
      case 'warning':
        return `${base} border-amber-500/50 dark:border-amber-500/30`;
      case 'info':
        return `${base} border-blue-500/50 dark:border-blue-500/30`;
      default:
        return `${base} border-gray-200 dark:border-slate-700`;
    }
  }

  getConfirmIconBgClass(): string {
    const type = this.notificationService.confirmDialog().options.type;
    switch (type) {
      case 'danger':
        return 'w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center';
      case 'warning':
        return 'w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center';
      default:
        return 'w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center';
    }
  }

  getConfirmButtonClass(): string {
    const type = this.notificationService.confirmDialog().options.type;
    switch (type) {
      case 'danger':
        return 'px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors';
      case 'warning':
        return 'px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors';
      default:
        return 'px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors';
    }
  }
}
