import { Component, inject, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from '../../../shared/services/form-validation.service';
import { IUserRequest } from 'app/shared/models/user.models';
import { UserEndpointsService } from 'app/shared/services/endpoints/user/user-endpoints.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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
        <label for="name" [class.text-red-500]="shouldShowError('name')"
          >Name</label
        >
        <input
          id="name"
          type="text"
          formControlName="name"
          placeholder="Type your name"
          class="custom-input" />
      </div>
      <div class="flex flex-row space-x-2 items-center">
        <div class="w-1/3">
          <label
            for="studyCycleYearA"
            [class.text-red-500]="shouldShowError('studyCycleYearA')"
            >Study cycle year</label
          >
          <input
            id="studyCycleYearA"
            type="number"
            formControlName="studyCycleYearA"
            placeholder="Type year A"
            class="custom-input"
            (input)="validateNumber($event)" />
        </div>
        <div class="w-1/3">
          <label
            for="studyCycleYearB"
            [class.text-red-500]="shouldShowError('studyCycleYearB')"
            >Study cycle year</label
          >
          <input
            id="studyCycleYearB"
            type="number"
            formControlName="studyCycleYearB"
            placeholder="Type year B"
            class="custom-input"
            (input)="validateNumber($event)" />
        </div>
      </div>
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
      <div class="flex flex-col space-y-1">
        <label
          for="repeatedPassword"
          [class.text-red-500]="shouldShowError('repeatedPassword')"
          >Repeated password</label
        >
        <input
          id="repeatedPassword"
          type="password"
          formControlName="repeatedPassword"
          placeholder="Repeat your password"
          class="custom-input" />
      </div>
      <button
        type="submit"
        [disabled]="registerForm.invalid"
        [class.opacity-50]="registerForm.invalid"
        class="rounded-md px-2 py-1 bg-mainOrange text-mainGray">
        Register now
      </button>
      @if (
        (registerForm.invalid &&
          (registerForm.dirty || registerForm.touched)) ||
        isPasswordsMatching === false
      ) {
        <div class="text-red-500">
          @for (error of getFormErrors(); track error) {
            <p>{{ error }}</p>
          }
          @if (isPasswordsMatching === false) {
            <p>The PASSWORDS must match each other</p>
          }
        </div>
      }
    </form>
  `,
})
export class RegisterFormComponent implements OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _router: Router = new Router();

  public isPasswordsMatching: boolean | undefined;
  private _registerSubscription: Subscription | null = null;

  public registerForm = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatedPassword: ['', [Validators.required, Validators.minLength(8)]],
    studyCycleYearA: [NaN, [Validators.required]],
    studyCycleYearB: [NaN, [Validators.required]],
  });

  public submitButton(): void {
    this.isPasswordsMatching =
      this.registerForm.value.password ===
      this.registerForm.value.repeatedPassword;
    if (this.registerForm.valid && this.isPasswordsMatching === true) {
      const formValues = this.registerForm.value as IUserRequest;
      const userRequest: IUserRequest = {
        email: formValues.email,
        password: formValues.password,
        name: formValues.name,
        studyCycleYearA: formValues.studyCycleYearA,
        studyCycleYearB: formValues.studyCycleYearB,
      };
      this._registerSubscription = this._userEndpointsService
        .register(userRequest)
        .subscribe(() => {
          this._router.navigate(['/']);
        });
    }
  }

  public validateNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length > 4) {
      input.value = input.value.substring(0, 4);
    }
  }

  public shouldShowError(controlName: string): boolean | undefined {
    return this._formValidationService.shouldShowError(
      this.registerForm,
      controlName
    );
  }

  public getFormErrors(): string[] {
    return this._formValidationService.getFormErrors(this.registerForm);
  }

  public ngOnDestroy(): void {
    if (this._registerSubscription) {
      this._registerSubscription.unsubscribe();
    }
  }
}
