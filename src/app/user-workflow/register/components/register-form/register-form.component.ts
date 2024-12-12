/* eslint-disable max-lines */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from 'app/shared/services/form-validation.service';
import { IUserRequest } from '@api-models/user.models';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from 'app/shared/services/notification.service';
import { ICourseResponse } from '@api-models/course.models';
import { CourseEndpointsService } from '@endpoints/course-endpoints.service';

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
      class="flex flex-col space-y-4 w-full">
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
        <span class="w-full text-justify text-xs">
          (domain &#64;stud.prz.edu.pl or &#64;prz.edu.pl)
        </span>
      </div>
      @if (
        registerForm.value.email &&
        registerForm.value.email.endsWith('@stud.prz.edu.pl')
      ) {
        <div
          class="flex flex-wrap flex-col sm:flex-row lg:flex-col xl:flex-row items-start space-y-4 sm:space-y-0 lg:space-y-4 xl:space-y-0 space-x-0 sm:space-x-2 lg:space-x-0 xl:space-x-2">
          <div class="flex flex-col w-full sm:w-fit lg:w-full xl:w-fit">
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
          <div class="flex flex-col w-full sm:w-fit lg:w-full xl:w-fit">
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
          <label
            for="courseId"
            class="text-start"
            [class.text-red-500]="shouldShowError('courseId')"
            >Course</label
          >
          <select formControlName="courseId" class="custom-input">
            <option [ngValue]="null">No course choosen</option>
            @for (course of courseList; track course.id) {
              <option [ngValue]="course.id">{{ course.name }}</option>
            }
          </select>
        </div>
        <div class="flex flex-col space-y-1">
          <label
            for="group"
            class="text-start"
            [class.text-red-500]="shouldShowError('group')"
            >Group</label
          >
          <input
            id="group"
            type="text"
            formControlName="group"
            placeholder="Type your group"
            class="custom-input" />
        </div>
      }
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
        isPasswordsMatching === false ||
        errorMessage !== null
      ) {
        <div class="text-red-500">
          @for (error of getFormErrors(); track $index) {
            <p>{{ error }}</p>
          }
          @if (isPasswordsMatching === false) {
            <p>The PASSWORDS must match each other</p>
          }
          @if (errorMessage !== null) {
            <p>{{ errorMessage }}</p>
          }
        </div>
      }
    </form>
  `,
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _courseEndpointsService = inject(CourseEndpointsService);
  private _notificationService = inject(NotificationService);

  private _router: Router = new Router();
  private _registerSubscription = new Subscription();
  private _getCoursesSubscription = new Subscription();

  public courseList: ICourseResponse[] | null = null;
  public isPasswordsMatching: boolean | undefined;
  public errorMessage: string | null = null;

  public registerForm = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    repeatedPassword: ['', [Validators.required, Validators.minLength(8)]],
    studyCycleYearA: [null],
    studyCycleYearB: [null],
    courseId: new FormControl<number | null>(null),
    group: ['', []],
  });

  public ngOnInit(): void {
    this.getCourseList();
  }

  public getCourseList(): void {
    this._getCoursesSubscription = this._courseEndpointsService
      .getCourses()
      .subscribe({
        next: (response: ICourseResponse[]) => {
          this.courseList = response;
        },
      });
  }

  public submitButton(): void {
    this.errorMessage = null;
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
        courseId: formValues.courseId ? formValues.courseId : null,
        group: formValues.group ? formValues.group : null,
      };
      console.log(userRequest);
      this._registerSubscription = this._userEndpointsService
        .register(userRequest)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              'Please confirm your email address!'
            );
            this._router.navigate(['/login']);
            this.errorMessage = null;
          },
          error: (error: string) => {
            this.errorMessage = error;
          },
        });
    }
  }

  public validateNumber(event: Event): void {
    this._formValidationService.validateNumber4Digit(event);
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
    this._registerSubscription.unsubscribe();
    this._getCoursesSubscription.unsubscribe();
  }
}
