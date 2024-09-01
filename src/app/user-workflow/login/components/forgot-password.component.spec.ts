import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserEndpointsService } from 'app/shared/services/endpoints/user-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { of, throwError } from 'rxjs';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let userEndpointsService: jasmine.SpyObj<UserEndpointsService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    const userEndpointsServiceSpy = jasmine.createSpyObj(
      'UserEndpointsService',
      ['requestPasswordReset']
    );
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ForgotPasswordComponent], // Zamiast deklaracji, importujemy komponent standalone
      providers: [
        { provide: UserEndpointsService, useValue: userEndpointsServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    userEndpointsService = TestBed.inject(
      UserEndpointsService
    ) as jasmine.SpyObj<UserEndpointsService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle `shouldShowInput` when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button[type="button"]');
    button.click();
    fixture.detectChanges();
    expect(component.shouldShowInput).toBe(true);
  });

  it('should disable the submit button when form is invalid', () => {
    component.shouldShowInput = true;
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the submit button when form is valid', () => {
    component.shouldShowInput = true;
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(false);
  });

  it('should call `requestPasswordReset` and show notification on successful submission', () => {
    component.shouldShowInput = true;
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userEndpointsService.requestPasswordReset.and.returnValue(of(null as any));

    component.submitButton();
    expect(userEndpointsService.requestPasswordReset).toHaveBeenCalledWith(
      'test@example.com'
    );
    expect(notificationService.addNotification).toHaveBeenCalledWith(
      'The password reset link has been sent!'
    );
    expect(component.resendMessage).toBe('');
    expect(component.shouldShowInput).toBe(false);
    expect(component.forgotPasswordForm.value.email).toBe('');
  });

  it('should handle error and display resendMessage on failed submission', () => {
    component.shouldShowInput = true;
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    const errorMessage = 'Error occurred';
    userEndpointsService.requestPasswordReset.and.returnValue(
      throwError(() => errorMessage)
    );

    component.submitButton();
    expect(userEndpointsService.requestPasswordReset).toHaveBeenCalledWith(
      'test@example.com'
    );
    expect(component.resendMessage).toBe(errorMessage);
  });

  it('should unsubscribe from the subscription on component destroy', () => {
    component.shouldShowInput = true;
    component.forgotPasswordForm.setValue({ email: 'test@example.com' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userEndpointsService.requestPasswordReset.and.returnValue(of(null as any));

    component.submitButton();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    spyOn(component['_forgotPasswordSubscription']!, 'unsubscribe');

    component.ngOnDestroy();
    expect(
      component['_forgotPasswordSubscription']?.unsubscribe
    ).toHaveBeenCalled();
  });
});
