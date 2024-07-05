import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <h1 class="text-2xl pb-6 font-bold uppercase tracking-wider">
      Register new account
    </h1>
    <form
      [formGroup]="registerForm"
      (submit)="submitButton()"
      class="flex flex-col space-y-4">
      <div class="flex flex-col space-y-1">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          formControlName="name"
          placeholder="Type your name"
          class="custom-input" />
      </div>
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
      <div class="flex flex-col space-y-1">
        <label for="repeatedPassword">Repeated password</label>
        <input
          id="repeatedPassword"
          type="password"
          formControlName="repeatedPassword"
          placeholder="Repeat your password"
          class="custom-input" />
      </div>
      <button
        type="submit"
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray">
        Register now
      </button>
      @if (registerForm.invalid) {
        <span>BŁĄD W FORMULARZU</span>
      }
    </form>
  `,
  styles: ``,
})
export class RegisterFormComponent {
  private _formBuilder = inject(NonNullableFormBuilder);

  public registerForm = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatedPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  public submitButton(): void {
    console.log('Name: ', this.registerForm.value.name);
    console.log('Email: ', this.registerForm.value.email);
    console.log('Password: ', this.registerForm.value.password);
    console.log(
      'Repeated password: ',
      this.registerForm.value.repeatedPassword
    );
  }
}
