import { Component, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  template: `
    <div
      class="w-full min-h-screen bg-mainGray flex justify-evenly font-mono pt-20 text-mainCreme">
      <div class="w-1/3 h-fit border-2 border-mainOrange rounded-lg p-6">
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
      </div>
      <div class="flex flex-col space-y-4 w-1/3 h-fit p-6">
        <h1 class="text-2xl font-bold uppercase tracking-wider">
          Don't you have an account yet?
        </h1>
        <span>
          <button
            [routerLink]="['/register']"
            class="w-full my-6 border-[1px] border-mainOrange rounded-md px-2 py-1 text-mainOrange hover:bg-mainOrange hover:text-mainGray">
            Register now
          </button>
        </span>
        <h1 class="text-xl pb-6 font-bold uppercase tracking-wider">
          Why is it worth to create an account on RAG-2?
        </h1>
        <div class="flex flex-col space-y-8 text-mainOrange">
          <span class="flex flex-row items-center space-x-4">
            <i data-feather="save" class="size-8"></i>
            <p>Save your games</p>
          </span>
          <span class="flex flex-row items-center space-x-4">
            <i data-feather="link" class="size-8"></i>
            <p>Keep everything together</p>
          </span>
          <span class="flex flex-row items-center space-x-4">
            <i data-feather="package" class="size-8"></i>
            <p>Watch log's console view</p>
          </span>
          <span class="flex flex-row items-center space-x-4">
            <i data-feather="monitor" class="size-8"></i>
            <p>Create your own AI models</p>
          </span>
        </div>
      </div>
    </div>
  `,
})
export class LoginPageComponent implements AfterViewInit {
  public loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  public ngAfterViewInit(): void {
    feather.replace();
  }

  public submitButton(): void {
    console.log('Email: ', this.loginForm.value.email);
    console.log('Password: ', this.loginForm.value.password);
  }
}
