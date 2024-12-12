import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationComponent } from '@commonComponents/notification.component';
import { CookieConsentComponent } from '@commonComponents/cookie-consent.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    NotificationComponent,
    CookieConsentComponent,
    CommonModule,
  ],
  template: `
    @if (!isCookiesAccepted) {
      <app-cookie-consent />
    }
    <div
      [ngClass]="{ 'filter blur-sm pointer-events-none': !isCookiesAccepted }">
      <app-notification></app-notification>
      <app-navbar />
      <main class="max-w-full min-h-all overflow-x-hidden relative z-40">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent {
  public title = 'RUT-AI GAMES 2';
  public isCookiesAccepted = false;

  public constructor() {
    this.isCookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
  }
}
