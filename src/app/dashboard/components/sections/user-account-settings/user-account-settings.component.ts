/* eslint-disable max-lines */
import { Component, inject, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../shared/modal.component';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from 'app/shared/services/form-validation.service';
import { Subscription } from 'rxjs';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Router } from '@angular/router';
import { IUserEditRequest, IUserResponse } from 'app/shared/models/user.models';
import { AuthEndpointsService } from '@endpoints/auth-endpoints.service';
import { ICourseResponse } from 'app/shared/models/course.models';
import { CourseEndpointsService } from '@endpoints/course-endpoints.service';

@Component({
  selector: 'app-user-account-settings',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <h1
      class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange text-center 2xs:text-start">
      My account settings
    </h1>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <div
      class="flex flex-col xs:flex-row justify-around gap-y-2 xs:gap-y-0 space-x-0 xs:space-x-4 sm:space-x-8 w-full">
      <button
        type="button"
        (click)="changePasswordModal()"
        class="dashboard-button group">
        <span>Change your password</span>
        <i data-feather="edit-3" class="dashboard-icon"></i>
      </button>
      <button
        type="button"
        (click)="editAccountModal()"
        class="dashboard-button group">
        <span>Edit your account data</span>
        <i data-feather="edit" class="dashboard-icon"></i>
      </button>
      <button
        type="button"
        (click)="deleteAccountModal()"
        class="dashboard-button group">
        <span>Delete your account</span>
        <i data-feather="trash-2" class="dashboard-icon"></i>
      </button>
    </div>
    @if (modalVisibility !== null) {
      <app-modal (closeModal)="hideModal()">
        <div class="flex flex-col items-start w-full font-mono">
          <h2
            class="text-2xl sm:text-3xl text-mainCreme font-bold mb-2 xs:mb-6 sm:mb-10">
            {{ modalTitle }}
          </h2>
          @if (modalVisibility === 'changePassword') {
            <form
              [formGroup]="changePasswordForm"
              class="flex flex-col space-y-4 w-full text-sm sm:text-base">
              <div class="flex flex-col space-y-1">
                <label
                  for="oldPassword"
                  [class.text-red-500]="shouldShowError('oldPassword')"
                  class="text-start"
                  >Old password</label
                >
                <input
                  id="oldPassword"
                  type="password"
                  formControlName="oldPassword"
                  placeholder="Type your old password"
                  class="custom-input" />
              </div>
              <div class="flex flex-col space-y-1">
                <label
                  for="newPassword"
                  [class.text-red-500]="shouldShowError('newPassword')"
                  class="text-start"
                  >New password</label
                >
                <input
                  id="newPassword"
                  type="password"
                  formControlName="newPassword"
                  placeholder="Type your new password"
                  class="custom-input" />
              </div>
            </form>
          } @else if (modalVisibility === 'editAccount') {
            <form
              [formGroup]="accountDataForm"
              class="flex flex-col space-y-4 w-full text-sm sm:text-base">
              <div class="flex flex-col space-y-1">
                <label
                  for="name"
                  class="text-start"
                  [class.text-red-500]="shouldShowErrorAccountData('name')"
                  >Name</label
                >
                <input
                  id="name"
                  type="text"
                  formControlName="name"
                  placeholder="Type your name"
                  class="custom-input" />
              </div>
              <div
                class="flex flex-wrap flex-col sm:flex-row lg:flex-col xl:flex-row items-start space-y-4 sm:space-y-0 lg:space-y-4 xl:space-y-0 space-x-0 sm:space-x-2 lg:space-x-0 xl:space-x-2">
                <div class="flex flex-col w-full sm:w-fit lg:w-full xl:w-fit">
                  <label
                    for="studyCycleYearA"
                    class="text-start"
                    [class.text-red-500]="
                      shouldShowErrorAccountData('studyCycleYearA')
                    "
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
                    class="text-start"
                    [class.text-red-500]="
                      shouldShowErrorAccountData('studyCycleYearB')
                    "
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
                <span
                  class="w-full text-center sm:text-start lg:text-center xl:text-start pt-0 sm:pt-2 lg:pt-0 xl:pt-2 text-xs">
                  (if you are a teacher you do not need to enter the study cycle
                  years)
                </span>
              </div>
              <div class="flex flex-col space-y-1">
                <label
                  for="courseId"
                  class="text-start"
                  [class.text-red-500]="shouldShowErrorAccountData('courseId')"
                  >Course</label
                >
                <select formControlName="courseId" class="custom-input">
                  <option [ngValue]="null">No course choosen</option>
                  @for (course of courseList; track course.id) {
                    <option [value]="course.id">{{ course.name }}</option>
                  }
                </select>
              </div>
              <div class="flex flex-col space-y-1">
                <label
                  for="group"
                  class="text-start"
                  [class.text-red-500]="shouldShowErrorAccountData('group')"
                  >Group</label
                >
                <input
                  id="group"
                  type="text"
                  formControlName="group"
                  placeholder="Type your group"
                  class="custom-input" />
              </div>
            </form>
          } @else if (modalVisibility === 'deleteAccount') {
            <p class="mb-4 text-sm sm:text-base">
              You will lose all your data, progress, and saved games and will
              not be able to undo it.
            </p>
            <p class="text-red-500 text-sm sm:text-base">
              Are you sure about this action? It can't be undone later!
            </p>
          }
          <button
            class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-4 xs:mt-6 px-2 xs:px-3 py-1 xs:py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
            (click)="modalButtonFunction()">
            {{ modalButtonText }}
          </button>
          <button
            (click)="hideModal()"
            class="absolute top-1 sm:top-2 right-2 sm:right-4 text-3xl sm:text-5xl text-mainOrange hover:text-mainGray">
            x
          </button>
          @if (
            (changePasswordForm.invalid &&
              (changePasswordForm.dirty || changePasswordForm.touched)) ||
            errorMessage !== null
          ) {
            <div class="text-red-500 mt-6">
              @for (error of getFormErrors(); track error) {
                @if (modalVisibility === 'changePassword') {
                  <p>{{ error }}</p>
                }
              }
              @if (errorMessage !== null) {
                <p>{{ errorMessage }}</p>
              }
            </div>
          }
          @if (
            (accountDataForm.invalid &&
              (accountDataForm.dirty || accountDataForm.touched)) ||
            errorMessage !== null
          ) {
            <div class="text-red-500 mt-6 flex flex-col items-start">
              @for (error of getFormErrorsAccountData(); track error) {
                @if (modalVisibility === 'editAccount') {
                  <p>{{ error }}</p>
                }
              }
            </div>
          }
        </div>
      </app-modal>
    }
  `,
})
export class UserAccountSettingsComponent implements OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _authEndpointsService = inject(AuthEndpointsService);
  private _courseEndpointsService = inject(CourseEndpointsService);
  private _notificationService = inject(NotificationService);
  private _router = inject(Router);

  private _getMeSubscription = new Subscription();
  private _changePasswordSubscribtion = new Subscription();
  private _editAccountSubscribtion = new Subscription();
  private _deleteAccountSubscribtion = new Subscription();
  private _getCoursesSubscription = new Subscription();

  public changePasswordForm = this._formBuilder.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  public accountDataForm = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    studyCycleYearA: new FormControl<number | null>(null),
    studyCycleYearB: new FormControl<number | null>(null),
    courseId: new FormControl<number | null>(null),
    group: ['', []],
  });

  public errorMessage: string | null = null;
  public userData: IUserResponse | null = null;
  public courseList: ICourseResponse[] | null = null;

  public modalVisibility:
    | 'changePassword'
    | 'editAccount'
    | 'deleteAccount'
    | null = null;
  public modalTitle = '';
  public modalButtonText = '';
  public modalButtonFunction!: () => void;

  public shouldShowError(controlName: string): boolean | undefined {
    return this._formValidationService.shouldShowError(
      this.changePasswordForm,
      controlName
    );
  }

  public shouldShowErrorAccountData(controlName: string): boolean | undefined {
    return this._formValidationService.shouldShowError(
      this.accountDataForm,
      controlName
    );
  }

  public validateNumber(event: Event): void {
    this._formValidationService.validateNumber4Digit(event);
  }

  public getFormErrors(): string[] {
    return this._formValidationService.getFormErrors(this.changePasswordForm);
  }

  public getFormErrorsAccountData(): string[] {
    return this._formValidationService.getFormErrors(this.accountDataForm);
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

  public getUserData(): void {
    this._getMeSubscription = this._authEndpointsService.getMe().subscribe({
      next: (response: IUserResponse) => {
        this.userData = response;
        this.setAccountEditFormControls();
      },
      error: () => {
        this.userData = null;
      },
    });
  }

  public setAccountEditFormControls(): void {
    this.accountDataForm.controls.name.setValue(
      this.userData ? this.userData.name : ''
    );
    this.accountDataForm.controls.studyCycleYearA.setValue(
      this.userData ? this.userData.studyCycleYearA : null
    );
    this.accountDataForm.controls.studyCycleYearB.setValue(
      this.userData ? this.userData.studyCycleYearB : null
    );
    this.accountDataForm.controls.courseId.setValue(
      this.userData && this.userData.course ? this.userData.course.id : null
    );
    this.accountDataForm.controls.group.setValue(
      this.userData ? this.userData.group : ''
    );
  }

  public changePasswordModal(): void {
    this.modalVisibility = 'changePassword';
    this.modalTitle = 'Changing your password';
    this.modalButtonText = 'Change password';
    this.modalButtonFunction = this.changePasswordFunction;
    this.errorMessage = null;
  }

  public editAccountModal(): void {
    this.modalVisibility = 'editAccount';
    this.modalTitle = 'Editing your account data';
    this.modalButtonText = 'Edit your account data';
    this.modalButtonFunction = this.editAccountFunction;
    this.errorMessage = null;
    this.getCourseList();
    this.getUserData();
  }

  public deleteAccountModal(): void {
    this.modalVisibility = 'deleteAccount';
    this.modalTitle = 'Deleting your account and all data';
    this.modalButtonText = 'Delete account and all data';
    this.modalButtonFunction = this.deleteAccountFunction;
    this.errorMessage = null;
  }

  public hideModal(): void {
    this.modalVisibility = null;
  }

  public changePasswordFunction(): void {
    this.errorMessage = null;
    if (this.changePasswordForm.valid) {
      const formValues = this.changePasswordForm.value;
      if (formValues.oldPassword && formValues.newPassword) {
        this._changePasswordSubscribtion = this._userEndpointsService
          .changePassword(formValues.oldPassword, formValues.newPassword)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'Your password has been changed!'
              );
              this.errorMessage = null;
              this.modalVisibility = null;
            },
            error: (error: string) => {
              this.errorMessage = error;
            },
          });
      }
    }
  }

  public editAccountFunction(): void {
    this.errorMessage = null;
    if (this.accountDataForm.valid) {
      const formValues = this.accountDataForm.value;
      if (
        formValues.name &&
        formValues.studyCycleYearA !== undefined &&
        formValues.studyCycleYearB !== undefined &&
        formValues.courseId !== undefined
      ) {
        const userInfo: IUserEditRequest = {
          name: formValues.name,
          studyCycleYearA: formValues.studyCycleYearA,
          studyCycleYearB: formValues.studyCycleYearB,
          courseId: formValues.courseId,
          group: formValues.group ? formValues.group : null,
        };
        this._editAccountSubscribtion = this._userEndpointsService
          .updateAccountInfo(userInfo)
          .subscribe({
            next: () => {
              this._notificationService.addNotification(
                'Your account data has been changed!'
              );
              this.errorMessage = null;
              this.modalVisibility = null;
            },
            error: (error: string) => {
              this.errorMessage = error;
            },
          });
      }
    }
  }

  public deleteAccountFunction(): void {
    this._deleteAccountSubscribtion = this._userEndpointsService
      .deleteAccount()
      .subscribe({
        next: () => {
          localStorage.removeItem('jwtToken');
          this._router.navigate(['']);
          this._notificationService.addNotification(
            'Your account has been permamently deleted!'
          );
          this.errorMessage = null;
          this.modalVisibility = null;
        },
        error: (error: string) => {
          this.errorMessage = error;
        },
      });
  }

  public ngOnDestroy(): void {
    this._getMeSubscription.unsubscribe();
    this._changePasswordSubscribtion.unsubscribe();
    this._editAccountSubscribtion.unsubscribe();
    this._deleteAccountSubscribtion.unsubscribe();
    this._getCoursesSubscription.unsubscribe();
  }
}
