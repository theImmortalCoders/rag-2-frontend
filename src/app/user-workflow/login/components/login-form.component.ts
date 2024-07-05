import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          formControlName="email"
          placeholder="Type your email"
          class="custom-input" />
      </div>
      <div class="flex flex-col space-y-1">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="Type your password"
          class="custom-input" />
      </div>
      <button
        type="submit"
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray">
        Log in
      </button>
      @if (loginForm.invalid) {
        <span>BŁĄD W FORMULARZU</span>
      }
    </form>
  `,
})
export class LoginFormComponent {
  private _formBuilder = inject(NonNullableFormBuilder);

  public loginForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  public submitButton(): void {
    console.log('Email: ', this.loginForm.value.email);
    console.log('Password: ', this.loginForm.value.password);
  }
}
