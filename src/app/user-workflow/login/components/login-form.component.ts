import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

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
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        formControlName="email"
        placeholder="Type your email"
        class="border-[1px] border-mainCreme rounded-md px-2 py-1 bg-mainGray text-mainCreme focus:outline-none" />
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        formControlName="password"
        placeholder="Type your password"
        class="border-[1px] border-mainCreme rounded-md px-2 py-1 bg-mainGray text-mainCreme focus:outline-none" />
      <button
        type="submit"
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray">
        Log in
      </button>
    </form>
  `,
})
export class LoginFormComponent {
  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public submitButton(): void {
    console.log('Email: ', this.loginForm.value.email);
    console.log('Password: ', this.loginForm.value.password);
  }
}
