/* eslint-disable max-lines */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from 'app/shared/services/form-validation.service';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { IUserLoginRequest } from '@api-models/user.models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { NotificationService } from 'app/shared/services/notification.service';
import { AppStatusService } from 'app/shared/services/app-status.service';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, ForgotPasswordComponent],
  template: `
    <h1
      id="loginHeader"
      class="text-2xl pb-6 font-bold uppercase tracking-wider">
      Log in
    </h1>
    <form
      id="loginPageForm"
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
          name="email"
          placeholder="Type your email"
          class="custom-input"
          list="recentEmails" />
        <datalist id="recentEmails">
          @for (email of recentEmails; track email) {
            <option [value]="email"></option>
          }
        </datalist>
      </div>
      <div class="flex flex-col space-y-1">
        <label for="password" [class.text-red-500]="shouldShowError('password')"
          >Password</label
        >
        <input
          id="password"
          type="password"
          formControlName="password"
          name="password"
          placeholder="Type your password"
          class="custom-input" />
      </div>
      <div class="flex flex-wrap items-center flex-row space-x-4">
        <label for="rememberMe">Remember me</label>
        <input
          id="rememberMe"
          type="checkbox"
          formControlName="rememberMe"
          class="custom-input accent-mainOrange" />
      </div>
      <button
        type="submit"
        [disabled]="loginForm.invalid"
        [class.opacity-50]="loginForm.invalid"
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray">
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
export class LoginFormComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _authEndpointsService = inject(AuthEndpointsService);
  private _notificationService = inject(NotificationService);
  private _appStatusService = inject(AppStatusService);
  private _router: Router = new Router();

  private _loginSubscription = new Subscription();
  private _resendEmailSubscription = new Subscription();

  public recentEmails: string[] = [];
  public errorMessage: string | null = null;
  public resendMessage = '';

  public loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberMe: [false],
  });

  public ngOnInit(): void {
    this.loadRecentEmails();
  }

  private loadRecentEmails(): void {
    const cachedEmails = localStorage.getItem('recentEmails');
    if (cachedEmails) {
      this.recentEmails = JSON.parse(cachedEmails);
    }
  }

  private saveEmailToHistory(email: string): void {
    if (!this.recentEmails.includes(email)) {
      this.recentEmails.unshift(email);
      this.recentEmails = this.recentEmails.slice(0, 5);
      localStorage.setItem('recentEmails', JSON.stringify(this.recentEmails));
    }
  }

  public submitButton(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value as IUserLoginRequest;
      const userLoginRequest: IUserLoginRequest = {
        email: formValues.email,
        password: formValues.password,
        rememberMe: formValues.rememberMe,
      };
      this._loginSubscription = this._authEndpointsService
        .login(userLoginRequest)
        .subscribe({
          next: () => {
            this._appStatusService.setAuthStatus(true);
            this.errorMessage = null;
            this.saveEmailToHistory(formValues.email);
            this._notificationService.addNotification(
              "You've been logged in successfully!",
              3000
            );
            this._router.navigate(['/']);
          },
          error: (error: string) => {
            this._appStatusService.setAuthStatus(false);
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
    this._loginSubscription.unsubscribe();
    this._resendEmailSubscription.unsubscribe();
  }
}
