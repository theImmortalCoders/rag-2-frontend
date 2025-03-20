import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationComponent } from '@commonComponents/notification.component';
import { CookieConsentComponent } from '@commonComponents/cookie-consent.component';
import { CommonModule } from '@angular/common';
import { TestPhaseComponent } from '@commonComponents/test-phase.component';

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
    TestPhaseComponent,
  ],
  template: `
    @if (!isCookiesAccepted) {
      <app-cookie-consent />
    }
    @if (isCookiesAccepted && !isTestingAccepted) {
      <app-test-phase />
    }
    <div
      [ngClass]="{
        'filter blur-sm pointer-events-none':
          !isCookiesAccepted || !isTestingAccepted,
      }">
      <app-notification></app-notification>
      <app-navbar />
      <main
        class="max-w-full min-h-all overflow-x-hidden overflow-y-hidden relative z-40">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class AppComponent {
  public title = 'RUT-AI GAMES 2';
  public isCookiesAccepted = false;
  public isTestingAccepted = false;

  public constructor() {
    this.isCookiesAccepted = localStorage.getItem('cookiesAccepted') === 'true';
    this.isTestingAccepted =
      localStorage.getItem('testPhaseAccepted') === 'true';
  }
}
