import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<nav
    class="bg-mainGray min-w-max pl-6 py-4 shadow-navbarShadow relative z-50">
    <div class="flex mx-auto w-full flex-row items-center justify-between">
      <div
        class="flex w-1/2 xs:w-[60%] sm:w-5/12 lg:w-1/3 justify-between items-center">
        <a href="/">
          <img src="" alt="Logo" class="h-12 w-auto" />
        </a>
        <span class="text-3xl font-mono text-mainOrange hidden xs:block"
          >RUT-AI GAMES</span
        >
      </div>
    </div>
  </nav>`,
})
export class AppComponent {
  public title = 'rag-2-frontend';
}
