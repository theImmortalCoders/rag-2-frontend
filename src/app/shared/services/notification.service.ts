import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface INotification {
  message: string;
  duration?: number;
  dismissible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notificationsSubject = new BehaviorSubject<INotification[]>([]);
  public notifications$ = this._notificationsSubject.asObservable();

  public addNotification(message: string, duration?: number): void {
    const notifications = this._notificationsSubject.getValue();
    const notification: INotification = {
      message,
      duration,
      dismissible: !duration,
    };
    this._notificationsSubject.next([...notifications, notification]);

    if (duration) {
      setTimeout(() => this.removeNotification(notification), duration);
    }
  }

  public removeNotification(notificationToRemove: INotification): void {
    const notifications = this._notificationsSubject.getValue();
    this._notificationsSubject.next(
      notifications.filter(
        notification => notification !== notificationToRemove
      )
    );
  }
}
