import { Component } from '@angular/core';

@Component({
  selector: 'app-error500-page',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col min-h-all w-full bg-mainGray pt-14">
      <div
        class="flex flex-col md:flex-row w-full justify-center items-center text-mainOrange font-mono">
        <h1 class="text-2xl">ERROR 500</h1>
        <img src="" alt="Logo" class="h-56 2xs:h-[17rem] xl:h-96 w-auto" />
        <div class="w-2/3">Internal server error, please try again later</div>
      </div>
    </div>
  `,
})
export class Error500PageComponent {}
