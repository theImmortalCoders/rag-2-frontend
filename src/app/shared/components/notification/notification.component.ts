import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { INotification } from 'app/shared/models/notification';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div class="fixed w-1/6 bottom-0 left-0 z-50 font-mono">
      @for (notification of notifications; track notification) {
        <div
          class="bg-lightGray border-[1px] border-mainOrange rounded-md text-white p-4 m-2 text-center">
          <p>{{ notification.message }}</p>
          @if (notification.dismissible) {
            <button
              (click)="removeNotification(notification)"
              class="border-mainOrange border-[1px] w-3/4 font-bold text-mainOrange px-2 py-1 mt-2 rounded transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray">
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
