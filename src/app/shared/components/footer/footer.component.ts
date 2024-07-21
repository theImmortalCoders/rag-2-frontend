import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
    <footer
      class="flex flex-col font-mono items-center justify-around bg-darkGray shadow-footerShadow w-full py-4 relative z-40">
      <div
        class="flex flex-row w-full items-center text-sm md:text-base font-extrabold uppercase justify-around text-mainCreme my-2">
        AUTHORS:
      </div>
      <div
        class="flex gap-10 text-xs md:text-base w-full md:w-11/12 lg:w-4/5 items-center justify-center text-mainCreme pb-4">
        <span class="text-center">
          <a href="https://github.com/pablitoo1" target="_blank">
            Paweł Buczek
          </a>
        </span>
        <span class="text-center">
          <a href="https://github.com/marcinbator" target="_blank">
            Marcin Bator
          </a>
        </span>
      </div>
      <hr class="w-full h-[2px] bg-gray-900 border-0" />
      <div
        class="flex flex-col 2xs:flex-row space-y-6 2xs:space-y-0 w-full items-center justify-around pt-4">
        <a href="http://vision.kia.prz.edu.pl/gest/" target="_blank">
          <img
            src=""
            alt="Logo LKS"
            class="h-20 2xs:h-16 sm:h-20 md:h-28 w-auto" />
        </a>
        <a href="https://w.prz.edu.pl/" target="_blank" class="">
          <img
            src=""
            alt="Logo Polonia Hyżne"
            class="h-12 2xs:h-9 sm:h-12 md:h-16 w-auto" />
        </a>
      </div>
    </footer>
  `,
  styles: ``,
})
export class FooterComponent {}
