import { Component, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav
      class="bg-darkGray min-w-max pl-6 py-4 shadow-navbarShadow relative z-50">
      <div class="flex mx-auto w-full flex-row items-center justify-between">
        <div
          class="flex w-1/2 xs:w-[60%] sm:w-5/12 lg:w-1/3 justify-between items-center">
          <a [routerLink]="['/']">
            <img src="" alt="Logo" class="h-12 w-auto" />
          </a>
          <span class="text-3xl font-mono text-mainOrange hidden xs:block"
            >RAG-2</span
          >
        </div>
        <a [routerLink]="['/login']" class="mr-10"
          ><i data-feather="users" class="text-mainOrange size-9"></i
        ></a>
      </div>
    </nav>
  `,
  styles: ``,
})
export class NavbarComponent implements AfterViewInit {
  public ngAfterViewInit(): void {
    feather.replace();
  }
}
