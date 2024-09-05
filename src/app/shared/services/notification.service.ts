import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { INotification } from '../models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _notificationsSubject = new BehaviorSubject<INotification[]>([]);
  public notifications$ = this._notificationsSubject.asObservable();

  private _notificationRemovalSubject = new Subject<INotification>();
  public notificationRemoval$ = this._notificationRemovalSubject.asObservable();

  private _notificationIdCounter = 0;

  public addNotification(message: string, duration?: number): void {
    const notifications = this._notificationsSubject.getValue();
    const notification: INotification = {
      id: this._notificationIdCounter++,
      message,
      duration,
      dismissible: !duration,
    };
    this._notificationsSubject.next([...notifications, notification]);

    if (duration) {
      setTimeout(() => this.triggerRemoveNotification(notification), duration);
    }
  }

  public triggerRemoveNotification(notification: INotification): void {
    this._notificationRemovalSubject.next(notification);
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
