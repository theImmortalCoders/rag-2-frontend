import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';
import { NotificationService } from 'app/shared/services/notification.service';
import { of } from 'rxjs';
import { INotification } from 'app/shared/models/notification';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockNotifications: INotification[] = [
    { message: 'Test notification 1', dismissible: true },
    { message: 'Test notification 2', dismissible: false },
  ];

  beforeEach(async () => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'notifications$',
      'removeNotification',
    ]);
    notificationServiceSpy.notifications$ = of(mockNotifications);

    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;

    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to notifications and display them', () => {
    expect(component.notifications).toEqual(mockNotifications);

    const notificationElements =
      fixture.nativeElement.querySelectorAll('div p');
    expect(notificationElements.length).toBe(2);
    expect(notificationElements[0].textContent).toContain(
      'Test notification 1'
    );
    expect(notificationElements[1].textContent).toContain(
      'Test notification 2'
    );
  });

  it('should remove a notification when the remove button is clicked', () => {
    const removeButton = fixture.nativeElement.querySelector('button');
    removeButton.click();

    expect(notificationService.removeNotification).toHaveBeenCalledWith(
      mockNotifications[0]
    );
  });

  it('should unsubscribe from notifications on component destroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    spyOn(component['_notificationSubscription']!, 'unsubscribe');

    component.ngOnDestroy();

    expect(
      component['_notificationSubscription']?.unsubscribe
    ).toHaveBeenCalled();
  });
});
