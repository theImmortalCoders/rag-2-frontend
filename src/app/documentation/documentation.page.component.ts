import { AfterViewInit, Component } from '@angular/core';
import * as feather from 'feather-icons';

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  imports: [],
  template: `
    <div
      class="flex flex-col mt-6 py-9 md:py-14 px-0 sm:px-4 md:px-8 lg:px-14 xl:px-20 w-full items-center justify-center font-mono">
      <h1
        class="text-center uppercase text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl mb-4 md:mb-8 text-mainCreme">
        Check the documentation we prepared to help:
      </h1>
      <div
        class="h-[2px] lg:h-[4px] bg-mainCreme w-full mb-2 xs:mb-4 md:mb-8"></div>
      <div class="grid grid-cols-4 gap-x-16 w-full px-4 pt-8">
        <div class="flex flex-col p-3 space-y-8">
          <div
            class="flex flex-row space-x-2 w-full items-center justify-center">
            <span class="text-3xl text-mainCreme font-bold tracking-wider"
              >GAME CREATION</span
            >
            <i data-feather="tool" class="text-mainCreme fill- size-6"></i>
          </div>
          <span class="text-justify text-mainCreme"
            >This document provides guidelines for developers on how to create
            new games while ensuring compatibility with the existing system. It
            covers best practices, coding standards, and integration
            requirements to maintain consistency across all projects.</span
          >
          <button
            class="w-full border-[1px] border-mainCreme py-2 px-4 bg-mainGray text-mainCreme font-bold text-center hover:bg-mainCreme hover:text-mainGray ease-in-out transition-all duration-300">
            DOWNLOAD (PDF, 90MB)
          </button>
        </div>
        <div class="flex flex-col p-3 space-y-8 border-[2px] border-mainOrange">
          <div
            class="flex flex-row space-x-2 w-full items-center justify-center">
            <span class="text-3xl text-mainCreme font-bold tracking-wider"
              >GAME CREATION</span
            >
            <i data-feather="tool" class="text-mainCreme fill- size-6"></i>
          </div>
          <span class="text-justify text-mainCreme"
            >This document provides guidelines for developers on how to create
            new games while ensuring compatibility with the existing system. It
            covers best practices, coding standards, and integration
            requirements to maintain consistency across all projects.</span
          >
          <button
            class="w-full border-[1px] border-mainCreme py-2 px-4 bg-mainGray text-mainCreme font-bold text-center hover:bg-mainCreme hover:text-mainGray ease-in-out transition-all duration-300">
            DOWNLOAD (PDF, 90MB)
          </button>
        </div>
        <div class="flex flex-col p-3 space-y-8 border-[2px] border-mainOrange">
          <div
            class="flex flex-row space-x-2 w-full items-center justify-center">
            <span class="text-3xl text-mainOrange font-bold tracking-wider"
              >GAME CREATION</span
            >
            <i
              data-feather="tool"
              class="text-mainOrange fill-mainOrange size-6"></i>
          </div>
          <span class="text-justify text-mainCreme"
            >This document provides guidelines for developers on how to create
            new games while ensuring compatibility with the existing system. It
            covers best practices, coding standards, and integration
            requirements to maintain consistency across all projects.</span
          >
          <button
            class="w-full border-[1px] border-mainCreme py-2 px-4 bg-mainGray text-mainCreme font-bold text-center hover:bg-mainCreme hover:text-mainGray ease-in-out transition-all duration-300">
            DOWNLOAD (PDF, 90MB)
          </button>
        </div>
        <div class="flex flex-col p-3 space-y-8 border-[2px] border-mainGray">
          <div
            class="flex flex-row space-x-2 w-full items-center justify-center">
            <span class="text-3xl text-mainCreme font-bold tracking-wider"
              >GAME CREATION</span
            >
            <i data-feather="tool" class="text-mainCreme fill- size-6"></i>
          </div>
          <span class="text-justify text-mainCreme"
            >This document provides guidelines for developers on how to create
            new games while ensuring compatibility with the existing system. It
            covers best practices, coding standards, and integration
            requirements to maintain consistency across all projects.</span
          >
          <button
            class="w-full border-[1px] border-mainOrange py-2 px-4 bg-mainGray text-mainOrange font-bold text-center hover:bg-mainOrange hover:text-mainGray ease-in-out transition-all duration-300">
            DOWNLOAD (PDF, 90MB)
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DocumentationPageComponent implements AfterViewInit {
  public ngAfterViewInit(): void {
    feather.replace();
  }
}
