import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  INotification,
  NotificationService,
} from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div class="fixed w-1/6 bottom-0 left-0 z-50">
      @for (notification of notifications; track notification) {
        <div
          class="bg-lightGray border-[1px] border-mainOrange rounded-md text-white p-4 m-2 text-center">
          <p>{{ notification.message }}</p>
          @if (notification.dismissible) {
            <button
              (click)="removeNotification(notification)"
              class="bg-white text-mainOrange p-2 mt-2 rounded">
              OK
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class NotificationComponent implements OnInit, OnDestroy {
  private _notificationService = inject(NotificationService);

  private _notificationSubscription: Subscription | null = null;

  public notifications: INotification[] = [];

  public ngOnInit(): void {
    this._notificationSubscription =
      this._notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      });
  }

  public removeNotification(notification: INotification): void {
    this._notificationService.removeNotification(notification);
  }

  public ngOnDestroy(): void {
    if (this._notificationSubscription) {
      this._notificationSubscription.unsubscribe();
    }
  }
}
