import { AfterViewInit, Component } from '@angular/core';
import * as feather from 'feather-icons';
import { SingleDocComponent } from './components/single-doc/single-doc.component';

@Component({
  selector: 'app-documentation-page',
  standalone: true,
  imports: [SingleDocComponent],
  template: `
    <div
      class="flex flex-col mt-6 py-9 md:py-14 px-0 sm:px-4 md:px-8 lg:px-14 xl:px-20 w-full items-center justify-center font-mono">
      <h1
        id="documentationPageHeader"
        class="text-center uppercase text-lg 2xs:text-xl xs:text-2xl sm:text-3xl md:text-4xl xl:text-5xl mb-4 md:mb-8 text-mainCreme px-2">
        Check the documentation we prepared to help:
      </h1>
      <div
        class="h-[2px] lg:h-[4px] bg-mainCreme w-full mb-2 xs:mb-4 md:mb-8"></div>
      <div
        id="documentationTilesContainer"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 2xl:gap-x-16 gap-y-10 md:gap-y-16 w-full px-6 xl:px-10 pt-2 lg:pt-6 xl:pt-8 items-stretch">
        <app-single-doc
          class="flex flex-col p-3 space-y-8 h-full"
          [header]="'GAME CREATION'"
          [description]="
            'Manual of our game creation NPM script and steps to follow if you want to contribute to our system and create your own game'
          "
          [icon]="'tool'"
          [fileName]="'docs/rag-2-game-creation-manual.pdf'"
          [isAvailable]="true" />
        <app-single-doc
          class="flex flex-col p-3 space-y-8 h-full"
          [header]="'MODEL CONNECTION'"
          [description]="
            'Step-by-step instruction of how you can build your own steering service and connect it to one of our games'
          "
          [icon]="'share-2'"
          [fileName]="'/docs/rag-2-models-manual.pdf'"
          [isAvailable]="true" />
        <app-single-doc
          class="flex flex-col p-3 space-y-8 h-full"
          [header]="'MOBILE APP SUPPORT'"
          [description]="
            'Instructions on how to install our mobile application and use it to control characters'
          "
          [icon]="'smartphone'"
          [isAvailable]="false" />
        <app-single-doc
          class="flex flex-col p-3 space-y-8 h-full"
          [header]="'SITE RELIABILITY'"
          [description]="
            'Description of how we ensure the reliability of our application, e.g. by writing tests'
          "
          [icon]="'shield'"
          [isAvailable]="false" />
        <app-single-doc
          class="flex flex-col p-3 space-y-8 h-full"
          [header]="'ACCESSIBILITY STATEMENT'"
          [description]="
            'Learn what accessibility rules we commit to follow on this website'
          "
          [icon]="'book-open'"
          [fileName]="
            'docs/lista_kontrolna_do_badania_dostepnosci_cyfrowej_strony_rutai_kia_prz_edu_pl.pdf'
          "
          [isAvailable]="true" />
      </div>
    </div>
  `,
})
export class DocumentationPageComponent implements AfterViewInit {
  public ngAfterViewInit(): void {
    feather.replace();
  }
}
