import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { shouldShowError } from '../../shared/utils/should-show-error';
import { NgFor, NgIf } from '@angular/common';
import { FormValidationService } from '../../shared/services/form-validation.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  template: `
    <h1 class="text-2xl pb-6 font-bold uppercase tracking-wider">Log in</h1>
    <form
      [formGroup]="loginForm"
      (submit)="submitButton()"
      class="flex flex-col space-y-4">
      <div class="flex flex-col space-y-1">
        <label for="email" [class.text-red-500]="showError('email')"
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
        <label for="password" [class.text-red-500]="showError('password')"
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

  public loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  public submitButton(): void {
    console.log('Email: ', this.loginForm.value.email);
    console.log('Password: ', this.loginForm.value.password);
  }

  public showError = (controlName: string): boolean | undefined =>
    shouldShowError(this.loginForm, controlName);

  public getFormErrors(): string[] {
    return this._formValidationService.getFormErrors(this.loginForm);
  }
}
