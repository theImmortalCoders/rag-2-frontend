/* eslint-disable max-lines */
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
import { Rag2LogoComponent } from '../shared/components/common/rag-2-logo.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NgOptimizedImage,
    AuthorCardsComponent,
    ShortGameStatsComponent,
    Rag2LogoComponent,
    RouterModule,
  ],
  template: `
    <div class="flex flex-col w-full bg-mainGray">
      <div
        class="bg-homeImageAI grayscale-0 opacity-30 bg-top bg-cover bg-no-repeat fixed z-0 top-0 left-0 h-full w-[100vw]"></div>
      <div
        class="flex flex-col justify-end pb-20 xl:pb-10 pt-6 xl:pt-14 relative min-h-all space-y-6 border-b-2 border-mainOrange ">
        <div class="hidden">RAG-2</div>
        <app-rag-2-logo
          class="h-56 2xs:h-64 sm:h-80 xl:h-96 w-56 2xs:w-72 sm:w-80 xl:w-96 absolute right-12 lg:right-5 bottom-96 2xs:bottom-80 lg:bottom-5"
          [isPriority]="true" />
        <h1
          class="max-w-[90vw] sm:max-w-[100vw] lg:max-w-[70vw] xl:max-w-[56vw] text-2xl xs:text-3xl lg:text-4xl xl:text-5xl w-[max-content] px-4 lg:pl-4 text-mainCreme font-mono">
          Rzeszów University of Technology Games for Artificial Intelligence 2.0
        </h1>
        <div
          id="animatedMenu"
          class="transform -translate-x-[22rem] opacity-0 transition-all duration-1000 bg-mainGray text-mainCreme font-mono gap-4 2xs:gap-5 xs:gap-12 lg:gap-20 xl:gap-28 2xl:gap-40 flex flex-row text-base 2xs:text-lg sm:text-xl xl:text-2xl py-5 px-8 sm:px-20 w-[100vw] lg:w-[60vw] xl:w-[70vw] justify-center">
          <a
            [routerLink]="['game-list']"
            aria-label="Game list page"
            class="hidden xs:block p-1 relative z-40 border-b-[1px] xs:border-b-2 border-mainOrange hover:border-green-500 ease-in-out transition-all duration-500">
            Play
          </a>
          <a
            href="#authors"
            class="p-1 relative z-40 border-b-[1px] xs:border-b-2 border-mainOrange hover:border-green-500 ease-in-out transition-all duration-500">
            Authors
          </a>
          <a
            [routerLink]="['documentation']"
            aria-label="Documentation page"
            class="p-1 relative z-40 border-b-[1px] xs:border-b-2 border-mainOrange hover:border-green-500 ease-in-out transition-all duration-500">
            Documentation
          </a>
          <a
            href="#stats"
            class="p-1 relative z-40 border-b-[1px] xs:border-b-2 border-mainOrange hover:border-green-500 ease-in-out transition-all duration-500">
            Stats
          </a>
        </div>
      </div>
      <div
        id="authors"
        class="pb-10 pt-6 xl:pt-14 relative min-h-[100vh] border-b-2 border-mainOrange">
        <div
          class="absolute top-0 left-0 w-full h-full bg-mainGray opacity-80"></div>
        <div
          class="flex flex-col mt-12 xs:mt-20 md:flex-row w-full h-max items-center justify-center md:justify-evenly text-mainCreme font-mono pb-6">
          <div
            class="flex flex-col mt-4 md:mt-16 pl-0 xs:pl-[22rem] sm:pl-64 md:pl-0 lg:pl-6 pr-0 md:pr-20 lg:pr-6 pb-8 md:pb-40 relative z-50">
            <h2
              id="animatedHeader"
              class="opacity-0 text-2xl 2xs:text-3xl lg:text-4xl xl:text-5xl h-9 xs:h-10 md:h-12 xl:h-16 relative w-[max-content] font-mono before:absolute before:inset-0 before:bg-mainCreme after:absolute after:inset-0 after:w-[0.125em] after:bg-black">
              Meet the authors:
            </h2>
            <div
              class="grid grid-cols-3 xs:grid-cols-6 md:grid-cols-3 gap-y-10 sm:gap-y-16 lg:flex lg:flex-row w-full gap-x-8 xs:gap-x-40 md:gap-x-5 lg:gap-x-12">
              @for (author of authors; track author.name) {
                <button
                  id="authorsButton"
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
                  }} border-2 border-mainOrange text-mainOrange text-wrap lg:text-nowrap ease-in-out transition-all duration-200 size-20 xs:size-24 md:size-20 lg:size-24 xl:size-28 bg-center bg-cover rounded-full pt-20 xs:pt-24 md:pt-20 lg:pt-24 xl:pt-28 mt-4 flex justify-center text-center text-sm xs:text-base">
                  <span class="pt-2">
                    {{ author.name }}
                  </span>
                </button>
              }
            </div>
          </div>
          <app-author-cards
            class="flex w-full pt-32 sm:pt-24 md:pt-0 md:w-1/3 lg:w-2/5 xl:w-1/3 items-center justify-center relative"
            [currentChoosenAuthor]="currentChoosenAuthor" />
        </div>
        <div
          class="flex flex-col w-full items-end justify-end text-mainCreme font-mono mt-20 xs:mt-16 sm:mt-12 md:mt-2 relative z-50">
          <h1
            class="w-[97%] lg:w-11/12 xl:w-3/4 text-xl 2xs:text-2xl lg:text-3xl xl:text-4xl font-mono mb-3 sm:mb-6">
            What's this all about?
          </h1>
          <span
            class="w-[97%] lg:w-11/12 xl:w-3/4 pr-2 border-l-2 border-b-2 pl-2 pb-2 border-mainOrange text-justify text-sm md:text-base lg:text-lg xl:text-xl">
            Jump into the world of artificial intelligence by making your own
            models for web minigames! Find innovative ways to steer the game and
            integrate them with our system using real-time data exchange
            delivered by websocket technology. Want to try out your skills
            against our AI? Choose one of our prebuilt models and see how you
            fare against them!
          </span>
        </div>
      </div>
      <div
        id="stats"
        class="flex flex-col xs:flex-row items-center justify-center xs:justify-around space-x-0 px-2 xs:px-8 md:px-16 bg-lightGray relative z-30 pt-10 pb-6 md:py-10 border-mainOrange border-b-2">
        <div class="flex items-center justify-center pr-3 md:pr-8 lg:pr-0">
          <div
            class="h-28 2xs:h-36 xs:h-28 sm:h-36 md:h-52 lg:h-60 xl:h-64 w-64 2xs:w-80 xs:w-64 sm:w-80 md:w-[26rem] lg:w-[30rem] xl:w-[36rem] relative">
            <img
              ngSrc="images/home/ai.jpg"
              alt="ai image"
              class="object-contain rounded-full"
              fill />
          </div>
        </div>
        <app-short-game-stats class="flex flex-col pt-8 xs:pt-0" />
      </div>
      <div class="flex w-full items-center justify-end bg-lightGray pb-10">
        <span
          id="animatedBottomText"
          class="transform transition-all duration-1000 opacity-95 flex w-full 2xs:w-11/12 sm:w-4/5 md:w-2/3 lg:w-[63%] xl:w-[58%] 2xl:w-1/2 h-20 text-justify items-center justify-center bg-mainOrange text-sm md:text-base lg:text-lg xl:text-xl px-2 xs:px-4 sm:px-10 font-mono mt-8 sm:mt-16">
          Play the games, collect data and build your own AI models that will
          defeat ours!
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
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observerBottomText = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(
            'sm:opacity-0',
            'sm:translate-x-[18rem]'
          );
        } else {
          entry.target.classList.add('sm:opacity-0', 'sm:translate-x-[18rem]');
        }
      });
    }, observerOptions);

    const elementBottomText = this._el.nativeElement.querySelector(
      '#animatedBottomText'
    );
    observerBottomText.observe(elementBottomText);

    const observerHeader = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0');
          entry.target.classList.add(
            'before:animate-typewriter17',
            'after:animate-caret17'
          );

          observerHeader.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elementHeader =
      this._el.nativeElement.querySelector('#animatedHeader');
    observerHeader.observe(elementHeader);
  }

  public ngAfterViewInit(): void {
    feather.replace();
    setTimeout(() => {
      document
        .querySelector('#animatedMenu')
        ?.classList.remove('-translate-x-[22rem]', 'opacity-0');
      document.querySelector('#animatedMenu')?.classList.add('opacity-80');
    }, 100);
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
