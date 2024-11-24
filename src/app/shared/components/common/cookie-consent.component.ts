import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div
        class="bg-lightGray rounded-lg shadow-lg p-6 text-center border-2 border-mainOrange">
        <div
          class="flex flex-row space-x-2 w-full items-center justify-center pb-4">
          <h1 class="text-2xl text-mainOrange font-semibold">COOKIE CONSENT</h1>
          <mat-icon class="text-mainOrange text-xl font-thin">cookie</mat-icon>
        </div>
        <p class="text-mainCreme mb-4">
          This website uses cookies to ensure the best quality of service.
          Please accept cookies to continue using the site.
        </p>
        <button
          (click)="acceptCookies()"
          class="px-4 py-2 bg-mainOrange bg-opacity-80 text-mainCreme rounded hover:bg-opacity-100 focus:outline-none ease-in-out duration-200 transition-all">
          ACCEPT
        </button>
      </div>
    </div>
  `,
})
export class CookieConsentComponent {
  public acceptCookies(): void {
    localStorage.setItem('cookiesAccepted', 'true');
    window.location.reload();
  }
}
