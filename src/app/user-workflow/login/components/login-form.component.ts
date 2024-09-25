import { Component, inject, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { IUserLoginRequest } from 'app/shared/models/user.models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForgotPasswordComponent } from './forgot-password.component';
import { NotificationService } from 'app/shared/services/notification.service';
import { AuthenticationService } from 'app/shared/services/authentication.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, ForgotPasswordComponent],
  template: `
    <h1 class="text-2xl pb-6 font-bold uppercase tracking-wider">Log in</h1>
    <form
      [formGroup]="loginForm"
      (submit)="submitButton()"
      class="flex flex-col space-y-4">
      <div class="flex flex-col space-y-1">
        <label for="email" [class.text-red-500]="shouldShowError('email')"
          >Email</label
        >
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="Type your email"
          class="custom-input" />
      </div>
      <div class="flex flex-col space-y-1">
        <label for="password" [class.text-red-500]="shouldShowError('password')"
          >Password</label
        >
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="Type your password"
          class="custom-input" />
      </div>
      <button
        type="submit"
        [disabled]="loginForm.invalid"
        [class.opacity-50]="loginForm.invalid"
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray {{
          isLoginClicked ? 'cursor-wait' : ''
        }}">
        Log in
      </button>
      <app-forgot-password class="flex flex-col space-y-4" />
      @if ((loginForm.invalid && loginForm.touched) || errorMessage !== null) {
        <div class="text-red-500">
          @for (error of getFormErrors(); track error) {
            <p>{{ error }}</p>
          }
          @if (errorMessage !== null) {
            <p>{{ errorMessage }}</p>
          }
        </div>
      }
      @if (errorMessage === 'Mail not confirmed') {
        <button
          type="button"
          (click)="resendConfirmationEmail(loginForm.value.email || '')"
          class="rounded-md px-2 py-[6px] bg-mainGray text-mainOrange border-[1px] border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-sm">
          Resend your activation email
        </button>
      }
      @if (resendMessage !== '') {
        <p class="text-red-500">
          {{ resendMessage }}
        </p>
      }
    </form>
  `,
})
export class LoginFormComponent implements OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _notificationService = inject(NotificationService);
  private _authService = inject(AuthenticationService);
  private _router: Router = new Router();

  private _loginSubscription: Subscription | null = null;
  private _resendEmailSubscription: Subscription | null = null;

  public isLoginClicked = false;

  public errorMessage: string | null = null;

  public resendMessage = '';

  public loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public submitButton(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value as IUserLoginRequest;
      const userLoginRequest: IUserLoginRequest = {
        email: formValues.email,
        password: formValues.password,
      };
      this._loginSubscription = this._userEndpointsService
        .login(userLoginRequest)
        .subscribe({
          next: (response: string) => {
            this.isLoginClicked = true;
            localStorage.setItem('jwtToken', response);
            this._authService.setAuthStatus(true);
            setTimeout(() => {
              this._router.navigate(['/']);
              this.errorMessage = null;
              this._notificationService.addNotification(
                "You've been logged in successfully!",
                3000
              );
            }, 3000);
          },
          error: (error: string) => {
            this.isLoginClicked = false;
            this._authService.setAuthStatus(false);
            this.errorMessage = error;
          },
        });
    }
  }

  public resendConfirmationEmail(email: string): void {
    this._resendEmailSubscription = this._userEndpointsService
      .resendConfirmationEmail(email)
      .subscribe({
        next: () => {
          this._notificationService.addNotification(
            'The confirmation link has been resend!'
          );
          this.resendMessage = '';
        },
        error: (error: string) => {
          this.resendMessage = error;
        },
      });
  }

  public shouldShowError(controlName: string): boolean | undefined {
    return this._formValidationService.shouldShowError(
      this.loginForm,
      controlName
    );
  }

  public getFormErrors(): string[] {
    return this._formValidationService.getFormErrors(this.loginForm);
  }

  public ngOnDestroy(): void {
    if (this._loginSubscription) {
      this._loginSubscription.unsubscribe();
    }
    if (this._resendEmailSubscription) {
      this._resendEmailSubscription.unsubscribe();
    }
  }
}
