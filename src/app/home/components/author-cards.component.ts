import { Component, Input } from '@angular/core';
import { authorsData, IAuthor } from '../models/author';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-author-cards',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div
      class="h-64 2xs:h-72 xs:h-80 xl:h-96 w-64 2xs:w-72 xs:w-80 xl:w-96 absolute transition-all ease-in-out duration-300 {{
        currentChoosenAuthor.index === -1
          ? 'opacity-95 right-[12%] 2xs:right-[20%] xs:right-[30%] md:right-[15%] 2xl:right-1/3'
          : 'opacity-0 -right-[50rem]'
      }}">
      <img
        ngSrc="images/rag-2.png"
        alt="Logo"
        class="object-contain"
        fill
        priority />
    </div>
    @for (author of authors; track author.name) {
      <div
        class="author-card flex flex-col space-y-1 2xs:space-y-2 w-[85%] xs:w-3/4 md:w-[130%] lg:w-[120%] h-fit bg-mainCreme text-mainGray rounded-xl py-3 2xs:py-4 px-4 2xs:px-5 lg:p-6 absolute transition-all ease-in-out duration-300 {{
          currentChoosenAuthor.index === $index
            ? 'opacity-100 right-[7.5%] xs:right-[12.5%] md:right-[7%] lg:-right-[5%]'
            : 'opacity-0 -right-[50rem]'
        }}">
        <h1 class="text-xl 2xs:text-2xl lg:text-3xl xl:text-4xl font-bold">
          {{ author.name }}
        </h1>
        <hr class="bg-mainGray h-[2px] 2xs:h-1 lg:h-[6px] xl:h-2 rounded-md" />
        <h2
          class="text-base 2xs:text-lg lg:text-xl xl:text-2xl italic text-center">
          {{ author.role }}
        </h2>
        <h2
          class="text-base 2xs:text-lg lg:text-xl xl:text-2xl text-mainOrange font-bold">
          Main tech-stack:
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
          @for (stackItem of author.techStack; track stackItem) {
            <span
              class="flex flex-row items-center space-x-2 text-2xs 2xs:text-xs lg:text-sm xl:text-base"
              ><i data-feather="circle" class="size-2 text-mainGray"></i>
              <p class="w-full">{{ stackItem }}</p></span
            >
          }
        </div>
        <h2
          class="text-base 2xs:text-lg lg:text-xl xl:text-2xl text-mainOrange font-bold">
          Hobbies and interests:
        </h2>
        <h3 class="text-2xs 2xs:text-xs lg:text-sm xl:text-base italic">
          {{ author.hobbies }}
        </h3>
        <div class="flex flex-row space-x-6 xl:space-x-8 pt-2">
          <a [href]="'https://github.com/' + author.githubName" target="_blank">
            <i
              data-feather="github"
              class="relative z-40 size-6 2xs:size-7 lg:size-8 xl:size-10 text-mainGray"></i>
          </a>
          <a
            [href]="'https://linkedin.com/in/' + author.linkedinName"
            target="_blank">
            <i
              data-feather="linkedin"
              class="relative z-40 size-6 2xs:size-7 lg:size-8 xl:size-10 text-mainGray"></i>
          </a>
        </div>
      </div>
    }
  `,
})
export class AuthorCardsComponent {
  @Input({ required: true }) public currentChoosenAuthor!: {
    index: number;
    githubName: string;
  };

  public authors: IAuthor[] = authorsData;
}
