import { Component, Input } from '@angular/core';
import { authorsData, IAuthor } from 'app/home/models/author';
import { PRzLogoComponent } from '../../../shared/components/common/prz-logo.component';
import { GestLogoComponent } from '../../../shared/components/common/gest-logo.component';

@Component({
  selector: 'app-author-cards',
  standalone: true,
  imports: [PRzLogoComponent, GestLogoComponent],
  template: `
    <app-prz-logo
      class="size-48 sm:size-64 md:size-80 xl:size-[22rem] relative transition-all ease-in-out duration-300 {{
        currentChoosenAuthor.index === -1
          ? 'opacity-95 translate-x-0'
          : 'opacity-0 translate-x-72'
      }}"
      [isPriority]="true" />
    <div
      class="h-32 2xs:h-36 xs:h-44 lg:h-48 xl:h-64 w-[2px] bg-mainOrange transition-all ease-in-out duration-300 {{
        currentChoosenAuthor.index === -1
          ? 'opacity-95 translate-x-0'
          : 'opacity-0 translate-x-72'
      }}"></div>
    <app-gest-logo
      class="size-48 sm:size-64 md:size-80 xl:size-[22rem] relative transition-all ease-in-out duration-300 {{
        currentChoosenAuthor.index === -1
          ? 'opacity-95 translate-x-0'
          : 'opacity-0 translate-x-72'
      }}"
      [isPriority]="true" />
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
        <ul
          id="authorsTechStackList"
          class="grid grid-cols-2 sm:grid-cols-3 gap-y-2">
          @for (stackItem of author.techStack; track stackItem) {
            <li
              class="flex flex-row items-center space-x-2 text-2xs 2xs:text-xs lg:text-sm xl:text-base">
              <i data-feather="circle" class="size-2 text-mainGray"></i>
              <p class="w-full">{{ stackItem }}</p>
            </li>
          }
        </ul>
        <h2
          class="text-base 2xs:text-lg lg:text-xl xl:text-2xl text-mainOrange font-bold">
          Hobbies and interests:
        </h2>
        <h3 class="text-2xs 2xs:text-xs lg:text-sm xl:text-base italic">
          {{ author.hobbies }}
        </h3>
        <div class="flex flex-row space-x-6 xl:space-x-8 pt-2">
          <a
            [href]="'https://github.com/' + author.githubName"
            target="_blank"
            title="The link opens in a new browser window"
            [attr.aria-label]="'GitHub profile ' + author.name">
            <i
              data-feather="github"
              class="relative z-40 size-6 2xs:size-7 lg:size-8 xl:size-10 text-mainGray"></i>
          </a>
          <a
            [href]="'https://linkedin.com/in/' + author.linkedinName"
            target="_blank"
            title="The link opens in a new browser window"
            [attr.aria-label]="'LinkedIn profile' + author.name">
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
