import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserShortcutComponent } from './user-shortcut.component';
import { AuthenticationService } from 'app/shared/services/authentication.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { TRole } from 'app/shared/models/role.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserShortcutComponent', () => {
  let component: UserShortcutComponent;
  let fixture: ComponentFixture<UserShortcutComponent>;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let userEndpointsService: jasmine.SpyObj<UserEndpointsService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: Router;
  let authStatus$: Subject<boolean>;
  let role$: Subject<string>;

  beforeEach(async () => {
    // Mock services
    authStatus$ = new Subject<boolean>();
    role$ = new Subject<string>();

    authService = jasmine.createSpyObj(
      'AuthenticationService',
      ['setAuthStatus'],
      {
        authStatus$: authStatus$.asObservable(),
        currentRole$: role$.asObservable(),
      }
    );

    userEndpointsService = jasmine.createSpyObj('UserEndpointsService', [
      'logout',
    ]);
    notificationService = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    // Set up the testing module
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        UserShortcutComponent,
      ],
      providers: [
        { provide: AuthenticationService, useValue: authService },
        { provide: UserEndpointsService, useValue: userEndpointsService },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(UserShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    authStatus$.complete();
    role$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to authStatus$ and update isLoggedIn', fakeAsync(() => {
      authStatus$.next(true);
      tick();
      expect(component.isLoggedIn).toBeTrue();

      authStatus$.next(false);
      tick();
      expect(component.isLoggedIn).toBeFalse();
    }));

    it('should subscribe to currentRole$ and update currentUserRole', fakeAsync(() => {
      const testRole = 'ADMIN' as TRole;
      role$.next(testRole);
      tick();
      expect(component.currentUserRole).toBe(testRole);
    }));
  });

  describe('handleButtonClick', () => {
    it('should toggle isUserInfoVisible if user is logged in', () => {
      component.isLoggedIn = true;
      component.isUserInfoVisible = false;
      component.handleButtonClick();
      expect(component.isUserInfoVisible).toBeTrue();

      component.handleButtonClick();
      expect(component.isUserInfoVisible).toBeFalse();
    });

    it('should navigate to /login if user is not logged in', () => {
      component.isLoggedIn = false;
      const routerSpy = spyOn(router, 'navigate');
      component.handleButtonClick();
      expect(routerSpy).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('logoutButtonClick', () => {
    it('should logout user and navigate to home if logged in', fakeAsync(() => {
      component.isLoggedIn = true;
      component.currentUserRole = 'USER' as TRole;
      userEndpointsService.logout.and.returnValue(of(undefined)); // Mock logout to return an observable

      const routerSpy = spyOn(router, 'navigate');
      component.logoutButtonClick();
      tick();

      expect(userEndpointsService.logout).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
      expect(notificationService.addNotification).toHaveBeenCalledWith(
        "You've been logged out successfully!",
        3000
      );
      expect(component.isLoggedIn).toBeFalse();
      expect(component.currentUserRole).toBeNull();
      expect(component.isUserInfoVisible).toBeFalse();
      expect(authService.setAuthStatus).toHaveBeenCalledWith(false);
    }));

    it('should not attempt logout if user is not logged in', () => {
      component.isLoggedIn = false;
      component.logoutButtonClick();
      expect(userEndpointsService.logout).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all subscriptions', () => {
      const authSubscriptionSpy = spyOn(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        component['_authSubscription']!,
        'unsubscribe'
      );
      const roleSubscriptionSpy = spyOn(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        component['_roleSubscription']!,
        'unsubscribe'
      );

      component.ngOnDestroy();

      expect(authSubscriptionSpy).toHaveBeenCalled();
      expect(roleSubscriptionSpy).toHaveBeenCalled();
    });
  });
});
