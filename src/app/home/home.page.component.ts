import { NgOptimizedImage } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import feather from 'feather-icons';
import { authorsData, IAuthor } from './models/author';
import { AuthorCardsComponent } from './components/author-cards/author-cards.component';
import { ShortGameStatsComponent } from './components/short-game-stats/short-game-stats.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgOptimizedImage, AuthorCardsComponent, ShortGameStatsComponent],
  template: `
    <div class="flex flex-col w-full bg-mainGray">
      <div
        class="bg-homeImageAI bg-center pb-10 pt-6 xl:pt-14 relative min-h-all border-b-2 border-mainOrange">
        <div
          class="absolute top-0 left-0 w-full h-full bg-mainGray opacity-80"></div>
        <div
          class="flex flex-col md:flex-row w-full h-max items-center justify-center md:justify-between lg:justify-evenly text-mainCreme font-mono pb-6">
          <div
            class="flex flex-col mt-4 md:mt-16 pl-0 xs:pl-64 sm:pl-24 md:pl-14 lg:pl-6 pr-0 lg:pr-6 pb-40 relative z-50">
            <h1
              class="text-2xl 2xs:text-3xl lg:text-4xl xl:text-5xl h-9 xs:h-10 md:h-12 xl:h-16 relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter21 before:bg-mainCreme after:absolute after:inset-0 after:w-[0.125em] after:animate-caret21 after:bg-black">
              What's going on here?
            </h1>
            <span
              class="text-sm sm:text-base md:text-lg lg:text-xl text-mainCreme pt-2 pb-2 sm:pb-0"
              >Authors:</span
            >
            <div
              class="grid grid-cols-3 xs:grid-cols-6 md:grid-cols-3 gap-y-10 sm:gap-y-16 lg:flex lg:flex-row w-full gap-x-8 xs:gap-x-40 md:gap-x-5 lg:gap-x-12">
              @for (author of authors; track author.name) {
                <button
                  (click)="chooseAuthor($index, author.githubName)"
                  class="{{
                    $index === currentChoosenAuthor.index
                      ? 'scale-125 opacity-100 font-bold'
                      : 'opacity-85'
                  }} {{
                    $index === 0
                      ? 'bg-homeImageUser0'
                      : $index === 1
                        ? 'bg-homeImageUser1'
                        : 'bg-homeImageUser2'
                  }} border-2 border-mainOrange text-mainOrange text-wrap lg:text-nowrap ease-in-out transition-all duration-200 size-20 xs:size-24 lg:size-28 xl:size-28 bg-center bg-cover rounded-full pt-20 xs:pt-24 lg:pt-28 mt-4 flex justify-center text-center text-sm sm:text-base">
                  <span class="pt-2">
                    {{ author.name }}
                  </span>
                </button>
              }
            </div>
          </div>
          <app-author-cards
            class="flex w-full pt-24 md:pt-0 md:w-1/3 items-center justify-center relative"
            [currentChoosenAuthor]="currentChoosenAuthor" />
        </div>
        <div
          class="flex w-full items-end justify-end text-mainCreme font-mono mt-36 2xs:mt-44 sm:mt-40 md:mt-2 relative z-50">
          <span
            class="w-[97%] lg:w-11/12 xl:w-3/4 pr-2 border-l-2 border-b-2 pl-2 pb-2 border-mainOrange text-justify text-sm md:text-base lg:text-lg xl:text-xl">
            Explore the world of interactive learning and entertainment with our
            innovative web application! Our project is more than just a
            collection of mini-games - it's a true fusion of artificial
            intelligence and entertainment. We have designed an application that
            not only provides great fun but also allows for data collection and
            strategy learning for artificial intelligence.
          </span>
        </div>
      </div>
      <div
        class="flex flex-col xs:flex-row items-center justify-center xs:justify-around space-x-0 px-2 xs:px-8 md:px-16 bg-lightGray pt-10 pb-6 md:py-10">
        <div class="flex items-center justify-center pr-3 md:pr-2 lg:pr-0">
          <div
            class="h-28 2xs:h-36 xs:h-28 sm:h-36 md:h-52 lg:h-60 xl:h-64 w-64 2xs:w-80 xs:w-64 sm:w-80 md:w-[26rem] lg:w-[30rem] xl:w-[36rem] relative">
            <img
              ngSrc="images/ai.jpg"
              alt="ai image"
              class="object-contain rounded-full"
              fill />
          </div>
        </div>
        <app-short-game-stats class="flex flex-col pt-8 xs:pt-0" />
      </div>
      <div class="flex w-full items-center justify-start bg-lightGray pb-10">
        <span
          id="animatedElement"
          class="transform transition-all duration-1000 flex w-full 2xs:w-[97%] xs:w-11/12 sm:w-4/5 md:w-2/3 lg:w-[63%] xl:w-[58%] 2xl:w-1/2 h-20 text-justify items-center justify-center bg-mainOrange text-sm md:text-base lg:text-lg xl:text-xl px-2 xs:px-4 sm:px-10 font-mono mt-0 2xs:mt-4 xs:mt-8 sm:mt-16">
          Don't wait any longer - join our community and start your adventure
          with interactive learning and entertainment today!
        </span>
      </div>
    </div>
  `,
})
export class HomePageComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  public currentChoosenAuthor = { index: -1, githubName: '' };

  public authors: IAuthor[] = authorsData;

  public constructor(private _el: ElementRef) {}

  public ngOnInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', '-translate-x-96');
        } else {
          entry.target.classList.add('opacity-0', '-translate-x-96');
        }
      });
    });

    const element = this._el.nativeElement.querySelector('#animatedElement');
    observer.observe(element);
  }

  public ngAfterViewInit(): void {
    feather.replace();
  }

  public ngAfterViewChecked(): void {
    feather.replace();
  }

  public chooseAuthor(index: number, githubName: string): void {
    if (index === this.currentChoosenAuthor.index) {
      this.currentChoosenAuthor = { index: -1, githubName };
    } else {
      this.currentChoosenAuthor = { index, githubName };
    }
  }
}
