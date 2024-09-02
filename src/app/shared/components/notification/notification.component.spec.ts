import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationService } from 'app/shared/services/notification.service';
import { Renderer2 } from '@angular/core';
import { INotification } from 'app/shared/models/notification';
import { Subject } from 'rxjs';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationService: NotificationService;
  let _renderer2: Renderer2;

  beforeEach(async () => {
    const notificationServiceMock = {
      notifications$: new Subject<INotification[]>(),
      notificationRemoval$: new Subject<INotification>(),
      triggerRemoveNotification: jasmine.createSpy('triggerRemoveNotification'),
      removeNotification: jasmine.createSpy('removeNotification'),
    };

    await TestBed.configureTestingModule({
      imports: [NotificationComponent], // Importujemy zamiast deklarować
      providers: [
        { provide: NotificationService, useValue: notificationServiceMock },
        Renderer2,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    notificationService = TestBed.inject(NotificationService);
    _renderer2 = TestBed.inject(Renderer2);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to notifications and update the notifications array', () => {
    const notifications: INotification[] = [
      { id: 1, message: 'Test notification 1', dismissible: true },
      { id: 2, message: 'Test notification 2', dismissible: false },
    ];

    (notificationService.notifications$ as Subject<INotification[]>).next(
      notifications
    );

    expect(component.notifications).toEqual(notifications);
  });

  it('should unsubscribe from notifications on destroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    spyOn(component['_notificationSubscription']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(
      component['_notificationSubscription']?.unsubscribe
    ).toHaveBeenCalled();
  });

  it('should call triggerRemoveNotification when button is clicked', () => {
    const notification: INotification = {
      id: 1,
      message: 'Test notification',
      dismissible: true,
    };
    component.notifications = [notification];
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(notificationService.triggerRemoveNotification).toHaveBeenCalledWith(
      notification
    );
  });
});
