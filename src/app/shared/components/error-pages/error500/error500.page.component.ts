import { Component } from '@angular/core';
import { Rag2LogoComponent } from '../../common/rag-2-logo.component';

@Component({
  selector: 'app-error500-page',
  standalone: true,
  imports: [Rag2LogoComponent],
  template: `
    <div
      class="flex flex-col min-h-all w-full bg-mainGray pt-20 text-mainOrange font-mono items-center">
      <h1
        id="headerError500"
        class="text-5xl 2xs:text-7xl pb-10 font-bold w-full text-center">
        ERROR 500
      </h1>
      <div
        class="flex flex-col md:flex-row w-[97%] 2xs:w-11/12 2xl:w-2/3 items-center justify-center border-2 border-mainOrange rounded-lg px-6 py-8 text-mainCreme mb-16">
        <app-rag-2-logo
          class="h-80 sm:h-96 w-80 sm:w-96 relative"
          [isPriority]="true" />
        <div
          class="text-center py-12 md:py-0 pr-6 md:pr-2 pl-6 md:pl-12 lg:pl-16 xl:md-24">
          <h2 class="text-3xl sm:text-4xl pb-4 font-bold">Unfortunately...</h2>
          <span class="text-xl sm:text-2xl"
            >Internal server error, please try again later
            <span class="whitespace-nowrap">:(</span></span
          >
        </div>
      </div>
    </div>
  `,
})
export class Error500PageComponent {}
