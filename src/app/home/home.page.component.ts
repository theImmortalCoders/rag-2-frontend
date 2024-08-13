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
import { AuthorCardsComponent } from './components/author-cards.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgOptimizedImage, AuthorCardsComponent],
  template: ` <div class="flex flex-col w-full bg-mainGray pt-6 xl:pt-14">
    <div>
      <div
        class="flex flex-col md:flex-row w-full h-max items-center justify-center md:justify-between lg:justify-evenly text-mainOrange font-mono pb-6">
        <div
          class="flex flex-col space-y-2 2xs:space-y-4 sm:space-y-6 md:space-y-8 mt-4 md:mt-16 pl-0 xs:pl-64 sm:pl-24 md:pl-14 lg:pl-6 pr-0 lg:pr-6 pb-40">
          <h1
            class="text-2xl 2xs:text-3xl lg:text-4xl xl:text-5xl h-9 xs:h-10 md:h-12 xl:h-16 relative w-[max-content] font-mono before:absolute before:inset-0 before:animate-typewriter21 before:bg-mainGray after:absolute after:inset-0 after:w-[0.125em] after:animate-caret21 after:bg-black">
            What's going on here?
          </h1>
          <span
            class="text-sm sm:text-base md:text-lg lg:text-xl text-mainCreme underline"
            >Authors:</span
          >
          <div
            class="grid grid-cols-3 xs:grid-cols-6 md:grid-cols-3 gap-y-10 sm:gap-y-16 lg:flex lg:flex-row w-full gap-x-6 xs:gap-x-36 md:gap-x-3 lg:gap-x-8">
            @for (author of authors; track author.name) {
              <button
                (click)="chooseAuthor($index, author.githubName)"
                target="_blank"
                class="{{
                  $index === currentChoosenAuthor.index
                    ? 'scale-125 opacity-100'
                    : 'opacity-75'
                }} ease-in-out transition-all duration-200 size-[90px] xs:size-24 lg:size-28 xl:size-32 bg-center bg-cover rounded-full pt-28 xl:pt-32 flex justify-center text-center text-sm sm:text-base"
                style="background-image: url('images/user.png');">
                {{ author.name }}
              </button>
            }
          </div>
        </div>
        <app-author-cards
          class="flex w-full pt-24 md:pt-0 md:w-1/3 items-center justify-center relative"
          [currentChoosenAuthor]="currentChoosenAuthor" />
      </div>
      <div
        class="flex w-full items-end justify-end text-mainCreme font-mono mt-36 2xs:mt-44 sm:mt-40 md:mt-2 xl:mt-10">
        <span
          class="w-[97%] lg:w-11/12 xl:w-3/4 pr-2 border-l-2 border-b-2 pl-2 pb-2 border-mainOrange text-justify text-sm md:text-base lg:text-lg xl:text-xl">
          Explore the world of interactive learning and entertainment with our
          innovative web application! Our project is more than just a collection
          of mini-games - it's a true fusion of artificial intelligence and
          entertainment. We have designed an application that not only provides
          great fun but also allows for data collection and strategy learning
          for artificial intelligence.
        </span>
      </div>
    </div>
    <div
      class="flex flex-row justify-between mt-10 pl-2 xs:pl-8 md:pl-16 bg-lightGray pt-10 pb-6 md:py-10">
      <div class="flex items-center justify-center pr-6 md:pr-2 lg:pr-0">
        <div
          class="h-20 2xs:h-24 xs:h-28 sm:h-36 md:h-52 lg:h-60 xl:h-64 w-44 2xs:w-52 xs:w-64 sm:w-80 md:w-[30rem] lg:w-[34rem] xl:w-[36rem] relative">
          <img
            ngSrc="images/ai.jpg"
            alt="Logo"
            class="object-contain rounded-full"
            fill />
        </div>
      </div>
      <div
        class="flex flex-col w-[55%] 2xs:w-2/5 items-start justify-center text-xs 2xs:text-sm xs:text-lg sm:text-2xl md:text-3xl lg:text-4xl space-y-1 md:space-y-5 text-mainOrange border-l-2 border-mainOrange font-mono p-2 md:p-4">
        <span>1 different games</span>
        <span>2 gameplays</span>
        <span>3 MB of data</span>
        <span>+4 players</span>
      </div>
    </div>
    <div class="flex w-full items-center justify-start bg-lightGray pb-10">
      <span
        id="animatedElement"
        class="transform transition-all duration-1000 flex w-full 2xs:w-[97%] xs:w-11/12 sm:w-4/5 md:w-2/3 lg:w-[63%] xl:w-[58%] 2xl:w-1/2 h-14 xs:h-20 text-justify items-center justify-center bg-mainOrange text-2xs 2xs:text-xs xs:text-sm sm:text-base lg:text-lg px-2 xs:px-4 sm:px-10 font-mono mt-0 2xs:mt-4 xs:mt-8 sm:mt-16">
        Don't wait any longer - join our community and start your adventure with
        interactive learning and entertainment today!
      </span>
    </div>
  </div>`,
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
