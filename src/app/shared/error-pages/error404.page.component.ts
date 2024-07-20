import { Component } from '@angular/core';

@Component({
  selector: 'app-error404-page',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col min-h-all w-full bg-mainGray pt-14">
      <div
        class="flex flex-col md:flex-row w-full justify-center items-center text-mainOrange font-mono">
        <h1 class="text-2xl">ERROR 404</h1>
        <img src="" alt="Logo" class="h-56 2xs:h-[17rem] xl:h-96 w-auto" />
        <div class="w-2/3">The page you are looking for doesn't exist</div>
      </div>
    </div>
  `,
})
export class Error404PageComponent {}
