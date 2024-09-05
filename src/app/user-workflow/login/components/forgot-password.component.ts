import { Component, inject, OnDestroy } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <button
      type="button"
      (click)="shouldShowInput = !shouldShowInput"
      class="w-fit text-start text-sm hover:underline">
      Forgot your password?
    </button>
    @if (shouldShowInput) {
      <form
        [formGroup]="forgotPasswordForm"
        (submit)="submitButton()"
        class="flex flex-col space-y-4">
        <input
          id="forgotPassword"
          formControlName="email"
          type="text"
          placeholder="Type your email"
          class="custom-input" />
        <button
          type="submit"
          [disabled]="forgotPasswordForm.invalid"
          [class.opacity-50]="forgotPasswordForm.invalid"
          class="rounded-md px-2 py-[6px] bg-mainGray text-mainOrange border-[1px] border-mainOrange text-sm transition-all ease-in-out {{
            forgotPasswordForm.valid
              ? 'hover:bg-mainOrange hover:text-mainGray'
              : ''
          }}">
          Reset your password
        </button>
        @if (resendMessage !== '') {
          <p class="text-red-500">
            {{ resendMessage }}
          </p>
        }
      </form>
    }
  `,
})
export class ForgotPasswordComponent implements OnDestroy {
  private _formBuilder = inject(NonNullableFormBuilder);
  private _userEndpointsService = inject(UserEndpointsService);
  private _notificationService = inject(NotificationService);

  private _forgotPasswordSubscription: Subscription | null = null;

  public shouldShowInput = false;
  public resendMessage = '';

  public forgotPasswordForm = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  public submitButton(): void {
    if (this.forgotPasswordForm.valid && this.forgotPasswordForm.value.email) {
      this._forgotPasswordSubscription = this._userEndpointsService
        .requestPasswordReset(this.forgotPasswordForm.value.email)
        .subscribe({
          next: () => {
            this._notificationService.addNotification(
              'The password reset link has been sent!'
            );
            this.resendMessage = '';
            this.shouldShowInput = false;
            this.forgotPasswordForm.setValue({ email: '' });
          },
          error: (error: string) => {
            this.resendMessage = error;
          },
        });
    }
  }

  public ngOnDestroy(): void {
    if (this._forgotPasswordSubscription) {
      this._forgotPasswordSubscription.unsubscribe();
    }
  }
}
