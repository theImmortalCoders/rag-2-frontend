import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../shared/services/form-validation.service';
import { LoginService } from '../services/login.service';

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
export class LoginFormComponent {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);

  public constructor(private _loginService: LoginService) {}

  public loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public submitButton(): void {
    if (
      this.loginForm.value.email != undefined &&
      this.loginForm.value.password != undefined
    ) {
      this._loginService
        .logIn(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: r => {
            localStorage.setItem('jwtToken', r);
          },
          error: error => {
            console.error('Error: ', error);
          },
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
}
