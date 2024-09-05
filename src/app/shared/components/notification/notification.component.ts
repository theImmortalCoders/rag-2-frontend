import { Component, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { INotification } from 'app/shared/models/notification';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  template: `
    <div
      class="fixed text-sm xs:text-base w-3/5 xs:w-1/2 sm:w-2/5 md:w-1/3 lg:w-1/4 xl:w-1/6 bottom-0 left-0 z-50 font-mono">
      @for (notification of notifications; track notification.id) {
        <div
          [id]="'notification-' + notification.id"
          class="bg-lightGray border-[1px] border-mainOrange rounded-md text-white p-4 m-2 text-center transition-all ease-in-out duration-200 opacity-100">
          <p>{{ notification.message }}</p>
          @if (notification.dismissible) {
            <button
              (click)="triggerRemoveNotification(notification)"
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
  private _renderer = inject(Renderer2);

  private _notificationSubscription: Subscription | null = null;

  public notifications: INotification[] = [];

  public ngOnInit(): void {
    this._notificationSubscription =
      this._notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      });

    this._notificationService.notificationRemoval$.subscribe(notification => {
      const container = this.findNotificationContainer(notification.id);
      if (container) {
        this.removeNotification(notification, container);
      }
    });
  }

  private findNotificationContainer(
    notificationId: number
  ): HTMLDivElement | null {
    return document.querySelector(
      `#notification-${notificationId}`
    ) as HTMLDivElement;
  }

  public removeNotification(
    notification: INotification,
    container: HTMLDivElement
  ): void {
    this._renderer.removeClass(container, 'opacity-100');
    this._renderer.addClass(container, 'opacity-0');
    setTimeout(() => {
      this._notificationService.removeNotification(notification);
    }, 200);
  }

  public triggerRemoveNotification(notification: INotification): void {
    this._notificationService.triggerRemoveNotification(notification);
  }

  public ngOnDestroy(): void {
    if (this._notificationSubscription) {
      this._notificationSubscription.unsubscribe();
    }
  }
}
