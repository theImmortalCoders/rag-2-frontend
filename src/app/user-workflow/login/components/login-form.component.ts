import { Component, inject, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { UserEndpointsService } from 'app/shared/services/endpoints/user/user-endpoints.service';
import {
  IUserLoginRequest,
  IUserResponse,
} from 'app/shared/models/user.models';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
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
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray">
        Log in
      </button>
      @if (loginForm.invalid && loginForm.touched) {
        <div class="text-red-500">
          @for (error of getFormErrors(); track error) {
            <p>{{ error }}</p>
          }
        </div>
      }
    </form>
  `,
})
export class LoginFormComponent implements OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _router: Router = new Router();

  private _loginSubscription: Subscription | null = null;

  public loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public submitButton(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value as IUserLoginRequest;
      const userLoginRequest: IUserLoginRequest = {
        email: formValues.email,
        password: formValues.password,
      };
      this._loginSubscription = this._userEndpointsService
        .login(userLoginRequest)
        .subscribe((response: string) => {
          localStorage.setItem('jwtToken', response);
          this._router.navigate(['/']);
        });
    }
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
  }
}
