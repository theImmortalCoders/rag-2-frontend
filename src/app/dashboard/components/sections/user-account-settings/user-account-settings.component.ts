/* eslint-disable max-lines */
import { Component, inject, OnDestroy } from '@angular/core';
import { ModalComponent } from '../../shared/modal.component';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormValidationService } from 'app/shared/services/form-validation.service';
import { Subscription } from 'rxjs';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';

@Component({
  selector: 'app-user-account-settings',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule],
  template: `
    <h1 class="text-xl xs:text-2xl sm:text-4xl font-bold text-mainOrange">
      User account settings
    </h1>
    <hr class="w-full border-[1px] sm:border-2 border-mainOrange mb-4" />
    <div
      class="flex flex-col xs:flex-row justify-around gap-y-2 xs:gap-y-0 space-x-0 xs:space-x-4 sm:space-x-8 w-full">
      <button
        type="button"
        (click)="changePasswordModal()"
        class="dashboard-button group">
        <span>Change your password</span>
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
          <h2 class="text-3xl text-mainCreme font-bold mb-10">
            {{ modalTitle }}
          </h2>
          @if (modalVisibility === 'changePassword') {
            <form
              [formGroup]="changePasswordForm"
              class="flex flex-col space-y-4 w-full">
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
          } @else if (modalVisibility === 'deleteAccount') {
            <p class="mb-4">
              You will lose all your data, progress, and saved games and will
              not be able to undo it.
            </p>
            <p class="text-red-500">
              Are you sure about this action? It can't be undone later!
            </p>
          }
          <button
            class="flex flex-row w-full items-center justify-center group space-x-2 rounded-lg mt-6 px-3 py-2 bg-mainGray text-mainOrange border-2 border-mainOrange transition-all ease-in-out hover:bg-mainOrange hover:text-mainGray text-base"
            (click)="modalButtonFunction()">
            {{ modalButtonText }}
          </button>
          <button
            (click)="hideModal()"
            class="absolute top-2 right-4 text-5xl text-mainOrange hover:text-mainGray">
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
        </div>
      </app-modal>
    }
  `,
})
export class UserAccountSettingsComponent implements OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _formValidationService = inject(FormValidationService);
  private _userEndpointsService = inject(UserEndpointsService);
  private _notificationService = inject(NotificationService);

  private _changePasswordSubscribtion: Subscription | null = null;
  private _deleteAccountSubscribtion: Subscription | null = null;

  public changePasswordForm = this._formBuilder.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  public errorMessage: string | null = null;

  public modalVisibility: 'changePassword' | 'deleteAccount' | null = null;
  public modalTitle = '';
  public modalButtonText = '';
  public modalButtonFunction!: () => void;

  public shouldShowError(controlName: string): boolean | undefined {
    return this._formValidationService.shouldShowError(
      this.changePasswordForm,
      controlName
    );
  }

  public getFormErrors(): string[] {
    return this._formValidationService.getFormErrors(this.changePasswordForm);
  }

  public changePasswordModal(): void {
    this.modalVisibility = 'changePassword';
    this.modalTitle = 'Changing your password';
    this.modalButtonText = 'Change password';
    this.modalButtonFunction = this.changePasswordFunction;
    this.errorMessage = null;
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

  public deleteAccountFunction(): void {
    this._deleteAccountSubscribtion = this._userEndpointsService
      .deleteAccount()
      .subscribe({
        next: () => {
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
    if (this._changePasswordSubscribtion) {
      this._changePasswordSubscribtion.unsubscribe();
    }
    if (this._deleteAccountSubscribtion) {
      this._deleteAccountSubscribtion.unsubscribe();
    }
  }
}
