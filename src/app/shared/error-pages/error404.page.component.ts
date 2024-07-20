import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-error404-page',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div
      class="flex flex-col min-h-all w-full bg-mainGray pt-20 text-mainOrange font-mono">
      <h1 class="text-5xl 2xs:text-7xl font-bold w-full text-center">
        ERROR 404
      </h1>
      <div
        class="flex flex-col md:flex-row w-full items-center justify-center pt-16">
        <div class="h-80 sm:h-96 w-80 sm:w-96 relative">
          <img
            ngSrc="images/rag-2.png"
            alt="Logo"
            class="object-contain"
            fill
            priority />
        </div>
        <div
          class="text-center py-12 md:py-0 pr-6 md:pr-2 pl-6 md:pl-12 lg:pl-16 xl:md-24">
          <h2 class="text-3xl sm:text-4xl pb-4 font-bold">Unfortunately...</h2>
          <span class="text-xl sm:text-2xl"
            >The page you are looking for doesn't exist</span
          >
        </div>
      </div>
    </div>
  `,
})
export class Error404PageComponent {}
