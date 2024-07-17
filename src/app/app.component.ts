import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: ` <app-navbar />
    <main class="max-w-full min-h-screen overflow-x-hidden">
      <router-outlet />
    </main>
    <app-footer />`,
})
export class AppComponent {
  public title = 'rag-2-frontend';
}
