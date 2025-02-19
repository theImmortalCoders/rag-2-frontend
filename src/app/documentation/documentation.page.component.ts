import { Component } from '@angular/core';

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  imports: [],
  template: `
    <div class="flex flex-col mt-20 px-20 w-full items-center justify-center">
      <div class="flex flex-col w-full items-center justify-center">
        <h1 class="text-5xl">Thats our docs page</h1>
        <span class="w-2/3 text-center"
          >Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci et
          laudantium odit dolorem eaque. Cumque provident adipisci quo labore
          ullam quam, incidunt fugit, tempore dolor animi perferendis vero
          consequatur. Natus.</span
        >
      </div>
      <div class="grid grid-cols-4 gap-x-16 w-full">
        <div
          class="flex flex-col pt-12 border-[2px] border-mainOrange rounded-tr-2xl p-2">
          <span>NAME OF DOCS</span>
          <span>DESC, SIZE etc</span>
        </div>
        <div class="border-[2px] border-mainOrange rounded-tr-2xl p-2">
          fdsgdf
        </div>
        <div class="border-[2px] border-mainOrange rounded-tr-xl p-2">
          dsfgdfg
        </div>
        <div class="border-[2px] border-mainOrange rounded-tr-xl p-2">
          ghjghj
        </div>
      </div>
    </div>
  `,
})
export class DocumentationPageComponent {}
