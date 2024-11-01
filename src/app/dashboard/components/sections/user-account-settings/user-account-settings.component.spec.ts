import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { UserAccountSettingsComponent } from './user-account-settings.component';
import { FormValidationService } from 'app/shared/services/form-validation.service';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserAccountSettingsComponent', () => {
  let component: UserAccountSettingsComponent;
  let fixture: ComponentFixture<UserAccountSettingsComponent>;
  let mockFormValidationService: jasmine.SpyObj<FormValidationService>;
  let mockUserEndpointsService: jasmine.SpyObj<UserEndpointsService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    mockFormValidationService = jasmine.createSpyObj('FormValidationService', [
      'shouldShowError',
      'getFormErrors',
    ]);
    mockUserEndpointsService = jasmine.createSpyObj('UserEndpointsService', [
      'changePassword',
      'deleteAccount',
    ]);
    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'addNotification',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        UserAccountSettingsComponent,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: FormValidationService, useValue: mockFormValidationService },
        { provide: UserEndpointsService, useValue: mockUserEndpointsService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should open change password modal', () => {
    component.changePasswordModal();
    expect(component.modalVisibility).toBe('changePassword');
    expect(component.modalTitle).toBe('Changing your password');
    expect(component.modalButtonText).toBe('Change password');
  });

  it('should open delete account modal', () => {
    component.deleteAccountModal();
    expect(component.modalVisibility).toBe('deleteAccount');
    expect(component.modalTitle).toBe('Deleting your account and all data');
    expect(component.modalButtonText).toBe('Delete account and all data');
  });

  it('should close modal', () => {
    component.hideModal();
    expect(component.modalVisibility).toBeNull();
  });

  it('should call changePasswordFunction and handle success', fakeAsync(() => {
    mockUserEndpointsService.changePassword.and.returnValue(of());
    component.changePasswordForm.setValue({
      oldPassword: 'oldPass123',
      newPassword: 'newPass123',
    });

    component.changePasswordFunction();
    tick(); // Simulate the passage of time until all pending asynchronous activities finish

    expect(component.errorMessage).toBeNull();
    expect(component.modalVisibility).toBeNull();
  }));

  it('should call deleteAccountFunction and handle success', fakeAsync(() => {
    mockUserEndpointsService.deleteAccount.and.returnValue(of());

    component.deleteAccountFunction();
    tick(); // Simulate passage of time

    expect(component.errorMessage).toBeNull();
    expect(component.modalVisibility).toBeNull();
  }));

  it('should unsubscribe on destroy', () => {
    spyOn(component['_changePasswordSubscribtion'], 'unsubscribe');
    spyOn(component['_deleteAccountSubscribtion'], 'unsubscribe');

    component.ngOnDestroy();

    expect(
      component['_changePasswordSubscribtion'].unsubscribe
    ).toHaveBeenCalled();
    expect(
      component['_deleteAccountSubscribtion'].unsubscribe
    ).toHaveBeenCalled();
  });
});
