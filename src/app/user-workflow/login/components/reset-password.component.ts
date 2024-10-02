import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [NgOptimizedImage, ReactiveFormsModule],
  template: `
    <div
      class="w-full min-h-screen bg-mainGray items-center lg:items-start flex flex-col lg:flex-row justify-center lg:justify-evenly font-mono pt-12 lg:pt-20 text-mainCreme">
      <div
        class="flex flex-col md:flex-row w-[97%] 2xs:w-11/12 2xl:w-2/3 items-center justify-center border-2 border-mainOrange rounded-lg px-6 py-8 text-mainCreme mb-16">
        <div class="h-80 sm:h-96 w-80 sm:w-96 relative">
          <img
            ngSrc="images/rag-2.png"
            alt="Logo"
            class="object-contain"
            fill />
        </div>
        <div
          class="text-center w-fit md:w-[34rem] py-12 md:py-0 pr-6 md:pr-2 pl-6 md:pl-12 lg:pl-16 xl:md-24">
          <h2 class="text-3xl sm:text-4xl pb-4 font-bold">Dear user...</h2>
          <span class="text-xl sm:text-2xl">
            {{ actionMessage }}
          </span>
          @if (shouldShowForm) {
            <form
              [formGroup]="resetPasswordForm"
              (submit)="submitButton()"
              class="flex flex-col pt-4 space-y-4">
              <input
                id="newPassword"
                formControlName="newPassword"
                type="password"
                placeholder="Type your new password (min. 8 characters)"
                class="custom-input" />
              <button
                type="submit"
                [disabled]="resetPasswordForm.invalid"
                [class.opacity-50]="resetPasswordForm.invalid"
                class="rounded-md px-2 py-[6px] bg-mainGray text-mainOrange border-[1px] border-mainOrange text-sm transition-all ease-in-out {{
                  resetPasswordForm.valid
                    ? 'hover:bg-mainOrange hover:text-mainGray'
                    : ''
                }}">
                Set new password
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _userEndpointsService = inject(UserEndpointsService);
  private _formBuilder = inject(NonNullableFormBuilder);

  private _token: string | null = null;
  private _resetPasswordSubscription: Subscription | null = null;
  private _router: Router = new Router();

  public resetPasswordForm = this._formBuilder.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  public actionMessage = 'Please type your new password';
  public shouldShowForm = true;

  public ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this._token = params['token'] || null;
    });
    if (!this._token) {
      this._router.navigate(['/']);
    }
  }

  public submitButton(): void {
    if (this._token && this.resetPasswordForm.value.newPassword) {
      this._resetPasswordSubscription = this._userEndpointsService
        .resetPassword(this._token, this.resetPasswordForm.value.newPassword)
        .subscribe({
          next: () => {
            this.actionMessage =
              'Your password has been reseted. You can close this card.';
            this.shouldShowForm = false;
          },
          error: (error: string) => {
            this.actionMessage = error;
            this.shouldShowForm = true;
          },
        });
    }
  }

  public ngOnDestroy(): void {
    if (this._resetPasswordSubscription) {
      this._resetPasswordSubscription.unsubscribe();
    }
  }
}
