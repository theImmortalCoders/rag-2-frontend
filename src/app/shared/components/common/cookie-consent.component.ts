import { Component } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [],
  template: `
    <div
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div
        class="bg-lightGray rounded-lg shadow-lg p-6 text-center border-2 border-mainOrange">
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
