import { Component, Input } from '@angular/core';
import { authorsData, IAuthor } from '../models/author';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-author-cards',
  standalone: true,
  imports: [NgOptimizedImage],
  template: `
    <div
      class=" h-80 sm:h-96 w-80 sm:w-96 absolute transition-all ease-in-out duration-300 {{
        currentChoosenAuthor.index === -1
          ? 'opacity-100 right-1/3'
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
        class="flex flex-col space-y-2 w-full h-fit bg-mainCreme text-mainGray rounded-xl p-6 absolute transition-all ease-in-out duration-300 {{
          currentChoosenAuthor.index === $index
            ? 'opacity-100 right-[10%]'
            : 'opacity-0 -right-[50rem]'
        }}">
        <h1 class="text-4xl font-bold">{{ author.name }}</h1>
        <hr class="bg-mainGray h-2 rounded-md" />
        <h2 class="text-2xl italic text-center">{{ author.role }}</h2>
        <h2 class="text-2xl text-mainOrange font-bold">Main tech-stack:</h2>
        <div class="grid grid-cols-3 gap-y-2">
          @for (stackItem of author.techStack; track stackItem) {
            <span class="flex flex-row items-center space-x-2"
              ><i data-feather="circle" class="size-2 text-mainGray"></i>
              <p>{{ stackItem }}</p></span
            >
          }
        </div>
        <h2 class="text-2xl text-mainOrange font-bold">
          Hobbies and interests:
        </h2>
        <h3 class="italic">
          {{ author.hobbies }}
        </h3>
        <div class="flex flex-row space-x-8 pt-2">
          <a [href]="'https://github.com/' + author.githubName" target="_blank">
            <i
              data-feather="github"
              class="relative z-40 size-10 text-mainGray"></i>
          </a>
          <a
            [href]="'https://linkedin.com/in/' + author.linkedinName"
            target="_blank">
            <i
              data-feather="linkedin"
              class="relative z-40 size-10 text-mainGray"></i>
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
