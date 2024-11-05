import { NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserEndpointsService } from '@endpoints/user-endpoints.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-confirm',
  standalone: true,
  imports: [NgOptimizedImage],
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
            @if (actionMessage !== null) {
              {{ actionMessage }}
            }
          </span>
        </div>
      </div>
    </div>
  `,
})
export class RegisterConfirmComponent implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _userEndpointsService = inject(UserEndpointsService);

  private _token: string | null = null;
  private _confirmSubscription = new Subscription();
  private _router: Router = new Router();

  public actionMessage: string | null = null;

  public ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this._token = params['token'] || null;
    });
    if (this._token) {
      this.confirmAccount(this._token);
    } else {
      this._router.navigate(['/']);
    }
  }

  private confirmAccount(token: string): void {
    this._confirmSubscription = this._userEndpointsService
      .confirmAccount(token)
      .subscribe({
        next: () => {
          this.actionMessage =
            'Thanks for confirming your email address. You can close this card.';
        },
        error: (error: string) => {
          this.actionMessage = error;
        },
      });
  }

  public ngOnDestroy(): void {
    this._confirmSubscription.unsubscribe();
  }
}
