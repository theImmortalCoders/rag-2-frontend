import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NotificationComponent } from './shared/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    NotificationComponent,
  ],
  template: `
    <app-notification></app-notification>
    <app-navbar />
    <main class="max-w-full min-h-all overflow-x-hidden relative z-40">
      <router-outlet />
    </main>
    <app-footer />
  `,
})
export class AppComponent {
  public title = 'rag-2-frontend';
}
