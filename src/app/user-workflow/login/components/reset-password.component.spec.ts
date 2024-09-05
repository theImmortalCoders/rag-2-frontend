import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEndpointsService } from 'app/shared/services/endpoints/user-endpoints.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let userEndpointsService: jasmine.SpyObj<UserEndpointsService>;
  let _router: Router;
  let _route: ActivatedRoute;

  beforeEach(async () => {
    const userEndpointsServiceSpy = jasmine.createSpyObj(
      'UserEndpointsService',
      ['resetPassword']
    );

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        ResetPasswordComponent,
      ],
      providers: [
        { provide: UserEndpointsService, useValue: userEndpointsServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ token: 'test-token' }), // Mock token value
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    userEndpointsService = TestBed.inject(
      UserEndpointsService
    ) as jasmine.SpyObj<UserEndpointsService>;
    _router = TestBed.inject(Router);
    _route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with token from query params', () => {
    component.ngOnInit();
    expect(component['_token']).toBe('test-token');
  });

  it('should disable the submit button if form is invalid', () => {
    component.shouldShowForm = true;
    component.resetPasswordForm.setValue({ newPassword: '' });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(true);
  });

  it('should enable the submit button if form is valid', () => {
    component.shouldShowForm = true;
    component.resetPasswordForm.setValue({ newPassword: 'password123' });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBe(false);
  });

  it('should reset password and hide form on successful submission', () => {
    component.shouldShowForm = true;
    component['_token'] = 'test-token';
    component.resetPasswordForm.setValue({ newPassword: 'password123' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userEndpointsService.resetPassword.and.returnValue(of(null as any));

    component.submitButton();
    expect(userEndpointsService.resetPassword).toHaveBeenCalledWith(
      'test-token',
      'password123'
    );
    expect(component.actionMessage).toBe(
      'Your password has been reseted. You can close this card.'
    );
    expect(component.shouldShowForm).toBe(false);
  });

  it('should show error message on failed submission', () => {
    component.shouldShowForm = true;
    component['_token'] = 'test-token';
    component.resetPasswordForm.setValue({ newPassword: 'password123' });
    const errorMessage = 'Error resetting password';
    userEndpointsService.resetPassword.and.returnValue(
      throwError(() => errorMessage)
    );

    component.submitButton();
    expect(component.actionMessage).toBe(errorMessage);
    expect(component.shouldShowForm).toBe(true);
  });
});
